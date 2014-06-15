CQ.Page.Game = {
    name: 'game',
    album: null,
    level: null,
    picture: null,
    options: new Array(32),
    answers: new Array(10),
    answersData: null,

    init: function() {
        console.info('Initial game page');
        this.initCommon({ header: true });

        this.bindCharEvents();
        this.bindAnswerEvents();

        // bind all button events
        this.bindTapButton(CQ.Id.Game.$CUT_DOWN, this.cutdown, CQ.Id.Image.GAME_CUT_DOWN_TAP, CQ.Id.Image.GAME_CUT_DOWN, CQ.Id.Game.$CUT_DOWN_IMG);
        this.bindTapButton(CQ.Id.Game.$GET_CHAR, this.getchar, CQ.Id.Image.GAME_GET_CHAR_TAP, CQ.Id.Image.GAME_GET_CHAR, CQ.Id.Game.$GET_CHAR_IMG);
        this.bindTapButton(CQ.Id.Game.$PROMPT, this.prompt, CQ.Id.Image.GAME_PROMPT_TAP, CQ.Id.Image.GAME_PROMPT, CQ.Id.Game.$PROMPT_IMG);

        // bind share buttons
        this.bindTouchImage($(CQ.Id.Game.$SHARE), CQ.Id.Image.GAME_SHARE_TAP, CQ.Id.Image.GAME_SHARE, CQ.Id.Game.$SHARE_IMG);
        $(CQ.Id.$SHARE_FB.format(this.name)).tap(this.clickShareFacebook);
        $(CQ.Id.$SHARE_TW.format(this.name)).tap(this.clickShareTwitter);
        $(CQ.Id.$SHARE_LINE.format(this.name)).tap(this.clickShareLine);
        $(CQ.Id.$SHARE_OTHER.format(this.name)).tap(this.clickShareOther);

        // play next picture click event
        $(CQ.Id.Game.$POPUP_NEXT).tap(CQ.Page.Game.clickNext);
    },

    load: function(params) {
        this.refreshCurrency();

        if (params) {
            this.params = params;
            this.album = CQ.Album.getAlbum(params.album);
            this.level = params.level;
        }

        var lastPictureId = CQ.Datastore.getLastPictureId(this.album.id, this.level);
        console.info('Album: {0}, level: {1}, last picture: {2}'.format(this.album.id, this.level, lastPictureId));
        this.picture = lastPictureId ? this.album.getNextPicture(lastPictureId) : this.album.getFirstPicture(this.level);

        if (!this.picture) {
            // user already finished all pictures in this level
            return {
                redirect: CQ.Page.LevelPass
            };
        }

        var levelAndIndex = this.album.getPictureLevelAndIndex(this.picture.id);
        $(CQ.Id.Game.$TITLE_TEXT).text('第{0}問'.format(levelAndIndex.index + 1));
        $(CQ.Id.Game.$PICTURE).css('background', 'url(../www/{0}) no-repeat'.format(this.album.getPicturePath(this.picture.id)));
        $(CQ.Id.Game.$PROMPT_DIV).hide();

        // TODO test only, remove before release
        $(CQ.Id.Game.$CORRECT_ANSWER).text(this.picture.name);

        // clean and create all answer elements
        for (i = 0; i < this.answers.length; i++) {
            var id = CQ.Id.Game.ANSWER_BTN.format(i), $id = $('#' + id).text('').css('color', 'white');

            if (i < this.picture.name.length) {
                var answer = {
                    id: id,
                    text: null,
                    charBtn: null,
                    clickable: true
                };

                $id.show();
                this.answers[i] = answer;
            } else {
                $id.hide();
            }
        }

        // initial all picture name random chars
        this.answersData = this.album.getAlternativeAnswerChars(this.picture.id, this.options.length);
        var chars = this.answersData.chars;

        for (var i = 0; i < chars.length; i++) {
            var character = {
                id: CQ.Id.Game.CHAR_BTN.format(i),
                text: chars[i]
            };

            $('#' + character.id).text(character.text);
            this.options[i] = character;
        }

        CQ.GA.track(CQ.GA.Picture.Play, CQ.GA.Picture.Play.label.format(this.album.id, this.picture.id));

        return {
            gaPageName: CQ.GA.Page.Picture.format(this.album.id, this.picture.id)
        };
    },

    bindCharEvents: function() {
        this.bindTouchBackground($('[id^=char-btn-]').tap(function() {
            var $btn = $(this);

            if ($btn.text()) {
                for (var i = 0; i < CQ.Page.Game.answers.length; i++) {
                    var answer = CQ.Page.Game.answers[i];

                    if (answer && !answer.text) {
                        answer.text = $btn.text();
                        answer.charBtn = $btn.attr('id');
                        $('#' + answer.id).text(answer.text);
                        CQ.Page.Game.removeCharText($btn.attr('id'));

                        break;
                    }
                }

                CQ.Page.Game.checkAnswer();
            }
        }), CQ.Id.Image.GAME_CHAR_BG_TAP, CQ.Id.Image.GAME_CHAR_BG);
    },

    bindAnswerEvents: function() {
        this.bindTouchBackground($('[id^=answer-btn-]').tap(function() {
            var $btn = $(this), id = $btn.attr('id'), index = id.charAt(id.length - 1), answer = CQ.Page.Game.answers[index];

            if (answer && answer.text && answer.clickable) {
                $('#' + answer.charBtn).text(answer.text);
                CQ.Page.Game.removeCharText(id);
                answer.text = null;
                answer.charBtn = null;
            }
        }), CQ.Id.Image.GAME_ANSWER_BG_TAP, CQ.Id.Image.GAME_ANSWER_BG);
    },

    cutdown: function() {
        if (CQ.Currency.checkCoin(CQ.Currency.Consume.CutDown)) {
            console.info('Start cutdown one answer transaction.');
            var page = CQ.Page.Game, usedPictures = page.answersData.alternativeAnswers;

            for (var i = 0; i < usedPictures.length; i++) {
                if (usedPictures[i] && (usedPictures[i] != page.picture.id)) {
                    var removePicture = page.album.getPicture(usedPictures[i]), name = removePicture.name.split('');
                    console.log('Remove picture: ' + removePicture.id + ', name: ' + removePicture.name);

                    for (var j = 0; j < name.length; j++) {
                        page.removeChar(name[j]);
                    }

                    usedPictures[i] = null;
                    CQ.Currency.consume(CQ.Currency.Consume.CutDown, page.album.id, page.level, page.picture.id);
                    page.refreshCurrency();
                    break;
                }
            }

            CQ.GA.track(CQ.GA.Props.Cutdown, CQ.GA.Props.Cutdown.label.format(page.album.id, page.picture.id));
        } else {
            CQ.Page.Game.showCoinNotEnough();
        }
    },

    getchar: function() {
        if (CQ.Currency.checkCoin(CQ.Currency.Consume.GetChar)) {
            console.info('Start get one character transaction.');
            var page = CQ.Page.Game, name = page.picture.name.split('');

            for (var i = 0; i < name.length; i++) {
                var answer = page.answers[i];

                if (name[i] != answer.text) {
                    if (answer.charBtn) {
                        $('#' + answer.charBtn).text(answer.text);
                    }

                    page.removeChar(name[i]);
                    $('#' + answer.id).text(name[i]).css('color', 'red');
                    answer.text = name[i];
                    answer.charBtn = null;
                    answer.clickable = false;

                    CQ.Currency.consume(CQ.Currency.Consume.GetChar, page.album.id, page.level, page.picture.id);
                    page.refreshCurrency();
                    break;
                }
            }

            CQ.GA.track(CQ.GA.Props.Getchar, CQ.GA.Props.Getchar.label.format(page.album.id, page.picture.id));
            page.checkAnswer();
        } else {
            CQ.Page.Game.showCoinNotEnough();
        }
    },

    prompt: function() {
        var $prompt = $(CQ.Id.Game.$PROMPT_DIV), page = CQ.Page.Game;

        if ($prompt.is(":hidden")) {
            if (CQ.Currency.checkCoin(CQ.Currency.Consume.Prompt)) {
                console.info('Start get prompt transaction.');

                $prompt.text(page.picture.category.name);
                $prompt.show();
                CQ.Currency.consume(CQ.Currency.Consume.Prompt, page.album.id, page.level, page.picture.id);
                page.refreshCurrency();

                CQ.GA.track(CQ.GA.Props.Prompt, CQ.GA.Props.Prompt.label.format(page.album.id, page.picture.id));
            } else {
                page.showCoinNotEnough();
            }
        }
    },

    checkAnswer: function() {
        var name = this.picture.name;
        var isCorrect = true;

        for (var i = 0; i < name.length; i++) {
            var answer = this.answers[i];

            if (!answer.text) {
                return;
            } else if (answer.text != name.charAt(i)) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) this.answerCorrect();
    },

    answerCorrect: function() {
        CQ.Datastore.setLastPictureId(this.album.id, this.level, this.picture.id);
        if (this.album.getNextPicture(this.picture.id)) this.passPicture();
        else if (this.level == CQ.Album.levels) this.passAlbum();
        else this.passLevel();
    },

    clickNext: function() {
        var game = CQ.Page.Game, nextPicture = game.album.getNextPicture(game.picture.id);

        if (nextPicture) {
            console.info('Play next picture: ' + nextPicture.id);

            game.picture = nextPicture;
            game.load();
            $(CQ.Id.Game.$POPUP_ANSWER_CORRECT).popup('close');
            CQ.GA.trackPage(CQ.GA.Page.Picture.format(game.album.id, game.picture.id));

            // TODO debug only, remove it before release
            $(CQ.Id.Game.$CORRECT_ANSWER).text(game.picture.name);
        } else {

        }
    },

    removeChar: function(char) {
        console.info('Remove character: ' + char);

        // remove char from random char fields
        for (var i = 0; i < this.options.length; i++) {
            if (char == this.options[i].text) {
                this.removeCharText(this.options[i].id);
                this.options[i].text = null;
                return;
            }
        }

        // remove char from char answer fields
        for (var n = this.answers.length - 1; n >= 0; n--) {
            var answer = this.answers[n];

            if (answer && (char == answer.text)) {
                this.removeCharText(answer.id);
                answer.text = null;
                answer.charBtn = null;
                return;
            }
        }

        console.warn('Remove character not found: ' + char);
    },

    removeCharText: function(id) {
        $('#' + id).text('');
    },

    passPicture: function() {
        CQ.Currency.earn(CQ.Currency.Earn.Quiz);
        $(CQ.Id.Game.$POPUP_ANSWER_CORRECT).popup('open');
        CQ.GA.track(CQ.GA.Picture.Pass, CQ.GA.Picture.Pass.label.format(this.album.id, this.picture.id));
    },

    passLevel: function() {
        CQ.Currency.earn(CQ.Currency.Earn.Level);
        CQ.Album.unlockLevel(this.album.id, this.level + 1);
        CQ.Page.open(CQ.Page.LevelPass);
        CQ.GA.track(CQ.GA.Level.Pass, CQ.GA.Level.Pass.label.format(this.album.id, this.level));
    },

    passAlbum: function() {
        CQ.Currency.earn(CQ.Currency.Earn.Album);
        CQ.Album.unlockAlbum(this.album.id + 1);
        CQ.Page.open(CQ.Page.AlbumPass);
        CQ.GA.track(CQ.GA.Album.Pass, CQ.GA.Level.Album.Pass.format(this.album.id));
    },

    clickShareFacebook: function() {
        CQ.SNS.Facebook.share(CQ.SNS.Message.MAIN_PAGE, null);
        CQ.GA.track(CQ.GA.Share.FB, CQ.GA.Share.FB.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
    },

    clickShareTwitter: function() {
        CQ.SNS.Twitter.share(CQ.SNS.Message.MAIN_PAGE);
        CQ.GA.track(CQ.GA.Share.TW, CQ.GA.Share.TW.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
    },

    clickShareLine: function() {
        CQ.SNS.Line.share(CQ.SNS.Message.MAIN_PAGE, 'this is subject');
        CQ.GA.track(CQ.GA.Share.Line, CQ.GA.Share.Line.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
    },

    clickShareOther: function() {
        CQ.SNS.share(CQ.SNS.Message.MAIN_PAGE);
        CQ.GA.track(CQ.GA.Share.Other, CQ.GA.Share.Other.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
    }
};

CQ.App.inherits(CQ.Page.Game, CQ.Page);
CQ.App.register(CQ.Page.Game);