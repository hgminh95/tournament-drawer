"use strict";

var Tournament = {};

Tournament.defaults = {
    barColor: "#fff",

    padding: 5
};

Tournament.types = {};

var helpers = Tournament.helpers = {};

helpers.getMousePos = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();

    return {
        x: Math.floor((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
        y: Math.floor((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
    }
}

helpers.each = function(loopable, callback, self) {
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

helpers.clone = function(obj) {
    var objClone = {};
    each(obj, function(value, key) {
        if (obj.hasOwnProperty(key)) {
            objClone[key] = value;
        }
    });
    return objClone;
};

helpers.extend = function(base) {
    for (let extObj of Array.prototype.slice.call(arguments, 1)) {
        for (let propName in extObj) {
            base[propName] = extObj[propName];
        }
    }

    return base;
};

// Merge properties in left object over to a shallow clone of object right
helpers.merge = function(base, master) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift({});
    return helpers.extend.apply(null, args);
};

helpers.noop = function() {};

helpers.uid = (function() {
    var id = 0;
    return function() {
        return "chart-" + id++;
    };
})();

helpers.amd = (typeof define === 'function' && define.amd);

helpers.addEvent = function(node, eventType, method) {
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

helpers.removeEvent = function(node, eventType, handler) {
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

helpers.bindEvents = function(tournament, events, handler) {
    if (!tournament.events) tournament.events = {};

    each(events, function(eventName) {
        tournament.events[eventName] = function() {
            handler.apply(tournament, arguments);
        };

        addEvent(tournament.tournament.canvas, eventName, tournament.events[eventName]);
    });
}

helpers.unbindEvents = function(tournament, events) {
    each(events, function(handler, eventName) {
        removeEvent(tournament.tournament.canvas, eventName, handler);
    });
}

Tournament.instances = {};

Tournament.Type = class {
    constructor(data, options, ctx) {
        this.options = helpers.merge(Tournament.defaults, options || {});

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
        helpers.extend(this, configuration);
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

Tournament.Cell = class extends Tournament.Element {
    constructor(configuration) {
        super(configuration);

        this.display = true;
    }

    draw() {
        if (this.display) {
            var ctx = this.ctx;

            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.lineWidth;

            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fill();
            ctx.stroke();

            if (this.text != null)
                this.drawText(this.text, 0, "center");
        }
    }

    drawText(text, size, align) {
        var ctx = this.ctx;

        ctx.textAlign = align;
        ctx.fillStyle = '#666666';

        if (align === "left") {
            ctx.fillText(text, this.x + 10, this.y + this.height / 2 + 4);
        }
        else if (align === "right") {
            ctx.fillText(text, this.x + this.width - 10, this.y + this.height / 2 + 4);
        }
        else if (align === "center") {
            ctx.fillText(text, this.x + this.width / 2, this.y + this.height / 2 + 4);
        }
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

Tournament.Player = class extends Tournament.Cell {
    draw() {
        super.draw();

        if (this.player != null)
            super.drawText(this.player, 0, "left");
        if (this.score != null)
            super.drawText(this.score, 0, "right");
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
}

helpers.addEvent(window, "resize", (function() {
    return function() {
        // TODO resize all tournament.
    }
})());;

if (helpers.amd) {
    define('Tournament', [], function() {
        return Tournament;
    });
}
else if (typeof module === 'object' && module.exports) {
    module.exports = Tournament;
}
