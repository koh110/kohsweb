_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[5],{0:function(e,t,n){n("74v/"),e.exports=n("nOHt")},"0PBH":function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return i}));var r=n("nKUr"),c=n("q1tI"),o=Object(c.createContext)(["",function(){},!1,function(){}]),u="kohsweb",i=function(e){var t=e.children,n=Object(c.useState)(""),i=n[0],a=n[1],f=Object(c.useState)(!1),s=f[0],b=f[1],d=null,l=function e(){d=setTimeout((function(){var t=u.slice(0,i.length+1);a(t),t.length!==u.length?e():b(!0)}),200)};return Object(c.useEffect)((function(){return l(),function(){clearTimeout(d)}}),[i]),Object(r.jsx)(o.Provider,{value:[i,a,s,b],children:t})}},"74v/":function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return n("cha2")}])},SU1z:function(e,t,n){},bunB:function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return u}));var r=n("nKUr"),c=n("q1tI"),o=Object(c.createContext)([!1,function(){}]),u=function(e){var t=e.children,n=Object(c.useState)(window.matchMedia("(prefers-color-scheme: dark)").matches),u=n[0],i=n[1];return Object(c.useEffect)((function(){u?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.setAttribute("data-theme","light"),window.matchMedia("(prefers-color-scheme: dark)").addListener((function(e){e.matches?i(!0):i(!1)}))})),Object(r.jsx)(o.Provider,{value:[u,i],children:t})}},cha2:function(e,t,n){"use strict";n.r(t);var r=n("cpVT"),c=n("nKUr"),o=n("bunB"),u=n("0PBH");n("SU1z"),n("zPlV");function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){Object(r.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var f=function(e){var t=e.children;return Object(c.jsx)(c.Fragment,{children:t})};t.default=function(e){var t=e.Component,n=e.pageProps,r=t.Layout||f;return Object(c.jsx)(o.b,{children:Object(c.jsx)(u.b,{children:Object(c.jsx)(r,{children:Object(c.jsx)(t,a({},n))})})})}},cpVT:function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n.d(t,"a",(function(){return r}))},zPlV:function(e,t,n){}},[[0,0,2,1]]]);