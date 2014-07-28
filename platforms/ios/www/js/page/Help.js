CQ.Page.Help = {
    name: 'help',

    init: function() {
        console.info('Initial help page');
        this.initCommon({ header: true, back: true });
        $(CQ.Id.Help.$TO_GUIDE).click(CQ.Page.Help.clickGuide);
        $(CQ.Id.Help.$TO_QUESTION).click(CQ.Page.Help.clickQuestion);
        $(CQ.Id.Help.$TO_RULE).click(CQ.Page.Help.clickRule);
        $(CQ.Id.Help.$TO_ENQUIRY).click(CQ.Page.Help.clickEnquiry);
    },

    load: function() {
    },
    
    clickGuide: function() {
        CQ.Audio.Button.play();
        CQ.Page.open(CQ.Page.Help_Guide);
    },
    
    clickQuestion: function() {
        CQ.Audio.Button.play();
        CQ.Page.open(CQ.Page.Help_Question);
    },
    
    clickRule: function() {
        CQ.Audio.Button.play();
        CQ.Page.open(CQ.Page.Help_Rule);
    },
    
    clickEnquiry: function() {
        CQ.Audio.Button.play();
        CQ.Page.open(CQ.Page.Help_Enquiry);
    }
};

CQ.Page.Help_Guide = {
    name: 'help-guide',
    params: {from: CQ.Id.Main.$HELP},
    init: function() {
        console.info('Initial help guide page');
        this.initCommon({ header: true, back: true });
    },
    
    load: function() {
    }
};

CQ.Page.Help_Question = {
    name: 'help-question',
    init: function() {
        console.info('Initial help question page');
        this.initCommon({ header: true, back: true });
    },
    
    load: function() {
    }
};

CQ.Page.Help_Rule = {
    name: 'help-rule',
    init: function() {
        console.info('Initial help rule page');
        this.initCommon({ header: true, back: true });
    },
    
    load: function() {
    }
};

CQ.Page.Help_Enquiry = {
    name: 'help-enquiry',
    init: function() {
        console.info('Initial help enquiry page');
        this.initCommon({ header: true, back: true });
    },
    
    load: function() {
    }
};

CQ.App.inherits(CQ.Page.Help, CQ.Page);
CQ.App.inherits(CQ.Page.Help_Guide, CQ.Page);
CQ.App.inherits(CQ.Page.Help_Question, CQ.Page);
CQ.App.inherits(CQ.Page.Help_Rule, CQ.Page);
CQ.App.inherits(CQ.Page.Help_Enquiry, CQ.Page);

CQ.App.register(CQ.Page.Help);
CQ.App.register(CQ.Page.Help_Guide);
CQ.App.register(CQ.Page.Help_Question);
CQ.App.register(CQ.Page.Help_Rule);
CQ.App.register(CQ.Page.Help_Enquiry);