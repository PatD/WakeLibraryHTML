// Wake County Libraries JS

// todo:

	// Book club - filter by library
	// Today's events w/with filter
	// Add book clubs
	// ics.js
	// maps all loc
	// Book search
	// Offline store images
	


// Global filter to make dates not weird
Vue.filter('normalDate',function(value){
	return moment(value).format("dddd, MMMM Do YYYY, h:mm:ss a");
});




// Twitter embed
Vue.component('twitter-embed',{
	template:`<div class="box"><h4>On twitter</h4><a class="twitter-timeline" data-tweet-limit="3" data-lang="en" data-dnt="true" data-cards="hidden" data-chrome="noheader nofooter noborders transparent" href="https://twitter.com/wcplonline">Tweets by wcplonline</a></div>`,

	beforeCreate(){
		
			var twitterScript = document.createElement('script');
      twitterScript.setAttribute('src', 'https://platform.twitter.com/widgets.js');
      // twitterScript.setAttribute('async');
      
      document.body.appendChild(twitterScript);

	}
	
});
	
	
	
// Facebook Embed
Vue.component('facebook-embed',{
	template:`<div>
							<div id="fb-root"></div>
							<div class="fb-page"
								data-href="https://www.facebook.com/wcplonline"
								data-tabs="timeline"
								data-small-header="true"
								data-adapt-container-width="true"
								data-hide-cover="false"
								data-show-facepile="false"
								data-hide-cta="true"
								>
								<blockquote cite="https://www.facebook.com/wcplonline" class="fb-xfbml-parse-ignore">
									<a href="https://www.facebook.com/wcplonline">Wake County Public Libraries</a>
								</blockquote>
							</div>
						
						</div>`,
						
	created(){
		// Facebook embed
		(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId=281211761941863&autoLogAppEvents=1';
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
		
	}
});



// Social Tabs
Vue.component('social-tabs',{
	template:` <div class="row">
						   <div class="col s12">
						      <ul class="tabs">
						        <li class="tab col s3"><a href="#test1">Twitter</a></li>
						        <li class="tab col s3"><a href="#test2">Facebook</a></li>
						      </ul>
						    </div>
						    <div id="test1" class="col s12"><twitter-embed></twitter-embed></div>
						    <div id="test2" class="col s12"><facebook-embed></facebook-embed></div>
						 </div>`,
	mounted(){
			// Kick off tabs
			var _socialTabs = document.querySelector('.tabs');
			
  		var instance = M.Tabs.init(_socialTabs);
			
	}

	
});




// Main location setter
// Shows user the carousel if they haven't picked a location
Vue.component('mainloc-setter',{
	template:`<div>
	
		<template v-if="favCode === null || favCode === 'null' || favCode === undefined">
			<location-listing></location-listing>
			<askwcpl-topfive></askwcpl-topfive>
		</template>

		<template v-else>
			<location-picker></location-picker>
      <my-location></my-location>
      <askwcpl-topfive></askwcpl-topfive>
		</template>
	
	</div>
	`,
	
	computed:{
		favCode(){
			return this.$store.state.libraryFavCode;
		}
	}
});






// Carousel of locations
Vue.component('location-listing', {
	
	template:`<div id="locationlist" v-cloak>
      					<h5>Wake County Library Branches</h5>
      					
      					<div class="carousel">
      						<template v-for="(location,index) in libraryAllLocations">
					      		 <div class="carousel-item" :href="index">
					      			
					      			<div class="card" style="overflow: visible;">
					              <div class="card-image">
					                 <img :src="'locphotos/' + location.attributes.CODE + '.png'" :alt=location.attributes.NAME class="responsive-img" />
					              </div>
					              <div class="card-content">
					              	<span>{{ location.attributes.CITY }}</span>
					                <span class="card-title activator grey-text text-darken-4">{{ location.attributes.NAME }}<i class="material-icons right">more_vert</i></span>
					              </div>
					              
					              <div class="card-reveal" style="display: none; transform: translateY(0%);">
					                <span class="card-title grey-text text-darken-4">{{ location.attributes.NAME }}<i class="material-icons right">close</i></span>
					                <p>{{ location.attributes.STATUS }}</p>
					                <p>{{ location.attributes.FAC_ADDRESS }} <br />{{ location.attributes.CITY }}, NC</p>
					              </div>
					
					              <div class="card-action">
					              	<button class="waves-effect waves-light btn" v-on:click="makeFavorite(location.attributes.CODE,location.attributes.NAME)"><i class="material-icons right">check_box</i>Make My Library</button>
					              </div>
            					</div>
					      		
						      	</div>
								 </template>
			      	</div>
      	
      </div>`,
      
	methods:{
		
		// Makes a location the user's favorite
		makeFavorite: function(CODE,NAME){
			
				store.commit('updateFavCode', CODE);
  			store.commit('updateFavName', NAME);
  			
  			// Isolate the favorite location's data. Place into store.
				for(var i of this.$store.state.libraryAllLocations){
						if(i.attributes.CODE === CODE){
							
								// Phone details
								store.commit('updateLibraryFavPhone', [i.attributes.CITY, i.attributes.NAME]);
								store.commit('updateFavAttributes', i.attributes);
								store.commit('updateFavGeo',i.geometry);
						}
				} // for
  
		},
		
		// Makes the carousel
		makeCarousel: function(){
			
			 var _libraryslider = document.querySelector('.carousel');
			 var _options = {
			 			// fullWidth: false,
			 			//dist:-100,
			 			//padding:50,
				   //indicators: false
					 };
		    M.Carousel.init(_libraryslider,_options);
		}
	},
	computed:{
		libraryAllLocations(){
			return this.$store.state.libraryAllLocations;
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
		
	},
		updated(){
			this.makeCarousel();
	},
	watch:{
		libraryAllLocations:function(){
			this.makeCarousel();
		}
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
	
});
















// Dropdown to select location
Vue.component('location-picker', {

	template:` <div class="col s12" v-cloak>
	     	
	     	<label for="locationpicker">Choose branch</label>
	     	<select v-model="selectedlocation" id="locationpicker" class="browser-default" ref="selectlocation">
	     		<option disabled selected>Choose your branch</option>
	     		<template v-for="(city,index) in cities">
	     			<optgroup :label=city :key=city>
	
	     				<template v-for="(location,index) in allLocations" >
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
			cities: []							// All Wake County location cities
		};
	},
	
	// Load up localstorage with data from WakeGov
	beforeCreate(){

	},
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
			allLocations(){
				return this.$store.state.libraryAllLocations;
			}
	},
	// Get data from VUEX
	created(){
			
			let _cities = [];
			
			// Extract unique cities
			for (let n of this.allLocations) {
				
				 if(!_cities.includes(n.attributes.CITY)){
				 	_cities.push(n.attributes.CITY);
				 }
				
			}
			
			// Sets local Data for cities
			this.cities = _cities;
			
		},
	
		updated(){
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
				for(var i of this.$store.state.libraryAllLocations){
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
Vue.component('location-map-all',{
	template:`<div><h5>Find a branch near you</h5><div id="allLocationsMap"></div></div>`,

	mounted(){
	//	this.buildMap();
	},

	

	data: function(){
		return {
			geoJSON:"",
			latlong:[]
		};
	},
	created(){
		
		
		// Find user's locations
		if ("geolocation" in navigator) {
		  /* geolocation is available */
		  
		  var _options = {
			  enableHighAccuracy: false,
			  timeout: 15000,
			  maximumAge: 0
			};
			
			function success(pos) {
			  var crd = pos.coords;
			
			  console.log('Your current position is:');
			  console.log(`Latitude : ${crd.latitude}`);
			  console.log(`Longitude: ${crd.longitude}`);
			  console.log(`More or less ${crd.accuracy} meters.`);
			};
			
			function error(err) {
			  console.warn(`ERROR(${err.code}): ${err.message}`);
			};
			
			navigator.geolocation.getCurrentPosition(success, error, _options);
		  
		  
		  this.latlong = [];
		  
		  
		  
		  
		} else {
			
		  // geolocation IS NOT available, so you know, Raleigh
		  this.latlong = [35.7796, -78.6382];
		}
		
	},
	beforeCreate(){
		
		axios.get("https://opendata.arcgis.com/datasets/78bb0b6b28ce496e8bfb604e00318059_0.geojson")
    	.then(response => {
    		// Save into this component's data
    		this.geoJSON = response.data.features;
    		this.buildMap();
    	});
	},
	methods:{
		
			// Builds map.
			buildMap: function(){

				// DOM element for map
				var wakeLibraryAllLocationsMap = L.map('allLocationsMap');

				//  data
				console.log(this.geoJSON);
				
				var geojsonMarkerOptions = {
			    radius: 8,
			    fillColor: "#ff7800",
			    color: "#000",
			    weight: 1,
			    opacity: 1,
			    fillOpacity: 0.8,
				};
							
				// Ask user for loc and set there?
				wakeLibraryAllLocationsMap.setView([35.7796, -78.6382], 10);



				function onEachFeature(feature, layer) {
				    
				    // Click event for each location
				    layer.on('click',function(e){
				    	
				    	// Centers map around point.
				    	let _lat = e.latlng.lat + 0.08,  // Nudges things a little to fit it on the screen
				    			_lng = e.latlng.lng;
				    	
			    		wakeLibraryAllLocationsMap.setView([_lat,_lng], 10);
				    });
				    
				    
				   // console.log(feature.properties.NAME)
				   var libaryPopup =
				   		`<div class="row">
				   			<div class="col s12">
				   				<img class="z-depth-2" src="/locphotos/` + feature.properties.CODE + `.png" style="width:inherit;" alt="Photo of `+ feature.properties.NAME +`" />
									<h6>` + feature.properties.NAME + `</h6>
				   				<span>` + feature.properties.FAC_ADDRESS + `, ` + feature.properties.CITY + `</span><br/><br/>
				   				
				   				<a class="waves-effect waves-light btn-small" style="color:#fff" href="/branch/`+ feature.properties.CODE +`">Details</a>
				   				<a class="waves-effect waves-light btn-small cyan accent-5" style="color:#fff" target="_blank"
				   				href="https://maps.apple.com/?ll=`+ feature.geometry.coordinates[1] +`,` + feature.geometry.coordinates[0] +`">Directions</a>
			   				</div>
		   				</div>`;
				   
				    
				    
				    layer.bindPopup(libaryPopup).openPopup();
				    
				    if (feature.properties && feature.properties.popupContent) {
				        layer.bindPopup(feature.properties.popupContent);
				    }
				    
				    
				    
				};

				
			

				
				// Assign GEOJSON data to map
				L.geoJSON(this.geoJSON,
				
				{
					onEachFeature: onEachFeature,
					
					style: function(feature) {
		        switch (feature.properties.TYPE) {
		            case 'Branch and Regional Libraries': return {color: "#ffffff"};
		            case 'Specialty': return {color: "#ff0000",fillColor:"#ffffff"};
					        }
			    },
							
							
							
							
							
						pointToLayer: function (feature, latlng) {
				      return L.circleMarker(latlng, geojsonMarkerOptions);
				    }
					
				}).addTo(wakeLibraryAllLocationsMap);

				
		  	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
					    attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
					    maxZoom: 18,
					    minZoom:5,
					    id: 'mapbox.streets',
					    accessToken: 'pk.eyJ1Ijoid2FrZWxpYnJhcnkiLCJhIjoiY2pjemcxdnZuMWduajJybnNybTg2cTExNCJ9.W53XxoDHZcyiYKj5wEhsAQ'
					}).addTo(wakeLibraryAllLocationsMap);
					
					// var wakeLibraryMarker = L.marker([this.favGeo.y, this.favGeo.x]).addTo(wakeLibrarylocationMap);
			  //   wakeLibraryMarker.bindPopup("<b>"+ this.favName +"</b><br>"+ this.favAttr.FAC_ADDRESS).openPopup();
		    
			 }
		
	}
});




					


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
	},
	updated() {
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
          <img :src="'/locphotos/' + favCode + '.png'" :alt=favName />
        </div>
				
		    <div class="card-content">
		    	<span class="card-title">{{ favName }}</span>
		    	<p>Located at {{ favAttr.FAC_ADDRESS }}, {{ favAttr.CITY }}, North Carolina. <br />
		    		<my-location-hours></my-location-hours></p>
		    	<p>
		    		<my-location-phone></my-location-phone></p>
		    </div>
		    <div class="card-tabs">
		      <ul class="tabs tabs-fixed-width">
		        <li class="tab"><a href="#today">Today</a></li>
		        <li class="tab"><a href="#location">Visit</a></li>
		        <li class="tab"><a href="#bookclub">Book Club</a></li>
		      </ul>
		    </div>
		    <div class="card-content grey lighten-4">
		      <div id="today"><today-at-my-library></today-at-my-library></div>
		      <div id="location"><location-map-single></location-map-single></div>
		      <div id="bookclub"><bookclub-my-library></bookclub-my-library></div>
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





// My Library Bookclub events
Vue.component('bookclub-my-library',{
	
	data: function(){
		return {
			events:[],
		};
	},
	template: `<div>
		<h6>Upcoming Book Club and Discussion Meetings at the {{ favName }}</h6>
		
			<ul class="collection" v-for="(event,index) in events" :key="event.eventID">
				
				<bookclub-entry
					:title="event.title"
					:location="event.location"
					:description="event.description"
					:dateTimeFormatted="event.dateTimeFormatted">
				</bookclub-entry>
				
			</ul>
	</div>`,
	
	methods:{
		
		queryBookClubEvents: function(){
			
			
			
			// Queries bookclub events
			axios.get("http://aftervictory.com/domparse/wakelib-bookclub-json.php?filterview=Book+Clubs&search=" + this.favName + "&startdate="+ this.todayDate +"&previousweeks=0&HTML=0&days=32")
    	.then(response => {
    		
    		this.events = response.data;
    		
    	});
			
		}
		
	},
	computed:{
		favName(){
			return this.$store.state.libraryFavName;
		},
		todayDate(){
			return this.$store.state.todaysDate;
		}
	},
	created(){
			this.queryBookClubEvents();
	},
	watch:{
		favName:function(){
			this.queryBookClubEvents();
		}
	}
	
});






// My Library events for today
Vue.component('today-at-my-library',{

	data: function(){
		return {
			events:[],
		};
	},
	template: `<div>
		<h6>Today at the {{ favName }}</h6>
		
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
			axios.get("http://aftervictory.com/domparse/wakelib-events-json.php?search=" + this.favName	 + "&startdate="+ this.todayDate +"&previousweeks=0&HTML=0&days=1")
    	.then(response => {
    		
    		this.events = response.data;
 
    	});
		}
		
	},
	computed:{
		favName(){
			return this.$store.state.libraryFavName;
		},
		todayDate(){
			return this.$store.state.todaysDate;
		}
	},
	created(){
			this.queryEvents();
	},
	watch:{
		favName:function(){
			this.queryEvents();
		}
	}
	
});
















// Modals for AskWCPL
Vue.component('askwcpl-modal',{
	template:`<div id="modalAsckWCPL" class="modal modal-fixed-footer">
					<div class="modal-content">
					  <h4 v-html="question"></h4>
					  <p v-html="answer"></p>
					</div>
					<div class="modal-footer">
					  <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Close</a>
					</div>
				</div>`,
   props: ['question','answer']
});





// Top 5 AskWCPL
Vue.component('askwcpl-topfive',{
	template:`<div>
		<br /><h5>Ask WCPL</h5>

		<div class="collection">
				<template v-for="(question,index) in topFiveQuestions">
				<a href="#modalAsckWCPL" v-on:click="updateModal(question.id,question.question)" class="collection-item modal-trigger" v-html="question.question"></a>
				</template>
		</div>
		
		<router-link to="/askwcpl" class="waves-effect waves-light btn">All Answers</router-link>

		
    <askwcpl-modal
    	:question="question"
    	:answer="answer">
  	</askwcpl-modal>
        
		
		
	</div>`,
	data: function(){
		return {
			question: '',
			answer: '',
			id:''
			};
		},
	
	computed:{
		
		topFiveQuestions(){
			return this.$store.state.askwctop5;
		},
		allAskWCPLQuestions(){
			return this.$store.state.askwcplDB;
		}

			
	},
	methods:{
		// On click, populate the modal from larger db
			updateModal: function(_ID,_QUESTION){
				this.question = _QUESTION;
				this.id = _ID;
				
				for(_a of this.allAskWCPLQuestions){
					if(_a.id === _ID){
						this.answer = _a.answer
						return
					}
				};
				
			}
	},
	updated(){
		// Modal code
		  var elem = document.querySelector('.modal');
			var instance = M.Modal.init(elem);
	},
	beforeCreate(){
			// Query the top 5 most popular
			axios.get("http://aftervictory.com/domparse/wakelib-askwcpl-questions.php?iid=294&limit=5&showans=0&showdet=0&format=json&type=popular")
    	.then(response => {
    		store.commit('updatetopFiveaskWCPL',response.data.answers);
    	});

	}
	
});











// AskWCPL Page Full Listing
Vue.component('askwcpl-listing',{
		template:`
		<div id="askwcpllist" v-cloak>
				
     <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">search</i>
          <textarea v-model="search" id="icon_prefix2" class="materialize-textarea"></textarea>
          <label for="icon_prefix2">Search Questions...</label>
        </div>
      </div>
		   	
			<div class="collection">
				<template v-for="(result,index) in filteredList">
	      	<a class="collection-item modal-trigger" href="#modalAsckWCPL" v-on:click="updateModal(result.id,result.question)" v-html=result.question :key="result.id"></a>
	    	</template>
	    </div>
	    
	    
	    <askwcpl-modal
	    	:question="question"
	    	:answer="answer">
    	</askwcpl-modal>
		    
    </div>
		`,
		data: function(){
			return {
				
			search: '',
			question: '',
			answer: '',
			id:''
			};
		},
		methods:{
			// On click, populate the modal from larger db
				updateModal: function(_ID,_QUESTION){
					this.question = _QUESTION;
					this.id = _ID;
					
					for(_a of this.allAskWCPLQuestions){
						if(_a.id === _ID){
							this.answer = _a.answer
							return
						}
					};
					
				}
		},
		mounted(){
			// Modal code
			  var elem = document.querySelector('.modal');
				var instance = M.Modal.init(elem);
		},
		created(){
			
		},
		computed:{
			
			allAskWCPLQuestions(){
				return this.$store.state.askwcplDB;
				
			},
			filteredList() {
				if(this.$store.state.askwcplDB){
					return this.$store.state.askwcplDB.filter(result => {
        	return result.question.toLowerCase().includes(this.search.toLowerCase())
	      })
				}
      	
	    }
			
		}
	
 });








































// Main nav
Vue.component('nav-bar',{
	template:`<div>
	
	 <a v-on:click="openNav()" class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">subject</i></a>
		<ul id="slide-out" class="sidenav sidenav-fixed">
		 
			<li><router-link to="/">Home</router-link></li>
			<li><router-link to="/locations/">All branches</router-link></li>
			<li><router-link to="/search/books">Search Books</router-link></li>
			<li><router-link to="/askwcpl">Ask WCPL</router-link></li>
			<li><router-link to="/events">Events</router-link></li>
			<li><router-link to="/events/bookclubs">Book Clubs</router-link></li>
			<li><router-link to="/social">Social Media!</router-link></li>
			<li><a href="http://guides.wakegov.com/">Guides</a></li>
		
			<li class="no-padding">
				<ul class="collapsible collapsible-accordion"> <!-- acrodian -->
				  <li>
				    <a class="collapsible-header">Branches<i class="material-icons">arrow_drop_down</i></a>
				    <div class="collapsible-body">
				      <ul v-for="(city,index) in cities">
				    		
				    			<li><a class="subheader" :key=city>{{ city }}</a></li>
				
				     				<template v-for="(location,index) in allLocations" >
				     					<li v-if="location.attributes.CITY === city">
				     						<router-link v-bind:to="'/branch/' + location.attributes.CODE" :key="location.attributes.OBJECTID">{{ location.attributes.NAME }}</router-link>
				     					</li>
				     					<li v-else></li>
				     				</template>
				     				
				     		</ul>
				    </div>
				  </li>
				</ul>
			</li>
		</ul>
		  
		   

	</div>`,
	mounted(){


	},
	methods:{
		openNav: function(){
			
				// sidenav
				var _sidenav = document.querySelector('.sidenav');
  			var __sidenavinstance = M.Sidenav.init(_sidenav);
  			
  			// expand branches
  			 var _sidenavcollapsible = document.querySelector('.collapsible');
				 var _sidenavcollapsibleinstance = M.Collapsible.init(_sidenavcollapsible);
  
			__sidenavinstance.open();
		}
	},
	
	data: function(){
		return{
			cities: []							// All Wake County location cities
		};
	},
	
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
			allLocations(){
				return this.$store.state.libraryAllLocations;
			}
	},
	// Get data from VUEX
	created(){
			
			let _cities = [];
			
			// Extract unique cities
			
			if(this.allLocations){
			
				for (let n of this.allLocations) {
					
					 if(!_cities.includes(n.attributes.CITY)){
					 	_cities.push(n.attributes.CITY);
					 }
					
				}
			
			}
			
			// Sets local Data for cities
			this.cities = _cities;
			
		},
});










