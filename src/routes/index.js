

import ScoutRoutes from './scoute.js';


const constructorMethod = (app) => {
    app.use('/', ScoutRoutes);
  
    app.use('*', (req, res) => {
      res.json({error: 'Route no valid'});
    });
  };

  export default constructorMethod;