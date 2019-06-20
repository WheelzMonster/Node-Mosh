// npm init --yes
// npm install express
// npm i nodemon
// npm i joi
const Joi = require('joi') // all require calls should be on top of the file. We write Joi with capital J because it is a class.
const express = require('express');
const app = express();

app.use(express.json());

const coursesArr = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
];

app.get('/', (req, res) => {
    res.send('hello there');
});

app.get('/api/courses', (req, res) =>{
    res.send(coursesArr);
});


//Create a new course object with a POST method---------------------------------------------------------------------

app.post('/api/courses', (req, res) =>{
    const schema = {
        name: Joi.string().min(3).required() // equals !req.body.name || req.body.name.length < 3
    };
    const result = Joi.validate(req.body, schema);
    // console.log(result) it can only return 2 things, either it validates and sends the new object, & error property is null either it sends the error.
    if(result.error){
        //400 = bad request
        res.status(400).send('ERROR 400: name is mandatory and should be longer than 3 caracters');
        return;
    }

    const course = {
        id: coursesArr.length + 1,
        name: req.body.name // here we assume that in the body of the request, the object has a property called name
    }
    coursesArr.push(course);
    res.send(course);
});



//Updating a course with the PUT method----------------------------------------------------------------------------

app.put('/api/courses/:id', (req, res) =>{

    //look up the course, if not existing, return 404
    const singleCourse = coursesArr.find(course => course.id === parseInt(req.params.id)); //check if id element of array matches the param. Since it first compares it to a string, we need to use parseInt to convert it to an integer
        if(!singleCourse){
        res.status('404').send('course with the given id not found! :(');
    }

    //Validate, if invalid, return 400 - Bad request
    const schema = {
        name: Joi.string().min(3).required()
    };
    const result = Joi.validate(req.body, schema);
    if(result.error){
        res.status(400).send('ERROR 400: name is mandatory and should be longer than 3 caracters');
        return;
    }

    //Update course, return the updated course
    singleCourse.name = req.body.name;
    res.send(singleCourse)
})





app.get('/api/courses/:id', (req, res) =>{
    const singleCourse = coursesArr.find(course => course.id === parseInt(req.params.id)); //check if id element of array matches the param. Since it first compares it to a string, we need to use parseInt to convert it to an integer
    if(!singleCourse){
        res.status('404').send('course with the given id not found! :(');
    }
    res.send(singleCourse);
})

//Query params are added in the URL after a ? and they are optionnal parameters (not as important as routes params);
app.get('/api/posts/:year/:month', (req, res) =>{
    res.send(req.query)
    res.send(req.params)
    
})

//setting up an environement variable, if it's defined, it'll take it, otherwise it'll take 3000
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})