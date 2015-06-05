app.factory("collection", ["$http", "util",
  function($http, util) {

    var run = function(callback) {
      this.syncDown(callback || util.noop);
      return  this;
    };
    var syncDown = function(callback) {
      var c = this;
      var url = util.buildUrl(this.url, this.params);

      $http.get(url).success(function(jsonArray) {
        jsonArray.forEach(function(element) {
          this[element._id] ? this.saveLocal(element) : c.add(element, null)
        })
      }).success(callback).error(callback)

      return this;
    };
    var saveLocal = function(a) {
      var b = this,
      id = a._id;
      "trash" == a.status ? b.removeLocal(id) : util.extend(b[id], a)
    };

    var add = function(element, b) {

      var c = this;
      if (this.isNeeded(element)){
        this[element._id] = element;
        this.push(element);
      } 
      else {
        this.aux[element._id] = element;
        this.aux.push(element);
      } 
      if(b){
        b.call(c, element);
      }

      console.log(this);
    };
    var removeLocal = function(a) {
      var b = this;
      util.unlist(b, b[a]), delete b[a]
    };
    var remove = function(a) {
      var b = this;
      return b[a].status = "trash", util.unlist(b, b[a]), b.save(b[a], function() {
        b.removeLocal(a)
      })
    };
    var save = function(a, b) {
      var c = this,
      e = a._id;
      if (e || (e = a._id = util.generateId(), a._acl || (a._acl = {}), a._acl.creator = "demo@cellpane.com", !c.onNew || c.onNew(a))) return c[e] ? util.extend(c[e], a) : c.push(c[e] = a), b && b(), e
    };
    var isOwner = function() {
      return !0
    };
    var isWriter = function(a) {
      return this.isOwner(a) || a._acl.w && ~a._acl.w.indexOf(auth.id())
    };
    var getOwner = function(a) {
      return this[a]._acl.creator
    };
    var addReader = function(a, b) {
      var c = this,
      e = c[a]._acl.r;
      return e || (e = c[a]._acl.r = []), util.list(e, b), c
    };
    var addWriter = function(a, b) {
      var c = this,
      e = c[a]._acl.w;
      return e || (e = c[a]._acl.w = []), util.list(e, b), c
    };
    var removeReader = function(a, b) {
      var c = this,
      e = c[a]._acl.r;
      return e && util.unlist(e, b), c
    };
    var removeWriter = function(a, b) {
      var c = this,
      e = c[a]._acl.w;
      return e && util.unlist(e, b), c
    };
    var getReaders = function(a) {
      var b = this[a]._acl;
      return b && b.r || []
    };
    var getWriters = function(a) {
      var b = this[a]._acl;
      return b && b.w || []
    };
    var setReaders = function(a, b) {
      var c = this,
      d = c[a]._acl;
      return d.r = b, c
    };
    var setWriters = function(a, b) {
      var c = this,
      d = c[a]._acl;
      return d.w = b, c
    };
    //This is overwrite for cells and sets
    var isNeeded = function() {
          return true;
    }
    return function(argObject) {
      var srcObject = {
        url: "",
        run: run,
        save: save,
        remove: remove,
        isOwner: isOwner,
        isWriter: isWriter,
        getOwner: getOwner,
        syncDown: syncDown,
        addWriter: addWriter,
        addReader: addReader,
        removeWriter: removeWriter,
        removeReader: removeReader,
        getReaders: getReaders,
        getWriters: getWriters,
        setReaders: setReaders,
        setWriters: setWriters,
        add: add,
        saveLocal: saveLocal,
        removeLocal: removeLocal,
        isNeeded: isNeeded
      };

      //Extends the destination object dst by copying own enumerable properties from the src and arg object(s) to dst. 
      var dstObject = [];
      util.extend(dstObject, srcObject, argObject);
      return dstObject;
    }
  }]);

