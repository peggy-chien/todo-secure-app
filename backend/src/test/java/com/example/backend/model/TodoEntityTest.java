package com.example.backend.model;

import com.example.backend.repository.TodoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class TodoEntityTest {

    @Autowired
    private TodoRepository todoRepository;

    @Test
    void testPrePersistSetsCreatedAt() {
        Todo todo = new Todo("Test JPA");
        todo = todoRepository.save(todo);
        assertNotNull(todo.getCreatedAt());
    }
}