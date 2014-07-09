CQ.Popup.UnlockLevel = function(page) {
    this.popup = new CQ.Popup('popup-unlock-level', page);
};

CQ.Popup.UnlockLevel.prototype.onClickYes = function() {
    CQ.Audio.Button.play();
    this.popup.close();
};

CQ.Popup.UnlockLevel.prototype.onClickNo = function() {
    CQ.Audio.Button.play();
    this.popup.close();
};

//CQ.Popup.UnlockLevel = {
//    name: 'popup-unlock-level',
//
//    init: function(page) {
//        this.initCommon(page);
//
//        $('{0} .{1}'.format(this.getId(page), CQ.Id.CSS.$POPUP_BTN_YES)).click(CQ.Page.Main.clickUnlockLevel);
//        $('{0} .{1}'.format(this.getId(page), CQ.Id.CSS.$POPUP_BTN_NO)).click(CQ.Page.Main.closeUnlockLevelPopup);
//
////        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK).bind(this.popupEvents);
////        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK_CLOSE).click(CQ.Page.Main.closeUnlockLevelPopup);
////        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK_YES).click(CQ.Page.Main.clickUnlockLevel);
////        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK_NO).click(CQ.Page.Main.closeUnlockLevelPopup);
//    },
//
//    onClickYes: function() {
//        CQ.Audio.Button.play();
//
//        if (CQ.Page.Main.selectedUnlockLevel) {
//            this.close();
//
//            CQ.Album.unlockLevel(CQ.Page.Main.selectedUnlockLevel.albumId, CQ.Page.Main.selectedUnlockLevel.level, true);
//            CQ.Page.Main.selectedUnlockLevel = null;
//        }
//    },
//
//    onClickNo: function() {
//
//    }
//};

//CQ.App.inherits(CQ.Popup.UnlockLevel, CQ.Popup);