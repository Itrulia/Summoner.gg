/// <reference path='../_reference.d.ts' />

module Summoner {
    'use strict';
    // @ngInject

    export class SummonerChampionsController {
        public loading = true;
        public error = false;
        public champions = [];

        constructor(private $scope, private $q:angular.IQService, private SummonerService:App.SummonerService, public summoner:any) {
            this.SummonerService.getMatches(this.summoner.id)
                .then((matches:any) => {
                    var champions:any = _.groupBy(matches, 'champion');
                    champions = _.map(champions, function (champion:any) {
                        return {
                            championId: champion[0].champion,
                            total: champion.length
                        }
                    });

                    this.SummonerService.setCounterSynergyStaticData(champions);
                    this.champions = _.orderBy(champions, ['total', 'championId'], ['desc', 'desc']);
                })
                .catch(() => {
                    this.error = true;
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
}
