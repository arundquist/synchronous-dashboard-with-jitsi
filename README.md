# synchronous-dashboard-with-jitsi
A virtual meeting platform without video using jitsi as both audio and data channel.
# Overview
![Screenshot](https://github.com/arundquist/synchronous-dashboard-with-jitsi/blob/main/Screenshot%202021-01-18%20at%208.25.26%20PM.png)

[Here's a Loom video walkthrough](https://www.loom.com/share/be7922852a774b9590d42d3093ae3120)
## Main features:
* No video (on purpose, see below about using screen real estate)
* Jitsi-based audio
* Jitsi-based data channel (to pass all the things listed below)
* Breakout rooms
* Chat (room chat and private chats with anyone else in the room)
* Hand raising queues (both for follow up questions and new topics)
* Whiteboards (multiple in the "main" room and one each for the breakout rooms)
* Polling
* Understanding checks using a slider (or input range)

## Why
As my school went mostly online last spring, I started collecting my thoughts about what I really wish I had for an online platform to work with my students. I quickly realized that my dream of all videos on and fully interactive students 1) wasn't as good as I thought, and 2) didn't happen because many students couldn't or wouldn't make use of video. I began to realize that video is the dominant feature in things like Zoom and Google Meets. It gobbles up nearly all of the screen space and is responsible for nearly all the bandwidth. So I started to consider what I might be able to do if I just stopped using video.

So I set out looking for ways to build in collaborative tools like whiteboards and understanding checks that would make better use of screen space. This is the result.

[Here's a blog post with more of my philosophy about these sorts of tools.](https://arundquist.wordpress.com/2021/01/18/synchronous-dashboard-with-audio-and-breakouts/)

# Technologies used
## Jitsi
[Jitsi](https://jitsi.org/) is an open source-themed project seeking to provide video and audio conferencing. It provides an API that I use to launch meetings and pass data.

Once you've connected to a jitsi meet, you generate a variable normally called "api". Sending data is as easy as
```javascript
api.executeCommand('sendEndpointTextMessage', who, dataObject);
```
where "who" is the id of the user you're sending it to (send an empty string to send it to everyone in the room) and "dataObject" is any valid javascript object. The user receiving the command can then:
```javascript
var cleaned=JSON.parse(JSON.stringify(data.data.eventData.text)); // yes really
var senderId=data.data.senderInfo.id;
var sender=api.getParticipantsInfo().find(f=>f.participantId==senderId).displayName;
var type=cleaned.type;
var payload=cleaned.payload;
```
then I just write functions for every type of event that comes in.
## Google Apps Script
My school is a Google school so I can assume that all my students have a google account (tied to their school email). This lets me set up all these tools on Google's servers using google apps script. The two major tools that I'm using are a protected spreadsheet with the roster that allows for user authentication and dynamically generating new [Google Drawings](#google-drawings).

I taught a class in the summer of 2020 on google apps script web development. [Here's the skeleton text I wrote for that class](https://en.wikibooks.org/wiki/Web_App_Development_with_Google_Apps_Script).

## Google Drawings
Google has two major collaborative drawing applications they support. Many teachers have used Jamboard starting during the pandemic, including me. I love it, but unfortunately you can't embed one in an iframe. However, the second, older one is Google Drawings. These are the drawings you can add to a google doc, but they can also be stand alone. They allow for lines, scribbles, text, hyperlinks(!), and images. When an instructor launches a whiteboard the code queries the google server to generate a copy of my blank template and then return the url. Then I just put that url in an iframe and we're done!

# Installation
## Caveats
This will really only work if you're at a google school. I've built a work around to allow for people who aren't at my school (see the top ~20 lines of code.js) but all those folks need to have google accounts to see the whiteboards.

Right now this is set to use the public Jitsi server. That's not scaleable. I'll eventually put it on my own server and you might have to do that too. Luckily it's not using video so it's really not the bandwidth hog something like Zoom is.

Note that [the directions on this page](https://www.brring.com/2020/04/04/setting-up-a-jitsi-server-in-less-than-15-minutes/) are pretty easy to follow. I think it really did only take me 15 minutes to shift from jitsi's free server to my own.
## Set up Spreadsheet
You just need one tab: "roster" that has (unique!) names in the first column and emails in the second column. Feel free to [use this template](https://docs.google.com/spreadsheets/d/1Gh3WWlPPajz8gvFD-MNHeF80u81-xGSPRp2vnWTF0T4/edit?usp=sharing) as a start (which also has all the code in it ready to go!).

I've uploaded all the javascript and html into this repository so you can just copy and paste it into a new script tied to your spreadsheet (especially if it seems the code hasn't come along with your "make a copy" of my template).

## Deploy
* Update the top lines in "globals.gs" with your email and google ids of your drawing template and folder
* Go to "Publish -> Deploy as web app" and make a new version, deciding who has access.
    * the first time this will ask you to review the permissions
    
# Lessons learned
## Using google.script.run as a promise
I googled around a lot and found differnet versions of this. [This page](https://gist.github.com/shrugs/44cfb94faa7f09bcd9cb) has most of it but you need to heed the second comment. Here's my implementation:
```javascript
const scriptRunPromise = ()=>
{
  const gs = {};
  
  // google.script.run contains doSomething() methods at runtime.
  // Object.keys(goog.sscript.run) returns array of method names.
  const keys = Object.keys(google.script.run);
  
  // for each key, i.e. method name...
  for (let i=0; i < keys.length; i++) {
    // assign the function to gs.doSomething() which returns...
    gs[keys[i]] = (function(key) {
      // a function which accepts arbitrary args and returns...
      return function(...args) {
        // a promise that executes ...
        return new Promise(function(resolve, reject) {
          google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)[key]
            .apply(google.script.run, args);
        });
      };
    })(keys[i]);
  }
  return gs;
  // gs.doSomething() returns a promise that will execulte 
  // google.script.run.withSuccessHandler(...).withFailureHandler(...).doSomething()
}
```

Here's the code I use to get the url for a new Google Drawing and send it to all participants:
```javascript
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
```

I find this all so much easier than the usual `google.script.run.withSuccessHandler` approach, especially if you need to get the async part right.

## Editing javascript in google apps script
I used to put all my client-side code in the main.html document. But that was a hassle in their IDE (even the new awesome one) because it didn't catch any syntax errors, because it only looks for html errors. So I really wanted to find a way to use their IDE but to create javascript code that went on the client side.

So I finally found a way. If I want to write a function that will work on the client, I do something like this:
```javascript
const functionName=(arg, list)=>
{
   doCoolStuff;
}
funcs.push(functionName)
```

That works as long as in your globals area you add `var funcs=[]` and when you declare your html template you do this:
```javascript
var t=HtmlService.createTemplateFromFile("main");
t.funcs=funcs;
t.funcnames=t.funcs.map(f=>f.name);
return t.evaluate();
```
and finally in your "main.html" you add a script section that does this:
```javascript
var funcnames=<?!= JSON.stringify(funcnames) ?>;
var funcs=[<?!= funcs ?>];
funcnames.forEach((fn,i)=>window[fn]=funcs[i]);
```

Similarly you can have global variables by adding `t.globals` and then adding this to your "main.html"
```javascript
var globals = <?!= JSON.stringify(globals) ?>;
Object.keys(globals).forEach(key=>window[key]=globals[key]);
```

## Placing divs in bootstrap rows and columns
I wasn't sure where I wanted to place all my differnet tools but I wrote some code that let me first just put all of them in their various divs and then place them however I wanted in bootstrap rows and columns.

Here's the code:
```javascript
const makeDiv=(cl,id="")=>
{
  var div=document.createElement("div");
  div.id=id;
  div.className+=cl;
  return div;
}

const makeRowsAndColumns=(parent, list)=>
{
  var pclass=parent.className;
  var c="row";
  if (pclass.includes("row"))
  {
    // var num=list.length;
    // var width=Math.floor(parentWidth/num);
    c="col"; //-md-"+width;
  }
  list.forEach(l=>
  {
    if (!Array.isArray(l))
    {
      if (c=="row")
      {
        var singleCol=makeDiv("row");
        l.className+="col";
        singleCol.appendChild(l);
        parent.appendChild(singleCol);
      } else {
        l.className+=c;
        parent.appendChild(l);
      }
      
    } else {
      var par=makeDiv(c);
      par.className+=" major-element";
      parent.appendChild(par);
      makeRowsAndColumns(par,l);
    }

  })
}
```

Here's how it works. Let's say you want something like:
```
a                 b                     c
      d                      e
f                 g                     h/i
```
where each letter is a div and h/i just means two row divs in that third column. You would run 
```javascript
makeRowsAndColumns(parentDiv, [[a,b,c], [d,e], [f,g,[h,i]]])
```
and you're done!


