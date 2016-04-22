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

    Tournament.Type.extend({
        name: "Test",
        defaults: defaultConfig,
        initialize: function(data) {
            // Declare the extensions of the default point, to cater for the options passed in to the constructor.
            this.matches = [];

            data = this.generateDummyData();
            console.log(this.defaults);

            helpers.each(data.matches, function(match, index) {
                this.matches.push(new Tournament.Match({
                    ctx: this.tournament.ctx,
                    x: match.group * this.defaults.roundWidth + match.group * this.defaults.roundSpacing,
                    y: match.position,
                    width: this.defaults.roundWidth,
                    height: data.meta.height,
                    strokeColor: "rgba(255, 0, 0, 0.5)",
                    fillColor: "orange",
                    strokeWidth: 1,
                    showStroke: true
                }));
            }, this);

            this.render();
        },

        draw() {
            helpers.each(this.matches, function(match, index) {
                match.draw();
            }, this);
        },

        generateDummyData() {
            return {
                meta: {
                    height: 25
                },
                matches: [
                    {
                        group: 0,
                        position: 0,
                    },
                    {
                        group: 0,
                        position: 40
                    },
                    {
                        group: 0,
                        position: 80
                    },
                    {
                        group: 0,
                        position: 120
                    },
                    {
                        group: 1,
                        position: 20
                    },
                    {
                        group: 1,
                        position: 100
                    },
                    {
                        group: 2,
                        position: 60
                    }
                ]
            }
        }
    })
}).call(this);
