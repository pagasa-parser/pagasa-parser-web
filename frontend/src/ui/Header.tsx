import React from "react";
import Container from "react-bootstrap/Container";
import NavItem from "react-bootstrap/NavItem";
import Nav from "react-bootstrap/Nav";
import "../css/header.css";
import HeaderAbout from "./HeaderAbout";

function NavLink({ href, label }: { href: string, label: string}): JSX.Element {
    return <NavItem>
        <a className="nav-link px-2 text-white" href={href}>{label}</a>
    </NavItem>;
}

export default class Header extends React.Component {

    render(): JSX.Element {
        return <header className={"bg-theme p-3"}>
            <Container className={"d-flex align-items-center"}>
                <img className={"logo"} src={"/images/logo.png"} alt={"Logo"} />
                <Nav className={"me-lg-auto ms-2 d-inline-block"}>
                    <NavLink href={"/"} label={"Home"} />
                    <NavLink href={"https://github.com/pagasa-parser/pagasa-parser-web"} label={"GitHub"} />
                </Nav>
                <HeaderAbout />
            </Container>
        </header>;
    }

}
