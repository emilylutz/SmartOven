//@module
var CONTROL = require('mobile/control');
var KEYBOARD = require('mobile/keyboard');
var BUTTONS = require('controls/buttons');
var SCROLLER = require('mobile/scroller');
var NUMKEYBOARD = require("numKeyboard.js");

/*STYLES*/
var labelStyle = new Style({ font:"16px Heiti SC", color:"black", horizontal:"center", vertical:"middle" });
var errorStyle = new Style({ font:"11px Heiti SC", color:"red", horizontal:"center", vertical:"middle" });
var whiteLabelStyle = new Style({ font:"16px Heiti SC", color:"white", horizontal:"center", vertical:"middle" });
var menuStyle = new Style({ font:"15px Heiti SC", color:"black", horizontal:"center", vertical:"top" });
var titleStyle = new Style({ font:"28px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var fieldStyle = new Style({ color: 'black', font: '15px Heiti SC', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var fieldHintStyle = new Style({ color: '#aaa', font: "15px Heiti SC", horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var backStyle = new Style({ font:"20px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var touchBackStyle = new Style({ font:"20px Heiti SC", color:"#545e5d", horizontal:"center", vertical:"top" });

/*SKINS*/
var menuBackgroundSkin = new Skin({ fill: "#00FFFF" } );
var menuButtonSkin = new Skin({fill: "#CCCCCC" });
var dropDownSkin = new Skin({borders: { left:2, right:2, top:2, bottom:2 }, fill: "white", stroke: 'gray'});
var nameInputSkin = new Skin({ borders: { left:2, right:2, top:2, bottom:2 }, fill: "white", stroke: 'gray', left: 5, right: 5, top: 5, bottom: 5});
var whiteSkin = new Skin({fill:"white"});
var greenS = new Skin({fill:"#67BFA0"});
var greenBorderS = new Skin({borders: { left:1, right:1, top:1, bottom:1 }, fill: "white", stroke: '#67BFA0', left: 5, right: 5, top: 5, bottom: 5});
var greyS = new Skin({fill:"gray"});
var keyboardButtonStyle = new Style({font:"20px Heiti SC", color:"black", align:"left"});

var info = new Object();
info.action = 'Bake';
info.temperature = 0;
info.hour = 0;
info.minutes = 0;
info.menu = false;

var step = 1;

/******** Input name field ******/        
var nameField = Container.template(function($) { return { 
  width: 220, height:29, skin: nameInputSkin, contents: [
    Scroller($, { 
      left: 4, right: 4, top: 4, bottom: 4, active: true, name:"scroller", 
      behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
        Label($, { 
          left: 0, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: fieldStyle, anchor: 'NAME',
          editable: true, string: $.name, name:"nameLabel",
         	behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
         		onEdited: { value: function(label){
         			var data = this.data;
              data.name = label.string;
              label.container.hint.visible = ( data.name.length == 0 );	
         		}},
            onKeyDown: { value:  function(label, key, repeat, ticks) {
                    if (key) {
                        var code = key.charCodeAt(0);
                        if (code == 3 /* enter */ || code == 13 /* return */) {
                            KEYBOARD.hide();
                            subContainer.focus()
							
                        } else {
                            CONTROL.FieldLabelBehavior.prototype.onKeyDown.call(this, label, key, repeat, ticks);
                        }
                    }
                }   
            }
         	}),
         }),
         Label($, {
   			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"Recipe name", name:"hint"
         }),
      ]
    })
  ]
}});

var actionField = Container.template(function($) { return { 
  top:0, width: 100, skin: nameInputSkin, active:true, contents: [
        Label($, { 
          skin: THEME.fieldLabelSkin, style: fieldStyle, anchor: 'NAME',
          string: $.name, active:true, name: "lbl",
         	behavior: Object.create(Behavior.prototype, {
         		onTouchEnded: { value: function(container, id, x,  y, ticks) {
	        	    if (info.menu == false) {
	        	    	actionContainer.add(dropDownMenu);
	        	    	info.menu = true;
	        	    }
	        	}}
         	}),
         })
  ]
}});

