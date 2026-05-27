package com.example.demo.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

@GetMapping("/index")
public String index() {
    return "forward:/index.html";
}

@GetMapping("/login")
public String login() {
    return "forward:/login.html";
}

@GetMapping("/signup")
public String signup() {
    return "forward:/signup.html";
}
}
