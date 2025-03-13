/* { "version": "1", "hash": "MEQCIBVP8IEcsLAUTLfKaJljvrpKW8LkALED2wd53P/8bkHCAiBbiOi8rAAQYVc8kkswVN/TGiD293Z9g0jrIxrWk92tXg==" } */
/* https://hcaptcha.com/license */
!(function () {
  "use strict";
  function e(e) {
    var t = this.constructor;
    return this.then(
      function (n) {
        return t.resolve(e()).then(function () {
          return n;
        });
      },
      function (n) {
        return t.resolve(e()).then(function () {
          return t.reject(n);
        });
      }
    );
  }
  function t(e) {
    return new this(function (t, n) {
      if (!e || "undefined" == typeof e.length)
        return n(
          new TypeError(
            typeof e +
              " " +
              e +
              " is not iterable(cannot read property Symbol(Symbol.iterator))"
          )
        );
      var r = Array.prototype.slice.call(e);
      if (0 === r.length) return t([]);
      var i = r.length;
      function o(e, n) {
        if (n && ("object" == typeof n || "function" == typeof n)) {
          var a = n.then;
          if ("function" == typeof a)
            return void a.call(
              n,
              function (t) {
                o(e, t);
              },
              function (n) {
                (r[e] = { status: "rejected", reason: n }), 0 == --i && t(r);
              }
            );
        }
        (r[e] = { status: "fulfilled", value: n }), 0 == --i && t(r);
      }
      for (var a = 0; a < r.length; a++) o(a, r[a]);
    });
  }
  var n = setTimeout,
    r = "undefined" != typeof setImmediate ? setImmediate : null;
  function i(e) {
    return Boolean(e && "undefined" != typeof e.length);
  }
  function o() {}
  function a(e) {
    if (!(this instanceof a))
      throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof e) throw new TypeError("not a function");
    (this._state = 0),
      (this._handled = !1),
      (this._value = undefined),
      (this._deferreds = []),
      d(e, this);
  }
  function s(e, t) {
    for (; 3 === e._state; ) e = e._value;
    0 !== e._state
      ? ((e._handled = !0),
        a._immediateFn(function () {
          var n = 1 === e._state ? t.onFulfilled : t.onRejected;
          if (null !== n) {
            var r;
            try {
              r = n(e._value);
            } catch (i) {
              return void l(t.promise, i);
            }
            c(t.promise, r);
          } else (1 === e._state ? c : l)(t.promise, e._value);
        }))
      : e._deferreds.push(t);
  }
  function c(e, t) {
    try {
      if (t === e)
        throw new TypeError("A promise cannot be resolved with itself.");
      if (t && ("object" == typeof t || "function" == typeof t)) {
        var n = t.then;
        if (t instanceof a) return (e._state = 3), (e._value = t), void h(e);
        if ("function" == typeof n)
          return void d(
            ((r = n),
            (i = t),
            function () {
              r.apply(i, arguments);
            }),
            e
          );
      }
      (e._state = 1), (e._value = t), h(e);
    } catch (o) {
      l(e, o);
    }
    var r, i;
  }
  function l(e, t) {
    (e._state = 2), (e._value = t), h(e);
  }
  function h(e) {
    2 === e._state &&
      0 === e._deferreds.length &&
      a._immediateFn(function () {
        e._handled || a._unhandledRejectionFn(e._value);
      });
    for (var t = 0, n = e._deferreds.length; t < n; t++) s(e, e._deferreds[t]);
    e._deferreds = null;
  }
  function u(e, t, n) {
    (this.onFulfilled = "function" == typeof e ? e : null),
      (this.onRejected = "function" == typeof t ? t : null),
      (this.promise = n);
  }
  function d(e, t) {
    var n = !1;
    try {
      e(
        function (e) {
          n || ((n = !0), c(t, e));
        },
        function (e) {
          n || ((n = !0), l(t, e));
        }
      );
    } catch (r) {
      if (n) return;
      (n = !0), l(t, r);
    }
  }
  (a.prototype["catch"] = function (e) {
    return this.then(null, e);
  }),
    (a.prototype.then = function (e, t) {
      var n = new this.constructor(o);
      return s(this, new u(e, t, n)), n;
    }),
    (a.prototype["finally"] = e),
    (a.all = function (e) {
      return new a(function (t, n) {
        if (!i(e)) return n(new TypeError("Promise.all accepts an array"));
        var r = Array.prototype.slice.call(e);
        if (0 === r.length) return t([]);
        var o = r.length;
        function a(e, i) {
          try {
            if (i && ("object" == typeof i || "function" == typeof i)) {
              var s = i.then;
              if ("function" == typeof s)
                return void s.call(
                  i,
                  function (t) {
                    a(e, t);
                  },
                  n
                );
            }
            (r[e] = i), 0 == --o && t(r);
          } catch (c) {
            n(c);
          }
        }
        for (var s = 0; s < r.length; s++) a(s, r[s]);
      });
    }),
    (a.allSettled = t),
    (a.resolve = function (e) {
      return e && "object" == typeof e && e.constructor === a
        ? e
        : new a(function (t) {
            t(e);
          });
    }),
    (a.reject = function (e) {
      return new a(function (t, n) {
        n(e);
      });
    }),
    (a.race = function (e) {
      return new a(function (t, n) {
        if (!i(e)) return n(new TypeError("Promise.race accepts an array"));
        for (var r = 0, o = e.length; r < o; r++) a.resolve(e[r]).then(t, n);
      });
    }),
    (a._immediateFn =
      ("function" == typeof r &&
        function (e) {
          r(e);
        }) ||
      function (e) {
        n(e, 0);
      }),
    (a._unhandledRejectionFn = function (e) {
      "undefined" != typeof console &&
        console &&
        console.warn("Possible Unhandled Promise Rejection:", e);
    });
  var p = (function () {
    if ("undefined" != typeof self) return self;
    if ("undefined" != typeof window) return window;
    if ("undefined" != typeof global) return global;
    throw new Error("unable to locate global object");
  })();
  function f(e, t, n) {
    return t <= e && e <= n;
  }
  function m(e) {
    if (e === undefined) return {};
    if (e === Object(e)) return e;
    throw TypeError("Could not convert argument to dictionary");
  }
  "function" != typeof p.Promise
    ? (p.Promise = a)
    : (p.Promise.prototype["finally"] || (p.Promise.prototype["finally"] = e),
      p.Promise.allSettled || (p.Promise.allSettled = t));
  var g = function (e) {
      return e >= 0 && e <= 127;
    },
    y = -1;
  function v(e) {
    (this.tokens = [].slice.call(e)), this.tokens.reverse();
  }
  v.prototype = {
    endOfStream: function () {
      return !this.tokens.length;
    },
    read: function () {
      return this.tokens.length ? this.tokens.pop() : y;
    },
    prepend: function (e) {
      if (Array.isArray(e))
        for (var t = e; t.length; ) this.tokens.push(t.pop());
      else this.tokens.push(e);
    },
    push: function (e) {
      if (Array.isArray(e))
        for (var t = e; t.length; ) this.tokens.unshift(t.shift());
      else this.tokens.unshift(e);
    },
  };
  var w = -1;
  function b(e, t) {
    if (e) throw TypeError("Decoder error");
    return t || 65533;
  }
  function _(e) {
    return (
      (e = String(e).trim().toLowerCase()),
      Object.prototype.hasOwnProperty.call(k, e) ? k[e] : null
    );
  }
  var k = {};
  [
    {
      encodings: [
        { labels: ["unicode-1-1-utf-8", "utf-8", "utf8"], name: "UTF-8" },
      ],
      heading: "The Encoding",
    },
  ].forEach(function (e) {
    e.encodings.forEach(function (e) {
      e.labels.forEach(function (t) {
        k[t] = e;
      });
    });
  });
  var V,
    E = {
      "UTF-8": function (e) {
        return new C(e);
      },
    },
    x = {
      "UTF-8": function (e) {
        return new U(e);
      },
    },
    S = "utf-8";
  function R(e, t) {
    if (!(this instanceof R))
      throw TypeError("Called as a function. Did you forget 'new'?");
    (e = e !== undefined ? String(e) : S),
      (t = m(t)),
      (this._encoding = null),
      (this._decoder = null),
      (this._ignoreBOM = !1),
      (this._BOMseen = !1),
      (this._error_mode = "replacement"),
      (this._do_not_flush = !1);
    var n = _(e);
    if (null === n || "replacement" === n.name)
      throw RangeError("Unknown encoding: " + e);
    if (!x[n.name])
      throw Error(
        "Decoder not present. Did you forget to include encoding-indexes.js first?"
      );
    var r = this;
    return (
      (r._encoding = n),
      t.fatal && (r._error_mode = "fatal"),
      t.ignoreBOM && (r._ignoreBOM = !0),
      Object.defineProperty ||
        ((this.encoding = r._encoding.name.toLowerCase()),
        (this.fatal = "fatal" === r._error_mode),
        (this.ignoreBOM = r._ignoreBOM)),
      r
    );
  }
  function T(e, t) {
    if (!(this instanceof T))
      throw TypeError("Called as a function. Did you forget 'new'?");
    (t = m(t)),
      (this._encoding = null),
      (this._encoder = null),
      (this._do_not_flush = !1),
      (this._fatal = t.fatal ? "fatal" : "replacement");
    var n = this;
    if (t.NONSTANDARD_allowLegacyEncoding) {
      var r = _((e = e !== undefined ? String(e) : S));
      if (null === r || "replacement" === r.name)
        throw RangeError("Unknown encoding: " + e);
      if (!E[r.name])
        throw Error(
          "Encoder not present. Did you forget to include encoding-indexes.js first?"
        );
      n._encoding = r;
    } else n._encoding = _("utf-8");
    return (
      Object.defineProperty || (this.encoding = n._encoding.name.toLowerCase()),
      n
    );
  }
  function U(e) {
    var t = e.fatal,
      n = 0,
      r = 0,
      i = 0,
      o = 128,
      a = 191;
    this.handler = function (e, s) {
      if (s === y && 0 !== i) return (i = 0), b(t);
      if (s === y) return w;
      if (0 === i) {
        if (f(s, 0, 127)) return s;
        if (f(s, 194, 223)) (i = 1), (n = 31 & s);
        else if (f(s, 224, 239))
          224 === s && (o = 160), 237 === s && (a = 159), (i = 2), (n = 15 & s);
        else {
          if (!f(s, 240, 244)) return b(t);
          240 === s && (o = 144), 244 === s && (a = 143), (i = 3), (n = 7 & s);
        }
        return null;
      }
      if (!f(s, o, a))
        return (n = i = r = 0), (o = 128), (a = 191), e.prepend(s), b(t);
      if (((o = 128), (a = 191), (n = (n << 6) | (63 & s)), (r += 1) !== i))
        return null;
      var c = n;
      return (n = i = r = 0), c;
    };
  }
  function C(e) {
    e.fatal;
    this.handler = function (e, t) {
      if (t === y) return w;
      if (g(t)) return t;
      var n, r;
      f(t, 128, 2047)
        ? ((n = 1), (r = 192))
        : f(t, 2048, 65535)
        ? ((n = 2), (r = 224))
        : f(t, 65536, 1114111) && ((n = 3), (r = 240));
      for (var i = [(t >> (6 * n)) + r]; n > 0; ) {
        var o = t >> (6 * (n - 1));
        i.push(128 | (63 & o)), (n -= 1);
      }
      return i;
    };
  }
  Object.defineProperty &&
    (Object.defineProperty(R.prototype, "encoding", {
      get: function () {
        return this._encoding.name.toLowerCase();
      },
    }),
    Object.defineProperty(R.prototype, "fatal", {
      get: function () {
        return "fatal" === this._error_mode;
      },
    }),
    Object.defineProperty(R.prototype, "ignoreBOM", {
      get: function () {
        return this._ignoreBOM;
      },
    })),
    (R.prototype.decode = function (e, t) {
      var n;
      (n =
        "object" == typeof e && e instanceof ArrayBuffer
          ? new Uint8Array(e)
          : "object" == typeof e &&
            "buffer" in e &&
            e.buffer instanceof ArrayBuffer
          ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
          : new Uint8Array(0)),
        (t = m(t)),
        this._do_not_flush ||
          ((this._decoder = x[this._encoding.name]({
            fatal: "fatal" === this._error_mode,
          })),
          (this._BOMseen = !1)),
        (this._do_not_flush = Boolean(t.stream));
      for (var r, i = new v(n), o = []; ; ) {
        var a = i.read();
        if (a === y) break;
        if ((r = this._decoder.handler(i, a)) === w) break;
        null !== r && (Array.isArray(r) ? o.push.apply(o, r) : o.push(r));
      }
      if (!this._do_not_flush) {
        do {
          if ((r = this._decoder.handler(i, i.read())) === w) break;
          null !== r && (Array.isArray(r) ? o.push.apply(o, r) : o.push(r));
        } while (!i.endOfStream());
        this._decoder = null;
      }
      return function (e) {
        var t, n;
        return (
          (t = ["UTF-8", "UTF-16LE", "UTF-16BE"]),
          (n = this._encoding.name),
          -1 === t.indexOf(n) ||
            this._ignoreBOM ||
            this._BOMseen ||
            (e.length > 0 && 65279 === e[0]
              ? ((this._BOMseen = !0), e.shift())
              : e.length > 0 && (this._BOMseen = !0)),
          (function (e) {
            for (var t = "", n = 0; n < e.length; ++n) {
              var r = e[n];
              r <= 65535
                ? (t += String.fromCharCode(r))
                : ((r -= 65536),
                  (t += String.fromCharCode(
                    55296 + (r >> 10),
                    56320 + (1023 & r)
                  )));
            }
            return t;
          })(e)
        );
      }.call(this, o);
    }),
    Object.defineProperty &&
      Object.defineProperty(T.prototype, "encoding", {
        get: function () {
          return this._encoding.name.toLowerCase();
        },
      }),
    (T.prototype.encode = function (e, t) {
      (e = e === undefined ? "" : String(e)),
        (t = m(t)),
        this._do_not_flush ||
          (this._encoder = E[this._encoding.name]({
            fatal: "fatal" === this._fatal,
          })),
        (this._do_not_flush = Boolean(t.stream));
      for (
        var n,
          r = new v(
            (function (e) {
              for (var t = String(e), n = t.length, r = 0, i = []; r < n; ) {
                var o = t.charCodeAt(r);
                if (o < 55296 || o > 57343) i.push(o);
                else if (o >= 56320 && o <= 57343) i.push(65533);
                else if (o >= 55296 && o <= 56319)
                  if (r === n - 1) i.push(65533);
                  else {
                    var a = t.charCodeAt(r + 1);
                    if (a >= 56320 && a <= 57343) {
                      var s = 1023 & o,
                        c = 1023 & a;
                      i.push(65536 + (s << 10) + c), (r += 1);
                    } else i.push(65533);
                  }
                r += 1;
              }
              return i;
            })(e)
          ),
          i = [];
        ;

      ) {
        var o = r.read();
        if (o === y) break;
        if ((n = this._encoder.handler(r, o)) === w) break;
        Array.isArray(n) ? i.push.apply(i, n) : i.push(n);
      }
      if (!this._do_not_flush) {
        for (; (n = this._encoder.handler(r, r.read())) !== w; )
          Array.isArray(n) ? i.push.apply(i, n) : i.push(n);
        this._encoder = null;
      }
      return new Uint8Array(i);
    }),
    window.TextDecoder || (window.TextDecoder = R),
    window.TextEncoder || (window.TextEncoder = T),
    (function (e) {
      if ("function" != typeof Promise) throw "Promise support required";
      var t = e.crypto || e.msCrypto;
      if (t) {
        var n = t.subtle || t.webkitSubtle;
        if (n) {
          var r = e.Crypto || t.constructor || Object,
            i = e.SubtleCrypto || n.constructor || Object,
            o =
              (e.CryptoKey || e.Key,
              e.navigator.userAgent.indexOf("Edge/") > -1),
            a = !!e.msCrypto && !o,
            s = !t.subtle && !!t.webkitSubtle;
          if (a || s) {
            var c = { KoZIhvcNAQEB: "1.2.840.113549.1.1.1" },
              l = { "1.2.840.113549.1.1.1": "KoZIhvcNAQEB" };
            if (
              (["generateKey", "importKey", "unwrapKey"].forEach(function (e) {
                var r = n[e];
                n[e] = function (i, o, c) {
                  var l,
                    h,
                    u,
                    f,
                    b = [].slice.call(arguments);
                  switch (e) {
                    case "generateKey":
                      (l = m(i)), (h = o), (u = c);
                      break;
                    case "importKey":
                      (l = m(c)),
                        (h = b[3]),
                        (u = b[4]),
                        "jwk" === i &&
                          ((o = y(o)).alg || (o.alg = g(l)),
                          o.key_ops ||
                            (o.key_ops =
                              "oct" !== o.kty
                                ? "d" in o
                                  ? u.filter(x)
                                  : u.filter(E)
                                : u.slice()),
                          (b[1] = v(o)));
                      break;
                    case "unwrapKey":
                      (l = b[4]), (h = b[5]), (u = b[6]), (b[2] = c._key);
                  }
                  if ("generateKey" === e && "HMAC" === l.name && l.hash)
                    return (
                      (l.length =
                        l.length ||
                        {
                          "SHA-1": 512,
                          "SHA-256": 512,
                          "SHA-384": 1024,
                          "SHA-512": 1024,
                        }[l.hash.name]),
                      n.importKey(
                        "raw",
                        t.getRandomValues(new Uint8Array((l.length + 7) >> 3)),
                        l,
                        h,
                        u
                      )
                    );
                  if (
                    s &&
                    "generateKey" === e &&
                    "RSASSA-PKCS1-v1_5" === l.name &&
                    (!l.modulusLength || l.modulusLength >= 2048)
                  )
                    return (
                      ((i = m(i)).name = "RSAES-PKCS1-v1_5"),
                      delete i.hash,
                      n
                        .generateKey(i, !0, ["encrypt", "decrypt"])
                        .then(function (e) {
                          return Promise.all([
                            n.exportKey("jwk", e.publicKey),
                            n.exportKey("jwk", e.privateKey),
                          ]);
                        })
                        .then(function (e) {
                          return (
                            (e[0].alg = e[1].alg = g(l)),
                            (e[0].key_ops = u.filter(E)),
                            (e[1].key_ops = u.filter(x)),
                            Promise.all([
                              n.importKey("jwk", e[0], l, !0, e[0].key_ops),
                              n.importKey("jwk", e[1], l, h, e[1].key_ops),
                            ])
                          );
                        })
                        .then(function (e) {
                          return { publicKey: e[0], privateKey: e[1] };
                        })
                    );
                  if (
                    (s || (a && "SHA-1" === (l.hash || {}).name)) &&
                    "importKey" === e &&
                    "jwk" === i &&
                    "HMAC" === l.name &&
                    "oct" === o.kty
                  )
                    return n.importKey("raw", p(d(o.k)), c, b[3], b[4]);
                  if (s && "importKey" === e && ("spki" === i || "pkcs8" === i))
                    return n.importKey("jwk", w(o), c, b[3], b[4]);
                  if (a && "unwrapKey" === e)
                    return n.decrypt(b[3], c, o).then(function (e) {
                      return n.importKey(i, e, b[4], b[5], b[6]);
                    });
                  try {
                    f = r.apply(n, b);
                  } catch (_) {
                    return Promise.reject(_);
                  }
                  return (
                    a &&
                      (f = new Promise(function (e, t) {
                        (f.onabort = f.onerror =
                          function (e) {
                            t(e);
                          }),
                          (f.oncomplete = function (t) {
                            e(t.target.result);
                          });
                      })),
                    (f = f.then(function (e) {
                      return (
                        "HMAC" === l.name &&
                          (l.length || (l.length = 8 * e.algorithm.length)),
                        0 == l.name.search("RSA") &&
                          (l.modulusLength ||
                            (l.modulusLength = (
                              e.publicKey || e
                            ).algorithm.modulusLength),
                          l.publicExponent ||
                            (l.publicExponent = (
                              e.publicKey || e
                            ).algorithm.publicExponent)),
                        (e =
                          e.publicKey && e.privateKey
                            ? {
                                publicKey: new V(
                                  e.publicKey,
                                  l,
                                  h,
                                  u.filter(E)
                                ),
                                privateKey: new V(
                                  e.privateKey,
                                  l,
                                  h,
                                  u.filter(x)
                                ),
                              }
                            : new V(e, l, h, u))
                      );
                    }))
                  );
                };
              }),
              ["exportKey", "wrapKey"].forEach(function (e) {
                var t = n[e];
                n[e] = function (r, i, o) {
                  var c,
                    l = [].slice.call(arguments);
                  switch (e) {
                    case "exportKey":
                      l[1] = i._key;
                      break;
                    case "wrapKey":
                      (l[1] = i._key), (l[2] = o._key);
                  }
                  if (
                    ((s || (a && "SHA-1" === (i.algorithm.hash || {}).name)) &&
                      "exportKey" === e &&
                      "jwk" === r &&
                      "HMAC" === i.algorithm.name &&
                      (l[0] = "raw"),
                    !s ||
                      "exportKey" !== e ||
                      ("spki" !== r && "pkcs8" !== r) ||
                      (l[0] = "jwk"),
                    a && "wrapKey" === e)
                  )
                    return n.exportKey(r, i).then(function (e) {
                      return (
                        "jwk" === r &&
                          (e = p(
                            unescape(encodeURIComponent(JSON.stringify(y(e))))
                          )),
                        n.encrypt(l[3], o, e)
                      );
                    });
                  try {
                    c = t.apply(n, l);
                  } catch (h) {
                    return Promise.reject(h);
                  }
                  return (
                    a &&
                      (c = new Promise(function (e, t) {
                        (c.onabort = c.onerror =
                          function (e) {
                            t(e);
                          }),
                          (c.oncomplete = function (t) {
                            e(t.target.result);
                          });
                      })),
                    "exportKey" === e &&
                      "jwk" === r &&
                      (c = c.then(function (e) {
                        return (s ||
                          (a && "SHA-1" === (i.algorithm.hash || {}).name)) &&
                          "HMAC" === i.algorithm.name
                          ? {
                              kty: "oct",
                              alg: g(i.algorithm),
                              key_ops: i.usages.slice(),
                              ext: !0,
                              k: u(f(e)),
                            }
                          : ((e = y(e)).alg || (e.alg = g(i.algorithm)),
                            e.key_ops ||
                              (e.key_ops =
                                "public" === i.type
                                  ? i.usages.filter(E)
                                  : "private" === i.type
                                  ? i.usages.filter(x)
                                  : i.usages.slice()),
                            e);
                      })),
                    !s ||
                      "exportKey" !== e ||
                      ("spki" !== r && "pkcs8" !== r) ||
                      (c = c.then(function (e) {
                        return (e = b(y(e)));
                      })),
                    c
                  );
                };
              }),
              ["encrypt", "decrypt", "sign", "verify"].forEach(function (e) {
                var t = n[e];
                n[e] = function (r, i, o, s) {
                  if (a && (!o.byteLength || (s && !s.byteLength)))
                    throw new Error("Empty input is not allowed");
                  var c,
                    l = [].slice.call(arguments),
                    h = m(r);
                  if (
                    (!a ||
                      ("sign" !== e && "verify" !== e) ||
                      ("RSASSA-PKCS1-v1_5" !== r && "HMAC" !== r) ||
                      (l[0] = { name: r }),
                    a &&
                      i.algorithm.hash &&
                      (l[0].hash = l[0].hash || i.algorithm.hash),
                    a && "decrypt" === e && "AES-GCM" === h.name)
                  ) {
                    var u = r.tagLength >> 3;
                    (l[2] = (o.buffer || o).slice(0, o.byteLength - u)),
                      (r.tag = (o.buffer || o).slice(o.byteLength - u));
                  }
                  a &&
                    "AES-GCM" === h.name &&
                    l[0].tagLength === undefined &&
                    (l[0].tagLength = 128),
                    (l[1] = i._key);
                  try {
                    c = t.apply(n, l);
                  } catch (d) {
                    return Promise.reject(d);
                  }
                  return (
                    a &&
                      (c = new Promise(function (t, n) {
                        (c.onabort = c.onerror =
                          function (e) {
                            n(e);
                          }),
                          (c.oncomplete = function (n) {
                            n = n.target.result;
                            if (
                              "encrypt" === e &&
                              n instanceof AesGcmEncryptResult
                            ) {
                              var r = n.ciphertext,
                                i = n.tag;
                              (n = new Uint8Array(
                                r.byteLength + i.byteLength
                              )).set(new Uint8Array(r), 0),
                                n.set(new Uint8Array(i), r.byteLength),
                                (n = n.buffer);
                            }
                            t(n);
                          });
                      })),
                    c
                  );
                };
              }),
              a)
            ) {
              var h = n.digest;
              (n.digest = function (e, t) {
                if (!t.byteLength)
                  throw new Error("Empty input is not allowed");
                var r;
                try {
                  r = h.call(n, e, t);
                } catch (i) {
                  return Promise.reject(i);
                }
                return (
                  (r = new Promise(function (e, t) {
                    (r.onabort = r.onerror =
                      function (e) {
                        t(e);
                      }),
                      (r.oncomplete = function (t) {
                        e(t.target.result);
                      });
                  })),
                  r
                );
              }),
                (e.crypto = Object.create(t, {
                  getRandomValues: {
                    value: function (e) {
                      return t.getRandomValues(e);
                    },
                  },
                  subtle: { value: n },
                })),
                (e.CryptoKey = V);
            }
            s &&
              ((t.subtle = n),
              (e.Crypto = r),
              (e.SubtleCrypto = i),
              (e.CryptoKey = V));
          }
        }
      }
      function u(e) {
        return btoa(e)
          .replace(/\=+$/, "")
          .replace(/\+/g, "-")
          .replace(/\//g, "_");
      }
      function d(e) {
        return (
          (e = (e += "===").slice(0, -e.length % 4)),
          atob(e.replace(/-/g, "+").replace(/_/g, "/"))
        );
      }
      function p(e) {
        for (var t = new Uint8Array(e.length), n = 0; n < e.length; n++)
          t[n] = e.charCodeAt(n);
        return t;
      }
      function f(e) {
        return (
          e instanceof ArrayBuffer && (e = new Uint8Array(e)),
          String.fromCharCode.apply(String, e)
        );
      }
      function m(e) {
        var t = { name: (e.name || e || "").toUpperCase().replace("V", "v") };
        switch (t.name) {
          case "SHA-1":
          case "SHA-256":
          case "SHA-384":
          case "SHA-512":
            break;
          case "AES-CBC":
          case "AES-GCM":
          case "AES-KW":
            e.length && (t.length = e.length);
            break;
          case "HMAC":
            e.hash && (t.hash = m(e.hash)), e.length && (t.length = e.length);
            break;
          case "RSAES-PKCS1-v1_5":
            e.publicExponent &&
              (t.publicExponent = new Uint8Array(e.publicExponent)),
              e.modulusLength && (t.modulusLength = e.modulusLength);
            break;
          case "RSASSA-PKCS1-v1_5":
          case "RSA-OAEP":
            e.hash && (t.hash = m(e.hash)),
              e.publicExponent &&
                (t.publicExponent = new Uint8Array(e.publicExponent)),
              e.modulusLength && (t.modulusLength = e.modulusLength);
            break;
          default:
            throw new SyntaxError("Bad algorithm name");
        }
        return t;
      }
      function g(e) {
        return {
          HMAC: {
            "SHA-1": "HS1",
            "SHA-256": "HS256",
            "SHA-384": "HS384",
            "SHA-512": "HS512",
          },
          "RSASSA-PKCS1-v1_5": {
            "SHA-1": "RS1",
            "SHA-256": "RS256",
            "SHA-384": "RS384",
            "SHA-512": "RS512",
          },
          "RSAES-PKCS1-v1_5": { "": "RSA1_5" },
          "RSA-OAEP": { "SHA-1": "RSA-OAEP", "SHA-256": "RSA-OAEP-256" },
          "AES-KW": { 128: "A128KW", 192: "A192KW", 256: "A256KW" },
          "AES-GCM": { 128: "A128GCM", 192: "A192GCM", 256: "A256GCM" },
          "AES-CBC": { 128: "A128CBC", 192: "A192CBC", 256: "A256CBC" },
        }[e.name][(e.hash || {}).name || e.length || ""];
      }
      function y(e) {
        (e instanceof ArrayBuffer || e instanceof Uint8Array) &&
          (e = JSON.parse(decodeURIComponent(escape(f(e)))));
        var t = { kty: e.kty, alg: e.alg, ext: e.ext || e.extractable };
        switch (t.kty) {
          case "oct":
            t.k = e.k;
          case "RSA":
            ["n", "e", "d", "p", "q", "dp", "dq", "qi", "oth"].forEach(
              function (n) {
                n in e && (t[n] = e[n]);
              }
            );
            break;
          default:
            throw new TypeError("Unsupported key type");
        }
        return t;
      }
      function v(e) {
        var t = y(e);
        return (
          a && ((t.extractable = t.ext), delete t.ext),
          p(unescape(encodeURIComponent(JSON.stringify(t)))).buffer
        );
      }
      function w(e) {
        var t = _(e),
          n = !1;
        t.length > 2 && ((n = !0), t.shift());
        var r = { ext: !0 };
        if ("1.2.840.113549.1.1.1" !== t[0][0])
          throw new TypeError("Unsupported key type");
        var i = ["n", "e", "d", "p", "q", "dp", "dq", "qi"],
          o = _(t[1]);
        n && o.shift();
        for (var a = 0; a < o.length; a++)
          o[a][0] || (o[a] = o[a].subarray(1)), (r[i[a]] = u(f(o[a])));
        return (r.kty = "RSA"), r;
      }
      function b(e) {
        var t,
          n = [["", null]],
          r = !1;
        if ("RSA" !== e.kty) throw new TypeError("Unsupported key type");
        for (
          var i = ["n", "e", "d", "p", "q", "dp", "dq", "qi"], o = [], a = 0;
          a < i.length && i[a] in e;
          a++
        ) {
          var s = (o[a] = p(d(e[i[a]])));
          128 & s[0] && ((o[a] = new Uint8Array(s.length + 1)), o[a].set(s, 1));
        }
        return (
          o.length > 2 && ((r = !0), o.unshift(new Uint8Array([0]))),
          (n[0][0] = "1.2.840.113549.1.1.1"),
          (t = o),
          n.push(new Uint8Array(k(t)).buffer),
          r ? n.unshift(new Uint8Array([0])) : (n[1] = { tag: 3, value: n[1] }),
          new Uint8Array(k(n)).buffer
        );
      }
      function _(e, t) {
        if (
          (e instanceof ArrayBuffer && (e = new Uint8Array(e)),
          t || (t = { pos: 0, end: e.length }),
          t.end - t.pos < 2 || t.end > e.length)
        )
          throw new RangeError("Malformed DER");
        var n,
          r = e[t.pos++],
          i = e[t.pos++];
        if (i >= 128) {
          if (((i &= 127), t.end - t.pos < i))
            throw new RangeError("Malformed DER");
          for (var o = 0; i--; ) (o <<= 8), (o |= e[t.pos++]);
          i = o;
        }
        if (t.end - t.pos < i) throw new RangeError("Malformed DER");
        switch (r) {
          case 2:
            n = e.subarray(t.pos, (t.pos += i));
            break;
          case 3:
            if (e[t.pos++]) throw new Error("Unsupported bit string");
            i--;
          case 4:
            n = new Uint8Array(e.subarray(t.pos, (t.pos += i))).buffer;
            break;
          case 5:
            n = null;
            break;
          case 6:
            var a = btoa(f(e.subarray(t.pos, (t.pos += i))));
            if (!(a in c)) throw new Error("Unsupported OBJECT ID " + a);
            n = c[a];
            break;
          case 48:
            n = [];
            for (var s = t.pos + i; t.pos < s; ) n.push(_(e, t));
            break;
          default:
            throw new Error("Unsupported DER tag 0x" + r.toString(16));
        }
        return n;
      }
      function k(e, t) {
        t || (t = []);
        var n = 0,
          r = 0,
          i = t.length + 2;
        if ((t.push(0, 0), e instanceof Uint8Array)) {
          (n = 2), (r = e.length);
          for (var o = 0; o < r; o++) t.push(e[o]);
        } else if (e instanceof ArrayBuffer) {
          (n = 4), (r = e.byteLength), (e = new Uint8Array(e));
          for (o = 0; o < r; o++) t.push(e[o]);
        } else if (null === e) (n = 5), (r = 0);
        else if ("string" == typeof e && e in l) {
          var a = p(atob(l[e]));
          (n = 6), (r = a.length);
          for (o = 0; o < r; o++) t.push(a[o]);
        } else if (e instanceof Array) {
          for (o = 0; o < e.length; o++) k(e[o], t);
          (n = 48), (r = t.length - i);
        } else {
          if (
            !(
              "object" == typeof e &&
              3 === e.tag &&
              e.value instanceof ArrayBuffer
            )
          )
            throw new Error("Unsupported DER value " + e);
          (n = 3), (r = (e = new Uint8Array(e.value)).byteLength), t.push(0);
          for (o = 0; o < r; o++) t.push(e[o]);
          r++;
        }
        if (r >= 128) {
          var s = r;
          r = 4;
          for (
            t.splice(
              i,
              0,
              (s >> 24) & 255,
              (s >> 16) & 255,
              (s >> 8) & 255,
              255 & s
            );
            r > 1 && !(s >> 24);

          )
            (s <<= 8), r--;
          r < 4 && t.splice(i, 4 - r), (r |= 128);
        }
        return t.splice(i - 2, 2, n, r), t;
      }
      function V(e, t, n, r) {
        Object.defineProperties(this, {
          _key: { value: e },
          type: { value: e.type, enumerable: !0 },
          extractable: {
            value: n === undefined ? e.extractable : n,
            enumerable: !0,
          },
          algorithm: {
            value: t === undefined ? e.algorithm : t,
            enumerable: !0,
          },
          usages: { value: r === undefined ? e.usages : r, enumerable: !0 },
        });
      }
      function E(e) {
        return "verify" === e || "encrypt" === e || "wrapKey" === e;
      }
      function x(e) {
        return "sign" === e || "decrypt" === e || "unwrapKey" === e;
      }
    })(window),
    Array.prototype.indexOf ||
      (Array.prototype.indexOf = (function (e) {
        return function (t, n) {
          if (null === this || this === undefined)
            throw TypeError(
              "Array.prototype.indexOf called on null or undefined"
            );
          var r = e(this),
            i = r.length >>> 0,
            o = Math.min(0 | n, i);
          if (o < 0) o = Math.max(0, i + o);
          else if (o >= i) return -1;
          if (void 0 === t) {
            for (; o !== i; ++o) if (void 0 === r[o] && o in r) return o;
          } else if (t != t) {
            for (; o !== i; ++o) if (r[o] != r[o]) return o;
          } else for (; o !== i; ++o) if (r[o] === t) return o;
          return -1;
        };
      })(Object)),
    Array.isArray ||
      (Array.isArray = function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
      }),
    document.getElementsByClassName ||
      (window.Element.prototype.getElementsByClassName =
        document.constructor.prototype.getElementsByClassName =
          function (e) {
            if (document.querySelectorAll)
              return document.querySelectorAll("." + e);
            for (
              var t = document.getElementsByTagName("*"),
                n = new RegExp("(^|\\s)" + e + "(\\s|$)"),
                r = [],
                i = 0;
              i < t.length;
              i++
            )
              n.test(t[i].className) && r.push(t[i]);
            return r;
          }),
    String.prototype.startsWith ||
      (String.prototype.startsWith = function (e, t) {
        return this.substr(!t || t < 0 ? 0 : +t, e.length) === e;
      }),
    String.prototype.endsWith ||
      (String.prototype.endsWith = function (e, t) {
        return (
          (t === undefined || t > this.length) && (t = this.length),
          this.substring(t - e.length, t) === e
        );
      });
  try {
    if (
      Object.defineProperty &&
      Object.getOwnPropertyDescriptor &&
      Object.getOwnPropertyDescriptor(Element.prototype, "textContent") &&
      !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get
    ) {
      var M = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
      Object.defineProperty(Element.prototype, "textContent", {
        get: function () {
          return M.get.call(this);
        },
        set: function (e) {
          M.set.call(this, e);
        },
      });
    }
  } catch (Jn) {}
  Function.prototype.bind ||
    (Function.prototype.bind = function (e) {
      if ("function" != typeof this)
        throw new TypeError("Function.prototype.bind: Item Can Not Be Bound.");
      var t = Array.prototype.slice.call(arguments, 1),
        n = this,
        r = function () {},
        i = function () {
          return n.apply(
            this instanceof r ? this : e,
            t.concat(Array.prototype.slice.call(arguments))
          );
        };
      return (
        this.prototype && (r.prototype = this.prototype),
        (i.prototype = new r()),
        i
      );
    }),
    "function" != typeof Object.create &&
      (Object.create = function (e, t) {
        function n() {}
        if (((n.prototype = e), "object" == typeof t))
          for (var r in t) t.hasOwnProperty(r) && (n[r] = t[r]);
        return new n();
      }),
    Date.now ||
      (Date.now = function () {
        return new Date().getTime();
      }),
    window.console || (window.console = {});
  for (
    var O,
      I,
      N,
      W,
      P = ["error", "info", "log", "show", "table", "trace", "warn"],
      A = function (e) {},
      G = P.length;
    --G > -1;

  )
    (V = P[G]), window.console[V] || (window.console[V] = A);
  if (window.atob)
    try {
      window.atob(" ");
    } catch (Kn) {
      window.atob = (function (e) {
        var t = function (t) {
          return e(String(t).replace(/[\t\n\f\r ]+/g, ""));
        };
        return (t.original = e), t;
      })(window.atob);
    }
  else {
    var F = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      j =
        /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
    window.atob = function (e) {
      if (((e = String(e).replace(/[\t\n\f\r ]+/g, "")), !j.test(e)))
        throw new TypeError(
          "Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."
        );
      var t, n, r;
      e += "==".slice(2 - (3 & e.length));
      for (var i = "", o = 0; o < e.length; )
        (t =
          (F.indexOf(e.charAt(o++)) << 18) |
          (F.indexOf(e.charAt(o++)) << 12) |
          ((n = F.indexOf(e.charAt(o++))) << 6) |
          (r = F.indexOf(e.charAt(o++)))),
          (i +=
            64 === n
              ? String.fromCharCode((t >> 16) & 255)
              : 64 === r
              ? String.fromCharCode((t >> 16) & 255, (t >> 8) & 255)
              : String.fromCharCode((t >> 16) & 255, (t >> 8) & 255, 255 & t));
      return i;
    };
  }
  if (
    (Event.prototype.preventDefault ||
      (Event.prototype.preventDefault = function () {
        this.returnValue = !1;
      }),
    Event.prototype.stopPropagation ||
      (Event.prototype.stopPropagation = function () {
        this.cancelBubble = !0;
      }),
    window.Prototype && Array.prototype.toJSON)
  ) {
    console.error(
      "[hCaptcha] Custom JSON polyfill detected, please remove to ensure hCaptcha works properly"
    );
    var B = Array.prototype.toJSON,
      Z = JSON.stringify;
    JSON.stringify = function (e) {
      try {
        return delete Array.prototype.toJSON, Z(e);
      } finally {
        Array.prototype.toJSON = B;
      }
    };
  }
  Object.keys ||
    (Object.keys =
      ((O = Object.prototype.hasOwnProperty),
      (I = !Object.prototype.propertyIsEnumerable.call(
        { toString: null },
        "toString"
      )),
      (W = (N = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor",
      ]).length),
      function (e) {
        if ("function" != typeof e && ("object" != typeof e || null === e))
          throw new TypeError("Object.keys called on non-object");
        var t,
          n,
          r = [];
        for (t in e) O.call(e, t) && r.push(t);
        if (I) for (n = 0; n < W; n++) O.call(e, N[n]) && r.push(N[n]);
        return r;
      })),
    /*! Raven.js 3.27.2 (6d91db933) | github.com/getsentry/raven-js */ (function (
      e
    ) {
      if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = e();
      else if ("function" == typeof define && define.amd) define("raven-js", e);
      else {
        ("undefined" != typeof window
          ? window
          : "undefined" != typeof global
          ? global
          : "undefined" != typeof self
          ? self
          : this
        ).Raven = e();
      }
    })(function () {
      return (function e(t, n, r) {
        function i(a, s) {
          if (!n[a]) {
            if (!t[a]) {
              var c = "function" == typeof require && require;
              if (!s && c) return c(a, !0);
              if (o) return o(a, !0);
              var l = new Error("Cannot find module '" + a + "'");
              throw ((l.code = "MODULE_NOT_FOUND"), l);
            }
            var h = (n[a] = { exports: {} });
            t[a][0].call(
              h.exports,
              function (e) {
                var n = t[a][1][e];
                return i(n || e);
              },
              h,
              h.exports,
              e,
              t,
              n,
              r
            );
          }
          return n[a].exports;
        }
        for (
          var o = "function" == typeof require && require, a = 0;
          a < r.length;
          a++
        )
          i(r[a]);
        return i;
      })(
        {
          1: [
            function (e, t, n) {
              function r(e) {
                (this.name = "RavenConfigError"), (this.message = e);
              }
              (r.prototype = new Error()),
                (r.prototype.constructor = r),
                (t.exports = r);
            },
            {},
          ],
          2: [
            function (e, t, n) {
              var r = e(5);
              t.exports = {
                wrapMethod: function (e, t, n) {
                  var i = e[t],
                    o = e;
                  if (t in e) {
                    var a = "warn" === t ? "warning" : t;
                    e[t] = function () {
                      var e = [].slice.call(arguments),
                        s = r.safeJoin(e, " "),
                        c = {
                          level: a,
                          logger: "console",
                          extra: { arguments: e },
                        };
                      "assert" === t
                        ? !1 === e[0] &&
                          ((s =
                            "Assertion failed: " +
                            (r.safeJoin(e.slice(1), " ") || "console.assert")),
                          (c.extra.arguments = e.slice(1)),
                          n && n(s, c))
                        : n && n(s, c),
                        i && Function.prototype.apply.call(i, o, e);
                    };
                  }
                },
              };
            },
            { 5: 5 },
          ],
          3: [
            function (e, t, n) {
              (function (n) {
                function r() {
                  return +new Date();
                }
                function i(e, t) {
                  return v(t)
                    ? function (n) {
                        return t(n, e);
                      }
                    : t;
                }
                function o() {
                  for (var e in ((this.a = !(
                    "object" != typeof JSON || !JSON.stringify
                  )),
                  (this.b = !y(H)),
                  (this.c = !y(J)),
                  (this.d = null),
                  (this.e = null),
                  (this.f = null),
                  (this.g = null),
                  (this.h = null),
                  (this.i = null),
                  (this.j = {}),
                  (this.k = {
                    release: D.SENTRY_RELEASE && D.SENTRY_RELEASE.id,
                    logger: "javascript",
                    ignoreErrors: [],
                    ignoreUrls: [],
                    whitelistUrls: [],
                    includePaths: [],
                    headers: null,
                    collectWindowErrors: !0,
                    captureUnhandledRejections: !0,
                    maxMessageLength: 0,
                    maxUrlLength: 250,
                    stackTraceLimit: 50,
                    autoBreadcrumbs: !0,
                    instrument: !0,
                    sampleRate: 1,
                    sanitizeKeys: [],
                  }),
                  (this.l = {
                    method: "POST",
                    referrerPolicy: P() ? "origin" : "",
                  }),
                  (this.m = 0),
                  (this.n = !1),
                  (this.o = Error.stackTraceLimit),
                  (this.p = D.console || {}),
                  (this.q = {}),
                  (this.r = []),
                  (this.s = r()),
                  (this.t = []),
                  (this.u = []),
                  (this.v = null),
                  (this.w = D.location),
                  (this.x = this.w && this.w.href),
                  this.y(),
                  this.p))
                    this.q[e] = this.p[e];
                }
                var a = e(6),
                  s = e(7),
                  c = e(8),
                  l = e(1),
                  h = e(5),
                  u = h.isErrorEvent,
                  d = h.isDOMError,
                  p = h.isDOMException,
                  f = h.isError,
                  m = h.isObject,
                  g = h.isPlainObject,
                  y = h.isUndefined,
                  v = h.isFunction,
                  w = h.isString,
                  b = h.isArray,
                  _ = h.isEmptyObject,
                  k = h.each,
                  V = h.objectMerge,
                  E = h.truncate,
                  x = h.objectFrozen,
                  S = h.hasKey,
                  R = h.joinRegExp,
                  T = h.urlencode,
                  U = h.uuid4,
                  C = h.htmlTreeAsString,
                  M = h.isSameException,
                  O = h.isSameStacktrace,
                  I = h.parseUrl,
                  N = h.fill,
                  W = h.supportsFetch,
                  P = h.supportsReferrerPolicy,
                  A = h.serializeKeysForMessage,
                  G = h.serializeException,
                  F = h.sanitize,
                  j = e(2).wrapMethod,
                  B = "source protocol user pass host port path".split(" "),
                  Z =
                    /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/,
                  D =
                    "undefined" != typeof window
                      ? window
                      : void 0 !== n
                      ? n
                      : "undefined" != typeof self
                      ? self
                      : {},
                  H = D.document,
                  J = D.navigator;
                (o.prototype = {
                  VERSION: "3.27.2",
                  debug: !1,
                  TraceKit: a,
                  config: function (e, t) {
                    var n = this;
                    if (n.g)
                      return (
                        this.z(
                          "error",
                          "Error: Raven has already been configured"
                        ),
                        n
                      );
                    if (!e) return n;
                    var r = n.k;
                    t &&
                      k(t, function (e, t) {
                        "tags" === e || "extra" === e || "user" === e
                          ? (n.j[e] = t)
                          : (r[e] = t);
                      }),
                      n.setDSN(e),
                      r.ignoreErrors.push(/^Script error\.?$/),
                      r.ignoreErrors.push(
                        /^Javascript error: Script error\.? on line 0$/
                      ),
                      (r.ignoreErrors = R(r.ignoreErrors)),
                      (r.ignoreUrls = !!r.ignoreUrls.length && R(r.ignoreUrls)),
                      (r.whitelistUrls =
                        !!r.whitelistUrls.length && R(r.whitelistUrls)),
                      (r.includePaths = R(r.includePaths)),
                      (r.maxBreadcrumbs = Math.max(
                        0,
                        Math.min(r.maxBreadcrumbs || 100, 100)
                      ));
                    var i = {
                        xhr: !0,
                        console: !0,
                        dom: !0,
                        location: !0,
                        sentry: !0,
                      },
                      o = r.autoBreadcrumbs;
                    "[object Object]" === {}.toString.call(o)
                      ? (o = V(i, o))
                      : !1 !== o && (o = i),
                      (r.autoBreadcrumbs = o);
                    var s = { tryCatch: !0 },
                      c = r.instrument;
                    return (
                      "[object Object]" === {}.toString.call(c)
                        ? (c = V(s, c))
                        : !1 !== c && (c = s),
                      (r.instrument = c),
                      (a.collectWindowErrors = !!r.collectWindowErrors),
                      n
                    );
                  },
                  install: function () {
                    var e = this;
                    return (
                      e.isSetup() &&
                        !e.n &&
                        (a.report.subscribe(function () {
                          e.A.apply(e, arguments);
                        }),
                        e.k.captureUnhandledRejections && e.B(),
                        e.C(),
                        e.k.instrument && e.k.instrument.tryCatch && e.D(),
                        e.k.autoBreadcrumbs && e.E(),
                        e.F(),
                        (e.n = !0)),
                      (Error.stackTraceLimit = e.k.stackTraceLimit),
                      this
                    );
                  },
                  setDSN: function (e) {
                    var t = this,
                      n = t.G(e),
                      r = n.path.lastIndexOf("/"),
                      i = n.path.substr(1, r);
                    (t.H = e),
                      (t.h = n.user),
                      (t.I = n.pass && n.pass.substr(1)),
                      (t.i = n.path.substr(r + 1)),
                      (t.g = t.J(n)),
                      (t.K = t.g + "/" + i + "api/" + t.i + "/store/"),
                      this.y();
                  },
                  context: function (e, t, n) {
                    return (
                      v(e) && ((n = t || []), (t = e), (e = {})),
                      this.wrap(e, t).apply(this, n)
                    );
                  },
                  wrap: function (e, t, n) {
                    function r() {
                      var r = [],
                        o = arguments.length,
                        a = !e || (e && !1 !== e.deep);
                      for (n && v(n) && n.apply(this, arguments); o--; )
                        r[o] = a ? i.wrap(e, arguments[o]) : arguments[o];
                      try {
                        return t.apply(this, r);
                      } catch (s) {
                        throw (i.L(), i.captureException(s, e), s);
                      }
                    }
                    var i = this;
                    if (y(t) && !v(e)) return e;
                    if ((v(e) && ((t = e), (e = void 0)), !v(t))) return t;
                    try {
                      if (t.M) return t;
                      if (t.N) return t.N;
                    } catch (o) {
                      return t;
                    }
                    for (var a in t) S(t, a) && (r[a] = t[a]);
                    return (
                      (r.prototype = t.prototype),
                      (t.N = r),
                      (r.M = !0),
                      (r.O = t),
                      r
                    );
                  },
                  uninstall: function () {
                    return (
                      a.report.uninstall(),
                      this.P(),
                      this.Q(),
                      this.R(),
                      this.S(),
                      (Error.stackTraceLimit = this.o),
                      (this.n = !1),
                      this
                    );
                  },
                  T: function (e) {
                    this.z(
                      "debug",
                      "Raven caught unhandled promise rejection:",
                      e
                    ),
                      this.captureException(e.reason, {
                        mechanism: {
                          type: "onunhandledrejection",
                          handled: !1,
                        },
                      });
                  },
                  B: function () {
                    return (
                      (this.T = this.T.bind(this)),
                      D.addEventListener &&
                        D.addEventListener("unhandledrejection", this.T),
                      this
                    );
                  },
                  P: function () {
                    return (
                      D.removeEventListener &&
                        D.removeEventListener("unhandledrejection", this.T),
                      this
                    );
                  },
                  captureException: function (e, t) {
                    if (
                      ((t = V({ trimHeadFrames: 0 }, t || {})), u(e) && e.error)
                    )
                      e = e.error;
                    else {
                      if (d(e) || p(e)) {
                        var n = e.name || (d(e) ? "DOMError" : "DOMException"),
                          r = e.message ? n + ": " + e.message : n;
                        return this.captureMessage(
                          r,
                          V(t, {
                            stacktrace: !0,
                            trimHeadFrames: t.trimHeadFrames + 1,
                          })
                        );
                      }
                      if (f(e)) e = e;
                      else {
                        if (!g(e))
                          return this.captureMessage(
                            e,
                            V(t, {
                              stacktrace: !0,
                              trimHeadFrames: t.trimHeadFrames + 1,
                            })
                          );
                        (t = this.U(t, e)), (e = new Error(t.message));
                      }
                    }
                    this.d = e;
                    try {
                      var i = a.computeStackTrace(e);
                      this.V(i, t);
                    } catch (o) {
                      if (e !== o) throw o;
                    }
                    return this;
                  },
                  U: function (e, t) {
                    var n = Object.keys(t).sort(),
                      r = V(e, {
                        message:
                          "Non-Error exception captured with keys: " + A(n),
                        fingerprint: [c(n)],
                        extra: e.extra || {},
                      });
                    return (r.extra.W = G(t)), r;
                  },
                  captureMessage: function (e, t) {
                    if (
                      !this.k.ignoreErrors.test ||
                      !this.k.ignoreErrors.test(e)
                    ) {
                      var n,
                        r = V({ message: (e += "") }, (t = t || {}));
                      try {
                        throw new Error(e);
                      } catch (i) {
                        n = i;
                      }
                      n.name = null;
                      var o = a.computeStackTrace(n),
                        s = b(o.stack) && o.stack[1];
                      s &&
                        "Raven.captureException" === s.func &&
                        (s = o.stack[2]);
                      var c = (s && s.url) || "";
                      if (
                        (!this.k.ignoreUrls.test ||
                          !this.k.ignoreUrls.test(c)) &&
                        (!this.k.whitelistUrls.test ||
                          this.k.whitelistUrls.test(c))
                      ) {
                        if (
                          this.k.stacktrace ||
                          t.stacktrace ||
                          "" === r.message
                        ) {
                          (r.fingerprint =
                            null == r.fingerprint ? e : r.fingerprint),
                            ((t = V(
                              { trimHeadFrames: 0 },
                              t
                            )).trimHeadFrames += 1);
                          var l = this.X(o, t);
                          r.stacktrace = { frames: l.reverse() };
                        }
                        return (
                          r.fingerprint &&
                            (r.fingerprint = b(r.fingerprint)
                              ? r.fingerprint
                              : [r.fingerprint]),
                          this.Y(r),
                          this
                        );
                      }
                    }
                  },
                  captureBreadcrumb: function (e) {
                    var t = V({ timestamp: r() / 1e3 }, e);
                    if (v(this.k.breadcrumbCallback)) {
                      var n = this.k.breadcrumbCallback(t);
                      if (m(n) && !_(n)) t = n;
                      else if (!1 === n) return this;
                    }
                    return (
                      this.u.push(t),
                      this.u.length > this.k.maxBreadcrumbs && this.u.shift(),
                      this
                    );
                  },
                  addPlugin: function (e) {
                    var t = [].slice.call(arguments, 1);
                    return this.r.push([e, t]), this.n && this.F(), this;
                  },
                  setUserContext: function (e) {
                    return (this.j.user = e), this;
                  },
                  setExtraContext: function (e) {
                    return this.Z("extra", e), this;
                  },
                  setTagsContext: function (e) {
                    return this.Z("tags", e), this;
                  },
                  clearContext: function () {
                    return (this.j = {}), this;
                  },
                  getContext: function () {
                    return JSON.parse(s(this.j));
                  },
                  setEnvironment: function (e) {
                    return (this.k.environment = e), this;
                  },
                  setRelease: function (e) {
                    return (this.k.release = e), this;
                  },
                  setDataCallback: function (e) {
                    var t = this.k.dataCallback;
                    return (this.k.dataCallback = i(t, e)), this;
                  },
                  setBreadcrumbCallback: function (e) {
                    var t = this.k.breadcrumbCallback;
                    return (this.k.breadcrumbCallback = i(t, e)), this;
                  },
                  setShouldSendCallback: function (e) {
                    var t = this.k.shouldSendCallback;
                    return (this.k.shouldSendCallback = i(t, e)), this;
                  },
                  setTransport: function (e) {
                    return (this.k.transport = e), this;
                  },
                  lastException: function () {
                    return this.d;
                  },
                  lastEventId: function () {
                    return this.f;
                  },
                  isSetup: function () {
                    return !(
                      !this.a ||
                      (!this.g &&
                        (this.ravenNotConfiguredError ||
                          ((this.ravenNotConfiguredError = !0),
                          this.z(
                            "error",
                            "Error: Raven has not been configured."
                          )),
                        1))
                    );
                  },
                  afterLoad: function () {
                    var e = D.RavenConfig;
                    e && this.config(e.dsn, e.config).install();
                  },
                  showReportDialog: function (e) {
                    if (H) {
                      if (
                        !(e = V(
                          {
                            eventId: this.lastEventId(),
                            dsn: this.H,
                            user: this.j.user || {},
                          },
                          e
                        )).eventId
                      )
                        throw new l("Missing eventId");
                      if (!e.dsn) throw new l("Missing DSN");
                      var t = encodeURIComponent,
                        n = [];
                      for (var r in e)
                        if ("user" === r) {
                          var i = e.user;
                          i.name && n.push("name=" + t(i.name)),
                            i.email && n.push("email=" + t(i.email));
                        } else n.push(t(r) + "=" + t(e[r]));
                      var o = this.J(this.G(e.dsn)),
                        a = H.createElement("script");
                      (a.async = !0),
                        (a.src = o + "/api/embed/error-page/?" + n.join("&")),
                        (H.head || H.body).appendChild(a);
                    }
                  },
                  L: function () {
                    var e = this;
                    (this.m += 1),
                      setTimeout(function () {
                        e.m -= 1;
                      });
                  },
                  $: function (e, t) {
                    var n, r;
                    if (this.b) {
                      for (r in ((t = t || {}),
                      (e =
                        "raven" + e.substr(0, 1).toUpperCase() + e.substr(1)),
                      H.createEvent
                        ? (n = H.createEvent("HTMLEvents")).initEvent(e, !0, !0)
                        : ((n = H.createEventObject()).eventType = e),
                      t))
                        S(t, r) && (n[r] = t[r]);
                      if (H.createEvent) H.dispatchEvent(n);
                      else
                        try {
                          H.fireEvent("on" + n.eventType.toLowerCase(), n);
                        } catch (i) {}
                    }
                  },
                  _: function (e) {
                    var t = this;
                    return function (n) {
                      if (((t.aa = null), t.v !== n)) {
                        var r;
                        t.v = n;
                        try {
                          r = C(n.target);
                        } catch (i) {
                          r = "<unknown>";
                        }
                        t.captureBreadcrumb({
                          category: "ui." + e,
                          message: r,
                        });
                      }
                    };
                  },
                  ba: function () {
                    var e = this;
                    return function (t) {
                      var n;
                      try {
                        n = t.target;
                      } catch (i) {
                        return;
                      }
                      var r = n && n.tagName;
                      if (
                        r &&
                        ("INPUT" === r ||
                          "TEXTAREA" === r ||
                          n.isContentEditable)
                      ) {
                        var o = e.aa;
                        o || e._("input")(t),
                          clearTimeout(o),
                          (e.aa = setTimeout(function () {
                            e.aa = null;
                          }, 1e3));
                      }
                    };
                  },
                  ca: function (e, t) {
                    var n = I(this.w.href),
                      r = I(t),
                      i = I(e);
                    (this.x = t),
                      n.protocol === r.protocol &&
                        n.host === r.host &&
                        (t = r.relative),
                      n.protocol === i.protocol &&
                        n.host === i.host &&
                        (e = i.relative),
                      this.captureBreadcrumb({
                        category: "navigation",
                        data: { to: t, from: e },
                      });
                  },
                  C: function () {
                    var e = this;
                    (e.da = Function.prototype.toString),
                      (Function.prototype.toString = function () {
                        return "function" == typeof this && this.M
                          ? e.da.apply(this.O, arguments)
                          : e.da.apply(this, arguments);
                      });
                  },
                  Q: function () {
                    this.da && (Function.prototype.toString = this.da);
                  },
                  D: function () {
                    function e(e) {
                      return function (t, r) {
                        for (
                          var i = new Array(arguments.length), o = 0;
                          o < i.length;
                          ++o
                        )
                          i[o] = arguments[o];
                        var a = i[0];
                        return (
                          v(a) &&
                            (i[0] = n.wrap(
                              {
                                mechanism: {
                                  type: "instrument",
                                  data: { function: e.name || "<anonymous>" },
                                },
                              },
                              a
                            )),
                          e.apply ? e.apply(this, i) : e(i[0], i[1])
                        );
                      };
                    }
                    function t(e) {
                      var t = D[e] && D[e].prototype;
                      t &&
                        t.hasOwnProperty &&
                        t.hasOwnProperty("addEventListener") &&
                        (N(
                          t,
                          "addEventListener",
                          function (t) {
                            return function (r, o, a, s) {
                              try {
                                o &&
                                  o.handleEvent &&
                                  (o.handleEvent = n.wrap(
                                    {
                                      mechanism: {
                                        type: "instrument",
                                        data: {
                                          target: e,
                                          function: "handleEvent",
                                          handler:
                                            (o && o.name) || "<anonymous>",
                                        },
                                      },
                                    },
                                    o.handleEvent
                                  ));
                              } catch (c) {}
                              var l, h, u;
                              return (
                                i &&
                                  i.dom &&
                                  ("EventTarget" === e || "Node" === e) &&
                                  ((h = n._("click")),
                                  (u = n.ba()),
                                  (l = function (e) {
                                    if (e) {
                                      var t;
                                      try {
                                        t = e.type;
                                      } catch (n) {
                                        return;
                                      }
                                      return "click" === t
                                        ? h(e)
                                        : "keypress" === t
                                        ? u(e)
                                        : void 0;
                                    }
                                  })),
                                t.call(
                                  this,
                                  r,
                                  n.wrap(
                                    {
                                      mechanism: {
                                        type: "instrument",
                                        data: {
                                          target: e,
                                          function: "addEventListener",
                                          handler:
                                            (o && o.name) || "<anonymous>",
                                        },
                                      },
                                    },
                                    o,
                                    l
                                  ),
                                  a,
                                  s
                                )
                              );
                            };
                          },
                          r
                        ),
                        N(
                          t,
                          "removeEventListener",
                          function (e) {
                            return function (t, n, r, i) {
                              try {
                                n = n && (n.N ? n.N : n);
                              } catch (o) {}
                              return e.call(this, t, n, r, i);
                            };
                          },
                          r
                        ));
                    }
                    var n = this,
                      r = n.t,
                      i = this.k.autoBreadcrumbs;
                    N(D, "setTimeout", e, r),
                      N(D, "setInterval", e, r),
                      D.requestAnimationFrame &&
                        N(
                          D,
                          "requestAnimationFrame",
                          function (e) {
                            return function (t) {
                              return e(
                                n.wrap(
                                  {
                                    mechanism: {
                                      type: "instrument",
                                      data: {
                                        function: "requestAnimationFrame",
                                        handler: (e && e.name) || "<anonymous>",
                                      },
                                    },
                                  },
                                  t
                                )
                              );
                            };
                          },
                          r
                        );
                    for (
                      var o = [
                          "EventTarget",
                          "Window",
                          "Node",
                          "ApplicationCache",
                          "AudioTrackList",
                          "ChannelMergerNode",
                          "CryptoOperation",
                          "EventSource",
                          "FileReader",
                          "HTMLUnknownElement",
                          "IDBDatabase",
                          "IDBRequest",
                          "IDBTransaction",
                          "KeyOperation",
                          "MediaController",
                          "MessagePort",
                          "ModalWindow",
                          "Notification",
                          "SVGElementInstance",
                          "Screen",
                          "TextTrack",
                          "TextTrackCue",
                          "TextTrackList",
                          "WebSocket",
                          "WebSocketWorker",
                          "Worker",
                          "XMLHttpRequest",
                          "XMLHttpRequestEventTarget",
                          "XMLHttpRequestUpload",
                        ],
                        a = 0;
                      a < o.length;
                      a++
                    )
                      t(o[a]);
                  },
                  E: function () {
                    function e(e, n) {
                      e in n &&
                        v(n[e]) &&
                        N(n, e, function (n) {
                          return t.wrap(
                            {
                              mechanism: {
                                type: "instrument",
                                data: {
                                  function: e,
                                  handler: (n && n.name) || "<anonymous>",
                                },
                              },
                            },
                            n
                          );
                        });
                    }
                    var t = this,
                      n = this.k.autoBreadcrumbs,
                      r = t.t;
                    if (n.xhr && "XMLHttpRequest" in D) {
                      var i = D.XMLHttpRequest && D.XMLHttpRequest.prototype;
                      N(
                        i,
                        "open",
                        function (e) {
                          return function (n, r) {
                            return (
                              w(r) &&
                                -1 === r.indexOf(t.h) &&
                                (this.ea = {
                                  method: n,
                                  url: r,
                                  status_code: null,
                                }),
                              e.apply(this, arguments)
                            );
                          };
                        },
                        r
                      ),
                        N(
                          i,
                          "send",
                          function (n) {
                            return function () {
                              function r() {
                                if (i.ea && 4 === i.readyState) {
                                  try {
                                    i.ea.status_code = i.status;
                                  } catch (e) {}
                                  t.captureBreadcrumb({
                                    type: "http",
                                    category: "xhr",
                                    data: i.ea,
                                  });
                                }
                              }
                              for (
                                var i = this,
                                  o = ["onload", "onerror", "onprogress"],
                                  a = 0;
                                a < o.length;
                                a++
                              )
                                e(o[a], i);
                              return (
                                "onreadystatechange" in i &&
                                v(i.onreadystatechange)
                                  ? N(i, "onreadystatechange", function (e) {
                                      return t.wrap(
                                        {
                                          mechanism: {
                                            type: "instrument",
                                            data: {
                                              function: "onreadystatechange",
                                              handler:
                                                (e && e.name) || "<anonymous>",
                                            },
                                          },
                                        },
                                        e,
                                        r
                                      );
                                    })
                                  : (i.onreadystatechange = r),
                                n.apply(this, arguments)
                              );
                            };
                          },
                          r
                        );
                    }
                    n.xhr &&
                      W() &&
                      N(
                        D,
                        "fetch",
                        function (e) {
                          return function () {
                            for (
                              var n = new Array(arguments.length), r = 0;
                              r < n.length;
                              ++r
                            )
                              n[r] = arguments[r];
                            var i,
                              o = n[0],
                              a = "GET";
                            if (
                              ("string" == typeof o
                                ? (i = o)
                                : "Request" in D && o instanceof D.Request
                                ? ((i = o.url), o.method && (a = o.method))
                                : (i = "" + o),
                              -1 !== i.indexOf(t.h))
                            )
                              return e.apply(this, n);
                            n[1] && n[1].method && (a = n[1].method);
                            var s = { method: a, url: i, status_code: null };
                            return e
                              .apply(this, n)
                              .then(function (e) {
                                return (
                                  (s.status_code = e.status),
                                  t.captureBreadcrumb({
                                    type: "http",
                                    category: "fetch",
                                    data: s,
                                  }),
                                  e
                                );
                              })
                              ["catch"](function (e) {
                                throw (
                                  (t.captureBreadcrumb({
                                    type: "http",
                                    category: "fetch",
                                    data: s,
                                    level: "error",
                                  }),
                                  e)
                                );
                              });
                          };
                        },
                        r
                      ),
                      n.dom &&
                        this.b &&
                        (H.addEventListener
                          ? (H.addEventListener("click", t._("click"), !1),
                            H.addEventListener("keypress", t.ba(), !1))
                          : H.attachEvent &&
                            (H.attachEvent("onclick", t._("click")),
                            H.attachEvent("onkeypress", t.ba())));
                    var o = D.chrome,
                      a =
                        !(o && o.app && o.app.runtime) &&
                        D.history &&
                        D.history.pushState &&
                        D.history.replaceState;
                    if (n.location && a) {
                      var s = D.onpopstate;
                      D.onpopstate = function () {
                        var e = t.w.href;
                        if ((t.ca(t.x, e), s)) return s.apply(this, arguments);
                      };
                      var c = function (e) {
                        return function () {
                          var n = arguments.length > 2 ? arguments[2] : void 0;
                          return (
                            n && t.ca(t.x, n + ""), e.apply(this, arguments)
                          );
                        };
                      };
                      N(D.history, "pushState", c, r),
                        N(D.history, "replaceState", c, r);
                    }
                    if (n.console && "console" in D && console.log) {
                      var l = function (e, n) {
                        t.captureBreadcrumb({
                          message: e,
                          level: n.level,
                          category: "console",
                        });
                      };
                      k(
                        ["debug", "info", "warn", "error", "log"],
                        function (e, t) {
                          j(console, t, l);
                        }
                      );
                    }
                  },
                  R: function () {
                    for (var e; this.t.length; ) {
                      var t = (e = this.t.shift())[0],
                        n = e[1],
                        r = e[2];
                      t[n] = r;
                    }
                  },
                  S: function () {
                    for (var e in this.q) this.p[e] = this.q[e];
                  },
                  F: function () {
                    var e = this;
                    k(this.r, function (t, n) {
                      var r = n[0],
                        i = n[1];
                      r.apply(e, [e].concat(i));
                    });
                  },
                  G: function (e) {
                    var t = Z.exec(e),
                      n = {},
                      r = 7;
                    try {
                      for (; r--; ) n[B[r]] = t[r] || "";
                    } catch (i) {
                      throw new l("Invalid DSN: " + e);
                    }
                    if (n.pass && !this.k.allowSecretKey)
                      throw new l(
                        "Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key"
                      );
                    return n;
                  },
                  J: function (e) {
                    var t = "//" + e.host + (e.port ? ":" + e.port : "");
                    return e.protocol && (t = e.protocol + ":" + t), t;
                  },
                  A: function (e, t) {
                    ((t = t || {}).mechanism = t.mechanism || {
                      type: "onerror",
                      handled: !1,
                    }),
                      this.m || this.V(e, t);
                  },
                  V: function (e, t) {
                    var n = this.X(e, t);
                    this.$("handle", { stackInfo: e, options: t }),
                      this.fa(e.name, e.message, e.url, e.lineno, n, t);
                  },
                  X: function (e, t) {
                    var n = this,
                      r = [];
                    if (
                      e.stack &&
                      e.stack.length &&
                      (k(e.stack, function (t, i) {
                        var o = n.ga(i, e.url);
                        o && r.push(o);
                      }),
                      t && t.trimHeadFrames)
                    )
                      for (var i = 0; i < t.trimHeadFrames && i < r.length; i++)
                        r[i].in_app = !1;
                    return (r = r.slice(0, this.k.stackTraceLimit));
                  },
                  ga: function (e, t) {
                    var n = {
                      filename: e.url,
                      lineno: e.line,
                      colno: e.column,
                      function: e.func || "?",
                    };
                    return (
                      e.url || (n.filename = t),
                      (n.in_app = !(
                        (this.k.includePaths.test &&
                          !this.k.includePaths.test(n.filename)) ||
                        /(Raven|TraceKit)\./.test(n["function"]) ||
                        /raven\.(min\.)?js$/.test(n.filename)
                      )),
                      n
                    );
                  },
                  fa: function (e, t, n, r, i, o) {
                    var a,
                      s = (e ? e + ": " : "") + (t || "");
                    if (
                      (!this.k.ignoreErrors.test ||
                        (!this.k.ignoreErrors.test(t) &&
                          !this.k.ignoreErrors.test(s))) &&
                      (i && i.length
                        ? ((n = i[0].filename || n),
                          i.reverse(),
                          (a = { frames: i }))
                        : n &&
                          (a = {
                            frames: [{ filename: n, lineno: r, in_app: !0 }],
                          }),
                      (!this.k.ignoreUrls.test || !this.k.ignoreUrls.test(n)) &&
                        (!this.k.whitelistUrls.test ||
                          this.k.whitelistUrls.test(n)))
                    ) {
                      var c = V(
                          {
                            exception: {
                              values: [{ type: e, value: t, stacktrace: a }],
                            },
                            transaction: n,
                          },
                          o
                        ),
                        l = c.exception.values[0];
                      null == l.type &&
                        "" === l.value &&
                        (l.value = "Unrecoverable error caught"),
                        !c.exception.mechanism &&
                          c.mechanism &&
                          ((c.exception.mechanism = c.mechanism),
                          delete c.mechanism),
                        (c.exception.mechanism = V(
                          { type: "generic", handled: !0 },
                          c.exception.mechanism || {}
                        )),
                        this.Y(c);
                    }
                  },
                  ha: function (e) {
                    var t = this.k.maxMessageLength;
                    if (
                      (e.message && (e.message = E(e.message, t)), e.exception)
                    ) {
                      var n = e.exception.values[0];
                      n.value = E(n.value, t);
                    }
                    var r = e.request;
                    return (
                      r &&
                        (r.url && (r.url = E(r.url, this.k.maxUrlLength)),
                        r.Referer &&
                          (r.Referer = E(r.Referer, this.k.maxUrlLength))),
                      e.breadcrumbs &&
                        e.breadcrumbs.values &&
                        this.ia(e.breadcrumbs),
                      e
                    );
                  },
                  ia: function (e) {
                    for (
                      var t, n, r, i = ["to", "from", "url"], o = 0;
                      o < e.values.length;
                      ++o
                    )
                      if (
                        (n = e.values[o]).hasOwnProperty("data") &&
                        m(n.data) &&
                        !x(n.data)
                      ) {
                        r = V({}, n.data);
                        for (var a = 0; a < i.length; ++a)
                          (t = i[a]),
                            r.hasOwnProperty(t) &&
                              r[t] &&
                              (r[t] = E(r[t], this.k.maxUrlLength));
                        e.values[o].data = r;
                      }
                  },
                  ja: function () {
                    if (this.c || this.b) {
                      var e = {};
                      return (
                        this.c &&
                          J.userAgent &&
                          (e.headers = { "User-Agent": J.userAgent }),
                        D.location &&
                          D.location.href &&
                          (e.url = D.location.href),
                        this.b &&
                          H.referrer &&
                          (e.headers || (e.headers = {}),
                          (e.headers.Referer = H.referrer)),
                        e
                      );
                    }
                  },
                  y: function () {
                    (this.ka = 0), (this.la = null);
                  },
                  ma: function () {
                    return this.ka && r() - this.la < this.ka;
                  },
                  na: function (e) {
                    var t = this.e;
                    return (
                      !(
                        !t ||
                        e.message !== t.message ||
                        e.transaction !== t.transaction
                      ) &&
                      (e.stacktrace || t.stacktrace
                        ? O(e.stacktrace, t.stacktrace)
                        : e.exception || t.exception
                        ? M(e.exception, t.exception)
                        : (!e.fingerprint && !t.fingerprint) ||
                          (Boolean(e.fingerprint && t.fingerprint) &&
                            JSON.stringify(e.fingerprint) ===
                              JSON.stringify(t.fingerprint)))
                    );
                  },
                  oa: function (e) {
                    if (!this.ma()) {
                      var t = e.status;
                      if (400 === t || 401 === t || 429 === t) {
                        var n;
                        try {
                          (n = W()
                            ? e.headers.get("Retry-After")
                            : e.getResponseHeader("Retry-After")),
                            (n = 1e3 * parseInt(n, 10));
                        } catch (i) {}
                        (this.ka = n || 2 * this.ka || 1e3), (this.la = r());
                      }
                    }
                  },
                  Y: function (e) {
                    var t = this.k,
                      n = {
                        project: this.i,
                        logger: t.logger,
                        platform: "javascript",
                      },
                      i = this.ja();
                    if (
                      (i && (n.request = i),
                      e.trimHeadFrames && delete e.trimHeadFrames,
                      ((e = V(n, e)).tags = V(V({}, this.j.tags), e.tags)),
                      (e.extra = V(V({}, this.j.extra), e.extra)),
                      (e.extra["session:duration"] = r() - this.s),
                      this.u &&
                        this.u.length > 0 &&
                        (e.breadcrumbs = { values: [].slice.call(this.u, 0) }),
                      this.j.user && (e.user = this.j.user),
                      t.environment && (e.environment = t.environment),
                      t.release && (e.release = t.release),
                      t.serverName && (e.server_name = t.serverName),
                      (e = this.pa(e)),
                      Object.keys(e).forEach(function (t) {
                        (null == e[t] || "" === e[t] || _(e[t])) && delete e[t];
                      }),
                      v(t.dataCallback) && (e = t.dataCallback(e) || e),
                      e &&
                        !_(e) &&
                        (!v(t.shouldSendCallback) || t.shouldSendCallback(e)))
                    )
                      return this.ma()
                        ? void this.z(
                            "warn",
                            "Raven dropped error due to backoff: ",
                            e
                          )
                        : void ("number" == typeof t.sampleRate
                            ? Math.random() < t.sampleRate && this.qa(e)
                            : this.qa(e));
                  },
                  pa: function (e) {
                    return F(e, this.k.sanitizeKeys);
                  },
                  ra: function () {
                    return U();
                  },
                  qa: function (e, t) {
                    var n = this,
                      r = this.k;
                    if (this.isSetup()) {
                      if (
                        ((e = this.ha(e)),
                        !this.k.allowDuplicates && this.na(e))
                      )
                        return void this.z(
                          "warn",
                          "Raven dropped repeat event: ",
                          e
                        );
                      (this.f = e.event_id || (e.event_id = this.ra())),
                        (this.e = e),
                        this.z("debug", "Raven about to send:", e);
                      var i = {
                        sentry_version: "7",
                        sentry_client: "raven-js/" + this.VERSION,
                        sentry_key: this.h,
                      };
                      this.I && (i.sentry_secret = this.I);
                      var o = e.exception && e.exception.values[0];
                      this.k.autoBreadcrumbs &&
                        this.k.autoBreadcrumbs.sentry &&
                        this.captureBreadcrumb({
                          category: "sentry",
                          message: o
                            ? (o.type ? o.type + ": " : "") + o.value
                            : e.message,
                          event_id: e.event_id,
                          level: e.level || "error",
                        });
                      var a = this.K;
                      (r.transport || this._makeRequest).call(this, {
                        url: a,
                        auth: i,
                        data: e,
                        options: r,
                        onSuccess: function () {
                          n.y(), n.$("success", { data: e, src: a }), t && t();
                        },
                        onError: function (r) {
                          n.z("error", "Raven transport failed to send: ", r),
                            r.request && n.oa(r.request),
                            n.$("failure", { data: e, src: a }),
                            (r =
                              r ||
                              new Error(
                                "Raven send failed (no additional details provided)"
                              )),
                            t && t(r);
                        },
                      });
                    }
                  },
                  _makeRequest: function (e) {
                    var t = e.url + "?" + T(e.auth),
                      n = null,
                      r = {};
                    if (
                      (e.options.headers && (n = this.sa(e.options.headers)),
                      e.options.fetchParameters &&
                        (r = this.sa(e.options.fetchParameters)),
                      W())
                    ) {
                      r.body = s(e.data);
                      var i = V({}, this.l),
                        o = V(i, r);
                      return (
                        n && (o.headers = n),
                        D.fetch(t, o)
                          .then(function (t) {
                            if (t.ok) e.onSuccess && e.onSuccess();
                            else {
                              var n = new Error(
                                "Sentry error code: " + t.status
                              );
                              (n.request = t), e.onError && e.onError(n);
                            }
                          })
                          ["catch"](function () {
                            e.onError &&
                              e.onError(
                                new Error(
                                  "Sentry error code: network unavailable"
                                )
                              );
                          })
                      );
                    }
                    var a = D.XMLHttpRequest && new D.XMLHttpRequest();
                    a &&
                      ("withCredentials" in a ||
                        "undefined" != typeof XDomainRequest) &&
                      ("withCredentials" in a
                        ? (a.onreadystatechange = function () {
                            if (4 === a.readyState)
                              if (200 === a.status)
                                e.onSuccess && e.onSuccess();
                              else if (e.onError) {
                                var t = new Error(
                                  "Sentry error code: " + a.status
                                );
                                (t.request = a), e.onError(t);
                              }
                          })
                        : ((a = new XDomainRequest()),
                          (t = t.replace(/^https?:/, "")),
                          e.onSuccess && (a.onload = e.onSuccess),
                          e.onError &&
                            (a.onerror = function () {
                              var t = new Error(
                                "Sentry error code: XDomainRequest"
                              );
                              (t.request = a), e.onError(t);
                            })),
                      a.open("POST", t),
                      n &&
                        k(n, function (e, t) {
                          a.setRequestHeader(e, t);
                        }),
                      a.send(s(e.data)));
                  },
                  sa: function (e) {
                    var t = {};
                    for (var n in e)
                      if (e.hasOwnProperty(n)) {
                        var r = e[n];
                        t[n] = "function" == typeof r ? r() : r;
                      }
                    return t;
                  },
                  z: function (e) {
                    this.q[e] &&
                      (this.debug || this.k.debug) &&
                      Function.prototype.apply.call(
                        this.q[e],
                        this.p,
                        [].slice.call(arguments, 1)
                      );
                  },
                  Z: function (e, t) {
                    y(t)
                      ? delete this.j[e]
                      : (this.j[e] = V(this.j[e] || {}, t));
                  },
                }),
                  (o.prototype.setUser = o.prototype.setUserContext),
                  (o.prototype.setReleaseContext = o.prototype.setRelease),
                  (t.exports = o);
              }).call(
                this,
                "undefined" != typeof global
                  ? global
                  : "undefined" != typeof self
                  ? self
                  : "undefined" != typeof window
                  ? window
                  : {}
              );
            },
            { 1: 1, 2: 2, 5: 5, 6: 6, 7: 7, 8: 8 },
          ],
          4: [
            function (e, t, n) {
              (function (n) {
                var r = e(3),
                  i =
                    "undefined" != typeof window
                      ? window
                      : void 0 !== n
                      ? n
                      : "undefined" != typeof self
                      ? self
                      : {},
                  o = i.Raven,
                  a = new r();
                (a.noConflict = function () {
                  return (i.Raven = o), a;
                }),
                  a.afterLoad(),
                  (t.exports = a),
                  (t.exports.Client = r);
              }).call(
                this,
                "undefined" != typeof global
                  ? global
                  : "undefined" != typeof self
                  ? self
                  : "undefined" != typeof window
                  ? window
                  : {}
              );
            },
            { 3: 3 },
          ],
          5: [
            function (e, t, n) {
              (function (n) {
                function r(e) {
                  switch (Object.prototype.toString.call(e)) {
                    case "[object Error]":
                    case "[object Exception]":
                    case "[object DOMException]":
                      return !0;
                    default:
                      return e instanceof Error;
                  }
                }
                function i(e) {
                  return (
                    "[object DOMError]" === Object.prototype.toString.call(e)
                  );
                }
                function o(e) {
                  return void 0 === e;
                }
                function a(e) {
                  return (
                    "[object Object]" === Object.prototype.toString.call(e)
                  );
                }
                function s(e) {
                  return (
                    "[object String]" === Object.prototype.toString.call(e)
                  );
                }
                function c(e) {
                  return "[object Array]" === Object.prototype.toString.call(e);
                }
                function l() {
                  if (!("fetch" in _)) return !1;
                  try {
                    return new Headers(), new Request(""), new Response(), !0;
                  } catch (e) {
                    return !1;
                  }
                }
                function h(e, t) {
                  var n, r;
                  if (o(e.length))
                    for (n in e) d(e, n) && t.call(null, n, e[n]);
                  else if ((r = e.length))
                    for (n = 0; n < r; n++) t.call(null, n, e[n]);
                }
                function u(e, t) {
                  if ("number" != typeof t)
                    throw new Error(
                      "2nd argument to `truncate` function should be a number"
                    );
                  return "string" != typeof e || 0 === t || e.length <= t
                    ? e
                    : e.substr(0, t) + "…";
                }
                function d(e, t) {
                  return Object.prototype.hasOwnProperty.call(e, t);
                }
                function p(e) {
                  for (var t, n = [], r = 0, i = e.length; r < i; r++)
                    s((t = e[r]))
                      ? n.push(t.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"))
                      : t && t.source && n.push(t.source);
                  return new RegExp(n.join("|"), "i");
                }
                function f(e) {
                  var t,
                    n,
                    r,
                    i,
                    o,
                    a = [];
                  if (!e || !e.tagName) return "";
                  if (
                    (a.push(e.tagName.toLowerCase()),
                    e.id && a.push("#" + e.id),
                    (t = e.className) && s(t))
                  )
                    for (n = t.split(/\s+/), o = 0; o < n.length; o++)
                      a.push("." + n[o]);
                  var c = ["type", "name", "title", "alt"];
                  for (o = 0; o < c.length; o++)
                    (r = c[o]),
                      (i = e.getAttribute(r)) &&
                        a.push("[" + r + '="' + i + '"]');
                  return a.join("");
                }
                function m(e, t) {
                  return !!(!!e ^ !!t);
                }
                function g(e, t) {
                  if (m(e, t)) return !1;
                  var n = e.frames,
                    r = t.frames;
                  if (void 0 === n || void 0 === r) return !1;
                  if (n.length !== r.length) return !1;
                  for (var i, o, a = 0; a < n.length; a++)
                    if (
                      ((i = n[a]),
                      (o = r[a]),
                      i.filename !== o.filename ||
                        i.lineno !== o.lineno ||
                        i.colno !== o.colno ||
                        i["function"] !== o["function"])
                    )
                      return !1;
                  return !0;
                }
                function y(e) {
                  return (function (e) {
                    return ~-encodeURI(e).split(/%..|./).length;
                  })(JSON.stringify(e));
                }
                function v(e) {
                  if ("string" == typeof e) {
                    return u(e, 40);
                  }
                  if (
                    "number" == typeof e ||
                    "boolean" == typeof e ||
                    void 0 === e
                  )
                    return e;
                  var t = Object.prototype.toString.call(e);
                  return "[object Object]" === t
                    ? "[Object]"
                    : "[object Array]" === t
                    ? "[Array]"
                    : "[object Function]" === t
                    ? e.name
                      ? "[Function: " + e.name + "]"
                      : "[Function]"
                    : e;
                }
                function w(e, t) {
                  return 0 === t
                    ? v(e)
                    : a(e)
                    ? Object.keys(e).reduce(function (n, r) {
                        return (n[r] = w(e[r], t - 1)), n;
                      }, {})
                    : Array.isArray(e)
                    ? e.map(function (e) {
                        return w(e, t - 1);
                      })
                    : v(e);
                }
                var b = e(7),
                  _ =
                    "undefined" != typeof window
                      ? window
                      : void 0 !== n
                      ? n
                      : "undefined" != typeof self
                      ? self
                      : {},
                  k = 3,
                  V = 51200,
                  E = 40;
                t.exports = {
                  isObject: function (e) {
                    return "object" == typeof e && null !== e;
                  },
                  isError: r,
                  isErrorEvent: function (e) {
                    return (
                      "[object ErrorEvent]" ===
                      Object.prototype.toString.call(e)
                    );
                  },
                  isDOMError: i,
                  isDOMException: function (e) {
                    return (
                      "[object DOMException]" ===
                      Object.prototype.toString.call(e)
                    );
                  },
                  isUndefined: o,
                  isFunction: function (e) {
                    return "function" == typeof e;
                  },
                  isPlainObject: a,
                  isString: s,
                  isArray: c,
                  isEmptyObject: function (e) {
                    if (!a(e)) return !1;
                    for (var t in e) if (e.hasOwnProperty(t)) return !1;
                    return !0;
                  },
                  supportsErrorEvent: function () {
                    try {
                      return new ErrorEvent(""), !0;
                    } catch (e) {
                      return !1;
                    }
                  },
                  supportsDOMError: function () {
                    try {
                      return new DOMError(""), !0;
                    } catch (e) {
                      return !1;
                    }
                  },
                  supportsDOMException: function () {
                    try {
                      return new DOMException(""), !0;
                    } catch (e) {
                      return !1;
                    }
                  },
                  supportsFetch: l,
                  supportsReferrerPolicy: function () {
                    if (!l()) return !1;
                    try {
                      return (
                        new Request("pickleRick", { referrerPolicy: "origin" }),
                        !0
                      );
                    } catch (e) {
                      return !1;
                    }
                  },
                  supportsPromiseRejectionEvent: function () {
                    return "function" == typeof PromiseRejectionEvent;
                  },
                  wrappedCallback: function (e) {
                    return function (t, n) {
                      var r = e(t) || t;
                      return (n && n(r)) || r;
                    };
                  },
                  each: h,
                  objectMerge: function (e, t) {
                    return t
                      ? (h(t, function (t, n) {
                          e[t] = n;
                        }),
                        e)
                      : e;
                  },
                  truncate: u,
                  objectFrozen: function (e) {
                    return !!Object.isFrozen && Object.isFrozen(e);
                  },
                  hasKey: d,
                  joinRegExp: p,
                  urlencode: function (e) {
                    var t = [];
                    return (
                      h(e, function (e, n) {
                        t.push(
                          encodeURIComponent(e) + "=" + encodeURIComponent(n)
                        );
                      }),
                      t.join("&")
                    );
                  },
                  uuid4: function () {
                    var e = _.crypto || _.msCrypto;
                    if (!o(e) && e.getRandomValues) {
                      var t = new Uint16Array(8);
                      e.getRandomValues(t),
                        (t[3] = (4095 & t[3]) | 16384),
                        (t[4] = (16383 & t[4]) | 32768);
                      var n = function (e) {
                        for (var t = e.toString(16); t.length < 4; )
                          t = "0" + t;
                        return t;
                      };
                      return (
                        n(t[0]) +
                        n(t[1]) +
                        n(t[2]) +
                        n(t[3]) +
                        n(t[4]) +
                        n(t[5]) +
                        n(t[6]) +
                        n(t[7])
                      );
                    }
                    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(
                      /[xy]/g,
                      function (e) {
                        var t = (16 * Math.random()) | 0;
                        return ("x" === e ? t : (3 & t) | 8).toString(16);
                      }
                    );
                  },
                  htmlTreeAsString: function (e) {
                    for (
                      var t, n = [], r = 0, i = 0, o = " > ".length;
                      e &&
                      r++ < 5 &&
                      !(
                        "html" === (t = f(e)) ||
                        (r > 1 && i + n.length * o + t.length >= 80)
                      );

                    )
                      n.push(t), (i += t.length), (e = e.parentNode);
                    return n.reverse().join(" > ");
                  },
                  htmlElementAsString: f,
                  isSameException: function (e, t) {
                    return (
                      !m(e, t) &&
                      ((e = e.values[0]),
                      (t = t.values[0]),
                      e.type === t.type &&
                        e.value === t.value &&
                        !(function (e, t) {
                          return o(e) && o(t);
                        })(e.stacktrace, t.stacktrace) &&
                        g(e.stacktrace, t.stacktrace))
                    );
                  },
                  isSameStacktrace: g,
                  parseUrl: function (e) {
                    if ("string" != typeof e) return {};
                    var t = e.match(
                        /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/
                      ),
                      n = t[6] || "",
                      r = t[8] || "";
                    return {
                      protocol: t[2],
                      host: t[4],
                      path: t[5],
                      relative: t[5] + n + r,
                    };
                  },
                  fill: function (e, t, n, r) {
                    if (null != e) {
                      var i = e[t];
                      (e[t] = n(i)),
                        (e[t].M = !0),
                        (e[t].O = i),
                        r && r.push([e, t, i]);
                    }
                  },
                  safeJoin: function (e, t) {
                    if (!c(e)) return "";
                    for (var n = [], i = 0; i < e.length; i++)
                      try {
                        n.push(String(e[i]));
                      } catch (r) {
                        n.push("[value cannot be serialized]");
                      }
                    return n.join(t);
                  },
                  serializeException: function x(e, t, n) {
                    if (!a(e)) return e;
                    n =
                      "number" != typeof (t = "number" != typeof t ? k : t)
                        ? V
                        : n;
                    var r = w(e, t);
                    return y(b(r)) > n ? x(e, t - 1) : r;
                  },
                  serializeKeysForMessage: function (e, t) {
                    if ("number" == typeof e || "string" == typeof e)
                      return e.toString();
                    if (!Array.isArray(e)) return "";
                    if (
                      0 ===
                      (e = e.filter(function (e) {
                        return "string" == typeof e;
                      })).length
                    )
                      return "[object has no keys]";
                    if (((t = "number" != typeof t ? E : t), e[0].length >= t))
                      return e[0];
                    for (var n = e.length; n > 0; n--) {
                      var r = e.slice(0, n).join(", ");
                      if (!(r.length > t)) return n === e.length ? r : r + "…";
                    }
                    return "";
                  },
                  sanitize: function (e, t) {
                    if (!c(t) || (c(t) && 0 === t.length)) return e;
                    var n,
                      r = p(t),
                      o = "********";
                    try {
                      n = JSON.parse(b(e));
                    } catch (i) {
                      return e;
                    }
                    return (function s(e) {
                      return c(e)
                        ? e.map(function (e) {
                            return s(e);
                          })
                        : a(e)
                        ? Object.keys(e).reduce(function (t, n) {
                            return (t[n] = r.test(n) ? o : s(e[n])), t;
                          }, {})
                        : e;
                    })(n);
                  },
                };
              }).call(
                this,
                "undefined" != typeof global
                  ? global
                  : "undefined" != typeof self
                  ? self
                  : "undefined" != typeof window
                  ? window
                  : {}
              );
            },
            { 7: 7 },
          ],
          6: [
            function (e, t, n) {
              (function (n) {
                function r() {
                  return "undefined" == typeof document ||
                    null == document.location
                    ? ""
                    : document.location.href;
                }
                var i = e(5),
                  o = { collectWindowErrors: !0, debug: !1 },
                  a =
                    "undefined" != typeof window
                      ? window
                      : void 0 !== n
                      ? n
                      : "undefined" != typeof self
                      ? self
                      : {},
                  s = [].slice,
                  c = "?",
                  l =
                    /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
                (o.report = (function () {
                  function e(t, n) {
                    var r = null;
                    if (!n || o.collectWindowErrors) {
                      for (var i in p)
                        if (p.hasOwnProperty(i))
                          try {
                            p[i].apply(null, [t].concat(s.call(arguments, 2)));
                          } catch (e) {
                            r = e;
                          }
                      if (r) throw r;
                    }
                  }
                  function t(t, a, s, h, d) {
                    var p = i.isErrorEvent(d) ? d.error : d,
                      f = i.isErrorEvent(t) ? t.message : t;
                    if (g)
                      o.computeStackTrace.augmentStackTraceWithInitialElement(
                        g,
                        a,
                        s,
                        f
                      ),
                        n();
                    else if (p && i.isError(p)) e(o.computeStackTrace(p), !0);
                    else {
                      var m,
                        y = { url: a, line: s, column: h },
                        v = void 0;
                      if ("[object String]" === {}.toString.call(f))
                        (m = f.match(l)) && ((v = m[1]), (f = m[2]));
                      (y.func = c),
                        e({ name: v, message: f, url: r(), stack: [y] }, !0);
                    }
                    return !!u && u.apply(this, arguments);
                  }
                  function n() {
                    var t = g,
                      n = f;
                    (f = null),
                      (g = null),
                      (m = null),
                      e.apply(null, [t, !1].concat(n));
                  }
                  function h(e, t) {
                    var r = s.call(arguments, 1);
                    if (g) {
                      if (m === e) return;
                      n();
                    }
                    var i = o.computeStackTrace(e);
                    if (
                      ((g = i),
                      (m = e),
                      (f = r),
                      setTimeout(
                        function () {
                          m === e && n();
                        },
                        i.incomplete ? 2e3 : 0
                      ),
                      !1 !== t)
                    )
                      throw e;
                  }
                  var u,
                    d,
                    p = [],
                    f = null,
                    m = null,
                    g = null;
                  return (
                    (h.subscribe = function (e) {
                      d || ((u = a.onerror), (a.onerror = t), (d = !0)),
                        p.push(e);
                    }),
                    (h.unsubscribe = function (e) {
                      for (var t = p.length - 1; t >= 0; --t)
                        p[t] === e && p.splice(t, 1);
                    }),
                    (h.uninstall = function () {
                      d && ((a.onerror = u), (d = !1), (u = void 0)), (p = []);
                    }),
                    h
                  );
                })()),
                  (o.computeStackTrace = (function () {
                    function e(e) {
                      if ("undefined" != typeof e.stack && e.stack) {
                        for (
                          var t,
                            n,
                            i,
                            o =
                              /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
                            a =
                              /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx(?:-web)|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
                            s =
                              /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js))(?::(\d+))?(?::(\d+))?\s*$/i,
                            l = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
                            h = /\((\S*)(?::(\d+))(?::(\d+))\)/,
                            u = e.stack.split("\n"),
                            d = [],
                            p = (/^(.*) is undefined$/.exec(e.message), 0),
                            f = u.length;
                          p < f;
                          ++p
                        ) {
                          if ((n = o.exec(u[p]))) {
                            var m = n[2] && 0 === n[2].indexOf("native");
                            n[2] &&
                              0 === n[2].indexOf("eval") &&
                              (t = h.exec(n[2])) &&
                              ((n[2] = t[1]), (n[3] = t[2]), (n[4] = t[3])),
                              (i = {
                                url: m ? null : n[2],
                                func: n[1] || c,
                                args: m ? [n[2]] : [],
                                line: n[3] ? +n[3] : null,
                                column: n[4] ? +n[4] : null,
                              });
                          } else if ((n = a.exec(u[p])))
                            i = {
                              url: n[2],
                              func: n[1] || c,
                              args: [],
                              line: +n[3],
                              column: n[4] ? +n[4] : null,
                            };
                          else {
                            if (!(n = s.exec(u[p]))) continue;
                            n[3] &&
                            n[3].indexOf(" > eval") > -1 &&
                            (t = l.exec(n[3]))
                              ? ((n[3] = t[1]), (n[4] = t[2]), (n[5] = null))
                              : 0 !== p ||
                                n[5] ||
                                "undefined" == typeof e.columnNumber ||
                                (d[0].column = e.columnNumber + 1),
                              (i = {
                                url: n[3],
                                func: n[1] || c,
                                args: n[2] ? n[2].split(",") : [],
                                line: n[4] ? +n[4] : null,
                                column: n[5] ? +n[5] : null,
                              });
                          }
                          if (
                            (!i.func && i.line && (i.func = c),
                            i.url && "blob:" === i.url.substr(0, 5))
                          ) {
                            var g = new XMLHttpRequest();
                            if (
                              (g.open("GET", i.url, !1),
                              g.send(null),
                              200 === g.status)
                            ) {
                              var y = g.responseText || "",
                                v = (y = y.slice(-300)).match(
                                  /\/\/# sourceMappingURL=(.*)$/
                                );
                              if (v) {
                                var w = v[1];
                                "~" === w.charAt(0) &&
                                  (w =
                                    ("undefined" == typeof document ||
                                    null == document.location
                                      ? ""
                                      : document.location.origin
                                      ? document.location.origin
                                      : document.location.protocol +
                                        "//" +
                                        document.location.hostname +
                                        (document.location.port
                                          ? ":" + document.location.port
                                          : "")) + w.slice(1)),
                                  (i.url = w.slice(0, -4));
                              }
                            }
                          }
                          d.push(i);
                        }
                        return d.length
                          ? {
                              name: e.name,
                              message: e.message,
                              url: r(),
                              stack: d,
                            }
                          : null;
                      }
                    }
                    function t(e, t, n, r) {
                      var i = { url: t, line: n };
                      if (i.url && i.line) {
                        if (
                          ((e.incomplete = !1),
                          i.func || (i.func = c),
                          e.stack.length > 0 && e.stack[0].url === i.url)
                        ) {
                          if (e.stack[0].line === i.line) return !1;
                          if (!e.stack[0].line && e.stack[0].func === i.func)
                            return (e.stack[0].line = i.line), !1;
                        }
                        return e.stack.unshift(i), (e.partial = !0), !0;
                      }
                      return (e.incomplete = !0), !1;
                    }
                    function n(e, a) {
                      for (
                        var s,
                          l,
                          h =
                            /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
                          u = [],
                          d = {},
                          p = !1,
                          f = n.caller;
                        f && !p;
                        f = f.caller
                      )
                        if (f !== i && f !== o.report) {
                          if (
                            ((l = {
                              url: null,
                              func: c,
                              line: null,
                              column: null,
                            }),
                            f.name
                              ? (l.func = f.name)
                              : (s = h.exec(f.toString())) && (l.func = s[1]),
                            "undefined" == typeof l.func)
                          )
                            try {
                              l.func = s.input.substring(
                                0,
                                s.input.indexOf("{")
                              );
                            } catch (g) {}
                          d["" + f] ? (p = !0) : (d["" + f] = !0), u.push(l);
                        }
                      a && u.splice(0, a);
                      var m = {
                        name: e.name,
                        message: e.message,
                        url: r(),
                        stack: u,
                      };
                      return (
                        t(
                          m,
                          e.sourceURL || e.fileName,
                          e.line || e.lineNumber,
                          e.message || e.description
                        ),
                        m
                      );
                    }
                    function i(t, i) {
                      var s = null;
                      i = null == i ? 0 : +i;
                      try {
                        if ((s = e(t))) return s;
                      } catch (a) {
                        if (o.debug) throw a;
                      }
                      try {
                        if ((s = n(t, i + 1))) return s;
                      } catch (a) {
                        if (o.debug) throw a;
                      }
                      return { name: t.name, message: t.message, url: r() };
                    }
                    return (
                      (i.augmentStackTraceWithInitialElement = t),
                      (i.computeStackTraceFromStackProp = e),
                      i
                    );
                  })()),
                  (t.exports = o);
              }).call(
                this,
                "undefined" != typeof global
                  ? global
                  : "undefined" != typeof self
                  ? self
                  : "undefined" != typeof window
                  ? window
                  : {}
              );
            },
            { 5: 5 },
          ],
          7: [
            function (e, t, n) {
              function r(e, t) {
                for (var n = 0; n < e.length; ++n) if (e[n] === t) return n;
                return -1;
              }
              function i(e, t) {
                var n = [],
                  i = [];
                return (
                  null == t &&
                    (t = function (e, t) {
                      return n[0] === t
                        ? "[Circular ~]"
                        : "[Circular ~." + i.slice(0, r(n, t)).join(".") + "]";
                    }),
                  function (o, a) {
                    if (n.length > 0) {
                      var s = r(n, this);
                      ~s ? n.splice(s + 1) : n.push(this),
                        ~s ? i.splice(s, 1 / 0, o) : i.push(o),
                        ~r(n, a) && (a = t.call(this, o, a));
                    } else n.push(a);
                    return null == e
                      ? a instanceof Error
                        ? (function (e) {
                            var t = {
                              stack: e.stack,
                              message: e.message,
                              name: e.name,
                            };
                            for (var n in e)
                              Object.prototype.hasOwnProperty.call(e, n) &&
                                (t[n] = e[n]);
                            return t;
                          })(a)
                        : a
                      : e.call(this, o, a);
                  }
                );
              }
              (n = t.exports =
                function (e, t, n, r) {
                  return JSON.stringify(e, i(t, r), n);
                }),
                (n.getSerialize = i);
            },
            {},
          ],
          8: [
            function (e, t, n) {
              function r(e, t) {
                var n = (65535 & e) + (65535 & t);
                return (
                  (((e >> 16) + (t >> 16) + (n >> 16)) << 16) | (65535 & n)
                );
              }
              function i(e, t, n, i, o, a) {
                return r(
                  (function (e, t) {
                    return (e << t) | (e >>> (32 - t));
                  })(r(r(t, e), r(i, a)), o),
                  n
                );
              }
              function o(e, t, n, r, o, a, s) {
                return i((t & n) | (~t & r), e, t, o, a, s);
              }
              function a(e, t, n, r, o, a, s) {
                return i((t & r) | (n & ~r), e, t, o, a, s);
              }
              function s(e, t, n, r, o, a, s) {
                return i(t ^ n ^ r, e, t, o, a, s);
              }
              function c(e, t, n, r, o, a, s) {
                return i(n ^ (t | ~r), e, t, o, a, s);
              }
              function l(e, t) {
                (e[t >> 5] |= 128 << t % 32),
                  (e[14 + (((t + 64) >>> 9) << 4)] = t);
                var n,
                  i,
                  l,
                  h,
                  u,
                  d = 1732584193,
                  p = -271733879,
                  f = -1732584194,
                  m = 271733878;
                for (n = 0; n < e.length; n += 16)
                  (i = d),
                    (l = p),
                    (h = f),
                    (u = m),
                    (d = o(d, p, f, m, e[n], 7, -680876936)),
                    (m = o(m, d, p, f, e[n + 1], 12, -389564586)),
                    (f = o(f, m, d, p, e[n + 2], 17, 606105819)),
                    (p = o(p, f, m, d, e[n + 3], 22, -1044525330)),
                    (d = o(d, p, f, m, e[n + 4], 7, -176418897)),
                    (m = o(m, d, p, f, e[n + 5], 12, 1200080426)),
                    (f = o(f, m, d, p, e[n + 6], 17, -1473231341)),
                    (p = o(p, f, m, d, e[n + 7], 22, -45705983)),
                    (d = o(d, p, f, m, e[n + 8], 7, 1770035416)),
                    (m = o(m, d, p, f, e[n + 9], 12, -1958414417)),
                    (f = o(f, m, d, p, e[n + 10], 17, -42063)),
                    (p = o(p, f, m, d, e[n + 11], 22, -1990404162)),
                    (d = o(d, p, f, m, e[n + 12], 7, 1804603682)),
                    (m = o(m, d, p, f, e[n + 13], 12, -40341101)),
                    (f = o(f, m, d, p, e[n + 14], 17, -1502002290)),
                    (d = a(
                      d,
                      (p = o(p, f, m, d, e[n + 15], 22, 1236535329)),
                      f,
                      m,
                      e[n + 1],
                      5,
                      -165796510
                    )),
                    (m = a(m, d, p, f, e[n + 6], 9, -1069501632)),
                    (f = a(f, m, d, p, e[n + 11], 14, 643717713)),
                    (p = a(p, f, m, d, e[n], 20, -373897302)),
                    (d = a(d, p, f, m, e[n + 5], 5, -701558691)),
                    (m = a(m, d, p, f, e[n + 10], 9, 38016083)),
                    (f = a(f, m, d, p, e[n + 15], 14, -660478335)),
                    (p = a(p, f, m, d, e[n + 4], 20, -405537848)),
                    (d = a(d, p, f, m, e[n + 9], 5, 568446438)),
                    (m = a(m, d, p, f, e[n + 14], 9, -1019803690)),
                    (f = a(f, m, d, p, e[n + 3], 14, -187363961)),
                    (p = a(p, f, m, d, e[n + 8], 20, 1163531501)),
                    (d = a(d, p, f, m, e[n + 13], 5, -1444681467)),
                    (m = a(m, d, p, f, e[n + 2], 9, -51403784)),
                    (f = a(f, m, d, p, e[n + 7], 14, 1735328473)),
                    (d = s(
                      d,
                      (p = a(p, f, m, d, e[n + 12], 20, -1926607734)),
                      f,
                      m,
                      e[n + 5],
                      4,
                      -378558
                    )),
                    (m = s(m, d, p, f, e[n + 8], 11, -2022574463)),
                    (f = s(f, m, d, p, e[n + 11], 16, 1839030562)),
                    (p = s(p, f, m, d, e[n + 14], 23, -35309556)),
                    (d = s(d, p, f, m, e[n + 1], 4, -1530992060)),
                    (m = s(m, d, p, f, e[n + 4], 11, 1272893353)),
                    (f = s(f, m, d, p, e[n + 7], 16, -155497632)),
                    (p = s(p, f, m, d, e[n + 10], 23, -1094730640)),
                    (d = s(d, p, f, m, e[n + 13], 4, 681279174)),
                    (m = s(m, d, p, f, e[n], 11, -358537222)),
                    (f = s(f, m, d, p, e[n + 3], 16, -722521979)),
                    (p = s(p, f, m, d, e[n + 6], 23, 76029189)),
                    (d = s(d, p, f, m, e[n + 9], 4, -640364487)),
                    (m = s(m, d, p, f, e[n + 12], 11, -421815835)),
                    (f = s(f, m, d, p, e[n + 15], 16, 530742520)),
                    (d = c(
                      d,
                      (p = s(p, f, m, d, e[n + 2], 23, -995338651)),
                      f,
                      m,
                      e[n],
                      6,
                      -198630844
                    )),
                    (m = c(m, d, p, f, e[n + 7], 10, 1126891415)),
                    (f = c(f, m, d, p, e[n + 14], 15, -1416354905)),
                    (p = c(p, f, m, d, e[n + 5], 21, -57434055)),
                    (d = c(d, p, f, m, e[n + 12], 6, 1700485571)),
                    (m = c(m, d, p, f, e[n + 3], 10, -1894986606)),
                    (f = c(f, m, d, p, e[n + 10], 15, -1051523)),
                    (p = c(p, f, m, d, e[n + 1], 21, -2054922799)),
                    (d = c(d, p, f, m, e[n + 8], 6, 1873313359)),
                    (m = c(m, d, p, f, e[n + 15], 10, -30611744)),
                    (f = c(f, m, d, p, e[n + 6], 15, -1560198380)),
                    (p = c(p, f, m, d, e[n + 13], 21, 1309151649)),
                    (d = c(d, p, f, m, e[n + 4], 6, -145523070)),
                    (m = c(m, d, p, f, e[n + 11], 10, -1120210379)),
                    (f = c(f, m, d, p, e[n + 2], 15, 718787259)),
                    (p = c(p, f, m, d, e[n + 9], 21, -343485551)),
                    (d = r(d, i)),
                    (p = r(p, l)),
                    (f = r(f, h)),
                    (m = r(m, u));
                return [d, p, f, m];
              }
              function h(e) {
                var t,
                  n = "",
                  r = 32 * e.length;
                for (t = 0; t < r; t += 8)
                  n += String.fromCharCode((e[t >> 5] >>> t % 32) & 255);
                return n;
              }
              function u(e) {
                var t,
                  n = [];
                for (
                  n[(e.length >> 2) - 1] = void 0, t = 0;
                  t < n.length;
                  t += 1
                )
                  n[t] = 0;
                var r = 8 * e.length;
                for (t = 0; t < r; t += 8)
                  n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
                return n;
              }
              function d(e) {
                var t,
                  n,
                  r = "0123456789abcdef",
                  i = "";
                for (n = 0; n < e.length; n += 1)
                  (t = e.charCodeAt(n)),
                    (i += r.charAt((t >>> 4) & 15) + r.charAt(15 & t));
                return i;
              }
              function p(e) {
                return unescape(encodeURIComponent(e));
              }
              function f(e) {
                return (function (e) {
                  return h(l(u(e), 8 * e.length));
                })(p(e));
              }
              function m(e, t) {
                return (function (e, t) {
                  var n,
                    r,
                    i = u(e),
                    o = [],
                    a = [];
                  for (
                    o[15] = a[15] = void 0,
                      i.length > 16 && (i = l(i, 8 * e.length)),
                      n = 0;
                    n < 16;
                    n += 1
                  )
                    (o[n] = 909522486 ^ i[n]), (a[n] = 1549556828 ^ i[n]);
                  return (
                    (r = l(o.concat(u(t)), 512 + 8 * t.length)),
                    h(l(a.concat(r), 640))
                  );
                })(p(e), p(t));
              }
              t.exports = function (e, t, n) {
                return t
                  ? n
                    ? m(t, e)
                    : (function (e, t) {
                        return d(m(e, t));
                      })(t, e)
                  : n
                  ? f(e)
                  : (function (e) {
                      return d(f(e));
                    })(e);
              };
            },
            {},
          ],
        },
        {},
        [4]
      )(4);
    });
  var D = [
      {
        family: "UC Browser",
        patterns: ["(UC? ?Browser|UCWEB|U3)[ /]?(\\d+)\\.(\\d+)\\.(\\d+)"],
      },
      {
        family: "Opera",
        name_replace: "Opera Mobile",
        patterns: [
          "(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)",
          "(Opera)/(\\d+)\\.(\\d+).+Opera Mobi",
          "Opera Mobi.+(Opera)(?:/|\\s+)(\\d+)\\.(\\d+)",
          "Opera Mobi",
          "(?:Mobile Safari).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Opera",
        name_replace: "Opera Mini",
        patterns: [
          "(Opera Mini)(?:/att|)/?(\\d+|)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
          "(OPiOS)/(\\d+).(\\d+).(\\d+)",
        ],
      },
      {
        family: "Opera",
        name_replace: "Opera Neon",
        patterns: ["Chrome/.+( MMS)/(\\d+).(\\d+).(\\d+)"],
      },
      {
        name_replace: "Opera",
        patterns: [
          "(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(?:Chrome).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Firefox",
        name_replace: "Firefox Mobile",
        patterns: [
          "(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
          "(Fennec)/(\\d+)\\.(\\d+)(pre)",
          "(Fennec)/(\\d+)\\.(\\d+)",
          "(?:Mobile|Tablet);.*(Firefox)/(\\d+)\\.(\\d+)",
          "(FxiOS)/(\\d+)\\.(\\d+)(\\.(\\d+)|)(\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Coc Coc",
        patterns: ["(coc_coc_browser)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"],
      },
      {
        family: "QQ",
        name_replace: "QQ Mini",
        patterns: ["(MQQBrowser/Mini)(?:(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"],
      },
      {
        family: "QQ",
        name_replace: "QQ Mobile",
        patterns: ["(MQQBrowser)(?:/(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"],
      },
      {
        name_replace: "QQ",
        patterns: [
          "(QQBrowser)(?:/(\\d+)(?:\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)|)",
        ],
      },
      {
        family: "Edge",
        name: "Edge Mobile",
        patterns: [
          "Windows Phone .*(Edge)/(\\d+)\\.(\\d+)",
          "(EdgiOS|EdgA)/(\\d+)\\.(\\d+).(\\d+).(\\d+)",
        ],
      },
      { name_replace: "Edge", patterns: ["(Edge|Edg)/(\\d+)(?:\\.(\\d+)|)"] },
      { patterns: ["(Puffin)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"] },
      {
        family: "Chrome",
        name_replace: "Chrome Mobile",
        patterns: [
          "Version/.+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "; wv\\).+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile(?:[ /]|$)",
          " Mobile .*(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Yandex",
        name_replace: "Yandex Mobile",
        patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+).*Mobile"],
      },
      {
        name_replace: "Yandex",
        patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)"],
      },
      {
        patterns: [
          "(Vivaldi)/(\\d+)\\.(\\d+)",
          "(Vivaldi)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        name_replace: "Brave",
        patterns: ["(brave)/(\\d+)\\.(\\d+)\\.(\\d+) Chrome"],
      },
      {
        family: "Chrome",
        patterns: [
          "(Chromium|Chrome)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Internet Explorer Mobile",
        patterns: ["(IEMobile)[ /](\\d+)\\.(\\d+)"],
      },
      {
        family: "Safari",
        name_replace: "Safari Mobile",
        patterns: [
          "(iPod|iPhone|iPad).+Version/(d+).(d+)(?:.(d+)|).*[ +]Safari",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).* AppleNews\\/\\d+\\.\\d+\\.\\d+?",
          "(iPod|iPhone|iPad).+Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile.*[ +]Safari",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile",
          "(iPod|iPod touch|iPhone|iPad).* Safari",
          "(iPod|iPod touch|iPhone|iPad)",
        ],
      },
      {
        name_replace: "Safari",
        patterns: ["(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|).*Safari/"],
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(7|8).(0)"],
        major_replace: "11",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(6)\\.(0)"],
        major_replace: "10",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(5)\\.(0)"],
        major_replace: "9",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(4)\\.(0)"],
        major_replace: "8",
      },
      {
        family: "Firefox",
        patterns: [
          "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*|)",
        ],
      },
    ],
    H = [
      {
        family: "Windows",
        name_replace: "Windows Phone",
        patterns: [
          "(Windows Phone) (?:OS[ /])?(\\d+)\\.(\\d+)",
          "^UCWEB.*; (wds) (\\d+)\\.(d+)(?:\\.(\\d+)|);",
          "^UCWEB.*; (wds) (\\d+)\\.(\\d+)(?:\\.(\\d+)|);",
        ],
      },
      {
        family: "Windows",
        name_replace: "Windows Mobile",
        patterns: ["(Windows ?Mobile)"],
      },
      {
        name_replace: "Android",
        patterns: [
          "(Android)[ \\-/](\\d+)(?:\\.(\\d+)|)(?:[.\\-]([a-z0-9]+)|)",
          "(Android) (d+);",
          "^UCWEB.*; (Adr) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+)|);",
          "^(JUC).*; ?U; ?(?:Android|)(\\d+)\\.(\\d+)(?:[\\.\\-]([a-z0-9]+)|)",
          "(android)\\s(?:mobile\\/)(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(Silk-Accelerated=[a-z]{4,5})",
          "Puffin/[\\d\\.]+AT",
          "Puffin/[\\d\\.]+AP",
        ],
      },
      {
        name_replace: "Chrome OS",
        patterns: [
          "(x86_64|aarch64)\\ (\\d+)\\.(\\d+)\\.(\\d+).*Chrome.*(?:CitrixChromeApp)$",
          "(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows 10)", "(Windows NT 6\\.4)", "(Windows NT 10\\.0)"],
        major_replace: "10",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.3; ARM;)", "(Windows NT 6.3)"],
        major_replace: "8",
        minor_replace: "1",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.2)"],
        major_replace: "8",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.1)"],
        major_replace: "7",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.0)"],
        major_replace: "Vista",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows (?:NT 5\\.2|NT 5\\.1))"],
        major_replace: "XP",
      },
      {
        name_replace: "Mac OS X",
        patterns: [
          "((?:Mac[ +]?|; )OS[ +]X)[\\s+/](?:(\\d+)[_.](\\d+)(?:[_.](\\d+)|)|Mach-O)",
          "\\w+\\s+Mac OS X\\s+\\w+\\s+(\\d+).(\\d+).(\\d+).*",
          "(?:PPC|Intel) (Mac OS X)",
        ],
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(10).(d+).*((?:i386|x86_64))"],
        major_replace: "10",
        minor_replace: "6",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(11).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "7",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(12).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "8",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(13).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "9",
      },
      {
        name_replace: "iOS",
        patterns: [
          "^UCWEB.*; (iPad|iPh|iPd) OS (\\d+)_(\\d+)(?:_(\\d+)|);",
          "(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(\\d+)[_\\.](\\d+)(?:[_\\.](\\d+)|)",
          "(iPhone|iPad|iPod); Opera",
          "(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)",
          "\\b(iOS[ /]|iOS; |iPhone(?:/| v|[ _]OS[/,]|; | OS : |\\d,\\d/|\\d,\\d; )|iPad/)(\\d{1,2})[_\\.](\\d{1,2})(?:[_\\.](\\d+)|)",
          "\\((iOS);",
          "(iPod|iPhone|iPad)",
          "Puffin/[\\d\\.]+IT",
          "Puffin/[\\d\\.]+IP",
        ],
      },
      {
        family: "Chrome",
        name_replace: "Chromecast",
        patterns: [
          "(CrKey -)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(CrKey[ +]armv7l)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(CrKey)(?:[/](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
        ],
      },
      { name_replace: "Debian", patterns: ["([Dd]ebian)"] },
      {
        family: "Linux",
        name_replace: "Linux",
        patterns: ["(Linux Mint)(?:/(\\d+)|)"],
      },
      {
        family: "Linux",
        patterns: [
          "(Ubuntu|Kubuntu|Arch Linux|CentOS|Slackware|Gentoo|openSUSE|SUSE|Red Hat|Fedora|PCLinuxOS|Mageia|(?:Free|Open|Net|\\b)BSD)",
          "(Mandriva)(?: Linux|)/(?:[\\d.-]+m[a-z]{2}(\\d+).(\\d)|)",
          "(Linux)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "\\(linux-gnu\\)",
        ],
      },
      {
        family: "BlackBerry",
        name_replace: "BlackBerry OS",
        patterns: [
          "(BB10);.+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(Black[Bb]erry)",
        ],
      },
      {
        patterns: [
          "(Fedora|Red Hat|PCLinuxOS|Puppy|Ubuntu|Kindle|Bada|Sailfish|Lubuntu|BackTrack|Slackware|(?:Free|Open|Net|\\b)BSD)[/ ](\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
        ],
      },
    ],
    J = navigator.userAgent,
    K = function () {
      return J;
    },
    z = function (e) {
      return $(e || J, D);
    },
    L = function (e) {
      return $(e || J, H);
    };
  function Q(e, t) {
    try {
      var n = new RegExp(t).exec(e);
      return n
        ? {
            name: n[1] || "Other",
            major: n[2] || "0",
            minor: n[3] || "0",
            patch: n[4] || "0",
          }
        : null;
    } catch (Kn) {
      return null;
    }
  }
  function $(e, t) {
    for (var n = null, r = null, i = -1, o = !1; ++i < t.length && !o; ) {
      n = t[i];
      for (var a = -1; ++a < n.patterns.length && !o; )
        o = null !== (r = Q(e, n.patterns[a]));
    }
    return o
      ? ((r.family = n.family || n.name_replace || r.name),
        n.name_replace && (r.name = n.name_replace),
        n.major_replace && (r.major = n.major_replace),
        n.minor_replace && (r.minor = n.minor_replace),
        n.patch_replace && (r.minor = n.patch_replace),
        r)
      : { family: "Other", name: "Other", major: "0", minor: "0", patch: "0" };
  }
  function Y() {
    var e = this,
      t = z(),
      n = K();
    (this.agent = n.toLowerCase()),
      (this.language =
        window.navigator.userLanguage || window.navigator.language),
      (this.isCSS1 = "CSS1Compat" === (document.compatMode || "")),
      (this.width = function () {
        return window.innerWidth && window.document.documentElement.clientWidth
          ? Math.min(window.innerWidth, document.documentElement.clientWidth)
          : window.innerWidth ||
              window.document.documentElement.clientWidth ||
              document.body.clientWidth;
      }),
      (this.height = function () {
        return (
          window.innerHeight ||
          window.document.documentElement.clientHeight ||
          document.body.clientHeight
        );
      }),
      (this.scrollX = function () {
        return window.pageXOffset !== undefined
          ? window.pageXOffset
          : e.isCSS1
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft;
      }),
      (this.scrollY = function () {
        return window.pageYOffset !== undefined
          ? window.pageYOffset
          : e.isCSS1
          ? document.documentElement.scrollTop
          : document.body.scrollTop;
      }),
      (this.type =
        "Edge" === t.family
          ? "edge"
          : "Internet Explorer" === t.family
          ? "ie"
          : "Chrome" === t.family
          ? "chrome"
          : "Safari" === t.family
          ? "safari"
          : "Firefox" === t.family
          ? "firefox"
          : t.family.toLowerCase()),
      (this.version = 1 * (t.major + "." + t.minor) || 0),
      (this.hasPostMessage = !!window.postMessage);
  }
  (Y.prototype.hasEvent = function (e, t) {
    return "on" + e in (t || document.createElement("div"));
  }),
    (Y.prototype.getScreenDimensions = function () {
      var e = {};
      for (var t in window.screen) e[t] = window.screen[t];
      return delete e.orientation, e;
    }),
    (Y.prototype.getOrientation = function () {
      return "function" == typeof matchMedia
        ? matchMedia("(orientation: landscape)").matches
          ? "landscape"
          : "portrait"
        : window.screen.orientation
        ? screen.orientation.type.startsWith("landscape")
          ? "landscape"
          : "portrait"
        : this.width() > this.height()
        ? "landscape"
        : "portrait";
    }),
    (Y.prototype.getWindowDimensions = function () {
      return [this.width(), this.height()];
    }),
    (Y.prototype.interrogateNavigator = function () {
      var e = {};
      for (var t in window.navigator)
        if ("webkitPersistentStorage" !== t)
          try {
            e[t] = window.navigator[t];
          } catch (Jn) {}
      if (
        (delete e.plugins,
        delete e.mimeTypes,
        (e.plugins = []),
        window.navigator.plugins)
      )
        for (var n = 0; n < window.navigator.plugins.length; n++)
          e.plugins[n] = window.navigator.plugins[n].filename;
      return e;
    }),
    (Y.prototype.supportsPST = function () {
      return document.hasPrivateToken !== undefined;
    }),
    (Y.prototype.supportsCanvas = function () {
      var e = document.createElement("canvas");
      return !(!e.getContext || !e.getContext("2d"));
    }),
    (Y.prototype.supportsWebAssembly = function () {
      try {
        if (
          "object" == typeof WebAssembly &&
          "function" == typeof WebAssembly.instantiate
        ) {
          var e = new WebAssembly.Module(
            Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0)
          );
          if (e instanceof WebAssembly.Module)
            return new WebAssembly.Instance(e) instanceof WebAssembly.Instance;
        }
      } catch (Kn) {
        return !1;
      }
    });
  var X = new Y(),
    q = new (function () {
      var e,
        t,
        n = L(),
        r = K();
      (this.mobile =
        ((e = !!(
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
        )),
        (t = !1),
        n &&
          (t =
            [
              "iOS",
              "Windows Phone",
              "Windows Mobile",
              "Android",
              "BlackBerry OS",
            ].indexOf(n.name) >= 0),
        e && t)),
        (this.dpr = function () {
          return window.devicePixelRatio || 1;
        }),
        this.mobile &&
          n &&
          "Windows" === n.family &&
          r.indexOf("touch") < 0 &&
          (this.mobile = !1),
        (this.os =
          "iOS" === n.family
            ? "ios"
            : "Android" === n.family
            ? "android"
            : "Mac OS X" === n.family
            ? "mac"
            : "Windows" === n.family
            ? "windows"
            : "Linux" === n.family
            ? "linux"
            : n.family.toLowerCase()),
        (this.version = (function () {
          if (!n) return "unknown";
          var e = n.major;
          return (
            n.minor && (e += "." + n.minor), n.patch && (e += "." + n.patch), e
          );
        })());
    })(),
    ee = {
      Browser: X,
      System: q,
      supportsPAT: function () {
        return (
          ("mac" === q.os || "ios" === q.os) &&
          "safari" === X.type &&
          X.version >= 16.2
        );
      },
    },
    te = "challenge-passed",
    ne = "challenge-escaped",
    re = "challenge-closed",
    ie = "challenge-expired",
    oe = "invalid-data",
    ae = "bundle-error",
    se = "rate-limited",
    ce = "network-error",
    le = "challenge-error",
    he = "incomplete-answer",
    ue = "missing-captcha",
    de = "missing-sitekey",
    pe = "invalid-captcha-id",
    fe = "https://api.hcaptcha.com",
    me = "https://api2.hcaptcha.com",
    ge = "auto",
    ye = {
      host: null,
      file: null,
      sitekey: null,
      a11y_tfe: null,
      pingdom:
        "safari" === ee.Browser.type &&
        "windows" !== ee.System.os &&
        "mac" !== ee.System.os &&
        "ios" !== ee.System.os &&
        "android" !== ee.System.os,
      assetDomain: "https://newassets.hcaptcha.com",
      assetUrl:
        "https://newassets.hcaptcha.com/captcha/v1/b4d3f0b0031fc2a4abb259f13f0b9f93c45e54c0/static",
      width: null,
      height: null,
      mobile: null,
      orientation: "portrait",
      challenge_type: null,
    },
    ve = {
      se: null,
      custom: !1,
      tplinks: "on",
      language: null,
      reportapi: "https://accounts.hcaptcha.com",
      endpoint: fe,
      pstIssuer: "https://pst-issuer.hcaptcha.com",
      size: "normal",
      theme: "light",
      mode: undefined,
      assethost: null,
      imghost: null,
      recaptchacompat: "true",
      pat: "on",
      confirmNav: !1,
    },
    we = "https://30910f52569b4c17b1081ead2dae43b4@sentry.hcaptcha.com/6",
    be = "b4d3f0b0031fc2a4abb259f13f0b9f93c45e54c0",
    _e = "prod";
  function ke(e, t) {
    (e.style.width = "304px"),
      (e.style.height = "78px"),
      (e.style.backgroundColor = "#f9e5e5"),
      (e.style.position = "relative"),
      (e.innerHTML = "");
    var n = document.createElement("div");
    (n.style.width = "284px"),
      (n.style.position = "absolute"),
      (n.style.top = "12px"),
      (n.style.left = "10px"),
      (n.style.color = "#7c0a06"),
      (n.style.fontSize = "14px"),
      (n.style.fontWeight = "normal"),
      (n.style.lineHeight = "18px"),
      (n.innerHTML =
        t ||
        "Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> to complete this captcha."),
      e.appendChild(n);
  }
  function Ve(e) {
    for (
      var t = document.getElementsByClassName("h-captcha"), n = [], r = 0;
      r < t.length;
      r++
    )
      n.push(t[r]);
    var i = [];
    if ("off" !== ve.recaptchacompat)
      for (
        var o = document.getElementsByClassName("g-recaptcha"), a = 0;
        a < o.length;
        a++
      )
        i.push(o[a]);
    for (var s = [].concat(n, i), c = 0; c < s.length; c++) e(s[c]);
  }
  var Ee = "The captcha failed to load.",
    xe = [];
  function Se(e) {
    for (
      var t = [],
        n = /(https?|wasm):\/\//,
        r = /^at /,
        i = /:\d+:\d+/g,
        o = 0,
        a = e.length;
      o < a;
      o++
    ) {
      var s = e[o];
      if (!n.test(s)) {
        var c = s.trim().replace(r, "").replace(i, "");
        t.push(c);
      }
    }
    return t.join("\n").trim();
  }
  function Re(e) {
    if (
      e &&
      "string" == typeof e &&
      -1 === xe.indexOf(e) &&
      !(xe.length >= 10)
    ) {
      var t = Se(e.trim().split("\n").slice(0, 2));
      xe.push(t);
    }
  }
  function Te(e) {
    (e && "object" == typeof e) ||
      (e = { name: "error", message: "", stack: "" });
    var t = { message: e.name + ": " + e.message };
    e.stack && (t.stack_trace = { trace: e.stack }),
      Ie("report error", "internal", "debug", t),
      Me(e.message || "internal error", "error", ye.file, e);
  }
  function Ue(e) {
    return function () {
      try {
        return e.apply(this, arguments);
      } catch (Jn) {
        throw (
          (Te(Jn),
          Ve(function (e) {
            ke(e, Ee);
          }),
          Jn)
        );
      }
    };
  }
  function Ce(e) {
    if (ve.sentry) {
      var t = !1,
        n = !1;
      try {
        (t = -1 !== window.location.href.indexOf("chargebee.com")),
          (n = -1 !== window.location.href.indexOf("kobo"));
      } catch (Kn) {}
      window.Raven &&
        Raven.config(we, {
          release: be,
          environment: _e,
          autoBreadcrumbs: { xhr: !0, dom: !0, sentry: !0 },
          tags: {
            "site-host": ye.host,
            "site-key": ye.sitekey,
            "endpoint-url": ve.endpoint,
            "asset-url": ye.assetUrl,
          },
          sampleRate: t || n ? 1 : 0.01,
          ignoreErrors: [
            "Cannot set properties of undefined (setting 'data')",
            "canvas.contentDocument",
            "Can't find variable: ZiteReader",
            "Cannot redefine property: hcaptcha",
            "Cannot redefine property: BetterJsPop",
            "grecaptcha is not defined",
            "jQuery is not defined",
            "$ is not defined",
            "Script is not a function",
          ],
        }),
        window.Raven &&
          Raven.setUserContext({
            "Browser-Agent": ee.Browser.agent,
            "Browser-Type": ee.Browser.type,
            "Browser-Version": ee.Browser.version,
            "System-OS": ee.System.os,
            "System-Version": ee.System.version,
            "Is-Mobile": ee.System.mobile,
          }),
        Ie(ye.file + "_internal", "setup", "info"),
        e &&
          (window.onerror = function (e, t, n, r, i) {
            (i && "object" == typeof i) || (i = {});
            var o = i.name || "Error",
              a = i.stack || "";
            Ue(Re)(a),
              -1 === a.indexOf("chrome-extension://") &&
                -1 === a.indexOf("safari-extension://") &&
                -1 === a.indexOf("moz-extension://") &&
                -1 === a.indexOf("chrome://internal-") &&
                -1 === a.indexOf("/hammerhead.js") &&
                -1 === a.indexOf("eval at buildCode") &&
                -1 === a.indexOf("u.c.b.r.o.w.s.e.r/ucbrowser_script.js") &&
                (Ie(e, "global", "debug", {
                  name: o,
                  url: t,
                  line: n,
                  column: r,
                  stack: a,
                }),
                Oe("global", i, { message: e }));
          });
    }
  }
  function Me(e, t, n, r) {
    if (((t = t || "error"), ve.sentry)) {
      var i = "warn" === t ? "warning" : t;
      window.Raven &&
        Raven.captureMessage(e, { level: i, logger: n, extra: r });
    }
  }
  function Oe(e, t, n) {
    return (
      ((n = n || {}).error = t),
      Me((t && t.message) || "Missing error message", "error", e, n)
    );
  }
  function Ie(e, t, n, r) {
    ve.sentry &&
      window.Raven &&
      Raven.captureBreadcrumb({ message: e, category: t, level: n, data: r });
  }
  function Ne() {
    var e = [],
      t = null,
      n = !1,
      r = [],
      i = function (t) {
        try {
          if (e.length >= 10) return;
          var n = t.stack;
          if ("string" != typeof n) return;
          var r = n.trim().split("\n");
          "Error" === r[0] && (r = r.slice(1));
          for (var i = /extension/, o = r.length; o--; ) {
            var a = r[o];
            if (i.test(a)) {
              r = [a];
              break;
            }
          }
          o < 0 && (r = r.slice(-2));
          var s = Se(r);
          s && -1 === e.indexOf(s) && e.push(s);
        } catch (t) {
          return;
        }
      },
      o = function () {
        if (n)
          try {
            for (var e = 0; e < r.length; e++) r[e]();
            null !== t && clearTimeout(t);
          } catch (o) {
            i(o);
          } finally {
            (r = []), (t = null), (n = !1);
          }
      },
      a = function (t, a) {
        var s = Object.getOwnPropertyDescriptor(t, a);
        if (!(s && !1 === s.writable)) {
          var c = Object.prototype.hasOwnProperty.call(t, a),
            l = t[a];
          (t[a] = function () {
            return (
              n && (e.length >= 10 && o(), i(new Error())),
              l.apply(t, arguments)
            );
          }),
            r.push(function () {
              c ? (t[a] = l) : delete t[a];
            });
        }
      };
    return {
      run: function (e) {
        if (!n) {
          (n = !0),
            isFinite(e) &&
              (t = setTimeout(function () {
                o();
              }, e));
          try {
            a(document, "getElementsByClassName"),
              a(document, "getElementById"),
              a(document, "querySelector"),
              a(document, "querySelectorAll"),
              a(document, "getElementsByTagName"),
              a(console, "log");
          } catch (r) {
            o(), i(r);
          }
        }
      },
      collect: function () {
        return e.concat(xe);
      },
    };
  }
  var We = {
      getCookie: function (e) {
        var t = document.cookie.replace(/ /g, "").split(";");
        try {
          for (var n = "", r = t.length; r-- && !n; )
            t[r].indexOf(e) >= 0 && (n = t[r]);
          return n;
        } catch (Kn) {
          return "";
        }
      },
      hasCookie: function (e) {
        return !!We.getCookie(e);
      },
      supportsAPI: function () {
        try {
          return (
            "hasStorageAccess" in document && "requestStorageAccess" in document
          );
        } catch (Kn) {
          return !1;
        }
      },
      hasAccess: function () {
        return new Promise(function (e) {
          document
            .hasStorageAccess()
            .then(function () {
              e(!0);
            })
            ["catch"](function () {
              e(!1);
            });
        });
      },
      requestAccess: function () {
        try {
          return document.requestStorageAccess();
        } catch (Kn) {
          return Promise.resolve();
        }
      },
    },
    Pe = {
      array: function (e) {
        if (0 === e.length) return e;
        for (var t, n, r = e.length; --r > -1; )
          (n = Math.floor(Math.random() * (r + 1))),
            (t = e[r]),
            (e[r] = e[n]),
            (e[n] = t);
        return e;
      },
    };
  function Ae(e) {
    (this.r = 255),
      (this.g = 255),
      (this.b = 255),
      (this.a = 1),
      (this.h = 1),
      (this.s = 1),
      (this.l = 1),
      this.parseString(e);
  }
  function Ge(e, t, n) {
    return (
      n < 0 && (n += 1),
      n > 1 && (n -= 1),
      n < 1 / 6
        ? e + 6 * (t - e) * n
        : n < 0.5
        ? t
        : n < 2 / 3
        ? e + (t - e) * (2 / 3 - n) * 6
        : e
    );
  }
  (Ae.hasAlpha = function (e) {
    return (
      "string" == typeof e &&
      (-1 !== e.indexOf("rgba") || (9 === e.length && "#" === e[0]))
    );
  }),
    (Ae.prototype.parseString = function (e) {
      e &&
        (0 === e.indexOf("#")
          ? this.fromHex(e)
          : 0 === e.indexOf("rgb") && this.fromRGBA(e));
    }),
    (Ae.prototype.fromHex = function (e) {
      var t = 1;
      9 === e.length && (t = parseInt(e.substr(7, 2), 16) / 255);
      var n = (e = e.substr(1, 6)).replace(
          /^([a-f\d])([a-f\d])([a-f\d])?$/i,
          function (e, t, n, r) {
            return t + t + n + n + r + r;
          }
        ),
        r = parseInt(n, 16),
        i = r >> 16,
        o = (r >> 8) & 255,
        a = 255 & r;
      this.setRGBA(i, o, a, t);
    }),
    (Ae.prototype.fromRGBA = function (e) {
      var t = e.indexOf("rgba"),
        n = e
          .substr(t)
          .replace(/rgba?\(/, "")
          .replace(/\)/, "")
          .replace(/[\s+]/g, "")
          .split(","),
        r = Math.floor(parseInt(n[0])),
        i = Math.floor(parseInt(n[1])),
        o = Math.floor(parseInt(n[2])),
        a = parseFloat(n[3]);
      this.setRGBA(r, i, o, a);
    }),
    (Ae.prototype.setRGB = function (e, t, n) {
      this.setRGBA(e, t, n, 1);
    }),
    (Ae.prototype.setRGBA = function (e, t, n, r) {
      (this.r = e),
        (this.g = t),
        (this.b = n),
        (this.a = isNaN(r) ? this.a : r),
        this.updateHSL();
    }),
    (Ae.prototype.hsl2rgb = function (e, t, n) {
      if (0 === t) {
        var r = Math.round(255 * n);
        return this.setRGB(r, r, r), this;
      }
      var i = n <= 0.5 ? n * (1 + t) : n + t - n * t,
        o = 2 * n - i;
      return (
        (this.r = Math.round(255 * Ge(o, i, e + 1 / 3))),
        (this.g = Math.round(255 * Ge(o, i, e))),
        (this.b = Math.round(255 * Ge(o, i, e - 1 / 3))),
        (this.h = e),
        (this.s = t),
        (this.l = n),
        this
      );
    }),
    (Ae.prototype.updateHSL = function () {
      var e,
        t = this.r / 255,
        n = this.g / 255,
        r = this.b / 255,
        i = Math.max(t, n, r),
        o = Math.min(t, n, r),
        a = null,
        s = (i + o) / 2;
      if (i === o) a = e = 0;
      else {
        var c = i - o;
        switch (((e = s > 0.5 ? c / (2 - i - o) : c / (i + o)), i)) {
          case t:
            a = (n - r) / c + (n < r ? 6 : 0);
            break;
          case n:
            a = (r - t) / c + 2;
            break;
          case r:
            a = (t - n) / c + 4;
        }
        a /= 6;
      }
      return (this.h = a), (this.s = e), (this.l = s), this;
    }),
    (Ae.prototype.getHex = function () {
      return (
        "#" +
        ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b)
          .toString(16)
          .slice(1)
      );
    }),
    (Ae.prototype.getRGBA = function () {
      return (
        "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")"
      );
    }),
    (Ae.prototype.clone = function () {
      var e = new Ae();
      return e.setRGBA(this.r, this.g, this.b, this.a), e;
    }),
    (Ae.prototype.mix = function (e, t) {
      e instanceof Ae || (e = new Ae(e));
      var n = new Ae(),
        r = Math.round(this.r + t * (e.r - this.r)),
        i = Math.round(this.g + t * (e.g - this.g)),
        o = Math.round(this.b + t * (e.b - this.b));
      return n.setRGB(r, i, o), n;
    }),
    (Ae.prototype.blend = function (e, t) {
      var n;
      e instanceof Ae || (e = new Ae(e));
      for (var r = [], i = 0; i < t; i++)
        (n = this.mix.call(this, e, i / t)), r.push(n);
      return r;
    }),
    (Ae.prototype.lightness = function (e) {
      return e > 1 && (e /= 100), this.hsl2rgb(this.h, this.s, e), this;
    }),
    (Ae.prototype.saturation = function (e) {
      return e > 1 && (e /= 100), this.hsl2rgb(this.h, e, this.l), this;
    }),
    (Ae.prototype.hue = function (e) {
      return this.hsl2rgb(e / 360, this.s, this.l), this;
    });
  var Fe = {
      decode: function (e) {
        try {
          var t = e.split(".");
          return {
            header: JSON.parse(atob(t[0])),
            payload: JSON.parse(atob(t[1])),
            signature: atob(t[2].replace(/_/g, "/").replace(/-/g, "+")),
            raw: { header: t[0], payload: t[1], signature: t[2] },
          };
        } catch (Kn) {
          throw new Error("Token is invalid.");
        }
      },
      checkExpiration: function (e) {
        if (new Date(1e3 * e) <= new Date(Date.now()))
          throw new Error("Token is expired.");
        return !0;
      },
    },
    je = {
      _setup: !1,
      _af: null,
      _fps: 60,
      _singleFrame: 1 / 60,
      _lagThreshold: 500,
      _adjustedLag: (1 / 60) * 2,
      _startTime: 0,
      _lastTime: 0,
      _nextTime: 1 / 60,
      _elapsed: 0,
      _difference: 0,
      _renders: [],
      _paused: !1,
      _running: !1,
      _tick: !1,
      frame: 0,
      time: 0,
      requestFrame: null,
      cancelFrame: null,
      _init: function () {
        for (
          var e,
            t = window.requestAnimationFrame,
            n = window.cancelAnimationFrame,
            r = ["ms", "moz", "webkit", "o"],
            i = r.length;
          --i > -1 && !t;

        )
          (t = window[r[i] + "RequestAnimationFrame"]),
            (n =
              window[r[i] + "CancelAnimationFrame"] ||
              window[r[i] + "CancelRequestAnimationFrame"]);
        t
          ? ((je.requestFrame = t.bind(window)),
            (je.cancelFrame = n.bind(window)))
          : ((je.requestFrame =
              ((e = Date.now()),
              function (t) {
                window.setTimeout(function () {
                  t(Date.now() - e);
                }, 1e3 * je._singleFrame);
              })),
            (je.cancelFrame = function (e) {
              return clearTimeout(e), null;
            })),
          (je._setup = !0),
          (je._startTime = je._lastTime = Date.now());
      },
      add: function (e, t) {
        je._renders.push({ callback: e, paused: !1 == !t || !1 }),
          !1 == !t && je.start();
      },
      remove: function (e) {
        for (var t = je._renders.length; --t > -1; )
          je._renders[t].callback === e &&
            ((je._renders[t].paused = !0), je._renders.splice(t, 1));
      },
      start: function (e) {
        if ((!1 === je._setup && je._init(), e))
          for (var t = je._renders.length; --t > -1; )
            je._renders[t].callback === e && (je._renders[t].paused = !1);
        !0 !== je._running &&
          ((je._paused = !1),
          (je._running = !0),
          (je._af = je.requestFrame(je._update)));
      },
      stop: function (e) {
        if (e)
          for (var t = je._renders.length; --t > -1; )
            je._renders[t].callback === e && (je._renders[t].paused = !0);
        else
          !1 !== je._running &&
            ((je._af = je.cancelFrame(je._af)),
            (je._paused = !0),
            (je._running = !1));
      },
      elapsed: function () {
        return Date.now() - je._startTime;
      },
      fps: function (e) {
        return arguments.length
          ? ((je._fps = e),
            (je._singleFrame = 1 / (je._fps || 60)),
            (je._adjustedLag = 2 * je._singleFrame),
            (je._nextTime = je.time + je._singleFrame),
            je._fps)
          : je._fps;
      },
      isRunning: function () {
        return je._running;
      },
      _update: function () {
        if (
          !je._paused &&
          ((je._elapsed = Date.now() - je._lastTime),
          (je._tick = !1),
          je._elapsed > je._lagThreshold &&
            (je._startTime += je._elapsed - je._adjustedLag),
          (je._lastTime += je._elapsed),
          (je.time = (je._lastTime - je._startTime) / 1e3),
          (je._difference = je.time - je._nextTime),
          je._difference > 0 &&
            (je.frame++,
            (je._nextTime +=
              je._difference +
              (je._difference >= je._singleFrame
                ? je._singleFrame / 4
                : je._singleFrame - je._difference)),
            (je._tick = !0)),
          (je._af = je.requestFrame(je._update)),
          !0 === je._tick && je._renders.length > 0)
        )
          for (var e = je._renders.length; --e > -1; )
            je._renders[e] &&
              !1 === je._renders[e].paused &&
              je._renders[e].callback(je.time);
      },
    };
  var Be = function (e) {
      for (
        var t,
          n,
          r,
          i = {},
          o = e ? (e.indexOf("&") >= 0 ? e.split("&") : [e]) : [],
          a = 0;
        a < o.length;
        a++
      )
        if (o[a].indexOf("=") >= 0) {
          if (
            ((t = o[a].split("=")),
            (n = decodeURIComponent(t[0])),
            ("false" !== (r = decodeURIComponent(t[1])) && "true" !== r) ||
              (r = "true" === r),
            "theme" === n || "themeConfig" === n)
          )
            try {
              r = JSON.parse(r);
            } catch (Kn) {}
          i[n] = r;
        }
      return i;
    },
    Ze = function (e) {
      var t = [];
      for (var n in e) {
        var r = e[n];
        (r = "object" == typeof r ? JSON.stringify(r) : r),
          t.push([encodeURIComponent(n), encodeURIComponent(r)].join("="));
      }
      return t.join("&");
    },
    De = { __proto__: null, Decode: Be, Encode: Ze };
  function He(e, t, n) {
    return Math.min(Math.max(e, t), n);
  }
  var Je = {
    __proto__: null,
    clamp: He,
    range: function (e, t, n, r, i, o) {
      var a = ((e - t) * (i - r)) / (n - t) + r;
      return !1 === o ? a : He(a, Math.min(r, i), Math.max(r, i));
    },
    toRadians: function (e) {
      return e * (Math.PI / 180);
    },
    toDegrees: function (e) {
      return (180 * e) / Math.PI;
    },
  };
  function Ke(e, t) {
    (this._period = e),
      (this._interval = t),
      (this._date = []),
      (this._data = []),
      (this._prevTimestamp = 0),
      (this._meanPeriod = 0),
      (this._medianPeriod = 0),
      (this._medianMaxHeapSize = 32),
      (this._medianMinHeap = []),
      (this._medianMaxHeap = []),
      (this._meanCounter = 0);
  }
  function ze(e) {
    var t = [].slice.call(arguments, 1);
    "string" == typeof e
      ? window[e]
        ? "function" == typeof window[e]
          ? window[e].apply(null, t)
          : console.log("[hCaptcha] Callback '" + e + "' is not a function.")
        : console.log("[hCaptcha] Callback '" + e + "' is not defined.")
      : "function" == typeof e
      ? e.apply(null, t)
      : console.log("[hcaptcha] Invalid callback '" + e + "'.");
  }
  function Le() {
    try {
      ze.apply(null, arguments);
    } catch (Jn) {
      console.error("[hCaptcha] There was an error in your callback."),
        console.error(Jn);
    }
  }
  function Qe(e, t) {
    for (
      var n = [
          "hl",
          "custom",
          "tplinks",
          "sitekey",
          "theme",
          "type",
          "size",
          "tabindex",
          "callback",
          "expired-callback",
          "chalexpired-callback",
          "error-callback",
          "open-callback",
          "close-callback",
          "endpoint",
          "challenge-container",
          "confirm-nav",
          "orientation",
          "mode",
        ],
        r = {},
        i = 0;
      i < n.length;
      i++
    ) {
      var o = n[i],
        a = t && t[o];
      a || (a = e.getAttribute("data-" + o)), a && (r[o] = a);
    }
    return r;
  }
  (Ke.prototype.getMeanPeriod = function () {
    return this._meanPeriod;
  }),
    (Ke.prototype.getMedianPeriod = function () {
      return this._medianPeriod;
    }),
    (Ke.prototype.getData = function () {
      return this._cleanStaleData(), this._data;
    }),
    (Ke.prototype.getSize = function () {
      return this._cleanStaleData(), this._data.length;
    }),
    (Ke.prototype.getCapacity = function () {
      return 0 === this._period
        ? this._interval
        : Math.ceil(this._interval / this._period);
    }),
    (Ke.prototype.push = function (e, t) {
      this._cleanStaleData();
      var n = 0 === this._date.length;
      if (
        (e - (this._date[this._date.length - 1] || 0) >= this._period &&
          (this._date.push(e), this._data.push(t)),
        !n)
      ) {
        var r = e - this._prevTimestamp;
        (this._meanPeriod =
          (this._meanPeriod * this._meanCounter + r) / (this._meanCounter + 1)),
          this._meanCounter++,
          (this._medianPeriod = this._calculateMedianPeriod(r));
      }
      this._prevTimestamp = e;
    }),
    (Ke.prototype._calculateMedianPeriod = function (e) {
      this._medianMaxHeap || (this._medianMaxHeap = []),
        this._medianMinHeap || (this._medianMinHeap = []);
      var t = this._fetchMedianPeriod();
      return (
        0 === this._medianMaxHeap.length && 0 === this._medianMinHeap.length
          ? this._medianMaxHeap.push(e)
          : e <= t
          ? (this._medianMaxHeap.push(e),
            this._medianMaxHeap.sort(function (e, t) {
              return t - e;
            }))
          : (this._medianMinHeap.push(e),
            this._medianMinHeap.sort(function (e, t) {
              return e - t;
            })),
        this._rebalanceHeaps(),
        this._fetchMedianPeriod()
      );
    }),
    (Ke.prototype._rebalanceHeaps = function () {
      var e = null;
      this._medianMaxHeap.length > this._medianMinHeap.length + 1
        ? ((e = this._medianMaxHeap.shift()),
          this._medianMinHeap.push(e),
          this._medianMinHeap.sort(function (e, t) {
            return e - t;
          }))
        : this._medianMinHeap.length > this._medianMaxHeap.length + 1 &&
          ((e = this._medianMinHeap.shift()),
          this._medianMaxHeap.push(e),
          this._medianMaxHeap.sort(function (e, t) {
            return t - e;
          })),
        this._medianMinHeap.length == this._medianMaxHeap.length &&
          this._medianMaxHeap.length > this._medianMaxHeapSize &&
          (this._medianMinHeap.pop(), this._medianMaxHeap.pop());
    }),
    (Ke.prototype._fetchMedianPeriod = function () {
      return this._medianMaxHeap.length > this._medianMinHeap.length
        ? this._medianMaxHeap[0]
        : this._medianMinHeap.length > this._medianMaxHeap.length
        ? this._medianMinHeap[0]
        : 0 !== this._medianMaxHeap.length && 0 !== this._medianMinHeap.length
        ? (this._medianMaxHeap[0] + this._medianMinHeap[0]) / 2
        : -1;
    }),
    (Ke.prototype._cleanStaleData = function () {
      for (var e = Date.now(), t = this._date.length - 1; t >= 0; t--) {
        if (e - this._date[t] >= this._interval) {
          this._date.splice(0, t + 1), this._data.splice(0, t + 1);
          break;
        }
      }
    });
  var $e,
    Ye = {
      UUID: function (e) {
        return (
          /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(
            e
          ) || !1
        );
      },
      UUIDv4: function (e) {
        return (
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            e
          ) || !1
        );
      },
      URL: function (e) {
        var t = new RegExp("^(http|https)://"),
          n = new RegExp("^((?!(data|javascript):).)*$");
        return t.test(e) && n.test(e) && -1 === e.indexOf("#");
      },
      IMAGE: function (e) {
        return (
          (0 === e.indexOf("https://") || 0 === e.indexOf("/")) &&
          e.endsWith(".png")
        );
      },
    };
  function Xe(e) {
    return new Promise(function (t, n) {
      e(t, n, function r() {
        e(t, n, r);
      });
    });
  }
  function qe(e, t) {
    var n = "attempts" in (t = t || {}) ? t.attempts : 1,
      r = t.delay || 0,
      i = t.onFail;
    return Xe(function (t, o, a) {
      e().then(t, function (e) {
        var t = n-- > 0;
        if (i) {
          var s = i(e, n);
          s && ((t = !1 !== s.retry && t), (r = s.delay));
        }
        t ? setTimeout(a, r || 0) : o(e);
      });
    });
  }
  function et(e) {
    var t,
      n,
      r = "string" == typeof e ? e : JSON.stringify(e),
      i = -1;
    for (
      $e =
        $e ||
        (function () {
          var e,
            t,
            n,
            r = [];
          for (t = 0; t < 256; t++) {
            for (e = t, n = 0; n < 8; n++)
              e = 1 & e ? 3988292384 ^ (e >>> 1) : e >>> 1;
            r[t] = e;
          }
          return r;
        })(),
        t = 0,
        n = r.length;
      t < n;
      t += 1
    )
      i = (i >>> 8) ^ $e[255 & (i ^ r.charCodeAt(t))];
    return (-1 ^ i) >>> 0;
  }
  var tt = {
      __proto__: null,
      createErrorsAggregator: Ne,
      uuid: function () {
        return Math.random().toString(36).substr(2);
      },
      Render: je,
      JWT: Fe,
      Color: Ae,
      Shuffle: Pe,
      MathUtil: Je,
      Storage: We,
      Query: De,
      TimeBuffer: Ke,
      _stackTraceSet: xe,
      toRefinedString: Se,
      reportError: Te,
      errorWrapper: Ue,
      initSentry: Ce,
      sentryMessage: Me,
      sentryError: Oe,
      sentryBreadcrumb: Ie,
      renderFallback: ke,
      forEachCaptchaNode: Ve,
      callUserFunction: Le,
      composeParams: Qe,
      is: Ye,
      promiseRecursive: Xe,
      promiseRetry: qe,
      crc32: et,
      TaskContext: {
        container: {},
        set: function (e, t) {
          this.container[e] = t;
        },
        clear: function () {
          this.container = {};
        },
      },
    },
    nt = {
      eventName: function (e, t) {
        var n = e;
        "down" === e ||
        "up" === e ||
        "move" === e ||
        "over" === e ||
        "out" === e
          ? (n =
              !((ee.System.mobile && "desktop" !== t) || "mobile" === t) ||
              ("down" !== e && "up" !== e && "move" !== e)
                ? "mouse" + e
                : "down" === e
                ? "touchstart"
                : "up" === e
                ? "touchend"
                : "touchmove")
          : "enter" === e && (n = "keydown");
        return n;
      },
      actionName: function (e) {
        var t = e;
        return (
          "touchstart" === t || "mousedown" === t
            ? (t = "down")
            : "touchmove" === t || "mousemove" === t
            ? (t = "move")
            : "touchend" === t || "mouseup" === t
            ? (t = "up")
            : "mouseover" === t
            ? (t = "over")
            : "mouseout" === t && (t = "out"),
          t
        );
      },
      eventCallback: function (e, t, n) {
        var r = nt.actionName(e);
        return function (i) {
          if (
            ((i = i || window.event),
            "down" === r ||
              "move" === r ||
              "up" === r ||
              "over" === r ||
              "out" === r ||
              "click" === r)
          ) {
            var o = nt.eventCoords(i);
            if (!o) return;
            var a = n.getBoundingClientRect();
            (i.windowX = o.x),
              (i.windowY = o.y),
              (i.elementX = i.windowX - (a.x || a.left)),
              (i.elementY = i.windowY - (a.y || a.top));
          }
          (i.keyNum = i.which || i.keyCode || 0),
            ("enter" === e && 13 !== i.keyNum && 32 !== i.keyNum) ||
              ((i.action = r), (i.targetElement = n), t(i));
        };
      },
      eventCoords: function (e) {
        if (!e) return null;
        var t = e;
        if (e.touches || e.changedTouches) {
          var n =
            e.touches && e.touches.length >= 1 ? e.touches : e.changedTouches;
          n && n[0] && (t = n[0]);
        }
        return "number" == typeof t.pageX && "number" == typeof t.pageY
          ? { x: t.pageX, y: t.pageY }
          : "number" == typeof t.clientX && "number" == typeof t.clientY
          ? { x: t.clientX, y: t.clientY }
          : null;
      },
    },
    rt = ["Webkit", "Moz", "ms"],
    it = document.createElement("div").style,
    ot = {};
  function at(e) {
    var t = ot[e];
    return (
      t ||
      (e in it
        ? e
        : (ot[e] =
            (function (e) {
              for (
                var t = e[0].toUpperCase() + e.slice(1), n = rt.length;
                n--;

              )
                if ((e = rt[n] + t) in it) return e;
            })(e) || e))
    );
  }
  function st(e, t, n) {
    if (
      ((this.dom = null),
      (this._clss = []),
      (this._nodes = []),
      (this._listeners = []),
      (this._frag = null),
      e && "object" == typeof e)
    ) {
      this.dom = e;
      var r = [],
        i = [];
      "string" == typeof e.className && (i = e.className.split(" "));
      for (var o = 0; o < i.length; o++)
        "" !== i[o] && " " !== i[o] && r.push(i[o]);
      this._clss = r;
    } else
      (n !== undefined && null !== n) || (n = !0),
        (!e ||
          ("string" == typeof e &&
            (e.indexOf("#") >= 0 || e.indexOf(".") >= 0))) &&
          (e && (t = e), (e = "div")),
        (this.dom = document.createElement(e)),
        t &&
          (t.indexOf("#") >= 0
            ? (this.dom.id = t.split("#")[1])
            : (t.indexOf(".") >= 0 && (t = t.split(".")[1]),
              this.addClass.call(this, t)));
    !0 === n &&
      ((this._frag = document.createDocumentFragment()),
      this._frag.appendChild(this.dom));
  }
  function ct(e) {
    if (null === e) return "";
    var t = [];
    return lt(e, t), t.join("&");
  }
  function lt(e, t) {
    var n, r;
    if ("object" == typeof e)
      for (r in e) !0 === ht((n = e[r])) ? lt(n, t) : (t[t.length] = ut(r, n));
    else if (!0 === Array.isArray(e))
      for (var i = 0; i < e.length; i++)
        !0 === ht((n = e[i])) ? lt(e, t) : (t[t.length] = ut(r, n));
    else t[t.length] = ut(e);
  }
  function ht(e) {
    return !0 === Array.isArray(e) || "object" == typeof e;
  }
  function ut(e, t) {
    return (
      encodeURIComponent(e) + "=" + encodeURIComponent(null === t ? "" : t)
    );
  }
  (st.prototype.cloneNode = function (e) {
    try {
      return this.dom.cloneNode(e);
    } catch (Kn) {
      return Oe("element", Kn), null;
    }
  }),
    (st.prototype.createElement = function (e, t) {
      try {
        var n = new st(e, t, !1);
        return this.appendElement.call(this, n), this._nodes.push(n), n;
      } catch (Kn) {
        return Oe("element", Kn), null;
      }
    }),
    (st.prototype.appendElement = function (e) {
      if (e === undefined)
        return Te({
          name: "DomElement Add Child",
          message: "Child Element is undefined",
        });
      var t;
      t =
        e._frag !== undefined && null !== e._frag
          ? e._frag
          : e.dom !== undefined
          ? e.dom
          : e;
      try {
        e instanceof st && (e._parent = this), this.dom.appendChild(t);
      } catch (Kn) {
        Te({
          name: "DomElement Add Child",
          message: "Failed to append child.",
        });
      }
      return this;
    }),
    (st.prototype.removeElement = function (e) {
      try {
        var t;
        if (e._nodes)
          for (t = e._nodes.length; t--; ) e.removeElement(e._nodes[t]);
        for (t = this._nodes.length; --t > -1; )
          this._nodes[t] === e && this._nodes.splice(t, 1);
        var n = e instanceof st ? e.dom : e,
          r = n.parentNode === this.dom ? this.dom : n.parentNode;
        if ((r.removeChild && r.removeChild(n), !r))
          throw new Error("Child component does not have correct setup");
        e.__destroy && e.__destroy();
      } catch (Kn) {
        Te({
          name: "DomElement Remove Child",
          message: Kn.message || "Failed to remove child.",
        });
      }
    }),
    (st.prototype.addClass = function (e) {
      return (
        !1 === this.hasClass.call(this, e) &&
          (this._clss.push(e), (this.dom.className = this._clss.join(" "))),
        this
      );
    }),
    (st.prototype.hasClass = function (e) {
      for (
        var t = -1 !== this.dom.className.split(" ").indexOf(e),
          n = this._clss.length;
        n-- && !t;

      )
        t = this._clss[n] === e;
      return t;
    }),
    (st.prototype.removeClass = function (e) {
      for (var t = this._clss.length; --t > -1; )
        this._clss[t] === e && this._clss.splice(t, 1);
      return (this.dom.className = this._clss.join(" ")), this;
    }),
    (st.prototype.text = function (e) {
      if (this && this.dom) {
        if (!e) return this.dom.textContent;
        for (
          var t, n, r, i, o = /&(.*?);/g, a = /<[a-z][\s\S]*>/i;
          null !== (t = o.exec(e));

        ) {
          !1 === a.test(t[0])
            ? ((r = t[0]),
              (i = void 0),
              ((i = document.createElement("div")).innerHTML = r),
              (n = i.textContent),
              (e = e.replace(new RegExp(t[0], "g"), n)))
            : (e = e.replace(t[0], ""));
        }
        return (this.dom.textContent = e), this;
      }
    }),
    (st.prototype.content = st.prototype.text),
    (st.prototype.css = function (e) {
      var t,
        n = "ie" === ee.Browser.type && 8 === ee.Browser.version,
        r =
          "safari" === ee.Browser.type && 12 === Math.floor(ee.Browser.version);
      for (var i in e) {
        t = e[i];
        try {
          if ("transition" === i && r) continue;
          "opacity" !== i &&
            "zIndex" !== i &&
            "fontWeight" !== i &&
            isFinite(t) &&
            parseFloat(t) === t &&
            (t += "px");
          var o = at(i);
          n && "opacity" === i
            ? (this.dom.style.filter = "alpha(opacity=" + 100 * t + ")")
            : n && Ae.hasAlpha(t)
            ? (this.dom.style[o] = new Ae(t).getHex())
            : (this.dom.style[o] = t);
        } catch (Jn) {}
      }
      return this;
    }),
    (st.prototype.backgroundImage = function (e, t, n, r) {
      var i = t !== undefined && n !== undefined,
        o = { "-ms-high-contrast-adjust": "none" };
      if (("object" == typeof t && (r = t), r === undefined && (r = {}), i)) {
        var a = e.width / e.height,
          s = t,
          c = s / a;
        r.cover && c < n && (s = (c = n) * a),
          r.contain && c > n && (s = (c = n) * a),
          (o.width = s),
          (o.height = c),
          r.center &&
            ((o.marginLeft = -s / 2),
            (o.marginTop = -c / 2),
            (o.position = "absolute"),
            (o.left = "50%"),
            (o.top = "50%")),
          (r.left || r.right) && ((o.left = r.left || 0), (o.top = r.top || 0));
      }
      "ie" === ee.Browser.type && 8 === ee.Browser.version
        ? (o.filter =
            "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
            e.src +
            "',sizingMethod='scale')")
        : ((o.background = "url(" + e.src + ")"),
          (o.backgroundPosition = "50% 50%"),
          (o.backgroundRepeat = "no-repeat"),
          (o.backgroundSize = i
            ? s + "px " + c + "px"
            : r.cover
            ? "cover"
            : r.contain
            ? "contain"
            : "100%")),
        this.css.call(this, o);
    }),
    (st.prototype.setAttribute = function (e, t) {
      var n;
      if ("object" == typeof e)
        for (var r in e) (n = e[r]), this.dom.setAttribute(r, n);
      else this.dom.setAttribute(e, t);
    }),
    (st.prototype.removeAttribute = function (e, t) {
      var n;
      if ("object" == typeof e)
        for (var r in e) (n = e[r]), this.dom.removeAttribute(r, n);
      else this.dom.removeAttribute(e, t);
    }),
    (st.prototype.addEventListener = function (e, t, n) {
      var r = {
        event: nt.eventName(e),
        handler: nt.eventCallback(e, t, this.dom),
        callback: t,
      };
      if (
        (this._listeners.push(r),
        this.dom.addEventListener
          ? this.dom.addEventListener(r.event, r.handler, n)
          : this.dom.attachEvent("on" + r.event, r.handler),
        e !== r.event &&
          (r.event.indexOf("mouse") >= 0 || r.event.indexOf("touch") >= 0))
      ) {
        var i = r.event.indexOf("touch") >= 0 ? "desktop" : "mobile",
          o = nt.eventName(e, i);
        if (o === r.event) return;
        this.addEventListener.call(this, o, t, n);
      }
    }),
    (st.prototype.removeEventListener = function (e, t, n) {
      for (var r, i = this._listeners.length, o = nt.eventName(e); --i > -1; )
        (r = this._listeners[i]).event === o &&
          r.callback === t &&
          (this._listeners.splice(i, 1),
          this.dom.removeEventListener
            ? this.dom.removeEventListener(r.event, r.handler, n)
            : this.dom.detachEvent("on" + r.event, r.handler));
    }),
    (st.prototype.focus = function () {
      this.dom.focus();
    }),
    (st.prototype.blur = function () {
      this.dom.blur();
    }),
    (st.prototype.html = function (e) {
      return e && (this.dom.innerHTML = e), this.dom.innerHTML;
    }),
    (st.prototype.__destroy = function () {
      for (var e, t = this._listeners.length; --t > -1; )
        (e = this._listeners[t]),
          this._listeners.splice(t, 1),
          this.dom.removeEventListener
            ? this.dom.removeEventListener(e.event, e.handler)
            : this.dom.detachEvent("on" + e.event, e.handler);
      return (
        (this.dom = null),
        (this._clss = []),
        (this._nodes = []),
        (this._listeners = []),
        (this._frag = null),
        (e = null),
        null
      );
    }),
    (st.prototype.isConnected = function () {
      return (
        !!this.dom &&
        ("isConnected" in this.dom
          ? this.dom.isConnected
          : !(
              this.dom.ownerDocument &&
              this.dom.ownerDocument.compareDocumentPosition(this.dom) &
                this.dom.DOCUMENT_POSITION_DISCONNECTED
            ))
      );
    });
  var dt = {
      af: "Afrikaans",
      sq: "Albanian",
      am: "Amharic",
      ar: "Arabic",
      hy: "Armenian",
      az: "Azerbaijani",
      eu: "Basque",
      be: "Belarusian",
      bn: "Bengali",
      bg: "Bulgarian",
      bs: "Bosnian",
      my: "Burmese",
      ca: "Catalan",
      ceb: "Cebuano",
      zh: "Chinese",
      "zh-CN": "Chinese Simplified",
      "zh-TW": "Chinese Traditional",
      co: "Corsican",
      hr: "Croatian",
      cs: "Czech",
      da: "Danish",
      nl: "Dutch",
      en: "English",
      eo: "Esperanto",
      et: "Estonian",
      fi: "Finnish",
      fr: "French",
      fy: "Frisian",
      gd: "Gaelic",
      gl: "Galacian",
      ka: "Georgian",
      de: "German",
      el: "Greek",
      gu: "Gujurati",
      ht: "Haitian",
      ha: "Hausa",
      haw: "Hawaiian",
      he: "Hebrew",
      hi: "Hindi",
      hmn: "Hmong",
      hu: "Hungarian",
      is: "Icelandic",
      ig: "Igbo",
      id: "Indonesian",
      ga: "Irish",
      it: "Italian",
      ja: "Japanese",
      jw: "Javanese",
      kn: "Kannada",
      kk: "Kazakh",
      km: "Khmer",
      rw: "Kinyarwanda",
      ky: "Kirghiz",
      ko: "Korean",
      ku: "Kurdish",
      lo: "Lao",
      la: "Latin",
      lv: "Latvian",
      lt: "Lithuanian",
      lb: "Luxembourgish",
      mk: "Macedonian",
      mg: "Malagasy",
      ms: "Malay",
      ml: "Malayalam",
      mt: "Maltese",
      mi: "Maori",
      mr: "Marathi",
      mn: "Mongolian",
      ne: "Nepali",
      no: "Norwegian",
      ny: "Nyanja",
      or: "Oriya",
      fa: "Persian",
      pl: "Polish",
      "pt-BR": "Portuguese (Brazil)",
      pt: "Portuguese (Portugal)",
      ps: "Pashto",
      pa: "Punjabi",
      ro: "Romanian",
      ru: "Russian",
      sm: "Samoan",
      sn: "Shona",
      sd: "Sindhi",
      si: "Singhalese",
      sr: "Serbian",
      sk: "Slovak",
      sl: "Slovenian",
      so: "Somani",
      st: "Southern Sotho",
      es: "Spanish",
      su: "Sundanese",
      sw: "Swahili",
      sv: "Swedish",
      tl: "Tagalog",
      tg: "Tajik",
      ta: "Tamil",
      tt: "Tatar",
      te: "Teluga",
      th: "Thai",
      tr: "Turkish",
      tk: "Turkmen",
      ug: "Uyghur",
      uk: "Ukrainian",
      ur: "Urdu",
      uz: "Uzbek",
      vi: "Vietnamese",
      cy: "Welsh",
      xh: "Xhosa",
      yi: "Yiddish",
      yo: "Yoruba",
      zu: "Zulu",
    },
    pt = {
      zh: { "I am human": "我是人" },
      ar: { "I am human": "أنا الإنسان" },
      af: { "I am human": "Ek is menslike" },
      am: { "I am human": "እኔ ሰው ነኝ" },
      hy: { "I am human": "Ես մարդ եմ" },
      az: { "I am human": "Mən insanam" },
      eu: { "I am human": "Gizakia naiz" },
      bn: { "I am human": "আমি মানব নই" },
      bg: { "I am human": "Аз съм човек" },
      ca: { "I am human": "Sóc humà" },
      hr: { "I am human": "Ja sam čovjek" },
      cs: { "I am human": "Jsem člověk" },
      da: { "I am human": "Jeg er et menneske" },
      nl: { "I am human": "Ik ben een mens" },
      et: { "I am human": "Ma olen inimeste" },
      fi: { "I am human": "Olen ihminen" },
      fr: { "I am human": "Je suis humain" },
      gl: { "I am human": "Eu son humano" },
      ka: { "I am human": "მე ვარ ადამიანი" },
      de: { "I am human": "Ich bin ein Mensch" },
      el: { "I am human": "Είμαι άνθρωπος" },
      gu: { "I am human": "હું માનવ છું" },
      iw: { "I am human": ". אני אנושי" },
      hi: { "I am human": "मैं मानव हूं" },
      hu: { "I am human": "Nem vagyok robot" },
      is: { "I am human": "Ég er manneskja" },
      id: { "I am human": "Aku manusia" },
      it: { "I am human": "Sono un essere umano" },
      ja: { "I am human": "私は人間です" },
      kn: { "I am human": "ನಾನು ಮಾನವನು" },
      ko: { "I am human": "사람입니다" },
      lo: { "I am human": "ຂ້ອຍເປັນມະນຸດ" },
      lv: { "I am human": "Es esmu cilvēks" },
      lt: { "I am human": "Aš esu žmogaus" },
      ms: { "I am human": "Saya manusia" },
      ml: { "I am human": "ഞാൻ മനുഷ്യനാണ്" },
      mr: { "I am human": "मी मानवी आहे" },
      mn: { "I am human": "Би бол хүн" },
      no: { "I am human": "Jeg er menneskelig" },
      fa: { "I am human": "من انسانی هستم" },
      pl: { "I am human": "Jestem człowiekiem" },
      pt: { "I am human": "Sou humano" },
      ro: { "I am human": "Eu sunt om" },
      ru: { "I am human": "Я человек" },
      sr: { "I am human": "Ja sam ljudski" },
      si: { "I am human": "මම මිනිස්සු" },
      sk: { "I am human": "Ja som človek" },
      sl: { "I am human": "Jaz sem človeški" },
      es: { "I am human": "Soy humano" },
      sw: { "I am human": "Mimi ni binadamu" },
      sv: { "I am human": "Jag är människa" },
      ta: { "I am human": "நான் மனித" },
      te: { "I am human": "నేను మనిషిని" },
      th: { "I am human": "ผมมนุษย์" },
      tr: { "I am human": "Ben bir insanım" },
      uk: { "I am human": "Я людини" },
      ur: { "I am human": "میں انسان ہوں" },
      vi: { "I am human": "Tôi là con người" },
      zu: { "I am human": "Ngingumuntu" },
    },
    ft = null,
    mt = {
      translate: function (e, t) {
        var n = mt.getBestTrans(pt),
          r = n && n[e];
        if (((r = r || e), t))
          for (var i = Object.keys(t), o = i.length; o--; )
            r = r.replace(new RegExp("{{" + i[o] + "}}", "g"), t[i[o]]);
        return r;
      },
      getBestTrans: function (e) {
        var t = mt.getLocale();
        return t in e
          ? e[t]
          : mt.getShortLocale(t) in e
          ? e[mt.getShortLocale(t)]
          : "en" in e
          ? e.en
          : null;
      },
      resolveLocale: function (e) {
        var t = mt.getShortLocale(e);
        return (
          "in" === t && (e = "id"),
          "iw" === t && (e = "he"),
          "nb" === t && (e = "no"),
          "ji" === t && (e = "yi"),
          "zh-CN" === e && (e = "zh"),
          "jv" === t && (e = "jw"),
          "me" === t && (e = "bs"),
          dt[e] ? e : dt[t] ? t : "en"
        );
      },
      getLocale: function () {
        return mt.resolveLocale(
          ft || window.navigator.userLanguage || window.navigator.language
        );
      },
      setLocale: function (e) {
        "zh-Hans" === e ? (e = "zh-CN") : "zh-Hant" === e && (e = "zh-TW"),
          (ft = e);
      },
      getShortLocale: function (e) {
        return e.indexOf("-") >= 0 ? e.substring(0, e.indexOf("-")) : e;
      },
      getLangName: function (e) {
        return dt[e];
      },
      isShortLocale: function (e) {
        return 2 === e.length || 3 === e.length;
      },
      addTable: function (e, t) {
        if ((t || (t = Object.create(null)), pt[e])) {
          var n = pt[e];
          for (var r in t) n[r] = t[r];
        } else pt[e] = t;
        return pt[e];
      },
      getTable: function (e) {
        return pt[e];
      },
      addTables: function (e) {
        for (var t in e) mt.addTable(t, e[t]);
        return pt;
      },
      getTables: function () {
        return pt;
      },
    },
    gt = {
      400: "Rate limited or network error. Please retry.",
      429: "Your computer or network has sent too many requests.",
      500: "Cannot contact hCaptcha. Check your connection and try again.",
    },
    yt = function (e) {
      try {
        return mt.translate(gt[e]);
      } catch (Kn) {
        return !1;
      }
    },
    vt =
      "undefined" != typeof XDomainRequest &&
      !("withCredentials" in XMLHttpRequest.prototype);
  function wt(e, t, n) {
    n = n || {};
    var r = {
      url: t,
      method: e.toUpperCase(),
      responseType: n.responseType || "string",
      dataType: n.dataType || null,
      withCredentials: n.withCredentials || !1,
      headers: n.headers || null,
      data: n.data || null,
      timeout: n.timeout || null,
      pst: n.pst || null,
    };
    r.legacy = r.withCredentials && vt;
    var i = "fetch" in window && r.pst ? _t : bt;
    return n.retry
      ? qe(function () {
          return (
            n.data &&
              ((r.data = "function" == typeof n.data ? n.data() : n.data),
              "json" === r.dataType && "object" == typeof r.data
                ? (r.data = JSON.stringify(r.data))
                : "query" === r.dataType && (r.data = ct(r.data))),
            i(r)
          );
        }, n.retry)
      : (n.data &&
          ((r.data = "function" == typeof n.data ? n.data() : n.data),
          "json" === r.dataType && "object" == typeof r.data
            ? (r.data = JSON.stringify(r.data))
            : "query" === r.dataType && (r.data = ct(r.data))),
        i(r));
  }
  function bt(e) {
    var t = e.legacy ? new XDomainRequest() : new XMLHttpRequest(),
      n = "function" == typeof e.url ? e.url() : e.url;
    return new Promise(function (r, i) {
      var o,
        a = function (o) {
          return function () {
            var a = t.response,
              s = t.statusText || "",
              c = t.status,
              l = t.readyState;
            if (
              (a ||
                ("" !== t.responseType && "text" !== t.responseType) ||
                (a = t.responseText),
              4 === l || e.legacy)
            ) {
              try {
                if (a) {
                  var h = t.contentType;
                  if (
                    (t.getResponseHeader &&
                      (h = t.getResponseHeader("content-type")),
                    "ArrayBuffer" in window &&
                      a instanceof ArrayBuffer &&
                      h &&
                      -1 !== h.toLowerCase().indexOf("application/json") &&
                      (a = new TextDecoder().decode(new Uint8Array(a))),
                    "string" == typeof a)
                  )
                    try {
                      a = JSON.parse(a);
                    } catch (u) {
                      Oe("http", u, {
                        url: n,
                        config: e,
                        responseType: t.responseType,
                        contentType: h,
                        response: a,
                      });
                    }
                }
              } catch (u) {
                return (
                  Oe("http", u, { contentType: h }),
                  void i({
                    event: ce,
                    endpoint: n,
                    response: a,
                    state: l,
                    status: c,
                    message: yt(c || 400) || s,
                  })
                );
              }
              if ("error" === o || (c >= 400 && c <= 511))
                return void i({
                  event: ce,
                  endpoint: n,
                  response: a,
                  state: l,
                  status: c,
                  message: (409 === c && a.error) || yt(c || 400) || s,
                });
              r({ state: l, status: c, body: a, message: s });
            }
          };
        };
      if (
        ((t.onload = a("complete")),
        (t.onerror = t.ontimeout = a("error")),
        t.open(e.method, n),
        "arraybuffer" === e.responseType &&
          (!e.legacy && "TextDecoder" in window && "ArrayBuffer" in window
            ? (t.responseType = "arraybuffer")
            : ((e.responseType = "json"),
              (e.headers.accept = "application/json"))),
        e.timeout &&
          (t.timeout =
            "function" == typeof e.timeout ? e.timeout(n) : e.timeout),
        !e.legacy) &&
        ((t.withCredentials = e.withCredentials), e.headers)
      )
        for (var s in e.headers) (o = e.headers[s]), t.setRequestHeader(s, o);
      setTimeout(function () {
        t.send(e.data);
      }, 0);
    });
  }
  function _t(e) {
    var t,
      n = "function" == typeof e.url ? e.url() : e.url,
      r = new Headers();
    if (
      ("json" === e.responseType && r.set("content-type", "application/json"),
      e.headers)
    )
      for (var i in e.headers) (t = e.headers[i]), r.set(i, t);
    var o = {
      method: e.method,
      credentials: "include",
      body: e.data,
      headers: r,
    };
    if (e.pst) {
      var a = {};
      "token-request" === e.pst
        ? (a = { version: 1, operation: "token-request" })
        : "token-redemption" === e.pst
        ? (a = {
            version: 1,
            operation: "token-redemption",
            refreshPolicy: "refresh",
          })
        : "send-redemption-record" === e.pst &&
          (a = {
            version: 1,
            operation: "send-redemption-record",
            issuers: [ve.pstIssuer],
          }),
        (o.privateToken = a);
    }
    return new Promise(function (t, r) {
      fetch(n, o)
        .then(function (i) {
          return 200 !== i.status
            ? r({
                event: ce,
                endpoint: n,
                response: i,
                state: 4,
                status: i.status,
                message: yt(i.status || 400),
              })
            : ("arraybuffer" === e.responseType
                ? i.arrayBuffer()
                : "json" === e.responseType
                ? i.json()
                : i.text()
              ).then(function (e) {
                t({
                  state: 4,
                  status: i.status,
                  body: e,
                  message: yt(i.status || 400),
                });
              });
        })
        ["catch"](function (e) {
          r({
            event: ce,
            endpoint: n,
            response: e.error,
            state: 4,
            status: 400,
            message: yt(400),
          });
        });
    });
  }
  var kt = function (e, t) {
      if (
        ("object" == typeof e && t === undefined && (e = (t = e).url),
        null === e)
      )
        throw new Error("Url missing");
      return wt("GET", e, t);
    },
    Vt = ["svg", "gif", "png"];
  function Et(e, t) {
    t = t || {};
    var n,
      r = e;
    if (0 === r.indexOf("data:image"))
      for (var i = !1, o = Vt.length, a = -1; a++ < o && !i; )
        (i = r.indexOf(Vt[a]) >= 0) && (n = Vt[a]);
    else n = r.substr(r.lastIndexOf(".") + 1, r.length);
    !!(
      !document.createElementNS ||
      !document.createElementNS("http://www.w3.org/2000/svg", "svg")
        .createSVGRect
    ) &&
      t.fallback &&
      (t.fallback.indexOf(".") >= 0
        ? (n = (r = t.fallback).substr(r.lastIndexOf(".") + 1, r.length))
        : ((r = e.substr(0, e.indexOf(n)) + t.fallback), (n = t.fallback))),
      t.prefix && (r = t.prefix + "/" + r),
      (this.attribs = { crossOrigin: t.crossOrigin || null }),
      (this.id = r),
      (this.src = (function (e) {
        if (ve.assethost && 0 === e.indexOf(ye.assetDomain))
          return ve.assethost + e.replace(ye.assetDomain, "");
        if (ve.imghost && e.indexOf("imgs") >= 0) {
          var t =
            e.indexOf(".ai") >= 0
              ? e.indexOf(".ai") + 3
              : e.indexOf(".com") + 4;
          return ve.imghost + e.substr(t, e.length);
        }
        return e;
      })(r)),
      (this.ext = n),
      (this.width = 0),
      (this.height = 0),
      (this.aspect = 0),
      (this.loaded = !1),
      (this.error = !1),
      (this.element = null),
      (this.cb = { load: [], error: [] });
  }
  function xt(e, t, n) {
    for (var r = e[t], i = r.length, o = null; --i > -1; )
      (o = r[i]), r.splice(i, 1), o(n);
    "error" === t ? (e.load = []) : (e.error = []);
  }
  function St(e, t) {
    var n = e;
    t || (t = {}),
      t.prefix && (n = t.prefix + "/" + e),
      (this.attribs = {
        defer: t.defer || null,
        async: t.async || null,
        crossOrigin: t.crossOrigin || null,
        integrity: t.integrity || null,
      }),
      (this.id = n),
      (this.src = (function (e) {
        if (ve.assethost && 0 === e.indexOf(ye.assetDomain))
          return ve.assethost + e.replace(ye.assetDomain, "");
        return e;
      })(n)),
      (this.loaded = !1),
      (this.error = !1),
      (this.element = null),
      (this.cb = { load: [], error: [] });
  }
  function Rt(e, t, n) {
    for (var r = e[t], i = r.length, o = null; --i > -1; )
      (o = r[i]), r.splice(i, 1), o(n);
    "error" === t ? (e.load = []) : (e.error = []);
  }
  function Tt(e, t) {
    var n = e;
    t || (t = {}),
      t.prefix && (n = t.prefix + "/" + e),
      (this.responseType = t.responseType),
      (this.id = n),
      (this.src = (function (e) {
        if (ve.assethost && 0 === e.indexOf(ye.assetDomain))
          return ve.assethost + e.replace(ye.assetDomain, "");
        return e;
      })(n)),
      (this.loaded = !1),
      (this.error = !1),
      (this.cb = { load: [], error: [] }),
      (this.data = null);
  }
  function Ut(e, t, n) {
    for (var r = e[t], i = r.length, o = null; --i > -1; )
      (o = r[i]), r.splice(i, 1), o(n);
    "error" === t ? (e.load = []) : (e.error = []);
  }
  (Et.prototype.load = function () {
    return ("svg" === this.ext ? this._loadSvg() : this._loadImg())["catch"](
      function (e) {
        throw (Me("Asset failed", "error", "assets", { error: e }), e);
      }
    );
  }),
    (Et.prototype._loadSvg = function () {
      var e,
        t = this,
        n = this.src,
        r = this.id;
      if (0 === n.indexOf("data:image/svg+xml")) {
        var i = n.slice("data:image/svg+xml,".length);
        e = Promise.resolve(decodeURIComponent(i));
      } else
        e = kt(n).then(function (e) {
          return e.body;
        });
      return e
        .then(function (e) {
          var n = new DOMParser().parseFromString(
              e,
              "image/svg+xml"
            ).documentElement,
            r = parseInt(n.getAttribute("width")),
            i = parseInt(n.getAttribute("height"));
          return t._imgLoaded(n, r, i), t;
        })
        ["catch"](function (e) {
          t.error = !0;
          var n =
            (e && e.message ? e.message : e || "Loading Error") + ": " + r;
          throw (xt(t.cb, "error", n), n);
        });
    }),
    (Et.prototype._loadImg = function () {
      var e = this,
        t = this.attribs,
        n = this.src,
        r = this.id;
      return new Promise(function (i, o) {
        function a() {
          e.loaded ||
            (e._imgLoaded(s, s.width, s.height),
            (s.onload = s.onerror = null),
            i(e));
        }
        var s = new Image();
        t.crossOrigin && (s.crossOrigin = t.crossOrigin),
          (s.onerror = function () {
            (e.error = !0), (s.onload = s.onerror = null);
            var t = "Loading Error: " + r;
            xt(e.cb, "error", t), o(t);
          }),
          (s.onload = a),
          (s.src = n),
          s.complete && a();
      });
    }),
    (Et.prototype._imgLoaded = function (e, t, n) {
      (this.element = new st(e)),
        (this.width = t),
        (this.height = n),
        (this.aspect = t / n),
        (this.loaded = !0),
        xt(this.cb, "load", this);
    }),
    (Et.prototype.onload = function (e) {
      this.error || (this.loaded ? e(this) : this.cb.load.push(e));
    }),
    (Et.prototype.onerror = function (e) {
      (this.loaded && !this.error) ||
        (this.error ? e(this) : this.cb.error.push(e));
    }),
    (St.prototype.load = function () {
      var e = this,
        t = this.attribs,
        n = this.src,
        r = this.id;
      return new Promise(function (i, o) {
        var a = document.createElement("script");
        (e.element = a),
          (a.onerror = function () {
            (e.error = !0),
              (a.onload = a.onreadystatechange = a.onerror = null);
            var t = "Loading Error: " + r;
            Rt(e.cb, "error", t), o(t);
          }),
          (a.onload = a.onreadystatechange =
            function () {
              this.loaded ||
                (a.readyState &&
                  "loaded" !== a.readyState &&
                  "complete" !== a.readyState) ||
                ((e.loaded = !0),
                (a.onload = a.onreadystatechange = a.onerror = null),
                document.body.removeChild(a),
                Rt(e.cb, "load", e),
                i(e));
            }),
          (a.type = "text/javascript"),
          (a.src = n),
          t.crossOrigin && (a.crossorigin = t.crossOrigin),
          t.async && (a.async = !0),
          t.defer && (a.defer = !0),
          t.integrity && (a.integrity = t.integrity),
          document.body.appendChild(a),
          a.complete && a.onload();
      });
    }),
    (St.prototype.onload = function (e) {
      this.error || (this.loaded ? e(this) : this.cb.load.push(e));
    }),
    (St.prototype.onerror = function (e) {
      (this.loaded && !this.error) ||
        (this.error ? e(this) : this.cb.error.push(e));
    }),
    (Tt.prototype.load = function () {
      var e = this,
        t = this.src,
        n = this.id;
      return new Promise(function (r, i) {
        var o = {};
        "arraybuffer" === e.responseType
          ? (o.responseType = "arraybuffer")
          : t.indexOf("json") >= 0 && (o.responseType = "json"),
          kt(t, o)
            .then(function (t) {
              (e.loaded = !0), (e.data = t.body), Ut(e.cb, "load", e), r(e);
            })
            ["catch"](function (t) {
              e.error = !0;
              var r = (t && t.message ? t.message : "Loading Error") + ": " + n;
              Ut(e.cb, "error", r), i(r);
            });
      });
    }),
    (Tt.prototype.onload = function (e) {
      this.error || (this.loaded ? e(this) : this.cb.load.push(e));
    }),
    (Tt.prototype.onerror = function (e) {
      (this.loaded && !this.error) ||
        (this.error ? e(this) : this.cb.error.push(e));
    });
  var Ct = [],
    Mt = function (e, t) {
      var n = new Tt(e, t);
      return Ct.push(n), n.load();
    },
    Ot = function (e) {
      return new Promise(function (t, n) {
        for (var r = Ct.length, i = !1, o = null; --r > -1 && !i; )
          i =
            (o = Ct[r]).id === e ||
            -1 !== o.id.indexOf("/" === e[0] ? "" : "/" + e);
        if (!i) return t(null);
        o.onload(t), o.onerror(n);
      });
    },
    It = [],
    Nt = !1,
    Wt = !1;
  function Pt() {
    document.addEventListener
      ? (document.addEventListener("DOMContentLoaded", Gt),
        window.addEventListener("load", Gt))
      : (document.attachEvent("onreadystatechange", At),
        window.attachEvent("onload", Gt)),
      (Nt = !0);
  }
  function At() {
    ("interactive" !== document.readyState &&
      "loaded" !== document.readyState &&
      "complete" !== document.readyState) ||
      Gt();
  }
  function Gt() {
    if (!1 === Wt) {
      for (var e = 0; e < It.length; e++) It[e].fn.apply(null, It[e].args);
      It = [];
    }
    (Wt = !0),
      document.removeEventListener
        ? (document.removeEventListener("DOMContentLoaded", Gt),
          window.removeEventListener("load", Gt))
        : (document.detachEvent("onreadystatechange", At),
          window.detachEvent("onload", Gt));
  }
  new st(document);
  var Ft = new st(window),
    jt = {
      touchstart: "ts",
      touchend: "te",
      touchmove: "tm",
      touchcancel: "tc",
    },
    Bt = { mousedown: "md", mouseup: "mu", mousemove: "mm" },
    Zt = { pointermove: "pm" },
    Dt = { keydown: "kd", keyup: "ku" },
    Ht = { devicemotion: "dm" },
    Jt = function (e, t) {
      var n = Bt[e],
        r = null;
      return function (e) {
        (r = (function (e) {
          return [e.windowX, e.windowY, Date.now()];
        })(e)),
          t(n, r);
      };
    },
    Kt = function (e, t) {
      var n = Zt[e],
        r = null;
      return function (e) {
        r = (function (e) {
          var t = [],
            n = [];
          e.getCoalescedEvents && (n = e.getCoalescedEvents());
          for (var r = 0; r < n.length; r++) {
            var i = n[r];
            t.push([i.x, i.y, Date.now()]);
          }
          return t;
        })(e);
        for (var i = 0; i < r.length; i++) t(n, r[i]);
      };
    },
    zt = function (e, t) {
      var n = jt[e],
        r = null;
      return function (e) {
        (r = (function (e) {
          var t = [];
          try {
            var n, r;
            if (
              (e.touches && e.touches.length >= 1
                ? (n = e.touches)
                : e.changedTouches &&
                  e.changedTouches.length >= 1 &&
                  (n = e.changedTouches),
              n)
            ) {
              for (var i = 0; i < n.length; i++)
                (r = nt.eventCoords(n[i])) &&
                  t.push([n[i].identifier, r.x, r.y]);
              t.push(Date.now());
            }
            return t;
          } catch (Kn) {
            return t;
          }
        })(e)),
          t(n, r);
      };
    },
    Lt = function (e, t) {
      var n = Dt[e],
        r = null;
      return function (e) {
        (r = (function (e) {
          return [e.keyNum, Date.now()];
        })(e)),
          t(n, r);
      };
    },
    Qt = function (e, t) {
      var n = Ht[e],
        r = null,
        i = [];
      return function (e) {
        (r = (function (e, t) {
          (e.acceleration === undefined ||
            (e.acceleration && e.acceleration.x === undefined)) &&
            (e.acceleration = { x: 0, y: 0, z: 0 });
          (e.rotationRate === undefined ||
            (e.rotationRate && e.rotationRate.alpha === undefined)) &&
            (e.rotationRate = { alpha: 0, beta: 0, gamma: 0 });
          var n = [
              e.acceleration.x,
              e.acceleration.y,
              e.acceleration.z,
              e.rotationRate.alpha,
              e.rotationRate.beta,
              e.rotationRate.gamma,
              Date.now(),
            ],
            r = [];
          if (0 === t.length) (t = n), (r = n);
          else {
            for (var i, o = 0, a = 0; a < 6; a++)
              (i = t[a] - n[a]), r.push(n[a]), (o += Math.abs(i));
            if ((r.push(Date.now()), (t = n), o <= 0)) return null;
          }
          return { motion: r, prevmotion: t };
        })(e, i)),
          null !== r && ((i = r.prevmotion), (r = r.motion), t(n, r));
      };
    };
  function $t() {
    (this._manifest = {}),
      (this.state = {
        timeBuffers: {},
        loadTime: Date.now(),
        recording: !1,
        initRecord: !1,
        record: { mouse: !0, touch: !0, keys: !1, motion: !1 },
      }),
      (this._recordEvent = this._recordEvent.bind(this));
  }
  ($t.prototype.record = function (e, t, n, r) {
    if (
      ((this._manifest.st = Date.now()),
      (this.state.record.mouse = e === undefined ? this.state.record.mouse : e),
      (this.state.record.touch = n === undefined ? this.state.record.touch : n),
      (this.state.record.keys = t === undefined ? this.state.record.keys : t),
      (this.state.record.motion =
        r === undefined ? this.state.record.motion : r),
      !1 === this.state.initRecord)
    ) {
      var i = new st(document.body);
      this.state.record.mouse &&
        (i.addEventListener(
          "mousedown",
          Jt("mousedown", this._recordEvent),
          !0
        ),
        i.addEventListener("mousemove", Jt("mousemove", this._recordEvent), !0),
        i.addEventListener("mouseup", Jt("mouseup", this._recordEvent), !0),
        i.addEventListener(
          "pointermove",
          Kt("pointermove", this._recordEvent),
          !0
        )),
        !0 === this.state.record.keys &&
          (i.addEventListener("keyup", Lt("keyup", this._recordEvent), !0),
          i.addEventListener("keydown", Lt("keydown", this._recordEvent), !0)),
        this.state.record.touch &&
          !0 === ee.Browser.hasEvent("touchstart", document.body) &&
          (i.addEventListener(
            "touchstart",
            zt("touchstart", this._recordEvent),
            !0
          ),
          i.addEventListener(
            "touchmove",
            zt("touchmove", this._recordEvent),
            !0
          ),
          i.addEventListener(
            "touchend",
            zt("touchend", this._recordEvent),
            !0
          )),
        this.state.record.motion &&
          !0 === ee.Browser.hasEvent("devicemotion", window) &&
          i.addEventListener(
            "devicemotion",
            Qt("devicemotion", this._recordEvent),
            !0
          ),
        (this.state.initRecord = !0);
    }
    this.state.recording = !0;
  }),
    ($t.prototype.stop = function () {
      this.state.recording = !1;
    }),
    ($t.prototype.time = function () {
      return this.state.loadTime;
    }),
    ($t.prototype.getData = function () {
      for (var e in this.state.timeBuffers)
        (this._manifest[e] = this.state.timeBuffers[e].getData()),
          (this._manifest[e + "-mp"] =
            this.state.timeBuffers[e].getMeanPeriod());
      return this._manifest;
    }),
    ($t.prototype.setData = function (e, t) {
      this._manifest[e] = t;
    }),
    ($t.prototype.resetData = function () {
      (this._manifest = {}), (this.state.timeBuffers = {});
    }),
    ($t.prototype.circBuffPush = function (e, t) {
      this._recordEvent(e, t);
    }),
    ($t.prototype._recordEvent = function (e, t) {
      if (!1 !== this.state.recording)
        try {
          var n = t[t.length - 1];
          this.state.timeBuffers[e] ||
            (this.state.timeBuffers[e] = new Ke(16, 15e3)),
            this.state.timeBuffers[e].push(n, t);
        } catch (Jn) {
          Oe("motion", Jn);
        }
    });
  var Yt = new $t();
  const Xt = (function () {
    const e = String.fromCharCode,
      t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
      r = {};
    function i(e, t) {
      if (!r[e]) {
        r[e] = {};
        for (let t = 0; t < e.length; t++) r[e][e.charAt(t)] = t;
      }
      return r[e][t];
    }
    const o = {
      compressToBase64: function (e) {
        if (null == e) return "";
        const n = o._compress(e, 6, function (e) {
          return t.charAt(e);
        });
        switch (n.length % 4) {
          default:
            return n;
          case 1:
            return n + "===";
          case 2:
            return n + "==";
          case 3:
            return n + "=";
        }
      },
      decompressFromBase64: function (e) {
        return null == e
          ? ""
          : "" == e
          ? null
          : o._decompress(e.length, 32, function (n) {
              return i(t, e.charAt(n));
            });
      },
      compressToUTF16: function (t) {
        return null == t
          ? ""
          : o._compress(t, 15, function (t) {
              return e(t + 32);
            }) + " ";
      },
      decompressFromUTF16: function (e) {
        return null == e
          ? ""
          : "" == e
          ? null
          : o._decompress(e.length, 16384, function (t) {
              return e.charCodeAt(t) - 32;
            });
      },
      compressToUint8Array: function (e) {
        const t = o.compress(e),
          n = new Uint8Array(2 * t.length);
        for (let e = 0, r = t.length; e < r; e++) {
          const r = t.charCodeAt(e);
          (n[2 * e] = r >>> 8), (n[2 * e + 1] = r % 256);
        }
        return n;
      },
      decompressFromUint8Array: function (t) {
        if (null == t) return o.decompress(t);
        {
          const n = new Array(t.length / 2);
          for (let e = 0, r = n.length; e < r; e++)
            n[e] = 256 * t[2 * e] + t[2 * e + 1];
          const r = [];
          return (
            n.forEach(function (t) {
              r.push(e(t));
            }),
            o.decompress(r.join(""))
          );
        }
      },
      compressToEncodedURIComponent: function (e) {
        return null == e
          ? ""
          : o._compress(e, 6, function (e) {
              return n.charAt(e);
            });
      },
      decompressFromEncodedURIComponent: function (e) {
        return null == e
          ? ""
          : "" == e
          ? null
          : ((e = e.replace(/ /g, "+")),
            o._decompress(e.length, 32, function (t) {
              return i(n, e.charAt(t));
            }));
      },
      compress: function (t) {
        return o._compress(t, 16, function (t) {
          return e(t);
        });
      },
      _compress: function (e, t, n) {
        if (null == e) return "";
        let r, i;
        const o = {},
          a = {};
        let s = "",
          c = "",
          l = "",
          h = 2,
          u = 3,
          d = 2;
        const p = [];
        let f,
          m = 0,
          g = 0;
        for (f = 0; f < e.length; f += 1)
          if (
            ((s = e.charAt(f)),
            Object.prototype.hasOwnProperty.call(o, s) ||
              ((o[s] = u++), (a[s] = !0)),
            (c = l + s),
            Object.prototype.hasOwnProperty.call(o, c))
          )
            l = c;
          else {
            if (Object.prototype.hasOwnProperty.call(a, l)) {
              if (l.charCodeAt(0) < 256) {
                for (r = 0; r < d; r++)
                  (m <<= 1),
                    g == t - 1 ? ((g = 0), p.push(n(m)), (m = 0)) : g++;
                for (i = l.charCodeAt(0), r = 0; r < 8; r++)
                  (m = (m << 1) | (1 & i)),
                    g == t - 1 ? ((g = 0), p.push(n(m)), (m = 0)) : g++,
                    (i >>= 1);
              } else {
                for (i = 1, r = 0; r < d; r++)
                  (m = (m << 1) | i),
                    g == t - 1 ? ((g = 0), p.push(n(m)), (m = 0)) : g++,
                    (i = 0);
                for (i = l.charCodeAt(0), r = 0; r < 16; r++)
                  (m = (m << 1) | (1 & i)),
                    g == t - 1 ? ((g = 0), p.push(n(m)), (m = 0)) : g++,
                    (i >>= 1);
              }
              h--, 0 == h && ((h = Math.pow(2, d)), d++), delete a[l];
            } else
              for (i = o[l], r = 0; r < d; r++)
                (m = (m << 1) | (1 & i)),
                  g == t - 1 ? ((g = 0), p.push(n(m)), (m = 0)) : g++,
                  (i >>= 1);
            h--,
              0 == h && ((h = Math.pow(2, d)), d++),
              (o[c] = u++),
              (l = String(s));
          }
        if ("" !== l) {
          if (Object.prototype.hasOwnProperty.call(a, l)) {
            if (l.charCodeAt(0) < 256) {
              for (r = 0; r < d; r++)
                (m <<= 1), g == t - 1 ? ((g = 0), p.push(n(m)), (m = 0)) : g++;
              for (i = l.charCodeAt(0), r = 0; r < 8; r++)
                (m = (m << 1) | (1 & i)),
                  g == t - 1 ? ((g = 0), p.push(n(m)), (m = 0)) : g++,
                  (i >>= 1);
            } else {
              for (i = 1, r = 0; r < d; r++)
                (m = (m << 1) | i),
                  g == t - 1 ? ((g = 0), p.push(n(m)), (m = 0)) : g++,
                  (i = 0);
              for (i = l.charCodeAt(0), r = 0; r < 16; r++)
                (m = (m << 1) | (1 & i)),
                  g == t - 1 ? ((g = 0), p.push(n(m)), (m = 0)) : g++,
                  (i >>= 1);
            }
            h--, 0 == h && ((h = Math.pow(2, d)), d++), delete a[l];
          } else
            for (i = o[l], r = 0; r < d; r++)
              (m = (m << 1) | (1 & i)),
                g == t - 1 ? ((g = 0), p.push(n(m)), (m = 0)) : g++,
                (i >>= 1);
          h--, 0 == h && ((h = Math.pow(2, d)), d++);
        }
        for (i = 2, r = 0; r < d; r++)
          (m = (m << 1) | (1 & i)),
            g == t - 1 ? ((g = 0), p.push(n(m)), (m = 0)) : g++,
            (i >>= 1);
        for (;;) {
          if (((m <<= 1), g == t - 1)) {
            p.push(n(m));
            break;
          }
          g++;
        }
        return p.join("");
      },
      decompress: function (e) {
        return null == e
          ? ""
          : "" == e
          ? null
          : o._decompress(e.length, 32768, function (t) {
              return e.charCodeAt(t);
            });
      },
      _decompress: function (t, n, r) {
        const i = [];
        let o = 4,
          a = 4,
          s = 3,
          c = "";
        const l = [];
        let h, u, d, p, f, m, g;
        const y = { val: r(0), position: n, index: 1 };
        for (h = 0; h < 3; h += 1) i[h] = String(h);
        for (d = 0, f = Math.pow(2, 2), m = 1; m != f; )
          (p = y.val & y.position),
            (y.position >>= 1),
            0 == y.position && ((y.position = n), (y.val = r(y.index++))),
            (d |= (p > 0 ? 1 : 0) * m),
            (m <<= 1);
        switch (d) {
          case 0:
            for (d = 0, f = Math.pow(2, 8), m = 1; m != f; )
              (p = y.val & y.position),
                (y.position >>= 1),
                0 == y.position && ((y.position = n), (y.val = r(y.index++))),
                (d |= (p > 0 ? 1 : 0) * m),
                (m <<= 1);
            g = e(d);
            break;
          case 1:
            for (d = 0, f = Math.pow(2, 16), m = 1; m != f; )
              (p = y.val & y.position),
                (y.position >>= 1),
                0 == y.position && ((y.position = n), (y.val = r(y.index++))),
                (d |= (p > 0 ? 1 : 0) * m),
                (m <<= 1);
            g = e(d);
            break;
          case 2:
            return "";
        }
        for (i[3] = String(g), u = String(g), l.push(String(g)); ; ) {
          if (y.index > t) return "";
          for (d = 0, f = Math.pow(2, s), m = 1; m != f; )
            (p = y.val & y.position),
              (y.position >>= 1),
              0 == y.position && ((y.position = n), (y.val = r(y.index++))),
              (d |= (p > 0 ? 1 : 0) * m),
              (m <<= 1);
          switch ((g = d)) {
            case 0:
              for (d = 0, f = Math.pow(2, 8), m = 1; m != f; )
                (p = y.val & y.position),
                  (y.position >>= 1),
                  0 == y.position && ((y.position = n), (y.val = r(y.index++))),
                  (d |= (p > 0 ? 1 : 0) * m),
                  (m <<= 1);
              (i[a++] = e(d)), (g = a - 1), o--;
              break;
            case 1:
              for (d = 0, f = Math.pow(2, 16), m = 1; m != f; )
                (p = y.val & y.position),
                  (y.position >>= 1),
                  0 == y.position && ((y.position = n), (y.val = r(y.index++))),
                  (d |= (p > 0 ? 1 : 0) * m),
                  (m <<= 1);
              (i[a++] = e(d)), (g = a - 1), o--;
              break;
            case 2:
              return l.join("");
          }
          if ((0 == o && ((o = Math.pow(2, s)), s++), i[g])) c = String(i[g]);
          else {
            if (g !== a) return null;
            c = u + u.charAt(0);
          }
          l.push(c),
            (i[a++] = u + c.charAt(0)),
            o--,
            (u = c),
            0 == o && ((o = Math.pow(2, s)), s++);
        }
      },
    };
    return o;
  })();
  var qt, en, tn, nn, rn;
  try {
    (qt = (function () {
      const e = {
        _GhYc05v6: 0,
        _CeUVK17f1v: 0,
        _edQIfGkr: [],
        _SG8qJc: [],
        _NqN5Mr: [],
        _Um3wm: {},
        _0uLU: window,
        _ssPWDNIRV7: [
          function (e) {
            for (var t = e._4dJHhI9e[e._GhYc05v6++], n = [], r = 0; r < t; r++)
              n.push(e._edQIfGkr.pop());
            e._edQIfGkr.push(n);
          },
          function (e) {
            e._edQIfGkr.pop(), e._edQIfGkr.push(void 0);
          },
          function (e) {
            for (
              var t = e._4dJHhI9e[e._GhYc05v6++],
                n = e._4dJHhI9e[e._GhYc05v6++],
                r = e._4dJHhI9e[e._GhYc05v6++],
                i = decodeURIComponent(atob(e._phziSRa7D.slice(t, t + n))),
                o = "",
                a = 0;
              a < i.length;
              a++
            )
              o += String.fromCharCode((256 + i.charCodeAt(a) + r) % 256);
            e._edQIfGkr.push(o);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            if (t._l !== undefined)
              n.splice(0, 0, { _l: {} }), t.apply(e._0uLU, n);
            else {
              var r = t.apply(e._0uLU, n);
              e._edQIfGkr.push(r);
            }
          },
          function () {
            var t = e._edQIfGkr.pop(),
              n = e._4dJHhI9e[e._GhYc05v6++];
            (e._SG8qJc = t), (e._NqN5Mr[n] = t);
          },
          function (e) {
            e._edQIfGkr.push(e._edQIfGkr[e._edQIfGkr.length - 1]);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._4dJHhI9e[e._GhYc05v6++];
            t || (e._GhYc05v6 = n);
          },
          function (e) {
            e._edQIfGkr.push(Xt);
          },
          function (e) {
            var t = e._edQIfGkr.pop();
            e._edQIfGkr.push(window[t]);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n * t);
          },
          function () {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop(),
              r = !1;
            t._l !== undefined && ((r = !0), n.splice(0, 0, { _l: {} }));
            var i = new (Function.prototype.bind.apply(t, [null].concat(n)))();
            r && e._edQIfGkr.pop(), e._edQIfGkr.push(i);
          },
          function (e) {
            const t = e._edQIfGkr.pop();
            e._edQIfGkr.push(!t);
          },
          function (e) {
            var n = e._CeUVK17f1v,
              r = e._4dJHhI9e[e._GhYc05v6++];
            try {
              t(e);
            } catch (i) {
              e._edQIfGkr.push(i), (e._GhYc05v6 = r), t(e);
            }
            e._CeUVK17f1v = n;
          },
          function (e) {
            e._edQIfGkr.push(ee);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._4dJHhI9e[e._GhYc05v6++],
              r = e._4dJHhI9e[e._GhYc05v6++],
              i = -1 == n ? e._SG8qJc : e._NqN5Mr[n];
            e._edQIfGkr.push((i[r] |= t));
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._4dJHhI9e[e._GhYc05v6++],
              r = e._4dJHhI9e[e._GhYc05v6++];
            e._SG8qJc[r] = t;
            for (var i = 0; i < n; i++)
              e._SG8qJc[e._4dJHhI9e[e._GhYc05v6++]] = t[i];
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n + t);
          },
          function (e) {
            e._edQIfGkr.push(!!e._4dJHhI9e[e._GhYc05v6++]);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop(),
              r = e._edQIfGkr.pop();
            e._edQIfGkr.push((n[t] += r));
          },
          function (e) {
            e._edQIfGkr.push(undefined);
          },
          function (e) {
            e._edQIfGkr.push(st);
          },
          function (e) {
            e._edQIfGkr.push(null);
          },
          function () {
            var t = e._edQIfGkr.pop(),
              n = e._4dJHhI9e[e._GhYc05v6++];
            e._NqN5Mr[n]
              ? (e._SG8qJc = e._NqN5Mr[n])
              : ((e._SG8qJc = t), (e._NqN5Mr[n] = t));
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n >= t);
          },
          function (e) {
            const t = e._edQIfGkr.pop();
            e._edQIfGkr.push(typeof t);
          },
          function (e) {
            const t = e._edQIfGkr.pop();
            e._edQIfGkr.push(-t);
          },
          function (e) {
            e._edQIfGkr.push(tt);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n | t);
          },
          function (e) {
            var t = e._4dJHhI9e[e._GhYc05v6++],
              n = e._4dJHhI9e[e._GhYc05v6++],
              r = e._4dJHhI9e[e._GhYc05v6++],
              i = -1 == t ? e._SG8qJc : e._NqN5Mr[t];
            r ? e._edQIfGkr.push(++i[n]) : e._edQIfGkr.push(i[n]++);
          },
          function (e) {
            e._edQIfGkr.push(tt);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._4dJHhI9e[e._GhYc05v6++],
              r = e._4dJHhI9e[e._GhYc05v6++],
              i = -1 == n ? e._SG8qJc : e._NqN5Mr[n];
            e._edQIfGkr.push((i[r] += t));
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._4dJHhI9e[e._GhYc05v6++],
              r = e._4dJHhI9e[e._GhYc05v6++];
            (-1 == n ? e._SG8qJc : e._NqN5Mr[n])[r] = t;
          },
          function (e) {
            var t = e._4dJHhI9e[e._GhYc05v6++];
            e._CeUVK17f1v = t;
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n in t);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop(),
              r = e._edQIfGkr.pop();
            e._edQIfGkr.push((n[t] = r));
          },
          function (e) {
            e._edQIfGkr.push(et);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n - t);
          },
          function (e) {
            e._Um3wm[e._edQIfGkr[e._edQIfGkr.length - 1]] =
              e._edQIfGkr[e._edQIfGkr.length - 2];
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n / t);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n < t);
          },
          function (e) {
            var t = e._4dJHhI9e[e._GhYc05v6++],
              n = e._4dJHhI9e[e._GhYc05v6++],
              r = -1 == t ? e._SG8qJc : e._NqN5Mr[t];
            e._edQIfGkr.push(r[n]);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n !== t);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n instanceof t);
          },
          function (e) {
            for (
              var t = e._4dJHhI9e[e._GhYc05v6++], n = {}, r = 0;
              r < t;
              r++
            ) {
              var i = e._edQIfGkr.pop();
              n[e._edQIfGkr.pop()] = i;
            }
            e._edQIfGkr.push(n);
          },
          function (e) {
            e._edQIfGkr.pop();
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._4dJHhI9e[e._GhYc05v6++],
              r = e._4dJHhI9e[e._GhYc05v6++],
              i = -1 == n ? e._SG8qJc : e._NqN5Mr[n];
            e._edQIfGkr.push((i[r] = t));
          },
          function (e) {
            var n = e._edQIfGkr.pop(),
              r = function () {
                var i = !1,
                  o = Array.prototype.slice.call(arguments);
                o.length > 0 && o[0]._l
                  ? (o = o.splice(1, o.length - 1))
                  : (i = !0);
                var a = e._0uLU,
                  s = e._CeUVK17f1v,
                  c = e._NqN5Mr;
                if (
                  (e._edQIfGkr.push(e._GhYc05v6),
                  e._edQIfGkr.push(e._0uLU),
                  e._edQIfGkr.push(e._SG8qJc),
                  e._edQIfGkr.push(o),
                  e._edQIfGkr.push(r),
                  (e._CeUVK17f1v = e._GhYc05v6),
                  (e._GhYc05v6 = n),
                  (e._0uLU = this),
                  (e._NqN5Mr = r._r),
                  t(e),
                  (e._0uLU = a),
                  (e._CeUVK17f1v = s),
                  (e._NqN5Mr = c),
                  i)
                )
                  return e._edQIfGkr.pop();
              };
            (r._l = {}),
              (r._r = Array.prototype.slice.call(e._NqN5Mr)),
              e._edQIfGkr.push(r);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n << t);
          },
          function (e) {
            e._edQIfGkr.push(e._4dJHhI9e[e._GhYc05v6++]);
          },
          function (e) {
            e._edQIfGkr.push(e._0uLU);
          },
          function (e) {
            e._edQIfGkr.push(nt);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n <= t);
          },
          function (e) {
            (e._GhYc05v6 = e._edQIfGkr.splice(e._edQIfGkr.length - 4, 1)[0]),
              (e._0uLU = e._edQIfGkr.splice(e._edQIfGkr.length - 3, 1)[0]),
              (e._SG8qJc = e._edQIfGkr.splice(e._edQIfGkr.length - 2, 1)[0]);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n === t);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop(),
              r = n[t];
            "function" == typeof r && (r = r.bind(n)), e._edQIfGkr.push(r);
          },
          function (e) {
            var t = e._edQIfGkr.pop(),
              n = e._edQIfGkr.pop();
            e._edQIfGkr.push(n > t);
          },
        ],
        _4dJHhI9e: [
          0, 0, 22, 0, 48, 14, 46, 31, -1, 0, 17, 0, 6, 59, 0, 0, 4, 1, 44, 15,
          1, 0, 1, 0, 0, 2, 3324, 8, 13, 8, 2, 4400, 4, -7, 54, 3, 40, -1, 1, 2,
          4180, 12, 6, 54, 40, -1, 1, 2, 1356, 16, 14, 54, 0, 3, 17, 0, 6, 58,
          52, 48, 69, 46, 31, -1, 1, 17, 0, 6, 202, 0, 0, 4, 2, 44, 15, 1, 0, 1,
          0, 0, 31, -1, 2, 0, 0, 31, -1, 3, 40, -1, 1, 2, 3560, 24, 0, 54, 6,
          113, 0, 0, 40, -1, 1, 2, 3560, 24, 0, 54, 3, 45, -1, 3, 44, 48, 0, 31,
          -1, 4, 40, -1, 4, 40, -1, 3, 2, 2028, 16, 10, 54, 39, 6, 194, 40, -1,
          3, 40, -1, 4, 54, 31, -1, 5, 0, 0, 2, 3324, 8, 13, 8, 2, 4400, 4, -7,
          54, 3, 40, -1, 5, 2, 2696, 4, 4, 54, 40, -1, 5, 2, 1500, 4, 11, 54, 0,
          3, 0, 1, 40, -1, 2, 2, 4680, 24, -15, 54, 3, 44, 28, -1, 4, 0, 44, 17,
          0, 6, 118, 40, -1, 2, 17, 0, 6, 201, 52, 48, 212, 46, 31, -1, 2, 17,
          0, 6, 249, 0, 0, 4, 3, 44, 15, 1, 0, 1, 0, 0, 2, 3324, 8, 13, 8, 2,
          4400, 4, -7, 54, 3, 40, -1, 1, 2, 3068, 16, 18, 54, 0, 2, 17, 0, 6,
          248, 52, 48, 259, 46, 31, -1, 3, 17, 0, 6, 521, 0, 0, 4, 4, 44, 15, 1,
          0, 1, 0, 0, 31, -1, 2, 12, 501, 40, -1, 1, 2, 3380, 12, 9, 54, 5, 6,
          303, 44, 40, -1, 1, 2, 3380, 12, 9, 54, 2, 2028, 16, 10, 54, 48, 1,
          23, 6, 321, 40, -1, 1, 2, 3380, 12, 9, 54, 45, -1, 3, 44, 17, 0, 6,
          363, 40, -1, 1, 2, 2464, 48, -18, 54, 5, 6, 349, 44, 40, -1, 1, 2,
          2464, 48, -18, 54, 2, 2028, 16, 10, 54, 48, 1, 23, 6, 363, 40, -1, 1,
          2, 2464, 48, -18, 54, 45, -1, 3, 44, 40, -1, 3, 6, 488, 48, 0, 31, -1,
          5, 40, -1, 5, 40, -1, 3, 2, 2028, 16, 10, 54, 39, 6, 463, 40, -1, 3,
          40, -1, 5, 54, 0, 1, 50, 2, 1884, 64, -21, 54, 3, 45, -1, 4, 44, 40,
          -1, 4, 6, 454, 40, -1, 4, 2, 2696, 4, 4, 54, 40, -1, 4, 2, 1500, 4,
          11, 54, 40, -1, 3, 40, -1, 5, 54, 2, 4528, 16, -8, 54, 0, 3, 0, 1, 40,
          -1, 2, 2, 4680, 24, -15, 54, 3, 44, 28, -1, 5, 0, 44, 17, 0, 6, 373,
          0, 0, 2, 3324, 8, 13, 8, 2, 4400, 4, -7, 54, 3, 0, 1, 40, -1, 2, 2,
          4680, 24, -15, 54, 3, 44, 40, -1, 2, 17, 0, 6, 520, 32, 497, 17, 0, 6,
          511, 31, -1, 6, 40, -1, 2, 17, 0, 6, 520, 2, 2072, 20, 16, 8, 17, 0,
          6, 520, 52, 48, 531, 46, 31, -1, 4, 17, 0, 6, 978, 0, 0, 4, 5, 44, 15,
          2, 0, 1, 2, 40, -1, 1, 2, 2560, 28, 8, 54, 48, 0, 1, 53, 5, 11, 6,
          587, 44, 40, -1, 1, 2, 2560, 28, 8, 54, 5, 6, 587, 44, 40, -1, 1, 2,
          2560, 28, 8, 54, 2, 1500, 4, 11, 54, 48, 0, 1, 53, 6, 618, 2, 4704, 4,
          6, 48, 0, 2, 2696, 4, 4, 48, 0, 2, 1500, 4, 11, 48, 0, 43, 3, 40, -1,
          1, 2, 2560, 28, 8, 34, 44, 40, -1, 1, 2, 1440, 16, 2, 54, 48, 0, 1,
          53, 5, 11, 6, 664, 44, 40, -1, 1, 2, 1440, 16, 2, 54, 5, 6, 664, 44,
          40, -1, 1, 2, 1440, 16, 2, 54, 2, 2328, 12, 15, 54, 48, 0, 1, 53, 6,
          695, 2, 2844, 8, 0, 48, 0, 2, 3404, 12, -15, 48, 0, 2, 2328, 12, 15,
          48, 0, 43, 3, 40, -1, 1, 2, 1440, 16, 2, 34, 44, 0, 0, 2, 3324, 8, 13,
          8, 2, 4400, 4, -7, 54, 3, 40, -1, 1, 2, 1440, 16, 2, 54, 2, 2844, 8,
          0, 54, 40, -1, 1, 2, 1440, 16, 2, 54, 2, 3404, 12, -15, 54, 40, -1, 1,
          2, 1440, 16, 2, 54, 2, 2328, 12, 15, 54, 40, -1, 1, 2, 2560, 28, 8,
          54, 2, 4704, 4, 6, 54, 40, -1, 1, 2, 2560, 28, 8, 54, 2, 2696, 4, 4,
          54, 40, -1, 1, 2, 2560, 28, 8, 54, 2, 1500, 4, 11, 54, 0, 7, 31, -1,
          3, 0, 0, 31, -1, 4, 40, -1, 2, 2, 2028, 16, 10, 54, 48, 0, 53, 6, 827,
          40, -1, 3, 45, -1, 2, 44, 40, -1, 3, 45, -1, 4, 44, 17, 0, 6, 957, 48,
          0, 31, -1, 5, 48, 0, 31, -1, 7, 40, -1, 7, 48, 6, 39, 6, 912, 40, -1,
          2, 40, -1, 7, 54, 40, -1, 3, 40, -1, 7, 54, 36, 45, -1, 6, 44, 40, -1,
          3, 40, -1, 7, 54, 0, 1, 40, -1, 4, 2, 4680, 24, -15, 54, 3, 44, 40,
          -1, 6, 0, 1, 2, 2976, 12, -13, 8, 2, 696, 12, -17, 54, 3, 30, -1, 5,
          44, 28, -1, 7, 0, 44, 17, 0, 6, 837, 0, 0, 2, 3324, 8, 13, 8, 2, 4400,
          4, -7, 54, 3, 0, 1, 40, -1, 4, 2, 4680, 24, -15, 54, 3, 44, 40, -1, 3,
          45, -1, 2, 44, 40, -1, 5, 48, 0, 51, 6, 957, 21, 17, 0, 6, 977, 2,
          176, 56, -17, 40, -1, 2, 2, 2132, 16, 14, 40, -1, 4, 43, 2, 17, 0, 6,
          977, 52, 48, 988, 46, 31, -1, 5, 17, 0, 6, 1111, 0, 0, 4, 6, 44, 15,
          0, 0, 43, 0, 49, 2, 508, 44, -21, 34, 44, 2, 1976, 8, 16, 2, 2132, 16,
          14, 17, 0, 2, 2208, 8, 1, 17, 0, 2, 1372, 8, -3, 17, 1, 2, 2684, 12,
          -9, 17, 1, 43, 4, 2, 1696, 24, -11, 17, 0, 2, 3756, 20, -10, 17, 0, 2,
          4200, 12, -5, 0, 0, 2, 3324, 8, 13, 8, 2, 4400, 4, -7, 54, 3, 2, 1608,
          20, -7, 43, 0, 43, 5, 49, 2, 1420, 8, -1, 34, 44, 49, 0, 1, 49, 2, 72,
          20, 15, 54, 2, 3824, 8, 3, 54, 3, 49, 2, 72, 20, 15, 34, 44, 2, 2072,
          20, 16, 8, 17, 0, 6, 1110, 52, 48, 1121, 46, 31, -1, 6, 17, 0, 6,
          1303, 0, 0, 4, 7, 44, 15, 1, 0, 1, 0, 0, 40, -1, 1, 2, 3164, 16, 17,
          54, 2, 1796, 36, -12, 54, 3, 31, -1, 2, 40, -1, 1, 2, 232, 4, -1, 54,
          5, 11, 6, 1166, 44, 2, 2640, 0, 2, 31, -1, 3, 40, -1, 1, 2, 4544, 8,
          -2, 54, 5, 11, 6, 1186, 44, 2, 2640, 0, 2, 31, -1, 4, 40, -1, 1, 2,
          2320, 8, 11, 54, 5, 11, 6, 1206, 44, 2, 2640, 0, 2, 31, -1, 5, 40, -1,
          1, 2, 4032, 12, 0, 54, 5, 11, 6, 1226, 44, 2, 2640, 0, 2, 31, -1, 6,
          40, -1, 1, 2, 1380, 20, 14, 54, 5, 11, 6, 1246, 44, 2, 2640, 0, 2, 31,
          -1, 7, 40, -1, 1, 0, 1, 40, 0, 7, 3, 31, -1, 8, 40, -1, 2, 40, -1, 3,
          16, 40, -1, 4, 16, 40, -1, 5, 16, 40, -1, 6, 16, 40, -1, 7, 16, 40,
          -1, 8, 16, 31, -1, 9, 40, -1, 9, 0, 1, 35, 3, 17, 0, 6, 1302, 52, 48,
          1313, 46, 31, -1, 7, 17, 0, 6, 1678, 0, 0, 4, 8, 44, 15, 1, 0, 1, 40,
          -1, 1, 2, 232, 4, -1, 54, 2, 2640, 0, 2, 41, 6, 1359, 2, 2276, 24, 16,
          40, -1, 1, 2, 232, 4, -1, 54, 16, 2, 3144, 8, -10, 16, 17, 0, 6, 1677,
          40, -1, 1, 2, 4444, 16, 5, 8, 2, 1748, 8, 18, 54, 53, 6, 1383, 2,
          3180, 24, -9, 17, 0, 6, 1677, 2, 2640, 0, 2, 31, -1, 2, 40, -1, 1, 2,
          3832, 16, -4, 54, 6, 1670, 48, 0, 31, -1, 3, 48, 0, 31, -1, 4, 48, 0,
          31, -1, 5, 40, -1, 5, 40, -1, 1, 2, 3832, 16, -4, 54, 2, 2588, 32,
          -18, 54, 2, 2028, 16, 10, 54, 39, 6, 1511, 40, -1, 1, 2, 3832, 16, -4,
          54, 2, 2588, 32, -18, 54, 40, -1, 5, 54, 31, -1, 6, 40, -1, 6, 2,
          1660, 24, -14, 54, 40, -1, 1, 2, 1660, 24, -14, 54, 53, 6, 1502, 40,
          -1, 6, 40, -1, 1, 53, 6, 1497, 40, -1, 3, 48, 1, 16, 45, -1, 4, 44,
          28, -1, 3, 0, 44, 28, -1, 5, 0, 44, 17, 0, 6, 1415, 2, 4544, 8, -2, 0,
          1, 40, -1, 1, 2, 4244, 24, 8, 54, 3, 5, 6, 1550, 44, 2, 4544, 8, -2,
          0, 1, 40, -1, 1, 2, 4708, 20, 13, 54, 3, 2, 2640, 0, 2, 41, 6, 1611,
          2, 2884, 4, -5, 0, 0, 40, -1, 1, 2, 1660, 24, -14, 54, 2, 1796, 36,
          -12, 54, 3, 16, 2, 3248, 12, -7, 16, 2, 4544, 8, -2, 0, 1, 40, -1, 1,
          2, 4708, 20, 13, 54, 3, 16, 2, 3144, 8, -10, 16, 40, -1, 2, 16, 45,
          -1, 2, 44, 17, 0, 6, 1654, 2, 2884, 4, -5, 0, 0, 40, -1, 1, 2, 1660,
          24, -14, 54, 2, 1796, 36, -12, 54, 3, 16, 2, 3320, 4, 1, 16, 40, -1,
          4, 16, 2, 2168, 4, 21, 16, 40, -1, 2, 16, 45, -1, 2, 44, 40, -1, 1, 2,
          3832, 16, -4, 54, 45, -1, 1, 44, 17, 0, 6, 1390, 40, -1, 2, 17, 0, 6,
          1677, 52, 48, 1688, 46, 31, -1, 8, 17, 0, 6, 1710, 0, 0, 4, 9, 44, 15,
          2, 0, 1, 2, 40, -1, 1, 40, -1, 2, 27, 17, 0, 6, 1709, 52, 48, 1720,
          46, 31, -1, 9, 17, 0, 6, 1857, 0, 0, 4, 10, 44, 15, 1, 0, 1, 40, -1,
          1, 0, 1, 40, 0, 6, 3, 31, -1, 2, 40, 0, 42, 40, -1, 2, 54, 6, 1761,
          40, 0, 42, 40, -1, 2, 54, 17, 0, 6, 1856, 40, -1, 1, 2, 2700, 16, 21,
          54, 6, 1777, 48, 1, 17, 0, 6, 1779, 48, 0, 40, -1, 1, 2, 1776, 20,
          -16, 54, 6, 1795, 48, 1, 17, 0, 6, 1797, 48, 0, 40, -1, 1, 2, 4604,
          24, -13, 54, 6, 1813, 48, 1, 17, 0, 6, 1815, 48, 0, 40, -1, 1, 0, 1,
          40, 0, 11, 3, 40, -1, 1, 0, 1, 40, 0, 10, 3, 0, 5, 31, -1, 3, 40, -1,
          3, 40, 0, 42, 40, -1, 2, 34, 44, 40, -1, 3, 17, 0, 6, 1856, 52, 48,
          1867, 46, 31, -1, 10, 17, 0, 6, 2582, 0, 0, 4, 11, 44, 15, 1, 0, 1,
          40, -1, 1, 2, 3904, 12, -4, 54, 2, 4468, 8, 19, 54, 6, 1903, 40, 0,
          41, 2, 3156, 8, 6, 54, 17, 0, 6, 2581, 40, -1, 1, 2, 2320, 8, 11, 54,
          5, 6, 1931, 44, 0, 0, 40, -1, 1, 2, 2320, 8, 11, 54, 2, 1796, 36, -12,
          54, 3, 31, -1, 2, 0, 0, 40, -1, 1, 2, 3164, 16, 17, 54, 2, 1796, 36,
          -12, 54, 3, 31, -1, 3, 40, -1, 3, 2, 4984, 12, 13, 53, 6, 1975, 40, 0,
          41, 2, 2784, 12, -12, 54, 17, 0, 6, 2581, 2, 2524, 16, 8, 40, 0, 41,
          2, 4588, 16, 5, 54, 2, 1428, 12, -12, 40, 0, 41, 2, 4352, 12, -9, 54,
          2, 1416, 4, 13, 40, 0, 41, 2, 2164, 4, 2, 54, 2, 4496, 16, -12, 40, 0,
          41, 2, 2640, 16, -9, 54, 2, 236, 28, -12, 40, 0, 41, 2, 2544, 16, 9,
          54, 2, 3544, 8, -1, 40, 0, 41, 2, 1720, 16, 14, 54, 43, 6, 31, -1, 4,
          40, -1, 4, 40, -1, 2, 54, 6, 2072, 40, -1, 4, 40, -1, 2, 54, 17, 0, 6,
          2581, 0, 0, 40, -1, 1, 2, 4544, 8, -2, 54, 5, 11, 6, 2091, 44, 2,
          2640, 0, 2, 2, 1796, 36, -12, 54, 3, 31, -1, 5, 0, 0, 40, -1, 1, 2,
          232, 4, -1, 54, 5, 11, 6, 2119, 44, 2, 2640, 0, 2, 2, 1796, 36, -12,
          54, 3, 31, -1, 6, 0, 0, 40, -1, 1, 2, 1380, 20, 14, 54, 5, 11, 6,
          2147, 44, 2, 2640, 0, 2, 2, 1796, 36, -12, 54, 3, 31, -1, 7, 0, 0, 40,
          -1, 1, 2, 4032, 12, 0, 54, 5, 11, 6, 2175, 44, 2, 2640, 0, 2, 2, 1796,
          36, -12, 54, 3, 31, -1, 8, 2, 3544, 8, -1, 0, 1, 40, -1, 5, 2, 3332,
          16, 14, 54, 3, 48, 1, 25, 41, 5, 11, 6, 2227, 44, 2, 3544, 8, -1, 0,
          1, 40, -1, 6, 2, 3332, 16, 14, 54, 3, 48, 1, 25, 41, 5, 11, 6, 2251,
          44, 2, 3544, 8, -1, 0, 1, 40, -1, 7, 2, 3332, 16, 14, 54, 3, 48, 1,
          25, 41, 5, 11, 6, 2275, 44, 2, 3544, 8, -1, 0, 1, 40, -1, 8, 2, 3332,
          16, 14, 54, 3, 48, 1, 25, 41, 6, 2289, 40, 0, 41, 2, 1720, 16, 14, 54,
          17, 0, 6, 2581, 2, 236, 28, -12, 0, 1, 40, -1, 5, 2, 3332, 16, 14, 54,
          3, 48, 1, 25, 41, 5, 11, 6, 2332, 44, 2, 236, 28, -12, 0, 1, 40, -1,
          6, 2, 3332, 16, 14, 54, 3, 48, 1, 25, 41, 5, 11, 6, 2356, 44, 2, 236,
          28, -12, 0, 1, 40, -1, 7, 2, 3332, 16, 14, 54, 3, 48, 1, 25, 41, 5,
          11, 6, 2380, 44, 2, 236, 28, -12, 0, 1, 40, -1, 8, 2, 3332, 16, 14,
          54, 3, 48, 1, 25, 41, 6, 2394, 40, 0, 41, 2, 2544, 16, 9, 54, 17, 0,
          6, 2581, 2, 4288, 16, -13, 0, 1, 40, -1, 5, 2, 3332, 16, 14, 54, 3,
          48, 1, 25, 41, 5, 11, 6, 2437, 44, 2, 4288, 16, -13, 0, 1, 40, -1, 6,
          2, 3332, 16, 14, 54, 3, 48, 1, 25, 41, 5, 11, 6, 2461, 44, 2, 4288,
          16, -13, 0, 1, 40, -1, 7, 2, 3332, 16, 14, 54, 3, 48, 1, 25, 41, 5,
          11, 6, 2485, 44, 2, 4288, 16, -13, 0, 1, 40, -1, 8, 2, 3332, 16, 14,
          54, 3, 48, 1, 25, 41, 5, 11, 6, 2509, 44, 2, 1416, 4, 13, 0, 1, 40,
          -1, 5, 2, 3332, 16, 14, 54, 3, 48, 1, 25, 41, 5, 11, 6, 2533, 44, 2,
          1416, 4, 13, 0, 1, 40, -1, 6, 2, 3332, 16, 14, 54, 3, 48, 1, 25, 41,
          6, 2547, 40, 0, 41, 2, 2164, 4, 2, 54, 17, 0, 6, 2581, 40, -1, 2, 2,
          3796, 8, 7, 53, 6, 2569, 40, 0, 41, 2, 2784, 12, -12, 54, 17, 0, 6,
          2581, 40, 0, 41, 2, 2412, 12, 19, 54, 17, 0, 6, 2581, 52, 48, 2592,
          46, 31, -1, 11, 17, 0, 6, 2724, 0, 0, 4, 12, 44, 15, 1, 0, 1, 2, 1380,
          20, 14, 2, 1872, 12, 16, 2, 4544, 8, -2, 2, 232, 4, -1, 0, 4, 31, -1,
          2, 0, 0, 31, -1, 3, 48, 0, 31, -1, 4, 40, -1, 4, 40, -1, 2, 2, 2028,
          16, 10, 54, 39, 6, 2716, 40, -1, 2, 40, -1, 4, 54, 31, -1, 5, 40, -1,
          5, 0, 1, 40, -1, 1, 2, 4244, 24, 8, 54, 3, 6, 2694, 40, -1, 5, 0, 1,
          40, -1, 1, 2, 4708, 20, 13, 54, 3, 0, 1, 35, 3, 17, 0, 6, 2695, 21, 0,
          1, 40, -1, 3, 2, 4680, 24, -15, 54, 3, 44, 28, -1, 4, 0, 44, 17, 0, 6,
          2632, 40, -1, 3, 17, 0, 6, 2723, 52, 48, 2734, 46, 31, -1, 12, 17, 0,
          6, 2837, 0, 0, 4, 13, 44, 15, 1, 0, 1, 0, 0, 2, 3324, 8, 13, 8, 2,
          4400, 4, -7, 54, 3, 40, -1, 1, 2, 3848, 16, 22, 54, 0, 1, 40, 0, 6, 3,
          40, -1, 1, 2, 4180, 12, 6, 54, 6, 2792, 40, -1, 1, 2, 4180, 12, 6, 54,
          17, 0, 6, 2800, 40, -1, 1, 2, 4804, 32, -20, 54, 40, -1, 1, 2, 1356,
          16, 14, 54, 6, 2822, 40, -1, 1, 2, 1356, 16, 14, 54, 17, 0, 6, 2830,
          40, -1, 1, 2, 4304, 20, -16, 54, 0, 4, 17, 0, 6, 2836, 52, 48, 2847,
          46, 31, -1, 13, 17, 0, 6, 3174, 0, 0, 4, 14, 44, 15, 1, 0, 1, 48, 0,
          31, -1, 2, 40, -1, 1, 2, 2672, 12, 18, 54, 6, 2892, 40, 0, 52, 2,
          2656, 16, -12, 54, 40, -1, 2, 0, 2, 40, 0, 8, 3, 45, -1, 2, 44, 40,
          -1, 1, 2, 3296, 20, 10, 54, 6, 2923, 40, 0, 52, 2, 3868, 16, 19, 54,
          40, -1, 2, 0, 2, 40, 0, 8, 3, 45, -1, 2, 44, 40, -1, 1, 2, 2148, 16,
          5, 54, 6, 2954, 40, 0, 52, 2, 2400, 12, -8, 54, 40, -1, 2, 0, 2, 40,
          0, 8, 3, 45, -1, 2, 44, 40, -1, 1, 2, 1516, 28, -14, 54, 6, 2985, 40,
          0, 52, 2, 148, 16, 8, 54, 40, -1, 2, 0, 2, 40, 0, 8, 3, 45, -1, 2, 44,
          40, -1, 1, 2, 1984, 4, -1, 54, 2, 1504, 12, 5, 53, 6, 3021, 40, 0, 52,
          2, 2936, 20, 6, 54, 40, -1, 2, 0, 2, 40, 0, 8, 3, 45, -1, 2, 44, 40,
          -1, 1, 2, 1984, 4, -1, 54, 2, 1736, 12, 6, 53, 6, 3057, 40, 0, 52, 2,
          2300, 20, 15, 54, 40, -1, 2, 0, 2, 40, 0, 8, 3, 45, -1, 2, 44, 40, -1,
          1, 2, 1984, 4, -1, 54, 2, 4476, 20, 1, 53, 6, 3093, 40, 0, 52, 2,
          3224, 24, 10, 54, 40, -1, 2, 0, 2, 40, 0, 8, 3, 45, -1, 2, 44, 40, -1,
          1, 2, 1984, 4, -1, 54, 2, 2852, 20, 5, 53, 6, 3129, 40, 0, 52, 2,
          3052, 16, 12, 54, 40, -1, 2, 0, 2, 40, 0, 8, 3, 45, -1, 2, 44, 0, 0,
          2, 3324, 8, 13, 8, 2, 4400, 4, -7, 54, 3, 40, -1, 1, 2, 3848, 16, 22,
          54, 0, 1, 40, 0, 6, 3, 40, -1, 2, 40, -1, 1, 2, 1400, 16, 7, 54, 0, 4,
          17, 0, 6, 3173, 52, 48, 3184, 46, 31, -1, 14, 17, 0, 6, 3520, 0, 0, 4,
          15, 44, 15, 1, 0, 1, 0, 0, 31, -1, 2, 12, 3500, 40, -1, 1, 2, 3380,
          12, 9, 54, 5, 6, 3228, 44, 40, -1, 1, 2, 3380, 12, 9, 54, 2, 2028, 16,
          10, 54, 48, 1, 23, 6, 3246, 40, -1, 1, 2, 3380, 12, 9, 54, 45, -1, 3,
          44, 17, 0, 6, 3288, 40, -1, 1, 2, 2464, 48, -18, 54, 5, 6, 3274, 44,
          40, -1, 1, 2, 2464, 48, -18, 54, 2, 2028, 16, 10, 54, 48, 1, 23, 6,
          3288, 40, -1, 1, 2, 2464, 48, -18, 54, 45, -1, 3, 44, 40, -1, 3, 6,
          3487, 48, 0, 31, -1, 5, 40, -1, 5, 40, -1, 3, 2, 2028, 16, 10, 54, 39,
          6, 3436, 40, -1, 3, 40, -1, 5, 54, 0, 1, 50, 2, 1884, 64, -21, 54, 3,
          45, -1, 4, 44, 40, -1, 4, 6, 3427, 40, -1, 3, 40, -1, 5, 54, 2, 4528,
          16, -8, 54, 0, 1, 40, -1, 2, 2, 4680, 24, -15, 54, 3, 44, 40, -1, 4,
          2, 1500, 4, 11, 54, 0, 1, 2, 2976, 12, -13, 8, 2, 1964, 12, -10, 54,
          3, 0, 1, 40, -1, 2, 2, 4680, 24, -15, 54, 3, 44, 40, -1, 4, 2, 2696,
          4, 4, 54, 0, 1, 2, 2976, 12, -13, 8, 2, 1964, 12, -10, 54, 3, 0, 1,
          40, -1, 2, 2, 4680, 24, -15, 54, 3, 44, 28, -1, 5, 0, 44, 17, 0, 6,
          3298, 40, -1, 1, 2, 3848, 16, 22, 54, 0, 1, 40, 0, 6, 3, 0, 1, 40, -1,
          2, 2, 4680, 24, -15, 54, 3, 44, 0, 0, 2, 3324, 8, 13, 8, 2, 4400, 4,
          -7, 54, 3, 0, 1, 40, -1, 2, 2, 4680, 24, -15, 54, 3, 44, 40, -1, 2,
          17, 0, 6, 3519, 32, 3496, 17, 0, 6, 3510, 31, -1, 6, 40, -1, 2, 17, 0,
          6, 3519, 2, 2072, 20, 16, 8, 17, 0, 6, 3519, 52, 48, 3530, 46, 31, -1,
          15, 17, 0, 6, 3573, 0, 0, 4, 16, 44, 15, 1, 0, 1, 0, 0, 2, 3324, 8,
          13, 8, 2, 4400, 4, -7, 54, 3, 40, -1, 1, 2, 3848, 16, 22, 54, 0, 1,
          40, 0, 6, 3, 0, 2, 17, 0, 6, 3572, 52, 48, 3583, 46, 31, -1, 16, 17,
          0, 6, 3894, 0, 0, 4, 17, 44, 15, 1, 0, 1, 40, -1, 1, 2, 3848, 16, 22,
          54, 31, -1, 2, 40, -1, 1, 2, 2320, 8, 11, 54, 2, 788, 28, -21, 53, 6,
          3630, 40, 0, 53, 2, 708, 12, -13, 54, 17, 0, 6, 3638, 40, 0, 53, 2,
          1192, 12, -10, 54, 31, -1, 3, 40, -1, 2, 2, 284, 20, -18, 54, 5, 11,
          6, 3658, 44, 2, 2640, 0, 2, 31, -1, 4, 2, 3796, 8, 7, 0, 1, 40, -1, 1,
          2, 600, 36, -15, 54, 2, 4160, 20, 9, 54, 3, 31, -1, 5, 48, 0, 31, -1,
          6, 40, -1, 3, 40, 0, 53, 2, 1192, 12, -10, 54, 53, 6, 3779, 40, -1, 2,
          2, 3628, 20, -3, 54, 48, 0, 0, 2, 40, -1, 4, 2, 4860, 12, 12, 54, 3,
          40, -1, 5, 16, 40, -1, 2, 2, 1832, 40, -15, 54, 0, 1, 40, -1, 4, 2,
          4860, 12, 12, 54, 3, 16, 31, -1, 7, 40, -1, 5, 2, 2028, 16, 10, 54,
          40, -1, 7, 2, 2028, 16, 10, 54, 38, 48, 100, 9, 45, -1, 6, 44, 17, 0,
          6, 3833, 40, -1, 2, 2, 1832, 40, -15, 54, 40, -1, 2, 2, 3628, 20, -3,
          54, 0, 2, 40, -1, 4, 2, 4860, 12, 12, 54, 3, 31, -1, 8, 40, -1, 8, 2,
          2028, 16, 10, 54, 40, -1, 4, 2, 2028, 16, 10, 54, 38, 48, 100, 9, 45,
          -1, 6, 44, 0, 0, 2, 3324, 8, 13, 8, 2, 4400, 4, -7, 54, 3, 40, -1, 2,
          0, 1, 40, 0, 6, 3, 40, -1, 3, 40, 0, 53, 2, 1192, 12, -10, 54, 53, 6,
          3880, 40, -1, 5, 0, 1, 35, 3, 17, 0, 6, 3881, 21, 40, -1, 6, 40, -1,
          3, 0, 5, 17, 0, 6, 3893, 52, 48, 3904, 46, 31, -1, 17, 17, 0, 6, 4121,
          0, 0, 4, 18, 44, 15, 1, 0, 1, 48, 0, 31, -1, 2, 40, -1, 1, 2, 3848,
          16, 22, 54, 2, 3260, 36, 9, 8, 42, 5, 11, 6, 3951, 44, 40, -1, 1, 2,
          3848, 16, 22, 54, 2, 3416, 76, -21, 8, 42, 6, 3979, 40, -1, 1, 2,
          3848, 16, 22, 54, 2, 284, 20, -18, 54, 2, 2028, 16, 10, 54, 45, -1, 2,
          44, 17, 0, 6, 4034, 40, -1, 1, 2, 3848, 16, 22, 54, 2, 4096, 32, -16,
          8, 42, 5, 6, 4010, 44, 40, -1, 1, 2, 3848, 16, 22, 54, 2, 4560, 28,
          13, 54, 6, 4034, 40, -1, 1, 2, 3848, 16, 22, 54, 2, 816, 20, 17, 54,
          2, 2028, 16, 10, 54, 45, -1, 2, 44, 40, -1, 1, 2, 3620, 8, 12, 54, 6,
          4061, 40, -1, 1, 2, 3620, 8, 12, 54, 2, 2028, 16, 10, 54, 17, 0, 6,
          4064, 48, 1, 25, 31, -1, 3, 0, 0, 2, 3324, 8, 13, 8, 2, 4400, 4, -7,
          54, 3, 40, -1, 1, 2, 3848, 16, 22, 54, 0, 1, 40, 0, 6, 3, 40, -1, 1,
          2, 3848, 16, 22, 54, 0, 1, 40, 0, 9, 3, 40, -1, 3, 40, -1, 2, 0, 5,
          17, 0, 6, 4120, 52, 48, 4131, 46, 31, -1, 18, 17, 0, 6, 4383, 0, 0, 4,
          19, 44, 15, 1, 0, 1, 40, -1, 1, 2, 2320, 8, 11, 54, 2, 2716, 60, -17,
          53, 5, 6, 4165, 44, 40, -1, 1, 2, 3560, 24, 0, 54, 6, 4300, 0, 0, 40,
          -1, 1, 2, 3560, 24, 0, 54, 3, 31, -1, 2, 0, 0, 48, 4190, 46, 17, 0, 6,
          4275, 0, 0, 4, 20, 31, -1, 0, 15, 1, 1, 2, 0, 0, 2, 3324, 8, 13, 8, 2,
          4400, 4, -7, 54, 3, 40, -1, 2, 2, 3848, 16, 22, 54, 0, 1, 40, 0, 6, 3,
          40, -1, 2, 2, 4996, 20, 18, 54, 40, -1, 2, 2, 1648, 12, 1, 54, 40, -1,
          2, 2, 3656, 72, -22, 54, 40, -1, 2, 2, 4804, 32, -20, 54, 40, -1, 2,
          2, 4304, 20, -16, 54, 0, 7, 17, 0, 6, 4274, 52, 0, 1, 40, -1, 2, 2,
          1992, 20, -19, 54, 3, 2, 3524, 8, 10, 54, 3, 17, 0, 6, 4382, 17, 0, 6,
          4373, 0, 0, 2, 3324, 8, 13, 8, 2, 4400, 4, -7, 54, 3, 40, -1, 1, 2,
          3848, 16, 22, 54, 0, 1, 40, 0, 6, 3, 40, -1, 1, 2, 4996, 20, 18, 54,
          40, -1, 1, 2, 1648, 12, 1, 54, 40, -1, 1, 2, 3656, 72, -22, 54, 40,
          -1, 1, 2, 4804, 32, -20, 54, 40, -1, 1, 2, 4304, 20, -16, 54, 0, 7,
          17, 0, 6, 4382, 2, 2072, 20, 16, 8, 17, 0, 6, 4382, 52, 48, 4393, 46,
          31, -1, 19, 17, 0, 6, 4546, 0, 0, 4, 21, 44, 15, 0, 0, 43, 0, 49, 2,
          508, 44, -21, 34, 44, 2, 4200, 12, -5, 0, 0, 2, 3324, 8, 13, 8, 2,
          4400, 4, -7, 54, 3, 2, 4072, 24, 5, 48, 0, 2, 4324, 24, -13, 43, 0, 2,
          3316, 4, 19, 43, 0, 2, 1608, 20, -7, 43, 0, 2, 1976, 8, 16, 2, 32, 20,
          17, 17, 1, 2, 3776, 8, -4, 17, 1, 2, 3516, 8, 13, 17, 1, 2, 1372, 8,
          -3, 17, 1, 2, 2208, 8, 1, 17, 1, 2, 4512, 16, 9, 17, 1, 43, 6, 2,
          1696, 24, -11, 17, 0, 2, 3756, 20, -10, 17, 0, 43, 8, 49, 2, 1420, 8,
          -1, 34, 44, 49, 0, 1, 49, 2, 72, 20, 15, 54, 2, 3824, 8, 3, 54, 3, 49,
          2, 72, 20, 15, 34, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 4545, 52, 48,
          4556, 46, 31, -1, 20, 17, 0, 6, 4649, 0, 0, 4, 22, 44, 15, 0, 0, 12,
          4631, 2, 1948, 16, -1, 0, 1, 2, 3084, 44, -17, 8, 2, 2172, 24, -1, 54,
          3, 31, -1, 1, 40, -1, 1, 2, 2028, 16, 10, 54, 48, 0, 55, 6, 4618, 40,
          -1, 1, 48, 0, 54, 2, 2424, 16, -10, 54, 17, 0, 6, 4648, 17, 0, 6,
          4625, 48, 1, 25, 17, 0, 6, 4648, 32, 4627, 17, 0, 6, 4639, 31, -1, 2,
          21, 17, 0, 6, 4648, 2, 2072, 20, 16, 8, 17, 0, 6, 4648, 52, 48, 4659,
          46, 31, -1, 21, 17, 0, 6, 4712, 0, 0, 4, 23, 44, 15, 0, 0, 12, 4694,
          2, 4004, 12, 6, 8, 2, 1400, 16, 7, 54, 2, 2124, 8, 3, 54, 17, 0, 6,
          4711, 32, 4690, 17, 0, 6, 4702, 31, -1, 1, 21, 17, 0, 6, 4711, 2,
          2072, 20, 16, 8, 17, 0, 6, 4711, 52, 48, 4722, 46, 31, -1, 22, 17, 0,
          6, 4775, 0, 0, 4, 24, 44, 15, 0, 0, 12, 4757, 2, 4444, 16, 5, 8, 2,
          1400, 16, 7, 54, 2, 2124, 8, 3, 54, 17, 0, 6, 4774, 32, 4753, 17, 0,
          6, 4765, 31, -1, 1, 21, 17, 0, 6, 4774, 2, 2072, 20, 16, 8, 17, 0, 6,
          4774, 52, 48, 4785, 46, 31, -1, 23, 17, 0, 6, 4834, 0, 0, 4, 25, 44,
          15, 0, 0, 12, 4816, 0, 0, 40, 0, 57, 2, 4160, 20, 9, 54, 3, 17, 0, 6,
          4833, 32, 4812, 17, 0, 6, 4824, 31, -1, 1, 21, 17, 0, 6, 4833, 2,
          2072, 20, 16, 8, 17, 0, 6, 4833, 52, 48, 4844, 46, 31, -1, 24, 17, 0,
          6, 4893, 0, 0, 4, 26, 44, 15, 0, 0, 12, 4875, 0, 0, 40, 0, 40, 2,
          4160, 20, 9, 54, 3, 17, 0, 6, 4892, 32, 4871, 17, 0, 6, 4883, 31, -1,
          1, 21, 17, 0, 6, 4892, 2, 2072, 20, 16, 8, 17, 0, 6, 4892, 52, 48,
          4903, 46, 31, -1, 25, 17, 0, 6, 5113, 0, 0, 4, 27, 44, 15, 1, 0, 1,
          12, 5100, 40, -1, 1, 2, 3620, 8, 12, 54, 31, -1, 2, 40, -1, 2, 48, 0,
          1, 41, 5, 6, 4948, 44, 40, -1, 2, 2, 4408, 4, 21, 54, 48, 0, 1, 41, 6,
          5094, 40, -1, 2, 2, 4408, 4, 21, 54, 2, 3044, 8, -15, 53, 6, 5002, 40,
          -1, 1, 2, 496, 12, 10, 54, 40, -1, 1, 2, 2776, 8, 14, 54, 0, 2, 0, 1,
          40, 0, 60, 48, 0, 54, 2, 4680, 24, -15, 54, 3, 44, 17, 0, 6, 5094, 40,
          -1, 2, 2, 4408, 4, 21, 54, 2, 28, 4, 19, 53, 6, 5046, 40, -1, 1, 2,
          496, 12, 10, 54, 40, -1, 1, 2, 2776, 8, 14, 54, 0, 2, 40, 0, 60, 48,
          1, 34, 44, 17, 0, 6, 5094, 40, -1, 2, 2, 4408, 4, 21, 54, 2, 784, 4,
          -3, 53, 6, 5094, 40, -1, 2, 2, 3044, 8, -15, 54, 40, -1, 2, 2, 2460,
          4, 19, 54, 0, 2, 0, 1, 40, 0, 60, 48, 2, 54, 2, 4680, 24, -15, 54, 3,
          44, 32, 5096, 17, 0, 6, 5103, 31, -1, 3, 2, 2072, 20, 16, 8, 17, 0, 6,
          5112, 52, 48, 5123, 46, 31, -1, 26, 17, 0, 6, 5286, 0, 0, 4, 28, 44,
          15, 2, 0, 1, 2, 12, 5273, 40, -1, 1, 2, 3620, 8, 12, 54, 31, -1, 3,
          40, -1, 3, 48, 0, 1, 41, 5, 6, 5169, 44, 40, -1, 3, 2, 4408, 4, 21,
          54, 48, 0, 1, 41, 6, 5267, 40, -1, 3, 2, 4408, 4, 21, 54, 2, 1604, 4,
          -4, 53, 6, 5267, 0, 0, 40, 0, 27, 3, 44, 2, 3024, 4, 1, 2, 3044, 8,
          -15, 40, 0, 58, 0, 1, 2, 4460, 8, 8, 8, 2, 0, 28, -9, 54, 3, 0, 1, 40,
          0, 28, 3, 2, 2460, 4, 19, 40, -1, 2, 2, 4408, 4, 21, 2, 784, 4, -3, 2,
          2776, 8, 14, 2, 4744, 16, 18, 43, 4, 0, 2, 2, 4004, 12, 6, 8, 2, 3392,
          12, 3, 54, 2, 2012, 16, 0, 54, 3, 44, 32, 5269, 17, 0, 6, 5276, 31,
          -1, 4, 2, 2072, 20, 16, 8, 17, 0, 6, 5285, 52, 48, 5296, 46, 31, -1,
          27, 17, 0, 6, 5375, 0, 0, 4, 29, 44, 15, 0, 0, 48, 0, 31, -1, 1, 40,
          -1, 1, 40, 0, 59, 2, 2028, 16, 10, 54, 39, 6, 5365, 40, 0, 59, 40, -1,
          1, 54, 24, 2, 568, 32, -15, 53, 6, 5356, 0, 0, 40, 0, 59, 40, -1, 1,
          54, 3, 40, 0, 58, 40, -1, 1, 34, 44, 28, -1, 1, 0, 44, 17, 0, 6, 5309,
          2, 2072, 20, 16, 8, 17, 0, 6, 5374, 52, 48, 5385, 46, 31, -1, 28, 17,
          0, 6, 5411, 0, 0, 4, 30, 44, 15, 1, 0, 1, 40, -1, 1, 0, 1, 7, 2, 1544,
          32, 16, 54, 3, 17, 0, 6, 5410, 52, 48, 5421, 46, 31, -1, 29, 17, 0, 6,
          5954, 0, 0, 4, 31, 44, 15, 0, 0, 12, 5894, 0, 0, 40, 0, 27, 3, 44, 48,
          0, 31, -1, 1, 40, -1, 1, 40, 0, 60, 48, 0, 54, 2, 2028, 16, 10, 54,
          39, 6, 5522, 40, 0, 60, 48, 0, 54, 40, -1, 1, 54, 48, 1, 54, 2, 4408,
          4, 21, 2, 1604, 4, -4, 2, 2776, 8, 14, 2, 4744, 16, 18, 43, 2, 0, 2,
          40, 0, 60, 48, 0, 54, 40, -1, 1, 54, 48, 0, 54, 2, 2012, 16, 0, 54, 3,
          44, 28, -1, 1, 0, 44, 17, 0, 6, 5443, 40, 0, 58, 0, 1, 2, 4460, 8, 8,
          8, 2, 0, 28, -9, 54, 3, 0, 1, 40, 0, 28, 3, 48, 0, 0, 2, 0, 1, 40, 0,
          60, 48, 2, 54, 2, 4680, 24, -15, 54, 3, 44, 48, 5570, 46, 17, 0, 6,
          5876, 0, 0, 4, 32, 31, -1, 0, 15, 1, 1, 2, 48, 5591, 46, 31, -1, 3,
          17, 0, 6, 5857, 0, 0, 4, 33, 44, 15, 1, 0, 1, 40, 0, 60, 48, 1, 54,
          31, -1, 2, 40, 0, 60, 48, 2, 54, 31, -1, 3, 40, -1, 2, 48, 0, 1, 53,
          5, 11, 6, 5637, 44, 40, -1, 3, 48, 0, 1, 53, 5, 11, 6, 5653, 44, 40,
          -1, 3, 2, 2028, 16, 10, 54, 48, 3, 39, 5, 6, 5663, 44, 40, -1, 1, 48,
          30, 39, 6, 5735, 40, -1, 1, 48, 10, 39, 6, 5679, 48, 1, 17, 0, 6,
          5681, 48, 3, 31, -1, 4, 40, -1, 4, 48, 5694, 46, 17, 0, 6, 5722, 0, 0,
          4, 34, 31, -1, 0, 15, 0, 1, 40, 33, 1, 40, 33, 4, 16, 0, 1, 40, 32, 3,
          3, 17, 0, 6, 5721, 52, 0, 2, 2, 3956, 48, -16, 8, 3, 44, 17, 0, 6,
          5847, 40, -1, 2, 48, 0, 1, 41, 5, 6, 5757, 44, 40, -1, 2, 2, 2028, 16,
          10, 54, 48, 2, 53, 6, 5824, 2, 4740, 4, 21, 40, -1, 3, 0, 1, 2, 4460,
          8, 8, 8, 2, 0, 28, -9, 54, 3, 2, 4408, 4, 21, 2, 1600, 4, -21, 2,
          2776, 8, 14, 2, 4744, 16, 18, 43, 3, 31, -1, 5, 40, -1, 2, 48, 1, 54,
          40, -1, 5, 0, 2, 40, -1, 2, 48, 0, 54, 2, 2012, 16, 0, 54, 3, 44, 0,
          0, 40, 0, 60, 48, 2, 34, 44, 48, 0, 40, 32, 2, 0, 2, 2, 3956, 48, -16,
          8, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 5856, 52, 48, 0, 0, 1, 40, -1,
          3, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 5875, 52, 0, 1, 2, 3128, 16,
          -10, 8, 10, 17, 0, 6, 5953, 32, 5890, 17, 0, 6, 5944, 31, -1, 2, 48,
          5904, 46, 17, 0, 6, 5932, 0, 0, 4, 35, 31, -1, 0, 15, 1, 1, 2, 0, 0,
          40, -1, 2, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 5931, 52, 0, 1, 2,
          3128, 16, -10, 8, 10, 17, 0, 6, 5953, 2, 2072, 20, 16, 8, 17, 0, 6,
          5953, 52, 48, 5964, 46, 31, -1, 30, 17, 0, 6, 6165, 0, 0, 4, 36, 44,
          15, 1, 0, 1, 40, -1, 1, 48, 0, 53, 6, 6006, 40, 0, 25, 2, 4412, 32,
          -20, 0, 2, 2, 4004, 12, 6, 8, 2, 92, 56, -13, 54, 3, 44, 17, 0, 6,
          6155, 48, 6013, 46, 17, 0, 6, 6047, 0, 0, 4, 37, 31, -1, 0, 15, 1, 1,
          2, 40, 36, 1, 40, -1, 2, 0, 2, 40, 0, 26, 3, 44, 2, 2072, 20, 16, 8,
          17, 0, 6, 6046, 52, 2, 4412, 32, -20, 0, 2, 2, 4004, 12, 6, 8, 2, 92,
          56, -13, 54, 3, 44, 2, 3024, 4, 1, 2, 4408, 4, 21, 2, 3044, 8, -15, 2,
          2776, 8, 14, 2, 4744, 16, 18, 43, 2, 0, 2, 2, 4004, 12, 6, 8, 2, 3392,
          12, 3, 54, 2, 2012, 16, 0, 54, 3, 44, 40, -1, 1, 48, 2, 53, 6, 6155,
          2, 3024, 4, 1, 2, 4408, 4, 21, 2, 28, 4, 19, 2, 2776, 8, 14, 2, 4744,
          16, 18, 43, 2, 0, 2, 2, 4004, 12, 6, 8, 2, 3392, 12, 3, 54, 2, 2012,
          16, 0, 54, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 6164, 52, 2, 3884, 20,
          11, 2, 4736, 4, -5, 2, 1456, 12, 4, 2, 4872, 8, -7, 2, 3928, 28, -15,
          2, 3008, 4, 18, 2, 1204, 60, -17, 2, 4348, 4, -1, 43, 4, 31, -1, 31,
          2, 2620, 20, -6, 2, 4268, 8, -14, 2, 2388, 12, 1, 2, 2448, 4, 9, 2,
          52, 20, -6, 2, 3792, 4, 19, 43, 3, 31, -1, 32, 2, 2716, 60, -17, 2,
          3864, 4, -3, 43, 1, 31, -1, 33, 2, 2092, 16, -9, 2, 2540, 4, 22, 2,
          4628, 36, -17, 2, 4016, 4, -3, 43, 2, 31, -1, 34, 2, 2216, 60, -18, 2,
          280, 4, -5, 43, 1, 31, -1, 35, 2, 2796, 48, -17, 48, 6289, 46, 17, 0,
          6, 6432, 0, 0, 4, 38, 31, -1, 0, 15, 1, 1, 2, 21, 31, -1, 3, 40, 0,
          31, 40, -1, 2, 54, 48, 0, 1, 41, 6, 6328, 40, 0, 31, 40, -1, 2, 54,
          45, -1, 3, 44, 40, 0, 32, 40, -1, 2, 54, 48, 0, 1, 41, 6, 6352, 40, 0,
          32, 40, -1, 2, 54, 45, -1, 3, 44, 40, 0, 33, 40, -1, 2, 54, 48, 0, 1,
          41, 6, 6376, 40, 0, 33, 40, -1, 2, 54, 45, -1, 3, 44, 40, 0, 34, 40,
          -1, 2, 54, 48, 0, 1, 41, 6, 6400, 40, 0, 34, 40, -1, 2, 54, 45, -1, 3,
          44, 40, 0, 35, 40, -1, 2, 54, 48, 0, 1, 41, 6, 6424, 40, 0, 35, 40,
          -1, 2, 54, 45, -1, 3, 44, 40, -1, 3, 17, 0, 6, 6431, 52, 2, 3532, 12,
          11, 48, 6443, 46, 17, 0, 6, 6572, 0, 0, 4, 39, 31, -1, 0, 15, 2, 1, 2,
          3, 40, 0, 35, 40, -1, 2, 54, 31, -1, 4, 21, 31, -1, 5, 0, 0, 31, -1,
          6, 48, 6481, 46, 17, 0, 6, 6567, 0, 0, 4, 40, 31, -1, 0, 15, 1, 1, 2,
          40, 39, 6, 40, -1, 2, 0, 2, 40, 0, 4, 3, 45, 39, 5, 44, 40, 39, 5, 21,
          53, 6, 6520, 19, 17, 0, 6, 6566, 40, 39, 5, 2, 176, 56, -17, 54, 45,
          39, 6, 44, 40, 39, 5, 2, 2132, 16, 14, 54, 45, 39, 5, 44, 40, 39, 5,
          40, 39, 4, 0, 2, 40, 39, 3, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 6566,
          52, 17, 0, 6, 6571, 52, 2, 3012, 12, -1, 48, 6583, 46, 17, 0, 6, 6668,
          0, 0, 4, 41, 31, -1, 0, 15, 2, 1, 2, 3, 40, 0, 34, 40, -1, 2, 54, 31,
          -1, 4, 21, 31, -1, 5, 48, 6616, 46, 17, 0, 6, 6663, 0, 0, 4, 42, 31,
          -1, 0, 15, 1, 1, 2, 40, -1, 2, 0, 1, 40, 0, 2, 3, 45, 41, 5, 44, 40,
          41, 5, 40, 41, 4, 0, 2, 40, 41, 3, 3, 44, 2, 2072, 20, 16, 8, 17, 0,
          6, 6662, 52, 17, 0, 6, 6667, 52, 2, 1372, 8, -3, 48, 6679, 46, 17, 0,
          6, 6764, 0, 0, 4, 43, 31, -1, 0, 15, 2, 1, 2, 3, 40, 0, 31, 40, -1, 2,
          54, 31, -1, 4, 21, 31, -1, 5, 48, 6712, 46, 17, 0, 6, 6759, 0, 0, 4,
          44, 31, -1, 0, 15, 1, 1, 2, 40, -1, 2, 0, 1, 40, 0, 3, 3, 45, 43, 5,
          44, 40, 43, 5, 40, 43, 4, 0, 2, 40, 43, 3, 3, 44, 2, 2072, 20, 16, 8,
          17, 0, 6, 6758, 52, 17, 0, 6, 6763, 52, 2, 2716, 60, -17, 48, 6775,
          46, 17, 0, 6, 6892, 0, 0, 4, 45, 31, -1, 0, 15, 2, 1, 2, 3, 40, 0, 33,
          40, -1, 2, 54, 31, -1, 4, 21, 31, -1, 5, 48, 6808, 46, 17, 0, 6, 6887,
          0, 0, 4, 46, 31, -1, 0, 15, 1, 1, 2, 40, -1, 2, 0, 1, 40, 0, 1, 3, 45,
          45, 5, 44, 48, 0, 31, -1, 3, 40, -1, 3, 40, 45, 5, 2, 2028, 16, 10,
          54, 39, 6, 6877, 40, 45, 5, 40, -1, 3, 54, 40, 45, 4, 0, 2, 40, 45, 3,
          3, 44, 28, -1, 3, 0, 44, 17, 0, 6, 6837, 2, 2072, 20, 16, 8, 17, 0, 6,
          6886, 52, 17, 0, 6, 6891, 52, 2, 2684, 12, -9, 48, 6903, 46, 17, 0, 6,
          6988, 0, 0, 4, 47, 31, -1, 0, 15, 2, 1, 2, 3, 40, 0, 32, 40, -1, 2,
          54, 31, -1, 4, 21, 31, -1, 5, 48, 6936, 46, 17, 0, 6, 6983, 0, 0, 4,
          48, 31, -1, 0, 15, 1, 1, 2, 40, -1, 2, 0, 1, 40, 0, 0, 3, 45, 47, 5,
          44, 40, 47, 5, 40, 47, 4, 0, 2, 40, 47, 3, 3, 44, 2, 2072, 20, 16, 8,
          17, 0, 6, 6982, 52, 17, 0, 6, 6987, 52, 43, 6, 31, -1, 36, 48, 16, 31,
          -1, 37, 48, 15, 48, 1e3, 9, 31, -1, 38, 48, 7013, 46, 17, 0, 6, 7849,
          0, 0, 4, 49, 31, -1, 0, 15, 4, 1, 2, 3, 4, 5, 0, 0, 2, 3324, 8, 13, 8,
          2, 4400, 4, -7, 54, 3, 49, 2, 508, 44, -21, 54, 2, 3152, 4, 13, 34,
          44, 40, -1, 2, 48, 0, 1, 53, 6, 7081, 49, 2, 1420, 8, -1, 54, 2, 1976,
          8, 16, 54, 2, 2684, 12, -9, 54, 17, 0, 6, 7084, 40, -1, 2, 49, 2,
          1420, 8, -1, 54, 2, 1976, 8, 16, 54, 2, 2684, 12, -9, 34, 44, 40, -1,
          4, 48, 0, 1, 53, 6, 7130, 49, 2, 1420, 8, -1, 54, 2, 1976, 8, 16, 54,
          2, 1372, 8, -3, 54, 17, 0, 6, 7133, 40, -1, 4, 49, 2, 1420, 8, -1, 54,
          2, 1976, 8, 16, 54, 2, 1372, 8, -3, 34, 44, 40, -1, 3, 48, 0, 1, 53,
          6, 7179, 49, 2, 1420, 8, -1, 54, 2, 1976, 8, 16, 54, 2, 2208, 8, 1,
          54, 17, 0, 6, 7182, 40, -1, 3, 49, 2, 1420, 8, -1, 54, 2, 1976, 8, 16,
          54, 2, 2208, 8, 1, 34, 44, 40, -1, 5, 48, 0, 1, 53, 6, 7228, 49, 2,
          1420, 8, -1, 54, 2, 1976, 8, 16, 54, 2, 2132, 16, 14, 54, 17, 0, 6,
          7231, 40, -1, 5, 49, 2, 1420, 8, -1, 54, 2, 1976, 8, 16, 54, 2, 2132,
          16, 14, 34, 44, 49, 2, 1420, 8, -1, 54, 2, 1696, 24, -11, 54, 17, 0,
          53, 6, 7825, 2, 4444, 16, 5, 8, 2, 1748, 8, 18, 54, 0, 1, 20, 10, 31,
          -1, 6, 49, 2, 1420, 8, -1, 54, 2, 1976, 8, 16, 54, 2, 2684, 12, -9,
          54, 6, 7455, 17, 1, 49, 2, 72, 20, 15, 54, 2, 52, 20, -6, 0, 2, 40, 0,
          36, 2, 2684, 12, -9, 54, 3, 2, 52, 20, -6, 0, 3, 40, -1, 6, 2, 92, 56,
          -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2, 2620, 20, -6, 0, 2,
          40, 0, 36, 2, 2684, 12, -9, 54, 3, 2, 2620, 20, -6, 0, 3, 40, -1, 6,
          2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2, 2388, 12,
          1, 0, 2, 40, 0, 36, 2, 2684, 12, -9, 54, 3, 2, 2388, 12, 1, 0, 3, 40,
          -1, 6, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2,
          2716, 60, -17, 0, 2, 40, 0, 36, 2, 2716, 60, -17, 54, 3, 2, 2716, 60,
          -17, 0, 3, 40, -1, 6, 2, 92, 56, -13, 54, 3, 44, 49, 2, 1420, 8, -1,
          54, 2, 1976, 8, 16, 54, 2, 2208, 8, 1, 54, 17, 1, 53, 6, 7554, 17, 1,
          49, 2, 72, 20, 15, 54, 2, 2092, 16, -9, 0, 2, 40, 0, 36, 2, 3012, 12,
          -1, 54, 3, 2, 2092, 16, -9, 0, 3, 40, -1, 6, 2, 92, 56, -13, 54, 3,
          44, 17, 1, 49, 2, 72, 20, 15, 54, 2, 4628, 36, -17, 0, 2, 40, 0, 36,
          2, 3012, 12, -1, 54, 3, 2, 4628, 36, -17, 0, 3, 40, -1, 6, 2, 92, 56,
          -13, 54, 3, 44, 49, 2, 1420, 8, -1, 54, 2, 1976, 8, 16, 54, 2, 1372,
          8, -3, 54, 5, 6, 7605, 44, 2, 4444, 16, 5, 8, 2, 1748, 8, 18, 54, 2,
          1204, 60, -17, 0, 2, 13, 2, 1684, 12, 10, 54, 2, 2872, 12, -3, 54, 3,
          17, 1, 53, 6, 7724, 17, 1, 49, 2, 72, 20, 15, 54, 2, 1204, 60, -17, 0,
          2, 40, 0, 36, 2, 1372, 8, -3, 54, 3, 2, 1204, 60, -17, 0, 3, 40, -1,
          6, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2, 1456,
          12, 4, 0, 2, 40, 0, 36, 2, 1372, 8, -3, 54, 3, 2, 1456, 12, 4, 0, 3,
          40, -1, 6, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2,
          3928, 28, -15, 0, 2, 40, 0, 36, 2, 1372, 8, -3, 54, 3, 2, 3928, 28,
          -15, 0, 3, 40, -1, 6, 2, 92, 56, -13, 54, 3, 44, 49, 2, 1420, 8, -1,
          54, 2, 1976, 8, 16, 54, 2, 2132, 16, 14, 54, 5, 6, 7770, 44, 2, 4004,
          12, 6, 8, 2, 2216, 60, -18, 0, 2, 13, 2, 1684, 12, 10, 54, 2, 2872,
          12, -3, 54, 3, 17, 1, 53, 6, 7811, 17, 1, 49, 2, 72, 20, 15, 54, 2,
          2216, 60, -18, 0, 2, 40, 0, 36, 2, 3532, 12, 11, 54, 3, 2, 2216, 60,
          -18, 0, 3, 40, -1, 6, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 1420,
          8, -1, 54, 2, 1696, 24, -11, 34, 44, 17, 1, 49, 2, 1420, 8, -1, 54, 2,
          3756, 20, -10, 34, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 7848, 52, 40, -1,
          5, 2, 304, 68, -19, 54, 2, 1976, 8, 16, 34, 44, 48, 7870, 46, 17, 0,
          6, 7904, 0, 0, 4, 50, 31, -1, 0, 15, 0, 1, 17, 0, 49, 2, 1420, 8, -1,
          54, 2, 3756, 20, -10, 34, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 7903, 52,
          40, -1, 5, 2, 304, 68, -19, 54, 2, 4388, 12, 21, 34, 44, 48, 7925, 46,
          17, 0, 6, 7951, 0, 0, 4, 51, 31, -1, 0, 15, 0, 1, 49, 2, 1420, 8, -1,
          54, 2, 4200, 12, -5, 54, 17, 0, 6, 7950, 52, 40, -1, 5, 2, 304, 68,
          -19, 54, 2, 1492, 8, 6, 34, 44, 48, 7972, 46, 17, 0, 6, 8137, 0, 0, 4,
          52, 31, -1, 0, 15, 0, 1, 49, 2, 1420, 8, -1, 54, 2, 1608, 20, -7, 54,
          0, 1, 2, 4276, 12, 18, 8, 2, 2208, 8, 1, 54, 3, 31, -1, 2, 40, -1, 2,
          2, 2028, 16, 10, 54, 31, -1, 3, 48, 0, 31, -1, 4, 40, -1, 4, 40, -1,
          3, 39, 6, 8126, 40, -1, 2, 40, -1, 4, 54, 31, -1, 5, 0, 0, 49, 2,
          1420, 8, -1, 54, 2, 1608, 20, -7, 54, 40, -1, 5, 54, 2, 4160, 20, 9,
          54, 3, 49, 2, 508, 44, -21, 54, 40, -1, 5, 34, 44, 0, 0, 49, 2, 1420,
          8, -1, 54, 2, 1608, 20, -7, 54, 40, -1, 5, 54, 2, 5016, 20, 0, 54, 3,
          49, 2, 508, 44, -21, 54, 40, -1, 5, 2, 4552, 8, 8, 16, 34, 44, 28, -1,
          4, 0, 44, 17, 0, 6, 8025, 49, 2, 508, 44, -21, 54, 17, 0, 6, 8136, 52,
          40, -1, 5, 2, 304, 68, -19, 54, 2, 4160, 20, 9, 34, 44, 48, 8158, 46,
          17, 0, 6, 8194, 0, 0, 4, 53, 31, -1, 0, 15, 2, 1, 2, 3, 40, -1, 3, 49,
          2, 508, 44, -21, 54, 40, -1, 2, 34, 44, 2, 2072, 20, 16, 8, 17, 0, 6,
          8193, 52, 40, -1, 5, 2, 304, 68, -19, 54, 2, 4212, 32, -16, 34, 44,
          48, 8215, 46, 17, 0, 6, 8258, 0, 0, 4, 54, 31, -1, 0, 15, 0, 1, 43, 0,
          49, 2, 508, 44, -21, 34, 44, 43, 0, 49, 2, 1420, 8, -1, 54, 2, 1608,
          20, -7, 34, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 8257, 52, 40, -1, 5, 2,
          304, 68, -19, 54, 2, 1588, 12, 17, 34, 44, 48, 8279, 46, 17, 0, 6,
          8317, 0, 0, 4, 55, 31, -1, 0, 15, 2, 1, 2, 3, 40, -1, 3, 40, -1, 2, 0,
          2, 49, 2, 72, 20, 15, 54, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 8316,
          52, 40, -1, 5, 2, 304, 68, -19, 54, 2, 3028, 16, 15, 34, 44, 48, 8338,
          46, 17, 0, 6, 8512, 0, 0, 4, 56, 31, -1, 0, 15, 2, 1, 2, 3, 49, 2,
          1420, 8, -1, 54, 2, 3756, 20, -10, 54, 17, 0, 53, 6, 8371, 19, 17, 0,
          6, 8511, 12, 8482, 40, -1, 3, 2, 2028, 16, 10, 54, 48, 1, 36, 31, -1,
          4, 40, -1, 3, 40, -1, 4, 54, 31, -1, 5, 49, 2, 1420, 8, -1, 54, 2,
          1608, 20, -7, 54, 40, -1, 2, 54, 11, 6, 8446, 40, 0, 38, 40, 0, 37, 0,
          2, 26, 2, 4772, 32, -15, 54, 10, 49, 2, 1420, 8, -1, 54, 2, 1608, 20,
          -7, 54, 40, -1, 2, 34, 44, 40, -1, 3, 40, -1, 5, 0, 2, 49, 2, 1420, 8,
          -1, 54, 2, 1608, 20, -7, 54, 40, -1, 2, 54, 2, 4680, 24, -15, 54, 3,
          44, 32, 8478, 17, 0, 6, 8502, 31, -1, 6, 40, -1, 6, 2, 2132, 16, 14,
          0, 2, 26, 2, 1468, 24, 19, 54, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6,
          8511, 52, 40, -1, 5, 2, 304, 68, -19, 54, 2, 72, 20, 15, 34, 44, 0, 0,
          40, -1, 5, 10, 31, -1, 39, 40, -1, 39, 31, -1, 40, 2, 3156, 8, 6, 48,
          8, 2, 2412, 12, 19, 48, 7, 2, 4352, 12, -9, 48, 6, 2, 2164, 4, 2, 48,
          5, 2, 4588, 16, 5, 48, 4, 2, 2640, 16, -9, 48, 3, 2, 2784, 12, -12,
          48, 2, 2, 2544, 16, 9, 48, 1, 2, 1720, 16, 14, 48, 0, 43, 9, 31, -1,
          41, 43, 0, 31, -1, 42, 2, 164, 12, 12, 2, 2512, 12, 22, 48, 62, 2,
          5036, 8, 17, 48, 61, 2, 3552, 8, 12, 48, 60, 43, 3, 2, 1768, 8, -5, 2,
          3596, 24, 8, 48, 53, 2, 4664, 16, -21, 48, 52, 2, 3648, 8, -17, 48,
          51, 2, 1768, 8, -5, 48, 50, 43, 4, 2, 3728, 28, 21, 2, 1192, 12, -10,
          48, 41, 2, 708, 12, -13, 48, 40, 43, 2, 2, 2988, 12, -18, 2, 1628, 12,
          -4, 48, 30, 43, 1, 2, 4192, 8, 17, 2, 5036, 8, 17, 48, 21, 2, 3552, 8,
          12, 48, 20, 43, 2, 2, 3916, 12, -17, 2, 2440, 8, 2, 48, 13, 2, 2512,
          12, 22, 48, 12, 2, 5036, 8, 17, 48, 11, 2, 3552, 8, 12, 48, 10, 43, 4,
          2, 1756, 12, 13, 2, 2452, 8, -21, 48, 3, 2, 2512, 12, 22, 48, 2, 2,
          2196, 12, 6, 48, 1, 2, 1640, 8, -15, 48, 0, 43, 4, 43, 7, 31, -1, 43,
          2, 3884, 20, 11, 40, -1, 43, 2, 1756, 12, 13, 54, 2, 2452, 8, -21, 54,
          2, 1456, 12, 4, 40, -1, 43, 2, 1756, 12, 13, 54, 2, 2512, 12, 22, 54,
          2, 3928, 28, -15, 40, -1, 43, 2, 1756, 12, 13, 54, 2, 2196, 12, 6, 54,
          2, 1204, 60, -17, 40, -1, 43, 2, 1756, 12, 13, 54, 2, 1640, 8, -15,
          54, 43, 4, 31, -1, 44, 2, 4836, 24, 17, 40, -1, 43, 2, 3916, 12, -17,
          54, 2, 2440, 8, 2, 54, 2, 2620, 20, -6, 40, -1, 43, 2, 3916, 12, -17,
          54, 2, 2512, 12, 22, 54, 2, 2388, 12, 1, 40, -1, 43, 2, 3916, 12, -17,
          54, 2, 5036, 8, 17, 54, 2, 52, 20, -6, 40, -1, 43, 2, 3916, 12, -17,
          54, 2, 3552, 8, 12, 54, 43, 4, 31, -1, 45, 2, 2092, 16, -9, 40, -1,
          43, 2, 4192, 8, 17, 54, 2, 5036, 8, 17, 54, 2, 4628, 36, -17, 40, -1,
          43, 2, 4192, 8, 17, 54, 2, 3552, 8, 12, 54, 43, 2, 31, -1, 46, 2,
          3776, 8, -4, 40, -1, 43, 2, 2988, 12, -18, 54, 2, 1628, 12, -4, 54,
          43, 1, 31, -1, 47, 2, 3e3, 8, -1, 40, -1, 43, 2, 3728, 28, 21, 54, 2,
          1192, 12, -10, 54, 2, 788, 28, -21, 40, -1, 43, 2, 3728, 28, 21, 54,
          2, 708, 12, -13, 54, 43, 2, 31, -1, 48, 2, 2108, 16, -1, 40, -1, 43,
          2, 1768, 8, -5, 54, 2, 3596, 24, 8, 54, 2, 4364, 24, 18, 40, -1, 43,
          2, 1768, 8, -5, 54, 2, 4664, 16, -21, 54, 2, 2888, 8, 7, 40, -1, 43,
          2, 1768, 8, -5, 54, 2, 3648, 8, -17, 54, 2, 3516, 8, 13, 40, -1, 43,
          2, 1768, 8, -5, 54, 2, 1768, 8, -5, 54, 43, 4, 31, -1, 49, 2, 2716,
          60, -17, 40, -1, 43, 2, 164, 12, 12, 54, 2, 2512, 12, 22, 54, 2, 4020,
          12, -5, 40, -1, 43, 2, 164, 12, 12, 54, 2, 5036, 8, 17, 54, 2, 372,
          28, 17, 40, -1, 43, 2, 164, 12, 12, 54, 2, 3552, 8, 12, 54, 43, 3, 31,
          -1, 50, 2, 4512, 16, 9, 48, 9158, 46, 17, 0, 6, 9243, 0, 0, 4, 57, 31,
          -1, 0, 15, 2, 1, 2, 3, 40, 0, 50, 40, -1, 2, 54, 31, -1, 4, 21, 31,
          -1, 5, 48, 9191, 46, 17, 0, 6, 9238, 0, 0, 4, 58, 31, -1, 0, 15, 1, 1,
          2, 40, -1, 2, 0, 1, 40, 0, 18, 3, 45, 57, 5, 44, 40, 57, 5, 40, 57, 4,
          0, 2, 40, 57, 3, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 9237, 52, 17, 0,
          6, 9242, 52, 2, 3776, 8, -4, 48, 9254, 46, 17, 0, 6, 9334, 0, 0, 4,
          59, 31, -1, 0, 15, 2, 1, 2, 3, 40, 0, 47, 40, -1, 2, 54, 31, -1, 4,
          48, 9283, 46, 17, 0, 6, 9329, 0, 0, 4, 60, 31, -1, 0, 15, 1, 1, 2, 40,
          -1, 2, 0, 1, 40, 0, 17, 3, 31, -1, 3, 40, -1, 3, 40, 59, 4, 0, 2, 40,
          59, 3, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 9328, 52, 17, 0, 6, 9333,
          52, 2, 32, 20, 17, 48, 9345, 46, 17, 0, 6, 9425, 0, 0, 4, 61, 31, -1,
          0, 15, 2, 1, 2, 3, 40, 0, 48, 40, -1, 2, 54, 31, -1, 4, 48, 9374, 46,
          17, 0, 6, 9420, 0, 0, 4, 62, 31, -1, 0, 15, 1, 1, 2, 40, -1, 2, 0, 1,
          40, 0, 16, 3, 31, -1, 3, 40, -1, 3, 40, 61, 4, 0, 2, 40, 61, 3, 3, 44,
          2, 2072, 20, 16, 8, 17, 0, 6, 9419, 52, 17, 0, 6, 9424, 52, 2, 3516,
          8, 13, 48, 9436, 46, 17, 0, 6, 9521, 0, 0, 4, 63, 31, -1, 0, 15, 2, 1,
          2, 3, 40, 0, 49, 40, -1, 2, 54, 31, -1, 4, 21, 31, -1, 5, 48, 9469,
          46, 17, 0, 6, 9516, 0, 0, 4, 64, 31, -1, 0, 15, 1, 1, 2, 40, -1, 2, 0,
          1, 40, 0, 15, 3, 45, 63, 5, 44, 40, 63, 5, 40, 63, 4, 0, 2, 40, 63, 3,
          3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 9515, 52, 17, 0, 6, 9520, 52, 2,
          3012, 12, -1, 48, 9532, 46, 17, 0, 6, 9617, 0, 0, 4, 65, 31, -1, 0,
          15, 2, 1, 2, 3, 40, 0, 46, 40, -1, 2, 54, 31, -1, 4, 21, 31, -1, 5,
          48, 9565, 46, 17, 0, 6, 9612, 0, 0, 4, 66, 31, -1, 0, 15, 1, 1, 2, 40,
          -1, 2, 0, 1, 40, 0, 13, 3, 45, 65, 5, 44, 40, 65, 5, 40, 65, 4, 0, 2,
          40, 65, 3, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 9611, 52, 17, 0, 6,
          9616, 52, 2, 1372, 8, -3, 48, 9628, 46, 17, 0, 6, 9713, 0, 0, 4, 67,
          31, -1, 0, 15, 2, 1, 2, 3, 40, 0, 44, 40, -1, 2, 54, 31, -1, 4, 21,
          31, -1, 5, 48, 9661, 46, 17, 0, 6, 9708, 0, 0, 4, 68, 31, -1, 0, 15,
          1, 1, 2, 40, -1, 2, 0, 1, 40, 0, 14, 3, 45, 67, 5, 44, 40, 67, 5, 40,
          67, 4, 0, 2, 40, 67, 3, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 9707, 52,
          17, 0, 6, 9712, 52, 2, 2684, 12, -9, 48, 9724, 46, 17, 0, 6, 9809, 0,
          0, 4, 69, 31, -1, 0, 15, 2, 1, 2, 3, 40, 0, 45, 40, -1, 2, 54, 31, -1,
          4, 21, 31, -1, 5, 48, 9757, 46, 17, 0, 6, 9804, 0, 0, 4, 70, 31, -1,
          0, 15, 1, 1, 2, 40, -1, 2, 0, 1, 40, 0, 12, 3, 45, 69, 5, 44, 40, 69,
          5, 40, 69, 4, 0, 2, 40, 69, 3, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6,
          9803, 52, 17, 0, 6, 9808, 52, 43, 7, 31, -1, 51, 2, 3052, 16, 12, 48,
          1, 48, 7, 47, 2, 3224, 24, 10, 48, 1, 48, 6, 47, 2, 2300, 20, 15, 48,
          1, 48, 5, 47, 2, 2936, 20, 6, 48, 1, 48, 4, 47, 2, 148, 16, 8, 48, 1,
          48, 3, 47, 2, 2400, 12, -8, 48, 1, 48, 2, 47, 2, 3868, 16, 19, 48, 1,
          48, 1, 47, 2, 2656, 16, -12, 48, 1, 48, 0, 47, 43, 8, 31, -1, 52, 2,
          1192, 12, -10, 48, 1, 2, 708, 12, -13, 48, 0, 43, 2, 31, -1, 53, 48,
          16, 31, -1, 54, 48, 150, 48, 1e3, 9, 31, -1, 55, 2, 3728, 28, 21, 48,
          1, 48, 5, 47, 2, 2988, 12, -18, 48, 1, 48, 4, 47, 2, 1768, 8, -5, 48,
          1, 48, 3, 47, 2, 1756, 12, 13, 48, 1, 48, 2, 47, 2, 1576, 12, 11, 48,
          1, 48, 1, 47, 2, 164, 12, 12, 48, 1, 48, 0, 47, 43, 6, 31, -1, 56, 48,
          9987, 46, 17, 0, 6, 10232, 0, 0, 4, 71, 31, -1, 0, 15, 0, 1, 49, 31,
          -1, 2, 48, 10008, 46, 17, 0, 6, 10168, 0, 0, 4, 72, 31, -1, 0, 15, 1,
          1, 2, 48, 10026, 46, 17, 0, 6, 10146, 0, 0, 4, 73, 31, -1, 0, 15, 1,
          1, 2, 40, -1, 2, 2, 2320, 8, 11, 54, 2, 3204, 20, -8, 53, 6, 10136,
          48, 0, 31, -1, 3, 40, -1, 3, 40, -1, 2, 2, 4128, 32, 8, 54, 2, 2028,
          16, 10, 54, 39, 6, 10136, 40, -1, 2, 2, 4128, 32, 8, 54, 40, -1, 3,
          54, 31, -1, 4, 40, -1, 4, 2, 2044, 28, -13, 54, 2, 3784, 8, -3, 8, 2,
          3348, 32, 5, 54, 53, 6, 10127, 40, -1, 4, 0, 1, 40, 71, 2, 2, 720, 44,
          5, 54, 3, 44, 28, -1, 3, 0, 44, 17, 0, 6, 10057, 2, 2072, 20, 16, 8,
          17, 0, 6, 10145, 52, 0, 1, 40, -1, 2, 2, 3804, 20, -16, 54, 3, 44, 2,
          2072, 20, 16, 8, 17, 0, 6, 10167, 52, 0, 1, 2, 3492, 24, 2, 8, 10, 49,
          2, 552, 16, -1, 34, 44, 2, 4760, 12, 3, 17, 1, 2, 3204, 20, -8, 17, 1,
          43, 2, 2, 4444, 16, 5, 8, 2, 1748, 8, 18, 54, 0, 2, 49, 2, 552, 16,
          -1, 54, 2, 3584, 12, 4, 54, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6,
          10231, 52, 40, -1, 19, 2, 304, 68, -19, 54, 2, 636, 40, 16, 34, 44,
          48, 10253, 46, 17, 0, 6, 10399, 0, 0, 4, 74, 31, -1, 0, 15, 0, 1, 43,
          0, 31, -1, 2, 49, 2, 1420, 8, -1, 54, 2, 3316, 4, 19, 54, 0, 1, 2,
          4276, 12, 18, 8, 2, 2208, 8, 1, 54, 3, 31, -1, 3, 48, 0, 31, -1, 4,
          40, -1, 4, 40, -1, 3, 2, 2028, 16, 10, 54, 39, 6, 10391, 40, -1, 3,
          40, -1, 4, 54, 31, -1, 5, 40, -1, 5, 49, 2, 1420, 8, -1, 54, 2, 4324,
          24, -13, 54, 33, 6, 10382, 49, 2, 1420, 8, -1, 54, 2, 4324, 24, -13,
          54, 40, -1, 5, 54, 31, -1, 6, 49, 2, 1420, 8, -1, 54, 2, 3316, 4, 19,
          54, 40, -1, 5, 54, 40, -1, 2, 40, -1, 6, 34, 44, 28, -1, 4, 0, 44, 17,
          0, 6, 10300, 40, -1, 2, 17, 0, 6, 10398, 52, 40, -1, 19, 2, 304, 68,
          -19, 54, 2, 4940, 44, 22, 34, 44, 48, 10420, 46, 17, 0, 6, 10574, 0,
          0, 4, 75, 31, -1, 0, 15, 1, 1, 2, 49, 2, 1420, 8, -1, 54, 2, 3316, 4,
          19, 54, 11, 6, 10459, 43, 0, 49, 2, 1420, 8, -1, 54, 2, 3316, 4, 19,
          34, 44, 49, 2, 1420, 8, -1, 54, 2, 4324, 24, -13, 54, 11, 6, 10501,
          43, 0, 49, 2, 1420, 8, -1, 54, 2, 4324, 24, -13, 34, 44, 48, 0, 49, 2,
          1420, 8, -1, 54, 2, 4072, 24, 5, 34, 44, 2, 4896, 44, 3, 0, 1, 40, -1,
          2, 2, 400, 96, -22, 54, 3, 31, -1, 3, 48, 0, 31, -1, 4, 40, -1, 4, 40,
          -1, 3, 2, 2028, 16, 10, 54, 39, 6, 10564, 40, -1, 3, 40, -1, 4, 54, 0,
          1, 49, 2, 4044, 28, 20, 54, 3, 44, 28, -1, 4, 0, 44, 17, 0, 6, 10524,
          2, 2072, 20, 16, 8, 17, 0, 6, 10573, 52, 40, -1, 19, 2, 304, 68, -19,
          54, 2, 720, 44, 5, 34, 44, 48, 10595, 46, 17, 0, 6, 10718, 0, 0, 4,
          76, 31, -1, 0, 15, 1, 1, 2, 40, -1, 2, 0, 1, 40, 0, 6, 3, 31, -1, 3,
          40, -1, 3, 49, 2, 1420, 8, -1, 54, 2, 3316, 4, 19, 54, 33, 11, 6,
          10708, 40, -1, 2, 0, 1, 40, 0, 9, 3, 31, -1, 4, 40, -1, 4, 49, 2,
          1420, 8, -1, 54, 2, 3316, 4, 19, 54, 40, -1, 3, 34, 44, 49, 2, 1420,
          8, -1, 54, 2, 4072, 24, 5, 54, 49, 2, 1420, 8, -1, 54, 2, 4324, 24,
          -13, 54, 40, -1, 3, 34, 44, 48, 1, 49, 2, 1420, 8, -1, 54, 2, 4072,
          24, 5, 18, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 10717, 52, 40, -1, 19, 2,
          304, 68, -19, 54, 2, 4044, 28, 20, 34, 44, 48, 10739, 46, 17, 0, 6,
          11843, 0, 0, 4, 77, 31, -1, 0, 15, 1, 1, 2, 40, -1, 2, 5, 11, 6,
          10760, 44, 43, 0, 45, -1, 2, 44, 2, 32, 20, 17, 40, -1, 2, 2, 32, 20,
          17, 54, 17, 0, 41, 2, 3776, 8, -4, 40, -1, 2, 2, 3776, 8, -4, 54, 17,
          0, 41, 2, 3516, 8, 13, 40, -1, 2, 2, 3516, 8, 13, 54, 17, 0, 41, 2,
          1372, 8, -3, 40, -1, 2, 2, 1372, 8, -3, 54, 17, 0, 41, 2, 2208, 8, 1,
          40, -1, 2, 2, 2208, 8, 1, 54, 17, 0, 41, 2, 4512, 16, 9, 40, -1, 2, 2,
          4512, 16, 9, 54, 17, 0, 41, 43, 6, 49, 2, 1420, 8, -1, 54, 2, 1976, 8,
          16, 34, 44, 0, 0, 2, 3324, 8, 13, 8, 2, 4400, 4, -7, 54, 3, 49, 2,
          1420, 8, -1, 54, 2, 676, 20, -11, 34, 44, 0, 0, 49, 2, 636, 40, 16,
          54, 3, 44, 2, 4444, 16, 5, 8, 2, 1748, 8, 18, 54, 0, 1, 49, 2, 720,
          44, 5, 54, 3, 44, 49, 2, 1420, 8, -1, 54, 2, 1696, 24, -11, 54, 17, 0,
          53, 6, 11819, 2, 4444, 16, 5, 8, 2, 1748, 8, 18, 54, 0, 1, 20, 10, 31,
          -1, 3, 49, 2, 1420, 8, -1, 54, 2, 1976, 8, 16, 54, 2, 4512, 16, 9, 54,
          6, 11247, 17, 1, 49, 2, 72, 20, 15, 54, 2, 372, 28, 17, 0, 2, 40, 0,
          51, 2, 4512, 16, 9, 54, 3, 2, 372, 28, 17, 0, 3, 40, -1, 3, 2, 92, 56,
          -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2, 2716, 60, -17, 0, 2,
          40, 0, 51, 2, 4512, 16, 9, 54, 3, 2, 2716, 60, -17, 0, 3, 40, -1, 3,
          2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2, 4020, 12,
          -5, 0, 2, 40, 0, 51, 2, 4512, 16, 9, 54, 3, 2, 4020, 12, -5, 0, 3, 40,
          -1, 3, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2, 52,
          20, -6, 0, 2, 40, 0, 51, 2, 2684, 12, -9, 54, 3, 2, 52, 20, -6, 0, 3,
          40, -1, 3, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2,
          2620, 20, -6, 0, 2, 40, 0, 51, 2, 2684, 12, -9, 54, 3, 2, 2620, 20,
          -6, 0, 3, 40, -1, 3, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20,
          15, 54, 2, 2388, 12, 1, 0, 2, 40, 0, 51, 2, 2684, 12, -9, 54, 3, 2,
          2388, 12, 1, 0, 3, 40, -1, 3, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2,
          72, 20, 15, 54, 2, 4836, 24, 17, 0, 2, 40, 0, 51, 2, 2684, 12, -9, 54,
          3, 2, 768, 16, 11, 0, 3, 40, -1, 3, 2, 92, 56, -13, 54, 3, 44, 49, 2,
          1420, 8, -1, 54, 2, 1976, 8, 16, 54, 2, 2208, 8, 1, 54, 6, 11343, 17,
          1, 49, 2, 72, 20, 15, 54, 2, 2092, 16, -9, 0, 2, 40, 0, 51, 2, 3012,
          12, -1, 54, 3, 2, 2092, 16, -9, 0, 3, 40, -1, 3, 2, 92, 56, -13, 54,
          3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2, 4628, 36, -17, 0, 2, 40, 0,
          51, 2, 3012, 12, -1, 54, 3, 2, 4628, 36, -17, 0, 3, 40, -1, 3, 2, 92,
          56, -13, 54, 3, 44, 49, 2, 1420, 8, -1, 54, 2, 1976, 8, 16, 54, 2,
          1372, 8, -3, 54, 6, 11478, 17, 1, 49, 2, 72, 20, 15, 54, 2, 1204, 60,
          -17, 0, 2, 40, 0, 51, 2, 1372, 8, -3, 54, 3, 2, 1204, 60, -17, 0, 3,
          40, -1, 3, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2,
          1456, 12, 4, 0, 2, 40, 0, 51, 2, 1372, 8, -3, 54, 3, 2, 1456, 12, 4,
          0, 3, 40, -1, 3, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15,
          54, 2, 3928, 28, -15, 0, 2, 40, 0, 51, 2, 1372, 8, -3, 54, 3, 2, 3928,
          28, -15, 0, 3, 40, -1, 3, 2, 92, 56, -13, 54, 3, 44, 49, 2, 1420, 8,
          -1, 54, 2, 1976, 8, 16, 54, 2, 32, 20, 17, 54, 6, 11574, 17, 1, 49, 2,
          72, 20, 15, 54, 2, 788, 28, -21, 0, 2, 40, 0, 51, 2, 32, 20, 17, 54,
          3, 2, 788, 28, -21, 0, 3, 40, -1, 3, 2, 92, 56, -13, 54, 3, 44, 17, 1,
          49, 2, 72, 20, 15, 54, 2, 3e3, 8, -1, 0, 2, 40, 0, 51, 2, 32, 20, 17,
          54, 3, 2, 3e3, 8, -1, 0, 3, 40, -1, 3, 2, 92, 56, -13, 54, 3, 44, 49,
          2, 1420, 8, -1, 54, 2, 1976, 8, 16, 54, 2, 3776, 8, -4, 54, 6, 11631,
          17, 1, 49, 2, 72, 20, 15, 54, 2, 3776, 8, -4, 0, 2, 40, 0, 51, 2,
          3776, 8, -4, 54, 3, 2, 3776, 8, -4, 0, 3, 40, -1, 3, 2, 92, 56, -13,
          54, 3, 44, 49, 2, 1420, 8, -1, 54, 2, 1976, 8, 16, 54, 2, 3516, 8, 13,
          54, 6, 11805, 17, 1, 49, 2, 72, 20, 15, 54, 2, 3516, 8, 13, 0, 2, 40,
          0, 51, 2, 3516, 8, 13, 54, 3, 2, 3516, 8, 13, 0, 3, 40, -1, 3, 2, 92,
          56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2, 2888, 8, 7, 0, 2,
          40, 0, 51, 2, 3516, 8, 13, 54, 3, 2, 2888, 8, 7, 0, 3, 40, -1, 3, 2,
          92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2, 4364, 24, 18,
          0, 2, 40, 0, 51, 2, 3516, 8, 13, 54, 3, 2, 4364, 24, 18, 0, 3, 40, -1,
          3, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 72, 20, 15, 54, 2, 2108,
          16, -1, 0, 2, 40, 0, 51, 2, 3516, 8, 13, 54, 3, 2, 2108, 16, -1, 0, 3,
          40, -1, 3, 2, 92, 56, -13, 54, 3, 44, 17, 1, 49, 2, 1420, 8, -1, 54,
          2, 1696, 24, -11, 34, 44, 17, 1, 49, 2, 1420, 8, -1, 54, 2, 3756, 20,
          -10, 34, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 11842, 52, 40, -1, 19, 2,
          304, 68, -19, 54, 2, 1976, 8, 16, 34, 44, 48, 11864, 46, 17, 0, 6,
          11921, 0, 0, 4, 78, 31, -1, 0, 15, 0, 1, 49, 2, 552, 16, -1, 54, 6,
          11897, 0, 0, 49, 2, 552, 16, -1, 54, 2, 264, 16, 0, 54, 3, 44, 17, 0,
          49, 2, 1420, 8, -1, 54, 2, 3756, 20, -10, 34, 44, 2, 2072, 20, 16, 8,
          17, 0, 6, 11920, 52, 40, -1, 19, 2, 304, 68, -19, 54, 2, 4388, 12, 21,
          34, 44, 48, 11942, 46, 17, 0, 6, 12098, 0, 0, 4, 79, 31, -1, 0, 15, 0,
          1, 43, 0, 31, -1, 2, 49, 2, 1420, 8, -1, 54, 2, 1608, 20, -7, 54, 0,
          1, 2, 4276, 12, 18, 8, 2, 2208, 8, 1, 54, 3, 31, -1, 3, 40, -1, 3, 2,
          2028, 16, 10, 54, 31, -1, 4, 48, 0, 31, -1, 5, 40, -1, 5, 40, -1, 4,
          39, 6, 12059, 40, -1, 3, 40, -1, 5, 54, 31, -1, 6, 0, 0, 49, 2, 1420,
          8, -1, 54, 2, 1608, 20, -7, 54, 40, -1, 6, 54, 2, 4160, 20, 9, 54, 3,
          40, -1, 2, 40, -1, 6, 34, 44, 28, -1, 5, 0, 44, 17, 0, 6, 12e3, 49, 2,
          1420, 8, -1, 54, 2, 676, 20, -11, 54, 0, 0, 49, 2, 4940, 44, 22, 54,
          3, 40, -1, 2, 0, 0, 49, 2, 2340, 48, 10, 54, 3, 0, 4, 17, 0, 6, 12097,
          52, 40, -1, 19, 2, 304, 68, -19, 54, 2, 4160, 20, 9, 34, 44, 48,
          12119, 46, 17, 0, 6, 12155, 0, 0, 4, 80, 31, -1, 0, 15, 2, 1, 2, 3,
          40, -1, 3, 49, 2, 508, 44, -21, 54, 40, -1, 2, 34, 44, 2, 2072, 20,
          16, 8, 17, 0, 6, 12154, 52, 40, -1, 19, 2, 304, 68, -19, 54, 2, 4212,
          32, -16, 34, 44, 48, 12176, 46, 17, 0, 6, 12219, 0, 0, 4, 81, 31, -1,
          0, 15, 0, 1, 43, 0, 49, 2, 508, 44, -21, 34, 44, 43, 0, 49, 2, 1420,
          8, -1, 54, 2, 1608, 20, -7, 34, 44, 2, 2072, 20, 16, 8, 17, 0, 6,
          12218, 52, 40, -1, 19, 2, 304, 68, -19, 54, 2, 1588, 12, 17, 34, 44,
          48, 12240, 46, 17, 0, 6, 12689, 0, 0, 4, 82, 31, -1, 0, 15, 2, 1, 2,
          3, 49, 2, 1420, 8, -1, 54, 2, 3756, 20, -10, 54, 17, 0, 53, 6, 12273,
          19, 17, 0, 6, 12688, 12, 12659, 48, 10, 40, -1, 2, 0, 2, 2, 2896, 40,
          -17, 8, 3, 45, -1, 2, 44, 40, -1, 3, 2, 2028, 16, 10, 54, 48, 1, 36,
          31, -1, 4, 40, -1, 3, 40, -1, 4, 54, 31, -1, 5, 40, -1, 3, 40, -1, 3,
          2, 2028, 16, 10, 54, 48, 2, 36, 54, 31, -1, 6, 49, 2, 1420, 8, -1, 54,
          2, 1608, 20, -7, 54, 40, -1, 2, 54, 11, 6, 12383, 40, 0, 55, 40, 0,
          54, 0, 2, 29, 2, 4772, 32, -15, 54, 10, 49, 2, 1420, 8, -1, 54, 2,
          1608, 20, -7, 54, 40, -1, 2, 34, 44, 40, -1, 2, 40, 0, 43, 2, 2988,
          12, -18, 54, 2, 1628, 12, -4, 54, 23, 5, 6, 12421, 44, 40, -1, 2, 40,
          0, 43, 2, 3728, 28, 21, 54, 2, 708, 12, -13, 54, 39, 6, 12481, 40, -1,
          3, 48, 2, 54, 31, -1, 7, 40, -1, 7, 49, 2, 1420, 8, -1, 54, 2, 3316,
          4, 19, 54, 40, -1, 6, 34, 44, 40, -1, 3, 48, 4, 54, 40, -1, 3, 48, 3,
          54, 40, -1, 3, 48, 1, 54, 40, -1, 3, 48, 0, 54, 0, 4, 45, -1, 3, 44,
          40, -1, 3, 2, 2028, 16, 10, 54, 48, 1, 36, 45, -1, 4, 44, 40, -1, 3,
          40, -1, 4, 54, 49, 2, 1420, 8, -1, 54, 2, 676, 20, -11, 54, 36, 40,
          -1, 3, 40, -1, 4, 34, 44, 40, -1, 3, 2, 2028, 16, 10, 54, 48, 2, 36,
          31, -1, 8, 49, 2, 1420, 8, -1, 54, 2, 4324, 24, -13, 54, 40, -1, 6,
          54, 31, -1, 9, 40, -1, 9, 40, -1, 3, 40, -1, 8, 34, 44, 49, 2, 1420,
          8, -1, 54, 2, 3316, 4, 19, 54, 40, -1, 6, 54, 31, -1, 10, 40, -1, 10,
          11, 6, 12595, 19, 17, 0, 6, 12688, 40, -1, 10, 48, 0, 54, 31, -1, 11,
          40, -1, 11, 40, 0, 41, 2, 2412, 12, 19, 54, 53, 6, 12623, 19, 17, 0,
          6, 12688, 40, -1, 3, 40, -1, 5, 0, 2, 49, 2, 1420, 8, -1, 54, 2, 1608,
          20, -7, 54, 40, -1, 2, 54, 2, 4680, 24, -15, 54, 3, 44, 32, 12655, 17,
          0, 6, 12679, 31, -1, 12, 40, -1, 12, 2, 4880, 16, -7, 0, 2, 29, 2,
          1468, 24, 19, 54, 3, 44, 2, 2072, 20, 16, 8, 17, 0, 6, 12688, 52, 40,
          -1, 19, 2, 304, 68, -19, 54, 2, 72, 20, 15, 34, 44, 48, 12710, 46, 17,
          0, 6, 12748, 0, 0, 4, 83, 31, -1, 0, 15, 2, 1, 2, 3, 40, -1, 3, 40,
          -1, 2, 0, 2, 49, 2, 72, 20, 15, 54, 3, 44, 2, 2072, 20, 16, 8, 17, 0,
          6, 12747, 52, 40, -1, 19, 2, 304, 68, -19, 54, 2, 2956, 20, 19, 34,
          44, 48, 12769, 46, 17, 0, 6, 12938, 0, 0, 4, 84, 31, -1, 0, 15, 0, 1,
          48, 0, 31, -1, 2, 49, 2, 1420, 8, -1, 54, 2, 1976, 8, 16, 54, 31, -1,
          3, 40, -1, 3, 2, 4512, 16, 9, 54, 6, 12820, 40, 0, 56, 2, 164, 12, 12,
          54, 14, -1, 2, 44, 40, -1, 3, 2, 2208, 8, 1, 54, 6, 12842, 40, 0, 56,
          2, 1576, 12, 11, 54, 14, -1, 2, 44, 40, -1, 3, 2, 1372, 8, -3, 54, 6,
          12864, 40, 0, 56, 2, 1756, 12, 13, 54, 14, -1, 2, 44, 40, -1, 3, 2,
          3516, 8, 13, 54, 6, 12886, 40, 0, 56, 2, 1768, 8, -5, 54, 14, -1, 2,
          44, 40, -1, 3, 2, 3776, 8, -4, 54, 6, 12908, 40, 0, 56, 2, 2988, 12,
          -18, 54, 14, -1, 2, 44, 40, -1, 3, 2, 32, 20, 17, 54, 6, 12930, 40, 0,
          56, 2, 3728, 28, 21, 54, 14, -1, 2, 44, 40, -1, 2, 17, 0, 6, 12937,
          52, 40, -1, 19, 2, 304, 68, -19, 54, 2, 2340, 48, 10, 34, 44, 0, 0,
          40, -1, 19, 10, 31, -1, 57, 2, 836, 356, -21, 48, 1, 25, 48, 1, 25, 0,
          0, 40, -1, 22, 3, 0, 0, 40, -1, 21, 3, 0, 0, 40, -1, 20, 3, 0, 6, 31,
          -1, 58, 48, 13001, 46, 17, 0, 6, 13016, 0, 0, 4, 85, 44, 15, 0, 0, 0,
          0, 40, 0, 24, 3, 52, 48, 13023, 46, 17, 0, 6, 13038, 0, 0, 4, 86, 44,
          15, 0, 0, 0, 0, 40, 0, 23, 3, 52, 21, 21, 21, 0, 5, 31, -1, 59, 0, 0,
          48, 0, 1, 0, 0, 0, 3, 31, -1, 60, 40, -1, 57, 2, 1988, 4, 15, 37, 40,
          -1, 40, 2, 764, 4, 16, 37, 40, -1, 29, 2, 4404, 4, -2, 37, 40, -1, 30,
          2, 4728, 8, 7, 37, 40, -1, 29, 2, 1264, 92, -22, 37,
        ],
        _phziSRa7D: atob(
          "SlRkREpUZEVKVGRDY25kd2NtOGxReklsT0RJPVgxWT1VaVUxUWxoZlVTVTFSVkJoVXc9PWMzVWxOMEo1YTJwMUpUZEVkQT09VUdOV1ZDVTJNR05WTm1kV1gyVT1ibkZ4VWlWRE1pVTRNM0lsTjBJbFF6SWxPREZaZGlWRE1pVTRNQ1ZETWlVNE1YSWxOMEp5SlRkR1JTVXpSRXc1VjBNbE0wUlJSRU1sTTBSQ1NEbEdKVU15SlRneEpVTXlKVGd6ZGlWRE1pVTROMzRsUXpJbE9EQWxReklsT0RWNkpVTXlKVGd3SlRkR2FtVT1KVGREYlNVM1JpVTNSaVZETWlVNE15VTNRbjV3WkdselkyOXVibVZqZEE9PWFYST1KVU15SlRnNGMzNGxReklsT0RkM0pVTXlKVGd6SlVNeUpUZzFKVU15SlRneUpVTXlKVGczSlVNeUpUZ3lKVU15SlRnM0pVTXlKVGhESlVNeUpUZ3plQT09WHlVMVJWZ2xOVVJqVkdGVEpUVkZaaVUxUkE9PUpVTXlKVGczSlVNeUpUaENKVGRDSlVNeUpUZzRKVU15SlRoR2FTVTNRaVZETWlVNE1pVTNRbmtsUXpJbE9FRWxReklsT0RVbFF6SWxPRGhYSlVNeUpUZ3lKVU15SlRneVpXaGZKVFZFWDJRPWRDVkRNaVU0TW5ZbFF6SWxPRE4rSlRkQ2VpVkRNaVU0T0NWRE1pVTRPUT09SlRZd2NHTjBabk4zWm5NPWRTVkRNaVU0TkNVM1JISWxReklsT0RONGZpVTNSQT09Y2lVM1FuZ2xOMFp4Zm5BbFF6SWxPREZ6VTNBbFF6SWxPRE53V1NVMVJWbGtKVE5FWldSUlpGbGZKVFZGSlROR1VtTlZZbVpWWWc9PUpUZEVjRzU2SlRkRWIxOTBlSEE9Y25NbFF6SWxPRFE9VUNVMVF5VTFSR1k9YXlVMVEyMXVKVFl3U1NVMk1ISkJhbTFvSlRRd1p5VTJNR2dsTmpCcGIyND1KVFZFV1ZkaFdHRWxOVVZZSlRZd1pnPT1lQ1ZETWlVNE5DVkRNaVU0TlNWRE1pVTRSUT09V0NVMVJDVTFSRlJoUTFSbll3PT1KVGRHSlVNeUpUZ3lKVU15SlRnNEpVTXlKVGhDSlVNeUpUZzBWaVZETWlVNE15VTNRMjF0SlVNeUpUaEZKVFl3WkY5RVJFWjNUU1ZETWlVNE0wNGxOVVJpZWlWRE1pVTRPU1ZETWlVNFJVb2xReklsT0RZbFF6SWxPRFVsTjBaM1RDVkRNaVU0UXlWRE1pVTRObllsUXpJbE9EQkZKVGRHVG0xSVZpVTBNR0ZOSlRkRUpUZERKVU15SlRnMFRGcGxKVFZDYW1saGIyUmlhMGRHZmlVMVJWbEtKVFl3Vm1NbE5EQWxReklsT0VVbE5VSWxOVVZLZGtkcFZ5VkRNaVU0T0NVMk1DVkRNaVU0UTBWK0pVTXlKVGhHYUNVMk1HMTJlRWdsTkRCa0pUZERlSHAzSlVNeUpUZzRKVFl3SlVNeUpUZ3hUQ1ZETWlVNE5WZ2xReklsT0RKNUpUWXdXU1UyTUVsU1drc2xOVVFsTlVWUEpVTXlKVGcxSlVNeUpUZ3dKVU15SlRnMmRIa2xReklsT0RRbFF6SWxPRFZ5SlVNeUpUZ3pKVU15SlRnMUpVTXlKVGc1SlVNeUpUaENlQ1ZETWlVNE15VTNSaVZETWlVNFFXb2xReklsT0RWZkpVTXlKVGcwSlVNeUpUZzVKVU15SlRnMkpUZENKVU15SlRneEpVTXlKVGhCYVNVMVFpVTJNRlpoYVVvPWQzSjRabXM9WWlVMVJWTlZWMXBoSlRWRlZsZGtaV2dsTlVOYWJXSm9adz09WjFoZmRIVmlkV1k9SlVNeUpUZ3hmbmc9Y0cxeVgzSm5iV3hRWDNKamNHdHhYMlJwYTNKaEpUWXdVaVUxUW1GZlpqSmZYeVUxUTE4PWJtTm5Ydz09YlE9PVR5VTFReVUxUkE9PUpUZENjeVZETWlVNE1tOVpjeVZETWlVNE53PT1VMThsTlVRbE5qQmlWV05qUkY4eVVXTlZKVEkySlRJMEpUUXdKVE5CVGtnPVlWUmlWR016VUdOUWVRPT1kbWM9SlRkQ2NIUnNTU1UzUTIxdGJIbDZSVlJVVUNVMVJBPT1ZbU5RWVdNPWIyNW9iWE5rY1VoakpUZERKVGRFY25NbE5VTnZKVGRDY3c9PU9HaGxiV2tsTlVKb2RIbDBKVGRHSlRWRWNHNTZKVGRFYnc9PU55VXpSak1sTTBJbE0wVT1KVE5GWDJaZmJsOD1VQ1UxUkZKblIwSklOaVV6UWc9PVMxUklXbGc9ZEhrbFF6SWxPRE54Y2lVM1EzVjBKVU15SlRnd0pUZENXQ1UzUWlWRE1pVTRNM0YrVDIwbE4wWnhKVU15SlRneWRDVTNRblJ5SlVNeUpUZ3plSDRsTjBSVUpUZEVjdz09VXlVMVExRmpZdz09ZWlWRE1pVTRRbm9sUXpJbE9ETWxReklsT0RsWUpVTXlKVGcwSlVNeUpUZzBKVU15SlRnM2VTVkRNaVU0T0E9PWIySjNhbWhpZFdwd2J3PT1KVGREZVNVM1JuaHVZbFZUWDJKVWJHWjZVdz09SlVNeUpUZ3dkQ1ZETWlVNE13PT1jRzl6ZEUxbGMzTmhaMlU9WWlVMVFtUWxOVVJxSlRWRkpUZENKVGREY1hKaEpVTXlKVGcySlRkRWNnPT1aU1UxUlZSVlZsa2xOVVZWVkE9PWRHNGxReklsT0RKK2VRPT1ibkIyZEdadFptSjNaZz09Wlc5aVl3PT1YMkZtSlRWQ1lTVTJNQT09SlRWRFoyOUdKVFl3ZEE9PVVrTktTQT09YUdaMVJtOTFjMnBtZEVONlZYcHhaZz09SlROR1NDVXpSUT09YW1SNGNnPT1kbmNsUXpJbE9EZ2xOMEoxZHlVM1JpVkRNaVU0TVNWRE1pVTROaVUzUWlWRE1pVTRNU1ZETWlVNE1BPT1KVEZHSlRGR0pURkJTekJaVkMwbE1UST1OVFlsTTBRMlJUWlFKVE5ETmtvPWFXNWxXZz09VWlVMVJHRlpVZz09VlNVMVFtUlpaVm9sTlVJNVpXUWxOVU5mSlRWRVNtVTRYMm9sTlVOaVZ5VTFSR2s9Ykc1MGNtUjBidz09U1ZRbE5VTm5VMDFoSlRORFFUVXlKVE5HYmlVM1JpVTNRMnQrYzNsNFFrRktSMEZKWkd3PVdGWmpXRnBoVXc9PWRYcHpKVU15SlRnd2VYZDJaaVZETWlVNE1TVkRNaVU0TjNWNmR5VkRNaVU0TlE9PU56a2xOREFsTWtZPWF5VTFSRmxxSlRWQ0pUWXdWVjg9UnpoS1NrNUdTU1V6UWc9PVdTVTFRaVUxUWlVMVJHUWxOVVJxV1d4aFoyWT1kWG9sTjBKK2RpVTJNQ1ZETWlVNE1YWjNKVU15SlRnMWMzVWxOMEo1YTNOMUpUZERhdz09VnlVMVJWWkxUaVUxUWc9PVR5VTJNQ1UxUlZoclYxRmxVV0lsTmpCYU9WTm5kbmgrSlRkRGJnPT1kUT09SlRWRVVFeFBKVE5CV1Zka0pVTXlKVGd4SlVNeUpUZ3dlaVUzUmlWRE1pVTROWFlsUXpJbE9ETitKVU15SlRnd0pVTXlKVGczZGc9PVpXRm5aRlZYSlRZd1VXUWxOakE9ZUhZbFF6SWxPRFZXSlVNeUpUZzNkaVUzUmlWRE1pVTROVlFsUXpJbE9EQjFkZz09WjJGdGJXRT1KVE5GSlRWRGEyNUhhaVUxUldZPWEyUjJTSGxvY1hjPU5BPT1KVFZDWlc1ckpVTXlKVGd4Y2lWRE1pVTRNeVZETWlVNE5IWmFKVGRHSlVNeUpUZzFUaVV6UWlVelExbEZKVE5HVXc9PUpUVkVZaVUyTUZVeVkxSWxOVUpoV200bFF6SWxPREYxSlRWQ0pUWXdZbWRtY1dKMGRXWT1ZbE09YkdaNmNYTm1kSFE9S1E9PVZGcGpWRE5tVjFkQlptUlpKVU15SlRneE56VkVSMU1sTTBZNVRRPT1XVk5uSlRORFl5VTFRZz09SlVNeUpUZ3hkaVZETWlVNE0zY2xReklsT0RBbFF6SWxPRE4rY2lVM1JuUjJXaVUzUTNsM2N5VTNSRzg9SlRKRFp3PT1abWM9VGlVelJrMU9ZMUJXSlRORVVDVTFRMVE9T0hFbE4wUjJkVGhyZUcwbFF6SWxPREk9YTNCeGRHeFVjU1UzUWlVM1F3PT1PRGM1UVVsR056a2xNMEpWUVNVelFrOD1Za2QxYUhSc1JDaz1KVE5HUzBSREpUUXdaV2RzYXlVelEyTWxOVU5rSlRWRFpXcz1hU1UxUlY4bE5VTnFRU1UxUW04PVUxbz1XZz09TjFSbldBPT1KVFZDSlRZd1ZsZHFRVmc9SlRRd1J5VTBNRWdsTkRCSlQxcEpTaVV6UmlVME1BPT1hMlpzV2w4bE5VTnFiU1UxUlc5aWEzRT1jWFFsUXpJbE9ETndKVFZFYVdKaGFYb2xReklsT0VRbFF6SWxPRGxXSlVNeUpUZzNlblphSlVNeUpUZ3hlaVZETWlVNE1ub2xReklsT0RNbFF6SWxPRGs9UzNOeVgzSm5iV3hOSlRZd2NXTndkR053V1dKV2FHWT1KVFZEWWxkcVdWcHJKVFZGV0ZvPVptNWlhbTA9T0VOTFFnPT1aMlYwUTI5aGJHVnpZMlZrUlhabGJuUnpheVUxUlc5aGJuSmhSVWROU3lVelJFUWxNMFE1VGlVelJBPT1XRlZvVlE9PWRtaHZhR1ozYkhKeFZuZGtkWGM9VXlVMVJHWmpKVU15SlRnMkpVTXlKVGcxSlRkR0pVTXlKVGcwSlVNeUpUaEJKVGRDSlVNeUpUZzRhaVZETWlVNFJpVkRNaVU0TmlVM1FnPT1MamMwSlROQ0xTVXpRU1V5UXlVelJDVXlSZz09SlRkRGIyMTVKVGREYm5ONGNRPT1iWEowZVhnPVVYSm5hQT09V2xFPWJTVTFSWEZ0ZGlVM1JpVkRNaVU0TWxWeGMzZz1YMlpyWVE9PWRHVjJhWEo0VW5Ob2FRPT1KVFZGU3lVMVExRlBKVFZGYzNBPUpUUXdOVFl6UVV3NE1rWT1hV1JxV0NVMVJGaFdZMWhhWVE9PWFHVjRaWGRwZUE9PUpUVkZKVFl3Wm1SV0pVTXlKVGd6ZmlWRE1pVTROSEozZENVM1JITT1KVU15SlRnemRTVkRNaVU0TkdSNUpUZEVkU1UzUmlWRE1pVTROU1ZETWlVNE5BPT1jV05vSlRWRmFYRT1ibWM9ZFhSdWMzbHFkM3AxWTJ4aGMzTk9ZVzFsVFZCUU1pVTFRaVUxUlZreFdGRlpVVm9sTmpBPVlXaGFZeVUxUTI1aldtUnBYeVUyTUhNPVdHUWxOVVFsTlVOVkpUZERkU1UzUkhWK0pVTXlKVGcwV1NVMVF5VTFReVUxUkNVMVEwWm5KVFZESlRWRWF3PT1KVFZGSlRWRGF5VXpRbGhyV0E9PWNXTm9KVFZGYVhGVEpUTkJORWc9Y1hSbWFWbHVjbW89SlVNeUpUZ3pkU1ZETWlVNE5GUnhKVU15SlRnMGNRPT1KVFl3V1dzNWJHeHFZVnB0YkNVMVJBPT1KVGRDSlRkQ0pUTkVVRmhUVVdJPUpUZEVkU1UzUXlVM1FuST1jeVUzUTNsMWZpVkRNaVU0TkdnPWMzcHNkVzRsUXpJbE9EQjFiSHB1SlRkRWRYUT1KVFZGSlRWQ1ZRPT1KVFZDSlRWRVkyRlRVeVUxUTJKVEpUWXdKVFZGWDFvbE5VST1kWForZFE9PVh3PT1KVU15SlRneGVTVkRNaVU0TnlWRE1pVTROM1VsTjBKNVgyb2xOVVZ3YUNVMk1HbHZRa3RIUmc9PVlWSWxOakJoUVNVMk1HSnFjbThsTmpCaVpBPT1laVZETWlVNE1YbHVjWDQ9WjJZbE5qQmxheVUxUTJrPWNXeHRkaVUzUTNGdWNXMTZjR052Wnc9PUpUSTFaV2c9SlRWRFpqWmlZV2RZWVdjNFZ5VTFRMmRVVlY5WVRpVTBNQ1V6UTAwbE0wVkRKVGRHY240bFF6SWxPREoySlRkR2NuRT1KVGREZGlWRE1pVTRRWFVsUXpJbE9EQWxReklsT0RnbE4wWT1ZbVJxYUZwYVkybGFadz09SlRkR0pVTXlKVGcwSlVNeUpUZ3lkdz09ZEE9PVdsaG5OR2RuWlNVMVExVm9aMWc9YkcxYWEyMD1lV2c9SlRWQ1ZsRlBKVFZGWWxGV1R3PT1jSEpmY1c5aVlnPT1ZM2dsTjBOMFVTVkRNaVU0TkhWMWRDVkRNaVU0TVE9PWR5VkRNaVU0TUNVM1JIa2xReklsT0RJbFF6SWxPRGh0VXlVMVJXUlJKVFZDVkZJbE5VSllVbG89WnlVMk1DVTFSRmRaSlRkQ2RBPT1TVkJVZGlVM1FuQjJkUT09Wm10dGNuRXBKVEZFY0dKcFlpVTJNSEVwSlRGRWNXSjFjU1UxUlc5aUpUVkZVVThsTlVVd1Z5VXpSQ1UxUlVzbE5VVlBRVk1sTlVWU00xaE9VMDFQSlRWRVoxaHJaMVJsV0ZRPUpUVkZKVFl3VTJGaFl5VTJNRk09WjJWMFRXVmhibEJsY21sdlpBPT1SQ1V6Umc9PQ=="
        ),
      };
      function t(e) {
        for (; e._GhYc05v6 !== e._CeUVK17f1v; ) {
          const t = e._4dJHhI9e[e._GhYc05v6++];
          e._ssPWDNIRV7[t](e);
        }
      }
      return (e._CeUVK17f1v = e._4dJHhI9e.length), t(e), e._Um3wm;
    })()),
      (en = qt.s),
      (tn = qt.m),
      (nn = qt.b),
      (rn = qt.start);
  } catch (zn) {
    Me("ob-error", "error", "api", { message: zn.message });
    var on = function () {};
    (en = function () {
      return Promise.resolve();
    }),
      (tn = {
        record: on,
        resetData: on,
        setData: on,
        stop: on,
        circBuffPush: on,
      }),
      (nn = { record: on, stop: on }),
      (rn = on);
  }
  function an(e, t) {
    (this.cause = e), (this.message = t);
  }
  function sn(e) {
    an.call(this, pe, "Invalid hCaptcha id: " + e);
  }
  function cn() {
    an.call(this, ue, "No hCaptcha exists.");
  }
  function ln() {
    an.call(
      this,
      de,
      "Missing sitekey - https://docs.hcaptcha.com/configuration#javascript-api"
    );
  }
  an.prototype = Error.prototype;
  var hn = [],
    un = [],
    dn = {
      add: function (e) {
        hn.push(e);
      },
      remove: function (e) {
        for (var t = !1, n = hn.length; --n > -1 && !1 === t; )
          hn[n].id === e.id && ((t = hn[n]), hn.splice(n, 1));
        return t;
      },
      each: function (e) {
        for (var t = -1; ++t < hn.length; ) e(hn[t]);
      },
      isValidId: function (e) {
        for (var t = !1, n = -1; ++n < hn.length && !1 === t; )
          hn[n].id === e && (t = !0);
        return t;
      },
      getByIndex: function (e) {
        for (var t = !1, n = -1; ++n < hn.length && !1 === t; )
          n === e && (t = hn[n]);
        return t;
      },
      getById: function (e) {
        for (var t = !1, n = -1; ++n < hn.length && !1 === t; )
          hn[n].id === e && (t = hn[n]);
        return t;
      },
      getCaptchaIdList: function () {
        var e = [];
        return (
          dn.each(function (t) {
            e.push(t.id);
          }),
          e
        );
      },
      pushSession: function (e, t) {
        un.push([e, t]), un.length > 10 && un.splice(0, un.length - 10);
      },
      getSession: function () {
        return un;
      },
    };
  function pn(e, t) {
    "object" != typeof e || t || ((t = e), (e = null));
    var n,
      r,
      i,
      o = !0 === (t = t || {}).async,
      a = new Promise(function (e, t) {
        (r = e), (i = t);
      });
    if (
      ((a.resolve = r),
      (a.reject = i),
      (n = e ? dn.getById(e) : dn.getByIndex(0)))
    )
      Ie("Execute called", "hCaptcha", "info"),
        Yt.setData("exec", "api"),
        tn.setData("exec", "api"),
        o && n.setPromise(a),
        n.onReady(n.initChallenge, t);
    else if (e) {
      if (!o) throw new sn(e);
      a.reject(pe);
    } else {
      if (!o) throw new cn();
      a.reject(ue);
    }
    if (o) return a;
  }
  function fn(e) {
    var t = "",
      n = null;
    n = e ? dn.getById(e) : dn.getByIndex(0);
    try {
      for (var r = dn.getSession(), i = r.length, o = !1; --i > -1 && !o; )
        (o = r[i][1] === n.id) && (t = r[i][0]);
    } catch (zn) {
      t = "";
    }
    return t;
  }
  function mn(e, t, n) {
    (this.target = e),
      this.setTargetOrigin(n),
      (this.id = t),
      (this.messages = []),
      (this.incoming = []),
      (this.waiting = []),
      (this.isReady = !0),
      (this.queue = []);
  }
  (mn.prototype._sendMessage = function (e, t) {
    var n = e instanceof HTMLIFrameElement;
    try {
      n
        ? e.contentWindow.postMessage(JSON.stringify(t), this.targetOrigin)
        : e.postMessage(JSON.stringify(t), this.targetOrigin);
    } catch (Jn) {
      Oe("messaging", Jn),
        "*" !== this.targetOrigin &&
          (this.setTargetOrigin("*"), this._sendMessage(e, t));
    }
  }),
    (mn.prototype.setReady = function (e) {
      var t = this;
      (t.isReady = e),
        t.isReady &&
          t.queue.length &&
          (t.queue.forEach(function (e) {
            t._sendMessage.apply(t, e);
          }),
          t.clearQueue());
    }),
    (mn.prototype.clearQueue = function () {
      this.queue = [];
    }),
    (mn.prototype.setID = function (e) {
      this.id = e;
    }),
    (mn.prototype.setTargetOrigin = function (e) {
      this.targetOrigin = "*";
    }),
    (mn.prototype.contact = function (e, t) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      var n = this,
        r = Math.random().toString(36).substr(2),
        i = {
          source: "hcaptcha",
          label: e,
          id: this.id,
          promise: "create",
          lookup: r,
        };
      if (t) {
        if ("object" != typeof t) throw new Error("Message must be an object.");
        i.contents = t;
      }
      return new Promise(function (t, o) {
        n.waiting.push({ label: e, reject: o, resolve: t, lookup: r }),
          n._addToQueue(n.target, i);
      });
    }),
    (mn.prototype.listen = function (e, t) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      for (var n = this.messages.length, r = !1; --n > -1 && !1 === r; )
        this.messages[n].label === e && (r = this.messages[n]);
      !1 === r && ((r = { label: e, listeners: [] }), this.messages.push(r)),
        r.listeners.push(t);
    }),
    (mn.prototype.answer = function (e, t) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      for (var n = this.incoming.length, r = !1; --n > -1 && !1 === r; )
        this.incoming[n].label === e && (r = this.incoming[n]);
      !1 === r && ((r = { label: e, listeners: [] }), this.incoming.push(r)),
        r.listeners.push(t);
    }),
    (mn.prototype.send = function (e, t) {
      var n = this;
      if (!n.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      var r = { source: "hcaptcha", label: e, id: n.id };
      if (t) {
        if ("object" != typeof t) throw new Error("Message must be an object.");
        r.contents = t;
      }
      n._addToQueue(n.target, r);
    }),
    (mn.prototype.check = function (e, t) {
      for (
        var n = [].concat.apply(
            [],
            [this.messages, this.incoming, this.waiting]
          ),
          r = [],
          i = -1;
        ++i < n.length;

      )
        if (n[i].label === e) {
          if (t && n[i].lookup && t !== n[i].lookup) continue;
          r.push(n[i]);
        }
      return r;
    }),
    (mn.prototype.respond = function (e) {
      for (
        var t,
          n,
          r = -1,
          i = 0,
          o = [].concat.apply([], [this.messages, this.incoming, this.waiting]);
        ++r < o.length;

      )
        if (o[r].label === e.label) {
          if (e.lookup && o[r].lookup && e.lookup !== o[r].lookup) continue;
          var a = [];
          if (
            ((t = o[r]),
            e.error && a.push(e.error),
            e.contents && a.push(e.contents),
            e.promise && "create" !== e.promise)
          ) {
            t[e.promise].apply(t[e.promise], a);
            for (var s = this.waiting.length, c = !1; --s > -1 && !1 === c; )
              this.waiting[s].label === t.label &&
                this.waiting[s].lookup === t.lookup &&
                ((c = !0), this.waiting.splice(s, 1));
            continue;
          }
          for (i = 0; i < t.listeners.length; i++) {
            if (((n = t.listeners[i]), "create" === e.promise)) {
              var l = this._contactPromise(t.label, e.lookup);
              a.push(l);
            }
            n.apply(n, a);
          }
        }
      o = null;
    }),
    (mn.prototype.destroy = function () {
      return (
        this.clearQueue(),
        (this.messages = null),
        (this.incoming = null),
        (this.waiting = null),
        (this.isReady = !1),
        null
      );
    }),
    (mn.prototype._contactPromise = function (e, t) {
      var n = this,
        r = {},
        i = new Promise(function (e, t) {
          (r.resolve = e), (r.reject = t);
        }),
        o = {
          source: "hcaptcha",
          label: e,
          id: n.id,
          promise: null,
          lookup: t,
        };
      return (
        i
          .then(function (e) {
            (o.promise = "resolve"),
              null !== e && (o.contents = e),
              n._addToQueue(n.target, o);
          })
          ["catch"](function (e) {
            (o.promise = "reject"),
              null !== e && (o.error = e),
              n._addToQueue(n.target, o);
          }),
        r
      );
    }),
    (mn.prototype._addToQueue = function (e, t) {
      this.isReady ? this._sendMessage(e, t) : this.queue.push([e, t]);
    });
  var gn = {
    chats: [],
    messages: [],
    globalEnabled: !1,
    isSupported: function () {
      return !!window.postMessage;
    },
    createChat: function (e, t, n) {
      var r = new mn(e, t, n);
      return gn.chats.push(r), r;
    },
    addChat: function (e) {
      gn.chats.push(e);
    },
    removeChat: function (e) {
      for (var t = !1, n = gn.chats.length; --n > -1 && !1 === t; )
        e.id === gn.chats[n].id &&
          e.target === gn.chats[n].target &&
          ((t = gn.chats[n]), gn.chats.splice(n, 1));
      return t;
    },
    consumeMessages: function () {
      var e = gn.messages;
      return (gn.messages = []), e;
    },
    handleGlobal: function (e) {
      if (gn.globalEnabled) {
        var t = gn.messages;
        if (t.length >= 10) gn.globalEnabled = !1;
        else {
          var n = t.some(function (t) {
            return JSON.stringify(t.data) === JSON.stringify(e.data);
          });
          n || t.push(e);
        }
      }
    },
    handle: function (e) {
      var t = e.data,
        n =
          ("string" == typeof t && t.indexOf("hcaptcha") >= 0) ||
          ("object" == typeof t && JSON.stringify(t).indexOf("hcaptcha") >= 0);
      try {
        if (!n) return void gn.handleGlobal(e);
        "string" == typeof t && (t = JSON.parse(t)),
          "d" === t.t && gn.messages.push(e);
        for (var r, i = gn.chats, o = -1; ++o < i.length; ) {
          var a =
            "*" === (r = i[o]).targetOrigin || e.origin === r.targetOrigin;
          r.id === t.id && a && r.respond(t);
        }
      } catch (Jn) {
        Ie("postMessage handler error", "postMessage", "debug", {
          event: e,
          error: Jn,
        });
      }
    },
  };
  function yn(e) {
    var t = e ? dn.getById(e) : dn.getByIndex(0);
    if (!t) throw e ? new sn(e) : new cn();
    dn.remove(t), t.destroy(), (t = null);
  }
  function vn() {
    try {
      return Object.keys(window).sort().join(",");
    } catch (Kn) {
      return null;
    }
  }
  window.addEventListener
    ? window.addEventListener("message", gn.handle)
    : window.attachEvent("onmessage", gn.handle);
  var wn = Ne();
  function bn(e, t) {
    for (var n in t) {
      var r = t[n];
      switch (typeof r) {
        case "string":
          e[n] = r;
          break;
        case "object":
          (e[n] = e[n] || {}), bn(e[n], r);
          break;
        default:
          throw new Error(
            "Source theme contains invalid data types. Only string and object types are supported."
          );
      }
    }
  }
  function _n(e, t) {
    try {
      return e in t;
    } catch (n) {
      return !1;
    }
  }
  function kn(e) {
    return !!e && "object" == typeof e;
  }
  function Vn(e) {
    return kn(e) ? En({}, e) : e;
  }
  function En(e, t) {
    var n,
      r = {},
      i = Object.keys(e);
    for (n = 0; n < i.length; n++) r[i[n]] = Vn(e[i[n]]);
    var o,
      a,
      s = Object.keys(t);
    for (n = 0; n < s.length; n++) {
      var c = s[n];
      if (
        !(
          !_n((o = c), (a = e)) ||
          (Object.hasOwnProperty.call(a, o) &&
            Object.propertyIsEnumerable.call(a, o))
        )
      )
        return;
      _n(c, e) && kn(e[c]) ? (r[c] = En(e[c], t[c])) : (r[c] = Vn(t[c]));
    }
    return r;
  }
  var xn = { transparent: "transparent", white: "#ffffff", black: "#000000" },
    Sn = {
      100: "#fafafa",
      200: "#f5f5f5",
      300: "#E0E0E0",
      400: "#D7D7D7",
      500: "#BFBFBF",
      600: "#919191",
      700: "#555555",
      800: "#333333",
      900: "#222222",
      1e3: "#14191F",
    },
    Rn = "#4DE1D2",
    Tn = "#00838F",
    Un = {
      mode: "light",
      grey: Sn,
      primary: { main: Tn },
      secondary: { main: Rn },
      warn: { light: "#BF1722", main: "#BF1722", dark: "#9D1B1B" },
      text: { heading: Sn[700], body: Sn[700] },
    },
    Cn = {
      mode: "dark",
      grey: Sn,
      primary: { main: Tn },
      secondary: { main: Rn },
      text: { heading: Sn[200], body: Sn[200] },
    };
  function Mn(e, t) {
    return "dark" === t && e in Cn ? Cn[e] : Un[e];
  }
  function On() {
    (this._themes = Object.create(null)),
      (this._active = "light"),
      this.add("light", {}),
      this.add("dark", { palette: { mode: "dark" } });
  }
  (On.prototype.get = function (e) {
    if (!e) return this._themes[this._active];
    var t = this._themes[e];
    if (!t) throw new Error("Cannot find theme with name: " + e);
    return t;
  }),
    (On.prototype.use = function (e) {
      this._themes[e]
        ? (this._active = e)
        : console.error("Cannot find theme with name: " + e);
    }),
    (On.prototype.active = function () {
      return this._active;
    }),
    (On.prototype.add = function (e, t) {
      t || (t = {}),
        (t.palette = (function (e) {
          e || (e = {});
          var t = e.mode || "light",
            n = e.primary || Mn("primary", t),
            r = e.secondary || Mn("secondary", t),
            i = e.warn || Mn("warn", t),
            o = e.grey || Mn("grey", t),
            a = e.text || Mn("text", t);
          return En(
            {
              common: xn,
              mode: t,
              primary: n,
              secondary: r,
              grey: o,
              warn: i,
              text: a,
            },
            e
          );
        })(t.palette)),
        (t.component = t.component || Object.create(null)),
        (this._themes[e] = t);
    }),
    (On.prototype.extend = function (e, t) {
      "string" == typeof t && (t = JSON.parse(t));
      var n = JSON.parse(JSON.stringify(this.get(e)));
      return bn(n, t), n;
    }),
    (On.merge = function (e, t) {
      return En(e, t || {});
    });
  var In = ["light", "dark", "contrast", "grey-red"],
    Nn = new On();
  Nn.add("contrast", {}),
    Nn.add("grey-red", {
      component: { challenge: { main: { border: "#6a6a6a" } } },
    });
  function Wn(e, t) {
    var n = this;
    (this.id = e),
      (this.width = null),
      (this.height = null),
      (this.mobile = !1),
      (this.ready = !1),
      (this.listeners = []),
      (this.config = t),
      (this._visible = !1),
      (this._selected = !1),
      (this.$iframe = new st("iframe")),
      (this._host = ye.host || window.location.hostname);
    var r = ye.assetUrl;
    ve.assethost &&
      (r = ve.assethost + ye.assetUrl.replace(ye.assetDomain, ""));
    var i = r.match(/^.+\:\/\/[^\/]+/),
      o = i ? i[0] : null,
      a =
        r +
        "/hcaptcha.html#frame=challenge&id=" +
        this.id +
        "&host=" +
        this._host +
        (t ? "&" + Ze(this.config) : ""),
      s = ee.Browser.supportsPST();
    this.setupParentContainer(t),
      (this.chat = gn.createChat(this.$iframe.dom, e, o)),
      this.chat.setReady(!1),
      (this._timeoutFailedToInitialize = setTimeout(function () {
        n.$iframe && n.$iframe.isConnected()
          ? Me(
              "Failed to initialize. Iframe attached",
              "error",
              "frame:challenge",
              {
                contentWindow: !!n.$iframe.dom.contentWindow,
                iframeSrc: a,
                supportsPST: s,
                customContainer: n._hasCustomContainer,
              }
            )
          : Me(
              "Failed to initialize. Iframe detached",
              "error",
              "frame:challenge"
            );
      }, 6e4)),
      (this.$iframe.dom.src = a),
      (this.$iframe.dom.frameBorder = 0),
      (this.$iframe.dom.scrolling = "no"),
      ee.Browser.supportsPST() &&
        (this.$iframe.dom.allow =
          "private-state-token-issuance 'src'; private-state-token-redemption 'src'"),
      this.translate(),
      this._hasCustomContainer
        ? (this._hideIframe(), this._parent.appendChild(this.$iframe.dom))
        : ((this.$container = new st("div")),
          (this.$wrapper = this.$container.createElement("div")),
          (this.$overlay = this.$container.createElement("div")),
          (this.$arrow = this.$container.createElement("div")),
          (this.$arrow.fg = this.$arrow.createElement("div")),
          (this.$arrow.bg = this.$arrow.createElement("div")),
          this.style.call(this),
          this.$wrapper.appendElement(this.$iframe),
          this._parent.appendChild(this.$container.dom),
          this.$container.setAttribute("aria-hidden", !0)),
      this.style();
  }
  (Wn.prototype.setupParentContainer = function (e) {
    var t,
      n = e["challenge-container"];
    n && (t = "string" == typeof n ? document.getElementById(n) : n),
      t
        ? ((this._hasCustomContainer = !0), (this._parent = t))
        : ((this._hasCustomContainer = !1), (this._parent = document.body));
  }),
    (Wn.prototype._hideIframe = function () {
      var e = {};
      "ie" !== ee.Browser.type ||
      ("ie" === ee.Browser.type && 8 !== ee.Browser.version)
        ? ((e.opacity = 0), (e.visibility = "hidden"))
        : (e.display = "none"),
        this.$iframe.setAttribute("aria-hidden", !0),
        this.$iframe.css(e);
    }),
    (Wn.prototype._showIframe = function () {
      var e = {};
      "ie" !== ee.Browser.type ||
      ("ie" === ee.Browser.type && 8 !== ee.Browser.version)
        ? ((e.opacity = 1), (e.visibility = "visible"))
        : (e.display = "block"),
        this.$iframe.removeAttribute("aria-hidden"),
        this.$iframe.css(e);
    }),
    (Wn.prototype.style = function () {
      var e = (function (e) {
        var t = e.palette,
          n = e.component;
        return On.merge(
          { main: { fill: t.common.white, border: t.grey[400] } },
          n.challenge
        );
      })(Nn.get());
      if (this._hasCustomContainer)
        this.$iframe.css({
          border: 0,
          position: "relative",
          backgroundColor: e.main.fill,
        });
      else {
        var t = {
          backgroundColor: e.main.fill,
          border: "1px solid " + e.main.border,
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px",
          borderRadius: 4,
          left: "auto",
          top: -1e4,
          zIndex: -9999999999999,
          position: "absolute",
          pointerEvents: "auto",
        };
        "ie" !== ee.Browser.type ||
        ("ie" === ee.Browser.type && 8 !== ee.Browser.version)
          ? ((t.transition = "opacity 0.15s ease-out"),
            (t.opacity = 0),
            (t.visibility = "hidden"))
          : (t.display = "none"),
          this.$container.css(t),
          this.$wrapper.css({ position: "relative", zIndex: 1 }),
          this.$overlay.css({
            width: "100%",
            height: "100%",
            position: "fixed",
            pointerEvents: "none",
            top: 0,
            left: 0,
            zIndex: 0,
            backgroundColor: e.main.fill,
            opacity: 0.05,
          }),
          this.$arrow.css({
            borderWidth: 11,
            position: "absolute",
            pointerEvents: "none",
            marginTop: -11,
            zIndex: 1,
            right: "100%",
          }),
          this.$arrow.fg.css({
            borderWidth: 10,
            borderStyle: "solid",
            borderColor:
              "transparent rgb(255, 255, 255) transparent transparent",
            position: "relative",
            top: 10,
            zIndex: 1,
          }),
          this.$arrow.bg.css({
            borderWidth: 11,
            borderStyle: "solid",
            borderColor:
              "transparent " + e.main.border + " transparent transparent",
            position: "relative",
            top: -11,
            zIndex: 0,
          }),
          this.$iframe.css({ border: 0, zIndex: 2e9, position: "relative" });
      }
    }),
    (Wn.prototype.setup = function (e) {
      return this.chat.send("create-challenge", e);
    }),
    (Wn.prototype.sendTranslation = function (e) {
      var t = { locale: e, table: mt.getTable(e) || {} };
      this.chat && this.chat.send("challenge-translate", t), this.translate();
    }),
    (Wn.prototype.translate = function () {
      this.$iframe.dom.title = mt.translate(
        "Main content of the hCaptcha challenge"
      );
    }),
    (Wn.prototype.isVisible = function () {
      return this._visible;
    }),
    (Wn.prototype.getDimensions = function (e, t) {
      return this._visible
        ? this.chat.contact("resize-challenge", { width: e, height: t })
        : Promise.resolve(null);
    }),
    (Wn.prototype.show = function () {
      if (!0 !== this._visible)
        if (((this._visible = !0), this._hasCustomContainer))
          this._showIframe();
        else {
          var e = { zIndex: 9999999999999, display: "block" };
          ("ie" !== ee.Browser.type ||
            ("ie" === ee.Browser.type && 8 !== ee.Browser.version)) &&
            ((e.opacity = 1), (e.visibility = "visible")),
            this.$container.css(e),
            this.$container.removeAttribute("aria-hidden"),
            this.$overlay.css({ pointerEvents: "auto", cursor: "pointer" });
        }
    }),
    (Wn.prototype.focus = function () {
      this.$iframe.dom.focus();
    }),
    (Wn.prototype.close = function (e) {
      if (!1 !== this._visible) {
        if (((this._visible = !1), this._hasCustomContainer))
          return (
            this._hideIframe(),
            void this.chat.send("close-challenge", { event: e })
          );
        var t = { left: "auto", top: -1e4, zIndex: -9999999999999 };
        "ie" !== ee.Browser.type ||
        ("ie" === ee.Browser.type && 8 !== ee.Browser.version)
          ? ((t.opacity = 0), (t.visibility = "hidden"))
          : (t.display = "none"),
          this.$container.css(t),
          this._hasCustomContainer ||
            this.$overlay.css({ pointerEvents: "none", cursor: "default" }),
          this.chat.send("close-challenge", { event: e }),
          this.$container.setAttribute("aria-hidden", !0);
      }
    }),
    (Wn.prototype.size = function (e, t, n) {
      (this.width = e),
        (this.height = t),
        (this.mobile = n),
        this.$iframe.css({ width: e, height: t }),
        this._hasCustomContainer ||
          (this.$wrapper.css({ width: e, height: t }),
          n
            ? this.$overlay.css({ opacity: 0.5 })
            : this.$overlay.css({ opacity: 0.05 }));
    }),
    (Wn.prototype.position = function (e) {
      if (!this._hasCustomContainer && e) {
        var t = 10,
          n = window.document.documentElement,
          r = ee.Browser.scrollY(),
          i = ee.Browser.width(),
          o = ee.Browser.height(),
          a =
            this.mobile ||
            "invisible" === this.config.size ||
            e.offset.left + e.tick.x <= e.tick.width / 2,
          s = Math.round(e.bounding.top) + r !== e.offset.top,
          c = a ? (i - this.width) / 2 : e.bounding.left + e.tick.right + 10;
        (c + this.width + t > i || c < 0) &&
          ((c = (i - this.width) / 2), (a = !0));
        var l =
            (n.scrollHeight < n.clientHeight
              ? n.clientHeight
              : n.scrollHeight) -
            this.height -
            t,
          h = a
            ? (o - this.height) / 2 + r
            : e.bounding.top + e.tick.y + r - this.height / 2;
        s && h < r && (h = r + t),
          s && h + this.height >= r + o && (h = r + o - (this.height + t)),
          (h = Math.max(Math.min(h, l), 10));
        var u = e.bounding.top + e.tick.y + r - h - 10,
          d = this.height - 10 - 30;
        (u = Math.max(Math.min(u, d), t)),
          this.$container.css({ left: c, top: h }),
          this.$arrow.fg.css({ display: a ? "none" : "block" }),
          this.$arrow.bg.css({ display: a ? "none" : "block" }),
          this.$arrow.css({ top: u }),
          (this.top = h),
          this.$container.dom.getBoundingClientRect();
      }
    }),
    (Wn.prototype.destroy = function () {
      this._timeoutFailedToInitialize &&
        (clearTimeout(this._timeoutFailedToInitialize),
        (this._timeoutFailedToInitialize = null)),
        this._visible && this.close.call(this),
        gn.removeChat(this.chat),
        (this.chat = this.chat.destroy()),
        this._hasCustomContainer
          ? this._parent.removeChild(this.$iframe.dom)
          : (this._parent.removeChild(this.$container.dom),
            (this.$container = this.$container.__destroy())),
        (this.$iframe = this.$iframe.__destroy());
    }),
    (Wn.prototype.setReady = function () {
      var e;
      this._timeoutFailedToInitialize &&
        (clearTimeout(this._timeoutFailedToInitialize),
        (this._timeoutFailedToInitialize = null)),
        this.chat && this.chat.setReady(!0),
        (this.ready = !0);
      for (var t = this.listeners.length; --t > -1; )
        (e = this.listeners[t]), this.listeners.splice(t, 1), e();
    }),
    (Wn.prototype.onReady = function (e) {
      var t = Array.prototype.slice.call(arguments, 1),
        n = function () {
          e.apply(null, t);
        };
      this.ready ? n() : this.listeners.push(n);
    }),
    (Wn.prototype.onOverlayClick = function (e) {
      this._hasCustomContainer || this.$overlay.addEventListener("click", e);
    }),
    (Wn.prototype.setData = function (e) {
      this.chat && this.chat.send("challenge-data", e);
    });
  function Pn(e, t, n) {
    var r = this;
    (this.id = t),
      (this.response = null),
      (this.location = { tick: null, offset: null, bounding: null }),
      (this.config = n),
      (this._ticked = !0),
      (this.$container = e instanceof st ? e : new st(e)),
      (this._host = ye.host || window.location.hostname),
      (this.$iframe = new st("iframe"));
    var i = ye.assetUrl;
    ve.assethost &&
      (i = ve.assethost + ye.assetUrl.replace(ye.assetDomain, ""));
    var o = i.match(/^.+\:\/\/[^\/]+/),
      a = o ? o[0] : null,
      s =
        i +
        "/hcaptcha.html#frame=checkbox&id=" +
        this.id +
        "&host=" +
        this._host +
        (n ? "&" + Ze(this.config) : "");
    (this.chat = gn.createChat(this.$iframe.dom, t, a)),
      this.chat.setReady(!1),
      (this._timeoutFailedToInitialize = setTimeout(function () {
        r.$iframe && r.$iframe.isConnected()
          ? Me(
              "Failed to initialize. Iframe attached",
              "error",
              "frame:checkbox",
              { contentWindow: !!r.$iframe.dom.contentWindow, iframeSrc: s }
            )
          : Me(
              "Failed to initialize. Iframe detached",
              "error",
              "frame:checkbox"
            );
      }, 6e4)),
      (this.$iframe.dom.src = s),
      (this.$iframe.dom.tabIndex = this.config.tabindex || 0),
      (this.$iframe.dom.frameBorder = "0"),
      (this.$iframe.dom.scrolling = "no"),
      ee.Browser.supportsPST() &&
        (this.$iframe.dom.allow =
          "private-state-token-issuance 'src'; private-state-token-redemption 'src'"),
      this.translate(),
      this.config.size &&
        "invisible" === this.config.size &&
        this.$iframe.setAttribute("aria-hidden", "true"),
      this.$iframe.setAttribute("data-hcaptcha-widget-id", t),
      this.$iframe.setAttribute("data-hcaptcha-response", ""),
      this.$container.appendElement(this.$iframe),
      "off" !== ve.recaptchacompat &&
        ((this.$textArea0 = this.$container.createElement(
          "textarea",
          "#g-recaptcha-response-" + t
        )),
        (this.$textArea0.dom.name = "g-recaptcha-response"),
        this.$textArea0.css({ display: "none" })),
      (this.$textArea1 = this.$container.createElement(
        "textarea",
        "#h-captcha-response-" + t
      )),
      (this.$textArea1.dom.name = "h-captcha-response"),
      this.$textArea1.css({ display: "none" }),
      (this.ready = new Promise(function (e) {
        r.chat.listen("checkbox-ready", e);
      }).then(function () {
        r._timeoutFailedToInitialize &&
          (clearTimeout(r._timeoutFailedToInitialize),
          (r._timeoutFailedToInitialize = null)),
          r.chat && r.chat.setReady(!0);
      })),
      (this.clearLoading = this.clearLoading.bind(this)),
      this.style();
  }
  function An(e, t, n) {
    (this.id = t),
      (this.response = null),
      (this.location = { tick: null, offset: null, bounding: null }),
      (this.config = n),
      (this.$container = e instanceof st ? e : new st(e)),
      (this.$iframe = new st("iframe")),
      this.$iframe.setAttribute("aria-hidden", "true"),
      this.$iframe.css({ display: "none" }),
      this.$iframe.setAttribute("data-hcaptcha-widget-id", t),
      this.$iframe.setAttribute("data-hcaptcha-response", "");
    var r = ye.assetUrl;
    ve.assethost &&
      (r = ve.assethost + ye.assetUrl.replace(ye.assetDomain, "")),
      (this.$iframe.dom.src = r + "/hcaptcha.html#frame=checkbox-invisible"),
      this.$container.appendElement(this.$iframe),
      "off" !== ve.recaptchacompat &&
        ((this.$textArea0 = this.$container.createElement(
          "textarea",
          "#g-recaptcha-response-" + t
        )),
        (this.$textArea0.dom.name = "g-recaptcha-response"),
        this.$textArea0.css({ display: "none" })),
      (this.$textArea1 = this.$container.createElement(
        "textarea",
        "#h-captcha-response-" + t
      )),
      (this.$textArea1.dom.name = "h-captcha-response"),
      this.$textArea1.css({ display: "none" });
  }
  function Gn(e, t, n) {
    if (!n.sitekey) throw new ln();
    (this.id = t),
      (this.visible = !1),
      (this.overflow = { override: !1, cssUsed: !0, value: null, scroll: 0 }),
      (this.onError = null),
      (this.onPass = null),
      (this.onExpire = null),
      (this.onChalExpire = null),
      (this.onOpen = null),
      (this.onClose = null),
      (this._ready = !1),
      (this._active = !1),
      (this._listeners = []),
      (this.config = n),
      In.indexOf(n.theme) >= 0 && Nn.use(n.theme),
      (this._state = {
        escaped: !1,
        passed: !1,
        expiredChallenge: !1,
        expiredResponse: !1,
      }),
      (this._origData = null),
      (this._langSet = !1),
      (this._promise = null),
      (this._responseTimer = null),
      (this.initChallenge = this.initChallenge.bind(this)),
      (this.closeChallenge = this.closeChallenge.bind(this)),
      (this.displayChallenge = this.displayChallenge.bind(this)),
      (this.getGetCaptchaManifest = this.getGetCaptchaManifest.bind(this)),
      (this.challenge = new Wn(t, n)),
      "invisible" === this.config.size
        ? (Ie("Invisible mode is set", "hCaptcha", "info"),
          (this.checkbox = new An(e, t, n)))
        : (this.checkbox = new Pn(e, t, n));
  }
  function Fn(e) {
    if ("en" === e) return Promise.resolve();
    var t = e + ".json";
    return new Promise(function (n, r) {
      Ot(t)
        .then(function (n) {
          return (
            n ||
            Mt(t, {
              prefix:
                "https://newassets.hcaptcha.com/captcha/v1/b4d3f0b0031fc2a4abb259f13f0b9f93c45e54c0/static/i18n",
            }).then(function (t) {
              return mt.addTable(e, t.data), t;
            })
          );
        })
        .then(function (e) {
          n(e.data);
        })
        ["catch"](function (e) {
          r(e);
        });
    });
  }
  (Pn.prototype.setResponse = function (e) {
    (this.response = e),
      this.$iframe.dom.setAttribute("data-hcaptcha-response", e),
      "off" !== ve.recaptchacompat && (this.$textArea0.dom.value = e),
      (this.$textArea1.dom.value = e);
  }),
    (Pn.prototype.style = function () {
      var e = this.config.size;
      switch (
        (this.$iframe.css({
          pointerEvents: "auto",
          backgroundColor: "rgba(255,255,255,0)",
        }),
        e)
      ) {
        case "compact":
          this.$iframe.css({ width: 164, height: 144 });
          break;
        case "invisible":
          this.$iframe.css({ display: "none" });
          break;
        default:
          this.$iframe.css({ width: 303, height: 78, overflow: "hidden" });
      }
    }),
    (Pn.prototype.reset = function () {
      (this._ticked = !1),
        this.$iframe &&
          this.$iframe.dom.contentWindow &&
          this.chat &&
          this.chat.send("checkbox-reset");
    }),
    (Pn.prototype.clearLoading = function () {
      this.chat && this.chat.send("checkbox-clear");
    }),
    (Pn.prototype.sendTranslation = function (e) {
      var t = { locale: e, table: mt.getTable(e) || {} };
      this.chat && this.chat.send("checkbox-translate", t), this.translate();
    }),
    (Pn.prototype.translate = function () {
      this.$iframe.dom.title = mt.translate(
        "Widget containing checkbox for hCaptcha security challenge"
      );
    }),
    (Pn.prototype.status = function (e, t) {
      this.$iframe &&
        this.$iframe.dom.contentWindow &&
        this.chat &&
        this.chat.send("checkbox-status", {
          text: e || null,
          a11yOnly: t || !1,
        });
    }),
    (Pn.prototype.tick = function () {
      (this._ticked = !0), this.chat && this.chat.send("checkbox-tick");
    }),
    (Pn.prototype.getTickLocation = function () {
      return this.chat.contact("checkbox-location");
    }),
    (Pn.prototype.getOffset = function () {
      var e = this.$iframe.dom;
      e.offsetParent || (e = e.parentElement);
      for (var t = 0, n = 0; e; )
        (t += e.offsetLeft), (n += e.offsetTop), (e = e.offsetParent);
      return { top: n, left: t };
    }),
    (Pn.prototype.getBounding = function () {
      return this.$iframe.dom.getBoundingClientRect();
    }),
    (Pn.prototype.destroy = function () {
      this._timeoutFailedToInitialize &&
        (clearTimeout(this._timeoutFailedToInitialize),
        (this._timeoutFailedToInitialize = null)),
        this._ticked && this.reset(),
        gn.removeChat(this.chat),
        (this.chat = this.chat.destroy()),
        this.$container.removeElement(this.$iframe),
        this.$container.removeElement(this.$textArea1),
        "off" !== ve.recaptchacompat &&
          (this.$container.removeElement(this.$textArea0),
          (this.$textArea0 = this.$textArea0.__destroy())),
        (this.$textArea1 = this.$textArea1.__destroy()),
        (this.$container = this.$container.__destroy()),
        (this.$iframe = this.$iframe.__destroy());
    }),
    (An.prototype.setResponse = function (e) {
      (this.response = e),
        this.$iframe.dom.setAttribute("data-hcaptcha-response", e),
        "off" !== ve.recaptchacompat && (this.$textArea0.dom.value = e),
        (this.$textArea1.dom.value = e);
    }),
    (An.prototype.reset = function () {}),
    (An.prototype.clearLoading = function () {}),
    (An.prototype.sendTranslation = function (e) {}),
    (An.prototype.status = function (e, t) {}),
    (An.prototype.tick = function () {}),
    (An.prototype.getTickLocation = function () {
      return Promise.resolve({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      });
    }),
    (An.prototype.getOffset = function () {
      var e = this.$iframe.dom;
      e.offsetParent || (e = e.parentElement);
      for (var t = 0, n = 0; e; )
        (t += e.offsetLeft), (n += e.offsetTop), (e = e.offsetParent);
      return { top: n, left: t };
    }),
    (An.prototype.getBounding = function () {
      return this.$iframe.dom.getBoundingClientRect();
    }),
    (An.prototype.destroy = function () {
      this._ticked && this.reset(),
        this.$container.removeElement(this.$iframe),
        this.$container.removeElement(this.$textArea1),
        "off" !== ve.recaptchacompat &&
          (this.$container.removeElement(this.$textArea0),
          (this.$textArea0 = this.$textArea0.__destroy())),
        (this.$textArea1 = this.$textArea1.__destroy()),
        (this.$container = this.$container.__destroy()),
        (this.$iframe = this.$iframe.__destroy());
    }),
    (Gn.prototype._resetTimer = function () {
      null !== this._responseTimer &&
        (clearTimeout(this._responseTimer), (this._responseTimer = null));
    }),
    (Gn.prototype.initChallenge = function (e) {
      e || (e = {}),
        Ie("Initiate challenge", "hCaptcha", "info"),
        (this._origData = e);
      var t = this.getGetCaptchaManifest(),
        n = e.charity || null,
        r = e.a11yChallenge || !1,
        i = e.link || null,
        o = e.action || "",
        a = e.rqdata || null,
        s = e.errors || [],
        c = ee.Browser.width(),
        l = ee.Browser.height();
      (this._active = !0),
        this._resetTimer(),
        this._resetState(),
        this.checkbox.setResponse(""),
        this.challenge.setup({
          a11yChallenge: r,
          manifest: t,
          width: c,
          height: l,
          charity: n,
          link: i,
          action: o,
          rqdata: a,
          wdata: vn(),
          errors: s.concat(wn.collect()),
        });
    }),
    (Gn.prototype.getGetCaptchaManifest = function () {
      var e = (this._origData || {}).manifest || null;
      return (
        e || ((e = Object.create(null)).st = Date.now()),
        (e.v = 1),
        (e.topLevel = Yt.getData()),
        (e.session = dn.getSession()),
        (e.widgetList = dn.getCaptchaIdList()),
        (e.widgetId = this.id),
        (e.href = window.location.href),
        (e.prev = JSON.parse(JSON.stringify(this._state))),
        e
      );
    }),
    (Gn.prototype.displayChallenge = function (e) {
      if (this._active) {
        var t = this;
        this.visible = !0;
        var n = this.checkbox,
          r = this.challenge,
          i = ee.Browser.height();
        if (!("ie" === ee.Browser.type && 8 === ee.Browser.version)) {
          var o = window
            .getComputedStyle(document.body)
            .getPropertyValue("overflow-y");
          (this.overflow.override = "hidden" === o),
            this.overflow.override &&
              ((this.overflow.cssUsed =
                "" === document.body.style.overflow &&
                "" === document.body.style.overflowY),
              this.overflow.cssUsed ||
                (this.overflow.value = "" === o ? "auto" : o),
              (this.overflow.scroll = ee.Browser.scrollY()),
              (document.body.style.overflowY = "auto"));
        }
        return new Promise(function (o) {
          n.status(),
            n.getTickLocation().then(function (a) {
              if (t._active) {
                if (
                  (r.size(e.width, e.height, e.mobile),
                  r.show(),
                  n.clearLoading(),
                  (n.location.bounding = n.getBounding()),
                  (n.location.tick = a),
                  (n.location.offset = n.getOffset()),
                  r.position(n.location),
                  r.focus(),
                  r.height > window.document.documentElement.clientHeight)
                )
                  (
                    window.document.scrollingElement ||
                    document.getElementsByTagName("html")[0]
                  ).scrollTop = Math.abs(r.height - i) + r.top;
                o();
              }
            });
        }).then(function () {
          Ie("Challenge is displayed", "hCaptcha", "info"),
            t.onOpen && Le(t.onOpen);
        });
      }
    }),
    (Gn.prototype.resize = function (e, t, n) {
      var r = this,
        i = this.checkbox,
        o = this.challenge;
      o.getDimensions(e, t)
        .then(function (e) {
          e && o.size(e.width, e.height, e.mobile),
            (i.location.bounding = i.getBounding()),
            (i.location.offset = i.getOffset()),
            (ee.System.mobile && !n) || o.position(i.location);
        })
        ["catch"](function (e) {
          r.closeChallenge.call(r, {
            event: le,
            message: "Captcha resize caused error.",
            error: e,
          });
        });
    }),
    (Gn.prototype.position = function () {
      var e = this.checkbox,
        t = this.challenge;
      ee.System.mobile ||
        ((e.location.bounding = e.getBounding()), t.position(e.location));
    }),
    (Gn.prototype.reset = function () {
      Ie("Captcha Reset", "hCaptcha", "info");
      try {
        this.checkbox.reset(),
          this.checkbox.setResponse(""),
          this._resetTimer(),
          this._resetState();
      } catch (zn) {
        Oe("hCaptcha", zn);
      }
    }),
    (Gn.prototype._resetState = function () {
      for (var e in this._state) this._state[e] = !1;
    }),
    (Gn.prototype.closeChallenge = function (e) {
      (this.visible = !1), (this._active = !1);
      var t = this,
        n = this.checkbox,
        r = this.challenge;
      this.overflow.override &&
        (((
          window.document.scrollingElement ||
          document.getElementsByTagName("html")[0]
        ).scrollTop = this.overflow.scroll),
        (this.overflow.override = !1),
        (this.overflow.scroll = 0),
        (document.body.style.overflowY = this.overflow.cssUsed
          ? null
          : this.overflow.value));
      var i = e.response || "";
      switch (
        (n.setResponse(i),
        r.close(e.event),
        n.$iframe.dom.focus(),
        Ie("Challenge has closed", "hCaptcha", "info", {
          event: e.event,
          response: e.response,
          message: e.message,
        }),
        e.event)
      ) {
        case ne:
          (this._state.escaped = !0),
            n.reset(),
            t.onClose && Le(t.onClose),
            t._promise && t._promise.reject(re);
          break;
        case ie:
          (this._state.expiredChallenge = !0),
            n.reset(),
            n.status("hCaptcha window closed due to timeout.", !0),
            t.onChalExpire && Le(t.onChalExpire),
            t._promise && t._promise.reject(ie);
          break;
        case le:
        case ae:
        case ce:
          var o = e.event;
          n.reset(),
            e.event === ce
              ? (n.status(e.message),
                429 === e.status
                  ? (o = se)
                  : "invalid-data" === e.message
                  ? (o = oe)
                  : "client-fail" === e.message && (o = le))
              : e.event === ae
              ? (o = le)
              : e.event === le &&
                "Answers are incomplete" === e.message &&
                (o = he),
            Me("Failed to execute", "error", "hCaptcha", {
              error: o,
              event: e.event,
              message: e.message,
            }),
            this.onError && Le(this.onError, o),
            t._promise && t._promise.reject(o);
          break;
        case te:
          (this._state.passed = !0),
            n.tick(),
            this.onPass && Le(this.onPass, i),
            t._promise && t._promise.resolve({ response: i, key: fn(this.id) }),
            "number" == typeof e.expiration &&
              (t._resetTimer(),
              (t._responseTimer = setTimeout(function () {
                try {
                  n.$iframe &&
                    (n.$iframe.dom.contentWindow
                      ? (n.reset(),
                        n.setResponse(""),
                        n.status(
                          "hCaptcha security token has expired. Please complete the challenge again.",
                          !0
                        ))
                      : yn(t.id));
                } catch (Jn) {
                  Oe("global", Jn);
                }
                t.onExpire && Le(t.onExpire),
                  (t._responseTimer = null),
                  (t._state.expiredResponse = !0);
              }, 1e3 * e.expiration)));
      }
      t._promise = null;
    }),
    (Gn.prototype.updateTranslation = function (e) {
      (this.config.hl = e),
        (this._langSet = !0),
        this.checkbox && this.checkbox.sendTranslation(e),
        this.challenge && this.challenge.sendTranslation(e);
    }),
    (Gn.prototype.isLangSet = function () {
      return this._langSet;
    }),
    (Gn.prototype.isReady = function () {
      return this._ready;
    }),
    (Gn.prototype.setReady = function (e) {
      if (((this._ready = e), this._ready)) {
        var t;
        Ie("Instance is ready", "hCaptcha", "info");
        for (var n = this._listeners.length; --n > -1; )
          (t = this._listeners[n]), this._listeners.splice(n, 1), t();
      }
    }),
    (Gn.prototype.setPromise = function (e) {
      this._promise = e;
    }),
    (Gn.prototype.onReady = function (e) {
      var t = Array.prototype.slice.call(arguments, 1),
        n = function () {
          e.apply(null, t);
        };
      this._ready ? n() : this._listeners.push(n);
    }),
    (Gn.prototype.destroy = function () {
      (Ie("Captcha Destroy", "hCaptcha", "info"),
      this._resetTimer(),
      this.overflow.override) &&
        (((
          window.document.scrollingElement ||
          document.getElementsByTagName("html")[0]
        ).scrollTop = this.overflow.scroll),
        (this.overflow.override = !1),
        (this.overflow.scroll = 0),
        (document.body.style.overflowY = this.overflow.cssUsed
          ? null
          : this.overflow.value));
      this.challenge.destroy(),
        this.checkbox.destroy(),
        (this.challenge = null),
        (this.checkbox = null);
    }),
    (Gn.prototype.setSiteConfig = function (e) {
      var t = this;
      if ("ok" in e) {
        var n = e.ok.features || {};
        if (this.config.themeConfig && n.custom_theme) {
          var r = "custom-" + this.id;
          Nn.add(r, Nn.extend(Nn.active(), this.config.themeConfig)),
            Nn.use(r),
            this.challenge.style();
        }
      }
      return "invisible" === this.config.size
        ? ("err" in e && console.error("[hCaptcha] " + e.err.message),
          Promise.resolve())
        : this.checkbox.ready.then(function () {
            return (
              t.checkbox.chat.send("site-setup", e),
              new Promise(function (e) {
                t.checkbox.chat.listen("checkbox-loaded", function () {
                  e();
                });
              })
            );
          });
    });
  var jn = 0,
    Bn = [
      "hl",
      "custom",
      "tplinks",
      "sitekey",
      "theme",
      "size",
      "tabindex",
      "challenge-container",
      "confirm-nav",
      "orientation",
      "mode",
    ];
  function Zn(e, t) {
    if (e)
      try {
        e.updateTranslation(t);
      } catch (Jn) {
        Oe("translation", Jn);
      }
  }
  function Dn(e, t) {
    return new Promise(function (n, r) {
      var i = setTimeout(function () {
        r(new Error("timeout"));
      }, t);
      e.then(function (e) {
        clearTimeout(i), n(e);
      })["catch"](function (e) {
        clearTimeout(i), r(e);
      });
    });
  }
  var Hn = {
    render: function (e, t) {
      if (
        ("string" == typeof e && (e = document.getElementById(e)),
        e && 1 === e.nodeType)
      )
        if (
          (function (e) {
            if (!e || !("challenge-container" in e)) return !0;
            var t = e["challenge-container"];
            return (
              "string" == typeof t && (t = document.getElementById(t)),
              !!t && 1 === t.nodeType
            );
          })(t)
        ) {
          if (!1 !== gn.isSupported()) {
            for (
              var n, r, i = e.getElementsByTagName("iframe"), o = -1;
              ++o < i.length && !n;

            )
              (r = i[o].getAttribute("data-hcaptcha-widget-id")) && (n = !0);
            if (n)
              return (
                console.error(
                  "Only one captcha is permitted per parent container."
                ),
                r
              );
            Ie("Render instance", "hCaptcha", "info");
            var a = Qe(e, t),
              s = jn++ + Math.random().toString(36).substr(2),
              c = Object.create(null);
            (c.sentry = ve.sentry),
              (c.reportapi = ve.reportapi),
              (c.recaptchacompat = ve.recaptchacompat),
              (c.custom = ve.custom),
              null !== ve.language && (c.hl = mt.getLocale()),
              ve.assethost && (c.assethost = ve.assethost),
              ve.imghost && (c.imghost = ve.imghost),
              ve.tplinks && (c.tplinks = ve.tplinks),
              ve.se && (c.se = ve.se),
              "off" === ve.pat && (c.pat = ve.pat),
              (c.pstissuer = ve.pstIssuer),
              "landscape" === ve.orientation &&
                (c.orientation = ve.orientation);
            for (var l = 0; l < Bn.length; l++) {
              var h = Bn[l];
              h in a && (c[h] = a[h]);
            }
            var u = ve.endpoint,
              d = c.sitekey;
            "78c843a4-f80d-4a14-b3e5-74b492762487" === d && (u = me),
              u === fe &&
                -1 === ["pt-BR", "es-BR"].indexOf(navigator.language) &&
                Math.random() < 0.001 &&
                d &&
                -1 === d.indexOf("-0000-0000-0000-") &&
                (u = me),
              u !== fe && (c.endpoint = u),
              (c.theme = ve.theme);
            var p = window.location,
              f =
                p.origin ||
                p.protocol + "//" + p.hostname + (p.port ? ":" + p.port : "");
            if (("null" !== f && (c.origin = f), a.theme))
              try {
                var m = a.theme;
                "string" == typeof m && (m = JSON.parse(m)),
                  (c.themeConfig = m),
                  (c.custom = !0);
              } catch (Kn) {
                c.theme = m;
              }
            if (
              e instanceof HTMLButtonElement ||
              e instanceof HTMLInputElement
            ) {
              var g = new st("div", ".h-captcha");
              g.css({ display: "none" });
              for (var y = null, v = 0; v < e.attributes.length; v++)
                (y = e.attributes[v]).name.startsWith("data-") &&
                  g.setAttribute(y.name, y.value);
              var w =
                e.tagName.toLowerCase() +
                "[data-hcaptcha-widget-id='" +
                s +
                "']";
              e.setAttribute("data-hcaptcha-widget-id", s),
                g.setAttribute("data-hcaptcha-source-id", w),
                e.parentNode.insertBefore(g.dom, e),
                (e.onclick = function (e) {
                  return (
                    e.preventDefault(),
                    Ie("User initiated", "hCaptcha", "info"),
                    pn(s)
                  );
                }),
                (e = g),
                (c.size = "invisible");
            }
            c.mode === ge &&
              "invisible" === c.size &&
              (console.warn(
                "[hCaptcha] mode='auto' cannot be used in combination with size='invisible'."
              ),
              delete c.mode);
            try {
              var b = new Gn(e, s, c);
            } catch (Jn) {
              var _ =
                "Your browser plugins or privacy policies are blocking the hCaptcha service. Please disable them for hCaptcha.com";
              return (
                Jn instanceof ln &&
                  ((_ =
                    "hCaptcha has failed to initialize. Please see the developer tools console for more information."),
                  console.error(Jn.message)),
                ke(e, _),
                void Oe("api", Jn)
              );
            }
            a.callback && (b.onPass = a.callback),
              a["expired-callback"] && (b.onExpire = a["expired-callback"]),
              a["chalexpired-callback"] &&
                (b.onChalExpire = a["chalexpired-callback"]),
              a["open-callback"] && (b.onOpen = a["open-callback"]),
              a["close-callback"] && (b.onClose = a["close-callback"]),
              a["error-callback"] && (b.onError = a["error-callback"]);
            try {
              Yt.setData("inv", "invisible" === c.size),
                Yt.setData("size", c.size),
                Yt.setData("theme", et(c.themeConfig || c.theme)),
                Yt.setData("pel", (e.outerHTML || "").replace(e.innerHTML, "")),
                tn.setData("inv", "invisible" === c.size),
                tn.setData("size", c.size),
                tn.setData("theme", et(c.themeConfig || c.theme)),
                tn.setData("pel", (e.outerHTML || "").replace(e.innerHTML, ""));
            } catch (zn) {
              Oe("api", zn);
            }
            return (
              (function (e, t) {
                if ("invisible" === t.size) return;
                e.checkbox.chat.listen("checkbox-selected", function (t) {
                  Ie("User initiated", "hCaptcha", "info"),
                    Dn(en(), 100)
                      ["finally"](function () {
                        var n = "enter" === t.action ? "kb" : "m";
                        Yt.setData("exec", n),
                          tn.setData("exec", n),
                          e.onReady(e.initChallenge, t);
                      })
                      ["catch"](function (e) {
                        Oe("submitvm", e);
                      });
                }),
                  e.checkbox.chat.listen("checkbox-loaded", function (n) {
                    Ie("Loaded", "frame:checkbox", "info"),
                      (e.checkbox.location.bounding = e.checkbox.getBounding()),
                      (e.checkbox.location.tick = n),
                      (e.checkbox.location.offset = e.checkbox.getOffset()),
                      e.checkbox.sendTranslation(t.hl);
                  }),
                  t.mode === ge &&
                    e.onReady(function () {
                      pn(e.id);
                    }, t);
              })(b, c),
              (function (e, t) {
                function n(t, n) {
                  if (t.locale) {
                    var r = mt.resolveLocale(t.locale);
                    Fn(r)
                      .then(function () {
                        n
                          ? Zn(e, r)
                          : (mt.setLocale(r),
                            dn.each(function (e) {
                              Zn(e, r);
                            }));
                      })
                      ["catch"](function (e) {
                        Oe("api", e, { locale: r });
                      });
                  }
                }
                e.challenge.chat.listen("site-setup", function (t) {
                  var n = e.setSiteConfig(t);
                  e.challenge.onReady(function () {
                    n.then(function () {
                      e.setReady(!0);
                    });
                  });
                }),
                  e.challenge.chat.listen("challenge-loaded", function () {
                    Ie("Loaded", "frame:challenge", "info"),
                      e.challenge.setReady(),
                      e.challenge.sendTranslation(t.hl);
                  }),
                  e.challenge.chat.answer("challenge-ready", function (t, n) {
                    e.displayChallenge(t).then(n.resolve);
                  }),
                  e.challenge.chat.listen("challenge-resize", function () {
                    var t = ee.Browser.width(),
                      n = ee.Browser.height();
                    e.resize(t, n);
                  }),
                  e.challenge.chat.listen(re, function (t) {
                    Yt.setData("lpt", Date.now()),
                      tn.setData("lpt", Date.now()),
                      e.closeChallenge(t);
                  }),
                  e.challenge.chat.answer("get-url", function (e) {
                    e.resolve(window.location.href);
                  }),
                  e.challenge.chat.answer("getcaptcha-manifest", function (t) {
                    t.resolve(e.getGetCaptchaManifest());
                  }),
                  e.challenge.chat.answer("check-api", function (e) {
                    Dn(en(), 100)
                      ["finally"](function () {
                        e.resolve(Yt.getData());
                      })
                      ["catch"](function (e) {
                        Oe("submitvm", e);
                      });
                  }),
                  e.challenge.chat.listen("challenge-key", function (t) {
                    dn.pushSession(t.key, e.id);
                  }),
                  e.challenge.onOverlayClick(function () {
                    e.closeChallenge({ event: ne });
                  }),
                  e.challenge.chat.listen("challenge-language", n),
                  n({ locale: t.hl }, !0),
                  e.challenge.chat.answer("get-ac", function (e) {
                    e.resolve(We.hasCookie("hc_accessibility"));
                  });
              })(b, c),
              dn.add(b),
              s
            );
          }
          ke(
            e,
            "Your browser is missing or has disabled Cross-Window Messaging. Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> or enable it for hCaptcha.com"
          );
        } else
          console.log(
            "[hCaptcha] render: invalid challenge container '" +
              t["challenge-container"] +
              "'."
          );
      else console.log("[hCaptcha] render: invalid container '" + e + "'.");
    },
    reset: function (e) {
      var t;
      if (e) {
        if (!(t = dn.getById(e))) throw new sn(e);
        t.reset();
      } else {
        if (!(t = dn.getByIndex(0))) throw new cn();
        t.reset();
      }
    },
    remove: yn,
    execute: pn,
    getResponse: function (e) {
      var t, n;
      if (
        ((n = e ? dn.getById(e) : dn.getByIndex(0)) &&
          (t = n.checkbox.response || ""),
        void 0 !== t)
      )
        return t;
      throw e ? new sn(e) : new cn();
    },
    getRespKey: fn,
    close: function (e) {
      var t = !1;
      if (!(t = e ? dn.getById(e) : dn.getByIndex(0)))
        throw e ? new sn(e) : new cn();
      t.closeChallenge({ event: ne });
    },
    setData: function (e, t) {
      if (
        ("object" != typeof e || t || ((t = e), (e = null)),
        !t || "object" != typeof t)
      )
        throw Error("[hCaptcha] invalid data supplied");
      var n = !1;
      if (!(n = e ? dn.getById(e) : dn.getByIndex(0)))
        throw e ? new sn(e) : new cn();
      Ie("Set data", "hCaptcha", "info");
      var r = n.challenge.setData.bind(n.challenge);
      n.onReady(r, t);
    },
    nodes: dn,
  };
  !(function (e) {
    rn(0), (ye.file = "hcaptcha");
    var t = document.currentScript,
      n = !1,
      r = !1,
      i = "on",
      o = ee.Browser.width() / ee.Browser.height(),
      a = !(!window.hcaptcha || !window.hcaptcha.render);
    function s() {
      var e = ee.Browser.width(),
        t = ee.Browser.height(),
        n = ee.System.mobile && o !== e / t;
      (o = e / t),
        h(),
        Hn.nodes.each(function (r) {
          r.visible && r.resize(e, t, n);
        });
    }
    function c(e) {
      l(),
        Hn.nodes.each(function (e) {
          e.visible && e.position();
        });
    }
    function l() {
      var e = [
        ee.Browser.scrollX(),
        ee.Browser.scrollY(),
        document.documentElement.clientWidth / ee.Browser.width(),
        Date.now(),
      ];
      Yt.circBuffPush("xy", e), tn.circBuffPush("xy", e);
    }
    function h() {
      var e = [
        ee.Browser.width(),
        ee.Browser.height(),
        ee.System.dpr(),
        Date.now(),
      ];
      Yt.circBuffPush("wn", e);
    }
    (window.hcaptcha = {
      render: function () {
        return (
          a ||
            console.warn(
              "[hCaptcha] should not render before js api is fully loaded. `render=explicit` should be used in combination with `onload`."
            ),
          Hn.render.apply(this, arguments)
        );
      },
      remove: Hn.remove,
      execute: Hn.execute,
      reset: Hn.reset,
      close: Hn.close,
      setData: Hn.setData,
      getResponse: Hn.getResponse,
      getRespKey: Hn.getRespKey,
    }),
      wn.run(3e3),
      (function (e) {
        var t = Array.prototype.slice.call(arguments, 1);
        !0 !== Wt &&
        "interactive" !== document.readyState &&
        "loaded" !== document.readyState &&
        "complete" !== document.readyState
          ? (It.push({ fn: e, args: t }), !1 === Nt && Pt())
          : setTimeout(function () {
              e(t);
            }, 1);
      })(function () {
        !(function () {
          var o;
          o = t ? [t] : document.getElementsByTagName("script");
          var a = -1,
            s = !1,
            c = null,
            l = null;
          for (; ++a < o.length && !1 === s; )
            o[a] &&
              o[a].src &&
              ((l = (c = o[a].src.split("?"))[0]),
              /\/(hcaptcha|1\/api)\.js$/.test(l) &&
                ((s = o[a]),
                l &&
                  -1 !== l.toLowerCase().indexOf("www.") &&
                  console.warn(
                    "[hCaptcha] JS API is being loaded from www.hcaptcha.com. Please use https://js.hcaptcha.com/1/api.js"
                  )));
          if (!1 === s) return;
          (e = e || Be(c[1])),
            (n = e.onload || !1),
            (r = e.render || !1),
            "off" === e.tplinks && (i = "off");
          (ve.tplinks = i),
            (ve.language = e.hl || null),
            e.endpoint && (ve.endpoint = e.endpoint);
          (ve.reportapi = e.reportapi || ve.reportapi),
            (ve.imghost = e.imghost || null),
            (ve.custom = e.custom || ve.custom),
            (ve.se = e.se || null),
            (ve.pat = e.pat || ve.pat),
            (ve.pstIssuer = e.pstissuer || ve.pstIssuer),
            (ve.orientation = e.orientation || null),
            e.assethost &&
              (Ye.URL(e.assethost)
                ? (ve.assethost = e.assethost)
                : console.error("Invalid assethost uri."));
          (ve.recaptchacompat = e.recaptchacompat || ve.recaptchacompat),
            (ye.host = e.host || window.location.hostname),
            (ve.sentry = !1 !== e.sentry),
            Ce(!1),
            (ve.language =
              ve.language ||
              window.navigator.userLanguage ||
              window.navigator.language),
            mt.setLocale(ve.language),
            "off" === ve.recaptchacompat
              ? console.log("recaptchacompat disabled")
              : (window.grecaptcha = window.hcaptcha);
        })(),
          n &&
            setTimeout(function () {
              Le(n);
            }, 1),
          a ||
            ((a = !0),
            (function () {
              var e = mt.getLocale();
              if ("en" === e) return;
              Fn(e)
                .then(function () {
                  Hn.nodes.each(function (t) {
                    if (t)
                      try {
                        t.isLangSet() || t.updateTranslation(e);
                      } catch (Jn) {
                        Oe("translation", Jn);
                      }
                  });
                })
                ["catch"](function (t) {
                  Oe("api", t, { locale: e });
                });
            })(),
            !1 === r || "onload" === r
              ? Ve(Hn.render)
              : "explicit" !== r &&
                console.log(
                  "hcaptcha: invalid render parameter '" +
                    r +
                    "', using 'explicit' instead."
                ),
            (function () {
              try {
                Yt.record(),
                  tn.record(),
                  Yt.setData("sc", ee.Browser.getScreenDimensions()),
                  Yt.setData("or", ee.Browser.getOrientation()),
                  Yt.setData("wi", ee.Browser.getWindowDimensions()),
                  Yt.setData("nv", ee.Browser.interrogateNavigator()),
                  Yt.setData("dr", document.referrer),
                  tn.setData("sc", ee.Browser.getScreenDimensions()),
                  tn.setData("wi", ee.Browser.getWindowDimensions()),
                  tn.setData("nv", ee.Browser.interrogateNavigator()),
                  tn.setData("or", ee.Browser.getOrientation()),
                  tn.setData("dr", document.referrer),
                  h(),
                  l();
              } catch (Jn) {
                Oe("motion", Jn);
              }
            })(),
            (function () {
              try {
                nn.record({
                  pointer: !1,
                  keys: !0,
                  touch: !0,
                  focus: !0,
                  input: !0,
                  clipboard: !0,
                });
              } catch (Jn) {
                Oe("bi-vm", Jn);
              }
            })(),
            Ft.addEventListener("resize", s),
            Ft.addEventListener("scroll", c));
      });
  })();
})();
