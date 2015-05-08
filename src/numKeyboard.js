//@module
/****** Key Button templates *****/

/* SKINS */
var greenS = new Skin({fill:"#6ebab5"});
var greenTouchS = new Skin({fill:"#7d9694"});

var keySkin = new Skin({fill:"#fcfdfd",borders:{left:0,right:0,top:0,bottom:1},stroke:"#c2c5c8"});
var darkGreyS = new Skin({fill:"#c2c5c8"});
var greyS = new Skin({fill:"#fcfdfd"});
var greySBordered = new Skin({fill:"#fcfdfd", borders:{left:0,right:0,top:1,bottom:1},stroke:"#c2c5c8"});
var borderedH = new Skin({borders:{left:0,right:0,top:1,bottom:1},stroke:"#c2c5c8"});
var borderedV = new Skin({borders:{left:1,right:1,top:0,bottom:0},stroke:"#c2c5c8"});
var boxed = new Skin({borders:{left:2,right:2,top:2,bottom:2},stroke:"#c2c5c8"});
var keyHeight = 50

/** STYLES **/
var tempStyle = new Style({font:"20px Heiti SC", color:"black", align:"left"});
var whiteStyle = new Style({font:"20px Heiti SC", color:"white", align:"left"});

var action = "";
var editedLabel = ""
var keyBottom = -150;
var fieldHint1 = ""
/* Changes the value of "Set Temp:" when you type */
function newTempVal(value) {
	//trace(editedLabel.string);
	if (value == "del") {
		str = editedLabel.string
		editedLabel.string = str.substring(0,str.length-1);
		}
	else if (editedLabel.string.length < max) {
	 editedLabel.string+= value
	 }
	 else if (editedLabel.string.substring(0,1) == "0") {
	 	trace(editedLabel.string);
	 	editedLabel.string = editedLabel.string.substring(1,2) + value
	}
	}
	
var canAdd = 1;
var firstOpen = 1;
exports.openKeyboardTemplate = BUTTONS.Button.template(function($){ return{
		top:$.top,left:$.left, right:$.right, width:$.width,fieldHint:$.fieldHint, label:$.label,max:$.max, action: $.action, height: $.height,skin:$.skin,keyboard:$.keyboard,
	contents:$.contents,
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			editedLabel = $.label
			max = $.max
			if (isNaN(editedLabel.string)) {
				editedLabel.string = "";
				}
			fieldHint1 = $.fieldHint
			if (canAdd) {
				if (firstOpen) {		
					application.add(numKeyboard);
					firstOpen = 0;
					}
				outsideKey.active = true;
				button.invoke(new Message("/delayKey"));
				action = $.action
				application.invoke(new Message(action+"Open"));
				}
			canAdd = 0;
		}},
	})
}});
Handler.bind("/moveKey", {
    onInvoke: function(handler, message){
    //trace(application.contents)
    //application.coordinates = {left:0,right:0,bottom:20}
    if (keyBottom < 0) {
   		keyBottom += 10
   		numKeyboard.coordinates = {left:0,right:0,bottom:keyBottom}
	 	handler.invoke( new Message("/delayKey")); }}
	    
});
Handler.bind("/delayKey", {
    onInvoke: function(handler, message){
        handler.wait(5); //will call onComplete 1000 = 1sec
    },
    onComplete: function(handler, message){
        handler.invoke(new Message("/moveKey"));;
    }
});
Handler.bind("/hideNumKey", {
    onInvoke: function(handler, message){
	if (keyBottom > -250) {
		keyBottom -= 10
		numKeyboard.coordinates = {left:0,right:0,bottom:keyBottom}
		handler.invoke(new Message("/delayKeyHide"));
		
		}
	    
}});
Handler.bind("/delayKeyHide", {
    onInvoke: function(handler, message){
        handler.wait(10); //will call onComplete 1000 = 1sec
    },
    onComplete: function(handler, message){
        handler.invoke(new Message("/hideNumKey"));
    }
});




