var Config = {

	hasConnection: true,

	articleSections: ["home", "money", "sports", "life", "tech", "travel"],
	leagues: ["mlb", "nfl", "nba", "nhl", "ncaaf", "ncaab", "mls"],

	emailSupport: "usatcmusatodaymobile@usatoday.com",

	refreshArticlesTime: (1000 * 60 * 5),
	refreshScoresTime: (1000 * 60 * 2),

	forehead: [
				{id: 165, type: "gallery", label: "images/overlay_DayInPictures.png"}, 
				{id: 164, type: "gallery", label:"images/overlay_DayInSports.png"},
				{id: 56, type: "gallery", label: "images/overlay_DayInCelebrities.png"},
				{id: 333, type: "gallery", label:"images/overlay_WeekInSpace.png"},
				{id: 393, type: "gallery", label:"images/overlay_WeekInTravel.png"},
				{id: "snapshots", type: "snapshots", label: "images/overlay_Snapshots.png", image: "images/snapshots.png"}
			  ],
	
	tickers: {
		permament: ["I:DJI", "INX", "I:COMP"],
		users: ["GCI", "HPQ"]
	},

	resize: "http://i.usatoday.net/webapps/optimus/resizeimage.ashx?path=#p#&width=#w#&height=#h#",
	
	share: {
		facebook: "http://m.facebook.com/sharer.php?u=#url#", 
		twitter: "http://www.twitter.com?status=#url#"
	},

	/* localhost * /
	feeds: { 
		"articles": "http://localhost:8000/proxy?u=http://api.usatoday.com/articles/light/topnews/#id#tablet?encoding=json&count=15&api_key=xnpbjw6v33sj2tqtf7fcxp5g&topphoto-y",
		"photos": "http://localhost:8000/proxy?u=http://api.usatoday.com/photos/galleries/#id#?api_key=j24vgzj9fp4nqc5c7ax3qm7v&count=1&html=false",
		"quickQuestion": "http://localhost:8000/proxy?u=http://content.usatoday.net/dist/custom/handlers/iphone/SnapshotData.ashx?o=json&answerid=#answer#",
		"scores": "http://localhost:8000/proxy?u=http://api.usatoday.com/scores/#league#/2day?o=json&format=light&api_key=2xg8ff6qursr58vvbad2ddze",
		"snapshots": "http://localhost:8000/proxy?u=http://api.usatoday.com/snapshots?top=1&section=#section#&o=json&api_key=3xk92fsq5t6rkbm3t8t5jb5u",
		"weather": "http://localhost:8000/proxy?u=http://usatoday.accu-weather.com/widget/usatoday/weather-data.asp?location=",
		"topImage": "http://localhost:8000/proxy?u=http://i.usatoday.net/apps/topimage/handler.ashx?source=gallery&gid=350,393,333,56,164,165",
		"video": "http://localhost:8000/proxy?u=http://api.brightcove.com/services/library?command=find_video_by_id&media_delivery=http&video_fields=id,name,renditions&token=q5_Y4xoa5cyPszGwuztctcIelcmgwIFXqWKmIhNV1ar4U2lNQdGfmQ..&video_id=#id#",
		"stocks": "http://localhost:8000/proxy?u=http://content.usatoday.net/feed/marketdata/encode/json?type=stock&sym=#t#",
		"charts": "http://www.usatoday.idmanagedsolutions.com/charts/quote/ipad.chart?SYMBOL_US=#symbol#&WIDTH=530&HEIGHT=200&RESOLUTION=5M&TIME_SPAN=#time#",

		"tickersLookup": "http://localhost:8000/proxy?u=http://i.usatoday.net/feed/GetTickers?name_startsWith=#name#&callback=none",
		"lookupLocation": "http://localhost:8000/proxy?u=http://i.usatoday.net/feed/GetCities?name_startsWith=#name#&callback=none"
	},
	
	// */
	
	/* production */
	feeds: {
		"articles": "http://api.usatoday.com/articles/light/topnews/#id#tablet?encoding=json&count=15&api_key=xnpbjw6v33sj2tqtf7fcxp5g",
		"photos": "http://api.usatoday.com/photos/galleries/#id#?api_key=j24vgzj9fp4nqc5c7ax3qm7v&count=1&html=false",
		"quickQuestion": "http://content.usatoday.net/dist/custom/handlers/iphone/SnapshotData.ashx?o=json&answerid=#answer#",
		"snapshots": "http://api.usatoday.com/snapshots?top=1&section=#section#&o=json&api_key=3xk92fsq5t6rkbm3t8t5jb5u",
		"scores": "http://api.usatoday.com/scores/#league#/2day?o=json&format=light&api_key=2xg8ff6qursr58vvbad2ddze",
		"weather": "http://usatoday.accu-weather.com/widget/usatoday/weather-data.asp?location=",
		"topImage": "http://content.usatoday.net/apps/topimage/handler.ashx",
		"video": "http://api.brightcove.com/services/library?command=find_video_by_id&media_delivery=http&video_fields=id,name,renditions&token=q5_Y4xoa5cyPszGwuztctcIelcmgwIFXqWKmIhNV1ar4U2lNQdGfmQ..&video_id=#id#",
		"stocks": "http://content.usatoday.net/feed/marketdata/encode/json?type=stock&sym=#t#",
		"charts": "http://www.usatoday.idmanagedsolutions.com/charts/quote/ipad.chart?SYMBOL_US=#symbol#&WIDTH=530&HEIGHT=200&RESOLUTION=5M&TIME_SPAN=#time#",
		"tickersLookup": "http://i.usatoday.net/feed/GetTickers?name_startsWith=#name#&callback=none",
		"lookupLocation": "http://i.usatoday.net/feed/GetCities?name_startsWith=#name#&callback=none"
	}, 

	// */
};



