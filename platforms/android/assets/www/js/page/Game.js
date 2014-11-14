CQ.Page.Game = {
    name: 'game',
    album: null,
    level: null,
    picture: null,
    options: new Array(32),
    answers: new Array(8),
    answersData: null,

    init: function() {
        CQ.Log.debug('Initial game page');

        this.initCommon({ header: true, back: true, share: true });
        this.initPopups();
        this.bindCharEvents();
        this.bindAnswerEvents();

        // bind all button events
        this.bindClickButton(CQ.Id.Game.$CUT_DOWN, this.clickCutdown, CQ.Id.Image.GAME_CUT_DOWN_TAP, CQ.Id.Image.GAME_CUT_DOWN, CQ.Id.Game.$CUT_DOWN_IMG);
        this.bindClickButton(CQ.Id.Game.$GET_CHAR, this.clickGetchar, CQ.Id.Image.GAME_GET_CHAR_TAP, CQ.Id.Image.GAME_GET_CHAR, CQ.Id.Game.$GET_CHAR_IMG);
        this.bindClickButton(CQ.Id.Game.$PROMPT, this.clickPrompt, CQ.Id.Image.GAME_PROMPT_TAP, CQ.Id.Image.GAME_PROMPT, CQ.Id.Game.$PROMPT_IMG);
        this.bindTouchImage($(CQ.Id.Game.$SHARE), CQ.Id.Image.GAME_SHARE_TAP, CQ.Id.Image.GAME_SHARE, CQ.Id.Game.$SHARE_IMG);
    },

    load: function(params) {
        this.refreshCurrency();

        if (params) {
            this.params = params;
            this.album = CQ.Album.getAlbum(params.album);
            this.level = params.level;
        }

        var lastPictureId = CQ.Datastore.Picture.getLastPictureId(this.album.id, this.level);
        CQ.Log.debug('Album: {0}, level: {1}, last picture: {2}'.format(this.album.id, this.level, lastPictureId));
        this.picture = lastPictureId ? this.album.getNextPicture(lastPictureId) : this.album.getFirstPicture(this.level);

        if (!this.picture) {
            // user already finished all pictures in this level, back to the first picture
            this.picture = this.album.getFirstPicture(this.level);
        }

        var levelAndIndex = this.album.getPictureLevelAndIndex(this.picture.id);

        $(CQ.Id.Game.$TITLE)
            .css('background', 'url(../www/img/layout/game-picture-id-bg-{0}.png) no-repeat'.format(levelAndIndex.index + 1))
            .css('background-size', '100%');
        $(CQ.Id.Game.$PICTURE).css('background', 'url(../www/{0}) no-repeat'.format(this.album.getPicturePath(this.picture.id)))
            .css('background-size', '100%');
        $(CQ.Id.Game.$PROMPT_DIV).hide();

        if (CQ.dev) {
            $(CQ.Id.Game.$CORRECT_ANSWER).text(this.picture.name);
        }

        // clean and create all answer elements
        for (var i = 0; i < this.answers.length; i++) {
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

        for (var i = 0; i < 32; i++) {
            var character = {
                id: CQ.Id.Game.CHAR_BTN.format(i),
                text: chars[i] || '',
                clickable: true
            };

            $('#' + character.id).text(character.text);
            this.options[i] = character;
        }

        CQ.GA.track(CQ.GA.Picture.Play, CQ.GA.Picture.Play.label.format(this.album.id, this.picture.id));

        return {
            gaPageName: CQ.GA.Page.Picture.format(this.album.id, this.picture.id)
        };
    },

    initPopups: function() {
        $(CQ.Id.Game.$POPUP_PASS).bind(this.popupEvents);

        var $nextBtn = $(CQ.Id.Game.$POPUP_NEXT);
        this.bindTouchImage($nextBtn, CQ.Id.Image.BTN_NEXT_TAP, CQ.Id.Image.BTN_NEXT);
        $nextBtn.click(function() {
            CQ.Audio.Button.play();
            CQ.Page.Game.clickNext();
        });

        var $shareBtn = $(CQ.Id.Game.$POPUP_SHARE);
        this.bindTouchImage($shareBtn, CQ.Id.Image.BTN_SHARE_TAP, CQ.Id.Image.BTN_SHARE);
        $shareBtn.click(function() {
            CQ.Audio.Button.play();
            CQ.Page.openPopup(CQ.Page.Game.share);
            CQ.GA.track(CQ.GA.Share.Click, CQ.Utils.getCapitalName(CQ.Page.Game.name));
        });

        $(CQ.Id.Game.$POPUP_CUTDOWN_CONFIRM).bind(this.popupEvents);
        this.bindPopupCloseButton(CQ.Id.Game.$POPUP_CUTDOWN_CONFIRM);
        this.bindPopupYesButton(CQ.Id.Game.$POPUP_CUTDOWN_CONFIRM, this.cutdown);
        this.bindPopupNoButton(CQ.Id.Game.$POPUP_CUTDOWN_CONFIRM);

        $(CQ.Id.Game.$POPUP_GETCHAR_CONFIRM).bind(this.popupEvents);
        this.bindPopupCloseButton(CQ.Id.Game.$POPUP_GETCHAR_CONFIRM);
        this.bindPopupYesButton(CQ.Id.Game.$POPUP_GETCHAR_CONFIRM, this.getchar);
        this.bindPopupNoButton(CQ.Id.Game.$POPUP_GETCHAR_CONFIRM);

        $(CQ.Id.Game.$POPUP_PROMPT_CONFIRM).bind(this.popupEvents);
        this.bindPopupCloseButton(CQ.Id.Game.$POPUP_PROMPT_CONFIRM);
        this.bindPopupYesButton(CQ.Id.Game.$POPUP_PROMPT_CONFIRM, this.showPrompt);
        this.bindPopupNoButton(CQ.Id.Game.$POPUP_PROMPT_CONFIRM);

        // user can open share popup on picture pass popup
        // once user close this popup, should display next picture directly
        $(this.share.popup.getId()).bind({
            popupafterclose: function() {
                if (CQ.Page.Game.isAnswerCorrect()) {
                    CQ.Page.Game.clickNext();
                }
            }
        });
    },

    bindCharEvents: function() {
        this.bindTouchBackground($('[id^=char-btn-]').click(function() {
            CQ.Audio.GameChar.play();
            var $btn = $(this), id = $btn.attr('id'), index = parseInt(id.substring(id.lastIndexOf('-') + 1, id.length));

            if ($btn.text() && CQ.Page.Game.options[index].clickable) {
                for (var i = 0; i < CQ.Page.Game.answers.length; i++) {
                    var answer = CQ.Page.Game.answers[i];

                    if (answer && !answer.text) {
                        answer.text = $btn.text();
                        answer.charBtn = id;
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
        this.bindTouchBackground($('[id^=answer-btn-]').click(function() {
            CQ.Audio.GameChar.play();
            var $btn = $(this), id = $btn.attr('id'), index = id.charAt(id.length - 1), answer = CQ.Page.Game.answers[index];

            if (answer && answer.text && answer.clickable) {
                $('#' + answer.charBtn).text(answer.text);
                CQ.Page.Game.removeCharText(id);
                answer.text = null;
                answer.charBtn = null;
            }
        }), CQ.Id.Image.GAME_ANSWER_BG_TAP, CQ.Id.Image.GAME_ANSWER_BG);
    },

    clickCutdown: function() {
        CQ.Audio.Button.play();

        if (CQ.Currency.checkCoin(CQ.Currency.Consume.CutDown)) {
            $(CQ.Id.Game.$POPUP_CUTDOWN_CONFIRM).popup('open');
        } else {
            CQ.Page.Game.openCoinNotEnough();
        }
    },

    cutdown: function() {
        CQ.Log.debug('Start cutdown one answer transaction.');
        CQ.Audio.Button.play();
        var page = CQ.Page.Game,
            usedPictures = page.answersData.alternativeAnswers,
            usedTexts = page.answersData.alternativeTexts;

        if (usedTexts.length > 0) {
            for (var k = 0; k < usedTexts.length; k++) {
                if (usedTexts[k]) {
                    var name = usedTexts[k].split('');
                    CQ.Log.debug('Remove text: {0}'.format(usedTexts[k]));

                    for (var l = 0; l < name.length; l++) {
                        page.removeChar(name[l]);
                    }

                    usedTexts[k] = null;
                    CQ.Currency.consume(CQ.Currency.Consume.CutDown, page.album.id, page.level, page.picture.id);
                    page.refreshCurrency();
                    break;
                }
            }
        } else {
            for (var i = 0; i < usedPictures.length; i++) {
                if (usedPictures[i] && (usedPictures[i] != page.picture.id)) {
                    var removePicture = page.album.getPicture(usedPictures[i]), name = removePicture.name.split('');
                    CQ.Log.debug('Remove picture: ' + removePicture.id + ', name: ' + removePicture.name);

                    for (var j = 0; j < name.length; j++) {
                        page.removeChar(name[j]);
                    }

                    usedPictures[i] = null;
                    CQ.Currency.consume(CQ.Currency.Consume.CutDown, page.album.id, page.level, page.picture.id);
                    page.refreshCurrency();
                    break;
                }
            }
        }

        page.closePopup();
        CQ.GA.track(CQ.GA.Props.Cutdown, CQ.GA.Props.Cutdown.label.format(page.album.id, page.picture.id));
    },

    clickGetchar: function() {
        CQ.Audio.Button.play();

        if (CQ.Currency.checkCoin(CQ.Currency.Consume.GetChar)) {
            $(CQ.Id.Game.$POPUP_GETCHAR_CONFIRM).popup('open');
        } else {
            CQ.Page.Game.openCoinNotEnough();
        }
    },

    getchar: function() {
        CQ.Log.debug('Start get one character transaction.');
        CQ.Audio.Button.play();
        var page = CQ.Page.Game, name = page.picture.name.split('');
        page.closePopup();

        setTimeout(function() {
            for (var i = 0; i < name.length; i++) {
                var answer = page.answers[i];

                if (name[i] != answer.text) {
                    if (answer.charBtn) {
                        $('#' + answer.charBtn).text(answer.text);
                    }

                    page.removeChar(name[i]);
                    $('#' + answer.id).text(name[i]).css('color', 'green');
                    answer.text = name[i];
                    answer.charBtn = null;
                    answer.clickable = false;

                    CQ.Currency.consume(CQ.Currency.Consume.GetChar, page.album.id, page.level, page.picture.id);
                    page.refreshCurrency();
                    break;
                }
            }

            page.checkAnswer();
            CQ.GA.track(CQ.GA.Props.Getchar, CQ.GA.Props.Getchar.label.format(page.album.id, page.picture.id));
        }, 100);
    },

    clickPrompt: function() {
        CQ.Audio.Button.play();

        if ($(CQ.Id.Game.$PROMPT_DIV).is(":hidden")) {
            if (CQ.Currency.checkCoin(CQ.Currency.Consume.Prompt)) {
                $(CQ.Id.Game.$POPUP_PROMPT_CONFIRM).popup('open');
            } else {
                CQ.Page.Game.openCoinNotEnough();
            }
        }
    },

    showPrompt: function() {
        CQ.Log.debug('Start get prompt transaction.');
        CQ.Audio.Button.play();
        var page = CQ.Page.Game, $prompt = $(CQ.Id.Game.$PROMPT_DIV);

        $prompt.text(page.picture.category.name);
        $prompt.show();
        CQ.Currency.consume(CQ.Currency.Consume.Prompt, page.album.id, page.level, page.picture.id);
        page.refreshCurrency();
        page.closePopup();

        CQ.GA.track(CQ.GA.Props.Prompt, CQ.GA.Props.Prompt.label.format(page.album.id, page.picture.id));
    },

    isAnswerCorrect: function() {
        var name = this.picture.name, isCorrect = true;

        for (var i = 0; i < name.length; i++) {
            var answer = this.answers[i];

            if (!answer.text || (answer.text != name.charAt(i))) {
                isCorrect = false;
                break;
            }
        }

        return isCorrect;
    },

    checkAnswer: function() {
        var name = this.picture.name;
        var isCorrect = true, isFulFilled = false;

        for (var i = 0; i < name.length; i++) {
            var answer = this.answers[i];
            if (!answer.text) break;
            if (answer.text && (answer.text != name.charAt(i))) isCorrect = false;
            if (i == (name.length - 1)) isFulFilled = true;
        }

        if (isFulFilled && isCorrect) this.answerCorrect();
        else if (isFulFilled) this.answerIncorrect();
    },

    answerCorrect: function() {
        CQ.Datastore.Picture.setLastPictureId(this.album.id, this.level, this.picture.id);

        if (this.album.getNextPicture(this.picture.id)) {
            this.passPicture();
        } else {
            CQ.Datastore.Picture.setPictureFinished(this.album.id, this.picture.id);
            if (this.level == this.album.levels.length) this.passAlbum();
            else this.passLevel();
        }
    },

    answerIncorrect: function() {

    },

    passPicture: function() {
        var earned = 0;

        if (!CQ.Datastore.Picture.isPictureFinished(this.album.id, this.picture.id)) {
            earned = CQ.Currency.Earn.Quiz.coin;
            CQ.Currency.earn(CQ.Currency.Earn.Quiz);
            CQ.Datastore.Picture.setPictureFinished(this.album.id, this.picture.id);
            CQ.Page.Main.setLevelStatusText(this.album, this.level);
        }

        this.showPassPopup(earned);
        CQ.GA.track(CQ.GA.Picture.Pass, CQ.GA.Picture.Pass.label.format(this.album.id, this.picture.id));
    },

    passLevel: function() {
        var earned = 0;

        if (!CQ.Datastore.Picture.isLevelFinished(this.album.id, this.level)) {
            earned = CQ.Currency.Earn.Level.coin;
            CQ.Currency.earn(CQ.Currency.Earn.Level);
            CQ.Datastore.Picture.setLevelFinished(this.album.id, this.level);
            CQ.Album.unlockLevel(this.album.id, this.level + 1);
            CQ.Page.Main.setLevelStatusText(this.album, this.level);
        }

        this.showPassPopup(earned);
        CQ.GA.track(CQ.GA.Level.Pass, CQ.GA.Level.Pass.label.format(this.album.id, this.level));
    },

    passAlbum: function() {
        var earned = 0;

        if (!CQ.Datastore.Picture.isAlbumFinished(this.album.id)) {
            earned = CQ.Currency.Earn.Album.coin;
            CQ.Currency.earn(CQ.Currency.Earn.Album);
            CQ.Datastore.Picture.setLevelFinished(this.album.id, this.level);
            CQ.Datastore.Picture.setAlbumFinished(this.album.id);
            CQ.Album.unlockAlbum(this.album.id + 1);
            CQ.Page.Main.setLevelStatusText(this.album, this.level);
        }

        this.showPassPopup(earned);
        CQ.GA.track(CQ.GA.Album.Pass, CQ.GA.Album.Pass.label.format(this.album.id));
    },

    showPassPopup: function(earned) {
        CQ.Audio.GameBackground.pause();
        CQ.Audio.GamePassPicture.play();

        $(CQ.Id.Game.$POPUP_PASS_PICTURE_NUMBER).html(this.album.getPictureLevelAndIndex(this.picture.id).index + 1);
        $(CQ.Id.Game.$POPUP_PASS_PICTURE_NAME).html(this.picture.name);
        $(CQ.Id.Game.$POPUP_PASS_CURRENCY).html(CQ.Currency.account.coin);

        if (earned != 0) {
            $(CQ.Id.Game.$POPUP_PASS_BONUS).text(' × {0}'.format(earned));
            $(CQ.Id.Game.$POPUP_PASS_INFO).find('div').show();
        } else {
            $(CQ.Id.Game.$POPUP_PASS_INFO).find('div').hide();
        }

        $(CQ.Id.Game.$POPUP_PASS).popup('open');
    },

    clickNext: function() {
        var game = CQ.Page.Game, nextPicture = game.album.getNextPicture(game.picture.id);

        if (nextPicture) {
            CQ.Log.debug('Play next picture: ' + nextPicture.id);
            game.picture = nextPicture;
            game.load();
            $(CQ.Id.Game.$POPUP_PASS).popup('close');
            CQ.GA.trackPage(CQ.GA.Page.Picture.format(game.album.id, game.picture.id));

            if (CQ.dev) $(CQ.Id.Game.$CORRECT_ANSWER).text(game.picture.name);
        } else {
            CQ.Page.Game.open(CQ.Page.Main);
            CQ.Ad.showInterstitial();
        }

        CQ.Audio.GamePassPicture.stop();
        CQ.Audio.GameBackground.play();
    },

    removeChar: function(char) {
        CQ.Log.debug('Remove character: ' + char);

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

        CQ.Log.error('Remove character not found: ' + char);
    },

    removeCharText: function(id) {
        $('#' + id).text('');
    },

    isLevelFinished: function() {
        return this.picture.id == CQ.Datastore.Picture.getLastPictureId(this.album.id, this.level);
    }
};

CQ.App.inherits(CQ.Page.Game, CQ.Page);
CQ.App.register(CQ.Page.Game);