// Book club individual entry
Vue.component('bookclub-entry',{
	template:`<li class="collection-item avatar">
							<i class="material-icons circle">library_books</i>
				      <span class="title" v-text="title"></span>
				      <p><strong v-text="location"></strong></p>
				      <p><em v-text="description"></em><br />
				         <blockquote v-text="dateTimeFormatted"></blockquote>
				      </p>
				    </li>`,
   props: ['title','location','description','dateTimeFormatted']
});









// Book Club main page
Vue.component('bookclub-fulllist',{
	template:`
		<div>
			<h5>Wake County Library Book Clubs & Discussions</h5>
			<location-picker></location-picker>


			<template v-if="favCode === null || favCode === 'null' || favCode === undefined">
		
			<ul class="collection" v-for="(event,index) in libraryBookClubsAll" :key="event.eventID">

				<bookclub-entry
					:title="event.title"
					:location="event.location"
					:description="event.description"
					:dateTimeFormatted="event.dateTimeFormatted">
				</bookclub-entry>

			</ul>
			
			

			</template>
		
		
		<template v-else>
			<ul class="collection" v-if="favName === event.location" v-for="(event,index) in libraryBookClubsAll" :key="event.eventID">

				<bookclub-entry
					:title="event.title"
					:location="event.location"
					:description="event.description"
					:dateTimeFormatted="event.dateTimeFormatted">
				</bookclub-entry>

			</ul>
		</template>





	</div>`,
	created(){
		// Query full list.  Add to state.  Store in local
		
		// Queries bookclub events
			axios.get("http://aftervictory.com/domparse/wakelib-bookclub-json.php?filterview=Book+Clubs&startdate="+ this.todayDate +"&previousweeks=0&HTML=0&days=32")
    	.then(response => {
    		
    		
    		 console.log(response.data)
  			store.commit('updatelibraryBookClubsAll', response.data);
		  
    	});
		
		
	},
	computed:{
		libraryBookClubsAll(){
			return this.$store.state.libraryBookClubsAll;
			
		},
		favCode(){
			return this.$store.state.libraryFavCode;
		},
		favName(){
			return this.$store.state.libraryFavName;
		},
		
	}
	
	
});





















