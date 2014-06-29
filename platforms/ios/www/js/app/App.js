if (typeof(CQ) == 'undefined' || !CQ) {
    var CQ = {
        device: 'iOS',
        dev: true
    };
}

CQ.App = {
    inheritsClasses: [],
    registerClasses: [],

    init: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.ready, false);
    },

    ready: function() {
        console.log('PhoneGap is ready, start app initialization.');

        // implement classes inherit and initialize register classes
        $.each(CQ.App.inheritsClasses, function(index, value) {
            $.extend(value.child, value.parent);
        });

        $.each(CQ.App.registerClasses, function(index, value) {
            if (value.init) value.init();
        });

        // modify jQuery default settings
        $.mobile.defaultPageTransition = 'none';
        $.mobile.defaultDialogTransition = 'none';
        $.mobile.buttonMarkup.hoverDelay = 0;

        document.addEventListener('backbutton', CQ.App.back, false);
        console.log('App initialization finished.');
    },

    inherits: function(child, parent) {
        this.inheritsClasses.push({
            child: child,
            parent: parent
        });
    },

    register: function(clazz) {
        this.registerClasses.push(clazz);
    },

    back: function() {
        CQ.Page.get(CQ.Session.CURRENT_PAGE).back();
    },

    iOS: function() {
        return CQ.device == 'iOS';
    },

    android: function() {
        return CQ.device == 'Android';
    }
};

CQ.Session = {
    CURRENT_PAGE: 'loading',
    CURRENT_OPEN_POPUP: null,

    USERNAME: ''
};

