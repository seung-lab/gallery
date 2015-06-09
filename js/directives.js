app.directive("spSlide", ["util", "transitioner", function(util, transitioner) {
  return {
    transclude: "element",
    priority: 1e3,
    terminal: true,
    compile: function(a, c, d) {
      return function(a, e) {
        var f, g, h;
        var i = c.spSlide;
        var j = e.parent();
        j.addClass("t3d");
        a.$watch(function(a) {
          var c;
          var k = a.$eval(i);
          !k.model && h && (g.remove(), f.$destroy(), g = f = h = null), k.model && (k.model != h || k.force) && (k.force = !1, c = a.$new(), c.model = k.model , d(c, function(a) {
            if (e.after(a), g) {
              var d = g,
              i = f;
              "left" == k.to ? (a.addClass("tr"), j.addClass("transition tl")) : (a.addClass("tl"), j.addClass("transition tr")), g.bind("$destroy", function() {
                j.removeClass("transition tl tr"), a.removeClass("tr tl")
              });
              transitioner.apply(j[0].id, function() {
                d.remove(), i.$destroy()
              })
            }
            g = a;
            f = c;
            h = k.model;
          }))
        })
      }
    }
  }
}]);

app.directive("spSortable", ["touch", "$timeout", "util",
  function(a, b, c) {
    function d(a) {
      var b = 0;
      do b += a.prop("offsetTop") - a.prop("scrollTop"), a = c.element(a.prop("offsetParent")); while (void 0 !== a.prop("offsetTop"));
      return b
    }

    function e() {
      i && i.css("margin", ""), h + 1 < l.length && (i = l.eq(h + 1), i.css("marginTop", j - 1 + "px"))
    }
    var f, g, h, i, j, k, l, m, n, o, p = Math.min,
    q = Math.max;
    return function(r, s, t) {
      r.$watch(t.spSortable, function(u) {
        u || void 0 === u ? (a.hold(s, function(a, c) {
          a.preventDefault(), l = s.children();
          var i = l.eq(0);
          o = d(s), k = i.prop("offsetTop") - i.prop("scrollTop"), j = l[0].offsetHeight - 1, n = j * l.length, m = p(q(0, c.y - o - k), n), g = h = p(Math.floor(m / j), l.length - 1), f = l.eq(g), f.addClass("dragged").css("top", p(q(m + k - j / 2, 0), n - j / 2) + "px"), b(function() {
            s.addClass("sorting")
          }, 0, !1), e()
        }), a.drag(s, function(a, b) {
          a.preventDefault(), o = d(s);
          var c = p(q(0, b.y - o - k), n);
          if (f.css("top", p(q(c + k - j / 2, k), n - j / 2 - k) + "px"), h !== p(Math.floor(c / j), l.length - 1)) {
            var g = Math.round(c / j);
            g !== h && g !== h + 1 && (g > h ? (l.splice(g - 1, 0, l.splice(h, 1)[0]), h = g - 1) : (l.splice(g, 0, l.splice(h, 1)[0]), h = g), e())
          }
        }), a.release(s, function(a) {
          a.preventDefault(), s.removeClass("sorting"), i.css("margin", ""), f.removeClass("dragged").css("top", ""), r.$apply(t.onsort + "(" + g + "," + h + ")")
        })) : (a.hold(s, c.noop), a.drag(s, c.noop), a.release(s, c.noop))
})
}
}
]);

app.directive("spTap", ["touch", "keyboard",
  function(touch, keyboard) {
    return function(c, d, e) {
      touch.tap(d, function() {
        return c.$apply(e.spTap)
      });

      e.spKbd && keyboard.on(c.$eval(e.spKbd), function() {
        return c.$apply(e.spTap)
      })
    }
  }
  ]);

app.directive("spFocus", ["$timeout", "util",
  function(a) {
    function b(a) {
      if (a && 0 !== a.length) {
        var b = ("" + a).toLowercase;
        a = !("f" == b || "0" == b || "false" == b || "no" == b || "n" == b || "[]" == b)
      } else a = !1;
      return a
    }
    return function(c, d, e) {
      function f() {
        a(function() {
          g.focus()
        }, 400)
      }
      var g = d[0];
      0 === e.spFocus.length ? f() : c.$watch(e.spFocus, function(a) {
        b(a) && g.focus()
      })
    }
  }
  ]);

