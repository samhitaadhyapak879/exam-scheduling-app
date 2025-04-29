package com.exam.service;

import com.exam.entity.Student;
import com.exam.repository.ScheduleRepository;
import com.exam.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.exam.repository.TestSubmissionRepository;
import jakarta.transaction.Transactional;

@Service
public class StudentService {
	 @Autowired
	    private StudentRepository studentRepository;
	 @Autowired
	    private ScheduleRepository scheduleRepository;
	 @Autowired
	    private TestSubmissionRepository testSubmissionRepository;

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


	    
	    @Transactional  // ✅ Add this annotation
	    public void deleteStudent(Long id) {
	    
	    	// Step 1: Delete schedules
	        scheduleRepository.deleteAllByStudentId(id);

	        // Step 2: Delete test submissions
	        testSubmissionRepository.deleteAllByStudentId(id);

	        // Step 3: Break link with User
	        Student student = studentRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Student not found"));

	        if (student.getUser() != null) {
	            student.getUser().setStudent(null); // Break the link
	        }

	        student.setUser(null); // Break other side too, just to be safe
	        studentRepository.save(student); // Update the record to remove link

	        // Step 4: Delete the student
	        studentRepository.delete(student);
	        
	    }

}
