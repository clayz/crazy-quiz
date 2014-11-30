CQ.Popup.Share = function(page) {
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_SHARE, page);
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
    var popup = this, popupId = this.popup.getId(), page = this.popup.page;
    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_TEXT)).html('1日1回シェアして10コインGET！<br/>クイズをシェアして、みんなで楽しもう！');

    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_FACEBOOK)).click(function() {
        CQ.Audio.Button.play();

        if (CQ.Session.FACEBOOK_AUTH) {
            alert(1);
            //popup.openTextArea();
            //CQ.SNS.Facebook.share(CQ.SNS.Message.MAIN_PAGE, null);
            //CQ.GA.track(CQ.GA.Share.FB, CQ.Utils.getCapitalName(page));
        } else {
            // check facebook auth
            CQ.SNS.Facebook.login();
        }
    });

    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_TWITTER)).click(function() {
        CQ.Audio.Button.play();

        if (CQ.Session.TWITTER_AUTH) {
            //popup.openTextArea();
            //CQ.SNS.Twitter.share(CQ.SNS.Message.MAIN_PAGE, null);
            //CQ.GA.track(CQ.GA.Share.TW, CQ.Utils.getCapitalName(page));
        } else {
            // check twitter auth
            CQ.SNS.Twitter.login();
        }
    });
};

CQ.Popup.Share.prototype.initGame = function() {
    var popupId = this.popup.getId();
    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_TEXT)).html('画像をシェアして10コインゲット！<br/>1問につき1回まで。');

    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_FACEBOOK)).click(function() {
        CQ.Audio.Button.play();

        // check facebook auth
        CQ.SNS.Facebook.login();

        //CQ.SNS.Facebook.share(CQ.SNS.Message.GAME_PAGE, '{0}{1}{2}.png'.format(CQ.URL.Web.ALBUM_IMAGE, CQ.Page.Game.album.path, CQ.Page.Game.picture.id));
        CQ.GA.track(CQ.GA.Share.FB, CQ.GA.Share.FB.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
    });

    $('{0} {1}'.format(popupId, CQ.Id.CSS.$POPUP_SHARE_TWITTER)).click(function() {
        CQ.Audio.Button.play();

        // check twitter auth
        CQ.SNS.Twitter.login();

        //CQ.SNS.Twitter.share(CQ.SNS.Message.GAME_PAGE, '{0}{1}{2}.png'.format(CQ.URL.Web.ALBUM_IMAGE, CQ.Page.Game.album.path, CQ.Page.Game.picture.id));
        CQ.GA.track(CQ.GA.Share.TW, CQ.GA.Share.TW.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
    });
};