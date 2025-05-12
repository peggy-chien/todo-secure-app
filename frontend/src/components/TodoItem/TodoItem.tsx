import React from 'react';
import { Todo } from '../../models/Todo.model';
import './TodoItem.scss';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => (
  <li className={`flex items-center justify-between p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors ${
    todo.completed ? 'opacity-75' : ''
  }`}>
    <div className="flex items-center flex-1">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 mr-3 cursor-pointer"
      />
      <span className={`text-slate-700 ${
        todo.completed ? 'line-through text-slate-400' : ''
      }`}>
        {todo.title}
      </span>
    </div>
    <button
      onClick={() => onDelete(todo.id)}
      className="text-red-500 text-xl hover:text-red-600 transition-colors p-1"
    >
      ×
    </button>
  </li>
); 