import './style.css';
import { isValid, createModal } from './utils';
import { Question } from './question';

let authModule;
const form = document.getElementById('form');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');
const modalBtn = document.getElementById('modal-btn');

window.addEventListener('load', Question.renderList);
form.addEventListener('submit', submitFormHandler);
modalBtn.addEventListener('click', openModal);
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value);
});

function submitFormHandler(event) {
  event.preventDefault();

  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON(),
    };

    submitBtn.disabled = true;
    Question.create(question).then(() => {
      input.value = '';
      input.className = '';
    });
  }
}

function openModal() {
  let authForm;

  if (authModule) {
    authForm = authModule.getAuthForm();
    createModal('Авторизация', authForm);
    document
      .getElementById('auth-form')
      .addEventListener('submit', authFormHandler, { once: true });
  } else {
    lazyImportAuthModule().then(() => {
      authForm = authModule.getAuthForm();
      createModal('Авторизация', authForm);
      document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, { once: true });
    });
  }
}

function authFormHandler(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button');
  const email = event.target.querySelector('#email').value;
  const password = event.target.querySelector('#password').value;

  btn.disabled = true;
  authModule
    .authWithEmailAndPassword(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(_ => (btn.disabled = false));
}

function renderModalAfterAuth(content) {
  if (typeof content === 'string') {
    createModal('Ошибка', content);
  } else {
    createModal('Список вопросов', Question.listToHTML(content));
  }
}

function lazyImportAuthModule() {
  return import('./auth').then(module => {
    authModule = module;
  });
}
