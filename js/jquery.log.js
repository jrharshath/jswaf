(function($){
	$._doLog = function (msg) {
		if( !window.console ) { alert(msg); return; }
		else console.log(msg);
	}
	$.fn.log = function (msg) {
		$._doLog(msg);
		return this;
	};
	$.log = function(msg) {
		$._doLog(msg);
	};
	$.setLogger = function(doLog) {
		$._doLog = doLog;
	}
})(jQuery);