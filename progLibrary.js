// Going to load each time rather than relying on cache.  Only do cache stuff it if's supported
if('caches' in window) {
  console.log("Cache supported");
}





// Services processing
const servicesJSONurl = 'http://aftervictory.com/domparse/';

// Div that holds content
const contentHolder = document.getElementById("homeScreenHolder");

const askWakeQuestionHolder = document.getElementById("askWakeQuestionHolder");

  
// REST Endpoints
const libraryLocations = 'https://services1.arcgis.com/a7CWfuGP5ZnLYE7I/arcgis/rest/services/Libraries/FeatureServer/0/query?where=1%3D1&outFields=*&orderByFields=NAME&outSR=4326&f=json';


// Today in YYYYMMDD format
let eventDateToday = function(){

	let _today = new Date();	// new date object
	let _year = _today.getFullYear();	// 2017
	let _day = _today.getDate();	// 17
	let _month =('0'+(_today.getMonth()+1)).slice(-2);

	return _year +''+ _month +''+ _day;
};


// Tomorrow in YYYYMMDD format
let eventDateTomorrow = function(){

	let _tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	let _day = _tomorrowDate.getDate();
	let _month =('0'+(_today.getMonth()+1)).slice(-2);
	let _year = _tomorrowDate.getFullYear();

	return _year +''+ _month +''+ _day;
};


// function that clears out #contentHolder
let clearContainer = function(){
	while (contentHolder.hasChildNodes()){
		contentHolder.removeChild(contentHolder.firstChild);
	}

};

 
 
 
 
// Load all events for a Library




// to do future events, do like this:
// more data in XML http://www.trumba.com/calendars/WCPL.rss?search=Cary+Community+Library&previousweeks=0&HTML=0&weeks=1
// search=East+Regional+library&HTML=0&weeks=2

// Load a day's events for a Library
	// eventDateToday param is passed as a function
let loadEventsLibrarySingleDay = function(searchTerms,eventDate){
	
	// clears container div
	clearContainer();
	
	let _eventsWCPLurl = servicesJSONurl + 'wakelib-events.php?search='+ searchTerms +'&HTML=0&date='+ eventDate;
	
	fetch(_eventsWCPLurl).then(function(response) { 
		
		// Convert to JSON
		return response.json();
		
		// store locally now?
		
	}).then(function(returnedEventsWCPL) {
		
		var _returned = returnedEventsWCPL.entry;
		
		for (let event of _returned){
			
			let _questionsHTML = `
				<div><h5>${event.title}</h5><em>${event.content}</em></div>
            `;
	

		contentHolder.insertAdjacentHTML( 'beforeend', _questionsHTML );
		
		};
		
	}).then(function(){
		
		// Sets event listeners
		// setLibraryQuestionsEventListner();
		
		// Starts routing 	
		// router.updatePageLinks();
		
		
	}).catch(function(err) {
		console.log('There has been an error loading this events listing');
		
	});
		
	
};







// Load invidual event
 





 

 
  
// Event Listener for Location cards
let setLibraryListEventListner = function(){
 	/*
 	// Plane old html buttons mean no event listener needed
 	var _locationViewButton = document.querySelectorAll(".viewLibraryButton");
 
 	[].forEach.call(_locationViewButton, function (item) {

  		item.addEventListener("click", function(){
  			console.log(this);
  		});
  
	});	
 */
 	// Each Make Favorite button in a ndoelist
 	var _makeFavoriteButton = document.querySelectorAll(".makeFavoriteButton");

 	[].forEach.call(_makeFavoriteButton, function(item) {

		var _myFavoriteLibrary = item.getAttribute("data-favorite");

		// Adds library location to localStorage as favorite.
		// If one is already in place, shows replaces it
  		item.addEventListener("click", function(){
  			
  			// Sets this clicked location as favorite
  			localStorage.setItem("myFavoriteLibrary",_myFavoriteLibrary);
  			
  			
  			// now we call clearContainer?
  			
  			// Need to retrieve value on loaded
  			
  			// update icon 
  			
  			
  		});
  
	});	
 	
 	
 }; //setLibraryListEventListner
 
  
// Event Listner for AskWCPL questions.
/*
let setLibraryQuestionsEventListner = function(){
 	
 	// Each question is loaded into a nodelist
 	var _askWCPLquestionLink = document.querySelectorAll("[data-question]");
 
 
 	// Which we treat as an array, and loop through
 	[].forEach.call(_askWCPLquestionLink, function (item) {
	
  		item.addEventListener("click", function(){
  		
  			var _questionID = this.getAttribute("data-question");
  			
  			// Loads individual answer
  			loadAskWCPLanswer(_questionID);
  		
  			
  		});	//Event listner
  		
	});		// Looping through questions
 	
 }; 		//setLibraryQuestionsEventListner
*/
  
