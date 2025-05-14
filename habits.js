// Habits Tracking Functionality

// Global variables
let habits = [];
let currentEditHabitId = null;
let habitIcons = {
    general: ['fa-check-circle', 'fa-star', 'fa-heart', 'fa-bell', 'fa-bookmark', 'fa-calendar', 'fa-flag'],
    health: ['fa-apple-alt', 'fa-running', 'fa-heartbeat', 'fa-bed', 'fa-weight', 'fa-pills', 'fa-medkit'],
    education: ['fa-book', 'fa-graduation-cap', 'fa-pencil-alt', 'fa-brain', 'fa-language', 'fa-calculator', 'fa-laptop-code'],
    productivity: ['fa-tasks', 'fa-clock', 'fa-briefcase', 'fa-calendar-check', 'fa-list-ul', 'fa-laptop', 'fa-chart-line'],
    finance: ['fa-money-bill-wave', 'fa-piggy-bank', 'fa-wallet', 'fa-chart-bar', 'fa-dollar-sign', 'fa-credit-card', 'fa-coins'],
    social: ['fa-users', 'fa-comments', 'fa-phone', 'fa-envelope', 'fa-handshake', 'fa-user-friends', 'fa-share-alt']
};

// Initialize habits tracking
document.addEventListener('DOMContentLoaded', function() {
    // Load saved habits
    loadHabits();

    // Initialize tabs
    document.getElementById('tasks-tab').addEventListener('click', showTasksView);
    document.getElementById('habits-tab').addEventListener('click', showHabitsView);

    // Initialize habit form
    document.getElementById('add-habit-btn').addEventListener('click', openAddHabitModal);
    document.getElementById('habit-type').addEventListener('change', toggleHabitGoalContainer);
    document.getElementById('habit-frequency').addEventListener('change', toggleHabitFrequencyOptions);
    document.getElementById('habit-unit').addEventListener('change', toggleCustomUnitInput);
    document.getElementById('save-habit').addEventListener('click', saveHabit);
    document.getElementById('cancel-habit').addEventListener('click', closeHabitModal);

    // Initialize color presets
    const colorPresets = document.querySelectorAll('.color-preset');
    colorPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            document.getElementById('habit-color').value = this.dataset.color;
            colorPresets.forEach(p => p.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Initialize icon picker
    document.getElementById('show-icons').addEventListener('click', openIconPicker);
    document.querySelector('.close-icon-modal').addEventListener('click', closeIconPicker);
    document.querySelector('.close-habit-modal').addEventListener('click', closeHabitModal);
    document.querySelector('.close-habit-details-modal').addEventListener('click', closeHabitDetailsModal);

    // Initialize icon categories
    const iconCategories = document.querySelectorAll('.icon-category-btn');
    iconCategories.forEach(category => {
        category.addEventListener('click', function() {
            iconCategories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            populateIcons(this.dataset.category);
        });
    });

    // Initialize icon search
    document.getElementById('icon-search').addEventListener('input', searchIcons);

    // Initialize habit details modal
    document.getElementById('edit-habit-btn').addEventListener('click', editHabitFromDetails);
    document.getElementById('delete-habit-btn').addEventListener('click', deleteHabitFromDetails);

    // Generate month days selector
    generateMonthDaysSelector();

    // Initialize week calendar
    generateWeekCalendar();

    // Render habits
    renderHabits();

    // Update stats
    updateHabitStats();
});

// Load habits from local storage
function loadHabits() {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
    } else {
        // Add sample habits if no habits exist
        addSampleHabits();
    }
}

