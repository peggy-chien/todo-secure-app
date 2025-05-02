import { useState, useEffect } from 'react';
import './TodoList.scss';
import { Todo, getTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';
import { TodoItem } from './TodoItem';

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos();
        setTodos(fetchedTodos);
        setError(null);
      } catch (err) {
        setError('Failed to fetch todos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        const createdTodo = await createTodo(newTodo);
        setTodos([...todos, createdTodo]);
        setNewTodo('');
        setError(null);
      } catch (err) {
        setError('Failed to create todo');
        console.error(err);
      }
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      try {
        const updatedTodo = await updateTodo(id, { completed: !todo.completed });
        setTodos(todos.map(t => t.id === id ? updatedTodo : t));
        setError(null);
      } catch (err) {
        setError('Failed to update todo');
        console.error(err);
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="todo-container">Loading...</div>;
  }

  // Sort todos: incomplete first, then by createdAt (newest first)
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // incomplete first
    }
    // Newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="todo-input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          className="todo-input"
        />
        <button onClick={addTodo} className="add-button">
          Add
        </button>
      </div>
      <ul className="todo-list">
        {sortedTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}; 