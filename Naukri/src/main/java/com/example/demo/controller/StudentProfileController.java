package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entiry.StudentProfile;
import com.example.demo.repo.StudentProfileRepository;

@RestController
@RequestMapping("/api/student/profile")
@CrossOrigin(origins = "http://localhost:5173") // Adjust if your frontend runs on a different port
public class StudentProfileController {

	@Autowired
	private StudentProfileRepository profileRepository;

	@GetMapping
	public ResponseEntity<StudentProfile> getProfile(@RequestHeader("Student-Username") String studentUsername) {
		StudentProfile profile = profileRepository.findByStudentUsername(studentUsername);
		if (profile == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(profile);
	}

	@PostMapping
	public ResponseEntity<StudentProfile> saveProfile(@RequestBody StudentProfile profile,
			@RequestHeader("Student-Username") String studentUsername) {
		StudentProfile existingProfile = profileRepository.findByStudentUsername(studentUsername);

		if (existingProfile != null) {
			// Update existing profile fields
			existingProfile.setFullName(profile.getFullName());
			existingProfile.setContactInfo(profile.getContactInfo());
			existingProfile.setProfessionalSummary(profile.getProfessionalSummary());
			existingProfile.setEducation(profile.getEducation());
			existingProfile.setTechnicalSkills(profile.getTechnicalSkills());
			existingProfile.setProjects(profile.getProjects());
			existingProfile.setInternships(profile.getInternships());
			existingProfile.setCertifications(profile.getCertifications());
			existingProfile.setLanguages(profile.getLanguages());
			existingProfile.setAchievements(profile.getAchievements());
			existingProfile.setExtracurricular(profile.getExtracurricular());
			existingProfile.setLeadership(profile.getLeadership());
			existingProfile.setWorkExperience(profile.getWorkExperience());
			existingProfile.setProfileLinks(profile.getProfileLinks());
			existingProfile.setCareerInterests(profile.getCareerInterests());

			StudentProfile updated = profileRepository.save(existingProfile);
			return ResponseEntity.ok(updated);
		}

		profile.setStudentUsername(studentUsername);
		StudentProfile savedProfile = profileRepository.save(profile);
		return ResponseEntity.ok(savedProfile);
	}

	@GetMapping("/{username}")
	public ResponseEntity<StudentProfile> getProfileByUsername(@PathVariable String username) {
		StudentProfile profile = profileRepository.findByStudentUsername(username);
		if (profile == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(profile);
	}
}
