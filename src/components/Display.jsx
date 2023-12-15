import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Row, Container, InputGroup, FormControl } from 'react-bootstrap';
import { likeSong, dislikeSong } from '../../data/music';
import { LikesContext } from '../context/LikesContext';
import { AuthContext } from '../context/AuthContext';

function Display() {
    const [searchTerm, setsearchTerm] = useState('');
    const [token, setToken] = useState('');
    const [tracks, setTracks] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { likedSongs, dislikedSongs, handleLike, handleDislike } = useContext(LikesContext);

    useEffect(() => {
    async function to() {
        const {data} = await axios.get('http://localhost:3000')
        console.log(data)
        setToken(data.access_token); 
    }

    to();
  }, []);

  async function querySearch(){
    console.log("hi")
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
  } catch (error) {
      console.error('Error from Spotify:', error);
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
            await dislikeSong(currentUser.uid, track.id);
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
         </Container>
         <Container>
         <Row  lg={3} className="g-4">
         {tracks.map((track, index) => (
                        <Card key={index} style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={track.album.images[0]?.url} />
                            <Card.Body>
                                <Card.Title>{track.name}</Card.Title>
                                <Card.Text>
                                    Artist: {track.artists.map(artist => artist.name).join(', ')}
                                </Card.Text>
                                
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
                    ))}

        </Row>
        </Container>
       </div>
      );

};

export default Display;
