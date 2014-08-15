CQ.Popup.GemNotEnough = function(page) {
    var popup = new CQ.Popup(CQ.Id.CSS.$POPUP_GEM_NOT_ENOUGH, page);
    this.popup = popup;

    this.popup.onClickYes(function() {
        CQ.Page.openGemShop();
    });
};