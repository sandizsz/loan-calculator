/*! For license information please see main.js.LICENSE.txt */
(()=>{"use strict";var e={338:(e,t,r)=>{var n=r(206);t.H=n.createRoot,n.hydrateRoot},20:(e,t,r)=>{var n=r(594),o=Symbol.for("react.element"),a=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),i=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,s={key:!0,ref:!0,__self:!0,__source:!0};function l(e,t,r){var n,l={},c=null,u=null;for(n in void 0!==r&&(c=""+r),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(u=t.ref),t)a.call(t,n)&&!s.hasOwnProperty(n)&&(l[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps)void 0===l[n]&&(l[n]=t[n]);return{$$typeof:o,type:e,key:c,ref:u,props:l,_owner:i.current}}t.jsx=l,t.jsxs=l},848:(e,t,r)=>{e.exports=r(20)},594:e=>{e.exports=React},206:e=>{e.exports=ReactDOM}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={exports:{}};return e[n](a,a.exports,r),a.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var n=r(338),o=r(594),a=r.n(o),i=r(848);function s(e){return s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s(e)}function l(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,m(n.key),n)}}function c(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(c=function(){return!!e})()}function u(e){return u=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},u(e)}function d(e,t){return d=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},d(e,t)}function m(e){var t=function(e){if("object"!=s(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var r=t.call(e,"string");if("object"!=s(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==s(t)?t:t+""}var f=function(e){function t(){var e,r,n,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return e=function(e,t,r){return t=u(t),function(e,t){if(t&&("object"==s(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(e,c()?Reflect.construct(t,r||[],u(e).constructor):t.apply(e,r))}(this,t,[].concat(i)),r=e,o={hasError:!1},(n=m(n="state"))in r?Object.defineProperty(r,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[n]=o,e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&d(e,t)}(t,e),r=t,o=[{key:"getDerivedStateFromError",value:function(e){return{hasError:!0}}}],(n=[{key:"componentDidCatch",value:function(e,t){console.error("Component Error:",e,t)}},{key:"render",value:function(){return this.state.hasError?(0,i.jsx)("div",{className:"error",children:"Calculator failed to load"}):this.props.children}}])&&l(r.prototype,n),o&&l(r,o),Object.defineProperty(r,"prototype",{writable:!1}),r;var r,n,o}(a().Component);function p(e){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p(e)}function y(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function v(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?y(Object(r),!0).forEach((function(t){h(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):y(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function h(e,t,r){return(t=function(e){var t=function(e){if("object"!=p(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var r=t.call(e,"string");if("object"!=p(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==p(t)?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function b(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a,i,s=[],l=!0,c=!1;try{if(a=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;l=!1}else for(;!(l=(n=a.call(r)).done)&&(s.push(n.value),s.length!==t);l=!0);}catch(e){c=!0,o=e}finally{try{if(!l&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(c)throw o}}return s}}(e,t)||function(e,t){if(e){if("string"==typeof e)return j(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?j(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function j(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}const x=function(){var e,t=(0,o.useRef)(null),r=b((0,o.useState)({amount:3e3,term:36,email:"",phone:""}),2),n=r[0],a=r[1],s=b((0,o.useState)(92.49),2),l=s[0],c=s[1],u=b((0,o.useState)(!1),2),d=u[0],m=u[1],p=b((0,o.useState)(null),2),y=p[0],j=p[1],x=(null===(e=window.loanCalculatorData)||void 0===e?void 0:e.kredits)||[];(0,o.useEffect)((function(){function e(e){t.current&&!t.current.contains(e.target)&&m(!1)}return document.addEventListener("mousedown",e),function(){return document.removeEventListener("mousedown",e)}}),[]),(0,o.useEffect)((function(){x.length>0&&!y&&j(x[0])}),[x]);var g=function(e){var t=e.target,r=t.name,n=t.value;a((function(e){return v(v({},e),{},h({},r,n))}))};return(0,o.useEffect)((function(){if(n.amount&&n.term){var e=.01*n.amount*Math.pow(1.01,n.term)/(Math.pow(1.01,n.term)-1);c(e.toFixed(2))}}),[n.amount,n.term]),(0,i.jsx)(f,{children:(0,i.jsxs)("div",{className:"loan-calculator",children:[(0,i.jsxs)("div",{className:"relative",ref:t,children:[(0,i.jsxs)("div",{className:"loan-header",onClick:function(){return m(!d)},children:[(0,i.jsxs)("div",{className:"flex items-center gap-2",children:[null!=y&&y.icon?(0,i.jsx)("img",{src:y.icon,alt:"",className:"loan-header-icon"}):(0,i.jsx)("img",{src:"/path-to-calendar-icon.svg",alt:"",className:"loan-header-icon"}),(0,i.jsx)("h2",{className:"text-xl font-medium",children:(null==y?void 0:y.title)||"Patēriņa kredīts"})]}),(0,i.jsx)("button",{className:"text-gray-500",children:(0,i.jsx)("svg",{className:"w-6 h-6",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,i.jsx)("path",{d:"M6 9L12 15L18 9",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})})]}),d&&(0,i.jsx)("div",{className:"loan-dropdown",children:x.map((function(e){return(0,i.jsxs)("a",{href:e.url,className:"loan-dropdown-item",onClick:function(){j(e),m(!1)},children:[(0,i.jsx)("img",{src:e.icon,alt:"",className:"loan-header-icon"}),(0,i.jsx)("span",{children:e.title})]},e.id)}))})]}),(0,i.jsxs)("div",{className:"slider-container",children:[(0,i.jsxs)("div",{className:"slider-header",children:[(0,i.jsx)("span",{className:"slider-label",children:"Aizdevuma summa"}),(0,i.jsxs)("span",{className:"slider-value",children:[n.amount," €"]})]}),(0,i.jsxs)("div",{className:"slider-track",children:[(0,i.jsx)("div",{className:"slider-range amount-range",style:{width:"".concat((n.amount-500)/24500*100,"%")}}),(0,i.jsx)("input",{type:"range",min:"500",max:"25000",value:n.amount,onChange:function(e){return g({target:{name:"amount",value:e.target.value}})},className:"amount-slider"})]}),(0,i.jsxs)("div",{className:"flex justify-between text-sm text-gray-500 mt-1",children:[(0,i.jsx)("span",{children:"500 €"}),(0,i.jsx)("span",{children:"25000 €"})]})]}),(0,i.jsxs)("div",{className:"slider-container",children:[(0,i.jsxs)("div",{className:"slider-header",children:[(0,i.jsx)("span",{className:"slider-label",children:"Aizdevuma termiņš"}),(0,i.jsxs)("span",{className:"slider-value",children:[n.term," mēn."]})]}),(0,i.jsxs)("div",{className:"slider-track",children:[(0,i.jsx)("div",{className:"slider-range term-range",style:{width:"".concat((n.term-3)/117*100,"%")}}),(0,i.jsx)("input",{type:"range",min:"3",max:"120",value:n.term,onChange:function(e){return g({target:{name:"term",value:e.target.value}})},className:"term-slider"})]}),(0,i.jsxs)("div",{className:"flex justify-between text-sm text-gray-500 mt-1",children:[(0,i.jsx)("span",{children:"3 mēn."}),(0,i.jsx)("span",{children:"120 mēn."})]})]}),(0,i.jsxs)("div",{className:"monthly-payment",children:[(0,i.jsxs)("div",{className:"flex items-center gap-2",children:[(0,i.jsxs)("span",{className:"monthly-payment-amount",children:[l," €/mēn."]}),(0,i.jsx)("svg",{className:"w-5 h-5 text-blue-500",viewBox:"0 0 20 20",fill:"currentColor",children:(0,i.jsx)("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",clipRule:"evenodd"})})]}),(0,i.jsx)("span",{className:"text-gray-600",children:"Ikmēneša maksājums"})]}),(0,i.jsxs)("div",{className:"space-y-4",children:[(0,i.jsx)("input",{type:"email",name:"email",value:n.email,onChange:g,placeholder:"Jūsu e-pasts",className:"input-field"}),(0,i.jsxs)("div",{className:"relative",children:[(0,i.jsx)("span",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-500",children:"+371"}),(0,i.jsx)("input",{type:"tel",name:"phone",value:n.phone,onChange:g,placeholder:"Jūsu tālrunis",className:"input-field pl-12"})]}),(0,i.jsx)("button",{className:"submit-button",children:"Pieteikties"})]}),(0,i.jsxs)("div",{className:"security-badge",children:[(0,i.jsxs)("svg",{className:"w-5 h-5",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[(0,i.jsx)("path",{d:"M9 12L11 14L15 10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),(0,i.jsx)("path",{d:"M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z",stroke:"currentColor",strokeWidth:"2"})]}),(0,i.jsx)("span",{children:"Nodrošinām bankas līmeņa aizsardzību Jūsu datiem"})]})]})})};function g(){var e=document.getElementById("loan-calculator-root");e?setTimeout((function(){console.log("Attempting to mount React app");try{(0,n.H)(e).render((0,i.jsx)(x,{})),console.log("React app mounted successfully")}catch(e){console.error("Mounting failed:",e)}}),100):console.error("Root element not found")}"complete"===document.readyState?g():(document.addEventListener("DOMContentLoaded",g),window.addEventListener("load",g))})();