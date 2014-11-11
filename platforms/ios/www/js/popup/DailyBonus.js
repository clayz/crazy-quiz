CQ.Popup.DailyBonus = function(page){
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_DAILY_BONUS, page);

    $(CQ.Id.DailyBonus.$DAILY_BONUS_BUTTON_GET).bind('click', function(){
        //this.getBonus();
        alert('Get bonus!');
        //close this window and open windows of bonus get
        CQ.Page.closePopup();


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
        var lastLoginTime = new Date(CQ.Datastore.User.getLastDailyTime());

        var lastLoginDate = new Date("{0}-{1}-{2}".format(lastLoginTime.getYear(),
                                                          lastLoginTime.getMonth() + 1,lastLoginTime.getDate()));

        var nowDate = new Date("{0}-{1}-{2}".format(now.getYear(),
                                                    now.getMonth() + 1,now.getDate()));

        if(nowDate.getTime() == lastLoginDate.getTime()){
            dailyBonusFlg = true;
        }
    }

    return dailyBonusFlg;
};

CQ.Popup.DailyBonus.prototype.getBonus = function(){
    var isInterrupt = false;

    var lastLoginTime = new Date(CQ.Datastore.User.getLastDailyTime());
    var lastLoginDate = new Date("{0}-{1}-{2}".format(lastLoginTime.getYear(),
                                                      lastLoginTime.getMonth() + 1,lastLoginTime.getDate()));

    var now = new Date();
    var nowDate = new Date("{0}-{1}-{2}".format(now.getYear(),
                                                now.getMonth() + 1,now.getDate()));

    if(((nowDate.getTime() - lastLoginDate.getTime())/(3600 * 1000)) > 24){
        isInterrupt = true;
    }

    var count = CQ.Datastore.User.getContinueDailyCount();

    // check continue login count
    count++;

    if(continueLoginCount > 7 || isInterrupt){
        count = 0;
    }

    // set last login time to newest
    CQ.Datastore.User.setLastDailyTime(now.getTime());

    // set count this time
    CQ.Datastore.User.setContinueDailyCount(count);

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

    // set bonus amount today
    var earnType = CQ.Currency.Earn['DailyDay' + nextCount];
    if(earnType.coin == 0){
        $(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_FRAME).find('span').text('X' + earnType.gem);
//            $(CQ.Id.LoginBonus.$LOGIN_BONUS_AMOUNT_GET).text(earnType.gem);
    } else {
        $(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_FRAME).find('span').text('X' + earnType.coin);
//            $(CQ.Id.LoginBonus.$LOGIN_BONUS_AMOUNT_GET).text(earnType.coin);
    }
};