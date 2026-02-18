/**
 * ANIMATIONS CONTROLLER
 * Handles GSAP ScrollTrigger animations and SVG/Canvas rendering.
 *
 * STABILIZATION PATCH (2026-02-12):
 * - Added HEADER_HEIGHT constant for ScrollTrigger offset awareness
 * - Added matchMedia guard for timeline SVG (only draws on ≥1024px)
 * - Adjusted trigger starts for header breathing room
 */

gsap.registerPlugin(ScrollTrigger);

/* --- LAYOUT CONSTANTS --- */
const HEADER_HEIGHT = 80; // #top-bar fixed height (~2rem padding × 2 + content)
const MOBILE_BREAKPOINT = 767; // Mobile Design Contract boundary

document.addEventListener("DOMContentLoaded", () => {

    // --- INTRO ANIMATION (Global: Mobile + Desktop) ---
    initIntroAnimation();

    /**
     * MOBILE vs DESKTOP ANIMATION SPLIT
     * Mobile (≤767px): Simple block-level reveals (appear when scrolled into view)
     * Desktop (≥768px): Full complex GSAP timelines
     */
    ScrollTrigger.matchMedia({

        /* ===== MOBILE: Simple block reveals ===== */
        "(max-width: 767px)": function () {
            initMobileTimeline();   // Timeline first (marks milestones as handled)
            initMobileSimpleReveals();
        },

        /* ===== DESKTOP: Full animation suite ===== */
        "(min-width: 768px)": function () {
            initGeneralReveals();
            initParallax();
            initManifestoSequence();
            initLocationSequence();
            initCarouselReveal();
            initAtmosphere(); // Deprecated
            initAmbientLight();
            initMasterPlanSequence();
            initProgressSequence();
            initParticipationSequence();
            initTeamSequence();
            initDossierSequence();
        }
    });
});

/* --- 0. PRELOADER / INTRO ANIMATION --- */
function initIntroAnimation() {
    // 1. Initial States (Prevent FOUC manually)
    gsap.set("#hero .hero-bg-img", { scale: 1.1, opacity: 0 });
    gsap.set("#hero h3", { y: 20, opacity: 0 });
    gsap.set("#hero h1", { y: 30, opacity: 0 });
    gsap.set("#hero p", { y: 20, opacity: 0 });
    gsap.set("#hero .cta-wrapper", { y: 20, opacity: 0 }); // Button wrapper
    gsap.set("#top-bar", { y: -20, opacity: 0 });

    // 2. Cinematic Timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Step 1: Background emerges smoothly (Faster breath)
    tl.to("#hero .hero-bg-img", {
        scale: 1,
        opacity: 0.6, // DARKER: Restored classic darkness (was 0.8)
        duration: 2.2,
        ease: "power2.out",
        force3D: true // FLICKER FIX: Prevents black flashes during opacity changes
    });

    // Step 2: Header slides down softly (Concurrent with bg)
    tl.to("#top-bar", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        force3D: true // FLICKER FIX: Render on GPU
    }, "-=2.0");

    // Step 3: Text Stagger (RAPID & DYNAMIC LADDER)
    // Starts while zoom is still active
    tl.to("#hero h3", {
        y: 0,
        opacity: 1,
        duration: 0.7
    }, "-=0.9") // Starts early (at ~0.5s absolute)

        .to("#hero h1", {
            y: 0,
            opacity: 1,
            duration: 0.9
        }, "-=0.5") // Quick follow-up (0.2s lag)

        .to("#hero p", {
            y: 0,
            opacity: 1,
            duration: 0.8
        }, "-=0.7") // Quick follow-up (0.2s lag)

        .to("#hero .cta-wrapper", {
            y: 0,
            opacity: 1,
            duration: 0.8
        }, "-=0.6"); // Quick follow-up (0.2s lag)
}

