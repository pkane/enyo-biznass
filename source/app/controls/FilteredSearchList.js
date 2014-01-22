var FilteredSearchList = {
	kind: enyo.VFlexBox,
	
	filteredItems: [],

	events: {
		onSearch: ""
	},

	published: {
		data: "",
		items: [],
		value: "",
		searchUrl: "",
		searchTerm: ""
	},

	components: [
	   {kind: "WebService", onSuccess: "serviceSuccess", onFailure: "serviceFail"},         
		{kind: "ToolSearchInput", name: "input", onchange: "changeHandler", changeOnInput: true, autoWordComplete: false},

		{kind: "Popup", components: [
			{kind: "VirtualList", name: "list", onSetupRow: "setupRow", height: "300px", components: [
				{kind: "Item", onclick: "itemClick", layoutKind: "HFlexLayout", components: [
            	{name: "caption", flex: 1, className: "filteredItemCaption"},
   		   ]}
			]}
		]}
			
	],
	
	changeHandler: function(inSender, inEvent, inValue) {
		// console.log('change ', inValue);

		var len = inValue.length;

		if (len >= 3) {
		

			console.log(value, this.searchTerm);

			if ((len === 3 || len === 4)) {

				var value = inValue.substring(0, len);

				if (this.searchTerm !== value) {
					console.log('-- search ' + value);
			
					this.setSearchTerm(value);

					this.$.webService.url = this.searchUrl.replace("#name#", this.searchTerm);	
					this.$.webService.call();
				} else {
				
					this.$.popup.openAtControl(this.$.input, {top:30});
					this.$.list.refresh();

				}

			} else {
			
				this.$.popup.openAtControl(this.$.input, {top:30});
				this.$.list.refresh();

			}
				  
		
		} else {
		
			this.$.popup.close();

		}


		this.setValue(inValue);
	},



	itemsChanged: function() {

		if (this.items.length > 0) {

			this.filteredItems = this.items;
			this.$.popup.openAtControl(this.$.input, {top:30});

			this.$.list.refresh();
		} else {
		
			this.$.popup.close();
		}

	},

	itemClick: function(inSender, inEvent, inIndex) { 

		var item = this.filteredItems[inIndex];

		if (item) {
			this.setValue(item.value);
			this.doSearch(null, item.value)			

			this.$.input.setValue("");
			this.$.input.render();

			this.$.popup.close();
		}

	},

	serviceFail: function(inSender, inResponse) {
		// TODO: what?
	},
	
	serviceSuccess: function(inSender, inResponse, inRequest) {
		this.setData(inResponse);
	},

	filterPopupItems: function(value, item) {
		return item.caption !== "" && (item.caption.toLowerCase().indexOf(value) !== -1
				 || item.value.toLowerCase().indexOf(value) !== -1);	
	},					 

	setupRow: function(inSender, inIndex) {
	
		var self = this;

		if (inIndex >= 0 && inIndex < this.items.length) {

			if (inIndex === 0) {
			
				var value = this.$.input.value.toLowerCase();
			
				this.filteredItems = this.items.filter(function(item) {
					return self.filterPopupItems(value, item);
				});
			
			}

			if (this.filteredItems.length > 0) {
			
				var item = this.filteredItems[inIndex];

				if (item) {
				
					this.$.caption.setContent(item.caption);

					return true;	
				
				}

			} else {
			
				this.$.popup.close();
			}


		}
				 
	}

};