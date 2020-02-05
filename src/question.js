export class Question {
  static create(question) {
    return fetch(
      'https://native-js-example-project.firebaseio.com/questions.json',
      {
        method: 'POST',
        body: JSON.stringify(question),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(response => response.json())
      .then(response => {
        question.id = response.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Question.renderList);
  }

  static renderList() {
    const allQuestions = getQuestionsFromLocalStorage();

    const html = allQuestions.length
      ? allQuestions.map(toCard).join('')
      : `<div class="mui--text-headline">Вопросов нет</div>`;

    const list = document.getElementById('list');

    list.innerHTML = html;
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve(`<p class="error">У вас нет токена!</p>`);
    }

    return fetch(
      `https://native-js-example-project.firebaseio.com/questions.json?auth=${token}`
    )
      .then(response => response.json())
      .then(response => {
        if (response && response.error) {
          return `<p class="error">${response.error}</p>`;
        }

        return response
          ? Object.keys(response).map(key => ({
              ...response[key],
              id: key,
            }))
          : [];
      });
  }

  static listToHTML(allQuestions) {
    return allQuestions.length
      ? `
      <ol>${allQuestions.map(q => `<li>${q.text}</li>`).join('')}</ol>
    `
      : `<p>Вопросов нет</p>`;
  }
}

function addToLocalStorage(question) {
  const allQuestions = getQuestionsFromLocalStorage();
  allQuestions.push(question);
  localStorage.setItem('questions', JSON.stringify(allQuestions));
}

function getQuestionsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('questions') || '[]');
}

function toCard(question) {
  return `
    <div class="mui--text-black-54">
      ${new Date(question.date).toLocaleDateString()}
      ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>${question.text}</div>
    <br />
    `;
}
