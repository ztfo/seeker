const nodesList = document.getElementById('nodesList');
const addNodeForm = document.getElementById('addNodeForm');
const edgesList = document.getElementById('edgesList');
const addEdgeForm = document.getElementById('addEdgeForm');

async function fetchNodes() {
    try {
        const response = await fetch('/api/nodes');
        const nodes = await response.json();
        nodesList.innerHTML = ''; 
        nodes.forEach(node => {
            const li = document.createElement('li');
            li.textContent = `${node.name} (${node.type})`;
            nodesList.appendChild(li);
        });
    } catch (err) {
        console.error('Error fetching nodes:', err);
    }
}

addNodeForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const nodeName = document.getElementById('nodeName').value;
    const nodeType = document.getElementById('nodeType').value;

    try {
        const response = await fetch('/api/nodes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: nodeName, type: nodeType }),
        });

        if (response.ok) {
            document.getElementById('nodeName').value = '';
            document.getElementById('nodeType').value = '';
            fetchNodes();
        } else {
            console.error('Failed to add node');
        }
    } catch (err) {
        console.error('Error adding node:', err);
    }
});

async function fetchEdges() {
    try {
        const response = await fetch('/api/edges');
        const edges = await response.json();
        edgesList.innerHTML = ''; 
        edges.forEach(edge => {
            const li = document.createElement('li');
            li.textContent = `From Node ${edge.node_from} to Node ${edge.node_to} (${edge.connection_type}, Risk: ${edge.risk_level})`;
            edgesList.appendChild(li);
        });
    } catch (err) {
        console.error('Error fetching edges:', err);
    }
}

addEdgeForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const nodeFrom = document.getElementById('nodeFrom').value;
    const nodeTo = document.getElementById('nodeTo').value;
    const connectionType = document.getElementById('connectionType').value;
    const riskLevel = document.getElementById('riskLevel').value;

    try {
        const response = await fetch('/api/edges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                node_from: nodeFrom,
                node_to: nodeTo,
                connection_type: connectionType,
                risk_level: riskLevel,
            }),
        });

        if (response.ok) {
            document.getElementById('addEdgeForm').reset(); 
            fetchEdges(); 
        } else {
            console.error('Failed to add edge');
        }
    } catch (err) {
        console.error('Error adding edge:', err);
    }
});

// start cytoscape
let cy;

function initializeGraph() {
    cy = cytoscape({
        container: document.getElementById('cy'),

        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#0074D9',
                    'label': 'data(label)',
                    'color': '#fff',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': '10px',
                },
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#FF851B',
                    'target-arrow-color': '#FF851B',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                },
            },
        ],

        layout: {
            name: 'breadthfirst',
            directed: true,
        },
    });
}

async function updateGraph() {
    try {
        const [nodesResponse, edgesResponse] = await Promise.all([
            fetch('/api/nodes'),
            fetch('/api/edges'),
        ]);

        const nodes = await nodesResponse.json();
        const edges = await edgesResponse.json();

        const cyNodes = nodes.map(node => ({
            data: { id: `node${node.id}`, label: node.name },
        }));

        const cyEdges = edges.map(edge => ({
            data: {
                id: `edge${edge.id}`,
                source: `node${edge.node_from}`,
                target: `node${edge.node_to}`,
                label: edge.connection_type,
            },
        }));

        cy.elements().remove();
        cy.add([...cyNodes, ...cyEdges]);
        cy.layout({ name: 'breadthfirst' }).run(); 
    } catch (err) {
        console.error('Error updating graph:', err);
    }
}

initializeGraph();
updateGraph();

addNodeForm.addEventListener('submit', updateGraph);
addEdgeForm.addEventListener('submit', updateGraph);

fetchNodes();
fetchEdges();