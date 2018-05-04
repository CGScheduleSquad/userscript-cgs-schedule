$('html').hide();

function parseQuery(query) {
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
  $('.specialday').each(function () {
    let special = $(this).children().attr('href').split('?')[1];
    special = parseQuery(special);
    let wrapper = $(this);
    $('.special').load(`schedule.php?${special.studentid == undefined ?  `studentname=${special.studentname}` : `studentid=${special.studentid}`}&code=${special.code}&range=today&date=${special.date}`, function () {
      let html = $('.special > #schedarea').html();
      $('.special').empty();
      $(wrapper)
        .empty()
        .html(html)
        .children('.sched.today').children('tbody').children('tr:first-child').remove();
      $(wrapper).children('.sched.today').height($('.specialday').outerHeight());
    });
  });
  $('html').fadeIn(500);
  let query = parseQuery(window.location.search.substring(1));
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
    <a data-href="${href.back}"><button class="btn btn-outline-success btn-control">Back</button></a>
    <a data-href="${href.today}"><button class="btn btn-outline-success btn-control">Today</button></a>
    <a data-href="${href.week}"><button class="btn btn-outline-success btn-control">This Week</button></a>
    <a data-href="${href.cycle}"><button class="btn btn-outline-success btn-control">7 Day Cycle</button></a>
    <a data-href="${href.next}"><button class="btn btn-outline-success btn-control">Next</button></a>
  `;
  $('.control').append(controls);
  $('.btn-control').click(function () {
    let controlHref = $(this).parent().attr('data-href');
    $('html').fadeOut(500, function () {
      window.location.href = controlHref;
    });
  });
});
