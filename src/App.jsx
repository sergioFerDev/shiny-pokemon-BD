import React, { useState, useEffect } from "react";

function App() {
  
    const [name, setname] = useState("");
    const [Find, setFind] = useState("");
    const [Img, setImg] = useState("");
    const [Type, setType] = useState("");
    const [disName, setdisName] = useState("");
    const [listAdded,addList]= useState([]);  
    const [ error, setError ] = useState(false)
  
    useEffect(() => {
        let res = fetch(`https://pokeapi.co/api/v2/pokemon/${Find}`)
          .then(res=>res.json())
          .then(data=>{
            setImg(data.sprites.front_shiny||res.sprites.front_default)
            setType(data.types[0].type.name);
            setdisName(Find);
          })
          .catch(err=>{
            //alert("Pokemon doesn't exist");
            setError(true)
          });
    
         // console.log(res
    }, [Find]);
  
    const Typename = (event) => {
      setname(event.target.value);
    };
  
    const Search = () => {
      if (name !== "") setFind(name);
      
      //setname("");
    };
  
    const Add =()=>{
      if (!listAdded.includes(disName)) {
        listAdded.push(disName)
        console.log(listAdded)
      }
    }
    return (
      <>
        <div className="back">
          <div className="card">
            <img src={`${Img}`} alt="" />
            <div className="name">{disName.toUpperCase()}</div>
            <div className="type">{Type}</div>
            <input type="text" onChange={Typename} value={name} />
            <button onClick={Search}>Search</button>
            <button onClick={Add}>Add</button>
          </div>
        </div>
      </>
    );
  }


export default App;
