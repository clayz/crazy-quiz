CQ.Popup.Confirm = function(page) {
    var popup = new CQ.Popup(CQ.Id.CSS.$POPUP_CONFIRM, page);
    this.popup = popup;

    this.popup.onClickNo(function() {
        CQ.Audio.Button.play();
        popup.close();
    });
};

CQ.Popup.Confirm.prototype.open = function(msg) {
    $('{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_CONFIRM_TEXT)).text(msg);
    this.popup.open();
};

CQ.Popup.Confirm.prototype.yes = function(callback) {
    this.popup.onClickYes(callback, true);
};

CQ.Popup.Confirm.prototype.no = function(callback) {
    this.popup.onClickYes(callback, true);
};
