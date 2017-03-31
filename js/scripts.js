function query() {

	var input = document.getElementById("keyword");
	var value = input.value;

	location.href = "/form/" + value;

	return false;
}
