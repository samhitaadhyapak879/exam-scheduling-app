package com.exam.repository;

import com.exam.entity.Schedule;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
	List<Schedule> findByStudentId(Long studentId);
	List<Schedule> findByExamId(Long examId);

}