var DropDownMenu = Container.template(function($) { return {
	width: 100, top:0, skin: dropDownSkin, active: true,
	contents: [
	           Column($, {left: 5, right: 5, top: 5, bottom: 5, 
	        	   contents: [
			           Label($, {style:menuStyle, active: true, string:'Bake',
			        	    behavior: Object.create(Behavior.prototype, {
			        	    	onTouchEnded: { value: function(container, id, x,  y, ticks) {
				        	    	   actionContainer.remove(dropDownMenu);
				        	    	   aField.lbl.string = "Bake";
				        	    	   info.action = "Bake";
			        				   info.menu = false;
			        	    	}}
			        	    })     	    	
			           }),
			           Label($, {style:menuStyle, active: true, string:'Broil', 
			        	    behavior: Object.create(Behavior.prototype, {
			        	    	onTouchEnded: { value: function(container, id, x,  y, ticks) {		        			   	   
			        			   	   actionContainer.remove(dropDownMenu);
			        			   	   aField.lbl.string = "Broil";
			        			   	   info.action = "Broil";
			        			   	   info.menu = false;
			        	    	}}
			        	    })   
			           }),			           
		           ]
	           })
          ]

}});

/* name */
var nField = new nameField({name: ""});
var nameContainer = new Line({left:10, top:15, contents:[nField]});

/* action */
var aField = new actionField({ name: "Action" });
var dropDownMenu = new Container({left:0, right:0, top:23, contents:[new DropDownMenu()]});
var actionContainer = new Container({top:10, height:65, contents:[aField]});

/* temperature */
var temperatureField = new Label({ skin: THEME.fieldLabelSkin, style: fieldStyle, string: "Temperature"});
var tFieldContainer = new Container({width: 100, skin:nameInputSkin,contents:[temperatureField]});	
var tempButton = new NUMKEYBOARD.openKeyboardTemplate({top:0,bottom:0,height:23,width:100,skin: greenS, label:temperatureField, max:12, scroller:mainScroller, fieldHint: "Temperature",
	contents:[]});
var temperatureContainer = new Container({top:10, left:20, skin:greenS, contents:[tempButton, tFieldContainer]});

tempActionContainer = new Line({left:0, contents:[actionContainer, temperatureContainer]});

/* hour */
var hourLabel = new Label({ left:0, style: fieldStyle, string: "H"});
var hourField = new Label({ skin: THEME.fieldLabelSkin, style: fieldStyle, string: "--"});
var hourFieldContainer = new Container({width: 40, skin:nameInputSkin,contents:[hourField]});	
var hourButton = new NUMKEYBOARD.openKeyboardTemplate({action:"/addSched",top:0,bottom:0,height:23,width:40,skin: greenS, label:hourField, max:2, scroller:mainScroller, fieldHint: "--",
	contents:[]});
var hContainer = new Container({left: 20,contents:[hourButton, hourFieldContainer]});
var hourContainer = new Container({left:0,top:0, right:2, contents:[hourLabel, hContainer]});

/* minutes */
var minuteLabel = new Label({ left:40,style: fieldStyle, string: "M"});
var minuteField = new Label({ skin: THEME.fieldLabelSkin, style: fieldStyle, string: "--"});
var minuteFieldContainer = new Container({width: 40, skin:nameInputSkin,contents:[minuteField]});	
var minuteButton = new NUMKEYBOARD.openKeyboardTemplate({action:"/addSched",top:0,bottom:0,height:23,width:40,skin: greenS, label:minuteField, max:2, scroller:mainScroller, fieldHint: "--",
	contents:[]});
var minContainer = new Container({left:0, contents:[minuteButton, minuteFieldContainer]});
var minuteContainer = new Container({top:0, left:2, contents:[minContainer, minuteLabel]});

/* addButton */
function updateInfo() {
	info.temperature = temperatureField.string;
	info.hour = hourField.string;
	info.minutes = minuteField.string;
};
function reinitialize() {
	info.action = 'Bake';
	info.temperature = 0;
	info.hour = 0;
	info.minutes = 0;
    info.menu = false;
    stepLabel.string = "Step " + step;
    aField.lbl.string = "Action";
    temperatureField.string = "Temperature";
    hourField.string = "--";
    minuteField.string = "--";
};
function allFieldsFilled() {
	if (aField.lbl.string == "Action" | temperatureField.string == "Temperature" | hourField.string == "--" | minuteField.string == "--") {
		return false;
	} else return true;
};
var errorMessage = new Label({top:10, string:"**Please fill in all of the fields before adding a step.", style:errorStyle});
var hasError = false;
var addButtonTemplate = BUTTONS.Button.template(function($){ return{
		height: 35, width: 90, skin:greenS,
        contents: [
                new Label({string:"Add Step", name:"addLabel", style: whiteLabelStyle})
        ],
        behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
                onTouchBegan: { value:  function(button){
					button.skin = greyS;
				}},
				onTouchEnded: { value:  function(button){
					button.skin = greenS;
					if (allFieldsFilled()) {
						if (hasError) {
							mainFieldContainer.remove(errorMessage);
						}
						updateInfo();
                    	var info1 = "Step " + step + ": " + info.action + " at " + info.temperature + "°F";
                    	info1Label = new Label({top:5, left:0, bottom:0, height:20, string:info1, style: labelStyle});
                    	var info2 = "for " + info.hour + " hours and " + info.minutes + " minutes";
                    	info2Label = new Label({top:0, left:0, bottom:5, height:20, string:info2, style: labelStyle});
                    	addLabelContainer = new Column({left:0, right:0,contents: [info1Label, info2Label]});
                    	instructionContainer.col.add(addLabelContainer);
                    	mainFieldContainer.remove(fieldContainer);
                    	step++;
                    	reinitialize();
    					mainFieldContainer.add(fieldContainer);
    				} else {
    					if (!hasError) {
    						mainFieldContainer.add(errorMessage);
    						hasError = true;
    					}
    				}
				}}
        })
}});

