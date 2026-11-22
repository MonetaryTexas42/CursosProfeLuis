(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Symbol.for(`@supabase/supabase-js.traceContextExtractor`);function t(){return globalThis[e]}function n(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols==`function`)for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]]);return n}function r(e,t,n,r){function i(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||=Promise)(function(n,a){function o(e){try{c(r.next(e))}catch(e){a(e)}}function s(e){try{c(r.throw(e))}catch(e){a(e)}}function c(e){e.done?n(e.value):i(e.value).then(o,s)}c((r=r.apply(e,t||[])).next())})}var i=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),a=class extends Error{constructor(e,t=`FunctionsError`,n){super(e),this.name=t,this.context=n}toJSON(){return{name:this.name,message:this.message,context:this.context}}},o=class extends a{constructor(e){super(`Failed to send a request to the Edge Function`,`FunctionsFetchError`,e)}},s=class extends a{constructor(e){super(`Relay Error invoking the Edge Function`,`FunctionsRelayError`,e)}},c=class extends a{constructor(e){super(`Edge Function returned a non-2xx status code`,`FunctionsHttpError`,e)}},l;(function(e){e.Any=`any`,e.ApNortheast1=`ap-northeast-1`,e.ApNortheast2=`ap-northeast-2`,e.ApSouth1=`ap-south-1`,e.ApSoutheast1=`ap-southeast-1`,e.ApSoutheast2=`ap-southeast-2`,e.CaCentral1=`ca-central-1`,e.EuCentral1=`eu-central-1`,e.EuWest1=`eu-west-1`,e.EuWest2=`eu-west-2`,e.EuWest3=`eu-west-3`,e.SaEast1=`sa-east-1`,e.UsEast1=`us-east-1`,e.UsWest1=`us-west-1`,e.UsWest2=`us-west-2`})(l||={});var u=class{constructor(e,{headers:t={},customFetch:n,region:r=l.Any}={}){this.url=e,this.headers=t,this.region=r,this.fetch=i(n)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e){return r(this,arguments,void 0,function*(e,t={}){var n;let r,i,a;try{let{headers:n,method:l,body:u,signal:d,timeout:f}=t,p={},{region:m}=t;m||=this.region;let h=new URL(`${this.url}/${e}`);m&&m!==`any`&&(p[`x-region`]=m,h.searchParams.set(`forceFunctionRegion`,m));let g,_=!!n&&Object.keys(n).some(e=>e.toLowerCase()===`content-type`);u&&!_?typeof Blob<`u`&&u instanceof Blob||u instanceof ArrayBuffer?(p[`Content-Type`]=u.type||`application/octet-stream`,g=u):typeof u==`string`?(p[`Content-Type`]=`text/plain`,g=u):typeof FormData<`u`&&u instanceof FormData?g=u:(p[`Content-Type`]=`application/json`,g=JSON.stringify(u)):g=u&&typeof u!=`string`&&!(typeof Blob<`u`&&u instanceof Blob)&&!(u instanceof ArrayBuffer)&&!(typeof FormData<`u`&&u instanceof FormData)?JSON.stringify(u):u;let v=d;f&&(i=new AbortController,r=setTimeout(()=>i.abort(),f),d?(v=i.signal,a=()=>i.abort(),d.addEventListener(`abort`,a)):v=i.signal);let y=yield this.fetch(h.toString(),{method:l||`POST`,headers:Object.assign(Object.assign(Object.assign({},p),this.headers),n),body:g,signal:v}).catch(e=>{throw new o(e)}),b=y.headers.get(`x-relay-error`);if(b&&b===`true`)throw new s(y);if(!y.ok)throw new c(y);let x=(y.headers.get(`Content-Type`)??`text/plain`).split(`;`)[0].trim().toLowerCase(),ee;return ee=x===`application/json`?yield y.json():x===`application/octet-stream`||x===`application/pdf`?yield y.blob():x===`text/event-stream`?y:x===`multipart/form-data`?yield y.formData():yield y.text(),{data:ee,error:null,response:y}}catch(e){return{data:null,error:e,response:e instanceof c||e instanceof s?e.context:void 0}}finally{r&&clearTimeout(r),a&&((n=t.signal)==null||n.removeEventListener(`abort`,a))}})}},d=class extends Error{constructor(e){super(e.message),this.name=`PostgrestError`,this.details=e.details,this.hint=e.hint,this.code=e.code}toJSON(){return{name:this.name,message:this.message,details:this.details,hint:this.hint,code:this.code}}},f=3,p=e=>Math.min(1e3*2**e,3e4),m=[520,503],h=[`GET`,`HEAD`,`OPTIONS`];function g(e){"@babel/helpers - typeof";return g=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},g(e)}function _(e,t){if(g(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(g(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function v(e){var t=_(e,`string`);return g(t)==`symbol`?t:t+``}function y(e,t,n){return(t=v(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function b(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function x(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?b(Object(n),!0).forEach(function(t){y(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function ee(e,t){return new Promise(n=>{if(t?.aborted){n();return}let r=setTimeout(()=>{t?.removeEventListener(`abort`,i),n()},e);function i(){clearTimeout(r),n()}t?.addEventListener(`abort`,i)})}function te(e,t,n,r){return!(!r||n>=f||!h.includes(e)||!m.includes(t))}async function S(e,t,n,r){let i=0;for(;;){let a=x({},n.headers);i>0&&(a[`X-Retry-Count`]=String(i));let o;try{o=await e(t,{method:n.method,headers:a,body:n.body,signal:n.signal})}catch(e){if(e?.name===`AbortError`||e?.code===`ABORT_ERR`||e?.name===`TimeoutError`&&n.signal?.aborted||!h.includes(n.method))throw e;if(r&&i<f){let e=p(i);i++,await ee(e,n.signal);continue}throw e}if(te(n.method,o.status,i,r)){let e=o.headers?.get(`Retry-After`)??null,t=e===null?p(i):Math.max(0,parseInt(e,10)||0)*1e3;await o.text(),i++,await ee(t,n.signal)}else return o}}var ne=class{constructor(e){this.shouldThrowOnError=!1,this.retryEnabled=!0,this.method=e.method,this.url=e.url,this.headers=new Headers(e.headers),this.schema=e.schema,this.body=e.body,this.shouldThrowOnError=e.shouldThrowOnError??!1,this.signal=e.signal,this.isMaybeSingle=e.isMaybeSingle??!1,this.shouldStripNulls=e.shouldStripNulls??!1,this.urlLengthLimit=e.urlLengthLimit??8e3,this.retryEnabled=e.retry??!0,this.fetch=e.fetch?e.fetch:fetch}throwOnError(){return this.shouldThrowOnError=!0,this}stripNulls(){if(this.headers.get(`Accept`)===`text/csv`)throw Error(`stripNulls() cannot be used with csv()`);return this.shouldStripNulls=!0,this}setHeader(e,t){return this.headers=new Headers(this.headers),this.headers.set(e,t),this}retry(e){return this.retryEnabled=e,this}then(e,t){var n=this;if(this.schema===void 0||([`GET`,`HEAD`].includes(this.method)?this.headers.set(`Accept-Profile`,this.schema):this.headers.set(`Content-Profile`,this.schema)),this.method!==`GET`&&this.method!==`HEAD`&&this.headers.set(`Content-Type`,`application/json`),this.shouldStripNulls){let e=this.headers.get(`Accept`);e===`application/vnd.pgrst.object+json`?this.headers.set(`Accept`,`application/vnd.pgrst.object+json;nulls=stripped`):e&&e!==`application/json`||this.headers.set(`Accept`,`application/vnd.pgrst.array+json;nulls=stripped`)}let r=this.fetch,i=(async()=>{let e={};n.headers.forEach((t,n)=>{e[n]=t});let t=await S(r,n.url.toString(),{method:n.method,headers:e,body:JSON.stringify(n.body,(e,t)=>typeof t==`bigint`?t.toString():t),signal:n.signal},n.retryEnabled);return await n.processResponse(t)})();return this.shouldThrowOnError||(i=i.catch(e=>{let t=``,n=``,r=``,i=e?.cause;if(i){let n=i?.message??``,r=i?.code??``;t=`${e?.name??`FetchError`}: ${e?.message}`,t+=`\n\nCaused by: ${i?.name??`Error`}: ${n}`,r&&(t+=` (${r})`),i?.stack&&(t+=`\n${i.stack}`)}else t=e?.stack??``;let a=this.url.toString().length;return e?.name===`AbortError`||e?.code===`ABORT_ERR`?(r=``,n=`Request was aborted (timeout or manual cancellation)`,a>this.urlLengthLimit&&(n+=`. Note: Your request URL is ${a} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)):(i?.name===`HeadersOverflowError`||i?.code===`UND_ERR_HEADERS_OVERFLOW`)&&(r=``,n=`HTTP headers exceeded server limits (typically 16KB)`,a>this.urlLengthLimit&&(n+=`. Your request URL is ${a} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)),{success:!1,error:{message:`${e?.name??`FetchError`}: ${e?.message}`,details:t,hint:n,code:r},data:null,count:null,status:0,statusText:``}})),i.then(e,t)}async processResponse(e){var t=this;let n=null,r=null,i=null,a=e.status,o=e.statusText;if(e.ok){if(t.method!==`HEAD`){let i=await e.text();if(i!==``){if(t.headers.get(`Accept`)===`text/csv`)r=i;else if(t.headers.get(`Accept`)&&t.headers.get(`Accept`)?.includes(`application/vnd.pgrst.plan+text`))r=i;else try{r=JSON.parse(i)}catch{if(n={message:i},r=null,t.shouldThrowOnError)throw new d({message:i,details:``,hint:``,code:``})}}}let s=t.headers.get(`Prefer`)?.match(/count=(exact|planned|estimated)/),c=e.headers.get(`content-range`)?.split(`/`);if(s&&c&&c.length>1&&(i=parseInt(c[1])),t.isMaybeSingle&&Array.isArray(r)){if(r.length>1){if(n={code:`PGRST116`,details:`Results contain ${r.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:`JSON object requested, multiple (or no) rows returned`},r=null,i=null,a=406,o=`Not Acceptable`,t.shouldThrowOnError)throw new d(x(x({},n),{},{hint:n.hint??``}))}else r=r.length===1?r[0]:null}}else{let i=await e.text();try{n=JSON.parse(i),Array.isArray(n)&&e.status===404&&(r=[],n=null,a=200,o=`OK`)}catch{e.status===404&&i===``?(a=204,o=`No Content`):n={message:i}}if(n&&t.shouldThrowOnError)throw new d(n)}return{success:n===null,error:n,data:r,count:i,status:a,statusText:o}}returns(){return this}overrideTypes(){return this}},re=class extends ne{throwOnError(){return super.throwOnError()}select(e){let t=!1,n=(e??`*`).split(``).map(e=>/\s/.test(e)&&!t?``:(e===`"`&&(t=!t),e)).join(``);return this.url.searchParams.set(`select`,n),this.headers.append(`Prefer`,`return=representation`),this}order(e,{ascending:t=!0,nullsFirst:n,foreignTable:r,referencedTable:i=r}={}){let a=i?`${i}.order`:`order`,o=this.url.searchParams.get(a);return this.url.searchParams.set(a,`${o?`${o},`:``}${e}.${t?`asc`:`desc`}${n===void 0?``:n?`.nullsfirst`:`.nullslast`}`),this}limit(e,{foreignTable:t,referencedTable:n=t}={}){let r=n===void 0?`limit`:`${n}.limit`;return this.url.searchParams.set(r,`${e}`),this}range(e,t,{foreignTable:n,referencedTable:r=n}={}){let i=r===void 0?`offset`:`${r}.offset`,a=r===void 0?`limit`:`${r}.limit`;return this.url.searchParams.set(i,`${e}`),this.url.searchParams.set(a,`${t-e+1}`),this}abortSignal(e){return this.signal=e,this}single(){return this.headers.set(`Accept`,`application/vnd.pgrst.object+json`),this}maybeSingle(){return this.isMaybeSingle=!0,this}csv(){return this.headers.set(`Accept`,`text/csv`),this}geojson(){return this.headers.set(`Accept`,`application/geo+json`),this}explain({analyze:e=!1,verbose:t=!1,settings:n=!1,buffers:r=!1,wal:i=!1,format:a=`text`}={}){let o=[e?`analyze`:null,t?`verbose`:null,n?`settings`:null,r?`buffers`:null,i?`wal`:null].filter(Boolean).join(`|`),s=this.headers.get(`Accept`)??`application/json`;return this.headers.set(`Accept`,`application/vnd.pgrst.plan+${a}; for="${s}"; options=${o};`),this}rollback(){return this.headers.append(`Prefer`,`tx=rollback`),this}returns(){return this}maxAffected(e){return this.headers.append(`Prefer`,`handling=strict`),this.headers.append(`Prefer`,`max-affected=${e}`),this}},ie=RegExp(`[,()]`),C=class extends re{throwOnError(){return super.throwOnError()}eq(e,t){return this.url.searchParams.append(e,`eq.${t}`),this}neq(e,t){return this.url.searchParams.append(e,`neq.${t}`),this}gt(e,t){return this.url.searchParams.append(e,`gt.${t}`),this}gte(e,t){return this.url.searchParams.append(e,`gte.${t}`),this}lt(e,t){return this.url.searchParams.append(e,`lt.${t}`),this}lte(e,t){return this.url.searchParams.append(e,`lte.${t}`),this}like(e,t){return this.url.searchParams.append(e,`like.${t}`),this}likeAllOf(e,t){return this.url.searchParams.append(e,`like(all).{${t.join(`,`)}}`),this}likeAnyOf(e,t){return this.url.searchParams.append(e,`like(any).{${t.join(`,`)}}`),this}ilike(e,t){return this.url.searchParams.append(e,`ilike.${t}`),this}ilikeAllOf(e,t){return this.url.searchParams.append(e,`ilike(all).{${t.join(`,`)}}`),this}ilikeAnyOf(e,t){return this.url.searchParams.append(e,`ilike(any).{${t.join(`,`)}}`),this}regexMatch(e,t){return this.url.searchParams.append(e,`match.${t}`),this}regexIMatch(e,t){return this.url.searchParams.append(e,`imatch.${t}`),this}is(e,t){return this.url.searchParams.append(e,`is.${t}`),this}isDistinct(e,t){return this.url.searchParams.append(e,`isdistinct.${t}`),this}in(e,t){let n=Array.from(new Set(t)).map(e=>typeof e==`string`&&ie.test(e)?`"${e}"`:`${e}`).join(`,`);return this.url.searchParams.append(e,`in.(${n})`),this}notIn(e,t){let n=Array.from(new Set(t)).map(e=>typeof e==`string`&&ie.test(e)?`"${e}"`:`${e}`).join(`,`);return this.url.searchParams.append(e,`not.in.(${n})`),this}contains(e,t){return typeof t==`string`?this.url.searchParams.append(e,`cs.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cs.{${t.join(`,`)}}`):this.url.searchParams.append(e,`cs.${JSON.stringify(t)}`),this}containedBy(e,t){return typeof t==`string`?this.url.searchParams.append(e,`cd.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cd.{${t.join(`,`)}}`):this.url.searchParams.append(e,`cd.${JSON.stringify(t)}`),this}rangeGt(e,t){return this.url.searchParams.append(e,`sr.${t}`),this}rangeGte(e,t){return this.url.searchParams.append(e,`nxl.${t}`),this}rangeLt(e,t){return this.url.searchParams.append(e,`sl.${t}`),this}rangeLte(e,t){return this.url.searchParams.append(e,`nxr.${t}`),this}rangeAdjacent(e,t){return this.url.searchParams.append(e,`adj.${t}`),this}overlaps(e,t){return typeof t==`string`?this.url.searchParams.append(e,`ov.${t}`):this.url.searchParams.append(e,`ov.{${t.join(`,`)}}`),this}textSearch(e,t,{config:n,type:r}={}){let i=``;r===`plain`?i=`pl`:r===`phrase`?i=`ph`:r===`websearch`&&(i=`w`);let a=n===void 0?``:`(${n})`;return this.url.searchParams.append(e,`${i}fts${a}.${t}`),this}match(e){return Object.entries(e).filter(([e,t])=>t!==void 0).forEach(([e,t])=>{this.url.searchParams.append(e,`eq.${t}`)}),this}not(e,t,n){return this.url.searchParams.append(e,`not.${t}.${n}`),this}or(e,{foreignTable:t,referencedTable:n=t}={}){let r=n?`${n}.or`:`or`;return this.url.searchParams.append(r,`(${e})`),this}filter(e,t,n){return this.url.searchParams.append(e,`${t}.${n}`),this}},ae=class{constructor(e,{headers:t={},schema:n,fetch:r,urlLengthLimit:i=8e3,retry:a}){this.url=e,this.headers=new Headers(t),this.schema=n,this.fetch=r,this.urlLengthLimit=i,this.retry=a}cloneRequestState(){return{url:new URL(this.url.toString()),headers:new Headers(this.headers)}}select(e,t){let{head:n=!1,count:r}=t??{},i=n?`HEAD`:`GET`,a=!1,o=(e??`*`).split(``).map(e=>/\s/.test(e)&&!a?``:(e===`"`&&(a=!a),e)).join(``),{url:s,headers:c}=this.cloneRequestState();return s.searchParams.set(`select`,o),r&&c.append(`Prefer`,`count=${r}`),new C({method:i,url:s,headers:c,schema:this.schema,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}insert(e,{count:t,defaultToNull:n=!0}={}){let{url:r,headers:i}=this.cloneRequestState();if(t&&i.append(`Prefer`,`count=${t}`),n||i.append(`Prefer`,`missing=default`),Array.isArray(e)){let t=e.reduce((e,t)=>e.concat(Object.keys(t)),[]);if(t.length>0){let e=[...new Set(t)].map(e=>`"${e}"`);r.searchParams.set(`columns`,e.join(`,`))}}return new C({method:`POST`,url:r,headers:i,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}upsert(e,{onConflict:t,ignoreDuplicates:n=!1,count:r,defaultToNull:i=!0}={}){let{url:a,headers:o}=this.cloneRequestState();if(o.append(`Prefer`,`resolution=${n?`ignore`:`merge`}-duplicates`),t!==void 0&&a.searchParams.set(`on_conflict`,t),r&&o.append(`Prefer`,`count=${r}`),i||o.append(`Prefer`,`missing=default`),Array.isArray(e)){let t=e.reduce((e,t)=>e.concat(Object.keys(t)),[]);if(t.length>0){let e=[...new Set(t)].map(e=>`"${e}"`);a.searchParams.set(`columns`,e.join(`,`))}}return new C({method:`POST`,url:a,headers:o,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}update(e,{count:t}={}){let{url:n,headers:r}=this.cloneRequestState();return t&&r.append(`Prefer`,`count=${t}`),new C({method:`PATCH`,url:n,headers:r,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}delete({count:e}={}){let{url:t,headers:n}=this.cloneRequestState();return e&&n.append(`Prefer`,`count=${e}`),new C({method:`DELETE`,url:t,headers:n,schema:this.schema,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}};function w(e,t){try{let t=JSON.parse(e);if(t&&typeof t==`object`&&!Array.isArray(t))return new d({message:String(t.message??e),details:t.details??``,hint:t.hint??``,code:t.code??``})}catch{}return new d({message:e||t,details:``,hint:``,code:``})}function oe(e,t,n){let r=e;return{success:!1,error:new d({message:`${r?.name??`FetchError`}: ${r?.message}`,details:``,hint:``,code:``}),data:null,count:null,status:t,statusText:n}}var se=class e{constructor(e,{headers:t={},schema:n,fetch:r,timeout:i,urlLengthLimit:a=8e3,retry:o}={}){this.url=e,this.headers=new Headers(t),this.schemaName=n,this.urlLengthLimit=a;let s=r??globalThis.fetch;this.fetch=i!==void 0&&i>0?(e,t)=>{let n=new AbortController,r=setTimeout(()=>n.abort(),i),a=t?.signal;if(a){if(a.aborted)return clearTimeout(r),s(e,t);let i=()=>{clearTimeout(r),n.abort()};return a.addEventListener(`abort`,i,{once:!0}),s(e,x(x({},t),{},{signal:n.signal})).finally(()=>{clearTimeout(r),a.removeEventListener(`abort`,i)})}return s(e,x(x({},t),{},{signal:n.signal})).finally(()=>clearTimeout(r))}:s,this.retry=o}from(e){if(!e||typeof e!=`string`||e.trim()===``)throw Error(`Invalid relation name: relation must be a non-empty string.`);return new ae(new URL(`${this.url}/${e}`),{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}schema(t){return new e(this.url,{headers:this.headers,schema:t,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}async getOpenApiSpec(){var e=this;let t=new Headers(e.headers);t.set(`Accept`,`application/openapi+json`),e.schemaName&&t.set(`Accept-Profile`,e.schemaName);let n={};t.forEach((e,t)=>{n[t]=e});let r=e.fetch??globalThis.fetch,i;try{i=await S(r,`${e.url}/`,{method:`GET`,headers:n},e.retry??!0)}catch(e){return oe(e,0,``)}let a;try{a=await i.text()}catch(e){return oe(e,i.status,i.statusText)}if(i.ok)try{return{success:!0,error:null,data:JSON.parse(a),count:null,status:i.status,statusText:i.statusText}}catch{}return{success:!1,error:w(a,i.statusText),data:null,count:null,status:i.status,statusText:i.statusText}}rpc(e,t={},{head:n=!1,get:r=!1,count:i}={}){let a,o=new URL(`${this.url}/rpc/${e}`),s,c=e=>typeof e==`object`&&!!e&&(!Array.isArray(e)||e.some(c)),l=n&&Object.values(t).some(c);l?(a=`POST`,s=t):n||r?(a=n?`HEAD`:`GET`,Object.entries(t).filter(([e,t])=>t!==void 0).map(([e,t])=>[e,Array.isArray(t)?`{${t.join(`,`)}}`:`${t}`]).forEach(([e,t])=>{o.searchParams.append(e,t)})):(a=`POST`,s=t);let u=new Headers(this.headers);return l?u.set(`Prefer`,i?`count=${i},return=minimal`:`return=minimal`):i&&u.set(`Prefer`,`count=${i}`),new C({method:a,url:o,headers:u,schema:this.schemaName,body:s,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}},ce=class{constructor(){}static detectEnvironment(){if(typeof WebSocket<`u`)return{type:`native`,wsConstructor:WebSocket};let e=globalThis;if(typeof globalThis<`u`&&e.WebSocket!==void 0)return{type:`native`,wsConstructor:e.WebSocket};let t=typeof global<`u`?global:void 0;if(t&&t.WebSocket!==void 0)return{type:`native`,wsConstructor:t.WebSocket};if(typeof globalThis<`u`&&e.WebSocketPair!==void 0&&globalThis.WebSocket===void 0)return{type:`cloudflare`,error:`Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.`,workaround:`Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime.`};if(typeof globalThis<`u`&&e.EdgeRuntime||typeof navigator<`u`&&navigator.userAgent?.includes(`Vercel-Edge`))return{type:`unsupported`,error:`Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.`,workaround:`Use serverless functions or a different deployment target for WebSocket functionality.`};let n=globalThis.process;if(n){let e=n.versions;if(e&&e.node)return{type:`unsupported`,error:`Node.js detected but native WebSocket not found.`,workaround:`Ensure you are running Node.js 22+ or provide a WebSocket implementation via the transport option.`}}return{type:`unsupported`,error:`Unknown JavaScript runtime without WebSocket support.`,workaround:`Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation.`}}static getWebSocketConstructor(){let e=this.detectEnvironment();if(e.wsConstructor)return e.wsConstructor;let t=e.error||`WebSocket not supported in this environment.`;throw e.workaround&&(t+=`\n\nSuggested solution: ${e.workaround}`),Error(t)}static isWebSocketSupported(){try{return this.detectEnvironment().type===`native`}catch{return!1}}},le=`realtime-js/2.118.0`,ue=`1.0.0`,de=`2.0.0`,fe=de,pe=1e4,me=15e3,he=1e4,ge={closed:`closed`,errored:`errored`,joined:`joined`,joining:`joining`,leaving:`leaving`},_e={close:`phx_close`,error:`phx_error`,join:`phx_join`,reply:`phx_reply`,leave:`phx_leave`,access_token:`access_token`},ve={connecting:`connecting`,open:`open`,closing:`closing`,closed:`closed`},ye=class{constructor(e){this.HEADER_LENGTH=1,this.USER_BROADCAST_PUSH_META_LENGTH=6,this.KINDS={userBroadcastPush:3,userBroadcast:4},this.BINARY_ENCODING=0,this.JSON_ENCODING=1,this.BROADCAST_EVENT=`broadcast`,this.allowedMetadataKeys=[],this.allowedMetadataKeys=e??[]}encode(e,t){if(e.event===this.BROADCAST_EVENT&&!(e.payload instanceof ArrayBuffer)&&typeof e.payload.event==`string`)return t(this._binaryEncodeUserBroadcastPush(e));let n=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(n))}_binaryEncodeUserBroadcastPush(e){return this._isArrayBuffer(e.payload?.payload)?this._encodeBinaryUserBroadcastPush(e):this._encodeJsonUserBroadcastPush(e)}_encodeBinaryUserBroadcastPush(e){let t=e.payload?.payload??new ArrayBuffer(0);return this._encodeUserBroadcastPush(e,this.BINARY_ENCODING,t)}_encodeJsonUserBroadcastPush(e){let t=e.payload?.payload??{},n=new TextEncoder().encode(JSON.stringify(t)).buffer;return this._encodeUserBroadcastPush(e,this.JSON_ENCODING,n)}_encodeUserBroadcastPush(e,t,n){let r=new TextEncoder,i=r.encode(e.topic),a=r.encode(e.ref??``),o=r.encode(e.join_ref??``),s=r.encode(e.payload.event),c=this.allowedMetadataKeys?this._pick(e.payload,this.allowedMetadataKeys):{},l=r.encode(Object.keys(c).length===0?``:JSON.stringify(c));if(o.length>255)throw Error(`joinRef length ${o.length} exceeds maximum of 255`);if(a.length>255)throw Error(`ref length ${a.length} exceeds maximum of 255`);if(i.length>255)throw Error(`topic length ${i.length} exceeds maximum of 255`);if(s.length>255)throw Error(`userEvent length ${s.length} exceeds maximum of 255`);if(l.length>255)throw Error(`metadata length ${l.length} exceeds maximum of 255`);let u=this.USER_BROADCAST_PUSH_META_LENGTH+o.length+a.length+i.length+s.length+l.length,d=new ArrayBuffer(this.HEADER_LENGTH+u),f=new DataView(d),p=new Uint8Array(d),m=0;f.setUint8(m++,this.KINDS.userBroadcastPush),f.setUint8(m++,o.length),f.setUint8(m++,a.length),f.setUint8(m++,i.length),f.setUint8(m++,s.length),f.setUint8(m++,l.length),f.setUint8(m++,t),p.set(o,m),m+=o.length,p.set(a,m),m+=a.length,p.set(i,m),m+=i.length,p.set(s,m),m+=s.length,p.set(l,m),m+=l.length;var h=new Uint8Array(d.byteLength+n.byteLength);return h.set(new Uint8Array(d),0),h.set(new Uint8Array(n),d.byteLength),h.buffer}decode(e,t){if(this._isArrayBuffer(e))return t(this._binaryDecode(e));if(typeof e==`string`){let[n,r,i,a,o]=JSON.parse(e);return t({join_ref:n,ref:r,topic:i,event:a,payload:o})}return t({})}_binaryDecode(e){let t=new DataView(e),n=t.getUint8(0),r=new TextDecoder;switch(n){case this.KINDS.userBroadcast:return this._decodeUserBroadcast(e,t,r)}}_decodeUserBroadcast(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=t.getUint8(4),s=this.HEADER_LENGTH+4,c=n.decode(e.slice(s,s+r));s+=r;let l=n.decode(e.slice(s,s+i));s+=i;let u=n.decode(e.slice(s,s+a));s+=a;let d=e.slice(s,e.byteLength),f=o===this.JSON_ENCODING?JSON.parse(n.decode(d)):d,p={type:this.BROADCAST_EVENT,event:l,payload:f};return a>0&&(p.meta=JSON.parse(u)),{join_ref:null,ref:null,topic:c,event:this.BROADCAST_EVENT,payload:p}}_isArrayBuffer(e){return e instanceof ArrayBuffer||e?.constructor?.name===`ArrayBuffer`}_pick(e,t){return!e||typeof e!=`object`?{}:Object.fromEntries(Object.entries(e).filter(([e])=>t.includes(e)))}},T;(function(e){e.abstime=`abstime`,e.bool=`bool`,e.date=`date`,e.daterange=`daterange`,e.float4=`float4`,e.float8=`float8`,e.int2=`int2`,e.int4=`int4`,e.int4range=`int4range`,e.int8=`int8`,e.int8range=`int8range`,e.json=`json`,e.jsonb=`jsonb`,e.money=`money`,e.numeric=`numeric`,e.oid=`oid`,e.reltime=`reltime`,e.text=`text`,e.time=`time`,e.timestamp=`timestamp`,e.timestamptz=`timestamptz`,e.timetz=`timetz`,e.tsrange=`tsrange`,e.tstzrange=`tstzrange`})(T||={});var be=(e,t,n={})=>{let r=n.skipTypes??[];return t?Object.keys(t).reduce((n,i)=>(n[i]=xe(i,e,t,r),n),{}):{}},xe=(e,t,n,r)=>{let i=t.find(t=>t.name===e)?.type,a=n[e];return i&&!r.includes(i)?Se(i,a):Ce(a)},Se=(e,t)=>{if(e.charAt(0)===`_`)return De(t,e.slice(1,e.length));switch(e){case T.bool:return we(t);case T.float4:case T.float8:case T.int2:case T.int4:case T.int8:case T.numeric:case T.oid:return Te(t);case T.json:case T.jsonb:return Ee(t);case T.timestamp:return Oe(t);case T.abstime:case T.date:case T.daterange:case T.int4range:case T.int8range:case T.money:case T.reltime:case T.text:case T.time:case T.timestamptz:case T.timetz:case T.tsrange:case T.tstzrange:return Ce(t);default:return Ce(t)}},Ce=e=>e,we=e=>{switch(e){case`t`:return!0;case`f`:return!1;default:return e}},Te=e=>{if(typeof e==`string`){let t=parseFloat(e);if(!Number.isNaN(t))return t}return e},Ee=e=>{if(typeof e==`string`)try{return JSON.parse(e)}catch{return e}return e},De=(e,t)=>{if(typeof e!=`string`)return e;let n=e.length-1,r=e[n];if(e[0]===`{`&&r===`}`){let r,i=e.slice(1,n);try{r=JSON.parse(`[`+i+`]`)}catch{r=i?i.split(`,`):[]}return r.map(e=>Se(t,e))}return e},Oe=e=>typeof e==`string`?e.replace(` `,`T`):e,ke=e=>{let t=new URL(e);return t.protocol=t.protocol.replace(/^ws/i,`http`),t.pathname=t.pathname.replace(/\/+$/,``).replace(/\/socket\/websocket$/i,``).replace(/\/socket$/i,``).replace(/\/websocket$/i,``),t.pathname===``||t.pathname===`/`?t.pathname=`/api/broadcast`:t.pathname+=`/api/broadcast`,t.href},Ae=e=>typeof e==`function`?e:function(){return e},je=typeof self<`u`?self:null,Me=typeof window<`u`?window:null,Ne=je||Me||globalThis,Pe=`2.0.0`,Fe=1e4,Ie=1e3,Le=100,Re={connecting:0,open:1,closing:2,closed:3},E={closed:`closed`,errored:`errored`,joined:`joined`,joining:`joining`,leaving:`leaving`},ze={close:`phx_close`,error:`phx_error`,join:`phx_join`,reply:`phx_reply`,leave:`phx_leave`},Be={longpoll:`longpoll`,websocket:`websocket`},Ve={complete:4},He=`base64url.bearer.phx.`,Ue=class{constructor(e,t,n,r){this.channel=e,this.event=t,this.payload=n||function(){return{}},this.receivedResp=null,this.timeout=r,this.timeoutTimer=null,this.recHooks=[],this.sent=!1,this.ref=void 0}resend(e){this.timeout=e,this.reset(),this.send()}send(){this.hasReceived(`timeout`)||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload(),ref:this.ref,join_ref:this.channel.joinRef()}))}receive(e,t){return this.hasReceived(e)&&t(this.receivedResp.response),this.recHooks.push({status:e,callback:t}),this}reset(){this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1}destroy(){this.cancelRefEvent(),this.cancelTimeout()}matchReceive({status:e,response:t,_ref:n}){this.recHooks.filter(t=>t.status===e).forEach(e=>e.callback(t))}cancelRefEvent(){this.refEvent&&this.channel.off(this.refEvent)}cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}startTimeout(){this.timeoutTimer&&this.cancelTimeout(),this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,e=>{this.cancelRefEvent(),this.cancelTimeout(),this.receivedResp=e,this.matchReceive(e)}),this.timeoutTimer=setTimeout(()=>{this.trigger(`timeout`,{})},this.timeout)}hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}trigger(e,t){this.channel.trigger(this.refEvent,{status:e,response:t})}},We=class{constructor(e,t){this.callback=e,this.timerCalc=t,this.timer=void 0,this.tries=0}reset(){this.tries=0,clearTimeout(this.timer)}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries+=1,this.callback()},this.timerCalc(this.tries+1))}},Ge=class{constructor(e,t,n){this.state=E.closed,this.topic=e,this.params=Ae(t||{}),this.socket=n,this.bindings=[],this.bindingRef=0,this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new Ue(this,ze.join,this.params,this.timeout),this.pushBuffer=[],this.stateChangeRefs=[],this.rejoinTimer=new We(()=>{this.socket.isConnected()&&this.rejoin()},this.socket.rejoinAfterMs),this.stateChangeRefs.push(this.socket.onError(()=>this.rejoinTimer.reset())),this.stateChangeRefs.push(this.socket.onOpen(()=>{this.rejoinTimer.reset(),this.isErrored()&&this.rejoin()})),this.joinPush.receive(`ok`,()=>{this.state=E.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(e=>e.send()),this.pushBuffer=[]}),this.joinPush.receive(`error`,e=>{this.state=E.errored,this.socket.hasLogger()&&this.socket.log(`channel`,`error ${this.topic}`,e),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.onClose(()=>{this.rejoinTimer.reset(),this.socket.hasLogger()&&this.socket.log(`channel`,`close ${this.topic}`),this.state=E.closed,this.socket.remove(this)}),this.onError(e=>{this.socket.hasLogger()&&this.socket.log(`channel`,`error ${this.topic}`,e),this.isJoining()&&this.joinPush.reset(),this.state=E.errored,this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.joinPush.receive(`timeout`,()=>{this.socket.hasLogger()&&this.socket.log(`channel`,`timeout ${this.topic}`,this.joinPush.timeout),new Ue(this,ze.leave,Ae({}),this.timeout).send(),this.state=E.errored,this.joinPush.reset(),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.on(ze.reply,(e,t)=>{this.trigger(this.replyEventName(t),e)})}join(e=this.timeout){if(this.joinedOnce)throw Error(`tried to join multiple times. 'join' can only be called a single time per channel instance`);return this.timeout=e,this.joinedOnce=!0,this.rejoin(),this.joinPush}teardown(){this.pushBuffer.forEach(e=>e.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=E.closed,this.bindings=[]}onClose(e){this.on(ze.close,e)}onError(e){return this.on(ze.error,t=>e(t))}on(e,t){let n=this.bindingRef++;return this.bindings.push({event:e,ref:n,callback:t}),n}off(e,t){this.bindings=this.bindings.filter(n=>n.event!==e||t!==void 0&&t!==n.ref)}canPush(){return this.socket.isConnected()&&this.isJoined()}push(e,t,n=this.timeout){if(t||={},!this.joinedOnce)throw Error(`tried to push '${e}' to '${this.topic}' before joining. Use channel.join() before pushing events`);let r=new Ue(this,e,function(){return t},n);return this.canPush()?r.send():(r.startTimeout(),this.pushBuffer.push(r)),r}leave(e=this.timeout){this.rejoinTimer.reset(),this.joinPush.cancelTimeout(),this.state=E.leaving;let t=()=>{this.socket.hasLogger()&&this.socket.log(`channel`,`leave ${this.topic}`),this.trigger(ze.close,`leave`)},n=new Ue(this,ze.leave,Ae({}),e);return n.receive(`ok`,()=>t()).receive(`timeout`,()=>t()),n.send(),this.canPush()||n.trigger(`ok`,{}),n}onMessage(e,t,n){return t}filterBindings(e,t,n){return!0}isMember(e,t,n,r){return this.topic===e?r&&r!==this.joinRef()?(this.socket.hasLogger()&&this.socket.log(`channel`,`dropping outdated message`,{topic:e,event:t,payload:n,joinRef:r}),!1):!0:!1}joinRef(){return this.joinPush.ref}rejoin(e=this.timeout){this.isLeaving()||(this.socket.leaveOpenTopic(this.topic),this.state=E.joining,this.joinPush.resend(e))}trigger(e,t,n,r){let i=this.onMessage(e,t,n,r);if(t&&!i)throw Error(`channel onMessage callbacks must return the payload, modified or unmodified`);let a=this.bindings.filter(r=>r.event===e&&this.filterBindings(r,t,n));for(let e=0;e<a.length;e++)a[e].callback(i,n,r||this.joinRef())}replyEventName(e){return`chan_reply_${e}`}isClosed(){return this.state===E.closed}isErrored(){return this.state===E.errored}isJoined(){return this.state===E.joined}isJoining(){return this.state===E.joining}isLeaving(){return this.state===E.leaving}},Ke=class{static request(e,t,n,r,i,a,o){if(Ne.XDomainRequest){let n=new Ne.XDomainRequest;return this.xdomainRequest(n,e,t,r,i,a,o)}if(Ne.XMLHttpRequest){let s=new Ne.XMLHttpRequest;return this.xhrRequest(s,e,t,n,r,i,a,o)}if(Ne.fetch&&Ne.AbortController)return this.fetchRequest(e,t,n,r,i,a,o);throw Error(`No suitable XMLHttpRequest implementation found`)}static fetchRequest(e,t,n,r,i,a,o){let s={method:e,headers:n,body:r},c=null;return i&&(c=new AbortController,setTimeout(()=>c.abort(),i),s.signal=c.signal),Ne.fetch(t,s).then(e=>e.text()).then(e=>this.parseJSON(e)).then(e=>o&&o(e)).catch(e=>{e.name===`AbortError`&&a?a():o&&o(null)}),c}static xdomainRequest(e,t,n,r,i,a,o){return e.timeout=i,e.open(t,n),e.onload=()=>{let t=this.parseJSON(e.responseText);o&&o(t)},a&&(e.ontimeout=a),e.onprogress=()=>{},e.send(r),e}static xhrRequest(e,t,n,r,i,a,o,s){e.open(t,n,!0),e.timeout=a;for(let[t,n]of Object.entries(r))e.setRequestHeader(t,n);return e.onerror=()=>s&&s(null),e.onreadystatechange=()=>{e.readyState===Ve.complete&&s&&s(this.parseJSON(e.responseText))},o&&(e.ontimeout=o),e.send(i),e}static parseJSON(e){if(!e||e===``)return null;try{return JSON.parse(e)}catch{return console&&console.log(`failed to parse JSON response`,e),null}}static serialize(e,t){let n=[];for(var r in e){if(!Object.prototype.hasOwnProperty.call(e,r))continue;let i=t?`${t}[${r}]`:r,a=e[r];typeof a==`object`?n.push(this.serialize(a,i)):n.push(encodeURIComponent(i)+`=`+encodeURIComponent(a))}return n.join(`&`)}static appendParams(e,t){return Object.keys(t).length===0?e:`${e}${e.match(/\?/)?`&`:`?`}${this.serialize(t)}`}},qe=e=>{let t=``,n=new Uint8Array(e),r=n.byteLength;for(let e=0;e<r;e++)t+=String.fromCharCode(n[e]);return btoa(t)},Je=class{constructor(e,t){t&&t.length===2&&t[1].startsWith(He)&&(this.authToken=atob(t[1].slice(He.length))),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.reqs=new Set,this.awaitingBatchAck=!1,this.currentBatch=null,this.currentBatchTimer=null,this.batchBuffer=[],this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(e),this.readyState=Re.connecting,setTimeout(()=>this.poll(),0)}normalizeEndpoint(e){return e.replace(`ws://`,`http://`).replace(`wss://`,`https://`).replace(RegExp(`(.*)/`+Be.websocket),`$1/`+Be.longpoll)}endpointURL(){return Ke.appendParams(this.pollEndpoint,{token:this.token})}closeAndRetry(e,t,n){this.close(e,t,n),this.readyState=Re.connecting}ontimeout(){this.onerror(`timeout`),this.closeAndRetry(1005,`timeout`,!1)}isActive(){return this.readyState===Re.open||this.readyState===Re.connecting}poll(){let e={Accept:`application/json`};this.authToken&&(e[`X-Phoenix-AuthToken`]=this.authToken),this.ajax(`GET`,e,null,()=>this.ontimeout(),e=>{if(e){var{status:t,token:n,messages:r}=e;if(t===410&&this.token!==null){this.onerror(410),this.closeAndRetry(3410,`session_gone`,!1);return}this.token=n}else t=0;switch(t){case 200:r.forEach(e=>{setTimeout(()=>this.onmessage({data:e}),0)}),this.poll();break;case 204:this.poll();break;case 410:this.readyState=Re.open,this.onopen({}),this.poll();break;case 403:this.onerror(403),this.close(1008,`forbidden`,!1);break;case 0:case 500:this.onerror(500),this.closeAndRetry(1011,`internal server error`,500);break;default:throw Error(`unhandled poll status ${t}`)}})}send(e){typeof e!=`string`&&(e=qe(e)),this.currentBatch?this.currentBatch.push(e):this.awaitingBatchAck?this.batchBuffer.push(e):(this.currentBatch=[e],this.currentBatchTimer=setTimeout(()=>{this.batchSend(this.currentBatch),this.currentBatch=null},0))}batchSend(e,t=0){this.awaitingBatchAck=!0;let n=t+Le,r=e.slice(t,n);this.ajax(`POST`,{"Content-Type":`application/x-ndjson`},r.join(`
`),()=>this.onerror(`timeout`),t=>{!t||t.status!==200?(this.awaitingBatchAck=!1,this.onerror(t&&t.status),this.closeAndRetry(1011,`internal server error`,!1)):n<e.length?this.batchSend(e,n):this.batchBuffer.length>0?(this.batchSend(this.batchBuffer),this.batchBuffer=[]):this.awaitingBatchAck=!1})}close(e,t,n){for(let e of this.reqs)e.abort();this.readyState=Re.closed;let r=Object.assign({code:1e3,reason:void 0,wasClean:!0},{code:e,reason:t,wasClean:n});this.batchBuffer=[],clearTimeout(this.currentBatchTimer),this.currentBatchTimer=null,typeof CloseEvent<`u`?this.onclose(new CloseEvent(`close`,r)):this.onclose(r)}ajax(e,t,n,r,i){let a;a=Ke.request(e,this.endpointURL(),t,n,this.timeout,()=>{this.reqs.delete(a),r()},e=>{this.reqs.delete(a),this.isActive()&&i(e)}),this.reqs.add(a)}},Ye=class e{constructor(t,n={}){let r=n.events||{state:`presence_state`,diff:`presence_diff`};this.state=Object.create(null),this.pendingDiffs=[],this.channel=t,this.joinRef=null,this.caller={onJoin:function(){},onLeave:function(){},onSync:function(){}},this.channel.on(r.state,t=>{let{onJoin:n,onLeave:r,onSync:i}=this.caller;this.joinRef=this.channel.joinRef(),this.state=e.syncState(this.state,t,n,r),this.pendingDiffs.forEach(t=>{this.state=e.syncDiff(this.state,t,n,r)}),this.pendingDiffs=[],i()}),this.channel.on(r.diff,t=>{let{onJoin:n,onLeave:r,onSync:i}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(t):(this.state=e.syncDiff(this.state,t,n,r),i())})}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}list(t){return e.list(this.state,t)}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel.joinRef()}static syncState(e,t,n,r){let i=this.toNullProtoObj(this.clone(e));t=this.toNullProtoObj(t);let a=Object.create(null),o=Object.create(null);return this.map(i,(e,n)=>{t[e]||(o[e]=n)}),this.map(t,(e,t)=>{let n=i[e];if(n){let r=t.metas.map(e=>e.phx_ref),i=n.metas.map(e=>e.phx_ref),s=t.metas.filter(e=>i.indexOf(e.phx_ref)<0),c=n.metas.filter(e=>r.indexOf(e.phx_ref)<0);s.length>0&&(a[e]=t,a[e].metas=s),c.length>0&&(o[e]=this.clone(n),o[e].metas=c)}else a[e]=t}),this.syncDiff(i,{joins:a,leaves:o},n,r)}static syncDiff(e,t,n,r){e=this.toNullProtoObj(e);let{joins:i,leaves:a}=this.clone(t);return n||=function(){},r||=function(){},this.map(i,(t,r)=>{let i=e[t];if(e[t]=this.clone(r),i){let n=e[t].metas.map(e=>e.phx_ref),r=i.metas.filter(e=>n.indexOf(e.phx_ref)<0);e[t].metas.unshift(...r)}n(t,i,r)}),this.map(a,(t,n)=>{let i=e[t];if(!i)return;let a=n.metas.map(e=>e.phx_ref);i.metas=i.metas.filter(e=>a.indexOf(e.phx_ref)<0),r(t,i,n),i.metas.length===0&&delete e[t]}),e}static list(e,t){return t||=function(e,t){return t},this.map(e,(e,n)=>t(e,n))}static map(e,t){return Object.getOwnPropertyNames(e).map(n=>t(n,e[n]))}static toNullProtoObj(e){if(Object.getPrototypeOf(e)===null)return e;let t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(n=>{t[n]=e[n]}),t}static clone(e){return JSON.parse(JSON.stringify(e))}},Xe={HEADER_LENGTH:1,META_LENGTH:4,KINDS:{push:0,reply:1,broadcast:2},encode(e,t){if(e.payload.constructor===ArrayBuffer)return t(this.binaryEncode(e));{let n=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(n))}},decode(e,t){if(e.constructor===ArrayBuffer)return t(this.binaryDecode(e));{let[n,r,i,a,o]=JSON.parse(e);return t({join_ref:n,ref:r,topic:i,event:a,payload:o})}},binaryEncode(e){let{join_ref:t,ref:n,event:r,topic:i,payload:a}=e,o=new TextEncoder,s=o.encode(t),c=o.encode(n),l=o.encode(i),u=o.encode(r);this.assertFieldSize(s.byteLength,`join_ref`),this.assertFieldSize(c.byteLength,`ref`),this.assertFieldSize(l.byteLength,`topic`),this.assertFieldSize(u.byteLength,`event`);let d=this.META_LENGTH+s.byteLength+c.byteLength+l.byteLength+u.byteLength,f=new ArrayBuffer(this.HEADER_LENGTH+d),p=new Uint8Array(f),m=new DataView(f),h=0;m.setUint8(h++,this.KINDS.push),m.setUint8(h++,s.byteLength),m.setUint8(h++,c.byteLength),m.setUint8(h++,l.byteLength),m.setUint8(h++,u.byteLength),p.set(s,h),h+=s.byteLength,p.set(c,h),h+=c.byteLength,p.set(l,h),h+=l.byteLength,p.set(u,h),h+=u.byteLength;var g=new Uint8Array(f.byteLength+a.byteLength);return g.set(p,0),g.set(new Uint8Array(a),f.byteLength),g.buffer},assertFieldSize(e,t){if(e>255)throw Error(`unable to convert ${t} to binary: must be less than or equal to 255 bytes, but is ${e} bytes`)},binaryDecode(e){let t=new DataView(e),n=t.getUint8(0),r=new TextDecoder;switch(n){case this.KINDS.push:return this.decodePush(e,t,r);case this.KINDS.reply:return this.decodeReply(e,t,r);case this.KINDS.broadcast:return this.decodeBroadcast(e,t,r)}},decodePush(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=this.HEADER_LENGTH+this.META_LENGTH-1,s=n.decode(e.slice(o,o+r));o+=r;let c=n.decode(e.slice(o,o+i));o+=i;let l=n.decode(e.slice(o,o+a));return o+=a,{join_ref:s,ref:null,topic:c,event:l,payload:e.slice(o,e.byteLength)}},decodeReply(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=t.getUint8(4),s=this.HEADER_LENGTH+this.META_LENGTH,c=n.decode(e.slice(s,s+r));s+=r;let l=n.decode(e.slice(s,s+i));s+=i;let u=n.decode(e.slice(s,s+a));s+=a;let d=n.decode(e.slice(s,s+o));s+=o;let f={status:d,response:e.slice(s,e.byteLength)};return{join_ref:c,ref:l,topic:u,event:ze.reply,payload:f}},decodeBroadcast(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=this.HEADER_LENGTH+2,o=n.decode(e.slice(a,a+r));a+=r;let s=n.decode(e.slice(a,a+i));return a+=i,{join_ref:null,ref:null,topic:o,event:s,payload:e.slice(a,e.byteLength)}}},Ze=class{constructor(e,t={}){this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.fallbackRef=null,this.timeout=t.timeout||Fe,this.transport=t.transport||Ne.WebSocket||Je,this.conn=void 0,this.primaryPassedHealthCheck=!1,this.longPollFallbackMs=t.longPollFallbackMs,this.fallbackTimer=null;let n=null;try{n=Ne&&Ne.sessionStorage}catch{}this.sessionStore=t.sessionStorage||n,this.establishedConnections=0,this.defaultEncoder=Xe.encode.bind(Xe),this.defaultDecoder=Xe.decode.bind(Xe),this.closeWasClean=!0,this.disconnecting=!1,this.binaryType=t.binaryType||`arraybuffer`,this.connectClock=1,this.pageHidden=!1,this.encode=void 0,this.decode=void 0,this.transport===Je?(this.encode=this.defaultEncoder,this.decode=this.defaultDecoder):(this.encode=t.encode||this.defaultEncoder,this.decode=t.decode||this.defaultDecoder);let r=null;Me&&Me.addEventListener&&(Me.addEventListener(`pagehide`,e=>{this.conn&&(this.disconnect(),r=this.connectClock)}),Me.addEventListener(`pageshow`,e=>{r===this.connectClock&&(r=null,this.connect())}),Me.addEventListener(`visibilitychange`,()=>{document.visibilityState===`hidden`?this.pageHidden=!0:(this.pageHidden=!1,!this.isConnected()&&!this.closeWasClean&&this.teardown(()=>this.connect()))})),this.heartbeatIntervalMs=t.heartbeatIntervalMs||3e4,this.autoSendHeartbeat=t.autoSendHeartbeat??!0,this.heartbeatCallback=t.heartbeatCallback??(()=>{}),this.rejoinAfterMs=e=>t.rejoinAfterMs?t.rejoinAfterMs(e):[1e3,2e3,5e3][e-1]||1e4,this.reconnectAfterMs=e=>t.reconnectAfterMs?t.reconnectAfterMs(e):[10,50,100,150,200,250,500,1e3,2e3][e-1]||5e3,this.logger=t.logger||null,!this.logger&&t.debug&&(this.logger=(e,t,n)=>{console.log(`${e}: ${t}`,n)}),this.longpollerTimeout=t.longpollerTimeout||2e4,this.params=Ae(t.params||{}),this.endPoint=`${e}/${Be.websocket}`,this.vsn=t.vsn||Pe,this.heartbeatTimeoutTimer=null,this.heartbeatTimer=null,this.heartbeatSentAt=null,this.pendingHeartbeatRef=null,this.reconnectTimer=new We(()=>{this.pageHidden?(this.log(`Not reconnecting as page is hidden!`),this.teardown()):this.teardown(async()=>{t.beforeReconnect&&await t.beforeReconnect(),this.connect()})},this.reconnectAfterMs),this.authToken=t.authToken&&Ae(t.authToken)}getLongPollTransport(){return Je}replaceTransport(e){this.connectClock++,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.conn&&=(this.conn.close(),null),this.transport=e}protocol(){return location.protocol.match(/^https/)?`wss`:`ws`}endPointURL(){let e=Ke.appendParams(Ke.appendParams(this.endPoint,this.params()),{vsn:this.vsn});return e.charAt(0)===`/`?e.charAt(1)===`/`?`${this.protocol()}:${e}`:`${this.protocol()}://${location.host}${e}`:e}disconnect(e,t,n){this.connectClock++,this.disconnecting=!0,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.teardown(()=>{this.disconnecting=!1,e&&e()},t,n)}connect(e){e&&(console&&console.log(`passing params to connect is deprecated. Instead pass :params to the Socket constructor`),this.params=Ae(e)),(!this.conn||this.disconnecting)&&(this.longPollFallbackMs&&this.transport!==Je?this.connectWithFallback(Je,this.longPollFallbackMs):this.transportConnect())}log(e,t,n){this.logger&&this.logger(e,t,n)}hasLogger(){return this.logger!==null}onOpen(e){let t=this.makeRef();return this.stateChangeCallbacks.open.push([t,e]),t}onClose(e){let t=this.makeRef();return this.stateChangeCallbacks.close.push([t,e]),t}onError(e){let t=this.makeRef();return this.stateChangeCallbacks.error.push([t,e]),t}onMessage(e){let t=this.makeRef();return this.stateChangeCallbacks.message.push([t,e]),t}onHeartbeat(e){this.heartbeatCallback=e}ping(e){if(!this.isConnected())return!1;let t=this.makeRef(),n=Date.now();this.push({topic:`phoenix`,event:`heartbeat`,payload:{},ref:t});let r=this.onMessage(i=>{i.ref===t&&(this.off([r]),e(Date.now()-n))});return!0}transportName(e){switch(e){case Je:return`LongPoll`;default:return e.name}}transportConnect(){this.connectClock++,this.closeWasClean=!1;let e;this.authToken&&(e=[`phoenix`,`${He}${btoa(this.authToken()).replace(/=/g,``)}`]),this.conn=new this.transport(this.endPointURL(),e),this.conn.binaryType=this.binaryType,this.conn.timeout=this.longpollerTimeout,this.conn.onopen=()=>this.onConnOpen(),this.conn.onerror=e=>this.onConnError(e),this.conn.onmessage=e=>this.onConnMessage(e),this.conn.onclose=e=>this.onConnClose(e)}getSession(e){return this.sessionStore&&this.sessionStore.getItem(e)}storeSession(e,t){this.sessionStore&&this.sessionStore.setItem(e,t)}connectWithFallback(e,t=2500){clearTimeout(this.fallbackTimer);let n=!1,r=!0,i,a,o=this.transportName(e),s=t=>{this.log(`transport`,`falling back to ${o}...`,t),this.off([i,a]),r=!1,this.replaceTransport(e),this.transportConnect()};if(this.getSession(`phx:fallback:${o}`))return s(`memorized`);this.fallbackTimer=setTimeout(s,t),a=this.onError(e=>{this.log(`transport`,`error`,e),r&&!n&&(clearTimeout(this.fallbackTimer),s(e))}),this.fallbackRef&&this.off([this.fallbackRef]),this.fallbackRef=this.onOpen(()=>{if(n=!0,!r){let t=this.transportName(e);return this.primaryPassedHealthCheck||this.storeSession(`phx:fallback:${t}`,`true`),this.log(`transport`,`established ${t} fallback`)}clearTimeout(this.fallbackTimer),this.fallbackTimer=setTimeout(s,t),this.ping(e=>{this.log(`transport`,`connected to primary after`,e),this.primaryPassedHealthCheck=!0,clearTimeout(this.fallbackTimer)})}),this.transportConnect()}clearHeartbeats(){clearTimeout(this.heartbeatTimer),clearTimeout(this.heartbeatTimeoutTimer)}onConnOpen(){this.hasLogger()&&this.log(`transport`,`connected to ${this.endPointURL()}`),this.closeWasClean=!1,this.disconnecting=!1,this.establishedConnections++,this.flushSendBuffer(),this.reconnectTimer.reset(),this.autoSendHeartbeat&&this.resetHeartbeat(),this.triggerStateCallbacks(`open`)}heartbeatTimeout(){if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.hasLogger()&&this.log(`transport`,`heartbeat timeout. Attempting to re-establish connection`);try{this.heartbeatCallback(`timeout`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.triggerChanError(Error(`heartbeat timeout`)),this.closeWasClean=!1,this.teardown(()=>this.reconnectTimer.scheduleTimeout(),Ie,`heartbeat timeout`)}}resetHeartbeat(){this.conn&&this.conn.skipHeartbeat||(this.pendingHeartbeatRef=null,this.clearHeartbeats(),this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}teardown(e,t,n){if(!this.conn)return e&&e();let r=this.conn;this.waitForBufferDone(r,()=>{t?r.close(t,n||``):r.close(),this.waitForSocketClosed(r,()=>{this.conn===r&&(this.conn.onopen=function(){},this.conn.onerror=function(){},this.conn.onmessage=function(){},this.conn.onclose=function(){},this.conn=null),e&&e()})})}waitForBufferDone(e,t,n=1){n===5||!e.bufferedAmount?t():setTimeout(()=>{this.waitForBufferDone(e,t,n+1)},150*n)}waitForSocketClosed(e,t,n=1){n===5||e.readyState===Re.closed?t():setTimeout(()=>{this.waitForSocketClosed(e,t,n+1)},150*n)}onConnClose(e){this.conn&&(this.conn.onclose=()=>{}),this.hasLogger()&&this.log(`transport`,`close`,e),this.triggerChanError(e),this.clearHeartbeats(),this.closeWasClean||this.reconnectTimer.scheduleTimeout(),this.triggerStateCallbacks(`close`,e)}onConnError(e){this.hasLogger()&&this.log(`transport`,`error`,e);let t=this.transport,n=this.establishedConnections;this.triggerStateCallbacks(`error`,e,t,n),(t===this.transport||n>0)&&this.triggerChanError(e)}triggerChanError(e){this.channels.forEach(t=>{t.isErrored()||t.isLeaving()||t.isClosed()||t.trigger(ze.error,e)})}connectionState(){switch(this.conn&&this.conn.readyState){case Re.connecting:return`connecting`;case Re.open:return`open`;case Re.closing:return`closing`;default:return`closed`}}isConnected(){return this.connectionState()===`open`}remove(e){this.off(e.stateChangeRefs),this.channels=this.channels.filter(t=>t!==e)}off(e){for(let t in this.stateChangeCallbacks)this.stateChangeCallbacks[t]=this.stateChangeCallbacks[t].filter(([t])=>e.indexOf(t)===-1)}channel(e,t={}){let n=new Ge(e,t,this);return this.channels.push(n),n}push(e){if(this.hasLogger()){let{topic:t,event:n,payload:r,ref:i,join_ref:a}=e;this.log(`push`,`${t} ${n} (${a}, ${i})`,r)}this.isConnected()?this.encode(e,e=>this.conn.send(e)):this.sendBuffer.push(()=>this.encode(e,e=>this.conn.send(e)))}makeRef(){let e=this.ref+1;return this.ref=e===this.ref?0:e,this.ref.toString()}sendHeartbeat(){if(!this.isConnected())try{this.heartbeatCallback(`disconnected`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}else if(this.pendingHeartbeatRef)this.heartbeatTimeout();else{this.pendingHeartbeatRef=this.makeRef(),this.heartbeatSentAt=Date.now(),this.push({topic:`phoenix`,event:`heartbeat`,payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback(`sent`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.heartbeatTimeoutTimer=setTimeout(()=>this.heartbeatTimeout(),this.heartbeatIntervalMs)}}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}onConnMessage(e){this.decode(e.data,e=>{let{topic:t,event:n,payload:r,ref:i,join_ref:a}=e;if(i&&i===this.pendingHeartbeatRef){let e=this.heartbeatSentAt?Date.now()-this.heartbeatSentAt:void 0;this.clearHeartbeats();try{this.heartbeatCallback(r.status===`ok`?`ok`:`error`,e)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.autoSendHeartbeat&&(this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}this.hasLogger()&&this.log(`receive`,`${r.status||``} ${t} ${n} ${i&&`(`+i+`)`||``}`.trim(),r);for(let e=0;e<this.channels.length;e++){let o=this.channels[e];o.isMember(t,n,r,a)&&o.trigger(n,r,i,a)}this.triggerStateCallbacks(`message`,e)})}triggerStateCallbacks(e,...t){try{this.stateChangeCallbacks[e].forEach(([n,r])=>{try{r(...t)}catch(t){this.log(`error`,`error in ${e} callback`,t)}})}catch(t){this.log(`error`,`error triggering ${e} callbacks`,t)}}leaveOpenTopic(e){let t=this.channels.find(t=>t.topic===e&&(t.isJoined()||t.isJoining()));t&&(this.hasLogger()&&this.log(`transport`,`leaving duplicate topic "${e}"`),t.leave())}},Qe=class e{constructor(t,n){let r=tt(n);this.presence=new Ye(t.getChannel(),r),this.presence.onJoin((n,r,i)=>{let a=e.onJoinPayload(n,r,i);t.getChannel().trigger(`presence`,a)}),this.presence.onLeave((n,r,i)=>{let a=e.onLeavePayload(n,r,i);t.getChannel().trigger(`presence`,a)}),this.presence.onSync(()=>{t.getChannel().trigger(`presence`,{event:`sync`})})}get state(){return e.transformState(this.presence.state)}static transformState(e){return e=et(e),Object.getOwnPropertyNames(e).reduce((t,n)=>{let r=e[n];return t[n]=$e(r),t},{})}static onJoinPayload(e,t,n){return{event:`join`,key:e,currentPresences:nt(t),newPresences:$e(n)}}static onLeavePayload(e,t,n){return{event:`leave`,key:e,currentPresences:nt(t),leftPresences:$e(n)}}};function $e(e){return e.metas.map(e=>{let t=Object.getOwnPropertyDescriptors(e),n=Object.defineProperties({},t);return n.presence_ref=n.phx_ref,delete n.phx_ref,delete n.phx_ref_prev,n})}function et(e){return JSON.parse(JSON.stringify(e))}function tt(e){return e?.events&&{events:e.events}}function nt(e){return e?.metas?$e(e):[]}var rt;(function(e){e.SYNC=`sync`,e.JOIN=`join`,e.LEAVE=`leave`})(rt||={});var it=class{get state(){return this.presenceAdapter.state}constructor(e,t){this.channel=e,this.presenceAdapter=new Qe(this.channel.channelAdapter,t)}};function at(e){if(e instanceof Error)return e;if(typeof e==`string`)return Error(e);if(e&&typeof e==`object`){let t=e;if(typeof t.code==`number`){let n=typeof t.reason==`string`&&t.reason?` (${t.reason})`:``;return Error(`socket closed: ${t.code}${n}`,{cause:e})}return Error(`channel error: transport failure`,{cause:e})}return Error(`channel error: connection lost`)}var ot=class{constructor(e,t,n){let r=st(n);this.channel=e.getSocket().channel(t,r),this.socket=e}get state(){return this.channel.state}set state(e){this.channel.state=e}get joinedOnce(){return this.channel.joinedOnce}get joinPush(){return this.channel.joinPush}get rejoinTimer(){return this.channel.rejoinTimer}on(e,t){return this.channel.on(e,t)}off(e,t){this.channel.off(e,t)}subscribe(e){return this.channel.join(e)}unsubscribe(e){return this.channel.leave(e)}teardown(){this.channel.teardown()}onClose(e){this.channel.onClose(e)}onError(e){return this.channel.onError(e)}push(e,t,n){let r;try{r=this.channel.push(e,t,n)}catch{throw Error(`tried to push '${e}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`)}if(this.channel.pushBuffer.length>100){let e=this.channel.pushBuffer.shift();e.cancelTimeout(),this.socket.log(`channel`,`discarded push due to buffer overflow: ${e.event}`,e.payload())}return r}updateJoinPayload(e){let t=this.channel.joinPush.payload();this.channel.joinPush.payload=()=>Object.assign(Object.assign({},t),e)}canPush(){return this.socket.isConnected()&&this.state===ge.joined}isJoined(){return this.state===ge.joined}isJoining(){return this.state===ge.joining}isClosed(){return this.state===ge.closed}isLeaving(){return this.state===ge.leaving}updateFilterBindings(e){this.channel.filterBindings=e}updatePayloadTransform(e){this.channel.onMessage=e}getChannel(){return this.channel}};function st(e){return{config:Object.assign({broadcast:{ack:!1,self:!1},presence:{key:``,enabled:!1},private:!1},e.config)}}var ct=/[,()"\\]/,lt=e=>ct.test(e)||e!==e.trim(),ut=e=>`"${e.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`)}"`,dt=e=>{let t=e===null?`null`:String(e);return lt(t)?ut(t):t},ft=e=>e===null?`null`:String(e),pt=(e,t)=>{if(e===`in`){let e=Array.isArray(t)?t:[t];if(e.length===0)throw Error("Realtime `in` filter requires at least one value.");return`in.(${Array.from(new Set(e)).map(e=>dt(e)).join(`,`)})`}return e===`is`?`is.${ft(t)}`:`${e}.${dt(t)}`},mt=class{constructor(){this.filters=[]}add(e,t,n,r=!1){let i=r?`not.`:``;return this.filters.push(`${e}=${i}${pt(t,n)}`),this}eq(e,t){return this.add(e,`eq`,t)}neq(e,t){return this.add(e,`neq`,t)}gt(e,t){return this.add(e,`gt`,t)}gte(e,t){return this.add(e,`gte`,t)}lt(e,t){return this.add(e,`lt`,t)}lte(e,t){return this.add(e,`lte`,t)}in(e,t){return this.add(e,`in`,t)}like(e,t){return this.add(e,`like`,t)}ilike(e,t){return this.add(e,`ilike`,t)}match(e,t){return this.add(e,`match`,t)}imatch(e,t){return this.add(e,`imatch`,t)}is(e,t){return this.add(e,`is`,t)}isDistinct(e,t){return this.add(e,`isdistinct`,t)}not(e,t,n){return this.add(e,t,n,!0)}build(){return this.filters.join(`,`)}toString(){return this.build()}},ht;(function(e){e.ALL=`*`,e.INSERT=`INSERT`,e.UPDATE=`UPDATE`,e.DELETE=`DELETE`})(ht||={});var gt;(function(e){e.BROADCAST=`broadcast`,e.PRESENCE=`presence`,e.POSTGRES_CHANGES=`postgres_changes`,e.SYSTEM=`system`})(gt||={});var _t;(function(e){e.SUBSCRIBED=`SUBSCRIBED`,e.TIMED_OUT=`TIMED_OUT`,e.CLOSED=`CLOSED`,e.CHANNEL_ERROR=`CHANNEL_ERROR`})(_t||={});var vt=class e{get state(){return this.channelAdapter.state}set state(e){this.channelAdapter.state=e}get joinedOnce(){return this.channelAdapter.joinedOnce}get timeout(){return this.socket.timeout}get joinPush(){return this.channelAdapter.joinPush}get rejoinTimer(){return this.channelAdapter.rejoinTimer}constructor(e,t={config:{}},n){if(this.topic=e,this.params=t,this.socket=n,this.bindings={},this.subTopic=e.replace(/^realtime:/i,``),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:``,enabled:!1},private:!1},t.config),this.channelAdapter=new ot(this.socket.socketAdapter,e,this.params),this.presence=new it(this),this._onClose(()=>{this.socket._remove(this)}),this._updateFilterTransform(),this.broadcastEndpointURL=ke(this.socket.socketAdapter.endPointURL()),this.private=this.params.config.private||!1,!this.private&&this.params.config?.broadcast?.replay)throw Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`)}subscribe(e,t=this.timeout){if(this.socket.isConnected()||this.socket.connect(),this.channelAdapter.isClosed()){let{config:{broadcast:n,presence:r,private:i,postgres_changes_options:a}}=this.params,o=this.bindings.postgres_changes?.map(e=>e.filter)??[],s=!!this.bindings[gt.PRESENCE]&&this.bindings[gt.PRESENCE].length>0||this.params.config.presence?.enabled===!0,c={},l=Object.assign({broadcast:n,presence:Object.assign(Object.assign({},r),{enabled:s}),postgres_changes:o,private:i},a?{postgres_changes_options:a}:{});this.socket.accessTokenValue&&(c.access_token=this.socket.accessTokenValue),this._onError(t=>{e?.(_t.CHANNEL_ERROR,at(t))}),this._onClose(()=>e?.(_t.CLOSED)),this.updateJoinPayload(Object.assign({config:l},c)),this._updateFilterMessage();let u=a?.wait&&o.length>0?Math.max(t,(a.timeout??me)+he):t;this.channelAdapter.subscribe(u).receive(`ok`,async({postgres_changes:t})=>{this.socket._isManualToken()||this.socket.setAuth(),t===void 0?e?.(_t.SUBSCRIBED):this._updatePostgresBindings(t,e)}).receive(`error`,t=>{this.state=ge.errored;let n=Object.values(t).join(`, `)||`error`;e?.(_t.CHANNEL_ERROR,Error(n,{cause:t}))}).receive(`timeout`,()=>{e?.(_t.TIMED_OUT)})}return this}_updatePostgresBindings(t,n){let r=this.bindings.postgres_changes,i=r?.length??0,a=[];for(let o=0;o<i;o++){let i=r[o],{filter:{event:s,schema:c,table:l,filter:u}}=i,d=t&&t[o];if(d&&d.event===s&&e.isFilterValueEqual(d.schema,c)&&e.isFilterValueEqual(d.table,l)&&e.isFilterValueEqual(d.filter,u))a.push(Object.assign(Object.assign({},i),{id:d.id}));else{this.unsubscribe(),this.state=ge.errored,n?.(_t.CHANNEL_ERROR,Error(`mismatch between server and client bindings for postgres changes`));return}}this.bindings.postgres_changes=a,this.state!=ge.errored&&n&&n(_t.SUBSCRIBED)}presenceState(){return this.presence.state}async track(e,t={}){return await this.send({type:`presence`,event:`track`,payload:e},t)}async untrack(e={}){return await this.send({type:`presence`,event:`untrack`},e)}on(e,t,n){let r=this.channelAdapter.isJoined()||this.channelAdapter.isJoining(),i=e===gt.PRESENCE||e===gt.POSTGRES_CHANGES;if(r&&i)throw this.socket.log(`channel`,`cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`),Error(`cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`);return this._on(e,t,n)}async httpSend(e,t,n={}){if(t==null)return Promise.reject(Error(`Payload is required for httpSend()`));let r=t instanceof ArrayBuffer||ArrayBuffer.isView(t),i={apikey:this.socket.apiKey?this.socket.apiKey:``,"Content-Type":r?`application/octet-stream`:`application/json`};this.socket.accessTokenValue&&(i.Authorization=`Bearer ${this.socket.accessTokenValue}`);let a=new URL(this.broadcastEndpointURL);a.pathname+=`/${encodeURIComponent(this.subTopic)}/events/${encodeURIComponent(e)}`,this.private&&a.searchParams.set(`private`,`true`);let o={method:`POST`,headers:i,body:r?t:JSON.stringify(t)},s=await this._fetchWithTimeout(a.toString(),o,n.timeout??this.timeout);if(s.status===202)return{success:!0};if(s.status===404)return Promise.reject(Error(`httpSend() requires Realtime server v2.97.0 or newer; the endpoint returned 404. Update your Supabase CLI to a recent version, or upgrade the Realtime server in your self-hosted setup. See https://github.com/supabase/supabase-js/blob/master/packages/core/realtime-js/migrations/httpsend-server-version.md`));let c=s.statusText;try{let e=await s.json();c=e.error||e.message||c}catch{}return Promise.reject(Error(c))}async send(e,t={}){if(!this.channelAdapter.canPush()&&e.type===`broadcast`){let n=`Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.`;this.socket.hasLogger()?this.socket.log(`channel`,n):console.warn(n);let{event:r,payload:i}=e,a={apikey:this.socket.apiKey?this.socket.apiKey:``,"Content-Type":`application/json`};this.socket.accessTokenValue&&(a.Authorization=`Bearer ${this.socket.accessTokenValue}`);let o={method:`POST`,headers:a,body:JSON.stringify({messages:[{topic:this.subTopic,event:r,payload:i,private:this.private}]})};try{let e=await this._fetchWithTimeout(this.broadcastEndpointURL,o,t.timeout??this.timeout);return await e.body?.cancel(),e.ok?`ok`:`error`}catch(e){return e instanceof Error&&e.name===`AbortError`?`timed out`:`error`}}return new Promise(n=>{let r=this.channelAdapter.push(e.type,e,t.timeout||this.timeout);e.type===`broadcast`&&!this.params?.config?.broadcast?.ack&&n(`ok`),r.receive(`ok`,()=>n(`ok`)),r.receive(`error`,()=>n(`error`)),r.receive(`timeout`,()=>n(`timed out`))})}updateJoinPayload(e){this.channelAdapter.updateJoinPayload(e)}async unsubscribe(e=this.timeout){return new Promise(t=>{this.channelAdapter.unsubscribe(e).receive(`ok`,()=>t(`ok`)).receive(`timeout`,()=>t(`timed out`)).receive(`error`,()=>t(`error`))})}teardown(){this.channelAdapter.teardown()}async _fetchWithTimeout(e,t,n){let r=new AbortController,i=setTimeout(()=>r.abort(),n),a=await this.socket.fetch(e,Object.assign(Object.assign({},t),{signal:r.signal}));return clearTimeout(i),a}_on(t,n,r){let i=t.toLocaleLowerCase(),a=n?.filter;if((a instanceof mt||typeof a==`object`&&a&&typeof a.build==`function`)&&(n=Object.assign(Object.assign({},n),{filter:a.build()})),i===gt.POSTGRES_CHANGES&&this.bindings[i]?.find(t=>e.isSamePostgresFilter(t.filter,n)))return this.socket.log(`error`,`duplicate \`postgres_changes\` binding for ${this.topic} ignored`,n),this;let o=this.channelAdapter.on(t,r),s={type:i,filter:n,callback:r,ref:o};return this.bindings[i]?this.bindings[i].push(s):this.bindings[i]=[s],this._updateFilterMessage(),this}_onClose(e){this.channelAdapter.onClose(e)}_onError(e){this.channelAdapter.onError(e)}_updateFilterMessage(){this.channelAdapter.updateFilterBindings((e,t,n)=>{let r=e.event.toLocaleLowerCase();if(this._notThisChannelEvent(r,n))return!1;let i=this.bindings[r]?.find(t=>t.ref===e.ref);if(!i)return!0;if([`broadcast`,`presence`,`postgres_changes`].includes(r)){if(`id`in i){let e=i.id,n=i.filter?.event;return e&&t.ids?.includes(e)&&(n===`*`||n?.toLocaleLowerCase()===t.data?.type.toLocaleLowerCase())}{let e=(i?.filter?.event)?.toLocaleLowerCase();return e===`*`||e===(t?.event)?.toLocaleLowerCase()}}return i.type.toLocaleLowerCase()===r})}_notThisChannelEvent(e,t){let{close:n,error:r,leave:i,join:a}=_e;return t&&[n,r,i,a].includes(e)&&t!==this.joinPush.ref}_updateFilterTransform(){this.channelAdapter.updatePayloadTransform((e,t,n)=>{if(typeof t==`object`&&`ids`in t){let e=t.data,{schema:n,table:r,commit_timestamp:i,type:a,errors:o}=e;return Object.assign(Object.assign({},{schema:n,table:r,commit_timestamp:i,eventType:a,new:{},old:{},errors:o}),this._getPayloadRecords(e))}return t})}copyBindings(e){if(this.joinedOnce)throw Error(`cannot copy bindings into joined channel`);for(let t in e.bindings)for(let n of e.bindings[t])this._on(n.type,n.filter,n.callback)}static isFilterValueEqual(e,t){return(e??void 0)===(t??void 0)}static isSamePostgresFilter(t,n){let r=(t?.select)?.join()??void 0,i=(n?.select)?.join()??void 0;return t?.event===n?.event&&e.isFilterValueEqual(t?.schema,n?.schema)&&e.isFilterValueEqual(t?.table,n?.table)&&e.isFilterValueEqual(t?.filter,n?.filter)&&r===i}_getPayloadRecords(e){let t={new:{},old:{}};return(e.type===`INSERT`||e.type===`UPDATE`)&&(t.new=be(e.columns,e.record)),(e.type===`UPDATE`||e.type===`DELETE`)&&(t.old=be(e.columns,e.old_record)),t}},yt=class{constructor(e,t){this.socket=new Ze(e,t)}get timeout(){return this.socket.timeout}get endPoint(){return this.socket.endPoint}get transport(){return this.socket.transport}get heartbeatIntervalMs(){return this.socket.heartbeatIntervalMs}get heartbeatCallback(){return this.socket.heartbeatCallback}set heartbeatCallback(e){this.socket.heartbeatCallback=e}get heartbeatTimer(){return this.socket.heartbeatTimer}get pendingHeartbeatRef(){return this.socket.pendingHeartbeatRef}get reconnectTimer(){return this.socket.reconnectTimer}get vsn(){return this.socket.vsn}get encode(){return this.socket.encode}get decode(){return this.socket.decode}get reconnectAfterMs(){return this.socket.reconnectAfterMs}get sendBuffer(){return this.socket.sendBuffer}get stateChangeCallbacks(){return this.socket.stateChangeCallbacks}connect(){this.socket.connect()}disconnect(e,t,n,r=1e4){return new Promise(i=>{setTimeout(()=>i(`timeout`),r),this.socket.disconnect(()=>{e(),i(`ok`)},t,n)})}push(e){this.socket.push(e)}log(e,t,n){this.socket.log(e,t,n)}hasLogger(){return this.socket.hasLogger()}makeRef(){return this.socket.makeRef()}onOpen(e){this.socket.onOpen(e)}onClose(e){this.socket.onClose(e)}onError(e){this.socket.onError(e)}onMessage(e){this.socket.onMessage(e)}isConnected(){return this.socket.isConnected()}isConnecting(){return this.socket.connectionState()==ve.connecting}isDisconnecting(){return this.socket.connectionState()==ve.closing}connectionState(){return this.socket.connectionState()}endPointURL(){return this.socket.endPointURL()}sendHeartbeat(){this.socket.sendHeartbeat()}getSocket(){return this.socket}},bt={HEARTBEAT_INTERVAL:25e3,RECONNECT_DELAY:10,HEARTBEAT_TIMEOUT_FALLBACK:100},xt=[1e3,2e3,5e3,1e4],St=1e4;function Ct(){let e=new Map;return{get length(){return e.size},clear(){e.clear()},getItem(t){return e.has(t)?e.get(t):null},key(t){return Array.from(e.keys())[t]??null},removeItem(t){e.delete(t)},setItem(t,n){e.set(t,String(n))}}}function wt(){try{if(typeof globalThis<`u`&&globalThis.sessionStorage)return globalThis.sessionStorage}catch{}return Ct()}var Tt=`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`,Et=class{get endPoint(){return this.socketAdapter.endPoint}get timeout(){return this.socketAdapter.timeout}get transport(){return this.socketAdapter.transport}get heartbeatCallback(){return this.socketAdapter.heartbeatCallback}get heartbeatIntervalMs(){return this.socketAdapter.heartbeatIntervalMs}get heartbeatTimer(){return this.worker?this._workerHeartbeatTimer:this.socketAdapter.heartbeatTimer}get pendingHeartbeatRef(){return this.worker?this._pendingWorkerHeartbeatRef:this.socketAdapter.pendingHeartbeatRef}get reconnectTimer(){return this.socketAdapter.reconnectTimer}get vsn(){return this.socketAdapter.vsn}get encode(){return this.socketAdapter.encode}get decode(){return this.socketAdapter.decode}get reconnectAfterMs(){return this.socketAdapter.reconnectAfterMs}get sendBuffer(){return this.socketAdapter.sendBuffer}get stateChangeCallbacks(){return this.socketAdapter.stateChangeCallbacks}constructor(e,t){if(this.channels=[],this.accessTokenValue=null,this.accessToken=null,this.apiKey=null,this.httpEndpoint=``,this.headers={},this.params={},this.ref=0,this.serializer=new ye,this._manuallySetToken=!1,this._authPromise=null,this._authGeneration=0,this._workerHeartbeatTimer=void 0,this._pendingWorkerHeartbeatRef=null,this._pendingDisconnectTimer=null,this._disconnectOnEmptyChannelsAfterMs=0,this._resolveFetch=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),!t?.params?.apikey)throw Error(`API key is required to connect to Realtime`);this.apiKey=t.params.apikey;let n=this._initializeOptions(t);this.socketAdapter=new yt(e,n),this.httpEndpoint=ke(e),this.fetch=this._resolveFetch(t?.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||this.isConnected())){this.accessToken&&!this._authPromise&&this._setAuthSafely(`connect`),this._setupConnectionHandlers();try{this.socketAdapter.connect()}catch(e){let t=e.message;throw Error(`WebSocket not available: ${t}`)}this._handleNodeJsRaceCondition()}}endpointURL(){return this.socketAdapter.endPointURL()}async disconnect(e,t){return this._cancelPendingDisconnect(),this.isDisconnecting()?`ok`:await this.socketAdapter.disconnect(()=>{clearInterval(this._workerHeartbeatTimer),this._terminateWorker()},e,t)}getChannels(){return this.channels}async removeChannel(e){let t=await e.unsubscribe();return t===`ok`&&e.teardown(),t}async removeAllChannels(){let e=this.channels.map(async e=>{let t=await e.unsubscribe();return e.teardown(),t}),t=await Promise.all(e);return await this.disconnect(),t}log(e,t,n){this.socketAdapter.log(e,t,n)}hasLogger(){return this.socketAdapter.hasLogger()}connectionState(){return this.socketAdapter.connectionState()||ve.closed}isConnected(){return this.socketAdapter.isConnected()}isConnecting(){return this.socketAdapter.isConnecting()}isDisconnecting(){return this.socketAdapter.isDisconnecting()}channel(e,t={config:{}}){let n=`realtime:${e}`,r=this.getChannels().find(e=>e.topic===n);if(r)return r;{let n=new vt(`realtime:${e}`,t,this);return this._cancelPendingDisconnect(),this.channels.push(n),n}}push(e){this.socketAdapter.push(e)}async setAuth(e=null){let t=++this._authGeneration,n=this._performAuth(e,t);t===this._authGeneration&&(this._authPromise=n);try{await n}finally{this._authPromise===n&&(this._authPromise=null)}}_isManualToken(){return this._manuallySetToken}async sendHeartbeat(){this.socketAdapter.sendHeartbeat()}onHeartbeat(e){this.socketAdapter.heartbeatCallback=this._wrapHeartbeatCallback(e)}_makeRef(){return this.socketAdapter.makeRef()}_remove(e){this.channels=this.channels.filter(t=>t.topic!==e.topic),this.channels.length===0&&(this.log(`transport`,`no channels remaining, scheduling disconnect`),this._schedulePendingDisconnect())}_schedulePendingDisconnect(){this._cancelPendingDisconnect(),this._disconnectOnEmptyChannelsAfterMs===0?(this.log(`transport`,`disconnecting immediately - no channels`),this.disconnect()):(this._pendingDisconnectTimer=setTimeout(()=>{this._pendingDisconnectTimer=null,this.channels.length===0&&(this.log(`transport`,`deferred disconnect fired - no channels, disconnecting`),this.disconnect())},this._disconnectOnEmptyChannelsAfterMs),this.log(`transport`,`deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`))}_cancelPendingDisconnect(){this._pendingDisconnectTimer!==null&&(this.log(`transport`,`pending disconnect cancelled - channel activity detected`),clearTimeout(this._pendingDisconnectTimer),this._pendingDisconnectTimer=null)}async _performAuth(e,t){let n,r=!1;if(e)n=e,r=!0;else if(this.accessToken)try{n=await this.accessToken()}catch(e){this.log(`error`,`Error fetching access token from callback`,e),n=this.accessTokenValue}else n=this.accessTokenValue;t===this._authGeneration&&(this.accessToken?this._manuallySetToken=!1:r&&(this._manuallySetToken=!0),this.accessTokenValue!=n&&(this.accessTokenValue=n,this.channels.forEach(e=>{let t={access_token:n,version:le};e.updateJoinPayload(t),e.joinedOnce&&e.channelAdapter.isJoined()&&e.channelAdapter.push(_e.access_token,{access_token:n})})))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(e=`general`){this._isManualToken()||this.setAuth().catch(t=>{this.log(`error`,`Error setting auth in ${e}`,t)})}_setupConnectionHandlers(){this.socketAdapter.onOpen(()=>{(this._authPromise||(this.accessToken&&!this.accessTokenValue?this.setAuth():Promise.resolve())).catch(e=>{this.log(`error`,`error waiting for auth on connect`,e)}),this.worker&&!this.workerRef&&this._startWorkerHeartbeat()}),this.socketAdapter.onClose(()=>{this.worker&&this.workerRef&&this._terminateWorker()}),this.socketAdapter.onMessage(e=>{e.ref&&e.ref===this._pendingWorkerHeartbeatRef&&(this._pendingWorkerHeartbeatRef=null)})}_handleNodeJsRaceCondition(){this.socketAdapter.isConnected()&&this.socketAdapter.getSocket().onConnOpen()}_wrapHeartbeatCallback(e){return(t,n)=>{t!==`disconnected`&&(t==`sent`&&this._setAuthSafely(),e&&e(t,n))}}_startWorkerHeartbeat(){this.workerUrl?this.log(`worker`,`starting worker for from ${this.workerUrl}`):this.log(`worker`,`starting default worker`);let e=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(e),this.workerRef.onerror=e=>{this.log(`worker`,`worker error`,e.message),this._terminateWorker(),this.disconnect()},this.workerRef.onmessage=e=>{e.data.event===`keepAlive`&&this.sendHeartbeat()},this.workerRef.postMessage({event:`start`,interval:this.heartbeatIntervalMs})}_terminateWorker(){this.workerRef&&=(this.log(`worker`,`terminating worker`),this.workerRef.terminate(),void 0)}_workerObjectUrl(e){let t;if(e)t=e;else{let e=new Blob([Tt],{type:`application/javascript`});t=URL.createObjectURL(e)}return t}_initializeOptions(e){this.worker=e?.worker??!1,this.accessToken=e?.accessToken??null;let t={};t.timeout=e?.timeout??pe,t.heartbeatIntervalMs=e?.heartbeatIntervalMs??bt.HEARTBEAT_INTERVAL,this._disconnectOnEmptyChannelsAfterMs=e?.disconnectOnEmptyChannelsAfterMs??2*(e?.heartbeatIntervalMs??bt.HEARTBEAT_INTERVAL),t.transport=e?.transport??ce.getWebSocketConstructor(),t.params=e?.params,t.logger=e?.logger,t.heartbeatCallback=this._wrapHeartbeatCallback(e?.heartbeatCallback),t.sessionStorage=e?.sessionStorage??wt(),t.reconnectAfterMs=e?.reconnectAfterMs??(e=>xt[e-1]||St);let n,r,i=e?.vsn??fe;switch(i){case ue:n=(e,t)=>t(JSON.stringify(e)),r=(e,t)=>t(JSON.parse(e));break;case de:n=this.serializer.encode.bind(this.serializer),r=this.serializer.decode.bind(this.serializer);break;default:throw Error(`Unsupported serializer version: ${t.vsn}`)}if(t.vsn=i,t.encode=e?.encode??n,t.decode=e?.decode??r,t.beforeReconnect=this._reconnectAuth.bind(this),(e?.logLevel||e?.log_level)&&(this.logLevel=e.logLevel||e.log_level,t.params=Object.assign(Object.assign({},t.params),{log_level:this.logLevel})),this.worker){if(typeof window<`u`&&!window.Worker)throw Error(`Web Worker is not supported`);this.workerUrl=e?.workerUrl,t.autoSendHeartbeat=!this.worker}return t}async _reconnectAuth(){await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()}},Dt=class extends Error{constructor(e,t){super(e),this.name=`IcebergError`,this.status=t.status,this.icebergType=t.icebergType,this.icebergCode=t.icebergCode,this.details=t.details,this.isCommitStateUnknown=t.icebergType===`CommitStateUnknownException`||[500,502,504].includes(t.status)&&t.icebergType?.includes(`CommitState`)===!0}isNotFound(){return this.status===404}isConflict(){return this.status===409}isAuthenticationTimeout(){return this.status===419}};function Ot(e,t,n){let r=new URL(t,e);if(n)for(let[e,t]of Object.entries(n))t!==void 0&&r.searchParams.set(e,t);return r.toString()}async function kt(e){return!e||e.type===`none`?{}:e.type===`bearer`?{Authorization:`Bearer ${e.token}`}:e.type===`header`?{[e.name]:e.value}:e.type===`custom`?await e.getHeaders():{}}function At(e){let t=e.fetchImpl??globalThis.fetch;return{async request({method:n,path:r,query:i,body:a,headers:o}){let s=Ot(e.baseUrl,r,i),c=await kt(e.auth),l=await t(s,{method:n,headers:{...a?{"Content-Type":`application/json`}:{},...c,...o},body:a?JSON.stringify(a):void 0}),u=await l.text(),d=(l.headers.get(`content-type`)||``).includes(`application/json`),f=d&&u?JSON.parse(u):u;if(!l.ok){let e=d?f:void 0,t=e?.error;throw new Dt(t?.message??`Request failed with status ${l.status}`,{status:l.status,icebergType:t?.type,icebergCode:t?.code,details:e})}return{status:l.status,headers:l.headers,data:f}}}}function jt(e){return e.join(``)}var Mt=class{constructor(e,t=``){this.client=e,this.prefix=t}async listNamespaces(e){let t=e?{parent:jt(e.namespace)}:void 0;return(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces`,query:t})).data.namespaces.map(e=>({namespace:e}))}async createNamespace(e,t){let n={namespace:e.namespace,properties:t?.properties};return(await this.client.request({method:`POST`,path:`${this.prefix}/namespaces`,body:n})).data}async dropNamespace(e){await this.client.request({method:`DELETE`,path:`${this.prefix}/namespaces/${jt(e.namespace)}`})}async loadNamespaceMetadata(e){return{properties:(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${jt(e.namespace)}`})).data.properties}}async namespaceExists(e){try{return await this.client.request({method:`HEAD`,path:`${this.prefix}/namespaces/${jt(e.namespace)}`}),!0}catch(e){if(e instanceof Dt&&e.status===404)return!1;throw e}}async createNamespaceIfNotExists(e,t){try{return await this.createNamespace(e,t)}catch(e){if(e instanceof Dt&&e.status===409)return;throw e}}};function Nt(e){return e.join(``)}var Pt=class{constructor(e,t=``,n){this.client=e,this.prefix=t,this.accessDelegation=n}async listTables(e){return(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${Nt(e.namespace)}/tables`})).data.identifiers}async createTable(e,t){let n={};return this.accessDelegation&&(n[`X-Iceberg-Access-Delegation`]=this.accessDelegation),(await this.client.request({method:`POST`,path:`${this.prefix}/namespaces/${Nt(e.namespace)}/tables`,body:t,headers:n})).data.metadata}async updateTable(e,t){let n=await this.client.request({method:`POST`,path:`${this.prefix}/namespaces/${Nt(e.namespace)}/tables/${e.name}`,body:t});return{"metadata-location":n.data[`metadata-location`],metadata:n.data.metadata}}async dropTable(e,t){await this.client.request({method:`DELETE`,path:`${this.prefix}/namespaces/${Nt(e.namespace)}/tables/${e.name}`,query:{purgeRequested:String(t?.purge??!1)}})}async loadTable(e){let t={};return this.accessDelegation&&(t[`X-Iceberg-Access-Delegation`]=this.accessDelegation),(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${Nt(e.namespace)}/tables/${e.name}`,headers:t})).data.metadata}async tableExists(e){let t={};this.accessDelegation&&(t[`X-Iceberg-Access-Delegation`]=this.accessDelegation);try{return await this.client.request({method:`HEAD`,path:`${this.prefix}/namespaces/${Nt(e.namespace)}/tables/${e.name}`,headers:t}),!0}catch(e){if(e instanceof Dt&&e.status===404)return!1;throw e}}async createTableIfNotExists(e,t){try{return await this.createTable(e,t)}catch(n){if(n instanceof Dt&&n.status===409)return await this.loadTable({namespace:e.namespace,name:t.name});throw n}}},Ft=class{constructor(e){let t=`v1`;e.catalogName&&(t+=`/${e.catalogName}`);let n=e.baseUrl.endsWith(`/`)?e.baseUrl:`${e.baseUrl}/`;this.client=At({baseUrl:n,auth:e.auth,fetchImpl:e.fetch}),this.accessDelegation=e.accessDelegation?.join(`,`),this.namespaceOps=new Mt(this.client,t),this.tableOps=new Pt(this.client,t,this.accessDelegation)}async listNamespaces(e){return this.namespaceOps.listNamespaces(e)}async createNamespace(e,t){return this.namespaceOps.createNamespace(e,t)}async dropNamespace(e){await this.namespaceOps.dropNamespace(e)}async loadNamespaceMetadata(e){return this.namespaceOps.loadNamespaceMetadata(e)}async listTables(e){return this.tableOps.listTables(e)}async createTable(e,t){return this.tableOps.createTable(e,t)}async updateTable(e,t){return this.tableOps.updateTable(e,t)}async dropTable(e,t){await this.tableOps.dropTable(e,t)}async loadTable(e){return this.tableOps.loadTable(e)}async namespaceExists(e){return this.namespaceOps.namespaceExists(e)}async tableExists(e){return this.tableOps.tableExists(e)}async createNamespaceIfNotExists(e,t){return this.namespaceOps.createNamespaceIfNotExists(e,t)}async createTableIfNotExists(e,t){return this.tableOps.createTableIfNotExists(e,t)}};function It(e){"@babel/helpers - typeof";return It=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},It(e)}function Lt(e,t){if(It(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(It(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function Rt(e){var t=Lt(e,`string`);return It(t)==`symbol`?t:t+``}function zt(e,t,n){return(t=Rt(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Bt(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function D(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Bt(Object(n),!0).forEach(function(t){zt(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Bt(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var Vt=class extends Error{constructor(e,t=`storage`,n,r){super(e),this.__isStorageError=!0,this.namespace=t,this.name=t===`vectors`?`StorageVectorsError`:`StorageError`,this.status=n,this.statusCode=r}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}};function Ht(e){return typeof e==`object`&&!!e&&`__isStorageError`in e}var Ut=class extends Vt{constructor(e,t,n,r=`storage`,i){super(e,r,t,n),this.name=r===`vectors`?`StorageVectorsApiError`:`StorageApiError`,this.status=t,this.statusCode=n,this.code=i}toJSON(){return D(D({},super.toJSON()),{},{code:this.code})}},Wt=class extends Vt{constructor(e,t,n=`storage`){super(e,n),this.name=n===`vectors`?`StorageVectorsUnknownError`:`StorageUnknownError`,this.originalError=t}};function Gt(e,t,n){let r=D({},e),i=t.toLowerCase();for(let e of Object.keys(r))e.toLowerCase()===i&&delete r[e];return r[i]=n,r}function Kt(e){let t={};for(let[n,r]of Object.entries(e))t[n.toLowerCase()]=r;return t}var qt=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),Jt=e=>{if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)},Yt=e=>{if(Array.isArray(e))return e.map(e=>Yt(e));if(typeof e==`function`||e!==Object(e))return e;let t={};return Object.entries(e).forEach(([e,n])=>{let r=e.replace(/([-_][a-z])/gi,e=>e.toUpperCase().replace(/[-_]/g,``));t[r]=Yt(n)}),t},Xt=e=>!e||typeof e!=`string`||e.length===0||e.length>100||e.trim()!==e||e.includes(`/`)||e.includes(`\\`)?!1:/^[\w!.\*'() &$@=;:+,?-]+$/.test(e),Zt=e=>e.split(`/`).map(encodeURIComponent).join(`/`),Qt=e=>{if(typeof e==`object`&&e){let t=e;if(typeof t.msg==`string`)return t.msg;if(typeof t.message==`string`)return t.message;if(typeof t.error_description==`string`)return t.error_description;if(typeof t.error==`string`)return t.error;if(typeof t.error==`object`&&t.error!==null){let e=t.error;if(typeof e.message==`string`)return e.message}}return JSON.stringify(e)},$t=async(e,t,n,r)=>{if(typeof e==`object`&&e&&`json`in e&&typeof e.json==`function`){let n=e,i=parseInt(String(n.status),10);Number.isFinite(i)||(i=500),n.json().then(e=>{let n=e?.statusCode||e?.code||i+``;t(new Ut(Qt(e),i,n,r,e?.code))}).catch(()=>{let e=i+``;t(new Ut(n.statusText||`HTTP ${i} error`,i,e,r))})}else t(new Wt(Qt(e),e,r))},en=(e,t,n,r)=>{let i={method:e,headers:t?.headers||{}};if(e===`GET`||e===`HEAD`||!r)return D(D({},i),n);if(Jt(r)){let e=t?.headers||{},n;for(let[t,r]of Object.entries(e))t.toLowerCase()===`content-type`&&(n=r);i.headers=Gt(e,`Content-Type`,n??`application/json`),i.body=JSON.stringify(r)}else i.body=r;return t?.duplex&&(i.duplex=t.duplex),D(D({},i),n)};async function tn(e,t,n,r,i,a,o){return new Promise((s,c)=>{e(n,en(t,r,i,a)).then(e=>{if(!e.ok)throw e;if(r?.noResolveJson)return e;if(o===`vectors`){let t=e.headers.get(`content-type`);if(e.headers.get(`content-length`)===`0`||e.status===204||!t||!t.includes(`application/json`))return{}}return e.json()}).then(e=>s(e)).catch(e=>$t(e,c,r,o))})}function nn(e=`storage`){return{get:async(t,n,r,i)=>tn(t,`GET`,n,r,i,void 0,e),post:async(t,n,r,i,a)=>tn(t,`POST`,n,i,a,r,e),put:async(t,n,r,i,a)=>tn(t,`PUT`,n,i,a,r,e),head:async(t,n,r,i)=>tn(t,`HEAD`,n,D(D({},r),{},{noResolveJson:!0}),i,void 0,e),remove:async(t,n,r,i,a)=>tn(t,`DELETE`,n,i,a,r,e)}}var{get:rn,post:O,put:an,head:on,remove:sn}=nn(`storage`),k=nn(`vectors`),cn=class{constructor(e,t={},n,r=`storage`){this.shouldThrowOnError=!1,this.url=e,this.headers=Kt(t),this.fetch=qt(n),this.namespace=r}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(e,t){return this.headers=Gt(this.headers,e,t),this}async handleOperation(e){var t=this;try{return{data:await e(),error:null}}catch(e){if(t.shouldThrowOnError)throw e;if(Ht(e))return{data:null,error:e};throw e}}},ln=Symbol.toStringTag,un=class{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t,this[ln]=`StreamDownloadBuilder`,this.promise=null}then(e,t){return this.getPromise().then(e,t)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||=this.execute(),this.promise}async execute(){var e=this;try{return{data:(await e.downloadFn()).body,error:null}}catch(t){if(e.shouldThrowOnError)throw t;if(Ht(t))return{data:null,error:t};throw t}}},dn=Symbol.toStringTag,fn=class{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t,this[dn]=`BlobDownloadBuilder`,this.promise=null}asStream(){return new un(this.downloadFn,this.shouldThrowOnError)}then(e,t){return this.getPromise().then(e,t)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||=this.execute(),this.promise}async execute(){var e=this;try{return{data:await(await e.downloadFn()).blob(),error:null}}catch(t){if(e.shouldThrowOnError)throw t;if(Ht(t))return{data:null,error:t};throw t}}},pn={limit:100,offset:0,sortBy:{column:`name`,order:`asc`}},mn={cacheControl:`3600`,contentType:`text/plain;charset=UTF-8`,upsert:!1},hn=class extends cn{constructor(e,t={},n,r){super(e,t,r,`storage`),this.bucketId=n}async uploadOrUpdate(e,t,n,r){var i=this;return i.handleOperation(async()=>{let a,o=D(D({},mn),r),s=D(D({},i.headers),e===`POST`&&{"x-upsert":String(o.upsert)}),c=o.metadata;if(typeof Blob<`u`&&n instanceof Blob||typeof FormData<`u`&&n instanceof FormData?a=i.prepareUploadFormData(n,o):(a=n,s[`cache-control`]=`max-age=${o.cacheControl}`,s[`content-type`]=o.contentType,o.contentEncoding&&(s[`content-encoding`]=o.contentEncoding),c&&(s[`x-metadata`]=i.toBase64(i.encodeMetadata(c))),(typeof ReadableStream<`u`&&a instanceof ReadableStream||a&&typeof a==`object`&&`pipe`in a&&typeof a.pipe==`function`)&&!o.duplex&&(o.duplex=`half`)),r?.headers)for(let[e,t]of Object.entries(r.headers))s=Gt(s,e,t);let l=i._removeEmptyFolders(t),u=i._getFinalPath(l),d=await(e==`PUT`?an:O)(i.fetch,`${i.url}/object/${u}`,a,D({headers:s},o?.duplex?{duplex:o.duplex}:{}));return{path:l,id:d.Id,fullPath:d.Key}})}async upload(e,t,n){return this.uploadOrUpdate(`POST`,e,t,n)}async uploadToSignedUrl(e,t,n,r){var i=this;let a=i._removeEmptyFolders(e),o=i._getFinalPath(a),s=new URL(i.url+`/object/upload/sign/${o}`);return s.searchParams.set(`token`,t),i.handleOperation(async()=>{let e,t=D(D({},mn),r),o=D(D({},i.headers),{"x-upsert":String(t.upsert)}),c=t.metadata;if(typeof Blob<`u`&&n instanceof Blob||typeof FormData<`u`&&n instanceof FormData?e=i.prepareUploadFormData(n,t):(e=n,o[`cache-control`]=`max-age=${t.cacheControl}`,o[`content-type`]=t.contentType,t.contentEncoding&&(o[`content-encoding`]=t.contentEncoding),c&&(o[`x-metadata`]=i.toBase64(i.encodeMetadata(c))),(typeof ReadableStream<`u`&&e instanceof ReadableStream||e&&typeof e==`object`&&`pipe`in e&&typeof e.pipe==`function`)&&!t.duplex&&(t.duplex=`half`)),r?.headers)for(let[e,t]of Object.entries(r.headers))o=Gt(o,e,t);return{path:a,fullPath:(await an(i.fetch,s.toString(),e,D({headers:o},t?.duplex?{duplex:t.duplex}:{}))).Key}})}async createSignedUploadUrl(e,t){var n=this;return n.handleOperation(async()=>{let r=n._getFinalPath(e),i=D({},n.headers);t?.upsert&&(i[`x-upsert`]=`true`);let a=await O(n.fetch,`${n.url}/object/upload/sign/${r}`,{},{headers:i}),o=new URL(n.url+a.url),s=o.searchParams.get(`token`);if(!s)throw new Vt(`No token returned by API`);return{signedUrl:o.toString(),path:e,token:s}})}async update(e,t,n){return this.uploadOrUpdate(`PUT`,e,t,n)}async move(e,t,n){var r=this;return r.handleOperation(async()=>await O(r.fetch,`${r.url}/object/move`,{bucketId:r.bucketId,sourceKey:e,destinationKey:t,destinationBucket:n?.destinationBucket,sourceVersionId:n?.sourceVersionId},{headers:r.headers}))}async copy(e,t,n){var r=this;return r.handleOperation(async()=>{let i=n;return{path:(await O(r.fetch,`${r.url}/object/copy`,{bucketId:r.bucketId,sourceKey:e,destinationKey:t,destinationBucket:n?.destinationBucket,sourceVersionId:n?.sourceVersionId,copyMetadata:typeof i?.copyMetadata==`boolean`?i.copyMetadata:void 0,metadata:i?.copyMetadata===!1?i.metadata:void 0},{headers:r.headers})).Key}})}async createSignedUrl(e,t,n){var r=this;return r.handleOperation(async()=>{let i=r._getFinalPath(e),a=typeof n?.transform==`object`&&n.transform!==null&&Object.keys(n.transform).length>0,o=await O(r.fetch,`${r.url}/object/sign/${i}`,D(D({expiresIn:t},a?{transform:n.transform}:{}),n?.versionId==null?{}:{versionId:n.versionId}),{headers:r.headers}),s=new URLSearchParams;n?.download&&s.set(`download`,n.download===!0?``:n.download),n?.cacheNonce!=null&&s.set(`cacheNonce`,String(n.cacheNonce));let c=s.toString();return{signedUrl:encodeURI(`${r.url}${o.signedURL}${c?`&${c}`:``}`)}})}async createSignedUrls(e,t,n){var r=this;return r.handleOperation(async()=>{let i=await O(r.fetch,`${r.url}/object/sign/${r.bucketId}`,{expiresIn:t,paths:e},{headers:r.headers}),a=new URLSearchParams;n?.download&&a.set(`download`,n.download===!0?``:n.download),n?.cacheNonce!=null&&a.set(`cacheNonce`,String(n.cacheNonce));let o=a.toString();return i.map(e=>D(D({},e),{},{signedUrl:e.signedURL?encodeURI(`${r.url}${e.signedURL}${o?`&${o}`:``}`):null}))})}download(e,t,n){let r=typeof t?.transform==`object`&&t.transform!==null&&Object.keys(t.transform).length>0?`render/image/authenticated`:`object`,i=new URLSearchParams;t?.transform&&this.applyTransformOptsToQuery(i,t.transform),t?.cacheNonce!=null&&i.set(`cacheNonce`,String(t.cacheNonce)),t?.versionId!=null&&i.set(`versionId`,String(t.versionId));let a=i.toString(),o=this._getFinalPath(e);return new fn(()=>rn(this.fetch,`${this.url}/${r}/${o}${a?`?${a}`:``}`,{headers:this.headers,noResolveJson:!0},n),this.shouldThrowOnError)}async info(e,t){var n=this;let r=n._getFinalPath(e),i=new URLSearchParams;t?.versionId!=null&&i.set(`versionId`,String(t.versionId));let a=i.toString();return n.handleOperation(async()=>Yt(await rn(n.fetch,`${n.url}/object/info/${r}${a?`?${a}`:``}`,{headers:n.headers})))}async exists(e){var t=this;let n=t._getFinalPath(e);try{return await on(t.fetch,`${t.url}/object/${n}`,{headers:t.headers}),{data:!0,error:null}}catch(e){if(t.shouldThrowOnError)throw e;if(Ht(e)){let t=e instanceof Ut?e.status:e instanceof Wt?e.originalError?.status:void 0;if(t!==void 0&&[400,404].includes(t))return{data:!1,error:e}}throw e}}getPublicUrl(e,t){let n=this._getFinalPath(e),r=new URLSearchParams;t?.download&&r.set(`download`,t.download===!0?``:t.download),t?.transform&&this.applyTransformOptsToQuery(r,t.transform),t?.cacheNonce!=null&&r.set(`cacheNonce`,String(t.cacheNonce)),t?.versionId!=null&&r.set(`versionId`,String(t.versionId));let i=r.toString(),a=typeof t?.transform==`object`&&t.transform!==null&&Object.keys(t.transform).length>0?`render/image`:`object`;return{data:{publicUrl:encodeURI(`${this.url}/${a}/public/${n}`)+(i?`?${i}`:``)}}}async remove(e){var t=this;return t.handleOperation(async()=>await sn(t.fetch,`${t.url}/object/${t.bucketId}`,{prefixes:e},{headers:t.headers}))}async purgeCache(e,t,n){var r=this;return r.handleOperation(async()=>{let i=Zt(r._getFinalPath(e)),a=new URLSearchParams;t?.transformations&&a.set(`transformations`,`true`);let o=a.toString();return await sn(r.fetch,`${r.url}/cdn/${i}${o?`?${o}`:``}`,{},{headers:r.headers},n)})}async list(e,t,n){var r=this;return r.handleOperation(async()=>{let i=t?.sortBy?D(D({},pn.sortBy),t.sortBy):pn.sortBy,a=D(D(D({},pn),t),{},{sortBy:i,prefix:e||``});return await O(r.fetch,`${r.url}/object/list/${r.bucketId}`,a,{headers:r.headers},n)})}async listV2(e,t){var n=this;return n.handleOperation(async()=>{let r=D({},e);return await O(n.fetch,`${n.url}/object/list-v2/${n.bucketId}`,r,{headers:n.headers},t)})}prepareUploadFormData(e,t){let n=new FormData,r=[];e instanceof FormData?e.forEach((e,t)=>{typeof e==`string`?n.append(t,e):r.push([t,e])}):r.push([``,e]),n.has(`cacheControl`)||n.append(`cacheControl`,t.cacheControl),t.metadata&&!n.has(`metadata`)&&n.append(`metadata`,this.encodeMetadata(t.metadata)),t.contentEncoding&&!n.has(`contentEncoding`)&&n.append(`contentEncoding`,t.contentEncoding);for(let[e,t]of r)n.append(e,t);return n}encodeMetadata(e){return JSON.stringify(e)}toBase64(e){return typeof Buffer<`u`?Buffer.from(e).toString(`base64`):btoa(e)}_getFinalPath(e){return`${this.bucketId}/${e.replace(/^\/+/,``)}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,``).replace(/\/+/g,`/`)}applyTransformOptsToQuery(e,t){return t.width&&e.set(`width`,t.width.toString()),t.height&&e.set(`height`,t.height.toString()),t.resize&&e.set(`resize`,t.resize),t.format&&e.set(`format`,t.format),t.quality&&e.set(`quality`,t.quality.toString()),e}},gn={"X-Client-Info":`storage-js/2.118.0`},_n=class extends cn{constructor(e,t={},n,r){let i=new URL(e);r?.useNewHostname&&/supabase\.(co|in|red)$/.test(i.hostname)&&!i.hostname.includes(`storage.supabase.`)&&(i.hostname=i.hostname.replace(`supabase.`,`storage.supabase.`));let a=i.href.replace(/\/$/,``),o=D(D({},gn),t);super(a,o,n,`storage`)}async listBuckets(e){var t=this;return t.handleOperation(async()=>{let n=t.listBucketOptionsToQueryString(e);return await rn(t.fetch,`${t.url}/bucket${n}`,{headers:t.headers})})}async getBucket(e){var t=this;return t.handleOperation(async()=>await rn(t.fetch,`${t.url}/bucket/${e}`,{headers:t.headers}))}async createBucket(e,t={public:!1}){var n=this;return n.handleOperation(async()=>await O(n.fetch,`${n.url}/bucket`,{id:e,name:e,type:t.type,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes,versioning_status:t.versioningStatus},{headers:n.headers}))}async updateBucket(e,t){var n=this;return n.handleOperation(async()=>await an(n.fetch,`${n.url}/bucket/${e}`,{id:e,name:e,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes,versioning_status:t.versioningStatus},{headers:n.headers}))}async emptyBucket(e){var t=this;return t.handleOperation(async()=>await O(t.fetch,`${t.url}/bucket/${e}/empty`,{},{headers:t.headers}))}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await sn(t.fetch,`${t.url}/bucket/${e}`,{},{headers:t.headers}))}async getBucketLifecycle(e){var t=this;return t.handleOperation(async()=>await rn(t.fetch,t.bucketLifecycleUrl(e),{headers:t.headers}))}async updateBucketLifecycle(e,t){var n=this;return n.handleOperation(async()=>await an(n.fetch,n.bucketLifecycleUrl(e),t,{headers:n.headers}))}async deleteBucketLifecycle(e){var t=this;return t.handleOperation(async()=>await sn(t.fetch,t.bucketLifecycleUrl(e),{},{headers:t.headers}))}async purgeBucketCache(e,t,n){var r=this;return r.handleOperation(async()=>{let i=new URLSearchParams;t?.transformations&&i.set(`transformations`,`true`);let a=i.toString();return await sn(r.fetch,`${r.url}/cdn/${Zt(e)}${a?`?${a}`:``}`,{},{headers:r.headers},n)})}bucketLifecycleUrl(e){return`${this.url}/bucket/${Zt(e)}/lifecycle`}listBucketOptionsToQueryString(e){let t={};return e&&(`limit`in e&&(t.limit=String(e.limit)),`offset`in e&&(t.offset=String(e.offset)),e.search&&(t.search=e.search),e.sortColumn&&(t.sortColumn=e.sortColumn),e.sortOrder&&(t.sortOrder=e.sortOrder)),Object.keys(t).length>0?`?`+new URLSearchParams(t).toString():``}},vn=class extends cn{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=D(D({},gn),t);super(r,i,n,`storage`)}async createBucket(e){var t=this;return t.handleOperation(async()=>await O(t.fetch,`${t.url}/bucket`,{name:e},{headers:t.headers}))}async listBuckets(e){var t=this;return t.handleOperation(async()=>{let n=new URLSearchParams;e?.limit!==void 0&&n.set(`limit`,e.limit.toString()),e?.offset!==void 0&&n.set(`offset`,e.offset.toString()),e?.sortColumn&&n.set(`sortColumn`,e.sortColumn),e?.sortOrder&&n.set(`sortOrder`,e.sortOrder),e?.search&&n.set(`search`,e.search);let r=n.toString(),i=r?`${t.url}/bucket?${r}`:`${t.url}/bucket`;return await rn(t.fetch,i,{headers:t.headers})})}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await sn(t.fetch,`${t.url}/bucket/${e}`,{},{headers:t.headers}))}from(e){var t=this;if(!Xt(e))throw new Vt(`Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.`);let n=new Ft({baseUrl:this.url,catalogName:e,auth:{type:`custom`,getHeaders:async()=>t.headers},fetch:this.fetch}),r=this.shouldThrowOnError;return new Proxy(n,{get(e,t){let n=e[t];return typeof n==`function`?async(...t)=>{try{return{data:await n.apply(e,t),error:null}}catch(e){if(r)throw e;return{data:null,error:e}}}:n}})}},yn=class extends cn{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=D(D({},gn),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async createIndex(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/CreateIndex`,e,{headers:t.headers})||{})}async getIndex(e,t){var n=this;return n.handleOperation(async()=>await k.post(n.fetch,`${n.url}/GetIndex`,{vectorBucketName:e,indexName:t},{headers:n.headers}))}async listIndexes(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/ListIndexes`,e,{headers:t.headers}))}async deleteIndex(e,t){var n=this;return n.handleOperation(async()=>await k.post(n.fetch,`${n.url}/DeleteIndex`,{vectorBucketName:e,indexName:t},{headers:n.headers})||{})}},bn=class extends cn{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=D(D({},gn),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async putVectors(e){var t=this;if(e.vectors.length<1||e.vectors.length>500)throw Error(`Vector batch size must be between 1 and 500 items`);return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/PutVectors`,e,{headers:t.headers})||{})}async getVectors(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/GetVectors`,e,{headers:t.headers}))}async listVectors(e){var t=this;if(e.segmentCount!==void 0){if(e.segmentCount<1||e.segmentCount>16)throw Error(`segmentCount must be between 1 and 16`);if(e.segmentIndex!==void 0&&(e.segmentIndex<0||e.segmentIndex>=e.segmentCount))throw Error(`segmentIndex must be between 0 and ${e.segmentCount-1}`)}return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/ListVectors`,e,{headers:t.headers}))}async queryVectors(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/QueryVectors`,e,{headers:t.headers}))}async deleteVectors(e){var t=this;if(e.keys.length<1||e.keys.length>500)throw Error(`Keys batch size must be between 1 and 500 items`);return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/DeleteVectors`,e,{headers:t.headers})||{})}},xn=class extends cn{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=D(D({},gn),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async createBucket(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/CreateVectorBucket`,{vectorBucketName:e},{headers:t.headers})||{})}async getBucket(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/GetVectorBucket`,{vectorBucketName:e},{headers:t.headers}))}async listBuckets(e={}){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/ListVectorBuckets`,e,{headers:t.headers}))}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/DeleteVectorBucket`,{vectorBucketName:e},{headers:t.headers})||{})}},Sn=class extends xn{constructor(e,t={}){super(e,t.headers||{},t.fetch)}from(e){return new Cn(this.url,this.headers,e,this.fetch)}async createBucket(e){var t=()=>super.createBucket,n=this;return t().call(n,e)}async getBucket(e){var t=()=>super.getBucket,n=this;return t().call(n,e)}async listBuckets(e={}){var t=()=>super.listBuckets,n=this;return t().call(n,e)}async deleteBucket(e){var t=()=>super.deleteBucket,n=this;return t().call(n,e)}},Cn=class extends yn{constructor(e,t,n,r){super(e,t,r),this.vectorBucketName=n}async createIndex(e){var t=()=>super.createIndex,n=this;return t().call(n,D(D({},e),{},{vectorBucketName:n.vectorBucketName}))}async listIndexes(e={}){var t=()=>super.listIndexes,n=this;return t().call(n,D(D({},e),{},{vectorBucketName:n.vectorBucketName}))}async getIndex(e){var t=()=>super.getIndex,n=this;return t().call(n,n.vectorBucketName,e)}async deleteIndex(e){var t=()=>super.deleteIndex,n=this;return t().call(n,n.vectorBucketName,e)}index(e){return new wn(this.url,this.headers,this.vectorBucketName,e,this.fetch)}},wn=class extends bn{constructor(e,t,n,r,i){super(e,t,i),this.vectorBucketName=n,this.indexName=r}async putVectors(e){var t=()=>super.putVectors,n=this;return t().call(n,D(D({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async getVectors(e){var t=()=>super.getVectors,n=this;return t().call(n,D(D({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async listVectors(e={}){var t=()=>super.listVectors,n=this;return t().call(n,D(D({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async queryVectors(e){var t=()=>super.queryVectors,n=this;return t().call(n,D(D({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async deleteVectors(e){var t=()=>super.deleteVectors,n=this;return t().call(n,D(D({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}},Tn=class extends _n{constructor(e,t={},n,r){super(e,t,n,r)}from(e){return new hn(this.url,this.headers,e,this.fetch)}get vectors(){return new Sn(this.url+`/vector`,{headers:this.headers,fetch:this.fetch})}get analytics(){return new vn(this.url+`/iceberg`,this.headers,this.fetch)}},En=`2.118.0`,Dn=3e4,On=3*Dn,kn=2*Dn,An=`http://localhost:9999`,jn=`supabase.auth.token`,Mn={"X-Client-Info":`gotrue-js/${En}`},Nn=`X-Supabase-Api-Version`,Pn={"2024-01-01":{timestamp:Date.parse(`2024-01-01T00:00:00.0Z`),name:`2024-01-01`}},Fn=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,In=`sb_flow_id`,Ln=class extends Error{constructor(e,t,n){super(e),this.__isAuthError=!0,this.name=`AuthError`,this.status=t,this.code=n}toJSON(){return{name:this.name,message:this.message,status:this.status,code:this.code}}};function A(e){return typeof e==`object`&&!!e&&`__isAuthError`in e}var Rn=class extends Ln{constructor(e,t,n){super(e,t,n),this.name=`AuthApiError`,this.status=t,this.code=n}};function zn(e){return A(e)&&e.name===`AuthApiError`}var Bn=class extends Ln{constructor(e,t){super(e),this.name=`AuthUnknownError`,this.originalError=t}},Vn=class extends Ln{constructor(e,t,n,r){super(e,n,r),this.name=t,this.status=n}},j=class extends Vn{constructor(){super(`Auth session missing!`,`AuthSessionMissingError`,400,void 0)}};function Hn(e){return A(e)&&e.name===`AuthSessionMissingError`}var Un=class extends Vn{constructor(){super(`Auth session or user missing`,`AuthInvalidTokenResponseError`,500,void 0)}},Wn=class extends Vn{constructor(e){super(e,`AuthInvalidCredentialsError`,400,void 0)}},Gn=class extends Vn{constructor(e,t=null){super(e,`AuthImplicitGrantRedirectError`,500,void 0),this.details=null,this.details=t}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}};function Kn(e){return A(e)&&e.name===`AuthImplicitGrantRedirectError`}var qn=class extends Vn{constructor(e,t=null){super(e,`AuthPKCEGrantCodeExchangeError`,500,void 0),this.details=null,this.details=t}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}},Jn=class extends Vn{constructor(){super(`PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.`,`AuthPKCECodeVerifierMissingError`,400,`pkce_code_verifier_not_found`)}},Yn=class extends Vn{constructor(e,t){super(e,`AuthRetryableFetchError`,t,void 0)}};function Xn(e){return A(e)&&e.name===`AuthRetryableFetchError`}var Zn=class extends Vn{constructor(e=`Refresh result discarded: session state changed mid-flight (e.g., concurrent signOut)`){super(e,`AuthRefreshDiscardedError`,409,void 0)}};function Qn(e){return A(e)&&e.name===`AuthRefreshDiscardedError`}var $n=class extends Vn{constructor(e,t,n){super(e,`AuthWeakPasswordError`,t,`weak_password`),this.reasons=n}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{reasons:this.reasons})}},er=class extends Vn{constructor(e){super(e,`AuthInvalidJwtError`,400,`invalid_jwt`)}},tr=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.split(``),nr=` 	
\r=`.split(``),rr=(()=>{let e=Array(128);for(let t=0;t<e.length;t+=1)e[t]=-1;for(let t=0;t<nr.length;t+=1)e[nr[t].charCodeAt(0)]=-2;for(let t=0;t<tr.length;t+=1)e[tr[t].charCodeAt(0)]=t;return e})();function ir(e,t,n){if(e!==null)for(t.queue=t.queue<<8|e,t.queuedBits+=8;t.queuedBits>=6;)n(tr[t.queue>>t.queuedBits-6&63]),t.queuedBits-=6;else if(t.queuedBits>0)for(t.queue<<=6-t.queuedBits,t.queuedBits=6;t.queuedBits>=6;)n(tr[t.queue>>t.queuedBits-6&63]),t.queuedBits-=6}function ar(e,t,n){let r=rr[e];if(r>-1)for(t.queue=t.queue<<6|r,t.queuedBits+=6;t.queuedBits>=8;)n(t.queue>>t.queuedBits-8&255),t.queuedBits-=8;else if(r===-2)return;else throw Error(`Invalid Base64-URL character "${String.fromCharCode(e)}"`)}function or(e){let t=[],n=e=>{t.push(String.fromCodePoint(e))},r={utf8seq:0,codepoint:0},i={queue:0,queuedBits:0},a=e=>{lr(e,r,n)};for(let t=0;t<e.length;t+=1)ar(e.charCodeAt(t),i,a);return t.join(``)}function sr(e,t){if(e<=127)t(e);else if(e<=2047)t(192|e>>6),t(128|e&63);else if(e<=65535)t(224|e>>12),t(128|e>>6&63),t(128|e&63);else if(e<=1114111)t(240|e>>18),t(128|e>>12&63),t(128|e>>6&63),t(128|e&63);else throw Error(`Unrecognized Unicode codepoint: ${e.toString(16)}`)}function cr(e,t){for(let n=0;n<e.length;n+=1){let r=e.charCodeAt(n);if(r>55295&&r<=56319){let t=(r-55296)*1024&65535;r=(e.charCodeAt(n+1)-56320&65535|t)+65536,n+=1}sr(r,t)}}function lr(e,t,n){if(t.utf8seq===0){if(e<=127){n(e);return}for(let n=1;n<6;n+=1)if(!(e>>7-n&1)){t.utf8seq=n;break}if(t.utf8seq===2)t.codepoint=e&31;else if(t.utf8seq===3)t.codepoint=e&15;else if(t.utf8seq===4)t.codepoint=e&7;else throw Error(`Invalid UTF-8 sequence`);--t.utf8seq}else if(t.utf8seq>0){if(e<=127)throw Error(`Invalid UTF-8 sequence`);t.codepoint=t.codepoint<<6|e&63,--t.utf8seq,t.utf8seq===0&&n(t.codepoint)}}function ur(e){let t=[],n={queue:0,queuedBits:0},r=e=>{t.push(e)};for(let t=0;t<e.length;t+=1)ar(e.charCodeAt(t),n,r);return new Uint8Array(t)}function dr(e){let t=[];return cr(e,e=>t.push(e)),new Uint8Array(t)}function fr(e){let t=[],n={queue:0,queuedBits:0},r=e=>{t.push(e)};return e.forEach(e=>ir(e,n,r)),ir(null,n,r),t.join(``)}function pr(e){return Math.round(Date.now()/1e3)+e}function mr(){return Symbol(`auth-callback`)}var M=()=>typeof window<`u`&&typeof document<`u`,hr={tested:!1,writable:!1},gr=()=>{if(!M())return!1;try{if(typeof globalThis.localStorage!=`object`)return!1}catch{return!1}if(hr.tested)return hr.writable;let e=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(e,e),globalThis.localStorage.removeItem(e),hr.tested=!0,hr.writable=!0}catch{hr.tested=!0,hr.writable=!1}return hr.writable};function _r(e){let t={},n=new URL(e);if(n.hash&&n.hash[0]===`#`)try{new URLSearchParams(n.hash.substring(1)).forEach((e,n)=>{t[n]=e})}catch{}return n.searchParams.forEach((e,n)=>{t[n]=e}),t}var vr=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),yr=e=>typeof e==`object`&&!!e&&`status`in e&&`ok`in e&&`json`in e&&typeof e.json==`function`,br=async(e,t,n)=>{await e.setItem(t,JSON.stringify(n))},N=async(e,t)=>{let n=await e.getItem(t);if(!n)return null;try{return JSON.parse(n)}catch{return null}},P=async(e,t)=>{await e.removeItem(t)},xr=class e{constructor(){this.promise=new e.promiseConstructor((e,t)=>{this.resolve=e,this.reject=t})}};xr.promiseConstructor=Promise;function Sr(e){let t=e.split(`.`);if(t.length!==3)throw new er(`Invalid JWT structure`);for(let e=0;e<t.length;e++)if(!Fn.test(t[e]))throw new er(`JWT not in base64url format`);return{header:JSON.parse(or(t[0])),payload:JSON.parse(or(t[1])),signature:ur(t[2]),raw:{header:t[0],payload:t[1]}}}async function Cr(e){return await new Promise(t=>{setTimeout(()=>t(null),e)})}function wr(e,t){return new Promise((n,r)=>{(async()=>{for(let i=0;i<1/0;i++)try{let r=await e(i);if(!t(i,null,r)){n(r);return}}catch(e){if(!t(i,e)){r(e);return}}})()})}function Tr(e){return(`0`+e.toString(16)).substr(-2)}function Er(){let e=new Uint32Array(56);if(typeof crypto>`u`){let e=``;for(let t=0;t<56;t++)e+=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~`.charAt(Math.floor(Math.random()*66));return e}return crypto.getRandomValues(e),Array.from(e,Tr).join(``)}async function Dr(e){let t=new TextEncoder().encode(e),n=await crypto.subtle.digest(`SHA-256`,t),r=new Uint8Array(n);return Array.from(r).map(e=>String.fromCharCode(e)).join(``)}async function Or(e){if(typeof crypto>`u`||crypto.subtle===void 0||typeof TextEncoder>`u`)return console.warn(`WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.`),e;let t=await Dr(e);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}var kr=/^[a-zA-Z0-9_-]{8,64}$/;function Ar(e){return typeof e==`string`&&kr.test(e)?e:null}function jr(){if(typeof crypto<`u`&&typeof crypto.getRandomValues==`function`){let e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e,Tr).join(``)}let e=``;for(let t=0;t<32;t++)e+=Math.floor(Math.random()*16).toString(16);return e}var Mr=(e,t)=>`${e}-flow-${t}-code-verifier`,Nr=e=>`${e}-flows-code-verifier`;async function Pr(e,t){let n=await N(e,Nr(t));return Array.isArray(n)?n.filter(e=>Ar(e)!==null):[]}async function Fr(e,t,n,r,i){await br(e,Mr(t,n),r);let a=(await Pr(e,t)).filter(e=>e!==n);for(a.push(n);a.length>5;){let n=a.shift();await P(e,Mr(t,n)),i?.(n)}await br(e,Nr(t),a),await br(e,`${t}-code-verifier`,r)}async function Ir(e,t,n){if(n){let r=await N(e,Mr(t,n));return{verifier:typeof r==`string`?r:null,flowId:n}}let r=await N(e,`${t}-code-verifier`);return{verifier:typeof r==`string`?r:null,flowId:null}}async function F(e,t,n){let r=`${t}-code-verifier`;if(!n){await P(e,r);return}let i=Mr(t,n),a=await N(e,i);await P(e,i);let o=await Pr(e,t),s=o.filter(e=>e!==n);s.length!==o.length&&(s.length>0?await br(e,Nr(t),s):await P(e,Nr(t))),a!=null&&a===await N(e,r)&&await P(e,r)}async function Lr(e,t){let n=await Pr(e,t);for(let r of n)await P(e,Mr(t,r));await P(e,Nr(t)),await P(e,`${t}-code-verifier`)}function Rr(e,t){let n=e.indexOf(`#`),r=n===-1?e:e.slice(0,n),i=n===-1?``:e.slice(n),a=r.indexOf(`?`);if(a!==-1){let e=r.slice(0,a),t=r.slice(a+1).split(`&`).filter(e=>e!==``&&e!==`sb_flow_id`&&!e.startsWith(`sb_flow_id=`));r=t.length>0?`${e}?${t.join(`&`)}`:e}let o=r.includes(`?`)?`&`:`?`;return`${r}${o}${In}=${encodeURIComponent(t)}${i}`}async function zr(e,t,n=!1,r){let i=Er(),a=i;n&&(a+=`/recovery`);let o=jr();await Fr(e,t,o,a,r);let s=await Or(i);return[s,i===s?`plain`:`s256`,o]}var Br=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;function Vr(e){let t=e.headers.get(Nn);if(!t||!t.match(Br))return null;try{return new Date(`${t}T00:00:00.0Z`)}catch{return null}}function Hr(e){if(!e)throw Error(`Missing exp claim`);if(e<=Math.floor(Date.now()/1e3))throw Error(`JWT has expired`)}function Ur(e){switch(e){case`RS256`:return{name:`RSASSA-PKCS1-v1_5`,hash:{name:`SHA-256`}};case`ES256`:return{name:`ECDSA`,namedCurve:`P-256`,hash:{name:`SHA-256`}};default:throw Error(`Invalid alg claim`)}}var Wr=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function Gr(e){if(!Wr.test(e))throw Error(`@supabase/auth-js: Expected parameter to be UUID but is not`)}function Kr(e){if(!e.recoveryCodes)throw Error("@supabase/auth-js: the MFA recovery codes API is experimental and disabled by default. Enable it by passing `auth: { experimental: { recoveryCodes: true } }` to createClient (or to the GoTrueClient constructor).")}function qr(){return new Proxy({},{get:(e,t)=>{if(t===`__isUserNotAvailableProxy`)return!0;if(typeof t==`symbol`){let e=t.toString();if(e===`Symbol(Symbol.toPrimitive)`||e===`Symbol(Symbol.toStringTag)`||e===`Symbol(util.inspect.custom)`)return}throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t}" property of the session object is not supported. Please use getUser() instead.`)},set:(e,t)=>{throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(e,t)=>{throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function Jr(e,t){return new Proxy(e,{get:(e,n,r)=>{if(n===`__isInsecureUserWarningProxy`)return!0;if(typeof n==`symbol`){let t=n.toString();if(t===`Symbol(Symbol.toPrimitive)`||t===`Symbol(Symbol.toStringTag)`||t===`Symbol(util.inspect.custom)`||t===`Symbol(nodejs.util.inspect.custom)`)return Reflect.get(e,n,r)}return!t.value&&typeof n==`string`&&(console.warn(`Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.`),t.value=!0),Reflect.get(e,n,r)}})}function Yr(e){return JSON.parse(JSON.stringify(e))}var Xr=e=>{if(typeof e==`object`&&e){let t=e;if(typeof t.msg==`string`)return t.msg;if(typeof t.message==`string`)return t.message;if(typeof t.error_description==`string`)return t.error_description;if(typeof t.error==`string`)return t.error}return JSON.stringify(e)},Zr=[500,501,502,503,504,520,521,522,523,524,525,526,527,528,529,530];async function Qr(e){if(!yr(e))throw new Yn(Xr(e),0);let t;try{t=await e.json()}catch(t){throw Zr.includes(e.status)?new Yn(e.statusText||`HTTP ${e.status}`,e.status):new Bn(Xr(t),t)}if(Zr.includes(e.status))throw new Yn(Xr(t),e.status);let n,r=Vr(e);if(r&&r.getTime()>=Pn[`2024-01-01`].timestamp&&typeof t==`object`&&t&&typeof t.code==`string`?n=t.code:typeof t==`object`&&t&&typeof t.error_code==`string`&&(n=t.error_code),!n){if(typeof t==`object`&&t&&typeof t.weak_password==`object`&&t.weak_password&&Array.isArray(t.weak_password.reasons)&&t.weak_password.reasons.length&&t.weak_password.reasons.reduce((e,t)=>e&&typeof t==`string`,!0))throw new $n(Xr(t),e.status,t.weak_password.reasons)}else if(n===`weak_password`)throw new $n(Xr(t),e.status,t.weak_password?.reasons||[]);else if(n===`session_not_found`)throw new j;throw new Rn(Xr(t),e.status||500,n)}var $r=(e,t,n,r)=>{let i={method:e,headers:t?.headers||{}};return e===`GET`?i:(i.headers=Object.assign({"Content-Type":`application/json;charset=UTF-8`},t?.headers),i.body=JSON.stringify(r),Object.assign(Object.assign({},i),n))};async function I(e,t,n,r){let i=Object.assign({},r?.headers);i[`X-Supabase-Api-Version`]||(i[Nn]=Pn[`2024-01-01`].name),r?.jwt&&(i.Authorization=`Bearer ${r.jwt}`);let a=r?.query??{};r?.redirectTo&&(a.redirect_to=r.redirectTo);let o=await ei(e,t,n+(Object.keys(a).length?`?`+new URLSearchParams(a).toString():``),{headers:i,noResolveJson:r?.noResolveJson},{},r?.body);return r?.xform?r?.xform(o):{data:Object.assign({},o),error:null}}async function ei(e,t,n,r,i,a){let o=$r(t,r,i,a),s;try{s=await e(n,Object.assign({},o))}catch(e){throw new Yn(Xr(e),0)}if(s.ok||await Qr(s),r?.noResolveJson)return s;try{return await s.json()}catch(e){await Qr(e)}}function L(e){let t=null;oi(e)&&(t=Object.assign({},e),e.expires_at||(t.expires_at=pr(e.expires_in)));let n=e.user??(typeof e?.id==`string`?e:null);return{data:{session:t,user:n},error:null}}function ti(e){let t=L(e);return!t.error&&e.weak_password&&typeof e.weak_password==`object`&&Array.isArray(e.weak_password.reasons)&&e.weak_password.reasons.length&&e.weak_password.message&&typeof e.weak_password.message==`string`&&e.weak_password.reasons.reduce((e,t)=>e&&typeof t==`string`,!0)&&(t.data.weak_password=e.weak_password),t}function ni(e){return{data:{user:e.user??e},error:null}}function ri(e){return{data:e,error:null}}function ii(e){let{action_link:t,email_otp:r,hashed_token:i,redirect_to:a,verification_type:o}=e,s=n(e,[`action_link`,`email_otp`,`hashed_token`,`redirect_to`,`verification_type`]);return{data:{properties:{action_link:t,email_otp:r,hashed_token:i,redirect_to:a,verification_type:o},user:Object.assign({},s)},error:null}}function ai(e){return e}function oi(e){return!!e.access_token&&!!e.refresh_token&&!!e.expires_in}var si=[`global`,`local`,`others`],ci=class{constructor({url:e=``,headers:t={},fetch:n,experimental:r}){this.url=e,this.headers=t,this.fetch=vr(n),this.experimental=r??{},this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),updateClient:this._updateOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)},this.customProviders={listProviders:this._listCustomProviders.bind(this),createProvider:this._createCustomProvider.bind(this),getProvider:this._getCustomProvider.bind(this),updateProvider:this._updateCustomProvider.bind(this),deleteProvider:this._deleteCustomProvider.bind(this)},this.passkey={listPasskeys:this._adminListPasskeys.bind(this),deletePasskey:this._adminDeletePasskey.bind(this)}}async signOut(e,t=si[0]){if(si.indexOf(t)<0)throw Error(`@supabase/auth-js: Parameter scope must be one of ${si.join(`, `)}`);try{return await I(this.fetch,`POST`,`${this.url}/logout?scope=${t}`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(e){if(A(e))return{data:null,error:e};throw e}}async inviteUserByEmail(e,t={}){try{return await I(this.fetch,`POST`,`${this.url}/invite`,{body:{email:e,data:t.data},headers:this.headers,redirectTo:t.redirectTo,xform:ni})}catch(e){if(A(e))return{data:{user:null},error:e};throw e}}async generateLink(e){try{let{options:t}=e,r=n(e,[`options`]),i=Object.assign(Object.assign({},r),t);return`newEmail`in r&&(i.new_email=r?.newEmail,delete i.newEmail),await I(this.fetch,`POST`,`${this.url}/admin/generate_link`,{body:i,headers:this.headers,xform:ii,redirectTo:t?.redirectTo})}catch(e){if(A(e))return{data:{properties:null,user:null},error:e};throw e}}async createUser(e){try{return await I(this.fetch,`POST`,`${this.url}/admin/users`,{body:e,headers:this.headers,xform:ni})}catch(e){if(A(e))return{data:{user:null},error:e};throw e}}async listUsers(e){try{let t={nextPage:null,lastPage:0,total:0},n=await I(this.fetch,`GET`,`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(e?.page)?.toString()??``,per_page:(e?.perPage)?.toString()??``},xform:ai});if(n.error)throw n.error;let r=await n.json(),i=n.headers.get(`x-total-count`)??0,a=n.headers.get(`link`)?.split(`,`)??[];return a.length>0&&(a.forEach(e=>{let n=parseInt(e.split(`;`)[0].split(`=`)[1].substring(0,1)),r=JSON.parse(e.split(`;`)[1].split(`=`)[1]);t[`${r}Page`]=n}),t.total=parseInt(i)),{data:Object.assign(Object.assign({},r),t),error:null}}catch(e){if(A(e))return{data:{users:[]},error:e};throw e}}async getUserById(e){Gr(e);try{return await I(this.fetch,`GET`,`${this.url}/admin/users/${e}`,{headers:this.headers,xform:ni})}catch(e){if(A(e))return{data:{user:null},error:e};throw e}}async updateUserById(e,t){Gr(e);try{return await I(this.fetch,`PUT`,`${this.url}/admin/users/${e}`,{body:t,headers:this.headers,xform:ni})}catch(e){if(A(e))return{data:{user:null},error:e};throw e}}async deleteUser(e,t=!1){Gr(e);try{return await I(this.fetch,`DELETE`,`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:t},xform:ni})}catch(e){if(A(e))return{data:{user:null},error:e};throw e}}async _listFactors(e){Gr(e.userId);try{let{data:t,error:n}=await I(this.fetch,`GET`,`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:e=>({data:{factors:e},error:null})});return{data:t,error:n}}catch(e){if(A(e))return{data:null,error:e};throw e}}async _deleteFactor(e){Gr(e.userId),Gr(e.id);try{return{data:await I(this.fetch,`DELETE`,`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(e){if(A(e))return{data:null,error:e};throw e}}async _listOAuthClients(e){try{let t={nextPage:null,lastPage:0,total:0},n=await I(this.fetch,`GET`,`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:(e?.page)?.toString()??``,per_page:(e?.perPage)?.toString()??``},xform:ai});if(n.error)throw n.error;let r=await n.json(),i=n.headers.get(`x-total-count`)??0,a=n.headers.get(`link`)?.split(`,`)??[];return a.length>0&&(a.forEach(e=>{let n=parseInt(e.split(`;`)[0].split(`=`)[1].substring(0,1)),r=JSON.parse(e.split(`;`)[1].split(`=`)[1]);t[`${r}Page`]=n}),t.total=parseInt(i)),{data:Object.assign(Object.assign({},r),t),error:null}}catch(e){if(A(e))return{data:{clients:[]},error:e};throw e}}async _createOAuthClient(e){try{return await I(this.fetch,`POST`,`${this.url}/admin/oauth/clients`,{body:e,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _getOAuthClient(e){try{return await I(this.fetch,`GET`,`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _updateOAuthClient(e,t){try{return await I(this.fetch,`PUT`,`${this.url}/admin/oauth/clients/${e}`,{body:t,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _deleteOAuthClient(e){try{return await I(this.fetch,`DELETE`,`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(A(e))return{data:null,error:e};throw e}}async _regenerateOAuthClientSecret(e){try{return await I(this.fetch,`POST`,`${this.url}/admin/oauth/clients/${e}/regenerate_secret`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _listCustomProviders(e){try{let t={};return e?.type&&(t.type=e.type),await I(this.fetch,`GET`,`${this.url}/admin/custom-providers`,{headers:this.headers,query:t,xform:e=>({data:{providers:e?.providers??[]},error:null})})}catch(e){if(A(e))return{data:{providers:[]},error:e};throw e}}async _createCustomProvider(e){try{return await I(this.fetch,`POST`,`${this.url}/admin/custom-providers`,{body:e,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _getCustomProvider(e){try{return await I(this.fetch,`GET`,`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _updateCustomProvider(e,t){try{return await I(this.fetch,`PUT`,`${this.url}/admin/custom-providers/${e}`,{body:t,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _deleteCustomProvider(e){try{return await I(this.fetch,`DELETE`,`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(A(e))return{data:null,error:e};throw e}}async _adminListPasskeys(e){Gr(e.userId);try{return await I(this.fetch,`GET`,`${this.url}/admin/users/${e.userId}/passkeys`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _adminDeletePasskey(e){Gr(e.userId),Gr(e.passkeyId);try{return await I(this.fetch,`DELETE`,`${this.url}/admin/users/${e.userId}/passkeys/${e.passkeyId}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(A(e))return{data:null,error:e};throw e}}};function li(e={}){return{getItem:t=>e[t]||null,setItem:(t,n)=>{e[t]=n},removeItem:t=>{delete e[t]}}}globalThis&&gr()&&globalThis.localStorage&&globalThis.localStorage.getItem(`supabase.gotrue-js.locks.debug`);var ui=class extends Error{constructor(e){super(e),this.isAcquireTimeout=!0}};function di(){if(typeof globalThis!=`object`)try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<`u`&&(self.globalThis=self)}}function fi(e){if(!/^0x[a-fA-F0-9]{40}$/.test(e))throw Error(`@supabase/auth-js: Address "${e}" is invalid.`);return e.toLowerCase()}function pi(e){return parseInt(e,16)}function mi(e){let t=new TextEncoder().encode(e);return`0x`+Array.from(t,e=>e.toString(16).padStart(2,`0`)).join(``)}function hi(e){let{chainId:t,domain:n,expirationTime:r,issuedAt:i=new Date,nonce:a,notBefore:o,requestId:s,resources:c,scheme:l,uri:u,version:d}=e;if(!Number.isInteger(t))throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${t}`);if(!n)throw Error(`@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.`);if(a&&a.length<8)throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a}`);if(!u)throw Error(`@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.`);if(d!==`1`)throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d}`);if(e.statement?.includes(`
`))throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e.statement}`);let f=fi(e.address),p=`${l?`${l}://${n}`:n} wants you to sign in with your Ethereum account:\n${f}\n\n${e.statement?`${e.statement}\n`:``}`,m=`URI: ${u}\nVersion: ${d}\nChain ID: ${t}${a?`\nNonce: ${a}`:``}\nIssued At: ${i.toISOString()}`;if(r&&(m+=`\nExpiration Time: ${r.toISOString()}`),o&&(m+=`\nNot Before: ${o.toISOString()}`),s&&(m+=`\nRequest ID: ${s}`),c){let e=`
Resources:`;for(let t of c){if(!t||typeof t!=`string`)throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t}`);e+=`\n- ${t}`}m+=e}return`${p}\n${m}`}var R=class extends Error{constructor({message:e,code:t,cause:n,name:r}){super(e,{cause:n}),this.__isWebAuthnError=!0,this.name=r??(n instanceof Error?n.name:void 0)??`Unknown Error`,this.code=t}toJSON(){return{name:this.name,message:this.message,code:this.code}}},gi=class extends R{constructor(e,t){super({code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:t,message:e}),this.name=`WebAuthnUnknownError`,this.originalError=t}};function _i({error:e,options:t}){let{publicKey:n}=t;if(!n)throw Error(`options was missing required publicKey property`);if(e.name===`AbortError`){if(t.signal instanceof AbortSignal)return new R({message:`Registration ceremony was sent an abort signal`,code:`ERROR_CEREMONY_ABORTED`,cause:e})}else if(e.name===`ConstraintError`){if(n.authenticatorSelection?.requireResidentKey===!0)return new R({message:`Discoverable credentials were required but no available authenticator supported it`,code:`ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT`,cause:e});if(t.mediation===`conditional`&&n.authenticatorSelection?.userVerification===`required`)return new R({message:`User verification was required during automatic registration but it could not be performed`,code:`ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE`,cause:e});if(n.authenticatorSelection?.userVerification===`required`)return new R({message:`User verification was required but no available authenticator supported it`,code:`ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT`,cause:e})}else if(e.name===`InvalidStateError`)return new R({message:`The authenticator was previously registered`,code:`ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED`,cause:e});else if(e.name===`NotAllowedError`)return new R({message:e.message,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e});else if(e.name===`NotSupportedError`)return n.pubKeyCredParams.filter(e=>e.type===`public-key`).length===0?new R({message:`No entry in pubKeyCredParams was of type "public-key"`,code:`ERROR_MALFORMED_PUBKEYCREDPARAMS`,cause:e}):new R({message:`No available authenticator supported any of the specified pubKeyCredParams algorithms`,code:`ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG`,cause:e});else if(e.name===`SecurityError`){let t=window.location.hostname;if(!wi(t))return new R({message:`${window.location.hostname} is an invalid domain`,code:`ERROR_INVALID_DOMAIN`,cause:e});if(n.rp.id!==t)return new R({message:`The RP ID "${n.rp.id}" is invalid for this domain`,code:`ERROR_INVALID_RP_ID`,cause:e})}else if(e.name===`TypeError`){if(n.user.id.byteLength<1||n.user.id.byteLength>64)return new R({message:`User ID was not between 1 and 64 characters`,code:`ERROR_INVALID_USER_ID_LENGTH`,cause:e})}else if(e.name===`UnknownError`)return new R({message:`The authenticator was unable to process the specified options, or could not create a new credential`,code:`ERROR_AUTHENTICATOR_GENERAL_ERROR`,cause:e});return new R({message:`a Non-Webauthn related error has occurred`,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e})}function vi({error:e,options:t}){let{publicKey:n}=t;if(!n)throw Error(`options was missing required publicKey property`);if(e.name===`AbortError`){if(t.signal instanceof AbortSignal)return new R({message:`Authentication ceremony was sent an abort signal`,code:`ERROR_CEREMONY_ABORTED`,cause:e})}else if(e.name===`NotAllowedError`)return new R({message:e.message,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e});else if(e.name===`SecurityError`){let t=window.location.hostname;if(!wi(t))return new R({message:`${window.location.hostname} is an invalid domain`,code:`ERROR_INVALID_DOMAIN`,cause:e});if(n.rpId!==t)return new R({message:`The RP ID "${n.rpId}" is invalid for this domain`,code:`ERROR_INVALID_RP_ID`,cause:e})}else if(e.name===`UnknownError`)return new R({message:`The authenticator was unable to process the specified options, or could not create a new assertion signature`,code:`ERROR_AUTHENTICATOR_GENERAL_ERROR`,cause:e});return new R({message:`a Non-Webauthn related error has occurred`,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e})}var yi=new class{createNewAbortSignal(){if(this.controller){let e=Error(`Cancelling existing WebAuthn API call for new one`);e.name=`AbortError`,this.controller.abort(e)}let e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){let e=Error(`Manually cancelling existing WebAuthn API call`);e.name=`AbortError`,this.controller.abort(e),this.controller=void 0}}};function bi(e){if(!e)throw Error(`Credential creation options are required`);if(typeof PublicKeyCredential<`u`&&`parseCreationOptionsFromJSON`in PublicKeyCredential&&typeof PublicKeyCredential.parseCreationOptionsFromJSON==`function`)return PublicKeyCredential.parseCreationOptionsFromJSON(e);let{challenge:t,user:r,excludeCredentials:i}=e,a=n(e,[`challenge`,`user`,`excludeCredentials`]),o=ur(t).buffer,s=Object.assign(Object.assign({},r),{id:ur(r.id).buffer}),c=Object.assign(Object.assign({},a),{challenge:o,user:s});if(i&&i.length>0){c.excludeCredentials=Array(i.length);for(let e=0;e<i.length;e++){let t=i[e];c.excludeCredentials[e]=Object.assign(Object.assign({},t),{id:ur(t.id).buffer,type:t.type||`public-key`,transports:t.transports})}}return c}function xi(e){if(!e)throw Error(`Credential request options are required`);if(typeof PublicKeyCredential<`u`&&`parseRequestOptionsFromJSON`in PublicKeyCredential&&typeof PublicKeyCredential.parseRequestOptionsFromJSON==`function`)return PublicKeyCredential.parseRequestOptionsFromJSON(e);let{challenge:t,allowCredentials:r}=e,i=n(e,[`challenge`,`allowCredentials`]),a=ur(t).buffer,o=Object.assign(Object.assign({},i),{challenge:a});if(r&&r.length>0){o.allowCredentials=Array(r.length);for(let e=0;e<r.length;e++){let t=r[e];o.allowCredentials[e]=Object.assign(Object.assign({},t),{id:ur(t.id).buffer,type:t.type||`public-key`,transports:t.transports})}}return o}function Si(e){if(`toJSON`in e&&typeof e.toJSON==`function`)return e.toJSON();let t=e;return{id:e.id,rawId:e.id,response:{attestationObject:fr(new Uint8Array(e.response.attestationObject)),clientDataJSON:fr(new Uint8Array(e.response.clientDataJSON))},type:`public-key`,clientExtensionResults:e.getClientExtensionResults(),authenticatorAttachment:t.authenticatorAttachment??void 0}}function Ci(e){if(`toJSON`in e&&typeof e.toJSON==`function`)return e.toJSON();let t=e,n=e.getClientExtensionResults(),r=e.response;return{id:e.id,rawId:e.id,response:{authenticatorData:fr(new Uint8Array(r.authenticatorData)),clientDataJSON:fr(new Uint8Array(r.clientDataJSON)),signature:fr(new Uint8Array(r.signature)),userHandle:r.userHandle?fr(new Uint8Array(r.userHandle)):void 0},type:`public-key`,clientExtensionResults:n,authenticatorAttachment:t.authenticatorAttachment??void 0}}function wi(e){return e===`localhost`||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e)}function Ti(){return!!(M()&&`PublicKeyCredential`in window&&window.PublicKeyCredential&&`credentials`in navigator&&typeof(navigator==null?void 0:navigator.credentials)?.create==`function`&&typeof(navigator==null?void 0:navigator.credentials)?.get==`function`)}async function Ei(e){try{let t=await navigator.credentials.create(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new gi(`Browser returned unexpected credential type`,t)}:{data:null,error:new gi(`Empty credential response`,t)}}catch(t){return{data:null,error:_i({error:t,options:e})}}}async function Di(e){try{let t=await navigator.credentials.get(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new gi(`Browser returned unexpected credential type`,t)}:{data:null,error:new gi(`Empty credential response`,t)}}catch(t){return{data:null,error:vi({error:t,options:e})}}}var Oi={hints:[`security-key`],authenticatorSelection:{authenticatorAttachment:`cross-platform`,requireResidentKey:!1,userVerification:`preferred`,residentKey:`discouraged`},attestation:`direct`},ki={userVerification:`preferred`,hints:[`security-key`],attestation:`direct`};function Ai(...e){let t=e=>typeof e==`object`&&!!e&&!Array.isArray(e),n=e=>e instanceof ArrayBuffer||ArrayBuffer.isView(e),r={};for(let i of e)if(i)for(let e in i){let a=i[e];if(a!==void 0){if(Array.isArray(a))r[e]=a;else if(n(a))r[e]=a;else if(t(a)){let n=r[e];r[e]=t(n)?Ai(n,a):Ai(a)}else r[e]=a}}return r}function ji(e,t){return Ai(Oi,e,t||{})}function Mi(e,t){return Ai(ki,e,t||{})}var Ni=class{constructor(e){this.client=e,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(e){return this.client.mfa.enroll(Object.assign(Object.assign({},e),{factorType:`webauthn`}))}async _challenge({factorId:e,webauthn:t,friendlyName:n,signal:r},i){try{let{data:a,error:o}=await this.client.mfa.challenge({factorId:e,webauthn:t});if(!a)return{data:null,error:o};let s=r??yi.createNewAbortSignal();if(a.webauthn.type===`create`){let{user:e}=a.webauthn.credential_options.publicKey;if(!e.name){let t=n;if(t)e.name=`${e.id}:${t}`;else{let t=(await this.client.getUser()).data.user,n=t?.user_metadata?.name||t?.email||t?.id||`User`;e.name=`${e.id}:${n}`}}e.displayName||=e.name}switch(a.webauthn.type){case`create`:{let{data:t,error:n}=await Ei({publicKey:ji(a.webauthn.credential_options.publicKey,i?.create),signal:s});return t?{data:{factorId:e,challengeId:a.id,webauthn:{type:a.webauthn.type,credential_response:t}},error:null}:{data:null,error:n}}case`request`:{let t=Mi(a.webauthn.credential_options.publicKey,i?.request),{data:n,error:r}=await Di(Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:t,signal:s}));return n?{data:{factorId:e,challengeId:a.id,webauthn:{type:a.webauthn.type,credential_response:n}},error:null}:{data:null,error:r}}}}catch(e){return A(e)?{data:null,error:e}:{data:null,error:new Bn(`Unexpected error in challenge`,e)}}}async _verify({challengeId:e,factorId:t,webauthn:n}){return this.client.mfa.verify({factorId:t,challengeId:e,webauthn:n})}async _authenticate({factorId:e,webauthn:{rpId:t=typeof window<`u`?window.location.hostname:void 0,rpOrigins:n=typeof window<`u`?[window.location.origin]:void 0,signal:r}={}},i){if(!t)return{data:null,error:new Ln(`rpId is required for WebAuthn authentication`)};try{if(!Ti())return{data:null,error:new Bn(`Browser does not support WebAuthn`,null)};let{data:a,error:o}=await this.challenge({factorId:e,webauthn:{rpId:t,rpOrigins:n},signal:r},{request:i});if(!a)return{data:null,error:o};let{webauthn:s}=a;return this._verify({factorId:e,challengeId:a.challengeId,webauthn:{type:s.type,rpId:t,rpOrigins:n,credential_response:s.credential_response}})}catch(e){return A(e)?{data:null,error:e}:{data:null,error:new Bn(`Unexpected error in authenticate`,e)}}}async _register({friendlyName:e,webauthn:{rpId:t=typeof window<`u`?window.location.hostname:void 0,rpOrigins:n=typeof window<`u`?[window.location.origin]:void 0,signal:r}={}},i){if(!t)return{data:null,error:new Ln(`rpId is required for WebAuthn registration`)};try{if(!Ti())return{data:null,error:new Bn(`Browser does not support WebAuthn`,null)};let{data:a,error:o}=await this._enroll({friendlyName:e});if(!a)return await this.client.mfa.listFactors().then(t=>t.data?.all.find(t=>t.factor_type===`webauthn`&&t.friendly_name===e&&t.status===`unverified`)).then(e=>e?this.client.mfa.unenroll({factorId:e?.id}):void 0),{data:null,error:o};let{data:s,error:c}=await this._challenge({factorId:a.id,friendlyName:a.friendly_name,webauthn:{rpId:t,rpOrigins:n},signal:r},{create:i});return s?this._verify({factorId:a.id,challengeId:s.challengeId,webauthn:{rpId:t,rpOrigins:n,type:s.webauthn.type,credential_response:s.webauthn.credential_response}}):{data:null,error:c}}catch(e){return A(e)?{data:null,error:e}:{data:null,error:new Bn(`Unexpected error in register`,e)}}}};di();var Pi={url:An,storageKey:jn,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:Mn,flowType:`implicit`,debug:!1,hasCustomAuthorizationHeader:!1,throwOnError:!1,lockAcquireTimeout:5e3,skipAutoInitialize:!1,experimental:{}},Fi={},Ii=!1,Li=class e{get jwks(){return Fi[this.storageKey]?.jwks??{keys:[]}}set jwks(e){Fi[this.storageKey]=Object.assign(Object.assign({},Fi[this.storageKey]),{jwks:e})}get jwks_cached_at(){return Fi[this.storageKey]?.cachedAt??-(2**53-1)}set jwks_cached_at(e){Fi[this.storageKey]=Object.assign(Object.assign({},Fi[this.storageKey]),{cachedAt:e})}constructor(t){var n;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.autoRefreshTickTimeout=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.lastRefreshFailure=null,this._sessionRemovalEpoch=0,this.initializePromise=null,this._pendingInitNotifications=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lock=null,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log;let r=Object.assign(Object.assign({},Pi),t);if(this.storageKey=r.storageKey,this.instanceID=e.nextInstanceID[this.storageKey]??0,e.nextInstanceID[this.storageKey]=this.instanceID+1,this.logDebugMessages=!!r.debug,typeof r.debug==`function`&&(this.logger=r.debug),this.instanceID>0&&M()){let e=`${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;console.warn(e),this.logDebugMessages&&console.trace(e)}if(this.persistSession=r.persistSession,this.autoRefreshToken=r.autoRefreshToken,this.experimental=r.experimental??{},this.admin=new ci({url:r.url,headers:r.headers,fetch:r.fetch,experimental:this.experimental}),this.url=r.url,this.headers=r.headers,this.fetch=vr(r.fetch),this.detectSessionInUrl=r.detectSessionInUrl,this.flowType=r.flowType,this.hasCustomAuthorizationHeader=r.hasCustomAuthorizationHeader,this.throwOnError=r.throwOnError,this.lockAcquireTimeout=r.lockAcquireTimeout,r.lock!=null&&(this.lock=r.lock,Ii||(Ii=!0,console.warn(`${this._logPrefix()} The "lock" option is deprecated and will be removed in v3. The client now coordinates session refreshes without a lock, so most apps can drop the option. See https://github.com/supabase/supabase-js/blob/master/packages/core/auth-js/migrations/lockless-coordination.md`))),this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=-(2**53-1)),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new Ni(this),recoveryCodes:{getStatus:this._getRecoveryCodesStatus.bind(this),generate:this._generateRecoveryCodes.bind(this),verify:this._verifyRecoveryCode.bind(this),regenerate:this._regenerateRecoveryCodes.bind(this),unenroll:this._unenrollRecoveryCodes.bind(this)}},this.oauth={getAuthorizationDetails:this._getAuthorizationDetails.bind(this),approveAuthorization:this._approveAuthorization.bind(this),denyAuthorization:this._denyAuthorization.bind(this),listGrants:this._listOAuthGrants.bind(this),revokeGrant:this._revokeOAuthGrant.bind(this)},this.passkey={startRegistration:this._startPasskeyRegistration.bind(this),verifyRegistration:this._verifyPasskeyRegistration.bind(this),startAuthentication:this._startPasskeyAuthentication.bind(this),verifyAuthentication:this._verifyPasskeyAuthentication.bind(this),list:this._listPasskeys.bind(this),update:this._updatePasskey.bind(this),delete:this._deletePasskey.bind(this)},this.persistSession?(r.storage?this.storage=r.storage:gr()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=li(this.memoryStorage)),r.userStorage&&(this.userStorage=r.userStorage)):(this.memoryStorage={},this.storage=li(this.memoryStorage)),M()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(e){console.error(`Failed to create a new BroadcastChannel, multi-tab state changes will not be available`,e)}(n=this.broadcastChannel)==null||n.addEventListener(`message`,async e=>{this._debug(`received broadcast notification from other tab or client`,e),(e.data.event===`TOKEN_REFRESHED`||e.data.event===`SIGNED_IN`)&&(this.lastRefreshFailure=null);try{await this._notifyAllSubscribers(e.data.event,e.data.session,!1)}catch(e){this._debug(`#broadcastChannel`,`error`,e)}})}r.skipAutoInitialize||this.initialize().catch(e=>{this._debug(`#initialize()`,`error`,e)})}isThrowOnErrorEnabled(){return this.throwOnError}_returnResult(e){if(this.throwOnError&&e&&e.error)throw e.error;return e}_logPrefix(){return`GoTrueClient@${this.storageKey}:${this.instanceID} (${En}) ${new Date().toISOString()}`}_debug(...e){return this.logDebugMessages&&this.logger(this._logPrefix(),...e),this}async initialize(){if(this.initializePromise)return await this.initializePromise;this._pendingInitNotifications=[],this.initializePromise=(async()=>this.lock==null?await this._initialize():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._initialize()))();let e=await this.initializePromise,t=this._pendingInitNotifications??[];this._pendingInitNotifications=null;for(let e of t)await this._notifyAllSubscribers(e.event,e.session,e.broadcast);return e}async _initialize(){try{let e={},t=`none`;if(M()&&(e=_r(window.location.href),this._isImplicitGrantCallback(e)?t=`implicit`:await this._isPKCECallback(e)&&(t=`pkce`)),M()&&this.detectSessionInUrl&&t!==`none`){let{data:n,error:r}=await this._getSessionFromURL(e,t);if(r){if(this._debug(`#_initialize()`,`error detecting session from URL`,r),Kn(r)){let e=r.details?.code;if(e===`identity_already_exists`||e===`identity_not_found`||e===`single_identity_not_deletable`)return{error:r}}return{error:r}}let{session:i,redirectType:a}=n;return this._debug(`#_initialize()`,`detected session in URL`,i,`redirect type`,a),await this._saveSession(i),setTimeout(async()=>{a===`recovery`?await this._notifyAllSubscribers(`PASSWORD_RECOVERY`,i):await this._notifyAllSubscribers(`SIGNED_IN`,i)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(e){return A(e)?this._returnResult({error:e}):this._returnResult({error:new Bn(`Unexpected error during initialization`,e)})}finally{await this._handleVisibilityChange(),this._debug(`#_initialize()`,`end`)}}async signInAnonymously(e){try{let{data:t,error:n}=await I(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,body:{data:e?.options?.data??{},gotrue_meta_security:{captcha_token:e?.options?.captchaToken}},xform:L});if(n||!t)return this._returnResult({data:{user:null,session:null},error:n});let r=t.session,i=t.user;return t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers(`SIGNED_IN`,r)),this._returnResult({data:{user:i,session:r},error:null})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signUp(e){let t=null;try{let n;if(`email`in e){let{email:r,password:i,options:a}=e,o=null,s=null;this.flowType===`pkce`&&([o,s,t]=await this._getCodeChallengeAndMethod()),n=await I(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(a?.emailRedirectTo,t),body:{email:r,password:i,data:a?.data??{},gotrue_meta_security:{captcha_token:a?.captchaToken},code_challenge:o,code_challenge_method:s},xform:L})}else if(`phone`in e){let{phone:t,password:r,options:i}=e;n=await I(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,body:{phone:t,password:r,data:i?.data??{},channel:i?.channel??`sms`,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:L})}else throw new Wn(`You must provide either an email or phone number and a password`);let{data:r,error:i}=n;if(i||!r)return await F(this.storage,this.storageKey,t),this._returnResult({data:{user:null,session:null},error:i});let a=r.session,o=r.user;return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(`SIGNED_IN`,a)),this._returnResult({data:{user:o,session:a},error:null})}catch(e){if(await F(this.storage,this.storageKey,t),A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithPassword(e){try{let t;if(`email`in e){let{email:n,password:r,options:i}=e;t=await I(this.fetch,`POST`,`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:n,password:r,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:ti})}else if(`phone`in e){let{phone:n,password:r,options:i}=e;t=await I(this.fetch,`POST`,`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:n,password:r,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:ti})}else throw new Wn(`You must provide either an email or phone number and a password`);let{data:n,error:r}=t;if(r)return this._returnResult({data:{user:null,session:null},error:r});if(!n||!n.session||!n.user){let e=new Un;return this._returnResult({data:{user:null,session:null},error:e})}return n.session&&(await this._saveSession(n.session),await this._notifyAllSubscribers(`SIGNED_IN`,n.session)),this._returnResult({data:Object.assign({user:n.user,session:n.session},n.weak_password?{weakPassword:n.weak_password}:null),error:r})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithOAuth(e){return await this._handleProviderSignIn(e.provider,{redirectTo:e.options?.redirectTo,scopes:e.options?.scopes,queryParams:e.options?.queryParams,skipBrowserRedirect:e.options?.skipBrowserRedirect})}async exchangeCodeForSession(e,t){return await this.initializePromise,this.lock==null?this._exchangeCodeForSession(e,t):this._acquireLock(this.lockAcquireTimeout,async()=>this._exchangeCodeForSession(e,t))}async signInWithWeb3(e){let{chain:t}=e;switch(t){case`ethereum`:return await this.signInWithEthereum(e);case`solana`:return await this.signInWithSolana(e);default:throw Error(`@supabase/auth-js: Unsupported chain "${t}"`)}}async signInWithEthereum(e){let t,n;if(`message`in e)t=e.message,n=e.signature;else{let{chain:r,wallet:i,statement:a,options:o}=e,s;if(!M()){if(typeof i!=`object`||!o?.url)throw Error(`@supabase/auth-js: Both wallet and url must be specified in non-browser environments.`);s=i}else if(typeof i==`object`)s=i;else{let e=window;if(`ethereum`in e&&typeof e.ethereum==`object`&&`request`in e.ethereum&&typeof e.ethereum.request==`function`)s=e.ethereum;else throw Error(`@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.`)}let c=new URL(o?.url??window.location.href),l=await s.request({method:`eth_requestAccounts`}).then(e=>e).catch(()=>{throw Error(`@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid`)});if(!l||l.length===0)throw Error(`@supabase/auth-js: No accounts available. Please ensure the wallet is connected.`);let u=fi(l[0]),d=o?.signInWithEthereum?.chainId;d||=pi(await s.request({method:`eth_chainId`})),t=hi({domain:c.host,address:u,statement:a,uri:c.href,version:`1`,chainId:d,nonce:o?.signInWithEthereum?.nonce,issuedAt:o?.signInWithEthereum?.issuedAt??new Date,expirationTime:o?.signInWithEthereum?.expirationTime,notBefore:o?.signInWithEthereum?.notBefore,requestId:o?.signInWithEthereum?.requestId,resources:o?.signInWithEthereum?.resources}),n=await s.request({method:`personal_sign`,params:[mi(t),u]})}try{let{data:r,error:i}=await I(this.fetch,`POST`,`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:`ethereum`,message:t,signature:n},e.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options?.captchaToken}}:null),xform:L});if(i)throw i;if(!r||!r.session||!r.user){let e=new Un;return this._returnResult({data:{user:null,session:null},error:e})}return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(`SIGNED_IN`,r.session)),this._returnResult({data:Object.assign({},r),error:i})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithSolana(e){let t,n;if(`message`in e)t=e.message,n=e.signature;else{let{chain:r,wallet:i,statement:a,options:o}=e,s;if(!M()){if(typeof i!=`object`||!o?.url)throw Error(`@supabase/auth-js: Both wallet and url must be specified in non-browser environments.`);s=i}else if(typeof i==`object`)s=i;else{let e=window;if(`solana`in e&&typeof e.solana==`object`&&(`signIn`in e.solana&&typeof e.solana.signIn==`function`||`signMessage`in e.solana&&typeof e.solana.signMessage==`function`))s=e.solana;else throw Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`)}let c=new URL(o?.url??window.location.href);if(`signIn`in s&&s.signIn){let e=await s.signIn(Object.assign(Object.assign(Object.assign({issuedAt:new Date().toISOString()},o?.signInWithSolana),{version:`1`,domain:c.host,uri:c.href}),a?{statement:a}:null)),r;if(Array.isArray(e)&&e[0]&&typeof e[0]==`object`)r=e[0];else if(e&&typeof e==`object`&&`signedMessage`in e&&`signature`in e)r=e;else throw Error(`@supabase/auth-js: Wallet method signIn() returned unrecognized value`);if(`signedMessage`in r&&`signature`in r&&(typeof r.signedMessage==`string`||r.signedMessage instanceof Uint8Array)&&r.signature instanceof Uint8Array)t=typeof r.signedMessage==`string`?r.signedMessage:new TextDecoder().decode(r.signedMessage),n=r.signature;else throw Error(`@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields`)}else{if(!(`signMessage`in s)||typeof s.signMessage!=`function`||!(`publicKey`in s)||typeof s!=`object`||!s.publicKey||!(`toBase58`in s.publicKey)||typeof s.publicKey.toBase58!=`function`)throw Error(`@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API`);t=[`${c.host} wants you to sign in with your Solana account:`,s.publicKey.toBase58(),...a?[``,a,``]:[``],`Version: 1`,`URI: ${c.href}`,`Issued At: ${o?.signInWithSolana?.issuedAt??new Date().toISOString()}`,...o?.signInWithSolana?.notBefore?[`Not Before: ${o.signInWithSolana.notBefore}`]:[],...o?.signInWithSolana?.expirationTime?[`Expiration Time: ${o.signInWithSolana.expirationTime}`]:[],...o?.signInWithSolana?.chainId?[`Chain ID: ${o.signInWithSolana.chainId}`]:[],...o?.signInWithSolana?.nonce?[`Nonce: ${o.signInWithSolana.nonce}`]:[],...o?.signInWithSolana?.requestId?[`Request ID: ${o.signInWithSolana.requestId}`]:[],...o?.signInWithSolana?.resources?.length?[`Resources`,...o.signInWithSolana.resources.map(e=>`- ${e}`)]:[]].join(`
`);let e=await s.signMessage(new TextEncoder().encode(t),`utf8`);if(!e||!(e instanceof Uint8Array))throw Error(`@supabase/auth-js: Wallet signMessage() API returned an recognized value`);n=e}}try{let{data:r,error:i}=await I(this.fetch,`POST`,`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:`solana`,message:t,signature:fr(n)},e.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options?.captchaToken}}:null),xform:L});if(i)throw i;if(!r||!r.session||!r.user){let e=new Un;return this._returnResult({data:{user:null,session:null},error:e})}return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(`SIGNED_IN`,r.session)),this._returnResult({data:Object.assign({},r),error:i})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async _exchangeCodeForSession(e,t){let n=t?.flowId!=null,r=n?Ar(t?.flowId):M()?Ar(_r(window.location.href)[In]):null;n&&!r&&this._debug(`#_exchangeCodeForSession()`,`provided flowId is not a valid flow id`,t?.flowId);let{verifier:i,flowId:a}=n&&!r?{verifier:null,flowId:null}:await Ir(this.storage,this.storageKey,r),[o,s]=(i??``).split(`/`);try{if(!o&&this.flowType===`pkce`)throw new Jn;let{data:t,error:n}=await I(this.fetch,`POST`,`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:o},xform:L});if(await F(this.storage,this.storageKey,a),n)throw n;if(!t||!t.session||!t.user){let e=new Un;return this._returnResult({data:{user:null,session:null,redirectType:null},error:e})}return t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers(s===`recovery`?`PASSWORD_RECOVERY`:`SIGNED_IN`,t.session)),this._returnResult({data:Object.assign(Object.assign({},t),{redirectType:s??null}),error:n})}catch(e){if(await F(this.storage,this.storageKey,a),A(e))return this._returnResult({data:{user:null,session:null,redirectType:null},error:e});throw e}}async signInWithIdToken(e){try{let{options:t,provider:n,token:r,access_token:i,nonce:a}=e,{data:o,error:s}=await I(this.fetch,`POST`,`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:n,id_token:r,access_token:i,nonce:a,gotrue_meta_security:{captcha_token:t?.captchaToken}},xform:L});if(s)return this._returnResult({data:{user:null,session:null},error:s});if(!o||!o.session||!o.user){let e=new Un;return this._returnResult({data:{user:null,session:null},error:e})}return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers(`SIGNED_IN`,o.session)),this._returnResult({data:o,error:s})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithOtp(e){let t=null;try{if(`email`in e){let{email:n,options:r}=e,i=null,a=null;this.flowType===`pkce`&&([i,a,t]=await this._getCodeChallengeAndMethod());let{error:o}=await I(this.fetch,`POST`,`${this.url}/otp`,{headers:this.headers,body:{email:n,data:r?.data??{},create_user:r?.shouldCreateUser??!0,gotrue_meta_security:{captcha_token:r?.captchaToken},code_challenge:i,code_challenge_method:a},redirectTo:this._maybeAppendFlowIdToRedirect(r?.emailRedirectTo,t)});return this._returnResult({data:{user:null,session:null},error:o})}if(`phone`in e){let{phone:t,options:n}=e,{data:r,error:i}=await I(this.fetch,`POST`,`${this.url}/otp`,{headers:this.headers,body:{phone:t,data:n?.data??{},create_user:n?.shouldCreateUser??!0,gotrue_meta_security:{captcha_token:n?.captchaToken},channel:n?.channel??`sms`}});return this._returnResult({data:{user:null,session:null,messageId:r?.message_id},error:i})}throw new Wn(`You must provide either an email or phone number.`)}catch(e){if(await F(this.storage,this.storageKey,t),A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async verifyOtp(e){try{let t,n;`options`in e&&(t=e.options?.redirectTo,n=e.options?.captchaToken);let{data:r,error:i}=await I(this.fetch,`POST`,`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:n}}),redirectTo:t,xform:L});if(i)throw i;if(!r)throw Error(`An error occurred on token verification.`);let a=r.session,o=r.user;return a?.access_token&&(await this._saveSession(a),await this._notifyAllSubscribers(e.type==`recovery`?`PASSWORD_RECOVERY`:`SIGNED_IN`,a)),this._returnResult({data:{user:o,session:a},error:null})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithSSO(e){let t=null;try{let n=null,r=null;this.flowType===`pkce`&&([n,r,t]=await this._getCodeChallengeAndMethod());let i=await I(this.fetch,`POST`,`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},`providerId`in e?{provider_id:e.providerId}:null),`domain`in e?{domain:e.domain}:null),{redirect_to:this._maybeAppendFlowIdToRedirect(e.options?.redirectTo,t)}),e?.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:n,code_challenge_method:r}),headers:this.headers,xform:ri});return i.data?.url&&M()&&!e.options?.skipBrowserRedirect&&window.location.assign(i.data.url),this._returnResult(i)}catch(e){if(await F(this.storage,this.storageKey,t),A(e))return this._returnResult({data:null,error:e});throw e}}async reauthenticate(){return await this.initializePromise,this.lock==null?await this._reauthenticate():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._reauthenticate())}async _reauthenticate(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)throw n;if(!t)throw new j;let{error:r}=await I(this.fetch,`GET`,`${this.url}/reauthenticate`,{headers:this.headers,jwt:t.access_token});return this._returnResult({data:{user:null,session:null},error:r})})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async resend(e){let t=null;try{let n=`${this.url}/resend`;if(`email`in e){let{email:r,type:i,options:a}=e,o=null,s=null;this.flowType===`pkce`&&([o,s,t]=await this._getCodeChallengeAndMethod());let{error:c}=await I(this.fetch,`POST`,n,{headers:this.headers,body:{email:r,type:i,gotrue_meta_security:{captcha_token:a?.captchaToken},code_challenge:o,code_challenge_method:s},redirectTo:this._maybeAppendFlowIdToRedirect(a?.emailRedirectTo,t)});return c&&await F(this.storage,this.storageKey,t),this._returnResult({data:{user:null,session:null},error:c})}if(`phone`in e){let{phone:t,type:r,options:i}=e,{data:a,error:o}=await I(this.fetch,`POST`,n,{headers:this.headers,body:{phone:t,type:r,gotrue_meta_security:{captcha_token:i?.captchaToken}}});return this._returnResult({data:{user:null,session:null,messageId:a?.message_id},error:o})}throw new Wn(`You must provide either an email or phone number and a type`)}catch(e){if(await F(this.storage,this.storageKey,t),A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async getSession(){return await this.initializePromise,this.lock==null?await this._useSession(async e=>e):await this._acquireLock(this.lockAcquireTimeout,async()=>this._useSession(async e=>e))}async _acquireLock(e,t){this._debug(`#_acquireLock`,`begin`,e);try{if(this.lockAcquired){let e=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),n=(async()=>(await e,await t()))();return this.pendingInLock.push((async()=>{try{await n}catch{}})()),n}return await this.lock(`lock:${this.storageKey}`,e,async()=>{this._debug(`#_acquireLock`,`lock acquired for storage key`,this.storageKey);try{this.lockAcquired=!0;let e=t();for(this.pendingInLock.push((async()=>{try{await e}catch{}})()),await e;this.pendingInLock.length;){let e=[...this.pendingInLock];await Promise.all(e),this.pendingInLock.splice(0,e.length)}return await e}finally{this._debug(`#_acquireLock`,`lock released for storage key`,this.storageKey),this.lockAcquired=!1}})}finally{this._debug(`#_acquireLock`,`end`)}}async _useSession(e){this._debug(`#_useSession`,`begin`);try{return await e(await this.__loadSession())}finally{this._debug(`#_useSession`,`end`)}}async __loadSession(){this._debug(`#__loadSession()`,`begin`),this.lock!=null&&!this.lockAcquired&&this._debug(`#__loadSession()`,`used outside of an acquired lock!`,Error().stack);try{let e=null,t=await N(this.storage,this.storageKey);if(this._debug(`#getSession()`,`session from storage`,t),t!==null&&(this._isValidSession(t)?e=t:(this._debug(`#getSession()`,`session from storage is not valid`),await this._removeSession())),!e)return{data:{session:null},error:null};let n=e.expires_at?e.expires_at*1e3-Date.now()<On:!1;if(this._debug(`#__loadSession()`,`session has${n?``:` not`} expired`,`expires_at`,e.expires_at),!n)return{data:{session:await this._hydrateSessionUser(e)},error:null};let{data:r,error:i}=await this._callRefreshToken(e.refresh_token);if(i){let e=await N(this.storage,this.storageKey);return e&&this._isValidSession(e)&&e.expires_at&&e.expires_at*1e3>Date.now()?this._returnResult({data:{session:await this._hydrateSessionUser(e)},error:null}):this._returnResult({data:{session:null},error:i})}return this._returnResult({data:{session:r},error:null})}finally{this._debug(`#__loadSession()`,`end`)}}async _hydrateSessionUser(e){if(this.userStorage){let t=await N(this.userStorage,this.storageKey+`-user`);e.user=t?.user?t.user:qr()}if(this.storage.isServer&&e.user&&!e.user.__isUserNotAvailableProxy){let t={value:this.suppressGetSessionWarning};e.user=Jr(e.user,t),t.value&&(this.suppressGetSessionWarning=!0)}return e}async getUser(e){if(e)return await this._getUser(e);await this.initializePromise;let t;return t=this.lock==null?await this._getUser():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._getUser()),t.data.user&&(this.suppressGetSessionWarning=!0),t}async _getUser(e){try{return e?await I(this.fetch,`GET`,`${this.url}/user`,{headers:this.headers,jwt:e,xform:ni}):await this._useSession(async e=>{let{data:t,error:n}=e;if(n)throw n;return!t.session?.access_token&&!this.hasCustomAuthorizationHeader?{data:{user:null},error:new j}:await I(this.fetch,`GET`,`${this.url}/user`,{headers:this.headers,jwt:t.session?.access_token??void 0,xform:ni})})}catch(e){if(A(e))return Hn(e)&&await this._removeSession(),this._returnResult({data:{user:null},error:e});throw e}}async updateUser(e,t={}){return await this.initializePromise,this.lock==null?await this._updateUser(e,t):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._updateUser(e,t))}async _updateUser(e,t={}){let n=null;try{return await this._useSession(async r=>{let{data:i,error:a}=r;if(a)throw a;if(!i.session)throw new j;let o=i.session,s=null,c=null;this.flowType===`pkce`&&e.email!=null&&([s,c,n]=await this._getCodeChallengeAndMethod());let{data:l,error:u}=await I(this.fetch,`PUT`,`${this.url}/user`,{headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(t?.emailRedirectTo,n),body:Object.assign(Object.assign({},e),{code_challenge:s,code_challenge_method:c}),jwt:o.access_token,xform:ni});if(u)throw u;return o.user=l.user,await this._saveSession(o),await this._notifyAllSubscribers(`USER_UPDATED`,o),this._returnResult({data:{user:o.user},error:null})})}catch(e){if(await F(this.storage,this.storageKey,n),A(e))return this._returnResult({data:{user:null},error:e});throw e}}async setSession(e){return await this.initializePromise,this.lock==null?await this._setSession(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._setSession(e))}async _setSession(e){try{if(!e.access_token||!e.refresh_token)throw new j;let t=Date.now()/1e3,n=t,r=!0,i=null,{payload:a}=Sr(e.access_token);if(a.exp&&(n=a.exp,r=n<=t),r){let{data:t,error:n}=await this._callRefreshToken(e.refresh_token);if(n)return this._returnResult({data:{user:null,session:null},error:n});if(!t)return{data:{user:null,session:null},error:null};i=t}else{let{data:r,error:a}=await this._getUser(e.access_token);if(a)return this._returnResult({data:{user:null,session:null},error:a});i={access_token:e.access_token,refresh_token:e.refresh_token,user:r.user,token_type:`bearer`,expires_in:n-t,expires_at:n},await this._saveSession(i),await this._notifyAllSubscribers(`SIGNED_IN`,i)}return this._returnResult({data:{user:i.user,session:i},error:null})}catch(e){if(A(e))return this._returnResult({data:{session:null,user:null},error:e});throw e}}async refreshSession(e){return await this.initializePromise,this.lock==null?await this._refreshSession(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._refreshSession(e))}async _refreshSession(e){try{return await this._useSession(async t=>{if(!e){let{data:n,error:r}=t;if(r)throw r;e=n.session??void 0}if(!e?.refresh_token)throw new j;let{data:n,error:r}=await this._callRefreshToken(e.refresh_token);return r?this._returnResult({data:{user:null,session:null},error:r}):n?this._returnResult({data:{user:n.user,session:n},error:null}):this._returnResult({data:{user:null,session:null},error:null})})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async _getSessionFromURL(e,t){try{if(!M())throw new Gn(`No browser detected.`);if(e.error||e.error_description||e.error_code)throw new Gn(e.error_description||`Error in URL with unspecified error_description`,{error:e.error||`unspecified_error`,code:e.error_code||`unspecified_code`});switch(t){case`implicit`:if(this.flowType===`pkce`)throw new qn(`Not a valid PKCE flow url.`);break;case`pkce`:if(this.flowType===`implicit`)throw new Gn(`Not a valid implicit grant flow url.`)}if(t===`pkce`){if(this._debug(`#_initialize()`,`begin`,`is PKCE flow`,!0),!e.code)throw new qn(`No code detected.`);let{data:t,error:n}=await this._exchangeCodeForSession(e.code,{flowId:e[In]});if(n)throw n;let r=new URL(window.location.href);return r.searchParams.delete(`code`),r.searchParams.delete(In),window.history.replaceState(window.history.state,``,r.toString()),{data:{session:t.session,redirectType:t.redirectType??null},error:null}}let{provider_token:n,provider_refresh_token:r,access_token:i,refresh_token:a,expires_in:o,expires_at:s,token_type:c}=e;if(!i||!o||!a||!c)throw new Gn(`No session defined in URL`);let l=Math.round(Date.now()/1e3),u=parseInt(o),d=l+u;s&&(d=parseInt(s));let f=d-l;f*1e3<=3e4&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${f}s, should have been closer to ${u}s`);let p=d-u;l-p>=120?console.warn(`@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale`,p,d,l):l-p<0&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew`,p,d,l);let{data:m,error:h}=await this._getUser(i);if(h)throw h;let g={provider_token:n,provider_refresh_token:r,access_token:i,expires_in:u,expires_at:d,refresh_token:a,token_type:c,user:m.user};return window.location.hash=``,this._debug(`#_getSessionFromURL()`,`clearing window.location.hash`),this._returnResult({data:{session:g,redirectType:e.type},error:null})}catch(e){if(A(e))return this._returnResult({data:{session:null,redirectType:null},error:e});throw e}}_isImplicitGrantCallback(e){return typeof this.detectSessionInUrl==`function`?this.detectSessionInUrl(new URL(window.location.href),e):!!(e.access_token||e.error||e.error_description||e.error_code)}async _isPKCECallback(e){if(!e.code)return!1;let t=Ar(e[In]);return t&&await N(this.storage,Mr(this.storageKey,t))?!0:!!await N(this.storage,`${this.storageKey}-code-verifier`)}async signOut(e={scope:`global`}){return await this.initializePromise,this.lock==null?await this._signOut(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._signOut(e))}async _signOut({scope:e}={scope:`global`}){return await this._useSession(async t=>{let n=async()=>{await this._removeSession()},{data:r,error:i}=t;if(i&&!Hn(i))return this._returnResult({error:i});let a=r.session?.access_token;if(a){let{error:t}=await this.admin.signOut(a,e);if(t&&!(zn(t)&&(t.status===404||t.status===401||t.status===403)||Hn(t)))return e!==`others`&&await n(),this._returnResult({error:t})}return e!==`others`&&await n(),this._returnResult({error:null})})}onAuthStateChange(e){let t=mr(),n={id:t,callback:e,unsubscribe:()=>{this._debug(`#unsubscribe()`,`state change callback with id removed`,t),this.stateChangeEmitters.delete(t)}};return this._debug(`#onAuthStateChange()`,`registered callback with id`,t),this.stateChangeEmitters.set(t,n),(async()=>{await this.initializePromise,this.lock==null?await this._emitInitialSession(t):await this._acquireLock(this.lockAcquireTimeout,async()=>{this._emitInitialSession(t)})})(),{data:{subscription:n}}}async _emitInitialSession(e){return await this._useSession(async t=>{try{let{data:{session:n},error:r}=t;if(r)throw r;await this.stateChangeEmitters.get(e)?.callback(`INITIAL_SESSION`,n),this._debug(`INITIAL_SESSION`,`callback id`,e,`session`,n)}catch(t){if(await this.stateChangeEmitters.get(e)?.callback(`INITIAL_SESSION`,null),this._debug(`INITIAL_SESSION`,`callback id`,e,`error`,t),Qn(t))return;Hn(t)||Xn(t)||zn(t)&&(t.code===`refresh_token_not_found`||t.code===`refresh_token_already_used`||t.code===`session_expired`)?console.warn(t):console.error(t)}})}async resetPasswordForEmail(e,t={}){let n=null,r=null,i=null;this.flowType===`pkce`&&([n,r,i]=await this._getCodeChallengeAndMethod(!0));try{return await I(this.fetch,`POST`,`${this.url}/recover`,{body:{email:e,code_challenge:n,code_challenge_method:r,gotrue_meta_security:{captcha_token:t.captchaToken}},headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(t.redirectTo,i)})}catch(e){if(await F(this.storage,this.storageKey,i),A(e))return this._returnResult({data:null,error:e});throw e}}async getUserIdentities(){try{let{data:e,error:t}=await this.getUser();if(t)throw t;return this._returnResult({data:{identities:e.user.identities??[]},error:null})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async linkIdentity(e){return`token`in e?this.linkIdentityIdToken(e):this.linkIdentityOAuth(e)}async linkIdentityOAuth(e){let t=null;try{let{data:n,error:r}=await this._useSession(async n=>{let{data:r,error:i}=n;if(i)throw i;let{url:a,flowId:o}=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,e.provider,{redirectTo:e.options?.redirectTo,scopes:e.options?.scopes,queryParams:e.options?.queryParams,skipBrowserRedirect:!0});return t=o,await I(this.fetch,`GET`,a,{headers:this.headers,jwt:r.session?.access_token??void 0})});if(r)throw r;return M()&&!e.options?.skipBrowserRedirect&&window.location.assign(n?.url),this._returnResult({data:{provider:e.provider,url:n?.url,flowId:t},error:null})}catch(n){if(A(n))return this._returnResult({data:{provider:e.provider,url:null,flowId:t},error:n});throw n}}async linkIdentityIdToken(e){return await this._useSession(async t=>{try{let{error:n,data:{session:r}}=t;if(n)throw n;let{options:i,provider:a,token:o,access_token:s,nonce:c}=e,{data:l,error:u}=await I(this.fetch,`POST`,`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:r?.access_token??void 0,body:{provider:a,id_token:o,access_token:s,nonce:c,link_identity:!0,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:L});return u?this._returnResult({data:{user:null,session:null},error:u}):!l||!l.session||!l.user?this._returnResult({data:{user:null,session:null},error:new Un}):(l.session&&(await this._saveSession(l.session),await this._notifyAllSubscribers(`USER_UPDATED`,l.session)),this._returnResult({data:l,error:u}))}catch(e){if(await F(this.storage,this.storageKey,null),A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}})}async unlinkIdentity(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)throw r;return await I(this.fetch,`DELETE`,`${this.url}/user/identities/${e.identity_id}`,{headers:this.headers,jwt:n.session?.access_token??void 0})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _refreshAccessToken(e){let t=`#_refreshAccessToken()`;this._debug(t,`begin`);try{let n=Date.now();return await wr(async n=>(n>0&&await Cr(200*2**(n-1)),this._debug(t,`refreshing attempt`,n),await I(this.fetch,`POST`,`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:L})),(e,t)=>{let r=200*2**e;return t&&Xn(t)&&Date.now()+r-n<3e4})}catch(e){if(this._debug(t,`error`,e),A(e))return this._returnResult({data:{session:null,user:null},error:e});throw e}finally{this._debug(t,`end`)}}_isValidSession(e){return typeof e==`object`&&!!e&&`access_token`in e&&`refresh_token`in e&&`expires_at`in e}async _handleProviderSignIn(e,t){let{url:n,flowId:r}=await this._getUrlForProvider(`${this.url}/authorize`,e,{redirectTo:t.redirectTo,scopes:t.scopes,queryParams:t.queryParams});return this._debug(`#_handleProviderSignIn()`,`provider`,e,`options`,t,`url`,n),M()&&!t.skipBrowserRedirect&&window.location.assign(n),{data:{provider:e,url:n,flowId:r},error:null}}async _recoverAndRefresh(){let e=`#_recoverAndRefresh()`;this._debug(e,`begin`);try{let t=await N(this.storage,this.storageKey);if(t&&this.userStorage){let e=await N(this.userStorage,this.storageKey+`-user`);!this.storage.isServer&&Object.is(this.storage,this.userStorage)&&!e&&(e={user:t.user},await br(this.userStorage,this.storageKey+`-user`,e)),t.user=e?.user??qr()}else if(t&&!t.user&&!t.user){let e=await N(this.storage,this.storageKey+`-user`);e&&e?.user?(t.user=e.user,await P(this.storage,this.storageKey+`-user`),await br(this.storage,this.storageKey,t)):t.user=qr()}if(this._debug(e,`session from storage`,t),!this._isValidSession(t)){this._debug(e,`session is not valid`),t!==null&&await this._removeSession();return}let n=(t.expires_at??1/0)*1e3-Date.now()<On;if(this._debug(e,`session has${n?``:` not`} expired with margin of ${On}s`),n){if(this.autoRefreshToken&&t.refresh_token){let{error:n}=await this._callRefreshToken(t.refresh_token);n&&(Qn(n)?this._debug(e,`refresh discarded by commit guard`,n):this._debug(e,`refresh failed`,n))}}else if(t.user&&t.user.__isUserNotAvailableProxy===!0)try{let{data:n,error:r}=await this._getUser(t.access_token);!r&&n?.user?(t.user=n.user,await this._saveSession(t),await this._notifyAllSubscribers(`SIGNED_IN`,t)):this._debug(e,`could not get user data, skipping SIGNED_IN notification`)}catch(t){console.error(`Error getting user data:`,t),this._debug(e,`error getting user data, skipping SIGNED_IN notification`,t)}else await this._notifyAllSubscribers(`SIGNED_IN`,t)}catch(t){this._debug(e,`error`,t),Xn(t)?console.warn(t):console.error(t);return}finally{this._debug(e,`end`)}}async _callRefreshToken(e){var t,n;if(!e)throw new j;if(this.refreshingDeferred)return this.refreshingDeferred.promise;if(this.lastRefreshFailure&&this.lastRefreshFailure.refreshToken===e&&Date.now()<this.lastRefreshFailure.expiresAt)return this._debug(`#_callRefreshToken()`,`returning cached failure (cooldown active)`),this.lastRefreshFailure.result;let r=`#_callRefreshToken()`;this._debug(r,`begin`);try{this.refreshingDeferred=new xr,this.refreshingDeferred.promise.then(void 0,()=>{});let t=await N(this.storage,this.storageKey),{data:n,error:i}=await this._refreshAccessToken(e);if(i)throw i;if(!n.session)throw new j;let a=await N(this.storage,this.storageKey);if(t!==null&&(a===null||a.refresh_token!==t.refresh_token)){this._debug(r,`commit guard: storage changed since refresh started, discarding rotated tokens`,{startedWith:`present`,nowHolds:a?`replaced`:`cleared`});let e={data:null,error:new Zn};return this.refreshingDeferred.resolve(e),e}let o=this._sessionRemovalEpoch;if(await this._saveSession(n.session),this._sessionRemovalEpoch!==o){this._debug(r,`commit guard (post-save): _removeSession ran during _saveSession, undoing write`),await P(this.storage,this.storageKey),this.userStorage&&await P(this.userStorage,this.storageKey+`-user`);let e={data:null,error:new Zn};return this.refreshingDeferred.resolve(e),e}await this._notifyAllSubscribers(`TOKEN_REFRESHED`,n.session);let s={data:n.session,error:null};return this.lastRefreshFailure=null,this.refreshingDeferred.resolve(s),s}catch(i){if(this._debug(r,`error`,i),A(i)){let n={data:null,error:i};if(!Xn(i)){let e=await N(this.storage,this.storageKey);e?.expires_at&&e.expires_at*1e3>Date.now()?this._debug(r,`proactive refresh failed, access token still valid — preserving session`):await this._removeSession()}return this.lastRefreshFailure={refreshToken:e,result:n,expiresAt:Date.now()+kn},(t=this.refreshingDeferred)==null||t.resolve(n),n}throw(n=this.refreshingDeferred)==null||n.reject(i),i}finally{this.refreshingDeferred=null,this._debug(r,`end`)}}async _notifyAllSubscribers(e,t,n=!0){if(this._pendingInitNotifications!==null&&n){this._pendingInitNotifications.push({event:e,session:t,broadcast:n});return}let r=`#_notifyAllSubscribers(${e})`;this._debug(r,`begin`,t,`broadcast = ${n}`);try{this.broadcastChannel&&n&&this.broadcastChannel.postMessage({event:e,session:t});let r=[],i=Array.from(this.stateChangeEmitters.values()).map(async n=>{try{await n.callback(e,t)}catch(e){r.push(e)}});if(await Promise.all(i),r.length>0){for(let e=0;e<r.length;e+=1)console.error(r[e]);throw r[0]}}finally{this._debug(r,`end`)}}async _saveSession(e){this._debug(`#_saveSession()`,e),this.suppressGetSessionWarning=!0;let t=Object.assign({},e),n=t.user&&t.user.__isUserNotAvailableProxy===!0;if(this.userStorage){!n&&t.user&&await br(this.userStorage,this.storageKey+`-user`,{user:t.user});let e=Object.assign({},t);delete e.user;let r=Yr(e);await br(this.storage,this.storageKey,r)}else{let e=Yr(t);await br(this.storage,this.storageKey,e)}}async _removeSession(){this._sessionRemovalEpoch+=1,this._debug(`#_removeSession()`),this.lastRefreshFailure=null,this.suppressGetSessionWarning=!1,await P(this.storage,this.storageKey),await Lr(this.storage,this.storageKey),await P(this.storage,this.storageKey+`-user`),this.userStorage&&await P(this.userStorage,this.storageKey+`-user`),await this._notifyAllSubscribers(`SIGNED_OUT`,null)}_removeVisibilityChangedCallback(){this._debug(`#_removeVisibilityChangedCallback()`);let e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&M()&&window!=null&&window.removeEventListener&&window.removeEventListener(`visibilitychange`,e)}catch(e){console.error(`removing visibilitychange callback failed`,e)}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug(`#_startAutoRefresh()`);let e=setInterval(()=>this._autoRefreshTokenTick(),Dn);this.autoRefreshTicker=e,e&&typeof e==`object`&&typeof e.unref==`function`?e.unref():typeof Deno<`u`&&typeof Deno.unrefTimer==`function`&&Deno.unrefTimer(e);let t=setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0);this.autoRefreshTickTimeout=t,t&&typeof t==`object`&&typeof t.unref==`function`?t.unref():typeof Deno<`u`&&typeof Deno.unrefTimer==`function`&&Deno.unrefTimer(t)}async _stopAutoRefresh(){this._debug(`#_stopAutoRefresh()`);let e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e);let t=this.autoRefreshTickTimeout;this.autoRefreshTickTimeout=null,t&&clearTimeout(t)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async dispose(){var e;this._removeVisibilityChangedCallback(),await this._stopAutoRefresh(),(e=this.broadcastChannel)==null||e.close(),this.broadcastChannel=null,this.stateChangeEmitters.clear()}async _autoRefreshTokenTick(){if(this._debug(`#_autoRefreshTokenTick()`,`begin`),this.lock!=null)try{await this._acquireLock(0,async()=>{try{let e=Date.now();try{return await this._useSession(async t=>{let{data:{session:n}}=t;if(!n||!n.refresh_token||!n.expires_at){this._debug(`#_autoRefreshTokenTick()`,`no session`);return}let r=Math.floor((n.expires_at*1e3-e)/Dn);this._debug(`#_autoRefreshTokenTick()`,`access token expires in ${r} ticks, a tick lasts ${Dn}ms, refresh threshold is 3 ticks`),r<=3&&await this._callRefreshToken(n.refresh_token)})}catch(e){console.error(`Auto refresh tick failed with error. This is likely a transient error.`,e)}}finally{this._debug(`#_autoRefreshTokenTick()`,`end`)}})}catch(e){if(e instanceof ui)this._debug(`auto refresh token tick lock not available`);else throw e}else if(this.refreshingDeferred!==null)this._debug(`#_autoRefreshTokenTick()`,`refresh already in flight, skipping`);else try{let e=Date.now();try{await this._useSession(async t=>{let{data:{session:n}}=t;if(!n||!n.refresh_token||!n.expires_at){this._debug(`#_autoRefreshTokenTick()`,`no session`);return}let r=Math.floor((n.expires_at*1e3-e)/Dn);this._debug(`#_autoRefreshTokenTick()`,`access token expires in ${r} ticks, a tick lasts ${Dn}ms, refresh threshold is 3 ticks`),r<=3&&await this._callRefreshToken(n.refresh_token)})}catch(e){console.error(`Auto refresh tick failed with error. This is likely a transient error.`,e)}}finally{this._debug(`#_autoRefreshTokenTick()`,`end`)}}async _handleVisibilityChange(){if(this._debug(`#_handleVisibilityChange()`),!M()||!(window!=null&&window.addEventListener))return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>{try{await this._onVisibilityChanged(!1)}catch(e){this._debug(`#visibilityChangedCallback`,`error`,e)}},window==null||window.addEventListener(`visibilitychange`,this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch(e){console.error(`_handleVisibilityChange`,e)}}async _onVisibilityChanged(e){let t=`#_onVisibilityChanged(${e})`;if(this._debug(t,`visibilityState`,document.visibilityState),document.visibilityState===`visible`){if(this.autoRefreshToken&&this._startAutoRefresh(),!e){if(await this.initializePromise,this.lock!=null)await this._acquireLock(this.lockAcquireTimeout,async()=>{document.visibilityState===`visible`?await this._recoverAndRefresh():this._debug(t,`acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting`)});else{if(document.visibilityState!==`visible`){this._debug(t,`visibilityState is no longer visible, skipping recovery`);return}await this._recoverAndRefresh()}}}else document.visibilityState===`hidden`&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(e,t,n){let r=n?.redirectTo,i=null,a=null,o=null;this.flowType===`pkce`&&([i,a,o]=await this._getCodeChallengeAndMethod(),r=this._maybeAppendFlowIdToRedirect(r,o));let s=[`provider=${encodeURIComponent(t)}`];if(r&&s.push(`redirect_to=${encodeURIComponent(r)}`),n?.scopes&&s.push(`scopes=${encodeURIComponent(n.scopes)}`),i!=null&&a!=null){let e=new URLSearchParams({code_challenge:`${encodeURIComponent(i)}`,code_challenge_method:`${encodeURIComponent(a)}`});s.push(e.toString())}if(n?.queryParams){let e=new URLSearchParams(n.queryParams);s.push(e.toString())}return n?.skipBrowserRedirect&&s.push(`skip_http_redirect=${n.skipBrowserRedirect}`),{url:`${e}?${s.join(`&`)}`,flowId:o}}_maybeAppendFlowIdToRedirect(e,t){return!e||!t||!this.experimental.appendPkceFlowIdToRedirects?e??void 0:Rr(e,t)}async _getCodeChallengeAndMethod(e=!1){return zr(this.storage,this.storageKey,e,e=>this._debug(`#_getCodeChallengeAndMethod()`,`evicted oldest pending PKCE verifier slot`,e))}async _unenroll(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;return r?this._returnResult({data:null,error:r}):await I(this.fetch,`DELETE`,`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:n?.session?.access_token})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _enroll(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=Object.assign({friendly_name:e.friendlyName,factor_type:e.factorType},e.factorType===`phone`?{phone:e.phone}:e.factorType===`totp`?{issuer:e.issuer}:{}),{data:a,error:o}=await I(this.fetch,`POST`,`${this.url}/factors`,{body:i,headers:this.headers,jwt:n?.session?.access_token});return o?this._returnResult({data:null,error:o}):(e.factorType===`totp`&&a.type===`totp`&&a?.totp?.qr_code&&(a.totp.qr_code=`data:image/svg+xml;utf-8,${a.totp.qr_code}`),this._returnResult({data:a,error:null}))})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _verify(e){let t=async()=>{try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=Object.assign({challenge_id:e.challengeId},`webauthn`in e?{webauthn:Object.assign(Object.assign({},e.webauthn),{credential_response:e.webauthn.type===`create`?Si(e.webauthn.credential_response):Ci(e.webauthn.credential_response)})}:{code:e.code}),{data:a,error:o}=await I(this.fetch,`POST`,`${this.url}/factors/${e.factorId}/verify`,{body:i,headers:this.headers,jwt:n?.session?.access_token});return o?this._returnResult({data:null,error:o}):(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+a.expires_in},a)),await this._notifyAllSubscribers(`MFA_CHALLENGE_VERIFIED`,a),this._returnResult({data:a,error:o}))})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}};return this.lock==null?t():this._acquireLock(this.lockAcquireTimeout,t)}async _challenge(e){let t=async()=>{try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=await I(this.fetch,`POST`,`${this.url}/factors/${e.factorId}/challenge`,{body:e,headers:this.headers,jwt:n?.session?.access_token});if(i.error)return i;let{data:a}=i;if(a.type!==`webauthn`)return{data:a,error:null};switch(a.webauthn.type){case`create`:return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:bi(a.webauthn.credential_options.publicKey)})})}),error:null};case`request`:return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:xi(a.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}};return this.lock==null?t():this._acquireLock(this.lockAcquireTimeout,t)}async _challengeAndVerify(e){let{data:t,error:n}=await this._challenge({factorId:e.factorId});return n?this._returnResult({data:null,error:n}):await this._verify({factorId:e.factorId,challengeId:t.id,code:e.code})}async _listFactors(){let{data:{user:e},error:t}=await this.getUser();if(t)return{data:null,error:t};let n={all:[],phone:[],totp:[],webauthn:[],recovery_code:[]};for(let t of e?.factors??[])n.all.push(t),t.status===`verified`&&t.factor_type in n&&Array.isArray(n[t.factor_type])&&n[t.factor_type].push(t);return{data:n,error:null}}async _getAuthenticatorAssuranceLevel(e){if(e)try{let{payload:t}=Sr(e),n=null;t.aal&&(n=t.aal);let r=n,{data:{user:i},error:a}=await this.getUser(e);if(a)return this._returnResult({data:null,error:a});((i?.factors)?.filter(e=>e.status===`verified`)??[]).length>0&&(r=`aal2`);let o=t.amr||[];return{data:{currentLevel:n,nextLevel:r,currentAuthenticationMethods:o},error:null}}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}let{data:{session:t},error:n}=await this.getSession();if(n)return this._returnResult({data:null,error:n});if(!t)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};let{payload:r}=Sr(t.access_token),i=null;r.aal&&(i=r.aal);let a=i;(t.user.factors?.filter(e=>e.status===`verified`)??[]).length>0&&(a=`aal2`);let o=r.amr||[];return{data:{currentLevel:i,nextLevel:a,currentAuthenticationMethods:o},error:null}}async _getRecoveryCodesStatus(){Kr(this.experimental);try{return await this._useSession(async e=>{let{data:t,error:n}=e;if(n)return this._returnResult({data:null,error:n});let{data:r,error:i}=await I(this.fetch,`GET`,`${this.url}/factors/recovery-codes`,{headers:this.headers,jwt:t?.session?.access_token});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _generateRecoveryCodes(e){Kr(this.experimental);try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let{data:i,error:a}=await I(this.fetch,`POST`,`${this.url}/factors/recovery-codes`,{body:e?.friendlyName?{friendly_name:e.friendlyName}:void 0,headers:this.headers,jwt:n?.session?.access_token});return a?this._returnResult({data:null,error:a}):this._returnResult({data:i,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _verifyRecoveryCode(e){Kr(this.experimental);let t=async()=>{try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let{data:i,error:a}=await I(this.fetch,`POST`,`${this.url}/factors/recovery-codes/verify`,{body:{code:e.code},headers:this.headers,jwt:n?.session?.access_token});if(a)return this._returnResult({data:null,error:a});let o=Object.assign({expires_at:pr(i.expires_in)},i);return await this._saveSession(o),await this._notifyAllSubscribers(`MFA_CHALLENGE_VERIFIED`,o),this._returnResult({data:i,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}};return this.lock==null?t():this._acquireLock(this.lockAcquireTimeout,t)}async _regenerateRecoveryCodes(){Kr(this.experimental);try{return await this._useSession(async e=>{let{data:t,error:n}=e;if(n)return this._returnResult({data:null,error:n});let{data:r,error:i}=await I(this.fetch,`POST`,`${this.url}/factors/recovery-codes/regenerate`,{headers:this.headers,jwt:t?.session?.access_token});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _unenrollRecoveryCodes(){Kr(this.experimental);try{return await this._useSession(async e=>{let{data:t,error:n}=e;if(n)return this._returnResult({data:null,error:n});let{data:r,error:i}=await I(this.fetch,`DELETE`,`${this.url}/factors/recovery-codes`,{headers:this.headers,jwt:t?.session?.access_token});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _getAuthorizationDetails(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;return r?this._returnResult({data:null,error:r}):n?await I(this.fetch,`GET`,`${this.url}/oauth/authorizations/${e}`,{headers:this.headers,jwt:n.access_token,xform:e=>({data:e,error:null})}):this._returnResult({data:null,error:new j})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _approveAuthorization(e,t){try{return await this._useSession(async n=>{let{data:{session:r},error:i}=n;if(i)return this._returnResult({data:null,error:i});if(!r)return this._returnResult({data:null,error:new j});let a=await I(this.fetch,`POST`,`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:r.access_token,body:{action:`approve`},xform:e=>({data:e,error:null})});return a.data&&a.data.redirect_url&&M()&&!t?.skipBrowserRedirect&&window.location.assign(a.data.redirect_url),a})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _denyAuthorization(e,t){try{return await this._useSession(async n=>{let{data:{session:r},error:i}=n;if(i)return this._returnResult({data:null,error:i});if(!r)return this._returnResult({data:null,error:new j});let a=await I(this.fetch,`POST`,`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:r.access_token,body:{action:`deny`},xform:e=>({data:e,error:null})});return a.data&&a.data.redirect_url&&M()&&!t?.skipBrowserRedirect&&window.location.assign(a.data.redirect_url),a})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _listOAuthGrants(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;return n?this._returnResult({data:null,error:n}):t?await I(this.fetch,`GET`,`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:t.access_token,xform:e=>({data:e,error:null})}):this._returnResult({data:null,error:new j})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _revokeOAuthGrant(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;return r?this._returnResult({data:null,error:r}):n?(await I(this.fetch,`DELETE`,`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:n.access_token,query:{client_id:e.clientId},noResolveJson:!0}),{data:{},error:null}):this._returnResult({data:null,error:new j})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async fetchJwk(e,t={keys:[]}){let n=t.keys.find(t=>t.kid===e);if(n)return n;let r=Date.now();if(n=this.jwks.keys.find(t=>t.kid===e),n&&this.jwks_cached_at+6e5>r)return n;let{data:i,error:a}=await I(this.fetch,`GET`,`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(a)throw a;return!i.keys||i.keys.length===0||(this.jwks=i,this.jwks_cached_at=r,n=i.keys.find(t=>t.kid===e),!n)?null:n}async getClaims(e,t={}){try{let n=e;if(!n){let{data:e,error:t}=await this.getSession();if(t||!e.session)return this._returnResult({data:null,error:t});n=e.session.access_token}let{header:r,payload:i,signature:a,raw:{header:o,payload:s}}=Sr(n);if(!t?.allowExpired)try{Hr(i.exp)}catch(e){throw new er(e instanceof Error?e.message:`JWT validation failed`)}let c=!r.alg||r.alg.startsWith(`HS`)||!r.kid||!(`crypto`in globalThis&&`subtle`in globalThis.crypto)?null:await this.fetchJwk(r.kid,t?.keys?{keys:t.keys}:t?.jwks);if(!c){let{error:e}=await this.getUser(n);if(e)throw e;return{data:{claims:i,header:r,signature:a},error:null}}let l=Ur(r.alg),u=await crypto.subtle.importKey(`jwk`,c,l,!0,[`verify`]);if(!await crypto.subtle.verify(l,u,a,dr(`${o}.${s}`)))throw new er(`Invalid JWT signature`);return{data:{claims:i,header:r,signature:a},error:null}}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async signInWithPasskey(e){try{if(!Ti())return this._returnResult({data:null,error:new Bn(`Browser does not support WebAuthn`,null)});let{data:t,error:n}=await this._startPasskeyAuthentication({options:{captchaToken:e?.options?.captchaToken}});if(n||!t)return this._returnResult({data:null,error:n});let{data:r,error:i}=await Di({publicKey:xi(t.options),signal:e?.options?.signal??yi.createNewAbortSignal(),mediation:e?.options?.mediation});if(i||!r)return this._returnResult({data:null,error:i??new Bn(`WebAuthn ceremony failed`,null)});let a=Ci(r);return this._verifyPasskeyAuthentication({challengeId:t.challenge_id,credential:a})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async registerPasskey(e){try{if(!Ti())return this._returnResult({data:null,error:new Bn(`Browser does not support WebAuthn`,null)});let{data:t,error:n}=await this._startPasskeyRegistration();if(n||!t)return this._returnResult({data:null,error:n});let{data:r,error:i}=await Ei({publicKey:bi(t.options),signal:e?.options?.signal??yi.createNewAbortSignal()});if(i||!r)return this._returnResult({data:null,error:i??new Bn(`WebAuthn ceremony failed`,null)});let a=Si(r);return this._verifyPasskeyRegistration({challengeId:t.challenge_id,credential:a})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _startPasskeyRegistration(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)return this._returnResult({data:null,error:n});if(!t)return this._returnResult({data:null,error:new j});let{data:r,error:i}=await I(this.fetch,`POST`,`${this.url}/passkeys/registration/options`,{headers:this.headers,jwt:t.access_token,body:{}});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _verifyPasskeyRegistration(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new j});let{data:i,error:a}=await I(this.fetch,`POST`,`${this.url}/passkeys/registration/verify`,{headers:this.headers,jwt:n.access_token,body:{challenge_id:e.challengeId,credential:e.credential}});return a?this._returnResult({data:null,error:a}):this._returnResult({data:i,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _startPasskeyAuthentication(e){try{let{data:t,error:n}=await I(this.fetch,`POST`,`${this.url}/passkeys/authentication/options`,{headers:this.headers,body:{gotrue_meta_security:{captcha_token:e?.options?.captchaToken}}});return n?this._returnResult({data:null,error:n}):this._returnResult({data:t,error:null})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _verifyPasskeyAuthentication(e){try{let{data:t,error:n}=await I(this.fetch,`POST`,`${this.url}/passkeys/authentication/verify`,{headers:this.headers,body:{challenge_id:e.challengeId,credential:e.credential},xform:L});return n?this._returnResult({data:null,error:n}):(t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers(`SIGNED_IN`,t.session)),this._returnResult({data:t,error:null}))}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _listPasskeys(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)return this._returnResult({data:null,error:n});if(!t)return this._returnResult({data:null,error:new j});let{data:r,error:i}=await I(this.fetch,`GET`,`${this.url}/passkeys`,{headers:this.headers,jwt:t.access_token,xform:e=>({data:e,error:null})});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _updatePasskey(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new j});let{data:i,error:a}=await I(this.fetch,`PATCH`,`${this.url}/passkeys/${e.passkeyId}`,{headers:this.headers,jwt:n.access_token,body:{friendly_name:e.friendlyName}});return a?this._returnResult({data:null,error:a}):this._returnResult({data:i,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _deletePasskey(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new j});let{error:i}=await I(this.fetch,`DELETE`,`${this.url}/passkeys/${e.passkeyId}`,{headers:this.headers,jwt:n.access_token,noResolveJson:!0});return i?this._returnResult({data:null,error:i}):this._returnResult({data:null,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}};Li.nextInstanceID={};var Ri=Li,zi=`2.118.0`,Bi=``,Vi;if(typeof Deno<`u`)Bi=`deno`,Vi=Deno.version?.deno;else if(typeof document<`u`)Bi=`web`;else if(typeof navigator<`u`&&navigator.product===`ReactNative`)Bi=`react-native`;else{var Hi;Bi=`node`;let e=globalThis.process;Vi=e==null||(Hi=e.version)==null?void 0:Hi.replace(/^v/,``)}var Ui=[`runtime=${Bi}`];Vi&&Ui.push(`runtime-version=${Vi}`);var Wi={headers:{"X-Client-Info":`supabase-js/${zi}; ${Ui.join(`; `)}`}},Gi={schema:`public`},Ki={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:`implicit`},qi={},Ji={enabled:!1,respectSamplingDecision:!0};function Yi(e){if(!e||typeof e!=`string`)return null;let t=e.split(`-`);if(t.length!==4)return null;let[n,r,i,a]=t;if(n.length!==2||r.length!==32||i.length!==16||a.length!==2)return null;let o=/^[0-9a-f]+$/i;return!o.test(n)||!o.test(r)||!o.test(i)||!o.test(a)||r===`00000000000000000000000000000000`||i===`0000000000000000`?null:{version:n,traceId:r,parentId:i,traceFlags:a,isSampled:(parseInt(a,16)&1)==1}}function Xi(e,t){if(!e||!t||t.length===0)return!1;let n;if(e instanceof URL)n=e;else try{n=new URL(e)}catch{return!1}for(let e of t)try{if(typeof e==`string`){if(Zi(n.hostname,e))return!0}else if(e instanceof RegExp){if(e.test(n.hostname))return!0}else if(typeof e==`function`&&e(n))return!0}catch{continue}return!1}function Zi(e,t){if(t===e)return!0;if(t.startsWith(`*.`)){let n=t.slice(2);if(e.endsWith(n)&&(e===n||e.endsWith(`.`+n)))return!0}return!1}function Qi(e){let t=[];try{let n=new URL(e);t.push(n.hostname)}catch{}return t.push(`*.supabase.co`,`*.supabase.in`),t.push(`localhost`,`127.0.0.1`,`[::1]`),t}function $i(e){"@babel/helpers - typeof";return $i=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},$i(e)}function ea(e,t){if($i(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if($i(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function ta(e){var t=ea(e,`string`);return $i(t)==`symbol`?t:t+``}function na(e,t,n){return(t=ta(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function ra(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function z(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?ra(Object(n),!0).forEach(function(t){na(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ra(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var ia=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),aa=()=>Headers,oa=e=>e.startsWith(`sb_publishable_`)||e.startsWith(`sb_secret_`),sa=`sb_temp_`,ca=new Set,la=e=>{if(!e.startsWith(`sb_`)||oa(e)||e.startsWith(sa))return;let t=e.match(/^sb_[a-zA-Z0-9]+_/)?.[0]??`unknown`;ca.has(t)||(ca.add(t),console.warn(`@supabase/supabase-js: Unrecognized Supabase API key format. The client will proceed and send this key as-is; if you see authentication errors you may need to upgrade @supabase/supabase-js to a version that recognizes this key type.`))},ua=(e,t,n,r,i,a)=>{let o=ia(r),s=aa(),c=i?.enabled===!0,l=i?.respectSamplingDecision!==!1,u=c?Qi(t):null,d=!(a?.omitApiKeyAsBearer&&oa(e));return async(t,r)=>{let i=await n(),a=new s(r?.headers);if(a.has(`apikey`)||a.set(`apikey`,e),!a.has(`Authorization`)){let t=i??(d?e:null);t&&a.set(`Authorization`,`Bearer ${t}`)}if(u){let e=pa(t,u,l);e&&(e.traceparent&&!a.has(`traceparent`)&&a.set(`traceparent`,e.traceparent),e.tracestate&&!a.has(`tracestate`)&&a.set(`tracestate`,e.tracestate),e.baggage&&!a.has(`baggage`)&&a.set(`baggage`,e.baggage))}return o(t,z(z({},r),{},{headers:a}))}},da=!1,fa=!1;function pa(e,n,r){let i=t();if(!i)return da||(da=!0,console.warn("@supabase/supabase-js: tracePropagation is enabled but the tracing runtime is not loaded, so trace headers will not be attached. Add `import '@supabase/supabase-js/tracing'` at your application entry point (requires the OpenTelemetry API package to be installed). The CDN/UMD build does not support trace propagation.")),null;if(!Xi(typeof e==`string`||e instanceof URL?e:e.url,n))return null;let a=i();if(!a||!a.traceparent){var o;if(a!=null&&(o=a.carrierKeys)!=null&&o.length&&!fa){fa=!0;let e=a.carrierKeys.includes(`sentry-trace`)?" Sentry detected: set `propagateTraceparent: true` in Sentry.init() to emit it.":` Configure your tracing SDK to emit W3C trace context on outgoing requests.`;console.warn(`@supabase/supabase-js: tracePropagation is enabled and a tracing SDK is active, but its propagator wrote [${a.carrierKeys.join(`, `)}] and no W3C traceparent header, so trace headers will not be attached.`+e)}return null}if(r){let e=Yi(a.traceparent);if(e&&!e.isSampled)return{traceparent:a.traceparent}}return a}function ma(e){return typeof e==`boolean`?{enabled:e}:e}function ha(e){return e.endsWith(`/`)?e:e+`/`}var ga=!1;function _a(e){ga||typeof e==`object`&&e&&`schema`in e&&e.schema!==void 0&&(ga=!0,console.warn(`@supabase/supabase-js: The "schema" option must be nested under "db", e.g. createClient(url, key, { db: { schema: 'myschema' } }). A top-level "schema" is ignored and queries go to the default schema.`))}function va(e,t){let{db:n,auth:r,realtime:i,global:a}=e,{db:o,auth:s,realtime:c,global:l}=t,u=ma(e.tracePropagation),d=ma(t.tracePropagation),f={db:z(z({},o),n),auth:z(z({},s),r),realtime:z(z({},c),i),storage:{},global:z(z(z({},l),a),{},{headers:z(z({},l?.headers??{}),a?.headers??{})}),tracePropagation:{enabled:u?.enabled??d?.enabled??!1,respectSamplingDecision:u?.respectSamplingDecision??d?.respectSamplingDecision??!0},accessToken:async()=>``};return e.accessToken?f.accessToken=e.accessToken:delete f.accessToken,f}function ya(e){let t=e?.trim();if(!t)throw Error(`supabaseUrl is required.`);if(!t.match(/^https?:\/\//i))throw Error(`Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.`);try{return new URL(ha(t))}catch{throw Error(`Invalid supabaseUrl: Provided URL is malformed.`)}}var ba=class extends Ri{constructor(e){super(e)}},xa=class{constructor(e,t,n){this.supabaseUrl=e,this.supabaseKey=t;let r=ya(e);if(!t)throw Error(`supabaseKey is required.`);la(t),_a(n),this.realtimeUrl=new URL(`realtime/v1`,r),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace(`http`,`ws`),this.authUrl=new URL(`auth/v1`,r),this.storageUrl=new URL(`storage/v1`,r),this.functionsUrl=new URL(`functions/v1`,r);let i=`sb-${r.hostname.split(`.`)[0]}-auth-token`,a={db:Gi,realtime:qi,auth:z(z({},Ki),{},{storageKey:i}),global:Wi,tracePropagation:Ji},o=va(n??{},a);this.settings=o,this.storageKey=o.auth.storageKey??``,this.headers=o.global.headers??{},o.accessToken?(this.accessToken=o.accessToken,this.auth=new Proxy({},{get:(e,t)=>{throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t)} is not possible`)}})):this.auth=this._initSupabaseAuthClient(o.auth??{},this.headers,o.global.fetch),this.fetch=ua(t,e,this._getSessionToken.bind(this),o.global.fetch,o.tracePropagation),this.functionsFetch=ua(t,e,this._getSessionToken.bind(this),o.global.fetch,o.tracePropagation,{omitApiKeyAsBearer:!0}),this.realtime=this._initRealtimeClient(z({headers:this.headers,accessToken:this._getAccessToken.bind(this),fetch:this.fetch},o.realtime)),this.accessToken&&Promise.resolve(this.accessToken()).then(e=>this.realtime.setAuth(e)).catch(e=>console.warn(`Failed to set initial Realtime auth token:`,e)),this.rest=new se(new URL(`rest/v1`,r).href,{headers:this.headers,schema:o.db.schema,fetch:this.fetch,timeout:o.db.timeout,urlLengthLimit:o.db.urlLengthLimit,retry:o.db.retry}),this.storage=new Tn(this.storageUrl.href,this.headers,this.fetch,n?.storage),o.accessToken||this._listenForAuthEvents()}get functions(){return new u(this.functionsUrl.href,{headers:this.headers,customFetch:this.functionsFetch})}from(e){return this.rest.from(e)}schema(e){return this.rest.schema(e)}getOpenApiSpec(){return this.rest.getOpenApiSpec()}rpc(e,t={},n={head:!1,get:!1,count:void 0}){return this.rest.rpc(e,t,n)}channel(e,t={config:{}}){return this.realtime.channel(e,t)}getChannels(){return this.realtime.getChannels()}removeChannel(e){return this.realtime.removeChannel(e)}removeAllChannels(){return this.realtime.removeAllChannels()}async _getSessionToken(){var e=this;if(e.accessToken)return await e.accessToken();let{data:t}=await e.auth.getSession();return t.session?.access_token??null}async _getAccessToken(){var e=this;return await e._getSessionToken()??e.supabaseKey}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:t,detectSessionInUrl:n,storage:r,userStorage:i,storageKey:a,flowType:o,lock:s,debug:c,throwOnError:l,experimental:u,lockAcquireTimeout:d,skipAutoInitialize:f},p,m){let h={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new ba({url:this.authUrl.href,headers:z(z({},h),p),storageKey:a,autoRefreshToken:e,persistSession:t,detectSessionInUrl:n,storage:r,userStorage:i,flowType:o,lock:s,debug:c,throwOnError:l,experimental:u,fetch:m,lockAcquireTimeout:d,skipAutoInitialize:f,hasCustomAuthorizationHeader:Object.keys(this.headers).some(e=>e.toLowerCase()===`authorization`)})}_initRealtimeClient(e){return new Et(this.realtimeUrl.href,z(z({},e),{},{params:z(z({},{apikey:this.supabaseKey}),e?.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((e,t)=>{this._handleTokenChanged(e,`CLIENT`,t?.access_token)})}_handleTokenChanged(e,t,n){(e===`TOKEN_REFRESHED`||e===`SIGNED_IN`||e===`INITIAL_SESSION`)&&this.changedAccessToken!==n?(this.changedAccessToken=n,this.realtime.setAuth(n)):e===`SIGNED_OUT`&&(this.realtime.setAuth(),t==`STORAGE`&&this.auth.signOut(),this.changedAccessToken=void 0)}},Sa=(e,t,n)=>new xa(e,t,n);function Ca(){if(typeof window<`u`||globalThis.Deno!==void 0)return!1;let e=globalThis.process;if(!e)return!1;let t=e.version;if(t==null)return!1;let n=t.match(/^v(\d+)\./);return n?parseInt(n[1],10)<=20:!1}Ca()&&console.warn(`⚠️  Node.js 20 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 22 or later. For more information, visit: https://github.com/orgs/supabase/discussions/45715`);var wa=`https://ioikcrdxneuydylyhvwi.supabase.co`,Ta=`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvaWtjcmR4bmV1eWR5bHlodndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNzc4NTIsImV4cCI6MjEwODk1Mzg1Mn0.dQTvZ6YjjD3SthqvgZjoj7NmHNI1bNk-pSILYmS1N4M`,Ea=!!Ta,Da=`alumnos.ecoems.mx`,Oa=`production`,B=Ea?Sa(wa,Ta,{auth:{persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}}):null;function ka(e){let t=String(e||``).trim().toLowerCase().replace(/@.*$/,``).replace(/\s+/g,``);return t?`${t}@${Da}`:``}var Aa=612,ja=792,Ma=56;function Na(e){return String(e??``).split(``).map(e=>e.codePointAt(0)<=255?e:`?`).join(``)}function Pa(e){return Na(e).replace(/\\/g,`\\\\`).replace(/\(/g,`\\(`).replace(/\)/g,`\\)`).replace(/[\r\n]+/g,` `).trim()}function Fa(e){let t=0;for(let n=0;n<e.length;n++)t+=e.charCodeAt(n)<=255?1:2;return t}function Ia(e){let t=new Uint8Array(Fa(e)),n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<=255?t[n++]=i:(t[n++]=63,i>65535&&(t[n++]=63))}return t}function La(e,t,n,{size:r=11,bold:i=!1,x:a=Ma}={}){e.push(`BT /${i?`F2`:`F1`} ${r} Tf 1 0 0 1 ${a} ${n} Tm (${Pa(t)}) Tj ET`)}function Ra(e,t){e.push(`0.6 w ${Ma} ${t} m 556 ${t} l S`)}function za(e,t,n,r){La(e,t,r,{size:9,bold:!0}),La(e,n,r-15,{size:11})}function Ba(e){let t=e||{},n=t.status===`voided`,r=[];La(r,`ECOEMS`,722,{size:22,bold:!0}),La(r,`Recibo de pago`,696,{size:13}),n&&La(r,`PAGO ANULADO`,670,{size:14,bold:!0}),Ra(r,656),za(r,`FOLIO`,t.receipt_no||t.id||`SIN FOLIO`,628),za(r,`ALUMNO`,t.student_name||`—`,582),za(r,`CODIGO Y GRUPO`,`${t.student_code||`—`}${t.group_name?` · ${t.group_name}`:``}`,536),za(r,`FECHA DE PAGO`,t.paid_at||`—`,490),za(r,`METODO`,t.method||`—`,444),za(r,`PERIODO CUBIERTO`,t.period_start||t.period?`${t.period_start||t.period}${t.period_end?` — ${t.period_end}`:``}`:`No especificado`,398),za(r,`PLAN`,t.plan||`No especificado`,352),za(r,`ESTADO`,n?`Anulado`:`Pagado`,306),n&&t.void_reason&&za(r,`MOTIVO DE ANULACION`,t.void_reason,260),Ra(r,250),La(r,`Importe pagado`,226,{size:12,bold:!0}),La(r,Na(t.amount||`—`),226,{size:16,bold:!0,x:420}),Ra(r,208),La(r,`Documento generado por la plataforma ECOEMS. Conserve este recibo para sus registros.`,176,{size:9}),La(r,`Folio: ${t.receipt_no||t.id||`SIN FOLIO`}`,158,{size:9});let i=r.join(`
`)+`
`,a=[`<< /Type /Catalog /Pages 2 0 R >>`,`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${Aa} ${ja}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`,`<< /Length ${Fa(i)} >>\nstream\n${i}endstream`,`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`,`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`],o=`%PDF-1.4
%âãÏÓ
`,s=[0];a.forEach((e,t)=>{s[t+1]=Fa(o),o+=`${t+1} 0 obj\n${e}\nendobj\n`});let c=Fa(o),l=a.length+1;o+=`xref\n0 ${l}\n0000000000 65535 f\r\n`;for(let e=1;e<l;e++)o+=`${String(s[e]).padStart(10,`0`)} 00000 n\r\n`;return o+=`trailer\n<< /Size ${l} /Root 1 0 R >>\nstartxref\n${c}\n%%EOF\n`,Ia(o)}function Va(e){return`recibo-${String(e?.receipt_no||e?.id||`recibo`).replace(/[^A-Za-z0-9._-]+/g,`-`).replace(/^-+|-+$/g,``)||`ecoems`}.pdf`}function Ha(e){let t=new Blob([Ba(e)],{type:`application/pdf`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=Va(e),document.body.appendChild(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3)}var Ua={admin:`Administrador`,teacher:`Profesor`,student:`Alumno`,guardian:`Tutor`},Wa={admin:`Administra usuarios, contenido y configuración del piloto.`,teacher:`Activa unidades, registra asistencia y da seguimiento a tu grupo.`,student:`Tus unidades activas aparecerán aquí cuando el profesor las abra.`,guardian:`Aquí verás el avance de tus hijos cuando la cuenta esté vinculada.`},Ga={not_started:`Sin empezar`,in_progress:`En progreso`,completed:`Completada`,mastered:`Dominada`},Ka={tipo:`Práctica`,reto:`Reto`,capitulo:`Capítulo`},qa=`v3-2026`,Ja=`v8-pulido`,Ya=20,Xa={dashboard:`📊 Dashboard`,alumnos:`👥 Alumnos`,materias:`📚 Materias`,asistencia:`📅 Asistencia`,pagos:`💳 Pagos`,tareas:`📝 Tareas`,actividad:`📈 Actividad`,tutores:`💬 Tutores`,usuarios:`🛠️ Usuarios`,contenido:`🗂️ Contenido`,auditoria:`🧾 Auditoría`,configuracion:`⚙️ Configuración`},Za={present:`Presente`,late:`Tarde`,excused:`Justificado`,absent:`Falta`},Qa={diagnostic:`Diagnóstico`,quiz:`Examen corto`,exam:`Examen`,project:`Tarea / Proyecto`,participation:`Participación`,other:`Otra`},$a={apertura:{label:`Apertura a la experiencia`,emoji:`💡`,copy:`Curiosidad, imaginación y ganas de aprender cosas nuevas.`},responsabilidad:{label:`Responsabilidad`,emoji:`🎯`,copy:`Constancia, orden y cumplimiento de tus metas.`},extraversion:{label:`Extraversión`,emoji:`🗣️`,copy:`Energía social y facilidad para conectar con otras personas.`},amabilidad:{label:`Amabilidad`,emoji:`🤝`,copy:`Empatía, respeto y ganas de colaborar.`},estabilidad:{label:`Estabilidad emocional`,emoji:`🌊`,copy:`Calma y manejo de la presión en momentos difíciles.`}},eo=[{id:`p1`,dim:`apertura`,text:`Me gusta probar cosas nuevas y aprender temas distintos.`},{id:`p2`,dim:`apertura`,text:`Soy imaginativo/a y disfruto crear ideas, historias o proyectos.`},{id:`p3`,dim:`apertura`,reverse:!0,text:`Prefiero quedarme con las rutinas de siempre antes que probar novedades.`},{id:`p4`,dim:`responsabilidad`,text:`Cumplo mis tareas aunque no tenga muchas ganas.`},{id:`p5`,dim:`responsabilidad`,text:`Organizo mi tiempo y mis materiales con anticipación.`},{id:`p6`,dim:`responsabilidad`,reverse:!0,text:`Dejo las cosas para el último momento.`},{id:`p7`,dim:`extraversion`,text:`Disfruto hablar con gente nueva y hacer amigos.`},{id:`p8`,dim:`extraversion`,text:`Me siento con energía cuando estoy en grupo.`},{id:`p9`,dim:`extraversion`,reverse:!0,text:`Prefiero quedarme callado/a en reuniones grandes.`},{id:`p10`,dim:`amabilidad`,text:`Escucho y ayudo cuando alguien tiene un problema.`},{id:`p11`,dim:`amabilidad`,reverse:!0,text:`Me cuesta ponerme en el lugar de los demás.`},{id:`p12`,dim:`amabilidad`,text:`Trato con respeto a quienes piensan distinto a mí.`},{id:`p13`,dim:`estabilidad`,text:`Me recupero rápido cuando algo me sale mal.`},{id:`p14`,dim:`estabilidad`,reverse:!0,text:`Me preocupo mucho por cosas que todavía no pasan.`},{id:`p15`,dim:`estabilidad`,text:`Mantengo la calma en situaciones de presión.`}],to=[{label:`Nada`,emoji:`😐`},{label:`Poco`,emoji:`🙂`},{label:`A veces`,emoji:`😌`},{label:`Bastante`,emoji:`😄`},{label:`Mucho`,emoji:`🤩`}],V=[{id:`series`,title:`Contenido que disfrutas`,prompt:`¿Qué series, películas o videos sueles ver?`,help:`Elige todo lo que de verdad ves. Tus gustos nos ayudan a detectar áreas de interés.`,options:[{label:`Novelas y K-dramas`,tags:[`personas`,`emociones`]},{label:`Series de policías, crimen o misterio`,tags:[`análisis`,`lógica`,`justicia`]},{label:`Anime`,tags:[`creatividad`,`arte`]},{label:`Ciencia ficción y fantasía`,tags:[`ciencia`,`tecnología`,`creatividad`]},{label:`Documentales de naturaleza`,tags:[`ciencia`,`naturaleza`]},{label:`Documentales de historia`,tags:[`historia`,`cultura`]},{label:`Deportes`,tags:[`deporte`,`equipo`,`salud`]},{label:`Comedia`,tags:[`creatividad`,`personas`]},{label:`Drama`,tags:[`personas`,`emociones`]},{label:`Terror o suspenso`,tags:[`análisis`,`creatividad`]},{label:`Caricaturas`,tags:[`arte`,`creatividad`]},{label:`Reality shows`,tags:[`personas`,`actualidad`]},{label:`Superhéroes`,tags:[`justicia`,`creatividad`]},{label:`Videos de YouTube`,tags:[`actualidad`,`tecnología`]},{label:`Podcasts`,tags:[`cultura`,`actualidad`]},{label:`Videojuegos`,tags:[`tecnología`,`lógica`]},{label:`Contenido de cocina`,tags:[`cocina`,`creatividad`]},{label:`Música y conciertos`,tags:[`música`,`arte`]},{label:`Moda y belleza`,tags:[`diseño`,`creatividad`]},{label:`Tecnología y gadgets`,tags:[`tecnología`,`ciencia`]}]},{id:`subjects`,title:`Materias favoritas`,prompt:`¿Qué materias de la escuela disfrutas o se te dan mejor?`,help:`Piensa en las clases que más te gustan, aunque no seas el mejor de tu grupo.`,options:[{label:`Español y Literatura`,tags:[`lectura`,`escritura`]},{label:`Matemáticas`,tags:[`cálculo`,`lógica`]},{label:`Física y Química`,tags:[`ciencia`,`experimentos`]},{label:`Biología`,tags:[`ciencia`,`naturaleza`]},{label:`Historia`,tags:[`historia`,`cultura`]},{label:`Geografía`,tags:[`naturaleza`,`cultura`]},{label:`Inglés u otros idiomas`,tags:[`idiomas`,`cultura`]},{label:`Computación`,tags:[`tecnología`,`lógica`]},{label:`Artes`,tags:[`arte`,`creatividad`]},{label:`Música`,tags:[`música`,`arte`]},{label:`Educación física`,tags:[`deporte`,`salud`]},{label:`Civismo o Ética`,tags:[`sociedad`,`debate`]},{label:`Tecnología o taller`,tags:[`manualidades`,`construcción`]}]},{id:`activities`,title:`Actividades favoritas`,prompt:`¿Qué actividades disfrutas hacer en tu tiempo libre o en la escuela?`,help:`Marca todas las que realmente disfrutes, no las que creas que deberías elegir.`,options:[{label:`Leer`,tags:[`lectura`,`cultura`]},{label:`Escribir`,tags:[`escritura`,`creatividad`]},{label:`Resolver problemas matemáticos`,tags:[`cálculo`,`lógica`]},{label:`Hacer experimentos`,tags:[`ciencia`,`experimentos`]},{label:`Dibujar o diseñar`,tags:[`arte`,`diseño`]},{label:`Tocar un instrumento o cantar`,tags:[`música`,`arte`]},{label:`Hacer deporte`,tags:[`deporte`,`salud`]},{label:`Bailar`,tags:[`arte`,`deporte`]},{label:`Ayudar a otras personas`,tags:[`ayudar`,`empatía`]},{label:`Usar computadoras o programar`,tags:[`tecnología`,`lógica`]},{label:`Jugar videojuegos`,tags:[`tecnología`,`lógica`]},{label:`Cuidar plantas o animales`,tags:[`naturaleza`,`animales`]},{label:`Cocinar`,tags:[`cocina`,`creatividad`]},{label:`Armar o reparar cosas`,tags:[`manualidades`,`construcción`]},{label:`Debatir`,tags:[`debate`,`sociedad`]},{label:`Organizar eventos`,tags:[`organización`,`liderazgo`]},{label:`Aprender idiomas`,tags:[`idiomas`,`cultura`]},{label:`Vender o emprender`,tags:[`negocios`,`emprendimiento`]}]},{id:`aptitudes`,title:`Aptitudes`,prompt:`¿En qué te sientes bueno/a o crees que destacas?`,help:`Piensa en lo que profesores, familiares o amigos te han reconocido.`,options:[{label:`Cálculo mental`,tags:[`cálculo`]},{label:`Comprensión de lectura`,tags:[`lectura`]},{label:`Escritura`,tags:[`escritura`]},{label:`Memorizar`,tags:[`memoria`]},{label:`Creatividad`,tags:[`creatividad`]},{label:`Comunicación`,tags:[`comunicación`]},{label:`Liderazgo`,tags:[`liderazgo`]},{label:`Organización`,tags:[`organización`]},{label:`Tecnología`,tags:[`tecnología`]},{label:`Deporte`,tags:[`deporte`]},{label:`Música`,tags:[`música`]},{label:`Dibujo o arte`,tags:[`arte`]},{label:`Empatía`,tags:[`empatía`]},{label:`Resolver conflictos`,tags:[`sociedad`,`empatía`]},{label:`Manualidades`,tags:[`manualidades`]},{label:`Análisis de datos`,tags:[`datos`,`análisis`]}]},{id:`workdays`,title:`Un día de trabajo`,prompt:`¿Qué te gustaría hacer en un día de trabajo?`,help:`Imagina tu rutina ideal. Elige las actividades que más te emocionen.`,options:[{label:`Atender y ayudar personas`,tags:[`ayudar`,`personas`]},{label:`Resolver problemas con números`,tags:[`cálculo`,`análisis`]},{label:`Crear diseños o contenido`,tags:[`creatividad`,`diseño`]},{label:`Construir o reparar cosas`,tags:[`construcción`,`manualidades`]},{label:`Investigar y experimentar`,tags:[`ciencia`,`experimentos`]},{label:`Vender o negociar`,tags:[`negocios`,`comunicación`]},{label:`Enseñar o capacitar`,tags:[`comunicación`,`personas`]},{label:`Organizar equipos o eventos`,tags:[`organización`,`liderazgo`]},{label:`Cuidar animales`,tags:[`animales`,`naturaleza`]},{label:`Cuidar la salud de personas`,tags:[`salud`,`ayudar`]},{label:`Programar o crear apps`,tags:[`tecnología`,`lógica`]},{label:`Escribir historias o noticias`,tags:[`escritura`,`lectura`]},{label:`Defender causas o personas`,tags:[`justicia`,`debate`]},{label:`Cocinar o preparar alimentos`,tags:[`cocina`,`creatividad`]},{label:`Producir música o videos`,tags:[`música`,`creatividad`]},{label:`Entrenar o competir`,tags:[`deporte`,`salud`]}]},{id:`environment`,title:`Ambiente de trabajo`,prompt:`¿Cómo te imaginas trabajando en el futuro?`,help:`Puedes elegir varios ambientes. No hay respuestas correctas o incorrectas.`,options:[{label:`Solo/a`,tags:[`autonomía`]},{label:`En equipo`,tags:[`equipo`]},{label:`Al aire libre`,tags:[`naturaleza`]},{label:`En oficina`,tags:[`organización`]},{label:`En laboratorio`,tags:[`experimentos`]},{label:`Con personas`,tags:[`personas`]},{label:`Con animales`,tags:[`animales`]},{label:`Con números y datos`,tags:[`datos`,`cálculo`]},{label:`Con tecnología`,tags:[`tecnología`]},{label:`Creando cosas`,tags:[`creatividad`,`diseño`]},{label:`Ayudando a la comunidad`,tags:[`ayudar`,`sociedad`]},{label:`Liderando proyectos`,tags:[`liderazgo`]}]},{id:`values`,title:`Lo que valoras`,prompt:`¿Qué es lo más importante para ti en un futuro trabajo?`,help:`Elige hasta tres opciones que más te importen.`,options:[{label:`Ayudar a los demás`,tags:[`ayudar`]},{label:`Creatividad`,tags:[`creatividad`]},{label:`Estabilidad económica`,tags:[`estabilidad`]},{label:`Libertad`,tags:[`autonomía`]},{label:`Aprender siempre`,tags:[`ciencia`,`cultura`]},{label:`Liderar`,tags:[`liderazgo`]},{label:`Impacto social`,tags:[`sociedad`]},{label:`Trabajo seguro`,tags:[`estabilidad`]},{label:`Reconocimiento`,tags:[`liderazgo`]},{label:`Tiempo libre`,tags:[`bienestar`]}]},{id:`future`,title:`Tu futuro`,prompt:`¿Cómo te imaginas en el futuro?`,help:`Elige las escenas que más te gustaría vivir dentro de unos años.`,options:[{label:`Ayudando a mi comunidad`,tags:[`ayudar`,`sociedad`]},{label:`Con mi propio negocio`,tags:[`negocios`,`liderazgo`]},{label:`Viviendo de mi arte`,tags:[`arte`,`creatividad`]},{label:`Siendo reconocido en mi profesión`,tags:[`liderazgo`]},{label:`Viajando por mi trabajo`,tags:[`idiomas`,`actualidad`]},{label:`Trabajando con tecnología`,tags:[`tecnología`]},{label:`En un hospital o laboratorio`,tags:[`salud`,`ciencia`]},{label:`En una oficina`,tags:[`organización`,`negocios`]},{label:`Al aire libre`,tags:[`naturaleza`,`deporte`]},{label:`Dando clases`,tags:[`comunicación`,`personas`]},{label:`En un juzgado o despacho`,tags:[`justicia`,`debate`]},{label:`Con estabilidad económica`,tags:[`estabilidad`]}]}],no=[{name:`Medicina`,tags:[`salud`,`ciencia`,`ayudar`,`personas`]},{name:`Enfermería`,tags:[`salud`,`ayudar`,`personas`,`equipo`]},{name:`Psicología`,tags:[`personas`,`emociones`,`ayudar`,`ciencia`]},{name:`Nutrición`,tags:[`salud`,`ciencia`,`ayudar`,`bienestar`]},{name:`Veterinaria`,tags:[`animales`,`salud`,`ciencia`,`naturaleza`]},{name:`Biología`,tags:[`ciencia`,`naturaleza`,`experimentos`,`análisis`]},{name:`Química`,tags:[`ciencia`,`experimentos`,`análisis`,`cálculo`]},{name:`Física`,tags:[`ciencia`,`cálculo`,`análisis`,`tecnología`]},{name:`Matemáticas`,tags:[`cálculo`,`análisis`,`datos`,`lógica`]},{name:`Ingeniería en sistemas`,tags:[`tecnología`,`cálculo`,`lógica`,`datos`]},{name:`Ciencia de datos`,tags:[`datos`,`cálculo`,`tecnología`,`análisis`]},{name:`Ingeniería civil`,tags:[`cálculo`,`construcción`,`naturaleza`,`organización`]},{name:`Ingeniería mecánica`,tags:[`cálculo`,`construcción`,`tecnología`,`manualidades`]},{name:`Ingeniería industrial`,tags:[`cálculo`,`organización`,`negocios`,`liderazgo`]},{name:`Arquitectura`,tags:[`arte`,`construcción`,`creatividad`,`diseño`]},{name:`Diseño gráfico`,tags:[`arte`,`creatividad`,`tecnología`,`diseño`]},{name:`Animación y videojuegos`,tags:[`arte`,`tecnología`,`creatividad`,`lógica`]},{name:`Diseño de modas`,tags:[`diseño`,`arte`,`creatividad`,`actualidad`]},{name:`Comunicación`,tags:[`escritura`,`personas`,`creatividad`,`actualidad`]},{name:`Periodismo`,tags:[`escritura`,`lectura`,`actualidad`,`sociedad`]},{name:`Derecho`,tags:[`lectura`,`debate`,`sociedad`,`justicia`]},{name:`Criminología`,tags:[`justicia`,`análisis`,`sociedad`,`lógica`]},{name:`Administración`,tags:[`organización`,`liderazgo`,`negocios`,`datos`]},{name:`Contaduría`,tags:[`cálculo`,`organización`,`datos`,`negocios`]},{name:`Docencia`,tags:[`ayudar`,`personas`,`comunicación`,`lectura`]},{name:`Trabajo social`,tags:[`ayudar`,`sociedad`,`personas`,`empatía`]},{name:`Gastronomía`,tags:[`cocina`,`creatividad`,`manualidades`,`emprendimiento`]},{name:`Música`,tags:[`música`,`arte`,`creatividad`,`disciplina`]},{name:`Artes escénicas`,tags:[`arte`,`creatividad`,`personas`,`comunicación`]},{name:`Ciencias del deporte`,tags:[`deporte`,`salud`,`equipo`,`disciplina`]},{name:`Turismo`,tags:[`personas`,`idiomas`,`organización`,`actualidad`]},{name:`Mercadotecnia`,tags:[`creatividad`,`negocios`,`personas`,`actualidad`]},{name:`Relaciones internacionales`,tags:[`idiomas`,`sociedad`,`debate`,`actualidad`]},{name:`Ciencias políticas`,tags:[`sociedad`,`debate`,`actualidad`,`liderazgo`]},{name:`Historia`,tags:[`historia`,`cultura`,`lectura`,`sociedad`]},{name:`Literatura`,tags:[`lectura`,`escritura`,`cultura`,`creatividad`]},{name:`Lenguas extranjeras`,tags:[`idiomas`,`cultura`,`comunicación`,`lectura`]}],H={mode:`student`,session:null,profile:null,dashboard:null,dashboardError:``,view:`dashboard`,unitView:null,unitResults:{},error:``,notice:``,staffTab:`dashboard`,paymentsPage:1,sidebarCollapsed:localStorage.getItem(`ecoems_sidebar`)===`collapsed`,collapsedSubjects:oo(),fichaStudentId:null,fichaTrigger:null,fichaEscHandler:null,unitAssign:null,payDialog:null,subjectsGroupId:null,activeTest:null,loading:!0,pendingLoginUsername:``,studentInvitation:null,passwordRecovery:!1},U=null,ro=null,io=null,ao=null;function W(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function oo(){try{let e=JSON.parse(localStorage.getItem(`ecoems_collapsed_subjects`)||`[]`);return new Set(Array.isArray(e)?e:[])}catch{return new Set}}function so(){localStorage.setItem(`ecoems_collapsed_subjects`,JSON.stringify([...H.collapsedSubjects]))}function co(e){H.collapsedSubjects.has(e)?H.collapsedSubjects.delete(e):H.collapsedSubjects.add(e),so()}function lo(e){let[t,...n]=String(e).split(` `);return{emoji:t,text:n.join(` `)}}var uo=[`ecoems_nav_open`,`ecoems_sidebar_off`,`curso_comipems_v1`,`curso_ecoems_alumnos_v1`,`curso_ecoems_pagos_v1`,`curso_ecoems_asistencia_v1`,`curso_ecoems_plan_v1`,`curso_ecoems_perfiles_v1`,`curso_ecoems_entregas_v1`,`lectura_reto_v1`,`mate_reto_v1`];function fo(){let e=new Set;for(let t=0;t<localStorage.length;t+=1){let n=localStorage.key(t);n&&n.startsWith(`ecoems_`)&&e.add(n)}for(let t of uo)e.add(t);for(let t of e)localStorage.removeItem(t);H.sidebarCollapsed=!1,H.collapsedSubjects=new Set}function G(e){H.error=e,H.notice=``}function K(e){H.notice=e,H.error=``}function po(e,t){if(!e)return()=>{};let n=document.activeElement,r=`a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])`,i=n=>{if(n.key===`Escape`){n.preventDefault(),t();return}if(n.key!==`Tab`)return;let i=[...e.querySelectorAll(r)].filter(e=>e.offsetParent!==null||e===document.activeElement);if(!i.length)return;let a=i[0],o=i[i.length-1];n.shiftKey&&document.activeElement===a?(n.preventDefault(),o.focus()):!n.shiftKey&&document.activeElement===o&&(n.preventDefault(),a.focus())};return document.addEventListener(`keydown`,i),requestAnimationFrame(()=>{(e.querySelector(`[autofocus]`)||e.querySelector(r))?.focus()}),()=>{document.removeEventListener(`keydown`,i),n?.isConnected&&typeof n.focus==`function`&&n.focus()}}function mo(){if(!H.error&&!H.notice)return``;let e=!!H.error,t=e?`error`:`notice`,n=H.error||H.notice;return`<div class="alert ${t}" role="${e?`alert`:`status`}" aria-live="${e?`assertive`:`polite`}">${W(n)}</div>`}function ho(){return`
    <header class="top">
      <a class="brand" href="/" aria-label="ECOEMS inicio">
        <span class="brand-mark">E</span>
        <span>ECOEMS <small>Plataforma</small></span>
      </a>
      <div class="top-actions">
        <span class="env-pill">${W(Oa)}</span>
        <span class="env-pill" title="Versión del build">${W(Ja)}</span>
        <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema" title="Cambiar entre modo oscuro y claro">🌓</button>
      </div>
    </header>
  `}function go(){let e=H.dashboard?.privacy?.version||qa;return`
    <footer class="privacy-footer">
      <a href="${W(H.dashboard?.privacy?.url||`/privacidad.html`)}" target="_blank" rel="noopener">Aviso de privacidad</a>
      ${H.session?`
        <span aria-hidden="true">·</span>
        <button class="link-button" type="button" id="data-request-btn">Solicitar mis datos</button>
      `:``}
      <span aria-hidden="true">·</span>
      <span>Versión ${W(e)}</span>
      <span aria-hidden="true">·</span>
      <span>Documento en revisión legal</span>
    </footer>
  `}function _o(){let e=localStorage.getItem(`ecoems_theme`);document.documentElement.setAttribute(`data-theme`,e===`light`?`light`:`dark`)}function vo(){let e=(document.documentElement.getAttribute(`data-theme`)===`light`?`light`:`dark`)==`light`?`dark`:`light`;document.documentElement.setAttribute(`data-theme`,e),localStorage.setItem(`ecoems_theme`,e);let t=U.querySelector(`#theme-toggle`);t&&(t.textContent=e===`light`?`☀️`:`🌙`)}function yo(){let e=U.querySelector(`#theme-toggle`);e&&(e.textContent=document.documentElement.getAttribute(`data-theme`)===`light`?`☀️`:`🌙`,e.addEventListener(`click`,vo))}function bo(){U.innerHTML=`
    <div class="shell">
      ${ho()}
      <main id="main-content" tabindex="-1" class="center">
        <div class="panel loading-panel">
          <div class="spinner" aria-hidden="true"></div>
          <p>Cargando sesión…</p>
        </div>
      </main>
    </div>
  `}function xo(){U.innerHTML=`
    <div class="shell">
      ${ho()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel config-panel">
          <span class="kicker">Fase 1 · base local</span>
          <h1>Falta conectar Supabase</h1>
          <p>La estructura del proyecto ya está creada. Para iniciar sesión, copia las llaves de tu proyecto de Supabase en el archivo <code>.env</code>.</p>
          <ol class="steps">
            <li>Copia <code>.env.example</code> a <code>.env</code>.</li>
            <li>Pega <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>.</li>
            <li>Reinicia el servidor con <code>npm run dev</code>.</li>
          </ol>
          <pre><code>cp .env.example .env
npm run dev</code></pre>
          <p class="muted">El dominio de alumnos configurado es <strong>${W(Da)}</strong>.</p>
          <div class="row">
            <span class="pill">Sin datos reales</span>
            <span class="pill">Sin llaves privadas en el frontend</span>
          </div>
        </section>
      </main>
    </div>
  `}function q(){let e=H.mode===`student`,t=H.mode===`guardian`,n=H.pendingLoginUsername||``;H.pendingLoginUsername=``,U.innerHTML=`
    <div class="shell">
      ${ho()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel login-panel">
          <span class="kicker">Acceso al piloto</span>
          <h1>Entra a tu cuenta</h1>
          <p class="muted">Sin autorregistro. Las cuentas las crea el profesor o el administrador.</p>

          <div class="mode-tabs" role="tablist" aria-label="Tipo de acceso">
            <button class="mode-tab ${e?`active`:``}" data-mode="student" role="tab" aria-selected="${e}">Alumno</button>
            <button class="mode-tab ${H.mode===`teacher`?`active`:``}" data-mode="teacher" role="tab" aria-selected="${H.mode===`teacher`}">Profesor</button>
            <button class="mode-tab ${t?`active`:``}" data-mode="guardian" role="tab" aria-selected="${t}">Tutor</button>
          </div>

          ${mo()}

          <form id="login-form" class="form">
            ${e?`
              <label class="field">
                <span>Usuario</span>
                <input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="ana.martinez o tu correo" value="${W(n)}" required>
              </label>
              <p class="hint">Entra con el usuario que te dio tu profesor, o con tu <strong>correo</strong> si ya tenías cuenta.</p>
              <label class="field">
                <span>Contraseña</span>
                <input name="password" type="password" autocomplete="current-password" placeholder="Tu contraseña" required>
              </label>
            `:t?`
              <div class="guardian-login-note">
                <span class="card-label">Acceso para tutores</span>
                <h2>Usa tu enlace de acceso</h2>
                <p>Tu profesor te envía el enlace de acceso por <strong>correo electrónico</strong>. Ábrelo desde tu bandeja de entrada y entrarás directo, sin contraseña.</p>
                <p class="hint">¿El enlace venció o no lo tienes? Pídele a tu profesor que te reenvíe la invitación.</p>
              </div>
            `:`
              <label class="field">
                <span>Correo</span>
                <input name="email" type="email" autocomplete="email" placeholder="profesor@correo.com" required>
              </label>
              <label class="field">
                <span>Contraseña</span>
                <input name="password" type="password" autocomplete="current-password" placeholder="Tu contraseña" required>
              </label>
            `}
            ${t?``:`
              <div class="row">
                <button class="btn primary" type="submit" id="submit-btn">Entrar</button>
                <button class="btn ghost" type="button" id="forgot-password-btn">Olvidé mi contraseña</button>
              </div>
            `}
          </form>

          <p class="fine-print">Recupera tu contraseña con tu correo registrado. Los tutores entran con el enlace que reciben por correo.</p>
          ${go()}
        </section>
      </main>
    </div>
  `,U.querySelectorAll(`[data-mode]`).forEach(e=>{e.addEventListener(`click`,()=>{H.mode=e.dataset.mode,H.error=``,H.notice=``,q()})}),U.querySelector(`#login-form`).addEventListener(`submit`,Lo),U.querySelector(`#forgot-password-btn`)?.addEventListener(`click`,wo),yo()}function So(e){return`
    <div class="unit-assign-overlay" data-password-reset-overlay>
      <section class="unit-assign-dialog" role="dialog" aria-modal="true" aria-labelledby="password-reset-title">
        <button type="button" class="ficha-close" data-password-reset-close aria-label="Cerrar">✕</button>
        <header class="unit-assign-head">
          <span class="card-label">Recuperar acceso</span>
          <h2 id="password-reset-title">Restablece tu contraseña</h2>
          <p class="muted">Te enviaremos un enlace de un solo uso a tu correo registrado.</p>
        </header>
        <form id="password-reset-form" class="form">
          <label class="field">
            <span>Correo registrado</span>
            <input name="email" type="email" autocomplete="email" value="${W(e)}" placeholder="tu@correo.com" required>
          </label>
          <p class="hint">Si el correo existe en la plataforma, recibirás las instrucciones en unos minutos.</p>
          <div class="unit-assign-error" data-password-reset-error hidden></div>
          <footer class="unit-assign-foot">
            <button type="button" class="btn ghost" data-password-reset-close>Cancelar</button>
            <button type="submit" class="btn primary" id="password-reset-submit">Enviar enlace</button>
          </footer>
        </form>
      </section>
    </div>
  `}function Co(){let e=U.querySelector(`#login-form input[name="username"], #login-form input[name="email"]`),t=String(e?.value||``).trim();return t?t.includes(`@`)?t.toLowerCase():ka(t):``}function wo(){To(),document.body.insertAdjacentHTML(`beforeend`,So(Co())),document.body.classList.add(`unit-assign-open`);let e=document.querySelector(`[data-password-reset-overlay]`);io=po(e,To),e.querySelectorAll(`[data-password-reset-close]`).forEach(e=>{e.addEventListener(`click`,To)}),e.addEventListener(`click`,t=>{t.target===e&&To()}),e.querySelector(`#password-reset-form`).addEventListener(`submit`,Eo)}function To(){io&&=(io(),null),document.querySelectorAll(`[data-password-reset-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function Eo(e){e.preventDefault();let t=e.currentTarget,n=String(new FormData(t).get(`email`)||``).trim().toLowerCase(),r=t.querySelector(`#password-reset-submit`),i=t.querySelector(`[data-password-reset-error]`);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n))i&&(i.textContent=`Escribe un correo válido.`,i.hidden=!1);else{r.disabled=!0,r.textContent=`Enviando…`;try{let{error:e}=await B.auth.resetPasswordForEmail(n,{redirectTo:window.location.href.split(`#`)[0]});if(e)throw e}catch{i&&(i.textContent=`No se pudo enviar el enlace. Intenta de nuevo en unos minutos.`,i.hidden=!1),r.disabled=!1,r.textContent=`Enviar enlace`;return}To(),K(`Si el correo está registrado, ya recibiste las instrucciones para crear tu contraseña.`),q()}}function Do(){return`
    <div class="unit-assign-overlay" data-data-request-overlay>
      <section class="unit-assign-dialog" role="dialog" aria-modal="true" aria-labelledby="data-request-title">
        <button type="button" class="ficha-close" data-data-request-close aria-label="Cerrar">✕</button>
        <header class="unit-assign-head">
          <span class="card-label">Privacidad</span>
          <h2 id="data-request-title">Solicitar mis datos</h2>
          <p class="muted">Registramos tu solicitud con fecha y plazo de respuesta en el portal.</p>
        </header>
        <form id="data-request-form" class="form">
          <label class="field">
            <span>Tipo de solicitud</span>
            <select name="kind" required>
              <option value="access">Acceso a mis datos</option>
              <option value="rectification">Rectificación</option>
              <option value="cancellation">Cancelación</option>
              <option value="opposition">Oposición</option>
              <option value="portability">Portabilidad</option>
              <option value="revocation">Revocación de consentimiento</option>
            </select>
          </label>
          <label class="field">
            <span>Detalles (opcional)</span>
            <textarea name="details" rows="4" maxlength="2000" placeholder="Explica qué necesitas"></textarea>
          </label>
          <div class="unit-assign-error" data-data-request-error hidden></div>
          <footer class="unit-assign-foot">
            <button type="button" class="btn ghost" data-data-request-close>Cancelar</button>
            <button type="submit" class="btn primary">Enviar solicitud</button>
          </footer>
        </form>
      </section>
    </div>
  `}function Oo(){ko(),document.body.insertAdjacentHTML(`beforeend`,Do()),document.body.classList.add(`unit-assign-open`);let e=document.querySelector(`[data-data-request-overlay]`);ao=po(e,ko),e.querySelectorAll(`[data-data-request-close]`).forEach(e=>{e.addEventListener(`click`,ko)}),e.addEventListener(`click`,t=>{t.target===e&&ko()}),e.querySelector(`#data-request-form`).addEventListener(`submit`,Ao)}function ko(){ao&&=(ao(),null),document.querySelectorAll(`[data-data-request-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function Ao(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=t.querySelector(`[data-data-request-error]`),i=t.querySelector(`button[type="submit"]`);i.disabled=!0,i.textContent=`Enviando…`;let a;try{let e=await B.rpc(`app_create_data_request`,{p_kind:String(n.get(`kind`)||``),p_details:String(n.get(`details`)||``).trim()||null});if(e.error)throw e.error;a=e.data}catch(e){r&&(r.textContent=e?.message||`No se pudo registrar la solicitud. Intenta de nuevo.`,r.hidden=!1),i.disabled=!1,i.textContent=`Enviar solicitud`;return}ko(),K(`Solicitud registrada. Plazo de respuesta: ${X(String(a?.due_at||``).slice(0,10))}.`),$()}function jo(){let e=H.profile?.full_name||``,t=!!H.passwordRecovery;U.innerHTML=`
    <div class="shell">
      ${ho()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel login-panel">
          <span class="kicker">${t?`Recuperación de acceso`:`Primer ingreso`}</span>
          <h1>${t?`Elige una nueva contraseña`:`Hola, ${W(e.split(` `)[0]||`alumno`)} 👋`}</h1>
          <p class="muted">${t?`Usamos el enlace de recuperación que enviamos a tu correo. Crea una contraseña nueva para entrar.`:`Tu contraseña actual es temporal. Crea una nueva que solo tú conozcas para continuar.`}</p>

          ${mo()}

          <form id="change-password-form" class="form">
            <label class="field">
              <span>Nueva contraseña (mínimo 12 caracteres, con mayúscula, minúscula y número)</span>
              <input name="password" type="password" autocomplete="new-password" minlength="12" placeholder="Tu nueva contraseña" required>
            </label>
            <label class="field">
              <span>Confirma tu nueva contraseña</span>
              <input name="confirm" type="password" autocomplete="new-password" minlength="12" placeholder="Repite la contraseña" required>
            </label>
            <button class="btn primary" type="submit" id="change-password-btn">Guardar y continuar</button>
          </form>

          <p class="fine-print">Elige una contraseña que recuerdes: con ella entrarás a partir de ahora.</p>
          ${go()}
        </section>
      </main>
    </div>
  `,U.querySelector(`#change-password-form`).addEventListener(`submit`,Mo),yo()}async function Mo(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=U.querySelector(`#change-password-btn`),i=String(n.get(`password`)||``),a=String(n.get(`confirm`)||``);if(H.error=``,H.notice=``,i.length<12)G(`La contraseña debe tener al menos 12 caracteres.`),jo();else if(!/[a-z]/.test(i)||!/[A-Z]/.test(i)||!/\d/.test(i))G(`La contraseña debe incluir al menos una minúscula, una mayúscula y un número.`),jo();else if(i!==a)G(`Las contraseñas no coinciden.`),jo();else{r.disabled=!0,r.textContent=`Guardando…`;try{let{data:e,error:t}=await B.functions.invoke(`complete-password-change`,{body:{new_password:i}});if(t)throw t;if(!e?.ok)throw Error(e?.error||`No se pudo actualizar la contraseña`);H.profile={...H.profile||{},must_change_password:!1},H.passwordRecovery=!1,K(`Contraseña actualizada. ¡Bienvenido!`),H.view=`dashboard`,$(),await J(H.profile)}catch(e){G(e?.message||`No se pudo actualizar la contraseña. Intenta de nuevo.`),jo()}}}function No(){let e=new URL(window.location.href);e.searchParams.has(`link_token`)&&(e.searchParams.delete(`link_token`),window.history.replaceState({},``,e.pathname+e.search+e.hash))}function Po(e){U.innerHTML=`
    <div class="shell">
      ${ho()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel login-panel">
          <span class="kicker">Invitación de alumno</span>
          <h1>Crea tu contraseña</h1>
          <p class="muted">Tu profesor generó este enlace de un solo uso. Elige una contraseña que solo tú conozcas.</p>

          ${mo()}

          <form id="link-redeem-form" class="form">
            <label class="field">
              <span>Nueva contraseña (mínimo 12, con mayúscula, minúscula y número)</span>
              <input name="password" type="password" autocomplete="new-password" minlength="12" placeholder="Tu nueva contraseña" required>
            </label>
            <label class="field">
              <span>Confirma tu nueva contraseña</span>
              <input name="confirm" type="password" autocomplete="new-password" minlength="12" placeholder="Repite la contraseña" required>
            </label>
            <button class="btn primary" type="submit" id="link-redeem-btn">Guardar contraseña</button>
          </form>

          <p class="fine-print">Si el enlace venció, pide a tu profesor que genere uno nuevo.</p>
          <div class="row">
            <button class="btn ghost" type="button" id="link-redeem-cancel">Ya tengo contraseña</button>
          </div>
          ${go()}
        </section>
      </main>
    </div>
  `,U.querySelector(`#link-redeem-form`).addEventListener(`submit`,t=>{Fo(t,e)}),U.querySelector(`#link-redeem-cancel`).addEventListener(`click`,()=>{No(),H.error=``,H.notice=``,q()}),yo()}async function Fo(e,t){e.preventDefault();let n=e.currentTarget,r=new FormData(n),i=U.querySelector(`#link-redeem-btn`),a=String(r.get(`password`)||``),o=String(r.get(`confirm`)||``);if(H.error=``,H.notice=``,a.length<12)G(`La contraseña debe tener al menos 12 caracteres.`),Po(t);else if(!/[a-z]/.test(a)||!/[A-Z]/.test(a)||!/\d/.test(a))G(`La contraseña debe incluir al menos una minúscula, una mayúscula y un número.`),Po(t);else if(a!==o)G(`Las contraseñas no coinciden.`),Po(t);else{i.disabled=!0,i.textContent=`Guardando…`;try{let{data:e,error:n}=await B.functions.invoke(`redeem-student-link-token`,{body:{token:t,new_password:a}});if(n)throw n;if(!e?.ok)throw Error(e?.error||`No se pudo canjear la invitación`);No(),H.mode=`student`,H.pendingLoginUsername=e.username||e.email||``,K(`Contraseña creada. Entra con tu usuario ${e.username||e.email}.`),q()}catch(e){G(await Io(e,`No se pudo canjear la invitación. Pide un enlace nuevo.`)),Po(t)}}}async function Io(e,t){try{let t=e?.context;if(t&&typeof t.clone==`function`){let e=await t.clone().json();if(e?.error)return String(e.error)}}catch{}return e?.message||t}async function Lo(e){e.preventDefault();let t=e.currentTarget,n=U.querySelector(`#submit-btn`),r=new FormData(t);H.error=``,H.notice=``,n.disabled=!0,n.textContent=`Conectando…`;try{let e=String(r.get(`username`)||``).trim(),t=H.mode===`student`?e.includes(`@`)?e.toLowerCase():ka(e):String(r.get(`email`)||``).trim().toLowerCase();if(!t)throw Error(`Escribe un usuario válido.`);let{data:n,error:i}=await B.auth.signInWithPassword({email:t,password:String(r.get(`password`)||``)});if(i)throw i;n.session&&await Ro(n.session)}catch(e){let t=String(e?.message||``);t.toLowerCase().includes(`invalid login`)?G(`Usuario o contraseña incorrectos.`):t.toLowerCase().includes(`email not confirmed`)?G(`La cuenta aún no está confirmada. Pide apoyo al administrador.`):t.toLowerCase().includes(`rate limit`)?G(`Demasiados intentos. Espera un momento y vuelve a probar.`):G(`No se pudo iniciar sesión. Revisa tus datos o consulta a soporte.`),q()}finally{n.disabled=!1,n.textContent=`Entrar`}}async function Ro(e){if(!e){H.session=null,H.profile=null,H.dashboard=null,H.dashboardError=``,H.view=`dashboard`,H.unitView=null,H.unitResults={},ro=null,q();return}if(ro===e.access_token)return;ro=e.access_token,H.session=e;let{data:t,error:n}=await B.from(`profiles`).select(`id, role, full_name, username, email, active, must_change_password`).eq(`id`,e.user.id).maybeSingle();n?(ro=null,G(`No se pudo cargar tu perfil. Revisa la conexión con Supabase.`),Wo(`No se pudo cargar el perfil`,H.error)):t?t.active?(H.profile=t,H.dashboard=null,H.dashboardError=``,H.view=`dashboard`,H.unitView=null,H.unitResults={},H.error=``,H.notice=``,t.must_change_password?(H.view=`change-password`,jo()):($(),J(t))):(await B.auth.signOut(),ro=null,G(`Tu cuenta está inactiva. Consulta a la institución.`),q()):(await B.auth.signOut(),ro=null,G(`Tu cuenta existe, pero no tiene perfil. Pide al administrador que la complete.`),q())}async function J(e){try{let t=await zo(e);if(H.profile?.id!==e.id)return;H.dashboard=t,H.dashboardError=``}catch(t){if(H.profile?.id!==e.id)return;console.error(`dashboard_error`,t?.message||t),H.dashboard=null,H.dashboardError=`No se pudieron cargar los datos de tu panel. ${t?.message||``}`}$()}function Y(e){if(e)throw e}async function zo(e){return e.role===`admin`?Bo():e.role===`teacher`?Vo(e.id):e.role===`guardian`?Uo(e):Ho(e.id)}async function Bo(){let[e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,ee,te]=await Promise.all([B.from(`academic_years`).select(`name,starts_on,ends_on`).eq(`is_active`,!0).maybeSingle(),B.from(`groups`).select(`id,name,level,schedule,teacher_id`).order(`name`),B.from(`profiles`).select(`id,role,full_name,email,username,active,phone,created_at`).order(`created_at`),B.from(`students`).select(`id,student_code,group_id,profile_id,status`).order(`student_code`),B.from(`guardians`).select(`id,profile_id,email,full_name,phone,active`).order(`email`),B.from(`student_guardians`).select(`student_id,guardian_id`),B.from(`settings`).select(`key,value,updated_at,updated_by`).order(`key`),B.rpc(`app_admin_content_stats`),B.from(`units`).select(`id,subject_id,num,title,status`).order(`num`),B.rpc(`app_staff_dashboard`),B.rpc(`app_subject_board`),B.from(`student_profiles`).select(`*`),B.from(`terms`).select(`id,academic_year_id,name,starts_on,ends_on`).order(`starts_on`),B.from(`unit_assignments`).select(`id,group_id,unit_id,unit_version_id,status,visible,opens_at,closes_at`),B.from(`unit_versions`).select(`id,unit_id,version,published_at`).not(`published_at`,`is`,null).order(`version`,{ascending:!1}),B.from(`student_unit_overrides`).select(`assignment_id,student_id,status,opens_at,closes_at`),B.rpc(`app_staff_tasks`),B.rpc(`app_activity_log`,{p_limit:80}),B.rpc(`app_external_accounts`),B.from(`student_billing`).select(`*`),B.from(`payments`).select(`id,student_id,amount,paid_at,method,period,notes,period_start,period_end,status,receipt_no,voided_at,void_reason`).order(`paid_at`,{ascending:!1}).limit(600),B.from(`student_billing_status`).select(`*`),B.from(`audit_log`).select(`id,actor_id,action,entity_type,entity_id,created_at`).order(`created_at`,{ascending:!1}).limit(200),B.from(`data_requests`).select(`id,profile_id,student_id,kind,details,status,received_at,due_at,resolved_at,resolution`).order(`received_at`,{ascending:!1}).limit(200)]);Y(e.error),Y(t.error),Y(n.error),Y(r.error),Y(i.error),Y(a.error),Y(o.error),Y(s.error),Y(c.error),Y(l.error),Y(u.error),Y(d.error),Y(f.error),Y(p.error),Y(m.error),Y(h.error),Y(g.error),Y(_.error),Y(v.error),Y(y.error),Y(b.error),Y(x.error),Y(ee.error),Y(te.error);let S=n.data||[],ne=r.data||[],re=i.data||[],ie=t.data||[],C=c.data||[],ae=new Map((s.data||[]).map(e=>[e.subject_id,e.subject_name])),w=new Map;for(let e of m.data||[])w.has(e.unit_id)||w.set(e.unit_id,[]),w.get(e.unit_id).push(e);let oe=C.filter(e=>e.status===`published`).map(e=>({...e,subject_name:ae.get(e.subject_id)||e.subject_id,versions:w.get(e.id)||[]})),se=new Map;for(let e of h.data||[])se.has(e.assignment_id)||se.set(e.assignment_id,[]),se.get(e.assignment_id).push(e);let ce=S.reduce((e,t)=>(e[t.role]=(e[t.role]||0)+1,e),{}),le=new Map(S.map(e=>[e.id,e.full_name])),ue=new Map(ie.map(e=>[e.id,e.name])),de=new Map(S.map(e=>[e.id,e.full_name])),fe=new Map(ne.map(e=>[e.id,e.student_code])),pe=new Map;for(let e of a.data||[])pe.has(e.guardian_id)||pe.set(e.guardian_id,[]),pe.get(e.guardian_id).push(fe.get(e.student_id)||`?`);return{kind:`admin`,year:e.data,groups:ie.map(e=>({...e,teacher_name:de.get(e.teacher_id)||`Sin profesor`})),profiles:S,students:ne.map(e=>({...e,full_name:le.get(e.profile_id)||`Alumno sin nombre`,group_name:ue.get(e.group_id)||`Sin grupo`})),guardians:re.map(e=>({...e,students:pe.get(e.id)||[]})),settings:o.data||[],stats:s.data||[],units:C,overview:l.data||null,board:(u.data||{}).subjects||[],assignments:(p.data||[]).map(e=>({...e,overrides:se.get(e.id)||[]})),publishedUnits:oe,tasks:(g.data||{}).tasks||[],activity:(_.data||{}).entries||[],externalAccounts:v.data||[],billingByStudent:new Map((y.data||[]).map(e=>[e.student_id,e])),payments:b.data||[],billingStatusByStudent:new Map((x.data||[]).map(e=>[e.student_id,e])),auditLog:ee.data||[],dataRequests:te.data||[],studentProfiles:new Map((d.data||[]).map(e=>[e.student_id,e])),terms:f.data||[],subjectNames:new Map((s.data||[]).map(e=>[e.subject_id,e.subject_name])),counts:{profiles:S.length,students:ne.length,...ce}}}async function Vo(e){let t=await B.from(`groups`).select(`id,name,level,schedule`).eq(`teacher_id`,e).order(`name`);Y(t.error);let n=t.data||[],r=n.map(e=>e.id),i=[];if(r.length){let e=await B.from(`students`).select(`id,student_code,group_id,profile_id`).in(`group_id`,r).order(`student_code`);Y(e.error),i=e.data||[]}let a=i.map(e=>e.id),o=[...new Set(i.map(e=>e.profile_id))],s=[];if(o.length){let e=await B.from(`profiles`).select(`id,full_name`).in(`id`,o);Y(e.error),s=e.data||[]}let[c,l,u,d,f,p,m,h,g,_,v,y,b,x,ee,te,S]=await Promise.all([B.from(`units`).select(`id,title,subject_id,estimated_minutes`).eq(`status`,`published`).order(`title`),B.from(`unit_versions`).select(`id,unit_id,version,published_at`).not(`published_at`,`is`,null).order(`version`,{ascending:!1}),r.length?B.from(`unit_assignments`).select(`id,group_id,unit_id,unit_version_id,status,visible,opens_at,closes_at`).in(`group_id`,r).order(`created_at`,{ascending:!1}):Promise.resolve({data:[],error:null}),r.length?B.from(`student_unit_overrides`).select(`assignment_id,student_id,status,opens_at,closes_at`):Promise.resolve({data:[],error:null}),B.from(`subjects`).select(`id,name`).order(`name`),B.rpc(`app_staff_dashboard`),a.length?B.from(`student_stats`).select(`student_id,xp_total,current_streak,best_streak,units_completed,last_activity_date`).in(`student_id`,a):Promise.resolve({data:[],error:null}),a.length?B.from(`student_guardians`).select(`student_id,guardian_id`).in(`student_id`,a):Promise.resolve({data:[],error:null}),B.from(`guardians`).select(`id,full_name,email,phone,relationship`),B.rpc(`app_subject_board`),a.length?B.from(`student_profiles`).select(`*`).in(`student_id`,a):Promise.resolve({data:[],error:null}),B.from(`terms`).select(`id,academic_year_id,name,starts_on,ends_on`).order(`starts_on`),B.rpc(`app_staff_tasks`),B.rpc(`app_activity_log`,{p_limit:80}),a.length?B.from(`student_billing`).select(`*`).in(`student_id`,a):Promise.resolve({data:[],error:null}),a.length?B.from(`payments`).select(`id,student_id,amount,paid_at,method,period,notes,period_start,period_end,status,receipt_no,voided_at,void_reason`).in(`student_id`,a).order(`paid_at`,{ascending:!1}).limit(400):Promise.resolve({data:[],error:null}),a.length?B.from(`student_billing_status`).select(`*`).in(`student_id`,a):Promise.resolve({data:[],error:null})]);Y(c.error),Y(l.error),Y(u.error),Y(d.error),Y(f.error),Y(p.error),Y(m.error),Y(h.error),Y(g.error),Y(_.error),Y(v.error),Y(y.error),Y(b.error),Y(x.error),Y(ee.error),Y(te.error),Y(S.error);let ne=new Map(s.map(e=>[e.id,e.full_name])),re=new Map((f.data||[]).map(e=>[e.id,e.name])),ie=new Map;for(let e of l.data||[])ie.has(e.unit_id)||ie.set(e.unit_id,[]),ie.get(e.unit_id).push(e);let C=(c.data||[]).map(e=>({...e,subject_name:re.get(e.subject_id)||e.subject_id,versions:ie.get(e.id)||[]})),ae=new Map(C.map(e=>[e.id,e.title])),w=new Map;for(let e of d.data||[])w.has(e.assignment_id)||w.set(e.assignment_id,[]),w.get(e.assignment_id).push(e);let oe=(u.data||[]).map(e=>({...e,unit_title:ae.get(e.unit_id)||`Unidad`,overrides:w.get(e.id)||[]})),se=new Map((m.data||[]).map(e=>[e.student_id,e])),ce=new Map((g.data||[]).map(e=>[e.id,e])),le=new Map;for(let e of h.data||[]){le.has(e.student_id)||le.set(e.student_id,[]);let t=ce.get(e.guardian_id);t&&le.get(e.student_id).push(t)}return{kind:`teacher`,overview:p.data||null,board:(_.data||{}).subjects||[],tasks:(b.data||{}).tasks||[],activity:(x.data||{}).entries||[],billingByStudent:new Map((ee.data||[]).map(e=>[e.student_id,e])),payments:te.data||[],billingStatusByStudent:new Map((S.data||[]).map(e=>[e.student_id,e])),studentProfiles:new Map((v.data||[]).map(e=>[e.student_id,e])),terms:y.data||[],groups:n.map(e=>({...e,students:i.filter(t=>t.group_id===e.id).map(e=>({...e,full_name:ne.get(e.profile_id)||`Alumno sin nombre`,stats:se.get(e.id)||null,guardians:le.get(e.id)||[]}))})),students:n.map(e=>({...e,students:i.filter(t=>t.group_id===e.id).map(t=>({...t,full_name:ne.get(t.profile_id)||`Alumno sin nombre`,stats:se.get(t.id)||null,guardians:le.get(t.id)||[],group_name:e.name}))})).flatMap(e=>e.students),publishedUnits:C,assignments:oe}}async function Ho(e){let t=await B.from(`students`).select(`id,student_code,group_id,status`).eq(`profile_id`,e).maybeSingle();if(Y(t.error),!t.data)return{kind:`student`,student:null,group:null,units:[],activeAssignments:0};let[n,r,i]=await Promise.all([B.from(`groups`).select(`name,level,schedule`).eq(`id`,t.data.group_id).maybeSingle(),B.from(`unit_assignments`).select(`id,unit_id,unit_version_id,instructions,opens_at,closes_at,status,visible`).eq(`group_id`,t.data.group_id).in(`status`,[`active`,`closed`]).eq(`visible`,!0).order(`created_at`),B.from(`student_guidance`).select(`*`).eq(`student_id`,t.data.id).maybeSingle()]);Y(n.error),Y(r.error),Y(i.error);let a=r.data||[],o=a.map(e=>e.id),s=[];if(o.length){let e=await B.from(`student_unit_overrides`).select(`assignment_id,status,opens_at,closes_at`).eq(`student_id`,t.data.id).in(`assignment_id`,o);Y(e.error),s=e.data||[]}let c=new Map(s.map(e=>[e.assignment_id,e])),l=Date.now(),u=a.filter(e=>{let t=c.get(e.id);if((t?.status||e.status)!==`active`)return!1;let n=t?.opens_at||e.opens_at,r=t?.closes_at||e.closes_at;return!(n&&new Date(n).getTime()>l||r&&new Date(r).getTime()<=l)}),d=[...new Set(u.map(e=>e.unit_id))],f=u.map(e=>e.id),p=[],m=[],h=[];if(d.length){let[e,n,r]=await Promise.all([B.from(`units`).select(`id,title,subject_id,estimated_minutes`).in(`id`,d),B.from(`subjects`).select(`id,name`).order(`name`),B.from(`unit_progress`).select(`assignment_id,status,attempts_count,best_accuracy,completed_at`).eq(`student_id`,t.data.id).in(`assignment_id`,f)]);Y(e.error),Y(n.error),Y(r.error),p=e.data||[],m=n.data||[],h=r.data||[]}let g=new Map(p.map(e=>[e.id,e])),_=new Map(m.map(e=>[e.id,e.name])),v=new Map(h.map(e=>[e.assignment_id,e])),y=u.map(e=>{let t=g.get(e.unit_id);return{...e,unit:t?{...t,subject_name:_.get(t.subject_id)||t.subject_id}:null,progress:v.get(e.id)||null}});return{kind:`student`,student:t.data,group:n.data,profile:i.data||{},units:y,activeAssignments:y.length}}async function Uo(e){let[t,n]=await Promise.all([B.from(`guardians`).select(`id`).eq(`profile_id`,e.id).maybeSingle(),B.from(`privacy_document`).select(`version,url,sha256`).maybeSingle()]);Y(t.error);let r=n.error||!n.data?{version:qa,url:`/privacidad.html`,sha256:``}:n.data,i=t.data?.id;if(!i)return{kind:`guardian`,privacy:r,billingByStudent:new Map,payments:[],children:[],pending:[]};let a=await B.from(`student_guardians`).select(`student_id`).eq(`guardian_id`,i).order(`student_id`);Y(a.error);let o=[...new Set((a.data||[]).map(e=>e.student_id))];if(!o.length)return{kind:`guardian`,privacy:r,billingByStudent:new Map,payments:[],children:[],pending:[]};let s=await B.from(`privacy_consents`).select(`student_id,document_version,accepted_at,revoked_at`).eq(`guardian_id`,i).in(`student_id`,o);Y(s.error);let c=r.version||qa,l=new Map;for(let e of s.data||[])e.document_version===c&&!e.revoked_at&&l.set(e.student_id,e);let u=o.filter(e=>l.has(e)),d=o.filter(e=>!l.has(e)),f=u.length?await B.from(`students`).select(`id,student_code,group_id,profile_id`).in(`id`,u).order(`student_code`):{data:[],error:null};Y(f.error);let p=f.data||[],m=[...new Set(p.map(e=>e.profile_id))],h=[...new Set(p.map(e=>e.group_id))],g=p.map(e=>e.id),[_,v,y,b,x,ee,te,S,ne,re,ie,C,ae,w,oe,se,ce]=await Promise.all([m.length?B.from(`profiles`).select(`id,full_name`).in(`id`,m):Promise.resolve({data:[],error:null}),h.length?B.from(`groups`).select(`id,name`).in(`id`,h):Promise.resolve({data:[],error:null}),g.length?B.from(`student_billing`).select(`*`).in(`student_id`,g):Promise.resolve({data:[],error:null}),g.length?B.from(`payments`).select(`id,student_id,amount,paid_at,method,period,period_start,period_end,status,receipt_no,voided_at,void_reason`).in(`student_id`,g).order(`paid_at`,{ascending:!1}).limit(120):Promise.resolve({data:[],error:null}),g.length?B.from(`student_billing_status`).select(`*`).in(`student_id`,g):Promise.resolve({data:[],error:null}),g.length?B.from(`student_guidance`).select(`*`).in(`student_id`,g):Promise.resolve({data:[],error:null}),g.length?B.from(`unit_progress`).select(`student_id,assignment_id,status,best_accuracy,completed_at,attempts_count`).in(`student_id`,g):Promise.resolve({data:[],error:null}),h.length?B.from(`unit_assignments`).select(`id,group_id,unit_id,status,visible,opens_at,closes_at`).in(`group_id`,h):Promise.resolve({data:[],error:null}),g.length?B.from(`grades`).select(`student_id,assessment_id,score,status,notes,recorded_at`).in(`student_id`,g):Promise.resolve({data:[],error:null}),h.length?B.from(`assessments`).select(`id,group_id,subject_id,name,type,max_score,assessment_date`).in(`group_id`,h):Promise.resolve({data:[],error:null}),g.length?B.from(`attendance`).select(`student_id,session_id,status,minutes_late`).in(`student_id`,g):Promise.resolve({data:[],error:null}),h.length?B.from(`attendance_sessions`).select(`id,group_id,session_date,topic`).in(`group_id`,h):Promise.resolve({data:[],error:null}),g.length?B.from(`observations`).select(`student_id,category,body,created_at`).in(`student_id`,g).eq(`visibility`,`family`):Promise.resolve({data:[],error:null}),h.length?B.from(`tasks`).select(`id,group_id,subject_id,title,due_at,max_score,task_type`).in(`group_id`,h).is(`archived_at`,null):Promise.resolve({data:[],error:null}),g.length?B.from(`task_submissions`).select(`task_id,student_id,status,score,feedback,submitted_at`).in(`student_id`,g):Promise.resolve({data:[],error:null}),g.length?B.from(`student_stats`).select(`student_id,xp_total,units_completed,units_mastered,accuracy,reading_wpm,reading_comprehension`).in(`student_id`,g):Promise.resolve({data:[],error:null}),B.from(`subjects`).select(`id,name`).order(`name`)]);Y(_.error),Y(v.error),Y(y.error),Y(b.error),Y(x.error),Y(ee.error),Y(te.error),Y(S.error),Y(ne.error),Y(re.error),Y(ie.error),Y(C.error),Y(ae.error),Y(w.error),Y(oe.error),Y(se.error),Y(ce.error);let le=[...new Set((S.data||[]).map(e=>e.unit_id).filter(Boolean))],ue=le.length?await B.from(`units`).select(`id,title,subject_id`).in(`id`,le):{data:[],error:null};Y(ue.error);let de=new Map((_.data||[]).map(e=>[e.id,e.full_name])),fe=new Map((v.data||[]).map(e=>[e.id,e.name])),pe=new Map((ce.data||[]).map(e=>[e.id,e.name])),me=new Map((ue.data||[]).map(e=>[e.id,e])),he=new Map((S.data||[]).map(e=>[e.id,e])),ge=new Map((re.data||[]).map(e=>[e.id,e])),_e=new Map((C.data||[]).map(e=>[e.id,e]));new Map((w.data||[]).map(e=>[e.id,e]));let ve=new Map((ee.data||[]).map(e=>[e.student_id,e])),ye=new Map((se.data||[]).map(e=>[e.student_id,e])),T=(e,t)=>{let n=new Map;for(let r of e||[]){let e=r[t];n.has(e)||n.set(e,[]),n.get(e).push(r)}return n},be=T(te.data,`student_id`),xe=T(ne.data,`student_id`),Se=T(ie.data,`student_id`),Ce=T(ae.data,`student_id`),we=T(oe.data,`student_id`),Te=new Map(p.map(e=>{let t=(be.get(e.id)||[]).map(e=>{let t=he.get(e.assignment_id),n=t?me.get(t.unit_id):null;return{...e,unit_title:n?.title||`Unidad`,subject_name:n?pe.get(n.subject_id)||n.subject_id:``,opens_at:t?.opens_at||null,closes_at:t?.closes_at||null}}),n=(xe.get(e.id)||[]).map(e=>{let t=ge.get(e.assessment_id);return{...e,assessment_name:t?.name||`Evaluación`,subject_name:t?pe.get(t.subject_id)||t.subject_id:``,max_score:t?.max_score??null,assessment_date:t?.assessment_date||null}}).sort((e,t)=>String(t.assessment_date||``).localeCompare(String(e.assessment_date||``))),r=(Se.get(e.id)||[]).map(e=>{let t=_e.get(e.session_id);return{...e,session_date:t?.session_date||null,topic:t?.topic||``}}).sort((e,t)=>String(t.session_date||``).localeCompare(String(e.session_date||``))),i=(Ce.get(e.id)||[]).slice().sort((e,t)=>String(t.created_at||``).localeCompare(String(e.created_at||``))),a=we.get(e.id)||[],o=(w.data||[]).filter(t=>t.group_id===e.group_id).map(e=>({...e,subject_name:pe.get(e.subject_id)||e.subject_id,submission:a.find(t=>t.task_id===e.id)||null})).sort((e,t)=>String(e.due_at||``).localeCompare(String(t.due_at||``)));return[e.id,{guidance:ve.get(e.id)||{},stats:ye.get(e.id)||{},progress:t,grades:n,attendance:r,observations:i,tasks:o}]}));return{kind:`guardian`,privacy:r,billingByStudent:new Map((y.data||[]).map(e=>[e.student_id,e])),payments:b.data||[],billingStatusByStudent:new Map((x.data||[]).map(e=>[e.student_id,e])),academics:Te,children:p.map(e=>({...e,full_name:de.get(e.profile_id)||`Alumno sin nombre`,group_name:fe.get(e.group_id)||`Sin grupo`,consent_accepted:!0,consent_accepted_at:l.get(e.id)?.accepted_at||null})),pending:d.map((e,t)=>({id:e,label:d.length===1?`el alumno vinculado`:`el alumno ${t+1}`}))}}function Wo(e,t){U.innerHTML=`
    <div class="shell">
      ${ho()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel config-panel">
          <span class="kicker">Error de acceso</span>
          <h1>${W(e)}</h1>
          <p>${W(t)}</p>
          <div class="row">
            <button class="btn primary" id="retry-btn">Reintentar</button>
            <button class="btn ghost" id="fatal-logout">Cerrar sesión</button>
          </div>
        </section>
      </main>
    </div>
  `,U.querySelector(`#retry-btn`).addEventListener(`click`,()=>{H.error=``,bo(),B.auth.getSession().then(({data:e})=>{e.session?Ro(e.session):q()})}),U.querySelector(`#fatal-logout`).addEventListener(`click`,zl)}function X(e){if(!e)return``;let[t,n,r]=String(e).split(`-`).map(Number);return!t||!n||!r?String(e):new Intl.DateTimeFormat(`es-MX`,{day:`2-digit`,month:`short`,year:`numeric`,timeZone:`UTC`}).format(new Date(Date.UTC(t,n-1,r)))}function Go(e,t,n){return`${e} ${e===1?t:n}`}function Ko(e){return ss(e)}function qo(e){let t=e.profiles.filter(e=>e.role===`teacher`),n=e.guardians,r=e.externalAccounts||[],i=new Set((e.students||[]).map(e=>e.profile_id)),a=e.profiles.filter(e=>e.role===`student`&&!i.has(e.id));return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Profesores y admin</span>
          <h2>${t.length?Go(t.length,`profesor`,`profesores`):`Sin profesores`}</h2>
        </div>
      </div>
      <ul class="data-list">
        ${e.profiles.filter(e=>e.role===`teacher`||e.role===`admin`).map(e=>`
    <li>
      <div>
        <strong>${W(e.full_name)}${e.role===`admin`?` · Tú`:``}</strong>
        <small>${W(e.email||e.username||`Sin identificador`)}</small>
      </div>
      ${e.role===`admin`?`
        <span class="pill success">Activo</span>
      `:`
        <button class="btn ghost" data-toggle-user="${W(e.id)}" data-active="${e.active?`1`:`0`}">
          ${e.active?`Desactivar`:`Activar`}
        </button>
      `}
    </li>
  `).join(``)}
      </ul>

      <details class="admin-details">
        <summary>Crear profesor</summary>
        <form class="form" id="create-teacher-form">
          <label class="field">
            <span>Nombre completo</span>
            <input name="full_name" autocomplete="off" placeholder="Nombre y apellidos" required>
          </label>
          <label class="field">
            <span>Correo</span>
            <input name="email" type="email" autocomplete="off" placeholder="profesor@colegio.mx" required>
          </label>
          <label class="field">
            <span>Contraseña (mínimo 12, con mayúscula, minúscula y número)</span>
            <input name="password" type="text" autocomplete="off" minlength="12" placeholder="Contraseña temporal" required>
          </label>
          <button class="btn primary" type="submit">Crear profesor</button>
        </form>
      </details>
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Alumnos</span>
          <h2>${e.students.length?Go(e.students.length,`alumno`,`alumnos`):`Sin alumnos`}</h2>
        </div>
      </div>
      ${e.students.length?`
        <ul class="data-list">
          ${e.students.map(e=>`
            <li>
              <div>
                <strong>${W(e.full_name)}</strong>
                <small>${W(e.student_code)} · ${W(e.group_name)} · ${W(e.status)}</small>
              </div>
              <div class="row">
                <button class="btn ghost" data-reset-student="${W(e.id)}" data-student-name="${W(e.full_name)}">Nueva contraseña</button>
                <button class="btn ghost" data-reissue-invite="${W(e.id)}" data-student-name="${W(e.full_name)}">Enlace de acceso</button>
              </div>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Todavía no hay alumnos.</p>`}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Tutores</span>
          <h2>${n.length?Go(n.length,`tutor`,`tutores`):`Sin tutores`}</h2>
        </div>
      </div>
      ${n.length?`
        <ul class="data-list">
          ${n.map(e=>`
            <li>
              <div>
                <strong>${W(e.full_name)}</strong>
                <small>${W(e.email||e.phone||`Sin contacto`)} · Alumnos: ${e.students.map(W).join(`, `)||`—`}</small>
              </div>
              <span class="pill ${e.active?`success`:``}">${e.active?`Activo`:`Inactivo`}</span>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Todavía no hay tutores. Invítalos desde el panel del profesor.</p>`}
    </article>

    ${Jo(r,a)}
  `}function Jo(e,t){return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Detección de colados</span>
          <h2>Cuentas externas</h2>
        </div>
        <span class="pill ${e.length?`pill-red`:`success`}">${e.length?Go(e.length,`cuenta`,`cuentas`):`Ninguna`}</span>
      </div>
      <p class="muted">Cuentas creadas fuera de la plataforma (sin perfil ni grupo). No pueden ver nada del curso. Aquí puedes <strong>bloquearlas</strong> o vincularlas desde el alta de alumnos con su correo.</p>
      ${e.length?`
        <ul class="data-list">
          ${e.map(e=>`
            <li>
              <div>
                <strong>${W(e.email)}</strong>
                <small>
                  ${e.banned?`⛔ Bloqueada`:e.email_confirmed?`Correo confirmado`:`⚠️ Correo sin confirmar`}
                  · Creada ${W(Z(e.created_at))}
                  · Último acceso: ${e.last_sign_in_at?W(Z(e.last_sign_in_at)):`nunca`}
                </small>
              </div>
              <button class="btn ghost ${e.banned?``:`danger`}" data-ban-account="${W(e.id)}" data-ban="${e.banned?`0`:`1`}">
                ${e.banned?`Desbloquear`:`Bloquear`}
              </button>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">No hay cuentas externas detectadas. ¡Nadie colado! ✅</p>`}
    </article>

    ${t.length?`
      <article class="card wide">
        <div class="card-heading">
          <div>
            <span class="card-label">Revisar</span>
            <h2>Perfiles de alumno sin ficha vinculada</h2>
          </div>
          <span class="pill pill-amber">${t.length}</span>
        </div>
        <ul class="data-list">
          ${t.map(e=>`
            <li>
              <div>
                <strong>${W(e.full_name)}</strong>
                <small>${W(e.email||e.username||`Sin identificador`)} · Sin ficha de alumno en ningún grupo</small>
              </div>
              <button class="btn ghost" data-toggle-user="${W(e.id)}" data-active="${e.active?`1`:`0`}">
                ${e.active?`Desactivar`:`Activar`}
              </button>
            </li>
          `).join(``)}
        </ul>
      </article>
    `:``}
  `}function Yo(e){let t=new Map;for(let n of e.units)t.has(n.subject_id)||t.set(n.subject_id,[]),t.get(n.subject_id).push(n);return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Contenido</span>
          <h2>Materias y unidades</h2>
        </div>
        <span class="pill">Versión 1 publicada</span>
      </div>
      ${e.stats.length?`
        <ul class="data-list">
          ${e.stats.map(e=>`
            <li>
              <div>
                <strong>${W(e.subject_name)}</strong>
                <small>
                  ${e.units_total} unidades · ${e.units_published} publicadas ·
                  ${e.exercises} ejercicios · ${e.quiz_count} quiz · ${Number(e.has_reto)>0?`con reto`:`sin reto`}
                </small>
              </div>
              <span class="pill ${e.subject_active?`success`:``}">${e.subject_active?`Activa`:`Inactiva`}</span>
            </li>
            ${(t.get(e.subject_id)||[]).map(e=>`
              <li class="unit-row">
                <div>
                  <small>U${String(e.num).padStart(2,`0`)} · ${W(e.title)}</small>
                </div>
                <span class="pill ${e.status===`published`?`success`:``}">${W(e.status)}</span>
              </li>
            `).join(``)}
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Sin estadísticas de contenido.</p>`}
    </article>
  `}var Xo={access:`Acceso`,rectification:`Rectificación`,cancellation:`Cancelación`,opposition:`Oposición`,portability:`Portabilidad`,revocation:`Revocación`},Zo={received:`Recibida`,in_progress:`En proceso`,resolved:`Resuelta`,rejected:`Rechazada`};function Qo(e){let t=e.auditLog||[],n=e.dataRequests||[],r=new Map((e.profiles||[]).map(e=>[e.id,e.full_name||e.email||e.id]));return`
    <div class="section-title">
      <div>
        <span class="card-label">Gobierno</span>
        <h2>Auditoría y solicitudes ARCO</h2>
      </div>
      <span class="pill">${t.length} eventos · ${n.length} solicitudes</span>
    </div>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">PRIV-06</span>
          <h2>Solicitudes de datos</h2>
        </div>
      </div>
      ${n.length?`
        <ul class="data-list audit-list">
          ${n.map(e=>`
            <li>
              <div>
                <strong>${W(Xo[e.kind]||e.kind)} · ${W(Zo[e.status]||e.status)}</strong>
                <small>Recibida: ${W(X(String(e.received_at).slice(0,10)))} · Plazo: ${W(X(String(e.due_at).slice(0,10)))}${e.resolved_at?` · Resuelta: ${W(X(String(e.resolved_at).slice(0,10)))}`:``}</small>
                ${e.details?`<p>${W(e.details)}</p>`:``}
                ${e.resolution?`<p class="muted"><strong>Resolución:</strong> ${W(e.resolution)}</p>`:``}
              </div>
              ${e.status===`received`||e.status===`in_progress`?`
                <div class="row">
                  <select data-request-status="${W(e.id)}" aria-label="Nuevo estado">
                    <option value="in_progress">En proceso</option>
                    <option value="resolved">Resuelta</option>
                    <option value="rejected">Rechazada</option>
                  </select>
                  <input data-request-resolution="${W(e.id)}" placeholder="Motivo de la resolución" minlength="10" aria-label="Motivo de la resolución">
                  <button class="btn primary" data-resolve-request="${W(e.id)}">Resolver</button>
                </div>
              `:``}
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">No hay solicitudes registradas.</p>`}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">SEC-07</span>
          <h2>Registro de acciones</h2>
        </div>
      </div>
      ${t.length?`
        <ul class="data-list audit-list">
          ${t.map(e=>`
            <li>
              <div>
                <strong>${W(e.action)}</strong>
                <small>${W(r.get(e.actor_id)||`Sistema`)} · ${W(e.entity_type)}${e.entity_id?` · ${W(e.entity_id)}`:``}</small>
              </div>
              <span class="pill">${W(X(String(e.created_at).slice(0,10)))}</span>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Todavía no hay eventos auditados.</p>`}
    </article>
  `}async function $o(e){let t=e.dataset.resolveRequest,n=U.querySelector(`[data-request-status="${t}"]`)?.value,r=String(U.querySelector(`[data-request-resolution="${t}"]`)?.value||``).trim();if(n!==`in_progress`&&n!==`resolved`&&n!==`rejected`){G(`Selecciona un estado válido.`),$();return}if(n!==`in_progress`&&r.length<10){G(`Escribe una resolución de al menos 10 caracteres.`),$();return}e.disabled=!0,e.textContent=`Guardando…`;let{error:i}=await B.rpc(`app_resolve_data_request`,{p_request_id:t,p_status:n,p_resolution:r||`Solicitud tomada en atención.`});i?G(i.message||`No se pudo actualizar la solicitud.`):K(`Solicitud actualizada y registrada en auditoría.`),$(),await J(H.profile)}function es(e){return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Configuración</span>
          <h2>Parámetros del sistema</h2>
        </div>
      </div>
      ${e.settings.length?`
        <ul class="data-list settings-list">
          ${e.settings.map(e=>`
            <li>
              <div>
                <strong>${W(e.key)}</strong>
                <small>Actualizado: ${W(e.updated_at?new Date(e.updated_at).toLocaleString():`—`)}</small>
              </div>
              <div class="row setting-edit">
                <input data-setting-value="${W(e.key)}" value="${W(JSON.stringify(e.value))}">
                <button class="btn primary" data-save-setting="${W(e.key)}">Guardar</button>
              </div>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Sin parámetros configurados.</p>`}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Entorno</span>
          <h2>Información técnica</h2>
        </div>
      </div>
      <ul class="data-list">
        <li><div><strong>App</strong><small>${W(Oa)} · GitHub Pages</small></div></li>
        <li><div><strong>Supabase</strong><small>${W(ts())}</small></div></li>
        <li><div><strong>Aviso de privacidad vigente</strong><small>${W(qa)}</small></div></li>
      </ul>
    </article>
  `}function ts(){try{return new URL(`https://ioikcrdxneuydylyhvwi.supabase.co`).host}catch{return`sin configurar`}}function ns(e){if(!e)return``;let t=new Date(`${String(e).slice(0,10)}T12:00:00`);return Number.isNaN(t.getTime())?``:t.toLocaleDateString(`es-MX`,{weekday:`short`,day:`numeric`})}function Z(e){if(!e)return``;let t=new Date(e);if(Number.isNaN(t.getTime()))return``;let n=Math.max(0,Math.round((Date.now()-t.getTime())/1e3));if(n<60)return`ahora`;let r=Math.round(n/60);if(r<60)return`hace ${r} min`;let i=Math.round(r/60);if(i<24)return`hace ${i} h`;let a=Math.round(i/24);return a===1?`ayer`:a<30?`hace ${a} días`:t.toLocaleDateString(`es-MX`)}function rs(e){let t=[],n=e?.pending_consent||[],r=e?.inactive_students||[],i=e?.assignments_ending_soon||[];n.length&&t.push(`
      <div class="attention-item">
        <span class="dot dot-amber"></span>
        <div><strong>${n.length} ${n.length===1?`tutor sin consentimiento`:`tutores sin consentimiento`}</strong>
        <div class="muted"><small>${n.slice(0,4).map(e=>`${W(e.student)} · ${W(e.guardian)}`).join(` · `)}${n.length>4?`…`:``}</small></div></div>
      </div>
    `);for(let e of r.slice(0,3))t.push(`
      <div class="attention-item">
        <span class="dot dot-red"></span>
        <div><strong>${W(e.name||e.student)}</strong> sin actividad reciente
        <div class="muted"><small>${e.days?`última actividad hace ${e.days} días`:`sin actividad registrada`} · ${W(e.student)}</small></div></div>
      </div>
    `);r.length>3&&t.push(`
      <div class="attention-item"><span class="dot dot-red"></span>
      <div><strong>${r.length-3} alumnos más</strong> sin actividad reciente.</div></div>
    `),e?.attendance_missing_today&&t.push(`
      <div class="attention-item"><span class="dot dot-blue"></span>
      <div><strong>Asistencia de hoy sin registrar</strong>
      <div class="muted"><small>Pásala en la sección de asistencia del grupo.</small></div></div></div>
    `),e?.units_without_assignments>0&&t.push(`
      <div class="attention-item"><span class="dot dot-blue"></span>
      <div><strong>${e.units_without_assignments} unidades publicadas sin activar</strong>
      <div class="muted"><small>Actívalas desde la sección de unidades del grupo.</small></div></div></div>
    `);for(let e of i.slice(0,3))t.push(`
      <div class="attention-item"><span class="dot dot-amber"></span>
      <div><strong>«${W(e.unit)}» por cerrar</strong>
      <div class="muted"><small>${W(e.group)} · cierra ${W(X(String(e.closes).slice(0,10)))}</small></div></div>
    `);return t.length?t.join(``):`<div class="attention-item"><span class="dot dot-green"></span><div><strong>Todo en orden 🎉</strong><div class="muted"><small>No hay pendientes que requieran tu atención.</small></div></div></div>`}function is(e){let t=Array.isArray(e)?e:[];return t.length?`
    <div class="feed-list">
      ${t.map(e=>`
        <div class="feed-item">
          <span class="feed-emoji">${e.kind===`completed`?`🏆`:`✏️`}</span>
          <div>
            <strong>${W(e.name||e.student)}</strong> ${W(e.text)}
            <div><small>${W(e.student)} · ${W(Z(e.ts))}</small></div>
          </div>
          <span class="${e.ok?`feed-ok`:`feed-bad`}">${e.ok?`✓`:`✗`}</span>
        </div>
      `).join(``)}
    </div>
  `:`<p class="empty-state">Todavía no hay actividad reciente. Cuando los alumnos trabajen, aparecerá aquí.</p>`}function as(e){if(!e)return``;let t=e.counts||{},n=e.activity||{};return`
    <div class="dash-stats">
      <div class="stat-card stat-blue"><span class="stat-num">${t.students??0}</span><span class="stat-label">Alumnos activos</span></div>
      <div class="stat-card stat-violet"><span class="stat-num">${t.published_units??0}</span><span class="stat-label">Unidades publicadas</span></div>
      <div class="stat-card stat-green"><span class="stat-num">${n.today_attempts??0}</span><span class="stat-label">Intentos hoy</span></div>
      <div class="stat-card stat-amber"><span class="stat-num">${n.week_completions??0}</span><span class="stat-label">Completadas · 7 días</span></div>
      <div class="stat-card stat-pink"><span class="stat-num">${n.xp_total??0}</span><span class="stat-label">XP del grupo</span></div>
    </div>
  `}function os(e){if(!e)return``;let t=e.activity||{},n=Array.isArray(t.series)?t.series:[],r=Math.max(1,...n.map(e=>Math.max(e.attempts||0,e.completions||0)));return`
    <div class="dash-grid">
      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">Actividad</span><h2>Últimos 7 días</h2></div>
          <span class="pill pill-blue">${t.week_attempts??0} intentos</span>
        </div>
        <div class="mini-chart">
          ${n.map(e=>`
            <div class="bar-wrap">
              <span class="bar-count">${e.attempts||0}</span>
              <div class="bar" style="height:${Math.max(3,Math.round((e.attempts||0)/r*100))}%"></div>
              <span class="bar-label">${W(ns(e.day))}</span>
            </div>
          `).join(``)}
        </div>
      </article>

      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">Recordatorios</span><h2>Requiere tu atención</h2></div>
        </div>
        <div class="attention-list">${rs(e.attention)}</div>
      </article>
    </div>
  `}function ss(e){let t=H.profile?.role===`admin`,n=H.staffTab||`dashboard`,r=!!H.sidebarCollapsed;return`
    <div class="staff-app ${r?`collapsed`:``}">
      <aside class="staff-sidebar" aria-label="Secciones">
        <a class="brand staff-brand" href="/" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span class="brand-copy">ECOEMS <small>Plataforma</small></span>
        </a>

        <nav class="staff-nav">
          <span class="side-label">${t?`Administración`:`Mi espacio`}</span>
          ${(t?[`dashboard`,`alumnos`,`materias`,`asistencia`,`pagos`,`tareas`,`actividad`,`usuarios`,`contenido`,`auditoria`,`configuracion`]:[`dashboard`,`alumnos`,`materias`,`asistencia`,`pagos`,`tareas`,`actividad`,`tutores`]).map(e=>{let t=lo(Xa[e]);return`
              <button class="staff-tab-btn ${n===e?`active`:``}" data-staff-tab="${e}" title="${W(t.text)}">
                <span class="nav-emoji" aria-hidden="true">${W(t.emoji)}</span>
                <span class="nav-text">${W(t.text)}</span>
              </button>
            `}).join(``)}
        </nav>

        <div class="staff-sidebar-footer">
          <button class="staff-tab-btn sidebar-toggle" id="sidebar-toggle" title="${r?`Mostrar menú`:`Ocultar menú`}" aria-label="${r?`Mostrar menú`:`Ocultar menú`}" aria-expanded="${r?`false`:`true`}">
            <span class="nav-emoji" aria-hidden="true">${r?`»`:`«`}</span>
            <span class="nav-text">${r?`Mostrar menú`:`Ocultar menú`}</span>
          </button>
          <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema" title="Cambiar entre modo oscuro y claro">🌓</button>
          <button class="staff-tab-btn" id="logout-btn" title="Cerrar sesión">
            <span class="nav-emoji" aria-hidden="true">🚪</span>
            <span class="nav-text">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div class="staff-main">
        <main id="main-content" tabindex="-1" class="staff-content">
          ${mo()}
          ${cs(e,n)}
          ${go()}
        </main>
      </div>
    </div>
  `}function cs(e,t){return e?t===`alumnos`?ms(e):t===`materias`?vs(e):t===`asistencia`?ys(e):t===`pagos`?ks(e):t===`tareas`?Ls(e):t===`actividad`?Rs(e):t===`tutores`?zs(e):t===`usuarios`?qo(e):t===`contenido`?Yo(e):t===`auditoria`?Qo(e):t===`configuracion`?es(e):us(e):H.dashboardError?`
        <article class="card wide">
          <span class="card-label">Panel</span>
          <h2>No se pudo cargar</h2>
          <p>${W(H.dashboardError)}</p>
        </article>
      `:`
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>Cargando datos…</h2>
        <p>Estamos consultando tu grupo y tu avance.</p>
      </article>
    `}function ls(){let e=H.profile;if(!e)return``;let t=Ua[e.role]||`Usuario`,n=e.full_name||e.username||e.email||`Sin nombre`,r=e.username?`@${e.username}`:e.email||`Sin identificador`;return`
    <section class="welcome">
      <div>
        <span class="kicker">Sesión activa</span>
        <h1>Hola, ${W(n.split(` `)[0])} 👋</h1>
        <p class="muted">${W(Wa[e.role]||`Tu cuenta está conectada.`)}</p>
      </div>
      <div class="identity">
        <span class="avatar">${W(n.slice(0,1).toUpperCase())}</span>
        <div>
          <strong>${W(n)}</strong>
          <small>${W(t)} · ${W(r)}</small>
        </div>
      </div>
    </section>
  `}function us(e){let t=e.overview?.scores||{},n=Array.isArray(t.students)?t.students:[];return`
    ${ls()}

    <div class="section-title">
      <div>
        <span class="card-label">Panel de control</span>
        <h2>¿Cómo va el grupo?</h2>
      </div>
      <span class="pill">${W(e.kind===`admin`?`Vista global`:`Tu grupo`)}</span>
    </div>

    ${as(e.overview)}
    ${os(e.overview)}

    <div class="dash-grid">
      <article class="card wide">
        <div class="card-heading">
          <div>
            <span class="card-label">Score del grupo</span>
            <h2>${t.group??0} / 100</h2>
          </div>
        </div>
        <p class="muted">Promedio del grupo: 50 % avance de unidades + 50 % precisión en ejercicios.</p>
        ${n.length?`
          <div class="feed-list">
            ${n.map(e=>`
              <div class="feed-item">
                <span class="feed-emoji">${e.score>=80?`🏆`:e.score>=50?`📈`:`🌱`}</span>
                <div>
                  <strong>${W(e.name)}</strong>
                  <div><small>${W(e.code)} · ⚡ ${e.xp} XP · 📚 ${e.units_done}/${e.units_total} unidades · ${e.accuracy==null?`sin precisión`:`🎯 ${Math.round(e.accuracy)}%`} · faltas: ${e.absences}</small></div>
                </div>
                <span class="score-num">${e.score}</span>
              </div>
            `).join(``)}
          </div>
        `:`<p class="empty-state">Aún no hay alumnos en el grupo.</p>`}
      </article>

      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">En vivo</span><h2>Actividad reciente</h2></div>
        </div>
        ${is(e.overview?.recent)}
      </article>
    </div>
  `}function ds(e){return e>=80?`high`:e>=50?`mid`:`low`}function fs(e,t){let n=[];for(let r of e.board||[]){let e=0,i=0,a=0,o=0;for(let n of r.units||[]){i+=1;let r=(n.students||[]).find(e=>e.code===t||e.id===t);r&&(r.status===`completed`||r.status===`mastered`)&&(e+=1),r&&r.accuracy!=null&&(a+=Number(r.accuracy),o+=1)}i>0&&n.push({subject:r.name,color:r.color,done:e,total:i,accuracy:o?Math.round(a/o):null})}return n}function ps(e,t){for(let n of e.board||[])for(let e of n.units||[]){let r=(e.students||[]).find(e=>e.code===t||e.id===t);if(!r||r.status===`not_started`)return`${n.name} · ${e.title}`}return null}function ms(e){let t=e.students||[],n=new Map((e.overview?.scores?.students||[]).map(e=>[e.code,e]));return t.length?`
    <div class="section-title">
      <div>
        <span class="card-label">Alumnos</span>
        <h2>${t.length} ${t.length===1?`alumna inscrita`:`alumnos inscritos`}</h2>
      </div>
    </div>

    <div class="student-cards">
      ${t.map(e=>{let t=n.get(e.student_code)||{},r=t.score??0;return`
          <article class="student-card">
            <div class="student-card-head">
              <div class="avatar-big">${W((e.full_name||`A`).slice(0,1).toUpperCase())}</div>
              <span class="score-ring ${ds(r)}" title="Score general">${r}</span>
            </div>
            <div>
              <strong>${W(e.full_name)}</strong>
              <div class="muted"><small>${W(e.student_code)} · ${W(e.group_name||`Sin grupo`)}</small></div>
            </div>
            <div class="student-mini-stats">
              <span class="pill pill-pink">⚡ ${t.xp??0} XP</span>
              <span class="pill pill-green">📚 ${t.units_done??0}/${t.units_total??`—`}</span>
              ${t.accuracy==null?``:`<span class="pill pill-blue">🎯 ${Math.round(t.accuracy)}%</span>`}
              <span class="pill ${(t.absences??0)>0?`pill-red`:``}">Faltas: ${t.absences??0}</span>
            </div>
            <button class="btn ghost" data-ficha-toggle="${W(e.id)}">Ver ficha completa</button>
          </article>
        `}).join(``)}
    </div>

    ${hs(e)}
  `:`
      <div class="section-title"><div><span class="card-label">Alumnos</span><h2>Grupo</h2></div></div>
      <article class="card wide"><p class="empty-state">Todavía no hay alumnos. Da de alta al primero aquí abajo.</p></article>
      ${hs(e)}
    `}function hs(e){let t=e.groups||[],n=e.kind===`admin`;return`
    <article class="card wide">
      <div class="card-heading">
        <div><span class="card-label">Alta</span><h2>Nuevo alumno</h2></div>
      </div>
      <form class="form" ${n?`id="admin-create-student-form"`:``} ${n?``:`data-create-student-group="${W(t[0]?.id||``)}"`}>
        ${n?`
          <label class="field">
            <span>Grupo</span>
            <select name="group_id" data-admin-groups required>
              <option value="">Selecciona un grupo…</option>
              ${t.map(e=>`
                <option value="${W(e.id)}">${W(e.name)}${e.teacher_name?` · ${W(e.teacher_name)}`:``}</option>
              `).join(``)}
            </select>
          </label>
        `:``}
        <label class="field">
          <span>Nombre completo</span>
          <input name="full_name" autocomplete="off" placeholder="Nombre y apellidos" required>
        </label>
        <label class="field">
          <span>Usuario (opcional — si lo dejas vacío, se genera del nombre)</span>
          <input name="username" autocomplete="off" placeholder="ej. maria.lopez">
        </label>
        <label class="field">
          <span>Contraseña temporal (mín. 12, con mayúscula, minúscula y número)</span>
          <input name="password" type="text" autocomplete="off" minlength="12" required>
        </label>
        <label class="field">
          <span>Matrícula (opcional)</span>
          <input name="student_code" autocomplete="off" placeholder="ECO-2027-001">
        </label>
        <div class="row">
          <button class="btn primary" type="submit">Dar de alta</button>
        </div>
        <div class="create-student-result" data-create-result="${n?`admin`:`teacher`}"></div>
      </form>

      <details class="admin-details" ${H.studentInvitation?`open`:``}>
        <summary>Invitar alumno (elige su propia contraseña)</summary>
        <p class="hint">Crea la cuenta y genera un enlace de un solo uso para que el alumno establezca su contraseña. Entrégalo por un canal seguro: vence en 72 h y no se puede reutilizar.</p>
        <form class="form" data-invite-student-form data-invite-group-default="${W(t[0]?.id||``)}">
          ${n?`
            <label class="field">
              <span>Grupo</span>
              <select name="group_id" data-invite-groups required>
                <option value="">Selecciona un grupo…</option>
                ${t.map(e=>`
                  <option value="${W(e.id)}">${W(e.name)}${e.teacher_name?` · ${W(e.teacher_name)}`:``}</option>
                `).join(``)}
              </select>
            </label>
          `:``}
          <label class="field">
            <span>Nombre completo</span>
            <input name="full_name" autocomplete="off" placeholder="Nombre y apellidos" required>
          </label>
          <label class="field">
            <span>Usuario (opcional — si lo dejas vacío, se genera del nombre)</span>
            <input name="username" autocomplete="off" placeholder="ej. maria.lopez">
          </label>
          <label class="field">
            <span>Matrícula (opcional)</span>
            <input name="student_code" autocomplete="off" placeholder="ECO-2027-001">
          </label>
          <div class="row">
            <button class="btn primary" type="submit">Generar invitación</button>
          </div>
          <div class="create-student-result" data-invite-student-result></div>
        </form>
      </details>

      ${gs(H.studentInvitation)}
    </article>
  `}function gs(e){return e?`
    <div class="answer-box correct" data-student-invitation>
      <strong>Invitación para ${W(e.fullName)}</strong>
      <p>Comparte este enlace con el alumno o su tutor. Vence en 72 h y solo funciona una vez.</p>
      <label class="field">
        <span>Enlace de invitación</span>
        <input readonly value="${W(e.redeemUrl)}" data-invitation-url>
      </label>
      <div class="row">
        <button class="btn ghost" type="button" data-copy-invitation>Copiar enlace</button>
        <button class="btn ghost" type="button" data-dismiss-invitation>Ocultar</button>
      </div>
      <p><small>Usuario: ${W(e.username)} · Matrícula: ${W(e.studentCode)} · Vence: ${W(e.expiresAtLabel)}</small></p>
    </div>
  `:``}function _s(e,t){let n=(e.publishedUnits||[]).find(e=>e.id===t);return n?.versions?.length?n.versions[0].id:``}function vs(e){let t=e.board||[],n=e.groups||[],r=n.some(e=>e.id===H.subjectsGroupId)?H.subjectsGroupId:n[0]?.id||null,i=e.students||[],a=new Map;for(let t of e.assignments||[])t.group_id===r&&(a.has(t.unit_id)||a.set(t.unit_id,t));let o=e.terms||[];return t.length?`
    <div class="section-title">
      <div>
        <span class="card-label">Materias</span>
        <h2>Unidades, exámenes y calificaciones</h2>
      </div>
      <div class="row">
        ${n.length>1?`
          <label class="field inline-field">
            <span>Grupo</span>
            <select data-subjects-group>
              ${n.map(e=>`<option value="${W(e.id)}" ${e.id===r?`selected`:``}>${W(e.name)}</option>`).join(``)}
            </select>
          </label>
        `:``}
        <span class="pill">${t.length} materias</span>
      </div>
    </div>

    ${t.map(t=>{let n=[];for(let e of t.units||[]){let t=a.get(e.id);t&&n.push(t)}let s=H.collapsedSubjects.has(t.id);return`
        <article class="board-subject ${s?`collapsed`:``}" style="border-left: 5px solid ${W(t.color||`#5b8cff`)}">
          <div class="board-head">
            <button class="board-toggle" data-subject-toggle="${W(t.id)}" aria-expanded="${s?`false`:`true`}" title="${s?`Mostrar`:`Ocultar`} ${W(t.name)}">
              <span class="chev" aria-hidden="true">▾</span>
              <h3 style="margin:0">${W(t.name)}</h3>
            </button>
            <span class="pill">${(t.units||[]).length} unidades</span>
            <span class="pill">${(t.assessments||[]).length} evaluaciones</span>
          </div>

          <div class="board-body" data-subject-body="${W(t.id)}">
          <span class="card-label">Unidades (orden del curso)</span>
          ${(t.units||[]).map(t=>{let n=a.get(t.id),o=t.students||[],s=i.filter(e=>e.group_id===r),c=(n?.overrides||[]).filter(e=>e.status===`closed`).length,l=Math.max(0,s.length-c),u=_s(e,t.id);return`
              <div class="board-unit">
                <span class="pill pill-blue">U${String(t.num).padStart(2,`0`)}</span>
                <div>
                  <strong>${W(t.title)}</strong>
                  <div class="muted"><small>${t.estimated?`${t.estimated} min`:``}</small></div>
                </div>
                <div class="row">
                  ${n&&n.status===`active`?`<span class="pill success">Activa</span>
                       <span class="pill">${l}/${s.length} alumnos</span>
                       <button class="btn-mini" data-manage-assignment="${W(n.id)}" data-unit-group="${W(r)}">Alumnos</button>
                       <button class="btn-mini danger" data-close-assignment="${W(n.id)}">Cerrar</button>`:n&&n.status===`closed`?`<span class="pill pill-red">Cerrada</span>
                         <button class="btn-mini" data-reopen-assignment="${W(n.id)}">Reabrir</button>`:r?`<button class="btn-mini primary" data-activate-unit="${W(t.id)}:${W(u)}" data-unit-group="${W(r)}">Activar</button>`:`<span class="pill">Sin activar</span>`}
                </div>
                <div class="unit-students">
                  ${o.length?o.map(e=>`
                    <span class="student-chip ${e.status===`completed`||e.status===`mastered`?`done`:e.status===`in_progress`?`progress`:`todo`}">
                      ${W(e.name||e.code)} ${e.status===`completed`||e.status===`mastered`?`✓`:e.status===`in_progress`?`…`:`·`}${e.accuracy==null?``:` ${Math.round(e.accuracy)}%`}
                    </span>
                  `).join(``):`<span class="muted"><small>Sin avance registrado</small></span>`}
                </div>
              </div>
            `}).join(``)}

          <span class="card-label">Exámenes y tareas</span>
          ${(t.assessments||[]).map(e=>`
            <div class="assessment-box" data-assessment-box="${W(e.id)}">
              <div class="section-title">
                <div>
                  <strong>${W(e.title)}</strong>
                  <div class="muted"><small>${W(Qa[e.type]||e.type)} · sobre ${e.max} · ${W(e.date?X(String(e.date).slice(0,10)):`sin fecha`)}</small></div>
                </div>
                <button class="btn-mini" data-toggle-grades="${W(e.id)}">Calificar</button>
              </div>
              <div class="grades-editor hidden" data-grades-editor="${W(e.id)}">
                ${i.map(t=>{let n=(e.grades||[]).find(e=>e.student===t.student_code);return`
                    <div class="grade-row">
                      <span>${W(t.full_name)}</span>
                      <input type="number" step="0.1" min="0" max="${W(e.max)}" value="${n?W(n.score??``):``}" data-grade-student="${W(t.id)}" placeholder="—">
                      <button class="btn-mini primary" data-save-grade="${W(e.id)}" data-student="${W(t.id)}">Guardar</button>
                    </div>
                  `}).join(``)}
              </div>
            </div>
          `).join(``)||`<p class="empty-state">Sin exámenes ni tareas en esta materia.</p>`}

          ${r?`
            <details class="admin-details">
              <summary>Nueva evaluación (examen, tarea, proyecto…)</summary>
              <form class="form" data-create-assessment="${W(t.id)}" data-group="${W(r)}">
                <label class="field"><span>Nombre</span><input name="name" required placeholder="Examen parcial 1"></label>
                <label class="field">
                  <span>Tipo</span>
                  <select name="type">
                    ${Object.entries(Qa).map(([e,t])=>`<option value="${e}">${W(t)}</option>`).join(``)}
                  </select>
                </label>
                <div class="row">
                  <label class="field"><span>Puntaje máximo</span><input name="max_score" type="number" step="0.1" value="10" required></label>
                  <label class="field"><span>Fecha</span><input name="assessment_date" type="date"></label>
                  <label class="field"><span>Trimestre</span>
                    <select name="term_id">${o.map(e=>`<option value="${W(e.id)}">${W(e.name)}</option>`).join(``)}</select>
                  </label>
                </div>
                <button class="btn primary" type="submit">Crear evaluación</button>
              </form>
            </details>
          `:``}
          </div>
        </article>
      `}).join(``)}
  `:`
      <div class="section-title"><div><span class="card-label">Materias</span><h2>Contenido</h2></div></div>
      <article class="card wide"><p class="empty-state">Aún no hay materias activas con contenido.</p></article>
    `}function ys(e){let t=e.groups||[];return t.length?`
    <div class="section-title">
      <div>
        <span class="card-label">Asistencia</span>
        <h2>Tomar lista y justificar</h2>
      </div>
      <span class="pill">Las faltas no afectan calificaciones; solo son informativas</span>
    </div>
    ${t.map(e=>`
      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">Grupo</span><h2>${W(e.name)}</h2></div>
        </div>
        <div class="row">
          <button class="btn primary" data-attendance-open="${W(e.id)}">Tomar asistencia</button>
          <button class="btn ghost" data-history-open="${W(e.id)}">Ver historial</button>
        </div>
        <div class="attendance-area hidden" data-attendance-area="${W(e.id)}"></div>
        <div class="attendance-history hidden" data-history-box="${W(e.id)}"></div>
      </article>
    `).join(``)}
  `:`
      <div class="section-title"><div><span class="card-label">Asistencia</span><h2>Grupos</h2></div></div>
      <article class="card wide"><p class="empty-state">No tienes grupos asignados.</p></article>
    `}var bs={semanal:`Semanal`,quincenal:`Quincenal`,mensual:`Mensual`,contado:`Contado`,beca:`Beca`,otro:`Otro`},xs={efectivo:`Efectivo`,transferencia:`Transferencia`,tarjeta:`Tarjeta`,otro:`Otro`};function Ss(e,t){return(t||[]).filter(t=>t.student_id===e)}function Cs(e,t){return Ss(e,t).reduce((e,t)=>e+Number(t.amount||0),0)}function ws(e,t){return Ss(e,t).slice().sort((e,t)=>String(t.paid_at).localeCompare(String(e.paid_at)))[0]||null}function Q(e){return Number(e||0).toLocaleString(`es-MX`,{style:`currency`,currency:`MXN`})}function Ts(e){return e.toISOString().slice(0,10)}function Es(e,t){if(![`semanal`,`quincenal`,`mensual`].includes(e))return null;let n=new Date(`${t||Ts(new Date)}T00:00:00Z`);if(Number.isNaN(n.getTime()))return null;let r=n.getUTCFullYear(),i=n.getUTCMonth();if(e===`mensual`)return{start:Ts(new Date(Date.UTC(r,i,1))),end:Ts(new Date(Date.UTC(r,i+1,0)))};if(e===`quincenal`)return n.getUTCDate()<=15?{start:Ts(new Date(Date.UTC(r,i,1))),end:Ts(new Date(Date.UTC(r,i,15)))}:{start:Ts(new Date(Date.UTC(r,i,16))),end:Ts(new Date(Date.UTC(r,i+1,0)))};let a=(n.getUTCDay()+6)%7,o=new Date(Date.UTC(r,i,n.getUTCDate()-a)),s=new Date(Date.UTC(o.getUTCFullYear(),o.getUTCMonth(),o.getUTCDate()+6));return{start:Ts(o),end:Ts(s)}}function Ds(e){return e===`voided`?`Anulado`:e===`partial`?`Parcial`:`Pagado`}function Os(e){return{"al corriente":`Al corriente`,parcial:`Pago parcial`,pendiente:`Pendiente`,vencido:`Vencido`,beca:`Beca`,manual:`Plan manual`,"sin cuota":`Sin cuota`}[e]||`Pendiente`}function ks(e){let t=e.students||[],n=e.billingByStudent||new Map,r=e.billingStatusByStudent||new Map,i=e.payments||[],a=Math.max(1,Math.ceil(i.length/Ya)),o=Math.min(Math.max(1,H.paymentsPage),a),s=i.slice((o-1)*Ya,o*Ya),c=new Date,l=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,`0`)}`,u=i.filter(e=>String(e.paid_at||``).slice(0,7)===l),d=u.reduce((e,t)=>e+Number(t.amount||0),0),f=i.reduce((e,t)=>e+Number(t.amount||0),0),p=t.filter(e=>n.has(e.id)).length;return`
    <div class="section-title">
      <div>
        <span class="card-label">Finanzas</span>
        <h2>Pagos y planes por alumno</h2>
      </div>
      <span class="pill">${t.length} ${t.length===1?`alumno`:`alumnos`}</span>
    </div>

    <div class="pay-summary">
      <article class="card pay-stat pay-stat-violet">
        <span class="pay-stat-icon" aria-hidden="true">📅</span>
        <div>
          <span class="card-label">Este mes (${c.toLocaleDateString(`es-MX`,{month:`short`})})</span>
          <h2>${Q(d)}</h2>
          <p class="muted">${u.length} ${u.length===1?`pago`:`pagos`} registrados</p>
        </div>
      </article>
      <article class="card pay-stat pay-stat-green">
        <span class="pay-stat-icon" aria-hidden="true">💰</span>
        <div>
          <span class="card-label">Ingresos totales</span>
          <h2>${Q(f)}</h2>
          <p class="muted">Todo lo registrado en la plataforma</p>
        </div>
      </article>
      <article class="card pay-stat pay-stat-blue">
        <span class="pay-stat-icon" aria-hidden="true">🗂️</span>
        <div>
          <span class="card-label">Planes asignados</span>
          <h2>${p}/${t.length}</h2>
          <p class="muted">${[...new Set([...n.values()].map(e=>e.plan))].length} ${[...new Set([...n.values()].map(e=>e.plan))].length===1?`tipo de plan`:`tipos de plan`}</p>
        </div>
      </article>
    </div>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Alumnos</span>
          <h2>Estado de cuentas</h2>
        </div>
      </div>
      ${t.length?`
        <div class="pay-board">
          ${t.map(e=>{let t=n.get(e.id)||{},a=r.get(e.id)||{},o=t.plan||`mensual`,s=Cs(e.id,i),c=ws(e.id,i);return`
              <article class="pay-card">
                <div class="pay-card-head">
                  <span class="pay-avatar" aria-hidden="true">${W((e.full_name||`A`).trim().slice(0,1).toUpperCase())}</span>
                  <div class="pay-who">
                    <strong>${W(e.full_name)}</strong>
                    <small>${W(e.student_code||``)}${e.group_name?` · ${W(e.group_name)}`:``}</small>
                  </div>
                  <span class="pill ${n.has(e.id)?``:`pill-amber`}">${n.has(e.id)?W(bs[o]||o):`Sin plan`}</span>
                </div>
                <div class="pay-card-body">
                  <div class="pay-metric">
                    <span class="card-label">Cuota</span>
                    <strong>${t.fee?Q(t.fee):`—`}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Pagado</span>
                    <strong class="${s>0?`pay-good`:``}">${Q(s)}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Estado</span>
                    <strong class="${a.status===`al corriente`||a.status===`beca`?`pay-good`:`pay-last`}">${W(Os(a.status))}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Saldo</span>
                    <strong class="${Number(a.balance||0)>0?`pay-last`:``}">${a.balance==null?`—`:Q(a.balance)}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Último pago</span>
                    <strong class="pay-last">${c?W(X(String(c.paid_at).slice(0,10))):`—`}</strong>
                  </div>
                </div>
                <div class="pay-card-actions">
                  <button class="btn primary" data-open-pay-dialog="${W(e.id)}" data-pay-mode="payment">💵 Registrar pago</button>
                  <button class="btn ghost" data-open-pay-dialog="${W(e.id)}" data-pay-mode="plan">⚙️ Plan</button>
                </div>
              </article>
            `}).join(``)}
        </div>
      `:`<p class="empty-state">Todavía no hay alumnos en tus grupos.</p>`}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Historial</span>
          <h2>Últimos pagos registrados</h2>
        </div>
      </div>
      ${i.length?`
        ${dc({total:i.length,page:o,target:`payments`})}
        <ul class="data-list pay-list">
          ${s.map(e=>`
              <li>
                <div>
                  <strong>${W(t.find(t=>t.id===e.student_id)?.full_name||`Alumno`)}${e.receipt_no?` · ${W(e.receipt_no)}`:``}</strong>
                  <small>${W(X(String(e.paid_at).slice(0,10)))} · ${W(xs[e.method]||e.method)}${e.period_start?` · ${W(X(e.period_start))}–${W(X(e.period_end))}`:e.period?` · ${W(e.period)}`:``}${e.status===`voided`&&e.void_reason?` · Motivo: ${W(e.void_reason)}`:``}</small>
                </div>
                <div class="pay-history-actions">
                  <span class="pill ${e.status===`voided`?`pill-amber`:`success`}">${Q(e.amount)} · ${W(Ds(e.status))}</span>
                  <button class="btn ghost" data-receipt-payment="${W(e.id)}" aria-label="Descargar recibo ${W(e.receipt_no||e.id)}">Recibo</button>
                  ${e.status===`voided`?``:`<button class="btn ghost" data-void-payment="${W(e.id)}">Anular</button>`}
                </div>
              </li>
            `).join(``)}
        </ul>
      `:`<p class="empty-state">Aún no hay pagos registrados. Usa "Registrar pago" en cada alumno.</p>`}
    </article>
  `}function As(){let e=H.payDialog;if(!e)return``;let t=H.dashboard,n=(t?.students||[]).find(t=>t.id===e.studentId),r=(t?.billingByStudent||new Map).get(e.studentId)||{},i=new Date().toISOString().slice(0,10),a=(n?.full_name||`A`).trim().slice(0,1).toUpperCase(),o=e.mode===`plan`;return`
    <div class="unit-assign-overlay" data-pay-overlay>
      <section class="unit-assign-dialog pay-dialog" role="dialog" aria-modal="true" aria-labelledby="pay-title">
        <button type="button" class="ficha-close" data-pay-close aria-label="Cerrar">✕</button>

        <header class="pay-dialog-head">
          <span class="pay-avatar pay-avatar-lg" aria-hidden="true">${W(a)}</span>
          <div class="pay-who">
            <span class="card-label">${o?`Plan de pago`:`Registrar pago`}</span>
            <h2 id="pay-title">${W(n?.full_name||`Alumno`)}</h2>
            <p class="muted">${W(n?.student_code||``)}${n?.group_name?` · ${W(n.group_name)}`:``}${!o&&r.plan?` · Plan ${W(bs[r.plan]||r.plan)}`:``}</p>
          </div>
        </header>

        <form class="form pay-form" data-pay-form>
          ${o?`
            <div class="pay-plan-grid">
              ${Object.entries(bs).map(([e,t])=>`
                <button type="button" class="pay-plan-option ${(r.plan||`mensual`)===e?`selected`:``}" data-pay-plan="${e}">
                  ${W(t)}
                </button>
              `).join(``)}
              <input type="hidden" name="plan" value="${W(r.plan||`mensual`)}">
            </div>
            <label class="field">
              <span>Cuota por periodo (pesos)</span>
              <input name="fee" type="number" min="0" step="0.01" value="${r.fee??``}" placeholder="ej. 250">
            </label>
            <label class="field">
              <span>Notas (opcional)</span>
              <textarea name="notes" placeholder="ej. beca del 20%, incluye material…">${W(r.notes||``)}</textarea>
            </label>
          `:`
            <label class="field">
              <span>Monto (pesos)</span>
              <div class="pay-amount-wrap">
                <span class="pay-currency">$</span>
                <input name="amount" type="number" min="1" step="0.01" required placeholder="0.00">
              </div>
            </label>
            <label class="field">
              <span>Fecha del pago</span>
              <input name="paid_at" type="date" required value="${i}">
            </label>
            <div class="field">
              <span>Método</span>
              <div class="pay-method-grid">
                ${Object.entries(xs).map(([e,t],n)=>`
                  <button type="button" class="pay-method-option ${n===0?`selected`:``}" data-pay-method="${e}">
                    ${W(t)}
                  </button>
                `).join(``)}
                <input type="hidden" name="method" value="efectivo">
              </div>
            </div>
            <label class="field">
              <span>Concepto (opcional)</span>
              <input name="period" placeholder="ej. semana del 2 nov, noviembre, inscripción">
            </label>
            <label class="field">
              <span>Notas (opcional)</span>
              <textarea name="notes" placeholder="ej. pagó el tutor en efectivo"></textarea>
            </label>
          `}

          <div class="pay-error" data-pay-error hidden></div>

          <footer class="unit-assign-foot">
            <button type="button" class="btn ghost" data-pay-close>Cancelar</button>
            <button type="submit" class="btn primary">${o?`Guardar plan`:`Registrar pago`}</button>
          </footer>
        </form>
      </section>
    </div>
  `}function js(e,t){H.payDialog={studentId:e,mode:t,escHandler:null},Ms()}function Ms(){document.querySelectorAll(`[data-pay-overlay]`).forEach(e=>e.remove()),H.payDialog?.escHandler&&(H.payDialog.escHandler(),H.payDialog.escHandler=null);let e=As();if(!e){document.body.classList.remove(`unit-assign-open`);return}document.body.insertAdjacentHTML(`beforeend`,e),document.body.classList.add(`unit-assign-open`);let t=document.querySelector(`[data-pay-overlay]`),n=()=>Ns();t.querySelectorAll(`[data-pay-close]`).forEach(e=>{e.addEventListener(`click`,n)}),t.addEventListener(`click`,e=>{e.target===t&&n()}),H.payDialog.escHandler=po(t,n);let r=t.querySelector(`[data-pay-form]`);r&&r.addEventListener(`submit`,e=>Is(e,r)),t.querySelectorAll(`[data-pay-method]`).forEach(e=>{e.addEventListener(`click`,()=>{t.querySelectorAll(`[data-pay-method]`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`);let n=r?.querySelector(`input[name="method"]`);n&&(n.value=e.dataset.payMethod)})}),t.querySelectorAll(`[data-pay-plan]`).forEach(e=>{e.addEventListener(`click`,()=>{t.querySelectorAll(`[data-pay-plan]`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`);let n=r?.querySelector(`input[name="plan"]`);n&&(n.value=e.dataset.payPlan)})}),requestAnimationFrame(()=>{t.querySelector(`[data-pay-close]`)?.focus()})}function Ns(){H.payDialog?.escHandler&&H.payDialog.escHandler(),H.payDialog=null,document.querySelectorAll(`[data-pay-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function Ps(e){let t=e.dataset.voidPayment;if(!t||e.disabled)return;let n=window.prompt(`Motivo de la anulación (mínimo 3 caracteres):`,``);if(n===null)return;let r=n.trim();if(r.length<3){G(`Escribe un motivo de al menos 3 caracteres para anular el pago.`);return}e.disabled=!0,e.textContent=`Anulando…`;let{error:i}=await B.rpc(`app_void_payment`,{p_payment_id:t,p_reason:r});i?(G(i.message||`No se pudo anular el pago.`),e.disabled=!1,e.textContent=`Anular`):(K(`Pago anulado. El historial conserva el registro y el motivo.`),await J(H.profile))}function Fs(e){let t=(H.dashboard?.payments||[]).find(t=>t.id===e);if(!t){G(`No se encontró el pago para generar el recibo.`);return}let n=(H.dashboard?.students||[]).find(e=>e.id===t.student_id),r=(H.dashboard?.billingByStudent||new Map).get(t.student_id)||{};Ha({id:t.id,receipt_no:t.receipt_no,paid_at:X(String(t.paid_at||``).slice(0,10)),amount:Q(t.amount),method:xs[t.method]||t.method||`—`,period_start:t.period_start?X(t.period_start):``,period_end:t.period_end?X(t.period_end):``,period:t.period,status:t.status,student_name:n?.full_name||`Alumno`,student_code:n?.student_code||``,group_name:n?.group_name||``,plan:bs[r.plan]||r.plan||``,void_reason:t.void_reason||``}),K(t.status===`voided`?`Recibo descargado. El documento marca el pago como anulado.`:`Recibo descargado.`)}async function Is(e,t){e.preventDefault();let n=H.payDialog;if(!n)return;let r=new FormData(t),i=t.querySelector(`button[type="submit"]`),a=t.querySelector(`[data-pay-error]`);i&&(i.disabled=!0);try{if(n.mode===`plan`){let e=String(r.get(`fee`)||``).trim(),{error:t}=await B.from(`student_billing`).upsert({student_id:n.studentId,plan:String(r.get(`plan`)||`mensual`),fee:e?Number(e):null,notes:String(r.get(`notes`)||``).trim()||null,updated_by:H.profile?.id??null,updated_at:new Date().toISOString()},{onConflict:`student_id`});if(t)throw t;Ns(),K(`Plan de pago guardado.`)}else{let e=Number(r.get(`amount`));if(!e||e<=0)throw Error(`Escribe un monto válido.`);let t=String(r.get(`paid_at`)||Ts(new Date)),i=Es(((H.dashboard?.billingByStudent||new Map).get(n.studentId)||{}).plan||`mensual`,t),{error:a}=await B.from(`payments`).insert({student_id:n.studentId,amount:e,paid_at:t,method:String(r.get(`method`)||`efectivo`),period:String(r.get(`period`)||``).trim()||null,notes:String(r.get(`notes`)||``).trim()||null,period_start:i?.start||null,period_end:i?.end||null,idempotency_key:crypto.randomUUID(),recorded_by:H.profile?.id??null});if(a)throw a.code===`23505`||/duplicad|idéntico/i.test(a.message||``)?Error(`Ya existe un pago idéntico para ese periodo. Revisa el historial antes de registrarlo otra vez.`):a;Ns(),K(`Pago registrado con folio.`)}await J(H.profile)}catch(e){i&&(i.disabled=!1),a&&(a.hidden=!1,a.textContent=e?.message||`No se pudo guardar.`)}}function Ls(e){let t=e.tasks||[],n=e.groups||[],r=e.board||[],i=e.publishedUnits||e.units||[],a={pending:`Pendiente`,submitted:`Entregada`,late:`Tarde`},o=e=>{if(!e.due_at)return`Sin fecha`;let t=new Date(e.due_at),n=t.getTime()<Date.now()&&(e.submissions||[]).some(e=>e.status===`pending`),r=t.toLocaleDateString(`es-MX`,{day:`2-digit`,month:`short`});return n?`Venció ${r}`:`Entrega ${r}`};return`
    <div class="section-title">
      <div>
        <span class="card-label">Tareas</span>
        <h2>Asignar, revisar y calificar</h2>
      </div>
      <span class="pill">${t.length} ${t.length===1?`tarea activa`:`tareas activas`}</span>
    </div>

    <article class="card wide">
      <div class="card-heading">
        <div><span class="card-label">Nueva tarea</span><h2>Asignar al grupo</h2></div>
      </div>
      <form class="form task-form" id="create-task-form">
        <label class="field"><span>Título</span><input name="title" required placeholder="Investigación sobre figuras literarias"></label>
        <div class="task-form-grid">
          <label class="field"><span>Grupo</span>
            <select name="group_id" required>
              ${n.map(e=>`<option value="${W(e.id)}">${W(e.name)}</option>`).join(``)}
            </select>
          </label>
          <label class="field"><span>Materia</span>
            <select name="subject_id" required>
              ${r.map(e=>`<option value="${W(e.id)}">${W(e.name)}</option>`).join(``)}
            </select>
          </label>
          <label class="field"><span>Tipo</span>
            <select name="task_type">
              ${Object.entries(Qa).map(([e,t])=>`<option value="${e}" ${e===`project`?`selected`:``}>${W(t)}</option>`).join(``)}
            </select>
          </label>
          <label class="field"><span>Unidad (opcional)</span>
            <select name="unit_id">
              <option value="">Sin unidad</option>
              ${i.map(e=>`<option value="${W(e.id)}">${W(e.subject_name||e.subject_id||``)} · ${W(e.title)}</option>`).join(``)}
            </select>
          </label>
          <label class="field"><span>Fecha de entrega</span><input name="due_at" type="datetime-local"></label>
          <label class="field"><span>Puntaje máximo</span><input name="max_score" type="number" min="0.1" step="0.1" value="10" required></label>
        </div>
        <label class="field"><span>Instrucciones</span><textarea name="instructions" rows="3" placeholder="Qué debe entregar el alumno, formato y criterios."></textarea></label>
        <button class="btn primary" type="submit">Crear tarea</button>
      </form>
    </article>

    ${t.length?t.map(e=>{let t=e.submissions||[],n=t.filter(e=>e.status===`submitted`||e.status===`late`).length;return`
        <article class="task-card" data-task-card="${W(e.id)}">
          <div class="task-head">
            <div>
              <span class="card-label" style="color:${W(e.subject_color||`var(--brand)`)}">${W(e.subject_name||`Materia`)}</span>
              <h3>${W(e.title)}</h3>
              <div class="task-meta">
                <span class="pill pill-blue">${W(e.group_name||`Grupo`)}</span>
                <span class="pill ${e.due_at&&new Date(e.due_at)<new Date?`pill-red`:`pill-green`}">${W(o(e))}</span>
                <span class="pill">${W(e.max_score)} pts</span>
                <span class="pill" data-task-count="${W(e.id)}">${n}/${t.length} entregadas</span>
                ${e.unit_title?`<span class="pill">${W(e.unit_title)}</span>`:``}
              </div>
            </div>
          </div>
          ${e.instructions?`<p class="muted task-instructions">${W(e.instructions)}</p>`:``}
          <div class="task-students">
            ${t.length?t.map(t=>`
              <div class="task-student" data-task-row data-task-id="${W(e.id)}" data-student-id="${W(t.student_id)}" data-status="${W(t.status||`pending`)}">
                <div class="attendance-who">
                  <span class="avatar small">${W((t.name||`?`).slice(0,1).toUpperCase())}</span>
                  <div>
                    <strong>${W(t.name)}</strong>
                    <small>${W(t.code)}</small>
                  </div>
                </div>
                <div class="status-seg" role="group" aria-label="Entrega de ${W(t.name)}">
                  ${Object.entries(a).map(([e,n])=>`
                    <button class="status-btn ${(t.status||`pending`)===e?`active`:``}" type="button" data-task-status="${e}">${W(n)}</button>
                  `).join(``)}
                </div>
                <input class="task-score" type="number" min="0" max="${W(e.max_score)}" step="0.1" value="${t.score??``}" placeholder="Pts" data-task-score aria-label="Puntaje de ${W(t.name)}">
                <button class="btn-mini primary" type="button" data-save-task-submission>Guardar</button>
              </div>
            `).join(``):`<p class="empty-state">Este grupo no tiene alumnos activos.</p>`}
          </div>
        </article>
      `}).join(``):`<article class="card wide"><p class="empty-state">Aún no hay tareas. Crea la primera arriba.</p></article>`}
  `}function Rs(e){let t=e.activity||[];return`
    <div class="section-title">
      <div>
        <span class="card-label">Actividad</span>
        <h2>Registro de actividades</h2>
      </div>
      <span class="pill">${t.length} eventos recientes</span>
    </div>
    <article class="card wide">
      <div class="activity-filters" data-activity-filters>
        ${[[`todo`,`Todo`],[`ejercicio`,`Ejercicios`],[`unidad`,`Unidades`],[`tarea`,`Tareas`],[`calificacion`,`Calificaciones`],[`observacion`,`Observaciones`]].map(([e,t],n)=>`
          <button class="filter-chip ${n===0?`active`:``}" type="button" data-activity-filter="${e}">${W(t)}</button>
        `).join(``)}
      </div>
      <div class="activity-feed" data-activity-feed>
        ${t.length?t.map(e=>`
          <div class="activity-item" data-activity-kind="${W(e.kind)}">
            <span class="activity-emoji" aria-hidden="true">${W(e.emoji||`•`)}</span>
            <div class="activity-body">
              <strong>${W(e.title||`Actividad`)}</strong>
              <span>${W(e.detail||``)}</span>
              <small>${W(e.name||``)}${e.student?` · ${W(e.student)}`:``} · ${W(Z(e.ts))}</small>
            </div>
          </div>
        `).join(``):`<p class="empty-state">Todavía no hay actividad registrada. En cuanto haya ejercicios, entregas o calificaciones aparecerán aquí.</p>`}
      </div>
    </article>
  `}function zs(e){let t=e.students||[];return`
    <div class="section-title">
      <div>
        <span class="card-label">Tutores</span>
        <h2>Invitaciones por correo y avisos a tutores</h2>
      </div>
    </div>
    <article class="card wide">
      <div class="card-heading"><div><span class="card-label">Alumnos</span><h2>Vínculos con tutores</h2></div></div>
      ${t.length?`
        <ul class="data-list invite-list">
          ${t.map(e=>`
            <li>
              <div>
                <strong>${W(e.full_name)}</strong>
                <small>${W(e.student_code)} · ${(e.guardians||[]).length} ${(e.guardians||[]).length===1?`tutor`:`tutores`} vinculado(s)</small>
              </div>
              <div class="row">
                <button class="btn ghost" data-invite-toggle="${W(e.id)}">Invitar tutor</button>
                <button class="btn ghost" data-advise-student="${W(e.id)}">Avisar tutor</button>
                <button class="btn ghost" data-reissue-invite="${W(e.id)}" data-student-name="${W(e.full_name)}">Enlace de acceso</button>
              </div>
              <form class="form invite-form hidden" data-invite-form="${W(e.id)}" data-student-code="${W(e.student_code)}">
                <label class="field"><span>Nombre del tutor</span><input name="full_name" required placeholder="Nombre completo"></label>
                <label class="field"><span>Teléfono (WhatsApp)</span><input name="phone" type="tel" placeholder="52 1 55 1234 5678"></label>
                <label class="field"><span>Parentesco (opcional)</span><input name="relationship" placeholder="madre, padre…"></label>
                <label class="field"><span>Correo (opcional — si no tiene, se genera uno interno)</span><input name="email" type="email"></label>
                <div class="row">
                  <button class="btn primary" type="submit">Crear invitación</button>
                  <button class="btn ghost" type="button" data-invite-cancel="${W(e.id)}">Cancelar</button>
                </div>
              </form>
              <div class="invite-result hidden" data-invite-result="${W(e.id)}"></div>
              <div class="advise-form hidden" data-advise-form="${W(e.id)}"></div>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">No hay alumnos. Da de alta primero.</p>`}
    </article>
  `}var Bs=[`var(--brand)`,`var(--brand-2)`,`#0ea5e9`,`#f59e0b`,`#10b981`,`#ef4444`,`#ec4899`,`#14b8a6`];function Vs(e){let t=0;for(let n of String(e||``))t=t*31+n.charCodeAt(0)|0;return Bs[Math.abs(t)%Bs.length]}function Hs(e){if(!e.student)return`
      <article class="card wide">
        <span class="card-label">Mi espacio</span>
        <h2>Sin expediente de alumno</h2>
        <p>Tu cuenta existe, pero aún no está vinculada a un grupo.</p>
      </article>
    `;let t=H.profile?.full_name||`Alumno`,n=t.split(` `)[0],r=t.trim().slice(0,1).toUpperCase(),i=e.profile||{},a=Number(!!i.personality?.completed_at)+Number(!!i.aptitude?.completed_at);return`
    <section class="student-hero">
      <div class="student-hero-copy">
        <span class="kicker">Hola, ${W(n)} 👋</span>
        <h1>Tu camino al bachillerato</h1>
        <p class="muted">${W(e.group?[e.group.level,e.group.schedule].filter(Boolean).join(` · `)||`Grupo sin horario`:`Tu grupo aún no está asignado.`)}</p>
        <div class="student-hero-chips">
          <span class="hero-chip">📚 ${Go(e.activeAssignments,`unidad activa`,`unidades activas`)}</span>
          <span class="hero-chip">🧭 ${a} de 2 tests completados</span>
          <span class="hero-chip">🎓 ${W(e.student.student_code)}</span>
        </div>
      </div>
      <div class="student-hero-actions">
        <span class="student-avatar" aria-hidden="true">${W(r)}</span>
        <a class="btn primary" href="./curso/">📚 Abrir curso completo</a>
      </div>
    </section>

    <div class="section-title">
      <div>
        <span class="card-label">Tus unidades</span>
        <h2>${e.units.length?`Sigue tu ruta de estudio`:`Aún no hay unidades`}</h2>
      </div>
      ${e.units.length?`<span class="pill">${e.units.length}</span>`:``}
    </div>

    ${e.units.length?`
      <div class="student-unit-grid">
        ${e.units.map(e=>{let t=e.progress?.status||`not_started`,n=Ga[t]||`Sin empezar`,r=e.progress?.best_accuracy==null?null:`${Math.round(e.progress.best_accuracy)}%`,i=e.progress?.attempts_count||0;return`
            <article class="student-unit-card" style="--accent:${Vs(e.unit?.subject_name)}">
              <div class="student-unit-top">
                <span class="student-unit-subject">${W(e.unit?.subject_name||`Materia`)}</span>
                <span class="pill ${t===`completed`||t===`mastered`?`success`:t===`in_progress`?`pill-blue`:``}">${W(n)}</span>
              </div>
              <h3>${W(e.unit?.title||`Unidad`)}</h3>
              <div class="student-unit-stats">
                ${r?`<span class="hero-chip">🎯 ${W(r)}</span>`:``}
                ${i>0?`<span class="hero-chip">🔄 ${i} ${i===1?`intento`:`intentos`}</span>`:``}
              </div>
              <button class="btn ghost" data-open-unit="${W(e.id)}">${t===`completed`||t===`mastered`?`Repasar →`:`Estudiar →`}</button>
            </article>
          `}).join(``)}
      </div>
    `:`<article class="card wide"><p class="empty-state">Tus unidades aparecerán aquí cuando el profesor las active. 🔒</p></article>`}

    ${Ws(e)}
  `}function Us(e,t){let n=t===`personality`?e?.personality:e?.aptitude;return n&&typeof n==`object`?n:null}function Ws(e){let t=e.profile||{},n=Us(t,`personality`),r=Us(t,`vocational`),i=!!n?.completed_at,a=!!r?.completed_at,o=Array.isArray(t.interests)?t.interests:[],s=Array.isArray(t.aptitudes)?t.aptitudes:[],c=(Array.isArray(t.career_suggestions)?t.career_suggestions:[]).slice(0,3).map(e=>typeof e==`string`?e:e?.name).filter(Boolean);return`
    <article class="card wide student-tests">
      <div class="card-heading">
        <div>
          <span class="card-label">Mi orientación</span>
          <h2>Conócete y descubre tu camino</h2>
        </div>
        <span class="pill">${i&&a?`2 de 2 completados`:`${Number(i)+Number(a)} de 2 completados`}</span>
      </div>
      <p class="muted">Responde con calma y honestidad. No hay respuestas correctas: tus resultados ayudan a tu profesor a acompañarte mejor.</p>

      <div class="test-grid">
        <div class="test-card ${i?`done`:``}">
          <span class="test-emoji" aria-hidden="true">🧠</span>
          <div class="test-copy">
            <strong>Test de personalidad</strong>
            <p>15 preguntas sobre tu forma de ser, aprender y convivir.</p>
            <span class="pill ${i?`success`:``}">${i?`Completado`:`Pendiente`}</span>
          </div>
          <button class="btn ${i?`ghost`:`primary`}" data-start-test="personality">${i?`Volver a hacerlo`:`Comenzar`}</button>
        </div>

        <div class="test-card ${a?`done`:``}">
          <span class="test-emoji" aria-hidden="true">🧭</span>
          <div class="test-copy">
            <strong>Test de orientación vocacional</strong>
            <p>Intereses, aptitudes y carreras que podrían encajar contigo.</p>
            <span class="pill ${a?`success`:``}">${a?`Completado`:`Pendiente`}</span>
          </div>
          <button class="btn ${a?`ghost`:`primary`}" data-start-test="vocational">${a?`Volver a hacerlo`:`Comenzar`}</button>
        </div>
      </div>

      ${o.length||s.length||c.length?`
        <div class="test-summary">
          ${c.length?`
            <div class="test-summary-block">
              <span class="card-label">Carreras que podrían interesarte</span>
              <div class="ficha-tags">
                ${c.map(e=>`<span class="ficha-tag">🎓 ${W(e)}</span>`).join(``)}
              </div>
            </div>
          `:``}
          ${o.length?`
            <div class="test-summary-block">
              <span class="card-label">Tus intereses</span>
              <div class="ficha-tags">
                ${o.slice(0,8).map(e=>`<span class="ficha-tag">${W(e)}</span>`).join(``)}
              </div>
            </div>
          `:``}
          ${s.length?`
            <div class="test-summary-block">
              <span class="card-label">Tus aptitudes</span>
              <div class="ficha-tags">
                ${s.slice(0,8).map(e=>`<span class="ficha-tag">${W(e)}</span>`).join(``)}
              </div>
            </div>
          `:``}
        </div>
      `:``}
    </article>
  `}function Gs(e){let t={},n={};for(let r of eo){let i=e[r.id];if(i==null)continue;let a=r.reverse?5-i:i+1;t[r.dim]=(t[r.dim]||0)+a,n[r.dim]=(n[r.dim]||0)+1}let r={};for(let e of Object.keys($a)){let i=n[e]||0,a=t[e]||0;r[e]=i?Math.max(0,Math.min(100,Math.round((a-i)/Math.max(1,i*4)*100))):0}return r}function Ks(e){let t=new Set,n={};for(let r of V){let i=Array.isArray(e[r.id])?e[r.id]:[];n[r.id]=i;for(let e of i){let n=r.options.find(t=>t.label===e);for(let e of n?.tags||[])t.add(e)}}let r=[...new Set([...e.series||[],...e.subjects||[],...e.activities||[]])],i=[...new Set(e.aptitudes||[])],a=[...new Set(e.workdays||[])],o=[...new Set(e.environment||[])],s=[...new Set(e.values||[])],c=[...new Set(e.future||[])],l={};for(let e of no)for(let t of e.tags)l[t]=(l[t]||0)+1;let u=no.map(e=>{let n=e.tags.filter(e=>t.has(e)),r=n.reduce((e,t)=>e+1/l[t],0);return{name:e.name,matches:n,weight:r}}).filter(e=>e.matches.length>0).sort((e,t)=>t.weight-e.weight||e.name.localeCompare(t.name)).slice(0,8),d=u[0]?.weight||1,f=u.map(e=>({name:e.name,score:Math.round(e.weight/d*100),matches:e.matches}));return{version:1,completed_at:new Date().toISOString(),interests:r,aptitudes:i,workdays:a,environment:o,values:s,future:c,tags:[...t],career_suggestions:f,career_choice:e.career_choice||null}}function qs(e){return Object.entries(e).sort((e,t)=>t[1]-e[1]).slice(0,2).map(([e])=>e)}function Js(e){return e.kind===`personality`?eo.length:V.length+1}function Ys(e){return e.kind===`personality`?eo[e.step]||null:V[e.step]||null}function Xs(e){if(e.kind===`personality`){let t=eo[e.step];if(!t)return``;let n=e.answers[t.id];return`
      <div class="test-scale">
        ${to.map((e,t)=>`
          <button type="button" class="test-option ${n===t?`selected`:``}" data-test-option="${t}">
            <span aria-hidden="true">${e.emoji}</span>
            <strong>${W(e.label)}</strong>
          </button>
        `).join(``)}
      </div>
    `}if(e.step>=V.length){let t=Ks(e.answers).career_suggestions.map(e=>e.name),n=e.answers.career_choice||``;return`
      <div class="test-career-grid">
        ${t.map(e=>`
          <button type="button" class="test-option ${n===e?`selected`:``}" data-test-option="${W(e)}">
            <span aria-hidden="true">🎓</span>
            <strong>${W(e)}</strong>
          </button>
        `).join(``)}
        <button type="button" class="test-option ${n===`Aún no lo sé`?`selected`:``}" data-test-option="Aún no lo sé">
          <span aria-hidden="true">🤔</span>
          <strong>Aún no lo sé</strong>
        </button>
      </div>
      ${t.length?`<p class="hint">Estas carreras salen de tus intereses y aptitudes. Puedes elegir una o decir que aún no lo sabes.</p>`:``}
    `}let t=V[e.step],n=e.answers[t.id]||[],r=t.id===`values`?3:null;return`
    <div class="test-choice-grid">
      ${t.options.map(e=>`
        <button type="button" class="test-option ${n.includes(e.label)?`selected`:``}" data-test-option="${W(e.label)}">
          <span class="test-check" aria-hidden="true">${n.includes(e.label)?`✓`:`+`}</span>
          <strong>${W(e.label)}</strong>
        </button>
      `).join(``)}
    </div>
    <div class="test-choice-foot">
      <span class="pill">${n.length} seleccionados${r?` · máximo ${r}`:``}</span>
      <button type="button" class="btn-mini" data-test-clear ${n.length?``:`hidden`}>Limpiar selección</button>
    </div>
  `}function Zs(e){let t=e.result||{},n=e.kind===`personality`?t.personality:t.aptitude,r=H.dashboard?.profile||{};if(e.kind===`personality`){let e=n?.scores||{},t=qs(e).map(e=>$a[e]?.label).filter(Boolean);return`
      <div class="test-result">
        <div class="test-result-hero">
          <span class="test-result-emoji" aria-hidden="true">🧠</span>
          <div>
            <span class="card-label">Test completado</span>
            <h2>Tu perfil de personalidad</h2>
            <p class="muted">${t.length?`Tus rasgos más marcados son ${t.join(` y `)}.`:`Gracias por responder con honestidad.`}</p>
          </div>
        </div>

        <div class="test-score-list">
          ${Object.entries($a).map(([t,n])=>{let r=e[t]??0;return`
              <div class="test-score">
                <div class="test-score-head">
                  <span>${n.emoji} ${W(n.label)}</span>
                  <strong>${r}%</strong>
                </div>
                <div class="ficha-bar" aria-hidden="true">
                  <div class="ficha-bar-fill" style="--bar-color:${r>=70?`var(--good)`:r>=40?`var(--brand)`:`var(--amber)`};--bar-scale:${(r/100).toFixed(3)}"></div>
                </div>
                <small>${W(n.copy)}</small>
              </div>
            `}).join(``)}
        </div>

        <div class="test-result-note">
          <strong>Tu profesor ya puede ver este resultado en tu ficha.</strong>
          <span>Puedes volver a hacer el test cuando quieras; se guardará la versión más reciente.</span>
        </div>

        <div class="test-result-actions">
          <button type="button" class="btn ghost" data-test-retry>Volver a hacerlo</button>
          <button type="button" class="btn primary" data-test-close>Cerrar</button>
        </div>
      </div>
    `}let i=Array.isArray(n?.career_suggestions)?n.career_suggestions:[],a=Array.isArray(n?.interests)?n.interests:[],o=Array.isArray(n?.aptitudes)?n.aptitudes:[],s=n?.career_choice||r.career_choice;return`
    <div class="test-result">
      <div class="test-result-hero">
        <span class="test-result-emoji" aria-hidden="true">🧭</span>
        <div>
          <span class="card-label">Test completado</span>
          <h2>Tu orientación vocacional</h2>
          <p class="muted">${s?`Elegiste ${W(s)} como una carrera que te llama la atención.`:`Estas son las carreras que mejor combinan con tus respuestas.`}</p>
        </div>
      </div>

      ${i.length?`
        <div class="test-career-results">
          <span class="card-label">Carreras sugeridas</span>
          ${i.map(e=>`
            <div class="test-career-row">
              <div>
                <strong>${W(e.name)}</strong>
                <small>${(e.matches||[]).map(e=>W(e)).join(` · `)||`Coincide con tu perfil`}</small>
              </div>
              <div class="test-career-score">
                <div class="ficha-bar" aria-hidden="true">
                  <div class="ficha-bar-fill" style="--bar-color:var(--brand-2);--bar-scale:${(Math.max(0,Math.min(100,e.score))/100).toFixed(3)}"></div>
                </div>
                <strong>${e.score}%</strong>
              </div>
            </div>
          `).join(``)}
        </div>
      `:`<p class="ficha-empty">Todavía no hay suficientes coincidencias. Puedes repetir el test eligiendo más intereses.</p>`}

      <div class="test-tag-columns">
        ${a.length?`
          <div class="test-summary-block">
            <span class="card-label">Intereses que elegiste</span>
            <div class="ficha-tags">${a.map(e=>`<span class="ficha-tag">${W(e)}</span>`).join(``)}</div>
          </div>
        `:``}
        ${o.length?`
          <div class="test-summary-block">
            <span class="card-label">Aptitudes que reconociste</span>
            <div class="ficha-tags">${o.map(e=>`<span class="ficha-tag">${W(e)}</span>`).join(``)}</div>
          </div>
        `:``}
      </div>

      <div class="test-result-note">
        <strong>Tu profesor ya puede ver estos intereses y carreras en tu ficha.</strong>
        <span>Puedes repetir el test si tus gustos cambian.</span>
      </div>

      <div class="test-result-actions">
        <button type="button" class="btn ghost" data-test-retry>Volver a hacerlo</button>
        <button type="button" class="btn primary" data-test-close>Cerrar</button>
      </div>
    </div>
  `}function Qs(e){let t=Js(e),n=Math.min(e.step,t-1);if(e.kind===`personality`){let t=eo[n];return t?e.answers[t.id]!=null:!1}return n>=V.length?!!e.answers.career_choice:(e.answers[V[n].id]||[]).length>0}function $s(){let e=H.activeTest;if(!e)return``;if(e.saved)return`
      <div class="test-overlay" data-test-overlay>
        <section class="test-dialog" role="dialog" aria-modal="true" aria-labelledby="test-title">
          <button type="button" class="ficha-close" data-test-close aria-label="Cerrar test">✕</button>
          <div class="test-body">${Zs(e)}</div>
        </section>
      </div>
    `;let t=Js(e),n=Math.min(e.step,t-1),r=Math.round((n+1)/t*100),i=Ys(e),a=e.kind===`vocational`&&n>=V.length,o=e.kind===`personality`?`Test de personalidad`:`Test de orientación vocacional`,s=e.kind===`personality`?`Pregunta ${n+1}`:a?`Tu carrera ideal`:V[n].title,c=e.kind===`personality`?i.text:a?`¿Cuál de estas carreras te llama más la atención?`:V[n].prompt,l=e.kind===`personality`?`Elige la opción que mejor te describa. No hay respuestas buenas o malas.`:a?`Puedes elegir una carrera o decir que aún no lo sabes.`:V[n].help,u=Qs(e);return`
    <div class="test-overlay" data-test-overlay>
      <section class="test-dialog" role="dialog" aria-modal="true" aria-labelledby="test-title">
        <button type="button" class="ficha-close" data-test-close aria-label="Cerrar test">✕</button>

        <header class="test-header">
          <div>
            <span class="card-label">${W(o)}</span>
            <h2 id="test-title">${W(s)}</h2>
          </div>
          <span class="pill">${n+1} / ${t}</span>
        </header>

        <div class="test-progress" aria-hidden="true">
          <div class="test-progress-fill" style="width:${r}%"></div>
        </div>

        <div class="test-body">
          <h3 class="test-prompt">${W(c)}</h3>
          <p class="test-help">${W(l)}</p>
          ${Xs(e)}
          <div class="test-error" data-test-error hidden></div>
        </div>

        <footer class="test-footer">
          <button type="button" class="btn ghost" data-test-back ${n===0?`disabled`:``}>← Atrás</button>
          <button type="button" class="btn primary" data-test-next aria-disabled="${u?`false`:`true`}" ${u?``:`data-pending="1"`}>
            ${n===t-1?`Guardar resultados`:`Siguiente →`}
          </button>
        </footer>
      </section>
    </div>
  `}function ec(){let e=document.querySelector(`[data-test-overlay]`);if(!e)return;let t=H.activeTest;if(!t)return;let n=()=>rc({refresh:!0});if(e.querySelectorAll(`[data-test-close]`).forEach(e=>{e.addEventListener(`click`,n)}),e.addEventListener(`click`,t=>{t.target===e&&n()}),H.activeTest.escHandler=po(e,n),t.saved){e.querySelectorAll(`[data-test-retry]`).forEach(e=>{e.addEventListener(`click`,()=>{let e=t.kind;rc({silent:!0}),nc(e)})});return}let r=()=>{let t=e.querySelector(`.test-dialog`);t&&(t.scrollTop=0)},i=()=>{let n=e.querySelector(`[data-test-next]`);if(!n)return;let r=Qs(t);n.setAttribute(`aria-disabled`,r?`false`:`true`),r?n.removeAttribute(`data-pending`):n.setAttribute(`data-pending`,`1`)},a=()=>{let n=e.querySelector(`.test-choice-foot`);if(!n)return;let r=V[t.step];if(!r)return;let a=Array.isArray(t.answers[r.id])?t.answers[r.id]:[],o=r.id===`values`?3:null,s=n.querySelector(`.pill`);s&&(s.textContent=`${a.length} seleccionados${o?` · máximo ${o}`:``}`);let c=n.querySelector(`[data-test-clear]`);c&&(c.hidden=a.length===0),i()};e.querySelectorAll(`[data-test-option]`).forEach(n=>{n.addEventListener(`click`,()=>{let i=n.dataset.testOption,o=Js(t);if(t.kind===`personality`){let e=eo[t.step];t.answers[e.id]=Number(i),t.step<o-1?(t.step+=1,tc(),r()):ic(null);return}if(t.step>=V.length){t.answers.career_choice=i,n.classList.add(`selected`);let r=e.querySelector(`[data-test-error]`);r&&(r.hidden=!1,r.textContent=`Guardando tus resultados…`),ic(null);return}let s=V[t.step],c=Array.isArray(t.answers[s.id])?[...t.answers[s.id]]:[],l=c.indexOf(i),u=s.id===`values`?3:null;l>=0?c.splice(l,1):(!u||c.length<u)&&c.push(i),t.answers[s.id]=c;let d=c.includes(i);n.classList.toggle(`selected`,d);let f=n.querySelector(`.test-check`);f&&(f.textContent=d?`✓`:`+`),a()})});let o=e.querySelector(`[data-test-clear]`);o&&o.addEventListener(`click`,()=>{let n=V[t.step];n&&(t.answers[n.id]=[],e.querySelectorAll(`[data-test-option].selected`).forEach(e=>{e.classList.remove(`selected`);let t=e.querySelector(`.test-check`);t&&(t.textContent=`+`)}),a())}),e.querySelector(`[data-test-back]`)?.addEventListener(`click`,()=>{t.step>0&&(--t.step,tc(),r())}),e.querySelector(`[data-test-next]`)?.addEventListener(`click`,async n=>{if(!Qs(t)){let n=e.querySelector(`[data-test-error]`);n&&(n.hidden=!1,n.textContent=t.kind===`personality`?`Elige una opción antes de continuar.`:`Selecciona al menos una opción antes de continuar.`);return}let r=Js(t);t.step<r-1?(t.step+=1,tc()):await ic(n.currentTarget)})}function tc(){document.querySelectorAll(`[data-test-overlay]`).forEach(e=>e.remove()),H.activeTest?.escHandler&&(H.activeTest.escHandler(),H.activeTest.escHandler=null);let e=$s();e?(document.body.insertAdjacentHTML(`beforeend`,e),document.body.classList.add(`test-open`),ec(),requestAnimationFrame(()=>{document.querySelector(`[data-test-close]`)?.focus()})):document.body.classList.remove(`test-open`)}function nc(e){H.activeTest={kind:e,step:0,answers:{},saved:!1,result:null,escHandler:null},tc()}function rc({silent:e=!1,refresh:t=!1}={}){H.activeTest?.escHandler&&H.activeTest.escHandler(),H.activeTest=null,document.querySelectorAll(`[data-test-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`test-open`),t&&!e&&$()}async function ic(e){let t=H.activeTest;if(!t||t.saving||e?.disabled)return;t.saving=!0;let n=document.querySelector(`[data-test-error]`);n&&e&&(n.hidden=!0,n.textContent=``);let r;if(t.kind===`personality`){let e=Gs(t.answers);r={version:1,completed_at:new Date().toISOString(),scores:e,top:qs(e),answers:t.answers}}else r=Ks(t.answers);e&&(e.disabled=!0,e.textContent=`Guardando…`);let{data:i,error:a}=await B.rpc(`app_save_student_test`,{p_kind:t.kind,p_payload:r});a?(t.saving=!1,e&&(e.disabled=!1,e.textContent=`Guardar resultados`),n&&(n.hidden=!1,n.textContent=a.message||`No se pudieron guardar los resultados.`)):(t.saved=!0,t.result=i||{},t.savedAt=new Date().toISOString(),H.dashboard&&(H.dashboard.profile=H.dashboard.profile||{},t.kind===`personality`?H.dashboard.profile.personality=r:(H.dashboard.profile.aptitude=r,H.dashboard.profile.interests=r.interests,H.dashboard.profile.aptitudes=r.aptitudes,H.dashboard.profile.strengths=r.aptitudes,H.dashboard.profile.career_suggestions=r.career_suggestions,r.career_choice&&(H.dashboard.profile.career_choice=r.career_choice))),tc())}function ac(e){let t=e.privacy||{},n=t.version||qa,r=t.url||`/privacidad.html`,i=e.children||[],a=e.pending||[],o=i.length>0,s=i.length+a.length,c=s?a.length?`Pendiente`:`Aceptado`:`Sin vínculos`,l=s&&!a.length?`success`:``;return`
    <article class="card wide privacy-gate">
      <div class="card-heading">
        <div>
          <span class="card-label">Privacidad</span>
          <h2>Aviso de privacidad ${W(n)}</h2>
        </div>
        <span class="pill ${l}">${c}</span>
      </div>
      ${s?`
        <p>Para consultar la información de tus hijos, lee el aviso y confirma que lo entiendes. Sin ese consentimiento, la plataforma no muestra datos del alumno.</p>
      `:`
        <p>Cuando la institución vincule a tus hijos, aparecerán aquí. Antes de mostrar sus datos deberás leer y aceptar el aviso de privacidad.</p>
      `}
      <div class="row">
        <a class="btn ghost" href="${W(r)}" target="_blank" rel="noopener">Leer el aviso completo</a>
      </div>
      ${a.length?`
        <label class="checkbox-field">
          <input type="checkbox" data-consent-ack>
          <span>He leído y entiendo el <a href="${W(r)}" target="_blank" rel="noopener">aviso de privacidad</a> ${W(n)}.</span>
        </label>
        <ul class="data-list">
          ${a.map(e=>`
            <li>
              <div>
                <strong>${W(e.label)}</strong>
                <small>Sin consentimiento vigente. No se muestran sus datos.</small>
              </div>
              <button class="btn primary" data-consent-student="${W(e.id)}" disabled>Aceptar y ver datos</button>
            </li>
          `).join(``)}
        </ul>
        <p class="hint">Marca la casilla para habilitar el botón. El consentimiento se registra por alumno.</p>
      `:s?`
        <p class="hint">Consentimiento vigente. Puedes revocarlo cuando quieras desde la lista de tus hijos.</p>
      `:``}
    </article>

    ${o?`
      <article class="card wide">
        <div class="card-heading">
          <div>
            <span class="card-label">Mis hijos</span>
            <h2>${Go(i.length,`alumno vinculado`,`alumnos vinculados`)}</h2>
          </div>
          <span class="pill">Solo lectura</span>
        </div>
        <ul class="data-list">
          ${i.map(e=>{let t=e.consent_accepted_at?X(String(e.consent_accepted_at).slice(0,10)):``;return`
              <li>
                <div>
                  <strong>${W(e.full_name)}</strong>
                  <small>${W(e.student_code)} · ${W(e.group_name)}${t?` · Consentimiento del ${W(t)}`:``}</small>
                </div>
                <button class="btn ghost" data-revoke-consent="${W(e.id)}" data-revoke-name="${W(e.full_name)}">Revocar consentimiento</button>
              </li>
            `}).join(``)}
        </ul>
        <p class="muted"><small>Si revocas el consentimiento, dejaremos de mostrar la información del alumno hasta que vuelvas a aceptar el aviso.</small></p>
      </article>
    `:``}

    ${o?oc(e):``}

    ${o?cc(e):``}
  `}function oc(e){let t=e.children||[],n=e.academics||new Map;return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Seguimiento</span>
          <h2>Avance, calificaciones y tareas</h2>
        </div>
        <span class="pill">Solo lectura</span>
      </div>
      <p class="muted"><small>Ves lo que el personal registra para tus hijos. No puedes editar nada desde aquí.</small></p>
      ${t.map(e=>sc(e,n.get(e.id)||{})).join(``)}
    </article>
  `}function sc(e,t){let n=t.stats||{},r=t.progress||[],i=t.grades||[],a=t.attendance||[],o=t.observations||[],s=t.tasks||[],c=t.guidance||{},l=a.reduce((e,t)=>(e[t.status]=(e[t.status]||0)+1,e),{}),u=a.length,d=u?Math.round(((l.present||0)+(l.late||0))*100/u):null,f=r.filter(e=>e.status===`completed`||e.status===`mastered`).length,p=r.filter(e=>e.status===`in_progress`).length,m=s.filter(e=>!e.submission||e.submission.status===`pending`),h=Array.isArray(c.interests)?c.interests:[],g=Array.isArray(c.aptitudes)?c.aptitudes:[],_=Array.isArray(c.strengths)?c.strengths:[],v=Array.isArray(c.career_suggestions)?c.career_suggestions.map(e=>typeof e==`string`?e:e?.name).filter(Boolean):[],y=h.length||g.length||_.length||v.length||c.career_choice,b=e=>e.submission?{pending:`Pendiente`,submitted:`Entregada`,late:`Entregada tarde`}[e.submission.status]||`Pendiente`:`Sin registrar`,x=e=>({present:`Asistencia`,late:`Retardo`,excused:`Justificado`,absent:`Falta`})[e]||e;return`
    <section class="guardian-child">
      <div class="guardian-child-head">
        <div>
          <h3>${W(e.full_name)}</h3>
          <small>${W(e.student_code)} · ${W(e.group_name)}</small>
        </div>
        <span class="pill">Solo lectura</span>
      </div>

      <div class="guardian-grid">
        <div class="guardian-block">
          <h4>Avance <span class="guardian-ro">Solo lectura</span></h4>
          <div class="guardian-chips">
            <span class="hero-chip">🎯 ${f} ${f===1?`unidad completada`:`unidades completadas`}</span>
            <span class="hero-chip">📚 ${p} en curso</span>
            <span class="hero-chip">⚡ ${Number(n.xp_total||0)} XP</span>
          </div>
          ${r.length?`
            <ul class="data-list compact">
              ${r.slice(0,6).map(e=>`
                <li>
                  <div>
                    <strong>${W(e.unit_title)}</strong>
                    <small>${W(e.subject_name||`Materia`)} · ${W(Ga[e.status]||e.status)}${e.best_accuracy==null?``:` · ${Math.round(e.best_accuracy)}%`}</small>
                  </div>
                </li>
              `).join(``)}
            </ul>
          `:`<p class="empty-state">Todavía no hay avance registrado.</p>`}
        </div>

        <div class="guardian-block">
          <h4>Calificaciones visibles <span class="guardian-ro">Solo lectura</span></h4>
          ${i.length?`
            <ul class="data-list compact">
              ${i.slice(0,8).map(e=>`
                <li>
                  <div>
                    <strong>${W(e.assessment_name)}</strong>
                    <small>${W(e.subject_name||`Materia`)}${e.assessment_date?` · ${W(X(e.assessment_date))}`:``}</small>
                  </div>
                  <span class="pill ${e.score==null?``:`success`}">${e.score==null?`Pendiente`:`${e.score}/${e.max_score??`—`}`}</span>
                </li>
              `).join(``)}
            </ul>
          `:`<p class="empty-state">Aún no hay calificaciones marcadas como visibles para la familia.</p>`}
        </div>

        <div class="guardian-block">
          <h4>Asistencia <span class="guardian-ro">Solo lectura</span></h4>
          ${u?`
            <div class="guardian-chips">
              <span class="hero-chip">✅ ${d}% de asistencia</span>
              ${Object.entries(l).map(([e,t])=>`<span class="hero-chip">${W(x(e))}: ${t}</span>`).join(``)}
            </div>
            <ul class="data-list compact">
              ${a.slice(0,6).map(e=>`
                <li>
                  <div>
                    <strong>${e.session_date?W(X(e.session_date)):`Sesión`}</strong>
                    <small>${W(e.topic||`Sin tema registrado`)}${e.minutes_late?` · ${e.minutes_late} min tarde`:``}</small>
                  </div>
                  <span class="pill ${e.status===`absent`?`pill-amber`:``}">${W(x(e.status))}</span>
                </li>
              `).join(``)}
            </ul>
          `:`<p class="empty-state">Aún no hay registros de asistencia.</p>`}
        </div>

        <div class="guardian-block">
          <h4>Tareas <span class="guardian-ro">Solo lectura</span></h4>
          ${s.length?`
            <div class="guardian-chips">
              <span class="hero-chip">📝 ${m.length} pendientes</span>
            </div>
            <ul class="data-list compact">
              ${s.slice(0,6).map(e=>`
                <li>
                  <div>
                    <strong>${W(e.title)}</strong>
                    <small>${W(e.subject_name||`Materia`)}${e.due_at?` · entrega ${W(X(String(e.due_at).slice(0,10)))}`:``}</small>
                  </div>
                  <span class="pill ${e.submission?.status===`submitted`?`success`:e.submission?.status===`late`?`pill-amber`:``}">${W(b(e))}${e.submission?.score==null?``:` · ${e.submission.score}/${e.max_score??`—`}`}</span>
                </li>
              `).join(``)}
            </ul>
          `:`<p class="empty-state">Aún no hay tareas asignadas.</p>`}
        </div>

        <div class="guardian-block wide">
          <h4>Observaciones para la familia <span class="guardian-ro">Solo lectura</span></h4>
          ${o.length?`
            <ul class="data-list compact">
              ${o.slice(0,6).map(e=>`
                <li>
                  <div>
                    <strong>${W(e.category||`Observación`)}</strong>
                    <small>${W(X(String(e.created_at).slice(0,10)))}</small>
                    <p>${W(e.body)}</p>
                  </div>
                </li>
              `).join(``)}
            </ul>
          `:`<p class="empty-state">No hay observaciones visibles para la familia.</p>`}
        </div>

        <div class="guardian-block wide">
          <h4>Orientación vocacional <span class="guardian-ro">Solo lectura</span></h4>
          <p class="hint">Resumen orientativo, no diagnóstico. Las notas internas de orientación quedan reservadas al personal docente.</p>
          ${y?`
            ${c.career_choice?`<p><strong>Carrera de interés:</strong> ${W(c.career_choice)}</p>`:``}
            ${h.length?`<p><strong>Intereses:</strong> ${h.map(e=>W(e)).join(` · `)}</p>`:``}
            ${g.length?`<p><strong>Aptitudes:</strong> ${g.map(e=>W(e)).join(` · `)}</p>`:``}
            ${_.length?`<p><strong>Fortalezas:</strong> ${_.map(e=>W(e)).join(` · `)}</p>`:``}
            ${v.length?`<p><strong>Carreras sugeridas:</strong> ${v.slice(0,6).map(e=>W(e)).join(` · `)}</p>`:``}
          `:`<p class="empty-state">El alumno todavía no ha completado los test de orientación.</p>`}
        </div>
      </div>
    </section>
  `}function cc(e){let t=e.billingByStudent||new Map,n=e.billingStatusByStudent||new Map;return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Cuentas</span>
          <h2>Plan y pagos de tus hijos</h2>
        </div>
        <span class="pill">Solo lectura</span>
      </div>
      ${e.children.map(r=>{let i=t.get(r.id)||{},a=n.get(r.id)||{},o=i.plan||`mensual`,s=Cs(r.id,e.payments),c=ws(r.id,e.payments),l=Ss(r.id,e.payments).slice().sort((e,t)=>String(t.paid_at).localeCompare(String(e.paid_at))).slice(0,3);return`
          <div class="guardian-pay">
            <div class="guardian-pay-head">
              <div>
                <strong>${W(r.full_name)}</strong>
                <small>${W(r.student_code)}</small>
              </div>
              <div class="pay-cells">
                <span class="pill">${W(bs[o]||o)}${i.fee?` · ${Q(i.fee)}`:``}</span>
                ${a.status?`<span class="pill ${a.status===`al corriente`||a.status===`beca`?`success`:`pill-amber`}">${W(Os(a.status))}</span>`:``}
                <span class="pill ${s>0?`success`:``}">Pagado: ${Q(s)}</span>
                ${c?`<span class="pill">Último pago: ${W(X(String(c.paid_at).slice(0,10)))}</span>`:`<span class="pill">Sin pagos registrados</span>`}
              </div>
            </div>
            ${a.period_start?`
              <p class="muted"><small>Periodo actual: ${W(X(a.period_start))} – ${W(X(a.period_end))}${a.balance!=null&&Number(a.balance)>0?` · Saldo: ${Q(a.balance)}`:``}</small></p>
            `:``}
            ${l.length?`
              <ul class="data-list">
                ${l.map(e=>`
                  <li>
                    <div>
                      <strong>${Q(e.amount)}${e.receipt_no?` · ${W(e.receipt_no)}`:``}</strong>
                      <small>${W(X(String(e.paid_at).slice(0,10)))} · ${W(xs[e.method]||e.method)}${e.period_start?` · ${W(X(e.period_start))}–${W(X(e.period_end))}`:``}${e.status===`voided`?` · Anulado`:``}</small>
                    </div>
                    <div class="pay-history-actions">
                      <span class="pill ${e.status===`voided`?`pill-amber`:`success`}">${W(Ds(e.status))}</span>
                      <button class="btn ghost" data-receipt-payment="${W(e.id)}" aria-label="Descargar recibo ${W(e.receipt_no||e.id)}">Recibo</button>
                    </div>
                  </li>
                `).join(``)}
              </ul>
            `:``}
            ${i.notes?`<p class="muted"><small>📝 ${W(i.notes)}</small></p>`:``}
            <p class="muted"><small>¿Algo no cuadra? Escribe a la institución para revisar tu estado de cuenta.</small></p>
          </div>
        `}).join(``)}
    </article>
  `}function lc(e){return H.dashboardError?`
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>No se pudo cargar</h2>
        <p>${W(H.dashboardError)}</p>
      </article>
    `:H.dashboard?H.dashboard.kind===`admin`?Ko(H.dashboard):H.dashboard.kind===`teacher`?ss(H.dashboard):H.dashboard.kind===`guardian`?ac(H.dashboard):Hs(H.dashboard):`
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>Cargando datos…</h2>
        <p>Estamos consultando tu grupo y tu avance.</p>
      </article>
    `}function uc(e){if(e.role===`admin`||e.role===`teacher`)return ss(H.dashboard);let t=Ua[e.role]||`Usuario`,n=e.full_name||e.username||e.email||`Sin nombre`,r=e.username?`@${e.username}`:e.email||`Sin identificador`;return`
    <div class="shell">
      ${ho()}
      <main id="main-content" tabindex="-1" class="dashboard">
        <section class="welcome">
          <div>
            <span class="kicker">Sesión activa</span>
            <h1>Hola, ${W(n.split(` `)[0])}</h1>
            <p class="muted">${W(Wa[e.role]||`Tu cuenta está conectada.`)}</p>
          </div>
          <div class="identity">
            <span class="avatar">${W(n.slice(0,1).toUpperCase())}</span>
            <div>
              <strong>${W(n)}</strong>
              <small>${W(t)} · ${W(r)}</small>
            </div>
          </div>
        </section>

        ${mo()}

        <div class="grid">
          <article class="card">
            <span class="card-label">Conexión</span>
            <h2>Supabase conectado</h2>
            <p>La sesión y el perfil se cargaron desde la base. Entorno: <strong>${W(Oa)}</strong>.</p>
            <span class="pill success">Operativo</span>
          </article>

          <article class="card">
            <span class="card-label">Rol</span>
            <h2>${W(t)}</h2>
            <p>${W(Wa[e.role]||``)}</p>
            <span class="pill">${W(e.role)}</span>
          </article>

          ${lc(e)}
        </div>

        <div class="row end">
          <button class="btn ghost" id="logout-btn">Cerrar sesión</button>
        </div>
      </main>
      ${go()}
    </div>
  `}function dc({total:e,page:t,target:n,pageSize:r=Ya}){let i=Math.max(1,Math.ceil(e/r)),a=Math.min(Math.max(1,t),i),o=e?(a-1)*r+1:0,s=Math.min(a*r,e);return`
    <div class="pagination" aria-label="Paginación">
      <span>Mostrando ${s-o+1} de ${e} · filas ${o}–${s}</span>
      <div class="row">
        <button class="btn-mini" data-pagination="${W(n)}" data-page="${a-1}" ${a<=1?`disabled`:``} aria-label="Página anterior">← Anterior</button>
        <span aria-live="polite">Página ${a} de ${i}</span>
        <button class="btn-mini" data-pagination="${W(n)}" data-page="${a+1}" ${a>=i?`disabled`:``} aria-label="Página siguiente">Siguiente →</button>
      </div>
    </div>
  `}function fc(e){return W(e).replaceAll(`
`,`<br>`)}function pc(e){return Ga[e?.status]||`Sin empezar`}function mc(e,t){return t?e===t.correct_index?`correct`:e===t.selected_index&&!t.is_correct?`incorrect`:``:``}function hc(e,t,n){let r=Array.isArray(e.options)?e.options:[],i=n.exerciseKey?`data-answer-kind="exercise" data-answer-key="${W(n.exerciseKey)}"`:`data-answer-kind="quiz" data-answer-part="${W(n.part)}" data-answer-key="${W(n.questionKey)}"`,a=n.exerciseKey?`exercise:${n.exerciseKey}`:`quiz:${n.part}:${n.questionKey}`;return`
    <article class="card wide question-card">
      <span class="card-label">${W(n.title||`Pregunta`)}</span>
      <h2>${W(e.prompt||`Pregunta`)}</h2>
      <div class="options">
        ${r.map((e,n)=>`
          <button class="option-btn ${mc(n,t)}"
            ${i}
            data-answer-index="${n}">
            ${W(e)}
          </button>
        `).join(``)}
      </div>
      ${t?`
        <div class="answer-box ${t.is_correct?`correct`:`incorrect`}">
          <strong>${t.is_correct?`Correcto`:`Todavía no`}</strong>
          ${t.explanation?`<p>${W(t.explanation)}</p>`:``}
          <div class="answer-foot">
            <small>Intento ${t.attempt_no||1}</small>
            <button class="btn-mini" data-retry-question="${W(a)}">↺ Reintentar</button>
          </div>
        </div>
      `:``}
    </article>
  `}function gc(e,t){let n=String(e.key||``);return e.type===`exercise`?hc(e,t[`exercise:${n}`],{title:`Ejercicio`,exerciseKey:n}):`
    <article class="card wide unit-section">
      <span class="card-label">${e.type===`example`?`Ejemplo`:`Lección`}</span>
      <h2>${W(e.title||`Sección`)}</h2>
      <p class="unit-body">${fc(e.body||``)}</p>
    </article>
  `}function _c(e,t){let n=String(e.key||``),r=!!t;return`
    <article class="card wide question-card">
      <span class="card-label">Ejercicio ${W(n.replace(`ej-`,``))}</span>
      <h2>${W(e.prompt||`Ejercicio`)}</h2>
      ${e.figure?`<div class="figure">${W(e.figure)}</div>`:``}
      <button class="btn ghost reveal-btn" data-reveal="${W(n)}">Ver respuesta</button>
      <div class="flashcard-answer hidden" data-flashcard-answer="${W(n)}">
        <p class="unit-body"><strong>Respuesta:</strong> ${W(e.answer||``)}</p>
        ${(e.steps||[]).length?`
          <ol class="steps">
            ${e.steps.map(e=>`<li>${W(e)}</li>`).join(``)}
          </ol>
        `:``}
        ${(e.acceptedAnswers||[]).length?`
          <p class="muted"><small>También vale: ${e.acceptedAnswers.map(W).join(` · `)}</small></p>
        `:``}
        <div class="row">
          <button class="btn primary" data-answer-kind="flashcard"
            data-answer-key="${W(n)}" data-answer-text="${W(e.answer)}"
            ${r?`disabled`:``}>Lo acerté</button>
          <button class="btn ghost" data-answer-kind="flashcard"
            data-answer-key="${W(n)}" data-answer-text="x"
            ${r?`disabled`:``}>Todavía no</button>
        </div>
      </div>
      ${t?`
        <div class="answer-box ${t.is_correct?`correct`:`incorrect`}">
          <strong>${t.is_correct?`Correcto`:`Todavía no`}</strong>
          ${t.explanation?`<p>${W(t.explanation)}</p>`:``}
          <small>Intento ${t.attempt_no||1}</small>
        </div>
      `:``}
    </article>
  `}function vc(e,t,n){return`
    <article class="card wide unit-section">
      <span class="card-label">${W(e)}</span>
      <h2>${W(t)}</h2>
      <p class="unit-body">${fc(n)}</p>
    </article>
  `}function yc(e,t){return`
    <article class="card wide unit-section">
      <span class="card-label">Ejemplo ${t+1}</span>
      <h2>${W(e.prompt||`Ejemplo`)}</h2>
      ${(e.steps||[]).length?`
        <ol class="steps">
          ${e.steps.map(e=>`<li>${W(e)}</li>`).join(``)}
        </ol>
      `:``}
      ${e.result?`<p class="unit-body"><strong>Resultado:</strong> ${W(e.result)}</p>`:``}
    </article>
  `}function bc(e){if(!e||typeof e!=`object`)return``;let t=e.intro,n=Array.isArray(e.bloques)?e.bloques:[];return(t?`
    <article class="card wide unit-section">
      <span class="card-label">Capítulo</span>
      <h2>${W(t.t||`Antes de empezar`)}</h2>
      ${t.p1?`<p class="unit-body">${fc(t.p1)}</p>`:``}
      ${t.p2?`<p class="unit-body">${fc(t.p2)}</p>`:``}
      ${(t.items||[]).length?`
        <ul class="steps">
          ${t.items.map(e=>`<li>${W(String(e))}</li>`).join(``)}
        </ul>
      `:``}
    </article>
  `:``)+n.map(e=>`
    <article class="card wide unit-section">
      <span class="card-label">${W(e.rotulo||`Bloque`)}</span>
      <h2>${W(e.nombre||`Sección del capítulo`)}</h2>
      ${e.intro?`<p class="unit-body">${fc(e.intro)}</p>`:``}
      ${(e.cards||[]).map(e=>`
        <div class="chapter-card">
          <strong>${W(e.titulo||``)}</strong>
          ${e.pill?`<span class="pill">${W(e.pill)}</span>`:``}
          ${e.hace?`<p class="unit-body">${fc(e.hace)}</p>`:``}
        </div>
      `).join(``)}
    </article>
  `).join(``)}function xc(e){let t=Array.isArray(e.theory)?e.theory:[],n=Array.isArray(e.guides)?e.guides:[],r=Array.isArray(e.examples)?e.examples:[],i=Array.isArray(e.commonMistakes)?e.commonMistakes:[],a=Array.isArray(e.exercises)?e.exercises:[],o=e.unit?.hook||``,s=e.unit?.truco||``;return[o?vc(`Para empezar`,`¿De qué trata?`,o):``,t.map((e,t)=>vc(`Concepto`,`Idea ${t+1}`,e)).join(``),s?vc(`Truco`,`Recuerda`,s):``,n.map((e,t)=>vc(`Guía práctica`,`Actividad ${t+1}`,e)).join(``),r.map(yc).join(``),i.map(e=>`
      <article class="card wide unit-section mistake-card">
        <span class="card-label">Error común</span>
        <h2>${W(e.title||`Cuidado`)}</h2>
        <p class="unit-body">${fc(e.detail||``)}</p>
      </article>
    `).join(``),bc(e.chapter),a.map(e=>_c(e,H.unitResults[`exercise:${e.key}`])).join(``)].join(``)}function Sc(e,t){let n=Array.isArray(e.quiz)?e.quiz:[],r=e.reto&&typeof e.reto==`object`?e.reto:null;return[...n.map(e=>{let n=e.part||`tipo`,r=String(e.key||``);return hc(e,t[`quiz:${n}:${r}`],{title:Ka[n]||`Quiz`,part:n,questionKey:r})}),r?hc(r,t[`quiz:reto:${String(r.key||``)}`],{title:`Reto final`,part:`reto`,questionKey:String(r.key||``)}):``].join(``)}function Cc(e){if(!e)return``;if(e.loading)return`
      <div class="shell">
        ${ho()}
        <main id="main-content" tabindex="-1" class="dashboard">
          <section class="welcome">
            <div>
              <span class="kicker">Unidad activa</span>
              <h1>Abriendo unidad…</h1>
              <p class="muted">Estamos cargando el contenido y tu avance.</p>
            </div>
          </section>
          <div class="grid">
            <article class="card wide">
              <div class="spinner" aria-hidden="true"></div>
              <p>Cargando…</p>
            </article>
          </div>
          <div class="row end">
            <button class="btn ghost" id="back-btn">Volver al panel</button>
          </div>
        </main>
      </div>
    `;let t=e.assignment,n=e.unit,r=e.version?.content||{},i=Array.isArray(r.sections)&&r.sections.length>0,a=e.progress,o=a?.status===`completed`||a?.status===`mastered`,s=Array.isArray(r.unit?.objective)?r.unit.objective[0]:r.unit?.objective||``,c=n?.estimated_minutes||r.unit?.estimatedMinutes,l=n?.subject_name||r.unit?.subjectKey||`Materia`,u=i||Array.isArray(r.exercises)&&r.exercises.length>0||Array.isArray(r.quiz)&&r.quiz.length>0||!!r.reto,d=!e.requirements||e.requirements.can_complete,f=e.quizPolicy?.max_attempts,p=f===0?`sin límite de intentos`:Number.isInteger(f)&&f>0?`${f} intentos por pregunta`:``;return`
    <div class="shell">
      ${ho()}
      <main id="main-content" tabindex="-1" class="dashboard">
        <section class="welcome">
          <div>
            <span class="kicker">Unidad activa</span>
            <h1>${W(n?.title||`Unidad`)}</h1>
            <p class="muted">${W(s||`Contenido de la unidad.`)}</p>
          </div>
          <div class="identity">
            <span class="avatar">${W((n?.title||`U`).slice(0,1).toUpperCase())}</span>
            <div>
              <strong>${W(l)}</strong>
              <small>${W(pc(a))}${c?` · ${c} min`:``}</small>
            </div>
          </div>
        </section>

        ${mo()}

        <div class="grid">
          <article class="card wide">
            <div class="card-heading">
              <div>
                <span class="card-label">Sesión</span>
                <h2>${W(n?.title||`Unidad`)}</h2>
              </div>
              <span class="pill ${o?`success`:``}">${W(pc(a))}</span>
            </div>
            <p>${W(l)}${c?` · ${c} minutos estimados`:``}${e.version?.version?` · versión ${e.version.version}`:``}</p>
            ${t.instructions?`<p class="unit-body">${fc(t.instructions)}</p>`:``}
          </article>

          ${i?r.sections.map(e=>gc(e,H.unitResults)).join(``):xc(r)}
          ${Sc(r,H.unitResults)}
          ${p?`<p class="hint">Política de intentos: ${W(p)}.</p>`:``}

          ${u?``:`<article class="card wide"><p class="empty-state">Esta versión todavía no tiene ejercicios.</p></article>`}

          ${e.requirements?`
            <article class="card wide requirement-card" role="status" aria-live="polite">
              <span class="card-label">Requisitos de completado</span>
              <p>${W(e.requirements.message)}</p>
              <small class="muted">Mínimo ${W(String(e.requirements.rules?.min_exercises_pct??60))} % de ejercicios y ${W(String(e.requirements.rules?.min_quiz_accuracy??70))} % de precisión en el quiz.</small>
            </article>
          `:``}
        </div>

        <div class="row end">
          <button class="btn ghost" id="back-btn">Volver al panel</button>
          <button class="btn primary" id="complete-unit-btn" ${o||!d?`disabled`:``}>
            ${o?`Unidad completada`:d?`Marcar como completada`:`Faltan requisitos`}
          </button>
        </div>
      </main>
    </div>
  `}function wc(){U.innerHTML=Cc(H.unitView);let e=U.querySelector(`#back-btn`);e&&e.addEventListener(`click`,Tc);let t=U.querySelector(`#complete-unit-btn`);t&&t.addEventListener(`click`,kc),U.querySelectorAll(`[data-answer-key]`).forEach(e=>{e.addEventListener(`click`,Oc)}),U.querySelectorAll(`[data-retry-question]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.retryQuestion;t&&(delete H.unitResults[t],wc())})}),U.querySelectorAll(`[data-reveal]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.reveal,n=U.querySelector(`[data-flashcard-answer="${t}"]`);n&&(n.classList.toggle(`hidden`),e.textContent=n.classList.contains(`hidden`)?`Ver respuesta`:`Ocultar respuesta`)})}),yo()}function Tc(){H.view=`dashboard`,H.unitView=null,H.unitResults={},H.error=``,H.notice=``,$(),J(H.profile)}async function Ec(e){let t=(H.dashboard?.units||[]).find(t=>t.id===e);if(t){H.view=`unit`,H.unitResults={},H.error=``,H.notice=``,H.unitView={assignment:t,unit:t.unit,version:null,progress:t.progress,requirements:null,quizPolicy:null,loading:!0},wc();try{let[e,n,r,i]=await Promise.all([B.from(`unit_versions`).select(`content,version`).eq(`id`,t.unit_version_id).maybeSingle(),B.rpc(`app_start_unit`,{p_assignment_id:t.id}),B.rpc(`app_unit_requirements`,{p_assignment_id:t.id}),B.rpc(`app_quiz_policy`)]);if(Y(e.error),Y(n.error),Y(r.error),Y(i.error),H.view!==`unit`||H.unitView?.assignment.id!==t.id)return;H.unitView={assignment:t,unit:t.unit,version:e.data,progress:n.data||t.progress,requirements:r.data,quizPolicy:i.data,loading:!1}}catch(e){if(H.view!==`unit`||H.unitView?.assignment.id!==t.id)return;console.error(`open_unit_error`,e?.message||e),G(`No se pudo abrir la unidad. ${e?.message||``}`.trim()),H.unitView={...H.unitView,loading:!1}}wc()}}async function Dc(){let e=H.unitView;if(!e||e.loading)return;let{data:t,error:n}=await B.rpc(`app_unit_requirements`,{p_assignment_id:e.assignment.id});n||H.view===`unit`&&H.unitView?.assignment.id===e.assignment.id&&(H.unitView={...H.unitView,requirements:t},wc())}async function Oc(e){let t=e.currentTarget,n=H.unitView;if(!n||n.loading||t.disabled)return;let r=t.dataset.answerKind,i=t.dataset.answerKey,a=t.dataset.answerPart||`reto`,o=r===`exercise`||r===`flashcard`?`exercise:${i}`:`quiz:${a}:${i}`;if(!i)return;if(r===`flashcard`){H.error=``,H.notice=``,t.disabled=!0;try{let{data:e,error:r}=await B.rpc(`app_record_exercise_attempt`,{p_assignment_id:n.assignment.id,p_exercise_key:i,p_answer:{text:t.dataset.answerText||`x`},p_duration_ms:null});if(r)throw r;if(H.view!==`unit`||H.unitView?.assignment.id!==n.assignment.id)return;H.unitResults[o]=e,e.progress&&(H.unitView.progress=e.progress)}catch{if(H.view!==`unit`||H.unitView?.assignment.id!==n.assignment.id)return;G(`No se pudo guardar tu respuesta. Revisa la conexión e intenta de nuevo.`)}wc();return}let s=Number(t.dataset.answerIndex);if(!Number.isNaN(s)){H.error=``,H.notice=``,t.disabled=!0;try{let{data:e,error:t}=r===`exercise`?await B.rpc(`app_record_exercise_attempt`,{p_assignment_id:n.assignment.id,p_exercise_key:i,p_answer:{index:s},p_duration_ms:null}):await B.rpc(`app_submit_quiz_answer`,{p_assignment_id:n.assignment.id,p_part:a,p_question_key:i,p_selected_index:s});if(t)throw t;if(H.view!==`unit`||H.unitView?.assignment.id!==n.assignment.id)return;H.unitResults[o]={...e,selected_index:s},e.progress&&(H.unitView.progress=e.progress)}catch{if(H.view!==`unit`||H.unitView?.assignment.id!==n.assignment.id)return;G(`No se pudo guardar tu respuesta. Revisa la conexión e intenta de nuevo.`)}wc(),Dc()}}async function kc(){let e=H.unitView;if(!e||e.loading)return;let t=U.querySelector(`#complete-unit-btn`);t&&(t.disabled=!0,t.textContent=`Guardando…`),H.error=``,H.notice=``;let{data:n,error:r}=await B.rpc(`app_complete_unit`,{p_assignment_id:e.assignment.id});r?(G(r.message||`No se pudo completar la unidad. Revisa la conexión e intenta de nuevo.`),wc()):H.view===`unit`&&H.unitView?.assignment.id===e.assignment.id&&(H.unitView.progress=n,K(`Unidad marcada como completada.`),wc())}function Ac(e,t){let n=(H.dashboard?.groups||[]).find(t=>t.id===e),r=new Set((t?.overrides||[]).filter(e=>e.status===`closed`).map(e=>e.student_id));return(n?.students||[]).map(e=>({id:e.id,full_name:e.full_name||`Alumno sin nombre`,student_code:e.student_code||``,selected:!r.has(e.id)}))}function jc({mode:e,unitId:t,versionId:n,groupId:r,assignmentId:i=null}){let a=H.dashboard,o=i?(a?.assignments||[]).find(e=>e.id===i):null,s=r||o?.group_id,c=t||o?.unit_id,l=n||o?.unit_version_id,u=(a?.groups||[]).find(e=>e.id===s);if(!u||!c){G(`No se pudo identificar la unidad o el grupo.`);return}let d=(a?.publishedUnits||[]).find(e=>e.id===c),f=Ac(s,o);H.unitAssign={mode:e,unitId:c,versionId:l||_s(a,c),groupId:s,assignmentId:i,unitTitle:d?.title||`Unidad`,groupName:u.name,students:f,closesAt:o?.closes_at?String(o.closes_at).slice(0,10):``,saving:!1,escHandler:null},Pc()}function Mc(){let e=H.unitAssign;if(!e)return``;let t=e.students.filter(e=>e.selected).length,n=t===e.students.length,r=t===0;return`
    <div class="unit-assign-overlay" data-unit-assign-overlay>
      <section class="unit-assign-dialog" role="dialog" aria-modal="true" aria-labelledby="unit-assign-title">
        <button type="button" class="ficha-close" data-unit-assign-close aria-label="Cerrar">✕</button>

        <header class="unit-assign-head">
          <span class="card-label">${e.mode===`activate`?`Activar unidad`:`Alumnos de la unidad`}</span>
          <h2 id="unit-assign-title">${W(e.unitTitle)}</h2>
          <p class="muted">${W(e.groupName)} · elige a qué alumnos se activa esta unidad.</p>
        </header>

        <div class="unit-assign-toolbar">
          <span class="pill ${t?`success`:`pill-red`}">${t}/${e.students.length} alumnos seleccionados</span>
          <div class="row">
            <button type="button" class="btn-mini" data-unit-assign-all ${n?`disabled`:``}>Todos</button>
            <button type="button" class="btn-mini" data-unit-assign-none ${r?`disabled`:``}>Ninguno</button>
          </div>
        </div>

        ${e.students.length?`
          <div class="unit-assign-list">
            ${e.students.map(e=>`
              <label class="unit-assign-row ${e.selected?`selected`:``}">
                <input type="checkbox" data-unit-assign-student="${W(e.id)}" ${e.selected?`checked`:``}>
                <span class="unit-assign-avatar" aria-hidden="true">${W((e.full_name||`A`).trim().slice(0,1).toUpperCase())}</span>
                <span class="unit-assign-name">
                  <strong>${W(e.full_name)}</strong>
                  <small>${W(e.student_code||`Sin matrícula`)}</small>
                </span>
                <span class="unit-assign-state">${e.selected?`Incluido`:`Excluido`}</span>
              </label>
            `).join(``)}
          </div>
        `:`<p class="ficha-empty">Este grupo todavía no tiene alumnos.</p>`}

        <label class="field unit-assign-date">
          <span>Fecha de cierre (opcional)</span>
          <input type="date" data-unit-assign-closes value="${W(e.closesAt)}">
          <small class="hint">Si la dejas vacía, la unidad quedará abierta hasta que la cierres.</small>
        </label>

        <div class="unit-assign-error" data-unit-assign-error hidden></div>

        <footer class="unit-assign-foot">
          <button type="button" class="btn ghost" data-unit-assign-close>Cancelar</button>
          <button type="button" class="btn primary" data-unit-assign-save ${t?``:`disabled`}>
            ${e.mode===`activate`?`Activar para ${t} ${t===1?`alumno`:`alumnos`}`:`Guardar cambios`}
          </button>
        </footer>
      </section>
    </div>
  `}function Nc(){let e=document.querySelector(`[data-unit-assign-overlay]`),t=H.unitAssign;if(!e||!t)return;let n=()=>Fc();e.querySelectorAll(`[data-unit-assign-close]`).forEach(e=>{e.addEventListener(`click`,n)}),e.addEventListener(`click`,t=>{t.target===e&&n()}),t.escHandler=po(e,n),e.querySelectorAll(`[data-unit-assign-student]`).forEach(e=>{e.addEventListener(`change`,()=>{let n=t.students.find(t=>t.id===e.dataset.unitAssignStudent);n&&(n.selected=e.checked),Pc()})}),e.querySelector(`[data-unit-assign-all]`)?.addEventListener(`click`,()=>{t.students.forEach(e=>{e.selected=!0}),Pc()}),e.querySelector(`[data-unit-assign-none]`)?.addEventListener(`click`,()=>{t.students.forEach(e=>{e.selected=!1}),Pc()});let r=e.querySelector(`[data-unit-assign-closes]`);r&&r.addEventListener(`change`,()=>{t.closesAt=r.value}),e.querySelector(`[data-unit-assign-save]`)?.addEventListener(`click`,e=>{Ic(e.currentTarget)})}function Pc(){document.querySelectorAll(`[data-unit-assign-overlay]`).forEach(e=>e.remove()),H.unitAssign?.escHandler&&(H.unitAssign.escHandler(),H.unitAssign.escHandler=null);let e=Mc();e?(document.body.insertAdjacentHTML(`beforeend`,e),document.body.classList.add(`unit-assign-open`),Nc(),requestAnimationFrame(()=>{document.querySelector(`[data-unit-assign-close]`)?.focus()})):document.body.classList.remove(`unit-assign-open`)}function Fc(){H.unitAssign?.escHandler&&H.unitAssign.escHandler(),H.unitAssign=null,document.querySelectorAll(`[data-unit-assign-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function Ic(e){let t=H.unitAssign;if(!t||t.saving)return;let n=t.students.filter(e=>e.selected);if(!n.length)return;let r=document.querySelector(`[data-unit-assign-error]`),i=()=>{t.saving=!1,e&&(e.disabled=!1,e.textContent=t.mode===`activate`?`Activar para ${n.length} ${n.length===1?`alumno`:`alumnos`}`:`Guardar cambios`)};r&&(r.hidden=!0,r.textContent=``),t.saving=!0,e&&(e.disabled=!0,e.textContent=`Guardando…`);let a=t.closesAt?`${t.closesAt}T23:59:59`:null;try{let e=t.assignmentId;if(t.mode===`activate`){if(!t.versionId)throw Error(`La unidad no tiene una versión publicada.`);let{data:n,error:r}=await B.from(`unit_assignments`).insert({group_id:t.groupId,unit_id:t.unitId,unit_version_id:t.versionId,status:`active`,visible:!0,opens_at:new Date().toISOString(),closes_at:a,created_by:H.profile?.id??null}).select(`id`).single();if(r)throw r;e=n.id}else{let{error:t}=await B.from(`unit_assignments`).update({closes_at:a}).eq(`id`,e);if(t)throw t}let r=t.students.filter(e=>!e.selected);if(r.length){let t=r.map(t=>({assignment_id:e,student_id:t.id,status:`closed`,created_by:H.profile?.id??null})),{error:n}=await B.from(`student_unit_overrides`).upsert(t,{onConflict:`assignment_id,student_id`});if(n)throw n}if(t.mode===`manage`&&n.length){let{error:t}=await B.from(`student_unit_overrides`).update({status:`active`}).eq(`assignment_id`,e).in(`student_id`,n.map(e=>e.id));if(t)throw t}let i=n.length;Fc(),K(t.mode===`activate`?`Unidad activada para ${i} ${i===1?`alumno`:`alumnos`}.`:`Alumnos de la unidad actualizados.`),await J(H.profile)}catch(e){i(),r&&(r.hidden=!1,r.textContent=e?.message||`No se pudo guardar la activación.`)}}function Lc(e){let[t,n]=String(e.dataset.activateUnit||``).split(`:`),r=e.dataset.unitGroup||e.closest(`[data-group-id]`)?.dataset.groupId||H.subjectsGroupId;!t||!n||!r||e.disabled?G(`No se pudo identificar la unidad o el grupo.`):(H.error=``,H.notice=``,jc({mode:`activate`,unitId:t,versionId:n,groupId:r}))}function Rc(e){let t=e.dataset.manageAssignment,n=e.dataset.unitGroup;t&&!e.disabled&&(H.error=``,H.notice=``,jc({mode:`manage`,assignmentId:t,groupId:n}))}async function zc(e,t){let n=e.dataset.closeAssignment||e.dataset.reopenAssignment;if(!n||e.disabled)return;let r=t===`active`;H.error=``,H.notice=``,e.disabled=!0,e.textContent=r?`Reabriendo…`:`Cerrando…`;try{let{error:e}=await B.from(`unit_assignments`).update({status:t,...r?{closes_at:null,opens_at:new Date().toISOString()}:{}}).eq(`id`,n);if(e)throw e;K(r?`Unidad reabierta. Los alumnos pueden continuar.`:`Unidad cerrada. El progreso de los alumnos se conserva.`),await J(H.profile)}catch(t){G(t?.message||`No se pudo ${r?`reabrir`:`cerrar`} la unidad.`),e.disabled=!1,e.textContent=r?`Reabrir`:`Cerrar`}}function Bc(e){return Array.isArray(e)?e.filter(Boolean).map(Vc).join(`, `):``}function Vc(e){return typeof e==`string`?e:e&&typeof e==`object`&&e.name?e.name:``}function Hc(e){let t=(Array.isArray(e)?e:[]).map(e=>({name:typeof e==`string`?e:e?.name,matches:Array.isArray(e?.matches)?e.matches.map(String):[]})).filter(e=>!!e.name),n={};for(let e of no)for(let t of e.tags)n[t]=(n[t]||0)+1;let r=t.map(e=>({...e,weight:e.matches.reduce((e,t)=>e+1/(n[t]||1),0)})).sort((e,t)=>t.weight-e.weight||e.name.localeCompare(t.name)),i=r[0]?.weight||1;return r.map(e=>({name:e.name,matches:e.matches,score:Math.round(e.weight/i*100)}))}function Uc(e){return`<div class="ficha-loading"><span class="spinner" aria-hidden="true"></span><span>${W(e)}</span></div>`}function Wc(e,t,n,r,i){return`
    <div class="ficha-stat ${W(r||``)}">
      <span class="ficha-stat-icon" aria-hidden="true">${e}</span>
      <div class="ficha-stat-copy">
        <strong data-ficha-stat="${W(i)}">${W(t)}</strong>
        <small data-ficha-stat-label="${W(i)}">${W(n)}</small>
      </div>
    </div>
  `}function Gc(e){let t=Math.max(0,Math.min(100,Math.round(Number(e)||0))),n=2*Math.PI*42,r=n*(1-t/100);return`
    <div class="ficha-ring ${ds(t)}" role="img" aria-label="Score general ${t} de 100">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle class="ring-track" cx="50" cy="50" r="42" />
        <circle class="ring-fill" cx="50" cy="50" r="42" style="--dash:${n.toFixed(2)};--offset:${r.toFixed(2)}" />
      </svg>
      <div class="ficha-ring-center"><strong>${t}</strong><small>/100</small></div>
    </div>
  `}function Kc(e){return e.length?`
    <div class="ficha-subject-list">
      ${e.map(e=>{let t=e.total?Math.round(e.done/e.total*100):0;return`
          <div class="ficha-subject">
            <div class="ficha-subject-head">
              <strong>${W(e.subject)}</strong>
              <span>${e.done}/${e.total} · ${t}%</span>
            </div>
            <div class="ficha-bar" aria-hidden="true">
              <div class="ficha-bar-fill" style="--bar-color:${W(e.color||`var(--brand)`)};--bar-scale:${(t/100).toFixed(3)}"></div>
            </div>
            <div class="ficha-subject-meta">
              ${e.accuracy==null?`Sin precisión registrada`:`🎯 ${e.accuracy}% precisión`}
              · ${e.done===e.total?`materia completa`:`${e.total-e.done} por completar`}
            </div>
          </div>
        `}).join(``)}
    </div>
  `:`<p class="ficha-empty">Sin avance registrado todavía. Cuando empiece una unidad aparecerá aquí.</p>`}function qc(e){return e?`
    <article class="ficha-card ficha-focus">
      <span class="card-label">Siguiente paso</span>
      <h3>⏭️ ${W(e)}</h3>
      <p class="card-sub">Recomendación: abrir esta unidad en la siguiente sesión y revisar los ejercicios con menor precisión.</p>
      <span class="ficha-focus-chip">Enfoque sugerido</span>
    </article>
  `:`
      <article class="ficha-card ficha-focus ficha-focus-done">
        <span class="card-label">Siguiente paso</span>
        <h3>🎉 ¡Al día!</h3>
        <p class="card-sub">No le falta ninguna unidad por empezar. Aprovecha para reforzar las materias con menor precisión.</p>
      </article>
    `}function Jc(e){return new Map((e.board||[]).map(e=>[e.id,e.name]))}function Yc(e,t){let n=Array.isArray(t?.units)?t.units:[],r=Jc(e);return n.length?`
    <div class="ficha-unit-list">
      ${n.map(e=>{let t=e.status||`not_started`,n=t===`completed`||t===`mastered`?`success`:t===`in_progress`?`pill-blue`:``;return`
          <div class="ficha-unit-row">
            <div class="ficha-unit-main">
              <strong>${W(e.unit||`Unidad`)}</strong>
              <small>${W(r.get(e.subject)||`Materia`)} · ${e.attempts||0} intentos${e.accuracy==null?``:` · 🎯 ${Math.round(e.accuracy)}%`}</small>
            </div>
            <span class="pill ${n}">${W(Ga[t]||t)}</span>
            <small class="ficha-unit-when">${e.last?W(Z(e.last)):`Sin actividad`}</small>
          </div>
        `}).join(``)}
    </div>
  `:`<p class="ficha-empty">Este alumno no tiene unidades asignadas.</p>`}function Xc(e,t,n){let r=Array.isArray(n?.recent)?n.recent:[],i=(e.overview?.recent||[]).filter(e=>e.student===t.student_code).map(e=>({ts:e.ts,kind:e.kind===`completed`?`unidad`:`ejercicio`,text:e.text,ok:e.ok})),a=[...r,...i].filter(e=>e.ts).sort((e,t)=>new Date(t.ts)-new Date(e.ts)).slice(0,10);return a.length?`
    <div class="ficha-timeline">
      ${a.map(e=>{let t=e.kind===`quiz`?`🧠`:e.kind===`unidad`?`📚`:`✏️`;return`
          <div class="ficha-timeline-item">
            <span class="ficha-timeline-dot ${e.ok?`ok`:`bad`}" aria-hidden="true">${e.ok?`✓`:`✗`}</span>
            <div class="ficha-timeline-copy">
              <strong>${W(e.text)}</strong>
              <small>${W(Z(e.ts))}</small>
            </div>
            <span class="ficha-timeline-emoji" aria-hidden="true">${t}</span>
          </div>
        `}).join(``)}
    </div>
  `:`<p class="ficha-empty">Sin actividad registrada todavía.</p>`}function Zc(e,t){let n=Array.isArray(t)?t.map(Vc).filter(Boolean):[];return n.length?`
    <div class="ficha-tag-group">
      <span class="card-label">${W(e)}</span>
      <div class="ficha-tags">
        ${n.map(e=>`<span class="ficha-tag">${W(e)}</span>`).join(``)}
      </div>
    </div>
  `:``}function Qc(e){let t=e.personality&&typeof e.personality==`object`?e.personality:null,n=e.aptitude&&typeof e.aptitude==`object`?e.aptitude:null,r=!!t?.completed_at,i=!!n?.completed_at,a=t?.scores||{},o=Array.isArray(n?.career_suggestions)?n.career_suggestions:[],s=Array.isArray(n?.interests)?n.interests:[];return`
    <div class="ficha-test-results">
      <article class="ficha-card">
        <div class="ficha-card-head">
          <div>
            <h3>🧠 Test de personalidad</h3>
            <p class="card-sub">${r?`Respondido ${W(Z(t.completed_at))}`:`El alumno todavía no ha respondido este test.`}</p>
          </div>
          <span class="pill ${r?`success`:``}">${r?`Completado`:`Pendiente`}</span>
        </div>
        ${r?`
          <div class="test-score-list">
            ${Object.entries($a).map(([e,t])=>{let n=Number(a[e]??0);return`
                <div class="test-score">
                  <div class="test-score-head">
                    <span>${t.emoji} ${W(t.label)}</span>
                    <strong>${n}%</strong>
                  </div>
                  <div class="ficha-bar" aria-hidden="true">
                    <div class="ficha-bar-fill" style="--bar-color:${n>=70?`var(--good)`:n>=40?`var(--brand)`:`var(--amber)`};--bar-scale:${(Math.max(0,Math.min(100,n))/100).toFixed(3)}"></div>
                  </div>
                </div>
              `}).join(``)}
          </div>
        `:`<p class="ficha-empty">Cuando lo complete, aquí verás sus rasgos principales.</p>`}
      </article>

      <article class="ficha-card">
        <div class="ficha-card-head">
          <div>
            <h3>🧭 Orientación vocacional</h3>
            <p class="card-sub">${i?`Respondido ${W(Z(n.completed_at))}`:`El alumno todavía no ha respondido este test.`}</p>
          </div>
          <span class="pill ${i?`success`:``}">${i?`Completado`:`Pendiente`}</span>
        </div>
        ${i?`
          ${o.length?`
            <div class="test-career-results">
              ${Hc(o).slice(0,6).map(e=>`
                  <div class="test-career-row">
                    <div>
                      <strong>${W(e.name)}</strong>
                      <small>${e.matches.map(e=>W(e)).join(` · `)||`Coincide con su perfil`}</small>
                    </div>
                    <div class="test-career-score">
                      <div class="ficha-bar" aria-hidden="true">
                        <div class="ficha-bar-fill" style="--bar-color:var(--brand-2);--bar-scale:${(Math.max(0,Math.min(100,e.score))/100).toFixed(3)}"></div>
                      </div>
                      <strong>${e.score}%</strong>
                    </div>
                  </div>
                `).join(``)}
            </div>
          `:``}
          ${s.length?`
            <div class="test-summary-block">
              <span class="card-label">Intereses detectados</span>
              <div class="ficha-tags">${s.slice(0,12).map(e=>`<span class="ficha-tag">${W(e)}</span>`).join(``)}</div>
            </div>
          `:``}
        `:`<p class="ficha-empty">Cuando lo complete, aquí verás sus intereses y carreras sugeridas.</p>`}
      </article>
    </div>
  `}function $c(e,t){let n=[[`Carreras sugeridas`,t.career_suggestions],[`Intereses`,t.interests],[`Aptitudes`,t.aptitudes],[`Fortalezas`,t.strengths],[`Áreas a trabajar`,t.weaknesses]].map(([e,t])=>Zc(e,t)).filter(Boolean).join(``);return`
    <div class="ficha-profile-summary">
      <div class="ficha-profile-career">
        <span class="card-label">Meta vocacional</span>
        <h3>${W(t.career_choice||`Aún sin definir`)}</h3>
        <p class="card-sub">${t.career_choice?`Carrera objetivo registrada para orientar su ruta.`:`Define la carrera que quiere estudiar para personalizar el acompañamiento.`}</p>
      </div>
      ${n?`<div class="ficha-tag-groups">${n}</div>`:`<p class="ficha-empty">Todavía no hay intereses ni aptitudes registradas.</p>`}
    </div>

    ${Qc(t)}

    <form class="form ficha-profile-form" data-save-profile="${W(e.id)}">
      <div class="ficha-form-grid">
        <label class="field"><span>Carrera que quiere</span><input name="career_choice" value="${W(t.career_choice||``)}" placeholder="ej. Medicina"></label>
        <label class="field"><span>Áreas a trabajar (separadas por coma)</span><input name="weaknesses" value="${W(Bc(t.weaknesses))}" placeholder="organización, ansiedad…"></label>
        <label class="field wide"><span>Notas de orientación vocacional</span><textarea name="vocational_notes" placeholder="Acuerdos, seguimiento y observaciones de orientación…">${W(t.vocational_notes||``)}</textarea></label>
      </div>
      <p class="hint">🔒 Carreras sugeridas, intereses, aptitudes y fortalezas salen de los tests del alumno; no se editan a mano.</p>
      <div class="ficha-form-actions">
        <button class="btn primary" type="submit">Guardar perfil profesional</button>
      </div>
    </form>
  `}function el(e){return`
    <div class="ficha-observations-layout">
      <article class="ficha-card">
        <div class="ficha-card-head">
          <div><h3>✍️ Nueva observación</h3><p class="card-sub">Registra acuerdos, avances o situaciones a dar seguimiento.</p></div>
        </div>
        <form class="form" data-add-observation="${W(e.id)}">
          <div class="ficha-form-grid">
            <label class="field">
              <span>Categoría</span>
              <select name="category">
                <option value="">General</option>
                <option value="académico">Académico</option>
                <option value="conducta">Conducta</option>
                <option value="emocional">Emocional</option>
                <option value="vocacional">Vocacional</option>
                <option value="asistencia">Asistencia</option>
              </select>
            </label>
            <label class="field">
              <span>Visible para</span>
              <select name="visibility">
                <option value="internal">Solo personal</option>
                <option value="family">Personal y tutor</option>
              </select>
            </label>
            <label class="field wide"><span>Observación</span><textarea name="body" required placeholder="Escribe la observación…"></textarea></label>
          </div>
          <div class="ficha-form-actions">
            <button class="btn primary" type="submit">Agregar observación</button>
          </div>
        </form>
      </article>

      <article class="ficha-card">
        <div class="ficha-card-head">
          <div><h3>📝 Historial</h3><p class="card-sub">Observaciones internas y compartidas con el tutor.</p></div>
        </div>
        <div data-observations-list="${W(e.id)}">${Uc(`Cargando observaciones…`)}</div>
      </article>
    </div>
  `}function tl(e,t,n=null){let r=e.studentProfiles?.get(t.id)||{},i=fs(e,t.student_code),a=ps(e,t.student_code),o=(e.overview?.scores?.students||[]).find(e=>e.code===t.student_code)||{},s=n?.stats||{},c=Number(o.score??0),l=Number(s.xp??o.xp??t.stats?.xp_total??0),u=Number(s.streak??t.stats?.current_streak??0),d=Number(s.best??t.stats?.best_streak??0),f=Number(s.units??o.units_done??t.stats?.units_completed??0),p=Number(o.units_total??e.overview?.published_units_total??0),m=s.accuracy??o.accuracy??null,h=Number(o.absences??0),g=s.last||t.stats?.last_activity_date||null,_=(t.full_name||`A`).trim().slice(0,1).toUpperCase(),v=t.status||`active`,y=v===`active`?`Activa`:v===`inactive`?`Inactiva`:v;return`
    <div class="ficha-overlay" data-ficha-overlay>
      <section class="ficha-dialog" role="dialog" aria-modal="true" aria-labelledby="ficha-title" data-ficha-dialog="${W(t.id)}" data-detail-loaded="${n?`1`:`0`}">
        <button type="button" class="ficha-close" data-ficha-close aria-label="Cerrar ficha">✕</button>

        <header class="ficha-hero">
          <div class="ficha-hero-main">
            <div class="ficha-avatar" aria-hidden="true">${W(_)}</div>
            <div class="ficha-identity">
              <span class="ficha-eyebrow">Ficha del alumno</span>
              <h2 id="ficha-title">${W(t.full_name||`Alumno sin nombre`)}</h2>
              <div class="ficha-meta">
                <span class="ficha-chip">🎓 ${W(t.student_code||`—`)}</span>
                <span class="ficha-chip">👥 ${W(t.group_name||`Sin grupo`)}</span>
                <span class="ficha-chip ${v===`active`?`success`:``}">${W(y)}</span>
              </div>
            </div>
          </div>
          <div class="ficha-score">
            ${Gc(c)}
            <span>Score general</span>
            <small data-ficha-last>${g?`Última actividad ${W(Z(g))}`:`Sin actividad registrada`}</small>
          </div>
        </header>

        <div class="ficha-stat-grid">
          ${Wc(`⚡`,l.toLocaleString(`es-MX`),`XP acumulados`,`violet`,`xp`)}
          ${Wc(`🔥`,u,d?`Racha actual · récord ${d}`:`Racha actual`,`amber`,`streak`)}
          ${Wc(`📚`,p?`${f}/${p}`:f,`Unidades completadas`,`blue`,`units`)}
          ${Wc(`🎯`,m==null?`—`:`${Math.round(m)}%`,`Precisión en ejercicios`,`green`,`accuracy`)}
          ${Wc(`🗓️`,h,`Faltas registradas`,h?`red`:`green`,`absences`)}
        </div>

        <nav class="ficha-tabs" role="tablist" aria-label="Secciones de la ficha">
          <button type="button" class="ficha-tab active" data-ficha-tab="resumen" role="tab" aria-selected="true" aria-controls="ficha-panel-resumen">📊 Avance</button>
          <button type="button" class="ficha-tab" data-ficha-tab="perfil" role="tab" aria-selected="false" aria-controls="ficha-panel-perfil">🧭 Perfil profesional</button>
          <button type="button" class="ficha-tab" data-ficha-tab="observaciones" role="tab" aria-selected="false" aria-controls="ficha-panel-observaciones">📝 Observaciones</button>
        </nav>

        <div class="ficha-body">
          <section class="ficha-panel" data-ficha-panel="resumen" id="ficha-panel-resumen" role="tabpanel">
            <div class="ficha-overview-grid">
              <article class="ficha-card">
                <div class="ficha-card-head">
                  <div><h3>📚 Cómo va por materia</h3><p class="card-sub">Avance sobre las unidades publicadas de cada materia.</p></div>
                </div>
                ${Kc(i)}
              </article>

              ${qc(a)}

              <article class="ficha-card ficha-span-2">
                <div class="ficha-card-head">
                  <div><h3>🧩 Unidades asignadas</h3><p class="card-sub">Estatus, intentos y precisión por unidad.</p></div>
                </div>
                <div data-ficha-units>${n?Yc(e,n):Uc(`Cargando unidades…`)}</div>
              </article>

              <article class="ficha-card ficha-span-2">
                <div class="ficha-card-head">
                  <div><h3>🕒 Actividad reciente</h3><p class="card-sub">Últimos ejercicios y quizzes registrados.</p></div>
                </div>
                <div data-ficha-activity>${n?Xc(e,t,n):Uc(`Cargando actividad…`)}</div>
              </article>
            </div>
          </section>

          <section class="ficha-panel hidden" data-ficha-panel="perfil" id="ficha-panel-perfil" role="tabpanel">
            <div data-ficha-profile-panel>${$c(t,r)}</div>
          </section>

          <section class="ficha-panel hidden" data-ficha-panel="observaciones" id="ficha-panel-observaciones" role="tabpanel">
            ${el(t)}
          </section>
        </div>
      </section>
    </div>
  `}function nl(e,t=`ok`){if(!document.querySelector(`.ficha-dialog`)){t===`error`?G(e):K(e);return}let n=document.querySelector(`[data-ficha-toast]`);n||(n=document.createElement(`div`),n.dataset.fichaToast=``,document.body.appendChild(n)),n.className=`ficha-toast ${t}`,n.textContent=e,clearTimeout(n._hideTimer),n._hideTimer=setTimeout(()=>n.remove(),4200)}function rl(e,t=document){let n=t.querySelector(`[data-save-profile="${e}"]`);n&&n.addEventListener(`submit`,t=>ll(t,e))}function il(e){let t=document.querySelector(`[data-ficha-overlay]`);if(!t)return;let n=()=>al();t.querySelectorAll(`[data-ficha-close]`).forEach(e=>{e.addEventListener(`click`,n)}),t.addEventListener(`click`,e=>{e.target===t&&n()}),t.querySelectorAll(`[data-ficha-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{let n=e.dataset.fichaTab;t.querySelectorAll(`[data-ficha-tab]`).forEach(t=>{let n=t===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,String(n))}),t.querySelectorAll(`[data-ficha-panel]`).forEach(e=>{e.classList.toggle(`hidden`,e.dataset.fichaPanel!==n)})})}),rl(e,t);let r=t.querySelector(`[data-add-observation="${e}"]`);r&&r.addEventListener(`submit`,t=>dl(t,e)),H.fichaEscHandler=po(t,n),ul(e)}function al({silent:e=!1}={}){let t=document.querySelector(`[data-ficha-overlay]`);t&&t.remove(),document.querySelectorAll(`[data-ficha-toast]`).forEach(e=>e.remove()),document.body.classList.remove(`ficha-open`),H.fichaEscHandler&&=(H.fichaEscHandler(),null);let n=H.fichaTrigger;H.fichaStudentId=null,H.fichaTrigger=null,!e&&n?.isConnected&&n.focus()}function ol(e,t=null){let n=H.dashboard,r=(n?.students||[]).find(t=>t.id===e);r&&(al({silent:!0}),H.fichaStudentId=e,H.fichaTrigger=t,document.body.insertAdjacentHTML(`beforeend`,tl(n,r)),document.body.classList.add(`ficha-open`),il(e),cl(e),requestAnimationFrame(()=>{document.querySelector(`[data-ficha-close]`)?.focus()}))}function sl(e,t,n){let r=[...document.querySelectorAll(`[data-ficha-dialog]`)].find(e=>e.dataset.fichaDialog===t.id);if(!r)return;let i=n?.stats||{},a=(e.overview?.scores?.students||[]).find(e=>e.code===t.student_code)||{},o=Number(a.units_total??e.overview?.published_units_total??0),s=(e,t)=>{let n=r.querySelector(`[data-ficha-stat="${e}"]`);n&&(n.textContent=t)};s(`xp`,Number(i.xp??a.xp??0).toLocaleString(`es-MX`)),s(`streak`,String(i.streak??0)),i.best!=null&&((e,t)=>{let n=r.querySelector(`[data-ficha-stat-label="${e}"]`);n&&(n.textContent=t)})(`streak`,`Racha actual · récord ${i.best}`),s(`units`,o?`${i.units??0}/${o}`:String(i.units??0)),s(`accuracy`,i.accuracy==null?`—`:`${Math.round(i.accuracy)}%`);let c=r.querySelector(`[data-ficha-last]`);c&&(c.textContent=i.last?`Última actividad ${Z(i.last)}`:`Sin actividad registrada`);let l=r.querySelector(`[data-ficha-units]`);l&&(l.innerHTML=Yc(e,n));let u=r.querySelector(`[data-ficha-activity]`);u&&(u.innerHTML=Xc(e,t,n)),r.dataset.detailLoaded=`1`}async function cl(e){let{data:t,error:n}=await B.rpc(`app_student_detail`,{p_student_id:e}),r=[...document.querySelectorAll(`[data-ficha-dialog]`)].find(t=>t.dataset.fichaDialog===e);if(!r)return;if(n||!t){let e=`No se pudo cargar el detalle: ${n?.message||`error`}`,t=r.querySelector(`[data-ficha-units]`),i=r.querySelector(`[data-ficha-activity]`);t&&(t.innerHTML=`<p class="ficha-empty">${W(e)}</p>`),i&&(i.innerHTML=`<p class="ficha-empty">${W(e)}</p>`);return}let i=(H.dashboard?.students||[]).find(t=>t.id===e);i&&sl(H.dashboard,i,t)}async function ll(e,t){e.preventDefault();let n=e.currentTarget,r=new FormData(n),i=e=>String(e||``).split(`,`).map(e=>e.trim()).filter(Boolean),a=e=>{let t=String(e||``).trim();if(!t)return{};try{let e=JSON.parse(t);return e&&typeof e==`object`?e:{nota:t}}catch{return{nota:t}}},o={student_id:t,career_choice:String(r.get(`career_choice`)||``).trim()||null,weaknesses:i(r.get(`weaknesses`)),vocational_notes:String(r.get(`vocational_notes`)||``).trim()||null,updated_at:new Date().toISOString()};r.has(`career_suggestions`)&&(o.career_suggestions=i(r.get(`career_suggestions`))),r.has(`interests`)&&(o.interests=i(r.get(`interests`))),r.has(`aptitudes`)&&(o.aptitudes=i(r.get(`aptitudes`))),r.has(`strengths`)&&(o.strengths=i(r.get(`strengths`))),r.has(`personality`)&&(o.personality=a(r.get(`personality`))),r.has(`aptitude`)&&(o.aptitude=a(r.get(`aptitude`))),H.error=``,H.notice=``;let s=n.querySelector(`button[type="submit"]`);s&&(s.disabled=!0);let{error:c}=await B.from(`student_profiles`).upsert(o,{onConflict:`student_id`});if(s&&(s.disabled=!1),c){nl(c?.message||`No se pudo guardar el perfil profesional.`,`error`);return}if(H.dashboard?.studentProfiles){let e=H.dashboard.studentProfiles.get(t)||{};H.dashboard.studentProfiles.set(t,{...e,...o})}let l=document.querySelector(`[data-ficha-profile-panel]`),u=(H.dashboard?.students||[]).find(e=>e.id===t);l&&u&&H.dashboard?.studentProfiles&&(l.innerHTML=$c(u,H.dashboard.studentProfiles.get(t)||{}),rl(t,l)),nl(`Perfil profesional guardado.`,`ok`)}async function ul(e){let t=document.querySelector(`[data-observations-list="${e}"]`);if(!t)return;let{data:n,error:r}=await B.from(`observations`).select(`id,category,body,visibility,created_at,author_id`).eq(`student_id`,e).is(`deleted_at`,null).order(`created_at`,{ascending:!1});t.innerHTML=r||!n?.length?r?`<p class="ficha-empty">No se pudieron cargar las observaciones: ${W(r.message||`error`)}</p>`:`<p class="ficha-empty">Sin observaciones todavía. La primera que registres aparecerá aquí.</p>`:`
    <div class="ficha-observation-list">
      ${n.map(e=>`
        <article class="ficha-observation">
          <div class="ficha-observation-head">
            <span class="ficha-chip">${W(e.category||`General`)}</span>
            <span class="ficha-chip ${e.visibility===`family`?`success`:``}">${e.visibility===`family`?`👨‍👩‍👧 Tutor`:`🔒 Interno`}</span>
            <small>${W(Z(e.created_at))}</small>
          </div>
          <p>${W(e.body)}</p>
        </article>
      `).join(``)}
    </div>
  `}async function dl(e,t){e.preventDefault();let n=e.currentTarget,r=new FormData(n),i=String(r.get(`category`)||``).trim(),a=String(r.get(`body`)||``).trim(),o=String(r.get(`visibility`)||`internal`);if(!a)return;let s=n.querySelector(`button[type="submit"]`);s&&(s.disabled=!0),H.error=``,H.notice=``;let{error:c}=await B.from(`observations`).insert({student_id:t,author_id:H.profile?.id??null,category:i||null,body:a,visibility:o});c?(nl(c?.message||`No se pudo guardar la observación.`,`error`),s&&(s.disabled=!1)):(n.reset(),s&&(s.disabled=!1),await ul(t),nl(`Observación guardada.`,`ok`))}async function fl(e){let t=e.dataset.saveGrade,n=e.dataset.student,r=e.closest(`.assessment-box`)?.querySelector(`[data-grade-student="${n}"]`);if(!t||!n||!r||e.disabled)return;let i=r.value.trim(),a=i===``?null:Number(i);if(a!==null&&(Number.isNaN(a)||a<0)){G(`El puntaje debe ser un número válido.`);return}H.error=``,H.notice=``,e.disabled=!0,e.textContent=`…`;let{error:o}=await B.from(`grades`).upsert({assessment_id:t,student_id:n,score:a,status:a===null?`pending`:`recorded`,recorded_by:H.profile?.id??null,recorded_at:new Date().toISOString()},{onConflict:`assessment_id,student_id`});o?(G(o?.message||`No se pudo guardar la calificación.`),e.disabled=!1,e.textContent=`Guardar`):(K(`Calificación guardada.`),e.disabled=!1,e.textContent=`Guardar`)}async function pl(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=t.dataset.createAssessment,i=t.dataset.group,a=String(n.get(`name`)||``).trim(),o=String(n.get(`type`)||`other`),s=Number(n.get(`max_score`)||0),c=String(n.get(`assessment_date`)||``).trim()||null,l=String(n.get(`term_id`)||``);if(!a||!s||s<=0||!i){G(`Completa nombre, puntaje máximo y grupo.`);return}if(l||=H.dashboard?.terms?.[0]?.id,!l){G(`No hay un trimestre configurado para esta evaluación.`);return}let u=t.querySelector(`button[type="submit"]`);u&&(u.disabled=!0),H.error=``,H.notice=``;let{error:d}=await B.from(`assessments`).insert({group_id:i,subject_id:r,term_id:l,name:a,type:o,max_score:s,assessment_date:c,created_by:H.profile?.id??null});d?(G(d?.message?.includes(`duplicate`)||d?.code===`23505`?`Ya existe una evaluación con ese nombre en la materia.`:d?.message||`No se pudo crear la evaluación.`),u&&(u.disabled=!1)):(K(`Evaluación creada. Ahora puedes calificar a cada alumno.`),await J(H.profile))}async function ml(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=String(n.get(`group_id`)||``),i=String(n.get(`subject_id`)||``),a=String(n.get(`unit_id`)||``).trim(),o=String(n.get(`title`)||``).trim(),s=String(n.get(`instructions`)||``).trim(),c=String(n.get(`task_type`)||`project`),l=Number(n.get(`max_score`)||0),u=String(n.get(`due_at`)||``).trim();if(!r||!i||!o||!l||l<=0){G(`Completa grupo, materia, título y puntaje máximo.`);return}let d=t.querySelector(`button[type="submit"]`);d&&(d.disabled=!0,d.textContent=`Creando…`),H.error=``,H.notice=``;let{error:f}=await B.from(`tasks`).insert({group_id:r,subject_id:i,unit_id:a||null,title:o,instructions:s||null,task_type:c,due_at:u?new Date(u).toISOString():null,max_score:l,created_by:H.profile?.id??null});f?(G(f?.message||`No se pudo crear la tarea.`),d&&(d.disabled=!1,d.textContent=`Crear tarea`)):(K(`Tarea creada. Ya puedes registrar entregas y calificaciones.`),await hl(),await gl().catch(()=>{}),$())}async function hl(){let{data:e,error:t}=await B.rpc(`app_staff_tasks`);if(t)throw t;H.dashboard&&(H.dashboard.tasks=(e||{}).tasks||[])}async function gl(){let{data:e,error:t}=await B.rpc(`app_activity_log`,{p_limit:80});if(t)throw t;H.dashboard&&(H.dashboard.activity=(e||{}).entries||[])}async function _l(e){let t=e.closest(`[data-task-row]`);if(!t)return;let n=t.dataset.taskId,r=t.dataset.studentId,i=t.dataset.status||`pending`,a=t.querySelector(`[data-task-score]`),o=String(a?.value||``).trim(),s=o===``?null:Number(o),c=Number(a?.max||0);if(s!==null&&Number.isNaN(s)){G(`El puntaje debe ser un número.`);return}if(s!==null&&c&&s>c){G(`El puntaje no puede superar ${c}.`);return}e.disabled=!0;let l=e.textContent;e.textContent=`…`,H.error=``,H.notice=``;let u=i===`pending`?null:new Date().toISOString(),{error:d}=await B.from(`task_submissions`).upsert({task_id:n,student_id:r,status:i,score:s,submitted_at:u,recorded_by:H.profile?.id??null,updated_at:new Date().toISOString()},{onConflict:`task_id,student_id`});if(d){G(d?.message||`No se pudo guardar la entrega.`),e.disabled=!1,e.textContent=l;return}let f=(H.dashboard?.tasks||[]).find(e=>e.id===n);if(f){let e=(f.submissions||[]).find(e=>e.student_id===r);e&&(e.status=i,e.score=s,e.submitted_at=u,e.updated_at=new Date().toISOString());let t=(f.submissions||[]).filter(e=>e.status===`submitted`||e.status===`late`).length,a=U.querySelector(`[data-task-count="${n}"]`);a&&(a.textContent=`${t}/${(f.submissions||[]).length} entregadas`)}await gl().catch(()=>{}),e.disabled=!1,e.textContent=`✓ Guardado`,window.setTimeout(()=>{e.textContent=l},1600)}async function vl(e,t){let n=U.querySelector(`[data-history-box="${e}"]`);if(!n)return;if(!n.classList.contains(`hidden`)){n.classList.add(`hidden`),t.textContent=`Ver historial`;return}n.classList.remove(`hidden`),t.textContent=`Ocultar historial`,n.innerHTML=`<div class="spinner" aria-hidden="true"></div>`;let r=(H.dashboard?.groups||[]).find(t=>t.id===e)?.students||[],{data:i,error:a}=await B.from(`attendance_sessions`).select(`id,session_date`).eq(`group_id`,e).order(`session_date`,{ascending:!1}).limit(12);if(a||!i?.length){n.innerHTML=`<p class="empty-state">Todavía no hay sesiones de asistencia registradas.</p>`;return}let o=i.map(e=>e.id),{data:s,error:c}=await B.from(`attendance`).select(`session_id,student_id,status`).in(`session_id`,o);if(c){n.innerHTML=`<p class="empty-state">No se pudo cargar el historial.</p>`;return}let l={present:`✅`,late:`⏰`,excused:`✳️`,absent:`❌`},u=new Map;for(let e of r)u.set(e.id,{name:e.full_name,code:e.student_code,cells:new Map,absences:0});for(let e of s||[]){let t=u.get(e.student_id);t&&(t.cells.set(e.session_id,e.status),e.status===`absent`&&(t.absences+=1))}n.innerHTML=`
    <table class="attendance-history-table">
      <thead>
        <tr>
          <th>Alumno</th>
          ${i.map(e=>`<th>${W(X(String(e.session_date).slice(0,10)))}</th>`).join(``)}
          <th>Faltas</th>
        </tr>
      </thead>
      <tbody>
        ${[...u.values()].map(e=>`
          <tr>
            <td><strong>${W(e.name)}</strong><div class="muted"><small>${W(e.code)}</small></div></td>
            ${i.map(t=>`<td>${l[e.cells.get(t.id)]||`·`}</td>`).join(``)}
            <td>${e.absences}</td>
          </tr>
        `).join(``)}
      </tbody>
    </table>
    <p class="muted"><small>✅ presente · ⏰ tarde · ✳️ justificado · ❌ falta · · sin registro</small></p>
  `}function $(){al({silent:!0}),rc({silent:!0}),Fc(),Ns(),U.innerHTML=uc(H.profile),U.querySelector(`#logout-btn`).addEventListener(`click`,zl),U.querySelectorAll(`[data-open-unit]`).forEach(e=>{e.addEventListener(`click`,()=>Ec(e.dataset.openUnit))}),U.querySelectorAll(`[data-consent-ack]`).forEach(e=>{e.addEventListener(`change`,()=>{U.querySelectorAll(`[data-consent-student]`).forEach(t=>{t.disabled=!e.checked})})}),U.querySelectorAll(`[data-consent-student]`).forEach(e=>{e.addEventListener(`click`,()=>Ll(e.dataset.consentStudent,e))}),U.querySelectorAll(`[data-revoke-consent]`).forEach(e=>{e.addEventListener(`click`,()=>{Rl(e.dataset.revokeConsent,e.dataset.revokeName||``,e)})}),U.querySelectorAll(`[data-invite-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=U.querySelector(`[data-invite-form="${e.dataset.inviteToggle}"]`);t&&t.classList.toggle(`hidden`)})}),U.querySelectorAll(`[data-invite-cancel]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=U.querySelector(`[data-invite-form="${e.dataset.inviteCancel}"]`);t&&t.classList.add(`hidden`)})}),U.querySelectorAll(`[data-invite-form]`).forEach(e=>{e.addEventListener(`submit`,Il)}),U.querySelectorAll(`[data-staff-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{H.staffTab=e.dataset.staffTab,H.error=``,H.notice=``,$()})}),U.querySelectorAll(`[data-pagination]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.page);!Number.isFinite(t)||t<1||(e.dataset.pagination===`payments`&&(H.paymentsPage=t),$(),U.querySelector(`[data-pagination]`)?.scrollIntoView({block:`nearest`}))})}),U.querySelectorAll(`[data-ficha-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>ol(e.dataset.fichaToggle,e))}),U.querySelectorAll(`[data-toggle-grades]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=U.querySelector(`[data-grades-editor="${e.dataset.toggleGrades}"]`);t&&t.classList.toggle(`hidden`)})}),U.querySelectorAll(`[data-save-grade]`).forEach(e=>{e.addEventListener(`click`,()=>fl(e))}),U.querySelectorAll(`[data-create-assessment]`).forEach(e=>{e.addEventListener(`submit`,pl)}),U.querySelectorAll(`[data-history-open]`).forEach(e=>{e.addEventListener(`click`,()=>vl(e.dataset.historyOpen,e))});let e=U.querySelector(`#create-teacher-form`);e&&e.addEventListener(`submit`,yl),U.querySelectorAll(`[data-invite-student-form]`).forEach(e=>{e.addEventListener(`submit`,t=>{Dl(t,e.querySelector(`[data-invite-groups]`)?.value||e.dataset.inviteGroupDefault||``)})}),U.querySelectorAll(`[data-copy-invitation]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.closest(`[data-student-invitation]`)?.querySelector(`[data-invitation-url]`);if(t)try{await navigator.clipboard.writeText(t.value),e.textContent=`Copiado ✓`,setTimeout(()=>{e.textContent=`Copiar enlace`},2e3)}catch{t.select(),e.textContent=`Copia manual`}})}),U.querySelectorAll(`[data-dismiss-invitation]`).forEach(e=>{e.addEventListener(`click`,()=>{H.studentInvitation=null,$()})}),U.querySelectorAll(`[data-reset-student]`).forEach(e=>{e.addEventListener(`click`,()=>bl(e.dataset.resetStudent,e))}),U.querySelectorAll(`[data-reissue-invite]`).forEach(e=>{e.addEventListener(`click`,()=>Ol(e.dataset.reissueInvite,e))}),U.querySelectorAll(`[data-toggle-user]`).forEach(e=>{e.addEventListener(`click`,()=>xl(e))}),U.querySelectorAll(`[data-ban-account]`).forEach(e=>{e.addEventListener(`click`,()=>Sl(e))}),U.querySelectorAll(`[data-save-setting]`).forEach(e=>{e.addEventListener(`click`,()=>Cl(e.dataset.saveSetting,e))}),U.querySelectorAll(`[data-resolve-request]`).forEach(e=>{e.addEventListener(`click`,()=>$o(e))}),U.querySelectorAll(`[data-create-student-group]`).forEach(e=>{e.addEventListener(`submit`,t=>wl(t,e.dataset.createStudentGroup))});let t=U.querySelector(`#admin-create-student-form`);t&&t.addEventListener(`submit`,e=>{wl(e,t.querySelector(`[data-admin-groups]`)?.value)}),U.querySelectorAll(`[data-advise-student]`).forEach(e=>{e.addEventListener(`click`,()=>kl(e.dataset.adviseStudent))}),U.querySelectorAll(`[data-attendance-open]`).forEach(e=>{e.addEventListener(`click`,()=>jl(e.dataset.attendanceOpen))}),U.querySelectorAll(`[data-attendance-close]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=U.querySelector(`[data-attendance-area="${e.dataset.attendanceClose}"]`);t&&t.classList.add(`hidden`),e.style.display=`none`;let n=U.querySelector(`[data-attendance-open="${e.dataset.attendanceClose}"]`);n&&(n.style.display=``)})}),U.querySelectorAll(`[data-student-detail]`).forEach(e=>{e.addEventListener(`click`,()=>ol(e.dataset.studentDetail,e))}),U.querySelectorAll(`[data-start-test]`).forEach(e=>{e.addEventListener(`click`,()=>nc(e.dataset.startTest))}),U.querySelectorAll(`[data-activate-unit]`).forEach(e=>{e.addEventListener(`click`,()=>Lc(e))}),U.querySelectorAll(`[data-manage-assignment]`).forEach(e=>{e.addEventListener(`click`,()=>Rc(e))}),U.querySelectorAll(`[data-open-pay-dialog]`).forEach(e=>{e.addEventListener(`click`,()=>js(e.dataset.openPayDialog,e.dataset.payMode||`payment`))}),U.querySelectorAll(`[data-void-payment]`).forEach(e=>{e.addEventListener(`click`,()=>Ps(e))}),U.querySelectorAll(`[data-receipt-payment]`).forEach(e=>{e.addEventListener(`click`,()=>Fs(e.dataset.receiptPayment))});let n=U.querySelector(`[data-subjects-group]`);n&&n.addEventListener(`change`,()=>{H.subjectsGroupId=n.value,$()}),U.querySelectorAll(`[data-close-assignment]`).forEach(e=>{e.addEventListener(`click`,()=>zc(e,`closed`))}),U.querySelectorAll(`[data-reopen-assignment]`).forEach(e=>{e.addEventListener(`click`,()=>zc(e,`active`))});let r=U.querySelector(`#sidebar-toggle`);r&&r.addEventListener(`click`,()=>{H.sidebarCollapsed=!H.sidebarCollapsed,localStorage.setItem(`ecoems_sidebar`,H.sidebarCollapsed?`collapsed`:`open`);let e=U.querySelector(`.staff-app`);e&&e.classList.toggle(`collapsed`,H.sidebarCollapsed);let t=!H.sidebarCollapsed;r.setAttribute(`aria-expanded`,String(t)),r.title=t?`Ocultar menú`:`Mostrar menú`;let n=r.querySelector(`.nav-emoji`),i=r.querySelector(`.nav-text`);n&&(n.textContent=t?`«`:`»`),i&&(i.textContent=t?`Ocultar menú`:`Mostrar menú`)}),U.querySelectorAll(`[data-subject-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.subjectToggle;co(t);let n=e.closest(`.board-subject`);if(!n)return;let r=H.collapsedSubjects.has(t);n.classList.toggle(`collapsed`,r),e.setAttribute(`aria-expanded`,String(!r))})}),U.querySelectorAll(`[data-activity-filter]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.activityFilter;U.querySelectorAll(`[data-activity-filter]`).forEach(t=>{t.classList.toggle(`active`,t===e)}),U.querySelectorAll(`[data-activity-kind]`).forEach(e=>{e.classList.toggle(`hidden`,t!==`todo`&&e.dataset.activityKind!==t)})})});let i=U.querySelector(`#create-task-form`);i&&i.addEventListener(`submit`,ml),U.querySelectorAll(`[data-task-status]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`[data-task-row]`);t&&(t.dataset.status=e.dataset.taskStatus,t.querySelectorAll(`[data-task-status]`).forEach(t=>{t.classList.toggle(`active`,t===e)}))})}),U.querySelectorAll(`[data-save-task-submission]`).forEach(e=>{e.addEventListener(`click`,()=>_l(e))}),yo()}async function yl(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=String(n.get(`full_name`)||``).trim(),i=String(n.get(`email`)||``).trim().toLowerCase(),a=String(n.get(`password`)||``);if(!r||!i||a.length<12||!/[a-z]/.test(a)||!/[A-Z]/.test(a)||!/\d/.test(a)){G(`Completa los datos: nombre, correo y contraseña de al menos 12 caracteres con mayúscula, minúscula y número.`);return}let o=t.querySelector(`button[type="submit"]`);o.disabled=!0,o.textContent=`Creando…`,H.error=``,H.notice=``;try{let{data:e,error:n}=await B.functions.invoke(`admin-create-teacher`,{body:{full_name:r,email:i,password:a}});if(n)throw n;if(!e?.ok)throw Error(e?.error||`No se pudo crear el profesor`);K(`Profesor ${e.profile.full_name} creado. Entrégale el correo y la contraseña.`),t.reset(),await J(H.profile)}catch(e){G(e?.message||`No se pudo crear el profesor.`),o.disabled=!1,o.textContent=`Crear profesor`}}async function bl(e,t){if(e&&!t.disabled){H.error=``,H.notice=``,t.disabled=!0,t.textContent=`Generando…`;try{let{data:n,error:r}=await B.functions.invoke(`admin-reset-student-password`,{body:{student_id:e}});if(r)throw r;if(!n?.temporary_password)throw Error(n?.error||`No se pudo restablecer la contraseña`);K(`Contraseña temporal de ${t.dataset.studentName||n.username||`el alumno`} (${n.username}): ${n.temporary_password}. Entrégala una sola vez.`),t.disabled=!1,t.textContent=`Nueva contraseña`}catch(e){G(e?.message||`No se pudo restablecer la contraseña.`),t.disabled=!1,t.textContent=`Nueva contraseña`}}}async function xl(e){let t=e.dataset.toggleUser,n=e.dataset.active===`1`;if(!t||e.disabled)return;let r=e.closest(`li`)?.querySelector(`strong`)?.textContent||`usuario`;if((n||window.confirm(`¿Activar la cuenta de ${r}?`))&&(!n||window.confirm(`¿Desactivar la cuenta de ${r}? Perderá el acceso de inmediato.`))){H.error=``,H.notice=``,e.disabled=!0;try{let{data:e,error:i}=await B.functions.invoke(`deactivate-user`,{body:{user_id:t,active:!n}});if(i)throw i;if(!e?.ok)throw Error(e?.error||`No se pudo actualizar la cuenta`);K(`Cuenta de ${r} ${e.active?`activada`:`desactivada`}.`),await J(H.profile)}catch(t){G(t?.message||`No se pudo actualizar la cuenta.`),e.disabled=!1}}}async function Sl(e){let t=e.dataset.banAccount,n=e.dataset.ban===`1`;if(!t||e.disabled)return;let r=e.closest(`li`)?.querySelector(`strong`)?.textContent||`la cuenta`;if(window.confirm(n?`¿Bloquear ${r}? No podrá iniciar sesión con esa cuenta.`:`¿Desbloquear ${r}? Volverá a poder iniciar sesión (seguirá sin ver contenido hasta que se vincule).`)){H.error=``,H.notice=``,e.disabled=!0;try{let{data:e,error:i}=await B.rpc(`app_ban_account`,{p_user_id:t,p_ban:n});if(i)throw i;if(!e?.ok)throw Error(e?.error||`No se pudo actualizar la cuenta`);K(`Cuenta ${r} ${n?`bloqueada`:`desbloqueada`}.`),await J(H.profile)}catch(t){G(t?.message||`No se pudo actualizar la cuenta.`),e.disabled=!1}}}async function Cl(e,t){let n=U.querySelector(`[data-setting-value="${e}"]`);if(!n||t.disabled)return;let r;try{r=JSON.parse(n.value)}catch{G(`El valor de ${e} debe ser JSON válido.`);return}H.error=``,H.notice=``,t.disabled=!0,t.textContent=`Guardando…`;try{let{error:n}=await B.from(`settings`).upsert({key:e,value:r,updated_by:H.profile?.id??null});if(n)throw n;K(`Configuración ${e} guardada.`),t.disabled=!1,t.textContent=`Guardar`}catch(n){G(n?.message||`No se pudo guardar ${e}.`),t.disabled=!1,t.textContent=`Guardar`}}async function wl(e,t){e.preventDefault();let n=e.currentTarget,r=new FormData(n),i=String(r.get(`full_name`)||``).trim(),a=String(r.get(`username`)||``).trim().toLowerCase(),o=String(r.get(`password`)||``),s=String(r.get(`student_code`)||``).trim().toUpperCase();if(!t){G(`Selecciona un grupo para el alumno.`);return}if(!i){G(`Escribe el nombre completo del alumno.`);return}if(o.length<12||!/[a-z]/.test(o)||!/[A-Z]/.test(o)||!/\d/.test(o)){G(`Completa los datos: nombre y contraseña temporal (12+ caracteres, con mayúscula, minúscula y número). El usuario se genera del nombre si lo dejas vacío.`);return}let c=n.querySelector(`button[type="submit"]`);c&&(c.disabled=!0,c.textContent=`Dando de alta…`),H.error=``,H.notice=``;try{let e=n.querySelector(`[data-create-result]`),{data:r,error:c}=await B.functions.invoke(`admin-create-student`,{body:{full_name:i,username:a||null,password:o,group_id:t,student_code:s||null}});if(c)throw c;if(!r?.ok)throw Error(r?.error||`No se pudo dar de alta al alumno`);e&&(e.innerHTML=`
        <div class="answer-box correct">
          <strong>Alumno dado de alta</strong>
          <p>Usuario: <b>${W(r.access.username)}</b><br>
          Contraseña temporal: <b>${W(o)}</b><br>
          <small>Entrégaselas una vez. En su primer ingreso, el alumno deberá crear su propia contraseña.</small></p>
        </div>
      `),K(`Alumno ${r.student?.student_code||a} dado de alta en el grupo.`),n.reset(),await J(H.profile)}catch(e){G(e?.message||`No se pudo dar de alta al alumno.`),c&&(c.disabled=!1,c.textContent=`Dar de alta`)}}function Tl(e){let t=new URL(window.location.href);return t.search=``,t.hash=``,t.searchParams.set(`link_token`,e),t.toString()}function El(e){let t=new Date(e||``);return Number.isNaN(t.getTime())?``:t.toLocaleString(`es-MX`,{dateStyle:`medium`,timeStyle:`short`})}async function Dl(e,t){e.preventDefault();let n=e.currentTarget,r=new FormData(n),i=String(r.get(`full_name`)||``).trim(),a=String(r.get(`username`)||``).trim().toLowerCase(),o=String(r.get(`student_code`)||``).trim().toUpperCase();if(!t){G(`Selecciona un grupo para el alumno.`);return}if(!i){G(`Escribe el nombre completo del alumno.`);return}let s=n.querySelector(`button[type="submit"]`);s&&(s.disabled=!0,s.textContent=`Generando…`),H.error=``,H.notice=``,H.studentInvitation=null;try{let{data:e,error:n}=await B.functions.invoke(`issue-student-link-token`,{body:{full_name:i,username:a||null,group_id:t,student_code:o||null}});if(n)throw n;if(!e?.ok)throw Error(e?.error||`No se pudo generar la invitación`);let r=e.invitation?.token;if(!r)throw Error(`La invitación llegó sin token.`);let s=Tl(r);H.studentInvitation={fullName:i,username:e.access?.username||``,studentCode:e.student?.student_code||o||``,redeemUrl:s,expiresAtLabel:El(e.invitation?.expires_at)},K(`Invitación generada para ${i}. Comparte el enlace; vence en 72 h.`),await J(H.profile)}catch(e){G(await Io(e,`No se pudo generar la invitación.`)),$()}}async function Ol(e,t){if(e&&!t.disabled){H.error=``,H.notice=``,t.disabled=!0,t.textContent=`Generando…`;try{let{data:n,error:r}=await B.functions.invoke(`issue-student-link-token`,{body:{student_id:e}});if(r)throw r;if(!n?.ok)throw Error(n?.error||`No se pudo generar el enlace`);let i=n.invitation?.token;if(!i)throw Error(`La invitación llegó sin token.`);let a=Tl(i),o=n.access?.full_name||t.dataset.studentName||`el alumno`;H.studentInvitation={fullName:o,username:n.access?.username||``,studentCode:n.student?.student_code||``,redeemUrl:a,expiresAtLabel:El(n.invitation?.expires_at)},H.staffTab=`alumnos`,K(`Enlace de acceso generado para ${o}. Compártelo; vence en 72 h.`),await J(H.profile)}catch(e){G(await Io(e,`No se pudo generar el enlace de acceso.`)),t.disabled=!1,t.textContent=`Enlace de acceso`}}}function kl(e){let t=U.querySelector(`[data-advise-form="${e}"]`);if(!t)return;let n=(H.dashboard?.groups||[]).find(t=>t.students.some(t=>t.id===e))?.students.find(t=>t.id===e),r=n?.guardians||[];t.classList.toggle(`hidden`),t.classList.contains(`hidden`)||(r.length?(t.innerHTML=`
    <span class="card-label">Aviso para ${W(n?.full_name||`el alumno`)}</span>
    <select data-advise-guardian>
      ${r.map(e=>`
        <option value="${W(e.id)}" data-phone="${W(e.phone||``)}">
          ${W(e.full_name)}${e.relationship?` (${W(e.relationship)})`:``}
        </option>
      `).join(``)}
    </select>
    <textarea data-advise-body rows="3" placeholder="Escribe el aviso que quieres enviar…"></textarea>
    <div class="row">
      <button class="btn primary" data-advise-send="${W(e)}">Enviar por WhatsApp</button>
      <button class="btn ghost" data-advise-close="${W(e)}">Cerrar</button>
    </div>
  `,t.querySelector(`[data-advise-send]`).addEventListener(`click`,()=>Al(e,n)),t.querySelector(`[data-advise-close]`).addEventListener(`click`,()=>t.classList.add(`hidden`))):t.innerHTML=`<p class="empty-state">Este alumno no tiene tutores vinculados. Usa "Invitar tutor" primero.</p>`)}async function Al(e,t){let n=U.querySelector(`[data-advise-form="${e}"]`);if(!n)return;let r=n.querySelector(`[data-advise-guardian]`),i=n.querySelector(`[data-advise-body]`),a=r?.selectedOptions?.[0],o=r?.value,s=a?.dataset?.phone||``,c=a?.textContent?.trim()||`el tutor`,l=String(i?.value||``).trim();if(!l){G(`Escribe el aviso que quieres enviar.`);return}if(!s){G(`El tutor no tiene teléfono registrado. Edita su ficha o comparte el aviso por otro medio.`);return}let u=`Aviso sobre ${t?.full_name||`el alumno`}`;try{let{error:t}=await B.from(`guardian_messages`).insert({student_id:e,guardian_id:o,channel:`whatsapp`,subject:u,body:l,status:`sent`,sent_at:new Date().toISOString()});if(t)throw t;let r=[`Hola ${c} 👋`,u+`:`,l].join(`
`);window.open(`https://wa.me/${s.replace(/[^\d]/g,``)}?text=${encodeURIComponent(r)}`,`_blank`,`noopener`),K(`Aviso registrado. Se abrió WhatsApp para enviarlo.`),n.classList.add(`hidden`),await J(H.profile)}catch(e){G(e?.message||`No se pudo registrar el aviso.`)}}async function jl(e,t){let n=U.querySelector(`[data-attendance-area="${e}"]`);if(!n)return;let r=U.querySelector(`[data-attendance-open="${e}"]`);if(!n.classList.contains(`hidden`)&&!t){n.classList.add(`hidden`),n.innerHTML=``,r&&(r.style.display=``);return}let i=(H.dashboard?.groups||[]).find(t=>t.id===e)?.students||[];if(!i.length){G(`El grupo no tiene alumnos.`);return}n.classList.remove(`hidden`),n.innerHTML=`<div class="spinner" aria-hidden="true"></div>`,r&&(r.style.display=`none`),H.error=``,H.notice=``;let a=new Date().toISOString().slice(0,10);await Ml(e,i,n,t||a)}async function Ml(e,t,n,r){try{let{data:i,error:a}=await B.from(`attendance_sessions`).select(`id,session_date`).eq(`group_id`,e).eq(`session_date`,r).order(`created_at`,{ascending:!0}).limit(1).maybeSingle();if(a)throw a;if(!i){let t=await B.from(`attendance_sessions`).insert({group_id:e,session_date:r,created_by:H.profile?.id??null}).select(`id,session_date`).single();if(t.error)throw t.error;i=t.data}let o=await B.from(`attendance`).select(`student_id,status`).eq(`session_id`,i.id);if(o.error)throw o.error;let s=new Map((o.data||[]).map(e=>[e.student_id,e.status])),c=new Date().toISOString().slice(0,10);n.innerHTML=`
      <div class="attendance-toolbar">
        <label class="attendance-date">
          <span>Fecha</span>
          <input type="date" value="${W(r)}" max="${W(c)}" data-attendance-date>
        </label>
        <div class="attendance-bulk">
          <button class="btn-mini" type="button" data-attendance-all="present">Todos presentes</button>
          <button class="btn-mini" type="button" data-attendance-all="absent">Todos ausentes</button>
        </div>
        <button class="btn-mini ghost" type="button" data-attendance-dismiss>Listo</button>
      </div>
      <div class="attendance-summary" data-attendance-summary></div>
      <ul class="attendance-list">
        ${t.map(e=>{let t=s.get(e.id)||`present`;return`
            <li class="attendance-row" data-attendance-row data-student-id="${W(e.id)}" data-status="${W(t)}">
              <div class="attendance-who">
                <span class="avatar small">${W((e.full_name||`?`).slice(0,1).toUpperCase())}</span>
                <div>
                  <strong>${W(e.full_name)}</strong>
                  <small>${W(e.student_code)}</small>
                </div>
              </div>
              <div class="status-seg" role="group" aria-label="Estado de ${W(e.full_name)}">
                ${Object.entries(Za).map(([e,n])=>`
                  <button class="status-btn ${t===e?`active`:``}" type="button" data-att-status="${e}">${W(n)}</button>
                `).join(``)}
              </div>
            </li>
          `}).join(``)}
      </ul>
      <div class="row end attendance-actions">
        <span class="muted" data-attendance-save-note><small>Los cambios se guardan por fecha.</small></span>
        <button class="btn primary" data-attendance-save="${W(i.id)}" data-attendance-group="${W(e)}">Guardar asistencia</button>
      </div>
    `,Nl(n,e,t),Pl(n)}catch(e){n.innerHTML=`<p class="empty-state">No se pudo cargar la asistencia: ${W(e?.message||`error`)}</p>`}}function Nl(e,t,n){let r=e.querySelector(`[data-attendance-date]`);r&&r.addEventListener(`change`,()=>{let i=r.value||new Date().toISOString().slice(0,10);e.innerHTML=`<div class="spinner" aria-hidden="true"></div>`,Ml(t,n,e,i)}),e.querySelectorAll(`[data-att-status]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.closest(`[data-attendance-row]`);n&&(n.dataset.status=t.dataset.attStatus,n.querySelectorAll(`[data-att-status]`).forEach(e=>{e.classList.toggle(`active`,e===t)}),Pl(e))})}),e.querySelectorAll(`[data-attendance-all]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.attendanceAll;e.querySelectorAll(`[data-attendance-row]`).forEach(e=>{e.dataset.status=n,e.querySelectorAll(`[data-att-status]`).forEach(e=>{e.classList.toggle(`active`,e.dataset.attStatus===n)})}),Pl(e)})});let i=e.querySelector(`[data-attendance-dismiss]`);i&&i.addEventListener(`click`,()=>{e.classList.add(`hidden`),e.innerHTML=``;let n=U.querySelector(`[data-attendance-open="${t}"]`);n&&(n.style.display=``)});let a=e.querySelector(`[data-attendance-save]`);a&&a.addEventListener(`click`,()=>Fl(a.dataset.attendanceSave,t,a,e))}function Pl(e){let t=e.querySelector(`[data-attendance-summary]`);if(!t)return;let n={present:0,late:0,excused:0,absent:0};e.querySelectorAll(`[data-attendance-row]`).forEach(e=>{let t=e.dataset.status||`present`;n[t]!=null&&(n[t]+=1)});let r=Object.values(n).reduce((e,t)=>e+t,0);t.innerHTML=`
    <span class="pill pill-green">${n.present} presentes</span>
    <span class="pill pill-amber">${n.late} tarde</span>
    <span class="pill">${n.excused} justificados</span>
    <span class="pill pill-red">${n.absent} faltas</span>
    <span class="pill pill-blue">${r} alumnos</span>
  `}async function Fl(e,t,n,r){if(r){n.disabled=!0,n.textContent=`Guardando…`,H.error=``,H.notice=``;try{let t=[...r.querySelectorAll(`[data-attendance-row]`)],i=t.map(t=>B.from(`attendance`).upsert({session_id:e,student_id:t.dataset.studentId,status:t.dataset.status||`present`,recorded_by:H.profile?.id??null},{onConflict:`session_id,student_id`})),a=(await Promise.all(i)).find(e=>e.error)?.error;if(a)throw a;let o=r.querySelector(`[data-attendance-save-note]`);o&&(o.innerHTML=`<small>Guardado a las ${W(new Date().toLocaleTimeString(`es-MX`,{hour:`2-digit`,minute:`2-digit`}))} · ${t.length} alumnos.</small>`),n.disabled=!1,n.textContent=`Guardar asistencia`}catch(e){G(e?.message||`No se pudo guardar la asistencia.`),n.disabled=!1,n.textContent=`Guardar asistencia`}}}async function Il(e){e.preventDefault();let t=e.currentTarget,n=t.dataset.inviteForm,r=String(t.dataset.studentCode||`alumno`).toLowerCase(),i=new FormData(t),a=String(i.get(`full_name`)||``).trim(),o=String(i.get(`phone`)||``).trim(),s=String(i.get(`relationship`)||``).trim(),c=String(i.get(`email`)||``).trim().toLowerCase()||`tutor.${r}@tutores.ecoems.mx`;if(!a)return;let l=t.querySelector(`button[type="submit"]`);l&&(l.disabled=!0,l.textContent=`Creando…`),H.error=``,H.notice=``;try{let{data:e,error:r}=await B.functions.invoke(`invite-guardian`,{body:{student_id:n,full_name:a,phone:o||null,relationship:s||null,email:c}});if(r)throw r;if(!e?.ok)throw Error(e?.error||`No se pudo crear la invitación`);t.classList.add(`hidden`);let i=U.querySelector(`[data-invite-result="${n}"]`);i&&(i.classList.remove(`hidden`),i.innerHTML=`
        <span class="card-label">Invitación enviada · ${W(a)}</span>
        <p>${W(e.message||`Correo encolado para ${e.email||`el tutor`}.`)}</p>
        <p class="hint">El enlace de acceso viaja en el correo, no en esta pantalla ni en un chat. Si caduca, vuelve a generarlo con el mismo botón.</p>
      `)}catch(e){G(e?.message||`No se pudo crear la invitación. Revisa la conexión.`),l&&(l.disabled=!1,l.textContent=`Crear invitación`)}}async function Ll(e,t){if(!e||t.disabled)return;if(!U.querySelector(`[data-consent-ack]`)?.checked){G(`Marca la casilla “He leído y entiendo” antes de aceptar el aviso de privacidad.`);return}H.error=``,H.notice=``,t.disabled=!0,t.textContent=`Enviando…`;let n=H.dashboard?.privacy?.version||qa;try{let{data:t,error:r}=await B.functions.invoke(`guardian-consent`,{body:{student_id:e,document_version:n,accepted:!0,acknowledged:!0}});if(r)throw r;if(t?.status!==`accepted`)throw Error(t?.error||`No se pudo registrar el consentimiento`);H.notice=`Consentimiento registrado. Gracias por confiar en nosotros.`,await J(H.profile)}catch(e){G(await Io(e,`No se pudo registrar el consentimiento. Revisa la conexión e intenta de nuevo.`)),t.disabled=!1,t.textContent=`Aceptar y ver datos`}}async function Rl(e,t,n){if(!e||n.disabled)return;let r=t?`a ${t}`:`a este alumno`;if(typeof window.confirm==`function`&&window.confirm(`¿Revocar el consentimiento ${r}? Dejarás de ver su información hasta que vuelvas a aceptar el aviso de privacidad.`)){H.error=``,H.notice=``,n.disabled=!0,n.textContent=`Revocando…`;try{let{data:t,error:n}=await B.functions.invoke(`guardian-consent`,{body:{student_id:e,revoke:!0,confirm:!0}});if(n)throw n;if(t?.status!==`revoked`)throw Error(t?.error||`No se pudo revocar el consentimiento`);H.notice=`Consentimiento revocado. La información del alumno ya no se muestra.`,await J(H.profile)}catch(e){G(await Io(e,`No se pudo revocar el consentimiento. Intenta de nuevo.`)),n.disabled=!1,n.textContent=`Revocar consentimiento`}}}async function zl(){await B.auth.signOut(),fo(),_o(),H.session=null,H.profile=null,H.dashboard=null,H.dashboardError=``,H.error=``,H.notice=``,H.mode=`student`,ro=null,q()}function Bl(e){if(!e)return;if(U=e,_o(),!Ea){xo();return}let t=new URLSearchParams(window.location.search).get(`link_token`);t?(B.auth.signOut().catch(()=>{}),Po(t)):(bo(),document.addEventListener(`click`,e=>{e.target.closest(`#data-request-btn`)&&Oo()}),B.auth.getSession().then(({data:e})=>{e.session?Ro(e.session):q()}),B.auth.onAuthStateChange((e,t)=>{e===`SIGNED_OUT`?(fo(),_o(),H.session=null,H.profile=null,H.dashboard=null,H.dashboardError=``,H.view=`dashboard`,H.unitView=null,H.unitResults={},ro=null,q()):e===`PASSWORD_RECOVERY`&&t?(async()=>{await Ro(t),H.profile&&(H.passwordRecovery=!0,H.view=`change-password`,jo())})():t&&(e===`SIGNED_IN`||e===`TOKEN_REFRESHED`)&&Ro(t)}))}Bl(document.querySelector(`#app`));