app.factory("locale", function() {
  var locale = {};
  var languages = locale.langs = [{
    code: "cs",
    name: "Czech",
    "native": "Česky"
  }, {
    code: "da",
    name: "Danish",
    "native": "Dansk"
  }, {
    code: "de",
    name: "German",
    "native": "Deutsch"
  }, {
    code: "en",
    name: "English",
    "native": "English"
  }, {
    code: "es",
    name: "Spanish",
    "native": "Español"
  }, {
    code: "fr",
    name: "French",
    "native": "Français"
  }, {
    code: "it",
    name: "Italian",
    "native": "Italiano"
  }, {
    code: "lv",
    name: "Latvian",
    "native": "Latviešu"
  }, {
    code: "lt",
    name: "Lithuanian",
    "native": "Lietuvių"
  }, {
    code: "hu",
    name: "Hungarian",
    "native": "Magyar"
  }, {
    code: "nl",
    name: "Dutch",
    "native": "Nederlands"
  }, {
    code: "no",
    name: "Norwegian",
    "native": "Norsk"
  }, {
    code: "pl",
    name: "Polish",
    "native": "Polski"
  }, {
    code: "pt",
    name: "Portuguese",
    "native": "Português"
  }, {
    code: "ro",
    name: "Romanian",
    "native": "Română"
  }, {
    code: "sq",
    name: "Albanian",
    "native": "Shqip"
  }, {
    code: "sk",
    name: "Slovak",
    "native": "Slovenčina"
  }, {
    code: "sl",
    name: "Slovene",
    "native": "Slovenščina"
  }, {
    code: "fi",
    name: "Finnish",
    "native": "Suomi"
  }, {
    code: "sv",
    name: "Swedish",
    "native": "Svenska"
  }, {
    code: "tr",
    name: "Turkish",
    "native": "Türkçe"
  }, {
    code: "el",
    name: "Greek",
    "native": "Ελληνικά"
  }, {
    code: "bg",
    name: "Bulgarian",
    "native": "български"
  }, {
    code: "ru",
    name: "Russian",
    "native": "Pусский"
  }, {
    code: "uk",
    name: "Ukrainian",
    "native": "Українська"
  }];
  return locale._ = {
    editCell: "Edit Cell",
    newCell: "New Cell",
    addToSet: "Add to Set",
    renameSet: "Rename Set",
    shareSet: "Share Set",
    settings: "Settings",
    noConnection: "Could not connect to the server!",
    outOfSync: "cellPane is out of sync. Please make sure you have an active internet connection.",
    quotaExceeded: "The local storage limit has been reached or local storage is disabled.",
    alert: "Alert",
    copy: "copy",
    keyboard: "Keyboard Shortcuts",
    illegalOperation: "You tried to perform an illegal operation!",
    key: "Key",
    currentKey: "Current Key",
    originalKey: "Original Key",
    tempo: "Tempo",
    signature: "Signature",
    timeSignature: "Time Signature",
    artist: "Artist(s)",
    copyright: "Copyright",
    profile: "Profile",
    buddies: "Buddies",
    remove: "Remove",
    owner: "Owner",
    save: "Save",
    add: "Add",
    addToNewSet: "Add the cell to a new set",
    addToExistingSet: "or an existing set",
    selectSet: "Select a set",
    hideChords: "Hide chords",
    toggleXZGrid: "Show XZ Grid",
    toggleYZGrid: "Show YZ Grid",
    toggleXYGrid: "Show XY Grid",
    toggleGround: "Show Ground",
    toggleAxes: "Show Axes",
    disconnect: "Disconnect",
    disconnectAccount: "Disconnect account",
    cellname: "Cell Name",
    cellDescription: "Cell Description",
    nameSet: "Give this set a name",
    done: "Done",
    email: "Email",
    password: "Password",
    createAccount: "Create Account",
    resetPassword: "Reset Password",
    searchcells: "Search cells",
    filtercells: "Filter cells",
    sets: "Sets",
    catalog: "Catalog",
    search: "Search",
    noSets: "No Sets",
    creatingSets: "Sets are created by adding cells to them.",
    emptyCatalog: "Empty Catalog",
    aboutCatalog: "The catalog contains all the cells that you use or cells that you add to cellPane.",
    noResults: "No Results",
    searching: "Searching...",
    wait: "Wait...",
    standalone: "To enjoy this app to the fullest we recommend adding it to your Home Screen.",
    loggedOut: "You have been logged out.",
    notFound: "The resource was not found on the server.",
    genericError: "Something went wrong and it’s probably our fault.",
    confirm: "Are you sure?",
    explainDelcell: "Deleting the cell makes it unavailable to any set that is currently using it!",
    del: "Delete",
    cancel: "Cancel",
    nextcellOrSet: "Next cell or set",
    prevcellOrSet: "Previous cell or set",
    toggleChords: "Toggle chord display",
    changeFontSize: "Decrease/increase font size",
    fontSize: "Font size",
    small: "Small",
    medium: "Medium",
    large: "Large",
    priv: "Private",
    pub: "Public",
    language: "Language",
    visibility: "Visibility",
    toggleFullscreen: "Toggle fullscreen",
    toggleInfo: "Toggle cell info",
    toggleHelp: "Toggle help (this screen)",
    toggleSettings: "Toggle settings",
    esc: "Cancel actions, close modal windows",
    checkBody: "Please check the body of the cell.",
    sharedSet: "A new set has been shared with you!",
    checkEmail: "Please check your email.",
    invalidCredentials: "Invalid credentials!",
    SPInvalidData: "The data you submitted was invalid.",
    SPOperationNotPermitted: "You are trying to perform an illegal operation.",
    SPInvalidQuery: ""
  }, languages.forEach(function(lang) {
    languages[lang.code] = lang
  }), locale
});


