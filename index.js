const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 8080;
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: "nikhil@72SQL"
})

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
  ]
}
// insertin new data
let q = "INSERT INTO user (id , username, email, password ) VALUES ?";

let users = [["123bA", "123_newuserbA", 'abc@gmai.combA', 'abcbA'], ["123cB", "123_newusercB", 'abc@gmai.comcB', 'abccB']];

// let data = [];
// for (let i =1;  i<= 100 ; i++){
//     data.push(getRandomUser()) // 100 fake users data;
// }
// try {
//     connection.query(q, [users], (err, result) => {
//         if (err) throw err;
//         console.log(result);
//     })
// } catch {
//     console.log(err);
// }

// connection.end();

// app.get("/", (req, res)=>{
//     let q = 'SELECT COUNT(*) FROM user';
//     try {
//     connection.query(q, (err, result) => {
//         if (err) throw err;
//         console.log(result[0].key);
//         res.send("success");
//     })
// } catch {
//     console.log(err);
//     res.send('SOME ERROR IN DATABASE')
// }
// });
app.get("/", (req, res) => {
    let q = 'SELECT COUNT(*) AS count FROM user';

    connection.query(q, (err, result) => {
        if (err) {
            console.log(err);
            return res.send('SOME ERROR IN DATABASE');
        }

         let count = (result[0].count); // ✅ correct
        res.render("home.ejs", {count})
    });
});

app.get("/user", (req, res)=>{
    let q = `SELECT * FROM user`;
      connection.query(q, (err, result) => {
        if (err) {
            console.log(err);
            return res.send('SOME ERROR IN DATABASE');
        }
           let users = (result); 
        // res.send(result);
        res.render("showusers.ejs" ,{users});
    });
})

// Edit route
app.get("/user/:id/edit",(req, res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id= '${id}'`;
     connection.query(q, (err, result) => {
        if (err) {
            console.log(err);
            return res.send('SOME ERROR IN DATABASE');
        }
       let user = (result[0]);
          res.render("edit.ejs", {user})
    }); 
})
// UPDATE ROUTE;
app.patch("/user/:id", (req, res)=>{
    let {id} = req.params;
    let { password : formPassword, username: newUsername} = req.body;
    let q = `SELECT * FROM user WHERE id= '${id}'`;
     connection.query(q, (err, result) => {
        if (err) {
            console.log(err);
            return res.send('SOME ERROR IN DATABASE');
        }
       let user = (result[0]);
       if(formPassword != user.password){
        res.send("worng password")
       }else{
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`
        connection.query(q2,(err, result)=>{
             if(err){
                console.log(err);
                return res.send("some error in database");
             }
             res.redirect("/user");
        })
       }
    });
});

app.post("/newuser", (req, res)=>{
      res.render("add.ejs");
})

app.post("/user", (req, res)=>{
    let user  =  req.body;
      let id = ( getRandomUser()[0]);
      user.id = id;
       let q = "INSERT INTO user (id , username, email, password ) VALUES (?,?,?,?)";
     connection.query(q,[user.id, user.username, user.email, user.password] ,(err, result) => {
        if (err) {
            console.log(err);
            return res.send('SOME ERROR IN DATABASE');
        }
         console.log(result);
         res.redirect("/");
    });  
})
  app.get("/user/:id/delete", (req, res)=>{
     let {id} = req.params;
      res.render("delete.ejs",{id})
  })

  app.delete("/user/:id", (req, res)=>{
    const { id } = req.params;
    const { email : formemail , password : formpassword } = req.body;
      let q = `SELECT * FROM user WHERE id='${id}'`;
      
      connection.query(q,(err, result)=>{
        if(err){
            console.log(err);
            res.send("Some error in database");
        }
        let user = result[0];
        
         if(formemail != user.email){
            res.send("wrong email");
         }
         if(formpassword != user.password){
            res.send("wrong password");
         }
         const q2 = "DELETE FROM user WHERE email=? AND password=?";
         connection.query(q2, [user.email, user.password], (err, result)=>{
             if(err){
                console.log(err);
                res.send("some error in database");
             }
             console.log("user delete successfully");
             res.redirect("/user");
         })

      })
   
});
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})



