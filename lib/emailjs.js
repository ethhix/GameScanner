//Emailjs library

(() => {
  "use strict";
  var e = {
      d: (t, r) => {
        for (var i in r)
          e.o(r, i) &&
            !e.o(t, i) &&
            Object.defineProperty(t, i, { enumerable: !0, get: r[i] });
      },
      o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
      r: (e) => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      },
    },
    t = {};
  e.r(t),
    e.d(t, {
      default: () => l,
      init: () => i,
      send: () => a,
      sendForm: () => d,
    });
  const r = { _origin: "https://api.emailjs.com" },
    i = function (e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : "https://api.emailjs.com";
      (r._userID = e), (r._origin = t);
    },
    s = (e, t, r) => {
      if (!e)
        throw "The public key is required. Visit https://dashboard.emailjs.com/admin/account";
      if (!t)
        throw "The service ID is required. Visit https://dashboard.emailjs.com/admin";
      if (!r)
        throw "The template ID is required. Visit https://dashboard.emailjs.com/admin/templates";
      return !0;
    };
  class o {
    constructor(e) {
      (this.status = e ? e.status : 0),
        (this.text = e ? e.responseText : "Network Error");
    }
  }
  const n = function (e, t) {
      let i =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
      return new Promise((s, n) => {
        const a = new XMLHttpRequest();
        a.addEventListener("load", (e) => {
          let { target: t } = e;
          const r = new o(t);
          200 === r.status || "OK" === r.text ? s(r) : n(r);
        }),
          a.addEventListener("error", (e) => {
            let { target: t } = e;
            n(new o(t));
          }),
          a.open("POST", r._origin + e, !0),
          Object.keys(i).forEach((e) => {
            a.setRequestHeader(e, i[e]);
          }),
          a.send(t);
      });
    },
    a = (e, t, i, o) => {
      const a = o || r._userID;
      s(a, e, t);
      const d = {
        lib_version: "3.12.1",
        user_id: a,
        service_id: e,
        template_id: t,
        template_params: i,
      };
      return n("/api/v1.0/email/send", JSON.stringify(d), {
        "Content-type": "application/json",
      });
    },
    d = (e, t, i, o) => {
      const a = o || r._userID,
        d = ((e) => {
          let t;
          if (
            ((t = "string" == typeof e ? document.querySelector(e) : e),
            !t || "FORM" !== t.nodeName)
          )
            throw "The 3rd parameter is expected to be the HTML form element or the style selector of form";
          return t;
        })(i);
      s(a, e, t);
      const l = new FormData(d);
      return (
        l.append("lib_version", "3.12.1"),
        l.append("service_id", e),
        l.append("template_id", t),
        l.append("user_id", a),
        n("/api/v1.0/email/send-form", l)
      );
    },
    l = { init: i, send: a, sendForm: d };
  self.emailjs = t;
})();
