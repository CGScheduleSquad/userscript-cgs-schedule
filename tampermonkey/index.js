// ==UserScript==
// @name         Veracross CGS Schedule
// @version      0.11
// @description  Bring the old CGS schedule view to the Veracross student schedule.
// @author       Liam Wang
// @match        https://portals.veracross.com/catlin/student/student*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @run-at document-start
// @namespace https://greasyfork.org/users/118299
// ==/UserScript==

const colorDict = {
  0:"#C0C0C0",
  1:"#FFCE51",
  2:"#A67FB9",
  3:"#E67326",
  4:"#00ABBD",
  5:"#AAC02C",
  6:"#EF4957",
  7:"#FF75F2",
  "free":"white"
};
const normalTimes = [ // rename normalStartTimes
  new Date(0,0,0,8,0),
  new Date(0,0,0,8,45),
  new Date(0,0,0,9,20),
  new Date(0,0,0,9,30),
  new Date(0,0,0,9,45),
  new Date(0,0,0,10,35),
  new Date(0,0,0,11,20),
  new Date(0,0,0,11,55),
  new Date(0,0,0,12,30),
  new Date(0,0,0,13,10),
  new Date(0,0,0,13,40),
  new Date(0,0,0,14,30),
];

var mainlabel = "";
let schoolEndTime = new Date(0,0,0,15,15);
let normalAllTimes = normalTimes.concat([schoolEndTime]);

