/**
 * Notes Module
 * Notes management and rendering
 */

const NotesManager = (() => {
  const create = async (content) => {
    const newNote = { 
      id: Utils.uid(), 
      content: content.trim(), 
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    const success = await Storage.saveNote(newNote, false);
    return success;
  };

  const update = async (noteId, content) => {
    const note = State.getNotes().find(n => n.id === noteId);
    if (note) {
      note.content = content.trim();
      return await Storage.saveNote(note, true);
    }
    return false;
  };

  const remove = async (noteId) => {
    if (!confirm('Delete this quick note?')) return false;
    return await Storage.deleteNote(noteId);
  };

  const showModal = (noteId = null) => {
    const isEdit = !!noteId;
    const note = isEdit ? State.getNotes().find(n => n.id === noteId) : null;

    const content = document.createElement('div');
    content.className = 'p-5';
    
    const title = document.createElement('h3');
    title.className = 'text-lg font-bold mb-3 text-indigo-300';
    title.textContent = isEdit ? 'Edit Quick Note' : 'New Quick Note';
    content.appendChild(title);

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Your quick thoughts or ideas...';
    textarea.value = note ? note.content : '';
    textarea.className = 'w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm h-32 focus:ring-green-500 focus:border-green-500';
    content.appendChild(textarea);

    const btnRow = document.createElement('div');
    btnRow.className = 'mt-4 flex gap-2 justify-end';
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 text-white font-medium transition';
    saveBtn.textContent = 'Save Note';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white transition';
    cancelBtn.textContent = 'Cancel';

    saveBtn.addEventListener('click', async () => {
      const newContent = textarea.value.trim();
      if (!newContent) return alert('Note content cannot be empty.');
      
      let success;
      if (isEdit) {
        success = await update(noteId, newContent);
      } else {
        success = await create(newContent);
      }
      
      if (success) {
        Modal.close();
        NotesRenderer.render();
      }
    });

    cancelBtn.addEventListener('click', () => Modal.close());
    
    btnRow.appendChild(saveBtn);
    btnRow.appendChild(cancelBtn);
    content.appendChild(btnRow); 

    Modal.show(content);
  };

  return { create, update, remove, showModal };
})();

const NotesRenderer = (() => {
  const render = () => {
    if (State.getCurrentView() !== 'notes') return;

    const container = Utils.qs('#notes-list');
    container.innerHTML = '';
    const search = Utils.qs('#search').value.trim().toLowerCase();
    
    const notes = State.getNotes()
      .filter(n => !search || n.content.toLowerCase().includes(search))
      .sort((a,b) => b.createdAt - a.createdAt);

    const template = document.getElementById('note-item-template');

    notes.forEach(note => {
      const node = template.content.firstElementChild.cloneNode(true);
      node.querySelector('.note-content').textContent = note.content;
      node.querySelector('.note-date').textContent = Utils.formatDate(note.createdAt);

      node.querySelector('.edit-note').addEventListener('click', (e) => {
        e.stopPropagation();
        NotesManager.showModal(note.id);
      });

      node.querySelector('.delete-note').addEventListener('click', async (e) => {
        e.stopPropagation();
        const success = await NotesManager.remove(note.id);
        if (success) render();
      });
      
      node.addEventListener('click', () => NotesManager.showModal(note.id));
      container.appendChild(node);
    });
    
    if (notes.length === 0) {
      container.innerHTML = `<div class="text-sm text-gray-500 p-4 text-center">
        ${search ? 'No notes match your search.' : 'Click "Add Note" to create your first quick note.'}
      </div>`;
    }
  };

  return { render };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NotesManager, NotesRenderer };
}
