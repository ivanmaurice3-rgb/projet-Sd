import os
import json
from github import Github, Auth

# 1. Lire le token GitHub
token = os.environ.get("GITHUB_TOKEN")

if not token:
    raise RuntimeError(
        "GITHUB_TOKEN n'est pas défini. "
        "Définis ton token dans PowerShell avant de lancer le script."
    )

# 2. Se connecter à GitHub
github = Github(auth=Auth.Token(token))
services = []

try:
    # 3. Identifier le compte connecté
    user = github.get_user()
    print(f"Compte connecté : {user.login}")

    # 4. Récupérer les dépôts accessibles au compte
    repositories = user.get_repos()

    for repo in repositories:
        print(f"\nDépôt trouvé : {repo.full_name}")

        # 5. Récupérer les tags du dépôt
        git_tags = [tag.name for tag in repo.get_tags()]
        print(f"Nombre de tags : {len(git_tags)}")

        # 6. Récupérer la dernière release publiée, si disponible
        try:
            release = repo.get_latest_release()
            current_release = release.tag_name
        except Exception:
            current_release = ""

        # 7. Ajouter le dépôt aux données
        services.append({
            "service_name": repo.name,
            "git_tags": git_tags,
            "current_release": current_release
        })

    # 8. Générer le fichier data.js
    data_js = "const services = " + json.dumps(
        services,
        indent=2,
        ensure_ascii=False
    ) + ";"

    with open("data.js", "w", encoding="utf-8") as file:
        file.write(data_js)

    print(f"\nTerminé : {len(services)} dépôt(s) récupéré(s).")
    print("Le fichier data.js a été généré.")

finally:
    github.close()

