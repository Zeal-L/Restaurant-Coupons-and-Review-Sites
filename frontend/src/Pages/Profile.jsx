import React from 'react';
import { Context, useContext } from '../context.js';
import {useNavigate} from "react-router-dom";

function Profile() {
    return (
        <>
            <div style={{ height: '64px' }}></div>
            <a>展示用户信息，用户名，用户图片，性别，邮箱，都可以更改，密码不显示，但是也可以更改</a>
        </>
    )
}

export default Profile;