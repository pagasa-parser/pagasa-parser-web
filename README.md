# PAGASA Parser Web
PAGASA Parser Web combines all PAGASA Parser formatters together with [@pagasa-parser/source-pdf](https://github.com/pagasa-parser/source-pdf) to automatically scrape the [PAGASA website](http://bagong.pagasa.dost.gov.ph) for bulletins. This means you can run the PAGASA Parser anytime, anywhere, with all bulletins currently available and format them to your heart's content.

You can find a live version of this website at [pagasa.chlod.net](https://pagasa.chlod.net). If you wish to run your own version of PAGASA Parser Web, it is also available as a [Docker image](https://hub.docker.com/r/chlod/pagasa-parser-web) (available at port 12464).

Hosting for pagasa.chlod.net is provided by Chlod Alejandro. If you'd like to help alleviate server costs, please consider sponsoring this project.

## Usage
Running PAGASA Parser standalone requires Java to run the PDF parser in [@pagasa-parser/source-pdf](https://github.com/pagasa-parser/source-pdf) (Tabula). Aside from this, you'll need Node.js. This project has been tested on both Node v14 and v16. You'll need to build both the backend and frontend first before use. The default port for the web server is 12464.

## Docker
The Docker container contains everything needed to run PAGASA Parser and also exposes the web server at port 80. To get started easily, run the following command in your preferred shell.
```sh
docker run -d --name pagasa-parser-web -p 12464:12464 chlod/pagasa-parser-web:latest
```

## Development
Before starting, install all dependencies on both `/frontend` and `/backend`. After installing dependencies, run the `dev` npm script of both repositories to start a development session. Port 12464 will be used for the web server (which will *not* run the web interface if not compiled) and port 12465 will be used for the Webpack Development Server. Since the Webpack Development Server is set up to automatically proxy all non-interface connections to port 12464, you only need to access port 12465 to begin working on both frontend and backend.

Frontend changes are applied immediately (instantaneously for CSS) by Webpack. Changes to the web server will require a restart of the backend `dev` script.

If at any point you wish to delete build artifacts, use the `clean` script.


## License
Unlike other PAGASA Parser libraries and repositories, this repository is licensed under the GNU Affero General Public License v3.0. This means that any changes that are either published or made available over a network must be under the GNU AGPL v3.0 license as well. The rationale for using this license stems from its primary purpose: it is a project which processes Public Domain information for the sake of disaster preparedness and management. Since it is a project made for public benefit, it is only fair that this project is licensed under the AGPL to ensure the mutual benefit of all users.

## Warning
Please avoid misusing the interface in a way that may cause the servers of PAGASA to be under load. Respect the usual web crawling guidelines. You may be rate-limited or blocked entirely from access if you overuse the server resources.
