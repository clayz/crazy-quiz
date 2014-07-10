CQ.Popup = function(name, page, config) {
    this.name = name;
    this.page = page;
    this.config = config;

    // append popup div into page
    $('#' + page).append($('{0} .{1}'.format(CQ.Id.$POPUP, name)).clone());

    // bind popup state with current session
    var indicator = '#{0} .{1}'.format(page, name);
    $(indicator).bind({
        popupafteropen: function() {
            CQ.Session.CURRENT_OPEN_POPUP = indicator;
        },
        popupafterclose: function() {
            CQ.Session.CURRENT_OPEN_POPUP = null;
        }
    });

    if (config) {
        if (config.close) {
            // bind close button event
            $('#{0} .{1} {2}'.format(page, name, CQ.Id.CSS.$POPUP_BTN_CLOSE)).click({ popup: this }, function(event) {
                event.data.popup.close();
            });
        }
    }
};

CQ.Popup.prototype.getId = function() {
    return '#{0} .{1}'.format(this.page, this.name);
};

CQ.Popup.prototype.open = function() {
    $('#{0} .{1}'.format(this.page, this.name)).popup('open');
};

CQ.Popup.prototype.close = function() {
    $('#{0} .{1}'.format(this.page, this.name)).popup('close');
};

CQ.Popup.prototype.onClickYes = function(event) {
    CQ.Audio.Button.play();
    $('{0} {1}'.format(this.getId(), CQ.Id.CSS.$POPUP_BTN_YES)).click(event);
};

CQ.Popup.prototype.onClickNo = function(event) {
    CQ.Audio.Button.play();
    $('{0} {1}'.format(this.getId(), CQ.Id.CSS.$POPUP_BTN_NO)).click(event);
};