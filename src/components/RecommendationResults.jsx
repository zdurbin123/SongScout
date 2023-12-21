import React, { useState, useEffect, useContext, useRef} from 'react';
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
    const [hasFetched, setHasFetched] = useState(false);
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

    const marketRef = useRef(null);
    const genresRef = useRef(null);
    const artistsRef = useRef(null);
    const tracksRef = useRef(null);
    const acousticnessRef = useRef(null);
    const danceabilityRef = useRef(null);
    const valenceRef = useRef(null);
    const livenessRef = useRef(null);
    const speechinessRef = useRef(null);
    const limitRef = useRef(null);
    const minTempoRef = useRef(null);
    const maxTempoRef = useRef(null);
    const minLoudnessRef = useRef(null);
    const maxLoudnessRef = useRef(null);
    const minPopularityRef = useRef(null);
    const maxPopularityRef = useRef(null);

    useEffect(() => {
        async function getToken() {
            const { data } = await axios.get('http://localhost:3000');
            setToken(data.access_token); 
        }

        getToken();
    }, []);


        


   


    const fetchRecommendations = async () => {
      setError(null);

      let isValid = true;

            //some of these are to prevent people from messing with the source code and getting extra values
          if(acousticnessRef.current.value){
            if(validation.checkAcousticness(acousticnessRef.current.value)){
              alert(validation.checkAcousticness(acousticnessRef.current.value));
              isValid = false;
            }
          }  
  
  
          if(minLoudnessRef.current.value){
            if(validation.checkLoudness(minLoudnessRef.current.value)){
              alert(validation.checkLoudness(minLoudnessRef.current.value));
              isValid = false;
            } 
          }
          if(maxLoudnessRef.current.value){
            if(validation.checkLoudness(maxLoudnessRef.current.value)){
              alert(validation.checkLoudness(maxLoudnessRef.current.value));
              isValid = false;
            } 
          }
  
          if(minPopularityRef.current.value){
            if(validation.checkPopularity(minPopularityRef.current.value)){
              alert(validation.checkPopularity(minPopularityRef.current.value));
              isValid = false;
            } 
          }
          if(maxPopularityRef.current.value){
            if(validation.checkPopularity(maxPopularityRef.current.value)){
              alert(validation.checkPopularity(maxPopularityRef.current.value));
              isValid = false;
            } 
          }
  
          if(minTempoRef.current.value){
            if(validation.checkTempo(minTempoRef.current.value)){
              alert(validation.checkTempo(minTempoRef.current.value));
              isValid = false;
            } 
          }
          if(maxTempoRef.current.value){
            if(validation.checkTempo(maxTempoRef.current.value)){
              alert(validation.checkTempo(maxTempoRef.current.value));
              isValid = false;
            } 
          }






        if(validation.checkGenres(genresRef.current.value)){
          alert(validation.checkGenres(genresRef.current.value));
          isValid = false;
        }
      

      if(marketRef.current.value){
        if(validation.checkMarket(marketRef.current.value)){
          alert(validation.checkMarket(marketRef.current.value));
          isValid = false;
        }
      }
      if(artistsRef.current.value){
        if(validation.checkArtists(artistsRef.current.value)){
          alert(validation.checkArtists(artistsRef.current.value));
          isValid = false;
        }
      }
      if(tracksRef.current.value){
        if(validation.checkTracks(tracksRef.current.value)){
          alert(validation.checkTracks(tracksRef.current.value));
          isValid = false;
        }
      }

    if(limitRef.current.value){
      if(validation.checkLimit(limitRef.current.value)){
        alert(validation.checkLimit(limitRef.current.value));
        isValid = false;
      }
    }

    if(minLoudnessRef.current.value && maxLoudnessRef.current.value){
      if(validation.checkLoudCross(minLoudnessRef.current.value, maxLoudnessRef.current.value)){
        alert(validation.checkLoudCross(minLoudnessRef.current.value, maxLoudnessRef.current.value));
        isValid = false;
      }
    }

      if(minPopularityRef.current.value && maxPopularityRef.current.value){
        if(validation.checkPopCross(minPopularityRef.current.value, maxPopularityRef.current.value)){
          alert(validation.checkPopCross(minPopularityRef.current.value, maxPopularityRef.current.value));
          isValid = false;
        }
      }
      if(minTempoRef.current.value && maxTempoRef.current.value){
        if(validation.checkTempoCross(minTempoRef.current.value, maxTempoRef.current.value)){
          alert(validation.checkTempoCross(minTempoRef.current.value, maxTempoRef.current.value));
          isValid = false;
        }
      }
     console.log(isValid)
      if (isValid){

        const searchParams = new URLSearchParams();
        if (limitRef.current.value) searchParams.append('limit', limitRef.current.value);
        if (marketRef.current.value) searchParams.append('market', marketRef.current.value);
        if (genresRef.current.value) searchParams.append('seed_genres', genresRef.current.value);
        if (artistsRef.current.value) searchParams.append('seed_artists', artistsRef.current.value);
        if (tracksRef.current.value) searchParams.append('seed_tracks', tracksRef.current.value);
        if (danceabilityRef.current.value) searchParams.append('target_danceability', danceabilityRef.current.value);
        if (acousticnessRef.current.value) searchParams.append('target_acousticness', acousticnessRef.current.value);
        if (valenceRef.current.value) searchParams.append('target_valence', valenceRef.current.value);
        if (speechinessRef.current.value) searchParams.append('target_speechiness', speechinessRef.current.value);
        if (livenessRef.current.value) searchParams.append('target_liveness', livenessRef.current.value);
        if (minTempoRef.current.value) searchParams.append('min_tempo', minTempoRef.current.value);
        if (maxTempoRef.current.value) searchParams.append('max_tempo', maxTempoRef.current.value);
        if (minLoudnessRef.current.value) searchParams.append('min_loudness', minLoudnessRef.current.value);
        if (maxLoudnessRef.current.value) searchParams.append('max_loudness', maxLoudnessRef.current.value);
        if (minPopularityRef.current.value) searchParams.append('min_popularity', minPopularityRef.current.value);
        if (maxPopularityRef.current.value) searchParams.append('max_popularity', maxPopularityRef.current.value);

        const query = new URLSearchParams(searchParams).toString();
        console.log(query)
        const url = `https://api.spotify.com/v1/recommendations?${query}`;
        console.log(url)

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
          console.log(error.response)
          const errorMessage = `Error fetching recommendations: ${error.response.data.error.message} with status code: ${error.response.data.error.status}`;
        setError(errorMessage);
          
        }
        finally {
          setHasFetched(true); 
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
                            ref={marketRef}
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
                            ref={genresRef}
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
                ref={artistsRef}
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
                ref={tracksRef}
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
                    ref={limitRef}
                    min="1"
                    max="100"
                />

                {/* Used sliders  */}
                <Form.Group controlId="formAcousticness">
                    <Form.Label>Acousticness (0 to 1)</Form.Label>
                    <Form.Control type="range" min="0" max="1" step="0.01" name="target_acousticness" ref={acousticnessRef} />
                </Form.Group>

                <Form.Group controlId="formDanceability">
                    <Form.Label>Danceability (0 to 1)</Form.Label>
                    <Form.Control type="range" min="0" max="1" step="0.01" name="target_danceability" ref={danceabilityRef}  />
                </Form.Group>
                <Form.Group controlId="formValence">
                    <Form.Label>Valence (0 to 1)</Form.Label>
                    <Form.Control type="range" min="0" max="1" step="0.01" name="target_valence" ref={valenceRef}  />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Tempo (BPM) (0 to 1000)</Form.Label>
                    <InputGroup>
                        <FormControl type="number" placeholder="Min Tempo" name="min_tempo" id="formMinTempo" ref={minTempoRef}  />
                        <FormControl type="number" placeholder="Max Tempo" name="max_tempo" id="formMaxTempo" ref={maxTempoRef}  />
                    </InputGroup>
                </Form.Group>

                <Form.Group controlId="formSpeechiness">
                    <Form.Label>Speechiness (0 to 1)</Form.Label>
                    <Form.Control type="range" min="0" max="1" step="0.01" name="target_speechiness" ref={speechinessRef}  />
                </Form.Group>

                <Form.Group controlId="formLiveness">
                    <Form.Label>Liveness (0 to 1)</Form.Label>
                    <Form.Control type="range" min="0" max="1" step="0.01" name="target_liveness" ref={livenessRef}  />
                </Form.Group>

                <Form.Group >
                    <Form.Label>Loudness (dB) (-60 to 0)</Form.Label>
                    <InputGroup>
                        <FormControl type="number" placeholder="Min Loudness" name="min_loudness" id="formMinLoudness" ref={minLoudnessRef}  />
                        <FormControl type="number" placeholder="Max Loudness" name="max_loudness" id="formMaxLoudness" ref={maxLoudnessRef}  />
                    </InputGroup>
                </Form.Group>

                <Form.Group >
                    <Form.Label>Popularity (0 to 100)</Form.Label>
                    <InputGroup>
                        <FormControl type="number" placeholder="Min Popularity" name="min_popularity" id="formMinPopularity" ref={minPopularityRef}  min="0" max="100" />
                        <FormControl type="number" placeholder="Max Popularity" name="max_popularity" id="formMaxPopularity" ref={maxPopularityRef}  min="0" max="100" />
                    </InputGroup>
                </Form.Group>

                </Row>
            </Form>
           
            <Button onClick={fetchRecommendations} className="mb-4">Get Recommendations</Button>
         
              
            {error && <p>{error}</p>} 
            {!error&& hasFetched&&recommendations.length===0&& <p>Oops!!! You've caught us, No Recommendations for the given field/fields</p>}
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