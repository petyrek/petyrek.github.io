window.onload = function(){
	Array.prototype.forEach.call(document.querySelectorAll('[data-target]'), function(el){
		el.onclick = function(){

			Array.prototype.forEach.call(document.querySelectorAll('[data-target]'), function(el){
				el.className = el.className.replace(/\bactive\b/,'');
			});

			this.className += ' active';

			Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'), function(el){
				el.style.display = 'none';
			});

			document.querySelector('[data-tab="'+ this.getAttribute('data-target') +'"]').style.display = "block";
		}
	});
}
