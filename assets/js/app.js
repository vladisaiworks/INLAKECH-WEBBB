/**
 * ILAKECH LANDING PAGE - Main Entry Point
 */

// We will wait for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    initSmoothScroll();

    // 2. Initialize Master Plan Reading Mode
    initMasterPlanReadingMode();

    // 3. Initialize Animations (placeholder for now)
    console.log("Ilakech Digital Sanctuary Initialized");
});

// Global Lenis instance for modal control
let lenisInstance = null;

function initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
        lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // Sync Lenis with GSAP ScrollTrigger
        lenisInstance.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        console.log("Lenis Smooth Scroll Active");
    } else {
        console.warn("Lenis not loaded.");
    }
}

/**
 * MASTER PLAN READING MODE
 * Trigger: Hover over the right text panel
 * Effect: Image scales down + overlay appears, text shifts left
 */
/**
 * MASTER PLAN READING MODE - REMOVED AS REQUESTED
 * Trigger: Hover over the right text panel
 * Effect: Image scales down + overlay appears, text shifts left
 */
function initMasterPlanReadingMode() {
    // Functionality removed to keep the section simple.
    // Map stays static, text stays in place.
}

// 3. Accordion Logic for Master Plan (Exclusive, Always One Open)
function toggleAccordion(header) {
    const item = header.parentElement;

    // If text is already active, do nothing (maintain 1 open)
    if (item.classList.contains('active')) return;

    // Get all items
    const allItems = document.querySelectorAll('.accordion-item');

    // Close others
    allItems.forEach(i => {
        if (i !== item) {
            i.classList.remove('active');
            i.querySelector('.accordion-body').style.maxHeight = '0';
            const arr = i.querySelector('.accordion-header .acc-arrow');
            if (arr) arr.style.transform = 'rotate(-90deg)';

            // Update ARIA
            const head = i.querySelector('.accordion-header');
            if (head) head.setAttribute('aria-expanded', 'false');
        }
    });

    // Open clicked
    item.classList.add('active');
    const body = item.querySelector('.accordion-body');
    body.style.maxHeight = body.scrollHeight + 'px';
    const arrow = header.querySelector('.acc-arrow');
    if (arrow) arrow.style.transform = 'rotate(0deg)';

    // Update ARIA
    header.setAttribute('aria-expanded', 'true');
}

// Initialize active accordion on load
function initAccordion() {
    const activeItem = document.querySelector('.accordion-item.active');
    if (activeItem) {
        const body = activeItem.querySelector('.accordion-body');
        const arrow = activeItem.querySelector('.accordion-header .acc-arrow');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
        const head = activeItem.querySelector('.accordion-header');
        if (head) head.setAttribute('aria-expanded', 'true');
    }
}

// Global scope
window.toggleAccordion = toggleAccordion;

// Init when DOM Ready
// Init when DOM Ready
document.addEventListener('DOMContentLoaded', initAccordion);

