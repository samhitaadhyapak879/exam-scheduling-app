package com.exam.repository;

import com.exam.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
	// Custom query methods
    Student findByUsn(String usn);
    Student findByEmail(String email);

}
