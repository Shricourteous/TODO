/**
 * Projects Module
 * Projects management and rendering
 */

const ProjectsManager = (() => {
  const create = async (name) => {
    const newProj = { 
      id: Utils.uid(), 
      name: name.trim() || 'Untitled Project',
      created_at: Math.floor(Date.now() / 1000)
    };
    
    const success = await Storage.saveProject(newProj, false);
    if (success) {
      State.setSelectedProjectId(newProj.id);
    }
    return success;
  };

  const update = async (projectId, newName) => {
    const proj = State.getProjects().find(p => p.id === projectId);
    if (proj) {
      proj.name = newName.trim() || 'Untitled';
      return await Storage.saveProject(proj, true);
    }
    return false;
  };

  const remove = async (projectId) => {
    const proj = State.getProjects().find(p => p.id === projectId);
    if (!proj) return false;
    
    const todoCount = State.getTodos().filter(t => t.projectId === projectId).length;
    if (!confirm(`Delete project "${proj.name}" and all its ${todoCount} todos?`)) return false;
    
    const success = await Storage.deleteProject(projectId);
    
    if (success && State.getSelectedProjectId() === projectId) {
      const projects = State.getProjects();
      State.setSelectedProjectId(projects.length ? projects[0].id : null);
    }
    
    return success;
  };

  const showEditModal = (projectId) => {
    const proj = State.getProjects().find(p => p.id === projectId);
    if (!proj) return;

    const content = document.createElement('div');
    content.className = 'bg-gray-850 p-5 rounded-xl';
    
    const title = document.createElement('h3');
    title.className = 'text-lg font-bold mb-3 text-indigo-300';
    title.textContent = 'Edit Project Name';
    content.appendChild(title);

    const input = document.createElement('input');
    input.value = proj.name;
    input.className = 'w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500';
    content.appendChild(input);

    const btns = document.createElement('div');
    btns.className = 'mt-4 flex gap-2 justify-end';
    
    const ok = document.createElement('button');
    ok.className = 'px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-white font-medium';
    ok.textContent = 'Save';
    ok.addEventListener('click', async () => {
      const success = await update(projectId, input.value);
      if (success) {
        Modal.close();
        Renderer.renderAll();
      }
    });

    const cancel = document.createElement('button');
    cancel.className = 'px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white';
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', () => Modal.close());
    
    btns.appendChild(ok);
    btns.appendChild(cancel);
    content.appendChild(btns);
    Modal.show(content);
  };

  return { create, update, remove, showEditModal };
})();

const ProjectsRenderer = (() => {
  const render = () => {
    if (State.getCurrentView() !== 'projects') return;
    
    const el = Utils.qs('#project-list');
    el.innerHTML = '';
    
    const projects = State.getProjects();
    if (projects.length === 0) {
      el.innerHTML = '<div class="text-sm text-gray-500 p-2 text-center">No projects yet. Click "+ New Project".</div>';
      return;
    }

    projects.forEach(proj => {
      const isActive = State.getSelectedProjectId() === proj.id;
      const row = document.createElement('div');
      row.className = `flex items-center justify-between gap-2 p-3 rounded-lg cursor-pointer transition ${isActive ? 'bg-indigo-700/70 border border-indigo-500 shadow-md' : 'hover:bg-gray-700/30'}`;
      
      const left = document.createElement('div');
      left.className = 'flex items-center gap-3 min-w-0';
      
      const color = document.createElement('div');
      color.className = `w-3 h-3 rounded-full ${isActive ? 'bg-white' : 'bg-indigo-400'} flex-shrink-0`;
      
      const name = document.createElement('div');
      name.className = 'text-sm truncate font-medium';
      name.textContent = proj.name;
      name.addEventListener('click', () => {
        State.setSelectedProjectId(proj.id);
        Renderer.renderAll();
      });
      
      left.appendChild(color);
      left.appendChild(name);

      const actions = document.createElement('div');
      actions.className = 'flex items-center gap-1 flex-shrink-0';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'text-xs px-2 py-1 bg-yellow-600/50 text-yellow-300 rounded-md hover:bg-yellow-600/70 transition';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        ProjectsManager.showEditModal(proj.id);
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'text-xs px-2 py-1 bg-red-600/50 text-red-300 rounded-md hover:bg-red-600/70 transition';
      delBtn.textContent = 'Del';
      delBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); 
        const success = await ProjectsManager.remove(proj.id);
        if (success) Renderer.renderAll();
      });

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      row.appendChild(left);
      row.appendChild(actions);
      el.appendChild(row);
    });
  };

  return { render };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProjectsManager, ProjectsRenderer };
}
