# synchronous-dashboard-with-jitsi
A virtual meeting platform without video using jitsi as both audio and data channel.
# Overview
![Screenshot](https://github.com/arundquist/synchronous-dashboard-with-jitsi/blob/main/Screenshot%202021-01-16%20at%208.26.52%20PM.png)

[Here's a Loom video walkthrough](https://www.loom.com/share/83d256d8c6434d60a416819e08be84c9)
Main features:
* No video (on purpose, see below about using screen real estate)
* Jitsi-based audio
* Jitsi-based data channel (to pass all the things listed below)
* Breakout rooms
* Chat (room chat and private chats with anyone else in the room)
* Hand raising queues (both for follow up questions and new topics)
* Whiteboards (multiple in the "main" room and one each for the breakout rooms
* Polling
* Understanding checks using a slider (or input range)

## Why
As my school went mostly online last spring, I started collecting my thoughts about what I really wish I had for an online platform to work with my students. I quickly realized that my dream of all videos on and fully interactive students 1) wasn't as good as I thought, and 2) didn't happen because many students couldn't or wouldn't make use of video. I began to realize that video is the dominant feature in things like Zoom and Google Meets. It gobbles up nearly all of the screen space and is responsible for nearly all the bandwidth. So I started to consider what I might be able to do if I just stopped using video.

So I set out looking for ways to build in collaborative tools like whiteboards and understanding checks that would make better use of screen space. This is the result.

Soon I'll link to a blog post with much more of my philosophy.

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
## Set up Spreadsheet
You just need one tab: "roster" that has (unique!) names in the first column and emails in the second column. Feel free to [use this template](https://docs.google.com/spreadsheets/d/1BnjBrSzlzJ1b9JLwq8cuD9Ik0OJVVKDFvU2CavdXBn0/edit?usp=sharing) as a start (which also has all the code in it ready to go!).

I've uploaded all the javascript and html into this repository so you can just copy and paste it into a new script tied to your spreadsheet (especially if it seems the code hasn't come along with your "make a copy" of my template).

## Deploy
* Update the top lines in "globals.gs" with your email and google ids of your drawing template and folder
* Go to "Publish -> Deploy as web app" and make a new version, deciding who has access.
    * the first time this will ask you to review the permissions


