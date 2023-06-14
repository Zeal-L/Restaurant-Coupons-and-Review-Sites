//
//  Coupons.swift
//  Donut
//
//  Created by 张文谦 on 12/6/2023.
//

import UIKit
import SwiftUI

struct EmailPop: View {
    @Binding var isPresented: Bool
    @State var email:String = "a@a.com"
    @State var sending:Bool = false
    @State private var code: [String] = Array(repeating: "", count: 6)
    @FocusState private var focusedField: Int?
    var body: some View {
        VStack {
            TextField("email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .cornerRadius(20)
                .padding()
                .shadow(radius:10)
                .disabled(sending)
                .foregroundColor(sending ? .gray : .black)
                .padding(.horizontal)
            
            Button(action: {
//                self.sending = true
//                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
//                    self.isPresented = false
//                }
            }) {
                Text("发送")
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.green)
                    .cornerRadius(20)
                    .shadow(radius: 10)
                    .disabled(sending)
                    
            }
            .padding(.horizontal)
            Spacer()
            HStack(spacing: 10) {
                        ForEach(0..<6) { index in
                            TextField("", text: $code[index])
                                .frame(width: 40, height: 40)
                                .font(.title)
                                .multilineTextAlignment(.center)
                                .keyboardType(.numberPad)
                                .background(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(Color.gray, lineWidth: 1)
                                )
                                .focused($focusedField, equals: index)
                                .onChange(of: code[index]) { oldValue, newValue in
                                    if newValue.count == 1 {
                                        focusedField = index < 5 ? index + 1 : index
                                    } else if newValue.isEmpty {
                                        focusedField = index > 0 ? index - 1 : index
                                    }
                                }
                        }
                    }
                    .onAppear {
                        focusedField = 0
                    }
            .padding(.horizontal)
            Button(action: {
//                self.sending = true
//                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
//                    self.isPresented = false
//                }
            }) {
                Text("Submit")
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.green)
                    .cornerRadius(20)
                    .shadow(radius: 10)
                    .disabled(sending)
            }.padding(.horizontal)
            Spacer()
                
        }
    }
}

struct EmailPageView:View {
//    using CouponNS
    @State private var isPresented = true
    var body: some View {
        EmailPop(isPresented: $isPresented)
    }
}

#Preview {
    EmailPageView().preferredColorScheme(.light)
}

