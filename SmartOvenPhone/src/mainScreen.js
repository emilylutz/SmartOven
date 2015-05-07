//@module
var THEME = require('themes/flat/theme');
var BUTTONS = require('controls/buttons');
var CONTROL = require('mobile/control');
var KEYBOARD = require('numKeyboard.js');
var SCROLLER2 = require('mobile/scroller');
var SCREEN = require('mobile/screen');
var reachedGoalTemp = 1;
var usingSchedule = 0;

/** SKINS **/
var whiteSkin = new Skin({fill:"white"});
var greenS = new Skin({fill:"#6ebab5"});
var clearS = new Skin({fill:""});
var greyS = new Skin({fill:"#CCCCCC"});
var topBordered = new Skin({fill:"", borders:{left:0,right:0,top:1,bottom:0},stroke:"#c2c5c8"});

/** STYLES **/
var statusStyle = new Style({font:"bold 45px Heiti SC", color:"black"});
var offStyle = new Style({font:"bold 90px Heiti SC", color:"#3D3D3D"});
var mainStyle = new Style({font:"20px Heiti SC", color:"black", align:"left"});
var smallStyle = new Style({font:"15px Heiti SC", color:"black", align:"left"});
var smallWhiteStyle = new Style({font:"15px Heiti SC", color:"White", align:"left"});
var stepStyle = new Style({font:"17px Heiti SC", color:"black", align:"left"});
var okayStyle = new Style({font:"20px Heiti SC", color:"#006EFF", align:"left"});
var whiteStyle = new Style({font:"20px Heiti SC", color:"white", align:"left"});
var smokeAlertStyle = new Style({font:"bold 30px Heiti SC", color: "red"});
var timerAlertStyle = new Style({font:"bold 25px Heiti SC", color: "black"});


/** LABELS **/
var statusLabel = new Label({left: 0, right: 0, height: 70, top: 30,string: "OFF", style: offStyle})
var currTemp = new Label({top:0, left:15, height:40, string: "Current Temp:", style: mainStyle})
var currTempVal = new Label({top:0, left:160, height:40, string: "---", style: mainStyle})
var currDeg = new Label({top:0, right:40, height:40, string: "°F", style: mainStyle})
var currTempCon = new Container({top:40,left:20,right:20,height:40, contents: [currTemp, currTempVal,currDeg]});
var setTempVal = new Label({right:85, height: 35,width:50, string: "", style: mainStyle});
var setTempDeg = new Label({string: "°F",right:40,style:mainStyle});
var setTempLabel = new Label({left: 20, height: 60, string: "Set Temp:", style: mainStyle})


var statusCon = new Container({top:10, left:0,right:0, height:90, contents: [statusLabel]});

/**** OFF BUTTON ****/
var offButtonLabel = new Label({left:0, right:0,top:0, string:"Turn Off", style:whiteStyle});
var offBg = new Picture({left:50,right:50,top:30, url:"buttons/offBg.png"});
var offButtonTemp = BUTTONS.Button.template(function($){ return{
		top:95,left:70, right:70,width:100,height:30, skin:clearS,
	contents:[offButtonLabel],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			application.invoke(new Message("/turnOff"));
		}},
		onTouchBegan: { value:  function(button){
			offBg.url = "buttons/offBg2.png"
		}}
	})
}});
var offButton = new offButtonTemp({});

var startStepBg = new Picture({left:0,right:0,top:-70,width:60, url:"buttons/startStep.png"});
var startStepButtonTemp = BUTTONS.Button.template(function($){ return{
		top:30 ,right:10,height:40, skin:clearS,
	contents:[startStepBg],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			startStepBg.url = "buttons/startStep.png";
			statusCon.remove(startStepButton);
			application.invoke(new Message("/startNextStep"));
		}},
		onTouchBegan: { value:  function(button){
			startStepBg.url = "buttons/startStep2.png"
		}}
	})
}});
var startStepButton = new startStepButtonTemp({});

/***** notification container *****/
var darkenS = new Skin({fill:"#99000000"});
var notificationCon = new Container.template(function($) { return {skin:darkenS, left:0,right:0, top:0, bottom:0,
 contents:$.contents
 }});


///*** ALERTS : SMOKE + TIMER ***///

var okayButtonTemp = BUTTONS.Button.template(function($){ return{
		top:$.top,left:70, right:0,left:0,height:50, skin:topBordered,msg:$.msg,
	contents:[new Label({left:30,right:30, top:5, height:40, string:"OK",style:okayStyle}) ],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			button.skin = topBordered
			application.invoke(new Message($.msg));
		}},
		onTouchBegan: { value:  function(button){
			button.skin = greyS
		}}
	})
}});

