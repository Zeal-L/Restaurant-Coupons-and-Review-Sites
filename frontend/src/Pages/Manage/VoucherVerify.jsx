import React, {useContext, useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {Button, Grid, InputBase, Paper} from "@mui/material";
import {CallApiWithToken} from "../../CallApi";
import {Context, NotificationType} from "../../context";
import VoucherInfoPop from "../../Components/VoucherInfoPop";

export default function VoucherVerify() {
  const {getter, setter} = useContext(Context);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState({ page: 1, pageSize: 10 });
  const [totalPages, setTotalPages] = useState(0);
  const [inputCode, setInputCode] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupId, setPopupId] = useState(-1);
  const [totalData, setTotalData] = useState(0);

  const loadHistory = () => {
    setLoading(true);
    const startIndex = (page.page-1) * page.pageSize;
    const endIndex = startIndex + page.pageSize;
    CallApiWithToken(`/vouchers/get/verified_voucher_list/by_restaurant/${startIndex}/${endIndex}`, "GET").then((res) => {
      if (res.status === 200) {
        const NewData = [];
        for (let i = 0; i < res.data.info.length; i++) {
          NewData.push({
            id: res.data.info[i].voucher_id,
            userId: res.data.info[i].owner_id,
            time: Date(res.data.info[i].code_time * 1000),
            voucher: res.data.info[i].template_id
          })
        }
        setData(data => [...data, ...NewData]);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    // /vouchers/get/verified_voucher_list/count/by_restaurant
    CallApiWithToken(`/vouchers/get/verified_voucher_list/count/by_restaurant`, "GET").then((res) => {
        if (res.status === 200) {
            setTotalData(res.data.count);
            setTotalPages(Math.ceil(res.data.count / page.pageSize));
        } else {
            setter.showNotification(res.data.message, NotificationType.Error);
        }
    })
  }, [data]);
  const verify = () => {
    CallApiWithToken(`/vouchers/verify/${inputCode}`, "POST").then((res) => {
        if (res.status === 200) {
          setter.showNotification(res.data.message, NotificationType.Success);
          setInputCode("");
          setPopupId(res.data.template_id);
          setPopupOpen(true);
          loadHistory();
        } else {
          setter.showNotification(res.data.message, NotificationType.Error);
        }
    })
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setLoading(true);
    const startIndex = (newPage.page) * newPage.pageSize;
    const endIndex = startIndex + newPage.pageSize;
    CallApiWithToken(`/vouchers/get/verified_voucher_list/by_restaurant/${startIndex}/${endIndex}`, "GET").then((res) => {
      if (res.status === 200) {
        const NewData = [];
        for (let i = 0; i < res.data.info.length; i++) {
          NewData.push({
            id: res.data.info[i].voucher_id,
            userId: res.data.info[i].owner_id,
            time: Date(res.data.info[i].code_time * 1000),
            voucher: res.data.info[i].template_id
          })
        }
        setData(NewData);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
      setLoading(false);
    });
  };

  const columns = [
    {field: "id", headerName: "ID", width: 120, sortable: true},
    {
      field: "userId",
      headerName: "userId",
      type: "number",
      width: 150,
      sortable: true,
    },
    {
      field: "time",
      headerName: "Time",
      type: "time",
      width: 300,
      sortable: true,
    },
    {
      field: "voucher",
      headerName: "voucher",
      type: "number",
      sortable: true,
      width: 160,
    },

  ];

  return (
    <>
      <div style={{height: "70px"}}></div>
      <Grid container direction="column" alignItems="center" justifyContent="center" style={{minHeight: "20vh"}}>
        <Grid item xs={3}>
          <Paper
            component="form"
            sx={{p: "2px 4px", display: "flex", alignItems: "center", width: 400}}
          >
            <InputBase
              sx={{ml: 1, flex: 1}}
              placeholder="Enter Voucher Code"
              inputProps={{"aria-label": "Enter Voucher Code"}}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <Button variant="text"
                    onClick={verify}
            >Verify</Button>
          </Paper>
        </Grid>
      </Grid>
      <div style={{height: 400, padding: "20px"}}>
        <DataGrid
          rows={data}
          columns={columns}
          loading={loading}
          pagination
          rowCount={totalData}
          paginationMode="server"
          onPaginationModelChange={handlePageChange}
          paginationModel={page}
        />
      </div>
      {popupId !== -1 &&
      <VoucherInfoPop
        open={popupOpen}
        setOpen={setPopupOpen}
        id={popupId}
        isRestaurant={true}
        used={true}
      />
      }
    </>
  );
}

function getTime(time) {
  const date = new Date(time);
  return date.toLocaleString();
}
