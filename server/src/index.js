const app = require('./middleware');
const db = require('./database');
const routes = require('./routes');

app.use(routes);

const port = 3000;
app.listen(port, () => {
    console.log('http://localhost:3000/');
});
