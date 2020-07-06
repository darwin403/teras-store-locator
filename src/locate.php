<?php

// PHP Variables
$BRAND = isset($_GET['brand']) ? stripslashes(trim($_GET['brand'])) : "Teras";
$ICON_COLOR = isset($_GET['iconcolor']) ? stripslashes(trim($_GET['iconcolor'])) : "#3d86b1";
$SEARCH_TIME = isset($_GET['searchtimeinmonths']) ? stripslashes(trim($_GET['searchtimeinmonths'])) : 3;
$RADIUS = isset($_GET['radiuslength']) ? stripslashes(trim($_GET['radiuslength'])) : 50;
$LIMIT = isset($_GET['resultslimit']) ? stripslashes(trim($_GET['resultslimit'])) : 25;

// Include PHP Variables
include_once 'include/options_' . strtolower($BRAND) . '.php';

$HAS_STORES = isset($online_sources);
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Store Locator</title>

  <!-- CSS Custom Library-->
  <link rel="stylesheet" href="css/theme/<?php echo strtolower($BRAND); ?>.css" />
</head>

<body>
  <!-- Main Search -->
  <div class="container-fluid" id="search-main">
    <div class="row g-0">
      <div class="col-lg-auto">
        <button type="button" class="btn btn-primary btn-block btn-lg" onclick="searchStores.gps();">
          <i class="fas fa-location-arrow mr-2"></i> SEARCH NEARBY
        </button>
      </div>
      <div class="col-lg mt-3 mt-md-0">
        <div class="row g-0">
          <div class="col-sm-6">
            <input id="address-main" type="text" class="form-control form-control-lg" placeholder="City, Zip Code, or Address" onchange="handle.address.change('main')" />
          </div>
          <div class="col-sm">
            <button type="button" class="btn btn-primary btn-lg btn-block" onclick="searchStores.address();">
              FIND <i class="fas fa-search ml-2"></i>
            </button>
          </div>
          <div class="col-sm" style="display:none;" id="col-modal">
            <button type="button" class="btn btn-primary btn-lg btn-block" data-toggle="modal" data-target="#online-modal">
              BUY ONLINE <i class="fas fa-desktop ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Container -->
  <div class="container-fluid" id="results-main">
    <div class="row g-0">
      <div class="col" id="col-sidebar">
        <div class="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>

        <!-- Products -->
        <div id="products">
          <ul class="list-group list-group-flush">
            <!-- Header -->
            <li class="list-group-item">
              <div class="d-flex w-100 align-items-center justify-content-between">
                <span>Search Product(s)</span>
                <button type="button" class="btn btn-link" onclick="handle.popup.close();">
                  <i class="fas fa-arrow-left mr-1"></i> Back to results
                </button>
              </div>
            </li>
            <!-- Filters -->
            <li class="list-group-item">
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-primary btn-sm mr-1" onclick="searchStores.products();">
                  Apply
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm ml-1" onclick="handle.upc.clear();">
                  Clear
                </button>
              </div>
            </li>
          </ul>

          <!-- Results -->
          <div class="row g-0" id="product-results"></div>
        </div>
        <!-- Stores -->
        <div id="stores">
          <!-- Search Bar -->
          <div class="row g-0">
            <div class="col-auto">
              <button class="btn btn-primary" onclick="searchStores.gps();">
                <i class="fas fa-location-arrow"></i>
              </button>
            </div>
            <div class="col">
              <input id="address-sidebar" type="text" class="form-control" placeholder="City, Zip Code, or Address" onchange="handle.address.change('sidebar')" />
            </div>
            <div class="col-auto">
              <button class="btn btn-primary" onclick="searchStores.address();">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          <!-- Header -->
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <div class="d-flex w-100 align-items-center justify-content-between">
                <span>Search Result(s)</span>
                <button type="button" class="btn btn-light" onclick="show.products();">
                  Search by Product
                </button>
              </div>
            </li>
          </ul>
          <!-- Results -->
          <ul class="list-group list-group-flush" id="stores-results" data-scrollTop="0"></ul>
        </div>

        <!-- Store -->
        <div id="store">
          <!-- Header -->
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <div class="d-flex w-100 align-items-center justify-content-between">
                <span>Store</span>
                <button type="button" class="btn btn-link" onclick="handle.popup.close();">
                  <i class="fas fa-arrow-left mr-1"></i> Back to results
                </button>
              </div>
            </li>
          </ul>
          <!-- Result -->
          <div id="store-result">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <h3 id="store-name"></h3>
                <p id="store-details"></p>
                <div class="alert alert-secondary" role="alert" id="store-products-availability"></div>
              </li>
            </ul>
            <div class="row g-0" id="store-products"></div>
          </div>
        </div>
      </div>

      <!-- Google Maps -->
      <div class="col d-none d-md-block" id="col-map">
        <div class="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div id="map"></div>
      </div>
    </div>
  </div>


  <!-- Modal -->
  <div class="modal" id="online-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <?php
          echo $online_sources;
          ?>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>

      </div>
    </div>
  </div>

</body>

<!-- Javascript External Libraries -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/js/all.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBCYSSZRMXdDSsz1wL8Ya9o2B1T6xiqJpA"></script>
<script src="https://googlearchive.github.io/js-info-bubble/src/infobubble-compiled.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.0-alpha1/js/bootstrap.min.js"></script>

<!-- Javascript Custom Variables -->
<script type="text/javascript">
  /**************
   * PROPERTIES *
   **************/
  var BRAND = "<?php echo $BRAND; ?>";
  var BRAND_BASE = "Teras_";
  var CENTER_INITIAL = {
    lat: 39.8283,
    lng: -98.5795,
  };
  var RADIUS = <?php echo $RADIUS; ?>;
  var LIMIT = <?php echo $LIMIT; ?>;
  var SEARCH_TIME = <?php echo $SEARCH_TIME; ?>;
  var ICON_COLOR = "<?php echo $ICON_COLOR; ?>";
  var MARKER_ICON = "images/marker_<?php echo strtolower($BRAND); ?>.png";
  var HAS_STORES = <?php echo $HAS_STORES ? "true" : "false"; ?>;
</script>

<!-- Javascript Custom Libraries -->
<script src="js/index.js"></script>

</html>