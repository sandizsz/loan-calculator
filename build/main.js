/*! For license information please see main.js.LICENSE.txt */
(()=>{"use strict";var e={338:(e,n,t)=>{var r=t(206);n.H=r.createRoot,r.hydrateRoot},20:(e,n,t)=>{var r=t(594),a=Symbol.for("react.element"),o=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),s=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};function l(e,n,t){var r,l={},c=null,d=null;for(r in void 0!==t&&(c=""+t),void 0!==n.key&&(c=""+n.key),void 0!==n.ref&&(d=n.ref),n)o.call(n,r)&&!i.hasOwnProperty(r)&&(l[r]=n[r]);if(e&&e.defaultProps)for(r in n=e.defaultProps)void 0===l[r]&&(l[r]=n[r]);return{$$typeof:a,type:e,key:c,ref:d,props:l,_owner:s.current}}n.jsx=l,n.jsxs=l},848:(e,n,t)=>{e.exports=t(20)},594:e=>{e.exports=React},206:e=>{e.exports=ReactDOM}},n={};function t(r){var a=n[r];if(void 0!==a)return a.exports;var o=n[r]={exports:{}};return e[r](o,o.exports,t),o.exports}var r=t(338),a=t(594);const o=(...e)=>e.filter(((e,n,t)=>Boolean(e)&&""!==e.trim()&&t.indexOf(e)===n)).join(" ").trim();var s={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const i=(0,a.forwardRef)((({color:e="currentColor",size:n=24,strokeWidth:t=2,absoluteStrokeWidth:r,className:i="",children:l,iconNode:c,...d},u)=>(0,a.createElement)("svg",{ref:u,...s,width:n,height:n,stroke:e,strokeWidth:r?24*Number(t)/Number(n):t,className:o("lucide",i),...d},[...c.map((([e,n])=>(0,a.createElement)(e,n))),...Array.isArray(l)?l:[l]]))),l=(e,n)=>{const t=(0,a.forwardRef)((({className:t,...r},s)=>{return(0,a.createElement)(i,{ref:s,iconNode:n,className:o(`lucide-${l=e,l.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,t),...r});var l}));return t.displayName=`${e}`,t},c=l("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]),d=l("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]),u=l("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);var p=t(848);function m(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var r,a,o,s,i=[],l=!0,c=!1;try{if(o=(t=t.call(e)).next,0===n){if(Object(t)!==t)return;l=!1}else for(;!(l=(r=o.call(t)).done)&&(i.push(r.value),i.length!==n);l=!0);}catch(e){c=!0,a=e}finally{try{if(!l&&null!=t.return&&(s=t.return(),Object(s)!==s))return}finally{if(c)throw a}}return i}}(e,n)||function(e,n){if(e){if("string"==typeof e)return f(e,n);var t={}.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?f(e,n):void 0}}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=Array(n);t<n;t++)r[t]=e[t];return r}const h=function(){var e=m((0,a.useState)([]),2),n=e[0],t=e[1],r=m((0,a.useState)(!0),2),o=r[0],s=r[1],i=m((0,a.useState)(3e3),2),l=i[0],f=i[1],h=m((0,a.useState)(36),2),x=h[0],g=h[1],b=m((0,a.useState)(92.49),2),v=b[0],y=b[1],j=m((0,a.useState)(""),2),w=j[0],N=j[1],k=m((0,a.useState)(""),2),C=k[0],E=k[1],S=m((0,a.useState)({}),2),z=S[0],A=S[1],L=m((0,a.useState)(!1),2),O=L[0],R=L[1],_=m((0,a.useState)(!1),2),F=_[0],M=_[1],D=m((0,a.useState)(null),2),I=D[0],T=D[1],$=(0,a.useRef)(null);(0,a.useEffect)((function(){var e=window.loanCalculatorData||{};if(console.log("WordPress Data:",e),e.kredits&&Array.isArray(e.kredits)){t(e.kredits);var n=window.location.href,r=e.kredits.find((function(e){return n.includes(e.slug)||n.includes(e.url)}));T(r||e.kredits[0])}s(!1)}),[]),(0,a.useEffect)((function(){var e=document.createElement("style");return e.textContent='\n            .calculator-container {\n                background: rgba(255, 255, 255, 0.90);\n                backdrop-filter: blur(8px);\n                -webkit-backdrop-filter: blur(4px);\n                border-radius: 10px;\n                border: 1px solid rgba(255, 255, 255, 0.18);\n                padding: 1.5rem;\n                max-width: 600px;\n                margin: 0 auto;\n            }\n\n            .calculator-container button,\n            .calculator-container [type="button"],\n            .calculator-container [type="submit"] {\n                border: none;\n                background: #4F46E5;\n                color: white;\n                font-weight: 500;\n                border-radius: 6px;\n                transition: all 0.2s;\n            }\n\n            .calculator-container button:hover {\n                background: #4338CA;\n            }\n\n            .range-input {\n                -webkit-appearance: none;\n                width: 100%;\n                height: 6px;\n                background: #e5e7eb;\n                border-radius: 5px;\n                outline: none;\n                opacity: 1;\n                transition: opacity .2s;\n            }\n            \n            .range-input::-webkit-slider-thumb {\n                -webkit-appearance: none;\n                appearance: none;\n                width: 24px;\n                height: 24px;\n                background-color: #FFC600;\n                border: 2px solid white;\n                border-radius: 50%;\n                cursor: pointer;\n                box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n            }\n            \n            .range-input::-moz-range-thumb {\n                width: 24px;\n                height: 24px;\n                background-color: #FFC600;\n                border: 2px solid white;\n                border-radius: 50%;\n                cursor: pointer;\n                box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n            }\n            \n            .input-wrapper {\n                position: relative;\n            }\n            \n            .phone-input-container {\n                position: relative;\n            }\n            \n            .phone-prefix {\n                position: absolute;\n                left: 12px;\n                top: 50%;\n                transform: translateY(-50%);\n                color: #000;\n                font-size: 16px;\n                font-weight: normal;\n                z-index: 1;\n                pointer-events: none;\n            }\n            \n            .form-input {\n                height: 48px;\n                font-size: 16px;\n                width: 100%;\n                padding: 8px 12px;\n                border: 1px solid #D1D5DB;\n                border-radius: 6px;\n                outline: none;\n                transition: border-color 0.2s ease;\n            }\n            \n            .form-input.phone {\n                padding-left: 55px;\n            }\n            \n            .form-input:focus {\n                border-color: #FFC600;\n            }\n            \n            .form-input.error {\n                border-color: #EF4444;\n            }\n            \n            .error-text {\n                color: #EF4444;\n                font-size: 14px;\n                margin-top: 4px;\n            }\n\n            .range-track {\n                background: linear-gradient(to right, #FFC600 var(--range-progress), #e5e7eb var(--range-progress));\n            }\n\n            .kredit-icon {\n                width: 24px;\n                height: 24px;\n                object-fit: contain;\n                border-radius: 4px;\n            }\n\n            .kredit-icon-placeholder {\n                width: 24px;\n                height: 24px;\n                background: #f3f4f6;\n                border-radius: 4px;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n            }\n        ',document.head.appendChild(e),function(){return document.head.removeChild(e)}}),[]),(0,a.useEffect)((function(){var e=.01*l*Math.pow(1.01,x)/(Math.pow(1.01,x)-1);y(e.toFixed(2))}),[l,x]),(0,a.useEffect)((function(){var e=function(e){$.current&&!$.current.contains(e.target)&&R(!1)};return document.addEventListener("mousedown",e),function(){return document.removeEventListener("mousedown",e)}}),[]);var P=function(e,n,t){var r=(e-n)/(t-n)*100;return"linear-gradient(to right, #FFC600 ".concat(r,"%, #e5e7eb ").concat(r,"%)")},W=function(e){return null!=e&&e.icon?(0,p.jsx)("img",{src:e.icon,alt:"",className:"kredit-icon",onError:function(e){e.target.onerror=null,e.target.parentNode.innerHTML='<div class="kredit-icon-placeholder"></div>'}}):(0,p.jsx)("div",{className:"kredit-icon-placeholder"})};return o?(0,p.jsx)("div",{className:"p-4 text-center",children:"Loading calculator..."}):(0,p.jsxs)("div",{className:"calculator-container",children:[n.length>0&&(0,p.jsxs)("div",{className:"relative mb-8",ref:$,onMouseLeave:function(){return R(!1)},children:[(0,p.jsxs)("div",{onClick:function(){return R(!O)},onMouseEnter:function(){return R(!0)},className:"flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg",children:[(0,p.jsxs)("div",{className:"flex items-center gap-2",children:[W(I),(0,p.jsx)("span",{className:"text-gray-800 font-medium",children:(null==I?void 0:I.title)||"Izvēlieties kredītu"})]}),(0,p.jsx)(c,{className:"w-5 h-5 transition-transform ".concat(O?"rotate-180":"")})]}),O&&(0,p.jsx)("div",{className:"absolute w-full mt-2 bg-white rounded-lg shadow-lg z-[100] py-1 border border-gray-100",onMouseEnter:function(){return R(!0)},children:n.map((function(e){return(0,p.jsxs)("div",{onClick:function(n){n.preventDefault(),n.stopPropagation(),T(e),setTimeout((function(){window.location.href=e.url}),150)},className:"flex items-center gap-2 p-3 hover:bg-gray-50 transition-colors cursor-pointer",children:[W(e),(0,p.jsx)("span",{className:"text-gray-800",children:e.title})]},e.id)}))})]}),(0,p.jsxs)("div",{className:"mb-8",children:[(0,p.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,p.jsx)("span",{className:"text-gray-700",children:"Aizdevuma summa"}),(0,p.jsxs)("span",{className:"font-medium",children:[l," €"]})]}),(0,p.jsxs)("div",{className:"relative",children:[(0,p.jsx)("input",{type:"range",min:"500",max:"25000",value:l,onChange:function(e){return f(Number(e.target.value))},className:"range-input",style:{background:P(l,500,25e3)}}),(0,p.jsxs)("div",{className:"absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500",children:[(0,p.jsx)("span",{children:"500 €"}),(0,p.jsx)("span",{children:"25000 €"})]})]})]}),(0,p.jsxs)("div",{className:"mb-8",children:[(0,p.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,p.jsx)("span",{className:"text-gray-700",children:"Aizdevuma termiņš"}),(0,p.jsxs)("span",{className:"font-medium",children:[x," mēn."]})]}),(0,p.jsxs)("div",{className:"relative",children:[(0,p.jsx)("input",{type:"range",min:"3",max:"120",value:x,onChange:function(e){return g(Number(e.target.value))},className:"range-input",style:{background:P(x,3,120)}}),(0,p.jsxs)("div",{className:"absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500",children:[(0,p.jsx)("span",{children:"3 mēn."}),(0,p.jsx)("span",{children:"120 mēn."})]})]})]}),(0,p.jsxs)("div",{className:"bg-blue-50 p-4 rounded-lg mb-6",children:[(0,p.jsxs)("div",{className:"flex items-center",children:[(0,p.jsxs)("span",{className:"text-2xl font-medium",children:[v," €/mēn."]}),(0,p.jsxs)("div",{className:"relative ml-1",onMouseEnter:function(){return M(!0)},onMouseLeave:function(){return M(!1)},children:[(0,p.jsx)(d,{className:"w-4 h-4 text-blue-500 cursor-help"}),F&&(0,p.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg whitespace-nowrap",children:(0,p.jsxs)("div",{className:"relative",children:["Kredīta kalkulatoram ir ilustratīva nozīme",(0,p.jsx)("div",{className:"absolute top-full left-1/2 transform -translate-x-1/2 -mt-1",style:{borderLeft:"6px solid transparent",borderRight:"6px solid transparent",borderTop:"6px solid #111827"}})]})})]})]}),(0,p.jsx)("div",{className:"text-sm text-gray-600 mt-1",children:"Ikmēneša maksājums"})]}),(0,p.jsxs)("div",{className:"grid grid-cols-2 gap-4 mt-6",children:[(0,p.jsx)("div",{className:"col-span-2 md:col-span-1",children:(0,p.jsxs)("div",{className:"input-wrapper",children:[(0,p.jsx)("input",{type:"email",placeholder:"Jūsu e-pasts",value:w,onChange:function(e){return N(e.target.value)},className:"form-input ".concat(z.email?"error":"")}),z.email&&(0,p.jsx)("div",{className:"error-text",children:z.email})]})}),(0,p.jsx)("div",{className:"col-span-2 md:col-span-1",children:(0,p.jsxs)("div",{className:"input-wrapper",children:[(0,p.jsxs)("div",{className:"phone-input-container",children:[(0,p.jsx)("span",{className:"phone-prefix",children:"+371"}),(0,p.jsx)("input",{type:"tel",placeholder:"Jūsu tālrunis",value:C,onChange:function(e){var n=e.target.value.replace(/\D/g,"");n.length<=8&&E(n)},className:"form-input phone ".concat(z.phone?"error":"")})]}),z.phone&&(0,p.jsx)("div",{className:"error-text",children:z.phone})]})})]}),(0,p.jsx)("button",{onClick:function(){if(n={},w?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(w)||(n.email="Nepareizs e-pasta formāts"):n.email="Obligāti aizpildāms lauks",C?/^\d{8}$/.test(C)||(n.phone="Nepareizs tālruņa numura formāts"):n.phone="Obligāti aizpildāms lauks",A(n),0===Object.keys(n).length){var e=new URLSearchParams({amount:l,term:x,email:w,phone:C,kredit_id:(null==I?void 0:I.id)||""}).toString();window.location.href="".concat(window.loanCalculatorData.siteUrl,"/forma/?").concat(e)}var n},className:"w-full bg-green-500 text-white py-3 px-4 rounded-lg mt-4 font-medium hover:bg-green-600 transition-colors border-none",children:"PieteiktiesTXXAaA"}),(0,p.jsxs)("div",{className:"mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2",children:[(0,p.jsx)(u,{className:"w-4 h-4"}),"Nodrošinām bankas līmeņa aizsardzību Jūsu datiem"]})]})};function x(){var e=document.getElementById("loan-calculator-root");e?setTimeout((function(){console.log("Attempting to mount React app");try{(0,r.H)(e).render((0,p.jsx)(h,{})),console.log("React app mounted successfully")}catch(e){console.error("Mounting failed:",e)}}),100):console.error("Root element not found")}"complete"===document.readyState?x():(document.addEventListener("DOMContentLoaded",x),window.addEventListener("load",x))})();