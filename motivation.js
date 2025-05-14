// Motivation and Rewards System

// Global variables
let userPoints = 0;
let userLevel = 1;
let userAchievements = [];
let userChallenges = [];
// الاقتباسات العامة
let motivationalQuotes = [
    { quote: "العادات هي في البداية خيوط رفيعة، ومع التكرار تصبح كابلات تقيدنا.", author: "صموئيل جونسون", category: "general" },
    { quote: "نحن ما نفعله بشكل متكرر. التميز إذن، ليس فعلاً، بل عادة.", author: "أرسطو", category: "general" },
    { quote: "تتشكل العادات في البداية، ثم تشكلنا نحن.", author: "جون دريدن", category: "general" },
    { quote: "الانضباط هو الجسر بين الأهداف والإنجاز.", author: "جيم رون", category: "general" },
    { quote: "لا تقيس نجاحك بما حققته، بل بالعقبات التي تغلبت عليها.", author: "بوكر واشنطن", category: "general" },
    { quote: "الاتساق هو آخر ملاذ للخيال المحدود.", author: "أوسكار وايلد", category: "general" },
    { quote: "الخطوة الأولى هي أن تقرر أن لا تبقى حيث أنت.", author: "ج. رولينز", category: "general" },
    { quote: "لا تؤجل عملك إلى الغد ما يمكنك إنجازه اليوم.", author: "بنجامين فرانكلين", category: "general" },
    { quote: "التغيير لا يأتي دفعة واحدة، بل خطوة بخطوة.", author: "مارك توين", category: "general" },
    { quote: "الصبر والمثابرة لهما تأثير سحري يمكن من خلالهما التغلب على العقبات وتخطي الصعوبات.", author: "جون كوينسي آدامز", category: "general" },

    // اقتباسات للعادات الإيمانية والروحية
    { quote: "إن الله لا ينظر إلى صوركم وأموالكم، ولكن ينظر إلى قلوبكم وأعمالكم.", author: "حديث شريف", category: "spiritual" },
    { quote: "من سلك طريقاً يلتمس فيه علماً سهل الله له به طريقاً إلى الجنة.", author: "حديث شريف", category: "spiritual" },
    { quote: "خير الناس أنفعهم للناس.", author: "حديث شريف", category: "spiritual" },
    { quote: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.", author: "حديث شريف", category: "spiritual" },
    { quote: "أحب الأعمال إلى الله أدومها وإن قل.", author: "حديث شريف", category: "spiritual" },

    // اقتباسات للعادات الشخصية والإنتاجية
    { quote: "إدارة وقتك هي إدارة حياتك.", author: "آلان لاكين", category: "personal" },
    { quote: "لا تقل ليس لدي وقت، بل قل ليست لدي أولوية.", author: "تيم فيريس", category: "personal" },
    { quote: "الإنتاجية ليست في عمل أشياء أكثر، بل في التركيز على الأشياء المهمة.", author: "غاري كيلر", category: "personal" },
    { quote: "النجاح ليس مفتاح السعادة. السعادة هي مفتاح النجاح. إذا أحببت ما تفعله، ستنجح.", author: "ألبرت شفايتزر", category: "personal" },
    { quote: "الصحة هي التاج الذي يرتديه الأصحاء، ولا يراه إلا المرضى.", author: "مثل عربي", category: "personal" },

    // اقتباسات للعادات الاجتماعية والأخلاقية
    { quote: "الأخلاق الحسنة والذكاء دائماً ما يتحالفان.", author: "نيلسون مانديلا", category: "social" },
    { quote: "الكلمة الطيبة صدقة.", author: "حديث شريف", category: "social" },
    { quote: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه.", author: "حديث شريف", category: "social" },
    { quote: "من كان يؤمن بالله واليوم الآخر فليكرم جاره.", author: "حديث شريف", category: "social" },
    { quote: "صلة الرحم تزيد في العمر وتنفي الفقر.", author: "حديث شريف", category: "social" },

    // اقتباسات للعادات العقلية والفكرية
    { quote: "العقل السليم في الجسم السليم.", author: "جوفينال", category: "mental" },
    { quote: "القراءة للعقل كالرياضة للجسم.", author: "جوزيف أديسون", category: "mental" },
    { quote: "التعلم عملية مستمرة، والطريق إلى المعرفة لا نهاية له.", author: "بروس لي", category: "mental" },
    { quote: "العقل مثل المظلة، لا يعمل إلا عندما يكون مفتوحاً.", author: "روجر فون أوخ", category: "mental" },
    { quote: "المعرفة كالنور، كلما ازدادت رؤيتك، كلما رأيت أكثر.", author: "أبراهام هيشل", category: "mental" }
];

// Achievements data
const achievements = [
    {
        id: 'streak_7',
        name: 'أسبوع ملتزم',
        description: 'حافظ على سلسلة متتالية لمدة 7 أيام',
        icon: 'fa-fire',
        color: '#ffc107',
        points: 10,
        condition: (user) => user.longestStreak >= 7
    },
    {
        id: 'streak_30',
        name: 'شهر من الالتزام',
        description: 'حافظ على سلسلة متتالية لمدة 30 يوم',
        icon: 'fa-fire-alt',
        color: '#fd7e14',
        points: 50,
        condition: (user) => user.longestStreak >= 30
    },
    {
        id: 'streak_100',
        name: 'ملتزم محترف',
        description: 'حافظ على سلسلة متتالية لمدة 100 يوم',
        icon: 'fa-crown',
        color: '#ffc107',
        points: 200,
        condition: (user) => user.longestStreak >= 100
    },
    {
        id: 'habits_3',
        name: 'متعدد العادات',
        description: 'أضف 3 عادات مختلفة',
        icon: 'fa-layer-group',
        color: '#6f42c1',
        points: 15,
        condition: (user) => habits.length >= 3
    },
    {
        id: 'habits_5',
        name: 'جامع العادات',
        description: 'أضف 5 عادات مختلفة',
        icon: 'fa-cubes',
        color: '#6f42c1',
        points: 25,
        condition: (user) => habits.length >= 5
    },
    {
        id: 'complete_daily_all',
        name: 'يوم مثالي',
        description: 'أكمل جميع عاداتك اليومية في يوم واحد',
        icon: 'fa-calendar-check',
        color: '#28a745',
        points: 20,
        condition: (user) => user.completedAllToday
    },
    {
        id: 'complete_daily_all_7',
        name: 'أسبوع مثالي',
        description: 'أكمل جميع عاداتك اليومية لمدة 7 أيام متتالية',
        icon: 'fa-calendar-alt',
        color: '#28a745',
        points: 70,
        condition: (user) => user.perfectWeek
    },
    {
        id: 'complete_100',
        name: 'منجز 100',
        description: 'أكمل 100 عادة بشكل إجمالي',
        icon: 'fa-award',
        color: '#17a2b8',
        points: 100,
        condition: (user) => user.totalCompleted >= 100
    },
    {
        id: 'challenge_complete_1',
        name: 'متحدي',
        description: 'أكمل تحدي واحد بنجاح',
        icon: 'fa-trophy',
        color: '#fd7e14',
        points: 30,
        condition: (user) => user.completedChallenges >= 1
    },
    {
        id: 'challenge_complete_5',
        name: 'بطل التحديات',
        description: 'أكمل 5 تحديات بنجاح',
        icon: 'fa-medal',
        color: '#fd7e14',
        points: 150,
        condition: (user) => user.completedChallenges >= 5
    }
];

// Initialize motivation system
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();

    // Initialize achievements
    initializeAchievements();

    // Initialize challenges
    initializeChallenges();

    // Set up event listeners
    document.getElementById('view-all-achievements').addEventListener('click', openAchievementsModal);
    document.querySelector('.close-achievements-modal').addEventListener('click', closeAchievementsModal);
    document.getElementById('close-achievement-popup').addEventListener('click', closeAchievementPopup);
    document.getElementById('close-quote-popup').addEventListener('click', closeQuotePopup);

    document.getElementById('create-challenge-btn').addEventListener('click', openCreateChallengeModal);
    document.querySelector('.close-challenge-modal').addEventListener('click', closeCreateChallengeModal);
    document.getElementById('save-challenge').addEventListener('click', saveChallenge);
    document.getElementById('cancel-challenge').addEventListener('click', closeCreateChallengeModal);

    // Set up achievement tabs
    const achievementTabs = document.querySelectorAll('.achievement-tab');
    achievementTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            achievementTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderAchievementsGrid(this.dataset.tab);
        });
    });

    // Show motivational quote on first load (20% chance)
    if (Math.random() < 0.2) {
        showRandomQuote();
    }

    // Check for habits that need to be reset
    checkHabitsForReset();

    // Update UI
    updateUserStats();
    renderAchievements();
    renderChallenges();
});

