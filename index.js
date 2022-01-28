const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 8000;

app.use(cors());
app.use(fileUpload());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ltnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connected successfully");
    await client.connect();
    const database = client.db("travel_blog");
    const blogsCollection = database.collection("blogs");
    const userBlogsCollection = database.collection("userblogs");
    const commentsCollection = database.collection("comments");

    //Post Blogs Data
    app.post("/allblogs", async (req, res) => {
      const title = req.body.title;
      const blogsDetails = req.body.blogsDetails;
      const category = req.body.category;
      const time = req.body.time;
      const blogger = req.body.blogger;
      const address = req.body.address;
      const cost = req.body.cost;
      const rating = req.body.rating;
      const imageTitle = req.body.imageTitle;
      const pic = req.files.image;
      const picData = pic.data;
      const encodedPic = picData.toString("base64");
      const imageBuffer = Buffer.from(encodedPic, "base64");
      const blog = {
        title,
        blogsDetails,
        category,
        time,
        blogger,
        address,
        cost,
        rating,
        imageTitle,
        image: imageBuffer,
      };
      const result = await blogsCollection.insertOne(blog);
      res.json(result);
    });

    // //GET Blogs API
    app.get("/allblogs", async (req, res) => {
      const cursor = blogsCollection.find({});
      const allblogs = await cursor.toArray();
      res.send(allblogs);
    });

    //delete blogs data--
    app.delete("/allblogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogsCollection.deleteOne(query);
      res.json(result);
    });

    //Find one----
    app.get("/allblogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogsCollection.findOne(query);
      res.json(result);
    });
    app.get("/category", async (req, res) => {
      const category = req.query.category;
      const query = { category: category };
      const cursor = blogsCollection.find(query);
      const categories = await cursor.toArray();
      res.json(categories);
    });

    /*-------------------------------------- 
               User Blogs Post 
    --------------------------------------*/
    //Post user Blogs Data
    app.post("/userblogs", async (req, res) => {
      const title = req.body.title;
      const userEmail = req.body.userEmail;
      const blogsDetails = req.body.blogsDetails;
      const category = req.body.category;
      const time = req.body.time;
      const blogger = req.body.blogger;
      const address = req.body.address;
      const cost = req.body.cost;
      const checked = req.body.checked;
      const rating = req.body.rating;
      const imageTitle = req.body.imageTitle;
      const pic = req.files.image;
      const picData = pic.data;
      const encodedPic = picData.toString("base64");
      const imageBuffer = Buffer.from(encodedPic, "base64");
      const blog = {
        title,
        userEmail,
        blogsDetails,
        category,
        time,
        blogger,
        address,
        cost,
        checked,
        rating,
        imageTitle,
        image: imageBuffer,
      };
      const result = await userBlogsCollection.insertOne(blog);
      res.json(result);
    });

    // //GET user Blogs API
    app.get("/userblogs", async (req, res) => {
      const cursor = userBlogsCollection.find({});
      const allblogs = await cursor.toArray();
      res.send(allblogs);
    });

    //post comment
    app.post("/comments", async (req, res) => {
      const comments = req.body;
      const result = await commentsCollection.insertOne(comments);
      res.json(result);
    });
    // get comment
    app.get("/comments", async (req, res) => {
      const blogId = req.query.blogId;
      const query = { blogId: blogId };
      const cursor = commentsCollection.find(query);
      const comments = await cursor.toArray();
      res.json(comments);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Travel Blogs database!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
