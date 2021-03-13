'use strict';

const fullscreenButton = document.querySelector('.fullscreen');
const page = document.querySelector('.page');
const piano = document.querySelector('.piano');
const pianoKeys = document.querySelectorAll('.piano__key');
const notesButton = document.querySelector('.button_type_notes');
const lettersButton = document.querySelector('.button_type_letters');

const keyCodes = {
  68: false,
  70: false,
  71: false,
  72: false,
  73: false,
  74: false,
  75: false,
  76: false,
  79: false,
  82: false,
  84: false,
  85: false
};

const addElemClass = (elem, elemClass) => {
  elem.classList.add(elemClass);
};

const removeElemClass = (elem, elemClass) => {
  elem.classList.remove(elemClass);
};

//swith between keyboard and notes
const switchKeyMode = (evt) => {
  if (evt.target === notesButton && !notesButton.classList.contains('button_active')) {
    pianoKeys.forEach(key => {
      key.querySelector('.piano__note').textContent = key.dataset.note;
    });
    addElemClass(notesButton, 'button_active')
    removeElemClass(lettersButton, 'button_active');
  }

  if (evt.target === lettersButton && !lettersButton.classList.contains('button_active')) {
    pianoKeys.forEach(key => {
      key.querySelector('.piano__note').textContent = key.dataset.letter
    });
    addElemClass(lettersButton, 'button_active');
    removeElemClass(notesButton, 'button_active');
  }
};

notesButton.addEventListener('click', switchKeyMode);
lettersButton.addEventListener('click', switchKeyMode);

//piano functions
const createSound = (src) => {
  const sound = new Audio();
  sound.src = src;
  sound.currentTime = 0;
  return sound;
};

const stopPlaying = (evt) => {
  if (evt.type === 'keyup') {
    //check if key allowed to stop animation
    if (Object.keys(keyCodes).some(key => Number(key) === evt.keyCode)) {
      const key = document.querySelector(`button[data-key='${evt.keyCode}']`);
      handleStop(key);
      keyCodes[evt.keyCode] = false;
    }
  }

  if (evt.type === 'mouseup' || evt.type ==='mouseout') {
    const key = evt.target;
    handleStop(key);
  }
  
  function handleStop(key) {
    if (key.classList.contains('piano__key')) {
      removeElemClass(key, 'piano__key_active');
  
      const letter = key.querySelector('.piano__note');
      removeElemClass(letter, 'piano__note_active');
    }
  }
};

const stopPlayingOnMouseUp = (evt) => {
  stopPlaying(evt);
  piano.removeEventListener('mouseover', playSound);
  document.removeEventListener('mouseup', stopPlayingOnMouseUp);
};

const playSound = (evt) => {
  if (evt.type === 'keydown') {
    //check if key allowed to play sound
    if (Object.keys(keyCodes).some(key => Number(key) === evt.keyCode)) {
      //check if key pressed at this moment
      if (!keyCodes[evt.keyCode]) {
        const key = document.querySelector(`button[data-key='${evt.keyCode}']`);
        handlePLay(key);
        keyCodes[evt.keyCode] = true;
      } else { return }
    }
  }

  if (evt.type === 'mousedown' || evt.type === 'mouseover') {
    const key = evt.target;
    handlePLay(key);

    piano.addEventListener('mouseover', playSound);
    document.addEventListener('mouseup', stopPlayingOnMouseUp);
  }

  function handlePLay(key) {
    if (key.classList.contains('piano__key')) {
      const letter = key.querySelector('.piano__note');
  
      addElemClass(key, 'piano__key_active');
      addElemClass(letter, 'piano__note_active');
  
      const note = key.dataset.note;
      const src = `./assets/audio/${note}.mp3`;
      createSound(src).play();
    } 
  }
};

piano.addEventListener('mousedown', playSound);
piano.addEventListener('mouseout', stopPlaying);
document.addEventListener('keydown', playSound);
document.addEventListener('keyup', stopPlaying);

//fullscreen mode
const toggleFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    page.requestFullscreen();
  }
};

fullscreenButton.addEventListener('click', toggleFullScreen);
