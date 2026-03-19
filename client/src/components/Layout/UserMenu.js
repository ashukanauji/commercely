import { NavLink } from "react-router-dom";

const links = [
  ["Overview", "/dashboard/user"],
  ["Profile", "/dashboard/user/profile"],
  ["Orders", "/dashboard/user/orders"],
];

const UserMenu = () => (
  <aside className="dashboard-menu card-panel">
    <h3>My account</h3>
    <div className="menu-stack">
      {links.map(([label, href]) => (
        <NavLink key={href} to={href} end={href === "/dashboard/user"}>
          {label}
        </NavLink>
      ))}
    </div>
  </aside>
);

export default UserMenu;
