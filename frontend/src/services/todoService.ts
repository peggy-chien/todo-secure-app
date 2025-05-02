import api from '../api';
import { Todo } from '../models/Todo.model';
import { Page } from '../models/Page.model';

export const getTodos = async (page = 0, size = 10): Promise<Page<Todo>> => {
  try {
    const response = await api.get('/todos', { params: { page, size } });
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const createTodo = async (title: string): Promise<Todo> => {
  try {
    const response = await api.post('/todos', { title });
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

export const updateTodo = async (id: number, todo: Partial<Todo>): Promise<Todo> => {
  try {
    const response = await api.put(`/todos/${id}`, todo);
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await api.delete(`/todos/${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}; 