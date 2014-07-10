CQ.Popup.UnlockLevel = function(page) {
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_UNLOCK_LEVEL, page);
    var popup = this.popup;

    this.popup.onClickYes(function() {
        if (CQ.Page.Main.selectedUnlockLevel) {
            popup.close();
            CQ.Album.unlockLevel(CQ.Page.Main.selectedUnlockLevel.albumId, CQ.Page.Main.selectedUnlockLevel.level, true);
            CQ.Page.Main.selectedUnlockLevel = null;

        }
    });

    this.popup.onClickNo(function() {
        popup.close();
    });
};