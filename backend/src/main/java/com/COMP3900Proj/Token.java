package com.COMP3900Proj;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;

import java.security.SecureRandom;
import java.util.Base64;

public class Token{
    @SerializedName("Token")
    @Getter
    private String token;

    public Token(String token) {
        this.token = token;
    }

    public static Token GanerateToken(Integer useId){
//        generate a random token with given userid
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[24];
        random.nextBytes(bytes);
        String token = Base64.getEncoder().encodeToString(bytes);
        return new Token(token);
    }
}
