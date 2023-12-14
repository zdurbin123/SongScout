import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,Card,Row,Container,InputGroup,FormControl} from 'react-bootstrap';
import {likeSong,dislikeSong, getLikedSongsSortedByLikes} from '../../data/music';
import { AuthContext } from '../context/AuthContext';


function Display() {
    const[searchTerm,setsearchTerm]=useState('');
    const [token, setToken] = useState('');
    const [tracks, setTracks] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const [likedSongs, setLikedSongs] = useState([]);
    const [dislikedSongs, setDislikedSongs] = useState([]);

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

  const handleLike = async (track) => {
    try {
      console.log('track:', track);
      await likeSong(currentUser.uid, {
        song_name: track.name,
        song_id: track.id,
        artists: track.artists.map(artist => ({ id: artist.id, name: artist.name })),
        preview_url: track.preview_url,
        song_url: track.external_urls.spotify,
        image_url: track.album.images[0]?.url
      });
      setLikedSongs([...likedSongs, track.id]); 
      setDislikedSongs(dislikedSongs.filter(id => id !== track.id));
    } catch (error) {
      console.error('Error liking song:', error);
    }
  };

  const handleDislike = async (track) => {
    try {
      await dislikeSong(currentUser.uid, track.id);
      console.log('Disliked song successfully!');
      setDislikedSongs([...dislikedSongs, track.id]); 
      setLikedSongs(likedSongs.filter(id => id !== track.id));
    } catch (error) {
      console.error('Error disliking song:', error);
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
                                            onClick={() => handleLike(track)}
                                            disabled={likedSongs.includes(track.id)} // Disable if already liked
                                          >
                                    <i className="bi bi-heart-fill"></i> Like
                                  </Button>
                                  {/* <Button variant="danger" onClick={() => handleDislike(track)}> */}
                                  <Button
                                        variant="danger"
                                        onClick={() => handleDislike(track)}
                                        disabled={dislikedSongs.includes(track.id)} // Disable if already disliked
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
