function doGet(e) {
  init();
  globals.roster=roster;
  
  var email=Session.getActiveUser().getEmail();
  if (email==youremail)
  {
    if (e.parameter.email) {
      email=e.parameter.email
      } else {
        globals.instructor=true;
        }
  }
  if (!email) {
    var id=e.parameter.id;
    if (!id) return HtmlService.createHtmlOutput("sorry, not a recognized login");
    var u=data["roster"].find(f=>MD5(f[1])==id);
    if (!u) return HtmlService.createHtmlOutput("sorry, id not in our system");
    email=u[1];
  }
  
  var currentUser=data["roster"].find(f=>f[1]==email);
  if (!currentUser) return HtmlService.createHtmlOutput("sorry, not a recognized login");
  var instructorName=data["roster"].find(f=>f[1]==youremail)[0];
  globals.instructorName=instructorName;
  globals.myEmail=currentUser[1];
  if(globals.instructor) globals.mainDrawUrl=null;
  globals.myName=currentUser[0];
  //globals.currentUserId=currentUserId;
  if (globals.instructor) funcs=funcs.concat(iFuncs);
  var t=HtmlService.createTemplateFromFile("main");
  t.instructor=globals.instructor;
  t.globals=globals;
  t.funcs=funcs;
  t.funcnames=t.funcs.map(f=>f.name);
  return t.evaluate();
}

function ctest()
{
  init();
  Logger.log(data["roster"][currentUserId]);
}
