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

var Shiner = require('./shiner-no-jquery')(jQuery)
module.exports = Shiner

