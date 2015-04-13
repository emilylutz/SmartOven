 //@module
var THEME = require('themes/flat/theme');
var BUTTONS = require('controls/buttons');
var CONTROL = require('mobile/control');
var KEYBOARD = require('numKeyboard.js');

var gap = 10;
var fieldString = ""

/** SKINS **/
var whiteSkin = new Skin({fill:"white"});
var greenS = new Skin({fill:"#67BFA0"});
var clearS = new Skin({fill:""});
//for keyboard

var tSkinTouch = new Skin({fill:"#A0CBFA"});
var keySkin = new Skin({fill:"#fcfdfd",borders:{left:0,right:0,top:0,bottom:1},stroke:"#c2c5c8"});
var darkGreyS = new Skin({fill:"#c2c5c8"});
var greyS = new Skin({fill:"#fcfdfd"});
var greySBordered = new Skin({fill:"#fcfdfd", borders:{left:0,right:0,top:1,bottom:1},stroke:"#c2c5c8"});
var bordered = new Skin({borders:{left:0,right:0,top:1,bottom:1},stroke:"#c2c5c8"});
var borderedV = new Skin({borders:{left:1,right:1,top:0,bottom:0},stroke:"#c2c5c8"});
var boxed = new Skin({borders:{left:2,right:2,top:2,bottom:2},stroke:"#c2c5c8"});
//var whiteSbordered = new Skin({fill:"white", borders:{left:2,right:2,top:2,bottom:2},stroke:"red"});

/** STYLES **/
var statusStyle = new Style({font:"bold 45px Heiti SC", color:"black"});
var offStyle = new Style({font:"bold 70px Heiti SC", color:"black"});
var tempStyle = new Style({font:"20px Heiti SC", color:"black", align:"left"});
var whiteStyle = new Style({font:"20px Heiti SC", color:"white", align:"left"});
var alertStyle = new Style({font:"bold 30px Heiti SC", color: "red"});
/** LABELS **/
var statusLabel = new Label({left: 0, right: 0, height: 70, top: 15,string: "OFF", style: offStyle})
var currTemp = new Label({top:0, left:15, height:40, string: "Current Temp:", style: tempStyle})
var currTempVal = new Label({top:0, left:160, height:40, string: "---", style: tempStyle})
var currDeg = new Label({top:0, right:40, height:40, string: "°F", style: tempStyle})
var currTempCon = new Container({top:0,left:20,right:20,height:40, contents: [currTemp, currTempVal,currDeg]});
var setTempVal = new Label({right:85, height: 35,width:50, string: "", style: tempStyle});
var degrees = new Label({string: "°F",right:40,style:tempStyle});
var setTempLabel = new Label({left: 20, height: 60, string: "Set Temp:", style: tempStyle})
var offLabel = new Label({left:0, right:0,top:0, string:"Turn Off", style:whiteStyle});
var offBg = new Picture({left:50,right:50,top:0, url:"buttons/offBg.png"});
var offTemp = BUTTONS.Button.template(function($){ return{
		top:65,left:70, right:70,width:100,height:30, skin:clearS,
	contents:[offLabel],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			offBg.url = "buttons/offBg.png"
			setTempVal.string = ""
			statusLabel.string = "OFF";
			statusLabel.style = offStyle;
			statusLabel.coordinates = {top:15,right:0,left:0};
			statusCon.remove(offButton)
			statusCon.remove(offBg);
			offButtonPresent = 0;
		}},
		onTouchBegan: { value:  function(button){
			offBg.url = "buttons/offBg2.png"
		}}
	})
}});
//*** off Button ***//
var offButton = new offTemp({});
var statusCon = new Container({top:10, left:0,right:0, height:90, contents: [statusLabel]});
/* Button that brings up the keyboard */


///*** Smoke Alert ***///

