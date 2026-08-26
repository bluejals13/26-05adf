package com.example.demo.monitoring;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class LogStore {

    private final List<RequestLog> logs = new ArrayList<>();

    public void add(RequestLog log) {
        logs.add(log);
    }

    public List<RequestLog> getAll() {
        return logs;
    }
}