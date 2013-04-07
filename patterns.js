$(document).ready(function omniPatternsReady() {

    // category widget for monitoring categories on page and filtering cards
    var categoryWidget = (function() {
        // static array tracking categories on the page
        var categories = [];

        this.addCat = function(cat) {
            if (categories.indexOf(cat) < 0) {
                categories.push(cat);
            }
        };

        this.update = function() {
            var i, cat;
            $('#cat-div').empty();
            for (i = 0; i < categories.length; i++) {
                cat = $('<div></div>').category({cat: categories[i]});
                $('#cat-div').append(cat);
            }
        };

        this.filterCards = function() {
            // get enabled categories
            var enabledCats = [];
            $('#cat-div > div').each(function() {
                if ($(this).category("enabled")) {
                    enabledCats.push($(this).category("option", "cat"));
                }
            });

            admin.cardWidget.filter(function (a) {
                return enabledCats.indexOf($(a).card("option", "icon")) >= 0;
            });
        };

        $.widget("ui.category", {
            _create: function() {
                var domElem = this.element,
                    options = this.options,
                    enabled = true;

                this.enabled = function() {
                    return enabled;
                };

                domElem.addClass("icon dark title-icon-" + options.cat).click(function() {
                    enabled = !enabled;
                    categoryWidget.filterCards();
                    if (enabled) {
                        $(this).removeClass("gray").addClass("dark");
                    } else {
                        $(this).removeClass("dark").addClass("gray");
                    }
                });
            }
        });

        return this;
    })();

    // Pattern card widget definition
    $.widget("ui.patternCard", {
        _create: function() {
            var options = this.options,
                domElem = this.element,
                i,
                tagList = "";

            // pattern card specific body content
            var patternTemp = _.template('' +
                '<div class="content">' +
                '<div class="timeframe">In the <span class="underline">{{timeframe}}</span>:</div>' +
                '<div class="statistic">' +
                '<div class="large">{{statistic}}</div>' +
                '<div class="units">{{units}}</div>' +
                '</div>' +
                '</div>' +
                '<div class="tags">{{tags}}</div>'
            );

            // set the statistic for this pattern
            this.setStatistic = function(stat) {
                this.element.find('.body .large').text(stat);
            };

            // create the card base
            domElem.card(options).addClass("pattern");

            // add the card category
            categoryWidget.addCat(options.icon);

            // generate tag list
            for (i = 0; i < options.tags.length; i++) {
                tagList += '<div>' + options.tags[i] + '</div>';
            }

            // set the card body content
            domElem.card("setContent", patternTemp($.extend(options, {tags: tagList})));

            // add selection listener to the statistic (for now)
            domElem.find('.large').click(function() {
                domElem.card("toggleSelect");
            });

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

    var buildCards = function(data) {
        var i, card;
        for (i = 0; i < data.length; i++) {
            card = $('<div></div>');
            if (data[i].archived) {
                $('#archive-sect').append(card);
            } else {
                $('#panels-sect').append(card);
            }
            card.patternCard(data[i]);
            categoryWidget.addCat(data[i].icon);
        }
    }

    /*  Sample data structure coming from server when the page is first loaded to build the
     initial cards */
    var cards = [{
            title: "Privacy Policy",
            desc: "I'm not sure what this pattern is.",
            timeframe: "last hour",
            statistic: "9.42",
            units: "%",
            tags: ["privacy", "clicks"],
            icon: 1,
            titleColor: "#e75555"
        },
        {
            title: "Physical Shoppers",
            desc: "Percentage who looked at buying things.",
            timeframe: "last 6 hours",
            statistic: "11.78",
            units: "%",
            tags: ["landing", "clicks"],
            icon: 0
        },
        {
            title: "Diligence",
            desc: "How many pages did people peruse.",
            timeframe: "last 6 hours",
            statistic: "3.8",
            units: "pages",
            tags: ["product page"],
            icon: 1
        },
        {
            title: "Just Looking",
            desc: "Percentage who came and did nothing.",
            timeframe: "last 6 hours",
            statistic: "11.78",
            units: "%",
            tags: ["homepage", "clicks"],
            icon: 1
        },
        {
            title: "Just Looking",
            desc: "Percentage who came and did nothing.",
            timeframe: "last 6 hours",
            statistic: "11.78",
            units: "%",
            tags: ["homepage", "clicks"],
            icon: 1,
            archived: true
        }
    ];

    // Build cards with the fake data
    buildCards(cards);

    // Build category selector
    categoryWidget.update();

    // Add tooltips to card action buttons
    $('.card-btns div').omniTooltip({arrowPos: "bottom-center"});

    // Add dropdown to the sort button
    $('#sort-btn').dropdownSelect({
        selections: [
            {
                text: "Icon (Category)",
                click: function() {
                    admin.cardWidget.sort(function(a, b) {
                        return parseInt($(a).card("option", "icon")) -
                            parseInt($(b).card("option", "icon"));
                    });
                    $('#sort-msg').text("Sort By " + $(this).text());
                }
            },
            {
                text: "Importance (Color)",
                click: function() {
                    // bases importance based on the amount of red
                    admin.cardWidget.sort(function(a, b) {
                        var c = $(a).find('.title').css("background-color") || "rgb(0,0,0)",
                            d = $(b).find('.title').css("background-color") || "rgb(0,0,0)";
                        c = parseInt(c.substring(4, c.indexOf(",")));
                        d = parseInt(d.substring(4, d.indexOf(",")));
                        return c - d;
                    });
                    $('#sort-msg').text("Sort By " + $(this).text());
                }
            },
            {
                text: "Statistic",
                click: function() {
                    admin.cardWidget.sort(function(a, b) {
                        return parseInt($(a).find('.large').text()) - parseInt($(b).find('.large').text());
                    });
                    $('#sort-msg').text("Sort By " + $(this).text());
                }
            },
            {
                text: "Custom 2",
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
            admin.omniTooltip.toggle();
        }
    });

}(jQuery)); //omniPatternsReady()