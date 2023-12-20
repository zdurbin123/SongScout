import React from 'react';
import '../App.css';
import { Route, Routes } from 'react-router-dom';
import Account from './Account';
import Home from './Home';
import Landing from './Landing';
import Display from './Display';
import Artists from './Artists';
import { LikesProvider } from '../context/LikesContext';
import Song from './Song';
import Navigation from './Navigation';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Trending from './Trending';
import { AuthProvider } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import RecommendationResults from './RecommendationResults';
import LikedSongs from './LikedSongs';
import DislikedSongs from './DislikedSongs';
import ErrorNotFound from './ErrorNotFound';

function App() {
  return (
    <AuthProvider>
      <LikesProvider>
        <div className='App'>
          <header className='App-header card'>
            <Navigation />
          </header>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path='/home' element={<Home />} />
              <Route path='/Display' element={<Display />} />
              <Route path='/Song/:id' element={<Song />} />
              <Route path='/Artists' element={<Artists />} />
              <Route path='/Trending' element={<Trending />} />
              <Route path='/account' element={<Account />} />
              <Route path='/likedsongs' element={<LikedSongs />} />
              <Route path='/dislikedsongs' element={<DislikedSongs />} />
              <Route path='/RecommedResults' element={<RecommendationResults />} />
              <Route path='*' element={<ErrorNotFound />} />
            </Route>
          </Routes>
        </div>
      </LikesProvider>
    </AuthProvider>
  );
}

export default App;
