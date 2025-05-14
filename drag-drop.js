// Drag and Drop functionality for To-Do List App

class DragDropTasks {
    constructor() {
        this.draggedItem = null;
        this.draggedItemIndex = null;
        this.placeholder = null;
        this.tasksList = null;
        this.tasksArray = [];
    }
    
    // Initialize drag and drop
    init() {
        this.tasksList = document.getElementById('tasks-list');
        if (!this.tasksList) return;
        
        // Add event listener for task list changes
        const observer = new MutationObserver(() => {
            this.setupDragAndDrop();
        });
        
        observer.observe(this.tasksList, { childList: true });
        
        // Initial setup
        this.setupDragAndDrop();
    }
    
    // Setup drag and drop for all task items
    setupDragAndDrop() {
        const taskItems = this.tasksList.querySelectorAll('.task-item');
        
        taskItems.forEach((item, index) => {
            // Skip if already setup
            if (item.getAttribute('draggable') === 'true') return;
            
            // Make item draggable
            item.setAttribute('draggable', 'true');
            
            // Add drag handle
            if (!item.querySelector('.drag-handle')) {
                const dragHandle = document.createElement('div');
                dragHandle.className = 'drag-handle';
                dragHandle.innerHTML = '<i class="fas fa-grip-vertical"></i>';
                
                // Insert at the beginning of the task content
                const taskContent = item.querySelector('.task-content');
                if (taskContent) {
                    taskContent.insertBefore(dragHandle, taskContent.firstChild);
                }
            }
            
            // Add event listeners
            item.addEventListener('dragstart', (e) => this.handleDragStart(e, index));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
            item.addEventListener('dragover', (e) => this.handleDragOver(e));
            item.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            item.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            item.addEventListener('drop', (e) => this.handleDrop(e, index));
        });
        
        // Add event listeners to the task list container
        this.tasksList.addEventListener('dragover', (e) => this.handleContainerDragOver(e));
        this.tasksList.addEventListener('drop', (e) => this.handleContainerDrop(e));
    }
    
    // Handle drag start
    handleDragStart(e, index) {
        // Store reference to dragged item
        this.draggedItem = e.target;
        this.draggedItemIndex = index;
        
        // Add dragging class
        this.draggedItem.classList.add('dragging');
        
        // Create a clone for the drag image
        const dragImage = this.draggedItem.cloneNode(true);
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        document.body.appendChild(dragImage);
        
        // Set drag image
        e.dataTransfer.setDragImage(dragImage, 20, 20);
        
        // Remove the clone after a short delay
        setTimeout(() => {
            document.body.removeChild(dragImage);
        }, 0);
        
        // Create placeholder
        this.placeholder = document.createElement('li');
        this.placeholder.className = 'task-item placeholder';
        this.placeholder.style.height = `${this.draggedItem.offsetHeight}px`;
        
        // Store current tasks array
        this.tasksArray = Array.from(window.tasks);
    }
    
    // Handle drag end
    handleDragEnd(e) {
        // Remove dragging class
        if (this.draggedItem) {
            this.draggedItem.classList.remove('dragging');
        }
        
        // Remove placeholder if it exists
        if (this.placeholder && this.placeholder.parentNode) {
            this.placeholder.parentNode.removeChild(this.placeholder);
        }
        
        // Reset variables
        this.draggedItem = null;
        this.draggedItemIndex = null;
        this.placeholder = null;
    }
    
    // Handle drag over
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    // Handle drag enter
    handleDragEnter(e) {
        e.preventDefault();
        
        // Find the task item being entered
        const targetItem = this.findTaskItem(e.target);
        if (!targetItem || targetItem === this.draggedItem) return;
        
        // Get the index of the target item
        const targetIndex = Array.from(this.tasksList.children).indexOf(targetItem);
        
        // Insert placeholder before or after target based on position
        if (targetIndex > this.draggedItemIndex) {
            targetItem.parentNode.insertBefore(this.placeholder, targetItem.nextSibling);
        } else {
            targetItem.parentNode.insertBefore(this.placeholder, targetItem);
        }
    }
    
    // Handle drag leave
    handleDragLeave(e) {
        // No need to do anything here for now
    }
    
    // Handle drop
    handleDrop(e, index) {
        e.preventDefault();
        
        // Find the task item being dropped on
        const targetItem = this.findTaskItem(e.target);
        if (!targetItem || targetItem === this.draggedItem) return;
        
        // Get the index of the target item
        const targetIndex = Array.from(this.tasksList.children).indexOf(targetItem);
        const draggedIndex = this.draggedItemIndex;
        
        // Reorder tasks array
        this.reorderTasks(draggedIndex, targetIndex);
    }
    
    // Handle container drag over
    handleContainerDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // If dragging over the container but not over any task item,
        // append placeholder to the end
        const taskItem = this.findTaskItem(e.target);
        if (!taskItem && this.tasksList.lastChild !== this.placeholder) {
            this.tasksList.appendChild(this.placeholder);
        }
    }
    
    // Handle container drop
    handleContainerDrop(e) {
        e.preventDefault();
        
        // If dropping directly on the container (not on a task item),
        // move the dragged item to the end
        const taskItem = this.findTaskItem(e.target);
        if (!taskItem) {
            const draggedIndex = this.draggedItemIndex;
            const targetIndex = this.tasksArray.length - 1;
            
            // Reorder tasks array
            this.reorderTasks(draggedIndex, targetIndex);
        }
    }
    
    // Find the parent task item of an element
    findTaskItem(element) {
        while (element && !element.classList.contains('task-item')) {
            element = element.parentElement;
            if (element === this.tasksList) return null;
        }
        return element;
    }
    
    // Reorder tasks array and update UI
    reorderTasks(fromIndex, toIndex) {
        // Get the task being moved
        const task = this.tasksArray[fromIndex];
        
        // Remove task from original position
        this.tasksArray.splice(fromIndex, 1);
        
        // Insert task at new position
        this.tasksArray.splice(toIndex, 0, task);
        
        // Update the global tasks array
        window.tasks = [...this.tasksArray];
        
        // Save to localStorage
        localStorage.setItem('tasks', JSON.stringify(window.tasks));
        
        // Re-render tasks
        window.renderTasks();
    }
}

// Create and initialize drag and drop
const dragDropTasks = new DragDropTasks();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a short delay to ensure tasks are rendered
    setTimeout(() => {
        dragDropTasks.init();
    }, 500);
});

// Export for use in other files
window.dragDropTasks = dragDropTasks;
