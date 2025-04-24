package com.exam.controller;

import com.exam.entity.Schedule;
import com.exam.service.ScheduleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")

public class ScheduleController {
	private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping
    public Schedule createSchedule(@RequestBody Schedule schedule) {
        return scheduleService.createSchedule(schedule);
    }

    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }
    
    @GetMapping("/student/{studentId}")
    public List<Schedule> getSchedulesByStudent(@PathVariable Long studentId) {
        return scheduleService.getSchedulesByStudent(studentId);
    }

    @GetMapping("/exam/{examId}")
    public List<Schedule> getSchedulesByExam(@PathVariable Long examId) {
        return scheduleService.getSchedulesByExam(examId);
    }

}
