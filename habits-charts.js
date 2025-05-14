// Habits Charts and Advanced UI Features

// Global variables
let habitCategories = [];
let currentViewMode = 'list';
let currentGroupMode = 'none';

// Initialize charts and advanced UI features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize view mode buttons
    document.getElementById('list-view-btn').addEventListener('click', () => setViewMode('list'));
    document.getElementById('card-view-btn').addEventListener('click', () => setViewMode('card'));
    document.getElementById('chart-view-btn').addEventListener('click', () => setViewMode('chart'));

    // Initialize group mode buttons
    document.getElementById('no-group-btn').addEventListener('click', () => setGroupMode('none'));
    document.getElementById('category-group-btn').addEventListener('click', () => setGroupMode('category'));
    document.getElementById('frequency-group-btn').addEventListener('click', () => setGroupMode('frequency'));

    // Initialize category management
    document.getElementById('manage-categories-btn').addEventListener('click', openCategoriesModal);
    document.querySelector('.close-categories-modal').addEventListener('click', closeCategoriesModal);
    document.getElementById('add-category-btn').addEventListener('click', addCategory);
    document.getElementById('quick-add-category').addEventListener('click', quickAddCategory);

    // Load categories
    loadCategories();

    // Initialize charts
    initializeCharts();

    // Initialize heatmap
    initializeHeatmap();

    // Enable drag and drop for habits
    enableHabitDragAndDrop();
});

// Load categories from local storage
function loadCategories() {
    const savedCategories = localStorage.getItem('habitCategories');
    if (savedCategories) {
        habitCategories = JSON.parse(savedCategories);
    } else {
        // Default categories
        habitCategories = [
            { id: 'spiritual', name: 'إيمانية وروحية', color: '#28a745' },
            { id: 'personal', name: 'شخصية وإنتاجية', color: '#17a2b8' },
            { id: 'social', name: 'اجتماعية وأخلاقية', color: '#fd7e14' },
            { id: 'mental', name: 'عقلية وفكرية', color: '#6f42c1' }
        ];
        saveCategories();
    }

    // Populate category dropdowns
    populateCategoryDropdowns();

    // Render categories list
    renderCategoriesList();
}

// Save categories to local storage
function saveCategories() {
    localStorage.setItem('habitCategories', JSON.stringify(habitCategories));
}

// Populate category dropdowns
function populateCategoryDropdowns() {
    const categorySelect = document.getElementById('habit-category');

    // Clear existing options except the first one
    while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
    }

    // Add categories
    habitCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        option.style.color = category.color;
        categorySelect.appendChild(option);
    });
}

// Render categories list
function renderCategoriesList() {
    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = '';

    habitCategories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.className = 'category-item';

        const categoryColor = document.createElement('div');
        categoryColor.className = 'category-color';
        categoryColor.style.backgroundColor = category.color;

        const categoryName = document.createElement('div');
        categoryName.className = 'category-name';
        categoryName.textContent = category.name;

        const categoryCount = document.createElement('div');
        categoryCount.className = 'category-count';
        const count = countHabitsByCategory(category.id);
        categoryCount.textContent = count + ' ' + (count === 1 ? 'عادة' : 'عادات');

        const categoryActions = document.createElement('div');
        categoryActions.className = 'category-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'category-action-btn edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => editCategory(category.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'category-action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteCategory(category.id));

        categoryActions.appendChild(editBtn);
        categoryActions.appendChild(deleteBtn);

        categoryItem.appendChild(categoryColor);
        categoryItem.appendChild(categoryName);
        categoryItem.appendChild(categoryCount);
        categoryItem.appendChild(categoryActions);

        categoriesList.appendChild(categoryItem);
    });
}

// Count habits by category
function countHabitsByCategory(categoryId) {
    return habits.filter(habit => habit.category === categoryId).length;
}

// Open categories modal
function openCategoriesModal() {
    document.getElementById('habit-categories-modal').style.display = 'block';
    renderCategoriesList();
}