// VUEJS Router

// Define route components
const wakeHome =					{ template: '<mainloc-setter></mainloc-setter>'}
const searchBooks = 			{ template: '<div>Book Search!</div>' }
const alllocations =			{ template:	'<location-map-all></location-map-all>'}
const individualBranch =	{ template: '<div>BRANCH {{ $route.params.branch }}<my-location></my-location></div>' }
const askwcpl = 					{ template: '<askwcpl-listing></askwcpl-listing>' }
const eventsAll = 				{ template: '<div>All Events</div>' }
const bookclubs = 				{ template: '<bookclub-fulllist></bookclub-fulllist>' }
const socialmedia = 			{ template: '<social-tabs></social-tabs>' }



// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
	{ path: '/', component: wakeHome },
	{ path: '/search/books', component: searchBooks },
	{ path: '/locations', component: alllocations },
	{ path: '/branch/:branch', component: individualBranch},
	{ path: '/askwcpl', component: askwcpl},
	{ path: '/events', component: eventsAll},
	{ path: '/events/bookclubs', component: bookclubs},
	{ path: '/social', component: socialmedia},
]


// Our VueRouter
const router = new VueRouter({
	mode: 'history',
  routes // short for `routes: routes`
});


// Router events
router.afterEach((to, from) => {

  // Fires upon successful navigation
  // Close the nav
  var _navOverlay = document.querySelectorAll("div.sidenav-overlay")[0]
  
  if(_navOverlay !== undefined){
  	_navOverlay.click()
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
    libraryAllLocations:[],
    askwcplDB:[],
    askwctop5:[],
    libraryBookClubsAll:[]
    
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
    updateAllLocations(state,payload){
    	state.libraryAllLocations = payload;
    	localStorage.setItem("libraryLocations",JSON.stringify(payload));
    },
    // Update All AskWCPL
    updateAllaskWCPL(state,payload){
    	state.askwcplDB = payload;
  		localStorage.setItem('askwcpl',JSON.stringify(payload));
    },
    // Update top5 AskWCPL
    updatetopFiveaskWCPL(state,payload){
    	state.askwctop5 = payload;
  		localStorage.setItem('askTopFivewcpl',JSON.stringify(payload));
    },
    // Update all Book Clubs!
    updatelibraryBookClubsAll(state,payload){
    	state.libraryBookClubsAll = payload;
    	localStorage.setItem('libraryBookClubsAll',JSON.stringify(payload));
    }
    
  }
});






