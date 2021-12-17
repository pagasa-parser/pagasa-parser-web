VERSION=`cat .docker.imageversion | tr -d "[:space:]"`

docker container stop pagasa-parser-web
docker container rm pagasa-parser-web
docker build -t "chlod/pagasa-parser-web:latest" -t "chlod/pagasa-parser-web:`$VERSION`" . && \
 docker run -d --name pagasa-parser-web -p 12464:12464 --restart unless-stopped chlod/pagasa-parser-web:latest