app.factory("md5", function() {
  function a(a, b) {
    var g = a[0],
    h = a[1],
    i = a[2],
    j = a[3];
    g = c(g, h, i, j, b[0], 7, -680876936), j = c(j, g, h, i, b[1], 12, -389564586), i = c(i, j, g, h, b[2], 17, 606105819), h = c(h, i, j, g, b[3], 22, -1044525330), g = c(g, h, i, j, b[4], 7, -176418897), j = c(j, g, h, i, b[5], 12, 1200080426), i = c(i, j, g, h, b[6], 17, -1473231341), h = c(h, i, j, g, b[7], 22, -45705983), g = c(g, h, i, j, b[8], 7, 1770035416), j = c(j, g, h, i, b[9], 12, -1958414417), i = c(i, j, g, h, b[10], 17, -42063), h = c(h, i, j, g, b[11], 22, -1990404162), g = c(g, h, i, j, b[12], 7, 1804603682), j = c(j, g, h, i, b[13], 12, -40341101), i = c(i, j, g, h, b[14], 17, -1502002290), h = c(h, i, j, g, b[15], 22, 1236535329), g = d(g, h, i, j, b[1], 5, -165796510), j = d(j, g, h, i, b[6], 9, -1069501632), i = d(i, j, g, h, b[11], 14, 643717713), h = d(h, i, j, g, b[0], 20, -373897302), g = d(g, h, i, j, b[5], 5, -701558691), j = d(j, g, h, i, b[10], 9, 38016083), i = d(i, j, g, h, b[15], 14, -660478335), h = d(h, i, j, g, b[4], 20, -405537848), g = d(g, h, i, j, b[9], 5, 568446438), j = d(j, g, h, i, b[14], 9, -1019803690), i = d(i, j, g, h, b[3], 14, -187363961), h = d(h, i, j, g, b[8], 20, 1163531501), g = d(g, h, i, j, b[13], 5, -1444681467), j = d(j, g, h, i, b[2], 9, -51403784), i = d(i, j, g, h, b[7], 14, 1735328473), h = d(h, i, j, g, b[12], 20, -1926607734), g = e(g, h, i, j, b[5], 4, -378558), j = e(j, g, h, i, b[8], 11, -2022574463), i = e(i, j, g, h, b[11], 16, 1839030562), h = e(h, i, j, g, b[14], 23, -35309556), g = e(g, h, i, j, b[1], 4, -1530992060), j = e(j, g, h, i, b[4], 11, 1272893353), i = e(i, j, g, h, b[7], 16, -155497632), h = e(h, i, j, g, b[10], 23, -1094730640), g = e(g, h, i, j, b[13], 4, 681279174), j = e(j, g, h, i, b[0], 11, -358537222), i = e(i, j, g, h, b[3], 16, -722521979), h = e(h, i, j, g, b[6], 23, 76029189), g = e(g, h, i, j, b[9], 4, -640364487), j = e(j, g, h, i, b[12], 11, -421815835), i = e(i, j, g, h, b[15], 16, 530742520), h = e(h, i, j, g, b[2], 23, -995338651), g = f(g, h, i, j, b[0], 6, -198630844), j = f(j, g, h, i, b[7], 10, 1126891415), i = f(i, j, g, h, b[14], 15, -1416354905), h = f(h, i, j, g, b[5], 21, -57434055), g = f(g, h, i, j, b[12], 6, 1700485571), j = f(j, g, h, i, b[3], 10, -1894986606), i = f(i, j, g, h, b[10], 15, -1051523), h = f(h, i, j, g, b[1], 21, -2054922799), g = f(g, h, i, j, b[8], 6, 1873313359), j = f(j, g, h, i, b[15], 10, -30611744), i = f(i, j, g, h, b[6], 15, -1560198380), h = f(h, i, j, g, b[13], 21, 1309151649), g = f(g, h, i, j, b[4], 6, -145523070), j = f(j, g, h, i, b[11], 10, -1120210379), i = f(i, j, g, h, b[2], 15, 718787259), h = f(h, i, j, g, b[9], 21, -343485551), a[0] = k(g, a[0]), a[1] = k(h, a[1]), a[2] = k(i, a[2]), a[3] = k(j, a[3])
  }

  function b(a, b, c, d, e, f) {
    return b = k(k(b, a), k(d, f)), k(b << e | b >>> 32 - e, c)
  }

  function c(a, c, d, e, f, g, h) {
    return b(c & d | ~c & e, a, c, f, g, h)
  }

  function d(a, c, d, e, f, g, h) {
    return b(c & e | d & ~e, a, c, f, g, h)
  }

  function e(a, c, d, e, f, g, h) {
    return b(c ^ d ^ e, a, c, f, g, h)
  }

  function f(a, c, d, e, f, g, h) {
    return b(d ^ (c | ~e), a, c, f, g, h)
  }

  function g(b) {
    var c, d = b.length,
    e = [1732584193, -271733879, -1732584194, 271733878];
    for (c = 64; c <= b.length; c += 64) a(e, h(b.substring(c - 64, c)));
      b = b.substring(c - 64);
    var f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (c = 0; c < b.length; c++) f[c >> 2] |= b.charCodeAt(c) << (c % 4 << 3);
      if (f[c >> 2] |= 128 << (c % 4 << 3), c > 55)
        for (a(e, f), c = 0; 16 > c; c++) f[c] = 0;
          return f[14] = 8 * d, a(e, f), e
  }

  function h(a) {
    var b, c = [];
    for (b = 0; 64 > b; b += 4) c[b >> 2] = a.charCodeAt(b) + (a.charCodeAt(b + 1) << 8) + (a.charCodeAt(b + 2) << 16) + (a.charCodeAt(b + 3) << 24);
      return c
  }

  function i(a) {
    for (var b = "", c = 0; 4 > c; c++) b += m[a >> 8 * c + 4 & 15] + m[a >> 8 * c & 15];
      return b
  }

  function j(a) {
    for (var b = 0; b < a.length; b++) a[b] = i(a[b]);
      return a.join("")
  }

  function k(a, b) {
    return a + b & 4294967295
  }

  function l(a) {
    return j(g(a || ""))
  }
  var m = "0123456789abcdef".split("");
    return l
});

