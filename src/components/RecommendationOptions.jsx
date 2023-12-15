import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../context/AuthContext';
import {Slider} from '@mui/material';
import '../App.css';

function RecommendationOptions() {
  const [Acousticness, setAcousticness] = useState(0);
  const [Liveliness, setLiveliness] = useState(0);
  const [Danceability, setDanceability] = useState(0);



  const SliderAccousticness = (event, value) => {
    setAcousticness(value);
  };

  const SliderLiveliness = (event, value) => {
    setLiveliness(value);
  };

  const SliderDanceability = (event, value) => {
    setDanceability(value);
  };


  const resetOptions = (event) => {
    setAcousticness(0);
    setLiveliness(0);
    setDanceability(0);
  };
  return (
    <div className='card'>
      <h2>
        Options for song recommendation
      </h2>

      <button onClick={resetOptions}>Reset</button>


      <h3>Acousticness</h3>
      <Slider
        aria-label="Acousticness"
        size="medium"
        defaultValue={0.5}
        valueLabelDisplay="auto"
        step={0.1}
        marks
        min={0}
        max={1}
        onChange={SliderAccousticness}
        value = {Acousticness}
        />

        <br/>

      <h3>Liveliness</h3>
      <Slider
        aria-label="Livelines"
        size="medium"
        defaultValue={0.5}
        valueLabelDisplay="auto"
        step={0.1}
        marks
        min={0}
        max={1}
        onChange={SliderLiveliness}
        value = {Liveliness}
        />


      <h3>Danceability</h3>
      <Slider
        aria-label="Danceability"
        size="medium"
        defaultValue={0.5}
        valueLabelDisplay="auto"
        step={0.1}
        marks
        min={0}
        max={1}
        onChange={SliderDanceability}
        value = {Danceability}
        />

        <br/>

        <p>Acousticness: {Acousticness}</p>
        <p>Liveliness: {Liveliness}</p>
        <p>Danceability: {Danceability}</p>



      


    </div>
    
  );
}

export default RecommendationOptions;





