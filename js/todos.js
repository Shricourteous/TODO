/**
 * Todos Module
 * Todos management and rendering
 */

const TodosManager = (() => {
  const showModal = (todoId = null) => {
    const initial = todoId ? State.getTodos().find(t => t.id === todoId) : null;
    
    const content = document.createElement('div');
    content.className = 'p-5';

    const title = document.createElement('h3');
    title.className = 'text-lg font-bold mb-3 text-indigo-300 border-b border-gray-700 pb-2';
    title.textContent = initial ? 'Edit Todo Item' : 'Create New Todo';
    content.appendChild(title);
    
    const titleInput = document.createElement('input');
    titleInput.placeholder = 'Todo Title (required)';
    titleInput.value = initial?.title || '';
    titleInput.className = 'w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500';

    const noteInput = document.createElement('textarea');
    noteInput.placeholder = 'Notes / description...';
    noteInput.value = initial?.note || '';
    noteInput.className = 'w-full mt-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm h-24 focus:ring-indigo-500 focus:border-indigo-500';

    // Priority Select
    const priorityLabel = document.createElement('label');
    priorityLabel.className = 'block mt-2 text-xs text-gray-400 mb-1';
    priorityLabel.textContent = 'Priority Level';
    
    const prioritySelect = document.createElement('select');
    ['low','medium','high'].forEach(p=>{
      const opt = document.createElement('option'); 
      opt.value = p; 
      opt.textContent = p.charAt(0).toUpperCase() + p.slice(1);
      if (initial && initial.priority === p) opt.selected = true;
      prioritySelect.appendChild(opt);
    });
    prioritySelect.className = 'w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm';
    
    // Due Date Input
    const dueDateLabel = document.createElement('label');
    dueDateLabel.className = 'block mt-2 text-xs text-gray-400 mb-1';
    dueDateLabel.textContent = 'Due Date';
    
    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.value = initial?.dueDate || '';
    dueDateInput.className = 'w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500';
    
    // Tags Input
    const tagsLabel = document.createElement('label');
    tagsLabel.className = 'block mt-2 text-xs text-gray-400 mb-1';
    tagsLabel.textContent = 'Tags (comma-separated)';
    
    const tagsInput = document.createElement('input');
    tagsInput.placeholder = 'e.g., urgent, work, personal';
    tagsInput.value = initial?.tags ? initial.tags.join(', ') : '';
    tagsInput.className = 'w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500';

    const statusSelect = document.createElement('select');
    ['pending','in-progress','completed'].forEach(s=>{
      const opt = document.createElement('option'); 
      opt.value = s; 
      opt.textContent = s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ');
      if (initial && initial.status===s) opt.selected = true;
      statusSelect.appendChild(opt);
    });
    statusSelect.className = 'mt-2 w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm';

    const imgUrlInput = document.createElement('input');
    imgUrlInput.placeholder = 'Image URL (http/https)...'; 
    imgUrlInput.className = 'w-full mt-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.className = 'hidden'; 

    const previews = document.createElement('div'); 
    previews.className = 'mt-3 space-y-2 max-h-40 overflow-y-auto nice-scroll pr-1';

    const images = initial?.images ? [...initial.images] : [];
    
    function refreshPreviews() {
      previews.innerHTML = '';
      images.forEach((src, idx)=>{
        const row = document.createElement('div');
        row.className = 'flex items-center gap-2 p-1 bg-gray-700 rounded';
        const pimg = document.createElement('img');
        pimg.src = src;
        pimg.className = 'w-12 h-12 object-cover rounded flex-shrink-0 cursor-pointer border border-gray-600';
        pimg.addEventListener('click', ()=>Modal.showImage(src));

        const label = document.createElement('div'); 
        label.className = 'text-xs text-gray-300 truncate flex-1'; 
        label.textContent = src.length > 50 ? src.slice(0,25) + '...' + src.slice(-20) : src;
        
        const del = document.createElement('button'); 
        del.className = 'ml-auto text-xs px-2 py-1 bg-red-600/50 text-red-300 rounded hover:bg-red-600/70 transition flex-shrink-0'; 
        del.textContent = 'Remove';
        del.addEventListener('click', ()=>{ images.splice(idx,1); refreshPreviews(); });
        
        row.appendChild(pimg); 
        row.appendChild(label); 
        row.appendChild(del);
        previews.appendChild(row);
      });
    }
    refreshPreviews();

    imgUrlInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        const isLocalPath = /^\/|\w:\\|\/Users\/|\/home\//i.test(val);

        if (isLocalPath) {
            alert("Security Restriction: The browser cannot read file contents from a pasted path. Please confirm the file selection dialog to select the file manually.");
            e.target.value = ''; 
            fileInput.click();
        }
    });
    
    const addImgBtn = document.createElement('button');
    addImgBtn.className = 'px-3 py-1 bg-indigo-600 rounded-lg text-xs hover:bg-indigo-700 font-medium transition';
    addImgBtn.textContent = 'Add Remote URL';
    addImgBtn.addEventListener('click', ()=>{
      const val = imgUrlInput.value.trim();
      if (!val.startsWith('http')) return alert('Please enter a valid remote URL (http/https).');
      images.push(val);
      imgUrlInput.value = '';
      refreshPreviews();
    });
    
    const fileSelectBtn = document.createElement('button');
    fileSelectBtn.className = 'px-3 py-1 bg-green-600 rounded-lg text-xs hover:bg-green-700 font-medium transition';
    fileSelectBtn.textContent = 'Select Local Image';
    fileSelectBtn.addEventListener('click', ()=> fileInput.click());

    fileInput.addEventListener('change', (ev)=>{
      const f = ev.target.files && ev.target.files[0];
      if (!f || !f.type.startsWith('image/')) {
          alert('Please select an image file.');
          return;
      }
      
      const reader = new FileReader();
      reader.onload = e => {
        images.push(e.target.result); 
        refreshPreviews();
      };
      reader.readAsDataURL(f);
      ev.target.value = null;
    });
    
    const projectSelect = document.createElement('select');
    projectSelect.className = 'mt-2 w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm';
    State.getProjects().forEach(p => {
      const opt = document.createElement('option'); 
      opt.value = p.id; 
      opt.textContent = p.name;
      if (initial && initial.projectId === p.id) opt.selected = true;
      if (!initial && State.getSelectedProjectId() === p.id) opt.selected = true;
      projectSelect.appendChild(opt);
    });

    const btnRow = document.createElement('div');
    btnRow.className = 'mt-4 pt-4 border-t border-gray-700 flex gap-2 justify-end';
    const saveBtn = document.createElement('button');
    saveBtn.className = 'px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-white font-medium transition';
    saveBtn.textContent = 'Save Todo';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white transition';
    cancelBtn.textContent = 'Cancel';

    saveBtn.addEventListener('click', async ()=>{
      const titleVal = titleInput.value.trim();
      if (!titleVal) return alert('Todo title is required.');
      
      const note = noteInput.value.trim();
      const status = statusSelect.value;
      const priority = prioritySelect.value;
      const dueDate = dueDateInput.value;
      const tags = tagsInput.value.trim() ? tagsInput.value.split(',').map(t => t.trim()).filter(t => t) : [];
      const projectId = projectSelect.value || (State.getProjects()[0] && State.getProjects()[0].id) || null;
      if (!projectId) return alert('Create a project first');
      
      let todoId;
      let success;
      if (initial) {
        todoId = initial.id;
        const updatedTodo = {
          id: todoId,
          projectId: projectId,
          title: titleVal,
          note: note,
          status: status,
          priority: priority,
          dueDate: dueDate,
          tags: tags,
          images: images,
          createdAt: initial.createdAt
        };
        success = await Storage.saveTodo(updatedTodo, true);
        if (success) State.setSelectedTodoId(todoId);
      } else {
        todoId = Utils.uid();
        const newTodo = { 
          id: todoId, 
          projectId: projectId,
          title: titleVal, 
          note: note, 
          status: status,
          priority: priority,
          dueDate: dueDate,
          tags: tags,
          images: images, 
          createdAt: Math.floor(Date.now() / 1000)
        };
        success = await Storage.saveTodo(newTodo, false);
        if (success) State.setSelectedTodoId(todoId);
      }
      
      if (success) {
        // Save subtasks
        for (const st of subtasks) {
          if (!st.todoId) st.todoId = todoId;
          const isUpdate = initial && State.getSubtasks().some(s => s.id === st.id);
          await Storage.saveSubtask(st, isUpdate);
        }
        
        // Delete removed subtasks
        if (initial) {
          const oldSubtasks = State.getSubtasksByTodoId(initial.id);
          const removedSubtasks = oldSubtasks.filter(old => !subtasks.some(s => s.id === old.id));
          for (const removed of removedSubtasks) {
            await Storage.deleteSubtask(removed.id);
          }
        }
        
        Modal.close();
        Renderer.renderAll();
      }
    });

    cancelBtn.addEventListener('click', ()=> Modal.close());

    content.appendChild(titleInput);
    content.appendChild(noteInput);
    content.appendChild(projectSelect);
    content.appendChild(priorityLabel);
    content.appendChild(prioritySelect);
    content.appendChild(dueDateLabel);
    content.appendChild(dueDateInput);
    content.appendChild(tagsLabel);
    content.appendChild(tagsInput);
    content.appendChild(statusSelect);
    content.appendChild(imgUrlInput);
    
    const imgInputRow = document.createElement('div');
    imgInputRow.className = 'flex gap-2 mt-2';
    imgInputRow.appendChild(addImgBtn);
    imgInputRow.appendChild(fileSelectBtn);
    imgInputRow.appendChild(fileInput); 
    content.appendChild(imgInputRow);
    
    content.appendChild(previews);
    
    // Subtasks Section
    const subtasksLabel = document.createElement('label');
    subtasksLabel.className = 'block mt-4 text-xs text-gray-400 mb-2 font-semibold border-t border-gray-700 pt-4';
    subtasksLabel.textContent = '📋 Subtasks';
    
    const subtasksList = document.createElement('div');
    subtasksList.className = 'space-y-2 max-h-48 overflow-y-auto nice-scroll';
    
    const subtasks = initial ? State.getSubtasksByTodoId(initial.id) : [];
    
    function renderSubtasks() {
      subtasksList.innerHTML = '';
      subtasks.forEach((st, idx) => {
        const stRow = document.createElement('div');
        stRow.className = 'flex items-center gap-2 p-2 bg-gray-800 rounded';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = st.completed;
        checkbox.className = 'w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded';
        checkbox.addEventListener('change', () => {
          st.completed = checkbox.checked;
        });
        
        const stTitle = document.createElement('input');
        stTitle.value = st.title;
        stTitle.className = 'flex-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm';
        stTitle.addEventListener('input', (e) => {
          st.title = e.target.value;
        });
        
        const delBtn = document.createElement('button');
        delBtn.className = 'text-xs px-2 py-1 bg-red-600/50 text-red-300 rounded hover:bg-red-600/70 transition';
        delBtn.textContent = '×';
        delBtn.addEventListener('click', () => {
          subtasks.splice(idx, 1);
          renderSubtasks();
        });
        
        stRow.appendChild(checkbox);
        stRow.appendChild(stTitle);
        stRow.appendChild(delBtn);
        subtasksList.appendChild(stRow);
      });
      
      if (subtasks.length === 0) {
        subtasksList.innerHTML = '<div class="text-xs text-gray-500 p-2 text-center bg-gray-900 rounded">No subtasks yet</div>';
      }
    }
    renderSubtasks();
    
    const addSubtaskInput = document.createElement('input');
    addSubtaskInput.placeholder = 'Add a subtask...';
    addSubtaskInput.className = 'w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500 mt-2';
    
    const addSubtaskBtn = document.createElement('button');
    addSubtaskBtn.className = 'w-full mt-2 px-3 py-2 bg-gray-700 rounded-lg text-xs hover:bg-gray-600 transition';
    addSubtaskBtn.textContent = '+ Add Subtask';
    addSubtaskBtn.addEventListener('click', () => {
      const stTitle = addSubtaskInput.value.trim();
      if (!stTitle) return alert('Subtask title required');
      subtasks.push({
        id: Utils.uid(),
        todoId: initial ? initial.id : null,
        title: stTitle,
        completed: false,
        position: subtasks.length
      });
      addSubtaskInput.value = '';
      renderSubtasks();
    });
    
    content.appendChild(subtasksLabel);
    content.appendChild(subtasksList);
    content.appendChild(addSubtaskInput);
    content.appendChild(addSubtaskBtn);
    
    btnRow.appendChild(saveBtn);
    btnRow.appendChild(cancelBtn);
    content.appendChild(btnRow); 

    Modal.show(content);
  };

  return { showModal };
})();

