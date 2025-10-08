// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    console.log(themeToggle.innerHTML);
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use device preference
    const currentTheme = localStorage.getItem('theme');
    console.log(currentTheme);
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    } else if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        if (themeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Sidebar Toggle for Mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });
    
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });
    
    // Simulate data loading (would be replaced with actual API calls)
    simulateDataLoading();
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            alert(`Searching for: ${this.value}`);
            this.value = '';
        }
    });
});

// Simulate data loading with a slight delay
function simulateDataLoading() {
    const statCards = document.querySelectorAll('.stat-card');
    const bookingItems = document.querySelectorAll('.booking-item');
    
    // Add loading animation
    statCards.forEach(card => {
        card.style.opacity = '0.7';
    });
    
    bookingItems.forEach(item => {
        item.style.opacity = '0.7';
    });
    
    // Simulate loading completion
    setTimeout(() => {
        statCards.forEach(card => {
            card.style.opacity = '1';
        });
        
        bookingItems.forEach(item => {
            item.style.opacity = '1';
        });
    }, 800);
}

// SETTINGS PAGE ::::::::::::::::::::::::::::::
document.getElementById("settingsForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const settings = {
    siteTitle: this.siteTitle.value,
    emailNotifications: this.emailNotifications.value,
    defaultLanguage: this.defaultLanguage.value,
    timezone: this.timezone.value,
    darkModeToggle: this.darkModeToggle.checked,
  };

  localStorage.setItem("adminSettings", JSON.stringify(settings));
  alert("Settings saved successfully!");

  // Optionally update site title dynamically
  document.querySelector(".logo-text").textContent = settings.siteTitle;

  // Apply dark mode if toggled
  if (settings.darkModeToggle) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
});

// Load saved settings and sync theme toggle with LayoutComponent
window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("adminSettings") || "{}");
  if (saved) {
    document.getElementById("siteTitle").value = saved.siteTitle || "LuxStay Admin";
    document.getElementById("emailNotifications").value = saved.emailNotifications || "all";
    document.getElementById("defaultLanguage").value = saved.defaultLanguage || "en";
    document.getElementById("timezone").value = saved.timezone || "UTC";
    document.getElementById("darkModeToggle").checked = saved.darkModeToggle || false;
  }

  const settingsToggle = document.getElementById('themeToggle');
  const layoutComponent = document.querySelector('layout-component');

  if (!settingsToggle || !layoutComponent) return;

  // Initialize toggle state based on stored theme or system preference
  const storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  settingsToggle.checked = storedTheme === 'dark';

  // Sync settings toggle changes to LayoutComponent theme toggle and theme
  settingsToggle.addEventListener('change', () => {
    const isDark = settingsToggle.checked;
    layoutComponent.setTheme(isDark ? 'dark' : 'light');
    if (layoutComponent.themeToggle.checked !== isDark) {
      layoutComponent.setThemeToggleState(isDark);
    }
  });
});
