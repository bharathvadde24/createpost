// Import the better-sqlite3 library for SQLite database operations
import sql from 'better-sqlite3';

// Create a new database connection to 'posts.db' file
// If the file doesn't exist, it will be created automatically
const db = new sql('posts.db');

// Function to initialize the database with required tables and sample data
function initDb() {
  // Create 'users' table if it doesn't exist
  // Stores user information with id as primary key
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, 
      first_name TEXT, 
      last_name TEXT,
      email TEXT
    )`);

  // Create 'posts' table if it doesn't exist
  // Stores blog posts with id as primary key and user_id as foreign key
  // The ON DELETE CASCADE means if a user is deleted, their posts will be automatically deleted
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY, 
      image_url TEXT NOT NULL,
      title TEXT NOT NULL, 
      content TEXT NOT NULL, 
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER, 
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

  // Create 'likes' table if it doesn't exist
  // This is a junction table for the many-to-many relationship between users and posts
  // Composite primary key of user_id and post_id prevents duplicate likes
  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER, 
      post_id INTEGER, 
      PRIMARY KEY(user_id, post_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
      FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
    )`);

  // Check if there are any users in the database
  const stmt = db.prepare('SELECT COUNT(*) AS count FROM users');
  const userCount = stmt.get().count;

  // If no users exist, insert two sample users
  if (userCount === 0) {
    db.exec(`
      INSERT INTO users (first_name, last_name, email)
      VALUES ('John', 'Doe', 'john@example.com')
    `);

    db.exec(`
      INSERT INTO users (first_name, last_name, email)
      VALUES ('Max', 'Schwarz', 'max@example.com')
    `);
  }
}

// Call the initialization function to set up the database
initDb();

/**
 * Retrieves posts from the database
 * @param {number} maxNumber - Optional limit for number of posts to return
 * @returns {Promise<Array>} Array of post objects with like information
 */
export async function getPosts(maxNumber) {
  // Initialize limit clause as empty string
  let limitClause = '';

  // If maxNumber is provided, add LIMIT clause to the query
  if (maxNumber) {
    limitClause = 'LIMIT ?';
  }

  // Prepare SQL statement to fetch posts with additional information:
  // - Joins with users table to get author names
  // - Left joins with likes to count likes per post
  // - Includes a field to check if user_id 2 has liked each post
  const stmt = db.prepare(`
    SELECT 
      posts.id, 
      image_url AS image, 
      title, 
      content, 
      created_at AS createdAt, 
      first_name AS userFirstName, 
      last_name AS userLastName, 
      COUNT(likes.post_id) AS likes, 
      EXISTS(SELECT * FROM likes WHERE likes.post_id = posts.id and likes.user_id = 2) AS isLiked
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id
    ORDER BY createdAt DESC
    ${limitClause}`);

  // Simulate network delay with 1 second timeout (for demo purposes)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Execute the query with maxNumber parameter if provided, or without parameters
  return maxNumber ? stmt.all(maxNumber) : stmt.all();
}

/**
 * Stores a new post in the database
 * @param {Object} post - Post object containing imageUrl, title, content, and userId
 * @returns {Promise} Result of the database operation
 */
export async function storePost(post) {
  // Prepare SQL statement to insert new post
  const stmt = db.prepare(`
    INSERT INTO posts (image_url, title, content, user_id)
    VALUES (?, ?, ?, ?)`);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Execute the insert with post data
  return stmt.run(post.imageUrl, post.title, post.content, post.userId);
}


/**
 * Toggles like status for a post by a user
 * @param {number} postId - ID of the post to like/unlike
 * @param {number} userId - ID of the user performing the action
 * @returns {Promise} Result of the database operation
 */
export async function updatePostLikeStatus(postId, userId) {
  // Check if the user has already liked the post
  const stmt = db.prepare(`
    SELECT COUNT(*) AS count
    FROM likes
    WHERE user_id = ? AND post_id = ?`);

  const isLiked = stmt.get(userId, postId).count === 0;

  // If not liked, insert a new like
  if (isLiked) {
    const stmt = db.prepare(`
      INSERT INTO likes (user_id, post_id)
      VALUES (?, ?)`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return stmt.run(userId, postId);
  }
  // If already liked, remove the like
  else {
    const stmt = db.prepare(`
      DELETE FROM likes
      WHERE user_id = ? AND post_id = ?`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return stmt.run(userId, postId);
  }
}




























// import sql from 'better-sqlite3';

// const db = new sql('posts.db');

// function initDb() {
//   db.exec(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY, 
//       first_name TEXT, 
//       last_name TEXT,
//       email TEXT
//     )`);
//   db.exec(`
//     CREATE TABLE IF NOT EXISTS posts (
//       id INTEGER PRIMARY KEY, 
//       image_url TEXT NOT NULL,
//       title TEXT NOT NULL, 
//       content TEXT NOT NULL, 
//       created_at TEXT DEFAULT CURRENT_TIMESTAMP,
//       user_id INTEGER, 
//       FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
//     )`);
//   db.exec(`
//     CREATE TABLE IF NOT EXISTS likes (
//       user_id INTEGER, 
//       post_id INTEGER, 
//       PRIMARY KEY(user_id, post_id),
//       FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
//       FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
//     )`);

//   // Creating two dummy users if they don't exist already
//   const stmt = db.prepare('SELECT COUNT(*) AS count FROM users');

//   if (stmt.get().count === 0) {
//     db.exec(`
//     INSERT INTO users (first_name, last_name, email)
//     VALUES ('John', 'Doe', 'john@example.com')
//   `);

//     db.exec(`
//     INSERT INTO users (first_name, last_name, email)
//     VALUES ('Max', 'Schwarz', 'max@example.com')
//   `);
//   }
// }

// initDb();

// export async function getPosts(maxNumber) {
//   let limitClause = '';

//   if (maxNumber) {
//     limitClause = 'LIMIT ?';
//   }

//   const stmt = db.prepare(`
//     SELECT posts.id, image_url AS image, title, content, created_at AS createdAt, first_name AS userFirstName, last_name AS userLastName, COUNT(likes.post_id) AS likes, EXISTS(SELECT * FROM likes WHERE likes.post_id = posts.id and likes.user_id = 2) AS isLiked
//     FROM posts
//     INNER JOIN users ON posts.user_id = users.id
//     LEFT JOIN likes ON posts.id = likes.post_id
//     GROUP BY posts.id
//     ORDER BY createdAt DESC
//     ${limitClause}`);

//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return maxNumber ? stmt.all(maxNumber) : stmt.all();
// }

// export async function storePost(post) {
//   const stmt = db.prepare(`
//     INSERT INTO posts (image_url, title, content, user_id)
//     VALUES (?, ?, ?, ?)`);
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return stmt.run(post.imageUrl, post.title, post.content, post.userId);
// }

// export async function updatePostLikeStatus(postId, userId) {
//   const stmt = db.prepare(`
//     SELECT COUNT(*) AS count
//     FROM likes
//     WHERE user_id = ? AND post_id = ?`);

//   const isLiked = stmt.get(userId, postId).count === 0;

//   if (isLiked) {
//     const stmt = db.prepare(`
//       INSERT INTO likes (user_id, post_id)
//       VALUES (?, ?)`);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return stmt.run(userId, postId);
//   } else {
//     const stmt = db.prepare(`
//       DELETE FROM likes
//       WHERE user_id = ? AND post_id = ?`);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return stmt.run(userId, postId);
//   }
// }
