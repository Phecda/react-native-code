#import <React/RCTBridgeModule.h>
#import <React/RCTImageLoaderProtocol.h>

@interface PSCode : NSObject <RCTBridgeModule>

typedef void(^ImageDataCallback)(NSData* _Nullable data);

@end
