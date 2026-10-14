
from github import Github, Auth
import os
import json

token = os.environ.get("GITHUB_TOKEN")

if not token:
    raise RuntimeError("La variable GITHUB_TOKEN n'est pas définie.")

github = Github(auth=Auth.Token(token))

# Liste des dépôts à récupérer
repository_names = [
    "orga-manager",
    "user-manager",
    "my-moments",
    "media-manager",
]

services = []

try:
    for repository_name in repository_names:
        try:
            repo = github.get_repo(
                f"ivanmaurice3-rgb/{repository_name}"
            )

            git_tags = [tag.name for tag in repo.get_tags()]

            try:
                release = repo.get_latest_release()
                current_release = release.tag_name
            except Exception:
                current_release = git_tags[0] if git_tags else ""

            services.append({
                "service_name": repo.name,
                "git_tags": git_tags,
                "current_release": current_release
            })

            print(f"Service récupéré : {repo.name}")

        except Exception as error:
            print(f"Impossible de récupérer {repository_name} : {error}")

    data_js = "const services = " + json.dumps(
        services,
        indent=4,
        ensure_ascii=False
    ) + ";"

    with open("data.js", "w", encoding="utf-8") as file:
        file.write(data_js)

    print(f"{len(services)} service(s) enregistré(s) dans data.js.")

finally:
    github.close()
