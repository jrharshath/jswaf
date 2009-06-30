function sidebarnotify()
{
    this.id = 'sidebarnotify';
    this.req = {sidebar:''};
    this.prod = {sidebarnotify:''};
    this.unload = function() {return true;}
    this.init   = function(conf) { return true; }

	var $div = null;
    this.main   = function()
    {
       $div = $.jswaf.getResource('sidebar');
    }
    this.serviceRequest = function(res)
    {
        if(res == 'sidebarnotify')
            return this.showpopup;
        return null;
    }
	this.showpopup = function(msg)
    {
        $div.text(msg);
    }
}