const TodosRenderer = (() => {
  const render = () => {
    if (State.getCurrentView() !== 'projects') return;
    
    const container = Utils.qs('#todo-list');
    container.innerHTML = '';
    const filterStatus = Utils.qs('#filter-status').value;
    const search = Utils.qs('#search').value.trim().toLowerCase();
    const selectedProjectId = State.getSelectedProjectId();
    const selectedTodoId = State.getSelectedTodoId();

    const todos = State.getTodos()
      .filter(t => !selectedProjectId || t.projectId === selectedProjectId)
      .filter(t => filterStatus === 'all' ? true : t.status === filterStatus)
      .filter(t => {
        if (!search) return true;
        return (t.title + ' ' + (t.note||'') + ' ' + (t.id||'')).toLowerCase().includes(search);
      })
      .sort((a,b) => b.createdAt - a.createdAt);

    const template = document.getElementById('todo-item-template');

    todos.forEach(t => {
      const node = template.content.firstElementChild.cloneNode(true);
      
      if (selectedTodoId === t.id) {
        node.classList.add('ring-2', 'ring-indigo-500', 'bg-gray-700/90');
      }

      const cb = node.querySelector('.todo-complete');
      cb.checked = t.status === 'completed';
      cb.addEventListener('change', async () => {
        t.status = cb.checked ? 'completed' : 'pending';
        await Storage.saveTodo(t, true);
        Renderer.renderAll();
      });

      node.querySelector('.todo-title').textContent = t.title || 'Untitled';
      
      // Build subtitle with priority, due date, and subtasks progress
      let subtitle = `Created: ${Utils.formatDate(t.createdAt)}`;
      if (t.priority) {
        const priorityEmoji = t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢';
        subtitle += ` • ${priorityEmoji} ${t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}`;
      }
      if (t.dueDate) {
        const dueTimestamp = new Date(t.dueDate).getTime();
        const now = Date.now();
        const isOverdue = dueTimestamp < now && t.status !== 'completed';
        subtitle += ` • Due: ${t.dueDate}${isOverdue ? ' ⚠️' : ''}`;
      }
      const subtasksForTodo = State.getSubtasksByTodoId(t.id);
      if (subtasksForTodo.length > 0) {
        const completedSubtasks = subtasksForTodo.filter(s => s.completed).length;
        subtitle += ` • Subtasks: ${completedSubtasks}/${subtasksForTodo.length}`;
      }
      node.querySelector('.todo-sub').textContent = subtitle;
      
      const statusEl = node.querySelector('.todo-status');
      statusEl.textContent = t.status === 'completed' ? 'Completed' : (t.status==='in-progress'?'In Progress':'Pending');
      if (t.status === 'completed') statusEl.classList.add('bg-green-600', 'text-white'); 
      else if (t.status === 'in-progress') statusEl.classList.add('bg-yellow-500', 'text-black'); 
      else statusEl.classList.add('bg-gray-600', 'text-white');

      const actions = node.querySelector('.todo-actions');
      const openBtn = document.createElement('button');
      openBtn.className = 'text-xs px-2 py-1 bg-indigo-600 rounded-md hover:bg-indigo-700 text-white transition';
      openBtn.textContent = 'View';
      openBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        State.setSelectedTodoId(t.id);
        Renderer.renderAll();
      });
      
      const editBtn = document.createElement('button');
      editBtn.className = 'text-xs px-2 py-1 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        TodosManager.showModal(t.id);
      });
      actions.appendChild(openBtn);
      actions.appendChild(editBtn);

      const thumbWrap = node.querySelector('.todo-thumb');
      const imgTag = thumbWrap.querySelector('img');
      if (t.images && t.images.length) {
        thumbWrap.classList.remove('hidden');
        imgTag.src = t.images[0];
        imgTag.alt = t.title;
        imgTag.addEventListener('click', (e) => {
          e.stopPropagation();
          Modal.showImage(t.images[0], t.title);
        });
      } else {
        thumbWrap.classList.add('hidden');
      }
      
      const excerpt = node.querySelector('.todo-excerpt');
      excerpt.innerHTML = '';
      
      // Add tags if present
      if (t.tags && t.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'flex flex-wrap gap-1 mb-2';
        t.tags.forEach(tag => {
          const tagPill = document.createElement('span');
          tagPill.className = 'px-2 py-0.5 bg-indigo-600/30 text-indigo-300 text-xs rounded-full border border-indigo-500/50';
          tagPill.textContent = tag;
          tagsContainer.appendChild(tagPill);
        });
        excerpt.appendChild(tagsContainer);
      }
      
      // Add note text
      const noteText = document.createElement('div');
      noteText.textContent = t.note ? (t.note.length > 100 ? t.note.slice(0,100)+'…' : t.note) : '';
      excerpt.appendChild(noteText);

      node.addEventListener('click', (e) => {
        if (e.target.closest('button, input, img')) return;
        State.setSelectedTodoId(t.id);
        Renderer.renderAll();
      });

      container.appendChild(node);
    });

    if (todos.length === 0) {
      container.innerHTML = '<div class="text-sm text-gray-500 p-6 text-center bg-gray-850 rounded-xl">No todos match the current view/filters.</div>';
    }
  };

  return { render };
})();

