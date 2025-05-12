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
    return <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Todo List</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button 
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </ul>

      <div className="flex items-center justify-between mt-6">
        <button 
          onClick={handlePrevPage} 
          disabled={page === 0}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-600">Page {page + 1} of {totalPages}</span>
        <button 
          onClick={handleNextPage} 
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}; 