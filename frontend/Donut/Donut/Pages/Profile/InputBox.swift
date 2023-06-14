//
//  InputBox.swift
//  Donut
//
//  Created by 张文谦 on 12/6/2023.
//

import SwiftUI

struct InputBox: View {
    @Binding var isError:Bool
    @Binding var text:String
    let placeholder:String
    let isPassword:Bool = false
    
    var body: some View {
        Group {
            if isPassword {
                SecureField(placeholder, text: $text)
            } else {
                TextField(placeholder, text: $text)
            }
        }
        .textFieldStyle(RoundedBorderTextFieldStyle())
        .shadow(color: (isError ? .red : .gray), radius: 3)
        .animation(.easeIn, value: isError)
    }
}