// Close categories modal
function closeCategoriesModal() {
    document.getElementById('habit-categories-modal').style.display = 'none';
}

// Add new category
function addCategory() {
    const name = document.getElementById('new-category-name').value.trim();
    const color = document.getElementById('new-category-color').value;

    if (!name) {
        alert('يرجى إدخال اسم الفئة');
        return;
    }

    const id = 'category_' + Date.now();

    habitCategories.push({
        id,
        name,
        color
    });

    saveCategories();
    populateCategoryDropdowns();
    renderCategoriesList();

    // Clear input
    document.getElementById('new-category-name').value = '';
}

// Quick add category from habit form
function quickAddCategory() {
    const name = prompt('أدخل اسم الفئة الجديدة:');
    if (!name) return;

    const id = 'category_' + Date.now();
    const color = document.getElementById('habit-color').value;

    habitCategories.push({
        id,
        name,
        color
    });

    saveCategories();
    populateCategoryDropdowns();

    // Select the new category
    document.getElementById('habit-category').value = id;
}

// Edit category
function editCategory(categoryId) {
    const category = habitCategories.find(c => c.id === categoryId);
    if (!category) return;

    const newName = prompt('أدخل اسم الفئة الجديد:', category.name);
    if (!newName) return;

    const newColor = prompt('أدخل لون الفئة الجديد (قيمة HEX):', category.color);
    if (!newColor) return;

    category.name = newName;
    category.color = newColor;

    saveCategories();
    populateCategoryDropdowns();
    renderCategoriesList();
    renderHabits(); // Re-render habits to update category names and colors
}

// Delete category
function deleteCategory(categoryId) {
    const categoryHabits = countHabitsByCategory(categoryId);

    if (categoryHabits > 0) {
        const confirm = window.confirm(`هذه الفئة تحتوي على ${categoryHabits} عادات. هل أنت متأكد من حذفها؟ سيتم تعيين العادات إلى الفئة "عام".`);
        if (!confirm) return;

        // Update habits to use default category
        habits.forEach(habit => {
            if (habit.category === categoryId) {
                habit.category = 'عام';
            }
        });

        saveHabits();
    } else {
        const confirm = window.confirm('هل أنت متأكد من حذف هذه الفئة؟');
        if (!confirm) return;
    }

    habitCategories = habitCategories.filter(c => c.id !== categoryId);

    saveCategories();
    populateCategoryDropdowns();
    renderCategoriesList();
    renderHabits(); // Re-render habits to update category assignments
}

// Set view mode
function setViewMode(mode) {
    currentViewMode = mode;

    // Update active button
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${mode}-view-btn`).classList.add('active');

    // Update habits list class
    const habitsList = document.getElementById('habits-list');
    habitsList.className = `habits-${mode}-view`;

    // Re-render habits with the new view mode
    renderHabits();
}

// Set group mode
function setGroupMode(mode) {
    currentGroupMode = mode;

    // Update active button
    document.querySelectorAll('.group-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${mode === 'none' ? 'no' : mode}-group-btn`).classList.add('active');

    // Re-render habits with the new group mode
    renderHabits();
}

