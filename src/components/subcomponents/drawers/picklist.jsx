import Drawer from "@mui/material/Drawer";
import "./style.scss";
import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import CloseIcon from "@mui/icons-material/Close";
import debounce from "lodash.debounce";

function AddPicklist({
  open,
  handleClose,
  addEmp,
  picklistName,
  edit,
  editData,
  editPicklist,
}) {
  const [name, setName] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [territoryName, setTerritoryName] = useState("");
  const [territoryState, setTerritoryState] = useState([]);
  const [zipCodeLoader, setZipCodeLoader] = useState(false);
  const [zipCodeOpt, setZipCodeOpt] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const getZipCodes = async (search = "") => {
    setZipCodeLoader(true);
    try {
      const res = await axios.get(
        `${apiPath.devPath}/api/picklist/zipcodes/getzipcodes`,
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

  const handleAddEmp = (e) => {
    e.preventDefault();
    let formData = {};
    if (picklistName === "Zip Code") {
      formData = { zipCode, city, state };
    } else if (picklistName === "User Type") {
      formData = { userTypeCategory: name, userTypeFlag: shortCode };
    } else if (picklistName === "Territory") {
      const territoryZips = territoryState.map((item) => item.value);
      formData = { territoryName, territoryState: territoryZips };
    } else {
      formData = { name, shortCode };
    }
    if (edit) {
      editPicklist(formData);
    } else {
      addEmp(formData);
    }
    refresher();
  };

  const refresher = () => {
    setName("");
    setShortCode("");
    setTerritoryName("");
    setTerritoryState([]);
  };

  const handleSelectionChange = (selectedOptions) => {
    setTerritoryState(selectedOptions);
  };

  return (
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
            onClick={handleClose}
          />
        </div>
        <h1 className="text-white font-semibold text-2xl mb-5">
          Add {picklistName}
        </h1>
        {picklistName === "Zip Code" ? (
          <form
            onSubmit={handleAddEmp}
            className="flex flex-row flex-wrap gap-5"
          >
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">ZipCode</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter ZipCode"
                required={true}
                name="zipCode"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">City</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City"
                required={true}
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
                required={true}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <input
                type="submit"
                className="p-2 bg-white border-b-1 self-end text-black hover:text-white hover:bg-orange-400"
                value={edit ? "Save" : `Add`}
              />
            </div>
          </form>
        ) : picklistName === "Territory" ? (
          <form
            onSubmit={handleAddEmp}
            className="flex flex-row flex-wrap gap-5"
          >
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Territory Name</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={territoryName}
                onChange={(e) => setTerritoryName(e.target.value)}
                placeholder="Enter Name"
                required={true}
                name="name"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Territory Zipcodes</label>
              {zipCodeLoader ? (
                <p className="text-white text-lg">Loading...</p>
              ) : (
                <Select
                  options={zipCodeOpt}
                  isMulti
                  value={territoryState}
                  inputValue={inputValue}
                  onInputChange={handleInputChange}
                  onChange={handleSelectionChange}
                  placeholder="Search Zipcodes"
                  name="territoryState"
                  id="role-select-cus"
                />
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <input
                type="submit"
                className="p-2 bg-white border-b-1 self-end text-black hover:text-white hover:bg-orange-400"
                value={edit ? "Save" : `Add`}
              />
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleAddEmp}
            className="flex flex-row flex-wrap gap-5"
          >
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Name</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                required={true}
                name="name"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Short Code</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
                placeholder="Enter ShortCode"
                name="shortCode"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <input
                type="submit"
                className="p-2 bg-white border-b-1 self-end text-black hover:text-white hover:bg-orange-400"
                value={edit ? "Save" : `Add`}
              />
            </div>
          </form>
        )}
      </div>
    </Drawer>
  );
}

export default AddPicklist;

