import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state : () => ({ 
	active: false,
	progress: false,
 }),
	actions: {
		start() {
			this.progress = true;
			setTimeout(() => {
				if(this.progress ) {
					this.active = true;
				}
			}, 200)
		},
    	end() {
			this.active = false;
			this.progress = false;
		},
	}
});
