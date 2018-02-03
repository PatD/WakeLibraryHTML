// Wake County Libraries JS

// todo:
	// Add book clubs
	// ics.js
	// maps all loc
	// Book search
	


// Global filter to make dates not weird
Vue.filter('normalDate',function(value){
	return moment(value).format("dddd, MMMM Do YYYY, h:mm:ss a");
});

	
	
// Main nav
Vue.component('nav-bar',{
	
	template:`
		<div>
				<ul id="slide-out" class="sidenav">
						<li><a href="#!"><i class="material-icons">cloud</i>First Link With Icon</a></li>
				    <li><a href="#!">Second Link</a></li>
				    <li><div class="divider"></div></li>
		    		<li><a class="subheader">Subheader</a></li>
				    <li><a class="waves-effect" href="#!">Third Link With Waves</a></li>
		  </ul>
		  <p v-on:click="openNav()">open</p></div>`,
	mounted(){

  // Initialize collapsible (uncomment the lines below if you use the dropdown variation)
  	 // var collapsibleElem = document.querySelector('.collapsible');
  	//  var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

	},
	methods:{
		openNav: function(){
			
				 var elem = document.querySelector('.sidenav');
  			var instance = M.Sidenav.init(elem);
  
			instance.open();
		}
	}
});


      	// <div>	Status: {{ location.attributes.STATUS }}</div>
      	// <div>	Type: {{ location.attributes.TYPE }}</div>
      	// <div>	Address: {{ location.attributes.FAC_ADDRESS }}</div>
      	// <div>	City: {{ location.attributes.CITY }}</div>
      	// <div>	CODE: {{ location.attributes.CODE }}</div>
      	// <div>	M-T: {{ location.attributes.M_T }}</div>
      	// <div>	F: {{ location.attributes.Fri }}</div>
      	// <div>	S: {{ location.attributes.Sat }}</div>
      	// <div>	Sun: {{ location.attributes.Sun }}</div>
      	// <div>	X {{ location.geometry.x }}</div>
      	// <div>	Y {{ location.geometry.y }}</div>










// List of locations

Vue.component('location-listing', {
	
	template:`<div id="locationlist" v-cloak>
      	
      					<div class="carousel">
      						<template v-for="(location,index) in libraryAllLocations">
					      		 <div class="carousel-item" :href="index">
					      					
					      			
					      			<div class="card" style="overflow: visible;">
					              <div class="card-image">
					                 <img :src="'locphotos/' + location.attributes.CODE + '.png'" :alt=location.attributes.NAME class="responsive-img" />
					              </div>
					              <div class="card-content">
					                <span class="card-title activator grey-text text-darken-4">{{ location.attributes.NAME }}<i class="material-icons right">more_vert</i></span>
					
					                <p>{{ location.attributes.CITY }}</p>
					              </div>
					              <div class="card-reveal" style="display: none; transform: translateY(0%);">
					                <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
					                <p>Here is some more information about this product that is only revealed once clicked on.</p>
					              </div>
					
					              <div class="card-action">
					                <a href="#">Make my library</a>
					              </div>
            				</div>
					      			
					      			
					      			
					      			
					      			
					      			
					      			
					      			
					      			
					      			
					      			
					      			
					      			
					      			
					      			
										  			<div>	Status: {{ location.attributes.STATUS }}</div>
										      	<div>	Type: {{ location.attributes.TYPE }}</div>
										      	<div>	Address: {{ location.attributes.FAC_ADDRESS }}</div>
										      	<div>	City: {{ location.attributes.CITY }}</div>
										      	<div>	CODE: {{ location.attributes.CODE }}</div>
										      	<div>	M-T: {{ location.attributes.M_T }}</div>
										      	<div>	F: {{ location.attributes.Fri }}</div>
										      	<div>	S: {{ location.attributes.Sat }}</div>
										      	<div>	Sun: {{ location.attributes.Sun }}</div>
										      	<div>	X {{ location.geometry.x }}</div>
										      	<div>	Y {{ location.geometry.y }}</div>
					      			</div>
							 </template>
		      	</div>
      	
      </div>`,
	
	data: function(){
		return{
		// selectedLocation:"",
		// locations:[]
		};
		
	},
	computed:{
		libraryAllLocations(){
			return JSON.parse(this.$store.state.libraryAllLocations);
		},
		favCode(){
			return this.$store.state.libraryFavCode;
		},
		favName(){
			return this.$store.state.libraryFavName;
		},
		favGeo(){
			return this.$store.state.libraryFavGeo;
		},
		favAttr(){
			return this.$store.state.libraryFavAttributes;
		}
		
	}
	// ,
	
	// created(){
		
		
	// 		axios.get("https://services1.arcgis.com/a7CWfuGP5ZnLYE7I/arcgis/rest/services/Libraries/FeatureServer/0/query?where=1%3D1&outFields=*&geometry=&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326&f=json")
 //   	.then(response => {
    		
 //   		this.locations = response.data.features;
    		
 //   	});
    		
	// 	}
	,
		mounted(){
			 var _libraryslider = document.querySelector('.carousel');
			 var _options = {
			 			fullWidth: false,
			 			dist:-100,
			 			padding:100,
				   indicators: true
					 };
		   var instance = M.Carousel.init(_libraryslider,_options);

			
		}
	
});




























