CQ.Popup.PurchaseLevel = function(page) {
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_PURCHASE_LEVEL, page);
    var popup = this.popup;

    popup.onClickYes(function() {
        popup.close();
        setTimeout(function() {
            CQ.Page.Main.purchasePopup.popup.open();
        }, 100);
    });
};