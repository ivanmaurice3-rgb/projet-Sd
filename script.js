const tableBody = document.getElementById("services-table");

const servicesView = document.getElementById("services-view");
const detailView = document.getElementById("detail-view");

const serviceDetail = document.getElementById("service-detail");
const backButton = document.getElementById("back-button");

const counters = document.querySelectorAll(".counter");


// Récupère les versions qui commencent par "v"
function getVersions(service) {
    return service.git_tags.filter(tag => tag.startsWith("v"));
}


// Compare deux versions
function compareVersions(a, b) {
    const versionA = a.match(/^v(\d+)\.(\d+)\.(\d+)/);
    const versionB = b.match(/^v(\d+)\.(\d+)\.(\d+)/);

    if (!versionA || !versionB) {
        return 0;
    }

    for (let i = 1; i <= 3; i++) {
        const numberA = Number(versionA[i]);
        const numberB = Number(versionB[i]);

        if (numberA !== numberB) {
            return numberA - numberB;
        }
    }

    return 0;
}


// Récupère la dernière version disponible
function getLatestVersion(service) {
    const versions = getVersions(service);

    versions.sort(compareVersions);

    return versions[versions.length - 1];
}


// Vérifie si le service doit être déployé
function needsDeployment(service) {
    return service.current_release !== getLatestVersion(service);
}


// Trie les services
function sortServices(serviceList) {
    return [...serviceList].sort((a, b) => {

        const aNeedsDeployment = needsDeployment(a);
        const bNeedsDeployment = needsDeployment(b);

        if (aNeedsDeployment && !bNeedsDeployment) {
            return -1;
        }

        if (!aNeedsDeployment && bNeedsDeployment) {
            return 1;
        }

        return a.service_name.localeCompare(b.service_name);
    });
}


// Affiche les compteurs
function updateCounters() {

    const total = services.length;

    const deployCount = services.filter(service =>
        needsDeployment(service)
    ).length;

    const upToDateCount = total - deployCount;

    document.getElementById("count-all").textContent = total;
    document.getElementById("count-deploy").textContent = deployCount;
    document.getElementById("count-up-to-date").textContent = upToDateCount;
}


// Affiche le tableau
function displayServices(filter = "all") {

    let filteredServices = services;

    if (filter === "deploy") {
        filteredServices = services.filter(service =>
            needsDeployment(service)
        );
    }

    if (filter === "up-to-date") {
        filteredServices = services.filter(service =>
            !needsDeployment(service)
        );
    }

    filteredServices = sortServices(filteredServices);

    tableBody.innerHTML = "";

    filteredServices.forEach(service => {

        const latestVersion = getLatestVersion(service);
        const deploymentNeeded = needsDeployment(service);

        const row = document.createElement("tr");

        row.classList.add("service-row");

        row.innerHTML = `
            <td>${service.service_name}</td>

            <td>${service.current_release}</td>

            <td>${latestVersion}</td>

            <td>
                ${
                    deploymentNeeded
                        ? '<span class="status to-update">À déployer</span>'
                        : '<span class="status up-to-date">À jour</span>'
                }
            </td>
        `;

        row.addEventListener("click", () => {
            displayServiceDetail(service);
        });

        tableBody.appendChild(row);
    });
}


// Affiche la vue détaillée d'un service
function displayServiceDetail(service) {

    const versions = getVersions(service);
    const latestVersion = getLatestVersion(service);
    const deploymentNeeded = needsDeployment(service);

    servicesView.classList.add("hidden");
    detailView.classList.remove("hidden");

    serviceDetail.innerHTML = `
        <div class="detail-card">

            <h2>${service.service_name}</h2>

            <p>
                <strong>Version en production :</strong>
                ${service.current_release}
            </p>

            <p>
                <strong>Dernière version disponible :</strong>
                ${latestVersion}
            </p>

            <p>
                <strong>Statut :</strong>
                ${
                    deploymentNeeded
                        ? '<span class="status to-update">À déployer</span>'
                        : '<span class="status up-to-date">À jour</span>'
                }
            </p>

            <h3>Versions disponibles</h3>

            <ul class="version-list">

                ${versions.map(version => `
                    <li class="${version === service.current_release ? "current-version" : ""}">
                        ${version}
                        ${
                            version === service.current_release
                                ? " — Production"
                                : ""
                        }
                    </li>
                `).join("")}

            </ul>

        </div>
    `;
}


// Retour au tableau
backButton.addEventListener("click", () => {

    detailView.classList.add("hidden");
    servicesView.classList.remove("hidden");

});


// Gestion des compteurs
counters.forEach(counter => {

    counter.addEventListener("click", () => {

        counters.forEach(item => {
            item.classList.remove("active");
        });

        counter.classList.add("active");

        const filter = counter.dataset.filter;

        displayServices(filter);
    });

});


// Initialisation
updateCounters();
displayServices();