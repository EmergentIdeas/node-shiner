/**
A simple jQuery plugin that changes the opacity of the items in a list (doesn't matter what they are)
to give them impression of a cross-fading slide show. If opacity is not supported, display hidden is used for
a somewhat graceful degredation of function. 

To set up, position all of the slides absolutely within
their container. Create a class ("trans-spec" by default) that contains the transition styles. These will be
applied to the slides after initialization takes place (otherwise the initial setup looks funky). 

Then call shiner like:
 
> $('.myslides').shiner();


Shiner will also take options like: 

> $('.myslides').shiner({ transClass: 'fast', delay: 1000});


Shiner will also take the commands "stop" and "go" like:
 
> $('.myslides').shiner("stop")
> $('.myslides').shiner("go");


One of the nice things about using this technique is that all of the slides can be placed behind 
another element (see example.html) allowing you to "frame" a slideshow. Also, styles like max-width
can be used for images and overflow hidden can be used for the container. This makes it easy to show
slides of different sizes and slightly different aspect ratios.

Shiner works in modern browsers and in ie 7/8. It also works very well on android devices despite 
their limited processing power (unlike other slide show tools I've tried).
 */
var jQuery = require('jquery')

var cssTransitionSupport = require('./transition-support')();

var defaults = {
		delay: 5000 					/* The delay between the changes in slides */
};

var Shiner = function(selector) {
	this.selector = selector
	this.delay = defaults.delay
}

/**
 * make the slide visible either by making it opaque if that's supported in the browser or
 * making it not hidden
 */
Shiner.prototype.makeVisible = function(slide) {
	slide.removeClass('invisible')
	slide.addClass('visible')
	if(!cssTransitionSupport) {
		var oldvalue = $.data(slide, 'old-display');
		if(!oldvalue) {
			oldvalue = 'block';
		}
		slide.css('display', oldvalue);
	}
	
}

/**
 * make the slide invisible either by making it transparent if that's supported in the browser or
 * making it hidden
 */
Shiner.prototype.makeInvisible = function(slide) {
	slide.addClass('invisible')
	slide.removeClass('visible')
	if(!cssTransitionSupport) {
		var oldvalue = slide.css('display');
		if(oldvalue != 'none') {
			$.data(slide, 'old-display', oldvalue);
		}
		slide.css('display', 'none');
	}
}

/**
 * Returns true if the slide is opaque (if that's supported by the browser) or not hidden if 
 * opacity is not supported.
 */
Shiner.prototype.isVisible = function(slide) {
	if(cssTransitionSupport) {
		return slide.css('opacity') == 1;
	}
	else {
		return slide.css('display') != 'none';
	}
}

/**
 * Makes the currently visible slide invisible and makes the next slide in the sequence visible
 */
Shiner.prototype.goToNext = function() {
	var last = false;
	var slides = $(this.selector);
	var self = this
	slides.each(function() {
		var slide = $(this);
		if(self.isVisible(slide)) {
			self.makeInvisible(slide);
			last = true;
		}
		else {
			if(last == true) {
				last = false;
				self.makeVisible(slide);
			}
		}
		
	});
	
	if(last) {
		// meaning the one we made transparent was the last one
		this.makeVisible(slides.first());
	}
}

/**
 * Makes the currently visible slide invisible and makes the previous slide in the sequence visible
 */
Shiner.prototype.goToPrevious = function() {
	var last = true;
	var previous = null;
	var slides = $(this.selector);
	var self = this
	slides.each(function() {
		var slide = $(this);
		if(self.isVisible(slide)) {
			self.makeInvisible(slide);
			if(previous) {
				this.makeVisible(previous);
				last = false;
			}
		}
		
		previous = slide;
		
	});
	
	if(last) {
		// meaning the one we made transparent was the last one
		this.makeVisible(slides.last());
	}
}

/**
 * Starts the slide show by setting up a timer to change the slides
 */
Shiner.prototype.shineOn = function(slidesSelector) {
	this.shineOff();
	var self = this
	this.intervalId = setInterval(function() { 
		self.goToNext(slidesSelector) }
	, this.delay);
}

/**
 * Stops the timer and thus the slide show
 */
Shiner.prototype.shineOff = function() {
	if(this.intervalId) {
		clearInterval(this.intervalId);
	}
	
	this.intervalId = null;
}

/**
 * sets up the slides by making them all invisible and then making the first one visible.
 */
Shiner.prototype.initShine = function(options) {
	var slides = $(this.selector);
	var self = this
	slides.each(function() { self.makeInvisible($(this)); } );
	this.makeVisible(slides.first());
	
	setTimeout(function() {
		self.shineOn();
	}, 100);

}

var shiners = {}

$.fn.shiner = function(options) {
	
	var theselector = this.selector;
	var shiner = shiners[theselector]
	if(shiner == null) {
		shiner = new Shiner(theselector)
		shiners[theselector] = shiner
	}
	
	if(!options) {
		shiner.initShine();
	}
	else if(typeof options === 'string') {
		if (options === 'stop') {
			shiner.shineOff();
		}
		else if (options === 'go') {
			shiner.shineOn();
		}
		else if (options === 'next') {
			shiner.shineOff();
			shiner.goToNext();
			shiner.shineOn();
		}
		else if (options === 'previous') {
			shiner.shineOff();
			shiner.goToPrevious();
			shiner.shineOn();
		}
	}
	else if(typeof options === 'object') {
		shiner.initShine(options);
	}
}

module.exports = Shiner