app.factory("setOperations", function(){
  
  var so = {};

  var uidList = [];
  var uid;

  // Create and push the uid identity method.
  uidList.push(uid = function() {
    return this;
  });

  // Push a new uid method onto the stack. Call this and
  // supply a unique key generator for sets of objects.
  // so.pushUid = function(method) {
  //   uidList.push(method);
  //   uid = method;
  //   return method;
  // };

  // // Pop the previously pushed uid method off the stack and
  // // assign top of stack to uid. Return the previous method.
  // so.popUid = function() {
  //   var prev;
  //   uidList.length > 1 && (prev = uidList.pop());
  //   uid = uidList[uidList.length-1];
  //   return prev || null;
  // };

  // Processes a histogram consructed from two arrays, 'a' and 'b'.
  // This function is used generically by the below set operation 
  // methods, a.k.a, 'evaluators', to return some subset of
  // a set union, based on frequencies in the histogram. 
  function process(a, b, evaluator) {
    // Create a histogram of 'a'.
    var hist = Object.create(null), out = [], ukey, k;
    a.forEach(function(value) {
      ukey = uid.call(value);
      if(!hist[ukey]) {
        hist[ukey] = { value: value, freq: 1 };
      }
    });
    // Merge 'b' into the histogram.
    b.forEach(function(value) {
      ukey = uid.call(value);
      if (hist[ukey]) {
        if (hist[ukey].freq === 1)
          hist[ukey].freq = 3;
      } else {
        hist[ukey] = { value: value, freq: 2 };
      }
    });
    // Call the given evaluator.
    if (evaluator) {
      for (k in hist) {
        if (evaluator(hist[k].freq)) out.push(hist[k].value);
      }
      return out;
    } else {
      return hist;
    }
  };

  // Join two sets together.
  // Set.union([1, 2, 2], [2, 3]) => [1, 2, 3]
  so.union = function(a, b) {
    return process(a, b, function(freq) {
      return true;
    });
  };

  // Return items common to both sets. 
  // Set.intersection([1, 1, 2], [2, 2, 3]) => [2]
  so.intersection = function(a, b) {
    return process(a, b, function(freq) {
      return freq === 3;
    });
  };

  // Symmetric difference. Items from either set that
  // are not in both sets.
  // Set.difference([1, 1, 2], [2, 3, 3]) => [1, 3]
  so.difference = function(a, b) {
    return process(a, b, function(freq) {
      return freq < 3;
    });
  };

  // Relative complement. Items from 'a' which are
  // not also in 'b'.
  // Set.complement([1, 2, 2], [2, 2, 3]) => [3]
  so.complement = function(a, b) {
    return process(a, b, function(freq) {
      return freq === 1;
    });
  };

  // Returns true if both sets are equivalent, false otherwise.
  // Set.equals([1, 1, 2], [1, 2, 2]) => true
  // Set.equals([1, 1, 2], [1, 2, 3]) => false
  so.equals = function(a, b) {
    var max = 0, min = Math.pow(2, 53), key,
      hist = process(a, b);
    for (var key in hist) {
      max = Math.max(max, hist[key].freq);
      min = Math.min(min, hist[key].freq);
    }
    return min === 3 && max === 3;
  };

  return so;
});

