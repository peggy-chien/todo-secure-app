package com.example.backend.controller;

import com.example.backend.model.Todo;
import com.example.backend.repository.TodoRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
@AutoConfigureMockMvc
public class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TodoRepository todoRepository;

    @TestConfiguration
    static class MockConfig {
        @Bean
        public TodoRepository todoRepository() {
            return Mockito.mock(TodoRepository.class);
        }
    }

    @Test
    public void testGetAllTodos() throws Exception {
        Todo todo1 = new Todo();
        todo1.setId(1L);
        todo1.setCompleted(false);

        Todo todo2 = new Todo();
        todo2.setId(2L);
        todo2.setCompleted(true);

        Page<Todo> page = new PageImpl<>(Arrays.asList(todo1, todo2));
        Mockito.when(todoRepository.findAll(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[1].id").value(2L));
    }

    @Test
    public void testCreateTodo() throws Exception {
        Todo todo = new Todo();
        todo.setId(1L);
        todo.setCompleted(false);

        Mockito.when(todoRepository.save(any(Todo.class))).thenReturn(todo);

        String todoJson = "{\"completed\":false}";

        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(todoJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.completed").value(false));
    }

    @Test
    public void testDeleteTodo() throws Exception {
        Mockito.doNothing().when(todoRepository).deleteById(1L);

        mockMvc.perform(delete("/api/todos/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void testUpdateTodo() throws Exception {
        Todo existingTodo = new Todo();
        existingTodo.setId(1L);
        existingTodo.setCompleted(false);

        Todo updatedTodo = new Todo();
        updatedTodo.setId(1L);
        updatedTodo.setCompleted(true);

        Mockito.when(todoRepository.findById(1L)).thenReturn(Optional.of(existingTodo));
        Mockito.when(todoRepository.save(any(Todo.class))).thenReturn(updatedTodo);

        String updateJson = "{\"completed\":true}";

        mockMvc.perform(put("/api/todos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.completed").value(true));
    }
}