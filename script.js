/* 
   Cyberpunk Functions
    Includes: Matrix Rain, Scroll Reveal, Terminal Inputs, Glitch
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Data Constellation (Neural Network) ---
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    // Make the canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray = [];
    const numberOfParticles = 100; // Adjust for density

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = '#00f3ff'; // Neon Cyan dots
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        // Clear canvas but keep it transparent
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            // Connect particles
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance/150})`; // Cyan lines fading
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Resize canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Optionally reset particles or let them drift
    });

    // --- 3. Scroll Reveal Animations ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));


    // --- 4. Interactive "Terminal" Input ---
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        
        switch(key) {
            case 'h':
                document.getElementById('home').scrollIntoView({behavior: 'smooth'});
                break;
            case 'p':
                document.getElementById('projects').scrollIntoView({behavior: 'smooth'});
                break;
            case 'e':
                document.getElementById('experience').scrollIntoView({behavior: 'smooth'});
                break;
            case 'c':
                document.getElementById('contact').scrollIntoView({behavior: 'smooth'});
                break;
        }
    });


    // --- 5. Glitch Effect Trigger ---
    // Apply random glitch class to headers occasionally
    const glitchTargets = document.querySelectorAll('h1, h2, h3');
    
    setInterval(() => {
        const randomTarget = glitchTargets[Math.floor(Math.random() * glitchTargets.length)];
        randomTarget.classList.add('glitch-active');
        
        setTimeout(() => {
            randomTarget.classList.remove('glitch-active');
        }, 200);
        
    }, 3000); // Glitch every 3 seconds randomly

});
