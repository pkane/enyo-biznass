var QuickQuestion = {

	kind: enyo.VFlexBox,
	className: "quickQuestion",

	events: {
		onSelect: ""
	},

	published: {
		question: ""
	},

	itemClick: function(inSender, inEvent) {
		this.doSelect({answer: inSender.value, question: this.question.SnapshotId});
	},	

	questionChanged: function() {
	
		console.log('question changed ', this.question);	

		var self = this;
		
		this.destroyComponents();
	
		// this.createComponent({content: this.question.QuickQuestion, className: "qqText"});

		this.createComponent({kind: enyo.HFlexBox, components: [
			  {kind: "Image", src: this.question.ThumbnailImage, style: "margin-right: 5px; border: 1px solid #AAA"},                                                  
		      {content: this.question.QuickQuestion, className: "qqText", flex: 1}                                                  
		]});
		
		if (this.question.hasOwnProperty("response")) {
			
			var response = this.question.response;
			
			if (response.hasOwnProperty("question") && response.question.length > 0) {
				
				var loc = response.question[0]["location"];			
				
				if (loc && loc.length > 0) {
					
					var q = loc[0]["answer"];				
					var total = 0;
					
					q.forEach(function(a) {
						total += parseInt(a.answerCount, 10);
					});

					var pb;
					
					q.forEach(function(a) {
						pb = self.createComponent({kind: "QuickQuestionProgressBar"});
						
						pb.setText(a.answerText);
						pb.setPosition(Math.floor(parseInt(a.answerCount, 10) / total * 100));
					});
				}

			}

		} else {

			this.question.Answers[0]["Answer"].forEach(function(a) {
				self.createComponent({kind: "Button", caption: a.value, onclick: "itemClick", value: a.ID, className: "qqButton"}); // a.value
			});		
			
		}
		
		this.render();		

	}
	
};