// loads individual AskWCPL answer 
let loadAskWCPLanswer = function(questionID){
	
	let _askWCPLurl = servicesJSONurl + 'example_extract_html.php?iid=294&format=json&qid='+ questionID;
	
	fetch(_askWCPLurl).then(function(response) { 
		
		// Convert to JSON
		return response.json();
		
		// store locally now?
		
	}).then(function(returnedloadAskWCPL) {
		
		var _returned = returnedloadAskWCPL.answer;
		// console.log(_returned);
		
			let askHTML = `
			<div class="row">
		      <div class="col s12">
		        <div class="card-panel flow-text">
		                <h5>${_returned.question}</h5>
		                <p>${_returned.answer}</p>
		                <p><em>${_returned.updated}</em></p>
		        </div>
		      </div>
		    </div>
            `;
	
			
			contentHolder.insertAdjacentHTML( 'beforeend', askHTML );
		
	}).catch(function(err) {
		console.log('There has been an error loading this question');
		
	});
	
	
};  

  
// Loads all askWCPL Questions
let loadAskWCPLquestions = function(){
	
	// Where questions will land
	let _askWakeQuestionHolder = document.getElementById("askWakeQuestionHolder");
	let _askWakeQuestionCollection = document.getElementById("askWakeQuestionCollection");
	

	
	// where we get our question list form
	let _askWCPLquestionurl = servicesJSONurl + 'wakelib-askwcpl-questions.php?iid=294&type=popular&limit=500&showans=0&showdet=1&format=json';
	
	fetch(_askWCPLquestionurl).then(function(response) { 
		
		// Convert to JSON
		return response.json();
		
		// store locally now?
		
		}).then(function(returnedloadAskWCPL) {
		
			var _returned = returnedloadAskWCPL.answers;
			// console.log(_returned);
			
			for (let _question of returnedloadAskWCPL.answers){
				
				// console.log(_question.question);
				
				let _questionsHTML = `
					<a class="collection-item" data-question="${_question.id}" href="/ask/${_question.id}">${_question.question}</a>
	            `;
		
			// Place each question in container div
			_askWakeQuestionCollection.insertAdjacentHTML( 'beforeend', _questionsHTML );
			
			};
	
	
		}).then(function(){
		
			// Sets event listeners
			// setLibraryQuestionsEventListner();
			
		
		}).catch(function(err) {
			console.log('There has been an error loading this question');
		
	});

};


// ////////////////////////////////////////////////
//  Book search



// Perform a general search
	// Autosuggest http://aftervictory.com/domparse/wakelib-catalog-autosuggest.php?method=GetAutoSuggestList&searchTerm=turkey

let bookSearch = function(){
	bookSearchSubmit.addEventListener("click", function(){
	// Search field
	
	let bookSearchinput = document.getElementById("bookSearchinput").value;	

	// Search button
	let bookSearchSubmit = document.getElementById("bookSearchSubmit");

	// dropdown filter 
	let bookSearchLibrary = document.getElementById("bookSearchLibraries");
	
	// http://aftervictory.com/domparse/wakelib-catalog-results.php?view=rss&lookfor=star%20wars&filter[]=available_at_catalog:%22Athens%20Drive%20Community%22
	
	let bookSearchURLpath = 'wakelib-catalog-results.php?view=rss&lookfor=';
	let bookSearchURLavailability = '&filter[]=availability_toggle_catalog:';
	let bookSearchURLlocation = '&filter[]=available_at_catalog' + bookSearchLibrary.value;
	


  	
  	let bookSearchURL = servicesJSONurl + bookSearchURLpath + "'" + bookSearchinput + "'" + bookSearchURLavailability + bookSearchURLlocation;
  	
  	console.log(bookSearchURL)
  });
};



// https://catalog.wakegov.com/Search/Results?view=rss&lookfor=star%20wars

//  Available now - &filter[]=availability_toggle_catalog:"Available+Now"
//  Entire col - 	&filter[]=availability_toggle_catalog:""
// Available at - 	&filter[]=available_at_catalog:"Athens Drive Community"


// Details on a specific search
	// invididual listing: http://aftervictory.com/domparse/wakelib-catalog-individualbook.php?https://catalog.wakegov.com/GroupedWork/aaff1eaf-1729-da14-d03b-cdf1b7c0c171/AJAX?method=getWorkInfo



 
// ////////////////////////////////////////////////
 
 
 
 
 
 // Loads an individual Library Branch
 let loadBranchLocation = function(){

 	
 	
 	
 	
 //	loadBranchLocation(name,city);
 };
 
 



