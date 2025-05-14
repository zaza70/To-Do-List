// DOM Elements
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskDate = document.getElementById('task-date');
const taskTime = document.getElementById('task-time');
const taskEstimatedTime = document.getElementById('task-estimated-time');
const taskRepeat = document.getElementById('task-repeat');
const taskNotes = document.getElementById('task-notes');
const addTaskBtn = document.getElementById('add-task');
const addSubtaskBtn = document.getElementById('add-subtask');
const subtasksList = document.getElementById('subtasks-list');
const tasksList = document.getElementById('tasks-list');
const filterCategory = document.getElementById('filter-category');
const filterPriority = document.getElementById('filter-priority');
const sortTasks = document.getElementById('sort-tasks');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');
const exportPdfBtn = document.getElementById('export-pdf');
const exportCsvBtn = document.getElementById('export-csv');
const themeToggle = document.getElementById('theme-toggle');

// Edit modal elements
const editModal = document.getElementById('edit-modal');
const closeModal = document.querySelector('.close-modal');
const editTaskInput = document.getElementById('edit-task-input');
const editTaskCategory = document.getElementById('edit-task-category');
const editTaskPriority = document.getElementById('edit-task-priority');
const editTaskDate = document.getElementById('edit-task-date');
const editTaskTime = document.getElementById('edit-task-time');
const editTaskEstimatedTime = document.getElementById('edit-task-estimated-time');
const editTaskRepeat = document.getElementById('edit-task-repeat');
const editTaskNotes = document.getElementById('edit-task-notes');
const editTaskEmail = document.getElementById('edit-task-email');
const setEmailReminderBtn = document.getElementById('set-email-reminder');
const editAddSubtaskBtn = document.getElementById('edit-add-subtask');
const editSubtasksList = document.getElementById('edit-subtasks-list');
const saveEditBtn = document.getElementById('save-edit');
const shareTaskBtn = document.getElementById('share-task');
const showCommentsBtn = document.getElementById('show-comments');

// Share modal elements
const shareModal = document.getElementById('share-modal');
const closeShareModal = document.querySelector('.close-share-modal');
const shareLink = document.getElementById('share-link');
const copyLinkBtn = document.getElementById('copy-link');
const whatsappShareBtn = document.querySelector('.social-btn.whatsapp');
const emailShareBtn = document.querySelector('.social-btn.email');

// Comments modal elements
const commentsModal = document.getElementById('comments-modal');
const closeCommentsModal = document.querySelector('.close-comments-modal');
const commentsList = document.getElementById('comments-list');
const commentInput = document.getElementById('comment-input');
const addCommentBtn = document.getElementById('add-comment');

// Global variables
let tasks = [];
let currentEditTaskId = null;
let currentSubtasks = [];
let editCurrentSubtasks = [];
let currentComments = {};
let baseUrl = window.location.href.split('?')[0];

// Check for notifications permission
let notificationsEnabled = false;
if ('Notification' in window) {
    if (Notification.permission === 'granted') {
        notificationsEnabled = true;
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            notificationsEnabled = permission === 'granted';
        });
    }
}

// Initialize the app
function init() {
    loadTasks();
    loadComments();
    loadSettings();
    populateCategories();
    renderTasks();
    loadTheme();
    setupEventListeners();
    checkTaskReminders();

    // Set today's date as default for new tasks
    const today = new Date().toISOString().split('T')[0];
    taskDate.value = today;
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('appSettings');
    if (!savedSettings) {
        // Create default settings if none exist
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

        localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    }

    // Apply CSS variables for colors
    applyColorStyles();
}

// Apply color styles to CSS variables
function applyColorStyles() {
    const settings = JSON.parse(localStorage.getItem('appSettings'));
    if (!settings) return;

    const root = document.documentElement;

    // Set priority colors
    root.style.setProperty('--priority-normal', settings.priorityColors.normal);
    root.style.setProperty('--priority-important', settings.priorityColors.important);
    root.style.setProperty('--priority-urgent', settings.priorityColors.urgent);

    // Set category colors
    settings.categories.forEach(category => {
        root.style.setProperty(`--category-${category.id}`, category.color);
    });
}

