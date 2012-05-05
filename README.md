Asynchronous loading 3rd-party script using iframe
==================================================

iframed.js is an asynchronous loader for 3rd party's javascript.
It improves site response even if javascript uses document.write()
in a recursive way.

iframed.js includes two method.

* Dynamic injection into iframe. (Firefox 11, Chrome 18, Safari 5, 
  iOS 5.1 Safari, Android 2.3, etc.)

* Friendly iframe. (IE, Opera)

Usage
-----
### Lazy loading ###
Create iframe when onload is fired.

    lazyLoadIframe(id, url, styles, [min_height], [stylesheet])

*   `id` :  
    ID of box element where iframe will be injected.

*   `url` :  
    URL or path to script.

*   `styles` :  
    Styles for iframe. (ex: `"width: 200px; height: 300px"`)

*   `min_height` : (option)  
    Auto height adjustment will stop when the height of iframe reaches at 
    this value. (ex: `"400px"`, If `0` then no adjustment)

*   `stylesheet` : (option)  
    URL or path to style sheet for iframe.

### Crating iframe ###

	createIframe(id, url, styles, min_height, stylesheet)

Notice
------
Make sure to set the right path to `fiframe.html` of `fiframe.min.html` in the 
`iframed.js` or `iframe.min.js` to fit your environment.

License
-------
Copyright &copy; 2012 tokkonopapa  
Free to use and abuse under the [MIT license][MIT].
 
[MIT]: http://www.opensource.org/licenses/mit-license.php
