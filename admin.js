// omni/admin.js  Copyright (c)2013 Codapt LLC, all rights reserved.  For license see: http://OpenAce.org/license?id=omni/admin.js

$(document).ready(function omniAdminReady() {

    // Adds a watcher to obj on attr with watcher name which executes callback when the attr is set
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
    var unwatch = function(obj, attr, name) {
        if (obj.hasOwnProperty("_watchers") && obj._watchers.hasOwnProperty(attr) &&
            obj._watchers[attr].hasOwnProperty(name)) {
            delete  obj._watchers[attr][name];
        }
    };

    // Show any kind of popup, closes all others and stops even from bubbling to html which closes open popups
    var showPopup = function(e, id) {
        $('.popup').hide();
        $(id).show();
        e.stopPropagation();
    };
    var closePopups = function() {
        $('.popup').hide();
    };

    // generates a new id for dynamic page elements
    var nextId = (function() {
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
            var id = nextId(),
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
                    closePopups();
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
                showPopup(e, '#select-dropdown' + id);
            });
        }
    });

    // custom tooltip for simplicity and to solve jumping around issue
    $.widget("ui.omniTooltip", {
        _create: function() {
            var domElem = this.element,
                id = nextId(),
                timeOut = null,
                timeRunning = false,
                options = this.options,
                disabled = false,
                tt = $('' +
                '<div class="tooltip" id="ui-tooltip-' + id + '">' +
                    '<div class="tooltip-content">' +
                        domElem.data("title") +
                        '<div class="arrow"></div>' +
                    '</div>' +
                '<div>'
                ).css({width: this.options.width + "px"}).hide();

            // tooltip public functions
            this.toggle = function() {
                disabled = !disabled;
                if (disabled) {
                    hideTooltip();
                }
            };

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

    // Pattern card widget definition
    $.widget("ui.patternCard", {
        _create: function() {
            var options = this.options,
                domElem = this.element;

            // create the card base
            domElem.card(options);

            // pattern card specific body content
            var patternTemp = _.template('' +
                '<div class="content">' +
                    '<div class="timeframe">In the <span class="underline">{{timeframe}}</span>:</div>' +
                    '<div class="large">{{statistic}}</div>' +
                '</div>' +
                '<div class="tag">{{tag}}</div>'
            );

            // set the statistic for this pattern
            this.setStatistic = function(stat) {
                this.element.find('.body .large').text(stat);
            };

            // set the card body content
            domElem.card("setContent", patternTemp(options));

            // add dropdown to timeframe
            domElem.find('.timeframe .underline').dropdownSelect({
                selections: [
                    {
                        text: "Last hour",
                        click: function() {alert($(this).text());}
                    },
                    {
                        text: "Last 12 hours",
                        click: function() {alert($(this).text());}
                    },
                    {
                        text: "Last 24 hours",
                        click: function() {alert($(this).text());}
                    }
                ],
                width: 150
            });
        }
    });

    // Base card widget definition
    var cardWidget = (function() {
        // patternCard static vars
        var curSelection = [];

        // patternCard static methods
        this.getCurSelection = function() {

        };

        $.widget("ui.card", {
            _create: function() {
                // patternCard private vars
                var selected = false,
                    options = this.options,
                    domElem = this.element,
                    id = nextId();

                // patternCard public methods
                this.toggleSelect = function() {
                    selected = !selected;
                    if (!selected) {
                        domElem.find('.check').remove();
                    } else {
                        $('<div class="check"></div>').appendTo(domElem);
                    }
                };

                this.toggleTooltips = function() {
                    domElem.find('.tooltip').omniTooltip("toggle");
                };

                this.setContent = function(content) {
                    domElem.find('.body').html(content);
                };

                // patternCard private methods
                var initialize = function() {
                    var cardTemp = _.template('' +
                            '<div class="title" data-title="Something">' +
                                '<div class="{{icon}}"></div>' +
                                '<div>{{title}}</div>' +
                            '</div>' +
                            '<div class="body">' +
                            '</div>'
                        );

                    if (!options.hasOwnProperty("icon")) {
                        options.icon = "";
                    }

                    // transform the domElem into a card
                    domElem.addClass("card").html(cardTemp(options)).attr("id", "card" + id);

                    // disable selection of the title and add tooltip for description
                    domElem.children(".title").disableSelection().omniTooltip();

                    // figure out the best place to click a card to select/deselect

                    // if the title color attribute is set in the options, change it from the default
                    if (options.hasOwnProperty("titleColor")) {
                        domElem.children(".title").css("backgroundColor", options.titleColor);
                    }
                };

                initialize.apply(this);
            }
        });
    })();

    var buildCards = function(data) {
        var i, card;
        for (i = 0; i < data.length; i++) {
            card = $('<div></div>');
            $('#panels-sect').append(card);
            card.patternCard(data[i]);
        }
    }

    // Close all popups if a click bubbles up to html
    $('html').click(closePopups);

    // Add tooltips to card action buttons
    $('.card-btns div').omniTooltip({arrowPos: "bottom-center"});

    // Add dropdown to the sort button
    $('#sort-btn').dropdownSelect({
        selections: [
            {
                text: "Icon (Category)",
                click: function() {alert($(this).text());}
            },
            {
                text: "Importance (Color)",
                click: function() {alert($(this).text());}
            },
            {
                text: "Custom 1",
                click: function() {alert($(this).text());}
            },
            {
                text: "Custom 2",
                click: function() {alert($(this).text());}
            }
        ],
        width: 200,
        theme: "dark"
    });

    /*  Sample data structure coming from server when the page is first loaded to build the
        initial cards */
    var cards = [{
        title: "Time Spent On Homepage Prior ...",
        timeframe: "last hour",
        statistic: "11.78s",
        tag: "Display this data daily",
        titleColor: "#e75555"
    },
    {
        title: "Number Of New Logins Created",
        timeframe: "last 6 hours",
        statistic: "9",
        tag: "Display this data every Monday",
        icon: "title-icon-2"
    },
    {
        title: "Number Of Unique Guest IDs",
        timeframe: "last 6 hours",
        statistic: "22",
        tag: "Display this data every Monday",
        icon: "title-icon-2"
    },
    {
        title: "Ratio New Logins Created/Unique ...",
        timeframe: "last 6 hours",
        statistic: "0.409",
        tag: "Display this data every Monday",
        icon: "title-icon-2"
    }];

    // Build cards with the fake data
    buildCards(cards);

    // Make cards sortable
    $("#panels-sect").sortable({
        handle: ".title",
        opacity: 0.5,
        cursor: "move",
        start: function(event, ui) {
            closePopups();
            ui.item.patternCard('toggleTooltips');
        },
        stop: function(event, ui) {
            // make sure the z-index isn't set to 0 after dragging
            ui.item.css({"z-index": 999});
        }
    });
	
}(jQuery)); //omniAdminReady()