/* --- 0. MOBILE: SIMPLE BLOCK REVEALS --- */
/*
 * Every element gets its own ScrollTrigger based on its own position.
 * Scroll slowly → elements appear one by one as each enters viewport.
 * Scroll fast → everything in view appears instantly.
 * Scroll back up → elements reverse out. Scroll down again → replay.
 */
function initMobileSimpleReveals() {

    // === CONTAINERS: Elements whose children must NOT be animated separately ===
    // When a container appears, everything inside appears with it as ONE unit.
    var CONTAINERS = '.pillar-box, .card-scene, .team-member, .accordion-item, .carousel-title-block, .mobile-carousel-wrapper, .cta-wrapper';

    // Simple fade-in for ONE element, triggered by ITSELF
    // Uses ONLY opacity (no transform/translateY) because mobile CSS
    // has many `transform: none !important` rules that would override GSAP
    function fadeIn(el) {
        if (!el || el.dataset.mr) return;
        el.dataset.mr = '1';
        gsap.fromTo(el,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%", // Start even earlier
                    toggleActions: "play none none none" // STABILITY FIX: Never hide again once shown
                }
            }
        );
    }

    // Special: manifesto background (opacity only, no translateY)
    var mbg = document.querySelector('.manifesto-bg');
    if (mbg) {
        mbg.dataset.mr = '1';
        gsap.fromTo(mbg,
            { opacity: 0 },
            {
                opacity: 0.6, duration: 0.6, ease: "power2.out",
                scrollTrigger: {
                    trigger: mbg,
                    start: "top 95%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // ALL elements to consider for animation
    var targets = document.querySelectorAll([
        // Containers (will be animated as whole units)
        CONTAINERS,
        // Headings
        'main h1', 'main h2', 'main h3', 'main h4',
        // Text
        'main p',
        '.manifesto-stagger',
        // Location
        '.parchment-img', '.custom-map-pin',
        // Master plan — NOTE: .master-bg-wrapper and .plan-content have
        // display:contents on mobile, so target their CHILDREN directly
        '.master-image-stack',
        '.plan-content > span',
        '.plan-content > h2',
        '.plan-content > p',
        // Progress
        '.progress-title',
        // Generic
        '.btn-primary',
        '#dossier .container > *',
        'main img:not(.manifesto-bg img)'
    ].join(', '));

    // Process each element
    targets.forEach(function (el) {
        // Skip hero (above the fold)
        var section = el.closest('section');
        if (section && section.id === 'hero') return;

        // Already processed
        if (el.dataset.mr) return;

        // CASE 1: Container → animate it, mark all children as handled
        if (el.matches(CONTAINERS)) {
            fadeIn(el);
            el.querySelectorAll('*').forEach(function (child) {
                child.dataset.mr = '1';
            });
            return;
        }

        // CASE 2: Inside a container → skip (container handles it)
        if (el.closest(CONTAINERS)) return;

        // CASE 3: Standalone element → animate individually
        fadeIn(el);
    });
}

/* --- 0b. MOBILE: Timeline vertical gold line + milestone reveals --- */
/*
 * Line grows segment-by-segment between icon centers.
 * Triggered by onEnter (no scrub). Reverses on scroll-back.
 * Line stays behind icons (z-index: 1 < icon z-index: 2).
 */
function initMobileTimeline() {
    var container = document.querySelector('.timeline-container');
    if (!container) return;

    var milestones = [];
    container.querySelectorAll('.timeline-milestone').forEach(function (ms) {
        milestones.push(ms);
    });
    if (milestones.length < 2) return;

    // Mark all milestones + children as handled (prevent double animation)
    milestones.forEach(function (ms) {
        ms.dataset.mr = '1';
        ms.querySelectorAll('*').forEach(function (child) {
            child.dataset.mr = '1';
        });
    });

    // Helper: offset top of element relative to an ancestor
    function offsetTopTo(el, ancestor) {
        var top = 0;
        while (el && el !== ancestor) {
            top += el.offsetTop;
            el = el.offsetParent;
        }
        return top;
    }
    function offsetLeftTo(el, ancestor) {
        var left = 0;
        while (el && el !== ancestor) {
            left += el.offsetLeft;
            el = el.offsetParent;
        }
        return left;
    }

    // Defer position calculations to ensure layout is stable
    requestAnimationFrame(function () {
        // Gather icon box center positions relative to container
        var iconData = milestones.map(function (ms) {
            var box = ms.querySelector('.timeline-icon-box');
            if (!box) return { centerX: 0, centerY: 0 };
            var top = offsetTopTo(box, container);
            var left = offsetLeftTo(box, container);
            return {
                centerX: left + box.offsetWidth / 2,
                centerY: top + box.offsetHeight / 2
            };
        });

        var startY = iconData[0].centerY;
        // Shift slightly right (+0.5px) for 1px line centering
        var lineX = iconData[0].centerX + 0.5;

        // PREVENTION: Remove existing line if any (avoid duplicates on resize/reload)
        var existingLine = container.querySelector('.mobile-timeline-line');
        if (existingLine) existingLine.remove();

        // Create the gold line element - SOLID COLOR, NO GRADIENT
        var line = document.createElement('div');
        line.className = 'mobile-timeline-line';
        line.style.cssText = [
            'position:absolute',
            'left:' + lineX + 'px',
            'top:' + startY + 'px',
            'width:1px', /* Thinner line */
            'height:0px',
            /* Matching icon border opacity */
            'background:rgba(197, 169, 107, 0.5)',
            'z-index:0', /* Lowest z-index within container */
            'pointer-events:none'
        ].join(';');
        container.prepend(line);

        // Pre-calculate cumulative heights for each segment endpoint
        var heights = iconData.map(function (d) {
            return d.centerY - startY;
        });

        // For each milestone 2, 3, 4: grow line on enter, shrink on leave-back
        for (var i = 1; i < milestones.length; i++) {
            (function (idx) {
                ScrollTrigger.create({
                    trigger: milestones[idx],
                    start: 'top 80%', // Synchronized: Icon appears = Line starts
                    onEnter: function () {
                        gsap.to(line, {
                            height: heights[idx],
                            duration: 1.2, // Draws slower
                            ease: 'power2.out'
                        });
                    },
                    onLeaveBack: function () {
                        var prevH = idx > 1 ? heights[idx - 1] : 0;
                        gsap.to(line, {
                            height: prevH,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    }
                });
            })(i);
        }
    });

    // Milestone reveal animations: fade + slight rise
    milestones.forEach(function (ms) {
        gsap.fromTo(ms,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: ms,
                    start: 'top 85%', // Even earlier start
                    toggleActions: 'play none none none' // STABILITY FIX: Never hide again
                }
            }
        );
    });
}

/* --- 1. GENERAL REVEALS (Desktop only) --- */
function initGeneralReveals() {
    // Select elements but EXCLUDE #hero children to prevent intro conflict
    const revealElements = document.querySelectorAll("h1:not(#hero h1), .cta-wrapper:not(#hero .cta-wrapper), li, .grid-cols-2 > div");
    revealElements.forEach((el) => {
        gsap.fromTo(el,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: "power2.out",
                scrollTrigger: {
                    trigger: el, start: "top 85%", toggleActions: "play none none reverse"
                }
            }
        );
    });
}

/* --- 2. PARALLAX EFFECTS --- */
function initParallax() {
    gsap.to(".background-layer img", {
        yPercent: 30, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });
}

/* --- 2.5 MANIFESTO SEQUENCE --- */
function initManifestoSequence() {
    gsap.to(".manifesto-bg", {
        opacity: 1, duration: 2, ease: "power2.out",
        scrollTrigger: { trigger: "#manifesto", start: "top 60%", end: "center center", scrub: 1 }
    });

    const items = gsap.utils.toArray(".manifesto-stagger");
    items.forEach((item) => {
        gsap.fromTo(item,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%", // Starts earlier (was 85%)
                    end: "top 60%",   // Ends before center (faster reveal)
                    toggleActions: "play none none reverse",
                    scrub: 1          // Smoother, but constrained window
                }
            }
        );
    });
}

