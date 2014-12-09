CQ.Popup.DailyBonusGot = function(page){
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_DAILY_BONUS_TODAY_GOT, page);

    $(CQ.Id.DailyBonus.$DAILY_BONUS_GOT).find(CQ.Id.CSS.$POPUP_DAILY_BONUS_DAY_GOT).click(function(){
        CQ.Page.closePopup();
    });
};

CQ.Popup.DailyBonusGot.prototype.dailyBonusSave = function(){
    CQ.API.dailyBonusSave(function(response){
        CQ.Log.debug('Daily bonus save request success, response: {0}'.format(CQ.Utils.toString(response)));

        switch (response.status) {
            case 100000:

                // save coin or gem
                if(CQ.Currency.earn(CQ.Currency.Earn['DailyDay' + response.data.saved_count])) {
                    //refresh coin and gem
                    CQ.Page.refreshCurrency();

                    // open popup of daily bonus got
                    CQ.Page.openPopup(CQ.Page.Main.dailyBonusGot);
                }
                break;
            default:
                CQ.Log.error('Daily bonus check failed, response: {0}'.format(CQ.Utils.toString(response)));
                // alert error message
                break;
        }
    });
};