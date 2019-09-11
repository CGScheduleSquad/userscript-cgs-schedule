// ==UserScript==
// @name         Veracross CGS Schedule
// @version      0.17
// @description  Bring the old CGS schedule view to the Veracross student schedule.
// @author       Liam Wang & Tristan Peng
// @namespace    https://greasyfork.org/users/118299
// @match        https://portals.veracross.com/catlin/student/student*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @resource     html https://raw.githubusercontent.com/wangl5/veracross-cgs-schedule/master/userscripts/veracross-simple-schedule.html
// @grant        GM_getResourceText
// @run-at       document-start
// ==/UserScript==

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

const managers = ['Tristan Peng', 'Liam Wang', 'Dylan Smith', 'Avery Pritchard', 'Kristin Cohrs', 'Zachary Robinson', 'Tiffany Toh', 'Eric Wang', 'Mick Leungpathomaram', 'Annika Holliday', 'Audrey Daniels', 'Jeffrey Burt']; // TODO: temporary

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

if (window.location.href.match(/legacy/)) {
    // noinspection JSUnresolvedFunction
    document.documentElement.innerHTML = GM_getResourceText("html");

    const date = new URL(window.location.href).searchParams.get("date");
    const seedDate = date !== null ? new Date(date) : new Date();
    const thisMonday = getLastFriday(seedDate);
    thisMonday.setDate(thisMonday.getDate() + 3);
    const previousMonday = new Date(thisMonday);
    const nextMonday = new Date(thisMonday);

    previousMonday.setDate(thisMonday.getDate() - 7);
    nextMonday.setDate(thisMonday.getDate() + 7);
    $('table').hide();
    Promise.all(getVeracrossWeekDateStrings(new Date(thisMonday)).map(getScheduleForDate)).then(res => {
        res.forEach(appendDay);
        $('.mainlabel b').text(userName);
        $('table').show();
    });

    $('td.arrows a')
        .first()
        .prop('href', '?date=' + dateToVeracrossDate(previousMonday));
    $('td.arrows a')
        .last()
        .prop('href', '?date=' + dateToVeracrossDate(nextMonday));
    $('td.controls.links a').last().prop('href', '/catlin/student/student/daily-schedule?date=' + dateToVeracrossDate(seedDate));
    window.onload = () => $('body > .dialog').remove();
} else {
    window.onload = () => $('div.vx-Tabs').append(`
    <a class="vx-Tab_Item" onclick="window.location = 'legacy' + window.location.search;" style="color: #ff5959;">
      <div class="vx-Tab_Icon">
        <i class="nc-icon-glyph media-1_flash-21"></i>
      </div>
      <div class="vx-Tab_Description">CGS Schedule</div>
    </a>
  `);
}

function addSpecialDay(text, bgcolor, link = '') {
    return $('table.sched.main > tbody > tr:nth-child(2)').append(`<td rowspan="12" class="specialday" style="background: ${ bgcolor };"><a ${ (link === '' ? '' : `href=${ link }`) } class="coursename">${ text }</a></td>`);
}

function appendDay(daySchedule) {
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $('table.sched.main > tbody > tr:nth-child(1)').append(`
    <td class="daylabel">
      <a href="/catlin/student/student/daily-schedule?date=${ dateToVeracrossDate(daySchedule.date) }">
        <b>
          ${ days[daySchedule.date.getDay()] } ${ months[daySchedule.date.getMonth()] } ${ daySchedule.date.getDate() + (!daySchedule.letter ? '' : ` (${ daySchedule.letter })`) }
        </b>
      </a>
    </td>
    `);
    if (isEmptyDay(daySchedule)) {
        addSpecialDay('No Events', colorDict.free);
    } else if (isNormalDay(daySchedule)) {
        addTableData(applyCustomRules(prepTableDataDay(trimDay(daySchedule))));
    } else {
        addInlineDay(applyCustomRules(trimDay(daySchedule)));
    }
}

function getVeracrossWeekDateStrings(mondayDate) {
    let dates = [];
    for (let i = 0; i < 5; i++) {
        dates.push(dateToVeracrossDate(mondayDate));
        mondayDate.setDate(mondayDate.getDate() + 1);
    }
    return dates;
}

