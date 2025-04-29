package com.exam.repository;

import com.exam.entity.TestSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface TestSubmissionRepository extends JpaRepository<TestSubmission, Long> {
	 @Modifying
	 @Transactional
	 @Query("DELETE FROM TestSubmission t WHERE t.student.id = :studentId")
	 void deleteAllByStudentId(@Param("studentId") Long studentId);
}

