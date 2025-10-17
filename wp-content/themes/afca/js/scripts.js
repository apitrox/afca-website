(function ($, root, undefined) {
	
	$(function () {
		
		'use strict';
		
		$('.toggle').click(function(){
            $('.nav').slideToggle();
            $( this ).toggleClass( "toggle-border" );
        });
		
		$('.products-thumbnail').children('img').css('cursor', 'pointer');
		
		let imageAltNames = ["Data Intake","Document Assembly","SnapMessaging","Filemation","SignPenFree"];
		let imageAltLinks = ["http://dataintake.io/","https://documentassembly.io/","https://snapmessaging.com/","https://filemation.com/","https://signpenfree.com/"];
		imageAltNames.map(function(v,i,a) {
			let altName = v.toString();
			$('img[alt="' + altName + '"]').load(function() {
				$(this).click(function(event){
					window.open(imageAltLinks[i], '__blank');
				})
			});
		})
	});
    

	
})(jQuery, this);
