import Drawer from "@mui/material/Drawer";
import "./style.scss";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import debounce from "lodash.debounce";


function AddCLient({ open, handleClose, addEmp, edit, editData, editEmp }) {
  const [clientName, setClientName] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCodeLoader, setZipCodeLoader] = useState(false);
  const [zipCodeOpt, setZipCodeOpt] = useState([]);
  const [zipCode, setZipCode] = useState("");
  const [websiteAddress, setWebsiteAddress] = useState("");
  const [status, setStatus] = useState("");
  const [statusOpt, setStatusOpt] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputStatusValue, setInputStatusValue] = useState("");
  // const [files, setFiles] = useState([]);
  // const [fileCategory, setFileCategory] = useState("");
  // const [fileCategoryOpt, setFileCategoryOpt] = useState("");
  // const [inputFileCatagory, setInputFileCatagory] = useState("");




  useEffect(() => {
    // fileCatagoryOptions();
    statusOptions();
    getZipCodes();
    if (edit) {
      setClientName(editData.clientName);
      setPrimaryContact(editData.primaryContact);
      setEmail(editData.email);
      setPhone(editData.phone);
      setFax(editData.fax);
      setAddress1(editData.address1);
      setAddress2(editData.address2);
      setCity(editData.city);
      setState(editData.state);
      setZipCode({ label: editData.zipCode, value: editData.zipCode });
      setWebsiteAddress(editData.websiteAddress);
      setStatus(editData.status.value);
    }
  }, [open]);
  const handleAddClient = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("clientName", clientName);
    formData.append("primaryContact", primaryContact);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("fax", fax);
    formData.append("address1", address1);
    formData.append("address2", address2);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("zipCode", zipCode.value);
    formData.append("websiteAddress", websiteAddress);
    formData.append("status", status.value);

    if (edit) {
      editEmp(formData);
    } else {
      addEmp(formData);
      dataReset();
    }
  };
  const dataReset = () => {
    setClientName("");
    setPrimaryContact("");
    setEmail("");
    setPhone("");
    setFax("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setState("");
    setZipCode("");
    setWebsiteAddress("");
    setStatus("")
  };

  // const getZipCodes = () => {
  //   setZipCodeLoader(true);
  //   axios
  //     .get(`${apiPath.prodPath}/api/picklist/zipcodes/getzipcodes`)
  //     .then((res) => {
  //       console.log(res.data);
  //       res.data.zipCodes.map((i) => {
  //         console.log("##", i.zipCode);
  //       });
  //       const sortedData = res.data.zipCodes.map((i) => {
  //         return {
  //           label: i.zipCode,
  //           value: i.zipCode,
  //           city: i.city,
  //           state: i.state,
  //         };
  //       });
  //       setZipCodeOpt(sortedData);
  //       setZipCodeLoader(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setZipCodeLoader(false);
  //     });
  // };

  function statusOptions () {
    const stats = ['lead', 'client'];
    const options = stats.map((item)=>{
      const statusOption = {
        label : item,
        value : item,
      }
      return statusOption;
    });
    setStatusOpt(options);
  }

  // function fileCatagoryOptions () {
  //   const fileCategories = ["Invoice", "Contract", "Report", "Others"];
  //   const options = fileCategories.map((item)=>{
  //     const statusOption = {
  //       label : item,
  //       value : item,
  //     }
  //     return statusOption;
  //   });
  //   setFileCategoryOpt(options);
  // }

  
  
  const getZipCodes = async (search = "") => {
    setZipCodeLoader(true); 
    try {
      const res = await axios.get(
        `${apiPath.prodPath}/api/picklist/zipcodes/getzipcodes`,
        {
          params: {
            search, 
            limit: 50,
          },
        }
      );
      const sortedData = res.data.zipCodes.map((i) => ({
        label: i.zipCode,
        value: i.zipCode,
        city: i.city,
        state: i.state,
      }));
      setZipCodeOpt(sortedData); 
    } catch (err) {
      console.log(err);
    } finally {
      setZipCodeLoader(false); 
    }
  };
  const debouncedGetZipCodes = debounce((inputValue) => {
    if (inputValue) {
      getZipCodes(inputValue);
    } else {
      setZipCodeOpt([]); 
    }
  }, 300);
  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue); 
    debouncedGetZipCodes(newInputValue); 
  };
  const handleInputStatusChange = (newInputValue) => {
    setInputStatusValue(newInputValue); 
  };
  // const handleFileChange = (event) => {
  //   const selectedFiles = Array.from(event.target.files);
  //   setFiles(selectedFiles);
  // };
  // const handleInputFileCatagory = (newInputValue) => {
  //   setInputFileCatagory(newInputValue); 
  // };

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
          <h1 className="text-white font-semibold text-2xl mb-5">Add Client</h1>
          <form
            onSubmit={handleAddClient}
            className="flex flex-row flex-wrap gap-5"
          >
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Client Name</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter Client Name"
                required={true}
                name="clientName"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Primary Contact</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={primaryContact}
                onChange={(e) => setPrimaryContact(e.target.value)}
                placeholder="Enter Primary Contact"
                name="primaryContact"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Email</label>
              <input
                type="email"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                required={true}
                name="email"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Phone</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter Phone"
                name="phone"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Fax Address</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                placeholder="Enter Fax Address"
                name="fax"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Address 1</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                placeholder="Enter Address 1"
                name="address1"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Address 2</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                placeholder="Enter Address 2"
                name="address2"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">ZipCode</label>
              {zipCodeLoader ? (
                <p className="text-white text-lg">Loading...</p>
              ) : (
                <Select
                  options={zipCodeOpt}
                  value={zipCode}
                  onInputChange={handleInputChange}
                  inputValue={inputValue}
                  onChange={(v) => {
                    setZipCode(v);
                    setCity(v.city);
                    setState(v.state);
                  }}
                  placeholder="Select ZipCode"
                  id="role-select-cus"
                  name="zipCode"
                />
              )}
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">City</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City"
                name="city"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">State</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter State"
                name="state"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Website Address</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={websiteAddress}
                onChange={(e) => setWebsiteAddress(e.target.value)}
                placeholder="Enter Client Web address"
                name="websiteAddress"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Status</label>
              <Select
                  options={statusOpt}
                  value={status}
                  onInputChange={handleInputStatusChange}
                  inputValue={inputStatusValue}
                  onChange={(e) => setStatus(e)}
                  placeholder="Select Status"
                  id="role-select-cus"
                  name="Status"
                />
            </div>
            {/* <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Client Files</label>
              <input
                type="file"
                multiple
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={files}
                onChange={handleFileChange}
                placeholder="Upload a File"
                name="Files"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">File Catagory</label>
              <Select
                  options={fileCategoryOpt}
                  value={fileCategory}
                  onInputChange={handleInputFileCatagory}
                  inputValue={inputFileCatagory}
                  onChange={(e) => setFileCategory(e)}
                  placeholder="Select File Catagory"
                  id="role-select-cus"
                  name="File Catagory"
                />
            </div> */}
            <div className="flex flex-col gap-2 w-full">
              <input
                type="submit"
                className="p-2 bg-white border-b-1 self-end text-black hover:text-white hover:bg-orange-400"
                value={edit ? "Save" : `Add`}
              />
            </div>
          </form>
        </div>
      </Drawer>
    </>
  );
}

export default AddCLient;
