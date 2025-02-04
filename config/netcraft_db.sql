CREATE TABLE IF NOT EXISTS users (
	username VARCHAR(50) PRIMARY KEY,
	email VARCHAR(100) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	role ENUM('user', 'admin') DEFAULT 'user'
);
INSERT INTO users (username, email, password_hash, role) VALUES ('admin', 'root@root.fr', 'af87fbe386dd8941d3d53a4a1f704ad2b34166dda84819af03d4ae8979e09f49:0cb0f08520e56544ab987ec691f0ada3', 'admin');