// Initialize charts
function initializeCharts() {
    // Weekly progress chart
    const weeklyCtx = document.getElementById('habits-weekly-chart').getContext('2d');
    const weeklyChart = new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
            datasets: [{
                label: 'نسبة إكمال العادات',
                data: calculateWeeklyCompletionRates(),
                backgroundColor: 'rgba(74, 111, 165, 0.7)',
                borderColor: 'rgba(74, 111, 165, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Calculate day completion level (0-4)
function calculateDayCompletionLevel(date) {
    const dateStr = date.toISOString().split('T')[0];
    const completionRate = calculateDayCompletionRate(date);

    if (completionRate === 0) return 0;
    if (completionRate < 25) return 1;
    if (completionRate < 50) return 2;
    if (completionRate < 75) return 3;
    return 4;
}

// Calculate day completion rate
function calculateDayCompletionRate(date) {
    const dateStr = date.toISOString().split('T')[0];

    let scheduledCount = 0;
    let completedCount = 0;

    habits.forEach(habit => {
        if (isHabitScheduledForDate(habit, date)) {
            scheduledCount++;

            const log = habit.logs.find(log => log.date.startsWith(dateStr));
            if (log && log.completed) {
                completedCount++;
            }
        }
    });

    return scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;
}

// Enable habit drag and drop
function enableHabitDragAndDrop() {
    let draggedItem = null;

    document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('habit-item')) {
            draggedItem = e.target;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', draggedItem.innerHTML);
            e.target.style.opacity = '0.5';
        }
    });

    document.addEventListener('dragend', function(e) {
        if (e.target.classList.contains('habit-item')) {
            e.target.style.opacity = '1';
            draggedItem = null;
        }
    });

    document.addEventListener('dragover', function(e) {
        if (e.target.classList.contains('habit-item')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    });

    document.addEventListener('dragenter', function(e) {
        if (e.target.classList.contains('habit-item')) {
            e.target.classList.add('drag-over');
        }
    });

    document.addEventListener('dragleave', function(e) {
        if (e.target.classList.contains('habit-item')) {
            e.target.classList.remove('drag-over');
        }
    });

    document.addEventListener('drop', function(e) {
        if (e.target.classList.contains('habit-item') && draggedItem) {
            e.preventDefault();
            e.target.classList.remove('drag-over');

            const habitsList = document.getElementById('habits-list');
            const items = Array.from(habitsList.querySelectorAll('.habit-item'));

            const draggedIndex = items.indexOf(draggedItem);
            const targetIndex = items.indexOf(e.target);

            if (draggedIndex !== targetIndex) {
                // Reorder habits array
                const temp = habits[draggedIndex];
                habits.splice(draggedIndex, 1);
                habits.splice(targetIndex, 0, temp);

                // Save habits
                saveHabits();

                // Re-render habits
                renderHabits();
            }
        }
    });
}

// Override the original renderHabits function to support view modes and grouping
const originalRenderHabits = window.renderHabits;
window.renderHabits = function() {
    const habitsList = document.getElementById('habits-list');
    habitsList.innerHTML = '';

    if (habits.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-habits-message';
        emptyMessage.textContent = 'لم تقم بإضافة أي عادات بعد. انقر على "إضافة عادة جديدة" للبدء.';
        habitsList.appendChild(emptyMessage);
        return;
    }

    // Apply grouping if needed
    if (currentGroupMode === 'none') {
        // No grouping, render habits directly
        habits.forEach(habit => {
            const habitItem = createHabitItemWithViewMode(habit);
            habitsList.appendChild(habitItem);
        });
    } else {
        // Group habits
        const groups = groupHabits();

        Object.keys(groups).forEach(groupKey => {
            const group = groups[groupKey];

            // Create group header
            const groupElement = document.createElement('div');
            groupElement.className = 'habit-group';

            const groupHeader = document.createElement('div');
            groupHeader.className = 'habit-group-header';

            const groupIcon = document.createElement('div');
            groupIcon.className = 'habit-group-icon';

            const groupName = document.createElement('div');
            groupName.className = 'habit-group-name';

            const groupCount = document.createElement('div');
            groupCount.className = 'habit-group-count';
            groupCount.textContent = group.habits.length + ' ' + (group.habits.length === 1 ? 'عادة' : 'عادات');

            if (currentGroupMode === 'category') {
                groupIcon.style.backgroundColor = group.color;
                groupIcon.innerHTML = '<i class="fas fa-folder"></i>';
                groupName.textContent = group.name;
            } else if (currentGroupMode === 'frequency') {
                groupIcon.style.backgroundColor = '#6c757d';
                groupIcon.innerHTML = '<i class="fas fa-calendar-alt"></i>';
                groupName.textContent = group.name;
            }

            groupHeader.appendChild(groupIcon);
            groupHeader.appendChild(groupName);
            groupHeader.appendChild(groupCount);

            groupElement.appendChild(groupHeader);

            // Add habits to group
            group.habits.forEach(habit => {
                const habitItem = createHabitItemWithViewMode(habit);
                groupElement.appendChild(habitItem);
            });

            habitsList.appendChild(groupElement);
        });
    }

    // Initialize habit charts if in chart view
    if (currentViewMode === 'chart') {
        initializeHabitCharts();
    }

    // Make habit items draggable
    const habitItems = document.querySelectorAll('.habit-item');
    habitItems.forEach(item => {
        item.setAttribute('draggable', 'true');
    });
};

// Create habit item with current view mode
function createHabitItemWithViewMode(habit) {
    const habitItem = createHabitItem(habit);

    // Add view mode specific modifications
    if (currentViewMode === 'card') {
        // Add habit category if available
        if (habit.category && habit.category !== 'عام') {
            const category = habitCategories.find(c => c.id === habit.category);
            if (category) {
                const categoryBadge = document.createElement('div');
                categoryBadge.className = 'habit-category-badge';
                categoryBadge.textContent = category.name;
                categoryBadge.style.backgroundColor = category.color;

                habitItem.querySelector('.habit-info').appendChild(categoryBadge);
            }
        }
    } else if (currentViewMode === 'chart') {
        // Add chart container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'habit-chart-container';
        chartContainer.id = `habit-chart-${habit.id}`;

        habitItem.querySelector('.habit-content').appendChild(chartContainer);
    }

    return habitItem;
}

// Group habits based on current group mode
function groupHabits() {
    const groups = {};

    if (currentGroupMode === 'category') {
        // Add default category
        groups['عام'] = {
            name: 'عام',
            color: '#6c757d',
            habits: []
        };

        // Add custom categories
        habitCategories.forEach(category => {
            groups[category.id] = {
                name: category.name,
                color: category.color,
                habits: []
            };
        });

        // Group habits by category
        habits.forEach(habit => {
            const categoryId = habit.category || 'عام';
            if (groups[categoryId]) {
                groups[categoryId].habits.push(habit);
            } else {
                groups['عام'].habits.push(habit);
            }
        });

        // Remove empty groups
        Object.keys(groups).forEach(key => {
            if (groups[key].habits.length === 0) {
                delete groups[key];
            }
        });
    } else if (currentGroupMode === 'frequency') {
        // Define frequency groups
        groups['daily'] = {
            name: 'يومي',
            habits: []
        };

        groups['weekly'] = {
            name: 'أسبوعي',
            habits: []
        };

        groups['monthly'] = {
            name: 'شهري',
            habits: []
        };

        // Group habits by frequency
        habits.forEach(habit => {
            if (groups[habit.frequency]) {
                groups[habit.frequency].habits.push(habit);
            }
        });

        // Remove empty groups
        Object.keys(groups).forEach(key => {
            if (groups[key].habits.length === 0) {
                delete groups[key];
            }
        });
    }

    return groups;
}

// Initialize individual habit charts
function initializeHabitCharts() {
    habits.forEach(habit => {
        const chartContainer = document.getElementById(`habit-chart-${habit.id}`);
        if (!chartContainer) return;

        const ctx = chartContainer.getContext('2d');
        const data = calculateHabitProgressData(habit);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'التقدم',
                    data: data.values,
                    backgroundColor: 'rgba(74, 111, 165, 0.2)',
                    borderColor: habit.color || 'rgba(74, 111, 165, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '% مكتمل';
                            }
                        }
                    }
                },
                maintainAspectRatio: false
            }
        });
    });
}

