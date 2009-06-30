function transparentia()
{
    this.id = "transparentia";
    var header = null;
    var sidebar = null;
    var body = null;
    var footer = null;

    this.init = function(conf) 
    {
        header = $("#theheader");
        if( header.length==0 )
            return false;

        body = $("#thecontent");
        if( body.length==0 )
            return false;

        sidebar = $( "#thesidebar" );
        if( sidebar.length==0 )
            return false;

        footer = $( "#thefooter" );
        if( footer.length==0 )
            return false;
		
        return true;
    }
    this.main = function() {}
    this.unload = function() { return false; }

    this.serviceRequest = function( res )
    {
        // see if this module is supposed to provide for this resource
        if( eval("this.prod."+res)!=undefined ) 
        {
            // valid resource request...
            if( res=="header" )
                return header;
            else if( res=="body" )
            {
                var newInsideContent = $('<div></div>');
                newInsideContent.addClass( 'insidecontent' );
                body.append(newInsideContent);
                return newInsideContent;
            }
            else if( res=="sidebar" )
            {
                var newSidebarItem = $('<div></div>');
                newSidebarItem.addClass('sidebar-item');
                sidebar.append(newSidebarItem);
                return newSidebarItem;
            }
            else if( res=="footer" )
                return footer;
        }
        else
            return null; // invalid resource request
    }
    this.req = {};
    this.prod = {
		header:		"header",
		sidebar:	"sidebar",
		footer:		"footer",
		body:		"body"
	};
}
