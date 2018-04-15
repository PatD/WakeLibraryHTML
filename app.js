// Wake County Libraries JS

// todo:

	// props to phone nubmer component
	// Fix map on location change on home screen
	// Use vuetify? https://vuetifyjs.com/en/components/cards
	// Lazy load images https://alligator.io/vuejs/progressive-image-rendering/?utm_campaign=VueJS%2BRadar&utm_medium=email&utm_source=VueJS_Radar_37

	// map book icons for each location
	// book search
	// All pages add h2
	// Make events-all page.  Show all. Filter by library. Default to fave.  Today, tomorrow
	// Book club - add message for nothing at a library. Default to fav
	// Branch page
		// make homepage img+address into component
		// add img+address compontent to branch pages
		// Make events calendar accept date input
		// Add map to branch page. Make it accept URL parameter









// Dropdown to select location
Vue.component('location-picker', {

	template:` <div class="col s12" v-cloak>
	     	
	     	<label for="locationpicker">Choose branch</label>
	     	<select v-model="selectedlocation" id="locationpicker" class="browser-default" ref="selectedlocation">
	     		<option disabled>Choose your branch</option>
	     		<template v-for="(city,index) in cities">
	     			<optgroup :label=city :key=city>
	
	     				<template v-for="(location,index) in allLocations">
	     					<template v-if="location.attributes.CITY === city">
	     						<option
	     							:class=location.attributes.CODE
	     							v-bind:value="location.attributes.CODE"
	     							:key="location.attributes.OBJECTID">{{ location.attributes.NAME }}</option>
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
	methods:{
		
		// Sets dropdown to favorite/selected
		selectSetFav: function(){
			
			var _selectedoption = document.getElementsByClassName(this.$store.state.libraryFavCode);
			_selectedoption[0].setAttribute("selected",true);
	
		},
		
		// Sets cities for dropdown
		setCities: function(){
			
			let _cities = [];
			
			// Extract unique cities
			for (let n of this.allLocations) {
				
				 if(!_cities.includes(n.attributes.CITY)){
				 	_cities.push(n.attributes.CITY);
				 }
				
			}
			
			// Sets local Data for cities
			this.cities = _cities;
		}
		
		
	},
	// Gets cities for dropdown
	created(){
		this.setCities();
	},
	updated(){
		this.selectSetFav();
	},

		// When the user picks their location, set it as the preferred one
		watch:{

			selectedlocation: function(val){
			 // Update Store with Code and Name
				store.commit('updateFavCode', val);
  			
  		 	// Identify the favorite location's data. Place into Vuex store.
				for(var i of this.$store.state.libraryAllLocations){
						if(i.attributes.CODE === val){
								// Name
								store.commit('updateFavName', i.attributes.NAME);
							
								// Phone details
								store.commit('updateLibraryFavPhone', [i.attributes.CITY, i.attributes.NAME]);
								store.commit('updateFavAttributes', i.attributes);
								store.commit('updateFavGeo',i.geometry);
						}
				} // for
  			
  		
  	
			}
		}
		    
});












// Book search component

Vue.component('book-search',{
	
	template:`<div class="content">
	
							<input v-model="searchTerm" placeholder="edit me" v-on:change="findBooks">
							
							<p>You searched for <strong>{{ searchTerm }}</strong></p>

							<loading-spinner v-show="loading"></loading-spinner>

								
								<ul class="collection" >
								<template v-for="list in listing">
									<li class="collection-item hoverable">
									
										<div class="row">
											<div class="col s4">
												<img v-bind:src="list.cover" style="max-width:100%" :alt=list.title />
											</div>
											<div class="col s8">
												<strong class="title">{{ list.title }}</strong>
												<br /><em>By {{ list.author }}</em>
												<p v-html=list.description></p>
											
											</div>
										</div>
									
									
									</li>
								</template>
								</ul>
						
							<h6>{{ resulttitle }} </h6>

							<p><em>{{ resultsdescription }}</em></p>
					</div>`,
	
	
	data: function(){
		return {
			loading: false,
			searchTerm: '',
			resulttitle:"",
			listing:[ ],
			resultsdescription:""
		};
	},
	computed:{

	},

	mounted(){
		
			// Is there a route added to the URL?
			if(typeof this.$route.params.searchTerm !== "undefined"){
				// Update data with route
				this.searchTerm = this.$route.params.searchTerm;
			
				// Execute search
				this.findBooks();
				
			}
			
	},
	
	methods:{
		
		findBooks: function(){
					
			// Append to URL
			router.push("/search/books/" + this.searchTerm);
			
			// starts loading icon
			this.loading = true;
			this.listing = [];
			
			// Request
			axios.get('http://aftervictory.com/domparse/wakelib-catalog-results.php?view=rss&lookfor=' + this.searchTerm + '&basicType=Keyword&basicType=&filter[]=availability_toggle_catalog:""')
			.then(response => {
    
    		var _entries = [];
    
    		
    		this.resulttitle = response.data.channel.description;
  
    		this.resultsdescription = response.data.channel.title;
    	
    		var _resultListing = response.data.channel.item;
    		
    		console.log(_resultListing)
    	
    		// Oh good, results are returned with different data structures.  Let's write some extra code for that.
    		try{
    			
    			// So most will be many results
  				if(_resultListing.length > 1){
  					console.log("Multiple");
  				}
	    		// Some will only have one result.
	    		else if(_resultListing.length === undefined){
	    			console.log("just one")
	    			
	    		} else{
	    			console.log("else")
	    		}
    			
    			
    		}
    		catch(err){
    				console.log("none or error")
    		}
    	
			  finally {
	    	
			  	
			  }
    	
    		
    		// so maybe we if/else if it's iterable?
    	
    		
    		// Cycle through entries, create GUID
    		for(var i of _resultListing){
    			
    			// Makes the GUID not a URL but just a GUID
    			var _justGuid = i.guid.replace("https://catalog.wakegov.com/GroupedWork/","");
    			i.guid = _justGuid;
    			
    			// Makes a cover image
    			i.cover = "https://catalog.wakegov.com/bookcover.php?id="+ _justGuid +"&size=small";
    			
    			// Fixes for description
    			if(typeof i.description === 'string'){
    				
	    			// Removes any oddball HTML, like image tags.
	    			var _fixDesc = i.description.replace(/<(?:.|\n)*?>/gm, '');

	    			
	    			// Shortens anything too wordy
	    			var _shortDesc = _fixDesc.substring(0,200)+'...';
	    
	    
	    			// Update entry
	    			i.description = _shortDesc;
	    			
    			}
    			
    		//	console.log(i.description)
    			
    			
    		}//for
    		
    		
    		
    		// Update Data with array of results
    		this.listing = response.data.channel.item;
    		
    		this.loading = false;
    		
    		
    	});
		
				
			}
		
		
	},
	
	// Watch for changes
	watch:{


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





































// All locations on a map
Vue.component('location-map-all',{
	template:`<div><h5>Find a library branch near you</h5><div id="allLocationsMap"></div></div>`,

	data: function(){
		return {
			geoJSON:"",
			latlong:[]
		};
	},

	beforeCreate(){
	
		axios.get("https://opendata.arcgis.com/datasets/78bb0b6b28ce496e8bfb604e00318059_0.geojson")
    	.then(response => {
    		
   // 		this.getUserLocation();
    		
    		// Save into this component's data
    		this.geoJSON = response.data.features;
    		
    		this.buildMap();
    	});
    	
	},
	created(){},
	methods:{
		
	/*	getUserLocation: function(){
			
			if ("geolocation" in navigator) {
		  
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
			
		  // geolocation IS NOT available, so how about Raleigh
		  this.latlong = [35.7796, -78.6382];
		}
			
			
			
			
			
			
			
			
		}, */
	
		buildMap: function(){

				// DOM element for map
				var wakeLibraryAllLocationsMap = L.map('allLocationsMap');

				//  data
				//console.log(this.geoJSON);
				
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
				    
				    
				    // Tiny hover for the desktop crowd
				    layer.on('mouseover',function(e){
			
				    	layer.bindTooltip(feature.properties.NAME).openTooltip();
				    	
				    	
				    	
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
		
				}

				
				
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
			
			 this.buildMap();
			
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
























// Photo + Loc card.
	// Requires props
	// Used on My chosen and individual branch locations
Vue.component('photo-location',{
	template:`
		<div>
			<div class="card-image">
        <img :src="'/locphotos/' + branchcode + '.png'" :alt=branchname />
      </div>
			
	    <div class="card-content">
	    	<span class="card-title">{{ branchname }}</span>
	    	<p>{{ branchaddress }}, {{ branchcity }}, NC<br />
	    	
	    		<today-location-hours
	    			:branchM_T=branchM_T
	    			:branchFri=branchFri
	    			:branchSat=branchSat
	    			:branchSun=branchSun>
    			</today-location-hours>
	    			
    		</p>
	    	<p>
	    		<branch-phone
	    			:branchname=branchname
	    			:branchcity=branchcity>
    			</branch-phone>
	    	</p>
	    </div>
		</div>`,
    		
	 props: [
	 	'branchcode',
	 	'branchname',
	 	'branchaddress',
	 	'branchcity',
	 	'branchM_T',
	 	'branchFri',
	 	'branchSat',
	 	'branchSun']
});








// Individual Branch
Vue.component('individual-branch',{
	template:`
		<div v-cloak>
			<div class="card">
					<photo-location
						:branchcode=$route.params.branch
						:branchname=this.individualBranchName
						:branchaddress=this.individualBranchAddress
						:branchcity=this.individualBranchCity
						:branchM_T=this.individualM_T
						:branchFri=this.individualFri
						:branchSat=this.individualSat
						:branchSun=this.individualSun
					></photo-location>
			</div>
		</div>
	`,
	data: function(){
		return {
			individualBranchName: '',
			individualBranchAddress: '',
			individualBranchCity:'',
			individualM_T:'',
			individualFri:'',
			individualSat:'',
			individualSun:'',
		};
	},
	computed:{
			allLocations(){
				return this.$store.state.libraryAllLocations;
			}
	},
	watch:{
		// Changing routes doesn't update the component, must call the method again
   $route (to, from){
       this.updateFields()
    }
	},
	methods:{
		updateFields: function(){
		
				// Identify the location's data
				// Expects vue paramter
				for(var i of this.$store.state.libraryAllLocations){
						if(i.attributes.CODE === this.$route.params.branch){
								
							this.individualBranchName = i.attributes.NAME;
							this.individualBranchAddress = i.attributes.FAC_ADDRESS;
							this.individualBranchCity = i.attributes.CITY;
							this.individualM_T = i.attributes.M_T;
							this.individualFri = i.attributes.Fri;
							this.individualSat = i.attributes.Sat;
							this.individualSun = i.attributes.Sun;
					} //ifs
				} // for
		}
	},
	
	created(){
		this.updateFields();
	}
});









// My chosen location
Vue.component('my-location', {
	template: `
		<div v-cloak>
			<div class="card">
				
				<photo-location
					:branchcode=favCode
					:branchname=favName
					:branchaddress=favAttr.FAC_ADDRESS
					:branchcity=favAttr.CITY
					
					:branchM_T=this.favM_T
					:branchFri=this.favFri
					:branchSat=this.favSat
					:branchSun=this.favSun >
				</photo-location>
				
				
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
		},
		favM_T(){
			return this.$store.state.libraryFavAttributes.M_T;
		},
		favFri(){
			return this.$store.state.libraryFavAttributes.Fri;
		},
		favSat(){
			return this.$store.state.libraryFavAttributes.Sat;
		},
		favSun(){
			return this.$store.state.libraryFavAttributes.Sun;
		},
	},
	mounted(){
			// Kick off tabs
			var _elem = document.querySelector('.tabs');
  		var _instance = M.Tabs.init(_elem);
			
	}
		
});





















