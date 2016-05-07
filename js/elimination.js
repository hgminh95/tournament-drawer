"use strict";

var defaultConfig = {
    // Number - Width of a round
    roundWidth: 120,

    // Number - Space between round
    roundSpacing: 60,

    textStyle: "10px Open Sans",

    strokeColor: "#ddd"
}

Tournament.Match = class extends Tournament.Element {
    constructor(configuration) {
        super(configuration);

        this.connectPoints = [];
        this.display = true;
    }

    inRange(tx, ty) {
        return tx > this.x && ty > this.y && tx < this.x + this.width && ty < this.y + this.height;
    }

    addLink(match) {
        var connectPoint = {};
        connectPoint.x = match.x + match.width;
        connectPoint.y = match.y + match.height / 2;

        this.connectPoints.push(connectPoint);
    }

    highlight(tx, ty) {
        if (this.player1 != null && this.player1.inRange(tx, ty)) {
            this.player1.fillColor = '#ddd';
            this.player2.fillColor = '#fff';
        }
        else if (this.player2 != null) {
            this.player1.fillColor = '#fff';
            this.player2.fillColor = '#ddd';
        }
    }

    highlightPlayer(playerName) {
        if (this.player1 != null) this.player1.fillColor = '#fff';
        if (this.player2 != null) this.player2.fillColor = '#fff';

        if (playerName == null) return null;

        if (this.player1 != null && this.player1.player == playerName) {
            this.player1.fillColor = '#ddd';
        }
        else if (this.player2 != null && this.player2.player == playerName) {
            this.player2.fillColor = '#ddd';
        }
    }

    unHighlight() {
        if (this.player1 != null) this.player1.fillColor = '#fff';
        if (this.player2 != null) this.player2.fillColor = '#fff';
    }

    draw() {
        if (this.display) {
            this.player1 = new Tournament.Player({
                ctx: this.ctx,
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height / 2,
                strokeColor: this.strokeColor,
                fillColor: this.fillColor,
                strokeWidth: this.strokeWidth,
                showStroke: this.showStroke,
                player: this.player1,
                score: this.score1
            });

            this.player2 = new Tournament.Player({
                ctx: this.ctx,
                x: this.x,
                y: this.y + this.height / 2,
                width: this.width,
                height: this.height - this.height / 2,
                strokeColor: this.strokeColor,
                fillColor: this.fillColor,
                strokeWidth: this.strokeWidth,
                showStroke: this.showStroke,
                player: this.player2,
                score: this.score2
            });

            this.player1.draw();
            this.player2.draw();

            helpers.each(this.connectPoints, function(point, index) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + this.height / 2);
                ctx.lineTo((this.x + point.x) / 2, this.y + this.height / 2);
                ctx.lineTo((this.x + point.x) / 2, point.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }, this);
        }
    }

    selectedPlayer(tx, ty) {
        if (this.player1 != null && this.player1.inRange(tx, ty)) {
            return this.player1.player;
        }
        else if (this.player2 != null) {
            return this.player2.player;
        }

        return '$$';
    }
}

Tournament.Elimination = class extends Tournament.Type {
    constructor(data, options, ctx) {
        options = merge(defaultConfig, options || {});
        super(data, options, ctx);

        this.matches = [];

        var options = this.options;

        helpers.each(data.matches, function(match, index) {
            this.matches.push(new Tournament.Match({
                ctx: this.ctx,
                x: match.group * options.roundWidth + match.group * options.roundSpacing + 5,
                y: match.position + 5,
                width: options.roundWidth,
                height: data.meta.height,
                strokeColor: options.strokeColor,
                fillColor: options.barColor,
                strokeWidth: 1,
                showStroke: true,
                player1: match.player1,
                player2: match.player2,
                score1: match.score1,
                score2: match.score2
            }));

            if (match.link1 != null)
                this.matches[this.matches.length - 1].addLink(this.matches[match.link1]);
            if (match.link2 != null)
                this.matches[this.matches.length - 1].addLink(this.matches[match.link2]);

        }, this);

        this.bindEvent();

        this.render();
    }

    bindEvent() {
        var self = this;

        this.ctx.canvas.addEventListener('mousemove', function(e) {
            var playerName = '$$';

            for (var match of self.matches) {
                if (match.inRange(e.clientX, e.clientY)) {
                    playerName = match.selectedPlayer(e.clientX, e.clientY);
                    break;
                }
            }

            for (var match of self.matches) {
                match.highlightPlayer(playerName);
            }

        });
    }

    addMatchClickEventListener(listener) {
        var self = this;

        this.ctx.canvas.addEventListener('click', function(e) {
            for (var match of self.matches) {
                if (match.inRange(e.clientX, e.clientY))
                    return listener(match);
            }
        });
    }

    draw() {
        // TODO draw round name

        ctx.font = this.options.textStyle;
        helpers.each(this.matches, function(match, index) {
            match.draw();
        }, this);
    }

    schedule(type, options) {
        // TODO auto generate data.matches
        // type: "single" or "double"
        // options:
        //     playersCount <required> number of players
        //     ... will be added later
    }
}
