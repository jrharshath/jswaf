/*!
 * Copyright 2009 Jason Stahl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * jQuery getCSS Utility Method
 * --------------------------------------------
 * Author: Jason Stahl
 *
 * Description: 
 * Adds jQuery.getCSS to jQuery.
 **/
(function($) {
  $.getCSS = function(url, media) {
    var link = document.createElement('link');
	link.href = url;
	link.rel = 'stylesheet';
	link.type = 'text/css';
	document.getElementsByTagName('head')[0].appendChild(link);
  };
})(jQuery);
