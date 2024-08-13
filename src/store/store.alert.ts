import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
  state : () => ({ 
    active: false,
    info: {},
  }),
	actions: {
		open(info:object) {
      let $scope = this;
			$scope.active = true;
      $scope.info = info;
		},
    close() {
			this.active = false;
      this.info = {};
		},
	}
});

