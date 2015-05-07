//@module
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
var schedList = new Array();
var currSchedule;
var startSchedTitle = new Label({left:40, string: "", style: titleStyle})
var chickenTemp = new Object();
chickenTemp.steps =["Step1: Bake at 350°F","for  0 hours and 25 minutes","Step2: Bake at 250", "for 1 min"]
chickenTemp.size = 4;
chickenTemp.temps = [350,250]
chickenTemp.hrs = [0,0]
chickenTemp.mins = [1,1]
schedList["Chicken"] = chickenTemp;
Handler.bind("/saveSchedule", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
		var msg = JSON.parse(message.requestText);
		var name = msg.name
		schedList[msg.name] = msg.steps
		msg = new Message("/addToList");
		msg.requestText = name;
		application.invoke(msg,message.TEXT)
			}}
}));


Handler.bind("/lookAtSched", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
		var name = message.requestText
		startSchedTitle.string = name
		currSchedule = schedList[name]
		for (i = 0; i < currSchedule.size-1;i++) {
			info1StartSched = new Label({top:5, left:0, bottom:0, height:20, string:currSchedule.steps[i], style: labelStyle});
            info2StartSched = new Label({top:5, left:0, bottom:5, height:20, string: currSchedule.steps[i+1], style: labelStyle});
            stepsConContents = new Column({left:5,right:0,top:5,contents: [info1StartSched, info2StartSched,new Container({height:1, skin:greenS, left:10, right:10})]});
            stepsCon.add(stepsConContents);
            i += 1
				}}}
}));


stepsCon = new Column({left:0,right:0,top:0,bottom:0,contents: []});
/* start schedule button */
var startButtonTemplate = BUTTONS.Button.template(function($){ return{
        height: 40,left:0,right:0,bottom:0, skin:greenS,
        contents: [
                new Label({string:"Start Schedule", name:"doneLabel", style: backStyle})
        ],
        behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
                onTouchBegan: { value:  function(button){
					button.skin = greyS;
				}},
				onTouchEnded: { value:  function(button){
					button.skin = greenS;
					msgg = new Message("/hardcodedInstruction");
					msgg.requestText = JSON.stringify({steps:currSchedule, name:startSchedTitle.string})
					application.invoke(msgg,Message.TEXT);
					stepsCon.empty(0,stepsCon.length)
					application.invoke(new Message("/startToMain"));
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
				new Label({left:5, string: "❮ Back", style: backStyle,active:true,
				behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
					onTap: { value:  function(button) {
						application.invoke(new Message("/startSchedToSchedMain"));
						stepsCon.empty(0,stepsCon.length);
						button.style= backStyle
						}},
					onTouchBegan: { value: function(button) {
							button.style = touchBackStyle
							}}
					})}),
				startSchedTitle,
			]
		}),
		stepsCon,
		new startButtonTemplate({})
	]
}});