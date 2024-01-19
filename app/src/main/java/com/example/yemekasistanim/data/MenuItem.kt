package com.example.yemekasistanim.data

import com.example.yemekasistanim.R

data class MenuItem(
    val id: ScreensRoute,
    val title: String
)

val drawerScreens = listOf(
    MenuItem(ScreensRoute.SCREEN_1, "Yemek Asistanınla Konuş"),
    MenuItem(ScreensRoute.SCREEN_2, "İstenmeyen Malzemeler"),
    MenuItem(ScreensRoute.SCREEN_3, "Diyet Listesi"),
    MenuItem(ScreensRoute.SCREEN_4, "Ayarlar"),
)

enum class ScreensRoute {
    SCREEN_1, SCREEN_2, SCREEN_3, SCREEN_4
}