CQ.Page.Main = {
    name: 'main',
    albumId: 1,
    ratePopupDisplayed: false,
    selectedUnlockAlbum: {},
    selectedUnlockLevel: {},
    dailyBonus: {},
    dailyBonusGot: {},

    welcomeText: [
        'お帰りなさい!',
        'この調子この調子',
        'いつやるの？今でしょ!',
        '久しぶり!',
        'この問題が解けるかな'
    ],

    init: function() {
        CQ.Log.debug('Initial main page');

        this.initCommon({
            header: true,
            back: false,
            audio: true,
            share: true
        });

        this.initPopups();
        this.initButtons();

        // initial all albums and levels
        var lastAlbumId = CQ.Datastore.Picture.getLastAlbumId();

        for (var albumId = 1; albumId <= CQ.Album.TOTAL_ALBUM; albumId++) {
            var album = CQ.Album.getAlbum(albumId), lastLevel = CQ.Datastore.Picture.getLastLevel(album.id);
            CQ.Log.debug('Album {0}, last level {1}'.format(albumId, lastLevel));

            // render and bind events for all levels
            for (var level = 1; level <= album.levels.length; level++) {
                (function(album, level, lastLevel) {
                    var levelPicturePath = album.getPicturePath(album.getFirstPicture(level).id),
                        lastPictureId = CQ.Datastore.Picture.getLastPictureId(album.id, level),
                        lastPictureIndex = lastPictureId ? album.getPictureLevelAndIndex(lastPictureId).index + 1 : 0,
                        $levelButton = $(CQ.Id.Main.$ALBUM_LEVEL.format(album.id, level));

                    $levelButton.css('background', 'url(../www/{0}) no-repeat'.format(levelPicturePath));
                    $levelButton.css('background-size', '100%');
                    $(CQ.Id.Main.$ALBUM_LEVEL_NAME.format(album.id, level)).html(album.getLevel(level).name);

                    if (level <= lastLevel) {
                        $levelButton.click({ albumId: album.id, level: level }, CQ.Page.Main.clickLevel);
                        $(CQ.Id.Main.$ALBUM_LEVEL_LOCK.format(album.id, level)).hide();
                        CQ.Page.Main.setLevelStatusText(album, level, lastPictureIndex);
                    } else if ((lastAlbumId >= albumId) && (level == (lastLevel + 1))) {
                        $levelButton.addClass(CQ.Id.CSS.MAIN_LEVEL_LOCKED).click({
                            albumId: album.id,
                            level: level
                        }, CQ.Page.Main.clickUnlockableLevel);
                    } else {
                        $levelButton.addClass(CQ.Id.CSS.MAIN_LEVEL_LOCKED).click(CQ.Page.Main.clickUnlockDisableLevel);
                    }
                })(album, level, lastLevel);
            }
        }

        $(CQ.Id.Main.$ALBUM_CONTAINER).on('swipeleft', CQ.Page.Main.swipeAlbumLeft).on('swiperight', CQ.Page.Main.swipeAlbumRight);
        $(CQ.Id.Main.$ALBUM_WAITING).on('swiperight', CQ.Page.Main.swipeAlbumRight);

        if (CQ.App.android()) {
            $(CQ.Id.Main.$POPUP_EXIT).bind(this.popupEvents);
            this.bindPopupCloseButton(CQ.Id.Main.$POPUP_EXIT);
            this.bindPopupNoButton(CQ.Id.Main.$POPUP_EXIT);
            this.bindPopupYesButton(CQ.Id.Main.$POPUP_EXIT, function() {
                navigator.app.exitApp();
            });
        }
    },

    initPopups: function() {
        // level popup and buttons
        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK).bind(this.popupEvents);
        this.bindPopupCloseButton(CQ.Id.Main.$POPUP_LEVEL_UNLOCK);
        this.bindPopupYesButton(CQ.Id.Main.$POPUP_LEVEL_UNLOCK, CQ.Page.Main.clickUnlockLevel);
        this.bindPopupNoButton(CQ.Id.Main.$POPUP_LEVEL_UNLOCK);

        $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE).bind(this.popupEvents);
        this.bindPopupCloseButton(CQ.Id.Main.$POPUP_LEVEL_PURCHASE);
        this.bindPopupYesButton(CQ.Id.Main.$POPUP_LEVEL_PURCHASE, function() {
            CQ.Audio.Button.play();
            CQ.Page.Main.openGemShop();
        });

        $(CQ.Id.Main.$POPUP_LEVEL_CANNOT_UNLOCK).bind(this.popupEvents);
        this.bindPopupCloseButton(CQ.Id.Main.$POPUP_LEVEL_CANNOT_UNLOCK);

        // rate popup
        $(CQ.Id.Main.$POPUP_RATING).bind(this.popupEvents);
        this.bindPopupCloseButton(CQ.Id.Main.$POPUP_RATING);
        this.bindPopupYesButton(CQ.Id.Main.$POPUP_RATING, CQ.Page.Main.clickRating);
        this.bindPopupNoButton(CQ.Id.Main.$POPUP_RATING);

        // open daily bonus popup if required
        this.dailyBonusGot = new CQ.Popup.DailyBonusGot(this.name);
        this.dailyBonus = new CQ.Popup.DailyBonus(this.name, this.dailyBonusGot);

        $('#' + this.name).on('pageshow', function() {
            CQ.Page.Main.dailyBonus.dailyBonus();
        });
    },

    initButtons: function() {
        // previous and next album button
        this.bindClickButton($(CQ.Id.Main.$ALBUM_PREVIOUS), function() {
            CQ.Audio.Button.play();
            CQ.Page.Main.swipeAlbumRight();
        }, CQ.Id.Image.MAIN_ALBUM_PREVIOUS_TAP, CQ.Id.Image.MAIN_ALBUM_PREVIOUS);

        this.bindClickButton($(CQ.Id.Main.$ALBUM_NEXT), function() {
            CQ.Audio.Button.play();
            CQ.Page.Main.swipeAlbumLeft();
        }, CQ.Id.Image.MAIN_ALBUM_NEXT_TAP, CQ.Id.Image.MAIN_ALBUM_NEXT);

        // footer buttons
        $(CQ.Id.Main.$SHARE).bind('touchstart', function() {
            $(this).attr('src', CQ.Id.Image.MAIN_SHARE_TAP);
        }).bind('touchend', function() {
            $(this).attr('src', CQ.Id.Image.MAIN_SHARE);
        });

        $(CQ.Id.Main.$HELP).bind('touchstart', function() {
            $(this).attr('src', CQ.Id.Image.MAIN_HELP_TAP);
        }).bind('touchend', function() {
            $(this).attr('src', CQ.Id.Image.MAIN_HELP);
        });
        $(CQ.Id.Main.$HELP).click(CQ.Page.Main.clickHelp);
    },

    load: function() {
        this.refreshCurrency();

        // initial welcome text
        var randomText = this.welcomeText[Math.floor(Math.random() * this.welcomeText.length)];
        var welcomeText = "{0}さん<br/>{1}".format(CQ.User.getName(), randomText);
        $(CQ.Id.Main.$WELCOME_CONTENT).html(welcomeText);

        if (CQ.Datastore.User.isAudioEnabled()) {
            CQ.Audio.GameBackground.play();
        }
    },

    setLevelStatusText: function(album, level, lastPictureIndex) {
        // do not display status info if level already finished
        if (CQ.Datastore.Picture.isLevelFinished(album.id, level)) {
            $(CQ.Id.Main.$ALBUM_LEVEL_STATUS.format(album.id, level)).hide();
        } else {
            // display finished and total picture info
            if (!lastPictureIndex) {
                var lastPictureId = CQ.Datastore.Picture.getLastPictureId(album.id, level);
                lastPictureIndex = lastPictureId ? album.getPictureLevelAndIndex(lastPictureId).index + 1 : 0;
            }

            var statusText = "{0} / {1}".format(lastPictureIndex, album.getLevel(level).pictures.length);
            $(CQ.Id.Main.$ALBUM_LEVEL_STATUS.format(album.id, level)).show();
            $(CQ.Id.Main.$ALBUM_LEVEL_STATUS_TEXT.format(album.id, level)).html(statusText);
        }
    },

    swipeAlbumLeft: function() {
        var currentAlbumId = CQ.Page.Main.albumId;

        if (currentAlbumId <= CQ.Album.TOTAL_ALBUM) {
            $(CQ.Id.Main.$ALBUM_EACH.format(currentAlbumId)).hide();
            var nextAlbumId = ++CQ.Page.Main.albumId, nextAlbum = CQ.Album.getAlbum(nextAlbumId);

            if (nextAlbum) {
                // display next album
                $(CQ.Id.Main.$ALBUM_EACH.format(nextAlbumId)).show();
                $(CQ.Id.Main.$ALBUM_PAGING.format(nextAlbumId)).attr('src', CQ.Id.Image.MAIN_PAGING_ON);

                for (var i = 1; i < nextAlbumId; i++) {
                    $(CQ.Id.Main.$ALBUM_PAGING.format(i)).attr('src', CQ.Id.Image.MAIN_PAGING_OFF);
                }
            } else {
                // no next album, display waiting image
                $(CQ.Id.Main.$ALBUM_CONTAINER).hide();
                $(CQ.Id.Main.$ALBUM_WAITING).show();
            }
        }
    },

    swipeAlbumRight: function() {
        var currentAlbumId = CQ.Page.Main.albumId;

        if (currentAlbumId > 1) {
            if (CQ.Album.getAlbum(currentAlbumId)) {
                // hide current album and levels
                $(CQ.Id.Main.$ALBUM_EACH.format(currentAlbumId)).hide();
            } else {
                // hide current waiting page
                $(CQ.Id.Main.$ALBUM_WAITING).hide();
                $(CQ.Id.Main.$ALBUM_CONTAINER).show();
            }

            var nextAlbumId = --CQ.Page.Main.albumId;
            $(CQ.Id.Main.$ALBUM_EACH.format(nextAlbumId)).show();
            $(CQ.Id.Main.$ALBUM_PAGING.format(nextAlbumId)).attr('src', CQ.Id.Image.MAIN_PAGING_ON);

            for (var i = currentAlbumId; i <= CQ.Album.TOTAL_ALBUM; i++) {
                $(CQ.Id.Main.$ALBUM_PAGING.format(i)).attr('src', CQ.Id.Image.MAIN_PAGING_OFF);
            }
        }
    },

    enableLevel: function(albumId, level) {
        var album = CQ.Album.getAlbum(albumId);

        // change level style and events
        $(CQ.Id.Main.$ALBUM_LEVEL.format(albumId, level))
            .unbind('click')
            .removeClass(CQ.Id.CSS.MAIN_LEVEL_LOCKED)
            .click({ albumId: albumId, level: level }, CQ.Page.Main.clickLevel);

        $(CQ.Id.Main.$ALBUM_LEVEL_LOCK.format(album.id, level)).hide();
        this.setLevelStatusText(album, level, 0);

        // change next level events
        if (level < album.levels.length) {
            var nextLevel = level + 1;
            $(CQ.Id.Main.$ALBUM_LEVEL.format(albumId, nextLevel))
                .unbind('click')
                .click({ albumId: albumId, level: nextLevel }, CQ.Page.Main.clickUnlockableLevel);
        }
    },

    clickLevel: function(event) {
        CQ.Audio.Button.play();
        var albumId = event.data.albumId, level = event.data.level;
        CQ.Page.open(CQ.Page.Game, { album: albumId, level: level });
        CQ.GA.track(CQ.GA.Level.Play, CQ.GA.Level.Play.label.format(albumId, level));
    },

    clickUnlockableLevel: function(event) {
        CQ.Audio.Button.play();
        var albumId = event.data.albumId, level = event.data.level;

        if (CQ.Currency.account.gem >= CQ.Currency.Consume.UnlockLevel.gem) {
            $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK).popup('open');
            CQ.Page.Main.selectedUnlockLevel = {
                albumId: albumId,
                level: level
            };
        } else {
            $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE).popup('open');
        }
    },

    clickUnlockDisableLevel: function() {
        CQ.Audio.Button.play();
        $(CQ.Id.Main.$POPUP_LEVEL_CANNOT_UNLOCK).popup('open');
    },


    clickUnlockLevel: function() {
        CQ.Audio.Button.play();
        if (CQ.Page.Main.selectedUnlockLevel) {
            $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK).popup('close');
            CQ.Album.unlockLevel(CQ.Page.Main.selectedUnlockLevel.albumId, CQ.Page.Main.selectedUnlockLevel.level, true);
            CQ.Page.Main.selectedUnlockLevel = null;
        }
    },

    enableAlbum: function(albumId) {
        // change next album events
        if (albumId < CQ.Album.TOTAL_ALBUM) {
            var nextAlbum = albumId + 1;
            CQ.Album.unlockLevel(nextAlbum, 1, false);
        }
    },

    clickRating: function() {
        CQ.Audio.Button.play();
        $(CQ.Id.Main.$POPUP_RATING).popup('close');
        CQ.Datastore.User.setRated();

        if (CQ.App.iOS()) {
            CQ.GA.trackPage('App Store');
            window.open('itms-apps://itunes.apple.com/app/id889870872');
        } else if (CQ.App.android()) {
            CQ.GA.trackPage('Play Store');
            window.open("http://play.google.com/store/apps/details?id=com.clay.crazyquiz", "_system");
        }
    },

    clickHelp: function() {
        CQ.Audio.Button.play();
        CQ.Page.open(CQ.Page.Help);
    }
};

CQ.App.inherits(CQ.Page.Main, CQ.Page);
CQ.App.register(CQ.Page.Main);