var smokeMessage = new Label({left:0,right:0,top:20, string:"SMOKE DETECTED!", style: smokeAlertStyle});
var smokeMessageSub = new Label({left:0,right:0,top:50, string:"oven has been turned off", style: mainStyle});
var smokeBg = new Picture({left:0, top:0, right:0,bottom:0,  url:"buttons/smokebox.png"});

var alertCon = new Container.template(function($) { return {left:10,right:10, top:130, height:150,
 contents:$.contents
 }});
 
 var timerBg = new Picture({left:0, top:0, right:0,bottom:0,  url:"buttons/timerBox.png"});
 var timerMessage = new Label({left:0,right:0,top:35, string:"Timer done", style: timerAlertStyle});
 var smokeContents = new alertCon({contents: [smokeBg,smokeMessage,smokeMessageSub, new okayButtonTemp({msg:"/removeSmokeAlert",top:90})]});
 var smokeAlertCon = new notificationCon({contents: [smokeContents]});
 var timerContents = new alertCon({contents: [timerBg,timerMessage, new okayButtonTemp({msg:"/removeTimerAlert",top:81})]});
 var timerAlertCon = new notificationCon({contents:[timerContents]});
 var reachedTempBg = new Picture({left:0, top:0, right:0,bottom:0,  url:"buttons/smokebox.png"});
 var reachedTempMessage = new Label({left:0,right:0,top:20, string:"Finished heating!", style: timerAlertStyle});
 var reachedTempMessageSub = new Label({left:0,right:0,top:50, string:"You may now put your dish in the oven.", style: smallStyle});
 var reachedTempContents = new alertCon({contents: [reachedTempBg,reachedTempMessage,reachedTempMessageSub, new okayButtonTemp({msg:"/removeReachedTemp",top:90})]});
 var reachedTempCon = new notificationCon({contents:[reachedTempContents]});
/** VALUES **/
var deviceURL = "";
var curOvenTemp = 0;
var goalOvenTemp = 0;
var ovenOn = false;

/* Set Temp container */
var setTempButton = new KEYBOARD.openKeyboardTemplate({label:setTempVal,max:3, top:0, left:0, right:0,height:50,action: "/setTemp" });
var setTempBg = new Picture({right:0,left:0, url: "buttons/settemp3.png"});
var setTempValBg = new Picture({left:60,height:40, url: "buttons/box.png"});
var setTempCon = new Container({left:20,right:20,top:10, height: 20,contents: [setTempBg,setTempValBg,setTempButton,setTempLabel,setTempVal,setTempDeg]});

/** Schedules Button **/
var schedulesTemplate = BUTTONS.Button.template(function($){ return{
		top:10,left:20, right:20, height: 60,skin:clearS,
	contents:[
		schedBg, new Label({height:10, string:"Schedules >",style:whiteStyle}), 
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			application.invoke(new Message("/toSchedMain"));
			schedBg.url = "buttons/settemp.png"
		}},
		onTouchBegan: { value:  function(button){
			schedBg.url = "buttons/settemp2.png"
			
		}}
	})
}});
var schedBg = new Picture({height:50, url:"buttons/settemp.png"})
var schedulesButton = new schedulesTemplate({bottom:0,textForLabel:"Schedules ❯"});


/****** Timer/Camera Container *****/

/**** Timer buttons ****/
function timeString(num) {
	x = parseInt(num)
	if (x < 10) {
		return "0" + x
		} 
	else {
		return "" + x
		}
		}
		
