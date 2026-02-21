package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.dto.ForgotPasswordRequest;
import com.example.employee_service_mama.dto.ResetPasswordRequest;
import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://teamhub-ALB-680655485.ap-south-1.elb.amazonaws.com",
                "http://15.206.26.130"
        },
        allowCredentials = "true"
)
public class UserController {

    private final UserService userService;

    /* ================= SIGN IN ================= */

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> map) {
        return ResponseEntity.ok(
                userService.signin(map.get("email"), map.get("password"))
        );
    }

    /* ================= GET USER ================= */

    @GetMapping("/{id}")
    public ResponseEntity<Users> getUser(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /* ================= UPDATE PROFILE ================= */

    @PutMapping("/update-profile/{id}")
    public ResponseEntity<Users> updateProfile(
            @PathVariable Integer id,
            @RequestBody Users data
    ) {
        return ResponseEntity.ok(userService.updateProfile(id, data));
    }

    /* ================= UPLOAD PROFILE PHOTO ================= */

    @PostMapping(
            value = "/upload-photo/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadPhoto(
            @PathVariable Integer id,
            @RequestParam("photo") MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "File is empty"));
        }

        String url = userService.uploadPhoto(id, file);

        return ResponseEntity.ok(Map.of("url", url));
    }

    /* ================= ADD EMPLOYEE ================= */

    @PostMapping("/add")
    public ResponseEntity<Users> addEmployee(@RequestBody Users user) {
        return ResponseEntity.ok(userService.addEmployee(user));
    }

    /* ================= LIST USERS ================= */

    @GetMapping("/all")
    public ResponseEntity<List<Users>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /* ================= HR UPDATE ================= */

    @PutMapping("/hr/update/{id}")
    public ResponseEntity<Users> updateEmployeeJob(
            @PathVariable Integer id,
            @RequestBody Users data
    ) {
        return ResponseEntity.ok(
                userService.updateEmployeeJobDetails(id, data)
        );
    }

    /* ================= BULK ADD ================= */

    @PostMapping("/add-bulk")
    public ResponseEntity<List<Users>> addBulk(
            @RequestBody List<Users> users
    ) {
        return ResponseEntity.ok(
                userService.addBulkEmployees(users)
        );
    }

    /* ================= COUNTS ================= */

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUserCount() {
        return ResponseEntity.ok(
                Map.of("count", userService.getTotalUserCount())
        );
    }

    @GetMapping("/present-today")
    public ResponseEntity<Map<String, Long>> getPresentToday() {
        return ResponseEntity.ok(
                Map.of("count", userService.getPresentTodayCount())
        );
    }

    @GetMapping("/on-leave-today")
    public ResponseEntity<Map<String, Long>> getOnLeaveToday() {
        return ResponseEntity.ok(
                Map.of("count", userService.getOnLeaveTodayCount())
        );
    }

    /* ================= PASSWORD RESET ================= */

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {
        userService.sendResetOtp(request);
        return ResponseEntity.ok("OTP sent to registered email!");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {
        userService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );
        return ResponseEntity.ok("Password updated successfully!");
    }

    /* ================= DELETE USER ================= */

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Integer userId
    ) {
        userService.deleteuser(userId);
        return ResponseEntity.ok("Successfully deleted");
    }

    /* ================= BIRTHDAYS ================= */

    @GetMapping("/birthdays/today")
    public ResponseEntity<List<Users>> getTodaysBirthdays() {
        return ResponseEntity.ok(userService.getTodaysBirthdays());
    }
}