app.factory("modal", ["$rootScope", "$location", "$routeParams", "transitioner", "$timeout",
  function(a, b, c, d, e) {
    function f(a) {
      b.search("modal", a || null)
    }
    var g = function(b) {
      return a.modalClass ? (a.modalClass = "", d.apply("modal", function() {
        f(), b != c.modal && e(function() {
          f(b)
        })
      })) : b && f(b), !0
    };
    return g.isOn = function(b) {
      return b ? a.modalClass === b : a.modalClass
    }, g
  }
]);

app.factory("notifier", function() {
    var a, b = {
      name: "",
      icon: "info",
      delay: 5e3
    }, c = [],
    d = Object.keys;
    return {
      setCallback: function(b) {
        return a = b, this
      },
      notify: function(e) {
        return d(b).forEach(function(a) {
          e[a] || (e[a] = b[a])
        }), c.push(e), a && a(e), this
      },
      get: function() {
        return c
      }
    }
});

app.factory("touch", ["$window", "$timeout",
  function($window, $timeout) {
    function c(a) {
      
      s && (a = a.touches[0] || a.changedTouches[0]);
      return {
        x: a.pageX,
        y: a.pageY
      }
    }

    function d(a) {
      var b = c(a);
      return b.dx = b.x - p.x, b.dy = b.y - p.y, b
    }

    function e(a, b) {
      return sqrt(pow(b.x - a.x, 2) + pow(b.y - a.y, 2))
    }

    function processHold(a) {
      p = c(a), n = a.target, q = $timeout(function() {
        i("hold", p, a), o = !0
      }, 1e3)
    }

    function processMove(a) {
      (o ? i("drag", d(a), a) : $timeout.cancel(q))
    }

    function processRelease(a) {
      ($timeout.cancel(q), o ? i("release", d(a), a) : e(c(a), p) < 10 && i("tap", a), n =  o = !1)
    }

    function i(a, b, c) {
      for (var d, e, f = n; f && f != $window.document && (d = f.parentNode, e = u.indexOf(f), -1 == e || !v[e][a] || !1 !== v[e][a](c, b));) f = d
    }
  
    var touch = {};
    
    var hold, move, release, n, o, p, q, s = "ontouchstart" in $window,
    u = [],
    v = [],
    pow = Math.pow,
    sqrt = Math.sqrt;
    
    s ? (hold = "touchstart", move = "touchmove", release = "touchend") : (hold = "mousedown", move = "mousemove", release = "mouseup");

    $window.document.addEventListener(hold, processHold, true);
    $window.document.addEventListener(move, processMove, true);
    $window.document.addEventListener(release, processRelease, true);
    ["tap", "hold", "drag", "release"].forEach(function(event) {
      touch[event] = function(b, c) {
        b.length && (b = b[0]);
        var d = u.indexOf(b); - 1 == d && (d = u.push(b) - 1, v[d] = {}), v[d][event] = c
      }
    });

    return  touch;
  }
]);

