# [Teras](https://simplyteras.com/pages/store-locator-test) Store Locator

> Implementation of a Store Locator with an existing backend.

![](screenshot.gif)

# Usage

The only requirement is a webserver which can serve PHP files.

Simply copy this folder onto the `/var/www/html` folder. You can then view it at [localhost/locate.php](http://localhost/locate.php)

# Technologies

- [Bootstrap](https://v5.getbootstrap.com/) - v5.0.0-alpha
- [FontAwesome](https://fontawesome.com/) - v5.13.1
- [jQuery](https://jquery.com/) - v3.5.1
- [Google Maps API](https://developers.google.com/maps/documentation/javascript/examples) - v3
- [Google Maps Info Bubble](https://github.com/googlearchive/js-info-bubble) - Deprecated

# Theme Development

It is suggested to use [VS Code](https://code.visualstudio.com/) for development which offers out of the box features like formatting, prettify, linting etc.

The `CSS` stylesheets are developed with `sass`. You will require `node` and `npm` installed to build the resources.

In order to modify and automatically compile the sources. Run the following:

```bash
# change directory
cd css/theme

# install npm modules
npm install

# watch sass changes and compile
npm run watch
```

# API Modifications

**CRITICAL:** While going through the API, I've noticed that your variables are not properly handled. This may lead to SQL injection in future!

I've updated all `$_POST` to `$_GET` since this is the appropriate one for our case.

Some of the following modifications are required to be made on your backend API for better coding standards and convenient usage of data on the frontend. The changes that I've made are CLEARLY commented at the start with the following `// !`. Here is an example of one such comment in`products.php`.

```php
// ! CHANGES: Form data not required
```

Please make sure to caefuly check out the such comments in each of the files `stores.php` and `prodcuts.php` so that nothing is missed out. The prominent changes are mentioned below.

### stores.php

- Include the following header as the first line since it is JSON response.
  ```php
  header('Content-Type: application/json');
  ```
- Include the field `t0.id` for unique store id reference
- Include the Store's `id` in the response by additional `$row_array['id'] = $row['id'];`
- Rather than imploding the `$skus` and `$upcnumbers`, we associate each `$sku` with the corresponding `$upcnumber` by zipping them together in an array. By doing so we can retain this structure and make use of it on the frontend more easily. The following lines are added

  ```php
  // old lines
  // $skus = implode(',', $skus);
  // $upcnumbers = implode(',', $upcnumbers);

  // new lines
  $row_array["products"] = array();
  foreach ($skus as $i => $sku) {
      $row_array["products"][$i] = array("name" => $sku, "upc" => $upcnumbers[$i]);
  }
  ```

### products.php

- Include the following header as the first line since it is JSON response.
  ```php
  header('Content-Type: application/json');
  ```
- Return the products data as an array rather than HTML. For which, we push the `$row` entirely into the response.
  ```php
  array_push($upclist, $row);
  ```
- JSON encode the response
  ```php
  echo json_encode($upclist);
  ```
