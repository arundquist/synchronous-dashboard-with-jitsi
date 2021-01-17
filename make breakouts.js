// first get all students in any api
const getAllStudents=()=>
{
  allParticipants=Object.keys(apis).map(key=>{
                                    var a=apis[key];
                                    var curParts=a.getParticipantsInfo();
                                    curParts.forEach(cp=>{
                                                          cp.breakout="main";
                                                          cp.api=a});
                                    return curParts
                                   }).flat().filter(a2=>a2.displayName != myName);
}
iFuncs.push(getAllStudents);

const formatParticipants=()=>
{
  if (allParticipants.length==0) getAllStudents();
  document.getElementById("breakoutListmain").innerHTML=""
  breakoutNames.forEach(b=>document.getElementById("breakoutList"+b).innerHTML="");
  breakouts={};
  allParticipants.forEach((s,i)=>
  {
    var html=`<span onclick="addToBreakout(${i},'${s.breakout}')">${s.displayName}</span>`;
    if (!breakouts[s.breakout])
    {
      breakouts[s.breakout]=[html];
    } else {breakouts[s.breakout].push(html);
          }
  });
  // you need to make sure that any that are empty are cleared out
  Object.keys(breakouts).forEach(b=>
  {
    var html=breakouts[b].join(', ');
    document.getElementById("breakoutList"+b).innerHTML=html;
  });

}
iFuncs.push(formatParticipants);

const addToBreakout=(i,room)=>
{
  if (room == "main") {
    if (!currentBreakout) return;
    allParticipants[i].breakout=currentBreakout;
  } else {
    allParticipants[i].breakout="main";
    }
  formatParticipants();
  
}
iFuncs.push(addToBreakout);

const newBreakout=(name=null)=>
{
  var newName="";
  if (name==null) {
    var num=breakoutNames.length+1;
    newName="breakout"+num;
  } else {
    newName=name;
    }
  breakoutNames.push(newName);
  console.log(breakoutNames);
  currentBreakout=newName;
  var newDiv=document.createElement('div');
  newDiv.id="breakoutDiv"+newName;
  newDiv.className="col bo";
  var title=document.createElement('H3');
  var titleText=document.createTextNode(newName);
  title.appendChild(titleText);
  title.onclick=()=>currentBreakout=newName;
  var list=document.createElement('p');
  list.id="breakoutList"+newName;
  newDiv.appendChild(title);
  newDiv.appendChild(list);
  document.getElementById("breakouts").appendChild(newDiv);
  formatParticipants();
}
iFuncs.push(newBreakout);

const launchBreakouts= async ()=>
{
  if (allParticipants.length==0) {alert("no participants"); return};
  var missingUrls=[];
  console.log("made it here");
  console.log(breakoutNames)
  breakoutNames.forEach(b=>
  {
    if (!drawUrls[b])
    {
      missingUrls.push(b)
    }
  })
  if (missingUrls.length>0)
  {
    console.log(missingUrls);
    try
    {
      var newUrls=await scriptRunPromise().newDrawings(missingUrls);
    } catch(err) {
    alert(err); // TypeError: failed to fetch
    } 
    missingUrls.forEach((n,i)=>drawUrls[n]=newUrls[i]);
  }
  allParticipants.forEach(p=>
  {
    p.api.executeCommand('sendEndpointTextMessage', p.participantId, {type:"joinRoom", payload:{room:{roomNumber:p.breakout, drawUrl:drawUrls[p.breakout]}}});
  })
  breakoutNames.forEach(n=>joinRoom({roomNumber:n, drawUrl:drawUrls[n]}));
}
iFuncs.push(launchBreakouts);

const bringBackAll=()=>
{
  var allapis=Object.keys(apis).map(key=>apis[key]).filter(f=>f!="main");
  allapis.forEach(a=>sendEvent(a,{type:"joinRoom",payload:{room:{roomNumber:"main"}}}));
  allParticipants=[];
  breakouts={};
  breakoutNames=[];
  removeElementsByClass("bo");
}
iFuncs.push(bringBackAll);
  


  
