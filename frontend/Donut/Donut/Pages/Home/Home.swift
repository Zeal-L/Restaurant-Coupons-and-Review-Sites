//
//  Home.swift
//  Donut
//
//  Created by 张文谦 on 10/6/2023.
//

import SwiftUI

struct Home: View {
    @State private var searchText = ""
    @State private var restaurantList:[RestaurantStructure] = []
    var body: some View {
        NavigationStack {
            HStack {
                HStack {
                    Image(systemName: "magnifyingglass").font(.title2)
                    TextField("Search", text: $searchText)
                        .font(.title2)
                        .textFieldStyle(PlainTextFieldStyle())
                        .border(/*@START_MENU_TOKEN@*/Color.black/*@END_MENU_TOKEN@*/, width: 0)
                    Button(action: {
                        
                    }, label: {
                        Image(systemName: "slider.horizontal.3").font(.title)
                    }).foregroundColor(.black)
                }
                .padding()
            }
            .frame(minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: 60, alignment: .top)
            
            List{
                ForEach(restaurantList) { restaurant in
                    RestaurantCard(
                        title: restaurant.name,
                        address: restaurant.address,
                        isLiked: restaurant.isLiked,
                        rete: restaurant.rate,
                        image: restaurant.image,
                        id:"asdf",
                        coupons: restaurant.coupons
                    )
                    .frame(height: RestaurantCard.height)
                    .listRowSeparator(.hidden)
                    .listRowInsets(EdgeInsets())
                }
            }
            .listStyle(PlainListStyle())
        }
        .onAppear{
            let jsonString = """
            {
              "data": [
                {
                  "id": "1",
                  "name": "Restaurant A",
                  "address": "123 Main Street",
                  "rate": 4.5,
                  "numComment": 10,
                  "image": "https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg",
                  "isLiked":true,
                  "coupons": [
                    {
                      "id": "1",
                      "type": "Percentage",
                      "condition": "Spend $50 or more",
                      "discount": "10",
                      "expire": "2023-12-31"
                    },
                    {
                      "id": "2",
                      "type": "Fixed Amount",
                      "condition": "Spend $100 or more",
                      "discount": "20",
                      "expire": "2023-09-30"
                    },
                    {
                      "id": "3",
                      "type": "Condition Free",
                      "condition": "Buy Fried Chicken",
                      "discount": "Get Free Drink",
                      "expire": "2023-09-30"
                    }
                  ]
                },
                {
                  "id": "2",
                  "name": "Restaurant B",
                  "address": "456 Elm Street",
                  "rate": 4.2,
                  "numComment": 5,
                  "image": "https://insanelygoodrecipes.com/wp-content/uploads/2020/07/Sweet-Colorful-Macarons.jpg",
                    "isLiked":true,
                  "coupons": [
                    {
                      "id": "4",
                      "type": "Percentage",
                      "condition": "Spend $40 or more",
                      "discount": "15",
                      "expire": "2023-11-30"
                    },
                    {
                      "id": "5",
                      "type": "Fixed Amount",
                      "condition": "Spend $80 or more",
                      "discount": "10",
                      "expire": "2023-10-31"
                    },
                    {
                      "id": "6",
                      "type": "Free",
                      "condition": "",
                      "discount": "Free Chicken",
                      "expire": "2023-10-31"
                    }
                  ]
                }
              ]
            }
            """

            // Decode JSON
            let jsonData = jsonString.data(using: .utf8)!
            do {
                let decoder = JSONDecoder()
                let restaurantListJson = try decoder.decode(RestaurantList.self, from: jsonData)
                // Access the decoded data
                for restaurant in restaurantListJson.data {
//                    if !restaurantList.contains(restaurant) {
                        restaurantList.append(restaurant)
//                    }
                }
            } catch {
                print("Error decoding JSON: \(error)")
            }

        }
    }
}

#Preview {
    Home()
}
