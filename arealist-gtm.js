(function() {
	
	var _ARL = function(settings) {
	
		settings = settings || {};
	
		settings.global = settings.global || {
			
			impressions_event_name: 'AreaList Impressions',
			
			clicks_event_name: 'AreaList Clicks',
			
			storage_key_name: 'AreaList_GTM'
		};

		settings.areas = settings.areas || [];

	    var data = {
	    		
	    	on: {},
	    	
	    	global: settings.global,
	    	
	      	areas: settings.areas,
	      
	        impressions: [],
	        
	        clicks: [],
	        
	        seen: [],
	        
	        clicked: [],
	       
	        track: {
	        	impressions: !settings.global.disable && !settings.disable_impressions,
	        	clicks: !settings.global.disable && !settings.disable_clicks,
	        	store: !settings.disable_storage,
	        	debug: settings.debug
	        },
	       
	        clickable: 'a, button, input, select, .btn, .button, [onclick], .dropdown, .dropdown-toggle, .clickable, label, *[data-target], i, textarea',
	
	        snap: `<div class='arlg' style='position: absolute; z-index: 100000; top: {1}px; left: {2}px; width: {3}px; height: {4}px; box-shadow: inset 0px 0px 30px -3px rgba(194,31,31,1); background: white;'></div>`
	    };
	   
	    var j = (function() {
	  
	      	return window.jQuery;
	      
	    })();
	
		var clickable = function(e) {
			
			return j(e).find(data.clickable).length;
		};
	
		var copy = function(a) {
		
			return JSON.parse(JSON.stringify(a));
		};
		
		var log = function() {
	
			if (data.track.debug) {
		
				[].unshift.call(arguments, '\uD83D\uDC41 [AreaList GTM]');
				console.log.apply(null, arguments);
			}
		};
	
		var format = function() {
			
			var args = arguments;
			
			return args[0].replace(/{(\d+)}/g, function(match, number) {
				
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
		
	    var save = function() {
	    
	    	//log('save');
	 
	    	if (!window.localStorage)
	    		return log('save:', 'window.localStorage is not available...');
	    	
	    	if (!data.track.store)
	    		return log('save:', 'global switch disable store is on, not persisting...');
	
	    	var store = {
	    		url: location.href,
	    		path: location.pathname,
	    		impressions: data.impressions,
	    		clicks: data.clicks
	    	}
	
	    	localStorage.setItem(settings.global.storage_key_name, JSON.stringify(store));
	    	
	    	log('save:', store);
	    };
	    
	    var reset = function(what) {
	    	
	    	log('reset:', what || 'all');

	    	if (!what || what == 'impressions') { /* not going to reset 'seen' so we can honor impression dedup */
	    		
	    		data.seen = data.seen.concat(data.impressions);
	    		data.impressions = [];
	    	}
	    	
	    	if (!what || what == 'clicks') {
	    		
	    		data.clicked = data.clicked.concat(data.clicks); /* not going to reset 'clicked' so we can honor click dedup */
	    		data.clicks = [];
	    	}
	    	
	    	save();
	    };
	 
	    var collect = function(evt, nodes) {
	        
	    	//if (evt != 'poll')
	    		log('collect:', evt);
	    	
	    	var imps = [];
			
		    data.areas.map(function(a) {
		        
	        	var tar = j(a.handle), needsti = (a.when && a.when.indexOf("needstitle") != -1);
	        
	        	if (tar.length == 0)
	        		return /* log('collect area not found:', a.name, a.handle) */;
	
	    		if (a.when && a.when.indexOf('single') != -1 && tar.length > 1)
	    			return /* log('collect area condition is single match so skipping:', a.name, a.handle) */;
	    			
	    		if (a.when && a.when.indexOf('multiple') != -1 && tar.length == 1)
	    			return /* log('collect area condition is multiple match so skipping:', a.name, a.handle) */;
	    		
	        	tar.each(function() {
	
	        		var t = j(this);
	        		
	        		var d = {
	        			name: a.name,
	        			title: null,
	        			list: a.list || location.pathname,
	        			cat: a.cat || settings.global.cat
	        		}

		        	if (a.disabled)
		              return log('collect area disabled:', d.name, a.handle);
	
		        	if (a.title) {
		        	
		        		var ti = t.find(a.title).length ? t.find(a.title) : false;
		        		
		        		if (!ti && !needsti)
		        			ti = t;
		        		
		        		if (ti)
		        			ti = ti.text().trim().replace(/[\r\n\t]+/g, ' ').replace(/ +/g, ' ');
		        	
		        		if (ti && ti.length > 50)
		        			ti = ti.substr(0, 50) + '..';
		        		
		        		if (ti)
		        			d.title = ti;
		        		else
		        		if (needsti)
		        			return /* log('collect area condition is needs title so skipping:', d.name, d.handle) */;
		        	}
		        
		        	var tracked = data.impressions.some(function(i) { return i.name == d.name && i.title == d.title; });
		        	var seen = data.seen.some(function(i) { return i.name == d.name && i.title == d.title; });
		        	
		        	if (tracked || seen)
		        		return /* log('collect area impression exists:', JSON.stringify(d), a.handle) */;

		        	if (!t.isVis()) {
		      		
		        		if (!a.when || a.when.indexOf('novischeck') == -1)
		        			return /* log('collect area here but not visible:', d.name, d.title) */;
		        	}
		        
		        	if (!t.inView()) {
		 
		        		if (!a.when || a.when.indexOf('novischeck') == -1)
		        			return /* log('collect area here & visible but not in viewport:', d.name, d.title) */;
		        	}
	
		        	if (a.when && a.when.indexOf('clickable') != -1 && !clickable(tar))
		        	  return /* log('collect area appears to contain no clickables:', d.name, d.title, tar.html()) */;
	
		        	if (data.track.impressions) {
		        		
		        		data.impressions.push(d);
		        		imps.push(d);
		        	}
		        
		        	if (data.track.debug) {
		       
		        		var rect = t.get(0).getBoundingClientRect();
		        		var snap = format(data.snap, parseInt(rect.y) + j(document).scrollTop(), parseInt(rect.x) + j(document).scrollLeft(), parseInt(rect.width), parseInt(rect.height));
		        		
		        		//console.log('snap:', snap);
		        		
		        		//var snap = data.snap;
		        		//t.append(snap);
		        	
		        		j('body').prepend(snap);
		        		j('.arlg').fadeOut(600);
		        		setTimeout(function() { j('.arlg').remove(); }, 600);
		        	}
		        	
	              	log('collect impression:', JSON.stringify(d), data.impressions);
	        	});
		    });
	
		    if (imps.length) {
		    
		    	save();
				trigger('impression', imps);
		    }
	    };
	
	    var click = function(evt) {
	    
	    	var tar = j(evt.target);
	    	var clicks = [];
	
	    	if (!tar.is(data.clickable) && !tar.closest(data.clickable).length)
	    		return;
	    	
		    data.areas.map(function(a) {
		        
		    	//log('click begin eval:', JSON.stringify(a));
		    
	        	if (!tar.closest(a.handle).length)
	        		return;
	
	        	var p = tar.closest(a.handle);
	
	        	if (a.disabled)
	        		return log('click area disabled:', a.name);
	
	    		if (a.when && a.when.indexOf('single') != -1 && j(a.handle).length > 1)
	    			return log('click area condition is single match so skipping:', a.name, a.handle);
	    			
	    		if (a.when && a.when.indexOf('multiple') != -1 && j(a.handle).length == 1)
	    			return log('click area condition is multiple match so skipping:', a.name, a.handle);
	    		
	        	var nodedup = ( a.when && a.when.indexOf('noclickdedup') != -1 );
	        
	    		var d = {
	        		name: a.name,
	        		title: null,
	        		list: a.list || location.pathname,
	        		cat: a.cat || settings.global.cat
	        	};
	        	
	        	if (a.title && p.find(a.title)) {
	
	        		var ti = p.find(a.title).length ? p.find(a.title) : p;
	        		ti = ti.text().trim().replace(/[\t\n\r]+/g, ' ').replace(/ +/g, ' ');
	        		
	        		if (ti && ti.length > 50)
	        			ti = ti.substr(0, 50) + '..';
	        		
	        		if (ti)
	        			d.title = ti;
	        	}

	        	var tracked = nodedup ? false : data.clicked.some(function(i) { return i.name == d.name && i.title == d.title; });
	        
	        	if (tracked)
	        		return log('collect area click exists and dedup is on:', JSON.stringify(d), a.handle);
	
	        	tracked = data.impressions.some(function(i) { return i.name == d.name && i.title == d.title; });
	        	var seen = data.seen.some(function(i) { return i.name == d.name && i.title == d.title; });
	
	        	if (!tracked && !seen && data.track.impressions) {
	        		
	        		data.impressions.push(d);
	        		log('collect impression on click:', JSON.stringify(d), data.impressions);
	        	}
	
	          	log('collect click:', JSON.stringify(d), data.clicks);
	          	
	        	if (data.track.clicks) {
	        	
	        		data.clicks.push(d);
	          		clicks.push(d);
	        	}
		    });
		    
		    if (clicks.length) {
	
	      		save();
	      		trigger('click', clicks, evt);
		    }
	    };
	   
	    var fetch = function(what) {
	    
	    	var store = false;
	    	
	    	if (window.localStorage) {
	    		
	    		store = localStorage.getItem(settings.global.storage_key_name);
	
	    		if (store)
	    			store = JSON.parse(store);
	    	}

	    	log('fetch:', what, 'from', store);
	   	
	    	if (!store) {
	    		
	    		log('fetch found no store or in-memory tracker, returning null');
	    		return null;
	    	}	

	    	if (typeof store[what] != 'undefined')
	    		return store[what];
	    
	    	log('fetch error: no such thing as', what);
	    };
	    
	    var push = function(what) {
	    
	    	if (what == 'impressions') {
	    		
	    		if (!data.impressions.length)
	    			return;
	    	
		    	var imp = data.impressions.map(function(i, n) {
		    		
		    		var name = i.title ? i.name + ': ' + i.title : i.name;
		    		
		    		  return {
			    		    id: name,
			    		    name: name,
			    		    category: i.cat || 'AreaList',
			    		    list: i.list || fetch('path'),
			    		    position: n + 1
		    		  };
	    		});
	
	    		log('push impressions:', imp);
	
	    		dataLayer.push({
		    		event: settings.global.impressions_event_name,
		    		ecommerce: { impressions: imp }
	    		});
	    	}
	    	
	    	if (what == 'clicks') {

	    		if (!data.clicks.length)
	    			return;
	    		
	    		var clicks = data.clicks.map(function(i, n) {
	
	    			var name = i.title ? i.name + ': ' + i.title : i.name;
	    			
	    			  return {
		    			    id: name,
		    			    name: name,
		    			    category: i.cat || 'AreaList',
		    			    list: i.list || fetch('path'),
		    			    position: n
	    			  }
	    		});
	
	    		log('push clicks:', clicks);
	
				dataLayer.push({
					
				  event: settings.global.clicks_event_name,
				 
				  ecommerce: {
					  click: {
						  actionField: { list: clicks[0].list || location.pathname },
						  products: clicks
					  }
				  }
				
				});
	    	}
	    };
	    
	    var trigger = function(evt, d, e) {
	    	
	    	if (data.on[evt])
		    	data.on[evt].forEach(function(cb) {
		    		
		    		log('trigger:', d);
	
		    		if (e)
		    			cb({ name: d.name, title: d.title, event: e });
		    		else
		    			cb(d);
		    	});
	    };
	    
	    var on = function(evt, cb) {
	    
	    	log('_arlg.on', evt, cb);
	    	
	    	data.on[evt] = data.on[evt] || [];
	    	data.on[evt].push(cb);
	    };
	   
	    var init = function() {
	      
	    	if (!j) {
	    		
	    		log('aborting due to lack of jQuery');
	    		return false;
	    	}
	    	
	        j.fn.inView = function() {
	       
		        var eTop = j(this).offset().top;
		        var eBottom = eTop + j(this).outerHeight();
		        
		        var vTop = j(window).scrollTop();
		        var vBottom = vTop + j(window).height();
		    
		        return eBottom > vTop && eTop < vBottom;
	        };
	    
	        j.fn.isVis = function() {
	
	        //	var rect = j(this).get(0).getBoundingClientRect();
	        
		        return j(this).is(':visible') && j(this).css('visibility') != 'hidden' && j(this).css('opacity') != '0';
	        };
	
	      	j(window).on('load', function() {
	      	
	      		data.impressions = fetch('impressions');
	      		push('impressions');
	      
	      		data.clicks = fetch('clicks');
	      		push('clicks');
	      		
	      		reset();
	      		
	      		data.seen = [];
	      		data.clicked = [];
	      
	      		collect('load');
	      	});
	
	      	j(document).on('click', click);    	
	
	      	log('init: now live with the following settings:', settings, 'inside', location.href);
	
	      	if (data.areas.length) {
	      		
	      		data._poll = setInterval(function() { collect('poll'); }, 3 * 1000);
	      		log('init: polling activated for ' + data.areas.length + ' defined areas');
	      	}
	      	
	      	return self;
		};
		
		init();
		
		var self = {
			
			on: on,
			reset: reset,
			data: function() { return data; }
		}
	    
		return self;
	}
	
	window._arlg = window._arlg || new _ARL(window.arealist_config);

})();