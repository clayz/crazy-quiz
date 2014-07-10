CQ.Popup.Share = function(page) {
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_SHARE, page);

    $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_SHARE_FACEBOOK)).click(function() {
        CQ.Audio.Button.play();
        CQ.SNS.Facebook.share(CQ.SNS.Message.MAIN_PAGE, null);
        CQ.GA.track(CQ.GA.Share.FB, CQ.Utils.getCapitalName(page));
    });
};