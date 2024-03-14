"use client";

import BasicTabs from "@/components/BasicTabs";
import { Typography, Grid, Button } from "@mui/material";
import styles from "./page.module.css";
import axiosInstance from "../../config/axiosConfig";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post("/logout");
            console.log("Response:", response.data);
            router.push("/");
            router.forward();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Grid>
            <Grid container>
                <Grid item xs={11}>
                    <Typography variant="h4" gutterBottom>
                        Welcome To Your Budget Dashboard!
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Button
                        variant="outlined"
                        className={styles.blackButton}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Grid>
            </Grid>
            <Grid item>
                <BasicTabs></BasicTabs>
            </Grid>
        </Grid>
    );
}
