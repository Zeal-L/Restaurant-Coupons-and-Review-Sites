//
//  RestaurantList.swift
//  Donut
//
//  Created by 张文谦 on 13/6/2023.
//

import Foundation


struct RestaurantList: Hashable, Codable{
    var data:[RestaurantStructure]
}

struct RestaurantStructure: Hashable, Codable, Identifiable{
    var id:String
    var name:String
    var address:String
    var rate:CGFloat
    var numComment:Int
    var image:String
    var isLiked:BooleanLiteralType
    var coupons:[CouponStructure]
}

struct CouponStructure: Hashable, Codable, Identifiable{
    var id:String
    var type:String
    var condition:String
    var discount:String
    var expire:String
}
