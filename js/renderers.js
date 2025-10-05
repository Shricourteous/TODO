/**
 * Main Renderer Module
 * Coordinates all rendering operations
 */

const Renderer = (() => {
  const renderAll = () => {
    if (State.getCurrentView() === 'projects') {
      ProjectsRenderer.render();
      HeaderRenderer.render();
      TodosRenderer.render();
      DetailsRenderer.render();
    } else {
      NotesRenderer.render();
      Utils.qs('#project-title').textContent = 'Quick Notes';
      Utils.qs('#project-sub').textContent = 'Project management is hidden in this view.';
      Utils.qs('#todo-list').innerHTML = '<div class="text-gray-400 p-4">Switch to "Show Projects" to manage Todos.</div>';
      Utils.qs('#detail-empty').classList.remove('hidden');
      Utils.qs('#detail-card').classList.add('hidden');
    }
  };

  return { renderAll };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Renderer;
}
