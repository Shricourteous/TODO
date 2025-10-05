/**
 * Utilities Module
 * Common helper functions
 */

const Utils = (() => {
  return {
    uid: () => 'id_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36),
    qs: s => document.querySelector(s),
    qsa: s => Array.from(document.querySelectorAll(s)),
    formatDate: (timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
    },
    
    showToast: (message, type = 'info') => {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    },
    
    showLoading: (show = true) => {
      let loader = Utils.qs('#app-loader');
      if (!loader && show) {
        loader = document.createElement('div');
        loader.id = 'app-loader';
        loader.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        loader.innerHTML = '<div class="loading"></div>';
        document.body.appendChild(loader);
      } else if (loader && !show) {
        loader.remove();
      }
    }
  };
})();

// Export for ES6 modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
