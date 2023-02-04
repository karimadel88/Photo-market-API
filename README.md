# Photo-market-API
photo-app is an API for listing, creating, buy and sell photos

## Installation

Use the package manager npm to install dependencies in package.json 
```bash
npm install
```
## Start
```bash
npm run server
```
## Usage

just use node index.js to run the application using the url http://localhost:2000

## Features
  1- Register new user and specify seller or buyer /user/signup\
  2- signIn and and check if seller or buyer\
  3- if buyer => can buy photo by endpoint /user/buy\
  4- if seller => can create new photo and upload it to content folder by endpoint /product/create\
  5- /user/signin for check from DB if its auth or no
  6- /user/signout to delete cookies 
  7- /user/users to get all user but only if can seller
  8- /product/products to get all products for both of seller and buyer
  9- /user/buy/:productID to specify photo to buy it and must be buyer only

## Tools
  1- Express.js
  2- SqliteDB
  3- mocha for testing
  4- Multer for upload photos
  5- stripe for payment integration
  6- authentication and authorization
