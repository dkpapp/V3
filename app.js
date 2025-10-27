// Particle Background Animation
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
        this.color = this.randomColor();
        this.opacity = Math.random() * 0.5 + 0.5;
    }
    
    randomColor() {
        const colors = ['#00f3ff', '#ff00ff', '#9d00ff', '#39ff14'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

let particles = [];

function initParticles() {
    particles = [];
    // Increased particle count for denser network
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000);
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                // Calculate opacity based on distance (closer = brighter)
                const opacity = (1 - distance / 150) * 0.8;
                
                // Create gradient line between particles
                const gradient = ctx.createLinearGradient(
                    particles[i].x, particles[i].y,
                    particles[j].x, particles[j].y
                );
                
                // Use particle colors for gradient
                gradient.addColorStop(0, particles[i].color.replace(')', `, ${opacity})`).replace('rgb', 'rgba'));
                gradient.addColorStop(1, particles[j].color.replace(')', `, ${opacity})`).replace('rgb', 'rgba'));
                
                // Draw glowing thread line
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1;
                ctx.shadowBlur = 5;
                ctx.shadowColor = particles[i].color;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

// Fade in particles on load
let particlesVisible = false;
window.addEventListener('load', () => {
    particlesVisible = true;
    initParticles();
    animateParticles();
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Scroll Progress Bar
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// Typing Effect
const typingText = document.getElementById('typingText');
const phrases = [
    'Full Stack Developer',
    'Data Scientist',
    'AI/ML Enthusiast',
    'Problem Solver',
    'Tech Innovator'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeText, typingSpeed);
}

// Start typing effect after a delay
setTimeout(() => {
    typeText();
}, 1200);

// Legendary particle interaction on mouse move
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Add mouse interaction to particles
function interactParticles() {
    particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            // Particles move away from cursor
            const angle = Math.atan2(dy, dx);
            particle.x -= Math.cos(angle) * 2;
            particle.y -= Math.sin(angle) * 2;
        }
    });
}

// Call interaction in animation loop - update animateParticles
let originalAnimateParticles = animateParticles;
animateParticles = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    interactParticles();
    requestAnimationFrame(animateParticles);
};

// Smooth Scroll for Navigation Links
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

// Enhanced Intersection Observer with Staggered Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Staggered animation for skill categories
            if (entry.target.classList.contains('skill-category')) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.setProperty('--progress-width', progress + '%');
                    setTimeout(() => {
                        bar.classList.add('animated');
                    }, 100 + (index * 150)); // Stagger by 150ms
                });
            }
            
            // Staggered animation for project cards
            if (entry.target.classList.contains('projects-grid')) {
                const projectCards = entry.target.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s ease forwards`;
                    }, index * 100);
                });
            }
            
            // Animate tech tags with stagger
            if (entry.target.classList.contains('tech-tags')) {
                const tags = entry.target.querySelectorAll('.tech-tag');
                tags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.animation = `fadeIn 0.4s ease forwards`;
                    }, index * 50);
                });
            }
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Observe skill categories, projects grid, and tech tags
document.querySelectorAll('.skill-category').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.projects-grid').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.tech-tags').forEach(el => {
    observer.observe(el);
});

// Add cursor trail effect (performance optimized)
let cursorTrail = [];
const maxTrailLength = 5;

document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.8) { // Only create trail 20% of the time for performance
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);
        
        cursorTrail.push(trail);
        
        if (cursorTrail.length > maxTrailLength) {
            const oldTrail = cursorTrail.shift();
            oldTrail.remove();
        }
        
        setTimeout(() => {
            trail.remove();
            cursorTrail = cursorTrail.filter(t => t !== trail);
        }, 500);
    }
});

// Add cursor trail styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor-trail {
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: radial-gradient(circle, #00f3ff, transparent);
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: trail-fade 0.5s ease-out forwards;
        z-index: 9999;
        box-shadow: 0 0 10px #00f3ff;
    }
    
    @keyframes trail-fade {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
        }
    }
`;
document.head.appendChild(cursorStyle);

// Enhanced parallax effect for hero section
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - scrolled / 800;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Enhanced Card Effects with 3D Tilt and Cursor-following Glow
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 5;
        const rotateY = ((centerX - x) / centerX) * 5;
        
        // Apply 3D tilt effect
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        
        // Move glow to follow cursor
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.left = `${x - glow.offsetWidth / 2}px`;
            glow.style.top = `${y - glow.offsetHeight / 2}px`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
});

// Add active state to nav links based on scroll position with smooth transitions
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section, .hero-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Ripple effect on buttons
document.querySelectorAll('.btn-neon').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'ripple-animation 0.6s ease-out';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation style dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize all animations on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Page load animation sequence
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Trigger hero animations in sequence
    setTimeout(() => {
        document.querySelector('.hero-greeting')?.classList.add('animate');
    }, 100);
    
    setTimeout(() => {
        document.querySelector('.hero-name')?.classList.add('animate');
    }, 300);
    
    setTimeout(() => {
        document.querySelector('.hero-title')?.classList.add('animate');
    }, 500);
    
    setTimeout(() => {
        document.querySelector('.hero-tagline')?.classList.add('animate');
    }, 700);
    
    setTimeout(() => {
        document.querySelector('.hero-buttons')?.classList.add('animate');
    }, 900);
});

console.log('%c🚀 Portfolio Loaded Successfully! ', 'background: #00f3ff; color: #0a0a0a; font-size: 20px; padding: 10px; font-weight: bold;');
console.log('%c💻 Designed & Built by Dhruv Prajapat ', 'background: #ff00ff; color: #fff; font-size: 14px; padding: 5px;');
console.log('%c✨ Featuring Legendary UI/UX Animations ', 'background: #39ff14; color: #0a0a0a; font-size: 14px; padding: 5px;');