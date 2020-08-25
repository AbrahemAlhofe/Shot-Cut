// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inRange = exports.compute = exports.absMax = exports.onDragDrop = void 0;

function onDragDrop(element, mousedown, mousemove, mouseup) {
  var point_1 = {
    x: 0,
    y: 0
  };
  var isMouseUp = false;
  var isMouseDown = false;
  var isMouseMove = false;
  element.addEventListener("mousedown", function (e) {
    console.log(mousedown(e));

    if (mousedown(e)) {
      isMouseDown = true;
      isMouseUp = false;
      point_1 = {
        x: e.pageX,
        y: e.pageY
      };
    }
  });
  document.body.addEventListener("mouseup", function (e) {
    if (isMouseDown && isMouseMove) {
      isMouseUp = true;
      mouseup(e);
    }
  });
  document.body.addEventListener("mousemove", function (e) {
    if (!isMouseUp && isMouseDown) {
      isMouseMove = true;
      mousemove(e, {
        x: e.pageX - point_1.x,
        y: e.pageY - point_1.y
      });
    }
  });
}

exports.onDragDrop = onDragDrop;

function absMax(num, limit) {
  limit = limit * (num < 0 ? -1 : 1);
  return Math.abs(num) > Math.abs(limit) ? limit : num;
}

exports.absMax = absMax;

function compute(data, handler) {
  return new Proxy(function () {
    return data;
  }, {
    set: function set(target, key, value) {
      target()[key] = value;
      return true;
    },
    get: function get(target, key) {
      return target()[key];
    },
    apply: function apply(target) {
      handler.apply(target());
      return target();
    }
  });
}

exports.compute = compute;

function inRange(num, min, max) {
  if (num < min) return min;
  if (num > max) return max;
  return num;
}

exports.inRange = inRange;
},{}],"shots.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var View = document.querySelector(".view__image");

var Shots =
/** @class */
function () {
  function Shots() {
    this.ShotsElement = document.querySelector('.shots-stack');
  }

  Shots.prototype.push = function (image) {
    /*
        Create Canvas
    */
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var aspectRatio = 2;
    canvas.width = View.offsetWidth / aspectRatio;
    canvas.height = View.offsetHeight / aspectRatio;
    context.drawImage(image, data.ImagePosition["x"] / aspectRatio, data.ImagePosition["y"] / aspectRatio, canvas.width * SCALE, canvas.height * SCALE);
    /*
        Create Shot
    */

    var Shot = document.createElement("div");
    Shot.classList.add("shot"); // Childrens

    Shot.appendChild(canvas);
    this.ShotsElement.appendChild(Shot);
  };

  return Shots;
}();

exports.default = Shots;
},{}],"index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var utils_1 = require("./utils");

var shots_1 = __importDefault(require("./shots"));
/* ===========
    Elements
============== */


var Cursor = document.querySelector('.cursor');
var Pointer = document.querySelector('.pointer');
var View = document.querySelector('.view__image');
var Button = document.querySelector('button');
var UploadBtn = document.querySelector('.view__upload-btn');
var Zoom_Bar = document.querySelector('.view__zoom-bar div');
var Zoom_Value = document.querySelector(".view__zoom-value");
var InputFile = document.querySelector('#upload');
window.LIMIT = Pointer.offsetHeight / 2 - Cursor.offsetHeight / 2;
window.SCALE = 3;
window.MAX_ASPECT_RATIO = 2;
window.MAX_IMAGE_WIDTH = 600;
window.data = {
  Distance: {
    x: 0,
    y: 0
  },
  isCursorMove: false,
  CursorPosition: utils_1.compute({
    x: 0,
    y: 0
  }, function () {
    this.x = utils_1.absMax(data.Distance["x"], LIMIT);
    this.y = utils_1.absMax(data.Distance["y"], LIMIT);
  }),
  ImagePosition: utils_1.compute({
    x: 0,
    y: 0
  }, function () {}),
  ImageWidth: 0,
  ImageHeight: 0,
  ImageSrc: window.getComputedStyle(View).backgroundImage.slice(5, window.getComputedStyle(View).backgroundImage.length - 2),
  ImageAspectRatio: 0
};
/* ===========
    Logic
============== */

