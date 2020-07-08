<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Parent</title>

    <style>
      .iframe-container {
        width: 100%;
        height: 300px;
      }

      iframe {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>

  <body>
    <!-- Load iframe -->
    <div class="iframe-container">
      <iframe
        src="locate.php?brand=Teras&radiuslength=50&iconcolor=3d86b1&searchtimeinmonths=3&resultslimit=25"
      ></iframe>
    </div>
  </body>

  <!-- Javascript External Libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

  <!-- Javascript Custom -->
  <script type="text/javascript">
    window.onmessage = function (e) {
      // Update iframe height
      if (e.data === "stores-results") {
        console.log("Results fetched!");

        $("iframe").css("height", "500px");
      }
    };
  </script>
</html>
