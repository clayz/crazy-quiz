CQ.Popup.Exchange = {
    name: 'popup-exchange',

    init: function(page) {
        this.initCommon(page);

        this.bindClickButton('#{0} {1}'.format(page, CQ.Id.CSS.$POPUP_EXCHANGE), function() {
            CQ.Audio.Button.play();
            page.open(CQ.Page.Exchange);
        }, CQ.Id.Image.CURRENCY_ADD_TAP, CQ.Id.Image.CURRENCY_ADD);
    }
};

CQ.App.inherits(CQ.Popup.Exchange, CQ.Popup);
CQ.App.register(CQ.Popup.Exchange);