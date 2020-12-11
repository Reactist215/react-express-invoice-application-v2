import React, { useState, useMemo } from "react";

const IndividualProductList = ({
  attachToInvoiceList,
  individualPs,
  setIsOpenNewProduct,
}) => {
  const [sProduct, setSProduct] = useState(null);
  const [query, setQuery] = useState("");
  const filterFunction = (e) => setQuery(e.target.value);

  const filteredProducts = useMemo(() => {
    return individualPs.filter((product) => {
      const { name } = product;
      const q = query.toLowerCase();
      return name.toLowerCase().includes(q);
    });
  }, [individualPs, query]);
  const getSProduct = () => {
    if (sProduct && sProduct.name) return sProduct.name;
    return "Select Product or Add ";
  };
  const handleAttachToInvoiceList = () => {
    if (sProduct) {
      attachToInvoiceList(sProduct);
      setIsOpenNewProduct(false);
      setSProduct(null);
    }
  };
  return (
    <div className="shadow p-5 mb-5 bg-white rounded">
      <h4>Add Product</h4>
      <div className="dropdown">
        <button
          className="btn bg-light dropdown-toggle"
          type="button"
          id="dropdownMenu3"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span>{getSProduct()}</span>
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenu3">
          <input
            value={query}
            onChange={filterFunction}
            className="dropdown-item"
            type="text"
          />
          <div className="dropdown-data">
            {filteredProducts.map((product) => (
              <button
                key={product._id}
                onClick={() => setSProduct(product)}
                className="dropdown-item"
                type="button"
              >
                {product.name + " : " + product.price}
              </button>
            ))}
            <div
              onClick={() => setIsOpenNewProduct(true)}
              className="dropdown-item"
            >
              <span className="cursor-pointer">Add new Product</span>
            </div>
          </div>
        </div>
      </div>
      {sProduct && (
        <ul className="list-unstyled user-detail">
          <li>
            <span>{"Product Name : " + sProduct.name}</span>
          </li>
          <li>{"Product Price : $" + sProduct.price}</li>
          <li onClick={handleAttachToInvoiceList}>
            <div className="mt-3">
              <button className="custom-default-button">
                Add product to Invoice
              </button>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};

export default IndividualProductList;
