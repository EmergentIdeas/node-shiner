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