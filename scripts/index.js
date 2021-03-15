'use strict';

const fullscreenButton = document.querySelector('.fullscreen');
const page = document.querySelector('.page');
const piano = document.querySelector('.piano');
const pianoKeys = document.querySelectorAll('.piano__key');
const notesButton = document.querySelector('.button_type_notes');
const lettersButton = document.querySelector('.button_type_letters');
const noMarksButton = document.querySelector('.button_type_nomarks');

const keyCodes = {
  81: false,
  87: false,
  69: false,
  82: false,
  50: false,
  51: false,
  53: false,
  84: false,
  89: false,
  85: false,
  54: false,
  55: false,
  73: false,
  79: false,
  80: false,
  57: false,
  48: false,
  90: false,
  88: false,
  67: false,
  83: false,
  68: false,
  70: false,
  86: false,
  66: false,
  78: false,
  77: false,
  72: false,
  74: false,
  188: false,
  190: false,
  191: false,
  222: false,
  76: false,
  186: false,
  219: false
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
    removeElemClass(noMarksButton, 'button_active');
  }

  if (evt.target === lettersButton && !lettersButton.classList.contains('button_active')) {
    pianoKeys.forEach(key => {
      key.querySelector('.piano__note').textContent = key.dataset.letter;
    });
    addElemClass(lettersButton, 'button_active');
    removeElemClass(notesButton, 'button_active');
    removeElemClass(noMarksButton, 'button_active');
  }

  if (evt.target === noMarksButton && !noMarksButton.classList.contains('button_active')) {
    pianoKeys.forEach(key => {
      key.querySelector('.piano__note').textContent = '';
    });
    addElemClass(noMarksButton, 'button_active');
    removeElemClass(notesButton, 'button_active');
    removeElemClass(lettersButton, 'button_active');
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
      playedNotes.push(note);
      showRecordedNotes();
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

//play notes
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
    removeElemClass(recorderSection, 'recorder-section_hidden');
    hideRecorderButton.textContent = 'hide';
  } else {
    addElemClass(recorderSection, 'recorder-section_hidden');
    hideRecorderButton.textContent = 'show';
  }
  
};

resetButton.addEventListener('click', resetRecord);
backspaceButton.addEventListener('click', deleteLastNote);
playButton.addEventListener('click', playRecordedNotes);
stopButton.addEventListener('click', stopPlayingRecordedNotes);
hideRecorderButton.addEventListener('click', toggleRecorder);
