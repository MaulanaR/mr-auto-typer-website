// Mr. Auto Typer - Main JavaScript File

class AutoTyperDemo {
    constructor() {
        this.isRunning = false;
        this.currentIndex = 0;
        this.intervalId = null;
        this.delay = 150;
        this.jitterEnabled = false;
        this.text = '';

        if (this.initializeElements()) {
            this.setupEventListeners();
            this.createVirtualKeyboard();
            this.initializeParticles();
            this.startHeroTypewriter();
        }
    }

    initializeElements() {
        this.demoText = document.getElementById('demo-text');
        this.delaySlider = document.getElementById('demo-delay');
        this.delayValue = document.getElementById('delay-value');
        this.jitterToggle = document.getElementById('jitter-toggle');
        this.startButton = document.getElementById('start-demo');
        this.stopButton = document.getElementById('stop-demo');
        this.virtualKeyboard = document.getElementById('virtual-keyboard');
        this.heroText = document.getElementById('hero-text');

        // Return true if all required elements exist
        return this.demoText && this.delaySlider && this.startButton;
    }

    setupEventListeners() {
        this.delaySlider.addEventListener('input', (e) => {
            this.delay = parseInt(e.target.value);
            this.delayValue.textContent = `${this.delay}ms`;
        });

        this.jitterToggle.addEventListener('click', () => {
            this.jitterEnabled = !this.jitterEnabled;
            const toggle = this.jitterToggle.querySelector('span');
            if (this.jitterEnabled) {
                this.jitterToggle.classList.add('bg-blue-600');
                toggle.classList.add('translate-x-6');
            } else {
                this.jitterToggle.classList.remove('bg-blue-600');
                toggle.classList.remove('translate-x-6');
            }
        });

        this.startButton.addEventListener('click', () => {
            this.startTyping();
        });

        this.stopButton.addEventListener('click', () => {
            this.stopTyping();
        });

        // Navigation smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    createVirtualKeyboard() {
        const keyboardLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        ];

        this.virtualKeyboard.innerHTML = '';
        keyboardLayout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'flex justify-center gap-1 mb-1';

            row.forEach(key => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs font-mono key-' + key.toLowerCase();
                keyDiv.textContent = key;
                rowDiv.appendChild(keyDiv);
            });

            this.virtualKeyboard.appendChild(rowDiv);
        });

        // Add spacebar
        const spaceRow = document.createElement('div');
        spaceRow.className = 'flex justify-center gap-1';
        const spaceKey = document.createElement('div');
        spaceKey.className = 'w-32 h-8 bg-gray-700 rounded flex items-center justify-center text-xs font-mono key-space';
        spaceKey.textContent = 'SPACE';
        spaceRow.appendChild(spaceKey);
        this.virtualKeyboard.appendChild(spaceRow);
    }

    highlightKey(char) {
        // Remove previous highlights
        document.querySelectorAll('#virtual-keyboard > div > div').forEach(key => {
            key.classList.remove('bg-blue-600', 'scale-110');
        });

        // Highlight current key
        const keyClass = char === ' ' ? 'key-space' : `key-${char.toLowerCase()}`;
        const keyElement = document.querySelector(`.${keyClass}`);
        if (keyElement) {
            keyElement.classList.add('bg-blue-600', 'scale-110');

            // Animate key press
            anime({
                targets: keyElement,
                scale: [1, 1.2, 1],
                duration: 200,
                easing: 'easeOutQuad'
            });
        }
    }

    startTyping() {
        if (this.isRunning) return;

        this.text = this.demoText.value || this.demoText.placeholder;
        this.currentIndex = 0;
        this.isRunning = true;

        this.startButton.textContent = 'Running...';
        this.startButton.disabled = true;

        this.typeCharacter();
    }

    stopTyping() {
        this.isRunning = false;
        if (this.intervalId) {
            clearTimeout(this.intervalId);
        }

        this.startButton.textContent = 'Start Typing';
        this.startButton.disabled = false;

        // Clear keyboard highlights
        document.querySelectorAll('#virtual-keyboard > div > div').forEach(key => {
            key.classList.remove('bg-blue-600', 'scale-110');
        });
    }

    typeCharacter() {
        if (!this.isRunning || this.currentIndex >= this.text.length) {
            this.stopTyping();
            return;
        }

        const char = this.text[this.currentIndex];
        this.highlightKey(char);

        // Calculate delay with jitter
        let currentDelay = this.delay;
        if (this.jitterEnabled) {
            const jitter = (Math.random() - 0.5) * 0.4 * this.delay;
            currentDelay += jitter;
        }

        this.intervalId = setTimeout(() => {
            this.currentIndex++;
            this.typeCharacter();
        }, currentDelay);
    }

    startHeroTypewriter() {
        const phrases = [
            'Auto Type Text',
            'Boost Productivity',
            'Save Time',
            'Work Smarter'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typePhrase = () => {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                this.heroText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                this.heroText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(typePhrase, typeSpeed);
        };

        typePhrase();
    }

    initializeParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';

            // Random animation duration
            const duration = 3 + Math.random() * 4;
            particle.style.animation = `float ${duration}s ease-in-out infinite`;

            particlesContainer.appendChild(particle);

            // Animate particle movement
            this.animateParticle(particle);
        }
    }

    animateParticle(particle) {
        const moveParticle = () => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;

            anime({
                targets: particle,
                left: x + 'px',
                top: y + 'px',
                duration: 3000 + Math.random() * 2000,
                easing: 'easeInOutQuad',
                complete: moveParticle
            });
        };

        moveParticle();
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.observeElements();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });

        // Observe other elements
        document.querySelectorAll('.hover-lift').forEach(element => {
            observer.observe(element);
        });
    }

    animateElement(element) {
        anime({
            targets: element,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutQuad',
            delay: Math.random() * 200
        });
    }
}

