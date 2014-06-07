CQ.Page.Game = {
    name: 'game',
    album: null,
    level: null,
    picture: null,
    options: new Array(30),
    answers: new Array(10),
    answersData: null,

    init: function() {
        console.info('Initial game page');
        this.initCommon();

        // bind all button events
        $(CQ.Id.Game.$CUT_DOWN).tap(this.removeOneIncorrectAnswer);
        $(CQ.Id.Game.$GET_CHAR).tap(this.getOneCorrectChar);
        $(CQ.Id.Game.$PROMPT).tap(this.getPrompt);

        this.bindCharEvents();
        this.bindAnswerEvents();

        // bind share buttons
        $(CQ.Id.$SHARE_FB.format(this.name)).click(function() {
            CQ.SNS.Facebook.share(CQ.SNS.Message.MAIN_PAGE, null);
        });

        $(CQ.Id.$SHARE_TW.format(this.name)).click(function() {
            CQ.SNS.Twitter.share(CQ.SNS.Message.MAIN_PAGE);
        });

        $(CQ.Id.$SHARE_LINE.format(this.name)).click(function() {
            CQ.SNS.Line.share(CQ.SNS.Message.MAIN_PAGE, 'this is subject');
        });

        $(CQ.Id.$SHARE_OTHER.format(this.name)).click(function() {
            CQ.SNS.share(CQ.SNS.Message.MAIN_PAGE);
        });

        // play next picture click event
        $(CQ.Id.Game.$POPUP_NEXT).click(function() {
            var game = CQ.Page.Game, nextPicture = game.album.getNextPicture(game.picture.id);

            if (nextPicture) {
                console.info('Play next picture: ' + nextPicture.id);
                game.picture = nextPicture;

                // TODO debug only, remove it before release
                $(CQ.Id.Game.$CORRECT_ANSWER).text(game.picture.name);

                game.load();
                $(CQ.Id.Game.$POPUP_ANSWER_CORRECT).popup('close');
            } else {
                alert('You already finished all quiz.');
            }
        });
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

        if (this.picture == null) {
            // user already finished all pictures in this level.
            alert('Already finished this level.');
            this.open(CQ.Page.Main);
        }

        var levelAndIndex = this.album.getPictureLevelAndIndex(this.picture.id);
        $(CQ.Id.Game.$TITLE_TEXT).text('第{0}問'.format(levelAndIndex.index + 1));
        $(CQ.Id.Game.$PICTURE).css('background', 'url(../www/{0}) no-repeat'.format(this.album.getPicturePath(this.picture.id)));
        $(CQ.Id.Game.$PROMPT_DIV).hide();

        // TODO debug only, remove it before release
        $(CQ.Id.Game.$CORRECT_ANSWER).text(this.picture.name);

        // clean and create all answer elements
        for (i = 0; i < this.answers.length; i++) {
            var id = CQ.Id.Game.ANSWER_BTN.format(i), $id = $('#' + id).text('').css('color', 'black');

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
    },

    bindCharEvents: function() {
        $('[id^=char-btn-]').tap(function() {
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
        });
    },

    bindAnswerEvents: function() {
        $('[id^=answer-btn-]').tap(function() {
            var $btn = $(this), id = $btn.attr('id'), index = id.charAt(id.length - 1), answer = CQ.Page.Game.answers[index];

            if (answer && answer.text && answer.clickable) {
                $('#' + answer.charBtn).text(answer.text);
                CQ.Page.Game.removeCharText(id);
                answer.text = null;
                answer.charBtn = null;
            }
        });
    },

    removeOneIncorrectAnswer: function() {
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
                    CQ.Currency.consume(CQ.Currency.Consume.CutDown, page.album.id, page.picture.id);
                    page.refreshCurrency();
                    break;
                }
            }
        } else {
            CQ.Page.Game.showCoinNotEnough();
        }
    },

    getOneCorrectChar: function() {
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

                    CQ.Currency.consume(CQ.Currency.Consume.GetChar, page.album.id, page.picture.id);
                    page.refreshCurrency();
                    break;
                }
            }

            page.checkAnswer();
        } else {
            CQ.Page.Game.showCoinNotEnough();
        }
    },

    getPrompt: function() {
        var $prompt = $(CQ.Id.Game.$PROMPT_DIV), page = CQ.Page.Game;

        if ($prompt.is(":hidden")) {
            if (CQ.Currency.checkCoin(CQ.Currency.Consume.Prompt)) {
                console.info('Start get prompt transaction.');

                $prompt.text(page.picture.category.name);
                $prompt.show();
                CQ.Currency.consume(CQ.Currency.Consume.Prompt, page.album.id, page.picture.id);
                page.refreshCurrency();
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
        CQ.Currency.earn(CQ.Currency.Earn.Quiz);
        $(CQ.Id.Game.$POPUP_ANSWER_CORRECT).popup('open');
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
    }
};

CQ.App.inherits(CQ.Page.Game, CQ.Page);
CQ.App.register(CQ.Page.Game);