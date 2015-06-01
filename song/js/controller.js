
app.controller("addController", ["$scope", "$routeParams", "$rootScope",
    function($scope, $routeParams, $rootScope) {
        {
            var sets = $rootScope.sets;
        }
        $scope.s = sets.filter(function(a) {
            return sets.isWriter(a)
        });
        $scope.addNew = function(title) {

            return sets.save({
                title: title,
                songs: [{
                    _id: $routeParams.songId
                }]
            })
        };

        $scope.addExisting = function(a) {
            var songId = $routeParams.songId,
            e = sets[a],
            f = e.songs;
            return f[songId] ? true : (f.push(f[songId] = {
                _id: songId
            }), sets.save(e))
        }
    }
    ]);
app.controller("confirmController", ["$scope", "$routeParams", "$rootScope", "util", "$location",
    function(a, b, c, d, e) {
        var f = c.sets,
        g = c.songs;
        a.trashSong = function() {
            var a = b.songId,
            c = b.setId;
            return f.forEach(function(b) {
                d.unlist(b.songs, a) || f.remove(b._id)
            }), e.path((c ? "set" : b.view) + "/" + (f[c] ? c + "/" : "")), g.remove(a)
        }
    }
    ]);
app.controller("newController", ["$scope", "$rootScope", "transposer", "songMode", "$routeParams", "util", "locale", "notifier",
    function(a, b, c, d, e, f, g, h) {
        var i = b.songs,
        j = e.edit,
        k = g._;
        a.songMode = d, a.langs = g.langs, j && (a.song = f.extend({}, i[e.songId]), "clone" == j && delete a.song._id, a.song.tempo = a.song.tempo - 0), a.saveSong = function(a, b) {
            var d = "(" + c.getScale(a.key).join("|") + ")";
            return~ a.body.search("^(?:\\[[1-9BCPIO]\\]\\n(?:(?: *" + d + "[1-9adgijmsu,\\(\\)]*(?:\\/" + d + ")?)*\\n[^\\[\\n].+\\S(?:\\n|$))+)+$") ? (a._acl = {}, b && (a._acl = {
                gr: !1
            }), i.save(a)) : void h.notify({
                message: k.checkBody,
                icon: "alert"
            })
        }, a.keys = c.getAllKeys()
    }
    ]);
app.controller("renameController", ["$scope", "$rootScope",
    function(a, b) {
        var c = b.sets;
        a.renameSet = function(a, b) {
            var d = c[a];
            return b !== d.title ? (d.title = b, c.save(d)) : !1
        }
    }
    ]);
app.controller("searchController", ["$scope", "$rootScope", "locale",
    function(a, b, c) {
        b.songs;
        a._ = c._, a.message = "", a.search = function() {}
    }
    ]);
app.controller("settingsController", ["$scope", "settings",
    function(a, b) {
        a.s = b.settings, a.toggle = function(a) {
            b.toggle(a)
        }, a.setFont = function(a) {
            b.set("fontSize", a)
        }
    }
    ]);
app.controller("shareController", ["$scope", "$routeParams", "$rootScope", "md5", "util",
    function(a, b, c, d, e) {
        var f = e.list,
        g = e.unlist,
        h = c.sets,
        i = b.setId,
        j = a.e = h.getWriters(i).slice(0),
        k = a.c = h.getReaders(i).slice(0);
        a.owner = h.getOwner(i), a.md5 = d, a.allowAccess = function(a, b) {
            return f(k, a), "edit" == b ? f(j, a) : g(j, a), !0
        }, a.denyAccess = function(a) {
            g(j, a), g(k, a)
        }, a.isOwner = function() {
            return h.isOwner(h[i])
        }, a.save = function() {
            return h.setReaders(i, k).setWriters(i, j).save(h[i])
        }
    }
    ]);

