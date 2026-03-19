const OrderStatusBadge = ({ status }) => {
  return <span className={`status-badge status-${status}`}>{status}</span>;
};

export default OrderStatusBadge;
