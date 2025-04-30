// Load Students
function loadStudents() {
    fetch('http://localhost:8080/api/students')
        .then(response => response.json())
        .then(students => {
            const studentsDiv = document.getElementById('students-list');
            const scheduleStudentSelect = document.getElementById('schedule-student-select');

            studentsDiv.innerHTML = '';
            scheduleStudentSelect.innerHTML = '';

            students.forEach(student => {
                studentsDiv.innerHTML += `<p>
                    <strong>${student.name}</strong> - ${student.email} (USN: ${student.usn})
                    <button onclick="deleteStudent(${student.id}, this)" style="color: red;">Delete</button>
                    </p>
                `;
                scheduleStudentSelect.innerHTML += `<option value="${student.id}">${student.name} (${student.usn})</option>`;
            });
        })
        .catch(error => console.error('Error loading students:', error));
}

async function deleteStudent(studentId, button) {
    console.log("working");
    if (confirm('Are you sure you want to delete this student?')) {
        // Disable the button to prevent multiple clicks
        button.disabled = true;
        
        // Show a loading indicator
        button.innerHTML = 'Deleting...';
        try{
        const response= await fetch(`http://localhost:8080/api/students/${studentId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Student deleted successfully!');
            await loadStudents(); // Reload after delete
            console.log("deleted successfully");
        } 
        else 
        {
            alert('Failed to delete student. Status: ' + response.status);
        }
        }
        catch(error){
            console.error('Error deleting student:', error);
            alert('Error occurred while deleting student.');
        }finally{
            // Re-enable the button after operation completes
            button.disabled = false;
            button.innerHTML = 'Delete';
        }

    }

}




// Load Subjects
function loadSubjects() {
    fetch('http://localhost:8080/api/subjects')
        .then(response => response.json())
        .then(subjects => {
            const subjectsDiv = document.getElementById('subjects-list');
            const subjectSelect = document.getElementById('subject-select');
            const questionSubjectSelect = document.getElementById('question-subject-select');

            subjectsDiv.innerHTML = '';
            subjectSelect.innerHTML = ''; // Clear dropdown before populating
            questionSubjectSelect.innerHTML = ''; // ✅ Clear old options

            subjects.forEach(subject => {
                 subjectsDiv.innerHTML += `<p>${subject.name}</p>`;
                // subjectSelect.innerHTML += `<option value="${subject.id}">${subject.name}</option>`;
                // questionSubjectSelect.innerHTML += option; // ✅ Populate both

                const option = `<option value="${subject.id}">${subject.name}</option>`;
                subjectSelect.innerHTML += option;
                questionSubjectSelect.innerHTML += option;
            });
        })
        .catch(error => console.error('Error loading subjects:', error));
}



// Load Exams
function loadExams() {
    fetch('http://localhost:8080/api/exams')
        .then(response => response.json())
        .then(exams => {
            const examsDiv = document.getElementById('exams-list');
            const examSelect = document.getElementById('examId'); // ✅ this dropdown
            const examQuestionSelect = document.getElementById('exam-question-select'); // 👈 for view/delete
            const scheduleExamSelect = document.getElementById('schedule-exam-select');


            examsDiv.innerHTML = '';
            examSelect.innerHTML = ''; // ✅ clear previous options
            examQuestionSelect.innerHTML = '';
            scheduleExamSelect.innerHTML = '';

            exams.forEach(exam => {
                examsDiv.innerHTML += `
                    <p>
                    <strong>${exam.name}</strong> - ${exam.subject.name} - ${exam.examDate.replace('T', ' ').substring(0, 16)} (${exam.duration} mins)
                    <button onclick="deleteExam(${exam.id}, this)" style="color: red;">Delete</button>
                    </p>
                `;
                // ✅ for the dropdown
                examSelect.innerHTML += `<option value="${exam.id}">${exam.subject.name} - ${exam.name}</option>`;
                examQuestionSelect.innerHTML += `<option value="${exam.id}">${exam.subject.name} - ${exam.name}</option>`; // 👈 populate dropdown
                scheduleExamSelect.innerHTML += `<option value="${exam.id}">${exam.name} (${exam.subject.name})</option>`;
            });
        })
        .catch(error => console.error('Error loading exams:', error));
}

function deleteExam(examId, button) {
    if (confirm('Are you sure you want to delete this exam?')) {
        button.disabled = true;
        button.innerText = "Deleting...";

        fetch(`http://localhost:8080/api/exams/${examId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Exam deleted successfully!');
                loadExams();  // ✅ reload exams list
            } else {
                alert('Failed to delete exam. Status: ' + response.status);
            }
        })
        .catch(error => {
            console.error('Error deleting exam:', error);
            alert('Error occurred while deleting exam.');
        })
        .finally(() => {
            button.disabled = false;
            button.innerText = "Delete";
        });
    }
}



// Load Submissions
function loadSubmissions() {
    fetch('http://localhost:8080/api/submissions')
        .then(response => response.json())
        .then(submissions => {
            const submissionsDiv = document.getElementById('submissions-list');
            submissionsDiv.innerHTML = '';

            submissions.forEach(sub => {
                submissionsDiv.innerHTML += `
                    <p>Student ID: ${sub.student.id}, Exam ID: ${sub.exam.id}, Score: ${sub.score}%</p>
                `;
            });
        })
        .catch(error => console.error('Error loading submissions:', error));
}

