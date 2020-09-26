const express = require('express')
const firebase = require('./connections/firebase_admin')
const cors = require('cors')
let port = process.env.PORT || 8000

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())
/* 
req.body 
Contains key-value pairs of data submitted in the request body. 
By default, it is undefined, and is populated when you use body-parsing middleware such as express.json() or express.urlencoded().
*/

app.get('/', (req, res) => {
    res.send('Hi')
})

app.post('/', (req, res) => {
    const {email, name} = req.body

    /*
    There is no method of createUserWithEmailAndPassword() in the node admin SDK.
    You can see a list of all the methods on admin.auth() in the API docs (https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#createuser).
    createUserWithEmailAndPassword only exists in the client SDK.
    */
    firebase.auth().createUser({
        email: email,
        emailVerified: false,
        displayName: name,
        disabled: false
    })
    .then(userRecord => {
        // See the UserRecord reference doc for the contents of userRecord.
        res.send({
            success: true,
            message: userRecord.displayName
        })
        console.log('Successfully created new user:', userRecord.displayName)
    })
    .catch(error => {
        const {code, message} = error.errorInfo
        res.send({
            success: false,
            message: message
        })
        console.log('Failed to create a new user:', message)
    })
})

app.listen(port, () => {
    console.log(`Teating app listening at http://localhost:${port}`)
})
