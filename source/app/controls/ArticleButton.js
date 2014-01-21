enyo.kind({
	
	allowDrag: true,
	
	name: "ArticleButton",
	kind: enyo.CustomButton,
	className: "articleButton",

	layoutKind: "HFlexLayout",
	align: "center",

	published: {
		data: "",
		image: "",
		label: ""
	},

	components: [
	    {name: "videoIcon", className: "video", width: "80px", height: "105px", showing: false},         
	    {name: "image", kind: enyo.Image},
		{name: "label", className: "title", flex: 1, allowHtml: true}
	],
	
	labelChanged: function() {
		this.$.label.setContent(this.label);
	},
	
	imageChanged: function() {
		if (this.image && this.image != "") {
			this.$.image.setSrc(this.image);	
		} else {
			this.$.image.hide();
		}
	},
	
	showVideoIcon: function() {
		this.$.videoIcon.show();	
	}

});