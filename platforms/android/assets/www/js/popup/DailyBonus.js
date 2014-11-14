CQ.Popup.DailyBonus = function(page, dailyBonusGot){
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_DAILY_BONUS, page);

    $(CQ.Id.DailyBonus.$DAILY_BONUS_BUTTON_GET).bind('click', function(){
        dailyBonusGot.getBonus();

        //close this window and open windows of bonus get
        CQ.Page.openPopup(dailyBonusGot);

    }).bind('touchstart', function(){
        $(this).removeClass().addClass(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_GET_PRESSED);
    }).bind('touchend', function(){
        $(this).removeClass().addClass(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_GET_NORMAL);
    });
};

CQ.Popup.DailyBonus.prototype.ifGetBonusToday = function(){
    var dailyBonusFlg = false;
    var now = new Date();

    // check last login time
    if(CQ.Datastore.User.getLastDailyTime() == 0){
        //first login
        dailyBonusFlg = true;
    } else {
        var lastDailyTime = new Date(CQ.Datastore.User.getLastDailyTime());

        var lastDailyDate = new Date("{0}-{1}-{2}".format(lastDailyTime.getFullYear(),
            lastDailyTime.getMonth() + 1, lastDailyTime.getDate()));

        var nowDate = new Date("{0}-{1}-{2}".format(now.getFullYear(),
            now.getMonth() + 1, now.getDate()));
        //alert("nowDate: " + "{0}-{1}-{2}".format(now.getFullYear(),
        //    now.getMonth() + 1,now.getDate()));
        //alert("lastDate: " + "{0}-{1}-{2}".format(lastDailyTime.getFullYear(),
        //    lastDailyTime.getMonth() + 1, lastDailyTime.getDate()));
        if(nowDate.getTime() != lastDailyDate.getTime()){
            dailyBonusFlg = true;
        }
    }

    return dailyBonusFlg;
};

CQ.Popup.DailyBonus.prototype.refresh = function() {
    var position = CQ.Datastore.User.getContinueDailyCount();
    if(position == 7){
        position = 0;
    }
    var nextCount = position + 1;

    var dailyBonusArray = $(CQ.Id.CSS.$POPUP_DAILY_BONUS_DAY);

    for(var i = 0; i < dailyBonusArray.length; i++){
        if(i < position){
            $(dailyBonusArray[i]).find(CQ.Id.CSS.$POPUP_DAILY_BONUS_DAY_GOT).show();
            $(dailyBonusArray[i]).find(CQ.Id.CSS.$POPUP_DAILY_BONUS_DAY_TODAY).hide();
        } else if (i == position){
            $(dailyBonusArray[i]).find(CQ.Id.CSS.$POPUP_DAILY_BONUS_DAY_GOT).hide();
            $(dailyBonusArray[i]).find(CQ.Id.CSS.$POPUP_DAILY_BONUS_DAY_TODAY).show();
        } else {
            $(dailyBonusArray[i]).find(CQ.Id.CSS.$POPUP_DAILY_BONUS_DAY_GOT).hide();
            $(dailyBonusArray[i]).find(CQ.Id.CSS.$POPUP_DAILY_BONUS_DAY_TODAY).hide();
        }
    }

    // set image today
    $(CQ.Id.DailyBonus.$DAILY_BONUS_IMG_TODAY).removeClass().addClass(
        CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_IMG.format(nextCount));

    $(CQ.Id.DailyBonus.$DAILY_BONUS_IMG_TODAY_GOT).removeClass().addClass(
        CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_GOT_IMG.format(nextCount));

    // set bonus amount today
    var earnType = CQ.Currency.Earn['DailyDay' + nextCount];
    if(earnType.coin == 0){
        $(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_FRAME).find('span').text('X' + earnType.gem);
        $(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_GOT_TEXT).text('X' + earnType.gem);
    } else {
        $(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_FRAME).find('span').text('X' + earnType.coin);
        $(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_GOT_TEXT).text('X' + earnType.coin);
    }
};