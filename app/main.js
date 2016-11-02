const { app, BrowserWindow } = require('electron');
const mainStub = require('./main/mainStub.js');

mainStub.setFoo(42, process.type);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1200,
        height: 900
    });

    // and load the index.html of the app.
    win.loadURL(`file://${__dirname}/index.html`);

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        flushWindowState();

        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    win.on('move', trackWindow);
    win.on('resize', trackWindow);
}

let windowBox;
let syncTimer;

function flushWindowState () {
    if (syncTimer) {
        clearTimeout(syncTimer);
        syncTimer = null;
    }
    //TODO
}

function trackWindow () {
    var bounds;

    if (win.isMaximized()) {
        bounds = { maximized: true };
    } else {
        bounds = this.mainWindow.getBounds();
        bounds.maximized = false;
    }

    windowBox = bounds;

    if (!syncTimer) {
        syncTimer = setTimeout(() => {
            syncTimer = null;
            flushWindowState();
        });
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
