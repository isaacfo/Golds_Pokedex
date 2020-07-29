const pokedex = document.getElementById('pokedex');
const searchBar = document.getElementById('searchBar');
const searchBtn = document.getElementById('search-btn');
const tip = document.getElementById('tip');

var i = 0;
var message = 'Search for a pokemon';
var speed = 100;

// setting search bar styles
searchBtn.addEventListener('click', () => {
  searchBar.style.width = '60%';
  searchBar.style.paddingLeft = '60px';
  searchBar.style.cursor = 'text';
  // to not have to click on searchbar again to type
  searchBar.focus();

  typeWriter();
});

searchBar.addEventListener('keydown', () => {
  tip.style.visibility = 'visible';
  tip.style.opacity = 1;
});

function typeWriter() {
  if (i < message.length) {
    msg = searchBar.getAttribute('placeholder') + message.charAt(i);
    searchBar.setAttribute('placeholder', msg);
    i++;
    setTimeout(typeWriter, speed);
  }
}

let pokemon = [];

// lowercase was added cuz pokemon names in api are lowercase
searchBar.addEventListener('keyup', e => {
  const searchString = e.target.value.toLowerCase();

  const filteredPokemon = pokemon.filter(mon => {
    return mon.name.includes(searchString);
  });
  displayPokemon(filteredPokemon);
});

const cachedPokemon = {};

const fetchPokemon = async () => {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=251`;
  const res = await fetch(url);
  const data = await res.json();
  pokemon = data.results.map((data, index) => ({
    name: data.name,
    id: index + 1,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index +
      1}.png`
  }));
  // console.log(data);
  // console.log(pokemon);
  displayPokemon(pokemon);
};

const displayPokemon = pokemon => {
  const pokemonHTMLString = pokemon
    .map(
      pokeman =>
        `
    <li class="card" onclick="selectPokemon(${pokeman.id}) ">
        <img class="card-image" src="${pokeman.image}"/>
        <h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
       
        `
    )
    .join('');
  pokedex.innerHTML = pokemonHTMLString;
};

const selectPokemon = async id => {
  if (!cachedPokemon[id]) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokeman = await res.json();
    cachedPokemon[id] = pokeman;
    displayPokemanPopup(pokeman);
  } else {
    displayPokemanPopup(cachedPokemon[id]);
  }
};
// pokemon cry function in the works currently
function playSound() {
  let sound = document.getElementById('audio');
  sound.play();
}

const displayPokemanPopup = pokeman => {
  console.log(pokeman);
  const type = pokeman.types.map(type => type.type.name).join(', ');
  const ability = pokeman.abilities.map(ability => ability.ability.name);
  const statSpeed = pokeman.stats[0].base_stat;
  const statSpDefense = pokeman.stats[1].base_stat;
  const statSpAttack = pokeman.stats[2].base_stat;
  const statDefense = pokeman.stats[3].base_stat;
  const statAttack = pokeman.stats[4].base_stat;
  const statHp = pokeman.stats[5].base_stat;

  const htmlString = `
        <div class="popup">
            <button id="closeBtn" onclick="closePopup()">Close</button>
            <div class="card">
                <img class="card-image" src="${pokeman.sprites['front_shiny']}"/>
                <h2 class="card-title">${pokeman.name}</h2>
                <p>Type: ${type} | Height: ${pokeman.height} | Weight: ${pokeman.weight} | Abilities: ${ability}</p>
                 <audio
            id="audio"
            autostart="false"
            src="assets/PokemonGen1/Gen1Sounds/${pokeman.id}.wav"></audio>
    </li>
                <button class="soundBtn" onclick="playSound()">pokemon cry</button>
                <div class= "stats">Base Stats:<br>
                HP: <progress value=${statHp} max="200">45</progress> <br>
                Attack: <progress value=${statAttack} max="200"> </progress> <br> 
                Defense: <progress value=${statDefense} max="200"> </progress> <br>
                Special-Attack: <progress value=${statSpAttack} max="200"></progress> <br>
                Special-Defense: <progress value=${statSpDefense} max="200"></progress><br> 
                Speed: <progress value=${statSpeed} max="200"></progress> <br>
                 
                
                
                
                
                </div> 
            </div>
        </div>
    `;
  pokedex.innerHTML = htmlString + pokedex.innerHTML;
};

const closePopup = () => {
  const popup = document.querySelector('.popup');
  popup.parentElement.removeChild(popup);
};

fetchPokemon();

// searchBar.addEventListener('keyup', function(e) {
//   const searchType = e.target.value.toLowerCase();
//   const pokemonTypes = htmlString.getElementByClassName('card');

//   Array.from(pokemonTypes).forEach(function(pokemonType) {
//     const pokeType = type.lastElementChild.textContent;
//     if (pokeType.toLowerCase().indexof(searchType) != -1) {
//       pokemonTypes.style.display = 'block';
//     }
//   });
// });
