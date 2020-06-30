if (process.env.NODE_ENV === "production") {
    const path = require("path")
    module.exports = {
        "transpileDependencies": [
            "vuetify"
        ],
        outputDir: "doc",
        assetsDir: "static",
        productionSourceMap: true
    }
} else if (process.env.NODE_ENV === "development") {
    module.exports = {
        "transpileDependencies": [
            "vuetify"
        ]
    }
}