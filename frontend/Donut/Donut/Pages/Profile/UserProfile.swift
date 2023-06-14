//
//  UserProfile.swift
//  Donut
//
//  Created by 张文谦 on 10/6/2023.
//

import SwiftUI

struct UserProfile: View {
    @Environment(\.colorScheme) var colorScheme
    var avatarURL = URL(string: "https://cdn-icons-png.flaticon.com/512/666/666201.png")

    var body: some View {
        NavigationStack{
            VStack {
                // 用户名和用户头像
                NavigationLink(destination: LogInPage()) {
                    HStack {
                        AsyncImage(
                            url:avatarURL,
                            content: { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            }, placeholder: {
                                Color.gray
                            })
                        .background(Color.gray)
                        .frame(width: 90, height: 90)
                        .clipShape(Circle())
                    
                        
                        Text("Username")
                            .font(.title)
                            .fontWeight(.bold)
                            .padding(.top, 10)
                        Spacer()
                    }
                    .foregroundColor(colorScheme == .dark ? .white : .black)
                    .padding()
                }
                .overlay(Divider(), alignment: .bottom)
                // 选项列表
                
                List{
                    NavigationLink(destination: EditProfile()) {
                        OptionRow(iconName: "gift", title: "Send Gift")
                    }
                    .listRowSeparator(.hidden)
                    
                    NavigationLink(destination: EditProfile()) {
                        OptionRow(iconName: "tag.fill", title: "Coupon Code")
                    }
                    .listRowSeparator(.hidden)
                }
                .listStyle(PlainListStyle())
                
                Spacer()
            }
        }
    }
    struct OptionRow: View {
        var iconName: String
        var title: String
        
        var body: some View {
            HStack {
                Image(systemName: iconName)
                    .font(.title)
                
                Text(title)
                    .font(.headline)
                
                Spacer()
            }
            .padding()
        }
    }
}

#Preview {
    UserProfile()
}
