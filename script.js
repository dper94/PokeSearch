window.onload = () => {
  getAllPokemonData();
};

const typeColors = {
  grass: "#5ad5c5",
  fire: "#fc9441",
  water: "#8bacf6",
  bug: "#83c54b",
  electric: "#fdbd01",
  normal: "#eecd73",
  poison: "#a483c5",
  ground: "#a57b2c",
  fairy: "#fdc5b4",
  psychic: "#fc9494",
  rock: "#837b7b",
  ice: "#cde6ff",
  fighting: "#a2933b",
  ghost: "#5a4a9c",
  flying: "#e6b462",
  steel: "#a9b7b4",
  dragon: "#7d6cda",
  dark: "#414153",
};

const darkerTypesColors = {
  grass: "#3e9a8c",
  fire: "#d9742a",
  water: "#5a7db9",
  bug: "#5f9a3f",
  electric: "#d0c536",
  normal: "#c7a55d",
  poison: "#7d6596",
  ground: "#7f5c22",
  fairy: "#e7a694",
  psychic: "#d77b7b",
  rock: "#5e5151",
  ice: "#aac6e0",
  fighting: "#7d6c30",
  ghost: "#42326d",
  flying: "#c1904d",
  steel: "#8a9991",
  dragon: "#5f4bb1",
  dark: "#2e2a30",
};

const bodyCover = document.querySelector(".body-cover");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const pokemonCardsContainer = document.querySelector(
  ".pokemon-cards-container"
);
const pokemonDetails = document.querySelector(".pokemon-details");
const backButton = document.querySelector(".back-button");

