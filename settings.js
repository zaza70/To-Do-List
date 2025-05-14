// DOM Elements
const categoriesList = document.getElementById('categories-list');
const newCategoryName = document.getElementById('new-category-name');
const newCategoryColor = document.getElementById('new-category-color');
const addCategoryBtn = document.getElementById('add-category-btn');
const priorityNormalColor = document.getElementById('priority-normal-color');
const priorityImportantColor = document.getElementById('priority-important-color');
const priorityUrgentColor = document.getElementById('priority-urgent-color');
const sortDateAdded = document.getElementById('sort-date-added');
const sortDueDate = document.getElementById('sort-due-date');
const sortPriority = document.getElementById('sort-priority');
const sortCategory = document.getElementById('sort-category');
const autoPriorityToggle = document.getElementById('auto-priority');
const showCompletedToggle = document.getElementById('show-completed');
const enableNotificationsToggle = document.getElementById('enable-notifications');
const saveSettingsBtn = document.getElementById('save-settings');
const resetSettingsBtn = document.getElementById('reset-settings');
const themeToggle = document.getElementById('theme-toggle');

// Default settings
const defaultSettings = {
    categories: [
        { id: 'personal', name: 'شخصي', color: '#6f42c1' },
        { id: 'work', name: 'عمل', color: '#20c997' },
        { id: 'study', name: 'دراسة', color: '#fd7e14' }
    ],
    priorityColors: {
        normal: '#4a6fa5',
        important: '#ffc107',
        urgent: '#dc3545'
    },
    sortBy: 'date-added',
    autoPriority: true,
    showCompleted: true,
    enableNotifications: true
};

// Current settings
let currentSettings = {};

// Initialize settings
function initSettings() {
    loadSettings();
    renderCategories();
    loadPriorityColors();
    loadSortOption();
    loadOtherSettings();
    setupEventListeners();
    loadTheme();
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
        currentSettings = JSON.parse(savedSettings);
    } else {
        currentSettings = JSON.parse(JSON.stringify(defaultSettings));
        saveSettings();
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(currentSettings));
}

// Load theme preference
function loadTheme() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>الوضع النهاري</span>';
    }
}

// Toggle theme
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-theme');
    localStorage.setItem('darkMode', isDarkMode);
    
    if (isDarkMode) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>الوضع النهاري</span>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>الوضع الليلي</span>';
    }
}

