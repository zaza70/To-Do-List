// Advanced Task Management Features

// Global variables
let taskRelations = {};
let taskReminders = {};
let taskTimeEstimates = {};

// Initialize advanced features
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    loadTaskRelations();
    loadTaskReminders();
    loadTaskTimeEstimates();
    
    // Initialize event listeners
    initAdvancedTaskFeatures();
});

// Load saved task relations
function loadTaskRelations() {
    const savedRelations = localStorage.getItem('taskRelations');
    if (savedRelations) {
        taskRelations = JSON.parse(savedRelations);
    }
}

// Save task relations
function saveTaskRelations() {
    localStorage.setItem('taskRelations', JSON.stringify(taskRelations));
}

// Load saved task reminders
function loadTaskReminders() {
    const savedReminders = localStorage.getItem('taskReminders');
    if (savedReminders) {
        taskReminders = JSON.parse(savedReminders);
    }
}

// Save task reminders
function saveTaskReminders() {
    localStorage.setItem('taskReminders', JSON.stringify(taskReminders));
}

// Load saved time estimates
function loadTaskTimeEstimates() {
    const savedEstimates = localStorage.getItem('taskTimeEstimates');
    if (savedEstimates) {
        taskTimeEstimates = JSON.parse(savedEstimates);
    }
}

// Save time estimates
function saveTaskTimeEstimates() {
    localStorage.setItem('taskTimeEstimates', JSON.stringify(taskTimeEstimates));
}

// Initialize advanced task features
function initAdvancedTaskFeatures() {
    // Custom repeat options
    document.getElementById('task-repeat').addEventListener('change', toggleCustomRepeatOptions);
    document.getElementById('edit-task-repeat').addEventListener('change', toggleEditCustomRepeatOptions);
    
    // Related tasks
    document.getElementById('add-related-task').addEventListener('click', showRelatedTaskSelector);
    document.getElementById('add-relation').addEventListener('click', addTaskRelation);
    
    // Reminders
    document.getElementById('add-reminder').addEventListener('click', addTaskReminder);
    
    // Time estimation
    document.getElementById('task-estimated-time').addEventListener('focus', suggestTimeEstimate);
    document.getElementById('edit-task-estimated-time').addEventListener('focus', suggestTimeEstimate);
}

// Toggle custom repeat options visibility
function toggleCustomRepeatOptions() {
    const repeatSelect = document.getElementById('task-repeat');
    const customOptions = document.getElementById('custom-repeat-options');
    
    if (repeatSelect.value === 'custom') {
        customOptions.style.display = 'block';
    } else {
        customOptions.style.display = 'none';
    }
}

// Toggle custom repeat options in edit modal
function toggleEditCustomRepeatOptions() {
    const repeatSelect = document.getElementById('edit-task-repeat');
    const customOptions = document.getElementById('edit-custom-repeat-options');
    
    if (repeatSelect.value === 'custom') {
        customOptions.style.display = 'block';
    } else {
        customOptions.style.display = 'none';
    }
}

// Get next occurrence date based on repeat pattern
function getNextOccurrence(task) {
    if (!task.repeat || task.repeat === 'none') return null;
    
    const baseDate = task.dueDate ? new Date(`${task.dueDate}T${task.dueTime || '00:00:00'}`) : new Date();
    let nextDate = new Date(baseDate);
    
    switch (task.repeat) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case 'workdays':
            // Skip to next workday (Monday-Friday)
            do {
                nextDate.setDate(nextDate.getDate() + 1);
            } while (nextDate.getDay() === 0 || nextDate.getDay() === 6); // Skip Saturday and Sunday
            break;
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'biweekly':
            nextDate.setDate(nextDate.getDate() + 14);
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case 'last-day-month':
            // Set to last day of next month
            nextDate.setMonth(nextDate.getMonth() + 1);
            nextDate.setDate(0); // Setting day to 0 gets the last day of previous month
            break;
        case 'quarterly':
            nextDate.setMonth(nextDate.getMonth() + 3);
            break;
        case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        case 'custom':
            // Handle custom repeat logic
            if (task.repeatCustom) {
                const { every, period, days } = task.repeatCustom;
                
                if (period === 'day') {
                    nextDate.setDate(nextDate.getDate() + every);
                } else if (period === 'week') {
                    if (days && days.length > 0) {
                        // Find next day that matches one in the days array
                        let found = false;
                        let count = 0;
                        while (!found && count < 14) { // Limit to 2 weeks to prevent infinite loop
                            nextDate.setDate(nextDate.getDate() + 1);
                            count++;
                            if (days.includes(nextDate.getDay().toString())) {
                                found = true;
                            }
                        }
                    } else {
                        nextDate.setDate(nextDate.getDate() + (7 * every));
                    }
                } else if (period === 'month') {
                    nextDate.setMonth(nextDate.getMonth() + every);
                } else if (period === 'year') {
                    nextDate.setFullYear(nextDate.getFullYear() + every);
                }
            }
            break;
    }
    
    return nextDate;
}

