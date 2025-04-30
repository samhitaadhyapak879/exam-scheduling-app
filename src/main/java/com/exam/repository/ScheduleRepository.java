package com.exam.repository;

import com.exam.entity.Schedule;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
	List<Schedule> findByStudentId(Long studentId);
	List<Schedule> findByExamId(Long examId);
	@Modifying
	@Transactional
	@Query("DELETE FROM Schedule s WHERE s.student.id = :studentId")
	void deleteAllByStudentId(@Param("studentId") Long studentId);
	
	@Transactional
    @Modifying
    void deleteAllByExamId(Long examId);

}
