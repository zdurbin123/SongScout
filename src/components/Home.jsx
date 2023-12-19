import React, {useContext,useEffect} from 'react';
import {AuthContext} from '../context/AuthContext';
import '../App.css';

function Home() {
  const {currentUser} = useContext(AuthContext);
  useEffect(() => {
    if (!currentUser?.displayName) {
      window.location.reload();
    }
  }, [currentUser]);
  return (
    <div className='card'>
      <h2>
        Hello {currentUser && currentUser.displayName}, this is the home page for SongScout. 
      </h2>
    </div>
  );
}

export default Home;
