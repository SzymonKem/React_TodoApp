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

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    console.log(tasksArray)
})