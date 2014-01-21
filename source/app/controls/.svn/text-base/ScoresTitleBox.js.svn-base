enyo.kind({

	name: "ScoresTitleBox",
	kind: enyo.HFlexBox,
	visible: false,
	className: "scoresTitleBox",
	
	align: "center",

	published: {
		title: ""
	},

	components: [
		{name: "title", className: "scoresTitle"},
		{flex: 1},
		{content: "all times ET", className: "allTimes"}
		
	],
	
	titleChanged: function() {
		var date = new Date(this.title);
		this.$.title.setContent(date.getDayofWeek() + ", " + date.getMonthOfYear() + " " + date.getDate());
	}

});