// Navigation active state
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.setupScrollSpy();
    }

    setupScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.setActiveNav(id);
                }
            });
        }, {
            threshold: 0.5
        });

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    setActiveNav(activeId) {
        this.navLinks.forEach(link => {
            link.classList.remove('text-blue-600');
            link.classList.add('text-gray-700');

            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.remove('text-gray-700');
                link.classList.add('text-blue-600');
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main demo
    new AutoTyperDemo();

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize navigation
    new NavigationManager();

    // Add smooth reveal animation to elements
    anime({
        targets: '.feature-card',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        delay: anime.stagger(200),
        easing: 'easeOutQuad'
    });

    // Add hover effects to buttons
    document.querySelectorAll('button, .hover-lift').forEach(element => {
        element.addEventListener('mouseenter', () => {
            anime({
                targets: element,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });

        element.addEventListener('mouseleave', () => {
            anime({
                targets: element,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
});

// Add CSS animation for floating particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
        25% { transform: translateY(-20px) rotate(90deg); opacity: 0.8; }
        50% { transform: translateY(-10px) rotate(180deg); opacity: 0.4; }
        75% { transform: translateY(-30px) rotate(270deg); opacity: 0.7; }
    }
`;
document.head.appendChild(style);

// Donation functionality
function donate(type) {
    const amounts = {
        coffee: 5000,
        lunch: 10000,
        sponsor: 100000
    };

    const amount = amounts[type];
    const formattedAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

    // Open Saweria in a new tab
    window.open('https://saweria.co/mrlabs', '_blank');

    // Show thank you modal
    showModal(`Terima kasih atas dukungannya sebesar ${formattedAmount}! Support Anda membantu kami menjaga Mr. Auto Typer tetap gratis untuk semua orang.`);
}

function customDonation() {
    window.open('https://saweria.co/mrlabs', '_blank');
    showModal('Terima kasih! Silakan tentukan jumlah donasi Anda di halaman Saweria.');
}

function showModal(message) {
    let modal = document.getElementById('donation-modal');
    if (!modal) return;

    const modalMessage = document.getElementById('modal-message');
    if (modalMessage) modalMessage.textContent = message;

    modal.classList.add('active');

    // Animate modal content if anime is available
    if (window.anime) {
        anime({
            targets: '#donation-modal .modal-content',
            scale: [0.9, 1],
            opacity: [0, 1],
            duration: 400,
            easing: 'easeOutElastic(1, .8)'
        });
    }
}

function closeModal() {
    const modal = document.getElementById('donation-modal');
    if (!modal) return;

    if (window.anime) {
        anime({
            targets: '#donation-modal .modal-content',
            scale: [1, 0.9],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                modal.classList.remove('active');
            }
        });
    } else {
        modal.classList.remove('active');
    }
}