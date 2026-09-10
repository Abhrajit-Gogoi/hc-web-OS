document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initSystemClock();
  initTheme();
  initAudio();
  
  new OSWindow('Welcome', `
    <h1>Welcome to SereneOS</h1>
    <p>System initialized successfully!.....</p>
    <p>SereneOS is here to relieve you of your stress with its minimalistic and gracious design.</p>
  `, { x: window.innerWidth / 2 - 210, y: window.innerHeight / 2 - 150, width: 420 });
});

function initAudio() {
  const audio = document.getElementById('bg-audio');
  audio.volume = 0.3;
  const playAudio = () => {
    audio.play().catch(() => {});
    document.removeEventListener('pointerdown', playAudio);
  };
  document.addEventListener('pointerdown', playAudio);
}

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const desktop = document.getElementById('desktop');

  const currentTheme = localStorage.getItem('serene_theme') || 'light';
  if (currentTheme === 'dark') {
    desktop.classList.add('dark-mode');
    icon.src = 'moon.png';
  }

  toggle.addEventListener('click', () => {
    desktop.classList.toggle('dark-mode');
    const isDark = desktop.classList.contains('dark-mode');
    icon.src = isDark ? 'moon.png' : 'sun.png';
    localStorage.setItem('serene_theme', isDark ? 'dark' : 'light');
  });
}

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

function launchApp(appId) {
  if (appId === 'clock') {
    new OSWindow('Clock', '', { 
      x: window.innerWidth / 2 - 175, 
      y: window.innerHeight / 2 - 125, 
      width: 350, 
      height: 250,
      iframeSrc: 'clock.html' 
    });
  } else if (appId === 'calculator') {
    new OSWindow('Calculator', '', {
      x: window.innerWidth / 2 - 150,
      y: window.innerHeight / 2 - 200,
      width: 300,
      height: 400,
      iframeSrc: 'calculator.html'
    });
  } else if (appId === 'notes') {
    new OSWindow('Notes', '', {
      x: window.innerWidth / 2 - 200,
      y: window.innerHeight / 2 - 200,
      width: 400,
      height: 400,
      iframeSrc: 'notes.html'
    });
  } else if (appId === 'gta') {
    new OSWindow('gta', '', {
      x: window.innerWidth / 2 - 480,
      y: window.innerHeight / 2 - 300,
      width: 960,
      height: 600,
      iframeSrc: 'gta.html'
    });
  } else if (appId === 'basketball') {
    new OSWindow('basketball', '', {
      x: window.innerWidth / 2 - 480,
      y: window.innerHeight / 2 - 300,
      width: 960,
      height: 600,
      iframeSrc: 'basketball.html'
    });
  } else if (appId === 'doom') {
    new OSWindow('DOOM 1993', '', {
      x: window.innerWidth / 2 - 425,
      y: window.innerHeight / 2 - 300,
      width: 850,
      height: 600,
      iframeSrc: 'doom.html'
    });
  }
}


class OSWindow {
  constructor(title, contentHTML, options = {}) {
    this.id = 'win-' + Math.random().toString(36).substr(2, 9);
    this.title = title;
    this.contentHTML = contentHTML;
    this.iframeSrc = options.iframeSrc || null;
    
    this.isMaximized = false;
    this.isMinimized = false;
    
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

    let bodyContent = this.contentHTML;
    let bodyClass = "window-body";

    if (this.iframeSrc) {
      bodyContent = `<iframe src="${this.iframeSrc}" class="window-iframe" sandbox="allow-scripts allow-same-origin"></iframe>`;
      bodyClass += " sandboxed";
    }

    this.element.innerHTML = `
      <div class="window-header">
        <div class="window-controls">
          <button class="control close" aria-label="Close"></button>
          <button class="control minimize" aria-label="Minimize"></button>
          <button class="control maximize" aria-label="Maximize"></button>
        </div>
        <div class="window-title">${this.title}</div>
      </div>
      <div class="${bodyClass}">${bodyContent}</div>
    `;

    this.element.addEventListener('pointerdown', () => wm.bringToFront(this));
  }

  attachPointerEvents() {
    const header = this.element.querySelector('.window-header');
    let isDragging = false;
    let originX, originY, initialLeft, initialTop;

    header.addEventListener('pointerdown', (e) => {
      if (e.target.classList.contains('control')) return;
      
      isDragging = true;
      originX = e.clientX;
      originY = e.clientY;
      
      initialLeft = parseFloat(getComputedStyle(this.element).left) || 0;
      initialTop = parseFloat(getComputedStyle(this.element).top) || 0;
      
      header.setPointerCapture(e.pointerId);
    });

    header.addEventListener('pointermove', (e) => {
      if (!isDragging || this.isMaximized) return;

      let newLeft = initialLeft + (e.clientX - originX);
      let newTop = initialTop + (e.clientY - originY);

      const topBarHeight = 30;
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      const windowWidth = this.element.offsetWidth;

      if (newTop < topBarHeight) newTop = topBarHeight;
      if (newTop > canvasHeight - 40) newTop = canvasHeight - 40;
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
      this.isMinimized();
    });

    maxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isMaximized();
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
