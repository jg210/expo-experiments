package uk.me.jeremygreen.expoexperiments.module

import org.junit.Assert
import org.junit.Test
import uk.me.jeremygreen.expoexperiments.module.ExpoExperimentsModule.Companion.hexString

class ExpoExperimentsModuleTest {

    @Test
    fun hexString() {
        Assert.assertEquals(
            "000102ff",
            byteArrayOf(0, 1, 2, 255.toByte()).hexString()
        )
    }

    @Test
    fun `hexString empty`() {
        Assert.assertEquals(
            "",
            byteArrayOf().hexString()
        )
    }

    @Test
    fun `fingerprintAuthorities empty list`() {
        Assert.assertEquals(
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            ExpoExperimentsModule.fingerprintAuthorities(listOf())
        )
    }

    @Test
    fun `fingerprintAuthorities one element`() {
        Assert.assertEquals(
            "ffe9aaeaa2a2d5048174df0b80599ef0197ec024c4b051bc9860cff58ef7f9f3",
            ExpoExperimentsModule.fingerprintAuthorities(listOf("a"))
        )
    }

    @Test
    fun `fingerprintAuthorities separator`() {
        Assert.assertNotEquals(
            ExpoExperimentsModule.fingerprintAuthorities(listOf("a", "bc")),
            ExpoExperimentsModule.fingerprintAuthorities(listOf("ab", "c"))
        )
    }

    @Test
    fun `fingerprintAuthorities permutation`() {
        Assert.assertNotEquals(
            ExpoExperimentsModule.fingerprintAuthorities(listOf("a", "b")),
            ExpoExperimentsModule.fingerprintAuthorities(listOf("b", "a"))
        )
    }

}