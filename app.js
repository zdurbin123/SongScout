
import axios from 'axios';
import express, { json, urlencoded } from 'express';
import cors from 'cors';


const app = express();
app.use(json());
app.use(cors())
app.use(urlencoded({extended: true}));
//hey test
app.get('/', async (req, res) => {
  const client_id = "db2ef209d1d74d45b1ae4ea2944d9267"
  const client_secret = "3edeae8d28054c1d9d753f6a5267a067"
  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'grant_type=client_credentials'
  };

  try {
    const response = await axios(authOptions);
    console.log(response.data)
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
