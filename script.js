/* ============================================
   Izhar Gilad — Personal Professional Website
   JavaScript: Navigation, Animations, Dark Mode
   ============================================ */

(function () {
    'use strict';

    // --- DOM Elements ---
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // --- Navigation: Scroll effect ---
    let lastScroll = 0;

    function handleScroll() {
        const scrollY = window.scrollY;

        // Add scrolled class for border/shadow
        if (scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = scrollY;

        // Update active nav link
        updateActiveLink();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Navigation: Active link based on scroll position ---
    function updateActiveLink() {
        const sections = document.querySelectorAll('.section, .hero');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // --- Navigation: Mobile toggle ---
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // --- Dark Mode ---
    function getPreferredTheme() {
        var stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Initialize theme
    setTheme(getPreferredTheme());

    themeToggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // --- Scroll Animations (Intersection Observer) ---
    function initScrollAnimations() {
        var animatedElements = document.querySelectorAll('[data-aos], .timeline-item, .expertise-card, .insight-card');

        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements
            animatedElements.forEach(function (el) {
                el.classList.add('visible');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    initScrollAnimations();

    // --- Counter Animation ---
    function animateCounters() {
        var counters = document.querySelectorAll('.metric-value[data-target]');

        if (!('IntersectionObserver' in window)) {
            counters.forEach(function (counter) {
                counter.textContent = counter.getAttribute('data-target');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var counter = entry.target;
                    var target = parseInt(counter.getAttribute('data-target'), 10);
                    var duration = 1500;
                    var startTime = null;

                    function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        var progress = Math.min((timestamp - startTime) / duration, 1);
                        // Ease out cubic
                        var eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.floor(eased * target);
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            counter.textContent = target;
                        }
                    }

                    requestAnimationFrame(step);
                    observer.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(function (counter) {
            observer.observe(counter);
        });
    }

    animateCounters();

    // --- Contact Form ---
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = document.getElementById('name').value.trim();
        var email = document.getElementById('email').value.trim();
        var message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            formStatus.textContent = 'Please fill in all required fields.';
            formStatus.className = 'form-status error';
            return;
        }

        // Build mailto link as fallback
        var subject = document.getElementById('subject').value || 'Website Contact';
        var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
        var mailtoLink = 'mailto:izhargilad@gmail.com?subject=' +
            encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);

        // Open mail client
        window.location.href = mailtoLink;

        formStatus.textContent = 'Opening your email client...';
        formStatus.className = 'form-status success';

        // Reset form after a moment
        setTimeout(function () {
            contactForm.reset();
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }, 3000);
    });

    // --- Smooth scroll for CTA buttons ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})();
