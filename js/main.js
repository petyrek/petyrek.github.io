$(function(){
	$('[data-target]').on('click', function(){
		$('[data-target]').removeClass('active');
		$(this).addClass('active');
		$('[data-tab]').hide();
		$('[data-tab="' + $(this).attr('data-target') + '"]').show();
	});
});
