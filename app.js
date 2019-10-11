var express    = require("express");
var	app 	   = express();
var	bodyParser = require("body-parser");
var	methodOverride = require("method-override");
var	mongoose   = require("mongoose");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var url = require('url');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));


//mongo setup
mongoose.connect("mongodb+srv://arjun:arjun@cluster0-cua8v.mongodb.net/notify", {useNewUrlParser:true,useUnifiedTopology: true, useFindAndModify: false});
mongoose.set('useFindAndModify', false);

//SCHEMA SETUP
var noteSchema = new mongoose.Schema({
	subName: String,
	pdflink: String,
	branch: String,
	sem: String,
	//uploaded: { type: Date, default:Date.now}
});

//DATA MODEL COLLECTION
var Note = mongoose.model("Note", noteSchema);

// Note.create({
// 	subName: "web technology",
// 	pdflink: "https://drive.google.com/open?id=1rEL6tS263WIEYRgvdm8QQDSSQ4gpFXRy",
// 	branch: "mech",
// 	sem: "6"
// },function(err, note){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log(note);
// 	}
// });


//ROUTES

//index page
app.get("/",function(req,res){
	res.render("index");
});


//Semester page
app.get("/sem",function(req,res){
	res.render("semester");
});



//renders form for uploading new notes
app.get("/notes/new",function(req,res){
	res.render("new");
});



//Display Notes according to the branch and sem
//id refers to the branch
//semid refers to the sem eg. /notes/cse/7

app.get("/notes/:branchid/:semid",function(req,res){
	var branchid = req.params.branchid;
	var semid = req.params.semid;
	//res.send(id);
	//res.send(semid);
	//if(id =="cse" & semid == '7'){
	//res.send("the sem is"+semid);
		Note.find({'branch': branchid,'sem':semid},(err,notes)=>{
			if(err){
				console.log(err);
			}
			else{
				res.render("notes",{notes:notes});
			}
		});
});



//POST ROUTE for new notes
app.post("/",function(req,res){

	//get data from form and add to notes array
	// var subName = req.body.subName;
	// var pdflink = req.body.pdflink;
	// var branch = req.body.branch;
	// var sem = req.body.sem;
	// var newNotes = {subName:subName, pdflink:pdflink, branch:branch, sem:sem}
	//create a new notes and save to DB
	Note.create(req.body.note,function(err,newNotes){
		if(err){
			console.log(err);
		}
		else{
			//redirect to notes page after uploading new notes
			res.redirect("notes/"+req.body.note.branch+"/"+req.body.note.sem);
		}
	})		
});


//DELETE Notes
app.delete("/notes/:branchid/:semid/:_id",(req,res)=>{
	Note.findByIdAndRemove(req.params._id, (err)=>{
		if(err){
			res.redirect("/");
		}
		else{
		res.redirect("/notes/"+req.params.branchid+"/"+req.params.semid);
		//res.send(req.url);
	}
	});
});


//PORT setup
const port = process.env.PORT || 3000;
app.listen(port,function(){
	console.log("server is reaady!");
});
