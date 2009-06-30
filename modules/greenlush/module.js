function greenlush() {
    this.id = "greenlush";
    this.header = null;
    this.sidebar = null;
    this.body = null;
    this.footer = null;
    this.nav = null;

    this.init = function(conf) {
        this.header = $('#header');
		if( this.header.length==0 ) return false;

        this.body = $('#maincontent');
		if( this.header.length==0 ) return false;

        this.sidebar = $('#sidebar');
		if( this.header.length==0 ) return false;

        this.footer = $('#footer');
		if( this.header.length==0 ) return false;

        this.nav = $('#menu ul');
		if( this.header.length==0 ) return false;

        return true;
    }
    this.main = function() {}
    this.unload = function() { return false; }

    this.serviceRequest = function( res ) {
        if( this.prod[res]==undefined )
			return null;

        if( res=="header" ){
			return this.header;
        } else if( res=="body" ) {
			var bodyitem = $('<div></div>');
			bodyitem.attr({'class':'insidecontent'});
            this.body.append(bodyitem);
            return bodyitem;
        } else if( res=="sidebar" ) {
			var sidebaritem = $('<div></div>');
			sidebaritem.attr({'class':'sidebar-item'});
            this.sidebar.append(sidebaritem);
            return sidebaritem;
        } else if( res=="footer" ) {
			var footeritem = $('<div></div>');
			this.footer.append(footeritem);
			return footeritem;
        } else if( res=='navigation' ) {
			var li = $('<li></li>');
			var link = $("<a href='#'></a>");
			li.append(link);
			this.nav.append(li)
			return link;
	    }
    }
    
    this.req = {}
    this.prod = { 
		"header":"header", 
		"sidebar":"sidebar", 
		"footer":"footer", 
		"body":"body",
		"navigation":"navigation"
	}

}
