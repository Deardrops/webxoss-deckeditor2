<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <script>
      global = window;
    </script>
    <script src="//webxoss.com/CardInfo.js"></script>
    <title>Deck Editor</title>
  </head>
  <body>
    <div id="app"></div>
    <script async>
      var el = document.createElement('div')
      el.style.width = '100vw'
      if (el.style.width !== '100vw') {
        var msg = [
          'Sorry, this browser is not supported by WEBXOSS :(',
          'For Android <= 4.3, please download Google Chrome.',
          'For iOS <= 7, please update your system.',
        ].join('\n')
        window.alert(msg)
      }
    </script>
  </body>
</html>