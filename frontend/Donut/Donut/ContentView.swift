//
//  ContentView.swift
//  Donut
//
//  Created by 张文谦 on 10/6/2023.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            Home()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Home")
            }
            Text("Nearby Screen")
                .tabItem {
                    Image(systemName: "mappin.circle.fill")
                    Text("Nearby")
            }
            Text("Nearby Screen")
                .tabItem {
                    Image(systemName: "heart.fill")
                    Text("Favourites")
            }
            UserProfile()
                .tabItem {
                    Image(systemName: "person.fill")
                    Text("Profile")
            }
        }
        .preferredColorScheme(.light)
        .toolbarBackground(theme_color, for: .tabBar)
    }
}

#Preview {
    ContentView()
        .preferredColorScheme(.light)
//        .environmentObject(UserSettings())
}
