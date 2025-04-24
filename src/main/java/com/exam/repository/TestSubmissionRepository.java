package com.exam.repository;

import com.exam.entity.TestSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TestSubmissionRepository extends JpaRepository<TestSubmission, Long> {

}
