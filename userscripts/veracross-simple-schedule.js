// ==UserScript==
// @name         Veracross CGS Schedule
// @version      0.19
// @description  Bring the old CGS schedule view to the Veracross student schedule.
// @author       Liam Wang & Tristan Peng
// @namespace    https://greasyfork.org/users/118299
// @match        https://portals.veracross.com/catlin/student/student*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

// TODO: Get rid of html snippets

const colorDict = {
    0: '#C0C0C0',
    1: '#FFCE51',
    2: '#A67FB9',
    3: '#E67326',
    4: '#00ABBD',
    5: '#AAC02C',
    6: '#EF4957',
    7: '#FF75F2',
    'free': 'white'
};

const normalTimes = [
    new Date(0, 0, 0, 8, 0),
    new Date(0, 0, 0, 8, 45),
    new Date(0, 0, 0, 9, 20),
    new Date(0, 0, 0, 9, 30),
    new Date(0, 0, 0, 9, 45),
    new Date(0, 0, 0, 10, 35),
    new Date(0, 0, 0, 11, 20),
    new Date(0, 0, 0, 11, 55),
    new Date(0, 0, 0, 12, 30),
    new Date(0, 0, 0, 13, 10),
    new Date(0, 0, 0, 13, 40),
    new Date(0, 0, 0, 14, 30)
];

let userName = '';
let schoolEndTime = new Date(0, 0, 0, 15, 15);
let normalAllTimes = normalTimes.concat([schoolEndTime]);

