CQ.Popup.DailyBonus = function(page, dailyBonusGot){
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_DAILY_BONUS, page);

    $(CQ.Id.DailyBonus.$DAILY_BONUS_BUTTON_GET).bind('click', function(){
        dailyBonusGot.dailyBonusSave();

        // set click function unavailable
    }).bind('touchstart', function(){
        $(this).removeClass().addClass(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_GET_PRESSED);
    }).bind('touchend', function(){
        $(this).removeClass().addClass(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_GET_NORMAL);
    });
};

CQ.Popup.DailyBonus.prototype.dailyBonus = function(){
    CQ.API.dailyBonus(function(response){
        CQ.Log.debug('Daily bonus request success, response: {0}'.format(CQ.Utils.toString(response)));

        switch (response.status) {
            case 100000:

                if(!response.data.is_got_today){
                    // initial daily bonus popup
                    var nextCount = response.data.next_count;
                    var position = nextCount - 1;

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

                    CQ.Page.openPopup(CQ.Page.Main.dailyBonus);
                } else {
                    // check if user has written comment in app store.
                    if (!CQ.Datastore.User.isRated()) {
                        // open rating popup if required
                        var startTimes = CQ.Datastore.User.getStartTimes();

                        if ((startTimes > 0) && (startTimes % 5 == 0) && !CQ.Page.Main.ratePopupDisplayed) {
                            $(CQ.Id.Main.$POPUP_RATING).popup('open');
                            CQ.Page.Main.ratePopupDisplayed = true;
                        } else {
                            CQ.Page.Main.ratePopupDisplayed = false;
                        }
                    }
                }

                break;
            default:
                CQ.Log.error('Daily bonus check failed, response: {0}'.format(CQ.Utils.toString(response)));
                break;
        }
    });
};