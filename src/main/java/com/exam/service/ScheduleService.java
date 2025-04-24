package com.exam.service;

import com.exam.entity.Schedule;
import com.exam.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ScheduleService {
	private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }
    
    public List<Schedule> getSchedulesByStudent(Long studentId) {
        return scheduleRepository.findByStudentId(studentId);
    }

    public List<Schedule> getSchedulesByExam(Long examId) {
        return scheduleRepository.findByExamId(examId);
    }

    
}
