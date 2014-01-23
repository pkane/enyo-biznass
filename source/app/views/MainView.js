enyo.kind({

	name: "MainView",
	kind: "FittableLayout",

	className: "mainView",

	events: {
		onShowArticle: "",
		onShowPhotos: "",
		onShowMarkets: "",
		onShowScores: "",
		onShowSnapshots: "",
		onShowWeather: ""
	},

	published: {
		isRefreshVisible: true
	},	
	
	lastUpdatedDate: null,

	create: function() {
		this.inherited(arguments);
		this.refreshAll();
	},

	components: [
	             
			{kind: "ApplicationEvents", onWindowRotated: "windowRotated"},
			
			{kind: "WebServiceQueue", name: "mainWebService", onSuccess: "serviceSuccess", onFailure: "serviceFail", usePersistence: true,
											  autoNext:false, onStart: "serviceStart", onComplete: "serviceComplete"},

			{kind: enyo.HFlexBox, height: "44px", align: "center", className: "appToolbar", components: [
		     	{kind: enyo.IconButton, className: "infoButton", width: "59px", label: "Scores", icon: "scores", iconIsClassName: true, onclick: "doShowScores"},
		     	{kind: enyo.IconButton, className: "infoButton", width: "59px", label: "Markets", icon: "markets", iconIsClassName: true, onclick: "doShowMarkets"},
		     	{kind: enyo.IconButton, className: "infoButton", width: "61px", label: "Weather", icon: "weather", iconIsClassName: true, onclick: "doShowWeather"},
		     	
				{name: "temperature", className: "temperature", allowHtml: true},
				{name: "location", className: "location"},
				
				{flex: 1, name: "emptyGif"},				
				{name: "lastUpdated", className: "location"},
				{kind: "IconButton", icon: "images/menu-icon-sync.png", className: "refreshButton", name: "refresh", onclick: "refreshAll"},
				{kind: "Spinner", style: "margin-right: 5px;"}				
			]},

			{kind: enyo.HFlexBox, className: "appHeader", height: "178px", components: [
			    
				{kind: enyo.Image, src: "images/app-logo.png"},
				
				{kind: "HScroller", name: "foreheadScroller", className: "foreheadScroller", height: "172px", flex: 1, components: [
					{style: "background: url('images/shadow-top.png'); background-repeat: repeat-x; position:absolute; top: 0; right: 0; left: 0;", height: "4px"}
				]},
				
				{style: "background: url('images/shadow-left.png'); background-repeat: repeat-y; position:absolute; top: 44px; right: 0; left: 232px; width: 5px;", height: "172px"},
			]},
			
			{name: "articleBorderShadow", style: "background: url('images/shadow-top.png'); position: absolute; background-repeat: repeat-x; left: 0; width: 100%; height: 4px; z-index: 1;"},

			{kind: "Scroller", className: "mainArticleScroller", horizontal: false, autoHorizontal: false, flex: 1, components: [

				{kind: enyo.HFlexBox, flex: 0, components: [					

					{kind: enyo.VFlexBox, style: "margin-top: 2px;", width: "36px", components: [
						{kind: "Image", src: "images/label_News.png", className: "sectionButton" },
						{kind: "Image", src: "images/label_Money.png", className: "sectionButton" },
						{kind: "Image", src: "images/label_Sports.png", className: "sectionButton" },
						{kind: "Image", src: "images/label_Life.png", className: "sectionButton" },
						{kind: "Image", src: "images/label_Tech.png", className: "sectionButton" },
						{kind: "Image", src: "images/label_Travel.png", className: "sectionButton" }
					]},
					
					{kind: enyo.VFlexBox, flex: 1, components: [
						{ kind: "ArticleButtonScroller", className: "articleScroller", name: "homeScroller", onItemClick: "openArticle"},
						{ kind: "ArticleButtonScroller", className: "articleScroller", name: "moneyScroller", onItemClick: "openArticle"},
						{ kind: "ArticleButtonScroller", className: "articleScroller", name: "sportsScroller" , onItemClick: "openArticle"},
						{ kind: "ArticleButtonScroller", className: "articleScroller", name: "lifeScroller", onItemClick: "openArticle"},
						{ kind: "ArticleButtonScroller", className: "articleScroller", name: "techScroller" , onItemClick: "openArticle"},
						{ kind: "ArticleButtonScroller", className: "articleScroller", name: "travelScroller" , onItemClick: "openArticle"}
					]}
					
				]}
			]}
	],

	windowActivated: function() {
		enyo.log('main window activated');
	
		if (this.lastUpdatedDate && ((new Date()).getTime() - this.lastUpdatedDate.getTime()) > Config.refreshArticlesTime) {
			this.refreshAll();
		}		
		
		pageEvent('news');
	},
	
	windowRotated: function() {
		this.$.foreheadScroller.scrollIntoView(0, 0);
	},

	foreheadClick: function(inSender, inEvent) {
		
		if (inSender.hasOwnProperty("data") && inSender.data.type === "gallery") {
			this.doShowPhotos(inSender, inEvent);
		} else if (inSender.data.type === 'snapshots') {
			this.doShowSnapshots(inSender, inEvent);
		}		

	},
	
	isRefreshVisibleChanged: function() {
	
		var self = this;	

		if (this.isRefreshVisible) {
			
			if (this.$.mainWebService.waiting) {
				this.$.spinner.show();	
			} else {
				this.$.refresh.show();	
			}		
			
			this.$.lastUpdated.show();

			this.$.articleBorderShadow.applyStyle("width",  window.innerWidth + "px");						

		} else {
			this.$.refresh.hide();
			this.$.lastUpdated.hide();
			this.$.spinner.hide();
			
			setTimeout(function() {
		
				self.$.articleBorderShadow.applyStyle("width",  "100%");		
			
			}, 1000);
		}
		
	},

	openArticle: function(inSender, inEvent) {
		console.log('open article ', inSender, inEvent, inSender.getItem());
		if (inSender.hasOwnProperty("item")) {
			this.doShowArticle(inSender, inEvent)
		}		
	},
	
	openFontSizeSlider: function() {
		this.$.fontSlider.openAtControl(this.$.fontAdjust);	
	},
	
	openSharingMenu: function() {
		this.$.menu.openAtControl(this.$.share);
	},
	
	refreshAll: function() {
		var self = this,
			path = Config.feeds["articles"]
			;
	
		this.requestService(Config.feeds["topImage"], { url: Config.feeds["topImage"], data: "forehead"} );				

		Config.articleSections.forEach(function(item) {
			path = Config.feeds["articles"].replace("#id#", item);
			self.requestService(path, {url: path, data: item});
		});
	},
	
	requestService: function(path, item) {
		var serviceState = new ServiceState;
		
		enyo.mixin(serviceState, item);
	
		this.$.mainWebService.get(path, serviceState);
	},

	createForehead: function(inSender, inResponse) {

		var self = this,
			forehead = this.$.foreheadScroller,
			gallery = inResponse.gallery,
			button,
			resize = Config.resize.replace("#w#", "230").replace("#h#","174")
			;
		
		Config.forehead.forEach(function(item) {

			if (self.$[item.id + "button"]) {
				button = self.$[item.id + "button"];
			} else {
				button = forehead.createView({kind: "ForeheadButton", name: item.id + "button", owner: self, onclick: "foreheadClick"});	
			}
			
			button.setData(item);
			button.setLabel(item.label);
			
			if (gallery && gallery.hasOwnProperty(item.id)) {
				button.setImage(resize.replace("#p#", gallery[item.id]));
			} else if (item.hasOwnProperty("image")) {
				button.setImage(item.image);
			}			
			
		});			
	
		forehead.render();
	},
	
	createArticles: function(inSender, inResponse) {
	
	    if (inResponse.hasOwnProperty("stories")) {	

			var state = inSender.serviceState,
				articles = inResponse["stories"][0]["xml"][0]["article"],
				box = this.$[state.data + "Scroller"]
				;

			if (box) {			
				box.setState(state);
				box.setArticles(articles);			
			}
		}
	},

	serviceFail: function() { /*  Fail... Do What?  */ },	

	serviceStart: function() {
		this.$.refresh.hide();
		this.$.spinner.show();
	},
	
	serviceComplete: function() {
	
		this.$.refresh.show();
		this.$.spinner.hide();
	
		if (Config.hasConnection) {
			
			var d = new Date;
			
			var h = d.getHours();
			var min = d.getMinutes();
			var amPM = h < 12 ? "AM":"PM";
			
			if (h > 12) { h -= 12; }
			if (min < 10) { min = "0" + min; }		
		
			this.$.lastUpdated.setContent("Updated " + h + ":"+ min + " " + amPM);
			this.lastUpdatedDate = d;
			
		} else {
			
			this.$.lastUpdated.setContent("No connection");
			
		}
	},

	serviceSuccess: function(inSender, inResponse) {
		var state = inSender.serviceState;

		if (state.data === "forehead") {
			this.createForehead(inSender, inResponse);
		} else {
			this.createArticles(inSender, inResponse);
		}
		
		this.$.mainWebService.getNextIfExists();
	},		
	
	setArticle: function(item) {		
		this.$.articleViewer.setArticle(item);	
		this.$.articleViewer.scrollIntoView(0,0);
	},
	
	setWeather: function(weatherVO) {
		this.$.temperature.setContent(weatherVO.temperature + "&deg;");
		this.$.location.setContent(weatherVO.location);
	}
	
});