-- Create database
CREATE DATABASE tank_db;

-- Connect to tank_db and run the following:

-- Create table for items
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create PostgreSQL function to count items
CREATE OR REPLACE FUNCTION get_items_count()
RETURNS INTEGER AS $$
DECLARE
    item_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO item_count FROM items;
    RETURN item_count;
END;
$$ LANGUAGE plpgsql;

-- Create PostgreSQL function to add item
CREATE OR REPLACE FUNCTION add_item(p_name VARCHAR, p_category VARCHAR DEFAULT 'General')
RETURNS TEXT AS $$
BEGIN
    INSERT INTO items (name, category) VALUES (p_name, p_category);
    RETURN 'Item added successfully';
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Create table for giveaway participants
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    game_username VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    server VARCHAR(50) DEFAULT 'Singapore',
    game_id VARCHAR(100) NOT NULL,
    youtube_username VARCHAR(100) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO items (name, category) VALUES ('Sample Item 1', 'Work');
INSERT INTO items (name, category) VALUES ('Sample Item 2', 'Personal');
INSERT INTO items (name, category) VALUES ('Buy groceries', 'Shopping');
INSERT INTO items (name, category) VALUES ('Finish project', 'Work');