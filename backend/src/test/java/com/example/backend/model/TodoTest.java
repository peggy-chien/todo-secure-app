package com.example.backend.model;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class TodoTest {

    @Test
    void testConstructorAndGetters() {
        Todo todo = new Todo("Test Title");
        assertEquals("Test Title", todo.getTitle());
        assertFalse(todo.getCompleted());
    }

    @Test
    void testSetters() {
        Todo todo = new Todo();
        todo.setId(123L);
        todo.setTitle("Hello");
        todo.setCompleted(true);
        LocalDateTime now = LocalDateTime.now();
        todo.setCreatedAt(now);

        assertEquals(123L, todo.getId());
        assertEquals("Hello", todo.getTitle());
        assertTrue(todo.getCompleted());
        assertEquals(now, todo.getCreatedAt());
    }

    @Test
    void testOnCreateSetsCreatedAt() {
        Todo todo = new Todo();
        todo.onCreate();
        assertNotNull(todo.getCreatedAt());
    }
}