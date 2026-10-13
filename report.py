import os
import json
from github import Github, Auth

# Connexion à GitHub
token = os.environ.get("GITHUB_TOKEN")

if not token:
    raise RuntimeError(
        "La variable d'environnement GITHUB_TOKEN n'est pas définie."
    )

auth = Auth.Token(token)
github = Github(auth=auth)

try:
    # Repository à consulter
    repo = github.get_repo("ivanmaurice3-rgb/projet-Sd")

    # Récupération des tags
    tags = repo.get_tags()
    git_tags = [tag.name for tag in tags]

    # Création des données
    data = [
        {
            "service_name": repo.name,
            "git_tags": git_tags,
            "current_release": git_tags[0] if git_tags else ""
        }
    ]

    # Transformation en JavaScript
    data_js = "const services = " + json.dumps(data, indent=4) + ";"

    # Création ou remplacement de data.js
    with open("data.js", "w", encoding="utf-8") as file:
        file.write(data_js)

    print("data.js a été généré avec succès.")

finally:
    github.close()