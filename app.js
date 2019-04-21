const express    = require("express"),
     mongoose    = require("mongoose"),
     bodyParser  = require("body-parser"),
     expressSanitizer =require("express-sanitizer"),
     methodOverride = require("method-override"),
     app         = express();
     
     mongoose.connect("mongodb+srv://Travis:Yellow.333@t-ui7yy.mongodb.net/test?retryWrites=true", {useNewUrlParser: true}); 

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

const PORT = process.env.PORT || 5501;
const HOST = '127.0.0.1';



const blogSchema = new mongoose.Schema({
   
    title: String,
    image: String,
    body:  String,
    
   
    created:  {type: Date, default: Date.now}
});


const Blog = mongoose.model("Blog", blogSchema);



//index

app.get("/", (req,res) =>{
    
   res.redirect("/blogs");
});

//index

app.get("/blogs", (req,res) =>{
    Blog.find({}, (err,blogs) =>{
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs}); 
        }
    });
    
   
});

//new route

app.get("/blogs/new", (req,res) =>{
         res.render("new"); 
});

//create

app.post("/blogs", (req,res) =>{
    req.body.blog.body = req.sanitize(req.body.blog.bod);
    Blog.create(req.body.blog,(err, newBlog) =>{
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//show read

app.get("/blogs/:id", (req,res) =>{
   Blog.findById(req.params.id, (err,found) =>{
       if(err){
           console.log(err);
       }else{
           res.render("show", {blog: found});
       }
   });
    
});

//edit 

app.get("/blogs/:id/edit", (req,res) =>{
    Blog.findById(req.params.id, (err,foundblog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundblog});
        }
    });
             
             

});


//update

app.put("/blogs/:id", (req,res) =>{
    req.body.blog.body = req.sanitize(req.body.blog.bod);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err,blog) =>{
       if(err){
           console.log(err);
       }else{
           var showUrl = "/blogs/" + blog._id;
             res.redirect(showUrl);
       }
   });

});

//DESTROY

app.delete("/blogs/:id", (req,res) =>{
    Blog.findByIdAndRemove(req.params.id, (err) =>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});






app.listen(PORT, HOST, () => console.log(`Listening on ${ PORT }`))

     
     
     
     