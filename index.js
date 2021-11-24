//const port = 5000;
const app = require('./app');

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running, listening on port ${port}`);
});
