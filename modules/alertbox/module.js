function alertbox()
{
    this.id = 'alertbox';
    this.unload = function()
    {
        return true;
    }
    this.init   = function(conf)
    {
		return true;
    }
    this.main   = function()
    {
    }
    this.showpopup = function(data)
    {
		alert(data);
    }
    this.serviceRequest = function(res)
    {
        if(res == 'alertbox')
            return this.showpopup;
        return null;
    }
	this.req={};
	this.prod={alertbox:''};
}
