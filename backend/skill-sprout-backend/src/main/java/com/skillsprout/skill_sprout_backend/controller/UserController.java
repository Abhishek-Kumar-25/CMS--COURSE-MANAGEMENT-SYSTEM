package com.skillsprout.skill_sprout_backend.controller;

import com.skillsprout.skill_sprout_backend.dto.LoginRequest;
import com.skillsprout.skill_sprout_backend.dto.RegisterRequest;
import com.skillsprout.skill_sprout_backend.entity.User;
import com.skillsprout.skill_sprout_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            User user = userService.createUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getCompanionType()
            );

            return ResponseEntity.ok("User registered successfully: " + user.getUsername());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        try {
            boolean isValid = userService.validateUser(request.getUsername(), request.getPassword());
            if (isValid) {
                return ResponseEntity.ok("Login successful for user: " + request.getUsername());
            } else {
                return ResponseEntity.status(401).body("Invalid username or password");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        boolean exists = userService.findByUsername(username).isPresent();
        return ResponseEntity.ok("Username available: " + !exists);
    }
}