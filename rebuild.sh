docker container stop pagasa-parser-web
docker container rm pagasa-parser-web
docker rmi pagasa-parser-web
docker build -t pagasa-parser-web .
docker run -d --name pagasa-parser-web -p 12464:12464 --restart unless-stopped pagasa-parser-web
