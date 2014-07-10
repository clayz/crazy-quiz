CQ.Popup.UnlockLevel = function(page) {
    this.popup = new CQ.Popup('popup-unlock-level', page);
    this.popup.onClickYes(this.unlock);
    this.popup.onClickNo(this.popup.close);
};

CQ.Popup.UnlockLevel.prototype.unlock = function() {
    if (CQ.Page.Main.selectedUnlockLevel) {
        this.popup.close();
        CQ.Album.unlockLevel(CQ.Page.Main.selectedUnlockLevel.albumId, CQ.Page.Main.selectedUnlockLevel.level, true);
        CQ.Page.Main.selectedUnlockLevel = null;
    }
};