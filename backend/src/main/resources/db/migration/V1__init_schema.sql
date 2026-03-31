-- 1. Create the Users table
-- Added UNIQUE constraint to email as well, common for user systems.
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    federated_id VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE, 
    display_name VARCHAR(255),
    grade DOUBLE PRECISION NOT NULL DEFAULT 0.0
);

-- 2. Create the Courses table
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255),
    section VARCHAR(255)
);

-- 3. Create the Join Table
-- Better constraint naming helps with debugging later
CREATE TABLE course_users (
    course_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (course_id, user_id),
    CONSTRAINT fk_course_users_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
    CONSTRAINT fk_course_users_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Index for optimized lookups when querying "Find all courses for a user"
CREATE INDEX idx_course_users_user_id ON course_users(user_id);