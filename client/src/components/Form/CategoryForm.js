const CategoryForm = ({ handleSubmit, value, setValue, buttonText = "Save category" }) => {
  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input-control"
        placeholder="Enter category name"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        required
      />
      <button type="submit" className="primary-btn">
        {buttonText}
      </button>
    </form>
  );
};

export default CategoryForm;
