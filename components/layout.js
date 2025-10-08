class LayoutComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link rel="stylesheet" href="assets/css/admin.css" />
      <style>
        :host {
          display: block;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          --sidebar-width: 280px;
          --sidebar-collapsed-width: 60px;
          --header-height: 80px;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          --shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
          --border-radius: 12px;
          --border-radius-sm: 8px;
          --transition: all 0.3s ease;
        }
                /* HEADER */
        .content-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height);
          padding: 1.5rem 2rem;
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
        }
        .header-left{
          display:flex;
          align-items: center;
        }
        .header-left h1 {
          margin: 0 0 0.25rem 0;
          font-weight: 700;
          font-size: 2rem;
          color: var(--text-primary);
        }
        .header-left p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: nowrap;
        }
        .search-box {
          position: relative;
          flex: 1;
          max-width: 300px;
          min-width: 120px;
        }
        .search-box input {
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-size: 1rem;
          transition: var(--transition);
        }
        .search-box input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(58, 134, 255, 0.1);
        }
        .search-box i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
          font-size: 1.1rem;
        }
        .header-actions {
            display: flex;
            gap: 0.5rem;
        }
        .header-actions button {
          position: relative;
          background: none;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 1.25rem;
          transition: var(--transition);
        }
        .header-actions button:hover {
          background-color: var(--bg-tertiary);
          color: var(--primary-color);
        }
        .notification-badge, .message-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: var(--accent-color);
          color: white;
          font-size: 0.75rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        /* SIDEBAR */
        nav.sidebar {
          position: fixed;
          top: var(--header-height);
          left: 0;
          width: var(--sidebar-width);
          height: calc(100vh - var(--header-height));
          background-color: var(--bg-primary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
          overflow-y: auto;
          z-index: 999;
        }
        nav.sidebar.collapsed {
          width: var(--sidebar-collapsed-width);
        }
        nav.sidebar.open {
          left: 0;
          z-index: 1100;
        }
        nav.sidebar::-webkit-scrollbar {
          width: 8px;
        }
        nav.sidebar::-webkit-scrollbar-track {
          background: var(--bg-tertiary);
        }
        nav.sidebar::-webkit-scrollbar-thumb {
          background: var(--primary-color);
          border-radius: 4px;
        }
        nav.sidebar::-webkit-scrollbar-thumb:hover {
          background: var(--secondary-color);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          flex-shrink: 0;
        }
        .logo {
          cursor: pointer;
        }
.logo {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        .logo img {
          width: 40px;
          height: 40px;
          border-radius: var(--border-radius-sm);
          transition: width 0.3s ease, height 0.3s ease;
        }
        .logo-text {
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--primary-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-left: 0.75rem;
          transition: opacity 0.3s ease;
        }
        @media (max-width: 768px) {
          .logo-text {
            display: none;
          }
          .logo img {
            width: 32px;
            height: 32px;
          }
        }
        nav.sidebar.collapsed .logo-text {
          opacity: 0;
          width: 0;
        }
        .toggle-buttons {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        button.toggle-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 1.25rem;
          padding: 0.5rem;
          border-radius: var(--border-radius-sm);
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        button.toggle-btn:hover {
          background-color: var(--bg-tertiary);
          color: var(--primary-color);
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0;
          margin: 0;
        }
        .sidebar-nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-item {
          margin-bottom: 0.25rem;
        }
        .nav-item a {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
          transition: var(--transition);
          cursor: pointer;
        }
        .nav-item a:hover {
          background-color: var(--bg-secondary);
          color: var(--primary-color);
        }
        .nav-item.active a {
          background-color: var(--bg-secondary);
          color: var(--primary-color);
          border-left: 4px solid var(--primary-color);
        }
        .nav-item i {
          width: 20px;
          flex-shrink: 0;
          text-align: center;
          font-size: 1.2rem;
        }
        .nav-text {
          transition: var(--transition);
          opacity: 1;
        }
        nav.sidebar.collapsed .nav-text {
          opacity: 0;
          width: 0;
          margin-left: 0;
        }
        nav.sidebar.collapsed .nav-item a {
          justify-content: center;
          padding: 0.75rem;
        }
        nav.sidebar.collapsed .nav-item a::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          padding: 0.5rem 0.75rem;
          border-radius: var(--border-radius);
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: var(--transition);
          margin-left: 0.5rem;
          box-shadow: var(--shadow-md);
          z-index: 10;
          border: 1px solid var(--border-color);
        }
        nav.sidebar.collapsed .nav-item a:hover::after {
          opacity: 1;
          pointer-events: all;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          gap: 1rem;
        }
        .theme-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;

        }
        nav.sidebar.collapsed .theme-toggle span {
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
          flex-shrink: 0;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--bg-tertiary);
          transition: var(--transition);
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: '';
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: var(--transition);
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: var(--primary-color);
        }
        input:checked + .slider:before {
          transform: translateX(24px);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          opacity: 1;
          transition: var(--transition);
        }
        nav.sidebar.collapsed .user-profile {
          justify-content: center;
          gap: 0;
        }
        nav.sidebar.collapsed .user-info {
          opacity: 0;
          width: 0;
        }
        .user-profile img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          transition: var(--transition);
        }
        .user-name {
          font-weight: 600;
          color: var(--text-primary);
        }
        .user-role {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        /* Sidebar Overlay for mobile */
        .sidebar-overlay {
          display: none;
          position: fixed;
          width: 100vw;
          height: 100vh;
          top: 0;
          left: 0;
          background: rgba(0,0,0,0.5);
          z-index: 998;
          transition: opacity 0.3s ease;
          opacity: 0;
          pointer-events: none;
        }
        .sidebar-overlay.active {
          display: block;
          opacity: 1;
          pointer-events: all;
        }

        /* Slot content styles (your page content) */
        ::slotted(main) {
          margin-top: var(--header-height);
          margin-left: var(--sidebar-width);
          padding: 2rem;
          min-height: calc(100vh - var(--header-height));
          transition: margin-left 0.3s ease;
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          overflow-y: auto;
          box-sizing: border-box;
        }
        ::slotted(main.sidebar-collapsed) {
          margin-left: var(--sidebar-collapsed-width);
        }

        /* Responsive */
        @media (max-width: 768px) {
          nav.sidebar {
            left: -100%;
            width: var(--sidebar-width);
            z-index: 1100;
          }
          nav.sidebar.open {
            left: 0;
          }
          nav.sidebar.collapsed {
            width: var(--sidebar-width);
            left: 0;
          }
          button.toggle-btn {
            display: block;
          }
          ::slotted(main) {
            margin-left: 0;
            margin-top: calc(var(--header-height) + 1rem);
            padding: 1rem;
          }
        }
      </style>

      <!-- Header -->
      <header class="content-header">
        <div class="header-left">
          <div class="logo" title="LuxStay Admin" tabindex="0" role="link" aria-label="Go to Dashboard">
            <img src="https://placeholder-image-service.onrender.com/image/40x40?prompt=Hotel-logo-with-modern-design-elegant-typography&id=logo-1&customer_id=cus_TAQlaqlRem2vHz" alt="LuxStay Hotel Management Logo" />
            <h2 class="logo-text">LuxStay Admin</h2>
          </div>
          <div class="toggle-buttons">
            <button class="toggle-btn" id="sidebarToggle" title="Toggle sidebar menu" aria-label="Toggle sidebar menu">
              <i class="fas fa-bars"></i>
            </button>
          </div>
        </div>
        <div class="header-right">
          <div class="search-box">
            <input type="text" placeholder="Search..." />
            <i class="fas fa-search"></i>
          </div>
          <div class="header-actions">
            <button class="notification-btn" title="Notifications" aria-label="Notifications">
              <i class="fas fa-bell"></i>
              <span class="notification-badge">3</span>
            </button>
            <button class="message-btn" title="Messages" aria-label="Messages">
              <i class="fas fa-envelope"></i>
              <span class="message-badge">7</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Sidebar Overlay -->
      <div class="sidebar-overlay" id="sidebarOverlay"></div>

      <!-- Sidebar Navigation -->
      <nav class="sidebar${this.isCollapsed ? " collapsed" : ""}" id="sidebar" role="navigation" aria-label="Main navigation">
        <ul class="sidebar-nav" id="sidebarNav">
          <li class="nav-item" data-page="dashboard" data-link="dashboard.html"><a href="#" data-page="dashboard" data-tooltip="Dashboard"><i class="fas fa-chart-pie"></i><span class="nav-text">Dashboard</span></a></li>
          <li class="nav-item" data-page="bookings" data-link="bookings.html"><a href="#" data-page="bookings" data-tooltip="Bookings"><i class="fas fa-calendar-check"></i><span class="nav-text">Bookings</span></a></li>
          <li class="nav-item" data-page="rooms" data-link="rooms.html"><a href="#" data-page="rooms" data-tooltip="Rooms"><i class="fas fa-bed"></i><span class="nav-text">Rooms</span></a></li>
          <li class="nav-item" data-page="customers" data-link="customers.html"><a href="#" data-page="customers" data-tooltip="Customers"><i class="fas fa-users"></i><span class="nav-text">Customers</span></a></li>
          <li class="nav-item" data-page="analytics" data-link="analytics.html"><a href="#" data-page="analytics" data-tooltip="Analytics"><i class="fas fa-chart-line"></i><span class="nav-text">Analytics</span></a></li>
          <li class="nav-item" data-page="notifications" data-link="notifications.html"><a href="#" data-page="notifications" data-tooltip="Notifications"><i class="fas fa-bell"></i><span class="nav-text">Notifications</span></a></li>
          <li class="nav-item" data-page="profile" data-link="profile.html"><a href="#" data-page="profile" data-tooltip="Profile"><i class="fas fa-user"></i><span class="nav-text">Profile</span></a></li>
          <li class="nav-item" data-page="settings" data-link="settings.html"><a href="#" data-page="settings" data-tooltip="Settings"><i class="fas fa-cog"></i><span class="nav-text">Settings</span></a></li>
        </ul>
        <div class="sidebar-footer" role="contentinfo">
          <div class="theme-toggle">
            <span>Theme</span>
            <label class="switch">
              <input type="checkbox" id="themeToggle" aria-label="Toggle theme" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="user-profile" title="Admin user profile">
            <img src="https://placeholder-image-service.onrender.com/image/40x40?prompt=Professional-admin-profile-picture&id=profile-1&customer_id=cus_TAQlaqlRem2vHz" alt="Admin user profile picture" />
            <div class="user-info">
              <span class="user-name">Sarah Johnson</span>
              <span class="user-role">Administrator</span>
            </div>
          </div>
        </div>
      </nav>

      <slot></slot>
    `;
  }


    connectedCallback() {
    this.initEventListeners();
    this.setActivePage();
    this.applyInitialTheme();
  }
  
  initEventListeners() {
    this.sidebar = this.shadowRoot.querySelector("nav.sidebar");
    this.toggleBtn = this.shadowRoot.getElementById("sidebarToggle");
    this.sidebarOverlay = this.shadowRoot.getElementById("sidebarOverlay");
    this.themeToggle = this.shadowRoot.getElementById("themeToggle");
    this.searchInput = this.shadowRoot.querySelector(".search-box input");
    this.notificationBtn = this.shadowRoot.querySelector('.notification-btn');
    this.messageBtn = this.shadowRoot.querySelector('.message-btn');

    this.toggleBtn.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        this.sidebar.classList.toggle("open");
        this.sidebarOverlay.classList.toggle("active");
      } else {
        this.sidebar.classList.toggle("collapsed");
        const mainContent = document.querySelector("main.admin-content") || document.querySelector("main.page-content");
        if (mainContent) mainContent.classList.toggle("sidebar-collapsed");
        this.isCollapsed = this.sidebar.classList.contains("collapsed");
        localStorage.setItem("sidebarCollapsed", this.isCollapsed);
      }
    });

    this.sidebarOverlay.addEventListener("click", () => {
      this.sidebar.classList.remove("open");
      this.sidebarOverlay.classList.remove("active");
    });

    this.themeToggle.addEventListener("change", () => {
      const isDark = this.themeToggle.checked;
      this.setTheme(isDark ? 'dark' : 'light');

      // will sync the external toggle if existing on the page
      const settingsToggle = document.getElementById('themeToggle');
      if (settingsToggle && settingsToggle.checked !== isDark) {
        settingsToggle.checked = isDark;
      }
    });

    this.searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        alert(`Searching for: ${this.searchInput.value}`);
        this.searchInput.value = "";
      }
    });

    this.shadowRoot.querySelectorAll("nav.sidebar li").forEach((li) => {
      li.addEventListener("click", () => {
        const link = li.getAttribute("data-link");
        if (link) window.location.href = link;
        if (window.innerWidth <= 768) {
          this.sidebar.classList.remove("open");
          this.sidebarOverlay.classList.remove("active");
        }
      });
    });

    if (this.notificationBtn) {
      this.notificationBtn.addEventListener('click', () => {
        alert('You have 3 new notifications');
      });
    }


    if (this.messageBtn) {
      this.messageBtn.addEventListener('click', () => {
        alert('You have 7 new messages');
      });
    }
  }

  setActivePage() {
    const sidebarNav = this.shadowRoot.getElementById("sidebarNav");
    if (!sidebarNav) return;
    sidebarNav.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    const activePage = window.location.pathname.split("/").pop().replace(".html", "") || "dashboard";
    const activeItem = sidebarNav.querySelector(`.nav-item[data-page="${activePage}"]`);
    if (activeItem) activeItem.classList.add("active");
  }

  applyInitialTheme() {
    const storedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeToApply = storedTheme || (prefersDarkScheme ? 'dark' : 'light');
    this.setTheme(themeToApply);
    this.themeToggle.checked = (themeToApply === 'dark');
  }

  setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light'); // Explicitly set light theme
    }
    localStorage.setItem('theme', theme);
  }

  setThemeToggleState(isDark) {
  if (this.themeToggle) {
    this.themeToggle.checked = isDark;
  }
}

  
// Additional functionality for notifications

  }

customElements.define("layout-component", LayoutComponent);
