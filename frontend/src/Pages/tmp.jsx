import React, {useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {Button, Grid, InputBase, Paper} from "@mui/material";

export default function Tmp() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 100; // 每页加载的数据条数

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    // 模拟异步加载数据的过程
    setTimeout(() => {
      // 假设从服务器获取数据的逻辑在这里
      const newData = [];


      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;


      for (let i = startIndex; i < endIndex; i++) {
        newData.push({id: i + 1, userId: i + 1, time: getTime(Date.now() + i * 24 * 60 * 60 * 1000), voucher: i + 1});
      }

      // 更新数据和总页数
      setData(newData);
      setTotalPages(Math.ceil(1000 / pageSize)); // 假设总共有1000条数据

      setLoading(false);
    }, 500); // 假设加载数据的延迟为500毫秒
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
      width: 200,
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
            />
            <Button variant="text">Verify</Button>
          </Paper>
        </Grid>
      </Grid>
      <div style={{height: 400, padding: "20px"}}>
        <DataGrid
          rows={data}
          columns={columns}
          loading={loading}
          pagination
          pageSize={pageSize}
          rowCount={1000} // 假设总共有1000条数据
          paginationMode="server"
          onPageChange={handlePageChange}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}

function getTime(time) {
  const date = new Date(time);
  return date.toLocaleString();
}
