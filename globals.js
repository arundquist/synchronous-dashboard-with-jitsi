////////////// YOU ONLY NEED TO CHANGE THE VARIABLES IN THIS BLOCK ///////////
var youremail="";
var drawingTemplate = ""; // google id of the blank drawing template
var drawingFolder = ""; // google id of the folder where all the drawings will go. You should share that folder with your students
var buttonNames=[1,2,3,4]; // you can have as many poll items as you like
var jitsiBaseName=""; // name of your jitsi meets. Make sure it's unique
//////////////////////////////////////////////////////////////////////////////



/// OTHER USEFUL GLOBAL VARIALBES (DON'T EDIT)////////////
var funcs=[];
var iFuncs=[];
var initialized=false;
var ss;
var data={};
var currentUserId=0;
var roster={};
var buttonList={};
buttonNames.forEach(b=>buttonList[b]={});
//////////////////////////////////////////////////////////

///// LOCAL GLOBALS //////////////////////////////
var api
var globals={currentUserId:currentUserId,
             data:data,
             domain: 'meet.jit.si',
             apis:{},
             currentApi: null,
             currentRoom: null,
             instructor: false,
             breakouts: {},
             drawUrls: {},
             mainDrawUrls: [],
             currentMainDraw: null,
             breakoutNames:[],
             currentBreakout: null,
             newqueue:[],
             followupqueue:[],
             index:null,
             divs:{},
             sliderList: {},
             buttonNames: buttonNames,
             buttonList: buttonList,
             allParticipants:[],
             optionsList:{},
             roomNameBase: jitsiBaseName,
             roster:{},
             ids:{},
             options: {
                        roomName: jitsiBaseName,
                        width: 100,
                        height: 100,
                        configOverwrite:{startAudioOnly: true,
                                         startWithAudioMuted: true,
                                         prejoinPageEnabled: false,
                                         startSilent: false},
                        interfaceConfigOverwrite:{TOOLBAR_BUTTONS:[]}
                      }
            };
