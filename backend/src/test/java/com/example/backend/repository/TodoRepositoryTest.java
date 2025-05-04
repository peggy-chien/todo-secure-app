package com.example.backend.repository;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.backend.model.Todo;

@SpringBootTest
class TodoRepositoryTest {

	@Autowired
  private TodoRepository todoRepository;

  @Test
  void testPrePersistSetsCreatedAt() {
      Todo todo = new Todo("Test JPA");
      todo = todoRepository.save(todo);
      assertNotNull(todo.getCreatedAt());
  }

}
