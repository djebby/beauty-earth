# Beautiful Earth :earth_africa:

![](./frontend/src/images/beautiful-earth.png)

## Beauty earth is a web application that i developed just for practice purpose with ReactJS in the frontend, NodeJS/ExpressJS in the backend and MongoDB as a database solution for the entire project.


### the whole idea is a web application that let people to share nice natural pictures from around the world. you can just use the application to see the pictures shared by other people or create an account and start uploading also pretty pictures.
## you can navigate to the app with this link :arrow_right: [beautiy-earth](https://beautiy-earth.herokuapp.com/) :globe_with_meridians:

# Technical description :

- ## API Reference .../api
    - users route .../api/users
        - GET .../api/users/:userId => retrive the user info and an array of picture objects for specific user id 
            ```json
            { 
                "userPictures":
                { 
                    "_id": "string", 
                    "name": "string", 
                    "email": "string", 
                    "image_url": "string", 
                    "pictures_ids": [
                            {
                                "_id": "string",
                                "title": "string",
                                "description": "string",
                                "image_url": "string",
                                "address": "string"
                            }, 
                            {...}, 
                            {...},
                            {...}
                    ] 
                } 
            }
            ```
        - POST .../api/users/signup => create and login a new user and the body of the request should be like this
            ```javascript
            const formData = new FormData();
            formData.append("name", "string");
            formData.append("email", "string");
            formData.append("password", "string");
            formData.append("image", "jpg, png or jpeg file");
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}users/signup`,
                {
                    method: "POST",
                    body: formData,
                    headers: {},
                }
            );
            ```
        - POST .../api/users/login => log user in and the body of the request sould look like this 
            ```json 
            { 
                "email": "string", 
                "password": "string"
            }
            ```
    - pictures route .../api/pictures
        - GET .../api/pictures/?picBucketNum=number => retrive object with array of (number * 10) pictures & the total number of pictures 
            ```json
            { 
                "pictures": [ 
                    { 
                        "_id": "string", 
                        "title": "string", 
                        "description": "string", 
                        "image_url": "string",
                        "address": "string",
                        "creator_id": { "_id": "string", "name": "string", "image_url": "string" }
                    }, 
                    {...}, 
                    {...}, 
                    {...} 
                ], 
                "picturesCount": "number"
            }
            ```
        - GET .../api/pictures/:picId => retrive a specific picture with id 
            ```json
            {
                "picture": {
                    "_id": "string", 
                    "title": "string", 
                    "description": "string", 
                    "image_url": "string", 
                    "address": "string", 
                    "creator_id": "string"
                }
            }
            ```
        - POST .../api/pictures/ => post a picture (need authentication)
            ```javascript
            const formData = new FormData();
            formData.append("title", "string");
            formData.append("description", "string");
            formData.append("address", "string");
            formData.append("image", "jpg, png or jpeg file");
            await fetch(
                `${process.env.REACT_APP_BACKEND_URL}pictures/`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: "Bearer token"
                    },
                }
            );
            ```
        - PATCH .../api/pictures/:picId => edit a picture (need authentication and authorization)
            ```javascript
            {
                method: "PATCH",
                body: JSON.stringify({
                    title: "string",
                    description: "string",
                    address: "string"
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer token`
                }
            }
            ```
        - DELETE .../api/pictures/:picId => delete a picture (need authentication and authorization)
            ```javascript
            {
                method: "DELETE",
                body: {},
                headers: { Authorization: "Bearer token" }
            }
            ```
- ## SPA Routes
    - .../ => list of latest uploaded pictures
    - .../:userId/pictures => list of pictures of a specefic user
    - .../pictures/new => upload a new pictures
    - .../pictures/update/:picId => edit a specefic picture
    - .../login => login form
    - .../signup => signup form
- ## Database Models
    - model of users collection
        ```javascript
        {
            name: { type: String, required: true, minlength: 6},
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            image_url: { type: String, required: true },
            pictures_ids: [
                { type: mongoose.Types.ObjectId, required: true, ref: "Picture" },
            ],
        }
        ```
    - model of pictures collection
        ```javascript
        {
            title: { type: String, required: true, minlength: 3 },
            description: { type: String, required: true, minlength: 10 },
            image_url:{ type: String, required: true},
            address: { type: String, required: true },
            creator_id: { type: mongoose.Types.ObjectId, required: true, ref: "User"}
        }
        ```
- ## .env Files
    - ### backend/.env
        ```
        PORT = 4000
        CLOUD_MONGO_URI = your connection string goes here...
        JWT_KEY = jwt secret key goes here...
        ```
    - ### frontend/.env
        ```
        REACT_APP_BACKEND_URL=http://localhost:4000/api/
        REACT_APP_ASSET_URL=http://localhost:4000/
        ```
- ## Setup
    create your .env files then :
    - ### Run up the api backend.
        ```sh
        $ cd backend
        $ npm install
        $ npm start
        ```
    - ### Deploy the react app dev server.
        ```sh
        $ cd frontend
        $ npm install
        $ npm start
        ```