function applyCustomRules(daySchedule) {
    if (managers.includes(userName)) {
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


function addInlineDay(daySchedule) {
    $('table.sched.main > tbody > tr:nth-child(2)').append(`<td rowspan="12" class="specialday" style="border-top-style: solid; border-right-style: solid; border-bottom: 0px; border-left-style: solid;"><table class="sched week special"><tbody>`);

    daySchedule.blocks[0].startTime.getTime() !== normalTimes[0].getTime() &&
    daySchedule.blocks.unshift({'startTime': normalTimes[0], 'title': 'Late Start', 'subtitle': '', 'rowSpan': 1});

    daySchedule.blocks.forEach((block, index) => {
        block.endTime = index === daySchedule.blocks.length - 1 ? schoolEndTime : daySchedule.blocks[index + 1].startTime;
        block.mins = Math.min(Math.max(new Date(block.endTime.getTime() - block.startTime.getTime()).getTime() / 1000 / 60, 5), 90);
    });

    daySchedule.blocks.forEach(block => {
        let minsClass = `mins${ block.mins }`;

        if (block.title === 'Late Start') {
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

function addTableData(daySchedule) {
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

function prepTableDataDay(daySchedule) {
    let newBlocks = [];
    normalTimes.forEach(time => {
        let blockWithTime = daySchedule.blocks.find(block => block.startTime.getTime() === time.getTime());
        newBlocks.push(blockWithTime === undefined ? null : blockWithTime);
    });

    for (let i = 0; i < newBlocks.length; i++) {
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
    newBlocks.forEach(block => {
        block.mins = Math.min(Math.max(new Date(normalAllTimes[timeIndex + block.rowSpan].getTime() - normalAllTimes[timeIndex].getTime()).getTime() / 1000 / 60, 5), 90);
        timeIndex = timeIndex + block.rowSpan;
    });

    daySchedule.blocks = newBlocks;
    return daySchedule;
}

function trimDay(daySchedule) {
    daySchedule.blocks = daySchedule.blocks.filter(block => {
        let startHours = block.startTime.getHours();
        if (startHours < 8 || startHours >= 12 + 3) return false;
        return !daySchedule.blocks.some((otherBlock) => { // keep longer description one (TODO: show conflict)
            let sameTime = block.startTime.getTime() === otherBlock.startTime.getTime();
            if (sameTime) deleteNextSameTime = true;
            return sameTime && (block.title.length < otherBlock.title.length || block.subtitle.length < otherBlock.subtitle.length);
        });
    });
    return daySchedule;
}

function getScheduleForDate(dateString) {
    return new Promise(function (resolve) {
        $.get(`https://portals.veracross.com/catlin/student/student/daily-schedule?date=${ dateString }`, data => {
            let arr = [];
            $(data).find('.schedule .schedule-item').each((index, value) => {
                let timeString = $(value).find('.item-time').text().replace('NOW', '').trim();
                let startTime = parseVeracrossTime(timeString);
                let title = $(value).find('.item-main-description').text().trim();
                let subtitle = $(value).find('.item-subtitle').text().trim();
                arr.push({startTime, title, subtitle, rowSpan: 1});
            });
            let splitDate = dateString.split('-');
            let date = new Date(splitDate[0], splitDate[1] - 1, splitDate[2]);
            let letter = $(data).find('.rotation-day-header').text().trim().slice(-1);
            if (userName === '') {
                userName = data.match(/full_name: "[A-z ]+(?=",)/)[0].split('"')[1];
            }
            resolve({date, letter, blocks: arr});
        }).fail(() => window.location.href = "https://portals.veracross.com/catlin"); // user was not logged in, redirect them to login page
    });
}

//<editor-fold desc="Schedule conditions">
function isNormalDay(daySchedule) {
    return daySchedule.blocks.every(block => {
        let startHours = block.startTime.getHours();
        let startMinutes = block.startTime.getMinutes();
        if (startHours < 8 || startHours >= 12 + 3) return true;
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