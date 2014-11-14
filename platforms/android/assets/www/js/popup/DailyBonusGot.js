CQ.Popup.DailyBonusGot = function(page){
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_GOT, page);

    $(CQ.Id.DailyBonus.$DAILY_BONUS_GOT).find(CQ.Id.CSS.$POPUP_DAILY_BONUS_DAY_GOT).click(function(){
        CQ.Page.closePopup();
    });
};

CQ.Popup.DailyBonusGot.prototype.getBonus = function(){
    var isInterrupt = false;
    var now = new Date();

    if(CQ.Datastore.User.getLastDailyTime() != 0){
        var lastDailyTime = new Date(CQ.Datastore.User.getLastDailyTime());
        var lastDailyDate = new Date("{0}-{1}-{2}".format(lastDailyTime.getFullYear(),
            lastDailyTime.getMonth() + 1, lastDailyTime.getDate()));

        var nowDate = new Date("{0}-{1}-{2}".format(now.getFullYear(),
            now.getMonth() + 1, now.getDate()));

        //alert(lastDailyDate);
        //alert(nowDate);
        //alert((nowDate.getTime() - lastDailyDate.getTime())/(3600 * 1000));

        if(((nowDate.getTime() - lastDailyDate.getTime())/(3600 * 1000)) > 24){
            isInterrupt = true;
        }
    }

    var count = CQ.Datastore.User.getContinueDailyCount();

    // check continue login count
    count += 1;

    if(count > 7 || isInterrupt){
        count = 1;
    }

    // save coin or gem
    if(CQ.Currency.earn(CQ.Currency.Earn['DailyDay' + count])){
        // set last login time to newest
        CQ.Datastore.User.setLastDailyTime(now.getTime());

        // set count this time
        CQ.Datastore.User.setContinueDailyCount(count);

        //refresh coin and gem
        CQ.Page.refreshCurrency();
    }
};