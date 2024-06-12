const express = require('express');
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");
const { engine } = require("express-handlebars");
const port = 5050;
require("dotenv").config();

const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const viewRoutes = require("./routes/viewRoutes");
const apiRoutes = require("./routes/apiRoutes");

// Setup handlebars engine and views location
const viewsPath = path.join(__dirname, './templates/views');
const partialsPath = path.join(__dirname, './templates/partials');
const layoutsPath = path.join(__dirname, './templates/layouts');

app.engine(
    'hbs',
    engine({
        extname: 'hbs', // sets the extension name to .hbs
        defaultLayout: 'main', // sets the default layout to main.hbs
        layoutsDir: layoutsPath, // path to layouts folder
        partialsDir: partialsPath, // path to partials folder
        helpers: {
            truncate: function (str, numWords) {
                var words = str.split(' ');
                if (words.length > numWords) {
                    words = words.slice(0, numWords);
                    return words.join(' ') + '...';
                }
                return str;
            },
        },
    })
);
app.set('view engine', 'hbs');
app.set('views', viewsPath);

// Static files
const publicDirectoryPath = path.join(__dirname, './public');
app.use(express.static(publicDirectoryPath));

// Mount routes
app.use('/api', apiRoutes); // Includes messageRoutes, healthRoute
app.use(viewRoutes); // Routes for serving HTML pages


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;