// Loads phone number from FourSquare API
let loadLibraryPhoneNumber = function(name, city){
	
	// Passed paramters
	_libraryName = name;
	_libraryCity = city;
	// Foursquare API
	var _clientID = "R4AMR23V3JWLXO3LIQILBZPZ1TNEWELPYSUK2YBEUBPL4OBU";
	var _clientSecret = "RUX5IIKBSU0K0MEKJYVOJNPSX3E1G4WGJCRGSVHQK02AAXRE";

	var _loadLibraryREST = "https://api.foursquare.com/v2/venues/search?limit=1&=match&query="+ _libraryName +"&near=Knightdale&client_id="+ _clientID +"&client_secret="+ _clientSecret +"&v=20150920";
	console.log(_loadLibraryREST);
	
};
 
 
 
 // Load Library Locations for Locations page 
 let loadLocations = function(){

  	fetch(libraryLocations).then(function(response) { 
		// Convert to JSON
		return response.json();
		
		// store locally now?
		
		}).then(function(returnedLibraryData) {
		
		
		for (let location of returnedLibraryData.features){
			
		// Template literal!
		
			let locationHTML = `
				<div class="card" data-loc="${location.attributes.CODE}">
	              <div class="card-image">
	                <img src="/locphotos/${location.attributes.CODE.toLowerCase()}.png">
	                <span class="card-title">${location.attributes.BLDGDESC}</span>
                  	<a class="btn-floating halfway-fab waves-effect waves-light blue lighten-5"><i class="material-icons">turned_in</i></a>
	              </div>
	              <div class="card-content">
	                <p>${location.attributes.FAC_ADDRESS}, ${location.attributes.CITY} NC</p>
	              </div>
	              <div class="card-action">
	                <a class="viewLibraryButton" href="/locations/branch.html?branch=${location.attributes.CODE}"	>View</a>
	                <a class="makeFavoriteButton" data-favorite="${location.attributes.CODE}">Make My Branch</a>
	              </div>
	            </div>
            `;
            
        	// Check and see if a location is a favorite, and show that one on top 
			// if there's a fav, select it
		
			let _userFavoriteLibrary = localStorage.getItem("myFavoriteLibrary");
		  		
		  	let _locsPageLandingDiv = document.getElementById("wakeLocationsHolder");
	  	
			_locsPageLandingDiv.insertAdjacentHTML( 'beforeend', locationHTML );
	
		}  // End of loop
		
		

	}).then(function(){
		// Sets event listeners
		setLibraryListEventListner();
		
		
	}).catch(function(err) {
		Materialize.toast('There has been an error loading library locations!', 4000);
		
		// Load local?
	});
 	
 	
 	// Adds event listeners!
 	
 	
 }; 
 
 
 
 
 
 
 
 
 

  	
 // Load Library Locations 
 let loadHomeLibraryList = function(){

  	fetch(libraryLocations).then(function(response) { 
		// Convert to JSON
		return response.json();
		
		// store locally now?
		
		}).then(function(returnedLibraryData) {
		
		
		for (let location of returnedLibraryData.features){
			
		// Template literal!
		
			let locationHTML = `
				<div class="card" data-loc="${location.attributes.CODE}">
	              <div class="card-image">
	                <img src="locphotos/${location.attributes.CODE.toLowerCase()}.png">
	                <span class="card-title">${location.attributes.BLDGDESC}</span>
                  	<a class="btn-floating halfway-fab waves-effect waves-light blue lighten-5"><i class="material-icons">turned_in</i></a>
	              </div>
	              <div class="card-content">
	                <p>${location.attributes.FAC_ADDRESS}, ${location.attributes.CITY} NC</p>
	              </div>
	              <div class="card-action">
	                <a class="viewLibraryButton" href="/location/${location.attributes.CODE}" data-navigo>View</a>
	                <a class="makeFavoriteButton" data-favorite="${location.attributes.CODE}">Make My Branch</a>
	              </div>
	            </div>
            `;
            
        	let notFavoriteLocationHTML = `<option>${location.attributes.BLDGDESC}</option>`;
		    
			
			// Check and see if a location is a favorite, and show that one on top 
		
			let _userFavoriteLibrary = localStorage.getItem("myFavoriteLibrary");
		  		
	  		// if there's a fav, show at the top
			if(locationHTML.indexOf('data-loc="'+ _userFavoriteLibrary +'"') >=0){
				
				contentHolder.insertAdjacentHTML( 'afterbegin', locationHTML );
				
			}	
			
			// There are no favorites 
			else if(_userFavoriteLibrary === null){
				
				contentHolder.insertAdjacentHTML( 'beforeend', locationHTML );
			
		
			// Some kind of template for not-the-favs-when-there-is-a-fav
			} else{
				
				let libraryListNotFav = document.getElementById("libraryListNotFav");
				libraryListNotFav.insertAdjacentHTML( 'beforeend', notFavoriteLocationHTML );
				
				$('select').material_select();

			}
			
			
			libraryListNotFav.insertAdjacentHTML( 'beforeend', notFavoriteLocationHTML );
		
			
		}  // End of loop
		
		

	}).then(function(){
		
		// Sets event listeners
		setLibraryListEventListner();
		
		
	}).catch(function(err) {
		console.log('There has been an error loading library locations');
		
		// Load local?
	});
 	
 	
 	// Adds event listeners!
 	
 	
 }; //loadHomeLibraryList
 
 
  
  
  
  
  
  
  
  
  
  
  
  // use https://github.com/TalAter/UpUp/ for offline?
  
  
  
  


