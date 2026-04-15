-- 1. Create the Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    federated_id VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE, 
    grade DOUBLE PRECISION
);

-- 2. Create the Roles table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255)
);

-- 3. Create the Users-Roles Join Table
CREATE TABLE users_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_users_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_users_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

-- Index for optimized lookups when querying roles for a user
CREATE INDEX idx_users_roles_user_id ON users_roles(user_id);

-- 4. Create the Courses table
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255),
    section VARCHAR(255)
);

-- 5. Create the Course-Users Join Table
CREATE TABLE course_users (
    course_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (course_id, user_id),
    CONSTRAINT fk_course_users_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
    CONSTRAINT fk_course_users_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Index for optimized lookups when querying users within a course, or courses for a user
CREATE INDEX idx_course_users_user_id ON course_users(user_id);
CREATE INDEX idx_course_users_course_id ON course_users(course_id);