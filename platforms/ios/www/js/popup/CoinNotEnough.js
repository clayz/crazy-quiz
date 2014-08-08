CQ.Popup.CoinNotEnough = function(page) {
    var popup = new CQ.Popup(CQ.Id.CSS.$POPUP_COIN_NOT_ENOUGH, page);
    this.popup = popup;

    this.popup.onClickYes(function() {
        CQ.Page.openCoinShop();
    });
};