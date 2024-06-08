# Project Name
[CS340] Introduction to Databases - Final Project

## Local Setup

### Prerequisites

1. **Node.js and npm**:
   - Ensure you have Node.js and npm installed.
   - [Download Node.js](https://nodejs.org/)

   You can check if they are installed by running:
   ```sh
   node -v
   npm -v
   ```

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/jacksjud/CS340-Project.git
    cd CS340-Project
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Copy .env_example to .env**:
    ```sh 
    cp .env_example .env
    ```
    - Update the .env file with your database credentials.

4. **Fill database**:
    - Make sure the databse follows the structure found in DDL.sql.
    - or use our DDL.sql as an example.


### Running the Application

1. **Start the server**:
    - Run Npm and start the server
    ```sh
    npm run dev
    ```
    - Or run Forever to start/stop the server
    ```sh
    forever start server.js
    forever stop server.js
    ```


2. **Access the application**:
    - Open your web browser and go to http://localhost:8108 ('localhost' or whatever hostname your machine is configured to use).