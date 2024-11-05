import '../css/styles.css';
import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const STORAGE_KEY = 'timer-user-selected-date';
const inputEl = document.querySelector('#datetime-picker');
const btnStartEl = document.querySelector('[data-start]');
const btnResetEl = document.querySelector('[data-reset]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

btnStartEl.disabled = true;
btnResetEl.disabled = true;
btnStartEl.addEventListener('click', startBtnClick);
btnResetEl.addEventListener('click', resetBtnClick);

let userSelectedDate = null;
let timeInterval = null;

initTimer();

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0].getTime();
    handleSelectedDate();
  },
};

const fp = flatpickr(inputEl, options);

function handleSelectedDate() {
  if (Date.now() >= userSelectedDate) {
    resetTimer();
    showError();
    return;
  }
  btnStartEl.disabled = false;
  //   btnResetEl.disabled = false;
  //   inputEl.disabled = true;
}

function showError() {
  iziToast.error({
    timeout: 5000,
    position: 'topRight',
    transitionIn: 'bounceInDown',
    transitionOut: 'fadeOutUp',
    transitionInMobile: 'bounceInDown',
    transitionOutMobile: 'fadeOutUp',
    displayMode: 'replace',
    titleSize: '16px',
    messageSize: '16px',
    backgroundColor: '#ef4040',
    theme: 'dark',
    title: 'Error',
    message: 'Please choose a date in the future',
  });
}

function startBtnClick() {
  if (localStorage.getItem(STORAGE_KEY) === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userSelectedDate));
  }
  btnStartEl.disabled = true;
  btnResetEl.disabled = false;
  inputEl.disabled = true;
  visualizeInterval();
  timeInterval = setInterval(visualizeInterval, 1000);
}

function visualizeInterval() {
  const timeLeft = userSelectedDate - Date.now();
  if (timeLeft <= 0) {
    resetBtnClick();
    return;
  }

  const convertedMs = convertMs(timeLeft);
  daysEl.textContent = addLeadingZero(convertedMs.days);
  hoursEl.textContent = addLeadingZero(convertedMs.hours);
  minutesEl.textContent = addLeadingZero(convertedMs.minutes);
  secondsEl.textContent = addLeadingZero(convertedMs.seconds);
}

function resetBtnClick() {
  if (timeInterval != null) clearInterval(timeInterval);
  resetTimer();
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function resetTimer() {
  localStorage.removeItem(STORAGE_KEY);
  btnStartEl.disabled = true;
  btnResetEl.disabled = true;
  inputEl.disabled = false;
  daysEl.textContent = '00';
  hoursEl.textContent = '00';
  minutesEl.textContent = '00';
  secondsEl.textContent = '00';
}

function initTimer() {
  userSelectedDate = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (userSelectedDate === null) {
    return;
  }

  handleSelectedDate();
  startBtnClick();
}
