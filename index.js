
//  include the dependencies
const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');

// initialize Express.js with envoy middleware.
const app = express();
app.use(middleware());

// Define the port the server will run on
//const PORT = 3000;  //for local testing
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// use our app object to define our app's endpoints. Let's start with a route that sends back available options for the "preferred hello" dropdown that we saw in the overview screenshot.
app.post('/hello-options', (req, res) => {
  res.send([
    {
      label: 'Hello',
      value: 'Hello',
    },
    {
      label: 'Hola',
      value: 'Hola',
    },
    {
      label: 'Aloha',
      value: 'Aloha',
    },
  ]);
});
// In the above, we're sending back a JSON array of objects where each object has a label and value. Typically these are not the same, but for our case, we'd like what is displayed on the front-end to also be the value we receive later.  Now do something similar for "goodbye".

app.post('/goodbye-options', (req, res) => {
  res.send([
    {
      label: 'Goodbye',
      value: 'Goodbye',
    },
    {
      label: 'Adios',
      value: 'Adios',
    },
    {
      label: 'Aloha',
      value: 'Aloha',
    },
  ]);
});

//Event Handlers:  Now we can create our "visitor sign-in" endpoint.  The URL of this endpoint can be anything - we'll connect the event with the endpoint URL in the Dev Dashboard menu - but here we're naming the endpoint after the event.
app.post('/visitor-sign-in', async (req, res) => {
  const envoy = req.envoy; // our middleware adds an "envoy" object to req.
  const job = envoy.job;
  const hello = envoy.meta.config.HELLO;
  const visitor = envoy.payload;
  const visitorName = visitor.attributes['full-name'];
  
  const message = `${hello} ${visitorName}!`; // our custom greeting
  await job.attach({ label: 'Hello', value: message }); // show in the Envoy dashboard.
  
  res.send({ hello });
});

//job is our name for the event within the plugin.
//job.attach sends an API call to Envoy's servers and adds that data to the visitor-sign-in event. That's how the visitors page will know what greeting to display to the user.
//Finally, we're sending back a 200 response. The data included in the response is optional - use it if it's useful for debugging.
//Now for the "visitor sign-out" endpoint.
app.post('/visitor-sign-out', async (req, res) => {
  const envoy = req.envoy; // our middleware adds an "envoy" object to req.
  const job = envoy.job;
  const goodbye = envoy.meta.config.GOODBYE;
  const visitor = envoy.payload;
  const visitorName = visitor.attributes['full-name'];

  const message = `${goodbye} ${visitorName}!`;
  await job.attach({ label: 'Goodbye', value: message });
  
  res.send({ goodbye });
});

// use our errorMiddleware and creating a server on a specific port. 
app.use(errorMiddleware());

const listener = app.listen(process.env.PORT || 0, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
