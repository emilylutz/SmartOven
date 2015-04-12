var THEME = require('themes/flat/theme');
var BUTTONS = require('controls/buttons');
var KEYBOARD = require("numKeyboard.js");


var whiteSkin = new Skin({fill:"white"});
var greenS = new Skin({fill:"#67BFA0"});
var tempStyle = new Style({font:"20px Heiti SC", color:"black", align:"left"});





/******** This is the label that will be affected by what you type on the keyboard ******/
var statusLabel = new Label({left: 0, right: 0, height: 70, top: 20,string: "", style: tempStyle})

/******** This is a button that will open up the keyboard 
/* inputs:
/* label = the label you want to edit
/* max = the maximum size you want the string to be */
var showKeyboard = new KEYBOARD.openKeyboardTemplate({skin:greenS, top:100,bottom:0,left:0,right:0,height:100, label:statusLabel,max:5,
	contents:[new Label({string:"click me", style:tempStyle})] });
	
	
var mainCon = new Container({top:0,bottom:0,left:0,right:0,skin:whiteSkin});
application.add(mainCon);
application.add(showKeyboard);
application.add(statusLabel);





