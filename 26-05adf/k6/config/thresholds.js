// k6/config/thresholds.js

export const thresholds = {
    http_req_duration: ["p(95)<500"], // 95% 요청 500ms 이하
    http_req_failed: ["rate<0.01"],   // 에러율 1% 이하
};
