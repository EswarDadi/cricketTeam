const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "sqlite3");
app.use(express.json());
let db = null;
const intializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at local host/3000");
    });
  } catch (e) {
    console.log(`db error:${e.message}`);
    process.exit(1);
  }
};
intializeDbAndServer();
// get Movies Api
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
    *
    FROM
    movie
    ORDER BY
    movie_id;

    `;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

// post api
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieQuery = `
  INSERT INTO
  movie(director_id,movie_name,lead_actor)
  VALUES(
      ${directorId},'${movieName}','${leadActor}';
  )

  `;
  const dbResponse = await db.run(addMovieQuery);
  const movieId = dbResponse.lastID;
  response.send("Movie Successfully Added");
});
// get a movie based on movie_id
app.get("/movies/:movieId/", async (request, response) => {
  const movieId = request.params;
  const getMovieQuery = `
    SELECT
    *
    FROM 
        movie 
    WHERE 
        movie_id=${movieId};
    `;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});
//update the movie details based on the movie id
app.put("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
    UPDATE
    movie
    SET
    director_id=${directorId},
    movie_name='${movieName}',
    lead_actor='${leadActor}'
    WHERE
     movie_id=${movieId};
  `;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});
// delete movie based on the id
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovie = `
  DELETE FROM
  movie
    WHERE
   movie_id=${movieId};
  `;
  await db.run(deleteMovie);
  response.send("Movie Removed");
});
// get directors from director table
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
    SELECT
    *
    FROM
    director
    ORDER BY 
    director_id;
    `;
  const directorsArray = db.all(getDirectorsQuery);
  response.send(directorsArray);
});
// get movies directed by a particular director based on director_id
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const movieQuery = `
  SELECT
  *
  FROM
  director  INNER JOIN 
  movie on movie.director_id=director.director_id
  ORDER BY 
  director_id=${directorID};
  `;
  const movieNamesArray = await db.all(movieQuery);
  response.send(movieNamesArray);
});
module.exports = app;
