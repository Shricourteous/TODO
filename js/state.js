/**
 * State Module
 * Centralized application state management
 */

const State = (() => {
  const state = {
    data: { projects: [], todos: [], notes: [], subtasks: [] },
    selectedProjectId: null,
    selectedTodoId: null,
    currentView: 'projects',
    darkMode: true
  };

  return {
    state: state, // Expose state object
    getData: () => state.data,
    setData: (newData) => { state.data = newData; },
    
    getProjects: () => state.data.projects,
    getTodos: () => state.data.todos,
    getNotes: () => state.data.notes,
    getSubtasks: () => state.data.subtasks,
    
    addProject: (project) => state.data.projects.push(project),
    updateProject: (id, updates) => {
      const project = state.data.projects.find(p => p.id === id);
      if (project) Object.assign(project, updates);
    },
    removeProject: (id) => {
      state.data.projects = state.data.projects.filter(p => p.id !== id);
      state.data.todos = state.data.todos.filter(t => t.projectId !== id);
    },
    
    addTodo: (todo) => state.data.todos.push(todo),
    updateTodo: (id, updates) => {
      const todo = state.data.todos.find(t => t.id === id);
      if (todo) Object.assign(todo, updates);
    },
    removeTodo: (id) => {
      state.data.todos = state.data.todos.filter(t => t.id !== id);
    },
    
    addNote: (note) => state.data.notes.push(note),
    updateNote: (id, updates) => {
      const note = state.data.notes.find(n => n.id === id);
      if (note) Object.assign(note, updates);
    },
    removeNote: (id) => {
      state.data.notes = state.data.notes.filter(n => n.id !== id);
    },
    
    // Subtask methods
    addSubtask: (subtask) => state.data.subtasks.push(subtask),
    updateSubtask: (id, updates) => {
      const subtask = state.data.subtasks.find(s => s.id === id);
      if (subtask) Object.assign(subtask, updates);
    },
    removeSubtask: (id) => {
      state.data.subtasks = state.data.subtasks.filter(s => s.id !== id);
    },
    removeSubtasksByTodoId: (todoId) => {
      state.data.subtasks = state.data.subtasks.filter(s => s.todoId !== todoId);
    },
    getSubtasksByTodoId: (todoId) => {
      return state.data.subtasks.filter(s => s.todoId === todoId).sort((a, b) => a.position - b.position);
    },
    
    getSelectedProjectId: () => state.selectedProjectId,
    setSelectedProjectId: (id) => { state.selectedProjectId = id; },
    
    getSelectedTodoId: () => state.selectedTodoId,
    setSelectedTodoId: (id) => { state.selectedTodoId = id; },
    
    getCurrentView: () => state.currentView,
    setCurrentView: (view) => { state.currentView = view; },
    
    isDark: () => state.darkMode,
    toggleDark: () => { state.darkMode = !state.darkMode; return state.darkMode; }
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = State;
}
