function newDrawings(rooms)
{
  var original=DriveApp.getFileById(drawingTemplate);
  var folder=DriveApp.getFolderById(drawingFolder);
  var d=new Date().toLocaleString();
  var urls=rooms.map(room=>
  {
    var name=`${globals.roomNameBase} ${room} ${d}`;
    var drawing=original.makeCopy(name,folder);
    return drawing.getUrl();
  })
  return urls;
}



const addDrawing=(room,drawUrl)=>
{
  if (room=="main")
  {
    addMainDraw(drawUrl);
    return;
  }
  var el=document.getElementById("draw"+room);
  if (el) return;
  var drawDiv=document.createElement("div");
  drawDiv.id="draw"+room;
  var html=`<iframe src="${drawUrl}&rm=embedded" scrolling="auto" width="600" height="500"></iframe>`;
  if (instructor)
  {
    html+=`<button onclick="grabBreakoutWhiteboard('${drawUrl}')">to main</button>`;
  }
  drawDiv.innerHTML=html;
  var newDiv=document.getElementById("drawContainer"+room);
  console.log("right before appendChild in add Drawing");
  if (!newDiv) console.log("newDiv doesn't exist");
  newDiv.appendChild(drawDiv);
}
funcs.push(addDrawing);

function drawTest()
{
  console.log("starting");
  var urls=newDrawing(["test"]);
  console.log(urls);
}

const grabBreakoutWhiteboard=(url)=>
{
  newUrl=url+"&rm=embedded";
  addMainDraw(newUrl);
  sendEvent(apis["main"],{type:"mainRoomUrl", payload:{url:newUrl}});
}
iFuncs.push(grabBreakoutWhiteboard)

const getNew=async () =>
{
  try
  {
    var newUrl=await scriptRunPromise().newDrawings(["main"]);
    newUrl=newUrl[0]+"&rm=embedded";
    addMainDraw(newUrl);
    sendEvent(apis["main"],{type:"mainRoomUrl", payload:{url:newUrl}});
  } catch(err) {
    alert(err); // TypeError: failed to fetch
  }
}
iFuncs.push(getNew)

const addMainDraw=(url,forced=false)=>
{
  if (forced)
  {
    var i=mainDrawUrls.indexOf(url);
    console.log(i);
    if (i>=0) {
      change(i);
      return;
    }
  }
  var newdiv=document.createElement("DIV");
  var num=mainDrawUrls.length;
  newdiv.id="div"+num;
  newdiv.innerHTML=`<iframe src="${url}" scrolling="auto" width="600" height="500"></iframe>`;
  var mainDrawDiv=document.getElementById("drawmain");
  if (!mainDrawDiv)
  {
    mainDrawDiv=document.createElement("DIV");
    mainDrawDiv.id="drawmain";
    document.getElementById("drawContainermain").appendChild(mainDrawDiv);
  }
  mainDrawDiv.appendChild(newdiv);
  mainDrawUrls.forEach((u,i)=>
  {
    document.getElementById("div"+i).style.display="none"
  })
  
  currentMainDraw=url;
  mainDrawUrls.push(url);
  showOthers();
}
funcs.push(addMainDraw)

const showOthers=()=>
{
  var div=document.getElementById("urlsDiv");
  var html=mainDrawUrls.map((u,i)=>
  {
    var h="";
    if(u!=currentMainDraw) 
    {
      h+=`<span onclick="change('${i}')">${i}</span>`;
    } else {
      h+=`<b>${i}</b>`
    }
    return h;
  }).join(', ');
  div.innerHTML=html;
}
funcs.push(showOthers)

const seeMine=()=>
{
  sendEvent(apis["main"],{type:"mainRoomUrl", payload:{url:currentMainDraw, forced:true}});
}
iFuncs.push(seeMine)

const change=(i)=>
{
  mainDrawUrls.forEach((u,j)=>
  {
    if (j==i)
    {
      document.getElementById("div"+j).style.display="block";
    } else {
      document.getElementById("div"+j).style.display="none";
    }
  })
  currentMainDraw=mainDrawUrls[i];
  showOthers();
}
funcs.push(change)
