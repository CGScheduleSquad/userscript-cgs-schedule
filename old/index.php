<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <!-- CSS -->
    <!-- style.css --><link rel='stylesheet' href='css/style.css'/>
    <!-- Google Fonts --><link href='https://fonts.googleapis.com/css?family=Open+Sans|Montserrat|Raleway' rel='stylesheet' type='text/css'>
    <!-- Font Awesome --><link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
    <!-- CSS Bootstrap --><link rel="stylesheet" href="css/bootstrap.css">
    <!-- Bootstrap Toggle --><link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
    <!-- JS -->
    <!-- jQuery --><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <!-- jQuery UI --><script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>
    <!-- JS Bootstrap --><script src="js/bootstrap.js"></script>
    <!-- Bootstrap Toggle --><script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
    <!-- script.js --><script type='text/javascript' src='js/script.js'></script>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="/imgs/favicon.ico">
    <title>Catlin Schedule</title>
  </head>
  <body>
    <div class="schedule container-fluid"></div>
    <div id="settings" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title"><i class="fa fa-sliders"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Settings</h4>
          </div>
          <div class="modal-body center">
            <div class="row">
              <div class="col-sm-12">
                <h5><button class="btn btn-info" data-toggle="modal" data-target="#background">Change Background</button></h5>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-12">
                <h5>Add links&nbsp;<a href="#" class="tooltip-toggle" data-toggle="tooltip" title="To add email link: mailto:someone@example.com, also uncheck open in new tab"><i class="fa fa-question-circle link-help" style="color: black;"></i></a></h5>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <select class="block" style="width: 100%;">
                  <option value="block-1">Block 1</option>
                  <option value="block-2">Block 2</option>
                  <option value="block-3">Block 3</option>
                  <option value="block-4">Block 4</option>
                  <option value="block-5">Block 5</option>
                  <option value="block-6">Block 6</option>
                  <option value="block-7">Block 7</option>
                </select>
              </div>
              <div class="col-sm-6">
                <form>
                  <div class="input-group">
                    <input type="text" class="form-control add-url" placeholder="https://www.google.com" style="width: 140%;">
                  </div>
                </form>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6"></div>
              <div class="col-sm-6">
                <form>
                  <div class="input-group">
                    <input type="text" class="form-control add-url-name" placeholder="Name">
                    <div class="input-group-btn">
                      <button class="btn btn-success add-url-submit" type="button">
                        <i class="fa fa-check"></i>
                      </button>
                    </div>
                  </div>
                  <input type="checkbox" class="new-tab" checked>&nbsp;Open in new tab
                </form>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-6">
                <h5>Change Text Color</h5>
              </div>
              <div class="col-sm-6">
                <input type="color" class="text-color">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button type="button" class="btn btn-success text-color-submit">Submit</button>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-6">
                <h5>Toggle Borders</h5>
              </div>
              <div class="col-sm-6">
                <input type="checkbox" class="border-toggle" data-toggle="toggle">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="background" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Background</h4>
          </div>
          <div class="modal-body center">
            <div class="row">
              <div class="col-sm-6">
                <h5>Upload Background Photo</h5>
              </div>
              <div class="col-sm-6">
                <form>
                  <div class="input-group">
                    <input type="text" class="form-control background-url" placeholder="https://www.google.com">
                    <div class="input-group-btn">
                      <button class="btn btn-success background-url-submit" type="button">
                        <i class="fa fa-check"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-6">
                <h5>Change Background Color</h5>
              </div>
              <div class="col-sm-6">
                <input type="color" class="background-color">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button type="button" class="btn btn-success background-color-submit">Submit</button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <textarea class="form-control general-notes navbar-fixed-bottom" placeholder="Notes" rows="5"></textarea>
  </body>
</html>
