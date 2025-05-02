import { useState, useEffect } from 'react';
import './TodoList.scss';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../../services/todoService';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../models/Todo.model';
import { Page } from '../../models/Page.model';

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const todoPage: Page<Todo> = await getTodos(page, 10);
        setTodos(todoPage.content);
        setTotalPages(todoPage.totalPages);
        setError(null);
      } catch (err) {
        setError('Failed to fetch todos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [page]);

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        const createdTodo = await createTodo(newTodo);
        setTodos([createdTodo, ...todos]);
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

  const handlePrevPage = () => setPage((p) => Math.max(0, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  if (loading) {
    return <div className="todo-container">Loading...</div>;
  }

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
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </ul>
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={page === 0}>Previous</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page + 1 >= totalPages}>Next</button>
      </div>
    </div>
  );
}; 