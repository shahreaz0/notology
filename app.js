//==========================================
// Notology v1.0.0
//==========================================
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override");
    


//==========================================
// App Config
//==========================================
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));

//==========================================
// Database
//==========================================
mongoose.connect("mongodb://localhost/notology_db", { useNewUrlParser: true } );

var noteSchema = mongoose.Schema({
   title: String,
   content: String,
   created: {type: Date, default: Date.now} 
});

var Note = mongoose.model("Note", noteSchema);

// Note.create({
//     title: "My second note!!!",
//     content: "take note. take note. take note. take note. take note. take note. take note. take note."
// }, function(err, newNote){
//   if(err) {
//       console.log("error from Note.create() ");
//   } else {
//       console.log("Successfully done!!!");
//       console.log(newNote);
//   }
// });



//==========================================
// Routes
//==========================================

//HOME-----------
app.get("/", function(req, res){
    res.redirect("/notes");
});

app.get("/notes", function(req, res){
    Note.find({}, function(err, notes){
       if(err) {
           console.log("error from /notes  and Note.find()")
       } else {
           res.render("index", {notes:notes});
       }
    });
});

//NEW--------
app.get("/notes/new", function(req, res) {
    res.render("new"); 
});

//CREATE-----
app.post("/notes", function(req, res) {
    Note.create(req.body.note, function(err, note){
        if(err) {
            console.log("error from Note.create()");
        } else {
            //console.log("================\n Created note \n ===============");
            //console.log(note);
            res.redirect("/notes");
        }
    });
});

//SHOW---------
app.get("/notes/:id", function(req, res) {
    Note.findById(req.params.id, function(err, note){
       if(err) {
           console.log("error form Note.findById()");
       } else {
           res.render("show", {note:note});
       }
    });
    
});

//EDIT---------
app.get("/notes/:id/edit", function(req, res) {
    //res.send("edit form page");
    Note.findById(req.params.id, function(err, note){
       if(err) {
           console.log("error from /notes/:id/edit");
       } else {
           res.render("edit", {note:note});
       }
    });
});

//UPDATE--------
app.put("/notes/:id", function(req, res){
   Note.findByIdAndUpdate(req.params.id, req.body.note, function(err, note) {
       if(err) {
           console.log("err from /notes/:id(put request)");
       } else {
           res.redirect("/notes/" + req.params.id);
       }
   }); 
});

//DELETE--------
app.delete("/notes/:id", function(req, res) {
   Note.findByIdAndRemove(req.params.id, function(err){
       if(err) {
           console.log("error from /notes/:id(delete request)");
       } else {
           res.redirect("/notes");
       }
   });
});

//==========================================
// Server
//==========================================

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("=====================");
    console.log("http://localhost:3000");
    console.log("=====================");
});