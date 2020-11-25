jQuery(function () {
    var $ = jQuery
    var SwipeListener = require('swipe-listener')

    var Shiner = require('./shiner-no-jquery')($)
    window.Shiner = Shiner
    require('./start-the-show')($, Shiner, SwipeListener)
})
