var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/aos/dist/aos.js
var require_aos = __commonJS({
  "node_modules/aos/dist/aos.js"(exports, module) {
    !(function(e, t) {
      "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.AOS = t() : e.AOS = t();
    })(exports, function() {
      return (function(e) {
        function t(o) {
          if (n[o]) return n[o].exports;
          var i = n[o] = { exports: {}, id: o, loaded: false };
          return e[o].call(i.exports, i, i.exports, t), i.loaded = true, i.exports;
        }
        var n = {};
        return t.m = e, t.c = n, t.p = "dist/", t(0);
      })([function(e, t, n) {
        "use strict";
        function o(e2) {
          return e2 && e2.__esModule ? e2 : { default: e2 };
        }
        var i = Object.assign || function(e2) {
          for (var t2 = 1; t2 < arguments.length; t2++) {
            var n2 = arguments[t2];
            for (var o2 in n2) Object.prototype.hasOwnProperty.call(n2, o2) && (e2[o2] = n2[o2]);
          }
          return e2;
        }, r = n(1), a = (o(r), n(6)), u = o(a), c = n(7), s = o(c), f = n(8), d = o(f), l = n(9), p = o(l), m = n(10), b = o(m), v = n(11), y = o(v), g = n(14), h = o(g), w = [], k = false, x = { offset: 120, delay: 0, easing: "ease", duration: 400, disable: false, once: false, startEvent: "DOMContentLoaded", throttleDelay: 99, debounceDelay: 50, disableMutationObserver: false }, j = function() {
          var e2 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          if (e2 && (k = true), k) return w = (0, y.default)(w, x), (0, b.default)(w, x.once), w;
        }, O = function() {
          w = (0, h.default)(), j();
        }, M = function() {
          w.forEach(function(e2, t2) {
            e2.node.removeAttribute("data-aos"), e2.node.removeAttribute("data-aos-easing"), e2.node.removeAttribute("data-aos-duration"), e2.node.removeAttribute("data-aos-delay");
          });
        }, S = function(e2) {
          return e2 === true || "mobile" === e2 && p.default.mobile() || "phone" === e2 && p.default.phone() || "tablet" === e2 && p.default.tablet() || "function" == typeof e2 && e2() === true;
        }, _ = function(e2) {
          x = i(x, e2), w = (0, h.default)();
          var t2 = document.all && !window.atob;
          return S(x.disable) || t2 ? M() : (x.disableMutationObserver || d.default.isSupported() || (console.info('\n      aos: MutationObserver is not supported on this browser,\n      code mutations observing has been disabled.\n      You may have to call "refreshHard()" by yourself.\n    '), x.disableMutationObserver = true), document.querySelector("body").setAttribute("data-aos-easing", x.easing), document.querySelector("body").setAttribute("data-aos-duration", x.duration), document.querySelector("body").setAttribute("data-aos-delay", x.delay), "DOMContentLoaded" === x.startEvent && ["complete", "interactive"].indexOf(document.readyState) > -1 ? j(true) : "load" === x.startEvent ? window.addEventListener(x.startEvent, function() {
            j(true);
          }) : document.addEventListener(x.startEvent, function() {
            j(true);
          }), window.addEventListener("resize", (0, s.default)(j, x.debounceDelay, true)), window.addEventListener("orientationchange", (0, s.default)(j, x.debounceDelay, true)), window.addEventListener("scroll", (0, u.default)(function() {
            (0, b.default)(w, x.once);
          }, x.throttleDelay)), x.disableMutationObserver || d.default.ready("[data-aos]", O), w);
        };
        e.exports = { init: _, refresh: j, refreshHard: O };
      }, function(e, t) {
      }, , , , , function(e, t) {
        (function(t2) {
          "use strict";
          function n(e2, t3, n2) {
            function o2(t4) {
              var n3 = b2, o3 = v2;
              return b2 = v2 = void 0, k2 = t4, g2 = e2.apply(o3, n3);
            }
            function r2(e3) {
              return k2 = e3, h2 = setTimeout(f2, t3), M ? o2(e3) : g2;
            }
            function a2(e3) {
              var n3 = e3 - w2, o3 = e3 - k2, i2 = t3 - n3;
              return S ? j(i2, y2 - o3) : i2;
            }
            function c2(e3) {
              var n3 = e3 - w2, o3 = e3 - k2;
              return void 0 === w2 || n3 >= t3 || n3 < 0 || S && o3 >= y2;
            }
            function f2() {
              var e3 = O();
              return c2(e3) ? d2(e3) : void (h2 = setTimeout(f2, a2(e3)));
            }
            function d2(e3) {
              return h2 = void 0, _ && b2 ? o2(e3) : (b2 = v2 = void 0, g2);
            }
            function l2() {
              void 0 !== h2 && clearTimeout(h2), k2 = 0, b2 = w2 = v2 = h2 = void 0;
            }
            function p2() {
              return void 0 === h2 ? g2 : d2(O());
            }
            function m2() {
              var e3 = O(), n3 = c2(e3);
              if (b2 = arguments, v2 = this, w2 = e3, n3) {
                if (void 0 === h2) return r2(w2);
                if (S) return h2 = setTimeout(f2, t3), o2(w2);
              }
              return void 0 === h2 && (h2 = setTimeout(f2, t3)), g2;
            }
            var b2, v2, y2, g2, h2, w2, k2 = 0, M = false, S = false, _ = true;
            if ("function" != typeof e2) throw new TypeError(s);
            return t3 = u(t3) || 0, i(n2) && (M = !!n2.leading, S = "maxWait" in n2, y2 = S ? x(u(n2.maxWait) || 0, t3) : y2, _ = "trailing" in n2 ? !!n2.trailing : _), m2.cancel = l2, m2.flush = p2, m2;
          }
          function o(e2, t3, o2) {
            var r2 = true, a2 = true;
            if ("function" != typeof e2) throw new TypeError(s);
            return i(o2) && (r2 = "leading" in o2 ? !!o2.leading : r2, a2 = "trailing" in o2 ? !!o2.trailing : a2), n(e2, t3, { leading: r2, maxWait: t3, trailing: a2 });
          }
          function i(e2) {
            var t3 = "undefined" == typeof e2 ? "undefined" : c(e2);
            return !!e2 && ("object" == t3 || "function" == t3);
          }
          function r(e2) {
            return !!e2 && "object" == ("undefined" == typeof e2 ? "undefined" : c(e2));
          }
          function a(e2) {
            return "symbol" == ("undefined" == typeof e2 ? "undefined" : c(e2)) || r(e2) && k.call(e2) == d;
          }
          function u(e2) {
            if ("number" == typeof e2) return e2;
            if (a(e2)) return f;
            if (i(e2)) {
              var t3 = "function" == typeof e2.valueOf ? e2.valueOf() : e2;
              e2 = i(t3) ? t3 + "" : t3;
            }
            if ("string" != typeof e2) return 0 === e2 ? e2 : +e2;
            e2 = e2.replace(l, "");
            var n2 = m.test(e2);
            return n2 || b.test(e2) ? v(e2.slice(2), n2 ? 2 : 8) : p.test(e2) ? f : +e2;
          }
          var c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
            return typeof e2;
          } : function(e2) {
            return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
          }, s = "Expected a function", f = NaN, d = "[object Symbol]", l = /^\s+|\s+$/g, p = /^[-+]0x[0-9a-f]+$/i, m = /^0b[01]+$/i, b = /^0o[0-7]+$/i, v = parseInt, y = "object" == ("undefined" == typeof t2 ? "undefined" : c(t2)) && t2 && t2.Object === Object && t2, g = "object" == ("undefined" == typeof self ? "undefined" : c(self)) && self && self.Object === Object && self, h = y || g || Function("return this")(), w = Object.prototype, k = w.toString, x = Math.max, j = Math.min, O = function() {
            return h.Date.now();
          };
          e.exports = o;
        }).call(t, /* @__PURE__ */ (function() {
          return this;
        })());
      }, function(e, t) {
        (function(t2) {
          "use strict";
          function n(e2, t3, n2) {
            function i2(t4) {
              var n3 = b2, o2 = v2;
              return b2 = v2 = void 0, O = t4, g2 = e2.apply(o2, n3);
            }
            function r2(e3) {
              return O = e3, h2 = setTimeout(f2, t3), M ? i2(e3) : g2;
            }
            function u2(e3) {
              var n3 = e3 - w2, o2 = e3 - O, i3 = t3 - n3;
              return S ? x(i3, y2 - o2) : i3;
            }
            function s2(e3) {
              var n3 = e3 - w2, o2 = e3 - O;
              return void 0 === w2 || n3 >= t3 || n3 < 0 || S && o2 >= y2;
            }
            function f2() {
              var e3 = j();
              return s2(e3) ? d2(e3) : void (h2 = setTimeout(f2, u2(e3)));
            }
            function d2(e3) {
              return h2 = void 0, _ && b2 ? i2(e3) : (b2 = v2 = void 0, g2);
            }
            function l2() {
              void 0 !== h2 && clearTimeout(h2), O = 0, b2 = w2 = v2 = h2 = void 0;
            }
            function p2() {
              return void 0 === h2 ? g2 : d2(j());
            }
            function m2() {
              var e3 = j(), n3 = s2(e3);
              if (b2 = arguments, v2 = this, w2 = e3, n3) {
                if (void 0 === h2) return r2(w2);
                if (S) return h2 = setTimeout(f2, t3), i2(w2);
              }
              return void 0 === h2 && (h2 = setTimeout(f2, t3)), g2;
            }
            var b2, v2, y2, g2, h2, w2, O = 0, M = false, S = false, _ = true;
            if ("function" != typeof e2) throw new TypeError(c);
            return t3 = a(t3) || 0, o(n2) && (M = !!n2.leading, S = "maxWait" in n2, y2 = S ? k(a(n2.maxWait) || 0, t3) : y2, _ = "trailing" in n2 ? !!n2.trailing : _), m2.cancel = l2, m2.flush = p2, m2;
          }
          function o(e2) {
            var t3 = "undefined" == typeof e2 ? "undefined" : u(e2);
            return !!e2 && ("object" == t3 || "function" == t3);
          }
          function i(e2) {
            return !!e2 && "object" == ("undefined" == typeof e2 ? "undefined" : u(e2));
          }
          function r(e2) {
            return "symbol" == ("undefined" == typeof e2 ? "undefined" : u(e2)) || i(e2) && w.call(e2) == f;
          }
          function a(e2) {
            if ("number" == typeof e2) return e2;
            if (r(e2)) return s;
            if (o(e2)) {
              var t3 = "function" == typeof e2.valueOf ? e2.valueOf() : e2;
              e2 = o(t3) ? t3 + "" : t3;
            }
            if ("string" != typeof e2) return 0 === e2 ? e2 : +e2;
            e2 = e2.replace(d, "");
            var n2 = p.test(e2);
            return n2 || m.test(e2) ? b(e2.slice(2), n2 ? 2 : 8) : l.test(e2) ? s : +e2;
          }
          var u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
            return typeof e2;
          } : function(e2) {
            return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
          }, c = "Expected a function", s = NaN, f = "[object Symbol]", d = /^\s+|\s+$/g, l = /^[-+]0x[0-9a-f]+$/i, p = /^0b[01]+$/i, m = /^0o[0-7]+$/i, b = parseInt, v = "object" == ("undefined" == typeof t2 ? "undefined" : u(t2)) && t2 && t2.Object === Object && t2, y = "object" == ("undefined" == typeof self ? "undefined" : u(self)) && self && self.Object === Object && self, g = v || y || Function("return this")(), h = Object.prototype, w = h.toString, k = Math.max, x = Math.min, j = function() {
            return g.Date.now();
          };
          e.exports = n;
        }).call(t, /* @__PURE__ */ (function() {
          return this;
        })());
      }, function(e, t) {
        "use strict";
        function n(e2) {
          var t2 = void 0, o2 = void 0, i2 = void 0;
          for (t2 = 0; t2 < e2.length; t2 += 1) {
            if (o2 = e2[t2], o2.dataset && o2.dataset.aos) return true;
            if (i2 = o2.children && n(o2.children)) return true;
          }
          return false;
        }
        function o() {
          return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        }
        function i() {
          return !!o();
        }
        function r(e2, t2) {
          var n2 = window.document, i2 = o(), r2 = new i2(a);
          u = t2, r2.observe(n2.documentElement, { childList: true, subtree: true, removedNodes: true });
        }
        function a(e2) {
          e2 && e2.forEach(function(e3) {
            var t2 = Array.prototype.slice.call(e3.addedNodes), o2 = Array.prototype.slice.call(e3.removedNodes), i2 = t2.concat(o2);
            if (n(i2)) return u();
          });
        }
        Object.defineProperty(t, "__esModule", { value: true });
        var u = function() {
        };
        t.default = { isSupported: i, ready: r };
      }, function(e, t) {
        "use strict";
        function n(e2, t2) {
          if (!(e2 instanceof t2)) throw new TypeError("Cannot call a class as a function");
        }
        function o() {
          return navigator.userAgent || navigator.vendor || window.opera || "";
        }
        Object.defineProperty(t, "__esModule", { value: true });
        var i = /* @__PURE__ */ (function() {
          function e2(e3, t2) {
            for (var n2 = 0; n2 < t2.length; n2++) {
              var o2 = t2[n2];
              o2.enumerable = o2.enumerable || false, o2.configurable = true, "value" in o2 && (o2.writable = true), Object.defineProperty(e3, o2.key, o2);
            }
          }
          return function(t2, n2, o2) {
            return n2 && e2(t2.prototype, n2), o2 && e2(t2, o2), t2;
          };
        })(), r = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i, a = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i, u = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i, c = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i, s = (function() {
          function e2() {
            n(this, e2);
          }
          return i(e2, [{ key: "phone", value: function() {
            var e3 = o();
            return !(!r.test(e3) && !a.test(e3.substr(0, 4)));
          } }, { key: "mobile", value: function() {
            var e3 = o();
            return !(!u.test(e3) && !c.test(e3.substr(0, 4)));
          } }, { key: "tablet", value: function() {
            return this.mobile() && !this.phone();
          } }]), e2;
        })();
        t.default = new s();
      }, function(e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: true });
        var n = function(e2, t2, n2) {
          var o2 = e2.node.getAttribute("data-aos-once");
          t2 > e2.position ? e2.node.classList.add("aos-animate") : "undefined" != typeof o2 && ("false" === o2 || !n2 && "true" !== o2) && e2.node.classList.remove("aos-animate");
        }, o = function(e2, t2) {
          var o2 = window.pageYOffset, i = window.innerHeight;
          e2.forEach(function(e3, r) {
            n(e3, i + o2, t2);
          });
        };
        t.default = o;
      }, function(e, t, n) {
        "use strict";
        function o(e2) {
          return e2 && e2.__esModule ? e2 : { default: e2 };
        }
        Object.defineProperty(t, "__esModule", { value: true });
        var i = n(12), r = o(i), a = function(e2, t2) {
          return e2.forEach(function(e3, n2) {
            e3.node.classList.add("aos-init"), e3.position = (0, r.default)(e3.node, t2.offset);
          }), e2;
        };
        t.default = a;
      }, function(e, t, n) {
        "use strict";
        function o(e2) {
          return e2 && e2.__esModule ? e2 : { default: e2 };
        }
        Object.defineProperty(t, "__esModule", { value: true });
        var i = n(13), r = o(i), a = function(e2, t2) {
          var n2 = 0, o2 = 0, i2 = window.innerHeight, a2 = { offset: e2.getAttribute("data-aos-offset"), anchor: e2.getAttribute("data-aos-anchor"), anchorPlacement: e2.getAttribute("data-aos-anchor-placement") };
          switch (a2.offset && !isNaN(a2.offset) && (o2 = parseInt(a2.offset)), a2.anchor && document.querySelectorAll(a2.anchor) && (e2 = document.querySelectorAll(a2.anchor)[0]), n2 = (0, r.default)(e2).top, a2.anchorPlacement) {
            case "top-bottom":
              break;
            case "center-bottom":
              n2 += e2.offsetHeight / 2;
              break;
            case "bottom-bottom":
              n2 += e2.offsetHeight;
              break;
            case "top-center":
              n2 += i2 / 2;
              break;
            case "bottom-center":
              n2 += i2 / 2 + e2.offsetHeight;
              break;
            case "center-center":
              n2 += i2 / 2 + e2.offsetHeight / 2;
              break;
            case "top-top":
              n2 += i2;
              break;
            case "bottom-top":
              n2 += e2.offsetHeight + i2;
              break;
            case "center-top":
              n2 += e2.offsetHeight / 2 + i2;
          }
          return a2.anchorPlacement || a2.offset || isNaN(t2) || (o2 = t2), n2 + o2;
        };
        t.default = a;
      }, function(e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: true });
        var n = function(e2) {
          for (var t2 = 0, n2 = 0; e2 && !isNaN(e2.offsetLeft) && !isNaN(e2.offsetTop); ) t2 += e2.offsetLeft - ("BODY" != e2.tagName ? e2.scrollLeft : 0), n2 += e2.offsetTop - ("BODY" != e2.tagName ? e2.scrollTop : 0), e2 = e2.offsetParent;
          return { top: n2, left: t2 };
        };
        t.default = n;
      }, function(e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: true });
        var n = function(e2) {
          return e2 = e2 || document.querySelectorAll("[data-aos]"), Array.prototype.map.call(e2, function(e3) {
            return { node: e3 };
          });
        };
        t.default = n;
      }]);
    });
  }
});

