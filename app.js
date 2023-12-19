
import axios from 'axios';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { convert } from 'imagemagick'; 
import multer from 'multer'; 
import path from 'path'; 
import fs from 'fs'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import redis from 'redis'; // Import the Redis client
import { initializeApp } from "firebase/app";
import FirebaseConfig from './src/firebase/FirebaseConfig.js';
import { getStorage,ref, uploadString,getDownloadURL } from 'firebase/storage';

const firebaseApp = initializeApp(FirebaseConfig);
const Storage = getStorage(firebaseApp);

const client = redis.createClient();
client.connect().then(() => {});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(json());
app.use(cors())
app.use(urlencoded({extended: true}));
//hey test
app.get('/', async (req, res) => {
  // const client_id = "447d1396abd344af93d97b6d31c44737"
  // const client_secret = "fdb8073e596a4f5fabad20f501e8c453"
  const client_id = "db2ef209d1d74d45b1ae4ea2944d9267"
  const client_secret ="3edeae8d28054c1d9d753f6a5267a067"
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
    console.log("hi")
    const response = await axios(authOptions);
    console.log(response.data)
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});


const storageRef = ref(Storage, 'images');
console.log(storageRef);

app.post('/api/generateImage', async (req, res) => {
  const { name, uid, backgroundColor, fontColor } = req.body;
  const fontSize = 400;
  let xc = 'xc:' + backgroundColor.toString();

  const textImageBuffer = await new Promise((resolve, reject) => {
    convert([
      '-size', '400x400',
      xc.toString(),
      '-fill', fontColor.toString(),
      '-gravity', 'center',
      '-pointsize', fontSize.toString(),
      `-draw`, `text 0,0 "${name}"`,
      'jpg:-' // Output as a buffer
    ], (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(Buffer.from(stdout, 'binary'));
      }
    });
  });

  const textImageRef = ref(storageRef, `${uid}.jpg`);

  await uploadString(textImageRef, textImageBuffer.toString('base64'), 'base64', { contentType: 'image/jpeg' });

  const imageUrl = await getDownloadURL(textImageRef);

  res.status(200).json({ success: true, imageUrl });
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/uploadBanner', upload.single('image'), async (req, res) => {
  try {
    const uploadedFile = req.file;

    const uid = req.body.uid || req.query.uid || 'default';
    const bannerImageRef = ref(storageRef, `${uid}_banner.jpg`);

    await uploadString(bannerImageRef, uploadedFile.buffer.toString('base64'), 'base64', { contentType: 'image/jpeg' });

    const imageUrl = await getDownloadURL(bannerImageRef);
    console.log(imageUrl);

    res.status(200).json({ success: true, message: 'File uploaded successfully!', imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: 'File upload failed.' });
  }
});

app.post('/api/setCachedProfile/:uid', async(req, res) => {
  try {
    const { uid } = req.params;
    const userProfile = req.body;
    console.log('Received request for user profile with UID:', uid);
    await client.setEx(`userProfile:${uid}`, 3600, JSON.stringify(userProfile));
    res.status(200).json('update success');
  } catch (error) {
    console.error('Error in /api/getCachedProfile/:uid:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/getCachedProfile/:uid', async (req, res) => {
  const { uid } = req.params;
  const cachedProfile = await client.get(`userProfile:${uid}`);
  if (cachedProfile) {
    res.status(200).json(JSON.parse(cachedProfile));
  } else {
    res.status(200).json('');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});