const DetailsRenderer = (() => {
  const render = () => {
    const detailCard = Utils.qs('#detail-card');
    const detailEmpty = Utils.qs('#detail-empty');
    const selectedTodoId = State.getSelectedTodoId();
    
    if (!selectedTodoId) {
      detailCard.classList.add('hidden');
      detailEmpty.classList.remove('hidden');
      return;
    }
    
    const t = State.getTodos().find(x => x.id === selectedTodoId);
    if (!t) { 
      State.setSelectedTodoId(null); 
      render(); 
      return; 
    }
    
    detailCard.classList.remove('hidden');
    detailEmpty.classList.add('hidden');
    
    Utils.qs('#detail-title').textContent = t.title;
    
    // Build detailed meta with all fields
    let metaText = `Status: ${t.status.charAt(0).toUpperCase() + t.status.slice(1).replace('-', ' ')}`;
    if (t.priority) {
      const priorityEmoji = t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢';
      metaText += ` • Priority: ${priorityEmoji} ${t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}`;
    }
    if (t.dueDate) {
      const dueTimestamp = new Date(t.dueDate).getTime();
      const now = Date.now();
      const isOverdue = dueTimestamp < now && t.status !== 'completed';
      metaText += ` • Due: ${t.dueDate}${isOverdue ? ' ⚠️ OVERDUE' : ''}`;
    }
    metaText += ` • Created: ${Utils.formatDate(t.createdAt)}`;
    
    Utils.qs('#detail-meta').textContent = metaText;
    
    const imageArea = Utils.qs('#detail-image-area');
    imageArea.innerHTML = '';
    if (t.images && t.images.length) {
      t.images.forEach(src => {
        const thumb = document.createElement('div');
        thumb.className = 'rounded-lg overflow-hidden border border-gray-700 shadow-inner';
        const img = document.createElement('img');
        img.src = src;
        img.className = 'w-full h-36 object-contain cursor-pointer bg-gray-950 hover:opacity-90 transition';
        img.addEventListener('click', () => Modal.showImage(src, t.title));
        thumb.appendChild(img);
        imageArea.appendChild(thumb);
      });
    } else {
      imageArea.innerHTML = '<div class="text-sm text-gray-500 p-2 text-center bg-gray-900 rounded">No images attached.</div>';
    }
    
    const detailNotes = Utils.qs('#detail-notes');
    detailNotes.innerHTML = '';
    
    // Display tags
    if (t.tags && t.tags.length > 0) {
      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'flex flex-wrap gap-2 mb-3 pb-3 border-b border-gray-700';
      t.tags.forEach(tag => {
        const tagPill = document.createElement('span');
        tagPill.className = 'px-3 py-1 bg-indigo-600/30 text-indigo-300 text-sm rounded-full border border-indigo-500/50';
        tagPill.textContent = tag;
        tagsDiv.appendChild(tagPill);
      });
      detailNotes.appendChild(tagsDiv);
    }
    
    // Display subtasks
    const subtasksForDetail = State.getSubtasksByTodoId(t.id);
    if (subtasksForDetail.length > 0) {
      const subtasksDiv = document.createElement('div');
      subtasksDiv.className = 'mb-3 pb-3 border-b border-gray-700';
      const subtasksTitle = document.createElement('div');
      subtasksTitle.className = 'text-sm font-semibold text-gray-400 mb-2';
      const completedCount = subtasksForDetail.filter(s => s.completed).length;
      subtasksTitle.textContent = `📋 Subtasks (${completedCount}/${subtasksForDetail.length} completed)`;
      subtasksDiv.appendChild(subtasksTitle);
      
      subtasksForDetail.forEach(st => {
        const stRow = document.createElement('div');
        stRow.className = 'flex items-center gap-2 py-1';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = st.completed;
        checkbox.disabled = true;
        checkbox.className = 'w-4 h-4';
        const stText = document.createElement('span');
        stText.className = `text-sm ${st.completed ? 'line-through text-gray-500' : 'text-gray-300'}`;
        stText.textContent = st.title;
        stRow.appendChild(checkbox);
        stRow.appendChild(stText);
        subtasksDiv.appendChild(stRow);
      });
      detailNotes.appendChild(subtasksDiv);
    }
    
    // Display note text
    const noteText = document.createElement('div');
    noteText.textContent = t.note || '(No description)';
    detailNotes.appendChild(noteText);
    
    Utils.qs('#edit-todo').onclick = () => TodosManager.showModal(t.id);
    Utils.qs('#delete-todo').onclick = async () => {
      if (!confirm(`Delete todo "${t.title}"?`)) return;
      const success = await Storage.deleteTodo(t.id);
      if (success) {
        if (State.getSelectedTodoId() === t.id) State.setSelectedTodoId(null);
        Renderer.renderAll();
      }
    };
    
    Utils.qs('#toggle-completed').textContent = t.status === 'completed' ? 'Mark Pending' : 'Mark Complete';
    Utils.qs('#toggle-completed').className = `flex-1 px-3 py-2 rounded-lg text-white text-sm font-medium transition ${t.status === 'completed' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`;
    Utils.qs('#toggle-completed').onclick = async () => {
      t.status = t.status === 'completed' ? 'pending' : 'completed';
      await Storage.saveTodo(t, true);
      Renderer.renderAll();
    };
  };

  return { render };
})();

const HeaderRenderer = (() => {
  const render = () => {
    const selectedProjectId = State.getSelectedProjectId();
    const allTodos = State.getTodos().filter(t => !selectedProjectId || t.projectId === selectedProjectId);
    
    const total = allTodos.length;
    const pending = allTodos.filter(t => t.status === 'pending').length;
    const progress = allTodos.filter(t => t.status === 'in-progress').length;
    const completed = allTodos.filter(t => t.status === 'completed').length;
    
    Utils.qs('#count-total').textContent = total;
    Utils.qs('#count-pending').textContent = pending;
    Utils.qs('#count-progress').textContent = progress;
    Utils.qs('#count-completed').textContent = completed;

    const proj = State.getProjects().find(p => p.id === selectedProjectId);
    if (proj) {
      Utils.qs('#project-title').textContent = proj.name;
      Utils.qs('#project-sub').textContent = `Project • ${proj.name} (${total} todos)`;
    } else {
      Utils.qs('#project-title').textContent = 'All Todos';
      Utils.qs('#project-sub').textContent = `Showing todos from all projects (${total} todos)`;
    }
  };

  return { render };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TodosManager, TodosRenderer, DetailsRenderer, HeaderRenderer };
}
