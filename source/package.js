enyo.depends(
	"$lib/layout",
	"$lib/onyx",	// To theme Onyx using Theme.less, change this line to $lib/onyx/source,
	//"Theme.less",	// uncomment this line, and follow the steps described in Theme.less

	"app/Config.js",
	"app/Extensions.js",
	"app/Application.js",
	
	/* Stylesheets */	

	"stylesheets/Main.css",
	
	/* Views */	
	"app/views/AboutView.js",
	"app/views/MainView.js",
	"app/views/ArticleView.js",
	"app/views/ScoresView.js",
	"app/views/MarketsView.js",
	"app/views/SnapshotsView.js",
	"app/views/PhotoGalleryView.js",
	"app/views/WeatherView.js",
	
	/* Controls */	
	
	"app/controls/ArticleButton.js",
	"app/controls/LedeArticleButton.js",
	"app/controls/FilteredSearchList.js",
	"app/controls/ForeheadButton.js",
	"app/controls/HScroller.js",
	"app/controls/ScoresTitleBox.js",	
	"app/controls/ScoresMatchBox.js",	
	"app/controls/PopupSlider.js",	
	"app/controls/PopupWebView.js",	
	"app/controls/ArticleButtonScroller.js",
	"app/controls/QuickQuestion.js",
	"app/controls/QuickQuestionProgressBar.js",
	"app/controls/WeatherSearchList.js",
	"app/controls/MarketsSearchList.js",
	
	/* Services */		
	
	"app/services/ArticleVideoService.js",
	"app/services/PersistentWebService.js",
	"app/services/Omniture.js",
	"app/services/WebServiceQueue.js",	
	
	/* Value Objects */
	
	"app/valueObjects/WeatherVO.js",
	"app/valueObjects/ServiceState.js"
);
