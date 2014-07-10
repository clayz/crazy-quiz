CQ.Popup = {
    init: function(page) {
        $('#' + page).append($('{0} .{1}'.format(CQ.Id.$SCRATCH, this.name)).clone());
    },

    open: function(page) {
        $('#{0} .{1}'.format(page, this.name)).popup('open');
    },

    close: function(page) {
        $('#{0} .{1}'.format(page, this.name)).popup('close');
    }
};