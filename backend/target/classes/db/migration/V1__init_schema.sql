-- Initial PostgreSQL schema for DHES dashboard

CREATE TABLE users (
    id           BIGSERIAL PRIMARY KEY,
    federated_id VARCHAR(255) NOT NULL UNIQUE,
    username     VARCHAR(255) NOT NULL,
    email        VARCHAR(255),
    display_name VARCHAR(255)
);

CREATE TABLE roles (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE courses (
    id      BIGSERIAL PRIMARY KEY,
    code    VARCHAR(100),
    name    VARCHAR(255) NOT NULL,
    term    VARCHAR(100),
    section VARCHAR(50)
);

CREATE TABLE course_users (
    course_id       BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    enrollment_role VARCHAR(50),
    PRIMARY KEY (course_id, user_id),
    CONSTRAINT fk_course_users_course
        FOREIGN KEY (course_id) REFERENCES courses (id),
    CONSTRAINT fk_course_users_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE game_sessions (
    id                   BIGSERIAL PRIMARY KEY,
    user_id              BIGINT NOT NULL,
    course_id            BIGINT NOT NULL,
    current_checkpoint   SMALLINT NOT NULL,
    current_progress_pct SMALLINT NOT NULL,
    CONSTRAINT uq_game_sessions_user_course UNIQUE (user_id, course_id),
    CONSTRAINT fk_game_sessions_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_game_sessions_course
        FOREIGN KEY (course_id) REFERENCES courses (id)
);

CREATE TABLE grades (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    course_id  BIGINT NOT NULL,
    score      SMALLINT NOT NULL,
    graded_at  TIMESTAMP,
    CONSTRAINT uq_grades_user_course UNIQUE (user_id, course_id),
    CONSTRAINT fk_grades_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_grades_course
        FOREIGN KEY (course_id) REFERENCES courses (id)
);

