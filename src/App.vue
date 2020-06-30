<template>
    <v-app>
        <v-app-bar app flat>
            <v-app-bar-nav-icon>
                <v-icon>mdi-gift-outline</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title>简单的随机抽奖程序 - by柠喵</v-toolbar-title>
        </v-app-bar>
        <v-main style="height: 100%">
            <v-divider></v-divider>
            <v-row style="height: 100%">
                <v-col cols="12">
                    <v-row align="center" justify="center" style="height: 100%">
                        <v-col cols="8">
                            <v-card outlined>
                                <v-card-title>
                                    在下方添加可能中奖的用户
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-list style="padding-top: 0;padding-bottom: 0">
                                    <template v-for="item in items">
                                        <v-expand-transition :key="item.index">
                                            <v-list-item
                                                    link>
                                                <v-list-item-avatar v-if="item.index !== 0">
                                                    <v-icon>mdi-account</v-icon>
                                                </v-list-item-avatar>
                                                <v-list-item-content style="color: gray">{{item.username}}
                                                </v-list-item-content>
                                                <v-list-item-action v-if="item.index !== 0">
                                                    <v-btn icon @click="remove(item)">
                                                        <v-icon>mdi-delete</v-icon>
                                                    </v-btn>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-expand-transition>
                                        <v-divider :key="item.index + item.username"
                                                   v-if="items.indexOf(item) !== items.length - 1 && item.index !== 0"></v-divider>
                                    </template>
                                </v-list>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn text outlined @click="addDialog = true">添加</v-btn>
                                    <v-btn text outlined @click="start(false)">开始</v-btn>
                                </v-card-actions>
                            </v-card>
                            <!--下面都是一些对话框什么的-->
                            <v-dialog v-model="addDialog" width="300">
                                <v-card width="300" style="padding-top: 16px">
                                    <v-text-field
                                            placeholder=" "
                                            style="margin: 0 16px 0 16px;padding-bottom: 0"
                                            id="username-text-field"
                                            label="在此输入可能中奖的用户名"
                                            v-model="username"
                                            :error="duplicateUserError"
                                            :error-messages="duplicateUserError ? '用户名重复' : ''"
                                    ></v-text-field>
                                    <v-card-actions style="margin-top: 0;padding-top: 0">
                                        <v-spacer></v-spacer>
                                        <v-btn text color="red" @click="addDialog = false">取消</v-btn>
                                        <v-btn text color="primary" @click="addUser">确认</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-dialog v-model="singleUserWarning" width="300">
                                <v-card width="300" style="padding-top: 16px">
                                    <v-card-subtitle>
                                        目前只添加了一位用户，这位用户必定中奖，是否继续？
                                    </v-card-subtitle>
                                    <v-card-actions style="margin-top: 0;padding-top: 0">
                                        <v-spacer></v-spacer>
                                        <v-btn text color="red" @click="singleUserWarning = false">否</v-btn>
                                        <v-btn text color="primary" @click="start(true)">是</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <!--中奖啦-->
                            <v-dialog v-model="congratulations" width="300" persistent>
                                <v-card width="300" style="padding-top: 16px">
                                    <v-card-subtitle>
                                        恭喜用户名为“{{winningUser}}”的用户中奖！
                                    </v-card-subtitle>
                                    <v-card-actions style="margin-top: 0;padding-top: 0">
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="reset">好耶！</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-snackbar color="red" dark v-model="noUserError">没有用户会中奖</v-snackbar>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-main>
    </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';

    interface Item {
        index: number
        username: string
    }

    const items: Item[] = []
    const noUser: Item = {
        index: 0,
        username: "暂时没有添加可能中奖的用户"
    }
    items.push(noUser)

    export default Vue.extend({
        name: 'App',
        data: () => ({
            noUser: noUser,
            items: items,
            addDialog: false,
            username: "",
            noUserError: false,
            duplicateUserError: false,
            singleUserWarning: false,
            congratulations: false,
            winningUser: ""
        }),
        methods: {
            addUser(): void {
                if (this.$data.username == "") {
                    return
                }
                this.$data.items.forEach((item: Item) => {
                    if (item.index == 0) {
                        this.$data.items.splice(item, 1)
                        return
                    }
                })
                let foundDuplicateUser = false
                this.$data.items.forEach((item: Item) => {
                    if (item.username == this.$data.username) {
                        foundDuplicateUser = true
                        return
                    }
                })
                if (foundDuplicateUser) {
                    this.$data.duplicateUserError = true
                    setTimeout(() => this.$data.duplicateUserError = false, 3000)
                    return
                }
                this.$data.items.push({
                    index: this.$data.items.length + 1,
                    username: this.$data.username
                })
                this.$data.username = ""
                this.$data.addDialog = false
            },
            start(ignoreSingleUser: boolean): void {
                if (this.$data.items[0].index === this.$data.noUser.index) {
                    this.$data.noUserError = true
                    setTimeout(() => this.$data.noUserError = false, 3000)
                    return
                }
                if (!ignoreSingleUser && this.$data.items.length == 1) {
                    this.$data.singleUserWarning = true
                    return;
                }
                const winningUser: Item = this.$data.items[this.random(this.$data.items.length - 1)]
                this.$data.winningUser = winningUser.username
                this.$data.congratulations = true
            },
            remove(item: Item): void {
                this.$data.items.forEach((theItem: Item) => {
                    if (item.index == theItem.index) {
                        this.$data.items.splice(theItem, 1)
                        return
                    }
                })
                if (this.$data.items.length == 0) {
                    this.$data.items.push(this.$data.noUser)
                }
            },
            random(max: number): number {
                return Math.floor(Math.random() * (max + 1));
            },
            reset(): void {
                this.$data.items = []
                this.$data.addDialog = false
                this.$data.congratulations = false
                this.$data.winningUser = ""
            }
        },
    });
</script>