// Render categories
function renderCategories() {
    categoriesList.innerHTML = '';
    
    currentSettings.categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-item';
        categoryElement.innerHTML = `
            <div class="category-color" style="background-color: ${category.color}"></div>
            <span class="category-name">${category.name}</span>
            <div class="category-actions">
                <button class="edit-btn" data-id="${category.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" data-id="${category.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        categoriesList.appendChild(categoryElement);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editCategory(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteCategory(btn.dataset.id));
    });
}

// Load priority colors
function loadPriorityColors() {
    priorityNormalColor.value = currentSettings.priorityColors.normal;
    priorityImportantColor.value = currentSettings.priorityColors.important;
    priorityUrgentColor.value = currentSettings.priorityColors.urgent;
}

// Load sort option
function loadSortOption() {
    const sortOption = currentSettings.sortBy;
    switch (sortOption) {
        case 'date-added':
            sortDateAdded.checked = true;
            break;
        case 'due-date':
            sortDueDate.checked = true;
            break;
        case 'priority':
            sortPriority.checked = true;
            break;
        case 'category':
            sortCategory.checked = true;
            break;
    }
}

// Load other settings
function loadOtherSettings() {
    autoPriorityToggle.checked = currentSettings.autoPriority;
    showCompletedToggle.checked = currentSettings.showCompleted;
    enableNotificationsToggle.checked = currentSettings.enableNotifications;
}

// Add a new category
function addCategory() {
    const name = newCategoryName.value.trim();
    const color = newCategoryColor.value;
    
    if (!name) {
        alert('الرجاء إدخال اسم للفئة');
        return;
    }
    
    // Check if category name already exists
    if (currentSettings.categories.some(cat => cat.name === name)) {
        alert('هذه الفئة موجودة بالفعل');
        return;
    }
    
    const newCategory = {
        id: 'cat_' + Date.now(),
        name: name,
        color: color
    };
    
    currentSettings.categories.push(newCategory);
    saveSettings();
    renderCategories();
    
    // Clear input fields
    newCategoryName.value = '';
    newCategoryColor.value = '#4a6fa5';
}

// Edit a category
function editCategory(categoryId) {
    const category = currentSettings.categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    const newName = prompt('أدخل اسم الفئة الجديد:', category.name);
    if (!newName || newName.trim() === '') return;
    
    const newColor = prompt('أدخل لون الفئة الجديد (مثال: #ff0000):', category.color);
    if (!newColor || !/^#[0-9A-F]{6}$/i.test(newColor)) return;
    
    category.name = newName.trim();
    category.color = newColor;
    
    saveSettings();
    renderCategories();
}

// Delete a category
function deleteCategory(categoryId) {
    // Don't allow deleting if only one category remains
    if (currentSettings.categories.length <= 1) {
        alert('لا يمكن حذف جميع الفئات. يجب أن تبقى فئة واحدة على الأقل.');
        return;
    }
    
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;
    
    currentSettings.categories = currentSettings.categories.filter(cat => cat.id !== categoryId);
    saveSettings();
    renderCategories();
}

// Save all settings
function saveAllSettings() {
    // Save priority colors
    currentSettings.priorityColors = {
        normal: priorityNormalColor.value,
        important: priorityImportantColor.value,
        urgent: priorityUrgentColor.value
    };
    
    // Save sort option
    if (sortDateAdded.checked) currentSettings.sortBy = 'date-added';
    else if (sortDueDate.checked) currentSettings.sortBy = 'due-date';
    else if (sortPriority.checked) currentSettings.sortBy = 'priority';
    else if (sortCategory.checked) currentSettings.sortBy = 'category';
    
    // Save other settings
    currentSettings.autoPriority = autoPriorityToggle.checked;
    currentSettings.showCompleted = showCompletedToggle.checked;
    currentSettings.enableNotifications = enableNotificationsToggle.checked;
    
    saveSettings();
    alert('تم حفظ الإعدادات بنجاح!');
    
    // Apply CSS variables for colors
    applyColorStyles();
}

// Reset settings to default
function resetAllSettings() {
    if (!confirm('هل أنت متأكد من إعادة ضبط جميع الإعدادات إلى الإعدادات الافتراضية؟')) return;
    
    currentSettings = JSON.parse(JSON.stringify(defaultSettings));
    saveSettings();
    
    renderCategories();
    loadPriorityColors();
    loadSortOption();
    loadOtherSettings();
    
    alert('تم إعادة ضبط الإعدادات إلى الإعدادات الافتراضية.');
    
    // Apply CSS variables for colors
    applyColorStyles();
}

// Apply color styles to CSS variables
function applyColorStyles() {
    const root = document.documentElement;
    
    // Set priority colors
    root.style.setProperty('--priority-normal', currentSettings.priorityColors.normal);
    root.style.setProperty('--priority-important', currentSettings.priorityColors.important);
    root.style.setProperty('--priority-urgent', currentSettings.priorityColors.urgent);
    
    // Set category colors
    currentSettings.categories.forEach(category => {
        root.style.setProperty(`--category-${category.id}`, category.color);
    });
}

// Setup event listeners
function setupEventListeners() {
    addCategoryBtn.addEventListener('click', addCategory);
    saveSettingsBtn.addEventListener('click', saveAllSettings);
    resetSettingsBtn.addEventListener('click', resetAllSettings);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Apply color changes immediately when selecting colors
    priorityNormalColor.addEventListener('change', applyColorStyles);
    priorityImportantColor.addEventListener('change', applyColorStyles);
    priorityUrgentColor.addEventListener('change', applyColorStyles);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initSettings);