// src/js/app.js
document.documentElement.classList.add("js-ready");

// src/js/main.js
var import_aos = __toESM(require_aos());

// src/blocks/select/select.js
var initializedSelects = /* @__PURE__ */ new WeakSet();
var openSelects = /* @__PURE__ */ new Set();
var areDocumentHandlersBound = false;
function closeSelect(selectElement, restoreFocus = false) {
  const triggerElement = selectElement.querySelector(".select__trigger");
  selectElement.classList.remove("select--open");
  openSelects.delete(selectElement);
  if (triggerElement) {
    triggerElement.setAttribute("aria-expanded", "false");
    if (restoreFocus) {
      triggerElement.focus();
    }
  }
}
function closeAllSelects() {
  Array.from(openSelects).forEach((selectElement) => {
    closeSelect(selectElement);
  });
}
function bindDocumentHandlers() {
  if (areDocumentHandlersBound) {
    return;
  }
  document.addEventListener("click", (event) => {
    Array.from(openSelects).forEach((selectElement) => {
      if (selectElement.contains(event.target)) {
        return;
      }
      closeSelect(selectElement);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }
    closeAllSelects();
  });
  areDocumentHandlersBound = true;
}
function initSelect(selectElement) {
  if (initializedSelects.has(selectElement)) {
    return;
  }
  const triggerElement = selectElement.querySelector(".select__trigger");
  const valueElement = selectElement.querySelector(".select__value");
  const hiddenInputElement = selectElement.querySelector(".select__input");
  const optionElements = selectElement.querySelectorAll(".select__option");
  if (!triggerElement || !valueElement || !hiddenInputElement || optionElements.length === 0) {
    return;
  }
  const open = () => {
    Array.from(openSelects).forEach((openedElement) => {
      if (openedElement !== selectElement) {
        closeSelect(openedElement);
      }
    });
    selectElement.classList.add("select--open");
    openSelects.add(selectElement);
    triggerElement.setAttribute("aria-expanded", "true");
  };
  const moveFocus = (step) => {
    const optionsList = Array.from(optionElements);
    const activeIndex = optionsList.findIndex((item) => item === document.activeElement);
    const selectedIndex = optionsList.findIndex((item) => item.classList.contains("is-selected"));
    const currentIndex = activeIndex >= 0 ? activeIndex : Math.max(selectedIndex, 0);
    const nextIndex = (currentIndex + step + optionsList.length) % optionsList.length;
    optionsList[nextIndex].focus();
  };
  const applySelection = (optionElement, closeAfterSelect = true, emitChange = true) => {
    optionElements.forEach((item) => {
      item.classList.remove("is-selected");
      item.setAttribute("aria-selected", "false");
    });
    optionElement.classList.add("is-selected");
    optionElement.setAttribute("aria-selected", "true");
    valueElement.textContent = optionElement.textContent.trim();
    selectElement.dataset.value = optionElement.getAttribute("data-value") || "";
    hiddenInputElement.value = selectElement.dataset.value;
    if (emitChange) {
      hiddenInputElement.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (closeAfterSelect) {
      closeSelect(selectElement, true);
    }
  };
  triggerElement.addEventListener("click", () => {
    if (selectElement.classList.contains("select--open")) {
      closeSelect(selectElement);
      return;
    }
    open();
  });
  triggerElement.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open();
      const selectedOption2 = selectElement.querySelector(".select__option.is-selected");
      if (selectedOption2) {
        selectedOption2.focus();
      }
    }
  });
  optionElements.forEach((optionElement) => {
    optionElement.addEventListener("click", () => {
      applySelection(optionElement);
    });
    optionElement.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveFocus(1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveFocus(-1);
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        applySelection(optionElement);
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closeSelect(selectElement, true);
      }
    });
  });
  const selectedOption = selectElement.querySelector(".select__option.is-selected");
  if (selectedOption) {
    applySelection(selectedOption, false, false);
  } else {
    applySelection(optionElements[0], false, false);
  }
  initializedSelects.add(selectElement);
}
function initSelects(root = document) {
  bindDocumentHandlers();
  root.querySelectorAll(".js-select").forEach((selectElement) => {
    initSelect(selectElement);
  });
}