var smokeMessage = new Label({left:0,right:0,top:20, string:"SMOKE DETECTED!!", style: alertStyle});
var smokeMessage2 = new Label({left:0,right:0,top:50, string:"oven has been turned off", style: tempStyle});
var smokeBox = new Picture({left:0, top:0, right:0,bottom:0,  url:"buttons/smokebox.png"});
var okayLabel = new Label({left:30,right:30, top:80, height:40, string:"okay",style:whiteStyle, skin:darkGreyS});
var smokeAlertCon = new Container({left:10,right:10, top:100, height:150, active:true,
behavior: Object.create(Behavior.prototype, {
	onTouchEnded: { value:  function(button){
		application.remove(smokeAlertCon);
		}},
   	onTouchBegan: { value: 
     	 function(button) {
     	 okayLabel.skin = greyS
         
      }
   },}),
 contents:[smokeBox, smokeMessage,smokeMessage2,okayLabel]});




/** VALUES **/
var deviceURL = "";
var curOvenTemp = 0;
var goalOvenTemp = 0;

/* Set Temp container */
var setTempButton = new KEYBOARD.openKeyboardTemplate({label:setTempVal,max:3, top:0, left:0, right:0,height:50,field: "/setTemp" });
var setTempBg = new Picture({right:0,left:0, url: "buttons/settemp3.png"});
var numBox = new Picture({left:60,height:40, url: "buttons/box.png"});
var setTempCon = new Container({left:20,right:20,top:0, height: 50,contents: [setTempBg,numBox,setTempButton,setTempLabel,setTempVal,degrees]});

/** Schedules Button **/
var schedulesTemplate = BUTTONS.Button.template(function($){ return{
		top: gap,left:20, right:20, height: 60,skin:clearS,top:0,
	contents:[
		schedBg, new Label({height:10, string:$.textForLabel,style:whiteStyle}), 
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			application.invoke(new Message("/schedules"));
			schedBg.url = "buttons/settemp.png"
		}},
		onTouchBegan: { value:  function(button){
			schedBg.url = "buttons/settemp2.png"
			
		}}
	})
}});
var schedBg = new Picture({height:50, url:"buttons/settemp.png"})
var schedulesButton = new schedulesTemplate({bottom:0,textForLabel:"Schedules >"});


/****** Timer/Camera Container *****/
/**** Timer buttons ****/
date = 0;
function convertTime(str) {
	hours = parseInt(str.substring(0,2));
	mins = parseInt(str.substring(3,5));
	secs = parseInt(str.substring(6,8));
	if (secs == 0) {
		if (mins == 0) {
			if (hours == 0) {
			return "DONE!!"
			}
			hours = hours - 1;
			mins = 59;
		}
		else {
			mins = mins - 1
			secs = 59
			}
	}
	secs = secs - 1
	if (secs < 10) {
		secs = "0" + secs
		}
	if (hours < 10) {
		hours = "0" + hours
	}
	if (mins < 10) {
		mins = "0" + mins
	}
	return hours + ":" + mins + ":" + secs
}


var countdown = 0;
var startTimerTemp = BUTTONS.Button.template(function($){ return{
		top: 100 ,left:30, right:30, height: 50,skin:clearS,
	contents:[
		new Label({height:10, string:$.textForLabel,style:whiteStyle}), 
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			startTimerBg.url = "buttons/startTimerBg.png";
			timeCamCon.remove(timerCon);
			countdownLabel.string = hourVal.string + ":" + minVal.string + ":00"
			timeCamCon.add(countdownCon);
			countdown = 1;
			application.invoke(new Message("/getTime"));
			
		}},
		onTouchBegan: { value:  function(button){
			startTimerBg.url = "buttons/startTimerBg2.png";
			
		}}
	})
}});
pause = 0;
var resetPauseTemp = BUTTONS.Button.template(function($){ return{
		top: 100 ,left:$.left, height: 50,width:70, skin:clearS,str:$.str,
	contents:[ $.label ],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			if ($.str == "Reset") {
				resetBg.url = "buttons/pauseReset.png"
				timeCamCon.remove(countdownCon);
				timeCamCon.add(timerCon);
				countdown = 0;
				hourVal.string = "00";
				minVal.string = "00";
				application.invoke(new Message("/resetTimer"));
				}
			if ($.str == "Pause") {
				if (pause == 0 ) {
					pauseBg.url = "buttons/pauseReset.png"
					pauseStartLabel.string = "Start"
					pause = 1;
					application.invoke(new Message("/pauseTimer"));
					}
				else { 
					pauseStartLabel.string = "Pause"
					pause = 0
					application.invoke(new Message("/getTime"));
				}}
		}},
		onTouchBegan: { value:  function(button){
			if ($.str == "Pause") {
				pauseBg.url = "buttons/pauseReset2.png"
				}
			if($.str== "Reset") {
				resetBg.url = "buttons/pauseReset2.png"
				}
			
		}}
	})
}});



