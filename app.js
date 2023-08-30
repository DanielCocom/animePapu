const contenedorPrincipal = document.getElementById("contenedor-Principal")
const animecontainer = document.getElementById("animes");
const navContainer = document.getElementById("nav-container")
const botonBuscar = document.getElementById("button")
const animeName = document.getElementById("animeName")
const botonAnimeLista = document.getElementById("listAnime")
const favoritesContainer = document.getElementById("favorites-container")
const animeFavorito = document.getElementById("animeFavoriteName")
const divMensaje = document.getElementById("muestra-msg")
const contenerAnimesFav = document.getElementById("anime-favoriteContainer")



const botonFavoritos = document.getElementById("verFavoritos")
const contenedorFav = document.getElementById("images")

//boton para hacer aparecer y desaparecera los favoritos
botonFavoritos.addEventListener("click", () => {
    if (contenerAnimesFav.style.display === "none")
        contenerAnimesFav.style.display = "flex"
    else {
        contenerAnimesFav.style.display = "none"
    }
})
let listaDeAnimes = [];//Aqui se guardan los animes que voy a agregar al apartado plan to wacth
console.log(listaDeAnimes)
let CrearElementoAnime = (serie) => {
    const animesResultsContainer = document.createElement("div")
    animesResultsContainer.classList.add("animesDiv")
    animesResultsContainer.innerHTML = `
    <p class="animeTitle">${serie.title}</p>
    <div class="imageContainer">
        <img class="animeImage" src="${serie.img}" alt="${serie.title}">
    </div>
    <p class="animeScore">Puntuacion: ${serie.score}</p>
    <p class="animeEpisode">Episodios ${serie.episodes}</p>
    `
    //esto lo puedo borrar/
    const botonAdd = document.createElement("button");
    botonAdd.setAttribute("class", "agregar");
    botonAdd.textContent = "+"

    animecontainer.appendChild(animesResultsContainer);
    animesResultsContainer.appendChild(botonAdd);
}

const url = "https://api.jikan.moe/v4/top/anime";
fetch(url)
    .then(response => response.json())
    .then(data => {

        const topAnimes = data.data;
        for (let i = 0; i < 12; i++) {
            const anime = topAnimes[i];
            const Objeto = {

                img: anime.images.jpg.image_url,
                title: anime.title,
                score: anime.score,
                episodes: anime.episodes
            }
            ValidarAnimeExisteList(Objeto)
            CrearElementoAnime(Objeto)

        }
    })

let ValidarAnimeExisteList = (objeto) => {
    if (!listaDeAnimes.some((animeExistente) => animeExistente.title.trim().toUpperCase() === objeto.title.trim().toUpperCase())) {
        listaDeAnimes.push(objeto)
    }
    else {
        console.log("el anime ya se encuentra en la lista")
    }

}

let BuscarAnime = () => {
    let nombreAnime = animeName.value;
    const urlSearch = `https://api.jikan.moe/v4/anime?q=${nombreAnime}&sfw`
    if (nombreAnime.length === 0) {
        divMensaje.innerHTML = `<h3 class="msg"> Ingresa el anime que deseas buscar plis</h3>`;
        return;
    }
    else
        animecontainer.innerHTML = ""//esta madre es para que se borre el contenido cuando se vuelve a llamar al metodo
    fetch(urlSearch)
        .then(response => response.json())
        .then(data => {
            if (data.data.length === 0) {
                divMensaje.innerHTML = `<h3 class="msg"> No se encontraron resultados <br></h3>`;
            }
            else {
                divMensaje.innerHTML = `<h3 class="msg"> "Resultados relacionados con ${nombreAnime}"</h3`
                data.data.forEach(anime => {
                    const Serie = {
                        img: anime.images.jpg.image_url,
                        title: anime.title,
                        score: anime.score,
                        episodes: anime.episodes

                    }
                    ValidarAnimeExisteList(Serie)
                    CrearElementoAnime(Serie)
                })
            }
        });
}



let AgregarAnimesFavoritos = () => {
    const animeName = animeFavorito.value.trim().toUpperCase()
    const buscarAnime = listaDeAnimes.find((anime) => anime.title.trim().toUpperCase() === animeName)


    if (buscarAnime) {
        const divFavorite = document.createElement("div");
        divFavorite.classList.add("animeFavContainer")
        divFavorite.innerHTML = `
            <div class="imageFavContainer">
            <img class="imageFavorite" src="${buscarAnime.img}" alt="${buscarAnime.title}"> 
             </div>
        `

        const boton = document.createElement("button")
        boton.setAttribute("class", "buton-Delete")
        boton.textContent = "X"
        divFavorite.appendChild(boton)

        contenedorFav.appendChild(divFavorite);

        guardarAnimeFavorito(buscarAnime);


        boton.addEventListener("click", () => {
            // Eliminar el elemento padre (div) cuando se hace clic en el botón
            contenedorFav.removeChild(divFavorite);
        });
    }
    else {
        console.log("no se hizo papito")
    }
}
const guardarAnimeFavorito = (anime) => {
    const animesFavoritosGuardados = JSON.parse(localStorage.getItem("animesFavoritos")) || [];
    animesFavoritosGuardados.push(anime);
    localStorage.setItem("animesFavoritos", JSON.stringify(animesFavoritosGuardados));
};

const cargarAnimesFavoritos = () => {
    const animesFavoritosGuardados = JSON.parse(localStorage.getItem("animesFavoritos")) || [];
    animesFavoritosGuardados.forEach(anime => {
        const divFavorite = document.createElement("div");
        divFavorite.classList.add("animeFavContainer");
        divFavorite.innerHTML = `
            <div class="imageFavContainer">
                <img class="imageFavorite" src="${anime.img}" alt="${anime.title}"> 
            </div>
        `;

        const boton = document.createElement("button");
        boton.setAttribute("class", "buton-Delete");
        boton.textContent = "X";
        divFavorite.appendChild(boton);

        contenedorFav.appendChild(divFavorite);

        boton.addEventListener("click", () => {
            contenedorFav.removeChild(divFavorite);
            removerAnimeFavorito(anime);
        });
    });
};

const removerAnimeFavorito = (anime) => {
    const animesFavoritosGuardados = JSON.parse(localStorage.getItem("animesFavoritos")) || [];
    const nuevosAnimesFavoritos = animesFavoritosGuardados.filter(animeFav => animeFav.title !== anime.title);
    localStorage.setItem("animesFavoritos", JSON.stringify(nuevosAnimesFavoritos));
};

document.addEventListener("DOMContentLoaded", () => {
    cargarAnimesFavoritos();
});

botonBuscar.addEventListener("click", BuscarAnime)
botonAnimeLista.addEventListener("click", AgregarAnimesFavoritos)