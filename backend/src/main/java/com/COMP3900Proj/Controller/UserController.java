package com.COMP3900Proj.Controller;

import com.COMP3900Proj.ApiFormat.ApiUser;
import com.COMP3900Proj.Database.UserTable;
import com.COMP3900Proj.Errors.DataBaseError;
import com.COMP3900Proj.Errors.UserError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    private final UserTable userTable;
    @Autowired
    public UserController(UserTable userTable) {
        this.userTable = userTable;
    }


    public String register(ApiUser user) throws UserError, DataBaseError {
        // TODO
//        check if password is valid
        if (checkPassword(user.getPassword())) {
            throw new UserError("Password is not valid");
        }
        if (!emailValid(user.getEmail())) {
            throw new UserError("Email is not valid");
        }
        userTable.register(user);
        return null;
    }

    private static Boolean checkPassword(String password){
        return password.length() >= 8 || !password.matches(".*[0-9].*") || !password.matches(".*[a-z].*") || !password.matches(".*[A-Z].*");
    }

    private static Boolean emailValid(String email){
        return email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }

}
