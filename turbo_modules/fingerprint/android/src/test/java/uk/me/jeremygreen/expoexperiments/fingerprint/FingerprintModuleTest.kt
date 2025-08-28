package uk.me.jeremygreen.expoexperiments.fingerprint

import com.facebook.react.bridge.JavaOnlyArray
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import io.mockk.mockk
import io.mockk.verify
import org.junit.Assert
import org.junit.Test

private const val FINGERPRINT_EMPTY =
    "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e"

private const val FINGERPRINT_ONE_ELEMENT =
    "5c2ca3d50f46ece6066c53bd1a490cbe5f72d2738ae9417332e91e5c3f75205c639d71a9a41d67d965fa137dddf439e0ab9443a6ea44915e90d8b5b566d1c076"

class FingerprintModuleTest {

    @Test
    fun `fingerprintAuthorities empty list`() {
        Assert.assertEquals(
            FINGERPRINT_EMPTY,
            FingerprintModule.fingerprintAuthorities(listOf())
        )
    }

    @Test
    fun `fingerprintAuthorities one element`() {
        Assert.assertEquals(
            FINGERPRINT_ONE_ELEMENT,
            FingerprintModule.fingerprintAuthorities(listOf("a"))
        )
    }

    @Test
    fun `fingerprintAuthorities separator`() {
        Assert.assertNotEquals(
            FingerprintModule.fingerprintAuthorities(listOf("a", "bc")),
            FingerprintModule.fingerprintAuthorities(listOf("ab", "c"))
        )
    }

    @Test
    fun `fingerprintAuthorities permutation`() {
        Assert.assertNotEquals(
            FingerprintModule.fingerprintAuthorities(listOf("a", "b")),
            FingerprintModule.fingerprintAuthorities(listOf("b", "a"))
        )
    }

    private fun assertFingerprintAuthoritiesResolves(
        expectedFingerprint: String,
        vararg authorities: String
    ) {
        val reactApplicationContext = mockk<ReactApplicationContext>()
        val fingerprintModule = FingerprintModule(reactApplicationContext)
        val promise = mockk<Promise>(relaxed = true)
        val authoritiesWritableArray: WritableArray = JavaOnlyArray.from(authorities.toList())
        fingerprintModule.fingerprintAuthorities(authoritiesWritableArray, promise)
        verify(exactly = 1) { promise.resolve(expectedFingerprint) }
        verify(exactly = 0) { promise.reject(any<String>()) }
        verify(exactly = 0) { promise.reject(any<Throwable>()) }
    }

    @Test
    fun `fingerprintAuthorities promise empty list` () = assertFingerprintAuthoritiesResolves(FINGERPRINT_EMPTY)

    @Test
    fun `fingerprintAuthorities promise one element` () = assertFingerprintAuthoritiesResolves(FINGERPRINT_ONE_ELEMENT, "a")

}