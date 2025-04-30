let studentId = 1; // 🔁 Hardcoded for now (replace with session logic if needed)
let testSubmissionId = null;
let questions = [];
let answers = [];
let currentQuestionIndex = 0;
let timerInterval = null;

// ------------------- LOGIN ------------------- //
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


// ------------------- VIEW SCHEDULED TESTS ------------------- //
function loadScheduledTests() {
    const studentIdFromStorage = localStorage.getItem("studentId") || studentId;

    fetch(`http://localhost:8080/api/schedules/student/${studentIdFromStorage}`)
      .then(response => response.json())
      .then(tests => {
        const container = document.getElementById('scheduled-tests-list');
        container.innerHTML = '';
  
        tests.forEach(test => {
          container.innerHTML += `
            <p>
              <strong>${test.exam.name}</strong> on ${test.scheduledDateTime.replace('T', ' ')}
              <button onclick="startTest(${test.exam.id})">Start Test</button>
            </p>
          `;
        });
      })
      .catch(error => {
        console.error('Error loading scheduled tests:', error);
      });
  }

  // Start Test

  function startTest(examId, studentId) {
    localStorage.setItem("studentId", studentId);
    window.location.href = `take_test.html?examId=${examId}`;
}

// Create TestSubmission
function createTestSubmission(examId) {
    studentId = localStorage.getItem("studentId") || studentId;
    fetch('http://localhost:8080/api/submissions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            exam: { id: examId },
            student: { id: studentId }, // Hardcoded now (later dynamic)
            startTime: new Date().toISOString(), // Start time now
            score: 0, // Will update later after test ends
            
        })
    })
    .then(res => res.json())
    .then(data => {
        testSubmissionId = data.id;
        loadQuestionsForExam(examId);
        startTimer();
    })
    .catch(error => {
        console.error('Error creating test submission:', error);
        alert('Error starting test. Please try again.');
    });
}

// Load Questions for Exam
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
    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) {
      alert('Please select an option!');
      return;
    }
  
    answers.push({
      questionId: questions[currentQuestionIndex].id,
      selectedOption: selected.value
    });
  
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion();
    } else {
      submitTest();
    }
}



// Timer
function startTimer() {
    let duration = 1 * 60; // in seconds (for testing)
    timerInterval = setInterval(() => {
      const mins = Math.floor(duration / 60);
      const secs = duration % 60;
      document.getElementById('timer').innerText = `${mins}:${secs < 10 ? '0' + secs : secs}`;
      duration--;
  
      if (duration < 0) {
        clearInterval(timerInterval);
        alert("Time is up!");
        submitTest();
      }
    }, 1000);
}

// Submit Test
function submitTest() {
    const promises = answers.map(ans => {
      return fetch('http://localhost:8080/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedOption: ans.selectedOption,
          question: { id: ans.questionId },
          student: { id: studentId },
          testSubmission: { id: testSubmissionId }
        })
      });
    });
  
    Promise.all(submitPromises)
      .then(() => calculateAndUpdateTestSubmission())
      .catch(error => console.error('Error submitting answers:', error));
}

// Score Evaluation
function calculateAndUpdateTestSubmission() {
    fetch('http://localhost:8080/api/questions')
        .then(res => res.json())
        .then(allQuestions => {
            let correct = 0;
            answers.forEach(ans => {
                const q = allQuestions.find(q => q.id === ans.questionId);
                if (q && q.correctOption === ans.selectedOption) correct++;
            });

            const score = Math.round((correct / answers.length) * 100);
            const endTime = new Date().toISOString();

            return fetch(`http://localhost:8080/api/submissions/${testSubmissionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: testSubmissionId, score, endTime })
            });
        })
        .then(() => {
            alert("Test completed! Score recorded.");
            window.location.href = "student_dashboard.html";
        })
        .catch(err => console.error('Error updating score:', err));
}

// Page Routing Logic
if (window.location.pathname.includes('student_dashboard.html')) {
    loadScheduledTests();
}

if (window.location.pathname.includes("take_test.html")) {
    const params = new URLSearchParams(window.location.search);
    const examId = params.get("examId");
    studentId = localStorage.getItem("studentId") || studentId;
    createTestSubmission(examId);
}





















