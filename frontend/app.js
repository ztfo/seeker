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

fetchNodes();
fetchEdges();