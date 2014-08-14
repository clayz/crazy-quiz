CQ.Page.Help = {
    name: 'help',

    init: function() {
        console.info('Initial help page');
        this.initCommon({ header: true, back: true });

//        $(CQ.Id.Help.$TO_GUIDE).click(CQ.Page.Help.clickGuide);
//        $(CQ.Id.Help.$TO_QUESTION).click(CQ.Page.Help.clickQuestion);
//        $(CQ.Id.Help.$TO_RULE).click(CQ.Page.Help.clickRule);
//        $(CQ.Id.Help.$TO_ENQUIRY).click(CQ.Page.Help.clickEnquiry);
    },

    load: function() {
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
 console.info('Initial help guide page');
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
 console.info('Initial help question page');
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
 console.info('Initial help rule page');
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
 console.info('Initial help enquiry page');
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