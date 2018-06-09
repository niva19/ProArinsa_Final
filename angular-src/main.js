var { session, app, BrowserWindow } = require('electron');

let win = null;

app.on('ready', () => {

    win = new BrowserWindow({
        width: 1200,
        height: 720,
        webPreferences: {
            nodeIntegration: false
        }
    });

    win.webContents.on('crashed', () => {
        win.destroy();
        createWindow();
    });

    var URL=`file://${__dirname}/dist/index.html`
    console.log(URL);
    win.loadURL(URL);

    win.on('close', function () { //   <---- Catch close event
        win.webContents.session.clearStorageData(
        {
            storages: [
                'websql',
                'localstorage'
            ]
        },
            function () {
                console.log('LocalStorage cleared')
            }
        );
    });
})

app.on('activate', () => {
    if (win == null) createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
})
