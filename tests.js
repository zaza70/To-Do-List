// Simple test suite for To-Do List App

// Test runner
function runTests() {
    console.log('Running tests...');
    
    let passedTests = 0;
    let failedTests = 0;
    
    // Run all test functions
    const testFunctions = [
        testTaskCreation,
        testTaskCompletion,
        testTaskDeletion,
        testTaskEditing,
        testSubtasks,
        testFiltering,
        testLocalStorage,
        testBackupRestore
    ];
    
    // Run each test and count results
    testFunctions.forEach(testFn => {
        try {
            const result = testFn();
            if (result.success) {
                console.log(`✅ PASSED: ${result.name}`);
                passedTests++;
            } else {
                console.error(`❌ FAILED: ${result.name} - ${result.error}`);
                failedTests++;
            }
        } catch (error) {
            console.error(`❌ ERROR: ${testFn.name} - ${error.message}`);
            failedTests++;
        }
    });
    
    // Log summary
    console.log(`\nTest Summary: ${passedTests} passed, ${failedTests} failed`);
    
    return {
        passed: passedTests,
        failed: failedTests,
        total: testFunctions.length
    };
}

// Test task creation
function testTaskCreation() {
    const testName = 'Task Creation';
    
    try {
        // Create a test task
        const taskText = 'Test Task ' + Date.now();
        const taskId = Date.now();
        
        const newTask = {
            id: taskId,
            text: taskText,
            category: 'شخصي',
            priority: 'عادي',
            dueDate: '2023-12-31',
            dueTime: '12:00',
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Add task to the array
        const initialTaskCount = tasks.length;
        tasks.unshift(newTask);
        
        // Verify task was added
        if (tasks.length !== initialTaskCount + 1) {
            throw new Error('Task was not added to the array');
        }
        
        // Verify task properties
        const addedTask = tasks.find(t => t.id === taskId);
        if (!addedTask) {
            throw new Error('Could not find added task');
        }
        
        if (addedTask.text !== taskText) {
            throw new Error('Task text does not match');
        }
        
        // Clean up
        tasks = tasks.filter(t => t.id !== taskId);
        
        return {
            success: true,
            name: testName
        };
    } catch (error) {
        return {
            success: false,
            name: testName,
            error: error.message
        };
    }
}

// Test task completion
function testTaskCompletion() {
    const testName = 'Task Completion';
    
    try {
        // Create a test task
        const taskId = Date.now();
        const newTask = {
            id: taskId,
            text: 'Completion Test Task',
            category: 'شخصي',
            priority: 'عادي',
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Add task to the array
        tasks.unshift(newTask);
        
        // Toggle completion
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        tasks[taskIndex].completed = true;
        
        // Verify task was marked as completed
        if (!tasks[taskIndex].completed) {
            throw new Error('Task was not marked as completed');
        }
        
        // Clean up
        tasks = tasks.filter(t => t.id !== taskId);
        
        return {
            success: true,
            name: testName
        };
    } catch (error) {
        return {
            success: false,
            name: testName,
            error: error.message
        };
    }
}

// Test task deletion
function testTaskDeletion() {
    const testName = 'Task Deletion';
    
    try {
        // Create a test task
        const taskId = Date.now();
        const newTask = {
            id: taskId,
            text: 'Deletion Test Task',
            category: 'شخصي',
            priority: 'عادي',
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Add task to the array
        tasks.unshift(newTask);
        
        // Delete the task
        const initialTaskCount = tasks.length;
        tasks = tasks.filter(task => task.id !== taskId);
        
        // Verify task was deleted
        if (tasks.length !== initialTaskCount - 1) {
            throw new Error('Task was not deleted from the array');
        }
        
        // Verify task is no longer in the array
        const deletedTask = tasks.find(t => t.id === taskId);
        if (deletedTask) {
            throw new Error('Task still exists after deletion');
        }
        
        return {
            success: true,
            name: testName
        };
    } catch (error) {
        return {
            success: false,
            name: testName,
            error: error.message
        };
    }
}

// Test task editing
function testTaskEditing() {
    const testName = 'Task Editing';
    
    try {
        // Create a test task
        const taskId = Date.now();
        const originalText = 'Original Text';
        const newText = 'Edited Text';
        
        const newTask = {
            id: taskId,
            text: originalText,
            category: 'شخصي',
            priority: 'عادي',
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Add task to the array
        tasks.unshift(newTask);
        
        // Edit the task
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        tasks[taskIndex].text = newText;
        
        // Verify task was edited
        if (tasks[taskIndex].text !== newText) {
            throw new Error('Task text was not updated');
        }
        
        // Clean up
        tasks = tasks.filter(t => t.id !== taskId);
        
        return {
            success: true,
            name: testName
        };
    } catch (error) {
        return {
            success: false,
            name: testName,
            error: error.message
        };
    }
}

// Test subtasks
function testSubtasks() {
    const testName = 'Subtasks';
    
    try {
        // Create a test task with subtasks
        const taskId = Date.now();
        const subtaskId = taskId + 1;
        
        const newTask = {
            id: taskId,
            text: 'Task with Subtasks',
            category: 'شخصي',
            priority: 'عادي',
            completed: false,
            createdAt: new Date().toISOString(),
            subtasks: [
                {
                    id: subtaskId,
                    text: 'Test Subtask',
                    completed: false
                }
            ]
        };
        
        // Add task to the array
        tasks.unshift(newTask);
        
        // Verify subtask exists
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (!tasks[taskIndex].subtasks || tasks[taskIndex].subtasks.length !== 1) {
            throw new Error('Subtask was not added correctly');
        }
        
        // Toggle subtask completion
        tasks[taskIndex].subtasks[0].completed = true;
        
        // Verify subtask was marked as completed
        if (!tasks[taskIndex].subtasks[0].completed) {
            throw new Error('Subtask was not marked as completed');
        }
        
        // Clean up
        tasks = tasks.filter(t => t.id !== taskId);
        
        return {
            success: true,
            name: testName
        };
    } catch (error) {
        return {
            success: false,
            name: testName,
            error: error.message
        };
    }
}

// Test filtering
function testFiltering() {
    const testName = 'Task Filtering';
    
    try {
        // Create test tasks with different categories
        const taskId1 = Date.now();
        const taskId2 = taskId1 + 1;
        
        const task1 = {
            id: taskId1,
            text: 'Personal Task',
            category: 'شخصي',
            priority: 'عادي',
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        const task2 = {
            id: taskId2,
            text: 'Work Task',
            category: 'عمل',
            priority: 'مهم',
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Add tasks to the array
        tasks.unshift(task1, task2);
        
        // Filter by category
        const personalTasks = tasks.filter(task => task.category === 'شخصي');
        const workTasks = tasks.filter(task => task.category === 'عمل');
        
        // Verify filtering works
        if (personalTasks.length < 1 || workTasks.length < 1) {
            throw new Error('Filtering by category failed');
        }
        
        // Clean up
        tasks = tasks.filter(t => t.id !== taskId1 && t.id !== taskId2);
        
        return {
            success: true,
            name: testName
        };
    } catch (error) {
        return {
            success: false,
            name: testName,
            error: error.message
        };
    }
}

// Test localStorage
function testLocalStorage() {
    const testName = 'LocalStorage';
    
    try {
        // Save current tasks
        const originalTasks = JSON.stringify(tasks);
        
        // Create a test task
        const taskId = Date.now();
        const newTask = {
            id: taskId,
            text: 'LocalStorage Test Task',
            category: 'شخصي',
            priority: 'عادي',
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Add task and save to localStorage
        tasks.unshift(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Load from localStorage
        const loadedTasks = JSON.parse(localStorage.getItem('tasks'));
        
        // Verify task was saved and loaded
        const loadedTask = loadedTasks.find(t => t.id === taskId);
        if (!loadedTask) {
            throw new Error('Task was not saved to localStorage');
        }
        
        // Restore original tasks
        tasks = JSON.parse(originalTasks);
        localStorage.setItem('tasks', originalTasks);
        
        return {
            success: true,
            name: testName
        };
    } catch (error) {
        return {
            success: false,
            name: testName,
            error: error.message
        };
    }
}

// Test backup and restore
function testBackupRestore() {
    const testName = 'Backup and Restore';
    
    try {
        // Save current state
        const originalTasks = JSON.stringify(tasks);
        
        // Create a backup
        const backup = {
            tasks: tasks,
            taskComments: {},
            darkMode: false,
            backupDate: new Date().toISOString()
        };
        
        // Create a test task
        const taskId = Date.now();
        const testTask = {
            id: taskId,
            text: 'Backup Test Task',
            category: 'شخصي',
            priority: 'عادي',
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Clear tasks and add test task
        tasks = [testTask];
        
        // Simulate restore from backup
        tasks = backup.tasks;
        
        // Verify original tasks were restored
        if (JSON.stringify(tasks) !== originalTasks) {
            throw new Error('Tasks were not restored correctly');
        }
        
        return {
            success: true,
            name: testName
        };
    } catch (error) {
        return {
            success: false,
            name: testName,
            error: error.message
        };
    }
}

// Export test runner
window.runTests = runTests;
