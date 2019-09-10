<?php
  $html = file_get_contents('https://inside.catlin.edu/scripts/sched/index.php' . strchr($_SERVER['REQUEST_URI'], "?"));
  echo $html;
?>
