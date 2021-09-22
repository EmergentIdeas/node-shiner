(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./shiner-no-jquery":3,"./start-the-show":4,"swipe-listener":2}],2:[function(require,module,exports){
'use strict';var _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},SwipeListener=function(a,b){if(a){'undefined'!=typeof window&&function(){function a(a,b){b=b||{bubbles:!1,cancelable:!1,detail:void 0};var c=document.createEvent('CustomEvent');return c.initCustomEvent(a,b.bubbles,b.cancelable,b.detail),c}return'function'!=typeof window.CustomEvent&&void(a.prototype=window.Event.prototype,window.CustomEvent=a)}();b||(b={}),b=_extends({},{minHorizontal:10,minVertical:10,deltaHorizontal:3,deltaVertical:5,preventScroll:!1,lockAxis:!0,touch:!0,mouse:!0},b);var c=[],d=!1,e=function(){d=!0},f=function(a){d=!1,h(a)},g=function(a){d&&(a.changedTouches=[{clientX:a.clientX,clientY:a.clientY}],i(a))};b.mouse&&(a.addEventListener('mousedown',e),a.addEventListener('mouseup',f),a.addEventListener('mousemove',g));var h=function(d){var e=Math.abs,f=Math.max,g=Math.min;if(c.length){for(var h='function'==typeof TouchEvent&&d instanceof TouchEvent,j=[],k=[],l={top:!1,right:!1,bottom:!1,left:!1},m=0;m<c.length;m++)j.push(c[m].x),k.push(c[m].y);var i=j[0],n=j[j.length-1],o=k[0],p=k[k.length-1],q={x:[i,n],y:[o,p]};if(1<c.length){var r={detail:_extends({touch:h,target:d.target},q)},s=new CustomEvent('swiperelease',r);a.dispatchEvent(s)}var t=j[0]-j[j.length-1],u='none';u=0<t?'left':'right';var v,w=g.apply(Math,j),x=f.apply(Math,j);if(e(t)>=b.minHorizontal&&('left'==u?(v=e(w-j[j.length-1]),v<=b.deltaHorizontal&&(l.left=!0)):'right'==u?(v=e(x-j[j.length-1]),v<=b.deltaHorizontal&&(l.right=!0)):void 0),t=k[0]-k[k.length-1],u='none',u=0<t?'top':'bottom',w=g.apply(Math,k),x=f.apply(Math,k),e(t)>=b.minVertical&&('top'==u?(v=e(w-k[k.length-1]),v<=b.deltaVertical&&(l.top=!0)):'bottom'==u?(v=e(x-k[k.length-1]),v<=b.deltaVertical&&(l.bottom=!0)):void 0),(c=[],l.top||l.right||l.bottom||l.left)){b.lockAxis&&((l.left||l.right)&&e(i-n)>e(o-p)?l.top=l.bottom=!1:(l.top||l.bottom)&&e(i-n)<e(o-p)&&(l.left=l.right=!1));var y={detail:_extends({directions:l,touch:h,target:d.target},q)},z=new CustomEvent('swipe',y);a.dispatchEvent(z)}else{var A=new CustomEvent('swipecancel',{detail:_extends({touch:h,target:d.target},q)});a.dispatchEvent(A)}}},i=function(d){var e=d.changedTouches[0];if(c.push({x:e.clientX,y:e.clientY}),1<c.length){var f=c[0].x,g=c[c.length-1].x,h=c[0].y,i=c[c.length-1].y,j={detail:{x:[f,g],y:[h,i],touch:'function'==typeof TouchEvent&&d instanceof TouchEvent,target:d.target}},k=new CustomEvent('swiping',j),l=!0===b.preventScroll||'function'==typeof b.preventScroll&&b.preventScroll(k);l&&d.preventDefault(),a.dispatchEvent(k)}},j=!1;try{var k=Object.defineProperty({},'passive',{get:function(){j={passive:!b.preventScroll}}});window.addEventListener('testPassive',null,k),window.removeEventListener('testPassive',null,k)}catch(a){}return b.touch&&(a.addEventListener('touchmove',i,j),a.addEventListener('touchend',h)),{off:function(){a.removeEventListener('touchmove',i,j),a.removeEventListener('touchend',h),a.removeEventListener('mousedown',e),a.removeEventListener('mouseup',f),a.removeEventListener('mousemove',g)}}}};'undefined'!=typeof module&&'undefined'!=typeof module.exports?(module.exports=SwipeListener,module.exports.default=SwipeListener):'function'==typeof define&&define.amd?define([],function(){return SwipeListener}):window.SwipeListener=SwipeListener;
},{}],3:[function(require,module,exports){
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

function setup($) {

	var cssTransitionSupport = require('./transition-support')();

	var defaults = {
			delay: 5000 					/* The delay between the changes in slides */
	};

	var Shiner = function(selector, context, jList) {
		this.selector = selector
		this.delay = defaults.delay
		this.context = context
		this.jList = jList
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

		var $newCur = $(this.slidesArray[1])

		this.slides.removeClass('left right')
		this.makeInvisible(this.slidesArray[0], false)
		this.makeVisible(this.slidesArray[1])
		this.makeNext(this.slidesArray[2])
		var last = this.slidesArray.shift()
		this.slidesArray.push(last)

		this.setupNextSlideTimer($newCur.attr('data-delay') || this.delay)
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

		var $newCur = $(this.slidesArray[0])

		this.setupNextSlideTimer($newCur.attr('data-delay') || this.delay)

	}

	/**
	* Starts the slide show by setting up a timer to change the slides
	*/
	Shiner.prototype.shineOn = function(slidesSelector) {
		this.shineOff();
		this.setupNextSlideTimer(this.delay)
	}

	Shiner.prototype.setupNextSlideTimer = function(delay) {
		var self = this
		this.timerId = setTimeout(function() { 
			self.goToNext() }
		, delay);
	}

	/**
	* Stops the timer and thus the slide show
	*/
	Shiner.prototype.shineOff = function() {
		if(this.timerId) {
			clearTimeout(this.timerId);
		}
		
		this.timerId = null;
	}

	/**
	* sets up the slides by making them all invisible and then making the first one visible.
	*/
	Shiner.prototype.initShine = function(options) {
		if(options && options.delay) {
			this.delay = options.delay
		}

		var slides
		if(this.jList) {
			slides = this.slides = this.jList
		}
		else if(this.context) {
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
			if(window.shinerShowStart) {
				window.shinerShowStart(self)
			}
		}, window.shinerStartDelay || 100);

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
		var shiner	
		if(this.selector) {
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
		}
		else {
			shiner = new Shiner(null, null, this)
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

	return Shiner
}

module.exports = setup


},{"./transition-support":5}],4:[function(require,module,exports){
function start($, Shiner, SwipeListener) {
	$(function () {
		var total = $('.shiner-show .slide').length

		if (total > 1) {
			$('.shiner-show .slide').addClass('invisible').eq(0).removeClass('invisible').addClass('visible')
			$('.shiner-show').addClass('transitions-on')

			var options = {}
			if (window.shinerDelay) {
				options.delay = window.shinerDelay
			}

			var shine = $('.shiner-show .slide').shiner(options)
			if(window.shine) {
				if(Array.isArray(window.shine)) {
					window.shine.push(shine)
				}
				else {
					var s = window.shine
					window.shine = [s]
				}
			}
			else {
				window.shine = shine
			}


			$('.shiner-show .advance').on('click', function (evt) {
				shine.next()
			})
			$('.shiner-show .previous').on('click', function (evt) {
				shine.previous()
			})

			shine.onVisible = function (slide, ind) {
				var $placeOf = $('.shiner-show .place-of')
				if ($placeOf.length > 0) {
					$placeOf.html((ind + 1) + ' of ' + total)
				}

				var $theShow = $(slide).closest('.shiner-show')
				$theShow.find('.dot').removeClass('current').eq(ind).addClass('current')
			}
			var slideCount = $('.shiner-show .slide').length
			
			var $dots = $('.shiner-show .dots')
			if($('.shiner-show .dots .dot').length < 1) {
				if ($dots.length > 0) {
					for (var i = 0; i < slideCount; i++) {
						$dots.append('<div class="dot"></div>')
					}
				}
			}
            
            $dots.find('.dot').eq(0).addClass('current')
            $dots.find('.dot').on('click', function(evt) {
                var $dot = $(this)
                var pos = $dot.index()
                shine.showSlide(pos)
            })

			var container = $('.shiner-show').get(0)
			try {
				window.shinerSwipeListener = SwipeListener(container)
				container.addEventListener('swipe', function (e) {
					var directions = e.detail.directions
					var x = e.detail.x
					var y = e.detail.y

					if (directions.left) {
						shine.next()
					}
					if (directions.right) {
						shine.previous()
					}
				})
			}
			catch(e) {
				
			}

			if(window.shinerShowReady) {
				window.shinerShowReady(shine)
			}

		}
		else {
			$('.shiner-show .slide').removeClass('invisible').addClass('visible')
			$('.shiner-show').addClass('transitions-on')
		}
	})
}

module.exports = start
},{}],5:[function(require,module,exports){
var hasTransitionSupport = function(){

        // body element
    var body = document.body || document.documentElement,

        // transition events with names
        transEndEvents = {
            'transition'      : 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition'   : 'transitionend',
            'MsTransition'    : 'MSTransitionEnd',
            'OTransition'     : 'oTransitionEnd otransitionend'
        }, name;

    // check for each transition type
    for (name in transEndEvents){

        // if transition type is supported
        if (body.style[name] !== undefined) {

            // return transition end event name
            return transEndEvents[name];
        }
    }

    // css transitions are not supported
    return false;
}

module.exports = hasTransitionSupport
},{}]},{},[1]);
