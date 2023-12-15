import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Row, Container,Col } from 'react-bootstrap';
import { likeSong, dislikeSong,getLikedSongsSortedByLikes } from '../../data/music';
import { LikesContext } from '../context/LikesContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
/*Promise.all Works
Takes an Iterable of Promises: Promise.all accepts an iterable (like an array) of promises.

Returns a Single Promise: It returns a single Promise that resolves when all of the input promises have resolved, or rejects as soon as one of the promises in the array rejects.

Resolves to an Array: If all the input promises resolve, Promise.all resolves to an array containing the results of each promise, in the same order as the promises passed in.

Error Handling: If any promise within the array rejects, Promise.all immediately rejects with the reason of the first promise that rejects. This rejection is "fast": it doesn't wait for the other promises to complete.*/
function Trending() {
    const [token, setToken] = useState('');
    const [trendingSongs, setTrendingSongs] = useState([]);
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

  useEffect(() => {
    async function fetchTrendingSongs() {
        try {
            const topSongs = await getLikedSongsSortedByLikes();
            console.log(topSongs)
            const songDetails = await Promise.all(
                topSongs.slice(0, 10).map(async (song) => {
                    const response = await axios.get(`https://api.spotify.com/v1/tracks/${encodeURIComponent(song.likedSong.song_id)}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    return response.data;
                })
            );
            setTrendingSongs(songDetails);
        } catch (error) {
            console.error('Error fetching trending songs:', error);
        }
    }

    if (token) {
        fetchTrendingSongs();
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

if (trendingSongs.length === 0) {
  return <div>Loading trending songs...</div>;
}


    return (
    <div>
               <Container >
               <Row  lg={4} className="g-4">
               {trendingSongs.map((song, index) => (
               <Col key={index} xs={12} md={6} lg={4}>
                <Link to={`/Song/${song.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={index} >
                <Card key={index} className="h-100 w-100" style={{ width: '18rem' }}>
                
                  
                      {song.album && song.album.images && song.album.images[0] && (
                        <Card.Img
                          src={song.album.images[0].url}
                          alt={`${song.name}`}
                          className="img-fluid"
                          style={{ minHeight: '300px', objectFit: 'cover' }}
                        />
                      )}
                  
                 
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
                            <strong>Album:</strong> {song.album.name} <em>({song.album.album_type})</em>
                            <br />
                            <strong>Release Date:</strong> {song.album.release_date} <em>({song.album.release_date_precision})</em>
                            <br />
                            <strong>Track Number:</strong> {song.track_number} of {song.album.total_tracks}
                          
                          </Card.Text>
                        )}
                        <Button variant="primary" href={song.external_urls.spotify} target="_blank">Listen on Spotify</Button>
                      
                        <br/>
                       
                      </Card.Body>
                 
                 
                </Card>
                </Link>
                </Col>
                ))}
                 </Row>
              </Container>
       </div>
      );

};

export default Trending;
