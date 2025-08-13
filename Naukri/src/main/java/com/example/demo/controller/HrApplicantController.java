package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entiry.StudentJobApplication;
import com.example.demo.repo.StudentJobApplicationRepository;

@RestController
@RequestMapping("/api/hr/applicants")
@CrossOrigin(origins = "http://localhost:5173")
public class HrApplicantController {

	@Autowired
	private StudentJobApplicationRepository applicationRepository;

	@GetMapping("/{jobId}")
	public ResponseEntity<List<StudentJobApplication>> getApplicantsForJob(@PathVariable Long jobId,
			@RequestHeader("HR-Username") String hrUsername) {
		List<StudentJobApplication> applicants = applicationRepository.findWithProfileByJobIdAndHrUsername(jobId,
				hrUsername);
		return ResponseEntity.ok(applicants);
	}
}