//<editor-fold desc="Injected HTML">
const html = `<head>
    <title>CGS Schedule</title>
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="-1">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 11:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="shortcut icon" href="https://inside.catlin.edu/scripts/sched/favicon.ico">
    <style type="text/css">
        .daylabel a {
            color: black;
        }

        .daylabel a:visited {
            color: black;
        }

        .specialday {
            padding: 0;
        }

        .specialday > .sched {
            height: 100%;
            width: 100%;
        }

        .specialday > .sched tr:first-child td {
            border-top: 0;
        }

        .specialday > .sched tr td:first-child {
            border-left: 0;
        }

        .specialday > .sched tr td:last-child {
            border-right: 0;
        }

        html {
            height: 95%;
        }

        body {
            height: 100%;
            overflow: hidden;
        }

        #schedarea {
            height: 100%;
        }

        table.sched {
            border-collapse: collapse;
            empty-cells: show;
            height: 90%;
            width: 100%;
        }

        a:visited {
            color: #00e;
        }

        td {
            -webkit-print-color-adjust: exact;
        }

        td.times {
            border-style: solid;
            border-width: 2px;
            border-color: #000000;
            text-align: center;
        }

        td.period {
            border-style: solid;
            border-width: 2px;
            border-color: #000000;
            text-align: center;
        }

        td.daylabel {
            border-style: none;
            height: 5%;
            width: 18%;
            text-align: center;
        }

        td.specialday {
            border-style: solid;
            border-width: 2px;
            border-color: #000000;
            width: 18%;
            text-align: center;
            vertical-align: top;
        }

        td.mainlabel {
            border-style: none;
            height: 5%;
            width: 10%;
            text-align: center;
        }

        td.mins90 {
            height: 18%;
        }

        td.mins85 {
            height: 17%;
        }

        td.mins80 {
            height: 16%;
        }

        td.mins75 {
            height: 15%;
        }

        td.mins70 {
            height: 14%;
        }

        td.mins65 {
            height: 13%;
        }

        td.mins60 {
            height: 12%;
        }

        td.mins55 {
            height: 11%;
        }

        td.mins50 {
            height: 10%;
        }

        td.mins45 {
            height: 9%;
        }

        td.mins40 {
            height: 8%;
        }

        td.mins35 {
            height: 7%;
        }

        td.mins30 {
            height: 6%;
        }

        td.mins25 {
            height: 5%;
            font-size: 90%;
        }

        td.mins25big {
            height: 5%;
        }

        td.mins20 {
            height: 4%;
            font-size: 90%;
        }

        td.mins15 {
            height: 3%;
            font-size: 80%;
        }

        td.mins10 {
            height: 2%;
            font-size: 75%;
        }

        td.mins5 {
            height: 1%;
            font-size: 75%;
        }

        table.controls {
            border-style: none;
            width: 100%;
            max-height: 5%;
            padding: 0px;
            margin: 0px;
        }

        hr.controls {
            width: 100%;
            padding: 0px;
            margin: 0px;
        }

        td.controls {
            border-style: none;
            text-align: center;
            width: 20%;
            font-family: "sans-serif";
            font-weight: bold;
            padding: 0px;
            margin: 0px;
        }

        td.controls.arrows {
            width: 8%;
        }

        td.controls.links {
            width: 28%;
        }

        .coursename {
            font-size: 100%;
        }

        .subtitle {
            font-size: 75%;
        }

        .schedarea > .sched.week {
            font-size: 120%;
        }

        @media print {
            .controls {
                display: none;
            }
        }

        @media screen and (orientation: portrait) and (min-height: 1000px) {
            .sched.today {
                font-size: 250%;
            }

            td.controls {
                font-size: 175%;
            }
        }

        @media screen and (orientation: landscape) and (max-height: 500px) {
            td.controls {
                font-size: 150%;
            }
        }

        @media screen and (orientation: portrait) and (max-height: 1000px) {
            .sched.today {
                font-size: 200%;
            }

            td.controls {
                font-size: 150%;
            }
        }

        @media screen and (orientation: landscape) and (min-height: 500px) {
            td.controls {
                font-size: 100%;
            }
        }

        .daylabel a, .daylabel a:visited {
            color: black;
        }

        .specialday {
            padding: 0;
        }

        .specialday > .sched {
            height: 100%;
            width: 100%;
        }

        .specialday > .sched tr:first-child td {
            border-top: 0;
        }

        .specialday > .sched tr td:first-child {
            border-left: 0;
        }

        .specialday > .sched tr td:last-child {
            border-right: 0;
        }
    </style>
</head>

<body data-gr-c-s-loaded="true" class="vsc-initialized" style="">
<table class="controls">
    <tbody>
    <tr>
        <td class="controls arrows">
            <a><img src="https://inside.catlin.edu/scripts/sched/left48.png"></a>
        </td>
        <td class="controls links">
            <a href="https://portals.veracross.com/catlin/student/student/daily-schedule">Today</a>
        </td>
        <td class="controls links">
            <a href="?">This Week</a>
        </td>
        <td class="controls links">
            <a>Return To Portal</a>
        </td>
        <td class="controls arrows">
            <a><img src="https://inside.catlin.edu/scripts/sched/right48.png"></a>
        </td>
    </tr>
    </tbody>
</table>
<hr class="controls">
<div id="schedarea">
    <table class="sched week main">
        <tbody>
        <tr>
            <td class="mainlabel"><b></b></td>
        </tr>
        <tr class="mins45">
            <td class="times mins45">8:00-8:45</td>
        </tr>
        <tr class="mins25">
            <td class="times mins25">8:45-9:15</td>
        </tr>
        <tr class="mins10">
            <td class="times mins10">9:20-9:30</td>
        </tr>
        <tr class="mins10">
            <td class="times mins10">9:30-9:40</td>
        </tr>
        <tr class="mins45">
            <td class="times mins45">9:45-10:30</td>
        </tr>
        <tr class="mins45">
            <td class="times mins45">10:35-11:20</td>
        </tr>
        <tr class="mins25">
            <td class="times mins25">11:20-11:50</td>
        </tr>
        <tr class="mins35">
            <td class="times mins35">11:55-12:30</td>
        </tr>
        <tr class="mins35">
            <td class="times mins35">12:30-1:05</td>
        </tr>
        <tr class="mins25">
            <td class="times mins25">1:10-1:40</td>
        </tr>
        <tr class="mins45">
            <td class="times mins45">1:40-2:25</td>
        </tr>
        <tr class="mins45">
            <td class="times mins45">2:30-3:15</td>
        </tr>
        </tbody>
    </table>
</div>
</body>
`;
//</editor-fold>

if (window.location.href.match(/legacy/)) { // TODO: Stricter href matcher
    loadSchedule()
} else {
    addCGSScheduleButton()
}

function addCGSScheduleButton() {
    window.onload = () => $('div.vx-Tabs').append(`
    <a class="vx-Tab_Item" onclick="window.location = 'legacy' + window.location.search;" style="color: #ff5959;">
      <div class="vx-Tab_Icon">
        <i class="nc-icon-glyph media-1_flash-21"></i>
      </div>
      <div class="vx-Tab_Description">CGS Schedule</div>
    </a>
  `);
}

