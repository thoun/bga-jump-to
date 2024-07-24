/**
 * The player's informations needed in gamedatas.players if playersEntries is not set.
 * playerNo (used to sort the players) must be added to the SQL of getAllDatas like this : `$sql = "SELECT player_id id, player_score score, player_no playerNo FROM player ORDER BY player_no";`
 */
interface JumpToPlayer {
    color: string;
    color_back: string | null;
    id: number | string;
    name: string;
    playerNo: number | string;
}

/**
 * Jump to entry.
 */
class JumpToEntry {
    constructor(
        /**
         * Label shown on the entry. For players, it's player name.
         */
        public label: string,

        /**
         * HTML Element id, to scroll into view when clicked.
         */
        public targetId: string,

        /**
         * Any element that is useful to customize the link.
         * Basic ones are 'color' and 'colorback'.
         */
        public data: any = {},
    ) {}
}

interface JumpToSettings {
    /**
     * The key used to persist the folded state on localStorage.
     * Default (unset) is no storage.
     */
    localStorageFoldedKey?: string;

    /**
     * Top entries, usually the table(s).
     * Default (empty)
     */
    topEntries?: JumpToEntry[];

    /**
     * Players entries, usually one entry by player. If the game has a fake (automata) player, it can be added here.
     * Default one entry by player in gamedatas (see JumpToPlayer)
     */
    playersEntries?: JumpToEntry[];

    /**
     * Bottom entries, usually the information panels.
     * Default (empty)
     */
    bottomEntries?: JumpToEntry[];

    /**
     * Classes to add to each entry. Pre-built classes are `round-point`, `hexa-point` and `triangle-point`.
     * Default (empty) is a square box
     */
    entryClasses?: string;

    /**
     * Color for the toggle fold button.
     */
    toggleColor?: string;

    /**
     * Show an eye icon before the label.
     * The icon can be overriden by setting `--bga-jump-to_eye-url: url("data:image/svg+xml, [...]");` on `#jump-controls`.
     * Default true.
     */
    showEye?: boolean;

    /**
     * Show the player avatar before the label.
     * If active, takes the value of `entry.data.avatarUrl` as a CSS url (`url('http://...')`) or takes the player icon if not set.
     * Default true. 
     */
    showAvatar?: boolean;

    /**
     * Set if the controls are folded by default.
     * Default (false) is visible controls
     */
    defaultFolded?: boolean;
}

class JumpToManager {

    constructor(private game: Game, private settings?: JumpToSettings) {
        const entries = [
            ...(settings?.topEntries ?? []),
            ...(settings?.playersEntries ?? this.createEntries(Object.values((game as any).gamedatas.players))),
            ...(settings?.bottomEntries ?? []),
        ];
        this.createPlayerJumps(entries);

        let folded = settings?.defaultFolded ?? false;
        if (settings?.localStorageFoldedKey) {
            const localStorageValue = localStorage.getItem(settings.localStorageFoldedKey);
            if (localStorageValue) {
                folded = localStorageValue == 'true';
            }
        }

        document.getElementById('bga-jump-to_controls').classList.toggle('folded', folded);
    }
    
    private createPlayerJumps(entries: JumpToEntry[]) {
        document.getElementById(`game_play_area_wrap`).insertAdjacentHTML('afterend',
        `
        <div id="bga-jump-to_controls">        
            <div id="bga-jump-to_toggle" class="bga-jump-to_link ${this.settings?.entryClasses ?? ''} toggle" style="--color: ${this.settings?.toggleColor ?? 'black'}">
                ⇔
            </div>
        </div>`);
        document.getElementById(`bga-jump-to_toggle`).addEventListener('click', () => this.jumpToggle());

        entries.forEach(entry => {
            let html = `<div id="bga-jump-to_${entry.targetId}" class="bga-jump-to_link ${this.settings?.entryClasses ?? ''}">`;
            if (this.settings?.showEye ?? true) {
                html += `<div class="eye"></div>`;
            }
            if ((this.settings?.showAvatar ?? true) && entry.data?.id) {
                let cssUrl = entry.data?.avatarUrl;
                if (!cssUrl) {
                    const img = document.getElementById(`avatar_${entry.data.id}`) as HTMLImageElement;
                    const url = img?.src;
                    // ? Custom image : Bga Image
                    //url = url.replace('_32', url.indexOf('data/avatar/defaults') > 0 ? '' : '_184');
                    if (url) {
                        cssUrl = `url('${url}')`;
                    }
                }
                if (cssUrl) {
                    html += `<div class="bga-jump-to_avatar" style="--avatar-url: ${cssUrl};"></div>`;
                }
            }
            html += `
                <span class="bga-jump-to_label">${entry.label}</span>
            </div>`;
            //
            document.getElementById(`bga-jump-to_controls`).insertAdjacentHTML('beforeend', html);
            const entryDiv = document.getElementById(`bga-jump-to_${entry.targetId}`);
            Object.getOwnPropertyNames(entry.data ?? []).forEach(key => {
                entryDiv.dataset[key] = entry.data[key];
                entryDiv.style.setProperty(`--${key}`, entry.data[key]);
            });
            entryDiv.addEventListener('click', () => this.jumpTo(entry.targetId));	
        });

        const jumpDiv = document.getElementById(`bga-jump-to_controls`);
        jumpDiv.style.marginTop = `-${Math.round(jumpDiv.getBoundingClientRect().height / 2)}px`;
    }
    
    private jumpToggle(): void {
        const jumpControls = document.getElementById('bga-jump-to_controls');
        jumpControls.classList.toggle('folded');
        if (this.settings?.localStorageFoldedKey) {
            localStorage.setItem(this.settings.localStorageFoldedKey, jumpControls.classList.contains('folded').toString());
        }
    }
    
    private jumpTo(targetId: string): void {
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }

    private getOrderedPlayers(unorderedPlayers: JumpToPlayer[]) {
        const players = unorderedPlayers.sort((a, b) => Number(a.playerNo) - Number(b.playerNo));
        const playerIndex = players.findIndex(player => Number(player.id) === Number((this.game as any).player_id));
        const orderedPlayers = playerIndex > 0 ? [...players.slice(playerIndex), ...players.slice(0, playerIndex)] : players;
        return orderedPlayers;
    }

    private createEntries(players: JumpToPlayer[]) {
        const orderedPlayers = this.getOrderedPlayers(players);

        return orderedPlayers.map(player => new JumpToEntry(player.name, `player-table-${player.id}`, {
            'color': '#'+player.color,
            'colorback': player.color_back ? '#'+player.color_back : null,
            'id': player.id,
        }));
    }
}