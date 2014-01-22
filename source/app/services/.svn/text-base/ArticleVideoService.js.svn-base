enyo.kind({
	
	name: "ArticleVideoService",
	kind: enyo.Component,
	
	events: {
		onLoad: ""
	},

	published: {
		video: "",
		rendition: "",
		title: ""
	},

	components: [
		{kind: "WebService", name: "webService", onSuccess: "serviceSuccess", onFailure: "serviceFail"},
	],
	
	servideFail: function() {},
	
	serviceSuccess: function(inSender, inResponse, inRequest) {
	
		var item;	

		if (this.getRendition() !== null) {
			
			item = this.getRendition();		

			this.doLoad(item, this.getTitle());				
		
		} else if (inResponse.hasOwnProperty('renditions')) {

			inResponse.renditions.forEach(function(r) {
				if (!item || parseInt(r.frameWidth, 10) > parseInt(item.frameWidth, 10)) { 
					item = r; 
				}
			});	
			
			this.doLoad(item, inResponse.name);			
	
			this.setRendition(item);
			this.setTitle(inResponse.name || "USA TODAY Video");
		}

		pageEvent('video_' + this.video.value);		
	},
	
	load: function() {
		if (this.$.webService.getUrl() !== '') {
			this.$.webService.call();
		}	
	},	

	videoChanged: function() {
		if (this.video.hasOwnProperty("paramname") && this.video.paramname === '@videoPlayer') {
			this.setRendition(null);
			this.$.webService.setUrl(Config.feeds.video.replace("#id#", this.video.value));				
		}	
	}

});