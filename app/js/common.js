$(function () {
	$(document).on("touchstart", function () {
		true;
	});

	$(document.body).data(
		"scrollbar-width",
		parseInt(document.documentElement.clientWidth) -
			parseInt(window.innerWidth)
	);

	$(window).on("click", function () {
		$(".popup").removeClass("active");

		$(".popup__container").css({
			"margin-left": 0,
		});

		$(document.body).css({
			"overflow-y": "visible",
			"margin-left": 0,
		});
	});

	$("[data-action='open-popup']").on("click", function (e) {
		e.stopPropagation();
	});
});
