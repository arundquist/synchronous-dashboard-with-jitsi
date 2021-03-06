const makeSlider=(element)=>
{
  var slider = document.createElement('input');
  slider.id = "understanding";
  slider.className="slider";
  slider.onmouseup = function() 
  {
    var api=instructor?apis["main"]:currentApi;
    if (api.roomName != "main") return;
    var participants=api.getParticipantsInfo();
    var inst=participants.find(f=>f.displayName==instructorName);
    if (!inst) return;
    var instID=inst.participantId;
    sendEvent(api,{type:"sliderUpdate", payload:{senderId:api.localId, senderName:myName, value:this.value}},instID);
  } 
  slider.type = 'range';
  slider.min = 0;
  slider.max = 100;
  slider.value = 50;
  slider.step = 1;
  element.appendChild(slider);
  if (instructor)
  {
    var avg=document.createElement("span");
    avg.id="sliderAvg";
    element.appendChild(avg);
  }
}
funcs.push(makeSlider)

const updateSlider=(payload,senderId)=>
{
  sliderList[senderId]=payload.value;
  var participants=apis["main"].getParticipantsInfo();
  var idList=participants.map(p=>p.participantId);
  Object.keys(sliderList).forEach(key=>
  {
    if(!idList.includes(key))
    {
      delete sliderList[key];
    }
  })
  var avg=Object.keys(sliderList).reduce((a,b)=>a+Number(sliderList[b]),0)/Object.keys(sliderList).length;
  document.getElementById("sliderAvg").innerHTML=avg;
  document.getElementById("understanding").value=avg;
}
iFuncs.push(updateSlider)

