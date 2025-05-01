FROM eclipse-temurin:17-jdk
VOLUME /tmp
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/todo-0.0.1-SNAPSHOT.jar"]
