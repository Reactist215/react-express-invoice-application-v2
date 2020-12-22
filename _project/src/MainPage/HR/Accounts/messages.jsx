import React, { useState, useCallback, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { Helmet } from "react-helmet";

import { Table } from "antd";
import "antd/dist/antd.css";
import "../../antdstyle.css";
import { jwtService } from "../../../services";
import MessagePanel from "../../../components/Messages/MessagePanel";

const Message = () => {
  const [cycle, setCycle] = useState("daily");

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
              <h3 className="page-title">Messages</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/purple/app/main/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Messages</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <MessagePanel
            title="Invoices Sent"
            defaultValue="This is (companyname), Here is your link to payment"
            onSave={(v) => console.log(v)}
          />
          <MessagePanel
            title="Invoices Reminder"
            defaultValue="This is (companyname), We have not received your payment. Here is your link to payment"
            onSave={(v) => console.log(v)}
            cycle={cycle}
            onSaveCycle={setCycle}
          />
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default withRouter(Message);
