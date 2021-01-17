// need to make a div for each chat
// including rooms and individuals
const makeChat=(title, id)=>
{
  var [room,pid]=id.split("---");
  var div=document.getElementById(id);
  if (div) {
            div.style.display="block";
            return div;
            }
  div=document.createElement("DIV");
  div.id=id;
  // div.className="scr";
  var extra="";
  if (pid!="") extra=`<button onclick="closePrivateChat('${id}')">close</button><br/>`;
  var tmp=document.createElement("h3");
  tmp.innerHTML=title+extra;
  div.appendChild(tmp);
  tmp=document.createElement("textarea");
  tmp.id=`ta${id}`;
  tmp.addEventListener("keyup", function(event) 
  {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById(`button${id}`).click();
    }
  });
  div.appendChild(tmp);
  tmp=document.createElement("button");
  tmp.onclick=()=>{sendChat(room,pid)};
  tmp.id=`button${id}`;
  tmp.innerHTML="send";
  div.appendChild(tmp);
  if (instructor && id=="main---")
  {
    tmp=document.createElement("button");
    tmp.onclick=()=>{sendChatToAll()};
    tmp.innerHTML="send to all";
    div.appendChild(tmp);
  }
  tmp=document.createElement('div');
  tmp.className="subscr";
  // tmp.className="overflow-auto";
  tmp.id=`p${id}`;
  div.appendChild(tmp);
  if (pid!="")
  {
    document.getElementById("chats").appendChild(div)
  } else {
    document.getElementById("chatContainer"+room).appendChild(div);
  }
  return div;
}
funcs.push(makeChat);

const closePrivateChat=(id)=>
{
  document.getElementById(id).style.display="none";
}
funcs.push(closePrivateChat)

const sendChat=(room,id)=>
{
  if (!instructor && room != currentRoom) return;
  var api=instructor?apis[room]:currentApi;
  var chatId=`${room}---${id}`;
  var ta=document.getElementById("ta"+chatId);

  var otherId=(id=="")?"":api.localID;
  var text=ta.value;
  var chatText=document.getElementById("p"+chatId);
  chatText.innerHTML=`<b>${myName}</b>: `+text+"<br/>"+chatText.innerHTML;
  sendEvent(api,{type:"chat",payload:{chatId:`${room}---${otherId}`,
                                      text:`<b>${myName}</b>: ${text}`}},id)
  ta.value="";
}
funcs.push(sendChat);

const sendChatToAll=()=>
{
  var ta=document.getElementById("tamain---");
  var text=ta.value;
  var chatText=document.getElementById("pmain---");
  chatText.innerHTML="TO ALL: "+text+"<br/>"+chatText.innerHTML;
  var otherApis=Object.keys(apis).map(a=>apis[a]).filter(a=>a.roomName!="main");
  if (otherApis.length==0) return;
  otherApis.forEach(api=>sendEvent(api,{type:"chat",payload:{chatId:`${api.roomName}---`,
                                      text:`<b>${myName}</b>: ${text}`}}))
  ta.value="";
}
iFuncs.push(sendChatToAll);

const receiveChat=(chatId, text)=>
{
  var [room,id]=chatId.split("---");
  console.log("chatID is "+chatId);
  var div=document.getElementById(chatId);
  if (!div)
  {
    var api=instructor?apis[room]:currentApi;
    var otherPerson=api.getParticipantsInfo().find(f=>f.participantId==id);
    var title=`${room}: ${otherPerson.displayName}`;
    div=makeChat(title,chatId);
  }
  div.style.display="block";
  var chatText=document.getElementById("p"+chatId);
  chatText.innerHTML=text+"<br/>"+chatText.innerHTML;
}
funcs.push(receiveChat);



function chatTest()
{
  var text="slfkjds-";
  var [first,second]=text.split("-");
  console.log([first,second]);
}
  
    
    
