// DOM Elements
const totalTasksCount = document.getElementById('total-tasks-count');
const completedTasksCount = document.getElementById('completed-tasks-count');
const pendingTasksCount = document.getElementById('pending-tasks-count');
const completionRateElement = document.getElementById('completion-rate');
const mostActiveCategoryElement = document.getElementById('most-active-category');
const upcomingTasksElement = document.getElementById('upcoming-tasks');
const themeToggle = document.getElementById('theme-toggle');

// Chart elements
const categoriesChartCtx = document.getElementById('categories-chart').getContext('2d');
const prioritiesChartCtx = document.getElementById('priorities-chart').getContext('2d');
const completionChartCtx = document.getElementById('completion-chart').getContext('2d');

// Global variables
let tasks = [];
let categoriesChart, prioritiesChart, completionChart;

// Chart colors
const chartColors = {
    personal: 'rgba(111, 66, 193, 0.7)',
    work: 'rgba(32, 201, 151, 0.7)',
    study: 'rgba(253, 126, 20, 0.7)',
    normal: 'rgba(74, 111, 165, 0.7)',
    important: 'rgba(255, 193, 7, 0.7)',
    urgent: 'rgba(220, 53, 69, 0.7)'
};

// Initialize the dashboard
function init() {
    loadTasks();
    loadTheme();
    setupEventListeners();
    updateDashboard();
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
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
    
    // Update charts with new theme
    updateCharts();
}

// Setup event listeners
function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    
    // Update dashboard when window is resized
    window.addEventListener('resize', () => {
        if (categoriesChart) categoriesChart.resize();
        if (prioritiesChart) prioritiesChart.resize();
        if (completionChart) completionChart.resize();
    });
}

// Update the entire dashboard
function updateDashboard() {
    updateSummary();
    updateCharts();
    updateMostActiveCategory();
    updateUpcomingTasks();
}

// Update summary statistics
function updateSummary() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    totalTasksCount.textContent = total;
    completedTasksCount.textContent = completed;
    pendingTasksCount.textContent = pending;
    completionRateElement.textContent = `${completionRate}%`;
}

// Update all charts
function updateCharts() {
    updateCategoriesChart();
    updatePrioritiesChart();
    updateCompletionChart();
}

// Update categories chart
function updateCategoriesChart() {
    // Count tasks by category
    const categoryCounts = {
        'شخصي': 0,
        'عمل': 0,
        'دراسة': 0
    };
    
    tasks.forEach(task => {
        if (categoryCounts.hasOwnProperty(task.category)) {
            categoryCounts[task.category]++;
        }
    });
    
    const data = {
        labels: Object.keys(categoryCounts),
        datasets: [{
            data: Object.values(categoryCounts),
            backgroundColor: [
                chartColors.personal,
                chartColors.work,
                chartColors.study
            ],
            borderWidth: 1
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: {
                        size: 14
                    }
                }
            }
        }
    };
    
    // Destroy previous chart if it exists
    if (categoriesChart) {
        categoriesChart.destroy();
    }
    
    // Create new chart
    categoriesChart = new Chart(categoriesChartCtx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

// Update priorities chart
function updatePrioritiesChart() {
    // Count tasks by priority
    const priorityCounts = {
        'عادي': 0,
        'مهم': 0,
        'عاجل': 0
    };
    
    tasks.forEach(task => {
        if (priorityCounts.hasOwnProperty(task.priority)) {
            priorityCounts[task.priority]++;
        }
    });
    
    const data = {
        labels: Object.keys(priorityCounts),
        datasets: [{
            label: 'عدد المهام',
            data: Object.values(priorityCounts),
            backgroundColor: [
                chartColors.normal,
                chartColors.important,
                chartColors.urgent
            ],
            borderWidth: 1
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };
    
    // Destroy previous chart if it exists
    if (prioritiesChart) {
        prioritiesChart.destroy();
    }
    
    // Create new chart
    prioritiesChart = new Chart(prioritiesChartCtx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// Update completion chart (weekly progress)
function updateCompletionChart() {
    // Get dates for the last 7 days
    const dates = [];
    const completedCounts = [];
    const addedCounts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        dates.push(formatDate(date));
        
        // Count tasks completed on this date
        const completedOnDate = tasks.filter(task => {
            if (!task.completed) return false;
            const completedDate = new Date(task.completedAt);
            return completedDate.toISOString().split('T')[0] === dateString;
        }).length;
        
        // Count tasks added on this date
        const addedOnDate = tasks.filter(task => {
            const createdDate = new Date(task.createdAt);
            return createdDate.toISOString().split('T')[0] === dateString;
        }).length;
        
        completedCounts.push(completedOnDate);
        addedCounts.push(addedOnDate);
    }
    
    const data = {
        labels: dates,
        datasets: [
            {
                label: 'مهام مكتملة',
                data: completedCounts,
                borderColor: chartColors.work,
                backgroundColor: 'rgba(32, 201, 151, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'مهام مضافة',
                data: addedCounts,
                borderColor: chartColors.personal,
                backgroundColor: 'rgba(111, 66, 193, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };
    
    // Destroy previous chart if it exists
    if (completionChart) {
        completionChart.destroy();
    }
    
    // Create new chart
    completionChart = new Chart(completionChartCtx, {
        type: 'line',
        data: data,
        options: options
    });
}

// Update most active category section
function updateMostActiveCategory() {
    // Count tasks by category
    const categoryCounts = {};
    tasks.forEach(task => {
        if (!categoryCounts[task.category]) {
            categoryCounts[task.category] = 0;
        }
        categoryCounts[task.category]++;
    });
    
    // Sort categories by count
    const sortedCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1]);
    
    if (sortedCategories.length === 0) {
        mostActiveCategoryElement.innerHTML = '<p>لا توجد بيانات كافية</p>';
        return;
    }
    
    let html = '';
    sortedCategories.forEach(([category, count]) => {
        html += `
            <div class="category-item">
                <span class="category-name">${category}</span>
                <span class="category-count">${count} مهام</span>
            </div>
        `;
    });
    
    mostActiveCategoryElement.innerHTML = html;
}

// Update upcoming tasks section
function updateUpcomingTasks() {
    // Get pending tasks with due dates
    const pendingTasks = tasks.filter(task => 
        !task.completed && task.dueDate && task.dueTime
    );
    
    // Sort by due date (closest first)
    pendingTasks.sort((a, b) => {
        const dateA = new Date(`${a.dueDate}T${a.dueTime}`);
        const dateB = new Date(`${b.dueDate}T${b.dueTime}`);
        return dateA - dateB;
    });
    
    // Take only the next 5 tasks
    const upcomingTasks = pendingTasks.slice(0, 5);
    
    if (upcomingTasks.length === 0) {
        upcomingTasksElement.innerHTML = '<p>لا توجد مهام قادمة</p>';
        return;
    }
    
    let html = '';
    upcomingTasks.forEach(task => {
        const dueDate = new Date(`${task.dueDate}T${task.dueTime}`);
        const formattedDate = new Intl.DateTimeFormat('ar-SA', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
        }).format(dueDate);
        
        html += `
            <div class="upcoming-task">
                <span class="task-name">${task.text}</span>
                <span class="task-due">${formattedDate}</span>
            </div>
        `;
    });
    
    upcomingTasksElement.innerHTML = html;
}

// Helper function to format date
function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('ar-SA', options).format(date);
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