app.factory("transitioner", ["$rootScope", "$document", "util",
  function(a, b, c) {
    function d() {
      var a, c = b[0].createElement("dummy"),
      d = {
        transition: "transitionend",
        OTransition: "oTransitionEnd",
        MSTransition: "msTransitionEnd",
        MozTransition: "transitionend",
        WebkitTransition: "webkitTransitionEnd"
      };
      for (a in d)
        if (void 0 !== c.style[a]) return d[a]
      }
    var e = d(),
    f = {}, g = [];
    return e && b.bind(e, function(b) {
      var c = b.target.id;
      if (c && c in f) {
        for (; f[c].length;) a.$apply(f[c].shift());
          delete f[c]
      }
    }), {
      apply: function(a, b, c) {
        return e ? (a in f && !c || (f[a] = []), void f[a].push(b)) : void b()
      },
      after: function(a, b, d) {
        a[0] && (a = a[0]), a.id || (a.id = c.generateId()), this.apply(a.id || g.push(a) - 1, b, d)
      }
    }
  }
  ]);

app.factory("transposer", function() {
  var a = /C##|D##|E##|F##|G##|A##|B##|Cbb|Dbb|Ebb|Fbb|Gbb|Abb|Bbb|C#|D#|E#|F#|G#|A#|B#|Cb|Db|Eb|Fb|Gb|Ab|Bb|C|D|E|F|G|A|B/g,
  b = [
  ["C", "C#", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B", "Cb"],
  ["Am", "A#m", "Bbm", "Bm", "Cm", "C#m", "Dm", "D#m", "Ebm", "Em", "Fm", "F#m", "Gm", "G#m", "Abm"]
  ],
  c = [
  ["C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "B#", "Cb"],
  ["C#", "C##", "D", "D#", "D##", "E", "E#", "E##", "F", "F#", "F##", "G", "G#", "G##", "A", "A#", "A##", "B", "B#", "B##", "C"],
  ["Db", "D", "Ebb", "Eb", "E", "Fb", "F", "F#", "Gbb", "Gb", "G", "Abb", "Ab", "A", "Bbb", "Bb", "B", "Cb", "C", "C#", "Dbb"],
  ["D", "D#", "Eb", "E", "E#", "F", "F#", "F##", "G#", "G", "G#", "Ab", "A", "A#", "Bb", "B", "B#", "C", "C#", "C##", "Db"],
  ["Eb", "E", "Fb", "F", "F#", "Gb", "G", "G#", "Abb", "Ab", "A", "Bbb", "Bb", "B", "Cb", "C", "C#", "Db", "D", "D#", "Ebb"],
  ["E", "E#", "F", "F#", "F##", "G", "G#", "G##", "Ab", "A", "A#", "Bb", "B", "B#", "C", "C#", "C##", "D", "D#", "D##", "Eb"],
  ["F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bbb", "Bb", "B", "Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb"],
  ["F#", "F##", "G", "G#", "G##", "A", "A#", "A##", "Bb", "B", "B#", "C", "C#", "C##", "D", "D#", "D##", "E", "E#", "E##", "F"],
  ["Gb", "G", "Abb", "Ab", "A", "Bbb", "Bb", "B", "Cbb", "Cb", "C", "Dbb", "Db", "D", "Ebb", "Eb", "E", "Fb", "F", "F#", "Gbb"],
  ["G", "G#", "Ab", "A", "A#", "Bb", "B", "B#", "Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "F", "F#", "F##", "Gb"],
  ["Ab", "A", "Bbb", "Bb", "B", "Cb", "C", "C#", "Dbb", "Db", "D", "Ebb", "Eb", "E", "Fb", "F", "F#", "Gb", "G", "G#", "Abb"],
  ["A", "A#", "Bb", "B", "B#", "C", "C#", "C##", "Db", "D", "D#", "Eb", "E", "E#", "F", "F#", "F##", "G", "G#", "G##", "Ab"],
  ["Bb", "B", "Cb", "C", "C#", "Db", "D", "D#", "Ebb", "Eb", "E", "Fb", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bbb"],
  ["B", "B#", "C", "C#", "C##", "D", "D#", "D##", "Eb", "E", "E#", "F", "F#", "F##", "G", "G#", "G##", "A", "A#", "A##", "Bb"],
  ["Cb", "C", "Dbb", "Db", "D", "Ebb", "Eb", "E", "Fbb", "Fb", "F", "Gbb", "Gb", "G", "Abb", "Ab", "A", "Bbb", "Bb", "B", "Cbb"]
  ];
  return {
    getKeys: function(a) {
      return b[Number(a)]
    },
    getAllKeys: function() {
      return b[0].concat(b[1])
    },
    getScale: function(a) {
      return c[b["m" === a.slice(-1) ? 1 : 0].indexOf(a)]
    },
    transpose: function(d, e, f) {
      var g = "m" === e.slice(-1) ? 1 : 0,
      h = b[g].indexOf(e),
      i = b[g].indexOf(f);
      return d.replace(a, function(a) {
        return c[i][c[h].indexOf(a)]
      })
    }
  }
});

app.factory("parse", ["$window",
  function() {
    function a(a) {
      var b = this;
      b.pos = b.start = 0, b.string = a
    }
    return a.prototype = {
      eof: function() {
        return this.pos >= this.string.length
      },
      sof: function() {
        return !this.pos
      },
      eol: function() {
        return this.pos >= this.string.length || "\n" == this.string.charAt(this.pos)
      },
      sol: function() {
        return !this.pos || "\n" == this.string.charAt(this.pos - 1)
      },
      peek: function() {
        return this.string.charAt(this.pos) || null
      },
      next: function() {
        return this.pos < this.string.length && this.string.charAt(this.pos++)
      },
      eat: function(a) {
        var b, c = this.string.charAt(this.pos);
        return b = "string" == typeof a ? c == a : c && (a.test ? a.test(c) : a(c)), b ? (++this.pos, c) : void 0
      },
      eatWhile: function(a) {
        for (var b = this.pos; this.eat(a););
          return this.pos > b
      },
      eatSpace: function() {
        for (var a = this.pos;
          /[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;
          return this.pos > a
      },
      skip: function() {
        this.pos = this.string.length
      },
      skipTo: function(a) {
        var b = this.string.indexOf(a, this.pos);
        return~ b ? (this.pos = b, !0) : void 0
      },
      skipLine: function() {
        return this.skipTo("\n") && this.pos < this.string.length && ++this.pos
      },
      backUp: function(a) {
        this.pos -= a
      },
      column: function() {
        return this.start
      },
      match: function(a, b) {
        if ("string" != typeof a) {
          var c = this.string.slice(this.pos).match(a);
          return c && b !== !1 && (this.pos += c[0].length), c
        }
        return this.string.indexOf(a, this.pos) == this.pos ? (b !== !1 && (this.pos += a.length), !0) : void 0
      },
      current: function() {
        return this.string.slice(this.start, this.pos)
      }
    },
    function(b, c, d) {
      var e, f, g = c.startState() || !0;
      for (e = new a(b); !e.eof();) f = c.token(e, g), d(e.current(), f), e.start = e.pos
    }
  }
]);

//This factory is consume by the settings controller
app.factory("settings", function() {

  var instance = {
    settings: {
      toggleGround: true,
      toggleAxes: true,
      toggleXZGrid: true,
      toggleXYGrid: true
    },
    set: function(property, value) {
      console.log("setting property "+property);
      this.settings[property] = value;
    },
    toggle: function(property) {
      this.set(property, !this.settings[property])
    }
  };

  return instance;
});

app.factory("keyboard", ["$document", "$timeout",
  function($document, $timeout) {

  var supraKeys = {
    "~": "`",
    "!": "1",
    "@": "2",
    "#": "3",
    "$": "4",
    "%": "5",
    "^": "6",
    "&": "7",
    "*": "8",
    "(": "9",
    ")": "0",
    "_": "-",
    "+": "=",
    ":": ";",
    '"': "'",
    "<": ",",
    ">": ".",
    "?": "/",
    "|": "\\"
    };

    var ascii = {
    backspace: 8,
    tab: 9,
    enter: 13,
    "return": 13,
    shift: 16,
    ctrl: 17,
    control: 17,
    alt: 18,
    option: 18,
    capslock: 20,
    esc: 27,
    escape: 27,
    space: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    ins: 45,
    insert: 45,
    del: 46,
    "delete": 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    meta: 91,
    command: 91,
    "super": 91,
    windows: 91,
    "*": 106,
    "+": 107,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    ";": 186,
    "=": 187,
    ",": 188,
    "-": 189,
    ".": 190,
    "/": 191,
    "`": 192,
    "[": 219,
    "\\": 220,
    "]": 221,
    "'": 222
  };


  $document.bind("keydown", process);
  $document.bind("keyup", process);

  var f;
  var i = {}
  var j = [];

  function process(event) {
    var d, e;
    var key = event.keyCode;
    var eventType = event.type;
    var target = event.target;

    if (93 == key || 224 == key) {
      key = 91;
    }

    if( key > 95 && 106 > key ) {
      key -= 48;
    }

    if (110 == key) {key = 190;}
    if (109 == key) {key = 189;}
    if (111 == key) {key = 191;}

    if ("keyup" == eventType){
      e = j.indexOf(key);
      if(1 !== e){
        j.splice(e, 1)
      }
      if(3 == target.nodeType ) {
        target = target.parentNode;
      }
    }

    if ("INPUT" == target.tagName 
      || "SELECT" == target.tagName 
      || "TEXTAREA" == target.tagName 
      || target.contentEditable 
      && "true" == target.contentEditable) {

      if (27 != key) return;
      
      target.blur()
    }

    if ("keydown" == eventType) {
      if (-1 !== j.indexOf(key)) return;
      j.push(key), f && $timeout.cancel(f), f = $timeout(function() {
        j.length = 0
      }, 1e3, !1)
    }
    d = i[eventType + ":" + j.join("+")], d && d.forEach(function(b) {
      b(event) === !1 && (event.preventDefault && event.preventDefault(), event.stopPropagation && event.stopPropagation(), event.returnValue = !1, event.cancelBubble = !0)
    })
  }

  function d(a, b) {
    var c = [],
    d = "+" === a ? ["+"] : a.split("+");
    return d.forEach(function(a) {
      supraKeys[a] && (c.push(16), a = supraKeys[a]), ascii[a] && c.push(ascii[a])
    }), b + ":" + c.join("+")
  }

  function e(a, b) {
    var c, e;
    for (e in a) c = d(e, b), i[c] || (i[c] = []), i[c].push(a[e])
  }



  var keyboard = {
    on: function() {
      var a = arguments,
      b = a[0],
      c = a[2],
      d = {};
      return "string" == typeof b ? d[b] = a[1] : Array.isArray(b) ? b.forEach(function(b) {
        d[b] = a[1]
      }) : (d = a[0], c = a[1]), e(d, c || "keydown"), this
    },
    off: function(a, b) {
      var c = d(a, b);
      return i[c] && delete i[c], this
    },
    reset: function() {
      return i = {}, this
    }
  };
  return keyboard
  }
]);