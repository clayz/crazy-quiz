CQ.Popup.Share = function(page) {
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_SHARE, page);

    if (CQ.Page.Game.name == page) {
        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_TEXT)).html('画像をシェアして10コインゲット！<br/>1問につき1回まで。');

        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_FACEBOOK)).click(function() {
            CQ.Audio.Button.play();
            CQ.SNS.Facebook.share(CQ.SNS.Message.GAME_PAGE, '{0}{1}{2}.png'.format(CQ.URL.Web.ALBUM_IMAGE, CQ.Page.Game.album.path, CQ.Page.Game.picture.id));
            CQ.GA.track(CQ.GA.Share.FB, CQ.GA.Share.FB.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
        });

        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_TWITTER)).click(function() {
            CQ.Audio.Button.play();
            CQ.SNS.Twitter.share(CQ.SNS.Message.GAME_PAGE, '{0}{1}{2}.png'.format(CQ.URL.Web.ALBUM_IMAGE, CQ.Page.Game.album.path, CQ.Page.Game.picture.id));
            CQ.GA.track(CQ.GA.Share.TW, CQ.GA.Share.TW.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
        });

        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_OTHER)).click(function() {
            CQ.Audio.Button.play();
            CQ.SNS.share(CQ.SNS.Message.GAME_PAGE, '{0}{1}{2}.png'.format(CQ.URL.Web.ALBUM_IMAGE, CQ.Page.Game.album.path, CQ.Page.Game.picture.id));
            CQ.GA.track(CQ.GA.Share.Other, CQ.GA.Share.Other.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
        });
    } else {
        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_TEXT)).html('1日1回シェアして10コインGET！<br/>クイズをシェアして、みんなで楽しもう！');

        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_FACEBOOK)).click(function() {
            CQ.Audio.Button.play();
            CQ.SNS.Facebook.share(CQ.SNS.Message.MAIN_PAGE, null);
            CQ.GA.track(CQ.GA.Share.FB, CQ.Utils.getCapitalName(page));
        });

        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_TWITTER)).click(function() {
            CQ.Audio.Button.play();
            CQ.SNS.Twitter.share(CQ.SNS.Message.MAIN_PAGE, null);
            CQ.GA.track(CQ.GA.Share.TW, CQ.Utils.getCapitalName(page));
        });

        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_OTHER)).click(function() {
            CQ.Audio.Button.play();
            CQ.SNS.share(CQ.SNS.Message.MAIN_PAGE);
            CQ.GA.track(CQ.GA.Share.Other, CQ.Utils.getCapitalName(page));
        });
    }
};