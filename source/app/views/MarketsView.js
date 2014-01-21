enyo.kind({
	
	name: "MarketsView",
	kind: enyo.VFlexBox,

	markets: [],
	stocks: [],
	selectedItem: null,

	create: function() {
		this.inherited(arguments);

		// setup db here...
	},

	wasInitialized: false,
	initialize: function() {
	
		if (!this.wasInitialized) {

			var savedList = enyo.getCookie("stocksList");

			if (typeof savedList !== 'undefined') {
				Config.tickers.users = enyo.json.parse(savedList);
			}

			this.requestTickers();
			this.wasInitialized = true;
		}
	
	},

	components: [
		{kind: "WebServiceQueue", name: "webService", 
	    	 	onStart: "serviceStart", onComplete: "serviceComplete", 
	    	 	onSuccess: "serviceSuccess", onFailure: "serviceFail"},

		{kind: "PageHeader", height: "60px", className: "appHeader gradient-money", components: [
	       {style: "background-image: url(images/modal-title-markets.png); background-repeat: no-repeat;", flex: 1, height: "25px"},
	       {kind: "Spinner", style: "text-align:right;"},
	       {kind: "IconButton", icon: "images/menu-icon-sync.png", className: "refreshButton", name: "refresh", onclick: "requestTickers"}
		]},

		{kind: enyo.VFlexBox, style: "margin:10px;", flex: 1, components: [


			{kind: enyo.HFlexBox, components: [
				{kind: "MarketsSearchList", name: "searchBox", style: "margin: 5px;", flex: 1, onSearch: "searchHandler"},	  
				{kind: "Button", caption: "Search", onclick: "clickSearch"}
			]},
			

			{kind: enyo.HFlexBox, flex: 1, style: "min-height: 145px", components: [

				{kind: enyo.VFlexBox, className: "tickerListBox", minHeight: "100px", flex: 1, components: [
					{content: "Markets", className: "tickerTitle"},
					{kind: "VirtualList", name: "marketsList", onSetupRow: "setupMarketsRow", flex: 1, components: [
			         {kind: "Item", layoutKind: "HFlexLayout", className: "tickerItem", onclick: "clickMarketsItem", components: [
			      		{name: "marketName", flex: 1},
							{name: "marketValue", flex: 1, className: "itemValue"}
   	   	  		]}
   				]}
				]},

				{kind: enyo.VFlexBox, className: "tickerListBox", flex: 1, components: [
					{content: "My Stocks", className: "tickerTitle"},
					{kind: "VirtualList", name: "stocksList", onSetupRow: "setupStocksRow", height: "150px", flex: 1, components: [
			         {kind: "SwipeableItem", layoutKind: "HFlexLayout", className: "tickerItem", onclick: "clickStocksItem", onConfirm: "confirmDelete", components: [
			      		{name: "stocksName", flex: 1},
							{name: "stocksValue", flex: 1, className: "itemValue"},
							{kind: "IconButton", name: "moveToTop", icon: "upArrow", iconIsClassName: true, className: "moveButton"}
   	   	  		]}
   				]},
					{content: "Swipe to delete", className: "tinyDescription"}
				]}
				
			]},

			{kind: enyo.HFlexBox, components: [

				{kind: enyo.VFlexBox, flex: 1, components: [
					{name: "companyName", className: "companyName"},			  
					{name: "tickerSymbol", className: "tickerSymbol"}	  
				]},
					  
				{kind: enyo.Button, name: "addButton", caption: "Add", showing: false, onclick: "addClick"}	
			]},

			{kind: enyo.HFlexBox, className: "tickerValuesBox", components: [

				{kind: enyo.VFlexBox, flex: 1, components: [
					  {content: "Latest", className: "tickerValueTitle"},						  
					  {name: "latest", className: "tickerValue"},
				]},
				
				{kind: enyo.VFlexBox, flex: 1, components: [
					  {content: "Change", className: "tickerValueTitle"},						  
					  {name: "change", className: "tickerValue"},
				]},

				{kind: enyo.VFlexBox, flex: 1, components: [
					  {content: "Change %", className: "tickerValueTitle"},						  
					  {name: "changePercent", className: "tickerValue"},
				]}

			]},

			{kind: enyo.RadioGroup, name: "tabBar", value: "1D", onChange: "chartTabSelected", components: [
				{caption: "1 Day", value: "1D"},	
	   		{caption: "5 Day", value: "5D"},		
				{caption: "1 Month", value: "1M"},
				{caption: "3 Months", value: "3M"},
				{caption: "1 Year", value: "1Y"},
				{caption: "5 Years", value: "5Y"}
			]},

			{kind: enyo.Image, name: "chart", height: "200px", src: "http://www.usatoday.idmanagedsolutions.com/charts/quote/ipad.chart?SYMBOL_US=I:DJI&WIDTH=530&HEIGHT=200&RESOLUTION=5M&TIME_SPAN=1D"}

		]},

		{kind: "Toolbar", components: [
			{kind: "GrabButton"}                               
		]}
		
	],

	moveItemToIndex: function(arr, fromIndex, toIndex) {
		var el = arr.splice(fromIndex, 1);	
		arr.splice(toIndex, 0, el[0]);
	},

	requestTickers: function() {

		var tickers =  Config.tickers.permament.join(",") + "," + Config.tickers.users.join(",");
		var url = Config.feeds.stocks.replace("#t#", tickers);

		this.$.webService.get(url, null);
	},

	save: function() {
		// i do love cookies...
		enyo.setCookie("stocksList", enyo.json.stringify(Config.tickers.users));
	},
	
	search: function(inValue) {
		this.$.webService.url = Config.feeds.stocks.replace("#t#", inValue);	
		this.$.webService.call();
	},

	setupMarketsRow: function(inSender, inIndex) {  
		return this.setupRow(inIndex, this.markets, this.$.marketName, this.$.item, this.$.marketValue);
	},

	setupStocksRow: function(inSender, inIndex) {

		this.$.moveToTop.setDisabled(inIndex === 0);
		this.$.moveToTop.setDown(inIndex === 0);

		return this.setupRow(inIndex, this.stocks, this.$.stocksName, this.$.swipeableItem, this.$.stocksValue);
	},

	setupRow: function(inIndex, arr, name, item, valueControl) {
	 
		if (inIndex < arr.length) {
		
			var row = arr[inIndex];

			if (row) {

				this.prettifyItem(row);
				
				valueControl.setContent(row._pctChange);

				if (row._diffIndicator == "+") { valueControl.setClassName("green itemValue"); }
				else if (row._diffIndicator == "-") { valueControl.setClassName("red itemValue"); }
				else {
					valueControl.setClassName("itemValue");
				}

				if (row === this.selectedItem || row.TickerSymbol === this.selectedItem.TickerSymbol) {
					item.applyStyle("background-color", "#f7f7f7");
					this.showItem(this.selectedItem);		
				} else {
					item.applyStyle("background-color", null);
				}

				switch (row.TickerSymbol) {
					case "I:DJI":
						name.setContent("DOW");
						break;

					case "INX":
					case "I:COMP":
						name.setContent(row.CompanyName);
						break;

					default:
						name.setContent(row.TickerSymbol);
						break;
				
				}
			
				return true;
			}
		}
	},		

	addCommasToNumber: function(value) {
		return value.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");	 
	},

	prettifyItem: function(item) {

		item._quote = item._quote || this.addCommasToNumber(parseFloat(item.Quote).toFixed(2));
		item._change = item._change || this.addCommasToNumber(parseFloat(item.NetChange).toFixed(2)); 
		item._pctChange = item._pctChange ||  parseFloat(item.PctChange).toFixed(2) + "%";

		item._diffIndicator = item.Quote < item.Open ? "-" : "+";

	},
	
	showItem: function(item) {

		this.$.companyName.setContent(item.CompanyName);
		this.$.tickerSymbol.setContent("(" + item.TickerSymbol + ")");	
		
		this.prettifyItem(item);

		this.$.latest.setContent( item._quote );
		this.$.change.setContent( item._diffIndicator + item._change );
		this.$.changePercent.setContent( item._pctChange );

		if (item._diffIndicator == "+") {
			this.$.change.setClassName("green tickerValue");
			this.$.changePercent.setClassName("green tickerValue");
		} else if (item._diffIndicator == "-") {
			this.$.change.setClassName("red tickerValue");
			this.$.changePercent.setClassName("red tickerValue");
		} else {
			this.$.change.setClassName("tickerValue");
			this.$.changePercent.setClassName("tickerValue");
		}


		this.chartTabSelected(this.$.tabBar);

		var tickers = Config.tickers;

		if (tickers.permament.indexOf(item.TickerSymbol) === -1 && tickers.users.indexOf(item.TickerSymbol) === -1) {
			this.$.addButton.show();
		}

	},	

	/* Events */

	addClick: function() {
		var item = this.selectedItem;

		if (Config.tickers.users.indexOf(item.TickerSymbol) === -1) {

			Config.tickers.users.push(item.TickerSymbol);

			this.stocks.push(this.selectedItem);
			this.$.stocksList.refresh();

			this.save();
		}

		this.$.addButton.hide();
	},

	clickMarketsItem: function(inSender, inEvent, inIndex) { 
		var item = this.markets[inIndex];

		if (item) {
			this.selectedItem = item;
			this.$.marketsList.refresh();
			this.$.stocksList.refresh();
		}

	},

	clickSearch: function() {
		this.search(this.$.searchBox.getValue());
	},

	clickStocksItem: function(inSender, inEvent, inIndex) { 

		var item = this.stocks[inIndex];

		if (item) {

			if (inEvent.target.id.indexOf("moveToTop") !== -1) {
			
				this.moveItemToIndex(this.stocks, inIndex, 0);
				this.moveItemToIndex(Config.tickers.users, inIndex, 0);
				this.$.stocksList.refresh();
				this.save();

			} else {
				this.selectedItem = item;
				this.$.marketsList.refresh();
				this.$.stocksList.refresh();
			}
		}
	},

	chartTabSelected: function(inSender) {

		var src = Config.feeds.charts.replace("#symbol#", this.selectedItem.TickerSymbol).replace("#time#", inSender.getValue());

		this.$.chart.setSrc(src);
	},

	confirmDelete: function(inSender, inIndex) {
		this.stocks.splice(inIndex, 1);
		Config.tickers.users.splice(inIndex, 1);

		this.$.stocksList.refresh();
		this.save();
	},

	searchHandler: function(inSender, inEvent, inValue) {
		this.search(inValue);
	},

	serviceComplete: function() {
		this.$.spinner.hide();
		this.$.refresh.show();
	},	

	serviceFail: function() {},	

	serviceStart: function() {
		this.$.spinner.show();
		this.$.refresh.hide();
	},

	serviceSuccess: function(inSender, inResponse, inRequest) {

		console.log('service success ', inRequest);

		if (inResponse.hasOwnProperty("stocks")) {
		
			var stocklist = inResponse.stocks[0]["stocklist"][0];

			if (stocklist.hasOwnProperty("item")) {
			
				var items = stocklist.item;
			
				if (Array.isArray(items) && items.length > 0) {

					if (this.selectedItem === null) {
						this.selectedItem = items[0];
					}

					if (items.length === 1) {
				
						this.selectedItem = items[0];	  
						this.showItem(this.selectedItem);

					} else {

						this.markets = [];
						this.stocks = [];	  

						for (var i = 0; i < items.length; i++) {
							if (i < 3) { this.markets.push(items[i]); }
							else {
								this.stocks.push( items[i] );
							}
						}
						
					}

					this.$.marketsList.refresh();
					this.$.stocksList.refresh();

				}
			}	
		}
	}

});
