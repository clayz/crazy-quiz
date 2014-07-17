CQ.Popup.CoinNotEnough = function(page) {
    var popup = new CQ.Popup(CQ.Id.CSS.$POPUP_COIN_NOT_ENOUGH, page);
    this.popup = popup;

    $('{0} {1}'.format(popup.getId(), CQ.Id.CSS.$POPUP_BTN_YES)).click(function() {
        CQ.Audio.Button.play();
        popup.close();

        setTimeout(function() {
            CQ.Page.get(page).coinShop.popup.open();
        }, 100);
    });

    $('{0} {1}'.format(popup.getId(), CQ.Id.CSS.$POPUP_BTN_NO)).click(function() {
        CQ.Audio.Button.play();
        popup.close();
    });
};