function pagecontent()
{
    this.id = 'pagecontent';
	this.conf = null;
    this.unload = function() { return true; }
    this.init   = function(conf){ this.conf = conf; return true; }
    this.main   = function() {
		var h = $.jswaf.getResource('header');
		h.text(this.conf.headertext);
		
		var f=$.jswaf.getResource('footer');
		f.text(this.conf.footertext);
		
		var navlink = $.jswaf.getResource('navigation');
		navlink.attr({ href: this.conf.nav.href });
		navlink.text(this.conf.nav.text);
    }
    this.serviceRequest = function(res) { return null; }
	this.req={header:'', footer:'', navigation:''};
	this.prod={};
}
