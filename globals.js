////////////// YOU ONLY NEED TO CHANGE THE VARIABLES IN THIS BLOCK ///////////
var youremail="YOUR EMAIL HERE";
var drawingTemplate = "GOOGLE ID OF GOOGLE DRAWING TEMPLATE";
var drawingFolder = "GOOGLE ID OF DRIVE FOLDER";
var buttonNames=[1,2,3,4]; // feel free to change or add
var roomBaseName="UNIQUE NAME FOR YOUR CLASS";
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
             roomNameBase: roomBaseName,
             roster:{},
             ids:{},
             options: {
                        roomName: roomBaseName,
                        width: 100,
                        height: 100,
                        configOverwrite:{startAudioOnly: true,
                                         startWithAudioMuted: true,
                                         prejoinPageEnabled: false,
                                         startSilent: false},
                        interfaceConfigOverwrite:{TOOLBAR_BUTTONS:[]}
                      }
            };