// Show related task selector
function showRelatedTaskSelector() {
    const relatedTaskSelect = document.getElementById('related-task-id');
    
    // Clear existing options
    relatedTaskSelect.innerHTML = '';
    
    // Add options for all tasks except the current one
    tasks.forEach(task => {
        if (task.id !== currentEditTaskId) {
            const option = document.createElement('option');
            option.value = task.id;
            option.textContent = task.text;
            relatedTaskSelect.appendChild(option);
        }
    });
}

// Add task relation
function addTaskRelation() {
    const relationType = document.getElementById('relation-type').value;
    const relatedTaskId = parseInt(document.getElementById('related-task-id').value);
    
    if (!relatedTaskId || isNaN(relatedTaskId)) return;
    
    // Initialize relations array for this task if it doesn't exist
    if (!taskRelations[currentEditTaskId]) {
        taskRelations[currentEditTaskId] = [];
    }
    
    // Check if relation already exists
    const existingRelation = taskRelations[currentEditTaskId].find(
        relation => relation.taskId === relatedTaskId && relation.type === relationType
    );
    
    if (existingRelation) return; // Don't add duplicate relations
    
    // Add the new relation
    taskRelations[currentEditTaskId].push({
        taskId: relatedTaskId,
        type: relationType
    });
    
    // Save and render
    saveTaskRelations();
    renderTaskRelations();
}

// Render task relations
function renderTaskRelations() {
    const relatedTasksList = document.getElementById('related-tasks-list');
    relatedTasksList.innerHTML = '';
    
    if (!taskRelations[currentEditTaskId] || taskRelations[currentEditTaskId].length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.textContent = 'لا توجد مهام مرتبطة';
        emptyItem.className = 'empty-list-message';
        relatedTasksList.appendChild(emptyItem);
        return;
    }
    
    taskRelations[currentEditTaskId].forEach(relation => {
        const relatedTask = tasks.find(task => task.id === relation.taskId);
        if (!relatedTask) return;
        
        const relationItem = document.createElement('li');
        relationItem.className = 'related-task-item';
        
        const relationTypeText = {
            'depends-on': 'يعتمد على',
            'blocks': 'يمنع',
            'related-to': 'مرتبط بـ',
            'duplicates': 'مكرر من'
        }[relation.type] || relation.type;
        
        relationItem.innerHTML = `
            <span class="relation-type">${relationTypeText}:</span>
            <span class="related-task-text">${relatedTask.text}</span>
            <button class="remove-relation" data-task-id="${relation.taskId}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        relatedTasksList.appendChild(relationItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-relation').forEach(button => {
        button.addEventListener('click', removeTaskRelation);
    });
}

// Remove task relation
function removeTaskRelation(event) {
    const relatedTaskId = parseInt(event.currentTarget.dataset.taskId);
    
    if (taskRelations[currentEditTaskId]) {
        taskRelations[currentEditTaskId] = taskRelations[currentEditTaskId].filter(
            relation => relation.taskId !== relatedTaskId
        );
        
        saveTaskRelations();
        renderTaskRelations();
    }
}

// Add task reminder
function addTaskReminder() {
    const timeValue = parseInt(document.getElementById('reminder-time-value').value);
    const timeUnit = document.getElementById('reminder-time-unit').value;
    
    if (isNaN(timeValue) || timeValue <= 0) return;
    
    // Initialize reminders array for this task if it doesn't exist
    if (!taskReminders[currentEditTaskId]) {
        taskReminders[currentEditTaskId] = [];
    }
    
    // Add the new reminder
    const reminderId = Date.now(); // Use timestamp as ID
    taskReminders[currentEditTaskId].push({
        id: reminderId,
        timeValue,
        timeUnit
    });
    
    // Save and render
    saveTaskReminders();
    renderTaskReminders();
}

// Render task reminders
function renderTaskReminders() {
    const remindersList = document.getElementById('reminders-list');
    remindersList.innerHTML = '';
    
    if (!taskReminders[currentEditTaskId] || taskReminders[currentEditTaskId].length === 0) {
        return;
    }
    
    taskReminders[currentEditTaskId].forEach(reminder => {
        const reminderItem = document.createElement('li');
        reminderItem.className = 'reminder-item';
        
        const unitText = {
            'minutes': 'دقائق',
            'hours': 'ساعات',
            'days': 'أيام'
        }[reminder.timeUnit] || reminder.timeUnit;
        
        reminderItem.innerHTML = `
            <span class="reminder-text">تذكير قبل ${reminder.timeValue} ${unitText}</span>
            <button class="remove-reminder" data-reminder-id="${reminder.id}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        remindersList.appendChild(reminderItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-reminder').forEach(button => {
        button.addEventListener('click', removeTaskReminder);
    });
}

