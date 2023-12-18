import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Row,Col, Container, InputGroup, FormControl,Form } from 'react-bootstrap';
import { likeSong, dislikeSong } from '../../data/music';
import { LikesContext } from '../context/LikesContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import * as validation from '../../data/validation'

function RecommendationResults() {
    const [token, setToken] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);
    const [genres, setGenres] = useState(null);
    const [market, setMarket] = useState(null);
    const [minLoudness, setMinLoudness] = useState(null);
    const [maxLoudness, setMaxLoudness] = useState(null);
    const [minPopularity, setMinPopularity] = useState(null);
    const [maxPopularity, setMaxPopularity] = useState(null);
    const [minTempo, setMinTempo] = useState(null);
    const [maxTempo, setMaxTempo] = useState(null);
    const [limit, setLimit] = useState(20);
    const [artists, setArtists] = useState(null);
    const [songs, setSongs] = useState(null);
    const [searchParams, setSearchParams] = useState({
        limit: 20, 
        seed_genres: '',
        
    });
    const { currentUser } = useContext(AuthContext);
    const { likedSongs, dislikedSongs, handleLike, handleDislike } = useContext(LikesContext);

    useEffect(() => {
        async function getToken() {
            const { data } = await axios.get('http://localhost:3000');
            setToken(data.access_token); 
        }

        getToken();
    }, []);

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value.trim() });
        




        //some of these are to prevent people from messing with the source code and getting extra values
        if(e.target.name == "target_acousticness"){
          if(validation.checkAcousticness(e.target.value)){
            alert(validation.checkAcousticness(e.target.value));
          }  
        }

        if(e.target.name == "limit"){
          setLimit(e.target.value);
        }

        if(e.target.name == "seed_genres"){
          setGenres(e.target.value);
      }

        if(e.target.name == "seed_artists"){
          setArtists(e.target.value);
        }

        if(e.target.name == "seed_tracks"){
            setSongs(e.target.value);
        }

        if(e.target.name == "market"){
          setMarket(e.target.value);
        }

        if(e.target.name == "min_loudness"){
          setMinLoudness(e.target.value);
          if(validation.checkLoudness(e.target.value)){
            alert(validation.checkLoudness(e.target.value));
          } 
        }
        if(e.target.name == "max_loudness"){
          setMaxLoudness(e.target.value);
          if(validation.checkLoudness(e.target.value)){
            alert(validation.checkLoudness(e.target.value));
          } 
        }

        if(e.target.name == "min_popularity"){
          setMinPopularity(e.target.value);
          if(validation.checkPopularity(e.target.value)){
            alert(validation.checkPopularity(e.target.value));
          } 
        }
        if(e.target.name == "max_popularity"){
          setMaxPopularity(e.target.value);
          if(validation.checkPopularity(e.target.value)){
            alert(validation.checkPopularity(e.target.value));
          } 
        }

        if(e.target.name == "min_tempo"){
          setMinTempo(e.target.value);
          if(validation.checkTempo(e.target.value)){
            alert(validation.checkTempo(e.target.value));
          } 
        }
        if(e.target.name == "max_tempo"){
          setMaxTempo(e.target.value);
          if(validation.checkTempo(e.target.value)){
            alert(validation.checkTempo(e.target.value));
          } 
        }

   
    };

    const fetchRecommendations = async () => {
      setError(null);
      let isValid = true;
      if(validation.checkGenres(genres)){
        alert(validation.checkGenres(genres));
        isValid = false;
      }

      if(validation.checkMarket(market)){
        alert(validation.checkMarket(market));
        isValid = false;
      }

      if(validation.checkLimit(limit)){
        alert(validation.checkLimit(limit));
        isValid = false;
      }


      if(validation.checkLoudCross(minLoudness, maxLoudness)){
        alert(validation.checkLoudCross(minLoudness, maxLoudness));
        isValid = false;
      }

      if(validation.checkPopCross(minPopularity, maxPopularity)){
        alert(validation.checkPopCross(minPopularity, maxPopularity));
        isValid = false;
      }

      if(validation.checkTempoCross(minTempo, maxTempo)){
        alert(validation.checkTempoCross(minTempo, maxTempo));
        isValid = false;
      }
     console.log(isValid)
      if (isValid){
        const query = new URLSearchParams(searchParams).toString();
        console.log(query)
        const url = `https://api.spotify.com/v1/recommendations?${query}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setRecommendations(response.data.tracks);
            console.log(response.data.tracks)
        } catch (error) {
          setError('Error fetching recommendations');
        }
      }
    };
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
        <Container>
          
            <Form className="mb-4">
                <Row lg={4} className="g-4" >
                    
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Market</Form.Label>
                        <FormControl
                            placeholder="Enter Market Code (e.g., US)"
                            name="market"
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                        />
                        <Form.Text className="text-muted">
                            Enter an ISO 3166-1 alpha-2 country code.
                        </Form.Text>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Seed Genres</Form.Label>
                        <FormControl 
                            placeholder="Enter Genres (comma-separated)"
                            name="seed_genres"
                            onChange={handleChange}
                            required
                        />
                        <Form.Text className="text-muted">
                            Provide at least one genre, separated by commas.
                        </Form.Text>
                    </Form.Group>
                </Col>
              

                <Col md={6}>
        <Form.Group>
            <Form.Label>Seed Artists</Form.Label>
            <FormControl
                placeholder="Enter Artists (comma-separated)"
                name="seed_artists"
                onChange={handleChange}
            />
            <Form.Text className="text-muted">
                List of artist IDs, separated by commas.
            </Form.Text>
        </Form.Group>
    </Col>

    <Col md={6}>
        <Form.Group>
            <Form.Label>Seed Tracks</Form.Label>
            <FormControl
                placeholder="Enter Tracks (comma-separated)"
                name="seed_tracks"
                onChange={handleChange}
            />
            <Form.Text className="text-muted">
                List of track IDs, separated by commas.
            </Form.Text>
        </Form.Group>
    </Col>
                <FormControl
                    type="number"
                    placeholder="Limit (1-100)"
                    name="limit"
                    onChange={handleChange}
                    min="1"
                    max="100"
                />

                {/* Used sliders  */}
                <Form.Group controlId="formAcousticness">
                    <Form.Label>Acousticness (0-1)</Form.Label>
                    <Form.Control type="range" min="0" max="1" step="0.01" name="target_acousticness" onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formDanceability">
                    <Form.Label>Danceability (0-1)</Form.Label>
                    <Form.Control type="range" min="0" max="1" step="0.01" name="target_danceability" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formValence">
                    <Form.Label>Valence (0-1)</Form.Label>
                    <Form.Control type="range" min="0" max="1" step="0.01" name="target_valence" onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formTempo">
                    <Form.Label>Tempo (BPM)</Form.Label>
                    <InputGroup>
                        <FormControl type="number" placeholder="Min Tempo" name="min_tempo" onChange={handleChange} />
                        <FormControl type="number" placeholder="Max Tempo" name="max_tempo" onChange={handleChange} />
                    </InputGroup>
                </Form.Group>

                <Form.Group controlId="formSpeechiness">
                    <Form.Label>Speechiness (0-1)</Form.Label>
                    <Form.Control type="range" min="0" max="1" step="0.01" name="target_speechiness" onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formLiveness">
                    <Form.Label>Liveness (0-1)</Form.Label>
                    <Form.Control type="range" min="0" max="1" step="0.01" name="target_liveness" onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formLoudness">
                    <Form.Label>Loudness (dB)</Form.Label>
                    <InputGroup>
                        <FormControl type="number" placeholder="Min Loudness" name="min_loudness" onChange={handleChange} />
                        <FormControl type="number" placeholder="Max Loudness" name="max_loudness" onChange={handleChange} />
                    </InputGroup>
                </Form.Group>

                <Form.Group controlId="formPopularity">
                    <Form.Label>Popularity (0-100)</Form.Label>
                    <InputGroup>
                        <FormControl type="number" placeholder="Min Popularity" name="min_popularity" onChange={handleChange} min="0" max="100" />
                        <FormControl type="number" placeholder="Max Popularity" name="max_popularity" onChange={handleChange} min="0" max="100" />
                    </InputGroup>
                </Form.Group>

                </Row>
            </Form>
           
            <Button onClick={fetchRecommendations} className="mb-4">Get Recommendations</Button>
         
              
            {error && <p>{error}</p>} 
         
            <Row  lg={4} className="g-4">
            {!error&&recommendations&&recommendations.map((track, index) => (
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
    );
}

export default RecommendationResults;