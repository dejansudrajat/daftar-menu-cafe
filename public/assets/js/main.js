(function () {
	("use strict");

	/**
	 * Easy selector helper function
	 */
	const select = (el, all = false) => {
		el = el.trim();
		if (all) {
			return [...document.querySelectorAll(el)];
		} else {
			return document.querySelector(el);
		}
	};

	/**
	 * Easy event listener function
	 */
	const on = (type, el, listener, all = false) => {
		if (all) {
			select(el, all).forEach((e) => e.addEventListener(type, listener));
		} else {
			select(el, all).addEventListener(type, listener);
		}
	};

	/**
	 * Easy on scroll event listener
	 */
	const onscroll = (el, listener) => {
		el.addEventListener("scroll", listener);
	};

	/**
	 * Navbar links active state on scroll
	 */
	let navbarlinks = select("#navbar .scrollto", true);
	const navbarlinksActive = () => {
		let position = window.scrollY + 200;
		navbarlinks.forEach((navbarlink) => {
			if (!navbarlink.hash) return;
			let section = select(navbarlink.hash);
			if (!section) return;
			if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
				navbarlink.classList.add("active");
			} else {
				navbarlink.classList.remove("active");
			}
		});
	};
	window.addEventListener("load", navbarlinksActive);
	onscroll(document, navbarlinksActive);

	/**
	 * Toggle .header-scrolled class to #header when page is scrolled
	 */
	let selectHeader = select("#header");
	if (selectHeader) {
		const headerScrolled = () => {
			if (window.scrollY > 100) {
				selectHeader.classList.add("header-scrolled");
			} else {
				selectHeader.classList.remove("header-scrolled");
			}
		};
		window.addEventListener("load", headerScrolled);
		onscroll(document, headerScrolled);
	}

	/**
	 * Back to top button
	 */
	let backtotop = select(".back-to-top");
	if (backtotop) {
		const toggleBacktotop = () => {
			if (window.scrollY > 100) {
				backtotop.classList.add("active");
			} else {
				backtotop.classList.remove("active");
			}
		};
		window.addEventListener("load", toggleBacktotop);
		onscroll(document, toggleBacktotop);
	}

	document.addEventListener("DOMContentLoaded", function () {
		// Array berisi nama file HTML yang akan dimuat
		var pages = [
			"menu-coffee.html",
			"menu-non-coffee.html",
			"menu-tea.html",
			"menu-snack.html",
			"menu-main-course.html",
			"menu-maritos.html",
			"menu-additional.html",
			// tambahkan nama file HTML lainnya jika ada
		];

		// Fungsi untuk memuat konten HTML dari file
		function loadPage(url) {
			return new Promise(function (resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.open("GET", url);
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							resolve(xhr.responseText);
						} else {
							reject(Error(xhr.statusText));
						}
					}
				};
				xhr.send();
			});
		}

		// Fungsi untuk memuat semua file HTML
		function loadPages() {
			var contentContainer = document.getElementById("content-container");
			var promises = [];

			// Loop melalui array nama file HTML dan memuat setiap file dalam urutan yang sesuai
			pages
				.reduce(function (chain, page) {
					return chain.then(function () {
						return loadPage("./pages/" + page).then(function (response) {
							// Menyisipkan konten HTML ke dalam kontainer utama
							contentContainer.insertAdjacentHTML("beforeend", response);
						});
					});
				}, Promise.resolve())
				.then(function () {
					console.log("Semua halaman dimuat.");
				})
				.catch(function (error) {
					console.log("Terjadi kesalahan saat memuat halaman: " + error);
				});
		}

		// Memanggil fungsi untuk memuat semua file HTML
		loadPages();

		var headerContainer = document.getElementById("header-container");
		var headerRequest = new XMLHttpRequest();
		headerRequest.open("GET", "./pages/header.html", true);
		headerRequest.onreadystatechange = function () {
			if (headerRequest.readyState === 4 && headerRequest.status === 200) {
				headerContainer.innerHTML = headerRequest.responseText;

				// Set up event listener for navbar links
				var navbarLinks = document.querySelectorAll(".dropdown-item");
				navbarLinks.forEach(function (link) {
					link.addEventListener("click", function (e) {
						e.preventDefault();
						var href = link.getAttribute("href");
						console.log(href);
						document.querySelector(".navbar-collapse").classList.toggle("show");
						loadContent("./pages/" + href);
						scrollToTop();
						navbarToggler.classList.remove("active");
					});
				});

				var navbarToggler = document.querySelector(".navbar-toggler");

				navbarToggler.addEventListener("click", function () {
					navbarToggler.classList.toggle("open");
				});

				// Set up event listener for navbar toggler
				document.querySelector("#navbarNav").addEventListener("click", function () {
					document.querySelector(".navbar-collapse").classList.toggle("open");
				});

				// Set up event listener for "More info" link
				var moreInfoLink = document.getElementById("more-info-link");
				moreInfoLink.addEventListener("click", function (e) {
					e.preventDefault();
					var footer = document.getElementById("footer-container");
					document.querySelector(".navbar-collapse").classList.toggle("show");
					navbarToggler.classList.remove("active");
					footer.scrollIntoView({ behavior: "smooth" });
				});
			}
		};
		headerRequest.send();

		// Function to load content into the main container
		function loadContent(url) {
			var contentContainer = document.getElementById("content-container");
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.onreadystatechange = function () {
				if (request.readyState === 4 && request.status === 200) {
					contentContainer.innerHTML = request.responseText;
				}
			};
			request.send();
		}

		// Function to scroll to top
		function scrollToTop() {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
				block: "start",
			});
		}

		// Load footer content
		var footerContainer = document.getElementById("footer-container");
		var footerRequest = new XMLHttpRequest();
		footerRequest.open("GET", "./pages/footer.html", true);
		footerRequest.onreadystatechange = function () {
			if (footerRequest.readyState === 4 && footerRequest.status === 200) {
				footerContainer.innerHTML = footerRequest.responseText;
			}
		};
		footerRequest.send();
	});
})();
