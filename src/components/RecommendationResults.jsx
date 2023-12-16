import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import '../App.css';

function RecommendationResults() {
  const [token, setToken] = useState('');
  const [results, setResults] = useState('');
  useEffect(() => {
    async function to(){
      
    const {data} = await axios.get('http://localhost:3000')
    console.log(data)
     
    setToken(data.access_token);
      
    }

    to();
  }, []);

  useEffect(() => {
    async function to(){
      let URL = "https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl"
    const {data} = await axios.get(URL, { headers: { 'Authorization': 'Bearer ' +  token }})
    setResults(data);
    console.log(results);
     
    }

    to();
  }, []);

  return (
    <div className='card'>
      <h2>
        song recommendation Results
      </h2>
    </div>
  );
}

export default RecommendationResults;