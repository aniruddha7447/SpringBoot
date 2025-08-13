package com.example.demo.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entiry.ApplicationStatus;
import com.example.demo.entiry.StudentJobApplication;

public interface StudentJobApplicationRepository extends JpaRepository<StudentJobApplication, Long> {

	List<StudentJobApplication> findByStudentUsernameAndStatus(String studentUsername, ApplicationStatus status);

	boolean existsByJobIdAndStudentUsername(Long jobId, String studentUsername);

	List<StudentJobApplication> findByStudentUsername(String studentUsername);

	List<StudentJobApplication> findByJob_HrUsername(String hrUsername);

	List<StudentJobApplication> findByJobIdAndJob_HrUsername(Long jobId, String hrUsername);

	@Modifying
	@Transactional
	@Query("DELETE FROM StudentJobApplication a WHERE a.job.id = :jobId")
	void deleteByJobId(@Param("jobId") Long jobId);

	@Query("SELECT a FROM StudentJobApplication a JOIN FETCH a.profile WHERE a.job.id = :jobId AND a.job.hrUsername = :hrUsername")
	List<StudentJobApplication> findWithProfileByJobIdAndHrUsername(@Param("jobId") Long jobId,
			@Param("hrUsername") String hrUsername);
}
