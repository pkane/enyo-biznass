enyo.kind({
  name: "newApp",
  kind: "FittableRows",
  classes: "enyo-fit webservice-sample",  
  fit: true,
  components: [
    {kind: "WebService", name:"yql", url: "http://api-internal.usatoday.com/MobileServices/MArticleService.svc/mcontent/v1/fronts/tech_tablet", callbackName: "callback"},
    {kind: "newsBody", fit:true, name: "mainBody", classes:"", onload: "processRequest", components: [

    ]}
  ],
  processRequest: function (inSender) {
    var request = new enyo.Ajax({url: this.$.yql.url });
    this.contents = new Array();
    request.response(this, function(inSender, inData) {
      this.items = inData.modules.Items.content;      
      if (this.items) {      
        for (var i = 0; i <= 5; i++) {
          this.contents[i] = this.items[i].metaData;                                         
        };
      } 
      for (i=0; i<=this.contents.length; i++) {
        console.log(this.contents[i]);
        new newsEntry().renderInto(this.$.mainBody);
        // newEntry.$.headline.setContent(this.contents[i].headline);
        // // newEntry.$.date.setContent(this.contents[i].dates.published); 
        // // newEntry.$.bodycopy.setContent(this.contents[i].storyabstract);
        // newEntry.renderInto(this.$.mainBody); 
      }
      // this.$.textArea.setValue(this.contents);      
      // this.$.textArea.setValue(JSON.stringify(this.items, null, 2));
    });
    request.go();
  }
});

enyo.kind({
  name: "newsEntry",
  kind: "Control",
  classes: "onyx onyx-sample",
  components: [
    {tag: "h4", name: "headline"},
    {tag: "span", name: "date"},
    {tag: "p", name: "bodycopy"}
  ]
});

enyo.kind({
  name: "newsBody",
  kind: "Control",
  classes: "onyx onyx-sample",
  components: [
    {tag: "div", name: "copy"}
  ]
});     