//@program
var THEME = require("themes/flat/theme");
var BUTTONS = require("controls/buttons");

var logging = false;
var myLog = function(message){if(logging){traceLine(message)}};
var traceLine = function(message){trace(message+"\n")};

var styleFromTemplate = function() { return new Style( { font: "bold 20px", color:"black" })};

deviceURL = "";

var logo = new Texture("fill.png");

var logoSkin = new Skin({
	width:100,
	height:100,
	texture: logo,
	fill:"white"
});

var whiteSkin = new Skin( { fill:"white" } );
var blueSkin = new Skin( { fill:"blue" } );
var redSkin = new Skin( { fill:"red" } );

Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		deviceURL = JSON.parse(message.requestText).url;
		trace("discovered device");
	}
}));

Handler.bind("/forget", Behavior({
	onInvoke: function(handler, message){
		deviceURL = "";
	}
}));

var alertLabel = new Label({left:0, right:0, height:40, string:"No Alerts", style: styleFromTemplate()});

/* Alerts from device */
Handler.bind("/foodLevelLow", Behavior({
	onInvoke: function(handler, message){
		myLog("phone received food level low alert \n");
		treatsGiven = 0;
		alertLabel.string = "ALERT: Food Level Below 10%";
		/*message.responseText = JSON.stringify( { treatsGiven: "0" } );*/
		message.status = 200;
		myLog("phone done with water level low alert \n");
	}
}));
Handler.bind("/foodLevelOK", Behavior({
	onInvoke: function(handler, message){
		myLog("phone received food level ok alert \n");
		treatsGiven = 0;
		alertLabel.string = "Food Dispensor Level above 10%";
		/*message.responseText = JSON.stringify( { treatsGiven: "0" } );*/
		message.status = 200;
		myLog("phone done with water level ok alert \n");
	}
}));

/* Dispenser Level Updates from Device */
Handler.bind("/updateWaterLevel", Behavior({
	onInvoke: function(handler, message){
		myLog("phone received update water level \n");
		var level = message.requestText*1;
		waterLevelBlock.height = message.requestText*containerHeight;
		waterLevelLabel.string = level.toFixed(2)+"%"
		myLog("phone done with update water level \n");
	}
}));
Handler.bind("/updateFoodLevel", Behavior({
	onInvoke: function(handler, message){
		myLog("phone received update food level \n");
		var level = message.requestText*1;
		foodLevelBlock.height = message.requestText*containerHeight;
		foodLevelLabel.string = level.toFixed(2)+"%"
		myLog("phone done with update food level \n");
	}
}));
Handler.bind("/updateTreatLevel", Behavior({
	onInvoke: function(handler, message){
		myLog("phone received update treat level \n");
		var level = message.requestText*1;
		treatLevelBlock.height = message.requestText*containerHeight;
		treatLevelLabel.string = level.toFixed(2)+"%"
		myLog("phone done with update treat level \n");
	}
}));

var waterBehavior = Behavior({
						onTouchBegan: function(container, id, x, y, ticks){
								container.style.size = container.style.size - 2;
						},
						onTouchEnded: function(container, content){
							container.style.size = container.style.size + 2;
							if (deviceURL != "") content.invoke(new Message(deviceURL + "giveWater"), Message.JSON);
						},
						onComplete: function(content, message, json){
							waterCounterLabel.string = json.treatsGiven;
						}
					});
var foodBehavior = Behavior({
						onTouchBegan: function(container, id, x, y, ticks){
								container.style.size = container.style.size - 2;
						},
						onTouchEnded: function(container, content){
							container.style.size = container.style.size + 2;
							if (deviceURL != "") content.invoke(new Message(deviceURL + "giveFood"), Message.JSON);
						},
						onComplete: function(content, message, json){
							foodCounterLabel.string = json.treatsGiven;
						}
					});
var treatBehavior = new Behavior({
						onTouchBegan: function(container, id, x, y, ticks){
								container.style.size = container.style.size - 2;
						},
						onTouchEnded: function(container, content){
							container.style.size = container.style.size + 2;
							if (deviceURL != "") content.invoke(new Message(deviceURL + "giveTreat"), Message.JSON);
						},
						onComplete: function(content, message, json){
							treatCounterLabel.string = json.treatsGiven;
						}
					});
var waterCounterLabel = new Label({left:0, right:0, height:40, string:"0", style: styleFromTemplate()});
var foodCounterLabel = new Label({left:0, right:0, height:40, string:"0", style: styleFromTemplate()});
var treatCounterLabel = new Label({left:0, right:0, height:40, string:"0", style: styleFromTemplate()});

