package com.example.demo.entiry;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Job {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String jobTitle;
	private String company;
	private String description;
	private String location;
	private Double salary;
	@Column(name = "hr_username")
	private String hrUsername;
	@OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<StudentJobApplication> applications;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public Double getSalary() {
		return salary;
	}

	public void setSalary(Double salary) {
		this.salary = salary;
	}

	public String getHrUsername() {
		return hrUsername;
	}

	public void setHrUsername(String hrUsername) {
		this.hrUsername = hrUsername;
	}

	@Override
	public String toString() {
		return "Job [id=" + id + ", jobTitle=" + jobTitle + ", company=" + company + ", description=" + description
				+ ", location=" + location + ", salary=" + salary + ", hrUsername=" + hrUsername + "]";
	}

	public Job(Long id, String jobTitle, String company, String description, String location, Double salary,
			String hrUsername) {
		super();
		this.id = id;
		this.jobTitle = jobTitle;
		this.company = company;
		this.description = description;
		this.location = location;
		this.salary = salary;
		this.hrUsername = hrUsername;
	}

	public Job() {
		super();
		// TODO Auto-generated constructor stub
	}

}
