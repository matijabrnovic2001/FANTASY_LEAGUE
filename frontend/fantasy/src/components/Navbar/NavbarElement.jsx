import {NavLink} from "react-router-dom";

const NavbarElement = ({content, destinationUrl}) => {
    return (
        <NavLink className='navbar-link' to={destinationUrl}>
            {content}
        </NavLink>
    )
}

export default NavbarElement