function loadSchedule() {
    // noinspection JSUnresolvedFunction
    document.documentElement.innerHTML = html;

    // get the date from the search parameters, if there isn't a date, use the current date
    const date = new URL(window.location.href).searchParams.get("date");
    const seedDate = date !== null ? new Date(date) : new Date();

    // get the the monday previous to the seed date
    const thisMonday = getLastFriday(seedDate);
    thisMonday.setDate(thisMonday.getDate() + 3);

    // get the previous and next monday for the arrows TODO: Dont modify the dates inside getVeracrossDateStringsForWeek so this order doesn't matter
    const previousMonday = new Date(thisMonday);
    const nextMonday = new Date(thisMonday);
    previousMonday.setDate(thisMonday.getDate() - 7);
    nextMonday.setDate(thisMonday.getDate() + 7);

    // load the schedule table
    $('table').hide();
    Promise.all(getVeracrossDateStringsForWeek(new Date(thisMonday)).map(httpRequestScheduleForDate)).then(res => {
        res.forEach(appendDay);
        $('.mainlabel b').text(userName);
        $('table').show();
    });

    // left/right arrows
    let navigationArrows = $('td.arrows a');
    navigationArrows.first().prop('href', '?date=' + dateToVeracrossDate(previousMonday));
    navigationArrows.last().prop('href', '?date=' + dateToVeracrossDate(nextMonday));

    // return to portal link
    $('td.controls.links a').last().prop('href', '/catlin/student/student/daily-schedule?date=' + dateToVeracrossDate(seedDate));

    // remove 404 html
    window.onload = () => $('body > .dialog').remove();
}

function getVeracrossDateStringsForWeek(mondayDate) { // [2019-9-16, 2019-9-17, etc...]
    let dates = [];
    for (let i = 0; i < 5; i++) {
        dates.push(dateToVeracrossDate(mondayDate));
        mondayDate.setDate(mondayDate.getDate() + 1);
    }
    return dates;
}

function httpRequestScheduleForDate(dateString) { // http request to veracross for the schedule blocks
    return new Promise(function (resolve) {
        $.get(`https://portals.veracross.com/catlin/student/student/daily-schedule?date=${ dateString }`, data => {
            let arr = [];
            $(data).find('.schedule .schedule-item').each((index, value) => { // find all the blocks and get the time, title, and subtitle
                let timeString = $(value).find('.item-time').text().replace('NOW', '').trim();
                let startTime = parseVeracrossTime(timeString);
                let title = $(value).find('.item-main-description').text().trim();
                let subtitle = $(value).find('.item-subtitle').text().trim();
                arr.push({startTime, title, subtitle, rowSpan: 1});
            });
            let splitDate = dateString.split('-'); // get the current date
            let date = new Date(splitDate[0], splitDate[1] - 1, splitDate[2]);
            let letter = $(data).find('.rotation-day-header').text().trim().slice(-1);
            if (userName === '') { // if the username hasn't been set, get the username
                userName = data.match(/full_name: "[A-z ]+(?=",)/)[0].split('"')[1];
            }
            resolve({date, letter, blocks: arr});
        }).fail(() => window.location.href = "https://portals.veracross.com/catlin"); // user was not logged in, redirect them to login page
    });
}

function appendDay(daySchedule) {
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // append the header with a link to the veracross page
    $('table.sched.main > tbody > tr:nth-child(1)').append(`
    <td class="daylabel">
      <a href="/catlin/student/student/daily-schedule?date=${ dateToVeracrossDate(daySchedule.date) }">
        <b>
          ${ days[daySchedule.date.getDay()] } ${ months[daySchedule.date.getMonth()] } ${ daySchedule.date.getDate() + (!daySchedule.letter ? '' : ` (${ daySchedule.letter })`) }
        </b>
      </a>
    </td>
    `);
    if (isEmptyDay(daySchedule)) { // append the day blocks
        appendBlankSchedule('No Events', colorDict.free);
    } else if (isNormalDay(daySchedule)) {
        appendRegularSchedule(applyCustomBlockRules(filterBlocks(daySchedule)));
    } else {
        appendInlineSchedule(applyCustomBlockRules(filterBlocks(daySchedule)));
    }
}

function filterBlocks(daySchedule) { // removes blocks not between 12 and 3 and duplicates
    daySchedule.blocks = daySchedule.blocks.filter(block => {
        let startHours = block.startTime.getHours();
        if (isNaN(startHours) || startHours < 8 || startHours >= 12 + 3) return false;
        return !daySchedule.blocks.some((otherBlock) => { // keep longer description one (TODO: show conflict)
            let sameTime = block.startTime.getTime() === otherBlock.startTime.getTime();
            return sameTime && (block.title.length < otherBlock.title.length || block.subtitle.length < otherBlock.subtitle.length);
        });
    });
    return daySchedule;
}

