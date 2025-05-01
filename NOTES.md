# Spring Boot

---

## Setup Spring Boot Project

Setup Spring Boot project with Spring Boot CLI

```bash
spring init --dependencies=web,data-jpa,postgresql --build-maven backend
```

### Detailed Explanation

- `spring init`: this is the initialize command the Sping CLI offered, similar as the Spring Initializr website
- `--dependencies=web,data-jpa,postgresql`: means to add these dependencies, speparated by comma
  | Module Name | Purpose |
  |---|---|
  | web | **Spring Web** module, supports REST API |
  | data-jpa | **Spring Data JPA**, Java's database support |
  | postgresql | **PostgreSQL JDBC** driver, which can make connection with PostgreSQL |
- `--build=maven`: specifies which build tool to use for project creation
  - maven: manages dependencies and build settings via pom.xml (mainstream and stable)
  - gradle: another build tool with more concise syntax but lower readability
- `backend`: the folder name of the project (Spring CLI creates that for you)

---

## Entity

### Thought Process Before Coding

When designing an Entity for a simple Todo app, ask yourself:
- What are the essential fields?
- Will this data be persisted in a database?
- Does it need default values or system-generated timestamps?
- How will the API use this data?

### Entity Design Breakdown

1. Class & Table Definition

    ```java
    @Entity
    @Table(name = "todos")
    public class Todo {
    ```

    - @Entity: Marks the class as a JPA-managed entity.
    - @Table(name = "todos"): Maps to a table named todos (optional if default naming is acceptable).

2. Primary Key Field

    ```java
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    ```

    - @Id: Defines the primary key.
    - @GeneratedValue: Auto-increments the ID using the database’s native strategy (e.g., PostgreSQL’s SERIAL).

3. Business Fields

    ```java
    private String title;
    private Boolean completed = false;
    ```

    - title: The task description.
    - completed: Task status; defaults to false.

    *These fields are straightforward and align directly with business needs.*

4. Timestamp (System Field)

    ```java
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    ```

    - createdAt: Automatically populated when the record is created.
    - @PrePersist: Lifecycle hook that sets the creation timestamp before the entity is persisted.

5. Constructors and Accessors

    ```java
    public Todo() {}
    public Todo(String title) { this.title = title; }

    public Long getId() { ... }
    public void setTitle(String title) { ... }
    ```

    - Needed for Spring to instantiate the object and map JSON ↔ Java.
    - Follow JavaBean conventions.

### Why Not Use @Column?

You can, but don’t have to.

JPA uses sensible defaults:
- Column name = field name
- Length = 255 for Strings
- Nullable by default

Use @Column only if you need fine-grained control, such as:

`@Column(name = "todo_title", length = 200, nullable = false)`

### Summary Table

| Component | Purpose |
|-----------|---------|
| @Entity | Declares a persistent JPA entity |
| @Table | Sets table name (optional if default is fine) |
| @Id + @GeneratedValue | Defines the primary key with auto-increment |
| @PrePersist | Sets default values before saving |
| @Column | (Optional) Add DB-level constraints/settings |
| Getters/Setters | Enables JSON mapping and ORM functionality |
