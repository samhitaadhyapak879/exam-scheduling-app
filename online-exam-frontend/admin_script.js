// Load Students
function loadStudents() {
    fetch('http://localhost:8080/api/students')
        .then(response => response.json())
        .then(students => {
            const studentsDiv = document.getElementById('students-list');
            studentsDiv.innerHTML = '';

            students.forEach(student => {
                studentsDiv.innerHTML += `
                    <p>
                    <strong>${student.name}</strong> - ${student.email} (USN: ${student.usn})
                    <button onclick="deleteStudent(${student.id}, this)" style="color: red;">Delete</button>
                    </p>
                `;
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
            subjectsDiv.innerHTML = '';

            subjects.forEach(subject => {
                subjectsDiv.innerHTML += `
                    <p>${subject.name}</p>
                `;
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
            examsDiv.innerHTML = '';

            exams.forEach(exam => {
                examsDiv.innerHTML += `
                    <p>
                    <strong>${exam.name}</strong> - ${exam.subject.name} - ${exam.examDate.replace('T', ' ').substring(0, 16)} (${exam.duration} mins)
                    <button onclick="deleteExam(${exam.id})" style="color: red;">Delete</button>
                    </p>
                `;
            });
        })
        .catch(error => console.error('Error loading exams:', error));
}

function deleteExam(examId) {
    if (confirm('Are you sure you want to delete this exam?')) {
        fetch(`http://localhost:8080/api/exams/${examId}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert('Exam deleted successfully!');
            loadExams(); // Reload list after deletion
        })
        .catch(error => {
            console.error('Error deleting exam:', error);
            alert('Failed to delete exam.');
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

// Load all on page load
loadStudents();
loadSubjects();
loadExams();
loadSubmissions();
