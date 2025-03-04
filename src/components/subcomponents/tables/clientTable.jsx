import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,

  
} from "@/components/ui/table";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,


} from "@/components/ui/dropdown-menu";
import moment from "moment";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";
import AddEmployee from "../drawers/employeeAdd";
import React, { useState } from "react";
//import EmployeeDetails from "../drawers/empOpen.jsx";
import AddCLient from "../drawers/addClient";
import ClientDetails from "../drawers/clientOpen";
import Pagination from "@mui/material/Pagination";

function EmployeeTable({ allEmp, refreshData }) {
  const [empModal, setEmpModal] = useState(false);
  const [empId, setEmpId] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; 
  
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allEmp.slice(indexOfFirstItem, indexOfLastItem);
  
    const handlePageChange = (event, page) => {
      setCurrentPage(page);
    };

  const handleEdit = (item) => {
    setEmpId(item._id);
    setEmpModal(true);
  };
  const handleOpenModal = (item) => {
    setEmpId(item._id);
    setOpenModal(true);
  };
  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      text: "Are you sure you want to delete the Client",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${apiPath.prodPath}/api/clients/delete/${id}`)
          .then((res) => {
            refreshData();
          })
          .catch((err) => console.log(err));
      }
    });
  };
  const editEmp = (data) => {
    axios
      .put(`${apiPath.prodPath}/api/clients/edit/${empId}`, data)
      .then((res) => {
        console.log(res);
        refreshData();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      {allEmp.length ? (
        <>
        <Table>
          <TableCaption>A list of all Clients</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Actions</TableHead>
              <TableHead style={{ minWidth: 150 }}>Name</TableHead>
              <TableHead style={{ minWidth: 100 }}>Primary Contact</TableHead>
              <TableHead style={{ minWidth: 150 }}>Email</TableHead>
              <TableHead style={{ minWidth: 100 }}>Created At</TableHead>
              <TableHead style={{ minWidth: 100 }}>Phone</TableHead>
              <TableHead style={{ minWidth: 100 }}>Cell</TableHead>
              <TableHead style={{ minWidth: 150 }}>Address 1</TableHead>
              <TableHead style={{ minWidth: 150 }}>Address 2</TableHead>
              <TableHead style={{ minWidth: 100 }}>City</TableHead>
              <TableHead style={{ minWidth: 100 }}>State</TableHead>
              <TableHead style={{ minWidth: 100 }}>ZipCode</TableHead>
              <TableHead style={{ minWidth: 100 }}>Website</TableHead>
              <TableHead style={{ minWidth: 100 }}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((i) => {
              return (
                <TableRow key={i._id}>
                  <TableCell className="font-medium text-#fff">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenModal(i)}>
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(i)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(i._id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.clientName}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.primaryContact}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.email}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {moment(i.createdAt).format("MM-DD-YYYY")}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.phone == "" ? "" : i.phone}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.cell == "" ? "" : i.cell}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.address1}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.address2}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.city}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.state}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.zipCode}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.websiteAddress}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.status}
                  </TableCell>
                  {empModal && empId == i._id ? (
                    <AddCLient
                      open={empModal}
                      handleClose={() => setEmpModal(false)}
                      addEmp={(data) => addEmp(data)}
                      edit={true}
                      editData={i}
                      editEmp={editEmp}
                    />
                  ) : null}
                  {openModal && empId == i._id ? (
                    <ClientDetails
                      open={openModal}
                      handleClose={() => setOpenModal(false)}
                      item={i}
                      refreshData = {refreshData}
                    />
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Pagination
                    count={Math.ceil(allEmp.length / itemsPerPage)} 
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{
                      marginTop: "20px",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "10px",
                      backgroundColor: "#333",
                      ".MuiPaginationItem-root": {
                        color: "white",
                      },
                      ".MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: "#555",
                        color: "white",
                      },
                    }}
                  />
                  </>
      ) : (
        <p className="text-xl">No Client Data found</p>
      )}
    </div>
  );
}

export default EmployeeTable;
