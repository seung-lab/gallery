
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