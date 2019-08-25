<h2>AreaList GTM</h2>
<h6>True View UI Element Tracker for Google Tag Manager</h6>

<h4>Description:</h4>

This custom script for Google Tag Manager makes it easier to track multiple UI elements in GA & other Analytics tools based on visibility. Equally capable in SPA contexts, the script can track impressions and clicks across a wide variety of dynamic HTML found in the wild.

In addition to reducing the complexities surrounding robust visibility logic, the script features built-in persistence for efficient delayed collection and configurable GTM dataLayer pushes that work with a wide variety of implementations.

<h4>Requirements:</h4>

jQuery 1.0 or later has to be loaded & available on the page prior to including the main AreaList script.

<h4>Example:</h4>

Create a GTM custom tag in your container of choice:

```
<script>

	var arealist_config = {

		areas: [

			{ name: 'Hero Slide', handle: '.hero-slideshow .el-item', title: 'h2' },
			{ name: 'IQA Grid', handle: '.iqa-grid div', title: 'h3' },
			{ name: 'HP Video', handle: '.hp-video' },
			{ name: 'Video CTA Button', handle: '.iqa-cta .uk-button', title: '.uk-button', list: 'Homepage', cat: 'CTA Buttons' },
			{ name: 'HP Flow Graphic', handle: '.hp-flow-graphic' },
			{ name: 'Flow CTA Button', handle: '.qa2l-flow .uk-button', title: '.uk-button', list: 'Homepage', cat: 'CTA Buttons' },
			{ name: 'HP UI Graphic', handle: '.hp-ui-graphic' },
		  
		],
   
		cat: 'Homepage Engagement',
		
		list: document.title,
		
		debug: true
	};
  
</script>

<script src="https://github.com/plamzi/AreaList-GTM/raw/master/arealist-gtm.js"></script>

```

<b>Note:</b> In most situations, you would want to include the contents of the main script inline rather than via a GitHub link.

<h4>Configuration:</h4>

<b>areas</b> - Array of Objects, each with the following properties:

area.name - The name of the area or UI element shown in reports.

area.handle - The selector / jQuery handle used to identify this element.

area.title - Optional selector / handle from which to grab a unique title of this element. It can be used to disambiguate multiple areas responding to the area.handle based on dynamic strings such as <h1> tags. The title is added to the area.name.

area.list - Optional list name for GA eCommerce Product Performance reporting.

area.cat - Optional category name for GA eCommerce Product Performance reporting.

area.options - Object containing optional tracking conditions for this area.

area.options.single - Set to true to only track this element if it is unique at the time, based on area.handle.

area.options.multiple - Set to true to only track this element if more than one element responds to area.handle.

area.options.clickable - Set to true to only track this element when it contains clickable elements.

area.options.hastitle - Set to true to only track this element if the area.title selector returns a string.

area.options.novischeck - Set to true to track this element as soon as it's detected, regardless of whether it has become visible to the end user.

area.options.noclickdedupe - Set to true to disable click deduplication and track every click. Useful if the element responding to area.handle contains more than one clickable element and you wish to gauge overall engagement levels. Note that clickthrough rates (clicks / impressions) can then exceed 100% for this area.

area.disable - Set to true to temporarily disable tracking for an individual definition.

<b>cat</b> - Default GA eCommerce Product Category name for all impressions & clicks. If not specified, the page title is picked up.

<b>list</b> - Default GA eCommerce Product List name. If not specified, the relative URL path is picked up.

<b>debug</b> - Set to true to turn on verbose console logging and show flashes over areas when impressions are collected.

<b>disable_impressions</b> - Set to true to disable impression tracking.

<b>disable_clicks</b> - Set to true to disable click tracking.

<b>disable_storage</b> - Set to true to disable use of window.localStorage to persist impressions and delay collections to the next onsite page load.

<b>storage_key_name</b> - Customize the name of the localStorage key (default is 'AreaList_GTM') used by this tag instance. Useful if you are deploying multiple instances of the main tag across the same site.

<b>data_layer_name</b> - Set to the name of a custom dataLayer object in the window scope. Default is 'dataLayer'.

<b>impressions_event_name</b> - Default is 'AreaList Impressions'. Change it to see a different event name in data layer pushes.

<b>clicks_event_name</b> - Default is 'AreaList Clicks'. Change it to see a different event name in data layer pushes.

<b>polling_frequency</b> - Default is 3 sec. Setting this value to less is not recommended for reasons of performance and accuracy (a small delay on impression collection ensures the user has had time to see the element).