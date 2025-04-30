package com.exam.repository;

import com.exam.entity.Question;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface QuestionRepository extends JpaRepository<Question, Long> {
	List<Question> findByExamId(Long examId);
	@Transactional
    @Modifying
    void deleteAllByExamId(Long examId);

}
