package com.example.demo.entiry;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class StudentJobApplication {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "profile_id")
	private StudentProfile profile;

	@ManyToOne
	@JoinColumn(name = "job_id")
	private Job job;

	private String studentUsername;

	@Enumerated(EnumType.STRING)
	private ApplicationStatus status;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public StudentProfile getProfile() {
		return profile;
	}

	public void setProfile(StudentProfile profile) {
		this.profile = profile;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

	public String getStudentUsername() {
		return studentUsername;
	}

	public void setStudentUsername(String studentUsername) {
		this.studentUsername = studentUsername;
	}

	public ApplicationStatus getStatus() {
		return status;
	}

	public void setStatus(ApplicationStatus status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "StudentJobApplication [id=" + id + ", profile=" + profile + ", job=" + job + ", studentUsername="
				+ studentUsername + ", status=" + status + "]";
	}

	public StudentJobApplication(Long id, StudentProfile profile, Job job, String studentUsername,
			ApplicationStatus status) {
		super();
		this.id = id;
		this.profile = profile;
		this.job = job;
		this.studentUsername = studentUsername;
		this.status = status;
	}

	public StudentJobApplication() {
		super();
		// TODO Auto-generated constructor stub
	}

}
