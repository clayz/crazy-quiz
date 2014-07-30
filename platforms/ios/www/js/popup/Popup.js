CQ.Popup = function(name, page) {
    this.name = name;
    this.page = page;
    var popup = this;

    // append popup div into page
    $('#' + page).append($('{0} {1}'.format(CQ.Id.$POPUP, name)).clone());

    // bind popup state with current session
    var indicator = '#{0} {1}'.format(page, name);

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
            CQ.Audio.Button.play();
            popup.close();
        });
    }
};

CQ.Popup.prototype.getId = function() {
    return '#{0} {1}'.format(this.page, this.name);
};

CQ.Popup.prototype.open = function() {
    console.info('Open popup: #{0} {1}'.format(this.page, this.name));
    $('#{0} {1}'.format(this.page, this.name)).popup('open');
};

CQ.Popup.prototype.close = function() {
    $('#{0} {1}'.format(this.page, this.name)).popup('close');
};

CQ.Popup.prototype.onClickYes = function(event, rebind) {
    CQ.Audio.Button.play();
    var $btn = $('{0} {1}'.format(this.getId(), CQ.Id.CSS.$POPUP_BTN_YES));
    if (rebind) $btn.unbind('click');
    $btn.click(event);
};

CQ.Popup.prototype.onClickNo = function(event, rebind) {
    CQ.Audio.Button.play();
    var $btn = $('{0} {1}'.format(this.getId(), CQ.Id.CSS.$POPUP_BTN_NO));
    if (rebind) $btn.unbind('click');
    $btn.click(event);
};