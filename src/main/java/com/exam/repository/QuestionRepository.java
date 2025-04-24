package com.exam.repository;

import com.exam.entity.Question;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
	List<Question> findByExamId(Long examId);

}