// Populate category dropdowns
function populateCategories() {
    const settings = JSON.parse(localStorage.getItem('appSettings'));
    if (!settings || !settings.categories) return;

    // Clear existing options except "All"
    while (filterCategory.options.length > 1) {
        filterCategory.remove(1);
    }

    // Clear all options in task category dropdowns
    taskCategory.innerHTML = '';
    editTaskCategory.innerHTML = '';

    // Add categories to dropdowns
    settings.categories.forEach(category => {
        // Add to filter dropdown
        const filterOption = document.createElement('option');
        filterOption.value = category.name;
        filterOption.textContent = category.name;
        filterCategory.appendChild(filterOption);

        // Add to task creation dropdown
        const taskOption = document.createElement('option');
        taskOption.value = category.name;
        taskOption.textContent = category.name;
        taskCategory.appendChild(taskOption);

        // Add to task edit dropdown
        const editOption = document.createElement('option');
        editOption.value = category.name;
        editOption.textContent = category.name;
        editTaskCategory.appendChild(editOption);
    });
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
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

// Setup event listeners
function setupEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') addTask();
    });

    // Subtasks event listeners
    addSubtaskBtn.addEventListener('click', addSubtask);
    editAddSubtaskBtn.addEventListener('click', addEditSubtask);

    // Priority auto-calculation based on due date
    taskDate.addEventListener('change', calculateAutoPriority);
    taskTime.addEventListener('change', calculateAutoPriority);

    // Task management buttons
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    clearAllBtn.addEventListener('click', clearAllTasks);
    themeToggle.addEventListener('click', toggleTheme);

    // Export buttons
    exportPdfBtn.addEventListener('click', exportToPdf);
    exportCsvBtn.addEventListener('click', exportToCsv);

    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);

    // Show/hide clear search button
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() !== '') {
            clearSearchBtn.classList.add('visible');
        } else {
            clearSearchBtn.classList.remove('visible');
        }
    });

    // Filters and sorting
    filterCategory.addEventListener('change', renderTasks);
    filterPriority.addEventListener('change', renderTasks);
    sortTasks.addEventListener('change', renderTasks);

    // Edit modal
    closeModal.addEventListener('click', () => {
        editModal.style.display = 'none';
        editCurrentSubtasks = [];
    });

    saveEditBtn.addEventListener('click', saveTaskEdit);
    setEmailReminderBtn.addEventListener('click', setEmailReminder);
    shareTaskBtn.addEventListener('click', openShareModal);
    showCommentsBtn.addEventListener('click', openCommentsModal);

    // Share modal
    closeShareModal.addEventListener('click', () => {
        shareModal.style.display = 'none';
    });

    copyLinkBtn.addEventListener('click', copyShareLink);
    whatsappShareBtn.addEventListener('click', shareViaWhatsapp);
    emailShareBtn.addEventListener('click', shareViaEmail);

    // Comments modal
    closeCommentsModal.addEventListener('click', () => {
        commentsModal.style.display = 'none';
    });

    addCommentBtn.addEventListener('click', addComment);

    // Close modals when clicking outside
    window.addEventListener('click', e => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
            editCurrentSubtasks = [];
        } else if (e.target === shareModal) {
            shareModal.style.display = 'none';
        } else if (e.target === commentsModal) {
            commentsModal.style.display = 'none';
        }
    });

    // Check URL for shared task
    checkForSharedTask();

    // Check for reminders every minute
    setInterval(checkTaskReminders, 60000);

    // Check for recurring tasks daily
    setInterval(checkRecurringTasks, 24 * 60 * 60 * 1000);
}

// Handle search functionality
function handleSearch() {
    renderTasks();
}

// Clear search input
function clearSearch() {
    searchInput.value = '';
    clearSearchBtn.classList.remove('visible');
    renderTasks();
}

// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        shakeElement(taskInput);
        return;
    }

    const taskId = Date.now();

    const newTask = {
        id: taskId,
        text: text,
        category: taskCategory.value,
        priority: taskPriority.value,
        dueDate: taskDate.value,
        dueTime: taskTime.value,
        estimatedTime: taskEstimatedTime.value ? parseInt(taskEstimatedTime.value) : null,
        repeat: taskRepeat.value,
        notes: taskNotes.value.trim(),
        subtasks: [...currentSubtasks],
        completed: false,
        createdAt: new Date().toISOString(),
        emailReminder: null,
        comments: []
    };

    // Add custom repeat data if needed
    if (taskRepeat.value === 'custom') {
        const repeatEvery = document.getElementById('repeat-every')?.value || 1;
        const repeatPeriod = document.getElementById('repeat-period')?.value || 'day';

        // Get selected weekdays if period is week
        let repeatDays = [];
        if (repeatPeriod === 'week') {
            const checkboxes = document.querySelectorAll('#repeat-on-days input[type="checkbox"]:checked');
            repeatDays = Array.from(checkboxes).map(cb => cb.value);
        }

        newTask.repeatCustom = {
            every: parseInt(repeatEvery),
            period: repeatPeriod,
            days: repeatDays
        };
    }

    tasks.unshift(newTask);
    saveTasks();
    saveComments();
    renderTasks();

    // Clear input fields
    taskInput.value = '';
    taskEstimatedTime.value = '';
    taskNotes.value = '';
    currentSubtasks = [];
    renderSubtasks();
    taskInput.focus();
}

// Add a subtask to the current task
function addSubtask() {
    const subtaskText = prompt('أدخل نص المهمة الفرعية:');
    if (!subtaskText || !subtaskText.trim()) return;

    const newSubtask = {
        id: Date.now(),
        text: subtaskText.trim(),
        completed: false
    };

    currentSubtasks.push(newSubtask);
    renderSubtasks();
}

// Add a subtask to the task being edited
function addEditSubtask() {
    const subtaskText = prompt('أدخل نص المهمة الفرعية:');
    if (!subtaskText || !subtaskText.trim()) return;

    const newSubtask = {
        id: Date.now(),
        text: subtaskText.trim(),
        completed: false
    };

    editCurrentSubtasks.push(newSubtask);
    renderEditSubtasks();
}

// Render subtasks in the add task form
function renderSubtasks() {
    subtasksList.innerHTML = '';

    if (currentSubtasks.length === 0) {
        return;
    }

    currentSubtasks.forEach(subtask => {
        const subtaskElement = document.createElement('li');
        subtaskElement.className = 'subtask-item';
        subtaskElement.innerHTML = `
            <span class="subtask-text">${subtask.text}</span>
            <div class="subtask-actions">
                <button onclick="deleteSubtask(${subtask.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        subtasksList.appendChild(subtaskElement);
    });
}

// Render subtasks in the edit task form
function renderEditSubtasks() {
    editSubtasksList.innerHTML = '';

    if (editCurrentSubtasks.length === 0) {
        return;
    }

    editCurrentSubtasks.forEach(subtask => {
        const subtaskElement = document.createElement('li');
        subtaskElement.className = 'subtask-item';
        subtaskElement.innerHTML = `
            <span class="subtask-text">${subtask.text}</span>
            <div class="subtask-actions">
                <button onclick="toggleEditSubtaskComplete(${subtask.id})">
                    <i class="fas ${subtask.completed ? 'fa-times-circle' : 'fa-check-circle'}"></i>
                </button>
                <button onclick="deleteEditSubtask(${subtask.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        editSubtasksList.appendChild(subtaskElement);
    });
}

// Delete a subtask from the current task
function deleteSubtask(id) {
    currentSubtasks = currentSubtasks.filter(subtask => subtask.id !== id);
    renderSubtasks();
}

// Delete a subtask from the task being edited
function deleteEditSubtask(id) {
    editCurrentSubtasks = editCurrentSubtasks.filter(subtask => subtask.id !== id);
    renderEditSubtasks();
}

// Toggle completion status of a subtask in the edit form
function toggleEditSubtaskComplete(id) {
    const subtaskIndex = editCurrentSubtasks.findIndex(subtask => subtask.id === id);
    if (subtaskIndex !== -1) {
        editCurrentSubtasks[subtaskIndex].completed = !editCurrentSubtasks[subtaskIndex].completed;
        renderEditSubtasks();
    }
}