function convertTime(str) {
	hours = parseInt(str.substring(0,2));
	mins = parseInt(str.substring(3,5));
	secs = parseInt(str.substring(6,8));
	if (secs == 0) {
		if (mins == 0) {
			if (hours == 0) {
			application.add(timerAlertCon);
			application.invoke(new Message("/showNextStep"));
			return "DONE!"
			}
			hours = hours - 1;
			mins = 59;
			secs = 60
		}
		else {
			mins = mins - 1
			secs = 60
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


var timerCountdown = 0;
var startTimerTemp = BUTTONS.Button.template(function($){ return{
		top: 100 ,left:30, right:30, height: 50,skin:clearS,
	contents:[
		new Label({height:10, string:$.textForLabel,style:whiteStyle}), 
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			startTimerBg.url = "buttons/startTimerBg.png";
			timerCon.remove(setTimerCon);
			countdownLabel.string = hourVal.string + ":" + minVal.string + ":00"
			var msg = new Message(deviceURL + "setTimer");
	        msg.requestText = countdownLabel.string;
	        application.invoke(msg);
			timerCon.add(countdownCon);
			timerCountdown = 1;
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
				timerCon.remove(countdownCon);
				timerCon.add(setTimerCon);
				timerCountdown = 0;
				hourVal.string = "00";
				minVal.string = "00";
				
				application.invoke(new Message("/resetTimer"));
				application.invoke(new Message(deviceURL + "clearTimer"));
				
				}
			if ($.str == "Pause") {
				pauseBg.url = "buttons/pauseReset.png"
				if (pause == 0 ) {
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
var countdownLabel = new Label({top:0, bottom:0, string: "00:00:05", style:statusStyle});
var countdownCon = new Container({ left:0,right:0,top:0,bottom:0, contents : [countDownTab,resetBg, pauseBg, countdownLabel,resetButton,pauseButton]});


var hourLabel = new Label({left:60, height: 60, string: "Hours", style: mainStyle});
var hourVal = new Label({left:15, string:"00", height:60, style:mainStyle});
var hourButton = new KEYBOARD.openKeyboardTemplate({label:hourVal, max:2, left:5,width:50, height:40,action:"/setTimer"});
var hourBox = new Picture({right:70,left:0,height:40, url: "buttons/box.png"});

var minLabel = new Label({left:60, height: 60, string: "Min", style: mainStyle});
var minVal = new Label({left:15, string:"00", height:60, style:mainStyle});
var minButton = new KEYBOARD.openKeyboardTemplate({label:minVal,max:2, left:5,width:50, height:40,action:"/setTimer"});
var minBox = new Picture({right:70,left:0,height:40, url: "buttons/box.png"});

var hourCon = new Container({left:10,top:40,width:130,height:60, contents : [hourButton, hourBox, hourLabel, hourVal]});
var minCon = new Container({right:10,top:40,width:130,height:60, contents : [minButton, minBox, minLabel, minVal]});

var timerTab = new Picture({left:0,right:0, url: "buttons/timerTab.png"});
var setTimerCon = new Container({left:0,right:0,top:0,bottom:0, contents:[timerTab,startTimerBg,hourCon,minCon,startTimerButton]}); 
var timerCon = new Container({ left:0,right:0,height:150, contents : [setTimerCon]});
/**** Recent Schedules Container ***/

var recentSchedTemp = BUTTONS.Button.template(function($){ return{
		top:5,left:0,height:30, right:0, skin:clearS,schedObj:$.schedObj,title:$.title,
	contents:[new Label({left:20,style:smallStyle,string:$.title,left:10}),new Label({skin:greenS, width:50,height:25,right:30,string:"Start",style:smallWhiteStyle, skin:greenS})],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			button[1].skin = greenS
			usingSchedule = 1;
			msSched = $.schedObj
			schedTitleLabel.string = $.title;
			//handler.invoke(new Message("/addToRecent"));
			currentStep = 0;
			currentLabelStep = 0;
			application.invoke(new Message("/startNextStep"));
		}},
		onTouchBegan: { value:  function(button){
			button[1].skin = greyS
		}}
	})
}});
Handler.bind("/addToRecent", Behavior({
	onInvoke: function(handler, message){
		firstCon = recentSchedScroll.first.list.first
		if (firstCon != null) {
			if (recentSchedScroll.first.list[schedTitleLabel.string] == undefined) {
				newRecent = new recentSchedTemp({schedObj:msSched,title:schedTitleLabel.string});
				newRecent.name = schedTitleLabel.string
				recentSchedScroll.first.list.insert(newRecent, firstCon);
			}} else {
			recentSchedScroll.first.list.add(new recentSchedTemp({schedObj:msSched,title:schedTitleLabel.string}));
			}
			/**
		if (recentSchedColumn.length > 5) {
			recentSchedColumn.remove(recentSchedColumn.last);
			} **/
	}
}));	

var recentSchedTab = new Picture({left:0,right:0, url: "buttons/schedTab.png"});
var scrollCon = Container.template(function($) { return {
	left:10, right:10, top:40, bottom:0,
	contents: [
	   		/* Note that the scroller is declared as having only an empty
	   		 * Column and a scrollbar.  All the entries will be added 
	   		 * programmatically. */ 
	   		SCROLLER2.VerticalScroller($, { 
	   			contents: [
              			Column($, { left: 0, right: 0, top: 0, name: 'list', }),
              		,		//SCROLLER2.VerticalScrollbar($, { })
              			]
	   		})
	   		]
	}});
var dataMS = new Object();
var recentSchedScroll = new scrollCon(dataMS);
//var recentSchedColumn = new Column({left:0,right:0,top:0,bottom:0, contents:[]});
//var recentSchedScroll = new Scroller({left:10,right:10,top:40,bottom:0, contents:[recentSchedColumn]});
var recentSchedCon = new Container({left:0,right:0, height:150, contents:[recentSchedTab,recentSchedScroll]});

/** Camera Container **/
var camTab = new Picture({left:0,right:0, url: "buttons/camTab.png"});
var liveStream = new Picture({left:5,right:5,top:30, bottom:0, url: "buttons/ovenpic.png"});
var camCon = new Container({left:0, right:0,height: 150, contents: [camTab,liveStream]});

/** Tab buttons **/
var camObj = new Object();
camObj.view = 0;
camObj.con = camCon

var timerObj = new Object();
timerObj.view = 1;
timerObj.con = timerCon;

var recentSchedObj = new Object();
recentSchedObj.view = 0;
recentSchedObj.con = recentSchedCon;

function switchTabs(a,b,c) {
	if (a.view == 0) {
		if (b.view == 1) {
			timeCamCon.remove(b.con);
			b.view = 0;
			}
		if (c.view == 1) {
			timeCamCon.remove(c.con);
			c.view = 0;
			}
		timeCamCon.add(a.con)
		a.view = 1;
		}}
		
var tabButtonTemplate = BUTTONS.Button.template(function($){ return{
		height:40, top:-10, left:$.left, tabs: $.tabs,width:60,skin:clearS,
	contents:[ ],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			switchTabs($.tabs[0],$.tabs[1],$.tabs[2])
			}}})
		}});

