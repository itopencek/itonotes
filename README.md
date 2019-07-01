# itonotes
nodeJS app to take simple notes

## about
This is a simple web app for writing and viewing notes. It's simple and purposely doesn't have too many options. The goal is to write down anything when you don't have paper and pen near you. Besides that you can also copy and send the url to someone else who can view and/or edit it. The url can be simply changed to something easy to remember.

## main features
1. autosaving - every 3 seconds the editor is checked for changes, if there are any, they are saved
2. auto-generating new unique url - when you enter the website you are generated new unique url
3. unique url changer - you can create your unique url to easily remember your notes
4. rich text editor, thanks to [Quill](https://github.com/quilljs/quill)

## what have I used
- NodeJS, express for backend
- javascript, jquery for frontend
- Rich text editor [Quill](https://github.com/quilljs/quill)

## what have I learnt
As this was my first larger NodeJS app I had to learn how to create an app from scratch. This project was focused mainly on backend,
but to be specific
- REST api using express
- asynchronous operations in javascript - callbacks, promises
- working with [Postgre](https://www.postgresql.org/) database
- deploying app to [heroku](https://www.heroku.com/)
- designing app for smaller devices (mobile)
- working with Quill's API

### website [url](http://itonotes.herokuapp.com)

