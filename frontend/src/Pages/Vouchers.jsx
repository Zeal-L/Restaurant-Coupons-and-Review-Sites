import React from 'react';
import { Context, useContext } from '../context.js';
import {useNavigate} from "react-router-dom";

function Vouchsers() {
    return (
        <>
            <div style={{ height: '64px' }}></div>
            <a>展示所有的优惠卷, group by 餐厅名，添加搜索与过滤功能，可以删除优惠卷，点击Vouchser可以转让这个Vouchsers，输入目标邮箱转让</a>
        </>
    )
}

export default Vouchsers;