//
//  Configuration.swift
//  Donut
//
//  Created by 张文谦 on 13/6/2023.
//

import Foundation
import UIKit
import SwiftUI

let theme_color = Color(red: 1, green: 0.95294118, blue: 0.81960784)
let theme_text_color = Color(red: 0.9372549, green: 0.7254902, blue: 0.37254902)

struct BackgroundColorStyle: ViewModifier {

    func body(content: Content) -> some View {
        return content
            .background(theme_color)
    }
}
