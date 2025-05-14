// Keyboard Shortcuts for To-Do List App

class KeyboardShortcuts {
    constructor() {
        this.shortcuts = [
            { key: 'N', description: 'إضافة مهمة جديدة', action: this.focusNewTask },
            { key: '/', description: 'البحث عن مهمة', action: this.focusSearch },
            { key: 'S', description: 'حفظ التغييرات', action: this.saveChanges },
            { key: 'D', description: 'الانتقال إلى لوحة المعلومات', action: this.goToDashboard },
            { key: 'G', description: 'الانتقال إلى الإعدادات', action: this.goToSettings },
            { key: 'B', description: 'الانتقال إلى النسخ الاحتياطي', action: this.goToBackup },
            { key: 'H', description: 'العودة إلى الصفحة الرئيسية', action: this.goToHome },
            { key: 'T', description: 'تبديل الوضع الليلي/النهاري', action: this.toggleTheme },
            { key: 'F', description: 'تصفية المهام', action: this.focusFilter },
            { key: 'C', description: 'مسح المهام المكتملة', action: this.clearCompleted },
            { key: 'A', description: 'تحديد جميع المهام', action: this.selectAllTasks },
            { key: 'Escape', description: 'إغلاق النوافذ المنبثقة', action: this.closeModals },
            { key: '?', description: 'عرض اختصارات لوحة المفاتيح', action: this.showShortcuts }
        ];
        
        this.shortcutsModal = null;
    }
    
    // Initialize keyboard shortcuts
    init() {
        // Create shortcuts modal
        this.createShortcutsModal();
        
        // Add keyboard event listener
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            // Check for keyboard shortcuts
            this.shortcuts.forEach(shortcut => {
                if (e.key.toUpperCase() === shortcut.key.toUpperCase() && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    shortcut.action();
                }
            });
        });
    }
    
    // Create shortcuts modal
    createShortcutsModal() {
        // Create modal container
        this.shortcutsModal = document.createElement('div');
        this.shortcutsModal.className = 'shortcuts-modal';
        
        // Create modal content
        const content = document.createElement('div');
        content.className = 'shortcuts-content';
        
        // Create title
        const title = document.createElement('h2');
        title.className = 'shortcuts-title';
        title.textContent = 'اختصارات لوحة المفاتيح';
        
        // Create shortcuts list
        const list = document.createElement('ul');
        list.className = 'shortcuts-list';
        
        // Add shortcuts to list
        this.shortcuts.forEach(shortcut => {
            const item = document.createElement('li');
            item.className = 'shortcut-item';
            
            const keySpan = document.createElement('span');
            keySpan.className = 'shortcut-key';
            keySpan.textContent = shortcut.key;
            
            const descSpan = document.createElement('span');
            descSpan.className = 'shortcut-description';
            descSpan.textContent = shortcut.description;
            
            item.appendChild(keySpan);
            item.appendChild(descSpan);
            list.appendChild(item);
        });
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'shortcuts-close';
        closeButton.textContent = 'إغلاق';
        closeButton.addEventListener('click', () => {
            this.hideShortcuts();
        });
        
        // Add event listener to close on Escape key
        this.shortcutsModal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideShortcuts();
            }
        });
        
        // Add event listener to close when clicking outside
        this.shortcutsModal.addEventListener('click', (e) => {
            if (e.target === this.shortcutsModal) {
                this.hideShortcuts();
            }
        });
        
        // Assemble modal
        content.appendChild(title);
        content.appendChild(list);
        content.appendChild(closeButton);
        this.shortcutsModal.appendChild(content);
        
        // Add to document
        document.body.appendChild(this.shortcutsModal);
    }
    
    // Show shortcuts modal
    showShortcuts() {
        if (keyboardShortcuts.shortcutsModal) {
            keyboardShortcuts.shortcutsModal.classList.add('active');
        }
    }
    
    // Hide shortcuts modal
    hideShortcuts() {
        if (keyboardShortcuts.shortcutsModal) {
            keyboardShortcuts.shortcutsModal.classList.remove('active');
        }
    }
    
    // Focus on new task input
    focusNewTask() {
        const taskInput = document.getElementById('task-input');
        if (taskInput) {
            taskInput.focus();
        }
    }
    
    // Focus on search input
    focusSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Save changes (when in edit mode)
    saveChanges() {
        const saveEditBtn = document.getElementById('save-edit');
        if (saveEditBtn && window.getComputedStyle(document.getElementById('edit-modal')).display !== 'none') {
            saveEditBtn.click();
        }
    }
    
    // Go to dashboard
    goToDashboard() {
        window.location.href = 'dashboard.html';
    }
    
    // Go to settings
    goToSettings() {
        window.location.href = 'settings.html';
    }
    
    // Go to backup
    goToBackup() {
        window.location.href = 'backup.html';
    }
    
    // Go to home
    goToHome() {
        window.location.href = 'index.html';
    }
    
    // Toggle theme
    toggleTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.click();
        }
    }
    
    // Focus on filter dropdown
    focusFilter() {
        const filterCategory = document.getElementById('filter-category');
        if (filterCategory) {
            filterCategory.focus();
        }
    }
    
    // Clear completed tasks
    clearCompleted() {
        const clearCompletedBtn = document.getElementById('clear-completed');
        if (clearCompletedBtn) {
            clearCompletedBtn.click();
        }
    }
    
    // Select all tasks (for bulk actions)
    selectAllTasks() {
        // This would be implemented if we had checkboxes for tasks
        console.log('Select all tasks');
    }
    
    // Close all modals
    closeModals() {
        // Close edit modal
        const editModal = document.getElementById('edit-modal');
        if (editModal && window.getComputedStyle(editModal).display !== 'none') {
            editModal.style.display = 'none';
        }
        
        // Close share modal
        const shareModal = document.getElementById('share-modal');
        if (shareModal && window.getComputedStyle(shareModal).display !== 'none') {
            shareModal.style.display = 'none';
        }
        
        // Close comments modal
        const commentsModal = document.getElementById('comments-modal');
        if (commentsModal && window.getComputedStyle(commentsModal).display !== 'none') {
            commentsModal.style.display = 'none';
        }
        
        // Close shortcuts modal
        keyboardShortcuts.hideShortcuts();
    }
}

// Create and initialize keyboard shortcuts
const keyboardShortcuts = new KeyboardShortcuts();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    keyboardShortcuts.init();
});

// Export for use in other files
window.keyboardShortcuts = keyboardShortcuts;
