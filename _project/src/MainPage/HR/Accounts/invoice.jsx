import React, { useState, useCallback, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { Helmet } from "react-helmet";

import { Table } from "antd";
import "antd/dist/antd.css";
import { itemRender, onShowSizeChange } from "../../paginationfunction";
import "../../antdstyle.css";
import { jwtService } from "../../../services";

const Invoices = () => {
  const user = useSelector((state) => state.user, shallowEqual);
  const [rows, setRows] = useState([
    {
      id: 1,
      invoicenumber: "INV-1001",
      client: "	Global Technologies",
      createddate: "11 Mar 2019",
      duedate: "11 Mar 2019",
      amount: "2099",
      status: "Paid",
    },
    {
      id: 2,
      invoicenumber: "INV-1002",
      client: "Delta Infotech",
      createddate: "11 Mar 2019",
      duedate: "11 Mar 2019",
      amount: "2099",
      status: "Sent",
    },
  ]);
  const columns = [
    {
      title: "Invoice Number",
      dataIndex: "invoicenumber",
      render: (text, record) => (
        <Link to="/app/accounts/invoices-view">#{text}</Link>
      ),
      sorter: (a, b) => a.invoicenumber.length - b.invoicenumber.length,
    },
    {
      title: "Client",
      dataIndex: "client",
      sorter: (a, b) => a.client.length - b.client.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => <span>$ {text}</span>,
      sorter: (a, b) => a.amount.length - b.amount.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span
          className={
            text === "Paid"
              ? "badge bg-inverse-success"
              : "badge bg-inverse-info"
          }
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    // {
    //   title: 'Action',
    //   render: (text, record) => (
    //       <div className="dropdown dropdown-action text-right">
    //           <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
    //                   <div className="dropdown-menu dropdown-menu-right">
    //                     <a className="dropdown-item" href="/purple/app/accounts/invoices-edit"><i className="fa fa-pencil m-r-5" /> Edit</a>
    //                     <a className="dropdown-item" href="/purple/app/accounts/invoices-view"><i className="fa fa-eye m-r-5" /> View</a>
    //                     <a className="dropdown-item" href="#"><i className="fa fa-file-pdf-o m-r-5" /> Download</a>
    //                     <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
    //                   </div>
    //       </div>
    //     ),
    // },
  ];
  const [query, setQuery] = useState("");

  useEffect(() => {
    console.log("[getMyInvoices]", user._id);
    jwtService
      .getMyInvoices(user._id)
      .then((response) => setRows(response.data))
      .catch((error) => {
        console.log("[fetch invoice error]", error);
        setRows([]);
      });
  }, [user]);

  const handleTableChange = () => {};
  const inCludeQuery = (str, substr) => {
    if (!str) return false;
    if (!substr) return true;
    return str.trim().toLowerCase().includes(substr.trim().toLowerCase());
  };
  const filteredRows = useCallback(
    () =>
      rows.filter(
        (row) =>
          inCludeQuery(row.client, query) ||
          inCludeQuery(row.invoicenumber, query) ||
          inCludeQuery(row.amount, query)
      ),
    [rows, query]
  );

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Invoices - HRMS Admin Template</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Invoices</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/purple/app/main/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Invoices</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="/purple/app/accounts/invoices-create"
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Create Invoice
              </a>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Search Filter */}
        <div className="row filter-row">
          <div className="col-sm-6">
            <div className="form-group d-flex">
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Invoice, Client, Amount"
              />
            </div>
          </div>
        </div>
        {/* /Search Filter */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                pagination={{
                  total: filteredRows().length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: "auto" }}
                columns={columns}
                // bordered
                dataSource={filteredRows()}
                rowKey={(record) => record.id}
                onChange={handleTableChange}
              />
              {/* <table className="table table-striped custom-table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Invoice Number</th>
                    <th>Client</th>
                    <th>Created Date</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td><a href="/purple/app/accounts/invoices-view">#INV-0001</a></td>
                    <td>Global Technologies</td>
                    <td>11 Mar 2019</td>
                    <td>17 Mar 2019</td>
                    <td>$2099</td>
                    <td><span className="badge bg-inverse-success">Paid</span></td>
                    <td className="text-right">
                      <div className="dropdown dropdown-action">
                        <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a className="dropdown-item" href="/purple/app/accounts/invoices-edit"><i className="fa fa-pencil m-r-5" /> Edit</a>
                          <a className="dropdown-item" href="/purple/app/accounts/invoices-view"><i className="fa fa-eye m-r-5" /> View</a>
                          <a className="dropdown-item" href="#"><i className="fa fa-file-pdf-o m-r-5" /> Download</a>
                          <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td><a href="/purple/app/accounts/invoices-view">#INV-0002</a></td>
                    <td>Delta Infotech</td>
                    <td>11 Mar 2019</td>
                    <td>17 Mar 2019</td>
                    <td>$2099</td>
                    <td><span className="badge bg-inverse-info">Sent</span></td>
                    <td className="text-right">
                      <div className="dropdown dropdown-action">
                        <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a className="dropdown-item" href="/purple/app/accounts/invoices-edit"><i className="fa fa-pencil m-r-5" /> Edit</a>
                          <a className="dropdown-item" href="/purple/app/accounts/invoices-view"><i className="fa fa-eye m-r-5" /> View</a>
                          <a className="dropdown-item" href="#"><i className="fa fa-file-pdf-o m-r-5" /> Download</a>
                          <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td><a href="/purple/app/accounts/invoices-view">#INV-0003</a></td>
                    <td>Cream Inc</td>
                    <td>11 Mar 2019</td>
                    <td>17 Mar 2019</td>
                    <td>$2099</td>
                    <td><span className="badge bg-inverse-warning">Partially Paid</span></td>
                    <td className="text-right">
                      <div className="dropdown dropdown-action">
                        <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a className="dropdown-item" href="/purple/app/accounts/invoices-edit"><i className="fa fa-pencil m-r-5" /> Edit</a>
                          <a className="dropdown-item" href="/purple/app/accounts/invoices-view"><i className="fa fa-eye m-r-5" /> View</a>
                          <a className="dropdown-item" href="#"><i className="fa fa-file-pdf-o m-r-5" /> Download</a>
                          <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table> */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default withRouter(Invoices);
