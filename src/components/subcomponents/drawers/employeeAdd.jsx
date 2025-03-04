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

function AddEmployee({ open, handleClose, addEmp, edit, editData, editEmp }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cell, setCell] = useState("");
  const [roleOpt, setRoleOpt] = useState([]);
  const [roleLoader, setRoleLoader] = useState(false);
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCodeLoader, setZipCodeLoader] = useState(false);
  const [zipCodeOpt, setZipCodeOpt] = useState([]);
  const [zipCode, setZipCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [newPassFlag, setnewPassFlag] = useState(false);
  const [inputValue, setInputValue] = useState("");

  
  useEffect(() => {
    getUserTypes();
    getZipCodes();
    if (edit) {
      setFirstName(editData.firstName);
      setLastName(editData.secondName);
      setEmail(editData.email);
      setPhone(editData.phone);
      setCell(editData.cell);
      setRole({ label: editData.role, value: editData.role });
      setTitle(editData.title);
      setAddress1(editData.address1);
      setAddress2(editData.address2);
      setCity(editData.city);
      setState(editData.state);
      setZipCode({ label: editData.zipCode, value: editData.zipCode });
      setUsername(editData.username);
    }
  }, [open]);
  const handleAddEmp = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("secondName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("cell", cell);
    formData.append("role", role.value);
    formData.append("title", title);
    formData.append("address1", address1);
    formData.append("address2", address2);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("zipCode", zipCode.value);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("avatar", avatar);
    if (edit) {
      formData.append("newPasswordFlag", newPassFlag);
      editEmp(formData);
    } else {
      addEmp(formData);
      dataReset();
    }
  };
  const dataReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCell("");
    setRole("");
    setTitle("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setState("");
    setZipCode("");
    setUsername("");
  };
  function getUserTypes(){
    setRoleLoader(true);
    axios
      .get(`${apiPath.prodPath}/api/picklist/usertypes/getallusertypes`)
      .then((res) => {
        const sortedData = res.data.userTypes
          .map((i) => {
            return {
              label: i.userTypeCategory,
              value: i.userTypeCategory,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
          console.log(sortedData);
        setRoleOpt(sortedData);
        setRoleLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setRoleLoader(false);
      });
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
 



  const fileHandler = (event) => {
    setAvatar(event.target.files[0]);
  };
  const handleNewPassFlag = (e) => {
    setnewPassFlag(e.target.checked);
  };
  console.log("newpass", newPassFlag);
  console.log("##$$", zipCodeOpt);
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
          <h1 className="text-white font-semibold text-2xl mb-5">
            Add Employee
          </h1>
          <form
            onSubmit={handleAddEmp}
            className="flex flex-row flex-wrap gap-5"
          >
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">First Name</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter First Name"
                required={true}
                name="firstName"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Last Name</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter Last Name"
                name="lastName"
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
              <label className="font-regular text-md">Cell</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={cell}
                onChange={(e) => setCell(e.target.value)}
                placeholder="Enter Cell"
                name="cell"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Role</label>
              {roleLoader ? (
                <p className="text-white text-lg">Loading...</p>
              ) : (
                <Select
                  options={roleOpt}
                  value={role}
                  onChange={(v) => setRole(v)}
                  placeholder="Select Role"
                  required={true}
                  id="role-select-cus"
                  name="role"
                />
              )}
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Title</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title"
                name="title"
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
              <label className="font-regular text-md">Username</label>
              <input
                type="text"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                name="username"
              />
            </div>
            {edit ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newPassFlag}
                    onChange={handleNewPassFlag}
                    inputProps={{ "aria-label": "controlled" }}
                    value={"new"}
                  />
                }
                label="New Password"
              />
            ) : null}
            {newPassFlag ? (
              <div className="flex flex-col gap-2 w-1/4">
                <label className="font-regular text-md">Password</label>
                <input
                  type="password"
                  className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Enter Password"
                  name="password"
                  required={true}
                />
              </div>
            ) : null}
            {edit ? null : (
              <div className="flex flex-col gap-2 w-1/4">
                <label className="font-regular text-md">Password</label>
                <input
                  type="password"
                  className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  name="password"
                />
              </div>
            )}
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-regular text-md">Avatar</label>
              <input
                name="avatar"
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                type="file"
                onChange={(e) => fileHandler(e)}
                accept="image/png,image/jpeg"
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
        </div>
      </Drawer>
    </>
  );
}

export default AddEmployee;
