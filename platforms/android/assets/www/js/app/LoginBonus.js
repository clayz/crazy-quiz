CQ.LoginBonus = {
    lastLoginTime: "",
    continueLoginCount: -1,
    loginBonusNow: Currency.Earn.LoginDay1,
    loginBonus: function(){

       var loginBonusFlg = false;
       var isInterrupt = false;
       var now = new Date();

       // check last login time
       if(lastLoginTime == ""){
            //first login
            loginBonusFlg = true;
       } else {
            var lastLoginTime = new Date(lastLoginTime);

            if(!(lastLoginTime.getDate() == now.getDate() && lastLoginTime.getMonth() == now.getMonth()
                && lastLoginTime.getYear() == now.getYear())){
                loginBonusFlg = false;
            } else {
                if((now.getTime() - lastLoginTime.getTime()) > 24){
                    isInterrupt = true;
                }
            }
       }

        if(loginBonusFlg){
            // check continue login count
            continueLoginCount++;

            if(continueLoginCount > 6 || isInterrupt){
                continueLoginCount = 0;
            }

            switch(continueLoginCount){
                case 0:
                    loginBonusNow: Currency.Earn.LoginDay1;
                    break;
                case 1:
                    loginBonusNow: Currency.Earn.LoginDay2;
                    break;
                case 2:
                    loginBonusNow: Currency.Earn.LoginDay3;
                    break;
                case 3:
                    loginBonusNow: Currency.Earn.LoginDay4;
                    break;
                case 4:
                    loginBonusNow: Currency.Earn.LoginDay5;
                    break;
                case 5:
                    loginBonusNow: Currency.Earn.LoginDay6;
                    break;
                case 6:
                    loginBonusNow: Currency.Earn.LoginDay7;
                    break;
            }

            // set last login time to newest
            lastLoginTime = now;
        }

        return loginBonusFlg;
    }
}

CQ.App.register(CQ.LoginBonus);