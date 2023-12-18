import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "123456",
  port: 5432
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisited(){
  const result = await db.query("SELECT * FROM visited_countries");
  
  let countries = [];
  result.rows.forEach((country)=>{
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {
  const countries = await checkVisited();
  res.render("index.ejs", {countries: countries, total: countries.length});
  //db.end();
});

/*app.post("/add", async(req,res)=>{
  const input = req.body["country"];
  const result = await db.query("SELECT * from countries WHERE country_name = $1", [input]);

  if(result.rows.length !==0){
    const data = result.rows[0];
    const countryCode = data.country_code;
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode]);
    res.redirect("/");
  }
});*/

app.post("/add", async(req,res)=>{
  const input = req.body["country"];

  try {
    const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';", [input.toLowerCase()]);
    const data = result.rows[0];
    const countryCode = data.country_code;

    try {
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode]);
      res.redirect("/");
    } catch (errr) {
      console.log(errr);
      const countries = await checkVisited();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }

  } catch (err) {
    console.log(err);
      const countries = await checkVisited();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
