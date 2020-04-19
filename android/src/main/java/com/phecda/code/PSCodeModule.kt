package com.phecda.code

import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import com.facebook.common.executors.UiThreadImmediateExecutorService
import com.facebook.common.references.CloseableReference
import com.facebook.common.util.UriUtil
import com.facebook.datasource.DataSource
import com.facebook.drawee.backends.pipeline.Fresco
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber
import com.facebook.imagepipeline.image.CloseableImage
import com.facebook.imagepipeline.request.ImageRequestBuilder
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.zxing.*
import com.google.zxing.common.HybridBinarizer
import com.google.zxing.qrcode.QRCodeReader
import java.util.*


class PSCodeModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String {
    return "PSCode"
  }

  @ReactMethod
  fun readFromUrl(uri: String, promise: Promise) {
    loadImage(uri) {
      if (it == null) {
        promise.reject("", "Load image failed")
      } else {
        val hints: Hashtable<DecodeHintType, String> = Hashtable()
        hints[DecodeHintType.CHARACTER_SET] = "UTF8"

        val width = it.width
        val height = it.height
        val pixels = IntArray(width * height)
        it.getPixels(pixels, 0, width, 0, 0, width, height)

        val source = RGBLuminanceSource(width, height, pixels)
        val binaryBitmap = BinaryBitmap(HybridBinarizer(source))

        val reader = QRCodeReader()
        try {
          val result = reader.decode(binaryBitmap, hints)
          promise.resolve(result.text)
        } catch (e: NotFoundException) {
          promise.reject("", "No QRCode found in this image")
        } catch (e: ChecksumException) {
          promise.reject(e)
        } catch (e: FormatException) {
          promise.reject(e)
        }
      }
    }
  }

  private fun loadImage(url: String?, completionCallback: (Bitmap?) -> Unit) {
    var imageUri: Uri?
    try {
      imageUri = Uri.parse(url)

      if (imageUri.scheme == null) {
        imageUri = getResourceDrawableUri(reactApplicationContext, url)
      }
    } catch (e: Exception) {
      imageUri = null
    }

    if (imageUri != null) {
      getImage(imageUri) {
        completionCallback(it)
      }
    } else {
      completionCallback(null)
    }
  }

  private fun getImage(uri: Uri, completionCallback: (Bitmap?) -> Unit) {
    val dataSubscriber = object : BaseBitmapDataSubscriber() {
      override fun onFailureImpl(dataSource: DataSource<CloseableReference<CloseableImage>>?) {
        completionCallback(null)
      }

      /**
       * The bitmap provided to this method is only guaranteed to be around for the lifespan of the
       * method.
       *
       *
       * The framework will free the bitmap's memory after this method has completed.
       * @param bitmap
       */
      override fun onNewResultImpl(bitmap: Bitmap?) {
        if (bitmap != null) {
          if (bitmap.config != null) {
            completionCallback(bitmap.copy(bitmap.config, true))
          } else {
            completionCallback(bitmap.copy(Bitmap.Config.ARGB_8888, true))
          }
        } else {
          completionCallback(null)
        }
      }

    }

    val imageRequestBuilder = ImageRequestBuilder.newBuilderWithSource(uri)

    val imageRequest = imageRequestBuilder.build()
    val imagePipeline = Fresco.getImagePipeline()
    val dataSource = imagePipeline.fetchDecodedImage(imageRequest, null)
    dataSource.subscribe(dataSubscriber, UiThreadImmediateExecutorService.getInstance())

  }

  private fun getResourceDrawableUri(context: Context, name: String?): Uri? {
    if (name == null || name.isEmpty()) {
      return null
    }
    val imageName = name.toLowerCase().replace("-", "_")
    val resId = context.resources.getIdentifier(imageName, "drawable", context.packageName)

    return if (resId == 0) null else {
      Uri.Builder().scheme(UriUtil.LOCAL_RESOURCE_SCHEME).path(resId.toString()).build()
    }
  }

}
