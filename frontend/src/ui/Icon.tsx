import React from "react";

export default function Icon({ icon, size, color } : {
    icon: string;
    size?: string;
    color?: string;
}) {
    return <i className={"bi-" + icon} style={{fontSize: size, color: color}}/>;
}
