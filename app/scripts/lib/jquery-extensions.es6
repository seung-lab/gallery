
(function ($) {

/* scrollTo
*
* Smoothly scrolls to a particular element.
*
* Required:
*   [0] target: The element to scroll to
*
* Optional:
*     msec: defaults to 250 msec
*     easing: defaults to ease-in-out-cubic
*	   offset: extra offset in pixels
*
* Return: void
*/
$.fn.scrollTo = function (target, options) {
	var _this = $(this);

	if (target === null) {
		target = $(this);
	}

	if (options === undefined || typeof(options) === 'function') {
		options = {};
	}

	var msec = options.msec === undefined ? 250 : options.msec;
	var easing = options.easing || Easing.smootherstep;
	var offset = options.offset || 0;

	target = $(target).first();
	
	var position_offset = target.position().top + offset;

	if (position_offset === 0) {
		return $.Deferred().resolve();
	}

	var distance_traveled = 0;
	var start_pos = this.scrollTop();

	var req;

	var deferred = $.Deferred()
		.done(function () {
			_this.scrollTop(start_pos + position_offset);
		})
		.fail(function () {
			if (req) {
				cancelAnimationFrame(req);
			}
		});

	if (msec < 0.0001) {
		return deferred.resolve();
	}

	var start_time = window.performance.now();

	function animate () {
		var now = window.performance.now();
		var t = (now - start_time) / msec;

		if (t >= 1) {
			deferred.resolve();
			return;
		}
		  
		var proportion = easing(t);

		distance_traveled = proportion * position_offset;
		_this.scrollTop(start_pos + distance_traveled);

		req = requestAnimationFrame(animate);
	}

	req = requestAnimationFrame(animate);

	return deferred;
};

$.fn.drop = function (args) {
	args = args || {};

	var _this = $(this);

	var msec = args.msec,
		easing = args.easing || Easing.linear,
		displacement = args.displacement || 0, // dimensionless fraction of displacement
		side = args.side || 'top';
 	
	var css = _this.css(side);

	var start_pos;
	if (css.match(/calc/)) {
		start_pos = css.replace(/calc\(/, '').replace(/\)$/, '');
	}
	else {
		start_pos = css;
	}

 	var start_time = window.performance.now();

 	_this.css(side, `calc(${start_pos} + ${displacement}px)`);

 	var req;

	var deferred = $.Deferred()
 		.done(function () {
 			_this.css(start_pos);
 		})
 		.fail(function () {
 			if (req) {
 				cancelAnimationFrame(req);
 			}
 		});

 	var distance_traveled = 0;

 	function animate () {
		var now = window.performance.now();
 		var t = (now - start_time) / msec;

 		if (t >= 1) {
 			deferred.resolve();
 			return;
 		}
 		
 		var proportion = easing(t);

 		distance_traveled = proportion * displacement;
 		_this.css(side, `calc(${start_pos} + ${displacement - distance_traveled}px)`);

 		req = requestAnimationFrame(animate);
 	}

 	req = requestAnimationFrame(animate);

 	return deferred;
};

/* cycle
 *
 * A replacement for jQuery's confusing 
 * toggle routine that also is extended to
 * take an event handler type.
 * 
 * When a cycle is attached to an element,
 * each activation of that event will trigger
 * the next in the sequence. It will loop to the
 * beginning.
 *
 * e.g. $('div.clicky').cycle('click.cycle1', function (evt) {
 * 
 * }, function (evt) {
 * 
 * }, ... );
 *
 * Required:
 *	[0] type: The event type (e.g. click, mousedown, keyup, etc)   
 *  [1...n] fn: Event handler function
 *
 * Return: this
 */
$.fn.cycle = function () { // (type, fn1, fn2, fn3, .... )
	// arguments is array-like, not an array so we need to convert it
	var args = Array.prototype.slice.call(arguments); 
	var type = args.shift(); // discard type
	var fns = args;

	if (!fns.length || !type) {
		return this;
	}

	var iteration = 0;

	$(this).on(type, function () {
		iteration = iteration % fns.length;
		var fn = fns[iteration];
		iteration++;

		fn.apply(this, arguments);
	});

	return this;
};

/* ion
 *
 * i(dempotent)on. When you do $(selector).on('click', fn)
 * and you don't recreate the element each time, 
 * you have to remember to write it as $(selector).off('click').on('click', fn)
 * to avoid adding the event repeatedly.
 *
 * With this function, you only have to wite this: $(selector).ion('click', fn)
 *
 * Required: Same as jQuery.on
 *
 * Return: this
 */
$.fn.ion = function (type, fn) {
	return $(this).off(type).on(type, fn);
};

/* stationaryClick
 *
 * Isolates a click from a drag.
 *
 * Algorithm: Cancel click handler if a significant mouse move was triggered
 * 			  This is so that we can avoid having to press e.g. shift to do
 * 			  cube selection.
 * 
 * 			  A significant mouse move is a radial distance greater than 
 * 			  one pixel. Zero works as well, but one allows for shaky hands.
 *
 * Required:
 *   [0] fn
 *
 * Return: this
 */
$.fn.stationaryClick = function (fn) {
	var oldpos = { x: 0, y: 0 };
	var fire_mouse_up = true;

	return $(this)
		.mousedown(function (e) {
			fire_mouse_up = true;
			oldpos = eventOffset(this, e);
		})
		.mousemove(function (e) {
			var newpos = eventOffset(this, e);
			var r2 = Math.pow(newpos.x - oldpos.x, 2) + Math.pow(newpos.y - oldpos.y, 2);

			if (r2 > 1) { // r > 1 pixels
				fire_mouse_up = false;
			}
		})
		.mouseup(function () {
			if (fire_mouse_up) {
				fn.apply($(this), arguments);
			}
		});
};

/* drag
 *
 * Fire only when the mouse button is depressed and the mouse is moving.
 *
 * Required:
 *   [0] fn - callback
 *
 * Return: self
 */
$.fn.drag = function (fn) {
	var dragging = false;

	var elem = $(this);

	var klass = 'drag-' + _placeholderid;
	_placeholderid++;

	return elem
		.on('mousedown', function (evt) {
			dragging = true;

			var which = evt.which,
				button = evt.button;

			$(document).on('mousemove.' + klass, function () {
				if (!dragging) { return; }

				arguments[0].which = which;
				arguments[0].button = button;

				fn.apply(elem, arguments);
			});

			$(document).one('mouseup', function () {
				dragging = false;
				$(document).off('mousemove.' + klass);
			});
		});
};

function eventOffset (elem, evt) {
	"use strict";

	if (evt.originalEvent) {
		evt = evt.originalEvent;
	}

	var offset = { x: 0, y: 0 };

	if (!(evt.offsetX || evt.offsetY)) {
		offset.x = evt.pageX - $(elem).offset().left;
		offset.y = evt.pageY - $(elem).offset().top;
	} 
	else {
		offset.x = evt.offsetX + ($(evt.target).offset().left - $(elem).offset().left);
		offset.y = evt.offsetY + ($(evt.target).offset().top - $(elem).offset().top);
	}

	return offset;
}

})(jQuery);