function login() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorField = document.getElementById('login-error');

    if (!usernameInput || !passwordInput) {
        errorField.innerText = "Please enter username and password.";
        return;
    }

    fetch('http://localhost:8080/api/users')  // call backend
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

            if (user) {
                alert(`Login successful! Role: ${user.role}`);
                
                if (user.role.toUpperCase() === 'STUDENT') {
                    window.location.href = 'student_dashboard.html';
                } else if (user.role.toUpperCase() === 'ADMIN') {
                    window.location.href = 'admin_dashboard.html';
                } else {
                    errorField.innerText = "Unknown role detected!";
                }
            } else {
                errorField.innerText = "Invalid username or password.";
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            errorField.innerText = "Server error. Please try again later.";
        });
}

function loadExams() {
    fetch('http://localhost:8080/api/exams')
        .then(response => response.json())
        .then(exams => {
            const examListDiv = document.getElementById('exam-list');
            examListDiv.innerHTML = '';

            exams.forEach(exam => {
                const examDiv = document.createElement('div');
                examDiv.className = 'exam-card';
                examDiv.innerHTML = `
                    <h3>${exam.name}</h3>
                    <p>Subject: ${exam.subject.name}</p>
                    <p>Exam Date: ${exam.examDate.replace('T', ' ').substring(0, 16)}</p>
                    <p>Duration: ${exam.duration} minutes</p>
                    <button onclick="startExam(${exam.id})">Start Test</button>
                    <hr>
                `;
                examListDiv.appendChild(examDiv);
            });
        })
        .catch(error => {
            console.error('Error loading exams:', error);
        });
}

function startExam(examId) {
    alert(`Starting Exam ID: ${examId}`);
    window.location.href = `take_test.html?examId=${examId}`;
}

// ✅ Automatically load exams if dashboard page is open
if (window.location.pathname.includes('student_dashboard.html')) {
    loadExams();
}

let questions = [];
let currentQuestionIndex = 0;

function loadQuestionsForExam(examId) {
    fetch('http://localhost:8080/api/questions')
        .then(response => response.json())
        .then(data => {
            // Filter questions for this examId
            questions = data.filter(q => q.exam.id == examId);

            if (questions.length > 0) {
                displayQuestion();
            } else {
                document.getElementById('test-container').innerHTML = "<h2>No questions available for this exam.</h2>";
            }
        })
        .catch(error => {
            console.error('Error loading questions:', error);
        });
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').innerText = question.questionText;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = `
        <input type="radio" name="option" value="A"> ${question.optionA}<br>
        <input type="radio" name="option" value="B"> ${question.optionB}<br>
        <input type="radio" name="option" value="C"> ${question.optionC}<br>
        <input type="radio" name="option" value="D"> ${question.optionD}<br>
    `;
}

function nextQuestion() {
    // Save selected answer later

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        alert('Test Completed!');
        // Later: Submit all answers
    }
}

// When take_test.html loads, get examId from URL
if (window.location.pathname.includes('take_test.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId');
    loadQuestionsForExam(examId);
}