var containerHeight = 70;
var waterLevelBlock = new Content({left:0, right:0, bottom:0, height:containerHeight, skin: blueSkin}),
var foodLevelBlock = new Content({left:0, right:0, bottom:0, height:containerHeight, skin: blueSkin}),
var treatLevelBlock = new Content({left:0, right:0, bottom:0, height:containerHeight, skin: blueSkin}),

var waterStyle = styleFromTemplate();
var foodStyle = styleFromTemplate();
var treatStyle = styleFromTemplate();

var waterLevelLabel = new Label({left:0, right:0, height:20, string:"100%", style: waterStyle}),
var foodLevelLabel = new Label({left:0, right:0, height:20, string:"100%", style: foodStyle}),
var treatLevelLabel = new Label({left:0, right:0, height:20, string:"100%", style: treatStyle}),



var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		new Line({left:0, right:0, height:30, skin: logoSkin}),
		new Line({left:0, right:0, skin: whiteSkin,
			contents:[
				new Label({left:0, right:0, height:20, string:"Water", style: waterStyle}),
				new Label({left:0, right:0, height:20, string:"Food", style: foodStyle}),
				new Label({left:0, right:0, height:20, string:"Treats", style: treatStyle}),
			]}),
		new Line({left:0, right:0, height:containerHeight, skin: whiteSkin,
			contents:[
				new Container({left:10, right:5, top:0, bottom:0, skin: redSkin,
					contents: waterLevelBlock}),
				new Container({left:10, right:5, top:0, bottom:0, skin: redSkin,
					contents: foodLevelBlock}),
				new Container({left:10, right:5, top:0, bottom:0, skin: redSkin,
					contents: treatLevelBlock}),
			]
		}),
		new Line({left:0, right:0, skin: whiteSkin,
			contents:[
				waterLevelLabel,
				foodLevelLabel,
				treatLevelLabel
			]}),
		new Line({left:0, right:0, height:30, skin: logoSkin}),
		
		new Line({left:0, right:0, skin: whiteSkin,
			contents:[
				new Label({left:0, right:0, height:20, string:" /~~~\\ ", style: waterStyle, active: "true",
					behavior: Behavior({
						onTouchBegan: function(container, id, x, y, ticks){
								container.style.size = container.style.size - 2;
						},
						onTouchEnded: function(container, content){
							container.style.size = container.style.size + 2;
							if (deviceURL != "") container.invoke(new Message(deviceURL + "giveWater"), Message.JSON);
						},
						onComplete: function(content, message, json){
							waterCounterLabel.string = json.waterGiven;
						}
					})
					}),
				new Label({left:0, right:0, height:20, string:" /***\\ ", style: foodStyle, active: "true",
					behavior: Behavior({
						onTouchBegan: function(container, id, x, y, ticks){
								container.style.size = container.style.size - 2;
						},
						onTouchEnded: function(container, content){
							container.style.size = container.style.size + 2;
							if (deviceURL != "") container.invoke(new Message(deviceURL + "giveFood"), Message.JSON);
						},
						onComplete: function(content, message, json){
							foodCounterLabel.string = json.foodGiven;
						}
					})}),
				new Label({left:0, right:0, height:20, string:" /_*_\\ ", style: treatStyle, active: "true",
					behavior: Behavior({
						onTouchBegan: function(container, id, x, y, ticks){
								container.style.size = container.style.size - 2;
						},
						onTouchEnded: function(container, content){
							container.style.size = container.style.size + 2;
							if (deviceURL != "") container.invoke(new Message(deviceURL + "giveTreat"), Message.JSON);
						},
						onComplete: function(content, message, json){
							treatCounterLabel.string = json.treatsGiven;
						}
					})})
			]}),
		new Line({left:0, right:0, height:30, skin: whiteSkin}),

		new Line({left:0, right:0, skin: whiteSkin,
			contents:[
				new Label({left:0, right:0, height:40, string:"Water Sent:", style: styleFromTemplate()}),
				new Label({left:0, right:0, height:40, string:"Food Sent:", style: styleFromTemplate()}),
				new Label({left:0, right:0, height:40, string:"Treats Sent:", style: styleFromTemplate()}),
			]}),
		new Line({left:0, right:0, skin: whiteSkin,
			contents:[
				waterCounterLabel,
				foodCounterLabel,
				treatCounterLabel
			]}),
		alertLabel
	]
});

var ApplicationBehavior = Behavior.template({
	onLaunch: function(application) {
		application.shared = true;
	},
	onDisplayed: function(application) {
		application.discover("smartfeederdevice.app");
	},
	onQuit: function(application) {
		application.forget("smartfeederdevice.app");
		application.shared = false;
	},
})

application.behavior = new ApplicationBehavior();
application.add(mainColumn);
myLog("phone running\n");
