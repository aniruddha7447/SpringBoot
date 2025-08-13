package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entiry.ApplicationStatus;
import com.example.demo.entiry.Job;
import com.example.demo.entiry.StudentJobApplication;
import com.example.demo.entiry.StudentProfile;
import com.example.demo.repo.JobRepository;
import com.example.demo.repo.StudentJobApplicationRepository;
import com.example.demo.repo.StudentProfileRepository;

@RestController
@RequestMapping("/api/student/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentJobController {

	@Autowired
	private JobRepository jobRepository;

	@Autowired
	private StudentJobApplicationRepository applicationRepository;

	@Autowired
	private StudentProfileRepository profileRepository;

	@GetMapping("/available")
	public List<Job> getAvailableJobs(@RequestHeader("Student-Username") String studentUsername) {
		// Get all jobs
		List<Job> allJobs = jobRepository.findAll();

		// Get jobs already applied or rejected by student
		List<Long> appliedOrRejectedJobIds = applicationRepository.findByStudentUsername(studentUsername).stream()
				.map(app -> app.getJob().getId()).collect(Collectors.toList());

		// Filter out jobs that student has already interacted with
		return allJobs.stream().filter(job -> !appliedOrRejectedJobIds.contains(job.getId()))
				.collect(Collectors.toList());
	}

	@GetMapping("/applied")
	public List<StudentJobApplication> getAppliedJobs(@RequestHeader("Student-Username") String studentUsername) {
		return applicationRepository.findByStudentUsernameAndStatus(studentUsername, ApplicationStatus.APPLIED);
	}

	@GetMapping("/rejected")
	public List<StudentJobApplication> getRejectedJobs(@RequestHeader("Student-Username") String studentUsername) {
		return applicationRepository.findByStudentUsernameAndStatus(studentUsername, ApplicationStatus.REJECTED);
	}

	@PostMapping("/apply")
	public ResponseEntity<?> applyForJob(@RequestParam Long jobId,
			@RequestHeader("Student-Username") String studentUsername) {

		if (applicationRepository.existsByJobIdAndStudentUsername(jobId, studentUsername)) {
			return ResponseEntity.badRequest().body("Already applied or rejected this job");
		}

		Job job = jobRepository.findById(jobId).orElse(null);
		if (job == null) {
			return ResponseEntity.notFound().build();
		}

		// Get student profile
		// Get student profile
		StudentProfile profile = profileRepository.findByStudentUsername(studentUsername);

		StudentJobApplication application = new StudentJobApplication();
		application.setJob(job);
		application.setStudentUsername(studentUsername);
		application.setProfile(profile); // This sets the profile
		application.setStatus(ApplicationStatus.APPLIED);

		applicationRepository.save(application);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/reject")
	public ResponseEntity<?> rejectJob(@RequestParam Long jobId, // Changed from @RequestBody to @RequestParam
			@RequestHeader("Student-Username") String studentUsername) {

		if (applicationRepository.existsByJobIdAndStudentUsername(jobId, studentUsername)) {
			return ResponseEntity.badRequest().body("Already applied or rejected this job");
		}

		Job job = jobRepository.findById(jobId).orElse(null);
		if (job == null) {
			return ResponseEntity.notFound().build();
		}

		StudentJobApplication application = new StudentJobApplication();
		application.setJob(job);
		application.setStudentUsername(studentUsername);
		application.setStatus(ApplicationStatus.REJECTED);

		applicationRepository.save(application);
		return ResponseEntity.ok().build();
	}
}
