const questionsContainer = document.getElementById('questionsContainer');
const submitBtn = document.getElementById('submitBtn');
const resultsContainer = document.getElementById('results');

async function fetchQuestions() {
  const response = await fetch('testData.json');
  const testData = await response.json();
  return testData.questions;
}

function createQuestionElement(questionData, questionIndex) {
  const questionElement = document.createElement('div');
  questionElement.classList.add('question');
  questionElement.innerHTML = `
    <p>${questionData.question}</p>
    ${questionData.answers.map((answer, index) => `
      <div>
        <input type="radio" id="answer-${questionIndex}-${index}" name="question-${questionIndex}" value="${answer.answer}">
        <label class="answer" for="answer-${questionIndex}-${index}">${answer.answer}</label>
      </div>
    `).join('')}
  `;
  return questionElement;
}

function calculateResults(questions) {
  let score = 0;
  questions.forEach(question => {
    const selectedAnswer = document.querySelector(`input[name="question-${questions.indexOf(question)}"]:checked`);
    if (selectedAnswer && selectedAnswer.value === question.answers.find(ans => ans.isCorrect).answer) {
      score++;
      selectedAnswer.nextElementSibling.classList.add('correct');
    } else if (selectedAnswer) {
      selectedAnswer.nextElementSibling.classList.add('incorrect');
    }
  });
  return score;
}

async function init() {
  const questions = await fetchQuestions();
  questions.forEach((question, index) => {
    const questionElement = createQuestionElement(question, index);
    questionsContainer.appendChild(questionElement);
  });

  submitBtn.addEventListener('click', () => {
    const score = calculateResults(questions);
    resultsContainer.textContent = `Ваш результат: ${score} з ${questions.length}`;
    highlightAnswers(questions);
  });
}

function highlightAnswers(questions) {
  questions.forEach((question, index) => {
    const selectedAnswer = document.querySelector(`input[name="question-${index}"]:checked`);
    if (selectedAnswer && selectedAnswer.value === question.answers.find(ans => ans.isCorrect).answer) {
      selectedAnswer.nextElementSibling.classList.add('correct');
    } else if (selectedAnswer) {
      selectedAnswer.nextElementSibling.classList.add('incorrect');
    }
  });
}

init();