app.directive("spIf", function() {
  return {
    transclude: "element",
    priority: 1e3,
    terminal: !0,
    compile: function(a, b, c) {
      return function(a, b, d) {
        var e, f;
        a.$watch(d.spIf, function(d) {
          d ? e || (f = a.$new(), c(f, function(a) {
            e = a, b.after(a)
          })) : e && (e.remove(), f.$destroy(), e = f = void 0)
        })
      }
    }
  }
});

app.directive("spNotifier", ["util", "notifier", "transitioner", "$compile", "touch", "$timeout",
  function(a, b, c, d, e, f) {
    return {
      link: function(g, h) {
        function i(b) {
          function i() {
            m || (m = !0, k.removeClass("tl"), c.after(k, function() {
              k.remove(), n.$destroy(), k = n = null
            }))
          }
          var k, l, m, n = g.$new();
          a.extend(n, b), k = a.element(h.prepend(j).children()[0]), d(k.contents())(n), f(function() {
            k.addClass("tl")
          }), e.tap(k, i), l = f(i, b.delay || 5e3)
        }
        var j = '<div class="notification"><article ng-class="\'icon-\'+icon"><h6>{{name}}</h6><p>{{message}}</p></article></div>';
        b.setCallback(i).get().forEach(i)
      }
    }
  }
  ]);
app.directive("spParse", ["touch", "util",
  function() {
    return function(a, b, c) {
      var d = a.$eval(c.spParse),
      e = b.find("div"),
      f = b.find("textarea"),
      g = function() {
        var a = f.val();
        e.html(d(a) || "")
      };
      f.bind("keyup", g)
    }
  }
  ]);

app.directive("editor", ["$window", "util", "parse",
  function(a, b, c) {
    var d = a.document,
    e = a.setTimeout,
    f = a.clearTimeout;
    return {
      restrict: "E",
      replace: !0,
      transclude: !0,
      scope: {
        mode: "&",
        placeholder: "@",
        model: "="
      },
      template: '<div class="editor"><div class="editor-inner"><div></div><span class="hide"></span><textarea class="input" placeholder="{{placeholder}}" ng-model="model" ng-transclude></textarea></div></div>',
      link: function(a, g) {
        g = g.children()[0];
        var h, i = g.children,
        j = i[0],
        k = b.element(i[1]),
        l = i[2],
        m = a.mode(),
        n = b.throttle,
        o = 0,
        p = function() {
          var a = l.selectionStart || 0;
          a != o && (k.attr("pad", l.value.substr(0, a)).removeClass("hide"), o = a)
        }, q = function() {
          var a = d.createElement("div");
          p(), c(l.value, m, function(b, c) {
            var e;
            c && "chords" != c ? (e = a.appendChild(d.createElement("span")), e.className = c) : e = a, e.appendChild(d.createTextNode(b))
          }), g.replaceChild(a, j), j = a
        };
        b.element(l).bind("input", n(q, 10)).bind("focus", function() {
          ! function a() {
            p(), f(h), h = e(a, 100)
          }()
        }).bind("blur", function() {
          f(h), k.addClass("hide"), o = null
        }), e(q, 50)
      }
    }
  }
  ]);


