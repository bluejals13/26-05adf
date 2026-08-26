package com.example.demo.monitoring;

public class RequestLog {
    public String method;
    public String url;
    public String body;

    public RequestLog(String method, String url, String body) {
        this.method = method;
        this.url = url;
        this.body = body;
    }
}