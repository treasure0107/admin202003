import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        tagListData: [{
            text: '首页',
            link: '/'
        }],
        nowTagIndex: 0,
        menuData: {
            purchase: 0,
        }
    },
    mutations: {
        changeTagList (state, value) {
            if (JSON.stringify(state.tagListData).indexOf(value.text) > -1) {
                let index = _.findIndex(state.tagListData, (o) => {
                    return o.text == value.text
                })
                index >= 0 && (state.nowTagIndex = index)
            } else {
                state.tagListData.length >= 16 && state.tagListData.splice(1, 1)
                state.tagListData.push(value)
                state.nowTagIndex = state.tagListData.length - 1
            }
        },
        setNowTagIndex (state, value) {
            state.nowTagIndex = value
        },
        removeTagItem (state, text) {
            let index = _.findIndex(state.tagListData, (o) => {
                return o.text == text.text
            })
            index >= 0 && state.tagListData.splice(index, 1)
        },
        changeName (state, value) {
            state.test = value
        },
        changeMenu (state, value) {
            switch (value['field']) {
                case 'purchase':
                    state.menuData.purchase = value['value']
                    break
                default:
                    break
            }
        }
    }
})

export default store
