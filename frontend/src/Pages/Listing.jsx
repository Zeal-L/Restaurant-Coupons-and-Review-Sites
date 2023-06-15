import React from 'react';
import { Context, useContext } from '../context.js';
import {useNavigate} from "react-router-dom";

function Listing() {
    return (
        <>
            <div style={{ height: '64px' }}></div>
            <a>展示所有的餐厅，图片，地址，评分，评论数，还有优惠卷，还有一个收藏按钮，点击收藏</a>
        </>
    )
}

export default Listing;