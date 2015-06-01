var app = angular.module("SongPane", []);

app.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/").when("/set/:setId/:songId").when("/:view/:songId").otherwise("/")
}]);
    
// app.run(["$rootScope", "collection", "util", "transitioner", "keyboard", "modal", "notifier", "$window", "platform", "locale",
//     function($rootScope, collection, util, transitioner, keyboard, modal, notifier, $window, platform, locale) {
//             var m = ($window.navigator, locale._);
//             $window.notify = notifier.notify;
//             $rootScope._ = m;
//             $rootScope.change = !1;
//             $rootScope.$on("ready", function() {
//                 $rootScope.ready = true;
//             });
//             $rootScope.sets = $rootScope.sets = collection({
//                 songs: [],
//                 isNeeded: function(a) {
//                     var b = this.songs,
//                     transitioner = a.songs;
//                     return transitioner.forEach(function(a) {
//                         var e = a._id;
//                         transitioner[e] = a, util.list(b, e)
//                     }), !0
//                 },
//                 getSong: function(a, b) {
//                     var c, d, e = this[a].songs;
//                     for (d = 0, c = e.length; c > d; d++)
//                         if (e[d]._id == b) return e[d]
//                     },
//                 url: "sets.json"
//             });
//             $rootScope.songs = collection({
//                 url: "songs.json",
//                 getKey: function(a, b) {
//                     var c = b && $rootScope.sets.getSong(b, a),
//                     transitioner = l[a];
//                     return c && c.key || transitioner.key
//                 }
//             });
//             $rootScope.sets.run(function() {
//                 $rootScope.songs.run(function() {
//                     $rootScope.$emit("ready")
//                 })
//             });
//             $rootScope.modal = modal;

//             $rootScope.toggleState = function(b) {
//                 $rootScope[b] = !$rootScope[b]
//                 $rootScope.changedState = true;
//             };
//             $rootScope.resetState = function() {
//                 return $rootScope.changedState ? void($rootScope.changedState = !1) : void["menu", "em"].forEach(function(b) {
//                     $rootScope[b] && ($rootScope[b] = !1);
               
//                 });
//             };
//             keyboard.on("ctrl+shift", function() {
//                 $rootScope.slow = !$rootScope.slow;
//             });
//             keyboard.on(["h", "?"], function() {
//                 return modal("keyboard"), $rootScope.$apply(), false
//             });
//             keyboard.on("esc", function() {
//                 return false;
//             });
// }]);

app.run(["$rootScope", "collection", "util", "transitioner", "keyboard", "modal", "notifier", "$window", "platform", "locale", function(a, b, c, d, e, f, g, h, i, j) {
                        var k, l, m = (h.navigator, j._);
                        h.notify = g.notify, a._ = m, a.change = !1, a.$on("ready", function() {
                            a.ready = !0
                        }), k = a.sets = b({
                            songs: [],
                            isNeeded: function(a) {
                                var b = this.songs,
                                    d = a.songs;
                                return d.forEach(function(a) {
                                    var e = a._id;
                                    d[e] = a, c.list(b, e)
                                }), !0
                            },
                            getSong: function(a, b) {
                                var c, d, e = this[a].songs;
                                for (d = 0, c = e.length; c > d; d++)
                                    if (e[d]._id == b) return e[d]
                            },
                            url: "sets.json"
                        }), l = a.songs = b({
                            url: "songs.json",
                            getKey: function(a, b) {
                                var c = b && k.getSong(b, a),
                                    d = l[a];
                                return c && c.key || d.key
                            }
                        }), k.run(function() {
                            l.run(function() {
                                a.$emit("ready")
                            })
                        }), a.modal = f, a.toggleState = function(b) {
                            a[b] = !a[b], a.changedState = !0
                        }, a.resetState = function() {
                            return a.changedState ? void(a.changedState = !1) : void["menu", "em"].forEach(function(b) {
                                a[b] && (a[b] = !1)
                            })
                        }, e.on("ctrl+shift", function() {
                            a.slow = !a.slow
                        }).on(["h", "?"], function() {
                            return f("keyboard"), a.$apply(), !1
                        }).on("esc", function() {
                            return !1
                        })
                    }]);