const searchPokemon = async () => {
  const pokemonNameOrId = searchInput.value.trim().toLowerCase();

  if (!pokemonNameOrId) {
    alert("Please enter the Pokemon name or number");
    return;
  }

  const fetchPokemon = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`
  );

  if (!fetchPokemon.ok) {
    alert("Pokémon not found");
    return;
  }

  const parsePokemon = await fetchPokemon.json();

  const pokemonDetailsObject = {
    name: parsePokemon.name.toUpperCase(),
    types: parsePokemon.types.map((type) => type.type.name.toUpperCase()),
    number: parsePokemon.id,
    sprite: parsePokemon.sprites.front_default,
    weight: parsePokemon.weight,
    height: parsePokemon.height,
    hp: parsePokemon.stats[0].base_stat,
    attack: parsePokemon.stats[1].base_stat,
    defense: parsePokemon.stats[2].base_stat,
    specialAttack: parsePokemon.stats[3].base_stat,
    specialDefense: parsePokemon.stats[4].base_stat,
    speed: parsePokemon.stats[5].base_stat,
  };

  displayPokemonData([parsePokemon]);
  displayPokemonDetails(pokemonDetailsObject);
  searchInput.value = "";
};

const getAllPokemonData = async () => {
  const allPokemonURL = "https://pokeapi.co/api/v2/pokemon?limit=2000";
  const fetchAllPokemon = await fetch(allPokemonURL);
  const parseAllPokemonData = await fetchAllPokemon.json();

  const pokemonUrls = parseAllPokemonData.results.map((pokemon) => pokemon.url);

  const allPokemon = await Promise.all(
    pokemonUrls.map(async (url) => {
      const fetchPokemon = await fetch(url);
      const parsePokemon = await fetchPokemon.json();
      return parsePokemon;
    })
  );

  displayPokemonData(allPokemon);
};

const displayPokemonData = (pokemonData) => {
  pokemonCardsContainer.innerHTML = pokemonData
    .map((pokemon) => {
      const firstType = pokemon.types[0].type.name;

      const cardBackgroundColor = darkerTypesColors[firstType];
      const pokemonTypes = pokemon.types
        .map((pokemonType) => {
          return `
          <p class="pokemon-type" style="background-color: ${
            typeColors[pokemonType.type.name]
          };">${pokemonType.type.name}</p>
        `;
        })
        .join("");

      return `
      <div class="pokemon-card" data-pokemon-id="${
        pokemon.id
      }" style="background-color: ${cardBackgroundColor}">
        <div class="pokemon-name-and-types-container">
        <p class="pokemon-number">#${pokemon.id}</p>
          <h2 class="pokemon-name">${pokemon.name.toUpperCase()}</h2>
          ${pokemonTypes}
        </div>
        <img
          id="sprite"
          src=${pokemon.sprites.front_default}
          alt="${pokemon.name} sprite"
        />
      </div>
    `;
    })
    .join("");
  const pokemonCards = document.querySelectorAll(".pokemon-card");
  pokemonCards.forEach((card) => {
    card.addEventListener("click", () => {
      const pokemonId = card.getAttribute("data-pokemon-id");
      const selectedPokemon = pokemonData.find(
        (pokemon) => pokemon.id == pokemonId
      );

      const pokemonDetailsObject = {
        name: selectedPokemon.name.toUpperCase(),
        types: selectedPokemon.types.map((type) =>
          type.type.name.toUpperCase()
        ),
        number: selectedPokemon.id,
        sprite: selectedPokemon.sprites.front_default,
        weight: selectedPokemon.weight,
        height: selectedPokemon.height,
        hp: selectedPokemon.stats[0].base_stat,
        attack: selectedPokemon.stats[1].base_stat,
        defense: selectedPokemon.stats[2].base_stat,
        specialAttack: selectedPokemon.stats[3].base_stat,
        specialDefense: selectedPokemon.stats[4].base_stat,
        speed: selectedPokemon.stats[5].base_stat,
      };
      displayPokemonDetails(pokemonDetailsObject);
      bodyCover.style.display = "block";
      pokemonDetails.style.display = "flex";
    });
  });
};

const displayPokemonDetails = ({
  name,
  types,
  number,
  sprite,
  weight,
  height,
  hp,
  attack,
  defense,
  specialAttack,
  specialDefense,
  speed,
}) => {
  document.getElementById("pokemon-name").textContent = name;

  const typesElement = document.getElementById("types");
  typesElement.innerHTML = "";

  types.forEach((type) => {
    const typeElement = document.createElement("p");
    typeElement.classList.add("pokemon-type");
    typeElement.style.backgroundColor = typeColors[type.toLowerCase()];
    typeElement.textContent = type;
    typesElement.appendChild(typeElement);
  });

  document.getElementById("pokemon-id").textContent = `#${number}`;
  document.getElementById("pokemon-sprite").src = sprite;
  document.getElementById(
    "weight"
  ).innerHTML = `<strong>Weight: </strong>${weight}`;
  document.getElementById(
    "height"
  ).innerHTML = `<strong>Height: </strong>${height}`;
  document.getElementById("hp").innerHTML = `<strong>Hp: </strong>${hp}`;
  document.getElementById(
    "attack"
  ).innerHTML = `<strong>Attack: </strong>${attack}`;
  document.getElementById(
    "defense"
  ).innerHTML = `<strong>Defense: </strong>${defense}`;
  document.getElementById(
    "special-attack"
  ).innerHTML = `<strong>Special Attack: </strong>${specialAttack}`;
  document.getElementById(
    "special-defense"
  ).innerHTML = `<strong>Special Defense: </strong>${specialDefense}`;
  document.getElementById(
    "speed"
  ).innerHTML = `<strong>Speed: </strong>${speed}`;

  const firstType = types[0].toLowerCase();
  pokemonDetails.style.backgroundColor = darkerTypesColors[firstType];
};

const hidePokemonDetails = () => {
  pokemonDetails.style.display = "none";
  bodyCover.style.display = "none";
};

backButton.addEventListener("click", hidePokemonDetails);

searchButton.addEventListener("click", searchPokemon);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchPokemon();
  }
});
