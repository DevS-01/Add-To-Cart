import React, { useState } from "react"
import Cat from './assets/cat.png'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { useEffect } from "react"

const appSetting = {
  databaseURL: "https://cart-app-8dc99-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const app = initializeApp(appSetting)
const database = getDatabase(app)
const shoppingList = ref(database, 'Shopping List')

function App() {
  
  const [input, setInput] = useState('')
  const[list, setList] = useState([])


  function handleChange(e){
    setInput(e.target.value)
  }
  
  function addhandle(){
    const value = input ? input : null
    push(shoppingList, value)
    clear()
  }
  
  function clear(){
    setInput('')
  }
  
  useEffect(() => {
    onValue(shoppingList, function(snapshot){
      if(snapshot.exists()){
        setList([])
        let shoppingItems = Object.entries(snapshot.val())
        setList(shoppingItems)    
      }

      else{
        setList([])
      }
    })
  },[])

  function handleremove(itemId){
    let deleteItem = ref(database, `Shopping List/${itemId}`)
    remove(deleteItem)
  }
  
  function addItems(list){
    return <li key={list[0]} onClick={() => handleremove(list[0])}>{list[1]}</li>
  }


  return (
    <div className="container">
      <img src={Cat}/>

      <input type='text'
       placeholder='Bread'
        className='inp'
        value={input}
        onChange={(e) => handleChange(e)}/>

      <button className="btn" onClick={() => addhandle()}>Add To Cart</button>

      <ul>
        {list.map(item => addItems(item))}
      </ul>

      {list.length ? null : <p className="display-msg">No items here...yet</p>}
    </div>
  )
}

export default App
