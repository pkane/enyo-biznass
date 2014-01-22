enyo.kind({

	name: "HScroller",
	kind: enyo.Scroller,
	vertical: false,
	
	components: [
		{ kind: enyo.HFlexBox, name: "hbox", className: "hbox" }
	],
	
	destroyViews: function() {
		this.$.hbox.destroyComponents();
	},

	createView: function(view) {
		return this.$.hbox.createComponent(view);
	}

});