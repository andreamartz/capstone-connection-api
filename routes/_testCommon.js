"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Project = require("../models/project");
const Project_Tag = require("../models/project_Tag");
const Project_Comment = require("../models/project_comment");
const { createToken } = require("../helpers/tokens");

const testJobIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM projects");
  await db.query("DELETE FROM tags");
  await db.query("DELETE FROM project_likes");
  await db.query("DELETE FROM project_comments");
  await db.query("DELETE FROM project_tags");

  await User.register({ 
    username: "u1",
    password: "password1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    bio: "I am User1, a self-taught developer",
    photoUrl: "https://avatars.githubusercontent.com/u/32494494?v=4",
    portfolioUrl: "https://dribbble.com/shots/7158278-Pesonal-Page",
    gitHubUrl: ""



  });
  
  project name: "Weather-Page",
  repoUrl: "https://github.com/MrLogan-dev/Weather-Page",
  siteUrl: "https://github.com/MrLogan-dev/Weather-Page/blob/master/homepage/homepage.html"


  await User.register({ 
    username: "u2",
    password: "password2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    bio: "I am User2, a self-taught developer",
    photoUrl: "https://placemat.imgix.net/placeholder_images/images/000/000/115/original/16273473962_001b1706ab_b.jpg?ixlib=rb-1.0.0&w=300&h=&fm=auto&crop=faces%2Centropy&fit=crop&txt=300%C3%97&txtclr=BFFF&txtalign=middle%2Ccenter&txtfit=max&txtsize=42&txtfont=Avenir+Next+Demi%2CBold&bm=multiply&blend=ACACAC&s=143868ff5cab06b1bd4d6bb175dfdb4e",
    portfolioUrl: "https://reecekenney.com/",
    gitHubUrl: "https://github.com/ReeceKenney"




  });

  await User.register({ 
    username: "u3",
    password: "password3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    bio: "I am User3, a self-taught developer",
    photoUrl: "https://placemat.imgix.net/placeholder_images/images/000/000/082/original/20381744229_263e4ee1f3_k.jpg?ixlib=rb-1.0.0&w=300&h=&fm=auto&crop=faces%2Centropy&fit=crop&txt=300%C3%97&txtclr=BFFF&txtalign=middle%2Ccenter&txtfit=max&txtsize=42&txtfont=Avenir+Next+Demi%2CBold&bm=multiply&blend=ACACAC&s=ab3c6c01ed0a96f9619ab5432a66c774",
    portfolioUrl: "",
    gitHubUrl: 
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken
};