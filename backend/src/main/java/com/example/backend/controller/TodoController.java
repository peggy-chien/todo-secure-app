package com.example.backend.controller;

import com.example.backend.model.Todo;
import com.example.backend.repository.TodoRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000")  // React dev server
public class TodoController {
  @Autowired
  private TodoRepository todoRepository;

  // get all todos
  @GetMapping
  public List<Todo> getAllTodos() {
    return todoRepository.findAll();
  }

  // create a new todo
  @PostMapping
  public Todo createTodo(@RequestBody Todo todo) {
    return todoRepository.save(todo);
  }

  // delete a todo
  @DeleteMapping("/{id}")
  public void deleteTodo(@PathVariable Long id) {
    todoRepository.deleteById(id);
  }

  // update a todo
  @PutMapping("/{id}")
  public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
    Todo todo = todoRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));

    todo.setTitle(todoDetails.getTitle());
    todo.setCompleted(todoDetails.getCompleted());

    return todoRepository.save(todo);
  }
}
