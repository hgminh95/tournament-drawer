(function() {
    "use strict";

    var root = this;
    var previous = root.Tournament;

    var Tournament = function(context) {
        var tournament = this;
        this.canvas = context.canvas;
        this.ctx = context;

        return this;
    }

    Tournament.defaults = {
        global: {

        }
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

    var clear = helpers.clear = function(tournament) {
        tournament.ctx.clearRect(0, 0, tournament.width, tournament.height);
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

    Tournament.Type = function(data, options, tournament) {
        this.options = options;
        this.tournament = tournament;
        //this.id = uid();

        // Add the chart instance to global namespace
        Tournament.instances[this.id] = this;

        // Initialize is always call

        this.initialize.call(this, data);
    };

    extend(Tournament.Type.prototype, {
        initialize: function() { return this; },
        clear: function() {
            clear(this.tournament);
            return this;
        },
        reflow: noop,
        render: function(reflow) {
            if (reflow) {
                this.reflow();
            }

            // TODO: Add animation here

            this.draw();
        }
    });

    Tournament.Type.extend = function(extensions) {
        var parent = this;

        var TournamentType = function() {
            return parent.apply(this, arguments);
        }

        // Copy the prototype object of the this class
        TournamentType.prototype = clone(parent.prototype);

        // Override some of the properties in the base class with the new extensions
        extend(TournamentType.prototype, extensions);

        TournamentType.extend = Tournament.Type.extend;

        if (extensions.name || parent.prototype.name) {
            var tournamentName = extensions.name || parent.prototype.name;

            // Assign any potential default values of the new tournament type

            // If none are defined, we will use a clone of the tournament type this is being extended from.
            // I.e. if we extend a line chart, we will use the defaults from line chart if our new chart
            // does not define some defaults of their own

            var baseDefaults = (Tournament.defaults[parent.prototype.name]) ? clone(Tournament.defaults[parent.prototype.name]) : {};

            Tournament.defaults[tournamentName] = extend(baseDefaults, extensions.defaults);

            Tournament.types[tournamentName] = TournamentType;

            // Register this new chart type in the Chart prototype
            Tournament.prototype[tournamentName] = function(data, options) {
                var config = merge(Tournament.defaults.global, Tournament.defaults[tournamentName], options || {});

                return new TournamentType(data, config, this);
            };
        }
        else {
            warn("Name not provided for this tournament, so it has not been registered.");
        }

        return parent;
    };

    Tournament.Element = function(configuration) {
        extend(this, configuration);
        this.initialize.apply(this, arguments);
        this.save();
    }

    extend(Tournament.Element.prototype, {
        initialize: function() {},
        save: function() {
            this._saved = clone(this);
            delete this._saved._saved;
            return this;
        }
    });

    Tournament.Element.extend = inherits;

    Tournament.Player = Tournament.Element.extend({
        display: true,
        inRange: function(tx, ty) {
            // TODO Check if element's area contains point (tx, ty)
            return false;
        },
        draw: function() {
            if (this.display) {
                var ctx = this.ctx;

                ctx.fillStyle = this.fillColor;
                ctx.strokeStyle = this.strokeColor;
                ctx.lineWidth = this.strokeWidth;

                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.fill();
                if (this.showStroke) {
                    ctx.stroke();
                }

                // TODO draw player's name (this.player)

                // TODO draw player's score (this.score)
            }
        }
    });

    helpers.addEvent(window, "resize", (function() {
        return function() {
            // TODO resize all tournament.
            console.log("Window resize");
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

    root.Tournament = Tournament;

    Tournament.noConflict = function() {
        root.Tournament = previous;
        return Tournament;
    };
}).call(this);

