let pokedexData = [];


// Kontrolle ob Sauber --> Nur Daten, die auch beim rendern benötigt werden: 
// nach dem laden: 
let pokedexDataAusDenDevTools =
[
    {
        "id": 1,
        "name": "bulbasaur",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        "abilities": [
            "overgrow",
            "chlorophyll"
        ],
        "color": "green"
    },
    {
        "id": 2,
        "name": "ivysaur",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
        "abilities": [
            "overgrow",
            "chlorophyll"
        ],
        "color": "green"
    },
    {
        "id": 3,
        "name": "venusaur",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
        "abilities": [
            "overgrow",
            "chlorophyll"
        ],
        "color": "green"
    },
    {
        "id": 4,
        "name": "charmander",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        "abilities": [
            "blaze",
            "solar-power"
        ],
        "color": "red"
    },
    {
        "id": 5,
        "name": "charmeleon",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png",
        "abilities": [
            "blaze",
            "solar-power"
        ],
        "color": "red"
    },
    {
        "id": 6,
        "name": "charizard",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        "abilities": [
            "blaze",
            "solar-power"
        ],
        "color": "red"
    },
    {
        "id": 7,
        "name": "squirtle",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
        "abilities": [
            "torrent",
            "rain-dish"
        ],
        "color": "blue"
    },
    {
        "id": 8,
        "name": "wartortle",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png",
        "abilities": [
            "torrent",
            "rain-dish"
        ],
        "color": "blue"
    },
    {
        "id": 9,
        "name": "blastoise",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
        "abilities": [
            "torrent",
            "rain-dish"
        ],
        "color": "blue"
    },
    {
        "id": 10,
        "name": "caterpie",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
        "abilities": [
            "shield-dust",
            "run-away"
        ],
        "color": "green"
    },
    {
        "id": 11,
        "name": "metapod",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png",
        "abilities": [
            "shed-skin"
        ],
        "color": "green"
    },
    {
        "id": 12,
        "name": "butterfree",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png",
        "abilities": [
            "compound-eyes",
            "tinted-lens"
        ],
        "color": "white"
    },
    {
        "id": 13,
        "name": "weedle",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png",
        "abilities": [
            "shield-dust",
            "run-away"
        ],
        "color": "brown"
    },
    {
        "id": 14,
        "name": "kakuna",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png",
        "abilities": [
            "shed-skin"
        ],
        "color": "yellow"
    },
    {
        "id": 15,
        "name": "beedrill",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png",
        "abilities": [
            "swarm",
            "sniper"
        ],
        "color": "yellow"
    },
    {
        "id": 16,
        "name": "pidgey",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png",
        "abilities": [
            "keen-eye",
            "tangled-feet",
            "big-pecks"
        ],
        "color": "brown"
    },
    {
        "id": 17,
        "name": "pidgeotto",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png",
        "abilities": [
            "keen-eye",
            "tangled-feet",
            "big-pecks"
        ],
        "color": "brown"
    },
    {
        "id": 18,
        "name": "pidgeot",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png",
        "abilities": [
            "keen-eye",
            "tangled-feet",
            "big-pecks"
        ],
        "color": "brown"
    },
    {
        "id": 19,
        "name": "rattata",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
        "abilities": [
            "run-away",
            "guts",
            "hustle"
        ],
        "color": "purple"
    },
    {
        "id": 20,
        "name": "raticate",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png",
        "abilities": [
            "run-away",
            "guts",
            "hustle"
        ],
        "color": "brown"
    },
    {
        "id": 21,
        "name": "spearow",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png",
        "abilities": [
            "keen-eye",
            "sniper"
        ],
        "color": "brown"
    },
    {
        "id": 22,
        "name": "fearow",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/22.png",
        "abilities": [
            "keen-eye",
            "sniper"
        ],
        "color": "brown"
    },
    {
        "id": 23,
        "name": "ekans",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png",
        "abilities": [
            "intimidate",
            "shed-skin",
            "unnerve"
        ],
        "color": "purple"
    },
    {
        "id": 24,
        "name": "arbok",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png",
        "abilities": [
            "intimidate",
            "shed-skin",
            "unnerve"
        ],
        "color": "purple"
    },
    {
        "id": 25,
        "name": "pikachu",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        "abilities": [
            "static",
            "lightning-rod"
        ],
        "color": "yellow"
    }
]