/* --- 3. LOCATION SEQUENCE --- */
function initLocationSequence() {
    // FIX: Start less tilted (was 70, now 40) for a smoother transition
    gsap.set(".parchment-img", { rotationX: 40, scale: 0.9, y: 100, opacity: 0, transformPerspective: 2500, transformOrigin: "center center" });
    gsap.set(["#location h3", "#location h2"], { opacity: 0, y: 30 });
    // FIX: Removed 'y: 20' to avoid GSAP overwriting CSS transforms on pillars
    gsap.set([".pillar-box"], { opacity: 0 });
    gsap.set(".custom-map-pin", { opacity: 0, y: 50, scale: 0, transformOrigin: "bottom center" });

    // SCROLL-LINKED ANIMATION (Scrub), BUT NO PINNING
    // DELAYED START: Wait until section is more visible before starting animation
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#location",
            start: "top 70%",     // Delayed start (was 90%)
            end: "center center", // Finishes when section is centered (was center 60%)
            scrub: 1,
            toggleActions: "play none none reverse"
        }
    });

    // 1. Title Reveal (Early)
    tl.to(["#location h3", "#location h2"], { opacity: 1, y: 0, duration: 0.2, stagger: 0.05 }, 0);

    // 2. Parchment Unroll (Tilt -> Front) LINKED TO SCROLL
    tl.to(".parchment-img", {
        rotationX: 0,
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "none"
    }, 0);

    // 3. Map Pin Pop (Slightly later in the scroll)
    tl.to(".custom-map-pin", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "back.out(1.7)"
    }, 0.5);

    // 4. Pillars Sequence
    // FIX: Only animating OPACITY. No 'y' or transform props.
    // This allows CSS transforms (including :hover scale) to remain in control.
    tl.to(".pillar-1", { opacity: 1, duration: 0.15 }, 0.6);
    tl.to(".pillar-2", { opacity: 1, duration: 0.15 }, 0.8);
    tl.to(".pillar-3", { opacity: 1, duration: 0.15 }, 1.0);
}

