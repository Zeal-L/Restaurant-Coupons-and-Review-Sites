//
//  SignUpPage.swift
//  Donut
//
//  Created by 张文谦 on 12/6/2023.
//

import SwiftUI

struct SignUpPage: View {
    @State private var email = ""
    @State private var username = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var gender = "Other"
    
    @State private var UsernameError = false
    @State private var EmailError = false
    @State private var PsError = false
    @State private var CpsError = false
    
    var body: some View {
        VStack {
            Image("AppLogo")
                .resizable()
                .frame(width: 150, height: 150) // 添加您的登录页面Logo图片
            Text("Welcome to Donut!") // 登录页面的欢迎文本
                .font(.title)
                .fontWeight(.bold)
            
            VStack{
                InputBox(
                    isError: $UsernameError,
                    text: $username,
                    placeholder: "Username")
                    .padding(.horizontal)
                
                HStack{
                    Text("* The name length must between 3 and 10")
                        .font(.caption)
                        .multilineTextAlignment(.leading)
                        .foregroundColor(UsernameError ? .red : .clear)
                    Spacer()
                }
                .padding(.horizontal)
                InputBox(isError: $EmailError, text: $email, placeholder: "Email")
                    .keyboardType(.emailAddress)
                    .padding(.horizontal)
                
                HStack{
                    Text("* Email format is invalid")
                        .font(.caption)
                        .multilineTextAlignment(.leading)
                        .foregroundColor(UsernameError ? .red : .clear)
                    Spacer()
                }
                .padding(.horizontal)
                
                InputBox(isError: $PsError, text: $password, placeholder: "Password")
                    .padding(.horizontal)
                
                PassWordStrength(passWord: $password)
                    .padding(.horizontal)
                
                InputBox(isError: $CpsError, text: $confirmPassword, placeholder: "Confirm Password")
                    .padding(.horizontal)
                
                HStack{
                    Text("* Password dose not match")
                        .font(.caption)
                        .multilineTextAlignment(.leading)
                        .foregroundColor(UsernameError ? .red : .clear)
                    Spacer()
                }
                .padding(.horizontal)
                
                Picker("Gender", selection: $gender) {
                    Text("Male").tag("Male")
                    Text("Female").tag("Female")
                    Text("Other").tag("Other")
                }
                .pickerStyle(SegmentedPickerStyle())
                .padding(.horizontal)
                
                
            }
            
            Button(action: {
                if(validateForm()){
                    
                }
            }) {
                Text("Sign Up")
                    .font(.callout)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(.brown)
                    .frame(height: 40)
            }
            .cornerRadius(10)
            .padding()
            Spacer()
        }
        .padding()
        .background(theme_color, ignoresSafeAreaEdges: Edge.Set.all)
    }
    
    
    struct PassWordStrength : View {
        @Binding var passWord:String
        var body: some View {
            HStack{
                VStack(alignment: .leading){
                Label(
                    title: { Text("Minimum length 8")
                        .font(.caption) },
                    icon: {
                        Image(systemName: passWord.count >= 8 ? "checkmark" : "xmark")
                    }
                )
                .foregroundColor(passWord.count >= 8 ? .green : .red)
                Label(
                    title: { Text("Contains a capital letter").font(.caption) },
                    icon: {
                        Image(systemName: passWord.rangeOfCharacter(from: .uppercaseLetters) != nil ?
                              "checkmark" : "xmark")
                    }
                )
                .foregroundColor((passWord.rangeOfCharacter(from: .uppercaseLetters) != nil) ? .green : .red)
                Label(
                    title: { Text("Contains a lowercase letter").font(.caption) },
                    icon: {
                        Image(systemName: passWord.rangeOfCharacter(from: .lowercaseLetters) != nil ?
                              "checkmark" : "xmark")
                    }
                )
                .foregroundColor((passWord.rangeOfCharacter(from: .lowercaseLetters) != nil) ? .green : .red)
                
                Label(
                    title: { Text("Contains a number").font(.caption) },
                    icon: {
                        Image(systemName: passWord.rangeOfCharacter(from: .decimalDigits) != nil ?
                              "checkmark" : "xmark")
                    }).foregroundColor((passWord.rangeOfCharacter(from: .decimalDigits) != nil) ? .green : .red)
                
            }
                Spacer()
            }
        }
        
        
    }
    
    private func validateEmail() -> Bool {
        // 验证邮箱是否符合要求
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    private func validatePassword() -> Bool {
        // 验证密码是否符合要求
        let passwordRegex = "(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}"
        let passwordPredicate = NSPredicate(format: "SELF MATCHES %@", passwordRegex)
        return passwordPredicate.evaluate(with: password)
    }

    private func validateForm() -> Bool {
        var valid = true
        
        // 验证表单是否符合要求
        if(username.count < 3 || username.count > 13) {
            UsernameError = true
            valid = false
        }
    
        if(!validateEmail()) {
            EmailError = true
            valid = false
        }
        
        if(!validatePassword()) {
            PsError = true
            CpsError = true
            valid = false
        }
        
        if(password != confirmPassword) {
            CpsError = true
            valid = false
        }
        
        return valid
    }
    
    
    
    //    private func validatePassword() -> Bool {
    //        // 验证密码是否符合要求
    //        let passwordRegex = "(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}"
    //        let passwordPredicate = NSPredicate(format: "SELF MATCHES %@", passwordRegex)
    //        return passwordPredicate.evaluate(with: password)
    //    }
}

#Preview {
    SignUpPage()
}
