var sendEvent=(api,dataObject,who='')=>
{
  api.executeCommand('sendEndpointTextMessage', who, dataObject);
}
funcs.push(sendEvent);

const dealWithEvent=(data,api,room)=>
{
  var cleaned=JSON.parse(JSON.stringify(data.data.eventData.text));
  var senderId=data.data.senderInfo.id;
  var sender=api.getParticipantsInfo().find(f=>f.participantId==senderId).displayName;
  console.log(`Sender id is ${senderId} and name is ${sender}`);
  var type=cleaned.type;
  var payload=cleaned.payload;
  switch(type) {
    case "joinRoom":
      joinRoom(payload.room);
      break;
    case "chat":
      receiveChat(payload.chatId, payload.text);
      break;
    case "mainRoomUrl":
      addMainDraw(payload.url,payload.forced);
      break;
    case "raiseHand":
      raiseHandClient(payload.queuename, payload.hand);
      break;
    case "removeHand":
      removeHandClient(payload.queuename, payload.hand);
      break;
    case "transferHand":
      transferClient(payload.queuename, payload.hand)
      break;
    case "sliderUpdate":
      updateSlider(payload,senderId);
      break;
    case "buttonUpdate":
      updateButton(payload, senderId);
      break;
    default:
      alert("I don't know what to do with this event: "+type);
  }
}
funcs.push(dealWithEvent);

