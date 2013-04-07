// omni/admin.js  Copyright (c)2013 Codapt LLC, all rights reserved.  For license see: http://OpenAce.org/license?id=omni/admin.js

// admin module object
var admin = {};

// encapsulate functionality
$(document).ready(function omniAdminReady() {

    // Adds a watcher to obj on attr with watcher name which executes callback when the attr is set
    admin.watch = function(obj, attr, name, callback) {
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
                for (var watcher in this._watchers[attr]) {
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

    // Removes the watcher on obj's attr with the specified name
    admin.unwatch = function(obj, attr, name) {
        if (obj.hasOwnProperty("_watchers") && obj._watchers.hasOwnProperty(attr) &&
            obj._watchers[attr].hasOwnProperty(name)) {
            delete  obj._watchers[attr][name];
        }
    };

    // Show any kind of popup, closes all others and stops even from bubbling to html which closes open popups
    admin.showPopup = function(e, id) {
        $('.popup').hide();
        $(id).show();
        e.stopPropagation();
    };
    admin.closePopups = function() {
        $('.popup').hide();
    };

    // generates a new id for dynamic page elements
    admin.nextId = (function() {
        // static private variable
        var staticId = 0,
            getNext = function() {
                return staticId++;
            }

        return getNext;
    })();

    // Selectable drop down widgets definition
    $.widget("ui.dropdownSelect", {
        _create: function() {
            var id = admin.nextId(),
                theme = this.options.theme || "light",
                dropdown = $('<ul class="select-dropdown ' + theme + ' popup" id="select-dropdown' + id + '"></ul>'),
                option,
                i,
                domElem = this.element,
                selections = this.options.selections,
                height = domElem.outerHeight();

            var performClick = function(callback, element) {
                return function(e) {
                    callback.apply(element);
                    admin.closePopups();
                    e.stopPropagation();
                };
            }

            for (i = 0; i < selections.length; i++) {
                option = $('<li></li>');
                option.text(selections[i].text);
                option.click(performClick(selections[i].click, option));
                option.appendTo(dropdown);
                if (i == 0) {
                    option.append('<div class="arrow"></div>');
                }
            }

            domElem.css({position: "relative"}).append(dropdown);

            dropdown.css({
                top: (height + 15) + "px",
                left: 0,
                width: this.options.width + "px"
            }).hide();

            domElem.addClass("pointer").click(function(e) {
                admin.showPopup(e, '#select-dropdown' + id);
            });
        }
    });

    // custom tooltip for simplicity and to solve jumping around issue
    admin.omniTooltip = (function() {
        // omniTooltips static private variables
        var disabled = false;

        // static public methods
        this.toggle = function() {
            disabled = !disabled;
            if (disabled) {
                $('.tooltip').remove();
            }
        };

        // omniTooltip widget definition
        $.widget("ui.omniTooltip", {
            _create: function() {
                var domElem = this.element,
                    id = admin.nextId(),
                    timeOut = null,
                    timeRunning = false,
                    options = this.options,
                    tt = $('' +
                    '<div class="tooltip" id="ui-tooltip-' + id + '">' +
                        '<div class="tooltip-content">' +
                            domElem.data("title") +
                            '<div class="arrow"></div>' +
                        '</div>' +
                    '<div>'
                    ).css({width: this.options.width + "px"}).hide();

                var adjustPos = function() {
                    var height = domElem.outerHeight(),
                        width = domElem.outerWidth(),
                        pos = domElem.offset(),
                        left = 0,
                        top = 0;

                    // Position the arrow according to the option
                    if (options.hasOwnProperty("arrowPos")) {
                        switch (options.arrowPos) {
                            case "bottom-left":
                                left -= 33;
                                break;
                            case "bottom-center":
                                left = left - 33 + width / 2;
                                break;
                            // default left of box to left of parent
                            // can add other positions (above/below, right, etc.) if we need to
                        }
                    }
                    tt.css({
                        top: (pos.top + height + top + 15) + "px",
                        left: (pos.left + left) + "px"
                    });
                };

                var showTooltip = function() {
                    if (!disabled) {
                        adjustPos();
                        tt.appendTo('body').fadeIn();
                    }
                };

                var hideTooltip = function() {
                    $('#ui-tooltip-' + id).fadeOut(function() {
                        $(this).remove();
                    });
                    if (timeRunning) {
                        clearTimeout(timeOut);
                    }
                    timeRunning = false;
                }

                // Display the tooltip after a delay, cancel it if exited before it displays
                domElem.hover(function() {
                    timeRunning = true;
                    timeOut = setTimeout(showTooltip, 1000);
                }, hideTooltip);
            }
        });

        return this;
    })();

    // Base card widget definition
    admin.cardWidget = (function() {
        // card static vars
        var curSelection = [],
            allCards = [],
            displayedCards = [],
            // remember the last sort and filter function
            // so that sort can call filter and filter can call sort
            lastSort = null,
            lastFilter = null;

        // card static methods
        this.getCurSelection = function() {

        };

        // Sort cards based on a provided sorting function
        this.sort = function(sortFunc) {
            var sorter,
                i;

            // sort function will receive the two elements as DOM elements
            // detach the current cards from the DOM
            sorter = $('#panels-sect .card').detach().sort(sortFunc);

            // put them back
            for (i = 0; i < sorter.length; i++) {
                $('#panels-sect').append(sorter[i]);
            }

            lastSort = sortFunc;
        }

        // Filter so only cards with specific requirements are displayed
        this.filter = function(filterFunc) {
            var i,
                filteredCards = [];

            $('#panels-sect .card').detach();

            // filter out the ones that don't match
            for (i = 0; i < allCards.length; i++) {
                if (filterFunc(allCards[i])) {
                    filteredCards.push(allCards[i]);
                }
            }

            // put them back
            $('#panels-sect').append(filteredCards);

            lastFilter = filterFunc;

            // do the last sort function if it has been set
            if (lastSort) {
                this.sort(lastSort);
            }
        };

        $.widget("ui.card", {
            _create: function() {
                // card private vars
                var selected = false,
                    options = this.options,
                    domElem = this.element,
                    archived = options.archived || false,
                    id = admin.nextId();

                // card public methods
                this.toggleSelect = function() {
                    selected = !selected;
                    if (!selected) {
                        domElem.find('.check').remove();
                    } else {
                        $('<div class="check"></div>').appendTo(domElem);
                    }
                };

                this.setContent = function(content) {
                    domElem.find('.body').html(content);
                };

                // card private methods
                var initialize = function() {
                    var cardTemp = _.template('' +
                            '<div class="title" data-title="{{desc}}">' +
                                '<div class="title-icon-{{icon}} icon light"></div>' +
                                '<div>{{title}}</div>' +
                            '</div>' +
                            '<div class="body">' +
                            '</div>'
                        );

                    if (!options.hasOwnProperty("icon")) {
                        options.icon = "";
                    }

                    // if it is initially archived, make it partially transparent
                    if (archived) {
                        domElem.addClass("archived");
                    } else {
                        allCards.push(domElem);
                    }

                    // transform the domElem into a card
                    domElem.addClass("card").html(cardTemp(options)).attr("id", "card" + id);

                    // disable selection of the title and add tooltip for description
                    domElem.children(".title").disableSelection().omniTooltip();

                    // if the title color attribute is set in the options, change it from the default
                    if (options.hasOwnProperty("titleColor")) {
                        domElem.children(".title").css("backgroundColor", options.titleColor);
                    }
                };

                initialize.apply(this);
            }
        });

        return this;
    })();

    // Close all popups if a click bubbles up to html
    // should be common to all admin interface pages
    $('html').click(admin.closePopups);

    // Menu links
    $('#patterns-menu').click(function() { window.location = "patterns.htm"; });
    $('#graphs-menu').click(function() { window.location = "graphs.htm"; });
    $('#people-menu').click(function() { window.location = "people.htm"; });
    $('#reports-menu').click(function() { window.location = "reports.htm"; });

}(jQuery)); //omniAdminReady()