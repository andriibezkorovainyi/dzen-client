# DZEN-CLIENT

Dzen-client is a front-end part of SPA comments application. It provides a way to send and receive messages of all the
users in real-time.

[DEMO](https://dzen-client.netlify.app/)

## Back-end:
 - [dzen-api](https://github.com/andriibezkorovainyi/dzen-api) - responsible for maintaining WebSocket connection with the client, providing necessary app functionality
 - [dzen-http-server](https://github.com/andriibezkorovainyi/dzen-http-server) - responsible for maintaining HTTP connection with the client

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## Features

- <b>Store data in database</b>: All the comments are stored in database, including user's name, message, date, time of
  sending and user's ip.
- <b>Real-time messages</b>: All the messages are sent and received in real time.
- <b>Replying</b>: You can reply to the comment by clicking on the reply button.
- <b>Files sharing</b>: Pin a file to your message and share it with other users. You can upload .jpg, .jpeg, .png,
  .gif, and
  .txt files.
- <b>Files validation</b>: The maximum image size is 320x240px, if you try to upload larger image - it will be
  automatically
  resized to maximum allowed dimensions and the maximum file size is 100 KB.
- <b>Files preview</b>: You can preview the image before sending it.
- <b>Files download</b>: You can download the image by clicking on it.
- <b>SignUp/LogIn</b>: You can sign up or log in to your account to send messages.
- <b>User data validation</b>: All the user data is validated on the client side and on the server side.
- <b>Comment preview]: You can preview your comment before sending it.
- <b>Sorting</b>: You can sort the comments date, username and user's email.
- <b>Pagination</b>: You can navigate through the comments using pagination.
- <b>Captcha</b>: You can't send a message if you didn't pass the captcha.

## Technologies

- [Vite](https://vitejs.dev/) - a build tool that aims to provide a faster and leaner development experience for modern
  web projects.
- [React](https://reactjs.org/) - a JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/) - a typed superset of JavaScript that compiles to plain JavaScript.
- [Axios](https://axios-http.com/) - a promise-based HTTP client for the browser and node.js.
- [React Router](https://reactrouter.com/) - a collection of navigational components that compose declarative with your
  application.
- [Browser WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) - a communication protocol that allows
  for full-duplex communication between a client and a server.
- [Yet another react light box](https://yet-another-react-lightbox.com/) - a lightbox component for React.
- [React image file resizer](https://www.npmjs.com/package/react-image-file-resizer) - a React component that resizes an
  image file before uploading to server.
- [Lodash](https://lodash.com/) - a JavaScript library that provides utility functions for common programming tasks.
- [React google recaptcha](https://www.npmjs.com/package/react-google-recaptcha) - a React component for Google
  reCAPTCHA v2.

## Installation

To install the project, follow these steps:

1. Clone the repository with git clone
2. Run `npm install` in the root directory
3. The project requires these environment variables to be set:
    - `VITE_HTTP` - the url of the http server part of the application including the port(e.g. `http://localhost:3000`)
    - `VITE_WSS` - the url of the websocket server part of the application(e.g. `ws://localhost:5000`)
    - `VITE_SITE_KEY` - the site key of the captcha. Use your own or request it from the author.
    - `VITE_SECRET_KEY` - the secret key of the captcha. Use your own or request it from the author.
4. Run `npm run dev` in the root directory to start the development server

## Contributing

Contributions are welcome! If you want to contribute to [dzen-client], follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

[MIT](https://choosealicense.com/licenses/mit/)

