// KPR Script file
//@module
var whiteSkin = new Skin({ fill: 'white',});
var schedulesTemplate = BUTTONS.Button.template(function($){ return{
		left:20, right:20, height: 60,bottom:0,
	contents:[
		 new Label({height:10, string:$.textForLabel,style:whiteStyle}), 
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			trace("temp button pressed");
			application.invoke(new Message("/back"));
		}},
	})
}});
var schedBg = new Picture({height:50, url:"buttons/settemp.png"})
var backButton = new schedulesTemplate({bottom:0,textForLabel:"PEE"});
var whiteStyle = new Style({ color: 'white', font: 'bold 45px', horizontal: 'center', vertical: 'middle', });
var hugeLabelStyle = new Style({ color: 'black', font: 'bold 125px', horizontal: 'center', vertical: 'middle', });
exports.MainCon = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin:whiteSkin, contents: [
	new Label({ left: 0, right: 0, style: hugeLabelStyle, string: 'test', }), new schedulesTemplate({bottom:0,textForLabel:"back"}),
], }});
