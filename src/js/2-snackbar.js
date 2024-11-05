import '../css/styles.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formEl = document.querySelector('form');
const radiosEl = document.getElementsByName('state');
const btnEl = document.querySelector('button');

btnEl.disabled = true;

formEl.addEventListener('input', formOnChange);
formEl.addEventListener('submit', btnOnSubmit);

function formOnChange(event) {
  if (event.target.checked) {
    btnEl.disabled = false;
  }
}

function btnOnSubmit(event) {
  event.preventDefault();
  const delay = event.target[0].value;

  for (const radio of radiosEl) {
    if (radio.checked) {
      createNotification(radio.value, delay);
    }
  }

  return;
}

function createNotification(state, delay) {
  const promise = new Promise((res, rej) => {
    const isPromiseFulfilled = state === 'fulfilled' ? true : false;

    setTimeout(() => {
      if (isPromiseFulfilled) {
        showFulfilled(delay);
      } else {
        showRejected(delay);
      }
    }, delay);
  });
}

const msgOptions = {
  timeout: 5000,
  position: 'topRight',
  transitionIn: 'bounceInDown',
  transitionOut: 'fadeOutUp',
  transitionInMobile: 'bounceInDown',
  transitionOutMobile: 'fadeOutUp',
  messageSize: '16px',
  messageColor: 'black',
};

function showFulfilled(delay) {
  iziToast.show({
    ...msgOptions,
    backgroundColor: '#a1cc74',
    message: `✅ Fulfilled promise in ${delay} ms`,
  });
}

function showRejected(delay) {
  iziToast.show({
    ...msgOptions,
    backgroundColor: '#fdbbbb',
    message: `❌ Rejected promise in ${delay} ms`,
  });
}
