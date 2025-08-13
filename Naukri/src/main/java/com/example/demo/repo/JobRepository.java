package com.example.demo.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entiry.Job;

public interface JobRepository extends JpaRepository<Job, Long> {

	List<Job> findByHrUsername(String hrUsername);

	Optional<Job> findByIdAndHrUsername(Long id, String hrUsername);
}
