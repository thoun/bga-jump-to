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
declare class JumpToEntry {
    /**
     * Label shown on the entry. For players, it's player name.
     */
    label: string;
    /**
     * HTML Element id, to scroll into view when clicked.
     */
    targetId: string;
    /**
     * Any element that is useful to customize the link.
     * Basic ones are 'color' and 'colorback'.
     */
    data: any;
    constructor(
    /**
     * Label shown on the entry. For players, it's player name.
     */
    label: string, 
    /**
     * HTML Element id, to scroll into view when clicked.
     */
    targetId: string, 
    /**
     * Any element that is useful to customize the link.
     * Basic ones are 'color' and 'colorback'.
     */
    data?: any);
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
declare class JumpToManager {
    private game;
    private settings?;
    constructor(game: Game, settings?: JumpToSettings);
    private createPlayerJumps;
    private jumpToggle;
    private jumpTo;
    private getOrderedPlayers;
    private createEntries;
}
declare const define: any;
