package com.COMP3900Proj;

import com.COMP3900Proj.ApiFormat.ApiUser;
import com.COMP3900Proj.Controller.UserController;
import com.COMP3900Proj.Database.Database;
import com.COMP3900Proj.Database.UserTable;
import com.COMP3900Proj.Errors.DataBaseError;
import com.COMP3900Proj.Errors.UserError;
import com.COMP3900Proj.User.User;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;

@RestController
@SpringBootApplication
public class Comp3900ProjApplication {

    private final UserController userController;

    @Autowired
    public Comp3900ProjApplication(UserController userController) {
        this.userController = userController;
    }

    public static void main(String[] args) {
        SpringApplication.run(Comp3900ProjApplication.class, args);
    }

    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

    //	set return type to be a string json in openapi
//    @GetMapping("/register", produces = "application/json")
    @PostMapping( value = "/register", produces = "application/json")
    public ResponseEntity<String> register(
            @RequestBody()
            @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true,
                    description = "User information in json format",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiUser.class)
                    )
            )
            ApiUser userINfo) {
        try {
            userController.register(userINfo);
        } catch (UserError e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (DataBaseError e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
        return ResponseEntity.ok().body(userINfo.getGender());
    }

    @GetMapping("/login")
    public ResponseEntity<String> login(
            @RequestParam(value = "username") String username,
            @RequestParam(value = "password") String password) {
//        TODO: implement login
        String token = User.Login(username, password);
        if (token == null){
            return ResponseEntity.status(500).body("Error logging in");
        }
        return ResponseEntity.ok().body(new Gson().toJson(new HashMap<String, String>() {{
            put("token", token);
        }}));
    }



    @GetMapping(value = "/qr")
    public ResponseEntity<String> qrCode(@RequestParam(value = "id") @NonNull String username) {
        try {
            BufferedImage qrImage = generateQRCode(username);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(qrImage, "png", baos);
            byte[] imageBytes = baos.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            HashMap<String, String> map = new HashMap<>();
            map.put("qr", base64Image);
            return ResponseEntity.ok().body(new Gson().toJson(map));
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(500).body("Error generating QR code");
        }
    }

    private BufferedImage generateQRCode(String username) throws WriterException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(username, BarcodeFormat.QR_CODE, 200, 200);
        return MatrixToImageWriter.toBufferedImage(bitMatrix);
    }

}
