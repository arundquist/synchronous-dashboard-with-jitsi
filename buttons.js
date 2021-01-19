const makeButtons=(element)=>
{
  
  buttonNames.forEach(b=>singleButton(b,element));
}
funcs.push(makeButtons)

const singleButton=(input,container)=>
{
  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `b${input}`;
  checkbox.className="largerCheckbox";
  checkbox.name = input;
  checkbox.onchange=function() 
  {
    var api=instructor?apis["main"]:currentApi;
    if (api.roomName != "main") return;
    var participants=api.getParticipantsInfo();
    var inst=participants.find(f=>f.displayName==instructorName);
    if (!inst) return;
    var instID=inst.participantId;
    var value=this.checked?1:0;
    sendEvent(api,{type:"buttonUpdate", payload:{senderId:api.localId, senderName:myName, button:input, value:value}},instID);
  } 
 
  var label = document.createElement('label')
  // label.htmlFor = `b${input}`;
  label.appendChild(document.createTextNode(input));
  
  var br=document.createElement("br");
  label.appendChild(br);
  label.appendChild(checkbox);

  // container.appendChild(checkbox);
  container.appendChild(label);
  // container.appendChild(br);

  if (instructor)
  {
    var avg=document.createElement("span");
    avg.id="buttonAvg"+input;
    container.appendChild(avg);
  }
}
funcs.push(singleButton)

const updateButton=(payload, senderId)=>
{
  buttonList[payload.button][senderId]=payload.value;
  var participants=apis["main"].getParticipantsInfo();
  var idList=participants.map(p=>p.participantId);
  var avgs=buttonNames.map(button=>Object.keys(buttonList[button]).reduce((a,b)=>a+idList.includes(b)?buttonList[button][b]:0,0));
  buttonNames.forEach((button,i)=>document.getElementById("buttonAvg"+button).innerHTML=avgs[i]);
}
iFuncs.push(updateButton)
