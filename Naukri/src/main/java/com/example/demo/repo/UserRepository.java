package com.example.demo.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entiry.User;

public interface UserRepository extends JpaRepository<User, Long> {

	User findByEmail(String email);
}
