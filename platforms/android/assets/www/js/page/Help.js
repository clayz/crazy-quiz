CQ.Page.Help = {
    name: 'help',

    init: function() {
        CQ.Log.debug('Initial help page');
        this.initCommon({ header: true, back: true });

        $(CQ.Id.Help.$TO_FACEBOOK).click(CQ.Page.Help.clickToFacebook);
//        $(CQ.Id.Help.$TO_QUESTION).click(CQ.Page.Help.clickQuestion);
//        $(CQ.Id.Help.$TO_RULE).click(CQ.Page.Help.clickRule);
//        $(CQ.Id.Help.$TO_ENQUIRY).click(CQ.Page.Help.clickEnquiry);
    },

    load: function() {
    },

    clickToFacebook: function() {
        if (CQ.App.iOS()) {
            document.location = "fb://profile/265923220277093";
            setTimeout(function() {
                window.open("http://www.facebook.com/nekyou.quiz", "_system");
            }, 300);
        } else {
            window.open("http://www.facebook.com/nekyou.quiz", "_system");
        }
    }

    /*
     clickGuide: function() {
     CQ.Audio.Button.play();
     CQ.Page.Help.open(CQ.Page.HelpGuide);
     },

     clickQuestion: function() {
     CQ.Audio.Button.play();
     CQ.Page.Help.open(CQ.Page.HelpQuestion);
     },

     clickRule: function() {
     CQ.Audio.Button.play();
     CQ.Page.Help.open(CQ.Page.HelpRule);
     },

     clickEnquiry: function() {
     CQ.Audio.Button.play();
     CQ.Page.Help.open(CQ.Page.HelpEnquiry);
     }
     */
};

/*
 CQ.Page.HelpGuide = {
 name: 'helpGuide',

 init: function() {
 CQ.Log.debug('Initial help guide page');
 this.initCommon({ header: true, back: true });
 },

 load: function(params) {
 this.params = params;
 return { gaPageName: 'Help - Guide' }
 }
 };

 CQ.Page.HelpQuestion = {
 name: 'helpQuestion',

 init: function() {
 CQ.Log.debug('Initial help question page');
 this.initCommon({ header: true, back: true });
 },

 load: function(params) {
 this.params = params;
 return { gaPageName: 'Help - Question' }
 }
 };

 CQ.Page.HelpRule = {
 name: 'helpRule',

 init: function() {
 CQ.Log.debug('Initial help rule page');
 this.initCommon({ header: true, back: true });
 },

 load: function(params) {
 this.params = params;
 return { gaPageName: 'Help - Rule' }
 }
 };

 CQ.Page.HelpEnquiry = {
 name: 'helpEnquiry',

 init: function() {
 CQ.Log.debug('Initial help enquiry page');
 this.initCommon({ header: true, back: true });
 },

 load: function(params) {
 this.params = params;
 return { gaPageName: 'Help - Enquiry' }
 }
 };
 */

CQ.App.inherits(CQ.Page.Help, CQ.Page);
//CQ.App.inherits(CQ.Page.HelpGuide, CQ.Page);
//CQ.App.inherits(CQ.Page.HelpQuestion, CQ.Page);
//CQ.App.inherits(CQ.Page.HelpRule, CQ.Page);
//CQ.App.inherits(CQ.Page.HelpEnquiry, CQ.Page);

CQ.App.register(CQ.Page.Help);
//CQ.App.register(CQ.Page.HelpGuide);
//CQ.App.register(CQ.Page.HelpQuestion);
//CQ.App.register(CQ.Page.HelpRule);
//CQ.App.register(CQ.Page.HelpEnquiry);