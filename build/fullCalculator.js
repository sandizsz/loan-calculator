/*! For license information please see fullCalculator.js.LICENSE.txt */
(()=>{"use strict";var e={338:(e,n,t)=>{var r=t(206);n.H=r.createRoot,r.hydrateRoot},20:(e,n,t)=>{var r=t(594),o=Symbol.for("react.element"),a=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),i=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function s(e,n,t){var r,s={},c=null,u=null;for(r in void 0!==t&&(c=""+t),void 0!==n.key&&(c=""+n.key),void 0!==n.ref&&(u=n.ref),n)a.call(n,r)&&!l.hasOwnProperty(r)&&(s[r]=n[r]);if(e&&e.defaultProps)for(r in n=e.defaultProps)void 0===s[r]&&(s[r]=n[r]);return{$$typeof:o,type:e,key:c,ref:u,props:s,_owner:i.current}}n.jsx=s,n.jsxs=s},848:(e,n,t)=>{e.exports=t(20)},594:e=>{e.exports=React},206:e=>{e.exports=ReactDOM}},n={};function t(r){var o=n[r];if(void 0!==o)return o.exports;var a=n[r]={exports:{}};return e[r](a,a.exports,t),a.exports}var r=t(338),o=t(594);const a=(...e)=>e.filter(((e,n,t)=>Boolean(e)&&""!==e.trim()&&t.indexOf(e)===n)).join(" ").trim();var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const l=(0,o.forwardRef)((({color:e="currentColor",size:n=24,strokeWidth:t=2,absoluteStrokeWidth:r,className:l="",children:s,iconNode:c,...u},m)=>(0,o.createElement)("svg",{ref:m,...i,width:n,height:n,stroke:e,strokeWidth:r?24*Number(t)/Number(n):t,className:a("lucide",l),...u},[...c.map((([e,n])=>(0,o.createElement)(e,n))),...Array.isArray(s)?s:[s]]))),s=(e,n)=>{const t=(0,o.forwardRef)((({className:t,...r},i)=>{return(0,o.createElement)(l,{ref:i,iconNode:n,className:a(`lucide-${s=e,s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,t),...r});var s}));return t.displayName=`${e}`,t},c=s("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]),u=s("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);var m=t(848);function p(e){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p(e)}function d(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function f(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?d(Object(t),!0).forEach((function(n){b(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):d(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function b(e,n,t){return(n=function(e){var n=function(e){if("object"!=p(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var t=n.call(e,"string");if("object"!=p(t))return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==p(n)?n:n+""}(n))in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function h(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var r,o,a,i,l=[],s=!0,c=!1;try{if(a=(t=t.call(e)).next,0===n){if(Object(t)!==t)return;s=!1}else for(;!(s=(r=a.call(t)).done)&&(l.push(r.value),l.length!==n);s=!0);}catch(e){c=!0,o=e}finally{try{if(!s&&null!=t.return&&(i=t.return(),Object(i)!==i))return}finally{if(c)throw o}}return l}}(e,n)||x(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function x(e,n){if(e){if("string"==typeof e)return y(e,n);var t={}.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?y(e,n):void 0}}function y(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=Array(n);t<n;t++)r[t]=e[t];return r}const g=function(){(0,o.useEffect)((function(){var e=document.createElement("style");return e.textContent='\n      .loan-form-container {\n        background: rgba(255, 255, 255, 0.90);\n        backdrop-filter: blur(8px);\n        -webkit-backdrop-filter: blur(4px);\n        border-radius: 10px;\n        border: 1px solid rgba(255, 255, 255, 0.18);\n        padding: 1.5rem;\n        max-width: 800px;\n        margin: 0 auto;\n      }\n\n      .loan-form-container button,\n      .loan-form-container [type="button"],\n      .loan-form-container [type="submit"] {\n        border: none !important;\n        background: #4F46E5 !important;\n        color: white !important;\n        font-weight: 500 !important;\n        border-radius: 6px !important;\n        transition: all 0.2s !important;\n        padding: 12px 24px !important;\n        cursor: pointer !important;\n      }\n\n      .loan-form-container button:hover {\n        background: #4338CA !important;\n      }\n\n      .loan-form-input {\n        height: 48px !important;\n        font-size: 16px !important;\n        width: 100% !important;\n        padding: 8px 12px !important;\n        border: 1px solid #D1D5DB !important;\n        border-radius: 6px !important;\n        outline: none !important;\n        transition: border-color 0.2s ease !important;\n        background: white !important;\n      }\n\n      .loan-form-input:focus {\n        border-color: #4F46E5 !important;\n        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;\n      }\n\n      .loan-form-select {\n        position: relative;\n        width: 100%;\n      }\n\n      .loan-form-label {\n        display: block !important;\n        font-size: 14px !important;\n        font-weight: 500 !important;\n        color: #374151 !important;\n        margin-bottom: 4px !important;\n      }\n\n      .loan-form-checkbox {\n        margin-right: 8px !important;\n      }\n\n      .loan-form-select-trigger {\n        display: inline-flex !important;\n        align-items: center !important;\n        justify-content: space-between !important;\n        width: 100% !important;\n        padding: 12px !important;\n        background: white !important;\n        border: 1px solid #D1D5DB !important;\n        border-radius: 6px !important;\n        font-size: 16px !important;\n      }\n\n      .loan-form-select-content {\n        overflow: hidden;\n        background: white;\n        border-radius: 6px;\n        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n        margin-top: 4px;\n      }\n\n      .loan-form-field {\n        margin-bottom: 16px !important;\n      }\n\n      .required-mark {\n        color: #EF4444 !important;\n        margin-left: 4px !important;\n      }\n\n      .phone-input-container {\n        position: relative !important;\n      }\n\n      .phone-prefix {\n        position: absolute !important;\n        left: 12px !important;\n        top: 50% !important;\n        transform: translateY(-50%) !important;\n        color: #000 !important;\n        font-size: 16px !important;\n        pointer-events: none !important;\n      }\n\n      .loan-form-input.phone {\n        padding-left: 55px !important;\n      }\n    ',document.head.appendChild(e),function(){return document.head.removeChild(e)}}),[]);var e=h((0,o.useState)(1),2),n=e[0],t=e[1],r=h((0,o.useState)({fullName:"",email:"",phone:"",companyName:"",registrationNumber:"",companyAge:"",annualTurnover:"",profitLoss:"",position:"",mainActivity:"",currentLoans:"",taxDebt:"Nav",taxDebtAmount:"",delayedPayments:"Nē",requiredAmount:"",desiredTerm:"",urgency:"",purpose:[],financialProduct:"",collateral:[],collateralDescription:"",otherApplications:"Nē",dataProcessing:!1,marketing:!1}),2),a=r[0],i=r[1],l=function(e){var n,t=e.target,r=t.name,o=t.value,l=t.type,s=t.checked;if("checkbox"===l)if("purpose"===r||"collateral"===r){var c=a[r].includes(o)?a[r].filter((function(e){return e!==o})):[].concat(function(e){if(Array.isArray(e))return y(e)}(n=a[r])||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(n)||x(n)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),[o]);i((function(e){return f(f({},e),{},b({},r,c))}))}else i((function(e){return f(f({},e),{},b({},r,s))}));else i((function(e){return f(f({},e),{},b({},r,o))}))},s=function(e){var n=e.label,t=e.required,r=e.children,o=e.className,a=void 0===o?"":o;return(0,m.jsxs)("div",{className:"loan-form-field ".concat(a),children:[(0,m.jsxs)("label",{className:"loan-form-label",children:[n," ",t&&(0,m.jsx)("span",{className:"required-mark",children:"*"})]}),r]})};return(0,m.jsxs)("div",{className:"loan-form-container",children:[(0,m.jsxs)("div",{className:"mb-8",children:[(0,m.jsx)("h2",{className:"text-2xl font-bold text-gray-800 mb-4",children:1===n?"Kontaktinformācija un Uzņēmuma informācija":"Finanses, Kredītsaistības, Aizdevuma vajadzības"}),(0,m.jsx)("div",{className:"h-2 bg-gray-200 rounded-full",children:(0,m.jsx)("div",{className:"h-2 bg-blue-600 rounded-full transition-all duration-300",style:{width:"".concat(n/2*100,"%")}})})]}),(0,m.jsxs)("form",{onSubmit:function(e){return e.preventDefault()},className:"space-y-6",children:[1===n?(0,m.jsxs)("div",{className:"space-y-4",children:[(0,m.jsx)(s,{label:"Vārds, Uzvārds",required:!0,children:(0,m.jsx)("input",{type:"text",name:"fullName",required:!0,className:"loan-form-input",value:a.fullName,onChange:l})}),(0,m.jsx)(s,{label:"E-pasts",required:!0,children:(0,m.jsx)("input",{type:"email",name:"email",required:!0,className:"loan-form-input",value:a.email,onChange:l})}),(0,m.jsx)(s,{label:"Tālrunis",required:!0,children:(0,m.jsxs)("div",{className:"phone-input-container",children:[(0,m.jsx)("span",{className:"phone-prefix",children:"+371"}),(0,m.jsx)("input",{type:"tel",name:"phone",required:!0,className:"loan-form-input phone",value:a.phone,onChange:l})]})}),(0,m.jsx)(s,{label:"Uzņēmuma nosaukums",required:!0,children:(0,m.jsx)("input",{type:"text",name:"companyName",required:!0,className:"loan-form-input",value:a.companyName,onChange:l})}),(0,m.jsx)(s,{label:"Reģistrācijas numurs",required:!0,children:(0,m.jsx)("input",{type:"text",name:"registrationNumber",required:!0,className:"loan-form-input",value:a.registrationNumber,onChange:l})})]}):(0,m.jsxs)("div",{className:"space-y-4",children:[(0,m.jsx)(s,{label:"Tekošās kredītsaistības",required:!0,children:(0,m.jsx)("input",{type:"text",name:"currentLoans",required:!0,className:"loan-form-input",placeholder:"Pamatsummas atlikums EUR, Finanšu iestāde",value:a.currentLoans,onChange:l})}),(0,m.jsxs)("div",{className:"space-y-2",children:[(0,m.jsx)(s,{label:"",children:(0,m.jsxs)("label",{className:"flex items-center",children:[(0,m.jsx)("input",{type:"checkbox",name:"dataProcessing",className:"loan-form-checkbox",checked:a.dataProcessing,onChange:l,required:!0}),(0,m.jsx)("span",{children:"Piekrītu datu apstrādei"})]})}),(0,m.jsx)(s,{label:"",children:(0,m.jsxs)("label",{className:"flex items-center",children:[(0,m.jsx)("input",{type:"checkbox",name:"marketing",className:"loan-form-checkbox",checked:a.marketing,onChange:l}),(0,m.jsx)("span",{children:"Vēlos saņemt mārketinga ziņas"})]})})]})]}),(0,m.jsxs)("div",{className:"flex justify-between pt-6",children:[n>1&&(0,m.jsxs)("button",{type:"button",onClick:function(){return t(n-1)},className:"flex items-center",children:[(0,m.jsx)(c,{className:"w-5 h-5 mr-2"}),"Iepriekšējais"]}),n<2?(0,m.jsxs)("button",{type:"button",onClick:function(){return t(n+1)},className:"flex items-center ml-auto",children:["Nākamais",(0,m.jsx)(u,{className:"w-5 h-5 ml-2"})]}):(0,m.jsx)("button",{type:"submit",className:"flex items-center ml-auto",children:"Iesniegt"})]})]})]})};function v(){var e=document.getElementById("full-calculator-root");e&&setTimeout((function(){console.log("Mounting Full Calculator React app"),(0,r.H)(e).render((0,m.jsx)(g,{}))}),0)}"complete"===document.readyState?v():document.addEventListener("DOMContentLoaded",v)})();