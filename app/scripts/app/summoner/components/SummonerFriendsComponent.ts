'use strict';

@Component('summoner.components', 'summonerFriends', {
    bindings: {summoner: '<'},
    templateUrl: 'summoner/components/summoner-friends.html',
    controllerAs: 'ctrl',
})
class SummonerFriendsController {
    public summoner:any;
    public friends:any;
    public loading = true;

    // @ngInject
    public constructor(protected SummonerService:App.SummonerService) {
        this.SummonerService.getFriends(this.summoner.id)
            .then((friends:any[]) => {
                let summonerIds:any = _.map(friends, (friend) => {
                    return friend.summonerId;
                });

                if (!summonerIds.length) return;

                return this.SummonerService.getSummoner(summonerIds).then((summoners:any) => {

                    if (!_.isArray(summonerIds)) {
                        summoners = [summoners];
                    }

                    _.forEach(summoners, (summoner:any) => {
                        friends[summoner.id].summoner = summoner;
                    });

                    this.friends = _.orderBy(_.values(friends), ['games', 'percent'], ['desc', 'desc']);
                });
            })
            .finally(() => {
                this.loading = false;
            });
    }
}