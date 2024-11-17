const pool = require('./db');

const NUM_NODES = 50;
const NUM_EDGES = 100;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateNodes() {
    console.log(`Generating ${NUM_NODES} nodes...`);
    for (let i = 1; i <= NUM_NODES; i++) {
        const name = `Node ${i}`;
        const type = `Type ${getRandomInt(1, 5)}`;
        await pool.query(
            'INSERT INTO nodes (name, type) VALUES ($1, $2)',
            [name, type]
        );
    }
    console.log('Nodes generated.');
}

async function generateEdges() {
    console.log(`Generating ${NUM_EDGES} edges...`);
    for (let i = 1; i <= NUM_EDGES; i++) {
        const nodeFrom = getRandomInt(1, NUM_NODES);
        let nodeTo = getRandomInt(1, NUM_NODES);

        while (nodeTo === nodeFrom) {
            nodeTo = getRandomInt(1, NUM_NODES);
        }

        const connectionType = `Connection ${getRandomInt(1, 3)}`;
        const riskLevel = getRandomInt(1, 5);

        await pool.query(
            'INSERT INTO edges (node_from, node_to, connection_type, risk_level) VALUES ($1, $2, $3, $4)',
            [nodeFrom, nodeTo, connectionType, riskLevel]
        );
    }
    console.log('Edges generated.');
}

async function run() {
    try {
        await generateNodes();
        await generateEdges();
    } catch (err) {
        console.error('Error generating dummy data:', err);
    } finally {
        pool.end();
    }
}

run();