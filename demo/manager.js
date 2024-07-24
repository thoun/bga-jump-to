let jumpToManager;

const LOCAL_STORAGE_JUMP_TO_FOLDED_KEY = 'BgaJumpTo-folded';

const COLORS = [
    'ff0000',
    '008000',
    '0000ff',
    'ffa500',
    '000000',
    'e94190',
    '982fff',
    '72c3b1',
    'f07f16',
    'bdd002',
    '7b7b7b',
];

const game = {
    gamedatas: {
        players: {},
    }
}

function initManager() {
    for (let i=1; i<=6; i++) {
        const playerId = 1000 + i;
        const playerColor = COLORS[i];
        game.gamedatas.players[playerId] = {
            name: `player${i}`,
            id: playerId,
            playerNo: i,
            color: playerColor,
        };

        document.getElementById(`game_play_area_wrap`).insertAdjacentHTML('beforeend', `
            <div id="player-table-${playerId}" class="player-table" style="--color: #${playerColor}"><span>player${i}</span>'s table</div>
        `);
    }

    document.getElementById(`game_play_area_wrap`).insertAdjacentHTML('beforeend', `
        <div id="rules-notice" class="player-table">A probably not very useful information</div>
    `);

    jumpToManager = new JumpToManager(game, {
        localStorageFoldedKey: LOCAL_STORAGE_JUMP_TO_FOLDED_KEY,
        topEntries: [
            new JumpToEntry(_('Main board'), 'main-board', { 'color': 'darkgray' })
        ],
        bottomEntries: [
            new JumpToEntry(_('Rules notice'), 'rules-notice', { 'color': 'lightgray' })
        ],
        entryClasses: 'round-point',
    });
}
