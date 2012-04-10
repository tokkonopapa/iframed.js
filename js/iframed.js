/*
 * iframed.js v1.0
 * https://github.com/tokkonopapa/iframed.js
 *
 * iframed.js is an asynchronous loader for 3rd party's javascript.
 * It improves site response even if javascript uses document.write()
 * in a recursive way.
 *
 * Copyright 2012, tokkonopapa
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
function createIframe(id, script_src, style, min_height, stylesheet) {
	// Keep params in iframe object
	var iframe = document.createElement('iframe');
	iframe.id = id + '-iframe';
	iframe.min_height = min_height ? min_height.replace(/px/, "") : '0';
	iframe.script_src = script_src ? script_src.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : null;
	iframe.stylesheet = stylesheet ? stylesheet.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : null;

	// Styles
	iframe.setAttribute('style', style);
	iframe.setAttribute('frameborder', 0);

	// Attach first to make body in iframe
	document.getElementById(id).appendChild(iframe);

	// Contents in iframe
	var html = '<head>';

	// Some scripts need canonical link
	var links = document.getElementsByTagName('link'),
		n = links.length;
	while (--n >= 0) {
		if (links[n].getAttribute('rel') === 'canonical') {
			html += '<link rel="canonical" href="' + links[n].getAttribute('href') + '" \/>';
			break;
		}
	}

	// Add stylesheet
	if (iframe.stylesheet) {
		html += '<link rel="stylesheet" type="text/css" href="' + iframe.stylesheet + '" media="all" \/>';
	}

	// Reset some styles
	html += '<style type="text/css">';
	html += '	body { margin: 0; padding: 0; }';
	html += '<\/style>';

	// Onload event handler
	html += '<script type="text/javascript">';
	html += 'function onloadIframe() {';
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
	html += '	window.parent.document.getElementById(iframe.id).style.height = i + "px";';
//	html += '	window.parent.console.log("onloadIframe(" + iframe.id + ":" + i + ")");';
	html += '	if (i < iframe.min_height) {';
	html += '		setTimeout(onloadIframe, 1000);';
	html += '	}';
	html += '}';
	html += '<\/script>';

	// Script loading
	html += '<\/head>';
	html += '<body onload="onloadIframe()">';
	html += '<script type="text/javascript" src="' + iframe.script_src + '"><\/script>';
/*	html += '<\/body>';*/

	// Inject contents into iframe
	var isMSIE = /*@cc_on!@*/false;
	if (isMSIE) {
		// friendly iframe
		iframe.src = 'fiframe.html';

		// javascript: URI
//		iframe.contentWindow.contents = html;
//		iframe.src = 'javascript:window["contents"]';
	} else {
		// Dynamic injection
		iframe.src = 'about:blank';
		var doc = (iframe.contentWindow || iframe.contentDocument);
		if (doc.document) { doc = doc.document };
		doc.open();
		doc.write(html);
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