// Handle subject creation
document.getElementById('add-subject-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('new-subject-name').value;

    fetch('http://localhost:8080/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    })
    .then(response => {
        if (response.ok) {
            alert('✅ Subject added!');
            loadSubjects(); // 🔁 refresh dropdowns
            document.getElementById('add-subject-form').reset();
        } else {
            alert('❌ Failed to add subject. Status: ' + response.status);
        }
    })
    .catch(error => {
        console.error('Error adding subject:', error);
        alert('❌ Error occurred while adding subject.');
    });
});

// Create Exam
document.getElementById('add-exam-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('exam-name').value;
    const date = document.getElementById('exam-date').value;
    const duration = document.getElementById('duration').value;
    const subjectId = document.getElementById('subject-select').value;

    const examData = {
        name,
        examDate: date,
        duration: parseInt(duration),
        subject: { id: parseInt(subjectId) }
    };

    fetch('http://localhost:8080/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
    })
        .then(response => {
            if (response.ok) {
                alert('✅ Exam created!');
                loadExams();
                document.getElementById('add-exam-form').reset();
            } else {
                alert('❌ Failed to create exam. Status: ' + response.status);
            }
        })
        .catch(error => {
            console.error('Error creating exam:', error);
            alert('❌ Error occurred while creating the exam.');
        });
});

// Add Question
document.getElementById('questionForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const question = {
        questionText: document.getElementById('questionText').value,
        optionA: document.getElementById('optionA').value,
        optionB: document.getElementById('optionB').value,
        optionC: document.getElementById('optionC').value,
        optionD: document.getElementById('optionD').value,
        correctOption: document.getElementById('correctOption').value,
        exam: { id: parseInt(document.getElementById('examId').value) },
        subject: { id: parseInt(document.getElementById('question-subject-select').value) }
    };

    fetch('http://localhost:8080/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question)
    })
        .then(response => {
            if (response.ok) {
                alert('✅ Question added successfully!');
                document.getElementById('questionForm').reset();
            } else {
                alert('❌ Failed to add question. Status: ' + response.status);
            }
        })
        .catch(error => {
            console.error('Error adding question:', error);
            alert('❌ Error occurred while adding question.');
        });
});




//Loading questions
function loadQuestionsByExam(examId) {
    fetch(`http://localhost:8080/api/questions/exam/${examId}`)
        .then(res => res.json())
        .then(questions => {
            const container = document.getElementById('questions-list');
            container.innerHTML = '';

            questions.forEach(q => {
                container.innerHTML += `
                    <p>
                        <strong>${q.questionText}</strong>
                        <button onclick="deleteQuestion(${q.id}, this)" style="color: red;">Delete</button>
                    </p>
                `;
            });
        });
}
//Delete question
function deleteQuestion(questionId, button) {
    if (confirm('Are you sure you want to delete this question?')) {
        button.disabled = true;
        button.innerText = "Deleting...";

        fetch(`http://localhost:8080/api/questions/${questionId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('✅ Question deleted.');
                document.getElementById('exam-question-select').dispatchEvent(new Event('change')); // reload
            } else {
                alert('❌ Failed to delete question.');
            }
        })
        .catch(err => alert('Error deleting question.'))
        .finally(() => {
            button.disabled = false;
            button.innerText = 'Delete';
        });
    }
}

//test scheduling
document.getElementById('schedule-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const studentId = document.getElementById('schedule-student-select').value;
    const examId = document.getElementById('schedule-exam-select').value;
    const dateTime = document.getElementById('schedule-datetime').value;

    const payload = {
        student: { id: parseInt(studentId) },
        exam: { id: parseInt(examId) },
        scheduledDateTime: dateTime
    };

    fetch('http://localhost:8080/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            alert('✅ Test scheduled successfully!');
            document.getElementById('schedule-form').reset();
        } else {
            alert('❌ Failed to schedule test. Status: ' + response.status);
        }
    })
    .catch(error => {
        console.error('Error scheduling test:', error);
        alert('❌ Error occurred while scheduling.');
    });
});

function loadScheduledTests() {
    fetch('http://localhost:8080/api/schedules')
        .then(response => response.json())
        .then(schedules => {
            const scheduledDiv = document.getElementById('scheduled-tests-list');
            scheduledDiv.innerHTML = '';

            schedules.forEach(schedule => {
                const dateTime = new Date(schedule.scheduledDateTime).toLocaleString();
                scheduledDiv.innerHTML += `
                    <p>
                        Student: ${schedule.student.name} (${schedule.student.usn})<br>
                        Exam: ${schedule.exam.name}<br>
                        Scheduled Time: ${dateTime}
                    </p>
                    <hr>
                `;
            });
        })
        .catch(error => console.error('Error loading scheduled tests:', error));
}



// Load all on page load
loadStudents();
loadSubjects();
loadExams();
loadSubmissions();
loadScheduledTests();


document.getElementById('exam-question-select').addEventListener('change', function () {
    const examId = this.value;
    if (examId) {
        loadQuestionsByExam(examId);
    }
});



