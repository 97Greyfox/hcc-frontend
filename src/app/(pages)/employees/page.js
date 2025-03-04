"use client";
import EmployeeTable from "@/components/subcomponents/tables/employeeTable";
import { Button } from "@/components/ui/button";
import { apiPath } from "@/utils/routes";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Swal from "sweetalert2";
import { SkeletonCard } from "@/components/reusable/skeleton-card";
import AddEmployee from "@/components/subcomponents/drawers/employeeAdd";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Search } from "lucide-react";
import useAuthStore from "@/store/store";





function EmployeePage() {
  const [allEmp, setAllEmp] = useState([]);
  const [loader, setLoader] = useState(false);
  const [empModal, setEmpModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");
  // const [sorts, setSorts] = useState(false);
  const [filterOpt, setFilterOpt] = useState([]);
  // const [inputFilterValue, setInputFilterValue] = useState("");


  
  // const handleSearchChange = (e) =>  {
  //   setSearchTerm(e.target.value)
  // };
  // const handleFilterChange = (value) => setFilterBy(value);

  // const handleInputFilterChange = (newInputValue) => {
  //   setInputFilterValue(newInputValue); 
  // };


  function filterOptions() {
    const sorts = [
    'Name',
    'role',
    // 'zipCode',
    // 'phone',
    // 'email',
    // 'username',
    'city',
    'state',];
    const options = sorts.map((item)=>{
      const statusOption = {
        label : item,
        value : item,
      }
      return statusOption;
    });
    setFilterOpt(options);
  }

  const isUserLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

useEffect(() => {
  if (!hasHydrated) return; 

  if (!isUserLoggedIn) {
    router.push("/login");
  }
}, [isUserLoggedIn, hasHydrated]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!filterBy || !searchTerm.trim()) {
      Swal.fire({
        icon: "warning",
        text: "Please select a filter and enter a search term.",
      });
      return;
    }

    setLoader(true);
    try {
      const res = await axios.get(
        `${apiPath.prodPath}/api/users/user/?${filterBy.value}=${searchTerm}`
      );
      setAllEmp(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        text: "Something went wrong while fetching search results.",
      });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    filterOptions();
      axios
      .get(`${apiPath.prodPath}/api/users/allusers`)
      .then((res) => {
        setAllEmp(res.data);
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
    
  }, []);
  const handleEmpModal = () => {
    setEmpModal(true);
  };
  const refreshData = () => {
    setLoader(true);
    axios
      .get(`${apiPath.prodPath}/api/users/allusers`)
      .then((res) => {
        setAllEmp(res.data);
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
  const addEmp = (data) => {
    axios
      .post(`${apiPath.prodPath}/api/users/signup`, data)
      .then((res) => {
        Swal.fire({
          icon: "success",
          text: "Added Successfully",
        });
        setEmpModal(false);
        refreshData();
      })
      .catch((err) => {
        setEmpModal(false);
        Swal.fire({
          icon: "error",
          text: `${err.message}`,
        });
      });
  };
  return (
    <main className="flex flex-col">
      <div className="flex w-full flex-row flex-wrap justify-between">
        <div className="w-1/4">
          <h1 className="font-semibold text-2xl pb-3">Employees</h1>
        </div>
        <div className="w-3/4 flex flex-row gap-5 justify-end">
          <Button
            onClick={handleEmpModal}
            variant="outline"
            className="bg-transparent"
          >
            <AddIcon /> Employee
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
      </div>
      <div className="mt-10">
        {loader ? (
          <SkeletonCard />
        ) : (
          <EmployeeTable refreshData={refreshData} allEmp={allEmp} />
        )}
      </div>
      <AddEmployee
        open={empModal}
        handleClose={() => setEmpModal(false)}
        addEmp={(data) => addEmp(data)}
        edit={false}
      />
    </main>
  );
}

export default EmployeePage;
