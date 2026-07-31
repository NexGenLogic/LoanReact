 import PixiService from "@/services/pixi.service"

const initialState = { mainCategory: null };

export const main_category = {
    namespaced: true,
    state: initialState,
    actions: {
        async getMain({ commit }) {
            const mainCategory = await PixiService.getMainCat();
            commit('success', mainCategory);
        },
    },
    mutations: {
        success(state, mainCategory) {
            state.mainCategory = mainCategory;
        },
    },
    getters: {
        getmainCategory(state){
            return state.mainCategory
        },
       
    }
}