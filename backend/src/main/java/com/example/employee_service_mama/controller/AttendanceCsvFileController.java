package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.model.AttendanceCsvFile;
import com.example.employee_service_mama.service.AttendanceCsvFileService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/csv")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://65.2.144.168:80"
        },
        allowCredentials = "true"
)public class AttendanceCsvFileController {

    private final AttendanceCsvFileService service;

    @PostMapping("/save-bulk")
    public ResponseEntity<String> saveBulk(@RequestBody List<AttendanceCsvFile> records) {
        return ResponseEntity.ok(service.saveBulk(records));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AttendanceCsvFile>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/stats/today")
    public ResponseEntity<Map<String, Long>> getTodayStats() {
        return ResponseEntity.ok(service.getTodayStats());
    }

}

