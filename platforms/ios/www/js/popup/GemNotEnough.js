CQ.Popup.GemNotEnough = function(page) {
    var popup = new CQ.Popup(CQ.Id.CSS.$POPUP_GEM_NOT_ENOUGH, page);
    this.popup = popup;

    this.popup.onClickYes(function() {
        CQ.Audio.Button.play();
        popup.close();

        setTimeout(function() {
            CQ.Page.get(page).gemShop.popup.open();
        }, 100);
    });

    this.popup.onClickNo(function() {
        CQ.Audio.Button.play();
        popup.close();
    });
};