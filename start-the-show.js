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
			window.shine = shine


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
			if ($dots.length > 0) {
				for (var i = 0; i < slideCount; i++) {
					$dots.append('<div class="dot"></div>')
                }
                $dots.find('.dot').eq(0).addClass('current')
            }
            
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


		}
		else {
			$('.shiner-show .slide').removeClass('invisible').addClass('visible')
			$('.shiner-show').addClass('transitions-on')
		}
	})
}

module.exports = start