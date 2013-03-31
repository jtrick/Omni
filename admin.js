// omni/admin.js  Copyright (c)2013 Codapt LLC, all rights reserved.  For license see: http://OpenAce.org/license?id=omni/admin.js



$(document).ready(function omniAdminReady() {


var patterns = {
		"dfhfdgh" : {
			"name" : 'whatever'	
		}
	};


var watch = function(obj, attr, name, callback) {
    var watchedValue = obj[attr];
    // add a list of watchers to the object if not present
    if (!obj.hasOwnProperty("_watchers")) {
        obj._watchers = {};
    }
    // add a watcher to the list for the specific attribute if not present
    if (!obj._watchers.hasOwnProperty(attr)) {
        obj._watchers[attr] = {};
    }
    // add a watcher with a specific name to this attribute
    if (!obj._watchers[attr].hasOwnProperty(name)) {
        obj._watchers[attr][name] = callback;
    }

    Object.defineProperty(obj, attr, {
        set: function(value) {
            watchedValue = value;
            for (watcher in this._watchers[attr]) {
              this._watchers[attr][watcher].apply(this, [value]);
            }
        },
        get: function() {
            return watchedValue;
        }
    });

    // do an initial call to the watcher for the first value
    obj[attr] = watchedValue;
};

var unwatch = function(obj, attr, name) {
    if (obj.hasOwnProperty("_watchers") && obj._watchers.hasOwnProperty(attr) &&
        obj._watchers[attr].hasOwnProperty(name)) {
        delete  obj._watchers[attr][name];
    }
};

$.widget("ui.patternCard", {
    options: {},
    setStatistic: function(stat) {
        this.element.find('.body .large').text(stat);
    },
    _create: function() {
        var options = this.options,
            domElem = this.element,
            cardTemp = _.template(''
                + '<div class="title">'
                    + '<div class="{{icon}}"></div>'
                    + '<div>{{title}}</div>'
                + ' </div>'
                + '<div class="body">'
                    + '<div class="timeframe">In the <span class="underline">{{timeframe}}</span>:</div>'
                    + '<div class="large">{{statistic}}</div>'
                    + '<div class="tag">Tag: {{tag}}</div>'
                    + '<div class="card-btns">'
                        + '<div class="graphs-card-btn"></div>'
                        + '<div class="duplicate-card-btn"></div>'
                        + '<div class="share-card-btn"></div>'
                        + '<div class="delete-card-btn"></div>'
                    + '</div>'
                + '</div>'
			),
			data = cards.id;
			
	
        domElem.addClass("card").html(cardTemp(options));

        domElem.children(".title").disableSelection();
        if (options.hasOwnProperty("titleColor")) {
            domElem.children(".title").css("backgroundColor", options.titleColor);
        }
    },
    
	update: function(data) {
		
	};
});



	function 
	
	

    $("#card1").patternCard({
        id: 'jghsdfjh',
        title: "Time Spent On Homepage Prior ...",
        timeframe: "last hour",
        statistic: "11.78s",
        tag: "Display this data daily",
        icon: "title-icon",
        titleColor: "#e75555"
    });
    $("#card2").patternCard({
        title: "Number Of New Logins Created",
        timeframe: "last 6 hours",
        statistic: "9",
        tag: "Display this data every Monday",
        icon: "title-icon-2"
    });
    $("#card3").patternCard({
        title: "Number Of Unique Guest IDs",
        timeframe: "last 6 hours",
        statistic: "22",
        tag: "Display this data every Monday",
        icon: "title-icon-2"
    });
    $("#card4").patternCard({
        title: "Ratio New Logins Created/Unique ...",
        timeframe: "last 6 hours",
        statistic: "0.409",
        tag: "Display this data every Monday",
        icon: "title-icon-2"
    });

    $("#panels-sect").sortable({handle: ".title", opacity: 0.5, cursor: "move"});

    // testing some watch/unwatch stuff
    var b = {
            x: 0,
            y: 10,
            newLogins: 6
        };

    watch(b, "x", "xWatcher", function(value) {
        $('#main-top-bar').text(value);
    });
    watch(b, "y", "yWatcher", function(value) {
        $('#main-top-bar').text($('#main-top-bar').text() + " " + value);
    });
    watch(b, "x", "xWatcher2", function(value) {
        $('#main-top-bar').text($('#main-top-bar').text() + " " + value);
    });
    unwatch(b, "x", "xWatcher2");

    b.x = 20;
    b.y = "Calvin";

    // actually do something that this might be used for
    watch(b, "newLogins", "pullNewLogins", function(value) {
        $('#card2').patternCard("setStatistic", value);
    });

    // make a timer to update it
    setInterval(function() {
        b.newLogins++;
    }, 2000);
    
    
    
    
    
    
    
    
    // The omniFrame API abstraction. Instantiates OmniCommFrame iframe embedded in div, to handle data transmission to the server, stores the object in vars.dataFrame, and initiates data transmission.
	function dataFrame(options) {
		var o = $.extend({
				"parent" : 'body',
			}, options),
			key = makeKey();
			
		$("body").append('<div id="'+dataDivId||'dataDiv'+'"></div>');
		
		// Fix!  We'll want to instantiate a secondary frame for secure processing and communications.
		// v.dataFrame = new OmniCommFrame({
			// "url" : 'https://codapt.com/o/',
			// "parent" : o.parent,
			// "visible" : false,
			// "query" : { 
				// "a" : Date.now(),
				// "cmd" : 'load',
				// "Url" : window.location.href,
				// "Origin" : window.location.origin,
				// "Pub" : key,
				// "Old" : localStore({"cmd":'get',"key":'Old'})
			// },
			// "callback" : function(data) {
				// var cmd = data.cmd;
				// if (cmd == "ping") {
					// adminUpdate(data);
				// } else if (cmd == "msg") {
					// adminMsg(data);
				// } else if (cmd == "load") {
					// adminLoad(data);
				// }
			// }
		// });
		
		
			
		o.comm = new CommObj();  // Fix! Transition this into iframe.
		
		
		
		function adminUpdate(data) {
			
			
		}
		
		
		function adminMsg(data) {
			
			
		}
		
		
		function adminLoad(data) {
			
			
		}
		
		
	
		// Used for all communications with central server, ACE, client server, etc. Abstracts mechanisms behind these transmissions to simplify use.
		function CommObj() {  // Fix.  We'll want to relay this through ACE in a secondary frame.
			var _this = this,
				log = [],
				que = {  // Stores requests to be made to server and items returned but not loaded yet.
					"wait" : [],  // a JSON containing callObjs that are to be sent to the server but in wait due to lack of connectivity or other cases. Ordered by time placed.
					"out" : [],  // a JSON containing callObjs that have been sent to the server, ordered by time placed.
					"back" : []  // Array of sequentially returned aceObjs, to be processed locally and returned.
				};
			
			ajaxInit();
		
		
			///////  CommObj Exposed Methods  /////////////////////
		
		
			// Packages and initiates the actual call to the server.
			this.send = function makeCall(dat, cmd) {
				var timeNow = Date.now();
				localStore({"cmd":'set',"key":'Pub',"val":(key=makeKey())});
				var callObj = {
					"a" : timeNow,
					"cmd" : cmd || 0,
					"dat" : dat,
					"Pub" : key,
					"Old" : localStore({"cmd":'get',"key":'Old'})
				};
				que.out[timeNow] = callObj;
				$.ajax({"data":callObj});
				// logMsg('makeCall() data sent.', callObj);
			};
			
			
			///////  CommObj Private Functions  /////////////////////
		
			
			// Sets ajax defaults and establishes generic connection with an appropriate ACE server.
			function ajaxInit() {
				$.ajaxSetup({
					url : 'https://codapt.com/o/',
					type: "POST",
					// crossDomain: false,
					beforeSend: ajaxPreCall,
					success: ajaxSuccess,
					error: ajaxError,
					complete: ajaxComplete
				});
				
				$.ajax({"data":{
					"a" : Date.now(),
					"cmd" : 'load',
					"Url" : window.location.href,
					"Origin" : window.location.origin,
					"Pub" : key,
					"Old" : localStore({"cmd":'get',"key":'Old'})
				}});
			}
	
	
			// Used for low level ajax call tracking and error handling.
			function ajaxPreCall(xhrObj, ajaxObj) {
				// var callObj = {
					// "url" : ajaxObj.url,
					// "type" : ajaxObj.type,
					// "data" : ajaxObj.data
				// };
				// logMsg('ajax pre-call...', callObj);  // Fix?
				// if (!ajaxObj.data || !ajaxObj.data.a) {
					// var errorObj = {
						// "error" : "ajaxObj.data.a is not set!",
						// "data" : ajaxObj.data,
						// "ajaxObj" : ajaxObj
					// }
					// flagError("iframe ajaxPreCall error", errorObj);
				// }
			}
	
	
			// Called on completion of each ajax request to handle returned data.
			function ajaxSuccess(data, status, xhrObj) {
				if (!data || !_.isObject(data)) {
					var errorObj = {
						"data" : data,
						"xhrObj" : xhrObj,
						"status" : status
					};
					// flagError("iframe ajaxSuccess returned bad data.", errorObj);
					return;
				}
				var backTime = Date.now(),
					dataObj = jsonToObj(data),
					callTime = dataObj.a || 0,
					lag = backTime-callTime,
					cmd = dataObj.cmd;
				
				localStore({"cmd":'set',"key":'Old'});
				// if (!callTime) { flagError('No returned callTime for this ajax data.') }
				if (cmd == "ping") {
					adminUpdate(data);
				} else if (cmd == "msg") {
					adminMsg(data);
				} else if (cmd == "load") {
					adminLoad(data);
				}
			}
			
			
			// Handles errors for iframe AJAX requests.
			function ajaxError(xhrObj, status, error) {
				// flagError("iframe AJAX eror", {
					// "error" : error,
					// "status" : status,
					// "xhrObj" : xhrObj
				// });
			}
			
			
			//Called after all other handlers have been called for request.
			function ajaxComplete(jqXHR, status) {
				//logMsg('ajax completed. Status: ', status);
				// if (status != "success") {
					// logMsg("Problem with ajax call", status);
					// // flagError("Problem initiating connection. Status: "+status, jqXHR);
				// }
			}
			
	
		};//CommObj();
		
		
	}//dataFrame()
	
	
	// Generates the unique key used to identify this client between the simultaneous server connections.
	function makeKey(length) {
		var keyStr = ''+Date.now(),
			chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
			charsL = chars.length;
		length = (length||64)-keyStr.length;
		for (var i=0; i<length; i++) { keyStr += chars.charAt(Math.floor(Math.random()*charsL)); }
		return keyStr;
	}
	
	
	// Abstraction for the standard localStorage object.
	function localStore(callObj) { 
		if (!$.isPlainObject(callObj)) { return; }  // Fix?  Error handling?
		var cmd = callObj.cmd,
			key = callObj.key,
			val = callObj.val;
		if (cmd == "get") { return localStorage.getItem(key); }
		if (cmd == "set") { return localStorage.setItem(key, val); }
		if (cmd == "add") { return localStorage.setItem(key, val); }
		if (cmd == "del") { return localStorage.removeItem(key); }
		if (cmd == "clr") { return localStorage.clear(); }  // Erases the entire db. Fix. Safety mechanisms?
		if (cmd == "has") { return (undefined===localStorage.getItem(key))?false:true; }
		if (cmd == "all") {
			var tblArray = [];
			for (var tblName in localStorage) { tblArray.push(tblName); }
			return tblArray;
		}
	}//localStore()
	
	
	// Performs basic checks for JSON structure and returns the extracted object if applicable, returns the original string otherwise.
	function jsonToObj(str) {
		if (!$.isString(str)) { return str; }
		// Fix. Complete these checks.
		var obj = JSON.parse(str);
		return $.isPlainObject(obj) ? obj : str;
	}
	
	
	// Performs basic checks for JSON qualified object structure and returns the stringified JSON object if applicable, returns the original object otherwise.
	function jsonToStr(obj) {
		if (!$.isPlainObject(obj)) { return obj; }
		// Fix. Complete these checks.
		var str = JSON.stringify(obj);
		return $.isString(str) ? str : obj;
	}
	
    
    
	
}(jQuery)); //omniAdminReady()

