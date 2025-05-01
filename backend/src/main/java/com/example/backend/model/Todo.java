package com.example.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

// uses JPA annotations; this class should align with the table in the database
@Entity
@Table(name = "todos")
public class Todo {
  @Id  // primary key
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /*
   * By adding this, JPA infers the following:
   * - title should align to the column name
   * - nullable VARCHAR(255)
   * 
   * So we can omit the @Column annotation unless we have to customize the column name or data type
   */
  private String title;

  private Boolean completed = false;

  private LocalDateTime createdAt;

  @PrePersist  // add this to allow auto-setting the value before saving the entity (to the database)
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
  }
  
  // Constructors
  // Java Bean standards, lets Spring to correctly inject and serialize the fields
  public Todo() {}
  public Todo(String title) {
    this.title = title;
    this.completed = false;
  }

  // Getters & Setters
  public Long getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public Boolean getCompleted() {
    return completed;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setCompleted(Boolean completed) {
    this.completed = completed;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
