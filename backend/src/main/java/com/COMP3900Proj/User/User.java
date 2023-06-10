package com.COMP3900Proj.User;

import com.COMP3900Proj.ApiFormat.ApiUser;
import com.COMP3900Proj.Database.UserTable;
import com.COMP3900Proj.Errors.DataBaseError;
import com.COMP3900Proj.Errors.UserError;
import com.google.gson.annotations.SerializedName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.stereotype.Component;

public class User {
    @SerializedName("Username")
    @Getter
    @Setter
    private String username;

    @Getter
    @Setter
    private String email;

    @Getter
    @Setter
    private String gender;

    public User(String username, String email, String gender) {
        this.username = username;
        this.email = email;
        this.gender = gender;
    }

    public static String Login(String email, String password) {
        // TODO
        return null;
    }

}
