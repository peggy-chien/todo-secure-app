package com.example.backend.controller;

import com.example.backend.model.Todo;
import com.example.backend.repository.TodoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000")  // React dev server
public class TodoController {
  @Autowired
  private TodoRepository todoRepository;

  // get all todos
  @GetMapping
  public Page<Todo> getAllTodos(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
    return todoRepository.findAll(pageable);
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

    todo.setCompleted(todoDetails.getCompleted());

    return todoRepository.save(todo);
  }
}
