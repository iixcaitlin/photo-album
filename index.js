/*


https://github.com/shubham-shinde/books/blob/master/CSS_SVG/CSS%20Secrets%20-%20Lea%20Verou.pdf

http://xpzhang.me/teach/DS19_Fall/book.pdf


========7/26/2023 Challenge========

	Setup up the main page such that it'll display all the pictures we've uploaded. To achieve this:
 
	1st : query all the "photo" documents from mongoDB and pass them into the 'index.ejs template' 
 				in the main page's get route function.
		 
	2nd : Use Ejs template code to create a bunch of 'image-box's. Where the <img>'s src attribute 
 				contains the path to the actual image file in our 'uploads' folder. Your src path
		 		should look something like this "image-743829748392748932imgname.png" and not "/uploads/image-743829748392748932imgname.png".
		 		This is because express will package the files in 'public' and 'uploads' folder together.

	3rd(IMPORTANT): Send the entire "uploads" folder to the client so that the client will have access to the image files.
 			*you can achieve this the same way we sent the files in the 'public' folder aka use 'app.use(express.static() )'
			you can use the browsers developlment tool and check the 'Sources' section for the existence of image files.
 
 Resources: 

 	Heres a helpful video I;ve found on Ejs

 https://www.youtube.com/watch?v=OaXjIWP3qLQ

 Its pretty comprehensive and covers alot of material from the EJS setup to project deployment. 
 you do NOT need to watch all of it  ( YOU CAN IF YOU WANT), just skip to the parts you need.

 have fun!
 
*/

/*====== imports===== */

const express = require("express")
const app = express()
const multer = require('multer');
const mongoose = require("mongoose")
const fs = require("fs")

/* ========= multer setup ===========  */
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads")
	},
		
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + String(file.originalname.replaceAll(" ", ""))
		cb(null, file.fieldname + "-" + uniqueSuffix)
	}
})
																 
const upload = multer({storage: storage});



/*===============  Mongo Setup  =============== */
const mySecret = process.env['password']

const dbURL = `mongodb+srv://caitlin:${mySecret}@rps-data.cuhw5m5.mongodb.net/?retryWrites=true&w=majority`

main().catch(err => console.warn(err));

async function main(){
	//links to the collection in mongo
	mongoose.connect(dbURL, {dbName : "photo-album" })
}

const photoSchema = new mongoose.Schema( {
	file: {
		type: String,
		max: 1000
	},
	title: {
		type: String,
		max: 30
	},
	description: {
		type: String,
		max: 100
	},
	location: {
		type: String,
		max: 75
	},
	date: {
		type: Date,
		default: Date.now()
	},
	width: {
		type: Number,
		max: 9999
	},
	length: {
		type: Number,
		max: 9999
	}
} )
const photos = new mongoose.model("photos", photoSchema, "photos")


/* ================Middlewares================== */
app.set("view engine", "ejs");

app.use(express.static('public'));//for sending static files
app.use(express.static('uploads'))

app.use(express.json())//only works for unpacking json data from client

app.use(express.urlencoded({ extended: true }));  //for unpacking query parameters from client



/*=============== Routes=============== */
app.get("/", async (req, res) => {
	var allpics = await photos.find({}) // 'async' must be used on the function
	res.render("index", {photos: allpics })
})

app.get("/about", (req, res) => {
	console.log(__dirname)
	res.sendFile(__dirname+"/about.html")
})

app.patch("/update/:id", async (req, res) => {
	console.log(req.body)
	console.log(req.params.id)
	await photos.findOneAndUpdate({_id: req.params.id}, req.body)
	res.end()
})

app.get("/del/:id", (req, res) => {
	console.log("deleting pcture:", req.params.id)
	// res.end() # FOUND THE ERROR, WE ENDED THE RESPONSE 
	// SO EXPRESS WASNT ABLE TO REDIRECT
	let id = req.params.id
	photos.findByIdAndRemove(id).then((result)=>{
		console.log("RESULT:", result)
		if (result.file != ""){
			try{
				fs.unlinkSync("./uploads/"+result.file)
				res.redirect("/")
				
			}catch(error){
				console.log("trying to remove image: ", error)
			}
		}
	}).catch( (err)=>{
		console.log("internal error:",err)
		res.json({"message":"Got an internal error while removing image"})
	})
})

app.post("/uploadpicture", upload.single("image"), async (req, res) => {
	console.log(req.body)

	const Photo = mongoose.model("photo", photoSchema);

	const photos = new Photo({
		file: req.file.filename.replaceAll(" ", ""),
		title: req.body.title,
		description: req.body.description,
		location: req.body.location,
		width: req.body.width,
		length: req.body.length
	});
	await photos.save();
	res.redirect("/")
})



// anonymous function are these guys ---->   (param)=>{ }
//start the server on port 3000 ( port 3000 is for general purpose)

app.listen(3000, ()=>{
	console.log("server start")
})