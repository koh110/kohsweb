(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[36],{5608:function(e,t,r){"use strict";var n=r(8997);t.Z=void 0;var o=n(r(6906)),i=r(9268),l=(0,o.default)((0,i.jsx)("path",{d:"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"}),"MailOutline");t.Z=l},5311:function(e,t,r){"use strict";var n=r(8997);t.Z=void 0,function(e,t){if((t||!e||!e.__esModule)&&null!==e&&("object"==typeof e||"function"==typeof e)){var r=l(t);if(r&&r.has(e))return r.get(e);var n={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&Object.prototype.hasOwnProperty.call(e,i)){var s=o?Object.getOwnPropertyDescriptor(e,i):null;s&&(s.get||s.set)?Object.defineProperty(n,i,s):n[i]=e[i]}n.default=e,r&&r.set(e,n)}}(r(6006));var o=n(r(6906)),i=r(9268);function l(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(l=function(e){return e?r:t})(e)}var s=(0,o.default)((0,i.jsx)("path",{d:"M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"}),"Twitter");t.Z=s},6648:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return E}});var n=r(9268),o=r(4266),i=r.n(o),l=r(5311),s=r(6750),a=r(431),c=r(6006),u=r(9791),f=r(5135),p=r(7562),d=r(3809),h=r(5047);let v=(0,h.ZP)();var m=r(9008),k=r(2272);let y=["sx"],Z=e=>{var t,r;let n={systemProps:{},otherProps:{}},o=null!=(t=null==e?void 0:null==(r=e.theme)?void 0:r.unstable_sxConfig)?t:k.Z;return Object.keys(e).forEach(t=>{o[t]?n.systemProps[t]=e[t]:n.otherProps[t]=e[t]}),n};var b=r(1153),j=r(1559),x=r(8527);let _=["component","direction","spacing","divider","children","className","useFlexGap"],g=(0,b.Z)(),P=v("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,t)=>t.root});function w(e){return(0,m.Z)({props:e,name:"MuiStack",defaultTheme:g})}let O=e=>({row:"Left","row-reverse":"Right",column:"Top","column-reverse":"Bottom"})[e],M=({ownerState:e,theme:t})=>{let r=(0,a.Z)({display:"flex",flexDirection:"column"},(0,j.k9)({theme:t},(0,j.P$)({values:e.direction,breakpoints:t.breakpoints.values}),e=>({flexDirection:e})));if(e.spacing){let n=(0,x.hB)(t),o=Object.keys(t.breakpoints.values).reduce((t,r)=>(("object"==typeof e.spacing&&null!=e.spacing[r]||"object"==typeof e.direction&&null!=e.direction[r])&&(t[r]=!0),t),{}),i=(0,j.P$)({values:e.direction,base:o}),l=(0,j.P$)({values:e.spacing,base:o});"object"==typeof i&&Object.keys(i).forEach((e,t,r)=>{let n=i[e];if(!n){let n=t>0?i[r[t-1]]:"column";i[e]=n}});let s=(t,r)=>e.useFlexGap?{gap:(0,x.NA)(n,t)}:{"& > :not(style) + :not(style)":{margin:0,[`margin${O(r?i[r]:e.direction)}`]:(0,x.NA)(n,t)}};r=(0,f.Z)(r,(0,j.k9)({theme:t},l,s))}return(0,j.dt)(t.breakpoints,r)};var N=r(5457),C=r(8006);let S=function(e={}){let{createStyledComponent:t=P,useThemeProps:r=w,componentName:o="MuiStack"}=e,i=()=>(0,p.Z)({root:["root"]},e=>(0,d.Z)(o,e),{}),l=t(M),h=c.forwardRef(function(e,t){let o=r(e),p=function(e){let t;let{sx:r}=e,n=(0,s.Z)(e,y),{systemProps:o,otherProps:i}=Z(n);return t=Array.isArray(r)?[o,...r]:"function"==typeof r?(...e)=>{let t=r(...e);return(0,f.P)(t)?(0,a.Z)({},o,t):o}:(0,a.Z)({},o,r),(0,a.Z)({},i,{sx:t})}(o),{component:d="div",direction:h="column",spacing:v=0,divider:m,children:k,className:b,useFlexGap:j=!1}=p,x=(0,s.Z)(p,_),g=i();return(0,n.jsx)(l,(0,a.Z)({as:d,ownerState:{direction:h,spacing:v,useFlexGap:j},ref:t,className:(0,u.Z)(g.root,b)},x,{children:m?function(e,t){let r=c.Children.toArray(e).filter(Boolean);return r.reduce((e,n,o)=>(e.push(n),o<r.length-1&&e.push(c.cloneElement(t,{key:`separator-${o}`})),e),[])}(k,m):k}))});return h}({createStyledComponent:(0,N.ZP)("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,t)=>t.root}),useThemeProps:e=>(0,C.Z)({props:e,name:"MuiStack"})});var z=r(5608);function E(){return(0,n.jsxs)(S,{children:[(0,n.jsx)("p",{className:i().head,children:"依頼・ご相談等は下記メール、またはtwitterでご連絡ください。"}),(0,n.jsxs)(S,{direction:"row",spacing:1,children:[(0,n.jsxs)("a",{className:i().link,href:"mailto:kohta110@gmail.com",children:[(0,n.jsx)(z.Z,{fontSize:"small"}),"mail"]}),(0,n.jsxs)("a",{className:i().link,href:"https://twitter.com/koh110",target:"_blank",rel:"noopener noreferrer",children:[(0,n.jsx)(l.Z,{fontSize:"small"}),"@koh110"]})]})]})}},8569:function(e,t,r){Promise.resolve().then(r.t.bind(r,3460,23)),Promise.resolve().then(r.bind(r,6648))},4266:function(e){e.exports={head:"styles_head__suu2d",link:"styles_link___q741"}},3460:function(e){e.exports={title:"styles_title__tXC9q"}}},function(e){e.O(0,[539,667,961,744],function(){return e(e.s=8569)}),_N_E=e.O()}]);