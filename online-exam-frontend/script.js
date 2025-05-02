//let studentId = 1; // 🔁 Hardcoded for now (replace with session logic if needed)
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
                
                
                if (user.role.toUpperCase() === 'STUDENT'&& user.student) {
                    localStorage.setItem("studentId", user.student.id); // ✅ Store logged-in user ID
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
    const studentId = localStorage.getItem("studentId");
  
    Promise.all([
      fetch(`http://localhost:8080/api/schedules/student/${studentId}`).then(res => res.json()),
      fetch(`http://localhost:8080/api/submissions/student/${studentId}`).then(res => res.json())
    ])
    .then(([scheduledTests, submissions]) => {
      const container = document.getElementById('scheduled-tests-list');
      container.innerHTML = '';
      const submittedExamIds = submissions.map(sub => sub.exam.id);
      const now = new Date();
  
      scheduledTests.forEach(test => {
        const scheduledTime = new Date(test.scheduledDateTime);
        const isAvailable = now >= scheduledTime;
        const alreadyAttempted = submittedExamIds.includes(test.exam.id);
  
        container.innerHTML += `
          <p>
            <strong>${test.exam.name}</strong><br>
            Scheduled on: ${scheduledTime.toLocaleString()}<br>
            ${
              alreadyAttempted
                ? `<button disabled>✅ Attempted</button>`
                : `<button ${isAvailable ? "" : "disabled"} onclick="startTest(${test.exam.subject.id})">
                    ${isAvailable ? "Start Test" : `🔒 Starts at ${scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </button>`
            }
          </p>
          <hr>
        `;
      });
    })
    .catch(err => console.error('Error loading scheduled tests:', err));
  }
  


  // Start Test

  function startTest(subjectID) {

    const studentId = localStorage.getItem("studentId");

    fetch(`http://localhost:8080/api/questions/subject/${subjectID}`)
        .then(res => res.json())
        .then(schedules => {
            // console.log("schedules",schedules)
            // const schedule = schedules.find(s => s.exam.id == examId);
            // if (!schedule) {
            //     alert("This test is not scheduled for you.");
            //     return;
            // }

            // const scheduledTime = new Date(schedule.scheduledDateTime);
            // const currentTime = new Date();

            // if (currentTime < scheduledTime) {
            //     alert(`Test not started yet. Scheduled at: ${scheduledTime.toLocaleString()}`);
            //     return;
            // }

            // If time is OK, proceed to test
            window.location.href = `take_test.html?subjectId=${subjectID}`;
        })
        .catch(err => {
            console.error("Error checking schedule:", err);
            alert("Unable to verify schedule. Try again later.");
        });
}


// Create TestSubmission
function createTestSubmission(examId) {
   const studentId = localStorage.getItem("studentId");
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
    .then(response => {
        console.log("Submission response:", response);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
    })
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
    fetch(`http://localhost:8080/api/questions/exam/${examId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Questions received for exam:", examId, data);
            questions = data;
        
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
    const studentId = localStorage.getItem("studentId");

    const promises = answers.map(ans => {
      return fetch('http://localhost:8080/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedOption: ans.selectedOption || '',
          question: { id: ans.questionId },
          student: { id: studentId },
          testSubmission: { id: testSubmissionId }
        })
      });
    });
  
    Promise.all(promises)
      .then(() => calculateAndUpdateTestSubmission())
      .catch(error => console.error('Error submitting answers:', error));
}

// Score Evaluation
function calculateAndUpdateTestSubmission() {
    fetch('http://localhost:8080/api/questions')
        .then(res => res.json())
        .then(allQuestions => {
            let correct = 0;
            const review = []; // ✅ for answer sheet

            answers.forEach(ans => {
                const q = allQuestions.find(q => q.id === ans.questionId);
                const isCorrect = q && q.correctOption === ans.selectedOption;
                if (isCorrect) correct++;

                review.push({
                    questionText: q.questionText,
                    selectedOption: ans.selectedOption,
                    correctOption: q.correctOption,
                    isCorrect: isCorrect
                });
            });

            const score = Math.round((correct / answers.length) * 100);
            const endTime = new Date().toISOString();

            // ✅ Store review in localStorage for display
            localStorage.setItem("lastScore", score);
            localStorage.setItem("answerSheet", JSON.stringify(review));

            return fetch(`http://localhost:8080/api/submissions/${testSubmissionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: testSubmissionId, score, endTime })
            });
        })
        .then(() => {
            window.location.href = "score.html"; // ✅ Redirect to score page
        })
        .catch(err => console.error('Error updating score:', err));
}
// mock test
function loadSubjectsForMock() {
    fetch("http://localhost:8080/api/subjects")
      .then(res => res.json())
      .then(subjects => {
        const dropdown = document.getElementById("mock-subject-select");
        dropdown.innerHTML = "";
        subjects.forEach(s => {
          dropdown.innerHTML += `<option value="${s.id}">${s.name}</option>`;
        });
      });
  }
  
  function startMockTest() {
    const subjectId = document.getElementById("mock-subject-select").value;
    window.location.href = `take_test.html?mock=true&subjectId=${subjectId}`;
  }


//test history
function loadTestHistory() {
    const studentId = localStorage.getItem("studentId");
    fetch(`http://localhost:8080/api/submissions/student/${studentId}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("test-history-list");
            container.innerHTML = '';

            if (data.length === 0) {
                container.innerHTML = "<p>No past submissions found.</p>";
                return;
            }

            data.forEach(sub => {
                const examName = sub.exam.name;
                const score = sub.score;
                const date = new Date(sub.startTime).toLocaleString();

                container.innerHTML += `
                    <div class="submission-card">
                        <strong>${examName}</strong><br>
                        Date: ${date}<br>
                        Score: ${score}%
                        <br><button onclick="viewAnswerSheet(${sub.id})">View Answers</button>
                        <hr>
                    </div>
                `;
            });
        });
}

//view answer sheet
function viewAnswerSheet(submissionId) {
    localStorage.setItem("viewSubmissionId", submissionId);
    window.location.href = "view_answers.html";
}

//load answer sheet
function loadAnswerSheet() {
    const submissionId = localStorage.getItem("viewSubmissionId");

    fetch(`http://localhost:8080/api/submissions/${submissionId}`)
    .then(res => {
        if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
        return res.json();
      })
        .then(sub => {
            const container = document.getElementById("answer-sheet");
            container.innerHTML = `<h3>Exam: ${sub.exam.name} | Score: ${sub.score}%</h3>`;

            sub.answers.forEach(ans => {
                const questionText = ans.question?.questionText || '❌ Question not found';
                const yourAns = ans.selectedOption || '❌ Skipped';
                const correctAns = ans.question?.correctOption || 'Unknown';
                const isCorrect = yourAns === correctAns;

                container.innerHTML += `
                    <div class="q-block">
                        <p><strong>Q:</strong> ${questionText}</p>
                        <p><strong>Your Answer:</strong> ${yourAns}</p>
                        <p><strong>Correct Answer:</strong> ${correctAns}</p>
                        <p style="color: ${isCorrect ? 'green' : 'red'};">
                            ${isCorrect ? '✅ Correct' : '❌ Incorrect'}
                        </p>
                        <hr>
                    </div>
                `;
            });
        })
        .catch(err => {
            console.error("Error loading answer sheet:", err);
            document.getElementById("answer-sheet").innerHTML = `<p style="color: red;">Failed to load answer sheet. Please try again later.</p>`;
        });
}

if (window.location.pathname.includes("view_answers.html")) {
    loadAnswerSheet();
}



// Page Routing Logic


// if (window.location.pathname.includes("take_test.html")) {
//     const params = new URLSearchParams(window.location.search);
//     const examId = params.get("examId");
//     createTestSubmission(examId);
// }

if (window.location.pathname.includes("student_dashboard.html")) {
    loadScheduledTests();
    loadSubjectsForMock();
    loadTestHistory(); // 
  }

  if (window.location.pathname.includes("take_test.html")) {
    const params = new URLSearchParams(window.location.search);
    const isMock = params.get("mock") === "true";
    const examId = params.get("examId");
    const subjectId = params.get("subjectId");
    const studentId = localStorage.getItem("studentId");

    if (subjectId) {
        testSubmissionId = Date.now(); // temp
        // console.log("mock test  ",subjectId);
        fetch(`http://localhost:8080/api/questions/subject/${subjectId}`)
            .then(res => res.json())
            .then(data => {
                questions = data.slice(0, 5);
                if (questions.length === 0) {
                    document.getElementById("test-container").innerHTML = `
                      <h2>No mock questions available for this subject.</h2>
                      <button onclick="window.location.href='student_dashboard.html'">Back to Dashboard</button>
                    `;
                } else {
                    startTimer();
                    displayQuestion();
                }
            });
    }else if (examId) {
        // ✅ Scheduled Test Flow
        // createTestSubmission(examId);
    }
    
}


function showForgotForm() {
    document.getElementById('forgot-password-form').style.display = 'block';
  }
  
  function resetPassword() {
    const username = document.getElementById('forgot-username').value;
    const status = document.getElementById('forgot-status');
  
    if (!username) {
      status.innerText = "Please enter your username.";
      return;
    }
  
    fetch(`http://localhost:8080/api/users`)
      .then(res => res.json())
      .then(users => {
        const user = users.find(u => u.username === username);
        if (user) {
          // For demo purposes only: show password in alert (not secure)
          alert(`Your password is: ${user.password}`);
          status.innerText = '';
        } else {
          status.innerText = "User not found.";
        }
      })
      .catch(err => {
        console.error("Error resetting password:", err);
        status.innerText = "Server error. Try again.";
      });
  }

  function clearSelection() {
    const selected = document.querySelector('input[name="option"]:checked');
    if (selected) {
        selected.checked = false;
    }
}

function skipQuestion() {
    // Push null/empty answer to maintain question order
    answers.push({
        questionId: questions[currentQuestionIndex].id,
        selectedOption: null
    });

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        submitTest();
    }
}

function logout() {
    localStorage.removeItem("studentId"); // or remove all with localStorage.clear()
    window.location.href = "index.html"; // or login.html
}
  

  
