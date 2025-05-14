// Welcome Tour for new users
class WelcomeTour {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            {
                title: 'مرحبًا بك في تطبيق قائمة المهام!',
                content: 'سنقوم بجولة سريعة لمساعدتك على التعرف على الميزات الرئيسية للتطبيق.',
                target: null,
                position: 'center'
            },
            {
                title: 'إضافة مهمة جديدة',
                content: 'أدخل نص المهمة هنا، ثم اختر الفئة والأولوية وتاريخ الاستحقاق.',
                target: '.task-form',
                position: 'bottom'
            },
            {
                title: 'المهام الفرعية',
                content: 'يمكنك إضافة مهام فرعية لتقسيم المهام الكبيرة إلى خطوات أصغر.',
                target: '.subtasks-container',
                position: 'bottom'
            },
            {
                title: 'البحث والتصفية',
                content: 'استخدم شريط البحث للعثور على مهام محددة، أو قم بتصفية المهام حسب الفئة والأولوية.',
                target: '.search-container',
                position: 'bottom'
            },
            {
                title: 'ترتيب المهام',
                content: 'يمكنك ترتيب المهام حسب تاريخ الإضافة، تاريخ الاستحقاق، الأولوية، أو الفئة.',
                target: '#sort-tasks',
                position: 'bottom'
            },
            {
                title: 'لوحة المعلومات',
                content: 'انقر هنا للوصول إلى لوحة المعلومات التي تعرض إحصائيات عن مهامك.',
                target: '.dashboard-btn',
                position: 'bottom'
            },
            {
                title: 'الإعدادات',
                content: 'قم بتخصيص التطبيق وفقًا لتفضيلاتك من خلال صفحة الإعدادات.',
                target: '.settings-btn',
                position: 'bottom'
            },
            {
                title: 'اختصارات لوحة المفاتيح',
                content: 'اضغط على "?" في أي وقت لعرض قائمة اختصارات لوحة المفاتيح المتاحة.',
                target: null,
                position: 'center'
            },
            {
                title: 'أنت جاهز الآن!',
                content: 'استمتع باستخدام تطبيق قائمة المهام. يمكنك إعادة تشغيل هذه الجولة في أي وقت من صفحة الإعدادات.',
                target: null,
                position: 'center'
            }
        ];
        
        this.overlay = null;
        this.tooltip = null;
        this.isFirstVisit = localStorage.getItem('firstVisit') !== 'false';
    }
    
    // Initialize the tour
    init() {
        // Check if this is the first visit
        if (this.isFirstVisit) {
            // Set first visit to false for future visits
            localStorage.setItem('firstVisit', 'false');
            
            // Start the tour after a short delay to ensure the page is fully loaded
            setTimeout(() => {
                this.start();
            }, 1000);
        }
        
        // Add keyboard shortcut for showing the tour (? key)
        document.addEventListener('keydown', (e) => {
            if (e.key === '?' && !this.isActive()) {
                this.start();
            } else if (e.key === 'Escape' && this.isActive()) {
                this.end();
            }
        });
    }
    
    // Start the tour
    start() {
        this.currentStep = 0;
        this.createOverlay();
        this.createTooltip();
        this.showStep(0);
        document.body.classList.add('tour-active');
    }
    
    // End the tour
    end() {
        if (this.overlay) {
            document.body.removeChild(this.overlay);
            this.overlay = null;
        }
        
        if (this.tooltip) {
            document.body.removeChild(this.tooltip);
            this.tooltip = null;
        }
        
        document.body.classList.remove('tour-active');
    }
    
    // Check if tour is active
    isActive() {
        return this.overlay !== null;
    }
    
    // Create the overlay
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'tour-overlay';
        document.body.appendChild(this.overlay);
    }
    
    // Create the tooltip
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tour-tooltip';
        
        const tooltipContent = document.createElement('div');
        tooltipContent.className = 'tour-tooltip-content';
        
        const tooltipTitle = document.createElement('h3');
        tooltipTitle.className = 'tour-tooltip-title';
        
        const tooltipText = document.createElement('p');
        tooltipText.className = 'tour-tooltip-text';
        
        const tooltipButtons = document.createElement('div');
        tooltipButtons.className = 'tour-tooltip-buttons';
        
        const prevButton = document.createElement('button');
        prevButton.className = 'tour-btn tour-prev-btn';
        prevButton.textContent = 'السابق';
        prevButton.addEventListener('click', () => this.prevStep());
        
        const nextButton = document.createElement('button');
        nextButton.className = 'tour-btn tour-next-btn';
        nextButton.textContent = 'التالي';
        nextButton.addEventListener('click', () => this.nextStep());
        
        const skipButton = document.createElement('button');
        skipButton.className = 'tour-btn tour-skip-btn';
        skipButton.textContent = 'تخطي';
        skipButton.addEventListener('click', () => this.end());
        
        tooltipButtons.appendChild(prevButton);
        tooltipButtons.appendChild(nextButton);
        tooltipButtons.appendChild(skipButton);
        
        tooltipContent.appendChild(tooltipTitle);
        tooltipContent.appendChild(tooltipText);
        tooltipContent.appendChild(tooltipButtons);
        
        this.tooltip.appendChild(tooltipContent);
        document.body.appendChild(this.tooltip);
    }
    
    // Show a specific step
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            this.end();
            return;
        }
        
        const step = this.steps[stepIndex];
        const tooltipTitle = this.tooltip.querySelector('.tour-tooltip-title');
        const tooltipText = this.tooltip.querySelector('.tour-tooltip-text');
        const prevButton = this.tooltip.querySelector('.tour-prev-btn');
        const nextButton = this.tooltip.querySelector('.tour-next-btn');
        
        // Update tooltip content
        tooltipTitle.textContent = step.title;
        tooltipText.textContent = step.content;
        
        // Update buttons
        prevButton.style.display = stepIndex > 0 ? 'inline-block' : 'none';
        nextButton.textContent = stepIndex < this.steps.length - 1 ? 'التالي' : 'إنهاء';
        
        // Position the tooltip
        this.positionTooltip(step);
        
        // Update current step
        this.currentStep = stepIndex;
    }
    
    // Position the tooltip relative to the target element
    positionTooltip(step) {
        if (step.position === 'center' || !step.target) {
            // Center in the viewport
            this.tooltip.style.top = '50%';
            this.tooltip.style.left = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%)';
            return;
        }
        
        const targetElement = document.querySelector(step.target);
        if (!targetElement) {
            // Fallback to center if target not found
            this.tooltip.style.top = '50%';
            this.tooltip.style.left = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%)';
            return;
        }
        
        const targetRect = targetElement.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        // Position based on specified position
        switch (step.position) {
            case 'top':
                this.tooltip.style.top = `${targetRect.top - tooltipRect.height - 10}px`;
                this.tooltip.style.left = `${targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)}px`;
                this.tooltip.style.transform = 'none';
                break;
            case 'bottom':
                this.tooltip.style.top = `${targetRect.bottom + 10}px`;
                this.tooltip.style.left = `${targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)}px`;
                this.tooltip.style.transform = 'none';
                break;
            case 'left':
                this.tooltip.style.top = `${targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)}px`;
                this.tooltip.style.left = `${targetRect.left - tooltipRect.width - 10}px`;
                this.tooltip.style.transform = 'none';
                break;
            case 'right':
                this.tooltip.style.top = `${targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)}px`;
                this.tooltip.style.left = `${targetRect.right + 10}px`;
                this.tooltip.style.transform = 'none';
                break;
            default:
                // Default to bottom
                this.tooltip.style.top = `${targetRect.bottom + 10}px`;
                this.tooltip.style.left = `${targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)}px`;
                this.tooltip.style.transform = 'none';
        }
        
        // Highlight the target element
        targetElement.classList.add('tour-highlight');
        
        // Remove highlight from other elements
        document.querySelectorAll('.tour-highlight').forEach(el => {
            if (el !== targetElement) {
                el.classList.remove('tour-highlight');
            }
        });
    }
    
    // Go to the next step
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.end();
        }
    }
    
    // Go to the previous step
    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }
}

// Create and initialize the tour
const welcomeTour = new WelcomeTour();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    welcomeTour.init();
});

// Export for use in other files
window.welcomeTour = welcomeTour;