// Sample habits for testing
function addSampleHabits() {
    if (habits.length === 0) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        habits = [
            // العادات الإيمانية والروحية
            {
                id: 'habit1',
                name: 'الصلوات الخمس في وقتها',
                description: 'أداء الصلوات الخمس في أوقاتها',
                icon: 'fa-pray',
                color: '#28a745',
                frequency: 'daily',
                timeOfDay: 'anytime',
                categoryId: 'spiritual',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 5,
                longestStreak: 10,
                totalCompletions: 25,
                logs: [
                    { date: today.toISOString().split('T')[0], completed: false },
                    { date: yesterday.toISOString().split('T')[0], completed: true }
                ]
            },
            {
                id: 'habit2',
                name: 'قراءة القرآن',
                description: 'قراءة 5 صفحات من القرآن يومياً',
                icon: 'fa-book',
                color: '#28a745',
                frequency: 'daily',
                timeOfDay: 'evening',
                categoryId: 'spiritual',
                type: 'counter',
                goal: 5,
                unit: 'صفحات',
                createdAt: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 3,
                longestStreak: 7,
                totalCompletions: 18,
                logs: [
                    { date: today.toISOString().split('T')[0], completed: false, value: 0 },
                    { date: yesterday.toISOString().split('T')[0], completed: true, value: 5 }
                ]
            },
            {
                id: 'habit3',
                name: 'الأذكار الصباحية',
                description: 'قراءة أذكار الصباح بعد صلاة الفجر',
                icon: 'fa-sun',
                color: '#28a745',
                frequency: 'daily',
                timeOfDay: 'morning',
                categoryId: 'spiritual',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 2,
                longestStreak: 5,
                totalCompletions: 12,
                logs: []
            },
            {
                id: 'habit4',
                name: 'الأذكار المسائية',
                description: 'قراءة أذكار المساء بعد صلاة العصر',
                icon: 'fa-moon',
                color: '#28a745',
                frequency: 'daily',
                timeOfDay: 'evening',
                categoryId: 'spiritual',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 2,
                longestStreak: 5,
                totalCompletions: 12,
                logs: []
            },
            {
                id: 'habit5',
                name: 'صلاة الجمعة',
                description: 'أداء صلاة الجمعة في المسجد',
                icon: 'fa-mosque',
                color: '#28a745',
                frequency: 'weekly',
                days: [5], // Friday
                timeOfDay: 'afternoon',
                categoryId: 'spiritual',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 2,
                longestStreak: 5,
                totalCompletions: 12,
                logs: []
            },
            {
                id: 'habit6',
                name: 'صيام النوافل',
                description: 'صيام الاثنين والخميس',
                icon: 'fa-utensils',
                color: '#28a745',
                frequency: 'weekly',
                days: [1, 4], // Monday, Thursday
                timeOfDay: 'anytime',
                categoryId: 'spiritual',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 2,
                longestStreak: 5,
                totalCompletions: 12,
                logs: []
            },

            // العادات الشخصية والإنتاجية
            {
                id: 'habit7',
                name: 'ممارسة الرياضة',
                description: 'ممارسة التمارين الرياضية لمدة 30 دقيقة',
                icon: 'fa-running',
                color: '#17a2b8',
                frequency: 'daily',
                timeOfDay: 'morning',
                categoryId: 'personal',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 3,
                longestStreak: 8,
                totalCompletions: 15,
                logs: [
                    { date: today.toISOString().split('T')[0], completed: false },
                    { date: yesterday.toISOString().split('T')[0], completed: true }
                ]
            },
            {
                id: 'habit8',
                name: 'شرب الماء',
                description: 'شرب 8 أكواب من الماء يومياً',
                icon: 'fa-tint',
                color: '#17a2b8',
                frequency: 'daily',
                timeOfDay: 'anytime',
                categoryId: 'personal',
                type: 'counter',
                goal: 8,
                unit: 'أكواب',
                createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 4,
                longestStreak: 9,
                totalCompletions: 20,
                logs: [
                    { date: today.toISOString().split('T')[0], completed: false, value: 2 },
                    { date: yesterday.toISOString().split('T')[0], completed: true, value: 8 }
                ]
            },
            {
                id: 'habit9',
                name: 'النوم المبكر',
                description: 'النوم قبل الساعة 11 مساءً',
                icon: 'fa-bed',
                color: '#17a2b8',
                frequency: 'daily',
                timeOfDay: 'evening',
                categoryId: 'personal',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 2,
                longestStreak: 6,
                totalCompletions: 10,
                logs: []
            },
            {
                id: 'habit10',
                name: 'التخطيط اليومي',
                description: 'تخطيط المهام والأهداف اليومية',
                icon: 'fa-tasks',
                color: '#17a2b8',
                frequency: 'daily',
                timeOfDay: 'morning',
                categoryId: 'personal',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 7,
                longestStreak: 12,
                totalCompletions: 22,
                logs: []
            },
            {
                id: 'habit11',
                name: 'مراجعة الأهداف الأسبوعية',
                description: 'مراجعة وتقييم الأهداف الأسبوعية',
                icon: 'fa-clipboard-check',
                color: '#17a2b8',
                frequency: 'weekly',
                days: [0], // Sunday
                timeOfDay: 'evening',
                categoryId: 'personal',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 3,
                longestStreak: 4,
                totalCompletions: 8,
                logs: []
            },
            {
                id: 'habit12',
                name: 'القراءة',
                description: 'قراءة 20 صفحة من كتاب',
                icon: 'fa-book-reader',
                color: '#17a2b8',
                frequency: 'daily',
                timeOfDay: 'evening',
                categoryId: 'personal',
                type: 'counter',
                goal: 20,
                unit: 'صفحة',
                createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 5,
                longestStreak: 14,
                totalCompletions: 25,
                logs: []
            },

            // العادات الاجتماعية والأخلاقية
            {
                id: 'habit13',
                name: 'التواصل مع الوالدين',
                description: 'الاتصال أو زيارة الوالدين',
                icon: 'fa-phone',
                color: '#fd7e14',
                frequency: 'daily',
                timeOfDay: 'evening',
                categoryId: 'social',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 6,
                longestStreak: 11,
                totalCompletions: 20,
                logs: []
            },
            {
                id: 'habit14',
                name: 'صلة الرحم',
                description: 'التواصل مع الأقارب',
                icon: 'fa-users',
                color: '#fd7e14',
                frequency: 'weekly',
                days: [5], // Friday
                timeOfDay: 'afternoon',
                categoryId: 'social',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 22 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 3,
                longestStreak: 7,
                totalCompletions: 15,
                logs: []
            },
            {
                id: 'habit15',
                name: 'مساعدة الآخرين',
                description: 'القيام بعمل خير واحد على الأقل',
                icon: 'fa-hands-helping',
                color: '#fd7e14',
                frequency: 'daily',
                timeOfDay: 'anytime',
                categoryId: 'social',
                type: 'counter',
                goal: 1,
                unit: 'مرات',
                createdAt: new Date(today.getTime() - 16 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 4,
                longestStreak: 8,
                totalCompletions: 18,
                logs: []
            },
            {
                id: 'habit16',
                name: 'ضبط النفس عند الغضب',
                description: 'التحكم في الانفعالات والغضب',
                icon: 'fa-balance-scale',
                color: '#fd7e14',
                frequency: 'daily',
                timeOfDay: 'anytime',
                categoryId: 'social',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 5,
                longestStreak: 9,
                totalCompletions: 16,
                logs: []
            },
            {
                id: 'habit17',
                name: 'العمل التطوعي',
                description: 'المشاركة في عمل تطوعي',
                icon: 'fa-hand-holding-heart',
                color: '#fd7e14',
                frequency: 'weekly',
                days: [6], // Saturday
                timeOfDay: 'morning',
                categoryId: 'social',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 2,
                longestStreak: 4,
                totalCompletions: 8,
                logs: []
            },

            // العادات العقلية والفكرية
            {
                id: 'habit18',
                name: 'حل الألغاز الذهنية',
                description: 'حل ألغاز أو تحديات ذهنية لمدة 15 دقيقة',
                icon: 'fa-puzzle-piece',
                color: '#6f42c1',
                frequency: 'daily',
                timeOfDay: 'evening',
                categoryId: 'mental',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 4,
                longestStreak: 7,
                totalCompletions: 14,
                logs: []
            },
            {
                id: 'habit19',
                name: 'تعلم لغة جديدة',
                description: 'تعلم لغة جديدة لمدة 20 دقيقة',
                icon: 'fa-language',
                color: '#6f42c1',
                frequency: 'daily',
                timeOfDay: 'afternoon',
                categoryId: 'mental',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 19 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 3,
                longestStreak: 10,
                totalCompletions: 15,
                logs: []
            },
            {
                id: 'habit20',
                name: 'الاستماع لمحتوى تعليمي',
                description: 'الاستماع لبودكاست أو محتوى تعليمي',
                icon: 'fa-headphones',
                color: '#6f42c1',
                frequency: 'daily',
                timeOfDay: 'anytime',
                categoryId: 'mental',
                type: 'counter',
                goal: 30,
                unit: 'دقيقة',
                createdAt: new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 5,
                longestStreak: 8,
                totalCompletions: 17,
                logs: []
            },
            {
                id: 'habit21',
                name: 'كتابة أفكار جديدة',
                description: 'كتابة 3 أفكار جديدة',
                icon: 'fa-lightbulb',
                color: '#6f42c1',
                frequency: 'daily',
                timeOfDay: 'evening',
                categoryId: 'mental',
                type: 'counter',
                goal: 3,
                unit: 'أفكار',
                createdAt: new Date(today.getTime() - 17 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 2,
                longestStreak: 6,
                totalCompletions: 12,
                logs: []
            },
            {
                id: 'habit22',
                name: 'قراءة الأخبار',
                description: 'قراءة الأخبار والمستجدات',
                icon: 'fa-newspaper',
                color: '#6f42c1',
                frequency: 'daily',
                timeOfDay: 'morning',
                categoryId: 'mental',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 7,
                longestStreak: 12,
                totalCompletions: 22,
                logs: []
            },
            {
                id: 'habit23',
                name: 'مشاهدة وثائقي تعليمي',
                description: 'مشاهدة فيلم وثائقي تعليمي',
                icon: 'fa-film',
                color: '#6f42c1',
                frequency: 'weekly',
                days: [2], // Tuesday
                timeOfDay: 'evening',
                categoryId: 'mental',
                type: 'boolean',
                createdAt: new Date(today.getTime() - 24 * 24 * 60 * 60 * 1000).toISOString(),
                currentStreak: 3,
                longestStreak: 5,
                totalCompletions: 10,
                logs: []
            }
        ];

        saveHabits();
    }
}

// Save habits to local storage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Show tasks view
function showTasksView() {
    document.getElementById('tasks-tab').classList.add('active');
    document.getElementById('habits-tab').classList.remove('active');
    document.getElementById('tasks-view').classList.add('active-view');
    document.getElementById('habits-view').classList.remove('active-view');
}

// Show habits view
function showHabitsView() {
    document.getElementById('tasks-tab').classList.remove('active');
    document.getElementById('habits-tab').classList.add('active');
    document.getElementById('tasks-view').classList.remove('active-view');
    document.getElementById('habits-view').classList.add('active-view');

    // Refresh habits view
    renderHabits();
    updateHabitStats();
    generateWeekCalendar();
}

// Toggle habit goal container based on habit type
function toggleHabitGoalContainer() {
    const habitType = document.getElementById('habit-type').value;
    const goalContainer = document.getElementById('habit-goal-container');

    if (habitType === 'boolean') {
        goalContainer.style.display = 'none';
    } else {
        goalContainer.style.display = 'block';
    }
}

// Toggle habit frequency options
function toggleHabitFrequencyOptions() {
    const frequency = document.getElementById('habit-frequency').value;
    const daysContainer = document.getElementById('habit-days-container');
    const datesContainer = document.getElementById('habit-dates-container');

    daysContainer.style.display = 'none';
    datesContainer.style.display = 'none';

    if (frequency === 'weekly') {
        daysContainer.style.display = 'block';
    } else if (frequency === 'monthly') {
        datesContainer.style.display = 'block';
    }
}

// Toggle custom unit input
function toggleCustomUnitInput() {
    const unit = document.getElementById('habit-unit').value;
    const customUnitInput = document.getElementById('habit-custom-unit');

    if (unit === 'custom') {
        customUnitInput.style.display = 'block';
    } else {
        customUnitInput.style.display = 'none';
    }
}

// Generate month days selector
function generateMonthDaysSelector() {
    const container = document.getElementById('month-days-selector');
    container.innerHTML = '';

    for (let i = 1; i <= 31; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'month-day';
        dayElement.textContent = i;
        dayElement.dataset.day = i;

        dayElement.addEventListener('click', function() {
            this.classList.toggle('selected');
        });

        container.appendChild(dayElement);
    }
}

// Open add habit modal
function openAddHabitModal() {
    currentEditHabitId = null;
    document.getElementById('habit-modal-title').textContent = 'إضافة عادة جديدة';
    document.getElementById('habit-name').value = '';
    document.getElementById('habit-type').value = 'boolean';
    document.getElementById('habit-goal').value = '1';
    document.getElementById('habit-unit').value = 'مرات';
    document.getElementById('habit-custom-unit').value = '';
    document.getElementById('habit-frequency').value = 'daily';
    document.getElementById('habit-reminder-time').value = '';
    document.getElementById('habit-reset-schedule').value = '';
    document.getElementById('habit-color').value = '#4a6fa5';
    document.getElementById('habit-icon').value = 'fa-check-circle';
    document.getElementById('habit-icon-preview').className = 'fas fa-check-circle';
    document.getElementById('habit-notes').value = '';

    // Reset weekday checkboxes
    const weekdayCheckboxes = document.querySelectorAll('#habit-days-container input[type="checkbox"]');
    weekdayCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset month days
    const monthDays = document.querySelectorAll('.month-day');
    monthDays.forEach(day => {
        day.classList.remove('selected');
    });

    // Reset color presets
    const colorPresets = document.querySelectorAll('.color-preset');
    colorPresets.forEach(preset => {
        preset.classList.remove('selected');
    });

    // Select the first color preset
    document.querySelector('.color-preset').classList.add('selected');

    // Show/hide containers based on initial values
    toggleHabitGoalContainer();
    toggleHabitFrequencyOptions();
    toggleCustomUnitInput();

    // Clear reminders list
    document.getElementById('habit-reminders-list').innerHTML = '';

    // Show modal
    document.getElementById('habit-modal').style.display = 'block';
}

// Open edit habit modal
function openEditHabitModal(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    currentEditHabitId = habitId;
    document.getElementById('habit-modal-title').textContent = 'تعديل العادة';
    document.getElementById('habit-name').value = habit.name;
    document.getElementById('habit-type').value = habit.type;
    document.getElementById('habit-goal').value = habit.goal || '1';
    document.getElementById('habit-unit').value = habit.unit || 'مرات';
    document.getElementById('habit-custom-unit').value = habit.customUnit || '';
    document.getElementById('habit-frequency').value = habit.frequency;
    document.getElementById('habit-reminder-time').value = habit.reminderTime || '';
    document.getElementById('habit-reset-schedule').value = habit.resetSchedule || '';
    document.getElementById('habit-color').value = habit.color || '#4a6fa5';
    document.getElementById('habit-icon').value = habit.icon || 'fa-check-circle';
    document.getElementById('habit-icon-preview').className = 'fas ' + habit.icon;
    document.getElementById('habit-notes').value = habit.notes || '';

    // Set weekday checkboxes
    const weekdayCheckboxes = document.querySelectorAll('#habit-days-container input[type="checkbox"]');
    weekdayCheckboxes.forEach(checkbox => {
        checkbox.checked = habit.days && habit.days.includes(parseInt(checkbox.value));
    });

    // Set month days
    const monthDays = document.querySelectorAll('.month-day');
    monthDays.forEach(day => {
        day.classList.remove('selected');
        if (habit.dates && habit.dates.includes(parseInt(day.dataset.day))) {
            day.classList.add('selected');
        }
    });

    // Set color presets
    const colorPresets = document.querySelectorAll('.color-preset');
    colorPresets.forEach(preset => {
        preset.classList.remove('selected');
        if (preset.dataset.color === habit.color) {
            preset.classList.add('selected');
        }
    });

    // Show/hide containers based on values
    toggleHabitGoalContainer();
    toggleHabitFrequencyOptions();
    toggleCustomUnitInput();

    // Render reminders
    renderHabitReminders(habit.reminders || []);

    // Show modal
    document.getElementById('habit-modal').style.display = 'block';
}

// Close habit modal
function closeHabitModal() {
    document.getElementById('habit-modal').style.display = 'none';
}

// Open icon picker
function openIconPicker() {
    populateIcons('general');
    document.getElementById('icon-picker-modal').style.display = 'block';
}

// Close icon picker
function closeIconPicker() {
    document.getElementById('icon-picker-modal').style.display = 'none';
}

// Populate icons
function populateIcons(category) {
    const container = document.getElementById('icons-container');
    container.innerHTML = '';

    const icons = habitIcons[category] || habitIcons.general;

    icons.forEach(icon => {
        const iconElement = document.createElement('div');
        iconElement.className = 'icon-item';
        iconElement.innerHTML = `<i class="fas ${icon}"></i>`;

        iconElement.addEventListener('click', function() {
            document.getElementById('habit-icon').value = icon;
            document.getElementById('habit-icon-preview').className = 'fas ' + icon;
            closeIconPicker();
        });

        container.appendChild(iconElement);
    });
}

// Search icons
function searchIcons() {
    const searchTerm = document.getElementById('icon-search').value.toLowerCase();
    const iconItems = document.querySelectorAll('.icon-item');

    iconItems.forEach(item => {
        const iconClass = item.querySelector('i').className;
        if (iconClass.toLowerCase().includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Save habit
function saveHabit() {
    const name = document.getElementById('habit-name').value.trim();
    if (!name) {
        alert('يرجى إدخال اسم العادة');
        return;
    }

    const type = document.getElementById('habit-type').value;
    const frequency = document.getElementById('habit-frequency').value;

    // Get goal and unit if applicable
    let goal = null;
    let unit = null;
    let customUnit = null;

    if (type !== 'boolean') {
        goal = parseInt(document.getElementById('habit-goal').value) || 1;
        unit = document.getElementById('habit-unit').value;

        if (unit === 'custom') {
            customUnit = document.getElementById('habit-custom-unit').value.trim();
            if (!customUnit) {
                alert('يرجى إدخال وحدة مخصصة');
                return;
            }
        }
    }

    // Get days if weekly frequency
    let days = [];
    if (frequency === 'weekly') {
        const weekdayCheckboxes = document.querySelectorAll('#habit-days-container input[type="checkbox"]:checked');
        days = Array.from(weekdayCheckboxes).map(checkbox => parseInt(checkbox.value));

        if (days.length === 0) {
            alert('يرجى اختيار يوم واحد على الأقل من أيام الأسبوع');
            return;
        }
    }

    // Get dates if monthly frequency
    let dates = [];
    if (frequency === 'monthly') {
        const selectedDays = document.querySelectorAll('.month-day.selected');
        dates = Array.from(selectedDays).map(day => parseInt(day.dataset.day));

        if (dates.length === 0) {
            alert('يرجى اختيار يوم واحد على الأقل من أيام الشهر');
            return;
        }
    }

    const habit = {
        id: currentEditHabitId || Date.now(),
        name,
        type,
        goal,
        unit,
        customUnit,
        frequency,
        days,
        dates,
        color: document.getElementById('habit-color').value,
        icon: document.getElementById('habit-icon').value,
        notes: document.getElementById('habit-notes').value.trim(),
        reminderTime: document.getElementById('habit-reminder-time').value,
        resetSchedule: document.getElementById('habit-reset-schedule').value,
        createdAt: currentEditHabitId ? (habits.find(h => h.id === currentEditHabitId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
        logs: currentEditHabitId ? (habits.find(h => h.id === currentEditHabitId)?.logs || []) : [],
        currentStreak: currentEditHabitId ? (habits.find(h => h.id === currentEditHabitId)?.currentStreak || 0) : 0,
        longestStreak: currentEditHabitId ? (habits.find(h => h.id === currentEditHabitId)?.longestStreak || 0) : 0,
        lastReset: currentEditHabitId ? (habits.find(h => h.id === currentEditHabitId)?.lastReset || null) : null
    };

    if (currentEditHabitId) {
        // Update existing habit
        const index = habits.findIndex(h => h.id === currentEditHabitId);
        if (index !== -1) {
            habits[index] = habit;
        }
    } else {
        // Add new habit
        habits.push(habit);
    }

    // Save habits
    saveHabits();

    // Close modal
    closeHabitModal();

    // Render habits
    renderHabits();

    // Update stats
    updateHabitStats();

    // Update week calendar
    generateWeekCalendar();
}

// Render habits
function renderHabits() {
    const habitsList = document.getElementById('habits-list');
    habitsList.innerHTML = '';

    if (habits.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-habits-message';
        emptyMessage.textContent = 'لم تقم بإضافة أي عادات بعد. انقر على "إضافة عادة جديدة" للبدء.';
        habitsList.appendChild(emptyMessage);
        return;
    }

    habits.forEach(habit => {
        const habitItem = createHabitItem(habit);
        habitsList.appendChild(habitItem);
    });
}

// Create habit item
function createHabitItem(habit) {
    const habitItem = document.createElement('li');
    habitItem.className = 'habit-item';
    habitItem.style.borderLeftColor = habit.color;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayLog = habit.logs.find(log => log.date.startsWith(todayStr));
    const isCompleted = todayLog && todayLog.completed;
    const progress = calculateHabitProgress(habit, todayLog);

    // Create habit header
    const habitHeader = document.createElement('div');
    habitHeader.className = 'habit-header';

    const habitInfo = document.createElement('div');
    habitInfo.className = 'habit-info';

    const habitIcon = document.createElement('div');
    habitIcon.className = 'habit-icon';
    habitIcon.style.backgroundColor = habit.color;
    habitIcon.innerHTML = `<i class="fas ${habit.icon}"></i>`;

    const habitNameContainer = document.createElement('div');

    const habitName = document.createElement('div');
    habitName.className = 'habit-name';
    habitName.textContent = habit.name;

    const habitFrequency = document.createElement('div');
    habitFrequency.className = 'habit-frequency';
    habitFrequency.textContent = getHabitFrequencyText(habit);

    habitNameContainer.appendChild(habitName);
    habitNameContainer.appendChild(habitFrequency);

    habitInfo.appendChild(habitIcon);
    habitInfo.appendChild(habitNameContainer);

    const habitStreak = document.createElement('div');
    habitStreak.className = 'habit-streak';
    habitStreak.innerHTML = `<i class="fas fa-fire"></i> ${habit.currentStreak} يوم`;

    habitHeader.appendChild(habitInfo);
    habitHeader.appendChild(habitStreak);

    // Create habit content
    const habitContent = document.createElement('div');
    habitContent.className = 'habit-content';

    const habitProgress = document.createElement('div');
    habitProgress.className = 'habit-progress';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressFill.style.width = `${progress}%`;

    progressBar.appendChild(progressFill);

    const progressText = document.createElement('div');
    progressText.className = 'progress-text';

    if (habit.type === 'boolean') {
        progressText.innerHTML = isCompleted ? 'مكتمل اليوم' : 'غير مكتمل';
    } else {
        const value = todayLog ? todayLog.value : 0;
        const unit = habit.customUnit || habit.unit;
        progressText.innerHTML = `
            <span>${value} / ${habit.goal} ${unit}</span>
            <span>${progress}%</span>
        `;
    }

    habitProgress.appendChild(progressBar);
    habitProgress.appendChild(progressText);

    const habitActions = document.createElement('div');
    habitActions.className = 'habit-actions';

    // Add habit action buttons based on type
    if (habit.type === 'boolean') {
        const completeBtn = document.createElement('button');
        completeBtn.className = 'habit-complete-btn';
        completeBtn.textContent = isCompleted ? 'تم الإكمال' : 'إكمال';
        completeBtn.addEventListener('click', () => toggleHabitComplete(habit.id));

        habitActions.appendChild(completeBtn);
    } else if (habit.type === 'counter') {
        const habitCounter = document.createElement('div');
        habitCounter.className = 'habit-counter';

        const decrementBtn = document.createElement('button');
        decrementBtn.className = 'counter-btn';
        decrementBtn.innerHTML = '<i class="fas fa-minus"></i>';
        decrementBtn.addEventListener('click', () => updateHabitCounter(habit.id, -1));

        const counterValue = document.createElement('span');
        counterValue.className = 'counter-value';
        counterValue.textContent = todayLog ? todayLog.value : 0;

        const counterUnit = document.createElement('span');
        counterUnit.className = 'counter-unit';
        counterUnit.textContent = habit.customUnit || habit.unit;

        const incrementBtn = document.createElement('button');
        incrementBtn.className = 'counter-btn';
        incrementBtn.innerHTML = '<i class="fas fa-plus"></i>';
        incrementBtn.addEventListener('click', () => updateHabitCounter(habit.id, 1));

        habitCounter.appendChild(decrementBtn);
        habitCounter.appendChild(counterValue);
        habitCounter.appendChild(counterUnit);
        habitCounter.appendChild(incrementBtn);

        habitActions.appendChild(habitCounter);
    } else if (habit.type === 'timer') {
        // Timer implementation will be added later
    }

    // Add details button
    const detailsBtn = document.createElement('button');
    detailsBtn.className = 'habit-action-btn';
    detailsBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
    detailsBtn.addEventListener('click', () => openHabitDetails(habit.id));

    habitActions.appendChild(detailsBtn);

    habitContent.appendChild(habitProgress);
    habitContent.appendChild(habitActions);

    habitItem.appendChild(habitHeader);
    habitItem.appendChild(habitContent);

    return habitItem;
}

// Get habit frequency text
function getHabitFrequencyText(habit) {
    if (habit.frequency === 'daily') {
        return 'يومي';
    } else if (habit.frequency === 'weekly') {
        const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const days = habit.days.map(day => dayNames[day]);
        return `أسبوعي: ${days.join(', ')}`;
    } else if (habit.frequency === 'monthly') {
        return `شهري: أيام ${habit.dates.join(', ')}`;
    }
    return '';
}

// Calculate habit progress
function calculateHabitProgress(habit, todayLog) {
    if (habit.type === 'boolean') {
        return todayLog && todayLog.completed ? 100 : 0;
    } else {
        const value = todayLog ? todayLog.value : 0;
        return Math.min(Math.round((value / habit.goal) * 100), 100);
    }
}

// Toggle habit complete
function toggleHabitComplete(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    let todayLog = habit.logs.find(log => log.date.startsWith(todayStr));

    if (!todayLog) {
        todayLog = {
            date: todayStr,
            value: 0,
            completed: false
        };
        habit.logs.push(todayLog);
    }

    todayLog.completed = !todayLog.completed;

    if (todayLog.completed) {
        todayLog.value = habit.goal || 1;
    } else {
        todayLog.value = 0;
    }

    // Update streak
    updateHabitStreak(habit);

    // Save habits
    saveHabits();

    // Render habits
    renderHabits();

    // Update stats
    updateHabitStats();

    // Update week calendar
    generateWeekCalendar();
}

// Update habit counter
function updateHabitCounter(habitId, change) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    let todayLog = habit.logs.find(log => log.date.startsWith(todayStr));

    if (!todayLog) {
        todayLog = {
            date: todayStr,
            value: 0,
            completed: false
        };
        habit.logs.push(todayLog);
    }

    todayLog.value = Math.max(0, (todayLog.value || 0) + change);
    todayLog.completed = todayLog.value >= habit.goal;

    // Update streak
    updateHabitStreak(habit);

    // Save habits
    saveHabits();

    // Render habits
    renderHabits();

    // Update stats
    updateHabitStats();

    // Update week calendar
    generateWeekCalendar();
}

// Update habit streak
function updateHabitStreak(habit) {
    const logs = habit.logs.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Check if today's habit is completed
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayLog = logs.find(log => log.date.startsWith(todayStr));
    const isTodayCompleted = todayLog && todayLog.completed;

    // Check if yesterday's habit was completed
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayLog = logs.find(log => log.date.startsWith(yesterdayStr));
    const isYesterdayCompleted = yesterdayLog && yesterdayLog.completed;

    // Update current streak
    if (isTodayCompleted) {
        if (isYesterdayCompleted || habit.currentStreak === 0) {
            habit.currentStreak++;
        }
    } else if (!isYesterdayCompleted) {
        habit.currentStreak = 0;
    }

    // Update longest streak
    if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
    }
}

// Update habit stats
function updateHabitStats() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Count completed habits today
    const completedHabitsCount = habits.filter(habit => {
        const todayLog = habit.logs.find(log => log.date.startsWith(todayStr));
        return todayLog && todayLog.completed;
    }).length;

    // Get current streak
    const currentStreak = habits.reduce((max, habit) => Math.max(max, habit.currentStreak), 0);

    // Get longest streak
    const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.longestStreak), 0);

    // Update stats display
    document.getElementById('completed-habits-count').textContent = completedHabitsCount;
    document.getElementById('current-streak').textContent = currentStreak;
    document.getElementById('longest-streak').textContent = longestStreak;
}

// Generate week calendar
function generateWeekCalendar() {
    const weekCalendar = document.getElementById('habits-week-calendar');
    weekCalendar.innerHTML = '';

    const today = new Date();
    const dayOfWeek = today.getDay();

    // Generate columns for each day of the week
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - dayOfWeek + i);

        const dateStr = date.toISOString().split('T')[0];
        const isToday = i === dayOfWeek;

        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';

        const dayName = document.createElement('div');
        dayName.className = 'day-name';
        dayName.textContent = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][i];

        const dayDate = document.createElement('div');
        dayDate.className = 'day-date';
        dayDate.textContent = date.getDate() + '/' + (date.getMonth() + 1);

        if (isToday) {
            dayName.style.color = 'var(--primary-color)';
            dayDate.style.color = 'var(--primary-color)';
            dayDate.style.fontWeight = 'bold';
        }

        const dayHabits = document.createElement('div');
        dayHabits.className = 'day-habits';

        // Add habit indicators for this day
        habits.forEach(habit => {
            // Check if habit is scheduled for this day
            const isScheduled = isHabitScheduledForDate(habit, date);

            if (isScheduled) {
                const dayLog = habit.logs.find(log => log.date.startsWith(dateStr));
                const progress = calculateHabitProgress(habit, dayLog);

                const habitIndicator = document.createElement('div');
                habitIndicator.className = 'day-habit';
                habitIndicator.style.backgroundColor = habit.color;

                if (dayLog && dayLog.completed) {
                    habitIndicator.classList.add('completed');
                    habitIndicator.innerHTML = '<i class="fas fa-check"></i>';
                } else if (dayLog && dayLog.value > 0) {
                    habitIndicator.classList.add('partial');
                    habitIndicator.textContent = Math.round(progress) + '%';
                } else if (date > today) {
                    habitIndicator.classList.add('not-scheduled');
                } else {
                    habitIndicator.classList.add('missed');
                    habitIndicator.innerHTML = '<i class="fas fa-times"></i>';
                }

                habitIndicator.title = habit.name;
                dayHabits.appendChild(habitIndicator);
            }
        });

        dayColumn.appendChild(dayName);
        dayColumn.appendChild(dayDate);
        dayColumn.appendChild(dayHabits);

        weekCalendar.appendChild(dayColumn);
    }
}

