enyo.kind({

  name: "Application",
  kind: "FittableRows",
  classes: "Application",

	create: function() {
		this.inherited(arguments);
		this.hideAllViews();
	},
	
	ready: function() {
		this.inherited(arguments);
		this.$.checkconnection.call({});
	},
	
	onConnectionStatus: function(inSender, inResponse){
		Config.hasConnection = inResponse.isInternetConnectionAvailable;		
	},

	components: [
		
		{name: "ApplicationEvents", onWindowActivated: "windowActivated"},	

		{name: "AppMenu", components: [
			{caption: "About", onclick: "showAbout"}		
		]},

		{name: "Pane", flex:1, components: [
			{name: "slidingPane", kind: "Panels", flex: 1, components: [
				
					{name: "left", flex: 1, kind:"FittableLayout", components: [
					
						{ name: "main", kind: "MainView", flex: 1,
					    	onShowPhotos: "showPhotos", 
					    	onShowScores: "showScores",
					    	onShowMarkets: "showMarkets",
					    	onShowSnapshots: "showSnapshots",
					    	onShowWeather: "showWeather",
					    	onShowArticle: "showArticle"
					    }
					
					]},					

					{name: "right", kind:"Panels", peekWidth: 100, width: "550px", onResize: "resize", dismissible: true, components: [
						{kind: "ArticleView", name: "articles", onShowImage: "showImage", flex: 1,lazy: true},
						{kind: "WeatherView", name: "weather", flex: 1, onChange: "weatherChanged" },
						// {kind: "ScoresView", name: "scores", flex: 1, lazy: true },
						// {kind: "MarketsView", name: "markets", flex: 1, lazy: true },
						// {kind: "SnapshotsView", name: "snapshots", flex: 1, lazy: true }
					]}
					                                                       
			]},
			
	// 		{ name: "about", kind: "AboutView", onClose: "showMain", lazy: true },
	// 		{ name: "photos", kind: "PhotoGalleryView", onClose: "showMain", lazy: true }
		]}
	],
	
	resize: function (inSender, inWidth) { 
		if (inWidth === null) {
			this.$.main.setIsRefreshVisible(true);
		} 
	},

	hideAllViews: function() {
		this.$.articles.hide();
		this.$.weather.hide();
		this.$.scores.hide();
		this.$.markets.hide();
		this.$.snapshots.hide();

		this.$.right.setPeekWidth(window.innerWidth - 550);		

		this.$.right.hide();
		this.$.main.setIsRefreshVisible(true);
	},
	
	showAbout: function() {
		this.showWindow("about", "enyo.transitions.Fade");
	},	

	showArticle: function(inSender, inButton, inEvent) {
	

		if (!this.$.articles.showing && !(this.$.right.isAtDragMax() && this.$.right.isAtDragMin())) {
			this.hideAllViews();	
		} else {
			this.$.weather.hide();
			this.$.scores.hide();
			this.$.snapshots.hide();
			this.$.markets.hide();
		}
		
		this.$.right.setPeekWidth(45);		
		this.$.right.show();
		this.$.articles.show();
		this.$.main.setIsRefreshVisible(false);

		if (inButton.hasOwnProperty("item")) {
			var item = inButton.item;
			
			this.$.articles.setArticle(item);	
			this.$.articles.scrollIntoView(0,0);	
			
			pageEvent(item['ssts'][0]['section'] + "_article_" + item['docId']);
		}	
		
	},
	
	showMain: function() {
		this.$.pane.setTransitionKind("enyo.transitions.Fade");
		this.$.pane.back();
	},
	
	showImage: function(inSender, inImage) {
		this.showWindow("photos");
		this.$.photos.setArticleImage(inImage);
	},	

	showPhotos: function(inSender, inButton, inEvent) {
		this.showWindow("photos");
		this.$.photos.requestGallery(inButton.data.id);
		
		pageEvent('photos_' + inButton.data.id);
	},

	showMarkets: function() {
		this.hideAllViews();

		this.$.right.show();
		this.$.markets.show();
		this.$.markets.initialize();
					 
		this.$.main.setIsRefreshVisible(false);
		
		pageEvent('markets');
	},

	showScores: function() {
		this.hideAllViews();
				
		this.$.right.show();
		this.$.scores.show();
		this.$.scores.initialize();	
		
		this.$.main.setIsRefreshVisible(false);
		
		pageEvent('scores');
	},
	
	showSnapshots: function() {
		this.hideAllViews();	
		this.$.right.show();	
		this.$.snapshots.initialize();	
		this.$.snapshots.show();
		this.$.main.setIsRefreshVisible(false);
		
		pageEvent('snapshots');
	},
	
	showWeather: function() {
		this.hideAllViews();
		
		this.$.right.show();
		this.$.weather.show();
		this.$.main.setIsRefreshVisible(false);
		
		pageEvent('weather');
	},

	showWindow: function(windowName, transitionType) {
		this.$.pane.setTransitionKind(transitionType || "enyo.transitions.LeftRightFlyin");
		this.$.pane.selectViewByName(windowName);
	},
	
	weatherChanged: function(inSender, weatherVO) {
		// TODO: Store weather location
		this.$.main.setWeather(weatherVO);	
	},
	
	windowActivated: function() {
		this.$.main.windowActivated();	
		this.$.weather.getWeather(enyo.getCookie("weatherLocation") || "22108"); /* Mclean, VA */
		this.$.scores.windowActivated();
	}

});