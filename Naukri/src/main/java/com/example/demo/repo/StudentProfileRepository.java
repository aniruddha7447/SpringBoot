package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entiry.StudentProfile;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
	StudentProfile findByStudentUsername(String studentUsername);
}
