(this.webpackJsonphousing=this.webpackJsonphousing||[]).push([[0],{81:function(e,t,a){e.exports=a(90)},90:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(10),l=a.n(o),i=a(14),c=a.n(i),u=a(44),s=a(63),m=a(31),p=a(135),h=a(130),y=a(136),b=a(137),d=a(138),f=a(139),E=a(140),g=a(141),v=a(142),w=a(95),C=a(143),j=a(144),O=a(11),x=a(16),P=a(146),A=a(132),I=a(133),S=a(91),k=a(98),H=a(96),N=a(147),R=a(94),F=a(129),$=a(131),M=a(134),B=a(39),T=a(55),V=function(){function e(t,a){Object(x.a)(this,e),this.amount=t,this.period=a}return Object(T.a)(e,[{key:"fromCSV",value:function(t){if(!("amount"in t)||!("period"in t))throw Error("Parse error: amount and period have to exist");var a=["yearly","monthly"],n=Number(t.amount);if(!a.includes(t.period))throw Error("Parse error: period should be one of [".concat(a.join(", "),"], but got ").concat(t.period));return new e(n,t.period)}},{key:"to",value:function(e){switch(e){case"monthly":return this.monthly();case"yearly":return this.yearly()}}},{key:"monthly",value:function(){var e=this.amount;return"yearly"===this.period&&(e/=12),e}},{key:"yearly",value:function(){var e=this.amount;return"monthly"===this.period&&(e*=12),e}}]),e}(),U=function(e){return e},D=function(){function e(t,a){Object(x.a)(this,e),this.start=t,this.rate=a}return Object(T.a)(e,[{key:"generator",value:c.a.mark((function e(t){var a,n,r,o=arguments;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=o.length>1&&void 0!==o[1]?o[1]:U,n=o.length>2&&void 0!==o[2]?o[2]:U,r=this.start;case 3:return r=a(r),r*=1+this.rate.to(t),r=n(r),e.next=9,r;case 9:e.next=3;break;case 11:case"end":return e.stop()}}),e,this)}))}]),e}();function J(e,t){return{HousingNumber:function(a,n){return function(r){t(Object(O.a)(Object(O.a)({},e),{},Object(B.a)({},a,new V(Number(r.target.value),n))))}},Number:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(a){return function(n){t(Object(O.a)(Object(O.a)({},e),{},Object(B.a)({},a,Number(n.target.value))))}}))}}function W(e){var t=e.value,a=J(t,e.onChange);return r.a.createElement("div",null,r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Upfront Costs",id:"standard-number",type:"number",value:t.downPayment,onChange:a.Number("downPayment"),InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}}),r.a.createElement(R.a,null,"e.g. move-in fees, non-refundable fees, pizza + beer for your friends who helped you move")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Spare Rooms",id:"standard-number",type:"number",value:t.extraBedrooms,onChange:a.Number("extraBedrooms"),InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}}),r.a.createElement(R.a,null,"Fill this field if you plan to rent out your extra room(s)")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Charge per Room",id:"standard-number",type:"number",value:t.chargeForRoom.monthly(),onChange:a.HousingNumber("chargeForRoom","monthly"),InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}}),r.a.createElement(R.a,null,"How much you plan to charge for each spare room(s)")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Charge per Room",id:"standard-number",type:"number",value:t.chargeForRoomIncrease.yearly(),onChange:a.HousingNumber("chargeForRoomIncrease","yearly"),InputProps:{endAdornment:r.a.createElement($.a,{position:"end"},"%")}}),r.a.createElement(R.a,null,"How much you plan to increase the rent for your spare room(s) each year")),r.a.createElement("br",null))}function z(e){var t=e.value,a=e.onChange,n=J(t,a);return r.a.createElement("div",null,r.a.createElement(W,{value:t,onChange:function(e){return a(Object(O.a)(Object(O.a)({},t),e))}}),r.a.createElement("div",null,r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Monthly Home Insurance",id:"standard-number",type:"number",value:t.insurance.monthly(),onChange:n.HousingNumber("insurance","yearly"),InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}}),r.a.createElement(R.a,null,"Expected home insurance monthly payment")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Monthly Property Taxes",id:"standard-number",type:"number",value:t.taxes.monthly(),onChange:n.HousingNumber("taxes","yearly"),InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}}),r.a.createElement(R.a,null,"Expected property taxes per month")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Annual Repair Cost",id:"standard-number",type:"number",value:t.repairCost.yearly(),onChange:n.HousingNumber("repairCost","yearly"),InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}}),r.a.createElement(R.a,null,"How much you expect to spend annually on home repairs")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"House Price",id:"standard-number",type:"number",value:t.housePrice,onChange:n.Number("housePrice"),InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}}),r.a.createElement(R.a,null,"How much you expect to pay for the home")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Buying Closing Costs",id:"standard-number",type:"number",value:t.buyClosingCosts,onChange:n.Number("buyClosingCosts"),InputProps:{endAdornment:r.a.createElement($.a,{position:"end"},"%")}}),r.a.createElement(R.a,null,"How much you expect to pay for closing costs when buying the home(percent)")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Selling Closing Costs",id:"standard-number",type:"number",value:t.sellClosingCosts,onChange:n.Number("sellClosingCosts"),InputProps:{endAdornment:r.a.createElement($.a,{position:"end"},"%")}}),r.a.createElement(R.a,null,"How much you expect to pay for closing costs when selling the home (percent)")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Home Value Appreciation",id:"standard-number",type:"number",value:t.growthRate.yearly(),onChange:n.HousingNumber("growthRate","yearly"),InputProps:{endAdornment:r.a.createElement($.a,{position:"end"},"%")}}),r.a.createElement(R.a,null,"How much you expect home value to go up each year")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"HOA Fee",id:"standard-number",type:"number",value:t.hoaFee.monthly(),onChange:n.HousingNumber("hoaFee","monthly"),InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}}),r.a.createElement(R.a,null,"Home Owner's Association Monthly Fee"))))}function L(e){var t=e.value,a=e.onChange,n=J(t,a);return r.a.createElement("div",null,r.a.createElement(W,{value:t,onChange:function(e){return a(Object(O.a)(Object(O.a)({},t),e))}}),r.a.createElement("div",null,r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Monthly Rent Payment",id:"standard-number",type:"number",value:t.payment.monthly(),onChange:n.HousingNumber("payment","monthly"),InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}})),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Payment Increase Rate",id:"standard-number",type:"number",value:t.paymentIncrease.yearly(),onChange:n.HousingNumber("paymentIncrease","yearly"),InputProps:{endAdornment:r.a.createElement($.a,{position:"end"},"%")}}),r.a.createElement(R.a,null,"How much you expect rent to go up annually"))))}var Y=a(43),G=a(57),q=a(56),K=function e(){Object(x.a)(this,e),this.principle=new D(1e5,new V(.06,"yearly")),this.contribution=new V(1e3,"monthly")},Q=function e(){Object(x.a)(this,e),this.term=30,this.principle=new D(2e5,new V(.03,"yearly"))},X=function e(){Object(x.a)(this,e),this.plan="house",this.downPayment=5e4,this.chargeForRoom=new V(600,"monthly"),this.chargeForRoomIncrease=new V(.03,"yearly"),this.extraBedrooms=0,this.utilityCost=new V(100,"monthly")},Z=function(e){Object(G.a)(a,e);var t=Object(q.a)(a);function a(){var e;Object(x.a)(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).plan="house",e.repairCost=new V(500,"yearly"),e.housePrice=25e4,e.growthRate=new V(.04,"yearly"),e.hoaFee=new V(250,"monthly"),e.loan=new Q,e.insurance=new V(85,"monthly"),e.taxes=new V(202,"monthly"),e.buyClosingCosts=.04,e.sellClosingCosts=.06,e}return a}(X),_=function(e){Object(G.a)(a,e);var t=Object(q.a)(a);function a(){var e;Object(x.a)(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).plan="rental",e.paymentIncrease=new V(.04,"yearly"),e.payment=new V(900,"monthly"),e}return a}(X);function ee(e,t){if(!e)throw new Error(": "+t)}function te(e,t){e||console.warn(": "+t)}function ae(e,t,a,n){var r=c.a.mark(i),o=t.monthly(),l=a.monthly();function i(){var e;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=0;case 1:if(!(e<n)){t.next=7;break}return t.next=4,o;case 4:e++,t.next=1;break;case 7:case"end":return t.stop()}}),r)}return te(l>=0&&l<=1,"rate is not between 0 and 1"),ee(o>=0,"invest is negative"),ee(e>=0,"base is negative"),ee(n>=0,"months is negative"),ne(e,i(),a)}function ne(e,t,a){var n=a.monthly();te(n>=0&&n<=1,"rate is not between 0 and 1"),ee(e>=0,"base is negative");var r=e;n+=1;var o,l=Object(Y.a)(t);try{for(l.s();!(o=l.n()).done;){r=r*n+o.value}}catch(i){l.e(i)}finally{l.f()}return r}function re(e,t,a){switch(ee(a>=0,"years is negative"),e.plan){case"house":return function(e,t,a){var n=c.a.mark(o);ee(a>=0,"years is negative");var r=ae(t.principle.start,t.contribution,t.principle.rate,12*a);function o(){var r,o,l;return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:r=12*a,o=e.chargeForRoom.monthly()*e.extraBedrooms,l=1;case 3:if(!(l<=r)){n.next=10;break}return n.next=6,t.contribution.monthly()-oe(e.loan).monthly()-e.taxes.monthly()-e.insurance.monthly()-e.utilityCost.monthly()-e.repairCost.monthly()-e.hoaFee.monthly()+o;case 6:l%12===0&&(o*=1+e.chargeForRoomIncrease.yearly());case 7:l++,n.next=3;break;case 10:case"end":return n.stop()}}),n)}var l=ne(t.principle.start-e.downPayment-e.housePrice*e.buyClosingCosts,o(),t.principle.rate),i=function(e,t){return e.housePrice*Math.pow(1+e.growthRate.yearly(),t)}(e,a)*(1-e.sellClosingCosts);return r-(l+i)}(e,t,a);case"rental":return function(e,t,a){var n=c.a.mark(o);ee(a>=0,"years is negative");var r=ae(t.principle.start,t.contribution,t.principle.rate,12*a);function o(){var r,o,l;return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:r=12*a,o=e.payment.monthly(),l=1;case 3:if(!(l<=r)){n.next=10;break}return n.next=6,t.contribution.monthly()-e.utilityCost.monthly()-o;case 6:l%12===0&&(o*=1+e.paymentIncrease.yearly());case 7:l++,n.next=3;break;case 10:case"end":return n.stop()}}),n)}var l=ne(t.principle.start-e.downPayment,o(),t.principle.rate);return r-l}(e,t,a);default:throw new Error("Unsupported plan")}}function oe(e){var t=12*e.term,a=e.principle.rate.monthly(),n=a*Math.pow(1+a,t),r=Math.pow(1+a,t)-1;return new V(e.principle.start*n/r,"monthly")}function le(e){var t,a;return"house"===e.plan?oe((a=e).loan).monthly()+a.hoaFee.monthly()+a.insurance.monthly()+a.taxes.monthly()+a.repairCost.monthly()+a.utilityCost.monthly():(t=e).payment.monthly()+t.utilityCost.monthly()}function ie(e){var t=e.value,a=e.onChange,n=J(t,a),o=J(t.principle,(function(e){a(Object(O.a)(Object(O.a)({},t),{},{principle:e}))}));return r.a.createElement("div",null,r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Investment Principle",id:"standard-number",type:"number",value:t.principle.start,onChange:o.Number("start"),InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}}),r.a.createElement(R.a,null,"How much money do you have currently (we expect you to take your down payment out of this money)")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Monthly Contribution",id:"standard-number",type:"number",value:t.contribution.monthly(),onChange:n.HousingNumber("contribution","monthly"),InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}}),r.a.createElement(R.a,null,"How much do you contribute to your principle each month?")),r.a.createElement("br",null),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Average Return",id:"standard-number",type:"number",value:t.principle.rate.yearly(),onChange:o.HousingNumber("rate","yearly"),InputProps:{endAdornment:r.a.createElement($.a,{position:"end"},"%")}}),r.a.createElement(R.a,null,"What is the annual average rate of return of your portfolio?")),r.a.createElement("br",null))}var ce=function e(){Object(x.a)(this,e),this.housingType="house",this.house=new Z,this.rental=new _,this.investment=new K,this.years=10};function ue(e){var t=e.initialData,a=e.onSubmit,n=e.onClose,o=e.open,l=r.a.useState(t),i=Object(m.a)(l,2),c=i[0],u=i[1];r.a.useEffect((function(){u(t)}),[t]);var s;switch(c.housingType){case"house":s=r.a.createElement(z,{value:c.house,onChange:function(e){return u(Object(O.a)(Object(O.a)({},c),{},{house:e}))}});break;case"rental":s=r.a.createElement(L,{value:c.rental,onChange:function(e){return u(Object(O.a)(Object(O.a)({},c),{},{rental:e}))}})}return r.a.createElement(P.a,{open:o,onClose:n,"aria-labelledby":"form-dialog-title"},r.a.createElement(A.a,{id:"form-dialog-title"},"Subscribe"),r.a.createElement(I.a,null,r.a.createElement(S.a,null,r.a.createElement(k.a,{id:"select-housing-type"},"Housing Type"),r.a.createElement(H.a,{labelId:"select-housing-type",value:c.housingType,onChange:function(e){var t=e.target.value;u(Object(O.a)(Object(O.a)({},c),{},{housingType:t}))}},r.a.createElement(N.a,{value:"house"},"House"),r.a.createElement(N.a,{value:"rental"},"Apartment")),r.a.createElement(R.a,null,"Select housing type to compare")),s,r.a.createElement(ie,{value:c.investment,onChange:function(e){return u(Object(O.a)(Object(O.a)({},c),{},{investment:e}))}}),r.a.createElement(S.a,{variant:"filled"},r.a.createElement(F.a,{label:"Projected Years",id:"standard-number",type:"number",value:c.years,onChange:function(e){return u(Object(O.a)(Object(O.a)({},c),{},{years:Number(e.target.value)}))},InputProps:{startAdornment:r.a.createElement($.a,{position:"start"},"$")}}),r.a.createElement(R.a,null,"How long do you plan to stay in this housing situation?"))),r.a.createElement(M.a,null,r.a.createElement(w.a,{onClick:n,color:"primary"},"Cancel"),r.a.createElement(w.a,{color:"primary",onClick:function(){return a(c)}},"Submit")))}function se(e,t){for(var a=e.split("\n").map((function(e){return e.split(",")})),n=a[0],r={},o=0;o<n.length;o++)for(var l=n[o].split(".").slice(1),i=r,c=0;c<l.length;c++){var u=l[c];u in i||(i[u]=c===l.length-1?o:{}),i=i[u]}function s(e,t){for(var a in e){var n=e[a];"number"===typeof n?e[a]=t[n]:s(n,t)}return e}function m(e,t,a){if(e)for(var n in a){var r,o=a[n];if("function"!==typeof o.fromCSV)switch(r=typeof o){case"number":e[n]=Number(t[n]);break;case"boolean":e[n]=Boolean(t[n]);break;case"string":e[n]=t[n];break;case"object":m(e[n],t[n],o);break;default:throw Error("Unsupported type: ".concat(r))}else e[n]=o.fromCSV(t[n])}}for(var p=a.slice(1),h=[],y=0;y<p.length;y++){var b=JSON.parse(JSON.stringify(t)),d=JSON.parse(JSON.stringify(r));s(d,p[y]),m(b,d,t),h.push(b)}return h}var me=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2});function pe(e){return(100*e).toFixed(2)+"%"}var he=function(){var e=r.a.useState(!1),t=Object(m.a)(e,2),a=t[0],n=t[1],o=r.a.useState([]),l=Object(m.a)(o,2),i=l[0],O=l[1],x=r.a.useState(-1),P=Object(m.a)(x,2),A=P[0],I=P[1],S=r.a.useState(new ce),k=Object(m.a)(S,2),H=k[0],N=k[1];function R(){return(R=Object(s.a)(c.a.mark((function e(t){var a,n,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=t.target.files){e.next=3;break}return e.abrupt("return");case 3:if(n=a[0]){e.next=6;break}return e.abrupt("return");case 6:(r=new FileReader).onload=function(){O(se(r.result,new ce))},r.readAsText(n);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return r.a.createElement("div",null,r.a.createElement(p.a,{component:h.a},r.a.createElement(y.a,null,r.a.createElement(b.a,null,r.a.createElement(d.a,null,r.a.createElement(f.a,{rowSpan:2,align:"center"},"Housing Type"),r.a.createElement(f.a,{rowSpan:2,align:"center"},"Projected Years"),r.a.createElement(f.a,{colSpan:6,align:"center"},"Housing"),r.a.createElement(f.a,{colSpan:4,align:"center"},"House"),r.a.createElement(f.a,{colSpan:1,align:"center"},"Apartment"),r.a.createElement(f.a,{colSpan:4,align:"center"},"Investment"),r.a.createElement(f.a,{rowSpan:2,align:"center"},"Actions")),r.a.createElement(d.a,null,r.a.createElement(f.a,{align:"center"},"Monthly Payment"),r.a.createElement(f.a,{align:"center"},"Down Payment"),r.a.createElement(f.a,{align:"center"},"Extra Bedrooms"),r.a.createElement(f.a,{align:"center"},"Change per Room"),r.a.createElement(f.a,{align:"center"},"Change per Room Increase Rate"),r.a.createElement(f.a,{align:"center"},"Utility Cost"),r.a.createElement(f.a,{align:"center"},"Repair Cost"),r.a.createElement(f.a,{align:"center"},"House Price"),r.a.createElement(f.a,{align:"center"},"House Appreciation Rate"),r.a.createElement(f.a,{align:"center"},"HOA Fee"),r.a.createElement(f.a,{align:"center"},"Monthly Payment Increase Rate"),r.a.createElement(f.a,{align:"center"},"Principle"),r.a.createElement(f.a,{align:"center"},"Contribution"),r.a.createElement(f.a,{align:"center"},"Growth Rate"),r.a.createElement(f.a,{align:"center"},"Investment Loss"))),r.a.createElement(E.a,null,i.map((function(e,t){var a="house"===e.housingType,o=a?e.house:e.rental;return r.a.createElement(d.a,null,r.a.createElement(f.a,{align:"center"},e.housingType),r.a.createElement(f.a,{align:"center"},e.years),r.a.createElement(f.a,{align:"center"},me.format(le(a?e.house:e.rental))),r.a.createElement(f.a,{align:"center"},me.format(o.downPayment)),r.a.createElement(f.a,{align:"center"},o.extraBedrooms),r.a.createElement(f.a,{align:"center"},me.format(o.chargeForRoom.monthly())),r.a.createElement(f.a,{align:"center"},pe(o.chargeForRoomIncrease.yearly())),r.a.createElement(f.a,{align:"center"},me.format(o.utilityCost.monthly())),r.a.createElement(f.a,{align:"center"},a?me.format(e.house.repairCost.yearly()):"N/A"),r.a.createElement(f.a,{align:"center"},a?me.format(e.house.housePrice):"N/A"),r.a.createElement(f.a,{align:"center"},a?pe(e.house.growthRate.yearly()):"N/A"),r.a.createElement(f.a,{align:"center"},a?me.format(e.house.hoaFee.monthly()):"N/A"),r.a.createElement(f.a,{align:"center"},a?"N/A":pe(e.rental.paymentIncrease.yearly())),r.a.createElement(f.a,{align:"center"},me.format(e.investment.principle.start)),r.a.createElement(f.a,{align:"center"},me.format(e.investment.contribution.monthly())),r.a.createElement(f.a,{align:"center"},pe(e.investment.principle.rate.yearly())),r.a.createElement(f.a,{align:"center"},me.format(re(o,e.investment,e.years))),r.a.createElement(f.a,{align:"center"},r.a.createElement(g.a,{variant:"text",color:"primary","aria-label":"text primary button group"},r.a.createElement(v.a,{color:"primary","aria-label":"upload picture",component:"span",onClick:function(){return function(e){I(e),N(i[e]),n(!0)}(t)}},r.a.createElement(C.a,null)),r.a.createElement(v.a,{color:"primary","aria-label":"upload picture",component:"span",onClick:function(){return function(e){var t=i.slice(0,e)||[],a=i.slice(e+1)||[];O([].concat(Object(u.a)(t),Object(u.a)(a)))}(t)}},r.a.createElement(j.a,null)))))}))))),r.a.createElement(ue,{initialData:H,open:a,onClose:function(){return n(!1)},onSubmit:function(e){A<0||A>=i.length?O([].concat(Object(u.a)(i),[e])):(i[A]=e,O(Object(u.a)(i))),n(!1)}}),r.a.createElement(w.a,{onClick:function(){I(-1),n(!0)}},"Add"),r.a.createElement(w.a,{onClick:function(){var e=encodeURI("data:text/csv;charset=utf-8,"+function(e){var t=[],a={},n=0;function r(e){var t={};return function e(r,o){if(r)for(var l in r){var i="".concat(o,".").concat(l),c=r[l],u=null;"function"===typeof c.toCSV?u=c.toCSV():Array.isArray(c)||("object"===typeof c?e(c,i):u="function"===typeof c.toString?c.toString():c),u&&(t[i]=u,i in a||(a[i]=n,n++))}}(e,""),t}var o,l=Object(Y.a)(e);try{for(l.s();!(o=l.n()).done;){var i=r(o.value),c=new Array(n);for(var u in i){c[a[u]]=i[u]}t.push(c)}}catch(s){l.e(s)}finally{l.f()}return Object.keys(a).join(",")+"\n"+t.map((function(e){return e.join(",")})).join("\n")}(i));window.open(e)}},"Download as CSV"),r.a.createElement("input",{accept:"text/csv",id:"contained-button-file",type:"file",onChange:function(e){return R.apply(this,arguments)}}),r.a.createElement("label",{htmlFor:"contained-button-file"},r.a.createElement(w.a,{variant:"contained",color:"primary",component:"span"},"Load CSV")))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(he,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[81,1,2]]]);
//# sourceMappingURL=main.7d3b080e.chunk.js.map