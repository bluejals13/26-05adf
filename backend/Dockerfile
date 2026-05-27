FROM gradle:8.1-jdk17 AS build

WORKDIR /home/gradle/project

COPY . .

RUN chmod +x gradlew
RUN ./gradlew clean build --no-daemon

FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /home/gradle/project/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
