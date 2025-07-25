const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

/// Users

// Code to connect to the LightBnB database
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb',
  port: '5432'
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(
      `SELECT * FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1;
      `,
      [email]
    )
    .then((res) => {
      // Return the user object if found, or null if no rows returned
      return res.rows[0] || null;
    })
    .catch((err) => {
      console.error("query error", err.stack);
      throw err;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(
      `SELECT * FROM users WHERE id = $1 LIMIT 1;`,
      [id]
    )
    .then(res => res.rows[0] || null)
    .catch(err => {
      console.error("query error", err.stack);
      throw err;
    });
}; // Exact setup as getUserWithEmail

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const queryString = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [user.name, user.email, user.password];

  return pool.query(queryString, values)
    .then(result => Promise.resolve(result.rows[0]))
    .catch(err => Promise.reject(err));
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
    SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
  `;

  const values = [guest_id, limit];

  return pool.query(queryString, values)
    .then(res => res.rows)
    .catch(err => {
      console.error("query error", err.stack);
      throw err;
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
  `;

  // Track if WHERE was added
  let whereAdded = false;

  // === WHERE conditions ===
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
    whereAdded = true;
  }

  // If: options.owner_id
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `${whereAdded ? 'AND' : 'WHERE'} owner_id = $${queryParams.length} `;
    whereAdded = true;
  }

  // If: options.minimum_price_per_night
  if (options.minimum_price_per_night) {
    queryParams.push(Number(options.minimum_price_per_night) * 100);
    queryString += `${whereAdded ? 'AND' : 'WHERE'} cost_per_night >= $${queryParams.length} `;
    whereAdded = true;
  }

  // If: options.maximum_price_per_night (BY CENT)
  if (options.maximum_price_per_night) {
    queryParams.push(Number(options.maximum_price_per_night) * 100);
    queryString += `${whereAdded ? 'AND' : 'WHERE'} cost_per_night <= $${queryParams.length} `;
    whereAdded = true;
  }

  // GROUP BY always required
  queryString += `GROUP BY properties.id `;

  // If: options.minimum_rating (HAVING AVG INCLUDE HERE)
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  // FINAL PUSH
  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  // Debug info
  console.log("QUERY:", queryString);
  console.log("PARAMS:", queryParams);

  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => {
      console.error("DB query error:", err);
      throw err;
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const query = `
  INSERT INTO properties (
    owner_id, 
    title, 
    description, 
    thumbnail_photo_url, 
    cover_photo_url, 
    cost_per_night, 
    street, 
    city, 
    province, 
    post_code, 
    country, 
    parking_spaces, 
    number_of_bathrooms, 
    number_of_bedrooms
  ) 
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
  )
  RETURNING *;
`;
const values = [
  property.owner_id, 
  property.title, 
  property.description, 
  property.thumbnail_photo_url, 
  property.cover_photo_url, 
  property.cost_per_night, 
  property.street, 
  property.city, 
  property.province, 
  property.post_code, 
  property.country, 
  property.parking_spaces, 
  property.number_of_bathrooms, 
  property.number_of_bedrooms
];

return pool.query(query, values)
    .then(res => res.rows[0])
    .catch(err => {
      console.error('Error inserting property:', err);
      throw err;
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
  pool
};
