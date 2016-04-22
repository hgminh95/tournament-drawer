(function() {
    "use strict";

    var root = this;
    var Tournament = root.Tournament;
    var helpers = Tournament.helpers;

    var defaultConfig = {

    }

    Tournament.Type.extend({
        name: "SingleElimination",
        defaults: defaultConfig,
        initialize: function(data) {
            // Declare the extensions of the default point, to cater for the options passed in to the constructor.

        }
    })
}).call(this);
