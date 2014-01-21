enyo.kind({
	
	name: "AboutView",
	kind: enyo.VFlexBox,
	className: "aboutView",
	
	events: {
		onClose: ""
	},

	data: [
	    {label: "Terms of Service", id: "termsOfService"},   
		{label: "Privacy Policy", id: "privacyPolicy"}
	],	
	
	selectedRow: 0,

	components: [

		{ kind: "PalmService", service: "palm://com.palm.applicationManager/", components: [
			{name: "launchApp", method: "launch"}
		]},	

		{kind: "PageHeader", components: [
			{kind: enyo.Image, src: "images/logo64x64.png"},
			{kind: enyo.VFlexBox, flex: 1, components: [
			                                            
			]},
			{kind: "Button", caption: "Email Support", onclick: "emailClick", style: "background-color: #64A1CA; color: white;"},
			{kind: "Button", caption: "Close", onclick: "doClose"}                                  
		]},
		
		{kind: enyo.HFlexBox, flex: 1, components: [
			{kind: "VirtualList", className: "list", width:"200px", 
			      onSetupRow: "setupRow", components: [
			          {kind: "Item", layoutKind: "HFlexLayout", onclick: "itemClick",
			              components: [
			                  {name: "caption", flex: 1}
			              ]
			          }
			      ]
			},
			
			{kind: "Scroller", flex: 1, style: "margin:15px;", components: [
				{kind: "HtmlContent", name: "termsOfService", srcId: "termsOfService", flex: 1, lazy: true, showing: false},
				{kind: "HtmlContent", name: "privacyPolicy", srcId: "privacyPolicy", flex: 1, lazy: true, showing: false}
			]}
		]}
	],
	
	emailClick: function() {
		this.$.launchApp.call(
			{id: "com.palm.app.email", params: {
				summary: 'HP webOS Tablet Support',
				recipients: [
					{ value: Config.emailSupport }             
				]
			}}
		);	
	},
	
	itemClick: function(inSender, inEvent) {
		this.selectedRow = inEvent.rowIndex;
		this.$.virtualList.refresh();
		this.$.scroller.scrollIntoView(0, 0);
	},
	
	setupRow: function(inSender, inIndex) {
		var row = this.data[inIndex];
		
		if (row) {
			
			this.$.caption.setContent(row.label);
			
			var isRowSelected = (inIndex === this.selectedRow);			

			
			if(isRowSelected) {
				this.$[row.id].show();
			} else {
				this.$[row.id].hide();
			}
			
			this.$.item.applyStyle("background", isRowSelected ? "#cfcfcf" : null);

			return true;
		}
	}
	
});