let specialDayStyle = ".daylabel a {color:black} .daylabel a:visited {color:black} .specialday{padding:0}.specialday>.sched{height:100%;width:100%}.specialday>.sched tr:first-child td{border-top:0}.specialday>.sched tr td:first-child{border-left:0}.specialday>.sched tr td:last-child{border-right:0}";
let scheduleStyle = "\r\n\tHTML { height:95%; }\r\n\tBODY { height:100%; }\r\n\t#schedarea { height:100%; }\r\n\tTABLE.sched { border-collapse:collapse; empty-cells:show; height:90%; width:100%;  }\r\n\t a:visited {color: #00E;} TD { -webkit-print-color-adjust: exact; }\r\n\tTD.times { border-style:solid; border-width:2px; border-color:#000000; text-align:center; }\r\n\tTD.period { border-style:solid; border-width:2px; border-color:#000000; text-align:center; }\r\n\tTD.daylabel { border-style:none; height:5%; width:18%; text-align:center; }\r\n\tTD.specialday { border-style:solid; border-width:2px; border-color:#000000; width:18%; text-align:center; vertical-align:top; }\r\n\tTD.mainlabel { border-style:none; height:5%; width:10%; text-align:center; }\r\n\tTD.mins90 { height:18%; }\r\n\tTD.mins85 { height:17%; }\r\n\tTD.mins80 { height:16%; }\r\n\tTD.mins75 { height:15%; }\r\n\tTD.mins70 { height:14%; }\r\n\tTD.mins65 { height:13%; }\r\n\tTD.mins60 { height:12%; }\r\n\tTD.mins55 { height:11%; }\r\n\tTD.mins50 { height:10%; }\r\n\tTD.mins45 { height:9%; }\r\n\tTD.mins40 { height:8%; }\r\n\tTD.mins35 { height:7%; }\r\n\tTD.mins30 { height:6%; }\r\n\tTD.mins25 { height:5%; font-size:90%; }\r\n\tTD.mins25big { height:5%; }\r\n\tTD.mins20 { height:4%; font-size:90%; }\r\n\tTD.mins15 { height:3%; font-size:80%; }\r\n\tTD.mins10 { height:2%; font-size:75%; }\r\n\tTD.mins5 { height:1%; font-size:75%; }\r\n\tTABLE.controls { border-style:none; width:100%; max-height:5%; padding:0px; margin:0px;}\r\n\tHR.controls { width:100%; padding:0px; margin:0px;}\r\n\tTD.controls { border-style:none; text-align:center; width:20%; font-family:\"sans-serif\"; font-weight:bold; padding:0px; margin:0px; }\r\n\tTD.controls.arrows { width:8%; }\r\n\tTD.controls.links { width:28%; }\r\n\t.coursename { font-size:100%; }\r\n\t.subtitle { font-size:75%; }\r\n\t.schedarea > .sched.week { font-size:120%; }\r\n\r\n\t@media print { .controls { display:none; } }\r\n\r\n\t@media screen and (orientation:portrait) and (min-height:1000px) {  /* phone */\r\n\t\t.sched.today { font-size:250%; }\r\n\t\tTD.controls { font-size:175%; }\r\n\t}\r\n\t@media screen and (orientation:landscape) and (max-height:500px) {  /* phone */\r\n\t\tTD.controls { font-size: 150%; }\r\n\t}\r\n\t@media screen and (orientation:portrait) and (max-height:1000px) { \r\n\t\t.sched.today { font-size:200%; }\r\n\t\tTD.controls { font-size: 150%; }\r\n\t}\r\n\t@media screen and (orientation:landscape) and (min-height:500px) { \r\n\t\tTD.controls { font-size: 100%; }\r\n\t}\r\n";
let scheduleHead = "<head>\r\n<title>CGS Schedule</title>\r\n<meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\r\n<link rel=\"shortcut icon\" href=\"https://inside.catlin.edu/scripts/sched/favicon.ico\">\r\n<style type=\"text/css\">"+scheduleStyle+specialDayStyle+"</style>\r\n\r\n</head>";
let scheduleBody = "<body data-gr-c-s-loaded=\"true\" class=\"vsc-initialized\" style=\"\"><table class=\"controls\"><tbody><tr><td class=\"controls arrows\"><a><img src=\"http://inside.catlin.edu/scripts/sched/left48.png\"></a></td><td class=\"controls links\"><a href=\"https://portals.veracross.com/catlin/student/student/daily-schedule\">Today</a></td><td class=\"controls links\"><a href=\"?\">This Week</a></td><td class=\"controls links\"><a>Return To Portal</a></td><td class=\"controls arrows\"><a><img src=\"http://inside.catlin.edu/scripts/sched/right48.png\"></a></td></tr></tbody></table><hr class=\"controls\"><div id=\"schedarea\"><table class=\"sched week main\"><tbody><tr><td class=\"mainlabel\"><b></b></td></tr><tr class=\"mins45\"><td class=\"times mins45\">8:00-8:45</td></tr><tr class=\"mins25\"><td class=\"times mins25\">8:45-9:15</td></tr><tr class=\"mins10\"><td class=\"times mins10\">9:20-9:30</td></tr><tr class=\"mins10\"><td class=\"times mins10\">9:30-9:40</td></tr><tr class=\"mins45\"><td class=\"times mins45\">9:45-10:30</td></tr><tr class=\"mins45\"><td class=\"times mins45\">10:35-11:20</td></tr><tr class=\"mins25\"><td class=\"times mins25\">11:20-11:50</td></tr><tr class=\"mins35\"><td class=\"times mins35\">11:55-12:30</td></tr><tr class=\"mins35\"><td class=\"times mins35\">12:30-1:05</td></tr><tr class=\"mins25\"><td class=\"times mins25\">1:10-1:40</td></tr><tr class=\"mins45\"><td class=\"times mins45\">1:40-2:25</td></tr><tr class=\"mins45\"><td class=\"times mins45\">2:30-3:15</td></tr></tbody></table></div></body>";



if (window.location.href.match(/legacy/)) {
  loadBetterSchedule();
} else {
  window.onload = function () {
    $("div.vx-Tabs").append("<a class=\"vx-Tab_Item \" onclick=\"window.location='legacy'+window.location.search;\" style=\" color: #ff5959; \"><div class=\"vx-Tab_Icon\"> <i class=\"nc-icon-glyph media-1_flash-21\"></i></div><div class=\"vx-Tab_Description\">CGS Schedule</div> </a>");
  }
}

