$(document).ready(function omniPatternsReady() {

    // non-jQuery "widget". Only need one and not really UI based
    var categoryWidget = (function() {
        // static array tracking categories on the page
        var categories = [];

        this.addCat = function(cat) {
            if (categories.indexOf(cat) < 0) {
                categories.push(cat);
            }
        };

        this.update = function() {
            var i;
            $('#cat-div').empty();
            for (i = 0; i < categories.length; i++) {
                $('#cat-div').append('<div class="title-icon-' + categories[i] + ' icon dark"></div>');
            }
        };

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
            domElem.card(options);

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
            $('#panels-sect').append(card);
            card.patternCard(data[i]);
            categoryWidget.addCat(data[i].icon);
        }
    }

    /*  Sample data structure coming from server when the page is first loaded to build the
     initial cards */
    var cards = [{
            title: "Privacy Policy",
            timeframe: "last hour",
            statistic: "9.42",
            units: "%",
            tags: ["privacy", "clicks"],
            icon: 1,
            titleColor: "#e75555"
        },
        {
            title: "Physical Shoppers",
            timeframe: "last 6 hours",
            statistic: "11.78",
            units: "%",
            tags: ["landing", "clicks"],
            icon: 0
        },
        {
            title: "Diligence",
            timeframe: "last 6 hours",
            statistic: "3.8",
            units: "pages",
            tags: ["product page"],
            icon: 1
        },
        {
            title: "Just Looking",
            timeframe: "last 6 hours",
            statistic: "11.78",
            units: "%",
            tags: ["homepage", "clicks"],
            icon: 1
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

    // test sort. Sort based on the values of the statistic
    // these sort methods would go in the callback function when you
    // declare a dropdownSelect
    admin.cardWidget.sort(function(a, b) {
        return parseInt($(a).find('.large').text()) - parseInt($(b).find('.large').text());
    });

}(jQuery)); //omniPatternsReady()