import NavBar from './components/NavBar';
import Views from './components/Views';
import { BrowserRouter as Router } from 'react-router-dom';
import authContext from './components/AuthContext';
import React, { useEffect, useState } from 'react';


function App() {
  const [auth, setAuth] = useState(null);
  const url = '/api/user/authentication';
  useEffect(() => {
    fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => {
        if (res.status === 200) {
          setAuth(true);
          console.log(auth);
        } else {
          const refresh = '/api/token/refresh';
          fetch(refresh, {
            method: 'GET',
            credentials: 'include'
          })
            .then((res) => {
              if(res.status === 200){
                setAuth(true);
              } else {
                console.log(res.status);
                setAuth(false);
              }
            })          
        }
      })
  });

  return (
    <div className="App">
      <authContext.Provider value={{ auth, setAuth }}>
        <Router>
          <NavBar />
          <Views />
        </Router>
      </authContext.Provider>
    </div>
  );
}

export default App;
