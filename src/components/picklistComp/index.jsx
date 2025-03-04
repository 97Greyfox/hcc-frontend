import { Poppins } from "next/font/google";
import EmployeeTable from "@/components/subcomponents/tables/employeeTable";
import { Button } from "@/components/ui/button";
import { apiPath } from "@/utils/routes";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Swal from "sweetalert2";
import { SkeletonCard } from "@/components/reusable/skeleton-card";
import Select from "react-select";
import { Search } from "lucide-react";
import SearchForm from "../reusable/searchForm";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "800"],
  style: ["italic", "normal"],
  subsets: ["latin"],
});
import "./style.scss";
import PicklistTable from "../subcomponents/tables/picklistTable";
import AddPicklist from "../subcomponents/drawers/picklist";


function PicklistComp({ picklistName }) {
  const [picklistData, setPicklistData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const [loader, setLoader] = useState(false);
  const [userTypeModal, setUserTypeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");  
  const [filterOpt, setFilterOpt] = useState([]);

  function filterOptions() {
    let sorts;

    if(picklistName == "User Type"){
       sorts = [];
    }else if(picklistName == "Zip Code"){
      sorts = ['zip', 'city', 'state'];
    }else if(picklistName == "Territory"){
      sorts = ['territoryName'];
    }

    const options = sorts.map((item)=>{
      const statusOption = {
        label : item,
        value : item,
      }
      return statusOption;
    });
    setFilterOpt(options);
  }


  const handleSearch = async (e) => {
    e.preventDefault()
    if (!filterBy || !searchTerm.trim()) {
      Swal.fire({
        icon: "warning",
        text: "Please select a filter and enter a search term.",
      });
      return;
    }

    setLoader(true);
    
      var url = "";
   
    if (picklistName == "Zip Code") {
      url = `${apiPath.prodPath}/api/picklist/zipcodes/getfilteredzipcodes/?${filterBy.value}=${searchTerm}`;
    }
    if (picklistName == "Territory") {
      url = `${apiPath.prodPath}/api/picklist/territory/getterritory/?${filterBy.value}=${searchTerm}`;
    }
      const res = await axios
      .get(url)
      .then((res) => {
        if (picklistName == "Zip Code"){
          setPicklistData(res.data);
        }else{
          setPicklistData(res.data);
        }
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          text: "Something went wrong with the data fetching",
        });
        setLoader(false);
      });
      
  };


  
  const fetchData = (page=1)=>{
    setLoader(true);
    filterOptions();
    var url = "";
    if (picklistName == "User Type") {
      url = `${apiPath.prodPath}/api/picklist/usertypes/getallusertypes?page=${page}&limit=8`;
    }
    if (picklistName == "Zip Code") {
      url = `${apiPath.prodPath}/api/picklist/zipcodes/getallzipcodes?page=${page}&limit=8`;
    }
    if (picklistName == "Territory") {
      url = `${apiPath.prodPath}/api/picklist/territory/getallterritory?page=${page}&limit=8`;
    }
    axios
      .get(url)
      .then((res) => {
        if (picklistName == "Zip Code"){
          setPicklistData(res.data.zipCodes);
          setTotalPages(res.data.pages);
          console.log(res.data.zipCodes);
        }else if (picklistName == "User Type"){
          setPicklistData(res.data.userTypes);
          setTotalPages(res.data.pages);
        }else{
          setPicklistData(res.data.territories);
          setTotalPages(res.data.pages);
        }
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          text: "Something went wrong with the data fetching",
        });
        setLoader(false);
      });
  }
  
  
  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page); 
  };

  const handleUserTypeModal = () => {
    setUserTypeModal(true);
  };
  const refreshData = (page=1) => {
    setLoader(true);
    var url = "";
    if (picklistName == "User Type") {
      url = `${apiPath.prodPath}/api/picklist/usertypes/getallusertypes?page=${page}&limit=8`;
    }
    if (picklistName == "Zip Code") {
      url = `${apiPath.prodPath}/api/picklist/zipcodes/getallzipcodes?page=${page}&limit=8`;
    }
    if (picklistName == "Territory") {
      url = `${apiPath.prodPath}/api/picklist/territory/getallterritory?page=${page}&limit=8`;
    }
    axios
      .get(url)
      .then((res) => {
        setPicklistData(res.data);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          text: "Something went wrong with the data fetching",
        });
        setLoader(false);
      });
  };
  const addPicklist = (data) => {
    var url = "";
    if (picklistName == "Zip Code") {
      url = `${apiPath.prodPath}/api/picklist/zipcodes/addzipcode`;
    }
    if (picklistName == "User Type") {
      url = `${apiPath.prodPath}/api/picklist/userTypes/addusertype`;
    }
    if (picklistName == "Territory") {
      url = `${apiPath.prodPath}/api/picklist/territory/addterritory`;
    }
    axios
      .post(url, data)
      .then((res) => {
        setUserTypeModal(false);
        console.log(res);
        Swal.fire({
          icon: "success",
          text: "Added Successfully",
        });
        refreshData();
      })
      .catch((err) => {
        setUserTypeModal(false);

        console.log(err);
      });
  };
  const handleTest=(data)=>{
    console.log("@@@@@",data)
  }
  return (
    <main className={`${poppins.className} flex flex-col`}>
      <div className="flex w-full flex-row flex-wrap justify-between">
        <div className="w-1/4">
          <h1 className="font-semibold text-2xl pb-3">{picklistName}</h1>
        </div>
        <div className="w-3/4 flex flex-row gap-5 justify-end">
          <Button
            onClick={handleUserTypeModal}
            variant="outline"
            className="bg-transparent"
          >
            <AddIcon /> {picklistName}
          </Button>
        </div>
        <form onSubmit={handleSearch} className="flex flex-row gap-4 w-full items-center">
        <Select
                options={filterOpt}
                value={filterBy}
                onChange={(selectedOption) => setFilterBy(selectedOption)}
                placeholder="Select Filter"
                className="rounded text-gray-800 h-[37px] w-1/5"
              />
              <div className="flex gap-4 rounded items-center border-none">
                <input
                  type="search"
                  placeholder="  Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded px-5 text-gray-800 h-[38px] w-full"
                />
                <input
                  type="submit"
                  className="rounded p-2 bg-gray-400 text-black hover:bg-gray-500 cursor-pointer"
                value={"Search"}
                />                
              </div>
        </form>
        {/* <div className="w-full">
          <SearchForm handleSearch={handleTest} />
        </div> */}
      </div>

      <div className="mt-8">
        {loader ? (
          <SkeletonCard />
        ) : (
          <PicklistTable
            picklistData={picklistData}
            picklistName={picklistName}
            refreshData={refreshData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <AddPicklist
        picklistName={picklistName}
        open={userTypeModal}
        handleClose={() => setUserTypeModal(false)}
        addEmp={(data) => addPicklist(data)}
      />
    </main>
  );
}

export default PicklistComp;
