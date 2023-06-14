//
//  Coupons.swift
//  Donut
//
//  Created by 张文谦 on 12/6/2023.
//

import SwiftUI

struct Coupon: View {
    var body: some View {
        Text("Hello, World!")
    }
}

enum Coupons: String, CaseIterable {
    case fixedAmount = "Fixed Amount"
    case percentage = "Percentage"
    case free = "Free"
    case conditionFree = "Condition Free"
    var color: Color {
        switch self {
            case .fixedAmount:
                return Color.blue
            case .percentage:
                return Color.green
            case .free:
                return Color.yellow
            case .conditionFree:
                return Color.purple
        }
//        switch self {
//        case .fixedAmount:
//            return Color(red: 0.96470588, green: 0.50196078, blue: 1)
//        case .percentage:
//            return Color(red: 0.99607843, green: 0.8, blue: 0.75294118)
//        case .free:
//            return Color(red: 0.49019608, green: 1, blue: 0.50196078)
//        case .conditionFree:
//            return Color(red: 0.47843137, green: 0.95294118, blue: 0.95294118)
//        }
    }
}

func getCouponType(_ string: String) -> Coupons {
    guard let coupon = Coupons(rawValue: string) else {
        return .free
    }
    return coupon
}

func getCouponShort(type t:String, discount d:String) -> String {
    let type = getCouponType(t)
    switch type {
        case .fixedAmount:
            return "$\(d) OFF"
        case .percentage:
            return "\(d)% OFF"
        case .free:
            return "Free"
        case .conditionFree:
            return "CFree"
    }
}

func getCouponLong(type t:String, discount d:String) -> String {
    let type = getCouponType(t)
    switch type {
        case .fixedAmount:
            return "$\(d) OFF"
        case .percentage:
            return "\(d)% OFF"
        case .free:
            return d
        case .conditionFree:
            return d
    }
}


#Preview {
    Coupon()
}
