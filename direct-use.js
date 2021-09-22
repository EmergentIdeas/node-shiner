/*
	Automatically looks for slides and starts a slide show. It works on html with the general format:
	
```	
<div class="shiner-show">
	<div class="slide" data-delay="5000">
		<div class="a-test-element">&nbsp;</div>
		<img src="..." />
	</div>

	<div class="slide slide-2" style="background-image: url('...');">

	</div>
	<div class="dots"></div>
	<div class="advance">&gt;</div>
	<div class="previous">&lt;</div>
</div>
```

	Shiner show works by adding and removing classes to slides in sequence. This can be used to create
	most transition effects, but the easiest is crossfading slides by changing their opacity. The css
	for these effects is shown in shiner.css and shiner.less.
	
	The classes added at various times are invisible, visible, left, and right. The current slide will
	have the 'visible' class, all others 'invisible'. 'left' will be applied to the previous slide,
	'right', to the next.

	During the init process, window.shine will be set to an object representing the current show, on
	which you can call .next(), .previous(), etc.
	
	If an empty element with the 'dots' class exists, divs with the 'dot' class will be added, one for each
	slide. The classes on these will be updated so that a current class is applied to the dot at the same
	index as the current slide.
	
	Clicking on a .dot element will move to the corresponding slide.
	
	A swipe lister is also added and left and right swipe events are interpreted and next and previous calls.
	
	Any element with the class 'advance' will get a listener which will advance the slide, 'previous' will
	go back.
	
	Each site will need to define its own styles to set the size of the .shiner-show element and the slide
	elements. Normally, this might be a shiner-show with a fixed size or fixed aspect ratio, and the
	slide elements are set absolute to take up all of the available space in the shiner-show container.
	Advance, previous, dot, dots elements will need to be styled and positioned as well.	
	
	When the slideshow is initialized, the slides will have the correct classes set. After those classes
	are set, the 'transitions-on' class is added to '.shiner-show'. This is useful in creating css that
	supresses transition effects until the first slide is showing.
	
	
	window.shinerDelay will set the standard slide delay time, or the time per slide can be set
	with a data-delay attribute on the slide element.
	
	After the slide show is ready, window.shinerShowReady will be called, if it exists, and will be passed
	the object for the current show.
	
	After the slide show is started, window.shinerShowStart will be called, if it exists, and will be passed
	the object for the current show. This will happen 100ms after
	the init (to allow css attributes to settle) or window.shinerStartDelay time if present.
	
	To do something special when a slide is shown or removed from being show, you can over the onVisible and
	onInvisible methods. BEWARE, if these methods exist,you will still have to make sure the existing code 
	is called, al la:
```
shine.oldOnVisible = shine.onVisible
shine.onVisible = function (slide, ind) {	
	// my new functionlity
	if(shine.oldOnVisible) {
		shine.oldOnVisible(slide, ind)
	}
}
```

A working example can be found in this project's sample.html
	
*/
jQuery(function () {
    var $ = jQuery
    var SwipeListener = require('swipe-listener')

    var Shiner = require('./shiner-no-jquery')($)
    window.Shiner = Shiner
    require('./start-the-show')($, Shiner, SwipeListener)
})
