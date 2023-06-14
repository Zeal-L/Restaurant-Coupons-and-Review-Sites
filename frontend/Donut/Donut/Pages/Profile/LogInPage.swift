//
//  LogInPage.swift
//  Donut
//
//  Created by 张文谦 on 12/6/2023.
//

import SwiftUI
import AuthenticationServices

struct LogInPage: View {
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>
    
    @State private var email = ""
    @State private var password = ""
    var body: some View {
        VStack {
            Image("AppLogo")
                .resizable()
                .frame(width: 150, height: 150) // 添加您的登录页面Logo图片
            Text("Welcome Back!") // 登录页面的欢迎文本
                .font(.title)
                .fontWeight(.bold)
            
            VStack(spacing: 20) {
                TextField("Email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .shadow(radius: 5)
                
                SecureField("Password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .shadow(radius: 5)
                
                Button(action: {
                    // 登录按钮点击事件处理
                    if true {
                        // 登录成功，返回上一页
                        self.presentationMode.wrappedValue.dismiss()
                    }
                }) {
                    Text("Sign in")
                        .font(.callout)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(.brown)
                        .frame(height: 40)
                }
                .frame(height: 40)
                .cornerRadius(10)
                .shadow(radius: 5)
                .background(theme_color, ignoresSafeAreaEdges: Edge.Set.all)
                
//                with apple
                Button(action: {
                    // 登录按钮点击事件处理
                }) {
                    HStack {
                        Image(systemName: "apple.logo") //
                            .frame(width: 20, height: 20)
                            .foregroundColor(.white)
                        Text("Sign in with Apple") // 按钮文本
                            .foregroundColor(.white)
                            .font(.headline)
                            .padding(.vertical, 12)
                            .padding(.horizontal, 16)
                            .frame(height: 40)
                    }
                    .frame(maxWidth: .infinity)
                    .background(Color.black) // 按钮背景颜色，可根据需要选择
                    .cornerRadius(10)
                }
                .buttonStyle(PlainButtonStyle())
                .frame(maxWidth: .infinity)
                .shadow(radius: 5)
                
//                with google
                Button(action: {
                    // 登录按钮点击事件处理
                }) {
                    HStack {
                        Image("GoogleIcon") //
                            .resizable()
                            .frame(width: 20, height: 20)
                            .foregroundColor(.black)
                        Text("Sign in with Google") // 按钮文本
                            .font(.headline)
                            .padding(.vertical, 12)
                            .padding(.horizontal, 16)
                            .frame(height: 40)
                            .foregroundColor(.black)
                    }
                    .frame(maxWidth: .infinity)
                    .background(.white)
                    .cornerRadius(10)
                }
                .buttonStyle(PlainButtonStyle())
                .frame(maxWidth: .infinity)
                .shadow(radius: 5)
                .foregroundColor(.black)
            
                
                
            }
            .padding(.horizontal, 30)
            Spacer()
            
            NavigationLink(destination: SignUpPage()) {
                Text("Forgot Your Password? ")
                    .foregroundColor(.gray)
                    .font(.headline) +
                Text("Click Here")
                    .foregroundColor(.brown) // 将颜色设置为绿色
                    .font(.headline)
            }.padding(2)
            
            NavigationLink(destination: SignUpPage()) {
                Text("Don't have an account? ")
                    .foregroundColor(.gray)
                    .font(.headline) +
                Text("Sign up")
                    .foregroundColor(.brown) // 将颜色设置为绿色
                    .font(.headline)
            }
        }
        .padding()
        .background(theme_color)
    }
}

#Preview {
    LogInPage()
}
