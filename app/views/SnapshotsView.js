enyo.kind({
	
	name: "SnapshotsView",
	kind: enyo.VFlexBox,
	className: "snapshotsView",
	
	data: {},

	wasInitialized: false,
	initialize: function() {
	
		if (!this.wasInitialized) {
			
			this.$.tabBar.setValue("news");	
			this.requestSection("news");

			this.wasInitialized = true;
		}	
	},

	components: [
		{kind: "WebServiceQueue", name: "webService", 
	    	 	onStart: "serviceStart", onComplete: "serviceComplete", 
	    	 	onSuccess: "serviceSuccess", onFailure: "serviceFail"},
	    
		{kind: "PageHeader", height: "60px", className: "appHeader gradient-snapshots", components: [
	       {style: "background-image: url(images/modal-title-snapshots.png); background-repeat: no-repeat;", flex: 1, height: "25px"},
	       {kind: "Spinner", style: "text-align:right;"}
		]},
		
		{kind: "RadioGroup", name: "tabBar", className: "tabBar", onChange: "radioButtonSelected", components: [
			{ caption: "News", value: "news" },
			{ caption: "Money", value: "money" },
			{ caption: "Sports", value: "sports" },
			{ caption: "Life", value: "life" }
		]},

		{kind: "Drawer", open: false, onOpenAnimationComplete: "drawOpenComplete", components: [
			{kind: "QuickQuestion", name: "quickQuestion", flex: 1, onSelect: "answerSelected"},
		]},		

		{kind: "Scroller", flex: 1, components: [
			{kind: enyo.VFlexBox, className: "snapshotsBox", width: "515px", components: [
				{name: "snapshotTitle", className: "qqText"},
				{kind: "Image", name: "snapshotImage", className: "snapshot", width: "335px"},
				{name: "qqPreview", className: "qqText"},
				{kind: "Button", name: "voteButton", caption: "Vote Now", onclick: "toggleQuickQuestion", className: "qqButton"}
			]}
	    ]},		
	
		{kind: "Toolbar", components: [
			{kind: "GrabButton"}                               
		]}
		
	],
	
	answerSelected: function(inSender, inValue) {
		var url = Config.feeds["quickQuestion"].replace("#answer#", inValue.answer);	
		
		this.$.webService.cutInLine(url, enyo.mixin(new ServiceState, {url: url, data: inValue}));
	},

	drawOpenComplete: function(inSender) {
	
		if (!inSender.open) {
			this.$.snapshotImage.show();
			this.$.qqPreview.show();
		} 	

		this.$.voteButton.show();		

	},	

	drawOpenChanged: function(inSender) {
		var self = this;
	
		if (this.$.snapshotImage) {
			if (inSender.open) {
				this.$.snapshotImage.hide();
				this.$.qqPreview.hide();
				this.$.voteButton.setCaption("Back");
				
			} else {
				this.$.snapshotImage.show();
				this.$.voteButton.setCaption("Vote Now");
				
				this.$.qqPreview.show();
			}
		}
	},

	radioButtonSelected: function(inSender) {
		this.requestSection(inSender.getValue());
	},

	requestSection: function(section) {
		if (this.data[section]) {
			this.update(this.data[section]);
		} else {
			var url = Config.feeds["snapshots"].replace("#section#", section);
			
			this.$.webService.cutInLine(url, enyo.mixin(new ServiceState, {url: url, data: section}));
		}
	},	

	serviceComplete: function() {
		this.$.spinner.hide();
	},	

	serviceFail: function() {},	

	serviceStart: function() {
		this.$.spinner.show();
	},
	
	serviceSuccess: function(inSender, inResponse) {
		console.log('snapshots success ', inSender, inResponse);		
		
		var self = this;		

		if (inResponse.hasOwnProperty("Snapshot")) {		
			
			if (inSender.serviceState.data === this.$.tabBar.getValue()) {
				this.update(inResponse);		
			} 
			
			this.data[inSender.serviceState.data] = inResponse;
			
		} else if (inResponse.hasOwnProperty("question") && inResponse.question.length > 0) {
			
			for (var i in this.data) {
				
				if (this.data[i] && this.data[i].hasOwnProperty("Snapshot")) {
				
					this.data[i]["Snapshot"].forEach(function(a) {
						
						if (a.SnapshotId === inSender.serviceState.data.question) {
							
							a.response = inResponse;
							
							if (self.$.quickQuestion.getQuestion().SnapshotId === a.SnapshotId) {
								self.$.quickQuestion.setQuestion(a);							
							}
						}

					});				

				}
				
			}		

		}
	},
	
	toggleQuickQuestion: function() {
	
		var self = this;	

		if (!this.$.drawer.open) {
			this.$.snapshotImage.hide();
			this.$.qqPreview.hide();
			this.$.voteButton.setCaption("Back");
		} else {
			this.$.voteButton.setCaption("Vote Now");
		}

		this.$.voteButton.hide();		

		setTimeout(function() {
			self.$.drawer.toggleOpen();
		}, 100);		
		
	},		

	update: function(value) {
	
		var item;
	
		if (value.hasOwnProperty("Snapshot") && value.Snapshot.length > 0) {
	
			item = value.Snapshot[0];
			
			if (typeof item.WidgetSnapshotImage === 'string') {			

				this.$.snapshotTitle.setContent(item.Headline);
				console.log(Config.resize.replace("#p#", item.SnapshotImageHiRes).replace("#w#", "335").replace("#h#", "335"));
				this.$.snapshotImage.setSrc(Config.resize.replace("#p#", item.SnapshotImageHiRes).replace("#w#", "335").replace("#h#", "335"));
				this.$.qqPreview.setContent(item.QuickQuestion);
				
				this.$.quickQuestion.setQuestion(item);
				this.$.drawer.setOpen(false);
				this.$.voteButton.setCaption("Vote Now");
			}
			
		}
	}

});
