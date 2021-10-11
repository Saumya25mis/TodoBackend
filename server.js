const express= require('express');
const app=express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const Todo= require('./todomodel');
const PORT = 4000;


app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})
app.use('/todos', todoRoutes);


app.listen(PORT,()=>{
    console.log("Server is running on Port: " + PORT);
});

todoRoutes.get('/', (req, res, next) => {
    
    Todo.find({})
          .then(data => res.json(data))
          .catch(next)
          
  });

  
todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

app.use(express.urlencoded({ extended: true }));
var  jsonParser = app.use(express.json());

todoRoutes.post('/add',jsonParser,function(req, res,next) {
    
    if( req.body){
        
        Todo.create(req.body)
          .then(data => res.json(data))
          .catch(next)
      }else {
        res.json({
          error: "The input field is empty"
        })
      }
});
app.use(express.json());
app.use(express.urlencoded({extended: true}));
todoRoutes.route('/delete/:id').delete((req,res)=>{
  var id={_id: req.params.id};
  Todo.deleteOne(id,(err,obj)=>{
    if (err) throw err;
    console.log("1 document deleted");
  })
});


//https://rutwik1801.github.io/tindog/#footer
//https://todoist.com/
//https://trello.com/b/lu2PwJAa/coding-comrades

//https://www.figma.com/file/yShLN3JHHnTT4RwxZijJv0/Untitled?node-id=0%3A1
