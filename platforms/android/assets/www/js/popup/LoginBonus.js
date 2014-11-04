CQ.Popup.LoginBonus = function(page1){
    // check login status
    if(CQ.LoginBonus.loginBonus){
        var position = CQ.Datastore.User.getContinueLoginCount - 1;

        var bonusImageArray = $(CQ.Id.CSS.$POPUP_LOGIN_BONUS_DAY_IMG);
        for(var i = 0; i < bonusImageArray; i++){
            $(bonusImageArray(i)).removeClass();
            if(i < position){
                $(bonusImageArray(i)).addClass($POPUP_LOGIN_BONUS_DAY_IMG_GET);
            } else if (i == position){
                $(bonusImageArray(i)).addClass($POPUP_LOGIN_BONUS_DAY_IMG_TODAY);
            } else {
                $(bonusImageArray(i)).addClass($POPUP_LOGIN_BONUS_DAY_IMG_NOT_GET);
            }
        }

        // set image today
        $(CQ.Id.LoginBonus.$LOGIN_BONUS_TODAY_IMG).addClass(
            CQ.Id.CSS.$POPUP_LOGIN_BONUS_DAY_IMG.format(position + 1));

        $(CQ.Id.LoginBonus.$LOGIN_BONUS_TODAY_IMG_GET).addClass(
            CQ.Id.CSS.$POPUP_LOGIN_BONUS_DAY_IMG.format(position + 1));

        // set bonus amount today
        var earnType = CQ.Currency.Earn["LoginDay" + (position + 1)];

        if(earnType.coin == 0){
            $(CQ.Id.LoginBonus.$LOGIN_BONUS_AMOUNT_TODAY).text(earnType.gem);
            $(CQ.Id.LoginBonus.$LOGIN_BONUS_AMOUNT_GET).text(earnType.gem);
        } else {
            $(CQ.Id.LoginBonus.$LOGIN_BONUS_AMOUNT_TODAY).text(earnType.coin);
            $(CQ.Id.LoginBonus.$LOGIN_BONUS_AMOUNT_GET).text(earnType.coin);
        }

        $(CQ.Id.LoginBonus.$LOGIN_BONUS_BUTTON_GET).bind("tap", function(){
            CQ.LoginBonus.getBonus();

            // close this window and open windows of bonus get
        });

        this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_LOGIN_BONUS, page);
    }
}