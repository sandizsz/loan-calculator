/*! For license information please see main.js.LICENSE.txt */
(()=>{"use strict";var e={338:(e,n,t)=>{var r=t(206);n.H=r.createRoot,r.hydrateRoot},20:(e,n,t)=>{var r=t(594),o=Symbol.for("react.element"),a=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),i=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function s(e,n,t){var r,s={},c=null,u=null;for(r in void 0!==t&&(c=""+t),void 0!==n.key&&(c=""+n.key),void 0!==n.ref&&(u=n.ref),n)a.call(n,r)&&!l.hasOwnProperty(r)&&(s[r]=n[r]);if(e&&e.defaultProps)for(r in n=e.defaultProps)void 0===s[r]&&(s[r]=n[r]);return{$$typeof:o,type:e,key:c,ref:u,props:s,_owner:i.current}}n.jsx=s,n.jsxs=s},848:(e,n,t)=>{e.exports=t(20)},594:e=>{e.exports=React},206:e=>{e.exports=ReactDOM}},n={};function t(r){var o=n[r];if(void 0!==o)return o.exports;var a=n[r]={exports:{}};return e[r](a,a.exports,t),a.exports}var r=t(338),o=t(594);const a=(...e)=>e.filter(((e,n,t)=>Boolean(e)&&""!==e.trim()&&t.indexOf(e)===n)).join(" ").trim();var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const l=(0,o.forwardRef)((({color:e="currentColor",size:n=24,strokeWidth:t=2,absoluteStrokeWidth:r,className:l="",children:s,iconNode:c,...u},d)=>(0,o.createElement)("svg",{ref:d,...i,width:n,height:n,stroke:e,strokeWidth:r?24*Number(t)/Number(n):t,className:a("lucide",l),...u},[...c.map((([e,n])=>(0,o.createElement)(e,n))),...Array.isArray(s)?s:[s]]))),s=(e,n)=>{const t=(0,o.forwardRef)((({className:t,...r},i)=>{return(0,o.createElement)(l,{ref:i,iconNode:n,className:a(`lucide-${s=e,s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,t),...r});var s}));return t.displayName=`${e}`,t},c=s("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]),u=s("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]),d=s("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);var p=t(848);function m(e){return m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},m(e)}function f(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var r,o,a,i,l=[],s=!0,c=!1;try{if(a=(t=t.call(e)).next,0===n){if(Object(t)!==t)return;s=!1}else for(;!(s=(r=a.call(t)).done)&&(l.push(r.value),l.length!==n);s=!0);}catch(e){c=!0,o=e}finally{try{if(!s&&null!=t.return&&(i=t.return(),Object(i)!==i))return}finally{if(c)throw o}}return l}}(e,n)||function(e,n){if(e){if("string"==typeof e)return h(e,n);var t={}.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?h(e,n):void 0}}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=Array(n);t<n;t++)r[t]=e[t];return r}function b(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function x(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?b(Object(t),!0).forEach((function(n){g(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):b(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function g(e,n,t){return(n=function(e){var n=function(e){if("object"!=m(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var t=n.call(e,"string");if("object"!=m(t))return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==m(n)?n:n+""}(n))in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}const y=function(){(0,o.useEffect)((function(){var e=document.createElement("style");return e.textContent="\n    input[type='range'] {\n        -webkit-appearance: none;\n        height: 8px;\n        padding: 0;\n        margin: 0;\n    }\n    input[type='range']::-webkit-slider-thumb {\n        -webkit-appearance: none;\n        appearance: none;\n        width: 32px;\n        height: 32px;\n        background: white;\n        border: 3px solid #FFB800;\n        border-radius: 50%;\n        cursor: pointer;\n        margin-top: -12px;\n    }\n    input[type='range']::-moz-range-thumb {\n        width: 32px;\n        height: 32px;\n        background: white;\n        border: 3px solid #FFB800;\n        border-radius: 50%;\n        cursor: pointer;\n    }\n    input[type='range']::-webkit-slider-runnable-track {\n        width: 100%;\n        height: 8px;\n        border-radius: 4px;\n        cursor: pointer;\n    }\n    input[type='range']::-moz-range-track {\n        width: 100%;\n        height: 8px;\n        border-radius: 4px;\n        cursor: pointer;\n    }\n\n    /* Override Elementor styles for our loan calculator inputs */\n    .loan-calculator input[type=date], \n    .loan-calculator input[type=email], \n    .loan-calculator input[type=number], \n    .loan-calculator input[type=password], \n    .loan-calculator input[type=search], \n    .loan-calculator input[type=tel], \n    .loan-calculator input[type=text], \n    .loan-calculator input[type=url], \n    .loan-calculator select, \n    .loan-calculator textarea {\n        width: 100% !important;\n        padding: 0.625rem 1rem !important;\n        border: 1px solid #e5e7eb !important;\n        border-radius: 0.5rem !important;\n        transition: all 0.2s ease !important;\n        box-shadow: none !important;\n        background-color: #fff !important;\n        font-size: 16px !important;\n        line-height: 1.5 !important;\n        outline: none !important;\n    }\n    \n    .loan-calculator input[type=email]:focus,\n    .loan-calculator input[type=tel]:focus,\n    .loan-calculator input[type=text]:focus {\n        border-color: #ffc600 !important;\n        box-shadow: 0 0 0 1px #ffc600 !important;\n    }\n    \n    /* Preserve specific Tailwind styles */\n    .loan-calculator input[type=email].border-red-500,\n    .loan-calculator input[type=tel].border-red-500,\n    .loan-calculator input[type=text].border-red-500 {\n        border-color: #ef4444 !important;\n    }\n",document.head.appendChild(e),function(){return document.head.removeChild(e)}}),[]);var e=f((0,o.useState)([]),2),n=e[0],t=e[1],r=f((0,o.useState)(!0),2),a=r[0],i=r[1],l=f((0,o.useState)(2e4),2),s=l[0],m=l[1],h=f((0,o.useState)(48),2),b=h[0],g=h[1],y=f((0,o.useState)(92.49),2),v=y[0],w=y[1],j=f((0,o.useState)(""),2),N=j[0],k=j[1],O=f((0,o.useState)(""),2),S=O[0],E=O[1],C=f((0,o.useState)({}),2),z=C[0],F=C[1],P=f((0,o.useState)(!1),2),D=P[0],R=P[1],_=f((0,o.useState)(!1),2),A=_[0],L=_[1],I=f((0,o.useState)(null),2),M=I[0],$=I[1],T=(0,o.useRef)(null);(0,o.useEffect)((function(){var e=window.loanCalculatorData||{};if(console.log("WordPress Data:",e),e.kredits&&Array.isArray(e.kredits)){var n=e.kredits.map((function(e){return x(x({},e),{},{icon:e.icon?e.icon.replace("http://","https://"):null})}));t(n);var r=window.location.href,o=n.find((function(e){return r.includes(e.slug)||r.includes(e.url)}));$(o||n[0])}i(!1)}),[]),(0,o.useEffect)((function(){var e=document.createElement("style");return e.textContent='\n            .calculator-container {\n                background: rgba(255, 255, 255, 0.90);\n                backdrop-filter: blur(8px);\n                -webkit-backdrop-filter: blur(4px);\n                border-radius: 10px;\n                border: 1px solid rgba(255, 255, 255, 0.18);\n                padding: 1.5rem;\n                max-width: 600px;\n                margin: 0 auto;\n            }\n\n            .calculator-container button,\n            .calculator-container [type="button"],\n            .calculator-container [type="submit"] {\n                border: none;\n                background: #4F46E5;\n                color: white;\n                font-weight: 500;\n                border-radius: 6px;\n                transition: all 0.2s;\n            }\n\n            .calculator-container button:hover {\n                background: #4338CA;\n            }\n\n            .range-input {\n                -webkit-appearance: none;\n                width: 100%;\n                height: 6px;\n                background: #e5e7eb;\n                border-radius: 5px;\n                outline: none;\n                opacity: 1;\n                transition: opacity .2s;\n            }\n            \n            .range-input::-webkit-slider-thumb {\n                -webkit-appearance: none;\n                appearance: none;\n                width: 24px;\n                height: 24px;\n                background-color: #FFC600;\n                border: 2px solid white;\n                border-radius: 50%;\n                cursor: pointer;\n                box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n            }\n            \n            .range-input::-moz-range-thumb {\n                width: 24px;\n                height: 24px;\n                background-color: #FFC600;\n                border: 2px solid white;\n                border-radius: 50%;\n                cursor: pointer;\n                box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n            }\n            \n            .input-wrapper {\n                position: relative;\n            }\n            \n            .phone-input-container {\n                position: relative;\n            }\n            \n            .phone-prefix {\n                position: absolute;\n                left: 12px;\n                top: 50%;\n                transform: translateY(-50%);\n                color: #000;\n                font-size: 16px;\n                font-weight: normal;\n                z-index: 1;\n                pointer-events: none;\n            }\n            \n            .form-input {\n                height: 48px;\n                font-size: 16px;\n                width: 100%;\n                padding: 8px 12px;\n                border: 1px solid #D1D5DB;\n                border-radius: 6px;\n                outline: none;\n                transition: border-color 0.2s ease;\n            }\n            \n            .form-input.phone {\n                padding-left: 55px;\n            }\n            \n            .form-input:focus {\n                border-color: #FFC600;\n            }\n            \n            .form-input.error {\n                border-color: #EF4444;\n            }\n            \n            .error-text {\n                color: #EF4444;\n                font-size: 14px;\n                margin-top: 4px;\n            }\n\n            .range-track {\n                background: linear-gradient(to right, #FFC600 var(--range-progress), #e5e7eb var(--range-progress));\n            }\n\n            .kredit-icon-wrapper {\n                width: 24px;\n                height: 24px;\n                position: relative;\n            }\n\n            .kredit-icon {\n                width: 100%;\n                height: 100%;\n                object-fit: contain;\n                border-radius: 4px;\n            }\n\n            .kredit-icon-placeholder {\n                width: 100%;\n                height: 100%;\n                background: #f3f4f6;\n                border-radius: 4px;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                position: absolute;\n                top: 0;\n                left: 0;\n            }\n        ',document.head.appendChild(e),function(){return document.head.removeChild(e)}}),[]),(0,o.useEffect)((function(){var e=.01*s*Math.pow(1.01,b)/(Math.pow(1.01,b)-1);w(e.toFixed(2))}),[s,b]),(0,o.useEffect)((function(){var e=function(e){T.current&&!T.current.contains(e.target)&&R(!1)};return document.addEventListener("mousedown",e),function(){return document.removeEventListener("mousedown",e)}}),[]);var B=function(e,n,t){var r=(e-n)/(t-n)*100;return"linear-gradient(to right, #FFC600 ".concat(r,"%, #e5e7eb ").concat(r,"%)")};return a?(0,p.jsx)("div",{className:"p-4 text-center",children:"Loading calculator..."}):(0,p.jsxs)("div",{className:"loan-calculator bg-white/90 backdrop-blur-md rounded-lg border border-white/20 p-6 max-w-full mx-auto",children:[(0,p.jsxs)("div",{className:"relative mb-8",ref:T,children:[(0,p.jsxs)("div",{onClick:function(){return R(!D)},className:"flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg border border-gray-200",children:[(0,p.jsxs)("div",{className:"flex items-center gap-2",children:[(null==M?void 0:M.icon)&&(0,p.jsx)("img",{src:M.icon,alt:"",className:"w-6 h-6 object-contain",onError:function(e){return e.target.style.display="none"}}),(0,p.jsx)("span",{className:"text-gray-800 font-medium",children:(null==M?void 0:M.title)||"Izvēlieties kredītu"})]}),(0,p.jsx)(c,{className:"w-5 h-5 transition-transform ".concat(D?"rotate-180":"")})]}),D&&(0,p.jsx)("div",{className:"absolute w-full mt-1 bg-white rounded-2xl shadow-lg z-[100] border border-gray-200",style:{maxHeight:"300px",overflowY:"auto"},children:n.map((function(e){return(0,p.jsxs)("div",{onClick:function(n){n.preventDefault(),$(e),R(!1);var t=window.loanCalculatorConfig||{},r="true"===t.noRedirect||!0===t.noRedirect;e.url&&!r&&(n.currentTarget.classList.add("opacity-50"),setTimeout((function(){window.location.href=e.url}),150))},className:"flex items-center gap-2 p-3 hover:bg-gray-50 transition-colors cursor-pointer ".concat((null==M?void 0:M.id)===e.id?"bg-gray-50":""),children:[e.icon&&(0,p.jsx)("img",{src:e.icon,alt:"",className:"w-6 h-6 object-contain",onError:function(e){return e.target.style.display="none"}}),(0,p.jsx)("span",{className:"text-gray-800",children:e.title})]},e.id)}))})]}),(0,p.jsxs)("div",{className:"mb-8",children:[(0,p.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,p.jsx)("span",{className:"text-gray-700",children:"Aizdevuma summa"}),(0,p.jsxs)("span",{className:"font-medium",children:[s," €"]})]}),(0,p.jsxs)("div",{className:"relative",children:[(0,p.jsx)("input",{type:"range",min:"500",max:"300000",value:s,onChange:function(e){return m(Number(e.target.value))},className:"w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",style:{background:B(s,500,3e5)}}),(0,p.jsxs)("div",{className:"absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500",children:[(0,p.jsx)("span",{children:"500 €"}),(0,p.jsx)("span",{children:"300000 €"})]})]})]}),(0,p.jsxs)("div",{className:"mb-8",children:[(0,p.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,p.jsx)("span",{className:"text-gray-700",children:"Aizdevuma termiņš"}),(0,p.jsxs)("span",{className:"font-medium",children:[b," mēn."]})]}),(0,p.jsxs)("div",{className:"relative",children:[(0,p.jsx)("input",{type:"range",min:"3",max:"120",value:b,onChange:function(e){return g(Number(e.target.value))},className:"w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",style:{background:B(b,3,120)}}),(0,p.jsxs)("div",{className:"absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500",children:[(0,p.jsx)("span",{children:"3 mēn."}),(0,p.jsx)("span",{children:"120 mēn."})]})]})]}),(0,p.jsxs)("div",{className:"bg-blue-50 p-4 rounded-lg mb-6",children:[(0,p.jsxs)("div",{className:"flex items-center",children:[(0,p.jsxs)("span",{className:"text-2xl font-medium",children:[v," €/mēn."]}),(0,p.jsxs)("div",{className:"relative ml-1",onMouseEnter:function(){return L(!0)},onMouseLeave:function(){return L(!1)},children:[(0,p.jsx)(u,{className:"w-4 h-4 text-blue-500 cursor-help"}),A&&(0,p.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg whitespace-nowrap",children:(0,p.jsxs)("div",{className:"relative",children:["Kredīta kalkulatoram ir ilustratīva nozīme",(0,p.jsx)("div",{className:"absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-8 border-transparent border-t-gray-900"})]})})]})]}),(0,p.jsx)("div",{className:"text-sm text-gray-600 mt-1",children:"Ikmēneša maksājums"})]}),(0,p.jsxs)("div",{className:"grid grid-cols-2 gap-4 mt-6",children:[(0,p.jsx)("div",{className:"col-span-2 md:col-span-1",children:(0,p.jsxs)("div",{className:"relative",children:[(0,p.jsx)("input",{type:"email",name:"email",placeholder:"Jūsu e-pasts",value:N,onChange:function(e){return k(e.target.value)},className:"w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ffc600] focus:border-[#ffc600] ".concat(z.email?"border-red-500 mb-6":"border-[#ffc600]")}),z.email&&(0,p.jsx)("div",{className:"absolute bottom-0 left-0 text-red-500 text-sm",children:z.email})]})}),(0,p.jsx)("div",{className:"col-span-2 md:col-span-1",children:(0,p.jsxs)("div",{className:"relative",children:[(0,p.jsxs)("div",{className:"relative",children:[(0,p.jsx)("div",{className:"absolute top-0 left-0 h-[42px] flex items-center pl-3 pointer-events-none"}),(0,p.jsx)("input",{type:"tel",name:"phone",placeholder:"Jūsu tālrunis",value:S,onChange:function(e){var n=e.target.value.replace(/\D/g,"");n.length<=8&&E(n)},style:{textIndent:"0"},className:"w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ffc600] focus:border-[#ffc600] ".concat(z.phone?"border-red-500 mb-6":"border-[#ffc600]")})]}),z.phone&&(0,p.jsx)("div",{className:"absolute bottom-0 left-0 text-red-500 text-sm",children:z.phone})]})})]}),(0,p.jsx)("button",{onClick:function(e){if(e&&e.preventDefault(),i={},N?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(N)||(i.email="Nepareizs e-pasta formāts"):i.email="Obligāti aizpildāms lauks",S?/^\d{8}$/.test(S)||(i.phone="Nepareizs tālruņa numura formāts"):i.phone="Obligāti aizpildāms lauks",F(i),0===Object.keys(i).length){var n=new URLSearchParams({amount:s,term:b,email:N,phone:S,kredit_id:(null==M?void 0:M.id)||""}).toString(),t="https://findexo.lv";try{var r;null!==(r=window.loanCalculatorData)&&void 0!==r&&r.siteUrl?t=window.loanCalculatorData.siteUrl:window.location.origin&&(t=window.location.origin)}catch(e){console.error("Error getting site URL:",e)}var o=t.replace(/\/+$/,""),a="".concat(o,"/forma/?").concat(n);try{window.location.href=a}catch(e){console.error("Error during redirect:",e),window.location.replace(a)}}var i},className:"w-full bg-green-500 text-white py-3 px-4 rounded-lg mt-4 font-medium hover:bg-green-600 transition-colors border-none",children:"Pieteikties"}),(0,p.jsxs)("div",{className:"mt-4 text-center text-xs md:text-sm text-gray-500 flex items-center justify-center gap-2",children:[(0,p.jsx)(d,{className:"w-4 h-4"}),"Nodrošinām bankas līmeņa aizsardzību Jūsu datiem"]})]})};var v=!1;function w(){var e;v||(v=!0,(e=document.getElementById("loan-calculator-root"))?window.elementorFrontend&&!window.elementorFrontend.isEditMode()?(0,r.H)(e).render((0,p.jsx)(y,{})):setTimeout((function(){(0,r.H)(e).render((0,p.jsx)(y,{}))}),50):console.error("Root element not found"))}"complete"===document.readyState?w():window.addEventListener("load",w)})();