var joinRoom=(roomObject, resetOptions=false, toggle=false)=>
{
  var roomNumber=roomObject.roomNumber;
  if (currentApi) 
  {
    currentApi.executeCommand('hangup');
    var chatDivs=document.getElementById("chats");
    chatDivs.childNodes.forEach(node=>
    {
      var id=node.id;
      var [room, pid]=id.split("---");
      if (pid != "") chatDivs.removeChild(node);
    });
  }
  if (currentRoom) {
    var div=document.getElementById("jitsi"+currentRoom);
    var iframeElement=div.getElementsByTagName("iframe")[0];
    iframeElement.parentNode.removeChild(iframeElement);
    document.getElementById("meet"+currentRoom).style.display="none";
  }
  
  var divId="meet"+roomNumber;
  if (resetOptions || !optionsList[roomNumber])
  {
    var newOptions=JSON.parse(JSON.stringify(options));
  } else {
          var newOptions=JSON.parse(JSON.stringify(optionsList[roomNumber]));
         };
  newOptions.roomName=roomNameBase+divId;
  var newDiv=document.getElementById(divId);
  if (instructor && newDiv && !toggle) return;
  if (!newDiv)
  {
    newDiv=document.createElement("div");
    newDiv.id=divId;
    newDiv.className="col whole-room";
    document.getElementById("meets").appendChild(newDiv);
    var jitsidiv=document.createElement("div");
    jitsidiv.id="jitsi"+roomNumber;
    var jitsiControlDiv=document.createElement("div");
    var html=`<input type="checkbox" class="largerCheckbox" id="mic${roomNumber}" onchange="toggleMic(this, '${roomNumber}')">
        <label class="" for="mic${roomNumber}">microphone</label>`;
    jitsiControlDiv.innerHTML=html;
    var presentlistdiv=document.createElement("div");
    presentlistdiv.id="presentlist"+roomNumber;
    var drawdiv=document.createElement("div");
    drawdiv.id="drawContainer"+roomNumber;
    console.log(`url is ${roomObject.drawUrl}`);
    
    if (instructor)
    {
      var btndiv=document.createElement("div");
      var btn = document.createElement("BUTTON");
      btn.onclick=()=>toggleSilent(roomNumber);
      btn.innerHTML="toggle";
      btndiv.appendChild(btn);
    }
    if (instructor && roomNumber=="main")
    {
      var btn=document.createElement("BUTTON");
      btn.onclick=getNew;
      btn.innerHTML="whiteboard";
      btndiv.appendChild(btn);
      btn=document.createElement("BUTTON");
      btn.onclick=seeMine;
      btn.innerHTML="See Mine";
      btndiv.appendChild(btn);
    }
    var chatcontainer=makeDiv("","chatContainer"+roomNumber);
    // var chatdiv=makeChat(roomNumber,roomNumber+"---");
    if (roomNumber=="main") 
    {
      var urlListDiv=document.createElement("DIV");
      urlListDiv.id="urlsDiv";
      var sliderDiv=makeDiv("","sliderdiv");
      makeSlider(sliderDiv);
      var buttonDiv=makeDiv("","buttonsdiv");
      makeButtons(buttonDiv);
      var newqueueDivVar=makeDiv("","newqueuediv");
      //<button type="button" onClick="raiseHand('newqueue')">Raise hand for new topic</button>
      var btn=document.createElement("button");
      btn.onclick=()=>raiseHand('newqueue');
      btn.innerHTML="Raise hand for new topic";
      newqueueDivVar.appendChild(btn);
      var sp=makeDiv("","newqueuelistdiv");
      newqueueDivVar.appendChild(sp);
      var followupqueueDivVar=makeDiv("","followupqueuediv");
      var btn=document.createElement("button");
      btn.onclick=()=>raiseHand('followupqueue');
      btn.innerHTML="Raise hand for follow up";
      followupqueueDivVar.appendChild(btn);
      sp=makeDiv("","followupqueuelistdiv");
      followupqueueDivVar.appendChild(sp);
      
    }
    // always: jitsidiv, jitsiControlDiv, presentlistdiv, drawdiv, chatcontainer [[jitsidiv,[jitsiControlDiv,presentlistdiv]],[drawdiv,chatcontainer]]
    // main all: urlListDiv,sliderDiv, buttonDiv, newqueuedivVar,followupqueueDivVar
    // instructor always: btndiv 
    
    var divArray=[];
    if (instructor)
    {
      if (roomNumber=="main")
      {
        divArray=[jitsidiv,presentlistdiv,[sliderDiv,buttonDiv],[[jitsiControlDiv,chatcontainer],[followupqueueDivVar,newqueueDivVar],[btndiv,drawdiv, urlListDiv]]];
      } else {
          divArray=[jitsidiv,presentlistdiv,[[jitsiControlDiv,chatcontainer],[btndiv,drawdiv]]];
      }
    } else {
      if (roomNumber=="main")
      {
        divArray=[jitsidiv,presentlistdiv,[sliderDiv,buttonDiv],[[jitsiControlDiv,chatcontainer],[followupqueueDivVar,newqueueDivVar],[drawdiv, urlListDiv]]];
      } else {
        divArray=[jitsidiv,presentlistdiv,[[jitsiControlDiv,chatcontainer],drawdiv]];
      }
    }

    if (instructor && roomNumber != "main") newDiv.style.display="none";
    jitsidiv.style.display="none";
    makeRowsAndColumns(newDiv,divArray);
    makeChat(roomNumber,roomNumber+"---");
    if (roomNumber != "main") addDrawing(roomNumber, roomObject.drawUrl);
  }
  document.getElementById(`mic${roomNumber}`).checked = false;
  if (!jitsidiv) var jitsidiv=document.getElementById("jitsi"+roomNumber);
  newOptions.parentNode=jitsidiv;
  if (instructor && roomNumber != "main" && !toggle) newOptions.configOverwrite.startSilent=true;
  var api = new JitsiMeetExternalAPI(domain, newOptions);
  api.roomName=roomNumber;
  api.on("videoConferenceJoined", (e)=>{
                                        api.localID=e.id;
                                        index=e.id;
                                        showRoster(roomNumber);

                                        })
  api.on("participantJoined", (e)=>{
                                    showRoster(roomNumber);
                                    });
  api.on("participantLeft", (e)=>{
                                    showRoster(roomNumber);
                                    });
  api.on('endpointTextMessageReceived',(e)=>dealWithEvent(e,api,roomNumber));
  
  if (instructor) apis[roomNumber]=api;
  divs[roomNumber]=newDiv;
  updateMeetList();
  if (roomNumber=="main" && !instructor) showThisOne("main")
  if (!instructor) {
    currentApi=api;
    currentRoom=roomNumber;
    }
  optionsList[roomNumber]=newOptions;
}
funcs.push(joinRoom);

const toggleMic=(element, room)=>
{
  var setting=element.checked;
  var api=instructor?apis[room]:currentApi;
  api.executeCommand('toggleAudio');
}
funcs.push(toggleMic)

var toggleSilent=(roomNumber)=>
{
  apis[roomNumber].executeCommand('hangup');
  var div=document.getElementById("jitsi"+roomNumber);
  var iframeElement=div.getElementsByTagName("iframe")[0];
  iframeElement.parentNode.removeChild(iframeElement);
  optionsList[roomNumber].configOverwrite.startSilent=!optionsList[roomNumber].configOverwrite.startSilent; 
  joinRoom({roomNumber:roomNumber}, false, true)
}
funcs.push(toggleSilent);