//THREEJS
// Creates the directive (reusable chunk of html and javascript) for three.js.
// Note that right now the SceneService and CameraService are injected into the directive.  These
// services are used to manipulate the scene else where.
// Currently the Renderer and controls are part of the directive but could just as easily be 
// moved into their own services if functionality they provide need to be manipulated by a UI control.
app.directive('threeViewport', ['SceneService', 'CameraService','CellService', 'CoordinatesService' , 'settings', 'setOperations', 
  function (SceneService, CameraService, CellService, CoordinatesService, settings, setOperations) {

    function toggleViewBasedOnSettings (scope) {

      scope.$watch('s.toggleGround', function(show) {
        show ? CoordinatesService.drawGround({size:10000}) : CoordinatesService.removeGround();
      });

      scope.$watch('s.toggleAxes', function(show) {
        show ? CoordinatesService.drawAllAxes({axisLength:1000,axisRadius:50,axisTess:50}) : CoordinatesService.removeAxes();
      });

      scope.$watch('s.toggleYZGrid', function(show) {
        show ? CoordinatesService.drawGrid({size:10000,scale:0.001, orientation:"x"}) : CoordinatesService.removeGrid('x');
      });

      scope.$watch('s.toggleXZGrid', function(show) {
        show ? CoordinatesService.drawGrid({size:10000,scale:0.001, orientation:"y"}) : CoordinatesService.removeGrid('y');
      });

      scope.$watch('s.toggleXYGrid', function(show) {
        show ? CoordinatesService.drawGrid({size:10000,scale:0.001, orientation:"z"}) : CoordinatesService.removeGrid('z');
      });

    }
    
    function updateVisibleCells (scope) {
      var activeCells = new Set();
      scope.$watch('r.setId', function(setId){
        if(!setId){
          return;
        }
        var setIndex = scope.sets.getIndex(setId);
        var updatedCells = new Set(scope.sets[setIndex].cells);

        var toAdd = setOperations.complement(updatedCells,activeCells);
        toAdd.forEach(function(cellID){
            activeCells.add(cellID);
            CellService.addCell(cellID);
        });
        var toRemove = setOperations.complement(activeCells,updatedCells);
        toRemove.forEach(function(cellID){
            activeCells.delete(cellID);
            CellService.removeCell(cellID);
        });
      });

      scope.$watch("r.cellId", function(cellId){
        if (scope.viewSlide.model == "catalog" && cellId != ""){
          var updatedCells = new Set([cellId,]);
          var toAdd = setOperations.complement(updatedCells,activeCells);
          toAdd.forEach(function(cellID){
            activeCells.add(cellID);
            CellService.addCell(cellID);
          });
          var toRemove = setOperations.complement(activeCells,updatedCells);
          toRemove.forEach(function(cellID){
            activeCells.delete(cellID);
            CellService.removeCell(cellID);
          });

        }

      });
    }

    return {
      restrict: "AE",

      link: function (scope, element, attribute) {


        var renderer;
        var controls;

        init();
        animate();

      function init() {

        window.scope = scope;
        // Add the camera
        CameraService.perspectiveCam.position.set(1000, 20000, 1500);
        SceneService.scene.add(CameraService.perspectiveCam);

        // create the renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor( "#5Caadb", 1.0 );

        // set up the controls with the camera and renderer
        controls = new THREE.OrbitControls(CameraService.perspectiveCam, renderer.domElement);
        //controls = new THREE.TrackballControls( camera, renderer.domElement );
        // add renderer to DOM
        element[0].appendChild(renderer.domElement);

        // handles resizing the renderer when the window is resized
        window.addEventListener('resize', onWindowResize, false);  

        toggleViewBasedOnSettings(scope);
        updateVisibleCells (scope);
      
      }

      function animate() {
        requestAnimationFrame(animate);
        renderer.render(SceneService.scene, CameraService.perspectiveCam);
        controls.update();
      }

      function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        CameraService.perspectiveCam.aspect = window.innerWidth / window.innerHeight;
        CameraService.perspectiveCam.updateProjectionMatrix();
      }
    }
  }
}
]);

