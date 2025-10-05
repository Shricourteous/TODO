/**
 * Theme Module
 * Theme management and switching with persistence
 */

const Theme = (() => {
  const STORAGE_KEY = 'todo_theme';
  
  const updateIcon = (isDark) => {
    const icon = Utils.qs('#theme-icon');
    const path = Utils.qs('#theme-path');
    
    if (isDark) {
      // Sun icon for light mode option
      path.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
    } else {
      // Moon icon for dark mode option
      path.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
    }
  };
  
  const loadTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return saved ? saved === 'dark' : prefersDark;
  };
  
  const saveTheme = (isDark) => {
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  };
  
  const applyTheme = (isDark) => {
    const root = Utils.qs('html');
    root.classList.toggle('dark', isDark);
    updateIcon(isDark);
    saveTheme(isDark);
  };
  
  const setup = () => {
    // Load saved theme or system preference
    const isDark = loadTheme();
    
    // Initialize state if available
    if (typeof State !== 'undefined' && State.state) {
      State.state.darkMode = isDark;
    }
    
    applyTheme(isDark);
    
    // Theme toggle button
    Utils.qs('#toggle-theme').addEventListener('click', () => {
      let newDark;
      if (typeof State !== 'undefined' && State.toggleDark) {
        newDark = State.toggleDark();
      } else {
        // Fallback if State is not available
        newDark = !isDark;
        saveTheme(newDark);
      }
      applyTheme(newDark);
      Utils.showToast(newDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'info');
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const isDark = e.matches;
        if (typeof State !== 'undefined' && State.state) {
          State.state.darkMode = isDark;
        }
        applyTheme(isDark);
      }
    });
  };

  return { setup, applyTheme };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Theme;
}
