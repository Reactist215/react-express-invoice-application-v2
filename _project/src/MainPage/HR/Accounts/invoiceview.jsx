import React, {
  useState,
  useCallback,
  useEffect,
  useReducer,
  useMemo,
} from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Helmet } from "react-helmet";
import { Applogo } from "../../../Entryfile/imagepath";

import { jwtService } from "../../../services";
import { responsiveArray } from "antd/lib/_util/responsiveObserve";
import {
  NewClientAddSection,
  NewProductAddSection,
  IndividualProductList,
  ProductTableBody,
} from "../../../components";
import { userActions } from "../../../store/actions";
// util functions //
// import { makeFixed2 } from "../../../helpers/UtiFunctions";
const makeFixed2 = (number) => {
  if (!number || Number.isNaN(number)) return 0;
  return (Math.round(number * 100) / 100).toFixed(2);
};
const getProductPrice = (product) => {
  const { price, quantity } = product;
  return makeFixed2(price * quantity);
};

const Invoice = () => {
  // redux store states & dispatchers //
  const user = useSelector((state) => state.user, shallowEqual);
  const dispatch = useDispatch();

  // fetch actions //
  useEffect(() => {
    // jwtService
    //   .getAllClients(vendor._id)
    //   .then((response) => {
    //     setClients(response.data);
    //   })
    //   .catch((error) => {
    //     setClients([]);
    //   });
  }, []);

  // component states & handlers //
  const [sClient, setSClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [query, setQuery] = useState("");
  const [billfor, setBillFor] = useState("");
  const [individualPs, setIndividualPs] = useState([
    { _id: 1, name: "Product1", price: 50 },
    { _id: 2, name: "Product2", price: 150 },
    { _id: 3, name: "Product3", price: 250 },
    { _id: 4, name: "Product4", price: 350 },
    { _id: 5, name: "Product5", price: 540 },
  ]);
  const [invoiceProducts, setIProducts] = useState([]);
  const [tax, setTax] = useState(5);
  const [discardInput, setDiscardInput] = useState("");
  const [isOpenNewClient, setIsOpenNewClient] = useState(false);
  const [isOpenNewProduct, setIsOpenNewProduct] = useState(false);
  const invoiceId = 1001;

  const filterFunction = (e) => setQuery(e.target.value);
  const filteredClients = useMemo(() => {
    if (!user || !user.clients) return [];

    return user.clients
      .filter((client) => client.role !== "admin")
      .filter((client) => {
        const { name } = client;
        const q = query.toLowerCase();
        return name.toLowerCase().includes(q);
      });
  }, [user]);

  const getSClient = () => {
    if (!sClient) return "Select Client";
    return sClient.name;
  };

  const addIndividualProduct = (product) =>
    setIndividualPs((prod) => prod.concat({ ...product }));
  const addNewProduct = (product) => {
    setIProducts((prod) => prod.concat({ ...product }));
  };
  const onChangeProduct = (idx, e) => {
    const { name, value } = e.target;
    setIProducts((products) => {
      const newProducts = products.map((p) => p);
      newProducts[idx][name] = value;
      return newProducts;
    });
  };
  const removeProductFromInvoice = (idx) => {
    setIProducts((products) => {
      const tmpProducts = products.map((p) => p);
      tmpProducts.splice(idx, 1);
      return tmpProducts;
    });
  };
  const getTotalPrice = () => {
    if (!invoiceProducts || !invoiceProducts.length)
      return {
        totalPrice: 0.0,
        taxPrice: 0.0,
      };

    const totalPrice = invoiceProducts.reduce(
      (total, product) => Number(total) + Number(getProductPrice(product)),
      0
    );
    const taxPrice = tax && totalPrice ? (totalPrice * tax) / 100 : 0.0;
    const sum = totalPrice && taxPrice ? totalPrice + taxPrice : 0.0;

    return {
      totalPrice: makeFixed2(totalPrice),
      taxPrice: makeFixed2(taxPrice),
      sum: makeFixed2(sum),
    };
  };

  // Invoice Edit Decision
  const sendInvoice = () => {};
  const saveInvoice = () => {
    jwtService
      .postInvoice({
        id: invoiceId,
        vendor: user._id,
        client: sClient._id,
        billfor,
        products: invoiceProducts,
        tax,
        status: "draft",
      })
      .then((response) => console.log("create invoice success", response))
      .catch((error) => console.log("create invoice error", error));
  };
  const discardInvoice = () => {};

  const addNewClient = ({ name, email, phone, address }) => {
    jwtService
      .addNewClient({ id: user._id, name, email, phone, address })
      .then((response) => {
        dispatch(userActions.addClient(response.data));
        setSClient(response.data);
      })
      .catch((error) => console.log("[add new client error]", error));
  };
  return (
    <div className="page-wrapper invoice-view">
      <Helmet>
        <title>Invoice - HRMS Admin Template</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Invoice</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/purple/app/main/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Invoice</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <div className="btn-group btn-group-sm">
                <button className="btn btn-white">CSV</button>
                <button className="btn btn-white">PDF</button>
                <button className="btn btn-white">
                  <i className="fa fa-print fa-lg" /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-4 m-b-20">
                    <ul className="list-unstyled user-detail">
                      <li>{user && user.firstName + " " + user.lastName}</li>
                      <li>{user && user.address}</li>
                      <li>{user && user.phone}</li>
                      <li>{user && user.email}</li>
                    </ul>
                  </div>
                  <div className="col-sm-8 m-b-20">
                    <div className="invoice-details">
                      <h3 className="text-uppercase">
                        Invoice #INV-{invoiceId}
                      </h3>
                      {/* <ul className="list-unstyled">
                        <li>Date: <span>March 12, 2019</span></li>
                        <li>Due date: <span>April 25, 2019</span></li>
                      </ul> */}
                    </div>
                    <div className="vendor-logo">
                      <img src={Applogo} alt="vendor logo" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6 col-lg-4 col-xl-4 m-b-20">
                    <h5>Invoice to:</h5>
                    <div className="dropdown">
                      <button
                        className="btn bg-light dropdown-toggle"
                        type="button"
                        id="dropdownMenu2"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span>{getSClient()}</span>
                      </button>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenu2"
                      >
                        <input
                          onChange={filterFunction}
                          className="dropdown-item"
                          type="text"
                        />
                        <div className="dropdown-data">
                          {filteredClients.map((client) => (
                            <button
                              key={client._id}
                              onClick={() => setSClient(client)}
                              className="dropdown-item"
                              type="button"
                            >
                              {client.name}
                            </button>
                          ))}
                          <div
                            onClick={() => setIsOpenNewClient(true)}
                            className="dropdown-item"
                          >
                            <span className="cursor-pointer">
                              Add new client
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {sClient && (
                      <ul className="list-unstyled user-detail">
                        <li>
                          <span>{sClient.address}</span>
                        </li>
                        <li>{[sClient.phone]}</li>
                        <li>
                          <a href="#">{sClient.email}</a>
                        </li>
                      </ul>
                    )}
                    <NewClientAddSection
                      open={isOpenNewClient}
                      onSave={addNewClient}
                      onClose={() => setIsOpenNewClient(false)}
                    />
                  </div>
                  <div className="col-sm-6 col-lg-8 col-xl-8 m-b-20">
                    <span className="text-muted">Bill for</span>
                    <input
                      type="text"
                      className="bill-for"
                      onChange={(e) => setBillFor(e.target.value)}
                      value={billfor}
                    />
                    {/* <ul className="list-unstyled invoice-payment-details">
                      <li><h5>Total Due: <span className="text-right">$8,750</span></h5></li>
                      <li>Bank name: <span>Profit Bank Europe</span></li>
                      <li>Country: <span>United Kingdom</span></li>
                      <li>City: <span>London E1 8BF</span></li>
                      <li>Address: <span>3 Goodman Street</span></li>
                      <li>IBAN: <span>KFH37784028476740</span></li>
                      <li>SWIFT code: <span>BPT4E</span></li>
                    </ul> */}
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped table-hover invoice-table">
                    <thead>
                      <tr>
                        <th>PRODUCT</th>
                        <th className="d-none d-sm-table-cell">DESCRIPTION</th>
                        <th>PRICE</th>
                        <th>QUANTITY</th>
                        <th class="width-150">TOTAL</th>
                        <th className="text-right">#</th>
                      </tr>
                    </thead>
                    <ProductTableBody
                      products={invoiceProducts}
                      onChangeProduct={onChangeProduct}
                      addNewProduct={addNewProduct}
                      removeProductFromInvoice={removeProductFromInvoice}
                    />
                  </table>
                </div>
                <IndividualProductList
                  attachToInvoiceList={addNewProduct}
                  individualPs={individualPs}
                  setIsOpenNewProduct={setIsOpenNewProduct}
                />
                <NewProductAddSection
                  open={isOpenNewProduct}
                  onSave={(product) => {
                    addIndividualProduct(product);
                    addNewProduct(product);
                  }}
                  onClose={() => setIsOpenNewProduct(false)}
                />
                <div>
                  <div className="row invoice-payment">
                    <div className="col-sm-7"></div>
                    <div className="col-sm-5">
                      <div className="m-b-20">
                        <div className="table-responsive no-border">
                          <table className="table mb-0">
                            <tbody>
                              <tr>
                                <th>Subtotal:</th>
                                <td className="text-right">
                                  $<span>{getTotalPrice().totalPrice}</span>
                                </td>
                              </tr>
                              <tr>
                                <th>
                                  Tax:{" "}
                                  <span className="text-regular">
                                    <input
                                      type="number"
                                      className="tax-input"
                                      onChange={(e) => setTax(e.target.value)}
                                      value={tax}
                                    />
                                    %
                                  </span>
                                </th>
                                <td className="text-right">
                                  $<span>{getTotalPrice().taxPrice}</span>
                                </td>
                              </tr>
                              <tr>
                                <th>Total:</th>
                                <td className="text-right text-primary">
                                  <h5>${getTotalPrice().sum}</h5>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="invoice-info">
                    <h5>Other information</h5>
                    <p className="text-muted">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vivamus sed dictum ligula, cursus blandit risus. Maecenas
                      eget metus non tellus dignissim aliquam ut a ex. Maecenas
                      sed vehicula dui, ac suscipit lacus. Sed finibus leo vitae
                      lorem interdum, eu scelerisque tellus fermentum. Curabitur
                      sit amet lacinia lorem. Nullam finibus pellentesque
                      libero, eu finibus sapien interdum vel
                    </p>
                    <div className="text-right mt-3">
                      <button
                        onClick={sendInvoice}
                        className="btn btn-success mr-2"
                      >
                        Send invoice to client
                      </button>
                      <button
                        onClick={saveInvoice}
                        className="btn btn-primary mr-2"
                      >
                        Save
                      </button>
                      <button
                        className="btn text-danger"
                        data-toggle="modal"
                        data-target="#discard-confirm-modal"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  id="discard-confirm-modal"
                  className="modal custom-modal fade"
                  role="dialog"
                >
                  <div
                    className="modal-dialog modal-dialog-centered modal-md"
                    role="document"
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Are you sure?</h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>
                          Once you discard it, changes you've made are fully
                          deleted.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()}>
                          <div className="form-group">
                            <label>
                              If you are really going to discard, please type
                              "Discard" and hit the button.
                            </label>
                            <input
                              onChange={(e) => setDiscardInput(e.target.value)}
                              value={discardInput}
                              className="form-control"
                              type="text"
                            />
                          </div>
                          <div className="submit-section">
                            <button
                              className="btn btn-secondary mr-3"
                              data-dismiss="modal"
                            >
                              Cancel
                            </button>
                            <button
                              className={
                                "btn btn-danger " +
                                (discardInput !== "Discard" ? "disabled" : "")
                              }
                              disabled={discardInput !== "Discard"}
                              data-dismiss="modal"
                              onClick={discardInvoice}
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default Invoice;
