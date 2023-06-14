//
//  RestaurantCard.swift
//  Donut
//
//  Created by 张文谦 on 10/6/2023.
//

import SwiftUI

struct RestaurantCard: View {
    
    public static let height: CGFloat = 210
    public var title:String
    public var address:String
    public var isLiked:Bool
    var rete:CGFloat
    var image:String
    var id:String
    var coupons:[CouponStructure]
    
    @State var clickVoucher:String = ""
    
    
    var body: some View {
        GeometryReader { geometry in
            VStack(alignment: .leading) {
                GeometryReader { vg in
                    HStack(alignment: .top) {
                        CardImage(img: image, geometry: geometry)
                            .overlay{
                                HStack{
                                    Spacer()
                                    VStack{
                                        Spacer()
                                        Text(String(format: "%.1f", rete))
                                            .font(.footnote)
                                            .background(
                                                Circle()
                                                    .fill(Color(red: CGFloat(1), green: CGFloat(1), blue: CGFloat(0.77901961)))
                                                    .frame(width: 30, height: 30)
                                            ).padding()
                                    }
                                }
                                NavigationLink(destination: DetailsPage(voucher: clickVoucher)){
                                    EmptyView()
                                }.buttonStyle(PlainButtonStyle())
                                    .frame(width: 0)
                                    .opacity(0)
                                    
                            }
                            
                        Spacer()
                        LazyVGrid(columns: [
                            GridItem(.adaptive(minimum: 100))
                        ], spacing: 10) {
                            ForEach(coupons) { coupon in
                                CardCoupon(coupons: coupon)
                            }
                        }
                    }
                }
                HStack{
                    CardTitle(title: title)
                    Spacer()
                    CardLike(isLiked: isLiked)
                }
                HStack{
                    Text(address)
                        .foregroundColor(Color.gray)
                    Spacer()
                }
            }
            .padding()
            .frame(width: geometry.size.width, height: CGFloat(RestaurantCard.height), alignment: .center)
            .clipShape(RoundedRectangle(cornerRadius: 20))
            NavigationLink(destination: DetailsPage()){}
                .hidden()
        }
    }
    
    struct CardImage: View {
        var img:String
        var geometry: GeometryProxy
        var body: some View {
            AsyncImage(
                url: URL(string: img),
                content: { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .scaledToFill()
                }, placeholder: {
                    Color.gray
                })
            .background(Color.gray)
            .frame(width: (geometry.size.width-20)*0.7, height: 130)
            .cornerRadius(20, corners: [.topLeft, .bottomRight])
            .aspectRatio(contentMode: .fit)
            .shadow(radius: 5)
        }
    }
    
    struct CardTitle: View {
        var title: String
        var body: some View {
            Text(title)
                .font(.title3)
                .bold()
                .lineLimit(1)
                .minimumScaleFactor(0.1)  //
        }
    }
    //    满减
    //    百分比折扣
    //    买一送一
    //    免费
    struct CardVoucher: View {
        var context: String
        var color: Color
        var body: some View {
            Text(context)
                .padding(4)
                .frame(maxWidth: .infinity)
                .background(color)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .font(.title3)
                .lineLimit(1)
                .minimumScaleFactor(0.1)
        }
    }
    
    struct CardLike: View {
        @State var isLiked: Bool
        @State private var isAnimating = false
        let generator = UINotificationFeedbackGenerator()
        var body: some View {
            Image(systemName: isLiked ? "heart.fill" : "heart")
                .font(.title2)
                .foregroundColor(isLiked ? .red : .gray)
                .scaleEffect(isAnimating ? 0.9 : 1.1)
                .onTapGesture {
                    withAnimation {
                        isAnimating = true
                        let generator = UIImpactFeedbackGenerator(style: .light)
                        generator.impactOccurred()
                        generator.prepare()
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                        withAnimation {
                            isAnimating = false
                            isLiked.toggle()
                            generator.notificationOccurred(.success)
                        }
                    }
                }
                .padding(.trailing)
        }
    }
    
    struct CardCoupon: View {
        @State private var isPresented = false
        var coupons:CouponStructure
        var body: some View {
            HStack(spacing: 0){
                Spacer()
                CardVoucher(context: getCouponShort(type: coupons.type, discount: coupons.discount),
                            color: getCouponType(coupons.type).color)
                    .onTapGesture {
                        isPresented = true
                    }
            }
            .sheet(isPresented: $isPresented) {
                CouponPop(isPresented: $isPresented, coupon: coupons)
            }.shadow(radius: 5)
        }
    }
}

//#Preview {
//    RestaurantCard(
//        title: "My Modern Fresh Tea & Yogurt", address: "address", isLiked: true, rete: CGFloat(4.4), image: "https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg", id: "defId"
//
//    )
//        .listRowSeparator(.hidden)
//}
