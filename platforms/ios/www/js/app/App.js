if (typeof(CQ) == 'undefined' || !CQ) {
    var CQ = {
        device: 'iOS',
        dev: true,
        audio: true,

        URL: {
            APP_STORE: 'https://play.google.com/store/apps/details?id=com.clay.crazyquiz',
            PLAY_STORE: 'https://play.google.com/store/apps/details?id=com.clay.crazyquiz',
            FACEBOOK: 'https://www.facebook.com/nekyou.quiz',
            TWITTER: 'http://twitter.com/nekyou_quiz',

            Web: {
                INDEX: 'http://crazy-quiz.appspot.com',
                ALBUM_IMAGE: 'http://crazy-quiz.appspot.com/static/'
            }
        }
    };
}

CQ.App = {
    inheritsClasses: [],
    registerClasses: [],
    registerPages: [],

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

        if (parent === CQ.Page) {
            this.registerPages.push(child);
        }
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