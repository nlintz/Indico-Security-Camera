# Setup
* git clone git@github.com:nlintz/Indico-Security-Camera.git
* cd Indico-Security-Camera
* npm install
* echo 'module.exports={"apiKey":"<your indico api key>"}' > indicoConfig.js
* npm start
* (in a separate terminal) node app


# Other Dependencies
* MongoDB needs to be running for the app to work
* You need to have a trained collection named "security_camera" 


# Learn More
You can learn more about Indico Collection APIs [here](https://indico.io/docs#custom)