import { NavLink } from "react-router-dom";

const links = [
  ["Overview", "/dashboard/admin"],
  ["Categories", "/dashboard/admin/create-category"],
  ["Products", "/dashboard/admin/products"],
  ["Add product", "/dashboard/admin/create-product"],
  ["Orders", "/dashboard/admin/orders"],
  ["Users", "/dashboard/admin/users"],
];

const AdminMenu = () => (
  <aside className="dashboard-menu card-panel">
    <h3>Admin panel</h3>
    <div className="menu-stack">
      {links.map(([label, href]) => (
        <NavLink key={href} to={href} end={href === "/dashboard/admin"}>
          {label}
        </NavLink>
      ))}
    </div>
  </aside>
);

export default AdminMenu;
