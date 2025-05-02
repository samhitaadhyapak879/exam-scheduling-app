const apiBase = 'http://localhost:8080';

// Toggle section visibility
function toggleSection(id) {
  const section = document.getElementById(id);
  section.classList.toggle('hidden');
}

// ========== Loaders ==========
async function loadStudents() {
  const res = await fetch(`${apiBase}/api/students`);
  const students = await res.json();
  const container = document.getElementById('students-list');
  const select = document.getElementById('schedule-student-select');
  container.innerHTML = '';
  select.innerHTML = '';

  students.forEach(s => {
    container.innerHTML += `
      <div class="card">
        <strong>${s.name}</strong> - ${s.email} (USN: ${s.usn})
        <button onclick="deleteStudent(${s.id})" class="danger">Delete</button>
      </div>
    `;
    select.innerHTML += `<option value="${s.id}">${s.name} (${s.usn})</option>`;
  });
}

async function loadSubjects() {
  const res = await fetch(`${apiBase}/api/subjects`);
  const subjects = await res.json();
  const container = document.getElementById('subjects-list');
  const subjectSelect = document.getElementById('subject-select');
  const questionSubjectSelect = document.getElementById('question-subject-select');

  container.innerHTML = '';
  subjectSelect.innerHTML = '';
  questionSubjectSelect.innerHTML = '';

  subjects.forEach(sub => {
    container.innerHTML += `<div class="card">${sub.name}</div>`;
    subjectSelect.innerHTML += `<option value="${sub.id}">${sub.name}</option>`;
    questionSubjectSelect.innerHTML += `<option value="${sub.id}">${sub.name}</option>`;
  });
}

async function loadExams() {
  const res = await fetch(`${apiBase}/api/exams`);
  const exams = await res.json();
  const container = document.getElementById('exams-list');
  const examSelect = document.getElementById('examId');
  const questionExamSelect = document.getElementById('exam-question-select');
  const scheduleExamSelect = document.getElementById('schedule-exam-select');

  container.innerHTML = '';
  examSelect.innerHTML = '';
  questionExamSelect.innerHTML = '';
  scheduleExamSelect.innerHTML = '';

  exams.forEach(e => {
    const date = e.examDate?.replace("T", " ").substring(0, 16);
    container.innerHTML += `
      <div class="card">
        <strong>${e.name}</strong> - ${e.subject.name} (${date}, ${e.duration} mins)
        <button onclick="deleteExam(${e.id})" class="danger">Delete</button>
      </div>
    `;
    examSelect.innerHTML += `<option value="${e.id}">${e.subject.name} - ${e.name}</option>`;
    questionExamSelect.innerHTML += `<option value="${e.id}">${e.name}</option>`;
    scheduleExamSelect.innerHTML += `<option value="${e.id}">${e.name}</option>`;
  });
}

async function loadScheduledTests() {
  const res = await fetch(`${apiBase}/api/schedules`);
  const schedules = await res.json();
  const container = document.getElementById('scheduled-tests-list');
  container.innerHTML = '';

  schedules.forEach(s => {
    const dt = new Date(s.scheduledDateTime).toLocaleString();
    container.innerHTML += `
      <div class="card">
        <strong>Student:</strong> ${s.student.name} (${s.student.usn})<br>
        <strong>Exam:</strong> ${s.exam.name}<br>
        <strong>Date:</strong> ${dt}
      </div>
    `;
  });
}

// ========== Deletion ==========
async function deleteStudent(id) {
  if (!confirm("Are you sure?")) return;
  await fetch(`${apiBase}/api/students/${id}`, { method: 'DELETE' });
  loadStudents();
}

async function deleteExam(id) {
  if (!confirm("Delete this exam?")) return;
  await fetch(`${apiBase}/api/exams/${id}`, { method: 'DELETE' });
  loadExams();
}

// ========== Add Handlers ==========
document.getElementById('add-subject-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('new-subject-name').value;
  await fetch(`${apiBase}/api/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  e.target.reset();
  loadSubjects();
});

document.getElementById('add-exam-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('exam-name').value;
  const examDate = document.getElementById('exam-date').value;
  const duration = document.getElementById('duration').value;
  const subjectId = document.getElementById('subject-select').value;

  const payload = {
    name,
    examDate,
    duration,
    subject: { id: parseInt(subjectId) }
  };

  await fetch(`${apiBase}/api/exams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  e.target.reset();
  loadExams();
});

document.getElementById('questionForm').addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    questionText: document.getElementById('questionText').value,
    optionA: document.getElementById('optionA').value,
    optionB: document.getElementById('optionB').value,
    optionC: document.getElementById('optionC').value,
    optionD: document.getElementById('optionD').value,
    correctOption: document.getElementById('correctOption').value,
    exam: { id: parseInt(document.getElementById('examId').value) },
    subject: { id: parseInt(document.getElementById('question-subject-select').value) }
  };

  await fetch(`${apiBase}/api/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  e.target.reset();
});

document.getElementById('schedule-form').addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    student: { id: parseInt(document.getElementById('schedule-student-select').value) },
    exam: { id: parseInt(document.getElementById('schedule-exam-select').value) },
    scheduledDateTime: document.getElementById('schedule-datetime').value
  };

  await fetch(`${apiBase}/api/schedules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  e.target.reset();
  loadScheduledTests();
});

// Load Questions by Exam
document.getElementById('exam-question-select').addEventListener('change', function () {
  const examId = this.value;
  fetch(`${apiBase}/api/questions/exam/${examId}`)
    .then(res => res.json())
    .then(questions => {
      const container = document.getElementById('questions-list');
      container.innerHTML = '';
      questions.forEach(q => {
        container.innerHTML += `
          <div class="card">
            ${q.questionText}
            <button onclick="deleteQuestion(${q.id})" class="danger">Delete</button>
          </div>
        `;
      });
    });
});

async function deleteQuestion(id) {
  if (!confirm("Delete this question?")) return;
  await fetch(`${apiBase}/api/questions/${id}`, { method: 'DELETE' });
  document.getElementById('exam-question-select').dispatchEvent(new Event('change'));
}

function logout() {
    localStorage.removeItem("studentId"); // or remove all with localStorage.clear()
    window.location.href = "index.html"; // or login.html
}
  

// ======= On Page Load =======
loadStudents();
loadSubjects();
loadExams();
loadScheduledTests();
