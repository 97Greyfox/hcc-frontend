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
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import AddPicklist from "../drawers/picklist";
import { apiPath } from "@/utils/routes";
import axios from "axios";
import Swal from "sweetalert2";
import { color } from "@mui/system";

function PicklistTable({ picklistData, picklistName, refreshData, currentPage, totalPages, onPageChange, }) {
  const [addModal, setAddModal] = useState(false);
  const [id, setId] = useState("");
  const [item, setItem] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 8;
  console.log(picklistData);
  // const handlePageChange = (event, page) => {
  //   setCurrentPage(page);
  // };

  const handleEdit = (item) => {
    setAddModal(true);
    setId(item._id);
    setItem(item);
  };

  const handleEditPicklist = (data) => {
    let url = "";
    if (picklistName === "Zip Code") {
      url = `${apiPath.prodPath}/api/picklist/zipcodes/modifyzipcode/${id}`;
    }
    if (picklistName === "User Type") {
      url = `${apiPath.prodPath}/api/picklist/userTypes/modifyusertype/${id}`;
    }
    if (picklistName === "Territory") {
      url = `${apiPath.prodPath}/api/picklist/territory/modifyterritory/${id}`;
    }
    axios
      .patch(url, data)
      .then(() => {
        setAddModal(false);
        Swal.fire({
          icon: "success",
          text: "Edited Successfully",
        });
        refreshData();
      })
      .catch(() => {
        setAddModal(false);
        Swal.fire({
          icon: "error",
          text: "Cannot Edit",
        });
        refreshData();
      });
  };

  const handleDelete = (item) => {
    let url = "";
    if (picklistName === "Zip Code") {
      url = `${apiPath.prodPath}/api/picklist/zipcodes/deletezipcode/${item._id}`;
    }
    if (picklistName === "User Type") {
      url = `${apiPath.prodPath}/api/picklist/userTypes/deleteusertype/${item._id}`;
    }
    if (picklistName === "Territory") {
      url = `${apiPath.prodPath}/api/picklist/territory/deleteterritory/${item._id}`;
    }

    Swal.fire({
      icon: "warning",
      text: `Are you sure you want to delete ${picklistName}`,
      showCancelButton: true,
      cancelButtonText: "No",
      showConfirmButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(url)
          .then(() => {
            refreshData();
          })
          .catch((err) => console.log(err));
      }
    });
  };

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = picklistData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      {picklistData.length ? (
        <>
          <Table>
            <TableCaption>A list of all {picklistName}.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Actions</TableHead>
                {picklistName === "Zip Code" && (
                  <>
                    <TableHead style={{ minWidth: 150 }}>Zip Code</TableHead>
                    <TableHead style={{ minWidth: 100 }}>City</TableHead>
                    <TableHead style={{ minWidth: 100 }}>State</TableHead>
                  </>
                )}
                {picklistName === "User Type" && (
                  <>
                    <TableHead style={{ minWidth: 150 }}>Name</TableHead>
                    <TableHead style={{ minWidth: 100 }}>Short Code</TableHead>
                  </>
                )}
                {picklistName === "Territory" && (
                  <>
                    <TableHead style={{ minWidth: 150 }}>Territory Name</TableHead>
                    <TableHead style={{ minWidth: 100 }}>Zipcodes</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {picklistData.map((i) => (
                <TableRow key={i._id}>
                  <TableCell className="font-medium text-#fff">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(i)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(i)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  {picklistName === "Zip Code" && (
                    <>
                      <TableCell className="font-medium text-#fff">
                        {i.zipCode}
                      </TableCell>
                      <TableCell className="font-medium text-#fff">
                        {i.city}
                      </TableCell>
                      <TableCell className="font-medium text-#fff">
                        {i.state}
                      </TableCell>
                    </>
                  )}
                  {picklistName === "User Type" && (
                    <>
                      <TableCell className="font-medium text-#fff">
                        {i.userTypeCategory}
                      </TableCell>
                      <TableCell className="font-medium text-#fff">
                        {i.userTypeFlag}
                      </TableCell>
                    </>
                  )}
                  {picklistName === "Territory" && (
                    <>
                      <TableCell className="font-medium text-#fff">
                        {i.territoryName}
                      </TableCell>
                      <TableCell className="font-medium text-#fff">
                        {i.territoryState.map((item) => item + ", ")}
                      </TableCell>
                    </>
                  )}
                  {id === i._id && addModal && (
                    <AddPicklist
                      edit={true}
                      editData={i}
                      picklistName={picklistName}
                      open={addModal}
                      handleClose={() => setAddModal(false)}
                      editPicklist={handleEditPicklist}
                    />
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
              <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            sx={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              borderRadius: "20px", 
              backgroundColor: "#333", 
               
              ".MuiPaginationItem-root": {
                color: "white", 
              },
              ".MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#555", 
                color: "white", 
              },
              ".MuiPaginationItem-root:hover": {
                backgroundColor: "#444", 
              },
            }}
          />

        </>
      ) : (
        <p className="text-xl">No {picklistName} Data found</p>
      )}
    </div>
  );
}

export default PicklistTable;

