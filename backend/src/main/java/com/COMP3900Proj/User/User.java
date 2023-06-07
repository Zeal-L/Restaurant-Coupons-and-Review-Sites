package com.COMP3900Proj.User;

import com.google.gson.annotations.SerializedName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

public class User {

    @SerializedName("Username")
    @Getter
    @Setter
    private String username;

    @SerializedName("Id")
    @Getter
    private String id;
    private transient String password;
    public User(@NonNull String username, @NonNull String id) {
        this.username = username;
        this.id = id;
        password = "";
    }
}
