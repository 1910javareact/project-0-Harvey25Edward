import express from 'express'
import bodyparser from 'body-parser'
import { sessionMiddleware } from './middleware/session-middleware'
import { getUserByUsernameAndPassword } from './services/user-services'
import { loggingMiddleware } from './middleware/logging-middleware'
import { userRouter } from './routers/user-router'
import { reimbursementRouter } from './routers/reimbursement-router'

const app = express()
app.use(bodyparser.json())

app.use(sessionMiddleware)

//take login requests
app.post('/login', async (req:any, res) => {
  let {username, password} = req.body
  //if they don't put in a username or password deny their request
  if(!username || !password){
      res.status(400).send('Invalid Credintials')
  }
  //check if the username and password are valid and return a user if they are
  try{
      let user = await getUserByUsernameAndPassword(username, password)
      req.session.user = user        
      res.json(user)
  }catch(e){
      res.status(e.status).send(e.message)
  }
})

app.use(loggingMiddleware);

// redirect to users-router
app.use('/users', userRouter);

// redirect to requests-router
app.use('/reimbursements', reimbursementRouter);
app.listen(7000, ()=>{
  console.log('app has started');   
})

