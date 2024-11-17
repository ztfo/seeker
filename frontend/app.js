const nodesList = document.getElementById('nodesList');
const addNodeForm = document.getElementById('addNodeForm');

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

fetchNodes();