var camButtonIcon = new Picture({top:-120, left:10, width:40,url:"buttons/camIcon.png"})
var camButton = new tabButtonTemplate({left:0,tabs:[camObj,timerObj,recentSchedObj]});
var timerButtonIcon = new Picture({top:-120, left:75, width:30,url:"buttons/timerIcon.png"})
var timerButton = new tabButtonTemplate({left:60 ,tabs:[timerObj,camObj,recentSchedObj]});

var recentSchedIcon = new Picture({top:-246, left:130, width:33,url:"buttons/schedIcon.png"})
var recentSchedButton = new tabButtonTemplate({left:120,tabs:[recentSchedObj,timerObj,camObj]}); 
var timeCamCon = new Container({left:20, right:20, top:35,height:145, contents: [timerCon,timerButtonIcon, camButtonIcon,recentSchedIcon,camButton,timerButton,recentSchedButton]});

/****************/
/*ACTIONS!! 
/****************/

Handler.bind("/removeTimerAlert", Behavior({
	onInvoke: function(handler, message){
		application.remove(timerAlertCon);
	}
}));	

Handler.bind("/removeSmokeAlert", Behavior({
	onInvoke: function(handler, message){
		application.remove(smokeAlertCon);
	}
}));	

Handler.bind("/turnOff", Behavior({
	onInvoke: function(handler, message){
		if(ovenOn){
			offBg.url = "buttons/offBg.png"
			statusCon.empty(0,statusCon.length)
			setTempVal.string = ""
			statusLabel.string = "OFF";
			statusCon.add(statusLabel);
			application.invoke(new Message(deviceURL + "turnOffOven"));
			statusLabel.style = offStyle;
			statusLabel.coordinates = {top:15,right:0,left:0};
			offButtonPresent = 0;
			ovenOn = false;
		}
	}
}));

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
		if (setTempVal.string != "") {
			reachedGoalTemp = 0;
			var msg = new Message(deviceURL + "setGoalTemp");
			var goalTemp = parseInt(setTempVal.string);	
			msg.requestText = goalTemp;
			if (offButtonPresent == 0) {
				statusCon.add(offBg);
				statusCon.add(offButton);
				offButtonPresent = 1;
				}
			if (deviceURL != "") handler.invoke(msg, Message.JSON);
			}
	},
	onComplete: function(content, message, json) {
		goalOvenTemp = json.goalTemp;
		statusLabel.string = "Heating";
		statusLabel.style = statusStyle;
	    statusLabel.coordinates = {top:5,left:0,right:0};
	    ovenOn = true;
		/*
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
	    */
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
		if (!reachedGoalTemp && parseInt(curOvenTemp) >= parseInt(setTempVal.string)) {
			handler.invoke(new Message("/reachedTemp"))
			reachedGoalTemp = 1;
			}
	}
}));

