function addShineToWindow(shine) {
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
}

function defaultPlaceOfText(ind, total, slide) {
	return (ind + 1) + ' of ' + total
}

function defaultDotCreator(slide) {
	let dot = document.createElement('div')
	dot.classList.add('dot')
	return dot
}


function create(Shiner, SwipeListener, 
	{showSelector = '.shiner-show',
	slideSelector = '.slide',
	dotsSelector = '.dots',
	dotSelector = '.dot',
	dotCreator = defaultDotCreator,
	advanceSelector = '.advance',
	previousSelector = '.previous',
	placeOfSelector = '.place-of',
	placeOfText = defaultPlaceOfText,
	slideDelay = window.shinerDelay || 5000
} = {}) {
	let shines = []
	let shows = document.querySelectorAll(showSelector)
	for(let show of shows) {
		let slides = show.querySelectorAll(slideSelector)
		if(slides.length >= 1) {
			slides.forEach(slide => slide.classList.add('invisible'))
			slides[0].classList.remove('invisible')
			slides[0].classList.add('visible')
		}
		if(slides.length > 1) {
			// create the show
			const shine = new Shiner(slideSelector, show)
			shine.internalSetup({
				delay: slideDelay
			})
			shines.push(shine)
			addShineToWindow(shine)
			show.shine = shine

			// listen to advance and previous clicks
			show.querySelectorAll(advanceSelector).forEach(button => {
				button.addEventListener('click', evt => {
					shine.next()
				})
			})
			show.querySelectorAll(previousSelector).forEach(button => {
				button.addEventListener('click', evt => {
					shine.previous()
				})
			})
			
			// add all the dots
			// let the option create the dot so that we could create something more
			// specific, like a preview image or thumbnail
			let dots = show.querySelector(dotsSelector)
			if(dots) {
				dots.append(...[...slides].map(dotCreator))

				let allDots = show.querySelectorAll(dotSelector)
				// set the first dot to be styled as current
				allDots[0].classList.add('current')
				
				// add a listener for each dot so that we change to the slide corresponding
				// to the dot when clicked
				let counter = 0
				allDots.forEach(dot => {
					const ind = counter++
					dot.addEventListener('click', evt => shine.showSlide(ind))	
				})
			}
			
			// initialize the place of value	
			show.querySelectorAll(placeOfSelector).forEach(placeOf => placeOf.innerHTML = placeOfText(0, slides.length))

			// update the dots and place of text box when the slide changes
			shine.onVisible = function(slide, ind) {
				show.querySelectorAll(placeOfSelector).forEach(placeOf => placeOf.innerHTML = placeOfText(ind, slides.length, slide))
				let dots = show.querySelectorAll(dotSelector)
				dots.forEach(dot => dot.classList.remove('current'))
				if(dots[ind]) {
					dots[ind].classList.add('current')
				}
			}
			
			// Setup swipe listener
			if(SwipeListener) {
				shine.swipeListener = SwipeListener(show)
				show.addEventListener('swipe', function (e) {
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
			
			// let everybody now we're running now
			if(window.shinerShowReady) {
				window.shinerShowReady(shine)
			}
		}
		setTimeout(function() {
			show.classList.add('transitions-on')
		}, 10)
	}
	return shines
}

module.exports = create