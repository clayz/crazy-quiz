CQ.Popup.Share = function(page) {
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_SHARE, page);

    if (CQ.Page.Game.name == page) {
        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_TEXT)).html('この画像知ってる？');

        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_FACEBOOK)).click(function() {
            CQ.Audio.Button.play();
            CQ.SNS.Facebook.share(CQ.SNS.Message.GAME_PAGE, CQ.Page.Game.album.getPicturePath(100));
            CQ.GA.track(CQ.GA.Share.FB, CQ.Utils.getCapitalName(page));
        });

        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_TWITTER)).click(function() {
            CQ.Audio.Button.play();
            CQ.SNS.Twitter.share(CQ.SNS.Message.GAME_PAGE, CQ.Page.Game.album.getPicturePath(100));
            CQ.GA.track(CQ.GA.Share.TW, CQ.Utils.getCapitalName(page));
        });

        $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_OTHER)).click(function() {
            CQ.Audio.Button.play();
            CQ.SNS.share(CQ.SNS.Message.GAME_PAGE);
            CQ.GA.track(CQ.GA.Share.Other, CQ.Utils.getCapitalName(page));
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