//the device pushes smoke detection to the phone
Handler.bind("/smokeDetectedAlert", Behavior({
	onInvoke: function(handler, message){
		//statusLabel.string = "Smoke detected in oven!";
		application.invoke(new Message("/turnOff"));
		application.add(smokeAlertCon);
	}
}));

//the device pushes smoke detection to the phone
Handler.bind("/reachedTemp", Behavior({
	onInvoke: function(handler, message){
		//statusLabel.string = "Smoke detected in oven!";
		if (usingSchedule && currentStep == 1) {
			nextStepPreview();
			}
		application.add(reachedTempCon);
	}
}));
//the device pushes smoke detection to the phone
Handler.bind("/removeReachedTemp", Behavior({
	onInvoke: function(handler, message){
		//statusLabel.string = "Smoke detected in oven!";
		
		application.remove(reachedTempCon);
	}
}));
Handler.bind("/smokeDetectedAllClear", Behavior({
	onInvoke: function(handler, message){
		//statusLabel.string = "No more smoke detected.";
		
		
		//statusLabel.style = mainStyle;
	}
}));

//*** stuff for Timer
//the "Start Timer" button will call /getTime
Handler.bind("/getTime", {
    onInvoke: function(handler, message){
    	if(timerCountdown == 1) {
	    	if (pause == 0) {
			        countdownLabel.string = convertTime(countdownLabel.string);
			       	var msg = new Message(deviceURL + "setTimer");
			        msg.requestText = countdownLabel.string;
			        application.invoke(msg);
			        if (countdownLabel.string == "DONE!" ){
			        		timerCon.remove(countdownCon);
							timerCon.add(setTimerCon);
							timerCountdown = 0;
						}
					else {
			        handler.invoke( new Message("/delay")); }
			    } }
			    }
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
Handler.bind("/resetTimer", {
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

/***************/
var msSched = ""
var currentStep = 0;
var currentLabelStep = 0;
Handler.bind("/startNextStep", {
    onInvoke: function(handler, message){
    	
       	setTempVal.string = msSched.temps[currentStep];
       	hourVal.string = timeString(msSched.hrs[currentStep]);
       	minVal.string = timeString(msSched.mins[currentStep]);
       	currentStep += 1;
		application.invoke(new Message("/setTemp"));
        }
 });

 var schedTitleLabel = new Label({top:0,left:30,bottom:0, right:30,height:10, string:"", style:mainStyle});
 var stepLabel1 = new Label({top:0,left:40, height:5, bottom:0,string:"", style:stepStyle});
 var stepLabel2 = new Label({top:0,left:40, height:5, bottom:0,string:"", style:stepStyle});
 var previewCon = new Column({left:0,right:0,top:0,bottom:5, contents: [schedTitleLabel,stepLabel1,stepLabel2]});
 previewCon.name = "prevCon"
 function nextStepPreview() {
 	    	statusLabel.string = "" 
    		//statusLabel.style = stepStyle
    		stepLabel1.string = msSched.steps[currentLabelStep]
    		stepLabel2.string = msSched.steps[currentLabelStep+=1]
    		currentLabelStep += 2;
    		if (statusCon["prevCon"] == null) {
    			statusCon.add(previewCon)
    			}
    		}
 	
 Handler.bind("/showNextStep", {
    onInvoke: function(handler, message){
    	if (usingSchedule && msSched.size/2 > 1) {
    		nextStepPreview()
    		statusCon.add(startStepButton);
    		}
    	
		
        }
 });

Handler.bind("/hardcodedInstruction", {
    onInvoke: function(handler, message){
		msg = JSON.parse(message.requestText);
		if (msg != undefined) {
			usingSchedule = 1;
			msSched = msg.steps
			schedTitleLabel.string = msg.name;
			currentStep = 0;
			currentLabelStep = 0;
			handler.invoke(new Message("/addToRecent"));
			handler.invoke(new Message("/startNextStep"), Message.TEXT);
			/*
			for (i = 0; i < stepNum-1;i++) {
				info1Labell = new Label({top:5, left:0, bottom:0, height:20, string:sched.steps[i], style: labelStyle});
                info2Labell = new Label({top:5, left:0, bottom:5, height:20, string: sched.steps[i+1], style: labelStyle});
                addLabelContainer33 = new Column({left:5,right:0,top:5,contents: [info1Labell, info2Labell,new Container({height:1, skin:greenS, left:10, right:10})]});
                stepsContainer.add(addLabelContainer33);
                i += 1
				}
				*/
			//stepsContainer.skin = greenS
		}}	
});