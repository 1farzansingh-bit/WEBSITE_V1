document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // CUSTOM CURSOR ANIMATION
    // ==========================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    // Check if device supports hover (ignore touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with CSS transition instead of heavy JS animation
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
        });

        // Add hover effect to interactive elements
        const interactables = document.querySelectorAll('a, button, .btn, .project-card');
        
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ==========================================
    // MOBILE NAVIGATION MENU
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // IMAGE TRAIL EFFECT (CANOPI-AI STYLE)
    // ==========================================
    const heroSection = document.getElementById('home');
    const collageBg = document.getElementById('collage-bg');
    
    if (collageBg) {
        collageBg.style.display = 'none'; // Hide the static grid
    }

    const trailImages = Array.from(document.querySelectorAll('.collage-item img')).map(img => img.src);
    
    if (heroSection && trailImages.length > 0) {
        // Create an absolute container to isolate from flexbox layout
        const trailContainer = document.createElement('div');
        trailContainer.className = 'trail-container';
        heroSection.appendChild(trailContainer);

        // Pre-create all elements (Object Pooling) - Zero DOM allocations during mousemove!
        const poolSize = trailImages.length * 3; // Triple pool size so animations are NEVER interrupted
        const pool = [];
        
        for (let i = 0; i < poolSize; i++) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'trail-img-container';
            const img = document.createElement('img');
            img.src = trailImages[i % trailImages.length];
            imgContainer.appendChild(img);
            trailContainer.appendChild(imgContainer);
            
            pool.push({
                el: imgContainer,
                timeout: null
            });
        }

        let poolIndex = 0;
        let lastMousePos = { x: 0, y: 0 };
        let ticking = false;

        heroSection.addEventListener('mousemove', (e) => {
            // Wait for the typewriter effect to complete before showing trail
            const typewriter = document.getElementById('typewriter-text');
            if (typewriter && !typewriter.classList.contains('typing-done')) {
                lastMousePos = { x: e.clientX, y: e.clientY };
                return;
            }

            if (!ticking) {
                // Throttle with requestAnimationFrame for buttery smooth performance
                requestAnimationFrame(() => {
                    const distance = Math.hypot(e.clientX - lastMousePos.x, e.clientY - lastMousePos.y);
                    
                    // Spawn threshold
                    if (distance > 160) {
                        lastMousePos = { x: e.clientX, y: e.clientY };
                        
                        const rect = heroSection.getBoundingClientRect();
                        // Center offsets (380/2 and 260/2 from CSS width/height)
                        const cx = (e.clientX - rect.left) - 190;
                        const cy = (e.clientY - rect.top) - 130;
                        
                        const item = pool[poolIndex];
                        const el = item.el;
                        
                        // Clear any previous fade-out timeout
                        clearTimeout(item.timeout);
                        
                        const rotation = Math.random() * 20 - 10;
                        
                        // Reset element instantly (no transition)
                        el.style.transition = 'none';
                        el.style.opacity = '0';
                        el.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(0.5) rotate(${rotation}deg)`;
                        
                        // Use double requestAnimationFrame to COMPLETELY eliminate synchronous reflows
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                // Apply the 'pop in' animation - SLOWED DOWN and ultra smooth
                                el.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease';
                                el.style.opacity = '1';
                                el.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(1) rotate(${rotation}deg)`;
                            });
                        });
                        
                        // Schedule the smooth 'fall and fade' out
                        item.timeout = setTimeout(() => {
                            el.style.transition = 'transform 0.8s ease-in, opacity 0.8s ease-in';
                            el.style.opacity = '0';
                            // Fall down slightly by adding 60px to Y
                            el.style.transform = `translate3d(${cx}px, ${cy + 60}px, 0) scale(0.8) rotate(${rotation}deg)`;
                        }, 1800);
                        
                        poolIndex = (poolIndex + 1) % poolSize;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ==========================================
    // TYPEWRITER EFFECT
    // ==========================================
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const fullHtml = typewriterElement.innerHTML;
        const lines = fullHtml.split(/<br\s*\/?>/i);
        typewriterElement.innerHTML = '';
        typewriterElement.classList.add('typing-active');

        // Helper to tokenize HTML string into text characters and HTML tags
        function tokenizeHtml(html) {
            const tokens = [];
            let i = 0;
            while (i < html.length) {
                if (html[i] === '<') {
                    let tag = '';
                    while (i < html.length && html[i] !== '>') {
                        tag += html[i];
                        i++;
                    }
                    if (i < html.length) {
                        tag += html[i]; // include '>'
                        i++;
                    }
                    tokens.push({ type: 'tag', val: tag });
                } else {
                    tokens.push({ type: 'char', val: html[i] });
                    i++;
                }
            }
            return tokens;
        }

        let lineIndex = 0;
        let tokenIndex = 0;
        let currentHtml = '';

        function typeLine() {
            if (lineIndex < lines.length) {
                const tokens = tokenizeHtml(lines[lineIndex]);
                if (tokenIndex < tokens.length) {
                    const token = tokens[tokenIndex];
                    currentHtml += token.val;
                    typewriterElement.innerHTML = currentHtml;
                    tokenIndex++;
                    
                    if (token.type === 'tag') {
                        // Inject tag instantly without delay
                        typeLine();
                    } else {
                        // Random typing speed between 30ms and 70ms per character
                        setTimeout(typeLine, Math.random() * 40 + 30);
                    }
                } else {
                    if (lineIndex < lines.length - 1) {
                        currentHtml += '<br>';
                        typewriterElement.innerHTML = currentHtml;
                    }
                    lineIndex++;
                    tokenIndex = 0;
                    // Pause longer at the end of each line
                    setTimeout(typeLine, 300);
                }
            } else {
                typewriterElement.classList.remove('typing-active');
                typewriterElement.classList.add('typing-done');
            }
        }
        
        // Start typing shortly after page load
        setTimeout(typeLine, 400);
    }

    // ==========================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
