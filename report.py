
from github import Github
import json


# Connexion à GitHub
github = Github()

# Repository à consulter
repo = github.get_repo("livamaurice3-rgb/projet-Sd")

# Récupération des tags
tags = repo.get_tags()

git_tags = []

for tag in tags:
    git_tags.append(tag.name)


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


# Création / remplacement de data.js
with open("data.js", "w", encoding="utf-8") as file:
    file.write(data_js)


print("data.js a été généré avec succès.")