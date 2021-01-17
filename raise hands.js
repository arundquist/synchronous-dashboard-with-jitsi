const makeQueue=(queue, queuename, names, usertype, curIndex)=>
{
  var html = `<ul class="list-group">`;
  queue.forEach((r, i) => html += formatLi(queuename, r, names, usertype, curIndex));
  html += `</ul>`;
  return html;
}
funcs.push(makeQueue);

const formatLi=(queue, hand, names, usertype, curIndex)=>
{
  var date = new Date(hand.d).toLocaleTimeString();
  if (usertype == "instructor") {
    return `<li class="list-group-item"><button type="button" onClick="removeHand('${queue}','${hand.index}',${hand.d},1)">${names[hand.index]} ${date}
          <button type="button" onClick="removeHand('${queue}','${hand.index}',${hand.d},0)">unraise</button></button><button onClick="transfer('${queue}','${hand.index}', ${hand.d})">transfer</button></li>`;
  } else if (hand.index == curIndex) {
    return `<li class="list-group-item">${names[hand.index]} ${date}<button type="button" onClick="removeHand('${queue}','${hand.index}',${hand.d},0)">unraise</button>
                        <button onClick="transfer('${queue}','${hand.index}', ${hand.d})">transfer</button></li>`;
  } else {
    return `<li class="list-group-item">${names[hand.index]} ${date}</li>`;
  };
}
funcs.push(formatLi);

const drawQueue=(queuename)=>
{
  var api=instructor?apis["main"]:currentApi;
  var participants=api.getParticipantsInfo();
  var idList=participants.map(p=>p.participantId);
  var names={};
  var currentq=window[queuename];
  currentq=currentq.filter(h=>idList.includes(h.index));
  participants.forEach(n=>names[n.participantId]=n.displayName);
  var usertype=instructor?"instructor":"student";
  var curIndex=api.localID;
  document.getElementById(queuename + "listdiv").innerHTML = makeQueue(currentq, queuename, names, usertype, curIndex);
}
funcs.push(drawQueue);

const drawBoth=()=>
{
  drawQueue("newqueue");
  drawQueue("followupqueue");
}
funcs.push(drawBoth)

const raiseHand=(queuename)=>
{
  //        google.script.run.pusherRaise(queuename, curIndex);
  var d = new Date().getTime();
  var api=instructor?apis["main"]:currentApi;
  if (api.roomName != "main") return;
  sendEvent(api,{type:"raiseHand", payload:{ "queuename": queuename, "hand": { "index": index, "d": d }}});
  raiseHandClient(queuename,{"index":index,"d":d});
  // broadcast("raise", { "queuename": queuename, "hand": { "index": index, "d": d } });
}
funcs.push(raiseHand)

const raiseHandClient=(queuename, hand)=>
{
  window[queuename].push(hand);
  window[queuename].sort((a, b) => a.d - b.d);
  drawQueue(queuename);
}
funcs.push(raiseHandClient);

const removeHand=(queuename, index, d, byinstructor)=>
{
  var api=instructor?apis["main"]:currentApi;
  if (api.roomName != "main") return;
  // broadcast("remove", { "queuename": queuename, "hand": { "index": index, "d": d } });
  sendEvent(api,{type:"removeHand", payload:{ "queuename": queuename, "hand": { "index": index, "d": d }}});
  removeHandClient(queuename,{ "index": index, "d": d })
}
funcs.push(removeHand);

const removeHandClient=(queuename, hand)=>
{
  // here you need to find the index in the appropriate queue
  //        alert("made it");
  var index = window[queuename].findIndex(h => h.d == hand.d);
  //        var index = 0;
  if (index<0) return;
  window[queuename].splice(index, 1);
  drawQueue(queuename);
}
funcs.push(removeHandClient);

const transfer=(queuename, index, d)=>
{
  var api=instructor?apis["main"]:currentApi;
  if (api.roomName != "main") return;
  // broadcast("transfer", { "queuename": queuename, "hand": { "index": index, "d": d } });
  sendEvent(api,{type:"transferHand", payload:{ "queuename": queuename, "hand": { "index": index, "d": d }}});
  transferClient(queuename,{ "index": index, "d": d })
}
funcs.push(transfer);

const transferClient=(queuename, hand)=>
{
  if (queuename == "newqueue") {
    var other = "followupqueue";
  } else {
    var other = "newqueue";
  };
  // get proper index
  var index = window[queuename].findIndex(h => h.d == hand.d);
  if (index<0) return;
  var replace = window[queuename].splice(index, 1);
  window[other].push(replace[0]);
  window[other].sort((a, b) => a.d - b.d);
  drawQueue(queuename);
  drawQueue(other);
}
funcs.push(transferClient)
