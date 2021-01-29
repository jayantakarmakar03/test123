jQuery(window).on("load", function() {
  
	$(".nk-sidebar li").on("click", function() {
		$(".nk-sidebar li").removeClass("activeNav");
		$(this).addClass("activeNav");
	  });

	  $(".mega-menu ul li").on("click", function() {
		$(".mega-menu ul li").removeClass("activeNav");
		$(this).addClass("activeNav");
	  });
	  
});

