// =====================================================
// SilverRise - Complete Offline Social Gaming Platform
// =====================================================

const app = {
    currentPage: 'login',
    currentUser: null,
    users: {
        'user1': { id: 'user1', username: 'user1', password: 'pass123', avatar: '👾', coins: 5000, level: 15, banned: false },
        'user2': { id: 'user2', username: 'user2', password: 'pass123', avatar: '🎮', coins: 3000, level: 12, banned: false },
        'user3': { id: 'user3', username: 'user3', password: 'pass123', avatar: '🔥', coins: 8000, level: 25, banned: true, banReason: 'Inappropriate behavior', banTime: '2024-11-10' },
        'testuser': { id: 'testuser', username: 'testuser', password: 'test123', avatar: '🎭', coins: 10000, level: 30, banned: false },
    },
    skins: [
        { id: 1, name: 'Devil Red', emoji: '😈', price: 500, owned: false },
        { id: 2, name: 'Cyber Blue', emoji: '🤖', price: 750, owned: true },
        { id: 3, name: 'Fire Phoenix', emoji: '🔥', price: 1000, owned: false },
        { id: 4, name: 'Ice Princess', emoji: '❄️', price: 1200, owned: false },
        { id: 5, name: 'Neon Ghost', emoji: '👻', price: 600, owned: false },
        { id: 6, name: 'Dragon Lord', emoji: '🐉', price: 1500, owned: false },
        { id: 7, name: 'Cosmic Star', emoji: '⭐', price: 800, owned: false },
        { id: 8, name: 'Shadow Ninja', emoji: '🥷', price: 900, owned: true },
    ],
    rooms: [
        { id: 1, name: 'Neon Lounge', emoji: '🌃', users: 24, desc: 'The hottest hangout spot in the city' },
        { id: 2, name: 'Gaming Arena', emoji: '🎮', users: 18, desc: 'Competitive gaming tournaments' },
        { id: 3, name: 'Party Island', emoji: '🏝️', users: 42, desc: 'Non-stop party and fun' },
        { id: 4, name: 'Chill Zone', emoji: '🎵', users: 12, desc: 'Relaxing vibes and good music' },
        { id: 5, name: 'Fashion Runway', emoji: '👗', users: 15, desc: 'Show off your best outfits' },
        { id: 6, name: 'Club XYZ', emoji: '🍾', users: 33, desc: 'VIP experience and exclusive events' },
    ],
    friends: [
        { id: 'user2', username: 'user2', avatar: '🎮', online: true },
        { id: 'user3', username: 'user3', avatar: '🔥', online: false },
        { id: 'friend1', username: 'CoolDude', avatar: '😎', online: true },
        { id: 'friend2', username: 'NeonQueen', avatar: '👑', online: false },
        { id: 'friend3', username: 'SkyWalker', avatar: '🚀', online: true },
    ],
    messages: {
        'user2': [
            { from: 'user2', text: 'Hey! How\'s it going?', sent: false },
            { from: 'currentUser', text: 'All good! Just playing around', sent: true },
            { from: 'user2', text: 'Wanna join the party room?', sent: false },
            { from: 'currentUser', text: 'Sure! Let\'s go 🎉', sent: true },
        ],
        'friend1': [
            { from: 'friend1', text: 'Check out my new skin!', sent: false },
            { from: 'currentUser', text: 'Looks amazing! 🔥', sent: true },
        ]
    },

    init() {
        this.loadUser();
        this.render();
    },

    loadUser() {
        const saved = localStorage.getItem('silverrise_user');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            this.currentPage = 'home';
        }
    },

    saveUser() {
        if (this.currentUser) {
            localStorage.setItem('silverrise_user', JSON.stringify(this.currentUser));
        }
    },

    login(username, password) {
        const user = this.users[username];
        if (user && user.password === password) {
            this.currentUser = { ...user };
            this.saveUser();
            
            if (user.banned) {
                this.currentPage = 'banned';
            } else {
                this.currentPage = 'home';
            }
            this.render();
        } else {
            alert('Invalid username or password!');
        }
    },

    logout() {
        this.currentUser = null;
        this.currentPage = 'login';
        localStorage.removeItem('silverrise_user');
        this.render();
    },

    register(username, password) {
        if (this.users[username]) {
            alert('Username already exists!');
            return;
        }
        const newUser = {
            id: 'user_' + Date.now(),
            username,
            password,
            avatar: '🎮',
            coins: 1000,
            level: 1,
            banned: false
        };
        this.users[username] = newUser;
        this.login(username, password);
    },

    buySkin(skinId) {
        const skin = this.skins.find(s => s.id === skinId);
        if (!skin) return;

        if (skin.owned) {
            alert('You already own this skin!');
            return;
        }

        if (this.currentUser.coins < skin.price) {
            alert('Not enough coins!');
            return;
        }

        this.currentUser.coins -= skin.price;
        skin.owned = true;
        this.saveUser();
        this.render();
        alert('Skin purchased!');
    },

    sendMessage(recipientId, text) {
        if (!this.messages[recipientId]) {
            this.messages[recipientId] = [];
        }
        this.messages[recipientId].push({
            from: 'currentUser',
            text,
            sent: true
        });
        this.render();
    },

    goToPage(page) {
        this.currentPage = page;
        this.render();
    },

    render() {
        const app = document.getElementById('app');
        app.innerHTML = '';

        if (!this.currentUser) {
            app.appendChild(this.renderLogin());
        } else if (this.currentPage === 'banned') {
            app.appendChild(this.renderBanned());
        } else {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.height = '100vh';

            wrapper.appendChild(this.renderNavbar());

            const mainContainer = document.createElement('div');
            mainContainer.className = 'main-container';

            mainContainer.appendChild(this.renderSidebar());

            const content = document.createElement('div');
            content.className = 'content';
            content.appendChild(this.getPageContent());
            mainContainer.appendChild(content);

            wrapper.appendChild(mainContainer);
            app.appendChild(wrapper);
        }
    },

    renderNavbar() {
        const navbar = document.createElement('div');
        navbar.className = 'navbar';

        const logo = document.createElement('div');
        logo.className = 'navbar-logo';
        logo.textContent = '◆ SILVERRISE ◆';
        navbar.appendChild(logo);

        const menu = document.createElement('div');
        menu.className = 'navbar-menu';

        const pages = ['home', 'profile', 'chat', 'skins', 'rooms'];
        pages.forEach(page => {
            const btn = document.createElement('button');
            btn.className = 'navbar-btn';
            if (this.currentPage === page) btn.classList.add('active');
            btn.textContent = page.toUpperCase();
            btn.onclick = () => this.goToPage(page);
            menu.appendChild(btn);
        });

        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'navbar-btn';
        logoutBtn.textContent = 'LOGOUT';
        logoutBtn.onclick = () => this.logout();
        menu.appendChild(logoutBtn);

        navbar.appendChild(menu);
        return navbar;
    },

    renderSidebar() {
        const sidebar = document.createElement('div');
        sidebar.className = 'sidebar';

        const items = [
            { icon: '🏠', label: 'Home', page: 'home' },
            { icon: '👤', label: 'Profile', page: 'profile' },
            { icon: '💬', label: 'Chat', page: 'chat' },
            { icon: '👕', label: 'Skins', page: 'skins' },
            { icon: '🎮', label: 'Rooms', page: 'rooms' },
        ];

        items.forEach(item => {
            const sidebarItem = document.createElement('div');
            sidebarItem.className = 'sidebar-item';
            if (this.currentPage === item.page) sidebarItem.classList.add('active');
            sidebarItem.innerHTML = `<span class="sidebar-item-icon">${item.icon}</span><span>${item.label}</span>`;
            sidebarItem.onclick = () => this.goToPage(item.page);
            sidebar.appendChild(sidebarItem);
        });

        return sidebar;
    },

    renderLogin() {
        const container = document.createElement('div');
        container.className = 'login-container';

        const card = document.createElement('div');
        card.className = 'login-card';

        let isRegister = false;

        const title = document.createElement('div');
        title.className = 'login-title';
        title.textContent = 'SILVERRISE';
        card.appendChild(title);

        const subtitle = document.createElement('div');
        subtitle.className = 'login-subtitle';
        subtitle.textContent = 'Welcome to the ultimate social gaming platform';
        card.appendChild(subtitle);

        const usernameGroup = document.createElement('div');
        usernameGroup.className = 'form-group';
        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Username';
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.placeholder = 'Enter your username';
        usernameGroup.appendChild(usernameLabel);
        usernameGroup.appendChild(usernameInput);
        card.appendChild(usernameGroup);

        const passwordGroup = document.createElement('div');
        passwordGroup.className = 'form-group';
        const passwordLabel = document.createElement('label');
        passwordLabel.textContent = 'Password';
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Enter your password';
        passwordGroup.appendChild(passwordLabel);
        passwordGroup.appendChild(passwordInput);
        card.appendChild(passwordGroup);

        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn-primary';
        submitBtn.textContent = 'LOGIN';
        card.appendChild(submitBtn);

        const toggleText = document.createElement('div');
        toggleText.className = 'form-toggle';
        toggleText.innerHTML = 'Don\'t have an account? <a onclick="">REGISTER</a>';
        card.appendChild(toggleText);

        const toggleLink = toggleText.querySelector('a');
        toggleLink.onclick = (e) => {
            e.preventDefault();
            isRegister = !isRegister;
            if (isRegister) {
                submitBtn.textContent = 'REGISTER';
                toggleText.innerHTML = 'Already have an account? <a>LOGIN</a>';
                toggleLink.onclick = arguments.callee;
            } else {
                submitBtn.textContent = 'LOGIN';
                toggleText.innerHTML = 'Don\'t have an account? <a>REGISTER</a>';
                toggleLink.onclick = arguments.callee;
            }
        };

        submitBtn.onclick = () => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                alert('Please fill in all fields!');
                return;
            }

            if (isRegister) {
                this.register(username, password);
            } else {
                this.login(username, password);
            }
        };

        passwordInput.onkeypress = (e) => {
            if (e.key === 'Enter') submitBtn.click();
        };

        container.appendChild(card);
        return container;
    },

    renderBanned() {
        const container = document.createElement('div');
        container.className = 'ban-container';

        const card = document.createElement('div');
        card.className = 'ban-card';

        const icon = document.createElement('div');
        icon.className = 'ban-icon';
        icon.innerHTML = '⛔';
        card.appendChild(icon);

        const title = document.createElement('div');
        title.className = 'ban-title';
        title.textContent = 'YOU HAVE BEEN BANNED';
        card.appendChild(title);

        const message = document.createElement('div');
        message.className = 'ban-message';
        message.textContent = 'Your account has been permanently suspended from SilverRise.';
        card.appendChild(message);

        const reason = document.createElement('div');
        reason.className = 'ban-reason';
        reason.innerHTML = `<strong>Reason:</strong> ${this.currentUser.banReason || 'Violation of community guidelines'}`;
        card.appendChild(reason);

        const timer = document.createElement('div');
        timer.className = 'ban-timer';
        timer.textContent = `Ban expires: ${this.currentUser.banTime || 'Permanent'}`;
        card.appendChild(timer);

        const message2 = document.createElement('div');
        message2.className = 'ban-message';
        message2.innerHTML = 'Our safety team enforces our <strong>Guidelines</strong> through automation and manual reviews. If you would like us to take another look at your ban, please <strong>Contact Us</strong>.';
        card.appendChild(message2);

        const btn = document.createElement('button');
        btn.className = 'btn-secondary';
        btn.textContent = 'OKAY';
        btn.onclick = () => this.logout();
        card.appendChild(btn);

        container.appendChild(card);
        return container;
    },

    getPageContent() {
        switch (this.currentPage) {
            case 'home':
                return this.renderHome();
            case 'profile':
                return this.renderProfile();
            case 'chat':
                return this.renderChat();
            case 'skins':
                return this.renderSkins();
            case 'rooms':
                return this.renderRooms();
            default:
                return this.renderHome();
        }
    },

    renderHome() {
        const container = document.createElement('div');

        const title = document.createElement('h1');
        title.style.marginBottom = '2rem';
        title.style.fontSize = '2.5rem';
        title.style.background = 'linear-gradient(90deg, #ff1493 0%, #00ff88 100%)';
        title.style.webkitBackgroundClip = 'text';
        title.style.webkitTextFillColor = 'transparent';
        title.textContent = 'Welcome to SilverRise, ' + this.currentUser.username + '!';
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'home-grid';

        const cards = [
            {
                title: '🎮 PLAY NOW',
                text: 'Join thousands of players in our amazing social gaming platform. Connect with friends, explore rooms, and have fun!'
            },
            {
                title: '👥 MAKE FRIENDS',
                text: 'Chat with players from around the world. Find your squad and build lasting friendships in our community.'
            },
            {
                title: '👕 CUSTOMIZE YOUR LOOK',
                text: 'Unlock and collect unique skins to express your style. Show off your personality with thousands of options.'
            },
            {
                title: '🏆 EARN REWARDS',
                text: 'Complete challenges, participate in events, and earn coins to unlock exclusive items and rewards.'
            }
        ];

        cards.forEach(cardData => {
            const card = document.createElement('div');
            card.className = 'card';
            const cardTitle = document.createElement('div');
            cardTitle.className = 'card-title';
            cardTitle.textContent = cardData.title;
            const cardText = document.createElement('div');
            cardText.className = 'card-text';
            cardText.textContent = cardData.text;
            card.appendChild(cardTitle);
            card.appendChild(cardText);
            grid.appendChild(card);
        });

        container.appendChild(grid);
        return container;
    },

    renderProfile() {
        const container = document.createElement('div');

        const header = document.createElement('div');
        header.className = 'profile-header';

        const avatar = document.createElement('div');
        avatar.className = 'profile-avatar';
        avatar.textContent = this.currentUser.avatar;
        header.appendChild(avatar);

        const info = document.createElement('div');
        info.className = 'profile-info';
        info.innerHTML = `
            <h1>${this.currentUser.username}</h1>
            <p>Level ${this.currentUser.level} Player</p>
            <div class="profile-stats">
                <div class="stat">
                    <div class="stat-value">${this.currentUser.coins}</div>
                    <div class="stat-label">Coins</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${this.currentUser.level}</div>
                    <div class="stat-label">Level</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${this.friends.filter(f => f.online).length}</div>
                    <div class="stat-label">Friends Online</div>
                </div>
            </div>
        `;
        header.appendChild(info);
        container.appendChild(header);

        const sectionTitle = document.createElement('h2');
        sectionTitle.style.marginTop = '2rem';
        sectionTitle.style.marginBottom = '1rem';
        sectionTitle.style.color = '#ff1493';
        sectionTitle.textContent = 'Owned Skins';
        container.appendChild(sectionTitle);

        const ownedSkins = this.skins.filter(s => s.owned);
        const skinsContainer = document.createElement('div');
        skinsContainer.style.display = 'grid';
        skinsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
        skinsContainer.style.gap = '1.5rem';

        ownedSkins.forEach(skin => {
            const skinCard = document.createElement('div');
            skinCard.style.background = 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(20, 20, 40, 0.8) 100%)';
            skinCard.style.border = '2px solid var(--border)';
            skinCard.style.borderRadius = '12px';
            skinCard.style.padding = '1rem';
            skinCard.style.textAlign = 'center';
            skinCard.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">${skin.emoji}</div>
                <div style="color: #ff1493; font-weight: bold;">${skin.name}</div>
            `;
            skinsContainer.appendChild(skinCard);
        });

        container.appendChild(skinsContainer);
        return container;
    },

    renderChat() {
        const container = document.createElement('div');
        container.className = 'chat-container';

        // Friends List
        const friendsList = document.createElement('div');
        friendsList.className = 'friends-list';
        const friendsTitle = document.createElement('h3');
        friendsTitle.style.marginBottom = '1rem';
        friendsTitle.style.color = '#00ff88';
        friendsTitle.textContent = 'FRIENDS';
        friendsList.appendChild(friendsTitle);

        this.friends.forEach(friend => {
            const friendItem = document.createElement('div');
            friendItem.className = 'friend-item';
            friendItem.onclick = () => this.selectChatFriend(friend.id);
            const avatar = document.createElement('div');
            avatar.className = 'friend-avatar';
            avatar.textContent = friend.avatar;
            const name = document.createElement('div');
            name.className = 'friend-name';
            name.textContent = friend.username;
            const status = document.createElement('div');
            status.className = 'friend-status' + (friend.online ? '' : ' offline');
            friendItem.appendChild(avatar);
            friendItem.appendChild(name);
            friendItem.appendChild(status);
            friendsList.appendChild(friendItem);
        });

        container.appendChild(friendsList);

        // Chat Window
        const chatMain = document.createElement('div');
        chatMain.className = 'chat-main';

        const firstFriend = this.friends[0];
        const selectedFriend = firstFriend;

        // Chat Header
        const chatHeader = document.createElement('div');
        chatHeader.className = 'chat-header';
        const avatar = document.createElement('div');
        avatar.className = 'friend-avatar';
        avatar.textContent = selectedFriend.avatar;
        const headerUser = document.createElement('div');
        headerUser.className = 'chat-header-user';
        const headerName = document.createElement('div');
        headerName.className = 'chat-header-name';
        headerName.textContent = selectedFriend.username;
        const headerStatus = document.createElement('div');
        headerStatus.style.color = 'var(--text-secondary)';
        headerStatus.style.fontSize = '0.8rem';
        headerStatus.textContent = selectedFriend.online ? '🟢 Online' : '🔴 Offline';
        headerUser.appendChild(headerName);
        headerUser.appendChild(headerStatus);
        chatHeader.appendChild(avatar);
        chatHeader.appendChild(headerUser);
        chatMain.appendChild(chatHeader);

        // Chat Messages
        const messagesDiv = document.createElement('div');
        messagesDiv.className = 'chat-messages';
        messagesDiv.id = 'chat-messages';

        const messages = this.messages[selectedFriend.id] || [];
        messages.forEach(msg => {
            const messageEl = document.createElement('div');
            messageEl.className = 'message' + (msg.sent ? ' sent' : ' received');
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.textContent = msg.text;
            messageEl.appendChild(bubble);
            messagesDiv.appendChild(messageEl);
        });

        chatMain.appendChild(messagesDiv);

        // Chat Input
        const chatInput = document.createElement('div');
        chatInput.className = 'chat-input';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type a message...';
        const sendBtn = document.createElement('button');
        sendBtn.textContent = 'SEND';
        sendBtn.onclick = () => {
            if (input.value.trim()) {
                this.sendMessage(selectedFriend.id, input.value);
                input.value = '';
            }
        };
        input.onkeypress = (e) => {
            if (e.key === 'Enter') sendBtn.click();
        };
        chatInput.appendChild(input);
        chatInput.appendChild(sendBtn);
        chatMain.appendChild(chatInput);

        container.appendChild(chatMain);
        return container;
    },

    selectChatFriend(friendId) {
        this.render();
    },

    renderSkins() {
        const container = document.createElement('div');

        const title = document.createElement('h1');
        title.style.marginBottom = '2rem';
        title.style.color = '#ff1493';
        title.textContent = 'SKINS SHOP';
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'skins-grid';

        this.skins.forEach(skin => {
            const card = document.createElement('div');
            card.className = 'skin-card';

            const image = document.createElement('div');
            image.className = 'skin-image';
            image.textContent = skin.emoji;

            const info = document.createElement('div');
            info.className = 'skin-info';
            const name = document.createElement('div');
            name.className = 'skin-name';
            name.textContent = skin.name;
            const price = document.createElement('div');
            price.className = 'skin-price';
            price.textContent = '💰 ' + skin.price + ' coins';
            const btn = document.createElement('button');
            btn.className = 'btn-skin' + (skin.owned ? ' owned' : '');
            btn.textContent = skin.owned ? 'OWNED' : 'BUY';
            btn.disabled = skin.owned;
            btn.onclick = () => {
                if (!skin.owned) {
                    this.buySkin(skin.id);
                }
            };

            info.appendChild(name);
            info.appendChild(price);
            info.appendChild(btn);
            card.appendChild(image);
            card.appendChild(info);
            grid.appendChild(card);
        });

        container.appendChild(grid);
        return container;
    },

    renderRooms() {
        const container = document.createElement('div');

        const title = document.createElement('h1');
        title.style.marginBottom = '2rem';
        title.style.color = '#00ff88';
        title.textContent = 'LIVE ROOMS';
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'rooms-grid';

        this.rooms.forEach(room => {
            const card = document.createElement('div');
            card.className = 'room-card';

            const thumbnail = document.createElement('div');
            thumbnail.className = 'room-thumbnail';
            thumbnail.textContent = room.emoji;

            const details = document.createElement('div');
            details.className = 'room-details';
            const name = document.createElement('div');
            name.className = 'room-name';
            name.textContent = room.name;
            const users = document.createElement('div');
            users.className = 'room-users';
            users.innerHTML = `👥 ${room.users} players online`;
            const desc = document.createElement('div');
            desc.className = 'room-desc';
            desc.textContent = room.desc;

            details.appendChild(name);
            details.appendChild(users);
            details.appendChild(desc);
            card.appendChild(thumbnail);
            card.appendChild(details);
            grid.appendChild(card);
        });

        container.appendChild(grid);
        return container;
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});