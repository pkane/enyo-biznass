var WeatherSearchList = {
	kind: enyo.VFlexBox,
	
	events: {
		onSearch: ""
	},

	published: {
		items: [],
		value: ""
	},

	components: [
	   {kind: "WebService", onSuccess: "serviceSuccess", onFailure: "serviceFail"},         
		{kind: "ToolSearchInput", name: "input", onchange: "changeHandler", changeOnInput: false, autoWordComplete: false, hint: "Search by Zip or City, State"}
		
		/*,{kind: "PopupList", name: "list", onSelect: "popupSelect"}      */
	],
	
	changeHandler: function(inSender, inEvent, inValue) {
		this.setValue(inValue);
		this.doSearch(inEvent, inValue);
	}



	/*
	kind: "FilteredSearchList"
	*/
};