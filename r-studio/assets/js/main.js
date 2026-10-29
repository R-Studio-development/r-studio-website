document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 2. Typing Effect (Only on Homepage)
    const typedSpan = document.getElementById('typed-text');
    if (typedSpan) {
        const texts = ['سایت اختصاصی برای برند شما', 'طراحی مدرن و سریع', 'تجربه‌ای که ماندگار می‌شود'];
        let index = 0, charIndex = 0, isDeleting = false;

        function typeEffect() {
            const current = texts[index];
            if (!isDeleting) {
                typedSpan.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === current.length) {
                    isDeleting = true;
                    setTimeout(typeEffect, 2000);
                    return;
                }
                setTimeout(typeEffect, 80);
            } else {
                typedSpan.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    index = (index + 1) % texts.length;
                    setTimeout(typeEffect, 400);
                    return;
                }
                setTimeout(typeEffect, 50);
            }
        }
        typeEffect();
    }

    // 3. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.style.padding = '10px 0';
            navbar.style.background = 'rgba(11, 23, 48, 0.95)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.background = 'rgba(11, 23, 48, 0.8)';
        }
    });

    // 4. Contact Form (Web3Forms)
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'در حال ارسال...';
            btn.disabled = true;

            const formData = new FormData(form);
            // وب فرم سرویس Web3Forms (نیاز به کلید دارد که در فایل HTML قرار میگیرد)
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    btn.textContent = '✓ پیام شما ارسال شد';
                    btn.style.background = '#28a745';
                    form.reset();
                } else {
                    console.log(response);
                    btn.textContent = 'خطا در ارسال';
                    btn.style.background = '#dc3545';
                }
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            })
            .catch(error => {
                console.log(error);
                btn.textContent = 'خطا در ارسال';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 3000);
            });
        });
    }
        // --- Particles Animation ---
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        function resizeCanvas() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > w) this.speedX *= -1;
                if (this.y < 0 || this.y > h) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 169, 107, ${this.opacity})`; // رنگ طلایی برند
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            // خطوط اتصال
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(200, 169, 107, ${0.08 * (1 - dist/120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

        // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.card, .portfolio-item, .section-title');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
});