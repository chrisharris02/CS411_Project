import React, {useState, useEffect} from 'react'

function App(){

  const[data,setData] = useState([{}])

  useEffect(() => {
    fetch("/members").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])
  return(
    <div>

      {(typeof data.data === 'undefined')? (
        <p>Loading...</p>
      ) : (
        data.data.map((data, i) => (
          <p key={i}>{data}</p>
        ))
      )}
    </div>
  )
}

export default App