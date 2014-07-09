CQ.Audio = {
    media: null,

    init: function() {
        if (CQ.audio) {
            this.media = new Media(this.file, this.onSuccess, this.onError);
        }
    },

    play: function() {
        if (this.media) this.media.play();
    },

    pause: function() {
        if (this.media) this.media.pause();
    },

    stop: function() {
        if (this.media) this.media.stop();
    },

    onSuccess: function() {
        // nothing need to do here
    },

    onError: function(error) {
        console.info('Play media failed, code: {0}, message: {1}'.format(error.code, error.message));
    }
};

CQ.Audio.Button = {
    file: 'audio/button.wav'
};

CQ.Audio.GameChar = {
    file: 'audio/game_char.wav'
};

CQ.App.inherits(CQ.Audio.Button, CQ.Audio);
CQ.App.inherits(CQ.Audio.GameChar, CQ.Audio);

CQ.App.register(CQ.Audio.Button);
CQ.App.register(CQ.Audio.GameChar);