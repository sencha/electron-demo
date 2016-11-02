const { app, BrowserWindow } = require('electron');
const mainStub = require('./main/mainStub.js');

const Path = require('path');
const os = require('os');
const fs = require('fs');

mainStub.setFoo(42, process.type);

const COMPANY = 'Acme';
const COMPANY_LOWER = COMPANY.toLowerCase();
const WINDOW_STATE_FILE = 'app-state.json';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let windowBox;
let syncTimer;

let profileDir = (function () {
    var ret = os.homedir();

    switch (os.platform()) {
        case 'win32':
            return Path.join(process.env.USERPROFILE, `.${COMPANY_LOWER}`);

        case 'darwin':
            return Path.join(ret, `Library/Application Support/${COMPANY}`);

        case 'linux':
            return Path.join(ret, `.local/share/data/${COMPANY}`);
    }

    return Path.join(ret, `.${COMPANY}`);
})();

function createWindow () {
    var initData = readObject(WINDOW_STATE_FILE);
    
    // Create the browser window.
    win = new BrowserWindow({
        width: initData.width || 1200,
        height: initData.height || 900,
        x: initData.x,
        y: initData.y,
        maximized: initData.maximized
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

    trackWindow();
}

function readObject(name) {
    var obj = {};
    var path = Path.join(profileDir, name);

    if (fs.existsSync(path)) {
        try {
            var data = fs.readFileSync(path, 'utf8');
            if (data) {
                obj = JSON.parse(data);
            }
        }
        catch (ignore) {
            
        }
    }
    return obj;
}

function saveObject(obj, name) {
    var data = JSON.stringify(obj, null, '  ');
    var path = Path.join(profileDir, name);

    if (!fs.existsSync(Path.dirname(path))) {
        fs.mkdirSync(Path.dirname(path));
    }

    fs.writeFileSync(path, data);
}


function flushWindowState () {
    if (syncTimer) {
        clearTimeout(syncTimer);
        syncTimer = null;
    }

    saveObject(windowBox, WINDOW_STATE_FILE);
}

function trackWindow () {
    if (win.isMaximized()) {
        if (windowBox) {
            windowBox.maximized = true;
        } else {
            windowBox = { maximized: true };
        }
    } else {
        windowBox = win.getBounds();
        windowBox.maximized = false;
    }

    if (!syncTimer) {
        syncTimer = setTimeout(() => {
            syncTimer = null;
            flushWindowState();
        }, 250);
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

process.argv.forEach(arg => {
    if (arg === 'reset') {
        try {
            fs.unlinkSync(Path.join(profileDir, WINDOW_STATE_FILE));
        }
        catch (ignore) {
            // ignore
        }
    }
});
