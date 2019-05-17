const {
   app,
   BrowserWindow,
   Menu,
   ipcMain
} = require('electron')
const url = require('url')
const path = require('path')

let win
let add_item_win

//Set ENV
process.env.NODE_ENV = 'production';


// live Refresh/Reload if any changes made.
// require('electron-reload')(__dirname)


// Top Menu Items (btnLists)
const mainMenu = [{
      label: "File",
      submenu: [
         {
            label:"Add Item",
            click(){
               createAddWindow()
            }
         },
         {
            label:"Clear",
            click(){
               win.webContents.send('item_clear')
            }
         },
         {label:"Add Item"},
      ]
   },{
      label:"MenuItem",
      submenu:[
         {label:"SubMenuItem 1"},
         {label:"SubMenuItem 2"},
         {label:"SubMenuItem 3"},
      ]
   },{
      label:"Quit",
      accelerator:process.platform == 'darwin'?'Command+Q':'Ctrl+Q',
      click(){
         app.quit();
      }
   }
]

// Add Developer tools item on DevEnv
if(process.env.NODE_ENV !== 'production'){
   mainMenu.push({
      label:'Developer Tools',
      submenu:[{
         label:'Toggle DevTools',
         accelerator:process.platform == 'darwin'?'Command+I':'Ctrl+I',
         click(item,focusedWindow){
            focusedWindow.toggleDevTools();
         }
      },{
         role:'reload',
         accelerator:process.platform == 'darwin'?'Command+R':'Ctrl+R',
      }]
   })
}


app.on('ready', createWindow)
app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
      app.quit()
   }
})




// Create Main application Window
function createWindow() {
   win = new BrowserWindow({
      width: 1400,
      height: 850,
      transparent: true,
      minHeight: 430,
      minWidth: 600,
   })

   win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
   }))

   win.on('closed', () => {
      win = null;
      app.quit();
   })
   
   win.webContents.openDevTools()
   Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenu))
}





// Add item window (OnCLick Listener)
function createAddWindow(){
   add_item_win = new BrowserWindow({
      width: 450,
      height: 250,
   })
   add_item_win.loadURL(url.format({
      pathname: path.join(__dirname, 'add_item_win.html'),
      protocol: 'file:'
   }))
   add_item_win.on('close',()=>{
      add_item_win = null;
   })
}




// Get Added Item_value From add_item_win
ipcMain.on('item_value',(event,item_value)=>{
   win.webContents.send('item_value',item_value);
   add_item_win.close();
})



