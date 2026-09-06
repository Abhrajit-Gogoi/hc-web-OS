//global state and initialization
document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initSystemClock();
  
  // Phase 2: Initial Welcome Window
  new OSWindow('Welcome', `
    <h1>Welcome to SereneOS</h1>
    <p>System version 1.0 initialized successfully.</p>
    <p>Core system environment loaded with sandbox app runtime architecture.</p>
  `, { x: window.innerWidth / 2 - 210, y: window.innerHeight / 2 - 150, width: 420 });
});

function initLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingScreen.classList.add("fade-out");
    }, 800);
  });
}

function initSystemClock() {
  const clockElement = document.getElementById("system-clock");
  function updateClock() {
    const now = new Date();
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    clockElement.textContent = now.toLocaleTimeString([], options);
  }
  updateClock();
  setInterval(updateClock, 1000);
}

