import React from "react";
import {Container, Nav, NavItem} from "react-bootstrap";
import "../css/header.css";

function NavLink({ href, label } : { href: string, label: string}) : JSX.Element {
    return <li>
        <a className="nav-link px-2 text-white" href={href}>{label}</a>
    </li>;
}

export default function() : JSX.Element {
    return <header className={"bg-theme p-3"}>
        <Container className={"d-flex align-items-center"}>
            <img className={"logo"} src={"/images/logo.png"} alt={"Logo"} />
            <Nav className={"me-lg-auto ms-2 d-inline-block"}>
                <NavLink href={"/"} label={"Home"} />
            </Nav>
            <span className={"text-white fw-bold"}>PAGASA Parser</span>
        </Container>
    </header>;
}