// src/js/lib/logger.js
function createLogger(scope) {
  const prefix = `[Freedom/${scope}]`;
  return {
    debug(message, payload) {
      console.log(prefix, message, payload ?? "");
    },
    info(message, payload) {
      console.info(prefix, message, payload ?? "");
    },
    warn(message, payload) {
      console.warn(prefix, message, payload ?? "");
    },
    error(message, payload) {
      console.error(prefix, message, payload ?? "");
    }
  };
}

// src/js/lib/paths.js
function normalizeTarget(target) {
  return String(target || "").replace(/^\/+/, "");
}
function buildAppUrl(target) {
  return new URL(normalizeTarget(target), window.location.href).toString();
}
function buildAppPath(target) {
  const url = new URL(normalizeTarget(target), window.location.href);
  return `${url.pathname}${url.search}${url.hash}`;
}

// src/js/lib/api.js
var apiLogger = createLogger("api");
async function readPayload(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}
async function request(url, options = {}) {
  apiLogger.debug("Request started", {
    url,
    method: options.method || "GET"
  });
  const response = await fetch(url, options);
  const payload = await readPayload(response);
  if (!response.ok) {
    const message = typeof payload === "object" && payload && "error" in payload ? payload.error : `HTTP ${response.status}`;
    apiLogger.error("Request failed", {
      url,
      status: response.status,
      payload
    });
    throw new Error(message);
  }
  apiLogger.debug("Request finished", {
    url,
    status: response.status
  });
  return payload;
}
var api = {
  importReport(file) {
    const formData = new FormData();
    formData.append("reportFile", file);
    return request(buildAppUrl("api/import"), {
      method: "POST",
      body: formData
    });
  },
  getSession(sessionId) {
    return request(buildAppUrl(`api/sessions/${sessionId}`));
  },
  updateSessionSettings(sessionId, payload) {
    return request(buildAppUrl(`api/sessions/${sessionId}/settings`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  },
  getPreview(sessionId, payload) {
    return request(buildAppUrl(`api/sessions/${sessionId}/preview`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  },
  draw(sessionId, payload) {
    return request(buildAppUrl(`api/sessions/${sessionId}/draw`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  },
  getDraw(sessionId, drawId) {
    return request(buildAppUrl(`api/sessions/${sessionId}/draws/${drawId}`));
  },
  excludeDraw(sessionId, drawId) {
    return request(buildAppUrl(`api/sessions/${sessionId}/exclude-draw`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ drawId })
    });
  },
  resetExclusions(sessionId) {
    return request(buildAppUrl(`api/sessions/${sessionId}/reset-exclusions`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });
  }
};

// src/js/lib/dynamic-select.js
function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function buildOptionsMarkup(options, selectedValue) {
  return options.map((option) => {
    const isSelected = option.value === selectedValue;
    return `
        <li>
          <button class="select__option${isSelected ? " is-selected" : ""}" type="button"
            data-value="${escapeHtml(option.value)}" role="option" aria-selected="${isSelected ? "true" : "false"}">
            ${escapeHtml(option.label)}
          </button>
        </li>
      `;
  }).join("");
}
function mountDynamicSelect(targetElement, { name, value, options, classes = "" }) {
  const safeOptions = options.length > 0 ? options : [{ value: "", label: "\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439" }];
  const selectedValue = safeOptions.some((option) => option.value === value) ? value : safeOptions[0].value;
  const selectedOption = safeOptions.find((option) => option.value === selectedValue) || safeOptions[0];
  targetElement.innerHTML = `
    <div class="select js-select${classes ? ` ${classes}` : ""}">
      <input class="select__input" type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(selectedValue)}">
      <button class="select__trigger" type="button" aria-expanded="false" aria-haspopup="listbox">
        <span class="select__value">${escapeHtml(selectedOption.label)}</span>
        <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 9.5L15.5 21.5L28.5 9.5" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
      <ul class="select__dropdown" role="listbox">
        ${buildOptionsMarkup(safeOptions, selectedValue)}
      </ul>
    </div>
  `;
  initSelects(targetElement);
  return targetElement.querySelector(".select__input");
}

// src/pages/random/random.js
var randomLogger = createLogger("random-page");
var SESSION_STORAGE_KEY = "freedom-generator:last-session-id";
var DRAW_STORAGE_KEY = "freedom-generator:last-draw-id";
var DRAW_SETTINGS_STORAGE_KEY = "freedom-generator:last-draw-settings";
var DRAW_SETTINGS_VERSION = 2;
function escapeHtml2(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function formatDisplayValue(value) {
  const text = String(value ?? "").trim();
  if (/^\d{8,}$/.test(text)) {
    return text.match(/.{1,4}/g)?.join(" ") || text;
  }
  return text;
}
function getRecordWord(value) {
  const normalized = Math.abs(value) % 100;
  const tail = normalized % 10;
  if (normalized > 10 && normalized < 20) {
    return "\u0437\u0430\u043F\u0438\u0441\u0435\u0439";
  }
  if (tail > 1 && tail < 5) {
    return "\u0437\u0430\u043F\u0438\u0441\u0438";
  }
  if (tail === 1) {
    return "\u0437\u0430\u043F\u0438\u0441\u044C";
  }
  return "\u0437\u0430\u043F\u0438\u0441\u0435\u0439";
}
function getWinnerWord(value) {
  const normalized = Math.abs(value) % 100;
  const tail = normalized % 10;
  if (normalized > 10 && normalized < 20) {
    return "\u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0435\u0439";
  }
  if (tail > 1 && tail < 5) {
    return "\u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044F";
  }
  if (tail === 1) {
    return "\u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C";
  }
  return "\u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0435\u0439";
}
function readSavedSettings() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DRAW_SETTINGS_STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    if (!parsed.version || parsed.version < DRAW_SETTINGS_VERSION) {
      return {
        ...parsed,
        version: DRAW_SETTINGS_VERSION,
        removeWinners: "yes"
      };
    }
    return parsed;
  } catch (error) {
    randomLogger.warn("Failed to parse saved draw settings", error);
    return null;
  }
}
function saveDrawSettings(settings) {
  window.localStorage.setItem(
    DRAW_SETTINGS_STORAGE_KEY,
    JSON.stringify({
      ...settings,
      version: DRAW_SETTINGS_VERSION
    })
  );
}
function applySelectValue(selectElement, value) {
  if (!selectElement) {
    return;
  }
  const hiddenInputElement = selectElement.querySelector(".select__input");
  const valueElement = selectElement.querySelector(".select__value");
  const optionElements = Array.from(selectElement.querySelectorAll(".select__option"));
  if (!hiddenInputElement || !valueElement || optionElements.length === 0) {
    return;
  }
  const targetOption = optionElements.find((optionElement) => optionElement.getAttribute("data-value") === value) || optionElements[0];
  optionElements.forEach((optionElement) => {
    const isSelected = optionElement === targetOption;
    optionElement.classList.toggle("is-selected", isSelected);
    optionElement.setAttribute("aria-selected", String(isSelected));
  });
  hiddenInputElement.value = targetOption.getAttribute("data-value") || "";
  selectElement.dataset.value = hiddenInputElement.value;
  valueElement.textContent = targetOption.textContent.trim();
}
function initCounter(counterElement) {
  const inputElement = counterElement.querySelector(".random__quantity-input");
  const unitElement = counterElement.closest(".random__quantity-controls")?.querySelector(".random__quantity-unit");
  if (!inputElement || !unitElement) {
    return;
  }
  const minValue = Number.parseInt(inputElement.getAttribute("min") || "1", 10);
  const normalizeValue = () => {
    const parsed = Number.parseInt(inputElement.value, 10);
    const safeValue = Number.isNaN(parsed) ? minValue : Math.max(minValue, parsed);
    inputElement.value = String(safeValue);
    unitElement.textContent = getRecordWord(safeValue);
  };
  counterElement.querySelectorAll(".random__quantity-stepper-button").forEach((buttonElement) => {
    buttonElement.addEventListener("click", () => {
      const direction = buttonElement.classList.contains(
        "random__quantity-stepper-button--increase"
      ) ? "increase" : "decrease";
      const currentValue = Number.parseInt(inputElement.value, 10) || minValue;
      const nextValue = direction === "increase" ? currentValue + 1 : currentValue - 1;
      inputElement.value = String(Math.max(minValue, nextValue));
      normalizeValue();
      inputElement.focus();
    });
  });
  inputElement.addEventListener("input", normalizeValue);
  inputElement.addEventListener("blur", normalizeValue);
  normalizeValue();
}
function setStatus(statusElement, message, kind = "info") {
  statusElement.textContent = message;
  if (!message) {
    delete statusElement.dataset.kind;
    return;
  }
  statusElement.dataset.kind = kind;
}
function toggleSidebar(sidebarElement, isOpen) {
  sidebarElement.classList.toggle("random__sidebar--open", isOpen);
  sidebarElement.setAttribute("aria-hidden", String(!isOpen));
}
function renderHistoryCounter(targetElement, count) {
  const safeCount = Math.max(0, Number(count) || 0);
  mountDynamicSelect(targetElement, {
    name: "winnersCounter",
    value: String(safeCount),
    options: [
      {
        value: String(safeCount),
        label: `${safeCount} ${getWinnerWord(safeCount)}`
      }
    ],
    classes: "random__select"
  });
}
function renderPlaceholder(listWrapperElement, listElement, hintElement, submitButtonElement, config) {
  listWrapperElement.classList.add("random__list--empty");
  listElement.innerHTML = `
    <li class="random__list-item random__list-item--empty">
      <div class="random__list-item-text">
        ${escapeHtml2(config.label)}
      </div>
    </li>
  `;
  hintElement.textContent = config.hint;
  submitButtonElement.disabled = config.submitDisabled;
}
function buildSessionHint(session) {
  const totalCount = session?.counts?.totalRecords ?? 0;
  const activeCount = session?.counts?.activeRecords ?? 0;
  const excludedCount = session?.counts?.excludedRecords ?? 0;
  const displayColumn = String(session?.defaults?.displayColumn || "").trim();
  const parts = [];
  if (session?.source?.originalName) {
    parts.push(`\u0424\u0430\u0439\u043B: ${session.source.originalName}.`);
  }
  if (totalCount > 0) {
    parts.push(`\u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E ${totalCount} ${getRecordWord(totalCount)}.`);
  }
  if (displayColumn) {
    parts.push(`\u041F\u043E\u043B\u0435 \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448\u0430: ${displayColumn}.`);
  }
  if (activeCount > 0) {
    parts.push(`\u0421\u0435\u0439\u0447\u0430\u0441 \u0432 \u043F\u0443\u043B\u0435 ${activeCount} ${getRecordWord(activeCount)}.`);
  } else if (totalCount > 0) {
    parts.push("\u0412 \u0442\u0435\u043A\u0443\u0449\u0435\u043C \u0444\u0430\u0439\u043B\u0435 \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 \u0434\u043B\u044F \u043D\u043E\u0432\u043E\u0433\u043E \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448\u0430.");
  }
  if (excludedCount > 0) {
    parts.push(`\u0423\u0436\u0435 \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u043E ${excludedCount} ${getRecordWord(excludedCount)}.`);
  }
  return parts.join(" ");
}
function renderWinnerHistory(listWrapperElement, listElement, hintElement, submitButtonElement, session) {
  const winnerHistory = Array.isArray(session?.winnerHistory) ? [...session.winnerHistory].reverse() : [];
  if (winnerHistory.length === 0) {
    renderPlaceholder(listWrapperElement, listElement, hintElement, submitButtonElement, {
      label: "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0438 \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448\u0430",
      hint: buildSessionHint(session),
      submitDisabled: (session?.counts?.activeRecords ?? 0) === 0
    });
    return;
  }
  listWrapperElement.classList.remove("random__list--empty");
  listElement.innerHTML = winnerHistory.map(
    (entry) => `
        <li class="random__list-item" data-history-entry-id="${escapeHtml2(entry.id)}">
          <div class="random__list-item-digit"></div>
          <div class="random__list-item-text">${escapeHtml2(formatDisplayValue(entry.displayValue))}</div>
        </li>
      `
  ).join("");
  hintElement.textContent = buildSessionHint(session);
  submitButtonElement.disabled = (session?.counts?.activeRecords ?? 0) === 0;
}
function highlightWinnerHistory(listElement, historyEntryIds) {
  const targetIds = new Set(historyEntryIds);
  listElement.querySelectorAll(".random__list-item").forEach((itemElement) => {
    const isWinner = targetIds.has(itemElement.dataset.historyEntryId);
    itemElement.classList.toggle("random__list-item--winner", isWinner);
  });
}
function initRandomControls() {
  const randomSectionElement = document.querySelector(".random");
  if (!randomSectionElement) {
    return;
  }
  const state = {
    session: null,
    lastDraw: null,
    isSidebarOpen: false,
    isImporting: false,
    isFieldModalOpen: false,
    isSavingDisplayColumn: false,
    pendingDisplayColumn: ""
  };
  const formElement = randomSectionElement.querySelector(".random__form");
  const fileInputElement = randomSectionElement.querySelector("[data-file-input]");
  const listWrapperElement = randomSectionElement.querySelector("[data-upload-zone]");
  const listElement = randomSectionElement.querySelector("[data-records-list]");
  const hintElement = randomSectionElement.querySelector("[data-list-hint]");
  const statusElement = randomSectionElement.querySelector("[data-status]");
  const submitButtonElement = randomSectionElement.querySelector("[data-draw-submit]");
  const sidebarElement = randomSectionElement.querySelector("[data-settings-sidebar]");
  const recordsSelectMountElement = randomSectionElement.querySelector("[data-records-select]");
  const winnersCountInputElement = randomSectionElement.querySelector(".random__quantity-input");
  const importTriggerButtonElement = randomSectionElement.querySelector("[data-import-trigger]");
  const displayColumnButtonElement = randomSectionElement.querySelector("[data-display-column-button]");
  const displayColumnDescriptionElement = randomSectionElement.querySelector(
    "[data-display-column-description]"
  );
  const resetExclusionsButtonElement = randomSectionElement.querySelector(
    "[data-reset-exclusions-button]"
  );
  const resetExclusionsDescriptionElement = randomSectionElement.querySelector(
    "[data-reset-exclusions-description]"
  );
  const displayColumnModalElement = randomSectionElement.querySelector("[data-display-column-modal]");
  const displayColumnSelectMountElement = randomSectionElement.querySelector(
    "[data-display-column-select]"
  );
  const displayColumnModalDescriptionElement = randomSectionElement.querySelector(
    "[data-display-column-modal-description]"
  );
  const displayColumnModalFileElement = randomSectionElement.querySelector(
    "[data-display-column-modal-file]"
  );
  const displayColumnSaveButtonElement = randomSectionElement.querySelector(
    "[data-display-column-save]"
  );
  const displayColumnCancelButtonElement = randomSectionElement.querySelector(
    "[data-display-column-cancel]"
  );
  randomSectionElement.querySelectorAll(".random__quantity-field--counter").forEach((counterElement) => {
    initCounter(counterElement);
  });
  function getDisplayColumnLabel() {
    return String(state.session?.defaults?.displayColumn || "").trim();
  }
  function syncDrawAvailability() {
    const hasActiveRecords = (state.session?.counts?.activeRecords ?? 0) > 0;
    submitButtonElement.disabled = !hasActiveRecords || state.isImporting || state.isSavingDisplayColumn || state.isFieldModalOpen;
  }
  function setFieldModalOpen(isOpen) {
    if (!displayColumnModalElement) {
      return;
    }
    state.isFieldModalOpen = isOpen;
    displayColumnModalElement.classList.toggle("random__modal--open", isOpen);
    displayColumnModalElement.setAttribute("aria-hidden", String(!isOpen));
    syncDrawAvailability();
  }
  function syncDisplayColumnControls() {
    if (!displayColumnButtonElement || !displayColumnDescriptionElement) {
      return;
    }
    if (!state.session) {
      displayColumnButtonElement.disabled = true;
      displayColumnButtonElement.textContent = "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u043F\u043E\u043B\u0435";
      displayColumnDescriptionElement.textContent = "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0444\u0430\u0439\u043B, \u0437\u0430\u0442\u0435\u043C \u043C\u043E\u0436\u043D\u043E \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u0438\u0437 Excel.";
      return;
    }
    const displayColumn = getDisplayColumnLabel();
    displayColumnButtonElement.disabled = false;
    displayColumnButtonElement.textContent = displayColumn ? "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u043E\u043B\u0435" : "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u043F\u043E\u043B\u0435";
    displayColumnDescriptionElement.textContent = displayColumn ? `\u0421\u0435\u0439\u0447\u0430\u0441 \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448 \u0438\u0434\u0451\u0442 \u043F\u043E \u043F\u043E\u043B\u044E \xAB${displayColumn}\xBB.` : "\u041F\u043E\u043B\u0435 \u0435\u0449\u0451 \u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D\u043E. \u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u0438\u0437 Excel.";
  }
  function openDisplayColumnModal() {
    if (!state.session || !displayColumnModalElement || !displayColumnSelectMountElement) {
      return;
    }
    const selectedValue = getDisplayColumnLabel() || state.session.columns[0] || "";
    const hiddenInputElement = mountDynamicSelect(displayColumnSelectMountElement, {
      name: "displayColumn",
      value: selectedValue,
      options: state.session.columns.map((column) => ({
        value: column,
        label: column
      })),
      classes: "random__sidebar-select random__select random__modal-select"
    });
    state.pendingDisplayColumn = hiddenInputElement?.value || selectedValue;
    hiddenInputElement?.addEventListener("change", (event) => {
      state.pendingDisplayColumn = event.target.value;
    });
    if (displayColumnModalDescriptionElement) {
      displayColumnModalDescriptionElement.textContent = "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u0438\u0437 Excel, \u043F\u043E \u043A\u043E\u0442\u043E\u0440\u043E\u0439 \u0431\u0443\u0434\u0443\u0442 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C\u0441\u044F \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0438.";
    }
    if (displayColumnModalFileElement) {
      displayColumnModalFileElement.textContent = state.session.source?.originalName ? `\u0424\u0430\u0439\u043B: ${state.session.source.originalName}` : "";
    }
    displayColumnSaveButtonElement.disabled = false;
    displayColumnCancelButtonElement.disabled = false;
    setFieldModalOpen(true);
  }
  function closeDisplayColumnModal() {
    setFieldModalOpen(false);
  }
  function applySavedSidebarSettings(savedSettings) {
    if (!savedSettings) {
      return;
    }
    if (savedSettings.winnersCount && winnersCountInputElement) {
      winnersCountInputElement.value = String(savedSettings.winnersCount);
      winnersCountInputElement.dispatchEvent(new Event("input", { bubbles: true }));
    }
    applySelectValue(
      formElement.querySelector('input[name="removeWinners"]')?.closest(".select"),
      savedSettings.removeWinners || "yes"
    );
    applySelectValue(
      formElement.querySelector('input[name="sortResults"]')?.closest(".select"),
      savedSettings.sortResults || "no"
    );
  }
  function syncSidebarActions() {
    syncDisplayColumnControls();
    if (!resetExclusionsButtonElement || !resetExclusionsDescriptionElement) {
      return;
    }
    const excludedCount = state.session?.counts?.excludedRecords ?? 0;
    const winnerHistoryCount = state.session?.counts?.winnerHistory ?? state.session?.winnerHistory?.length ?? 0;
    resetExclusionsButtonElement.textContent = excludedCount > 0 || winnerHistoryCount > 0 ? `\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0435 (${Math.max(excludedCount, winnerHistoryCount)})` : "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0435";
    if (!state.session) {
      resetExclusionsButtonElement.disabled = true;
      resetExclusionsDescriptionElement.textContent = "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0444\u0430\u0439\u043B. \u041F\u043E\u0441\u043B\u0435 \u044D\u0442\u043E\u0433\u043E \u0437\u0434\u0435\u0441\u044C \u043C\u043E\u0436\u043D\u043E \u043E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u0438 \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F.";
      return;
    }
    if (excludedCount === 0 && winnerHistoryCount === 0) {
      resetExclusionsButtonElement.disabled = true;
      resetExclusionsDescriptionElement.textContent = "\u0414\u043B\u044F \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u0444\u0430\u0439\u043B\u0430 \u043F\u043E\u043A\u0430 \u043D\u0435\u0447\u0435\u0433\u043E \u043E\u0447\u0438\u0449\u0430\u0442\u044C.";
      return;
    }
    const details = [];
    if (winnerHistoryCount > 0) {
      details.push(`\u043E\u0447\u0438\u0441\u0442\u0438\u0442 \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u0438\u0437 ${winnerHistoryCount} ${getWinnerWord(winnerHistoryCount)}`);
    }
    if (excludedCount > 0) {
      details.push(`\u0432\u0435\u0440\u043D\u0451\u0442 \u0432 \u043F\u0443\u043B ${excludedCount} ${getRecordWord(excludedCount)}`);
    }
    resetExclusionsButtonElement.disabled = false;
    resetExclusionsDescriptionElement.textContent = `\u041A\u043D\u043E\u043F\u043A\u0430 ${details.join(" \u0438 ")}.`;
  }
  function renderCurrentState() {
    const winnerHistoryCount = state.session?.counts?.winnerHistory ?? state.session?.winnerHistory?.length ?? 0;
    renderHistoryCounter(recordsSelectMountElement, winnerHistoryCount);
    if (!state.session) {
      renderPlaceholder(listWrapperElement, listElement, hintElement, submitButtonElement, {
        label: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0444\u0430\u0439\u043B",
        hint: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u0438\u043A\u043E\u043D\u043A\u0443 \u0441\u043F\u0440\u0430\u0432\u0430, \u0447\u0442\u043E\u0431\u044B \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C Excel-\u0444\u0430\u0439\u043B.",
        submitDisabled: true
      });
      syncSidebarActions();
      syncDrawAvailability();
      return;
    }
    renderWinnerHistory(
      listWrapperElement,
      listElement,
      hintElement,
      submitButtonElement,
      state.session
    );
    syncSidebarActions();
    syncDrawAvailability();
  }
  function setImportingState(isImporting) {
    state.isImporting = isImporting;
    if (!importTriggerButtonElement) {
      return;
    }
    importTriggerButtonElement.disabled = isImporting;
    importTriggerButtonElement.setAttribute("aria-busy", String(isImporting));
    syncDrawAvailability();
  }
  async function hydrateSession(sessionId) {
    try {
      setStatus(statusElement, "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0442\u0435\u043A\u0443\u0449\u0443\u044E \u0441\u0435\u0441\u0441\u0438\u044E\u2026");
      const response = await api.getSession(sessionId);
      state.session = response.session;
      state.lastDraw = response.session.lastDraw || null;
      window.localStorage.setItem(SESSION_STORAGE_KEY, response.session.id);
      applySavedSidebarSettings(readSavedSettings());
      renderCurrentState();
      setStatus(statusElement, "");
    } catch (error) {
      randomLogger.warn("Stored session restore failed", error);
      setStatus(
        statusElement,
        "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u0440\u043E\u0448\u043B\u0443\u044E \u0441\u0435\u0441\u0441\u0438\u044E. \u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0444\u0430\u0439\u043B \u0437\u0430\u043D\u043E\u0432\u043E.",
        "error"
      );
      state.session = null;
      state.lastDraw = null;
      renderCurrentState();
    }
  }
  function openFilePicker() {
    if (state.isImporting) {
      return;
    }
    fileInputElement?.click();
  }
  async function importFile(file) {
    if (!file || state.isImporting) {
      return;
    }
    const previousSession = state.session;
    const previousDraw = state.lastDraw;
    closeDisplayColumnModal();
    setImportingState(true);
    setStatus(statusElement, "\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u0443\u0435\u043C Excel-\u0444\u0430\u0439\u043B \u0438 \u0441\u043E\u0431\u0438\u0440\u0430\u0435\u043C \u043F\u0443\u043B \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432\u2026");
    renderPlaceholder(listWrapperElement, listElement, hintElement, submitButtonElement, {
      label: file.name,
      hint: "\u0424\u0430\u0439\u043B \u0432\u044B\u0431\u0440\u0430\u043D. \u0416\u0434\u0451\u043C \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0438 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u0441\u043F\u0438\u0441\u043A\u0430.",
      submitDisabled: true
    });
    try {
      const response = await api.importReport(file);
      state.session = response.session;
      state.lastDraw = null;
      state.pendingDisplayColumn = response.session.defaults.displayColumn;
      window.localStorage.setItem(SESSION_STORAGE_KEY, response.session.id);
      window.localStorage.removeItem(DRAW_STORAGE_KEY);
      renderCurrentState();
      setStatus(
        statusElement,
        "\u0424\u0430\u0439\u043B \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u043E\u043B\u0435 \u0434\u043B\u044F \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448\u0430 \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0443.",
        "info"
      );
      openDisplayColumnModal();
    } catch (error) {
      randomLogger.error("Import failed", error);
      state.session = previousSession;
      state.lastDraw = previousDraw;
      renderCurrentState();
      setStatus(statusElement, error.message, "error");
    } finally {
      setImportingState(false);
      if (fileInputElement) {
        fileInputElement.value = "";
      }
    }
  }
  async function handleDraw(event) {
    event.preventDefault();
    if (!state.session) {
      setStatus(statusElement, "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 Excel-\u0444\u0430\u0439\u043B.", "error");
      return;
    }
    if (state.isFieldModalOpen) {
      setStatus(statusElement, "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u043E\u043B\u0435 \u0434\u043B\u044F \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448\u0430 \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0443.", "error");
      return;
    }
    const payload = {
      displayColumn: getDisplayColumnLabel(),
      winnersCount: winnersCountInputElement?.value || "1",
      removeWinners: formElement.querySelector('input[name="removeWinners"]')?.value || "no",
      sortResults: formElement.querySelector('input[name="sortResults"]')?.value || "no"
    };
    setStatus(statusElement, "\u0417\u0430\u043F\u0443\u0441\u043A\u0430\u0435\u043C \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448\u2026");
    submitButtonElement.disabled = true;
    try {
      const response = await api.draw(state.session.id, payload);
      const latestHistory = Array.isArray(response.session.winnerHistory) ? response.session.winnerHistory : [];
      const latestEntryIds = latestHistory.slice(-response.draw.winners.length).map((entry) => entry.id);
      state.session = response.session;
      state.lastDraw = response.draw;
      renderCurrentState();
      highlightWinnerHistory(listElement, latestEntryIds);
      saveDrawSettings({
        ...payload
      });
      window.localStorage.setItem(SESSION_STORAGE_KEY, response.session.id);
      window.localStorage.setItem(DRAW_STORAGE_KEY, response.draw.id);
      syncSidebarActions();
      setStatus(statusElement, "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0438 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u044B. \u041F\u0435\u0440\u0435\u0445\u043E\u0434\u0438\u043C \u043A \u044D\u043A\u0440\u0430\u043D\u0443 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432\u2026", "success");
      window.setTimeout(() => {
        window.location.href = buildAppUrl("results.html");
      }, 250);
    } catch (error) {
      randomLogger.error("Draw failed", error);
      setStatus(statusElement, error.message, "error");
      syncDrawAvailability();
    }
  }
  fileInputElement?.addEventListener("change", () => {
    const selectedFile = fileInputElement.files?.[0] || null;
    if (!selectedFile) {
      return;
    }
    importFile(selectedFile);
  });
  importTriggerButtonElement?.addEventListener("click", () => {
    openFilePicker();
  });
  displayColumnButtonElement?.addEventListener("click", () => {
    openDisplayColumnModal();
  });
  displayColumnCancelButtonElement?.addEventListener("click", () => {
    closeDisplayColumnModal();
    if (state.session) {
      setStatus(
        statusElement,
        `\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u043F\u043E\u043B\u0435 \xAB${getDisplayColumnLabel()}\xBB. \u041F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438 \u0435\u0433\u043E \u043C\u043E\u0436\u043D\u043E \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u043D\u043E\u0432\u0430.`,
        "info"
      );
    }
  });
  displayColumnSaveButtonElement?.addEventListener("click", async () => {
    if (!state.session || !state.pendingDisplayColumn || state.isSavingDisplayColumn) {
      return;
    }
    state.isSavingDisplayColumn = true;
    displayColumnSaveButtonElement.disabled = true;
    displayColumnCancelButtonElement.disabled = true;
    syncDrawAvailability();
    setStatus(statusElement, "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u043C \u043F\u043E\u043B\u0435 \u0434\u043B\u044F \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448\u0430\u2026");
    try {
      const response = await api.updateSessionSettings(state.session.id, {
        displayColumn: state.pendingDisplayColumn
      });
      state.session = response.session;
      closeDisplayColumnModal();
      renderCurrentState();
      setStatus(
        statusElement,
        `\u041F\u043E\u043B\u0435 \xAB${getDisplayColumnLabel()}\xBB \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E. \u041C\u043E\u0436\u043D\u043E \u0437\u0430\u043F\u0443\u0441\u043A\u0430\u0442\u044C \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448.`,
        "success"
      );
    } catch (error) {
      randomLogger.error("Failed to update display column", error);
      setStatus(statusElement, error.message, "error");
    } finally {
      state.isSavingDisplayColumn = false;
      displayColumnSaveButtonElement.disabled = false;
      displayColumnCancelButtonElement.disabled = false;
      syncDrawAvailability();
    }
  });
  randomSectionElement.querySelector("[data-settings-toggle]")?.addEventListener("click", () => {
    state.isSidebarOpen = !state.isSidebarOpen;
    toggleSidebar(sidebarElement, state.isSidebarOpen);
  });
  resetExclusionsButtonElement?.addEventListener("click", async () => {
    if (!state.session) {
      return;
    }
    setStatus(statusElement, "\u041E\u0447\u0438\u0449\u0430\u0435\u043C \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u0438 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u043C \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 \u0432 \u043F\u0443\u043B\u2026");
    resetExclusionsButtonElement.disabled = true;
    try {
      const response = await api.resetExclusions(state.session.id);
      state.session = response.session;
      state.lastDraw = null;
      renderCurrentState();
      setStatus(
        statusElement,
        "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u043E\u0447\u0438\u0449\u0435\u043D\u0430. \u0412\u0441\u0435 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438 \u0441\u043D\u043E\u0432\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0434\u043B\u044F \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448\u0430.",
        "success"
      );
    } catch (error) {
      randomLogger.error("Reset exclusions failed", error);
      renderCurrentState();
      setStatus(statusElement, error.message, "error");
    }
  });
  formElement?.addEventListener("submit", handleDraw);
  const queryParams = new URLSearchParams(window.location.search);
  const shouldOpenSettings = queryParams.get("openSettings") === "1";
  const storedSessionId = queryParams.get("sessionId") || window.localStorage.getItem(SESSION_STORAGE_KEY) || "";
  applySavedSidebarSettings(readSavedSettings());
  renderCurrentState();
  if (shouldOpenSettings) {
    state.isSidebarOpen = true;
    toggleSidebar(sidebarElement, true);
  }
  if (storedSessionId) {
    hydrateSession(storedSessionId);
  }
}

// src/pages/results/results.js
var resultsLogger = createLogger("results-page");
var SESSION_STORAGE_KEY2 = "freedom-generator:last-session-id";
var DRAW_STORAGE_KEY2 = "freedom-generator:last-draw-id";
var REPEAT_MIN_DURATION_MS = 1600;
function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
function escapeHtml3(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function formatResultTimestamp(value) {
  if (!value) {
    return "\u0431\u0435\u0437 \u0434\u0430\u0442\u044B";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  const seconds = String(parsed.getSeconds()).padStart(2, "0");
  return `${day}.${month}.${year} \u0432 ${hours}:${minutes}:${seconds}`;
}
function setStatus2(statusElement, message, kind = "info") {
  statusElement.textContent = message;
  if (!message) {
    delete statusElement.dataset.kind;
    return;
  }
  statusElement.dataset.kind = kind;
}
function buildDisplayMarkup(value) {
  const text = String(value ?? "").trim();
  if (/^\d{8,}$/.test(text)) {
    return {
      className: " results__text--ticket",
      markup: text.match(/.{1,4}/g).map((group) => `<span class="results__value-group">${escapeHtml3(group)}</span>`).join("")
    };
  }
  return {
    className: "",
    markup: escapeHtml3(text)
  };
}
function renderResults(listElement, draw) {
  if (!draw || draw.winners.length === 0) {
    listElement.innerHTML = `
      <li class="results__item results__item--empty">
        <div class="results__text">
          \u0423 \u044D\u0442\u043E\u0433\u043E \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448\u0430 \u043D\u0435\u0442 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0435\u0439.
        </div>
      </li>
    `;
    return;
  }
  listElement.innerHTML = draw.winners.map((winner) => {
    const display = buildDisplayMarkup(winner.displayValue);
    return `
        <li class="results__item">
          <div class="results__digit"></div>
          <div class="results__text${display.className}">${display.markup}</div>
        </li>
      `;
  }).join("");
}
function renderSkeletonResults(listElement, count = 1) {
  const safeCount = Math.max(1, Number.parseInt(String(count), 10) || 1);
  listElement.innerHTML = Array.from({ length: safeCount }, (_, index) => {
    const lineWidth = 52 + (index % 4 * 10 + 8);
    return `
      <li class="results__item results__item--skeleton" aria-hidden="true">
        <div class="results__digit"></div>
        <div class="results__text">
          <span class="results__skeleton-line" style="width:${lineWidth}%"></span>
        </div>
      </li>
    `;
  }).join("");
}
function buildRepeatPayload(draw) {
  if (!draw) {
    return null;
  }
  return {
    displayColumn: draw.displayColumn,
    filters: draw.filters || {},
    winnersCount: draw.winnersCount || 1,
    removeWinners: draw.removeWinners ? "yes" : "no",
    sortResults: draw.sortResults || "no"
  };
}
function initViewToggle(resultsSectionElement) {
  const typeElements = Array.from(resultsSectionElement.querySelectorAll(".results__type"));
  if (typeElements.length === 0) {
    return;
  }
  const applyType = (targetElement) => {
    typeElements.forEach((typeElement) => {
      const isActive = typeElement === targetElement;
      typeElement.classList.toggle("results__type--active", isActive);
      typeElement.setAttribute("aria-pressed", String(isActive));
    });
    resultsSectionElement.classList.remove("results--view-blocks", "results--view-list");
    if (targetElement.classList.contains("results__type--blocks")) {
      resultsSectionElement.classList.add("results--view-blocks");
      return;
    }
    resultsSectionElement.classList.add("results--view-list");
  };
  typeElements.forEach((typeElement) => {
    typeElement.addEventListener("click", () => {
      applyType(typeElement);
    });
    typeElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        applyType(typeElement);
      }
    });
  });
  applyType(resultsSectionElement.querySelector(".results__type--active") || typeElements[0]);
}
function buildActionSelectConfig(draw) {
  if (!draw) {
    return {
      value: "disabled",
      options: [{ value: "disabled", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B" }]
    };
  }
  if (draw.appliedRemoval) {
    return {
      value: "removed",
      options: [
        { value: "removed", label: "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0438 \u0443\u0436\u0435 \u0443\u0431\u0440\u0430\u043D\u044B \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430" },
        { value: "reset-exclusions", label: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u0438 \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F" }
      ]
    };
  }
  return {
    value: "exclude-draw",
    options: [
      { value: "exclude-draw", label: "\u0423\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430 \u0442\u0435\u043A\u0443\u0449\u0438\u0445 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0435\u0439" },
      { value: "reset-exclusions", label: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u0438 \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F" }
    ]
  };
}
function initResultsPage() {
  const resultsSectionElement = document.querySelector(".results");
  if (!resultsSectionElement) {
    return;
  }
  initViewToggle(resultsSectionElement);
  const listElement = resultsSectionElement.querySelector("[data-results-list]");
  const subtextElement = resultsSectionElement.querySelector("[data-results-subtext]");
  const statusElement = resultsSectionElement.querySelector("[data-results-status]");
  const actionSelectMountElement = resultsSectionElement.querySelector(
    "[data-results-action-select]"
  );
  const backButtonElement = resultsSectionElement.querySelector("[data-back-button]");
  const repeatButtonElement = resultsSectionElement.querySelector("[data-repeat-button]");
  const queryParams = new URLSearchParams(window.location.search);
  let sessionId = queryParams.get("sessionId") || window.localStorage.getItem(SESSION_STORAGE_KEY2) || "";
  let drawId = queryParams.get("drawId") || window.localStorage.getItem(DRAW_STORAGE_KEY2) || "";
  if (queryParams.get("sessionId") || queryParams.get("drawId")) {
    if (sessionId) {
      window.localStorage.setItem(SESSION_STORAGE_KEY2, sessionId);
    }
    if (drawId) {
      window.localStorage.setItem(DRAW_STORAGE_KEY2, drawId);
    }
    window.history.replaceState({}, "", buildAppPath("results.html"));
  }
  const state = {
    session: null,
    draw: null,
    isActionPending: false,
    isRepeatPending: false
  };
  function renderActionSelect() {
    const config = buildActionSelectConfig(state.draw);
    mountDynamicSelect(actionSelectMountElement, {
      name: "resultsAction",
      value: config.value,
      options: config.options,
      classes: "select--up results__select"
    });
    actionSelectMountElement.querySelector(".select__input")?.addEventListener("change", async (event) => {
      if (state.isActionPending) {
        return;
      }
      if (event.target.value === "disabled" || event.target.value === "removed") {
        return;
      }
      if (!state.session) {
        return;
      }
      if (event.target.value === "exclude-draw") {
        if (!state.draw) {
          return;
        }
        state.isActionPending = true;
        setStatus2(statusElement, "\u0423\u0431\u0438\u0440\u0430\u0435\u043C \u0442\u0435\u043A\u0443\u0449\u0438\u0445 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430\u2026");
        try {
          const response = await api.excludeDraw(state.session.id, state.draw.id);
          state.session = response.session;
          state.draw = response.draw;
          renderActionSelect();
          setStatus2(
            statusElement,
            "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0438 \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u044B. \u041C\u043E\u0436\u043D\u043E \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0442\u044C\u0441\u044F \u043A \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C.",
            "success"
          );
        } catch (error) {
          resultsLogger.error("Failed to exclude winners", error);
          setStatus2(statusElement, error.message, "error");
        } finally {
          state.isActionPending = false;
        }
        return;
      }
      if (event.target.value === "reset-exclusions") {
        state.isActionPending = true;
        setStatus2(statusElement, "\u0421\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0435\u043C \u0432\u0441\u0435 \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F\u2026");
        try {
          const response = await api.resetExclusions(state.session.id);
          state.session = response.session;
          if (state.draw) {
            state.draw.appliedRemoval = false;
          }
          renderActionSelect();
          setStatus2(
            statusElement,
            "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u043E\u0447\u0438\u0449\u0435\u043D\u0430. \u0412\u0441\u0435 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438 \u0441\u043D\u043E\u0432\u0430 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u044B \u0432 \u0441\u043F\u0438\u0441\u043E\u043A.",
            "success"
          );
        } catch (error) {
          resultsLogger.error("Failed to reset exclusions", error);
          setStatus2(statusElement, error.message, "error");
        } finally {
          state.isActionPending = false;
        }
      }
    });
  }
  async function loadDraw() {
    if (!sessionId || !drawId) {
      setStatus2(statusElement, "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A.", "error");
      return;
    }
    setStatus2(statusElement, "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448\u0430\u2026");
    try {
      const response = await api.getDraw(sessionId, drawId);
      state.session = response.session;
      state.draw = response.draw;
      window.localStorage.setItem(SESSION_STORAGE_KEY2, response.session.id);
      window.localStorage.setItem(DRAW_STORAGE_KEY2, response.draw.id);
      renderResults(listElement, response.draw);
      renderActionSelect();
      subtextElement.textContent = formatResultTimestamp(response.draw.createdAt);
      setStatus2(statusElement, "");
    } catch (error) {
      resultsLogger.error("Failed to load draw", error);
      setStatus2(statusElement, error.message, "error");
    }
  }
  backButtonElement?.addEventListener("click", () => {
    if (!sessionId) {
      window.location.href = buildAppUrl("random.html");
      return;
    }
    window.location.href = buildAppUrl("random.html?openSettings=1");
  });
  repeatButtonElement?.addEventListener("click", async () => {
    if (!state.session || !state.draw || state.isRepeatPending) {
      return;
    }
    const previousDraw = state.draw;
    const payload = buildRepeatPayload(state.draw);
    if (!payload) {
      return;
    }
    state.isRepeatPending = true;
    repeatButtonElement.disabled = true;
    repeatButtonElement.textContent = "\u0420\u0430\u0437\u044B\u0433\u0440\u044B\u0432\u0430\u0435\u043C...";
    resultsSectionElement.classList.add("results--refreshing");
    renderSkeletonResults(listElement, previousDraw.winnersCount || previousDraw.winners.length || 1);
    setStatus2(statusElement, "\u041F\u0440\u043E\u0432\u043E\u0434\u0438\u043C \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448...");
    try {
      const [response] = await Promise.all([
        api.draw(state.session.id, payload),
        wait(REPEAT_MIN_DURATION_MS)
      ]);
      state.session = response.session;
      state.draw = response.draw;
      sessionId = response.session.id;
      drawId = response.draw.id;
      window.localStorage.setItem(SESSION_STORAGE_KEY2, response.session.id);
      window.localStorage.setItem(DRAW_STORAGE_KEY2, response.draw.id);
      window.history.replaceState({}, "", buildAppPath("results.html"));
      renderResults(listElement, response.draw);
      renderActionSelect();
      subtextElement.textContent = formatResultTimestamp(response.draw.createdAt);
      setStatus2(statusElement, "\u041D\u043E\u0432\u044B\u0435 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0438 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u044B.", "success");
    } catch (error) {
      resultsLogger.error("Failed to repeat draw", error);
      renderResults(listElement, previousDraw);
      setStatus2(statusElement, error.message, "error");
    } finally {
      state.isRepeatPending = false;
      repeatButtonElement.disabled = false;
      repeatButtonElement.textContent = "\u0420\u0430\u0437\u044B\u0433\u0440\u0430\u0442\u044C \u0435\u0449\u0451";
      resultsSectionElement.classList.remove("results--refreshing");
    }
  });
  renderActionSelect();
  loadDraw();
}

// src/js/main.js
import_aos.default.init({
  duration: 700,
  easing: "ease-out-cubic",
  once: false
});
initSelects();
initRandomControls();
initResultsPage();
