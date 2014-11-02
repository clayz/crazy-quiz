CQ.LoginBonus = {
//    lastLoginTime: "",
//    continueLoginCount: -1,
//    loginBonusNow: Currency.Earn.LoginDay1,
    loginBonus: function(){

       var loginBonusFlg = false;
       var isInterrupt = false;
       var now = new Date();

       // check last login time
       if(CQ.Datastore.User.getLastLoginTime === null){
            //first login
            loginBonusFlg = true;
       } else {
            var lastLoginTime = Date.parse(CQ.Datastore.User.getLastLoginTime);

            var lastLoginDate = new Date("{0}-{1}-{2}".format(lastLoginTime.getYear(),
                lastLoginTime.getMonth() + 1,lastLoginTime.getDate()));

            var nowDate = new Date("{0}-{1}-{2}".format(now.getYear(),
                now.getMonth() + 1,now.getDate()));

            if(nowDate.getTime() == lastLoginDate.getTime){
                loginBonusFlg = false;
            } else if(((nowDate.getTime() - lastLoginDate.getTime())/(3600 * 1000)) > 24){
                isInterrupt = true;
            }
       }

        if(loginBonusFlg){
            var count = CQ.Datastore.User.getContinueLoginCount;
            // check continue login count
            count++;

            if(continueLoginCount > 7 || isInterrupt){
                count = 1;
            }

            // set last login time to newest
            CQ.Datastore.User.setLastLoginTime(now);

            // set count this time
            CQ.Datastore.User.setContinueLoginCount(count);
        }

        return loginBonusFlg;
    }
}

CQ.App.register(CQ.LoginBonus);