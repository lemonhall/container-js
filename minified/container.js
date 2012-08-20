define("containerjs/utils/deferred",[],function(){var f={then:function(){},always:function(){},done:function(){},fail:function(){},pipe:function(){},fixed:function(){},rejected:function(){},resolved:function(){}},c=function(){this.state=d.unresolved;this.result=null;this.successCallbacks=[];this.failCallbacks=[];Object.seal(this)};c.prototype.then=function(b,a){var i=new c;this.state.done.call(this,b,i);this.state.fail.call(this,a,i);return i};c.prototype.always=function(b){return this.then(b,b)};
c.prototype.done=function(b){var a=new c;this.state.done.call(this,b,a);return a};c.prototype.fail=function(b){var a=new c;this.state.fail.call(this,b,a);return a};c.prototype.resolve=function(b){this.state.resolve.call(this,b);return this};c.prototype.reject=function(b){this.state.reject.call(this,b);return this};c.prototype.fixed=function(){return this.rejected()||this.resolved()};c.prototype.rejected=function(){return this.state===d.rejected};c.prototype.resolved=function(){return this.state===
d.resolved};c.prototype.promise=function(){return Object.freeze({then:this.then.bind(this),done:this.done.bind(this),fail:this.fail.bind(this),always:this.always.bind(this),pipe:this.pipe.bind(this),fixed:this.fixed.bind(this),rejected:this.rejected.bind(this),resolved:this.resolved.bind(this)})};c.prototype.pipe=function(b,a){var i=new c;this.then(function(d){try{i.resolve(b?b(d):d)}catch(c){i.reject(a?a(c):c)}},function(b){try{b=a?a(b):b}catch(d){}i.reject(b)});return i.promise()};c.valueOf=function(b){var a=
new c;a.resolve(b);return a.promise()};c.errorOf=function(b){var a=new c;a.reject(b);return a.promise()};c.when=function(b){var a=new c,i=[];if(0===b.length)a.resolve(i);else{var d=b.length,e=function(b){a.fixed()||a.reject(b)};b.forEach(function(b,c){b.then(function(b){i[c]=b;0===--d&&!a.fixed()&&a.resolve(i)},e)})}return a.promise()};c.isPromise=function(b){for(var a in f)if(!b[a])return!1;return!0};c.pack=function(b,a,i){var d=new c;try{var e=b.apply(a,i);if(c.isPromise(e))return e;d.resolve(e)}catch(g){d.reject(g)}return d.promise()};
c.unpack=function(b){var a=null,i=null;b.then(function(b){a=b},function(a){i=a});if(i)throw i;return a};c.defer=function(b){return function(){return c.pack(b,this,arguments)}};c.lazy=function(b,a,i){var e=new c,g=function(){try{var d=b.apply(a,i);c.isPromise(d)?d.then(function(a){e.resolve(a)},function(a){e.reject(a)}):e.resolve(d)}catch(g){e.reject(g)}};e.state={done:function(a,b){d.unresolved.done.apply(this,arguments);this.state=d.unresolved;g()},fail:function(a,b){d.unresolved.fail.apply(this,
arguments);this.state=d.unresolved;g()},resolve:d.unresolved.resolve,reject:d.unresolved.reject};return e};var g=function(){throw Error("already resolved or rejected.");},h=function(b,a){var i,d;i=0;for(d=b.length;i<d;i++)b[i].call(null,a)},e=function(b,a){return function(d){try{var c=b(d);a.resolve(c)}catch(e){a.reject(e)}}},d={unresolved:{done:function(b,a){this.successCallbacks.push(e(b,a));return a},fail:function(b,a){this.failCallbacks.push(e(b,a));return a},resolve:function(b){this.result=b;
this.state=d.resolved;h(this.successCallbacks,b);this.successCallbacks=void 0},reject:function(b){this.result=b;this.state=d.rejected;h(this.failCallbacks,b);this.failCallbacks=void 0}},resolved:{done:function(b,a){e(b,a)(this.result)},fail:function(){},resolve:g,reject:g},rejected:{done:function(){},fail:function(b,a){e(b,a)(this.result)},resolve:g,reject:g}};return c});
define("containerjs/loader",["containerjs/utils/deferred"],function(f){return Object.freeze({load:function(c){var g=new f,h=require.onError;try{require.onError=function(d){require.onError=h;g.reject(d);h&&h(d)},require([c],function(d){g.resolve(d);require.onError=h})}catch(e){g.reject(e),require.onError=h}return g}})});
define("containerjs/scope",["containerjs/utils/deferred"],function(f){var c=function(c,e){return c.singletonComponents[e.id]||(c.singletonComponents[e.id]=c.createComponent(e))},g=function(c,e){var d=c.singletonComponents[e.id];d&&f.unpack(d.then(function(b){e.destroy(b,c)}))},c={SINGLETON:Object.freeze({retrievingStrategy:c,destructionStrategy:g,createOnStartUp:!1}),EAGER_SINGLETON:Object.freeze({retrievingStrategy:c,destructionStrategy:g,createOnStartUp:!0}),PROTOTYPE:Object.freeze({retrievingStrategy:function(c,
e){return c.createComponent(e)},destructionStrategy:function(){},createOnStartUp:!1})};return Object.freeze(c)});define("containerjs/key",["containerjs/utils/deferred"],function(f){var c={get:function(){},create:function(g,h,e){return Object.freeze(Object.create(c,{get:{value:function(d){d=h?d.gets(g):d.get(g);return e?f.valueOf(d):d}}}))}};Object.freeze(c);return c});
define("containerjs/inject",["containerjs/key"],function(f){var c=function(c){return f.create(c,!1,!1)};c.lazily=function(c){return f.create(c,!1,!0)};c.all=function(c){return f.create(c,!0,!1)};c.all.lazily=function(c){return f.create(c,!0,!0)};Object.freeze(c);return c});
define("containerjs/utils/asserts",[],function(){var f={assertNotNull:function(c,g){if(null==c)throw Error(g+" is null or undefined.");},assertNotEmpty:function(c,g){f.assertNotNull(c,g);if(""===c)throw Error(g+" is empty string.");},assertValueIsFunction:function(c,g){f.assertNotNull(c,g);if("function"!==typeof c)throw Error(g+" is not function.");}};return Object.freeze(f)});
define("containerjs/bindings/binding",["containerjs/inject","containerjs/key","containerjs/scope","containerjs/utils/asserts","containerjs/utils/deferred"],function(f,c,g,h,e){var d=function(b){h.assertNotNull(b.id,"id");h.assertNotEmpty(b.name,"name");this.id=b.id;this.name=b.name;this.scope=b.scope||g.SINGLETON;this.injectionProperties=b.injectionProperties||{};this.destructor=this.initializer=void 0};d.prototype.getInstance=function(){};d.prototype.initialize=function(b,a){this.initializer&&this.initializer(b,
a)};d.prototype.destroy=function(b,a){this.destructor&&this.destructor(b,a)};d.prototype.injectProperties=function(b,a){var d=this.collectInjectionProperties(b);return this.resolveProperties(d,a).pipe(function(a){for(var d in a)a.hasOwnProperty(d)&&(b[d]=a[d]);return b}.bind(this))};d.prototype.collectInjectionProperties=function(b){var a={};this.collectFromModuleDefinition(a,this.injectionProperties);this.collectFromComponent(a,b);return a};d.prototype.collectFromModuleDefinition=function(b,a){for(var d in a)a.hasOwnProperty(d)&&
(b[d]=a[d])};d.prototype.collectFromComponent=function(b,a){for(var d in a){var c=a[d];this.isInjectionProperty(c)&&(b[d]=c)}};d.prototype.isInjectionProperty=function(b){return b&&c.isPrototypeOf(b)?!0:b===f||b===f.all||b===f.lazily||b===f.all.lazily?!0:!1};d.prototype.resolveProperty=function(b,a,d){return b&&c.isPrototypeOf(b)?b.get(a):b===f||b===f.all||b===f.lazily||b===f.all.lazily?(h.assertNotNull(d,"name"),b(d).get(a)):e.valueOf(b)};d.prototype.resolveProperties=function(b,a,d){var c=[];if(!b)return e.valueOf(b);
if(b.forEach)return b.forEach(function(b){c.push(this.resolveProperty(b,a))}),e.wait(c);var g=[],f;for(f in b)b.hasOwnProperty(f)&&(g.push(f),c.push(this.resolveProperty(d?b[f][d]:b[f],a,f)));return e.when(c).pipe(function(a){for(var c={},e=0;e<g.length;e++){var f=g[e];d?(b[f][d]=a[e],c[f]=b[f]):c[f]=a[e]}return c})};Object.seal(d.prototype);return d});
define("containerjs/packaging-policy",["containerjs/utils/asserts","containerjs/utils/deferred"],function(f,c){var g={retrieve:c.defer(function(d,b,a){f.assertNotEmpty(b,"componentName");a=a||this.resolveModuleFor(b);f.assertNotEmpty(a,"moduleName");return d.load(a).pipe(function(d){if(!(d=d&&this.findComponent(d,b)))throw Error("componenet '"+b+"' is not found in module '"+a+"'.");return d}.bind(this))})},h={};h.MODULE_PER_PACKAGE=Object.freeze(Object.create(g,function(){var d=function(b){if(/^\\.+$/.test(b))throw Error("invalid component name. componentName="+
String(b));};return{resolveModuleFor:{value:function(b){d(b);var a=b.lastIndexOf(".");if(-1===a||a+1>=b.length)throw Error("componentName does not contain a package.");b=b.substring(0,b.lastIndexOf("."));return e(b)}},findComponent:{value:function(b,a){var c;d(a);c=a.substring(a.lastIndexOf(".")+1);return b[c]}}}}()));h.MODULE_PER_CLASS=Object.freeze(Object.create(g,{resolveModuleFor:{value:function(d){return e(d)}},findComponent:{value:function(d){return d}}}));h.SINGLE_FILE=Object.freeze(Object.create(g,
{resolveModuleFor:{value:function(d){return e(d.split(".")[0])}},findComponent:{value:function(d,b){for(var a=b.split("."),c=d,e=1;e<a.length&&c;e++)c=c[a[e]];return c}}}));h.DEFAULT=h.MODULE_PER_CLASS;var e=function(d){return d.replace(/\./g,"/").replace(/([a-z])(?=[A-Z])/g,"$1-").toLowerCase()};return Object.freeze(h)});
define("containerjs/bindings/module-binding",["containerjs/bindings/binding","containerjs/packaging-policy"],function(f,c){var g=function(f){this.module=f.module||void 0;this.packagingPolicy=f.packagingPolicy||c.DEFAULT};g.prototype=Object.create(f.prototype);g.prototype.load=function(c){return this.packagingPolicy.retrieve(c,this.componentName(),this.module)};g.prototype.componentName=function(){};Object.seal(g.prototype);return g});
define("containerjs/bindings/prototype-binding",["containerjs/bindings/binding","containerjs/bindings/module-binding","containerjs/utils/asserts","containerjs/utils/deferred"],function(f,c,g,h){var e=function(d){g.assertNotNull(d.prototype,"prorotype");f.call(this,d);c.call(this,d);this.prototype=d.prototype;this.prototypeProperties=d.prototypeProperties||void 0};e.prototype=Object.create(c.prototype);e.prototype.getInstance=function(d){var b=new h,a=function(a){b.reject(a)};this.load(d.loader).then(function(c){this.resolveProperties(this.prototypeProperties,
d,"value").then(function(e){var f=Object.create(c,e);this.injectProperties(f,d).then(function(){b.resolve(f)},a).fail(a)}.bind(this),a).fail(a)}.bind(this),a).fail(a);return b};e.prototype.componentName=function(){return this.prototype};e.prototype.resolvePrototypeProperties=function(d,b){var a={},c;for(c in d)a[c]=this.resolve(d[c].value,b,c);return a};Object.freeze(e.prototype);return e});
define("containerjs/bindings/constructor-binding",["containerjs/bindings/binding","containerjs/bindings/module-binding","containerjs/utils/asserts","containerjs/utils/deferred"],function(f,c,g,h){var e=function(d){g.assertNotNull(d.constructor,"constructor");f.call(this,d);c.call(this,d);this.constructor=d.constructor;this.constructorArgument=d.constructorArgument||void 0};e.prototype=Object.create(c.prototype);e.prototype.getInstance=function(d){var b=new h,a=function(a){b.reject(a)};this.load(d.loader).then(function(c){this.resolveProperties(this.constructorArgument,
d).then(function(e){var f=new c(e);this.injectProperties(f,d).then(function(){b.resolve(f)},a).fail(a)}.bind(this),a).fail(a)}.bind(this),a).fail(a);return b};e.prototype.componentName=function(){return this.constructor};Object.freeze(e.prototype);return e});
define("containerjs/bindings/object-binding",["containerjs/bindings/binding","containerjs/bindings/module-binding","containerjs/utils/asserts","containerjs/utils/deferred"],function(f,c,g,h){var e=function(d){g.assertNotNull(d.object,"object");f.call(this,d);c.call(this,d);this.object=d.object};e.prototype=Object.create(c.prototype);e.prototype.getInstance=function(d){var b=new h,a=function(a){b.reject(a)};this.load(d.loader).then(function(c){this.injectProperties(c,d).then(function(){b.resolve(c)},
a).fail(a)}.bind(this),a).fail(a);return b};e.prototype.componentName=function(){return this.object};Object.freeze(e.prototype);return e});define("containerjs/bindings/instance-binding",["containerjs/bindings/binding","containerjs/utils/deferred"],function(f){var c=function(c){f.call(this,c);this.instance=c.instance};c.prototype=Object.create(f.prototype);c.prototype.getInstance=function(c){return this.injectProperties(this.instance,c)};Object.freeze(c.prototype);return c});
define("containerjs/bindings/provider-binding",["containerjs/bindings/binding","containerjs/utils/deferred","containerjs/utils/asserts"],function(f,c,g){c=function(c){g.assertValueIsFunction(c.provider,"provider");f.call(this,c);this.provider=c.provider};c.prototype=Object.create(f.prototype);c.prototype.getInstance=function(c){return this.injectProperties(this.provider(c),c)};Object.freeze(c.prototype);return c});
define("containerjs/bindings/binding-factory",["containerjs/bindings/prototype-binding","containerjs/bindings/constructor-binding","containerjs/bindings/object-binding","containerjs/bindings/instance-binding","containerjs/bindings/provider-binding"],function(f,c,g,h,e){var d=function(b){return{value:function(a){a.id=this.serial++;return Object.seal(new b(a))}}};return Object.seal(Object.create({createPrototypeBinding:function(){},createConstructorBinding:function(){},createObjectBinding:function(){},
createInstanceBinding:function(){},createPrvoiderBinding:function(){}},{createPrototypeBinding:d(f),createConstructorBinding:d(c),createObjectBinding:d(g),createInstanceBinding:d(h),createProviderBinding:d(e),serial:{value:0,writable:!0}}))});
define("containerjs/binding-builders",["containerjs/bindings/binding-factory"],function(f){var c={to:function(a){this.reference.set(f.createConstructorBinding({name:this.reference.get().name,constructor:a,packagingPolicy:this.reference.get().packagingPolicy}));return b(j,this.reference)},toPrototype:function(a,c){this.reference.set(f.createPrototypeBinding({name:this.reference.get().name,prototype:a,prototypeProperties:c,packagingPolicy:this.reference.get().packagingPolicy}));return b(i,this.reference)},
asPrototype:function(a){this.reference.set(f.createPrototypeBinding({name:this.reference.get().name,prototype:this.reference.get().name,prototypeProperties:a,packagingPolicy:this.reference.get().packagingPolicy}));return b(i,this.reference)},toObject:function(a){this.reference.set(f.createObjectBinding({name:this.reference.get().name,object:a,packagingPolicy:this.reference.get().packagingPolicy}));return b(i,this.reference)},asObject:function(){this.reference.set(f.createObjectBinding({name:this.reference.get().name,
object:this.reference.get().name,packagingPolicy:this.reference.get().packagingPolicy}));return b(i,this.reference)},toInstance:function(a){this.reference.set(f.createInstanceBinding({name:this.reference.get().name,instance:a}));return b(e,this.reference)},toProvider:function(a){this.reference.set(f.createProviderBinding({name:this.reference.get().name,provider:a}));return b(e,this.reference)}},g={withConstructorArgument:function(a){this.reference.get().constructorArgument=a;return b(i,this.reference)}},
h={loadFrom:function(a){this.reference.get().module=a;return this},assign:function(a){a&&(this.reference.get().packagingPolicy=a);return this}},e={withProperties:function(a){this.reference.get().injectionProperties=a;return this},onInitialize:function(a){this.reference.get().initializer=d(a);return this},onDestroy:function(a){this.reference.get().destructor=d(a);return this},inScope:function(a){this.reference.get().scope=a;return this}},d=function(a){return"string"===typeof a?function(b){b[a](b)}:
function(b){a.call(null,b)}},b=function(a,b){return Object.freeze(Object.create(a,{reference:{value:b}}))},a=function(){for(var a={},b=0,c=arguments.length;b<c;b++){var d=arguments[b],e;for(e in d)a[e]=d[e]}return a},i=a(e,h),j=a(g,i),a=a(c,j);Object.freeze(c);Object.freeze(g);Object.freeze(e);Object.freeze(h);Object.freeze(a);Object.freeze(j);Object.freeze(i);return{RootBuilder:a}});
define("containerjs/aspect",[],function(){var f=function(c,d){this.interceptor=c;this.matcher=d;Object.freeze(this)},c=f.prototype;c.weave=function(c,d){var b=this.isEnhancedObject(d)?Object.getPrototypeOf(d):d,a={};return this.collectAndCreateEnhancedMethod(c,d,b,a)?(a[h]={value:!0},Object.create(d,a)):d};c.collectAndCreateEnhancedMethod=function(c,d,b,a){var i=this.collectFromEnumerableProperties(c,d,b,a);return this.collectFromNonEnumerableProperties(c,d,b,a)||i};c.collectFromEnumerableProperties=
function(c,d,b,a){var i=!1,f;for(f in b)i=this.checkAndCreateEnhancedMethod(c,d,a,f)||i;return i};c.collectFromNonEnumerableProperties=function(c,d,b,a){var f=!1;Object.getOwnPropertyNames(b).forEach(function(g){Object.getOwnPropertyDescriptor(b,g).enumerable||(f=this.checkAndCreateEnhancedMethod(c,d,a,g)||f)}.bind(this));var g=Object.getPrototypeOf(b);g&&(f=this.collectFromNonEnumerableProperties(c,d,g,a)||f);return f};c.checkAndCreateEnhancedMethod=function(c,d,b,a){if(!("function"!==typeof d[a]||
this.matcher&&!this.matcher(c,d,a))){c=d[a];if(this.isEnhancedMethod(c))return c[g].push(this.interceptor),!1;if(this.isEnhancedObject(d))return Object.defineProperty(d,a,this.createEnhancedMethod(d,a)),!1;b[a]=this.createEnhancedMethod(d,a);return!0}};c.createEnhancedMethod=function(c,d){var b=c[d],a=[this.interceptor],f=function(){var c=0,e=[];e.push.apply(e,arguments);var f=Object.freeze({self:this,methodName:d,proceed:function(){return c<a.length?a[c++].call(null,f):b.apply(f.self,f.arguments)},
arguments:e,context:{}});return f.proceed()};f[g]=a;return{value:f}};c.isEnhancedMethod=function(c){return!!c[g]};c.isEnhancedObject=function(c){return!!c[h]};var g="$ContainerJS.interceptors",h="$ContainerJS.enhanced";return f});
define("containerjs/binder",["containerjs/scope","containerjs/bindings/binding-factory","containerjs/binding-builders","containerjs/packaging-policy","containerjs/aspect"],function(f,c,g,h,e){var d,f=function(){this.bindings={};this.aspects=[];this.defaultPackagingPolicy=h.DEFAULT;Object.freeze(this)},b=f.prototype;b.bind=function(a){var b=this.getBindingsFor(a),b=Object.freeze(Object.create(d,{bindings:{value:b},index:{value:b.length}}));b.set(c.createConstructorBinding({name:a,constructor:a,packagingPolicy:this.defaultPackagingPolicy}));
return Object.freeze(Object.create(g.RootBuilder,{reference:{value:b}}))};b.bindInterceptor=function(a,b){this.aspects.push(new e(a,b))};b.setDefaultPackagingPolicy=function(a){this.defaultPackagingPolicy=a;return this};b.buildBindings=function(){var a,b,c;for(b in this.bindings)if(this.bindings.hasOwnProperty(b)){var d=this.bindings[b];a=0;for(c=d.length;a<c;a++)Object.freeze(d[a])}return this.bindings};b.buildAspects=function(){return this.aspects};b.getBindingsFor=function(a){return this.bindings[a]||
(this.bindings[a]=[])};d={index:-1,bindings:[],set:function(a){this.bindings[this.index]=a},get:function(){return this.bindings[this.index]}};Object.freeze(f.prototype);return f});
define("containerjs/container",["containerjs/loader","containerjs/binder","containerjs/scope","containerjs/utils/deferred"],function(f,c,g,h){var g=function(a){this.creating=[];this.singletonComponents={};this.chainedContainer=null;this.load(a,this);this.loader=f;this.createEagerSingletonConponents(this);Object.seal(this)},e=g.prototype;e.get=function(a){return h.lazy(d,this,arguments)};var d=function(a){var b=null;try{b=this.getBinding(a)}catch(c){return this.chainedContainer?this.chainedContainer.get(a):
h.errorOf(c)}return b.scope.retrievingStrategy(this,b)};e.gets=function(a){return h.lazy(b,this,arguments)};var b=function(a){var b=null;try{b=this.getBindings(a)}catch(c){return this.chainedContainer?this.chainedContainer.gets(a):h.errorOf(c)}b=b.map(function(a){return a.scope.retrievingStrategy(this,a)}.bind(this));if(this.chainedContainer&&this.chainedContainer.hasBindings(a)){var d=new h,e=function(a){d.reject(a)};h.when(b).then(function(b){this.chainedContainer.gets(a).then(function(a){d.resolve(b.concat(a))},
e)}.bind(this),e);return d}return h.when(b)};e.getBinding=function(a){return this.getBindings(a)[0]};e.getBindings=function(a){if(this.hasBindings(a))return this.bindings[a];throw Error("component is not binded. name="+a);};e.hasBindings=function(a){return(a=this.bindings[a])&&0<a.length};e.destroy=function(){for(var a in this.bindings)this.bindings[a].forEach(function(a){a.scope.destructionStrategy(this,a)}.bind(this)),delete this.singletonComponents[a]};e.chain=function(a){this.chainedContainer=
a};e.createComponent=h.defer(function(a){this.checkCyclicDependency(a);this.creating.push({id:a.id,name:a.name});return a.getInstance(this).pipe(function(b){try{return this.aspects.forEach(function(c){b=c.weave(a,b)}),a.initialize(b,this),b}finally{this.creating.pop()}}.bind(this),function(a){this.creating.pop();return a}.bind(this))});e.checkCyclicDependency=function(a){if(this.creating.some(function(b){return b.id===a.id}))throw Error("detect cyclic dependency.\n  -> "+this.creating.map(function(a){return a.name}).concat([a.name]).join("\n  -> "));
};e.load=function(a){var b=new c;a.call(null,b);this.bindings=b.buildBindings();this.aspects=b.buildAspects()};e.createEagerSingletonConponents=function(){var a=function(a){a.scope.createOnStartUp&&a.scope.retrievingStrategy(this,a)}.bind(this),b;for(b in this.bindings)this.bindings[b].forEach(a)};Object.freeze(e);return g});
define("container",["containerjs/container","containerjs/scope","containerjs/inject","containerjs/packaging-policy","containerjs/utils/deferred"],function(f,c,g,h,e){f={VERSION:"1.0.0",Container:f,Scope:c,Inject:g,PackagingPolicy:h,utils:Object.freeze({Deferred:e})};Object.freeze(f);return f});