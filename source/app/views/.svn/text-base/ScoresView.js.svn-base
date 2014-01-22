enyo.kind({

	name: "ScoresView",
	kind: enyo.VFlexBox,
	className: "scoresView",

	published: {
		data: {},
		selectedItem: ""
	},

	components: [
	     {kind: "WebServiceQueue", name: "webService", 
	    	 	onStart: "serviceStart", onComplete: "serviceComplete", 
	    	 	onSuccess: "serviceSuccess", onFailure: "serviceFail"},
	    
		{kind: "PageHeader", height: "60px", className: "appHeader gradient-sports", components: [
	       {style: "background-image: url(images/modal-title-scores.png); background-repeat: no-repeat;", flex: 1, height: "20px"},
	       {kind: "Spinner", style: "text-align:right;"},
	       {kind: "IconButton", icon: "images/menu-icon-sync.png", className: "refreshButton", name: "refresh", onclick: "refresh"}
		]},

		{kind: "RadioGroup", name: "tabBar", className: "tabBar", onChange: "radioButtonSelected"},
		
		{kind: "Scroller", flex: 1, components: [
			{kind: enyo.VFlexBox, name: "innerScroll", flex: 1}		
		]},
		
		{kind: "Toolbar", components: [
			{kind: "GrabButton"}                               
		]}
	],

	create: function() {
		this.inherited(arguments);
	
		var self = this;		

		Config.leagues.forEach(function(item) {
			self.$.tabBar.createComponent({kind: "RadioButton", caption: item.toUpperCase(), value: item, style: "font-size: 17px;", width: "none"});
		});
		
		this.$.tabBar.render();
	},
	
	refresh: function() {
		this.$.innerScroll.destroyComponents();	
		this.$.refresh.hide();
		this.requestLeague(this.$.tabBar.getValue());
	},	
	
	buildGrids: function(inResponse) {
	
		var self = this,
			league, 
			grid, titleBox, matchBox, i = 0
			;
		
		if (inResponse && inResponse.hasOwnProperty("schedules")) {
			
			league = inResponse["schedules"][0]["league"][0];
			
			if (league.hasOwnProperty("date") && league.hasOwnProperty("league_in_season") && league["league_in_season"] === "yes") {
			
				grid = self.$.innerScroll.createComponent({ kind: enyo.Grid, cellClass: "matchCell" });			

				league["date"].forEach(function(eventDate) {
						
					titleBox = grid.createComponent({
						kind: "ScoresTitleBox"
					});
					
					titleBox.setTitle(eventDate.start_date);

					if (eventDate.hasOwnProperty("event")) {

						i = 0;						

						eventDate["event"].forEach(function(match) {

							matchBox = grid.createComponent({
								kind: "ScoreMatchBox",
								height: "130px",
								width: "265px",
								style: (i % 2 == 0 ? "border-right: 1px solid #cdcdcd;" : "")
							});
							
							matchBox.setMatch(match);
							i++;
						});
						
						if (i % 2 !== 0) {   
							grid.createComponent({
								kind: "ScoreMatchBox",
								height: "130px",
								width: "265px"
							});
						}
						
					}			

				});							

			} else {
				self.$.innerScroll.createComponent({content: "No Scores Available", style: "font-weight: bold; margin: 10px;"});
			}
			
			self.$.scroller.scrollIntoView(0, 0);
			self.$.innerScroll.render();
		}		
	
	},	

	wasInitialized: false,
	lastInitializedDate: null,
	initialize: function() {
		if (!this.wasInitialized) {
			this.selectedItem = Config.leagues[0];
		
			this.requestLeague(this.selectedItem);	
			this.$.tabBar.setValue(this.selectedItem);
			
			this.wasInitialized = true;
			this.lastInitializedDate = new Date;
		}
	},
	
	radioButtonSelected: function(inSender) {
	
		this.$.innerScroll.destroyComponents();	

		if (this.data.hasOwnProperty(inSender.getValue())) {
			
		} else {
			this.requestLeague(inSender.getValue());
		}
		
	},	

	requestLeague: function(league) {
		var url = Config.feeds["scores"].replace("#league#", league);
		
		this.$.webService.cutInLine(url, enyo.mixin(new ServiceState, {url: url, data: league}));
	},	

	serviceComplete: function() {
		this.$.spinner.hide();
		this.$.refresh.show();
	},	

	serviceFail: function() {},	

	serviceStart: function() {
		this.$.spinner.show();
		this.$.refresh.hide();
	},
	
	serviceSuccess: function(inSender, inResponse) {
		
		if (inSender.serviceState.data === this.$.tabBar.getValue()) {
			this.buildGrids(inResponse);	
		} else {
			this.data[inSender.serviceState.data] = inResponse;
		}
		
	},
	
	windowActivated: function() {
	
		var self = this;	

		if (this.wasInitialized && this.lastInitializedDate && ((new Date()).getTime() - this.lastInitializedDate.getTime()) > Config.refreshScoresTime) {

			this.wasInitialized = false;	
			
			Config.leagues.forEach(function(item) {
				self.data[item] = null;
				delete self.data[item];
			});
		}

	}
		
});
