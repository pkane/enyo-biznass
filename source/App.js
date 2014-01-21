// enyo.kind({
//   name: "App",
//   kind: enyo.FittableRows,
//   style: "",
//   classes: "onyx",
//   components: [
//     {kind: "onyx.InputDecorator", components: [
//       {kind: "onyx.Input", name: "sumControl", placeholder: "Enter sum"}
//     ]},
//     {kind: "onyx.InputDecorator", components: [
//       {kind: "onyx.Input", name: "percentControl", placeholder: "Enter percent"}
//     ]},
//     {kind: "onyx.Button", content: "Calculate tip", ontap: "calculateWithComponent"},
//     {tag: "div", name: "tipAmount"},
//     { kind: "PercentCalculator", name: "percentCalculator", onCalculated: "updateControls" }    
//   ],
//   create: function() {
//     this.inherited(arguments);
//   },
//   updateControls: function(inSource, inEvent) {
//     this.$.tipAmount.setContent(inEvent.percentValue);

//     return true; // stop bubbling
//   },
//   calculateWithComponent: function(inSource, inEvent) {
//     var sum = this.$.sumControl.hasNode().value; 
//     var percent = this.$.percentControl.hasNode().value;

//     this.$.percentCalculator.setSum(sum);
//     this.$.percentCalculator.setPercent(percent);

//     this.$.percentCalculator.calculate();
//   }      
// });

enyo.kind({
  name: "App",
  kind: "Panels",
  classes: "AboutView",
  fit: true,
  create: function() {
    this.inherited(arguments);
    // this.hideAllViews();
  },
  
  ready: function() {
    this.inherited(arguments);
    this.$.checkconnection.call({});
  },

  components: [

    {name: "myLeftPanel", kind: "FeedItems"},
    {name: "myRightPanel", kind: "Content"},
    {name: "myLastPanel"},  

    enyo.kind({
      name: "FeedItems",
      kind: enyo.Control,
      classes: "onyx",
      components: [
        {name: "text", tag: "h3", content: "lorem ipsum", classes: "onyx-item", ontap:"reveal"},  
        {name: "title", tag: "span", content: "lorem ipsum", classes: "onyx-item"},
        {kind: "FittableColumns", classes:"onyx-toolbar-inline", components: [
          {content: "YQL: "}
        ]},
        {name: "basicPopup", kind: "onyx.Popup", centered: true, floating: true, classes:"onyx-sample-popup", style: "padding: 10px;", content: "Popup..."},    
        {name: "weatherfeed", tag: "div", content: ""}    
      ]
    }),  

    enyo.kind({
      name: "Content",
      kind: enyo.Control,
      classes: "onyx",
      components: [
        {name: "text", tag: "h4", content: "lorem ipsum", classes: "onyx-item"},  
        {name: "text", tag: "p", content: "lorem ipsum sin dolor sect nonummy consecetuer lorem ipsum sin dolor sect nonummy consecetuer lorem ipsum sin dolor sect nonummy consecetuer lorem ipsum sin dolor sect nonummy consecetuer", classes: "onyx-item"},
        {name: "title", tag: "span", content: "lorem ipsum", classes: "onyx-item"},
        {kind: "FittableColumns", classes:"onyx-toolbar-inline", components: [
          {content: "YQL: "}
        ]},
        {name: "basicPopup", kind: "onyx.Popup", centered: true, floating: true, classes:"onyx-sample-popup", style: "padding: 10px;", content: "Popup..."},    
        {name: "weatherfeed", tag: "div", content: ""}    
      ]
    })

  ],

  reveal: function() {
    // this.$.FeedItems.hide();
    this.$.myRightPanel.show();
    this.$.Content.show();
    this.$.Content.initialize();
  },
  fetch: function() {
    var query = 'select *';
    var jsonp = new enyo.JsonpRequest({
      url: "http://www.usatoday.com/take-your-pick/golden-globes-2014.json",
      callbackName: "callback"
    });
    // send parameters the remote service using the 'go()' method
    jsonp.go({
      q: query
    });
    // attach responders to the transaction object
    jsonp.response(this, "processResponse");
  },
  processResponse: function(inSender, inResponse) {
    // do something with it
    this.$.weatherfeed.setValue(JSON.stringify(inSender.xhrResponse, null, 2));    
    // this.$.weatherfeed.setContent(JSON.stringify(inResponse, null, 2));    
    // this.$.textArea.setValue(JSON.stringify(inResponse, null, 2));
  }  

});

