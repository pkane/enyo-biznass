enyo.kind({
  name: "newApp",
  kind: "FittableRows",
  classes: "enyo-fit webservice-sample",  
  fit: true,
  components: [
    {kind: "WebService", name:"yql", url: "http://api-internal.usatoday.com/MobileServices/MArticleService.svc/mcontent/v1/fronts/tech_tablet", callbackName: "callback"},
    {kind: "newsBody", fit:true, name: "mainBody", classes:"", onload: "processRequest", components: [
      enyo.kind({
        name: "newsEntry",
        kind: "Control",
        classes: "onyx onyx-sample",
        components: [
          {tag: "h4", name: "headline", content: ""},
          {tag: "span", name: "date", content: ""},
          {tag: "span", name: "author", content: ""},
          {tag: "p", name: "bodycopy", content: ""}          
        ]        
      }),

      enyo.kind({
        name: "newsBody",
        kind: "Control",
        classes: "onyx onyx-sample"
      })
    ]}
  ],      
  processRequest: function (inSender) {
    var request = new enyo.Ajax({url: this.$.yql.url });
    this.contents = new Array();
    request.response(this, function(inSender, inData) {
      this.items = inData.modules.Items.content;      
      if (this.items) {      
        for (var i = 0; i <= 3; i++) {
          this.contents[i] = this.items[i].metaData;                                         
        };
      } 
      for (i=0; i<=this.contents.length - 1; i++) {
        console.log(this.contents[i]);
     
        newEntry = new newsEntry();          
        newEntry.$.headline.setContent(this.contents[i].shortHeadline);
        newEntry.$.author.setContent(this.contents[i].byline);
        newEntry.$.bodycopy.setContent(this.contents[i].storyabstract);   
        newEntry.renderInto(document.body);
      }
      // this.$.textArea.setValue(this.contents);      
      // this.$.textArea.setValue(JSON.stringify(this.items, null, 2));
    });
    request.go();
  }

});