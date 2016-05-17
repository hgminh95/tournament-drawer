var generateFakeData = function() {
    return {
        meta: {
            height: 50
        },
        groups: ["Quater-final", "Semi-final", "Final"],
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
                position: 80
            },
            {
                player1: 'Very long player"s name',
                player2: 'short',
                score1: 1,
                score2: 3,
                group: 0,
                position: 160
            },
            {
                player1: 'Player 5',
                player2: 'Player 6',
                group: 0,
                position: 240
            },
            {
                player1: 'Player 1',
                player2: 'Player 3',
                link1: 0,
                link2: 1,
                group: 1,
                position: 40
            },
            {
                player1: 'short',
                link1: 2,
                link2: 3,
                group: 1,
                position: 200
            },
            {
                link1: 4,
                link2: 5,
                group: 2,
                position: 120
            }
        ]
    }
}
