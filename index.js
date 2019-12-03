
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
    try {
        var weekdays = await waiterRoster.shiftDays()


        res.render('waiters', {
            username: req.params.user,
            weekdays
        })
    }
    catch (error) {
        console.log(error);
    }
    app.post('/waiters/:user', async function (req, res, next) {
        try {

            const days = await waiterRoster.shiftDays()
            const selectedDays = req.body.weekday

            for (let x = 0; x < days.length; x++) {
                const day = days[x];

                for (let i = 0; i < selectedDays.length; i++) {
                    const daychoice = selectedDays[i];

                    if (day.weekdays == daychoice) {
                        const dayid = await waiterRoster.getdaybyDays(day.weekdays)
                        const waiterid = await waiterRoster.getwaitersbyName(req.params.user)
                        const waiterrost = {
                            weekday_id: dayid,
                            waiter_id: waiterid
                        }
                        await waiterRoster.selectedWorkdays(waiterrost)
                    }
                }
            }
        }
        catch (error) {
            //console.log(error);
            next(error)
        }
        res.redirect('/')
    })

});

app.post('/', async function (req, res) {
    console.log(req.body, ':)');
    const { user } = req.body

    if (user === 'admin') {
        res.redirect('/shiftdays')
    } else {
        const userName = await waiterRoster.getAllWaiters(req.body.user)
        res.redirect('/waiters/' + user)
    }
})


app.get('/shiftdays', async function (req, res) {
    var weekdays = await waiterRoster.shiftDays()

    res.render('shiftdays', {
        weekdays,
        counter: await waiterRoster.countwaiter()
    })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('start' + PORT);
});
// https://protected-lowlands-00085.herokuapp.com/