//Root Instance
const wakeLibrary = new Vue({
  el: '#library',
  store,
  router,
  beforeCreate(){

		// Populate the VUEX with anything in localstorage:

  	// Convert Local storage to arrays
  	// to prevent stringify localstorage loop
  	var _geoArray = localStorage.getItem('libraryLocationFavoriteGeo');
  	var _favArray = localStorage.getItem('libraryLocationFavoriteAttributes');
  	
  	// Load up VUEX store with Localstorage items
  	store.commit('updateFavCode', localStorage.getItem('libraryLocationFavoriteCode'));
  	store.commit('updateFavName', localStorage.getItem('libraryLocationFavoriteName'));
  	store.commit('updateAllLocations', JSON.parse(localStorage.getItem('libraryLocations')));
  	store.commit('updateFavAttributes',  JSON.parse(_favArray));
		store.commit('updateFavGeo', JSON.parse(_geoArray));
   	store.commit('updateFavPhone', localStorage.getItem('libraryLocationFavoritePhone'));
		store.commit('updateAllaskWCPL', localStorage.getItem('updateAllaskWCPL'));
		store.commit('updatelibraryBookClubsAll', JSON.parse(localStorage.getItem('libraryBookClubsAll')));
		
	
		
		
  },
  created(){
  	
  	 // Get locations
		axios.get("https://services1.arcgis.com/a7CWfuGP5ZnLYE7I/arcgis/rest/services/Libraries/FeatureServer/0/query?where=1%3D1&outFields=*&geometry=&geometryType=esriGeometryEnvelope&orderByFields=CITY&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326&f=json")
  
	//	axios.get("locationsbackup.json")
  
    	.then(response => {
      	store.commit('updateAllLocations', response.data.features);
		  	
		  	
 	
		}).catch(function (error) {
    		
		    console.log("Loading locations " + error);
		  
		  		axios.get("locationsbackup.json").then(response => {
		  			store.commit('updateAllLocations', response.data.features);
		  		})
		  
		});
    	


  },
  mounted(){
  	
  	
  		// Load AskWCPL DB
			axios.get("http://aftervictory.com/domparse/wakelib-askwcpl-questions.php?iid=294&limit=500&type=popular&showans=1&showdet=0&format=json")
    	.then(response => {
    		
				// Store in VUEX
  			store.commit('updateAllaskWCPL', response.data.answers);
 	  		
    	});
  	
  	
  	// Checks for favorite on load.
  	
  	// if(this.$store.state.libraryFavCode !="null"){
  		
  	// 	console.log("Fav exists")
  		
  	// }else{
  	// 	console.log("No fav yet")
  	// }
  	
  	
  	// Access anything in the store
		// console.log("name " + this.$store.state.libraryFavName)
		// console.log("code " + this.$store.state.libraryFavCode)
		// console.log("locs " + this.$store.state.libraryAllLocations)

  }
});