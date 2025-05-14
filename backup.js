// Backup and Restore functionality for To-Do List App

// Function to create a backup of all app data
function createBackup() {
    // Get all data from localStorage
    const tasks = localStorage.getItem('tasks');
    const taskComments = localStorage.getItem('taskComments');
    const darkMode = localStorage.getItem('darkMode');
    
    // Create backup object
    const backupData = {
        tasks: tasks ? JSON.parse(tasks) : [],
        taskComments: taskComments ? JSON.parse(taskComments) : {},
        darkMode: darkMode === 'true',
        backupDate: new Date().toISOString()
    };
    
    // Convert to JSON string
    const backupString = JSON.stringify(backupData);
    
    // Create a Blob with the data
    const blob = new Blob([backupString], { type: 'application/json' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set link properties
    link.href = url;
    link.download = `todo-backup-${formatDate(new Date())}.json`;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    return backupData;
}

// Function to restore data from a backup file
function restoreFromBackup(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                // Parse the backup data
                const backupData = JSON.parse(event.target.result);
                
                // Validate backup data
                if (!backupData.tasks || !Array.isArray(backupData.tasks)) {
                    throw new Error('Invalid backup file: Missing or invalid tasks data');
                }
                
                // Restore tasks
                localStorage.setItem('tasks', JSON.stringify(backupData.tasks));
                
                // Restore comments if available
                if (backupData.taskComments) {
                    localStorage.setItem('taskComments', JSON.stringify(backupData.taskComments));
                }
                
                // Restore theme preference if available
                if (backupData.darkMode !== undefined) {
                    localStorage.setItem('darkMode', backupData.darkMode);
                }
                
                // Return success with stats
                resolve({
                    success: true,
                    taskCount: backupData.tasks.length,
                    backupDate: backupData.backupDate ? new Date(backupData.backupDate) : null
                });
            } catch (error) {
                reject({
                    success: false,
                    error: error.message
                });
            }
        };
        
        reader.onerror = function() {
            reject({
                success: false,
                error: 'Error reading the backup file'
            });
        };
        
        reader.readAsText(file);
    });
}

// Function to handle the file input for restore
function handleRestoreFile(inputElement) {
    return new Promise((resolve, reject) => {
        if (!inputElement.files || inputElement.files.length === 0) {
            reject({
                success: false,
                error: 'No file selected'
            });
            return;
        }
        
        const file = inputElement.files[0];
        
        // Check if it's a JSON file
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            reject({
                success: false,
                error: 'Selected file is not a JSON file'
            });
            return;
        }
        
        restoreFromBackup(file)
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}

// Helper function to format date for filename
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Export functions
window.createBackup = createBackup;
window.handleRestoreFile = handleRestoreFile;
