const velasDeTemporada = [
    ...velas.filter(vela => vela.category === "Halloween"),
    ...velas.filter(vela => vela.category === "Navidad")
];

crearCarrusel("#favoritas-carrusel", {
    velas: velasDeTemporada
});
