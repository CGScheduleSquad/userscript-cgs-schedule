$(document).ready(function () {
  function parseQueryString() {
    var str = window.location.search;
    var objURL = {};
    str.replace(
      new RegExp("([^?=&]+)(=([^&]*))?", "g"),
      function ($0, $1, $2, $3) {
        objURL[$1] = $3;
      }
    );
    return objURL;
  };
  var params = parseQueryString();
  var query = window.location.search;
  var specialHref;
  var splitSH;
  var specialUseful;
  var splitQuery;
  var query1;
  var query2;
  var specialHTML;
  $('.schedule').load('schedule.php' + query, function () {
    var studentName = $('.mainlabel').text();
    $('.mainlabel').replaceWith('<div class="dropdown"><span class="dropdown-toggle dropdown-cursor mainlabel center" type="button" data-toggle="dropdown">' + studentName + '&nbsp;<span class="caret"></span></span><ul class="dropdown-menu"><li><a data-toggle="modal" data-target="#settings"><i class="fa fa-sliders"></i>&nbsp;&nbsp;Settings</a></li><li><a href="update.html"><i class="fa fa-gift"></i>&nbsp;&nbsp;Updates</a></li><li><a href="mailto:pengt@catlin.edu"><i class="fa fa-envelope-o"></i>&nbsp;&nbsp;Email Tristan</a></li></ul>');
    $('.specialday > a').each(function () {
      specialHref = $(this).attr('href');
      splitSH = specialHref.split('&');
      specialUseful = splitSH[3];
      splitQuery = query.split('&');
      query1 = splitQuery[0].substring(1);
      query2 = splitQuery[1];
      specialHTML = $(this).load('schedule.php?' + query1 + '&' + query2 + '&range=today&' + specialUseful)[0].outerHTML;
      console.log(specialHTML);
    });
    $('.controls').remove();
    $('.specialday').each(function () {
      $(this).children('table:first').children('tbody:first').children('tr:first').remove();
      $(this).children('table:first').css('height', '100%');
    });
    var bgcolor;
    $('td').each(function () {
      bgcolor = $(this).attr('bgcolor');
      switch (bgcolor) {
        case '#FFCE51':
          $(this).addClass('block-1');
          break;
        case '#A67FB9':
          $(this).addClass('block-2');
          break;
        case '#E67326':
          $(this).addClass('block-3');
          break;
        case '#00ABBD':
          $(this).addClass('block-4');
          break;
        case '#AAC02C':
          $(this).addClass('block-5');
          break;
        case '#EF4957':
          $(this).addClass('block-6');
          break;
        case '#FF75F2':
          $(this).addClass('block-7');
          break;
      }
    });
    var block;
    var addLink;
    var addName;
    var newTab;
    var oldCookie;
    var string;
    $('.add-url-submit').click(function () {
      var linkArr = [];
      block = $('.block').val();
      addLink = $('.add-url').val();
      addName = $('.add-url-name').val();
      newTab = $('.new-tab').is(':checked');
      oldCookie = getCookie(block);
      $('.' + block + ' > .dropdown > .dropdown-menu').prepend('<li><a class="outlink" href="' + addLink + '">' + addName + '</a></li>');
      if (newTab) {
        $('.outlink').attr('target', '_blank');
        linkArr.push('<li><a class="outlink" target="_blank" href="' + addLink + '">' + addName + '</a></li>');
      } else {
        linkArr.push('<li><a class="outlink" href="' + addLink + '">' + addName + '</a></li>');
      }
      string = JSON.stringify(linkArr);
      if (oldCookie != undefined) {
        oldCookie = oldCookie.replace(/\[|\]/g, '');
        string = string.replace(/\[|\]/g, '');
        document.cookie = block + '=[' + oldCookie + ',' + string + ']; expires=Fri, 31 Dec 9999 23:59:59 GMT'
      } else {
        document.cookie = block + '=' + string + '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
      }
      $('.add-url').val('');
      $('.add-url-name').val('');
    });
    var linkCookie;
    var parse;
    var blockNum;
    $(document).ready(function () {
      for (i = 1; i < 8; i++) {
        if (getCookie('block-' + i) != undefined) {
          linkCookie = getCookie('block-' + i);
          parse = JSON.parse(linkCookie);
          blockNum = 'block-' + i;
          for (x in parse) {
            $('.' + blockNum + ' > .dropdown > .dropdown-menu').each(function () {
              $(this).prepend(parse[x]);
            });
          }
        }
      }
    });
    function addDropdown(i) {
      $('.block-' + i + ' > .coursename').each(function () {
        var courseName = $(this).text();
        $(this).replaceWith('<div class="dropdown"><span class="dropdown-toggle dropdown-cursor" type="button" data-toggle="dropdown">' + courseName + '&nbsp;<span class="caret"></span></span><ul class="dropdown-menu"><li class="notes-li" style="text-align: center;">Notes: <br><textarea class="notes form-control" style="width: 80%; margin: auto;" placeholder="Notes"></textarea></li></ul></div>');
      });
    }
    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) {
        return parts.pop().split(";").shift();
      }
    }
    function cookieNotes(i) {
      $('.b' + i + '-notes').keypress(function () {
        document.cookie = 'block' + i + '=' + $(this).val() + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
        if (event.which == 13) {
          event.preventDefault();
          $('.b' + i + '-notes').val(getCookie('block' + i));
        }
      });
      $('.b' + i + '-notes').val(getCookie('block' + i));
    }
    function deleteCookie(name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    for (i = 0; i < 8; i++) {
      addDropdown(i);
      $('.block-' + i + ' > .dropdown > .dropdown-menu > .notes-li > .notes').addClass('b' + i + '-notes');
      cookieNotes(i);
    }
    var backgroundColor;
    var backgroundUrl;
    $('.background-color-submit').click(function () {
      backgroundColor = $('.background-color').val();
      $('body').css('background-color', backgroundColor);
      document.cookie = 'backgroundcolor=' + backgroundColor + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
      deleteCookie('backgroundurl');
    });
    $('.background-url-submit').click(function () {
      backgroundUrl = $('.background-url').val();
      $('body').css('background', 'url(' + backgroundUrl + ') center');
      document.cookie = 'backgroundurl=' + backgroundUrl + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
      deleteCookie('backgroundcolor');
    });
    if (getCookie('backgroundcolor') != undefined) {
      $('body').css('background-color', getCookie('backgroundcolor'));
    }
    if (getCookie('backgroundurl') != undefined) {
      $('body').css('background', 'url(' + getCookie('backgroundurl') + ')');
    }
    $('.text-color-submit').click(function () {
      $('td.times, .daylabel, .mainlabel, .links > a, .specialday > a').css('color', $('.text-color').val());
      $('.fix-red').css('color', 'red !important');
      document.cookie = 'text-color=' + $('.text-color').val() + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
    });
    if (getCookie('text-color') != undefined) {
      $('td.times, .daylabel, .mainlabel, .links > a, .specialday > a').css('color', getCookie('text-color'));
    }
    $('.border-toggle').change(function () {
      if ($(this).is(':checked')) {
        $('table > tbody > tr > td').each(function () {
          $(this).attr('style', '');
        });
        document.cookie = 'border=true; expires=Fri, 31 Dec 9999 23:59:59 GMT';
      } else if (!$(this).is(':checked')) {
        $('table > tbody > tr > td').each(function () {
          $(this).attr('style', 'border: none !important');
        });
        document.cookie = 'border=false; expires=Fri, 31 Dec 9999 23:59:59 GMT';
      }
    });
    var border;
    if (getCookie('border') != undefined) {
      if (!JSON.parse(getCookie('border'))) {
        border = 'none !important';
        $('table > tbody > tr > td').each(function () {
          $(this).attr('style', border);
        });
        $('.border-toggle').bootstrapToggle('disable');
      } else {
        $('.border-toggle').bootstrapToggle('enable');
      }
    } else {
      $('.border-toggle').bootstrapToggle('enable');
    }
    $('.general-notes').keypress(function () {
      document.cookie = 'notes=' + $(this).val() + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
      if (event.which == 13) {
        event.preventDefault();
        $('.general-notes').val(getCookie('notes'));
      }
    });
    $('.general-notes').val(getCookie('notes'));
    // $('.period').each(function () {
    //   if ($(this).text() == 'C&C - US Library') {
    //     $(this).replaceWith('<td class="period mins10" style="background: rgb(192, 192, 192); border: ' + border + ';"><div class="dropdown"><span class="dropdown-toggle dropdown-cursor" type="button" data-toggle="dropdown">C&C<span class="subtitle"> - US Library</span>&nbsp;<span class="caret"></span></span><ul class="dropdown-menu"><li><a href="mailto:whytet@catlin.edu">Email Tien</a></li><li><a href="mailto:phillipss@catlin.edu">Email Sue</a></li></ul></td>');
    //   }
    // });
    $('td.controls.arrows:first > a > img').replaceWith('<img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Orange_animated_left_arrow.gif" height="50">');
    $('td.controls.arrows:last-child > a > img').replaceWith('<img src="https://upload.wikimedia.org/wikipedia/commons/1/13/Green-animated-arrow-right.gif" height="50">');
    var day = new Date().getDay();
    var month = new Date().getMonth();
    var date = new Date().getDate();
    var dayLabel;
    var dayName;
    var timeName;
    var hour = new Date().getHours();
    var time = hour * 60 + new Date().getMinutes();
    setInterval(function () {
      hour = new Date().getHours();
      time = hour * 60 + new Date().getMinutes();
    }, 300000);
    switch (month) {
      case 0:
      month = 'Jan';
      break;
      case 1:
      month = 'Feb';
      break;
      case 2:
      month = 'Mar';
      break;
      case 3:
      month = 'Apr';
      break;
      case 4:
      month = 'May';
      break;
      case 5:
      month = 'Jun';
      break;
      case 6:
      month = 'Jul';
      break;
      case 7:
      month = 'Aug';
      break;
      case 8:
      month = 'Sep';
      break;
      case 9:
      month = 'Oct';
      break;
      case 10:
      month = 'Nov';
      break;
      case 11:
      month = 'Dec';
      break;
    }
    var today = month + ' ' +  date;
    $('.times').each(function () {
      timeName = $(this).text();
      if ((480 <= time && time < 525) && timeName == '8:00-8:45') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      } else if ((525 <= time && time <= 555) && timeName == '8:45-9:15') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      } else if ((560 <= time && time < 570) && timeName == '9:20-9:30') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      } else if ((570 <= time && time <= 580) && timeName == '9:30-9:40') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      } else if ((585 <= time && time <= 630) && timeName == '9:45-10:30') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      } else if ((635 <= time && time < 680) && timeName == '10:35-11:20') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      } else if ((680 <= time && time <= 710) && timeName == '11:20-11:50') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      } else if ((715 <= time && time < 750) && timeName == '11:55-12:30') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      } else if ((750 <= time && time <= 785) && timeName == '12:30-1:05') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      } else if ((790 <= time && time < 820) && timeName == '1:10-1:40') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      } else if ((820 <= time && time <= 865) && timeName == '1:40-2:25') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      } else if ((870 <= time && time <= 915) && timeName == '2:30-3:15') {
        $(this).attr('style', 'color: red !important; border:' + border);
        $(this).addClass('fix-red');
      }
    });
    /* $('.sched.week > tbody').append('<tr><td><div class="timeline"><div class="circle"></div><hr style="border: 1px solid red; width: ' + ($(document).width() - 35) + 'px; position: absolute;"></div></td></tr>');
    $('.sched.week > tbody').prepend('<tr class="time-start"><td></td></tr>');
    var tableHeight = $('.sched.week').height();*/
    var dLSub;
    $('.daylabel').each(function () {
      dayLabel = $(this).text();
      if (dayLabel.indexOf('(') >= 0) {
        dLSub = dayLabel.substring(4, dayLabel.length - 4);
      } else {
        dLSub = dayLabel.substring(4, dayLabel.length);
      }
      if (dayLabel.indexOf('Mon') >= 0) {
        dayName = 1;
      } else if (dayLabel.indexOf('Tue') >= 0) {
        dayName = 2;
      } else if (dayLabel.indexOf('Wed') >= 0) {
        dayName = 3;
      } else if (dayLabel.indexOf('Thu') >= 0) {
        dayName = 4;
      } else if (dayLabel.indexOf('Fri') >= 0) {
        dayName = 5;
      }
      if (dayName == day && today == dLSub) {
        $(this).css('color', 'red');
        $(this).addClass('fix-red');
      }
    });
    $('.tooltip-toggle').tooltip();
  });
});
