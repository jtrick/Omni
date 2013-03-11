// omni/admin.js  Copyright (c)2013 Codapt LLC, all rights reserved.  For license see: http://OpenAce.org/license?id=omni/admin.js

$(document).ready(function omniAdminReady() {

    $( "#panels-sect" ).sortable({handle: ".title", opacity: 0.5, cursor: "move"});
    $( ".card .title" ).disableSelection();
	
}(jQuery)); //omniAdminReady()