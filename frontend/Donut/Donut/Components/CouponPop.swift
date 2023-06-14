//
//  Coupons.swift
//  Donut
//
//  Created by 张文谦 on 12/6/2023.
//

import UIKit
import SwiftUI

struct CouponPop: View {
    @Binding var isPresented: Bool
    var coupon:CouponStructure
    
    var body: some View {
        VStack {
            Image("ccGreen.SFSymbol")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .foregroundColor(getCouponType(coupon.type).color)
                .overlay {
                    VStack{
                        Spacer()
                        Text(coupon.condition == "" ? "No Condition" : coupon.condition)
                               .font(.headline)
                               .fontWeight(.light)
                               .foregroundColor(.white)
                           
                        Text(getCouponLong(type: coupon.type,discount: coupon.discount))
                               .font(.system(size: 50, weight: .bold))
                               .fontWeight(.heavy)
                               .foregroundColor(.white)
                               .lineLimit(1)
                               .minimumScaleFactor(0.1)
                               .padding(.horizontal, 40.0)
                               .padding(.vertical, 10)
                           
                           Text("Exp: "+coupon.expire)
                               .font(.title3)
                               .foregroundColor(.white)
                               .cornerRadius(10)
                            Spacer()
                    }
                }
            Spacer()
            Button(action: {isPresented = false}, label: {
                Text("Boost Now")
                    .fontWeight(.bold)
                    .frame(maxWidth: .infinity)
                    .font(.largeTitle)
                    .padding()
            })
            .background(getCouponType(coupon.type).color)
            .cornerRadius(10)
            .foregroundColor(.white)
            
            Button(action: {isPresented = false}, label: {
                Text("Cancel")
                    .frame(maxWidth: .infinity)
            })
            .buttonStyle(.borderedProminent)
        }
        .presentationDetents([.medium])
        .background(Color.white)
        .padding()
    }
}

//struct PopUpView:View {
////    using CouponNS
//    @State private var isPresented = true
//    var body: some View {
//        Button("显示弹出窗口") {
//            isPresented = true
//        }
//        .sheet(isPresented: $isPresented) {
//            CouponPop(isPresented: $isPresented)
//        }
//    }
//}
//
//#Preview {
//    PopUpView().preferredColorScheme(.light)
//}