/* --- GLOBAL MODAL MANAGER (NO LAYOUT SHIFT) --- */
const ModalManager = (function () {
    let isLocked = false;
    let scrollbarWidth = 0;

    function lock() {
        if (isLocked) return;
        isLocked = true;

        // 1. Calculate scrollbar width BEFORE hiding it
        scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // 2. Stop Lenis
        if (lenisInstance) lenisInstance.stop();

        // 3. Add padding to compensate for scrollbar removal (prevents horizontal shift)
        document.body.style.paddingRight = scrollbarWidth + 'px';

        // 4. Lock body scroll
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    function unlock() {
        if (!isLocked) return;
        isLocked = false;

        // 1. Restore body scroll
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // 2. Remove padding compensation
        document.body.style.paddingRight = '';

        // 3. Restart Lenis
        if (lenisInstance) lenisInstance.start();
    }

    return { lock, unlock, isLocked: () => isLocked };
})();
window.ModalManager = ModalManager;

/* --- LIGHTBOX MODAL LOGIC (Enhanced) --- */
/* --- LIGHTBOX MODAL LOGIC (Enhanced for Multiple Galleries) --- */
const carouselGallery = [
    { src: 'assets/images/carrusel imagenes al abrir/Celestún.jpeg', title: 'Celestún' },
    { src: 'assets/images/carrusel imagenes al abrir/Cenote Yokdzonot.jpeg', title: 'Cenote Yokdzonot' },
    { src: 'assets/images/carrusel imagenes al abrir/Chichén Itzá.jpeg', title: 'Chichén Itzá' },
    { src: 'assets/images/carrusel imagenes al abrir/Dzibichaltún.jpeg', title: 'Dzibichaltún' },
    { src: 'assets/images/carrusel imagenes al abrir/Ek Balam.jpeg', title: 'Ek Balam' },
    { src: 'assets/images/carrusel imagenes al abrir/El Cuyo.jpeg', title: 'El Cuyo' },
    { src: 'assets/images/carrusel imagenes al abrir/Holbox.jpeg', title: 'Holbox' },
    { src: 'assets/images/carrusel imagenes al abrir/Izamal.jpeg', title: 'Izamal' },
    { src: 'assets/images/carrusel imagenes al abrir/Mérida.jpeg', title: 'Mérida' },
    { src: 'assets/images/carrusel imagenes al abrir/Playa del Carmen.jpeg', title: 'Playa del Carmen' },
    { src: 'assets/images/carrusel imagenes al abrir/Río Lagartos.jpeg', title: 'Río Lagartos' },
    { src: 'assets/images/carrusel imagenes al abrir/Tulum.jpeg', title: 'Tulum' },
    { src: 'assets/images/carrusel imagenes al abrir/Uxmal.jpeg', title: 'Uxmal' },
    { src: 'assets/images/carrusel imagenes al abrir/Valladolid.jpeg', title: 'Valladolid' }
];

const masterPlanGallery = [
    { src: 'assets/images/EXPLORAR MASTER PLAN/ECO ALDEA TURÍSTICA INLAKECH.jpeg', title: "Ecoaldea Turística In Lak'ech" },
    { src: 'assets/images/EXPLORAR MASTER PLAN/MELIPONARIO.jpeg', title: 'Meliponario' },
    { src: 'assets/images/EXPLORAR MASTER PLAN/MUSEO DE LA MIEL.jpeg', title: 'Museo de la Miel' },
    { src: 'assets/images/EXPLORAR MASTER PLAN/MUSEO DEL CACAO.jpeg', title: 'Museo del Cacao' },
    { src: 'assets/images/EXPLORAR MASTER PLAN/PABELLÓN COMUNITARIO.jpeg', title: 'Pabellón Comunitario' },
    { src: 'assets/images/EXPLORAR MASTER PLAN/ÁREA PRIVADA.jpeg', title: 'Área Privada' }
];

let currentIndex = 0;
let currentGallery = carouselGallery; // Default

// Generic Open Modal Function
function openLightbox(gallery, startIndex = 0) {
    currentGallery = gallery;
    currentIndex = startIndex;

    const modal = document.getElementById('carousel-modal');
    const modalImg = document.getElementById('img01');
    const captionText = document.getElementById('caption');

    if (modal && modalImg && captionText) {
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add('show'), 10);
        updateModalContent();
        ModalManager.lock();
    }
}

// Wrapper for Carousel (keeps existing API compatible if needed)
function openModal(imageSrc, titleText) {
    // FIX: If user was dragging the carousel, don't open modal
    if (typeof window.carouselHasDragged !== 'undefined' && window.carouselHasDragged === true) {
        return;
    }

    // Find index in carousel gallery
    const index = carouselGallery.findIndex(item => item.title === titleText);
    openLightbox(carouselGallery, index !== -1 ? index : 0);
}

// Wrapper for Master Plan
function openMasterPlanLightbox() {
    // Starts with first image: Ecoaldea Turística In Lak'ech
    openLightbox(masterPlanGallery, 0);
}

