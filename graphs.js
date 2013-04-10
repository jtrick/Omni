$(document).ready(function omniPatternsReady() {

    // Graphs card widget definition
    $.widget("ui.graphCard", {
        _create: function() {
            var options = this.options,
                domElem = this.element,
                i;

            // pattern card specific body content
            var graphTemp = _.template('' +
                '<div class="content">' +
                '<div class="timeframe">In the <span class="underline">{{timeframe}}</span>:</div>' +
                '<div class="graph"></div>' +
                '</div>'
            );

            // create the card base
            domElem.card(options).addClass("graph");

            // set the card body content
            domElem.card("setContent", graphTemp(options));

            // create the graph
            $.plot(domElem.find('.graph'), options.chart, options.chart_opt);


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
            card.graphCard(data[i]);
        }
    }

    var tmpchart = [
        {
            "data": [[55,160],[56,95.39],[58,74.82],[59,72.5],[60,51.36],
                [63,48.56],[65,46.56],[66,43.86],[67,43.66],[77,25.2],
                [78,22.45],[80,20.69],[81,32.11],[84,32.11],[85,30.81],
                [86,28.39],[88,28.37],[91,26.6],[93,25.9]],
            "color": "#557be6",
            "hoverable": true,
            "clickable": true
        }
    ];

    var tmpoptions = {
        "xaxis": {
            "ticks": [[56,""],[56,"02\/25"],[58,"02\/27"],[59,"02\/28"],[60,"03\/01"],[63,"03\/04"],[65,"03\/06"],[66,"03\/07"],[67,"03\/08"],[77,"03\/18"],[78,"03\/19"],[80,"03\/21"],[81,"03\/22"],[84,"03\/25"],[85,"03\/26"],[86,"03\/27"],[88,"03\/29"],[91,"04\/01"],[93,"04\/03"]]
        },
        "grid": {
            "hoverable": true,
            "clickable": true
        },
        "lines": {
            "show": true,
            "lineWidth": 5
        },
        "points": {
            "show": true,
            "lineWidth": 2,
            "radius": 5
        }
    };

    /*  Sample data structure coming from server when the page is first loaded to build the
     initial cards */
    var cards = [{
            title: "Privacy Policy",
            desc: "I'm not sure what this pattern is.",
            timeframe: "last hour",
            icon: 1,
            titleColor: "#e75555",
            chart: tmpchart,
            chart_opt: tmpoptions
        },
        {
            title: "Physical Shoppers",
            desc: "Percentage who looked at buying things.",
            timeframe: "last 6 hours",
            icon: 0,
            chart: tmpchart,
            chart_opt: tmpoptions
        },
        {
            title: "Diligence",
            desc: "How many pages did people peruse.",
            timeframe: "last 6 hours",
            icon: 1,
            chart: tmpchart,
            chart_opt: tmpoptions
        },
        {
            title: "Just Looking",
            desc: "Percentage who came and did nothing.",
            timeframe: "last 6 hours",
            icon: 1,
            chart: tmpchart,
            chart_opt: tmpoptions
        },
        {
            title: "Just Looking",
            desc: "Percentage who came and did nothing.",
            timeframe: "last 6 hours",
            icon: 1,
            archived: true,
            chart: tmpchart,
            chart_opt: tmpoptions
        }
    ];

    // Build cards with the fake data
    buildCards(cards);

    // Add tooltips to card action buttons
    $('.card-btns div').omniTooltip({arrowPos: "bottom-center"});

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