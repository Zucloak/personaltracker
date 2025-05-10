document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements (largely same, ensure all are captured)
    const goldAmountEl = document.getElementById('gold-amount');
    const currentLevelHeaderEl = document.getElementById('current-level-header');
    const playerLevelEl = document.getElementById('player-level');
    const currentXpEl = document.getElementById('current-xp');
    const xpToNextLevelEl = document.getElementById('xp-to-next-level');
    const playerXpBarEl = document.getElementById('player-xp-bar');
    const levelUpMessageEl = document.getElementById('level-up-message');

    const questListEl = document.getElementById('quest-list');
    const habitGridEl = document.getElementById('habit-grid');
    const themeOptionsGridEl = document.getElementById('theme-options-grid');
    const achievementsLogUlEl = document.querySelector('#achievements-log ul');

    // Modals & Buttons
    const addQuestModalBtn = document.getElementById('add-quest-modal-btn');
    const addQuestModal = document.getElementById('add-quest-modal');
    const closeQuestModalBtn = document.getElementById('close-quest-modal');
    const submitQuestBtn = document.getElementById('submit-quest-btn');
    const questNameInput = document.getElementById('quest-name-input');
    const questDescInput = document.getElementById('quest-desc-input');
    const questGoldInput = document.getElementById('quest-gold-input');
    const questXpInput = document.getElementById('quest-xp-input');
    const questPriorityInput = document.getElementById('quest-priority-input');

    const addHabitModalBtn = document.getElementById('add-habit-modal-btn');
    const addHabitModal = document.getElementById('add-habit-modal');
    const closeHabitModalBtn = document.getElementById('close-habit-modal');
    const submitHabitBtn = document.getElementById('submit-habit-btn');
    const habitNameInput = document.getElementById('habit-name-input');
    const habitIconInput = document.getElementById('habit-icon-input');
    const habitTargetInput = document.getElementById('habit-target-input');

    const resetDataBtn = document.getElementById('reset-data-btn');

    // Navbar toggle
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    const topNavigation = document.getElementById('top-navigation');

    // Player Data Structure (same as before)
    let playerData = {
        gold: 0, level: 1, xp: 0,
        quests: [], habits: [], achievements: [],
        unlockedThemes: ['default-dark'], currentTheme: 'default-dark',
        nextQuestId: 1, nextHabitId: 1,
        xpLevels: [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5500, 7000, 9000, 12000, 15000],
        settings: { soundEffects: true } // Added sound setting
    };

    // Themes Configuration (largely same, ensure icon paths are placeholders or actual URLs)
    const themes = {
        'default-dark': {
            name: 'ShadowScribe (Default)',
            icon: 'https://example.com/themes/default_icon.png', // REPLACE
            unlockLevel: 1,
            cssVariables: { /* ... CSS vars from previous style.css or new ones ... */
                '--bg-dark': '#0a0807', '--bg-section': '#1c1815', '--bg-element': '#2a2520',
                '--bg-header': 'rgba(10, 8, 7, 0.85)', '--text-light': '#f0e8e0',
                '--text-medium': '#c8b8a8', '--text-title': 'var(--color-gold)',
                '--color-gold': '#FFD700', '--color-gold-darker': '#b8860b',
                '--color-gold-faded': '#c0a040', '--color-yellow-bright': '#FFFF66',
                '--color-red-primary': '#cc0000', '--color-red-accent': '#800000',
                '--border-color': '#5a4838', '--border-accent': 'var(--color-gold)',
                '--xp-bar-bg': 'linear-gradient(90deg, var(--color-yellow-bright), var(--color-gold))',
                '--xp-bar-container-bg': '#33281f',
                '--button-primary-bg': 'var(--color-red-primary)',
                '--button-primary-border': 'var(--color-red-accent)',
                '--button-primary-hover-bg': 'var(--color-red-accent)',
                '--button-primary-hover-border': 'var(--color-red-primary)',
                '--button-add-bg': 'var(--color-gold)',
                '--button-add-text': '#3d2800',
                '--button-add-border': 'var(--color-gold-darker)',
                '--button-add-hover-bg': 'var(--color-yellow-bright)',
                '--button-add-hover-border': 'var(--color-gold)',
            },
            previewStyle: "background: linear-gradient(135deg, #1c1815 0%, #2a2520 100%); border-color: #FFD700;"
        },
        'inferno-herald': { // Keep other themes, update icons and preview styles
            name: 'Inferno Herald',
            icon: 'https://example.com/themes/inferno_icon.png', // REPLACE
            unlockLevel: 5,
            unlockAchievement: 'level_5',
            cssVariables: {
                '--bg-dark': '#1A0000', '--bg-section': '#3D0000', '--bg-element': '#5A0000',
                '--bg-header': 'rgba(26,0,0,0.85)', '--text-light': '#FFBFBF',
                '--text-medium': '#FF8F8F', '--text-title': '#FFD700',
                '--color-gold': '#FFD700', '--color-gold-darker': '#b8860b',
                '--color-gold-faded': '#c0a040', '--color-yellow-bright': '#FFA500',
                '--color-red-primary': '#FF4500', '--color-red-accent': '#DC143C',
                '--border-color': '#8B0000', '--border-accent': '#FF8C00',
                '--xp-bar-bg': 'linear-gradient(90deg, #FFA500, #FF4500)',
                '--xp-bar-container-bg': '#400d0d',
                 '--button-primary-bg': '#FF4500', '--button-primary-border': '#DC143C',
                '--button-primary-hover-bg': '#DC143C', '--button-primary-hover-border': '#FF4500',
                '--button-add-bg': '#FFD700', '--button-add-text': '#3D0000',
                '--button-add-border': '#DAA520', '--button-add-hover-bg': '#DAA520',
                '--button-add-hover-border': '#B8860B',
            },
            previewStyle: "background: linear-gradient(135deg, #3D0000 0%, #5A0000 100%); border-color: #FF8C00;"
        },
         'mystic-depths': {
            name: 'Mystic Depths',
            icon: 'https://example.com/themes/mystic_icon.png', // REPLACE
            unlockLevel: 10,
            cssVariables: {
                '--bg-dark': '#011322', '--bg-section': '#0B2A40', '--bg-element': '#1A4A6A',
                '--bg-header': 'rgba(1,19,34,0.85)', '--text-light': '#C0D8E8',
                '--text-medium': '#87A8B8', '--text-title': '#AFEEEE',
                '--color-gold': '#AFEEEE', '--color-gold-darker': '#7AC5CD', /* CadetBlue variant */
                '--color-gold-faded': '#87CEEB', /* SkyBlue variant */
                '--color-yellow-bright': '#7FFFD4',
                '--color-red-primary': '#48D1CC', '--color-red-accent': '#20B2AA',
                '--border-color': '#1E5A8A', '--border-accent': '#AFEEEE',
                '--xp-bar-bg': 'linear-gradient(90deg, #7FFFD4, #AFEEEE)',
                '--xp-bar-container-bg': '#032030',
                '--button-primary-bg': '#48D1CC', '--button-primary-border': '#20B2AA',
                '--button-primary-hover-bg': '#20B2AA', '--button-primary-hover-border': '#48D1CC',
                '--button-add-bg': '#AFEEEE', '--button-add-text': '#011322',
                '--button-add-border': '#87CEEB', '--button-add-hover-bg': '#87CEEB',
                '--button-add-hover-border': '#6CA6CD',
            },
            previewStyle: "background: linear-gradient(135deg, #0B2A40 0%, #1A4A6A 100%); border-color: #AFEEEE;"
        }
    };

    // Achievements Configuration (same as before, ensure icon paths are placeholders or actual URLs)
    const ALL_ACHIEVEMENTS = [
        { id: 'first_quest', name: 'First Blood!', desc: 'Complete your first quest.', icon: 'https://example.com/achievements/trophy.png', unlocked: false, condition: () => playerData.quests.some(q => q.completed) },
        { id: 'gold_100', name: 'Coin Collector', desc: 'Amass 100 Gold.', icon: 'https://example.com/achievements/gold_pile.png', unlocked: false, condition: () => playerData.gold >= 100 },
        { id: 'level_5', name: 'Seasoned Adventurer', desc: 'Reach Level 5.', icon: 'https://example.com/achievements/star_rank.png', unlocked: false, condition: () => playerData.level >= 5 },
        { id: 'level_10', name: 'Hero of Renown', desc: 'Reach Level 10.', icon: 'https://example.com/achievements/star_rank_epic.png', unlocked: false, condition: () => playerData.level >= 10 },
        { id: 'habit_streak_7', name: 'Consistent Cultivator', desc: 'Maintain a 7-day streak.', icon: 'https://example.com/achievements/green_leaf.png', unlocked: false, condition: () => playerData.habits.some(h => h.streak >= 7) },
        { id: 'all_themes_unlocked', name: 'Master Stylist', desc: 'Unlock all themes.', icon: 'https://example.com/achievements/palette.png', unlocked: false, condition: () => Object.keys(themes).every(themeId => playerData.unlockedThemes.includes(themeId)) },
        { id: 'five_quests_done', name: 'Task Master', desc: 'Complete 5 quests.', icon: 'https://example.com/achievements/scroll_multiple.png', unlocked: false, condition: () => playerData.quests.filter(q => q.completed).length >= 5 },
    ];

    // --- SOUND FUNCTION ---
    function playSound(soundId) {
        if (!playerData.settings.soundEffects) return;
        try {
            const soundElement = document.getElementById(soundId);
            if (soundElement) {
                soundElement.currentTime = 0; // Rewind to start
                soundElement.play().catch(error => console.warn("Sound play interrupted or failed:", error));
            } else {
                console.warn(`Sound element with ID '${soundId}' not found.`);
            }
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    }

    // --- DATA HANDLING --- (loadData, saveData, resetData largely same)
    function loadData() {
        const savedData = localStorage.getItem('heroChronicleData'); // Updated key slightly
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            playerData = { ...playerData, ...parsedData, settings: { ...playerData.settings, ...parsedData.settings } };
            if (parsedData.achievements && Array.isArray(parsedData.achievements)) {
                playerData.achievements = ALL_ACHIEVEMENTS.map(defaultAch => {
                    const savedAch = parsedData.achievements.find(sa => sa.id === defaultAch.id);
                    return savedAch ? { ...defaultAch, ...savedAch } : { ...defaultAch }; // Ensure all props from default
                });
            } else {
                 playerData.achievements = JSON.parse(JSON.stringify(ALL_ACHIEVEMENTS));
            }
        } else {
            playerData.achievements = JSON.parse(JSON.stringify(ALL_ACHIEVEMENTS));
        }
        playerData.xpLevels = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5500, 7000, 9000, 12000, 15000];
        applyTheme(playerData.currentTheme, true);
        updateHabitProgressForOfflineDays();
    }

    function saveData() {
        localStorage.setItem('heroChronicleData', JSON.stringify(playerData));
    }

    function resetData() {
        if (confirm("Are you sure you want to reset ALL your progress? This cannot be undone!")) {
            playSound('sound-click'); // Generic click for confirm
            localStorage.removeItem('heroChronicleData');
            playerData = {
                gold: 0, level: 1, xp: 0, quests: [], habits: [],
                achievements: JSON.parse(JSON.stringify(ALL_ACHIEVEMENTS)),
                unlockedThemes: ['default-dark'], currentTheme: 'default-dark',
                nextQuestId: 1, nextHabitId: 1,
                xpLevels: [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5500, 7000, 9000, 12000, 15000],
                settings: { soundEffects: true }
            };
            applyTheme(playerData.currentTheme, true);
            renderAll();
            saveData();
            // No location.reload() here unless absolutely necessary, can cause issues with sound playback before reload.
        }
    }
    resetDataBtn.addEventListener('click', resetData);

    // --- RENDERING FUNCTIONS --- (Minor updates for icon handling and styling)
    function renderAll() {
        renderPlayerStats();
        renderQuests();
        renderHabits();
        renderThemes();
        renderAchievements();
        checkAndUnlockAchievements();
    }

    function renderPlayerStats() { /* Mostly same, ensure IDs match */
        goldAmountEl.textContent = playerData.gold;
        currentLevelHeaderEl.textContent = playerData.level;
        playerLevelEl.textContent = playerData.level;
        currentXpEl.textContent = playerData.xp;
        const xpForNext = playerData.xpLevels[playerData.level] || playerData.xpLevels[playerData.xpLevels.length -1];
        xpToNextLevelEl.textContent = xpForNext;
        const progressPercentage = playerData.level >= playerData.xpLevels.length ? 100 : Math.min((playerData.xp / xpForNext) * 100, 100);
        playerXpBarEl.style.width = `${progressPercentage}%`;
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }

    function renderQuests() { /* Same logic, CSS handles new appearance */
        questListEl.innerHTML = '';
        if (playerData.quests.length === 0) {
            questListEl.innerHTML = '<p class="empty-state">No active quests. Time to forge some!</p>';
            return;
        }
        const sortedQuests = [...playerData.quests].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            if (a.priority !== b.priority) return a.priority ? -1 : 1;
            return new Date(b.dateAdded) - new Date(a.dateAdded);
        });

        sortedQuests.forEach(quest => {
            const questItem = document.createElement('div');
            questItem.className = `quest-item ${quest.priority ? 'priority-quest' : ''} ${quest.completed ? 'completed-quest' : ''}`;
            questItem.dataset.id = quest.id;

            questItem.innerHTML = `
                <div class="quest-details">
                    <h3 class="quest-name">${quest.name}</h3>
                    <p class="quest-desc">${quest.desc}</p>
                    <p class="quest-reward">Reward: <span class="gold-text">${quest.rewardGold} Gold</span>, ${quest.rewardXp} XP</p>
                </div>
                <button class="action-button complete-button" ${quest.completed ? 'disabled' : ''}>
                    ${quest.completed ? 'Claimed' : 'Claim Reward'}
                </button>
            `;
            if (!quest.completed) {
                questItem.querySelector('.complete-button').addEventListener('click', () => {
                    playSound('sound-click');
                    completeQuest(quest.id);
                });
            }
            questListEl.appendChild(questItem);
        });
    }

    function renderHabits() { /* Habit icon can now be a full URL or local path */
        habitGridEl.innerHTML = '';
        if (playerData.habits.length === 0) {
            habitGridEl.innerHTML = '<p class="empty-state">No habits being cultivated. Start a new ritual!</p>';
            return;
        }
        const sortedHabits = [...playerData.habits].sort((a,b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        sortedHabits.forEach(habit => {
            const habitCard = document.createElement('div');
            habitCard.classList.add('habit-card');
            habitCard.dataset.id = habit.id;
            const progressPercent = Math.min((habit.progress / habit.target) * 100, 100);
            const isMaxedOut = habit.progress >= habit.target;
            // Determine if icon is full URL or local path
            const iconSrc = habit.icon.startsWith('http') ? habit.icon : `images/${habit.icon}`;

            habitCard.innerHTML = `
                <img src="${iconSrc}" alt="${habit.name}" class="habit-item-icon" onerror="this.onerror=null;this.src='https://example.com/fallback-gem-icon.png';"> <h4 class="habit-title">${habit.name}</h4>
                <div class="item-progress-bar-container">
                    <div class="item-progress-bar ${isMaxedOut ? 'completed' : ''}" style="width: ${progressPercent}%;"></div>
                </div>
                <p class="habit-target-display">Today: ${habit.progress} / ${habit.target}</p>
                <p class="habit-status">Streak: ${habit.streak} Days</p>
                <button class="action-button track-button ${isMaxedOut ? 'maxed-out' : ''}" ${isMaxedOut ? 'disabled' : ''}>
                    ${isMaxedOut ? 'Completed Today' : 'Track Once'}
                </button>
            `;
            if (!isMaxedOut) {
                habitCard.querySelector('.track-button').addEventListener('click', () => {
                    playSound('sound-click');
                    trackHabit(habit.id);
                });
            }
            habitGridEl.appendChild(habitCard);
        });
    }

    function renderThemes() { /* Use theme.icon for preview if available, else just style */
        themeOptionsGridEl.innerHTML = '';
        Object.keys(themes).forEach(themeId => {
            const theme = themes[themeId];
            const themeCard = document.createElement('div');
            themeCard.className = 'theme-card';
            themeCard.dataset.themeId = themeId;

            const isUnlocked = playerData.unlockedThemes.includes(themeId) || playerData.level >= theme.unlockLevel || (theme.unlockAchievement && playerData.achievements.find(a => a.id === theme.unlockAchievement && a.unlocked));

            if (playerData.currentTheme === themeId) themeCard.classList.add('current-theme');
            if (!isUnlocked) themeCard.classList.add('locked-theme');

            let unlockCriteria = `Unlock at Level ${theme.unlockLevel}`;
            if (theme.unlockAchievement) {
                const ach = ALL_ACHIEVEMENTS.find(a => a.id === theme.unlockAchievement); // Use ALL_ACHIEVEMENTS for name
                if (ach) unlockCriteria += ` or by "${ach.name}"`;
            }

            themeCard.innerHTML = `
                <div class="theme-preview" style="${theme.previewStyle || ''}">
                    ${theme.icon ? `<img src="${theme.icon}" alt="${theme.name} Preview" style="max-width:80%; max-height:80%; opacity:0.7; object-fit:contain;">` : ''}
                </div>
                <p>${theme.name}</p>
                <span class="theme-status">
                    ${playerData.currentTheme === themeId ? 'Active' : (isUnlocked ? 'Unlocked' : `${unlockCriteria} 🔒`)}
                </span>
            `;
            if (isUnlocked) {
                themeCard.addEventListener('click', () => {
                    playSound('sound-click');
                    applyTheme(themeId);
                });
            }
            themeOptionsGridEl.appendChild(themeCard);
        });
    }

    function renderAchievements() { /* Use achievement.icon */
        achievementsLogUlEl.innerHTML = '';
        const sortedAchievements = [...playerData.achievements].sort((a, b) => {
            if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
            return 0;
        });
        if (sortedAchievements.length === 0) { // Should not happen if ALL_ACHIEVEMENTS is used
             achievementsLogUlEl.innerHTML = '<p class="empty-state">No feats defined yet.</p>'; return;
        }
        sortedAchievements.forEach(ach => {
            const li = document.createElement('li');
            li.classList.toggle('unlocked', ach.unlocked);
            const iconSrcAch = ach.icon.startsWith('http') ? ach.icon : `images/${ach.icon}`; // Allows full URLs for achievement icons too
            li.innerHTML = `<img src="${iconSrcAch}" alt="Feat" class="icon-tiny" onerror="this.onerror=null;this.src='https://example.com/fallback-star-icon.png';"> ${ach.name} - <span class="ach-desc">${ach.desc}</span>`; //REPLACE fallback
            achievementsLogUlEl.appendChild(li);
        });
    }

    // --- GAME LOGIC --- (Sound effects added)
    function addGold(amount) {
        playerData.gold += amount;
        if (amount > 0) playSound('sound-gold-gain');
    }

    function addXp(amount) {
        playerData.xp += amount;
        levelUpMessageEl.textContent = '';
        let leveledUpThisCall = false;
        while (playerData.level < playerData.xpLevels.length && playerData.xp >= playerData.xpLevels[playerData.level]) {
            playerData.xp -= playerData.xpLevels[playerData.level];
            playerData.level++;
            leveledUpThisCall = true;
            levelUpMessageEl.textContent = `Level Up! Reached Level ${playerData.level}!`;
            setTimeout(() => { if (levelUpMessageEl.textContent.includes(`Level ${playerData.level}`)) levelUpMessageEl.textContent = ''; }, 5000);
            checkThemeUnlocks();
        }
        if (playerData.level >= playerData.xpLevels.length && playerData.xp > playerData.xpLevels[playerData.xpLevels.length -1]) {
            playerData.xp = playerData.xpLevels[playerData.xpLevels.length -1];
        }
        if(leveledUpThisCall) playSound('sound-level-up');
    }

    function checkThemeUnlocks() { /* Same logic */
        Object.keys(themes).forEach(themeId => {
            const theme = themes[themeId];
            if (!playerData.unlockedThemes.includes(themeId)) {
                const levelUnlock = playerData.level >= theme.unlockLevel;
                const achUnlock = theme.unlockAchievement && playerData.achievements.find(a => a.id === theme.unlockAchievement && a.unlocked);
                if (levelUnlock || achUnlock) {
                    playerData.unlockedThemes.push(themeId);
                    // Optional: specific unlock sound/notification for themes
                }
            }
        });
    }

    function applyTheme(themeId, isInitialLoad = false) { /* Same logic */
        const theme = themes[themeId];
        if (!theme) return;
        if (!playerData.unlockedThemes.includes(themeId) && !isInitialLoad) {
            const canUnlockNow = playerData.level >= theme.unlockLevel || (theme.unlockAchievement && playerData.achievements.find(a => a.id === theme.unlockAchievement && a.unlocked));
            if(canUnlockNow && !playerData.unlockedThemes.includes(themeId)) {
                playerData.unlockedThemes.push(themeId);
            } else if (!canUnlockNow) {
                 console.warn(`Theme ${themeId} is locked.`); return;
            }
        }
        Object.keys(theme.cssVariables).forEach(variable => {
            document.documentElement.style.setProperty(variable, theme.cssVariables[variable]);
        });
        playerData.currentTheme = themeId;
        if (!isInitialLoad) {
            saveData();
            renderThemes();
        }
    }

    // --- QUESTS --- (Sound effects added)
    function openQuestModal() { addQuestModal.style.display = 'block'; playSound('sound-modal-open'); }
    function closeQuestModal() { addQuestModal.style.display = 'none'; /* reset fields */ }
    addQuestModalBtn.addEventListener('click', () => { playSound('sound-click'); openQuestModal(); });
    closeQuestModalBtn.addEventListener('click', () => { playSound('sound-click'); closeQuestModal(); });
    submitQuestBtn.addEventListener('click', () => {
        // ... (validation logic)
        playSound('sound-click');
        // ... (add quest logic)
        playerData.quests.push({ /* ... quest object ... */ dateAdded: new Date().toISOString() });
        closeQuestModal(); renderAll(); saveData();
    });
    function completeQuest(questId) {
        const quest = playerData.quests.find(q => q.id === questId);
        if (quest && !quest.completed) {
            quest.completed = true;
            addGold(quest.rewardGold); // Sound is in addGold
            addXp(quest.rewardXp);    // Sound is in addXp (if level up)
            playSound('sound-quest-complete');
            renderAll(); saveData();
        }
    }

    // --- HABITS --- (Sound effects added)
    function openHabitModal() { addHabitModal.style.display = 'block'; playSound('sound-modal-open'); }
    function closeHabitModal() { addHabitModal.style.display = 'none'; /* reset fields */ }
    addHabitModalBtn.addEventListener('click', () => { playSound('sound-click'); openHabitModal(); });
    closeHabitModalBtn.addEventListener('click', () => { playSound('sound-click'); closeHabitModal(); });
    submitHabitBtn.addEventListener('click', () => {
        // ... (validation logic)
        playSound('sound-click');
        // ... (add habit logic)
        playerData.habits.push({ /* ... habit object ... */ dateAdded: new Date().toISOString() });
        closeHabitModal(); renderAll(); saveData();
    });
    function trackHabit(habitId) {
        const habit = playerData.habits.find(h => h.id === habitId);
        if (habit && habit.progress < habit.target) {
            habit.progress++;
            const today = new Date().toDateString();
            if (habit.progress >= habit.target) {
                // ... (streak logic)
                habit.lastCheckedDate = today;
                addXp(Math.max(1,Math.floor(5 * habit.target / 2))); // XP for daily habit completion
            }
            playSound('sound-habit-track');
            renderAll(); saveData();
        }
    }
    function updateHabitProgressForOfflineDays() { /* Same logic */
        const today = new Date().toDateString();
        playerData.habits.forEach(habit => {
            if (habit.lastCheckedDate !== today) {
                habit.progress = 0;
                if (habit.lastCheckedDate) {
                    const lastDate = new Date(habit.lastCheckedDate);
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (lastDate.toDateString() !== yesterday.toDateString()) habit.streak = 0;
                }
            }
        });
    }

    // --- ACHIEVEMENTS --- (Sound effects added)
    function checkAndUnlockAchievements() {
        let newAchievementUnlockedThisCheck = false;
        playerData.achievements.forEach(ach => {
            if (!ach.unlocked && ach.condition()) {
                ach.unlocked = true;
                newAchievementUnlockedThisCheck = true;
                levelUpMessageEl.textContent = `Feat Unlocked: ${ach.name}!`;
                playSound('sound-achievement');
                setTimeout(() => { if (levelUpMessageEl.textContent.includes(ach.name)) levelUpMessageEl.textContent = ''; }, 5000);
            }
        });
        if (newAchievementUnlockedThisCheck) {
            checkThemeUnlocks();
            renderAchievements(); renderThemes(); saveData();
        }
    }

    // --- NAVBAR TOGGLE FOR MOBILE ---
    navToggleBtn.addEventListener('click', () => {
        playSound('sound-click');
        const isExpanded = navToggleBtn.getAttribute('aria-expanded') === 'true' || false;
        navToggleBtn.setAttribute('aria-expanded', !isExpanded);
        navToggleBtn.classList.toggle('active');
        topNavigation.classList.toggle('active');
    });
    // Close mobile nav when a link is clicked
    document.querySelectorAll('.top-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (topNavigation.classList.contains('active')) {
                navToggleBtn.setAttribute('aria-expanded', 'false');
                navToggleBtn.classList.remove('active');
                topNavigation.classList.remove('active');
            }
        });
    });


    // Close modals if clicked outside content
    window.onclick = function(event) {
        if (event.target == addQuestModal) { playSound('sound-click'); closeQuestModal(); }
        if (event.target == addHabitModal) { playSound('sound-click'); closeHabitModal(); }
    }

    // Add click sounds to all action buttons
    document.querySelectorAll('.action-button').forEach(button => {
        if(button.id !== 'add-quest-modal-btn' && button.id !== 'add-habit-modal-btn' && button.id !== 'reset-data-btn' && !button.classList.contains('complete-button') && !button.classList.contains('track-button')){ // Avoid double sound on modal openers
            button.addEventListener('click', () => playSound('sound-click'));
        }
    });


    // --- INITIALIZATION ---
    loadData();
    renderAll();
});