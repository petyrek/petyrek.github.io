$(window).load(function(){
	initializePage();
});

$(window).resize(function(){
	setContentSectionsWidth();
	setContentHeight();
});

function initializePage(){
	setContentSectionsWidth();
	setContentSectionsLeft(0);
	setContentHeight();
	bindOnClickEvents();
}


function bindOnClickEvents(){
	// on button click, set the positions of sections approprietly
	var navBtns = $("#navigation ul li");
	
	for(var i = 0; i < navBtns.length; i++){
		$(navBtns[i]).click(function(){
			setActiveClass(this);
			setContentSectionsLeft( getObjectIndex(this) );			
		});
	}
}

function setActiveClass(btn){
	// sets active attribute on clicked button
	var navBtns = $("#navigation ul li");
	for(var i = 0; i < navBtns.length; i++){
		if( navBtns[i] == btn){
			$(navBtns[i]).addClass("active");
		}
		else{
			$(navBtns[i]).removeClass("active");
		}
	}
}

function setContentSectionsLeft(index){
	// calculates and sets the left offset for content sections
	var navBtns = $("#navigation ul li");

	for(var i = 0; i < navBtns.length; i++){
		var width = 100;			
		$('#' + $(navBtns[i]).attr("data-context")).css("left", -index * width + "%" );
		index--;
	}
}


function getObjectIndex(button){
	// returns the index of element in array
	return jQuery.inArray( button, $(button).parent().children() );
}

function setContentHeight(){
	// sets the section wrapper height to the biggest height of all content sections
	console.log(getMaxSectionHeight());
	$("#content").height( getMaxSectionHeight() );
}

function getMaxSectionHeight(){
	// gets biggest height of all content sections
	var sections = $(".content_section");
	var maxHeight = 0;
	for(var i = 0; i < sections.length; i++){
		var curHeight = $(sections[i]).outerHeight();
		console.log(curHeight);
		if( curHeight > maxHeight){
			maxHeight = curHeight;
		}
	}
	return maxHeight;
}

function setContentSectionsWidth(){
	// sets the width of content sections to the value of their wrapper
	var sections = $(".content_section");
	var parentWidth = $(sections[0]).parent().width();
	console.log("parentWidth:", parentWidth);
	for(var i = 0; i < sections.length; i++){
		$(sections[i]).outerWidth(parentWidth);
	}
}