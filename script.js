const tableBody = document.getElementById("services-table");

services.forEach(service => {
    const versions = service.git_tags.filter(tag => tag.startsWith("v"));

    const latestVersion = versions[versions.length - 1];

    const isUpToDate = service.current_release === latestVersion;

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${service.service_name}</td>
        <td>${service.current_release}</td>
        <td>${latestVersion}</td>
        <td>
            ${
                isUpToDate
                    ? '<span class="status up-to-date">À jour</span>'
                    : '<span class="status to-update">À déployer</span>'
            }
        </td>
    `;

    tableBody.appendChild(row);
});