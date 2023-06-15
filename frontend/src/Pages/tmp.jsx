import React, { useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import TextField from '@mui/material/TextField';
import { styles } from '../styles.js';

const Tmp = () => {
    const [showPassword, setShowPassword] = useState(true);

    const handleDelete = () => {
        setShowPassword(false);
    };

    return (
        <>
            <TransitionGroup>
                {showPassword && (
                    <CSSTransition classNames="fade" timeout={300}>
                        <TextField
                            id="Cpassword"
                            label="Confirm Password"
                            variant="outlined"
                            type="password"
                            name="Cpassword"
                            sx={styles.sameWidth}
                            required
                        />
                    </CSSTransition>
                )}
            </TransitionGroup>
            <button onClick={handleDelete}>删除</button>
        </>
)};

export default Tmp;
