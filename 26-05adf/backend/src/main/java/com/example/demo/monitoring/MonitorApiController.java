package com.example.demo.monitoring;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MonitorApiController {

    private final LogStore logStore;

    public MonitorApiController(LogStore logStore) {
        this.logStore = logStore;
    }

    @GetMapping("/monitor")
    public List<RequestLog> getLogs() {
        return logStore.getAll();
    }
}
