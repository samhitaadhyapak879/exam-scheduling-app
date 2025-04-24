package com.exam.repository;

import com.exam.entity.Answer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
	List<Answer> findByStudentId(Long studentId);
	List<Answer> findByQuestionId(Long questionId);
	List<Answer> findByTestSubmissionId(Long submissionId);

}
