(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Symbol.for(`@supabase/supabase-js.traceContextExtractor`);function t(){return globalThis[e]}function n(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols==`function`)for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]]);return n}function r(e,t,n,r){function i(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||=Promise)(function(n,a){function o(e){try{c(r.next(e))}catch(e){a(e)}}function s(e){try{c(r.throw(e))}catch(e){a(e)}}function c(e){e.done?n(e.value):i(e.value).then(o,s)}c((r=r.apply(e,t||[])).next())})}var i=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),a=class extends Error{constructor(e,t=`FunctionsError`,n){super(e),this.name=t,this.context=n}toJSON(){return{name:this.name,message:this.message,context:this.context}}},o=class extends a{constructor(e){super(`Failed to send a request to the Edge Function`,`FunctionsFetchError`,e)}},s=class extends a{constructor(e){super(`Relay Error invoking the Edge Function`,`FunctionsRelayError`,e)}},c=class extends a{constructor(e){super(`Edge Function returned a non-2xx status code`,`FunctionsHttpError`,e)}},l;(function(e){e.Any=`any`,e.ApNortheast1=`ap-northeast-1`,e.ApNortheast2=`ap-northeast-2`,e.ApSouth1=`ap-south-1`,e.ApSoutheast1=`ap-southeast-1`,e.ApSoutheast2=`ap-southeast-2`,e.CaCentral1=`ca-central-1`,e.EuCentral1=`eu-central-1`,e.EuWest1=`eu-west-1`,e.EuWest2=`eu-west-2`,e.EuWest3=`eu-west-3`,e.SaEast1=`sa-east-1`,e.UsEast1=`us-east-1`,e.UsWest1=`us-west-1`,e.UsWest2=`us-west-2`})(l||={});var u=class{constructor(e,{headers:t={},customFetch:n,region:r=l.Any}={}){this.url=e,this.headers=t,this.region=r,this.fetch=i(n)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e){return r(this,arguments,void 0,function*(e,t={}){var n;let r,i,a;try{let{headers:n,method:l,body:u,signal:d,timeout:f}=t,p={},{region:m}=t;m||=this.region;let h=new URL(`${this.url}/${e}`);m&&m!==`any`&&(p[`x-region`]=m,h.searchParams.set(`forceFunctionRegion`,m));let g,_=!!n&&Object.keys(n).some(e=>e.toLowerCase()===`content-type`);u&&!_?typeof Blob<`u`&&u instanceof Blob||u instanceof ArrayBuffer?(p[`Content-Type`]=u.type||`application/octet-stream`,g=u):typeof u==`string`?(p[`Content-Type`]=`text/plain`,g=u):typeof FormData<`u`&&u instanceof FormData?g=u:(p[`Content-Type`]=`application/json`,g=JSON.stringify(u)):g=u&&typeof u!=`string`&&!(typeof Blob<`u`&&u instanceof Blob)&&!(u instanceof ArrayBuffer)&&!(typeof FormData<`u`&&u instanceof FormData)?JSON.stringify(u):u;let v=d;f&&(i=new AbortController,r=setTimeout(()=>i.abort(),f),d?(v=i.signal,a=()=>i.abort(),d.addEventListener(`abort`,a)):v=i.signal);let y=yield this.fetch(h.toString(),{method:l||`POST`,headers:Object.assign(Object.assign(Object.assign({},p),this.headers),n),body:g,signal:v}).catch(e=>{throw new o(e)}),b=y.headers.get(`x-relay-error`);if(b&&b===`true`)throw new s(y);if(!y.ok)throw new c(y);let x=(y.headers.get(`Content-Type`)??`text/plain`).split(`;`)[0].trim().toLowerCase(),ee;return ee=x===`application/json`?yield y.json():x===`application/octet-stream`||x===`application/pdf`?yield y.blob():x===`text/event-stream`?y:x===`multipart/form-data`?yield y.formData():yield y.text(),{data:ee,error:null,response:y}}catch(e){return{data:null,error:e,response:e instanceof c||e instanceof s?e.context:void 0}}finally{r&&clearTimeout(r),a&&((n=t.signal)==null||n.removeEventListener(`abort`,a))}})}},d=class extends Error{constructor(e){super(e.message),this.name=`PostgrestError`,this.details=e.details,this.hint=e.hint,this.code=e.code}toJSON(){return{name:this.name,message:this.message,details:this.details,hint:this.hint,code:this.code}}},f=3,p=e=>Math.min(1e3*2**e,3e4),m=[520,503],h=[`GET`,`HEAD`,`OPTIONS`];function g(e){"@babel/helpers - typeof";return g=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},g(e)}function _(e,t){if(g(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(g(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function v(e){var t=_(e,`string`);return g(t)==`symbol`?t:t+``}function y(e,t,n){return(t=v(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function b(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function x(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?b(Object(n),!0).forEach(function(t){y(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function ee(e,t){return new Promise(n=>{if(t?.aborted){n();return}let r=setTimeout(()=>{t?.removeEventListener(`abort`,i),n()},e);function i(){clearTimeout(r),n()}t?.addEventListener(`abort`,i)})}function te(e,t,n,r){return!(!r||n>=f||!h.includes(e)||!m.includes(t))}async function S(e,t,n,r){let i=0;for(;;){let a=x({},n.headers);i>0&&(a[`X-Retry-Count`]=String(i));let o;try{o=await e(t,{method:n.method,headers:a,body:n.body,signal:n.signal})}catch(e){if(e?.name===`AbortError`||e?.code===`ABORT_ERR`||e?.name===`TimeoutError`&&n.signal?.aborted||!h.includes(n.method))throw e;if(r&&i<f){let e=p(i);i++,await ee(e,n.signal);continue}throw e}if(te(n.method,o.status,i,r)){let e=o.headers?.get(`Retry-After`)??null,t=e===null?p(i):Math.max(0,parseInt(e,10)||0)*1e3;await o.text(),i++,await ee(t,n.signal)}else return o}}var ne=class{constructor(e){this.shouldThrowOnError=!1,this.retryEnabled=!0,this.method=e.method,this.url=e.url,this.headers=new Headers(e.headers),this.schema=e.schema,this.body=e.body,this.shouldThrowOnError=e.shouldThrowOnError??!1,this.signal=e.signal,this.isMaybeSingle=e.isMaybeSingle??!1,this.shouldStripNulls=e.shouldStripNulls??!1,this.urlLengthLimit=e.urlLengthLimit??8e3,this.retryEnabled=e.retry??!0,this.fetch=e.fetch?e.fetch:fetch}throwOnError(){return this.shouldThrowOnError=!0,this}stripNulls(){if(this.headers.get(`Accept`)===`text/csv`)throw Error(`stripNulls() cannot be used with csv()`);return this.shouldStripNulls=!0,this}setHeader(e,t){return this.headers=new Headers(this.headers),this.headers.set(e,t),this}retry(e){return this.retryEnabled=e,this}then(e,t){var n=this;if(this.schema===void 0||([`GET`,`HEAD`].includes(this.method)?this.headers.set(`Accept-Profile`,this.schema):this.headers.set(`Content-Profile`,this.schema)),this.method!==`GET`&&this.method!==`HEAD`&&this.headers.set(`Content-Type`,`application/json`),this.shouldStripNulls){let e=this.headers.get(`Accept`);e===`application/vnd.pgrst.object+json`?this.headers.set(`Accept`,`application/vnd.pgrst.object+json;nulls=stripped`):e&&e!==`application/json`||this.headers.set(`Accept`,`application/vnd.pgrst.array+json;nulls=stripped`)}let r=this.fetch,i=(async()=>{let e={};n.headers.forEach((t,n)=>{e[n]=t});let t=await S(r,n.url.toString(),{method:n.method,headers:e,body:JSON.stringify(n.body,(e,t)=>typeof t==`bigint`?t.toString():t),signal:n.signal},n.retryEnabled);return await n.processResponse(t)})();return this.shouldThrowOnError||(i=i.catch(e=>{let t=``,n=``,r=``,i=e?.cause;if(i){let n=i?.message??``,r=i?.code??``;t=`${e?.name??`FetchError`}: ${e?.message}`,t+=`\n\nCaused by: ${i?.name??`Error`}: ${n}`,r&&(t+=` (${r})`),i?.stack&&(t+=`\n${i.stack}`)}else t=e?.stack??``;let a=this.url.toString().length;return e?.name===`AbortError`||e?.code===`ABORT_ERR`?(r=``,n=`Request was aborted (timeout or manual cancellation)`,a>this.urlLengthLimit&&(n+=`. Note: Your request URL is ${a} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)):(i?.name===`HeadersOverflowError`||i?.code===`UND_ERR_HEADERS_OVERFLOW`)&&(r=``,n=`HTTP headers exceeded server limits (typically 16KB)`,a>this.urlLengthLimit&&(n+=`. Your request URL is ${a} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)),{success:!1,error:{message:`${e?.name??`FetchError`}: ${e?.message}`,details:t,hint:n,code:r},data:null,count:null,status:0,statusText:``}})),i.then(e,t)}async processResponse(e){var t=this;let n=null,r=null,i=null,a=e.status,o=e.statusText;if(e.ok){if(t.method!==`HEAD`){let i=await e.text();if(i!==``){if(t.headers.get(`Accept`)===`text/csv`)r=i;else if(t.headers.get(`Accept`)&&t.headers.get(`Accept`)?.includes(`application/vnd.pgrst.plan+text`))r=i;else try{r=JSON.parse(i)}catch{if(n={message:i},r=null,t.shouldThrowOnError)throw new d({message:i,details:``,hint:``,code:``})}}}let s=t.headers.get(`Prefer`)?.match(/count=(exact|planned|estimated)/),c=e.headers.get(`content-range`)?.split(`/`);if(s&&c&&c.length>1&&(i=parseInt(c[1])),t.isMaybeSingle&&Array.isArray(r)){if(r.length>1){if(n={code:`PGRST116`,details:`Results contain ${r.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:`JSON object requested, multiple (or no) rows returned`},r=null,i=null,a=406,o=`Not Acceptable`,t.shouldThrowOnError)throw new d(x(x({},n),{},{hint:n.hint??``}))}else r=r.length===1?r[0]:null}}else{let i=await e.text();try{n=JSON.parse(i),Array.isArray(n)&&e.status===404&&(r=[],n=null,a=200,o=`OK`)}catch{e.status===404&&i===``?(a=204,o=`No Content`):n={message:i}}if(n&&t.shouldThrowOnError)throw new d(n)}return{success:n===null,error:n,data:r,count:i,status:a,statusText:o}}returns(){return this}overrideTypes(){return this}},re=class extends ne{throwOnError(){return super.throwOnError()}select(e){let t=!1,n=(e??`*`).split(``).map(e=>/\s/.test(e)&&!t?``:(e===`"`&&(t=!t),e)).join(``);return this.url.searchParams.set(`select`,n),this.headers.append(`Prefer`,`return=representation`),this}order(e,{ascending:t=!0,nullsFirst:n,foreignTable:r,referencedTable:i=r}={}){let a=i?`${i}.order`:`order`,o=this.url.searchParams.get(a);return this.url.searchParams.set(a,`${o?`${o},`:``}${e}.${t?`asc`:`desc`}${n===void 0?``:n?`.nullsfirst`:`.nullslast`}`),this}limit(e,{foreignTable:t,referencedTable:n=t}={}){let r=n===void 0?`limit`:`${n}.limit`;return this.url.searchParams.set(r,`${e}`),this}range(e,t,{foreignTable:n,referencedTable:r=n}={}){let i=r===void 0?`offset`:`${r}.offset`,a=r===void 0?`limit`:`${r}.limit`;return this.url.searchParams.set(i,`${e}`),this.url.searchParams.set(a,`${t-e+1}`),this}abortSignal(e){return this.signal=e,this}single(){return this.headers.set(`Accept`,`application/vnd.pgrst.object+json`),this}maybeSingle(){return this.isMaybeSingle=!0,this}csv(){return this.headers.set(`Accept`,`text/csv`),this}geojson(){return this.headers.set(`Accept`,`application/geo+json`),this}explain({analyze:e=!1,verbose:t=!1,settings:n=!1,buffers:r=!1,wal:i=!1,format:a=`text`}={}){let o=[e?`analyze`:null,t?`verbose`:null,n?`settings`:null,r?`buffers`:null,i?`wal`:null].filter(Boolean).join(`|`),s=this.headers.get(`Accept`)??`application/json`;return this.headers.set(`Accept`,`application/vnd.pgrst.plan+${a}; for="${s}"; options=${o};`),this}rollback(){return this.headers.append(`Prefer`,`tx=rollback`),this}returns(){return this}maxAffected(e){return this.headers.append(`Prefer`,`handling=strict`),this.headers.append(`Prefer`,`max-affected=${e}`),this}},ie=RegExp(`[,()]`),ae=class extends re{throwOnError(){return super.throwOnError()}eq(e,t){return this.url.searchParams.append(e,`eq.${t}`),this}neq(e,t){return this.url.searchParams.append(e,`neq.${t}`),this}gt(e,t){return this.url.searchParams.append(e,`gt.${t}`),this}gte(e,t){return this.url.searchParams.append(e,`gte.${t}`),this}lt(e,t){return this.url.searchParams.append(e,`lt.${t}`),this}lte(e,t){return this.url.searchParams.append(e,`lte.${t}`),this}like(e,t){return this.url.searchParams.append(e,`like.${t}`),this}likeAllOf(e,t){return this.url.searchParams.append(e,`like(all).{${t.join(`,`)}}`),this}likeAnyOf(e,t){return this.url.searchParams.append(e,`like(any).{${t.join(`,`)}}`),this}ilike(e,t){return this.url.searchParams.append(e,`ilike.${t}`),this}ilikeAllOf(e,t){return this.url.searchParams.append(e,`ilike(all).{${t.join(`,`)}}`),this}ilikeAnyOf(e,t){return this.url.searchParams.append(e,`ilike(any).{${t.join(`,`)}}`),this}regexMatch(e,t){return this.url.searchParams.append(e,`match.${t}`),this}regexIMatch(e,t){return this.url.searchParams.append(e,`imatch.${t}`),this}is(e,t){return this.url.searchParams.append(e,`is.${t}`),this}isDistinct(e,t){return this.url.searchParams.append(e,`isdistinct.${t}`),this}in(e,t){let n=Array.from(new Set(t)).map(e=>typeof e==`string`&&ie.test(e)?`"${e}"`:`${e}`).join(`,`);return this.url.searchParams.append(e,`in.(${n})`),this}notIn(e,t){let n=Array.from(new Set(t)).map(e=>typeof e==`string`&&ie.test(e)?`"${e}"`:`${e}`).join(`,`);return this.url.searchParams.append(e,`not.in.(${n})`),this}contains(e,t){return typeof t==`string`?this.url.searchParams.append(e,`cs.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cs.{${t.join(`,`)}}`):this.url.searchParams.append(e,`cs.${JSON.stringify(t)}`),this}containedBy(e,t){return typeof t==`string`?this.url.searchParams.append(e,`cd.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cd.{${t.join(`,`)}}`):this.url.searchParams.append(e,`cd.${JSON.stringify(t)}`),this}rangeGt(e,t){return this.url.searchParams.append(e,`sr.${t}`),this}rangeGte(e,t){return this.url.searchParams.append(e,`nxl.${t}`),this}rangeLt(e,t){return this.url.searchParams.append(e,`sl.${t}`),this}rangeLte(e,t){return this.url.searchParams.append(e,`nxr.${t}`),this}rangeAdjacent(e,t){return this.url.searchParams.append(e,`adj.${t}`),this}overlaps(e,t){return typeof t==`string`?this.url.searchParams.append(e,`ov.${t}`):this.url.searchParams.append(e,`ov.{${t.join(`,`)}}`),this}textSearch(e,t,{config:n,type:r}={}){let i=``;r===`plain`?i=`pl`:r===`phrase`?i=`ph`:r===`websearch`&&(i=`w`);let a=n===void 0?``:`(${n})`;return this.url.searchParams.append(e,`${i}fts${a}.${t}`),this}match(e){return Object.entries(e).filter(([e,t])=>t!==void 0).forEach(([e,t])=>{this.url.searchParams.append(e,`eq.${t}`)}),this}not(e,t,n){return this.url.searchParams.append(e,`not.${t}.${n}`),this}or(e,{foreignTable:t,referencedTable:n=t}={}){let r=n?`${n}.or`:`or`;return this.url.searchParams.append(r,`(${e})`),this}filter(e,t,n){return this.url.searchParams.append(e,`${t}.${n}`),this}},oe=class{constructor(e,{headers:t={},schema:n,fetch:r,urlLengthLimit:i=8e3,retry:a}){this.url=e,this.headers=new Headers(t),this.schema=n,this.fetch=r,this.urlLengthLimit=i,this.retry=a}cloneRequestState(){return{url:new URL(this.url.toString()),headers:new Headers(this.headers)}}select(e,t){let{head:n=!1,count:r}=t??{},i=n?`HEAD`:`GET`,a=!1,o=(e??`*`).split(``).map(e=>/\s/.test(e)&&!a?``:(e===`"`&&(a=!a),e)).join(``),{url:s,headers:c}=this.cloneRequestState();return s.searchParams.set(`select`,o),r&&c.append(`Prefer`,`count=${r}`),new ae({method:i,url:s,headers:c,schema:this.schema,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}insert(e,{count:t,defaultToNull:n=!0}={}){let{url:r,headers:i}=this.cloneRequestState();if(t&&i.append(`Prefer`,`count=${t}`),n||i.append(`Prefer`,`missing=default`),Array.isArray(e)){let t=e.reduce((e,t)=>e.concat(Object.keys(t)),[]);if(t.length>0){let e=[...new Set(t)].map(e=>`"${e}"`);r.searchParams.set(`columns`,e.join(`,`))}}return new ae({method:`POST`,url:r,headers:i,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}upsert(e,{onConflict:t,ignoreDuplicates:n=!1,count:r,defaultToNull:i=!0}={}){let{url:a,headers:o}=this.cloneRequestState();if(o.append(`Prefer`,`resolution=${n?`ignore`:`merge`}-duplicates`),t!==void 0&&a.searchParams.set(`on_conflict`,t),r&&o.append(`Prefer`,`count=${r}`),i||o.append(`Prefer`,`missing=default`),Array.isArray(e)){let t=e.reduce((e,t)=>e.concat(Object.keys(t)),[]);if(t.length>0){let e=[...new Set(t)].map(e=>`"${e}"`);a.searchParams.set(`columns`,e.join(`,`))}}return new ae({method:`POST`,url:a,headers:o,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}update(e,{count:t}={}){let{url:n,headers:r}=this.cloneRequestState();return t&&r.append(`Prefer`,`count=${t}`),new ae({method:`PATCH`,url:n,headers:r,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}delete({count:e}={}){let{url:t,headers:n}=this.cloneRequestState();return e&&n.append(`Prefer`,`count=${e}`),new ae({method:`DELETE`,url:t,headers:n,schema:this.schema,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}};function se(e,t){try{let t=JSON.parse(e);if(t&&typeof t==`object`&&!Array.isArray(t))return new d({message:String(t.message??e),details:t.details??``,hint:t.hint??``,code:t.code??``})}catch{}return new d({message:e||t,details:``,hint:``,code:``})}function ce(e,t,n){let r=e;return{success:!1,error:new d({message:`${r?.name??`FetchError`}: ${r?.message}`,details:``,hint:``,code:``}),data:null,count:null,status:t,statusText:n}}var le=class e{constructor(e,{headers:t={},schema:n,fetch:r,timeout:i,urlLengthLimit:a=8e3,retry:o}={}){this.url=e,this.headers=new Headers(t),this.schemaName=n,this.urlLengthLimit=a;let s=r??globalThis.fetch;this.fetch=i!==void 0&&i>0?(e,t)=>{let n=new AbortController,r=setTimeout(()=>n.abort(),i),a=t?.signal;if(a){if(a.aborted)return clearTimeout(r),s(e,t);let i=()=>{clearTimeout(r),n.abort()};return a.addEventListener(`abort`,i,{once:!0}),s(e,x(x({},t),{},{signal:n.signal})).finally(()=>{clearTimeout(r),a.removeEventListener(`abort`,i)})}return s(e,x(x({},t),{},{signal:n.signal})).finally(()=>clearTimeout(r))}:s,this.retry=o}from(e){if(!e||typeof e!=`string`||e.trim()===``)throw Error(`Invalid relation name: relation must be a non-empty string.`);return new oe(new URL(`${this.url}/${e}`),{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}schema(t){return new e(this.url,{headers:this.headers,schema:t,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}async getOpenApiSpec(){var e=this;let t=new Headers(e.headers);t.set(`Accept`,`application/openapi+json`),e.schemaName&&t.set(`Accept-Profile`,e.schemaName);let n={};t.forEach((e,t)=>{n[t]=e});let r=e.fetch??globalThis.fetch,i;try{i=await S(r,`${e.url}/`,{method:`GET`,headers:n},e.retry??!0)}catch(e){return ce(e,0,``)}let a;try{a=await i.text()}catch(e){return ce(e,i.status,i.statusText)}if(i.ok)try{return{success:!0,error:null,data:JSON.parse(a),count:null,status:i.status,statusText:i.statusText}}catch{}return{success:!1,error:se(a,i.statusText),data:null,count:null,status:i.status,statusText:i.statusText}}rpc(e,t={},{head:n=!1,get:r=!1,count:i}={}){let a,o=new URL(`${this.url}/rpc/${e}`),s,c=e=>typeof e==`object`&&!!e&&(!Array.isArray(e)||e.some(c)),l=n&&Object.values(t).some(c);l?(a=`POST`,s=t):n||r?(a=n?`HEAD`:`GET`,Object.entries(t).filter(([e,t])=>t!==void 0).map(([e,t])=>[e,Array.isArray(t)?`{${t.join(`,`)}}`:`${t}`]).forEach(([e,t])=>{o.searchParams.append(e,t)})):(a=`POST`,s=t);let u=new Headers(this.headers);return l?u.set(`Prefer`,i?`count=${i},return=minimal`:`return=minimal`):i&&u.set(`Prefer`,`count=${i}`),new ae({method:a,url:o,headers:u,schema:this.schemaName,body:s,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}},ue=class{constructor(){}static detectEnvironment(){if(typeof WebSocket<`u`)return{type:`native`,wsConstructor:WebSocket};let e=globalThis;if(typeof globalThis<`u`&&e.WebSocket!==void 0)return{type:`native`,wsConstructor:e.WebSocket};let t=typeof global<`u`?global:void 0;if(t&&t.WebSocket!==void 0)return{type:`native`,wsConstructor:t.WebSocket};if(typeof globalThis<`u`&&e.WebSocketPair!==void 0&&globalThis.WebSocket===void 0)return{type:`cloudflare`,error:`Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.`,workaround:`Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime.`};if(typeof globalThis<`u`&&e.EdgeRuntime||typeof navigator<`u`&&navigator.userAgent?.includes(`Vercel-Edge`))return{type:`unsupported`,error:`Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.`,workaround:`Use serverless functions or a different deployment target for WebSocket functionality.`};let n=globalThis.process;if(n){let e=n.versions;if(e&&e.node)return{type:`unsupported`,error:`Node.js detected but native WebSocket not found.`,workaround:`Ensure you are running Node.js 22+ or provide a WebSocket implementation via the transport option.`}}return{type:`unsupported`,error:`Unknown JavaScript runtime without WebSocket support.`,workaround:`Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation.`}}static getWebSocketConstructor(){let e=this.detectEnvironment();if(e.wsConstructor)return e.wsConstructor;let t=e.error||`WebSocket not supported in this environment.`;throw e.workaround&&(t+=`\n\nSuggested solution: ${e.workaround}`),Error(t)}static isWebSocketSupported(){try{return this.detectEnvironment().type===`native`}catch{return!1}}},de=`realtime-js/2.118.0`,fe=`1.0.0`,pe=`2.0.0`,me=pe,he=1e4,ge=15e3,_e=1e4,ve={closed:`closed`,errored:`errored`,joined:`joined`,joining:`joining`,leaving:`leaving`},ye={close:`phx_close`,error:`phx_error`,join:`phx_join`,reply:`phx_reply`,leave:`phx_leave`,access_token:`access_token`},be={connecting:`connecting`,open:`open`,closing:`closing`,closed:`closed`},xe=class{constructor(e){this.HEADER_LENGTH=1,this.USER_BROADCAST_PUSH_META_LENGTH=6,this.KINDS={userBroadcastPush:3,userBroadcast:4},this.BINARY_ENCODING=0,this.JSON_ENCODING=1,this.BROADCAST_EVENT=`broadcast`,this.allowedMetadataKeys=[],this.allowedMetadataKeys=e??[]}encode(e,t){if(e.event===this.BROADCAST_EVENT&&!(e.payload instanceof ArrayBuffer)&&typeof e.payload.event==`string`)return t(this._binaryEncodeUserBroadcastPush(e));let n=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(n))}_binaryEncodeUserBroadcastPush(e){return this._isArrayBuffer(e.payload?.payload)?this._encodeBinaryUserBroadcastPush(e):this._encodeJsonUserBroadcastPush(e)}_encodeBinaryUserBroadcastPush(e){let t=e.payload?.payload??new ArrayBuffer(0);return this._encodeUserBroadcastPush(e,this.BINARY_ENCODING,t)}_encodeJsonUserBroadcastPush(e){let t=e.payload?.payload??{},n=new TextEncoder().encode(JSON.stringify(t)).buffer;return this._encodeUserBroadcastPush(e,this.JSON_ENCODING,n)}_encodeUserBroadcastPush(e,t,n){let r=new TextEncoder,i=r.encode(e.topic),a=r.encode(e.ref??``),o=r.encode(e.join_ref??``),s=r.encode(e.payload.event),c=this.allowedMetadataKeys?this._pick(e.payload,this.allowedMetadataKeys):{},l=r.encode(Object.keys(c).length===0?``:JSON.stringify(c));if(o.length>255)throw Error(`joinRef length ${o.length} exceeds maximum of 255`);if(a.length>255)throw Error(`ref length ${a.length} exceeds maximum of 255`);if(i.length>255)throw Error(`topic length ${i.length} exceeds maximum of 255`);if(s.length>255)throw Error(`userEvent length ${s.length} exceeds maximum of 255`);if(l.length>255)throw Error(`metadata length ${l.length} exceeds maximum of 255`);let u=this.USER_BROADCAST_PUSH_META_LENGTH+o.length+a.length+i.length+s.length+l.length,d=new ArrayBuffer(this.HEADER_LENGTH+u),f=new DataView(d),p=new Uint8Array(d),m=0;f.setUint8(m++,this.KINDS.userBroadcastPush),f.setUint8(m++,o.length),f.setUint8(m++,a.length),f.setUint8(m++,i.length),f.setUint8(m++,s.length),f.setUint8(m++,l.length),f.setUint8(m++,t),p.set(o,m),m+=o.length,p.set(a,m),m+=a.length,p.set(i,m),m+=i.length,p.set(s,m),m+=s.length,p.set(l,m),m+=l.length;var h=new Uint8Array(d.byteLength+n.byteLength);return h.set(new Uint8Array(d),0),h.set(new Uint8Array(n),d.byteLength),h.buffer}decode(e,t){if(this._isArrayBuffer(e))return t(this._binaryDecode(e));if(typeof e==`string`){let[n,r,i,a,o]=JSON.parse(e);return t({join_ref:n,ref:r,topic:i,event:a,payload:o})}return t({})}_binaryDecode(e){let t=new DataView(e),n=t.getUint8(0),r=new TextDecoder;switch(n){case this.KINDS.userBroadcast:return this._decodeUserBroadcast(e,t,r)}}_decodeUserBroadcast(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=t.getUint8(4),s=this.HEADER_LENGTH+4,c=n.decode(e.slice(s,s+r));s+=r;let l=n.decode(e.slice(s,s+i));s+=i;let u=n.decode(e.slice(s,s+a));s+=a;let d=e.slice(s,e.byteLength),f=o===this.JSON_ENCODING?JSON.parse(n.decode(d)):d,p={type:this.BROADCAST_EVENT,event:l,payload:f};return a>0&&(p.meta=JSON.parse(u)),{join_ref:null,ref:null,topic:c,event:this.BROADCAST_EVENT,payload:p}}_isArrayBuffer(e){return e instanceof ArrayBuffer||e?.constructor?.name===`ArrayBuffer`}_pick(e,t){return!e||typeof e!=`object`?{}:Object.fromEntries(Object.entries(e).filter(([e])=>t.includes(e)))}},C;(function(e){e.abstime=`abstime`,e.bool=`bool`,e.date=`date`,e.daterange=`daterange`,e.float4=`float4`,e.float8=`float8`,e.int2=`int2`,e.int4=`int4`,e.int4range=`int4range`,e.int8=`int8`,e.int8range=`int8range`,e.json=`json`,e.jsonb=`jsonb`,e.money=`money`,e.numeric=`numeric`,e.oid=`oid`,e.reltime=`reltime`,e.text=`text`,e.time=`time`,e.timestamp=`timestamp`,e.timestamptz=`timestamptz`,e.timetz=`timetz`,e.tsrange=`tsrange`,e.tstzrange=`tstzrange`})(C||={});var Se=(e,t,n={})=>{let r=n.skipTypes??[];return t?Object.keys(t).reduce((n,i)=>(n[i]=Ce(i,e,t,r),n),{}):{}},Ce=(e,t,n,r)=>{let i=t.find(t=>t.name===e)?.type,a=n[e];return i&&!r.includes(i)?we(i,a):Te(a)},we=(e,t)=>{if(e.charAt(0)===`_`)return ke(t,e.slice(1,e.length));switch(e){case C.bool:return Ee(t);case C.float4:case C.float8:case C.int2:case C.int4:case C.int8:case C.numeric:case C.oid:return De(t);case C.json:case C.jsonb:return Oe(t);case C.timestamp:return Ae(t);case C.abstime:case C.date:case C.daterange:case C.int4range:case C.int8range:case C.money:case C.reltime:case C.text:case C.time:case C.timestamptz:case C.timetz:case C.tsrange:case C.tstzrange:return Te(t);default:return Te(t)}},Te=e=>e,Ee=e=>{switch(e){case`t`:return!0;case`f`:return!1;default:return e}},De=e=>{if(typeof e==`string`){let t=parseFloat(e);if(!Number.isNaN(t))return t}return e},Oe=e=>{if(typeof e==`string`)try{return JSON.parse(e)}catch{return e}return e},ke=(e,t)=>{if(typeof e!=`string`)return e;let n=e.length-1,r=e[n];if(e[0]===`{`&&r===`}`){let r,i=e.slice(1,n);try{r=JSON.parse(`[`+i+`]`)}catch{r=i?i.split(`,`):[]}return r.map(e=>we(t,e))}return e},Ae=e=>typeof e==`string`?e.replace(` `,`T`):e,je=e=>{let t=new URL(e);return t.protocol=t.protocol.replace(/^ws/i,`http`),t.pathname=t.pathname.replace(/\/+$/,``).replace(/\/socket\/websocket$/i,``).replace(/\/socket$/i,``).replace(/\/websocket$/i,``),t.pathname===``||t.pathname===`/`?t.pathname=`/api/broadcast`:t.pathname+=`/api/broadcast`,t.href},Me=e=>typeof e==`function`?e:function(){return e},Ne=typeof self<`u`?self:null,Pe=typeof window<`u`?window:null,Fe=Ne||Pe||globalThis,Ie=`2.0.0`,Le=1e4,Re=1e3,ze=100,Be={connecting:0,open:1,closing:2,closed:3},w={closed:`closed`,errored:`errored`,joined:`joined`,joining:`joining`,leaving:`leaving`},Ve={close:`phx_close`,error:`phx_error`,join:`phx_join`,reply:`phx_reply`,leave:`phx_leave`},He={longpoll:`longpoll`,websocket:`websocket`},Ue={complete:4},We=`base64url.bearer.phx.`,Ge=class{constructor(e,t,n,r){this.channel=e,this.event=t,this.payload=n||function(){return{}},this.receivedResp=null,this.timeout=r,this.timeoutTimer=null,this.recHooks=[],this.sent=!1,this.ref=void 0}resend(e){this.timeout=e,this.reset(),this.send()}send(){this.hasReceived(`timeout`)||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload(),ref:this.ref,join_ref:this.channel.joinRef()}))}receive(e,t){return this.hasReceived(e)&&t(this.receivedResp.response),this.recHooks.push({status:e,callback:t}),this}reset(){this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1}destroy(){this.cancelRefEvent(),this.cancelTimeout()}matchReceive({status:e,response:t,_ref:n}){this.recHooks.filter(t=>t.status===e).forEach(e=>e.callback(t))}cancelRefEvent(){this.refEvent&&this.channel.off(this.refEvent)}cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}startTimeout(){this.timeoutTimer&&this.cancelTimeout(),this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,e=>{this.cancelRefEvent(),this.cancelTimeout(),this.receivedResp=e,this.matchReceive(e)}),this.timeoutTimer=setTimeout(()=>{this.trigger(`timeout`,{})},this.timeout)}hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}trigger(e,t){this.channel.trigger(this.refEvent,{status:e,response:t})}},Ke=class{constructor(e,t){this.callback=e,this.timerCalc=t,this.timer=void 0,this.tries=0}reset(){this.tries=0,clearTimeout(this.timer)}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries+=1,this.callback()},this.timerCalc(this.tries+1))}},qe=class{constructor(e,t,n){this.state=w.closed,this.topic=e,this.params=Me(t||{}),this.socket=n,this.bindings=[],this.bindingRef=0,this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new Ge(this,Ve.join,this.params,this.timeout),this.pushBuffer=[],this.stateChangeRefs=[],this.rejoinTimer=new Ke(()=>{this.socket.isConnected()&&this.rejoin()},this.socket.rejoinAfterMs),this.stateChangeRefs.push(this.socket.onError(()=>this.rejoinTimer.reset())),this.stateChangeRefs.push(this.socket.onOpen(()=>{this.rejoinTimer.reset(),this.isErrored()&&this.rejoin()})),this.joinPush.receive(`ok`,()=>{this.state=w.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(e=>e.send()),this.pushBuffer=[]}),this.joinPush.receive(`error`,e=>{this.state=w.errored,this.socket.hasLogger()&&this.socket.log(`channel`,`error ${this.topic}`,e),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.onClose(()=>{this.rejoinTimer.reset(),this.socket.hasLogger()&&this.socket.log(`channel`,`close ${this.topic}`),this.state=w.closed,this.socket.remove(this)}),this.onError(e=>{this.socket.hasLogger()&&this.socket.log(`channel`,`error ${this.topic}`,e),this.isJoining()&&this.joinPush.reset(),this.state=w.errored,this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.joinPush.receive(`timeout`,()=>{this.socket.hasLogger()&&this.socket.log(`channel`,`timeout ${this.topic}`,this.joinPush.timeout),new Ge(this,Ve.leave,Me({}),this.timeout).send(),this.state=w.errored,this.joinPush.reset(),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.on(Ve.reply,(e,t)=>{this.trigger(this.replyEventName(t),e)})}join(e=this.timeout){if(this.joinedOnce)throw Error(`tried to join multiple times. 'join' can only be called a single time per channel instance`);return this.timeout=e,this.joinedOnce=!0,this.rejoin(),this.joinPush}teardown(){this.pushBuffer.forEach(e=>e.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=w.closed,this.bindings=[]}onClose(e){this.on(Ve.close,e)}onError(e){return this.on(Ve.error,t=>e(t))}on(e,t){let n=this.bindingRef++;return this.bindings.push({event:e,ref:n,callback:t}),n}off(e,t){this.bindings=this.bindings.filter(n=>n.event!==e||t!==void 0&&t!==n.ref)}canPush(){return this.socket.isConnected()&&this.isJoined()}push(e,t,n=this.timeout){if(t||={},!this.joinedOnce)throw Error(`tried to push '${e}' to '${this.topic}' before joining. Use channel.join() before pushing events`);let r=new Ge(this,e,function(){return t},n);return this.canPush()?r.send():(r.startTimeout(),this.pushBuffer.push(r)),r}leave(e=this.timeout){this.rejoinTimer.reset(),this.joinPush.cancelTimeout(),this.state=w.leaving;let t=()=>{this.socket.hasLogger()&&this.socket.log(`channel`,`leave ${this.topic}`),this.trigger(Ve.close,`leave`)},n=new Ge(this,Ve.leave,Me({}),e);return n.receive(`ok`,()=>t()).receive(`timeout`,()=>t()),n.send(),this.canPush()||n.trigger(`ok`,{}),n}onMessage(e,t,n){return t}filterBindings(e,t,n){return!0}isMember(e,t,n,r){return this.topic===e?r&&r!==this.joinRef()?(this.socket.hasLogger()&&this.socket.log(`channel`,`dropping outdated message`,{topic:e,event:t,payload:n,joinRef:r}),!1):!0:!1}joinRef(){return this.joinPush.ref}rejoin(e=this.timeout){this.isLeaving()||(this.socket.leaveOpenTopic(this.topic),this.state=w.joining,this.joinPush.resend(e))}trigger(e,t,n,r){let i=this.onMessage(e,t,n,r);if(t&&!i)throw Error(`channel onMessage callbacks must return the payload, modified or unmodified`);let a=this.bindings.filter(r=>r.event===e&&this.filterBindings(r,t,n));for(let e=0;e<a.length;e++)a[e].callback(i,n,r||this.joinRef())}replyEventName(e){return`chan_reply_${e}`}isClosed(){return this.state===w.closed}isErrored(){return this.state===w.errored}isJoined(){return this.state===w.joined}isJoining(){return this.state===w.joining}isLeaving(){return this.state===w.leaving}},Je=class{static request(e,t,n,r,i,a,o){if(Fe.XDomainRequest){let n=new Fe.XDomainRequest;return this.xdomainRequest(n,e,t,r,i,a,o)}if(Fe.XMLHttpRequest){let s=new Fe.XMLHttpRequest;return this.xhrRequest(s,e,t,n,r,i,a,o)}if(Fe.fetch&&Fe.AbortController)return this.fetchRequest(e,t,n,r,i,a,o);throw Error(`No suitable XMLHttpRequest implementation found`)}static fetchRequest(e,t,n,r,i,a,o){let s={method:e,headers:n,body:r},c=null;return i&&(c=new AbortController,setTimeout(()=>c.abort(),i),s.signal=c.signal),Fe.fetch(t,s).then(e=>e.text()).then(e=>this.parseJSON(e)).then(e=>o&&o(e)).catch(e=>{e.name===`AbortError`&&a?a():o&&o(null)}),c}static xdomainRequest(e,t,n,r,i,a,o){return e.timeout=i,e.open(t,n),e.onload=()=>{let t=this.parseJSON(e.responseText);o&&o(t)},a&&(e.ontimeout=a),e.onprogress=()=>{},e.send(r),e}static xhrRequest(e,t,n,r,i,a,o,s){e.open(t,n,!0),e.timeout=a;for(let[t,n]of Object.entries(r))e.setRequestHeader(t,n);return e.onerror=()=>s&&s(null),e.onreadystatechange=()=>{e.readyState===Ue.complete&&s&&s(this.parseJSON(e.responseText))},o&&(e.ontimeout=o),e.send(i),e}static parseJSON(e){if(!e||e===``)return null;try{return JSON.parse(e)}catch{return console&&console.log(`failed to parse JSON response`,e),null}}static serialize(e,t){let n=[];for(var r in e){if(!Object.prototype.hasOwnProperty.call(e,r))continue;let i=t?`${t}[${r}]`:r,a=e[r];typeof a==`object`?n.push(this.serialize(a,i)):n.push(encodeURIComponent(i)+`=`+encodeURIComponent(a))}return n.join(`&`)}static appendParams(e,t){return Object.keys(t).length===0?e:`${e}${e.match(/\?/)?`&`:`?`}${this.serialize(t)}`}},Ye=e=>{let t=``,n=new Uint8Array(e),r=n.byteLength;for(let e=0;e<r;e++)t+=String.fromCharCode(n[e]);return btoa(t)},Xe=class{constructor(e,t){t&&t.length===2&&t[1].startsWith(We)&&(this.authToken=atob(t[1].slice(We.length))),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.reqs=new Set,this.awaitingBatchAck=!1,this.currentBatch=null,this.currentBatchTimer=null,this.batchBuffer=[],this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(e),this.readyState=Be.connecting,setTimeout(()=>this.poll(),0)}normalizeEndpoint(e){return e.replace(`ws://`,`http://`).replace(`wss://`,`https://`).replace(RegExp(`(.*)/`+He.websocket),`$1/`+He.longpoll)}endpointURL(){return Je.appendParams(this.pollEndpoint,{token:this.token})}closeAndRetry(e,t,n){this.close(e,t,n),this.readyState=Be.connecting}ontimeout(){this.onerror(`timeout`),this.closeAndRetry(1005,`timeout`,!1)}isActive(){return this.readyState===Be.open||this.readyState===Be.connecting}poll(){let e={Accept:`application/json`};this.authToken&&(e[`X-Phoenix-AuthToken`]=this.authToken),this.ajax(`GET`,e,null,()=>this.ontimeout(),e=>{if(e){var{status:t,token:n,messages:r}=e;if(t===410&&this.token!==null){this.onerror(410),this.closeAndRetry(3410,`session_gone`,!1);return}this.token=n}else t=0;switch(t){case 200:r.forEach(e=>{setTimeout(()=>this.onmessage({data:e}),0)}),this.poll();break;case 204:this.poll();break;case 410:this.readyState=Be.open,this.onopen({}),this.poll();break;case 403:this.onerror(403),this.close(1008,`forbidden`,!1);break;case 0:case 500:this.onerror(500),this.closeAndRetry(1011,`internal server error`,500);break;default:throw Error(`unhandled poll status ${t}`)}})}send(e){typeof e!=`string`&&(e=Ye(e)),this.currentBatch?this.currentBatch.push(e):this.awaitingBatchAck?this.batchBuffer.push(e):(this.currentBatch=[e],this.currentBatchTimer=setTimeout(()=>{this.batchSend(this.currentBatch),this.currentBatch=null},0))}batchSend(e,t=0){this.awaitingBatchAck=!0;let n=t+ze,r=e.slice(t,n);this.ajax(`POST`,{"Content-Type":`application/x-ndjson`},r.join(`
`),()=>this.onerror(`timeout`),t=>{!t||t.status!==200?(this.awaitingBatchAck=!1,this.onerror(t&&t.status),this.closeAndRetry(1011,`internal server error`,!1)):n<e.length?this.batchSend(e,n):this.batchBuffer.length>0?(this.batchSend(this.batchBuffer),this.batchBuffer=[]):this.awaitingBatchAck=!1})}close(e,t,n){for(let e of this.reqs)e.abort();this.readyState=Be.closed;let r=Object.assign({code:1e3,reason:void 0,wasClean:!0},{code:e,reason:t,wasClean:n});this.batchBuffer=[],clearTimeout(this.currentBatchTimer),this.currentBatchTimer=null,typeof CloseEvent<`u`?this.onclose(new CloseEvent(`close`,r)):this.onclose(r)}ajax(e,t,n,r,i){let a;a=Je.request(e,this.endpointURL(),t,n,this.timeout,()=>{this.reqs.delete(a),r()},e=>{this.reqs.delete(a),this.isActive()&&i(e)}),this.reqs.add(a)}},Ze=class e{constructor(t,n={}){let r=n.events||{state:`presence_state`,diff:`presence_diff`};this.state=Object.create(null),this.pendingDiffs=[],this.channel=t,this.joinRef=null,this.caller={onJoin:function(){},onLeave:function(){},onSync:function(){}},this.channel.on(r.state,t=>{let{onJoin:n,onLeave:r,onSync:i}=this.caller;this.joinRef=this.channel.joinRef(),this.state=e.syncState(this.state,t,n,r),this.pendingDiffs.forEach(t=>{this.state=e.syncDiff(this.state,t,n,r)}),this.pendingDiffs=[],i()}),this.channel.on(r.diff,t=>{let{onJoin:n,onLeave:r,onSync:i}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(t):(this.state=e.syncDiff(this.state,t,n,r),i())})}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}list(t){return e.list(this.state,t)}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel.joinRef()}static syncState(e,t,n,r){let i=this.toNullProtoObj(this.clone(e));t=this.toNullProtoObj(t);let a=Object.create(null),o=Object.create(null);return this.map(i,(e,n)=>{t[e]||(o[e]=n)}),this.map(t,(e,t)=>{let n=i[e];if(n){let r=t.metas.map(e=>e.phx_ref),i=n.metas.map(e=>e.phx_ref),s=t.metas.filter(e=>i.indexOf(e.phx_ref)<0),c=n.metas.filter(e=>r.indexOf(e.phx_ref)<0);s.length>0&&(a[e]=t,a[e].metas=s),c.length>0&&(o[e]=this.clone(n),o[e].metas=c)}else a[e]=t}),this.syncDiff(i,{joins:a,leaves:o},n,r)}static syncDiff(e,t,n,r){e=this.toNullProtoObj(e);let{joins:i,leaves:a}=this.clone(t);return n||=function(){},r||=function(){},this.map(i,(t,r)=>{let i=e[t];if(e[t]=this.clone(r),i){let n=e[t].metas.map(e=>e.phx_ref),r=i.metas.filter(e=>n.indexOf(e.phx_ref)<0);e[t].metas.unshift(...r)}n(t,i,r)}),this.map(a,(t,n)=>{let i=e[t];if(!i)return;let a=n.metas.map(e=>e.phx_ref);i.metas=i.metas.filter(e=>a.indexOf(e.phx_ref)<0),r(t,i,n),i.metas.length===0&&delete e[t]}),e}static list(e,t){return t||=function(e,t){return t},this.map(e,(e,n)=>t(e,n))}static map(e,t){return Object.getOwnPropertyNames(e).map(n=>t(n,e[n]))}static toNullProtoObj(e){if(Object.getPrototypeOf(e)===null)return e;let t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(n=>{t[n]=e[n]}),t}static clone(e){return JSON.parse(JSON.stringify(e))}},Qe={HEADER_LENGTH:1,META_LENGTH:4,KINDS:{push:0,reply:1,broadcast:2},encode(e,t){if(e.payload.constructor===ArrayBuffer)return t(this.binaryEncode(e));{let n=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(n))}},decode(e,t){if(e.constructor===ArrayBuffer)return t(this.binaryDecode(e));{let[n,r,i,a,o]=JSON.parse(e);return t({join_ref:n,ref:r,topic:i,event:a,payload:o})}},binaryEncode(e){let{join_ref:t,ref:n,event:r,topic:i,payload:a}=e,o=new TextEncoder,s=o.encode(t),c=o.encode(n),l=o.encode(i),u=o.encode(r);this.assertFieldSize(s.byteLength,`join_ref`),this.assertFieldSize(c.byteLength,`ref`),this.assertFieldSize(l.byteLength,`topic`),this.assertFieldSize(u.byteLength,`event`);let d=this.META_LENGTH+s.byteLength+c.byteLength+l.byteLength+u.byteLength,f=new ArrayBuffer(this.HEADER_LENGTH+d),p=new Uint8Array(f),m=new DataView(f),h=0;m.setUint8(h++,this.KINDS.push),m.setUint8(h++,s.byteLength),m.setUint8(h++,c.byteLength),m.setUint8(h++,l.byteLength),m.setUint8(h++,u.byteLength),p.set(s,h),h+=s.byteLength,p.set(c,h),h+=c.byteLength,p.set(l,h),h+=l.byteLength,p.set(u,h),h+=u.byteLength;var g=new Uint8Array(f.byteLength+a.byteLength);return g.set(p,0),g.set(new Uint8Array(a),f.byteLength),g.buffer},assertFieldSize(e,t){if(e>255)throw Error(`unable to convert ${t} to binary: must be less than or equal to 255 bytes, but is ${e} bytes`)},binaryDecode(e){let t=new DataView(e),n=t.getUint8(0),r=new TextDecoder;switch(n){case this.KINDS.push:return this.decodePush(e,t,r);case this.KINDS.reply:return this.decodeReply(e,t,r);case this.KINDS.broadcast:return this.decodeBroadcast(e,t,r)}},decodePush(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=this.HEADER_LENGTH+this.META_LENGTH-1,s=n.decode(e.slice(o,o+r));o+=r;let c=n.decode(e.slice(o,o+i));o+=i;let l=n.decode(e.slice(o,o+a));return o+=a,{join_ref:s,ref:null,topic:c,event:l,payload:e.slice(o,e.byteLength)}},decodeReply(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=t.getUint8(4),s=this.HEADER_LENGTH+this.META_LENGTH,c=n.decode(e.slice(s,s+r));s+=r;let l=n.decode(e.slice(s,s+i));s+=i;let u=n.decode(e.slice(s,s+a));s+=a;let d=n.decode(e.slice(s,s+o));s+=o;let f={status:d,response:e.slice(s,e.byteLength)};return{join_ref:c,ref:l,topic:u,event:Ve.reply,payload:f}},decodeBroadcast(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=this.HEADER_LENGTH+2,o=n.decode(e.slice(a,a+r));a+=r;let s=n.decode(e.slice(a,a+i));return a+=i,{join_ref:null,ref:null,topic:o,event:s,payload:e.slice(a,e.byteLength)}}},$e=class{constructor(e,t={}){this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.fallbackRef=null,this.timeout=t.timeout||Le,this.transport=t.transport||Fe.WebSocket||Xe,this.conn=void 0,this.primaryPassedHealthCheck=!1,this.longPollFallbackMs=t.longPollFallbackMs,this.fallbackTimer=null;let n=null;try{n=Fe&&Fe.sessionStorage}catch{}this.sessionStore=t.sessionStorage||n,this.establishedConnections=0,this.defaultEncoder=Qe.encode.bind(Qe),this.defaultDecoder=Qe.decode.bind(Qe),this.closeWasClean=!0,this.disconnecting=!1,this.binaryType=t.binaryType||`arraybuffer`,this.connectClock=1,this.pageHidden=!1,this.encode=void 0,this.decode=void 0,this.transport===Xe?(this.encode=this.defaultEncoder,this.decode=this.defaultDecoder):(this.encode=t.encode||this.defaultEncoder,this.decode=t.decode||this.defaultDecoder);let r=null;Pe&&Pe.addEventListener&&(Pe.addEventListener(`pagehide`,e=>{this.conn&&(this.disconnect(),r=this.connectClock)}),Pe.addEventListener(`pageshow`,e=>{r===this.connectClock&&(r=null,this.connect())}),Pe.addEventListener(`visibilitychange`,()=>{document.visibilityState===`hidden`?this.pageHidden=!0:(this.pageHidden=!1,!this.isConnected()&&!this.closeWasClean&&this.teardown(()=>this.connect()))})),this.heartbeatIntervalMs=t.heartbeatIntervalMs||3e4,this.autoSendHeartbeat=t.autoSendHeartbeat??!0,this.heartbeatCallback=t.heartbeatCallback??(()=>{}),this.rejoinAfterMs=e=>t.rejoinAfterMs?t.rejoinAfterMs(e):[1e3,2e3,5e3][e-1]||1e4,this.reconnectAfterMs=e=>t.reconnectAfterMs?t.reconnectAfterMs(e):[10,50,100,150,200,250,500,1e3,2e3][e-1]||5e3,this.logger=t.logger||null,!this.logger&&t.debug&&(this.logger=(e,t,n)=>{console.log(`${e}: ${t}`,n)}),this.longpollerTimeout=t.longpollerTimeout||2e4,this.params=Me(t.params||{}),this.endPoint=`${e}/${He.websocket}`,this.vsn=t.vsn||Ie,this.heartbeatTimeoutTimer=null,this.heartbeatTimer=null,this.heartbeatSentAt=null,this.pendingHeartbeatRef=null,this.reconnectTimer=new Ke(()=>{this.pageHidden?(this.log(`Not reconnecting as page is hidden!`),this.teardown()):this.teardown(async()=>{t.beforeReconnect&&await t.beforeReconnect(),this.connect()})},this.reconnectAfterMs),this.authToken=t.authToken&&Me(t.authToken)}getLongPollTransport(){return Xe}replaceTransport(e){this.connectClock++,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.conn&&=(this.conn.close(),null),this.transport=e}protocol(){return location.protocol.match(/^https/)?`wss`:`ws`}endPointURL(){let e=Je.appendParams(Je.appendParams(this.endPoint,this.params()),{vsn:this.vsn});return e.charAt(0)===`/`?e.charAt(1)===`/`?`${this.protocol()}:${e}`:`${this.protocol()}://${location.host}${e}`:e}disconnect(e,t,n){this.connectClock++,this.disconnecting=!0,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.teardown(()=>{this.disconnecting=!1,e&&e()},t,n)}connect(e){e&&(console&&console.log(`passing params to connect is deprecated. Instead pass :params to the Socket constructor`),this.params=Me(e)),(!this.conn||this.disconnecting)&&(this.longPollFallbackMs&&this.transport!==Xe?this.connectWithFallback(Xe,this.longPollFallbackMs):this.transportConnect())}log(e,t,n){this.logger&&this.logger(e,t,n)}hasLogger(){return this.logger!==null}onOpen(e){let t=this.makeRef();return this.stateChangeCallbacks.open.push([t,e]),t}onClose(e){let t=this.makeRef();return this.stateChangeCallbacks.close.push([t,e]),t}onError(e){let t=this.makeRef();return this.stateChangeCallbacks.error.push([t,e]),t}onMessage(e){let t=this.makeRef();return this.stateChangeCallbacks.message.push([t,e]),t}onHeartbeat(e){this.heartbeatCallback=e}ping(e){if(!this.isConnected())return!1;let t=this.makeRef(),n=Date.now();this.push({topic:`phoenix`,event:`heartbeat`,payload:{},ref:t});let r=this.onMessage(i=>{i.ref===t&&(this.off([r]),e(Date.now()-n))});return!0}transportName(e){switch(e){case Xe:return`LongPoll`;default:return e.name}}transportConnect(){this.connectClock++,this.closeWasClean=!1;let e;this.authToken&&(e=[`phoenix`,`${We}${btoa(this.authToken()).replace(/=/g,``)}`]),this.conn=new this.transport(this.endPointURL(),e),this.conn.binaryType=this.binaryType,this.conn.timeout=this.longpollerTimeout,this.conn.onopen=()=>this.onConnOpen(),this.conn.onerror=e=>this.onConnError(e),this.conn.onmessage=e=>this.onConnMessage(e),this.conn.onclose=e=>this.onConnClose(e)}getSession(e){return this.sessionStore&&this.sessionStore.getItem(e)}storeSession(e,t){this.sessionStore&&this.sessionStore.setItem(e,t)}connectWithFallback(e,t=2500){clearTimeout(this.fallbackTimer);let n=!1,r=!0,i,a,o=this.transportName(e),s=t=>{this.log(`transport`,`falling back to ${o}...`,t),this.off([i,a]),r=!1,this.replaceTransport(e),this.transportConnect()};if(this.getSession(`phx:fallback:${o}`))return s(`memorized`);this.fallbackTimer=setTimeout(s,t),a=this.onError(e=>{this.log(`transport`,`error`,e),r&&!n&&(clearTimeout(this.fallbackTimer),s(e))}),this.fallbackRef&&this.off([this.fallbackRef]),this.fallbackRef=this.onOpen(()=>{if(n=!0,!r){let t=this.transportName(e);return this.primaryPassedHealthCheck||this.storeSession(`phx:fallback:${t}`,`true`),this.log(`transport`,`established ${t} fallback`)}clearTimeout(this.fallbackTimer),this.fallbackTimer=setTimeout(s,t),this.ping(e=>{this.log(`transport`,`connected to primary after`,e),this.primaryPassedHealthCheck=!0,clearTimeout(this.fallbackTimer)})}),this.transportConnect()}clearHeartbeats(){clearTimeout(this.heartbeatTimer),clearTimeout(this.heartbeatTimeoutTimer)}onConnOpen(){this.hasLogger()&&this.log(`transport`,`connected to ${this.endPointURL()}`),this.closeWasClean=!1,this.disconnecting=!1,this.establishedConnections++,this.flushSendBuffer(),this.reconnectTimer.reset(),this.autoSendHeartbeat&&this.resetHeartbeat(),this.triggerStateCallbacks(`open`)}heartbeatTimeout(){if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.hasLogger()&&this.log(`transport`,`heartbeat timeout. Attempting to re-establish connection`);try{this.heartbeatCallback(`timeout`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.triggerChanError(Error(`heartbeat timeout`)),this.closeWasClean=!1,this.teardown(()=>this.reconnectTimer.scheduleTimeout(),Re,`heartbeat timeout`)}}resetHeartbeat(){this.conn&&this.conn.skipHeartbeat||(this.pendingHeartbeatRef=null,this.clearHeartbeats(),this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}teardown(e,t,n){if(!this.conn)return e&&e();let r=this.conn;this.waitForBufferDone(r,()=>{t?r.close(t,n||``):r.close(),this.waitForSocketClosed(r,()=>{this.conn===r&&(this.conn.onopen=function(){},this.conn.onerror=function(){},this.conn.onmessage=function(){},this.conn.onclose=function(){},this.conn=null),e&&e()})})}waitForBufferDone(e,t,n=1){n===5||!e.bufferedAmount?t():setTimeout(()=>{this.waitForBufferDone(e,t,n+1)},150*n)}waitForSocketClosed(e,t,n=1){n===5||e.readyState===Be.closed?t():setTimeout(()=>{this.waitForSocketClosed(e,t,n+1)},150*n)}onConnClose(e){this.conn&&(this.conn.onclose=()=>{}),this.hasLogger()&&this.log(`transport`,`close`,e),this.triggerChanError(e),this.clearHeartbeats(),this.closeWasClean||this.reconnectTimer.scheduleTimeout(),this.triggerStateCallbacks(`close`,e)}onConnError(e){this.hasLogger()&&this.log(`transport`,`error`,e);let t=this.transport,n=this.establishedConnections;this.triggerStateCallbacks(`error`,e,t,n),(t===this.transport||n>0)&&this.triggerChanError(e)}triggerChanError(e){this.channels.forEach(t=>{t.isErrored()||t.isLeaving()||t.isClosed()||t.trigger(Ve.error,e)})}connectionState(){switch(this.conn&&this.conn.readyState){case Be.connecting:return`connecting`;case Be.open:return`open`;case Be.closing:return`closing`;default:return`closed`}}isConnected(){return this.connectionState()===`open`}remove(e){this.off(e.stateChangeRefs),this.channels=this.channels.filter(t=>t!==e)}off(e){for(let t in this.stateChangeCallbacks)this.stateChangeCallbacks[t]=this.stateChangeCallbacks[t].filter(([t])=>e.indexOf(t)===-1)}channel(e,t={}){let n=new qe(e,t,this);return this.channels.push(n),n}push(e){if(this.hasLogger()){let{topic:t,event:n,payload:r,ref:i,join_ref:a}=e;this.log(`push`,`${t} ${n} (${a}, ${i})`,r)}this.isConnected()?this.encode(e,e=>this.conn.send(e)):this.sendBuffer.push(()=>this.encode(e,e=>this.conn.send(e)))}makeRef(){let e=this.ref+1;return this.ref=e===this.ref?0:e,this.ref.toString()}sendHeartbeat(){if(!this.isConnected())try{this.heartbeatCallback(`disconnected`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}else if(this.pendingHeartbeatRef)this.heartbeatTimeout();else{this.pendingHeartbeatRef=this.makeRef(),this.heartbeatSentAt=Date.now(),this.push({topic:`phoenix`,event:`heartbeat`,payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback(`sent`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.heartbeatTimeoutTimer=setTimeout(()=>this.heartbeatTimeout(),this.heartbeatIntervalMs)}}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}onConnMessage(e){this.decode(e.data,e=>{let{topic:t,event:n,payload:r,ref:i,join_ref:a}=e;if(i&&i===this.pendingHeartbeatRef){let e=this.heartbeatSentAt?Date.now()-this.heartbeatSentAt:void 0;this.clearHeartbeats();try{this.heartbeatCallback(r.status===`ok`?`ok`:`error`,e)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.autoSendHeartbeat&&(this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}this.hasLogger()&&this.log(`receive`,`${r.status||``} ${t} ${n} ${i&&`(`+i+`)`||``}`.trim(),r);for(let e=0;e<this.channels.length;e++){let o=this.channels[e];o.isMember(t,n,r,a)&&o.trigger(n,r,i,a)}this.triggerStateCallbacks(`message`,e)})}triggerStateCallbacks(e,...t){try{this.stateChangeCallbacks[e].forEach(([n,r])=>{try{r(...t)}catch(t){this.log(`error`,`error in ${e} callback`,t)}})}catch(t){this.log(`error`,`error triggering ${e} callbacks`,t)}}leaveOpenTopic(e){let t=this.channels.find(t=>t.topic===e&&(t.isJoined()||t.isJoining()));t&&(this.hasLogger()&&this.log(`transport`,`leaving duplicate topic "${e}"`),t.leave())}},et=class e{constructor(t,n){let r=rt(n);this.presence=new Ze(t.getChannel(),r),this.presence.onJoin((n,r,i)=>{let a=e.onJoinPayload(n,r,i);t.getChannel().trigger(`presence`,a)}),this.presence.onLeave((n,r,i)=>{let a=e.onLeavePayload(n,r,i);t.getChannel().trigger(`presence`,a)}),this.presence.onSync(()=>{t.getChannel().trigger(`presence`,{event:`sync`})})}get state(){return e.transformState(this.presence.state)}static transformState(e){return e=nt(e),Object.getOwnPropertyNames(e).reduce((t,n)=>{let r=e[n];return t[n]=tt(r),t},{})}static onJoinPayload(e,t,n){return{event:`join`,key:e,currentPresences:it(t),newPresences:tt(n)}}static onLeavePayload(e,t,n){return{event:`leave`,key:e,currentPresences:it(t),leftPresences:tt(n)}}};function tt(e){return e.metas.map(e=>{let t=Object.getOwnPropertyDescriptors(e),n=Object.defineProperties({},t);return n.presence_ref=n.phx_ref,delete n.phx_ref,delete n.phx_ref_prev,n})}function nt(e){return JSON.parse(JSON.stringify(e))}function rt(e){return e?.events&&{events:e.events}}function it(e){return e?.metas?tt(e):[]}var at;(function(e){e.SYNC=`sync`,e.JOIN=`join`,e.LEAVE=`leave`})(at||={});var ot=class{get state(){return this.presenceAdapter.state}constructor(e,t){this.channel=e,this.presenceAdapter=new et(this.channel.channelAdapter,t)}};function st(e){if(e instanceof Error)return e;if(typeof e==`string`)return Error(e);if(e&&typeof e==`object`){let t=e;if(typeof t.code==`number`){let n=typeof t.reason==`string`&&t.reason?` (${t.reason})`:``;return Error(`socket closed: ${t.code}${n}`,{cause:e})}return Error(`channel error: transport failure`,{cause:e})}return Error(`channel error: connection lost`)}var ct=class{constructor(e,t,n){let r=lt(n);this.channel=e.getSocket().channel(t,r),this.socket=e}get state(){return this.channel.state}set state(e){this.channel.state=e}get joinedOnce(){return this.channel.joinedOnce}get joinPush(){return this.channel.joinPush}get rejoinTimer(){return this.channel.rejoinTimer}on(e,t){return this.channel.on(e,t)}off(e,t){this.channel.off(e,t)}subscribe(e){return this.channel.join(e)}unsubscribe(e){return this.channel.leave(e)}teardown(){this.channel.teardown()}onClose(e){this.channel.onClose(e)}onError(e){return this.channel.onError(e)}push(e,t,n){let r;try{r=this.channel.push(e,t,n)}catch{throw Error(`tried to push '${e}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`)}if(this.channel.pushBuffer.length>100){let e=this.channel.pushBuffer.shift();e.cancelTimeout(),this.socket.log(`channel`,`discarded push due to buffer overflow: ${e.event}`,e.payload())}return r}updateJoinPayload(e){let t=this.channel.joinPush.payload();this.channel.joinPush.payload=()=>Object.assign(Object.assign({},t),e)}canPush(){return this.socket.isConnected()&&this.state===ve.joined}isJoined(){return this.state===ve.joined}isJoining(){return this.state===ve.joining}isClosed(){return this.state===ve.closed}isLeaving(){return this.state===ve.leaving}updateFilterBindings(e){this.channel.filterBindings=e}updatePayloadTransform(e){this.channel.onMessage=e}getChannel(){return this.channel}};function lt(e){return{config:Object.assign({broadcast:{ack:!1,self:!1},presence:{key:``,enabled:!1},private:!1},e.config)}}var ut=/[,()"\\]/,dt=e=>ut.test(e)||e!==e.trim(),ft=e=>`"${e.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`)}"`,pt=e=>{let t=e===null?`null`:String(e);return dt(t)?ft(t):t},mt=e=>e===null?`null`:String(e),ht=(e,t)=>{if(e===`in`){let e=Array.isArray(t)?t:[t];if(e.length===0)throw Error("Realtime `in` filter requires at least one value.");return`in.(${Array.from(new Set(e)).map(e=>pt(e)).join(`,`)})`}return e===`is`?`is.${mt(t)}`:`${e}.${pt(t)}`},gt=class{constructor(){this.filters=[]}add(e,t,n,r=!1){let i=r?`not.`:``;return this.filters.push(`${e}=${i}${ht(t,n)}`),this}eq(e,t){return this.add(e,`eq`,t)}neq(e,t){return this.add(e,`neq`,t)}gt(e,t){return this.add(e,`gt`,t)}gte(e,t){return this.add(e,`gte`,t)}lt(e,t){return this.add(e,`lt`,t)}lte(e,t){return this.add(e,`lte`,t)}in(e,t){return this.add(e,`in`,t)}like(e,t){return this.add(e,`like`,t)}ilike(e,t){return this.add(e,`ilike`,t)}match(e,t){return this.add(e,`match`,t)}imatch(e,t){return this.add(e,`imatch`,t)}is(e,t){return this.add(e,`is`,t)}isDistinct(e,t){return this.add(e,`isdistinct`,t)}not(e,t,n){return this.add(e,t,n,!0)}build(){return this.filters.join(`,`)}toString(){return this.build()}},_t;(function(e){e.ALL=`*`,e.INSERT=`INSERT`,e.UPDATE=`UPDATE`,e.DELETE=`DELETE`})(_t||={});var vt;(function(e){e.BROADCAST=`broadcast`,e.PRESENCE=`presence`,e.POSTGRES_CHANGES=`postgres_changes`,e.SYSTEM=`system`})(vt||={});var yt;(function(e){e.SUBSCRIBED=`SUBSCRIBED`,e.TIMED_OUT=`TIMED_OUT`,e.CLOSED=`CLOSED`,e.CHANNEL_ERROR=`CHANNEL_ERROR`})(yt||={});var bt=class e{get state(){return this.channelAdapter.state}set state(e){this.channelAdapter.state=e}get joinedOnce(){return this.channelAdapter.joinedOnce}get timeout(){return this.socket.timeout}get joinPush(){return this.channelAdapter.joinPush}get rejoinTimer(){return this.channelAdapter.rejoinTimer}constructor(e,t={config:{}},n){if(this.topic=e,this.params=t,this.socket=n,this.bindings={},this.subTopic=e.replace(/^realtime:/i,``),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:``,enabled:!1},private:!1},t.config),this.channelAdapter=new ct(this.socket.socketAdapter,e,this.params),this.presence=new ot(this),this._onClose(()=>{this.socket._remove(this)}),this._updateFilterTransform(),this.broadcastEndpointURL=je(this.socket.socketAdapter.endPointURL()),this.private=this.params.config.private||!1,!this.private&&this.params.config?.broadcast?.replay)throw Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`)}subscribe(e,t=this.timeout){if(this.socket.isConnected()||this.socket.connect(),this.channelAdapter.isClosed()){let{config:{broadcast:n,presence:r,private:i,postgres_changes_options:a}}=this.params,o=this.bindings.postgres_changes?.map(e=>e.filter)??[],s=!!this.bindings[vt.PRESENCE]&&this.bindings[vt.PRESENCE].length>0||this.params.config.presence?.enabled===!0,c={},l=Object.assign({broadcast:n,presence:Object.assign(Object.assign({},r),{enabled:s}),postgres_changes:o,private:i},a?{postgres_changes_options:a}:{});this.socket.accessTokenValue&&(c.access_token=this.socket.accessTokenValue),this._onError(t=>{e?.(yt.CHANNEL_ERROR,st(t))}),this._onClose(()=>e?.(yt.CLOSED)),this.updateJoinPayload(Object.assign({config:l},c)),this._updateFilterMessage();let u=a?.wait&&o.length>0?Math.max(t,(a.timeout??ge)+_e):t;this.channelAdapter.subscribe(u).receive(`ok`,async({postgres_changes:t})=>{this.socket._isManualToken()||this.socket.setAuth(),t===void 0?e?.(yt.SUBSCRIBED):this._updatePostgresBindings(t,e)}).receive(`error`,t=>{this.state=ve.errored;let n=Object.values(t).join(`, `)||`error`;e?.(yt.CHANNEL_ERROR,Error(n,{cause:t}))}).receive(`timeout`,()=>{e?.(yt.TIMED_OUT)})}return this}_updatePostgresBindings(t,n){let r=this.bindings.postgres_changes,i=r?.length??0,a=[];for(let o=0;o<i;o++){let i=r[o],{filter:{event:s,schema:c,table:l,filter:u}}=i,d=t&&t[o];if(d&&d.event===s&&e.isFilterValueEqual(d.schema,c)&&e.isFilterValueEqual(d.table,l)&&e.isFilterValueEqual(d.filter,u))a.push(Object.assign(Object.assign({},i),{id:d.id}));else{this.unsubscribe(),this.state=ve.errored,n?.(yt.CHANNEL_ERROR,Error(`mismatch between server and client bindings for postgres changes`));return}}this.bindings.postgres_changes=a,this.state!=ve.errored&&n&&n(yt.SUBSCRIBED)}presenceState(){return this.presence.state}async track(e,t={}){return await this.send({type:`presence`,event:`track`,payload:e},t)}async untrack(e={}){return await this.send({type:`presence`,event:`untrack`},e)}on(e,t,n){let r=this.channelAdapter.isJoined()||this.channelAdapter.isJoining(),i=e===vt.PRESENCE||e===vt.POSTGRES_CHANGES;if(r&&i)throw this.socket.log(`channel`,`cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`),Error(`cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`);return this._on(e,t,n)}async httpSend(e,t,n={}){if(t==null)return Promise.reject(Error(`Payload is required for httpSend()`));let r=t instanceof ArrayBuffer||ArrayBuffer.isView(t),i={apikey:this.socket.apiKey?this.socket.apiKey:``,"Content-Type":r?`application/octet-stream`:`application/json`};this.socket.accessTokenValue&&(i.Authorization=`Bearer ${this.socket.accessTokenValue}`);let a=new URL(this.broadcastEndpointURL);a.pathname+=`/${encodeURIComponent(this.subTopic)}/events/${encodeURIComponent(e)}`,this.private&&a.searchParams.set(`private`,`true`);let o={method:`POST`,headers:i,body:r?t:JSON.stringify(t)},s=await this._fetchWithTimeout(a.toString(),o,n.timeout??this.timeout);if(s.status===202)return{success:!0};if(s.status===404)return Promise.reject(Error(`httpSend() requires Realtime server v2.97.0 or newer; the endpoint returned 404. Update your Supabase CLI to a recent version, or upgrade the Realtime server in your self-hosted setup. See https://github.com/supabase/supabase-js/blob/master/packages/core/realtime-js/migrations/httpsend-server-version.md`));let c=s.statusText;try{let e=await s.json();c=e.error||e.message||c}catch{}return Promise.reject(Error(c))}async send(e,t={}){if(!this.channelAdapter.canPush()&&e.type===`broadcast`){let n=`Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.`;this.socket.hasLogger()?this.socket.log(`channel`,n):console.warn(n);let{event:r,payload:i}=e,a={apikey:this.socket.apiKey?this.socket.apiKey:``,"Content-Type":`application/json`};this.socket.accessTokenValue&&(a.Authorization=`Bearer ${this.socket.accessTokenValue}`);let o={method:`POST`,headers:a,body:JSON.stringify({messages:[{topic:this.subTopic,event:r,payload:i,private:this.private}]})};try{let e=await this._fetchWithTimeout(this.broadcastEndpointURL,o,t.timeout??this.timeout);return await e.body?.cancel(),e.ok?`ok`:`error`}catch(e){return e instanceof Error&&e.name===`AbortError`?`timed out`:`error`}}return new Promise(n=>{let r=this.channelAdapter.push(e.type,e,t.timeout||this.timeout);e.type===`broadcast`&&!this.params?.config?.broadcast?.ack&&n(`ok`),r.receive(`ok`,()=>n(`ok`)),r.receive(`error`,()=>n(`error`)),r.receive(`timeout`,()=>n(`timed out`))})}updateJoinPayload(e){this.channelAdapter.updateJoinPayload(e)}async unsubscribe(e=this.timeout){return new Promise(t=>{this.channelAdapter.unsubscribe(e).receive(`ok`,()=>t(`ok`)).receive(`timeout`,()=>t(`timed out`)).receive(`error`,()=>t(`error`))})}teardown(){this.channelAdapter.teardown()}async _fetchWithTimeout(e,t,n){let r=new AbortController,i=setTimeout(()=>r.abort(),n),a=await this.socket.fetch(e,Object.assign(Object.assign({},t),{signal:r.signal}));return clearTimeout(i),a}_on(t,n,r){let i=t.toLocaleLowerCase(),a=n?.filter;if((a instanceof gt||typeof a==`object`&&a&&typeof a.build==`function`)&&(n=Object.assign(Object.assign({},n),{filter:a.build()})),i===vt.POSTGRES_CHANGES&&this.bindings[i]?.find(t=>e.isSamePostgresFilter(t.filter,n)))return this.socket.log(`error`,`duplicate \`postgres_changes\` binding for ${this.topic} ignored`,n),this;let o=this.channelAdapter.on(t,r),s={type:i,filter:n,callback:r,ref:o};return this.bindings[i]?this.bindings[i].push(s):this.bindings[i]=[s],this._updateFilterMessage(),this}_onClose(e){this.channelAdapter.onClose(e)}_onError(e){this.channelAdapter.onError(e)}_updateFilterMessage(){this.channelAdapter.updateFilterBindings((e,t,n)=>{let r=e.event.toLocaleLowerCase();if(this._notThisChannelEvent(r,n))return!1;let i=this.bindings[r]?.find(t=>t.ref===e.ref);if(!i)return!0;if([`broadcast`,`presence`,`postgres_changes`].includes(r)){if(`id`in i){let e=i.id,n=i.filter?.event;return e&&t.ids?.includes(e)&&(n===`*`||n?.toLocaleLowerCase()===t.data?.type.toLocaleLowerCase())}{let e=(i?.filter?.event)?.toLocaleLowerCase();return e===`*`||e===(t?.event)?.toLocaleLowerCase()}}return i.type.toLocaleLowerCase()===r})}_notThisChannelEvent(e,t){let{close:n,error:r,leave:i,join:a}=ye;return t&&[n,r,i,a].includes(e)&&t!==this.joinPush.ref}_updateFilterTransform(){this.channelAdapter.updatePayloadTransform((e,t,n)=>{if(typeof t==`object`&&`ids`in t){let e=t.data,{schema:n,table:r,commit_timestamp:i,type:a,errors:o}=e;return Object.assign(Object.assign({},{schema:n,table:r,commit_timestamp:i,eventType:a,new:{},old:{},errors:o}),this._getPayloadRecords(e))}return t})}copyBindings(e){if(this.joinedOnce)throw Error(`cannot copy bindings into joined channel`);for(let t in e.bindings)for(let n of e.bindings[t])this._on(n.type,n.filter,n.callback)}static isFilterValueEqual(e,t){return(e??void 0)===(t??void 0)}static isSamePostgresFilter(t,n){let r=(t?.select)?.join()??void 0,i=(n?.select)?.join()??void 0;return t?.event===n?.event&&e.isFilterValueEqual(t?.schema,n?.schema)&&e.isFilterValueEqual(t?.table,n?.table)&&e.isFilterValueEqual(t?.filter,n?.filter)&&r===i}_getPayloadRecords(e){let t={new:{},old:{}};return(e.type===`INSERT`||e.type===`UPDATE`)&&(t.new=Se(e.columns,e.record)),(e.type===`UPDATE`||e.type===`DELETE`)&&(t.old=Se(e.columns,e.old_record)),t}},xt=class{constructor(e,t){this.socket=new $e(e,t)}get timeout(){return this.socket.timeout}get endPoint(){return this.socket.endPoint}get transport(){return this.socket.transport}get heartbeatIntervalMs(){return this.socket.heartbeatIntervalMs}get heartbeatCallback(){return this.socket.heartbeatCallback}set heartbeatCallback(e){this.socket.heartbeatCallback=e}get heartbeatTimer(){return this.socket.heartbeatTimer}get pendingHeartbeatRef(){return this.socket.pendingHeartbeatRef}get reconnectTimer(){return this.socket.reconnectTimer}get vsn(){return this.socket.vsn}get encode(){return this.socket.encode}get decode(){return this.socket.decode}get reconnectAfterMs(){return this.socket.reconnectAfterMs}get sendBuffer(){return this.socket.sendBuffer}get stateChangeCallbacks(){return this.socket.stateChangeCallbacks}connect(){this.socket.connect()}disconnect(e,t,n,r=1e4){return new Promise(i=>{setTimeout(()=>i(`timeout`),r),this.socket.disconnect(()=>{e(),i(`ok`)},t,n)})}push(e){this.socket.push(e)}log(e,t,n){this.socket.log(e,t,n)}hasLogger(){return this.socket.hasLogger()}makeRef(){return this.socket.makeRef()}onOpen(e){this.socket.onOpen(e)}onClose(e){this.socket.onClose(e)}onError(e){this.socket.onError(e)}onMessage(e){this.socket.onMessage(e)}isConnected(){return this.socket.isConnected()}isConnecting(){return this.socket.connectionState()==be.connecting}isDisconnecting(){return this.socket.connectionState()==be.closing}connectionState(){return this.socket.connectionState()}endPointURL(){return this.socket.endPointURL()}sendHeartbeat(){this.socket.sendHeartbeat()}getSocket(){return this.socket}},St={HEARTBEAT_INTERVAL:25e3,RECONNECT_DELAY:10,HEARTBEAT_TIMEOUT_FALLBACK:100},Ct=[1e3,2e3,5e3,1e4],wt=1e4;function Tt(){let e=new Map;return{get length(){return e.size},clear(){e.clear()},getItem(t){return e.has(t)?e.get(t):null},key(t){return Array.from(e.keys())[t]??null},removeItem(t){e.delete(t)},setItem(t,n){e.set(t,String(n))}}}function Et(){try{if(typeof globalThis<`u`&&globalThis.sessionStorage)return globalThis.sessionStorage}catch{}return Tt()}var Dt=`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`,Ot=class{get endPoint(){return this.socketAdapter.endPoint}get timeout(){return this.socketAdapter.timeout}get transport(){return this.socketAdapter.transport}get heartbeatCallback(){return this.socketAdapter.heartbeatCallback}get heartbeatIntervalMs(){return this.socketAdapter.heartbeatIntervalMs}get heartbeatTimer(){return this.worker?this._workerHeartbeatTimer:this.socketAdapter.heartbeatTimer}get pendingHeartbeatRef(){return this.worker?this._pendingWorkerHeartbeatRef:this.socketAdapter.pendingHeartbeatRef}get reconnectTimer(){return this.socketAdapter.reconnectTimer}get vsn(){return this.socketAdapter.vsn}get encode(){return this.socketAdapter.encode}get decode(){return this.socketAdapter.decode}get reconnectAfterMs(){return this.socketAdapter.reconnectAfterMs}get sendBuffer(){return this.socketAdapter.sendBuffer}get stateChangeCallbacks(){return this.socketAdapter.stateChangeCallbacks}constructor(e,t){if(this.channels=[],this.accessTokenValue=null,this.accessToken=null,this.apiKey=null,this.httpEndpoint=``,this.headers={},this.params={},this.ref=0,this.serializer=new xe,this._manuallySetToken=!1,this._authPromise=null,this._authGeneration=0,this._workerHeartbeatTimer=void 0,this._pendingWorkerHeartbeatRef=null,this._pendingDisconnectTimer=null,this._disconnectOnEmptyChannelsAfterMs=0,this._resolveFetch=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),!t?.params?.apikey)throw Error(`API key is required to connect to Realtime`);this.apiKey=t.params.apikey;let n=this._initializeOptions(t);this.socketAdapter=new xt(e,n),this.httpEndpoint=je(e),this.fetch=this._resolveFetch(t?.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||this.isConnected())){this.accessToken&&!this._authPromise&&this._setAuthSafely(`connect`),this._setupConnectionHandlers();try{this.socketAdapter.connect()}catch(e){let t=e.message;throw Error(`WebSocket not available: ${t}`)}this._handleNodeJsRaceCondition()}}endpointURL(){return this.socketAdapter.endPointURL()}async disconnect(e,t){return this._cancelPendingDisconnect(),this.isDisconnecting()?`ok`:await this.socketAdapter.disconnect(()=>{clearInterval(this._workerHeartbeatTimer),this._terminateWorker()},e,t)}getChannels(){return this.channels}async removeChannel(e){let t=await e.unsubscribe();return t===`ok`&&e.teardown(),t}async removeAllChannels(){let e=this.channels.map(async e=>{let t=await e.unsubscribe();return e.teardown(),t}),t=await Promise.all(e);return await this.disconnect(),t}log(e,t,n){this.socketAdapter.log(e,t,n)}hasLogger(){return this.socketAdapter.hasLogger()}connectionState(){return this.socketAdapter.connectionState()||be.closed}isConnected(){return this.socketAdapter.isConnected()}isConnecting(){return this.socketAdapter.isConnecting()}isDisconnecting(){return this.socketAdapter.isDisconnecting()}channel(e,t={config:{}}){let n=`realtime:${e}`,r=this.getChannels().find(e=>e.topic===n);if(r)return r;{let n=new bt(`realtime:${e}`,t,this);return this._cancelPendingDisconnect(),this.channels.push(n),n}}push(e){this.socketAdapter.push(e)}async setAuth(e=null){let t=++this._authGeneration,n=this._performAuth(e,t);t===this._authGeneration&&(this._authPromise=n);try{await n}finally{this._authPromise===n&&(this._authPromise=null)}}_isManualToken(){return this._manuallySetToken}async sendHeartbeat(){this.socketAdapter.sendHeartbeat()}onHeartbeat(e){this.socketAdapter.heartbeatCallback=this._wrapHeartbeatCallback(e)}_makeRef(){return this.socketAdapter.makeRef()}_remove(e){this.channels=this.channels.filter(t=>t.topic!==e.topic),this.channels.length===0&&(this.log(`transport`,`no channels remaining, scheduling disconnect`),this._schedulePendingDisconnect())}_schedulePendingDisconnect(){this._cancelPendingDisconnect(),this._disconnectOnEmptyChannelsAfterMs===0?(this.log(`transport`,`disconnecting immediately - no channels`),this.disconnect()):(this._pendingDisconnectTimer=setTimeout(()=>{this._pendingDisconnectTimer=null,this.channels.length===0&&(this.log(`transport`,`deferred disconnect fired - no channels, disconnecting`),this.disconnect())},this._disconnectOnEmptyChannelsAfterMs),this.log(`transport`,`deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`))}_cancelPendingDisconnect(){this._pendingDisconnectTimer!==null&&(this.log(`transport`,`pending disconnect cancelled - channel activity detected`),clearTimeout(this._pendingDisconnectTimer),this._pendingDisconnectTimer=null)}async _performAuth(e,t){let n,r=!1;if(e)n=e,r=!0;else if(this.accessToken)try{n=await this.accessToken()}catch(e){this.log(`error`,`Error fetching access token from callback`,e),n=this.accessTokenValue}else n=this.accessTokenValue;t===this._authGeneration&&(this.accessToken?this._manuallySetToken=!1:r&&(this._manuallySetToken=!0),this.accessTokenValue!=n&&(this.accessTokenValue=n,this.channels.forEach(e=>{let t={access_token:n,version:de};e.updateJoinPayload(t),e.joinedOnce&&e.channelAdapter.isJoined()&&e.channelAdapter.push(ye.access_token,{access_token:n})})))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(e=`general`){this._isManualToken()||this.setAuth().catch(t=>{this.log(`error`,`Error setting auth in ${e}`,t)})}_setupConnectionHandlers(){this.socketAdapter.onOpen(()=>{(this._authPromise||(this.accessToken&&!this.accessTokenValue?this.setAuth():Promise.resolve())).catch(e=>{this.log(`error`,`error waiting for auth on connect`,e)}),this.worker&&!this.workerRef&&this._startWorkerHeartbeat()}),this.socketAdapter.onClose(()=>{this.worker&&this.workerRef&&this._terminateWorker()}),this.socketAdapter.onMessage(e=>{e.ref&&e.ref===this._pendingWorkerHeartbeatRef&&(this._pendingWorkerHeartbeatRef=null)})}_handleNodeJsRaceCondition(){this.socketAdapter.isConnected()&&this.socketAdapter.getSocket().onConnOpen()}_wrapHeartbeatCallback(e){return(t,n)=>{t!==`disconnected`&&(t==`sent`&&this._setAuthSafely(),e&&e(t,n))}}_startWorkerHeartbeat(){this.workerUrl?this.log(`worker`,`starting worker for from ${this.workerUrl}`):this.log(`worker`,`starting default worker`);let e=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(e),this.workerRef.onerror=e=>{this.log(`worker`,`worker error`,e.message),this._terminateWorker(),this.disconnect()},this.workerRef.onmessage=e=>{e.data.event===`keepAlive`&&this.sendHeartbeat()},this.workerRef.postMessage({event:`start`,interval:this.heartbeatIntervalMs})}_terminateWorker(){this.workerRef&&=(this.log(`worker`,`terminating worker`),this.workerRef.terminate(),void 0)}_workerObjectUrl(e){let t;if(e)t=e;else{let e=new Blob([Dt],{type:`application/javascript`});t=URL.createObjectURL(e)}return t}_initializeOptions(e){this.worker=e?.worker??!1,this.accessToken=e?.accessToken??null;let t={};t.timeout=e?.timeout??he,t.heartbeatIntervalMs=e?.heartbeatIntervalMs??St.HEARTBEAT_INTERVAL,this._disconnectOnEmptyChannelsAfterMs=e?.disconnectOnEmptyChannelsAfterMs??2*(e?.heartbeatIntervalMs??St.HEARTBEAT_INTERVAL),t.transport=e?.transport??ue.getWebSocketConstructor(),t.params=e?.params,t.logger=e?.logger,t.heartbeatCallback=this._wrapHeartbeatCallback(e?.heartbeatCallback),t.sessionStorage=e?.sessionStorage??Et(),t.reconnectAfterMs=e?.reconnectAfterMs??(e=>Ct[e-1]||wt);let n,r,i=e?.vsn??me;switch(i){case fe:n=(e,t)=>t(JSON.stringify(e)),r=(e,t)=>t(JSON.parse(e));break;case pe:n=this.serializer.encode.bind(this.serializer),r=this.serializer.decode.bind(this.serializer);break;default:throw Error(`Unsupported serializer version: ${t.vsn}`)}if(t.vsn=i,t.encode=e?.encode??n,t.decode=e?.decode??r,t.beforeReconnect=this._reconnectAuth.bind(this),(e?.logLevel||e?.log_level)&&(this.logLevel=e.logLevel||e.log_level,t.params=Object.assign(Object.assign({},t.params),{log_level:this.logLevel})),this.worker){if(typeof window<`u`&&!window.Worker)throw Error(`Web Worker is not supported`);this.workerUrl=e?.workerUrl,t.autoSendHeartbeat=!this.worker}return t}async _reconnectAuth(){await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()}},kt=class extends Error{constructor(e,t){super(e),this.name=`IcebergError`,this.status=t.status,this.icebergType=t.icebergType,this.icebergCode=t.icebergCode,this.details=t.details,this.isCommitStateUnknown=t.icebergType===`CommitStateUnknownException`||[500,502,504].includes(t.status)&&t.icebergType?.includes(`CommitState`)===!0}isNotFound(){return this.status===404}isConflict(){return this.status===409}isAuthenticationTimeout(){return this.status===419}};function At(e,t,n){let r=new URL(t,e);if(n)for(let[e,t]of Object.entries(n))t!==void 0&&r.searchParams.set(e,t);return r.toString()}async function jt(e){return!e||e.type===`none`?{}:e.type===`bearer`?{Authorization:`Bearer ${e.token}`}:e.type===`header`?{[e.name]:e.value}:e.type===`custom`?await e.getHeaders():{}}function Mt(e){let t=e.fetchImpl??globalThis.fetch;return{async request({method:n,path:r,query:i,body:a,headers:o}){let s=At(e.baseUrl,r,i),c=await jt(e.auth),l=await t(s,{method:n,headers:{...a?{"Content-Type":`application/json`}:{},...c,...o},body:a?JSON.stringify(a):void 0}),u=await l.text(),d=(l.headers.get(`content-type`)||``).includes(`application/json`),f=d&&u?JSON.parse(u):u;if(!l.ok){let e=d?f:void 0,t=e?.error;throw new kt(t?.message??`Request failed with status ${l.status}`,{status:l.status,icebergType:t?.type,icebergCode:t?.code,details:e})}return{status:l.status,headers:l.headers,data:f}}}}function Nt(e){return e.join(``)}var Pt=class{constructor(e,t=``){this.client=e,this.prefix=t}async listNamespaces(e){let t=e?{parent:Nt(e.namespace)}:void 0;return(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces`,query:t})).data.namespaces.map(e=>({namespace:e}))}async createNamespace(e,t){let n={namespace:e.namespace,properties:t?.properties};return(await this.client.request({method:`POST`,path:`${this.prefix}/namespaces`,body:n})).data}async dropNamespace(e){await this.client.request({method:`DELETE`,path:`${this.prefix}/namespaces/${Nt(e.namespace)}`})}async loadNamespaceMetadata(e){return{properties:(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${Nt(e.namespace)}`})).data.properties}}async namespaceExists(e){try{return await this.client.request({method:`HEAD`,path:`${this.prefix}/namespaces/${Nt(e.namespace)}`}),!0}catch(e){if(e instanceof kt&&e.status===404)return!1;throw e}}async createNamespaceIfNotExists(e,t){try{return await this.createNamespace(e,t)}catch(e){if(e instanceof kt&&e.status===409)return;throw e}}};function Ft(e){return e.join(``)}var It=class{constructor(e,t=``,n){this.client=e,this.prefix=t,this.accessDelegation=n}async listTables(e){return(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${Ft(e.namespace)}/tables`})).data.identifiers}async createTable(e,t){let n={};return this.accessDelegation&&(n[`X-Iceberg-Access-Delegation`]=this.accessDelegation),(await this.client.request({method:`POST`,path:`${this.prefix}/namespaces/${Ft(e.namespace)}/tables`,body:t,headers:n})).data.metadata}async updateTable(e,t){let n=await this.client.request({method:`POST`,path:`${this.prefix}/namespaces/${Ft(e.namespace)}/tables/${e.name}`,body:t});return{"metadata-location":n.data[`metadata-location`],metadata:n.data.metadata}}async dropTable(e,t){await this.client.request({method:`DELETE`,path:`${this.prefix}/namespaces/${Ft(e.namespace)}/tables/${e.name}`,query:{purgeRequested:String(t?.purge??!1)}})}async loadTable(e){let t={};return this.accessDelegation&&(t[`X-Iceberg-Access-Delegation`]=this.accessDelegation),(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${Ft(e.namespace)}/tables/${e.name}`,headers:t})).data.metadata}async tableExists(e){let t={};this.accessDelegation&&(t[`X-Iceberg-Access-Delegation`]=this.accessDelegation);try{return await this.client.request({method:`HEAD`,path:`${this.prefix}/namespaces/${Ft(e.namespace)}/tables/${e.name}`,headers:t}),!0}catch(e){if(e instanceof kt&&e.status===404)return!1;throw e}}async createTableIfNotExists(e,t){try{return await this.createTable(e,t)}catch(n){if(n instanceof kt&&n.status===409)return await this.loadTable({namespace:e.namespace,name:t.name});throw n}}},Lt=class{constructor(e){let t=`v1`;e.catalogName&&(t+=`/${e.catalogName}`);let n=e.baseUrl.endsWith(`/`)?e.baseUrl:`${e.baseUrl}/`;this.client=Mt({baseUrl:n,auth:e.auth,fetchImpl:e.fetch}),this.accessDelegation=e.accessDelegation?.join(`,`),this.namespaceOps=new Pt(this.client,t),this.tableOps=new It(this.client,t,this.accessDelegation)}async listNamespaces(e){return this.namespaceOps.listNamespaces(e)}async createNamespace(e,t){return this.namespaceOps.createNamespace(e,t)}async dropNamespace(e){await this.namespaceOps.dropNamespace(e)}async loadNamespaceMetadata(e){return this.namespaceOps.loadNamespaceMetadata(e)}async listTables(e){return this.tableOps.listTables(e)}async createTable(e,t){return this.tableOps.createTable(e,t)}async updateTable(e,t){return this.tableOps.updateTable(e,t)}async dropTable(e,t){await this.tableOps.dropTable(e,t)}async loadTable(e){return this.tableOps.loadTable(e)}async namespaceExists(e){return this.namespaceOps.namespaceExists(e)}async tableExists(e){return this.tableOps.tableExists(e)}async createNamespaceIfNotExists(e,t){return this.namespaceOps.createNamespaceIfNotExists(e,t)}async createTableIfNotExists(e,t){return this.tableOps.createTableIfNotExists(e,t)}};function Rt(e){"@babel/helpers - typeof";return Rt=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},Rt(e)}function zt(e,t){if(Rt(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(Rt(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function Bt(e){var t=zt(e,`string`);return Rt(t)==`symbol`?t:t+``}function Vt(e,t,n){return(t=Bt(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Ht(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function T(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Ht(Object(n),!0).forEach(function(t){Vt(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Ht(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var Ut=class extends Error{constructor(e,t=`storage`,n,r){super(e),this.__isStorageError=!0,this.namespace=t,this.name=t===`vectors`?`StorageVectorsError`:`StorageError`,this.status=n,this.statusCode=r}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}};function Wt(e){return typeof e==`object`&&!!e&&`__isStorageError`in e}var Gt=class extends Ut{constructor(e,t,n,r=`storage`,i){super(e,r,t,n),this.name=r===`vectors`?`StorageVectorsApiError`:`StorageApiError`,this.status=t,this.statusCode=n,this.code=i}toJSON(){return T(T({},super.toJSON()),{},{code:this.code})}},Kt=class extends Ut{constructor(e,t,n=`storage`){super(e,n),this.name=n===`vectors`?`StorageVectorsUnknownError`:`StorageUnknownError`,this.originalError=t}};function qt(e,t,n){let r=T({},e),i=t.toLowerCase();for(let e of Object.keys(r))e.toLowerCase()===i&&delete r[e];return r[i]=n,r}function Jt(e){let t={};for(let[n,r]of Object.entries(e))t[n.toLowerCase()]=r;return t}var Yt=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),Xt=e=>{if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)},Zt=e=>{if(Array.isArray(e))return e.map(e=>Zt(e));if(typeof e==`function`||e!==Object(e))return e;let t={};return Object.entries(e).forEach(([e,n])=>{let r=e.replace(/([-_][a-z])/gi,e=>e.toUpperCase().replace(/[-_]/g,``));t[r]=Zt(n)}),t},Qt=e=>!e||typeof e!=`string`||e.length===0||e.length>100||e.trim()!==e||e.includes(`/`)||e.includes(`\\`)?!1:/^[\w!.\*'() &$@=;:+,?-]+$/.test(e),$t=e=>e.split(`/`).map(encodeURIComponent).join(`/`),en=e=>{if(typeof e==`object`&&e){let t=e;if(typeof t.msg==`string`)return t.msg;if(typeof t.message==`string`)return t.message;if(typeof t.error_description==`string`)return t.error_description;if(typeof t.error==`string`)return t.error;if(typeof t.error==`object`&&t.error!==null){let e=t.error;if(typeof e.message==`string`)return e.message}}return JSON.stringify(e)},tn=async(e,t,n,r)=>{if(typeof e==`object`&&e&&`json`in e&&typeof e.json==`function`){let n=e,i=parseInt(String(n.status),10);Number.isFinite(i)||(i=500),n.json().then(e=>{let n=e?.statusCode||e?.code||i+``;t(new Gt(en(e),i,n,r,e?.code))}).catch(()=>{let e=i+``;t(new Gt(n.statusText||`HTTP ${i} error`,i,e,r))})}else t(new Kt(en(e),e,r))},nn=(e,t,n,r)=>{let i={method:e,headers:t?.headers||{}};if(e===`GET`||e===`HEAD`||!r)return T(T({},i),n);if(Xt(r)){let e=t?.headers||{},n;for(let[t,r]of Object.entries(e))t.toLowerCase()===`content-type`&&(n=r);i.headers=qt(e,`Content-Type`,n??`application/json`),i.body=JSON.stringify(r)}else i.body=r;return t?.duplex&&(i.duplex=t.duplex),T(T({},i),n)};async function rn(e,t,n,r,i,a,o){return new Promise((s,c)=>{e(n,nn(t,r,i,a)).then(e=>{if(!e.ok)throw e;if(r?.noResolveJson)return e;if(o===`vectors`){let t=e.headers.get(`content-type`);if(e.headers.get(`content-length`)===`0`||e.status===204||!t||!t.includes(`application/json`))return{}}return e.json()}).then(e=>s(e)).catch(e=>tn(e,c,r,o))})}function an(e=`storage`){return{get:async(t,n,r,i)=>rn(t,`GET`,n,r,i,void 0,e),post:async(t,n,r,i,a)=>rn(t,`POST`,n,i,a,r,e),put:async(t,n,r,i,a)=>rn(t,`PUT`,n,i,a,r,e),head:async(t,n,r,i)=>rn(t,`HEAD`,n,T(T({},r),{},{noResolveJson:!0}),i,void 0,e),remove:async(t,n,r,i,a)=>rn(t,`DELETE`,n,i,a,r,e)}}var{get:on,post:sn,put:cn,head:ln,remove:un}=an(`storage`),E=an(`vectors`),dn=class{constructor(e,t={},n,r=`storage`){this.shouldThrowOnError=!1,this.url=e,this.headers=Jt(t),this.fetch=Yt(n),this.namespace=r}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(e,t){return this.headers=qt(this.headers,e,t),this}async handleOperation(e){var t=this;try{return{data:await e(),error:null}}catch(e){if(t.shouldThrowOnError)throw e;if(Wt(e))return{data:null,error:e};throw e}}},fn=Symbol.toStringTag,pn=class{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t,this[fn]=`StreamDownloadBuilder`,this.promise=null}then(e,t){return this.getPromise().then(e,t)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||=this.execute(),this.promise}async execute(){var e=this;try{return{data:(await e.downloadFn()).body,error:null}}catch(t){if(e.shouldThrowOnError)throw t;if(Wt(t))return{data:null,error:t};throw t}}},mn=Symbol.toStringTag,hn=class{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t,this[mn]=`BlobDownloadBuilder`,this.promise=null}asStream(){return new pn(this.downloadFn,this.shouldThrowOnError)}then(e,t){return this.getPromise().then(e,t)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||=this.execute(),this.promise}async execute(){var e=this;try{return{data:await(await e.downloadFn()).blob(),error:null}}catch(t){if(e.shouldThrowOnError)throw t;if(Wt(t))return{data:null,error:t};throw t}}},gn={limit:100,offset:0,sortBy:{column:`name`,order:`asc`}},_n={cacheControl:`3600`,contentType:`text/plain;charset=UTF-8`,upsert:!1},vn=class extends dn{constructor(e,t={},n,r){super(e,t,r,`storage`),this.bucketId=n}async uploadOrUpdate(e,t,n,r){var i=this;return i.handleOperation(async()=>{let a,o=T(T({},_n),r),s=T(T({},i.headers),e===`POST`&&{"x-upsert":String(o.upsert)}),c=o.metadata;if(typeof Blob<`u`&&n instanceof Blob||typeof FormData<`u`&&n instanceof FormData?a=i.prepareUploadFormData(n,o):(a=n,s[`cache-control`]=`max-age=${o.cacheControl}`,s[`content-type`]=o.contentType,o.contentEncoding&&(s[`content-encoding`]=o.contentEncoding),c&&(s[`x-metadata`]=i.toBase64(i.encodeMetadata(c))),(typeof ReadableStream<`u`&&a instanceof ReadableStream||a&&typeof a==`object`&&`pipe`in a&&typeof a.pipe==`function`)&&!o.duplex&&(o.duplex=`half`)),r?.headers)for(let[e,t]of Object.entries(r.headers))s=qt(s,e,t);let l=i._removeEmptyFolders(t),u=i._getFinalPath(l),d=await(e==`PUT`?cn:sn)(i.fetch,`${i.url}/object/${u}`,a,T({headers:s},o?.duplex?{duplex:o.duplex}:{}));return{path:l,id:d.Id,fullPath:d.Key}})}async upload(e,t,n){return this.uploadOrUpdate(`POST`,e,t,n)}async uploadToSignedUrl(e,t,n,r){var i=this;let a=i._removeEmptyFolders(e),o=i._getFinalPath(a),s=new URL(i.url+`/object/upload/sign/${o}`);return s.searchParams.set(`token`,t),i.handleOperation(async()=>{let e,t=T(T({},_n),r),o=T(T({},i.headers),{"x-upsert":String(t.upsert)}),c=t.metadata;if(typeof Blob<`u`&&n instanceof Blob||typeof FormData<`u`&&n instanceof FormData?e=i.prepareUploadFormData(n,t):(e=n,o[`cache-control`]=`max-age=${t.cacheControl}`,o[`content-type`]=t.contentType,t.contentEncoding&&(o[`content-encoding`]=t.contentEncoding),c&&(o[`x-metadata`]=i.toBase64(i.encodeMetadata(c))),(typeof ReadableStream<`u`&&e instanceof ReadableStream||e&&typeof e==`object`&&`pipe`in e&&typeof e.pipe==`function`)&&!t.duplex&&(t.duplex=`half`)),r?.headers)for(let[e,t]of Object.entries(r.headers))o=qt(o,e,t);return{path:a,fullPath:(await cn(i.fetch,s.toString(),e,T({headers:o},t?.duplex?{duplex:t.duplex}:{}))).Key}})}async createSignedUploadUrl(e,t){var n=this;return n.handleOperation(async()=>{let r=n._getFinalPath(e),i=T({},n.headers);t?.upsert&&(i[`x-upsert`]=`true`);let a=await sn(n.fetch,`${n.url}/object/upload/sign/${r}`,{},{headers:i}),o=new URL(n.url+a.url),s=o.searchParams.get(`token`);if(!s)throw new Ut(`No token returned by API`);return{signedUrl:o.toString(),path:e,token:s}})}async update(e,t,n){return this.uploadOrUpdate(`PUT`,e,t,n)}async move(e,t,n){var r=this;return r.handleOperation(async()=>await sn(r.fetch,`${r.url}/object/move`,{bucketId:r.bucketId,sourceKey:e,destinationKey:t,destinationBucket:n?.destinationBucket,sourceVersionId:n?.sourceVersionId},{headers:r.headers}))}async copy(e,t,n){var r=this;return r.handleOperation(async()=>{let i=n;return{path:(await sn(r.fetch,`${r.url}/object/copy`,{bucketId:r.bucketId,sourceKey:e,destinationKey:t,destinationBucket:n?.destinationBucket,sourceVersionId:n?.sourceVersionId,copyMetadata:typeof i?.copyMetadata==`boolean`?i.copyMetadata:void 0,metadata:i?.copyMetadata===!1?i.metadata:void 0},{headers:r.headers})).Key}})}async createSignedUrl(e,t,n){var r=this;return r.handleOperation(async()=>{let i=r._getFinalPath(e),a=typeof n?.transform==`object`&&n.transform!==null&&Object.keys(n.transform).length>0,o=await sn(r.fetch,`${r.url}/object/sign/${i}`,T(T({expiresIn:t},a?{transform:n.transform}:{}),n?.versionId==null?{}:{versionId:n.versionId}),{headers:r.headers}),s=new URLSearchParams;n?.download&&s.set(`download`,n.download===!0?``:n.download),n?.cacheNonce!=null&&s.set(`cacheNonce`,String(n.cacheNonce));let c=s.toString();return{signedUrl:encodeURI(`${r.url}${o.signedURL}${c?`&${c}`:``}`)}})}async createSignedUrls(e,t,n){var r=this;return r.handleOperation(async()=>{let i=await sn(r.fetch,`${r.url}/object/sign/${r.bucketId}`,{expiresIn:t,paths:e},{headers:r.headers}),a=new URLSearchParams;n?.download&&a.set(`download`,n.download===!0?``:n.download),n?.cacheNonce!=null&&a.set(`cacheNonce`,String(n.cacheNonce));let o=a.toString();return i.map(e=>T(T({},e),{},{signedUrl:e.signedURL?encodeURI(`${r.url}${e.signedURL}${o?`&${o}`:``}`):null}))})}download(e,t,n){let r=typeof t?.transform==`object`&&t.transform!==null&&Object.keys(t.transform).length>0?`render/image/authenticated`:`object`,i=new URLSearchParams;t?.transform&&this.applyTransformOptsToQuery(i,t.transform),t?.cacheNonce!=null&&i.set(`cacheNonce`,String(t.cacheNonce)),t?.versionId!=null&&i.set(`versionId`,String(t.versionId));let a=i.toString(),o=this._getFinalPath(e);return new hn(()=>on(this.fetch,`${this.url}/${r}/${o}${a?`?${a}`:``}`,{headers:this.headers,noResolveJson:!0},n),this.shouldThrowOnError)}async info(e,t){var n=this;let r=n._getFinalPath(e),i=new URLSearchParams;t?.versionId!=null&&i.set(`versionId`,String(t.versionId));let a=i.toString();return n.handleOperation(async()=>Zt(await on(n.fetch,`${n.url}/object/info/${r}${a?`?${a}`:``}`,{headers:n.headers})))}async exists(e){var t=this;let n=t._getFinalPath(e);try{return await ln(t.fetch,`${t.url}/object/${n}`,{headers:t.headers}),{data:!0,error:null}}catch(e){if(t.shouldThrowOnError)throw e;if(Wt(e)){let t=e instanceof Gt?e.status:e instanceof Kt?e.originalError?.status:void 0;if(t!==void 0&&[400,404].includes(t))return{data:!1,error:e}}throw e}}getPublicUrl(e,t){let n=this._getFinalPath(e),r=new URLSearchParams;t?.download&&r.set(`download`,t.download===!0?``:t.download),t?.transform&&this.applyTransformOptsToQuery(r,t.transform),t?.cacheNonce!=null&&r.set(`cacheNonce`,String(t.cacheNonce)),t?.versionId!=null&&r.set(`versionId`,String(t.versionId));let i=r.toString(),a=typeof t?.transform==`object`&&t.transform!==null&&Object.keys(t.transform).length>0?`render/image`:`object`;return{data:{publicUrl:encodeURI(`${this.url}/${a}/public/${n}`)+(i?`?${i}`:``)}}}async remove(e){var t=this;return t.handleOperation(async()=>await un(t.fetch,`${t.url}/object/${t.bucketId}`,{prefixes:e},{headers:t.headers}))}async purgeCache(e,t,n){var r=this;return r.handleOperation(async()=>{let i=$t(r._getFinalPath(e)),a=new URLSearchParams;t?.transformations&&a.set(`transformations`,`true`);let o=a.toString();return await un(r.fetch,`${r.url}/cdn/${i}${o?`?${o}`:``}`,{},{headers:r.headers},n)})}async list(e,t,n){var r=this;return r.handleOperation(async()=>{let i=t?.sortBy?T(T({},gn.sortBy),t.sortBy):gn.sortBy,a=T(T(T({},gn),t),{},{sortBy:i,prefix:e||``});return await sn(r.fetch,`${r.url}/object/list/${r.bucketId}`,a,{headers:r.headers},n)})}async listV2(e,t){var n=this;return n.handleOperation(async()=>{let r=T({},e);return await sn(n.fetch,`${n.url}/object/list-v2/${n.bucketId}`,r,{headers:n.headers},t)})}prepareUploadFormData(e,t){let n=new FormData,r=[];e instanceof FormData?e.forEach((e,t)=>{typeof e==`string`?n.append(t,e):r.push([t,e])}):r.push([``,e]),n.has(`cacheControl`)||n.append(`cacheControl`,t.cacheControl),t.metadata&&!n.has(`metadata`)&&n.append(`metadata`,this.encodeMetadata(t.metadata)),t.contentEncoding&&!n.has(`contentEncoding`)&&n.append(`contentEncoding`,t.contentEncoding);for(let[e,t]of r)n.append(e,t);return n}encodeMetadata(e){return JSON.stringify(e)}toBase64(e){return typeof Buffer<`u`?Buffer.from(e).toString(`base64`):btoa(e)}_getFinalPath(e){return`${this.bucketId}/${e.replace(/^\/+/,``)}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,``).replace(/\/+/g,`/`)}applyTransformOptsToQuery(e,t){return t.width&&e.set(`width`,t.width.toString()),t.height&&e.set(`height`,t.height.toString()),t.resize&&e.set(`resize`,t.resize),t.format&&e.set(`format`,t.format),t.quality&&e.set(`quality`,t.quality.toString()),e}},yn={"X-Client-Info":`storage-js/2.118.0`},bn=class extends dn{constructor(e,t={},n,r){let i=new URL(e);r?.useNewHostname&&/supabase\.(co|in|red)$/.test(i.hostname)&&!i.hostname.includes(`storage.supabase.`)&&(i.hostname=i.hostname.replace(`supabase.`,`storage.supabase.`));let a=i.href.replace(/\/$/,``),o=T(T({},yn),t);super(a,o,n,`storage`)}async listBuckets(e){var t=this;return t.handleOperation(async()=>{let n=t.listBucketOptionsToQueryString(e);return await on(t.fetch,`${t.url}/bucket${n}`,{headers:t.headers})})}async getBucket(e){var t=this;return t.handleOperation(async()=>await on(t.fetch,`${t.url}/bucket/${e}`,{headers:t.headers}))}async createBucket(e,t={public:!1}){var n=this;return n.handleOperation(async()=>await sn(n.fetch,`${n.url}/bucket`,{id:e,name:e,type:t.type,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes,versioning_status:t.versioningStatus},{headers:n.headers}))}async updateBucket(e,t){var n=this;return n.handleOperation(async()=>await cn(n.fetch,`${n.url}/bucket/${e}`,{id:e,name:e,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes,versioning_status:t.versioningStatus},{headers:n.headers}))}async emptyBucket(e){var t=this;return t.handleOperation(async()=>await sn(t.fetch,`${t.url}/bucket/${e}/empty`,{},{headers:t.headers}))}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await un(t.fetch,`${t.url}/bucket/${e}`,{},{headers:t.headers}))}async getBucketLifecycle(e){var t=this;return t.handleOperation(async()=>await on(t.fetch,t.bucketLifecycleUrl(e),{headers:t.headers}))}async updateBucketLifecycle(e,t){var n=this;return n.handleOperation(async()=>await cn(n.fetch,n.bucketLifecycleUrl(e),t,{headers:n.headers}))}async deleteBucketLifecycle(e){var t=this;return t.handleOperation(async()=>await un(t.fetch,t.bucketLifecycleUrl(e),{},{headers:t.headers}))}async purgeBucketCache(e,t,n){var r=this;return r.handleOperation(async()=>{let i=new URLSearchParams;t?.transformations&&i.set(`transformations`,`true`);let a=i.toString();return await un(r.fetch,`${r.url}/cdn/${$t(e)}${a?`?${a}`:``}`,{},{headers:r.headers},n)})}bucketLifecycleUrl(e){return`${this.url}/bucket/${$t(e)}/lifecycle`}listBucketOptionsToQueryString(e){let t={};return e&&(`limit`in e&&(t.limit=String(e.limit)),`offset`in e&&(t.offset=String(e.offset)),e.search&&(t.search=e.search),e.sortColumn&&(t.sortColumn=e.sortColumn),e.sortOrder&&(t.sortOrder=e.sortOrder)),Object.keys(t).length>0?`?`+new URLSearchParams(t).toString():``}},xn=class extends dn{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=T(T({},yn),t);super(r,i,n,`storage`)}async createBucket(e){var t=this;return t.handleOperation(async()=>await sn(t.fetch,`${t.url}/bucket`,{name:e},{headers:t.headers}))}async listBuckets(e){var t=this;return t.handleOperation(async()=>{let n=new URLSearchParams;e?.limit!==void 0&&n.set(`limit`,e.limit.toString()),e?.offset!==void 0&&n.set(`offset`,e.offset.toString()),e?.sortColumn&&n.set(`sortColumn`,e.sortColumn),e?.sortOrder&&n.set(`sortOrder`,e.sortOrder),e?.search&&n.set(`search`,e.search);let r=n.toString(),i=r?`${t.url}/bucket?${r}`:`${t.url}/bucket`;return await on(t.fetch,i,{headers:t.headers})})}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await un(t.fetch,`${t.url}/bucket/${e}`,{},{headers:t.headers}))}from(e){var t=this;if(!Qt(e))throw new Ut(`Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.`);let n=new Lt({baseUrl:this.url,catalogName:e,auth:{type:`custom`,getHeaders:async()=>t.headers},fetch:this.fetch}),r=this.shouldThrowOnError;return new Proxy(n,{get(e,t){let n=e[t];return typeof n==`function`?async(...t)=>{try{return{data:await n.apply(e,t),error:null}}catch(e){if(r)throw e;return{data:null,error:e}}}:n}})}},Sn=class extends dn{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=T(T({},yn),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async createIndex(e){var t=this;return t.handleOperation(async()=>await E.post(t.fetch,`${t.url}/CreateIndex`,e,{headers:t.headers})||{})}async getIndex(e,t){var n=this;return n.handleOperation(async()=>await E.post(n.fetch,`${n.url}/GetIndex`,{vectorBucketName:e,indexName:t},{headers:n.headers}))}async listIndexes(e){var t=this;return t.handleOperation(async()=>await E.post(t.fetch,`${t.url}/ListIndexes`,e,{headers:t.headers}))}async deleteIndex(e,t){var n=this;return n.handleOperation(async()=>await E.post(n.fetch,`${n.url}/DeleteIndex`,{vectorBucketName:e,indexName:t},{headers:n.headers})||{})}},Cn=class extends dn{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=T(T({},yn),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async putVectors(e){var t=this;if(e.vectors.length<1||e.vectors.length>500)throw Error(`Vector batch size must be between 1 and 500 items`);return t.handleOperation(async()=>await E.post(t.fetch,`${t.url}/PutVectors`,e,{headers:t.headers})||{})}async getVectors(e){var t=this;return t.handleOperation(async()=>await E.post(t.fetch,`${t.url}/GetVectors`,e,{headers:t.headers}))}async listVectors(e){var t=this;if(e.segmentCount!==void 0){if(e.segmentCount<1||e.segmentCount>16)throw Error(`segmentCount must be between 1 and 16`);if(e.segmentIndex!==void 0&&(e.segmentIndex<0||e.segmentIndex>=e.segmentCount))throw Error(`segmentIndex must be between 0 and ${e.segmentCount-1}`)}return t.handleOperation(async()=>await E.post(t.fetch,`${t.url}/ListVectors`,e,{headers:t.headers}))}async queryVectors(e){var t=this;return t.handleOperation(async()=>await E.post(t.fetch,`${t.url}/QueryVectors`,e,{headers:t.headers}))}async deleteVectors(e){var t=this;if(e.keys.length<1||e.keys.length>500)throw Error(`Keys batch size must be between 1 and 500 items`);return t.handleOperation(async()=>await E.post(t.fetch,`${t.url}/DeleteVectors`,e,{headers:t.headers})||{})}},wn=class extends dn{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=T(T({},yn),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async createBucket(e){var t=this;return t.handleOperation(async()=>await E.post(t.fetch,`${t.url}/CreateVectorBucket`,{vectorBucketName:e},{headers:t.headers})||{})}async getBucket(e){var t=this;return t.handleOperation(async()=>await E.post(t.fetch,`${t.url}/GetVectorBucket`,{vectorBucketName:e},{headers:t.headers}))}async listBuckets(e={}){var t=this;return t.handleOperation(async()=>await E.post(t.fetch,`${t.url}/ListVectorBuckets`,e,{headers:t.headers}))}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await E.post(t.fetch,`${t.url}/DeleteVectorBucket`,{vectorBucketName:e},{headers:t.headers})||{})}},Tn=class extends wn{constructor(e,t={}){super(e,t.headers||{},t.fetch)}from(e){return new En(this.url,this.headers,e,this.fetch)}async createBucket(e){var t=()=>super.createBucket,n=this;return t().call(n,e)}async getBucket(e){var t=()=>super.getBucket,n=this;return t().call(n,e)}async listBuckets(e={}){var t=()=>super.listBuckets,n=this;return t().call(n,e)}async deleteBucket(e){var t=()=>super.deleteBucket,n=this;return t().call(n,e)}},En=class extends Sn{constructor(e,t,n,r){super(e,t,r),this.vectorBucketName=n}async createIndex(e){var t=()=>super.createIndex,n=this;return t().call(n,T(T({},e),{},{vectorBucketName:n.vectorBucketName}))}async listIndexes(e={}){var t=()=>super.listIndexes,n=this;return t().call(n,T(T({},e),{},{vectorBucketName:n.vectorBucketName}))}async getIndex(e){var t=()=>super.getIndex,n=this;return t().call(n,n.vectorBucketName,e)}async deleteIndex(e){var t=()=>super.deleteIndex,n=this;return t().call(n,n.vectorBucketName,e)}index(e){return new Dn(this.url,this.headers,this.vectorBucketName,e,this.fetch)}},Dn=class extends Cn{constructor(e,t,n,r,i){super(e,t,i),this.vectorBucketName=n,this.indexName=r}async putVectors(e){var t=()=>super.putVectors,n=this;return t().call(n,T(T({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async getVectors(e){var t=()=>super.getVectors,n=this;return t().call(n,T(T({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async listVectors(e={}){var t=()=>super.listVectors,n=this;return t().call(n,T(T({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async queryVectors(e){var t=()=>super.queryVectors,n=this;return t().call(n,T(T({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async deleteVectors(e){var t=()=>super.deleteVectors,n=this;return t().call(n,T(T({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}},On=class extends bn{constructor(e,t={},n,r){super(e,t,n,r)}from(e){return new vn(this.url,this.headers,e,this.fetch)}get vectors(){return new Tn(this.url+`/vector`,{headers:this.headers,fetch:this.fetch})}get analytics(){return new xn(this.url+`/iceberg`,this.headers,this.fetch)}},kn=`2.118.0`,An=3e4,jn=3*An,Mn=2*An,Nn=`http://localhost:9999`,Pn=`supabase.auth.token`,Fn={"X-Client-Info":`gotrue-js/${kn}`},In=`X-Supabase-Api-Version`,Ln={"2024-01-01":{timestamp:Date.parse(`2024-01-01T00:00:00.0Z`),name:`2024-01-01`}},Rn=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,zn=`sb_flow_id`,Bn=class extends Error{constructor(e,t,n){super(e),this.__isAuthError=!0,this.name=`AuthError`,this.status=t,this.code=n}toJSON(){return{name:this.name,message:this.message,status:this.status,code:this.code}}};function D(e){return typeof e==`object`&&!!e&&`__isAuthError`in e}var Vn=class extends Bn{constructor(e,t,n){super(e,t,n),this.name=`AuthApiError`,this.status=t,this.code=n}};function Hn(e){return D(e)&&e.name===`AuthApiError`}var Un=class extends Bn{constructor(e,t){super(e),this.name=`AuthUnknownError`,this.originalError=t}},Wn=class extends Bn{constructor(e,t,n,r){super(e,n,r),this.name=t,this.status=n}},O=class extends Wn{constructor(){super(`Auth session missing!`,`AuthSessionMissingError`,400,void 0)}};function Gn(e){return D(e)&&e.name===`AuthSessionMissingError`}var Kn=class extends Wn{constructor(){super(`Auth session or user missing`,`AuthInvalidTokenResponseError`,500,void 0)}},qn=class extends Wn{constructor(e){super(e,`AuthInvalidCredentialsError`,400,void 0)}},Jn=class extends Wn{constructor(e,t=null){super(e,`AuthImplicitGrantRedirectError`,500,void 0),this.details=null,this.details=t}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}};function Yn(e){return D(e)&&e.name===`AuthImplicitGrantRedirectError`}var Xn=class extends Wn{constructor(e,t=null){super(e,`AuthPKCEGrantCodeExchangeError`,500,void 0),this.details=null,this.details=t}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}},Zn=class extends Wn{constructor(){super(`PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.`,`AuthPKCECodeVerifierMissingError`,400,`pkce_code_verifier_not_found`)}},Qn=class extends Wn{constructor(e,t){super(e,`AuthRetryableFetchError`,t,void 0)}};function $n(e){return D(e)&&e.name===`AuthRetryableFetchError`}var er=class extends Wn{constructor(e=`Refresh result discarded: session state changed mid-flight (e.g., concurrent signOut)`){super(e,`AuthRefreshDiscardedError`,409,void 0)}};function tr(e){return D(e)&&e.name===`AuthRefreshDiscardedError`}var nr=class extends Wn{constructor(e,t,n){super(e,`AuthWeakPasswordError`,t,`weak_password`),this.reasons=n}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{reasons:this.reasons})}},rr=class extends Wn{constructor(e){super(e,`AuthInvalidJwtError`,400,`invalid_jwt`)}},ir=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.split(``),ar=` 	
\r=`.split(``),or=(()=>{let e=Array(128);for(let t=0;t<e.length;t+=1)e[t]=-1;for(let t=0;t<ar.length;t+=1)e[ar[t].charCodeAt(0)]=-2;for(let t=0;t<ir.length;t+=1)e[ir[t].charCodeAt(0)]=t;return e})();function sr(e,t,n){if(e!==null)for(t.queue=t.queue<<8|e,t.queuedBits+=8;t.queuedBits>=6;)n(ir[t.queue>>t.queuedBits-6&63]),t.queuedBits-=6;else if(t.queuedBits>0)for(t.queue<<=6-t.queuedBits,t.queuedBits=6;t.queuedBits>=6;)n(ir[t.queue>>t.queuedBits-6&63]),t.queuedBits-=6}function cr(e,t,n){let r=or[e];if(r>-1)for(t.queue=t.queue<<6|r,t.queuedBits+=6;t.queuedBits>=8;)n(t.queue>>t.queuedBits-8&255),t.queuedBits-=8;else if(r===-2)return;else throw Error(`Invalid Base64-URL character "${String.fromCharCode(e)}"`)}function lr(e){let t=[],n=e=>{t.push(String.fromCodePoint(e))},r={utf8seq:0,codepoint:0},i={queue:0,queuedBits:0},a=e=>{fr(e,r,n)};for(let t=0;t<e.length;t+=1)cr(e.charCodeAt(t),i,a);return t.join(``)}function ur(e,t){if(e<=127)t(e);else if(e<=2047)t(192|e>>6),t(128|e&63);else if(e<=65535)t(224|e>>12),t(128|e>>6&63),t(128|e&63);else if(e<=1114111)t(240|e>>18),t(128|e>>12&63),t(128|e>>6&63),t(128|e&63);else throw Error(`Unrecognized Unicode codepoint: ${e.toString(16)}`)}function dr(e,t){for(let n=0;n<e.length;n+=1){let r=e.charCodeAt(n);if(r>55295&&r<=56319){let t=(r-55296)*1024&65535;r=(e.charCodeAt(n+1)-56320&65535|t)+65536,n+=1}ur(r,t)}}function fr(e,t,n){if(t.utf8seq===0){if(e<=127){n(e);return}for(let n=1;n<6;n+=1)if(!(e>>7-n&1)){t.utf8seq=n;break}if(t.utf8seq===2)t.codepoint=e&31;else if(t.utf8seq===3)t.codepoint=e&15;else if(t.utf8seq===4)t.codepoint=e&7;else throw Error(`Invalid UTF-8 sequence`);--t.utf8seq}else if(t.utf8seq>0){if(e<=127)throw Error(`Invalid UTF-8 sequence`);t.codepoint=t.codepoint<<6|e&63,--t.utf8seq,t.utf8seq===0&&n(t.codepoint)}}function pr(e){let t=[],n={queue:0,queuedBits:0},r=e=>{t.push(e)};for(let t=0;t<e.length;t+=1)cr(e.charCodeAt(t),n,r);return new Uint8Array(t)}function mr(e){let t=[];return dr(e,e=>t.push(e)),new Uint8Array(t)}function hr(e){let t=[],n={queue:0,queuedBits:0},r=e=>{t.push(e)};return e.forEach(e=>sr(e,n,r)),sr(null,n,r),t.join(``)}function gr(e){return Math.round(Date.now()/1e3)+e}function _r(){return Symbol(`auth-callback`)}var k=()=>typeof window<`u`&&typeof document<`u`,vr={tested:!1,writable:!1},yr=()=>{if(!k())return!1;try{if(typeof globalThis.localStorage!=`object`)return!1}catch{return!1}if(vr.tested)return vr.writable;let e=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(e,e),globalThis.localStorage.removeItem(e),vr.tested=!0,vr.writable=!0}catch{vr.tested=!0,vr.writable=!1}return vr.writable};function br(e){let t={},n=new URL(e);if(n.hash&&n.hash[0]===`#`)try{new URLSearchParams(n.hash.substring(1)).forEach((e,n)=>{t[n]=e})}catch{}return n.searchParams.forEach((e,n)=>{t[n]=e}),t}var xr=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),Sr=e=>typeof e==`object`&&!!e&&`status`in e&&`ok`in e&&`json`in e&&typeof e.json==`function`,Cr=async(e,t,n)=>{await e.setItem(t,JSON.stringify(n))},A=async(e,t)=>{let n=await e.getItem(t);if(!n)return null;try{return JSON.parse(n)}catch{return null}},j=async(e,t)=>{await e.removeItem(t)},wr=class e{constructor(){this.promise=new e.promiseConstructor((e,t)=>{this.resolve=e,this.reject=t})}};wr.promiseConstructor=Promise;function Tr(e){let t=e.split(`.`);if(t.length!==3)throw new rr(`Invalid JWT structure`);for(let e=0;e<t.length;e++)if(!Rn.test(t[e]))throw new rr(`JWT not in base64url format`);return{header:JSON.parse(lr(t[0])),payload:JSON.parse(lr(t[1])),signature:pr(t[2]),raw:{header:t[0],payload:t[1]}}}async function Er(e){return await new Promise(t=>{setTimeout(()=>t(null),e)})}function Dr(e,t){return new Promise((n,r)=>{(async()=>{for(let i=0;i<1/0;i++)try{let r=await e(i);if(!t(i,null,r)){n(r);return}}catch(e){if(!t(i,e)){r(e);return}}})()})}function Or(e){return(`0`+e.toString(16)).substr(-2)}function kr(){let e=new Uint32Array(56);if(typeof crypto>`u`){let e=``;for(let t=0;t<56;t++)e+=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~`.charAt(Math.floor(Math.random()*66));return e}return crypto.getRandomValues(e),Array.from(e,Or).join(``)}async function Ar(e){let t=new TextEncoder().encode(e),n=await crypto.subtle.digest(`SHA-256`,t),r=new Uint8Array(n);return Array.from(r).map(e=>String.fromCharCode(e)).join(``)}async function jr(e){if(typeof crypto>`u`||crypto.subtle===void 0||typeof TextEncoder>`u`)return console.warn(`WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.`),e;let t=await Ar(e);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}var Mr=/^[a-zA-Z0-9_-]{8,64}$/;function Nr(e){return typeof e==`string`&&Mr.test(e)?e:null}function Pr(){if(typeof crypto<`u`&&typeof crypto.getRandomValues==`function`){let e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e,Or).join(``)}let e=``;for(let t=0;t<32;t++)e+=Math.floor(Math.random()*16).toString(16);return e}var Fr=(e,t)=>`${e}-flow-${t}-code-verifier`,Ir=e=>`${e}-flows-code-verifier`;async function Lr(e,t){let n=await A(e,Ir(t));return Array.isArray(n)?n.filter(e=>Nr(e)!==null):[]}async function Rr(e,t,n,r,i){await Cr(e,Fr(t,n),r);let a=(await Lr(e,t)).filter(e=>e!==n);for(a.push(n);a.length>5;){let n=a.shift();await j(e,Fr(t,n)),i?.(n)}await Cr(e,Ir(t),a),await Cr(e,`${t}-code-verifier`,r)}async function zr(e,t,n){if(n){let r=await A(e,Fr(t,n));return{verifier:typeof r==`string`?r:null,flowId:n}}let r=await A(e,`${t}-code-verifier`);return{verifier:typeof r==`string`?r:null,flowId:null}}async function Br(e,t,n){let r=`${t}-code-verifier`;if(!n){await j(e,r);return}let i=Fr(t,n),a=await A(e,i);await j(e,i);let o=await Lr(e,t),s=o.filter(e=>e!==n);s.length!==o.length&&(s.length>0?await Cr(e,Ir(t),s):await j(e,Ir(t))),a!=null&&a===await A(e,r)&&await j(e,r)}async function Vr(e,t){let n=await Lr(e,t);for(let r of n)await j(e,Fr(t,r));await j(e,Ir(t)),await j(e,`${t}-code-verifier`)}function Hr(e,t){let n=e.indexOf(`#`),r=n===-1?e:e.slice(0,n),i=n===-1?``:e.slice(n),a=r.indexOf(`?`);if(a!==-1){let e=r.slice(0,a),t=r.slice(a+1).split(`&`).filter(e=>e!==``&&e!==`sb_flow_id`&&!e.startsWith(`sb_flow_id=`));r=t.length>0?`${e}?${t.join(`&`)}`:e}let o=r.includes(`?`)?`&`:`?`;return`${r}${o}${zn}=${encodeURIComponent(t)}${i}`}async function Ur(e,t,n=!1,r){let i=kr(),a=i;n&&(a+=`/recovery`);let o=Pr();await Rr(e,t,o,a,r);let s=await jr(i);return[s,i===s?`plain`:`s256`,o]}var Wr=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;function Gr(e){let t=e.headers.get(In);if(!t||!t.match(Wr))return null;try{return new Date(`${t}T00:00:00.0Z`)}catch{return null}}function Kr(e){if(!e)throw Error(`Missing exp claim`);if(e<=Math.floor(Date.now()/1e3))throw Error(`JWT has expired`)}function qr(e){switch(e){case`RS256`:return{name:`RSASSA-PKCS1-v1_5`,hash:{name:`SHA-256`}};case`ES256`:return{name:`ECDSA`,namedCurve:`P-256`,hash:{name:`SHA-256`}};default:throw Error(`Invalid alg claim`)}}var Jr=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function Yr(e){if(!Jr.test(e))throw Error(`@supabase/auth-js: Expected parameter to be UUID but is not`)}function Xr(e){if(!e.recoveryCodes)throw Error("@supabase/auth-js: the MFA recovery codes API is experimental and disabled by default. Enable it by passing `auth: { experimental: { recoveryCodes: true } }` to createClient (or to the GoTrueClient constructor).")}function Zr(){return new Proxy({},{get:(e,t)=>{if(t===`__isUserNotAvailableProxy`)return!0;if(typeof t==`symbol`){let e=t.toString();if(e===`Symbol(Symbol.toPrimitive)`||e===`Symbol(Symbol.toStringTag)`||e===`Symbol(util.inspect.custom)`)return}throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t}" property of the session object is not supported. Please use getUser() instead.`)},set:(e,t)=>{throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(e,t)=>{throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function Qr(e,t){return new Proxy(e,{get:(e,n,r)=>{if(n===`__isInsecureUserWarningProxy`)return!0;if(typeof n==`symbol`){let t=n.toString();if(t===`Symbol(Symbol.toPrimitive)`||t===`Symbol(Symbol.toStringTag)`||t===`Symbol(util.inspect.custom)`||t===`Symbol(nodejs.util.inspect.custom)`)return Reflect.get(e,n,r)}return!t.value&&typeof n==`string`&&(console.warn(`Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.`),t.value=!0),Reflect.get(e,n,r)}})}function $r(e){return JSON.parse(JSON.stringify(e))}var ei=e=>{if(typeof e==`object`&&e){let t=e;if(typeof t.msg==`string`)return t.msg;if(typeof t.message==`string`)return t.message;if(typeof t.error_description==`string`)return t.error_description;if(typeof t.error==`string`)return t.error}return JSON.stringify(e)},ti=[500,501,502,503,504,520,521,522,523,524,525,526,527,528,529,530];async function ni(e){if(!Sr(e))throw new Qn(ei(e),0);let t;try{t=await e.json()}catch(t){throw ti.includes(e.status)?new Qn(e.statusText||`HTTP ${e.status}`,e.status):new Un(ei(t),t)}if(ti.includes(e.status))throw new Qn(ei(t),e.status);let n,r=Gr(e);if(r&&r.getTime()>=Ln[`2024-01-01`].timestamp&&typeof t==`object`&&t&&typeof t.code==`string`?n=t.code:typeof t==`object`&&t&&typeof t.error_code==`string`&&(n=t.error_code),!n){if(typeof t==`object`&&t&&typeof t.weak_password==`object`&&t.weak_password&&Array.isArray(t.weak_password.reasons)&&t.weak_password.reasons.length&&t.weak_password.reasons.reduce((e,t)=>e&&typeof t==`string`,!0))throw new nr(ei(t),e.status,t.weak_password.reasons)}else if(n===`weak_password`)throw new nr(ei(t),e.status,t.weak_password?.reasons||[]);else if(n===`session_not_found`)throw new O;throw new Vn(ei(t),e.status||500,n)}var ri=(e,t,n,r)=>{let i={method:e,headers:t?.headers||{}};return e===`GET`?i:(i.headers=Object.assign({"Content-Type":`application/json;charset=UTF-8`},t?.headers),i.body=JSON.stringify(r),Object.assign(Object.assign({},i),n))};async function M(e,t,n,r){let i=Object.assign({},r?.headers);i[`X-Supabase-Api-Version`]||(i[In]=Ln[`2024-01-01`].name),r?.jwt&&(i.Authorization=`Bearer ${r.jwt}`);let a=r?.query??{};r?.redirectTo&&(a.redirect_to=r.redirectTo);let o=await ii(e,t,n+(Object.keys(a).length?`?`+new URLSearchParams(a).toString():``),{headers:i,noResolveJson:r?.noResolveJson},{},r?.body);return r?.xform?r?.xform(o):{data:Object.assign({},o),error:null}}async function ii(e,t,n,r,i,a){let o=ri(t,r,i,a),s;try{s=await e(n,Object.assign({},o))}catch(e){throw new Qn(ei(e),0)}if(s.ok||await ni(s),r?.noResolveJson)return s;try{return await s.json()}catch(e){await ni(e)}}function N(e){let t=null;ui(e)&&(t=Object.assign({},e),e.expires_at||(t.expires_at=gr(e.expires_in)));let n=e.user??(typeof e?.id==`string`?e:null);return{data:{session:t,user:n},error:null}}function ai(e){let t=N(e);return!t.error&&e.weak_password&&typeof e.weak_password==`object`&&Array.isArray(e.weak_password.reasons)&&e.weak_password.reasons.length&&e.weak_password.message&&typeof e.weak_password.message==`string`&&e.weak_password.reasons.reduce((e,t)=>e&&typeof t==`string`,!0)&&(t.data.weak_password=e.weak_password),t}function oi(e){return{data:{user:e.user??e},error:null}}function si(e){return{data:e,error:null}}function ci(e){let{action_link:t,email_otp:r,hashed_token:i,redirect_to:a,verification_type:o}=e,s=n(e,[`action_link`,`email_otp`,`hashed_token`,`redirect_to`,`verification_type`]);return{data:{properties:{action_link:t,email_otp:r,hashed_token:i,redirect_to:a,verification_type:o},user:Object.assign({},s)},error:null}}function li(e){return e}function ui(e){return!!e.access_token&&!!e.refresh_token&&!!e.expires_in}var di=[`global`,`local`,`others`],fi=class{constructor({url:e=``,headers:t={},fetch:n,experimental:r}){this.url=e,this.headers=t,this.fetch=xr(n),this.experimental=r??{},this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),updateClient:this._updateOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)},this.customProviders={listProviders:this._listCustomProviders.bind(this),createProvider:this._createCustomProvider.bind(this),getProvider:this._getCustomProvider.bind(this),updateProvider:this._updateCustomProvider.bind(this),deleteProvider:this._deleteCustomProvider.bind(this)},this.passkey={listPasskeys:this._adminListPasskeys.bind(this),deletePasskey:this._adminDeletePasskey.bind(this)}}async signOut(e,t=di[0]){if(di.indexOf(t)<0)throw Error(`@supabase/auth-js: Parameter scope must be one of ${di.join(`, `)}`);try{return await M(this.fetch,`POST`,`${this.url}/logout?scope=${t}`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(e){if(D(e))return{data:null,error:e};throw e}}async inviteUserByEmail(e,t={}){try{return await M(this.fetch,`POST`,`${this.url}/invite`,{body:{email:e,data:t.data},headers:this.headers,redirectTo:t.redirectTo,xform:oi})}catch(e){if(D(e))return{data:{user:null},error:e};throw e}}async generateLink(e){try{let{options:t}=e,r=n(e,[`options`]),i=Object.assign(Object.assign({},r),t);return`newEmail`in r&&(i.new_email=r?.newEmail,delete i.newEmail),await M(this.fetch,`POST`,`${this.url}/admin/generate_link`,{body:i,headers:this.headers,xform:ci,redirectTo:t?.redirectTo})}catch(e){if(D(e))return{data:{properties:null,user:null},error:e};throw e}}async createUser(e){try{return await M(this.fetch,`POST`,`${this.url}/admin/users`,{body:e,headers:this.headers,xform:oi})}catch(e){if(D(e))return{data:{user:null},error:e};throw e}}async listUsers(e){try{let t={nextPage:null,lastPage:0,total:0},n=await M(this.fetch,`GET`,`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(e?.page)?.toString()??``,per_page:(e?.perPage)?.toString()??``},xform:li});if(n.error)throw n.error;let r=await n.json(),i=n.headers.get(`x-total-count`)??0,a=n.headers.get(`link`)?.split(`,`)??[];return a.length>0&&(a.forEach(e=>{let n=parseInt(e.split(`;`)[0].split(`=`)[1].substring(0,1)),r=JSON.parse(e.split(`;`)[1].split(`=`)[1]);t[`${r}Page`]=n}),t.total=parseInt(i)),{data:Object.assign(Object.assign({},r),t),error:null}}catch(e){if(D(e))return{data:{users:[]},error:e};throw e}}async getUserById(e){Yr(e);try{return await M(this.fetch,`GET`,`${this.url}/admin/users/${e}`,{headers:this.headers,xform:oi})}catch(e){if(D(e))return{data:{user:null},error:e};throw e}}async updateUserById(e,t){Yr(e);try{return await M(this.fetch,`PUT`,`${this.url}/admin/users/${e}`,{body:t,headers:this.headers,xform:oi})}catch(e){if(D(e))return{data:{user:null},error:e};throw e}}async deleteUser(e,t=!1){Yr(e);try{return await M(this.fetch,`DELETE`,`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:t},xform:oi})}catch(e){if(D(e))return{data:{user:null},error:e};throw e}}async _listFactors(e){Yr(e.userId);try{let{data:t,error:n}=await M(this.fetch,`GET`,`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:e=>({data:{factors:e},error:null})});return{data:t,error:n}}catch(e){if(D(e))return{data:null,error:e};throw e}}async _deleteFactor(e){Yr(e.userId),Yr(e.id);try{return{data:await M(this.fetch,`DELETE`,`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(e){if(D(e))return{data:null,error:e};throw e}}async _listOAuthClients(e){try{let t={nextPage:null,lastPage:0,total:0},n=await M(this.fetch,`GET`,`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:(e?.page)?.toString()??``,per_page:(e?.perPage)?.toString()??``},xform:li});if(n.error)throw n.error;let r=await n.json(),i=n.headers.get(`x-total-count`)??0,a=n.headers.get(`link`)?.split(`,`)??[];return a.length>0&&(a.forEach(e=>{let n=parseInt(e.split(`;`)[0].split(`=`)[1].substring(0,1)),r=JSON.parse(e.split(`;`)[1].split(`=`)[1]);t[`${r}Page`]=n}),t.total=parseInt(i)),{data:Object.assign(Object.assign({},r),t),error:null}}catch(e){if(D(e))return{data:{clients:[]},error:e};throw e}}async _createOAuthClient(e){try{return await M(this.fetch,`POST`,`${this.url}/admin/oauth/clients`,{body:e,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(D(e))return{data:null,error:e};throw e}}async _getOAuthClient(e){try{return await M(this.fetch,`GET`,`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(D(e))return{data:null,error:e};throw e}}async _updateOAuthClient(e,t){try{return await M(this.fetch,`PUT`,`${this.url}/admin/oauth/clients/${e}`,{body:t,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(D(e))return{data:null,error:e};throw e}}async _deleteOAuthClient(e){try{return await M(this.fetch,`DELETE`,`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(D(e))return{data:null,error:e};throw e}}async _regenerateOAuthClientSecret(e){try{return await M(this.fetch,`POST`,`${this.url}/admin/oauth/clients/${e}/regenerate_secret`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(D(e))return{data:null,error:e};throw e}}async _listCustomProviders(e){try{let t={};return e?.type&&(t.type=e.type),await M(this.fetch,`GET`,`${this.url}/admin/custom-providers`,{headers:this.headers,query:t,xform:e=>({data:{providers:e?.providers??[]},error:null})})}catch(e){if(D(e))return{data:{providers:[]},error:e};throw e}}async _createCustomProvider(e){try{return await M(this.fetch,`POST`,`${this.url}/admin/custom-providers`,{body:e,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(D(e))return{data:null,error:e};throw e}}async _getCustomProvider(e){try{return await M(this.fetch,`GET`,`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(D(e))return{data:null,error:e};throw e}}async _updateCustomProvider(e,t){try{return await M(this.fetch,`PUT`,`${this.url}/admin/custom-providers/${e}`,{body:t,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(D(e))return{data:null,error:e};throw e}}async _deleteCustomProvider(e){try{return await M(this.fetch,`DELETE`,`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(D(e))return{data:null,error:e};throw e}}async _adminListPasskeys(e){Yr(e.userId);try{return await M(this.fetch,`GET`,`${this.url}/admin/users/${e.userId}/passkeys`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(D(e))return{data:null,error:e};throw e}}async _adminDeletePasskey(e){Yr(e.userId),Yr(e.passkeyId);try{return await M(this.fetch,`DELETE`,`${this.url}/admin/users/${e.userId}/passkeys/${e.passkeyId}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(D(e))return{data:null,error:e};throw e}}};function pi(e={}){return{getItem:t=>e[t]||null,setItem:(t,n)=>{e[t]=n},removeItem:t=>{delete e[t]}}}globalThis&&yr()&&globalThis.localStorage&&globalThis.localStorage.getItem(`supabase.gotrue-js.locks.debug`);var mi=class extends Error{constructor(e){super(e),this.isAcquireTimeout=!0}};function hi(){if(typeof globalThis!=`object`)try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<`u`&&(self.globalThis=self)}}function gi(e){if(!/^0x[a-fA-F0-9]{40}$/.test(e))throw Error(`@supabase/auth-js: Address "${e}" is invalid.`);return e.toLowerCase()}function _i(e){return parseInt(e,16)}function vi(e){let t=new TextEncoder().encode(e);return`0x`+Array.from(t,e=>e.toString(16).padStart(2,`0`)).join(``)}function yi(e){let{chainId:t,domain:n,expirationTime:r,issuedAt:i=new Date,nonce:a,notBefore:o,requestId:s,resources:c,scheme:l,uri:u,version:d}=e;if(!Number.isInteger(t))throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${t}`);if(!n)throw Error(`@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.`);if(a&&a.length<8)throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a}`);if(!u)throw Error(`@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.`);if(d!==`1`)throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d}`);if(e.statement?.includes(`
`))throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e.statement}`);let f=gi(e.address),p=`${l?`${l}://${n}`:n} wants you to sign in with your Ethereum account:\n${f}\n\n${e.statement?`${e.statement}\n`:``}`,m=`URI: ${u}\nVersion: ${d}\nChain ID: ${t}${a?`\nNonce: ${a}`:``}\nIssued At: ${i.toISOString()}`;if(r&&(m+=`\nExpiration Time: ${r.toISOString()}`),o&&(m+=`\nNot Before: ${o.toISOString()}`),s&&(m+=`\nRequest ID: ${s}`),c){let e=`
Resources:`;for(let t of c){if(!t||typeof t!=`string`)throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t}`);e+=`\n- ${t}`}m+=e}return`${p}\n${m}`}var P=class extends Error{constructor({message:e,code:t,cause:n,name:r}){super(e,{cause:n}),this.__isWebAuthnError=!0,this.name=r??(n instanceof Error?n.name:void 0)??`Unknown Error`,this.code=t}toJSON(){return{name:this.name,message:this.message,code:this.code}}},bi=class extends P{constructor(e,t){super({code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:t,message:e}),this.name=`WebAuthnUnknownError`,this.originalError=t}};function xi({error:e,options:t}){let{publicKey:n}=t;if(!n)throw Error(`options was missing required publicKey property`);if(e.name===`AbortError`){if(t.signal instanceof AbortSignal)return new P({message:`Registration ceremony was sent an abort signal`,code:`ERROR_CEREMONY_ABORTED`,cause:e})}else if(e.name===`ConstraintError`){if(n.authenticatorSelection?.requireResidentKey===!0)return new P({message:`Discoverable credentials were required but no available authenticator supported it`,code:`ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT`,cause:e});if(t.mediation===`conditional`&&n.authenticatorSelection?.userVerification===`required`)return new P({message:`User verification was required during automatic registration but it could not be performed`,code:`ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE`,cause:e});if(n.authenticatorSelection?.userVerification===`required`)return new P({message:`User verification was required but no available authenticator supported it`,code:`ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT`,cause:e})}else if(e.name===`InvalidStateError`)return new P({message:`The authenticator was previously registered`,code:`ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED`,cause:e});else if(e.name===`NotAllowedError`)return new P({message:e.message,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e});else if(e.name===`NotSupportedError`)return n.pubKeyCredParams.filter(e=>e.type===`public-key`).length===0?new P({message:`No entry in pubKeyCredParams was of type "public-key"`,code:`ERROR_MALFORMED_PUBKEYCREDPARAMS`,cause:e}):new P({message:`No available authenticator supported any of the specified pubKeyCredParams algorithms`,code:`ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG`,cause:e});else if(e.name===`SecurityError`){let t=window.location.hostname;if(!Oi(t))return new P({message:`${window.location.hostname} is an invalid domain`,code:`ERROR_INVALID_DOMAIN`,cause:e});if(n.rp.id!==t)return new P({message:`The RP ID "${n.rp.id}" is invalid for this domain`,code:`ERROR_INVALID_RP_ID`,cause:e})}else if(e.name===`TypeError`){if(n.user.id.byteLength<1||n.user.id.byteLength>64)return new P({message:`User ID was not between 1 and 64 characters`,code:`ERROR_INVALID_USER_ID_LENGTH`,cause:e})}else if(e.name===`UnknownError`)return new P({message:`The authenticator was unable to process the specified options, or could not create a new credential`,code:`ERROR_AUTHENTICATOR_GENERAL_ERROR`,cause:e});return new P({message:`a Non-Webauthn related error has occurred`,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e})}function Si({error:e,options:t}){let{publicKey:n}=t;if(!n)throw Error(`options was missing required publicKey property`);if(e.name===`AbortError`){if(t.signal instanceof AbortSignal)return new P({message:`Authentication ceremony was sent an abort signal`,code:`ERROR_CEREMONY_ABORTED`,cause:e})}else if(e.name===`NotAllowedError`)return new P({message:e.message,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e});else if(e.name===`SecurityError`){let t=window.location.hostname;if(!Oi(t))return new P({message:`${window.location.hostname} is an invalid domain`,code:`ERROR_INVALID_DOMAIN`,cause:e});if(n.rpId!==t)return new P({message:`The RP ID "${n.rpId}" is invalid for this domain`,code:`ERROR_INVALID_RP_ID`,cause:e})}else if(e.name===`UnknownError`)return new P({message:`The authenticator was unable to process the specified options, or could not create a new assertion signature`,code:`ERROR_AUTHENTICATOR_GENERAL_ERROR`,cause:e});return new P({message:`a Non-Webauthn related error has occurred`,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e})}var Ci=new class{createNewAbortSignal(){if(this.controller){let e=Error(`Cancelling existing WebAuthn API call for new one`);e.name=`AbortError`,this.controller.abort(e)}let e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){let e=Error(`Manually cancelling existing WebAuthn API call`);e.name=`AbortError`,this.controller.abort(e),this.controller=void 0}}};function wi(e){if(!e)throw Error(`Credential creation options are required`);if(typeof PublicKeyCredential<`u`&&`parseCreationOptionsFromJSON`in PublicKeyCredential&&typeof PublicKeyCredential.parseCreationOptionsFromJSON==`function`)return PublicKeyCredential.parseCreationOptionsFromJSON(e);let{challenge:t,user:r,excludeCredentials:i}=e,a=n(e,[`challenge`,`user`,`excludeCredentials`]),o=pr(t).buffer,s=Object.assign(Object.assign({},r),{id:pr(r.id).buffer}),c=Object.assign(Object.assign({},a),{challenge:o,user:s});if(i&&i.length>0){c.excludeCredentials=Array(i.length);for(let e=0;e<i.length;e++){let t=i[e];c.excludeCredentials[e]=Object.assign(Object.assign({},t),{id:pr(t.id).buffer,type:t.type||`public-key`,transports:t.transports})}}return c}function Ti(e){if(!e)throw Error(`Credential request options are required`);if(typeof PublicKeyCredential<`u`&&`parseRequestOptionsFromJSON`in PublicKeyCredential&&typeof PublicKeyCredential.parseRequestOptionsFromJSON==`function`)return PublicKeyCredential.parseRequestOptionsFromJSON(e);let{challenge:t,allowCredentials:r}=e,i=n(e,[`challenge`,`allowCredentials`]),a=pr(t).buffer,o=Object.assign(Object.assign({},i),{challenge:a});if(r&&r.length>0){o.allowCredentials=Array(r.length);for(let e=0;e<r.length;e++){let t=r[e];o.allowCredentials[e]=Object.assign(Object.assign({},t),{id:pr(t.id).buffer,type:t.type||`public-key`,transports:t.transports})}}return o}function Ei(e){if(`toJSON`in e&&typeof e.toJSON==`function`)return e.toJSON();let t=e;return{id:e.id,rawId:e.id,response:{attestationObject:hr(new Uint8Array(e.response.attestationObject)),clientDataJSON:hr(new Uint8Array(e.response.clientDataJSON))},type:`public-key`,clientExtensionResults:e.getClientExtensionResults(),authenticatorAttachment:t.authenticatorAttachment??void 0}}function Di(e){if(`toJSON`in e&&typeof e.toJSON==`function`)return e.toJSON();let t=e,n=e.getClientExtensionResults(),r=e.response;return{id:e.id,rawId:e.id,response:{authenticatorData:hr(new Uint8Array(r.authenticatorData)),clientDataJSON:hr(new Uint8Array(r.clientDataJSON)),signature:hr(new Uint8Array(r.signature)),userHandle:r.userHandle?hr(new Uint8Array(r.userHandle)):void 0},type:`public-key`,clientExtensionResults:n,authenticatorAttachment:t.authenticatorAttachment??void 0}}function Oi(e){return e===`localhost`||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e)}function ki(){return!!(k()&&`PublicKeyCredential`in window&&window.PublicKeyCredential&&`credentials`in navigator&&typeof(navigator==null?void 0:navigator.credentials)?.create==`function`&&typeof(navigator==null?void 0:navigator.credentials)?.get==`function`)}async function Ai(e){try{let t=await navigator.credentials.create(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new bi(`Browser returned unexpected credential type`,t)}:{data:null,error:new bi(`Empty credential response`,t)}}catch(t){return{data:null,error:xi({error:t,options:e})}}}async function ji(e){try{let t=await navigator.credentials.get(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new bi(`Browser returned unexpected credential type`,t)}:{data:null,error:new bi(`Empty credential response`,t)}}catch(t){return{data:null,error:Si({error:t,options:e})}}}var Mi={hints:[`security-key`],authenticatorSelection:{authenticatorAttachment:`cross-platform`,requireResidentKey:!1,userVerification:`preferred`,residentKey:`discouraged`},attestation:`direct`},Ni={userVerification:`preferred`,hints:[`security-key`],attestation:`direct`};function Pi(...e){let t=e=>typeof e==`object`&&!!e&&!Array.isArray(e),n=e=>e instanceof ArrayBuffer||ArrayBuffer.isView(e),r={};for(let i of e)if(i)for(let e in i){let a=i[e];if(a!==void 0){if(Array.isArray(a))r[e]=a;else if(n(a))r[e]=a;else if(t(a)){let n=r[e];r[e]=t(n)?Pi(n,a):Pi(a)}else r[e]=a}}return r}function Fi(e,t){return Pi(Mi,e,t||{})}function Ii(e,t){return Pi(Ni,e,t||{})}var Li=class{constructor(e){this.client=e,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(e){return this.client.mfa.enroll(Object.assign(Object.assign({},e),{factorType:`webauthn`}))}async _challenge({factorId:e,webauthn:t,friendlyName:n,signal:r},i){try{let{data:a,error:o}=await this.client.mfa.challenge({factorId:e,webauthn:t});if(!a)return{data:null,error:o};let s=r??Ci.createNewAbortSignal();if(a.webauthn.type===`create`){let{user:e}=a.webauthn.credential_options.publicKey;if(!e.name){let t=n;if(t)e.name=`${e.id}:${t}`;else{let t=(await this.client.getUser()).data.user,n=t?.user_metadata?.name||t?.email||t?.id||`User`;e.name=`${e.id}:${n}`}}e.displayName||=e.name}switch(a.webauthn.type){case`create`:{let{data:t,error:n}=await Ai({publicKey:Fi(a.webauthn.credential_options.publicKey,i?.create),signal:s});return t?{data:{factorId:e,challengeId:a.id,webauthn:{type:a.webauthn.type,credential_response:t}},error:null}:{data:null,error:n}}case`request`:{let t=Ii(a.webauthn.credential_options.publicKey,i?.request),{data:n,error:r}=await ji(Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:t,signal:s}));return n?{data:{factorId:e,challengeId:a.id,webauthn:{type:a.webauthn.type,credential_response:n}},error:null}:{data:null,error:r}}}}catch(e){return D(e)?{data:null,error:e}:{data:null,error:new Un(`Unexpected error in challenge`,e)}}}async _verify({challengeId:e,factorId:t,webauthn:n}){return this.client.mfa.verify({factorId:t,challengeId:e,webauthn:n})}async _authenticate({factorId:e,webauthn:{rpId:t=typeof window<`u`?window.location.hostname:void 0,rpOrigins:n=typeof window<`u`?[window.location.origin]:void 0,signal:r}={}},i){if(!t)return{data:null,error:new Bn(`rpId is required for WebAuthn authentication`)};try{if(!ki())return{data:null,error:new Un(`Browser does not support WebAuthn`,null)};let{data:a,error:o}=await this.challenge({factorId:e,webauthn:{rpId:t,rpOrigins:n},signal:r},{request:i});if(!a)return{data:null,error:o};let{webauthn:s}=a;return this._verify({factorId:e,challengeId:a.challengeId,webauthn:{type:s.type,rpId:t,rpOrigins:n,credential_response:s.credential_response}})}catch(e){return D(e)?{data:null,error:e}:{data:null,error:new Un(`Unexpected error in authenticate`,e)}}}async _register({friendlyName:e,webauthn:{rpId:t=typeof window<`u`?window.location.hostname:void 0,rpOrigins:n=typeof window<`u`?[window.location.origin]:void 0,signal:r}={}},i){if(!t)return{data:null,error:new Bn(`rpId is required for WebAuthn registration`)};try{if(!ki())return{data:null,error:new Un(`Browser does not support WebAuthn`,null)};let{data:a,error:o}=await this._enroll({friendlyName:e});if(!a)return await this.client.mfa.listFactors().then(t=>t.data?.all.find(t=>t.factor_type===`webauthn`&&t.friendly_name===e&&t.status===`unverified`)).then(e=>e?this.client.mfa.unenroll({factorId:e?.id}):void 0),{data:null,error:o};let{data:s,error:c}=await this._challenge({factorId:a.id,friendlyName:a.friendly_name,webauthn:{rpId:t,rpOrigins:n},signal:r},{create:i});return s?this._verify({factorId:a.id,challengeId:s.challengeId,webauthn:{rpId:t,rpOrigins:n,type:s.webauthn.type,credential_response:s.webauthn.credential_response}}):{data:null,error:c}}catch(e){return D(e)?{data:null,error:e}:{data:null,error:new Un(`Unexpected error in register`,e)}}}};hi();var Ri={url:Nn,storageKey:Pn,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:Fn,flowType:`implicit`,debug:!1,hasCustomAuthorizationHeader:!1,throwOnError:!1,lockAcquireTimeout:5e3,skipAutoInitialize:!1,experimental:{}},zi={},Bi=!1,Vi=class e{get jwks(){return zi[this.storageKey]?.jwks??{keys:[]}}set jwks(e){zi[this.storageKey]=Object.assign(Object.assign({},zi[this.storageKey]),{jwks:e})}get jwks_cached_at(){return zi[this.storageKey]?.cachedAt??-(2**53-1)}set jwks_cached_at(e){zi[this.storageKey]=Object.assign(Object.assign({},zi[this.storageKey]),{cachedAt:e})}constructor(t){var n;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.autoRefreshTickTimeout=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.lastRefreshFailure=null,this._sessionRemovalEpoch=0,this.initializePromise=null,this._pendingInitNotifications=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lock=null,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log;let r=Object.assign(Object.assign({},Ri),t);if(this.storageKey=r.storageKey,this.instanceID=e.nextInstanceID[this.storageKey]??0,e.nextInstanceID[this.storageKey]=this.instanceID+1,this.logDebugMessages=!!r.debug,typeof r.debug==`function`&&(this.logger=r.debug),this.instanceID>0&&k()){let e=`${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;console.warn(e),this.logDebugMessages&&console.trace(e)}if(this.persistSession=r.persistSession,this.autoRefreshToken=r.autoRefreshToken,this.experimental=r.experimental??{},this.admin=new fi({url:r.url,headers:r.headers,fetch:r.fetch,experimental:this.experimental}),this.url=r.url,this.headers=r.headers,this.fetch=xr(r.fetch),this.detectSessionInUrl=r.detectSessionInUrl,this.flowType=r.flowType,this.hasCustomAuthorizationHeader=r.hasCustomAuthorizationHeader,this.throwOnError=r.throwOnError,this.lockAcquireTimeout=r.lockAcquireTimeout,r.lock!=null&&(this.lock=r.lock,Bi||(Bi=!0,console.warn(`${this._logPrefix()} The "lock" option is deprecated and will be removed in v3. The client now coordinates session refreshes without a lock, so most apps can drop the option. See https://github.com/supabase/supabase-js/blob/master/packages/core/auth-js/migrations/lockless-coordination.md`))),this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=-(2**53-1)),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new Li(this),recoveryCodes:{getStatus:this._getRecoveryCodesStatus.bind(this),generate:this._generateRecoveryCodes.bind(this),verify:this._verifyRecoveryCode.bind(this),regenerate:this._regenerateRecoveryCodes.bind(this),unenroll:this._unenrollRecoveryCodes.bind(this)}},this.oauth={getAuthorizationDetails:this._getAuthorizationDetails.bind(this),approveAuthorization:this._approveAuthorization.bind(this),denyAuthorization:this._denyAuthorization.bind(this),listGrants:this._listOAuthGrants.bind(this),revokeGrant:this._revokeOAuthGrant.bind(this)},this.passkey={startRegistration:this._startPasskeyRegistration.bind(this),verifyRegistration:this._verifyPasskeyRegistration.bind(this),startAuthentication:this._startPasskeyAuthentication.bind(this),verifyAuthentication:this._verifyPasskeyAuthentication.bind(this),list:this._listPasskeys.bind(this),update:this._updatePasskey.bind(this),delete:this._deletePasskey.bind(this)},this.persistSession?(r.storage?this.storage=r.storage:yr()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=pi(this.memoryStorage)),r.userStorage&&(this.userStorage=r.userStorage)):(this.memoryStorage={},this.storage=pi(this.memoryStorage)),k()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(e){console.error(`Failed to create a new BroadcastChannel, multi-tab state changes will not be available`,e)}(n=this.broadcastChannel)==null||n.addEventListener(`message`,async e=>{this._debug(`received broadcast notification from other tab or client`,e),(e.data.event===`TOKEN_REFRESHED`||e.data.event===`SIGNED_IN`)&&(this.lastRefreshFailure=null);try{await this._notifyAllSubscribers(e.data.event,e.data.session,!1)}catch(e){this._debug(`#broadcastChannel`,`error`,e)}})}r.skipAutoInitialize||this.initialize().catch(e=>{this._debug(`#initialize()`,`error`,e)})}isThrowOnErrorEnabled(){return this.throwOnError}_returnResult(e){if(this.throwOnError&&e&&e.error)throw e.error;return e}_logPrefix(){return`GoTrueClient@${this.storageKey}:${this.instanceID} (${kn}) ${new Date().toISOString()}`}_debug(...e){return this.logDebugMessages&&this.logger(this._logPrefix(),...e),this}async initialize(){if(this.initializePromise)return await this.initializePromise;this._pendingInitNotifications=[],this.initializePromise=(async()=>this.lock==null?await this._initialize():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._initialize()))();let e=await this.initializePromise,t=this._pendingInitNotifications??[];this._pendingInitNotifications=null;for(let e of t)await this._notifyAllSubscribers(e.event,e.session,e.broadcast);return e}async _initialize(){try{let e={},t=`none`;if(k()&&(e=br(window.location.href),this._isImplicitGrantCallback(e)?t=`implicit`:await this._isPKCECallback(e)&&(t=`pkce`)),k()&&this.detectSessionInUrl&&t!==`none`){let{data:n,error:r}=await this._getSessionFromURL(e,t);if(r){if(this._debug(`#_initialize()`,`error detecting session from URL`,r),Yn(r)){let e=r.details?.code;if(e===`identity_already_exists`||e===`identity_not_found`||e===`single_identity_not_deletable`)return{error:r}}return{error:r}}let{session:i,redirectType:a}=n;return this._debug(`#_initialize()`,`detected session in URL`,i,`redirect type`,a),await this._saveSession(i),setTimeout(async()=>{a===`recovery`?await this._notifyAllSubscribers(`PASSWORD_RECOVERY`,i):await this._notifyAllSubscribers(`SIGNED_IN`,i)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(e){return D(e)?this._returnResult({error:e}):this._returnResult({error:new Un(`Unexpected error during initialization`,e)})}finally{await this._handleVisibilityChange(),this._debug(`#_initialize()`,`end`)}}async signInAnonymously(e){try{let{data:t,error:n}=await M(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,body:{data:e?.options?.data??{},gotrue_meta_security:{captcha_token:e?.options?.captchaToken}},xform:N});if(n||!t)return this._returnResult({data:{user:null,session:null},error:n});let r=t.session,i=t.user;return t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers(`SIGNED_IN`,r)),this._returnResult({data:{user:i,session:r},error:null})}catch(e){if(D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signUp(e){let t=null;try{let n;if(`email`in e){let{email:r,password:i,options:a}=e,o=null,s=null;this.flowType===`pkce`&&([o,s,t]=await this._getCodeChallengeAndMethod()),n=await M(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(a?.emailRedirectTo,t),body:{email:r,password:i,data:a?.data??{},gotrue_meta_security:{captcha_token:a?.captchaToken},code_challenge:o,code_challenge_method:s},xform:N})}else if(`phone`in e){let{phone:t,password:r,options:i}=e;n=await M(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,body:{phone:t,password:r,data:i?.data??{},channel:i?.channel??`sms`,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:N})}else throw new qn(`You must provide either an email or phone number and a password`);let{data:r,error:i}=n;if(i||!r)return await Br(this.storage,this.storageKey,t),this._returnResult({data:{user:null,session:null},error:i});let a=r.session,o=r.user;return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(`SIGNED_IN`,a)),this._returnResult({data:{user:o,session:a},error:null})}catch(e){if(await Br(this.storage,this.storageKey,t),D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithPassword(e){try{let t;if(`email`in e){let{email:n,password:r,options:i}=e;t=await M(this.fetch,`POST`,`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:n,password:r,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:ai})}else if(`phone`in e){let{phone:n,password:r,options:i}=e;t=await M(this.fetch,`POST`,`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:n,password:r,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:ai})}else throw new qn(`You must provide either an email or phone number and a password`);let{data:n,error:r}=t;if(r)return this._returnResult({data:{user:null,session:null},error:r});if(!n||!n.session||!n.user){let e=new Kn;return this._returnResult({data:{user:null,session:null},error:e})}return n.session&&(await this._saveSession(n.session),await this._notifyAllSubscribers(`SIGNED_IN`,n.session)),this._returnResult({data:Object.assign({user:n.user,session:n.session},n.weak_password?{weakPassword:n.weak_password}:null),error:r})}catch(e){if(D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithOAuth(e){return await this._handleProviderSignIn(e.provider,{redirectTo:e.options?.redirectTo,scopes:e.options?.scopes,queryParams:e.options?.queryParams,skipBrowserRedirect:e.options?.skipBrowserRedirect})}async exchangeCodeForSession(e,t){return await this.initializePromise,this.lock==null?this._exchangeCodeForSession(e,t):this._acquireLock(this.lockAcquireTimeout,async()=>this._exchangeCodeForSession(e,t))}async signInWithWeb3(e){let{chain:t}=e;switch(t){case`ethereum`:return await this.signInWithEthereum(e);case`solana`:return await this.signInWithSolana(e);default:throw Error(`@supabase/auth-js: Unsupported chain "${t}"`)}}async signInWithEthereum(e){let t,n;if(`message`in e)t=e.message,n=e.signature;else{let{chain:r,wallet:i,statement:a,options:o}=e,s;if(!k()){if(typeof i!=`object`||!o?.url)throw Error(`@supabase/auth-js: Both wallet and url must be specified in non-browser environments.`);s=i}else if(typeof i==`object`)s=i;else{let e=window;if(`ethereum`in e&&typeof e.ethereum==`object`&&`request`in e.ethereum&&typeof e.ethereum.request==`function`)s=e.ethereum;else throw Error(`@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.`)}let c=new URL(o?.url??window.location.href),l=await s.request({method:`eth_requestAccounts`}).then(e=>e).catch(()=>{throw Error(`@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid`)});if(!l||l.length===0)throw Error(`@supabase/auth-js: No accounts available. Please ensure the wallet is connected.`);let u=gi(l[0]),d=o?.signInWithEthereum?.chainId;d||=_i(await s.request({method:`eth_chainId`})),t=yi({domain:c.host,address:u,statement:a,uri:c.href,version:`1`,chainId:d,nonce:o?.signInWithEthereum?.nonce,issuedAt:o?.signInWithEthereum?.issuedAt??new Date,expirationTime:o?.signInWithEthereum?.expirationTime,notBefore:o?.signInWithEthereum?.notBefore,requestId:o?.signInWithEthereum?.requestId,resources:o?.signInWithEthereum?.resources}),n=await s.request({method:`personal_sign`,params:[vi(t),u]})}try{let{data:r,error:i}=await M(this.fetch,`POST`,`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:`ethereum`,message:t,signature:n},e.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options?.captchaToken}}:null),xform:N});if(i)throw i;if(!r||!r.session||!r.user){let e=new Kn;return this._returnResult({data:{user:null,session:null},error:e})}return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(`SIGNED_IN`,r.session)),this._returnResult({data:Object.assign({},r),error:i})}catch(e){if(D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithSolana(e){let t,n;if(`message`in e)t=e.message,n=e.signature;else{let{chain:r,wallet:i,statement:a,options:o}=e,s;if(!k()){if(typeof i!=`object`||!o?.url)throw Error(`@supabase/auth-js: Both wallet and url must be specified in non-browser environments.`);s=i}else if(typeof i==`object`)s=i;else{let e=window;if(`solana`in e&&typeof e.solana==`object`&&(`signIn`in e.solana&&typeof e.solana.signIn==`function`||`signMessage`in e.solana&&typeof e.solana.signMessage==`function`))s=e.solana;else throw Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`)}let c=new URL(o?.url??window.location.href);if(`signIn`in s&&s.signIn){let e=await s.signIn(Object.assign(Object.assign(Object.assign({issuedAt:new Date().toISOString()},o?.signInWithSolana),{version:`1`,domain:c.host,uri:c.href}),a?{statement:a}:null)),r;if(Array.isArray(e)&&e[0]&&typeof e[0]==`object`)r=e[0];else if(e&&typeof e==`object`&&`signedMessage`in e&&`signature`in e)r=e;else throw Error(`@supabase/auth-js: Wallet method signIn() returned unrecognized value`);if(`signedMessage`in r&&`signature`in r&&(typeof r.signedMessage==`string`||r.signedMessage instanceof Uint8Array)&&r.signature instanceof Uint8Array)t=typeof r.signedMessage==`string`?r.signedMessage:new TextDecoder().decode(r.signedMessage),n=r.signature;else throw Error(`@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields`)}else{if(!(`signMessage`in s)||typeof s.signMessage!=`function`||!(`publicKey`in s)||typeof s!=`object`||!s.publicKey||!(`toBase58`in s.publicKey)||typeof s.publicKey.toBase58!=`function`)throw Error(`@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API`);t=[`${c.host} wants you to sign in with your Solana account:`,s.publicKey.toBase58(),...a?[``,a,``]:[``],`Version: 1`,`URI: ${c.href}`,`Issued At: ${o?.signInWithSolana?.issuedAt??new Date().toISOString()}`,...o?.signInWithSolana?.notBefore?[`Not Before: ${o.signInWithSolana.notBefore}`]:[],...o?.signInWithSolana?.expirationTime?[`Expiration Time: ${o.signInWithSolana.expirationTime}`]:[],...o?.signInWithSolana?.chainId?[`Chain ID: ${o.signInWithSolana.chainId}`]:[],...o?.signInWithSolana?.nonce?[`Nonce: ${o.signInWithSolana.nonce}`]:[],...o?.signInWithSolana?.requestId?[`Request ID: ${o.signInWithSolana.requestId}`]:[],...o?.signInWithSolana?.resources?.length?[`Resources`,...o.signInWithSolana.resources.map(e=>`- ${e}`)]:[]].join(`
`);let e=await s.signMessage(new TextEncoder().encode(t),`utf8`);if(!e||!(e instanceof Uint8Array))throw Error(`@supabase/auth-js: Wallet signMessage() API returned an recognized value`);n=e}}try{let{data:r,error:i}=await M(this.fetch,`POST`,`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:`solana`,message:t,signature:hr(n)},e.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options?.captchaToken}}:null),xform:N});if(i)throw i;if(!r||!r.session||!r.user){let e=new Kn;return this._returnResult({data:{user:null,session:null},error:e})}return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(`SIGNED_IN`,r.session)),this._returnResult({data:Object.assign({},r),error:i})}catch(e){if(D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async _exchangeCodeForSession(e,t){let n=t?.flowId!=null,r=n?Nr(t?.flowId):k()?Nr(br(window.location.href)[zn]):null;n&&!r&&this._debug(`#_exchangeCodeForSession()`,`provided flowId is not a valid flow id`,t?.flowId);let{verifier:i,flowId:a}=n&&!r?{verifier:null,flowId:null}:await zr(this.storage,this.storageKey,r),[o,s]=(i??``).split(`/`);try{if(!o&&this.flowType===`pkce`)throw new Zn;let{data:t,error:n}=await M(this.fetch,`POST`,`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:o},xform:N});if(await Br(this.storage,this.storageKey,a),n)throw n;if(!t||!t.session||!t.user){let e=new Kn;return this._returnResult({data:{user:null,session:null,redirectType:null},error:e})}return t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers(s===`recovery`?`PASSWORD_RECOVERY`:`SIGNED_IN`,t.session)),this._returnResult({data:Object.assign(Object.assign({},t),{redirectType:s??null}),error:n})}catch(e){if(await Br(this.storage,this.storageKey,a),D(e))return this._returnResult({data:{user:null,session:null,redirectType:null},error:e});throw e}}async signInWithIdToken(e){try{let{options:t,provider:n,token:r,access_token:i,nonce:a}=e,{data:o,error:s}=await M(this.fetch,`POST`,`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:n,id_token:r,access_token:i,nonce:a,gotrue_meta_security:{captcha_token:t?.captchaToken}},xform:N});if(s)return this._returnResult({data:{user:null,session:null},error:s});if(!o||!o.session||!o.user){let e=new Kn;return this._returnResult({data:{user:null,session:null},error:e})}return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers(`SIGNED_IN`,o.session)),this._returnResult({data:o,error:s})}catch(e){if(D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithOtp(e){let t=null;try{if(`email`in e){let{email:n,options:r}=e,i=null,a=null;this.flowType===`pkce`&&([i,a,t]=await this._getCodeChallengeAndMethod());let{error:o}=await M(this.fetch,`POST`,`${this.url}/otp`,{headers:this.headers,body:{email:n,data:r?.data??{},create_user:r?.shouldCreateUser??!0,gotrue_meta_security:{captcha_token:r?.captchaToken},code_challenge:i,code_challenge_method:a},redirectTo:this._maybeAppendFlowIdToRedirect(r?.emailRedirectTo,t)});return this._returnResult({data:{user:null,session:null},error:o})}if(`phone`in e){let{phone:t,options:n}=e,{data:r,error:i}=await M(this.fetch,`POST`,`${this.url}/otp`,{headers:this.headers,body:{phone:t,data:n?.data??{},create_user:n?.shouldCreateUser??!0,gotrue_meta_security:{captcha_token:n?.captchaToken},channel:n?.channel??`sms`}});return this._returnResult({data:{user:null,session:null,messageId:r?.message_id},error:i})}throw new qn(`You must provide either an email or phone number.`)}catch(e){if(await Br(this.storage,this.storageKey,t),D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async verifyOtp(e){try{let t,n;`options`in e&&(t=e.options?.redirectTo,n=e.options?.captchaToken);let{data:r,error:i}=await M(this.fetch,`POST`,`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:n}}),redirectTo:t,xform:N});if(i)throw i;if(!r)throw Error(`An error occurred on token verification.`);let a=r.session,o=r.user;return a?.access_token&&(await this._saveSession(a),await this._notifyAllSubscribers(e.type==`recovery`?`PASSWORD_RECOVERY`:`SIGNED_IN`,a)),this._returnResult({data:{user:o,session:a},error:null})}catch(e){if(D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithSSO(e){let t=null;try{let n=null,r=null;this.flowType===`pkce`&&([n,r,t]=await this._getCodeChallengeAndMethod());let i=await M(this.fetch,`POST`,`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},`providerId`in e?{provider_id:e.providerId}:null),`domain`in e?{domain:e.domain}:null),{redirect_to:this._maybeAppendFlowIdToRedirect(e.options?.redirectTo,t)}),e?.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:n,code_challenge_method:r}),headers:this.headers,xform:si});return i.data?.url&&k()&&!e.options?.skipBrowserRedirect&&window.location.assign(i.data.url),this._returnResult(i)}catch(e){if(await Br(this.storage,this.storageKey,t),D(e))return this._returnResult({data:null,error:e});throw e}}async reauthenticate(){return await this.initializePromise,this.lock==null?await this._reauthenticate():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._reauthenticate())}async _reauthenticate(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)throw n;if(!t)throw new O;let{error:r}=await M(this.fetch,`GET`,`${this.url}/reauthenticate`,{headers:this.headers,jwt:t.access_token});return this._returnResult({data:{user:null,session:null},error:r})})}catch(e){if(D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async resend(e){let t=null;try{let n=`${this.url}/resend`;if(`email`in e){let{email:r,type:i,options:a}=e,o=null,s=null;this.flowType===`pkce`&&([o,s,t]=await this._getCodeChallengeAndMethod());let{error:c}=await M(this.fetch,`POST`,n,{headers:this.headers,body:{email:r,type:i,gotrue_meta_security:{captcha_token:a?.captchaToken},code_challenge:o,code_challenge_method:s},redirectTo:this._maybeAppendFlowIdToRedirect(a?.emailRedirectTo,t)});return c&&await Br(this.storage,this.storageKey,t),this._returnResult({data:{user:null,session:null},error:c})}if(`phone`in e){let{phone:t,type:r,options:i}=e,{data:a,error:o}=await M(this.fetch,`POST`,n,{headers:this.headers,body:{phone:t,type:r,gotrue_meta_security:{captcha_token:i?.captchaToken}}});return this._returnResult({data:{user:null,session:null,messageId:a?.message_id},error:o})}throw new qn(`You must provide either an email or phone number and a type`)}catch(e){if(await Br(this.storage,this.storageKey,t),D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async getSession(){return await this.initializePromise,this.lock==null?await this._useSession(async e=>e):await this._acquireLock(this.lockAcquireTimeout,async()=>this._useSession(async e=>e))}async _acquireLock(e,t){this._debug(`#_acquireLock`,`begin`,e);try{if(this.lockAcquired){let e=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),n=(async()=>(await e,await t()))();return this.pendingInLock.push((async()=>{try{await n}catch{}})()),n}return await this.lock(`lock:${this.storageKey}`,e,async()=>{this._debug(`#_acquireLock`,`lock acquired for storage key`,this.storageKey);try{this.lockAcquired=!0;let e=t();for(this.pendingInLock.push((async()=>{try{await e}catch{}})()),await e;this.pendingInLock.length;){let e=[...this.pendingInLock];await Promise.all(e),this.pendingInLock.splice(0,e.length)}return await e}finally{this._debug(`#_acquireLock`,`lock released for storage key`,this.storageKey),this.lockAcquired=!1}})}finally{this._debug(`#_acquireLock`,`end`)}}async _useSession(e){this._debug(`#_useSession`,`begin`);try{return await e(await this.__loadSession())}finally{this._debug(`#_useSession`,`end`)}}async __loadSession(){this._debug(`#__loadSession()`,`begin`),this.lock!=null&&!this.lockAcquired&&this._debug(`#__loadSession()`,`used outside of an acquired lock!`,Error().stack);try{let e=null,t=await A(this.storage,this.storageKey);if(this._debug(`#getSession()`,`session from storage`,t),t!==null&&(this._isValidSession(t)?e=t:(this._debug(`#getSession()`,`session from storage is not valid`),await this._removeSession())),!e)return{data:{session:null},error:null};let n=e.expires_at?e.expires_at*1e3-Date.now()<jn:!1;if(this._debug(`#__loadSession()`,`session has${n?``:` not`} expired`,`expires_at`,e.expires_at),!n)return{data:{session:await this._hydrateSessionUser(e)},error:null};let{data:r,error:i}=await this._callRefreshToken(e.refresh_token);if(i){let e=await A(this.storage,this.storageKey);return e&&this._isValidSession(e)&&e.expires_at&&e.expires_at*1e3>Date.now()?this._returnResult({data:{session:await this._hydrateSessionUser(e)},error:null}):this._returnResult({data:{session:null},error:i})}return this._returnResult({data:{session:r},error:null})}finally{this._debug(`#__loadSession()`,`end`)}}async _hydrateSessionUser(e){if(this.userStorage){let t=await A(this.userStorage,this.storageKey+`-user`);e.user=t?.user?t.user:Zr()}if(this.storage.isServer&&e.user&&!e.user.__isUserNotAvailableProxy){let t={value:this.suppressGetSessionWarning};e.user=Qr(e.user,t),t.value&&(this.suppressGetSessionWarning=!0)}return e}async getUser(e){if(e)return await this._getUser(e);await this.initializePromise;let t;return t=this.lock==null?await this._getUser():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._getUser()),t.data.user&&(this.suppressGetSessionWarning=!0),t}async _getUser(e){try{return e?await M(this.fetch,`GET`,`${this.url}/user`,{headers:this.headers,jwt:e,xform:oi}):await this._useSession(async e=>{let{data:t,error:n}=e;if(n)throw n;return!t.session?.access_token&&!this.hasCustomAuthorizationHeader?{data:{user:null},error:new O}:await M(this.fetch,`GET`,`${this.url}/user`,{headers:this.headers,jwt:t.session?.access_token??void 0,xform:oi})})}catch(e){if(D(e))return Gn(e)&&await this._removeSession(),this._returnResult({data:{user:null},error:e});throw e}}async updateUser(e,t={}){return await this.initializePromise,this.lock==null?await this._updateUser(e,t):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._updateUser(e,t))}async _updateUser(e,t={}){let n=null;try{return await this._useSession(async r=>{let{data:i,error:a}=r;if(a)throw a;if(!i.session)throw new O;let o=i.session,s=null,c=null;this.flowType===`pkce`&&e.email!=null&&([s,c,n]=await this._getCodeChallengeAndMethod());let{data:l,error:u}=await M(this.fetch,`PUT`,`${this.url}/user`,{headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(t?.emailRedirectTo,n),body:Object.assign(Object.assign({},e),{code_challenge:s,code_challenge_method:c}),jwt:o.access_token,xform:oi});if(u)throw u;return o.user=l.user,await this._saveSession(o),await this._notifyAllSubscribers(`USER_UPDATED`,o),this._returnResult({data:{user:o.user},error:null})})}catch(e){if(await Br(this.storage,this.storageKey,n),D(e))return this._returnResult({data:{user:null},error:e});throw e}}async setSession(e){return await this.initializePromise,this.lock==null?await this._setSession(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._setSession(e))}async _setSession(e){try{if(!e.access_token||!e.refresh_token)throw new O;let t=Date.now()/1e3,n=t,r=!0,i=null,{payload:a}=Tr(e.access_token);if(a.exp&&(n=a.exp,r=n<=t),r){let{data:t,error:n}=await this._callRefreshToken(e.refresh_token);if(n)return this._returnResult({data:{user:null,session:null},error:n});if(!t)return{data:{user:null,session:null},error:null};i=t}else{let{data:r,error:a}=await this._getUser(e.access_token);if(a)return this._returnResult({data:{user:null,session:null},error:a});i={access_token:e.access_token,refresh_token:e.refresh_token,user:r.user,token_type:`bearer`,expires_in:n-t,expires_at:n},await this._saveSession(i),await this._notifyAllSubscribers(`SIGNED_IN`,i)}return this._returnResult({data:{user:i.user,session:i},error:null})}catch(e){if(D(e))return this._returnResult({data:{session:null,user:null},error:e});throw e}}async refreshSession(e){return await this.initializePromise,this.lock==null?await this._refreshSession(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._refreshSession(e))}async _refreshSession(e){try{return await this._useSession(async t=>{if(!e){let{data:n,error:r}=t;if(r)throw r;e=n.session??void 0}if(!e?.refresh_token)throw new O;let{data:n,error:r}=await this._callRefreshToken(e.refresh_token);return r?this._returnResult({data:{user:null,session:null},error:r}):n?this._returnResult({data:{user:n.user,session:n},error:null}):this._returnResult({data:{user:null,session:null},error:null})})}catch(e){if(D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async _getSessionFromURL(e,t){try{if(!k())throw new Jn(`No browser detected.`);if(e.error||e.error_description||e.error_code)throw new Jn(e.error_description||`Error in URL with unspecified error_description`,{error:e.error||`unspecified_error`,code:e.error_code||`unspecified_code`});switch(t){case`implicit`:if(this.flowType===`pkce`)throw new Xn(`Not a valid PKCE flow url.`);break;case`pkce`:if(this.flowType===`implicit`)throw new Jn(`Not a valid implicit grant flow url.`)}if(t===`pkce`){if(this._debug(`#_initialize()`,`begin`,`is PKCE flow`,!0),!e.code)throw new Xn(`No code detected.`);let{data:t,error:n}=await this._exchangeCodeForSession(e.code,{flowId:e[zn]});if(n)throw n;let r=new URL(window.location.href);return r.searchParams.delete(`code`),r.searchParams.delete(zn),window.history.replaceState(window.history.state,``,r.toString()),{data:{session:t.session,redirectType:t.redirectType??null},error:null}}let{provider_token:n,provider_refresh_token:r,access_token:i,refresh_token:a,expires_in:o,expires_at:s,token_type:c}=e;if(!i||!o||!a||!c)throw new Jn(`No session defined in URL`);let l=Math.round(Date.now()/1e3),u=parseInt(o),d=l+u;s&&(d=parseInt(s));let f=d-l;f*1e3<=3e4&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${f}s, should have been closer to ${u}s`);let p=d-u;l-p>=120?console.warn(`@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale`,p,d,l):l-p<0&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew`,p,d,l);let{data:m,error:h}=await this._getUser(i);if(h)throw h;let g={provider_token:n,provider_refresh_token:r,access_token:i,expires_in:u,expires_at:d,refresh_token:a,token_type:c,user:m.user};return window.location.hash=``,this._debug(`#_getSessionFromURL()`,`clearing window.location.hash`),this._returnResult({data:{session:g,redirectType:e.type},error:null})}catch(e){if(D(e))return this._returnResult({data:{session:null,redirectType:null},error:e});throw e}}_isImplicitGrantCallback(e){return typeof this.detectSessionInUrl==`function`?this.detectSessionInUrl(new URL(window.location.href),e):!!(e.access_token||e.error||e.error_description||e.error_code)}async _isPKCECallback(e){if(!e.code)return!1;let t=Nr(e[zn]);return t&&await A(this.storage,Fr(this.storageKey,t))?!0:!!await A(this.storage,`${this.storageKey}-code-verifier`)}async signOut(e={scope:`global`}){return await this.initializePromise,this.lock==null?await this._signOut(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._signOut(e))}async _signOut({scope:e}={scope:`global`}){return await this._useSession(async t=>{let n=async()=>{await this._removeSession()},{data:r,error:i}=t;if(i&&!Gn(i))return this._returnResult({error:i});let a=r.session?.access_token;if(a){let{error:t}=await this.admin.signOut(a,e);if(t&&!(Hn(t)&&(t.status===404||t.status===401||t.status===403)||Gn(t)))return e!==`others`&&await n(),this._returnResult({error:t})}return e!==`others`&&await n(),this._returnResult({error:null})})}onAuthStateChange(e){let t=_r(),n={id:t,callback:e,unsubscribe:()=>{this._debug(`#unsubscribe()`,`state change callback with id removed`,t),this.stateChangeEmitters.delete(t)}};return this._debug(`#onAuthStateChange()`,`registered callback with id`,t),this.stateChangeEmitters.set(t,n),(async()=>{await this.initializePromise,this.lock==null?await this._emitInitialSession(t):await this._acquireLock(this.lockAcquireTimeout,async()=>{this._emitInitialSession(t)})})(),{data:{subscription:n}}}async _emitInitialSession(e){return await this._useSession(async t=>{try{let{data:{session:n},error:r}=t;if(r)throw r;await this.stateChangeEmitters.get(e)?.callback(`INITIAL_SESSION`,n),this._debug(`INITIAL_SESSION`,`callback id`,e,`session`,n)}catch(t){if(await this.stateChangeEmitters.get(e)?.callback(`INITIAL_SESSION`,null),this._debug(`INITIAL_SESSION`,`callback id`,e,`error`,t),tr(t))return;Gn(t)||$n(t)||Hn(t)&&(t.code===`refresh_token_not_found`||t.code===`refresh_token_already_used`||t.code===`session_expired`)?console.warn(t):console.error(t)}})}async resetPasswordForEmail(e,t={}){let n=null,r=null,i=null;this.flowType===`pkce`&&([n,r,i]=await this._getCodeChallengeAndMethod(!0));try{return await M(this.fetch,`POST`,`${this.url}/recover`,{body:{email:e,code_challenge:n,code_challenge_method:r,gotrue_meta_security:{captcha_token:t.captchaToken}},headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(t.redirectTo,i)})}catch(e){if(await Br(this.storage,this.storageKey,i),D(e))return this._returnResult({data:null,error:e});throw e}}async getUserIdentities(){try{let{data:e,error:t}=await this.getUser();if(t)throw t;return this._returnResult({data:{identities:e.user.identities??[]},error:null})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async linkIdentity(e){return`token`in e?this.linkIdentityIdToken(e):this.linkIdentityOAuth(e)}async linkIdentityOAuth(e){let t=null;try{let{data:n,error:r}=await this._useSession(async n=>{let{data:r,error:i}=n;if(i)throw i;let{url:a,flowId:o}=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,e.provider,{redirectTo:e.options?.redirectTo,scopes:e.options?.scopes,queryParams:e.options?.queryParams,skipBrowserRedirect:!0});return t=o,await M(this.fetch,`GET`,a,{headers:this.headers,jwt:r.session?.access_token??void 0})});if(r)throw r;return k()&&!e.options?.skipBrowserRedirect&&window.location.assign(n?.url),this._returnResult({data:{provider:e.provider,url:n?.url,flowId:t},error:null})}catch(n){if(D(n))return this._returnResult({data:{provider:e.provider,url:null,flowId:t},error:n});throw n}}async linkIdentityIdToken(e){return await this._useSession(async t=>{try{let{error:n,data:{session:r}}=t;if(n)throw n;let{options:i,provider:a,token:o,access_token:s,nonce:c}=e,{data:l,error:u}=await M(this.fetch,`POST`,`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:r?.access_token??void 0,body:{provider:a,id_token:o,access_token:s,nonce:c,link_identity:!0,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:N});return u?this._returnResult({data:{user:null,session:null},error:u}):!l||!l.session||!l.user?this._returnResult({data:{user:null,session:null},error:new Kn}):(l.session&&(await this._saveSession(l.session),await this._notifyAllSubscribers(`USER_UPDATED`,l.session)),this._returnResult({data:l,error:u}))}catch(e){if(await Br(this.storage,this.storageKey,null),D(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}})}async unlinkIdentity(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)throw r;return await M(this.fetch,`DELETE`,`${this.url}/user/identities/${e.identity_id}`,{headers:this.headers,jwt:n.session?.access_token??void 0})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _refreshAccessToken(e){let t=`#_refreshAccessToken()`;this._debug(t,`begin`);try{let n=Date.now();return await Dr(async n=>(n>0&&await Er(200*2**(n-1)),this._debug(t,`refreshing attempt`,n),await M(this.fetch,`POST`,`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:N})),(e,t)=>{let r=200*2**e;return t&&$n(t)&&Date.now()+r-n<3e4})}catch(e){if(this._debug(t,`error`,e),D(e))return this._returnResult({data:{session:null,user:null},error:e});throw e}finally{this._debug(t,`end`)}}_isValidSession(e){return typeof e==`object`&&!!e&&`access_token`in e&&`refresh_token`in e&&`expires_at`in e}async _handleProviderSignIn(e,t){let{url:n,flowId:r}=await this._getUrlForProvider(`${this.url}/authorize`,e,{redirectTo:t.redirectTo,scopes:t.scopes,queryParams:t.queryParams});return this._debug(`#_handleProviderSignIn()`,`provider`,e,`options`,t,`url`,n),k()&&!t.skipBrowserRedirect&&window.location.assign(n),{data:{provider:e,url:n,flowId:r},error:null}}async _recoverAndRefresh(){let e=`#_recoverAndRefresh()`;this._debug(e,`begin`);try{let t=await A(this.storage,this.storageKey);if(t&&this.userStorage){let e=await A(this.userStorage,this.storageKey+`-user`);!this.storage.isServer&&Object.is(this.storage,this.userStorage)&&!e&&(e={user:t.user},await Cr(this.userStorage,this.storageKey+`-user`,e)),t.user=e?.user??Zr()}else if(t&&!t.user&&!t.user){let e=await A(this.storage,this.storageKey+`-user`);e&&e?.user?(t.user=e.user,await j(this.storage,this.storageKey+`-user`),await Cr(this.storage,this.storageKey,t)):t.user=Zr()}if(this._debug(e,`session from storage`,t),!this._isValidSession(t)){this._debug(e,`session is not valid`),t!==null&&await this._removeSession();return}let n=(t.expires_at??1/0)*1e3-Date.now()<jn;if(this._debug(e,`session has${n?``:` not`} expired with margin of ${jn}s`),n){if(this.autoRefreshToken&&t.refresh_token){let{error:n}=await this._callRefreshToken(t.refresh_token);n&&(tr(n)?this._debug(e,`refresh discarded by commit guard`,n):this._debug(e,`refresh failed`,n))}}else if(t.user&&t.user.__isUserNotAvailableProxy===!0)try{let{data:n,error:r}=await this._getUser(t.access_token);!r&&n?.user?(t.user=n.user,await this._saveSession(t),await this._notifyAllSubscribers(`SIGNED_IN`,t)):this._debug(e,`could not get user data, skipping SIGNED_IN notification`)}catch(t){console.error(`Error getting user data:`,t),this._debug(e,`error getting user data, skipping SIGNED_IN notification`,t)}else await this._notifyAllSubscribers(`SIGNED_IN`,t)}catch(t){this._debug(e,`error`,t),$n(t)?console.warn(t):console.error(t);return}finally{this._debug(e,`end`)}}async _callRefreshToken(e){var t,n;if(!e)throw new O;if(this.refreshingDeferred)return this.refreshingDeferred.promise;if(this.lastRefreshFailure&&this.lastRefreshFailure.refreshToken===e&&Date.now()<this.lastRefreshFailure.expiresAt)return this._debug(`#_callRefreshToken()`,`returning cached failure (cooldown active)`),this.lastRefreshFailure.result;let r=`#_callRefreshToken()`;this._debug(r,`begin`);try{this.refreshingDeferred=new wr,this.refreshingDeferred.promise.then(void 0,()=>{});let t=await A(this.storage,this.storageKey),{data:n,error:i}=await this._refreshAccessToken(e);if(i)throw i;if(!n.session)throw new O;let a=await A(this.storage,this.storageKey);if(t!==null&&(a===null||a.refresh_token!==t.refresh_token)){this._debug(r,`commit guard: storage changed since refresh started, discarding rotated tokens`,{startedWith:`present`,nowHolds:a?`replaced`:`cleared`});let e={data:null,error:new er};return this.refreshingDeferred.resolve(e),e}let o=this._sessionRemovalEpoch;if(await this._saveSession(n.session),this._sessionRemovalEpoch!==o){this._debug(r,`commit guard (post-save): _removeSession ran during _saveSession, undoing write`),await j(this.storage,this.storageKey),this.userStorage&&await j(this.userStorage,this.storageKey+`-user`);let e={data:null,error:new er};return this.refreshingDeferred.resolve(e),e}await this._notifyAllSubscribers(`TOKEN_REFRESHED`,n.session);let s={data:n.session,error:null};return this.lastRefreshFailure=null,this.refreshingDeferred.resolve(s),s}catch(i){if(this._debug(r,`error`,i),D(i)){let n={data:null,error:i};if(!$n(i)){let e=await A(this.storage,this.storageKey);e?.expires_at&&e.expires_at*1e3>Date.now()?this._debug(r,`proactive refresh failed, access token still valid — preserving session`):await this._removeSession()}return this.lastRefreshFailure={refreshToken:e,result:n,expiresAt:Date.now()+Mn},(t=this.refreshingDeferred)==null||t.resolve(n),n}throw(n=this.refreshingDeferred)==null||n.reject(i),i}finally{this.refreshingDeferred=null,this._debug(r,`end`)}}async _notifyAllSubscribers(e,t,n=!0){if(this._pendingInitNotifications!==null&&n){this._pendingInitNotifications.push({event:e,session:t,broadcast:n});return}let r=`#_notifyAllSubscribers(${e})`;this._debug(r,`begin`,t,`broadcast = ${n}`);try{this.broadcastChannel&&n&&this.broadcastChannel.postMessage({event:e,session:t});let r=[],i=Array.from(this.stateChangeEmitters.values()).map(async n=>{try{await n.callback(e,t)}catch(e){r.push(e)}});if(await Promise.all(i),r.length>0){for(let e=0;e<r.length;e+=1)console.error(r[e]);throw r[0]}}finally{this._debug(r,`end`)}}async _saveSession(e){this._debug(`#_saveSession()`,e),this.suppressGetSessionWarning=!0;let t=Object.assign({},e),n=t.user&&t.user.__isUserNotAvailableProxy===!0;if(this.userStorage){!n&&t.user&&await Cr(this.userStorage,this.storageKey+`-user`,{user:t.user});let e=Object.assign({},t);delete e.user;let r=$r(e);await Cr(this.storage,this.storageKey,r)}else{let e=$r(t);await Cr(this.storage,this.storageKey,e)}}async _removeSession(){this._sessionRemovalEpoch+=1,this._debug(`#_removeSession()`),this.lastRefreshFailure=null,this.suppressGetSessionWarning=!1,await j(this.storage,this.storageKey),await Vr(this.storage,this.storageKey),await j(this.storage,this.storageKey+`-user`),this.userStorage&&await j(this.userStorage,this.storageKey+`-user`),await this._notifyAllSubscribers(`SIGNED_OUT`,null)}_removeVisibilityChangedCallback(){this._debug(`#_removeVisibilityChangedCallback()`);let e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&k()&&window!=null&&window.removeEventListener&&window.removeEventListener(`visibilitychange`,e)}catch(e){console.error(`removing visibilitychange callback failed`,e)}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug(`#_startAutoRefresh()`);let e=setInterval(()=>this._autoRefreshTokenTick(),An);this.autoRefreshTicker=e,e&&typeof e==`object`&&typeof e.unref==`function`?e.unref():typeof Deno<`u`&&typeof Deno.unrefTimer==`function`&&Deno.unrefTimer(e);let t=setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0);this.autoRefreshTickTimeout=t,t&&typeof t==`object`&&typeof t.unref==`function`?t.unref():typeof Deno<`u`&&typeof Deno.unrefTimer==`function`&&Deno.unrefTimer(t)}async _stopAutoRefresh(){this._debug(`#_stopAutoRefresh()`);let e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e);let t=this.autoRefreshTickTimeout;this.autoRefreshTickTimeout=null,t&&clearTimeout(t)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async dispose(){var e;this._removeVisibilityChangedCallback(),await this._stopAutoRefresh(),(e=this.broadcastChannel)==null||e.close(),this.broadcastChannel=null,this.stateChangeEmitters.clear()}async _autoRefreshTokenTick(){if(this._debug(`#_autoRefreshTokenTick()`,`begin`),this.lock!=null)try{await this._acquireLock(0,async()=>{try{let e=Date.now();try{return await this._useSession(async t=>{let{data:{session:n}}=t;if(!n||!n.refresh_token||!n.expires_at){this._debug(`#_autoRefreshTokenTick()`,`no session`);return}let r=Math.floor((n.expires_at*1e3-e)/An);this._debug(`#_autoRefreshTokenTick()`,`access token expires in ${r} ticks, a tick lasts ${An}ms, refresh threshold is 3 ticks`),r<=3&&await this._callRefreshToken(n.refresh_token)})}catch(e){console.error(`Auto refresh tick failed with error. This is likely a transient error.`,e)}}finally{this._debug(`#_autoRefreshTokenTick()`,`end`)}})}catch(e){if(e instanceof mi)this._debug(`auto refresh token tick lock not available`);else throw e}else if(this.refreshingDeferred!==null)this._debug(`#_autoRefreshTokenTick()`,`refresh already in flight, skipping`);else try{let e=Date.now();try{await this._useSession(async t=>{let{data:{session:n}}=t;if(!n||!n.refresh_token||!n.expires_at){this._debug(`#_autoRefreshTokenTick()`,`no session`);return}let r=Math.floor((n.expires_at*1e3-e)/An);this._debug(`#_autoRefreshTokenTick()`,`access token expires in ${r} ticks, a tick lasts ${An}ms, refresh threshold is 3 ticks`),r<=3&&await this._callRefreshToken(n.refresh_token)})}catch(e){console.error(`Auto refresh tick failed with error. This is likely a transient error.`,e)}}finally{this._debug(`#_autoRefreshTokenTick()`,`end`)}}async _handleVisibilityChange(){if(this._debug(`#_handleVisibilityChange()`),!k()||!(window!=null&&window.addEventListener))return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>{try{await this._onVisibilityChanged(!1)}catch(e){this._debug(`#visibilityChangedCallback`,`error`,e)}},window==null||window.addEventListener(`visibilitychange`,this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch(e){console.error(`_handleVisibilityChange`,e)}}async _onVisibilityChanged(e){let t=`#_onVisibilityChanged(${e})`;if(this._debug(t,`visibilityState`,document.visibilityState),document.visibilityState===`visible`){if(this.autoRefreshToken&&this._startAutoRefresh(),!e){if(await this.initializePromise,this.lock!=null)await this._acquireLock(this.lockAcquireTimeout,async()=>{document.visibilityState===`visible`?await this._recoverAndRefresh():this._debug(t,`acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting`)});else{if(document.visibilityState!==`visible`){this._debug(t,`visibilityState is no longer visible, skipping recovery`);return}await this._recoverAndRefresh()}}}else document.visibilityState===`hidden`&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(e,t,n){let r=n?.redirectTo,i=null,a=null,o=null;this.flowType===`pkce`&&([i,a,o]=await this._getCodeChallengeAndMethod(),r=this._maybeAppendFlowIdToRedirect(r,o));let s=[`provider=${encodeURIComponent(t)}`];if(r&&s.push(`redirect_to=${encodeURIComponent(r)}`),n?.scopes&&s.push(`scopes=${encodeURIComponent(n.scopes)}`),i!=null&&a!=null){let e=new URLSearchParams({code_challenge:`${encodeURIComponent(i)}`,code_challenge_method:`${encodeURIComponent(a)}`});s.push(e.toString())}if(n?.queryParams){let e=new URLSearchParams(n.queryParams);s.push(e.toString())}return n?.skipBrowserRedirect&&s.push(`skip_http_redirect=${n.skipBrowserRedirect}`),{url:`${e}?${s.join(`&`)}`,flowId:o}}_maybeAppendFlowIdToRedirect(e,t){return!e||!t||!this.experimental.appendPkceFlowIdToRedirects?e??void 0:Hr(e,t)}async _getCodeChallengeAndMethod(e=!1){return Ur(this.storage,this.storageKey,e,e=>this._debug(`#_getCodeChallengeAndMethod()`,`evicted oldest pending PKCE verifier slot`,e))}async _unenroll(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;return r?this._returnResult({data:null,error:r}):await M(this.fetch,`DELETE`,`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:n?.session?.access_token})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _enroll(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=Object.assign({friendly_name:e.friendlyName,factor_type:e.factorType},e.factorType===`phone`?{phone:e.phone}:e.factorType===`totp`?{issuer:e.issuer}:{}),{data:a,error:o}=await M(this.fetch,`POST`,`${this.url}/factors`,{body:i,headers:this.headers,jwt:n?.session?.access_token});return o?this._returnResult({data:null,error:o}):(e.factorType===`totp`&&a.type===`totp`&&a?.totp?.qr_code&&(a.totp.qr_code=`data:image/svg+xml;utf-8,${a.totp.qr_code}`),this._returnResult({data:a,error:null}))})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _verify(e){let t=async()=>{try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=Object.assign({challenge_id:e.challengeId},`webauthn`in e?{webauthn:Object.assign(Object.assign({},e.webauthn),{credential_response:e.webauthn.type===`create`?Ei(e.webauthn.credential_response):Di(e.webauthn.credential_response)})}:{code:e.code}),{data:a,error:o}=await M(this.fetch,`POST`,`${this.url}/factors/${e.factorId}/verify`,{body:i,headers:this.headers,jwt:n?.session?.access_token});return o?this._returnResult({data:null,error:o}):(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+a.expires_in},a)),await this._notifyAllSubscribers(`MFA_CHALLENGE_VERIFIED`,a),this._returnResult({data:a,error:o}))})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}};return this.lock==null?t():this._acquireLock(this.lockAcquireTimeout,t)}async _challenge(e){let t=async()=>{try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=await M(this.fetch,`POST`,`${this.url}/factors/${e.factorId}/challenge`,{body:e,headers:this.headers,jwt:n?.session?.access_token});if(i.error)return i;let{data:a}=i;if(a.type!==`webauthn`)return{data:a,error:null};switch(a.webauthn.type){case`create`:return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:wi(a.webauthn.credential_options.publicKey)})})}),error:null};case`request`:return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:Ti(a.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}};return this.lock==null?t():this._acquireLock(this.lockAcquireTimeout,t)}async _challengeAndVerify(e){let{data:t,error:n}=await this._challenge({factorId:e.factorId});return n?this._returnResult({data:null,error:n}):await this._verify({factorId:e.factorId,challengeId:t.id,code:e.code})}async _listFactors(){let{data:{user:e},error:t}=await this.getUser();if(t)return{data:null,error:t};let n={all:[],phone:[],totp:[],webauthn:[],recovery_code:[]};for(let t of e?.factors??[])n.all.push(t),t.status===`verified`&&t.factor_type in n&&Array.isArray(n[t.factor_type])&&n[t.factor_type].push(t);return{data:n,error:null}}async _getAuthenticatorAssuranceLevel(e){if(e)try{let{payload:t}=Tr(e),n=null;t.aal&&(n=t.aal);let r=n,{data:{user:i},error:a}=await this.getUser(e);if(a)return this._returnResult({data:null,error:a});((i?.factors)?.filter(e=>e.status===`verified`)??[]).length>0&&(r=`aal2`);let o=t.amr||[];return{data:{currentLevel:n,nextLevel:r,currentAuthenticationMethods:o},error:null}}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}let{data:{session:t},error:n}=await this.getSession();if(n)return this._returnResult({data:null,error:n});if(!t)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};let{payload:r}=Tr(t.access_token),i=null;r.aal&&(i=r.aal);let a=i;(t.user.factors?.filter(e=>e.status===`verified`)??[]).length>0&&(a=`aal2`);let o=r.amr||[];return{data:{currentLevel:i,nextLevel:a,currentAuthenticationMethods:o},error:null}}async _getRecoveryCodesStatus(){Xr(this.experimental);try{return await this._useSession(async e=>{let{data:t,error:n}=e;if(n)return this._returnResult({data:null,error:n});let{data:r,error:i}=await M(this.fetch,`GET`,`${this.url}/factors/recovery-codes`,{headers:this.headers,jwt:t?.session?.access_token});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _generateRecoveryCodes(e){Xr(this.experimental);try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let{data:i,error:a}=await M(this.fetch,`POST`,`${this.url}/factors/recovery-codes`,{body:e?.friendlyName?{friendly_name:e.friendlyName}:void 0,headers:this.headers,jwt:n?.session?.access_token});return a?this._returnResult({data:null,error:a}):this._returnResult({data:i,error:null})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _verifyRecoveryCode(e){Xr(this.experimental);let t=async()=>{try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let{data:i,error:a}=await M(this.fetch,`POST`,`${this.url}/factors/recovery-codes/verify`,{body:{code:e.code},headers:this.headers,jwt:n?.session?.access_token});if(a)return this._returnResult({data:null,error:a});let o=Object.assign({expires_at:gr(i.expires_in)},i);return await this._saveSession(o),await this._notifyAllSubscribers(`MFA_CHALLENGE_VERIFIED`,o),this._returnResult({data:i,error:null})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}};return this.lock==null?t():this._acquireLock(this.lockAcquireTimeout,t)}async _regenerateRecoveryCodes(){Xr(this.experimental);try{return await this._useSession(async e=>{let{data:t,error:n}=e;if(n)return this._returnResult({data:null,error:n});let{data:r,error:i}=await M(this.fetch,`POST`,`${this.url}/factors/recovery-codes/regenerate`,{headers:this.headers,jwt:t?.session?.access_token});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _unenrollRecoveryCodes(){Xr(this.experimental);try{return await this._useSession(async e=>{let{data:t,error:n}=e;if(n)return this._returnResult({data:null,error:n});let{data:r,error:i}=await M(this.fetch,`DELETE`,`${this.url}/factors/recovery-codes`,{headers:this.headers,jwt:t?.session?.access_token});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _getAuthorizationDetails(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;return r?this._returnResult({data:null,error:r}):n?await M(this.fetch,`GET`,`${this.url}/oauth/authorizations/${e}`,{headers:this.headers,jwt:n.access_token,xform:e=>({data:e,error:null})}):this._returnResult({data:null,error:new O})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _approveAuthorization(e,t){try{return await this._useSession(async n=>{let{data:{session:r},error:i}=n;if(i)return this._returnResult({data:null,error:i});if(!r)return this._returnResult({data:null,error:new O});let a=await M(this.fetch,`POST`,`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:r.access_token,body:{action:`approve`},xform:e=>({data:e,error:null})});return a.data&&a.data.redirect_url&&k()&&!t?.skipBrowserRedirect&&window.location.assign(a.data.redirect_url),a})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _denyAuthorization(e,t){try{return await this._useSession(async n=>{let{data:{session:r},error:i}=n;if(i)return this._returnResult({data:null,error:i});if(!r)return this._returnResult({data:null,error:new O});let a=await M(this.fetch,`POST`,`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:r.access_token,body:{action:`deny`},xform:e=>({data:e,error:null})});return a.data&&a.data.redirect_url&&k()&&!t?.skipBrowserRedirect&&window.location.assign(a.data.redirect_url),a})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _listOAuthGrants(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;return n?this._returnResult({data:null,error:n}):t?await M(this.fetch,`GET`,`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:t.access_token,xform:e=>({data:e,error:null})}):this._returnResult({data:null,error:new O})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _revokeOAuthGrant(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;return r?this._returnResult({data:null,error:r}):n?(await M(this.fetch,`DELETE`,`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:n.access_token,query:{client_id:e.clientId},noResolveJson:!0}),{data:{},error:null}):this._returnResult({data:null,error:new O})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async fetchJwk(e,t={keys:[]}){let n=t.keys.find(t=>t.kid===e);if(n)return n;let r=Date.now();if(n=this.jwks.keys.find(t=>t.kid===e),n&&this.jwks_cached_at+6e5>r)return n;let{data:i,error:a}=await M(this.fetch,`GET`,`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(a)throw a;return!i.keys||i.keys.length===0||(this.jwks=i,this.jwks_cached_at=r,n=i.keys.find(t=>t.kid===e),!n)?null:n}async getClaims(e,t={}){try{let n=e;if(!n){let{data:e,error:t}=await this.getSession();if(t||!e.session)return this._returnResult({data:null,error:t});n=e.session.access_token}let{header:r,payload:i,signature:a,raw:{header:o,payload:s}}=Tr(n);if(!t?.allowExpired)try{Kr(i.exp)}catch(e){throw new rr(e instanceof Error?e.message:`JWT validation failed`)}let c=!r.alg||r.alg.startsWith(`HS`)||!r.kid||!(`crypto`in globalThis&&`subtle`in globalThis.crypto)?null:await this.fetchJwk(r.kid,t?.keys?{keys:t.keys}:t?.jwks);if(!c){let{error:e}=await this.getUser(n);if(e)throw e;return{data:{claims:i,header:r,signature:a},error:null}}let l=qr(r.alg),u=await crypto.subtle.importKey(`jwk`,c,l,!0,[`verify`]);if(!await crypto.subtle.verify(l,u,a,mr(`${o}.${s}`)))throw new rr(`Invalid JWT signature`);return{data:{claims:i,header:r,signature:a},error:null}}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async signInWithPasskey(e){try{if(!ki())return this._returnResult({data:null,error:new Un(`Browser does not support WebAuthn`,null)});let{data:t,error:n}=await this._startPasskeyAuthentication({options:{captchaToken:e?.options?.captchaToken}});if(n||!t)return this._returnResult({data:null,error:n});let{data:r,error:i}=await ji({publicKey:Ti(t.options),signal:e?.options?.signal??Ci.createNewAbortSignal(),mediation:e?.options?.mediation});if(i||!r)return this._returnResult({data:null,error:i??new Un(`WebAuthn ceremony failed`,null)});let a=Di(r);return this._verifyPasskeyAuthentication({challengeId:t.challenge_id,credential:a})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async registerPasskey(e){try{if(!ki())return this._returnResult({data:null,error:new Un(`Browser does not support WebAuthn`,null)});let{data:t,error:n}=await this._startPasskeyRegistration();if(n||!t)return this._returnResult({data:null,error:n});let{data:r,error:i}=await Ai({publicKey:wi(t.options),signal:e?.options?.signal??Ci.createNewAbortSignal()});if(i||!r)return this._returnResult({data:null,error:i??new Un(`WebAuthn ceremony failed`,null)});let a=Ei(r);return this._verifyPasskeyRegistration({challengeId:t.challenge_id,credential:a})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _startPasskeyRegistration(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)return this._returnResult({data:null,error:n});if(!t)return this._returnResult({data:null,error:new O});let{data:r,error:i}=await M(this.fetch,`POST`,`${this.url}/passkeys/registration/options`,{headers:this.headers,jwt:t.access_token,body:{}});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _verifyPasskeyRegistration(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new O});let{data:i,error:a}=await M(this.fetch,`POST`,`${this.url}/passkeys/registration/verify`,{headers:this.headers,jwt:n.access_token,body:{challenge_id:e.challengeId,credential:e.credential}});return a?this._returnResult({data:null,error:a}):this._returnResult({data:i,error:null})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _startPasskeyAuthentication(e){try{let{data:t,error:n}=await M(this.fetch,`POST`,`${this.url}/passkeys/authentication/options`,{headers:this.headers,body:{gotrue_meta_security:{captcha_token:e?.options?.captchaToken}}});return n?this._returnResult({data:null,error:n}):this._returnResult({data:t,error:null})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _verifyPasskeyAuthentication(e){try{let{data:t,error:n}=await M(this.fetch,`POST`,`${this.url}/passkeys/authentication/verify`,{headers:this.headers,body:{challenge_id:e.challengeId,credential:e.credential},xform:N});return n?this._returnResult({data:null,error:n}):(t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers(`SIGNED_IN`,t.session)),this._returnResult({data:t,error:null}))}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _listPasskeys(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)return this._returnResult({data:null,error:n});if(!t)return this._returnResult({data:null,error:new O});let{data:r,error:i}=await M(this.fetch,`GET`,`${this.url}/passkeys`,{headers:this.headers,jwt:t.access_token,xform:e=>({data:e,error:null})});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _updatePasskey(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new O});let{data:i,error:a}=await M(this.fetch,`PATCH`,`${this.url}/passkeys/${e.passkeyId}`,{headers:this.headers,jwt:n.access_token,body:{friendly_name:e.friendlyName}});return a?this._returnResult({data:null,error:a}):this._returnResult({data:i,error:null})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}async _deletePasskey(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new O});let{error:i}=await M(this.fetch,`DELETE`,`${this.url}/passkeys/${e.passkeyId}`,{headers:this.headers,jwt:n.access_token,noResolveJson:!0});return i?this._returnResult({data:null,error:i}):this._returnResult({data:null,error:null})})}catch(e){if(D(e))return this._returnResult({data:null,error:e});throw e}}};Vi.nextInstanceID={};var Hi=Vi,Ui=`2.118.0`,Wi=``,Gi;if(typeof Deno<`u`)Wi=`deno`,Gi=Deno.version?.deno;else if(typeof document<`u`)Wi=`web`;else if(typeof navigator<`u`&&navigator.product===`ReactNative`)Wi=`react-native`;else{var Ki;Wi=`node`;let e=globalThis.process;Gi=e==null||(Ki=e.version)==null?void 0:Ki.replace(/^v/,``)}var qi=[`runtime=${Wi}`];Gi&&qi.push(`runtime-version=${Gi}`);var Ji={headers:{"X-Client-Info":`supabase-js/${Ui}; ${qi.join(`; `)}`}},Yi={schema:`public`},Xi={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:`implicit`},Zi={},Qi={enabled:!1,respectSamplingDecision:!0};function $i(e){if(!e||typeof e!=`string`)return null;let t=e.split(`-`);if(t.length!==4)return null;let[n,r,i,a]=t;if(n.length!==2||r.length!==32||i.length!==16||a.length!==2)return null;let o=/^[0-9a-f]+$/i;return!o.test(n)||!o.test(r)||!o.test(i)||!o.test(a)||r===`00000000000000000000000000000000`||i===`0000000000000000`?null:{version:n,traceId:r,parentId:i,traceFlags:a,isSampled:(parseInt(a,16)&1)==1}}function ea(e,t){if(!e||!t||t.length===0)return!1;let n;if(e instanceof URL)n=e;else try{n=new URL(e)}catch{return!1}for(let e of t)try{if(typeof e==`string`){if(ta(n.hostname,e))return!0}else if(e instanceof RegExp){if(e.test(n.hostname))return!0}else if(typeof e==`function`&&e(n))return!0}catch{continue}return!1}function ta(e,t){if(t===e)return!0;if(t.startsWith(`*.`)){let n=t.slice(2);if(e.endsWith(n)&&(e===n||e.endsWith(`.`+n)))return!0}return!1}function na(e){let t=[];try{let n=new URL(e);t.push(n.hostname)}catch{}return t.push(`*.supabase.co`,`*.supabase.in`),t.push(`localhost`,`127.0.0.1`,`[::1]`),t}function ra(e){"@babel/helpers - typeof";return ra=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},ra(e)}function ia(e,t){if(ra(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(ra(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function aa(e){var t=ia(e,`string`);return ra(t)==`symbol`?t:t+``}function oa(e,t,n){return(t=aa(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function sa(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function F(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?sa(Object(n),!0).forEach(function(t){oa(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):sa(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var ca=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),la=()=>Headers,ua=e=>e.startsWith(`sb_publishable_`)||e.startsWith(`sb_secret_`),da=`sb_temp_`,fa=new Set,pa=e=>{if(!e.startsWith(`sb_`)||ua(e)||e.startsWith(da))return;let t=e.match(/^sb_[a-zA-Z0-9]+_/)?.[0]??`unknown`;fa.has(t)||(fa.add(t),console.warn(`@supabase/supabase-js: Unrecognized Supabase API key format. The client will proceed and send this key as-is; if you see authentication errors you may need to upgrade @supabase/supabase-js to a version that recognizes this key type.`))},ma=(e,t,n,r,i,a)=>{let o=ca(r),s=la(),c=i?.enabled===!0,l=i?.respectSamplingDecision!==!1,u=c?na(t):null,d=!(a?.omitApiKeyAsBearer&&ua(e));return async(t,r)=>{let i=await n(),a=new s(r?.headers);if(a.has(`apikey`)||a.set(`apikey`,e),!a.has(`Authorization`)){let t=i??(d?e:null);t&&a.set(`Authorization`,`Bearer ${t}`)}if(u){let e=_a(t,u,l);e&&(e.traceparent&&!a.has(`traceparent`)&&a.set(`traceparent`,e.traceparent),e.tracestate&&!a.has(`tracestate`)&&a.set(`tracestate`,e.tracestate),e.baggage&&!a.has(`baggage`)&&a.set(`baggage`,e.baggage))}return o(t,F(F({},r),{},{headers:a}))}},ha=!1,ga=!1;function _a(e,n,r){let i=t();if(!i)return ha||(ha=!0,console.warn("@supabase/supabase-js: tracePropagation is enabled but the tracing runtime is not loaded, so trace headers will not be attached. Add `import '@supabase/supabase-js/tracing'` at your application entry point (requires the OpenTelemetry API package to be installed). The CDN/UMD build does not support trace propagation.")),null;if(!ea(typeof e==`string`||e instanceof URL?e:e.url,n))return null;let a=i();if(!a||!a.traceparent){var o;if(a!=null&&(o=a.carrierKeys)!=null&&o.length&&!ga){ga=!0;let e=a.carrierKeys.includes(`sentry-trace`)?" Sentry detected: set `propagateTraceparent: true` in Sentry.init() to emit it.":` Configure your tracing SDK to emit W3C trace context on outgoing requests.`;console.warn(`@supabase/supabase-js: tracePropagation is enabled and a tracing SDK is active, but its propagator wrote [${a.carrierKeys.join(`, `)}] and no W3C traceparent header, so trace headers will not be attached.`+e)}return null}if(r){let e=$i(a.traceparent);if(e&&!e.isSampled)return{traceparent:a.traceparent}}return a}function va(e){return typeof e==`boolean`?{enabled:e}:e}function ya(e){return e.endsWith(`/`)?e:e+`/`}var ba=!1;function xa(e){ba||typeof e==`object`&&e&&`schema`in e&&e.schema!==void 0&&(ba=!0,console.warn(`@supabase/supabase-js: The "schema" option must be nested under "db", e.g. createClient(url, key, { db: { schema: 'myschema' } }). A top-level "schema" is ignored and queries go to the default schema.`))}function Sa(e,t){let{db:n,auth:r,realtime:i,global:a}=e,{db:o,auth:s,realtime:c,global:l}=t,u=va(e.tracePropagation),d=va(t.tracePropagation),f={db:F(F({},o),n),auth:F(F({},s),r),realtime:F(F({},c),i),storage:{},global:F(F(F({},l),a),{},{headers:F(F({},l?.headers??{}),a?.headers??{})}),tracePropagation:{enabled:u?.enabled??d?.enabled??!1,respectSamplingDecision:u?.respectSamplingDecision??d?.respectSamplingDecision??!0},accessToken:async()=>``};return e.accessToken?f.accessToken=e.accessToken:delete f.accessToken,f}function Ca(e){let t=e?.trim();if(!t)throw Error(`supabaseUrl is required.`);if(!t.match(/^https?:\/\//i))throw Error(`Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.`);try{return new URL(ya(t))}catch{throw Error(`Invalid supabaseUrl: Provided URL is malformed.`)}}var wa=class extends Hi{constructor(e){super(e)}},Ta=class{constructor(e,t,n){this.supabaseUrl=e,this.supabaseKey=t;let r=Ca(e);if(!t)throw Error(`supabaseKey is required.`);pa(t),xa(n),this.realtimeUrl=new URL(`realtime/v1`,r),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace(`http`,`ws`),this.authUrl=new URL(`auth/v1`,r),this.storageUrl=new URL(`storage/v1`,r),this.functionsUrl=new URL(`functions/v1`,r);let i=`sb-${r.hostname.split(`.`)[0]}-auth-token`,a={db:Yi,realtime:Zi,auth:F(F({},Xi),{},{storageKey:i}),global:Ji,tracePropagation:Qi},o=Sa(n??{},a);this.settings=o,this.storageKey=o.auth.storageKey??``,this.headers=o.global.headers??{},o.accessToken?(this.accessToken=o.accessToken,this.auth=new Proxy({},{get:(e,t)=>{throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t)} is not possible`)}})):this.auth=this._initSupabaseAuthClient(o.auth??{},this.headers,o.global.fetch),this.fetch=ma(t,e,this._getSessionToken.bind(this),o.global.fetch,o.tracePropagation),this.functionsFetch=ma(t,e,this._getSessionToken.bind(this),o.global.fetch,o.tracePropagation,{omitApiKeyAsBearer:!0}),this.realtime=this._initRealtimeClient(F({headers:this.headers,accessToken:this._getAccessToken.bind(this),fetch:this.fetch},o.realtime)),this.accessToken&&Promise.resolve(this.accessToken()).then(e=>this.realtime.setAuth(e)).catch(e=>console.warn(`Failed to set initial Realtime auth token:`,e)),this.rest=new le(new URL(`rest/v1`,r).href,{headers:this.headers,schema:o.db.schema,fetch:this.fetch,timeout:o.db.timeout,urlLengthLimit:o.db.urlLengthLimit,retry:o.db.retry}),this.storage=new On(this.storageUrl.href,this.headers,this.fetch,n?.storage),o.accessToken||this._listenForAuthEvents()}get functions(){return new u(this.functionsUrl.href,{headers:this.headers,customFetch:this.functionsFetch})}from(e){return this.rest.from(e)}schema(e){return this.rest.schema(e)}getOpenApiSpec(){return this.rest.getOpenApiSpec()}rpc(e,t={},n={head:!1,get:!1,count:void 0}){return this.rest.rpc(e,t,n)}channel(e,t={config:{}}){return this.realtime.channel(e,t)}getChannels(){return this.realtime.getChannels()}removeChannel(e){return this.realtime.removeChannel(e)}removeAllChannels(){return this.realtime.removeAllChannels()}async _getSessionToken(){var e=this;if(e.accessToken)return await e.accessToken();let{data:t}=await e.auth.getSession();return t.session?.access_token??null}async _getAccessToken(){var e=this;return await e._getSessionToken()??e.supabaseKey}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:t,detectSessionInUrl:n,storage:r,userStorage:i,storageKey:a,flowType:o,lock:s,debug:c,throwOnError:l,experimental:u,lockAcquireTimeout:d,skipAutoInitialize:f},p,m){let h={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new wa({url:this.authUrl.href,headers:F(F({},h),p),storageKey:a,autoRefreshToken:e,persistSession:t,detectSessionInUrl:n,storage:r,userStorage:i,flowType:o,lock:s,debug:c,throwOnError:l,experimental:u,fetch:m,lockAcquireTimeout:d,skipAutoInitialize:f,hasCustomAuthorizationHeader:Object.keys(this.headers).some(e=>e.toLowerCase()===`authorization`)})}_initRealtimeClient(e){return new Ot(this.realtimeUrl.href,F(F({},e),{},{params:F(F({},{apikey:this.supabaseKey}),e?.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((e,t)=>{this._handleTokenChanged(e,`CLIENT`,t?.access_token)})}_handleTokenChanged(e,t,n){(e===`TOKEN_REFRESHED`||e===`SIGNED_IN`||e===`INITIAL_SESSION`)&&this.changedAccessToken!==n?(this.changedAccessToken=n,this.realtime.setAuth(n)):e===`SIGNED_OUT`&&(this.realtime.setAuth(),t==`STORAGE`&&this.auth.signOut(),this.changedAccessToken=void 0)}},Ea=(e,t,n)=>new Ta(e,t,n);function Da(){if(typeof window<`u`||globalThis.Deno!==void 0)return!1;let e=globalThis.process;if(!e)return!1;let t=e.version;if(t==null)return!1;let n=t.match(/^v(\d+)\./);return n?parseInt(n[1],10)<=20:!1}Da()&&console.warn(`⚠️  Node.js 20 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 22 or later. For more information, visit: https://github.com/orgs/supabase/discussions/45715`);var Oa=`https://ioikcrdxneuydylyhvwi.supabase.co`,ka=`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvaWtjcmR4bmV1eWR5bHlodndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNzc4NTIsImV4cCI6MjEwODk1Mzg1Mn0.dQTvZ6YjjD3SthqvgZjoj7NmHNI1bNk-pSILYmS1N4M`,Aa=!!ka,ja=`alumnos.ecoems.mx`,Ma=`production`,I=Aa?Ea(Oa,ka,{auth:{persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}}):null;function Na(e){let t=String(e||``).trim().toLowerCase().replace(/@.*$/,``).replace(/\s+/g,``);return t?`${t}@${ja}`:``}var Pa=612,Fa=792,Ia=56;function La(e){return String(e??``).split(``).map(e=>e.codePointAt(0)<=255?e:`?`).join(``)}function Ra(e){return La(e).replace(/\\/g,`\\\\`).replace(/\(/g,`\\(`).replace(/\)/g,`\\)`).replace(/[\r\n]+/g,` `).trim()}function za(e){let t=0;for(let n=0;n<e.length;n++)t+=e.charCodeAt(n)<=255?1:2;return t}function Ba(e){let t=new Uint8Array(za(e)),n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<=255?t[n++]=i:(t[n++]=63,i>65535&&(t[n++]=63))}return t}function Va(e,t,n,{size:r=11,bold:i=!1,x:a=Ia}={}){e.push(`BT /${i?`F2`:`F1`} ${r} Tf 1 0 0 1 ${a} ${n} Tm (${Ra(t)}) Tj ET`)}function Ha(e,t){e.push(`0.6 w ${Ia} ${t} m 556 ${t} l S`)}function Ua(e,t,n,r){Va(e,t,r,{size:9,bold:!0}),Va(e,n,r-15,{size:11})}function Wa(e){let t=e||{},n=t.status===`voided`,r=[];Va(r,`ECOEMS`,722,{size:22,bold:!0}),Va(r,`Recibo de pago`,696,{size:13}),n&&Va(r,`PAGO ANULADO`,670,{size:14,bold:!0}),Ha(r,656),Ua(r,`FOLIO`,t.receipt_no||t.id||`SIN FOLIO`,628),Ua(r,`ALUMNO`,t.student_name||`—`,582),Ua(r,`CODIGO Y GRUPO`,`${t.student_code||`—`}${t.group_name?` · ${t.group_name}`:``}`,536),Ua(r,`FECHA DE PAGO`,t.paid_at||`—`,490),Ua(r,`METODO`,t.method||`—`,444),Ua(r,`PERIODO CUBIERTO`,t.period_start||t.period?`${t.period_start||t.period}${t.period_end?` — ${t.period_end}`:``}`:`No especificado`,398),Ua(r,`PLAN`,t.plan||`No especificado`,352),Ua(r,`ESTADO`,n?`Anulado`:`Pagado`,306),n&&t.void_reason&&Ua(r,`MOTIVO DE ANULACION`,t.void_reason,260),Ha(r,250),Va(r,`Importe pagado`,226,{size:12,bold:!0}),Va(r,La(t.amount||`—`),226,{size:16,bold:!0,x:420}),Ha(r,208),Va(r,`Documento generado por la plataforma ECOEMS. Conserve este recibo para sus registros.`,176,{size:9}),Va(r,`Folio: ${t.receipt_no||t.id||`SIN FOLIO`}`,158,{size:9});let i=r.join(`
`)+`
`,a=[`<< /Type /Catalog /Pages 2 0 R >>`,`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${Pa} ${Fa}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`,`<< /Length ${za(i)} >>\nstream\n${i}endstream`,`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`,`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`],o=`%PDF-1.4
%âãÏÓ
`,s=[0];a.forEach((e,t)=>{s[t+1]=za(o),o+=`${t+1} 0 obj\n${e}\nendobj\n`});let c=za(o),l=a.length+1;o+=`xref\n0 ${l}\n0000000000 65535 f\r\n`;for(let e=1;e<l;e++)o+=`${String(s[e]).padStart(10,`0`)} 00000 n\r\n`;return o+=`trailer\n<< /Size ${l} /Root 1 0 R >>\nstartxref\n${c}\n%%EOF\n`,Ba(o)}function Ga(e){return`recibo-${String(e?.receipt_no||e?.id||`recibo`).replace(/[^A-Za-z0-9._-]+/g,`-`).replace(/^-+|-+$/g,``)||`ecoems`}.pdf`}function Ka(e){let t=new Blob([Wa(e)],{type:`application/pdf`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=Ga(e),document.body.appendChild(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3)}var qa=`./guia-examen-espanol.html`,Ja=[`A`,`B`,`C`,`D`,`E`,`F`];function L(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function Ya(e){let t=Math.max(0,Math.round(Number(e||0)/1e3)),n=Math.floor(t/60),r=t%60;return`${String(n).padStart(2,`0`)}:${String(r).padStart(2,`0`)}`}function Xa(e){if(!e)return`—`;let t=new Date(e);return Number.isNaN(t.getTime())?`—`:t.toLocaleString(`es-MX`,{year:`numeric`,month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`})}async function Za(){if(!I)return{available:!1,enabled:!1,last:null,status:null};try{let[e,t]=await Promise.all([I.rpc(`app_final_exam_status`),I.from(`final_exam_sessions`).select(`id,started_at,finished_at,status,score,correct_answers,total_questions`).order(`started_at`,{ascending:!1}).limit(1)]);if(e.error)throw e.error;if(t.error)throw t.error;return{available:!0,status:e.data,enabled:!!e.data?.enabled,last:t.data?.[0]||null}}catch{return{available:!1,enabled:!1,last:null,status:null}}}function Qa(e){if(!e?.available)return``;let t=!!e.enabled,n=e.last,r=n?.status===`completed`,i=t?`<span class="pill success">Activo</span>`:`<span class="pill pill-amber">Aún no activado</span>`,a=r?`<p class="exam-last-result">Último resultado: <strong>${Number(n.score).toFixed(2)}%</strong> · ${n.correct_answers}/${n.total_questions} aciertos <small>${L(Xa(n.finished_at))}</small></p>`:n?.status===`in_progress`?`<p class="exam-last-result">Tienes un examen en curso.</p>`:``;return`
    <article class="card wide exam-card">
      <div class="card-heading">
        <div>
          <span class="card-label">Evaluación</span>
          <h2>Examen final de Español</h2>
        </div>
        ${i}
      </div>
      <p class="muted">${t?`13 secciones con temas vistos en desorden. Tus respuestas, aciertos y tiempos quedan registrados.`:`El examen se abrirá cuando se active oficialmente. Mientras tanto, ya puedes estudiar con la guía.`}</p>
      ${a}
      <div class="row exam-card-actions">
        ${t?`<button class="btn primary" data-open-final-exam>Contestar examen →</button>`:``}
        <a class="btn ghost" href="${qa}" target="_blank" rel="noopener">📖 Guía de examen (imprimir)</a>
      </div>
    </article>
  `}var R=null;function $a(e,{onClose:t}){R={root:e,onClose:t,view:`intro`,error:``,status:null,sessionId:null,sections:[],questions:[],index:0,answers:new Map,questionStart:0,result:null,startedAt:0},no(),eo()}async function eo(){if(!R)return;let e=await Za();R&&R.view===`intro`&&(R.status=e.status,e.enabled||(R.error=`El examen todavía no está activo. Puedes seguir estudiando con la guía.`),no())}function to(e){return`
    <div class="shell">
      <header class="top">
        <a class="brand" href="/" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span>ECOEMS <small>Plataforma</small></span>
        </a>
        <div class="top-actions">
          <button class="btn ghost" id="exam-back">← Volver al panel</button>
        </div>
      </header>
      <main id="main-content" tabindex="-1" class="dashboard exam-main">
        ${R.error?`<div class="alert error" role="alert">${L(R.error)}</div>`:``}
        ${e}
      </main>
    </div>
  `}function no(){if(!R)return;let e=R.view===`question`?ao():R.view===`results`?mo():ro();R.root.innerHTML=to(e),R.root.querySelector(`#exam-back`)?.addEventListener(`click`,()=>{(R.view!==`question`||window.confirm(`¿Salir del examen? Tu sesión quedará abierta y podrías perder el tiempo medido.`))&&R.onClose?.()}),R.root.querySelectorAll(`[data-exam-action]`).forEach(e=>{e.addEventListener(`click`,()=>so(e.dataset.examAction,e.dataset))})}function ro(){let e=R.status,t=!!e?.enabled;return`
    <article class="card wide exam-intro">
      <span class="card-label">Evaluación final</span>
      <h1>Examen final de Español</h1>
      <p class="muted">Una evaluación completa de todos los temas vistos en la materia.</p>
      <div class="exam-facts">
        <div><strong>${e?.sections??13}</strong><small>secciones (temas vistos)</small></div>
        <div><strong>${e?.questions??136}</strong><small>preguntas del banco</small></div>
        <div><strong>∞</strong><small>tiempo libre por respuesta</small></div>
      </div>
      <ul class="exam-rules">
        <li>Las secciones aparecen en <strong>orden distinto</strong> al que se vieron en clase; cada una corresponde a un tema.</li>
        <li>Se mide el tiempo de <strong>cada pregunta</strong> y de <strong>cada sección</strong>.</li>
        <li>No verás si acertaste hasta terminar: el puntaje se calcula en el servidor.</li>
        <li>Responde en una sola sesión y revisa antes de terminar.</li>
      </ul>
      <div class="row exam-intro-actions">
        ${t?`<button class="btn primary" data-exam-action="start">Comenzar examen →</button>`:`<button class="btn primary" disabled>Examen pendiente de activación</button>`}
        <a class="btn ghost" href="${qa}" target="_blank" rel="noopener">📖 Estudiar con la guía</a>
      </div>
      ${t?``:`<p class="muted"><small>Cuando se active, regresa aquí y podrás contestarlo en la plataforma. La guía ya está lista para estudiar en casa.</small></p>`}
    </article>
  `}function io(e){return R.sections.find(t=>t.key===e.sectionKey)}function ao(){let e=R.questions[R.index];if(!e)return mo();let t=io(e),n=R.questions.filter(t=>t.sectionKey===e.sectionKey&&R.answers.get(t.id)?.selected!=null).length,r=R.questions.filter(t=>t.sectionKey===e.sectionKey).length,i=R.answers.get(e.id)?.selected;return`
    <div class="exam-layout">
      <aside class="exam-aside">
        <span class="card-label">Secciones</span>
        <ol class="exam-section-list">
          ${R.sections.map(t=>{let n=R.questions.filter(e=>e.sectionKey===t.key).length,r=R.questions.filter(e=>e.sectionKey===t.key&&R.answers.get(e.id)?.selected!=null).length;return`
              <li>
                <button data-exam-action="jump" data-index="${R.questions.findIndex(e=>e.sectionKey===t.key)}" class="${t.key===e.sectionKey?`active`:``}">
                  <span>${L(t.title)}</span>
                  <small>${r}/${n} · ${Ya(oo(t.key))}</small>
                </button>
              </li>
            `}).join(``)}
        </ol>
      </aside>

      <section class="card exam-question">
        <div class="exam-progress-top">
          <span>Pregunta ${R.index+1} de ${R.questions.length}</span>
          <span>Sección ${t?.order??`—`} · ${L(t?.title||`Tema`)} (${n}/${r})</span>
        </div>
        <progress class="exam-progress" max="${R.questions.length}" value="${R.index+1}"></progress>
        <h2>${L(e.prompt)}</h2>
        <div class="exam-options">
          ${(e.options||[]).map((e,t)=>`
            <button class="exam-option ${i===t?`selected`:``}" data-exam-action="answer" data-option="${t}">
              <span class="exam-letter">${Ja[t]||t+1}</span>
              <span>${L(e)}</span>
            </button>
          `).join(``)}
        </div>
        <div class="answer-foot exam-nav">
          <button class="btn ghost" data-exam-action="prev" ${R.index===0?`disabled`:``}>← Anterior</button>
          <span class="muted"><small>${R.questions.filter(e=>R.answers.get(e.id)?.selected!=null).length} contestadas</small></span>
          ${R.index===R.questions.length-1?`<button class="btn primary" data-exam-action="finish">Terminar examen ✓</button>`:`<button class="btn primary" data-exam-action="next">Siguiente →</button>`}
        </div>
      </section>
    </div>
  `}function oo(e){let t=0;for(let n of R.questions)n.sectionKey===e&&(t+=R.answers.get(n.id)?.elapsed||0,n.id===R.questions[R.index]?.id&&(t+=Math.max(0,Math.round(performance.now()-R.questionStart))));return t}async function so(e,t){if(e===`start`)return co();if(e===`answer`)return uo(Number(t.option));if(e===`next`)return fo(R.index+1);if(e===`prev`)return fo(R.index-1);if(e===`jump`)return fo(Number(t.index));if(e===`finish`)return po();if(e===`retry`)return $a(R.root,{onClose:R.onClose})}async function co(){if(R.error=``,!I)return R.error=`La plataforma no está conectada a la base de datos.`,no();let{data:e,error:t}=await I.rpc(`app_start_final_exam`);if(t)return R.error=t.message||`No se pudo iniciar el examen.`,no();R.sessionId=e.sessionId,R.questions=e.questions||[],R.sections=e.sections||[],R.startedAt=Date.now(),R.answers=new Map,R.index=0,R.view=`question`,R.error=``,R.questionStart=performance.now(),no()}function lo(){let e=R.questions[R.index];if(!e)return;let t=Math.max(0,Math.round(performance.now()-R.questionStart)),n=R.answers.get(e.id)||{selected:null,elapsed:0};n.elapsed+=t,R.answers.set(e.id,n),R.questionStart=performance.now()}async function uo(e){let t=R.questions[R.index];if(!t||!Number.isInteger(e))return;let n=R.answers.get(t.id)||{selected:null,elapsed:0},r=n.selected,i=Math.max(0,Math.round(performance.now()-R.questionStart));R.questionStart=performance.now(),R.answers.set(t.id,{selected:e,elapsed:n.elapsed+i}),R.root.querySelectorAll(`.exam-option`).forEach(t=>{t.classList.toggle(`selected`,Number(t.dataset.option)===e)});let{error:a}=await I.rpc(`app_answer_final_exam`,{p_session_id:R.sessionId,p_question_id:t.id,p_selected_index:e,p_duration_ms:n.elapsed+i});a?(R.answers.set(t.id,{selected:r,elapsed:n.elapsed}),R.error=a.message||`No se pudo guardar la respuesta; vuelve a intentarlo.`,no()):R.root.querySelector(`.exam-question`)?.querySelectorAll(`.exam-option`).forEach(t=>{t.classList.toggle(`selected`,Number(t.dataset.option)===e)})}function fo(e){e<0||e>=R.questions.length||(lo(),R.index=e,R.error=``,no(),R.root.querySelector(`.exam-question h2`)?.scrollIntoView({block:`start`,behavior:`smooth`}))}async function po(){lo();let e=R.questions.filter(e=>R.answers.get(e.id)?.selected==null).length;if(e&&!window.confirm(`Todavía hay ${e} preguntas sin contestar. ¿Terminar de todos modos?`))return;let{data:t,error:n}=await I.rpc(`app_finish_final_exam`,{p_session_id:R.sessionId});if(n)return R.error=n.message||`No se pudo terminar el examen.`,no();R.result=t,R.view=`results`,R.error=``,no()}function mo(){let e=R.result;if(!e)return ro();let t=Date.now()-R.startedAt,n=Number(e.score||0),r=n>=70?`good`:n>=60?`fair`:`bad`;return`
    <article class="card wide exam-result">
      <div class="exam-result-head">
        <div>
          <span class="card-label">Resultado</span>
          <h1>Examen final de Español</h1>
          <p class="muted">Sesión ${L(e.sessionId)} · terminado ${L(Xa(new Date))}</p>
        </div>
        <div class="exam-score ${r}">
          <strong>${n.toFixed(2)}%</strong>
          <small>${e.correct}/${e.total} aciertos</small>
        </div>
      </div>

      <div class="exam-facts">
        <div><strong>${Ya(t)}</strong><small>tiempo total de la sesión</small></div>
        <div><strong>${Ya(e.durationMs)}</strong><small>tiempo contestando</small></div>
        <div><strong>${e.answered}/${e.total}</strong><small>respuestas registradas</small></div>
      </div>

      <h2>Desglose por sección</h2>
      <div class="exam-table-wrap">
        <table class="exam-table">
          <thead><tr><th>#</th><th>Tema</th><th>Aciertos</th><th>Tiempo</th></tr></thead>
          <tbody>
            ${(e.sections||[]).map(e=>`
              <tr>
                <td>${e.num}</td>
                <td>${L(e.title)}</td>
                <td>${e.correct}/${e.total}</td>
                <td>${Ya(e.timeMs)}</td>
              </tr>
            `).join(``)}
          </tbody>
        </table>
      </div>

      <h2>Revisión de respuestas</h2>
      <div class="exam-review">
        ${(e.answers||[]).map((e,t)=>`
          <details class="exam-review-item ${e.isCorrect?`ok`:`wrong`}">
            <summary>
              <span>${t+1}. ${L(e.prompt)}</span>
              <span class="pill ${e.isCorrect?`success`:`pill-amber`}">${e.isCorrect?`Correcta`:`Incorrecta`} · ${Ya(e.durationMs)}</span>
            </summary>
            <p>Tu respuesta: <strong>${e.selectedIndex==null?`Sin responder`:L(Ja[e.selectedIndex]||e.selectedIndex+1)}</strong> · Correcta: <strong>${L(Ja[e.correctIndex]||e.correctIndex+1)}</strong></p>
            ${e.explanation?`<p class="muted">${L(e.explanation)}</p>`:``}
          </details>
        `).join(``)}
      </div>

      <div class="row exam-result-actions">
        <button class="btn ghost" data-exam-action="retry">Volver al inicio</button>
        <a class="btn ghost" href="${qa}" target="_blank" rel="noopener">📖 Repasar con la guía</a>
      </div>
    </article>
  `}var ho=`Ciencia y tecnología.Computación y programación.Matemáticas.Salud y medicina.Biología y naturaleza.Química.Física.Arte y diseño.Música.Danza y teatro.Lectura y escritura.Idiomas.Historia y cultura.Ciencias sociales.Derecho.Negocios y economía.Liderazgo y política.Deportes.Cocina y gastronomía.Moda y belleza.Construcción y mecánica.Electrónica.Videojuegos.Medio ambiente.Ayudar a las personas.Educación y docencia.Turismo y viajes`.split(`.`),go=[`Razonamiento lógico-matemático`,`Comprensión lectora`,`Expresión escrita`,`Memoria`,`Creatividad`,`Trabajo en equipo`,`Liderazgo`,`Comunicación oral`,`Organización`,`Concentración`,`Manualidad / habilidad técnica`,`Resolución de problemas`,`Imaginación espacial`,`Cálculo mental`,`Dibujo y trazo`],_o=[`Bachillerato general`,`Bachillerato técnico`,`Carrera técnica`,`Preparatoria`,`Opción de trabajo`,`Otro`],vo=[`UNAM`,`IPN`,`Colegio de Bachilleres`,`CONALEP`,`DGETI (CBTIS)`,`DGETA (CBTA)`,`CECyTE`,`UAEMéx`,`UAM`,`Privadas`,`Otra`],yo={UNAM:[{n:`ENP 1 Gabino Barreda`,r:`100–108`},{n:`ENP 2 Erasmo Castellanos Quinto`,r:`96–104`},{n:`ENP 3 Justo Sierra`,r:`94–101`},{n:`ENP 4 Vidal Castañeda y Nájera`,r:`93–100`},{n:`ENP 5 José Vasconcelos`,r:`95–102`},{n:`ENP 6 Antonio Caso`,r:`94–101`},{n:`ENP 7 Ezequiel A. Chávez`,r:`92–99`},{n:`ENP 8 Miguel E. Schulz`,r:`91–98`},{n:`ENP 9 Pedro de Alba`,r:`108–115`},{n:`CCH Azcapotzalco`,r:`86–93`},{n:`CCH Naucalpan`,r:`88–95`},{n:`CCH Oriente`,r:`80–87`},{n:`CCH Sur`,r:`90–97`},{n:`CCH Vallejo`,r:`88–95`}],IPN:[{n:`CECyT 1 Gonzalo Vázquez Vela`,r:`95–102`},{n:`CECyT 2 Miguel Bernard`,r:`80–88`},{n:`CECyT 3 Estanislao Ramírez Ruiz`,r:`99–106`},{n:`CECyT 4 Lázaro Cárdenas`,r:`88–95`},{n:`CECyT 5 Benito Juárez`,r:`89–96`},{n:`CECyT 6 Miguel Othón de Mendizábal`,r:`85–92`},{n:`CECyT 7 Cuauhtémoc`,r:`90–97`},{n:`CECyT 8 Narciso Bassols`,r:`87–94`},{n:`CECyT 9 Juan de Dios Bátiz`,r:`101–109`},{n:`CECyT 10 Carlos Vallejo Márquez`,r:`88–95`},{n:`CECyT 11 Wilfrido Massieu`,r:`91–99`},{n:`CECyT 12 José María Morelos`,r:`90–97`},{n:`CECyT 13 Ricardo Flores Magón`,r:`82–90`},{n:`CECyT 14 Luis Enrique Erro`,r:`80–88`},{n:`CECyT 15 Diódoro Antúnez Echegaray`,r:`80–87`}],"Colegio de Bachilleres":[{n:`Plantel 1 El Rosario`,r:`74–82`},{n:`Plantel 2 Cien Metros`,r:`72–80`},{n:`Plantel 3 Iztacalco`,r:`70–78`},{n:`Plantel 4 Lázaro Cárdenas`,r:`68–76`},{n:`Plantel 5 Satélite`,r:`72–80`},{n:`Plantel 8 Tepepan`,r:`76–84`},{n:`Plantel 9 Aragón`,r:`70–78`},{n:`Plantel 13 Xochimilco`,r:`74–82`}],CONALEP:[{n:`Plantel 1 (CDMX)`,r:`66–74`},{n:`Plantel 2 (CDMX)`,r:`64–72`},{n:`Plantel 3 (CDMX)`,r:`62–70`},{n:`Plantel Estado de México`,r:`60–68`}],"DGETI (CBTIS)":[{n:`CBTIS 1`,r:`72–80`},{n:`CBTIS 3`,r:`70–78`},{n:`CBTIS 4`,r:`68–76`},{n:`CBTIS 7`,r:`68–76`},{n:`CBTIS 55`,r:`66–74`}],"DGETA (CBTA)":[{n:`CBTA 1`,r:`64–72`},{n:`CBTA 2`,r:`62–70`}],CECyTE:[{n:`CECyTE 1`,r:`62–70`},{n:`CECyTE 2`,r:`60–68`}],UAEMéx:[{n:`Prepa 1 San Mateo`,r:`74–82`},{n:`Prepa 2 Texcoco`,r:`70–78`},{n:`Prepa 3 Toluca`,r:`68–76`}],UAM:[],Otra:[]},bo={UNAM:{desc:`Preparatorias de la UNAM (ENP y CCH). Formación general, humanista y científica; es la vía 'tradicional' para entrar a licenciaturas UNAM.`,pase:`Pase de bachillerato: al pasar todas las materias obtienes tu certificado y, si tienes buen promedio, aseguras un lugar por el 'pase directo' a licenciatura UNAM (según cupo y carrera).`,uni:`Sí. Pase directo a cualquier licenciatura de la UNAM por promedio; también puedes ir a otras universidades.`},IPN:{desc:`Vocacionales del IPN (CECyT). Bachillerato tecnológico bivalente: estudias temas de bachillerato y una tecnicatura (carrera técnica).`,pase:`Pase de bachillerato y TecNM: al acreditar la tecnicatura obtienes un título técnico y puedes continuar a licenciatura del IPN (pase directo, según cupo).`,uni:`Sí. Las carreras del IPN dan pase directo a ingeniería/licenciatura del IPN; el título técnico te permite trabajar al terminar.`},"Colegio de Bachilleres":{desc:`Preparatorias públicas de la CDMX. Bachillerato general, con opción a 'pase' a la UNAM u otras universidades.`,pase:`No tiene pase directo garantizado; se ingresa por examen.`,uni:`Sí, pero por examen de admisión (UNAM, IPN, etc.).`},CONALEP:{desc:`Educación media superior técnica (profesional técnico bachiller). Te vuelves técnico en una carrera (mecánica, informática, alimentos, etc.).`,pase:`No hay pase directo a universidad; te certifica como Profesional Técnico Bachiller.`,uni:`Sí, por examen. El título técnico te ayuda a incorporarte al trabajo antes de la universidad.`},"DGETI (CBTIS)":{desc:`Bachillerato tecnológico bivalente (federal). Combina preparatoria con una carrera técnica (CBTIS).`,pase:`No hay pase directo automático; certificado de bachillerato + técnico.`,uni:`Sí, por examen (IPN, UNAM, tecnológicos).`},"DGETA (CBTA)":{desc:`Bachillerato técnico agropecuario (CBTA). Enfocado a producción y campo.`,pase:`No hay pase directo; certificado de bachillerato técnico agropecuario.`,uni:`Sí, por examen (universidades agropecuarias y afines).`},CECyTE:{desc:`Colegio de Estudios Científicos y Tecnológicos del Estado de México. Bachillerato tecnológico estatal.`,pase:`No hay pase directo; bachillerato + técnico.`,uni:`Sí, por examen (UAEMéx, tecnológicos).`},UAEMéx:{desc:`Preparatorias de la Universidad Autónoma del Estado de México. Cerca de Cuautitlán y con pase al nivel superior de la propia universidad.`,pase:`Pase (interno) a las licenciaturas de la UAEMéx al concluir con buen promedio.`,uni:`Sí. La UAEMéx ofrece pase interno a sus licenciaturas; también puedes aplicar a otras.`},UAM:{desc:`Universidad Autónoma Metropolitana. No tiene bachillerato propio; se entra a licenciatura por examen.`,pase:`—`,uni:`Es universidad; se ingresa a licenciatura por examen.`},Privadas:{desc:`Escuelas particulares (preparatorias privadas). Suele haber opción bilingüe, grupos pequeños y acompañamiento; el costo es alto. Verifica su RVOE o incorporación (UNAM/IPN/UAEMéx) para saber qué certificado otorgan.`,pase:`No hay 'pase' automático a universidad pública; muchas están incorporadas y puedes presentar examen de admisión como cualquier egresado.`,uni:`Sí, por examen (o por pase a la universidad privada del mismo grupo). Revisa si está incorporada a UNAM/IPN/UAEMéx.`},Otra:{desc:`Otras instituciones.`,pase:`—`,uni:`—`}},xo=yo,So=[`inst`,`nombre`,`tipo`,`zona`,`km`,`tiempo`,`aciertos`,`pase`,`fuerte`,`orienta`,`carreras`,`uni`,`tags`],Co=[[`UNAM`,`ENP 1 Gabino Barreda`,`Bachillerato general`,`Coyoacán, CDMX`,`40`,`1 h 25`,`100–108`,`Pase directo UNAM (por promedio)`,`Formación general y humanista de alto nivel`,`Ciencias, humanidades y salud`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Ciencias`,`Humanidades`,`Salud`]],[`UNAM`,`ENP 2 Erasmo Castellanos Quinto`,`Bachillerato general`,`Churubusco/Iztapalapa, CDMX`,`42`,`1 h 20`,`96–104`,`Pase directo UNAM (por promedio)`,`Equilibrio ciencias/humanidades`,`Ciencias y humanidades`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Ciencias`,`Humanidades`]],[`UNAM`,`ENP 3 Justo Sierra`,`Bachillerato general`,`Centro, CDMX`,`37`,`1 h 10`,`94–101`,`Pase directo UNAM (por promedio)`,`Humanidades y ciencias sociales`,`Humanidades, sociales y artes`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Humanidades`,`Sociales`,`Arte`]],[`UNAM`,`ENP 4 Vidal Castañeda y Nájera`,`Bachillerato general`,`Azcapotzalco, CDMX`,`24`,`50 min`,`93–100`,`Pase directo UNAM (por promedio)`,`Ciencias exactas y experimentales`,`Ciencias y tecnología`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Ciencias`,`Tecnología`]],[`UNAM`,`ENP 5 José Vasconcelos`,`Bachillerato general`,`Texcoco/Aragón, Edomex`,`32`,`1 h 05`,`95–102`,`Pase directo UNAM (por promedio)`,`Ciencias biológicas y de la salud`,`Salud y ciencias experimentales`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Salud`,`Ciencias`]],[`UNAM`,`ENP 6 Antonio Caso`,`Bachillerato general`,`Santa María la Ribera, CDMX`,`33`,`1 h 05`,`94–101`,`Pase directo UNAM (por promedio)`,`Ciencias y humanidades`,`Ciencias y humanidades`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Ciencias`,`Humanidades`]],[`UNAM`,`ENP 8 Miguel E. Schulz`,`Bachillerato general`,`Centro, CDMX`,`37`,`1 h 10`,`91–98`,`Pase directo UNAM (por promedio)`,`Formación general`,`Ciencias y humanidades`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Ciencias`,`Humanidades`]],[`UNAM`,`ENP 9 Pedro de Alba`,`Bachillerato general`,`Lindavista, CDMX`,`22`,`50 min`,`108–115`,`Pase directo UNAM (por promedio)`,`Alta exigencia académica; muy solicitada`,`Ciencias, salud y humanidades`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Ciencias`,`Salud`,`Humanidades`]],[`UNAM`,`CCH Azcapotzalco`,`Bachillerato general`,`Azcapotzalco, CDMX`,`22`,`45 min`,`86–93`,`Pase directo UNAM (por promedio)`,`Modelo CCH: científico-humanístico`,`Ciencias y humanidades`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Ciencias`,`Humanidades`]],[`UNAM`,`CCH Naucalpan`,`Bachillerato general`,`Naucalpan, Edomex`,`20`,`40 min`,`88–95`,`Pase directo UNAM (por promedio)`,`CCH con enfoque científico-humanístico`,`Ciencias y humanidades`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Ciencias`,`Humanidades`]],[`UNAM`,`CCH Vallejo`,`Bachillerato general`,`GAM, CDMX`,`20`,`40 min`,`88–95`,`Pase directo UNAM (por promedio)`,`CCH con talleres y laboratorios`,`Ciencias, salud y técnicas`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Ciencias`,`Salud`,`Tecnología`]],[`UNAM`,`CCH Sur`,`Bachillerato general`,`Coyoacán, CDMX`,`43`,`1 h 25`,`90–97`,`Pase directo UNAM (por promedio)`,`CCH con orientación a ciencias y salud`,`Salud y ciencias experimentales`,`No ofrece carrera técnica`,`Pase directo a licenciaturas UNAM`,[`Salud`,`Ciencias`]],[`IPN`,`CECyT 1 Gonzalo Vázquez Vela`,`Bachillerato tecnológico`,`Zacatenco, GAM, CDMX`,`27`,`55 min`,`95–102`,`Pase directo IPN (por promedio)`,`Ingeniería y ciencias físico-matemáticas`,`Tecnología e ingeniería`,`Tecnicatura (varias)`,`Pase a ingenierías del IPN; título técnico`,[`Tecnología`,`Ciencias`]],[`IPN`,`CECyT 3 Estanislao Ramírez Ruiz`,`Bachillerato tecnológico`,`Zacatenco, GAM, CDMX`,`27`,`55 min`,`99–106`,`Pase directo IPN (por promedio)`,`Ingeniería de alto nivel; muy solicitada`,`Ingeniería y tecnología`,`Tecnicatura (varias)`,`Pase a ingenierías del IPN; título técnico`,[`Tecnología`,`Ciencias`]],[`IPN`,`CECyT 6 Miguel Othón de Mendizábal`,`Bachillerato tecnológico`,`Casco de Santo Tomás, CDMX`,`30`,`1 h`,`85–92`,`Pase directo IPN (por promedio)`,`Ciencias de la salud y biológicas`,`Salud y ciencias biológicas`,`Tecnicatura (salud)`,`Pase a licenciaturas IPN (salud); título técnico`,[`Salud`,`Ciencias`]],[`IPN`,`CECyT 9 Juan de Dios Bátiz`,`Bachillerato tecnológico`,`Zacatenco, GAM, CDMX`,`27`,`55 min`,`101–109`,`Pase directo IPN (por promedio)`,`Informática, computación e ingeniería`,`Tecnología, computación e ingeniería`,`Tecnicatura (informática)`,`Pase a ingenierías del IPN; título técnico`,[`Tecnología`,`Ciencias`]],[`IPN`,`CECyT 11 Wilfrido Massieu`,`Bachillerato tecnológico`,`Zacatenco, GAM, CDMX`,`28`,`1 h`,`91–99`,`Pase directo IPN (por promedio)`,`Ciencias sociales y administrativas`,`Sociales, negocios y turismo`,`Tecnicatura (sociales/admin.)`,`Pase a licenciaturas IPN; título técnico`,[`Sociales`,`Negocios`]],[`IPN`,`CECyT 12 José María Morelos`,`Bachillerato tecnológico`,`Casco de Santo Tomás, CDMX`,`30`,`1 h`,`90–97`,`Pase directo IPN (por promedio)`,`Ciencias médico-biológicas`,`Salud y ciencias biológicas`,`Tecnicatura (salud)`,`Pase a licenciaturas IPN; título técnico`,[`Salud`,`Ciencias`]],[`IPN`,`CECyT 13 Ricardo Flores Magón`,`Bachillerato tecnológico`,`Azcapotzalco, CDMX`,`22`,`50 min`,`82–90`,`Pase directo IPN (por promedio)`,`Construcción, mecánica y procesos`,`Ingeniería y oficios técnicos`,`Tecnicatura (industrial)`,`Pase a licenciaturas IPN; título técnico`,[`Tecnología`,`Técnico`]],[`IPN`,`CECyT 15 Diódoro Antúnez Echegaray`,`Bachillerato tecnológico`,`GAM, CDMX`,`24`,`50 min`,`80–87`,`Pase directo IPN (por promedio)`,`Técnico industrial y servicios`,`Tecnología y oficios`,`Tecnicatura (industrial)`,`Pase a licenciaturas IPN; título técnico`,[`Tecnología`,`Técnico`]],[`Colegio de Bachilleres`,`Plantel 1 El Rosario`,`Bachillerato general`,`Azcapotzalco, CDMX`,`22`,`50 min`,`74–82`,`No (ingreso por examen)`,`Bachillerato general amplio`,`General, ciencias y sociales`,`No ofrece carrera técnica`,`Ingreso a universidad por examen`,[`General`,`Sociales`]],[`Colegio de Bachilleres`,`Plantel 2 Cien Metros`,`Bachillerato general`,`GAM, CDMX`,`26`,`55 min`,`72–80`,`No (ingreso por examen)`,`Bachillerato general`,`General y ciencias`,`No ofrece carrera técnica`,`Ingreso a universidad por examen`,[`General`,`Ciencias`]],[`Colegio de Bachilleres`,`Plantel 3 Iztacalco`,`Bachillerato general`,`Iztacalco, CDMX`,`35`,`1 h 15`,`70–78`,`No (ingreso por examen)`,`Bachillerato general`,`General y sociales`,`No ofrece carrera técnica`,`Ingreso a universidad por examen`,[`General`,`Sociales`]],[`Colegio de Bachilleres`,`Plantel 5 Satélite`,`Bachillerato general`,`Naucalpan, Edomex`,`22`,`45 min`,`72–80`,`No (ingreso por examen)`,`Bachillerato general`,`General y ciencias`,`No ofrece carrera técnica`,`Ingreso a universidad por examen`,[`General`,`Ciencias`]],[`Colegio de Bachilleres`,`Plantel 8 Tepepan`,`Bachillerato general`,`Xochimilco, CDMX`,`48`,`1 h 35`,`76–84`,`No (ingreso por examen)`,`Bachillerato general con orientación`,`General, artes y sociales`,`No ofrece carrera técnica`,`Ingreso a universidad por examen`,[`General`,`Arte`,`Sociales`]],[`Colegio de Bachilleres`,`Plantel 9 Aragón`,`Bachillerato general`,`GAM, CDMX`,`30`,`1 h`,`70–78`,`No (ingreso por examen)`,`Bachillerato general`,`General y ciencias`,`No ofrece carrera técnica`,`Ingreso a universidad por examen`,[`General`,`Ciencias`]],[`Colegio de Bachilleres`,`Plantel 13 Xochimilco`,`Bachillerato general`,`Xochimilco, CDMX`,`50`,`1 h 40`,`74–82`,`No (ingreso por examen)`,`Bachillerato general`,`General y sociales`,`No ofrece carrera técnica`,`Ingreso a universidad por examen`,[`General`,`Sociales`]],[`CONALEP`,`Plantel 1 (CDMX)`,`Profesional técnico bachiller`,`GAM/Benito Juárez`,`28`,`1 h`,`66–74`,`No (ingreso por examen)`,`Formación técnica práctica`,`Oficios técnicos e industrial`,`Sí: numerosas carreras técnicas`,`Título de Profesional Técnico Bachiller; trabajo o universidad`,[`Técnico`,`Tecnología`]],[`CONALEP`,`Plantel 2 (CDMX)`,`Profesional técnico bachiller`,`CDMX`,`30`,`1 h 05`,`64–72`,`No (ingreso por examen)`,`Formación técnica práctica`,`Técnico e industrial`,`Sí: carreras técnicas`,`Título de Profesional Técnico Bachiller`,[`Técnico`,`Tecnología`]],[`CONALEP`,`Plantel Estado de México`,`Profesional técnico bachiller`,`Estado de México`,`18`,`35 min`,`62–70`,`No (ingreso por examen)`,`Cercanía y formación técnica`,`Técnico y servicios`,`Sí: carreras técnicas`,`Título de Profesional Técnico Bachiller`,[`Técnico`,`Tecnología`]],[`DGETI (CBTIS)`,`CBTIS 1`,`Bachillerato tecnológico`,`Azcapotzalco/GAM, CDMX`,`24`,`50 min`,`72–80`,`No (ingreso por examen)`,`Bachillerato técnico bivalente`,`Tecnología y oficios`,`Carrera técnica (varias)`,`Certificado + técnico; ingreso a universidad por examen`,[`Técnico`,`Tecnología`]],[`DGETI (CBTIS)`,`CBTIS 4`,`Bachillerato tecnológico`,`CDMX`,`30`,`1 h`,`68–76`,`No (ingreso por examen)`,`Bachillerato técnico bivalente`,`Tecnología y servicios`,`Carrera técnica (varias)`,`Certificado + técnico; ingreso a universidad`,[`Técnico`,`Tecnología`]],[`DGETI (CBTIS)`,`CBTIS 55`,`Bachillerato tecnológico`,`Estado de México`,`20`,`40 min`,`66–74`,`No (ingreso por examen)`,`Técnico con cercanía`,`Tecnología y servicios`,`Carrera técnica (varias)`,`Certificado + técnico; ingreso a universidad`,[`Técnico`,`Tecnología`]],[`DGETA (CBTA)`,`CBTA 1`,`Bachillerato técnico agropecuario`,`Estado de México`,`35`,`1 h`,`64–72`,`No (ingreso por examen)`,`Agropecuario y medio ambiente`,`Ciencias naturales y agro`,`Carrera técnica agropecuaria`,`Ingreso a universidades agropecuarias/afines`,[`Ciencias`,`Técnico`]],[`CECyTE`,`CECyTE 1`,`Bachillerato tecnológico`,`Estado de México`,`25`,`50 min`,`62–70`,`No (ingreso por examen)`,`Tecnológico estatal cercano`,`Tecnología e informática`,`Carrera técnica (varias)`,`Ingreso a universidad por examen`,[`Técnico`,`Tecnología`]],[`UAEMéx`,`Prepa 1 San Mateo`,`Bachillerato general`,`Naucalpan, Edomex`,`20`,`40 min`,`74–82`,`Pase interno UAEMéx`,`Cercanía y pase a UAEMéx`,`General, ciencias y sociales`,`No ofrece carrera técnica`,`Pase interno a licenciaturas UAEMéx`,[`General`,`Ciencias`]],[`UAEMéx`,`Prepa 2 Texcoco`,`Bachillerato general`,`Texcoco, Edomex`,`35`,`1 h`,`70–78`,`Pase interno UAEMéx`,`Bachillerato general`,`General y agro`,`No ofrece carrera técnica`,`Pase interno a licenciaturas UAEMéx`,[`General`,`Ciencias`]],[`UAEMéx`,`Prepa Cuautitlán`,`Bachillerato general`,`Cuautitlán, Edomex`,`5`,`12 min`,`66–74`,`Pase interno UAEMéx`,`Máxima cercanía a Cuautitlán`,`General y ciencias`,`No ofrece carrera técnica`,`Pase interno a licenciaturas UAEMéx`,[`General`,`Ciencias`]],[`Privadas`,`Greengate School`,`Bachillerato bilingüe`,`Cuautitlán Izcalli, Edomex`,`6`,`15 min`,`N/A (privada)`,`No aplica (ingreso propio)`,`Bilingüe (inglés) y alta exigencia académica`,`General, universidades nacionales y extranjeras`,`No ofrece carrera técnica`,`Preparación para examen de universidad; asesoría vocacional`,[`General`,`Humanidades`,`Ciencias`]],[`Privadas`,`Colegio Fray Pedro de Gante`,`Bachillerato general`,`Cuautitlán, Edomex`,`5`,`12 min`,`N/A (privada)`,`No aplica (ingreso propio)`,`Cercanía y acompañamiento`,`General, refuerzo para examen de universidad`,`No ofrece carrera técnica`,`Ingreso a universidad por examen (verifica incorporación)`,[`General`,`Ciencias`]],[`Privadas`,`Prepa UNITEC (Atizapán)`,`Bachillerato general`,`Atizapán, Edomex`,`26`,`45 min`,`N/A (privada)`,`No aplica (ingreso propio)`,`Enfoque profesionalizante y tecnológico`,`Negocios, tecnología y salud`,`No ofrece carrera técnica`,`Pase a licenciaturas UNITEC; también puedes aplicar a públicas`,[`Negocios`,`Tecnología`,`Salud`]],[`Privadas`,`Prepa Tec de Monterrey (Campus Edo. Méx.)`,`Bachillerato bilingüe`,`Atizapán/Zona Esmeralda, Edomex`,`30`,`50 min`,`N/A (privada)`,`No aplica (ingreso propio)`,`Tecnología, emprendimiento y bilingüismo`,`Ingeniería, negocios y tecnología`,`No ofrece carrera técnica`,`Pase a licenciaturas del Tec; también a universidades públicas`,[`Tecnología`,`Negocios`,`Ciencias`]],[`Privadas`,`Colegio Alemán Alexander von Humboldt (Lomas Verdes)`,`Bachillerato bilingüe`,`Lomas Verdes, Naucalpan, Edomex`,`30`,`50 min`,`N/A (privada)`,`No aplica (ingreso propio)`,`Bilingüe (alemán) y muy alta exigencia`,`Ciencias, ingeniería y humanidades`,`No ofrece carrera técnica`,`Preparación para universidades en México y Alemania`,[`Ciencias`,`Humanidades`,`Tecnología`]],[`Privadas`,`Bachillerato Anáhuac (Lomas Verdes)`,`Bachillerato general`,`Lomas Verdes, Naucalpan, Edomex`,`28`,`45 min`,`N/A (privada)`,`No aplica (ingreso propio)`,`Formación integral (académica y valores)`,`General, negocios y salud`,`No ofrece carrera técnica`,`Pase a universidades Anáhuac; también a públicas`,[`General`,`Negocios`,`Salud`]]],wo=Co.map((e,t)=>{let n={};return So.forEach((t,r)=>{n[t]=e[r]}),n._i=t,n}),To=[`General`,`Ciencias`,`Humanidades`,`Sociales`,`Arte`,`Salud`,`Tecnología`,`Técnico`,`Negocios`],Eo=[[`todas`,`Todas`],[`<20`,`Menos de 20 km`],[`20-30`,`20–30 km`],[`30-45`,`30–45 km`],[`>45`,`Más de 45 km`]],Do=`Qué se estudia, qué tan lejos queda de Cuautitlán, aciertos, pase directo, en qué es fuerte, a qué orienta y cómo sirve para la universidad.`,Oo=`📌 Distancias, aciertos y pase son <b>referencias aproximadas</b> desde Cuautitlán, Edo. Méx. <b>Verifica</b> el corte y las fechas oficiales del año.`,ko=`Referencias de aciertos aproximadas (COMIPEMS, máx. 128). Verificar corte oficial del año.`,Ao=[`Responsable`,`Buen compañero(a)`,`Trabajador(a)`,`Se organiza bien`,`Buen retentiva`,`Creador(a)`,`Se expresa bien`,`Liderazgo natural`,`Se concentra bien`,`Aprendo rápido`,`Preciso(a) en detalles`,`Puntual`],jo=[`Se distrae fácil`,`Deja tareas pendientes`,`Le cuesta matemáticas`,`Le cuesta leer en voz alta`,`Caligrafía difícil de leer`,`Le cuesta organizarse`,`Pierde materiales`,`Falta de concentración`,`Se pone nervioso(a) en exámenes`,`Rinde menos por la mañana`,`Trabajos tarde`,`Mucha mano de obra, poco repaso`],Mo=[`Delegado(a) de grupo`,`Participó en concurso`,`Ganó competencia escolar`,`Equipo deportivo`,`Beca`,`Club o taller`,`Trabajo voluntario`,`Proyecto personal`],No=[{id:`salud`,nombre:`Salud / Medicina`,icon:`🩺`,intereses:[`Salud y medicina`,`Biología y naturaleza`,`Química`,`Ayudar a las personas`],aptitudes:[`Memoria`,`Concentración`,`Comprensión lectora`],escuelas:[{inst:`UNAM`,esc:`CCH Sur`},{inst:`IPN`,esc:`CECyT 9 Juan de Dios Bátiz`},{inst:`UNAM`,esc:`ENP 6 Antonio Caso`}]},{id:`ingenieria`,nombre:`Ingeniería / Tecnología`,icon:`⚙️`,intereses:[`Ciencia y tecnología`,`Matemáticas`,`Computación y programación`,`Electrónica`],aptitudes:[`Razonamiento lógico-matemático`,`Resolución de problemas`,`Cálculo mental`],escuelas:[{inst:`IPN`,esc:`CECyT 1 Gonzalo Vázquez Vela`},{inst:`UNAM`,esc:`CCH Azcapotzalco`},{inst:`IPN`,esc:`CECyT 9 Juan de Dios Bátiz`}]},{id:`artes`,nombre:`Artes / Humanidades`,icon:`🎨`,intereses:[`Arte y diseño`,`Lectura y escritura`,`Música`,`Historia y cultura`],aptitudes:[`Creatividad`,`Expresión escrita`,`Comunicación oral`],escuelas:[{inst:`UNAM`,esc:`CCH Sur`},{inst:`UNAM`,esc:`ENP 3 Justo Sierra`},{inst:`Colegio de Bachilleres`,esc:`Plantel 8 Tepepan`}]},{id:`sociales`,nombre:`Negocios / Sociales`,icon:`⚖️`,intereses:[`Negocios y economía`,`Ciencias sociales`,`Derecho`,`Liderazgo y política`],aptitudes:[`Liderazgo`,`Trabajo en equipo`,`Organización`],escuelas:[{inst:`UNAM`,esc:`ENP 9 Pedro de Alba`},{inst:`IPN`,esc:`CECyT 11 Wilfrido Massieu`},{inst:`UAEMéx`,esc:`Prepa 1 San Mateo`}]},{id:`tecnico`,nombre:`Técnico / Industrial`,icon:`🔧`,intereses:[`Construcción y mecánica`,`Electrónica`,`Computación y programación`,`Deportes`],aptitudes:[`Manualidad / habilidad técnica`,`Razonamiento lógico-matemático`,`Concentración`],escuelas:[{inst:`CONALEP`,esc:`Plantel 1 (CDMX)`},{inst:`DGETI (CBTIS)`,esc:`CBTIS 1`},{inst:`IPN`,esc:`CECyT 6 Miguel Othón de Mendizábal`}]},{id:`ambiente`,nombre:`Naturaleza / Ambiente`,icon:`🌱`,intereses:[`Medio ambiente`,`Biología y naturaleza`,`Química`,`Ciencia y tecnología`],aptitudes:[`Organización`,`Resolución de problemas`,`Trabajo en equipo`],escuelas:[{inst:`UNAM`,esc:`CCH Naucalpan`},{inst:`DGETA (CBTA)`,esc:`CBTA 1`},{inst:`UAEMéx`,esc:`Prepa 2 Texcoco`}]}],Po=[{id:`R`,nombre:`Realista`,icon:`🔧`,color:`#0369A1`,desc:`Te gusta lo práctico, manual, técnico y de campo.`,intereses:[`Construcción y mecánica`,`Deportes`,`Electrónica`,`Medio ambiente`],plantilla:`tecnico`,tags:[`Técnico`,`Tecnología`]},{id:`I`,nombre:`Investigador`,icon:`🔬`,color:`#4338CA`,desc:`Te gusta analizar, investigar y resolver problemas.`,intereses:[`Ciencia y tecnología`,`Matemáticas`,`Biología y naturaleza`,`Computación y programación`],plantilla:`ingenieria`,tags:[`Ciencias`,`Tecnología`]},{id:`A`,nombre:`Artístico`,icon:`🎨`,color:`#BE185D`,desc:`Te gusta crear, imaginar y expresarte.`,intereses:[`Arte y diseño`,`Música`,`Lectura y escritura`,`Danza y teatro`],plantilla:`artes`,tags:[`Arte`,`Humanidades`]},{id:`S`,nombre:`Social`,icon:`🤝`,color:`#0F766E`,desc:`Te gusta ayudar, enseñar y trabajar con personas.`,intereses:[`Ayudar a las personas`,`Educación y docencia`,`Salud y medicina`,`Ciencias sociales`],plantilla:`salud`,tags:[`Salud`,`Sociales`]},{id:`E`,nombre:`Emprendedor`,icon:`📈`,color:`#B45309`,desc:`Te gusta liderar, convencer y emprender.`,intereses:[`Negocios y economía`,`Liderazgo y política`,`Derecho`,`Turismo y viajes`],plantilla:`sociales`,tags:[`Negocios`,`Sociales`]},{id:`C`,nombre:`Convencional`,icon:`🗂️`,color:`#475569`,desc:`Te gustan el orden, los datos y la precisión.`,intereses:[`Matemáticas`,`Computación y programación`,`Idiomas`,`Ciencias sociales`],plantilla:`sociales`,tags:[`General`,`Tecnología`]}],Fo=[`Nada`,`Poco`,`Algo`,`Bastante`,`Mucho`],Io=[{t:`Armar, reparar o desarmar aparatos y máquinas`,d:`R`},{t:`Trabajar al aire libre con plantas, animales o en el campo`,d:`R`},{t:`Usar herramientas o material para construir cosas`,d:`R`},{t:`Hacer deporte o actividad física intensa`,d:`R`},{t:`Manejar equipos, máquinas o vehículos`,d:`R`},{t:`Hacer experimentos para descubrir cómo funcionan las cosas`,d:`I`},{t:`Resolver problemas de matemáticas o de lógica`,d:`I`},{t:`Investigar y leer sobre temas de ciencia`,d:`I`},{t:`Analizar datos para encontrar patrones o causas`,d:`I`},{t:`Preguntarme el por qué de las cosas y buscar respuestas`,d:`I`},{t:`Dibujar, pintar, diseñar o hacer manualidades creativas`,d:`A`},{t:`Tocar un instrumento, cantar o bailar`,d:`A`},{t:`Escribir historias, poemas, canciones o guiones`,d:`A`},{t:`Crear videos, fotografías, animaciones o páginas bonitas`,d:`A`},{t:`Imaginar ideas originales y expresarlas a los demás`,d:`A`},{t:`Ayudar a personas que tienen problemas o necesitan apoyo`,d:`S`},{t:`Explicar o enseñar algo que otros no entienden`,d:`S`},{t:`Cuidar a niños, adultos mayores o personas enfermas`,d:`S`},{t:`Escuchar y dar consejos a mis compañeros`,d:`S`},{t:`Trabajar en equipo para mejorar mi comunidad o escuela`,d:`S`},{t:`Liderar un equipo o coordinar un proyecto`,d:`E`},{t:`Convencer a otros de mis ideas o propuestas`,d:`E`},{t:`Vender, promocionar o imaginar un negocio`,d:`E`},{t:`Tomar decisiones y asumir el mando cuando hace falta`,d:`E`},{t:`Ser quien organiza las actividades del grupo`,d:`E`},{t:`Ordenar y clasificar información o materiales`,d:`C`},{t:`Llevar registros, cuentas o listas con cuidado`,d:`C`},{t:`Seguir reglas y pasos bien definidos para hacer las cosas`,d:`C`},{t:`Revisar que todo esté correcto, completo y en orden`,d:`C`},{t:`Organizar mi tiempo con horarios y metas claras`,d:`C`}],Lo=Object.fromEntries(Po.map(e=>[e.id,e])),Ro=Object.fromEntries(Po.map(e=>[e.id,e.intereses])),zo=Object.fromEntries(Po.map(e=>[e.id,e.plantilla])),Bo=Object.fromEntries(Po.map(e=>[e.id,e.tags])),Vo=Object.fromEntries(No.map(e=>[e.id,e])),z={title:`¿Carrera técnica o bachillerato general?`,general:{heading:`<b>Bachillerato general</b> (UNAM, Bachilleres, UAEMéx, privadas)`,items:[`Más flexibles: te preparan para <b>cualquier licenciatura</b>.`,`La UNAM y UAEMéx dan <b>pase directo</b> por promedio.`,`Ideales si <b>aún no decides</b> o vas a artes/humanidades/salud.`]},tecnico:{heading:`<b>Bachillerato técnico</b> (IPN, CONALEP, CBTIS, CECyT, CBTA) - <b>sí trae carrera</b>`,items:[`Sales con un <b>título técnico</b>: puedes <b>trabajar</b> al terminar.`,`El IPN da <b>pase a sus licenciaturas</b> afines (ingenierías).`,`Más materias y práctica: ideal si te gusta lo <b>práctico</b> o quieres ingresar antes al trabajo.`]},decision:`<b>¿Cuál conviene?</b> Si tu meta es una ingeniería o quieres trabajar pronto, la <b>técnica</b> suma. Si buscas abrir opciones (medicina, derecho, artes, humanidades) o no estás seguro, el <b>general</b> es más flexible. <b>En ambos</b> puedes presentar el examen de la universidad; lo importante es llevar buen promedio y prepararte para el examen (COMIPEMS/universidad).`,examPreparation:`<b>Sobre prepararte para el examen:</b> el general refuerza más las materias del examen; la técnica da ventaja laboral y práctica. Si eliges técnica, complementa con <b>repaso de admisión</b> (matemáticas, lectura, ciencias).`},B={interests:ho,aptitudes:go,schoolTypes:_o,institutions:vo,institutionInfo:bo,schoolInfo:bo,schoolScoreReferences:yo,schoolsByInstitution:xo,catalogFields:So,catalogRows:Co,schools:wo,catalogTags:To,catalogDistanceFilters:Eo,catalogIntro:Do,catalogDisclaimer:Oo,scoreReferenceNote:ko,strengths:Ao,weaknesses:jo,extras:Mo,templates:No,templatesById:Vo,riasecTypes:Po,riasecQuestions:Io,riasecScale:Fo,riasecMaxPerType:5,riasecById:Lo,riasecInterestsByType:Ro,riasecTemplateByType:zo,riasecTagsByType:Bo,careerGuide:z,careerGuideHtml:`<div class="card cat-info"><div class="block-title"><span>🧭</span> `+z.title+`</div><div class="guide-2col"><div>`+z.general.heading+`<ul><li>`+z.general.items[0]+`</li><li>`+z.general.items[1]+`</li><li>`+z.general.items[2]+`</li></ul></div><div>`+z.tecnico.heading+`<ul><li>`+z.tecnico.items[0]+`</li><li>`+z.tecnico.items[1]+`</li><li>`+z.tecnico.items[2]+`</li></ul></div></div><p>`+z.decision+`</p><p>`+z.examPreparation+`</p></div>`,studyPlans:{UNAM_ENP:{nombre:`Bachillerato UNAM · ENP (6 semestres)`,tecnico:!1,semestres:[{n:1,materias:[`Matemáticas I`,`Física I`,`Química I`,`Biología I`,`Historia Universal I`,`Taller de Lectura y Redacción`,`Lengua Extranjera (Inglés) I`,`Geografía`,`Educación Física`]},{n:2,materias:[`Matemáticas II`,`Física II`,`Química II`,`Biología II`,`Historia Universal II`,`Historia de México I`,`Inglés II`,`Educación Estética`,`Orientación Educativa`]},{n:3,materias:[`Matemáticas III`,`Física III`,`Química III`,`Biología III`,`Historia de México II`,`Literatura`,`Inglés III`,`Filosofía I`,`Geografía`]},{n:4,materias:[`Matemáticas IV`,`Física IV`,`Química IV`,`Biología IV`,`Historia de México III`,`Inglés IV`,`Filosofía II`,`Educación Física`,`Optativa I`]},{n:5,materias:[`Matemáticas V`,`Física V`,`Química V`,`Biología V`,`Inglés V`,`Optativa II`,`Optativa III`,`Asignatura de Humanidades`]},{n:6,materias:[`Matemáticas VI`,`Física VI`,`Química VI`,`Biología VI`,`Inglés VI`,`Optativa IV`,`Optativa V`,`Asignatura de Ciencias`]}]},UNAM_CCH:{nombre:`Bachillerato UNAM · CCH (6 semestres)`,tecnico:!1,semestres:[{n:1,materias:[`Matemáticas I`,`Historia de México I`,`Taller de Lectura y Redacción`,`Inglés I`,`Química I`,`Biología I`,`Física I`,`Historia Universal I`]},{n:2,materias:[`Matemáticas II`,`Historia de México II`,`Taller de Redacción e Investigación`,`Inglés II`,`Química II`,`Biología II`,`Física II`,`Historia Universal II`]},{n:3,materias:[`Matemáticas III`,`Física III`,`Química III`,`Biología III`,`Historia de México III`,`Literatura`,`Inglés III`,`Filosofía I`]},{n:4,materias:[`Matemáticas IV`,`Física IV`,`Química IV`,`Biología IV`,`Historia Universal III`,`Inglés IV`,`Filosofía II`,`Estadística`]},{n:5,materias:[`Matemáticas V`,`Ciencias de la Salud I`,`Optativa (Ciencias/Humanidades)`,`Inglés V`,`Talleres de Lenguaje y Comunicación`,`Optativa`,`Optativa`,`Optativa`]},{n:6,materias:[`Matemáticas VI`,`Ciencias de la Salud II`,`Optativa (Ciencias/Humanidades)`,`Inglés VI`,`Talleres de Lenguaje y Comunicación`,`Optativa`,`Optativa`,`Optativa`]}]},BACHILLERES:{nombre:`Colegio de Bachilleres (6 semestres)`,tecnico:!1,semestres:[{n:1,materias:[`Matemáticas I`,`Taller de Lectura y Redacción I`,`Lengua Adicional al Español (Inglés) I`,`Química I`,`Física I`,`Historia de México I`,`Geografía`,`Educación Física I`]},{n:2,materias:[`Matemáticas II`,`Taller de Lectura y Redacción II`,`Inglés II`,`Química II`,`Física II`,`Historia de México II`,`Biología I`,`Educación Física II`]},{n:3,materias:[`Matemáticas III`,`Literatura I`,`Inglés III`,`Biología II`,`Historia Universal I`,`Filosofía I`,`Informática I`,`Orientación Educativa`]},{n:4,materias:[`Matemáticas IV`,`Literatura II`,`Inglés IV`,`Historia Universal II`,`Filosofía II`,`Informática II`,`Ciencias de la Salud I`,`Optativa`]},{n:5,materias:[`Matemáticas V`,`Métodos de Investigación I`,`Inglés V`,`Área propedéutica I`,`Área propedéutica II`,`Optativa`,`Optativa`,`Optativa`]},{n:6,materias:[`Matemáticas VI`,`Métodos de Investigación II`,`Inglés VI`,`Área propedéutica III`,`Área propedéutica IV`,`Optativa`,`Optativa`,`Optativa`]}]},UAEMEX:{nombre:`Preparatoria UAEMéx (6 semestres)`,tecnico:!1,semestres:[{n:1,materias:[`Álgebra`,`Geometría y Trigonometría`,`Biología I`,`Química I`,`Historia de México`,`Comprensión Lectora`,`Lengua Extranjera I`,`Orientación Vocacional`]},{n:2,materias:[`Geometría Analítica`,`Física I`,`Biología II`,`Química II`,`Historia Universal`,`Expresión Oral y Escrita`,`Lengua Extranjera II`,`Ética`]},{n:3,materias:[`Cálculo Diferencial`,`Física II`,`Biología III`,`Química III`,`Historia de la Cultura`,`Literatura`,`Lengua Extranjera III`,`Informática`]},{n:4,materias:[`Cálculo Integral`,`Física III`,`Biología IV`,`Química IV`,`Filosofía`,`Literatura Mexicana`,`Lengua Extranjera IV`,`Estadística`]},{n:5,materias:[`Probabilidad y Estadística`,`Física IV`,`Biología V`,`Química V`,`Metodología de la Investigación`,`Orientación Profesiográfica`,`Optativa I`,`Optativa II`]},{n:6,materias:[`Matemáticas Aplicadas`,`Física V`,`Biología VI`,`Química VI`,`Seminario de Investigación`,`Optativa III`,`Optativa IV`,`Optativa V`]}]},IPN:{nombre:`Bachillerato tecnológico IPN (tronco común · 6 semestres)`,tecnico:!0,semestres:[{n:1,materias:[`Álgebra`,`Geometría y Trigonometría`,`Física I`,`Química I`,`Biología I`,`Taller de Redacción`,`Inglés I`,`Historia de México`,`Orientación Juvenil`]},{n:2,materias:[`Geometría Analítica`,`Cálculo Diferencial`,`Física II`,`Química II`,`Biología II`,`Taller de Lectura`,`Inglés II`,`Historia Universal`,`Módulo de la tecnicatura I`]},{n:3,materias:[`Cálculo Integral`,`Física III`,`Química III`,`Biología III`,`Literatura`,`Inglés III`,`Módulo de la tecnicatura II`,`Módulo de la tecnicatura III`]},{n:4,materias:[`Probabilidad y Estadística`,`Física IV`,`Química IV`,`Biología IV`,`Filosofía`,`Inglés IV`,`Módulo de la tecnicatura IV`,`Módulo de la tecnicatura V`]},{n:5,materias:[`Matemáticas Aplicadas`,`Física V`,`Ciencias Sociales`,`Inglés V`,`Módulo de la tecnicatura VI`,`Módulo de la tecnicatura VII`,`Optativa`]},{n:6,materias:[`Metodología de la Investigación`,`Economía`,`Inglés VI`,`Módulo de la tecnicatura VIII`,`Módulo de la tecnicatura IX`,`Optativa`]}]},CONALEP:{nombre:`Profesional Técnico Bachiller CONALEP (6 semestres)`,tecnico:!0,semestres:[{n:1,materias:[`Álgebra`,`Química`,`Biología`,`Lectura y Redacción`,`Inglés I`,`Historia`,`Formación Técnica I`,`Educación Física`]},{n:2,materias:[`Geometría y Trigonometría`,`Física`,`Comunicación`,`Inglés II`,`Historia de México`,`Formación Técnica II`,`Informática`]},{n:3,materias:[`Geometría Analítica`,`Cálculo Diferencial`,`Ciencias Sociales`,`Inglés III`,`Formación Técnica III`,`Módulo de la carrera I`,`Ética`]},{n:4,materias:[`Cálculo Integral`,`Estadística`,`Metodología de la Investigación`,`Inglés IV`,`Módulo de la carrera II`,`Módulo de la carrera III`]},{n:5,materias:[`Ciencias de la Salud/Aplicadas`,`Orientación Profesional`,`Módulo de la carrera IV`,`Módulo de la carrera V`,`Optativa`]},{n:6,materias:[`Proyecto Integrador`,`Módulo de la carrera VI`,`Módulo de la carrera VII`,`Estadía profesional en empresa`]}]},DGETI:{nombre:`Bachillerato tecnológico DGETI/CBTIS (6 semestres)`,tecnico:!0,semestres:[{n:1,materias:[`Álgebra`,`Química I`,`Lectura y Redacción I`,`Inglés I`,`Historia de México I`,`Módulo técnico I`,`Educación Física`]},{n:2,materias:[`Geometría y Trigonometría`,`Química II`,`Física I`,`Lectura y Redacción II`,`Inglés II`,`Historia de México II`,`Módulo técnico II`]},{n:3,materias:[`Geometría Analítica`,`Física II`,`Biología`,`Inglés III`,`Historia Universal`,`Módulo técnico III`,`Ética`]},{n:4,materias:[`Cálculo Diferencial`,`Ciencias Sociales`,`Inglés IV`,`Módulo técnico IV`,`Módulo técnico V`,`Optativa`]},{n:5,materias:[`Cálculo Integral`,`Probabilidad y Estadística`,`Inglés V`,`Módulo técnico VI`,`Módulo técnico VII`,`Optativa`]},{n:6,materias:[`Metodología de la Investigación`,`Inglés VI`,`Módulo técnico VIII`,`Módulo técnico IX`,`Prácticas/estadía`]}]},DGETA:{nombre:`Bachillerato técnico agropecuario DGETA/CBTA (6 semestres)`,tecnico:!0,semestres:[{n:1,materias:[`Álgebra`,`Química`,`Biología`,`Lectura y Redacción`,`Inglés I`,`Módulo agropecuario I`,`Educación Física`]},{n:2,materias:[`Geometría y Trigonometría`,`Física`,`Lectura y Redacción II`,`Inglés II`,`Historia de México`,`Módulo agropecuario II`]},{n:3,materias:[`Geometría Analítica`,`Ciencias Naturales`,`Inglés III`,`Historia Universal`,`Módulo agropecuario III`,`Ética`]},{n:4,materias:[`Cálculo Diferencial`,`Ciencias Sociales`,`Inglés IV`,`Módulo agropecuario IV`,`Módulo agropecuario V`]},{n:5,materias:[`Probabilidad y Estadística`,`Inglés V`,`Módulo agropecuario VI`,`Módulo agropecuario VII`,`Optativa`]},{n:6,materias:[`Metodología de la Investigación`,`Inglés VI`,`Módulo agropecuario VIII`,`Prácticas/estadía en campo`]}]},CECYTE:{nombre:`Bachillerato tecnológico CECyTE (6 semestres)`,tecnico:!0,semestres:[{n:1,materias:[`Álgebra`,`Química`,`Lectura y Redacción`,`Inglés I`,`Historia`,`Módulo técnico I`,`Educación Física`]},{n:2,materias:[`Geometría y Trigonometría`,`Física`,`Biología`,`Inglés II`,`Historia de México`,`Módulo técnico II`]},{n:3,materias:[`Geometría Analítica`,`Cálculo Diferencial`,`Inglés III`,`Ciencias Sociales`,`Módulo técnico III`,`Módulo técnico IV`]},{n:4,materias:[`Cálculo Integral`,`Estadística`,`Inglés IV`,`Módulo técnico V`,`Módulo técnico VI`,`Optativa`]},{n:5,materias:[`Metodología de la Investigación`,`Inglés V`,`Módulo técnico VII`,`Módulo técnico VIII`,`Optativa`]},{n:6,materias:[`Proyecto Integrador`,`Módulo técnico IX`,`Prácticas/estadía`]}]},PRIVADA:{nombre:`Bachillerato privado (plan habitual · 6 semestres)`,tecnico:!1,semestres:[{n:1,materias:[`Matemáticas I`,`Taller de Lectura y Redacción I`,`Inglés I`,`Química I`,`Física I`,`Historia I`,`Artes`,`Educación Física`]},{n:2,materias:[`Matemáticas II`,`Taller de Lectura y Redacción II`,`Inglés II`,`Química II`,`Física II`,`Historia II`,`Biología I`,`Filosofía I`]},{n:3,materias:[`Matemáticas III`,`Literatura I`,`Inglés III`,`Biología II`,`Historia III`,`Filosofía II`,`Informática`,`Optativa`]},{n:4,materias:[`Matemáticas IV`,`Literatura II`,`Inglés IV`,`Ciencias Sociales`,`Metodología de la Investigación`,`Optativa`,`Optativa`]},{n:5,materias:[`Matemáticas V`,`Inglés V`,`Área propedéutica I`,`Área propedéutica II`,`Optativa`,`Optativa`]},{n:6,materias:[`Matemáticas VI`,`Inglés VI`,`Área propedéutica III`,`Área propedéutica IV`,`Optativa`,`Optativa`]}]},GENERAL:{nombre:`Bachillerato general (6 semestres)`,tecnico:!1,semestres:[{n:1,materias:[`Matemáticas I`,`Taller de Lectura y Redacción`,`Inglés I`,`Ciencias Naturales`,`Ciencias Sociales`,`Informática`,`Orientación Educativa`]},{n:2,materias:[`Matemáticas II`,`Literatura`,`Inglés II`,`Biología`,`Historia`,`Optativa`,`Educación Física`]},{n:3,materias:[`Matemáticas III`,`Inglés III`,`Física`,`Historia de México`,`Filosofía I`,`Optativa`,`Optativa`]},{n:4,materias:[`Matemáticas IV`,`Inglés IV`,`Química`,`Historia Universal`,`Filosofía II`,`Optativa`,`Optativa`]},{n:5,materias:[`Matemáticas V`,`Inglés V`,`Metodología de la Investigación`,`Área propedéutica I`,`Optativa`,`Optativa`]},{n:6,materias:[`Matemáticas VI`,`Inglés VI`,`Área propedéutica II`,`Optativa`,`Optativa`,`Optativa`]}]}},studyPlanSelectors:[{inst:`UNAM`,match:/CCH/,plan:`UNAM_CCH`,fallback:`UNAM_ENP`},{inst:`IPN`,plan:`IPN`},{inst:`Colegio de Bachilleres`,plan:`BACHILLERES`},{inst:`UAEMéx`,plan:`UAEMEX`},{inst:`CONALEP`,plan:`CONALEP`},{inst:`DGETI (CBTIS)`,plan:`DGETI`},{inst:`DGETA (CBTA)`,plan:`DGETA`},{inst:`CECyTE`,plan:`CECYTE`},{inst:`Privadas`,plan:`PRIVADA`},{inst:`*`,plan:`GENERAL`}],technicianPrograms:{IPN:{nota:`En el IPN cursas el tronco común (6 semestres) + una tecnicatura con módulos de especialidad. Al titular como técnico puedes pasar a licenciaturas del IPN.`,carreras:[{n:`Técnico en Informática`,modulos:[`Fundamentos de programación`,`Bases de datos`,`Desarrollo web`,`Redes de computadoras`,`Sistemas operativos`,`Desarrollo de aplicaciones móviles`]},{n:`Técnico en Computación`,modulos:[`Hardware y mantenimiento`,`Redes`,`Ofimática avanzada`,`Programación básica`,`Sistemas operativos`]},{n:`Técnico en Contabilidad`,modulos:[`Contabilidad general`,`Contabilidad de costos`,`Impuestos`,`Nómina`,`Finanzas básicas`]},{n:`Técnico en Administración`,modulos:[`Principios de administración`,`Recursos humanos`,`Mercadotecnia`,`Finanzas`,`Contabilidad`]},{n:`Técnico en Mecánica Industrial`,modulos:[`Metrología`,`Máquinas y herramientas`,`Soldadura`,`Procesos de manufactura`,`Mantenimiento`]},{n:`Técnico en Electricidad`,modulos:[`Circuitos eléctricos`,`Instalaciones eléctricas`,`Máquinas eléctricas`,`Automatización`,`Seguridad`]},{n:`Técnico en Electrónica`,modulos:[`Electrónica analógica`,`Electrónica digital`,`Microcontroladores`,`Sistemas de control`,`Robótica`]},{n:`Técnico en Sistemas Automotrices`,modulos:[`Motor a combustión`,`Inyección electrónica`,`Frenos y suspensión`,`Transmisión`,`Diagnóstico automotriz`]},{n:`Técnico en Enfermería`,modulos:[`Anatomía y fisiología`,`Cuidados básicos`,`Farmacología`,`Salud pública`,`Prácticas clínicas`]},{n:`Técnico en Alimentos`,modulos:[`Tecnología de alimentos`,`Conservación`,`Control de calidad`,`Nutrición`,`Higiene`]},{n:`Técnico en Construcción`,modulos:[`Dibujo de construcción`,`Estructuras`,`Instalaciones`,`Costos de obra`,`Supervisión`]},{n:`Técnico en Diseño Gráfico`,modulos:[`Dibujo`,`Diseño digital`,`Software de diseño`,`Comunicación visual`,`Ilustración`]}]},CONALEP:{nota:`Ofrece carreras de Profesional Técnico Bachiller (PTB). Al terminar puedes trabajar o seguir a universidad por examen.`,carreras:[{n:`Profesional Técnico en Informática`,modulos:[`Programación`,`Bases de datos`,`Redes`,`Desarrollo de software`,`Soporte técnico`]},{n:`Profesional Técnico en Contabilidad`,modulos:[`Contabilidad`,`Costos`,`Impuestos`,`Nómina`,`Auditoría básica`]},{n:`Profesional Técnico en Administración`,modulos:[`Administración`,`Recursos humanos`,`Mercadotecnia`,`Finanzas`]},{n:`Profesional Técnico en Electrónica`,modulos:[`Electrónica analógica`,`Electrónica digital`,`Microcontroladores`,`Automatización`]},{n:`Profesional Técnico en Mecánica Automotriz`,modulos:[`Motor`,`Inyección electrónica`,`Transmisión`,`Frenos`,`Diagnóstico`]},{n:`Profesional Técnico en Electricidad`,modulos:[`Circuitos`,`Instalaciones`,`Máquinas eléctricas`,`Automatización`]},{n:`Profesional Técnico en Alimentos y Bebidas`,modulos:[`Preparación de alimentos`,`Servicio`,`Higiene`,`Nutrición`,`Cocina`]},{n:`Profesional Técnico en Enfermería`,modulos:[`Anatomía`,`Cuidados básicos`,`Farmacología`,`Prácticas clínicas`]},{n:`Profesional Técnico en Construcción`,modulos:[`Dibujo`,`Obra`,`Instalaciones`,`Costos`]},{n:`Profesional Técnico en Turismo`,modulos:[`Hospitalidad`,`Agencia de viajes`,`Patrimonio`,`Servicio al cliente`]}]},"DGETI (CBTIS)":{nota:`Bachillerato tecnológico bivalente: certificado de bachillerato + título de técnico.`,carreras:[{n:`Técnico en Informática`,modulos:[`Programación`,`Bases de datos`,`Redes`,`Desarrollo web`]},{n:`Técnico en Programación`,modulos:[`Programación estructurada`,`POO`,`Bases de datos`,`Apps`]},{n:`Técnico en Contabilidad`,modulos:[`Contabilidad`,`Costos`,`Impuestos`,`Nómina`]},{n:`Técnico en Administración`,modulos:[`Administración`,`Mercadotecnia`,`Recursos humanos`]},{n:`Técnico en Electrónica`,modulos:[`Electrónica analógica/digital`,`Microcontroladores`,`Control`]},{n:`Técnico en Mecánica Industrial`,modulos:[`Metrología`,`Procesos`,`Soldadura`,`Mantenimiento`]},{n:`Técnico en Laboratorista Químico`,modulos:[`Química analítica`,`Análisis instrumental`,`Seguridad`,`Prácticas de laboratorio`]},{n:`Técnico en Diseño Gráfico Digital`,modulos:[`Diseño`,`Software`,`Comunicación visual`]},{n:`Técnico en Logística`,modulos:[`Almacén`,`Distribución`,`Inventarios`,`Transporte`]},{n:`Técnico en Electricidad`,modulos:[`Circuitos`,`Instalaciones`,`Máquinas eléctricas`]}]},"DGETA (CBTA)":{nota:`Bachillerato técnico agropecuario; orientado al campo, producción y medio ambiente.`,carreras:[{n:`Técnico Agropecuario`,modulos:[`Producción agrícola`,`Producción pecuaria`,`Suelos`,`Riégos`,`Sanidad vegetal/animal`]},{n:`Técnico en Agroindustria`,modulos:[`Transformación de alimentos`,`Control de calidad`,`Conservación`]},{n:`Técnico en Desarrollo Comunitario`,modulos:[`Gestión social`,`Proyectos productivos`,`Extensión`]}]},CECyTE:{nota:`Bachillerato tecnológico estatal; combina bachillerato con una carrera técnica.`,carreras:[{n:`Técnico en Informática`,modulos:[`Programación`,`Bases de datos`,`Redes`,`Soporte`]},{n:`Técnico en Contabilidad`,modulos:[`Contabilidad`,`Costos`,`Impuestos`]},{n:`Técnico en Administración`,modulos:[`Administración`,`Mercadotecnia`,`Recursos humanos`]},{n:`Técnico en Electrónica`,modulos:[`Electrónica`,`Microcontroladores`,`Automatización`]},{n:`Técnico en Producción Industrial`,modulos:[`Procesos`,`Metrología`,`Calidad`,`Mantenimiento`]}]}}},Ho=`ecoems_vocational_riasec_v1`,Uo=`ecoems_vocational_checklist_v1`,Wo=[{id:`inicio`,label:`Inicio`,icon:`🏠`},{id:`test`,label:`Descúbrete`,icon:`🧭`},{id:`escuelas`,label:`Escuelas y carreras`,icon:`🎓`},{id:`universidades`,label:`Universidades`,icon:`🏛️`},{id:`planes`,label:`Planes y técnicas`,icon:`📘`},{id:`decision`,label:`Decide tu futuro`,icon:`✨`}],Go=[`Hice el test RIASEC y leí mis tipos más fuertes.`,`Comparé bachillerato general y bachillerato técnico.`,`Elegí tres escuelas y verifiqué cortes y fechas oficiales.`,`Revisé el plan de estudios y las carreras técnicas que ofrecen.`,`Hablé con mi familia y mi profesor sobre mi decisión.`,`Preparé un plan de repaso para el examen de admisión.`],V=null;function H(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function Ko(e){return String(e??``)}function qo(e,t){try{let n=localStorage.getItem(e);return n?JSON.parse(n):t}catch{return t}}function Jo(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}function Yo(e){try{localStorage.removeItem(e)}catch{}}function Xo(e){return[...new Set((e||[]).filter(Boolean))]}function Zo(){return Object.values(B.technicianPrograms).reduce((e,t)=>e+(t.carreras?.length||0),0)}function Qo(){return`
    <article class="card wide voc-dashboard-card">
      <div class="card-heading">
        <div>
          <span class="card-label">Orientación</span>
          <h2>Taller vocacional completo</h2>
        </div>
        <span class="pill">Incluye guía y catálogos</span>
      </div>
      <p class="muted">Descubre tus intereses con el test RIASEC, compara ${B.schools.length} escuelas y ${B.institutions.length} instituciones, revisa planes de estudio y carreras técnicas, y arma tu decisión con información.</p>
      <div class="row voc-dashboard-actions">
        <button class="btn primary" data-open-vocational>Abrir taller vocacional →</button>
        <span class="muted"><small>${B.riasecQuestions.length} preguntas · ${Zo()} carreras técnicas · guía imprimible</small></span>
      </div>
    </article>
  `}function $o(e,{onClose:t,readOnly:n=!1}={}){V={root:e,onClose:t,readOnly:n,tab:`inicio`,filters:{q:``,inst:``,tipo:``,tag:``,dist:`todas`},plan:`UNAM_ENP`,techInst:`IPN`,answers:qo(Ho,{})||{},savedResult:qo(Ho+`:result`,null),checklist:qo(Uo,[])||[],focusSearch:!1},ns()}function es(){if(!B.riasecQuestions.every((e,t)=>V.answers[t]!=null))return V.savedResult;let e={};for(let t of B.riasecTypes)e[t.id]=0;B.riasecQuestions.forEach((t,n)=>{e[t.d]=(e[t.d]||0)+Number(V.answers[n]||0)});let t={};for(let n of Object.keys(e))t[n]=Math.round(e[n]/(B.riasecMaxPerType*4)*100);return{completed_at:new Date().toISOString(),scores:t,top:Object.entries(t).sort((e,t)=>t[1]-e[1]).slice(0,3).map(([e,t])=>({id:e,value:t}))}}function ts(e){e?.completed_at&&(Jo(Ho,V.answers),Jo(Ho+`:result`,e),V.savedResult=e)}function ns(){V&&(V.root.innerHTML=`
    <div class="shell">
      <header class="top">
        <a class="brand" href="/" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span>ECOEMS <small>Plataforma</small></span>
        </a>
        <div class="top-actions">
          <button class="btn ghost" id="voc-back">← Volver al panel</button>
        </div>
      </header>
      <main id="main-content" tabindex="-1" class="dashboard voc-main">
        ${rs()}
        <nav class="voc-tabs" aria-label="Secciones del taller">
          ${Wo.map(e=>`
            <button class="voc-tab ${V.tab===e.id?`active`:``}" data-voc-tab="${e.id}" ${V.tab===e.id?`aria-current="page"`:``}>
              <span aria-hidden="true">${e.icon}</span>
              <span>${e.label}</span>
            </button>
          `).join(``)}
        </nav>
        <div id="voc-panel">${is()}</div>
      </main>
    </div>
  `,V.root.querySelector(`#voc-back`)?.addEventListener(`click`,()=>V.onClose?.()),V.root.querySelectorAll(`[data-voc-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{V.tab=e.dataset.vocTab,ns(),V.root.querySelector(`.voc-tabs`)?.scrollIntoView({block:`start`,behavior:`smooth`})})}),hs())}function rs(){return`
    <article class="card wide voc-hero">
      <span class="card-label">Taller de orientación vocacional</span>
      <h1>Construye tu camino con información</h1>
      <p class="muted">${H(B.catalogIntro)}</p>
      <div class="voc-hero-stats">
        <div><strong>${B.riasecQuestions.length}</strong><small>preguntas para descubrirte</small></div>
        <div><strong>${B.schools.length}</strong><small>escuelas comparadas</small></div>
        <div><strong>${B.institutions.length}</strong><small>instituciones</small></div>
        <div><strong>${Zo()}</strong><small>carreras técnicas</small></div>
      </div>
      <div class="voc-disclaimer">${Ko(B.catalogDisclaimer)}</div>
    </article>
  `}function is(){switch(V.tab){case`test`:return os();case`escuelas`:return ls();case`universidades`:return ds();case`planes`:return ps();case`decision`:return ms();default:return as()}}function as(){return`
    <article class="card wide voc-panel">
      <h2>¿Qué puedes hacer aquí?</h2>
      <div class="voc-home-grid">
        <button class="voc-home-tile" data-voc-go="test">
          <span>🧭</span><strong>Descúbrete</strong>
          <small>Responde 30 preguntas RIASEC y conoce tus intereses dominantes.</small>
        </button>
        <button class="voc-home-tile" data-voc-go="escuelas">
          <span>🎓</span><strong>Compara escuelas</strong>
          <small>Filtra por institución, tipo, área, distancia y lo que cada escuela ofrece.</small>
        </button>
        <button class="voc-home-tile" data-voc-go="universidades">
          <span>🏛️</span><strong>Entiende las universidades</strong>
          <small>Pase directo, examen de admisión y referencias de aciertos por institución.</small>
        </button>
        <button class="voc-home-tile" data-voc-go="planes">
          <span>📘</span><strong>Revisa planes y técnicas</strong>
          <small>Materias semestre por semestre y módulos de las carreras técnicas.</small>
        </button>
        <button class="voc-home-tile" data-voc-go="decision">
          <span>✨</span><strong>Decide y prepárate</strong>
          <small>Guía para elegir, perfiles de ejemplo y un plan para el examen de admisión.</small>
        </button>
      </div>
      <div class="voc-note">
        <strong>Dos herramientas complementarias.</strong>
        <p>El test de esta sección es para explorar y se guarda en este navegador. En la tarjeta <em>Mi orientación</em> del panel está el test oficial que tu profesor puede ver en tu ficha. Usa ambos para decidir con más seguridad.</p>
      </div>
      <p class="muted"><small>${H(B.scoreReferenceNote)}</small></p>
    </article>
  `}function os(){let e=es(),t=B.riasecQuestions.filter((e,t)=>V.answers[t]!=null).length,n=B.riasecQuestions.length;return`
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Test RIASEC</span>
          <h2>¿Qué tipo de actividades te atraen?</h2>
        </div>
        <span class="pill ${t===n?`success`:``}">${t}/${n} respondidas</span>
      </div>
      <p class="muted">Para cada actividad elige qué tanto te gusta. No hay respuestas correctas: cuenta lo que realmente te interesa, no lo que crees que «debería» gustarte.</p>
      ${e?ss(e):``}
      <div class="row voc-test-actions">
        <button class="btn ghost" data-voc-action="clear-riasec" ${t?``:`disabled`}>Borrar respuestas</button>
        ${t===n?`<button class="btn primary" data-voc-action="save-riasec">Guardar mi resultado ✓</button>`:``}
      </div>
      <p class="hint">${V.readOnly?`Estás explorando en modo invitado.`:`Tus respuestas se guardan automáticamente en este dispositivo.`} No se modifican tus calificaciones ni tu ficha.</p>

      <div class="voc-riasec-groups">
        ${B.riasecTypes.map(e=>{let t=B.riasecQuestions.map((e,t)=>({...e,index:t})).filter(t=>t.d===e.id);return`
            <section class="voc-riasec-group" style="--voc-color:${H(e.color)}">
              <header>
                <span aria-hidden="true">${e.icon}</span>
                <div><strong>${H(e.nombre)}</strong><small>${H(e.desc)}</small></div>
              </header>
              ${t.map(e=>`
                <div class="voc-question">
                  <p><span>${e.index+1}.</span> ${H(e.t)}</p>
                  <div class="voc-scale" role="group" aria-label="Respuesta para: ${H(e.t)}">
                    ${B.riasecScale.map((t,n)=>`
                      <button type="button" class="voc-scale-btn ${V.answers[e.index]===n?`selected`:``}" data-voc-riasec="${e.index}" data-value="${n}" title="${H(t)}" aria-pressed="${V.answers[e.index]===n}">
                        <strong>${n+1}</strong><small>${H(t)}</small>
                      </button>
                    `).join(``)}
                  </div>
                </div>
              `).join(``)}
            </section>
          `}).join(``)}
      </div>
    </article>
  `}function ss(e){let t=B.riasecQuestions.every((e,t)=>V.answers[t]!=null),n=e.top||[],r=Xo(n.flatMap(e=>B.riasecInterestsByType[e.id]||[])),i=Xo(n.flatMap(e=>B.riasecTagsByType[e.id]||[])),a=Xo(n.map(e=>B.riasecTemplateByType[e.id])).map(e=>B.templatesById[e]).filter(Boolean),o=B.schools.map(e=>({school:e,matches:(e.tags||[]).filter(e=>i.includes(e))})).filter(e=>e.matches.length).sort((e,t)=>t.matches.length-e.matches.length||e.school.nombre.localeCompare(t.school.nombre)).slice(0,5);return`
    <section class="voc-result">
      <div class="voc-result-head">
        <span class="card-label">${t?`Tu resultado`:`Último resultado guardado`}</span>
        <h3>${n.length?n.map(e=>H(B.riasecById[e.id]?.nombre||e.id)).join(` · `):`Aún sin resultado`}</h3>
      </div>
      <div class="voc-score-grid">
        ${B.riasecTypes.map(t=>{let n=e.scores?.[t.id]??0;return`
            <div class="voc-score" style="--voc-color:${H(t.color)}">
              <div><strong>${t.icon} ${H(t.nombre)}</strong><span>${n}%</span></div>
              <div class="voc-score-bar"><i style="width:${Math.max(0,Math.min(100,n))}%"></i></div>
            </div>
          `}).join(``)}
      </div>
      ${n.length?`
        <p class="muted">${n.slice(0,2).map(e=>H(B.riasecById[e.id]?.desc||``)).filter(Boolean).join(` `)}</p>
        <div class="voc-result-columns">
          ${r.length?`
            <div>
              <span class="card-label">Intereses relacionados</span>
              <div class="ficha-tags">${r.map(e=>`<span class="ficha-tag">${H(e)}</span>`).join(``)}</div>
            </div>
          `:``}
          ${a.length?`
            <div>
              <span class="card-label">Perfiles para explorar</span>
              <div class="ficha-tags">${a.map(e=>`<span class="ficha-tag">${e.icon||`🎯`} ${H(e.nombre)}</span>`).join(``)}</div>
            </div>
          `:``}
        </div>
        ${o.length?`
          <div class="voc-result-schools">
            <span class="card-label">Escuelas que podrías revisar</span>
            <div class="ficha-tags">${o.map(e=>`<button class="ficha-tag" data-voc-action="filter-inst" data-inst="${H(e.school.inst)}">${H(e.school.inst)} · ${H(e.school.nombre)}</button>`).join(``)}</div>
          </div>
        `:``}
      `:``}
    </section>
  `}function cs(){let{q:e,inst:t,tipo:n,tag:r,dist:i}=V.filters,a=e.trim().toLowerCase();return B.schools.filter(e=>{if(t&&e.inst!==t||n&&e.tipo!==n||r&&!(e.tags||[]).includes(r))return!1;if(i!==`todas`){let t=Number(e.km)||0;if(i===`<20`&&!(t<20)||i===`20-30`&&!(t>=20&&t<=30)||i===`30-45`&&!(t>30&&t<=45)||i===`>45`&&!(t>45))return!1}return!a||[e.nombre,e.inst,e.tipo,e.zona,e.fuerte,e.orienta,e.carreras,e.uni,...e.tags||[]].join(` `).toLowerCase().includes(a)})}function ls(){let e=cs();return`
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Catálogo</span>
          <h2>Escuelas y lo que puedes estudiar</h2>
        </div>
        <span class="pill">${e.length} de ${B.schools.length} escuelas</span>
      </div>
      <p class="muted">Compara distancia desde Cuautitlán, aciertos de referencia, pase a universidad, carrera técnica y orientación. Verifica siempre los datos oficiales del año.</p>

      <div class="voc-filters">
        <label class="voc-search">
          <span>Buscar</span>
          <input id="voc-q" type="search" placeholder="Escuela, zona, carrera, área…" value="${H(V.filters.q)}" data-voc-filter="q">
        </label>
        <label><span>Institución</span>
          <select data-voc-filter="inst">
            <option value="">Todas</option>
            ${B.institutions.map(e=>`<option value="${H(e)}" ${V.filters.inst===e?`selected`:``}>${H(e)}</option>`).join(``)}
          </select>
        </label>
        <label><span>Tipo</span>
          <select data-voc-filter="tipo">
            <option value="">Todos</option>
            ${B.schoolTypes.map(e=>`<option value="${H(e)}" ${V.filters.tipo===e?`selected`:``}>${H(e)}</option>`).join(``)}
          </select>
        </label>
        <label><span>Área</span>
          <select data-voc-filter="tag">
            <option value="">Todas</option>
            ${B.catalogTags.map(e=>`<option value="${H(e)}" ${V.filters.tag===e?`selected`:``}>${H(e)}</option>`).join(``)}
          </select>
        </label>
        <label><span>Distancia</span>
          <select data-voc-filter="dist">
            ${B.catalogDistanceFilters.map(([e,t])=>`<option value="${H(e)}" ${V.filters.dist===e?`selected`:``}>${H(t)}</option>`).join(``)}
          </select>
        </label>
        <button class="btn ghost" data-voc-action="reset-filters">Limpiar filtros</button>
      </div>

      ${e.length?`
        <div class="voc-school-grid">
          ${e.map((e,t)=>us(e,t)).join(``)}
        </div>
      `:`
        <p class="empty-state">No hay escuelas con esos filtros. Prueba con otra institución o distancia.</p>
      `}
      <div class="voc-disclaimer">${Ko(B.catalogDisclaimer)}</div>
    </article>
  `}function us(e,t){return`
    <article class="voc-school-card">
      <header>
        <span class="voc-school-index">${String(t+1).padStart(2,`0`)}</span>
        <div>
          <span class="card-label">${H(e.inst)}</span>
          <h3>${H(e.nombre)}</h3>
          <small>${H(e.tipo)} · ${H(e.zona)}</small>
        </div>
      </header>
      <dl class="voc-school-facts">
        <div><dt>Distancia</dt><dd>${H(e.km)} km · ${H(e.tiempo)}</dd></div>
        <div><dt>Aciertos</dt><dd>${H(e.aciertos)}</dd></div>
        <div><dt>Pase</dt><dd>${H(e.pase)}</dd></div>
        <div><dt>Carrera técnica</dt><dd>${H(e.carreras)}</dd></div>
      </dl>
      <p><strong>Fuerte:</strong> ${H(e.fuerte)}</p>
      <p><strong>Orienta a:</strong> ${H(e.orienta)}</p>
      <p><strong>Universidad:</strong> ${H(e.uni)}</p>
      <div class="ficha-tags">${(e.tags||[]).map(e=>`<span class="ficha-tag">${H(e)}</span>`).join(``)}</div>
      <div class="row voc-school-actions">
        <button class="btn-mini" data-voc-action="school-plan" data-school="${H(e.nombre)}">Ver plan de estudios</button>
        <button class="btn-mini" data-voc-action="filter-inst" data-inst="${H(e.inst)}">Ver ${H(e.inst)}</button>
      </div>
    </article>
  `}function ds(){return`
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Educación superior</span>
          <h2>Qué ofrece cada institución</h2>
        </div>
        <span class="pill">${B.institutions.length} instituciones</span>
      </div>
      <p class="muted">Antes de elegir, entiende si tu bachillerato da pase directo, si necesitas examen de admisión y qué tan lejos queda.</p>
      <div class="voc-university-grid">
        ${B.institutions.map(e=>{let t=B.institutionInfo[e]||{},n=B.schoolScoreReferences[e]||[],r=B.schools.filter(t=>t.inst===e).length;return`
            <article class="voc-university-card">
              <header><h3>${H(e)}</h3><span class="pill">${r} ${r===1?`opción`:`opciones`}</span></header>
              <p>${H(t.desc||`—`)}</p>
              <p><strong>Pase:</strong> ${H(t.pase||`—`)}</p>
              <p><strong>Hacia la universidad:</strong> ${H(t.uni||`—`)}</p>
              ${n.length?`
                <details>
                  <summary>Referencias de aciertos (${n.length})</summary>
                  <ul>${n.map(e=>`<li>${H(e.n)} · ${H(e.r)}</li>`).join(``)}</ul>
                </details>
              `:``}
              <button class="btn-mini" data-voc-action="filter-inst" data-inst="${H(e)}">Ver sus escuelas →</button>
            </article>
          `}).join(``)}
      </div>
      <div class="voc-note"><strong>Importante:</strong> ${Ko(B.scoreReferenceNote)} Las cifras son orientativas; consulta la convocatoria oficial.</div>
    </article>
  `}function fs(e){let t=B.schools.find(t=>t.nombre===e);if(!t)return`GENERAL`;let n=B.studyPlanSelectors.find(e=>e.inst===t.inst||e.inst===`*`);return n?Object.entries(n.match||{}).every(([e,n])=>String(t[e])===String(n))?t.inst===`UNAM`?/CCH/i.test(t.nombre)?`UNAM_CCH`:n.fallback||`UNAM_ENP`:n.plan:n.fallback||`GENERAL`:`GENERAL`}function ps(){let e=B.studyPlans[V.plan]||B.studyPlans.GENERAL,t=B.technicianPrograms[V.techInst]||Object.values(B.technicianPrograms)[0];return`
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Mapa académico</span>
          <h2>Planes de estudio y carreras técnicas</h2>
        </div>
        <span class="pill">${Object.keys(B.studyPlans).length} planes · ${Zo()} técnicas</span>
      </div>

      <section class="voc-subsection">
        <div class="voc-subhead">
          <h3>Plan de estudios</h3>
          <label><span>Plan</span>
            <select data-voc-select="plan">
              ${Object.entries(B.studyPlans).map(([e,t])=>`<option value="${H(e)}" ${V.plan===e?`selected`:``}>${H(t.nombre)}</option>`).join(``)}
            </select>
          </label>
        </div>
        <p class="muted">${e.tecnico?`Este plan incluye una carrera técnica además del bachillerato.`:`Bachillerato general: abre opciones para cualquier licenciatura.`}</p>
        <div class="voc-semesters">
          ${(e.semestres||[]).map(e=>`
            <article>
              <h4>Semestre ${e.n}</h4>
              <ul>${(e.materias||[]).map(e=>`<li>${H(e)}</li>`).join(``)}</ul>
            </article>
          `).join(``)}
        </div>
      </section>

      <section class="voc-subsection">
        <div class="voc-subhead">
          <h3>Carreras técnicas</h3>
          <label><span>Institución</span>
            <select data-voc-select="techInst">
              ${Object.keys(B.technicianPrograms).map(e=>`<option value="${H(e)}" ${V.techInst===e?`selected`:``}>${H(e)}</option>`).join(``)}
            </select>
          </label>
        </div>
        <p class="muted">${H(t.nota||``)}</p>
        <div class="voc-tech-grid">
          ${(t.carreras||[]).map(e=>`
            <article>
              <h4>${H(e.n)}</h4>
              <ul>${(e.modulos||[]).map(e=>`<li>${H(e)}</li>`).join(``)}</ul>
            </article>
          `).join(``)}
        </div>
      </section>
    </article>
  `}function ms(){return`
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Toma de decisión</span>
          <h2>${H(B.careerGuide.title)}</h2>
        </div>
      </div>
      <div class="voc-guide rich">${Ko(B.careerGuideHtml)}</div>

      <section class="voc-subsection">
        <h3>Preparación para el futuro</h3>
        <div class="voc-note rich">${Ko(B.careerGuide.examPreparation)}</div>
        <div class="row voc-dashboard-actions">
          <a class="btn ghost" href="./guia-examen-espanol.html" target="_blank" rel="noopener">📖 Guía de examen de Español</a>
          <a class="btn ghost" href="./curso/">📚 Volver al curso</a>
        </div>
      </section>

      <section class="voc-subsection">
        <h3>Perfiles de ejemplo</h3>
        <p class="muted">No son etiquetas: sirven para comparar gustos, materias y escuelas. Puedes mezclar varios.</p>
        <div class="voc-template-grid">
          ${B.templates.map(e=>`
            <article>
              <header><span aria-hidden="true">${e.icon||`🎯`}</span><h4>${H(e.nombre)}</h4></header>
              <p><strong>Intereses:</strong> ${(e.intereses||[]).map(H).join(` · `)}</p>
              <p><strong>Aptitudes:</strong> ${(e.aptitudes||[]).map(H).join(` · `)}</p>
              <p><strong>Escuelas sugeridas:</strong> ${(e.escuelas||[]).map(e=>`${H(e.inst)}: ${H(e.esc)}`).join(` · `)}</p>
            </article>
          `).join(``)}
        </div>
      </section>

      <section class="voc-subsection">
        <h3>Mi plan de decisión</h3>
        <p class="muted">Marca lo que ya hiciste. Tu lista se guarda en este dispositivo.</p>
        <ul class="voc-checklist">
          ${Go.map((e,t)=>`
            <li>
              <label>
                <input type="checkbox" data-voc-check="${t}" ${V.checklist.includes(t)?`checked`:``}>
                <span>${H(e)}</span>
              </label>
            </li>
          `).join(``)}
        </ul>
        <p class="pill ${V.checklist.length===Go.length?`success`:``}">${V.checklist.length}/${Go.length} pasos listos</p>
      </section>
    </article>
  `}function hs(){let e=V.root.querySelector(`#voc-panel`);e&&(e.querySelectorAll(`[data-voc-go]`).forEach(e=>{e.addEventListener(`click`,()=>{V.tab=e.dataset.vocGo,ns()})}),e.querySelectorAll(`[data-voc-filter]`).forEach(e=>{let t=e.dataset.vocFilter,n=e.tagName===`INPUT`?`input`:`change`;e.addEventListener(n,()=>{V.filters[t]=e.value,e.tagName===`INPUT`&&(V.focusSearch=!0),gs()})}),e.querySelectorAll(`[data-voc-select]`).forEach(e=>{e.addEventListener(`change`,()=>{V[e.dataset.vocSelect]=e.value,gs()})}),e.querySelectorAll(`[data-voc-riasec]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.vocRiasec);V.answers[t]=Number(e.dataset.value),ts(es()),gs()})}),e.querySelectorAll(`[data-voc-check]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=Number(e.dataset.vocCheck),n=new Set(V.checklist);e.checked?n.add(t):n.delete(t),V.checklist=[...n],Jo(Uo,V.checklist),gs()})}),e.querySelectorAll(`[data-voc-action]`).forEach(e=>{e.addEventListener(`click`,()=>_s(e.dataset.vocAction,e.dataset))}))}function gs(){let e=V.root.querySelector(`#voc-panel`);if(!e)return;let t=window.scrollY;if(e.innerHTML=is(),hs(),V.focusSearch){let t=e.querySelector(`#voc-q`);t&&(t.focus(),t.setSelectionRange(t.value.length,t.value.length)),V.focusSearch=!1}window.scrollTo(0,t)}function _s(e,t){e===`clear-riasec`?(V.answers={},V.savedResult=null,Yo(Ho),Yo(Ho+`:result`),gs()):e===`save-riasec`?(ts(es()),gs()):e===`reset-filters`?(V.filters={q:``,inst:``,tipo:``,tag:``,dist:`todas`},gs()):e===`filter-inst`?(V.filters={q:``,inst:t.inst||``,tipo:``,tag:``,dist:`todas`},V.tab=`escuelas`,ns()):e===`school-plan`&&(V.plan=fs(t.school),V.tab=`planes`,ns())}var vs={admin:`Administrador`,teacher:`Profesor`,student:`Alumno`,guardian:`Tutor`},ys={admin:`Administra usuarios, contenido y configuración del piloto.`,teacher:`Activa unidades, registra asistencia y da seguimiento a tu grupo.`,student:`Tus unidades activas aparecerán aquí cuando el profesor las abra.`,guardian:`Aquí verás el avance de tus hijos cuando la cuenta esté vinculada.`},bs={not_started:`Sin empezar`,in_progress:`En progreso`,completed:`Completada`,mastered:`Dominada`},xs={tipo:`Práctica`,reto:`Reto`,capitulo:`Capítulo`},Ss=`v3-2026`,Cs=`v8-pulido`,ws=20,Ts={dashboard:`📊 Dashboard`,alumnos:`👥 Alumnos`,materias:`📚 Materias`,asistencia:`📅 Asistencia`,pagos:`💳 Pagos`,tareas:`📝 Tareas`,actividad:`📈 Actividad`,tutores:`💬 Tutores`,usuarios:`🛠️ Usuarios`,contenido:`🗂️ Contenido`,auditoria:`🧾 Auditoría`,configuracion:`⚙️ Configuración`},Es={present:`Presente`,late:`Tarde`,excused:`Justificado`,absent:`Falta`},Ds={diagnostic:`Diagnóstico`,quiz:`Examen corto`,exam:`Examen`,project:`Tarea / Proyecto`,participation:`Participación`,other:`Otra`},Os={apertura:{label:`Apertura a la experiencia`,emoji:`💡`,copy:`Curiosidad, imaginación y ganas de aprender cosas nuevas.`},responsabilidad:{label:`Responsabilidad`,emoji:`🎯`,copy:`Constancia, orden y cumplimiento de tus metas.`},extraversion:{label:`Extraversión`,emoji:`🗣️`,copy:`Energía social y facilidad para conectar con otras personas.`},amabilidad:{label:`Amabilidad`,emoji:`🤝`,copy:`Empatía, respeto y ganas de colaborar.`},estabilidad:{label:`Estabilidad emocional`,emoji:`🌊`,copy:`Calma y manejo de la presión en momentos difíciles.`}},ks=[{id:`p1`,dim:`apertura`,text:`Me gusta probar cosas nuevas y aprender temas distintos.`},{id:`p2`,dim:`apertura`,text:`Soy imaginativo/a y disfruto crear ideas, historias o proyectos.`},{id:`p3`,dim:`apertura`,reverse:!0,text:`Prefiero quedarme con las rutinas de siempre antes que probar novedades.`},{id:`p4`,dim:`responsabilidad`,text:`Cumplo mis tareas aunque no tenga muchas ganas.`},{id:`p5`,dim:`responsabilidad`,text:`Organizo mi tiempo y mis materiales con anticipación.`},{id:`p6`,dim:`responsabilidad`,reverse:!0,text:`Dejo las cosas para el último momento.`},{id:`p7`,dim:`extraversion`,text:`Disfruto hablar con gente nueva y hacer amigos.`},{id:`p8`,dim:`extraversion`,text:`Me siento con energía cuando estoy en grupo.`},{id:`p9`,dim:`extraversion`,reverse:!0,text:`Prefiero quedarme callado/a en reuniones grandes.`},{id:`p10`,dim:`amabilidad`,text:`Escucho y ayudo cuando alguien tiene un problema.`},{id:`p11`,dim:`amabilidad`,reverse:!0,text:`Me cuesta ponerme en el lugar de los demás.`},{id:`p12`,dim:`amabilidad`,text:`Trato con respeto a quienes piensan distinto a mí.`},{id:`p13`,dim:`estabilidad`,text:`Me recupero rápido cuando algo me sale mal.`},{id:`p14`,dim:`estabilidad`,reverse:!0,text:`Me preocupo mucho por cosas que todavía no pasan.`},{id:`p15`,dim:`estabilidad`,text:`Mantengo la calma en situaciones de presión.`}],As=[{label:`Nada`,emoji:`😐`},{label:`Poco`,emoji:`🙂`},{label:`A veces`,emoji:`😌`},{label:`Bastante`,emoji:`😄`},{label:`Mucho`,emoji:`🤩`}],U=[{id:`series`,title:`Contenido que disfrutas`,prompt:`¿Qué series, películas o videos sueles ver?`,help:`Elige todo lo que de verdad ves. Tus gustos nos ayudan a detectar áreas de interés.`,options:[{label:`Novelas y K-dramas`,tags:[`personas`,`emociones`]},{label:`Series de policías, crimen o misterio`,tags:[`análisis`,`lógica`,`justicia`]},{label:`Anime`,tags:[`creatividad`,`arte`]},{label:`Ciencia ficción y fantasía`,tags:[`ciencia`,`tecnología`,`creatividad`]},{label:`Documentales de naturaleza`,tags:[`ciencia`,`naturaleza`]},{label:`Documentales de historia`,tags:[`historia`,`cultura`]},{label:`Deportes`,tags:[`deporte`,`equipo`,`salud`]},{label:`Comedia`,tags:[`creatividad`,`personas`]},{label:`Drama`,tags:[`personas`,`emociones`]},{label:`Terror o suspenso`,tags:[`análisis`,`creatividad`]},{label:`Caricaturas`,tags:[`arte`,`creatividad`]},{label:`Reality shows`,tags:[`personas`,`actualidad`]},{label:`Superhéroes`,tags:[`justicia`,`creatividad`]},{label:`Videos de YouTube`,tags:[`actualidad`,`tecnología`]},{label:`Podcasts`,tags:[`cultura`,`actualidad`]},{label:`Videojuegos`,tags:[`tecnología`,`lógica`]},{label:`Contenido de cocina`,tags:[`cocina`,`creatividad`]},{label:`Música y conciertos`,tags:[`música`,`arte`]},{label:`Moda y belleza`,tags:[`diseño`,`creatividad`]},{label:`Tecnología y gadgets`,tags:[`tecnología`,`ciencia`]}]},{id:`subjects`,title:`Materias favoritas`,prompt:`¿Qué materias de la escuela disfrutas o se te dan mejor?`,help:`Piensa en las clases que más te gustan, aunque no seas el mejor de tu grupo.`,options:[{label:`Español y Literatura`,tags:[`lectura`,`escritura`]},{label:`Matemáticas`,tags:[`cálculo`,`lógica`]},{label:`Física y Química`,tags:[`ciencia`,`experimentos`]},{label:`Biología`,tags:[`ciencia`,`naturaleza`]},{label:`Historia`,tags:[`historia`,`cultura`]},{label:`Geografía`,tags:[`naturaleza`,`cultura`]},{label:`Inglés u otros idiomas`,tags:[`idiomas`,`cultura`]},{label:`Computación`,tags:[`tecnología`,`lógica`]},{label:`Artes`,tags:[`arte`,`creatividad`]},{label:`Música`,tags:[`música`,`arte`]},{label:`Educación física`,tags:[`deporte`,`salud`]},{label:`Civismo o Ética`,tags:[`sociedad`,`debate`]},{label:`Tecnología o taller`,tags:[`manualidades`,`construcción`]}]},{id:`activities`,title:`Actividades favoritas`,prompt:`¿Qué actividades disfrutas hacer en tu tiempo libre o en la escuela?`,help:`Marca todas las que realmente disfrutes, no las que creas que deberías elegir.`,options:[{label:`Leer`,tags:[`lectura`,`cultura`]},{label:`Escribir`,tags:[`escritura`,`creatividad`]},{label:`Resolver problemas matemáticos`,tags:[`cálculo`,`lógica`]},{label:`Hacer experimentos`,tags:[`ciencia`,`experimentos`]},{label:`Dibujar o diseñar`,tags:[`arte`,`diseño`]},{label:`Tocar un instrumento o cantar`,tags:[`música`,`arte`]},{label:`Hacer deporte`,tags:[`deporte`,`salud`]},{label:`Bailar`,tags:[`arte`,`deporte`]},{label:`Ayudar a otras personas`,tags:[`ayudar`,`empatía`]},{label:`Usar computadoras o programar`,tags:[`tecnología`,`lógica`]},{label:`Jugar videojuegos`,tags:[`tecnología`,`lógica`]},{label:`Cuidar plantas o animales`,tags:[`naturaleza`,`animales`]},{label:`Cocinar`,tags:[`cocina`,`creatividad`]},{label:`Armar o reparar cosas`,tags:[`manualidades`,`construcción`]},{label:`Debatir`,tags:[`debate`,`sociedad`]},{label:`Organizar eventos`,tags:[`organización`,`liderazgo`]},{label:`Aprender idiomas`,tags:[`idiomas`,`cultura`]},{label:`Vender o emprender`,tags:[`negocios`,`emprendimiento`]}]},{id:`aptitudes`,title:`Aptitudes`,prompt:`¿En qué te sientes bueno/a o crees que destacas?`,help:`Piensa en lo que profesores, familiares o amigos te han reconocido.`,options:[{label:`Cálculo mental`,tags:[`cálculo`]},{label:`Comprensión de lectura`,tags:[`lectura`]},{label:`Escritura`,tags:[`escritura`]},{label:`Memorizar`,tags:[`memoria`]},{label:`Creatividad`,tags:[`creatividad`]},{label:`Comunicación`,tags:[`comunicación`]},{label:`Liderazgo`,tags:[`liderazgo`]},{label:`Organización`,tags:[`organización`]},{label:`Tecnología`,tags:[`tecnología`]},{label:`Deporte`,tags:[`deporte`]},{label:`Música`,tags:[`música`]},{label:`Dibujo o arte`,tags:[`arte`]},{label:`Empatía`,tags:[`empatía`]},{label:`Resolver conflictos`,tags:[`sociedad`,`empatía`]},{label:`Manualidades`,tags:[`manualidades`]},{label:`Análisis de datos`,tags:[`datos`,`análisis`]}]},{id:`workdays`,title:`Un día de trabajo`,prompt:`¿Qué te gustaría hacer en un día de trabajo?`,help:`Imagina tu rutina ideal. Elige las actividades que más te emocionen.`,options:[{label:`Atender y ayudar personas`,tags:[`ayudar`,`personas`]},{label:`Resolver problemas con números`,tags:[`cálculo`,`análisis`]},{label:`Crear diseños o contenido`,tags:[`creatividad`,`diseño`]},{label:`Construir o reparar cosas`,tags:[`construcción`,`manualidades`]},{label:`Investigar y experimentar`,tags:[`ciencia`,`experimentos`]},{label:`Vender o negociar`,tags:[`negocios`,`comunicación`]},{label:`Enseñar o capacitar`,tags:[`comunicación`,`personas`]},{label:`Organizar equipos o eventos`,tags:[`organización`,`liderazgo`]},{label:`Cuidar animales`,tags:[`animales`,`naturaleza`]},{label:`Cuidar la salud de personas`,tags:[`salud`,`ayudar`]},{label:`Programar o crear apps`,tags:[`tecnología`,`lógica`]},{label:`Escribir historias o noticias`,tags:[`escritura`,`lectura`]},{label:`Defender causas o personas`,tags:[`justicia`,`debate`]},{label:`Cocinar o preparar alimentos`,tags:[`cocina`,`creatividad`]},{label:`Producir música o videos`,tags:[`música`,`creatividad`]},{label:`Entrenar o competir`,tags:[`deporte`,`salud`]}]},{id:`environment`,title:`Ambiente de trabajo`,prompt:`¿Cómo te imaginas trabajando en el futuro?`,help:`Puedes elegir varios ambientes. No hay respuestas correctas o incorrectas.`,options:[{label:`Solo/a`,tags:[`autonomía`]},{label:`En equipo`,tags:[`equipo`]},{label:`Al aire libre`,tags:[`naturaleza`]},{label:`En oficina`,tags:[`organización`]},{label:`En laboratorio`,tags:[`experimentos`]},{label:`Con personas`,tags:[`personas`]},{label:`Con animales`,tags:[`animales`]},{label:`Con números y datos`,tags:[`datos`,`cálculo`]},{label:`Con tecnología`,tags:[`tecnología`]},{label:`Creando cosas`,tags:[`creatividad`,`diseño`]},{label:`Ayudando a la comunidad`,tags:[`ayudar`,`sociedad`]},{label:`Liderando proyectos`,tags:[`liderazgo`]}]},{id:`values`,title:`Lo que valoras`,prompt:`¿Qué es lo más importante para ti en un futuro trabajo?`,help:`Elige hasta tres opciones que más te importen.`,options:[{label:`Ayudar a los demás`,tags:[`ayudar`]},{label:`Creatividad`,tags:[`creatividad`]},{label:`Estabilidad económica`,tags:[`estabilidad`]},{label:`Libertad`,tags:[`autonomía`]},{label:`Aprender siempre`,tags:[`ciencia`,`cultura`]},{label:`Liderar`,tags:[`liderazgo`]},{label:`Impacto social`,tags:[`sociedad`]},{label:`Trabajo seguro`,tags:[`estabilidad`]},{label:`Reconocimiento`,tags:[`liderazgo`]},{label:`Tiempo libre`,tags:[`bienestar`]}]},{id:`future`,title:`Tu futuro`,prompt:`¿Cómo te imaginas en el futuro?`,help:`Elige las escenas que más te gustaría vivir dentro de unos años.`,options:[{label:`Ayudando a mi comunidad`,tags:[`ayudar`,`sociedad`]},{label:`Con mi propio negocio`,tags:[`negocios`,`liderazgo`]},{label:`Viviendo de mi arte`,tags:[`arte`,`creatividad`]},{label:`Siendo reconocido en mi profesión`,tags:[`liderazgo`]},{label:`Viajando por mi trabajo`,tags:[`idiomas`,`actualidad`]},{label:`Trabajando con tecnología`,tags:[`tecnología`]},{label:`En un hospital o laboratorio`,tags:[`salud`,`ciencia`]},{label:`En una oficina`,tags:[`organización`,`negocios`]},{label:`Al aire libre`,tags:[`naturaleza`,`deporte`]},{label:`Dando clases`,tags:[`comunicación`,`personas`]},{label:`En un juzgado o despacho`,tags:[`justicia`,`debate`]},{label:`Con estabilidad económica`,tags:[`estabilidad`]}]}],js=[{name:`Medicina`,tags:[`salud`,`ciencia`,`ayudar`,`personas`]},{name:`Enfermería`,tags:[`salud`,`ayudar`,`personas`,`equipo`]},{name:`Psicología`,tags:[`personas`,`emociones`,`ayudar`,`ciencia`]},{name:`Nutrición`,tags:[`salud`,`ciencia`,`ayudar`,`bienestar`]},{name:`Veterinaria`,tags:[`animales`,`salud`,`ciencia`,`naturaleza`]},{name:`Biología`,tags:[`ciencia`,`naturaleza`,`experimentos`,`análisis`]},{name:`Química`,tags:[`ciencia`,`experimentos`,`análisis`,`cálculo`]},{name:`Física`,tags:[`ciencia`,`cálculo`,`análisis`,`tecnología`]},{name:`Matemáticas`,tags:[`cálculo`,`análisis`,`datos`,`lógica`]},{name:`Ingeniería en sistemas`,tags:[`tecnología`,`cálculo`,`lógica`,`datos`]},{name:`Ciencia de datos`,tags:[`datos`,`cálculo`,`tecnología`,`análisis`]},{name:`Ingeniería civil`,tags:[`cálculo`,`construcción`,`naturaleza`,`organización`]},{name:`Ingeniería mecánica`,tags:[`cálculo`,`construcción`,`tecnología`,`manualidades`]},{name:`Ingeniería industrial`,tags:[`cálculo`,`organización`,`negocios`,`liderazgo`]},{name:`Arquitectura`,tags:[`arte`,`construcción`,`creatividad`,`diseño`]},{name:`Diseño gráfico`,tags:[`arte`,`creatividad`,`tecnología`,`diseño`]},{name:`Animación y videojuegos`,tags:[`arte`,`tecnología`,`creatividad`,`lógica`]},{name:`Diseño de modas`,tags:[`diseño`,`arte`,`creatividad`,`actualidad`]},{name:`Comunicación`,tags:[`escritura`,`personas`,`creatividad`,`actualidad`]},{name:`Periodismo`,tags:[`escritura`,`lectura`,`actualidad`,`sociedad`]},{name:`Derecho`,tags:[`lectura`,`debate`,`sociedad`,`justicia`]},{name:`Criminología`,tags:[`justicia`,`análisis`,`sociedad`,`lógica`]},{name:`Administración`,tags:[`organización`,`liderazgo`,`negocios`,`datos`]},{name:`Contaduría`,tags:[`cálculo`,`organización`,`datos`,`negocios`]},{name:`Docencia`,tags:[`ayudar`,`personas`,`comunicación`,`lectura`]},{name:`Trabajo social`,tags:[`ayudar`,`sociedad`,`personas`,`empatía`]},{name:`Gastronomía`,tags:[`cocina`,`creatividad`,`manualidades`,`emprendimiento`]},{name:`Música`,tags:[`música`,`arte`,`creatividad`,`disciplina`]},{name:`Artes escénicas`,tags:[`arte`,`creatividad`,`personas`,`comunicación`]},{name:`Ciencias del deporte`,tags:[`deporte`,`salud`,`equipo`,`disciplina`]},{name:`Turismo`,tags:[`personas`,`idiomas`,`organización`,`actualidad`]},{name:`Mercadotecnia`,tags:[`creatividad`,`negocios`,`personas`,`actualidad`]},{name:`Relaciones internacionales`,tags:[`idiomas`,`sociedad`,`debate`,`actualidad`]},{name:`Ciencias políticas`,tags:[`sociedad`,`debate`,`actualidad`,`liderazgo`]},{name:`Historia`,tags:[`historia`,`cultura`,`lectura`,`sociedad`]},{name:`Literatura`,tags:[`lectura`,`escritura`,`cultura`,`creatividad`]},{name:`Lenguas extranjeras`,tags:[`idiomas`,`cultura`,`comunicación`,`lectura`]}],W={mode:`student`,session:null,profile:null,dashboard:null,dashboardError:``,view:`dashboard`,unitView:null,unitResults:{},error:``,notice:``,staffTab:`dashboard`,paymentsPage:1,sidebarCollapsed:localStorage.getItem(`ecoems_sidebar`)===`collapsed`,collapsedSubjects:Fs(),fichaStudentId:null,fichaTrigger:null,fichaEscHandler:null,unitAssign:null,payDialog:null,subjectsGroupId:null,activeTest:null,loading:!0,pendingLoginUsername:``,studentInvitation:null,passwordRecovery:!1},G=null,Ms=null,Ns=null,Ps=null;function K(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function Fs(){try{let e=JSON.parse(localStorage.getItem(`ecoems_collapsed_subjects`)||`[]`);return new Set(Array.isArray(e)?e:[])}catch{return new Set}}function Is(){localStorage.setItem(`ecoems_collapsed_subjects`,JSON.stringify([...W.collapsedSubjects]))}function Ls(e){W.collapsedSubjects.has(e)?W.collapsedSubjects.delete(e):W.collapsedSubjects.add(e),Is()}function Rs(e){let[t,...n]=String(e).split(` `);return{emoji:t,text:n.join(` `)}}var zs=[`ecoems_nav_open`,`ecoems_sidebar_off`,`curso_comipems_v1`,`curso_ecoems_alumnos_v1`,`curso_ecoems_pagos_v1`,`curso_ecoems_asistencia_v1`,`curso_ecoems_plan_v1`,`curso_ecoems_perfiles_v1`,`curso_ecoems_entregas_v1`,`lectura_reto_v1`,`mate_reto_v1`];function Bs(){let e=new Set;for(let t=0;t<localStorage.length;t+=1){let n=localStorage.key(t);n&&n.startsWith(`ecoems_`)&&e.add(n)}for(let t of zs)e.add(t);for(let t of e)localStorage.removeItem(t);W.sidebarCollapsed=!1,W.collapsedSubjects=new Set}function q(e){W.error=e,W.notice=``}function J(e){W.notice=e,W.error=``}function Vs(e,t){if(!e)return()=>{};let n=document.activeElement,r=`a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])`,i=n=>{if(n.key===`Escape`){n.preventDefault(),t();return}if(n.key!==`Tab`)return;let i=[...e.querySelectorAll(r)].filter(e=>e.offsetParent!==null||e===document.activeElement);if(!i.length)return;let a=i[0],o=i[i.length-1];n.shiftKey&&document.activeElement===a?(n.preventDefault(),o.focus()):!n.shiftKey&&document.activeElement===o&&(n.preventDefault(),a.focus())};return document.addEventListener(`keydown`,i),requestAnimationFrame(()=>{(e.querySelector(`[autofocus]`)||e.querySelector(r))?.focus()}),()=>{document.removeEventListener(`keydown`,i),n?.isConnected&&typeof n.focus==`function`&&n.focus()}}function Hs(){if(!W.error&&!W.notice)return``;let e=!!W.error,t=e?`error`:`notice`,n=W.error||W.notice;return`<div class="alert ${t}" role="${e?`alert`:`status`}" aria-live="${e?`assertive`:`polite`}">${K(n)}</div>`}function Us(){return`
    <header class="top">
      <a class="brand" href="/" aria-label="ECOEMS inicio">
        <span class="brand-mark">E</span>
        <span>ECOEMS <small>Plataforma</small></span>
      </a>
      <div class="top-actions">
        <span class="env-pill">${K(Ma)}</span>
        <span class="env-pill" title="Versión del build">${K(Cs)}</span>
        <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema" title="Cambiar entre modo oscuro y claro">🌓</button>
      </div>
    </header>
  `}function Ws(){let e=W.dashboard?.privacy?.version||Ss;return`
    <footer class="privacy-footer">
      <a href="${K(W.dashboard?.privacy?.url||`/privacidad.html`)}" target="_blank" rel="noopener">Aviso de privacidad</a>
      ${W.session?`
        <span aria-hidden="true">·</span>
        <button class="link-button" type="button" id="data-request-btn">Solicitar mis datos</button>
      `:``}
      <span aria-hidden="true">·</span>
      <span>Versión ${K(e)}</span>
      <span aria-hidden="true">·</span>
      <span>Documento en revisión legal</span>
    </footer>
  `}function Gs(){let e=localStorage.getItem(`ecoems_theme`);document.documentElement.setAttribute(`data-theme`,e===`light`?`light`:`dark`)}function Ks(){let e=(document.documentElement.getAttribute(`data-theme`)===`light`?`light`:`dark`)==`light`?`dark`:`light`;document.documentElement.setAttribute(`data-theme`,e),localStorage.setItem(`ecoems_theme`,e);let t=G.querySelector(`#theme-toggle`);t&&(t.textContent=e===`light`?`☀️`:`🌙`)}function qs(){let e=G.querySelector(`#theme-toggle`);e&&(e.textContent=document.documentElement.getAttribute(`data-theme`)===`light`?`☀️`:`🌙`,e.addEventListener(`click`,Ks))}function Js(){G.innerHTML=`
    <div class="shell">
      ${Us()}
      <main id="main-content" tabindex="-1" class="center">
        <div class="panel loading-panel">
          <div class="spinner" aria-hidden="true"></div>
          <p>Cargando sesión…</p>
        </div>
      </main>
    </div>
  `}function Ys(){G.innerHTML=`
    <div class="shell">
      ${Us()}
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
          <p class="muted">El dominio de alumnos configurado es <strong>${K(ja)}</strong>.</p>
          <div class="row">
            <span class="pill">Sin datos reales</span>
            <span class="pill">Sin llaves privadas en el frontend</span>
          </div>
        </section>
      </main>
    </div>
  `}function Xs(){let e=W.mode===`student`,t=W.mode===`guardian`,n=W.pendingLoginUsername||``;W.pendingLoginUsername=``,G.innerHTML=`
    <div class="shell">
      ${Us()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel login-panel">
          <span class="kicker">Acceso al piloto</span>
          <h1>Entra a tu cuenta</h1>
          <p class="muted">Sin autorregistro. Las cuentas las crea el profesor o el administrador.</p>

          <div class="mode-tabs" role="tablist" aria-label="Tipo de acceso">
            <button class="mode-tab ${e?`active`:``}" data-mode="student" role="tab" aria-selected="${e}">Alumno</button>
            <button class="mode-tab ${W.mode===`teacher`?`active`:``}" data-mode="teacher" role="tab" aria-selected="${W.mode===`teacher`}">Profesor</button>
            <button class="mode-tab ${t?`active`:``}" data-mode="guardian" role="tab" aria-selected="${t}">Tutor</button>
          </div>

          ${Hs()}

          <form id="login-form" class="form">
            ${e?`
              <label class="field">
                <span>Usuario</span>
                <input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="ana.martinez o tu correo" value="${K(n)}" required>
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
          ${Ws()}
        </section>
      </main>
    </div>
  `,G.querySelectorAll(`[data-mode]`).forEach(e=>{e.addEventListener(`click`,()=>{W.mode=e.dataset.mode,W.error=``,W.notice=``,Xs()})}),G.querySelector(`#login-form`).addEventListener(`submit`,fc),G.querySelector(`#forgot-password-btn`)?.addEventListener(`click`,$s),qs()}function Zs(e){return`
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
            <input name="email" type="email" autocomplete="email" value="${K(e)}" placeholder="tu@correo.com" required>
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
  `}function Qs(){let e=G.querySelector(`#login-form input[name="username"], #login-form input[name="email"]`),t=String(e?.value||``).trim();return t?t.includes(`@`)?t.toLowerCase():Na(t):``}function $s(){ec(),document.body.insertAdjacentHTML(`beforeend`,Zs(Qs())),document.body.classList.add(`unit-assign-open`);let e=document.querySelector(`[data-password-reset-overlay]`);Ns=Vs(e,ec),e.querySelectorAll(`[data-password-reset-close]`).forEach(e=>{e.addEventListener(`click`,ec)}),e.addEventListener(`click`,t=>{t.target===e&&ec()}),e.querySelector(`#password-reset-form`).addEventListener(`submit`,tc)}function ec(){Ns&&=(Ns(),null),document.querySelectorAll(`[data-password-reset-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function tc(e){e.preventDefault();let t=e.currentTarget,n=String(new FormData(t).get(`email`)||``).trim().toLowerCase(),r=t.querySelector(`#password-reset-submit`),i=t.querySelector(`[data-password-reset-error]`);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n))i&&(i.textContent=`Escribe un correo válido.`,i.hidden=!1);else{r.disabled=!0,r.textContent=`Enviando…`;try{let{error:e}=await I.auth.resetPasswordForEmail(n,{redirectTo:window.location.href.split(`#`)[0]});if(e)throw e}catch{i&&(i.textContent=`No se pudo enviar el enlace. Intenta de nuevo en unos minutos.`,i.hidden=!1),r.disabled=!1,r.textContent=`Enviar enlace`;return}ec(),J(`Si el correo está registrado, ya recibiste las instrucciones para crear tu contraseña.`),Xs()}}function nc(){return`
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
  `}function rc(){ic(),document.body.insertAdjacentHTML(`beforeend`,nc()),document.body.classList.add(`unit-assign-open`);let e=document.querySelector(`[data-data-request-overlay]`);Ps=Vs(e,ic),e.querySelectorAll(`[data-data-request-close]`).forEach(e=>{e.addEventListener(`click`,ic)}),e.addEventListener(`click`,t=>{t.target===e&&ic()}),e.querySelector(`#data-request-form`).addEventListener(`submit`,ac)}function ic(){Ps&&=(Ps(),null),document.querySelectorAll(`[data-data-request-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function ac(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=t.querySelector(`[data-data-request-error]`),i=t.querySelector(`button[type="submit"]`);i.disabled=!0,i.textContent=`Enviando…`;let a;try{let e=await I.rpc(`app_create_data_request`,{p_kind:String(n.get(`kind`)||``),p_details:String(n.get(`details`)||``).trim()||null});if(e.error)throw e.error;a=e.data}catch(e){r&&(r.textContent=e?.message||`No se pudo registrar la solicitud. Intenta de nuevo.`,r.hidden=!1),i.disabled=!1,i.textContent=`Enviar solicitud`;return}ic(),J(`Solicitud registrada. Plazo de respuesta: ${Z(String(a?.due_at||``).slice(0,10))}.`),$()}function oc(){let e=W.profile?.full_name||``,t=!!W.passwordRecovery;G.innerHTML=`
    <div class="shell">
      ${Us()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel login-panel">
          <span class="kicker">${t?`Recuperación de acceso`:`Primer ingreso`}</span>
          <h1>${t?`Elige una nueva contraseña`:`Hola, ${K(e.split(` `)[0]||`alumno`)} 👋`}</h1>
          <p class="muted">${t?`Usamos el enlace de recuperación que enviamos a tu correo. Crea una contraseña nueva para entrar.`:`Tu contraseña actual es temporal. Crea una nueva que solo tú conozcas para continuar.`}</p>

          ${Hs()}

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
          ${Ws()}
        </section>
      </main>
    </div>
  `,G.querySelector(`#change-password-form`).addEventListener(`submit`,sc),qs()}async function sc(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=G.querySelector(`#change-password-btn`),i=String(n.get(`password`)||``),a=String(n.get(`confirm`)||``);if(W.error=``,W.notice=``,i.length<12)q(`La contraseña debe tener al menos 12 caracteres.`),oc();else if(!/[a-z]/.test(i)||!/[A-Z]/.test(i)||!/\d/.test(i))q(`La contraseña debe incluir al menos una minúscula, una mayúscula y un número.`),oc();else if(i!==a)q(`Las contraseñas no coinciden.`),oc();else{r.disabled=!0,r.textContent=`Guardando…`;try{let{data:e,error:t}=await I.functions.invoke(`complete-password-change`,{body:{new_password:i}});if(t)throw t;if(!e?.ok)throw Error(e?.error||`No se pudo actualizar la contraseña`);W.profile={...W.profile||{},must_change_password:!1},W.passwordRecovery=!1,J(`Contraseña actualizada. ¡Bienvenido!`),W.view=`dashboard`,$(),await Y(W.profile),mc()}catch(e){q(e?.message||`No se pudo actualizar la contraseña. Intenta de nuevo.`),oc()}}}function cc(){let e=new URL(window.location.href);e.searchParams.has(`link_token`)&&(e.searchParams.delete(`link_token`),window.history.replaceState({},``,e.pathname+e.search+e.hash))}function lc(e){G.innerHTML=`
    <div class="shell">
      ${Us()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel login-panel">
          <span class="kicker">Invitación de alumno</span>
          <h1>Crea tu contraseña</h1>
          <p class="muted">Tu profesor generó este enlace de un solo uso. Elige una contraseña que solo tú conozcas.</p>

          ${Hs()}

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
          ${Ws()}
        </section>
      </main>
    </div>
  `,G.querySelector(`#link-redeem-form`).addEventListener(`submit`,t=>{uc(t,e)}),G.querySelector(`#link-redeem-cancel`).addEventListener(`click`,()=>{cc(),W.error=``,W.notice=``,Xs()}),qs()}async function uc(e,t){e.preventDefault();let n=e.currentTarget,r=new FormData(n),i=G.querySelector(`#link-redeem-btn`),a=String(r.get(`password`)||``),o=String(r.get(`confirm`)||``);if(W.error=``,W.notice=``,a.length<12)q(`La contraseña debe tener al menos 12 caracteres.`),lc(t);else if(!/[a-z]/.test(a)||!/[A-Z]/.test(a)||!/\d/.test(a))q(`La contraseña debe incluir al menos una minúscula, una mayúscula y un número.`),lc(t);else if(a!==o)q(`Las contraseñas no coinciden.`),lc(t);else{i.disabled=!0,i.textContent=`Guardando…`;try{let{data:e,error:n}=await I.functions.invoke(`redeem-student-link-token`,{body:{token:t,new_password:a}});if(n)throw n;if(!e?.ok)throw Error(e?.error||`No se pudo canjear la invitación`);cc(),W.mode=`student`,W.pendingLoginUsername=e.username||e.email||``,J(`Contraseña creada. Entra con tu usuario ${e.username||e.email}.`),Xs()}catch(e){q(await dc(e,`No se pudo canjear la invitación. Pide un enlace nuevo.`)),lc(t)}}}async function dc(e,t){try{let t=e?.context;if(t&&typeof t.clone==`function`){let e=await t.clone().json();if(e?.error)return String(e.error)}}catch{}return e?.message||t}async function fc(e){e.preventDefault();let t=e.currentTarget,n=G.querySelector(`#submit-btn`),r=new FormData(t);W.error=``,W.notice=``,n.disabled=!0,n.textContent=`Conectando…`;try{let e=String(r.get(`username`)||``).trim(),t=W.mode===`student`?e.includes(`@`)?e.toLowerCase():Na(e):String(r.get(`email`)||``).trim().toLowerCase();if(!t)throw Error(`Escribe un usuario válido.`);let{data:n,error:i}=await I.auth.signInWithPassword({email:t,password:String(r.get(`password`)||``)});if(i)throw i;n.session&&await pc(n.session)}catch(e){let t=String(e?.message||``);t.toLowerCase().includes(`invalid login`)?q(`Usuario o contraseña incorrectos.`):t.toLowerCase().includes(`email not confirmed`)?q(`La cuenta aún no está confirmada. Pide apoyo al administrador.`):t.toLowerCase().includes(`rate limit`)?q(`Demasiados intentos. Espera un momento y vuelve a probar.`):q(`No se pudo iniciar sesión. Revisa tus datos o consulta a soporte.`),Xs()}finally{n.disabled=!1,n.textContent=`Entrar`}}async function pc(e){if(!e){W.session=null,W.profile=null,W.dashboard=null,W.dashboardError=``,W.view=`dashboard`,W.unitView=null,W.unitResults={},Ms=null,Xs();return}if(Ms===e.access_token)return;Ms=e.access_token,W.session=e;let{data:t,error:n}=await I.from(`profiles`).select(`id, role, full_name, username, email, active, must_change_password`).eq(`id`,e.user.id).maybeSingle();n?(Ms=null,q(`No se pudo cargar tu perfil. Revisa la conexión con Supabase.`),bc(`No se pudo cargar el perfil`,W.error)):t?t.active?(W.profile=t,W.dashboard=null,W.dashboardError=``,W.view=`dashboard`,W.unitView=null,W.unitResults={},W.error=``,W.notice=``,t.must_change_password?(W.view=`change-password`,oc()):($(),await Y(t),mc())):(await I.auth.signOut(),Ms=null,q(`Tu cuenta está inactiva. Consulta a la institución.`),Xs()):(await I.auth.signOut(),Ms=null,q(`Tu cuenta existe, pero no tiene perfil. Pide al administrador que la complete.`),Xs())}async function Y(e){try{let t=await hc(e);if(W.profile?.id!==e.id)return;W.dashboard=t,W.dashboardError=``}catch(t){if(W.profile?.id!==e.id)return;console.error(`dashboard_error`,t?.message||t),W.dashboard=null,W.dashboardError=`No se pudieron cargar los datos de tu panel. ${t?.message||``}`}$()}function mc(){let e=String(window.location.hash||``).replace(/^#\/?/,``).split(`?`)[0].toLowerCase();if([`examen`,`final-exam`,`vocacional`,`vocational`].includes(e)&&W.session&&W.profile&&W.view!==`change-password`){if(window.history.replaceState({},``,window.location.pathname+window.location.search),e===`examen`||e===`final-exam`){if(W.profile.role!==`student`)return;$a(G,{onClose:()=>{$(),Y(W.profile)}})}else $o(G,{readOnly:W.profile.role!==`student`,onClose:$})}}function X(e){if(e)throw e}async function hc(e){return e.role===`admin`?gc():e.role===`teacher`?_c(e.id):e.role===`guardian`?yc(e):vc(e.id)}async function gc(){let[e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,ee,te]=await Promise.all([I.from(`academic_years`).select(`name,starts_on,ends_on`).eq(`is_active`,!0).maybeSingle(),I.from(`groups`).select(`id,name,level,schedule,teacher_id`).order(`name`),I.from(`profiles`).select(`id,role,full_name,email,username,active,phone,created_at`).order(`created_at`),I.from(`students`).select(`id,student_code,group_id,profile_id,status`).order(`student_code`),I.from(`guardians`).select(`id,profile_id,email,full_name,phone,active`).order(`email`),I.from(`student_guardians`).select(`student_id,guardian_id`),I.from(`settings`).select(`key,value,updated_at,updated_by`).order(`key`),I.rpc(`app_admin_content_stats`),I.from(`units`).select(`id,subject_id,num,title,status`).order(`num`),I.rpc(`app_staff_dashboard`),I.rpc(`app_subject_board`),I.from(`student_profiles`).select(`*`),I.from(`terms`).select(`id,academic_year_id,name,starts_on,ends_on`).order(`starts_on`),I.from(`unit_assignments`).select(`id,group_id,unit_id,unit_version_id,status,visible,opens_at,closes_at`),I.from(`unit_versions`).select(`id,unit_id,version,published_at`).not(`published_at`,`is`,null).order(`version`,{ascending:!1}),I.from(`student_unit_overrides`).select(`assignment_id,student_id,status,opens_at,closes_at`),I.rpc(`app_staff_tasks`),I.rpc(`app_activity_log`,{p_limit:80}),I.rpc(`app_external_accounts`),I.from(`student_billing`).select(`*`),I.from(`payments`).select(`id,student_id,amount,paid_at,method,period,notes,period_start,period_end,status,receipt_no,voided_at,void_reason`).order(`paid_at`,{ascending:!1}).limit(600),I.from(`student_billing_status`).select(`*`),I.from(`audit_log`).select(`id,actor_id,action,entity_type,entity_id,created_at`).order(`created_at`,{ascending:!1}).limit(200),I.from(`data_requests`).select(`id,profile_id,student_id,kind,details,status,received_at,due_at,resolved_at,resolution`).order(`received_at`,{ascending:!1}).limit(200)]);X(e.error),X(t.error),X(n.error),X(r.error),X(i.error),X(a.error),X(o.error),X(s.error),X(c.error),X(l.error),X(u.error),X(d.error),X(f.error),X(p.error),X(m.error),X(h.error),X(g.error),X(_.error),X(v.error),X(y.error),X(b.error),X(x.error),X(ee.error),X(te.error);let S=n.data||[],ne=r.data||[],re=i.data||[],ie=t.data||[],ae=c.data||[],oe=new Map((s.data||[]).map(e=>[e.subject_id,e.subject_name])),se=new Map;for(let e of m.data||[])se.has(e.unit_id)||se.set(e.unit_id,[]),se.get(e.unit_id).push(e);let ce=ae.filter(e=>e.status===`published`).map(e=>({...e,subject_name:oe.get(e.subject_id)||e.subject_id,versions:se.get(e.id)||[]})),le=new Map;for(let e of h.data||[])le.has(e.assignment_id)||le.set(e.assignment_id,[]),le.get(e.assignment_id).push(e);let ue=S.reduce((e,t)=>(e[t.role]=(e[t.role]||0)+1,e),{}),de=new Map(S.map(e=>[e.id,e.full_name])),fe=new Map(ie.map(e=>[e.id,e.name])),pe=new Map(S.map(e=>[e.id,e.full_name])),me=new Map(ne.map(e=>[e.id,e.student_code])),he=new Map;for(let e of a.data||[])he.has(e.guardian_id)||he.set(e.guardian_id,[]),he.get(e.guardian_id).push(me.get(e.student_id)||`?`);return{kind:`admin`,year:e.data,groups:ie.map(e=>({...e,teacher_name:pe.get(e.teacher_id)||`Sin profesor`})),profiles:S,students:ne.map(e=>({...e,full_name:de.get(e.profile_id)||`Alumno sin nombre`,group_name:fe.get(e.group_id)||`Sin grupo`})),guardians:re.map(e=>({...e,students:he.get(e.id)||[]})),settings:o.data||[],stats:s.data||[],units:ae,overview:l.data||null,board:(u.data||{}).subjects||[],assignments:(p.data||[]).map(e=>({...e,overrides:le.get(e.id)||[]})),publishedUnits:ce,tasks:(g.data||{}).tasks||[],activity:(_.data||{}).entries||[],externalAccounts:v.data||[],billingByStudent:new Map((y.data||[]).map(e=>[e.student_id,e])),payments:b.data||[],billingStatusByStudent:new Map((x.data||[]).map(e=>[e.student_id,e])),auditLog:ee.data||[],dataRequests:te.data||[],studentProfiles:new Map((d.data||[]).map(e=>[e.student_id,e])),terms:f.data||[],subjectNames:new Map((s.data||[]).map(e=>[e.subject_id,e.subject_name])),counts:{profiles:S.length,students:ne.length,...ue}}}async function _c(e){let t=await I.from(`groups`).select(`id,name,level,schedule`).eq(`teacher_id`,e).order(`name`);X(t.error);let n=t.data||[],r=n.map(e=>e.id),i=[];if(r.length){let e=await I.from(`students`).select(`id,student_code,group_id,profile_id`).in(`group_id`,r).order(`student_code`);X(e.error),i=e.data||[]}let a=i.map(e=>e.id),o=[...new Set(i.map(e=>e.profile_id))],s=[];if(o.length){let e=await I.from(`profiles`).select(`id,full_name`).in(`id`,o);X(e.error),s=e.data||[]}let[c,l,u,d,f,p,m,h,g,_,v,y,b,x,ee,te,S]=await Promise.all([I.from(`units`).select(`id,title,subject_id,estimated_minutes`).eq(`status`,`published`).order(`title`),I.from(`unit_versions`).select(`id,unit_id,version,published_at`).not(`published_at`,`is`,null).order(`version`,{ascending:!1}),r.length?I.from(`unit_assignments`).select(`id,group_id,unit_id,unit_version_id,status,visible,opens_at,closes_at`).in(`group_id`,r).order(`created_at`,{ascending:!1}):Promise.resolve({data:[],error:null}),r.length?I.from(`student_unit_overrides`).select(`assignment_id,student_id,status,opens_at,closes_at`):Promise.resolve({data:[],error:null}),I.from(`subjects`).select(`id,name`).order(`name`),I.rpc(`app_staff_dashboard`),a.length?I.from(`student_stats`).select(`student_id,xp_total,current_streak,best_streak,units_completed,last_activity_date`).in(`student_id`,a):Promise.resolve({data:[],error:null}),a.length?I.from(`student_guardians`).select(`student_id,guardian_id`).in(`student_id`,a):Promise.resolve({data:[],error:null}),I.from(`guardians`).select(`id,full_name,email,phone,relationship`),I.rpc(`app_subject_board`),a.length?I.from(`student_profiles`).select(`*`).in(`student_id`,a):Promise.resolve({data:[],error:null}),I.from(`terms`).select(`id,academic_year_id,name,starts_on,ends_on`).order(`starts_on`),I.rpc(`app_staff_tasks`),I.rpc(`app_activity_log`,{p_limit:80}),a.length?I.from(`student_billing`).select(`*`).in(`student_id`,a):Promise.resolve({data:[],error:null}),a.length?I.from(`payments`).select(`id,student_id,amount,paid_at,method,period,notes,period_start,period_end,status,receipt_no,voided_at,void_reason`).in(`student_id`,a).order(`paid_at`,{ascending:!1}).limit(400):Promise.resolve({data:[],error:null}),a.length?I.from(`student_billing_status`).select(`*`).in(`student_id`,a):Promise.resolve({data:[],error:null})]);X(c.error),X(l.error),X(u.error),X(d.error),X(f.error),X(p.error),X(m.error),X(h.error),X(g.error),X(_.error),X(v.error),X(y.error),X(b.error),X(x.error),X(ee.error),X(te.error),X(S.error);let ne=new Map(s.map(e=>[e.id,e.full_name])),re=new Map((f.data||[]).map(e=>[e.id,e.name])),ie=new Map;for(let e of l.data||[])ie.has(e.unit_id)||ie.set(e.unit_id,[]),ie.get(e.unit_id).push(e);let ae=(c.data||[]).map(e=>({...e,subject_name:re.get(e.subject_id)||e.subject_id,versions:ie.get(e.id)||[]})),oe=new Map(ae.map(e=>[e.id,e.title])),se=new Map;for(let e of d.data||[])se.has(e.assignment_id)||se.set(e.assignment_id,[]),se.get(e.assignment_id).push(e);let ce=(u.data||[]).map(e=>({...e,unit_title:oe.get(e.unit_id)||`Unidad`,overrides:se.get(e.id)||[]})),le=new Map((m.data||[]).map(e=>[e.student_id,e])),ue=new Map((g.data||[]).map(e=>[e.id,e])),de=new Map;for(let e of h.data||[]){de.has(e.student_id)||de.set(e.student_id,[]);let t=ue.get(e.guardian_id);t&&de.get(e.student_id).push(t)}return{kind:`teacher`,overview:p.data||null,board:(_.data||{}).subjects||[],tasks:(b.data||{}).tasks||[],activity:(x.data||{}).entries||[],billingByStudent:new Map((ee.data||[]).map(e=>[e.student_id,e])),payments:te.data||[],billingStatusByStudent:new Map((S.data||[]).map(e=>[e.student_id,e])),studentProfiles:new Map((v.data||[]).map(e=>[e.student_id,e])),terms:y.data||[],groups:n.map(e=>({...e,students:i.filter(t=>t.group_id===e.id).map(e=>({...e,full_name:ne.get(e.profile_id)||`Alumno sin nombre`,stats:le.get(e.id)||null,guardians:de.get(e.id)||[]}))})),students:n.map(e=>({...e,students:i.filter(t=>t.group_id===e.id).map(t=>({...t,full_name:ne.get(t.profile_id)||`Alumno sin nombre`,stats:le.get(t.id)||null,guardians:de.get(t.id)||[],group_name:e.name}))})).flatMap(e=>e.students),publishedUnits:ae,assignments:ce}}async function vc(e){let t=await I.from(`students`).select(`id,student_code,group_id,status`).eq(`profile_id`,e).maybeSingle();if(X(t.error),!t.data)return{kind:`student`,student:null,group:null,units:[],activeAssignments:0};let[n,r,i]=await Promise.all([I.from(`groups`).select(`name,level,schedule`).eq(`id`,t.data.group_id).maybeSingle(),I.from(`unit_assignments`).select(`id,unit_id,unit_version_id,instructions,opens_at,closes_at,status,visible`).eq(`group_id`,t.data.group_id).in(`status`,[`active`,`closed`]).eq(`visible`,!0).order(`created_at`),I.from(`student_guidance`).select(`*`).eq(`student_id`,t.data.id).maybeSingle()]);X(n.error),X(r.error),X(i.error);let a=r.data||[],o=a.map(e=>e.id),s=[];if(o.length){let e=await I.from(`student_unit_overrides`).select(`assignment_id,status,opens_at,closes_at`).eq(`student_id`,t.data.id).in(`assignment_id`,o);X(e.error),s=e.data||[]}let c=new Map(s.map(e=>[e.assignment_id,e])),l=Date.now(),u=a.filter(e=>{let t=c.get(e.id);if((t?.status||e.status)!==`active`)return!1;let n=t?.opens_at||e.opens_at,r=t?.closes_at||e.closes_at;return!(n&&new Date(n).getTime()>l||r&&new Date(r).getTime()<=l)}),d=[...new Set(u.map(e=>e.unit_id))],f=u.map(e=>e.id),p=[],m=[],h=[];if(d.length){let[e,n,r]=await Promise.all([I.from(`units`).select(`id,title,subject_id,estimated_minutes`).in(`id`,d),I.from(`subjects`).select(`id,name`).order(`name`),I.from(`unit_progress`).select(`assignment_id,status,attempts_count,best_accuracy,completed_at`).eq(`student_id`,t.data.id).in(`assignment_id`,f)]);X(e.error),X(n.error),X(r.error),p=e.data||[],m=n.data||[],h=r.data||[]}let g=new Map(p.map(e=>[e.id,e])),_=new Map(m.map(e=>[e.id,e.name])),v=new Map(h.map(e=>[e.assignment_id,e])),y=u.map(e=>{let t=g.get(e.unit_id);return{...e,unit:t?{...t,subject_name:_.get(t.subject_id)||t.subject_id}:null,progress:v.get(e.id)||null}}),b=await Za();return{kind:`student`,student:t.data,group:n.data,profile:i.data||{},units:y,activeAssignments:y.length,exam:b}}async function yc(e){let[t,n]=await Promise.all([I.from(`guardians`).select(`id`).eq(`profile_id`,e.id).maybeSingle(),I.from(`privacy_document`).select(`version,url,sha256`).maybeSingle()]);X(t.error);let r=n.error||!n.data?{version:Ss,url:`/privacidad.html`,sha256:``}:n.data,i=t.data?.id;if(!i)return{kind:`guardian`,privacy:r,billingByStudent:new Map,payments:[],children:[],pending:[]};let a=await I.from(`student_guardians`).select(`student_id`).eq(`guardian_id`,i).order(`student_id`);X(a.error);let o=[...new Set((a.data||[]).map(e=>e.student_id))];if(!o.length)return{kind:`guardian`,privacy:r,billingByStudent:new Map,payments:[],children:[],pending:[]};let s=await I.from(`privacy_consents`).select(`student_id,document_version,accepted_at,revoked_at`).eq(`guardian_id`,i).in(`student_id`,o);X(s.error);let c=r.version||Ss,l=new Map;for(let e of s.data||[])e.document_version===c&&!e.revoked_at&&l.set(e.student_id,e);let u=o.filter(e=>l.has(e)),d=o.filter(e=>!l.has(e)),f=u.length?await I.from(`students`).select(`id,student_code,group_id,profile_id`).in(`id`,u).order(`student_code`):{data:[],error:null};X(f.error);let p=f.data||[],m=[...new Set(p.map(e=>e.profile_id))],h=[...new Set(p.map(e=>e.group_id))],g=p.map(e=>e.id),[_,v,y,b,x,ee,te,S,ne,re,ie,ae,oe,se,ce,le,ue]=await Promise.all([m.length?I.from(`profiles`).select(`id,full_name`).in(`id`,m):Promise.resolve({data:[],error:null}),h.length?I.from(`groups`).select(`id,name`).in(`id`,h):Promise.resolve({data:[],error:null}),g.length?I.from(`student_billing`).select(`*`).in(`student_id`,g):Promise.resolve({data:[],error:null}),g.length?I.from(`payments`).select(`id,student_id,amount,paid_at,method,period,period_start,period_end,status,receipt_no,voided_at,void_reason`).in(`student_id`,g).order(`paid_at`,{ascending:!1}).limit(120):Promise.resolve({data:[],error:null}),g.length?I.from(`student_billing_status`).select(`*`).in(`student_id`,g):Promise.resolve({data:[],error:null}),g.length?I.from(`student_guidance`).select(`*`).in(`student_id`,g):Promise.resolve({data:[],error:null}),g.length?I.from(`unit_progress`).select(`student_id,assignment_id,status,best_accuracy,completed_at,attempts_count`).in(`student_id`,g):Promise.resolve({data:[],error:null}),h.length?I.from(`unit_assignments`).select(`id,group_id,unit_id,status,visible,opens_at,closes_at`).in(`group_id`,h):Promise.resolve({data:[],error:null}),g.length?I.from(`grades`).select(`student_id,assessment_id,score,status,notes,recorded_at`).in(`student_id`,g):Promise.resolve({data:[],error:null}),h.length?I.from(`assessments`).select(`id,group_id,subject_id,name,type,max_score,assessment_date`).in(`group_id`,h):Promise.resolve({data:[],error:null}),g.length?I.from(`attendance`).select(`student_id,session_id,status,minutes_late`).in(`student_id`,g):Promise.resolve({data:[],error:null}),h.length?I.from(`attendance_sessions`).select(`id,group_id,session_date,topic`).in(`group_id`,h):Promise.resolve({data:[],error:null}),g.length?I.from(`observations`).select(`student_id,category,body,created_at`).in(`student_id`,g).eq(`visibility`,`family`):Promise.resolve({data:[],error:null}),h.length?I.from(`tasks`).select(`id,group_id,subject_id,title,due_at,max_score,task_type`).in(`group_id`,h).is(`archived_at`,null):Promise.resolve({data:[],error:null}),g.length?I.from(`task_submissions`).select(`task_id,student_id,status,score,feedback,submitted_at`).in(`student_id`,g):Promise.resolve({data:[],error:null}),g.length?I.from(`student_stats`).select(`student_id,xp_total,units_completed,units_mastered,accuracy,reading_wpm,reading_comprehension`).in(`student_id`,g):Promise.resolve({data:[],error:null}),I.from(`subjects`).select(`id,name`).order(`name`)]);X(_.error),X(v.error),X(y.error),X(b.error),X(x.error),X(ee.error),X(te.error),X(S.error),X(ne.error),X(re.error),X(ie.error),X(ae.error),X(oe.error),X(se.error),X(ce.error),X(le.error),X(ue.error);let de=[...new Set((S.data||[]).map(e=>e.unit_id).filter(Boolean))],fe=de.length?await I.from(`units`).select(`id,title,subject_id`).in(`id`,de):{data:[],error:null};X(fe.error);let pe=new Map((_.data||[]).map(e=>[e.id,e.full_name])),me=new Map((v.data||[]).map(e=>[e.id,e.name])),he=new Map((ue.data||[]).map(e=>[e.id,e.name])),ge=new Map((fe.data||[]).map(e=>[e.id,e])),_e=new Map((S.data||[]).map(e=>[e.id,e])),ve=new Map((re.data||[]).map(e=>[e.id,e])),ye=new Map((ae.data||[]).map(e=>[e.id,e]));new Map((se.data||[]).map(e=>[e.id,e]));let be=new Map((ee.data||[]).map(e=>[e.student_id,e])),xe=new Map((le.data||[]).map(e=>[e.student_id,e])),C=(e,t)=>{let n=new Map;for(let r of e||[]){let e=r[t];n.has(e)||n.set(e,[]),n.get(e).push(r)}return n},Se=C(te.data,`student_id`),Ce=C(ne.data,`student_id`),we=C(ie.data,`student_id`),Te=C(oe.data,`student_id`),Ee=C(ce.data,`student_id`),De=new Map(p.map(e=>{let t=(Se.get(e.id)||[]).map(e=>{let t=_e.get(e.assignment_id),n=t?ge.get(t.unit_id):null;return{...e,unit_title:n?.title||`Unidad`,subject_name:n?he.get(n.subject_id)||n.subject_id:``,opens_at:t?.opens_at||null,closes_at:t?.closes_at||null}}),n=(Ce.get(e.id)||[]).map(e=>{let t=ve.get(e.assessment_id);return{...e,assessment_name:t?.name||`Evaluación`,subject_name:t?he.get(t.subject_id)||t.subject_id:``,max_score:t?.max_score??null,assessment_date:t?.assessment_date||null}}).sort((e,t)=>String(t.assessment_date||``).localeCompare(String(e.assessment_date||``))),r=(we.get(e.id)||[]).map(e=>{let t=ye.get(e.session_id);return{...e,session_date:t?.session_date||null,topic:t?.topic||``}}).sort((e,t)=>String(t.session_date||``).localeCompare(String(e.session_date||``))),i=(Te.get(e.id)||[]).slice().sort((e,t)=>String(t.created_at||``).localeCompare(String(e.created_at||``))),a=Ee.get(e.id)||[],o=(se.data||[]).filter(t=>t.group_id===e.group_id).map(e=>({...e,subject_name:he.get(e.subject_id)||e.subject_id,submission:a.find(t=>t.task_id===e.id)||null})).sort((e,t)=>String(e.due_at||``).localeCompare(String(t.due_at||``)));return[e.id,{guidance:be.get(e.id)||{},stats:xe.get(e.id)||{},progress:t,grades:n,attendance:r,observations:i,tasks:o}]}));return{kind:`guardian`,privacy:r,billingByStudent:new Map((y.data||[]).map(e=>[e.student_id,e])),payments:b.data||[],billingStatusByStudent:new Map((x.data||[]).map(e=>[e.student_id,e])),academics:De,children:p.map(e=>({...e,full_name:pe.get(e.profile_id)||`Alumno sin nombre`,group_name:me.get(e.group_id)||`Sin grupo`,consent_accepted:!0,consent_accepted_at:l.get(e.id)?.accepted_at||null})),pending:d.map((e,t)=>({id:e,label:d.length===1?`el alumno vinculado`:`el alumno ${t+1}`}))}}function bc(e,t){G.innerHTML=`
    <div class="shell">
      ${Us()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel config-panel">
          <span class="kicker">Error de acceso</span>
          <h1>${K(e)}</h1>
          <p>${K(t)}</p>
          <div class="row">
            <button class="btn primary" id="retry-btn">Reintentar</button>
            <button class="btn ghost" id="fatal-logout">Cerrar sesión</button>
          </div>
        </section>
      </main>
    </div>
  `,G.querySelector(`#retry-btn`).addEventListener(`click`,()=>{W.error=``,Js(),I.auth.getSession().then(({data:e})=>{e.session?pc(e.session):Xs()})}),G.querySelector(`#fatal-logout`).addEventListener(`click`,gd)}function Z(e){if(!e)return``;let[t,n,r]=String(e).split(`-`).map(Number);return!t||!n||!r?String(e):new Intl.DateTimeFormat(`es-MX`,{day:`2-digit`,month:`short`,year:`numeric`,timeZone:`UTC`}).format(new Date(Date.UTC(t,n-1,r)))}function xc(e,t,n){return`${e} ${e===1?t:n}`}function Sc(e){return Rc(e)}function Cc(e){let t=e.profiles.filter(e=>e.role===`teacher`),n=e.guardians,r=e.externalAccounts||[],i=new Set((e.students||[]).map(e=>e.profile_id)),a=e.profiles.filter(e=>e.role===`student`&&!i.has(e.id));return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Profesores y admin</span>
          <h2>${t.length?xc(t.length,`profesor`,`profesores`):`Sin profesores`}</h2>
        </div>
      </div>
      <ul class="data-list">
        ${e.profiles.filter(e=>e.role===`teacher`||e.role===`admin`).map(e=>`
    <li>
      <div>
        <strong>${K(e.full_name)}${e.role===`admin`?` · Tú`:``}</strong>
        <small>${K(e.email||e.username||`Sin identificador`)}</small>
      </div>
      ${e.role===`admin`?`
        <span class="pill success">Activo</span>
      `:`
        <button class="btn ghost" data-toggle-user="${K(e.id)}" data-active="${e.active?`1`:`0`}">
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
          <h2>${e.students.length?xc(e.students.length,`alumno`,`alumnos`):`Sin alumnos`}</h2>
        </div>
      </div>
      ${e.students.length?`
        <ul class="data-list">
          ${e.students.map(e=>`
            <li>
              <div>
                <strong>${K(e.full_name)}</strong>
                <small>${K(e.student_code)} · ${K(e.group_name)} · ${K(e.status)}</small>
              </div>
              <div class="row">
                <button class="btn ghost" data-reset-student="${K(e.id)}" data-student-name="${K(e.full_name)}">Nueva contraseña</button>
                <button class="btn ghost" data-reissue-invite="${K(e.id)}" data-student-name="${K(e.full_name)}">Enlace de acceso</button>
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
          <h2>${n.length?xc(n.length,`tutor`,`tutores`):`Sin tutores`}</h2>
        </div>
      </div>
      ${n.length?`
        <ul class="data-list">
          ${n.map(e=>`
            <li>
              <div>
                <strong>${K(e.full_name)}</strong>
                <small>${K(e.email||e.phone||`Sin contacto`)} · Alumnos: ${e.students.map(K).join(`, `)||`—`}</small>
              </div>
              <span class="pill ${e.active?`success`:``}">${e.active?`Activo`:`Inactivo`}</span>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Todavía no hay tutores. Invítalos desde el panel del profesor.</p>`}
    </article>

    ${wc(r,a)}
  `}function wc(e,t){return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Detección de colados</span>
          <h2>Cuentas externas</h2>
        </div>
        <span class="pill ${e.length?`pill-red`:`success`}">${e.length?xc(e.length,`cuenta`,`cuentas`):`Ninguna`}</span>
      </div>
      <p class="muted">Cuentas creadas fuera de la plataforma (sin perfil ni grupo). No pueden ver nada del curso. Aquí puedes <strong>bloquearlas</strong> o vincularlas desde el alta de alumnos con su correo.</p>
      ${e.length?`
        <ul class="data-list">
          ${e.map(e=>`
            <li>
              <div>
                <strong>${K(e.email)}</strong>
                <small>
                  ${e.banned?`⛔ Bloqueada`:e.email_confirmed?`Correo confirmado`:`⚠️ Correo sin confirmar`}
                  · Creada ${K(Nc(e.created_at))}
                  · Último acceso: ${e.last_sign_in_at?K(Nc(e.last_sign_in_at)):`nunca`}
                </small>
              </div>
              <button class="btn ghost ${e.banned?``:`danger`}" data-ban-account="${K(e.id)}" data-ban="${e.banned?`0`:`1`}">
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
                <strong>${K(e.full_name)}</strong>
                <small>${K(e.email||e.username||`Sin identificador`)} · Sin ficha de alumno en ningún grupo</small>
              </div>
              <button class="btn ghost" data-toggle-user="${K(e.id)}" data-active="${e.active?`1`:`0`}">
                ${e.active?`Desactivar`:`Activar`}
              </button>
            </li>
          `).join(``)}
        </ul>
      </article>
    `:``}
  `}function Tc(e){let t=new Map;for(let n of e.units)t.has(n.subject_id)||t.set(n.subject_id,[]),t.get(n.subject_id).push(n);return`
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
                <strong>${K(e.subject_name)}</strong>
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
                  <small>U${String(e.num).padStart(2,`0`)} · ${K(e.title)}</small>
                </div>
                <span class="pill ${e.status===`published`?`success`:``}">${K(e.status)}</span>
              </li>
            `).join(``)}
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Sin estadísticas de contenido.</p>`}
    </article>
  `}var Ec={access:`Acceso`,rectification:`Rectificación`,cancellation:`Cancelación`,opposition:`Oposición`,portability:`Portabilidad`,revocation:`Revocación`},Dc={received:`Recibida`,in_progress:`En proceso`,resolved:`Resuelta`,rejected:`Rechazada`};function Oc(e){let t=e.auditLog||[],n=e.dataRequests||[],r=new Map((e.profiles||[]).map(e=>[e.id,e.full_name||e.email||e.id]));return`
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
                <strong>${K(Ec[e.kind]||e.kind)} · ${K(Dc[e.status]||e.status)}</strong>
                <small>Recibida: ${K(Z(String(e.received_at).slice(0,10)))} · Plazo: ${K(Z(String(e.due_at).slice(0,10)))}${e.resolved_at?` · Resuelta: ${K(Z(String(e.resolved_at).slice(0,10)))}`:``}</small>
                ${e.details?`<p>${K(e.details)}</p>`:``}
                ${e.resolution?`<p class="muted"><strong>Resolución:</strong> ${K(e.resolution)}</p>`:``}
              </div>
              ${e.status===`received`||e.status===`in_progress`?`
                <div class="row">
                  <select data-request-status="${K(e.id)}" aria-label="Nuevo estado">
                    <option value="in_progress">En proceso</option>
                    <option value="resolved">Resuelta</option>
                    <option value="rejected">Rechazada</option>
                  </select>
                  <input data-request-resolution="${K(e.id)}" placeholder="Motivo de la resolución" minlength="10" aria-label="Motivo de la resolución">
                  <button class="btn primary" data-resolve-request="${K(e.id)}">Resolver</button>
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
                <strong>${K(e.action)}</strong>
                <small>${K(r.get(e.actor_id)||`Sistema`)} · ${K(e.entity_type)}${e.entity_id?` · ${K(e.entity_id)}`:``}</small>
              </div>
              <span class="pill">${K(Z(String(e.created_at).slice(0,10)))}</span>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Todavía no hay eventos auditados.</p>`}
    </article>
  `}async function kc(e){let t=e.dataset.resolveRequest,n=G.querySelector(`[data-request-status="${t}"]`)?.value,r=String(G.querySelector(`[data-request-resolution="${t}"]`)?.value||``).trim();if(n!==`in_progress`&&n!==`resolved`&&n!==`rejected`){q(`Selecciona un estado válido.`),$();return}if(n!==`in_progress`&&r.length<10){q(`Escribe una resolución de al menos 10 caracteres.`),$();return}e.disabled=!0,e.textContent=`Guardando…`;let{error:i}=await I.rpc(`app_resolve_data_request`,{p_request_id:t,p_status:n,p_resolution:r||`Solicitud tomada en atención.`});i?q(i.message||`No se pudo actualizar la solicitud.`):J(`Solicitud actualizada y registrada en auditoría.`),$(),await Y(W.profile)}function Ac(e){return`
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
                <strong>${K(e.key)}</strong>
                <small>Actualizado: ${K(e.updated_at?new Date(e.updated_at).toLocaleString():`—`)}</small>
              </div>
              <div class="row setting-edit">
                <input data-setting-value="${K(e.key)}" value="${K(JSON.stringify(e.value))}">
                <button class="btn primary" data-save-setting="${K(e.key)}">Guardar</button>
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
        <li><div><strong>App</strong><small>${K(Ma)} · GitHub Pages</small></div></li>
        <li><div><strong>Supabase</strong><small>${K(jc())}</small></div></li>
        <li><div><strong>Aviso de privacidad vigente</strong><small>${K(Ss)}</small></div></li>
      </ul>
    </article>
  `}function jc(){try{return new URL(`https://ioikcrdxneuydylyhvwi.supabase.co`).host}catch{return`sin configurar`}}function Mc(e){if(!e)return``;let t=new Date(`${String(e).slice(0,10)}T12:00:00`);return Number.isNaN(t.getTime())?``:t.toLocaleDateString(`es-MX`,{weekday:`short`,day:`numeric`})}function Nc(e){if(!e)return``;let t=new Date(e);if(Number.isNaN(t.getTime()))return``;let n=Math.max(0,Math.round((Date.now()-t.getTime())/1e3));if(n<60)return`ahora`;let r=Math.round(n/60);if(r<60)return`hace ${r} min`;let i=Math.round(r/60);if(i<24)return`hace ${i} h`;let a=Math.round(i/24);return a===1?`ayer`:a<30?`hace ${a} días`:t.toLocaleDateString(`es-MX`)}function Pc(e){let t=[],n=e?.pending_consent||[],r=e?.inactive_students||[],i=e?.assignments_ending_soon||[];n.length&&t.push(`
      <div class="attention-item">
        <span class="dot dot-amber"></span>
        <div><strong>${n.length} ${n.length===1?`tutor sin consentimiento`:`tutores sin consentimiento`}</strong>
        <div class="muted"><small>${n.slice(0,4).map(e=>`${K(e.student)} · ${K(e.guardian)}`).join(` · `)}${n.length>4?`…`:``}</small></div></div>
      </div>
    `);for(let e of r.slice(0,3))t.push(`
      <div class="attention-item">
        <span class="dot dot-red"></span>
        <div><strong>${K(e.name||e.student)}</strong> sin actividad reciente
        <div class="muted"><small>${e.days?`última actividad hace ${e.days} días`:`sin actividad registrada`} · ${K(e.student)}</small></div></div>
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
      <div><strong>«${K(e.unit)}» por cerrar</strong>
      <div class="muted"><small>${K(e.group)} · cierra ${K(Z(String(e.closes).slice(0,10)))}</small></div></div>
    `);return t.length?t.join(``):`<div class="attention-item"><span class="dot dot-green"></span><div><strong>Todo en orden 🎉</strong><div class="muted"><small>No hay pendientes que requieran tu atención.</small></div></div></div>`}function Fc(e){let t=Array.isArray(e)?e:[];return t.length?`
    <div class="feed-list">
      ${t.map(e=>`
        <div class="feed-item">
          <span class="feed-emoji">${e.kind===`completed`?`🏆`:`✏️`}</span>
          <div>
            <strong>${K(e.name||e.student)}</strong> ${K(e.text)}
            <div><small>${K(e.student)} · ${K(Nc(e.ts))}</small></div>
          </div>
          <span class="${e.ok?`feed-ok`:`feed-bad`}">${e.ok?`✓`:`✗`}</span>
        </div>
      `).join(``)}
    </div>
  `:`<p class="empty-state">Todavía no hay actividad reciente. Cuando los alumnos trabajen, aparecerá aquí.</p>`}function Ic(e){if(!e)return``;let t=e.counts||{},n=e.activity||{};return`
    <div class="dash-stats">
      <div class="stat-card stat-blue"><span class="stat-num">${t.students??0}</span><span class="stat-label">Alumnos activos</span></div>
      <div class="stat-card stat-violet"><span class="stat-num">${t.published_units??0}</span><span class="stat-label">Unidades publicadas</span></div>
      <div class="stat-card stat-green"><span class="stat-num">${n.today_attempts??0}</span><span class="stat-label">Intentos hoy</span></div>
      <div class="stat-card stat-amber"><span class="stat-num">${n.week_completions??0}</span><span class="stat-label">Completadas · 7 días</span></div>
      <div class="stat-card stat-pink"><span class="stat-num">${n.xp_total??0}</span><span class="stat-label">XP del grupo</span></div>
    </div>
  `}function Lc(e){if(!e)return``;let t=e.activity||{},n=Array.isArray(t.series)?t.series:[],r=Math.max(1,...n.map(e=>Math.max(e.attempts||0,e.completions||0)));return`
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
              <span class="bar-label">${K(Mc(e.day))}</span>
            </div>
          `).join(``)}
        </div>
      </article>

      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">Recordatorios</span><h2>Requiere tu atención</h2></div>
        </div>
        <div class="attention-list">${Pc(e.attention)}</div>
      </article>
    </div>
  `}function Rc(e){let t=W.profile?.role===`admin`,n=W.staffTab||`dashboard`,r=!!W.sidebarCollapsed;return`
    <div class="staff-app ${r?`collapsed`:``}">
      <aside class="staff-sidebar" aria-label="Secciones">
        <a class="brand staff-brand" href="/" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span class="brand-copy">ECOEMS <small>Plataforma</small></span>
        </a>

        <nav class="staff-nav">
          <span class="side-label">${t?`Administración`:`Mi espacio`}</span>
          ${(t?[`dashboard`,`alumnos`,`materias`,`asistencia`,`pagos`,`tareas`,`actividad`,`usuarios`,`contenido`,`auditoria`,`configuracion`]:[`dashboard`,`alumnos`,`materias`,`asistencia`,`pagos`,`tareas`,`actividad`,`tutores`]).map(e=>{let t=Rs(Ts[e]);return`
              <button class="staff-tab-btn ${n===e?`active`:``}" data-staff-tab="${e}" title="${K(t.text)}">
                <span class="nav-emoji" aria-hidden="true">${K(t.emoji)}</span>
                <span class="nav-text">${K(t.text)}</span>
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
          ${Hs()}
          ${zc(e,n)}
          ${Ws()}
        </main>
      </div>
    </div>
  `}function zc(e,t){return e?t===`alumnos`?Gc(e):t===`materias`?Yc(e):t===`asistencia`?Xc(e):t===`pagos`?ol(e):t===`tareas`?ml(e):t===`actividad`?hl(e):t===`tutores`?gl(e):t===`usuarios`?Cc(e):t===`contenido`?Tc(e):t===`auditoria`?Oc(e):t===`configuracion`?Ac(e):Vc(e):W.dashboardError?`
        <article class="card wide">
          <span class="card-label">Panel</span>
          <h2>No se pudo cargar</h2>
          <p>${K(W.dashboardError)}</p>
        </article>
      `:`
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>Cargando datos…</h2>
        <p>Estamos consultando tu grupo y tu avance.</p>
      </article>
    `}function Bc(){let e=W.profile;if(!e)return``;let t=vs[e.role]||`Usuario`,n=e.full_name||e.username||e.email||`Sin nombre`,r=e.username?`@${e.username}`:e.email||`Sin identificador`;return`
    <section class="welcome">
      <div>
        <span class="kicker">Sesión activa</span>
        <h1>Hola, ${K(n.split(` `)[0])} 👋</h1>
        <p class="muted">${K(ys[e.role]||`Tu cuenta está conectada.`)}</p>
      </div>
      <div class="identity">
        <span class="avatar">${K(n.slice(0,1).toUpperCase())}</span>
        <div>
          <strong>${K(n)}</strong>
          <small>${K(t)} · ${K(r)}</small>
        </div>
      </div>
    </section>
  `}function Vc(e){let t=e.overview?.scores||{},n=Array.isArray(t.students)?t.students:[];return`
    ${Bc()}

    <div class="section-title">
      <div>
        <span class="card-label">Panel de control</span>
        <h2>¿Cómo va el grupo?</h2>
      </div>
      <span class="pill">${K(e.kind===`admin`?`Vista global`:`Tu grupo`)}</span>
    </div>

    ${Ic(e.overview)}
    ${Lc(e.overview)}

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
                  <strong>${K(e.name)}</strong>
                  <div><small>${K(e.code)} · ⚡ ${e.xp} XP · 📚 ${e.units_done}/${e.units_total} unidades · ${e.accuracy==null?`sin precisión`:`🎯 ${Math.round(e.accuracy)}%`} · faltas: ${e.absences}</small></div>
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
        ${Fc(e.overview?.recent)}
      </article>
    </div>
  `}function Hc(e){return e>=80?`high`:e>=50?`mid`:`low`}function Uc(e,t){let n=[];for(let r of e.board||[]){let e=0,i=0,a=0,o=0;for(let n of r.units||[]){i+=1;let r=(n.students||[]).find(e=>e.code===t||e.id===t);r&&(r.status===`completed`||r.status===`mastered`)&&(e+=1),r&&r.accuracy!=null&&(a+=Number(r.accuracy),o+=1)}i>0&&n.push({subject:r.name,color:r.color,done:e,total:i,accuracy:o?Math.round(a/o):null})}return n}function Wc(e,t){for(let n of e.board||[])for(let e of n.units||[]){let r=(e.students||[]).find(e=>e.code===t||e.id===t);if(!r||r.status===`not_started`)return`${n.name} · ${e.title}`}return null}function Gc(e){let t=e.students||[],n=new Map((e.overview?.scores?.students||[]).map(e=>[e.code,e]));return t.length?`
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
              <div class="avatar-big">${K((e.full_name||`A`).slice(0,1).toUpperCase())}</div>
              <span class="score-ring ${Hc(r)}" title="Score general">${r}</span>
            </div>
            <div>
              <strong>${K(e.full_name)}</strong>
              <div class="muted"><small>${K(e.student_code)} · ${K(e.group_name||`Sin grupo`)}</small></div>
            </div>
            <div class="student-mini-stats">
              <span class="pill pill-pink">⚡ ${t.xp??0} XP</span>
              <span class="pill pill-green">📚 ${t.units_done??0}/${t.units_total??`—`}</span>
              ${t.accuracy==null?``:`<span class="pill pill-blue">🎯 ${Math.round(t.accuracy)}%</span>`}
              <span class="pill ${(t.absences??0)>0?`pill-red`:``}">Faltas: ${t.absences??0}</span>
            </div>
            <button class="btn ghost" data-ficha-toggle="${K(e.id)}">Ver ficha completa</button>
          </article>
        `}).join(``)}
    </div>

    ${Kc(e)}
  `:`
      <div class="section-title"><div><span class="card-label">Alumnos</span><h2>Grupo</h2></div></div>
      <article class="card wide"><p class="empty-state">Todavía no hay alumnos. Da de alta al primero aquí abajo.</p></article>
      ${Kc(e)}
    `}function Kc(e){let t=e.groups||[],n=e.kind===`admin`;return`
    <article class="card wide">
      <div class="card-heading">
        <div><span class="card-label">Alta</span><h2>Nuevo alumno</h2></div>
      </div>
      <form class="form" ${n?`id="admin-create-student-form"`:``} ${n?``:`data-create-student-group="${K(t[0]?.id||``)}"`}>
        ${n?`
          <label class="field">
            <span>Grupo</span>
            <select name="group_id" data-admin-groups required>
              <option value="">Selecciona un grupo…</option>
              ${t.map(e=>`
                <option value="${K(e.id)}">${K(e.name)}${e.teacher_name?` · ${K(e.teacher_name)}`:``}</option>
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

      <details class="admin-details" ${W.studentInvitation?`open`:``}>
        <summary>Invitar alumno (elige su propia contraseña)</summary>
        <p class="hint">Crea la cuenta y genera un enlace de un solo uso para que el alumno establezca su contraseña. Entrégalo por un canal seguro: vence en 72 h y no se puede reutilizar.</p>
        <form class="form" data-invite-student-form data-invite-group-default="${K(t[0]?.id||``)}">
          ${n?`
            <label class="field">
              <span>Grupo</span>
              <select name="group_id" data-invite-groups required>
                <option value="">Selecciona un grupo…</option>
                ${t.map(e=>`
                  <option value="${K(e.id)}">${K(e.name)}${e.teacher_name?` · ${K(e.teacher_name)}`:``}</option>
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

      ${qc(W.studentInvitation)}
    </article>
  `}function qc(e){return e?`
    <div class="answer-box correct" data-student-invitation>
      <strong>Invitación para ${K(e.fullName)}</strong>
      <p>Comparte este enlace con el alumno o su tutor. Vence en 72 h y solo funciona una vez.</p>
      <label class="field">
        <span>Enlace de invitación</span>
        <input readonly value="${K(e.redeemUrl)}" data-invitation-url>
      </label>
      <div class="row">
        <button class="btn ghost" type="button" data-copy-invitation>Copiar enlace</button>
        <button class="btn ghost" type="button" data-dismiss-invitation>Ocultar</button>
      </div>
      <p><small>Usuario: ${K(e.username)} · Matrícula: ${K(e.studentCode)} · Vence: ${K(e.expiresAtLabel)}</small></p>
    </div>
  `:``}function Jc(e,t){let n=(e.publishedUnits||[]).find(e=>e.id===t);return n?.versions?.length?n.versions[0].id:``}function Yc(e){let t=e.board||[],n=e.groups||[],r=n.some(e=>e.id===W.subjectsGroupId)?W.subjectsGroupId:n[0]?.id||null,i=e.students||[],a=new Map;for(let t of e.assignments||[])t.group_id===r&&(a.has(t.unit_id)||a.set(t.unit_id,t));let o=e.terms||[];return t.length?`
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
              ${n.map(e=>`<option value="${K(e.id)}" ${e.id===r?`selected`:``}>${K(e.name)}</option>`).join(``)}
            </select>
          </label>
        `:``}
        <span class="pill">${t.length} materias</span>
      </div>
    </div>

    ${t.map(t=>{let n=[];for(let e of t.units||[]){let t=a.get(e.id);t&&n.push(t)}let s=W.collapsedSubjects.has(t.id);return`
        <article class="board-subject ${s?`collapsed`:``}" style="border-left: 5px solid ${K(t.color||`#5b8cff`)}">
          <div class="board-head">
            <button class="board-toggle" data-subject-toggle="${K(t.id)}" aria-expanded="${s?`false`:`true`}" title="${s?`Mostrar`:`Ocultar`} ${K(t.name)}">
              <span class="chev" aria-hidden="true">▾</span>
              <h3 style="margin:0">${K(t.name)}</h3>
            </button>
            <span class="pill">${(t.units||[]).length} unidades</span>
            <span class="pill">${(t.assessments||[]).length} evaluaciones</span>
          </div>

          <div class="board-body" data-subject-body="${K(t.id)}">
          <span class="card-label">Unidades (orden del curso)</span>
          ${(t.units||[]).map(t=>{let n=a.get(t.id),o=t.students||[],s=i.filter(e=>e.group_id===r),c=(n?.overrides||[]).filter(e=>e.status===`closed`).length,l=Math.max(0,s.length-c),u=Jc(e,t.id);return`
              <div class="board-unit">
                <span class="pill pill-blue">U${String(t.num).padStart(2,`0`)}</span>
                <div>
                  <strong>${K(t.title)}</strong>
                  <div class="muted"><small>${t.estimated?`${t.estimated} min`:``}</small></div>
                </div>
                <div class="row">
                  ${n&&n.status===`active`?`<span class="pill success">Activa</span>
                       <span class="pill">${l}/${s.length} alumnos</span>
                       <button class="btn-mini" data-manage-assignment="${K(n.id)}" data-unit-group="${K(r)}">Alumnos</button>
                       <button class="btn-mini danger" data-close-assignment="${K(n.id)}">Cerrar</button>`:n&&n.status===`closed`?`<span class="pill pill-red">Cerrada</span>
                         <button class="btn-mini" data-reopen-assignment="${K(n.id)}">Reabrir</button>`:r?`<button class="btn-mini primary" data-activate-unit="${K(t.id)}:${K(u)}" data-unit-group="${K(r)}">Activar</button>`:`<span class="pill">Sin activar</span>`}
                </div>
                <div class="unit-students">
                  ${o.length?o.map(e=>`
                    <span class="student-chip ${e.status===`completed`||e.status===`mastered`?`done`:e.status===`in_progress`?`progress`:`todo`}">
                      ${K(e.name||e.code)} ${e.status===`completed`||e.status===`mastered`?`✓`:e.status===`in_progress`?`…`:`·`}${e.accuracy==null?``:` ${Math.round(e.accuracy)}%`}
                    </span>
                  `).join(``):`<span class="muted"><small>Sin avance registrado</small></span>`}
                </div>
              </div>
            `}).join(``)}

          <span class="card-label">Exámenes y tareas</span>
          ${(t.assessments||[]).map(e=>`
            <div class="assessment-box" data-assessment-box="${K(e.id)}">
              <div class="section-title">
                <div>
                  <strong>${K(e.title)}</strong>
                  <div class="muted"><small>${K(Ds[e.type]||e.type)} · sobre ${e.max} · ${K(e.date?Z(String(e.date).slice(0,10)):`sin fecha`)}</small></div>
                </div>
                <button class="btn-mini" data-toggle-grades="${K(e.id)}">Calificar</button>
              </div>
              <div class="grades-editor hidden" data-grades-editor="${K(e.id)}">
                ${i.map(t=>{let n=(e.grades||[]).find(e=>e.student===t.student_code);return`
                    <div class="grade-row">
                      <span>${K(t.full_name)}</span>
                      <input type="number" step="0.1" min="0" max="${K(e.max)}" value="${n?K(n.score??``):``}" data-grade-student="${K(t.id)}" placeholder="—">
                      <button class="btn-mini primary" data-save-grade="${K(e.id)}" data-student="${K(t.id)}">Guardar</button>
                    </div>
                  `}).join(``)}
              </div>
            </div>
          `).join(``)||`<p class="empty-state">Sin exámenes ni tareas en esta materia.</p>`}

          ${r?`
            <details class="admin-details">
              <summary>Nueva evaluación (examen, tarea, proyecto…)</summary>
              <form class="form" data-create-assessment="${K(t.id)}" data-group="${K(r)}">
                <label class="field"><span>Nombre</span><input name="name" required placeholder="Examen parcial 1"></label>
                <label class="field">
                  <span>Tipo</span>
                  <select name="type">
                    ${Object.entries(Ds).map(([e,t])=>`<option value="${e}">${K(t)}</option>`).join(``)}
                  </select>
                </label>
                <div class="row">
                  <label class="field"><span>Puntaje máximo</span><input name="max_score" type="number" step="0.1" value="10" required></label>
                  <label class="field"><span>Fecha</span><input name="assessment_date" type="date"></label>
                  <label class="field"><span>Trimestre</span>
                    <select name="term_id">${o.map(e=>`<option value="${K(e.id)}">${K(e.name)}</option>`).join(``)}</select>
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
    `}function Xc(e){let t=e.groups||[];return t.length?`
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
          <div><span class="card-label">Grupo</span><h2>${K(e.name)}</h2></div>
        </div>
        <div class="row">
          <button class="btn primary" data-attendance-open="${K(e.id)}">Tomar asistencia</button>
          <button class="btn ghost" data-history-open="${K(e.id)}">Ver historial</button>
        </div>
        <div class="attendance-area hidden" data-attendance-area="${K(e.id)}"></div>
        <div class="attendance-history hidden" data-history-box="${K(e.id)}"></div>
      </article>
    `).join(``)}
  `:`
      <div class="section-title"><div><span class="card-label">Asistencia</span><h2>Grupos</h2></div></div>
      <article class="card wide"><p class="empty-state">No tienes grupos asignados.</p></article>
    `}var Zc={semanal:`Semanal`,quincenal:`Quincenal`,mensual:`Mensual`,contado:`Contado`,beca:`Beca`,otro:`Otro`},Qc={efectivo:`Efectivo`,transferencia:`Transferencia`,tarjeta:`Tarjeta`,otro:`Otro`};function $c(e,t){return(t||[]).filter(t=>t.student_id===e&&t.status!==`voided`)}function el(e,t){return $c(e,t).reduce((e,t)=>e+Number(t.amount||0),0)}function tl(e,t){return $c(e,t).slice().sort((e,t)=>String(t.paid_at).localeCompare(String(e.paid_at)))[0]||null}function Q(e){return Number(e||0).toLocaleString(`es-MX`,{style:`currency`,currency:`MXN`})}function nl(e){return e.toISOString().slice(0,10)}function rl(e,t){if(![`semanal`,`quincenal`,`mensual`].includes(e))return null;let n=new Date(`${t||nl(new Date)}T00:00:00Z`);if(Number.isNaN(n.getTime()))return null;let r=n.getUTCFullYear(),i=n.getUTCMonth();if(e===`mensual`)return{start:nl(new Date(Date.UTC(r,i,1))),end:nl(new Date(Date.UTC(r,i+1,0)))};if(e===`quincenal`)return n.getUTCDate()<=15?{start:nl(new Date(Date.UTC(r,i,1))),end:nl(new Date(Date.UTC(r,i,15)))}:{start:nl(new Date(Date.UTC(r,i,16))),end:nl(new Date(Date.UTC(r,i+1,0)))};let a=(n.getUTCDay()+6)%7,o=new Date(Date.UTC(r,i,n.getUTCDate()-a)),s=new Date(Date.UTC(o.getUTCFullYear(),o.getUTCMonth(),o.getUTCDate()+6));return{start:nl(o),end:nl(s)}}function il(e){return e===`voided`?`Anulado`:e===`partial`?`Parcial`:`Pagado`}function al(e){return{"al corriente":`Al corriente`,parcial:`Pago parcial`,pendiente:`Pendiente`,vencido:`Vencido`,beca:`Beca`,manual:`Plan manual`,"sin cuota":`Sin cuota`}[e]||`Pendiente`}function ol(e){let t=e.students||[],n=e.billingByStudent||new Map,r=e.billingStatusByStudent||new Map,i=e.payments||[],a=Math.max(1,Math.ceil(i.length/ws)),o=Math.min(Math.max(1,W.paymentsPage),a),s=i.slice((o-1)*ws,o*ws),c=new Date,l=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,`0`)}`,u=i.filter(e=>e.status!==`voided`),d=i.length-u.length,f=u.filter(e=>String(e.paid_at||``).slice(0,7)===l),p=f.reduce((e,t)=>e+Number(t.amount||0),0),m=u.reduce((e,t)=>e+Number(t.amount||0),0),h=t.filter(e=>n.has(e.id)).length;return`
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
          <h2>${Q(p)}</h2>
          <p class="muted">${f.length} ${f.length===1?`pago`:`pagos`} registrados</p>
        </div>
      </article>
      <article class="card pay-stat pay-stat-green">
        <span class="pay-stat-icon" aria-hidden="true">💰</span>
        <div>
          <span class="card-label">Ingresos totales</span>
          <h2>${Q(m)}</h2>
          <p class="muted">${d?`${d} ${d===1?`pago anulado excluido`:`pagos anulados excluidos`}`:`Todo lo registrado en la plataforma`}</p>
        </div>
      </article>
      <article class="card pay-stat pay-stat-blue">
        <span class="pay-stat-icon" aria-hidden="true">🗂️</span>
        <div>
          <span class="card-label">Planes asignados</span>
          <h2>${h}/${t.length}</h2>
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
          ${t.map(e=>{let t=n.get(e.id)||{},a=r.get(e.id)||{},o=t.plan||a.plan||`mensual`,s=el(e.id,i),c=tl(e.id,i),l=(e.full_name||`A`).trim().slice(0,1).toUpperCase(),u=a.period_start?{start:a.period_start,end:a.period_end}:rl(o),d=a.balance==null?null:Number(a.balance),f=d==null?`is-none`:d>0?`is-debt`:d<0?`is-credit`:`is-even`,p=d==null?`Sin datos`:d>0?`Por pagar`:d<0?`A favor`:`Al corriente`,m=a.paid==null?null:Number(a.paid),h=c?String(c.paid_at).slice(0,10):a.last_paid_at?String(a.last_paid_at).slice(0,10):null,g=t.fee||a.fee;return`
              <article class="pay-card">
                <div class="pay-card-head">
                  <span class="pay-avatar" aria-hidden="true">${K(l)}</span>
                  <div class="pay-who">
                    <strong>${K(e.full_name)}</strong>
                    <small>${K(e.student_code||``)}${e.group_name?` · ${K(e.group_name)}`:``}</small>
                  </div>
                  <span class="pill ${n.has(e.id)?``:`pill-amber`}">${n.has(e.id)?K(Zc[o]||o):`Sin plan`}</span>
                </div>
                <p class="pay-card-period">📆 Periodo: ${u&&u.start?`${K(Z(u.start))} – ${K(Z(u.end))}`:`Sin periodo definido`}</p>
                <div class="pay-balance ${f}">
                  <div>
                    <span class="card-label">Saldo</span>
                    <strong>${d==null?`—`:Q(Math.abs(d))}</strong>
                  </div>
                  <span class="pay-balance-tag">${p}</span>
                </div>
                <div class="pay-card-body">
                  <div class="pay-metric">
                    <span class="card-label">Cuota</span>
                    <strong>${g?Q(g):`—`}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">${m==null?`Pagado acumulado`:`Pagado en el periodo`}</span>
                    <strong class="${(m??s)>0?`pay-good`:``}">${Q(m??s)}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Estado</span>
                    <strong class="${a.status===`al corriente`||a.status===`beca`?`pay-good`:`pay-last`}">${K(al(a.status))}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Último pago</span>
                    <strong class="pay-last">${h?K(Z(h)):`—`}</strong>
                  </div>
                </div>
                <p class="pay-card-history">Total histórico registrado: ${Q(s)}</p>
                <div class="pay-card-actions">
                  <button class="btn primary" data-open-pay-dialog="${K(e.id)}" data-pay-mode="payment">💵 Registrar pago</button>
                  <button class="btn ghost" data-open-pay-dialog="${K(e.id)}" data-pay-mode="plan">⚙️ Plan</button>
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
        ${Hl({total:i.length,page:o,target:`payments`})}
        <ul class="data-list pay-list">
          ${s.map(e=>`
              <li>
                <div>
                  <strong>${K(t.find(t=>t.id===e.student_id)?.full_name||`Alumno`)}${e.receipt_no?` · ${K(e.receipt_no)}`:``}</strong>
                  <small>${K(Z(String(e.paid_at).slice(0,10)))} · ${K(Qc[e.method]||e.method)}${e.period_start?` · ${K(Z(e.period_start))}–${K(Z(e.period_end))}`:e.period?` · ${K(e.period)}`:``}${e.status===`voided`&&e.void_reason?` · Motivo: ${K(e.void_reason)}`:``}</small>
                </div>
                <div class="pay-history-actions">
                  <span class="pill ${e.status===`voided`?`pill-amber`:`success`}">${Q(e.amount)} · ${K(il(e.status))}</span>
                  <button class="btn ghost" data-receipt-payment="${K(e.id)}" aria-label="Descargar recibo ${K(e.receipt_no||e.id)}">Recibo</button>
                  ${e.status===`voided`?``:`<button class="btn ghost" data-void-payment="${K(e.id)}">Anular</button>`}
                </div>
              </li>
            `).join(``)}
        </ul>
      `:`<p class="empty-state">Aún no hay pagos registrados. Usa "Registrar pago" en cada alumno.</p>`}
    </article>
  `}function sl(){let e=W.payDialog;if(!e)return``;let t=W.dashboard,n=(t?.students||[]).find(t=>t.id===e.studentId),r=(t?.billingByStudent||new Map).get(e.studentId)||{},i=new Date().toISOString().slice(0,10),a=(n?.full_name||`A`).trim().slice(0,1).toUpperCase(),o=e.mode===`plan`;return`
    <div class="unit-assign-overlay" data-pay-overlay>
      <section class="unit-assign-dialog pay-dialog" role="dialog" aria-modal="true" aria-labelledby="pay-title">
        <button type="button" class="ficha-close" data-pay-close aria-label="Cerrar">✕</button>

        <header class="pay-dialog-head">
          <span class="pay-avatar pay-avatar-lg" aria-hidden="true">${K(a)}</span>
          <div class="pay-who">
            <span class="card-label">${o?`Plan de pago`:`Registrar pago`}</span>
            <h2 id="pay-title">${K(n?.full_name||`Alumno`)}</h2>
            <p class="muted">${K(n?.student_code||``)}${n?.group_name?` · ${K(n.group_name)}`:``}${!o&&r.plan?` · Plan ${K(Zc[r.plan]||r.plan)}`:``}</p>
          </div>
        </header>

        <form class="form pay-form" data-pay-form>
          ${o?`
            <div class="pay-plan-grid">
              ${Object.entries(Zc).map(([e,t])=>`
                <button type="button" class="pay-plan-option ${(r.plan||`mensual`)===e?`selected`:``}" data-pay-plan="${e}">
                  ${K(t)}
                </button>
              `).join(``)}
              <input type="hidden" name="plan" value="${K(r.plan||`mensual`)}">
            </div>
            <label class="field">
              <span>Cuota por periodo (pesos)</span>
              <input name="fee" type="number" min="0" step="0.01" value="${r.fee??``}" placeholder="ej. 250">
            </label>
            <label class="field">
              <span>Notas (opcional)</span>
              <textarea name="notes" placeholder="ej. beca del 20%, incluye material…">${K(r.notes||``)}</textarea>
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
                ${Object.entries(Qc).map(([e,t],n)=>`
                  <button type="button" class="pay-method-option ${n===0?`selected`:``}" data-pay-method="${e}">
                    ${K(t)}
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
  `}function cl(e,t){W.payDialog={studentId:e,mode:t,escHandler:null},ll()}function ll(){document.querySelectorAll(`[data-pay-overlay]`).forEach(e=>e.remove()),W.payDialog?.escHandler&&(W.payDialog.escHandler(),W.payDialog.escHandler=null);let e=sl();if(!e){document.body.classList.remove(`unit-assign-open`);return}document.body.insertAdjacentHTML(`beforeend`,e),document.body.classList.add(`unit-assign-open`);let t=document.querySelector(`[data-pay-overlay]`),n=()=>ul();t.querySelectorAll(`[data-pay-close]`).forEach(e=>{e.addEventListener(`click`,n)}),t.addEventListener(`click`,e=>{e.target===t&&n()}),W.payDialog.escHandler=Vs(t,n);let r=t.querySelector(`[data-pay-form]`);r&&r.addEventListener(`submit`,e=>pl(e,r)),t.querySelectorAll(`[data-pay-method]`).forEach(e=>{e.addEventListener(`click`,()=>{t.querySelectorAll(`[data-pay-method]`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`);let n=r?.querySelector(`input[name="method"]`);n&&(n.value=e.dataset.payMethod)})}),t.querySelectorAll(`[data-pay-plan]`).forEach(e=>{e.addEventListener(`click`,()=>{t.querySelectorAll(`[data-pay-plan]`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`);let n=r?.querySelector(`input[name="plan"]`);n&&(n.value=e.dataset.payPlan)})}),requestAnimationFrame(()=>{t.querySelector(`[data-pay-close]`)?.focus()})}function ul(){W.payDialog?.escHandler&&W.payDialog.escHandler(),W.payDialog=null,document.querySelectorAll(`[data-pay-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function dl(e){let t=e.dataset.voidPayment;if(!t||e.disabled)return;let n=window.prompt(`Motivo de la anulación (mínimo 3 caracteres):`,``);if(n===null)return;let r=n.trim();if(r.length<3){q(`Escribe un motivo de al menos 3 caracteres para anular el pago.`);return}e.disabled=!0,e.textContent=`Anulando…`;let{error:i}=await I.rpc(`app_void_payment`,{p_payment_id:t,p_reason:r});i?(q(i.message||`No se pudo anular el pago.`),e.disabled=!1,e.textContent=`Anular`):(J(`Pago anulado. El historial conserva el registro y el motivo.`),await Y(W.profile))}function fl(e){let t=(W.dashboard?.payments||[]).find(t=>t.id===e);if(!t){q(`No se encontró el pago para generar el recibo.`);return}let n=(W.dashboard?.students||[]).find(e=>e.id===t.student_id),r=(W.dashboard?.billingByStudent||new Map).get(t.student_id)||{};Ka({id:t.id,receipt_no:t.receipt_no,paid_at:Z(String(t.paid_at||``).slice(0,10)),amount:Q(t.amount),method:Qc[t.method]||t.method||`—`,period_start:t.period_start?Z(t.period_start):``,period_end:t.period_end?Z(t.period_end):``,period:t.period,status:t.status,student_name:n?.full_name||`Alumno`,student_code:n?.student_code||``,group_name:n?.group_name||``,plan:Zc[r.plan]||r.plan||``,void_reason:t.void_reason||``}),J(t.status===`voided`?`Recibo descargado. El documento marca el pago como anulado.`:`Recibo descargado.`)}async function pl(e,t){e.preventDefault();let n=W.payDialog;if(!n)return;let r=new FormData(t),i=t.querySelector(`button[type="submit"]`),a=t.querySelector(`[data-pay-error]`);i&&(i.disabled=!0);try{if(n.mode===`plan`){let e=String(r.get(`fee`)||``).trim(),{error:t}=await I.from(`student_billing`).upsert({student_id:n.studentId,plan:String(r.get(`plan`)||`mensual`),fee:e?Number(e):null,notes:String(r.get(`notes`)||``).trim()||null,updated_by:W.profile?.id??null,updated_at:new Date().toISOString()},{onConflict:`student_id`});if(t)throw t;ul(),J(`Plan de pago guardado.`)}else{let e=Number(r.get(`amount`));if(!e||e<=0)throw Error(`Escribe un monto válido.`);let t=String(r.get(`paid_at`)||nl(new Date)),i=rl(((W.dashboard?.billingByStudent||new Map).get(n.studentId)||{}).plan||`mensual`,t),{error:a}=await I.from(`payments`).insert({student_id:n.studentId,amount:e,paid_at:t,method:String(r.get(`method`)||`efectivo`),period:String(r.get(`period`)||``).trim()||null,notes:String(r.get(`notes`)||``).trim()||null,period_start:i?.start||null,period_end:i?.end||null,idempotency_key:crypto.randomUUID(),recorded_by:W.profile?.id??null});if(a)throw a.code===`23505`||/duplicad|idéntico/i.test(a.message||``)?Error(`Ya existe un pago idéntico para ese periodo. Revisa el historial antes de registrarlo otra vez.`):a;ul(),J(`Pago registrado con folio.`)}await Y(W.profile)}catch(e){i&&(i.disabled=!1),a&&(a.hidden=!1,a.textContent=e?.message||`No se pudo guardar.`)}}function ml(e){let t=e.tasks||[],n=e.groups||[],r=e.board||[],i=e.publishedUnits||e.units||[],a={pending:`Pendiente`,submitted:`Entregada`,late:`Tarde`},o=e=>{if(!e.due_at)return`Sin fecha`;let t=new Date(e.due_at),n=t.getTime()<Date.now()&&(e.submissions||[]).some(e=>e.status===`pending`),r=t.toLocaleDateString(`es-MX`,{day:`2-digit`,month:`short`});return n?`Venció ${r}`:`Entrega ${r}`};return`
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
              ${n.map(e=>`<option value="${K(e.id)}">${K(e.name)}</option>`).join(``)}
            </select>
          </label>
          <label class="field"><span>Materia</span>
            <select name="subject_id" required>
              ${r.map(e=>`<option value="${K(e.id)}">${K(e.name)}</option>`).join(``)}
            </select>
          </label>
          <label class="field"><span>Tipo</span>
            <select name="task_type">
              ${Object.entries(Ds).map(([e,t])=>`<option value="${e}" ${e===`project`?`selected`:``}>${K(t)}</option>`).join(``)}
            </select>
          </label>
          <label class="field"><span>Unidad (opcional)</span>
            <select name="unit_id">
              <option value="">Sin unidad</option>
              ${i.map(e=>`<option value="${K(e.id)}">${K(e.subject_name||e.subject_id||``)} · ${K(e.title)}</option>`).join(``)}
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
        <article class="task-card" data-task-card="${K(e.id)}">
          <div class="task-head">
            <div>
              <span class="card-label" style="color:${K(e.subject_color||`var(--brand)`)}">${K(e.subject_name||`Materia`)}</span>
              <h3>${K(e.title)}</h3>
              <div class="task-meta">
                <span class="pill pill-blue">${K(e.group_name||`Grupo`)}</span>
                <span class="pill ${e.due_at&&new Date(e.due_at)<new Date?`pill-red`:`pill-green`}">${K(o(e))}</span>
                <span class="pill">${K(e.max_score)} pts</span>
                <span class="pill" data-task-count="${K(e.id)}">${n}/${t.length} entregadas</span>
                ${e.unit_title?`<span class="pill">${K(e.unit_title)}</span>`:``}
              </div>
            </div>
          </div>
          ${e.instructions?`<p class="muted task-instructions">${K(e.instructions)}</p>`:``}
          <div class="task-students">
            ${t.length?t.map(t=>`
              <div class="task-student" data-task-row data-task-id="${K(e.id)}" data-student-id="${K(t.student_id)}" data-status="${K(t.status||`pending`)}">
                <div class="attendance-who">
                  <span class="avatar small">${K((t.name||`?`).slice(0,1).toUpperCase())}</span>
                  <div>
                    <strong>${K(t.name)}</strong>
                    <small>${K(t.code)}</small>
                  </div>
                </div>
                <div class="status-seg" role="group" aria-label="Entrega de ${K(t.name)}">
                  ${Object.entries(a).map(([e,n])=>`
                    <button class="status-btn ${(t.status||`pending`)===e?`active`:``}" type="button" data-task-status="${e}">${K(n)}</button>
                  `).join(``)}
                </div>
                <input class="task-score" type="number" min="0" max="${K(e.max_score)}" step="0.1" value="${t.score??``}" placeholder="Pts" data-task-score aria-label="Puntaje de ${K(t.name)}">
                <button class="btn-mini primary" type="button" data-save-task-submission>Guardar</button>
              </div>
            `).join(``):`<p class="empty-state">Este grupo no tiene alumnos activos.</p>`}
          </div>
        </article>
      `}).join(``):`<article class="card wide"><p class="empty-state">Aún no hay tareas. Crea la primera arriba.</p></article>`}
  `}function hl(e){let t=e.activity||[];return`
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
          <button class="filter-chip ${n===0?`active`:``}" type="button" data-activity-filter="${e}">${K(t)}</button>
        `).join(``)}
      </div>
      <div class="activity-feed" data-activity-feed>
        ${t.length?t.map(e=>`
          <div class="activity-item" data-activity-kind="${K(e.kind)}">
            <span class="activity-emoji" aria-hidden="true">${K(e.emoji||`•`)}</span>
            <div class="activity-body">
              <strong>${K(e.title||`Actividad`)}</strong>
              <span>${K(e.detail||``)}</span>
              <small>${K(e.name||``)}${e.student?` · ${K(e.student)}`:``} · ${K(Nc(e.ts))}</small>
            </div>
          </div>
        `).join(``):`<p class="empty-state">Todavía no hay actividad registrada. En cuanto haya ejercicios, entregas o calificaciones aparecerán aquí.</p>`}
      </div>
    </article>
  `}function gl(e){let t=e.students||[];return`
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
                <strong>${K(e.full_name)}</strong>
                <small>${K(e.student_code)} · ${(e.guardians||[]).length} ${(e.guardians||[]).length===1?`tutor`:`tutores`} vinculado(s)</small>
              </div>
              <div class="row">
                <button class="btn ghost" data-invite-toggle="${K(e.id)}">Invitar tutor</button>
                <button class="btn ghost" data-advise-student="${K(e.id)}">Avisar tutor</button>
                <button class="btn ghost" data-reissue-invite="${K(e.id)}" data-student-name="${K(e.full_name)}">Enlace de acceso</button>
              </div>
              <form class="form invite-form hidden" data-invite-form="${K(e.id)}" data-student-code="${K(e.student_code)}">
                <label class="field"><span>Nombre del tutor</span><input name="full_name" required placeholder="Nombre completo"></label>
                <label class="field"><span>Teléfono (WhatsApp)</span><input name="phone" type="tel" placeholder="52 1 55 1234 5678"></label>
                <label class="field"><span>Parentesco (opcional)</span><input name="relationship" placeholder="madre, padre…"></label>
                <label class="field"><span>Correo (opcional — si no tiene, se genera uno interno)</span><input name="email" type="email"></label>
                <div class="row">
                  <button class="btn primary" type="submit">Crear invitación</button>
                  <button class="btn ghost" type="button" data-invite-cancel="${K(e.id)}">Cancelar</button>
                </div>
              </form>
              <div class="invite-result hidden" data-invite-result="${K(e.id)}"></div>
              <div class="advise-form hidden" data-advise-form="${K(e.id)}"></div>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">No hay alumnos. Da de alta primero.</p>`}
    </article>
  `}var _l=[`var(--brand)`,`var(--brand-2)`,`#0ea5e9`,`#f59e0b`,`#10b981`,`#ef4444`,`#ec4899`,`#14b8a6`];function vl(e){let t=0;for(let n of String(e||``))t=t*31+n.charCodeAt(0)|0;return _l[Math.abs(t)%_l.length]}function yl(e){if(!e.student)return`
      <article class="card wide">
        <span class="card-label">Mi espacio</span>
        <h2>Sin expediente de alumno</h2>
        <p>Tu cuenta existe, pero aún no está vinculada a un grupo.</p>
      </article>
    `;let t=W.profile?.full_name||`Alumno`,n=t.split(` `)[0],r=t.trim().slice(0,1).toUpperCase(),i=e.profile||{},a=Number(!!i.personality?.completed_at)+Number(!!i.aptitude?.completed_at);return`
    <section class="student-hero">
      <div class="student-hero-copy">
        <span class="kicker">Hola, ${K(n)} 👋</span>
        <h1>Tu camino al bachillerato</h1>
        <p class="muted">${K(e.group?[e.group.level,e.group.schedule].filter(Boolean).join(` · `)||`Grupo sin horario`:`Tu grupo aún no está asignado.`)}</p>
        <div class="student-hero-chips">
          <span class="hero-chip">📚 ${xc(e.activeAssignments,`unidad activa`,`unidades activas`)}</span>
          <span class="hero-chip">🧭 ${a} de 2 tests completados</span>
          <span class="hero-chip">🎓 ${K(e.student.student_code)}</span>
        </div>
      </div>
      <div class="student-hero-actions">
        <span class="student-avatar" aria-hidden="true">${K(r)}</span>
        <a class="btn primary" href="./curso/">📚 Abrir curso completo</a>
        <a class="btn ghost" href="${qa}" target="_blank" rel="noopener">📖 Guía de examen</a>
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
        ${e.units.map(e=>{let t=e.progress?.status||`not_started`,n=bs[t]||`Sin empezar`,r=e.progress?.best_accuracy==null?null:`${Math.round(e.progress.best_accuracy)}%`,i=e.progress?.attempts_count||0;return`
            <article class="student-unit-card" style="--accent:${vl(e.unit?.subject_name)}">
              <div class="student-unit-top">
                <span class="student-unit-subject">${K(e.unit?.subject_name||`Materia`)}</span>
                <span class="pill ${t===`completed`||t===`mastered`?`success`:t===`in_progress`?`pill-blue`:``}">${K(n)}</span>
              </div>
              <h3>${K(e.unit?.title||`Unidad`)}</h3>
              <div class="student-unit-stats">
                ${r?`<span class="hero-chip">🎯 ${K(r)}</span>`:``}
                ${i>0?`<span class="hero-chip">🔄 ${i} ${i===1?`intento`:`intentos`}</span>`:``}
              </div>
              <button class="btn ghost" data-open-unit="${K(e.id)}">${t===`completed`||t===`mastered`?`Repasar →`:`Estudiar →`}</button>
            </article>
          `}).join(``)}
      </div>
    `:`<article class="card wide"><p class="empty-state">Tus unidades aparecerán aquí cuando el profesor las active. 🔒</p></article>`}

    ${Qa(e.exam)}
    ${Qo()}
    ${xl(e)}
  `}function bl(e,t){let n=t===`personality`?e?.personality:e?.aptitude;return n&&typeof n==`object`?n:null}function xl(e){let t=e.profile||{},n=bl(t,`personality`),r=bl(t,`vocational`),i=!!n?.completed_at,a=!!r?.completed_at,o=Array.isArray(t.interests)?t.interests:[],s=Array.isArray(t.aptitudes)?t.aptitudes:[],c=(Array.isArray(t.career_suggestions)?t.career_suggestions:[]).slice(0,3).map(e=>typeof e==`string`?e:e?.name).filter(Boolean);return`
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
                ${c.map(e=>`<span class="ficha-tag">🎓 ${K(e)}</span>`).join(``)}
              </div>
            </div>
          `:``}
          ${o.length?`
            <div class="test-summary-block">
              <span class="card-label">Tus intereses</span>
              <div class="ficha-tags">
                ${o.slice(0,8).map(e=>`<span class="ficha-tag">${K(e)}</span>`).join(``)}
              </div>
            </div>
          `:``}
          ${s.length?`
            <div class="test-summary-block">
              <span class="card-label">Tus aptitudes</span>
              <div class="ficha-tags">
                ${s.slice(0,8).map(e=>`<span class="ficha-tag">${K(e)}</span>`).join(``)}
              </div>
            </div>
          `:``}
        </div>
      `:``}
    </article>
  `}function Sl(e){let t={},n={};for(let r of ks){let i=e[r.id];if(i==null)continue;let a=r.reverse?5-i:i+1;t[r.dim]=(t[r.dim]||0)+a,n[r.dim]=(n[r.dim]||0)+1}let r={};for(let e of Object.keys(Os)){let i=n[e]||0,a=t[e]||0;r[e]=i?Math.max(0,Math.min(100,Math.round((a-i)/Math.max(1,i*4)*100))):0}return r}function Cl(e){let t=new Set,n={};for(let r of U){let i=Array.isArray(e[r.id])?e[r.id]:[];n[r.id]=i;for(let e of i){let n=r.options.find(t=>t.label===e);for(let e of n?.tags||[])t.add(e)}}let r=[...new Set([...e.series||[],...e.subjects||[],...e.activities||[]])],i=[...new Set(e.aptitudes||[])],a=[...new Set(e.workdays||[])],o=[...new Set(e.environment||[])],s=[...new Set(e.values||[])],c=[...new Set(e.future||[])],l={};for(let e of js)for(let t of e.tags)l[t]=(l[t]||0)+1;let u=js.map(e=>{let n=e.tags.filter(e=>t.has(e)),r=n.reduce((e,t)=>e+1/l[t],0);return{name:e.name,matches:n,weight:r}}).filter(e=>e.matches.length>0).sort((e,t)=>t.weight-e.weight||e.name.localeCompare(t.name)).slice(0,8),d=u[0]?.weight||1,f=u.map(e=>({name:e.name,score:Math.round(e.weight/d*100),matches:e.matches}));return{version:1,completed_at:new Date().toISOString(),interests:r,aptitudes:i,workdays:a,environment:o,values:s,future:c,tags:[...t],career_suggestions:f,career_choice:e.career_choice||null}}function wl(e){return Object.entries(e).sort((e,t)=>t[1]-e[1]).slice(0,2).map(([e])=>e)}function Tl(e){return e.kind===`personality`?ks.length:U.length+1}function El(e){return e.kind===`personality`?ks[e.step]||null:U[e.step]||null}function Dl(e){if(e.kind===`personality`){let t=ks[e.step];if(!t)return``;let n=e.answers[t.id];return`
      <div class="test-scale">
        ${As.map((e,t)=>`
          <button type="button" class="test-option ${n===t?`selected`:``}" data-test-option="${t}">
            <span aria-hidden="true">${e.emoji}</span>
            <strong>${K(e.label)}</strong>
          </button>
        `).join(``)}
      </div>
    `}if(e.step>=U.length){let t=Cl(e.answers).career_suggestions.map(e=>e.name),n=e.answers.career_choice||``;return`
      <div class="test-career-grid">
        ${t.map(e=>`
          <button type="button" class="test-option ${n===e?`selected`:``}" data-test-option="${K(e)}">
            <span aria-hidden="true">🎓</span>
            <strong>${K(e)}</strong>
          </button>
        `).join(``)}
        <button type="button" class="test-option ${n===`Aún no lo sé`?`selected`:``}" data-test-option="Aún no lo sé">
          <span aria-hidden="true">🤔</span>
          <strong>Aún no lo sé</strong>
        </button>
      </div>
      ${t.length?`<p class="hint">Estas carreras salen de tus intereses y aptitudes. Puedes elegir una o decir que aún no lo sabes.</p>`:``}
    `}let t=U[e.step],n=e.answers[t.id]||[],r=t.id===`values`?3:null;return`
    <div class="test-choice-grid">
      ${t.options.map(e=>`
        <button type="button" class="test-option ${n.includes(e.label)?`selected`:``}" data-test-option="${K(e.label)}">
          <span class="test-check" aria-hidden="true">${n.includes(e.label)?`✓`:`+`}</span>
          <strong>${K(e.label)}</strong>
        </button>
      `).join(``)}
    </div>
    <div class="test-choice-foot">
      <span class="pill">${n.length} seleccionados${r?` · máximo ${r}`:``}</span>
      <button type="button" class="btn-mini" data-test-clear ${n.length?``:`hidden`}>Limpiar selección</button>
    </div>
  `}function Ol(e){let t=e.result||{},n=e.kind===`personality`?t.personality:t.aptitude,r=W.dashboard?.profile||{};if(e.kind===`personality`){let e=n?.scores||{},t=wl(e).map(e=>Os[e]?.label).filter(Boolean);return`
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
          ${Object.entries(Os).map(([t,n])=>{let r=e[t]??0;return`
              <div class="test-score">
                <div class="test-score-head">
                  <span>${n.emoji} ${K(n.label)}</span>
                  <strong>${r}%</strong>
                </div>
                <div class="ficha-bar" aria-hidden="true">
                  <div class="ficha-bar-fill" style="--bar-color:${r>=70?`var(--good)`:r>=40?`var(--brand)`:`var(--amber)`};--bar-scale:${(r/100).toFixed(3)}"></div>
                </div>
                <small>${K(n.copy)}</small>
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
          <p class="muted">${s?`Elegiste ${K(s)} como una carrera que te llama la atención.`:`Estas son las carreras que mejor combinan con tus respuestas.`}</p>
        </div>
      </div>

      ${i.length?`
        <div class="test-career-results">
          <span class="card-label">Carreras sugeridas</span>
          ${i.map(e=>`
            <div class="test-career-row">
              <div>
                <strong>${K(e.name)}</strong>
                <small>${(e.matches||[]).map(e=>K(e)).join(` · `)||`Coincide con tu perfil`}</small>
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
            <div class="ficha-tags">${a.map(e=>`<span class="ficha-tag">${K(e)}</span>`).join(``)}</div>
          </div>
        `:``}
        ${o.length?`
          <div class="test-summary-block">
            <span class="card-label">Aptitudes que reconociste</span>
            <div class="ficha-tags">${o.map(e=>`<span class="ficha-tag">${K(e)}</span>`).join(``)}</div>
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
  `}function kl(e){let t=Tl(e),n=Math.min(e.step,t-1);if(e.kind===`personality`){let t=ks[n];return t?e.answers[t.id]!=null:!1}return n>=U.length?!!e.answers.career_choice:(e.answers[U[n].id]||[]).length>0}function Al(){let e=W.activeTest;if(!e)return``;if(e.saved)return`
      <div class="test-overlay" data-test-overlay>
        <section class="test-dialog" role="dialog" aria-modal="true" aria-labelledby="test-title">
          <button type="button" class="ficha-close" data-test-close aria-label="Cerrar test">✕</button>
          <div class="test-body">${Ol(e)}</div>
        </section>
      </div>
    `;let t=Tl(e),n=Math.min(e.step,t-1),r=Math.round((n+1)/t*100),i=El(e),a=e.kind===`vocational`&&n>=U.length,o=e.kind===`personality`?`Test de personalidad`:`Test de orientación vocacional`,s=e.kind===`personality`?`Pregunta ${n+1}`:a?`Tu carrera ideal`:U[n].title,c=e.kind===`personality`?i.text:a?`¿Cuál de estas carreras te llama más la atención?`:U[n].prompt,l=e.kind===`personality`?`Elige la opción que mejor te describa. No hay respuestas buenas o malas.`:a?`Puedes elegir una carrera o decir que aún no lo sabes.`:U[n].help,u=kl(e);return`
    <div class="test-overlay" data-test-overlay>
      <section class="test-dialog" role="dialog" aria-modal="true" aria-labelledby="test-title">
        <button type="button" class="ficha-close" data-test-close aria-label="Cerrar test">✕</button>

        <header class="test-header">
          <div>
            <span class="card-label">${K(o)}</span>
            <h2 id="test-title">${K(s)}</h2>
          </div>
          <span class="pill">${n+1} / ${t}</span>
        </header>

        <div class="test-progress" aria-hidden="true">
          <div class="test-progress-fill" style="width:${r}%"></div>
        </div>

        <div class="test-body">
          <h3 class="test-prompt">${K(c)}</h3>
          <p class="test-help">${K(l)}</p>
          ${Dl(e)}
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
  `}function jl(){let e=document.querySelector(`[data-test-overlay]`);if(!e)return;let t=W.activeTest;if(!t)return;let n=()=>Pl({refresh:!0});if(e.querySelectorAll(`[data-test-close]`).forEach(e=>{e.addEventListener(`click`,n)}),e.addEventListener(`click`,t=>{t.target===e&&n()}),W.activeTest.escHandler=Vs(e,n),t.saved){e.querySelectorAll(`[data-test-retry]`).forEach(e=>{e.addEventListener(`click`,()=>{let e=t.kind;Pl({silent:!0}),Nl(e)})});return}let r=()=>{let t=e.querySelector(`.test-dialog`);t&&(t.scrollTop=0)},i=()=>{let n=e.querySelector(`[data-test-next]`);if(!n)return;let r=kl(t);n.setAttribute(`aria-disabled`,r?`false`:`true`),r?n.removeAttribute(`data-pending`):n.setAttribute(`data-pending`,`1`)},a=()=>{let n=e.querySelector(`.test-choice-foot`);if(!n)return;let r=U[t.step];if(!r)return;let a=Array.isArray(t.answers[r.id])?t.answers[r.id]:[],o=r.id===`values`?3:null,s=n.querySelector(`.pill`);s&&(s.textContent=`${a.length} seleccionados${o?` · máximo ${o}`:``}`);let c=n.querySelector(`[data-test-clear]`);c&&(c.hidden=a.length===0),i()};e.querySelectorAll(`[data-test-option]`).forEach(n=>{n.addEventListener(`click`,()=>{let i=n.dataset.testOption,o=Tl(t);if(t.kind===`personality`){let e=ks[t.step];t.answers[e.id]=Number(i),t.step<o-1?(t.step+=1,Ml(),r()):Fl(null);return}if(t.step>=U.length){t.answers.career_choice=i,n.classList.add(`selected`);let r=e.querySelector(`[data-test-error]`);r&&(r.hidden=!1,r.textContent=`Guardando tus resultados…`),Fl(null);return}let s=U[t.step],c=Array.isArray(t.answers[s.id])?[...t.answers[s.id]]:[],l=c.indexOf(i),u=s.id===`values`?3:null;l>=0?c.splice(l,1):(!u||c.length<u)&&c.push(i),t.answers[s.id]=c;let d=c.includes(i);n.classList.toggle(`selected`,d);let f=n.querySelector(`.test-check`);f&&(f.textContent=d?`✓`:`+`),a()})});let o=e.querySelector(`[data-test-clear]`);o&&o.addEventListener(`click`,()=>{let n=U[t.step];n&&(t.answers[n.id]=[],e.querySelectorAll(`[data-test-option].selected`).forEach(e=>{e.classList.remove(`selected`);let t=e.querySelector(`.test-check`);t&&(t.textContent=`+`)}),a())}),e.querySelector(`[data-test-back]`)?.addEventListener(`click`,()=>{t.step>0&&(--t.step,Ml(),r())}),e.querySelector(`[data-test-next]`)?.addEventListener(`click`,async n=>{if(!kl(t)){let n=e.querySelector(`[data-test-error]`);n&&(n.hidden=!1,n.textContent=t.kind===`personality`?`Elige una opción antes de continuar.`:`Selecciona al menos una opción antes de continuar.`);return}let r=Tl(t);t.step<r-1?(t.step+=1,Ml()):await Fl(n.currentTarget)})}function Ml(){document.querySelectorAll(`[data-test-overlay]`).forEach(e=>e.remove()),W.activeTest?.escHandler&&(W.activeTest.escHandler(),W.activeTest.escHandler=null);let e=Al();e?(document.body.insertAdjacentHTML(`beforeend`,e),document.body.classList.add(`test-open`),jl(),requestAnimationFrame(()=>{document.querySelector(`[data-test-close]`)?.focus()})):document.body.classList.remove(`test-open`)}function Nl(e){W.activeTest={kind:e,step:0,answers:{},saved:!1,result:null,escHandler:null},Ml()}function Pl({silent:e=!1,refresh:t=!1}={}){W.activeTest?.escHandler&&W.activeTest.escHandler(),W.activeTest=null,document.querySelectorAll(`[data-test-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`test-open`),t&&!e&&$()}async function Fl(e){let t=W.activeTest;if(!t||t.saving||e?.disabled)return;t.saving=!0;let n=document.querySelector(`[data-test-error]`);n&&e&&(n.hidden=!0,n.textContent=``);let r;if(t.kind===`personality`){let e=Sl(t.answers);r={version:1,completed_at:new Date().toISOString(),scores:e,top:wl(e),answers:t.answers}}else r=Cl(t.answers);e&&(e.disabled=!0,e.textContent=`Guardando…`);let{data:i,error:a}=await I.rpc(`app_save_student_test`,{p_kind:t.kind,p_payload:r});a?(t.saving=!1,e&&(e.disabled=!1,e.textContent=`Guardar resultados`),n&&(n.hidden=!1,n.textContent=a.message||`No se pudieron guardar los resultados.`)):(t.saved=!0,t.result=i||{},t.savedAt=new Date().toISOString(),W.dashboard&&(W.dashboard.profile=W.dashboard.profile||{},t.kind===`personality`?W.dashboard.profile.personality=r:(W.dashboard.profile.aptitude=r,W.dashboard.profile.interests=r.interests,W.dashboard.profile.aptitudes=r.aptitudes,W.dashboard.profile.strengths=r.aptitudes,W.dashboard.profile.career_suggestions=r.career_suggestions,r.career_choice&&(W.dashboard.profile.career_choice=r.career_choice))),Ml())}function Il(e){let t=e.privacy||{},n=t.version||Ss,r=t.url||`/privacidad.html`,i=e.children||[],a=e.pending||[],o=i.length>0,s=i.length+a.length,c=s?a.length?`Pendiente`:`Aceptado`:`Sin vínculos`,l=s&&!a.length?`success`:``;return`
    <article class="card wide privacy-gate">
      <div class="card-heading">
        <div>
          <span class="card-label">Privacidad</span>
          <h2>Aviso de privacidad ${K(n)}</h2>
        </div>
        <span class="pill ${l}">${c}</span>
      </div>
      ${s?`
        <p>Para consultar la información de tus hijos, lee el aviso y confirma que lo entiendes. Sin ese consentimiento, la plataforma no muestra datos del alumno.</p>
      `:`
        <p>Cuando la institución vincule a tus hijos, aparecerán aquí. Antes de mostrar sus datos deberás leer y aceptar el aviso de privacidad.</p>
      `}
      <div class="row">
        <a class="btn ghost" href="${K(r)}" target="_blank" rel="noopener">Leer el aviso completo</a>
      </div>
      ${a.length?`
        <label class="checkbox-field">
          <input type="checkbox" data-consent-ack>
          <span>He leído y entiendo el <a href="${K(r)}" target="_blank" rel="noopener">aviso de privacidad</a> ${K(n)}.</span>
        </label>
        <ul class="data-list">
          ${a.map(e=>`
            <li>
              <div>
                <strong>${K(e.label)}</strong>
                <small>Sin consentimiento vigente. No se muestran sus datos.</small>
              </div>
              <button class="btn primary" data-consent-student="${K(e.id)}" disabled>Aceptar y ver datos</button>
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
            <h2>${xc(i.length,`alumno vinculado`,`alumnos vinculados`)}</h2>
          </div>
          <span class="pill">Solo lectura</span>
        </div>
        <ul class="data-list">
          ${i.map(e=>{let t=e.consent_accepted_at?Z(String(e.consent_accepted_at).slice(0,10)):``;return`
              <li>
                <div>
                  <strong>${K(e.full_name)}</strong>
                  <small>${K(e.student_code)} · ${K(e.group_name)}${t?` · Consentimiento del ${K(t)}`:``}</small>
                </div>
                <button class="btn ghost" data-revoke-consent="${K(e.id)}" data-revoke-name="${K(e.full_name)}">Revocar consentimiento</button>
              </li>
            `}).join(``)}
        </ul>
        <p class="muted"><small>Si revocas el consentimiento, dejaremos de mostrar la información del alumno hasta que vuelvas a aceptar el aviso.</small></p>
      </article>
    `:``}

    ${o?Ll(e):``}

    ${o?Qo():``}

    ${o?zl(e):``}
  `}function Ll(e){let t=e.children||[],n=e.academics||new Map;return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Seguimiento</span>
          <h2>Avance, calificaciones y tareas</h2>
        </div>
        <span class="pill">Solo lectura</span>
      </div>
      <p class="muted"><small>Ves lo que el personal registra para tus hijos. No puedes editar nada desde aquí.</small></p>
      ${t.map(e=>Rl(e,n.get(e.id)||{})).join(``)}
    </article>
  `}function Rl(e,t){let n=t.stats||{},r=t.progress||[],i=t.grades||[],a=t.attendance||[],o=t.observations||[],s=t.tasks||[],c=t.guidance||{},l=a.reduce((e,t)=>(e[t.status]=(e[t.status]||0)+1,e),{}),u=a.length,d=u?Math.round(((l.present||0)+(l.late||0))*100/u):null,f=r.filter(e=>e.status===`completed`||e.status===`mastered`).length,p=r.filter(e=>e.status===`in_progress`).length,m=s.filter(e=>!e.submission||e.submission.status===`pending`),h=Array.isArray(c.interests)?c.interests:[],g=Array.isArray(c.aptitudes)?c.aptitudes:[],_=Array.isArray(c.strengths)?c.strengths:[],v=Array.isArray(c.career_suggestions)?c.career_suggestions.map(e=>typeof e==`string`?e:e?.name).filter(Boolean):[],y=h.length||g.length||_.length||v.length||c.career_choice,b=e=>e.submission?{pending:`Pendiente`,submitted:`Entregada`,late:`Entregada tarde`}[e.submission.status]||`Pendiente`:`Sin registrar`,x=e=>({present:`Asistencia`,late:`Retardo`,excused:`Justificado`,absent:`Falta`})[e]||e;return`
    <section class="guardian-child">
      <div class="guardian-child-head">
        <div>
          <h3>${K(e.full_name)}</h3>
          <small>${K(e.student_code)} · ${K(e.group_name)}</small>
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
                    <strong>${K(e.unit_title)}</strong>
                    <small>${K(e.subject_name||`Materia`)} · ${K(bs[e.status]||e.status)}${e.best_accuracy==null?``:` · ${Math.round(e.best_accuracy)}%`}</small>
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
                    <strong>${K(e.assessment_name)}</strong>
                    <small>${K(e.subject_name||`Materia`)}${e.assessment_date?` · ${K(Z(e.assessment_date))}`:``}</small>
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
              ${Object.entries(l).map(([e,t])=>`<span class="hero-chip">${K(x(e))}: ${t}</span>`).join(``)}
            </div>
            <ul class="data-list compact">
              ${a.slice(0,6).map(e=>`
                <li>
                  <div>
                    <strong>${e.session_date?K(Z(e.session_date)):`Sesión`}</strong>
                    <small>${K(e.topic||`Sin tema registrado`)}${e.minutes_late?` · ${e.minutes_late} min tarde`:``}</small>
                  </div>
                  <span class="pill ${e.status===`absent`?`pill-amber`:``}">${K(x(e.status))}</span>
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
                    <strong>${K(e.title)}</strong>
                    <small>${K(e.subject_name||`Materia`)}${e.due_at?` · entrega ${K(Z(String(e.due_at).slice(0,10)))}`:``}</small>
                  </div>
                  <span class="pill ${e.submission?.status===`submitted`?`success`:e.submission?.status===`late`?`pill-amber`:``}">${K(b(e))}${e.submission?.score==null?``:` · ${e.submission.score}/${e.max_score??`—`}`}</span>
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
                    <strong>${K(e.category||`Observación`)}</strong>
                    <small>${K(Z(String(e.created_at).slice(0,10)))}</small>
                    <p>${K(e.body)}</p>
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
            ${c.career_choice?`<p><strong>Carrera de interés:</strong> ${K(c.career_choice)}</p>`:``}
            ${h.length?`<p><strong>Intereses:</strong> ${h.map(e=>K(e)).join(` · `)}</p>`:``}
            ${g.length?`<p><strong>Aptitudes:</strong> ${g.map(e=>K(e)).join(` · `)}</p>`:``}
            ${_.length?`<p><strong>Fortalezas:</strong> ${_.map(e=>K(e)).join(` · `)}</p>`:``}
            ${v.length?`<p><strong>Carreras sugeridas:</strong> ${v.slice(0,6).map(e=>K(e)).join(` · `)}</p>`:``}
          `:`<p class="empty-state">El alumno todavía no ha completado los test de orientación.</p>`}
        </div>
      </div>
    </section>
  `}function zl(e){let t=e.billingByStudent||new Map,n=e.billingStatusByStudent||new Map;return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Cuentas</span>
          <h2>Plan y pagos de tus hijos</h2>
        </div>
        <span class="pill">Solo lectura</span>
      </div>
      ${e.children.map(r=>{let i=t.get(r.id)||{},a=n.get(r.id)||{},o=i.plan||a.plan||`mensual`,s=el(r.id,e.payments),c=tl(r.id,e.payments),l=$c(r.id,e.payments).slice().sort((e,t)=>String(t.paid_at).localeCompare(String(e.paid_at))).slice(0,3),u=a.period_start?{start:a.period_start,end:a.period_end}:rl(o),d=a.balance==null?null:Number(a.balance),f=d==null?`is-none`:d>0?`is-debt`:d<0?`is-credit`:`is-even`,p=d==null?`Sin datos`:d>0?`Por pagar`:d<0?`A favor`:`Al corriente`;return`
          <div class="guardian-pay">
            <div class="guardian-pay-head">
              <div>
                <strong>${K(r.full_name)}</strong>
                <small>${K(r.student_code)}</small>
              </div>
              <div class="pay-cells">
                <span class="pill">${K(Zc[o]||o)}${i.fee?` · ${Q(i.fee)}`:``}</span>
                ${a.status?`<span class="pill ${a.status===`al corriente`||a.status===`beca`?`success`:`pill-amber`}">${K(al(a.status))}</span>`:``}
                <span class="pill ${s>0?`success`:``}">Pagado: ${Q(s)}</span>
                ${c?`<span class="pill">Último pago: ${K(Z(String(c.paid_at).slice(0,10)))}</span>`:`<span class="pill">Sin pagos registrados</span>`}
              </div>
            </div>
            <p class="muted pay-card-period"><small>📆 Periodo: ${u&&u.start?`${K(Z(u.start))} – ${K(Z(u.end))}`:`Sin periodo definido`}</small></p>
            <div class="pay-balance pay-balance-compact ${f}">
              <div>
                <span class="card-label">Saldo del periodo</span>
                <strong>${d==null?`—`:Q(Math.abs(d))}</strong>
              </div>
              <span class="pay-balance-tag">${p}</span>
            </div>
            <p class="muted"><small>Total histórico registrado: ${Q(s)} · Los pagos anulados no se contabilizan.</small></p>
            ${l.length?`
              <ul class="data-list">
                ${l.map(e=>`
                  <li>
                    <div>
                      <strong>${Q(e.amount)}${e.receipt_no?` · ${K(e.receipt_no)}`:``}</strong>
                      <small>${K(Z(String(e.paid_at).slice(0,10)))} · ${K(Qc[e.method]||e.method)}${e.period_start?` · ${K(Z(e.period_start))}–${K(Z(e.period_end))}`:``}${e.status===`voided`?` · Anulado`:``}</small>
                    </div>
                    <div class="pay-history-actions">
                      <span class="pill ${e.status===`voided`?`pill-amber`:`success`}">${K(il(e.status))}</span>
                      <button class="btn ghost" data-receipt-payment="${K(e.id)}" aria-label="Descargar recibo ${K(e.receipt_no||e.id)}">Recibo</button>
                    </div>
                  </li>
                `).join(``)}
              </ul>
            `:``}
            ${i.notes?`<p class="muted"><small>📝 ${K(i.notes)}</small></p>`:``}
            <p class="muted"><small>¿Algo no cuadra? Escribe a la institución para revisar tu estado de cuenta.</small></p>
          </div>
        `}).join(``)}
    </article>
  `}function Bl(e){return W.dashboardError?`
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>No se pudo cargar</h2>
        <p>${K(W.dashboardError)}</p>
      </article>
    `:W.dashboard?W.dashboard.kind===`admin`?Sc(W.dashboard):W.dashboard.kind===`teacher`?Rc(W.dashboard):W.dashboard.kind===`guardian`?Il(W.dashboard):yl(W.dashboard):`
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>Cargando datos…</h2>
        <p>Estamos consultando tu grupo y tu avance.</p>
      </article>
    `}function Vl(e){if(e.role===`admin`||e.role===`teacher`)return Rc(W.dashboard);let t=vs[e.role]||`Usuario`,n=e.full_name||e.username||e.email||`Sin nombre`,r=e.username?`@${e.username}`:e.email||`Sin identificador`;return`
    <div class="shell">
      ${Us()}
      <main id="main-content" tabindex="-1" class="dashboard">
        <section class="welcome">
          <div>
            <span class="kicker">Sesión activa</span>
            <h1>Hola, ${K(n.split(` `)[0])}</h1>
            <p class="muted">${K(ys[e.role]||`Tu cuenta está conectada.`)}</p>
          </div>
          <div class="identity">
            <span class="avatar">${K(n.slice(0,1).toUpperCase())}</span>
            <div>
              <strong>${K(n)}</strong>
              <small>${K(t)} · ${K(r)}</small>
            </div>
          </div>
        </section>

        ${Hs()}

        <div class="grid">
          <article class="card">
            <span class="card-label">Conexión</span>
            <h2>Supabase conectado</h2>
            <p>La sesión y el perfil se cargaron desde la base. Entorno: <strong>${K(Ma)}</strong>.</p>
            <span class="pill success">Operativo</span>
          </article>

          <article class="card">
            <span class="card-label">Rol</span>
            <h2>${K(t)}</h2>
            <p>${K(ys[e.role]||``)}</p>
            <span class="pill">${K(e.role)}</span>
          </article>

          ${Bl(e)}
        </div>

        <div class="row end">
          <button class="btn ghost" id="logout-btn">Cerrar sesión</button>
        </div>
      </main>
      ${Ws()}
    </div>
  `}function Hl({total:e,page:t,target:n,pageSize:r=ws}){let i=Math.max(1,Math.ceil(e/r)),a=Math.min(Math.max(1,t),i),o=e?(a-1)*r+1:0,s=Math.min(a*r,e);return`
    <div class="pagination" aria-label="Paginación">
      <span>Mostrando ${s-o+1} de ${e} · filas ${o}–${s}</span>
      <div class="row">
        <button class="btn-mini" data-pagination="${K(n)}" data-page="${a-1}" ${a<=1?`disabled`:``} aria-label="Página anterior">← Anterior</button>
        <span aria-live="polite">Página ${a} de ${i}</span>
        <button class="btn-mini" data-pagination="${K(n)}" data-page="${a+1}" ${a>=i?`disabled`:``} aria-label="Página siguiente">Siguiente →</button>
      </div>
    </div>
  `}function Ul(e){return K(e).replaceAll(`
`,`<br>`)}function Wl(e){return bs[e?.status]||`Sin empezar`}function Gl(e,t){return t?e===t.correct_index?`correct`:e===t.selected_index&&!t.is_correct?`incorrect`:``:``}function Kl(e,t,n){let r=Array.isArray(e.options)?e.options:[],i=n.exerciseKey?`data-answer-kind="exercise" data-answer-key="${K(n.exerciseKey)}"`:`data-answer-kind="quiz" data-answer-part="${K(n.part)}" data-answer-key="${K(n.questionKey)}"`,a=n.exerciseKey?`exercise:${n.exerciseKey}`:`quiz:${n.part}:${n.questionKey}`;return`
    <article class="card wide question-card">
      <span class="card-label">${K(n.title||`Pregunta`)}</span>
      <h2>${K(e.prompt||`Pregunta`)}</h2>
      <div class="options">
        ${r.map((e,n)=>`
          <button class="option-btn ${Gl(n,t)}"
            ${i}
            data-answer-index="${n}">
            ${K(e)}
          </button>
        `).join(``)}
      </div>
      ${t?`
        <div class="answer-box ${t.is_correct?`correct`:`incorrect`}">
          <strong>${t.is_correct?`Correcto`:`Todavía no`}</strong>
          ${t.explanation?`<p>${K(t.explanation)}</p>`:``}
          <div class="answer-foot">
            <small>Intento ${t.attempt_no||1}</small>
            <button class="btn-mini" data-retry-question="${K(a)}">↺ Reintentar</button>
          </div>
        </div>
      `:``}
    </article>
  `}function ql(e,t){let n=String(e.key||``);return e.type===`exercise`?Kl(e,t[`exercise:${n}`],{title:`Ejercicio`,exerciseKey:n}):`
    <article class="card wide unit-section">
      <span class="card-label">${e.type===`example`?`Ejemplo`:`Lección`}</span>
      <h2>${K(e.title||`Sección`)}</h2>
      <p class="unit-body">${Ul(e.body||``)}</p>
    </article>
  `}function Jl(e,t){let n=String(e.key||``),r=!!t;return`
    <article class="card wide question-card">
      <span class="card-label">Ejercicio ${K(n.replace(`ej-`,``))}</span>
      <h2>${K(e.prompt||`Ejercicio`)}</h2>
      ${e.figure?`<div class="figure">${K(e.figure)}</div>`:``}
      <button class="btn ghost reveal-btn" data-reveal="${K(n)}">Ver respuesta</button>
      <div class="flashcard-answer hidden" data-flashcard-answer="${K(n)}">
        <p class="unit-body"><strong>Respuesta:</strong> ${K(e.answer||``)}</p>
        ${(e.steps||[]).length?`
          <ol class="steps">
            ${e.steps.map(e=>`<li>${K(e)}</li>`).join(``)}
          </ol>
        `:``}
        ${(e.acceptedAnswers||[]).length?`
          <p class="muted"><small>También vale: ${e.acceptedAnswers.map(K).join(` · `)}</small></p>
        `:``}
        <div class="row">
          <button class="btn primary" data-answer-kind="flashcard"
            data-answer-key="${K(n)}" data-answer-text="${K(e.answer)}"
            ${r?`disabled`:``}>Lo acerté</button>
          <button class="btn ghost" data-answer-kind="flashcard"
            data-answer-key="${K(n)}" data-answer-text="x"
            ${r?`disabled`:``}>Todavía no</button>
        </div>
      </div>
      ${t?`
        <div class="answer-box ${t.is_correct?`correct`:`incorrect`}">
          <strong>${t.is_correct?`Correcto`:`Todavía no`}</strong>
          ${t.explanation?`<p>${K(t.explanation)}</p>`:``}
          <small>Intento ${t.attempt_no||1}</small>
        </div>
      `:``}
    </article>
  `}function Yl(e,t,n){return`
    <article class="card wide unit-section">
      <span class="card-label">${K(e)}</span>
      <h2>${K(t)}</h2>
      <p class="unit-body">${Ul(n)}</p>
    </article>
  `}function Xl(e,t){return`
    <article class="card wide unit-section">
      <span class="card-label">Ejemplo ${t+1}</span>
      <h2>${K(e.prompt||`Ejemplo`)}</h2>
      ${(e.steps||[]).length?`
        <ol class="steps">
          ${e.steps.map(e=>`<li>${K(e)}</li>`).join(``)}
        </ol>
      `:``}
      ${e.result?`<p class="unit-body"><strong>Resultado:</strong> ${K(e.result)}</p>`:``}
    </article>
  `}function Zl(e){if(!e||typeof e!=`object`)return``;let t=e.intro,n=Array.isArray(e.bloques)?e.bloques:[];return(t?`
    <article class="card wide unit-section">
      <span class="card-label">Capítulo</span>
      <h2>${K(t.t||`Antes de empezar`)}</h2>
      ${t.p1?`<p class="unit-body">${Ul(t.p1)}</p>`:``}
      ${t.p2?`<p class="unit-body">${Ul(t.p2)}</p>`:``}
      ${(t.items||[]).length?`
        <ul class="steps">
          ${t.items.map(e=>`<li>${K(String(e))}</li>`).join(``)}
        </ul>
      `:``}
    </article>
  `:``)+n.map(e=>`
    <article class="card wide unit-section">
      <span class="card-label">${K(e.rotulo||`Bloque`)}</span>
      <h2>${K(e.nombre||`Sección del capítulo`)}</h2>
      ${e.intro?`<p class="unit-body">${Ul(e.intro)}</p>`:``}
      ${(e.cards||[]).map(e=>`
        <div class="chapter-card">
          <strong>${K(e.titulo||``)}</strong>
          ${e.pill?`<span class="pill">${K(e.pill)}</span>`:``}
          ${e.hace?`<p class="unit-body">${Ul(e.hace)}</p>`:``}
        </div>
      `).join(``)}
    </article>
  `).join(``)}function Ql(e){let t=Array.isArray(e.theory)?e.theory:[],n=Array.isArray(e.guides)?e.guides:[],r=Array.isArray(e.examples)?e.examples:[],i=Array.isArray(e.commonMistakes)?e.commonMistakes:[],a=Array.isArray(e.exercises)?e.exercises:[],o=e.unit?.hook||``,s=e.unit?.truco||``;return[o?Yl(`Para empezar`,`¿De qué trata?`,o):``,t.map((e,t)=>Yl(`Concepto`,`Idea ${t+1}`,e)).join(``),s?Yl(`Truco`,`Recuerda`,s):``,n.map((e,t)=>Yl(`Guía práctica`,`Actividad ${t+1}`,e)).join(``),r.map(Xl).join(``),i.map(e=>`
      <article class="card wide unit-section mistake-card">
        <span class="card-label">Error común</span>
        <h2>${K(e.title||`Cuidado`)}</h2>
        <p class="unit-body">${Ul(e.detail||``)}</p>
      </article>
    `).join(``),Zl(e.chapter),a.map(e=>Jl(e,W.unitResults[`exercise:${e.key}`])).join(``)].join(``)}function $l(e,t){let n=Array.isArray(e.quiz)?e.quiz:[],r=e.reto&&typeof e.reto==`object`?e.reto:null;return[...n.map(e=>{let n=e.part||`tipo`,r=String(e.key||``);return Kl(e,t[`quiz:${n}:${r}`],{title:xs[n]||`Quiz`,part:n,questionKey:r})}),r?Kl(r,t[`quiz:reto:${String(r.key||``)}`],{title:`Reto final`,part:`reto`,questionKey:String(r.key||``)}):``].join(``)}function eu(e){if(!e)return``;if(e.loading)return`
      <div class="shell">
        ${Us()}
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
      ${Us()}
      <main id="main-content" tabindex="-1" class="dashboard">
        <section class="welcome">
          <div>
            <span class="kicker">Unidad activa</span>
            <h1>${K(n?.title||`Unidad`)}</h1>
            <p class="muted">${K(s||`Contenido de la unidad.`)}</p>
          </div>
          <div class="identity">
            <span class="avatar">${K((n?.title||`U`).slice(0,1).toUpperCase())}</span>
            <div>
              <strong>${K(l)}</strong>
              <small>${K(Wl(a))}${c?` · ${c} min`:``}</small>
            </div>
          </div>
        </section>

        ${Hs()}

        <div class="grid">
          <article class="card wide">
            <div class="card-heading">
              <div>
                <span class="card-label">Sesión</span>
                <h2>${K(n?.title||`Unidad`)}</h2>
              </div>
              <span class="pill ${o?`success`:``}">${K(Wl(a))}</span>
            </div>
            <p>${K(l)}${c?` · ${c} minutos estimados`:``}${e.version?.version?` · versión ${e.version.version}`:``}</p>
            ${t.instructions?`<p class="unit-body">${Ul(t.instructions)}</p>`:``}
          </article>

          ${i?r.sections.map(e=>ql(e,W.unitResults)).join(``):Ql(r)}
          ${$l(r,W.unitResults)}
          ${p?`<p class="hint">Política de intentos: ${K(p)}.</p>`:``}

          ${u?``:`<article class="card wide"><p class="empty-state">Esta versión todavía no tiene ejercicios.</p></article>`}

          ${e.requirements?`
            <article class="card wide requirement-card" role="status" aria-live="polite">
              <span class="card-label">Requisitos de completado</span>
              <p>${K(e.requirements.message)}</p>
              <small class="muted">Mínimo ${K(String(e.requirements.rules?.min_exercises_pct??60))} % de ejercicios y ${K(String(e.requirements.rules?.min_quiz_accuracy??70))} % de precisión en el quiz.</small>
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
  `}function tu(){G.innerHTML=eu(W.unitView);let e=G.querySelector(`#back-btn`);e&&e.addEventListener(`click`,nu);let t=G.querySelector(`#complete-unit-btn`);t&&t.addEventListener(`click`,ou),G.querySelectorAll(`[data-answer-key]`).forEach(e=>{e.addEventListener(`click`,au)}),G.querySelectorAll(`[data-retry-question]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.retryQuestion;t&&(delete W.unitResults[t],tu())})}),G.querySelectorAll(`[data-reveal]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.reveal,n=G.querySelector(`[data-flashcard-answer="${t}"]`);n&&(n.classList.toggle(`hidden`),e.textContent=n.classList.contains(`hidden`)?`Ver respuesta`:`Ocultar respuesta`)})}),qs()}function nu(){W.view=`dashboard`,W.unitView=null,W.unitResults={},W.error=``,W.notice=``,$(),Y(W.profile)}async function ru(e){let t=(W.dashboard?.units||[]).find(t=>t.id===e);if(t){W.view=`unit`,W.unitResults={},W.error=``,W.notice=``,W.unitView={assignment:t,unit:t.unit,version:null,progress:t.progress,requirements:null,quizPolicy:null,loading:!0},tu();try{let[e,n,r,i]=await Promise.all([I.from(`unit_versions`).select(`content,version`).eq(`id`,t.unit_version_id).maybeSingle(),I.rpc(`app_start_unit`,{p_assignment_id:t.id}),I.rpc(`app_unit_requirements`,{p_assignment_id:t.id}),I.rpc(`app_quiz_policy`)]);if(X(e.error),X(n.error),X(r.error),X(i.error),W.view!==`unit`||W.unitView?.assignment.id!==t.id)return;W.unitView={assignment:t,unit:t.unit,version:e.data,progress:n.data||t.progress,requirements:r.data,quizPolicy:i.data,loading:!1}}catch(e){if(W.view!==`unit`||W.unitView?.assignment.id!==t.id)return;console.error(`open_unit_error`,e?.message||e),q(`No se pudo abrir la unidad. ${e?.message||``}`.trim()),W.unitView={...W.unitView,loading:!1}}tu()}}async function iu(){let e=W.unitView;if(!e||e.loading)return;let{data:t,error:n}=await I.rpc(`app_unit_requirements`,{p_assignment_id:e.assignment.id});n||W.view===`unit`&&W.unitView?.assignment.id===e.assignment.id&&(W.unitView={...W.unitView,requirements:t},tu())}async function au(e){let t=e.currentTarget,n=W.unitView;if(!n||n.loading||t.disabled)return;let r=t.dataset.answerKind,i=t.dataset.answerKey,a=t.dataset.answerPart||`reto`,o=r===`exercise`||r===`flashcard`?`exercise:${i}`:`quiz:${a}:${i}`;if(!i)return;if(r===`flashcard`){W.error=``,W.notice=``,t.disabled=!0;try{let{data:e,error:r}=await I.rpc(`app_record_exercise_attempt`,{p_assignment_id:n.assignment.id,p_exercise_key:i,p_answer:{text:t.dataset.answerText||`x`},p_duration_ms:null});if(r)throw r;if(W.view!==`unit`||W.unitView?.assignment.id!==n.assignment.id)return;W.unitResults[o]=e,e.progress&&(W.unitView.progress=e.progress)}catch{if(W.view!==`unit`||W.unitView?.assignment.id!==n.assignment.id)return;q(`No se pudo guardar tu respuesta. Revisa la conexión e intenta de nuevo.`)}tu();return}let s=Number(t.dataset.answerIndex);if(!Number.isNaN(s)){W.error=``,W.notice=``,t.disabled=!0;try{let{data:e,error:t}=r===`exercise`?await I.rpc(`app_record_exercise_attempt`,{p_assignment_id:n.assignment.id,p_exercise_key:i,p_answer:{index:s},p_duration_ms:null}):await I.rpc(`app_submit_quiz_answer`,{p_assignment_id:n.assignment.id,p_part:a,p_question_key:i,p_selected_index:s});if(t)throw t;if(W.view!==`unit`||W.unitView?.assignment.id!==n.assignment.id)return;W.unitResults[o]={...e,selected_index:s},e.progress&&(W.unitView.progress=e.progress)}catch{if(W.view!==`unit`||W.unitView?.assignment.id!==n.assignment.id)return;q(`No se pudo guardar tu respuesta. Revisa la conexión e intenta de nuevo.`)}tu(),iu()}}async function ou(){let e=W.unitView;if(!e||e.loading)return;let t=G.querySelector(`#complete-unit-btn`);t&&(t.disabled=!0,t.textContent=`Guardando…`),W.error=``,W.notice=``;let{data:n,error:r}=await I.rpc(`app_complete_unit`,{p_assignment_id:e.assignment.id});r?(q(r.message||`No se pudo completar la unidad. Revisa la conexión e intenta de nuevo.`),tu()):W.view===`unit`&&W.unitView?.assignment.id===e.assignment.id&&(W.unitView.progress=n,J(`Unidad marcada como completada.`),tu())}function su(e,t){let n=(W.dashboard?.groups||[]).find(t=>t.id===e),r=new Set((t?.overrides||[]).filter(e=>e.status===`closed`).map(e=>e.student_id));return(n?.students||[]).map(e=>({id:e.id,full_name:e.full_name||`Alumno sin nombre`,student_code:e.student_code||``,selected:!r.has(e.id)}))}function cu({mode:e,unitId:t,versionId:n,groupId:r,assignmentId:i=null}){let a=W.dashboard,o=i?(a?.assignments||[]).find(e=>e.id===i):null,s=r||o?.group_id,c=t||o?.unit_id,l=n||o?.unit_version_id,u=(a?.groups||[]).find(e=>e.id===s);if(!u||!c){q(`No se pudo identificar la unidad o el grupo.`);return}let d=(a?.publishedUnits||[]).find(e=>e.id===c),f=su(s,o);W.unitAssign={mode:e,unitId:c,versionId:l||Jc(a,c),groupId:s,assignmentId:i,unitTitle:d?.title||`Unidad`,groupName:u.name,students:f,closesAt:o?.closes_at?String(o.closes_at).slice(0,10):``,saving:!1,escHandler:null},du()}function lu(){let e=W.unitAssign;if(!e)return``;let t=e.students.filter(e=>e.selected).length,n=t===e.students.length,r=t===0;return`
    <div class="unit-assign-overlay" data-unit-assign-overlay>
      <section class="unit-assign-dialog" role="dialog" aria-modal="true" aria-labelledby="unit-assign-title">
        <button type="button" class="ficha-close" data-unit-assign-close aria-label="Cerrar">✕</button>

        <header class="unit-assign-head">
          <span class="card-label">${e.mode===`activate`?`Activar unidad`:`Alumnos de la unidad`}</span>
          <h2 id="unit-assign-title">${K(e.unitTitle)}</h2>
          <p class="muted">${K(e.groupName)} · elige a qué alumnos se activa esta unidad.</p>
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
                <input type="checkbox" data-unit-assign-student="${K(e.id)}" ${e.selected?`checked`:``}>
                <span class="unit-assign-avatar" aria-hidden="true">${K((e.full_name||`A`).trim().slice(0,1).toUpperCase())}</span>
                <span class="unit-assign-name">
                  <strong>${K(e.full_name)}</strong>
                  <small>${K(e.student_code||`Sin matrícula`)}</small>
                </span>
                <span class="unit-assign-state">${e.selected?`Incluido`:`Excluido`}</span>
              </label>
            `).join(``)}
          </div>
        `:`<p class="ficha-empty">Este grupo todavía no tiene alumnos.</p>`}

        <label class="field unit-assign-date">
          <span>Fecha de cierre (opcional)</span>
          <input type="date" data-unit-assign-closes value="${K(e.closesAt)}">
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
  `}function uu(){let e=document.querySelector(`[data-unit-assign-overlay]`),t=W.unitAssign;if(!e||!t)return;let n=()=>fu();e.querySelectorAll(`[data-unit-assign-close]`).forEach(e=>{e.addEventListener(`click`,n)}),e.addEventListener(`click`,t=>{t.target===e&&n()}),t.escHandler=Vs(e,n),e.querySelectorAll(`[data-unit-assign-student]`).forEach(e=>{e.addEventListener(`change`,()=>{let n=t.students.find(t=>t.id===e.dataset.unitAssignStudent);n&&(n.selected=e.checked),du()})}),e.querySelector(`[data-unit-assign-all]`)?.addEventListener(`click`,()=>{t.students.forEach(e=>{e.selected=!0}),du()}),e.querySelector(`[data-unit-assign-none]`)?.addEventListener(`click`,()=>{t.students.forEach(e=>{e.selected=!1}),du()});let r=e.querySelector(`[data-unit-assign-closes]`);r&&r.addEventListener(`change`,()=>{t.closesAt=r.value}),e.querySelector(`[data-unit-assign-save]`)?.addEventListener(`click`,e=>{pu(e.currentTarget)})}function du(){document.querySelectorAll(`[data-unit-assign-overlay]`).forEach(e=>e.remove()),W.unitAssign?.escHandler&&(W.unitAssign.escHandler(),W.unitAssign.escHandler=null);let e=lu();e?(document.body.insertAdjacentHTML(`beforeend`,e),document.body.classList.add(`unit-assign-open`),uu(),requestAnimationFrame(()=>{document.querySelector(`[data-unit-assign-close]`)?.focus()})):document.body.classList.remove(`unit-assign-open`)}function fu(){W.unitAssign?.escHandler&&W.unitAssign.escHandler(),W.unitAssign=null,document.querySelectorAll(`[data-unit-assign-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function pu(e){let t=W.unitAssign;if(!t||t.saving)return;let n=t.students.filter(e=>e.selected);if(!n.length)return;let r=document.querySelector(`[data-unit-assign-error]`),i=()=>{t.saving=!1,e&&(e.disabled=!1,e.textContent=t.mode===`activate`?`Activar para ${n.length} ${n.length===1?`alumno`:`alumnos`}`:`Guardar cambios`)};r&&(r.hidden=!0,r.textContent=``),t.saving=!0,e&&(e.disabled=!0,e.textContent=`Guardando…`);let a=t.closesAt?`${t.closesAt}T23:59:59`:null;try{let e=t.assignmentId;if(t.mode===`activate`){if(!t.versionId)throw Error(`La unidad no tiene una versión publicada.`);let{data:n,error:r}=await I.from(`unit_assignments`).insert({group_id:t.groupId,unit_id:t.unitId,unit_version_id:t.versionId,status:`active`,visible:!0,opens_at:new Date().toISOString(),closes_at:a,created_by:W.profile?.id??null}).select(`id`).single();if(r)throw r;e=n.id}else{let{error:t}=await I.from(`unit_assignments`).update({closes_at:a}).eq(`id`,e);if(t)throw t}let r=t.students.filter(e=>!e.selected);if(r.length){let t=r.map(t=>({assignment_id:e,student_id:t.id,status:`closed`,created_by:W.profile?.id??null})),{error:n}=await I.from(`student_unit_overrides`).upsert(t,{onConflict:`assignment_id,student_id`});if(n)throw n}if(t.mode===`manage`&&n.length){let{error:t}=await I.from(`student_unit_overrides`).update({status:`active`}).eq(`assignment_id`,e).in(`student_id`,n.map(e=>e.id));if(t)throw t}let i=n.length;fu(),J(t.mode===`activate`?`Unidad activada para ${i} ${i===1?`alumno`:`alumnos`}.`:`Alumnos de la unidad actualizados.`),await Y(W.profile)}catch(e){i(),r&&(r.hidden=!1,r.textContent=e?.message||`No se pudo guardar la activación.`)}}function mu(e){let[t,n]=String(e.dataset.activateUnit||``).split(`:`),r=e.dataset.unitGroup||e.closest(`[data-group-id]`)?.dataset.groupId||W.subjectsGroupId;!t||!n||!r||e.disabled?q(`No se pudo identificar la unidad o el grupo.`):(W.error=``,W.notice=``,cu({mode:`activate`,unitId:t,versionId:n,groupId:r}))}function hu(e){let t=e.dataset.manageAssignment,n=e.dataset.unitGroup;t&&!e.disabled&&(W.error=``,W.notice=``,cu({mode:`manage`,assignmentId:t,groupId:n}))}async function gu(e,t){let n=e.dataset.closeAssignment||e.dataset.reopenAssignment;if(!n||e.disabled)return;let r=t===`active`;W.error=``,W.notice=``,e.disabled=!0,e.textContent=r?`Reabriendo…`:`Cerrando…`;try{let{error:e}=await I.from(`unit_assignments`).update({status:t,...r?{closes_at:null,opens_at:new Date().toISOString()}:{}}).eq(`id`,n);if(e)throw e;J(r?`Unidad reabierta. Los alumnos pueden continuar.`:`Unidad cerrada. El progreso de los alumnos se conserva.`),await Y(W.profile)}catch(t){q(t?.message||`No se pudo ${r?`reabrir`:`cerrar`} la unidad.`),e.disabled=!1,e.textContent=r?`Reabrir`:`Cerrar`}}function _u(e){return Array.isArray(e)?e.filter(Boolean).map(vu).join(`, `):``}function vu(e){return typeof e==`string`?e:e&&typeof e==`object`&&e.name?e.name:``}function yu(e){let t=(Array.isArray(e)?e:[]).map(e=>({name:typeof e==`string`?e:e?.name,matches:Array.isArray(e?.matches)?e.matches.map(String):[]})).filter(e=>!!e.name),n={};for(let e of js)for(let t of e.tags)n[t]=(n[t]||0)+1;let r=t.map(e=>({...e,weight:e.matches.reduce((e,t)=>e+1/(n[t]||1),0)})).sort((e,t)=>t.weight-e.weight||e.name.localeCompare(t.name)),i=r[0]?.weight||1;return r.map(e=>({name:e.name,matches:e.matches,score:Math.round(e.weight/i*100)}))}function bu(e){return`<div class="ficha-loading"><span class="spinner" aria-hidden="true"></span><span>${K(e)}</span></div>`}function xu(e,t,n,r,i){return`
    <div class="ficha-stat ${K(r||``)}">
      <span class="ficha-stat-icon" aria-hidden="true">${e}</span>
      <div class="ficha-stat-copy">
        <strong data-ficha-stat="${K(i)}">${K(t)}</strong>
        <small data-ficha-stat-label="${K(i)}">${K(n)}</small>
      </div>
    </div>
  `}function Su(e){let t=Math.max(0,Math.min(100,Math.round(Number(e)||0))),n=2*Math.PI*42,r=n*(1-t/100);return`
    <div class="ficha-ring ${Hc(t)}" role="img" aria-label="Score general ${t} de 100">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle class="ring-track" cx="50" cy="50" r="42" />
        <circle class="ring-fill" cx="50" cy="50" r="42" style="--dash:${n.toFixed(2)};--offset:${r.toFixed(2)}" />
      </svg>
      <div class="ficha-ring-center"><strong>${t}</strong><small>/100</small></div>
    </div>
  `}function Cu(e){return e.length?`
    <div class="ficha-subject-list">
      ${e.map(e=>{let t=e.total?Math.round(e.done/e.total*100):0;return`
          <div class="ficha-subject">
            <div class="ficha-subject-head">
              <strong>${K(e.subject)}</strong>
              <span>${e.done}/${e.total} · ${t}%</span>
            </div>
            <div class="ficha-bar" aria-hidden="true">
              <div class="ficha-bar-fill" style="--bar-color:${K(e.color||`var(--brand)`)};--bar-scale:${(t/100).toFixed(3)}"></div>
            </div>
            <div class="ficha-subject-meta">
              ${e.accuracy==null?`Sin precisión registrada`:`🎯 ${e.accuracy}% precisión`}
              · ${e.done===e.total?`materia completa`:`${e.total-e.done} por completar`}
            </div>
          </div>
        `}).join(``)}
    </div>
  `:`<p class="ficha-empty">Sin avance registrado todavía. Cuando empiece una unidad aparecerá aquí.</p>`}function wu(e){return e?`
    <article class="ficha-card ficha-focus">
      <span class="card-label">Siguiente paso</span>
      <h3>⏭️ ${K(e)}</h3>
      <p class="card-sub">Recomendación: abrir esta unidad en la siguiente sesión y revisar los ejercicios con menor precisión.</p>
      <span class="ficha-focus-chip">Enfoque sugerido</span>
    </article>
  `:`
      <article class="ficha-card ficha-focus ficha-focus-done">
        <span class="card-label">Siguiente paso</span>
        <h3>🎉 ¡Al día!</h3>
        <p class="card-sub">No le falta ninguna unidad por empezar. Aprovecha para reforzar las materias con menor precisión.</p>
      </article>
    `}function Tu(e){return new Map((e.board||[]).map(e=>[e.id,e.name]))}function Eu(e,t){let n=Array.isArray(t?.units)?t.units:[],r=Tu(e);return n.length?`
    <div class="ficha-unit-list">
      ${n.map(e=>{let t=e.status||`not_started`,n=t===`completed`||t===`mastered`?`success`:t===`in_progress`?`pill-blue`:``;return`
          <div class="ficha-unit-row">
            <div class="ficha-unit-main">
              <strong>${K(e.unit||`Unidad`)}</strong>
              <small>${K(r.get(e.subject)||`Materia`)} · ${e.attempts||0} intentos${e.accuracy==null?``:` · 🎯 ${Math.round(e.accuracy)}%`}</small>
            </div>
            <span class="pill ${n}">${K(bs[t]||t)}</span>
            <small class="ficha-unit-when">${e.last?K(Nc(e.last)):`Sin actividad`}</small>
          </div>
        `}).join(``)}
    </div>
  `:`<p class="ficha-empty">Este alumno no tiene unidades asignadas.</p>`}function Du(e,t,n){let r=Array.isArray(n?.recent)?n.recent:[],i=(e.overview?.recent||[]).filter(e=>e.student===t.student_code).map(e=>({ts:e.ts,kind:e.kind===`completed`?`unidad`:`ejercicio`,text:e.text,ok:e.ok})),a=[...r,...i].filter(e=>e.ts).sort((e,t)=>new Date(t.ts)-new Date(e.ts)).slice(0,10);return a.length?`
    <div class="ficha-timeline">
      ${a.map(e=>{let t=e.kind===`quiz`?`🧠`:e.kind===`unidad`?`📚`:`✏️`;return`
          <div class="ficha-timeline-item">
            <span class="ficha-timeline-dot ${e.ok?`ok`:`bad`}" aria-hidden="true">${e.ok?`✓`:`✗`}</span>
            <div class="ficha-timeline-copy">
              <strong>${K(e.text)}</strong>
              <small>${K(Nc(e.ts))}</small>
            </div>
            <span class="ficha-timeline-emoji" aria-hidden="true">${t}</span>
          </div>
        `}).join(``)}
    </div>
  `:`<p class="ficha-empty">Sin actividad registrada todavía.</p>`}function Ou(e,t){let n=Array.isArray(t)?t.map(vu).filter(Boolean):[];return n.length?`
    <div class="ficha-tag-group">
      <span class="card-label">${K(e)}</span>
      <div class="ficha-tags">
        ${n.map(e=>`<span class="ficha-tag">${K(e)}</span>`).join(``)}
      </div>
    </div>
  `:``}function ku(e){let t=e.personality&&typeof e.personality==`object`?e.personality:null,n=e.aptitude&&typeof e.aptitude==`object`?e.aptitude:null,r=!!t?.completed_at,i=!!n?.completed_at,a=t?.scores||{},o=Array.isArray(n?.career_suggestions)?n.career_suggestions:[],s=Array.isArray(n?.interests)?n.interests:[];return`
    <div class="ficha-test-results">
      <article class="ficha-card">
        <div class="ficha-card-head">
          <div>
            <h3>🧠 Test de personalidad</h3>
            <p class="card-sub">${r?`Respondido ${K(Nc(t.completed_at))}`:`El alumno todavía no ha respondido este test.`}</p>
          </div>
          <span class="pill ${r?`success`:``}">${r?`Completado`:`Pendiente`}</span>
        </div>
        ${r?`
          <div class="test-score-list">
            ${Object.entries(Os).map(([e,t])=>{let n=Number(a[e]??0);return`
                <div class="test-score">
                  <div class="test-score-head">
                    <span>${t.emoji} ${K(t.label)}</span>
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
            <p class="card-sub">${i?`Respondido ${K(Nc(n.completed_at))}`:`El alumno todavía no ha respondido este test.`}</p>
          </div>
          <span class="pill ${i?`success`:``}">${i?`Completado`:`Pendiente`}</span>
        </div>
        ${i?`
          ${o.length?`
            <div class="test-career-results">
              ${yu(o).slice(0,6).map(e=>`
                  <div class="test-career-row">
                    <div>
                      <strong>${K(e.name)}</strong>
                      <small>${e.matches.map(e=>K(e)).join(` · `)||`Coincide con su perfil`}</small>
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
              <div class="ficha-tags">${s.slice(0,12).map(e=>`<span class="ficha-tag">${K(e)}</span>`).join(``)}</div>
            </div>
          `:``}
        `:`<p class="ficha-empty">Cuando lo complete, aquí verás sus intereses y carreras sugeridas.</p>`}
      </article>
    </div>
  `}function Au(e,t){let n=[[`Carreras sugeridas`,t.career_suggestions],[`Intereses`,t.interests],[`Aptitudes`,t.aptitudes],[`Fortalezas`,t.strengths],[`Áreas a trabajar`,t.weaknesses]].map(([e,t])=>Ou(e,t)).filter(Boolean).join(``);return`
    <div class="ficha-profile-summary">
      <div class="ficha-profile-career">
        <span class="card-label">Meta vocacional</span>
        <h3>${K(t.career_choice||`Aún sin definir`)}</h3>
        <p class="card-sub">${t.career_choice?`Carrera objetivo registrada para orientar su ruta.`:`Define la carrera que quiere estudiar para personalizar el acompañamiento.`}</p>
      </div>
      ${n?`<div class="ficha-tag-groups">${n}</div>`:`<p class="ficha-empty">Todavía no hay intereses ni aptitudes registradas.</p>`}
    </div>

    ${ku(t)}

    <form class="form ficha-profile-form" data-save-profile="${K(e.id)}">
      <div class="ficha-form-grid">
        <label class="field"><span>Carrera que quiere</span><input name="career_choice" value="${K(t.career_choice||``)}" placeholder="ej. Medicina"></label>
        <label class="field"><span>Áreas a trabajar (separadas por coma)</span><input name="weaknesses" value="${K(_u(t.weaknesses))}" placeholder="organización, ansiedad…"></label>
        <label class="field wide"><span>Notas de orientación vocacional</span><textarea name="vocational_notes" placeholder="Acuerdos, seguimiento y observaciones de orientación…">${K(t.vocational_notes||``)}</textarea></label>
      </div>
      <p class="hint">🔒 Carreras sugeridas, intereses, aptitudes y fortalezas salen de los tests del alumno; no se editan a mano.</p>
      <div class="ficha-form-actions">
        <button class="btn primary" type="submit">Guardar perfil profesional</button>
      </div>
    </form>
  `}function ju(e){return`
    <div class="ficha-observations-layout">
      <article class="ficha-card">
        <div class="ficha-card-head">
          <div><h3>✍️ Nueva observación</h3><p class="card-sub">Registra acuerdos, avances o situaciones a dar seguimiento.</p></div>
        </div>
        <form class="form" data-add-observation="${K(e.id)}">
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
        <div data-observations-list="${K(e.id)}">${bu(`Cargando observaciones…`)}</div>
      </article>
    </div>
  `}function Mu(e,t,n=null){let r=e.studentProfiles?.get(t.id)||{},i=Uc(e,t.student_code),a=Wc(e,t.student_code),o=(e.overview?.scores?.students||[]).find(e=>e.code===t.student_code)||{},s=n?.stats||{},c=Number(o.score??0),l=Number(s.xp??o.xp??t.stats?.xp_total??0),u=Number(s.streak??t.stats?.current_streak??0),d=Number(s.best??t.stats?.best_streak??0),f=Number(s.units??o.units_done??t.stats?.units_completed??0),p=Number(o.units_total??e.overview?.published_units_total??0),m=s.accuracy??o.accuracy??null,h=Number(o.absences??0),g=s.last||t.stats?.last_activity_date||null,_=(t.full_name||`A`).trim().slice(0,1).toUpperCase(),v=t.status||`active`,y=v===`active`?`Activa`:v===`inactive`?`Inactiva`:v;return`
    <div class="ficha-overlay" data-ficha-overlay>
      <section class="ficha-dialog" role="dialog" aria-modal="true" aria-labelledby="ficha-title" data-ficha-dialog="${K(t.id)}" data-detail-loaded="${n?`1`:`0`}">
        <button type="button" class="ficha-close" data-ficha-close aria-label="Cerrar ficha">✕</button>

        <header class="ficha-hero">
          <div class="ficha-hero-main">
            <div class="ficha-avatar" aria-hidden="true">${K(_)}</div>
            <div class="ficha-identity">
              <span class="ficha-eyebrow">Ficha del alumno</span>
              <h2 id="ficha-title">${K(t.full_name||`Alumno sin nombre`)}</h2>
              <div class="ficha-meta">
                <span class="ficha-chip">🎓 ${K(t.student_code||`—`)}</span>
                <span class="ficha-chip">👥 ${K(t.group_name||`Sin grupo`)}</span>
                <span class="ficha-chip ${v===`active`?`success`:``}">${K(y)}</span>
              </div>
            </div>
          </div>
          <div class="ficha-score">
            ${Su(c)}
            <span>Score general</span>
            <small data-ficha-last>${g?`Última actividad ${K(Nc(g))}`:`Sin actividad registrada`}</small>
          </div>
        </header>

        <div class="ficha-stat-grid">
          ${xu(`⚡`,l.toLocaleString(`es-MX`),`XP acumulados`,`violet`,`xp`)}
          ${xu(`🔥`,u,d?`Racha actual · récord ${d}`:`Racha actual`,`amber`,`streak`)}
          ${xu(`📚`,p?`${f}/${p}`:f,`Unidades completadas`,`blue`,`units`)}
          ${xu(`🎯`,m==null?`—`:`${Math.round(m)}%`,`Precisión en ejercicios`,`green`,`accuracy`)}
          ${xu(`🗓️`,h,`Faltas registradas`,h?`red`:`green`,`absences`)}
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
                ${Cu(i)}
              </article>

              ${wu(a)}

              <article class="ficha-card ficha-span-2">
                <div class="ficha-card-head">
                  <div><h3>🧩 Unidades asignadas</h3><p class="card-sub">Estatus, intentos y precisión por unidad.</p></div>
                </div>
                <div data-ficha-units>${n?Eu(e,n):bu(`Cargando unidades…`)}</div>
              </article>

              <article class="ficha-card ficha-span-2">
                <div class="ficha-card-head">
                  <div><h3>🕒 Actividad reciente</h3><p class="card-sub">Últimos ejercicios y quizzes registrados.</p></div>
                </div>
                <div data-ficha-activity>${n?Du(e,t,n):bu(`Cargando actividad…`)}</div>
              </article>
            </div>
          </section>

          <section class="ficha-panel hidden" data-ficha-panel="perfil" id="ficha-panel-perfil" role="tabpanel">
            <div data-ficha-profile-panel>${Au(t,r)}</div>
          </section>

          <section class="ficha-panel hidden" data-ficha-panel="observaciones" id="ficha-panel-observaciones" role="tabpanel">
            ${ju(t)}
          </section>
        </div>
      </section>
    </div>
  `}function Nu(e,t=`ok`){if(!document.querySelector(`.ficha-dialog`)){t===`error`?q(e):J(e);return}let n=document.querySelector(`[data-ficha-toast]`);n||(n=document.createElement(`div`),n.dataset.fichaToast=``,document.body.appendChild(n)),n.className=`ficha-toast ${t}`,n.textContent=e,clearTimeout(n._hideTimer),n._hideTimer=setTimeout(()=>n.remove(),4200)}function Pu(e,t=document){let n=t.querySelector(`[data-save-profile="${e}"]`);n&&n.addEventListener(`submit`,t=>Bu(t,e))}function Fu(e){let t=document.querySelector(`[data-ficha-overlay]`);if(!t)return;let n=()=>Iu();t.querySelectorAll(`[data-ficha-close]`).forEach(e=>{e.addEventListener(`click`,n)}),t.addEventListener(`click`,e=>{e.target===t&&n()}),t.querySelectorAll(`[data-ficha-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{let n=e.dataset.fichaTab;t.querySelectorAll(`[data-ficha-tab]`).forEach(t=>{let n=t===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,String(n))}),t.querySelectorAll(`[data-ficha-panel]`).forEach(e=>{e.classList.toggle(`hidden`,e.dataset.fichaPanel!==n)})})}),Pu(e,t);let r=t.querySelector(`[data-add-observation="${e}"]`);r&&r.addEventListener(`submit`,t=>Hu(t,e)),W.fichaEscHandler=Vs(t,n),Vu(e)}function Iu({silent:e=!1}={}){let t=document.querySelector(`[data-ficha-overlay]`);t&&t.remove(),document.querySelectorAll(`[data-ficha-toast]`).forEach(e=>e.remove()),document.body.classList.remove(`ficha-open`),W.fichaEscHandler&&=(W.fichaEscHandler(),null);let n=W.fichaTrigger;W.fichaStudentId=null,W.fichaTrigger=null,!e&&n?.isConnected&&n.focus()}function Lu(e,t=null){let n=W.dashboard,r=(n?.students||[]).find(t=>t.id===e);r&&(Iu({silent:!0}),W.fichaStudentId=e,W.fichaTrigger=t,document.body.insertAdjacentHTML(`beforeend`,Mu(n,r)),document.body.classList.add(`ficha-open`),Fu(e),zu(e),requestAnimationFrame(()=>{document.querySelector(`[data-ficha-close]`)?.focus()}))}function Ru(e,t,n){let r=[...document.querySelectorAll(`[data-ficha-dialog]`)].find(e=>e.dataset.fichaDialog===t.id);if(!r)return;let i=n?.stats||{},a=(e.overview?.scores?.students||[]).find(e=>e.code===t.student_code)||{},o=Number(a.units_total??e.overview?.published_units_total??0),s=(e,t)=>{let n=r.querySelector(`[data-ficha-stat="${e}"]`);n&&(n.textContent=t)};s(`xp`,Number(i.xp??a.xp??0).toLocaleString(`es-MX`)),s(`streak`,String(i.streak??0)),i.best!=null&&((e,t)=>{let n=r.querySelector(`[data-ficha-stat-label="${e}"]`);n&&(n.textContent=t)})(`streak`,`Racha actual · récord ${i.best}`),s(`units`,o?`${i.units??0}/${o}`:String(i.units??0)),s(`accuracy`,i.accuracy==null?`—`:`${Math.round(i.accuracy)}%`);let c=r.querySelector(`[data-ficha-last]`);c&&(c.textContent=i.last?`Última actividad ${Nc(i.last)}`:`Sin actividad registrada`);let l=r.querySelector(`[data-ficha-units]`);l&&(l.innerHTML=Eu(e,n));let u=r.querySelector(`[data-ficha-activity]`);u&&(u.innerHTML=Du(e,t,n)),r.dataset.detailLoaded=`1`}async function zu(e){let{data:t,error:n}=await I.rpc(`app_student_detail`,{p_student_id:e}),r=[...document.querySelectorAll(`[data-ficha-dialog]`)].find(t=>t.dataset.fichaDialog===e);if(!r)return;if(n||!t){let e=`No se pudo cargar el detalle: ${n?.message||`error`}`,t=r.querySelector(`[data-ficha-units]`),i=r.querySelector(`[data-ficha-activity]`);t&&(t.innerHTML=`<p class="ficha-empty">${K(e)}</p>`),i&&(i.innerHTML=`<p class="ficha-empty">${K(e)}</p>`);return}let i=(W.dashboard?.students||[]).find(t=>t.id===e);i&&Ru(W.dashboard,i,t)}async function Bu(e,t){e.preventDefault();let n=e.currentTarget,r=new FormData(n),i=e=>String(e||``).split(`,`).map(e=>e.trim()).filter(Boolean),a=e=>{let t=String(e||``).trim();if(!t)return{};try{let e=JSON.parse(t);return e&&typeof e==`object`?e:{nota:t}}catch{return{nota:t}}},o={student_id:t,career_choice:String(r.get(`career_choice`)||``).trim()||null,weaknesses:i(r.get(`weaknesses`)),vocational_notes:String(r.get(`vocational_notes`)||``).trim()||null,updated_at:new Date().toISOString()};r.has(`career_suggestions`)&&(o.career_suggestions=i(r.get(`career_suggestions`))),r.has(`interests`)&&(o.interests=i(r.get(`interests`))),r.has(`aptitudes`)&&(o.aptitudes=i(r.get(`aptitudes`))),r.has(`strengths`)&&(o.strengths=i(r.get(`strengths`))),r.has(`personality`)&&(o.personality=a(r.get(`personality`))),r.has(`aptitude`)&&(o.aptitude=a(r.get(`aptitude`))),W.error=``,W.notice=``;let s=n.querySelector(`button[type="submit"]`);s&&(s.disabled=!0);let{error:c}=await I.from(`student_profiles`).upsert(o,{onConflict:`student_id`});if(s&&(s.disabled=!1),c){Nu(c?.message||`No se pudo guardar el perfil profesional.`,`error`);return}if(W.dashboard?.studentProfiles){let e=W.dashboard.studentProfiles.get(t)||{};W.dashboard.studentProfiles.set(t,{...e,...o})}let l=document.querySelector(`[data-ficha-profile-panel]`),u=(W.dashboard?.students||[]).find(e=>e.id===t);l&&u&&W.dashboard?.studentProfiles&&(l.innerHTML=Au(u,W.dashboard.studentProfiles.get(t)||{}),Pu(t,l)),Nu(`Perfil profesional guardado.`,`ok`)}async function Vu(e){let t=document.querySelector(`[data-observations-list="${e}"]`);if(!t)return;let{data:n,error:r}=await I.from(`observations`).select(`id,category,body,visibility,created_at,author_id`).eq(`student_id`,e).is(`deleted_at`,null).order(`created_at`,{ascending:!1});t.innerHTML=r||!n?.length?r?`<p class="ficha-empty">No se pudieron cargar las observaciones: ${K(r.message||`error`)}</p>`:`<p class="ficha-empty">Sin observaciones todavía. La primera que registres aparecerá aquí.</p>`:`
    <div class="ficha-observation-list">
      ${n.map(e=>`
        <article class="ficha-observation">
          <div class="ficha-observation-head">
            <span class="ficha-chip">${K(e.category||`General`)}</span>
            <span class="ficha-chip ${e.visibility===`family`?`success`:``}">${e.visibility===`family`?`👨‍👩‍👧 Tutor`:`🔒 Interno`}</span>
            <small>${K(Nc(e.created_at))}</small>
          </div>
          <p>${K(e.body)}</p>
        </article>
      `).join(``)}
    </div>
  `}async function Hu(e,t){e.preventDefault();let n=e.currentTarget,r=new FormData(n),i=String(r.get(`category`)||``).trim(),a=String(r.get(`body`)||``).trim(),o=String(r.get(`visibility`)||`internal`);if(!a)return;let s=n.querySelector(`button[type="submit"]`);s&&(s.disabled=!0),W.error=``,W.notice=``;let{error:c}=await I.from(`observations`).insert({student_id:t,author_id:W.profile?.id??null,category:i||null,body:a,visibility:o});c?(Nu(c?.message||`No se pudo guardar la observación.`,`error`),s&&(s.disabled=!1)):(n.reset(),s&&(s.disabled=!1),await Vu(t),Nu(`Observación guardada.`,`ok`))}async function Uu(e){let t=e.dataset.saveGrade,n=e.dataset.student,r=e.closest(`.assessment-box`)?.querySelector(`[data-grade-student="${n}"]`);if(!t||!n||!r||e.disabled)return;let i=r.value.trim(),a=i===``?null:Number(i);if(a!==null&&(Number.isNaN(a)||a<0)){q(`El puntaje debe ser un número válido.`);return}W.error=``,W.notice=``,e.disabled=!0,e.textContent=`…`;let{error:o}=await I.from(`grades`).upsert({assessment_id:t,student_id:n,score:a,status:a===null?`pending`:`recorded`,recorded_by:W.profile?.id??null,recorded_at:new Date().toISOString()},{onConflict:`assessment_id,student_id`});o?(q(o?.message||`No se pudo guardar la calificación.`),e.disabled=!1,e.textContent=`Guardar`):(J(`Calificación guardada.`),e.disabled=!1,e.textContent=`Guardar`)}async function Wu(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=t.dataset.createAssessment,i=t.dataset.group,a=String(n.get(`name`)||``).trim(),o=String(n.get(`type`)||`other`),s=Number(n.get(`max_score`)||0),c=String(n.get(`assessment_date`)||``).trim()||null,l=String(n.get(`term_id`)||``);if(!a||!s||s<=0||!i){q(`Completa nombre, puntaje máximo y grupo.`);return}if(l||=W.dashboard?.terms?.[0]?.id,!l){q(`No hay un trimestre configurado para esta evaluación.`);return}let u=t.querySelector(`button[type="submit"]`);u&&(u.disabled=!0),W.error=``,W.notice=``;let{error:d}=await I.from(`assessments`).insert({group_id:i,subject_id:r,term_id:l,name:a,type:o,max_score:s,assessment_date:c,created_by:W.profile?.id??null});d?(q(d?.message?.includes(`duplicate`)||d?.code===`23505`?`Ya existe una evaluación con ese nombre en la materia.`:d?.message||`No se pudo crear la evaluación.`),u&&(u.disabled=!1)):(J(`Evaluación creada. Ahora puedes calificar a cada alumno.`),await Y(W.profile))}async function Gu(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=String(n.get(`group_id`)||``),i=String(n.get(`subject_id`)||``),a=String(n.get(`unit_id`)||``).trim(),o=String(n.get(`title`)||``).trim(),s=String(n.get(`instructions`)||``).trim(),c=String(n.get(`task_type`)||`project`),l=Number(n.get(`max_score`)||0),u=String(n.get(`due_at`)||``).trim();if(!r||!i||!o||!l||l<=0){q(`Completa grupo, materia, título y puntaje máximo.`);return}let d=t.querySelector(`button[type="submit"]`);d&&(d.disabled=!0,d.textContent=`Creando…`),W.error=``,W.notice=``;let{error:f}=await I.from(`tasks`).insert({group_id:r,subject_id:i,unit_id:a||null,title:o,instructions:s||null,task_type:c,due_at:u?new Date(u).toISOString():null,max_score:l,created_by:W.profile?.id??null});f?(q(f?.message||`No se pudo crear la tarea.`),d&&(d.disabled=!1,d.textContent=`Crear tarea`)):(J(`Tarea creada. Ya puedes registrar entregas y calificaciones.`),await Ku(),await qu().catch(()=>{}),$())}async function Ku(){let{data:e,error:t}=await I.rpc(`app_staff_tasks`);if(t)throw t;W.dashboard&&(W.dashboard.tasks=(e||{}).tasks||[])}async function qu(){let{data:e,error:t}=await I.rpc(`app_activity_log`,{p_limit:80});if(t)throw t;W.dashboard&&(W.dashboard.activity=(e||{}).entries||[])}async function Ju(e){let t=e.closest(`[data-task-row]`);if(!t)return;let n=t.dataset.taskId,r=t.dataset.studentId,i=t.dataset.status||`pending`,a=t.querySelector(`[data-task-score]`),o=String(a?.value||``).trim(),s=o===``?null:Number(o),c=Number(a?.max||0);if(s!==null&&Number.isNaN(s)){q(`El puntaje debe ser un número.`);return}if(s!==null&&c&&s>c){q(`El puntaje no puede superar ${c}.`);return}e.disabled=!0;let l=e.textContent;e.textContent=`…`,W.error=``,W.notice=``;let u=i===`pending`?null:new Date().toISOString(),{error:d}=await I.from(`task_submissions`).upsert({task_id:n,student_id:r,status:i,score:s,submitted_at:u,recorded_by:W.profile?.id??null,updated_at:new Date().toISOString()},{onConflict:`task_id,student_id`});if(d){q(d?.message||`No se pudo guardar la entrega.`),e.disabled=!1,e.textContent=l;return}let f=(W.dashboard?.tasks||[]).find(e=>e.id===n);if(f){let e=(f.submissions||[]).find(e=>e.student_id===r);e&&(e.status=i,e.score=s,e.submitted_at=u,e.updated_at=new Date().toISOString());let t=(f.submissions||[]).filter(e=>e.status===`submitted`||e.status===`late`).length,a=G.querySelector(`[data-task-count="${n}"]`);a&&(a.textContent=`${t}/${(f.submissions||[]).length} entregadas`)}await qu().catch(()=>{}),e.disabled=!1,e.textContent=`✓ Guardado`,window.setTimeout(()=>{e.textContent=l},1600)}async function Yu(e,t){let n=G.querySelector(`[data-history-box="${e}"]`);if(!n)return;if(!n.classList.contains(`hidden`)){n.classList.add(`hidden`),t.textContent=`Ver historial`;return}n.classList.remove(`hidden`),t.textContent=`Ocultar historial`,n.innerHTML=`<div class="spinner" aria-hidden="true"></div>`;let r=(W.dashboard?.groups||[]).find(t=>t.id===e)?.students||[],{data:i,error:a}=await I.from(`attendance_sessions`).select(`id,session_date`).eq(`group_id`,e).order(`session_date`,{ascending:!1}).limit(12);if(a||!i?.length){n.innerHTML=`<p class="empty-state">Todavía no hay sesiones de asistencia registradas.</p>`;return}let o=i.map(e=>e.id),{data:s,error:c}=await I.from(`attendance`).select(`session_id,student_id,status`).in(`session_id`,o);if(c){n.innerHTML=`<p class="empty-state">No se pudo cargar el historial.</p>`;return}let l={present:`✅`,late:`⏰`,excused:`✳️`,absent:`❌`},u=new Map;for(let e of r)u.set(e.id,{name:e.full_name,code:e.student_code,cells:new Map,absences:0});for(let e of s||[]){let t=u.get(e.student_id);t&&(t.cells.set(e.session_id,e.status),e.status===`absent`&&(t.absences+=1))}n.innerHTML=`
    <table class="attendance-history-table">
      <thead>
        <tr>
          <th>Alumno</th>
          ${i.map(e=>`<th>${K(Z(String(e.session_date).slice(0,10)))}</th>`).join(``)}
          <th>Faltas</th>
        </tr>
      </thead>
      <tbody>
        ${[...u.values()].map(e=>`
          <tr>
            <td><strong>${K(e.name)}</strong><div class="muted"><small>${K(e.code)}</small></div></td>
            ${i.map(t=>`<td>${l[e.cells.get(t.id)]||`·`}</td>`).join(``)}
            <td>${e.absences}</td>
          </tr>
        `).join(``)}
      </tbody>
    </table>
    <p class="muted"><small>✅ presente · ⏰ tarde · ✳️ justificado · ❌ falta · · sin registro</small></p>
  `}function $(){Iu({silent:!0}),Pl({silent:!0}),fu(),ul(),G.innerHTML=Vl(W.profile),G.querySelector(`#logout-btn`).addEventListener(`click`,gd),G.querySelectorAll(`[data-open-final-exam]`).forEach(e=>{e.addEventListener(`click`,()=>{$a(G,{onClose:()=>{$(),Y(W.profile)}})})}),G.querySelectorAll(`[data-open-vocational]`).forEach(e=>{e.addEventListener(`click`,()=>{$o(G,{readOnly:W.profile?.role!==`student`,onClose:$})})}),G.querySelectorAll(`[data-open-unit]`).forEach(e=>{e.addEventListener(`click`,()=>ru(e.dataset.openUnit))}),G.querySelectorAll(`[data-consent-ack]`).forEach(e=>{e.addEventListener(`change`,()=>{G.querySelectorAll(`[data-consent-student]`).forEach(t=>{t.disabled=!e.checked})})}),G.querySelectorAll(`[data-consent-student]`).forEach(e=>{e.addEventListener(`click`,()=>md(e.dataset.consentStudent,e))}),G.querySelectorAll(`[data-revoke-consent]`).forEach(e=>{e.addEventListener(`click`,()=>{hd(e.dataset.revokeConsent,e.dataset.revokeName||``,e)})}),G.querySelectorAll(`[data-invite-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=G.querySelector(`[data-invite-form="${e.dataset.inviteToggle}"]`);t&&t.classList.toggle(`hidden`)})}),G.querySelectorAll(`[data-invite-cancel]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=G.querySelector(`[data-invite-form="${e.dataset.inviteCancel}"]`);t&&t.classList.add(`hidden`)})}),G.querySelectorAll(`[data-invite-form]`).forEach(e=>{e.addEventListener(`submit`,pd)}),G.querySelectorAll(`[data-staff-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{W.staffTab=e.dataset.staffTab,W.error=``,W.notice=``,$()})}),G.querySelectorAll(`[data-pagination]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.page);!Number.isFinite(t)||t<1||(e.dataset.pagination===`payments`&&(W.paymentsPage=t),$(),G.querySelector(`[data-pagination]`)?.scrollIntoView({block:`nearest`}))})}),G.querySelectorAll(`[data-ficha-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>Lu(e.dataset.fichaToggle,e))}),G.querySelectorAll(`[data-toggle-grades]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=G.querySelector(`[data-grades-editor="${e.dataset.toggleGrades}"]`);t&&t.classList.toggle(`hidden`)})}),G.querySelectorAll(`[data-save-grade]`).forEach(e=>{e.addEventListener(`click`,()=>Uu(e))}),G.querySelectorAll(`[data-create-assessment]`).forEach(e=>{e.addEventListener(`submit`,Wu)}),G.querySelectorAll(`[data-history-open]`).forEach(e=>{e.addEventListener(`click`,()=>Yu(e.dataset.historyOpen,e))});let e=G.querySelector(`#create-teacher-form`);e&&e.addEventListener(`submit`,Xu),G.querySelectorAll(`[data-invite-student-form]`).forEach(e=>{e.addEventListener(`submit`,t=>{id(t,e.querySelector(`[data-invite-groups]`)?.value||e.dataset.inviteGroupDefault||``)})}),G.querySelectorAll(`[data-copy-invitation]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.closest(`[data-student-invitation]`)?.querySelector(`[data-invitation-url]`);if(t)try{await navigator.clipboard.writeText(t.value),e.textContent=`Copiado ✓`,setTimeout(()=>{e.textContent=`Copiar enlace`},2e3)}catch{t.select(),e.textContent=`Copia manual`}})}),G.querySelectorAll(`[data-dismiss-invitation]`).forEach(e=>{e.addEventListener(`click`,()=>{W.studentInvitation=null,$()})}),G.querySelectorAll(`[data-reset-student]`).forEach(e=>{e.addEventListener(`click`,()=>Zu(e.dataset.resetStudent,e))}),G.querySelectorAll(`[data-reissue-invite]`).forEach(e=>{e.addEventListener(`click`,()=>ad(e.dataset.reissueInvite,e))}),G.querySelectorAll(`[data-toggle-user]`).forEach(e=>{e.addEventListener(`click`,()=>Qu(e))}),G.querySelectorAll(`[data-ban-account]`).forEach(e=>{e.addEventListener(`click`,()=>$u(e))}),G.querySelectorAll(`[data-save-setting]`).forEach(e=>{e.addEventListener(`click`,()=>ed(e.dataset.saveSetting,e))}),G.querySelectorAll(`[data-resolve-request]`).forEach(e=>{e.addEventListener(`click`,()=>kc(e))}),G.querySelectorAll(`[data-create-student-group]`).forEach(e=>{e.addEventListener(`submit`,t=>td(t,e.dataset.createStudentGroup))});let t=G.querySelector(`#admin-create-student-form`);t&&t.addEventListener(`submit`,e=>{td(e,t.querySelector(`[data-admin-groups]`)?.value)}),G.querySelectorAll(`[data-advise-student]`).forEach(e=>{e.addEventListener(`click`,()=>od(e.dataset.adviseStudent))}),G.querySelectorAll(`[data-attendance-open]`).forEach(e=>{e.addEventListener(`click`,()=>cd(e.dataset.attendanceOpen))}),G.querySelectorAll(`[data-attendance-close]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=G.querySelector(`[data-attendance-area="${e.dataset.attendanceClose}"]`);t&&t.classList.add(`hidden`),e.style.display=`none`;let n=G.querySelector(`[data-attendance-open="${e.dataset.attendanceClose}"]`);n&&(n.style.display=``)})}),G.querySelectorAll(`[data-student-detail]`).forEach(e=>{e.addEventListener(`click`,()=>Lu(e.dataset.studentDetail,e))}),G.querySelectorAll(`[data-start-test]`).forEach(e=>{e.addEventListener(`click`,()=>Nl(e.dataset.startTest))}),G.querySelectorAll(`[data-activate-unit]`).forEach(e=>{e.addEventListener(`click`,()=>mu(e))}),G.querySelectorAll(`[data-manage-assignment]`).forEach(e=>{e.addEventListener(`click`,()=>hu(e))}),G.querySelectorAll(`[data-open-pay-dialog]`).forEach(e=>{e.addEventListener(`click`,()=>cl(e.dataset.openPayDialog,e.dataset.payMode||`payment`))}),G.querySelectorAll(`[data-void-payment]`).forEach(e=>{e.addEventListener(`click`,()=>dl(e))}),G.querySelectorAll(`[data-receipt-payment]`).forEach(e=>{e.addEventListener(`click`,()=>fl(e.dataset.receiptPayment))});let n=G.querySelector(`[data-subjects-group]`);n&&n.addEventListener(`change`,()=>{W.subjectsGroupId=n.value,$()}),G.querySelectorAll(`[data-close-assignment]`).forEach(e=>{e.addEventListener(`click`,()=>gu(e,`closed`))}),G.querySelectorAll(`[data-reopen-assignment]`).forEach(e=>{e.addEventListener(`click`,()=>gu(e,`active`))});let r=G.querySelector(`#sidebar-toggle`);r&&r.addEventListener(`click`,()=>{W.sidebarCollapsed=!W.sidebarCollapsed,localStorage.setItem(`ecoems_sidebar`,W.sidebarCollapsed?`collapsed`:`open`);let e=G.querySelector(`.staff-app`);e&&e.classList.toggle(`collapsed`,W.sidebarCollapsed);let t=!W.sidebarCollapsed;r.setAttribute(`aria-expanded`,String(t)),r.title=t?`Ocultar menú`:`Mostrar menú`;let n=r.querySelector(`.nav-emoji`),i=r.querySelector(`.nav-text`);n&&(n.textContent=t?`«`:`»`),i&&(i.textContent=t?`Ocultar menú`:`Mostrar menú`)}),G.querySelectorAll(`[data-subject-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.subjectToggle;Ls(t);let n=e.closest(`.board-subject`);if(!n)return;let r=W.collapsedSubjects.has(t);n.classList.toggle(`collapsed`,r),e.setAttribute(`aria-expanded`,String(!r))})}),G.querySelectorAll(`[data-activity-filter]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.activityFilter;G.querySelectorAll(`[data-activity-filter]`).forEach(t=>{t.classList.toggle(`active`,t===e)}),G.querySelectorAll(`[data-activity-kind]`).forEach(e=>{e.classList.toggle(`hidden`,t!==`todo`&&e.dataset.activityKind!==t)})})});let i=G.querySelector(`#create-task-form`);i&&i.addEventListener(`submit`,Gu),G.querySelectorAll(`[data-task-status]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`[data-task-row]`);t&&(t.dataset.status=e.dataset.taskStatus,t.querySelectorAll(`[data-task-status]`).forEach(t=>{t.classList.toggle(`active`,t===e)}))})}),G.querySelectorAll(`[data-save-task-submission]`).forEach(e=>{e.addEventListener(`click`,()=>Ju(e))}),qs()}async function Xu(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=String(n.get(`full_name`)||``).trim(),i=String(n.get(`email`)||``).trim().toLowerCase(),a=String(n.get(`password`)||``);if(!r||!i||a.length<12||!/[a-z]/.test(a)||!/[A-Z]/.test(a)||!/\d/.test(a)){q(`Completa los datos: nombre, correo y contraseña de al menos 12 caracteres con mayúscula, minúscula y número.`);return}let o=t.querySelector(`button[type="submit"]`);o.disabled=!0,o.textContent=`Creando…`,W.error=``,W.notice=``;try{let{data:e,error:n}=await I.functions.invoke(`admin-create-teacher`,{body:{full_name:r,email:i,password:a}});if(n)throw n;if(!e?.ok)throw Error(e?.error||`No se pudo crear el profesor`);J(`Profesor ${e.profile.full_name} creado. Entrégale el correo y la contraseña.`),t.reset(),await Y(W.profile)}catch(e){q(e?.message||`No se pudo crear el profesor.`),o.disabled=!1,o.textContent=`Crear profesor`}}async function Zu(e,t){if(e&&!t.disabled){W.error=``,W.notice=``,t.disabled=!0,t.textContent=`Generando…`;try{let{data:n,error:r}=await I.functions.invoke(`admin-reset-student-password`,{body:{student_id:e}});if(r)throw r;if(!n?.temporary_password)throw Error(n?.error||`No se pudo restablecer la contraseña`);J(`Contraseña temporal de ${t.dataset.studentName||n.username||`el alumno`} (${n.username}): ${n.temporary_password}. Entrégala una sola vez.`),t.disabled=!1,t.textContent=`Nueva contraseña`}catch(e){q(e?.message||`No se pudo restablecer la contraseña.`),t.disabled=!1,t.textContent=`Nueva contraseña`}}}async function Qu(e){let t=e.dataset.toggleUser,n=e.dataset.active===`1`;if(!t||e.disabled)return;let r=e.closest(`li`)?.querySelector(`strong`)?.textContent||`usuario`;if((n||window.confirm(`¿Activar la cuenta de ${r}?`))&&(!n||window.confirm(`¿Desactivar la cuenta de ${r}? Perderá el acceso de inmediato.`))){W.error=``,W.notice=``,e.disabled=!0;try{let{data:e,error:i}=await I.functions.invoke(`deactivate-user`,{body:{user_id:t,active:!n}});if(i)throw i;if(!e?.ok)throw Error(e?.error||`No se pudo actualizar la cuenta`);J(`Cuenta de ${r} ${e.active?`activada`:`desactivada`}.`),await Y(W.profile)}catch(t){q(t?.message||`No se pudo actualizar la cuenta.`),e.disabled=!1}}}async function $u(e){let t=e.dataset.banAccount,n=e.dataset.ban===`1`;if(!t||e.disabled)return;let r=e.closest(`li`)?.querySelector(`strong`)?.textContent||`la cuenta`;if(window.confirm(n?`¿Bloquear ${r}? No podrá iniciar sesión con esa cuenta.`:`¿Desbloquear ${r}? Volverá a poder iniciar sesión (seguirá sin ver contenido hasta que se vincule).`)){W.error=``,W.notice=``,e.disabled=!0;try{let{data:e,error:i}=await I.rpc(`app_ban_account`,{p_user_id:t,p_ban:n});if(i)throw i;if(!e?.ok)throw Error(e?.error||`No se pudo actualizar la cuenta`);J(`Cuenta ${r} ${n?`bloqueada`:`desbloqueada`}.`),await Y(W.profile)}catch(t){q(t?.message||`No se pudo actualizar la cuenta.`),e.disabled=!1}}}async function ed(e,t){let n=G.querySelector(`[data-setting-value="${e}"]`);if(!n||t.disabled)return;let r;try{r=JSON.parse(n.value)}catch{q(`El valor de ${e} debe ser JSON válido.`);return}W.error=``,W.notice=``,t.disabled=!0,t.textContent=`Guardando…`;try{let{error:n}=await I.from(`settings`).upsert({key:e,value:r,updated_by:W.profile?.id??null});if(n)throw n;J(`Configuración ${e} guardada.`),t.disabled=!1,t.textContent=`Guardar`}catch(n){q(n?.message||`No se pudo guardar ${e}.`),t.disabled=!1,t.textContent=`Guardar`}}async function td(e,t){e.preventDefault();let n=e.currentTarget,r=new FormData(n),i=String(r.get(`full_name`)||``).trim(),a=String(r.get(`username`)||``).trim().toLowerCase(),o=String(r.get(`password`)||``),s=String(r.get(`student_code`)||``).trim().toUpperCase();if(!t){q(`Selecciona un grupo para el alumno.`);return}if(!i){q(`Escribe el nombre completo del alumno.`);return}if(o.length<12||!/[a-z]/.test(o)||!/[A-Z]/.test(o)||!/\d/.test(o)){q(`Completa los datos: nombre y contraseña temporal (12+ caracteres, con mayúscula, minúscula y número). El usuario se genera del nombre si lo dejas vacío.`);return}let c=n.querySelector(`button[type="submit"]`);c&&(c.disabled=!0,c.textContent=`Dando de alta…`),W.error=``,W.notice=``;try{let e=n.querySelector(`[data-create-result]`),{data:r,error:c}=await I.functions.invoke(`admin-create-student`,{body:{full_name:i,username:a||null,password:o,group_id:t,student_code:s||null}});if(c)throw c;if(!r?.ok)throw Error(r?.error||`No se pudo dar de alta al alumno`);e&&(e.innerHTML=`
        <div class="answer-box correct">
          <strong>Alumno dado de alta</strong>
          <p>Usuario: <b>${K(r.access.username)}</b><br>
          Contraseña temporal: <b>${K(o)}</b><br>
          <small>Entrégaselas una vez. En su primer ingreso, el alumno deberá crear su propia contraseña.</small></p>
        </div>
      `),J(`Alumno ${r.student?.student_code||a} dado de alta en el grupo.`),n.reset(),await Y(W.profile)}catch(e){q(e?.message||`No se pudo dar de alta al alumno.`),c&&(c.disabled=!1,c.textContent=`Dar de alta`)}}function nd(e){let t=new URL(window.location.href);return t.search=``,t.hash=``,t.searchParams.set(`link_token`,e),t.toString()}function rd(e){let t=new Date(e||``);return Number.isNaN(t.getTime())?``:t.toLocaleString(`es-MX`,{dateStyle:`medium`,timeStyle:`short`})}async function id(e,t){e.preventDefault();let n=e.currentTarget,r=new FormData(n),i=String(r.get(`full_name`)||``).trim(),a=String(r.get(`username`)||``).trim().toLowerCase(),o=String(r.get(`student_code`)||``).trim().toUpperCase();if(!t){q(`Selecciona un grupo para el alumno.`);return}if(!i){q(`Escribe el nombre completo del alumno.`);return}let s=n.querySelector(`button[type="submit"]`);s&&(s.disabled=!0,s.textContent=`Generando…`),W.error=``,W.notice=``,W.studentInvitation=null;try{let{data:e,error:n}=await I.functions.invoke(`issue-student-link-token`,{body:{full_name:i,username:a||null,group_id:t,student_code:o||null}});if(n)throw n;if(!e?.ok)throw Error(e?.error||`No se pudo generar la invitación`);let r=e.invitation?.token;if(!r)throw Error(`La invitación llegó sin token.`);let s=nd(r);W.studentInvitation={fullName:i,username:e.access?.username||``,studentCode:e.student?.student_code||o||``,redeemUrl:s,expiresAtLabel:rd(e.invitation?.expires_at)},J(`Invitación generada para ${i}. Comparte el enlace; vence en 72 h.`),await Y(W.profile)}catch(e){q(await dc(e,`No se pudo generar la invitación.`)),$()}}async function ad(e,t){if(e&&!t.disabled){W.error=``,W.notice=``,t.disabled=!0,t.textContent=`Generando…`;try{let{data:n,error:r}=await I.functions.invoke(`issue-student-link-token`,{body:{student_id:e}});if(r)throw r;if(!n?.ok)throw Error(n?.error||`No se pudo generar el enlace`);let i=n.invitation?.token;if(!i)throw Error(`La invitación llegó sin token.`);let a=nd(i),o=n.access?.full_name||t.dataset.studentName||`el alumno`;W.studentInvitation={fullName:o,username:n.access?.username||``,studentCode:n.student?.student_code||``,redeemUrl:a,expiresAtLabel:rd(n.invitation?.expires_at)},W.staffTab=`alumnos`,J(`Enlace de acceso generado para ${o}. Compártelo; vence en 72 h.`),await Y(W.profile)}catch(e){q(await dc(e,`No se pudo generar el enlace de acceso.`)),t.disabled=!1,t.textContent=`Enlace de acceso`}}}function od(e){let t=G.querySelector(`[data-advise-form="${e}"]`);if(!t)return;let n=(W.dashboard?.groups||[]).find(t=>t.students.some(t=>t.id===e))?.students.find(t=>t.id===e),r=n?.guardians||[];t.classList.toggle(`hidden`),t.classList.contains(`hidden`)||(r.length?(t.innerHTML=`
    <span class="card-label">Aviso para ${K(n?.full_name||`el alumno`)}</span>
    <select data-advise-guardian>
      ${r.map(e=>`
        <option value="${K(e.id)}" data-phone="${K(e.phone||``)}">
          ${K(e.full_name)}${e.relationship?` (${K(e.relationship)})`:``}
        </option>
      `).join(``)}
    </select>
    <textarea data-advise-body rows="3" placeholder="Escribe el aviso que quieres enviar…"></textarea>
    <div class="row">
      <button class="btn primary" data-advise-send="${K(e)}">Enviar por WhatsApp</button>
      <button class="btn ghost" data-advise-close="${K(e)}">Cerrar</button>
    </div>
  `,t.querySelector(`[data-advise-send]`).addEventListener(`click`,()=>sd(e,n)),t.querySelector(`[data-advise-close]`).addEventListener(`click`,()=>t.classList.add(`hidden`))):t.innerHTML=`<p class="empty-state">Este alumno no tiene tutores vinculados. Usa "Invitar tutor" primero.</p>`)}async function sd(e,t){let n=G.querySelector(`[data-advise-form="${e}"]`);if(!n)return;let r=n.querySelector(`[data-advise-guardian]`),i=n.querySelector(`[data-advise-body]`),a=r?.selectedOptions?.[0],o=r?.value,s=a?.dataset?.phone||``,c=a?.textContent?.trim()||`el tutor`,l=String(i?.value||``).trim();if(!l){q(`Escribe el aviso que quieres enviar.`);return}if(!s){q(`El tutor no tiene teléfono registrado. Edita su ficha o comparte el aviso por otro medio.`);return}let u=`Aviso sobre ${t?.full_name||`el alumno`}`;try{let{error:t}=await I.from(`guardian_messages`).insert({student_id:e,guardian_id:o,channel:`whatsapp`,subject:u,body:l,status:`sent`,sent_at:new Date().toISOString()});if(t)throw t;let r=[`Hola ${c} 👋`,u+`:`,l].join(`
`);window.open(`https://wa.me/${s.replace(/[^\d]/g,``)}?text=${encodeURIComponent(r)}`,`_blank`,`noopener`),J(`Aviso registrado. Se abrió WhatsApp para enviarlo.`),n.classList.add(`hidden`),await Y(W.profile)}catch(e){q(e?.message||`No se pudo registrar el aviso.`)}}async function cd(e,t){let n=G.querySelector(`[data-attendance-area="${e}"]`);if(!n)return;let r=G.querySelector(`[data-attendance-open="${e}"]`);if(!n.classList.contains(`hidden`)&&!t){n.classList.add(`hidden`),n.innerHTML=``,r&&(r.style.display=``);return}let i=(W.dashboard?.groups||[]).find(t=>t.id===e)?.students||[];if(!i.length){q(`El grupo no tiene alumnos.`);return}n.classList.remove(`hidden`),n.innerHTML=`<div class="spinner" aria-hidden="true"></div>`,r&&(r.style.display=`none`),W.error=``,W.notice=``;let a=new Date().toISOString().slice(0,10);await ld(e,i,n,t||a)}async function ld(e,t,n,r){try{let{data:i,error:a}=await I.from(`attendance_sessions`).select(`id,session_date`).eq(`group_id`,e).eq(`session_date`,r).order(`created_at`,{ascending:!0}).limit(1).maybeSingle();if(a)throw a;if(!i){let t=await I.from(`attendance_sessions`).insert({group_id:e,session_date:r,created_by:W.profile?.id??null}).select(`id,session_date`).single();if(t.error)throw t.error;i=t.data}let o=await I.from(`attendance`).select(`student_id,status`).eq(`session_id`,i.id);if(o.error)throw o.error;let s=new Map((o.data||[]).map(e=>[e.student_id,e.status])),c=new Date().toISOString().slice(0,10);n.innerHTML=`
      <div class="attendance-toolbar">
        <label class="attendance-date">
          <span>Fecha</span>
          <input type="date" value="${K(r)}" max="${K(c)}" data-attendance-date>
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
            <li class="attendance-row" data-attendance-row data-student-id="${K(e.id)}" data-status="${K(t)}">
              <div class="attendance-who">
                <span class="avatar small">${K((e.full_name||`?`).slice(0,1).toUpperCase())}</span>
                <div>
                  <strong>${K(e.full_name)}</strong>
                  <small>${K(e.student_code)}</small>
                </div>
              </div>
              <div class="status-seg" role="group" aria-label="Estado de ${K(e.full_name)}">
                ${Object.entries(Es).map(([e,n])=>`
                  <button class="status-btn ${t===e?`active`:``}" type="button" data-att-status="${e}">${K(n)}</button>
                `).join(``)}
              </div>
            </li>
          `}).join(``)}
      </ul>
      <div class="row end attendance-actions">
        <span class="muted" data-attendance-save-note><small>Los cambios se guardan por fecha.</small></span>
        <button class="btn primary" data-attendance-save="${K(i.id)}" data-attendance-group="${K(e)}">Guardar asistencia</button>
      </div>
    `,ud(n,e,t),dd(n)}catch(e){n.innerHTML=`<p class="empty-state">No se pudo cargar la asistencia: ${K(e?.message||`error`)}</p>`}}function ud(e,t,n){let r=e.querySelector(`[data-attendance-date]`);r&&r.addEventListener(`change`,()=>{let i=r.value||new Date().toISOString().slice(0,10);e.innerHTML=`<div class="spinner" aria-hidden="true"></div>`,ld(t,n,e,i)}),e.querySelectorAll(`[data-att-status]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.closest(`[data-attendance-row]`);n&&(n.dataset.status=t.dataset.attStatus,n.querySelectorAll(`[data-att-status]`).forEach(e=>{e.classList.toggle(`active`,e===t)}),dd(e))})}),e.querySelectorAll(`[data-attendance-all]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.attendanceAll;e.querySelectorAll(`[data-attendance-row]`).forEach(e=>{e.dataset.status=n,e.querySelectorAll(`[data-att-status]`).forEach(e=>{e.classList.toggle(`active`,e.dataset.attStatus===n)})}),dd(e)})});let i=e.querySelector(`[data-attendance-dismiss]`);i&&i.addEventListener(`click`,()=>{e.classList.add(`hidden`),e.innerHTML=``;let n=G.querySelector(`[data-attendance-open="${t}"]`);n&&(n.style.display=``)});let a=e.querySelector(`[data-attendance-save]`);a&&a.addEventListener(`click`,()=>fd(a.dataset.attendanceSave,t,a,e))}function dd(e){let t=e.querySelector(`[data-attendance-summary]`);if(!t)return;let n={present:0,late:0,excused:0,absent:0};e.querySelectorAll(`[data-attendance-row]`).forEach(e=>{let t=e.dataset.status||`present`;n[t]!=null&&(n[t]+=1)});let r=Object.values(n).reduce((e,t)=>e+t,0);t.innerHTML=`
    <span class="pill pill-green">${n.present} presentes</span>
    <span class="pill pill-amber">${n.late} tarde</span>
    <span class="pill">${n.excused} justificados</span>
    <span class="pill pill-red">${n.absent} faltas</span>
    <span class="pill pill-blue">${r} alumnos</span>
  `}async function fd(e,t,n,r){if(r){n.disabled=!0,n.textContent=`Guardando…`,W.error=``,W.notice=``;try{let t=[...r.querySelectorAll(`[data-attendance-row]`)],i=t.map(t=>I.from(`attendance`).upsert({session_id:e,student_id:t.dataset.studentId,status:t.dataset.status||`present`,recorded_by:W.profile?.id??null},{onConflict:`session_id,student_id`})),a=(await Promise.all(i)).find(e=>e.error)?.error;if(a)throw a;let o=r.querySelector(`[data-attendance-save-note]`);o&&(o.innerHTML=`<small>Guardado a las ${K(new Date().toLocaleTimeString(`es-MX`,{hour:`2-digit`,minute:`2-digit`}))} · ${t.length} alumnos.</small>`),n.disabled=!1,n.textContent=`Guardar asistencia`}catch(e){q(e?.message||`No se pudo guardar la asistencia.`),n.disabled=!1,n.textContent=`Guardar asistencia`}}}async function pd(e){e.preventDefault();let t=e.currentTarget,n=t.dataset.inviteForm,r=String(t.dataset.studentCode||`alumno`).toLowerCase(),i=new FormData(t),a=String(i.get(`full_name`)||``).trim(),o=String(i.get(`phone`)||``).trim(),s=String(i.get(`relationship`)||``).trim(),c=String(i.get(`email`)||``).trim().toLowerCase()||`tutor.${r}@tutores.ecoems.mx`;if(!a)return;let l=t.querySelector(`button[type="submit"]`);l&&(l.disabled=!0,l.textContent=`Creando…`),W.error=``,W.notice=``;try{let{data:e,error:r}=await I.functions.invoke(`invite-guardian`,{body:{student_id:n,full_name:a,phone:o||null,relationship:s||null,email:c}});if(r)throw r;if(!e?.ok)throw Error(e?.error||`No se pudo crear la invitación`);t.classList.add(`hidden`);let i=G.querySelector(`[data-invite-result="${n}"]`);i&&(i.classList.remove(`hidden`),i.innerHTML=`
        <span class="card-label">Invitación enviada · ${K(a)}</span>
        <p>${K(e.message||`Correo encolado para ${e.email||`el tutor`}.`)}</p>
        <p class="hint">El enlace de acceso viaja en el correo, no en esta pantalla ni en un chat. Si caduca, vuelve a generarlo con el mismo botón.</p>
      `)}catch(e){q(e?.message||`No se pudo crear la invitación. Revisa la conexión.`),l&&(l.disabled=!1,l.textContent=`Crear invitación`)}}async function md(e,t){if(!e||t.disabled)return;if(!G.querySelector(`[data-consent-ack]`)?.checked){q(`Marca la casilla “He leído y entiendo” antes de aceptar el aviso de privacidad.`);return}W.error=``,W.notice=``,t.disabled=!0,t.textContent=`Enviando…`;let n=W.dashboard?.privacy?.version||Ss;try{let{data:t,error:r}=await I.functions.invoke(`guardian-consent`,{body:{student_id:e,document_version:n,accepted:!0,acknowledged:!0}});if(r)throw r;if(t?.status!==`accepted`)throw Error(t?.error||`No se pudo registrar el consentimiento`);W.notice=`Consentimiento registrado. Gracias por confiar en nosotros.`,await Y(W.profile)}catch(e){q(await dc(e,`No se pudo registrar el consentimiento. Revisa la conexión e intenta de nuevo.`)),t.disabled=!1,t.textContent=`Aceptar y ver datos`}}async function hd(e,t,n){if(!e||n.disabled)return;let r=t?`a ${t}`:`a este alumno`;if(typeof window.confirm==`function`&&window.confirm(`¿Revocar el consentimiento ${r}? Dejarás de ver su información hasta que vuelvas a aceptar el aviso de privacidad.`)){W.error=``,W.notice=``,n.disabled=!0,n.textContent=`Revocando…`;try{let{data:t,error:n}=await I.functions.invoke(`guardian-consent`,{body:{student_id:e,revoke:!0,confirm:!0}});if(n)throw n;if(t?.status!==`revoked`)throw Error(t?.error||`No se pudo revocar el consentimiento`);W.notice=`Consentimiento revocado. La información del alumno ya no se muestra.`,await Y(W.profile)}catch(e){q(await dc(e,`No se pudo revocar el consentimiento. Intenta de nuevo.`)),n.disabled=!1,n.textContent=`Revocar consentimiento`}}}async function gd(){await I.auth.signOut(),Bs(),Gs(),W.session=null,W.profile=null,W.dashboard=null,W.dashboardError=``,W.error=``,W.notice=``,W.mode=`student`,Ms=null,Xs()}function _d(e){if(!e)return;if(G=e,Gs(),!Aa){Ys();return}let t=new URLSearchParams(window.location.search).get(`link_token`);t?(I.auth.signOut().catch(()=>{}),lc(t)):(Js(),document.addEventListener(`click`,e=>{e.target.closest(`#data-request-btn`)&&rc()}),window.addEventListener(`hashchange`,mc),I.auth.getSession().then(({data:e})=>{e.session?pc(e.session):Xs()}),I.auth.onAuthStateChange((e,t)=>{e===`SIGNED_OUT`?(Bs(),Gs(),W.session=null,W.profile=null,W.dashboard=null,W.dashboardError=``,W.view=`dashboard`,W.unitView=null,W.unitResults={},Ms=null,Xs()):e===`PASSWORD_RECOVERY`&&t?(async()=>{await pc(t),W.profile&&(W.passwordRecovery=!0,W.view=`change-password`,oc())})():t&&(e===`SIGNED_IN`||e===`TOKEN_REFRESHED`)&&pc(t)}))}_d(document.querySelector(`#app`));