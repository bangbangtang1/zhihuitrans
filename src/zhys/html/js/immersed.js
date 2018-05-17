(function(w) {

	document.addEventListener('plusready', function() {
		//	console.log("Immersed-UserAgent: "+navigator.userAgent);
	}, false);

	var immersed = 0;
	var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
	if(ms && ms.length >= 3) {
		immersed = parseFloat(ms[2]);
	}
	w.immersed = immersed;
	var t = document.getElementById('header');
	var bgc = '-webkit-linear-gradient(top,rgba(52,150,215,1),rgba(52,150,215,1))';
	if(!immersed) {
		t.style.background = bgc;
		t.style.color = '#FFF';
		return;
	}
	t.style.height = (44 + immersed) + 'px';
	t && (t.style.paddingTop = immersed + 'px', t.style.background = bgc, t.style.color = '#FFF');
	t = document.querySelector('.mui-content');
	t && (t.style.marginTop = (immersed) + 'px');
	t = document.getElementById('dcontent');
	t && (t.style.marginTop = immersed + 'px');
	t = document.getElementById('allmap');
	t && (t.style.marginTop = immersed + 'px');

})(window);