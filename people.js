$(document).ready(function omniPeopleReady() {

    // Group card widget definition
    $.widget("ui.groupCard", {
        _create: function() {
            var options = this.options,
                domElem = this.element,
                tagList = "";


            // pattern card specific body content
            var groupTemp = _.template('' +
                '<div class="content">' +
                    '<div>Demographic Similarities (show top 3): ' +
                    	'<div class="listitem">{{demographic1}}</div>' +          
                    	'<div class="listitem">{{demographic2}}</div>' +  
                    	'<div class="listitem">{{demographic1}}</div>' +  
 					'</div>' +   
                     '<div>Patterns (show top 3): ' +
                    	'<div class="listitem">{{pattern1}}</div>' +          
                    	'<div class="listitem">{{pattern2}}</div>' +  
                    	'<div class="listitem">{{pattern1}}</div>' +  
 					'</div>' +        	
                '</div>' +
                '<div class="tags">{{tags}}</div>'
            );

            // create the card base
            domElem.card(options).addClass("people");
                        
            // generate tag list
            for (i = 0; i < options.tags.length; i++) {
                tagList += '<div>' + options.tags[i] + '</div>';
            }

            // set the card body content
            domElem.card("setContent", groupTemp($.extend(options, {tags: tagList})));

        }
    });
    
    // People card widget definition
    $.widget("ui.peopleCard", {
        _create: function() {
            var options = this.options,
                domElem = this.element,
                tagList = "";


            // pattern card specific body content
            var peopleTemp = _.template('' +
                '<div class="content">' +
                    '<div>Ip Address: {{ip}}</div>' +
                    '<div>Visits (show last 3): ' +
                    	'<div class="listitem">{{visit1}}</div>' +          
                    	'<div class="listitem">{{visit2}}</div>' +  
                    	'<div class="listitem">{{visit1}}</div>' +  
 					'</div>' +   
                    '<div>Patterns (show top 3): ' +
                    	'<div class="listitem">{{pattern1}}</div>' +          
                    	'<div class="listitem">{{pattern2}}</div>' +  
                    	'<div class="listitem">{{pattern1}}</div>' +  
 					'</div>' +        	
                '</div>'  +
                '<div class="tags">{{tags}}</div>'
            );
            
            // create the card base
            domElem.card(options).addClass("people");
            
            // generate tag list
            for (i = 0; i < options.tags.length; i++) {
                tagList += '<div>' + options.tags[i] + '</div>';
            }

            // set the card body content
            domElem.card("setContent", peopleTemp($.extend(options, {tags: tagList})));

        }
    });


    var buildCards = function(data) {
        var i, card;
        for (i = 0; i < data.length; i++) {
            card = $('<div></div>');
            if (data[i].archived) {
                $('#archive-sect').append(card);
            } else {
                $('#panels-sect').append(card);
            }
            if(data[i].group) {
            	card.groupCard(data[i]);
            } else {
            	card.peopleCard(data[i]);
            }
        }
    }



    /*  Sample data structure coming from server when the page is first loaded to build the
        initial cards */
    var cards = [{
        title: "Joe Schmoe1",
        desc: "This is a person",
        ip: "123456",
        visit1: "2/3/2013 | 14:02:36 - 14:09:22",
        visit2: "1/31/2013 | 12:02:15 - 12:08:16",    
        visit3: "1/15/2013 | 08:20:15 - 08:025:15",    
        pattern1: "Entered search term Nike",
        pattern2: "Added item to cart Nike Air Jordan",
        pattern3: "Add to cart + Help/FAQ",
        titleColor: "#e75555",
        tags: ["blogger"]
    },
    {
        title: "Joe Schmoe2",
        desc: "This is a person",
        ip: "123456",       
        visit1: "2/3/2013 | 14:02:36 - 14:09:22",
        visit2: "1/31/2013 | 12:02:15 - 12:08:16",    
        visit3: "1/15/2013 | 08:20:15 - 08:025:15",    
        pattern1: "Entered search term Nike",
        pattern2: "Added item to cart Nike Air Jordan",
        pattern3: "Add to cart + Help/FAQ",
        titleColor: "#e75555",
        tags: ["not a blogger"]
    },
    {
        title: "StarCustomers (6)",
        //numPeople: 6,
        desc: "This is a group",
        demographic1: "Geographic Location          100%",
        demographic2: "Use frequency                100%",    
        demographic3: "Customer history             50%",    
        pattern1: "Entered search term Nike",
        pattern2: "Added item to cart Nike Air Jordan",
        pattern3: "Add to cart + Help/FAQ",
        group: true,
        tags: ["frequent purchasers"]
    },
    {
        title: "Joe Schmoe3",
        desc: "This is a person",
        ip: "123456",
        visit1: "2/3/2013 | 14:02:36 - 14:09:22",
        visit2: "1/31/2013 | 12:02:15 - 12:08:16",    
        visit3: "1/15/2013 | 08:20:15 - 08:025:15",    
        pattern1: "Entered search term Nike",
        pattern2: "Added item to cart Nike Air Jordan",
        pattern3: "Add to cart + Help/FAQ",
        titleColor: "#e75555",
        tags: ["Nike buyer"]  
    },
    {
        title: "Joe Schmoe4",
        desc: "This is a person",
        ip: "123456",
        visit1: "2/3/2013 | 14:02:36 - 14:09:22",
        visit2: "1/31/2013 | 12:02:15 - 12:08:16",    
        visit3: "1/15/2013 | 08:20:15 - 08:025:15",    
        pattern1: "Entered search term Nike",
        pattern2: "Added item to cart Nike Air Jordan",
        pattern3: "Add to cart + Help/FAQ",
        titleColor: "#e75555",
        archived: true,
        tags: ["test"]
    }];

    // Build cards with the fake data
    buildCards(cards);

    // Close all popups if a click bubbles up to html
    $('html').click(admin.closePopups);

    // Add tooltips to card action buttons
    $('.card-btns div').omniTooltip({arrowPos: "bottom-center"});

    // Add dropdown to the sort button
    $('#sort-btn').dropdownSelect({
        selections: [
            {
                text: "First Name (A-Z)",
                click: function() {alert($(this).text());}
            },
            {
                text: "Pattern (priority)",
                click: function() {alert($(this).text());}
            },
            {
                text: "Region (global)",
                click: function() {alert($(this).text());}
            },
            {
                text: "Most Overall Visits",
                click: function() {alert($(this).text());}
            },
            {
                text: "Least Overall Visits",
                click: function() {alert($(this).text());}
            },
            {
                text: "More Recent Visitors",
                click: function() {alert($(this).text());}
            }
        ],
        width: 200,
        theme: "dark"
    });

    // Make cards sortable
    $("#panels-sect").sortable({
        handle: ".title",
        opacity: 0.5,
        cursor: "move",
        start: function(event, ui) {
            admin.closePopups();
            admin.omniTooltip.toggle();
        },
        stop: function(event, ui) {
            // make sure the z-index isn't set to 0 after dragging
            ui.item.css({"z-index": 999});
        }
    });
	
}(jQuery)); //omniAdminReady()