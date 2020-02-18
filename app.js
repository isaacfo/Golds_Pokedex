const pokedex = document.getElementById('pokedex');
console.log(pokedex);

const fetchPokemon = () => {
  const promises = [];
  for (let i = 152; i <= 251; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then(res => res.json()));
  }

  Promise.all(promises).then(results => {
    const pokemon = results.map(data => ({
      name: data.name,
      id: data.id,
      image: data.sprites['front_default'],
      type: data.types.map(type => type.type.name).join(',')
    }));
    displayPokemon(pokemon);
  });
};

const displayPokemon = pokemon => {
  console.log(pokemon);
  const pokemonHTMLString = pokemon
    .map(
      pokeman => `
  <li class= "card">
  <img class= "card-image" src = "${pokeman.image}"/>
  <h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
  <p class="card-subtitle">Type: ${pokeman.type}</p>
  </li>`
    )
    // makes it all one string because map returned an array
    .join('');
  pokedex.innerHTML = pokemonHTMLString;
};

fetchPokemon();