/* --- 4. MASTER PLAN REVEALS --- */
function initMasterPlanSequence() {
    // Parallax effect REMOVED as requested for simplicity
    /* 
    gsap.fromTo(".master-bg-img", 
        { scale: 1.1 }, 
        { scale: 1, ease: "none", scrollTrigger: { trigger: "#master-plan", start: "top bottom", end: "bottom top", scrub: true } }
    );
    */

    // Initial Reveal - SIMPLE FADE IN ONLY
    // Decoupled animations to fix rendering bug with backdrop-filter

    // 1. Image Wrapper
    gsap.fromTo(".master-bg-wrapper",
        { opacity: 0 },
        {
            opacity: 1,
            duration: 0.5, // Faster (was 1.0)
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#master-plan",
                start: "top 75%", // Starts earlier (was 65%)
                toggleActions: "play reverse play reverse"
            }
        }
    );

    // 2. Hotspots (Animated directly to preserve rendering quality)
    gsap.fromTo(".mp-hotspot",
        { opacity: 0 },
        {
            opacity: 1,
            duration: 0.5, // Faster (was 1.0)
            delay: 0.2, // Slight staggered entry after map
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#master-plan",
                start: "top 75%", // Starts earlier (was 65%)
                toggleActions: "play reverse play reverse"
            }
        }
    );

    // Text Content Animation
    const tl = gsap.timeline({ scrollTrigger: { trigger: "#master-plan", start: "top 60%", toggleActions: "play reverse play reverse" } });
    tl.fromTo(".plan-content > span", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 0);
    tl.fromTo(".plan-content > h2", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 0.2);
    tl.fromTo(".plan-content > p", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 0.4);
    tl.fromTo(".accordion-item", { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" }, 0.6);
}

/* --- 5. PROGRESS SECTION: TIMELINE --- */
function initProgressSequence() {
    const svg = document.getElementById('timelineSvg');
    const path = document.getElementById('timelinePath');
    const mask = document.getElementById('textProtectionMask');
    const progressTitle = document.querySelector('.progress-title');
    const milestones = document.querySelectorAll('.timeline-milestone');
    const container = document.querySelector('.timeline-container');
    const section = document.getElementById('progress');
    const anchors = document.querySelectorAll('.line-anchor');
    const textBlocks = document.querySelectorAll('.timeline-text');

    // Fallback Canvas
    const canvas = document.getElementById('timelineCanvas');
    const useSVG = svg && path;
    const useCanvas = canvas && !useSVG;

    if (!container || !section) return;

    // --- Helpers ---
    function resizeRenderTarget() {
        const rect = container.getBoundingClientRect();
        if (useSVG) {
            svg.setAttribute('width', rect.width);
            svg.setAttribute('height', rect.height);
            svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
            if (mask) updateMask();
        } else if (useCanvas) {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            canvas.getContext('2d').scale(dpr, dpr);
        }
    }

    function getAnchorPositions() {
        const containerRect = container.getBoundingClientRect();
        const positions = [];
        anchors.forEach((anchor) => {
            const rect = anchor.getBoundingClientRect();
            positions.push({
                x: rect.left + rect.width / 2 - containerRect.left,
                y: rect.top + rect.height / 2 - containerRect.top
            });
        });
        if (positions.length === 0) {
            const w = container.offsetWidth;
            const h = container.offsetHeight;
            return [
                { x: w * 0.15, y: h * 0.05 },
                { x: w * 0.85, y: h * 0.22 },
                { x: w * 0.15, y: h * 0.44 },
                { x: w * 0.50, y: h * 0.90 }
            ];
        }
        return positions;
    }

    function getExclusionZones() {
        if (!textBlocks.length) return [];
        const containerRect = container.getBoundingClientRect();
        const zones = [];
        const PADDING = 24;
        textBlocks.forEach((block) => {
            const rect = block.getBoundingClientRect();
            zones.push({
                x: rect.left - containerRect.left - PADDING,
                y: rect.top - containerRect.top - PADDING,
                width: rect.width + PADDING * 2,
                height: rect.height + PADDING * 2
            });
        });
        return zones;
    }

    function updateMask() {
        if (!mask) return;
        mask.querySelectorAll('rect.exclusion').forEach(r => r.remove());
        const zones = getExclusionZones();
        zones.forEach((zone) => {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('class', 'exclusion');
            rect.setAttribute('x', zone.x);
            rect.setAttribute('y', zone.y);
            rect.setAttribute('width', zone.width);
            rect.setAttribute('height', zone.height);
            rect.setAttribute('fill', 'black');
            mask.appendChild(rect);
        });
    }

    function generatePath(progress) {
        if (progress <= 0) return '';
        const pts = getAnchorPositions();
        if (pts.length < 4) return '';
        const w = container.offsetWidth;
        const h = container.offsetHeight;

        // Curves
        const s1_start = pts[0];
        const s1_cp1 = { x: pts[0].x, y: pts[0].y + h * 0.10 };
        const s1_cp2 = { x: pts[1].x, y: pts[1].y - h * 0.10 };
        const s1_end = pts[1];

        const s2_start = pts[1];
        const s2_cp1 = { x: pts[1].x, y: pts[1].y + h * 0.12 };
        const s2_cp2 = { x: pts[2].x + w * 0.30, y: pts[2].y - h * 0.05 };
        const s2_end = pts[2];

        const s3_start = pts[2];
        const s3_cp1 = { x: pts[2].x + w * 0.20, y: pts[2].y + h * 0.10 };
        const s3_cp2 = { x: pts[3].x, y: pts[3].y - h * 0.15 };
        const s3_end = pts[3];

        let d = '';
        const getPartial = (p0, p1, p2, p3, t) => {
            const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
            const q0 = lerp(p0, p1, t), q1 = lerp(p1, p2, t), q2 = lerp(p2, p3, t);
            const r0 = lerp(q0, q1, t), r1 = lerp(q1, q2, t);
            const s = lerp(r0, r1, t);
            return { cp1: q0, cp2: r0, end: s };
        };

        if (progress > 0) {
            const t1 = Math.min(1, progress / 0.33);
            const p1 = getPartial(s1_start, s1_cp1, s1_cp2, s1_end, t1);
            d = `M ${s1_start.x} ${s1_start.y} C ${p1.cp1.x} ${p1.cp1.y}, ${p1.cp2.x} ${p1.cp2.y}, ${p1.end.x} ${p1.end.y}`;
        }
        if (progress > 0.33) {
            const t2 = Math.min(1, (progress - 0.33) / 0.33);
            const p2 = getPartial(s2_start, s2_cp1, s2_cp2, s2_end, t2);
            d += ` C ${p2.cp1.x} ${p2.cp1.y}, ${p2.cp2.x} ${p2.cp2.y}, ${p2.end.x} ${p2.end.y}`;
        }
        if (progress > 0.66) {
            const t3 = Math.min(1, (progress - 0.66) / 0.34);
            const p3 = getPartial(s3_start, s3_cp1, s3_cp2, s3_end, t3);
            d += ` C ${p3.cp1.x} ${p3.cp1.y}, ${p3.cp2.x} ${p3.cp2.y}, ${p3.end.x} ${p3.end.y}`;
        }
        return d;
    }

    function drawLine(progress) {
        if (useSVG) {
            // FIX: Ensure we call the correct function name 'generatePath'
            const d = generatePath(progress);
            path.setAttribute('d', d);
        } else if (useCanvas) {
            // Basic Canvas fallback if SVG missing
            const ctx = canvas.getContext('2d');
            const w = container.offsetWidth;
            const h = container.offsetHeight;
            ctx.clearRect(0, 0, w, h);
            // ... (Simple line logic omitted for brevity, focusing on SVG repair)
        }
    }

    // --- Execution ---
    gsap.set(milestones, { opacity: 0, y: 20, scale: 0.95 });
    gsap.set(progressTitle, { opacity: 0, y: 40 });

    // Title reveal — shared across all breakpoints
    ScrollTrigger.create({
        trigger: section, start: "top 85%", end: "top 65%", scrub: true,
        onUpdate: (self) => gsap.to(progressTitle, { opacity: self.progress, y: 40 * (1 - self.progress), overwrite: "auto" })
    });

    // First milestone reveal — shared across all breakpoints
    ScrollTrigger.create({
        trigger: section, start: "top 60%", end: "top 50%", scrub: true,
        onUpdate: (self) => gsap.to(milestones[0], { opacity: self.progress, y: 20 * (1 - self.progress), overwrite: "auto" })
    });

    // --- BREAKPOINT-SEPARATED LOGIC ---
    ScrollTrigger.matchMedia({

        // DESKTOP + LAPTOP (≥1024px): Full SVG line drawing + milestone sequencing
        "(min-width: 1024px)": function () {
            resizeRenderTarget();
            window.addEventListener('resize', () => { resizeRenderTarget(); ScrollTrigger.refresh(); });

            ScrollTrigger.create({
                trigger: section, start: "top 50%", end: "bottom 85%", scrub: 1,
                onUpdate: (self) => {
                    const p = self.progress;
                    drawLine(p);
                    if (mask) updateMask();

                    // Milestones 2 & 3 - Adjusted timings to appear earlier as requested
                    const milestonesStart = [0.20, 0.45];

                    [1, 2].forEach((idx, i) => {
                        const startP = milestonesStart[i];
                        if (p >= startP) {
                            const localP = Math.min(1, (p - startP) / 0.15);
                            gsap.to(milestones[idx], { opacity: localP, y: 20 * (1 - localP), overwrite: "auto" });
                        } else {
                            gsap.to(milestones[idx], { opacity: 0, y: 20, overwrite: "auto" });
                        }
                    });

                    // Milestone 4: Start later (0.90) to ensure line arrives first
                    if (p >= 0.90) {
                        const localP = Math.min(1, (p - 0.90) / 0.08);
                        gsap.to(milestones[3], { opacity: localP, y: 20 * (1 - localP), overwrite: "auto" });

                        const iconBox = milestones[3].querySelector('.timeline-icon-box');
                        if (localP > 0.99) {
                            iconBox.classList.add('glow-active');
                        } else {
                            iconBox.classList.remove('glow-active');
                        }
                    } else {
                        gsap.to(milestones[3], { opacity: 0, y: 20, overwrite: "auto" });
                        const iconBox = milestones[3].querySelector('.timeline-icon-box');
                        if (iconBox) iconBox.classList.remove('glow-active');
                    }
                }
            });
        },

        // TABLET + MOBILE (<1024px): Simple staggered fade-in (no SVG drawing)
        "(max-width: 1023px)": function () {
            // CSS hides #timelineCanvas and .timeline-path-svg at this breakpoint.
            // Just fade milestones in with a simple stagger as user scrolls.
            gsap.fromTo([milestones[1], milestones[2], milestones[3]],
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 50%",
                        toggleActions: "play none none none" // STABILIZED: Once shown, stay shown
                    }
                }
            );
        }
    });
}

