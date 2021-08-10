import NavBar from './components/NavBar';
import Views from './components/Views';
import { BrowserRouter as Router } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Views />
      </Router>
    </div>
  );
}

export default App;
