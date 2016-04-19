/// <reference path='../../_reference.d.ts' />

module Summoner {
    'use strict';

    export class SummonerMatchesAgainstComponent {
        public bindings = {summoner: '<', champion: '<'};
        public templateUrl = 'summoner/matches.against.html';
        public controller = 'SummonerMatchesAgainstController as ctrl';
    }

    // @ngInject
    export class SummonerMatchesAgainstController {
        public loading = true;
        public matches = {};
        public summoner:any;
        public champion:any;
        public championArray:any;

        constructor(
            private $q:angular.IQService,
            private $state:any,
            private $stateParams:any,
            private MatchService:App.MatchService,
            private SummonerService:App.SummonerService,
            private StaticService:App.StaticService
        ) {
            this.getMatches();
            this.getChampions();
        }

        private getChampions() {
            this.StaticService.getChampions().then((champions:any) => {
                this.championArray = _.sortBy(champions, 'name');
            });
        }

        public selectChampion(champion:any) {
            this.$state.go('summoner.matches.against', {championId: champion.name, matchIds: null});
        }

        private getMatches() {
            let promise:any;

            if (this.$stateParams.matchIds !== null) {
                promise = this.$q.when(this.$stateParams.matchIds);
            } else {
                if (this.$stateParams.matchIds !== null) {
                    promise = this.$q.when(this.$stateParams.matchIds);
                } else {
                    promise = this.SummonerService.getCounters(this.summoner.id)
                        .then((counters:any) => {
                            let counter = _.filter(counters, {championId: this.champion.id})[0];

                            if (_.isUndefined(counter)) {
                                return [];
                            }

                            return counter.matchIds;
                        });
                }
            }

            promise
                .then((matchIds:Array<any>) => {
                    let matchPromises = [];

                    _.forEach(matchIds, (matchId, index) => {
                        let promise = this.MatchService.getMatchForSummoner(matchId, this.summoner.id).then((match) => {
                            this.matches[index] = match;
                        });

                        matchPromises.push(promise);
                    });

                    return this.$q.all(matchPromises);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
}
