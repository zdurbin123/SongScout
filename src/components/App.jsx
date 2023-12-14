import React from 'react';
import '../App.css';
import {Route, Routes} from 'react-router-dom';
import Account from './Account';
import Home from './Home';
import Landing from './Landing';
import Display from'./Display';
import Artists from'./Artists';
import Song from'./Song';
import Navigation from './Navigation';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Trending from './Trending';
//hey its jey
import {AuthProvider} from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import RecommendationOptions from './RecommendationOptions';
import RecommendationResults from './RecommendationResults';
import LikedSongs from './LikedSongs';
function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <header className='App-header card'>
          <Navigation />
        </header>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/Display' element={<Display />} />
          <Route path='/Song/:id' element={<Song />} />
          <Route path='/Artists' element={<Artists />} />
          <Route path='/Trending' element={<Trending />} />
          <Route path='/home' element={<PrivateRoute />}>
            <Route path='/home' element={<Home />} />
          </Route>
          <Route path='/account' element={<PrivateRoute />}>
            <Route path='/account' element={<Account />} />
          //</Route>
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/likedsongs' element={<LikedSongs/>}/>
          <Route path='/ChooseRecommend' element={<RecommendationOptions />} />
          <Route path='/RecommedResults' element={<RecommendationResults />}/>
          </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
