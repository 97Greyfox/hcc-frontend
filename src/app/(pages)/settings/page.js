"use client";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import React, { useState, useEffect } from "react";
import PicklistComp from "@/components/picklistComp";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/store";



function SettingsPage() {
  const [value, setValue] = useState("User Type");
  const isUserLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

useEffect(() => {
  if (!hasHydrated) return; 

  if (!isUserLoggedIn) {
    router.push("/login");
  }
}, [isUserLoggedIn, hasHydrated]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <main>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", color: "#fff" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="User Type" value="User Type" />
              <Tab label="Zip Code" value="Zip Code" />
              <Tab label="Territory" value="Territory" />
            </TabList>
          </Box>
          <TabPanel value="User Type">
            <PicklistComp picklistName={"User Type"} />
          </TabPanel>
          <TabPanel value="Zip Code">
            <PicklistComp picklistName={"Zip Code"} />
          </TabPanel>
          <TabPanel value="Territory">
            <PicklistComp picklistName={"Territory"} />
          </TabPanel>
        </TabContext>
      </Box>
    </main>
  );
}

export default SettingsPage;