function updateModalContent() {
    const modalImg = document.getElementById('img01');
    const captionText = document.getElementById('caption');
    const item = currentGallery[currentIndex];

    // 1. Fade out current image immediately
    modalImg.style.opacity = 0;

    // 2. Wait for fade out transition (200ms matches JS logic, adjust CSS if needed)
    setTimeout(() => {
        // 3. Change source only when hidden
        modalImg.src = item.src;
        captionText.innerHTML = item.title;

        // 4. IMPORTANT: Wait for load before showing
        modalImg.onload = () => {
            // Only show if it's still the requested image
            // (Using checks to avoid filename encoding mismatches)
            modalImg.style.opacity = 1;
        };

        // Fallback if cached or instant load
        if (modalImg.complete) {
            modalImg.style.opacity = 1;
        }
    }, 200);
}


function changeSlide(n, event) {
    if (event) event.stopPropagation();
    currentIndex += n;
    if (currentIndex >= currentGallery.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = currentGallery.length - 1;
    updateModalContent();
}

function closeModal() {
    const modal = document.getElementById('carousel-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
        ModalManager.unlock();
    }
}

/* --- VIDEO MODAL --- */
function openVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Force reflow/render if needed, but display flex usually works instantly
        ModalManager.lock();
    }
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.style.display = 'none';
        ModalManager.unlock();
    }
}

window.openModal = openModal;
window.openMasterPlanLightbox = openMasterPlanLightbox;
window.closeModal = closeModal;
window.changeSlide = changeSlide;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

/* --- GLOBAL KEYBOARD HANDLERS --- */
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        closeModal();          // Gallery
        closeDossierModal();   // Dossier
        // Close Ritual Menu if open
        const ritual = document.getElementById('ritual-menu-overlay');
        if (ritual && ritual.classList.contains('active')) {
            toggleRitualMenu();
        }
    }
    if (event.key === "ArrowLeft") changeSlide(-1);
    if (event.key === "ArrowRight") changeSlide(1);
});

/* =========================================
   NAVIGATION & DOSSIER LOGIC (Step 94)
   ========================================= */

/* --- RITUAL MENU TOGGLE --- */
function toggleRitualMenu() {
    const overlay = document.getElementById('ritual-menu-overlay');
    if (!overlay) return;
    const isActive = overlay.classList.contains('active');

    if (isActive) {
        overlay.classList.remove('active');
        ModalManager.unlock();
    } else {
        overlay.classList.add('active');
        ModalManager.lock();
    }
}

/* --- DOSSIER MODAL LOGIC --- */
function openDossierModal() {
    const overlay = document.getElementById('dossier-modal-overlay');
    if (overlay) {
        // FORCE with inline styles to bypass CSS
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        overlay.classList.add('active');
        document.body.classList.add('modal-open'); // Trigger CSS Blur
        ModalManager.lock();
        console.log('Modal opened - check browser console');

        // Reset form if previously submitted
        const form = document.getElementById('dossier-form');
        const success = document.getElementById('dossier-success');
        const header = document.querySelector('.dossier-header-content');

        if (form && success) {
            form.style.display = 'block'; // FORCE VISIBILITY
            success.style.display = 'none';
            if (header) header.style.display = 'block'; // Ensure header is visible
        }
    }
}


function closeDossierModal() {
    const overlay = document.getElementById('dossier-modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        // Reset ALL inline styles
        overlay.style.display = '';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';

        document.body.classList.remove('modal-open');
        ModalManager.unlock();
    }
}

function handleDossierSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('dossier-form');
    const success = document.getElementById('dossier-success');

    // Simulate submission delay for realism
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Enviando...";
    btn.disabled = true;

    setTimeout(() => {
        // Hide form AND HEADER, show success
        form.style.display = 'none';
        const header = document.querySelector('.dossier-header-content');
        if (header) header.style.display = 'none'; // Hide header for clean success state

        success.style.display = 'block';

        // Reset button for next time (though form is hidden)
        btn.innerHTML = originalText;
        btn.disabled = false;
        form.reset();
    }, 1200);
}

// Global exposure
window.toggleRitualMenu = toggleRitualMenu;
window.openDossierModal = openDossierModal;
window.closeDossierModal = closeDossierModal;
window.handleDossierSubmit = handleDossierSubmit;

