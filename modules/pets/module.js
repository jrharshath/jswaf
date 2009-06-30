function pets() {
    this.id = "pets";
    this.header = null;
    this.sidebar = null;
    this.body = null;
    this.footer = null;
    this.nav = null;

    this.init = function(conf) {
        this.header = $("#logo");
        if( this.header.length==0 )
            return false;
        this.body = $( "#left-column" );
        if( this.body.length==0)
            return false;
        this.sidebar = $( "#sidebar" );
        if( this.sidebar.length==0)
            return false;
        this.footer = $( "#footer" );
        if( this.footer.length==0)
            return false;
        this.nav = $( "#nav" );
        if( this.nav.length==0)
            return false;

        return true;
    }
    this.main = function() {}
    this.unload = function() { return false; }

    this.serviceRequest = function( res ) {
        if( this.prod[res] == undefined ) 
			return null;
        
		if( res=="header" )
			return this.header;
		else if( res=="body" ) {
			var newbox = $('<div></div>');
			newbox.addClass('box');
			this.body.append(newbox);
			return newbox;
		} else if( res=="sidebar" ) {
			var newbox = $('<div></div>');
			newbox.addClass('box');
			this.sidebar.append(newbox);
			return newbox;
		} else if( res=="footer" )
			return this.footer;
	    else if( res=="navigation" ) {
			var newlink = $('<a></a>');
			newlink.attr({'href':'#'});
			this.nav.append( newlink );
			return newlink;
		}
    }
    this.req = {}
    this.prod = {
		"header":	    "header",
		"sidebar":	    "sidebar",
		"footer":	    "footer",
		"body":	    "body",
		"navigation":   "navigation"
	}
}
