//
//  FilterSheet.swift
//  Donut
//
//  Created by 张文谦 on 13/6/2023.
//

import SwiftUI

struct FilterSheet: View {
    @Binding var sortOrder: SortOrder
    @Binding var filterCouponTypes: Set<Int>
    // Add more properties for other search settings as needed
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Sort Order")) {
                    Picker(selection: $sortOrder, label: Text("Sort By")) {
                        Text("Restaurant Name").tag(SortOrder.name)
                        Text("Rating").tag(SortOrder.rating)
                        Text("Coupon Count").tag(SortOrder.couponCount)
                    }
                }
                
                Section(header: Text("Filter")) {
                    Toggle(isOn: Binding(
                        get: { self.filterCouponTypes.contains(1) },
                        set: { if $0 { self.filterCouponTypes.insert(1) } else { self.filterCouponTypes.remove(1) } }
                    )) {
                        Text("Coupon Type 1")
                    }
                    
                    Toggle(isOn: Binding(
                        get: { self.filterCouponTypes.contains(2) },
                        set: { if $0 { self.filterCouponTypes.insert(2) } else { self.filterCouponTypes.remove(2) } }
                    )) {
                        Text("Coupon Type 2")
                    }
                    
                    // Add more toggles for other coupon types
                    
                    // Custom filter condition example
                    Toggle(isOn: Binding(
                        get: { self.filterCouponTypes.contains(5) },
                        set: { if $0 { self.filterCouponTypes.insert(5) } else { self.filterCouponTypes.remove(5) } }
                    )) {
                        Text("Custom Filter Condition")
                    }
                }
            }
            .navigationBarTitle("Search Settings")
            .navigationBarItems(trailing: Button(action: {
                // Dismiss the sheet
            }) {
                Text("Done")
            })
        }
        .presentationDetents([.medium])
    }

}


enum SortOrder {
    case name
    case rating
    case couponCount
}

struct FilterSheetView: View {
    @State private var showSearchSettings = false
    @State private var sortOrder: SortOrder = .name
    @State private var filterCouponTypes: Set<Int> = []

    var body: some View {
        // Your main view content here

        Button(action: {
            showSearchSettings = true
        }) {
            Text("Open Search Settings")
        }
        .sheet(isPresented: $showSearchSettings) {
            FilterSheet(sortOrder: $sortOrder, filterCouponTypes: $filterCouponTypes)
        }
    }
}

#Preview{
    FilterSheetView()
}