// Top Bar Scroll Effect
window.addEventListener('scroll', () => {
    // 1. Desktop / Legacy Logic (Keep for safety)
    const topBar = document.getElementById('top-bar');
    if (topBar) {
        if (window.scrollY > 50) {
            topBar.classList.add('scrolled');
        } else {
            topBar.classList.remove('scrolled');
        }
    }

    // 2. Mobile Floating Bar Logic (New Wrapper)
    const headerWrap = document.getElementById('header-wrap');
    if (headerWrap) {
        if (window.scrollY > 32) {
            headerWrap.classList.add('is-scrolled');
        } else {
            headerWrap.classList.remove('is-scrolled');
        }
    }
});

/* --- GOVERNANCE PILLAR INTERACTION --- */
function toggleGovernance(element) {
    element.classList.toggle('active');
}
window.toggleGovernance = toggleGovernance;

/* --- MANIFESTO MODAL LOGIC --- */
const ManifestoModal = (function () {
    let modal = null;

    function init() {
        modal = document.getElementById('manifesto-modal');
        if (!modal) return;

        // Event delegation can be used or direct binding
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');

        if (closeBtn) closeBtn.addEventListener('click', close);
        if (backdrop) backdrop.addEventListener('click', close);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen()) close();
        });
    }

    function isOpen() {
        return modal && modal.classList.contains('is-open');
    }

    function open() {
        if (!modal) init();
        if (!modal) return;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        ModalManager.lock();
    }

    function close() {
        if (!modal) return;

        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        ModalManager.unlock();
    }

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { open, close };
})();
window.ManifestoModal = ManifestoModal;

/* --- MASTER PLAN HOTSPOTS (Rebuilt) --- */
/* --- MASTER PLAN HOTSPOTS (Rebuilt) --- */

/* --- MOBILE CAROUSEL LOGIC (Infinite Loop + Swipe) --- */
function initMobileCarousel() {
    const track = document.querySelector('.mobile-carousel-track');
    const container = document.querySelector('.mobile-carousel-track-container');

    if (!track || !container) return;

    // Prevent double init
    if (track.dataset.initialized === 'true') return;
    track.dataset.initialized = 'true';

    const originalSlides = Array.from(track.children);
    if (originalSlides.length === 0) return;

    // Clone first and last for seamless infinite loop
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    firstClone.dataset.clone = 'first';
    lastClone.dataset.clone = 'last';
    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);

    // All slides including clones
    const allSlides = Array.from(track.querySelectorAll('.mobile-carousel-slide'));
    const totalSlides = allSlides.length;
    let current = 1; // Start at 1 (index 0 = lastClone)
    let autoPlayTimer = null;

    // Use CONTAINER width as the single source of truth for slide width
    function getSlideWidth() {
        return container.offsetWidth;
    }

    // Set position instantly (no animation)
    function setPosition(index) {
        current = index;
        track.style.transition = 'none';
        track.style.transform = 'translateX(' + (-getSlideWidth() * current) + 'px)';
        // Force reflow to apply instantly
        track.offsetHeight;
    }

    // Animate to a specific index
    function animateTo(index) {
        current = index;
        track.style.transition = 'transform 0.45s ease-out';
        track.style.transform = 'translateX(' + (-getSlideWidth() * current) + 'px)';
    }

    // After transition ends, check if we landed on a clone and silently jump
    function onTransitionEnd() {
        const slide = allSlides[current];
        if (!slide) return;

        if (slide.dataset.clone === 'first') {
            setPosition(1); // Jump to real first
        } else if (slide.dataset.clone === 'last') {
            setPosition(totalSlides - 2); // Jump to real last
        }
    }

    track.addEventListener('transitionend', onTransitionEnd);

    // --- TOUCH HANDLING ---
    let touchStartX = 0;
    let touchStartY = 0; // Added for Y tracking
    let touchActive = false;
    let dragOffset = 0;
    let directionLocked = null; // 'x' or 'y'

    container.addEventListener('touchstart', function (e) {
        stopAutoPlay();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY; // Capture Y
        touchActive = true;
        dragOffset = 0;
        directionLocked = null; // Reset lock

        // Kill any running transition immediately
        const computedStyle = window.getComputedStyle(track);
        const matrix = new DOMMatrix(computedStyle.transform);
        track.style.transition = 'none';
        track.style.transform = 'translateX(' + matrix.m41 + 'px)';
        // Recalculate current based on actual position
        const sw = getSlideWidth();
        if (sw > 0) {
            current = Math.round(-matrix.m41 / sw);
        }
    }, { passive: true });

    container.addEventListener('touchmove', function (e) {
        if (!touchActive) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - touchStartX;
        const diffY = currentY - touchStartY;

        // Axis Locking Logic
        if (directionLocked === 'y') return; // Ignore if vertical scroll detected

        if (!directionLocked) {
            if (Math.abs(diffY) > Math.abs(diffX)) {
                directionLocked = 'y'; // Lock to vertical
                return;
            } else if (Math.abs(diffX) > 5) {
                directionLocked = 'x'; // Lock to horizontal
            } else {
                return; // Wait for clear intent
            }
        }

        // Only proceed if locked to X
        dragOffset = currentX - touchStartX;
        const base = -getSlideWidth() * current;
        track.style.transform = 'translateX(' + (base + dragOffset) + 'px)';
    }, { passive: true });

    container.addEventListener('touchend', function (e) {
        if (!touchActive) return;
        touchActive = false;
        const movedBy = e.changedTouches[0].clientX - touchStartX;
        const sw = getSlideWidth();
        const threshold = sw * 0.15; // 15% of slide width

        if (movedBy < -threshold && current < totalSlides - 1) {
            animateTo(current + 1);
        } else if (movedBy > threshold && current > 0) {
            animateTo(current - 1);
        } else {
            animateTo(current); // Snap back
        }

        startAutoPlay();
    });

    // --- AUTOPLAY ---
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(function () {
            animateTo(current + 1);
        }, 3000);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    // --- RESIZE ---
    window.addEventListener('resize', function () {
        setPosition(current);
    });

    // --- INIT: Wait for layout to be ready ---
    function bootstrap() {
        setPosition(1);
        startAutoPlay();
    }

    // Use requestAnimationFrame to ensure layout is calculated
    requestAnimationFrame(function () {
        requestAnimationFrame(bootstrap);
    });
}

