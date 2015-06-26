app.directive("spSlide", ["UtilService", "transitioner", function(util, transitioner) {
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

app.directive("spSortable", ["touch", "$timeout", "UtilService",
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

app.directive("spTap", ["touch", "KeyboardFactory",
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

app.directive("spFocus", ["$timeout", "UtilService",
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

app.directive("spNotifier", ["UtilService", "notifier", "transitioner", "$compile", "touch", "$timeout",
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
app.directive("spParse", ["touch", "UtilService",
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

app.directive("editor", ["$window", "UtilService", "parse",
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



app.directive('twoViewport', ['TileService','Camera2DController',
  function(TileService, cameraController) {
    var viewSize = 256;
    var scene = new THREE.Scene();

    var canvasWidth = 640;
    var canvasHeight = 640;
    var aspectRatio = canvasWidth / canvasHeight;
    // left, right, top, bottom, near , far
    camera = new THREE.OrthographicCamera(
          -aspectRatio* viewSize/ 2, aspectRatio * viewSize /2,
          viewSize/ 2, - viewSize/2,
          0, 10000
          );

    scene.add(camera);

  return {
      restrict: "AE",

      link: function (scope, element, attribute) {

        
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasHeight, canvasWidth);
        renderer.setClearColor( "#5Caadb", 1.0 );

        element[0].appendChild(renderer.domElement);


        function animate() {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        }

        // Set the origin tile
        TileService.volume({x:10, y:10, z:10}, function(volume){
          center = new THREE.Vector3();
          center.x = (volume.channel.xmax + volume.channel.xmin) / 2.0;
          center.y = (volume.channel.ymax + volume.channel.ymin) / 2.0;
          center.z = (volume.channel.zmax + volume.channel.zmin) / 2.0;
          camera.position.set(center.x , -center.y , center.z);
          var controls = cameraController.createControls( camera, renderer.domElement, scene , {x: viewSize, y:viewSize});

           animate();
        });
      }
  };   
}]);