// Configuration object for the application
const config = {
  // Database configuration
  DB_DATABASE: "project", // Database name
  DB_USERNAME: "root", // Database username
  DB_PASSWORD: "", // Database password
  DB_ADAPTER: "mysql", // Database adapter (e.g., mysql, postgres, etc.)
  DB_NAME: "project", // Alias for database name (repeated for clarity)
  DB_HOSTNAME: "localhost", // Database hostname
  DB_PORT: 3307, // Database port

  // JWT (JSON Web Token) configuration
  DYNAMIC_CONFIG_JWT_EXPIRE_AT: 3600, // JWT expiration time in seconds
  DYNAMIC_CONFIG_JWT_KEY: "sdfsfdsfdsfsdfdsfds", // JWT secret key
  DYNAMIC_CONFIG_JWT_REFRESH_EXPIRE_AT: 7200, // JWT refresh token expiration time in seconds
  
  // Application environment configuration
  STAGE: "development", // Application stage (development, production, etc.)

  // Application server configuration
  PORT: "4000", // Port on which the server will listen
};

// Export the configuration object for external use
module.exports = config;