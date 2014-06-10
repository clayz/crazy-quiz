CQ.Page.Main = {
    name: 'main',
    albumId: 1,
    selectedUnlockAlbum: null,
    selectedUnlockLevel: null,

    init: function() {
        console.info('Initial main page');
        this.initCommon({ header: true });

        // initial all albums and levels
        for (var i = 1; i <= CQ.Album.TOTAL_ALBUM; i++) {
            var album = CQ.Album.getAlbum(i), lastLevel = CQ.Datastore.getLastLevel(album.id);
            console.log('Album {0}, last level {1}'.format(album.id, lastLevel));

            if (i == 1) {
                $(CQ.Id.Main.$ALBUM_NAME).text(album.name);
            }

            for (var j = 1; j <= album.levels; j++) {
                (function(album, level, lastLevel) {
                    var levelPicturePath = album.getPicturePath(album.getFirstPicture(level).id),
                        $levelButton = $(CQ.Id.Main.$ALBUM_LEVEL.format(album.id, level));
                    $levelButton.css('background', 'url(../www/{0}) no-repeat'.format(levelPicturePath));

                    if (level <= lastLevel) {
                        $levelButton.click({ albumId: album.id, level: level }, CQ.Page.Main.clickLevel);
                    } else if (level == (lastLevel + 1)) {
                        $levelButton.addClass(CQ.Id.CSS.MAIN_ALBUM_LEVEL_LOCKED)
                            .click({ albumId: album.id, level: level }, CQ.Page.Main.clickUnlockableLevel);
                    } else {
                        $levelButton.addClass(CQ.Id.CSS.MAIN_ALBUM_LEVEL_LOCKED)
                            .click(CQ.Page.Main.clickUnlockDisableLevel);
                    }
                })(album, j, lastLevel);
            }
        }

        $(CQ.Id.Main.$ALBUM).on('swipeleft', CQ.Page.Main.swipeAlbumLeft).on('swiperight', CQ.Page.Main.swipeAlbumRight);

        // level popup and buttons
        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK_YES).click(CQ.Page.Main.clickUnlockLevel);
        $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE_YES).click(CQ.Page.Main.clickLevelPurchase);
        $(CQ.Id.Main.$POPUP_LEVEL_CANNOT_UNLOCK).bind(this.popupEvents);

        // footer buttons
        $(CQ.Id.Main.$RATING).tap(CQ.Page.Main.clickRating);
        $(CQ.Id.Main.$OTHER).tap(CQ.Page.Main.clickHelp);

        // share buttons
        $(CQ.Id.$SHARE_FB.format(this.name)).tap(this.clickShareFacebook);
        $(CQ.Id.$SHARE_TW.format(this.name)).tap(this.clickShareTwitter);
        $(CQ.Id.$SHARE_LINE.format(this.name)).tap(this.clickShareLine);
        $(CQ.Id.$SHARE_OTHER.format(this.name)).tap(this.clickShareOther);

        // exit and clear history buttons
        $(CQ.Id.Main.$POPUP_EXIT).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_EXIT_YES).tap(function() {
            navigator.app.exitApp();
        });

        // TODO test only, remove before release
        CQ.Datastore.setLastAlbumId(3);

        $(CQ.Id.Main.$CLEAR_HISTORY).tap(function() {
            CQ.Datastore.clear();
            CQ.Page.Game.picture = null;
            CQ.Currency.reset();
            CQ.Currency.init();
            alert('Cleared data in storage.');
        });
    },

    load: function() {
        this.refreshCurrency();
    },

    enableLevel: function(albumId, level) {
        var album = CQ.Album.getAlbum(albumId);

        $(CQ.Id.Main.$ALBUM_LEVEL.format(albumId, level))
            .unbind('click')
            .removeClass(CQ.Id.CSS.MAIN_ALBUM_LEVEL_LOCKED)
            .click({ albumId: albumId, level: level }, CQ.Page.Main.clickLevel);

        if (level < album.levels) {
            var nextLevel = level + 1;
            $(CQ.Id.Main.$ALBUM_LEVEL.format(albumId, nextLevel))
                .unbind('click')
                .click({ albumId: albumId, level: nextLevel }, CQ.Page.Main.clickUnlockableLevel);
        }
    },

    enableAlbum: function(albumId) {
        $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(albumId)).fadeOut('slow');
        $(CQ.Id.Main.$ALBUM_EACH.format(albumId)).fadeIn('slow');
    },

    clickLevel: function(event) {
        var albumId = event.data.albumId, level = event.data.level;
        CQ.Page.open(CQ.Page.Game, { album: albumId, level: level });
        CQ.GA.track(CQ.GA.Level.Play, CQ.GA.Level.Play.label.format(albumId, level));
    },

    clickUnlockableLevel: function(event) {
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
        $(CQ.Id.Main.$POPUP_LEVEL_CANNOT_UNLOCK).popup('open');
    },

    swipeAlbumLeft: function() {
        var currentAlbumId = CQ.Page.Main.albumId,
            nextAlbumId = ++CQ.Page.Main.albumId;

        if (currentAlbumId <= CQ.Album.TOTAL_ALBUM) {
            $(CQ.Id.Main.$ALBUM_EACH.format(currentAlbumId)).hide('slow');
            $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(currentAlbumId)).hide('slow');
            var nextAlbum = CQ.Album.getAlbum(nextAlbumId);

            if (nextAlbum) {
                $(CQ.Id.Main.$ALBUM_NAME).text(nextAlbum.name);

                if (CQ.Album.isAlbumLocked(nextAlbumId)) {
                    $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(nextAlbumId)).show('slow');
                } else {
                    $(CQ.Id.Main.$ALBUM_EACH.format(nextAlbumId)).show('slow');
                }
            } else {
                $(CQ.Id.Main.$ALBUM_NAME).text('');
                $(CQ.Id.Main.$ALBUM_MORE).show('slow');
            }
        }
    },

    swipeAlbumRight: function() {
        var currentAlbumId = CQ.Page.Main.albumId,
            nextAlbumId = --CQ.Page.Main.albumId;

        if (currentAlbumId > 1) {
            if (CQ.Album.getAlbum(currentAlbumId)) {
                $(CQ.Id.Main.$ALBUM_EACH.format(currentAlbumId)).hide('slow');
                $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(currentAlbumId)).hide('slow');
            } else {
                $(CQ.Id.Main.$ALBUM_MORE).hide('slow');
            }

            var nextAlbum = CQ.Album.getAlbum(nextAlbumId);
            $(CQ.Id.Main.$ALBUM_NAME).text(nextAlbum.name);

            if (CQ.Album.isAlbumLocked(nextAlbumId)) {
                $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(nextAlbumId)).show('slow');
            } else {
                $(CQ.Id.Main.$ALBUM_EACH.format(nextAlbumId)).show('slow');
            }
        }
    },

    clickUnlockLevel: function() {
        if (CQ.Page.Main.selectedUnlockLevel) {
            $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK).popup('close');
            CQ.Album.unlockLevel(CQ.Page.Main.selectedUnlockLevel.albumId, CQ.Page.Main.selectedUnlockLevel.level, true);
            CQ.Page.Main.selectedUnlockLevel = null;
        }
    },

    clickLevelPurchase: function() {
        CQ.Page.Main.open(CQ.Page.Purchase);
    },

    clickRating: function() {
        CQ.GA.trackPage('PlayStore');
        window.open('market://details?id=com.cyberagent.jra');
    },

    clickHelp: function() {
        CQ.Page.open(CQ.Page.Help);
    },

    clickShareFacebook: function() {
        CQ.SNS.Facebook.share(CQ.SNS.Message.MAIN_PAGE, null);
        CQ.GA.track(CQ.GA.Share.FB, CQ.Utils.getCapitalName(CQ.Page.Main.name));
    },

    clickShareTwitter: function() {
        CQ.SNS.Twitter.share(CQ.SNS.Message.MAIN_PAGE);
        CQ.GA.track(CQ.GA.Share.TW, CQ.Utils.getCapitalName(CQ.Page.Main.name));
    },

    clickShareLine: function() {
        CQ.SNS.Line.share(CQ.SNS.Message.MAIN_PAGE, 'this is subject');
        CQ.GA.track(CQ.GA.Share.Line, CQ.Utils.getCapitalName(CQ.Page.Main.name));
    },

    clickShareOther: function() {
        CQ.SNS.share(CQ.SNS.Message.MAIN_PAGE);
        CQ.GA.track(CQ.GA.Share.Other, CQ.Utils.getCapitalName(CQ.Page.Main.name));
    }
};

CQ.App.inherits(CQ.Page.Main, CQ.Page);
CQ.App.register(CQ.Page.Main);