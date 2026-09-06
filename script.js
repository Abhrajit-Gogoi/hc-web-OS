//global state and initialization
document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initSystemClock();
  
  // Phase 2: Initial Welcome Window
  new OSWindow('Welcome', `
    <h1>Welcome to SereneOS</h1>
    <p>System initialized successfully!.....</p>
    <p>SereneOS is here to relieve you of your stress with its minimalistic and gracious design</p>
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

/**
 * Global Layering Stack Manager
 */
class WindowManager {
  constructor() {
    this.baseZIndex = 100;
    this.windows = [];
    this.desktopCanvas = document.getElementById('desktop-canvas');
  }

  addWindow(osWindow) {
    this.windows.push(osWindow);
    this.desktopCanvas.appendChild(osWindow.element);
    this.bringToFront(osWindow);
  }

  removeWindow(osWindow) {
    this.windows = this.windows.filter(w => w !== osWindow);
    osWindow.element.remove();
  }

  bringToFront(osWindow) {
    this.baseZIndex++;
    osWindow.element.style.zIndex = this.baseZIndex;
  }
}

const wm = new WindowManager();

/**
 * Dynamic Window Lifecycle & Controller Class
 */
class OSWindow {
  constructor(title, contentHTML, options = {}) {
    this.id = 'win-' + Math.random().toString(36).substr(2, 9);
    this.title = title;
    this.contentHTML = contentHTML;
    
    // State Tracking
    this.isMaximized = false;
    this.isMinimized = false;
    
    // Spatial Coordinates
    this.rect = { 
      top: options.y || 100, 
      left: options.x || 150, 
      width: options.width || 400, 
      height: options.height || 'auto' 
    };

    this.buildDOM();
    this.attachPointerEvents();
    this.attachControls();

    wm.addWindow(this);
  }

  buildDOM() {
    this.element = document.createElement('div');
    this.element.className = 'window';
    this.element.id = this.id;
    this.element.style.top = `${this.rect.top}px`;
    this.element.style.left = `${this.rect.left}px`;
    this.element.style.width = `${this.rect.width}px`;
    if (this.rect.height !== 'auto') this.element.style.height = `${this.rect.height}px`;

    this.element.innerHTML = `
      <div class="window-header">
        <div class="window-controls">
          <button class="control close" aria-label="Close"></button>
          <button class="control minimize" aria-label="Minimize"></button>
          <button class="control maximize" aria-label="Maximize"></button>
        </div>
        <div class="window-title">${this.title}</div>
      </div>
      <div class="window-body">${this.contentHTML}</div>
    `;

    // Global focus acquisition
    this.element.addEventListener('pointerdown', () => wm.bringToFront(this));
  }

  attachPointerEvents() {
    const header = this.element.querySelector('.window-header');
    let isDragging = false;
    let originX, originY, initialLeft, initialTop;

    header.addEventListener('pointerdown', (e) => {
      // Prevent drag execution if clicking window controls
      if (e.target.classList.contains('control')) return;
      
      isDragging = true;
      originX = e.clientX;
      originY = e.clientY;
      
      // Parse current position payload
      initialLeft = parseFloat(getComputedStyle(this.element).left) || 0;
      initialTop = parseFloat(getComputedStyle(this.element).top) || 0;
      
      // Lock pointer to header to maintain tracking outside element bounds
      header.setPointerCapture(e.pointerId);
    });

    header.addEventListener('pointermove', (e) => {
      if (!isDragging || this.isMaximized) return;

      let newLeft = initialLeft + (e.clientX - originX);
      let newTop = initialTop + (e.clientY - originY);

      // Boundary Resolution Constants
      const topBarHeight = 30;
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      const windowWidth = this.element.offsetWidth;

      // Top constraint (prevent sliding under system bar)
      if (newTop < topBarHeight) newTop = topBarHeight;
      
      // Bottom constraint (keep header accessible)
      if (newTop > canvasHeight - 40) newTop = canvasHeight - 40;
      
      // Left/Right constraints (prevent total viewport exit)
      if (newLeft < -windowWidth + 50) newLeft = -windowWidth + 50;
      if (newLeft > canvasWidth - 50) newLeft = canvasWidth - 50;

      this.element.style.left = `${newLeft}px`;
      this.element.style.top = `${newTop}px`;
    });

    header.addEventListener('pointerup', (e) => {
      isDragging = false;
      header.releasePointerCapture(e.pointerId);
    });
  }

  attachControls() {
    const closeBtn = this.element.querySelector('.close');
    const minBtn = this.element.querySelector('.minimize');
    const maxBtn = this.element.querySelector('.maximize');

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.minimize();
    });

    maxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.maximize();
    });
  }

  close() {
    wm.removeWindow(this);
  }

  minimize() {
    this.isMinimized = true;
    this.element.classList.add('minimized');
  }

  maximize() {
    if (this.isMaximized) {
      this.element.classList.remove('maximized');
      this.isMaximized = false;
    } else {
      this.element.classList.add('maximized');
      this.isMaximized = true;
    }
  }
}


