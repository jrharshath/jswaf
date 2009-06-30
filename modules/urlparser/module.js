function urlparser() {
    this.id = 'urlparser';
    this.prod = {url:'url', parserfunction:'parserfunction'};
    this.req  = {};
    this.result = null;
    this.init = function(conf) {
		this.result = this.urlparse( window.location.href );
		return true;
    }
    this.main = function () {}
    this.unload = function(){return true;}
	
    this.serviceRequest = function( res ) {
		if( res=='url' ) {
			this.result = this.urlparse( window.location.href );
			return this.result;
		} else if( res=='parserfunction' ) {
			return this.urlparse;
		} else
			return null;
    }
	
    this.urlparse = function( str ) {
		var arr = str.split('#');

		var result = new Array();
		var ctr=0;
		for( partIndex in arr ) {
			var part = arr[partIndex];
			var qindex = part.indexOf('?');
			result[ctr] = {};
			if( qindex==-1 ) {
				result[ctr].mid = part;
				result[ctr].args = [];
				ctr++;
				continue;
			}
			result[ctr].mid = part.substring(0,qindex);
			var args = part.substring(qindex+1);
			args = args.split('&');
			var localctr = 0;
			result[ctr].args = new Array();
			for ( valIndex in args ) {
				var val = args[valIndex];
				var keyval = val.split('=');
				result[ctr].args[localctr] = new Object();
				result[ctr].args[localctr].key = keyval[0];
				result[ctr].args[localctr].value = keyval[1];
				localctr++;
			}
			ctr++;
		}
		return result;
    }
}

