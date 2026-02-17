/**
 * DOSSIER MODAL - Clean Implementation
 * Single responsibility, single state, clean layering
 */

const DossierModal = (function () {
    'use strict';

    // ========================================
    // SINGLE SOURCE OF TRUTH
    // ========================================
    let isOpen = false;

    // DOM references (cached on init)
    let modal = null;
    let backdrop = null;
    let modalBox = null;
    let closeBtn = null;
    let form = null;
    let formState = null;
    let successState = null;

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        modal = document.getElementById('dossier-modal');
        if (!modal) return;

        backdrop = modal.querySelector('.modal-backdrop');
        modalBox = modal.querySelector('.modal-box');
        closeBtn = modal.querySelector('.modal-close');
        form = document.getElementById('dossier-form');
        formState = document.getElementById('modal-form-state');
        successState = document.getElementById('modal-success-state');

        // Event listeners
        if (backdrop) backdrop.addEventListener('click', close);
        if (closeBtn) closeBtn.addEventListener('click', close);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) close();
        });

        if (form) {
            form.addEventListener('submit', handleSubmit);
        }
    }

    // ========================================
    // FORM LOGIC (PROGRESSIVE REVEAL)
    // ========================================
    const primarySectionId = 'step-primary';
    const secondarySectionId = 'step-secondary';

    function initFormLogic() {
        if (!form) return;

        // Input References
        const roleInputs = form.querySelectorAll('input[name="role"]');
        const nameInput = document.getElementById('form-name');

        // Listeners for Step 1 -> Reveal Step 2
        roleInputs.forEach(input => input.addEventListener('change', checkStep1));
        if (nameInput) nameInput.addEventListener('input', checkStep1);

        // Listeners for Step 2 -> Reveal Step 3
        const primaryRadios = form.querySelectorAll('input[name="contact_pref_1"]');
        primaryRadios.forEach(input => input.addEventListener('change', function () {
            toggleContactInput('primary', this.value);
            checkStep2();
        }));

        // Listeners for Primary Inputs (email/phone)
        const primaryEmail = document.getElementById('primary-email');
        const primaryPhone = document.getElementById('primary-phone');
        if (primaryEmail) primaryEmail.addEventListener('input', checkStep2);
        if (primaryPhone) primaryPhone.addEventListener('input', checkStep2);

        // Listeners for Step 3 (Secondary)
        const secondaryRadios = form.querySelectorAll('input[name="contact_pref_2"]');
        secondaryRadios.forEach(input => input.addEventListener('change', function () {
            toggleContactInput('secondary', this.value);
        }));

        // Initial check to set button state
        updateSubmitButton();
    }

    function checkStep1() {
        const roleSelected = form.querySelector('input[name="role"]:checked');
        const nameValid = document.getElementById('form-name').value.trim() !== '';

        if (roleSelected && nameValid) {
            revealSection(primarySectionId);
        } else {
            hideSection(primarySectionId);
            hideSection(secondarySectionId); // Cascade hide
        }
        updateSubmitButton();
    }

    function checkStep2() {
        const primaryType = form.querySelector('input[name="contact_pref_1"]:checked');
        let primaryValid = false;

        if (primaryType) {
            if (primaryType.value === 'email') {
                const email = document.getElementById('primary-email').value;
                primaryValid = email.includes('@') && email.includes('.');
            } else if (primaryType.value === 'phone') {
                const phone = document.getElementById('primary-phone').value;
                primaryValid = phone.trim().length > 5;
            }
        }

        if (primaryValid) {
            revealSection(secondarySectionId);
        } else {
            hideSection(secondarySectionId);
        }
        updateSubmitButton();
    }

    function updateSubmitButton() {
        const btn = form.querySelector('button[type="submit"]');

        // Validate Step 1
        const roleSelected = form.querySelector('input[name="role"]:checked');
        const nameValid = document.getElementById('form-name').value.trim() !== '';

        // Validate Step 2
        const primaryType = form.querySelector('input[name="contact_pref_1"]:checked');
        let primaryValid = false;
        if (primaryType) {
            if (primaryType.value === 'email') {
                const email = document.getElementById('primary-email').value;
                primaryValid = email.includes('@') && email.includes('.');
            } else if (primaryType.value === 'phone') {
                const phone = document.getElementById('primary-phone').value;
                primaryValid = phone.trim().length > 5;
            }
        }

        if (roleSelected && nameValid && primaryValid) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        } else {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
    }

    function revealSection(id) {
        const section = document.getElementById(id);
        if (section && section.style.display === 'none') {
            section.style.display = 'block';
            // Simple fade in
            section.style.opacity = '0';
            setTimeout(() => section.style.opacity = '1', 50);
        }
    }

    function hideSection(id) {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = 'none';
        }
    }

    // Exported helper for the inline calls or internal logic
    window.toggleContactInput = function (group, type) {
        const emailInput = document.getElementById(group + '-email');
        const phoneInput = document.getElementById(group + '-phone');

        if (type === 'email') {
            emailInput.style.display = 'block';
            emailInput.required = (group === 'primary');
            phoneInput.style.display = 'none';
            phoneInput.required = false;
            phoneInput.value = '';
        } else if (type === 'phone') {
            phoneInput.style.display = 'block';
            phoneInput.required = (group === 'primary');
            emailInput.style.display = 'none';
            emailInput.required = false;
            emailInput.value = '';
        } else {
            if (emailInput) emailInput.style.display = 'none';
            if (phoneInput) phoneInput.style.display = 'none';
        }
        // Re-check validity when toggling
        if (group === 'primary') checkStep2();
    };


    // ========================================
    // OPEN MODAL
    // ========================================
    function open() {
        if (isOpen) return;
        isOpen = true;

        // Reset to form state
        if (formState) formState.style.display = 'block';
        if (successState) successState.style.display = 'none';
        if (form) {
            form.reset();
            // Reset Progressive State
            hideSection(primarySectionId);
            hideSection(secondarySectionId);
            // Hide dynamic inputs
            const dynInputs = form.querySelectorAll('input[name*="_email"], input[name*="_phone"]');
            dynInputs.forEach(i => i.style.display = 'none');
            updateSubmitButton();
        }

        // Show modal (single action controls everything)
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');

        // Lock scroll
        if (window.ModalManager) window.ModalManager.lock();
        else {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = scrollbarWidth + 'px';
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
    }

    // ========================================
    // CLOSE MODAL
    // ========================================
    function close() {
        if (!isOpen) return;
        isOpen = false;

        // Hide modal
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');

        // Restore scroll
        if (window.ModalManager) window.ModalManager.unlock();
        else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    }

    // ========================================
    // FORM SUBMISSION
    // ========================================
    function handleSubmit(e) {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        // Simulate submission
        setTimeout(function () {
            formState.style.display = 'none';
            successState.style.display = 'block';
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1000);
    }

    // ========================================
    // AUTO-INITIALIZE
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            initFormLogic();
        });
    } else {
        init();
        initFormLogic();
    }

    // ========================================
    // PUBLIC API
    // ========================================
    return {
        open: open,
        close: close,
        isOpen: function () { return isOpen; }
    };
})();
