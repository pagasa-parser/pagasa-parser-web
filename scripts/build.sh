SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")

cd $SCRIPTPATH/..

VERSION=`node -p "require('./package.json').version" | tr -d "[:space:]"`

docker container stop pagasa-parser-web
docker container rm pagasa-parser-web
set -euxo pipefail
docker build -t "chlod/pagasa-parser-web:latest" -t "chlod/pagasa-parser-web:$VERSION" .
docker run -d --name pagasa-parser-web -p 12464:12464 chlod/pagasa-parser-web:latest
