package com.exam.controller;

import com.exam.entity.Student;
import com.exam.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")

public class StudentController {
	 @Autowired
	    private StudentService studentService;

	    @GetMapping
	    public List<Student> getAllStudents() {
	        return studentService.getAllStudents();
	    }

	    @GetMapping("/{id}")
	    public Optional<Student> getStudentById(@PathVariable Long id) {
	        return studentService.getStudentById(id);
	    }

	    @PostMapping
	    public Student createStudent(@RequestBody Student student) {
	        return studentService.createStudent(student);
	    }

	    @PutMapping("/{id}")
	    public Student updateStudent(@PathVariable Long id, @RequestBody Student student) {
	        return studentService.updateStudent(id, student);
	    }

//	    @DeleteMapping("/{id}")
//	    public void deleteStudent(@PathVariable Long id) {
//	        studentService.deleteStudent(id);
//	    }
	    
	    @DeleteMapping("/{id}")
	    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
	        studentService.deleteStudent(id);
	        return ResponseEntity.ok().build();  // ✅ Ensures correct 200 response
	    }

}