// Check if habit is scheduled for a specific date
function isHabitScheduledForDate(habit, date) {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();

    if (habit.frequency === 'daily') {
        return true;
    } else if (habit.frequency === 'weekly') {
        return habit.days.includes(dayOfWeek);
    } else if (habit.frequency === 'monthly') {
        return habit.dates.includes(dayOfMonth);
    }

    return false;
}

// Open habit details
function openHabitDetails(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    document.getElementById('habit-details-name').textContent = habit.name;
    document.getElementById('habit-details-icon').className = 'fas ' + habit.icon;
    document.getElementById('habit-details-icon').style.color = habit.color;

    document.getElementById('habit-details-current-streak').textContent = habit.currentStreak;
    document.getElementById('habit-details-longest-streak').textContent = habit.longestStreak;

    // Calculate completion rate
    const completionRate = calculateHabitCompletionRate(habit);
    document.getElementById('habit-details-completion-rate').textContent = completionRate + '%';

    // Generate month calendar
    generateHabitMonthCalendar(habit);

    // Set notes
    document.getElementById('habit-details-notes-content').textContent = habit.notes || 'لا توجد ملاحظات';

    // Set up edit and delete buttons
    document.getElementById('edit-habit-btn').onclick = () => {
        closeHabitDetailsModal();
        openEditHabitModal(habitId);
    };

    document.getElementById('delete-habit-btn').onclick = () => {
        if (confirm('هل أنت متأكد من حذف هذه العادة؟')) {
            deleteHabit(habitId);
            closeHabitDetailsModal();
        }
    };

    // Show modal
    document.getElementById('habit-details-modal').style.display = 'block';
}

