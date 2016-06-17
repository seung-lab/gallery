let Easing = {};

(function () {

/* springFactory
 *
 * Generate a physically realistic easing curve for a damped mass-spring system (for underdamped springs)
 *
 * Associated article: https://medium.com/analytic-animations/the-spring-factory-4c3d988e7129#.tlgybekxu
 *
 * Required:
 *   damping (zeta): [0, 1)
 *   halfcycles: 0...inf
 *
 * Optional:
 *   initial_position: -1..1, default 1
 *   initial_velocity: -inf..+inf, default 0
 *
 * Return: f(t), t in 0..1
 */
Easing.springFactory = function (args = {}) {
  var zeta = args.damping,
    k = args.halfcycles,
    y0 = nvl(args.initial_position, 1),
    v0 = args.initial_velocity || 0;

  var A = y0;

  var B, omega;

  // If v0 is 0, an analytics solution exists, otherwise,
  // we need to numerically solve it.
  if (Math.abs(v0) < 1e-6) {
    B = zeta * y0 / Math.sqrt(1 - zeta * zeta);
    omega = computeOmega(A, B, k, zeta);
  } 
  else {
    var result = numericallySolveOmegaAndB({
      zeta: zeta,
      k: k,
      y0: y0,
      v0: v0,
    });

    B = result.B;
    omega = result.omega;
  }

  omega *= 2 * Math.PI;
  var omega_d = omega * Math.sqrt(1 - zeta * zeta);

  return function(t) {
    var sinusoid = A * Math.cos(omega_d * t) + B * Math.sin(omega_d * t);
    return Math.exp(-t * zeta * omega) * sinusoid;
  };
}

function computeOmega(A, B, k, zeta) {

  // Haven't quite figured out why yet, but to ensure same behavior of
  // k when argument of arctangent is negative, need to subtract pi
  // otherwise an extra halfcycle occurs. 
  //
  // It has someting to do with -atan(-x) = atan(x),
  // the range of atan being (-pi/2, pi/2) which is a difference of pi 
  //
  // The other way to look at it is that for every integer k there is a
  // solution and the 0 point for k is arbitrary, we just want it to be
  // equal to the thing that gives us the same number of halfcycles as k.
  if (A * B < 0 && k >= 1) {
    k--;
  }

  return (-Math.atan(A / B) + Math.PI * k) / (2 * Math.PI * Math.sqrt(1 - zeta * zeta));
}


// Resolve recursive definition of omega an B using bisection method
function numericallySolveOmegaAndB (args) {
  args = args || {};

  var zeta = args.zeta,
    k = args.k,
    y0 = nvl(args.y0, 1),
    v0 = args.v0 || 0;

  // See https://en.wikipedia.org/wiki/Damping#Under-damping_.280_.E2.89.A4_.CE.B6_.3C_1.29
  // B and omega are recursively defined in solution. Know omega in terms of B, will numerically
  // solve for B.

  function errorfn (B, omega) {
    var omega_d = omega * Math.sqrt(1 - zeta * zeta);
    return B - ((zeta * omega * y0) + v0) / omega_d;
  }

  var A = y0,
    B = zeta; // initial guess, no good theoretical reason why

  var omega, error, direction;

  function step () {
    omega = computeOmega(A, B, k, zeta);
    error = errorfn(B, omega);
    direction = -Math.sign(error);
  }

  step();

  var tolerence = 1e-6;
  var lower, upper;

  var ct = 0,
    maxct = 1e3;

  if (direction > 0) {
    while (direction > 0) {
      ct++;

      if (ct > maxct) {
        break;
      }

      lower = B;

      B *= 2;
      step();
    }

    upper = B;
  } 
  else {
    upper = B;

    B *= -1;

    while (direction < 0) {
      ct++;

      if (ct > maxct) {
        break;
      }

      lower = B;

      B *= 2;
      step();
    }

    lower = B;
  }

  while (Math.abs(error) > tolerence) {
    ct++;

    if (ct > maxct) {
      break;
    }

    B = (upper + lower) / 2;
    step();

    if (direction > 0) {
      lower = B;
    } 
    else {
      upper = B;
    }
  }

  return {
    omega: omega,
    B: B,
  };
}

/* bounceFactory
 *
 * Simulate a physical bouncing motion based on physics equations of motion.
 *
 * We assume mass and gravity = 1 as they are immaterial when we normalize both
 * the y and t axis to 1. The length of the animation in msec will determine "gravity".
 *
 * Article: https://medium.com/analytic-animations/the-bounce-factory-3498de1e5262 
 *
 * Required:
 *   [0] bounces: (int > 0) Number of bounces 
 * 
 * Optional:
 *   [1] threshold: [0..1],  (default 0.1%) percent of energy remaining 
 *         at which to terminate the animation
 *
 * Return: f(t), t in 0..1
 */
Easing.bounceFactory = function (bounces, threshold = 0.001) {
	function energy_to_height (energy) {
		return energy; // h = E/mg
	}

	function height_to_energy (height) {
		return height; // E = mgh
	}

	function bounce_time (height) {
		return 2 * Math.sqrt(2 * height); // 2 x the half bounce time measured from the peak
	}

	function speed (energy) {
		return Math.sqrt(2 * energy); // E = 1/2 m v^2, s = |sqrt(2E/m)|
	}

	var height = 1;
	var potential = height_to_energy(height);

	var elasticity = Math.pow(threshold, 1 / bounces);
	
	// The critical points are the points where the object contacts the "ground"
	// Since the object is initially suspended at 1 height, this either creates an
	// exception for the following code, or you can use the following trick of placing
	// a critical point behind 0 and representing the inital position as halfway though
	// that arc.

	var critical_points = [{
		time: - bounce_time(height) / 2, 
		energy: potential,
	}, 
	{
		time: bounce_time(height) / 2,
		energy: potential * elasticity,
	}];

	potential *= elasticity;
	height = energy_to_height(potential);

	var time = critical_points[1].time;
	for (var i = 1; i < bounces; i++) {
		time += bounce_time(height);
		potential *= elasticity; // remove energy after each bounce

		critical_points.push({
			time: time,
			energy: potential,
		});

		height = energy_to_height(potential);
	}

	var duration = time; // renaming to emphasize it's the total time now

	return function (t) {
		t = clamp(t, 0, 1);

		var tadj = t * duration;

		if (tadj === 0) {
			return 0;
		}
		else if (tadj >= duration) {
			return 1;
		}

		// Find the bounce point we are bouncing from, for very long animations (hours, days),
		// an binary search algorithm might be appropriate.
		var index;
		for (index = 0; index < critical_points.length; index++) {
			if (critical_points[index].time > tadj) {
				break;
			}
		}

		var bouncept = critical_points[index - 1];

		// Bouncing from a bounce point effectively resets time as it is a discontinuity
		tadj -= bouncept.time; 

		var v0 = speed(bouncept.energy);

		// Project position of object from bounce point to the current time
		var pos = v0 * tadj + -0.5 * tadj * tadj;

		return 1 - pos;
	};
};

/* easeInOutFactory
 *
 * Generate an ease-in-out function with desired steepness.
 * Accompanying article: https://medium.com/analytic-animations/ease-in-out-the-sigmoid-factory-c5116d8abce9
 *
 * Note: Values below 7 may not come to a smooth stop.
 *
 * Required:
 *   k: (float), sharpness of ease
 *
 * Return: f(t), t in 0..1
 */
Easing.easeInOutFactory = function (k) {
	// there's a discontinuity at k = 0 that 
	// doesn't make sense from a usability perspective
	// So patch it over.
	k = (k === 0) ? 1e-7 : k; 

	function sigmoid (t) {
		return (1 / (1 + Math.exp(-k * t))) - 0.5;
	}

	var correction = 0.5 / sigmoid(1);

	return function (t) {
		t = clamp(t, 0, 1);
		return correction * sigmoid(2 * t - 1) + 0.5;
	};
};

/* easeOutFactory
 *
 * Generate an ease-out function with desired steepness.
 * Article: https://medium.com/analytic-animations/ease-out-the-half-sigmoid-7240df433d98#.yupto8l43
 *
 * Note: Values below 6 may not come to a smooth stop.
 *
 * Required:
 *   k: (float), sharpness of ease
 *   
 * Return: f(t), t in 0..1
 */
Easing.easeOutFactory = function (k) {
	// there's a discontinuity at k = 0 that 
	// doesn't make sense from a usability perspective
	// So patch it over.
	k = (k === 0) ? 1e-7 : k; 

	function sigmoid (t) {
		return (1 / (1 + Math.exp(-k * t))) - 0.5;
	}

	return function (t) {
		t = clamp(t, 0, 1);
		return sigmoid(t) / sigmoid(1);
	};
};

Easing.linear = function (t) { 
  return clamp(t, 0, 1);
};

// https://en.wikipedia.org/wiki/Smoothstep
Easing.smoothstep = function (t) {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t) ;
};

Easing.smootherstep = function (t) {
  t = clamp(t, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

function clamp (val, min, max) {
  return Math.min(Math.max(val, min), max);
};

})();

