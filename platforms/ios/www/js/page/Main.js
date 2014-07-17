CQ.Page.Main = {
    name: 'main',
    albumId: 1,
    selectedUnlockAlbum: null,
    selectedUnlockLevel: null,

    init: function() {
        console.info('Initial main page');

        if (CQ.App.iOS()) this.initCommon({ header: true, back: false, share: true });
        else this.initCommon({ header: true, back: true, share: true });

        this.initPopups();
        this.initButtons();

        // initial all albums and levels
        var lastAlbumId = CQ.Datastore.Picture.getLastAlbumId();

        for (var albumId = 1; albumId <= CQ.Album.TOTAL_ALBUM; albumId++) {
            var album = CQ.Album.getAlbum(albumId), lastLevel = CQ.Datastore.Picture.getLastLevel(album.id);
            console.log('Album {0}, last level {1}'.format(albumId, lastLevel));

            if (albumId == 1) {
                $(CQ.Id.Main.$ALBUM_NAME).text(album.name);
            }

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

        $(CQ.Id.Main.$ALBUM_CONTAINER).on('swipeleft', CQ.Page.Main.swipeAlbumLeft).on('swiperight', CQ.Page.Main.swipeAlbumRight);
        $(CQ.Id.Main.$ALBUM_WAITING).on('swiperight', CQ.Page.Main.swipeAlbumRight);

        if (CQ.App.android()) {
            // exit and clear history buttons
            $(CQ.Id.Main.$POPUP_EXIT).bind(this.popupEvents);
            $(CQ.Id.Main.$POPUP_EXIT_YES).tap(function() {
                navigator.app.exitApp();
            });
        }
    },

    initPopups: function() {
        // level popup and buttons
        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK_YES).click(CQ.Page.Main.clickUnlockLevel);
        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK_NO).click(CQ.Page.Main.closeUnlockLevelPopup);

        $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE_CLOSE).click(CQ.Page.Main.closeUnlockLevelPurchasePopup);
        $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE_YES).click(CQ.Page.Main.clickPurchase);

        $(CQ.Id.Main.$POPUP_LEVEL_CANNOT_UNLOCK).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_LEVEL_CANNOT_UNLOCK_CLOSE).click(CQ.Page.Main.closeUnlockDisableLevelPopup);

        // album popup and buttons
        $(CQ.Id.Main.$POPUP_ALBUM_UNLOCK).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_ALBUM_UNLOCK_YES).click(CQ.Page.Main.clickUnlockAlbum);
        $(CQ.Id.Main.$POPUP_ALBUM_PURCHASE).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_ALBUM_PURCHASE_YES).click(CQ.Page.Main.clickPurchase);
        $(CQ.Id.Main.$POPUP_ALBUM_CANNOT_UNLOCK).bind(this.popupEvents);
    },

    initButtons: function() {
        // previous and next album button
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
        var welcomeText = "{0}さん<br/>お帰りなさい！".format(CQ.User.getName());
        $(CQ.Id.Main.$WELCOME_CONTENT).html(welcomeText);
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
            $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(currentAlbumId)).hide();
            var nextAlbumId = ++CQ.Page.Main.albumId, nextAlbum = CQ.Album.getAlbum(nextAlbumId);

            if (nextAlbum) {
                // display next album levels
                $(CQ.Id.Main.$ALBUM_NAME).text(nextAlbum.name);

                if (CQ.Album.isAlbumLocked(nextAlbumId)) {
                    $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(nextAlbumId)).show();
                } else {
                    $(CQ.Id.Main.$ALBUM_EACH.format(nextAlbumId)).show();
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
                $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(currentAlbumId)).hide();
            } else {
                // hide current waiting page
                $(CQ.Id.Main.$ALBUM_WAITING).hide();
                $(CQ.Id.Main.$ALBUM_CONTAINER).show();
            }

            var nextAlbumId = --CQ.Page.Main.albumId, nextAlbum = CQ.Album.getAlbum(nextAlbumId);
            $(CQ.Id.Main.$ALBUM_NAME).text(nextAlbum.name);

            if (CQ.Album.isAlbumLocked(nextAlbumId)) {
                $(CQ.Id.Main.$ALBUM_EACH_LOCKED.format(nextAlbumId)).show();
            } else {
                $(CQ.Id.Main.$ALBUM_EACH.format(nextAlbumId)).show();
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

    clickUnlockableAlbum: function(event) {
        CQ.Audio.Button.play();
        var albumId = event.data.albumId;

        if (CQ.Currency.account.gem >= CQ.Currency.Consume.UnlockAlbum.gem) {
            $(CQ.Id.Main.$POPUP_ALBUM_UNLOCK).popup('open');
            CQ.Page.Main.selectedUnlockAlbum = { albumId: albumId };
        } else {
            $(CQ.Id.Main.$POPUP_ALBUM_PURCHASE).popup('open');
        }
    },

    clickUnlockDisableAlbum: function() {
        CQ.Audio.Button.play();
        $(CQ.Id.Main.$POPUP_ALBUM_CANNOT_UNLOCK).popup('open');
    },

    clickUnlockAlbum: function() {
        CQ.Audio.Button.play();
        if (CQ.Page.Main.selectedUnlockAlbum) {
            $(CQ.Id.Main.$POPUP_ALBUM_UNLOCK).popup('close');
            CQ.Album.unlockAlbum(CQ.Page.Main.selectedUnlockAlbum.albumId, true);
            CQ.Page.Main.selectedUnlockAlbum = null;
        }
    },

    clickPurchase: function() {
        CQ.Audio.Button.play();
        $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE).popup('close');

        setTimeout(function() {
            CQ.Page.Main.gemShop.popup.open();
        }, 100);
    },

    clickRating: function() {
        CQ.GA.trackPage('PlayStore');
        window.open('market://details?id=com.cyberagent.jra');
    },

    clickHelp: function() {
        CQ.Audio.Button.play();
        CQ.Page.open(CQ.Page.Help);
    },

    closeUnlockLevelPopup: function() {
        CQ.Audio.Button.play();
        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK).popup('close');
    },

    closeUnlockLevelPurchasePopup: function() {
        CQ.Audio.Button.play();
        $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE).popup('close');
    },

    closeUnlockDisableLevelPopup: function() {
        CQ.Audio.Button.play();
        $(CQ.Id.Main.$POPUP_LEVEL_CANNOT_UNLOCK).popup('close');
    }
};

CQ.App.inherits(CQ.Page.Main, CQ.Page);
CQ.App.register(CQ.Page.Main);