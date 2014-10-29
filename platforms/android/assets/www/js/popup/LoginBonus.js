CQ.Popup.LoginBonus = function(page1){
    // check login status
    if(CQ.LoginBonus.loginBonus){

        // cover image when login bonus has been given
        for(var i = 0; i < CQ.LoginBonus.continueLoginCount; i++){
            $(CQ.Id.LoginBonus.$LOGIN_BONUS_IMG_DAY.format(i)).css(
                CQ.Id.CSS.POPUP_LOGIN_BONUS_GOT.format(i));
        }

        for(var i = CQ.LoginBonus.continueLoginCount; i < 7; i++){
            $(CQ.Id.LoginBonus.$LOGIN_BONUS_IMG_DAY.format(i)).css(
                CQ.Id.CSS.$POPUP_LOGIN_BONUS_LATER.format(i));
        }

        // set image today
        $(CQ.Id.LoginBonus.$LOGIN_BONUS_IMG_TODAY).css(
            CQ.Id.CSS.POPUP_LOGIN_BONUS_GOT.format(CQ.LoginBonus.continueLoginCount));

        $(CQ.Id.LoginBonus.$LOGIN_BONUS_IMG_GET).css(
                    CQ.Id.CSS.POPUP_LOGIN_BONUS_GOT.format(CQ.LoginBonus.continueLoginCount));

        // set bonus number today
        if(CQ.LoginBonus.loginBonusNow.coin == 0){
            $(CQ.Id.LoginBonus.$LOGIN_BONUS_AMOUNT_TODAY).text(CQ.LoginBonus.loginBonusNow.gem);
            $(CQ.Id.LoginBonus.$LOGIN_BONUS_AMOUNT_GET).text(CQ.LoginBonus.loginBonusNow.gem);
        } else {
            $(CQ.Id.LoginBonus.$LOGIN_BONUS_AMOUNT_TODAY).text(CQ.LoginBonus.loginBonusNow.coin);
            $(CQ.Id.LoginBonus.$LOGIN_BONUS_AMOUNT_GET).text(CQ.LoginBonus.loginBonusNow.coin);
        }

        $(CQ.Id.LoginBonus.$LOGIN_BONUS_BUTTON_GET).bind("tap", function(){
            CQ.Currency.earn(CQ.LoginBonus.loginBonusNow);
            $(CQ.Id.LoginBonus.$LOGIN_BONUS_DIV_GET).show();
        });

        // hide login bonus and login bonus hide
        $(CQ.Id.LoginBonus.$LOGIN_BONUS_DIV_GET).on("tap", function(){
            $(this).hide();
            $(CQ.Id.LoginBonus.$LOGIN_BONUS).hide();
        });

        this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_LOGIN_BONUS, page);
    }
}