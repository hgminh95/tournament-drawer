var generateFakeData = function() {
    return {
        meta: {
            height: 25
        },
        matches: [
            {
                player1: 'Player 1',
                player2: 'Player 2',
                score1: 3,
                score2: 2,
                group: 0,
                position: 0
            },
            {
                player1: 'Player 3',
                player2: 'Player 4',
                score1: 3,
                score2: 0,
                group: 0,
                position: 40
            },
            {
                player1: 'Very long player"s name',
                player2: 'short',
                score1: 1,
                score2: 3,
                group: 0,
                position: 80
            },
            {
                player1: 'Player 5',
                player2: 'Player 6',
                // Missing score means this match have not been played.
                group: 0,
                position: 120
            },
            {
                player1: 'Player 1',
                player2: 'Player 3',
                link1: 0,
                link2: 1,
                group: 1,
                position: 20
            },
            {
                player1: 'short',
                // Missing player's name means
                link1: 2,
                link2: 3,
                group: 1,
                position: 100
            },
            {
                link1: 4,
                link2: 5,
                group: 2,
                position: 60
            }
        ]
    }
}
