import Drawer from "@mui/material/Drawer";
import "./style.scss";
import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import axios from "axios";
// import { apiPath } from "@/utils/routes";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@/components/ui/button";
import ClientFile from "../list/ClientFile";
// import Swal from "sweetalert2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



function ClientDetails({ open, handleClose, item }) {

  const [clientItem, setClientItem] = useState(item);

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
              <label className="font-semibold text-xl">Name</label>
              <p className="text-md">{clientItem.clientName}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Primary Contact</label>
              <p className="text-md">
                {clientItem.secondName == "" ? "N/A" : clientItem.primaryContact}
              </p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Email</label>
              <p className="text-md">{clientItem.email}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Website</label>
              <p className="text-md">{clientItem.websiteAddress}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Phone</label>
              <p className="text-md">{clientItem.phone == "" ? "N/A" : clientItem.phone}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Cell</label>
              <p className="text-md">{clientItem.cell == "" ? "N/A" : clientItem.cell}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Address 1</label>
              <p className="text-md">
                {clientItem.address1 == "" ? "N/A" : clientItem.address1}
              </p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Address 2</label>
              <p className="text-md">
                {clientItem.address2 == "" ? "N/A" : clientItem.address2}
              </p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Zip Code</label>
              <p className="text-md">
                {clientItem.zipCode == "" ? "N/A" : clientItem.zipCode}
              </p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">City</label>
              <p className="text-md">{clientItem.city == "" ? "N/A" : clientItem.city}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">State</label>
              <p className="text-md">{clientItem.state == "" ? "N/A" : clientItem.state}</p>
            </div>
            <div className="w-1/4 flex flex-col gap-2">
              <label className="font-semibold text-xl">Fax</label>
              <p className="text-md">{clientItem.fax}</p>
            </div>
            
          <div className=" w-full h-2/4">
          <Tabs defaultValue="Task" className="w-full">
          <TabsList className="cus-tab-wrap">
            <TabsTrigger value="Task">Task</TabsTrigger>
            <TabsTrigger value="pics">Pics/Files</TabsTrigger>
          </TabsList>
          <TabsContent value="Task">
            {/* <Invoices allData={item} /> */}
          </TabsContent>
          <TabsContent value="pics">
          <ClientFile item = {clientItem} open={open}/>
          </TabsContent>
        </Tabs>
              
          </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default ClientDetails;
