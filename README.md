
# Library Manager

Library Manager is a dynamic web application aimed at simplifying and enhancing the experience of managing and using libraries. It is built to cater to the needs of both library administrators and users, featuring a range of functionalities like book management, user transactions, and more.

## Demo

A live demo of the application is available [here](https://librarymanager2.netlify.app/).


## Features

- User registration and authentication
- Role-based access control (administrators and regular users)
- Book management (add, edit, delete, view)
- Transaction management (borrow and return books)
- Real-time updates on book availability
- User dashboard for managing borrowed books
- Administrator dashboard for overall library management


## Tech Stack

**Client:** Angular, TailwindCSS

**Server:** Node, Express

**Database:** MongoDB

## Installation

To set up the Library Manager application locally, follow these steps:

### Clone the Repository

```bash
git clone https://github.com/your-github-username/Library-management-application.git

cd Library-management-application
```

#### Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```
To start the frontend server:

```bash
ng serve
```

#### Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```
To start the frontend server:

```bash
npm start
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- `CLIENT_URL_1`: The allowed origin in CORS
- `CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_KEY`: Cloudinary API key
- `CLOUDINARY_SECRET`: Cloudinary API secret
- `DB_URI`: MongoDB URI
- `JWT_SECRET_KEY`: Secret key for JWT
- `PORT`: The port on which the backend server will run

#### Frontend

In the `client/src/environments/environment.ts` file, set the following:

- `API_URL`: The URL of the backend server

For example:

```typescript
export const environment = {
  production: false,
  API_URL: 'http://localhost:3000'
};
```


## Usage

After setting up both the frontend and backend, including the environment variables, the application should be running and accessible. Navigate to the frontend server address (default: http://localhost:4200) on your browser to use the application.



