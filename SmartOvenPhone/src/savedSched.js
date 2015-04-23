// KPR Script file
var SCHED = require("AddSchedScreen.js");
var labelStyle = new Style({ font:"20px Heiti SC", color:"black", horizontal:"center", vertical:"middle" });
var titleStyle = new Style({ font:"28px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var backStyle = new Style({ font:"20px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var plusStyle = new Style({ font:"40px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var nextStyle = new Style({ font:"30px Heiti SC", color:"gray", horizontal:"center", vertical:"top" });
var whiteLabelStyle = new Style({ font:"16px Heiti SC", color:"white", horizontal:"center", vertical:"middle" });

var greenS = new Skin({fill:"#6ebab5"});
var greyS = new Skin({fill:"gray"});
var whiteSkin = new Skin({fill:"white"});
var action = ""
Handler.bind("/receiveNewSchedInfo", 
	Behavior({
	onInvoke: function(handler, message){
		trace("HI");
		handler.invoke(new Message("/getNewSchedInfo"), Message.TEXT);		
	},
	onComplete: function(handler, message, text){
		if (text != undefined) {
			var msg = JSON.parse(text);
			trace(msg.action);
			action = msg.action
			info1Label.string = action;
			}}}))
			

/* step 1 */
//var schedule = SCHED.info
info1 = action;
info1Label = new Label({top:5, left:0, bottom:0, height:20, string:info1, style: labelStyle});
var info2 = "for 0 hours and 45 minutes";
info2Label = new Label({top:0, left:0, bottom:5, height:20, string:info2, style: labelStyle});
var addLabelColumn = new Column({left:0, right:0,contents: [info1Label,info2]});
var addLabelContainer = new Line({top:0, left:15, right:0, height:80, skin:whiteSkin, contents:[addLabelColumn]});

/* step 2 */
var info3 = "Step 2: Broil at 245 °F";
info3Label = new Label({top:5, left:0, bottom:0, height:20, string:info3, style: labelStyle});
var info4 = "for 0 hours and 20 minutes";
info4Label = new Label({top:0, left:0, bottom:5, height:20, string:info4, style: labelStyle});
var addLabelColumn1 = new Column({left:0, right:0,contents: [info3Label, info4Label]});
var addLabelContainer1 = new Line({top:0, left:15, right:0, height:80, skin:whiteSkin, contents:[addLabelColumn1]});

/* start schedule button */
var startButtonTemplate = BUTTONS.Button.template(function($){ return{
        height: 35, width: 150, skin:greenS,
        contents: [
                new Label({string:"Start Schedule", name:"doneLabel", style: whiteLabelStyle})
        ],
        behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
                onTouchBegan: { value:  function(button){
					button.skin = greyS;
				}},
				onTouchEnded: { value:  function(button){
					button.skin = greenS;
					application.invoke(new Message("/hardcodedInstruction"));
					application.invoke(new Message("/savedToMain"));
				}}
        })
}});

var startButton = new startButtonTemplate();
var startButtonContainerTemplate = Container.template(function($) { return {
	top:0, bottom: 20, contents:[startButton]
}});



exports.mainContainer = new Column.template(function($) { return {top:0, left:0, right:0, bottom:0, skin:whiteSkin, active:true,
	contents:[
		new Line({height: 60, left:0, right:0, skin:greenS, top:0,
			contents: [ 
				new Label({left:5, string: "❮ Back", style: backStyle}),
				new Label({left:40, string: "Turkey", style: titleStyle}),
			]
		}),
		addLabelContainer,
		new Container({height:1, skin:greenS, left:10, right:10}),
		new startButtonContainerTemplate()
	]
}});
application.invoke(new Message("/receiveNewSchedInfo"));