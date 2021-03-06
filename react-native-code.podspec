require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-code"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-code
                   DESC
  s.homepage     = "https://github.com/Phecda/react-native-code"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "phecda" => "szp12345141@gmail.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/Phecda/react-native-code.git", :tag => "v#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  # ...
  # s.dependency "..."
end

