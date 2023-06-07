package com.COMP3900Proj;

import com.COMP3900Proj.Database.Database;
import com.COMP3900Proj.Database.UserTable;
import com.COMP3900Proj.User.User;
import com.google.gson.Gson;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;

@RestController
@SpringBootApplication
public class Comp3900ProjApplication {

    private final UserTable userTable;

    @Autowired
    public Comp3900ProjApplication(UserTable userTable) {
        this.userTable = userTable;
    }

    public static void main(String[] args) {
        SpringApplication.run(Comp3900ProjApplication.class, args);
    }

    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

    //	set return type to be a string json in openapi
    @GetMapping("/register")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200",
//                    content = {@Content(mediaType = "application/json",
//                            examples = {@ExampleObject(value = "{\"Username\":\"user1\",\"Id\":\"1\"}")})})
//    })
//    @Operation(summary = "Login with username and password")
    public String register(
            @RequestParam(value = "username") String username,
            @RequestParam(value = "password") String password) {
        User user = new User(username, password);
        userTable.register(username, password);
        return new Gson().toJson(user);
    }

    @GetMapping("/login")
    public String login(
            @RequestParam(value = "username") String username,
            @RequestParam(value = "password") String password) {
        return new Gson().toJson(userTable.login(username, password));
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
