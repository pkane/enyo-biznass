enyo.kind({

	name: "PhotoGalleryView",
	kind: enyo.VFlexBox,
	
	className: "photoGalleryView",
	data: {},
	
	events: {
		onClose: ""
	},
	
	published: {
		articleImage: "",
		gallery: "",
		galleryId: ""
	},	

	components: [
	             
	    {kind: "WebServiceQueue", name: "webService", onSuccess: "serviceSuccess", onFailure: "serviceFail"},
	    
	    {name: "footer", className: "galleryFooter", layoutKind: "HFlexLayout",  components: [
			{ kind: "Button", caption: "Close", width: "50px", height: "25px", onclick: "doClose", className: "blackButton" },		                                                                          	
	    	{ name: "caption", allowHtml: true, flex: 1, className: "galleryCaption"},
	    	{ name: "count", className: "count"}
		]},
		
		{kind: "ImageView", flex: 1, onGetLeft: "getLeft", onGetRight: "getRight", onclick: "toggleChrome"}
	],
	
	articleImageChanged: function() {
		var self = this;		

		if (this.articleImage && this.articleImage.hasOwnProperty('source')) {
			
			self.$.caption.setContent("");
			self.$.imageView.hide();		
			
			setTimeout(function(){
				
				self.$.imageView.images = [self.articleImage.source];
				self.$.imageView.setCenterSrc(self.articleImage.source);
				self.$.caption.setContent(self.articleImage.caption + "<br /><b>" + self.articleImage.credit + "</b>");

				self.render();
				self.$.imageView.show();	
				
			}, 1000);
		}
	},

	getPhoto: function(index, inSnap) {
		if (this.data.hasOwnProperty(this.currentGallery)) {
	
			var item = this.data[this.currentGallery][this.index];
		
			if (item) {
				this.$.caption.setContent(item.Caption + "<br /><b>" + item.Credit + "</b>");
				this.$.count.setContent((this.index + 1) + " of " + this.$.imageView.images.length);
				
				inSnap && pageEvent('photos_' + this.getGalleryId() + "_" + item.Id);			
			}

			return this.$.imageView.images[index];
		}
	},

	getLeft: function(inSender, inSnap) {
		inSnap && this.index--;
		return this.getPhoto(this.index - 1, inSnap);
	},
	
	getRight: function(inSender, inSnap) {
		inSnap && this.index++;
		return this.getPhoto(this.index + 1, inSnap);
	},
	
	requestGallery: function(id) {
		this.setGalleryId(id);

		var url = Config.feeds["photos"].replace("#id#", id);
		
		this.$.imageView.hide();
		this.$.webService.get(url, enyo.mixin(new ServiceState, {url: url, data: id}));
	},	

	serviceFail: function() {},

	serviceSuccess: function(inSender, inResponse) {

		if (inResponse.hasOwnProperty("MediaPresentation")) {	

			var state = inSender.serviceState;		
			var collections = inResponse["MediaPresentation"]["MediaCollections"],
				image,
				self = this
				;
			
			if (collections.length > 0) {
	 
				this.index = 0;		
	
				this.currentGallery = state.data;
				this.data[state.data] = collections[0]["MediaItems"];
				this.$.imageView.images = [];
	
				collections[0]["MediaItems"].forEach(function(mediaItem) {
					if (mediaItem.hasOwnProperty("MediaPaths")) {
					
						mediaItem.MediaPaths.forEach(function(mediaPath) {
						
							if (mediaPath.Name === "ExtraLarge") {
								self.$.imageView.images.push(mediaPath.Value);
							}
						});
					}
				});
				
				if (this.$.imageView.images.length > 0) {
					this.$.imageView.setCenterSrc( this.getPhoto(0) ); // this.$.imageView.images[this.index]);
				}
			}
			
			setTimeout(function(){
				self.render();
				self.$.imageView.show();
			}, 500);
		}
	},
	
	toggleChrome: function() { 
		this.$.footer.showing ? this.$.footer.hide() : this.$.footer.show();
	}
});