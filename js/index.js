const pokemonApiBaseUrl = `https://pokeapi.co/api/v2`;
const starwarsBaseUrl = `https://swapi.co/api`;
const errorContainer = document.getElementById('errorContainer');
const pokemonErrorText = `<div><p>Error fetching Pokémon</p> <div class="gif"><img src="https://media.giphy.com/media/12Bpme5pTzGmg8/giphy.gif" alt="sad pokemon gif" /></div></div>`;
const starwarsErrorText = `<div><p>Error fetching Star Wars Data</p> <div class="gif"><img src="https://media.giphy.com/media/33iqmp5ATXT5m/source.gif" alt="sad star wars gif" /></div></div>`;
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

let hasStarwarsFetched = false;
let hasPokemonFetched = false;
let starwarsList = document.getElementById('starwarsList');
let pokemonList = document.getElementById('pokemonList');

class FetchFunData {

    constructor() {
        this.fetchStarwars();
        this.fetchPokemon();
    }

    renderError(error, errorTypeText) {
        errorContainer.classList.add('visible');
        const div = document.createElement('div');
        div.classList.add('error-block');
        div.innerHTML = `<div class="error-response"><p>${error}</p></div>${errorTypeText}`;

        return errorContainer.appendChild(div);
    }

    fetchData(url) {
        return fetch(url).then(res => res.json());
    }

    fetchPokemon() {
        return this.fetchData(`${pokemonApiBaseUrl}/pokemon?limit=8`)
                .then(res => res.results.map(result => this.fetchData(result.url).then(pokemon => this.renderPokemon(pokemon))))
                .catch(error => this.renderError(error, pokemonErrorText));
    }

    buildPokemonHtml(pokemon) {
        const { base_experience, moves, sprites, name } = pokemon;
        let movesHtml = `<ul class="capitalize">${this.renderPokemonMoves(moves)}</ul>`;

        return `
            <li class="item">
                <span class="type">Pokémon</span>
                <div class="details-top image-padded">
                    ${sprites && sprites.front_shiny && `<div class="image"><img src=${sprites.front_shiny} alt=${name + ' image'} /></div>`}
                    <h3 class="title">${capitalizeFirstLetter(name)}</h3>
                    <div class="level">
                        <strong>Base Experience:</strong>
                        <em>${base_experience || 'n/a'}</em>
                    </div>
                </div>
                <div class="details-bottom">
                    <strong class="label">Moves:</strong>
                    ${movesHtml}
                </div>
            </li>
        `;
    }

    renderPokemon(pokemon) {
        return pokemonList.innerHTML += this.buildPokemonHtml(pokemon);
    }

    renderPokemonMoves(moves) {
        let movesHtml = '';
        moves.slice(0, 4).forEach(move => movesHtml += `<li>${capitalizeFirstLetter(move.move.name)}</li>`);

        return movesHtml;
    }

    fetchStarwars() {
        return this.fetchData(`${starwarsBaseUrl}/people?limit=8`)
                .then(res => this.renderStarwarsPerson(res.results))
                .catch(error => this.renderError(error, starwarsErrorText));
    }

    buildStarwarsPersonHTML(person) {
        const { gender, name, birth_year, skin_color, hair_color } = person;

        return `
            <li class="item">
                <span class="type star-wars">Star Wars</span>
                <div class="details-top">
                    <h3 class="title">${name}</h3>
                </div>
                <div class="details-bottom">
                    <strong class="label">Stats:</strong>
                    <ul class="capitalize">
                        <li><strong>Gender:</strong> ${gender || 'n/a'}</li>
                        <li><strong>Birth Year:</strong> ${birth_year || 'n/a'}</li>
                        <li><strong>Skin Color:</strong> ${skin_color || 'n/a/'}</li>
                        <li><strong>Hair Color:</strong> ${hair_color || 'n/a'}</li>
                    </ul>
                </div>
            </li>
        `;
    }

    renderStarwarsPerson(people) {
        let starWarsHtml = '';
        people.forEach(person => starWarsHtml += this.buildStarwarsPersonHTML(person));

        return starwarsList.innerHTML = starWarsHtml;
    }
};

const fetchFunData = new FetchFunData();