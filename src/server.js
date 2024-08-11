import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isValidURL} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  app.get( "/filteredimage", async (req, res) => {
    let { image_url } = req.query;  // Get the 'image_url' query parameter

    // Check if the image_url query param was provided.
    if ( !image_url ) {
      return res.status(400).json({
        success: false,
        error: "MissingRequiredParameter",
        message: "The 'image_url' query parameter is required."
      });
    }

    // Check if the URL provided in the image_url is valid.
    if ( !isValidURL(image_url) ) {
      return res.status(400).json({
        success: false,
        error: "InvalidData",
        message: "Please provide a valid 'image_url' value."
      });
    }

    try {
      // Filter the image
      console.log(`Try to filter the image from url=${ image_url }`)
      let filteredImagePath = await filterImageFromURL(image_url);
      res.sendFile(filteredImagePath, (err) => {
        if (err) {
            console.error('Error sending file: ', err);
            console.log(`Deleting local file ${filteredImagePath}`);
            deleteLocalFiles([filteredImagePath]);
            return res.status(500).json({
              success: false,
              error: "InternalServerError",
              message: "There was an error while sending the filtered image in the response."
            });
        } else {
            console.log(`Deleting local file ${filteredImagePath}`);
            deleteLocalFiles([filteredImagePath]);
        }
      });
      
    } catch (error) {
      console.error('Server Error: ', error);
      return res.status(500).json({
        success: false,
        error: "InternalServerError",
        message: "There was an error while filtering the image."
      });
    } 
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
