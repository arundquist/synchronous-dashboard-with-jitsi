var localInit=()=>
{
  options.parentNode=document.querySelector('#meet');
  options.userInfo={
                    email: myEmail,
                    displayName: myName
                   }
  joinRoom({roomNumber:"main"});

  
  
  
}
funcs.push(localInit);

var showMessage=(message)=>
{
  messages.innerHTML=JSON.stringify(message);
}
funcs.push(showMessage);
  

//var showRoster=()=>
//{
//  var presentList=Object.keys(ids).map(k=>ids[k]);
//  console.log(presentList);
//  var html=presentList.map(name=>name).join(', ');
//  present.innerHTML=html;
//  var all=Object.keys(roster);
//  var notPresentList=all.filter(a=>!presentList.includes(a));
//  notpresent.innerHTML=notPresentList.map(name=>name).join(', ');
//}
//funcs.push(showRoster);

var showRoster=(num)=>
{
  var api=apis[num];
  if (!api) api=currentApi;
  var presentList=api.getParticipantsInfo();
  var html=presentList.map(p=>{
                                var id=p.participantId;
                                var chatId=`${num}---${id}`;
                                return `<span onclick="makeChat('${num}: ${p.displayName}', '${chatId}')">${p.displayName}</span>`}).join(', ');
  document.getElementById("presentlist"+num).innerHTML=html;
}
funcs.push(showRoster);

const removeElementsByClass=(className) =>
{
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
funcs.push(removeElementsByClass);

const bd=(element,size=1)=>
{
  return {el:element, size:size};
}
funcs.push(bd)

const makeDiv=(cl,id="")=>
{
  var div=document.createElement("div");
  div.id=id;
  div.className+=cl;
  return div;
}
funcs.push(makeDiv)

const makeRowsAndColumns=(parent, list)=>
{
  var pclass=parent.className;
  var c="row";
  if (pclass.includes("row") || pclass.includes("col"))
  {
    if (pclass.includes("row"))
    {
      c="col";
    }
  }
  
  list.forEach(l=>
  {
    if (!Array.isArray(l))
    {
      l.className+=c;
      parent.appendChild(l);
    } else {
      var par=makeDiv(c);
      parent.appendChild(par);
      makeRowsAndColumns(par,l);
    }

  })
}
funcs.push(makeRowsAndColumns)

const updateMeetList=()=>
{
  var html=Object.keys(divs).map(key=>
  {
    var h=`<span onclick="showThisOne('${key}')">${key}</span>`;
    return h;
  }).join(', ');
  document.getElementById("meetlist").innerHTML=html;
}
funcs.push(updateMeetList);

const showThisOne=(room)=>
{
  Object.keys(divs).forEach(key=>
  {
    if (key==room) 
    {
      divs[key].style.display="block";
    } else {
      divs[key].style.display="none";
    }
  })
}
funcs.push(showThisOne)