// Calculate habit progress data for charts
function calculateHabitProgressData(habit) {
    const labels = [];
    const values = [];

    // Get data for the last 14 days
    const today = new Date();

    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - 13 + i);
        const dateStr = date.toISOString().split('T')[0];

        labels.push(date.getDate() + '/' + (date.getMonth() + 1));

        if (isHabitScheduledForDate(habit, date)) {
            const log = habit.logs.find(log => log.date.startsWith(dateStr));
            const progress = calculateHabitProgress(habit, log);
            values.push(progress);
        } else {
            values.push(null); // No data for unscheduled days
        }
    }

    return { labels, values };
}
},
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '% مكتمل';
                        }
                    }
                }
            }
        }
    });

    // Monthly completion rate chart
    const monthlyCtx = document.getElementById('habits-monthly-chart').getContext('2d');
    const monthlyData = calculateMonthlyCompletionRates();
    const monthlyChart = new Chart(monthlyCtx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'معدل الإكمال',
                data: monthlyData.data,
                backgroundColor: 'rgba(40, 167, 69, 0.2)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '% مكتمل';
                        }
                    }
                }
            }
        }
    });
}

// Calculate weekly completion rates
function calculateWeeklyCompletionRates() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const rates = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - dayOfWeek + i);
        const dateStr = date.toISOString().split('T')[0];

        let scheduledCount = 0;
        let completedCount = 0;

        habits.forEach(habit => {
            if (isHabitScheduledForDate(habit, date)) {
                scheduledCount++;

                const log = habit.logs.find(log => log.date.startsWith(dateStr));
                if (log && log.completed) {
                    completedCount++;
                }
            }
        });

        rates.push(scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0);
    }

    return rates;
}

