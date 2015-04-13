//@program
var THEME = require('themes/flat/theme');
var BUTTONS = require('controls/buttons');
var CONTROL = require('mobile/control');
var KEYBOARD = require('mobile/keyboard');
var TRANSITIONS = require('transitions');
var SS = require("mainScreen.js")
var TS = require("templatePage.js")
var whiteSkin = new Skin({ fill: 'white',});

/* Main container for application - will hold all screens and handle transitions*/
var MainScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, contents: [], }});

/* Transition from statusScreen (main page) to schedScreen (schedules page) */
Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), statusScreen, schedScreen, { direction : "left", duration : 300 } );
	},
}));
/* Transition from schedScreen (schedules page) to statusScreen (main page) */
Handler.bind("/back", Behavior({
	onInvoke: function(handler, message){
		mainScreen.run( new TRANSITIONS.Push(), schedScreen, statusScreen, { direction : "right", duration : 300 } );
	},
}));	

Handler.bind("/setTimerOpen", Behavior({
	onInvoke: function(handler, message){
		statusScreen.coordinates = {right:0, left:0, bottom:150};
	},
}));

Handler.bind("/setTimer", Behavior({
	onInvoke: function(handler, message){
		statusScreen.coordinates = {right:0, left:0, bottom:0,top:0};
	},
}));

var mainScreen = new MainScreen();

/** Screens **/
var statusScreen = new SS.mainColumn()
var schedScreen = new TS.MainCon();

application.add( mainScreen )
mainScreen.add( statusScreen )