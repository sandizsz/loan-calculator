/*! For license information please see main.js.LICENSE.txt */
(()=>{"use strict";var e={338:(e,n,t)=>{var r=t(206);n.H=r.createRoot,r.hydrateRoot},20:(e,n,t)=>{var r=t(594),o=Symbol.for("react.element"),a=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),i=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,s={key:!0,ref:!0,__self:!0,__source:!0};function l(e,n,t){var r,l={},c=null,u=null;for(r in void 0!==t&&(c=""+t),void 0!==n.key&&(c=""+n.key),void 0!==n.ref&&(u=n.ref),n)a.call(n,r)&&!s.hasOwnProperty(r)&&(l[r]=n[r]);if(e&&e.defaultProps)for(r in n=e.defaultProps)void 0===l[r]&&(l[r]=n[r]);return{$$typeof:o,type:e,key:c,ref:u,props:l,_owner:i.current}}n.jsx=l,n.jsxs=l},848:(e,n,t)=>{e.exports=t(20)},594:e=>{e.exports=React},206:e=>{e.exports=ReactDOM}},n={};function t(r){var o=n[r];if(void 0!==o)return o.exports;var a=n[r]={exports:{}};return e[r](a,a.exports,t),a.exports}var r=t(338),o=t(594);const a=(...e)=>e.filter(((e,n,t)=>Boolean(e)&&""!==e.trim()&&t.indexOf(e)===n)).join(" ").trim();var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const s=(0,o.forwardRef)((({color:e="currentColor",size:n=24,strokeWidth:t=2,absoluteStrokeWidth:r,className:s="",children:l,iconNode:c,...u},d)=>(0,o.createElement)("svg",{ref:d,...i,width:n,height:n,stroke:e,strokeWidth:r?24*Number(t)/Number(n):t,className:a("lucide",s),...u},[...c.map((([e,n])=>(0,o.createElement)(e,n))),...Array.isArray(l)?l:[l]]))),l=(e,n)=>{const t=(0,o.forwardRef)((({className:t,...r},i)=>{return(0,o.createElement)(s,{ref:i,iconNode:n,className:a(`lucide-${l=e,l.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,t),...r});var l}));return t.displayName=`${e}`,t},c=l("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]),u=l("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]),d=l("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);var p=t(848);function m(e){return m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},m(e)}function f(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function h(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?f(Object(t),!0).forEach((function(n){x(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):f(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function x(e,n,t){return(n=function(e){var n=function(e){if("object"!=m(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var t=n.call(e,"string");if("object"!=m(t))return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==m(n)?n:n+""}(n))in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function b(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var r,o,a,i,s=[],l=!0,c=!1;try{if(a=(t=t.call(e)).next,0===n){if(Object(t)!==t)return;l=!1}else for(;!(l=(r=a.call(t)).done)&&(s.push(r.value),s.length!==n);l=!0);}catch(e){c=!0,o=e}finally{try{if(!l&&null!=t.return&&(i=t.return(),Object(i)!==i))return}finally{if(c)throw o}}return s}}(e,n)||function(e,n){if(e){if("string"==typeof e)return g(e,n);var t={}.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?g(e,n):void 0}}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=Array(n);t<n;t++)r[t]=e[t];return r}const v=function(){var e=b((0,o.useState)([]),2),n=e[0],t=e[1],r=b((0,o.useState)(!0),2),a=r[0],i=r[1],s=b((0,o.useState)(3e3),2),l=s[0],m=s[1],f=b((0,o.useState)(36),2),x=f[0],g=f[1],v=b((0,o.useState)(92.49),2),y=v[0],j=v[1],w=b((0,o.useState)(""),2),N=w[0],k=w[1],S=b((0,o.useState)(""),2),O=S[0],E=S[1],C=b((0,o.useState)({}),2),z=C[0],P=C[1],R=b((0,o.useState)(!1),2),D=R[0],L=R[1],_=b((0,o.useState)(!1),2),A=_[0],F=_[1],M=b((0,o.useState)(null),2),I=M[0],$=M[1],T=(0,o.useRef)(null);(0,o.useEffect)((function(){var e=window.loanCalculatorData||{};if(console.log("WordPress Data:",e),e.kredits&&Array.isArray(e.kredits)){var n=e.kredits.map((function(e){return h(h({},e),{},{icon:e.icon?new URL(e.icon,window.location.origin).href:null})}));t(n);var r=window.location.href,o=n.find((function(e){return r.includes(e.slug)||r.includes(e.url)}));$(o||n[0])}i(!1)}),[]),(0,o.useEffect)((function(){var e=document.createElement("style");return e.textContent='\n            .calculator-container {\n                background: rgba(255, 255, 255, 0.90);\n                backdrop-filter: blur(8px);\n                -webkit-backdrop-filter: blur(4px);\n                border-radius: 10px;\n                border: 1px solid rgba(255, 255, 255, 0.18);\n                padding: 1.5rem;\n                max-width: 600px;\n                margin: 0 auto;\n            }\n\n            .calculator-container button,\n            .calculator-container [type="button"],\n            .calculator-container [type="submit"] {\n                border: none;\n                background: #4F46E5;\n                color: white;\n                font-weight: 500;\n                border-radius: 6px;\n                transition: all 0.2s;\n            }\n\n            .calculator-container button:hover {\n                background: #4338CA;\n            }\n\n            .range-input {\n                -webkit-appearance: none;\n                width: 100%;\n                height: 6px;\n                background: #e5e7eb;\n                border-radius: 5px;\n                outline: none;\n                opacity: 1;\n                transition: opacity .2s;\n            }\n            \n            .range-input::-webkit-slider-thumb {\n                -webkit-appearance: none;\n                appearance: none;\n                width: 24px;\n                height: 24px;\n                background-color: #FFC600;\n                border: 2px solid white;\n                border-radius: 50%;\n                cursor: pointer;\n                box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n            }\n            \n            .range-input::-moz-range-thumb {\n                width: 24px;\n                height: 24px;\n                background-color: #FFC600;\n                border: 2px solid white;\n                border-radius: 50%;\n                cursor: pointer;\n                box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n            }\n            \n            .input-wrapper {\n                position: relative;\n            }\n            \n            .phone-input-container {\n                position: relative;\n            }\n            \n            .phone-prefix {\n                position: absolute;\n                left: 12px;\n                top: 50%;\n                transform: translateY(-50%);\n                color: #000;\n                font-size: 16px;\n                font-weight: normal;\n                z-index: 1;\n                pointer-events: none;\n            }\n            \n            .form-input {\n                height: 48px;\n                font-size: 16px;\n                width: 100%;\n                padding: 8px 12px;\n                border: 1px solid #D1D5DB;\n                border-radius: 6px;\n                outline: none;\n                transition: border-color 0.2s ease;\n            }\n            \n            .form-input.phone {\n                padding-left: 55px;\n            }\n            \n            .form-input:focus {\n                border-color: #FFC600;\n            }\n            \n            .form-input.error {\n                border-color: #EF4444;\n            }\n            \n            .error-text {\n                color: #EF4444;\n                font-size: 14px;\n                margin-top: 4px;\n            }\n\n            .range-track {\n                background: linear-gradient(to right, #FFC600 var(--range-progress), #e5e7eb var(--range-progress));\n            }\n\n            .kredit-icon {\n                width: 24px;\n                height: 24px;\n                object-fit: contain;\n                border-radius: 4px;\n            }\n\n            .kredit-icon-placeholder {\n                width: 24px;\n                height: 24px;\n                background: #f3f4f6;\n                border-radius: 4px;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n            }\n        ',document.head.appendChild(e),function(){return document.head.removeChild(e)}}),[]),(0,o.useEffect)((function(){var e=.01*l*Math.pow(1.01,x)/(Math.pow(1.01,x)-1);j(e.toFixed(2))}),[l,x]),(0,o.useEffect)((function(){var e=function(e){T.current&&!T.current.contains(e.target)&&L(!1)};return document.addEventListener("mousedown",e),function(){return document.removeEventListener("mousedown",e)}}),[]);var U=function(e,n,t){var r=(e-n)/(t-n)*100;return"linear-gradient(to right, #FFC600 ".concat(r,"%, #e5e7eb ").concat(r,"%)")},W=function(e){return null!=e&&e.icon?(0,p.jsxs)("div",{className:"kredit-icon-wrapper",children:[(0,p.jsx)("img",{src:e.icon,alt:"",className:"kredit-icon",onError:function(e){e.target.style.display="none",e.target.nextSibling.style.display="flex"}}),(0,p.jsx)("div",{className:"kredit-icon-placeholder",style:{display:"none"}})]}):(0,p.jsx)("div",{className:"kredit-icon-placeholder"})};return a?(0,p.jsx)("div",{className:"p-4 text-center",children:"Loading calculator..."}):(0,p.jsxs)("div",{className:"calculator-container",children:[n.length>0&&(0,p.jsxs)("div",{className:"relative mb-8",ref:T,onMouseLeave:function(){return L(!1)},children:[(0,p.jsxs)("div",{onClick:function(){return L(!D)},onMouseEnter:function(){return L(!0)},className:"flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg",children:[(0,p.jsxs)("div",{className:"flex items-center gap-2",children:[W(I),(0,p.jsx)("span",{className:"text-gray-800 font-medium",children:(null==I?void 0:I.title)||"Izvēlieties kredītu"})]}),(0,p.jsx)(c,{className:"w-5 h-5 transition-transform ".concat(D?"rotate-180":"")})]}),D&&(0,p.jsx)("div",{className:"absolute w-full mt-2 bg-white rounded-lg shadow-lg z-[100] py-1 border border-gray-100",onMouseEnter:function(){return L(!0)},children:n.map((function(e){return(0,p.jsxs)("div",{onClick:function(n){n.preventDefault(),n.stopPropagation(),$(e),L(!1),e.url&&(window.location.href=e.url)},className:"flex items-center gap-2 p-3 hover:bg-gray-50 transition-colors cursor-pointer",children:[W(e),(0,p.jsx)("span",{className:"text-gray-800",children:e.title})]},e.id)}))})]}),(0,p.jsxs)("div",{className:"mb-8",children:[(0,p.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,p.jsx)("span",{className:"text-gray-700",children:"Aizdevuma summa"}),(0,p.jsxs)("span",{className:"font-medium",children:[l," €"]})]}),(0,p.jsxs)("div",{className:"relative",children:[(0,p.jsx)("input",{type:"range",min:"500",max:"25000",value:l,onChange:function(e){return m(Number(e.target.value))},className:"range-input",style:{background:U(l,500,25e3)}}),(0,p.jsxs)("div",{className:"absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500",children:[(0,p.jsx)("span",{children:"500 €"}),(0,p.jsx)("span",{children:"25000 €"})]})]})]}),(0,p.jsxs)("div",{className:"mb-8",children:[(0,p.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,p.jsx)("span",{className:"text-gray-700",children:"Aizdevuma termiņš"}),(0,p.jsxs)("span",{className:"font-medium",children:[x," mēn."]})]}),(0,p.jsxs)("div",{className:"relative",children:[(0,p.jsx)("input",{type:"range",min:"3",max:"120",value:x,onChange:function(e){return g(Number(e.target.value))},className:"range-input",style:{background:U(x,3,120)}}),(0,p.jsxs)("div",{className:"absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500",children:[(0,p.jsx)("span",{children:"3 mēn."}),(0,p.jsx)("span",{children:"120 mēn."})]})]})]}),(0,p.jsxs)("div",{className:"bg-blue-50 p-4 rounded-lg mb-6",children:[(0,p.jsxs)("div",{className:"flex items-center",children:[(0,p.jsxs)("span",{className:"text-2xl font-medium",children:[y," €/mēn."]}),(0,p.jsxs)("div",{className:"relative ml-1",onMouseEnter:function(){return F(!0)},onMouseLeave:function(){return F(!1)},children:[(0,p.jsx)(u,{className:"w-4 h-4 text-blue-500 cursor-help"}),A&&(0,p.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg whitespace-nowrap",children:(0,p.jsxs)("div",{className:"relative",children:["Kredīta kalkulatoram ir ilustratīva nozīme",(0,p.jsx)("div",{className:"absolute top-full left-1/2 transform -translate-x-1/2 -mt-1",style:{borderLeft:"6px solid transparent",borderRight:"6px solid transparent",borderTop:"6px solid #111827"}})]})})]})]}),(0,p.jsx)("div",{className:"text-sm text-gray-600 mt-1",children:"Ikmēneša maksājums"})]}),(0,p.jsxs)("div",{className:"grid grid-cols-2 gap-4 mt-6",children:[(0,p.jsx)("div",{className:"col-span-2 md:col-span-1",children:(0,p.jsxs)("div",{className:"input-wrapper",children:[(0,p.jsx)("input",{type:"email",placeholder:"Jūsu e-pasts",value:N,onChange:function(e){return k(e.target.value)},className:"form-input ".concat(z.email?"error":"")}),z.email&&(0,p.jsx)("div",{className:"error-text",children:z.email})]})}),(0,p.jsx)("div",{className:"col-span-2 md:col-span-1",children:(0,p.jsxs)("div",{className:"input-wrapper",children:[(0,p.jsxs)("div",{className:"phone-input-container",children:[(0,p.jsx)("span",{className:"phone-prefix",children:"+371"}),(0,p.jsx)("input",{type:"tel",placeholder:"Jūsu tālrunis",value:O,onChange:function(e){var n=e.target.value.replace(/\D/g,"");n.length<=8&&E(n)},className:"form-input phone ".concat(z.phone?"error":"")})]}),z.phone&&(0,p.jsx)("div",{className:"error-text",children:z.phone})]})})]}),(0,p.jsx)("button",{onClick:function(){if(n={},N?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(N)||(n.email="Nepareizs e-pasta formāts"):n.email="Obligāti aizpildāms lauks",O?/^\d{8}$/.test(O)||(n.phone="Nepareizs tālruņa numura formāts"):n.phone="Obligāti aizpildāms lauks",P(n),0===Object.keys(n).length){var e=new URLSearchParams({amount:l,term:x,email:N,phone:O,kredit_id:(null==I?void 0:I.id)||""}).toString();window.location.href="".concat(window.loanCalculatorData.siteUrl,"/forma/?").concat(e)}var n},className:"w-full bg-green-500 text-white py-3 px-4 rounded-lg mt-4 font-medium hover:bg-green-600 transition-colors border-none",children:"Pieteikties"}),(0,p.jsxs)("div",{className:"mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2",children:[(0,p.jsx)(d,{className:"w-4 h-4"}),"Nodrošinām bankas līmeņa aizsardzību Jūsu datiem"]})]})};function y(){var e=document.getElementById("loan-calculator-root");e?setTimeout((function(){console.log("Attempting to mount React app");try{(0,r.H)(e).render((0,p.jsx)(v,{})),console.log("React app mounted successfully")}catch(e){console.error("Mounting failed:",e)}}),100):console.error("Root element not found")}"complete"===document.readyState?y():(document.addEventListener("DOMContentLoaded",y),window.addEventListener("load",y))})();