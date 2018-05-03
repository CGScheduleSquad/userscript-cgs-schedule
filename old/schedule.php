<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <?php
      header('Content-type: application/xml');
      $id = $_GET['studentid'];
      $code = $_GET['code'];
      $range = $_GET['range'];
      $name = $_GET['studentname'];
      $faculty = $_GET['facultyid'];
      $date = $_GET['date'];
      if ($id != '') {
        if ($date != '') {
          echo file_get_contents('https://inside.catlin.edu/scripts/sched/index.php?studentid=' . $id . '&code=' . $code . '&range=' . $range . '&date=' . $date);
        } else {
          echo file_get_contents('https://inside.catlin.edu/scripts/sched/index.php?studentid=' . $id . '&code=' . $code . '&range=' . $range);
        }
      } elseif ($name != '') {
        if ($date != '') {
          echo file_get_contents('https://inside.catlin.edu/scripts/sched/index.php?studentname=' . $name . '&code=' . $code . '&range=' . $range . '&date=' . $date);
        } else {
          echo file_get_contents('https://inside.catlin.edu/scripts/sched/index.php?studentname=' . $name . '&code=' . $code . '&range=' . $range);
        }
      } elseif ($faculty != '') {
        if ($date != '') {
          echo file_get_contents('https://inside.catlin.edu/scripts/sched/index.php?facultyid=' . $faculty . '&code=' . $code . '&range=' . $range . '&date=' . $date);
        } else {
          echo file_get_contents('https://inside.catlin.edu/scripts/sched/index.php?facultyid=' . $faculty . '&code=' . $code . '&range=' . $range);
        }
      }
    ?>
  </head>
  <body></body>
</html>
