package com.example.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entiry.User;
import com.example.demo.repo.UserRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private UserRepository userRepo;

	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody User user) {
		if (userRepo.findByEmail(user.getEmail()) != null) {
			return ResponseEntity.badRequest().body("User already exists!");
		}
		userRepo.save(user);
		return ResponseEntity.ok("Registered successfully!");
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody User user) {
	    User existing = userRepo.findByEmail(user.getEmail());
	    if (existing != null && existing.getPassword().equals(user.getPassword())) {
	        return ResponseEntity.ok(Map.of(
	            "message", "Login successful!",
	            "role", existing.getRole(),
	            "username", existing.getUsername()
	        ));
	    }
	    return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials!"));
	}

}