//<editor-fold desc="Schedule appenders">
function appendBlankSchedule(text, bgcolor, link = '') {
    return $('table.sched.main > tbody > tr:nth-child(2)').append(`<td rowspan="12" class="specialday" style="background: ${ bgcolor };"><a ${ (link === '' ? '' : `href=${ link }`) } class="coursename">${ text }</a></td>`);
}

function appendRegularSchedule(daySchedule) {
    daySchedule = prepRegularSchedule(daySchedule);
    daySchedule.blocks.forEach(block => {
        let normalTimeIndex = 1;
        normalTimes.some(time => {
            normalTimeIndex++;
            return block.startTime.getHours() === time.getHours() && block.startTime.getMinutes() === time.getMinutes();
        });
        let smallBlock = block.title === block.subtitle || block.subtitle === '' || block.title === 'US C&C';
        let blockNumMatchAttempt = block.subtitle.match(/US \d(?! Flex)/);
        let bgcolor = blockNumMatchAttempt !== null ? colorDict[parseInt(blockNumMatchAttempt[0].slice(-1))] : block.free || block.subtitle.match(/Break/) != null || block.subtitle.match(/Lunch/) != null ? colorDict.free : colorDict[0];
        if (!block.free) {
            block.title = block.title.split(' - ')[0];
            block.subtitle = block.subtitle.split(' • ').slice(-2).reverse().join(' - ').replace('US ', 'Blk ').replace(' Long', '');
        }
        $(`table.sched.main > tbody > tr:nth-child(${ normalTimeIndex })`).append(`<td rowspan="${ block.rowSpan }" class="period mins${ block.mins }" style="background: ${ bgcolor };"><span class="coursename">${ block.title }</span>${ (smallBlock ? '' : '<br>') }<span class="subtitle">${ (smallBlock ? '' : block.subtitle) }</span><br></td>`);
    });
}

function prepRegularSchedule(daySchedule) {
    let newBlocks = [];
    normalTimes.forEach(time => { // for each normal start time, push null to newBlocks if no blocks begin at the start time and push the block into newBlocks if it begins at the start time
        let blockWithTime = daySchedule.blocks.find(block => block.startTime.getTime() === time.getTime());
        newBlocks.push(blockWithTime === undefined ? null : blockWithTime);
    });

    for (let i = 0; i < newBlocks.length; i++) { // Replace empty blocks with free blocks and extend long blocks into the next period
        if (newBlocks[i] === null) {
            let title = 'Free';
            switch (i) {
                case 6:
                    title = 'Free<span class="subtitle"> - AM Flex</span>';
                    break;
                case 7:
                    title = 'Co-Curric';
                    break;
                case 9:
                    title = 'Free<span class="subtitle"> - PM Flex</span>';
                    break;
            }
            newBlocks[i] = {'startTime': normalTimes[i], 'title': title, 'subtitle': '', 'rowSpan': 1, 'free': true};
        }
        if (i < newBlocks.length - 1 && (newBlocks[i].subtitle.match(/Long/) != null || newBlocks[i].title === 'Free' || newBlocks[i].title === 'Assembly') && newBlocks[i + 1] == null) {
            newBlocks[i].rowSpan++;
            newBlocks[i + 1] = 'remove';
            i++;
        }
    }
    newBlocks = newBlocks.filter(block => block !== 'remove');

    let timeIndex = 0;
    newBlocks.forEach(block => { // calculate the duration of the block from the number of rows (time blocks) it spans
        block.mins = Math.min(Math.max(new Date(normalAllTimes[timeIndex + block.rowSpan].getTime() - normalAllTimes[timeIndex].getTime()).getTime() / 1000 / 60, 5), 90);
        timeIndex = timeIndex + block.rowSpan;
    });

    daySchedule.blocks = newBlocks;
    return daySchedule;
}

