window.onload = function() {
    loadTeams();
    document.getElementById('team').onkeyup = addTeam;
    document.getElementById('member').onkeyup = addMember;
}
async function loadTeams() {
    document.getElementsByTagName('ol')[0].style.visibility = 'hidden';
    const list = document.getElementsByTagName('ul')[0];
    delete team;
    Array.from(list.children).slice(1).forEach(item => list.removeChild(item));
    const response = await fetch('/teams');
    if (response.status === 200) {
        const teams = await response.json();
        teams.forEach(team => {
            let item = document.createElement('li');
            let link = document.createElement('a');
            link.innerText = team;
            link.href = 'javascript:void(0)';
            link.onclick = () => loadMembers(item);
            item.appendChild(link);
            list.appendChild(item);
        });
    }
}
async function loadMembers(item) {
    team = item.innerText;
    const list = document.getElementsByTagName('ol')[0];
    list.style.visibility = 'visible';
    Array.from(list.children).slice(1).forEach(item => list.removeChild(item));
    Array.from(item.parentNode.children).forEach(child => child.classList.remove('selected'));
    item.classList.add('selected');
    const response = await fetch(`/teams/${encodeURIComponent(team)}/members`);
    if (response.status === 200) {
        const members = await response.json();
        members.forEach(member => {
            let item = document.createElement('li');
            let link = document.createElement('a');
            link.innerText = member;
            link.href = 'javascript:void(0)';
            link.onclick = () => removeMember(item);
            item.appendChild(link);
            list.appendChild(item);
        });
    }
}
async function addTeam(event) {
    if (event.key === 'Enter' && event.target.value.trim().length > 0) {
        const response = await fetch('/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: event.target.value.trim()
        });
        if (response.status === 201) {
            event.target.value = '';
            loadTeams();
        } else {
            alert('Failed to add team');
        }
    }
}
async function addMember(event) {
    if (team && event.key === 'Enter' && event.target.value.trim().length > 0) {
        const response = await fetch(`/teams/${team}/members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: event.target.value.trim()
        });
        if (response.status === 201) {
            event.target.value = '';
            const item = Array.from(document.getElementsByTagName('ul')[0].children)
                .find(item => item.innerText === team);
            if (item) {
                loadMembers(item);
            }
        }
    }
}
async function removeMember(item) {
    if (team && confirm('Are you sure you want to remove this member?')) {
        let response = await fetch(`/teams/${team}/members/${item.innerText}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            const list = item.parentNode;
            list.removeChild(item);
            if (Array.from(list.children).length === 1 && confirm('This team has no members, do you want to remove it?')) {
                response = await fetch(`/teams/${team}`, {
                    method: 'DELETE'
                });
                if (response.status === 204) {
                    loadTeams();
                }
            }
        }
    }
}