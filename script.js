$('html').hide();

function parseQuery() {
  let query = window.location.search.substring(1);
  let array = query.split('&');
  let parsed = {};
  for (let i = 0; i < array.length; i++) {
    let split = array[i].split('=')
    parsed[split[0]] = split[1];
  };
  return parsed;
};

$(document).ready(function () {
  $('.controls').remove();
  $('html').show();
  let query = parseQuery();
  let date = query.date == undefined ? moment() : moment(`${query.date.substring(0, query.date.length - 6)}/${query.date.substring(query.date.length - 6, query.date.length - 4)}/${query.date.substring(query.date.length - 4, query.date.length)}`, 'MM/DD/YYYY');
  let back = date.subtract(7, 'd').format('MMDDYYYY');
  let next = date.add(14, 'd').format('MMDDYYYY');
  let href = {
    back: `index.php?${query.studentid == undefined ?  `studentname=${query.studentname}` : `studentid=${query.studentid}`}&code=${query.code}&range=week&date=${back}`,
    today: `index.php?${query.studentid == undefined ?  `studentname=${query.studentname}` : `studentid=${query.studentid}`}&code=${query.code}&range=today`,
    week: `index.php?${query.studentid == undefined ?  `studentname=${query.studentname}` : `studentid=${query.studentid}`}&code=${query.code}&range=week`,
    cycle: `index.php?${query.studentid == undefined ?  `studentname=${query.studentname}` : `studentid=${query.studentid}`}&code=${query.code}&range=cycle`,
    next: `index.php?${query.studentid == undefined ?  `studentname=${query.studentname}` : `studentid=${query.studentid}`}&code=${query.code}&range=week&date=${next}`,
  };
  let controls = `
    <a href="${href.back}"><button class="btn btn-outline-success btn-control">Back</button></a>
    <a href="${href.today}"><button class="btn btn-outline-success btn-control">Today</button></a>
    <a href="${href.week}"><button class="btn btn-outline-success btn-control">This Week</button></a>
    <a href="${href.cycle}"><button class="btn btn-outline-success btn-control">7 Day Cycle</button></a>
    <a href="${href.next}"><button class="btn btn-outline-success btn-control">Next</button></a>
  `;
  $('.control').append(controls);
});
