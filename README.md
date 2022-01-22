# PAGASA Parser Web
PAGASA Parser Web combines all PAGASA Parser formatters together with [@pagasa-parser/source-pdf](https://github.com/pagasa-parser/source-pdf) to automatically scrape the [PAGASA website](http://bagong.pagasa.dost.gov.ph) for bulletins. This means you can run the PAGASA Parser anytime, anywhere, with all bulletins currently available and format them to your heart's content.

You can find a live version of this website at [pagasa.chlod.net](https://pagasa.chlod.net). If you wish to run your own version of PAGASA Parser Web, it is also available as a [Docker image](https://hub.docker.com/r/chlod/pagasa-parser-web) (available at port 12464).

Hosting for pagasa.chlod.net is provided by Chlod Alejandro. If you'd like to help alleviate server costs, please consider sponsoring this project.

## License
Unlike other PAGASA Parser libraries and repositories, this repository is licensed under the GNU Affero General Public License v3.0. This means that any changes that are either published or made available over a network must be under the GNU AGPL v3.0 license as well. The rationale for using this license stems from its primary purpose: it is a project which processes Public Domain information for the sake of disaster preparedness and management. Since it is a project made for public benefit, it is only fair that this project is licensed under the AGPL to ensure the mutual benefit of all users.

## Warning
Please avoid misusing the interface in a way that may cause the servers of PAGASA to be under load. Respect the usual web crawling guidelines. You may be rate-limited or blocked entirely from access if you overuse the server resources.