// Check for habits that need to be reset based on their schedule
function checkHabitsForReset() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Get the last reset date from localStorage
    let lastResetDate = localStorage.getItem('lastHabitsResetDate');

    // If no reset date is stored or it's a different day, check for resets
    if (!lastResetDate || !todayStr.startsWith(lastResetDate.split('T')[0])) {
        // Store current date as last reset date
        localStorage.setItem('lastHabitsResetDate', todayStr);

        // Check each habit for reset
        habits.forEach(habit => {
            // Check if habit has a reset schedule
            if (habit.resetSchedule) {
                const lastReset = habit.lastReset ? new Date(habit.lastReset) : new Date(0);
                let shouldReset = false;

                // Check based on reset schedule type
                switch (habit.resetSchedule) {
                    case 'daily':
                        // Reset if last reset was not today
                        shouldReset = !isSameDay(lastReset, today);
                        break;
                    case 'weekly':
                        // Reset if it's the start of the week (Sunday) and last reset was not this week
                        if (today.getDay() === 0) { // Sunday
                            shouldReset = !isSameWeek(lastReset, today);
                        }
                        break;
                    case 'monthly':
                        // Reset if it's the first day of the month and last reset was not this month
                        if (today.getDate() === 1) {
                            shouldReset = !isSameMonth(lastReset, today);
                        }
                        break;
                    case 'custom':
                        // Custom reset logic can be added here
                        break;
                }

                // If habit should be reset
                if (shouldReset) {
                    resetHabit(habit);
                }
            }
        });

        // Save habits after potential resets
        saveHabits();
    }
}

