const http = require("http");
const qs = require("querystring");
const fs = require("fs");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 2600;

let data = fs.readFileSync("./src/postdatas/posts.json", "utf-8");
let datauser = fs.readFileSync("./src/postdatas/users.json", "utf-8");

app.use(express.text());
app.use(express.json());

app.get("/posts", (req, res) => {
  res.send(data);
});
app.get("/posts/:postId/comments", (req, res) => {
  let datas = JSON.parse(data);
  let info = datas.filter((el) => req.params.postId == el.postId);
  res.send(info);
});
app.get("/comments", (req, res) => {
  let datas = JSON.parse(data);
  let info = datas.filter((el) => req.query.postId == el.postId);
  res.send(info);
});
app.get("/posts/:id", (req, res) => {
  let datas = JSON.parse(datauser);
  let info = datas.find((el) => req.params.id == el.id);
  res.send(info);
});
app.post("/posts", (req, res) => {
  let datas = JSON.parse(data);
  if (
    typeof req.body.postId != "number" ||
    typeof req.body.name != "string" ||
    typeof req.body.email != "string" ||
    req.body.name.length > 30 ||
    typeof req.body.body != "string" ||
    req.body.body.length > 150
  )
    return res.send(
      "Exemple:  {postId: 1, name: 'text'(20), email: 'John@mail.com' body: 'exeption'(150)}"
    );

  let id = datas[datas.length - 1].id + 1;
  let obj = {
    postId: req.body.postId,
    id,
    name: req.body.name,
    email: req.body.email,
    body: req.body.body,
  };
  datas.push(obj);
  fs.writeFileSync(
    "./src/postdatas/posts.json",
    JSON.stringify(datas, null, 4)
  );
  res.send("Post added posts file!");
});

app.put("/posts/:id", (req, res) => {
  let datas = JSON.parse(data);
  let info = datas.find((el) => req.params.id == el.id);
  let array = Object.keys(req.body);
  if (
    (!array.includes("postId") &&
      !array.includes("name") &&
      !array.includes("email") &&
      !array.includes("body")) ||
    array.length > 3
  ) {
    return res.send(
      "Exemple:  {postId: 1, name: 'text'(20), email: 'John@mail.com' body: 'exeption'(150)}"
    );
  }
  if (
    typeof req.body.postId == "number" &&
    typeof req.body.name == "string" &&
    typeof req.body.email == "string" &&
    req.body.name.length < 20 &&
    typeof req.body.body == "string" &&
    req.body.body.length < 150
  )
    console.log(req.body.postId, info.postId);
  console.log(req.body.postId, info.postId);

  (info["postId"] = req.body.postId || info.postId),
    (info["name"] = req.body.name || info.name),
    (info["email"] = req.body.email || info.email),
    (info["body"] = req.body.body || info.body),
    console.log(datas);
  datas.push(info);
  fs.writeFileSync(
    "./src/postdatas/posts.json",
    JSON.stringify(datas, null, 4)
  );
  res.send("Post apdate posts file!");
});

app.delete("/posts/:id", (req, res) => {
  let datas = JSON.parse(data);
  let info = datas.findIndex((el) => req.params.id == el.id);
  datas.splice(info, 1);
  fs.writeFileSync(
    "./src/postdatas/posts.json",
    JSON.stringify(datas, null, 4)
  );
  res.send("Post delete posts file!");
});

app.listen(PORT, () =>
  console.log("Server running ... http://localhost:" + PORT)
);
