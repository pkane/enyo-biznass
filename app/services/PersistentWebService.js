
// Adding persistence layer to web service...

enyo.kind({
					 
	name: "PersistentWebService",
	kind: enyo.WebService,

	db: null,

	published: {
		usePersistence: false
	},
	
	create: function() {
		this.inherited(arguments);
		
		if (this.usePersistence === true) {
			this.createDB();
		}
	},
	
	responseSuccess: function(inRequest) {

		var self = this,
			args = arguments
			;

		if (this.db != null && this.usePersistence === true && inRequest.hasOwnProperty("response")) {
			
			try {
				
				if (inRequest.response === "") {
					
					this.retrieveData(inRequest, function(data) {
						inRequest.response = data;
						self.inherited(args);						
					});
					
				} else {
					this.storeData(inRequest);
					this.inherited(arguments);
				}
			
			} catch (error) {
				// lame...			
			}

		} else {
			this.inherited(arguments);		
		}		
		
	},
	
	createDB: function() {
	
		try {	

			this.db = Config.db || openDatabase('usatoday.webos', '', 'USA TODAY DB', 65536);	

			var create = "CREATE TABLE IF NOT EXISTS persist(id TEXT PRIMARY KEY DEFAULT 'none', data TEXT NOT NULL DEFAULT 'none');";					

			this.db.transaction(enyo.bind(this, function(transaction) {
				transaction.executeSql(create, [], null, null);
			}));	

			Config.db = this.db;

		} catch (error) {
			this.db = null;
		}
	
	},
	
	retrieveData: function(inRequest, callback) {
	
		var id = inRequest.url;
		var selectSql = "SELECT * FROM persist WHERE id = ?;";
		var self = this;
		
		this.db.transaction(enyo.bind(this, function(transaction) {
			transaction.executeSql(selectSql, [id], 
					function(inTransaction, inResultSet) { 
						if (inResultSet.rows && inResultSet.rows.length > 0) {
							
							var item = inResultSet.rows.item(0);	
							
							callback(enyo.json.parse(item.data));
						}
						else {
							callback(inRequest.response);
						}
					}, 
					function() { 
						// console.log('select failed ', arguments);
						callback(inRequest.response);
					});
		}));

	},	

	storeData: function(inRequest) {
	
		var id = inRequest.url,
			text = enyo.json.stringify(inRequest.response)
			;

		if (text && text !== "") {
	
			var deleteSql = "DELETE FROM persist WHERE id = ?;";
			var insertSql = "INSERT INTO persist (id, data) VALUES (?,?);";

			this.db.transaction(enyo.bind(this, function(transaction) {

				transaction.executeSql(deleteSql, [id], 
					  function() { console.log('delete success ', arguments); }, 
					  function() { console.log('delete failed ', arguments); });

				transaction.executeSql(insertSql, [id, text], 
					  function() { console.log('insert success ', arguments); }, 
					  function() { console.log('insert failed ', arguments); });									
			}));
		}
	
	}
					 
});