function loadBetterSchedule() {
  $("head").html(scheduleHead);
  $("body").html(scheduleBody);

  var url = new URL(window.location.href);
  var date = url.searchParams.get("date");

  let seedDate = new Date();
  if (date !== null) {
    seedDate = new Date(date);
  }

  let lastFriday = getLastFriday(seedDate);
  lastFriday.setDate(lastFriday.getDate() + 3);
  loadWeek(new Date(lastFriday));

  let previousMonday = new Date(lastFriday)
  previousMonday.setDate(lastFriday.getDate() - 7);
  $("td.arrows a").first().prop("href", "?date="+dateToVeracrossDate(previousMonday))

  let nextMonday = new Date(lastFriday)
  nextMonday.setDate(lastFriday.getDate() + 7);
  $("td.arrows a").last().prop("href", "?date="+dateToVeracrossDate(nextMonday))

  $("td.links a").last().prop("href", "/catlin/student/student/daily-schedule?date="+dateToVeracrossDate(seedDate));

}

function loadWeek(mondayDate) {
  $("table").hide();
  Promise.all(getVeracrossWeekDateStrings(mondayDate).map(getScheduleForDate)).then((results) => {
    results.forEach(appendDay);
    $(".mainlabel b").text(mainlabel);
    $("table").show();
  });
}

function appendDay(daySchedule) {
  console.log(daySchedule)
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  $("table.sched.main > tbody > tr:nth-child("+1+")").append("<td class=\"daylabel\"><a href=\"/catlin/student/student/daily-schedule?date="+dateToVeracrossDate(daySchedule.date)+"\"><b>"+days[daySchedule.date.getDay()]+" "+months[daySchedule.date.getMonth()]+" "+daySchedule.date.getDate()+(!daySchedule.letter?"":" ("+daySchedule.letter+")")+"</b></a></td>");
  if (isEmptyDay(daySchedule)) {
    addSpecialDay("No Events", colorDict["free"]);
  } else if (isNormalDay(daySchedule)) {
    addTableData(applyCustomRules(prepTableDataDay(trimDay(daySchedule))));
  } else {
    //addSpecialDay("Special Schedule", colorDict[0], "/catlin/student/student/daily-schedule?date="+dateToVeracrossDate(daySchedule.date));
    addInlineDay(applyCustomRules(trimDay(daySchedule)));
  }
}

function applyCustomRules(daySchedule) {
  if (mainlabel === "Liam Wang") {
    daySchedule.blocks.forEach((block) => {
      if (block.title === "Co-Curric" && daySchedule.letter === "B") {
        block.title = "Robotics Meeting";
        block.subtitle = "Gerlinger"
        block.free = false;
      }
      if (block.title === "Co-Curric" && daySchedule.letter === "F") {
        block.title = "Robotics Manager's Meeting";
        block.subtitle = "Lib 4"
        block.free = false;
      }
    });
  }
  return daySchedule;
}

function getVeracrossWeekDateStrings(mondayDate) {
  let dates = []
  for (let i=0; i<5; i++) {
    dates.push(dateToVeracrossDate(mondayDate));
    mondayDate.setDate(mondayDate.getDate() + 1);
  }
  return dates;
}


function getLastFriday(date) {
  var d = new Date(date),
    day = d.getDay(),
    diff = (day <= 5) ? (7 - 5 + day ) : (day - 5);

  d.setDate(d.getDate() - diff);
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);

  return d;
}

function dateToVeracrossDate(date) {
  return [date.getFullYear(), date.getMonth()+1, date.getDate()].join("-");
}

function addSpecialDay(text, bgcolor, link="") {
  $("table.sched.main > tbody > tr:nth-child("+2+")").append("<td rowspan="+12+" bgcolor="+bgcolor+" class=\"specialday\"><a "+(link===""?"":"href="+link)+" class=\"coursename\">"+text+"</a></td>");
}

