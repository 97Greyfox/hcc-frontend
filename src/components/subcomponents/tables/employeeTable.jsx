import React, { useState } from "react";
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
import EmployeeDetails from "../drawers/empOpen.jsx";
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
      text: "Are you sure you want to delete the User",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${apiPath.prodPath}/api/users/delete/${id}`)
          .then((res) => {
            refreshData();
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const editEmp = (data) => {
    axios
      .put(`${apiPath.prodPath}/api/users/modify/${empId}`, data)
      .then((res) => {
        refreshData();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {allEmp.length ? (
        <>
          <Table>
            <TableCaption>A list of all Employees.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Actions</TableHead>
                <TableHead style={{ minWidth: 150 }}>Name</TableHead>
                <TableHead style={{ minWidth: 100 }}>User Type</TableHead>
                <TableHead style={{ minWidth: 150 }}>Email</TableHead>
                <TableHead style={{ minWidth: 100 }}>Created At</TableHead>
                <TableHead style={{ minWidth: 100 }}>Phone</TableHead>
                <TableHead style={{ minWidth: 100 }}>Cell</TableHead>
                <TableHead style={{ minWidth: 150 }}>Address 1</TableHead>
                <TableHead style={{ minWidth: 150 }}>Address 2</TableHead>
                <TableHead style={{ minWidth: 100 }}>City</TableHead>
                <TableHead style={{ minWidth: 100 }}>State</TableHead>
                <TableHead style={{ minWidth: 100 }}>ZipCode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((i) => (
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
                    {i.firstName} {i.secondName}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.role}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.email}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {moment(i.createdAt).format("MM-DD-YYYY")}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.phone || ""}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.cell || ""}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.address1}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">
                    {i.address2}
                  </TableCell>
                  <TableCell className="font-medium text-#fff">{i.city}</TableCell>
                  <TableCell className="font-medium text-#fff">{i.state}</TableCell>
                  <TableCell className="font-medium text-#fff">{i.zipCode}</TableCell>
                  {empModal && empId === i._id && (
                    <AddEmployee
                      open={empModal}
                      handleClose={() => setEmpModal(false)}
                      addEmp={(data) => addEmp(data)}
                      edit={true}
                      editData={i}
                      editEmp={editEmp}
                    />
                  )}
                  {openModal && empId === i._id && (
                    <EmployeeDetails
                      open={openModal}
                      handleClose={() => setOpenModal(false)}
                      item={i}
                    />
                  )}
                </TableRow>
              ))}
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
        <p className="text-xl">No Employee Data found</p>
      )}
    </div>
  );
}

export default EmployeeTable;

