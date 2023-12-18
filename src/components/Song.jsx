import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { likeSong, dislikeSong } from '../../data/music';
import { AuthContext } from '../context/AuthContext';
import { LikesContext } from '../context/LikesContext';
import Carousel from 'react-bootstrap/Carousel';
import {Button,Card,Row,Col,Container} from 'react-bootstrap';
function Song() {
    const [token, setToken] = useState('');
    const [song, setSong] = useState({});
    const [artistsDetails, setArtistsDetails] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const { likedSongs, dislikedSongs, handleLike, handleDislike } = useContext(LikesContext);

  // waiting for parent class to send the id to this func for me to display the info
  //one more light 
  const { id } = useParams();
  //const id="3xXBsjrbG1xQIm1xv1cKOt" SONG:ONE MORE LIGHT- LINKIN PARK
  //const id="5b2bu6yyATC1zMXDGScJ2d" EXAMPLE FOR SHOWING MUTIPLE ARTISTS

    useEffect(() => {
        async function to() {
            const {data} = await axios.get('http://localhost:3000')
            console.log(data)
            setToken(data.access_token); 
        }
    
        to();
      }, []);
      

      useEffect(()=>{
        if (!token) return; 
        async function SongInfo(){
            console.log("hi")
            const parameters = {
                headers:{
                  'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            try {
              const { data } = await axios.get(`https://api.spotify.com/v1/tracks/${encodeURIComponent(id)}`, parameters);
              setSong(data)
              if (data.artists && data.artists.length > 0) {
                artistfunc(data.artists);
            } 
              console.log(data);
          } catch (error) {
              console.error('Error from Spotify:', error);
          }
          }
        SongInfo()
      },[token])

      if (!song || !song.album || !song.album.images) {
        return <div>Loading...</div>; 
    }
    async function artistfunc(artists) {
      const newArt = [];
  
      for (const art of artists) {
          const parameters = {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          };
  
          try {
              const { data } = await axios.get(`https://api.spotify.com/v1/artists/${encodeURIComponent(art.id)}`, parameters);
              newArt.push(data);
          } catch (error) {
              console.error('Error from Spotify when searching artist:', error);
          }
      }
  
      setArtistsDetails(newArt);
  }
  const playPreview = () => {
    const audio = document.getElementById('song-preview');
    if (audio) {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying); 
    }
}

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
            <Carousel data-bs-theme="dark" fade >
            <Carousel.Item>
              <Container className="mt-4">
                <Card className="mb-3 ">
                  <Row>
                    <Col md={4}>
                      {song.album && song.album.images && song.album.images[0] && (
                        <Card.Img
                          src={song.album.images[0].url}
                          alt={`${song.name}`}
                          className="img-fluid"
                          style={{ minHeight: '300px', objectFit: 'cover' }}
                        />
                      )}
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title className="display-4">{song.name}</Card.Title>
                        <Card.Text className="lead">
                          <strong>Artists:</strong> {song.artists && song.artists.map(artist => artist.name).join(', ')}
                        </Card.Text>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '21px', marginBottom: '20px' }}>
                        
                                 <Button
                                    variant="success"
                                    onClick={() => handleLikeSong(song)}
                                    disabled={likedSongs.includes(song.id) && !dislikedSongs.includes(song.id)}
                                >
                                    <i className="bi bi-heart-fill"></i> Like
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDislikeSong(song)}
                                    disabled={dislikedSongs.includes(song.id) && !likedSongs.includes(song.id)}
                                >
                                    <i className="bi bi-x-lg"></i> Dislike
                                </Button>



                                  </div>
                        {song.album && (
                          <Card.Text>
                            <strong>ID: </strong><em>{song.id}</em>
                            <br /> 
                            <strong>Album:</strong> {song.album.name} <em>({song.album.album_type})</em>
                            <br />
                            <strong>Release Date:</strong> {song.album.release_date} <em>({song.album.release_date_precision})</em>
                            <br />
                            <strong>Track Number:</strong> {song.track_number} of {song.album.total_tracks}
                            <br />
                            <strong>Popularity Score:</strong><em>{song.popularity}</em>
                            <br />
                            <strong>Duration:</strong> {new Date(song.duration_ms).toISOString().slice(11, 19)} (mm:ss)
                            <br />
                            <strong>Available in Markets:</strong> {song.available_markets && song.available_markets.join(', ')}
                          </Card.Text>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '21px', marginBottom: '20px' }}> 
                        {song.preview_url &&
                        <div>
                        <audio id="song-preview" src={song.preview_url} preload="none"></audio>
                        <Button variant="success" onClick={playPreview}>
                            <i className={`bi ${isPlaying ? 'bi-stop-fill' : 'bi-play-fill'}`}></i>
                            {isPlaying ? ' Stop' : ' Play Preview'}
                        </Button>
                        </div>}
                        
                        <Button variant="primary" href={song.external_urls.spotify} target="_blank">Listen on Spotify</Button>
                        </div>
                        <br/>
                        <Card.Text>Switch slides to see Artist/Artists Info!!!</Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Container>

            </Carousel.Item>
            {/* Carousel items for each artist */}
            
            {artistsDetails&&artistsDetails.map((artist, index) => (
    <Carousel.Item key={index}>
        <Container className="mt-4">
            <Card className="mb-3 ">
                <Row>
                    <Col md={4}>
                        {artist.images && artist.images[0] && (
                            <Card.Img
                                variant="top"
                                src={artist.images[0].url}
                                alt={artist.name}
                                style={{ minHeight: '200px', objectFit: 'cover' }}
                            />
                        )}
                    </Col>
                    <Col md={8}>
                        <Card.Body >
                            <Card.Title>{artist.name}</Card.Title>
                            <Card.Text>
                                <strong>Genres:</strong> {artist.genres && artist.genres.join(', ')}
                                <br />
                                <strong>Followers:</strong> {artist.followers && artist.followers.total.toLocaleString()}
                                <br />
                                <strong>Popularity:</strong> {artist.popularity}
                            </Card.Text>
                            <Button variant="primary" href={artist.external_urls.spotify} target="_blank">View on Spotify</Button>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    </Carousel.Item>
))}

          </Carousel>
        </div>
      );
      
    
}
export default Song