/* --- 6. PARTICIPATION SEQUENCE (Three Doors) --- */
function initParticipationSequence() {
    const section = document.querySelector('#participation');
    const title = section.querySelector('h2');
    const subtitle = section.querySelector('.text-mist');
    const cards = section.querySelectorAll('.card-scene');

    const tlText = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 50%", toggleActions: "play reverse play reverse" } });
    tlText.fromTo(title, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" });
    tlText.fromTo(subtitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "-=0.6");

    gsap.fromTo(cards, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, stagger: 0.25, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 45%", toggleActions: "play reverse play reverse" }
    });
}

/* --- 7. TEAM SEQUENCE (Human Architecture) --- */
function initTeamSequence() {
    const section = document.querySelector('#team');
    const title = section.querySelector('h2');
    const members = section.querySelectorAll('.team-member');
    const footerText = section.querySelector('.text-center:last-child');

    gsap.fromTo(title, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 50%", toggleActions: "play reverse play reverse" }
    });

    gsap.fromTo(members, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 45%", toggleActions: "play reverse play reverse" }
    });

    if (footerText) {
        gsap.fromTo(footerText, { y: 30, opacity: 0 }, {
            y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.5,
            scrollTrigger: { trigger: section, start: "top 45%", toggleActions: "play reverse play reverse" }
        });
    }
}

