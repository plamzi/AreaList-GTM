# AreaList-GTM
<h2>AreaList GTM</h2>
<h6>True View Tracker for Google Tag Manager</h6>

<h4>Description:</h4>

Makes it easier to track multiple hot areas / SPA modules in GA & other Analytics tools based on UI element visibility.

Features via built-in persistence and configurable GTM dataLayer pushes.

<h4>Example:</h4>

Create a GTM custom tag in your container of choice:

<code>

<script>

  var arealist_config = {
  
    design: true,
    
    debug: true,
    
    areas: [
    
    	{ name: 'Hero Slide', handle: '.hero-slideshow .el-item', title: 'h2', list: document.title, cat: 'HP Engagement' },
			
        { name: 'IQA Grid', handle: '.iqa-grid div', title: 'h3', list: document.title, cat: 'HP Engagement' },
      
   		{ name: 'HP Video', handle: '.hp-video', list: document.title, cat: 'HP Engagement' },
      
		{ name: 'Video CTA Button', handle: '.iqa-cta .uk-button', title: '.uk-button', list: document.title, cat: 'HP Engagement' },
      
      	{ name: 'HP Flow Graphic', handle: '.hp-flow-graphic', list: document.title, cat: 'HP Engagement' },
      
      	{ name: 'Flow CTA Button', handle: '.qa2l-flow .uk-button', title: '.uk-button', list: document.title, cat: 'HP Engagement' },
      
      	{ name: 'HP UI Graphic', handle: '.hp-ui-graphic', list: document.title, cat: 'HP Engagement' },
      
  	]
    
  };
  
</script>

<script src="https://github.com/plamzi/AreaList-GTM/blob/master/arealist-gtm.js"></script>

</code>