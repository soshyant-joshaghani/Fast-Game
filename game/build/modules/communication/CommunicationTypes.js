export var CommType;
(function (CommType) {
    CommType[CommType["CHAT"] = 1] = "CHAT";
    CommType[CommType["EMOTE"] = 2] = "EMOTE";
    CommType[CommType["REACTION"] = 3] = "REACTION";
    CommType[CommType["QUICK"] = 4] = "QUICK";
    CommType[CommType["TEAM_CHAT"] = 5] = "TEAM_CHAT";
    CommType[CommType["PROXIMITY"] = 6] = "PROXIMITY";
})(CommType || (CommType = {}));