// Event individual entry
Vue.component('event-entry',{
	template:`<li class="collection-item avatar">
							<i class="material-icons circle">date_range</i>
				      <span class="title" v-text="title"></span>
				      <p><strong v-text="location"></strong></p>
				      <p><em v-text="description"></em><br />
				         <blockquote v-text="dateTimeFormatted"></blockquote>
				      </p>
				    </li>`,
   props: ['title','location','description','dateTimeFormatted']
});











// My Library events for today
Vue.component('today-at-my-library',{

	data: function(){
		return {
			loading: true,
			noevents: false,
			events:[],
		};
	},
	template: `<div>
		<h6>Today at the {{ favName }}</h6>
		
			<loading-spinner v-show="loading"></loading-spinner>
			
			<!-- Error message -->
			<blockquote v-show="noevents">
				<p><em>No events are scheduled at this library today.</em></p><br />
				<router-link :to=favBranchURL class="waves-effect waves-light btn">Find future events at this branch</router-link>
			</blockquote>
		
			<ul class="collection" v-for="(event,index) in events" :key="event.eventID">
				
				
				<event-entry
					:title="event.title"
					:location="event.location"
					:description="event.description"
					:dateTimeFormatted="event.dateTimeFormatted">
				</event-entry>
				
			</ul>
	</div>`,
	
	methods:{
		queryEvents: function(){
			
			// Loading sequence
			this.loading = true;
			this.noevents = false;
			this.events = [];
			
			// Queries events
			axios.get("http://aftervictory.com/domparse/wakelib-events-json.php?search=" + this.favName	 + "&startdate="+ this.todayDate +"&previousweeks=0&HTML=0&days=1")
    	.then(response => {
    		
    	// If there are no results, show a message to the user.
    		if(response.data.length > 0){
    			this.events = response.data;
    			this.loading = false;
    		}else{
    			this.noevents = true;
    			this.loading = false;
    		};
 
    	});
		}
		
	},
	computed:{
		favName(){
			return this.$store.state.libraryFavName;
		},
		favBranchURL(){
			return "/branch/" + this.$store.state.libraryFavCode;
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
		
		<loading-spinner v-show="loading"></loading-spinner>
		
		<div class="collection">
				<template v-for="(question,index) in topFiveQuestions">
						<a href="#modalAsckWCPL"
						v-on:click="updateModal(question.id,question.question)"
						class="collection-item modal-trigger"
						v-html="question.question"></a>
				</template>
		</div>
    <br />
		<router-link to="/askwcpl" class="waves-effect waves-light btn">All Answers</router-link>

		
    <askwcpl-modal
    	:question="question"
    	:answer="answer">
  	</askwcpl-modal>

		
		
	</div>`,
	data: function(){
		return {
			loading: true,
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
				
			},
			queryData: function(){
					// Query the top 5 most popular
					this.loading = true;
					axios.get("http://aftervictory.com/domparse/wakelib-askwcpl-questions.php?iid=294&limit=5&showans=0&showdet=0&format=json&type=popular")
		    	.then(response => {
		    		store.commit('updatetopFiveaskWCPL',response.data.answers);
		    		this.loading = false;
		    	});
			}
	},
	updated(){
		// Modal code
		  var elem = document.querySelector('.modal');
			var instance = M.Modal.init(elem);
	},
	created(){
			this.queryData();
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
	      	<a class="collection-item modal-trigger"
	      			href="#modalAsckWCPL"
	      			v-on:click="updateModal(result.id,result.question)"
	      			v-html=result.question
	      			:key="result.id"></a>
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
const searchBooks = 			{ template: '<book-search></book-search>' }
const alllocations =			{ template:	'<location-map-all></location-map-all>'}
const individualBranch =	{ template: '<div>BRANCH {{ $route.params.branch }}<individual-branch></individual-branch></div>' }
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
	{ path: '/search/books/', component: searchBooks },
	{ path: '/search/books/:searchTerm', component: searchBooks },
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