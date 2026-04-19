/* 
   Portfolio Scripts â€” Bojooow
   Features: Loader, Navbar, Particles, Scroll Reveal, Staggered Grids,
             Stats Counter, Custom Cursor, Keyboard Nav, Glitch
*/

document.addEventListener('DOMContentLoaded', () => {

    // â”€â”€ 0. LOADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const loader = document.getElementById('loader');
    if (loader) {
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 2100);
    }


    // â”€â”€ 1. NAVBAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const navbar   = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinksList = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Scroll: transparent â†’ frosted glass
    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 60);
    });

    // Mobile hamburger
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinksList?.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('open');
            navLinksList?.classList.remove('open');
        });
    });

    // Active link highlighting via scroll position
    const sectionTargets = document.querySelectorAll('section[id], header[id]');

    function updateActiveLink() {
        const scrollY = window.scrollY + 80 + 10; // navbar height + buffer
        let currentId = '';

        sectionTargets.forEach(section => {
            if (section.offsetTop <= scrollY) {
                currentId = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();


    // â”€â”€ 2. PARTICLE CANVAS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const canvas = document.getElementById('matrix');
    const ctx    = canvas.getContext('2d');

    const resize = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 90;
    const CONNECTION_DIST = 120;

    class Particle {
        constructor() { this.init(); }
        init() {
            this.x  = Math.random() * canvas.width;
            this.y  = Math.random() * canvas.height;
            this.sz = Math.random() * 1.4 + 0.4;
            this.vx = (Math.random() - 0.5) * 0.65;
            this.vy = (Math.random() - 0.5) * 0.65;
            this.color   = Math.random() > 0.72 ? '#bc13fe' : '#00f3ff';
            this.opacity = Math.random() * 0.45 + 0.25;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x > canvas.width  || this.x < 0) this.vx = -this.vx;
            if (this.y > canvas.height || this.y < 0) this.vy = -this.vy;
        }
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle   = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${(1 - dist / CONNECTION_DIST) * 0.28})`;
                    ctx.lineWidth   = 0.4;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // â”€â”€ 3. SCROLL REVEAL (sections) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.07 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    // â”€â”€ 4. STAGGERED GRID REVEALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                gridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.04 });

    document.querySelectorAll('.skills-grid, .project-grid').forEach(el => gridObserver.observe(el));


    // â”€â”€ 5. STATS COUNTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.stat-number[data-target]').forEach(el => {
                const target   = parseInt(el.getAttribute('data-target'), 10);
                const duration = 1800;
                const step     = target / (duration / 16);
                let current    = 0;
                const tick = () => {
                    current += step;
                    if (current < target) {
                        el.textContent = Math.floor(current);
                        requestAnimationFrame(tick);
                    } else {
                        el.textContent = target;
                    }
                };
                tick();
            });
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) counterObserver.observe(statsSection);


    // â”€â”€ 6. CUSTOM CURSOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const cursorDot  = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
        let targetX = 0, targetY = 0;
        let ringX   = 0, ringY   = 0;

        window.addEventListener('mousemove', e => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        const animateCursor = () => {
            ringX += (targetX - ringX) * 0.11;
            ringY += (targetY - ringY) * 0.11;
            cursorDot.style.left  = `${targetX}px`;
            cursorDot.style.top   = `${targetY}px`;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top  = `${ringY}px`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        document.querySelectorAll('a, button, .project-card, .skill-card, .stat-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
        });
    }


    // â”€â”€ 7. KEYBOARD NAVIGATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const keyMap = { h: 'home', s: 'skills', e: 'experience', p: 'projects', c: 'contact' };
    document.addEventListener('keydown', e => {
        // Ignore when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        const id = keyMap[e.key.toLowerCase()];
        if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });


    // â”€â”€ 8. GLITCH EFFECT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const glitchTargets = document.querySelectorAll('h1, h3');
    setInterval(() => {
        const t = glitchTargets[Math.floor(Math.random() * glitchTargets.length)];
        t.classList.add('glitch-active');
        setTimeout(() => t.classList.remove('glitch-active'), 180);
    }, 4500);

});
