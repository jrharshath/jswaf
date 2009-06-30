/*
 * Depends:
 * var MM_conf	- is recieved from the current theme
 * jQuery		- from jquery.js
 * jQuery.log	- jquery.log.js
 */
!window.$j && (function($){
	$.jswaf = {};
	$j = $.jswaf
	var resources={},
	    modules={},
	    depends={};
	var WAIT_TIME_MS=300; // time to wait between checks for loaded module
	$j.logInternals = function() { $.log(resources); $.log(modules); $.log(depends); }
	function ModuleWrapper(id, conf, obj) {
		this.id = id;
		this.conf = conf;
		this.moduleObject = obj;
	}
	function getModulePath(conf) { return "../modules/"+conf.id+"/module.js";	}
	function fetchModule(path,callback) {
		$.ajax({
			type: "GET",
			url: path,
			success: callback,
			error: callback,
			dataType: "script"
		});
	}
	function moduleExists(id) { return window[id]!=undefined; }
	function handleUnfetchedModules(unfetchedModuleNamesArray) { 
		var message = "The following modules could not be instantiated:\n";
		message += unfetchedModuleNamesArray.join(',');
		message += "\n Do you want to continue?";
		return confirm(message);
	}
	function augmentResources(resList, module) {
		for( res in resList )
			resources[res] = module;
	}
	function moduleNotAvailable(id) { $.log( "module '"+id+"' not available!" ); }
	function moduleIsValid(obj, id) {
		return !(!obj.id || obj.id!=id || !obj.init || !obj.main || !obj.unload || 
		!obj.serviceRequest || obj.req==undefined || obj.prod==undefined);
	}
	function handleInvalidModule(i){$.log("module '"+i+"' is invalid, and shall not be loaded." );}
	
	function canInitializeModule(module) {
		for( req in module.req )
			if(resources[req]==undefined) return false;
		return true;
	}
	function handleInadequateResources(i){
		$.log("module '"+i+"' cannot be loaded because its requruirements are not available");
	}
	function handleFailedInitalization(i){ $.log("module '"+i+"' failed during initialization");}
	function addModule(id,obj) { modules[id]=obj; }
	function startModule(obj){ obj.main(); }
	
	$.jswaf.loadModule = function(conf) {
		var path = getModulePath(conf);
		var done = false;
		fetchModule(path,resetDone);
		function resetDone(){ done=true; }
		(function wait(c) {
			if( !done ) { setTimeout( function(){wait(c);} , WAIT_TIME_MS); return; }
			c();
		})(function() {
		var id = conf.id;
		if( !moduleExists(id) ) { moduleNotAvailable(conf.id); return; }
		var obj = new window[id]();
		if( !moduleIsValid(obj,id) ){ handleInvalidModule(id); return; }
		if( !canInitializeModule(obj) ){ handleInadequateResources(id); return; }
		if( !obj.init(conf.conf) ){ handleFailedInitalization(id); return; }
		augmentResources( obj.prod, obj );
		addModule(conf.id, obj);
		startModule(obj);
		// #todo: update depends
	});}
	$.jswaf.loadBatch = function(confList) {
		var sync_count = 0;
		function fetchedOne() {sync_count--;}
		for(confIndex in confList) {
			var path = getModulePath(confList[confIndex]);
			sync_count ++;
			fetchModule(path,fetchedOne);
		}
		(function wait(c) {
			if( sync_count!= 0 ) {
				setTimeout( function(){wait(c)}, WAIT_TIME_MS ); return;
			} c();
		})(function() {
		function filterDuplicateModules(c){}
		filterDuplicateModules(confList); //#todo implement this method
		var result = getFetchedAndUnfetchedModules(confList);
		var modulesNotFetched = result.notFetched;

		if( modulesNotFetched.length != 0 ) {
			var toContinue = handleUnfetchedModules( modulesNotFetched );
			if( !toContinue ) return;
		}

		var moduleWrapperList = result.fetched;
		var invalids = filterInvalidModules(moduleWrapperList);
		if( invalids ) if(abortBecauseOfInvalids(invalids)) return; 
		var result = initializeAndAugmentModulesAndResources(moduleWrapperList);
		
		var newModules = result.newModules;
		var newResources = result.newResources;
		var failedModuleIds = result.failedModuleIds;
		
		// #todo: handle failed modules
		
		batchAugmentResources(newResources);
		batchAugmentModules(newModules);
		
		depends = generateModuleDependencies();
		for( ind in newModules)
			newModules[ind].main();
		});
		
		function getFetchedAndUnfetchedModules(confList) {
			var mnf = []; var mnfi=0;
			var moduleWrapperList = {};
			var index;
			for( confIndex in confList ) {
				var confItem = confList[confIndex];
				var moduleId = confItem.id;
				if( window[moduleId]==undefined ) {
					$.log( "module '"+moduleId+"' not available!" );
					mnf[mnfi++] = moduleId;
				} else { // instantiate the module object, and store it in jswaf object
					var moduleConf = confItem.conf;
					var obj = new window[moduleId]();
					var moduleWrapper = new ModuleWrapper( moduleId, moduleConf, obj );
					moduleWrapperList[ moduleId ] = moduleWrapper;
				}
			}
			return { notFetched: mnf, fetched: moduleWrapperList };
		}
		function filterInvalidModules(mwl) {
			var invalidIds = []; var i=0;
			for( id in mwl ) {
				var mw = mwl[ id ];
				var obj = mw.moduleObject;
				if( !moduleIsValid(obj,id) ) {
					$.log( "module '"+id+"' is invalid, and shall not be loaded." );
					invalidIds[i++]=id;
					delete mwl[id];
				} 
			}
			if(i==0)return false; else invalidIds;
		}
		function abortBecauseOfInvalids(inv) {
			var message = "The following modules were found to be invalid:\n";
			message += unfetchedModuleNamesArray.join(',');
			message += "\n Do you want to continue and load the rest of them?";
			return confirm(message);
		}
		function initializeAndAugmentModulesAndResources(mwl) {
			addSoftRequirements(mwl);
			var newModules = {}, failedModuleIds=[], fmInd=0;;
			var newResources = {}; 
			var mwlIndex, wrapper, id, module; // temps
			var doOneMorePass = true;
			
			while(doOneMorePass) { doOneMorePass = false;
			for( mwlIndex in mwl ) {
				wrapper = mwl[mwlIndex];
				id = wrapper.id;
				module = wrapper.moduleObject;
				if( canInitializeModuleInBatch(module,newResources) ) {
					var moduleInitSucceeded = module.init(wrapper.conf);
					if( moduleInitSucceeded ) {
						doOneMorePass = true;
						for( res in module.prod ) newResources[res] = module; // #todo check for duplication of resources!
						newModules[id] = module; // #todo check for duplication of module id!
					} else 
						failedModuleIds[fmInd++]=id;
					delete mwl[mwlIndex];
				}
			}}
			return { newModules: newModules, newResources: newResources, failedModuleIds: failedModuleIds };
		}
		function addSoftRequirements(mwl) {
			for( index in mwl ) {
				var wrapper = mwl[index];
				var module = wrapper.moduleObject;
				if( wrapper.conf._req ) {
					softreq = wrapper.conf._req;
					for( k in softreq )
						module.req[k] = softreq[k];
				}
			}
		}
		function canInitializeModuleInBatch(mod,newRes) {
			for( req in mod.req )
				if( !resources[req] && !newRes[req] ) return false;
			return true;
		}
	}
	function batchAugmentResources(resModList) {
		for( res in resModList )
			resources[res] = resModList[res];
	}
	function batchAugmentModules(idModList) {
		for( id in idModList )
			modules[id] = idModList[id];
	}
	function generateModuleDependencies() {
		var d={};
		for( dependent_id in modules ) {
			var dependent = modules[ dependent_id ];
			for( req in dependent.req ) {
				var dependee_id = resources[req].id;
				if( !d[dependee_id] ) d[dependee_id] = [dependent_id];
				else d[dependee_id][ d[dependee_id].length ] = dependent_id;
			}
		}
		return d;
	}
	$.jswaf.getResource = function(res) {
		if( !resources[res] ) return null;
		return resources[res].serviceRequest(res);
	}
	function getThemePath(theme) { return "../themes/"+theme.id+"/"; }
	$.jswaf.loadTheme = function(theme) {
		var path = getThemePath(theme);
		$.get(path+"theme.js", function(data) {
		var conf = eval(data);
		var css = conf.css;
		for( i in css )
			$.getCSS( path+css[i] );
		$.get(path+conf.body,function(d){
		$('body').prepend(d);
		});		
	});}
})(jQuery);