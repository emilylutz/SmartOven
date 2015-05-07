//@module
var labelStyle = new Style({ font:"20px Heiti SC", color:"black", horizontal:"center", vertical:"middle" });
var titleStyle = new Style({ font:"28px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var backStyle = new Style({ font:"20px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var touchBackStyle = new Style({ font:"20px Heiti SC", color:"#545e5d", horizontal:"center", vertical:"top" });
var plusStyle = new Style({ font:"40px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var touchPlusStyle = new Style({ font:"40px Heiti SC", color:"#545e5d", horizontal:"center", vertical:"top" });
var nextStyle = new Style({ font:"30px Heiti SC", color:"gray", horizontal:"center", vertical:"top" });

var greenS = new Skin({fill:"#6ebab5"});
var clearS = new Skin({fill:""});
var whiteSkin = new Skin({fill:"white"});
var redS = new Skin({fill:"#DB0000"});
var clearSBordered = new Skin({fill:"",borders:{left:0,right:0,top:0,bottom:1},stroke:"#C3D9D7"});
var buttonHeight = 70

var schedButtonTemp =  Container.template(function($){ return{
		top:0,left:0, active:true,right:0,raito:-90,height:buttonHeight,skin:clearSBordered,
	contents:$.contents,title:$.title,del:$.del,
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			var startMsg = new Message("/lookAtSched");
			startMsg.requestText = $.title
			application.invoke(startMsg);
			application.invoke(new Message("/schedMainToStart"));
		}},
		onTouchBegan: { value:  function(button,id, x, y, ticks){
			button.captureTouch( id, x, y, ticks );
			this.anchor = x;
		}},
		onTouchMoved:  { value: function(button, id, x, y, ticks) {
			movedBy = this.anchor - x
			if (movedBy > 0) {
				if (-90 + movedBy <= 0) {
					button[0].coordinates = {top:0,left:-movedBy,width:90,height:buttonHeight}
					}
				}
		}},
		onTouchEnded:  { value: function(button, id, x, y, ticks) {
			
			if (this.anchor - x > 50) {
				button[0].coordinates = {top:0,left:-90,width:90,height:buttonHeight}
				button[0][2].active = true
				}
			else {
				var startMsg = new Message("/lookAtSched");
				startMsg.requestText = $.title
				application.invoke(startMsg);
				application.invoke(new Message("/schedMainToStart"));
				}
			
			}}
	})
}});

var deleteButtonTemp = 	Container.template(function($){ return{
		top:0,width:90, active:false,left:320,height:buttonHeight,skin:redS,contents: [new Label({string:"Delete",style:backStyle,left:0,right:0})],title:$.title,
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value:  function(button){
			ggg = mainColumn[$.title]
			mainColumn.remove(ggg)
			
		}},
		onTouchBegan: { value:  function(button,id, x, y, ticks){
		}},
	})
}});	
Handler.bind("/addToList", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
			var schedTitle = message.requestText
			
			tempAdd = new schedButtonTemp({contents: [new Container({left:0,height:buttonHeight,contents:[
			new Label({left:10, style:labelStyle, string: schedTitle}), 
			new Label({left:295, style:nextStyle, string: "❯"}),
			new deleteButtonTemp({title:schedTitle})]})], title:schedTitle})
			tempAdd.name = schedTitle
			mainColumn.add(tempAdd);
			}}
}));
var mainColumn = new Column({top:0, left:0, right:0, bottom:0, skin:whiteSkin, active:true,
	contents:[
		new Line({height: 60, left:0, right:0, skin:greenS, top:0,
			contents: [ new Label({ left:5, string: "❮ Back", active:true,editable:true,style: backStyle,
				behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
					onTap: { value:  function(button) {
						application.invoke(new Message("/backToMain"));
						button.style= backStyle
						}},
					onTouchBegan: { value: function(button) {
							button.style = touchBackStyle
							}}
					})})
				,
				new Label({left:25, string: "Schedules", style: titleStyle}),
				new Label({left:50, string: "+", active:true,style:plusStyle, 
				behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
					onTap: { value:  function(button) {
						application.invoke(new Message("/toAddSched"));
						button.style = plusStyle
				}},
				onTouchBegan: { value: function(button) {
					button.style = touchPlusStyle
							}}
				})})
			]
		}),
	]
});

chickTemp = new schedButtonTemp({contents: [new Container({left:0,height:buttonHeight,contents:[
	new Label({left:10, style:labelStyle, string: "Chicken"}), 
	new Label({left:295, style:nextStyle, string: "❯"}),
	new deleteButtonTemp({title:"Chicken"})]})], title:"Chicken"})
chickTemp.name = "Chicken"
mainColumn.add(chickTemp);
exports.mainContainer = new Container.template(function($) { return({left:0,right:0,top:0,bottom:0, contents: [mainColumn]})});