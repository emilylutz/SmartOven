//@program

var THEME = require("themes/flat/theme");
var BUTTONS = require("controls/buttons");
var style = new Style( { font: "bold 20px", color:"black" });
var whiteSkin = new Skin( { fill:"white" } );

/**** For Easier Logging ***/
//Whether logging messages should be displayed or not
var logging = true;
//Displays message if logging turned on
var myLog = function(message){if(logging){traceLine(message)}};
//Displays message, appending a newline symbol
var traceLine = function(message){trace(message+"\n")};

/**** Discovering Device ****/
deviceURL = "";

Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		deviceURL = JSON.parse(message.requestText).url;
		traceLine("discovered device");
	}
}));

Handler.bind("/forget", Behavior({
	onInvoke: function(handler, message){
		deviceURL = "";
	}
}));


var goalTemp = 100;
var curOvenTemp = 0;
var timerLength = 100; //in milliseconds

/* Alerts from device */

Handler.bind("/smokeDetectedAlert", Behavior({
	onInvoke: function(handler, message){
		myLog("SMOKE DETECTED IN OVEN!");
		smokeDetectedLabel.string = "True";
	}
}));
Handler.bind("/smokeDetectedAllClear", Behavior({
	onInvoke: function(handler, message){
		myLog("Smoke detector all clear.");
		smokeDetectedLabel.string = "False";
	}
}));

Handler.bind("/gotCurrentTemp", Behavior({
	onInvoke: function(handler, message, json){
		//myLog("Got current oven temp.");
		if(message.requestText){
			curOvenTemp = message.requestText;
		} else {
			curOvenTemp = json.curTemp;
		}
		currentOvenTempLabel.string = curOvenTemp+"*F";
	}
}));

Handler.bind("/gotPicture", Behavior({
	onInvoke: function(handler, message){
		myLog("Got picture");
		//Picture will come in here
	}
}));

var ovenStatusLabel = new Label({left:0, right:0, height:20, string:"OFF", style: style}),
var currentOvenTempLabel = new Label({left:0, right:0, height:20, string:"0", style: style}),
var goalTempLabel = new Label({left:0, right:0, height:20, string:"0", style: style}),
var smokeDetectedLabel = new Label({left:0, right:0, height:20, string:"False", style: style}),
var timerLengthLabel = new Label({left:0, right:0, height:20, string:"0", style: style}),

var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		new Line({left:0, right:0, skin: whiteSkin,
			contents:[
				new Label({left:0, right:0, height:20, string:"Oven Status", style: style}),
				ovenStatusLabel
			]}),
		new Line({left:0, right:0, skin: whiteSkin,
			contents:[
				new Label({left:0, right:0, height:20, string:"Current Oven Temp", style: style}),
				currentOvenTempLabel
			]}),
		new Line({left:0, right:0, skin: whiteSkin,
			contents:[
				new Label({left:0, right:0, height:20, string:"Oven Goal Temp", style: style}),
				goalTempLabel
			]}),
		new Line({left:0, right:0, skin: whiteSkin,
			contents:[
				new Label({left:0, right:0, height:20, string:"Smoke Detected?", style: style}),
				smokeDetectedLabel
			]}),
		new Line({left:0, right:0, skin: whiteSkin,
			contents:[
				new Label({left:0, right:0, height:20, string:"Timer Length", style: style}),
				timerLengthLabel
			]}),
		
		new Label({left:0, right:0, height:20, string:"SET GOAL TEMP", style: style, active: "true",
					behavior: Behavior({
						onTouchEnded: function(container, content){
							var message = new Message(deviceURL + "setGoalTemp");
							message.requestText = goalTemp;
							if (deviceURL != "") container.invoke(message, Message.JSON);
						},
						onComplete: function(content, message, json){
							goalTempLabel.string = json.goalTemp;
						}
					})
					}),
		new Label({left:0, right:0, height:20, string:"TURN ON", style: style, active: "true",
			behavior: Behavior({
				onTouchEnded: function(container, content){
					if (deviceURL != "") container.invoke(new Message(deviceURL + "turnOnOven"), Message.JSON);
				},
				onComplete: function(content, message, json){
					ovenStatusLabel.string = json.ovenOn;
				}
			})}),
		new Label({left:0, right:0, height:20, string:"TURN OFF", style: style, active: "true",
			behavior: Behavior({
				onTouchEnded: function(container, content){
					if (deviceURL != "") container.invoke(new Message(deviceURL + "turnOffOven"), Message.JSON);
				},
				onComplete: function(content, message, json){
					ovenStatusLabel.string = json.ovenOn;
				}
			})}),
		new Label({left:0, right:0, height:20, string:"SET TIMER", style: style, active: "true",
					behavior: Behavior({
						onTouchEnded: function(container, content){
							var message = new Message(deviceURL + "setTimer");
							message.requestText = timerLength;
							if (deviceURL != "") container.invoke(message, Message.JSON);
						},
						onComplete: function(content, message, json){
							timerLengthLabel.string = json.timerLength;
						}
					})
					}),
		new Label({left:0, right:0, height:20, string:"GET PICTURE", style: style, active: "true",
			behavior: Behavior({
				onTouchEnded: function(container, content){
					if (deviceURL != "") container.invoke(new Message(deviceURL + "getPicture"), Message.JSON);
				},
				onComplete: function(content, message, json){
					//picture will be received here
					//until this is finsihed, just use a picture in the same folder as main.js
				}
			})})
		]
});

/* Calling device constantly */
/*
application.invoke( new MessageWithObject( deviceURL + "getPicture" + 
			serializeQuery( {
				repeat: "on",
				interval: 20,
				callback: "/gotPicture"
		} ) ) );
*/

//This isn't working quite yet, but I will keep working on it
/*
application.invoke( new MessageWithObject( deviceURL + "getCurrentOvenTemp" + 
			serializeQuery( {
				repeat: "on",
				interval: 20,
				callback: "/gotCurrentTemp"
		} ) ) );
*/
var ApplicationBehavior = Behavior.template({
	onLaunch: function(application) {
		application.shared = true;
	},
	onDisplayed: function(application) {
		application.discover("smartovendevice.app");
	},
	onQuit: function(application) {
		application.forget("smartovendevice.app");
		application.shared = false;
	},
})

application.behavior = new ApplicationBehavior();
application.add(mainColumn);
myLog("phone running\n");
