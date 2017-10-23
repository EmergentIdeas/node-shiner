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

var Shiner = function(selector, context) {
	this.selector = selector
	this.delay = defaults.delay
	this.context = context
}

/**
 * make the slide visible either by making it opaque if that's supported in the browser or
 * making it not hidden
 */
Shiner.prototype.makeVisible = function(slide) {
	slide = $(slide)
	if(!cssTransitionSupport) {
		var oldvalue = $.data(slide, 'old-display');
		if(!oldvalue) {
			oldvalue = 'block';
		}
		slide.css('display', oldvalue);
	}
	else {
		slide.removeClass('right left')
		slide.addClass('visible')
		slide.removeClass('invisible')
	}
	
	if(this.onVisible) {
		this.onVisible(slide, this.slides.index(slide))
	}
	
}

Shiner.prototype.isVisible = function(slide) {
	return slide.hasClass('visible');
}

Shiner.prototype.makeNext = function(slide) {
	slide = $(slide)
	slide.addClass('right')
	slide.removeClass('visible')
	slide.addClass('invisible')
}

/**
 * make the slide invisible either by making it transparent if that's supported in the browser or
 * making it hidden
 */
Shiner.prototype.makeInvisible = function(slide, goRight) {
	slide = $(slide)
	if(!cssTransitionSupport) {
		var oldvalue = slide.css('display');
		if(oldvalue != 'none') {
			$.data(slide, 'old-display', oldvalue);
		}
		slide.css('display', 'none');
	}
	else {
		slide.removeClass('visible')
		slide.addClass(goRight ? 'right' : 'left')
		slide.addClass('invisible')
	}
	
	if(this.onInvisible) {
		this.onInvisible(slide, this.slides.index(slide))
	}
}

/**
 * Makes the currently visible slide invisible and makes the next slide in the sequence visible
 */
Shiner.prototype.goToNext = function() {
	this.slides.removeClass('left right')
	this.makeInvisible(this.slidesArray[0], false)
	this.makeVisible(this.slidesArray[1])
	this.makeNext(this.slidesArray[2])
	var last = this.slidesArray.shift()
	this.slidesArray.push(last)
}

/**
 * Makes the currently visible slide invisible and makes the previous slide in the sequence visible
 */
Shiner.prototype.goToPrevious = function() {
	this.slides.removeClass('left right')
	var last = this.slidesArray.pop()
	this.slidesArray.unshift(last)
	this.makeInvisible(this.slidesArray[this.slidesArray.length - 1], false)
	this.makeVisible(this.slidesArray[0])
	this.makeInvisible(this.slidesArray[1], true)
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
	var slides
	if(this.context) {
		slides = this.slides = $(this.context).find(this.selector);
	}
	else {
		slides = this.slides = $(this.selector);
	}
	var self = this
	slides.addClass('invisible')
	this.slidesArray = slides.toArray()
	$(this.slidesArray[0]).removeClass('invisible')
	$(this.slidesArray[1]).removeClass('invisible')
	this.makeVisible(this.slidesArray[0])
	this.makeNext(this.slidesArray[1])
	this.nextWasLast = true

	
	setTimeout(function() {
		self.shineOn();
	}, 100);

}

Shiner.prototype.go = function() {
	this.shineOn();
}

Shiner.prototype.next = function() {
	this.shineOff();
	this.goToNext();
	this.shineOn();
}

Shiner.prototype.previous = function() {
	this.shineOff();
	this.goToPrevious();
	this.shineOn();
}

Shiner.prototype.stop = function() {
	this.shineOff();
}

Shiner.prototype.showSlide = function(slidePos) {
	this.shineOff();
	var slides = this.slides;
	var pos = 0;
	var shine = this
	this.slides.each(function() {
		var slide = $(this);
		if(shine.isVisible(slide)) {
			shine.makeInvisible(slide);
		}
		if(pos === slidePos) {
			shine.makeVisible(slide)
		}
		
		pos++
	});
	
	this.shineOn();
}


var idSeed = 1
var shinerSet = {}

var getMakeId = function(el) {
	if(!el.id) {
		el.id = 'slideholder' + idSeed++
	}
	return el.id
}

$.fn.shiner = function(options, slidePos) {
	
	var theselector = this.selector
	var shiners = shinerSet[getMakeId(this.context)]
	if(!shiners) {
		shiners = {}
		shinerSet[getMakeId(this.context)] = shiners
	}
	var shiner = shiners[theselector]
	if(shiner == null) {
		shiner = new Shiner(theselector, this.context)
		shiners[theselector] = shiner
	}
	
	if(!options) {
		shiner.initShine();
	}
	else if(typeof options === 'string') {
		if (options === 'stop') {
			shiner.stop();
		}
		else if (options === 'go') {
			shiner.go();
		}
		else if (options === 'next') {
			shiner.next();
		}
		else if (options === 'previous') {
			shiner.previous();
		}
		else if (options === 'show') {
			shiner.showSlide(slidePos)
		}

	}
	else if(typeof options === 'object') {
		shiner.initShine(options);
	}
	
	return shiner
}

module.exports = Shiner

