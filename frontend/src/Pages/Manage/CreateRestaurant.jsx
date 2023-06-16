import React from 'react';
import { Context, useContext } from '../../context.js';
import {useNavigate} from "react-router-dom";
import { ReactComponent as voucherIcon } from '../../Resource/voucher.svg';
function CreateRestaurant() {
    return (
        <>
            <div style={{ height: '64px' }}></div>
            <a>创建餐厅，输入地址，餐厅名，餐厅主要图片（一张），如果这个user已经有餐厅了，那么不可以访问这个页面，直接导航到http://localhost:3000</a>
            <a>
                可以添加菜单，
            </a>
        </>
    )
}

export default CreateRestaurant;