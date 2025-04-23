package com.exam.service;

import com.exam.entity.Student;
import com.exam.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
	 @Autowired
	    private StudentRepository studentRepository;

	    public List<Student> getAllStudents() {
	        return studentRepository.findAll();
	    }

	    public Optional<Student> getStudentById(Long id) {
	        return studentRepository.findById(id);
	    }

	    public Student createStudent(Student student) {
	        return studentRepository.save(student);
	    }

	    public Student updateStudent(Long id, Student updatedStudent) {
	        Optional<Student> existing = studentRepository.findById(id);
	        if (existing.isPresent()) {
	            Student student = existing.get();
	            student.setName(updatedStudent.getName());
	            student.setEmail(updatedStudent.getEmail());
	            student.setUsn(updatedStudent.getUsn());
	            student.setUser(updatedStudent.getUser());
	            return studentRepository.save(student);
	        } else {
	            return null; // or throw an exception
	        }
	    }

	    public void deleteStudent(Long id) {
	        studentRepository.deleteById(id);
	    }

}
