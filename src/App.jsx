import React, { useState } from "react";
import axios from 'axios';
function App() {
  
    const [searchPokemon, setSearchPokemon] = useState("");
    const [pokemon, setPokemon] = useState({
      img: "",
      found: false,
      name: "",
      type: "",
      savedOnLocalStorage: false
    });
    const [pokemonList, setPokemonList] = useState(JSON.parse(localStorage.getItem("pokemonList")) || []);
    const [autocomplete, setAutocomplete] = useState([]);
  
  
    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        let { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchPokemon}`)
        if(data.sprites.front_shiny) {
          setPokemon({
            ...pokemon,
            img: data.sprites.front_shiny,
            name: data.forms[0].name,
            found: true,
            type: data.types[0].type ? data.types[0].type.name : "",
            savedOnLocalStorage: false
          })
        } else {
          setPokemon({
            ...pokemon,
            img: data.sprites.front_default,
            name: data.forms[0].name,
            found: true,
            type: data.types[0].type ? data.types[0].type.name : "",
            savedOnLocalStorage: false
          })
        }
      } catch (error) {
        alert("Pokemon not found")
      }
    };

    const savePokemon = (e) => {
      if(pokemonList.find(pok => pok.name === pokemon.name)) {
        alert('pokemon was already saved')
        return
      }
      setPokemonList([...pokemonList, {
        img: pokemon.img,
        name: pokemon.name,
        type: pokemon.type
      }])
      localStorage.setItem("pokemonList", JSON.stringify([...pokemonList, {
        img: pokemon.img,
        name: pokemon.name,
        type: pokemon.type
      }]));
      clearSearch();
      alert('Pokemon saved')
    }
    const clearSearch = () => {
      setPokemon({
        img: "",
        found: false,
        name: "",
        type: "",
        savedOnLocalStorage: false
      })
      setSearchPokemon("")
    }
    const onSearchPokemon = (e) => {
      setSearchPokemon(e.target.value)
      setAutocomplete((prevState) => {
        if(e.target.value === '') {
          return []
        }
        const regex = new RegExp(`^${e.target.value}`, 'i');
        return pokemonList.filter(pokemon => pokemon.name.match(regex))
      })

    }
    const setPokemonOnSearch = (e, pokeSuggestion) => {
      e.preventDefault()
      console.log(pokeSuggestion)
      setPokemon({
        img: pokeSuggestion.img,
        name: pokeSuggestion.name,
        found: true,
        type: pokeSuggestion.type,
        savedOnLocalStorage: true
      })
      setAutocomplete([])
    }
    return (
      <>
        <div className="back fixed top-1/4 left-1/3 w-80 h-96 p-4 border-2">
          <div className="container">
            {pokemon.found  && (
              <>
                <img className="px-6 py-2" src={`${pokemon.img}`} alt="" />
                <div className="name px-6 font-bold text-m capitalize">Name: {pokemon.name.toUpperCase()}</div>
                <div className="type px-6 font-bold text-m capitalize">Type: {pokemon.type.toUpperCase()}</div>
              </>
            )}
            <div className="absolute top-1/2 w-70">
            <form onSubmit={onSubmit}>
              <input className="p-1 border-2" placeholder="Search pokemons" type="text" onChange={onSearchPokemon} value={searchPokemon} />
              <button className="my-4 mx-2 bg-gray-400 text-white font-bold py-2 px-4 rounded" type="submit">Search</button>
            </form>
            {pokemon.found && !pokemon.savedOnLocalStorage && ( <button  className="my-1 mx-2 bg-gray-400 text-white font-bold py-2 px-4 rounded" onClick={() => savePokemon()}   > Save </button>)}
            {pokemon.found  && ( <button className="my-1 mx-2 bg-gray-400 text-white font-bold py-2 px-4 rounded"  onClick={() => clearSearch()}  > Clear </button>)}
            { autocomplete.length > 0 && autocomplete.map((pokeSuggestion, index) => (<div className="my-1 mx-2 bg-green-400 text-black font-bold py-2 rounded" key={index}><button onClick={(e) => setPokemonOnSearch(e, pokeSuggestion)}>{pokeSuggestion.name}</button></div>) )}
            </div>

            
            
          </div>
        </div>
      </>
    );
  }


export default App;
