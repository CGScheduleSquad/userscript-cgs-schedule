<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <!-- CSS -->
    <!-- Google Fonts --><link href='https://fonts.googleapis.com/css?family=Pangolin' rel='stylesheet' type='text/css'>
    <!-- Font Awesome --><link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
    <!-- CSS Bootstrap --><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
    <!-- style.css --><link rel='stylesheet' href='style.css'/>
    <!-- JS -->
    <!-- jQuery --><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <!-- React --><script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <!-- ReactDOM --><script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    <!-- Popper.js --><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <!-- JS Bootstrap --><script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
    <!-- script.js --><script type='text/javascript' src='script.js'></script>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="/imgs/favicon.ico">
    <title>CGS Schedule</title>
  </head>
  <body>
    <div class="schedule">
      <?php
        echo file_get_contents('https://inside.catlin.edu/scripts/sched/index.php' . strchr($_SERVER['REQUEST_URI'], "?"));
      ?>
    </div>
  </body>
</html>
