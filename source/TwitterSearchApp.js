enyo.kind({
  name: "TwitterSearchApp",
  kind: enyo.Control,
  classes: "onyx",
  layoutKind: "FittableRowsLayout",  
  components: [
	  {kind: "onyx.InputDecorator", components: [
	    {kind: "onyx.Input", name: "searchTerm", 
	      placeholder: "Search on Twitter", onkeydown: "searchOnEnter"},
	    {kind: "Image", src: "search-input-search.png", ontap: "search"}
	  ]},
	  { tag: "div", name: "introcopy", content: "This is the list of results:" },	  
	  { kind: "enyo.Scroller", fit: true, components: [
		  { tag: "div", name: "tweetList" }
	  ]}
  ],

searchOnEnter: function(inSender, inEvent) {
  if (inEvent.keyCode === 13) {
    this.search();
    return true;
  }
},  

  addTweet: function(inResult) {
    this.createComponent({
      kind: Tweet,
      container: this.$.tweetList,
      text: inResult.text
    });
  },

  search: function() {
    var searchTerm = this.$.searchTerm.hasNode().value;
    var request = new enyo.JsonpRequest({
        url: "http://www.usatoday.com/life.json",
        callbackName: "callback"
      });
	function getObjects(obj, key, val) {
	    var objects = [];
	    for (var i in obj) {
	        if (!obj.hasOwnProperty(i)) continue;
	        if (typeof obj[i] == 'object') {
	            objects = objects.concat(getObjects(obj[i], key, val));
	        } else if (i == key && obj[key] == val) {
	            objects.push(obj);
	        }
	    }
	    return objects;
	}    
	var subtext = getObjects(request, 'id', 'A');	

    request.response(enyo.bind(this, "processSearchResults"));
    request.go({ q: subtext });
  },

  processSearchResults: function(inRequest, inResponse) {
    if (!inResponse) return;
    this.$.tweetList.destroyClientControls();
    enyo.forEach(inResponse.results, this.addTweet, this);
    this.$.tweetList.render();
  }
});

var twitterSearchApp = new TwitterSearchApp();
// twitterSearchApp.renderInto(document.body);