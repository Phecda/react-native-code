#import "PSCode.h"
#import <AVFoundation/AVFoundation.h>
#import <CoreImage/CoreImage.h>


@implementation PSCode

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(readFromUrl:(NSString *)url :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    [self loadImageFromURLString:url completionBlock:^(NSData * _Nullable data) {
        if (data) {
            CIImage* image = [CIImage imageWithData:data];
            CIContext* context = [CIContext contextWithOptions:nil];
            
            CIDetector* detector = [CIDetector detectorOfType:CIDetectorTypeQRCode context:context options:@{CIDetectorAccuracy: CIDetectorAccuracyHigh}];
            
            NSArray* features = [detector featuresInImage:image];
            if(!features || features.count==0){
                reject(@"2", @"No QRCode found in this image", nil);
                return;
            }
            CIQRCodeFeature *feature = [features objectAtIndex:0];
            NSString *scannedResult = feature.messageString;
            resolve(scannedResult);
        } else {
            reject(@"1", @"Load image failed", nil);
        }
    }];
}

- (void)loadImageFromURLString: (NSString*)urlString
               completionBlock: (ImageDataCallback)callback
{
    NSURL* url = [NSURL URLWithString:urlString];
    NSURLRequest* imageRequest = [NSURLRequest requestWithURL:url];
    
    [[_bridge moduleForName:@"ImageLoader"] loadImageWithURLRequest:imageRequest callback: ^(NSError* error, UIImage* image){
        if (image) {
            callback(UIImagePNGRepresentation(image));
        } else {
            callback(nil);
        }
    }];
}

@end
