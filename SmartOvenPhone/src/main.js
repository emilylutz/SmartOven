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

/* Transition from schedScreen (schedules page) to statusScreen (main page) */
Handler.bind("/savedToMain", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), savedSched, statusScreen, { direction : "right", duration : 300 } );
	},
}));	

/* Transition from statusScreen (main page) to schedScreen (schedules page) */
Handler.bind("/toAddSched", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), schedMainScreen, addSchedScreen, { direction : "left", duration : 300 } );
	},
}));

/* Transition from addSchedScreen (add new schedule page) to schedScreen (schedules page) */
Handler.bind("/backToSchedMain", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), addSchedScreen,schedMainScreen, { direction : "right", duration : 300 } );
	},
}));

Handler.bind("/addToSaved", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), addSchedScreen, savedSched, { direction : "left", duration : 300 } );
	},
}));
Handler.bind("/setTimerOpen", Behavior({
	onInvoke: function(handler, message){
		statusScreen.coordinates = {right:0, left:0, bottom:150};
	},
}));

Handler.bind("/addSchedOpen", Behavior({
	onInvoke: function(handler, message){
		addSchedScreen.coordinates = {right:0, left:0, bottom:150};
	},
}));

Handler.bind("/addSched", Behavior({
	onInvoke: function(handler, message){
		addSchedScreen.coordinates = {right:0, left:0, top:0, bottom:0};
	},
}));

Handler.bind("/setTimer", Behavior({
	onInvoke: function(handler, message){
		statusScreen.coordinates = {right:0, left:0, bottom:0,top:0};
	},
}));

var mainScreen = new MainScreen();

/** Screens **/

var statusScreen = new MainS.mainColumn();
var schedMainScreen = new SchedMainS.mainContainer();
var addSchedScreen = new AddSchedS.mainContainer();
var savedSched = new SavedSchedS.mainContainer();
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