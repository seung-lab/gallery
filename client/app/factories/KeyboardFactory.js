'use strict';

(function (){
app.factory("KeyboardFactory", ["$document", "$timeout",
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
})();