import React, {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import '../App.css';

function Home() {
  const {currentUser} = useContext(AuthContext);
  return (
    <div className='card'>
      <h2>
        Hello {currentUser && currentUser.displayName}, this is the home page for SongScout. 
      </h2>
    </div>
  );
}

export default Home;
