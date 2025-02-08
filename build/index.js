/*! For license information please see index.js.LICENSE.txt */
(()=>{"use strict";var e={338:(e,t,r)=>{var n=r(206);t.H=n.createRoot,n.hydrateRoot},20:(e,t,r)=>{var n=r(594),o=Symbol.for("react.element"),a=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),i=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,r){var n,c={},s=null,u=null;for(n in void 0!==r&&(s=""+r),void 0!==t.key&&(s=""+t.key),void 0!==t.ref&&(u=t.ref),t)a.call(t,n)&&!l.hasOwnProperty(n)&&(c[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps)void 0===c[n]&&(c[n]=t[n]);return{$$typeof:o,type:e,key:s,ref:u,props:c,_owner:i.current}}t.jsx=c,t.jsxs=c},848:(e,t,r)=>{e.exports=r(20)},594:e=>{e.exports=React},206:e=>{e.exports=ReactDOM}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={exports:{}};return e[n](a,a.exports,r),a.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var n=r(338),o=r(594),a=r.n(o),i=r(848);function l(e){var t=e.children;return(0,i.jsx)("div",{className:"bg-white p-6 rounded-lg shadow-md",children:t})}function c(e){var t=e.children;return(0,i.jsx)("div",{className:"p-4",children:t})}function s(e){return s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s(e)}function u(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,p(n.key),n)}}function f(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(f=function(){return!!e})()}function m(e){return m=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},m(e)}function d(e,t){return d=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},d(e,t)}function p(e){var t=function(e){if("object"!=s(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var r=t.call(e,"string");if("object"!=s(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==s(t)?t:t+""}var b=function(e){function t(){var e,r,n,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return e=function(e,t,r){return t=m(t),function(e,t){if(t&&("object"==s(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(e,f()?Reflect.construct(t,r||[],m(e).constructor):t.apply(e,r))}(this,t,[].concat(i)),r=e,o={hasError:!1},(n=p(n="state"))in r?Object.defineProperty(r,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[n]=o,e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&d(e,t)}(t,e),r=t,o=[{key:"getDerivedStateFromError",value:function(e){return{hasError:!0}}}],(n=[{key:"componentDidCatch",value:function(e,t){console.error("Component Error:",e,t)}},{key:"render",value:function(){return this.state.hasError?(0,i.jsx)("div",{className:"error",children:"Calculator failed to load"}):this.props.children}}])&&u(r.prototype,n),o&&u(r,o),Object.defineProperty(r,"prototype",{writable:!1}),r;var r,n,o}(a().Component);function y(e){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},y(e)}function v(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function h(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?v(Object(r),!0).forEach((function(t){g(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):v(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function g(e,t,r){return(t=function(e){var t=function(e){if("object"!=y(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var r=t.call(e,"string");if("object"!=y(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==y(t)?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function x(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a,i,l=[],c=!0,s=!1;try{if(a=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;c=!1}else for(;!(c=(n=a.call(r)).done)&&(l.push(n.value),l.length!==t);c=!0);}catch(e){s=!0,o=e}finally{try{if(!c&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(s)throw o}}return l}}(e,t)||function(e,t){if(e){if("string"==typeof e)return j(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?j(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function j(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}const w=function(){var e,t=x((0,o.useState)({amount:3e3,term:36,email:"",phone:""}),2),r=t[0],n=t[1],a=x((0,o.useState)(0),2),s=a[0],u=a[1],f=x((0,o.useState)({}),2),m=f[0],d=f[1],p=x((0,o.useState)(!1),2),y=(p[0],p[1],window.calculatorConfig||{});null===(e=window.loanCalculatorData)||void 0===e||e.kredits,(0,o.useEffect)((function(){if(r.amount&&r.term){var e=(y.interest_rate||12)/100/12,t=r.amount*e*Math.pow(1+e,r.term)/(Math.pow(1+e,r.term)-1);u(t.toFixed(2))}}),[r.amount,r.term]);var v=function(e){var t=e.target,r=t.name,o=t.value;n((function(e){return h(h({},e),{},g({},r,o))}))};return(0,i.jsx)(b,{children:(0,i.jsx)(l,{className:"w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl backdrop-blur-sm",children:(0,i.jsxs)(c,{className:"p-8 space-y-6",children:[(0,i.jsxs)("div",{className:"mb-8",children:[(0,i.jsxs)("div",{className:"flex justify-between mb-3",children:[(0,i.jsx)("span",{className:"text-gray-700 font-medium",children:"Aizdevuma summa"}),(0,i.jsxs)("span",{className:"font-semibold text-blue-600",children:[r.amount," €"]})]}),(0,i.jsx)("input",{type:"range",min:y.min_amount||500,max:y.max_amount||25e3,value:r.amount,onChange:function(e){return v({target:{name:"amount",value:e.target.value}})},className:"w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer range-lg accent-blue-600 hover:accent-blue-700 transition-colors"})]}),(0,i.jsxs)("div",{className:"mb-8",children:[(0,i.jsxs)("div",{className:"flex justify-between mb-3",children:[(0,i.jsx)("span",{className:"text-gray-700 font-medium",children:"Aizdevuma termiņš"}),(0,i.jsxs)("span",{className:"font-semibold text-blue-600",children:[r.term," mēn."]})]}),(0,i.jsx)("input",{type:"range",min:y.min_term||3,max:y.max_term||120,value:r.term,onChange:function(e){return v({target:{name:"term",value:e.target.value}})},className:"w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer range-lg accent-blue-600 hover:accent-blue-700 transition-colors"})]}),(0,i.jsx)("div",{className:"bg-blue-50 p-6 rounded-lg mb-8 border border-blue-100",children:(0,i.jsxs)("div",{className:"flex items-center justify-center",children:[(0,i.jsxs)("span",{className:"text-3xl font-bold text-blue-800",children:[s," €/mēn."]}),(0,i.jsxs)("div",{className:"tooltip-trigger ml-3",children:[(0,i.jsx)("svg",{className:"w-5 h-5 text-blue-600 cursor-help hover:text-blue-700 transition-colors",viewBox:"0 0 20 20",fill:"currentColor",children:(0,i.jsx)("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",clipRule:"evenodd"})}),(0,i.jsx)("div",{className:"tooltip-content",children:"Kredīta kalkulatoram ir ilustratīva nozīme"})]})]})}),(0,i.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[(0,i.jsxs)("div",{className:"input-wrapper",children:[(0,i.jsx)("input",{type:"email",name:"email",value:r.email,onChange:v,placeholder:"Jūsu e-pasts",className:"w-full px-4 py-3 rounded-lg border ".concat(m.email?"border-red-500":"border-gray-200"," focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all")}),m.email&&(0,i.jsx)("div",{className:"text-red-600 text-sm mt-2 font-medium",children:m.email})]}),(0,i.jsxs)("div",{className:"phone-input-container",children:[(0,i.jsx)("span",{className:"phone-prefix",children:"+371"}),(0,i.jsx)("input",{type:"tel",name:"phone",value:r.phone,onChange:v,placeholder:"Jūsu tālrunis",className:"w-full px-4 py-3 rounded-lg border ".concat(m.phone?"border-red-500":"border-gray-200"," focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all")}),m.phone&&(0,i.jsx)("div",{className:"text-red-600 text-sm mt-2 font-medium",children:m.phone})]})]}),(0,i.jsx)("button",{onClick:function(){if(t={},r.email?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)||(t.email="Nepareizs e-pasta formāts"):t.email="Obligāti aizpildāms lauks",r.phone?/^\d{8}$/.test(r.phone)||(t.phone="Nepareizs tālruņa numura formāts"):t.phone="Obligāti aizpildāms lauks",d(t),0===Object.keys(t).length){var e=new URLSearchParams(r).toString();window.location.href="/forma/?".concat(e)}var t},className:"w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl mt-8 text-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-100 shadow-lg hover:shadow-xl",children:"Pieteikties"}),(0,i.jsxs)("div",{className:"mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2",children:[(0,i.jsx)("svg",{className:"w-4 h-4",viewBox:"0 0 20 20",fill:"currentColor",children:(0,i.jsx)("path",{fillRule:"evenodd",d:"M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"})}),(0,i.jsx)("span",{children:"Nodrošinām bankas līmeņa aizsardzību Jūsu datiem"})]})]})})})};function O(){var e=document.getElementById("loan-calculator-root");e?setTimeout((function(){console.log("Attempting to mount React app");try{(0,n.H)(e).render((0,i.jsx)(w,{})),console.log("React app mounted successfully")}catch(e){console.error("Mounting failed:",e)}}),100):console.error("Root element not found")}"complete"===document.readyState?O():(document.addEventListener("DOMContentLoaded",O),window.addEventListener("load",O))})();