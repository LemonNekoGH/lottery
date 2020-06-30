if (process.env.NODE_ENV === "production") {
    module.exports = {
        "transpileDependencies": [
            "vuetify"
        ],
        outputDir: "docs",
        assetsDir: "./",
        runtimeCompiler: false,
        productionSourceMap: true
    }
} else if (process.env.NODE_ENV === "development") {
    module.exports = {
        "transpileDependencies": [
            "vuetify"
        ]
    }
}