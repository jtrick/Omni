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
            domElem.find('.graph').highcharts(options.chart);

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

    var tmpchart = {
        chart: {
            type: 'line',
            marginRight: 130,
            marginBottom: 25
        },
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -10,
            y: 100,
            borderWidth: 0
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    };

    /*  Sample data structure coming from server when the page is first loaded to build the
     initial cards */
    var cards = [{
            title: "Privacy Policy",
            desc: "I'm not sure what this pattern is.",
            timeframe: "last hour",
            icon: 1,
            titleColor: "#e75555",
            chart: tmpchart
        },
        {
            title: "Physical Shoppers",
            desc: "Percentage who looked at buying things.",
            timeframe: "last 6 hours",
            icon: 0,
            chart: tmpchart
        },
        {
            title: "Diligence",
            desc: "How many pages did people peruse.",
            timeframe: "last 6 hours",
            icon: 1,
            chart: tmpchart
        },
        {
            title: "Just Looking",
            desc: "Percentage who came and did nothing.",
            timeframe: "last 6 hours",
            icon: 1,
            chart: tmpchart
        },
        {
            title: "Just Looking",
            desc: "Percentage who came and did nothing.",
            timeframe: "last 6 hours",
            icon: 1,
            archived: true,
            chart: tmpchart
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