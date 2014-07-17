CQ.Popup.Prompt = function(page) {
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_PROMPT, page);
};

CQ.Popup.Prompt.prototype.open = function(msg) {
    $('#{0} {1}'.format(this.popup.getId(), CQ.Id.CSS.$POPUP_PROMPT_TEXT)).text(msg);
    this.popup('open');
};
