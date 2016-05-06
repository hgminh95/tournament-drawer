"use strict";

var Tournament = {};

Tournament.defaults = {
    barColor: "#fff"
};

Tournament.types = {};

var helpers = Tournament.helpers = {};

var each = helpers.each = function(loopable, callback, self) {
    var additionalArgs = Array.prototype.slice.call(arguments, 3);

    if (loopable) {
        if (loopable.length === +loopable.length) {
            var i;
            for (i = 0; i < loopable.length; i++) {
                callback.apply(self, [loopable[i], i].concat(additionalArgs));
            }
        }
        else {
            for (var item in loopable) {
                callback.apply(self, [loopable[item], item].concat(additionalArgs));
            }
        }
    }
};

var clone = helpers.clone = function(obj) {
    var objClone = {};
    each(obj, function(value, key) {
        if (obj.hasOwnProperty(key)) {
            objClone[key] = value;
        }
    });
    return objClone;
};

var extend = helpers.extend = function(base) {
    each(Array.prototype.slice.call(arguments, 1), function(extensionObject) {
        each(extensionObject, function(value, key) {
            if (extensionObject.hasOwnProperty(key)) {
                base[key] = value;
            }
        });
    });

    return base;
};

// Merge properties in left object over to a shallow clone of object right
var merge = helpers.merge = function(base, master) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift({});
    return extend.apply(null, args);
};

// Basic javascript inheritance based on the model created in Backbone.js
var inherits = helpers.inherits = function(extensions) {
    var parent = this;
    var TournamentElement = (extensions && extensions.hasOwnProperty("constructor")) ? extensions.constructor : function() { return parent.apply(this, arguments); };

    var Surrogate = function() { this.constructor = TournamentElement; }
    Surrogate.prototype = parent.prototype;
    TournamentElement.prototype = new Surrogate()

    TournamentElement.extend = inherits;

    if (extensions) extend(TournamentElement.prototype, extensions);

    TournamentElement.__super__ = parent.prototype;

    return TournamentElement;
};

var noop = helpers.noop = function() {};

var uid = helpers.uid = (function() {
    var id = 0;
    return function() {
        return "chart-" + id++;
    };
})();

var warn = helpers.warn = function(str) {
    // Method for warning of errors
    if (window.console && typeof window.console == "function")
        console.warn(str);
};

var amd = helpers.amd = (typeof define === 'function' && define.amd);

//Templating methods
//Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
var template = helpers.template = function(templateString, valuesObject){

    // If templateString is function rather than string-template - call the function for valuesObject

    if(templateString instanceof Function){
        return templateString(valuesObject);
    }

    var cache = {};
    function tmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
        cache[str] = cache[str] :

        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'") +
            "');}return p.join('');"
        );

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    }

    return tmp1(templateString, valuesObject);
}

var addEvent = helpers.addEvent = function(node, eventType, method) {
    if (node.addEventListener) {
        node.addEventListener(eventType, method);
    }
    else if (node.attachEvent) {
        node.attachEvent('on' + eventType, method);
    }
    else {
        node['on' + eventType] = method;
    }
}

var removeEvent = helpers.removeEvent = function(node, eventType, handler) {
    if (node.removeEventListener) {
        node.removeEventListener(eventType, handler, false);
    }
    else if (node.detachEvent) {
        node.detachEvent('on' + eventType, handler);
    }
    else {
        node['on' + eventType] = noop;
    }
}

var bindEvents = helpers.bindEvents = function(tournament, events, handler) {
    if (!tournament.events) tournament.events = {};

    each(events, function(eventName) {
        tournament.events[eventName] = function() {
            handler.apply(tournament, arguments);
        };

        addEvent(tournament.tournament.canvas, eventName, tournament.events[eventName]);
    });
}

var unbindEvents = helpers.unbindEvents = function(tournament, events) {
    each(events, function(handler, eventName) {
        removeEvent(tournament.tournament.canvas, eventName, handler);
    });
}

Tournament.instances = {};

Tournament.Type = class {
    constructor(data, options, ctx) {
        this.options = merge(Tournament.defaults, options || {});

        this.ctx = ctx;

        // Add the tournament instance to global namespace
        // Tournament.instances[this.id] = this;
    }

    clear() {
        this.ctx.clearRect(0, 0, tournament.width, tournament.height);
        return this;
    }

    reflow() {
        noop();
    }

    render(reflow) {
        if (reflow)
            this.reflow();

        // TODO: Add animation here

        this.draw();
    }
}

Tournament.Element = class {
    constructor(configuration) {
        extend(this, configuration);
    }

    inRange(tx, ty) {
        return false;
    }

    save() {
        this._saved = clone(this);
        delete this._saved._saved;

        return this;
    }

    draw() {

    }
}

Tournament.Player = class extends Tournament.Element {
    constructor(configuration) {
        super(configuration);
        this.display = true;
    }

    draw() {
        if (this.display) {
            var ctx = this.ctx;

            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;

            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fill();
            if (this.showStroke) {
                ctx.stroke();
            }

            if (this.player != null) {
                ctx.textAlign = "left";
                ctx.fillStyle = "#666666";
                ctx.fillText(this.player, this.x + 10, this.y + this.height / 2 + 4);
            }

            if (this.score != null) {
                ctx.textAlign = "right";
                ctx.fillStyle = "#666666";
                ctx.fillText(this.score, this.x + this.width - 10, this.y + this.height / 2 + 4);
            }
        }
    }

    inRange(tx, ty) {
        return tx > this.x && ty > this.y && tx < this.x + this.width && ty < this.y + this.height;
    }

    set player(player) {
        this._player = player;

        if (this.display)
            this.draw();
    }

    get player() {
        return this._player;
    }

    set score(score) {
        this._score = score;

        if (this.display)
            this.draw();
    }

    get score() {
        return this._score;
    }

    set fillColor(color) {
        if (this._fillColor != color) {
            this._fillColor = color;

            if (this.display)
                this.draw();
        }
    }

    get fillColor() {
        return this._fillColor;
    }
}

helpers.addEvent(window, "resize", (function() {
    return function() {
        // TODO resize all tournament.
    }
})());;

if (amd) {
    define('Tournament', [], function() {
        return Tournament;
    });
}
else if (typeof module === 'object' && module.exports) {
    module.exports = Tournament;
}
