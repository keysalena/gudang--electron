const { app, BrowserWindow } = require("electron");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow; // Variable for the main window

const createMainWindow = () => {
  // Create the main browser window with the specified size.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  // Load the main index.html file.
  mainWindow.loadFile(path.join(__dirname, "data.html"));

  // Open the DevTools (for debugging) - You can remove this if not needed.
//  mainWindow.webContents.openDevTools();
};

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