// Close habit details modal
function closeHabitDetailsModal() {
    document.getElementById('habit-details-modal').style.display = 'none';
}

// Calculate habit completion rate
function calculateHabitCompletionRate(habit) {
    if (habit.logs.length === 0) return 0;

    const today = new Date();
    const createdAt = new Date(habit.createdAt);

    // Count days since habit creation
    const daysSinceCreation = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24)) + 1;

    // Count scheduled days
    let scheduledDays = 0;
    let completedDays = 0;

    for (let i = 0; i < daysSinceCreation; i++) {
        const date = new Date(createdAt);
        date.setDate(createdAt.getDate() + i);

        if (isHabitScheduledForDate(habit, date)) {
            scheduledDays++;

            const dateStr = date.toISOString().split('T')[0];
            const log = habit.logs.find(log => log.date.startsWith(dateStr));

            if (log && log.completed) {
                completedDays++;
            }
        }
    }

    return scheduledDays > 0 ? Math.round((completedDays / scheduledDays) * 100) : 0;
}

// Generate habit month calendar
function generateHabitMonthCalendar(habit) {
    const calendarContainer = document.getElementById('habit-details-calendar');
    calendarContainer.innerHTML = '';

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Get first day of month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDay = firstDay.getDay();

    // Get number of days in month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Add day headers
    const dayNames = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day day-header';
        dayHeader.textContent = day;
        calendarContainer.appendChild(dayHeader);
    });

    // Add empty cells for days before first day of month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarContainer.appendChild(emptyDay);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const dateStr = date.toISOString().split('T')[0];

        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';

        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = i;
        dayCell.appendChild(dayNumber);

        // Check if habit is scheduled for this day
        const isScheduled = isHabitScheduledForDate(habit, date);

        if (isScheduled) {
            const log = habit.logs.find(log => log.date.startsWith(dateStr));

            if (log && log.completed) {
                dayCell.classList.add('completed');
            } else if (log && log.value > 0) {
                dayCell.classList.add('partial');
            } else if (date > today) {
                dayCell.classList.add('not-scheduled');
            } else {
                dayCell.classList.add('missed');
            }
        } else {
            dayCell.classList.add('not-scheduled');
        }

        // Highlight today
        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayCell.classList.add('today');
        }

        calendarContainer.appendChild(dayCell);
    }
}

