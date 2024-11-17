CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    type VARCHAR(50) -- workstation, server, router
);

CREATE TABLE edges (
    id SERIAL PRIMARY KEY,
    node_from INT REFERENCES nodes(id),
    node_to INT REFERENCES nodes(id),
    connection_type VARCHAR(50),
    risk_level INT
);