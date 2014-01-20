enyo.kind({
	name: "PopupWebView",
	kind: enyo.Popup,
	height: "500px",
	width: "450px",

	published: {
		url: ""
	},

	components: [
		{kind: "WebView",name: "webView", flex: 1, height: "500px"}
	],

	doClose: function() {
		this.setUrl(null);
		this.inherited(arguments);
	},

	urlChanged: function() {
		this.$.webView.setUrl(this.url);		
	}

});
