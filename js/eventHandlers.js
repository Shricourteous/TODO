/**
 * Event Handlers Module
 * Sets up all event listeners
 */

const EventHandlers = (() => {
  const setup = () => {
    // Project actions
    Utils.qs('#add-project').addEventListener('click', async () => {
      const newName = prompt('Enter new project name:');
      if (!newName || newName.trim() === '') return;
      const success = await ProjectsManager.create(newName);
      if (success) Renderer.renderAll();
    });

    // Todo actions
    Utils.qs('#new-todo-btn').addEventListener('click', () => TodosManager.showModal());
    Utils.qs('#filter-status').addEventListener('change', () => TodosRenderer.render());
    
    // Search
    Utils.qs('#search').addEventListener('input', () => {
      if (State.getCurrentView() === 'projects') {
        TodosRenderer.render();
      } else {
        NotesRenderer.render();
      }
    });
    
    // Data management
    Utils.qs('#export-json').addEventListener('click', Storage.exportJSON);
    Utils.qs('#import-btn').addEventListener('click', () => Utils.qs('#import-file').click());
    Utils.qs('#import-file').addEventListener('change', (e) => {
      if (e.target.files.length) {
        const shouldReplace = confirm('Do you want to REPLACE ALL data with the imported data (OK) or MERGE it (Cancel)?');
        const mode = shouldReplace ? 'replace' : 'merge';
        Storage.importJSON(e.target.files[0], mode, () => Renderer.renderAll());
      }
      e.target.value = null;
    });
    Utils.qs('#clear-all').addEventListener('click', () => {
      Storage.clearAll(() => Renderer.renderAll());
    });

    // View switching
    Utils.qs('#switch-projects').addEventListener('click', () => View.switchTo('projects'));
    Utils.qs('#switch-notes').addEventListener('click', () => View.switchTo('notes'));
    Utils.qs('#add-note').addEventListener('click', () => NotesManager.showModal());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + N: New todo (only in projects view)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && State.getCurrentView() === 'projects') {
        e.preventDefault();
        TodosManager.showModal();
        Utils.showToast('New todo modal opened', 'success');
      }
      
      // Ctrl/Cmd + K: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = Utils.qs('#search');
        searchInput.focus();
        searchInput.select();
        Utils.showToast('Search focused', 'success');
      }
      
      // Escape: Close modal or clear selection
      if (e.key === 'Escape') {
        const modal = Utils.qs('#modal');
        if (modal && !modal.classList.contains('hidden')) {
          Modal.close();
        } else if (State.getSelectedTodoId()) {
          State.setSelectedTodoId(null);
          Renderer.renderAll();
          Utils.showToast('Selection cleared', 'success');
        }
      }
      
      // Ctrl/Cmd + 1: Switch to Projects view
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        View.switchTo('projects');
        Utils.showToast('Switched to Projects', 'success');
      }
      
      // Ctrl/Cmd + 2: Switch to Notes view
      if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        View.switchTo('notes');
        Utils.showToast('Switched to Notes', 'success');
      }
    });
  };

  return { setup };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EventHandlers;
}
