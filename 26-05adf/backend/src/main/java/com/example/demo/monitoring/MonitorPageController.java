package com.example.demo.monitoring;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MonitorPageController {

    @GetMapping("/monitor")
    public String monitorPage() {
        return "forward:/monitor.html"; // templates/monitor.html
    }
}
