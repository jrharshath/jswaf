/*
 * locate the object in module having id=@arg{id}, and unload it.
 * DONT remove its productions from the MM_avail_res! just set MM_module_loaded[j] = false.
 * if recursive==false: if other modules depend on its productions, it will not be unloaded.
 * else: all depending modules will be unloaded.
 */
function MM_unload_module( id, recursive )
{
    if( !id ){ MM_log( "invalid call to MM_unload_module!" ); return false; }
    if( recursive==undefined )
    {
	recursive = false;
	MM_log( "using default value for 'recursive' while unloading module "+id );
    }
	
    var index = MM_module_id[ id ];
    var obj = null;
    if( !index || !(obj=MM_module_objects[index]) )
    {
	MM_show_error( "Attempt to unload non-existent module " + id );
	return false;
    }
    // now check if other modules depend on its produced resources.
    var i,j=null;
    for( i in obj.prod )
	for( j in MM_depends[ obj.prod[i] ] )
	{
	    // if some _other_ module depends on obj.prod[i], then... 
	    if( j!=obj.id )
	    {
		if( recursive==false ) return false;
		else if( MM_unload_module(j,true)==false ) return false;
	    }
	}
    // it is now safe to unload the module!
    if( obj.unload()==true )
    {
	// delete production entries from MM_depends
	for( i in obj.prod )
	    MM_depends[ obj.prod[i] ] = null;

	// delete requirement entries from MM_depends
	for( j in obj.req )
	    MM_depends[ obj.req[j] ][ obj.id ] = null;

	// set the module to be "unloaded";
	MM_module_loaded[ index ] = false;
	MM_log( "Module "+obj.id+" unloaded." );
	return true;
    }
    return false;
}