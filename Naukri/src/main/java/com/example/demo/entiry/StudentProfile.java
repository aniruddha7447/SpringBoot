package com.example.demo.entiry;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class StudentProfile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String studentUsername;
	private String fullName;
	private String contactInfo;
	private String professionalSummary;
	private String education;
	private String technicalSkills;
	private String projects;
	private String internships;
	private String certifications;
	private String languages;
	private String achievements;
	private String extracurricular;
	private String leadership;
	private String workExperience;
	private String profileLinks;
	private String careerInterests;
	@ManyToOne
	@JoinColumn(name = "profile_id")
	
	private StudentProfile profile;

	// Default constructor
	public StudentProfile() {
	}

	// Getters and setters for all fields
	// (You can generate them via your IDE)

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getStudentUsername() {
		return studentUsername;
	}

	public void setStudentUsername(String studentUsername) {
		this.studentUsername = studentUsername;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getContactInfo() {
		return contactInfo;
	}

	public void setContactInfo(String contactInfo) {
		this.contactInfo = contactInfo;
	}

	public String getProfessionalSummary() {
		return professionalSummary;
	}

	public void setProfessionalSummary(String professionalSummary) {
		this.professionalSummary = professionalSummary;
	}

	public String getEducation() {
		return education;
	}

	public void setEducation(String education) {
		this.education = education;
	}

	public String getTechnicalSkills() {
		return technicalSkills;
	}

	public void setTechnicalSkills(String technicalSkills) {
		this.technicalSkills = technicalSkills;
	}

	public String getProjects() {
		return projects;
	}

	public void setProjects(String projects) {
		this.projects = projects;
	}

	public String getInternships() {
		return internships;
	}

	public void setInternships(String internships) {
		this.internships = internships;
	}

	public String getCertifications() {
		return certifications;
	}

	public void setCertifications(String certifications) {
		this.certifications = certifications;
	}

	public String getLanguages() {
		return languages;
	}

	public void setLanguages(String languages) {
		this.languages = languages;
	}

	public String getAchievements() {
		return achievements;
	}

	public void setAchievements(String achievements) {
		this.achievements = achievements;
	}

	public String getExtracurricular() {
		return extracurricular;
	}

	public void setExtracurricular(String extracurricular) {
		this.extracurricular = extracurricular;
	}

	public String getLeadership() {
		return leadership;
	}

	public void setLeadership(String leadership) {
		this.leadership = leadership;
	}

	public String getWorkExperience() {
		return workExperience;
	}

	public void setWorkExperience(String workExperience) {
		this.workExperience = workExperience;
	}

	public String getProfileLinks() {
		return profileLinks;
	}

	public void setProfileLinks(String profileLinks) {
		this.profileLinks = profileLinks;
	}

	public String getCareerInterests() {
		return careerInterests;
	}

	public void setCareerInterests(String careerInterests) {
		this.careerInterests = careerInterests;
	}
}