// Calculate priority automatically based on due date
function calculateAutoPriority() {
    if (!taskDate.value) return;

    const dueDate = new Date(`${taskDate.value}T${taskTime.value || '23:59'}`);
    const now = new Date();
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
        taskPriority.value = 'عاجل';
    } else if (diffDays <= 3) {
        taskPriority.value = 'مهم';
    } else {
        taskPriority.value = 'عادي';
    }
}

// Render tasks based on filters, search, and sort with progressive loading
function renderTasks() {
    const categoryFilter = filterCategory.value;
    const priorityFilter = filterPriority.value;
    const sortOption = sortTasks.value;
    const searchQuery = searchInput.value.trim().toLowerCase();
    const settings = JSON.parse(localStorage.getItem('appSettings'));

    // Show loading indicator
    tasksList.innerHTML = '<li class="loading-tasks"><div class="spinner"></div><span>جاري تحميل المهام...</span></li>';

    // Use setTimeout to allow the loading indicator to render
    setTimeout(() => {
        // Process tasks in a separate function to avoid blocking the UI
        processAndRenderTasks(categoryFilter, priorityFilter, sortOption, searchQuery, settings);
    }, 10);
}

// Process and render tasks with pagination for large datasets
function processAndRenderTasks(categoryFilter, priorityFilter, sortOption, searchQuery, settings) {
    // Start with a copy of all tasks
    let filteredTasks = [...tasks];

    // Apply category filter
    if (categoryFilter !== 'الكل') {
        filteredTasks = filteredTasks.filter(task => task.category === categoryFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'الكل') {
        filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }

    // Apply search filter
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(task => {
            // Search in task text
            if (task.text.toLowerCase().includes(searchQuery)) return true;

            // Search in task notes
            if (task.notes && task.notes.toLowerCase().includes(searchQuery)) return true;

            // Search in subtasks
            if (task.subtasks && task.subtasks.some(subtask =>
                subtask.text.toLowerCase().includes(searchQuery))) return true;

            // Search in category
            if (task.category.toLowerCase().includes(searchQuery)) return true;

            return false;
        });
    }

    // Apply sorting
    switch (sortOption) {
        case 'date-added':
            // Already sorted by date added (newest first) by default
            break;
        case 'due-date':
            filteredTasks.sort((a, b) => {
                // Tasks without due date go to the end
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;

                const dateA = new Date(`${a.dueDate}T${a.dueTime || '23:59:59'}`);
                const dateB = new Date(`${b.dueDate}T${b.dueTime || '23:59:59'}`);
                return dateA - dateB;
            });
            break;
        case 'priority':
            filteredTasks.sort((a, b) => {
                const priorityOrder = { 'عاجل': 0, 'مهم': 1, 'عادي': 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            break;
        case 'category':
            filteredTasks.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }

    // Apply show/hide completed tasks setting
    if (settings && !settings.showCompleted) {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    // Clear the tasks list
    tasksList.innerHTML = '';

    // Check if we have any tasks to display
    if (filteredTasks.length === 0) {
        if (searchQuery) {
            tasksList.innerHTML = '<li class="no-tasks">لا توجد نتائج للبحث</li>';
        } else {
            tasksList.innerHTML = '<li class="no-tasks">لا توجد مهام</li>';
        }
        return;
    }

    // For large datasets, use progressive loading
    const BATCH_SIZE = 20; // Number of tasks to render at once

    // Create a document fragment to improve performance
    const fragment = document.createDocumentFragment();

    // Function to render a batch of tasks
    function renderBatch(startIndex) {
        const endIndex = Math.min(startIndex + BATCH_SIZE, filteredTasks.length);

        // Render this batch of tasks
        for (let i = startIndex; i < endIndex; i++) {
            const taskElement = createTaskElement(filteredTasks[i]);
            fragment.appendChild(taskElement);
        }

        // Append the fragment to the DOM
        tasksList.appendChild(fragment);

        // If there are more tasks to render, schedule the next batch
        if (endIndex < filteredTasks.length) {
            // Show a "loading more" indicator
            const loadingMore = document.createElement('li');
            loadingMore.className = 'loading-more';
            loadingMore.innerHTML = '<div class="spinner small"></div><span>جاري تحميل المزيد...</span>';
            tasksList.appendChild(loadingMore);

            // Schedule the next batch
            setTimeout(() => {
                // Remove the loading indicator
                tasksList.removeChild(loadingMore);
                // Render the next batch
                renderBatch(endIndex);
            }, 50); // Small delay to allow UI to update
        }
    }

    // Start rendering the first batch
    renderBatch(0);
}

// Create a task element
function createTaskElement(task) {
    const taskElement = document.createElement('li');
    taskElement.className = `task-item priority-${getPriorityClass(task.priority)}`;

    // Add classes for recurring tasks and tasks with subtasks
    if (task.repeat && task.repeat !== 'none') {
        taskElement.classList.add('recurring-task');
    }

    if (task.subtasks && task.subtasks.length > 0) {
        taskElement.classList.add('has-subtasks');
    }

    if (task.completed) {
        taskElement.classList.add('completed');
    }

    const dueDateTime = task.dueDate && task.dueTime ?
        new Date(`${task.dueDate}T${task.dueTime}`) : null;
    const dueDateFormatted = dueDateTime ?
        new Intl.DateTimeFormat('ar-SA', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(dueDateTime) : '';

    // Calculate completion percentage of subtasks
    let subtasksCompletionHtml = '';
    if (task.subtasks && task.subtasks.length > 0) {
        const totalSubtasks = task.subtasks.length;
        const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
        const completionPercentage = Math.round((completedSubtasks / totalSubtasks) * 100);

        subtasksCompletionHtml = `
            <div class="subtasks-progress">
                <span class="subtasks-count">
                    <i class="fas fa-tasks"></i> ${completedSubtasks}/${totalSubtasks} (${completionPercentage}%)
                </span>
            </div>
        `;
    }

    // Format estimated time
    let estimatedTimeHtml = '';
    if (task.estimatedTime) {
        estimatedTimeHtml = `
            <span class="task-meta-item">
                <i class="fas fa-hourglass-half"></i> ${task.estimatedTime} دقيقة
            </span>
        `;
    }

    // Format repeat information
    let repeatHtml = '';
    if (task.repeat && task.repeat !== 'none') {
        let repeatText = '';

        switch (task.repeat) {
            case 'daily':
                repeatText = 'يومي';
                break;
            case 'workdays':
                repeatText = 'أيام العمل';
                break;
            case 'weekly':
                repeatText = 'أسبوعي';
                break;
            case 'biweekly':
                repeatText = 'كل أسبوعين';
                break;
            case 'monthly':
                repeatText = 'شهري';
                break;
            case 'last-day-month':
                repeatText = 'آخر يوم من الشهر';
                break;
            case 'quarterly':
                repeatText = 'كل ثلاثة أشهر';
                break;
            case 'yearly':
                repeatText = 'سنوي';
                break;
            case 'custom':
                if (task.repeatCustom) {
                    const { every, period, days } = task.repeatCustom;
                    const periodText = {
                        'day': 'يوم',
                        'week': 'أسبوع',
                        'month': 'شهر',
                        'year': 'سنة'
                    }[period];

                    if (period === 'week' && days && days.length > 0) {
                        const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
                        const selectedDays = days.map(d => dayNames[parseInt(d)]).join(', ');
                        repeatText = `كل ${every > 1 ? every : ''} ${periodText} (${selectedDays})`;
                    } else {
                        repeatText = `كل ${every > 1 ? every : ''} ${periodText}`;
                    }
                } else {
                    repeatText = 'مخصص';
                }
                break;
            default:
                repeatText = task.repeat;
        }

        repeatHtml = `
            <span class="task-meta-item">
                <i class="fas fa-redo"></i> ${repeatText}
            </span>
        `;
    }

    taskElement.innerHTML = `
        <div class="task-content">
            <div class="task-text">${task.text}</div>
            <div class="task-details">
                <span class="task-category category-${getCategoryClass(task.category)}">
                    <i class="fas fa-tag"></i> ${task.category}
                </span>
                <span class="task-priority">
                    <i class="fas fa-flag"></i> ${task.priority}
                </span>
                ${dueDateFormatted ? `
                <span class="task-due">
                    <i class="fas fa-clock"></i> ${dueDateFormatted}
                </span>` : ''}
            </div>
            ${subtasksCompletionHtml}
            ${task.notes ? `<div class="task-notes">${task.notes}</div>` : ''}
            <div class="task-meta">
                ${estimatedTimeHtml}
                ${repeatHtml}
            </div>
        </div>
        <div class="task-actions">
            <button class="complete-btn" onclick="toggleTaskComplete(${task.id})">
                <i class="fas ${task.completed ? 'fa-times-circle' : 'fa-check-circle'}"></i>
            </button>
            <button class="edit-btn" onclick="openEditModal(${task.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    return taskElement;
}

// Toggle task completion status
function toggleTaskComplete(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;

        // Add completedAt timestamp when task is marked as completed
        if (tasks[taskIndex].completed) {
            tasks[taskIndex].completedAt = new Date().toISOString();
        } else {
            // Remove completedAt when task is marked as incomplete
            delete tasks[taskIndex].completedAt;
        }

        saveTasks();
        renderTasks();
    }
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Open edit modal for a task
function openEditModal(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;

    currentEditTaskId = id;
    editTaskInput.value = task.text;
    editTaskCategory.value = task.category;
    editTaskPriority.value = task.priority;
    editTaskDate.value = task.dueDate || '';
    editTaskTime.value = task.dueTime || '';
    editTaskEstimatedTime.value = task.estimatedTime || '';
    editTaskRepeat.value = task.repeat || 'none';
    editTaskNotes.value = task.notes || '';

    // Load subtasks
    editCurrentSubtasks = task.subtasks ? [...task.subtasks] : [];
    renderEditSubtasks();

    editModal.style.display = 'block';
}

// Save edited task
function saveTaskEdit() {
    if (!currentEditTaskId) return;

    const taskIndex = tasks.findIndex(task => task.id === currentEditTaskId);
    if (taskIndex === -1) return;

    tasks[taskIndex].text = editTaskInput.value.trim();
    tasks[taskIndex].category = editTaskCategory.value;
    tasks[taskIndex].priority = editTaskPriority.value;
    tasks[taskIndex].dueDate = editTaskDate.value;
    tasks[taskIndex].dueTime = editTaskTime.value;
    tasks[taskIndex].estimatedTime = editTaskEstimatedTime.value ? parseInt(editTaskEstimatedTime.value) : null;
    tasks[taskIndex].repeat = editTaskRepeat.value;
    tasks[taskIndex].notes = editTaskNotes.value.trim();
    tasks[taskIndex].subtasks = [...editCurrentSubtasks];

    // Handle custom repeat options
    if (editTaskRepeat.value === 'custom') {
        const repeatEvery = document.getElementById('edit-repeat-every')?.value || 1;
        const repeatPeriod = document.getElementById('edit-repeat-period')?.value || 'day';

        // Get selected weekdays if period is week
        let repeatDays = [];
        if (repeatPeriod === 'week') {
            const checkboxes = document.querySelectorAll('#edit-repeat-on-days input[type="checkbox"]:checked');
            repeatDays = Array.from(checkboxes).map(cb => cb.value);
        }

        tasks[taskIndex].repeatCustom = {
            every: parseInt(repeatEvery),
            period: repeatPeriod,
            days: repeatDays
        };
    } else {
        // Remove custom repeat data if not using custom repeat
        delete tasks[taskIndex].repeatCustom;
    }

    // Save reminders
    if (taskReminders[currentEditTaskId]) {
        tasks[taskIndex].reminders = [...taskReminders[currentEditTaskId]];
    }

    // Save related tasks
    if (taskRelations[currentEditTaskId]) {
        tasks[taskIndex].relatedTasks = [...taskRelations[currentEditTaskId]];
    }

    // Save email reminder if provided
    if (editTaskEmail.value.trim()) {
        tasks[taskIndex].emailReminder = editTaskEmail.value.trim();
    }

    saveTasks();
    saveComments();
    renderTasks();
    editModal.style.display = 'none';
    currentEditTaskId = null;
    editCurrentSubtasks = [];
}

// Clear completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Clear all tasks
function clearAllTasks() {
    if (confirm('هل أنت متأكد من حذف جميع المهام؟')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Check for task reminders
function checkTaskReminders() {
    if (!notificationsEnabled) return;

    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);

    tasks.forEach(task => {
        if (task.completed) return;
        if (!task.dueDate || !task.dueTime) return;

        const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);

        // If task is due within the next 5 minutes
        if (dueDateTime > now && dueDateTime <= fiveMinutesFromNow) {
            new Notification('تذكير بمهمة', {
                body: `المهمة "${task.text}" تستحق خلال 5 دقائق`,
                icon: 'https://cdn-icons-png.flaticon.com/512/2838/2838694.png'
            });
        }
    });
}

// Helper functions
function getPriorityClass(priority) {
    switch (priority) {
        case 'عاجل': return 'urgent';
        case 'مهم': return 'important';
        default: return 'normal';
    }
}

function getCategoryClass(category) {
    switch (category) {
        case 'شخصي': return 'personal';
        case 'عمل': return 'work';
        case 'دراسة': return 'study';
        default: return '';
    }
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Check for recurring tasks and create new instances
function checkRecurringTasks() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    tasks.forEach(task => {
        // Skip non-recurring tasks or incomplete tasks
        if (!task.repeat || task.repeat === 'none' || !task.completed) return;

        // Skip tasks that don't have a due date
        if (!task.dueDate) return;

        // Check if the task was completed today
        if (!task.completedAt) return;

        const completedDate = new Date(task.completedAt).toISOString().split('T')[0];
        if (completedDate !== today) return;

        // Create a new instance of the recurring task
        let newDueDate;
        const dueDate = new Date(`${task.dueDate}T${task.dueTime || '00:00:00'}`);

        switch (task.repeat) {
            case 'daily':
                newDueDate = new Date(dueDate);
                newDueDate.setDate(newDueDate.getDate() + 1);
                break;
            case 'weekly':
                newDueDate = new Date(dueDate);
                newDueDate.setDate(newDueDate.getDate() + 7);
                break;
            case 'monthly':
                newDueDate = new Date(dueDate);
                newDueDate.setMonth(newDueDate.getMonth() + 1);
                break;
            default:
                return;
        }

        const newTask = {
            id: Date.now(),
            text: task.text,
            category: task.category,
            priority: task.priority,
            dueDate: newDueDate.toISOString().split('T')[0],
            dueTime: task.dueTime,
            estimatedTime: task.estimatedTime,
            repeat: task.repeat,
            notes: task.notes,
            subtasks: task.subtasks ? task.subtasks.map(subtask => ({
                ...subtask,
                completed: false
            })) : [],
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.unshift(newTask);
        saveTasks();
    });

    renderTasks();
}

// Save comments to localStorage
function saveComments() {
    localStorage.setItem('taskComments', JSON.stringify(currentComments));
}

// Load comments from localStorage
function loadComments() {
    const savedComments = localStorage.getItem('taskComments');
    if (savedComments) {
        currentComments = JSON.parse(savedComments);
    }
}

// Set email reminder
function setEmailReminder() {
    if (!currentEditTaskId) return;

    const email = editTaskEmail.value.trim();
    if (!email) {
        alert('الرجاء إدخال عنوان بريد إلكتروني صالح');
        return;
    }

    const taskIndex = tasks.findIndex(task => task.id === currentEditTaskId);
    if (taskIndex === -1) return;

    tasks[taskIndex].emailReminder = email;

    // In a real application, this would send the reminder to a server
    alert(`تم تعيين التذكير على البريد الإلكتروني: ${email}`);

    saveTasks();
}

// Open share modal
function openShareModal() {
    if (!currentEditTaskId) return;

    const taskIndex = tasks.findIndex(task => task.id === currentEditTaskId);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    const shareUrl = `${baseUrl}?task=${task.id}`;

    shareLink.value = shareUrl;
    shareModal.style.display = 'block';
}

// Copy share link to clipboard
function copyShareLink() {
    shareLink.select();
    document.execCommand('copy');
    alert('تم نسخ الرابط!');
}

// Share via WhatsApp
function shareViaWhatsapp() {
    const url = encodeURIComponent(shareLink.value);
    const text = encodeURIComponent('شاهد هذه المهمة في تطبيق قائمة المهام:');
    window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
}

// Share via Email
function shareViaEmail() {
    const url = shareLink.value;
    const subject = encodeURIComponent('مشاركة مهمة من تطبيق قائمة المهام');
    const body = encodeURIComponent(`شاهد هذه المهمة في تطبيق قائمة المهام:\n\n${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}

// Open comments modal
function openCommentsModal() {
    if (!currentEditTaskId) return;

    renderComments(currentEditTaskId);
    commentsModal.style.display = 'block';
}

// Add a comment to the current task
function addComment() {
    if (!currentEditTaskId) return;

    const commentText = commentInput.value.trim();
    if (!commentText) return;

    if (!currentComments[currentEditTaskId]) {
        currentComments[currentEditTaskId] = [];
    }

    const newComment = {
        id: Date.now(),
        text: commentText,
        createdAt: new Date().toISOString(),
        author: 'أنت' // In a real app, this would be the user's name
    };

    currentComments[currentEditTaskId].push(newComment);
    saveComments();
    renderComments(currentEditTaskId);

    commentInput.value = '';
}

// Render comments for a task
function renderComments(taskId) {
    commentsList.innerHTML = '';

    if (!currentComments[taskId] || currentComments[taskId].length === 0) {
        commentsList.innerHTML = '<li>لا توجد تعليقات بعد</li>';
        return;
    }

    currentComments[taskId].forEach(comment => {
        const commentDate = new Date(comment.createdAt);
        const formattedDate = new Intl.DateTimeFormat('ar-SA', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(commentDate);

        const commentElement = document.createElement('li');
        commentElement.className = 'comment-item';
        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${formattedDate}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
        `;

        commentsList.appendChild(commentElement);
    });
}

// Check for shared task in URL
function checkForSharedTask() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedTaskId = urlParams.get('task');

    if (sharedTaskId) {
        const taskId = parseInt(sharedTaskId);
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            openEditModal(taskId);
        }
    }
}

// Export tasks to PDF
function exportToPdf() {
    // In a real application, this would use a library like jsPDF
    // For this demo, we'll create a printable page
    const printWindow = window.open('', '_blank');

    let html = `
        <html>
        <head>
            <title>قائمة المهام</title>
            <style>
                body { font-family: Arial, sans-serif; direction: rtl; }
                .task { margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; }
                .task-title { font-weight: bold; font-size: 18px; }
                .task-details { margin-top: 5px; color: #666; }
                .completed { text-decoration: line-through; }
            </style>
        </head>
        <body>
            <h1>قائمة المهام</h1>
    `;

    tasks.forEach(task => {
        html += `
            <div class="task ${task.completed ? 'completed' : ''}">
                <div class="task-title">${task.text}</div>
                <div class="task-details">
                    <p>الفئة: ${task.category}</p>
                    <p>الأولوية: ${task.priority}</p>
                    ${task.dueDate ? `<p>تاريخ الاستحقاق: ${task.dueDate} ${task.dueTime || ''}</p>` : ''}
                    ${task.notes ? `<p>ملاحظات: ${task.notes}</p>` : ''}
                </div>
            </div>
        `;
    });

    html += `
        </body>
        </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
}

// Export tasks to CSV
function exportToCsv() {
    let csv = 'النص,الفئة,الأولوية,تاريخ الاستحقاق,وقت الاستحقاق,الحالة,ملاحظات\n';

    tasks.forEach(task => {
        const status = task.completed ? 'مكتملة' : 'غير مكتملة';
        const notes = task.notes ? task.notes.replace(/,/g, ' ').replace(/\n/g, ' ') : '';

        csv += `"${task.text}","${task.category}","${task.priority}","${task.dueDate || ''}","${task.dueTime || ''}","${status}","${notes}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'tasks.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Make functions available globally
window.toggleTaskComplete = toggleTaskComplete;
window.deleteTask = deleteTask;
window.openEditModal = openEditModal;
window.deleteSubtask = deleteSubtask;
window.deleteEditSubtask = deleteEditSubtask;
window.toggleEditSubtaskComplete = toggleEditSubtaskComplete;

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