//Number keys
var keyTemplate = BUTTONS.Button.template(function($){ return{
		top:0,left:$.left, right:$.right, num: $.num, height: keyHeight,width: 107,skin:keySkin,
	contents:[],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			button.skin = keySkin
			newTempVal($.num);
		}},
		onTouchBegan: { value:  function(button){
			button.skin = darkGreyS
		}}
	})
}});

//backspace key
var delKeyTemplate = BUTTONS.Button.template(function($){ return{
		top:0,left:$.left, right:$.right, num: $.num, height: keyHeight,width: 107,skin:darkGreyS,
	contents:[],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			button.skin = darkGreyS
			newTempVal($.num);
		}},
		onTouchBegan: { value:  function(button){
			button.skin = keySkin
		}}
	})
}});


// enter key

var enterKeyTemplate = BUTTONS.Button.template(function($){ return{
		top:0,left:0 ,right:0, height: 35,skin:greenS,
	contents:[ new Label({string:"enter",style:whiteStyle})],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			button.skin = greenS;
			button.invoke(new Message("/hideNumKey"));
			canAdd = 1;
			if (editedLabel.string.length == 0) {
				editedLabel.string = fieldHint1
				}
			application.invoke(new Message(action));
		}},
		onTouchBegan: { value:  function(button){
			button.skin = greenTouchS
			
		}}
	})
}});

/**** Key Buttons ****/

var enterKey = new enterKeyTemplate();
var leftLabel = Label.template(function($) { return {left:50, string:$, style:tempStyle, }});
var middleLabel = Label.template(function($) { return {width:106, top:0, bottom:0, skin:borderedV, string:$, style:tempStyle, }});
var rightLabel = Label.template(function($) { return {style:tempStyle,right:50,string:$, }});

var oneButton = new keyTemplate({num:"1", left:0})
var one = new leftLabel("1");
var twoButton = new keyTemplate({num:"2",})
var two = new middleLabel("2");
var threeButton = new keyTemplate({num:"3",right:0})
var three = new rightLabel("3");

var fourButton = new keyTemplate({num:"4", left:0})
var four = new leftLabel("4");
var fiveButton = new keyTemplate({num:"5",})
var five = new middleLabel("5");
var sixButton = new keyTemplate({num:"6",right:0})
var six = new rightLabel("6");

var sevenButton = new keyTemplate({num:"7", left:0})
var seven = new leftLabel("7");
var eightButton = new keyTemplate({num:"8",})
var eight = new middleLabel("8");
var nineButton = new keyTemplate({num:"9",right:0})
var nine = new rightLabel("9");

var blank = new leftLabel("");
var zeroButton = new keyTemplate({num:"0",})
var zero = new middleLabel("0");
var delButton = new delKeyTemplate({num:"del",right:0})
var del = new Label({string:"⌫",style:tempStyle,right:45});

var firstRow = new Container({left:0, right:0, top:0,height: keyHeight,skin: borderedH, contents: [oneButton,twoButton,threeButton,one,two,three]})
var secondRow = new Container({left:0, right:0, top:0,height: keyHeight,skin: greyS, contents: [fourButton,fiveButton,sixButton,four,five,six]})
var thirdRow = new Container({left:0, right:0, top:0,height: keyHeight,skin: greySBordered, contents: [sevenButton,eightButton,nineButton,seven,eight,nine]})
var fourthRow = new Container({left:0, right:0, top:0,height: keyHeight,skin:darkGreyS, contents: [zeroButton,delButton,blank,zero,del]})
var outsideKey = new Container({left:0,right:0,top:0,height:250, active:true,
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
				onTouchBegan: { value:  function(button){
				button.invoke(new Message("/hideNumKey"));
				canAdd = 1;
				if (editedLabel.string.length == 0) {
					editedLabel.string = fieldHint1
				}
				application.invoke(new Message(action));
				button.active = false;
					}}}) });
/*The keyboard */
var numKeyboard = new Column( {right:0,left:0, bottom:keyBottom, contents: [outsideKey,enterKey, firstRow,secondRow,thirdRow,fourthRow]}) 

