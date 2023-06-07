package com.COMP3900Proj;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

public class JWT {
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static String HashPassword(String password, String token) {
//        TODO
        return Jwts.builder()
                .setSubject(password)
                .signWith(key)
                .compact();
    }
    private static String GetPassword(String hashedPassword, String token) {
//        TODO
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(hashedPassword)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }

}