// Reset a habit's progress
function resetHabit(habit) {
    const today = new Date();

    // Reset progress but keep the habit configuration
    habit.currentStreak = 0;

    // Clear logs older than the reset period
    if (habit.logs && habit.logs.length > 0) {
        // Keep only logs from today
        habit.logs = habit.logs.filter(log => {
            const logDate = new Date(log.date);
            return isSameDay(logDate, today);
        });
    }

    // Update last reset date
    habit.lastReset = today.toISOString();

    // Show notification about reset (optional)
    showHabitResetNotification(habit);
}

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Helper function to check if two dates are in the same week
function isSameWeek(date1, date2) {
    // Get the week number for both dates
    const getWeekNumber = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    };

    return date1.getFullYear() === date2.getFullYear() &&
           getWeekNumber(date1) === getWeekNumber(date2);
}

// Helper function to check if two dates are in the same month
function isSameMonth(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth();
}

// Show notification about habit reset
function showHabitResetNotification(habit) {
    // Create a toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-sync-alt"></i></div>
        <div class="toast-content">
            <div class="toast-title">تم إعادة تعيين العادة</div>
            <div class="toast-message">تم إعادة تعيين عادة "${habit.name}" وفقاً للجدول الزمني.</div>
        </div>
        <div class="toast-close"><i class="fas fa-times"></i></div>
    `;

    // Add to document
    document.body.appendChild(toast);

    // Add event listener to close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.classList.add('toast-hiding');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);

    // Show with animation
    setTimeout(() => {
        toast.classList.add('toast-visible');
    }, 10);
}

// Load user data from local storage
function loadUserData() {
    const savedUserData = localStorage.getItem('habitUserData');
    if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        userPoints = userData.points || 0;
        userLevel = userData.level || 1;
        userAchievements = userData.achievements || [];
        userChallenges = userData.challenges || [];
    }
}

// Save user data to local storage
function saveUserData() {
    const userData = {
        points: userPoints,
        level: userLevel,
        achievements: userAchievements,
        challenges: userChallenges
    };
    localStorage.setItem('habitUserData', JSON.stringify(userData));
}

// Initialize achievements
function initializeAchievements() {
    // Check for new achievements
    checkForNewAchievements();
}

// Check for new achievements
function checkForNewAchievements() {
    const userData = getUserData();

    achievements.forEach(achievement => {
        // Skip already earned achievements
        if (userAchievements.some(a => a.id === achievement.id)) {
            return;
        }

        // Check if achievement condition is met
        if (achievement.condition(userData)) {
            unlockAchievement(achievement);
        }
    });
}

// Get user data for achievement conditions
function getUserData() {
    const today = new Date().toISOString().split('T')[0];

    // Calculate total completed habits
    let totalCompleted = 0;
    habits.forEach(habit => {
        totalCompleted += habit.logs.filter(log => log.completed).length;
    });

    // Check if all habits are completed today
    const todayHabits = habits.filter(habit => isHabitScheduledForDate(habit, new Date()));
    const completedTodayHabits = todayHabits.filter(habit => {
        const todayLog = habit.logs.find(log => log.date.startsWith(today));
        return todayLog && todayLog.completed;
    });
    const completedAllToday = todayHabits.length > 0 && completedTodayHabits.length === todayHabits.length;

    // Check for perfect week
    const perfectWeek = checkPerfectWeek();

    // Get longest streak
    const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.longestStreak || 0), 0);

    // Count completed challenges
    const completedChallenges = userChallenges.filter(challenge => challenge.completed).length;

    return {
        totalCompleted,
        completedAllToday,
        perfectWeek,
        longestStreak,
        completedChallenges
    };
}

// Check if user had a perfect week
function checkPerfectWeek() {
    const today = new Date();
    let perfectDays = 0;

    // Check last 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Get habits scheduled for this day
        const dayHabits = habits.filter(habit => isHabitScheduledForDate(habit, date));
        if (dayHabits.length === 0) continue;

        // Check if all habits were completed
        const allCompleted = dayHabits.every(habit => {
            const log = habit.logs.find(log => log.date.startsWith(dateStr));
            return log && log.completed;
        });

        if (allCompleted) {
            perfectDays++;
        } else {
            break; // Break on first non-perfect day
        }
    }

    return perfectDays >= 7;
}

// Unlock a new achievement
function unlockAchievement(achievement) {
    // Add achievement to user's achievements
    userAchievements.push({
        id: achievement.id,
        unlockedAt: new Date().toISOString()
    });

    // Add points
    addPoints(achievement.points);

    // Save user data
    saveUserData();

    // Show achievement popup
    showAchievementPopup(achievement);

    // Update UI
    updateUserStats();
    renderAchievements();
}

// Show achievement popup
function showAchievementPopup(achievement) {
    document.getElementById('unlocked-badge').style.backgroundColor = achievement.color;
    document.getElementById('unlocked-badge').innerHTML = `<i class="fas ${achievement.icon}"></i>`;
    document.getElementById('unlocked-achievement-title').textContent = achievement.name;
    document.getElementById('unlocked-achievement-description').textContent = achievement.description;
    document.getElementById('unlocked-achievement-reward').textContent = `${achievement.points} نقطة`;

    document.getElementById('achievement-unlocked-modal').style.display = 'block';
}

// Close achievement popup
function closeAchievementPopup() {
    document.getElementById('achievement-unlocked-modal').style.display = 'none';
}

// Render achievements in the achievements container
function renderAchievements() {
    const container = document.getElementById('achievements-container');
    container.innerHTML = '';

    // Show up to 5 achievements (prioritize newest)
    const achievementsToShow = userAchievements
        .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
        .slice(0, 5);

    if (achievementsToShow.length === 0) {
        // Show some locked achievements as preview
        achievements.slice(0, 5).forEach(achievement => {
            const achievementItem = createAchievementItem(achievement, true);
            container.appendChild(achievementItem);
        });
    } else {
        // Show earned achievements
        achievementsToShow.forEach(userAchievement => {
            const achievement = achievements.find(a => a.id === userAchievement.id);
            if (achievement) {
                const achievementItem = createAchievementItem(achievement, false);
                container.appendChild(achievementItem);
            }
        });
    }
}

// Create achievement item element
function createAchievementItem(achievement, locked) {
    const achievementItem = document.createElement('div');
    achievementItem.className = 'achievement-item';
    achievementItem.addEventListener('click', () => openAchievementsModal());

    const badge = document.createElement('div');
    badge.className = `achievement-badge ${locked ? 'locked' : ''}`;
    badge.style.backgroundColor = achievement.color;
    badge.innerHTML = `<i class="fas ${achievement.icon}"></i>`;

    const name = document.createElement('div');
    name.className = 'achievement-name';
    name.textContent = achievement.name;

    const progress = document.createElement('div');
    progress.className = 'achievement-progress';
    progress.textContent = locked ? 'مقفل' : 'مكتمل';

    achievementItem.appendChild(badge);
    achievementItem.appendChild(name);
    achievementItem.appendChild(progress);

    return achievementItem;
}

// Open achievements modal
function openAchievementsModal() {
    renderAchievementsGrid('earned');
    document.getElementById('achievements-modal').style.display = 'block';
}

// Close achievements modal
function closeAchievementsModal() {
    document.getElementById('achievements-modal').style.display = 'none';
}

// Render achievements grid in modal
function renderAchievementsGrid(tab) {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';

    if (tab === 'earned') {
        // Show earned achievements
        if (userAchievements.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-achievements-message';
            emptyMessage.textContent = 'لم تحصل على أي إنجازات بعد. أكمل عاداتك بانتظام للحصول على شارات!';
            grid.appendChild(emptyMessage);
            return;
        }

        userAchievements.forEach(userAchievement => {
            const achievement = achievements.find(a => a.id === userAchievement.id);
            if (achievement) {
                const achievementItem = createDetailedAchievementItem(achievement, userAchievement.unlockedAt);
                grid.appendChild(achievementItem);
            }
        });
    } else {
        // Show locked achievements
        const lockedAchievements = achievements.filter(a => !userAchievements.some(ua => ua.id === a.id));

        if (lockedAchievements.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-achievements-message';
            emptyMessage.textContent = 'لقد حصلت على جميع الإنجازات المتاحة. رائع!';
            grid.appendChild(emptyMessage);
            return;
        }

        lockedAchievements.forEach(achievement => {
            const achievementItem = createDetailedAchievementItem(achievement, null);
            grid.appendChild(achievementItem);
        });
    }
}

// Create detailed achievement item for modal
function createDetailedAchievementItem(achievement, unlockedAt) {
    const locked = !unlockedAt;

    const achievementItem = document.createElement('div');
    achievementItem.className = 'achievement-item detailed';

    const badge = document.createElement('div');
    badge.className = `achievement-badge ${locked ? 'locked' : ''}`;
    badge.style.backgroundColor = achievement.color;
    badge.innerHTML = `<i class="fas ${achievement.icon}"></i>`;

    const name = document.createElement('div');
    name.className = 'achievement-name';
    name.textContent = achievement.name;

    const description = document.createElement('div');
    description.className = 'achievement-description';
    description.textContent = achievement.description;

    const footer = document.createElement('div');
    footer.className = 'achievement-footer';

    if (locked) {
        footer.textContent = `${achievement.points} نقطة`;
    } else {
        const date = new Date(unlockedAt);
        footer.textContent = `تم الحصول عليها: ${date.toLocaleDateString('ar-SA')}`;
    }

    achievementItem.appendChild(badge);
    achievementItem.appendChild(name);
    achievementItem.appendChild(description);
    achievementItem.appendChild(footer);

    return achievementItem;
}

// Initialize challenges
function initializeChallenges() {
    // Create weekly challenge if it doesn't exist
    const weeklyChallenge = userChallenges.find(c => c.id === 'weekly_challenge');
    if (!weeklyChallenge) {
        createWeeklyChallenge();
    }

    // Create category challenges if they don't exist
    const spiritualChallenge = userChallenges.find(c => c.id === 'spiritual_challenge');
    if (!spiritualChallenge) {
        createCategoryChallenges();
    }

    // Update weekly challenge progress
    updateWeeklyChallengeProgress();

    // Update category challenges progress
    updateCategoryChallengesProgress();
}

// Create category challenges
function createCategoryChallenges() {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);

    // العادات الإيمانية والروحية
    const spiritualChallenge = {
        id: 'spiritual_challenge',
        title: 'تحدي العادات الإيمانية',
        description: 'أكمل جميع العادات الإيمانية والروحية لمدة 7 أيام',
        type: 'streak',
        habits: habits.filter(h => h.categoryId === 'spiritual').map(h => h.id),
        goal: 7,
        progress: 0,
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
        reward: 70,
        completed: false,
        system: true
    };

    // العادات الشخصية والإنتاجية
    const personalChallenge = {
        id: 'personal_challenge',
        title: 'تحدي العادات الشخصية',
        description: 'أكمل جميع العادات الشخصية والإنتاجية لمدة 5 أيام',
        type: 'streak',
        habits: habits.filter(h => h.categoryId === 'personal').map(h => h.id),
        goal: 5,
        progress: 0,
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
        reward: 50,
        completed: false,
        system: true
    };

    // العادات الاجتماعية والأخلاقية
    const socialChallenge = {
        id: 'social_challenge',
        title: 'تحدي العادات الاجتماعية',
        description: 'أكمل جميع العادات الاجتماعية والأخلاقية لمدة 3 أيام',
        type: 'streak',
        habits: habits.filter(h => h.categoryId === 'social').map(h => h.id),
        goal: 3,
        progress: 0,
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
        reward: 30,
        completed: false,
        system: true
    };

    // العادات العقلية والفكرية
    const mentalChallenge = {
        id: 'mental_challenge',
        title: 'تحدي العادات العقلية',
        description: 'أكمل جميع العادات العقلية والفكرية لمدة 4 أيام',
        type: 'streak',
        habits: habits.filter(h => h.categoryId === 'mental').map(h => h.id),
        goal: 4,
        progress: 0,
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
        reward: 40,
        completed: false,
        system: true
    };

    userChallenges.push(spiritualChallenge, personalChallenge, socialChallenge, mentalChallenge);
    saveUserData();
}

// Update category challenges progress
function updateCategoryChallengesProgress() {
    const categoryChallenges = userChallenges.filter(c =>
        ['spiritual_challenge', 'personal_challenge', 'social_challenge', 'mental_challenge'].includes(c.id)
    );

    categoryChallenges.forEach(challenge => {
        if (challenge.completed) return;

        // Check if challenge is expired
        const now = new Date();
        const endDate = new Date(challenge.endDate);

        if (now > endDate) {
            // Complete challenge if goal was reached
            if (challenge.progress >= challenge.goal && !challenge.completed) {
                completeChallenge(challenge);
            }

            // Create new challenge
            const newEndDate = new Date(now);
            newEndDate.setDate(now.getDate() + 7);

            challenge.startDate = now.toISOString();
            challenge.endDate = newEndDate.toISOString();
            challenge.progress = 0;
            challenge.completed = false;

            saveUserData();
            return;
        }

        // Update progress based on perfect days for this category
        const categoryId = challenge.id.split('_')[0]; // Extract category ID from challenge ID
        challenge.progress = Math.min(challenge.goal, checkCategoryPerfectDaysInRange(categoryId, 7));

        saveUserData();
    });
}

// Check number of perfect days for a specific category in range
function checkCategoryPerfectDaysInRange(categoryId, days) {
    const today = new Date();
    let perfectDays = 0;

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        // Skip future days
        if (date > today) continue;

        const dateStr = date.toISOString().split('T')[0];

        // Get habits for this category scheduled for this day
        const dayHabits = habits.filter(habit =>
            habit.categoryId === categoryId && isHabitScheduledForDate(habit, date)
        );

        if (dayHabits.length === 0) continue;

        // Check if all habits were completed
        const allCompleted = dayHabits.every(habit => {
            const log = habit.logs.find(log => log.date.startsWith(dateStr));
            return log && log.completed;
        });

        if (allCompleted) {
            perfectDays++;
        }
    }

    return perfectDays;
}

// Create weekly challenge
function createWeeklyChallenge() {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);

    const weeklyChallenge = {
        id: 'weekly_challenge',
        title: 'تحدي الأسبوع',
        description: 'أكمل جميع عاداتك لمدة 7 أيام متتالية',
        type: 'streak',
        habits: 'all',
        goal: 7,
        progress: 0,
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
        reward: 50,
        completed: false,
        system: true
    };

    userChallenges.push(weeklyChallenge);
    saveUserData();
}

// Update weekly challenge progress
function updateWeeklyChallengeProgress() {
    const weeklyChallenge = userChallenges.find(c => c.id === 'weekly_challenge');
    if (!weeklyChallenge) return;

    // Check if challenge is expired
    const now = new Date();
    const endDate = new Date(weeklyChallenge.endDate);

    if (now > endDate) {
        // Complete challenge if goal was reached
        if (weeklyChallenge.progress >= weeklyChallenge.goal && !weeklyChallenge.completed) {
            completeChallenge(weeklyChallenge);
        }

        // Create new weekly challenge
        createWeeklyChallenge();
        return;
    }

    // Update progress based on perfect days
    weeklyChallenge.progress = Math.min(7, checkPerfectDaysInRange(7));

    // Update UI
    const progressElement = document.getElementById('weekly-challenge-progress');
    const progressTextElement = document.querySelector('.challenge-progress-text');
    const timerElement = document.getElementById('weekly-challenge-timer');

    if (progressElement && progressTextElement && timerElement) {
        const progressPercent = (weeklyChallenge.progress / weeklyChallenge.goal) * 100;
        progressElement.style.width = `${progressPercent}%`;
        progressTextElement.textContent = `${weeklyChallenge.progress}/${weeklyChallenge.goal} أيام`;

        // Calculate days remaining
        const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        timerElement.textContent = `${daysRemaining} أيام متبقية`;
    }

    saveUserData();
}

// Check number of perfect days in range
function checkPerfectDaysInRange(days) {
    const today = new Date();
    let perfectDays = 0;

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        // Skip future days
        if (date > today) continue;

        const dateStr = date.toISOString().split('T')[0];

        // Get habits scheduled for this day
        const dayHabits = habits.filter(habit => isHabitScheduledForDate(habit, date));
        if (dayHabits.length === 0) continue;

        // Check if all habits were completed
        const allCompleted = dayHabits.every(habit => {
            const log = habit.logs.find(log => log.date.startsWith(dateStr));
            return log && log.completed;
        });

        if (allCompleted) {
            perfectDays++;
        }
    }

    return perfectDays;
}

// Complete a challenge
function completeChallenge(challenge) {
    challenge.completed = true;

    // Add points
    addPoints(challenge.reward);

    // Check for achievement
    checkForNewAchievements();

    // Save user data
    saveUserData();
}

// Render challenges
function renderChallenges() {
    const container = document.getElementById('active-challenges');

    // Filter out system challenges and completed challenges
    const userCustomChallenges = userChallenges.filter(c => !c.system && !c.completed);

    if (userCustomChallenges.length === 0) {
        container.innerHTML = '<div class="empty-challenges-message">لا توجد تحديات نشطة. انقر على "تحدي جديد" لإنشاء تحدي.</div>';
        return;
    }

    container.innerHTML = '';

    userCustomChallenges.forEach(challenge => {
        const challengeItem = createChallengeItem(challenge);
        container.appendChild(challengeItem);
    });
}

// Create challenge item
function createChallengeItem(challenge) {
    const challengeItem = document.createElement('div');
    challengeItem.className = 'challenge-item';

    const header = document.createElement('div');
    header.className = 'challenge-header';

    const title = document.createElement('h4');
    title.textContent = challenge.title;

    const timer = document.createElement('span');
    timer.className = 'challenge-timer';

    // Calculate days remaining
    const now = new Date();
    const endDate = new Date(challenge.endDate);
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    timer.textContent = `${daysRemaining} أيام متبقية`;

    header.appendChild(title);
    header.appendChild(timer);

    const content = document.createElement('div');
    content.className = 'challenge-content';

    const description = document.createElement('div');
    description.className = 'challenge-description';
    description.textContent = challenge.description;

    const progressContainer = document.createElement('div');
    progressContainer.className = 'challenge-progress-container';

    const progressBar = document.createElement('div');
    progressBar.className = 'challenge-progress-bar';

    const progress = document.createElement('div');
    progress.className = 'challenge-progress';
    const progressPercent = (challenge.progress / challenge.goal) * 100;
    progress.style.width = `${progressPercent}%`;

    const progressText = document.createElement('div');
    progressText.className = 'challenge-progress-text';
    progressText.textContent = `${challenge.progress}/${challenge.goal} ${getGoalUnitText(challenge)}`;

    progressBar.appendChild(progress);
    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(progressText);

    const reward = document.createElement('div');
    reward.className = 'challenge-reward';

    const rewardLabel = document.createElement('span');
    rewardLabel.className = 'reward-label';
    rewardLabel.textContent = 'المكافأة:';

    const rewardValue = document.createElement('span');
    rewardValue.className = 'reward-value';
    rewardValue.textContent = `${challenge.reward} نقطة`;

    reward.appendChild(rewardLabel);
    reward.appendChild(rewardValue);

    content.appendChild(description);
    content.appendChild(progressContainer);
    content.appendChild(reward);

    challengeItem.appendChild(header);
    challengeItem.appendChild(content);

    return challengeItem;
}

// Get goal unit text based on challenge type
function getGoalUnitText(challenge) {
    switch (challenge.type) {
        case 'streak':
            return 'أيام';
        case 'completion':
            return 'مرات';
        case 'consistency':
            return '%';
        default:
            return '';
    }
}

// Open create challenge modal
function openCreateChallengeModal() {
    // Populate habits selector
    const habitsSelector = document.getElementById('challenge-habits-selector');
    habitsSelector.innerHTML = '';

    // Add "All habits" option
    const allHabitsOption = document.createElement('div');
    allHabitsOption.className = 'habit-checkbox';

    const allHabitsInput = document.createElement('input');
    allHabitsInput.type = 'checkbox';
    allHabitsInput.id = 'habit-all';
    allHabitsInput.value = 'all';

    const allHabitsLabel = document.createElement('label');
    allHabitsLabel.htmlFor = 'habit-all';
    allHabitsLabel.textContent = 'جميع العادات';

    allHabitsOption.appendChild(allHabitsInput);
    allHabitsOption.appendChild(allHabitsLabel);
    habitsSelector.appendChild(allHabitsOption);

    // Add individual habits
    habits.forEach(habit => {
        const habitOption = document.createElement('div');
        habitOption.className = 'habit-checkbox';

        const habitInput = document.createElement('input');
        habitInput.type = 'checkbox';
        habitInput.id = `habit-${habit.id}`;
        habitInput.value = habit.id;

        const habitLabel = document.createElement('label');
        habitLabel.htmlFor = `habit-${habit.id}`;
        habitLabel.textContent = habit.name;

        habitOption.appendChild(habitInput);
        habitOption.appendChild(habitLabel);
        habitsSelector.appendChild(habitOption);
    });

    // Show modal
    document.getElementById('create-challenge-modal').style.display = 'block';
}

// Close create challenge modal
function closeCreateChallengeModal() {
    document.getElementById('create-challenge-modal').style.display = 'none';
}

// Save new challenge
function saveChallenge() {
    const title = document.getElementById('challenge-title').value.trim();
    if (!title) {
        alert('يرجى إدخال عنوان للتحدي');
        return;
    }

    const type = document.getElementById('challenge-type').value;
    const goal = parseInt(document.getElementById('challenge-goal').value) || 7;
    const duration = parseInt(document.getElementById('challenge-duration').value) || 7;
    const durationUnit = document.getElementById('challenge-duration-unit').value;
    const reward = parseInt(document.getElementById('challenge-reward-points').value) || 20;

    // Get selected habits
    const allHabitsSelected = document.getElementById('habit-all').checked;
    let selectedHabits = 'all';

    if (!allHabitsSelected) {
        selectedHabits = [];
        habits.forEach(habit => {
            const checkbox = document.getElementById(`habit-${habit.id}`);
            if (checkbox && checkbox.checked) {
                selectedHabits.push(habit.id);
            }
        });

        if (selectedHabits.length === 0) {
            alert('يرجى اختيار عادة واحدة على الأقل');
            return;
        }
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date(startDate);

    switch (durationUnit) {
        case 'days':
            endDate.setDate(startDate.getDate() + duration);
            break;
        case 'weeks':
            endDate.setDate(startDate.getDate() + (duration * 7));
            break;
        case 'months':
            endDate.setMonth(startDate.getMonth() + duration);
            break;
    }

    // Create challenge
    const challenge = {
        id: 'challenge_' + Date.now(),
        title,
        description: getDescriptionFromType(type, goal),
        type,
        habits: selectedHabits,
        goal,
        progress: 0,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        reward,
        completed: false,
        system: false
    };

    userChallenges.push(challenge);
    saveUserData();

    // Close modal and update UI
    closeCreateChallengeModal();
    renderChallenges();
}

// Get description based on challenge type
function getDescriptionFromType(type, goal) {
    switch (type) {
        case 'streak':
            return `حافظ على سلسلة متتالية لمدة ${goal} أيام`;
        case 'completion':
            return `أكمل العادات ${goal} مرات`;
        case 'consistency':
            return `حافظ على نسبة إكمال ${goal}% أو أعلى`;
        default:
            return '';
    }
}

// Override the original toggleHabitComplete function to add points and check achievements
const originalToggleHabitComplete = window.toggleHabitComplete;
window.toggleHabitComplete = function(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    let todayLog = habit.logs.find(log => log.date.startsWith(todayStr));
    const wasCompleted = todayLog && todayLog.completed;

    // Call original function
    originalToggleHabitComplete(habitId);

    // Reload log after original function
    todayLog = habit.logs.find(log => log.date.startsWith(todayStr));
    const isNowCompleted = todayLog && todayLog.completed;

    // Only add points if habit was completed (not uncompleted)
    if (!wasCompleted && isNowCompleted) {
        // Add points for completing a habit
        addPoints(5);

        // Show motivational quote (15% chance)
        if (Math.random() < 0.15) {
            // Show quote specific to the habit's category
            showRandomQuote(habit.categoryId);
        }

        // Check for new achievements
        checkForNewAchievements();

        // Update challenges
        updateChallenges();
    }

    // Update UI
    updateUserStats();
};

// Update challenges progress
function updateChallenges() {
    userChallenges.forEach(challenge => {
        if (challenge.completed) return;

        // Update progress based on challenge type
        switch (challenge.type) {
            case 'streak':
                // For streak challenges, progress is the current streak
                if (challenge.habits === 'all') {
                    challenge.progress = checkPerfectDaysInRange(challenge.goal);
                } else {
                    // For specific habits, get the minimum streak
                    const habitIds = Array.isArray(challenge.habits) ? challenge.habits : [challenge.habits];
                    const streaks = habitIds.map(id => {
                        const habit = habits.find(h => h.id === id);
                        return habit ? habit.currentStreak : 0;
                    });
                    challenge.progress = Math.min(...streaks);
                }
                break;

            case 'completion':
                // For completion challenges, count completed logs in date range
                const startDate = new Date(challenge.startDate);
                const now = new Date();
                let completionCount = 0;

                if (challenge.habits === 'all') {
                    // Count all habit completions
                    habits.forEach(habit => {
                        completionCount += habit.logs.filter(log => {
                            const logDate = new Date(log.date);
                            return log.completed && logDate >= startDate && logDate <= now;
                        }).length;
                    });
                } else {
                    // Count specific habit completions
                    const habitIds = Array.isArray(challenge.habits) ? challenge.habits : [challenge.habits];
                    habitIds.forEach(id => {
                        const habit = habits.find(h => h.id === id);
                        if (habit) {
                            completionCount += habit.logs.filter(log => {
                                const logDate = new Date(log.date);
                                return log.completed && logDate >= startDate && logDate <= now;
                            }).length;
                        }
                    });
                }

                challenge.progress = completionCount;
                break;

            case 'consistency':
                // For consistency challenges, calculate completion percentage
                const endDate = new Date(challenge.endDate);
                const daysTotal = Math.min(
                    Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)),
                    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
                );

                let daysCompleted = 0;

                for (let i = 0; i < daysTotal; i++) {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + i);
                    const dateStr = date.toISOString().split('T')[0];

                    if (challenge.habits === 'all') {
                        // Check if all scheduled habits were completed
                        const dayHabits = habits.filter(habit => isHabitScheduledForDate(habit, date));
                        if (dayHabits.length === 0) continue;

                        const allCompleted = dayHabits.every(habit => {
                            const log = habit.logs.find(log => log.date.startsWith(dateStr));
                            return log && log.completed;
                        });

                        if (allCompleted) {
                            daysCompleted++;
                        }
                    } else {
                        // Check if specific habits were completed
                        const habitIds = Array.isArray(challenge.habits) ? challenge.habits : [challenge.habits];
                        const dayHabits = habits.filter(habit =>
                            habitIds.includes(habit.id) && isHabitScheduledForDate(habit, date)
                        );

                        if (dayHabits.length === 0) continue;

                        const allCompleted = dayHabits.every(habit => {
                            const log = habit.logs.find(log => log.date.startsWith(dateStr));
                            return log && log.completed;
                        });

                        if (allCompleted) {
                            daysCompleted++;
                        }
                    }
                }

                challenge.progress = daysTotal > 0 ? Math.round((daysCompleted / daysTotal) * 100) : 0;
                break;
        }

        // Check if challenge is completed
        if (challenge.progress >= challenge.goal) {
            completeChallenge(challenge);
        }
    });

    // Update weekly challenge UI
    updateWeeklyChallengeProgress();

    // Update challenges UI
    renderChallenges();

    // Save user data
    saveUserData();
}

// Show random motivational quote
function showRandomQuote(categoryId = null) {
    // Filter quotes by category if provided, otherwise use general quotes
    let filteredQuotes = categoryId
        ? motivationalQuotes.filter(q => q.category === categoryId)
        : motivationalQuotes.filter(q => q.category === 'general');

    // If no quotes found for the category, fall back to general quotes
    if (filteredQuotes.length === 0) {
        filteredQuotes = motivationalQuotes.filter(q => q.category === 'general');
    }

    // Select a random quote from the filtered list
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

    // Update the quote modal
    document.getElementById('motivational-quote').textContent = `"${randomQuote.quote}"`;
    document.getElementById('quote-author').textContent = `- ${randomQuote.author}`;

    // Show the modal
    document.getElementById('motivational-quote-modal').style.display = 'block';
}

// Close quote popup
function closeQuotePopup() {
    document.getElementById('motivational-quote-modal').style.display = 'none';
}

// Add points to user
function addPoints(points) {
    userPoints += points;

    // Check for level up
    checkForLevelUp();
}

// Check if user should level up
function checkForLevelUp() {
    const pointsForNextLevel = calculatePointsForLevel(userLevel + 1);

    if (userPoints >= pointsForNextLevel) {
        userLevel++;
        // Could show level up notification here
    }
}

// Calculate points needed for a level
function calculatePointsForLevel(level) {
    return 100 * Math.pow(level, 1.5);
}

// Calculate progress to next level (0-100)
function calculateLevelProgress() {
    const currentLevelPoints = calculatePointsForLevel(userLevel);
    const nextLevelPoints = calculatePointsForLevel(userLevel + 1);
    const pointsInCurrentLevel = userPoints - currentLevelPoints;
    const pointsNeededForNextLevel = nextLevelPoints - currentLevelPoints;

    return Math.min(100, Math.floor((pointsInCurrentLevel / pointsNeededForNextLevel) * 100));
}

// Update user stats in UI
function updateUserStats() {
    document.getElementById('total-points').textContent = userPoints;
    document.getElementById('user-level').textContent = userLevel;

    // Update level progress bar
    const progress = calculateLevelProgress();
    document.getElementById('level-progress-bar').style.width = `${progress}%`;

    // Update new badges count
    const newBadgesCount = userAchievements.filter(a => {
        const unlockedDate = new Date(a.unlockedAt);
        const now = new Date();
        const daysDiff = (now - unlockedDate) / (1000 * 60 * 60 * 24);
        return daysDiff < 7; // Consider badges from last 7 days as "new"
    }).length;

    const badgeCountElement = document.getElementById('new-badges-count');
    if (newBadgesCount > 0) {
        badgeCountElement.textContent = newBadgesCount;
        badgeCountElement.style.display = 'flex';
    } else {
        badgeCountElement.style.display = 'none';
    }
}
