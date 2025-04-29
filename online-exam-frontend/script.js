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

//  Automatically load exams if dashboard page is open
if (window.location.pathname.includes('student_dashboard.html')) {
    loadExams();
}

let questions = [];
let answers = [];  // Store student's selected answers
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
    // Save selected answer
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        answers.push({
            questionId: questions[currentQuestionIndex].id,
            selectedOption: selectedOption.value
        });
    } else {
        alert('Please select an option before proceeding.');
        return;
    }


    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        submitTest();
    }
}

// When take_test.html loads, get examId from URL
if (window.location.pathname.includes('take_test.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId');
    loadQuestionsForExam(examId);
}
function submitTest() {
    console.log('Submitting answers to backend:', answers);

    const promises = answers.map(ans => {
        return fetch('http://localhost:8080/api/answers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                selectedOption: ans.selectedOption,
                question: { id: ans.questionId },
                student: { id: 1 }, // Hardcoded now (later dynamically use logged in student ID)
                testSubmission: { id: testSubmissionId } // Hardcoded now (later link to test submission properly)
            })
        });
    });

    Promise.all(promises)
        .then(() => {
            console.log('Answers saved successfully.');

            // ✅ After saving answers, calculate score and update TestSubmission
            calculateAndUpdateTestSubmission();
        })
        .catch(error => {
            console.error('Error submitting answers:', error);
            alert('Error submitting test. Please try again.');
        });
}

function calculateAndUpdateTestSubmission() {
    fetch('http://localhost:8080/api/questions')
        .then(response => response.json())
        .then(allQuestions => {
            let correctCount = 0;

            answers.forEach(ans => {
                const correctQuestion = allQuestions.find(q => q.id === ans.questionId);
                if (correctQuestion && correctQuestion.correctOption === ans.selectedOption) {
                    correctCount++;
                }
            });

            console.log('Correct Answers:', correctCount);

            const finalScore = Math.round((correctCount / answers.length) * 100); // Score in percentage
            const endTime = new Date().toISOString();

            // Now update the TestSubmission
            fetch(`http://localhost:8080/api/submissions/${testSubmissionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: testSubmissionId,
                    score: finalScore,
                    endTime: endTime
                })
            })
            .then(response => response.json())
            .then(updatedSubmission => {
                console.log('TestSubmission updated successfully:', updatedSubmission);
                alert(`Test completed! Your score: ${finalScore}%`);
                window.location.href = 'student_dashboard.html';
            })
            .catch(error => {
                console.error('Error updating TestSubmission:', error);
            });
        })
        .catch(error => {
            console.error('Error loading questions for scoring:', error);
        });
}



let timerDuration = 1 * 60; //  minutes for testing (later we can fetch from exam.duration)
let timerInterval;

function startTimer() {
    let timeLeft = timerDuration;

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        document.getElementById('timer').innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            alert('Time is up! Test will be submitted.');
            submitTest();
        }
    }, 1000);
}
if (window.location.pathname.includes('take_test.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId');
    //loadQuestionsForExam(examId);
    //startTimer(); // Start timer when exam page loads ✅
    createTestSubmission(examId);
}

let testSubmissionId = null; // 🔥 Save created submission ID here

function createTestSubmission(examId) {
    fetch('http://localhost:8080/api/submissions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            exam: { id: examId },
            student: { id: 1 }, // Hardcoded now (later dynamic)
            startTime: new Date().toISOString(), // Start time now
            score: 0, // Will update later after test ends
            answers: "" // Will update later
        })
    })
    .then(response => response.json())
    .then(submission => {
        testSubmissionId = submission.id;
        console.log('TestSubmission created with ID:', testSubmissionId);

        // Now load questions and timer
        loadQuestionsForExam(examId);
        startTimer();
    })
    .catch(error => {
        console.error('Error creating test submission:', error);
        alert('Error starting test. Please try again.');
    });
}



