# Blog platform
A platform for creating online blogs.
## History
This project was originally written in the summer of 2020 for my personal website. I soon realized the features were too complicated for my personal needs so I abandoned the project. However, I did not want to waste my efforts, so in the summer of 2022, I recovered the old code and finally completed it.
## Features
- Bilingual language switching between English and Chinese
- Create and edit posts using interactive builder
  - Posts include projects and blogs
- Filter posts by tags
- Post list is automatically divided into pages for better readability
- User sign up / login using JSON web tokens
  - Protection against token modification and recreation
  - Due to nature of JWT, log out will log out all devices for security
- Mobile screen size support
## Demonstration video
[Click here](video.webm)
## Software tools
- Server programming: Node.js
- Web framework: Express.js
- Template engine: Pug.js
- Database: MongoDB
- Authentication: JSON web token
## Getting started
1. Start MongoDB
```
$ sudo systemctl start mongod
```
2. Start Node.js server
```
$ pwd
<blog-platform>
$ npm start
```
3. Open browser and locate to http://localhost:3000
