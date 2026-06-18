FROM gradle:8.1-jdk17 AS build

WORKDIR /home/gradle/project

COPY . .

RUN chmod +x gradlew
RUN ./gradlew clean build --no-daemon

FROM eclipse-temurin:17-jdk

# curl 설치
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /home/gradle/project/build/libs/*.jar app.jar

EXPOSE 8080


HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java","-jar","app.jar"]
