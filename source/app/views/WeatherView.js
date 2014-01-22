var WeatherView = {

	kind: enyo.VFlexBox,
	className: "weatherView",
	
	events: {
		onChange: "",
		onClose: ""
	},

	published: {
		currentConditionsURL: ""
	},

	components: [
	
		{kind: "WebService", handleAs:"xml", onSuccess: "serviceSuccess", onFailure: "serviceFail"},	

		{kind: "PageHeader", content: "USA TODAY", height: "60px", className: "appHeader gradient-weather", components: [
		    {kind: enyo.Image, src: "images/modal-title-weather.png"},                                   
			{kind: enyo.HFlexBox, flex: 1, pack: "end", align: "center", components: [
				{kind: "Spinner"},			                                                                          
				{kind: "WeatherSearchList", name: "searchInput", onSearch: "searchHandler"}			                                                                          
				/*{kind: "ToolSearchInput", name: "searchInput", changeOnInput: false, onchange: "searchHandler"/*onkeypress: "inputKeyPress"* /}*/
			]}
		]},	
		
		{kind: "Drawer", open: false, className: "drawer", components: [
          	{kind: "WebView", name: "webView", className: "webView", flex: 1, height: "450px"},
          	{kind: "Button", className: "closeDrawer", caption: "Close", onclick: "toggleDrawer"}
      	]},
		
		{kind: enyo.Scroller, flex: 1, components: [	

			{kind: enyo.VFlexBox, className: "weatherBox", components: [
			
				{content: "Current Location", className: "title"},		
	
				{kind: enyo.HFlexBox, components: [
				                                   
				    {name: "weatherIcon", kind: enyo.Image, width: "125px"},
				    
				    {kind: enyo.VFlexBox, className: "currentBox", components: [
						{name: "currentTemp", allowHtml: true, className: 'currentTemp'},	
						{name: "currentDescription"}
				    ]},
				    
				    {kind: enyo.VFlexBox, components: [
				         {name: "location", className: "location", style: "font-weight: bold; font-size: 120%;"},                              
				         {name: "info", allowHtml: true, className: "locationInfo"}
					]}
					
				]},
				
				{content: "5 Day Forecast", className: "title"},
				
				{kind: "HScroller", name: "fiveDayScroller", className: "fiveDayScroller", flex: 1, height: "80px"}
				
			]},
			
			{kind: "HScroller", name: "mapScroller", flex: 1, height: "460px", className: "mapScroller"}
		
		]},
		
		{kind: "Toolbar", components: [
			{kind: "GrabButton"},			                               	
			{kind: "CustomButton", onclick: "toggleCurrentConditions", layoutKind: "HFlexLayout", components: [
				{content: "more details at", style: 'font-weight: bold; color: #dfdede; font-size: 18px; margin: 3px 5px 3px;'},			                                    
				{kind: "Image", src: "images/accuweather.png"}                                    
			]}
		]}
		
	],
	
	iconLookup: { /* for Accuweather response */
		"01": "sunny.png",
        "02": "msunny.png",
        "03": "psunny.png",
        "04": "pcloudy.png",
        "05": "haze.png",
        "06": "mcloudy.png",
        "07": "cloudy.png",
        "08": "cloudy.png",
        "11": "fog.png",
        "12": "showers.png",
        "13": "showers.png",
        "14": "showers.png",
        "15": "tstorm.png",
        "16": "scatts.png",
        "17": "scatts.png",
        "18": "rain.png",
        "19": "flurries.png",
        "20": "scatsno.png",
        "21": "snowshow.png",
        "22": "snow.png",
        "23": "snow.png",
        "24": "ice.png",
        "25": "sleet.png",
        "26": "frzingrain.png",
        "29": "snowrain.png",
        "30": "hot.png",
        "31": "sunny.png",
        "32": "windy.png",
        "33": "clearnit.png",
        "34": "mcldnit.png",
        "35": "mcldnit.png",
        "36": "mcldnit.png",
        "37": "mcloudynite.png",
        "38": "mcloudynite.png",
        "39": "sctshownite.png",
        "40": "sctshownite.png",
        "41": "scttstormnite.png",
        "42": "scttstormnite.png",
        "43": "snshnite.png",
        "44": "snshnite"
	},
	
	statesLookup: {
		"Alabama":"AL",
		"Alaska":"AK",
		"Arizona":"AZ",
		"Arkansas":"AR",
		"California":"CA",
		"Colorado":"CO",
		"Connecticut":"CT",
		"Delaware":"DE",
		"District Of Columbia":"DC",
		"Florida":"FL",
		"Georgia":"GA",
		"Hawaii":"HI",  
		"Idaho":"ID",  
		"Illinois":"IL",  
		"Indiana":"IN",  
		"Iowa":"IA",  
		"Kansas":"KS",  
		"Kentucky":"KY",  
		"Louisiana":"LA",  
		"Maine":"ME",  
		"Maryland":"MD",  
		"Massachusetts":"MA",  
		"Michigan":"MI",  
		"Minnesota":"MN",  
		"Mississippi":"MS",  
		"Missouri":"MO",  
		"Montana":"MT",
		"Nebraska":"NE",
		"Nevada":"NV",
		"New Hampshire":"NH",
		"New Jersey":"NJ",
		"New Mexico":"NM",
		"New York":"NY",
		"North Carolina":"NC",
		"North Dakota":"ND",
		"Ohio":"OH",  
		"Oklahoma":"OK",  
		"Oregon":"OR",  
		"Pennsylvania":"PA",  
		"Rhode Island":"RI",  
		"South Carolina":"SC",  
		"South Dakota":"SD",
		"Tennessee":"TN",  
		"Texas":"TX",  
		"Utah":"UT",  
		"Vermont":"VT",  
		"Virginia":"VA",  
		"Washington":"WA",  
		"West Virginia":"WV",  
		"Wisconsin":"WI",  
		"Wyoming":"WY"
	},

	getWeather: function(location) {
		this.$.webService.url = Config.feeds["weather"] + location;
		this.$.webService.call();	
		this.$.spinner.show();
	},
	
	inputKeyPress: function(inSender, inKeyEvent) {
		if (inKeyEvent.hasOwnProperty("keyCode") && inKeyEvent.keyCode === 13) {
			this.getWeather(inSender.value);
			// TODO: Clear input?
		}		
	},
	
	getFirstNodeValue: function(nodeItem) {

		if (nodeItem && nodeItem[0] && nodeItem[0].childNodes.length > 0) {
			return nodeItem[0].childNodes[0].nodeValue;
		}
	
		return "";
	},

	parseResponse: function(doc) {

		var self = this,
			vo = new WeatherVO,
			imageLocation = "images/weather/"
			;
		
		// local
		var local = doc.getElementsByTagName("local")[0];		
		var city = local.getElementsByTagName("city");
		var state = this.getFirstNodeValue(local.getElementsByTagName("adminArea"));

		console.log('response ', this.$.searchInput, this.$.searchInput.getValue());			

		if (city[0].childNodes.length > 0) {		
		
			if (this.$.searchInput.getValue() !== '') {
			
				enyo.setCookie("weatherLocation", this.$.searchInput.value);	
				
				this.$.searchInput.setValue('');
				this.$.searchInput.render();
			}		
			
			if (this.statesLookup.hasOwnProperty(state)) {
				state = ", " + this.statesLookup[state];
			} else { state = ""; }

			vo.location = city[0].childNodes[0].nodeValue + state;		
	
			// current conditions
			var cc = doc.getElementsByTagName("currentconditions")[0];
			var ccTemp = cc.getElementsByTagName("temperature");
			var ccDesc = cc.getElementsByTagName("weathertext");
			var ccUrl = this.getFirstNodeValue(cc.getElementsByTagName("url"));
			
			this.setCurrentConditionsURL( ccUrl );
			
			var iconID = this.getFirstNodeValue(cc.getElementsByTagName("weathericon"));
			
			var icon = this.iconLookup[iconID];
			this.$.weatherIcon.setSrc(imageLocation + icon);
			
			vo.temperature = this.getFirstNodeValue(ccTemp);		
	
			// observations
			var observed = this.getFirstNodeValue(cc.getElementsByTagName("observationtime"));
			var feelsLike = this.getFirstNodeValue(cc.getElementsByTagName("realfeel"));
			var windDirection = this.getFirstNodeValue(cc.getElementsByTagName("winddirection"));
			var windSpeed = this.getFirstNodeValue(cc.getElementsByTagName("windspeed"));
			var precip = this.getFirstNodeValue(cc.getElementsByTagName("precip"));
			
			this.$.info.setContent([
				"Observed: " , observed , "<br />",
				"Feels Like: " , feelsLike , "<br />",
				"Wind: " , windDirection , " " , windSpeed , "mph<br />",
				"Precipitation: " , precip , "<br />"
			].join(""));	
			
			// 5 day
			var name, hiTemp, lowtemp;			

			self.$.fiveDayScroller.destroyViews();			

			enyo.forEach(doc.getElementsByTagName("day"), function(d) {
				
				iconID = self.getFirstNodeValue(d.getElementsByTagName("weathericon"));
				icon = self.iconLookup[iconID];
				name = self.getFirstNodeValue(d.getElementsByTagName("daycode"));
				
				hiTemp = self.getFirstNodeValue(d.getElementsByTagName("hightemperature"));
				lowtemp = self.getFirstNodeValue(d.getElementsByTagName("lowtemperature"));
			
				self.$.fiveDayScroller.createView({
					
					className: "fiveDayItem",
					components: [
						{content: name},
						{ kind: enyo.HFlexBox, components: [
						     {kind: "Image",
								src: imageLocation + icon,
								height: "45px"
							 },
							 {content: (hiTemp + "&deg;<br/>" + lowtemp + "&deg;"), allowHtml: true, className: "temps"}
						]}						
					]
				});	
				
			});			

			// maps
			this.$.mapScroller.destroyViews();
			
			var maps = doc.getElementsByTagName("Images")[0];		
			
			this.addMap("Regional radar", self.getFirstNodeValue(maps.getElementsByTagName("Radar")[0].getElementsByTagName("Image")));
			this.addMap("National radar", self.getFirstNodeValue(maps.getElementsByTagName("National_Radar")[0].getElementsByTagName("Image")));
			this.addMap("National satellite", self.getFirstNodeValue(maps.getElementsByTagName("National_Satellite")[0].getElementsByTagName("Image")));
			this.addMap("High temperatures", self.getFirstNodeValue(maps.getElementsByTagName("National_Max_Temperature")[0].getElementsByTagName("Image")));
			this.addMap("Low temperatures", self.getFirstNodeValue(maps.getElementsByTagName("National_Min_Temperature")[0].getElementsByTagName("Image")));
			this.addMap("National surface", self.getFirstNodeValue(maps.getElementsByTagName("National_Surface_Map")[0].getElementsByTagName("Image")));

			this.$.location.setContent(vo.location);		
			
			this.$.currentDescription.setContent(ccDesc[0].childNodes[0].nodeValue);
			this.$.currentTemp.setContent(vo.temperature + "&deg;");
		
			this.render();			

			return vo;
		}
		
		return null;
	},	

	addMap: function(name, source) {
		this.$.mapScroller.createView({
			className: "mapItem title", 
			components: [
				{content: name},
				{kind: "Image", src: source, height: "400px"}
			]
		});
	},	

	search: function(value) {
		enyo.log('search ', value);
		this.getWeather(value);
	},	

	searchHandler: function(inSender, inEvent, inValue) {
		console.log('search ', arguments);
		this.search(inValue);
	},	

	serviceFail: function() {
		this.$.spinner.hide();
	},

	serviceSuccess: function(inSender, inResponse) {
		this.$.spinner.hide();
		
		if (inResponse !== null) {	

			var vo = this.parseResponse(inResponse);
	
			if (vo !== null) {
				this.doChange(vo);	
			}		
			
		}
	},
	
	toggleCurrentConditions: function() {
		var url = this.getCurrentConditionsURL();

		if (url && url !== "") {		
			if (!this.$.drawer.open) {
				this.$.webView.setUrl(url);
			}	
	
			this.toggleDrawer();
		}
	},

	toggleDrawer: function() {
      this.$.drawer.toggleOpen();
	}

};