// Delete habit
function deleteHabit(habitId) {
    habits = habits.filter(h => h.id !== habitId);
    saveHabits();
    renderHabits();
    updateHabitStats();
    generateWeekCalendar();
}

// Edit habit from details
function editHabitFromDetails() {
    const habitId = parseInt(document.getElementById('habit-details-name').dataset.habitId);
    closeHabitDetailsModal();
    openEditHabitModal(habitId);
}

// Delete habit from details
function deleteHabitFromDetails() {
    const habitId = parseInt(document.getElementById('habit-details-name').dataset.habitId);
    if (confirm('هل أنت متأكد من حذف هذه العادة؟')) {
        deleteHabit(habitId);
        closeHabitDetailsModal();
    }
}

// Render habit reminders
function renderHabitReminders(reminders) {
    const remindersList = document.getElementById('habit-reminders-list');
    remindersList.innerHTML = '';

    reminders.forEach((reminder, index) => {
        const reminderItem = document.createElement('div');
        reminderItem.className = 'reminder-item';

        const reminderTime = document.createElement('span');
        reminderTime.className = 'reminder-time';
        reminderTime.textContent = reminder;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-reminder-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', () => removeHabitReminder(index));

        reminderItem.appendChild(reminderTime);
        reminderItem.appendChild(removeBtn);

        remindersList.appendChild(reminderItem);
    });
}

// Add habit reminder
document.getElementById('add-habit-reminder').addEventListener('click', function() {
    const reminderTime = document.getElementById('habit-reminder-time').value;
    if (!reminderTime) return;

    const habit = currentEditHabitId ? habits.find(h => h.id === currentEditHabitId) : { reminders: [] };
    if (!habit.reminders) habit.reminders = [];

    if (!habit.reminders.includes(reminderTime)) {
        habit.reminders.push(reminderTime);
        renderHabitReminders(habit.reminders);
    }
});

// Remove habit reminder
function removeHabitReminder(index) {
    const habit = habits.find(h => h.id === currentEditHabitId);
    if (!habit || !habit.reminders) return;

    habit.reminders.splice(index, 1);
    renderHabitReminders(habit.reminders);
}
