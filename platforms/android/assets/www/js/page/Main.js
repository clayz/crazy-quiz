CQ.Page.Main = {
    name: 'main',
    albumId: 1,
    selectedUnlockAlbum: null,
    selectedUnlockLevel: null,

    init: function() {
        console.info('Initial main page');

        if (CQ.App.iOS()) this.initCommon({ header: true, back: false });
        else this.initCommon({ header: true, back: true });

        // initial all albums and levels
        var lastAlbumId = CQ.Datastore.getLastAlbumId();

        for (var albumId = 1; albumId <= CQ.Album.TOTAL_ALBUM; albumId++) {
            var album = CQ.Album.getAlbum(albumId), lastLevel = CQ.Datastore.getLastLevel(album.id);
            console.log('Album {0}, last level {1}'.format(albumId, lastLevel));

            if (albumId == 1) {
                $(CQ.Id.Main.$ALBUM_NAME).text(album.name);
            }

            // render and bind events for all levels
            for (var level = 1; level <= album.levels.length; level++) {
                (function(album, level, lastLevel) {
                    var levelPicturePath = album.getPicturePath(album.getFirstPicture(level).id),
                        lastPictureId = CQ.Datastore.getLastPictureId(album.id, level),
                        lastPictureIndex = lastPictureId ? album.getPictureLevelAndIndex(lastPictureId).index + 1 : 0,
                        $levelButton = $(CQ.Id.Main.$ALBUM_LEVEL.format(album.id, level));

                    $levelButton.css('background', 'url(../www/{0}) no-repeat'.format(levelPicturePath));
                    $levelButton.css('background-size', '100%');

                    if (level <= lastLevel) {
                        $levelButton.click({ albumId: album.id, level: level }, CQ.Page.Main.clickLevel);
                        $(CQ.Id.Main.$ALBUM_LEVEL_LOCK.format(album.id, level)).hide();

                        // display finished and total picture info
                        $(CQ.Id.Main.$ALBUM_LEVEL_STATUS.format(album.id, level)).show();
                        $(CQ.Id.Main.$ALBUM_LEVEL_STATUS_TEXT.format(album.id, level)).html("{0} / 20".format(lastPictureIndex));
                    } else if (level == (lastLevel + 1)) {
                        $levelButton.addClass(CQ.Id.CSS.MAIN_LEVEL_LOCKED).click({ albumId: album.id, level: level }, CQ.Page.Main.clickUnlockableLevel);
                    } else {
                        $levelButton.addClass(CQ.Id.CSS.MAIN_LEVEL_LOCKED).click(CQ.Page.Main.clickUnlockDisableLevel);
                    }
                })(album, level, lastLevel);
            }

            // bind events for locked albums
            if (albumId == (lastAlbumId + 1)) {
                $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(albumId)).click({ albumId: albumId }, CQ.Page.Main.clickUnlockableAlbum);
            } else {
                $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(albumId)).click(CQ.Page.Main.clickUnlockDisableAlbum);
            }
        }

        $(CQ.Id.Main.$ALBUM).on('swipeleft', CQ.Page.Main.swipeAlbumLeft).on('swiperight', CQ.Page.Main.swipeAlbumRight);

        this.initPopups();
        this.initButtons();

        if (CQ.App.android()) {
            // exit and clear history buttons
            $(CQ.Id.Main.$POPUP_EXIT).bind(this.popupEvents);
            $(CQ.Id.Main.$POPUP_EXIT_YES).tap(function() {
                navigator.app.exitApp();
            });
        }

        if (CQ.dev) {
            $(CQ.Id.Main.$CLEAR_HISTORY).tap(function() {
                CQ.Datastore.clear();
                if (CQ.App.android()) navigator.app.exitApp();
            });
        }
    },

    load: function() {
        this.refreshCurrency();
    },

    swipeAlbumLeft: function() {
        var currentAlbumId = CQ.Page.Main.albumId;

        if (currentAlbumId <= CQ.Album.TOTAL_ALBUM) {
            $(CQ.Id.Main.$ALBUM_EACH.format(currentAlbumId)).hide('slow');
            $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(currentAlbumId)).hide('slow');
            var nextAlbumId = ++CQ.Page.Main.albumId, nextAlbum = CQ.Album.getAlbum(nextAlbumId);

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
        var currentAlbumId = CQ.Page.Main.albumId;

        if (currentAlbumId > 1) {
            if (CQ.Album.getAlbum(currentAlbumId)) {
                $(CQ.Id.Main.$ALBUM_EACH.format(currentAlbumId)).hide('slow');
                $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(currentAlbumId)).hide('slow');
            } else {
                $(CQ.Id.Main.$ALBUM_MORE).hide('slow');
            }

            var nextAlbumId = --CQ.Page.Main.albumId, nextAlbum = CQ.Album.getAlbum(nextAlbumId);
            $(CQ.Id.Main.$ALBUM_NAME).text(nextAlbum.name);

            if (CQ.Album.isAlbumLocked(nextAlbumId)) {
                $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(nextAlbumId)).show('slow');
            } else {
                $(CQ.Id.Main.$ALBUM_EACH.format(nextAlbumId)).show('slow');
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
        if (CQ.Page.Main.selectedUnlockLevel) {
            $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK).popup('close');
            CQ.Album.unlockLevel(CQ.Page.Main.selectedUnlockLevel.albumId, CQ.Page.Main.selectedUnlockLevel.level, true);
            CQ.Page.Main.selectedUnlockLevel = null;
        }
    },

    enableAlbum: function(albumId) {
        // change album style
        $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(albumId)).fadeOut('slow');
        $(CQ.Id.Main.$ALBUM_EACH.format(albumId)).fadeIn('slow');

        // change next album events
        if (albumId < CQ.Album.TOTAL_ALBUM) {
            var nextAlbum = albumId + 1;
            $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(nextAlbum))
                .unbind('click')
                .click({ albumId: nextAlbum }, CQ.Page.Main.clickUnlockableAlbum);
        }
    },

    initPopups: function() {
        // level popup and buttons
        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK_YES).click(CQ.Page.Main.clickUnlockLevel);
        $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE_YES).click(CQ.Page.Main.clickPurchase);
        $(CQ.Id.Main.$POPUP_LEVEL_CANNOT_UNLOCK).bind(this.popupEvents);

        // album popup and buttons
        $(CQ.Id.Main.$POPUP_ALBUM_UNLOCK).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_ALBUM_UNLOCK_YES).click(CQ.Page.Main.clickUnlockAlbum);
        $(CQ.Id.Main.$POPUP_ALBUM_PURCHASE).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_ALBUM_PURCHASE_YES).click(CQ.Page.Main.clickPurchase);
        $(CQ.Id.Main.$POPUP_ALBUM_CANNOT_UNLOCK).bind(this.popupEvents);
    },

    initButtons: function() {
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

        // share buttons
        $(CQ.Id.$SHARE_FB.format(this.name)).tap(this.clickShareFacebook);
        $(CQ.Id.$SHARE_TW.format(this.name)).tap(this.clickShareTwitter);
        $(CQ.Id.$SHARE_LINE.format(this.name)).tap(this.clickShareLine);
        $(CQ.Id.$SHARE_OTHER.format(this.name)).tap(this.clickShareOther);
    },

    clickUnlockableAlbum: function(event) {
        var albumId = event.data.albumId;

        if (CQ.Currency.account.gem >= CQ.Currency.Consume.UnlockAlbum.gem) {
            $(CQ.Id.Main.$POPUP_ALBUM_UNLOCK).popup('open');
            CQ.Page.Main.selectedUnlockAlbum = { albumId: albumId };
        } else {
            $(CQ.Id.Main.$POPUP_ALBUM_PURCHASE).popup('open');
        }
    },

    clickUnlockDisableAlbum: function() {
        $(CQ.Id.Main.$POPUP_ALBUM_CANNOT_UNLOCK).popup('open');
    },

    clickUnlockAlbum: function() {
        if (CQ.Page.Main.selectedUnlockAlbum) {
            $(CQ.Id.Main.$POPUP_ALBUM_UNLOCK).popup('close');
            CQ.Album.unlockAlbum(CQ.Page.Main.selectedUnlockAlbum.albumId, true);
            CQ.Page.Main.selectedUnlockAlbum = null;
        }
    },

    clickPurchase: function() {
        CQ.Page.Main.open(CQ.Page.Purchase);
    },

    clickRating: function() {
        if (CQ.App.iOS) {
            CQ.GA.trackPage('App Store');
            window.open('itms-apps://itunes.com/apps/id663196539');
        } else if (CQ.App.android) {
            CQ.GA.trackPage('Play Store');
            window.open('market://details?id=com.cyberagent.jra');
        }
    },

    clickHelp: function() {
        CQ.Audio.Button.play();
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