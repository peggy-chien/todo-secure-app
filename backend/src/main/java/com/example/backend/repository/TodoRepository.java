package com.example.backend.repository;

import com.example.backend.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {  // JpaRepository<Entity, ID>: [Entity] specifies the entity, [ID] specifies the type of the primary key
  // by extending JpaRepository, TodoRepository inherits several methods for database operations
  // i.e. save(), findById(), findAll(), deleteById(), etc.

  // add other custom methods here if needed
}
