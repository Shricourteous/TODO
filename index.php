<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>TodoComplete — Professional Task Manager</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    // Suppress Tailwind CDN warning
    tailwind.config = {
      darkMode: 'class',
      devtools: false,
      theme: {
        extend: {
          colors: {
            'gray-950': '#0d1117',
            'gray-850': '#161b22',
            'indigo-600': '#4f46e5',
            'indigo-700': '#4338ca',
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
          },
        }
      }
    }
  </script>
  <script>
    // Suppress production warning
    window.tailwind = window.tailwind || {};
    window.tailwind.disableDevWarnings = true;
  </script>
  
  <!-- Custom Styles -->
  <link rel="stylesheet" href="styles.css">
</head>
<body style="background-color: var(--bg-primary); color: var(--text-primary);" class="antialiased font-sans">
  <div id="app" class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-72 border-r p-5 hidden md:flex flex-col shadow-lg" style="background-color: var(--bg-secondary); border-color: var(--border-primary);">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <h1 class="text-lg font-bold" style="color: var(--text-primary);">TodoComplete</h1>
        </div>
        <button id="toggle-theme" title="Toggle theme" class="p-2 rounded-lg transition-all duration-200 hover:scale-110" style="background-color: var(--bg-tertiary);">
          <svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" style="color: var(--text-secondary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path id="theme-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </button>
      </div>

      <div class="mb-5 flex rounded-xl p-1.5 shadow-sm" style="background-color: var(--bg-tertiary);">
        <button id="switch-projects" data-view="projects" class="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white shadow-md transition-all duration-200 hover:bg-indigo-700">
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
            </svg>
            Projects
          </span>
        </button>
        <button id="switch-notes" data-view="notes" class="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200" style="color: var(--text-secondary);">
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Notes
          </span>
        </button>
      </div>
      
      <div class="mb-5">
        <label class="block text-xs font-semibold mb-2" style="color: var(--text-secondary);">SEARCH</label>
        <div class="relative">
          <input id="search" type="text" placeholder="Type to search..." class="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm shadow-sm transition-all duration-200" style="background-color: var(--bg-primary); border: 1px solid var(--border-primary); color: var(--text-primary);">
          <svg class="w-4 h-4 absolute left-3 top-3.5" style="color: var(--text-tertiary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
      
      <div id="sidebar-content" class="flex-1 flex flex-col space-y-4 overflow-hidden min-h-0">
        <div id="projects-view" class="space-y-3 flex flex-col min-h-0">
          <div class="flex items-center justify-between flex-shrink-0">
            <span class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-tertiary);">Projects</span>
            <button id="add-project" class="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                New
              </span>
            </button>
          </div>
          <div id="project-list" class="space-y-2 flex-1 overflow-y-auto nice-scroll pr-2 min-h-0"></div>
        </div>

        <div id="notes-view" class="space-y-3 hidden flex flex-col flex-1 min-h-0">
          <div class="flex items-center justify-between flex-shrink-0">
            <span class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-tertiary);">Quick Notes</span>
            <button id="add-note" class="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Add
              </span>
            </button>
          </div>
          <div id="notes-list" class="space-y-2 flex-1 overflow-y-auto nice-scroll pr-2 min-h-0"></div>
        </div>
      </div>
      
      <div class="mt-auto pt-4" style="border-top: 1px solid var(--border-primary);">
        <div class="space-y-3">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-tertiary);">Quick Actions</span>
            <div class="text-xs px-2 py-0.5 rounded-full" style="background-color: var(--bg-tertiary); color: var(--text-tertiary);">v3.0</div>
          </div>
          <div class="space-y-2">
            <button id="export-json" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm" style="background-color: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-primary);">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Export Data
            </button>
            <label class="w-full block">
              <input id="import-file" type="file" accept="application/json" class="hidden">
              <div id="import-btn" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium shadow-sm" style="background-color: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-primary);">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L9 8m4-4v12"/>
                </svg>
                Import Data
              </div>
            </label>
            <button id="clear-all" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm" style="background-color: rgba(239, 68, 68, 0.1); color: var(--error); border: 1px solid var(--error);">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-8 overflow-y-auto" style="background-color: var(--bg-primary);">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1800px] mx-auto">
        <div class="lg:col-span-8 xl:col-span-9">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 id="project-title" class="text-4xl font-bold mb-1" style="color: var(--text-primary);">All Todos</h2>
              <div id="project-sub" class="text-sm font-medium" style="color: var(--text-secondary);">Choose or create a project</div>
            </div>

            <div class="flex items-center gap-3">
              <select id="filter-status" class="px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm cursor-pointer transition-all duration-200" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary); color: var(--text-primary);">
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button id="new-todo-btn" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Add Todo
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            <div class="px-4 md:px-5 py-3 md:py-4 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <div class="flex items-center justify-between mb-2">
                <div class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-tertiary);">Total</div>
                <svg class="w-4 h-4" style="color: var(--text-tertiary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div id="count-total" class="font-bold text-3xl" style="color: var(--text-primary);">0</div>
            </div>
            <div class="px-5 py-4 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <div class="flex items-center justify-between mb-2">
                <div class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-tertiary);">Pending</div>
                <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div id="count-pending" class="font-bold text-3xl text-yellow-500">0</div>
            </div>
            <div class="px-5 py-4 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <div class="flex items-center justify-between mb-2">
                <div class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-tertiary);">In Progress</div>
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div id="count-progress" class="font-bold text-3xl text-blue-500">0</div>
            </div>
            <div class="px-5 py-4 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <div class="flex items-center justify-between mb-2">
                <div class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-tertiary);">Completed</div>
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div id="count-completed" class="font-bold text-3xl text-green-500">0</div>
            </div>
          </div>

          <div id="todo-list" class="space-y-3 overflow-y-auto nice-scroll pr-2"></div>
        </div>

        <!-- Details Sidebar -->
        <aside class="lg:col-span-4 xl:col-span-3">
          <div class="rounded-2xl p-5 md:p-6 sticky top-6 shadow-lg" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
            <h3 class="text-base md:text-lg font-bold mb-4 pb-3 flex items-center gap-2" style="border-bottom: 2px solid var(--border-primary); color: var(--text-primary);">
              <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Todo Details
            </h3>
            <div id="detail-empty" class="text-sm py-8 text-center" style="color: var(--text-tertiary);">
              <svg class="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="font-medium">No todo selected</p>
              <p class="text-xs mt-1">Click on a todo to view details</p>
            </div>

            <div id="detail-card" class="hidden">
              <div class="mb-5">
                <div id="detail-title" class="font-bold text-xl mb-2" style="color: var(--text-primary);"></div>
                <div id="detail-meta" class="text-xs font-medium" style="color: var(--text-tertiary);"></div>
              </div>

              <div id="detail-image-area" class="mb-5 space-y-2"></div>

              <div id="detail-notes" class="mb-5 text-sm p-4 rounded-xl whitespace-pre-wrap" style="background-color: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-primary);"></div>

              <div class="grid grid-cols-2 gap-2">
                <button id="edit-todo" class="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2" style="background-color: #fbbf24; color: #000;">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit
                </button>
                <button id="delete-todo" class="px-4 py-2.5 bg-red-600 rounded-lg text-white text-sm font-semibold hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Delete
                </button>
                <button id="toggle-completed" class="col-span-2 px-4 py-2.5 bg-green-600 rounded-lg text-white text-sm font-semibold hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Toggle Complete
                </button>
              </div>
            </div>

            <hr class="my-5" style="border-color: var(--border-primary);">

            <div>
              <h4 class="text-sm font-bold mb-3 flex items-center gap-2" style="color: var(--text-secondary);">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Tips & Info
              </h4>
              <ul class="text-xs space-y-2" style="color: var(--text-tertiary);">
                <li class="flex items-start gap-2">
                  <svg class="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Upload local images for persistence
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Data stored in SQLite database
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Use Notes tab for quick thoughts
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>

  <!-- Modal Container -->
  <div id="modal-root"></div>

  <!-- Templates -->
  <template id="todo-item-template">
    <div class="todo-item rounded-xl p-5 flex gap-4 items-start cursor-pointer card-hover shadow-md" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <div class="flex-shrink-0 pt-1">
        <input type="checkbox" class="todo-complete h-5 w-5 text-green-500 rounded focus:ring-2 focus:ring-green-500 transition cursor-pointer" style="background-color: var(--bg-tertiary); border-color: var(--border-secondary);" />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="todo-title font-semibold text-lg mb-1" style="color: var(--text-primary);"></div>
            <div class="todo-sub text-xs font-medium" style="color: var(--text-tertiary);"></div>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="todo-status text-xs rounded-full px-3 py-1.5 font-bold uppercase tracking-wide"></div>
            <div class="todo-actions mt-3 space-x-1.5"></div>
          </div>
        </div>

        <div class="mt-4 flex items-start gap-4">
          <div class="todo-thumb w-20 h-20 rounded-lg overflow-hidden hidden flex-shrink-0 shadow-sm" style="background-color: var(--bg-tertiary); border: 1px solid var(--border-primary);">
            <img class="w-full h-full thumb" />
          </div>
          <div class="todo-excerpt text-sm leading-relaxed" style="color: var(--text-secondary);"></div>
        </div>
      </div>
    </div>
  </template>

  <template id="note-item-template">
    <div class="note-item rounded-xl p-4 space-y-3 cursor-pointer card-hover shadow-sm" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
        <div class="note-content text-sm leading-relaxed whitespace-pre-wrap" style="color: var(--text-primary);"></div>
        <div class="flex justify-between items-center pt-3" style="border-top: 1px solid var(--border-primary);">
            <div class="note-date text-xs font-medium" style="color: var(--text-tertiary);"></div>
            <div class="note-actions space-x-2">
                <button class="edit-note text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md" style="background-color: #fbbf24; color: #000;">Edit</button>
                <button class="delete-note text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md">Delete</button>
            </div>
        </div>
    </div>
  </template>

  <!-- JavaScript Modules (Load in dependency order) -->
  <script src="js/utils.js"></script>
  <script src="js/state.js"></script>
  <script src="js/storage.js"></script>
  <script src="js/modal.js"></script>
  <script src="js/theme.js"></script>
  <script src="js/view.js"></script>
  <script src="js/notes.js"></script>
  <script src="js/projects.js"></script>
  <script src="js/todos.js"></script>
  <script src="js/renderers.js"></script>
  <script src="js/eventHandlers.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
