/*
 * iframed.js v1.3
 * https://github.com/tokkonopapa/iframed.js
 *
 * iframed.js is an asynchronous loader for 3rd party's javascript.
 * This improves the site response even if the script uses document.write()
 * in a recursive way.
 *
 * NOTICE: Make sure to set the path to your 'fiframe.html'
 *
 * Copyright 2013, tokkonopapa
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
var _iframed = _iframed || {
	// 'dynamic', 'static' or other
	mode: 'dynamic',

	// path to the static file
	path: 'fiframe.html'
};

/*
 * Friendly Iframe main function
 */
function createIframe(id, script_src, style, min_height, stylesheet) {
	// Keep params in iframe object
	var iframe = document.createElement('iframe');
	iframe.id = id + '-iframe';
	iframe.min_height = min_height ? parseInt (min_height) : 0;
	iframe.script_src = script_src ? encodeURI(script_src) : null;
	iframe.stylesheet = stylesheet ? encodeURI(stylesheet) : null;

	// Styles
	// http://nanto.asablo.jp/blog/2005/10/29/123294
	// need `body { background-color: transparent; }` in stylesheet.
	// var elem = iframe.frameElement || iframe;
	iframe.style.cssText = style;
	iframe.setAttribute('frameborder', 0);
	iframe.setAttribute('scrolling', 'no');
	iframe.setAttribute('marginheight', 0);
	iframe.setAttribute('marginwidth', 0);
	iframe.setAttribute('allowtransparency', 'true');

	// Friendly Iframe should be static for Opera and old IE because of security
	var isStatic = (navigator.userAgent.indexOf('Opera') >= 0) || (/*@cc_on!@*/false);

	// Attach first to make body in iframe
	if (('static' === _iframed.mode) || ('dynamic' !== _iframed.mode && isStatic)) {
		iframe.src = _iframed.path;
		document.getElementById(id).appendChild(iframe);
	} else if (('dynamic' === _iframed.mode) || ('static' !== _iframed.mode && !isStatic)) {
		iframe.src = "javascript:false";
		document.getElementById(id).appendChild(iframe);

		// Contents in iframe
		var html = '<head>';

		// Some scripts need canonical link
		for (var links = document.getElementsByTagName('link'), n = links.length; --n >= 0;) {
			if (links[n].getAttribute('rel') === 'canonical') {
				html += '<link rel="canonical" href="' + links[n].getAttribute('href') + '" \/>';
				break;
			}
		}

		// Add stylesheet
		if (iframe.stylesheet) {
			html += '<link rel="stylesheet" mode="text/css" href="' + iframe.stylesheet + '" media="all" \/>';
		}

		// Reset some styles
		html += '<style>';
		html += '	body { margin: 0; padding: 0; }';
		html += '<\/style>';

		// Onload event handler
		html += '<script>';
		html += 'function resizeIframe() {';
		html += '	for (var a = document.getElementsByTagName("a"), b = a.length, c; --b >= 0;) {';
		html += '		c = a[b].getAttribute("target");';
		html += '		if ("_top" === c) {';
		html += '			break;';
		html += '		} else if ("_blank" !== c) {';
		html += '			a[b].setAttribute("target", "_top");';
		html += '		}';
		html += '	}';
		html += '	var a = document.body,';
		html += '		b = document.documentElement,';
		html += '		c = Math.max(a.offsetTop, 0),';
		html += '		d = Math.max(b.offsetTop, 0),';
		html += '		e = a.scrollHeight + c,';
		html += '		f = a.offsetHeight + c,';
		html += '		g = b.scrollHeight + d,';
		html += '		h = b.offsetHeight + d,';
		html += '		i = Math.max(e, f, g, h);';
		html += '	if (b.clientTop > 0) i += (b.clientTop * 2);';
		html += '	var iframe = window.frameElement;';
		html += '	var elem = window.parent.document.getElementById(iframe.id);';
		html += '	elem.style.height = i + "px";';
		html += '	elem.parentNode.style.height = i + "px";';
//		html += '	window.parent.console.log("onloadIframe(" + iframe.id + ":" + i + "px)");';
		html += '	if (i < iframe.min_height) setTimeout(resizeIframe, 1000);';
		html += '}';
		html += '<\/script>';

		// Script loading
		html += '<\/head>';
		html += '<body onload="resizeIframe()">';
		html += '<script src="' + iframe.script_src + '"><\/script>';

		var doc = (iframe.contentWindow || iframe.contentDocument);
		if (doc.document) { doc = doc.document; }
		doc.open().write(html);
		doc.close();
	}
}

/*
 * Helper function to invoke creating iframe after onload
 */
function lazyLoadIframe(id, script_src, style, min_height, stylesheet) {
	if (window.addEventListener) {
		window.addEventListener('load', function() {
			createIframe(id, script_src, style, min_height, stylesheet);
		}, false);
	} else {
		window.attachEvent('onload', function() {
			createIframe(id, script_src, style, min_height, stylesheet);
		});
	}
}

/*
 * Debug
 */
/*
if (typeof window.console === 'undefined') {
	window.console = {};
	for (var names = "log debug info warn error assert dir dirxml group groupEnd time timeEnd count table trace profile profileEnd".split(" "), n = names.length; --n >= 0;) {
		window.console[names[n]] = function() {}
	}
} else {
	window.console['log'] = function(v) { alert(v); }
}
*/