// Calculate monthly completion rates
function calculateMonthlyCompletionRates() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const labels = [];
    const data = [];

    // Get data for the last 30 days
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - 29 + i);
        const dateStr = date.toISOString().split('T')[0];

        labels.push(date.getDate() + '/' + (date.getMonth() + 1));

        let scheduledCount = 0;
        let completedCount = 0;

        habits.forEach(habit => {
            if (isHabitScheduledForDate(habit, date)) {
                scheduledCount++;

                const log = habit.logs.find(log => log.date.startsWith(dateStr));
                if (log && log.completed) {
                    completedCount++;
                }
            }
        });

        data.push(scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0);
    }

    return { labels, data };
}

// Initialize heatmap
function initializeHeatmap() {
    const heatmapContainer = document.getElementById('habits-heatmap');
    const currentYear = new Date().getFullYear();

    // Set year in heading
    document.getElementById('heatmap-year').textContent = currentYear;

    // Clear container
    heatmapContainer.innerHTML = '';

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'heatmap-tooltip';
    document.body.appendChild(tooltip);

    // Generate weeks
    const startDate = new Date(currentYear, 0, 1);
    const startDay = startDate.getDay();

    // Adjust start date to the beginning of the week
    startDate.setDate(startDate.getDate() - startDay);

    // Generate 53 weeks (maximum in a year)
    for (let week = 0; week < 53; week++) {
        const weekElement = document.createElement('div');
        weekElement.className = 'heatmap-week';

        // Generate 7 days for each week
        for (let day = 0; day < 7; day++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + (week * 7) + day);

            // Skip if date is in the future
            if (date > new Date()) {
                continue;
            }

            const dateStr = date.toISOString().split('T')[0];
            const dayElement = document.createElement('div');
            dayElement.className = 'heatmap-day';
            dayElement.dataset.date = dateStr;

            // Calculate completion level for this day
            const level = calculateDayCompletionLevel(date);
            if (level > 0) {
                dayElement.classList.add(`level-${level}`);
            }

            // Add tooltip
            dayElement.addEventListener('mouseover', function(e) {
                const completionRate = calculateDayCompletionRate(date);
                const formattedDate = date.toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                tooltip.innerHTML = `
                    <div>${formattedDate}</div>
                    <div>${completionRate}% مكتمل</div>
                `;

                tooltip.style.display = 'block';
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY + 10) + 'px';
            });

            dayElement.addEventListener('mouseout', function() {
                tooltip.style.display = 'none';
            });

            weekElement.appendChild(dayElement);
        }

        heatmapContainer.appendChild(weekElement);
    }
}