function updateView() {
  Cursor.style.transform = "translate(" + data.CursorPosition['x'] + "px, " + data.CursorPosition['y'] + "px)";
  View.style.backgroundPosition = data.ImagePosition['x'] + "px " + data.ImagePosition['y'] + "px";
  if (data.isCursorMove) View.classList.add("image--move");else View.classList.remove("image--move");
  if (data.isCursorMove) Cursor.classList.add('cursor--move');else Cursor.classList.remove('cursor--move');
  View.style.backgroundImage = "url(" + data.ImageSrc + ")";
  View.style.backgroundSize = View.offsetWidth * SCALE + "px " + View.offsetHeight * SCALE + "px";
  Zoom_Bar.style.width = SCALE / 5 * 100 + "%";
  Zoom_Bar.style.backgroundImage = "linear-gradient(45deg, #FF5722 " + (100 - SCALE / 5 * 100) + "%, #FFC107)";
  Zoom_Value.innerText = SCALE + "00%";
}

var interval;

function mousedown(e) {
  return true;
}

function mousemove(e, _a) {
  var x = _a.x,
      y = _a.y;
  data.isCursorMove = true;
  var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  data.Distance['x'] = x;
  data.Distance['y'] = y;

  if (distance > LIMIT && interval === undefined) {
    interval = setInterval(function () {
      data.ImagePosition();
      updateView();
    }, 1000 / 24);
  }

  data.CursorPosition();
  data.ImagePosition();
  updateView();
}

function mouseup() {
  data.CursorPosition['x'] = 0;
  data.CursorPosition['y'] = 0;
  clearInterval(interval);
  interval = undefined;
  updateView();
}

utils_1.onDragDrop(Cursor, mousedown, mousemove, mouseup);
var img = new Image();

img.onload = function () {
  data.ImageWidth = img.naturalWidth;
  data.ImageHeight = img.naturalHeight;
  data.ImageAspectRatio = data.ImageWidth / data.ImageHeight;
  var height = 300; // You can specify the value what do you want

  if (data.ImageAspectRatio > MAX_ASPECT_RATIO) height = MAX_IMAGE_WIDTH / data.ImageAspectRatio;
  View.style.height = height + "px";
  View.style.width = height * data.ImageAspectRatio + "px";
  data.ImagePosition = utils_1.compute({
    x: (View.offsetWidth - View.offsetWidth * SCALE) * 0.5,
    y: (View.offsetHeight - View.offsetHeight * SCALE) * 0.5
  }, function () {
    var x = this.x + utils_1.absMax(data.Distance["x"], 5) * -1;
    var y = this.y + utils_1.absMax(data.Distance["y"], 5) * -1;
    this.x = utils_1.inRange(x, View.offsetWidth * (SCALE * -1) + View.offsetWidth, 0);
    this.y = utils_1.inRange(y, View.offsetHeight * (SCALE * -1) + View.offsetHeight, 0);
  });
  updateView();
};

img.src = data.ImageSrc;
var shots = new shots_1.default();
Button.addEventListener('click', function () {
  return shots.push(img);
});
UploadBtn.addEventListener('click', function () {
  InputFile.click();
  InputFile.addEventListener('change', function (e) {
    var image = InputFile.files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      data.ImageSrc = this.result.toString();
      img.src = this.result.toString();
      updateView();
    });
    reader.readAsDataURL(image);
    console.log(image);
  });
});
utils_1.onDragDrop(Zoom_Bar, // Mouse Down
function (e) {
  var start = Zoom_Bar.getBoundingClientRect().left + Zoom_Bar.offsetWidth - 100;
  return e.pageX > start;
}, // Mouse Move
function (e) {
  var unit = Zoom_Bar.parentElement.offsetWidth / 5;
  var x = e.pageX - Zoom_Bar.getBoundingClientRect().left;
  SCALE = Math.round(x / unit);
  console.log(x, x / unit);
  updateView();
}, // Mouse Up
function () {});
},{"./utils":"utils.ts","./shots":"shots.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57453" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=src.77de5100.js.map