var f = function() {
    var a = navigator.userAgent,
    b = {}, c = {};
    window.location.search.substring(1).split("&").forEach(function(a) {
        a = a.split("=");
        c[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
    });
    c.android ? (b.name = "android", b.version = c.android, b.native = !0) : c.ios ? (b.name = "ios", b.version = c.ios, b.native = !0) : /AppleWebKit/.test(a) && /Mobile\/\w+/.test(a) ? b.name = "ios" : ~a.toLowerCase().indexOf("firefox") && (b.name = "ff"), b.name && (document.documentElement.className += " " + b.name)
    app.constant("platform", b)
}(window);



 
var k = function(a, b) {
    app.service("util", ["$window",
        function(c) {
            var d = this,
            e = c.document,
            f = c.setTimeout,
            g = c.clearTimeout;
            d.toArray = function(a) {
                return a && a.forEach ? a : [a]
            }, d.list = function(a, b) {
                var c = a.length;
                return d.toArray(b).forEach(function(b) {
                    var c = a.indexOf(b);~
                    c || a.push(b)
                }), a.length - c
            }, d.unlist = function(a, b) {
                var c = a.indexOf(b);
                return~ c && a.splice(c, 1), a.length
            }, d.move = function(a, b, c) {
                return a.splice(c, 0, a.splice(b, 1)[0]), a
            }, d.pad = function(a, b) {
                return Array(a + 1).join(b || " ")
            }, d.buildUrl = function(c, e) {
                if (!e) return c;
                var f = [];
                return a.forEach(e, function(c, e) {
                    null !== c && c !== b && (a.isObject(c) && (c = d.toJson(c)), f.push(encodeURIComponent(e) + "=" + encodeURIComponent(c)))
                }), c + (-1 == c.indexOf("?") ? "?" : "&") + f.join("&")
            }, d.element = function(b) {
                return a.isString(b) && (b = e.getElementById(b)), a.element(b)
            }, d.randomHex = function(a) {
                for (var b = ""; a > 0;) b += Math.floor(Math.random() * Math.pow(10, 16)).toString(16).substr(0, 8 > a ? a : 8), a -= 8;
                    return b
            }, d.generateId = function() {
                return Math.floor(Date.now() / 1e3).toString(16) + d.randomHex(16)
            }, d.throttle = function(a, b) {
                var c = null;
                return function() {
                    var d = this,
                    e = arguments;
                    g(c), c = f(function() {
                        a.apply(d, e), c = null
                    }, b)
                }
            }, d.keys = Object.keys, d.toJson = c.JSON.stringify, ["copy", "extend", "forEach", "identity", "fromJson", "isObject", "isString", "isArray", "lowercase", "noop"].forEach(function(b) {
                d[b] = a[b]
            })
        }
        ])
}(angular);

app.value("songMode", {
    startState: function() {
        return {
            next: "part"
        }
    },
    token: function(a, b) {
        var c = null;
        return "part" == b.next ? a.match(/^\[[1-9BCPIO]\](?=$|\n)/) ? (c = "part", b.next = "chords") : a.skip() : "chords" == b.next ? a.eat("\n") ? (c = "chords", b.next = "chord") : a.skip() : "chord" == b.next ? a.eat("\n") ? b.next = "text" : a.eatWhile(" ") ? /^[A-G]$/.test(a.peek()) || a.skip() : a.match(/^[A-G][#b12345679adgijmsu,\(\)]*(?:\/[A-G][#b]?)?(?=($| +|\n))/) ? c = "chord" : a.skip() : "text" == b.next ? a.match(/^.+\S/) ? (c = "text", b.next = "partOrChords") : a.skip() : "partOrChords" == b.next ? a.match(/^\n(?=\[)/) ? b.next = "part" : a.eat("\n") ? (c = "chords", b.next = "chord") : a.skip() : a.skip(), c
    }
});