function addInlineDay(daySchedule) {
  $("table.sched.main > tbody > tr:nth-child("+2+")").append("<td rowspan="+12+" class=\"specialday\" style=\"border-top-style: solid; border-right-style: solid; border-bottom: 0px; border-left-style: solid;\"><table class=\"sched week special\"><tbody>");

  if (daySchedule.blocks[0].startTime.getTime() !== normalTimes[0].getTime()) {
    daySchedule.blocks.unshift({"startTime":normalTimes[0], "title":"Late Start", "subtitle":"", "rowSpan":1});
  }

  daySchedule.blocks.forEach((block, index) => {
    if (index === daySchedule.blocks.length-1) {
      block.endTime = schoolEndTime;
    } else {
      block.endTime = daySchedule.blocks[index+1].startTime;
    }
    block.mins = Math.min(Math.max(new Date(block.endTime.getTime()-block.startTime.getTime()).getTime()/1000/60, 5), 90);
  });

  let tableBody = $(".special tbody").last();
  daySchedule.blocks.forEach((block) => {
    let minsClass = "mins"+block.mins;

    if (block.title === "Late Start") {
      tableBody.append("<tr class="+minsClass+"><td colspan=\"2\" bgcolor="+colorDict["free"]+" class=\"period "+minsClass+" specialperiod\"><span class=\"coursename\">"+block.title+"</span><br></td>\r\n</tr>");
      return;
    }

    let timeRange = format12HourTime(block.startTime)+"-"+format12HourTime(block.endTime);


    // start duplicate
    let smallBlock = block.title === block.subtitle || block.subtitle === "" || block.title === "US C&C";
    let blockNumMatchAttempt = block.subtitle.match(/US \d(?! Flex)/);
    let bgcolor = colorDict[0];
    if (blockNumMatchAttempt!==null) {
      bgcolor = colorDict[parseInt(blockNumMatchAttempt[0].slice(-1))];
    } else if (block.free || block.subtitle.match(/Break/) != null || block.subtitle.match(/Lunch/) != null) {
      bgcolor = colorDict["free"];
    }
    if (block.free != true) {
      block.title = block.title.split(" - ")[0]
      block.subtitle = block.subtitle.split(" • ").slice(-2).reverse().join(" - ").replace("US ", "Blk ").replace(" Long", "");
    }
    // end duplicate

    tableBody.append("<tr class="+minsClass+">\r\n<td class=\"times "+minsClass+"\">"+timeRange+"</td>\r\n<td rowspan=\"1\" bgcolor="+bgcolor+" class=\"period "+minsClass+" specialperiod\"><span class=\"coursename\">"+block.title+"</span>"+(smallBlock?"":"<br>")+"<span class=\"subtitle\">"+(smallBlock?"":block.subtitle)+"</span><br></td>\r\n</tr>");
  });
}

function format12HourTime(date) {
  return ((date.getHours()-1)%12+1)+":"+(date.getMinutes()<10?"0":"")+date.getMinutes();
}

function addTableData(daySchedule) {
  daySchedule.blocks.forEach((block) => {
    let normalTimeIndex = 1;
    normalTimes.some((time) => {
      normalTimeIndex ++;
      return block.startTime.getHours() == time.getHours() && block.startTime.getMinutes() == time.getMinutes();
    });
    let smallBlock = block.title === block.subtitle || block.subtitle === "" || block.title === "US C&C";
    let blockNumMatchAttempt = block.subtitle.match(/US \d(?! Flex)/);
    let bgcolor = colorDict[0];
    if (blockNumMatchAttempt!==null) {
      bgcolor = colorDict[parseInt(blockNumMatchAttempt[0].slice(-1))];
    } else if (block.free || block.subtitle.match(/Break/) != null || block.subtitle.match(/Lunch/) != null) {
      bgcolor = colorDict["free"];
    }
    if (block.free != true) {
      block.title = block.title.split(" - ")[0]
      block.subtitle = block.subtitle.split(" • ").slice(-2).reverse().join(" - ").replace("US ", "Blk ").replace(" Long", "");
    }
    $("table.sched.main > tbody > tr:nth-child("+normalTimeIndex+")").append("<td rowspan="+block.rowSpan+" bgcolor="+bgcolor+" class=\"period mins"+block.mins+"\"><span class=\"coursename\">"+block.title+"</span>"+(smallBlock?"":"<br>")+"<span class=\"subtitle\">"+(smallBlock?"":block.subtitle)+"</span><br></td>");
  });
}

