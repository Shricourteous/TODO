/**
 * Storage Module
 * Handles all API communication with backend database
 */

const Storage = (() => {
  const API_BASE = 'api.php';
  
  const apiCall = async (action, data = null, method = 'GET') => {
    try {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }
      
      const url = `${API_BASE}?action=${action}`;
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const load = async () => {
    try {
      Utils.showLoading(true);
      const result = await apiCall('get_all_data');
      
      if (result.success) {
        console.log('Data loaded from API:', result.data);
        console.log('Projects:', result.data.projects.length);
        console.log('Todos:', result.data.todos.length);
        console.log('Notes:', result.data.notes.length);
        
        State.setData(result.data);
        return true;
      } else {
        throw new Error(result.error || 'Failed to load data');
      }
    } catch (error) {
      Utils.showToast('Error loading data: ' + error.message, 'error');
      console.error('Load error:', error);
      return false;
    } finally {
      Utils.showLoading(false);
    }
  };

  const saveProject = async (project, isUpdate = false) => {
    try {
      const action = isUpdate ? 'update_project' : 'create_project';
      const result = await apiCall(action, project, 'POST');
      
      if (result.success) {
        if (isUpdate) {
          State.updateProject(project.id, project);
        } else {
          State.addProject(project);
        }
        return true;
      }
      return false;
    } catch (error) {
      Utils.showToast('Error saving project', 'error');
      console.error('Save project error:', error);
      return false;
    }
  };

  const deleteProject = async (id) => {
    try {
      const result = await apiCall('delete_project', { id }, 'POST');
      
      if (result.success) {
        State.removeProject(id);
        return true;
      }
      return false;
    } catch (error) {
      Utils.showToast('Error deleting project', 'error');
      console.error('Delete project error:', error);
      return false;
    }
  };

  const saveTodo = async (todo, isUpdate = false) => {
    try {
      const action = isUpdate ? 'update_todo' : 'create_todo';
      const result = await apiCall(action, todo, 'POST');
      
      if (result.success) {
        if (isUpdate) {
          State.updateTodo(todo.id, todo);
        } else {
          State.addTodo(todo);
        }
        return true;
      }
      return false;
    } catch (error) {
      Utils.showToast('Error saving todo', 'error');
      console.error('Save todo error:', error);
      return false;
    }
  };

  const deleteTodo = async (id) => {
    try {
      const result = await apiCall('delete_todo', { id }, 'POST');
      
      if (result.success) {
        State.removeTodo(id);
        return true;
      }
      return false;
    } catch (error) {
      Utils.showToast('Error deleting todo', 'error');
      console.error('Delete todo error:', error);
      return false;
    }
  };

  const saveNote = async (note, isUpdate = false) => {
    try {
      const action = isUpdate ? 'update_note' : 'create_note';
      const result = await apiCall(action, note, 'POST');
      
      if (result.success) {
        if (isUpdate) {
          State.updateNote(note.id, note);
        } else {
          State.addNote(note);
        }
        return true;
      }
      return false;
    } catch (error) {
      Utils.showToast('Error saving note', 'error');
      console.error('Save note error:', error);
      return false;
    }
  };

  const deleteNote = async (id) => {
    try {
      const result = await apiCall('delete_note', { id }, 'POST');
      
      if (result.success) {
        State.removeNote(id);
        return true;
      }
      return false;
    } catch (error) {
      Utils.showToast('Error deleting note', 'error');
      console.error('Delete note error:', error);
      return false;
    }
  };

  const exportJSON = async () => {
    try {
      const result = await apiCall('export_data');
      
      if (result.success) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todo_export_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Utils.showToast('Data exported successfully', 'success');
      }
    } catch (error) {
      Utils.showToast('Error exporting data', 'error');
      console.error('Export error:', error);
    }
  };

  const importJSON = async (file, mode, callback) => {
    try {
      Utils.showLoading(true);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          const result = await apiCall('import_data', {
            data: importedData,
            mode: mode
          }, 'POST');
          
          if (result.success) {
            await load();
            Utils.showToast('Data imported successfully', 'success');
            if (callback) callback();
          }
        } catch (error) {
          Utils.showToast('Error importing data: Invalid file', 'error');
          console.error('Import error:', error);
        } finally {
          Utils.showLoading(false);
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      Utils.showToast('Error importing data', 'error');
      console.error('Import error:', error);
      Utils.showLoading(false);
    }
  };

  const saveSubtask = async (subtask, isUpdate = false) => {
    try {
      const action = isUpdate ? 'update_subtask' : 'create_subtask';
      const result = await apiCall(action, subtask, 'POST');
      
      if (result.success) {
        if (isUpdate) {
          State.updateSubtask(subtask.id, subtask);
        } else {
          State.addSubtask(subtask);
        }
        return true;
      }
      return false;
    } catch (error) {
      Utils.showToast('Error saving subtask', 'error');
      console.error('Save subtask error:', error);
      return false;
    }
  };

  const deleteSubtask = async (id) => {
    try {
      const result = await apiCall('delete_subtask', { id }, 'POST');
      
      if (result.success) {
        State.removeSubtask(id);
        return true;
      }
      return false;
    } catch (error) {
      Utils.showToast('Error deleting subtask', 'error');
      console.error('Delete subtask error:', error);
      return false;
    }
  };

  const clearAll = async (callback) => {
    if (!confirm('Are you absolutely sure you want to clear ALL projects, todos, and notes? This action cannot be undone.')) {
      return;
    }
    
    try {
      Utils.showLoading(true);
      const result = await apiCall('clear_all', {}, 'POST');
      
      if (result.success) {
        await load();
        State.setSelectedProjectId('p_default');
        State.setSelectedTodoId(null);
        Utils.showToast('All data cleared', 'success');
        if (callback) callback();
      }
    } catch (error) {
      Utils.showToast('Error clearing data', 'error');
      console.error('Clear error:', error);
    } finally {
      Utils.showLoading(false);
    }
  };

  return { 
    load, 
    saveProject, 
    deleteProject,
    saveTodo, 
    deleteTodo,
    saveNote, 
    deleteNote,
    saveSubtask,
    deleteSubtask,
    exportJSON, 
    importJSON, 
    clearAll 
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}
