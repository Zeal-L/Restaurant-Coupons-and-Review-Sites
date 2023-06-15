import React from 'react';
import { Context, useContext } from '../context.js';
import {useNavigate, useParams} from "react-router-dom";

function Restaurant() {
    const { restaurantId } = useParams();
    return (
        <>
            <div style={{ height: '64px' }}></div>
            <a>restaurantId: {restaurantId}</a>
            <a>展示餐厅的详细信息，菜单，每个菜单都有图片，还有所有评论，(（每一个评论应当包括打分，发表人，评论内容，发表日期，图片), 可以发表评论，包括上述内容，图片应该添加大小限制，不能超过2
                mb，最多3张图片)

                还有和这个餐厅所有的优惠卷，
                如果是自己的餐厅，在优惠卷中应该添加，添加优惠卷的功能，在菜单中应该添加添加菜单的功能

                优惠卷和菜单应该都是分开的页面，自己去App.js中添加路由，然后在这里添加链接，点击链接跳转到相应的页面,或者做成字页面
            </a>
        </>
    )
}

export default Restaurant;