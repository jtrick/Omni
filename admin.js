// omni/admin.js  Copyright (c)2013 Codapt LLC, all rights reserved.  For license see: http://OpenAce.org/license?id=omni/admin.js

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
}

var unwatch = function(obj, attr, name) {
    if (obj.hasOwnProperty("_watchers") && obj._watchers.hasOwnProperty(attr) &&
        obj._watchers[attr].hasOwnProperty(name)) {
        delete  obj._watchers[attr][name];
    }
}

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
        );

        domElem.addClass("card").html(cardTemp(options));

        domElem.children(".title").disableSelection();
        if (options.hasOwnProperty("titleColor")) {
            domElem.children(".title").css("backgroundColor", options.titleColor);
        }
    }
});

$(document).ready(function omniAdminReady() {

    $("#card1").patternCard({
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
	
}(jQuery)); //omniAdminReady()