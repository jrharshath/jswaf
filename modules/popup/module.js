function popup()
{
    this.id = 'popup';
    this.popup_gui = null;
    this.popup_state = null;
    this.title = null;
    this.notification= null;
    this.req = {};
    this.prod = {popup:'showpopup'};
    this.unload = function()
    {
        return true;
    }
    this.init   = function(conf)
    {
       var $popup = $("<div style='background-color:#4dd;z-index:1001;padding:5px 5px 5px 5px;color:black;width:70%;margin:0 auto;display:none'></div>");
       this.popup_gui = $popup;
       this.popup_state = 'HIDDEN';

       var $closebutton =
	    $("<div style='height:15px;float:right;color:black"+
	      ";font-weight:bold;cursor:pointer;line-height:15px;'>X</div>");

      $closebutton.click(function(){var obj = MM_module_objects[MM_module_id['popup']];$popup.slideUp('fast');obj.popup_state='HIDDEN';});
              
 	var $title = 
	    $("<div style='height:15px;float:left;color:black"+
	      ";text-align:left;line-height:15px;font-weight:bold;'>Notification</div>");
        var $notification = $("<div ></div>");
        this.title = $title;
        this.notification  = $notification;
       $popup.append($title).append($closebutton).append("<div style='clear:both'></div>").append($notification);
        return true;
    }
    this.main   = function()
    {
       var $sidebar = $(MM_get_resource('sidebar'));
       $($sidebar).append(this.popup_gui);

    }
    this.showpopup = function(data)
    {
        var obj = MM_module_objects[MM_module_id['popup']];
        if(obj.popup_state == 'DISPLAYING')
        {
        
           var prev_data = obj.notification.html();
           var data = prev_data + '<br/>' + data;
           obj.notification.html(data);
                
        }

        else
        {
           obj.popup_gui.slideDown('slow');
           obj.notification.html(data);
           obj.popup_state = 'DISPLAYING';
           return false;
        }
        return false;
    }
    this.serviceRequest = function(res)
    {
        if(res == 'showpopup')
            return this.showpopup;
        return null;
    }
}
