package com.exam.repository;
import com.exam.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long>{
	Feedback findBySubmissionId(Long submissionId);
}
