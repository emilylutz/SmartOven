var THEME = require('themes/sample/theme');
var CONTROL = require('mobile/control');
var KEYBOARD = require('mobile/keyboard');

/*STYLES*/
var labelStyle = new Style({ font:"24px Heiti SC", color:"black", horizontal:"center", vertical:"middle" });
var menuStyle = new Style({ font:"21px Heiti SC", color:"black", horizontal:"center", vertical:"top" });

/*TEXTURES*/
var menuTexture = new Texture("./assets/menu.png");

/*SKINS*/
var menuBackgroundSkin = new Skin({ fill: "#00FFFF" } );
var menuButtonSkin = new Skin({fill: "#CCCCCC" });
var dropDownSkin = new Skin({borders: { left:2, right:2, top:2, bottom:2 }, fill: "white", stroke: 'gray'});
var nameInputSkin = new Skin({ borders: { left:2, right:2, top:2, bottom:2 }, fill: "white", stroke: 'gray',});
var fieldStyle = new Style({ color: 'black', font: '21px Heiti SC', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var fieldHintStyle = new Style({ color: '#aaa', font: "24px Heiti SC", horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var whiteSkin = new Skin({fill:"white"});

var info = new Object();
info.action = 'Bake';
info.temperature = 0;
info.hour = 0;
info.minutes = 0;
info.menu = false;
              
var nameField = Container.template(function($) { return { 
  width: 250, height: 36, skin: nameInputSkin, contents: [
    Scroller($, { 
      left: 4, right: 4, top: 4, bottom: 4, active: true, 
      behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
        Label($, { 
          left: 0, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: fieldStyle, anchor: 'NAME',
          editable: true, string: $.name,
         	behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
         		onEdited: { value: function(label){
         			var data = this.data;
              data.name = label.string;
              label.container.hint.visible = ( data.name.length == 0 );	
         		}}
         	}),
         }),
         Label($, {
   			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"Recipe name", name:"hint"
         }),
      ]
    })
  ]
}});

var temperatureField = Container.template(function($) { return { 
  left:10, width: 160, height: 36, skin: nameInputSkin, active:true, contents: [
        Label($, { 
          left: 0, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: fieldStyle, anchor: 'NAME',
          string: $.name, active:true, name: "lbl",
         	behavior: Object.create(Behavior.prototype, {
         		onTouchEnded: { value: function(container, id, x,  y, ticks) {
	        	    if (info.menu == false) {
	        	    	temperature.add(dropDownMenu);
	        	    	info.menu = true;
	        	    }
	        	}}
         	}),
         })
  ]
}});

var DropDownMenu = Container.template(function($) { return {
	left: 10, top: -2, width: 160, skin: dropDownSkin, active: true,
	contents: [
	           Column($, {left: 0, right: 0, top: 0, bottom: 0, 
	        	   contents: [
			           Label($, {height: 40, top: 15, style:menuStyle, active: true, string:'Bake',
			        	    behavior: Object.create(Behavior.prototype, {
			        	    	onTouchEnded: { value: function(container, id, x,  y, ticks) {
				        	    	   temperature.remove(dropDownMenu);
				        	    	   tField.lbl.string = "Bake";
			        				   info.menu = false;
			        	    	}}
			        	    })     	    	
			           }),
			           Label($, {height: 40, style:menuStyle, active: true, string:'Preheat', 
			        	    behavior: Object.create(Behavior.prototype, {
			        	    	onTouchEnded: { value: function(container, id, x,  y, ticks) {
			        			   	   temperature.remove(dropDownMenu);
			        			   	   tField.lbl.string = "Preheat";
			        			   	   info.menu = false;
			        	    	}}
			        	    })   
			           }),
			           Label($, {height: 40, style:menuStyle, active: true, string:'Broil', 
			        	    behavior: Object.create(Behavior.prototype, {
			        	    	onTouchEnded: { value: function(container, id, x,  y, ticks) {		        			   	   
			        			   	   temperature.remove(dropDownMenu);
			        			   	   tField.lbl.string = "Broil";
			        			   	   info.menu = false;
			        	    	}}
			        	    })   
			           }),			           
		           ]
	           })
          ]

}})

var dropDownMenu = new Line({left:0, right:0, top:0, bottom:0, contents:[new DropDownMenu()]});
var name = new Line({left:10, right:0, top:0, bottom:0, contents:[new nameField({ name: "" })]});
var tField = new temperatureField({ name: "Temperature" })
var temperature = new Column({left:0, right:0, top:-30, bottom:0, height: 60, contents:[tField]});

var MainContainerTemplate = Container.template(function($) { return {
  left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin, active: true,
  behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
      KEYBOARD.hide();
      content.focus();
    }}
  }),
  contents: [
  	new Column({
		left:0, right:0, top:0, bottom:0,
		contents: [
			name,
			temperature
		]
	})
  ]
}});

var mainContainer = new MainContainerTemplate();

application.add(mainContainer);