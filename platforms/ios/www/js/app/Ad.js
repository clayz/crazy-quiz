CQ.Ad = {
    isInterstitialReady: false,

    ios: {
        admob: {
            banner: 'ca-app-pub-5274789268896837/3350296704',
            interstitial: 'ca-app-pub-5274789268896837/4768154306'
        }
    },

    android: {
        admob: {
            banner: 'ca-app-pub-5274789268896837/8148926306',
            interstitial: 'ca-app-pub-5274789268896837/7721620702'
        }
    },

    init: function() {
        if (!CQ.adMob) return;
        console.info('Initial admob banner.');

        this.addHomeBannerAd();
        this.addInterstitial();
    },

    addHomeBannerAd: function() {
        if (CQ.App.iOS()) {
            admobAd.initBanner(this.ios.admob.banner, admobAd.AD_SIZE.BANNER.width, admobAd.AD_SIZE.BANNER.height);
        } else if (CQ.App.android()) {
            admobAd.initBanner(this.android.admob.banner, admobAd.AD_SIZE.BANNER.width, admobAd.AD_SIZE.BANNER.height);
        }

        admobAd.showBanner(admobAd.AD_POSITION.BOTTOM_CENTER);
    },

    addInterstitial: function() {
        document.addEventListener(admobAd.AdEvent.onInterstitialReceive, CQ.Ad.onInterstitialReceive, false);

        if (CQ.App.iOS()) {
            admobAd.initInterstitial(this.ios.admob.interstitial);
        } else if (CQ.App.android()) {
            admobAd.initInterstitial(this.android.admob.interstitial);
        }

        admobAd.cacheInterstitial();
    },

    onInterstitialReceive: function(message) {
        //show Interstitial after receive or after game over
        console.info('OnInterstitialReceive: {0}'.format(message));
        CQ.Ad.isInterstitialReady = true;
    },

    showInterstitial: function() {
        if (CQ.Ad.isInterstitialReady) {
            console.info('Show interstitial advertising.');
            admobAd.showInterstitial();

            // reactive interstitial ad
            CQ.Ad.isInterstitialReady = false;
            CQ.Ad.addInterstitial();
        }
    }
};

CQ.App.register(CQ.Ad);