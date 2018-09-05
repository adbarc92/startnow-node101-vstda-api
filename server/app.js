const express = require('express');
const morgan = require('morgan');
const winston = require('winston');

const app = express();
const bodyParser = require('body-parser');

winston.add(
  winston.transports.File, (
    filename: 'Errors.log',
    level: 'error',
    json: true,
    eol: 'n',
    timestamp: true
  )
)

// Sources:
  // https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
  // https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters

// BONUS:
  // Implement PUT and PATCH
    // https://stackoverflow.com/questions/630453/put-vs-post-in-rest
  // Add endpoints to filter
    // Return only complete
    // Return incomplete
  // Validate and Sanitize Data Before storing it
   // Ensure that data contain html/sql
   // Ensure data is the correct type
  // Handle errors properly
    // http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
    // http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
  // Display time current app has been running when GET made to status endpoint

var mockData = [
  {
    todoItemId: 0,
    name: 'an item',
    priority: 3,
    completed: false
  },
  {
    todoItemId: 1,
    name: 'another item',
    priority: 2,
    completed: false
  },
  {
    todoItemId: 2,
    name: 'a done item',
    priority: 1,
    completed: true
  }
];

// HELPER FUNCTIONS

function findMatch( str ){
  console.log( 'Searching for match' );
  for( let i = 0; i < mockData.length; ++i ){
    if( str == mockData[ i ].todoItemId ){
      console.log( 'Match found' );
      return i;
    }
  }
  console.log( 'No match found' );
  return null;
};

// HELPER END

app.use( morgan( 'dev' ) );
app.use( bodyParser.json() );
app.use(  )

app.get( '/', ( req, res ) => {
  res.status( 200 ).json( 'ok' );
})

app.get( '/:object', ( req, res ) => {
  res.status( 200 ).send( 'Welcome to RESTful API' );
})

app.route( '/api/TodoItems') // Route/Path/
  .get( ( req, res ) => {
    res.json( mockData );
  })
  .post( ( req, res ) => {
    var index = findMatch( req.body.todoItemId );
    if( index !== null ){
      mockData[ index ].name = req.body.name;
      mockData[ index ].priority = req.body.priority;
      mockData[ index ].completed = req.body.completed;
      return res.status( 201 ).json( mockData[ index ] );
    }
    var newItem = {
      todoItemId: req.body.todoItemId,
      name: req.body.name,
      priority: req.body.priority,
      completed: req.body.completed
    };
    mockData.push( newItem );
    return res.json( mockData[ mockData.length - 1 ] );
  })

  app.route( '/api/TodoItems/:number' )
    .delete( ( req, res ) => {
      console.log( 'Number:', req.params.number );
      var index = findMatch( req.params.number ); // req.params
      if( index !== null ){
        console.log( 'index:', index, 'found' );
        var mockArr = mockData.splice( index, 1 );
        console.log( 'Index:', index, 'removed' );
        return res.status( 200 ).json( mockArr[ 0 ] );
      }
      else{
        // Log error to file
        return res.status( 404 ).send( 'Error: data not found' );
      }
    })
    .get( ( req, res ) => {
      var index = findMatch( req.params.number );
      if( index !== null ){
        return res.status( 200 ).json( mockData[ index ] );
      }
      return res.status( 404 ).send( 'Error: data not found' );
    })

module.exports = app;


