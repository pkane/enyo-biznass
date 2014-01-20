enyo.kind({
	
	name: "QuickQuestionProgressBar",
	kind: enyo.VFlexBox,
	className: "qqProgressBar",

	published: {
		position: 0,
		text: ""	
	},

	components: [
		{name: "text", className: "text"},
		{kind: "ProgressBar", name: "progress",  minimum: 0, maximum: 100, position: 0}
	],
	
	positionChanged: function() {
		var self = this;
		
		setTimeout(function() {
		
			self.$.progress.setPosition(self.position);	
			self.$.text.setContent(self.text + " - " + self.position + "%")
		
		}, 250);
	},

	textChanged: function() {
		this.$.text.setContent(this.text);
	}

});