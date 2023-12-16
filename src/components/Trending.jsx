import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Trending = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    async function to(){
      
    const {data} = await axios.get('http://localhost:3000')
    console.log(data)
     
    setToken(data.access_token);
      
    }

    to();
  }, []);

  return (
    <div>
      <h1> {token}</h1>
    </div>
  );
};

export default Trending;
