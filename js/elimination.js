(function() {
    "use strict";

    var root = this;
    var Tournament = root.Tournament;
    var helpers = Tournament.helpers;

    var defaultConfig = {
        // Number - Width of a round
        roundWidth: 80,

        // Number - Space between round
        roundSpacing: 30
    }

    Tournament.Match = Tournament.Element.extend({
        display: true,
        inRange: function(tx, ty) {
            return false;
        },
        draw: function() {
            if (this.display) {
                // TODO draw connecting line between match

                var player1 = new Tournament.Player({
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

                var player2 = new Tournament.Player({
                    ctx: this.ctx,
                    x: this.x,
                    y: this.y + this.height / 2,
                    width: this.width,
                    height: this.height - this.height / 2,
                    strokeColor: this.strokeColor,
                    fillColor: this.fillColor,
                    strokeWidth: this.strokeWidth,
                    showStroke: this.showStroke,
                    player: this.player1,
                    score: this.score1
                });

                player1.draw();
                player2.draw();
            }
        }
    })

    Tournament.Type.extend({

        name: "Elimination",
        defaults: defaultConfig,

        initialize: function(data) {
            this.matches = [];

            var options = this.options;

            helpers.each(data.matches, function(match, index) {
                this.matches.push(new Tournament.Match({
                    ctx: this.tournament.ctx,
                    x: match.group * options.roundWidth + match.group * options.roundSpacing + 5,
                    y: match.position + 5,
                    width: options.roundWidth,
                    height: data.meta.height,
                    strokeColor: "red",
                    fillColor: options.barColor,
                    strokeWidth: 1,
                    showStroke: true
                }));
            }, this);

            // TODO bind events

            this.render();
        },

        draw: function() {
            // TODO draw round name

            helpers.each(this.matches, function(match, index) {
                match.draw();
            }, this);
        },

        schedule: function(type, options) {
            // TODO auto generate data.matches
            // type: "single" or "double"
            // options:
            //     playersCount <required> number of players
            //     ... will be added later
        }
    });
}).call(this);