app.directive('twoViewport', ['TileService',
  function(TileService) {
    var viewSize = 256;
    var scene = new THREE.Scene();

    var canvasWidth = 640;
    var canvasHeight = 640;
    var aspectRatio = canvasWidth / canvasHeight;
    // left, right, top, bottom, near , far
    var _camera = new THREE.OrthographicCamera(
          -aspectRatio* viewSize/ 2, aspectRatio * viewSize /2,
          viewSize/ 2, - viewSize/2,
          -1000, 1000
          );

    scene.add(_camera);

    //Map to store the status of each tile

    TwoDCameraController = function ( camera, domElement ) {

      this.object = camera;
      this.domElement = ( domElement !== undefined ) ? domElement : document;

      // API
      this.center = new THREE.Vector3();
      this.userPan = true;
      this.userPanSpeed = 1.0;

      this.autoRotate = false;
      this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

      this.minPolarAngle = 0; // radians
      this.maxPolarAngle = Math.PI; // radians

      this.minDistance = 0;
      this.maxDistance = Infinity;

      // 65 /*A*/, 83 /*S*/, 68 /*D*/
      this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40, ROTATE: 65, ZOOM: 83, PAN: 68 };

      // internals

      var scope = this;

      var EPS = 0.000001;
      var PIXELS_PER_ROUND = 1800;

      var rotateStart = new THREE.Vector2();
      var rotateEnd = new THREE.Vector2();
      var rotateDelta = new THREE.Vector2();

      var zoomStart = new THREE.Vector2();
      var zoomEnd = new THREE.Vector2();
      var zoomDelta = new THREE.Vector2();

      var phiDelta = 0;
      var thetaDelta = 0;
      var scale = 1;

      var lastPosition = new THREE.Vector3();

      var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
      var state = STATE.NONE;

      var zpos = 0;

      // events

      var changeEvent = { type: 'change' };

      this.pan = function ( distance ) {

        this.object.position.add( distance );
        this.center.add( distance );

        var x = Math.round(this.center.x / 128);
        var y = Math.round(this.center.y / 128);

        TileService.createTileAndSurrounding({x: x, y:y}, scene);
      };

      function onMouseDown( event ) {

        if ( scope.enabled === false ) return;
        if ( scope.userRotate === false ) return;

        event.preventDefault();

        if ( state === STATE.NONE )
        {
          if ( event.button === 1 )
            state = STATE.ZOOM;
          if ( event.button === 2 )
            state = STATE.PAN;
        }
        
        
        if ( state === STATE.ZOOM ) {
          zoomStart.set( event.clientX, event.clientY );
        } 
        document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'mouseup', onMouseUp, false );
      }

      function onMouseMove( event ) {

        if ( scope.enabled === false ) return;

        event.preventDefault();
        
        if ( state === STATE.ZOOM ) {

          zoomEnd.set( event.clientX, event.clientY );
          zoomDelta.subVectors( zoomEnd, zoomStart );

          if ( zoomDelta.y > 0 ) {

            scope.zoomIn();

          } else {

            scope.zoomOut();

          }

          zoomStart.copy( zoomEnd );

        } else if ( state === STATE.PAN ) {

          var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
          var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

          scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

        }
      }

      function onMouseUp( event ) {

        if ( scope.enabled === false ) return;
        if ( scope.userRotate === false ) return;

        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );

        state = STATE.NONE;
      }

      function onMouseWheel( event ) {
        var delta = 0;

        if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
          delta = event.wheelDelta;
        } else if ( event.detail ) { // Firefox
          delta = - event.detail;
        }

        if ( delta > 0 ) {

          zpos = zpos + 1;
        } else {
          zpos = zpos - 1;
        }
        console.log('z position is '+ zpos);
      }

      function onKeyDown( event ) {
        switch ( event.keyCode ) {
          case scope.keys.ZOOM:
            state = STATE.ZOOM;
            break;
          case scope.keys.PAN:
            state = STATE.PAN;
            break;
            
        }
      }
      
      function onKeyUp( event ) {
        switch ( event.keyCode ) {
          case scope.keys.ZOOM:
          case scope.keys.PAN:
            state = STATE.NONE;
            break;
        }
      }

      this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
      this.domElement.addEventListener( 'mousedown', onMouseDown, false );
      this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
      this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
      window.addEventListener( 'keydown', onKeyDown, false );
      window.addEventListener( 'keyup', onKeyUp, false );

    };
    TwoDCameraController.prototype = Object.create( THREE.EventDispatcher.prototype );

  return {
      restrict: "AE",

      link: function (scope, element, attribute) {

        
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasHeight, canvasWidth);
        renderer.setClearColor( "#5Caadb", 1.0 );

        element[0].appendChild(renderer.domElement);


        TileService.createTileAndSurrounding({x:0, y:0},scene);

        var controls = new TwoDCameraController(_camera, renderer.domElement);

        animate();

        function animate() {
          requestAnimationFrame(animate);
          renderer.render(scene, _camera);
        }
      }
  };   
  }]
);