import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Row, Col, Container } from 'react-bootstrap';
import { likeSong, dislikeSong, getLikedSongs } from '../../data/music';
import { LikesContext } from '../context/LikesContext';
import { AuthContext } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';

function MySongs() {
    const [token, setToken] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const { likedSongs, dislikedSongs, handleLike, handleDislike } = useContext(LikesContext);

    useEffect(() => {
        async function getToken() {
            const { data } = await axios.get('http://localhost:3000');
            setToken(data.access_token); 
        }
        getToken();
    }, []);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const auth = getAuth();
                const uid = auth.currentUser.uid;
                const likedSongsResponse = await getLikedSongs(uid);
                if (likedSongsResponse.length === 0) {
                    throw new Error('We cannot give you recommendations of what you might like as You have not liked any songs yet!');
                }

                const songIds = likedSongsResponse.slice(-5).map(song => song.song_id).join(',');
                console.log(likedSongsResponse)
                const artistIds=likedSongsResponse.slice(-5).map(i => i.artists.id).join(',');
                const url = `https://api.spotify.com/v1/recommendations?seed_tracks=${songIds}&seed_artists=${artistIds}`;
                console.log(url)
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setRecommendations(response.data.tracks);
            } catch (error) {
                setError(error.message || 'Error fetching recommendations');
            } finally {
                setHasFetched(true);
            }
        };

        if (token) {
            fetchRecommendations();
        }
    }, [token]);

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
        <Container>
            
              
            {error && <p>{error}</p>} 
            {!error&& hasFetched&&recommendations.length===0&& <p>Oops!!! You've caught us, No Recommendations for the given field/fields</p>}
            {!error && recommendations && recommendations.length > 0 && (
            <h2 className="text-center my-4">Songs You Might Wanna Check Out</h2>
        )}
            <Row  lg={4} className="g-4">
            {!error&&recommendations&&recommendations.map((track, index) => (
                
            <Col key={index} md={6} lg={3}>
                          
                        <Card key={index} className="h-100 w-100" style={{ width: '18rem' }}>
                        <Link to={`/Song/${track.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={index} >
                            <Card.Img variant="top" src={track.album.images[0]?.url|| noImage} alt={`${track.name}`}/>
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
    );
}

export default MySongs;