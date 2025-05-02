import React from 'react';
import { Todo } from '../services/todoService';
import './TodoItem.scss';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => (
  <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
      className="todo-checkbox"
    />
    <span className="todo-text">{todo.title}</span>
    <button
      onClick={() => onDelete(todo.id)}
      className="delete-button"
    >
      ×
    </button>
  </li>
); 