// Book list
Vue.component('booklist-results',{
	
	template:`<div class="content">
							<h2>{{ resulttitle }} </h2>
								
								<div v-for="list in listing">
										{{ list.title }}
								
								</div>
							
							<h4>{{ resultsdescription }}</h4>
					</div>`,
	data: function(){
		return {
			resulttitle:"",
			listing:[ ],
			resultsdescription:""
		};
	},
	// Load up localstorage with data from WakeGov
	beforeCreate(){

			axios.get('http://aftervictory.com/domparse/wakelib-catalog-results.php?view=rss&lookfor=star+wars&basicType=Keyword&basicType=&filter[]=availability_toggle_catalog:""')
    	.then(response => {
    
    		// console.log(response.data.channel);
    		
    		this.resulttitle = response.data.channel.description;
    		this.listing = response.data.channel.item;
    		this.resultsdescription = response.data.channel.title;
    		
    	});
    		
	},
	
	
	
// https://catalog.wakegov.com/Search/Results?view=rss&lookfor=star%20wars

//  Available now - &filter[]=availability_toggle_catalog:"Available+Now"
//  Entire col - 	&filter[]=availability_toggle_catalog:""
// Available at - 	&filter[]=available_at_catalog:"Athens Drive Community"


// Details on a specific search
	// invididual listing: http://aftervictory.com/domparse/wakelib-catalog-individualbook.php?https://catalog.wakegov.com/GroupedWork/aaff1eaf-1729-da14-d03b-cdf1b7c0c171/AJAX?method=getWorkInfo

	
	
	//
	// Autocomplete http://aftervictory.com/domparse/wakelib-catalog-autosuggest.php?method=GetAutoSuggestList&searchTerm=Star%20Trek
	// http://aftervictory.com/domparse/wakelib-catalog-results.php?view=rss&lookfor=star%20trek&filter[]=availability_toggle_catalog:&filter[]=available_at_catalog
	// http://aftervictory.com/domparse/wakelib-catalog-results.php?view=rss&lookfor=star+wars&basicType=Keyword&basicType=&filter[]=available_at_catalog%3A%22Athens+Drive+Community%22&sort=relevance&searchSource=local
	
})
