/* --- DESKTOP DRAG RESISTANCE LOGIC --- */
function initDesktopDragLogic() {
    // We need to differentiate between a "click" and a "drag" on the carousel cards.
    // The cards have inline onclick="openModal(...)".
    // We will capture mousedown and mouseup on the wrapper to set a flag.

    const desktopWrapper = document.querySelector('.integrated-carousel-wrapper');
    if (!desktopWrapper) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    // Capture on capture phase to ensure we get it before bubbled click?
    // Actually, click handlers are usually fired after mouseup.

    desktopWrapper.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startY = e.clientY;
        isDragging = false;
        window.carouselHasDragged = false; // Reset global
    }, { passive: true });

    desktopWrapper.addEventListener('mousemove', (e) => {
        if (e.buttons === 0) return; // Only if mouse is down
        const diffX = Math.abs(e.clientX - startX);
        const diffY = Math.abs(e.clientY - startY);
        if (diffX > 5 || diffY > 5) {
            isDragging = true;
            window.carouselHasDragged = true;
        }
    }, { passive: true });

    desktopWrapper.addEventListener('mouseup', (e) => {
        // If we dragged, keep the flag true for a moment so the click handler can see it
        if (isDragging) {
            window.carouselHasDragged = true;
            // Clear it after a short delay to allow the immediate click to be blocked
            setTimeout(() => {
                window.carouselHasDragged = false;
            }, 100);
        } else {
            window.carouselHasDragged = false;
        }
        isDragging = false;
    }, { passive: true });

    // Also handle click capture to stop potential listeners if needed, 
    // but we can't easily stop inline onclick without the handler itself checking.
    // So we rely on openModal checking window.carouselHasDragged.
}

// Init call
document.addEventListener('DOMContentLoaded', () => {
    initMobileCarousel();
    initDesktopDragLogic();
});



