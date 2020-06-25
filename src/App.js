import React, { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import axios from 'axios'; 
import PropTypes from 'prop-types';
import './App.css';

import Home from './components/Home';
import Search from './components/Search';
import Movies from './components/Movies';
import Customers from './components/Customers';
import Checkout from './components/Checkout';

const App = () => {
  const [ searchResults, setSearchResults ] = useState([]);
  const [ errorMessage, setErrorMessage ] = useState(null);
  
  const [ customerList, setCustomerList ] = useState([]);
  const [ selectedCustomer, setSelectedCustomer ] = useState(null);

  const [ movieList, setMovieList] = useState([]);
  const [ selectedMovie, setSelectedMovie ] = useState(null);

  const searchMovies = (search) => {
    axios.get('http://localhost:3000/movies', { params: search })
    .then((response) => {
      setSearchResults(response.data);
    })
    .catch((error) => {
      setErrorMessage(error.response.data.cause);
    });
  };

  const getMovies = useCallback(() => {
    axios.get('http://localhost:3000/movies')
    .then((response) => {
      setMovieList(response.data);
    })
    .catch((error) => {
      setErrorMessage(error.response.data.cause);
    })
  }, []);

  useEffect( getMovies, [ getMovies ]);

  const getCustomers = useCallback(() => {
    axios.get('http://localhost:3000/customers')
    .then((response) => {
      setCustomerList(response.data);
    })
    .catch((error) => {
      setErrorMessage(error.response.data.cause);
    });
  }, []);

  useEffect( getCustomers, [ getCustomers ]);

  const createRental = (title, customer_id, due_date) => {
    axios.post('http://localhost:3000/rentals/' + title + '/check-out', { params: title, customer_id, due_date })
    .then((response) => {
      setSearchResults(response.data);
    })
    .catch((error) => {
      setErrorMessage(error.response.data.cause);
    });
  }

  return (
    <Router>
      <header className="App-header">
        <nav className="App-nav">
          <h1 className="App-title"><a href="/">Video Store Consumer</a></h1>
          <div className="App-nav-links">
            <Link to="/" className="App-nav-links__item">Home</Link>
            <Link to="/search" className="App-nav-links__item">Movie Search</Link>
            <Link to="/library" className="App-nav-links__item">Movie Library</Link>
            <Link to="/customers" className="App-nav-links__item">Customer List</Link>
          </div>
        </nav>

        <div className="App-selected">
              <h3>Current Selection</h3>
            {
              selectedCustomer && (
                <span className="App-selected__customer">Customer #{selectedCustomer.id} {selectedCustomer.name}</span>
              )
            }
            {
              selectedMovie && (
                <span className="App-selected__movie">Movie: {selectedMovie.title} {selectedMovie.name}</span>
              )
            }
            {
              selectedCustomer && selectedMovie && (
                <Link to="/checkout" className="button">Checkout</Link>
              )
            }
          </div>
      </header>

      <main className="App-content">
        <Switch>
          <Route path="/search">
            <Search results={searchResults} onSearchMovieCallback={searchMovies} />
          </Route>
          <Route path="/library">
            <Movies list={movieList} onSelectCallback={setSelectedMovie} />
          </Route>
          <Route path="/customers">
            <Customers list={customerList} onSelectCallback={setSelectedCustomer} />
          </Route>
          <Route path="/checkout">
            <Checkout customer={selectedCustomer} movie={selectedMovie} onSubmitCallback={createRental} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
