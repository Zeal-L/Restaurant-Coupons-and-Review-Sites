package com.COMP3900Proj.ApiFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiUser {
    private String username;
    private String email;
    private String gender;
    private String password;

    public ApiUser(String username, String email, String gender, String password) {
        this.username = username;
        this.email = email;
        this.gender = gender;
        this.password = password;
    }

    @Override
    public String toString() {
        return "ApiUser{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", gender='" + gender + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