// Dropdown to select location
Vue.component('location-picker', {

	template:` <div class="col s12" v-cloak>
	     	
	     	<label for="locationpicker">Choose branch</label>
	     	<select v-model="selectedlocation" id="locationpicker" class="browser-default" ref="selectlocation">
	     		<option disabled selected>Choose your branch</option>
	     		<template v-for="(city,index) in cities">
	     			<optgroup :label=city :key=city>
	
	     				<template v-for="(location,index) in locations" >
	     					<template v-if="location.attributes.CITY === city">
	     						<option :class=location.attributes.CODE v-bind:value="{code: location.attributes.CODE, name:location.attributes.NAME}" :key="location.attributes.OBJECTID">{{ location.attributes.NAME }}</option>
	     					</template>
	     					<template v-else></template>
	     				
	     				</template>
	     				
	     			</optgroup>
	     		</template>
	     	</select>
	    	
    	</div>
    	 	`,
	data: function(){
		return{
			selectedlocation:[],		// User's preferred location
			cities: [],							// All Wake County location cities
			locations: []						// List of all locations
		};
	},
	
	// Load up localstorage with data from WakeGov
	beforeCreate(){

	},

	// Get data from VUEX
	created(){
			
			let _locations = JSON.parse(this.$store.state.libraryAllLocations);
			
			this.locations = _locations;
			let _cities = [];
			
			// Extract unique cities
			for (let n of _locations) {
				
				 if(!_cities.includes(n.attributes.CITY)){
				 	_cities.push(n.attributes.CITY);
				 }
				
			} // for loop
			
			// Sets local Data for cities
			this.cities = _cities;
			

			
		},
	
		mounted(){
			// Materialize CSS for dropdown
			// var _selectbox = document.querySelector('#locationpicker');
			// var instance = M.Select.init(_selectbox);
  			
  			
			// Sets dropdown to selected
			var _selectedoption = document.querySelector("#locationpicker option." + this.$store.state.libraryFavCode);
			_selectedoption.setAttribute("selected","selected");
			
			
		},
		// When the user picks their location, set it as the preferred one
		watch:{
			selectedlocation: function(val){
				
				// Update Store with Code and Name
				store.commit('updateFavCode', val.code);
  			store.commit('updateFavName', val.name);
  			
  			
  			// Isolate the favorite location's data. Place into store.
				for(var i of JSON.parse(this.$store.state.libraryAllLocations)){
						if(i.attributes.CODE === val.code){
							
								// Phone details
								store.commit('updateLibraryFavPhone', [i.attributes.CITY, i.attributes.NAME]);
								store.commit('updateFavAttributes', i.attributes);
								store.commit('updateFavGeo',i.geometry);
						}
				} // for
  			
  			
  			// Sets dropdown to selected
  			// var _selectedoption = document.querySelector("#locationpicker option." + val.code);
  			// _selectedoption.setAttribute("selected","selected");
  			// buildMap();
  		
			}
		}
		    
});








// All locations on a map
Vue.component('location-map-all',{});




					


// Single map
Vue.component('location-map-single',{
	
	template:`<div id='libraryWrapper'>
									<div id='libraryMap'></div>
								</div>`,
	
	computed:{
		favCode(){
			return this.$store.state.libraryFavCode;
		},
		favName(){
			return this.$store.state.libraryFavName;
		},
		favGeo(){
			return this.$store.state.libraryFavGeo;
		},
		favAttr(){
			return this.$store.state.libraryFavAttributes;
		}
		
	},
	
	
	watch:{
		favCode:function(){
			
			// Delete the map
			let _deleteMap = document.getElementById('libraryMap');

			_deleteMap.remove();


			// Re-add the div for the map
			let _rebuildMap = document.getElementById('libraryWrapper');
			
			_rebuildMap.innerHTML = '<div id="libraryMap"></div>';
			
			 this.buildMap()
			
		}
	},
	methods:{
		
			// Builds map.
			buildMap: function(){

					var wakeLibrarylocationMap = L.map('libraryMap');

					wakeLibrarylocationMap.setView([this.favGeo.y, this.favGeo.x], 15);
		    
		    	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
					    attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
					    maxZoom: 18,
					    id: 'mapbox.streets',
					    accessToken: 'pk.eyJ1Ijoid2FrZWxpYnJhcnkiLCJhIjoiY2pjemcxdnZuMWduajJybnNybTg2cTExNCJ9.W53XxoDHZcyiYKj5wEhsAQ'
					}).addTo(wakeLibrarylocationMap);
					
					var wakeLibraryMarker = L.marker([this.favGeo.y, this.favGeo.x]).addTo(wakeLibrarylocationMap);
			    wakeLibraryMarker.bindPopup("<b>"+ this.favName +"</b><br>"+ this.favAttr.FAC_ADDRESS).openPopup();
		    
			 }
		
	},
	
	mounted() {
		// Map the map when the component is mounted
		this.buildMap();
	}
	
});


















// Hours component
Vue.component('my-location-hours',{
	template:`<span>Hours today: <strong>{{ todaysHours }}</strong></span>`,

	computed:{
		todaysHours(){
		
			// Finds day of the week,returns the hours
			let _dayofweek = moment().format("dddd");
		
			if (_dayofweek === 'Sunday') {
				return this.$store.state.libraryFavAttributes.Sun;
			 
			} else if (_dayofweek === 'Saturday') {
				return this.$store.state.libraryFavAttributes.Sat;
			 
			} else if (_dayofweek === 'Friday') {
				return this.$store.state.libraryFavAttributes.Fri;
				
			} else {
				return this.$store.state.libraryFavAttributes.M_T;
			}
		}
	}

});




