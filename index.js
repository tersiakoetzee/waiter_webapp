
const flash = require('express-flash');
const session = require('express-session');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Roster = require('./waiterapp')

const pg = require("pg");
const Pool = pg.Pool;

const app = express();


const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://codex:codex123@localhost/schedule"
});

const waiterRoster = Roster(pool)


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())


app.use(session({
    secret: "error",
    resave: false,
    saveUninitialized: true
}));

app.use(flash(app));

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.get('/', async function (req, res) {
    res.render('index')
});

app.get('/waiters/:user', async function (req, res) {

    res.render('waiters', {
        username: req.params.user
    })

})
app.post('/', async function (req, res) {

    const { user } = req.body
        console.log(user,':)');
        
    if (user === 'admin') {
        res.redirect('/shiftdays')
    } else {
        const result = await waiterRoster.getAllWaiters(req.body.user)
        console.log(result,':)');
        
        res.redirect('/waiters/' + user)

    }
})



app.get('/shiftdays', function (req, res) {

    (req.body.shiftdays)
    // res.render("shifts", { shiftdays })
    res.render('shiftdays');
    console.log('test2');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('start' + PORT);
});
// https://protected-lowlands-00085.herokuapp.com/