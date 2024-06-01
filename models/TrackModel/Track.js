"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Track {
    constructor(trackId, title, description, pathSupervisorID) {
        this.trackId = trackId;
        this.title = title;
        this.description = description;
        this.pathSupervisorID = pathSupervisorID;
        this.trackImage = null;
        this.courses = [];
    }
}
exports.default = Track;