// JS routing using Navigo.js
/* 
var root = "http://127.0.0.1:8887";
var useHash = false; // Defaults to: false
var hash = null; // Defaults to: '#'
var libraryRouter = new Navigo(root, useHash, hash);


libraryRouter
	.on(function () {
	// Routing started
	
		// clearContainer();
	
		loadHomeLibraryList();
	})
	.on('ask/', function () {

		console.log("Ask!");
		
		// clears container div
		// clearContainer();

		
		// Loads all Questions
		loadAskWCPLquestions();
		
		
	})
	.on('ask/:id', function (params) {

		console.log(params.id);
		
		// clears container div
		// clearContainer();

		// Loads individual question
		loadAskWCPLanswer(params.id);
		
	})
	.on('location/:id', function (params) {
	// display all the products
		console.log(params.id);
		
		// Clears out anything
		// clearContainer();
		
		// Loads an individual location
		loadLibraryLocation(params.id);
		
		
	},
  {
    before: function (done, params) {
      // doing some async operation
      done();
      // console.log("before");
    },
    after: function (params) {
      // after resolving
        // console.log("after" + params.id);
        // router.updatePageLinks();
    },
    leave: function (params) {
      // when you are going out of the that route
    }
  }).resolve();
  
  
 */ 
  	
// Event listener that starts the Javascript
window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed

		

	// PJAX is best jax
	Barba.Pjax.start();
	
	// Disabled for now
	Barba.Pjax.cacheEnabled = false;

	loadHomeLibraryList();
	
	
	Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container) {
		console.log("page has changed")
	});
	
	// Update Analytics
	/* 
	Barba.Dispatcher.on('initStateChange', function() {
	  ga('send', 'pageview', location.pathname);
	});
	*/
	
	
	
	// homescreen Functions
	var homescreen = Barba.BaseView.extend({
	  namespace: 'homescreen',
	  onEnter: function() {
	      // The new Container is ready and attached to the DOM.
	      console.log("onEnter");
	  },
	  onEnterCompleted: function() {
	      // The Transition has just finished.
	      
			// Loads the list of libraries 
			loadHomeLibraryList();
			console.log("home");
	      
	  },
	  onLeave: function() {
	      // A new Transition toward a new page has just started.
	  },
	  onLeaveCompleted: function() {
	      // The Container has just been removed from the DOM.
	  }
	});
	
	// Don't forget to init the view!
	homescreen.init();
	
	
	
	
	
	
	
	

	// AskWCPL Functions
	var askwcpl = Barba.BaseView.extend({
	  namespace: 'askwcpl',
	  onEnter: function() {
	      // The new Container is ready and attached to the DOM.
	      console.log("onEnter");
	  },
	  onEnterCompleted: function() {
	      // The Transition has just finished.
	      
	      loadAskWCPLquestions();
	      
	  },
	  onLeave: function() {
	      // A new Transition toward a new page has just started.
	  },
	  onLeaveCompleted: function() {
	      // The Container has just been removed from the DOM.
	  }
	});
	
	// Don't forget to init the view!
	askwcpl.init();
	

	// Locations Functions
	var locations = Barba.BaseView.extend({
	  namespace: 'locations',
	  onEnter: function() {
	      // The new Container is ready and attached to the DOM.
	      console.log("onEnter");
	       loadLocations();
	  },
	  onEnterCompleted: function() {
	      // The Transition has just finished.
	      
	     
	      
	  },
	  onLeave: function() {
	      // A new Transition toward a new page has just started.
	  },
	  onLeaveCompleted: function() {
	      // The Container has just been removed from the DOM.
	  }
	});
	
	// Don't forget to init the view!
	locations.init();





	// Locations Functions
	var branch = Barba.BaseView.extend({
	  namespace: 'branch',
	  onEnter: function() {
	      // The new Container is ready and attached to the DOM.
	      console.log("onEnter");
	      
	      loadBranchLocation();
	      
	  },
	  onEnterCompleted: function() {
	      // The Transition has just finished.
	      
	     
	      
	  },
	  onLeave: function() {
	      // A new Transition toward a new page has just started.
	  },
	  onLeaveCompleted: function() {
	      // The Container has just been removed from the DOM.
	  }
	});
	
	// Don't forget to init the view!
	branch.init();










},false);
  	
  	