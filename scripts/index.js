'use strict';

import { keyCodes } from './constants.js';

const fullscreenButton = document.querySelector('.fullscreen');
const page = document.querySelector('.page');
const piano = document.querySelector('.piano');
const pianoKeys = document.querySelectorAll('.piano__key');
const notesButton = document.querySelector('.button_type_notes');
const lettersButton = document.querySelector('.button_type_letters');
const noMarksButton = document.querySelector('.button_type_nomarks');

const addElClass = (elem, elemClass) => elem.classList.add(elemClass);

const removeElClass = (elem, elemClass) => elem.classList.remove(elemClass);

//swith between keyboard and notes
const switchKeyMode = (evt) => {
  if (evt.target === notesButton && !notesButton.classList.contains('button_active')) {
    pianoKeys.forEach(key => key.querySelector('.piano__note').textContent = key.dataset.note);
    addElClass(notesButton, 'button_active')
    removeElClass(lettersButton, 'button_active');
    removeElClass(noMarksButton, 'button_active');
  }

  if (evt.target === lettersButton && !lettersButton.classList.contains('button_active')) {
    pianoKeys.forEach(key => key.querySelector('.piano__note').textContent = key.dataset.letter);
    addElClass(lettersButton, 'button_active');
    removeElClass(notesButton, 'button_active');
    removeElClass(noMarksButton, 'button_active');
  }

  if (evt.target === noMarksButton && !noMarksButton.classList.contains('button_active')) {
    pianoKeys.forEach(key => key.querySelector('.piano__note').textContent = '');
    addElClass(noMarksButton, 'button_active');
    removeElClass(notesButton, 'button_active');
    removeElClass(lettersButton, 'button_active');
  }
};

notesButton.addEventListener('click', switchKeyMode);
lettersButton.addEventListener('click', switchKeyMode);
noMarksButton.addEventListener('click', switchKeyMode);

//piano functions
const createSound = (src) => {
  const sound = new Audio();
  sound.src = src;
  sound.currentTime = 0;
  sound.volume = 0.2;
  return sound;
};

const handlePlay = (evt) => {
  let key;
  if (evt.type === 'keydown') {
  //check if key allowed to play sound
    if (Object.keys(keyCodes).some(key => key === evt.code)) {
    //check if key pressed at this moment
      if (!keyCodes[evt.code]) {
        key = document.querySelector(`button[data-key='${evt.code}']`);
        keyCodes[evt.code] = true;
      } else return;
    } else return;
  } else key = evt.target;

  if (key.classList.contains('piano__key')) {
    const letter = key.querySelector('.piano__note');
      
    addElClass(key, 'piano__key_active');
    addElClass(letter, 'piano__note_active');
      
    const note = key.dataset.note;
    const src = `./assets/audio/${note}.mp3`;
    createSound(src).play();
    playedNotes.push(note);
    showRecordedNotes();
  }
};

const handleStop = (evt) => {
  let key;
  if (evt.type === 'keyup') {
    //check if key allowed to stop animation
    if (Object.keys(keyCodes).some(key => key === evt.code)) {
      key = document.querySelector(`button[data-key='${evt.code}']`);
      keyCodes[evt.code] = false;
    } else return;
  } else key = evt.target;

  if (key.classList.contains('piano__key')) {
    removeElClass(key, 'piano__key_active');
      
    const letter = key.querySelector('.piano__note');
    removeElClass(letter, 'piano__note_active');
  }
};

const startRespond = (evt) => {
  handlePlay(evt);
  piano.addEventListener('mouseover', handlePlay);
  document.addEventListener('mouseup', stopRespond);
};

const stopRespond = (evt) => {
  handleStop(evt);
  piano.removeEventListener('mouseover', handlePlay);
  document.removeEventListener('mouseup', stopRespond);
};

piano.addEventListener('mousedown', startRespond);
piano.addEventListener('mouseout', handleStop);
document.addEventListener('keydown', handlePlay);
document.addEventListener('keyup', handleStop);

//fullscreen mode
const toggleFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    page.requestFullscreen();
  }
};

fullscreenButton.addEventListener('click', toggleFullScreen);

//record and play notes
const resetButton = document.querySelector('.cntrls-button_type_reset');
const playButton = document.querySelector('.cntrls-button_type_play');
const stopButton = document.querySelector('.cntrls-button_type_stop');
const backspaceButton = document.querySelector('.cntrls-button_type_backspace');
const notesRecorder = document.querySelector('.notes-recorder__notes');
const hideRecorderButton = document.querySelector('.button_type_toggle-recorder');
const recorderSection = document.querySelector('.recorder-section');
let playedNotes = [];
let isPlayingStopped = false;
let isPlaying = false;

const showRecordedNotes = () => {
  notesRecorder.textContent = playedNotes.join(' ');
};

const resetRecord = () => {
  playedNotes = [];
  isPlaying = false;
  showRecordedNotes();
};

const deleteLastNote = () => {
  playedNotes.pop();
  showRecordedNotes();
};

const stopPlayingRecordedNotes = () => {
  if (!isPlayingStopped && isPlaying) {
    return isPlayingStopped = true;
  }
  return;
};

const playRecordedNotes = () => {
  isPlaying = true;
  let index = 1;
  const src = `./assets/audio/${playedNotes[0]}.mp3`;
  const sound = createSound(src);
  sound.play();

  sound.addEventListener('timeupdate', soundHandler);

  function soundHandler() {
    if (isPlayingStopped) {
      sound.removeEventListener('timeupdate', soundHandler);
      isPlaying = false;
      isPlayingStopped = false;
      return;
    }
    if (sound.currentTime > .4) {
      if (index < playedNotes.length) {
        if (index === playedNotes.length - 1) {
          sound.src = `./assets/audio/${playedNotes[index]}.mp3`;
          sound.play();
          sound.removeEventListener('timeupdate', soundHandler);
          isPlaying = false;
          return;
        }
        sound.src = `./assets/audio/${playedNotes[index]}.mp3`;
        sound.currentTime = 0;
        sound.play();
        index++;
      }
    }
  }
};

const toggleRecorder = () => {
  if (recorderSection.classList.contains('recorder-section_hidden')) {
    removeElClass(recorderSection, 'recorder-section_hidden');
    hideRecorderButton.textContent = 'hide';
  } else {
    addElClass(recorderSection, 'recorder-section_hidden');
    hideRecorderButton.textContent = 'show';
  }
  
};

resetButton.addEventListener('click', resetRecord);
backspaceButton.addEventListener('click', deleteLastNote);
playButton.addEventListener('click', playRecordedNotes);
stopButton.addEventListener('click', stopPlayingRecordedNotes);
hideRecorderButton.addEventListener('click', toggleRecorder);
