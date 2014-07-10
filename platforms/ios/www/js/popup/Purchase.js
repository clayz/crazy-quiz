CQ.Popup.Purchase = {
    name: 'popup-purchase',

    init: function(page) {
        this.initCommon(page);

        this.bindClickButton('#{0} {1}'.format(page, CQ.Id.CSS.$POPUP_PURCHASE), function() {
            CQ.Audio.Button.play();
            page.open(CQ.Page.Purchase);
        }, CQ.Id.Image.CURRENCY_ADD_TAP, CQ.Id.Image.CURRENCY_ADD);
    }
};

CQ.App.inherits(CQ.Popup.Purchase, CQ.Popup);
CQ.App.register(CQ.Popup.Purchase);