var addButton = new addButtonTemplate();
var addButtonContainerTemplate = Container.template(function($) { return {
	left:10, top:-5, skin: greenS, contents:[addButton]
}});

/* time */
var timeLabel = new Label({ left:4, style: labelStyle, string: "Time"});
var colonLabel = new Label({ style: labelStyle, string: ":"});
var timeContainer = new Line({left:0, top:5, bottom:10, contents:[timeLabel, hourContainer, colonLabel, minuteContainer, new addButtonContainerTemplate()]});

/* field container template */
var stepLabel = new Label({top:10, left:0, string:"Step 1", style:labelStyle});
var fieldContainerTemplate = Container.template(function($) { return {
	name:"fieldContainer", top:10,skin: greenBorderS, active: true,
	contents: [
		new Column({left:15, top:0, right:15, width: 270, contents:[stepLabel,tempActionContainer,timeContainer]})
	]
}});
var fieldContainer = new fieldContainerTemplate();

/* instruction container*/
var instructionContainerTemplate = Container.template(function($) { return {
	top:10, contents:[new Column({name:"col"})]
}});
var instructionContainer = new instructionContainerTemplate();

/* doneButton */
var noStepsErrorMessage = new Label({top:10, string:"**Please add a step to your schedule before saving.", style:errorStyle});
var noNameErrorMessage = new Label({top:10, string:"**Please name your schedule before saving.", style:errorStyle});
var hasDoneError = false;
var doneButtonTemplate = BUTTONS.Button.template(function($){ return{
        height: 35, width: 150, skin:greenS,
        contents: [
                new Label({string:"Done", name:"doneLabel", style: whiteLabelStyle})
        ],
        behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
                onTouchBegan: { value:  function(button){
					button.skin = greyS;
				}},
				onTouchEnded: { value:  function(button){
					button.skin = greenS;
					if (step == 1) {
						if (!hasDoneError) {
							subContainer.add(noStepsErrorMessage);
							hasDoneError = true;
						}
					} else {
						if (hasDoneError) {
							subContainer.remove(doneErrorMessage);
						}
						doneMessage = new Label({top:20, string:"Your schedule has been saved!", style: labelStyle});
                		subContainer.add(doneMessage);
					}
					application.invoke(new Message("/addToSaved"));
				}}
        })
}});

var doneButton = new doneButtonTemplate();
var doneButtonContainerTemplate = Container.template(function($) { return {
	top:10, left:10, bottom: 20, contents:[doneButton]
}});
var mainFieldContainer = new Column({name:"subCol", contents:[fieldContainer, instructionContainer], active:true});

var scroller = SCROLLER.VerticalScroller.template(function($){ return{
	contents:$.contents
}});

var subContainer = new Column({top:0, left:0, right:0, skin:whiteSkin, active:true,
	behavior: Behavior({
		onTouchEnded: function(content){
			KEYBOARD.hide();
			content.focus();
		}
	}),
	contents:[
		new Container({height: 60, left:0, right:0, skin:greenS, top:0,
			contents: [ new Label({ left:5, string: "❮ Back", active:true,editable:true,style: backStyle,
				behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
					onTap: { value:  function(button) {
						application.invoke(new Message("/backToSchedMain"));
						button.style= backStyle
						}},
					onTouchBegan: { value: function(button) {
							button.style = touchBackStyle
							}}
					})}), new Label({left:80,string: "Set Schedule", style: titleStyle}) ]
		}),
		nameContainer,
		mainFieldContainer,
		new Container({top:20, contents: [new doneButtonContainerTemplate()]}),
	]
});

var mainScroller = new scroller({skin:whiteSkin, contents:[subContainer]});
exports.mainContainer = new Container.template(function($) { return {top:0, left:0, right:0, bottom:0, skin:whiteSkin, 
	contents:[ mainScroller ]}});
	