/* --- 3.5 CAROUSEL REVEAL & LOGIC (Split: Mobile vs Desktop) --- */
function initCarouselReveal() {
    // 0. Set Initial State (Prevent FOUC)
    gsap.set("#carousel-section .carousel-title-block", { y: 50, opacity: 0 });
    gsap.set(".integrated-carousel-wrapper", { y: 100, opacity: 0, filter: "blur(10px)" });

    // 1. Reveal Animation (Entry - Shared)
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#carousel-section",
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none none" // STABILITY FIX: Once revealed, stay revealed
        }
    });

    tl.to("#carousel-section .carousel-title-block", {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out"
    })
        .to(".integrated-carousel-wrapper", {
            y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out"
        }, "-=0.6");

    // 2. LOGIC SPLIT via ScrollTrigger.matchMedia
    ScrollTrigger.matchMedia({
        // DESKTOP: Infinite Scroll (Existing Logic)
        "(min-width: 768px)": function () {
            return initDesktopInfiniteScroll();
        },
        // MOBILE: Single Slide Slider (New Logic)
        "(max-width: 767px)": function () {
            return initMobileSlider();
        }
    });
}

// --- DESKTOP LOGIC (Infinite Horizontal Scroll) ---
function initDesktopInfiniteScroll() {
    const track = document.querySelector('.integrated-track');
    const container = document.querySelector('.integrated-carousel-wrapper');
    if (!track || !container) return;

    // Setup
    track.style.animation = 'none';
    track.style.transform = 'translate3d(0,0,0)'; // Reset
    container.style.cursor = 'grab';

    let x = 0;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let dragVelocity = 0;
    let isHovering = false;
    let animationFrameId;

    const baseSpeed = 0.5;
    const getResetWidth = () => track.scrollWidth / 2;
    let resetWidth = getResetWidth();

    // Event Listeners
    const onResize = () => { resetWidth = getResetWidth(); };
    window.addEventListener('resize', onResize);

    const onMouseEnter = () => isHovering = true;
    const onMouseLeave = () => { isHovering = false; isDragging = false; };

    const onMouseDown = (e) => {
        isDragging = true;
        startX = e.clientX;
        lastX = x;
        container.style.cursor = 'grabbing';
        dragVelocity = 0;
        e.preventDefault();
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        const delta = e.clientX - startX;
        x = lastX + delta;
    };

    const onMouseUp = () => {
        isDragging = false;
        container.style.cursor = 'grab';
    };

    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    function tick() {
        if (!isDragging) {
            if (!isHovering) {
                dragVelocity += (baseSpeed - dragVelocity) * 0.05;
                x -= dragVelocity;
            } else {
                dragVelocity *= 0.95;
                if (Math.abs(dragVelocity) < 0.1) dragVelocity = 0;
                x -= baseSpeed; // Continue slow movement on hover
            }
        }

        // Infinite Logic
        if (x <= -resetWidth) x += resetWidth;
        if (x > 0) x -= resetWidth;

        track.style.transform = `translate3d(${x}px, 0, 0)`;
        animationFrameId = requestAnimationFrame(tick);
    }

    tick();

    // Cleanup Function (Called when switching breakpoint)
    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', onResize);
        container.removeEventListener('mouseenter', onMouseEnter);
        container.removeEventListener('mouseleave', onMouseLeave);
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        // Reset styles for mobile
        track.style.transform = '';
        container.style.cursor = '';
    };
}

