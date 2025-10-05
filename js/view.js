/**
 * View Module
 * View switching between Projects and Notes
 */

const View = (() => {
  const switchTo = (view) => {
    State.setCurrentView(view);
    const projBtn = Utils.qs('#switch-projects');
    const noteBtn = Utils.qs('#switch-notes');
    const projView = Utils.qs('#projects-view');
    const notesView = Utils.qs('#notes-view');
    const searchInput = Utils.qs('#search');
    
    if (view === 'projects') {
      projBtn.classList.add('bg-indigo-600', 'text-white', 'shadow-md');
      projBtn.classList.remove('hover:bg-gray-700', 'text-gray-300');
      noteBtn.classList.remove('bg-green-600', 'text-white', 'shadow-md');
      noteBtn.classList.add('hover:bg-gray-700', 'text-gray-300');
      projView.classList.remove('hidden');
      notesView.classList.add('hidden');
      searchInput.placeholder = "Search todos or images...";
      Renderer.renderAll();
    } else {
      noteBtn.classList.add('bg-green-600', 'text-white', 'shadow-md');
      noteBtn.classList.remove('hover:bg-gray-700', 'text-gray-300');
      projBtn.classList.remove('bg-indigo-600', 'text-white', 'shadow-md');
      projBtn.classList.add('hover:bg-gray-700', 'text-gray-300');
      notesView.classList.remove('hidden');
      projView.classList.add('hidden');
      searchInput.placeholder = "Search quick notes...";
      NotesRenderer.render();
    }
  };

  return { switchTo };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = View;
}
