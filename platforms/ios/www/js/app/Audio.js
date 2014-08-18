CQ.Audio = {
    media: null,
    playing: false,

    init: function() {
        if (CQ.audio) {
            this.media = new Media(this.file, this.onSuccess, this.onError);
        }
    },

    play: function() {
        if (this.media) {
            if (CQ.App.iOS()) {
                this.media.play({ playAudioWhenScreenIsLocked: false, numberOfLoops: this.loops });
            } else if (CQ.App.android()) {
                // TODO add android audio support
            }

            this.playing = true;
        }
    },

    pause: function() {
        if (this.media) {
            this.media.pause();
            this.playing = false;
        }
    },

    stop: function() {
        if (this.media) {
            this.media.stop();
            this.playing = false;
        }
    },

    onSuccess: function() {
        // nothing need to do here
    },

    onError: function(error) {
        console.info('Play media failed, code: {0}, message: {1}'.format(error.code, error.message));
    }
};

CQ.Audio.Button = {
    file: 'audio/button.wav',
    loops: 1
};

CQ.Audio.GameChar = {
    file: 'audio/game_char.wav',
    loops: 1
};

CQ.Audio.GameBackground = {
    file: 'audio/game_bg.mp3',
    loops: 9999
};

CQ.Audio.GamePassPicture = {
    file: 'audio/game_pass_picture.mp3',
    loops: 1
};

CQ.App.inherits(CQ.Audio.Button, CQ.Audio);
CQ.App.inherits(CQ.Audio.GameChar, CQ.Audio);
CQ.App.inherits(CQ.Audio.GameBackground, CQ.Audio);
CQ.App.inherits(CQ.Audio.GamePassPicture, CQ.Audio);

CQ.App.register(CQ.Audio.Button);
CQ.App.register(CQ.Audio.GameChar);
CQ.App.register(CQ.Audio.GameBackground);
CQ.App.register(CQ.Audio.GamePassPicture);