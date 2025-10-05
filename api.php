<?php
/**
 * API Endpoint for TodoComplete App
 * Handles all CRUD operations for projects, todos, and notes
 */

header('Content-Type: application/json');
require_once 'database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    // Get request method and action
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';

    // Route requests
    switch ($action) {
        case 'get_all_data':
            getAllData($db);
            break;
        
        case 'create_project':
            createProject($db);
            break;
        
        case 'update_project':
            updateProject($db);
            break;
        
        case 'delete_project':
            deleteProject($db);
            break;
        
        case 'create_todo':
            createTodo($db);
            break;
        
        case 'update_todo':
            updateTodo($db);
            break;
        
        case 'delete_todo':
            deleteTodo($db);
            break;
        
        case 'create_note':
            createNote($db);
            break;
        
        case 'update_note':
            updateNote($db);
            break;
        
        case 'delete_note':
            deleteNote($db);
            break;
        
        case 'create_subtask':
            createSubtask($db);
            break;
        
        case 'update_subtask':
            updateSubtask($db);
            break;
        
        case 'delete_subtask':
            deleteSubtask($db);
            break;
        
        case 'export_data':
            exportData($db);
            break;
        
        case 'import_data':
            importData($db);
            break;
        
        case 'clear_all':
            clearAll($db);
            break;
        
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getAllData($db) {
    $projects = $db->query("SELECT * FROM projects ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
    $todos = $db->query("SELECT * FROM todos ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
    $notes = $db->query("SELECT * FROM notes ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
    $subtasks = $db->query("SELECT * FROM subtasks ORDER BY position ASC")->fetchAll(PDO::FETCH_ASSOC);
    
    // Normalize field names and parse JSON
    foreach ($todos as &$todo) {
        // Convert snake_case to camelCase for JavaScript
        $todo['projectId'] = $todo['project_id'];
        unset($todo['project_id']);
        
        $todo['images'] = json_decode($todo['images'] ?? '[]', true);
        $todo['tags'] = json_decode($todo['tags'] ?? '[]', true);
        $todo['priority'] = $todo['priority'] ?? 'medium';
        $todo['dueDate'] = $todo['due_date'];
        unset($todo['due_date']);
        $todo['createdAt'] = (int)$todo['created_at'];
        unset($todo['created_at']);
    }
    
    // Normalize subtasks
    foreach ($subtasks as &$subtask) {
        $subtask['todoId'] = $subtask['todo_id'];
        unset($subtask['todo_id']);
        $subtask['completed'] = (bool)$subtask['completed'];
        $subtask['createdAt'] = (int)$subtask['created_at'];
        unset($subtask['created_at']);
    }
    
    foreach ($notes as &$note) {
        $note['createdAt'] = (int)$note['created_at'];
        unset($note['created_at']);
    }
    
    foreach ($projects as &$project) {
        $project['createdAt'] = (int)$project['created_at'];
        unset($project['created_at']);
    }
    
    echo json_encode([
        'success' => true,
        'data' => [
            'projects' => $projects,
            'todos' => $todos,
            'notes' => $notes,
            'subtasks' => $subtasks
        ]
    ]);
}

function createProject($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $db->prepare("INSERT INTO projects (id, name) VALUES (?, ?)");
    $stmt->execute([$data['id'], $data['name']]);
    
    echo json_encode(['success' => true, 'id' => $data['id']]);
}

function updateProject($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $db->prepare("UPDATE projects SET name = ? WHERE id = ?");
    $stmt->execute([$data['name'], $data['id']]);
    
    echo json_encode(['success' => true]);
}

function deleteProject($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Delete associated todos first
    $stmt = $db->prepare("DELETE FROM todos WHERE project_id = ?");
    $stmt->execute([$data['id']]);
    
    // Delete project
    $stmt = $db->prepare("DELETE FROM projects WHERE id = ?");
    $stmt->execute([$data['id']]);
    
    echo json_encode(['success' => true]);
}

function createTodo($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Handle both camelCase and snake_case
    $projectId = $data['projectId'] ?? $data['project_id'] ?? null;
    $createdAt = $data['createdAt'] ?? $data['created_at'] ?? time();
    $dueDate = $data['dueDate'] ?? $data['due_date'] ?? null;
    
    $stmt = $db->prepare("
        INSERT INTO todos (id, project_id, title, note, status, priority, due_date, tags, images, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['id'],
        $projectId,
        $data['title'],
        $data['note'] ?? '',
        $data['status'] ?? 'pending',
        $data['priority'] ?? 'medium',
        $dueDate,
        json_encode($data['tags'] ?? []),
        json_encode($data['images'] ?? []),
        $createdAt
    ]);
    
    echo json_encode(['success' => true, 'id' => $data['id']]);
}

function updateTodo($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Handle both camelCase and snake_case
    $projectId = $data['projectId'] ?? $data['project_id'] ?? null;
    $dueDate = $data['dueDate'] ?? $data['due_date'] ?? null;
    
    $stmt = $db->prepare("
        UPDATE todos 
        SET project_id = ?, title = ?, note = ?, status = ?, priority = ?, due_date = ?, tags = ?, images = ?
        WHERE id = ?
    ");
    $stmt->execute([
        $projectId,
        $data['title'],
        $data['note'] ?? '',
        $data['status'],
        $data['priority'] ?? 'medium',
        $dueDate,
        json_encode($data['tags'] ?? []),
        json_encode($data['images'] ?? []),
        $data['id']
    ]);
    
    echo json_encode(['success' => true]);
}

function deleteTodo($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $db->prepare("DELETE FROM todos WHERE id = ?");
    $stmt->execute([$data['id']]);
    
    echo json_encode(['success' => true]);
}

function createNote($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $db->prepare("INSERT INTO notes (id, content, created_at) VALUES (?, ?, ?)");
    $stmt->execute([
        $data['id'],
        $data['content'],
        $data['createdAt'] ?? time()
    ]);
    
    echo json_encode(['success' => true, 'id' => $data['id']]);
}

function updateNote($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $db->prepare("UPDATE notes SET content = ? WHERE id = ?");
    $stmt->execute([$data['content'], $data['id']]);
    
    echo json_encode(['success' => true]);
}

function deleteNote($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $db->prepare("DELETE FROM notes WHERE id = ?");
    $stmt->execute([$data['id']]);
    
    echo json_encode(['success' => true]);
}

function exportData($db) {
    $projects = $db->query("SELECT * FROM projects")->fetchAll(PDO::FETCH_ASSOC);
    $todos = $db->query("SELECT * FROM todos")->fetchAll(PDO::FETCH_ASSOC);
    $notes = $db->query("SELECT * FROM notes")->fetchAll(PDO::FETCH_ASSOC);
    
    // Parse JSON fields
    foreach ($todos as &$todo) {
        $todo['images'] = json_decode($todo['images'] ?? '[]', true);
    }
    
    echo json_encode([
        'success' => true,
        'data' => [
            'projects' => $projects,
            'todos' => $todos,
            'notes' => $notes
        ]
    ]);
}

function importData($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    $importData = $data['data'];
    $mode = $data['mode'] ?? 'replace'; // 'replace' or 'merge'
    
    $db->beginTransaction();
    
    try {
        if ($mode === 'replace') {
            // Clear all existing data
            $db->exec("DELETE FROM todos");
            $db->exec("DELETE FROM notes");
            $db->exec("DELETE FROM projects");
        }
        
        // Import projects
        $stmt = $db->prepare("INSERT OR REPLACE INTO projects (id, name, created_at) VALUES (?, ?, ?)");
        foreach ($importData['projects'] as $project) {
            $stmt->execute([
                $project['id'],
                $project['name'],
                $project['created_at'] ?? time()
            ]);
        }
        
        // Import todos
        $stmt = $db->prepare("
            INSERT OR REPLACE INTO todos (id, project_id, title, note, status, images, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        foreach ($importData['todos'] as $todo) {
            $stmt->execute([
                $todo['id'],
                $todo['projectId'],
                $todo['title'],
                $todo['note'] ?? '',
                $todo['status'] ?? 'pending',
                json_encode($todo['images'] ?? []),
                $todo['createdAt'] ?? time()
            ]);
        }
        
        // Import notes
        $stmt = $db->prepare("INSERT OR REPLACE INTO notes (id, content, created_at) VALUES (?, ?, ?)");
        foreach ($importData['notes'] as $note) {
            $stmt->execute([
                $note['id'],
                $note['content'],
                $note['createdAt'] ?? time()
            ]);
        }
        
        $db->commit();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }
}

function clearAll($db) {
    $db->beginTransaction();
    
    try {
        $db->exec("DELETE FROM subtasks");
        $db->exec("DELETE FROM todos");
        $db->exec("DELETE FROM notes");
        $db->exec("DELETE FROM projects");
        
        // Recreate default project
        $db->exec("INSERT INTO projects (id, name) VALUES ('p_default', 'Default Project')");
        
        $db->commit();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }
}

// ============================================
// SUBTASK FUNCTIONS
// ============================================

function createSubtask($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $todoId = $data['todoId'] ?? $data['todo_id'] ?? null;
    
    $stmt = $db->prepare("
        INSERT INTO subtasks (id, todo_id, title, completed, position, created_at) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['id'],
        $todoId,
        $data['title'],
        $data['completed'] ? 1 : 0,
        $data['position'] ?? 0,
        $data['createdAt'] ?? time()
    ]);
    
    echo json_encode(['success' => true, 'id' => $data['id']]);
}

function updateSubtask($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $db->prepare("
        UPDATE subtasks 
        SET title = ?, completed = ?, position = ?
        WHERE id = ?
    ");
    $stmt->execute([
        $data['title'],
        $data['completed'] ? 1 : 0,
        $data['position'] ?? 0,
        $data['id']
    ]);
    
    echo json_encode(['success' => true]);
}

function deleteSubtask($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $db->prepare("DELETE FROM subtasks WHERE id = ?");
    $stmt->execute([$data['id']]);
    
    echo json_encode(['success' => true]);
}
