import { Context, useContext } from '../context.js';
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import {
    Box,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import Voucher from "../Components/Voucher";
import DeletePop from '../Components/DeletePop.jsx';

import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import SearchBar from '../Components/searchBar.jsx';

function Vouchers() {
    const { voucherId } = useParams();
    //const [voucherList, setVoucherList] = React.useState([]);
    const [alignment, setAlignment] = React.useState('Menu');

    //setVoucherList([{id: 1, name: "abc"}, {}, {}]);
    const handleAlignment = (event, newAlignment) => {
        console.log(newAlignment);
        if (newAlignment !== null){
            setAlignment(newAlignment);
        }
    };
    const [voucherFilterType, setVoucherFilter] = useState('All'); 
    const [open, setOpen] = useState(false);
    const [deletePopOpen, setDeletePopOpen] = useState(false);
    // const [selectVendor, setSelectVendor] = useState(voucherItems[0]);
    const [isOwner, setIsOwner] = useState(true);
    const handleFilter = (event) => {
        console.log(event.target.value);
        setVoucherFilter(event.target.value);
    }
    const handleDelete = (event) => {
        console.log("aaa")
        setDeletePopOpen(true);
    }
    const voucherItems = [
        {
            id: "1",
            type: "Percentage",
            condition: "Percentage",
            discount: "10% OFF",
            expire: "2023-12-31",
            count: 109,
            description: "this is the description of Percentage voucher.",
            isClaimed: false,
            autoRelease: {
                range: 102,
                count: 10,
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(1, 'year').format('YYYY-MM-DD')
            }
        },
        {
            id: "2",
            type: "CFree",
            condition: "Spend $50 or more",
            discount: "10% OFF",
            expire: "2023-12-31",
            count: 10,
            description: "this is the description of Percentage voucher.",
            isClaimed: true,
        },
        {
            id: "3",
            type: "Free",
            condition: "Spend $50 or more",
            discount: "10% OFF",
            expire: "2023-12-31",
            count: 130,
            description: "this is the description of Percentage voucher.",
            isClaimed: false,
            autoRelease: {
                range: 102,
                count: 10,
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(1, 'year').format('YYYY-MM-DD')
            }
        },
        {
            id: "4",
            type: "CFree",
            condition: "Spend $60 or more",
            discount: "10% OFF",
            expire: "2023-12-31",
            count: 10,
            description: "this is the description of Percentage voucher.",
            isClaimed: false,
        }

    ];
    return (
        <>
            <div style={{ height: '64px' }}></div>
            {/* <a>展示所有的优惠卷, group by 餐厅名，添加搜索与过滤功能，可以删除优惠卷，点击Vouchser可以转让这个Vouchsers，输入目标邮箱转让</a> */}
            <Box
                component="div"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '80px',
                    fontWeight: "500" ,
                    overflow: 'hidden',
                    variant: 'h2',
                }}
            >
            <Typography variant="h3" fontFamily="Helvetica" fontWeight="400" sx={{
                padding: "20px"
            }}>
                Vouchers
            </Typography>
            </Box>
            <Box margin='30px' display="flex" alignItems="center" justifyContent="left">
                <FormControl style={{width: '30%'}}>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={voucherFilterType}
                    label="voucherFilterType"
                    onChange={handleFilter}
                    >
                    <MenuItem value={'Fixed Amount'}>Fixed Amount</MenuItem>
                    <MenuItem value={'Percentage'}>Percentage</MenuItem>
                    <MenuItem value={'Free'}>Free</MenuItem>
                    <MenuItem value={'CFree'}>CFree</MenuItem>
                    <MenuItem value={'All'}>All</MenuItem>
                    </Select>
                </FormControl>
                <SearchBar context={"Search for vouchers"}/>
            </Box>
            <Grid
                container
                rowSpacing={4}
                columnSpacing={2}
                name="listings"
                alignItems="center"
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    marginTop: 1,
                }}
            >
            {voucherItems.map((item) => (
                (voucherFilterType === "All" || item.type === voucherFilterType) &&
                    <Grid item key={item.id}>
                        {isOwner &&
                            <>
                                <IconButton sx={{position: 'relative'}} id="iconButtonS" onClick={()=>{
                                    setDeletePopOpen(true);
                                }}>
                                    <DeleteIcon color="white" />
                                </IconButton>
                            </>
                        }

                        <Voucher
                            type={item.type}
                            condition={item.condition}
                            discount={item.discount}
                            expire={item.expire}
                            disabled={item.isClaimed}
                            isRestaurant={false}
                        />
                    </Grid>
                ))}
            </Grid>
            {deletePopOpen && <DeletePop open = {deletePopOpen} setOpen={setDeletePopOpen}/>}
        </>
    )
}
export default Vouchers;