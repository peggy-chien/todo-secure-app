# Spring Boot

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
