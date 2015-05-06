// KPR Script file
var labelStyle = new Style({ font:"20px Heiti SC", color:"black", horizontal:"center", vertical:"middle" });
var titleStyle = new Style({ font:"28px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var backStyle = new Style({ font:"20px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var plusStyle = new Style({ font:"40px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var nextStyle = new Style({ font:"30px Heiti SC", color:"gray", horizontal:"center", vertical:"top" });
var whiteLabelStyle = new Style({ font:"16px Heiti SC", color:"white", horizontal:"center", vertical:"middle" });
var touchBackStyle = new Style({ font:"20px Heiti SC", color:"#545e5d", horizontal:"center", vertical:"top" });

var greenS = new Skin({fill:"#6ebab5"});
var greyS = new Skin({fill:"gray"});
var whiteSkin = new Skin({fill:"white"});
var action = ""
var schedNameLabel = new Label({left:40, string: "", style: titleStyle})
var savedSchedObj;
Handler.bind("/getSchedSteps", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
			msgString = JSON.stringify({steps:savedSchedObj,name:schedNameLabel.string});
			message.responseText = msgString
			message.status = 200;
			msg = new Message("/saveSchedule");
			msg.requestText = msgString
			application.invoke(msg,Message.JSON);
			}}
}));
Handler.bind("/receiveNewSchedInfo", 
	Behavior({
	onInvoke: function(handler, message){
		handler.invoke(new Message("/getNewSchedInfo"), Message.TEXT);		
	},
	onComplete: function(handler, message, text){
		if (text != undefined) {
			var msg = JSON.parse(text);
			sched = msg.steps
			savedSchedObj = msg.steps
			stepNum = sched.size + 1
			schedNameLabel.string = msg.name
			for (i = 0; i < stepNum-1;i++) {
				info1Labell = new Label({top:5, left:0, bottom:0, height:20, string:sched.steps[i], style: labelStyle});
                info2Labell = new Label({top:5, left:0, bottom:5, height:20, string: sched.steps[i+1], style: labelStyle});
                addLabelContainer33 = new Column({left:5,right:0,top:5,contents: [info1Labell, info2Labell,new Container({height:1, skin:greenS, left:10, right:10})]});
                stepsContainer.add(addLabelContainer33);
                i += 1
				}
			

				}}
			
			}));
			
/* step 1 */
stepsContainer = new Column({left:0,right:0,top:0,bottom:0,contents: []});
var info1 = "Step 1: Bake at 325 °F"  
step1Label1 = new Label({top:5, left:0, bottom:0, string:info1, height:20, style: labelStyle});
var info2 = "for 2 hours and 0 minutes";
step1Label2 = new Label({top:0, left:0, bottom:5, height:20, string:info2, style: labelStyle});
var addLabelColumn = new Column({left:0, right:0,contents: [step1Label1,step1Label2]});
var addLabelContainer = new Line({top:0, left:15, right:0, height:80, skin:whiteSkin, contents:[]});
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
					startNewSched = new Message("/hardcodedInstruction");
					startNewSched.requestText = JSON.stringify({steps:savedSchedObj,name:schedNameLabel.string});
					application.invoke(startNewSched,Message.TEXT);
					saveNewSched = new Message("/saveSchedule");
					saveNewSched.requestText = startNewSched.requestText
					application.invoke(saveNewSched,Message.TEXT);
					application.invoke(new Message("/savedToMain"));
				}}
        })
}});

var startButton = new startButtonTemplate();
var startButtonContainerTemplate = Container.template(function($) { return {
	top:0, bottom: 20, contents:[startButton]
}});


Handler.bind("/cleanSavedSched", Object.create(Behavior.prototype, {
//@line 27
	onInvoke: { value: function( handler, message ){
			stepsContainer = new Column({left:0,right:0,top:0,bottom:0,contents: []});
			}}
}));
exports.mainContainer = new Column.template(function($) { return {top:0, left:0, right:0, bottom:0, skin:whiteSkin, active:true,
	contents:[
		new Line({height: 60, left:0, right:0, skin:greenS, top:0,
			contents: [ 
				new Label({left:5, string: "❮ Back", style: backStyle,active:true,
				behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
					onTap: { value:  function(button) {
						application.invoke(new Message("/savedSchedToAddSched"));
						application.invoke(new Message("/cleanSavedSched"));
						stepsCon.empty(0,stepsCon.length);
						button.style= backStyle
						}},
					onTouchBegan: { value: function(button) {
							button.style = touchBackStyle
							}}
					})}),
				schedNameLabel,
			]
		}),
		stepsContainer,
		new startButtonContainerTemplate()
	]
}});