function appendInlineSchedule(daySchedule) {
    $('table.sched.main > tbody > tr:nth-child(2)').append(`<td rowspan="12" class="specialday" style="border-top-style: solid; border-right-style: solid; border-bottom: 0px; border-left-style: solid;"><table class="sched week special"><tbody>`);

    if (daySchedule.blocks[0].startTime.getTime() !== normalTimes[0].getTime()) {
        daySchedule.blocks.unshift({'startTime': normalTimes[0], 'title': 'Free', 'subtitle': '', 'rowSpan': 1, 'lateStart':true});
    }

    daySchedule.blocks.forEach((block, index) => {
        block.endTime = index === daySchedule.blocks.length - 1 ? schoolEndTime : daySchedule.blocks[index + 1].startTime;
        block.mins = Math.min(Math.max(new Date(block.endTime.getTime() - block.startTime.getTime()).getTime() / 1000 / 60, 5), 90);
    });

    daySchedule.blocks.forEach(block => {
        let minsClass = `mins${ block.mins }`;

        if (block.lateStart) {
            $('.special tbody').last().append(`<tr class="${ minsClass }"><td colspan="2" class="period ${ minsClass } specialperiod" style="background: ${ colorDict.free };"><span class="coursename">${ block.title }</span><br></td></tr>`);
            return;
        }

        let timeRange = `${ format12HourTime(block.startTime) }-${ format12HourTime(block.endTime) }`;

        // start duplicate
        let smallBlock = block.title === block.subtitle || block.subtitle === '' || block.title === 'US C&C';
        let blockNumMatchAttempt = block.subtitle.match(/US \d(?! Flex)/);
        let bgcolor = blockNumMatchAttempt !== null ? colorDict[parseInt(blockNumMatchAttempt[0].slice(-1))] : block.free || block.subtitle.match(/Break/) != null || block.subtitle.match(/Lunch/) != null ? colorDict.free : colorDict[0];
        if (!block.free) {
            block.title = block.title.split(' - ')[0];
            block.subtitle = block.subtitle.split(' • ').slice(-2).reverse().join(' - ').replace('US ', 'Blk ').replace(' Long', '');
        }
        // end duplicate

        $('.special tbody').last().append(`<tr class="${ minsClass }"><td class="times ${ minsClass }">${ timeRange }</td><td rowspan="1" class="period ${ minsClass } specialperiod" style="background: ${ bgcolor };"><span class="coursename">${ block.title }</span>${ (smallBlock ? '' : '<br>') }<span class="subtitle">${ (smallBlock ? '' : block.subtitle) }</span><br></td></tr>`);
    });
}
//</editor-fold>

//<editor-fold desc="Custom rules">
const roboticsManagers = ['Tristan Peng', 'Liam Wang', 'Dylan Smith', 'Avery Pritchard', 'Kristin Cohrs', 'Zachary Robinson', 'Tiffany Toh', 'Eric Wang', 'Mick Leungpathomaram', 'Annika Holliday', 'Audrey Daniels', 'Jeffrey Burt']; // TODO: temporary
function applyCustomBlockRules(daySchedule) {
    if (roboticsManagers.includes(userName)) {
        daySchedule.blocks.forEach(block => {
            if (block.title === 'Co-Curric' && daySchedule.letter === 'B') {
                block.title = 'Robotics Meeting';
                block.subtitle = 'Gerlinger';
                block.free = false;
            } else if (block.title === 'Co-Curric' && daySchedule.letter === 'F') {
                block.title = 'Robotics Manager\'s Meeting';
                block.subtitle = 'Lib 4';
                block.free = false;
            }
        });
    }
    return daySchedule;
}
//</editor-fold>

//<editor-fold desc="Schedule conditions">
function isNormalDay(daySchedule) {
    return daySchedule.blocks.every(block => {
        let startHours = block.startTime.getHours();
        let startMinutes = block.startTime.getMinutes();
        if (isNaN(startHours) || startHours < 8 || startHours >= 12 + 3) return true;
        return normalTimes.some(time => startHours === time.getHours() && startMinutes === time.getMinutes());
    });
}

function isEmptyDay(daySchedule) {
    return daySchedule.blocks.length === 0;
}

//</editor-fold>

//<editor-fold desc="Static date utilities">
function parseVeracrossTime(timeString) {
    let isPm = false;
    if (timeString.includes('am')) {
        timeString = timeString.replace(' am', '');
    }
    if (timeString.includes('pm')) {
        timeString = timeString.replace(' pm', '');
        isPm = true;
    }
    let splitString = timeString.split(':');
    return new Date(0, 0, 0, parseInt(splitString[0]) + (isPm && parseInt(splitString[0]) !== 12 ? 12 : 0), parseInt(splitString[1]));
}

function dateToVeracrossDate(date) {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
}

function format12HourTime(date) {
    return ((date.getHours() - 1) % 12 + 1) + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
}

function getLastFriday(date) {
    let d = new Date(date);
    let day = d.getDay();
    let diff = (day <= 5) ? (7 - 5 + day) : (day - 5);

    d.setDate(d.getDate() - diff);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);

    return d;
}
//</editor-fold>