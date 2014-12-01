CQ.Popup.Share = function(page) {
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_SHARE, page);
    this.shareType = CQ.SNS.ShareType.FACEBOOK;

    if (CQ.Page.Game.name == page) this.initGame();
    else this.initMain();

    $('#{0} {1} {2}'.format(page, CQ.Id.CSS.$POPUP_SHARE, CQ.Id.CSS.$POPUP_SHARE_YES))
        .bind('touchstart', function() {
            $(this).attr('src', CQ.Id.Image.POPUP_SHARE_TAP);
        }).bind('touchend', function() {
            $(this).attr('src', CQ.Id.Image.POPUP_SHARE);
        });
};

CQ.Popup.Share.prototype.initMain = function() {
    var popup = this, popupId = this.popup.getId();
    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_TEXT)).html('1日1回シェアして10コインGET！<br/>クイズをシェアして、みんなで楽しもう！');

    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_FACEBOOK)).click(function() {
        CQ.Audio.Button.play();
        popup.shareType = CQ.SNS.ShareType.FACEBOOK;
        if (!CQ.Session.FACEBOOK_AUTH) CQ.SNS.Facebook.login();
        // TODO high light facebook button
    });

    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_TWITTER)).click(function() {
        CQ.Audio.Button.play();
        popup.shareType = CQ.SNS.ShareType.TWITTER;
        if (!CQ.Session.TWITTER_AUTH) CQ.SNS.Twitter.login();
        // TODO high light twitter button
    });

    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_YES)).click(function() {
        var message = $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_MESSAGE)).val();
        CQ.Log.debug('Share message: {0}'.format(message));

        if (CQ.SNS.ShareType.FACEBOOK == popup.shareType) {
            if (CQ.Session.FACEBOOK_AUTH) CQ.SNS.Facebook.share(message);
            else CQ.SNS.Facebook.login();
        } else if (CQ.SNS.ShareType.TWITTER == popup.shareType) {
            if (CQ.Session.TWITTER_AUTH) CQ.SNS.Twitter.share(message);
            else CQ.SNS.Twitter.login();
        } else CQ.Log.error('Unsupported share type: {0}'.format(popup.shareType));
    });
};

CQ.Popup.Share.prototype.initGame = function() {
    var popup = this, popupId = this.popup.getId();
    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_TEXT)).html('画像をシェアして10コインゲット！<br/>1問につき1回まで。');

    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_FACEBOOK)).click(function() {
        CQ.Audio.Button.play();
        popup.shareType = CQ.SNS.ShareType.FACEBOOK;
        if (!CQ.Session.FACEBOOK_AUTH) CQ.SNS.Facebook.login();
        // TODO high light facebook button
    });

    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_TWITTER)).click(function() {
        CQ.Audio.Button.play();
        popup.shareType = CQ.SNS.ShareType.TWITTER;
        if (!CQ.Session.TWITTER_AUTH) CQ.SNS.Twitter.login();
        // TODO high light twitter button
    });

    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_YES)).click(function() {
        var message = $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_MESSAGE)).val(), album = CQ.Game.album.id, picture = CQ.Game.picture.id;
        CQ.Log.debug('Share message: {0}, album: {1}, picture: {2}'.format(message, album, picture));

        if (CQ.SNS.ShareType.FACEBOOK == popup.shareType) {
            if (CQ.Session.FACEBOOK_AUTH) CQ.SNS.Facebook.share(message, album, picture);
            else CQ.SNS.Facebook.login();
        } else if (CQ.SNS.ShareType.TWITTER == popup.shareType) {
            if (CQ.Session.TWITTER_AUTH) CQ.SNS.Twitter.share(message, album, picture);
            else CQ.SNS.Twitter.login();
        } else CQ.Log.error('Unsupported share type: {0}'.format(popup.shareType));
    });
};