# CS 262 Monopoly Webservice

This is the data service application for my [CS262 repo](https://github.com/sudonotdisturb/CS262) 
and it is deployed here:
          
<https://cs262-service.herokuapp.com/>

It is based on the standard Heroku with Node.js tutorial.

<https://devcenter.heroku.com/articles/getting-started-with-nodejs>  

The database is relational with the schema specified in the `sql/` sub-directory,
 and is hosted on [ElephantSQL](https://www.elephantsql.com/). The database user
and password are stored as Heroku configuration variables rather than in this (public) repo.


## Answers to Homework 3 questions

1. What are the (active) URLs for your data service?
```
/players
/players/[id]
/playergame
/playergame/game=[id]
/playergame/player=[id]
/player_playergame
```

2. Which of these endpoints implement actions that are idempotent? nullipotent?

3. Is the service RESTful? If not, why not? If so, what key features make it RESTful.

4. Is there any evidence in your implementation of an impedance mismatch?

 
