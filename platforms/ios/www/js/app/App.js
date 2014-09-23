if (typeof(CQ) == 'undefined' || !CQ) {
    var CQ = {
        dev: true,
        ad: true,
        purchase: true,

        URL: {
            APP_STORE: 'http://itunes.apple.com/jp/app/id889870872',
            PLAY_STORE: 'http://play.google.com/store/apps/details?id=com.clay.crazyquiz',
            FACEBOOK: 'http://www.facebook.com/nekyou.quiz',
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

    device: {
        iPhone: /iPhone/i.test(navigator.userAgent),
        iPad: /iPad/i.test(navigator.userAgent),
        android: /Android/i.test(navigator.userAgent)
    },

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

        CQ.Datastore.User.addStartTimes();
        CQ.audio = CQ.Datastore.User.isAudioEnabled();

        // modify jQuery default settings
        $.mobile.defaultPageTransition = 'none';
        $.mobile.defaultDialogTransition = 'none';
        $.mobile.buttonMarkup.hoverDelay = 0;

        // add listeners and plugins
        if (CQ.App.android()) FastClick.attach(document.body);
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
        return CQ.App.device.iPhone || CQ.App.device.iPad;
    },

    iPhone: function() {
        return CQ.App.device.iPhone;
    },

    iPad: function() {
        return CQ.App.device.iPad;
    },

    android: function() {
        return CQ.App.device.android;
    }
};

CQ.Session = {
    CURRENT_PAGE: 'loading',
    CURRENT_OPEN_POPUP: null,

    USERNAME: ''
};