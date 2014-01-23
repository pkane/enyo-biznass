enyo.kind({
  name: "newApp",
  kind: "FittableRows",
  classes: "enyo-fit webservice-sample",  
  fit: true,
  components: [
    {kind: "WebService", name:"yql", url: "http://api-internal.usatoday.com/MobileServices/MArticleService.svc/mcontent/v1/fronts/tech_tablet", callbackName: "callback"},
    {kind: "onyx.TextArea", fit:true, classes:"webservice-sample-source", onload: "processRequest", components: [

    ]}
  ],
  processRequest: function (inSender) {
    var request = new enyo.Ajax({url: this.$.yql.url });
    request.response(this, function(inSender, inData) {
      this.items = inData.modules;
      // this.content = this.items.indexOf('content');
      console.log(this.items);
      for (var i = 0; i <= this.items.length; i++) {
        console.log(i);
        if (this.items[i].type == "text") {
          var newEntry = new onyx.sample.TabBarSample();
          newEntry().renderInto(this.$.textArea.setValue(JSON.stringify(this.items[i])))
        };
      };
      this.$.textArea.setValue(JSON.stringify(this.items, null, 2));
    });
    request.go();
  }
});

enyo.kind({
  kind: "Control",
  classes: "onyx onyx-sample"
})