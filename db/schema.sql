DROP DATABASE IF EXISTS battlelife_dev;

CREATE DATABASE battlelife_dev;

\c battlelife_dev;

-- Players table remains the same
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    health INTEGER DEFAULT 100,
    finances INTEGER DEFAULT 100,
    relationship INTEGER DEFAULT 100,
    career INTEGER DEFAULT 100,
    home INTEGER DEFAULT 100
);

-- Table for the game grid
CREATE TABLE grids (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    grid JSONB DEFAULT '{}', -- Stores a 10x10 grid structure
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table for ships and their positions
CREATE TABLE ships (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    type VARCHAR(255) NOT NULL, -- Health, Money, etc.
    size INTEGER NOT NULL,
    coordinates JSONB NOT NULL, -- Array of grid points, e.g., [{"x": 1, "y": 1}, {"x": 1, "y": 2}]
    health INTEGER NOT NULL
);