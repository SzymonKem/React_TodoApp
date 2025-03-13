const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

let tasksArray = []

app.use(cors())
app.use(express.json())

app.post('/', (req, res) => {
    tasksArray.push(req.body);
    console.log(tasksArray)
    res.send(console.log("Succcessfully added"))
})

app.delete('/', (req,res) => {
    taskToDelete = tasksArray.indexOf(req.body)
    tasksArray.splice(taskToDelete, 1)
    console.log(tasksArray)
    res.send(console.log("Succesfully deleted"))
})

app.put('/', (req,res) => {
    editedTask = req.body;
    tasksArray.forEach(element => {
        if(element.id == editedTask.id){
            if(element.name !== editedTask.name){
                element.name = editedTask.name
                console.log("name changed")
            }
            if (element.desc !== editedTask.desc) {
                element.desc = editedTask.desc
                console.log("desc changed")
            }
            if (element.isDone !== editedTask.isDone) {
                element.isDone = editedTask.isDone
                console.log("isdone changed")
            }
        }
    });
    console.log(tasksArray)
    res.send(console.log("Successfully edited"))
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    console.log(tasksArray)
})