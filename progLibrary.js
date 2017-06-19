// Going to load each time rather than relying on cache.  Only do cache stuff it if's supported
if('caches' in window) {
  console.log("Cache supported");
};






// Services processing
const servicesJSONurl = 'http://aftervictory.com/domparse/';

  
// Div that holds content
const contentHolder = document.getElementById("contentHolder");
  
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
 	
 	// Each View Library button in a ndoelist
 	var _locationViewButton = document.querySelectorAll(".viewLibraryButton");
 
 	[].forEach.call(_locationViewButton, function (item) {

  		item.addEventListener("click", function(){
  			console.log(this);
  		});
  
	});	
 
 	// Each Make Favorite button in a ndoelist
 	var _makeFavoriteButton = document.querySelectorAll(".makeFavoriteButton");

 	[].forEach.call(_makeFavoriteButton, function (item) {

  		item.addEventListener("click", function(){
  			console.log(this);
  		});
  
	});	
 	
 	
 }; //setLibraryListEventListner
 
  
// Event Listner for AskWCPL questions.
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

  
// loads individual AskWCPL answer 
let loadAskWCPLanswer = function(questionID){
	
	// clears container div
	clearContainer();
	
	let _askWCPLurl = servicesJSONurl + 'example_extract_html.php?iid=294&format=json&qid='+ questionID;
	
	fetch(_askWCPLurl).then(function(response) { 
		
		// Convert to JSON
		return response.json();
		
		// store locally now?
		
	}).then(function(returnedloadAskWCPL) {
		
		var _returned = returnedloadAskWCPL.answer;
		console.log(_returned);
		
			let askHTML = `
                <h5>${_returned.question}</h5>
                <p>${_returned.answer}</p>
                <em>${_returned.updated}</em>

            `;
	
			
			contentHolder.insertAdjacentHTML( 'beforeend', askHTML );
		
	}).catch(function(err) {
		console.log('There has been an error loading this question');
		
	});
	
	
};  

  
// Loads all askWCPL Questions
let loadAskWCPLquestions = function(){
	
	// clears container div
	clearContainer();
	
	let _askWCPLquestionurl = servicesJSONurl + 'wakelib-askwcpl-questions.php?iid=294&type=popular&limit=500&showans=0&showdet=1&format=json';
	
	fetch(_askWCPLquestionurl).then(function(response) { 
		
		// Convert to JSON
		return response.json();
		
		// store locally now?
		
	}).then(function(returnedloadAskWCPL) {
		
		var _returned = returnedloadAskWCPL.answers;
		console.log(_returned);
		
		for (let _question of returnedloadAskWCPL.answers){
			
			// console.log(_question.question);
			
			let _questionsHTML = `
				<h5 data-question="${_question.id}">${_question.question}<br><em>${_question.details}</em></h5>
            `;
	

		contentHolder.insertAdjacentHTML( 'beforeend', _questionsHTML );
		};
	
	
		
	}).then(function(){
		
		// Sets event listeners
		setLibraryQuestionsEventListner();
		
		// Starts routing 	
		// router.updatePageLinks();
		
		
	}).catch(function(err) {
		console.log('There has been an error loading this question');
		
	});
		
	
	
	
	
};


// ////////////////////////////////////////////////
//  Book search



// Perform a general search
	// Autosuggest http://aftervictory.com/domparse/wakelib-catalog-autosuggest.php?method=GetAutoSuggestList&searchTerm=turkey

	// Search field
	var bookSearchinput = document.getElementById("bookSearchinput").value;	

	// Search button
	var bookSearchSubmit = document.getElementById("bookSearchSubmit");

	// dropdown filter 
	var bookSearchLibrary = document.getElementById("bookSearchLibraries");
	
	// http://aftervictory.com/domparse/wakelib-catalog-results.php?view=rss&lookfor=star%20wars&filter[]=available_at_catalog:%22Athens%20Drive%20Community%22
	
	


// https://catalog.wakegov.com/Search/Results?view=rss&lookfor=star%20wars

//  Available now - &filter[]=availability_toggle_catalog:"Available+Now"
//  Entire col - 	&filter[]=availability_toggle_catalog:""
// Available at - 	&filter[]=available_at_catalog:"Athens Drive Community"


// Details on a specific search



 
// ////////////////////////////////////////////////
 
 
 
 
 
 // Loads an individual Library
 let loadLibraryLocation = function(libraryID){
 	console.log("We are loading " + libraryID)
 	
 	loadLibraryPhoneNumber(name,city);
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
 
 
 
 
 

  
 // Load Library Locations 
 let loadHomeLibraryList = function(){
  
  	fetch(libraryLocations).then(function(response) { 
		// Convert to JSON
		return response.json();
		
		// store locally now?
		
	
		
	}).then(function(returnedLibraryData) {
	
		for (let location of returnedLibraryData.features){
			
			// Check and see if favorite, and show that one on top 
		
			// Template literal!
			let locationHTML = `
				<div class="card">
	              <div class="card-image">
	                <img src="locphotos/${location.attributes.CODE.toLowerCase()}.png">
	                <span class="card-title">${location.attributes.BLDGDESC}</span>
                  	<a class="btn-floating halfway-fab waves-effect waves-light blue lighten-5"><i class="material-icons">turned_in</i></a>
	              </div>
	              <div class="card-content">
	                <p>${location.attributes.FAC_ADDRESS}, ${location.attributes.CITY} NC</p>
	              </div>
	              <div class="card-action">
	                <a class="viewLibraryButton" href="/location/${location.attributes.CODE}" data-navigo>View Library</a>
	                <a class="makeFavoriteButton">Make Favorite</a>
	              </div>
	            </div>
            `;
	
			
			contentHolder.insertAdjacentHTML( 'beforeend', locationHTML );
			
		}  // End of loop
		
		

	}).then(function(){
		
		// Sets event listeners
		setLibraryListEventListner();
		
		// Starts routing 	
		router.updatePageLinks();
		
		
	}).catch(function(err) {
		console.log('There has been an error loading library locations');
		
		// Load local?
	});
 	
 	
 	// Adds event listeners!
 	
 	
 }; //loadHomeLibraryList
 
 
 
 
 
 // Load an individual library Locations
 
  
  
  
  
  
  
  
  
  
  
  
  // use https://github.com/TalAter/UpUp/ for offline?
  
  
  
  


// JS routing using Navigo.js




var root = "http://127.0.0.1:8887/";
var useHash = false; // Defaults to: false
var hash = null; // Defaults to: '#'
var router = new Navigo(root, useHash, hash);



router
	.on(function () {
	// Routing started
	//	loadHomeLibraryList();
	})
	.on('location/:id', function (params) {
	// display all the products
		console.log(params.id);
		
		// Clears out anything
		clearContainer();
		
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
    },
    leave: function (params) {
      // when you are going out of the that route
    }
  }).resolve();
  
  
  
  	

  	
  	
  	