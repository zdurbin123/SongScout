import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Row,Col, Container, InputGroup, FormControl,Alert } from 'react-bootstrap';
import { likeSong, dislikeSong } from '../../data/music';
import { LikesContext } from '../context/LikesContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Display() {
    const [searchTerm, setsearchTerm] = useState('');
    const [token, setToken] = useState('');
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);
    const { likedSongs, dislikedSongs, handleLike, handleDislike } = useContext(LikesContext);
    const MAX_SEARCH_TERM_LENGTH = 200;
    useEffect(() => {
        async function to() {
          try{
            const {data} = await axios.get('http://localhost:3000')
            console.log(data)
            setToken(data.access_token); }
            catch (error) {
              console.error('Error fetching token:', error);
              setError('Failed to fetch authentication token.');
          }
        }
        
    
        to();
      }, []);

  async function querySearch(){
    console.log("hi")
    if (!searchTerm) {
        setError('Please enter a search term.');
        return;
    }
    if (searchTerm.length > MAX_SEARCH_TERM_LENGTH) {
        setError(`Search term is too long. Please limit it to ${MAX_SEARCH_TERM_LENGTH} characters.`);
        return;
    }
    setError('');// it is used for clearing existing errors
    const parameters = {
        headers:{
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    try {
      const { data } = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track`, parameters);
      setTracks(data.tracks.items)
      console.log(data.tracks.items);
      if (data.tracks.items.length === 0) {
        setError('No tracks found.');
    }
  } catch (error) {
      console.error('Error from Spotify:', error);
      setError('Failed to fetch tracks!!! Please try again later.');
  }
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      querySearch();
    }
  };


const handleLikeSong = async (track) => {
    if (!likedSongs.includes(track.id)) {
        try {
            await likeSong(currentUser.uid, {
                song_name: track.name,
                song_id: track.id,
                artists: track.artists.map(artist => ({ id: artist.id, name: artist.name })),
                preview_url: track.preview_url,
                song_url: track.external_urls.spotify,
                image_url: track.album.images[0]?.url
            });
            handleLike(track.id);
        } catch (error) {
            console.error('Error liking song:', error);
        }
    } else {
        // If the song is already liked, this acts as an 'unlike'
        handleDislike(track.id); // Removing it from liked songs
    }
};

const handleDislikeSong = async (track) => {
    if (!dislikedSongs.includes(track.id)) {
        try {
            await dislikeSong(currentUser.uid, {
                song_name: track.name,
                song_id: track.id,
                artists: track.artists.map(artist => ({ id: artist.id, name: artist.name })),
                preview_url: track.preview_url,
                song_url: track.external_urls.spotify,
                image_url: track.album.images[0]?.url
            });
            handleDislike(track.id);
        } catch (error) {
            console.error('Error disliking song:', error);
        }
    } else {
        // If the song is already disliked, this acts as an 'undislike'
        handleLike(track.id); // Removing it from disliked songs
    }
};


    return (
    <div>
        <Container>
            <InputGroup size="lg" className="mb-3">  
        
        <FormControl
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          placeholder="Search Tracks"
          type="input"
          onChange={event=>setsearchTerm(event.target.value)}
          onKeyDown={handleKeyPress}
    />
    
        <Button onClick={()=>{querySearch()}}variant="primary">Search</Button>
         </InputGroup>
         {error && <Alert variant="danger">{error}</Alert>}
         </Container>
         <Container>
         <Row  lg={4} className="g-4">
         {tracks.map((track, index) => (
            <Col key={index} md={6} lg={3}>
                          
                        <Card key={index} className="h-100 w-100" style={{ width: '18rem' }}>
                        <Link to={`/Song/${track.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={index} >
                            <Card.Img variant="top" src={track.album.images[0]?.url} />
                            <Card.Body>
                                <Card.Title>{track.name}</Card.Title>
                                <Card.Text>
                                    Artist: {track.artists.map(artist => artist.name).join(', ')}   
                                </Card.Text>
                                <Card.Text>
                                   ID: {track.id}     
                                </Card.Text>
                                
                                </Card.Body>
                                </Link>
                                <Card.Body>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                  {/* <Button variant="success" onClick={() => handleLike(track)}> */}
                                
                                  <Button
                                    variant="success"
                                    onClick={() => handleLikeSong(track)}
                                    disabled={likedSongs.includes(track.id) && !dislikedSongs.includes(track.id)}
                                >
                                    <i className="bi bi-heart-fill"></i> Like
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDislikeSong(track)}
                                    disabled={dislikedSongs.includes(track.id) && !likedSongs.includes(track.id)}
                                >
                                    <i className="bi bi-x-lg"></i> Dislike
                                </Button>

                              </div>
                                
                                <Button variant="primary" href={track.external_urls.spotify} target="_blank">Listen on Spotify</Button>
                            </Card.Body>
                        </Card>
                         
                          </Col>
                    ))}

        </Row>
        </Container>
       </div>
      );

};

export default Display;