// Phone number component
Vue.component('my-location-phone',{
	
	template:`<a :href="favPhoneLink">{{ favPhone }}</a>`,
	
	computed:{
		favPhone(){
			return this.$store.state.libraryFavPhone;
		},
		favPhoneLink(){
			return "tel:" + this.favPhone;
		}
	}

	
});








// My chosen location
Vue.component('my-location', {
	template: `
		<div v-cloak>
				
				<div class="card">
			
				<div class="card-image">
          <img :src="'locphotos/' + favCode + '.png'" :alt=favName />
        </div>
				
		    <div class="card-content">
		    	<span class="card-title">{{ favName }}</span>
		    	<p>Located at {{ favAttr.FAC_ADDRESS }}, {{ favAttr.CITY }}, North Carolina. <br /><my-location-hours></my-location-hours></p>
		    	<p><my-location-phone></my-location-phone></p>
		    </div>
		    <div class="card-tabs">
		      <ul class="tabs tabs-fixed-width">
		        <li class="tab"><a class="active" href="#today">Today</a></li>
		        <li class="tab"><a href="#location">Visit</a></li>
		        <li class="tab"><a href="#test6">Test 3</a></li>
		      </ul>
		    </div>
		    <div class="card-content grey lighten-4">
		      <div id="today"><today-at-my-library></today-at-my-library></div>
		      <div id="location"><location-map-single></location-map-single></div>
		      <div id="test6">Test 3</div>
		    </div>
		  </div>
			
			
				
      
		</div>`,
	
	computed:{
		favCode(){
			return this.$store.state.libraryFavCode;
		},
		favName(){
			return this.$store.state.libraryFavName;
		},
		favGeo(){
			return this.$store.state.libraryFavGeo;
		},
		favAttr(){
			return this.$store.state.libraryFavAttributes;
		}
		
	},
	mounted(){
			// Kick off tabs
			var elem = document.querySelector('.tabs');
  		var instance = M.Tabs.init(elem);
			
	}
		
});







// My Library events for today
Vue.component('today-at-my-library',{
	
	// Add bookclub http://www.trumba.com/calendars/booclubs.json?filterview=Book+Clubs
	
	// webworker for big file
	// get loc from localstoarage
	
	data: function(){
		return {
			events:[],
			tomorrowsDate:"",
			favoriteName:""
			
		};
	},
	template: `<div>
		<h6>Today at the {{ favoriteName }}</h6>
		
			<ul class="collection" v-for="(event,index) in events" :key="event.eventID">
				<li class="collection-item avatar">
				
		      <i class="material-icons circle">date_range</i>
		      
		      <span class="title">{{ event.title }}</span>
		      
		      <p><em>{{ event.description }}</em><br />
		         <blockquote>{{ event.dateTimeFormatted }}</blockquote>
		      </p>
		      
		      
		      
		    </li>
				
			</ul>
	</div>`,
	
	methods:{
		queryEvents: function(){
			// Queries events
			axios.get("http://aftervictory.com/domparse/wakelib-events-json.php?search=" + this.favoriteName + "&startdate="+ this.$store.state.todaysDate +"&previousweeks=0&HTML=0&days=2")
    	.then(response => {
    		
    		this.events = response.data;
    		
    	});
			
		}
	},
	
	created(){
			
			// create tomorrow's date for search
			this.tomorrowsDate = moment(this.$store.state.todaysDate).add(1,'days').format('YYYYMMDD');
			
			// our location
			this.favoriteName = localStorage.getItem("libraryLocationFavoriteName");
			
			// Query data, and update data
			this.queryEvents();

			// If the name changes, update the results
	    // bookMobile.$on('favoriteName', ($event) => {
	    //   this.favoriteName = $event;
	    //   this.queryEvents();
	    // });
	

	}
	
});







