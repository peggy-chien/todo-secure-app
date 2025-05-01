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

---

## Repository

The repository layer handles all interactions between the application and the database. In Spring Boot, we can use Spring Data JPA to avoid writing boilerplate SQL or DAO logic.

By extending a repository interface, Spring will automatically generate common data access methods such as:
- findAll()
- findById(id)
- save(entity)
- deleteById(id)

### Thoughts Before Coding

#### Basic Requirements

A Todo repository should support:

- Retrieving all todos
- Finding a todo by ID
- Saving a new todo
- Updating an existing todo
- Deleting a todo

These are already covered by JpaRepository.

### Repository Design Breakdown

- `JpaRepository<Todo, Long>`: Indicates this repository works with the Todo entity and its primary key is of type Long.
- `@Repository	(Optional)`:  Tells Spring this is a bean for data access; mostly used for clarity, as Spring Boot auto-detects interfaces.

#### Why This Design?

- No need to write CRUD logic manually.
- Clean separation of concerns: controller → service → repository → DB.
- Easily extendable for pagination, sorting, and custom queries.
- Fully integrates with Spring Boot’s dependency injection.

---

## Controller

The controller acts as the entry point for HTTP requests. It connects the client (e.g., React frontend) with the service or repository layers and exposes business functionality as RESTful endpoints.

### Thoughts Before Coding

For a typical Todo application, the controller should handle:

| Action | HTTP Method | Endpoint | Description |
|--------|-------------|----------|-------------|
| Get all todos | GET | /api/todos | Retrieve all todo items |
| Create a new todo | POST | /api/todos | Add a new todo |
| Delete a todo | DELETE | /api/todos/{id} | Delete a specific todo by ID |
| Update a todo | PUT | /api/todos/{id} | Replace the entire todo (title & completed) |

### Repository Design Breakdown

#### Get all todos

- use `@GetMapping` to map HTTP GET requests to the method
- return `List<Todo>` to send all todos as a JSON array
- call `todoRepository.findAll()` to retrieve all todos from the database

#### Create a new todo

- use `@PostMapping` to map HTTP POST requests to the method
- use `@RequestBody` to deserialize the JSON request body into a Todo object
- call `todoRepository.save(todo)` to persist the new todo
- return the saved Todo with its generated ID

#### Delete a todo

- use `@DeleteMapping("/{id}")` to map HTTP DELETE requests with an ID parameter
- use `@PathVariable` to extract the ID from the URL
- call `todoRepository.deleteById(id)` to remove the todo from the database

#### Update a todo

- use `@PutMapping("/{id}")` to map HTTP PUT requests with an ID parameter
- use `@PathVariable` to extract the ID from the URL
- use `@RequestBody` to deserialize the updated Todo object
- find the existing todo by ID or throw an exception if not found
- update the todo's properties with the new values
- call `todoRepository.save(todo)` to persist the changes

### Why Use PUT Instead of PATCH?

- The Todo entity is simple and flat.
- Frontend usually sends the full object (title and completed) when submitting forms.
- It simplifies backend logic — no need to check which fields are present.
- Ideal for full record updates.

### When to Use PATCH Instead:

- For partial field updates which has a complex structure (e.g. nested JSON).
- Or a field which might toggle (switch ON and OFF) frequently.
- If the frontend sends only the fields that changed.
- For advanced REST design where minimal updates are preferred.

#### Example of PATCH (Advanced Use)

```java
@PatchMapping("/{id}/toggle")
public Todo toggleCompleted(@PathVariable Long id) {
    Todo todo = todoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));

    todo.setCompleted(!todo.getCompleted());
    return todoRepository.save(todo);
}
```

This approach is semantically more precise but also requires more route definitions and logic.

### Summary Table

| Annotation | Purpose |
|------------|---------|
| @RestController | Declares a RESTful API controller |
| @RequestMapping | Base path for all routes in this controller |
| @CrossOrigin | Enables CORS for frontend interaction |
| @GetMapping | Handles GET requests |
| @PostMapping | Handles POST requests |
| @PutMapping | Handles full record updates |
| @DeleteMapping | Handles deletion requests |