app.controller("uiController", ["$scope", "$rootScope", "$routeParams", "$location", "settings", "util", "keyboard", "transposer", "transitioner", "locale", "$timeout", "modal", function(a, b, c, d, e, f, g, h, i, j, k, l) {
    function m(a, b, c) {
        var d, e, g, i, j, k, l, m, n, o = [];
        return a.split("[").forEach(function(a) {
            if ("" !== a) {
                for (d = a.split("]"), k = "", g = d[1].replace(/[\r\t\v\f\0\x0B]|^\n+|\s+$/g, "").split("\n"), i = 0, j = g.length; j > i; i += 2) {
                    for (e = g[i + 1], e.length < g[i].length && (e += f.pad(g[i].length - e.length, " ")), n = 0, l = /\S+/g; m = l.exec(g[i]);) k += e.substring(n, m.index) + '<span class="c"><span>' + (b !== c ? h.transpose(m[0], b, c) : m[0]) + "</span></span>", n = m.index;
                        k += g[i + 1].substr(n) + "\n"
                }
                o.push({
                    type: d[0].toLowerCase(),
                    text: k
                })
            }
        }), o
    }
    var n = j._,
    o = b.sets,
    p = b.songs,
    q = b.songSlide = {
        to: "left"
    },
    r = b.viewSlide = {
        to: "left"
    };
    b.r = c, b.p = function(a) {
        d.path(a)
    }, b.q = function(a, b) {
        d.search(a, b)
    }, b._ = n, a.s = e.settings, a.nextSong = function() {
        var a, b, e = c.setId,
        f = c.songId;
        e && f && (a = o[e].songs, a.forEach(function(a, c) {
            a._id == f && (b = c)
        }), b < a.length - 1 ? b++ : b = 0, d.path("/set/" + e + "/" + a[b]._id))
    }, a.prevSong = function() {
        var a, b, e = c.setId,
        f = c.songId;
        e && f && (a = o[e].songs, a.forEach(function(a, c) {
            a._id == f && (b = c)
        }), b > 0 ? b-- : b = a.length - 1, d.path("/set/" + e + "/" + a[b]._id))
    }, a.getKeys = function() {
        return c.songId && p[c.songId] && h.getKeys("m" === p[c.songId].key.slice(-1)) || []
    }, a.pad = f.pad, a.trashSet = function() {
        d.path("/"), o.remove(c.setId)
    }, a.duplicateSet = function() {
        var a = o[c.setId];
        d.path("set/" + o.save({
            title: a.title + " (" + n.copy + ")",
            songs: a.songs.slice(0)
        }) + "/")
    }, a.rmSong = function(b) {
        var e = c.setId,
        f = o[e],
        g = f.songs;
        d.path("set/" + e + "/"), g.splice(b, 1), g.length ? o.save(f) : a.trashSet()
    }, a.curKey = function() {
        var a = c.songId;
        return a && p.getKey(a, c.setId)
    }, a.updateKey = function(b, d) {
        var e, f, g = c.setId,
        h = c.songId,
        i = p[h];
        g && (e = o[g], f = o.getSong(g, h), b !== i.key ? f.key = b : delete f.key, !d && o.save(e)), a.k != b && (q.model = m(i.body, i.key, b), a.k = b)
    }, a.clean = function(a) {
        delete this[a]
    }, a.sortSet = function(a, b) {
        f.move(o, a, b)
    }, a.sortSong = function(a, b) {
        var d = o[c.setId];
        f.move(d.songs, a, b), o.save(d)
    }, a.isSongOwner = function() {
        return c.songId && p.isOwner(p[c.songId])
    }, a.editSong = function(a) {
        d.search("edit", a ? "clone" : void 0), l("new")
    }, a.canChangeKey = function() {
        var a = c.setId;
        return a ? o.isWriter(o[a]) : !0
    }, a.$on("$routeChangeSuccess", function(b, c, e) {
        if ("/" === d.path()) return void d.path(o.length ? "sets/" : "search/");
        if (c) {
            var f, g, h, j, k = c.params.view,
            l = c.params.setId,
            n = c.params.songId;
            if (e && (f = e.params.view, g = e.params.setId, h = e.params.songId), k) {
                if (-1 == ["sets", "catalog", "search"].indexOf(k)) return void d.path(o.length ? "sets/" : "search/");
                g ? (r.to = "right", r.model = k) : k != f && (r.to = "left", r.model = k)
            }
            if (l) {
                if (!o[l]) return void d.path(o.length ? "sets/" : "search/");
                l != g && (r.force = !0, r.to = "left", r.model = "set")
            }
            if (n) {
                if (!p[n]) return void d.path(k + "/");
                j = m(p[n].body, p[n].key, p.getKey(n, l)), a.k = a.curKey(), e ? n !== h && (g && g === l && o[l].songs.indexOf(n) < o[l].songs.indexOf(h) ? (q.to = "right", q.model = j) : (q.to = "left", q.model = j)) : (q.to = "left", q.model = j)
            } else h && i.apply("song-view", function() {
                q.model = ""
            })
        }
    }), g.on(["left", "k", "up", "pageup"], function() {
        return a.$apply(function() {
            a.prevSong()
        }), !1
    }).on("c", function() {
        return a.$apply(function() {
            e.toggle("hideChords")
        }), !1
    }).on("=", function() {
        var b = e.settings.fontSize || 0;
        2 > b && (e.set("fontSize", b + 1), a.$apply())
    }).on("-", function() {
        var b = e.settings.fontSize || 0;
        b && (e.set("fontSize", b - 1), a.$apply())
    }), a.$emit("$routeChangeSuccess", {
        params: c
    })
}]);