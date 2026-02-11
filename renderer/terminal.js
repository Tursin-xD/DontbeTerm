/* global Terminal, FitAddon */

const DARK_THEME = {
  background: '#1e1e1e',
  foreground: '#cccccc',
  cursor: '#ffffff',
  selectionBackground: '#264f78',
  black: '#000000',
  red: '#cd3131',
  green: '#0dbc79',
  yellow: '#e5e510',
  blue: '#2472c8',
  magenta: '#bc3fbc',
  cyan: '#11a8cd',
  white: '#e5e5e5',
  brightBlack: '#666666',
  brightRed: '#f14c4c',
  brightGreen: '#23d18b',
  brightYellow: '#f5f543',
  brightBlue: '#3b8eea',
  brightMagenta: '#d670d6',
  brightCyan: '#29b8db',
  brightWhite: '#e5e5e5'
};

const LIGHT_THEME = {
  background: '#ffffff',
  foreground: '#333333',
  cursor: '#333333',
  selectionBackground: '#add6ff',
  black: '#000000',
  red: '#cd3131',
  green: '#008000',
  yellow: '#795e26',
  blue: '#0451a5',
  magenta: '#bc05bc',
  cyan: '#0598bc',
  white: '#e5e5e5',
  brightBlack: '#666666',
  brightRed: '#cd3131',
  brightGreen: '#14ce14',
  brightYellow: '#b5ba00',
  brightBlue: '#0451a5',
  brightMagenta: '#bc05bc',
  brightCyan: '#0598bc',
  brightWhite: '#a5a5a5'
};

class TerminalManager {
  constructor() {
    this.instances = new Map();
    this.isLight = false;
    this.fontSize = 14; // Default font size
  }

  create(tabId, containerElement) {
    console.log(`Creating terminal for tab ${tabId}`);

    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: this.fontSize,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: this.isLight ? LIGHT_THEME : DARK_THEME
    });

    const fitAddon = new FitAddon.FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(containerElement);
    // Don't fit here — container may be hidden (display:none).
    // ResizeObserver below handles fitting when it becomes visible.

    // Auto-fit whenever the container's size changes (including becoming visible)
    const observer = new ResizeObserver(() => {
      if (containerElement.offsetWidth > 0 && containerElement.offsetHeight > 0) {
        fitAddon.fit();
        window.api.resizeTerminal(tabId, terminal.cols, terminal.rows);
      }
    });
    observer.observe(containerElement);

    terminal.onData((data) => {
      window.api.sendTerminalData(tabId, data);
    });

    // Handle Shift+Enter for newline (send same escape sequence as Option+Enter)
    terminal.attachCustomKeyEventHandler((event) => {
      if (event.type === 'keydown' && event.key === 'Enter' && event.shiftKey) {
        console.log('Shift+Enter detected, sending ESC+Enter sequence');
        // Send ESC + carriage return (same as Option+Enter in xterm.js)
        window.api.sendTerminalData(tabId, '\x1b\r');
        return false; // Prevent default behavior
      }
      return true;
    });

    console.log('Shift+Enter handler attached');

    // Enable drag and drop for files/folders
    containerElement.addEventListener('dragover', (e) => {
      console.log('Dragover event detected');
      e.preventDefault();
      e.stopPropagation();
    });

    containerElement.addEventListener('drop', (e) => {
      console.log('Drop event detected');
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      console.log(`Dropped ${files.length} files`);

      if (files && files.length > 0) {
        const paths = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(`File ${i}:`, file.name, file.path);

          // Try to access path property directly
          const filePath = file.path || file.name;
          const quotedPath = filePath.includes(' ') ? `"${filePath}"` : filePath;
          paths.push(quotedPath);
        }

        if (paths.length > 0) {
          const pathString = paths.join(' ');
          console.log(`Sending paths to terminal: ${pathString}`);
          window.api.sendTerminalData(tabId, pathString);
        }
      }
    });

    console.log('Drag and drop handlers attached');

    this.instances.set(tabId, { terminal, fitAddon, container: containerElement, observer });

    return { cols: terminal.cols, rows: terminal.rows };
  }

  write(tabId, data) {
    const instance = this.instances.get(tabId);
    if (instance) {
      instance.terminal.write(data);
    }
  }

  fit(tabId) {
    const instance = this.instances.get(tabId);
    if (instance) {
      instance.fitAddon.fit();
      return { cols: instance.terminal.cols, rows: instance.terminal.rows };
    }
    return null;
  }

  focus(tabId) {
    const instance = this.instances.get(tabId);
    if (instance) {
      instance.terminal.focus();
    }
  }

  scrollToBottom(tabId) {
    const instance = this.instances.get(tabId);
    if (instance) {
      instance.terminal.scrollToBottom();
    }
  }

  destroy(tabId) {
    const instance = this.instances.get(tabId);
    if (instance) {
      instance.observer.disconnect();
      instance.terminal.dispose();
      instance.container.remove();
      this.instances.delete(tabId);
    }
  }

  setLightMode(isLight) {
    this.isLight = isLight;
    const theme = isLight ? LIGHT_THEME : DARK_THEME;
    for (const [, { terminal }] of this.instances) {
      terminal.options.theme = theme;
    }
  }

  increaseFontSize() {
    console.log(`Increasing font size from ${this.fontSize}`);
    this.fontSize = Math.min(this.fontSize + 2, 32); // Max 32px
    console.log(`New font size: ${this.fontSize}`);
    for (const [tabId, { terminal, fitAddon }] of this.instances) {
      terminal.options.fontSize = this.fontSize;
      // Refit after font size change
      setTimeout(() => {
        fitAddon.fit();
        window.api.resizeTerminal(tabId, terminal.cols, terminal.rows);
      }, 10);
    }
  }

  decreaseFontSize() {
    console.log(`Decreasing font size from ${this.fontSize}`);
    this.fontSize = Math.max(this.fontSize - 2, 8); // Min 8px
    console.log(`New font size: ${this.fontSize}`);
    for (const [tabId, { terminal, fitAddon }] of this.instances) {
      terminal.options.fontSize = this.fontSize;
      // Refit after font size change
      setTimeout(() => {
        fitAddon.fit();
        window.api.resizeTerminal(tabId, terminal.cols, terminal.rows);
      }, 10);
    }
  }

  resetFontSize() {
    console.log(`Resetting font size from ${this.fontSize} to 14`);
    this.fontSize = 14; // Default size
    for (const [tabId, { terminal, fitAddon }] of this.instances) {
      terminal.options.fontSize = this.fontSize;
      // Refit after font size change
      setTimeout(() => {
        fitAddon.fit();
        window.api.resizeTerminal(tabId, terminal.cols, terminal.rows);
      }, 10);
    }
  }
}
