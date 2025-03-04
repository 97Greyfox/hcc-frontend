import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Edit2Icon, Trash, View } from "lucide-react";
import Swal from "sweetalert2";
import Select from "react-select";
import FilePreviewDrawer from "@/components/Viewer/FilePreviewer";


const ClientFile = ({ open, item }) => {
  const [files, setFiles] = useState([]);
  const [fileCategory, setFileCategory] = useState("");
  const [fileCategoryOpt, setFileCategoryOpt] = useState("");
  const [inputFileCatagory, setInputFileCatagory] = useState("");
  const [note, setNote] = useState("");
  const [loader, setLoader] = useState(false);
  const [clientItem, setClientItem] = useState(item);
  const [attachments, setAttachments] = useState();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editFile, setEditFile] = useState(false);
  const [editAttachments, setEditAttachments] = useState(false);
  const [client, setClient] = useState({});
  const [attachmentId, setAttachmentId] = useState();
  const [fileId, setFileId]= useState();

  const[previewAttachment, setPreviewAttachment] = useState({});
  const[previewObj, setPreviewObj] = useState();
  const [newFileFlag, setNewFileFlag] = useState(false);
  const [ oldFiles, setOldFiles ] = useState([]);
 

  // const [selectedFile, setSelectedFile] = useState(null);

  

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setPreviewOpen(true);
  }
  
  useEffect(() => {
    console.log("####called")
      fileCatagoryOptions();
      axios.get(`${apiPath.prodPath}/api/clients/client/${item._id}`)
      .then((res) => {
        setClientItem(res.data);
        console.log(res.data.attachments)
        setAttachments(res.data.attachments);
      })
      }, [open,loader]);

  
  function fileCatagoryOptions () {
    const fileCategories = ["Invoice", "Contract", "Report", "Others"];
    const options = fileCategories.map((item)=>{
      const statusOption = {
        label : item,
        value : item,
      }
      return statusOption;
    });
    setFileCategoryOpt(options);
  }
  
  const handleFileChange = (e) => {
    if(editAttachments){
      setNewFileFlag(true);
    }
    const selectedFile = e.target.files[0]; 
    setFiles((prevFiles) => [...prevFiles, selectedFile]); 
    console.log(files);
  };
  const handleInputFileCatagory = (newInputValue) => {
    if(editAttachments){
      setNewFileFlag(true);
    }
    setInputFileCatagory(newInputValue); 
  };

  const refreshData = async () => {
    console.log("called")
    setLoader(true);
    setFiles([]);
    setFileCategory("");
    setNote("");
    setOldFiles([]);
    await axios
      .get(`${apiPath.prodPath}/api/clients/client/${item._id}`)
      .then((res) => {
        setClientItem(res.data);
        console.log(res.data.attachments)
        setAttachments(res.data.attachments);
        // setAttachments(clientItem.attachments);
        console.log("attachments", attachments);
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

  const handleUpload = async (e) => {
    e.preventDefault();
    

    if (editAttachments){
      const formData = new FormData();
      console.log(fileCategory.value, " ", note, " ", clientItem.clientName);
      formData.append("attachmentCategories", fileCategory.value);
      
        if (files.length) {
          files.forEach((file) => {
            formData.append("files", file);
          });
          }

      formData.append("date", new Date().toISOString()); 
      formData.append("user", clientItem.clientName);
      formData.append("note", note);

      editFiles(formData);

    }else{
      const formData = new FormData();
      if (!files.length || !fileCategory) {
        alert("Please select files and a category before uploading.");
        return;
      }
  
      console.log("Uploading files:", files);
      console.log("Selected category:", fileCategory);
      
      formData.append("date", new Date().toISOString()); 
      formData.append("user", clientItem.clientName);
      formData.append("note", note);
      formData.append("attachmentCategories", fileCategory.value);
      
      files.forEach((file) => {
        formData.append("files", file);
      });
  
      sendFiles(formData);
      
    }
    
  };

  async function sendFiles(data) {
    console.log('here in send files');
    try {
      const res = await axios.patch(
        `${apiPath.prodPath}/api/clients/addFiles/${clientItem._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      console.log("Upload response:", res);
      await refreshData();
       
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        text: "Something went wrong with sending files",
      });
    }
  }

  async function editFiles(data) {
    console.log('here in edit files');
    for (const pair of data.entries()) {
      console.log(pair[0], pair[1]);
    };
    try {
      const res = await axios.patch(
        `${apiPath.prodPath}/api/clients/editFile/${client._id}&&${attachmentId}&&${fileId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      console.log("Upload response:", res);
      await refreshData();
       
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        text: "Something went wrong with sending files",
      });
    }
  }
  
  const handleDelete = async (i, obj) => {
        const oldFiles = i.files;
        console.log(oldFiles);
      
        try {
          Swal.fire({
            icon: "warning",
            text: "Are you sure you want to delete the Client",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
          }).then(async (result) => {
            if (result.isConfirmed) {
          await axios.patch(
            `${apiPath.prodPath}/api/clients/delFile/${item._id}&&${i._id}&&${obj._id}`, {oldFiles}
          ).then(async (res) => {
                  console.log(res);
                  Swal.fire({
                    icon: "success",
                    text: "File deleted successfully",
                  });
                  await refreshData();
                }).catch((err) => {
                       console.log(err)
                         Swal.fire({
                                   icon: "error",
                                   text: "Something went wrong with the deleting the file",
                                 });
                       });
                      }});

        
        } catch (err) {
          console.log(err);
          Swal.fire({
            icon: "error",
            text: "Something went wrong while deleting the file",
          });
        }
      
    
  };

  async function handleRemove(file) {
       setFiles((prevFiles) =>
            prevFiles.filter((item) => item.name !== file.name)
          );
  }


  // const handleView = async (i, obj) => {
  //   try {
  //     const response = await axios.get(
  //       `${apiPath.devPath}/api/clients/getFile/${item._id}&&${i._id}&&${obj._id}`,
  //       { responseType: "blob" } 
  //     );
  
  //     console.log(response);
  //     const contentType = response.ContentType|| "application/octet-stream";
  //     console.log(response.ContentType);
  //     console.log(response.data);
  
  //     const blob = new Blob([response.data], { type: contentType });
  
  //     const fileURL = window.URL.createObjectURL(blob);
  
  //     window.open(fileURL, "_blank");
  
  //   } catch (err) {
  //     console.error("Error retrieving file:", err);
  //     Swal.fire({
  //       icon: "error",
  //       text: "Something went wrong while retrieving the file.",
  //     });
  //   }
  // };

  const handlePreviewClick = (i, obj) => {
      setPreviewAttachment(i);
      setPreviewObj(obj)
      setPreviewOpen(true);
  }
  
  async function handleDeleteFile(file, attachmentId, fileId, client) {
    // console.log(file);
    try {
      Swal.fire({
          icon: "warning",
          text: "Are you sure you want to delete the Client",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then(async (result) => {
          if (result.isConfirmed) {
        console.log('here');
        await axios.patch(
          `${apiPath.prodPath}/api/clients/delFileByName/${client._id}&&${attachmentId}&&${fileId}`, {file}
        ).then(async (res) => {
                console.log(res);
                
                Swal.fire({
                 icon: "success",
                 text: "File deleted successfully",
                 });
                 await refreshData();
              }).catch((err) => {
                      console.log(err)
                        Swal.fire({
                                  icon: "error",
                                  text: "Something went wrong with the deleting the file",
                                });
                      });
                    }});
    
    setOldFiles((prevFiles) =>
      prevFiles.filter((item) => item !== file)
    );
    
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        text: "Something went wrong with delecting files",
      });
    }
  }
  console.log("this is item", clientItem);
  return (
    <>
      <form
            onSubmit={handleUpload}
            className="flex flex-row flex-wrap gap-2 w-[1000px] h-[200px] items-start"
             >
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-semibold text-xl">Client Files</label>
              <input
                type="file"
                multiple
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                onChange={handleFileChange}
                name="Files"
              />
            </div>
            <div className="flex flex-col gap-4 w-1/4 ">
              <label className="font-semibold text-xl">File Catagory</label>
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
            </div>
            
            <div className="flex flex-col gap-2 w-1/4">
              <label className="font-semibold text-xl">Note</label>
              <input
                type="text"
                value={note}
                className="p-2 bg-transparent border-b-2 border-blue-50 focus-within:outline-none"
                onChange={(e)=> setNote(e.target.value)}
                name="note"
              />
            </div>
              <div className=" w-1/4 h-1/4">
            
              <div >
                <h3 className="font-semibold text-xl">Selected Files:</h3>
                <ul className="list-disc pl-4 text-xl">
                  {files.map((file, index) => (
                    <li key={index}><Button onClick={() => handleRemove(file)} className="w-fit h-30px m-2 bg-gray-400 rounded-xl text-black font-bold">{file.name} <Trash/> </Button></li>
                  ))}
                </ul>
              </div>
              <div >
                <h3 className="font-semibold text-xl">Old File:</h3>
                {editAttachments ? (<ul className="list-disc pl-4 text-xl">
                  {oldFiles.map((file, index) => (
                    <li key={index}><Button  className="w-fit h-30px m-2 bg-gray-400 rounded-xl text-black font-bold">{file} </Button></li>
                  ))}
                </ul>) : null}
              </div>
            
          </div>
          <div className="gap-2 w-1/4 m-3 pb-11 h-[100px]">
              <input
                type="submit"
                className="rounded p-2 w-[50x] h-[38px] bg-white border-b-1 self-end text-black hover:text-white hover:bg-orange-400"
                value={`Upload`}
              />
            </div>
      
          </form>
          {
            loader ? <p>loading</p> :
      <Table>
        <TableCaption>A list of all Client Files</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead style={{ minWidth: 150 }}>File Name</TableHead>
            <TableHead style={{ minWidth: 100 }}>Category</TableHead>
            <TableHead style={{ minWidth: 150 }}>Date</TableHead>
            <TableHead style={{ minWidth: 100 }}>Client</TableHead>
            <TableHead style={{ minWidth: 100 }}>Note</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          { attachments !== undefined && attachments.map((i) =>
            i.files.map((obj) => (
              <TableRow key={obj._id}>
                <TableCell className="font-medium text-#fff">{obj.filename}</TableCell>
                <TableCell className="font-medium text-#fff">{i.attachmentCategories}</TableCell>
                <TableCell className="font-medium text-#fff">{i.date}</TableCell>
                <TableCell className="font-medium text-#fff">{i.user}</TableCell>
                <TableCell className="font-medium text-#fff">{i.note}</TableCell>
                <TableCell className="font-medium text-#fff">
                  <Button
                    onClick={() => handleDelete(i, obj)}
                    className="hover:bg-red-700 text-white"
                  >
                    <Trash />
                  </Button>
                  <Button onClick={() => {
                    setEditAttachments(true);
                    setFileCategory({label : i.attachmentCategories, value:i.attachmentCategories});
                    setOldFiles(() => {
                      let arr = [];
                       arr.push(obj.filename);
                       return arr;
                       });
                    setNote(i.note);
                    setEditFile(false);
                    setClient(item);
                    setAttachmentId(i._id);
                    setFileId(obj._id);
                    } } className="hover:bg-green-700 text-white">
                    <Edit2Icon />
                  </Button>
                  <Button onClick={()=>handlePreviewClick(i, obj)} className="hover:bg-green-700 text-white">
                    <View />
                  </Button>
                  { previewOpen ?
                   <FilePreviewDrawer
                   open={previewOpen}
                   handleClose={() => setPreviewOpen(false)}
                   file={previewObj}
                   i={previewAttachment}
                   item={item}
                   previewOpen = {previewOpen}
                 /> : null
                  }
                </TableCell>
              </TableRow>
            ))
          ) }
        </TableBody>
      </Table>
          }
    </>
  );
};

export default ClientFile;






