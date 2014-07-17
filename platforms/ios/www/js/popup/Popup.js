CQ.Popup = function(name, page) {
    this.name = name;
    this.page = page;
    var popup = this;

    // append popup div into page
    $('#' + page).append($('{0} {1}'.format(CQ.Id.$POPUP, name)).clone());

    // bind popup state with current session
    var indicator = '#{0} {1}'.format(page, name);

    $(indicator).popup();
    $(indicator).bind({
        popupafteropen: function() {
            CQ.Session.CURRENT_OPEN_POPUP = indicator;
        },
        popupafterclose: function() {
            CQ.Session.CURRENT_OPEN_POPUP = null;
        }
    });

    // bind close event
    var $closeBtn = $('#{0} {1} {2}'.format(page, name, CQ.Id.CSS.$POPUP_BTN_CLOSE));
    if ($closeBtn.length) {
        $closeBtn.click(function() {
            popup.close();
        });
    }
};

CQ.Popup.prototype.getId = function() {
    return '#{0} {1}'.format(this.page, this.name);
};

CQ.Popup.prototype.open = function() {
    alert('#{0} {1}'.format(this.page, this.name));
    $('#{0} {1}'.format(this.page, this.name)).popup('open');
};

CQ.Popup.prototype.close = function() {
    $('#{0} {1}'.format(this.page, this.name)).popup('close');
};

CQ.Popup.prototype.onClickYes = function(event) {
    CQ.Audio.Button.play();
    $('{0} {1}'.format(this.getId(), CQ.Id.CSS.$POPUP_BTN_YES)).click(event);
};

CQ.Popup.prototype.onClickNo = function(event) {
    CQ.Audio.Button.play();
    $('{0} {1}'.format(this.getId(), CQ.Id.CSS.$POPUP_BTN_NO)).click(event);
};