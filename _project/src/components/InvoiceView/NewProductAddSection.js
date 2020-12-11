import React, { useState, useCallback, useEffect, useReducer } from "react";

// client adding section reducer
const initialData = {
  submit: false,
  name: "",
  price: 0,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN_NEW_CLIENT":
      return {
        ...state,
        open: true,
      };
    case "SET_CLIENT_DATA":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "SET_SUBMITTED":
      return {
        ...state,
        submit: true,
      };
    case "CLEAR_CLIENT_DATA":
      return initialData;
    default:
      return state;
  }
};

const NewProductAddSection = ({ open, onClose, onSave }) => {
  // add new client data
  const [client, dispatch] = useReducer(reducer, initialData);
  const handler = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_CLIENT_DATA", payload: { name, value } });
  };
  const { submit, name, price } = client;
  const onSaveHandler = () => {
    dispatch({ type: "SET_SUBMITTED" });
    if (!name || !price) return;
    onSave({ name, price });
    onClose();
    dispatch({ type: "CLEAR_CLIENT_DATA" });
  };
  return (
    <div>
      {open && (
        <ul className="list-unstyled user-detail form-group">
          <li>
            <input
              className="form-control"
              type="text"
              name="name"
              value={name}
              onChange={handler}
              placeholder="Product name"
            />
            {submit && (
              <div className="text-danger">Product name is required.</div>
            )}
          </li>
          <li>
            <input
              type="number"
              name="price"
              value={price}
              onChange={handler}
              className="form-control"
              placeholder="Product price"
            />
            {submit && (
              <div className="text-danger">Product price is required.</div>
            )}
          </li>
          <li className="d-flex">
            <button
              onClick={onSaveHandler}
              className="btn btn-success ml-auto mr-2"
            >
              Add
            </button>
            <button onClick={onClose} className="btn">
              Cancel
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};
export default NewProductAddSection;
