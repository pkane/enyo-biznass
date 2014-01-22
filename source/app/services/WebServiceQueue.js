/*
 *  Adds ability to queue multiple url requests to a web service
 */

enyo.kind({

	name: "WebServiceQueue",
	kind: "PersistentWebService",  /*PersistentWebService  enyo.WebService*/
	
	events: {
		onStart: "",
		onComplete: ""
	},

	published: {
		autoNext: true
	},
	
	/* type: "lilo" */

	requested: [],
	waiting: false, inQueue: false,
	serviceState: null, /* Allows you to pass in a stateful object with whatever data you want to save for the response (ie section) */
	
	cutInLine: function(requestedUrl, serviceState) { /* buncha jerks */
	
		if (this.waiting || (this.requested.length > 0 && this.requested.indexOf(requestedUrl) === -1)) {
			this.requested.unshift({url: requestedUrl, state: serviceState}); 
		}

		this.requestService(requestedUrl, serviceState);		
	}, 

	get: function(requestedUrl, serviceState) {
	
		if (this.waiting || (this.requested.length > 0 && this.requested.indexOf(requestedUrl) === -1)) {
			this.requested.push({url: requestedUrl, state: serviceState}); 
		}		

		this.requestService(requestedUrl, serviceState);
	},
	
	requestService: function(requestedUrl, serviceState) {
	
		var urlToRequest = requestedUrl,
			itemState = serviceState,
			item
			;		

		if (!this.waiting) {

			if (this.requested.length > 0) {
				item = this.requested.shift();
				
				urlToRequest = item.url;
				itemState = item.state;
			}		
	
			this.waiting = true;
			this.url = urlToRequest;
			this.serviceState = itemState;
			
			this.call();
			
			if (!this.inQueue) {
				this.doStart();	
			}
		}
	
	},
	
	getNextIfExists: function() {
		this.waiting = false;	
		
		if (this.requested.length > 0) {
			this.inQueue = true;
			this.get(this.requested[0]);
		} else {
			this.doComplete();
			this.inQueue = false;
		}		
	},

	responseSuccess: function(inRequest) {
		this.inherited(arguments);

		if (this.autoNext) {
			this.getNextIfExists();
		}
	},
	
	responseFailure: function(inRequest) {
		this.inherited(arguments);
		this.getNextIfExists();
	}
	
});
