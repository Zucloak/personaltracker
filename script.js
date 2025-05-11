document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Grab Bag ---
    // Player Stats Display
    const goldAmountEl = document.getElementById('gold-amount');
    const currentLevelHeaderEl = document.getElementById('current-level-header');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const soundIconEl = document.getElementById('sound-icon');

    // Character Sheet
    const charLevelEl = document.getElementById('char-level');
    const charXpEl = document.getElementById('char-xp');
    const charXpNextEl = document.getElementById('char-xp-next');
    const charXpBarVisualEl = document.getElementById('char-xp-bar-visual');
    const charGoldEl = document.getElementById('char-gold');
    const charQuestsCompletedEl = document.getElementById('char-quests-completed');
    const charLongestStreakEl = document.getElementById('char-longest-streak');
    const charCurrentThemePreviewEl = document.getElementById('char-current-theme-preview');
    const charCurrentThemeNameEl = document.getElementById('char-current-theme-name');
    const charRecentFeatsListEl = document.getElementById('char-recent-feats-list');


    // Quests (Main & Side)
    const questListEl = document.getElementById('quest-list');
    const addQuestModalBtn = document.getElementById('add-quest-modal-btn');
    const addQuestModal = document.getElementById('add-quest-modal');
    const questNameInput = document.getElementById('quest-name-input');
    const questDescInput = document.getElementById('quest-desc-input');
    const questGoldInput = document.getElementById('quest-gold-input');
    const questXpInput = document.getElementById('quest-xp-input');
    const questPriorityInput = document.getElementById('quest-priority-input');
    const submitQuestBtn = document.getElementById('submit-quest-btn');

    const predefinedSideQuestListEl = document.getElementById('predefined-side-quest-list');
    const activeSideQuestListEl = document.getElementById('active-side-quest-list');
    const addSideQuestModalBtn = document.getElementById('add-side-quest-modal-btn');
    const addSideQuestModal = document.getElementById('add-side-quest-modal');
    const sideQuestNameInput = document.getElementById('side-quest-name-input');
    const sideQuestDescInput = document.getElementById('side-quest-desc-input');
    const sideQuestGoldInput = document.getElementById('side-quest-gold-input');
    const sideQuestXpInput = document.getElementById('side-quest-xp-input');
    const submitSideQuestBtn = document.getElementById('submit-side-quest-btn');


    // Habits
    const habitGridEl = document.getElementById('habit-grid');
    const addHabitModalBtn = document.getElementById('add-habit-modal-btn');
    const addHabitModal = document.getElementById('add-habit-modal');
    const habitNameInput = document.getElementById('habit-name-input');
    const habitIconInput = document.getElementById('habit-icon-input');
    const habitTargetInput = document.getElementById('habit-target-input');
    const submitHabitBtn = document.getElementById('submit-habit-btn');

    // Captain's Log
    const currentLogDateEl = document.getElementById('current-log-date');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const selectedMoodDisplayEl = document.getElementById('selected-mood-display');
    const journalEntryEl = document.getElementById('journal-entry');
    const saveLogEntryBtn = document.getElementById('save-log-entry-btn');
    const pastLogDatesDropdownEl = document.getElementById('past-log-dates-dropdown');
    const pastLogDisplayEl = document.getElementById('past-log-display');


    // Pomodoro Timer
    const pomodoroDisplayEl = document.getElementById('pomodoro-display');
    const pomodoroStatusEl = document.getElementById('pomodoro-status');
    const pomodoroStartBtn = document.getElementById('pomodoro-start-btn');
    const pomodoroPauseBtn = document.getElementById('pomodoro-pause-btn');
    const pomodoroResetBtn = document.getElementById('pomodoro-reset-btn');
    const workDurationInput = document.getElementById('work-duration');
    const breakDurationInput = document.getElementById('break-duration');
    const currentTimeClockEl = document.getElementById('current-time-clock');

    // Inventory
    const inventoryGridEl = document.getElementById('inventory-grid');

    // Achievements
    const achievementsLogUlEl = document.querySelector('#achievements-log ul');
    const addCustomAchievementModalBtn = document.getElementById('add-custom-achievement-modal-btn');
    const addCustomAchievementModal = document.getElementById('add-custom-achievement-modal');
    const customAchNameInput = document.getElementById('custom-ach-name-input');
    const customAchDescInput = document.getElementById('custom-ach-desc-input');
    const customAchIconUrlInput = document.getElementById('custom-ach-icon-url-input');
    const customAchManualUnlockInput = document.getElementById('custom-ach-manual-unlock-input');
    const submitCustomAchBtn = document.getElementById('submit-custom-ach-btn');

    // Themes
    const themeOptionsGridEl = document.getElementById('theme-options-grid');

    // General
    const resetDataBtn = document.getElementById('reset-data-btn');
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    const topNavigation = document.getElementById('top-navigation');
    const currentYearEl = document.getElementById('currentYear');
    const levelUpMessageEl = document.getElementById('level-up-message'); // From HTML for level up animation text


    // --- Player Data Structure ---
    let playerData = {
        gold: 0,
        level: 1,
        xp: 0,
        quests: [], // { id, name, desc, rewardGold, rewardXp, priority, completed, type: 'main'/'side', dateAdded, dateCompleted }
        habits: [], // { id, name, icon, progress, streak, target, lastCheckedDate, dateAdded }
        journal: {}, // { 'YYYY-MM-DD': { mood: 'great', entry: 'text' } }
        inventory: [], // { id, name, iconUrl, description, dateAcquired }
        achievements: [], // { id, name, desc, icon, unlocked, condition (func), isCustom, dateUnlocked }
        unlockedThemes: ['default-dark'],
        currentTheme: 'default-dark',
        pomodoro: {
            workDuration: 25,
            breakDuration: 5,
            cycles: 0
        },
        settings: {
            soundEffects: true,
            firstVisit: true
        },
        stats: {
            questsCompleted: 0,
            sideQuestsCompleted: 0,
            maxHabitStreak: 0,
            logEntries: 0
        },
        nextQuestId: 1,
        nextHabitId: 1,
        nextInventoryId: 1,
        nextCustomAchievementId: 1000, // Start custom IDs high to avoid collision
        xpLevels: [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5500, 7000, 9000, 12000, 15000, 20000]
    };

    // --- Pomodoro State ---
    let pomodoroInterval;
    let pomodoroTimeLeft;
    let pomodoroIsWorkSession = true;
    let pomodoroIsPaused = true;

    // --- Themes Configuration (Ensure icon URLs are placeholders you'll replace) ---
    const themes = { // (Keep your theme definitions, ensure previewStyle is good)
        'default-dark': {
            name: 'ShadowScribe (Default)', icon: 'https://cdn-icons-png.flaticon.com/512/2869/2869100.png', unlockLevel: 1, cssVariables: { /* ... */ },
            previewStyle: "background: linear-gradient(135deg, #1c1815 0%, #2a2520 100%); border-color: #FFD700;"
        },
        'inferno-herald': {
            name: 'Inferno Herald', icon: 'https://cdn-icons-png.flaticon.com/512/899/899584.png', unlockLevel: 5, unlockAchievement: 'level_5', cssVariables: { /* ... */ },
            previewStyle: "background: linear-gradient(135deg, #3D0000 0%, #5A0000 100%); border-color: #FF8C00;"
        },
        'mystic-depths': {
            name: 'Mystic Depths', icon: 'https://cdn-icons-png.flaticon.com/512/3003/3003963.png', unlockLevel: 10, cssVariables: { /* ... */ },
            previewStyle: "background: linear-gradient(135deg, #0B2A40 0%, #1A4A6A 100%); border-color: #AFEEEE;"
        }
        // Add more themes here if you like
    };

    // --- Achievements Configuration (Ensure icon URLs are placeholders) ---
    const PREDEFINED_ACHIEVEMENTS = [
        { id: 'first_quest_main', name: 'The Adventure Begins', desc: 'Complete your first Main Quest.', icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', condition: () => playerData.quests.some(q => q.type === 'main' && q.completed) },
        { id: 'first_quest_side', name: 'Curiosity Rewarded', desc: 'Complete your first Side Quest.', icon: 'https://cdn-icons-png.flaticon.com/512/2903/2903681.png', condition: () => playerData.quests.some(q => q.type === 'side' && q.completed) },
        { id: 'gold_100', name: 'Coin Collector', desc: 'Amass 100 Gold.', icon: 'https://cdn-icons-png.flaticon.com/512/1041/1041906.png', condition: () => playerData.gold >= 100 },
        { id: 'level_5', name: 'Seasoned Adventurer', desc: 'Reach Level 5.', icon: 'https://cdn-icons-png.flaticon.com/512/2591/2591199.png', condition: () => playerData.level >= 5 },
        { id: 'level_10', name: 'Hero of Renown', desc: 'Reach Level 10.', icon: 'https://cdn-icons-png.flaticon.com/512/2591/2591200.png', condition: () => playerData.level >= 10 },
        { id: 'habit_streak_7', name: 'Consistent Cultivator', desc: 'Maintain a 7-day streak on any habit.', icon: 'https://cdn-icons-png.flaticon.com/512/2999/2999109.png', condition: () => playerData.habits.some(h => h.streak >= 7) },
        { id: 'first_log', name: 'The First Entry', desc: 'Write your first Captain\'s Log entry.', icon: 'https://cdn-icons-png.flaticon.com/512/2839/2839279.png', condition: () => Object.keys(playerData.journal).length > 0 },
        { id: 'pomodoro_cycle_1', name: 'Focused Mind', desc: 'Complete one Pomodoro work cycle.', icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920345.png', condition: () => playerData.pomodoro.cycles >= 1 },
        { id: 'first_trophy', name: 'Trophy Hunter', desc: 'Acquire your first trophy in the Inventory.', icon: 'https://cdn-icons-png.flaticon.com/512/1169/1169790.png', condition: () => playerData.inventory.length > 0 }
    ];

    // --- Predefined Side Quests (Hobbies/Learning) ---
    const PREDEFINED_SIDE_QUESTS_TEMPLATES = [
        { name: "Read a Chapter", desc: "Dive into a book for at least one chapter.", rewardGold: 5, rewardXp: 10, icon: "https://cdn-icons-png.flaticon.com/512/2702/2702135.png" },
        { name: "Sketch Something", desc: "Spend 20 minutes sketching or drawing.", rewardGold: 5, rewardXp: 10, icon: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png" },
        { name: "Learn a New Word", desc: "Learn and use a new vocabulary word (any language).", rewardGold: 3, rewardXp: 5, icon: "https://cdn-icons-png.flaticon.com/512/3097/3097555.png" },
        { name: "30 Min Walk/Exercise", desc: "Get active for at least 30 minutes.", rewardGold: 10, rewardXp: 15, icon: "https://cdn-icons-png.flaticon.com/512/857/857456.png" },
        { name: "Practice Instrument", desc: "Practice a musical instrument for 20 minutes.", rewardGold: 8, rewardXp: 12, icon: "https://cdn-icons-png.flaticon.com/512/2907/2907009.png" },
        { name: "Mindful Moment", desc: "Spend 5-10 minutes in mindfulness or meditation.", rewardGold: 3, rewardXp: 5, icon: "https://cdn-icons-png.flaticon.com/512/3075/3075759.png" },
    ];


    // --- Sound Function ---
    function playSound(soundId) {
        if (!playerData.settings.soundEffects) return;
        try {
            const soundElement = document.getElementById(soundId);
            if (soundElement) {
                soundElement.currentTime = 0;
                soundElement.play().catch(error => { /* console.warn("Sound play failed:", error) */ }); // Avoid console spam for user-interrupted sounds
            }
        } catch (error) { console.error("Error playing sound:", error); }
    }

    // --- Data Handling (localStorage) ---
    function loadData() {
        const savedData = localStorage.getItem('heroChronicleDataAdvanced');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // Deep merge to preserve defaults for new properties
            playerData = {
                ...playerData, // Start with current defaults
                ...parsedData, // Overlay saved data
                settings: { ...playerData.settings, ...(parsedData.settings || {}) }, // Merge settings
                pomodoro: { ...playerData.pomodoro, ...(parsedData.pomodoro || {}) },
                stats: { ...playerData.stats, ...(parsedData.stats || {}) },
                // Ensure arrays are properly handled
                quests: parsedData.quests || [],
                habits: parsedData.habits || [],
                journal: parsedData.journal || {},
                inventory: parsedData.inventory || [],
                unlockedThemes: parsedData.unlockedThemes || ['default-dark'],
            };

            // Merge achievements carefully: predefined + custom from saved data
            const baseAchievements = PREDEFINED_ACHIEVEMENTS.map(pa => ({ ...pa, unlocked: false, isCustom: false }));
            let mergedAchievements = baseAchievements.map(ba => {
                const savedVersion = parsedData.achievements?.find(sa => sa.id === ba.id && !sa.isCustom);
                return savedVersion ? { ...ba, ...savedVersion, condition: ba.condition } : ba; // Keep original condition func
            });
            const customSavedAchievements = parsedData.achievements?.filter(sa => sa.isCustom) || [];
            playerData.achievements = [...mergedAchievements, ...customSavedAchievements];

        } else { // First time load or reset
            playerData.achievements = PREDEFINED_ACHIEVEMENTS.map(pa => ({ ...pa, unlocked: false, isCustom: false }));
        }
        // Ensure xpLevels is always from code for easy updates
        playerData.xpLevels = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5500, 7000, 9000, 12000, 15000, 20000];

        applyTheme(playerData.currentTheme, true);
        updateHabitProgressForOfflineDays();
        updateSoundButtonUI();
    }

    function saveData() {
        localStorage.setItem('heroChronicleDataAdvanced', JSON.stringify(playerData));
    }

    function resetData() {
        if (confirm("Are you sure you want to reset ALL your progress? This cannot be undone!")) {
            playSound('sound-click');
            localStorage.removeItem('heroChronicleDataAdvanced');
            // Re-initialize playerData to default structure (deep copy where needed)
            playerData = {
                gold: 0, level: 1, xp: 0,
                quests: [], habits: [], journal: {}, inventory: [],
                achievements: PREDEFINED_ACHIEVEMENTS.map(pa => ({ ...pa, unlocked: false, isCustom: false })),
                unlockedThemes: ['default-dark'], currentTheme: 'default-dark',
                pomodoro: { workDuration: 25, breakDuration: 5, cycles: 0 },
                settings: { soundEffects: true, firstVisit: true },
                stats: { questsCompleted: 0, sideQuestsCompleted: 0, maxHabitStreak: 0, logEntries: 0 },
                nextQuestId: 1, nextHabitId: 1, nextInventoryId: 1, nextCustomAchievementId: 1000,
                xpLevels: [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5500, 7000, 9000, 12000, 15000, 20000]
            };
            applyTheme(playerData.currentTheme, true);
            updateSoundButtonUI();
            renderAll(); // Render with reset data
            saveData(); // Save the reset state
        }
    }
    resetDataBtn.addEventListener('click', resetData);

    // --- Sound Toggle ---
    function toggleSoundEffects() {
        playerData.settings.soundEffects = !playerData.settings.soundEffects;
        playSound('sound-click'); // Play click sound regardless of new state, to indicate action
        updateSoundButtonUI();
        saveData();
    }

    function updateSoundButtonUI() {
        if (playerData.settings.soundEffects) {
            soundIconEl.src = "https://cdn-icons-png.flaticon.com/512/59/59284.png"; // Sound On Icon - REPLACE
            soundIconEl.alt = "Sound On";
            soundToggleBtn.title = "Mute Sound Effects";
            soundToggleBtn.classList.remove('sound-off');
        } else {
            soundIconEl.src = "https://cdn-icons-png.flaticon.com/512/59/59260.png"; // Sound Off Icon - REPLACE
            soundIconEl.alt = "Sound Off";
            soundToggleBtn.title = "Unmute Sound Effects";
            soundToggleBtn.classList.add('sound-off');
        }
    }
    soundToggleBtn.addEventListener('click', toggleSoundEffects);


    // --- RENDERING FUNCTIONS ---
    function renderAll() {
        renderPlayerHeaderStats();
        renderCharacterSheet();
        renderQuestsAndSideQuests();
        renderHabits();
        renderThemes();
        renderAchievements();
        renderCaptainLogDate();
        renderPastLogDatesDropdown();
        renderInventory();
        updatePomodoroDisplay(); // Ensure timer display is correct on render
        checkAndUnlockAchievements();
    }

    function renderPlayerHeaderStats() {
        goldAmountEl.textContent = playerData.gold;
        currentLevelHeaderEl.textContent = playerData.level;
    }

    function renderCharacterSheet() {
        charLevelEl.textContent = playerData.level;
        charXpEl.textContent = playerData.xp;
        const xpForNext = playerData.xpLevels[playerData.level] || playerData.xpLevels[playerData.xpLevels.length - 1];
        charXpNextEl.textContent = xpForNext;
        const progressPercentage = playerData.level >= playerData.xpLevels.length ? 100 : Math.min((playerData.xp / xpForNext) * 100, 100);
        charXpBarVisualEl.style.width = `${progressPercentage}%`;
        charGoldEl.textContent = playerData.gold;
        charQuestsCompletedEl.textContent = playerData.stats.questsCompleted + playerData.stats.sideQuestsCompleted;
        charLongestStreakEl.textContent = playerData.stats.maxHabitStreak;

        const currentThemeDetails = themes[playerData.currentTheme];
        if (currentThemeDetails) {
            charCurrentThemeNameEl.textContent = currentThemeDetails.name;
            charCurrentThemePreviewEl.style.cssText = currentThemeDetails.previewStyle || '';
            if (currentThemeDetails.icon) {
                 charCurrentThemePreviewEl.innerHTML = `<img src="${currentThemeDetails.icon}" alt="${currentThemeDetails.name} Preview" style="max-width:80%; max-height:80%; opacity:0.7; object-fit:contain;">`;
            } else {
                charCurrentThemePreviewEl.innerHTML = '';
            }
        }
        // Recent Feats (Top 3 unlocked)
        charRecentFeatsListEl.innerHTML = '';
        const recentFeats = playerData.achievements
            .filter(a => a.unlocked)
            .sort((f1, f2) => new Date(f2.dateUnlocked) - new Date(f1.dateUnlocked))
            .slice(0, 3);
        if(recentFeats.length > 0){
            recentFeats.forEach(feat => {
                const li = document.createElement('li');
                const iconSrcFeat = feat.icon.startsWith('http') ? feat.icon : `images/${feat.icon}`;
                li.innerHTML = `<img src="${iconSrcFeat}" class="inline-icon permanent-icon" alt=""> ${feat.name}`;
                charRecentFeatsListEl.appendChild(li);
            });
        } else {
            charRecentFeatsListEl.innerHTML = '<li>No recent feats.</li>';
        }
    }


    function renderQuestsAndSideQuests() {
        questListEl.innerHTML = '';
        activeSideQuestListEl.innerHTML = '';
        predefinedSideQuestListEl.innerHTML = '';

        const mainQuests = playerData.quests.filter(q => q.type === 'main');
        const sideQuests = playerData.quests.filter(q => q.type === 'side');

        if (mainQuests.length === 0) {
            questListEl.innerHTML = '<p class="empty-state">No active main quests. Time to forge some!</p>';
        } else {
            const sortedMainQuests = [...mainQuests].sort((a, b) => (a.completed - b.completed) || (b.priority - a.priority) || (new Date(b.dateAdded) - new Date(a.dateAdded)));
            sortedMainQuests.forEach(quest => renderQuestItem(quest, questListEl));
        }

        // Render Predefined Side Quests
        PREDEFINED_SIDE_QUESTS_TEMPLATES.forEach(template => {
            // Check if a quest with this name (and type side) already exists in playerData.quests
            const existing = playerData.quests.find(q => q.name === template.name && q.type === 'side');
            if (existing && !existing.completed) return; // Don't show if active and not completed
            if (existing && existing.completed) return; // Optionally hide if already completed once, or allow re-activation

            const itemEl = document.createElement('div');
            itemEl.className = 'side-quest-suggestion-item';
            const iconSrc = template.icon.startsWith('http') ? template.icon : `images/${template.icon}`;
            itemEl.innerHTML = `
                <img src="${iconSrc}" alt="${template.name}" class="inline-icon permanent-icon" style="width:24px; height:24px; margin-bottom:5px;" onerror="this.style.display='none'">
                <h4>${template.name}</h4>
                <p>${template.desc}</p>
                <p class="quest-reward">Reward: <span class="gold-text">${template.rewardGold} Gold</span>, ${template.rewardXp} XP</p>
                <button class="action-button add-button activate-side-quest-btn">Activate</button>
            `;
            itemEl.querySelector('.activate-side-quest-btn').addEventListener('click', () => {
                playSound('sound-click');
                activatePredefinedSideQuest(template);
            });
            predefinedSideQuestListEl.appendChild(itemEl);
        });


        if (sideQuests.length === 0) {
            activeSideQuestListEl.innerHTML = '<p class="empty-state">No active side quests.</p>';
        } else {
            const sortedSideQuests = [...sideQuests].sort((a, b) => (a.completed - b.completed) || (new Date(b.dateAdded) - new Date(a.dateAdded)));
            sortedSideQuests.forEach(quest => renderQuestItem(quest, activeSideQuestListEl));
        }
    }

    function renderQuestItem(quest, listElement) {
        const questItem = document.createElement('div');
        questItem.className = `quest-item ${quest.priority ? 'priority-quest' : ''} ${quest.completed ? 'completed-quest' : ''}`;
        questItem.dataset.id = quest.id;
        questItem.dataset.type = quest.type; // Store type for easier access

        questItem.innerHTML = `
            <div class="quest-details">
                <h3 class="quest-name">${quest.name} <span class="quest-type-badge">(${quest.type === 'main' ? 'Main' : 'Side'})</span></h3>
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
                completeQuest(quest.id, quest.type);
            });
        }
        listElement.appendChild(questItem);
    }


    function renderHabits() { /* Logic largely same, ensure icon handling is robust */
        habitGridEl.innerHTML = '';
        if (playerData.habits.length === 0) {
            habitGridEl.innerHTML = '<p class="empty-state">No habits being cultivated. Start a new ritual!</p>';
            return;
        }
        const sortedHabits = [...playerData.habits].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        sortedHabits.forEach(habit => {
            const habitCard = document.createElement('div');
            habitCard.classList.add('habit-card');
            habitCard.dataset.id = habit.id;
            const progressPercent = Math.min((habit.progress / habit.target) * 100, 100);
            const isMaxedOut = habit.progress >= habit.target;
            const iconSrc = habit.icon.startsWith('http') || habit.icon.startsWith('images/') ? habit.icon : `images/${habit.icon}`; // Allow full URL or direct images/ path

            habitCard.innerHTML = `
                <img src="${iconSrc}" alt="${habit.name}" class="habit-item-icon" onerror="this.onerror=null;this.src='https://cdn-icons-png.flaticon.com/512/1670/1670906.png';"> <h4 class="habit-title">${habit.name}</h4>
                <div class="item-progress-bar-container">
                    <div class="item-progress-bar ${isMaxedOut ? 'completed' : ''}" style="width: ${progressPercent}%;"></div>
                </div>
                <p class="habit-target-display">Today: ${habit.progress} / ${habit.target}</p>
                <p class="habit-status">Streak: ${habit.streak} Days</p>
                <button class="action-button track-button ${isMaxedOut ? 'maxed-out' : ''}" ${isMaxedOut ? 'disabled' : ''}>
                    ${isMaxedOut ? 'Done Today' : `Track (+${calculateHabitXP(habit)} XP)`}
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

    function renderThemes() { /* Logic largely same */
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
                const ach = PREDEFINED_ACHIEVEMENTS.find(a => a.id === theme.unlockAchievement) || playerData.achievements.find(a => a.id === theme.unlockAchievement);
                if (ach) unlockCriteria += ` or by "${ach.name}"`;
            }
            themeCard.innerHTML = `
                <div class="theme-preview" style="${theme.previewStyle || ''}">
                    ${theme.icon ? `<img src="${theme.icon}" alt="${theme.name} Preview" style="max-width:75%; max-height:75%; opacity:0.75; object-fit:contain;">` : ''}
                </div>
                <p>${theme.name}</p>
                <span class="theme-status">
                    ${playerData.currentTheme === themeId ? 'Active' : (isUnlocked ? 'Unlocked' : `${unlockCriteria} 🔒`)}
                </span>
            `;
            if (isUnlocked) {
                themeCard.addEventListener('click', () => { playSound('sound-click'); applyTheme(themeId); });
            }
            themeOptionsGridEl.appendChild(themeCard);
        });
    }

    function renderAchievements() { /* Now handles custom achievements with image URLs */
        achievementsLogUlEl.innerHTML = '';
        const sortedAchievements = [...playerData.achievements].sort((a, b) => (a.unlocked === b.unlocked) ? 0 : a.unlocked ? -1 : 1);
        if(sortedAchievements.length === 0) {
             achievementsLogUlEl.innerHTML = '<li><p class="empty-state">No feats recorded yet. Go make your legend!</p></li>'; return;
        }
        sortedAchievements.forEach(ach => {
            const li = document.createElement('li');
            li.classList.toggle('unlocked', ach.unlocked);
            const iconSrc = ach.icon?.startsWith('http') || ach.icon?.startsWith('images/') ? ach.icon : (ach.icon ? `images/${ach.icon}` : 'https://cdn-icons-png.flaticon.com/512/189/189703.png'); // Default star if no icon - REPLACE
            li.innerHTML = `<img src="${iconSrc}" alt="Feat Icon" class="icon-tiny permanent-icon" onerror="this.onerror=null;this.src='https://cdn-icons-png.flaticon.com/512/189/189703.png';"> ${ach.name} ${ach.isCustom ? '(Custom)' : ''} - <span class="ach-desc">${ach.desc}</span>`;
            achievementsLogUlEl.appendChild(li);
        });
    }

    function renderInventory() {
        inventoryGridEl.innerHTML = '';
        if (playerData.inventory.length === 0) {
            inventoryGridEl.innerHTML = '<p class="empty-state">Your trophy case is currently empty. Complete feats and cultivate habits to earn trophies!</p>';
            return;
        }
        playerData.inventory.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'inventory-item';
            itemEl.title = `${item.name} - ${item.description}\nAcquired: ${new Date(item.dateAcquired).toLocaleDateString()}`;
            const iconSrc = item.iconUrl.startsWith('http') || item.iconUrl.startsWith('images/') ? item.iconUrl : `images/${item.iconUrl}`;
            itemEl.innerHTML = `
                <img src="${iconSrc}" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.innerHTML += '<p>Icon Error</p>';">
                <p>${item.name}</p>
            `;
            inventoryGridEl.appendChild(itemEl);
        });
    }


    // --- GAME LOGIC & ACTIONS ---
    function addGold(amount) {
        playerData.gold += amount;
        if (amount > 0) playSound('sound-gold-gain');
    }

    function addXp(amount) {
        if (amount <= 0) return; // Prevent negative or zero XP additions from breaking logic.
        playerData.xp += amount;
        levelUpMessageEl.textContent = ''; // Clear previous
        let leveledUpThisCall = false;

        // Corrected Level Up Logic
        while (playerData.level < playerData.xpLevels.length && playerData.xp >= playerData.xpLevels[playerData.level]) {
            const xpNeededForCurrentLevelUp = playerData.xpLevels[playerData.level];
            playerData.xp -= xpNeededForCurrentLevelUp; // Subtract XP needed for *this* level up
            playerData.level++;
            leveledUpThisCall = true;
            levelUpMessageEl.textContent = `Level Up! Reached Level ${playerData.level}!`;
             // Check if next level exists, otherwise set XP to 0 if max level capped
            if (playerData.level >= playerData.xpLevels.length) {
                playerData.xp = 0; // Or cap at max XP for the last defined level
                levelUpMessageEl.textContent += " Max Level Reached!";
            }
            setTimeout(() => { if (levelUpMessageEl.textContent.includes(`Level ${playerData.level}`)) levelUpMessageEl.textContent = ''; }, 5000);
            checkThemeUnlocks();
        }
        // Cap XP if max level and somehow still have excess (should be handled by loop)
        if (playerData.level >= playerData.xpLevels.length && playerData.xp > 0) {
            playerData.xp = 0;
        }

        if (leveledUpThisCall) playSound('sound-level-up');
    }


    function checkThemeUnlocks() { /* Same */
        Object.keys(themes).forEach(themeId => { /* ... */ });
    }

    function applyTheme(themeId, isInitialLoad = false) { /* Same */
        const theme = themes[themeId]; if (!theme) return;
        // ... (unlock check)
        Object.keys(theme.cssVariables).forEach(variable => { document.documentElement.style.setProperty(variable, theme.cssVariables[variable]); });
        playerData.currentTheme = themeId;
        if (!isInitialLoad) { saveData(); renderThemes(); renderCharacterSheet(); } // Update char sheet too
    }

    // --- Quests (Main & Side) ---
    function openModal(modalElement) { modalElement.style.display = 'block'; playSound('sound-modal-open'); }
    function closeModal(modalElement) { modalElement.style.display = 'none'; }

    // Main Quests
    addQuestModalBtn.addEventListener('click', () => { playSound('sound-click'); openModal(addQuestModal); });
    document.querySelector('[data-modal-id="add-quest-modal"]').addEventListener('click', () => closeModal(addQuestModal));
    submitQuestBtn.addEventListener('click', () => {
        playSound('sound-click');
        const name = questNameInput.value.trim();
        const desc = questDescInput.value.trim();
        const rewardGold = parseInt(questGoldInput.value) || 0;
        const rewardXp = parseInt(questXpInput.value) || 0;
        const priority = questPriorityInput.checked;
        if (!name) { alert("Main Quest name cannot be empty!"); return; }
        playerData.quests.push({
            id: `q${playerData.nextQuestId++}`, name, desc, rewardGold, rewardXp, priority,
            completed: false, type: 'main', dateAdded: new Date().toISOString()
        });
        questNameInput.value = ''; questDescInput.value = ''; questGoldInput.value = '50'; questXpInput.value = '100'; questPriorityInput.checked = false;
        closeModal(addQuestModal); renderQuestsAndSideQuests(); saveData();
    });

    // Side Quests
    addSideQuestModalBtn.addEventListener('click', () => { playSound('sound-click'); openModal(addSideQuestModal); });
    document.querySelector('[data-modal-id="add-side-quest-modal"]').addEventListener('click', () => closeModal(addSideQuestModal));
    submitSideQuestBtn.addEventListener('click', () => {
        playSound('sound-click');
        const name = sideQuestNameInput.value.trim();
        const desc = sideQuestDescInput.value.trim();
        const rewardGold = parseInt(sideQuestGoldInput.value) || 0;
        const rewardXp = parseInt(sideQuestXpInput.value) || 0;
        if (!name) { alert("Side Quest name cannot be empty!"); return; }
        playerData.quests.push({
            id: `sq${playerData.nextQuestId++}`, name, desc, rewardGold, rewardXp, priority: false, // Side quests usually not priority
            completed: false, type: 'side', dateAdded: new Date().toISOString()
        });
        sideQuestNameInput.value = ''; sideQuestDescInput.value = ''; sideQuestGoldInput.value = '10'; sideQuestXpInput.value = '20';
        closeModal(addSideQuestModal); renderQuestsAndSideQuests(); saveData();
    });

    function activatePredefinedSideQuest(template) {
        // Check if a non-completed side quest with this name already exists
        const existingActive = playerData.quests.find(q => q.name === template.name && q.type === 'side' && !q.completed);
        if (existingActive) {
            alert(`Side quest "${template.name}" is already active!`);
            return;
        }
        playerData.quests.push({
            id: `sq${playerData.nextQuestId++}`, name: template.name, desc: template.desc,
            rewardGold: template.rewardGold, rewardXp: template.rewardXp, priority: false,
            completed: false, type: 'side', dateAdded: new Date().toISOString()
        });
        renderQuestsAndSideQuests(); saveData();
    }


    function completeQuest(questId, questType) { // Now takes questType
        const questIndex = playerData.quests.findIndex(q => q.id === questId);
        if (questIndex > -1 && !playerData.quests[questIndex].completed) {
            const quest = playerData.quests[questIndex];
            quest.completed = true;
            quest.dateCompleted = new Date().toISOString();
            addGold(quest.rewardGold);
            addXp(quest.rewardXp); // addXp handles level up sound
            playSound('sound-quest-complete');

            if (quest.type === 'main') playerData.stats.questsCompleted++;
            else if (quest.type === 'side') playerData.stats.sideQuestsCompleted++;

            // Example: Add a trophy for completing a significant quest
            if (quest.rewardXp >= 100 && quest.type === 'main') { // Arbitrary condition for "significant"
                addInventoryItem(`Conqueror's Mark: ${quest.name}`, 'A testament to overcoming a great challenge.', 'https://cdn-icons-png.flaticon.com/512/1047/1047979.png'); // REPLACE Icon
            }

            renderAll(); saveData();
        }
    }

    // --- Habits ---
    function calculateHabitXP(habit) {
        // More XP for higher target habits, and a small streak bonus
        return Math.max(1, Math.floor(habit.target / 2) + Math.floor(habit.streak / 5));
    }

    addHabitModalBtn.addEventListener('click', () => { playSound('sound-click'); openModal(addHabitModal); });
    document.querySelector('[data-modal-id="add-habit-modal"]').addEventListener('click', () => closeModal(addHabitModal));
    submitHabitBtn.addEventListener('click', () => {
        playSound('sound-click');
        const name = habitNameInput.value.trim();
        let icon = habitIconInput.value.trim();
        const target = parseInt(habitTargetInput.value) || 1;
        if (!name) { alert("Habit name cannot be empty!"); return; }
        if (!icon) icon = 'images/gem_icon.png'; // Default local icon
        playerData.habits.push({
            id: `h${playerData.nextHabitId++}`, name, icon, progress: 0, streak: 0, target,
            lastCheckedDate: null, dateAdded: new Date().toISOString()
        });
        habitNameInput.value = ''; habitIconInput.value = 'images/gem_icon.png'; habitTargetInput.value = '1';
        closeModal(addHabitModal); renderHabits(); saveData();
    });

    function trackHabit(habitId) {
        const habit = playerData.habits.find(h => h.id === habitId);
        if (habit && habit.progress < habit.target) {
            habit.progress++;
            const today = new Date().toDateString();
            if (habit.progress >= habit.target) { // Daily target met
                let streakContinued = false;
                if (habit.lastCheckedDate) {
                    const lastDate = new Date(habit.lastCheckedDate);
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (lastDate.toDateString() === yesterday.toDateString()) {
                        habit.streak++; streakContinued = true;
                    } else if (lastDate.toDateString() !== today) { // Not yesterday, not today -> streak broken & restarted
                        habit.streak = 1;
                    } // If lastDate is today, streak already counted or continues
                } else { // First time completing
                    habit.streak = 1;
                }
                habit.lastCheckedDate = today;
                if (habit.streak > playerData.stats.maxHabitStreak) playerData.stats.maxHabitStreak = habit.streak;
                addXp(calculateHabitXP(habit));

                // Example: Add trophy for long habit streak
                if (habit.streak > 0 && habit.streak % 7 === 0) { // Every 7 days
                     addInventoryItem(`Medal of Consistency (${habit.name})`, `${habit.streak}-day streak!`, 'https://cdn-icons-png.flaticon.com/512/2919/2919928.png'); // REPLACE Icon
                }
            }
            playSound('sound-habit-track');
            renderAll(); saveData();
        }
    }

    function updateHabitProgressForOfflineDays() { /* Same logic */
        const today = new Date().toDateString();
        playerData.habits.forEach(habit => { /* ... */ });
    }

    // --- Captain's Log ---
    function getFormattedDate(date = new Date()) {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    function renderCaptainLogDate() {
        currentLogDateEl.textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        loadTodaysLog();
    }

    let currentSelectedMood = null;
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            playSound('sound-click');
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            currentSelectedMood = button.dataset.mood;
            selectedMoodDisplayEl.textContent = button.title;
        });
    });

    function loadTodaysLog() {
        const todayKey = getFormattedDate();
        const log = playerData.journal[todayKey];
        if (log) {
            journalEntryEl.value = log.entry;
            currentSelectedMood = log.mood;
            moodButtons.forEach(btn => {
                btn.classList.toggle('selected', btn.dataset.mood === log.mood);
                if (btn.dataset.mood === log.mood) selectedMoodDisplayEl.textContent = btn.title;
            });
        } else {
            journalEntryEl.value = '';
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            selectedMoodDisplayEl.textContent = 'None';
            currentSelectedMood = null;
        }
    }

    saveLogEntryBtn.addEventListener('click', () => {
        playSound('sound-click');
        const todayKey = getFormattedDate();
        const entryText = journalEntryEl.value.trim();
        if (!currentSelectedMood && !entryText) {
            alert("Please select a mood or write an entry to save the log.");
            return;
        }
        const wasNewEntry = !playerData.journal[todayKey];
        playerData.journal[todayKey] = {
            mood: currentSelectedMood,
            entry: entryText,
            date: new Date().toISOString()
        };
        if (wasNewEntry) playerData.stats.logEntries++;
        alert("Log entry saved!");
        renderPastLogDatesDropdown(); // Update dropdown if it's a new date
        saveData();
        checkAndUnlockAchievements(); // Check if 'first_log' achievement is met
    });

    function renderPastLogDatesDropdown() {
        pastLogDatesDropdownEl.innerHTML = '<option value="">-- Select a past log --</option>';
        const sortedDates = Object.keys(playerData.journal).sort((a, b) => new Date(b) - new Date(a));
        sortedDates.forEach(dateKey => {
            const option = document.createElement('option');
            option.value = dateKey;
            option.textContent = new Date(dateKey + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); // Ensure correct date parsing for display
            pastLogDatesDropdownEl.appendChild(option);
        });
    }

    pastLogDatesDropdownEl.addEventListener('change', (event) => {
        const selectedDateKey = event.target.value;
        if (selectedDateKey && playerData.journal[selectedDateKey]) {
            const log = playerData.journal[selectedDateKey];
            pastLogDisplayEl.innerHTML = `
                <p><strong>Date:</strong> ${new Date(log.date).toLocaleDateString()}</p>
                <p class="mood"><strong>Mood:</strong> ${log.mood ? (moodButtons[0].parentNode.querySelector(`[data-mood="${log.mood}"]`)?.title || log.mood) : 'Not set'}</p>
                <div class="entry">${log.entry.replace(/\n/g, '<br>')}</div>
            `;
        } else {
            pastLogDisplayEl.textContent = 'Select a date to view the log.';
        }
    });


    // --- Pomodoro Timer ---
    function updatePomodoroDisplay() {
        const minutes = Math.floor(pomodoroTimeLeft / 60);
        const seconds = pomodoroTimeLeft % 60;
        pomodoroDisplayEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.title = `${pomodoroDisplayEl.textContent} - ${pomodoroStatusEl.textContent} | Hero's Chronicle`; // Update page title
    }

    function startPomodoroTimer() {
        if (pomodoroIsPaused) { // Only start if not already running (or resume)
            pomodoroIsPaused = false;
            pomodoroStartBtn.disabled = true;
            pomodoroPauseBtn.disabled = false;

            if (!pomodoroTimeLeft) { // If timer was reset or first start
                pomodoroTimeLeft = (pomodoroIsWorkSession ? playerData.pomodoro.workDuration : playerData.pomodoro.breakDuration) * 60;
            }
            pomodoroStatusEl.textContent = pomodoroIsWorkSession ? "Work Session In Progress..." : "Break Time! Relax...";
            updatePomodoroDisplay();

            pomodoroInterval = setInterval(() => {
                pomodoroTimeLeft--;
                updatePomodoroDisplay();
                if (pomodoroTimeLeft <= 0) {
                    clearInterval(pomodoroInterval);
                    pomodoroIsPaused = true;
                    pomodoroStartBtn.disabled = false;
                    pomodoroPauseBtn.disabled = true;
                    if (pomodoroIsWorkSession) {
                        playerData.pomodoro.cycles++;
                        playSound('sound-pomodoro-work'); // End of work
                        addXp(5); // Small XP for completing a work session
                        addInventoryItem('Focused Orb Fragment', 'Earned from a completed focus session.', 'https://cdn-icons-png.flaticon.com/512/1999/1999789.png'); // REPLACE Icon
                    } else {
                        playSound('sound-pomodoro-break'); // End of break
                    }
                    pomodoroIsWorkSession = !pomodoroIsWorkSession; // Switch session type
                    pomodoroTimeLeft = (pomodoroIsWorkSession ? playerData.pomodoro.workDuration : playerData.pomodoro.breakDuration) * 60;
                    pomodoroStatusEl.textContent = pomodoroIsWorkSession ? "Work Session. Press Start." : "Break Time. Press Start.";
                    updatePomodoroDisplay();
                    checkAndUnlockAchievements(); // Check pomodoro achievement
                    renderAll(); // Update stats potentially
                    saveData();
                }
            }, 1000);
        }
    }

    function pausePomodoroTimer() {
        if (!pomodoroIsPaused) {
            clearInterval(pomodoroInterval);
            pomodoroIsPaused = true;
            pomodoroStartBtn.disabled = false;
            pomodoroPauseBtn.disabled = true;
            pomodoroStatusEl.textContent += " (Paused)";
            playSound('sound-click');
        }
    }

    function resetPomodoroTimer() {
        clearInterval(pomodoroInterval);
        pomodoroIsPaused = true;
        pomodoroIsWorkSession = true; // Default to work session
        pomodoroTimeLeft = playerData.pomodoro.workDuration * 60;
        pomodoroStatusEl.textContent = "Work Session";
        updatePomodoroDisplay();
        pomodoroStartBtn.disabled = false;
        pomodoroPauseBtn.disabled = true;
        playSound('sound-click');
    }

    pomodoroStartBtn.addEventListener('click', () => { playSound('sound-click'); startPomodoroTimer(); });
    pomodoroPauseBtn.addEventListener('click', pausePomodoroTimer); // Sound handled in function or implicitly
    pomodoroResetBtn.addEventListener('click', resetPomodoroTimer);

    workDurationInput.addEventListener('change', () => {
        playerData.pomodoro.workDuration = parseInt(workDurationInput.value) || 25;
        if (pomodoroIsWorkSession && pomodoroIsPaused) resetPomodoroTimer(); // Update timer if current session type
        saveData();
    });
    breakDurationInput.addEventListener('change', () => {
        playerData.pomodoro.breakDuration = parseInt(breakDurationInput.value) || 5;
        if (!pomodoroIsWorkSession && pomodoroIsPaused) resetPomodoroTimer(); // Update timer if current session type
        saveData();
    });

    function updateDigitalClock() {
        const now = new Date();
        currentTimeClockEl.textContent = now.toLocaleTimeString();
    }
    setInterval(updateDigitalClock, 1000);


    // --- Inventory Management ---
    function addInventoryItem(name, description, iconUrl) {
        const newItem = {
            id: `inv${playerData.nextInventoryId++}`,
            name, description, iconUrl,
            dateAcquired: new Date().toISOString()
        };
        playerData.inventory.push(newItem);
        // Optionally, show a notification
        levelUpMessageEl.textContent = `Item Acquired: ${name}!`;
        setTimeout(() => { if(levelUpMessageEl.textContent.includes(name)) levelUpMessageEl.textContent = '';}, 4000);
        checkAndUnlockAchievements(); // Check for 'first_trophy'
        renderInventory();
        saveData();
    }


    // --- Achievements (Predefined & Custom) ---
    addCustomAchievementModalBtn.addEventListener('click', () => { playSound('sound-click'); openModal(addCustomAchievementModal); });
    document.querySelector('[data-modal-id="add-custom-achievement-modal"]').addEventListener('click', () => closeModal(addCustomAchievementModal));
    submitCustomAchBtn.addEventListener('click', () => {
        playSound('sound-click');
        const name = customAchNameInput.value.trim();
        const desc = customAchDescInput.value.trim();
        const iconUrl = customAchIconUrlInput.value.trim() || 'https://cdn-icons-png.flaticon.com/512/4789/4789491.png'; // Default Custom Feat Icon - REPLACE
        const manualUnlock = customAchManualUnlockInput.checked;

        if (!name) { alert("Custom Feat name cannot be empty!"); return; }
        playerData.achievements.push({
            id: `custom${playerData.nextCustomAchievementId++}`, name, desc, icon: iconUrl,
            unlocked: manualUnlock, isCustom: true,
            condition: () => false, // Custom achievements usually manually unlocked or tied to specific game events not generic conditions
            dateUnlocked: manualUnlock ? new Date().toISOString() : null
        });
        customAchNameInput.value = ''; customAchDescInput.value = ''; customAchIconUrlInput.value = ''; customAchManualUnlockInput.checked = true;
        closeModal(addCustomAchievementModal); renderAchievements(); saveData();
    });


    function checkAndUnlockAchievements() {
        let newAchievementUnlockedThisCheck = false;
        playerData.achievements.forEach(ach => {
            if (!ach.unlocked && !ach.isCustom && ach.condition && ach.condition()) {
                ach.unlocked = true;
                ach.dateUnlocked = new Date().toISOString();
                newAchievementUnlockedThisCheck = true;
                levelUpMessageEl.textContent = `Feat Unlocked: ${ach.name}!`;
                playSound('sound-achievement');
                setTimeout(() => { if (levelUpMessageEl.textContent.includes(ach.name)) levelUpMessageEl.textContent = ''; }, 5000);
            }
        });
        if (newAchievementUnlockedThisCheck) {
            checkThemeUnlocks();
            renderAchievements(); renderThemes(); renderInventory(); // Some achievements might grant inventory items
            saveData();
        }
    }


    // --- Navbar Toggle for Mobile ---
    navToggleBtn.addEventListener('click', () => {
        playSound('sound-click');
        const isExpanded = navToggleBtn.getAttribute('aria-expanded') === 'true' || false;
        navToggleBtn.setAttribute('aria-expanded', !isExpanded);
        navToggleBtn.classList.toggle('active');
        topNavigation.classList.toggle('active');
    });
    document.querySelectorAll('.top-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (topNavigation.classList.contains('active')) {
                navToggleBtn.setAttribute('aria-expanded', 'false');
                navToggleBtn.classList.remove('active');
                topNavigation.classList.remove('active');
            }
        });
    });

    // Close modals if clicked outside content (data-modal-id added to close buttons)
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            playSound('sound-click');
            closeModal(event.target);
        }
    }
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
             playSound('sound-click');
             const modalId = event.target.dataset.modalId;
             if(modalId) closeModal(document.getElementById(modalId));
        });
    });


    // --- INITIALIZATION ---
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    loadData(); // Load data first
    pomodoroTimeLeft = playerData.pomodoro.workDuration * 60; // Initialize pomodoro time based on loaded settings
    renderAll(); // Then render everything
    updateDigitalClock(); // Start digital clock

    if (playerData.settings.firstVisit) {
        // Optional: Show a welcome message or tutorial hint
        // For now, just set it to false
        playerData.settings.firstVisit = false;
        saveData();
    }

}); // End DOMContentLoaded