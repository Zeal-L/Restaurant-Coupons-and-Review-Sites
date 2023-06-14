//
//  Setting.swift
//  Mazes
//
//  Created by 张文谦 on 13/5/2023.
//

import Foundation
class UserSettings: ObservableObject {
    @Published var token: String {
        didSet {
            UserDefaults.standard.set(token, forKey: SettingsKeys.token.keys)
        }
    }
    
    init() {
        UserDefaults.standard.register(defaults: [
            SettingsKeys.token.keys: SettingsKeys.token.defaultValue
        ])
        self.token = UserDefaults.standard.string(forKey: SettingsKeys.token.keys) ?? ""
    }
    
    enum SettingsKeys: CaseIterable {
        case token
        var keys: String {
            switch self {
            case .token:
                return "UserSettings.token"
            }
        }
        var defaultValue: Any {
            switch self {
            case .token:
                return {}
            }
        }
    }
}