function prepTableDataDay(daySchedule) {
  let newBlocks = []
  normalTimes.forEach((time) => {
    let blockWithTime = daySchedule.blocks.find((block) => {
      return block.startTime.getTime() == time.getTime()
    });
    if (blockWithTime === undefined) {
      newBlocks.push(null);
    } else {
      newBlocks.push(blockWithTime);
    }
  });

  for (let i=0; i<newBlocks.length; i++) {
    if (newBlocks[i] == null) {
      let title = "Free";
      switch(i) {
        case 6:
          title = "Free<span class=\"subtitle\"> - AM Flex</span>";
          break;
        case 7:
          title = "Co-Curric";
          break;
        case 9:
          title = "Free<span class=\"subtitle\"> - PM Flex</span>";
          break;
      }
      newBlocks[i] = {"startTime":normalTimes[i], "title":title, "subtitle":"", "rowSpan":1, "free":true};
    }
    if (i<newBlocks.length-1 && (newBlocks[i].subtitle.match(/Long/) != null || newBlocks[i].title === "Free" || newBlocks[i].title === "Assembly") && newBlocks[i+1] == null) {
      newBlocks[i].rowSpan++;
      newBlocks[i+1] = "remove";
      i++;
    }
  }
  newBlocks = newBlocks.filter((block) => block !== "remove");

  let timeIndex = 0;
  newBlocks.forEach((block) => {
    block.mins = Math.min(Math.max(new Date(normalAllTimes[timeIndex+block.rowSpan].getTime()-normalAllTimes[timeIndex].getTime()).getTime()/1000/60, 5), 90);
    timeIndex = timeIndex+block.rowSpan;
  });

  daySchedule.blocks = newBlocks;
  return daySchedule;
}

function trimDay(daySchedule) {
  daySchedule.blocks = daySchedule.blocks.filter((block) => {
    let startHours = block.startTime.getHours();
    let startMinutes = block.startTime.getMinutes();
    if (startHours < 8 || startHours >= 12+3) { // time is out of range
      return false;
    }
    return !daySchedule.blocks.some((otherBlock) => { // keep longer description one (TODO show conflict)
      let sameTime = block.startTime.getTime() == otherBlock.startTime.getTime();
      if (sameTime) deleteNextSameTime = true;
      return sameTime && (block.title.length < otherBlock.title.length || block.subtitle.length < otherBlock.subtitle.length);
    });
  });
  return daySchedule;
}

function isNormalDay(daySchedule) {
  return daySchedule.blocks.every((block) => {
    let startHours = block.startTime.getHours();
    let startMinutes = block.startTime.getMinutes();
    if (startHours < 8 || startHours >= 12+3) {
      return true;
    }
    return normalTimes.some((time) => {
      return startHours == time.getHours() && startMinutes == time.getMinutes();
    });
  });
}

function isEmptyDay(daySchedule) {
  return daySchedule.blocks.length==0;
}

function getScheduleForDate(dateString) {
  return new Promise(function(resolve, reject) {
    $.get("https://portals.veracross.com/catlin/student/student/daily-schedule?date="+dateString, function(data) {
      let arr = []
      $(data).find(".schedule .schedule-item").each((index, value) => {
        let timeString = $(value).find(".item-time").text().replace("NOW", "").trim();
        let startTime = parseVeracrossDate(timeString);
        let title = $(value).find(".item-main-description").text().trim();
        let subtitle = $(value).find(".item-subtitle").text().trim();
        arr.push({"startTime":startTime, "title":title, "subtitle":subtitle, "rowSpan":1})
      });
      let splitDate = dateString.split("-")
      let date = new Date(splitDate[0], splitDate[1]-1, splitDate[2]);
      let letter = $(data).find(".rotation-day-header").text().trim().slice(-1);
      if (mainlabel === "") {
        mainlabel = data.match(/full_name: "[A-z ]+(?=",)/)[0].split("\"")[1];
      }
      resolve({"date":date, "letter":letter, "blocks":arr});
    }).fail(() => window.location.href = "https://portals.veracross.com/catlin"); // user was not logged in, redirect them to login page
  });
}

function parseVeracrossDate(timeString) {
  let startTime = new Date();
  let isPm = false;
  if (timeString.includes("am")) {
    timeString = timeString.replace(" am", "")
  }
  if (timeString.includes("pm")) {
    timeString = timeString.replace(" pm", "")
    isPm = true;
  }
  let splitString = timeString.split(":");
  return new Date(0,0,0,parseInt(splitString[0])+(isPm && parseInt(splitString[0]) != 12 ? 12 : 0),parseInt(splitString[1]));
}