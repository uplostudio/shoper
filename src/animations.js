// overflow hidden when nav is open
$(".nav__burger-inner").on("click", function () {
	$("body").toggleClass("overflow-hidden");
});

// Defining the modal close logic in a function
function closeModal() {
	$(".modal--open").removeClass("modal--open");
	$("[data-element='trial_wrapper']").hide();
	$(document.body).toggleClass("overflow-hidden", false);
	isFromBanner = false;
	formLocation = "";
  formType = "inline";
  isUsingModal = false;
	if ($(".checkbox-multi.is-trigger").length) {
		$(".checkbox-multi.is-trigger").each(function () {
			if ($(this).hasClass("w--redirected-checked")) {
				$(".checkbox-multi.is-trigger").removeClass("w--redirected-checked");
				return false;
			}
		});
	}

	var currentUrl = window.location.href;
	var baseUrl = currentUrl.split("#")[0];
	history.pushState(null, null, baseUrl);

	$(document).trigger("closeModalCalled");
}

// Attach the function to existing click events
$(
	".modal__close, .modal__close-area, [data-trigger='close-modal'], [data-element='close_trial_wrapper']"
).on("click", closeModal);

// Attach the function to 'keyup' event for the ESC key
$(document).on("keyup", function (e) {
	if (e.which === 27) {
		closeModal();
	}
});

$("[fs-formsubmit-element='reset']").on("click", function () {
	$(".checkbox-multi.is-trigger").each(function () {
		if ($(this).hasClass("w--redirected-checked")) {
			$(".checkbox-multi.is-trigger").removeClass("w--redirected-checked");
			return false;
		}
	});
});

$(".show-in-editor").each(function () {
	$(this).removeClass("show-in-editor");
});

// since sticky doesn't show on all subpages let's play try&catch for any errors
try {
	// get the sticky element
	const stickyElm = document.querySelector(".nav-secondary");

	const observer = new IntersectionObserver(
		([e]) =>
			e.target.classList.toggle("is-pinned", e.boundingClientRect.top < 0),
		{ threshold: [1] }
	);

	observer.observe(stickyElm);
} catch (err) {
	// do nothing - don't show error if element is not found
}

//recalculate available space on mobile
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);

// We listen to the resize event
window.addEventListener("resize", () => {
	// We execute the same script as before
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty("--vh", `${vh}px`);
});

//line animation when scrolled into view
function isScrolledIntoView(elem) {
	var docViewTop = $(window).scrollTop();
	var docViewBottom = docViewTop + $(window).height();

	var elemTop = $(elem).offset().top;
	var elemBottom = elemTop + $(elem).height();

	return elemBottom <= docViewBottom && elemTop >= docViewTop;
}

$(window).scroll(function () {
	$(".is-in-view").each(function () {
		setTimeout(() => {
			if (isScrolledIntoView(this) === true) {
				$(this).addClass("animate");
			}
		}, 2000);
	});
});
