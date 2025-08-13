package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entiry.Job;
import com.example.demo.entiry.StudentJobApplication;
import com.example.demo.repo.JobRepository;
import com.example.demo.repo.StudentJobApplicationRepository;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

	@Autowired
	private JobRepository jobRepository;

	@Autowired
	private StudentJobApplicationRepository applicationRepository;

	@GetMapping
	public List<Job> getJobsForCurrentHr(@RequestHeader("HR-Username") String hrUsername) {
		return jobRepository.findByHrUsername(hrUsername);
	}

	@PostMapping
	public Job createJob(@RequestBody Job job, @RequestHeader("HR-Username") String hrUsername) {
		job.setHrUsername(hrUsername); // Set the HR username before saving
		return jobRepository.save(job);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Job> getJobById(@PathVariable Long id, @RequestHeader("HR-Username") String hrUsername) {
		return jobRepository.findByIdAndHrUsername(id, hrUsername).map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteJob(@PathVariable Long id, @RequestHeader("HR-Username") String hrUsername) {
		return jobRepository.findByIdAndHrUsername(id, hrUsername).map(job -> {
			applicationRepository.deleteByJobId(id);
			jobRepository.delete(job);
			return ResponseEntity.ok().build();
		}).orElse(ResponseEntity.notFound().build());
	}

	// ✅ Updated Endpoint for /api/jobs/{jobId}/applicants
	@GetMapping("/{jobId}/applicants")
	public ResponseEntity<List<StudentJobApplication>> getApplicantsForJob(@PathVariable Long jobId,
			@RequestHeader("HR-Username") String hrUsername) {

		List<StudentJobApplication> applicants = applicationRepository.findWithProfileByJobIdAndHrUsername(jobId,
				hrUsername);

		return ResponseEntity.ok(applicants);
	}
}