CQ.Id = {
    $SCRATCH: '#scratch',

    $SHARE: '#{0}-share-btn',
    $SHARE_FB: '#{0}-share-fb-btn',
    $SHARE_TW: '#{0}-share-tw-btn',
    $SHARE_LINE: '#{0}-share-line-btn',
    $SHARE_OTHER: '#{0}-share-other-btn',

    $POPUP_SHARE: '#{0}-popup-share',

    $POPUP_COIN_NOT_ENOUGH: '#{0}-popup-coin-not-enough',
    $POPUP_COIN_EXCHANGE: '#{0}-popup-coin-exchange-btn',

    $POPUP_GEM_NOT_ENOUGH: '#{0}-popup-gem-not-enough',
    $POPUP_GEM_BUY: '#{0}-popup-gem-buy-btn',

    CSS: {
        $HEADER: '.header',
        $HEADER_BACK: '.header-back-btn',
        $HEADER_GEM_CURRENT: '.header-gem-current',
        $HEADER_GEM_PURCHASE: '.header-gem-add-btn',
        $HEADER_COIN_CURRENT: '.header-coin-current',
        $HEADER_COIN_EXCHANGE: '.header-coin-add-btn',

        MAIN_ALBUM_LEVEL: 'main-album-level',
        $MAIN_ALBUM_LEVEL: '.main-album-level',
        MAIN_LEVEL_LOCKED: 'main-level-locked',
        $MAIN_LEVEL_LOCKED: '.main-level-locked'
    },

    Image: {
        HEADER_BACK: 'img/button/header-back.png',
        HEADER_BACK_TAP: 'img/button/header-back-tap.png',

        CURRENCY_ADD: 'img/button/currency-add.png',
        CURRENCY_ADD_TAP: 'img/button/currency-add-tap.png',

        MAIN_SHARE: 'img/button/main-share.png',
        MAIN_SHARE_TAP: 'img/button/main-share-tap.png',
        MAIN_HELP: 'img/button/main-help.png',
        MAIN_HELP_TAP: 'img/button/main-help-tap.png',
        MAIN_ALBUM_WAITING_BG: 'main-album-waiting-bg.png',

        GAME_CUT_DOWN: 'img/button/game-cutdown.png',
        GAME_CUT_DOWN_TAP: 'img/button/game-cutdown-tap.png',
        GAME_GET_CHAR: 'img/button/game-getchar.png',
        GAME_GET_CHAR_TAP: 'img/button/game-getchar-tap.png',
        GAME_PROMPT: 'img/button/game-prompt.png',
        GAME_PROMPT_TAP: 'img/button/game-prompt-tap.png',
        GAME_SHARE: 'img/button/game-share.png',
        GAME_SHARE_TAP: 'img/button/game-share-tap.png',

        GAME_ANSWER_BG: 'img/layout/game-answer-bg.png',
        GAME_ANSWER_BG_TAP: 'img/layout/game-answer-bg-tap.png',
        GAME_CHAR_BG: 'img/layout/game-char-bg.png',
        GAME_CHAR_BG_TAP: 'img/layout/game-char-bg-tap.png'
    },

    Index: {
        $NAME_INPUT: '#index-name-input',
        $START: '#index-start-btn'
    },

    Main: {
        $ALBUM_CONTAINER: '#main-album-container',
        $ALBUM: '#main-album',
        $ALBUM_HEADER: '#main-album-header',
        $ALBUM_LEVEL: '#main-album{0}-level{1}',
        $ALBUM_LEVEL_LOCK: '#main-album{0}-level{1}-lock',
        $ALBUM_LEVEL_STATUS: '#main-album{0}-level{1}-status',
        $ALBUM_LEVEL_STATUS_TEXT: '#main-album{0}-level{1}-status > .main-level-status',
        $ALBUM_EACH: '#main-album{0}',
        $ALBUM_EACH_LOCKED: '#main-album{0}-locked',
        $ALBUM_NAME: '#main-album-name',

        $SHARE: '#main-share-btn',
        $HELP: '#main-help-btn',

        $POPUP_EXIT: '#main-popup-exit',
        $POPUP_EXIT_YES: '#main-popup-exit-yes',

        $POPUP_LEVEL_UNLOCK: '#main-popup-level-unlock',
        $POPUP_LEVEL_UNLOCK_YES: '#main-popup-level-unlock-btn',
        $POPUP_LEVEL_PURCHASE: '#main-popup-level-purchase',
        $POPUP_LEVEL_PURCHASE_YES: '#main-popup-level-purchase-btn',
        $POPUP_LEVEL_CANNOT_UNLOCK: '#main-popup-level-cannot-unlock',

        $POPUP_ALBUM_UNLOCK: '#main-popup-album-unlock',
        $POPUP_ALBUM_UNLOCK_YES: '#main-popup-album-unlock-btn',
        $POPUP_ALBUM_PURCHASE: '#main-popup-album-purchase',
        $POPUP_ALBUM_PURCHASE_YES: '#main-popup-album-purchase-btn',
        $POPUP_ALBUM_CANNOT_UNLOCK: '#main-popup-album-cannot-unlock'
    },

    Game: {
        $CUT_DOWN: '#game-cutdown-btn',
        $CUT_DOWN_IMG: '#game-cutdown-img',
        $GET_CHAR: '#game-getchar-btn',
        $GET_CHAR_IMG: '#game-getchar-img',
        $PROMPT: '#game-prompt-btn',
        $PROMPT_IMG: '#game-prompt-img',
        $SHARE: '#game-share-btn',
        $SHARE_IMG: '#game-share-img',

        $TITLE_TEXT: '#game-title-text',
        $PICTURE: '#game-picture',
        $PROMPT_DIV: '#game-prompt',
        $CORRECT_ANSWER: '#game-correct-answer',

        $POPUP_ANSWER_CORRECT: '#game-popup-answer-correct',
        $POPUP_NEXT: '#game-popup-next-btn',

        ANSWER_BTN: 'answer-btn-{0}',
        CHAR_BTN: 'char-btn-{0}'
    },

    Exchange: {
        $EXCHANGE: '#exchange-btn-{0}',

        $POPUP_CONFIRM: '#exchange-popup-confirm',
        $POPUP_CONFIRM_YES: '#exchange-popup-confirm-yes',
        $POPUP_SUCCESS: '#exchange-popup-success'
    },

    Purchase: {
        $PURCHASE: '#purchase-btn-{0}',
        $POPUP_SUCCESS: '#purchase-popup-success'
    }
};