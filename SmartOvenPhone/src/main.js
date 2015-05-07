//@program
var THEME = require('themes/flat/theme');
var BUTTONS = require('controls/buttons');
var CONTROL = require('mobile/control');
var KEYBOARD = require('mobile/keyboard');
var TRANSITIONS = require('transitions');
var SCROLLER = require('mobile/scroller');
var MainS = require("mainScreen.js")
var SchedMainS = require("schedulesMain.js")
var AddSchedS = require("AddSchedScreen.js")
var SavedSchedS = require("savedSched.js")
var StartSchedS = require("startSched.js")


var whiteSkin = new Skin({ fill: 'white',});

/* Main container for application - will hold all screens and handle transitions*/
var MainScreen = Container.template(function($) { return { skin:whiteSkin, left: 0, right: 0, top: 0, bottom: 0, contents: [], }});

/* Transition from statusScreen (main page) to schedScreen (schedules page) */
Handler.bind("/toSchedMain", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), statusScreen, schedMainScreen, { direction : "left", duration : 300 } );
	},
}));
/* Transition from schedScreen (schedules page) to statusScreen (main page) */
Handler.bind("/backToMain", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), schedMainScreen, statusScreen, { direction : "right", duration : 300 } );
	},
}));

/* Transition from startSched to schedMain */
Handler.bind("/startSchedToSchedMain", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), startSched, schedMainScreen, { direction : "right", duration : 300 } );
	},
}));

/* Transition from savedSched to addSched */
Handler.bind("/savedSchedToAddSched", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), savedSched, addSchedScreen, { direction : "right", duration : 300 } );
	},
}));
	

/* Transition from schedScreen (schedules page) to statusScreen (main page) */
Handler.bind("/savedToMain", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), savedSched, statusScreen, { direction : "right", duration : 300 } );
	},
}));	

AddNeedClean = 0;
SavedNeedClean = 0
/* Transition from schedpage to AddschedScreen (add schedules page) */
Handler.bind("/toAddSched", Behavior({
	onInvoke: function(handler, message){
		if (AddNeedClean) {
			application.invoke(new Message("/cleanAddSched"));
			AddNeedClean = 0;
			}
		if (SavedNeedClean) {
			application.invoke(new Message("/cleanSavedSched"));
			SavedNeedClean = 0;
			}
		AddNeedClean = 1;
		mainScreen.run( new TRANSITIONS.Push(), schedMainScreen, addSchedScreen, { direction : "left", duration : 300 } );
	},
}));

/* Transition from addSchedScreen (add new schedule page) to schedScreen (schedules page) */
Handler.bind("/backToSchedMain", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), addSchedScreen,schedMainScreen, { direction : "right", duration : 300 } );
	},
}));

/* Transition from addSchedScreen (add new schedule page) to schedScreen (schedules page) */
Handler.bind("/startToSchedMain", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(),startSched ,schedMainScreen, { direction : "right", duration : 300 } );
	},
}));

/* Transition from startSchedScreen  to statusScreen (main page) */
Handler.bind("/startToMain", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(),startSched ,statusScreen, { direction : "right", duration : 300 } );
	},
}));

Handler.bind("/addToSaved", Behavior({
	onInvoke: function(handler, message){
		SavedNeedClean = 1;
		mainScreen.run( new TRANSITIONS.Push(), addSchedScreen, savedSched, { direction : "left", duration : 300 } );
	},
}));

Handler.bind("/schedMainToStart", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), schedMainScreen, startSched, { direction : "left", duration : 300 } );
	},
}));

Handler.bind("/setTimerOpen", Behavior({
	onInvoke: function(handler, message){
		handler.invoke(new Message("/openNumKey"));
	},
}));

Handler.bind("/setTimer", Behavior({
	onInvoke: function(handler, message){
		handler.invoke(new Message("/closeNumKey"));
	},
}));


screenBot = 0;
Handler.bind("/openNumKey", Behavior({
	onInvoke: function(handler, message){
		if (screenBot < 150) {
			screenBot += 5;
			mainScreen.coordinates = {right:0, left:0, bottom:screenBot};
			application.invoke(new Message("/delayOpenKey"));}
	},
}));
Handler.bind("/delayOpenKey", {
    onInvoke: function(handler, message){
        handler.wait(5); //will call onComplete 1000 = 1sec
    },
    onComplete: function(handler, message){
        handler.invoke(new Message("/openNumKey"));;
    }
});

Handler.bind("/closeNumKey", Behavior({
	onInvoke: function(handler, message){
		if (screenBot > 0) {
			screenBot -= 5;
			mainScreen.coordinates = {right:0, left:0, bottom:screenBot};
			application.invoke(new Message("/delayKeyClose"));}
		else {
			mainScreen.coordinates = {right:0,left:0,bottom:0,top:0}
			}
	},
}));
Handler.bind("/delayKeyClose", {
    onInvoke: function(handler, message){
        handler.wait(10); //will call onComplete 1000 = 1sec
    },
    onComplete: function(handler, message){
    	handler.invoke(new Message("/closeNumKey"));
    }
});


var mainScreen = new MainScreen();

/** Screens **/

var statusScreen = new MainS.mainColumn();
var schedMainScreen = new SchedMainS.mainContainer();
var addSchedScreen = new AddSchedS.mainContainer();
var savedSched = new SavedSchedS.mainContainer();
var startSched = new StartSchedS.mainContainer();
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

application.add( mainScreen );
mainScreen.add( statusScreen )
//mainScreen.add(savedSched);