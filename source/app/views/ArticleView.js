enyo.kind({
	
	name: "ArticleView",
	kind: enyo.VFlexBox,
	
	className: "articleView",

	article: null,
	events: {
		onShowImage: ""
	},

	components: [
		/*	    
		{kind: "PopupSlider", name: "fontSlider", lazy: true},
		*/
		
		{ kind: "PalmService", service: "palm://com.palm.applicationManager/", components: [
			{name: "launchApp", method: "launch"},
			{name: "openApp", method: "open"}
		]},		

		{kind: "Menu", lazy: true, components: [
			{caption: "Facebook", onclick: "share", value: "facebook"},
			{caption: "Twitter", onclick: "share", value: "twitter"},
			{caption: "Email", onclick: "share", value: "email"}
		]},

		{kind: "PopupWebView", name: "webPopup", lazy: true},
		
		{name: "videoService", kind: "ArticleVideoService", onLoad: "onVideoLoaded"},		    
	             
	    {kind: enyo.HFlexBox, className: "articleHeader", components: [
			{kind: "Image", src: "images/article-logo.png"},
			{flex: 1}
			/*,
			{kind: "IconButton", icon: "images/button_share.png", name: "shareButton", onclick: "openShareMenu", style: "-webkit-border-image: none; margin-right: 15px;"}
			*/			
		]},

		{kind: enyo.Scroller, flex: 1, className: "articleBodyScroller", components: [		

		    {name: "articleTitle", content: "", className: "articleTitle", allowHtml: true},

		    {kind: enyo.CustomButton, name: "imageButton", className: "articleImageButton", allowDrag: true, onclick: "imageClick", components: [
		                                                                                                                                        
				{kind:enyo.HFlexBox, className: "imageWrapper", width: "302px", height: "227px", components: [
					{name: "videoIcon", className: "video", width: "302px", height: "227px", showing: false},
					{name: "articleImage", kind: "Image", onload: "onImageLoaded"}                        
				]},		    
				
				{name: "credit", style: "font-size: 65%;", allowHtml: true},
				{name: "caption", allowHtml: true}
			]},
		    
			{name: "articleBody", content: "", allowHtml: true},
		
		]},
		
		{kind: "Toolbar", components: [
			{kind: "GrabButton"}
		]}
	],
	
	getArticle: function() { return this.article; },
	setArticle: function(item) {
	
		var imageContent = "",
			self = this,
			byline = item["byline"] || ""
			;	

		this.article = item;

		if (item.hasOwnProperty("images") && item.images[0] != null) {
			item.images[0]["image"].forEach(function(image) {					
				if (image.format === "large_4_3") {
					
					var src = Config.resize.replace("#p#", image.source).replace("#w#", "300").replace("#h#", "225");				

					if (self.$.articleImage.getSrc() !== src) {					
						self.$.articleImage.hide();
						self.$.articleImage.setSrc(src);
	
						self.$.credit.setContent(image.credit || "");
						self.$.caption.setContent(image.caption || "");
						self.$.imageButton.show();
					}
				}
			});
		} else {
			this.$.imageButton.hide();
		}	
		
		if (item.hasOwnProperty("videos") && item.videos.length > 0 && item.videos[0] !== null) {
		
			var hasVideo = false;		

			item.videos[0]["video"].forEach(function(video) {
				if (video.hasOwnProperty("paramname") && video.paramname === '@videoPlayer') {
					hasVideo = true;
					self.$.videoService.setVideo(video);
				}			
			});
			
			hasVideo ? this.$.videoIcon.show() : this.$.videoIcon.hide();
			
		} else {
			this.$.videoIcon.hide();
		}

		this.$.articleTitle.setContent(item.title || "");
		this.$.articleBody.setContent("<p>" + imageContent + "<p>" + byline + "</p>" + item.body[0]["p"].join("</p><p>") + "</p>");
	},
	
	imageClick: function() {
	
		var self = this;	
		
		if (this.$.videoIcon.showing) {
			
			this.$.videoService.load();		
			
		} else {
	
			if (this.article.hasOwnProperty("images") && this.article.images[0] != null) {
				this.article.images[0]["image"].forEach(function(image) {					
					if (image.format === "large_4_3") {
						self.doShowImage(image);
					}
				});
			}
		}

	},
	
	onImageLoaded: function() {
		this.$.articleImage.show();
	},	
	
	onVideoLoaded: function(inSender, inRendition, inTitle) {
		this.$.launchApp.call(
			{id: "com.palm.app.videoplayer", params: {
				target: inRendition.url,
				videoTitle: (inTitle || "USA TODAY Video")
			}}
		);
	},
	
	scrollIntoView: function(x, y) {
		this.$.scroller.scrollIntoView(x, y);	
	},
	
	openShareMenu: function() {
		this.$.menu.openAt({top: "40", right: "20"});
	},
	
	share: function(inSender, inEvent) {

		var message;	

		if (inSender.value === 'facebook' || inSender.value === 'twitter') {
			
			if (inSender.value === 'facebook') {
				message = Config.share[inSender.value].replace("#url#", this.article.shortUrl);			
			} else if (inSender.value === 'twitter') {
				message = Config.share[inSender.value].replace("#url#", this.article.title.replace(/\s/gm, "+") + "+:+" + this.article.shortUrl);			
			}

			this.$.webPopup.openAt({top: "40", right: "20"});
			this.$.webPopup.setUrl(message);

		} else if (inSender.value === 'email') {
		
			this.$.openApp.call(
				{id: "com.palm.app.email", params: {
					summary: this.article.title + " - USA TODAY",
					text: (this.article.abstract + "<br /><br />" + this.article.shortUrl)
				}}
			);		  
		
		}
		
		/*
		 Email
		 https://developer.palm.com/content/api/reference/services/email.html
		*/
	}

});
