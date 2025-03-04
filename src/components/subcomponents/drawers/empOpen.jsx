import Drawer from "@mui/material/Drawer";
import "./style.scss";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import CloseIcon from "@mui/icons-material/Close";

function EmployeeDetails({ open, handleClose, item }) {
  console.log("this is item", item);
  return (
    <>
      <Drawer
        className="bg-all-modals"
        anchor={"bottom"}
        open={open}
        onClose={handleClose}
      >
        <div className="p-10">
          <div className="flex flex-row justify-end">
            <CloseIcon
              className="text-2xl hover:cursor-pointer"
              onClick={() => handleClose()}
            />
          </div>
          <div className="flex flex-wrap flex-row gap-4">
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">First Name</label>
              <p className="text-md">{item.firstName}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Second Name</label>
              <p className="text-md">
                {item.secondName == "" ? "N/A" : item.secondName}
              </p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Email</label>
              <p className="text-md">{item.email}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Role</label>
              <p className="text-md">{item.role}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Title</label>
              <p className="text-md">{item.title == "" ? "N/A" : item.title}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Phone</label>
              <p className="text-md">{item.phone == "" ? "N/A" : item.phone}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Cell</label>
              <p className="text-md">{item.cell == "" ? "N/A" : item.cell}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Address 1</label>
              <p className="text-md">
                {item.address1 == "" ? "N/A" : item.address1}
              </p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Address 2</label>
              <p className="text-md">
                {item.address2 == "" ? "N/A" : item.address2}
              </p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Zip Code</label>
              <p className="text-md">
                {item.zipCode == "" ? "N/A" : item.zipCode}
              </p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">City</label>
              <p className="text-md">{item.city == "" ? "N/A" : item.city}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">State</label>
              <p className="text-md">{item.state == "" ? "N/A" : item.state}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Username</label>
              <p className="text-md">{item.username}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Avatar</label>
              {item.avatar == "" ? (
                <p>N/A</p>
              ) : (
                <img
                  src={item.avatar}
                  className="w-1/3 h-auto"
                  alt={"avatar"}
                />
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default EmployeeDetails;
