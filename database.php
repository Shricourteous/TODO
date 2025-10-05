<?php
/**
 * Database Configuration and Setup
 * Creates SQLite database and tables
 */

class Database {
    private static $instance = null;
    private $db;
    private $dbPath;

    private function __construct() {
        // Set database path
        $this->dbPath = __DIR__ . '/data/todo_app.db';
        
        // Create data directory if it doesn't exist
        $dataDir = dirname($this->dbPath);
        if (!file_exists($dataDir)) {
            if (!mkdir($dataDir, 0777, true)) {
                throw new Exception("Failed to create data directory: " . $dataDir);
            }
        }

        // Create or open SQLite database
        try {
            $this->db = new PDO('sqlite:' . $this->dbPath);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->db->exec('PRAGMA foreign_keys = ON');
            $this->createTables();
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->db;
    }

    private function createTables() {
        // Projects table
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                created_at INTEGER DEFAULT (strftime('%s', 'now'))
            )
        ");

        // Todos table
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS todos (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                title TEXT NOT NULL,
                note TEXT,
                status TEXT DEFAULT 'pending',
                priority TEXT DEFAULT 'medium',
                due_date TEXT,
                tags TEXT,
                images TEXT,
                created_at INTEGER DEFAULT (strftime('%s', 'now')),
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        ");
        
        // Subtasks table
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS subtasks (
                id TEXT PRIMARY KEY,
                todo_id TEXT NOT NULL,
                title TEXT NOT NULL,
                completed INTEGER DEFAULT 0,
                position INTEGER DEFAULT 0,
                created_at INTEGER DEFAULT (strftime('%s', 'now')),
                FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE
            )
        ");

        // Notes table
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                created_at INTEGER DEFAULT (strftime('%s', 'now'))
            )
        ");

        // Create default project if none exist
        $stmt = $this->db->query("SELECT COUNT(*) as count FROM projects");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] == 0) {
            $defaultId = 'p_' . uniqid();
            $stmt = $this->db->prepare("INSERT INTO projects (id, name) VALUES (?, ?)");
            $stmt->execute([$defaultId, 'General Tasks']);
        }
    }

    public function beginTransaction() {
        return $this->db->beginTransaction();
    }

    public function commit() {
        return $this->db->commit();
    }

    public function rollback() {
        return $this->db->rollBack();
    }
}