// List of events
Vue.component('events-listing', {
	
	data: function(){
		return{
			events:[]
		};
	},
	
	template: `<div>
			<dl v-for="(event,index) in events" class="content">
			<dt>{{ event.title }}</dt>
			<dd v-html="event.description"></dd>
			<dd>{{ event.startDateTime | normalDate }}</dd>
			</dl>
	</div>`,
	
		// Load up localstorage with data from WakeGov
	beforeCreate(){
	
			axios.get("http://aftervictory.com/domparse/wakelib-events-json.php?search=North Regional Library&previousweeks=0&HTML=0&weeks=2")
    	.then(response => {
    
    		// console.log(response.data);
    		
    		
    		this.events = response.data;
    		
    	});
    		
	},
	created(){
	
	}
	
});








// AskWCPL List
Vue.component('askwcpl-listing',{
		template:`
		<div id="askwcpllist" v-cloak>
      	
      	 Search control
				<div class="field is-vertical">
				  <div class="field-body">
				    <div class="field">
				      <p class="control has-icons-left">
				        <input class="input is-large" placeholder="Search AskWCPL" type="text" v-model="search" />
      				  <span class="icon is-medium is-left">
							    <i class="fa fa-search"></i>
							  </span>
				      </p>
				    </div>
				  </div>
				</div>
      	
      	
      	<template v-for="(result,index) in filteredQuestions">
      		
					<div class="card">
				    <div class="card-content" :key="result.id">
				      <div class="content" v-html>

				      	{{ result.question }}
					      <time>{{ result.askedon }}</time>

				      </div>
				    </div>
				    
				    <footer class="card-footer">
						    <p class="card-footer-item">
						      <span>
						        <a v-bind:data-id="result.id" v-bind:href="result.id" v-on:click="readAnswer()">Read More</a>
						      </span>
						    </p>
  					</footer>
  					
  					
			    </div>
			    <br />
			    
				</template>
      	
      </div>
		
		`,
		data: function(){
			return {
			search: '',
			results: []
			};
		},
		methods:{
			readAnswer: function(){
				console.log(this);
				console.log(this.key);
				
				
			}
		},
		created(){

			axios.get("http://aftervictory.com/domparse/wakelib-askwcpl-questions.php?iid=294&limit=500&showans=0&showdet=0&format=json")
    	.then(response => {
    		// console.log(response);
    		this.results = response.data.answers});
			
		},
		computed:
		{
		    filteredQuestions:function()
		    {
		    	 var self=this;
		       return this.results.filter(function(cust){return cust.question.toLowerCase().indexOf(self.search.toLowerCase())>=0;});
		       //return this.customers;
		    }
		}
			
	
 });



























// AskWCPL Answer
Vue.component('askwcpl-answer', {
	
		template: `<div><div v-for="(result,index) in results">
      		
					<div class="card">
				    <div class="card-content" :key="result.id">
				      <div class="content" v-html>

				      	<h2 v-html="result.question"></h2>
					      <time>{{ result.askedon }}</time>
					      <div v-html="result.answer"></div>
					      <div v-html="result.video"></div>
							<span>
						        <a v-bind:data-id="result.id" v-bind:href="result.id" v-on:click="readAnswer()">Read More</a>
						      </span>
						      
				      </div>
				    </div>
				    

  					
			    </div>
				</div></div>`,
		data: function(){
			return {
				results: []
			};
			
		},
		methods:{
			readAnswer: function(){
			
				
			}
		},
		created(){

			axios.get("http://aftervictory.com/domparse/wakelib-askwcpl-questions.php?iid=294&limit=500&showans=1&showdet=0&format=json")
    	.then(response => {
    		// console.log(response);
    		this.results = response.data.answers});
			
		}
});






