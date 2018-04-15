
// Global filter to make dates not weird
Vue.filter('normalDate',function(value){
	return moment(value).format("dddd, MMMM Do YYYY, h:mm:ss a");
});


// Loading spinner.
Vue.component('loading-spinner',{
	template:`
		<div class="row">
			<br />
			<div class="col s12 center-align">
				  <div class="preloader-wrapper big active">
				    <div class="spinner-layer spinner">
				      <div class="circle-clipper left">
				        <div class="circle"></div>
				      </div><div class="gap-patch">
				        <div class="circle"></div>
				      </div><div class="circle-clipper right">
				        <div class="circle"></div>
				      </div>
				    </div>
				  </div>
			</div>
		</div>`
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


// Hours component
	// Expects to be passed the different hour
	// schedules and returns the right one for today
Vue.component('today-location-hours',{
	template:`<span>Hours today: <strong>{{ todaysHours }}</strong></span>`,

	props: ["branchM_T","branchFri","branchSat","branchSun"],

	computed:{
		todaysHours(){

			// Finds day of the week,returns the hours
			let _dayofweek = moment().format("dddd");
		
			if (_dayofweek === 'Sunday') {
				return this.branchSun;
			 
			} else if (_dayofweek === 'Saturday') {
				return this.branchSat;
			 
			} else if (_dayofweek === 'Friday') {
				return this.branchFri;

			} else {
				return this.branchM_T;
			}
		}
	}

});


// Phone number component
// Vue.component('my-location-phone',{
// 	template:`<a :href="favPhoneLink">{{ favPhone }}</a>`,
// 	computed:{
// 		favPhone(){
// 			return this.$store.state.libraryFavPhone;
// 		},
// 		favPhoneLink(){
// 			return "tel:" + this.favPhone;
// 		}
// 	}
// });





// Branch Phone number component
Vue.component('branch-phone',{
	template:`<a :href="favPhoneLink">{{ branchNumber }}</a>`,
	props:["branchname","branchcity"],
	data: function(){
		return{
			branchNumber:''
		};
	},
	methods:{
			
			parsePhone: function(phonenum){
				
					var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
			    
			    if (regexObj.test(phonenum)) {
			        var parts = phonenum.match(regexObj);
			        var phone = "";
			        if (parts[1]) { phone += "(" + parts[1] + ") "; }
			        phone += parts[2] + "-" + parts[3];
			  			this.branchNumber = phone;
			        return phone;
			        
			    }
			    else {
			        console.log("Invalid phone number in data feed");
			        return phonenum;
			    }
			},
			getBranchPhone: function(){
				console.log("Get Branch Phone");
				axios.get("https://api.foursquare.com/v2/venues/search?limit=1&near=" + this.branchcity + ",NC&query=" + this.branchname + "&oauth_token=QEHZWEFD4SFPLQNTSI5QYTX52IMG4EFOU0BXWB1OSXRVFXLM&v=20180123")
	    		.then(response => {
	    			this.parsePhone(response.data.response.venues[0].contact.phone);
				});
			} // function
			
	},// method
	mounted(){
		this.getBranchPhone();
	},
	watch:{
		// Changing routes doesn't update the component, must call the method again
   $route (to, from){
       this.getBranchPhone();
    }
	},
	computed:{
		favPhoneLink(){
			return "tel:" + this.branchNumber;
		}
	}
});



// My Library Bookclub events
Vue.component('bookclub-my-library',{
	
	data: function(){
		return {
			loading:true,
			noevents:false,
			events:[],
		};
	},
	template: `<div>
		<h6>Upcoming Book Club and Discussion Meetings at the {{ favName }}</h6>
			
			<loading-spinner v-show="loading"></loading-spinner>
			
			<!-- Error message -->
			<blockquote v-show="noevents">
				<p><em>No book club meetings are scheduled at this library anytime soon.</em></p><br />
				<router-link to="/events/bookclubs" class="waves-effect waves-light btn">See Book Discussions at other branches</router-link>
			</blockquote>
		
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
			
			
			this.loading = true;
			this.noevents = false;
			this.events = '';
			
			// Queries bookclub events
			axios.get("http://aftervictory.com/domparse/wakelib-bookclub-json.php?filterview=Book+Clubs&search=" + this.favName + "&startdate="+ this.todayDate +"&previousweeks=0&HTML=0&days=32")
    	.then(response => {
    		
    		// If there are no results, show a message to the user.
    		if(response.data.length > 0){
    			this.events = response.data;
    			this.loading = false;
    		}else{
    			this.noevents = true;
    			this.loading = false;
    		}
    		
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