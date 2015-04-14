// KPR Script file
var labelStyle = new Style({ font:"20px Heiti SC", color:"black", horizontal:"center", vertical:"middle" });
var titleStyle = new Style({ font:"28px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var backStyle = new Style({ font:"20px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var plusStyle = new Style({ font:"40px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var nextStyle = new Style({ font:"30px Heiti SC", color:"gray", horizontal:"center", vertical:"top" });

var greenS = new Skin({fill:"#67BFA0"});
var whiteSkin = new Skin({fill:"white"});

var quicheLabel = new Label({left:15, style:labelStyle, string: "Quiche"});
var nextLabel = new Label({left:200, style:nextStyle, string: "❯"});
var quicheContainer = new Line({top:0, left:0, right:0, height:80, skin:whiteSkin, contents:[quicheLabel, nextLabel]});

var turkeyLabel = new Label({left:15, style:labelStyle, string: "Turkey"});
var nextLabel1 = new Label({left:210, style:nextStyle, string: "❯"});
var turkeyContainer = new Line({top:0, left:0, right:0, height:80, skin:whiteSkin, contents:[turkeyLabel, nextLabel1]});

var mainContainer = new Column({top:0, left:0, right:0, bottom:0, skin:whiteSkin, active:true,
	contents:[
		new Line({height: 60, left:0, right:0, skin:greenS, top:0,
			contents: [ 
				new Label({left:5, string: "❮ Back", style: backStyle}),
				new Label({left:25, string: "Schedules", style: titleStyle}),
				new Label({left:50, string: "+", style:plusStyle})
			]
		}),
		quicheContainer,
		new Container({height:1, skin:greenS, left:10, right:10}),
		turkeyContainer
	]
});

application.add(mainContainer);