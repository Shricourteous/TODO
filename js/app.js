/**
 * Application Module
 * Main application initialization and bootstrap
 */

const App = (() => {
  const init = async () => {
    try {
      // Setup theme first
      Theme.setup();
      
      // Setup event handlers
      EventHandlers.setup();
      
      // Load data from database
      await Storage.load();
      
      // Set initial selected project
      const projects = State.getProjects();
      if (projects.length > 0) {
        State.setSelectedProjectId(projects[0].id);
      }
      
      // Initial render after data is loaded
      View.switchTo(State.getCurrentView());
      
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Application initialization failed:', error);
      Utils.showToast('Failed to initialize application', 'error');
    }
  };

  return { init };
})();

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
