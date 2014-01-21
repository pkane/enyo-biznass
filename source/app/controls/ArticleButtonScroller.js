enyo.kind({
	
	name: "ArticleButtonScroller",
	kind: "HScroller",

	events: {
		onItemClick: ""
	},

	published: {
		articles: "",
		item: "",
		state: ""
	},

	articlesChanged: function() {
	
		var self = this,
			thumbnail, i = 0, button,
			thumbnailResizer = Config.resize.replace("#w#", "80").replace("#h#", "80")
			;	

		if (this.articles.length > 0) {
			
			this.destroyComponents();

			this.articles.forEach(function(item) {
	
				thumbnail = "";

				if (item.hasOwnProperty("images") && item.images[0] != null) {
					item.images[0]["image"].forEach(function(image) {					
						if (image.format === "large_4_3") {
						
							if (i == 0) {
								thumbnail = Config.resize.replace("#p#", image.source).replace("#w#", "196").replace("#h#", "147") // Config.resize + image.source + "&width=196&height=147";
							} else {
								thumbnail = thumbnailResizer.replace("#p#", image.source);	
							}
							
						}
					});
				}	
			
				button = self.createView({
					kind: (i == 0 ? "LedeArticleButton": "ArticleButton"), 
					item: item,
					className: self.state.data,
					onclick: "articleClick",
					owner: self
				});					
				
				button.setLabel(item.title);
				button.setImage(thumbnail);
				
				if (thumbnail !== '') {
					
					if (item.hasOwnProperty("videos") && item.videos.length > 0 && item.videos[0] !== null) {
		
						item.videos[0]["video"].forEach(function(video) {
							if (video.hasOwnProperty("paramname") && video.paramname === '@videoPlayer') {
								button.showVideoIcon();
							}			
						});
						
					}				

				}
				

				i++;
				
			});	
			
			this.render();
		}
	},
	
	articleClick: function(inSender, inEvent) { 
		this.setItem(inSender.item);
		this.doItemClick(inSender, inEvent);	
	},
	
	destroyComponents: function() {
		enyo.forEach(this.getComponents(), function(a) {
			if (a.kind === "ArticleButton" || a.kind === "LedeArticleButton") {
				a.destroyed || a.destroy();	
			}			
		});
	}

});