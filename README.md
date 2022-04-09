# Beautiful Earth :earth_africa:

![](./frontend/src/images/beautiful-earth.png)

## Beauty earth is a web application that i developed just for practice purpose with ReactJS in the frontend, NodeJS/ExpressJS in the backend and MongoDB as a database solution for the entire project.


### the whole idea is a web application that let people to share nice natural pictures from around the world. you can just use the application to see the pictures shared by other people or create an account and start uploading also pretty pictures.
## you can navigate to the app with this link :arrow_right: [beautiy-earth](https://beautiy-earth.herokuapp.com/) :globe_with_meridians:

# Technical description :

- ## API Endpoints .../api
    - users route .../api/users
        - GET .../api/users/:userId => retrive the user info and an array of picture objects for specific user id {userPictures: { _id, name, email, image_url, pictures_ids: [ {_id, title, description, image_url, address}, {...}, {...}, {...} ] }}
        - POST .../api/users/signup => create and login a new user and the body of the request should be like this  { name, email, password: string with 6 char minimum, image: png, jpeg, jpg file }
        - POST .../api/users/login => log user in and the body of the request sould look like this { email, password }
    - pictures route .../api/pictures
        - GET .../api/pictures/?picBucketNum=number => retrive object with array of (number * 10) pictures & the total number of pictures { pictures: [ { _id, title, description, image_url, address, creator_id: {_id, name, image_url} }, {...}, {...}, {...} ], picturesCount: totalNumberOfPictures }
        - GET .../api/pictures/:picId => retrive a specific picture with id { picture: {_id, title, description, image_url, address, creatro_id} }
        - POST .../api/pictures/ => post a picture (need authentification)
        - PATCH .../api/pictures/:picId => edit a picture (need authentification and authorization)
        - DELETE .../api/pictures/:picId => delete a picture (need authentification and authorization)
- ## SPA Routes
    - .../ => list of latest uploaded pictures
    - .../:userId/pictures => list of pictures of a specefic user
    - .../pictures/new => upload a new pictures
    - .../pictures/update/:picId => edit a specefic picture
    - .../login => login form
    - .../signup => signup form