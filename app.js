var express    = require("express"),
	app 	   = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/notify", {useNewUrlParser:true,useUnifiedTopology: true});

//SCHEMA SETUP
var noteSchema = new mongoose.Schema({
	subName: String,
	pdflink: String,
	branch: String,
	sem: String
});

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


app.get("/",function(req,res){
	res.render("index");
});

app.get("/sem",function(req,res){
	res.render("semester");
});


//find all notes for cse 7th sem
app.get("/cse7notes",function(req,res){
	Note.find({'branch': 'cse','sem':'7'},function(err,notes){
		if(err){
			console.log(err);
		}
		else{
			res.render("cse-7-notes",{notes:notes});
		}
	});
});

//renders form for uploading new notes
app.get("/newnotes",function(req,res){
	res.render("new");
})

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
			//redirect to notes page
			res.redirect("/");
		}
	})		
});

app.listen(3000,function(){
	console.log("server is reaady!");
});