// --- MOBILE LOGIC (Disabled - Handled by app.js initMobileCarousel) ---
function initMobileSlider() {
    // Mobile carousel is now handled entirely by the dedicated
    // .mobile-carousel-wrapper + initMobileCarousel() in app.js.
    // This stub exists so initCarouselReveal's matchMedia call doesn't error.
    return () => { }; // No-op cleanup
}

/* --- GLOBAL ATMOSPHERE (Deprecated) --- */
function initAtmosphere() {
    // Deprecated - functionality moved to initSunlight
}

/* --- 8. DOSSIER SEQUENCE --- */
function initDossierSequence() {
    const section = document.querySelector('#dossier');
    if (!section) return;

    const elementsToReveal = section.querySelectorAll('.container > *');

    gsap.fromTo(elementsToReveal,
        { y: 40, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play reverse play reverse"
            }
        }
    );
}

/* --- 9. GLOBAL WAVE LIGHT (Continuous & Scroll-Linked) --- */
function initAmbientLight() {
    const globalLight = document.getElementById('global-ambient-light');
    const wave = document.querySelector('.light-wave');

    if (!globalLight || !wave) return;

    // 1. Reveal Global Layer immediately (or with slight delay)
    gsap.to(globalLight, { opacity: 1, duration: 2, delay: 0.5 });

    // 2. Parallax Motion (The "Travel" Effect)
    // As user scrolls entire page, the wave moves DOWN relative to viewport
    // creating the feeling it accompanies the user.
    gsap.to(wave, {
        y: "30vh", // Total travel distance
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5 // Smooth catch-up
        }
    });

    // 3. Diagonal Drift (Separate subtle x-axis motion linked to scroll)
    gsap.to(wave, {
        x: "10vw",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 3 // Slower, disconnected from vertical speed
        }
    });
}