/* Timer */

var pauseStartLabel = new Label({height:10, string:"Pause",style:whiteStyle})
var resetLabel = new Label({height:10, string:"Reset",style:whiteStyle})
var resetBg = new Picture({left:45,width:80,top:35, url: "buttons/pauseReset.png"});
var resetButton = new resetPauseTemp({str: "Reset", label: resetLabel,left:50});

var pauseBg = new Picture({left:135,width:80,top:35, url: "buttons/pauseReset.png"});
var pauseButton = new resetPauseTemp({str: "Pause", label: pauseStartLabel,left:140});
var countDownTab = new Picture({left:0,right:0, url: "buttons/timerTab.png"});
var startTimerButton = new startTimerTemp({textForLabel:"Start Timer"});
var startTimerBg = new Picture({top:35,left:30,right:30, url: "buttons/startTimerBg.png"});
var countdownLabel = new Label({top:0, bottom:0, string: "10:00:00", style:statusStyle});
var countdownCon = new Container({ left:0,right:0,height:150, contents : [countDownTab,resetBg, pauseBg, countdownLabel,resetButton,pauseButton]});


var hourLabel = new Label({left:60, height: 60, string: "Hours", style: tempStyle});
var hourVal = new Label({left:15, string:"00", height:60, style:tempStyle});
var hourButton = new KEYBOARD.openKeyboardTemplate({label:hourVal, max:2, left:5,width:50, height:40,field:"/setTimer"});
var hourBox = new Picture({right:70,left:0,height:40, url: "buttons/box.png"});

var minLabel = new Label({left:60, height: 60, string: "Min", style: tempStyle});
var minVal = new Label({left:15, string:"00", height:60, style:tempStyle});
var minButton = new KEYBOARD.openKeyboardTemplate({label:minVal,max:2, left:5,width:50, height:40,field:"/setTimer"});
var minBox = new Picture({right:70,left:0,height:40, url: "buttons/box.png"});

var hourCon = new Container({left:10,top:40,width:130,height:60, contents : [hourButton, hourBox, hourLabel, hourVal]});
var minCon = new Container({right:10,top:40,width:130,height:60, contents : [minButton, minBox, minLabel, minVal]});

var timerTab = new Picture({left:0,right:0, url: "buttons/timerTab.png"});
var timerCon = new Container({ left:0,right:0,height:150, contents : [timerTab,startTimerBg,hourCon,minCon,startTimerButton]});



/** Camera Container **/
var camTab = new Picture({left:0,right:0, url: "buttons/camTab.png"});
var liveStream = new Picture({left:5,right:5,top:30, bottom:0, url: "buttons/ovenpic.png"});
var camCon = new Container({left:0, right:0,height: 150, contents: [camTab,liveStream]});

/** Tab buttons **/
var camView = 0;
var timeCamTemplate = BUTTONS.Button.template(function($){ return{
		height:45, top:0, left:$.left, type:$.type,width:60, skin:clearS,
	contents:[ ],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
		if ($.type == "cam") {
			if (camView == 0) {
				if (countdown == 1) {
					timeCamCon.remove(countdownCon);
					}
				else { timeCamCon.remove(timerCon);}
				timeCamCon.add(camCon);
				camView = 1;
				}
			}
		else if ($.type == "timer") {
			if (camView == 1) {
				timeCamCon.remove(camCon);
				if (countdown == 1) {
					timeCamCon.add(countdownCon); 
					}
				else {timeCamCon.add(timerCon); }
				camView = 0;
				}}
		}},
	})
}});

var camButtonIcon = new Picture({top:-110, left:10, width:40,url:"buttons/camIcon.png"})
var camButton = new timeCamTemplate({type:"cam",left:0});
var timerButtonIcon = new Picture({top:-110, left:75, width:30,url:"buttons/timerIcon.png"})
var timerButton = new timeCamTemplate({type:"timer",left:60});

