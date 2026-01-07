// ============================================
// Navigation & Smooth Scroll
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('navigation');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    allNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Smooth scroll for navigation links
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Navbar background on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // ============================================
    // Target Cursor Effect
    // ============================================
    
    // Wait for GSAP to load
    function initTargetCursor() {
        if (typeof gsap === 'undefined') {
            setTimeout(initTargetCursor, 50);
            return;
        }
        const cursorRef = document.querySelector('.target-cursor-wrapper');
        const dotRef = document.querySelector('.target-cursor-dot');
        const cornersRef = cursorRef ? cursorRef.querySelectorAll('.target-cursor-corner') : null;
        
        // Check if mobile
        const isMobile = () => {
            const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth <= 768;
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
            const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
            return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
        };
        
        if (!isMobile() && cursorRef && dotRef && cornersRef && cornersRef.length === 4) {
            const targetSelector = '.cursor-target';
            const spinDuration = 2;
            const hideDefaultCursor = true;
            const hoverDuration = 0.2;
            const parallaxOn = true;
            const constants = { borderWidth: 3, cornerSize: 12 };
            
            const originalCursor = document.body.style.cursor;
            if (hideDefaultCursor) {
                document.body.style.cursor = 'none';
            }
            
            let spinTl = null;
            let activeTarget = null;
            let currentLeaveHandler = null;
            let resumeTimeout = null;
            const isActiveRef = { current: false };
            const targetCornerPositionsRef = { current: null };
            const activeStrengthRef = { current: 0 };
            
            const moveCursor = (x, y) => {
                if (!cursorRef) return;
                gsap.to(cursorRef, { x, y, duration: 0.1, ease: 'power3.out' });
            };
            
            gsap.set(cursorRef, {
                xPercent: -50,
                yPercent: -50,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            });
            
            const createSpinTimeline = () => {
                if (spinTl) {
                    spinTl.kill();
                }
                spinTl = gsap
                    .timeline({ repeat: -1 })
                    .to(cursorRef, { rotation: '+=360', duration: spinDuration, ease: 'none' });
            };
            
            createSpinTimeline();
            
            const tickerFn = () => {
                if (!targetCornerPositionsRef.current || !cursorRef || !cornersRef || !activeTarget) {
                    return;
                }
                const strength = activeStrengthRef.current;
                if (strength === 0) return;
                
                // Get current box position to keep cursor centered on box
                const rect = activeTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // Update cursor position to stay centered on box
                gsap.set(cursorRef, { x: centerX, y: centerY });
                
                const corners = Array.from(cornersRef);
                corners.forEach((corner, i) => {
                    const currentX = gsap.getProperty(corner, 'x');
                    const currentY = gsap.getProperty(corner, 'y');
                    const targetX = targetCornerPositionsRef.current[i].x;
                    const targetY = targetCornerPositionsRef.current[i].y;
                    const finalX = currentX + (targetX - currentX) * strength;
                    const finalY = currentY + (targetY - currentY) * strength;
                    const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
                    gsap.to(corner, {
                        x: finalX,
                        y: finalY,
                        duration: duration,
                        ease: duration === 0 ? 'none' : 'power1.out',
                        overwrite: 'auto'
                    });
                });
            };
            
            const moveHandler = (e) => moveCursor(e.clientX, e.clientY);
            window.addEventListener('mousemove', moveHandler);
            
            const scrollHandler = () => {
                if (!activeTarget || !cursorRef) return;
                const mouseX = gsap.getProperty(cursorRef, 'x');
                const mouseY = gsap.getProperty(cursorRef, 'y');
                const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
                const isStillOverTarget =
                    elementUnderMouse &&
                    (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
                if (!isStillOverTarget) {
                    currentLeaveHandler?.();
                }
            };
            window.addEventListener('scroll', scrollHandler, { passive: true });
            
            const mouseDownHandler = () => {
                if (!dotRef) return;
                gsap.to(dotRef, { scale: 0.7, duration: 0.3 });
                gsap.to(cursorRef, { scale: 0.9, duration: 0.2 });
            };
            
            const mouseUpHandler = () => {
                if (!dotRef) return;
                gsap.to(dotRef, { scale: 1, duration: 0.3 });
                gsap.to(cursorRef, { scale: 1, duration: 0.2 });
            };
            
            window.addEventListener('mousedown', mouseDownHandler);
            window.addEventListener('mouseup', mouseUpHandler);
            
            const cleanupTarget = (target) => {
                if (currentLeaveHandler) {
                    target.removeEventListener('mouseleave', currentLeaveHandler);
                }
                currentLeaveHandler = null;
            };
            
            const enterHandler = (e) => {
                const directTarget = e.target;
                const allTargets = [];
                let current = directTarget;
                while (current && current !== document.body) {
                    if (current.matches && current.matches(targetSelector)) {
                        allTargets.push(current);
                    }
                    current = current.parentElement;
                }
                const target = allTargets[0] || null;
                if (!target || !cursorRef || !cornersRef) return;
                if (activeTarget === target) return;
                if (activeTarget) {
                    cleanupTarget(activeTarget);
                }
                if (resumeTimeout) {
                    clearTimeout(resumeTimeout);
                    resumeTimeout = null;
                }
                
                activeTarget = target;
                const corners = Array.from(cornersRef);
                corners.forEach(corner => gsap.killTweensOf(corner));
                gsap.killTweensOf(cursorRef, 'rotation');
                if (spinTl) spinTl.pause();
                gsap.set(cursorRef, { rotation: 0 });
                
                const rect = target.getBoundingClientRect();
                const { borderWidth, cornerSize } = constants;
                
                // Move cursor to center of the target element
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                gsap.to(cursorRef, { 
                    x: centerX, 
                    y: centerY, 
                    duration: 0.3, 
                    ease: 'power2.out' 
                });
                
                // Calculate corner positions relative to the center of the box
                const halfWidth = rect.width / 2;
                const halfHeight = rect.height / 2;
                
                targetCornerPositionsRef.current = [
                    { x: -halfWidth - borderWidth, y: -halfHeight - borderWidth },
                    { x: halfWidth + borderWidth - cornerSize, y: -halfHeight - borderWidth },
                    { x: halfWidth + borderWidth - cornerSize, y: halfHeight + borderWidth - cornerSize },
                    { x: -halfWidth - borderWidth, y: halfHeight + borderWidth - cornerSize }
                ];
                
                isActiveRef.current = true;
                gsap.ticker.add(tickerFn);
                
                gsap.to(activeStrengthRef, { current: 1, duration: hoverDuration, ease: 'power2.out' });
                
                // Position corners relative to cursor center (which is now at box center)
                corners.forEach((corner, i) => {
                    gsap.to(corner, {
                        x: targetCornerPositionsRef.current[i].x,
                        y: targetCornerPositionsRef.current[i].y,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
                });
                
                const leaveHandler = () => {
                    gsap.ticker.remove(tickerFn);
                    isActiveRef.current = false;
                    targetCornerPositionsRef.current = null;
                    gsap.set(activeStrengthRef, { current: 0, overwrite: true });
                    activeTarget = null;
                    if (cornersRef) {
                        const corners = Array.from(cornersRef);
                        gsap.killTweensOf(corners);
                        const { cornerSize } = constants;
                        const positions = [
                            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
                            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
                            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
                            { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
                        ];
                        const tl = gsap.timeline();
                        corners.forEach((corner, index) => {
                            tl.to(corner, { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: 'power3.out' }, 0);
                        });
                    }
                    resumeTimeout = setTimeout(() => {
                        if (!activeTarget && cursorRef && spinTl) {
                            const currentRotation = gsap.getProperty(cursorRef, 'rotation');
                            const normalizedRotation = currentRotation % 360;
                            spinTl.kill();
                            spinTl = gsap
                                .timeline({ repeat: -1 })
                                .to(cursorRef, { rotation: '+=360', duration: spinDuration, ease: 'none' });
                            gsap.to(cursorRef, {
                                rotation: normalizedRotation + 360,
                                duration: spinDuration * (1 - normalizedRotation / 360),
                                ease: 'none',
                                onComplete: () => {
                                    if (spinTl) spinTl.restart();
                                }
                            });
                        }
                        resumeTimeout = null;
                    }, 50);
                    cleanupTarget(target);
                };
                currentLeaveHandler = leaveHandler;
                target.addEventListener('mouseleave', leaveHandler);
            };
            
            window.addEventListener('mouseover', enterHandler);
        }
    }
    
    // Initialize cursor after DOM is ready
    initTargetCursor();
    
    // ============================================
    // Typing Effect for Hero Title
    // ============================================
    
    const typingText = document.getElementById('typingText');
    if (typingText) {
        const firstName = "Eeshan";
        const lastName = " Bhatia";
        const fullText = firstName + lastName;
        const delay = 100;
        let currentIndex = 0;
        
        function typeCharacter() {
            if (currentIndex < fullText.length) {
                if (currentIndex < firstName.length) {
                    // Type the first name with highlight
                    const highlightIndex = currentIndex + 1;
                    typingText.innerHTML = '<span class="highlight">' + firstName.substring(0, highlightIndex) + '</span>';
                } else {
                    // Type the last name normally
                    const lastNameIndex = currentIndex - firstName.length;
                    typingText.innerHTML = '<span class="highlight">' + firstName + '</span>' + lastName.substring(0, lastNameIndex + 1);
                }
                currentIndex++;
                setTimeout(typeCharacter, delay);
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeCharacter, 500);
    }
    
    // ============================================
    // Scroll Animations with Intersection Observer
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(`
        .project-card,
        .tech-category,
        .hobby-card,
        .contact-info
    `);
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = `opacity 0.8s ease-out ${index * 0.1}s, transform 0.8s ease-out ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // ============================================
    // Project Card Interactions
    // ============================================
    
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `translateY(-10px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
    
    // ============================================
    // Parallax Effect for Hero Section
    // ============================================
    
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            if (scrolled < window.innerHeight) {
                heroVisual.style.transform = `translateY(${parallax}px)`;
            }
        });
    }
    
    // ============================================
    // Active Navigation Link Highlighting
    // ============================================
    
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // ============================================
    // Tech Item Stagger Animation
    // ============================================
    
    const techItems = document.querySelectorAll('.tech-item');
    
    const techObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 50);
                techObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    techItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        techObserver.observe(item);
    });
    
    // ============================================
    // Performance Optimization: Throttle Scroll Events
    // ============================================
    
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply throttling to scroll-heavy functions if needed
    window.addEventListener('scroll', throttle(highlightNavigation, 100));
});

