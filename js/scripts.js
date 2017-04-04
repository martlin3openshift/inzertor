function query() {

	var input = document.getElementById("keyword");
	var value = input.value;

	location.href = "/hledej/" + value;

}

function showLogin() {
	showPopup('login-popup');
}

function showRegister() {
	showPopup('register-popup');
}

/******************************************************************************/

var shownPopup = null;

function showPopup(id) {
	var popup = document.getElementById(id);
	
	popup.classList.add("popup-shown");
	document.body.addEventListener("dblclick", hidePopup);
	
	shownPopup = popup;
}

function hidePopup() {
	shownPopup.classList.remove("popup-shown");
	document.body.removeEventListener("dblclick", hidePopup);
	shownPopup = null;
}