// Remove task reminder
function removeTaskReminder(event) {
    const reminderId = parseInt(event.currentTarget.dataset.reminderId);
    
    if (taskReminders[currentEditTaskId]) {
        taskReminders[currentEditTaskId] = taskReminders[currentEditTaskId].filter(
            reminder => reminder.id !== reminderId
        );
        
        saveTaskReminders();
        renderTaskReminders();
    }
}

// Suggest time estimate based on similar tasks
function suggestTimeEstimate(event) {
    const inputField = event.target;
    const taskText = currentEditTaskId ? 
        document.getElementById('edit-task-input').value : 
        document.getElementById('task-input').value;
    
    if (!taskText || taskText.trim().length < 3) return;
    
    // Find similar tasks based on text similarity
    const similarTasks = findSimilarTasks(taskText);
    if (similarTasks.length === 0) return;
    
    // Calculate average time
    const totalTime = similarTasks.reduce((sum, task) => sum + task.estimatedTime, 0);
    const averageTime = Math.round(totalTime / similarTasks.length);
    
    if (averageTime <= 0) return;
    
    // Show suggestion
    const suggestionContainer = document.createElement('div');
    suggestionContainer.className = 'time-estimation-suggestion';
    suggestionContainer.innerHTML = `
        مهام مشابهة تستغرق حوالي ${averageTime} دقيقة. 
        <button class="use-suggestion">استخدم هذا التقدير</button>
    `;
    
    // Insert after input field
    inputField.parentNode.insertBefore(suggestionContainer, inputField.nextSibling);
    
    // Add event listener to use suggestion button
    suggestionContainer.querySelector('.use-suggestion').addEventListener('click', () => {
        inputField.value = averageTime;
        suggestionContainer.remove();
    });
    
    // Remove suggestion when clicking elsewhere
    document.addEventListener('click', function removeSuggestion(e) {
        if (e.target !== inputField && !suggestionContainer.contains(e.target)) {
            suggestionContainer.remove();
            document.removeEventListener('click', removeSuggestion);
        }
    });
}

// Find similar tasks based on text similarity
function findSimilarTasks(taskText) {
    // Simple word matching for similarity
    const words = taskText.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    if (words.length === 0) return [];
    
    return tasks.filter(task => {
        if (!task.estimatedTime) return false;
        
        const taskWords = task.text.toLowerCase().split(/\s+/).filter(word => word.length > 3);
        let matchCount = 0;
        
        words.forEach(word => {
            if (taskWords.some(taskWord => taskWord.includes(word) || word.includes(taskWord))) {
                matchCount++;
            }
        });
        
        // Consider similar if at least 30% of words match
        return matchCount / words.length >= 0.3;
    });
}

// Check for due reminders
function checkDueReminders() {
    if (!notificationsEnabled) return;
    
    const now = new Date();
    
    tasks.forEach(task => {
        if (task.completed) return;
        if (!task.dueDate || !task.dueTime) return;
        
        const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
        if (!taskReminders[task.id]) return;
        
        taskReminders[task.id].forEach(reminder => {
            let reminderTime = new Date(dueDateTime);
            
            // Calculate reminder time
            if (reminder.timeUnit === 'minutes') {
                reminderTime.setMinutes(reminderTime.getMinutes() - reminder.timeValue);
            } else if (reminder.timeUnit === 'hours') {
                reminderTime.setHours(reminderTime.getHours() - reminder.timeValue);
            } else if (reminder.timeUnit === 'days') {
                reminderTime.setDate(reminderTime.getDate() - reminder.timeValue);
            }
            
            // Check if reminder is due now (within the last minute)
            const timeDiff = Math.abs(now - reminderTime);
            if (timeDiff <= 60000 && now <= dueDateTime) { // 60000 ms = 1 minute
                new Notification('تذكير بمهمة', {
                    body: `تذكير: المهمة "${task.text}" تستحق في ${formatTimeRemaining(dueDateTime, now)}`,
                    icon: 'icons/taskmaster-logo.svg'
                });
                
                // Send email reminder if configured
                if (document.getElementById('notify-email').checked && task.emailReminder) {
                    sendEmailReminder(task);
                }
            }
        });
    });
}

// Format time remaining in a human-readable format
function formatTimeRemaining(dueDate, now) {
    const diffMs = dueDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
        return `${diffDays} يوم و ${diffHours} ساعة`;
    } else if (diffHours > 0) {
        return `${diffHours} ساعة و ${diffMinutes} دقيقة`;
    } else {
        return `${diffMinutes} دقيقة`;
    }
}

// Send email reminder (mock function)
function sendEmailReminder(task) {
    console.log(`Sending email reminder to ${task.emailReminder} for task: ${task.text}`);
    // In a real application, this would make an API call to a server
}

// Check for reminders every minute
setInterval(checkDueReminders, 60000);
