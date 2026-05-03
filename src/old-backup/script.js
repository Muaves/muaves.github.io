let isAdmin = false;
let currentPage = 'home';
let projects = [
    {
        id: 1,
        title: 'ProTiers',
        description: 'uhm... something with tier lists. it works tho',
        tech: ['HTML', 'CSS', 'JavaScript'],
        status: 'active',
        createdAt: '2025-03-12'
    },
    {
        id: 2,
        title: 'EzCraft',
        description: 'minecraft server i made. economy plugins and all that jazz',
        tech: ['Java', 'Python', 'CSS'],
        status: 'completed',
        createdAt: '2024-11-20'
    },
    {
        id: 3,
        title: 'Redstone Launcher',
        description: 'THE BEST minecraft launcher!! check it out at redstone-launcher.com',
        tech: ['JavaScript', 'CSS', 'HTML'],
        status: 'active',
        createdAt: '2025-07-10'
    }
];

let monitoringInterval = null;
let systemStartTime = Date.now();

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initProjects();
    renderProjects();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const adminToggle = document.getElementById('adminToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                navigateToPage(page);
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-page')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            navigateToPage(page);
        }
    });

    adminToggle.addEventListener('click', () => {
        if (!isAdmin) {
            const password = prompt('Enter admin password:');
            if (password === 'Muaves2509') {
                isAdmin = true;
                adminToggle.textContent = 'logout';
                adminToggle.classList.add('active');
                updateAdminVisibility();
                startMonitoring();
                showToast('ayy welcome back boss 🎉', 'success');
            } else {
                showToast('nope, wrong password buddy', 'error');
            }
        } else {
            isAdmin = false;
            adminToggle.textContent = 'login';
            adminToggle.classList.remove('active');
            updateAdminVisibility();
            stopMonitoring();
            if (currentPage === 'system') {
                navigateToPage('home');
            }
            showToast('see ya later! 👋', 'success');
        }
    });

    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('mobile-open');
    });
}

function navigateToPage(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });

    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        currentPage = page;
        setTimeout(() => {
            targetPage.classList.add('active');
            if (page === 'about') {
                animateSkills();
            }
            if (page === 'projects') {
                renderProjects();
            }
        }, 50);
    }

    document.getElementById('navLinks').classList.remove('mobile-open');
}

function updateAdminVisibility() {
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        el.style.display = isAdmin ? 'block' : 'none';
    });
}

function initProjects() {
    const showAddFormBtn = document.getElementById('showAddFormBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const projectForm = document.getElementById('projectForm');
    const addProjectForm = document.getElementById('addProjectForm');

    if (showAddFormBtn) {
        showAddFormBtn.addEventListener('click', () => {
            addProjectForm.style.display = 'block';
        });
    }

    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', () => {
            addProjectForm.style.display = 'none';
            projectForm.reset();
        });
    }

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newProject = {
                id: Date.now(),
                title: document.getElementById('projectTitle').value,
                description: document.getElementById('projectDescription').value,
                tech: document.getElementById('projectTech').value.split(',').map(t => t.trim()).filter(t => t),
                status: document.getElementById('projectStatus').value,
                createdAt: new Date().toISOString().split('T')[0]
            };

            projects.unshift(newProject);
            renderProjects();
            projectForm.reset();
            addProjectForm.style.display = 'none';
            showToast('project added! nice one 🚀', 'success');
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('message sent! i\'ll get back to you soon 📬', 'success');
            contactForm.reset();
        });
    }
}

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    grid.innerHTML = projects.map(project => `
                <div class="project-card">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-status ${project.status}">${project.status}</div>
                    <p class="project-description">${project.description}</p>
                    ${project.tech.length > 0 ? `
                        <div class="tech-stack">
                            ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="project-date">Created: ${project.createdAt}</div>
                </div>
            `).join('');
}

function animateSkills() {
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        setTimeout(() => {
            fill.style.width = width + '%';
        }, 100);
    });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
                <div class="toast-title">${type === 'success' ? '✓' : '✗'}</div>
                <div>${message}</div>
            `;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function startMonitoring() {
    systemStartTime = Date.now();
    updateMonitoring();
    monitoringInterval = setInterval(updateMonitoring, 1000);
}

function stopMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }
}

function updateMonitoring() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleTimeString();

    const uptime = Math.floor((Date.now() - systemStartTime) / 1000);
    document.getElementById('systemUptime').innerHTML = `${uptime}<span class="monitor-unit">s</span>`;

    const cpuUsage = Math.floor(Math.random() * 30 + 20);
    document.getElementById('cpuUsage').innerHTML = `${cpuUsage}<span class="monitor-unit">%</span>`;

    const memUsage = Math.floor(Math.random() * 20 + 50);
    document.getElementById('memoryUsage').innerHTML = `${memUsage}<span class="monitor-unit">%</span>`;

    for (let i = 1; i <= 4; i++) {
        const coreUsage = Math.floor(Math.random() * 40 + 10);
        document.getElementById(`core${i}`).textContent = `${coreUsage}%`;
        document.getElementById(`core${i}Bar`).style.width = `${coreUsage}%`;
    }

    const download = (Math.random() * 5).toFixed(2);
    const upload = (Math.random() * 2).toFixed(2);
    document.getElementById('downloadSpeed').innerHTML = `${download}<span class="monitor-unit"> MB/s</span>`;
    document.getElementById('uploadSpeed').innerHTML = `${upload}<span class="monitor-unit"> MB/s</span>`;

    if (Math.random() > 0.7) {
        const logs = document.getElementById('systemLogs');
        const time = now.toLocaleTimeString();
        const messages = [
            'System check completed',
            'Network connection stable',
            'Memory optimization complete',
            'CPU temperature normal',
            'Background process completed'
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        const logLine = document.createElement('div');
        logLine.className = 'log-line';
        logLine.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
        logs.appendChild(logLine);
        logs.scrollTop = logs.scrollHeight;
    }
}