// VUEX for state management!
const store = new Vuex.Store({
	//strict: true,
  state: {
  	todaysDate: moment().format('YYYYMMDD'),
  	libraryFavPhone: "",
    libraryFavCode: "",
    libraryFavName:	"",
    libraryFavAttributes:[],
    libraryFavGeo:[],
    libraryAllLocations:[]
    
  },
  // retrieves a value
  getters: {
    getlibraryFavCod: state => {
      return state.libraryFavCod;
    }
  },
  mutations: {
  	// update library phone
  	updateLibraryFavPhone(state,payload){

  	 		axios.get("https://api.foursquare.com/v2/venues/search?limit=1&near=" + payload[0] + ",NC&query=" + payload[1] + "&oauth_token=QEHZWEFD4SFPLQNTSI5QYTX52IMG4EFOU0BXWB1OSXRVFXLM&v=20180123" /* + this.$store.state.todaysDate */)
	    	.then(response => {
	    		
	    		var _response = response.data.response.venues[0].contact.phone
	    		
	    		// Format phone number
	    		function formatPhone(phonenum) {
					    var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
					    if (regexObj.test(phonenum)) {
					        var parts = phonenum.match(regexObj);
					        var phone = "";
					        if (parts[1]) { phone += "(" + parts[1] + ") "; }
					        phone += parts[2] + "-" + parts[3];
					        return phone;
					    }
					    else {
					        console.log("Invalid phone number in data feed")
					        return phonenum;
					    }
					};
	        
	    	// Save to local storage
    		localStorage.setItem("libraryLocationFavoritePhone", formatPhone(_response));
		  	// Add to store
		  	store.commit('updateFavPhone', formatPhone(_response));
	    		
 	
	  	});
  		
  	},
  	// Update Favorite Code state and localstorage
    updateFavCode (state,payload) {
      state.libraryFavCode = payload;
      localStorage.setItem("libraryLocationFavoriteCode",payload);
    
    },
  	// Update Favorite Name
    updateFavName (state,payload) {
      state.libraryFavName = payload;
    	localStorage.setItem("libraryLocationFavoriteName",payload);
    },
    // Update Favorite phone
    updateFavPhone (state,payload) {
      state.libraryFavPhone = payload;
    	localStorage.setItem("libraryLocationFavoritePhone",payload);
    },
    // Update Favorite Attributes
    updateFavAttributes (state,payload){
    	//localStorage.removeItem("libraryLocationFavoriteAttributes");
    	state.libraryFavAttributes = payload;
    	localStorage.setItem("libraryLocationFavoriteAttributes",JSON.stringify(payload));
    },
    // Update Favorite Geocoordinates
    updateFavGeo (state,payload){
  		//localStorage.removeItem("libraryLocationFavoriteGeo");
    	state.libraryFavGeo = payload;
    	localStorage.setItem("libraryLocationFavoriteGeo",JSON.stringify(payload));
    },
    // Update All Locations
    updateAllLocations	(state,payload){
    	state.libraryAllLocations = payload;
    	localStorage.setItem("libraryLocations",payload);
    }
    
    
    // ,
    // addArry(state,payload){
    // 	state.myarray.push(payload)
    // }
  }
});






//Root Instance
var wakeLibrary = new Vue({
  el: '#library',
  store,
  beforeCreate(){

  	// Convert Local storage to arrays
  	// to prevent stringify localstorage loop
  	var _geoArray = localStorage.getItem('libraryLocationFavoriteGeo');
  	var _favArray = localStorage.getItem('libraryLocationFavoriteAttributes');
  	
  	// Load up VUEX store with Localstorage items
  	store.commit('updateFavCode', localStorage.getItem('libraryLocationFavoriteCode'));
  	store.commit('updateFavName', localStorage.getItem('libraryLocationFavoriteName'));
  	store.commit('updateAllLocations', localStorage.getItem('libraryLocations'));
  	store.commit('updateFavAttributes',  JSON.parse(_favArray));
		store.commit('updateFavGeo', JSON.parse(_geoArray));
   	store.commit('updateFavPhone', localStorage.getItem('libraryLocationFavoritePhone'));
		
  },
  created(){
  	
  	 // Get locations
  	 axios.get("https://services1.arcgis.com/a7CWfuGP5ZnLYE7I/arcgis/rest/services/Libraries/FeatureServer/0/query?where=1%3D1&outFields=*&geometry=&geometryType=esriGeometryEnvelope&orderByFields=CITY&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326&f=json")
    	
    	.then(response => {
    
    		// Save to local storage
    		localStorage.setItem('libraryLocations', JSON.stringify(response.data.features));
		  	// And store
		  	store.commit('updateAllLocations', JSON.stringify(response.data.features));
 	
    	});


  },
  mounted(){
  	// Access anything in the store
		// console.log("name " + this.$store.state.libraryFavName)
		// console.log("code " + this.$store.state.libraryFavCode)
		// console.log("locs " + this.$store.state.libraryAllLocations)


		

  }
});