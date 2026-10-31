// Lumina · admin/productos

(() => {
	const mount = document.querySelector("#productFormModalMount");
	if (!mount) return;

	const modalUrl = new URL("../producto-formulario/modal.html", document.currentScript.src);

	fetch(modalUrl)
		.then((response) => {
			if (!response.ok) throw new Error(`No se pudo cargar el formulario (${response.status}).`);
			return response.text();
		})
		.then((markup) => {
			mount.innerHTML = markup;
			window.initProductForm();
		})
		.catch((error) => console.error(error));
})();
