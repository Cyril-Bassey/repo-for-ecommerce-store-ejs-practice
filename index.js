const express = require('express');
const app =  express();
const ejs = require('ejs');
const port = 3030;
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads')); // Replace 'uploads' with your desired directory path
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename based on the current timestamp and original filename
    }
  });

  const upload = multer({ storage });

app.set('view engine', "ejs");
app.use(express.urlencoded({ extended: true }));


let categoryArray =[];

app.get("/", (req, res)=>{
    res.render("index.ejs", {categoryArray , productArray})
    console.log('category : ', categoryArray)
})

app.get("/admin", (req, res)=>{
    res.render("admin.ejs", {categoryArray})
    console.log("This is the category on the admin page :", categoryArray)
})

app.post("/admin", (req, res)=>{
    const {enteredCategory} = req.body;
    if (!enteredCategory){
        return res.render("index", {categoryArray});
    } else{
        categoryArray.push(enteredCategory);
    }
    console.log("categories :", enteredCategory);
    res.redirect("/admin")
})
  
app.get("/admin-dashboard", (req, res)=>{
    res.render("admin-dashboard.ejs")
    // console.log("This is the category on the admin page :")
})


let productArray = [];

app.get("/upload-products", (req, res)=>{
    res.render("upload-products.ejs", { productArray });
    console.log("This is the category on the admin page :")
  })
app.post("/upload-products", upload.single('pImage'), (req, res) => {
    const { pName, pCategory, pPrice, pDescription } = req.body;
  
    if (!pCategory || !pPrice || !req.file || !pDescription || !pName) {
      errorMessage = "Please populate all the fields";
      return res.render("upload-products.ejs", { productArray});
    }
  
      const updatedProducts = {
        pCategory,
        pPrice,
        pImage: req.file.path,
        pDescription,
        pName,
      };
  
      productArray.push(updatedProducts);
      console.log("Updated Products are :", updatedProducts);

      res.redirect("upload-products");
    });
  



app.listen(3030, ()=> {
    console.log("App is running on port 3030")
})