enyo.kind({
	
	name: "ForeheadButton",
	kind: "ArticleButton",
	className: "foreheadButton",
	
	width: "230px",
	height: "172px",

	components: [
		{kind: enyo.Image, name: "label", className: "title"},
		{kind: enyo.Image, name: "image"}
	],
	
	imageChanged: function() {
		this.$.image.setSrc(this.image);
	},

	labelChanged: function() {
		this.$.label.setSrc(this.label);
	}
	
});