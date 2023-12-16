import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Row,Col, Container, InputGroup, FormControl,Form } from 'react-bootstrap';
import { likeSong, dislikeSong } from '../../data/music';
import { LikesContext } from '../context/LikesContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function RecommendationResults() {
    const [token, setToken] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({
        limit: 20, 
        seed_genres: '',
        // gotta add
    });

    useEffect(() => {
        async function getToken() {
            const { data } = await axios.get('http://localhost:3000');
            setToken(data.access_token); 
        }

        getToken();
    }, []);

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const fetchRecommendations = async () => {
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
    };

   
    return (
        <Container>
            <Form className="mb-4">
                <Row lg={4} className="g-4" >
                    
                <FormControl
                    placeholder="Market (e.g. US)"
                    name="market"
                    onChange={handleChange}
                />
                
                <Form.Label>U MUST GIVE ATLEAST ONE GENRE!!!</Form.Label>
              
                <FormControl
                    placeholder="Seed Genres (comma separated) mandatory"
                    name="seed_genres"
                    onChange={handleChange}
                    required
                />
               


                <FormControl
                    placeholder="Seed Artists (comma separated)"
                    name="seed_artists"
                    onChange={handleChange}
                />
                <FormControl
                    placeholder="Seed Tracks (comma separated)"
                    name="seed_tracks"
                    onChange={handleChange}
                />
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
           
            <Row>
                {recommendations&&recommendations.map((track, index) => (
                    <Col key={index} md={4}>
                        <Card>
                            <Card.Img variant="top" src={track.album.images[0]?.url} />
                            <Card.Body>
                                <Card.Title>{track.name}</Card.Title>
                              {/* Gotta add more details */}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default RecommendationResults;