var timeCamCon = new Container({left:20, right:20, top:gap,height: 200, contents: [timerCon,timerButtonIcon, camButtonIcon,camButton,timerButton]});

/****************/
/*ACTIONS!! 
/****************/
/**discover device **/
Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		deviceURL = JSON.parse(message.requestText).url;
		trace("discovered device\n");
	}
}));

/** forget device **/
Handler.bind("/forget", Behavior({
	onInvoke: function(handler, message){
		deviceURL = "";
	}
}));

var offButtonPresent = 0;
//**** what happens after changing "Set Temperature" ***//
// setTempVal.string is the val just set
// currTempVal.string is the current temperature string (to be updated)
Handler.bind("/setTemp", Behavior({
		onInvoke: function(handler, message) {
		var msg = new Message(deviceURL + "setGoalTemp");
		var goalTemp = parseInt(setTempVal.string);	
		msg.requestText = goalTemp;
		if (offButtonPresent == 0) {
			statusCon.add(offBg);
			statusCon.add(offButton);
			offButtonPresent = 1;
			}
		if (deviceURL != "") handler.invoke(msg, Message.JSON);
	},
	onComplete: function(content, message, json) {
		goalOvenTemp = json.goalTemp;
		
		if (goalOvenTemp == curOvenTemp) {
	      statusLabel.string = "The oven is already at this temperature";
	    } else {
	      if (goalOvenTemp > curOvenTemp) {
	        action = "Heating Up";
	      } else {
	        action = "Cooling Down";
	      }
	      statusLabel.string = action
	      statusLabel.style = statusStyle;
	      statusLabel.coordinates = {top:5,left:0,right:0};
	    }
	}
}));
/*
	onInvoke: function(handler, message){
		statusLabel.string = "Heating..."
		statusLabel.style = statusStyle;
		statusLabel.coordinates = {top:5,left:0,right:0};
		statusCon.add(offBg);
		statusCon.add(offButton);
		}
})); */

//the device pushes the temperature to the phone
Handler.bind("/gotCurrentTemp", Behavior({
	onInvoke: function(handler, message, json) {
		//update the display of the current temperature
		curOvenTemp = message.requestText;
		currTempVal.string = curOvenTemp;
	}
}));

//the device pushes smoke detection to the phone
Handler.bind("/smokeDetectedAlert", Behavior({
	onInvoke: function(handler, message){
		//statusLabel.string = "Smoke detected in oven!";
		application.add(smokeAlertCon);
	}
}));
Handler.bind("/smokeDetectedAllClear", Behavior({
	onInvoke: function(handler, message){
		smokeDetectedLabel.string = "Smoke detector all clear";
	}
}));

//*** stuff for Timer
//the "Start Timer" button will call /getTime
Handler.bind("/getTime", {
    onInvoke: function(handler, message){
    	if (pause == 0) {
	        countdownLabel.string = convertTime(countdownLabel.string);
	        if (countdownLabel.string == "DONE!!" ){
	        		timeCamCon.remove(countdownCon);
					timeCamCon.add(timerCon);
					countdown = 0;
				}
			else {
	        handler.invoke( new Message("/delay")); }
	    } }
});
Handler.bind("/delay", {
    onInvoke: function(handler, message){
        handler.wait(1000); //will call onComplete after 1 seconds
    },
    onComplete: function(handler, message){
        handler.invoke(new Message("/getTime"));
    }
});

/*** pausing the Timer **/
Handler.bind("/pauseTimer", {
    onInvoke: function(handler, message){
        //do something
        }
});

/*** resetting the Timer **/
Handler.bind("/pauseTimer", {
    onInvoke: function(handler, message){
        //do something
        }
});

/// To change the livecam picture:
// livestream.url = ""

/****************************************/
/* MAIN CON
/****************************************/
exports.mainColumn = new Column.template(function($) { return ({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: whiteSkin,
	contents:[
		statusCon,
		currTempCon,
		setTempCon,
		timeCamCon,
		schedulesButton,
	]
})});