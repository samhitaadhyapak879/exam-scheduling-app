package com.exam.repository;

import com.exam.entity.Answer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
	List<Answer> findByStudentId(Long studentId);
	List<Answer> findByQuestionId(Long questionId);
	List<Answer> findByTestSubmissionId(Long submissionId);
	
	@Query("SELECT a.selectedOption, COUNT(a) FROM Answer a WHERE a.question.id = :questionId GROUP BY a.selectedOption")
	List<Object[]> countAnswersByOption(@Param("questionId") Long questionId);


}
