function scroller()
{
    this.SCROLLER_conf = null;
    this.id = "scroller";

    this.scroll_left = function()
    {
        var SCROLLER_conf = MM_get_resource("SCROLLER_conf");
	if( SCROLLER_conf==null ) return;

        if( SCROLLER_conf.scroll==true )
        {
            SCROLLER_conf.k = SCROLLER_conf.k+5;
            if( SCROLLER_conf.k>=SCROLLER_conf.width_array[SCROLLER_conf.width_counter] )
            {
                var initial_string = SCROLLER_conf.scrollingtext.substring( 
                        0, SCROLLER_conf.length_array[SCROLLER_conf.width_counter]
                );
                var later_string = SCROLLER_conf.scrollingtext.substring(
                        SCROLLER_conf.length_array[SCROLLER_conf.width_counter] );
                SCROLLER_conf.scrollingtext = later_string + initial_string;
    
                document.getElementById( 'scroll_inner_pre' ).innerHTML =
                        SCROLLER_conf.scrollingtext;

                SCROLLER_conf.obj.scrollLeft = SCROLLER_conf.k = 0;
                SCROLLER_conf.width_counter = 
                    (SCROLLER_conf.width_counter+1) % SCROLLER_conf.width_array.length;
                setTimeout( "var v=MM_get_resource('SCROLLER_left');if(v)v();",
                            SCROLLER_conf.string_wait );
            }	
            else
            {
                SCROLLER_conf.obj.scrollLeft = SCROLLER_conf.k;
                setTimeout( "var v=MM_get_resource('SCROLLER_left');if(v)v();",
                            SCROLLER_conf.speed_wait );
            }
        }
    } // end of scroll_left()
       
    this.scroll = function(div)
    {
        var i=0;    // the usual counter
        var m;      // used as a "global" variable for get_width()
        this.SCROLLER_conf.scrollingtext = "";
        this.SCROLLER_conf.width_counter = this.SCROLLER_conf.k = m = 0;

        // function that can get the "real world" width of any string
        // requires the conf obj to access the "textdiv"
        var get_width = function(str,conf)
        {
            var thePre = document.createElement( 'pre' );
            thePre.setAttribute( "style", conf.display_style );
            thePre.style.visibility="hidden";

            var theSpan = document.createElement( 'span' );
            theSpan.innerHTML = str;
        
            thePre.appendChild( theSpan );
            conf.obj.appendChild( thePre );
        
            conf.width_array[ m++ ] = theSpan.scrollWidth;
            conf.obj.removeChild(thePre);	
        }

        var temp = this.SCROLLER_conf.text_array.length;
        for(i=0 ; i<temp ; i++)
        {
            this.SCROLLER_conf.scrollingtext += this.SCROLLER_conf.text_array[i];
        }
    
        /*
         * //this has already been done in the initialization
         * this.SCROLLER_conf.obj= div;
         */
    
        // var temp = this.SCROLLER_conf.text_array.length; -> already the same value!
        for( i=0 ; i<temp ; i++ )
            get_width( this.SCROLLER_conf.text_array[i], this.SCROLLER_conf );
    
        var innerPre = document.createElement( 'pre' );
        innerPre.setAttribute( "id", "scroll_inner_pre" );
        innerPre.setAttribute( "style", this.SCROLLER_conf.display_style );
    
        innerPre.innerHTML = this.SCROLLER_conf.scrollingtext;
        this.SCROLLER_conf.obj.appendChild( innerPre );
    
        this.SCROLLER_conf.obj.scrollLeft=0;
        setTimeout( "var v=MM_get_resource('SCROLLER_left');if(v)v();",
                    this.SCROLLER_conf.init_wait );
    } /* end of scroll() */
    
    //all the routine stuff
    this.init = function(conf)
    {
	this.SCROLLER_conf = conf;
        this.container = MM_get_resource(this.req.placeholder );
        if(this.container == null)
            return false;

        // if no text is available to be displayed, our work is done already.
        if(this.SCROLLER_conf.text_array.length == 0)
            return true;

        // populate the conf.length_array[]
        var l = this.SCROLLER_conf.text_array.length;
        for(i=0 ; i<l ; i++)
        {		
            this.SCROLLER_conf.length_array[i]=this.SCROLLER_conf.text_array[i].length;
        }

        // NOTE: it is important to have a fixed width, as well as a hidden 
        //   overflow for the scrolling to work
        this.SCROLLER_textdiv = document.createElement("div");
        this.SCROLLER_conf.obj = this.SCROLLER_textdiv;

        this.container.style.overflow = 'hidden';
        this.container.style.height = '39px';

        this.SCROLLER_textdiv.style.width = '100%';
        this.SCROLLER_textdiv.style.height = '39px';
        this.SCROLLER_textdiv.style.overflow = 'hidden';
        this.SCROLLER_textdiv.style.fontSize = '12px';
        this.SCROLLER_textdiv.style.lineHeight = '39px';

        this.container.appendChild(this.SCROLLER_textdiv);
        return true;	
    }	
    
    this.unload = function()
    {
	this.SCROLLER_conf.scroll = false;
	this.container.removeChild( this.SCROLLER_textdiv );
	this.container.parentNode.removeChild( this.container );
	return true;
    }

    this.main = function()
    {
	this.SCROLLER_conf.scroll = true;
        this.scroll( this.SCROLLER_textdiv );
    }
    
    this.serviceRequest = function(res)
    {
        if(eval("this.prod."+res != undefined))
        {
            if(res == "SCROLLER_conf")
                return this.SCROLLER_conf;
            if(res == "SCROLLER_div")
                return this.SCROLLER_textdiv;
            if(res == "SCROLLER_left")
                return this.scroll_left;
        }
        return null;
    }

    this.req = {}; /* soft requirements sent in via conf */
    this.prod = {
		"SCROLLER_conf":	    "SCROLLER_conf",
		"SCROLLER_div":		    "SCROLLER_div", 
		"SCROLLER_change_image":    "SCROLLER_change_image",
		"SCROLLER_left":	    "SCROLLER_left"
	}

}
