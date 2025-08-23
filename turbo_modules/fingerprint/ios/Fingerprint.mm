#import "Fingerprint.h"
#import <CommonCrypto/CommonDigest.h>
#import <Foundation/Foundation.h>

@implementation Fingerprint
RCT_EXPORT_MODULE()

- (void)initialize {
  NSLog(@"xxx initializing Fingerprint native module");
}

- (void)fingerprintAuthorities:(NSArray<NSString *> *)authorities
        resolver:(RCTPromiseResolveBlock)resolve
        rejecter:(RCTPromiseRejectBlock)reject
{
  NSLog(@"xxx fingerprintAuthorities() native method called");
  if (![authorities isKindOfClass:[NSArray class]]) {
    reject(@"invalid_argument", @"Expected an array of strings", nil);
    return;
  }
  NSMutableData *data = [NSMutableData data];
  for (NSString *authority in authorities) {
    NSData *authorityData = [authority dataUsingEncoding:NSUTF8StringEncoding];
    [data appendData:authorityData];
    uint8_t nullByte = 0;
    [data appendBytes:&nullByte length:1];
  }

  // Compute SHA-512
  uint8_t hash[CC_SHA512_DIGEST_LENGTH];
  CC_SHA512(data.bytes, (CC_LONG)data.length, hash);

  // Convert to hex string
  NSMutableString *hexString = [NSMutableString stringWithCapacity:CC_SHA512_DIGEST_LENGTH * 2];
  for (int i = 0; i < CC_SHA512_DIGEST_LENGTH; i++) {
    [hexString appendFormat:@"%02x", hash[i]];
  }

  resolve(hexString);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeFingerprintSpecJSI>(params);
}

@end
