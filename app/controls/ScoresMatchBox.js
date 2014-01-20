enyo.kind({

	name: "ScoreMatchBox",
	kind: enyo.VFlexBox,
	className: "scoreMatchBox",
	
	published: {
		match: ""	
	},

	components: [
	
	   {name: "status", className: "matchStatus"},
	   
	   {kind: enyo.HFlexBox, align: "center", components: [
		 	{name: "awayImage", kind: "Image", src:""},
            {name: "awayName", className: "name"},
            {flex: 1},
            {name: "awayScore", className: "matchScore"}
		]},
		{kind: enyo.HFlexBox, align: "center", components: [
           {name: "homeImage", kind: "Image", src:""},
           {name: "homeName", className: "name"},
           {flex: 1},           
           {name: "homeScore", className: "matchScore"}
		]}
		
	],
	
	matchChanged: function() {
		
		if (this.match !== "") {		

			var awayTeam = this.match["awayTeam"][0],
				homeTeam = this.match["homeTeam"][0]
				;                     
	
			this.$.status.setContent(this.match["game_status"] || "");
	
			this.$.awayImage.setSrc(awayTeam["logo"].replace("22", "36"));
			this.$.awayName.setContent(awayTeam["first_name"]);
			this.$.awayScore.setContent(awayTeam["score"]);
			
			this.$.homeImage.setSrc(homeTeam["logo"].replace("22", "36"));
			this.$.homeName.setContent(homeTeam["first_name"]);
			this.$.homeScore.setContent(homeTeam["score"]);		
		}
	}
});