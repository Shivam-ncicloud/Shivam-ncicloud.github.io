document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const themeToggle = document.getElementById('theme-toggle');
    const sidebar = document.querySelector('.sidebar');
    const openSidebarBtn = document.getElementById('open-sidebar-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const pipelineItems = document.querySelectorAll('.interactive-pipeline .pipeline-item');
    const modalContainer = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-details-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // --- MOBILE SIDEBAR TOGGLE ---
    if (openSidebarBtn && closeSidebarBtn && sidebar) {
        openSidebarBtn.addEventListener('click', () => sidebar.classList.add('open'));
        closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));
        navLinks.forEach(link => link.addEventListener('click', () => sidebar.classList.remove('open')));
    }

    // --- THEME TOGGLE FUNCTIONALITY ---
    const setTheme = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
        const isDark = savedTheme === 'dark';
        themeToggle.checked = !isDark;
        setTheme(isDark);
    } else {
        themeToggle.checked = !prefersDark;
        setTheme(prefersDark);
    }
    themeToggle.addEventListener('change', () => setTheme(!themeToggle.checked));

    // --- INTERACTIVE PROJECT MODAL ---
    pipelineItems.forEach(item => {
        item.addEventListener('click', () => {
            const details = item.getAttribute('data-details');
            if (details) {
                modalContent.innerHTML = `<p>${details}</p>`;
                modalContainer.classList.add('show');
            }
        });
    });
    const closeModal = () => modalContainer.classList.remove('show');
    if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if(modalContainer) modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) closeModal();
    });

    // --- ACTIVE NAV LINK ON SCROLL ---
    const activateNavLink = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) { // Offset for better timing
                currentSectionId = section.getAttribute('id');
            }
        });

        // --- FIX FOR LAST SECTION ---
        // If scrolled to the bottom, force the last link to be active.
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
             currentSectionId = 'contact';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', activateNavLink);
    activateNavLink(); // Initial check on page load

    // --- SCROLL-BASED FADE-IN ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el));
});
