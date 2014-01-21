enyo.kind({
	
	name: "MarketsSearchList",
	kind: "FilteredSearchList",

	create: function() {
		this.inherited(arguments);
		this.setSearchUrl(Config.feeds.tickersLookup);
	},

	serviceSuccess: function(inSender, inResponse, inRequest) {
	
		if (inResponse.hasOwnProperty("tickers") && Array.isArray(inResponse.tickers)) {
		
			console.log('-- success');

			var tickers = inResponse.tickers;
			var items = [];

			tickers.forEach(function(t) {
				items.push({caption: t.company, value: t.ticker}); 
			});				
		
			this.setItems(items);
		}

		this.inherited(arguments);
	}

});
